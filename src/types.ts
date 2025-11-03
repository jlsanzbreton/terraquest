export type Category =
  | "GEOGRAFIA"
  | "HISTORIA"
  | "PALEONTOLOGIA"
  | "ARQUEOLOGIA"
  | "POLITICA"
  | "CIENCIA";

export type QuestionType =
  | "GEO_CAPITAL"       // país → capital
  | "GEO_BANDERA"       // país → bandera
  | "GEO_REGION"        // pista → región/continente
  | "HIST_RUTA"         // ruta histórica → destino
  | "PALEO_ERA"         // fósil → era geológica
  | "ARQ_SITIO";        // pista → yacimiento/cultura

export interface Question {
  id: string;
  category: Category;
  type: QuestionType;
  difficulty: 1 | 2 | 3; // 1 fácil, 2 media, 3 difícil
  regionId?: string;      // vincular a id del SVG
  prompt: string;         // enunciado/pista
  options: string[];      // 3–4 opciones
  answer: string;         // respuesta correcta
  extra?: string;         // curiosidad/contexto
  assets?: string[];      // ids de bandera u otros íconos
}

export interface SaveSlot {
  id: number; // 1, 2, or 3
  createdAt: number;
  playerName: string;
  points: number;
  badges: string[];    // ids de logros
  seenTips: string[];  // ids de tutoriales vistos
}

export interface History {
  id?: number;
  saveSlotId: number;
  questionId: string;
  correct: boolean;
  timestamp: number;
}

export type Page = 'home' | 'play' | 'explore' | 'badges';

export type Difficulty = 1 | 2 | 3;

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
}
