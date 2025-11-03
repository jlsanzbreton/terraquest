import type { Badge } from "../types";

export const ALL_BADGES: Badge[] = [
  { id: "badge_first_win", name: "Primeros Pasos", description: "Completa tu primera partida.", icon: "🎉" },
  { id: "badge_perfect_round", name: "Ronda Perfecta", description: "Acierta 5 de 5 preguntas.", icon: "⭐" },
  { id: "badge_continental_explorer", name: "Explorador Continental", description: "Juega preguntas de 3 regiones diferentes.", icon: "🗺️" },
  { id: "badge_geography_whiz", name: "As de la Geografía", description: "Responde 10 preguntas de geografía correctamente.", icon: "🌍" },
  { id: "badge_history_buff", name: "Amante de la Historia", description: "Responde 5 preguntas de historia correctamente.", icon: "🏛️" },
];

export function getUnlockedBadges(
    correctAnswers: number,
    totalQuestions: number,
    isFirstGame: boolean
    // In a real app, you'd pass more context like categories answered, regions played etc.
): string[] {
    const newBadges: string[] = [];

    if (isFirstGame) {
        newBadges.push("badge_first_win");
    }

    if (correctAnswers === totalQuestions && totalQuestions > 0) {
        newBadges.push("badge_perfect_round");
    }

    // These would require tracking more state, but are here as examples
    // newBadges.push("badge_continental_explorer");
    // newBadges.push("badge_geography_whiz");

    return newBadges;
}

export function calculateScore(difficulty: 1 | 2 | 3): number {
    switch (difficulty) {
        case 1: return 10;
        case 2: return 20;
        case 3: return 30;
        default: return 0;
    }
}
