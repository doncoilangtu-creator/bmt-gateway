/**
 * Visual In-Place Editor for EraCity (Có xác thực Đăng nhập Quản trị viên)
 * Chỉ quản trị viên đã đăng nhập mới có quyền sửa text, đổi ảnh và kéo ghim.
 */

interface PendingChanges {
  home: Record<string, unknown>;
  settings: Record<string, unknown>;
  pins: Record<string, { left: string; top: string }>;
}

const pending: PendingChanges = {
  home: {},
  settings: {},
  pins: {},
};

let isAuthenticated = false;
let currentUser = '';
let isEditing = false;
let dirtyCount = 0;

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.');
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (current[p] === undefined || typeof current[p] !== 'object' || current[p] === null) {
      current[p] = {};
    }
    current = current[p] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}

const EDITABLE_SELECTORS = [
  '[data-editable-key]',
  'h1', 'h2', 'h3', 'h4',
  '.v2-editorial',
  '.editorial-line',
  '.chapter-lead',
  '.v2-identity-copy p',
  '.v2-hero p',
  '.v2-hero-cta',
  '.v2-hero-meta span',
  '.v2-manifesto-item strong',
  '.v2-overview-panel h2',
  '.v2-overview-panel .v2-editorial',
  '.v2-overview-facts strong',
  '.v2-overview-facts span',
  '.v2-profile div dt',
  '.v2-profile div dd',
  '.location-copy h2',
  '.location-copy .editorial-line',
  '.location-times strong',
  '.location-times span',
  '.cinematic-caption',
  '.amenity-masterplan-heading h2',
  '.amenity-masterplan-heading p',
  '.amenity-masterplan-heading .v2-editorial',
  '.amenity-rail-intro strong',
  '.amenity-rail-intro span',
  '.amenity-group-summary',
  '.amenity-list button',
  '.v2-amenities-title h2',
  '.v2-amenities-title .v2-editorial',
  '.v2-collection-head h2',
  '.v2-collection-head p',
  '.residence-plan-label',
  '.residence-plan-meta strong',
  '.residence-plan-meta span',
  '.v2-inquiry-copy h2',
  '.v2-inquiry-copy p',
  '.footer-brand strong',
  '.footer-brand span',
  '.footer-contact p',
  '.footer-note'
].join(', ');

function getElementPath(el: HTMLElement): string {
  if (el.getAttribute('data-editable-key')) {
    return el.getAttribute('data-editable-key')!;
  }
  const parent = el.closest('section, footer, header') || el.parentElement;
  const sectionId = parent?.id || parent?.className.split(' ')[0] || 'sec';
  const tag = el.tagName.toLowerCase();
  const index = Array.from(parent?.querySelectorAll(tag) || []).indexOf(el);
  return `customTexts.${sectionId}_${tag}_${index}`;
}

export async function initVisualEditor() {
  if (typeof window === 'undefined') return;

  createToolbar();
  setupEditableElements();
  setupDraggablePins();

  // Kiểm tra phiên đăng nhập với server
  await checkAuthStatus();
}

async function checkAuthStatus() {
  const isLocalhost =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  if (isLocalhost) {
    isAuthenticated = true;
    currentUser = 'admin (local)';
    updateToolbarUI();
    if (localStorage.getItem('eracity_visual_edit') === '1') {
      isEditing = true;
      enableEditMode();
      updateToolbarUI();
    }
    return;
  }

  try {
    const token = sessionStorage.getItem('eracity_admin_token') || '';
    const res = await fetch('/api/auth/check', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await res.json();
    if (data.authenticated) {
      isAuthenticated = true;
      currentUser = data.username || 'admin';
      updateToolbarUI();
      if (localStorage.getItem('eracity_visual_edit') === '1') {
        isEditing = true;
        enableEditMode();
        updateToolbarUI();
      }
    } else {
      isAuthenticated = false;
      currentUser = '';
      disableEditMode();
      updateToolbarUI();
    }
  } catch (e) {
    isAuthenticated = false;
    updateToolbarUI();
  }
}

function createToolbar() {
  const existing = document.getElementById('visual-editor-toolbar');
  if (existing) return;

  const bar = document.createElement('div');
  bar.id = 'visual-editor-toolbar';
  bar.innerHTML = `
    <div class="ve-bar">
      <div class="ve-status">
        <span class="ve-dot"></span>
        <strong class="ve-title">Visual Editor</strong>
        <span class="ve-dirty-badge" style="display:none;">0 thay đổi</span>
      </div>
      <div class="ve-actions">
        <!-- Nút khi chưa đăng nhập -->
        <button type="button" class="ve-btn ve-login-btn">
          🔒 Đăng nhập Admin
        </button>

        <!-- Nút khi đã đăng nhập -->
        <span class="ve-user-badge" style="display:none;"></span>
        <button type="button" class="ve-btn ve-toggle" style="display:none;" title="Bật/Tắt chế độ sửa">
          ✏️ Chỉnh sửa trực quan
        </button>
        <button type="button" class="ve-btn ve-save" style="display:none;">
          💾 Lưu vào dự án
        </button>
        <button type="button" class="ve-btn ve-logout-btn" style="display:none;" title="Đăng xuất">
          🚪 Thoát
        </button>
      </div>
    </div>
    <div id="ve-toast" class="ve-toast"></div>
  `;

  document.body.appendChild(bar);

  const loginBtn = bar.querySelector('.ve-login-btn') as HTMLButtonElement;
  const toggleBtn = bar.querySelector('.ve-toggle') as HTMLButtonElement;
  const saveBtn = bar.querySelector('.ve-save') as HTMLButtonElement;
  const logoutBtn = bar.querySelector('.ve-logout-btn') as HTMLButtonElement;

  loginBtn?.addEventListener('click', () => {
    openLoginModal();
  });

  toggleBtn?.addEventListener('click', () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    isEditing = !isEditing;
    localStorage.setItem('eracity_visual_edit', isEditing ? '1' : '0');
    localStorage.setItem('bmt_amenity_edit', isEditing ? '1' : '0');
    if (isEditing) {
      enableEditMode();
      toggleBtn.textContent = '✕ Tắt sửa';
      saveBtn.style.display = 'inline-flex';
    } else {
      disableEditMode();
      toggleBtn.textContent = '✏️ Chỉnh sửa trực quan';
      saveBtn.style.display = 'none';
    }
  });

  saveBtn?.addEventListener('click', async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    await saveAllChanges();
  });

  logoutBtn?.addEventListener('click', async () => {
    await handleLogout();
  });
}

function updateToolbarUI() {
  const bar = document.getElementById('visual-editor-toolbar');
  if (!bar) return;

  const loginBtn = bar.querySelector('.ve-login-btn') as HTMLElement;
  const userBadge = bar.querySelector('.ve-user-badge') as HTMLElement;
  const toggleBtn = bar.querySelector('.ve-toggle') as HTMLElement;
  const saveBtn = bar.querySelector('.ve-save') as HTMLElement;
  const logoutBtn = bar.querySelector('.ve-logout-btn') as HTMLElement;
  const dot = bar.querySelector('.ve-dot') as HTMLElement;

  if (isAuthenticated) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userBadge) {
      userBadge.textContent = `Admin: ${currentUser}`;
      userBadge.style.display = 'inline-block';
    }
    if (toggleBtn) {
      toggleBtn.style.display = 'inline-flex';
      toggleBtn.textContent = isEditing ? '✕ Tắt sửa' : '✏️ Chỉnh sửa trực quan';
    }
    if (saveBtn) {
      saveBtn.style.display = isEditing ? 'inline-flex' : 'none';
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
    if (dot) dot.style.background = '#22c55e';
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userBadge) userBadge.style.display = 'none';
    if (toggleBtn) toggleBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (dot) dot.style.background = '#eab308';
  }
}

function openLoginModal() {
  const existing = document.querySelector('.ve-auth-modal');
  if (existing) return;

  const modal = document.createElement('div');
  modal.className = 've-modal ve-auth-modal';
  modal.innerHTML = `
    <div class="ve-modal-card ve-auth-card">
      <div class="ve-auth-header">
        <span class="ve-auth-icon">🔒</span>
        <h3>Đăng nhập Quản Trị Viên</h3>
        <p>Vui lòng đăng nhập tài khoản quản trị để kích hoạt quyền chỉnh sửa nội dung và ghim bản đồ.</p>
      </div>
      <form class="ve-auth-form">
        <div class="ve-modal-field">
          <label>Tài khoản</label>
          <input type="text" name="username" class="ve-auth-input" placeholder="admin" required autocomplete="username" />
        </div>
        <div class="ve-modal-field">
          <label>Mật khẩu</label>
          <input type="password" name="password" class="ve-auth-input" placeholder="••••••••" required autocomplete="current-password" />
        </div>
        <div class="ve-auth-error" style="display:none;"></div>
        <div class="ve-modal-buttons">
          <button type="button" class="ve-btn-cancel">Hủy</button>
          <button type="submit" class="ve-btn-apply ve-auth-submit">Đăng nhập</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = modal.querySelector('.ve-auth-form') as HTMLFormElement;
  const cancelBtn = modal.querySelector('.ve-btn-cancel') as HTMLButtonElement;
  const submitBtn = modal.querySelector('.ve-auth-submit') as HTMLButtonElement;
  const errorDiv = modal.querySelector('.ve-auth-error') as HTMLElement;

  cancelBtn.onclick = () => modal.remove();

  form.onsubmit = async (ev) => {
    ev.preventDefault();
    errorDiv.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang xác thực...';

    const formData = new FormData(form);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        errorDiv.textContent = data.message || 'Tài khoản hoặc mật khẩu không chính xác.';
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng nhập';
        return;
      }

      // Đăng nhập thành công
      sessionStorage.setItem('eracity_admin_token', data.token);
      isAuthenticated = true;
      currentUser = data.username || username;
      modal.remove();

      // Tự động bật chế độ sửa
      isEditing = true;
      localStorage.setItem('eracity_visual_edit', '1');
      enableEditMode();
      updateToolbarUI();

      showToast(`✓ Chào mừng ${currentUser}! Quyền chỉnh sửa đã được kích hoạt.`);
    } catch (err) {
      errorDiv.textContent = 'Không thể kết nối tới máy chủ xác thực.';
      errorDiv.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Đăng nhập';
    }
  };
}

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (e) {}

  sessionStorage.removeItem('eracity_admin_token');
  localStorage.removeItem('eracity_visual_edit');
  isAuthenticated = false;
  currentUser = '';
  isEditing = false;
  disableEditMode();
  updateToolbarUI();
  showToast('Đã đăng xuất khỏi chế độ quản trị.');
}

function updateDirtyCount() {
  const count =
    Object.keys(pending.home).length +
    Object.keys(pending.settings).length +
    Object.keys(pending.pins).length;
  dirtyCount = count;
  const badge = document.querySelector('.ve-dirty-badge') as HTMLElement;
  if (badge) {
    if (count > 0) {
      badge.textContent = `${count} thay đổi`;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function showToast(message: string, isError = false) {
  const toast = document.getElementById('ve-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `ve-toast is-visible ${isError ? 'is-error' : 'is-success'}`;
  setTimeout(() => {
    toast.className = 've-toast';
  }, 4000);
}

function enableEditMode() {
  if (!isAuthenticated) return;
  document.body.classList.add('visual-edit-mode');
  document.body.classList.add('amenity-edit-mode');

  document.querySelectorAll<HTMLElement>(EDITABLE_SELECTORS).forEach((el) => {
    el.contentEditable = 'true';
    el.setAttribute('spellcheck', 'false');
  });
  const amenityToolbar = document.querySelector('[data-edit-toolbar]') as HTMLElement;
  if (amenityToolbar) amenityToolbar.hidden = false;
  showToast('Đã bật chế độ sửa! Nhấp vào bất kỳ chữ nào để sửa, bấm giữ ghim để kéo thả tự do.');
}

function disableEditMode() {
  document.body.classList.remove('visual-edit-mode');
  document.body.classList.remove('amenity-edit-mode');

  document.querySelectorAll<HTMLElement>(EDITABLE_SELECTORS).forEach((el) => {
    el.contentEditable = 'false';
  });
  const amenityToolbar = document.querySelector('[data-edit-toolbar]') as HTMLElement;
  if (amenityToolbar) amenityToolbar.hidden = true;
}

function setupEditableElements() {
  document.addEventListener('click', (e) => {
    if (!isEditing || !isAuthenticated) return;
    const target = e.target as HTMLElement;
    if (!target) return;

    if (target.closest('[data-editable-img]')) return;
    if (target.closest('[data-amenity-pin], [data-map-pin], [data-map-label]')) return;
    if (target.closest('#visual-editor-toolbar, .ve-modal')) return;

    if (target.innerText && target.innerText.trim().length > 0) {
      target.contentEditable = 'true';
      target.setAttribute('spellcheck', 'false');
    }
  });

  document.addEventListener('input', (e) => {
    if (!isEditing || !isAuthenticated) return;
    const target = e.target as HTMLElement;
    if (!target || !target.isContentEditable) return;

    const path = getElementPath(target);
    const val = target.innerText.trim();

    if (path.startsWith('settings.')) {
      const field = path.replace('settings.', '');
      setNestedValue(pending.settings, field, val);
    } else {
      setNestedValue(pending.home, path, val);
    }
    updateDirtyCount();
  });

  document.addEventListener('click', (e) => {
    if (!isEditing || !isAuthenticated) return;
    const target = (e.target as HTMLElement).closest('[data-editable-img]') as HTMLElement;
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    const imgKey = target.getAttribute('data-editable-img');
    openImageModal((newSrc) => {
      if (target.tagName === 'IMG') {
        (target as HTMLImageElement).src = newSrc;
      } else if (target.tagName === 'VIDEO') {
        (target as HTMLVideoElement).poster = newSrc;
      } else {
        const innerImg = target.querySelector('img');
        if (innerImg) innerImg.src = newSrc;
      }

      if (imgKey === 'hero') setNestedValue(pending.home, 'hero.mediaImage', newSrc);
      if (imgKey === 'landscape') setNestedValue(pending.home, 'overview.image', newSrc);
      if (imgKey === 'facade' || imgKey === 'identity') setNestedValue(pending.home, 'identity.image', newSrc);
      if (imgKey === 'poster') setNestedValue(pending.home, 'cinematicVideo.poster', newSrc);

      updateDirtyCount();
      showToast('Đã đổi ảnh trực tiếp!');
    });
  });
}

function openImageModal(onSelect: (url: string) => void) {
  const modal = document.createElement('div');
  modal.className = 've-modal';
  modal.innerHTML = `
    <div class="ve-modal-card">
      <h3>Thay đổi hình ảnh</h3>
      <p>Chọn ảnh từ máy tính hoặc dán URL ảnh có sẵn:</p>
      <div class="ve-modal-field">
        <label>📁 Tải ảnh mới từ máy tính:</label>
        <input type="file" accept="image/*" class="ve-file-input" />
      </div>
      <div class="ve-modal-field">
        <label>🔗 Hoặc dán đường dẫn ảnh (/images/...):</label>
        <input type="text" class="ve-url-input" placeholder="/images/edited/hero.webp" />
      </div>
      <div class="ve-modal-buttons">
        <button type="button" class="ve-btn-cancel">Hủy</button>
        <button type="button" class="ve-btn-apply">Áp dụng ảnh</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const fileInput = modal.querySelector('.ve-file-input') as HTMLInputElement;
  const urlInput = modal.querySelector('.ve-url-input') as HTMLInputElement;
  const cancelBtn = modal.querySelector('.ve-btn-cancel') as HTMLButtonElement;
  const applyBtn = modal.querySelector('.ve-btn-apply') as HTMLButtonElement;

  cancelBtn.onclick = () => modal.remove();

  applyBtn.onclick = () => {
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const base64 = ev.target?.result as string;
        onSelect(base64);
        modal.remove();
      };
      reader.readAsDataURL(file);
    } else if (urlInput.value.trim()) {
      onSelect(urlInput.value.trim());
      modal.remove();
    }
  };
}

function setupDraggablePins() {
  const bindPin = (pin: HTMLElement, pinId: string) => {
    let isDragging = false;
    let parent: HTMLElement | null = null;
    let parentRect: DOMRect | null = null;
    let startMouseX = 0;
    let startMouseY = 0;
    let startLeftPct = 50;
    let startTopPct = 50;

    const onPointerMove = (moveEv: PointerEvent) => {
      if (!isDragging || !parent || !parentRect) return;
      moveEv.preventDefault();

      const dx = moveEv.clientX - startMouseX;
      const dy = moveEv.clientY - startMouseY;

      const deltaLeftPct = (dx / parentRect.width) * 100;
      const deltaTopPct = (dy / parentRect.height) * 100;

      const leftPct = Math.max(0.2, Math.min(99.8, startLeftPct + deltaLeftPct)).toFixed(4) + '%';
      const topPct = Math.max(0.2, Math.min(99.8, startTopPct + deltaTopPct)).toFixed(4) + '%';

      pin.style.setProperty('left', leftPct, 'important');
      pin.style.setProperty('top', topPct, 'important');
      pin.style.setProperty('--pin-left', leftPct);
      pin.style.setProperty('--pin-top', topPct);

      pending.pins[pinId] = { left: leftPct, top: topPct };
      updateDirtyCount();
    };

    const onPointerEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      pin.classList.remove('is-dragging');

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerEnd);
      window.removeEventListener('pointercancel', onPointerEnd);

      const currentLeft = pin.style.left;
      const currentTop = pin.style.top;

      // 1. Lưu tức thì vào localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('eracity_saved_pins') || '{}');
        saved[pinId] = { left: currentLeft, top: currentTop };
        localStorage.setItem('eracity_saved_pins', JSON.stringify(saved));
        localStorage.setItem('bmt_amenity_pins', JSON.stringify(saved));
        window.dispatchEvent(new CustomEvent('eracity:pins-updated'));
      } catch (e) {}

      // 2. Tự động gửi API lưu ngầm vào file hệ thống (Auto-Save on Drop)
      fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'pins', data: { [pinId]: { left: currentLeft, top: currentTop } } }),
      }).catch(() => {});

      const hint = document.querySelector('[data-edit-hint]');
      if (hint) hint.textContent = `✓ Đã lưu vị trí ghim ${pinId}!`;
      showToast(`✓ Đã lưu vị trí ghim ${pinId} → ${currentLeft}, ${currentTop}`);
    };
    pin.addEventListener('pointerdown', (e) => {
      if (!isEditing || !isAuthenticated) return;
      e.preventDefault();
      e.stopPropagation();

      parent = pin.parentElement;
      if (!parent) return;
      parentRect = parent.getBoundingClientRect();

      startMouseX = e.clientX;
      startMouseY = e.clientY;

      const curLeftStr = pin.style.left || pin.style.getPropertyValue('--pin-left') || getComputedStyle(pin).left;
      const curTopStr = pin.style.top || pin.style.getPropertyValue('--pin-top') || getComputedStyle(pin).top;

      if (curLeftStr.includes('%')) {
        startLeftPct = parseFloat(curLeftStr);
      } else {
        startLeftPct = (parseFloat(curLeftStr) / parentRect.width) * 100;
      }

      if (curTopStr.includes('%')) {
        startTopPct = parseFloat(curTopStr);
      } else {
        startTopPct = (parseFloat(curTopStr) / parentRect.height) * 100;
      }

      isDragging = true;
      pin.classList.add('is-dragging');

      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerEnd);
      window.addEventListener('pointercancel', onPointerEnd);
    });
  };

  document.querySelectorAll<HTMLElement>('[data-amenity-pin]').forEach((pin) => {
    const pinId = pin.getAttribute('data-amenity-pin') || '';
    bindPin(pin, pinId);
  });

  const projectPin = document.querySelector<HTMLElement>('[data-map-pin]');
  const pinPulse = document.querySelector<HTMLElement>('[data-map-pin-pulse]');
  if (projectPin) {
    bindPin(projectPin, 'location_project');
    if (pinPulse) {
      window.addEventListener('pointermove', () => {
        if (projectPin.classList.contains('is-dragging')) {
          pinPulse.style.setProperty('left', projectPin.style.left, 'important');
          pinPulse.style.setProperty('top', projectPin.style.top, 'important');
          pinPulse.style.setProperty('--pin-left', projectPin.style.left);
          pinPulse.style.setProperty('--pin-top', projectPin.style.top);
        }
      });
    }
  }

  document.querySelectorAll<HTMLElement>('[data-map-label]').forEach((label, idx) => {
    bindPin(label, `map_label_${idx}`);
  });

  // Kết nối các nút bấm trên thanh công cụ của bản đồ Masterplan
  const amenityToolbar = document.querySelector('[data-edit-toolbar]') as HTMLElement;
  if (amenityToolbar) {
    if (isEditing) amenityToolbar.hidden = false;
    const saveBtn = amenityToolbar.querySelector('[data-edit-save]') as HTMLButtonElement;
    const exportBtn = amenityToolbar.querySelector('[data-edit-export]') as HTMLButtonElement;
    const resetBtn = amenityToolbar.querySelector('[data-edit-reset]') as HTMLButtonElement;
    const hint = amenityToolbar.querySelector('[data-edit-hint]') as HTMLElement;

    saveBtn?.addEventListener('click', async () => {
      if (hint) hint.textContent = '⏳ Đang lưu...';
      saveBtn.disabled = true;
      await saveAllChanges();
      if (hint) hint.textContent = '✓ Đã lưu vị trí ghim thành công!';
      saveBtn.disabled = false;
    });

    exportBtn?.addEventListener('click', async () => {
      const saved = JSON.parse(localStorage.getItem('eracity_saved_pins') || '{}');
      const json = JSON.stringify(saved, null, 2);
      try {
        await navigator.clipboard.writeText(json);
        if (hint) hint.textContent = '✓ Đã copy JSON vào clipboard!';
      } catch (e) {
        if (hint) hint.textContent = json;
      }
    });

    resetBtn?.addEventListener('click', () => {
      localStorage.removeItem('eracity_saved_pins');
      localStorage.removeItem('bmt_amenity_pins');
      window.location.reload();
    });
  }
}

async function saveAllChanges() {
  if (!isAuthenticated) {
    openLoginModal();
    return;
  }

  const saveBtn = document.querySelector('.ve-save') as HTMLButtonElement;
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = '⏳ Đang lưu...';
  }

  // --- DOM HARVESTING: Thu thập trực tiếp toàn bộ dữ liệu đang hiển thị trên màn hình ---
  // 1. Quét tất cả các thẻ có data-editable-key
  document.querySelectorAll<HTMLElement>('[data-editable-key]').forEach((el) => {
    const key = el.getAttribute('data-editable-key');
    if (!key) return;
    const val = el.innerText.trim();
    if (key.startsWith('settings.')) {
      setNestedValue(pending.settings, key.replace('settings.', ''), val);
    } else {
      setNestedValue(pending.home, key, val);
    }
  });

  // 2. Quét tất cả các ghim tiện ích trên bản đồ
  document.querySelectorAll<HTMLElement>('[data-amenity-pin]').forEach((pin) => {
    const pinId = pin.getAttribute('data-amenity-pin');
    if (!pinId) return;
    const left = pin.style.left || pin.style.getPropertyValue('--pin-left');
    const top = pin.style.top || pin.style.getPropertyValue('--pin-top');
    if (left && top) {
      pending.pins[pinId] = { left, top };
    }
  });

  // 3. Quét ảnh editable
  document.querySelectorAll<HTMLElement>('[data-editable-img]').forEach((container) => {
    const key = container.getAttribute('data-editable-img');
    const img = container.tagName === 'IMG' ? (container as HTMLImageElement) : container.querySelector('img');
    const video = container.tagName === 'VIDEO' ? (container as HTMLVideoElement) : container.querySelector('video');
    if (img && img.src) {
      if (key === 'hero') setNestedValue(pending.home, 'hero.mediaImage', img.src);
      if (key === 'landscape') setNestedValue(pending.home, 'overview.image', img.src);
      if (key === 'identity' || key === 'facade') setNestedValue(pending.home, 'identity.image', img.src);
    }
    if (video && video.poster) {
      if (key === 'poster') setNestedValue(pending.home, 'cinematicVideo.poster', video.poster);
    }
  });

  try {
    const token = sessionStorage.getItem('eracity_admin_token') || '';
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const promises: Promise<Response>[] = [];

    if (Object.keys(pending.home).length > 0) {
      promises.push(
        fetch('/api/save-content', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ target: 'home', data: pending.home }),
        })
      );
    }

    if (Object.keys(pending.settings).length > 0) {
      promises.push(
        fetch('/api/save-content', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ target: 'settings', data: pending.settings }),
        })
      );
    }

    if (Object.keys(pending.pins).length > 0) {
      promises.push(
        fetch('/api/save-content', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({ target: 'pins', data: pending.pins }),
        })
      );
    }

    if (promises.length === 0) {
      showToast('Không có thay đổi nào cần lưu.');
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = '💾 Lưu vào dự án';
      }
      return;
    }

    const responses = await Promise.all(promises);
    const anyUnauthorized = responses.some((r) => r.status === 401);
    if (anyUnauthorized) {
      showToast('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.', true);
      isAuthenticated = false;
      disableEditMode();
      updateToolbarUI();
      openLoginModal();
      return;
    }

    pending.home = {};
    pending.settings = {};
    pending.pins = {};
    updateDirtyCount();

    showToast('✓ Đã lưu vĩnh viễn toàn bộ thay đổi vào file dự án!');
  } catch (error) {
    showToast('❌ Có lỗi xảy ra khi lưu thay đổi.', true);
  } finally {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = '💾 Lưu vào dự án';
    }
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisualEditor);
  } else {
    initVisualEditor();
  }
}
