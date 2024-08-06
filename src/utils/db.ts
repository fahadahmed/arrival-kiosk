import { createRxDatabase, addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

addRxPlugin(RxDBDevModePlugin);

export type TodoDocType = {
  id?: string;
  description: string;
  completed: boolean;
};

const todoSchema = {
  title: 'todo schema',
  description: 'describes a simple todo',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100,
    },
    description: {
      type: 'string',
    },
    completed: {
      type: 'boolean',
    },
  },
  required: ['description', 'completed'],
};

const createDatabase = async () => {
  const db = await createRxDatabase({
    name: 'tododb',
    storage: getRxStorageDexie(), // Use Dexie adapter for storage
    ignoreDuplicate: true,
  });

  await db.addCollections({
    todos: {
      schema: todoSchema,
    },
  });

  return db;
};

export default createDatabase;
