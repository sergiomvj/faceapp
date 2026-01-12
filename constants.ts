
import { Article, MagazineIssue, Author, BalcaoPost, CommunityEvent } from './types';

export const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Brasileiros inovam no Vale do Silício com startups de IA',
    excerpt: 'Conheça a história dos engenheiros que saíram do Brasil para ajudar a humanidade a explorar o potencial da inteligência artificial.',
    category: 'Personalidades',
    author: 'Ana Silva',
    date: '15 Out 2023',
    readingTime: '5 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600',
    content: 'O Vale do Silício continua sendo o epicentro da inovação tecnológica global...',
    isFeatured: true
  },
  {
    id: '7',
    title: '5 Parques Naturais em Orlando que você precisa conhecer',
    excerpt: 'Fuja das filas dos parques temáticos e descubra as belezas naturais da Flórida Central.',
    category: 'Onde ir',
    author: 'Carlos Eduardo',
    date: '20 Out 2023',
    readingTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=600',
    content: 'Orlando é mundialmente famosa pelos seus parques temáticos, mas a região esconde tesouros naturais que muitos turistas (e até residentes) desconhecem...',
    city: 'Orlando'
  },
  {
    id: '8',
    title: 'Os Melhores Restaurantes Brasileiros em Miami',
    excerpt: 'Um guia completo para matar a saudade do tempero de casa na cidade mais vibrante da Flórida.',
    category: 'Onde ir',
    author: 'Mariana Silva',
    date: '22 Out 2023',
    readingTime: '6 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600',
    content: 'Miami é um caldeirão de culturas, e a brasileira tem um lugar de destaque especial, especialmente na gastronomia...',
    city: 'Miami'
  },
  {
    id: '9',
    title: 'Compras em Orlando: Além dos Outlets famosos',
    excerpt: 'Dicas de lojas locais e shoppings menos conhecidos com preços imbatíveis.',
    category: 'Onde ir',
    author: 'Ana Silva',
    date: '25 Out 2023',
    readingTime: '5 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600',
    content: 'Todo brasileiro que visita Orlando tem um roteiro de compras, mas você já pensou em explorar o que há além do básico?',
    city: 'Orlando'
  },
  {
    id: '2',
    title: 'Mudanças nas regras de vistos para 2024',
    excerpt: 'O que você precisa saber sobre os novos prazos, taxas e exigências do departamento de imigração americano.',
    category: 'Imigração',
    author: 'Mariana Silva',
    date: '12 Out 2023',
    readingTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1569974498991-d3c12a504f95?q=80&w=600',
    content: 'Recentemente, o Departamento de Estado anunciou atualizações significativas nos critérios de elegibilidade para vistos de trabalho e turismo...'
  },
  {
    id: '3',
    title: 'Festival da Comunidade Brasileira em Orlando',
    excerpt: 'O maior encontro da nossa cultura na Flórida retorna este ano com recorde de público e novas atrações.',
    category: 'Comunidade',
    author: 'Carlos Eduardo',
    date: '10 Out 2023',
    readingTime: '3 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=600',
    content: 'A celebração da brasilidade em solo americano nunca foi tão forte. O festival deste ano promete reunir mais de 20 mil pessoas...',
    city: 'Orlando'
  },
  {
    id: '6',
    title: 'Saúde Mental do Imigrante: O desafio da adaptação',
    excerpt: 'Especialistas discutem como lidar com a saudade e o choque cultural.',
    category: 'Saúde',
    author: 'Ana Silva',
    date: '14 Out 2023',
    readingTime: '6 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000',
    content: 'Morar fora do país é o sonho de muitos, mas a realidade da adaptação pode trazer desafios emocionais significativos.'
  }
];

export const MAGAZINES: MagazineIssue[] = [
  { id: 'oct23', title: 'O Futuro do Trabalho', month: 'Outubro', year: '2023', imageUrl: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000', coverUrl: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=1000' },
  { id: 'sep23', title: 'Arte & Cultura', month: 'Setembro', year: '2023', imageUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1000', coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1000' },
];

export const BALCAO_MOCK: BalcaoPost[] = [
  { id: 'b1', title: 'Vaga para Manicure em Orlando', description: 'Buscamos profissional experiente para salão brasileiro na International Drive. Ganhos por comissão.', category: 'Empregos', author: 'Clara S.', contact: '+1 407 000 000', date: 'Hoje' },
  { id: 'b2', title: 'Passo Ponto: Cafeteria em Miami', description: 'Ótima localização em Brickell. Clientela formada e equipamentos novos.', category: 'Negócios', author: 'Roberto M.', contact: '+1 305 111 222', date: 'Ontem' },
];

export const EVENTS_MOCK: CommunityEvent[] = [
  {
    id: 'e1',
    title: 'Networking de Empreendedores',
    description: 'Encontro para troca de experiências entre empresários brasileiros no sul da Flórida.',
    date: '2023-11-15',
    time: '19:00',
    location: 'Doral, FL',
    organizer: 'Brazilian Business Group',
    category: 'Negócios'
  },
  {
    id: 'e2',
    title: 'Festa Junina fora de época',
    description: 'Comida típica, música ao vivo e muita diversão para toda a família.',
    date: '2023-11-18',
    time: '12:00',
    location: 'Framingham, MA',
    organizer: 'Comunidade Local',
    category: 'Social'
  }
];

export const AUTHORS: Author[] = [
  { id: 'ana-silva', name: 'Ana Silva', role: 'Editora de Tecnologia', bio: 'Jornalista.', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', articlesCount: 45 },
];
