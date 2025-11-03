import Dexie, { type Table } from 'dexie';
import type { SaveSlot, History } from '../types';

export class TerraQuestDB extends Dexie {
  saves!: Table<SaveSlot, number>;
  history!: Table<History, number>;

  constructor() {
    super('TerraQuestDB');
    this.version(1).stores({
      saves: 'id, playerName',
      history: '++id, saveSlotId, questionId, timestamp',
    });
  }
}

export const db = new TerraQuestDB();

// --- API Functions ---

export async function getSaveSlot(slotId: number): Promise<SaveSlot | undefined> {
  return db.saves.get(slotId);
}

export async function createOrUpdateSaveSlot(slot: SaveSlot): Promise<void> {
  await db.saves.put(slot);
}

export async function getAllSaves(): Promise<SaveSlot[]> {
    return db.saves.toArray();
}

export async function addPoints(slotId: number, pointsToAdd: number): Promise<void> {
    await db.saves.where('id').equals(slotId).modify(slot => {
        slot.points += pointsToAdd;
    });
}

export async function addBadge(slotId: number, badgeId: string): Promise<void> {
    const save = await getSaveSlot(slotId);
    if (save && !save.badges.includes(badgeId)) {
        await db.saves.update(slotId, { badges: [...save.badges, badgeId] });
    }
}

export async function logAnswer(
  saveSlotId: number,
  questionId: string,
  correct: boolean
): Promise<void> {
  await db.history.add({
    saveSlotId,
    questionId,
    correct,
    timestamp: Date.now(),
  });
}

export async function resetSave(slotId: number): Promise<void> {
  await db.transaction('rw', db.saves, db.history, async () => {
    const save = await db.saves.get(slotId);
    if(save) {
      await db.saves.update(slotId, {
        points: 0,
        badges: [],
        seenTips: [],
      });
      await db.history.where('saveSlotId').equals(slotId).delete();
    }
  });
}
