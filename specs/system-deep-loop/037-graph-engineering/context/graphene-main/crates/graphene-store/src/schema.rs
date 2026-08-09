use rusqlite::Connection;

use crate::StoreError;

pub const SCHEMA_VERSION: i64 = 1;

/// The log is the truth; everything else here is a rebuildable cache.
///
/// `folds` holds the serialized fold rather than a normalized mirror of it.
/// One writer at a time makes divergence impossible by construction, and a
/// single source of derived truth cannot drift from itself — whereas eight
/// mirror tables would each need to stay in step with the fold's semantics.
/// `graph_index` and `active_claims` exist because they are the two things that
/// genuinely need SQL: cross-process listing, and cross-process race resolution.
const DDL: &str = r#"
CREATE TABLE IF NOT EXISTS meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    seq      INTEGER PRIMARY KEY AUTOINCREMENT,
    graph_id TEXT    NOT NULL,
    kind     TEXT    NOT NULL,
    actor    TEXT    NOT NULL,
    at       INTEGER NOT NULL,
    payload  TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS events_by_graph ON events(graph_id, seq);
CREATE INDEX IF NOT EXISTS events_by_kind  ON events(graph_id, kind);

CREATE TABLE IF NOT EXISTS folds (
    graph_id TEXT PRIMARY KEY,
    fold_seq INTEGER NOT NULL,
    state    TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS graph_index (
    graph_id         TEXT PRIMARY KEY,
    title            TEXT NOT NULL,
    description      TEXT NOT NULL,
    task             TEXT NOT NULL,
    state            TEXT NOT NULL,
    parent           TEXT,
    created_at       INTEGER NOT NULL,
    updated_at       INTEGER NOT NULL,
    completed_at     INTEGER,
    nodes_total      INTEGER NOT NULL,
    nodes_done       INTEGER NOT NULL,
    nodes_outstanding INTEGER NOT NULL,
    nodes_awaiting   INTEGER NOT NULL,
    beliefs_contested INTEGER NOT NULL,
    tokens           INTEGER NOT NULL,
    micros_usd       INTEGER NOT NULL,
    tags             TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS graph_index_state ON graph_index(state, updated_at DESC);

-- `node_id` as the primary key IS the one-active-claim-per-node rule. Two
-- sessions racing produce a constraint violation for the loser rather than a
-- lost update, and the check cannot be forgotten by application logic.
CREATE TABLE IF NOT EXISTS active_claims (
    node_id    TEXT PRIMARY KEY,
    graph_id   TEXT NOT NULL,
    claim_id   TEXT NOT NULL,
    session_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS active_claims_by_session ON active_claims(session_id);
CREATE INDEX IF NOT EXISTS active_claims_by_graph   ON active_claims(graph_id);
"#;

pub fn init(conn: &Connection) -> Result<(), StoreError> {
    conn.pragma_update(None, "journal_mode", "WAL")?;
    conn.pragma_update(None, "foreign_keys", "ON")?;
    conn.pragma_update(None, "synchronous", "NORMAL")?;
    conn.busy_timeout(std::time::Duration::from_secs(30))?;
    conn.execute_batch(DDL)?;
    migrate(conn)
}

fn migrate(conn: &Connection) -> Result<(), StoreError> {
    let found: Option<i64> = conn
        .query_row("SELECT value FROM meta WHERE key = 'schema_version'", [], |r| {
            r.get::<_, String>(0)
        })
        .ok()
        .and_then(|s| s.parse().ok());

    match found {
        None => {
            conn.execute(
                "INSERT INTO meta (key, value) VALUES ('schema_version', ?1)",
                [SCHEMA_VERSION.to_string()],
            )?;
            Ok(())
        }
        Some(v) if v == SCHEMA_VERSION => Ok(()),
        Some(v) if v > SCHEMA_VERSION => {
            Err(StoreError::SchemaTooNew { found: v, supported: SCHEMA_VERSION })
        }
        Some(v) => Err(StoreError::SchemaTooOld { found: v, supported: SCHEMA_VERSION }),
    }
}
