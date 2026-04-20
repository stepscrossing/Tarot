import { TarotCard } from './types';

// Using Wikimedia Commons Special:FilePath redirection for stable, high-quality RWS images
// This avoids needing to know the exact hash path of the files.
const IMG_BASE_URL = 'https://commons.wikimedia.org/wiki/Special:FilePath';

// Helper for Major Arcana: RWS1909_-_00_Fool.jpeg
const getMajorImage = (id: string, nameEn: string) => {
  const numPart = id.slice(1); // '00', '01' ... '21'
  // Remove "The " prefix for filename matching (e.g., "The Fool" -> "Fool")
  let namePart = nameEn.replace(/^The\s+/, '');
  // Replace spaces with underscores
  namePart = namePart.replace(/\s+/g, '_');
  
  return `${IMG_BASE_URL}/RWS1909_-_${numPart}_${namePart}.jpeg`;
};

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 'm00', nameEn: 'The Fool', nameZh: '愚者', type: 'major', image: getMajorImage('m00', 'The Fool') },
  { id: 'm01', nameEn: 'The Magician', nameZh: '魔术师', type: 'major', image: getMajorImage('m01', 'The Magician') },
  { id: 'm02', nameEn: 'The High Priestess', nameZh: '女祭司', type: 'major', image: getMajorImage('m02', 'The High Priestess') },
  { id: 'm03', nameEn: 'The Empress', nameZh: '皇后', type: 'major', image: getMajorImage('m03', 'The Empress') },
  { id: 'm04', nameEn: 'The Emperor', nameZh: '皇帝', type: 'major', image: getMajorImage('m04', 'The Emperor') },
  { id: 'm05', nameEn: 'The Hierophant', nameZh: '教皇', type: 'major', image: getMajorImage('m05', 'The Hierophant') },
  { id: 'm06', nameEn: 'The Lovers', nameZh: '恋人', type: 'major', image: getMajorImage('m06', 'The Lovers') },
  { id: 'm07', nameEn: 'The Chariot', nameZh: '战车', type: 'major', image: getMajorImage('m07', 'The Chariot') },
  { id: 'm08', nameEn: 'Strength', nameZh: '力量', type: 'major', image: getMajorImage('m08', 'Strength') },
  { id: 'm09', nameEn: 'The Hermit', nameZh: '隐士', type: 'major', image: getMajorImage('m09', 'The Hermit') },
  { id: 'm10', nameEn: 'Wheel of Fortune', nameZh: '命运之轮', type: 'major', image: getMajorImage('m10', 'Wheel of Fortune') },
  { id: 'm11', nameEn: 'Justice', nameZh: '正义', type: 'major', image: getMajorImage('m11', 'Justice') },
  { id: 'm12', nameEn: 'The Hanged Man', nameZh: '倒吊人', type: 'major', image: getMajorImage('m12', 'The Hanged Man') },
  { id: 'm13', nameEn: 'Death', nameZh: '死神', type: 'major', image: getMajorImage('m13', 'Death') },
  { id: 'm14', nameEn: 'Temperance', nameZh: '节制', type: 'major', image: getMajorImage('m14', 'Temperance') },
  { id: 'm15', nameEn: 'The Devil', nameZh: '恶魔', type: 'major', image: getMajorImage('m15', 'The Devil') },
  { id: 'm16', nameEn: 'The Tower', nameZh: '高塔', type: 'major', image: getMajorImage('m16', 'The Tower') },
  { id: 'm17', nameEn: 'The Star', nameZh: '星星', type: 'major', image: getMajorImage('m17', 'The Star') },
  { id: 'm18', nameEn: 'The Moon', nameZh: '月亮', type: 'major', image: getMajorImage('m18', 'The Moon') },
  { id: 'm19', nameEn: 'The Sun', nameZh: '太阳', type: 'major', image: getMajorImage('m19', 'The Sun') },
  { id: 'm20', nameEn: 'Judgement', nameZh: '审判', type: 'major', image: getMajorImage('m20', 'Judgement') },
  { id: 'm21', nameEn: 'The World', nameZh: '世界', type: 'major', image: getMajorImage('m21', 'The World') },
];

const suits: Array<'wands' | 'cups' | 'swords' | 'pentacles'> = ['wands', 'cups', 'swords', 'pentacles'];
const suitNamesZh = { wands: '权杖', cups: '圣杯', swords: '宝剑', pentacles: '星币' };

// Helper for Minor Arcana images: RWS1909_-_Wands_01.jpeg
const getMinorImage = (suit: string, number: number) => {
  const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
  const suffix = String(number).padStart(2, '0');
  return `${IMG_BASE_URL}/RWS1909_-_${suitName}_${suffix}.jpeg`;
};

export const MINOR_ARCANA: TarotCard[] = [];

suits.forEach(suit => {
  for (let i = 1; i <= 14; i++) {
    let nameEn = '';
    let nameZh = '';
    const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
    const suitZh = suitNamesZh[suit];

    if (i <= 10) {
      nameEn = `${i === 1 ? 'Ace' : i} of ${suitName}`;
      nameZh = `${suitZh}${i === 1 ? '一' : i}`; // Changed '首牌' to '一' for consistency or keep '首牌'
      if (i === 1) nameZh = `${suitZh}首牌`;
    } else {
      const courts = ['Page', 'Knight', 'Queen', 'King'];
      const courtsZh = ['侍从', '骑士', '皇后', '国王'];
      nameEn = `${courts[i - 11]} of ${suitName}`;
      nameZh = `${suitZh}${courtsZh[i - 11]}`;
    }

    // Special fix for "Strength" and "Justice" numbering variations if needed, 
    // but here we are just generating Minor Arcana.
    
    // Fix: Some specific cards might have different extensions or case in some archives.
    // But Sacred Texts is usually lowercase .jpg.

    MINOR_ARCANA.push({
      id: `${suit[0]}${i}`,
      nameEn,
      nameZh,
      type: 'minor',
      suit,
      number: i,
      image: getMinorImage(suit, i)
    });
  }
});

export const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const TOTAL_CARDS = ALL_CARDS.length;