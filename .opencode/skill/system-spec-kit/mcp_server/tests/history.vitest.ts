// ---------------------------------------------------------------
// TEST: HISTORY
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

import * as mod from '../lib/storage/history';

let Database: any = null;
let db: any = null;
let dbPath: string = '';

describe('History Tests (T508)', () => {
  beforeAll(() => {
    Database = require('better-sqlite3');

    dbPath = path.join(os.tmpdir(), `history-test-${Date.now()}.sqlite`);
    db = new Database(dbPath);

    // Create memory_index table (required for joins)
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        spec_folder TEXT,
        trigger_phrases TEXT,
        importance_weight REAL DEFAULT 1.0,
        importance_tier TEXT DEFAULT 'normal',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create memory_history table
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_history (
        id TEXT PRIMARY KEY,
        memory_id INTEGER NOT NULL,
        prev_value TEXT,
        new_value TEXT,
        event TEXT NOT NULL CHECK(event IN ('ADD', 'UPDATE', 'DELETE')),
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        is_deleted INTEGER DEFAULT 0,
        actor TEXT DEFAULT 'system' CHECK(actor IN ('user', 'system', 'hook', 'decay')),
        FOREIGN KEY (memory_id) REFERENCES memory_index(id)
      )
    `);

    // Insert test memories
    const insert = db.prepare('INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)');
    insert.run(1, 'Test Memory 1', 'specs/001-test');
    insert.run(2, 'Test Memory 2', 'specs/001-test');
    insert.run(3, 'Test Memory 3', 'specs/002-other');

    mod.init(db);
  });

  afterAll(() => {
    try {
      if (db) db.close();
      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch { /* ignore cleanup errors */ }
  });

  // -----------------------------------------------------------
  // Record History Entry (T508-01)
  // -----------------------------------------------------------
  describe('Record History Entry', () => {
    it('T508-01: recordHistory returns UUID', () => {
      const id = mod.recordHistory(1, 'ADD', null, JSON.stringify({ title: 'Test Memory 1' }), 'system');
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  });

  // -----------------------------------------------------------
  // Get History for Memory (T508-02)
  // -----------------------------------------------------------
  describe('Get History for Memory', () => {
    it('T508-02a: getHistory returns array of entries', () => {
      // Record a few more entries
      mod.recordHistory(1, 'UPDATE', JSON.stringify({ title: 'Old Title' }), JSON.stringify({ title: 'New Title' }), 'user');
      mod.recordHistory(1, 'UPDATE', JSON.stringify({ title: 'New Title' }), JSON.stringify({ title: 'Final Title' }), 'system');

      const history = mod.getHistory(1);
      expect(Array.isArray(history)).toBe(true);
      expect(history.length).toBeGreaterThanOrEqual(3);
    });

    it('T508-02b: History entries have required fields', () => {
      const history = mod.getHistory(1);
      expect(history.length).toBeGreaterThan(0);

      const entry = history[0];
      expect(entry.id).toBeDefined();
      expect(entry.memory_id).toBeDefined();
      expect(entry.event).toBeDefined();
      expect(entry.timestamp).toBeDefined();
    });
  });

  // -----------------------------------------------------------
  // History Respects Limit (T508-03)
  // -----------------------------------------------------------
  describe('History Respects Limit', () => {
    it('T508-03: getHistory respects limit parameter', () => {
      const limited = mod.getHistory(1, 2);
      expect(Array.isArray(limited)).toBe(true);
      expect(limited.length).toBeLessThanOrEqual(2);
    });
  });

  // -----------------------------------------------------------
  // Chronological Ordering (T508-04)
  // -----------------------------------------------------------
  describe('Chronological Ordering', () => {
    it('T508-04: History is ordered newest-first (DESC)', () => {
      const history = mod.getHistory(1);
      expect(history.length).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < history.length - 1; i++) {
        expect(history[i].timestamp >= history[i + 1].timestamp).toBe(true);
      }
    });
  });

  // -----------------------------------------------------------
  // History Stats (T508-05)
  // -----------------------------------------------------------
  describe('History Stats', () => {
    it('T508-05a: getHistoryStats returns valid stats', () => {
      // Record a DELETE event
      mod.recordHistory(2, 'DELETE', JSON.stringify({ title: 'Test Memory 2' }), null, 'user');

      const stats = mod.getHistoryStats();
      expect(stats).toBeDefined();
      expect(typeof stats.total).toBe('number');
      expect(stats.total).toBeGreaterThan(0);
    });

    it('T508-05b: Stats breakdown by event type', () => {
      const stats = mod.getHistoryStats();
      expect(typeof stats.adds).toBe('number');
      expect(typeof stats.updates).toBe('number');
      expect(typeof stats.deletes).toBe('number');
    });

    it('T508-05c: getHistoryStats filters by specFolder', () => {
      const folderStats = mod.getHistoryStats('specs/001-test');
      expect(folderStats).toBeDefined();
      expect(typeof folderStats.total).toBe('number');
    });
  });

  // -----------------------------------------------------------
  // UUID Generation (T508-06)
  // -----------------------------------------------------------
  describe('UUID Generation', () => {
    it('T508-06a: generateUuid returns 36-char string', () => {
      const uuid = mod.generateUuid();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBe(36);
    });

    it('T508-06b: UUIDs are unique', () => {
      const uuid1 = mod.generateUuid();
      const uuid2 = mod.generateUuid();
      expect(uuid1).not.toBe(uuid2);
    });

    it('T508-06c: UUID has v4 marker at position 14', () => {
      const uuid = mod.generateUuid();
      expect(uuid[14]).toBe('4');
    });
  });
});
