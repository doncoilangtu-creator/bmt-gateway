import { FlowField } from '@designcodeio/threeui/components/FlowField';

export default function ManifestoBackground() {
  return (
    <div className="v2-manifesto-canvas-wrap" aria-hidden="true">
      <FlowField
        mode="dark"
        hue={20}
        saturation={0.55}
        brightness={0.8}
        opacity={0.35}
        speed={0.8}
        density={1}
        className="v2-manifesto-canvas"
      />
      <div className="v2-manifesto-mask" />
    </div>
  );
}
