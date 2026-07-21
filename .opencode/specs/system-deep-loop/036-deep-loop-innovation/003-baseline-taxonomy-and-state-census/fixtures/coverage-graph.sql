-- BASE: fe6ca3030917073f3b478bc044e10034dcc4394b
PRAGMA foreign_keys = ON;
CREATE TABLE schema_version (version INTEGER NOT NULL);
CREATE TABLE coverage_nodes (id TEXT PRIMARY KEY, kind TEXT NOT NULL, label TEXT NOT NULL, payload_json TEXT NOT NULL);
CREATE TABLE coverage_edges (source_id TEXT NOT NULL, target_id TEXT NOT NULL, relation TEXT NOT NULL, payload_json TEXT NOT NULL, PRIMARY KEY (source_id, target_id, relation));
CREATE TABLE coverage_snapshots (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, payload_json TEXT NOT NULL);
INSERT INTO schema_version VALUES (1);
INSERT INTO coverage_nodes VALUES ('node-fixture', 'workflow', 'sanitized', '{}');
INSERT INTO coverage_edges VALUES ('node-fixture', 'node-fixture', 'self-check', '{}');
INSERT INTO coverage_snapshots VALUES ('snapshot-fixture', '2026-01-01T00:00:00.000Z', '{}');
