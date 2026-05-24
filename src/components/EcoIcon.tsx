import { IonIcon } from '@ionic/react';
import {
  flameOutline,
  leafOutline,
  globeOutline,
  waterOutline,
  flashOutline,
  refreshOutline,
  bicycleOutline,
  bookOutline,
  trophyOutline,
  personOutline,
  locateOutline,
  barChartOutline,
  trendingUpOutline,
  bulbOutline,
  carOutline,
  bagOutline,
  tvOutline,
  restaurantOutline,
  homeOutline,
  lockOpenOutline,
  lockClosedOutline,
  checkmarkCircleOutline,
  starOutline,
  checkmarkOutline,
  ellipseOutline,
  walkOutline,
  diamondOutline
} from 'ionicons/icons';

const emojiMap: Record<string, string> = {
  '\u{1F525}': 'flameOutline',
  '\u{1F331}': 'leafOutline',
  '\u{1F33F}': 'leafOutline',
  '\u{1F30D}': 'globeOutline',
  '\u{1F30E}': 'globeOutline',
  '\u{1F333}': 'leafOutline',
  '\u{1F4A7}': 'waterOutline',
  '\u26A1': 'flashOutline',
  '\u267B': 'refreshOutline',
  '\u{1F6B2}': 'bicycleOutline',
  '\u{1F4D2}': 'bookOutline',
  '\u{1F3C6}': 'trophyOutline',
  '\u{1F464}': 'personOutline',
  '\u{1F3AF}': 'locateOutline',
  '\u{1F4C8}': 'trendingUpOutline',
  '\u{1F4A1}': 'bulbOutline',
  '\u{1F697}': 'carOutline',
  '\u{1F6CD}': 'bagOutline',
  '\u{1F4FA}': 'tvOutline',
  '\u{1F969}': 'restaurantOutline',
  '\u{1F3E0}': 'homeOutline',
  '\u{1F513}': 'lockOpenOutline',
  '\u{1F512}': 'lockClosedOutline',
  '\u2705': 'checkmarkCircleOutline',
  '\u2B50': 'starOutline',
  '\u2713': 'checkmarkOutline',
  '\u25CB': 'ellipseOutline',
  '\u{1F6B6}': 'walkOutline',
  '\u{1F451}': 'diamondOutline',
};

const stripVariationSelector = (s: string) => s.replace(/\uFE0F/g, '').replace(/\u200D.*$/g, '');

const iconMap: Record<string, string> = {
  'flameOutline': flameOutline,
  'leafOutline': leafOutline,
  'globeOutline': globeOutline,
  'waterOutline': waterOutline,
  'flashOutline': flashOutline,
  'refreshOutline': refreshOutline,
  'bicycleOutline': bicycleOutline,
  'bookOutline': bookOutline,
  'trophyOutline': trophyOutline,
  'personOutline': personOutline,
  'locateOutline': locateOutline,
  'barChartOutline': barChartOutline,
  'trendingUpOutline': trendingUpOutline,
  'bulbOutline': bulbOutline,
  'carOutline': carOutline,
  'bagOutline': bagOutline,
  'tvOutline': tvOutline,
  'restaurantOutline': restaurantOutline,
  'homeOutline': homeOutline,
  'lockOpenOutline': lockOpenOutline,
  'lockClosedOutline': lockClosedOutline,
  'checkmarkCircleOutline': checkmarkCircleOutline,
  'starOutline': starOutline,
  'checkmarkOutline': checkmarkOutline,
  'ellipseOutline': ellipseOutline,
  'walkOutline': walkOutline,
  'diamondOutline': diamondOutline,
};

interface EcoIconProps {
  emoji: string;
  className?: string;
}

const EcoIcon: React.FC<EcoIconProps> = ({ emoji, className }) => {
  const key = stripVariationSelector(emoji);
  const iconName = emojiMap[key] || key;
  const icon = iconMap[iconName];
  if (!icon) {
    return <span className={className}>{emoji}</span>;
  }
  return <IonIcon icon={icon} className={className} />;
};

export default EcoIcon;
