#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

const DB_PATH = path.resolve(process.env.MEMORY_DB_PATH ?? 'database/context-index.sqlite');

function moduleUrl(relativePath) {
  return pathToFileURL(path.resolve(relativePath)).href;
}

const Database = (await import('better-sqlite3')).default;
const { assertGroundTruthAlignment } = await import(moduleUrl('dist/lib/eval/ablation-framework.js'));

const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
const summary = assertGroundTruthAlignment(db, {
  dbPath: DB_PATH,
  context: 'alignment assertion',
});

console.log(JSON.stringify(summary, null, 2));
