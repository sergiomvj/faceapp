export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readingTime: string;
  imageUrl: string;
  isFeatured?: boolean;
  city?: string;
}

export interface MagazineIssue {
  id: string;
  title: string;
  month: string;
  year: string;
  imageUrl: string;
  coverUrl: string;
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
  cost: number;
  category: string;
  description: string;
}

export interface BalcaoPost {
  id: string;
  title: string;
  description: string;
  category: 'Empregos' | 'Negócios' | 'Serviços' | 'Oportunidades';
  author: string;
  contact: string;
  date: string;
  price?: string;
  images?: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  category: 'Social' | 'Cultura' | 'Negócios' | 'Religioso';
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  articlesCount: number;
}

export interface UserProfile extends UserStats {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
}
