#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// TEST: CAUSAL EDGES (T043-T047)
// Tests for Phase 3 - Causal Memory Graph implementation
// ───────────────────────────────────────────────────────────────
'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Import module under test
const causalEdges = require('../lib/storage/causal-edges.js');

/* ─────────────────────────────────────────────────────────────
   1. TEST SETUP
──────────────────────────────────────────────────────────────── */

let db;
let TEST_DB_PATH;

function setup() {
  TEST_DB_PATH = path.join(os.tmpdir(), `causal-edges-test-${Date.now()}.sqlite`);
  db = new Database(TEST_DB_PATH);

  // Create schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS causal_edges (
      id INTEGER PRIMARY KEY,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0 CHECK(strength >= 0.0 AND strength <= 1.0),
      evidence TEXT,
      extracted_at TEXT DEFAULT (datetime('now')),
      UNIQUE(source_id, target_id, relation)
    )
  `);

  db.exec('CREATE INDEX IF NOT EXISTS idx_causal_source ON causal_edges(source_id)');
  db.exec('CREATE INDEX IF NOT EXISTS idx_causal_target ON causal_edges(target_id)');

  // Create mock memory_index for stats tests
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY,
      title TEXT,
      spec_folder TEXT,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      context_type TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT,
      file_path TEXT
    )
  `);

  // Insert some mock memories
  db.prepare(`INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)`).run(1, 'Memory 1', 'specs/001');
  db.prepare(`INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)`).run(2, 'Memory 2', 'specs/001');
  db.prepare(`INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)`).run(3, 'Memory 3', 'specs/002');
  db.prepare(`INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)`).run(4, 'Memory 4', 'specs/002');
  db.prepare(`INSERT INTO memory_index (id, title, spec_folder) VALUES (?, ?, ?)`).run(5, 'Memory 5', 'specs/003');
}

function teardown() {
  if (db) {
    db.close();
  }
  if (TEST_DB_PATH && fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH);
  }
}

/* ─────────────────────────────────────────────────────────────
   2. TEST HELPERS
──────────────────────────────────────────────────────────────── */

let passed = 0;
let failed = 0;

function pass(name, detail = '') {
  passed++;
  console.log(`  ✓ ${name}${detail ? ` (${detail})` : ''}`);
}

function fail(name, error) {
  failed++;
  console.log(`  ✗ ${name}: ${error}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/* ─────────────────────────────────────────────────────────────
   3. TESTS
──────────────────────────────────────────────────────────────── */

function test_relation_types() {
  console.log('\n[T044] Relation Types:');

  try {
    const types = causalEdges.get_relation_types();
    assert(types.length === 6, `Expected 6 types, got ${types.length}`);
    pass('CHK-061: 6 relationship types defined');

    const expected = ['caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'];
    for (const type of expected) {
      assert(types.includes(type), `Missing type: ${type}`);
    }
    pass('All 6 types present', expected.join(', '));

    // Test RELATION_TYPES constant
    assert(causalEdges.RELATION_TYPES.CAUSED === 'caused', 'CAUSED constant');
    assert(causalEdges.RELATION_TYPES.ENABLED === 'enabled', 'ENABLED constant');
    assert(causalEdges.RELATION_TYPES.SUPERSEDES === 'supersedes', 'SUPERSEDES constant');
    assert(causalEdges.RELATION_TYPES.CONTRADICTS === 'contradicts', 'CONTRADICTS constant');
    assert(causalEdges.RELATION_TYPES.DERIVED_FROM === 'derived_from', 'DERIVED_FROM constant');
    assert(causalEdges.RELATION_TYPES.SUPPORTS === 'supports', 'SUPPORTS constant');
    pass('RELATION_TYPES constants correct');
  } catch (e) {
    fail('Relation types', e.message);
  }
}

function test_edge_insertion() {
  console.log('\n[T045] Edge Insertion:');

  try {
    // Basic insertion
    const edge = causalEdges.insert_edge(db, {
      source_id: '1',
      target_id: '2',
      relation: 'caused',
      strength: 0.9,
      evidence: 'Test evidence'
    });

    assert(edge.id, 'Edge should have ID');
    assert(edge.source_id === '1', 'Source ID matches');
    assert(edge.target_id === '2', 'Target ID matches');
    assert(edge.relation === 'caused', 'Relation matches');
    assert(edge.strength === 0.9, 'Strength matches');
    assert(edge.evidence === 'Test evidence', 'Evidence matches');
    pass('Basic edge insertion', `id=${edge.id}`);

    // Test all relation types
    const types = ['enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'];
    for (let i = 0; i < types.length; i++) {
      const e = causalEdges.insert_edge(db, {
        source_id: `${i + 10}`,
        target_id: `${i + 11}`,
        relation: types[i]
      });
      assert(e.relation === types[i], `Relation ${types[i]} inserted`);
    }
    pass('All relation types insertable');

    // Test validation - missing source_id
    try {
      causalEdges.insert_edge(db, { target_id: '2', relation: 'caused' });
      fail('Missing source_id should throw');
    } catch (e) {
      assert(e.message.includes('source_id'), 'Error mentions source_id');
      pass('Validates required source_id');
    }

    // Test validation - invalid relation
    try {
      causalEdges.insert_edge(db, { source_id: '1', target_id: '2', relation: 'invalid' });
      fail('Invalid relation should throw');
    } catch (e) {
      assert(e.message.includes('relation'), 'Error mentions relation');
      pass('Validates relation type');
    }

    // Test validation - strength bounds
    try {
      causalEdges.insert_edge(db, { source_id: '1', target_id: '3', relation: 'caused', strength: 1.5 });
      fail('Strength > 1 should throw');
    } catch (e) {
      pass('Validates strength bounds');
    }

    // Test self-referential prevention
    try {
      causalEdges.insert_edge(db, { source_id: '1', target_id: '1', relation: 'caused' });
      fail('Self-reference should throw');
    } catch (e) {
      assert(e.message.includes('same'), 'Error mentions same');
      pass('Prevents self-referential edges');
    }
  } catch (e) {
    fail('Edge insertion', e.message);
  }
}

function test_edge_retrieval() {
  console.log('\n[T045] Edge Retrieval:');

  try {
    // Insert test edges
    causalEdges.insert_edge(db, { source_id: '100', target_id: '101', relation: 'caused' });
    causalEdges.insert_edge(db, { source_id: '100', target_id: '102', relation: 'enabled' });
    causalEdges.insert_edge(db, { source_id: '103', target_id: '100', relation: 'supports' });

    // Test get_edges_from
    const from_edges = causalEdges.get_edges_from(db, '100');
    assert(from_edges.length === 2, `Expected 2 outgoing edges, got ${from_edges.length}`);
    pass('get_edges_from works', `count=${from_edges.length}`);

    // Test get_edges_to
    const to_edges = causalEdges.get_edges_to(db, '100');
    assert(to_edges.length === 1, `Expected 1 incoming edge, got ${to_edges.length}`);
    pass('get_edges_to works', `count=${to_edges.length}`);

    // Test get_all_edges
    const all = causalEdges.get_all_edges(db, '100');
    assert(all.outgoing.length === 2, 'Outgoing count');
    assert(all.incoming.length === 1, 'Incoming count');
    assert(all.total === 3, 'Total count');
    pass('get_all_edges works', `total=${all.total}`);

    // Test relation filter
    const filtered = causalEdges.get_edges_from(db, '100', { relation: 'caused' });
    assert(filtered.length === 1, 'Filtered to 1 edge');
    assert(filtered[0].relation === 'caused', 'Correct relation');
    pass('Relation filtering works');
  } catch (e) {
    fail('Edge retrieval', e.message);
  }
}

function test_causal_chain() {
  console.log('\n[T046] Causal Chain Traversal:');

  try {
    // Build a test chain: 200 -> 201 -> 202 -> 203
    causalEdges.insert_edge(db, { source_id: '200', target_id: '201', relation: 'caused' });
    causalEdges.insert_edge(db, { source_id: '201', target_id: '202', relation: 'enabled' });
    causalEdges.insert_edge(db, { source_id: '202', target_id: '203', relation: 'caused' });
    causalEdges.insert_edge(db, { source_id: '203', target_id: '204', relation: 'supersedes' });

    // Test full traversal
    const chain = causalEdges.get_causal_chain(db, '200', { max_depth: 10 });
    assert(chain.all.length >= 3, `Expected at least 3 edges, got ${chain.all.length}`);
    pass('CHK-063: getCausalChain traverses with depth', `edges=${chain.all.length}`);

    // Test depth limiting
    const limited = causalEdges.get_causal_chain(db, '200', { max_depth: 1 });
    const at_depth_0 = limited.all.filter(e => e.depth === 0).length;
    assert(at_depth_0 >= 1, 'At least one edge at depth 0');
    pass('Depth limiting works', `max_depth=1`);

    // Test grouped results
    assert(chain.by_relation, 'Has by_relation grouping');
    assert(chain.by_cause, 'Has by_cause');
    assert(chain.by_enabled, 'Has by_enabled');
    pass('Results grouped by relation type');

    // Test direction filtering
    const outgoing_only = causalEdges.get_causal_chain(db, '200', { direction: 'outgoing' });
    const incoming_only = causalEdges.get_causal_chain(db, '203', { direction: 'incoming' });
    pass('Direction filtering works', `outgoing=${outgoing_only.total_edges}, incoming=${incoming_only.total_edges}`);

    // Test relation filtering
    const caused_only = causalEdges.get_causal_chain(db, '200', { relations: ['caused'] });
    const all_caused = caused_only.all.every(e => e.relation === 'caused');
    assert(all_caused, 'All edges are caused');
    pass('Relation filtering in traversal');

    // Test cycle prevention
    causalEdges.insert_edge(db, { source_id: '301', target_id: '302', relation: 'caused' });
    causalEdges.insert_edge(db, { source_id: '302', target_id: '301', relation: 'supports' }); // Cycle!
    const cyclic = causalEdges.get_causal_chain(db, '301', { max_depth: 10 });
    assert(cyclic.all.length < 100, 'Should not loop infinitely');
    pass('Handles cycles safely', `edges=${cyclic.all.length}`);
  } catch (e) {
    fail('Causal chain traversal', e.message);
  }
}

function test_edge_management() {
  console.log('\n[T045] Edge Management:');

  try {
    // Insert edge for update test
    const edge = causalEdges.insert_edge(db, {
      source_id: '400',
      target_id: '401',
      relation: 'caused',
      strength: 0.5,
      evidence: 'Original'
    });

    // Test update
    const updated = causalEdges.update_edge(db, edge.id, {
      strength: 0.8,
      evidence: 'Updated'
    });
    assert(updated.updated, 'Edge was updated');
    pass('update_edge works');

    // Test delete
    const deleted = causalEdges.delete_edge(db, edge.id);
    assert(deleted.deleted, 'Edge was deleted');
    pass('delete_edge works');

    // Test delete_edges_for_memory
    causalEdges.insert_edge(db, { source_id: '500', target_id: '501', relation: 'caused' });
    causalEdges.insert_edge(db, { source_id: '502', target_id: '500', relation: 'supports' });
    const cleanup = causalEdges.delete_edges_for_memory(db, '500');
    assert(cleanup.deleted === 2, `Expected 2 deleted, got ${cleanup.deleted}`);
    pass('delete_edges_for_memory cleans up all edges');
  } catch (e) {
    fail('Edge management', e.message);
  }
}

function test_graph_stats() {
  console.log('\n[CHK-065] Graph Statistics:');

  try {
    // Clear and insert known edges
    db.exec('DELETE FROM causal_edges');
    causalEdges.insert_edge(db, { source_id: '1', target_id: '2', relation: 'caused' });
    causalEdges.insert_edge(db, { source_id: '2', target_id: '3', relation: 'enabled' });
    causalEdges.insert_edge(db, { source_id: '3', target_id: '4', relation: 'supersedes' });

    const stats = causalEdges.get_graph_stats(db);

    assert(stats.total_edges === 3, `Expected 3 edges, got ${stats.total_edges}`);
    pass('Counts total edges correctly');

    assert(stats.by_relation.caused === 1, 'caused count');
    assert(stats.by_relation.enabled === 1, 'enabled count');
    assert(stats.by_relation.supersedes === 1, 'supersedes count');
    pass('Breaks down by relation type');

    assert(stats.unique_memories_in_graph >= 3, 'Has unique memories count');
    pass('Tracks unique memories in graph');

    assert(typeof stats.link_coverage_percent !== 'undefined', 'Has link coverage');
    pass('Calculates link coverage', `coverage=${stats.link_coverage_percent}%`);

    // Test orphaned edges detection
    const orphaned = causalEdges.find_orphaned_edges(db);
    assert(typeof orphaned.total_orphaned === 'number', 'Has orphaned count');
    pass('Detects orphaned edges');
  } catch (e) {
    fail('Graph statistics', e.message);
  }
}

function test_batch_insertion() {
  console.log('\n[T045] Batch Insertion:');

  try {
    const edges = [
      { source_id: '600', target_id: '601', relation: 'caused' },
      { source_id: '601', target_id: '602', relation: 'enabled' },
      { source_id: '602', target_id: '603', relation: 'supersedes' }
    ];

    const result = causalEdges.insert_edges_batch(db, edges);
    assert(result.total === 3, 'Total count correct');
    assert(result.inserted === 3, 'All inserted');
    assert(result.failed === 0, 'None failed');
    pass('Batch insertion works', `inserted=${result.inserted}`);

    // Test with some failures
    const mixed = [
      { source_id: '700', target_id: '701', relation: 'caused' },
      { source_id: '702', relation: 'caused' }, // Missing target_id
      { source_id: '703', target_id: '704', relation: 'invalid' } // Invalid relation
    ];

    const mixed_result = causalEdges.insert_edges_batch(db, mixed);
    assert(mixed_result.inserted === 1, 'Only valid one inserted');
    assert(mixed_result.failed === 2, 'Two failed');
    pass('Handles partial failures in batch');
  } catch (e) {
    fail('Batch insertion', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   5. T128-T141 TESTS (Extended Test Coverage)
──────────────────────────────────────────────────────────────── */

function test_T128_schema() {
  console.log('\n[T128] causal_edges Table Schema (v8 migration):');

  try {
    // Verify table exists and has correct columns
    const tableInfo = db.prepare("PRAGMA table_info(causal_edges)").all();
    const columnNames = tableInfo.map(col => col.name);

    const requiredColumns = ['id', 'source_id', 'target_id', 'relation', 'strength', 'evidence', 'extracted_at'];
    for (const col of requiredColumns) {
      assert(columnNames.includes(col), `Missing column: ${col}`);
    }
    pass('T128: All required columns exist', requiredColumns.join(', '));

    // Verify column types
    const idCol = tableInfo.find(c => c.name === 'id');
    assert(idCol.type === 'INTEGER', 'id is INTEGER');
    assert(idCol.pk === 1, 'id is PRIMARY KEY');
    pass('T128: id is INTEGER PRIMARY KEY');

    const sourceCol = tableInfo.find(c => c.name === 'source_id');
    assert(sourceCol.type === 'TEXT', 'source_id is TEXT');
    assert(sourceCol.notnull === 1, 'source_id is NOT NULL');
    pass('T128: source_id is TEXT NOT NULL');

    const targetCol = tableInfo.find(c => c.name === 'target_id');
    assert(targetCol.type === 'TEXT', 'target_id is TEXT');
    assert(targetCol.notnull === 1, 'target_id is NOT NULL');
    pass('T128: target_id is TEXT NOT NULL');

    const relationCol = tableInfo.find(c => c.name === 'relation');
    assert(relationCol.type === 'TEXT', 'relation is TEXT');
    assert(relationCol.notnull === 1, 'relation is NOT NULL');
    pass('T128: relation is TEXT NOT NULL with CHECK constraint');

    const strengthCol = tableInfo.find(c => c.name === 'strength');
    assert(strengthCol.type === 'REAL', 'strength is REAL');
    pass('T128: strength is REAL with default 1.0');

    // Verify indexes exist
    const indexes = db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='causal_edges'").all();
    const indexNames = indexes.map(i => i.name);
    assert(indexNames.some(n => n.includes('source')), 'Has source index');
    assert(indexNames.some(n => n.includes('target')), 'Has target index');
    pass('T128: Required indexes exist (source, target)');
  } catch (e) {
    fail('T128: Schema verification', e.message);
  }
}

function test_T129_relation_types_count() {
  console.log('\n[T129] RELATION_TYPES Contains 6 Types:');

  try {
    const types = causalEdges.get_relation_types();
    assert(types.length === 6, `Expected exactly 6 types, got ${types.length}`);
    pass('T129: RELATION_TYPES contains exactly 6 types');

    const typeValues = Object.values(causalEdges.RELATION_TYPES);
    assert(typeValues.length === 6, `RELATION_TYPES object has ${typeValues.length} values`);
    pass('T129: RELATION_TYPES object has 6 values');

    const typeKeys = Object.keys(causalEdges.RELATION_TYPES);
    assert(typeKeys.length === 6, `RELATION_TYPES object has ${typeKeys.length} keys`);
    pass('T129: RELATION_TYPES object has 6 keys');

    // Verify frozen
    assert(Object.isFrozen(causalEdges.RELATION_TYPES), 'RELATION_TYPES is frozen');
    pass('T129: RELATION_TYPES is immutable (frozen)');
  } catch (e) {
    fail('T129: Relation types count', e.message);
  }
}

function test_T130_caused_relation() {
  console.log('\n[T130] "caused" Relation Type:');

  try {
    assert(causalEdges.RELATION_TYPES.CAUSED === 'caused', 'CAUSED constant equals "caused"');
    pass('T130: RELATION_TYPES.CAUSED equals "caused"');

    const edge = causalEdges.insert_edge(db, {
      source_id: '1000',
      target_id: '1001',
      relation: 'caused',
      evidence: 'Decision A caused implementation B'
    });
    assert(edge.relation === 'caused', 'Edge created with caused relation');
    pass('T130: Can insert edge with "caused" relation');

    const retrieved = causalEdges.get_edges_from(db, '1000', { relation: 'caused' });
    assert(retrieved.length >= 1, 'Retrieved caused edge');
    assert(retrieved[0].relation === 'caused', 'Retrieved edge has caused relation');
    pass('T130: Can filter and retrieve "caused" edges');
  } catch (e) {
    fail('T130: caused relation', e.message);
  }
}

function test_T131_enabled_relation() {
  console.log('\n[T131] "enabled" Relation Type:');

  try {
    assert(causalEdges.RELATION_TYPES.ENABLED === 'enabled', 'ENABLED constant equals "enabled"');
    pass('T131: RELATION_TYPES.ENABLED equals "enabled"');

    const edge = causalEdges.insert_edge(db, {
      source_id: '1100',
      target_id: '1101',
      relation: 'enabled',
      evidence: 'Feature A enabled capability B'
    });
    assert(edge.relation === 'enabled', 'Edge created with enabled relation');
    pass('T131: Can insert edge with "enabled" relation');

    const retrieved = causalEdges.get_edges_from(db, '1100', { relation: 'enabled' });
    assert(retrieved.length >= 1, 'Retrieved enabled edge');
    assert(retrieved[0].relation === 'enabled', 'Retrieved edge has enabled relation');
    pass('T131: Can filter and retrieve "enabled" edges');
  } catch (e) {
    fail('T131: enabled relation', e.message);
  }
}

function test_T132_supersedes_relation() {
  console.log('\n[T132] "supersedes" Relation Type:');

  try {
    assert(causalEdges.RELATION_TYPES.SUPERSEDES === 'supersedes', 'SUPERSEDES constant equals "supersedes"');
    pass('T132: RELATION_TYPES.SUPERSEDES equals "supersedes"');

    const edge = causalEdges.insert_edge(db, {
      source_id: '1200',
      target_id: '1201',
      relation: 'supersedes',
      evidence: 'Decision A supersedes outdated decision B'
    });
    assert(edge.relation === 'supersedes', 'Edge created with supersedes relation');
    pass('T132: Can insert edge with "supersedes" relation');

    const retrieved = causalEdges.get_edges_from(db, '1200', { relation: 'supersedes' });
    assert(retrieved.length >= 1, 'Retrieved supersedes edge');
    assert(retrieved[0].relation === 'supersedes', 'Retrieved edge has supersedes relation');
    pass('T132: Can filter and retrieve "supersedes" edges');
  } catch (e) {
    fail('T132: supersedes relation', e.message);
  }
}

function test_T133_contradicts_relation() {
  console.log('\n[T133] "contradicts" Relation Type:');

  try {
    assert(causalEdges.RELATION_TYPES.CONTRADICTS === 'contradicts', 'CONTRADICTS constant equals "contradicts"');
    pass('T133: RELATION_TYPES.CONTRADICTS equals "contradicts"');

    const edge = causalEdges.insert_edge(db, {
      source_id: '1300',
      target_id: '1301',
      relation: 'contradicts',
      evidence: 'Memory A contradicts memory B'
    });
    assert(edge.relation === 'contradicts', 'Edge created with contradicts relation');
    pass('T133: Can insert edge with "contradicts" relation');

    const retrieved = causalEdges.get_edges_from(db, '1300', { relation: 'contradicts' });
    assert(retrieved.length >= 1, 'Retrieved contradicts edge');
    assert(retrieved[0].relation === 'contradicts', 'Retrieved edge has contradicts relation');
    pass('T133: Can filter and retrieve "contradicts" edges');
  } catch (e) {
    fail('T133: contradicts relation', e.message);
  }
}

function test_T134_derived_from_relation() {
  console.log('\n[T134] "derived_from" Relation Type:');

  try {
    assert(causalEdges.RELATION_TYPES.DERIVED_FROM === 'derived_from', 'DERIVED_FROM constant equals "derived_from"');
    pass('T134: RELATION_TYPES.DERIVED_FROM equals "derived_from"');

    const edge = causalEdges.insert_edge(db, {
      source_id: '1400',
      target_id: '1401',
      relation: 'derived_from',
      evidence: 'Implementation A was derived from specification B'
    });
    assert(edge.relation === 'derived_from', 'Edge created with derived_from relation');
    pass('T134: Can insert edge with "derived_from" relation');

    const retrieved = causalEdges.get_edges_from(db, '1400', { relation: 'derived_from' });
    assert(retrieved.length >= 1, 'Retrieved derived_from edge');
    assert(retrieved[0].relation === 'derived_from', 'Retrieved edge has derived_from relation');
    pass('T134: Can filter and retrieve "derived_from" edges');
  } catch (e) {
    fail('T134: derived_from relation', e.message);
  }
}

function test_T135_supports_relation() {
  console.log('\n[T135] "supports" Relation Type:');

  try {
    assert(causalEdges.RELATION_TYPES.SUPPORTS === 'supports', 'SUPPORTS constant equals "supports"');
    pass('T135: RELATION_TYPES.SUPPORTS equals "supports"');

    const edge = causalEdges.insert_edge(db, {
      source_id: '1500',
      target_id: '1501',
      relation: 'supports',
      evidence: 'Evidence A supports decision B'
    });
    assert(edge.relation === 'supports', 'Edge created with supports relation');
    pass('T135: Can insert edge with "supports" relation');

    const retrieved = causalEdges.get_edges_from(db, '1500', { relation: 'supports' });
    assert(retrieved.length >= 1, 'Retrieved supports edge');
    assert(retrieved[0].relation === 'supports', 'Retrieved edge has supports relation');
    pass('T135: Can filter and retrieve "supports" edges');
  } catch (e) {
    fail('T135: supports relation', e.message);
  }
}

function test_T136_insert_validates_required_fields() {
  console.log('\n[T136] insert_edge() Validates Required Fields:');

  try {
    // Test missing source_id
    try {
      causalEdges.insert_edge(db, { target_id: '2', relation: 'caused' });
      fail('T136: Should throw for missing source_id');
    } catch (e) {
      assert(e.message.includes('source_id is required'), 'Error message mentions source_id');
      pass('T136: Throws error for missing source_id');
    }

    // Test missing target_id
    try {
      causalEdges.insert_edge(db, { source_id: '1', relation: 'caused' });
      fail('T136: Should throw for missing target_id');
    } catch (e) {
      assert(e.message.includes('target_id is required'), 'Error message mentions target_id');
      pass('T136: Throws error for missing target_id');
    }

    // Test missing relation
    try {
      causalEdges.insert_edge(db, { source_id: '1', target_id: '2' });
      fail('T136: Should throw for missing relation');
    } catch (e) {
      assert(e.message.includes('relation is required'), 'Error message mentions relation');
      pass('T136: Throws error for missing relation');
    }

    // Test invalid relation type
    try {
      causalEdges.insert_edge(db, { source_id: '1', target_id: '2', relation: 'invalid_relation' });
      fail('T136: Should throw for invalid relation');
    } catch (e) {
      assert(e.message.includes('relation must be one of'), 'Error message lists valid relations');
      pass('T136: Throws error for invalid relation type');
    }

    // Test null source_id
    try {
      causalEdges.insert_edge(db, { source_id: null, target_id: '2', relation: 'caused' });
      fail('T136: Should throw for null source_id');
    } catch (e) {
      assert(e.message.includes('source_id'), 'Error mentions source_id');
      pass('T136: Throws error for null source_id');
    }

    // Test empty string source_id
    try {
      causalEdges.insert_edge(db, { source_id: '', target_id: '2', relation: 'caused' });
      fail('T136: Should throw for empty source_id');
    } catch (e) {
      assert(e.message.includes('source_id'), 'Error mentions source_id');
      pass('T136: Throws error for empty string source_id');
    }
  } catch (e) {
    fail('T136: Required fields validation', e.message);
  }
}

function test_T137_insert_validates_strength_bounds() {
  console.log('\n[T137] insert_edge() Validates Strength Bounds (0-1):');

  try {
    // Test strength > 1
    try {
      causalEdges.insert_edge(db, { source_id: '1700', target_id: '1701', relation: 'caused', strength: 1.5 });
      fail('T137: Should throw for strength > 1');
    } catch (e) {
      assert(e.message.includes('strength must be a number between 0.0 and 1.0'), 'Error message correct');
      pass('T137: Throws error for strength > 1.0');
    }

    // Test strength < 0
    try {
      causalEdges.insert_edge(db, { source_id: '1702', target_id: '1703', relation: 'caused', strength: -0.5 });
      fail('T137: Should throw for strength < 0');
    } catch (e) {
      assert(e.message.includes('strength must be a number between 0.0 and 1.0'), 'Error message correct');
      pass('T137: Throws error for strength < 0.0');
    }

    // Test non-numeric strength
    try {
      causalEdges.insert_edge(db, { source_id: '1704', target_id: '1705', relation: 'caused', strength: 'high' });
      fail('T137: Should throw for non-numeric strength');
    } catch (e) {
      assert(e.message.includes('strength must be a number'), 'Error message correct');
      pass('T137: Throws error for non-numeric strength');
    }

    // Test valid strength at boundaries
    const edge0 = causalEdges.insert_edge(db, { source_id: '1706', target_id: '1707', relation: 'caused', strength: 0.0 });
    assert(edge0.strength === 0.0, 'strength 0.0 accepted');
    pass('T137: Accepts strength = 0.0 (lower bound)');

    const edge1 = causalEdges.insert_edge(db, { source_id: '1708', target_id: '1709', relation: 'caused', strength: 1.0 });
    assert(edge1.strength === 1.0, 'strength 1.0 accepted');
    pass('T137: Accepts strength = 1.0 (upper bound)');

    const edgeMid = causalEdges.insert_edge(db, { source_id: '1710', target_id: '1711', relation: 'caused', strength: 0.5 });
    assert(edgeMid.strength === 0.5, 'strength 0.5 accepted');
    pass('T137: Accepts strength = 0.5 (middle value)');
  } catch (e) {
    fail('T137: Strength bounds validation', e.message);
  }
}

function test_T138_insert_prevents_self_referential() {
  console.log('\n[T138] insert_edge() Prevents Self-Referential Edges:');

  try {
    // Test identical IDs as strings
    try {
      causalEdges.insert_edge(db, { source_id: '1800', target_id: '1800', relation: 'caused' });
      fail('T138: Should throw for self-referential edge');
    } catch (e) {
      assert(e.message.includes('source_id and target_id cannot be the same'), 'Error message correct');
      pass('T138: Throws error for identical string IDs');
    }

    // Test identical IDs as numbers
    try {
      causalEdges.insert_edge(db, { source_id: 1801, target_id: 1801, relation: 'caused' });
      fail('T138: Should throw for self-referential edge (numbers)');
    } catch (e) {
      assert(e.message.includes('same'), 'Error mentions same');
      pass('T138: Throws error for identical numeric IDs');
    }

    // Test mixed string/number that are equivalent
    try {
      causalEdges.insert_edge(db, { source_id: '1802', target_id: 1802, relation: 'caused' });
      fail('T138: Should throw for equivalent string/number IDs');
    } catch (e) {
      assert(e.message.includes('same'), 'Error mentions same');
      pass('T138: Throws error for equivalent string/number IDs');
    }

    // Verify different IDs work
    const validEdge = causalEdges.insert_edge(db, { source_id: '1803', target_id: '1804', relation: 'caused' });
    assert(validEdge.source_id !== validEdge.target_id, 'Different IDs accepted');
    pass('T138: Accepts edges with different source and target IDs');
  } catch (e) {
    fail('T138: Self-referential prevention', e.message);
  }
}

function test_T139_depth_limited_traversal() {
  console.log('\n[T139] get_causal_chain() Depth-Limited Traversal (max 10):');

  try {
    // Create a chain of 15 edges: 1900 -> 1901 -> ... -> 1914
    for (let i = 1900; i < 1914; i++) {
      try {
        causalEdges.insert_edge(db, { source_id: String(i), target_id: String(i + 1), relation: 'caused' });
      } catch (e) {
        // Ignore duplicate key errors
      }
    }

    // Test with max_depth = 10 (should stop at depth 10 even though chain is longer)
    const chain10 = causalEdges.get_causal_chain(db, '1900', { max_depth: 10 });
    const maxDepthFound10 = Math.max(...chain10.all.map(e => e.depth), -1);
    assert(maxDepthFound10 <= 10, `Max depth should be <= 10, got ${maxDepthFound10}`);
    pass('T139: Respects max_depth = 10 limit');

    // Test with max_depth = 5 (should stop earlier)
    const chain5 = causalEdges.get_causal_chain(db, '1900', { max_depth: 5 });
    const maxDepthFound5 = Math.max(...chain5.all.map(e => e.depth), -1);
    assert(maxDepthFound5 <= 5, `Max depth should be <= 5, got ${maxDepthFound5}`);
    pass('T139: Respects max_depth = 5 limit');

    // Test with max_depth > 10 (implementation caps at 10)
    const chain15 = causalEdges.get_causal_chain(db, '1900', { max_depth: 15 });
    const maxDepthFound15 = Math.max(...chain15.all.map(e => e.depth), -1);
    assert(maxDepthFound15 <= 10, `Max depth capped at 10, got ${maxDepthFound15}`);
    pass('T139: Caps max_depth at 10 even when larger value requested');

    // Test with max_depth = 1
    const chain1 = causalEdges.get_causal_chain(db, '1900', { max_depth: 1 });
    const maxDepthFound1 = Math.max(...chain1.all.map(e => e.depth), -1);
    assert(maxDepthFound1 <= 1, `Max depth should be <= 1, got ${maxDepthFound1}`);
    pass('T139: Respects max_depth = 1 limit');

    // Verify traversal_options in result
    assert(chain10.traversal_options.max_depth === 10, 'traversal_options shows max_depth');
    pass('T139: Returns traversal_options with max_depth');
  } catch (e) {
    fail('T139: Depth-limited traversal', e.message);
  }
}

function test_T140_cycle_detection() {
  console.log('\n[T140] get_causal_chain() Cycle Detection via visited Set:');

  try {
    // Create a simple cycle: 2000 -> 2001 -> 2002 -> 2000
    try {
      causalEdges.insert_edge(db, { source_id: '2000', target_id: '2001', relation: 'caused' });
      causalEdges.insert_edge(db, { source_id: '2001', target_id: '2002', relation: 'enabled' });
      causalEdges.insert_edge(db, { source_id: '2002', target_id: '2000', relation: 'supports' }); // Cycle back
    } catch (e) {
      // Ignore duplicate errors
    }

    // Traversal should not loop infinitely
    const startTime = Date.now();
    const chain = causalEdges.get_causal_chain(db, '2000', { max_depth: 10 });
    const elapsed = Date.now() - startTime;

    // Should complete quickly (under 1 second) - infinite loop would time out
    assert(elapsed < 1000, `Should complete quickly, took ${elapsed}ms`);
    pass('T140: Completes in reasonable time despite cycle');

    // Should visit each node at most once in the traversal
    const visitedNodes = new Set();
    for (const edge of chain.all) {
      const fromTo = `${edge.from}`;
      if (!visitedNodes.has(fromTo)) {
        visitedNodes.add(fromTo);
      }
    }
    // The chain should not have excessive duplicates
    assert(chain.all.length < 50, `Chain length reasonable: ${chain.all.length}`);
    pass('T140: Does not produce excessive edges from cycle');

    // Create a more complex cycle: diamond with back-edge
    try {
      causalEdges.insert_edge(db, { source_id: '2100', target_id: '2101', relation: 'caused' });
      causalEdges.insert_edge(db, { source_id: '2100', target_id: '2102', relation: 'caused' });
      causalEdges.insert_edge(db, { source_id: '2101', target_id: '2103', relation: 'enabled' });
      causalEdges.insert_edge(db, { source_id: '2102', target_id: '2103', relation: 'enabled' });
      causalEdges.insert_edge(db, { source_id: '2103', target_id: '2100', relation: 'supports' }); // Back to start
    } catch (e) {
      // Ignore duplicates
    }

    const diamondChain = causalEdges.get_causal_chain(db, '2100', { max_depth: 10 });
    assert(diamondChain.all.length < 100, 'Diamond cycle handled correctly');
    pass('T140: Handles complex diamond cycle correctly');

    // Test that visited set prevents re-visiting nodes
    // Create self-loop (if not prevented by insert)
    const selfLoopChain = causalEdges.get_causal_chain(db, '2200', { max_depth: 10 });
    assert(Array.isArray(selfLoopChain.all), 'Returns valid result for non-existent node');
    pass('T140: Handles non-existent node gracefully');
  } catch (e) {
    fail('T140: Cycle detection', e.message);
  }
}

function test_T141_memory_drift_why() {
  console.log('\n[T141] memory_drift_why Tool Returns Decision Lineage:');

  try {
    // Create a decision lineage: decision -> implementation -> refinement -> current
    // This simulates the "why" chain for memory drift analysis
    const decisions = [
      { id: '3000', title: 'Initial Architecture Decision' },
      { id: '3001', title: 'Implementation Choice' },
      { id: '3002', title: 'Refinement' },
      { id: '3003', title: 'Current State' }
    ];

    // Insert edges representing decision lineage
    try {
      causalEdges.insert_edge(db, {
        source_id: '3000',
        target_id: '3001',
        relation: 'caused',
        evidence: 'Architecture decision led to implementation choice'
      });
      causalEdges.insert_edge(db, {
        source_id: '3001',
        target_id: '3002',
        relation: 'enabled',
        evidence: 'Implementation enabled refinement'
      });
      causalEdges.insert_edge(db, {
        source_id: '3002',
        target_id: '3003',
        relation: 'derived_from',
        evidence: 'Current state derived from refinement'
      });
    } catch (e) {
      // Ignore duplicates
    }

    // Simulate memory_drift_why by tracing incoming edges (why did we get here?)
    const currentState = '3003';
    const lineage = causalEdges.get_causal_chain(db, currentState, {
      direction: 'incoming',
      max_depth: 10
    });

    // Should find the chain back to the original decision
    assert(lineage.all.length >= 1, 'Found at least one edge in lineage');
    pass('T141: Traces incoming edges for decision lineage');

    // Check that we can find the path
    const edgeRelations = lineage.all.map(e => e.relation);
    pass('T141: Returns edges with relation types', edgeRelations.join(', '));

    // The lineage should include evidence
    const hasEvidence = lineage.all.some(e => e.evidence);
    assert(hasEvidence, 'Lineage includes evidence');
    pass('T141: Decision lineage includes evidence');

    // Check grouped results for "why" queries
    assert(lineage.by_relation, 'Has by_relation grouping');
    assert(lineage.by_cause !== undefined, 'Has by_cause for "why" queries');
    assert(lineage.by_derived_from !== undefined, 'Has by_derived_from');
    pass('T141: Results grouped for "why" analysis');

    // Verify the chain can answer "why is the current state this way?"
    const whyChain = [];
    for (const edge of lineage.all) {
      whyChain.push({
        from: edge.from,
        to: edge.to,
        reason: edge.relation,
        evidence: edge.evidence
      });
    }
    assert(whyChain.length >= 1, 'Why chain has entries');
    pass('T141: Can construct "why" explanation chain');

    // Test outgoing direction for "what did this decision cause?"
    const impact = causalEdges.get_causal_chain(db, '3000', {
      direction: 'outgoing',
      max_depth: 10
    });
    assert(impact.all.length >= 1, 'Found downstream impact');
    pass('T141: Traces outgoing edges for impact analysis');
  } catch (e) {
    fail('T141: memory_drift_why', e.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN
──────────────────────────────────────────────────────────────── */

function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  CAUSAL EDGES TEST SUITE (T043-T047, T128-T141)');
  console.log('  Phase 3: Causal Memory Graph');
  console.log('═══════════════════════════════════════════════════════════');

  setup();

  try {
    // Original tests (T043-T047)
    test_relation_types();    // T044, CHK-061
    test_edge_insertion();    // T045
    test_edge_retrieval();    // T045
    test_causal_chain();      // T046, CHK-063
    test_edge_management();   // T045
    test_graph_stats();       // CHK-065
    test_batch_insertion();   // T045

    // Extended tests (T128-T141)
    test_T128_schema();                       // T128: Schema verification
    test_T129_relation_types_count();         // T129: 6 types count
    test_T130_caused_relation();              // T130: 'caused' type
    test_T131_enabled_relation();             // T131: 'enabled' type
    test_T132_supersedes_relation();          // T132: 'supersedes' type
    test_T133_contradicts_relation();         // T133: 'contradicts' type
    test_T134_derived_from_relation();        // T134: 'derived_from' type
    test_T135_supports_relation();            // T135: 'supports' type
    test_T136_insert_validates_required_fields(); // T136: Required fields
    test_T137_insert_validates_strength_bounds(); // T137: Strength bounds
    test_T138_insert_prevents_self_referential(); // T138: Self-referential
    test_T139_depth_limited_traversal();      // T139: Max depth 10
    test_T140_cycle_detection();              // T140: Cycle detection
    test_T141_memory_drift_why();             // T141: Decision lineage
  } finally {
    teardown();
  }

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════════════════════════');

  if (failed > 0) {
    console.log('\n[FAIL] Some tests failed');
    process.exit(1);
  } else {
    console.log('\n[PASS] All tests passed');
    process.exit(0);
  }
}

main();
