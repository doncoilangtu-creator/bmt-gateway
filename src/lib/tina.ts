import projectJson from '../../content/settings/project.json';
import homeJson from '../../content/pages/home.json';
import masterplanJson from '../../content/amenities/masterplan.json';

import plan1BrPlus from '../../content/residences/1br-plus.json';
import plan2BrB1 from '../../content/residences/2br-b1.json';
import plan2BrB2 from '../../content/residences/2br-b2.json';
import plan3Br from '../../content/residences/3br.json';

import shophouseJson from '../../content/townhouses/shophouse.json';
import townhouseJson from '../../content/townhouses/townhouse.json';

import type { ResidenceUnit, LowriseProduct } from '../data/narrative';

export interface TinaProjectSettings {
  name: string;
  shortName: string;
  kicker: string;
  title: string;
  subtitle: string;
  location: string;
  developer: string;
  hotline: string;
  email: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface TinaHomePage {
  hero: {
    lineLeft: string;
    lineRight: string;
    mediaImage: string;
    ctaText: string;
    metaLocation: string;
    metaCity: string;
  };
  manifesto: {
    editorial: string;
    title: string;
    items: Array<{ index: string; href: string; text: string }>;
  };
  overview: {
    editorial: string;
    title: string;
    image: string;
    facts: Array<{ value: string; label: string }>;
    profile: Array<{ label: string; value: string }>;
  };
  identity: {
    editorial: string;
    title: string;
    description: string;
    image: string;
  };
  cinematicVideo: {
    videoSrc: string;
    poster: string;
    caption: string;
  };
  identitySlides?: Array<{ src: string; alt: string }>;
  amenitySlides?: Array<{ src: string; alt: string }>;
}

export const projectSettings = projectJson as TinaProjectSettings;
export const homePageData = homeJson as TinaHomePage;
export const residencesData = [plan1BrPlus, plan2BrB1, plan2BrB2, plan3Br] as ResidenceUnit[];
export const townhousesData = [shophouseJson, townhouseJson] as LowriseProduct[];
export const amenitiesData = masterplanJson;
