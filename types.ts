
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  content: string;
  isFeatured?: boolean;
  city?: string; // Propriedade para filtragem na categoria "Onde ir"
}

export interface MagazineIssue {
  id: string;
  title: string;
  month: string;
  year: string;
  imageUrl: string;
  coverUrl: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  articlesCount: number;
}

export interface UserStats {
  points: number;
  facetas: number;
  level: 'Bronze' | 'Prata' | 'Ouro' | 'Diamante';
  articlesRead: string[];
  lastCheckIn: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  imageUrl: string;
  category: 'Cupom' | 'Produto' | 'Experiência' | 'Parceiro';
}

export interface BalcaoPost {
  id: string;
  title: string;
  description: string;
  category: 'Empregos' | 'Negócios' | 'Bens/Serviços' | 'Oportunidades';
  author: string;
  contact: string;
  date: string;
  pointsRequired?: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string; // ISO format YYYY-MM-DD
  time: string;
  location: string;
  organizer: string;
  category: 'Cultura' | 'Negócios' | 'Social' | 'Religioso';
}
