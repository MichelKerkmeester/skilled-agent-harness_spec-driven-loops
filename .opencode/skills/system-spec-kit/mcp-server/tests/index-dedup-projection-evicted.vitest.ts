// TEST: INDEX DEDUP — PROJECTION-EVICTED ROWS STAY VISIBLE
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import * as vectorIndexMod from '../lib/search/vector-index';
import { index_memory_deferred } from '../lib/search/vector-index-mutations';
import { getCanonicalPathKey } from '../lib/utils/canonical-path';

// The logical-key unique index spans every non-constitutional/deprecated row
// in memory_index, while a row can fall out of active_memory_projection (a
// file move repoints the projection). The dedup lookup must still see such a
// row: an insert that cannot see it crashes with SQLITE_CONSTRAINT_UNIQUE.
describe('index dedup vs projection-evicted rows', () => {
  let tmpDir: string;

  beforeAll(() => {
    vectorIndexMod.closeDb();
    vectorIndexMod.initializeDb(':memory:');
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dedup-evicted-'));
  });

  afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vectorIndexMod.closeDb();
  });

  it('updates a projection-evicted row with the same logical key instead of crashing, and repoints file_path', () => {
    const db = vectorIndexMod.getDb();
    const specFolder = 'specs/dedup-evicted';
    const newFile = path.join(tmpDir, 'doc.md');
    fs.writeFileSync(newFile, '# moved doc\nbody');
    const canonical = getCanonicalPathKey(newFile);
    const stalePath = path.join(tmpDir, 'old-location', 'doc.md');

    // Simulate the post-move orphan: same logical key (canonical path), stale
    // file_path, and NO active_memory_projection row.
    const inserted = db.prepare(`
      INSERT INTO memory_index (
        spec_folder, file_path, canonical_file_path, anchor_id, title,
        trigger_phrases, importance_weight, created_at, updated_at,
        embedding_status, content_text
      ) VALUES (?, ?, ?, NULL, 'moved doc', '[]', 0.5, ?, ?, 'pending', 'body')
    `).run(specFolder, stalePath, canonical, new Date().toISOString(), new Date().toISOString());
    const orphanId = Number(inserted.lastInsertRowid);
    db.prepare('DELETE FROM active_memory_projection WHERE active_memory_id = ?').run(orphanId);

    let resultId = -1;
    expect(() => {
      resultId = index_memory_deferred({
        specFolder,
        filePath: newFile,
        title: 'moved doc',
        triggerPhrases: ['moved doc'],
        contentText: 'body',
      }, db);
    }).not.toThrow();

    expect(resultId).toBe(orphanId);
    const row = db.prepare('SELECT file_path, canonical_file_path FROM memory_index WHERE id = ?')
      .get(orphanId) as { file_path: string; canonical_file_path: string };
    expect(row.file_path).toBe(newFile);
    expect(row.canonical_file_path).toBe(canonical);

    const projected = db.prepare('SELECT COUNT(*) AS n FROM active_memory_projection WHERE active_memory_id = ?')
      .get(orphanId) as { n: number };
    expect(projected.n).toBe(1);
  });

  it('still deduplicates by stale file_path when the canonical key changed', () => {
    const db = vectorIndexMod.getDb();
    const specFolder = 'specs/dedup-evicted-2';
    const file = path.join(tmpDir, 'doc2.md');
    fs.writeFileSync(file, '# doc2\nbody2');

    const firstId = index_memory_deferred({
      specFolder,
      filePath: file,
      title: 'doc2',
      triggerPhrases: ['doc2'],
      contentText: 'body2',
    }, db);

    const secondId = index_memory_deferred({
      specFolder,
      filePath: file,
      title: 'doc2 updated',
      triggerPhrases: ['doc2'],
      contentText: 'body2 updated',
    }, db);

    expect(secondId).toBe(firstId);
  });
});
