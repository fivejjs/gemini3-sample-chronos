import { HistoricalScene } from './types';

export const SCENES: HistoricalScene[] = [
  {
    id: 'vikings',
    name: 'Viking Warrior',
    description: 'Brave the icy fjords as a legendary Norse warrior.',
    era: '800 AD',
    promptModifier: 'Transform this person into a fierce Viking warrior wearing fur and leather armor, standing on the deck of a longship in a misty fjord. High quality, cinematic lighting, historical drama.',
    thumbnail: 'https://picsum.photos/id/1015/300/200'
  },
  {
    id: 'egypt',
    name: 'Pharaoh of Egypt',
    description: 'Rule the Nile from the golden throne of ancient Thebes.',
    era: '1300 BC',
    promptModifier: 'Transform this person into an Ancient Egyptian Pharaoh wearing gold jewelry, a nemes headdress, and fine linen, standing inside a grand temple with hieroglyphs. Golden lighting, opulent atmosphere.',
    thumbnail: 'https://picsum.photos/id/1040/300/200'
  },
  {
    id: 'victorian',
    name: 'Victorian Aristocrat',
    description: 'Walk the foggy streets of London in high society fashion.',
    era: '1890',
    promptModifier: 'Transform this person into a Victorian aristocrat wearing a formal suit or elegant gown, top hat or bonnet, standing on a cobblestone street in London with gas lamps and fog. Sepia tones, vintage photography style.',
    thumbnail: 'https://picsum.photos/id/1060/300/200'
  },
  {
    id: 'cyberpunk',
    name: 'Neon Future',
    description: 'Visit the year 2077 in a high-tech metropolis.',
    era: '2077',
    promptModifier: 'Transform this person into a cyberpunk character with glowing tech implants, wearing futuristic streetwear, standing in a neon-lit rainy city street at night. Cyberpunk aesthetic, neon blue and pink lighting.',
    thumbnail: 'https://picsum.photos/id/1029/300/200'
  },
  {
    id: 'roaring20s',
    name: 'Roaring 20s',
    description: 'Join the party at a glamorous Gatsby-style gala.',
    era: '1920',
    promptModifier: 'Transform this person into a 1920s flapper or gentleman wearing a tuxedo or beaded dress, holding a glass of champagne at an art deco party. Black and white photography style, high contrast, glamorous.',
    thumbnail: 'https://picsum.photos/id/1011/300/200'
  },
  {
    id: 'samurai',
    name: 'Feudal Samurai',
    description: 'Defend your honor in the cherry blossom gardens of Kyoto.',
    era: '1600',
    promptModifier: 'Transform this person into a Japanese Samurai wearing detailed heavy armor, katana at hip, standing in a garden with falling cherry blossoms. Traditional Japanese art style influence, serene yet powerful.',
    thumbnail: 'https://picsum.photos/id/1018/300/200'
  }
];

export const MODEL_IDS = {
  EDITING: 'gemini-2.5-flash-image',
  ANALYSIS: 'gemini-3-pro-preview'
};