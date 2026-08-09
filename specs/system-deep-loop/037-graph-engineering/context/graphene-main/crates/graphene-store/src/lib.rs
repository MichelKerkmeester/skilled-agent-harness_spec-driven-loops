//! The Graphene store: an append-only SQLite log and the fold over it.
//!
//! Multiple sessions append to one graph concurrently. Every write takes
//! `BEGIN IMMEDIATE`, so writers are serialized by SQLite and a read-validate-
//! append sequence cannot interleave with another session's.

mod schema;

use std::path::{Path, PathBuf};

use graphene_core::event::{Event, Record};
use graphene_core::fold::{apply, fold, Applied, State};
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, GraphId, NodeId, SessionId};
use graphene_core::node::NodeState;
use graphene_core::time::{Seq, Timestamp};
use rusqlite::{params, Connection, OptionalExtension, Transaction};
use serde::{Deserialize, Serialize};

pub use schema::SCHEMA_VERSION;

pub const STORE_DIR: &str = ".graphene";
pub const STORE_FILE: &str = "store.db";

#[derive(Debug, thiserror::Error)]
pub enum StoreError {
    #[error("sqlite: {0}")]
    Sqlite(#[from] rusqlite::Error),
    #[error("json: {0}")]
    Json(#[from] serde_json::Error),
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
    #[error("fold: {0}")]
    Fold(#[from] graphene_core::fold::FoldError),
    #[error("no store found in `{0}` or any parent directory")]
    NotFound(PathBuf),
    #[error("unknown graph `{0}`")]
    UnknownGraph(String),
    #[error(
        "store schema is version {found}, this binary supports {supported}; upgrade the store"
    )]
    SchemaTooOld { found: i64, supported: i64 },
    #[error(
        "store schema is version {found}, this binary supports {supported}; upgrade the binary"
    )]
    SchemaTooNew { found: i64, supported: i64 },
    #[error("node `{node}` is already claimed by session `{session}`")]
    AlreadyClaimed { node: String, session: String },
    #[error("compaction would change the fold; aborted")]
    CompactionUnsafe,
    /// A structured refusal raised by a caller's decide closure. Carried through
    /// so `mutate` can roll back and the caller can return it verbatim.
    #[error("refused: {}", .0.reason)]
    Refusal(Box<graphene_core::refusal::Refusal>),
}

type Result<T> = std::result::Result<T, StoreError>;

/// A graph's headline metadata, without loading its fold.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct GraphSummary {
    pub id: GraphId,
    pub title: String,
    pub description: String,
    pub task: String,
    pub state: GraphState,
    pub parent: Option<GraphId>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    pub completed_at: Option<Timestamp>,
    pub nodes_total: u32,
    pub nodes_done: u32,
    pub nodes_outstanding: u32,
    pub nodes_awaiting: u32,
    pub beliefs_contested: u32,
    pub tokens: u64,
    pub micros_usd: u64,
    pub tags: Vec<String>,
}

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct ListFilter {
    /// Default is everything not yet terminal — the pending set is what a
    /// session needs on attach.
    pub include_terminal: bool,
    pub state: Option<GraphState>,
    pub tag: Option<String>,
    pub limit: Option<u32>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ActiveClaim {
    pub node: NodeId,
    pub graph: GraphId,
    pub claim: String,
    pub session: SessionId,
    pub expires_at: Timestamp,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct CompactionReport {
    pub removed: u64,
    pub kept: u64,
}

pub struct Store {
    conn: Connection,
    path: PathBuf,
}

impl Store {
    pub fn open(path: impl AsRef<Path>) -> Result<Store> {
        let path = path.as_ref().to_path_buf();
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        let conn = Connection::open(&path)?;
        schema::init(&conn)?;
        Ok(Store { conn, path })
    }

    pub fn open_in_memory() -> Result<Store> {
        let conn = Connection::open_in_memory()?;
        schema::init(&conn)?;
        Ok(Store { conn, path: PathBuf::from(":memory:") })
    }

    /// Walk up from `start` looking for `.graphene/store.db`, like `.git`.
    pub fn discover(start: impl AsRef<Path>) -> Result<Store> {
        let start = start.as_ref().canonicalize()?;
        for dir in start.ancestors() {
            let candidate = dir.join(STORE_DIR).join(STORE_FILE);
            if candidate.exists() {
                return Store::open(candidate);
            }
        }
        Err(StoreError::NotFound(start))
    }

    /// Find an existing store, or create one at `start/.graphene/store.db`.
    pub fn discover_or_init(start: impl AsRef<Path>) -> Result<Store> {
        match Store::discover(&start) {
            Ok(s) => Ok(s),
            Err(StoreError::NotFound(_)) => {
                Store::open(start.as_ref().join(STORE_DIR).join(STORE_FILE))
            }
            Err(e) => Err(e),
        }
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    // ---------------------------------------------------------------- append

    /// Append one event and update the fold in a single transaction.
    ///
    /// `BEGIN IMMEDIATE` is what makes the read-validate-append inside `mutate`
    /// safe across processes: the write lock is taken before the fold is read,
    /// so no other session can decide against the same state.
    pub fn append(
        &mut self,
        graph: &GraphId,
        actor: Actor,
        at: Timestamp,
        event: Event,
    ) -> Result<(Record, Applied)> {
        self.mutate(graph, |_state| Ok(vec![(actor, at, event)]))
            .map(|(mut records, applied)| (records.remove(0), applied))
    }

    /// Read the fold, decide what to write, and write it — all under one lock.
    ///
    /// Anything that must not race (claiming a node, validating a read-set,
    /// checking a graph transition) belongs here rather than in a read followed
    /// by an `append`.
    pub fn mutate<F>(&mut self, graph: &GraphId, decide: F) -> Result<(Vec<Record>, Applied)>
    where
        F: FnOnce(&State) -> Result<Vec<(Actor, Timestamp, Event)>>,
    {
        let tx = self.conn.transaction_with_behavior(rusqlite::TransactionBehavior::Immediate)?;

        let (mut state, _) = load_fold(&tx, graph)?;
        let intents = decide(&state)?;

        let mut records = Vec::with_capacity(intents.len());
        let mut applied = Applied::default();

        for (actor, at, event) in intents {
            let kind = event.kind().to_string();
            let payload = serde_json::to_string(&event)?;
            tx.execute(
                "INSERT INTO events (graph_id, kind, actor, at, payload) VALUES (?1, ?2, ?3, ?4, ?5)",
                params![graph.as_str(), kind, serde_json::to_string(&actor)?, at.0, payload],
            )?;
            let seq = Seq(tx.last_insert_rowid() as u64);

            let record = Record { seq, graph: graph.clone(), actor, at, event };
            let effects = apply(&mut state, &record)?;
            applied.effects.extend(effects.effects);
            records.push(record);
        }

        save_fold(&tx, graph, &state)?;
        sync_claims(&tx, graph, &state)?;
        sync_index(&tx, graph, &state)?;
        tx.commit()?;

        Ok((records, applied))
    }

    // ----------------------------------------------------------------- reads

    pub fn state(&self, graph: &GraphId) -> Result<State> {
        let tx = self.conn.unchecked_transaction()?;
        let (state, found) = load_fold(&tx, graph)?;
        if !found {
            return Err(StoreError::UnknownGraph(graph.to_string()));
        }
        Ok(state)
    }

    /// What the fold looked like at a point in time — "what did we believe when
    /// node X ran?"
    pub fn state_at(&self, graph: &GraphId, up_to: Seq) -> Result<State> {
        let records = self.records_through(graph, Some(up_to))?;
        Ok(fold(&records)?)
    }

    pub fn records(&self, graph: &GraphId) -> Result<Vec<Record>> {
        self.records_through(graph, None)
    }

    fn records_through(&self, graph: &GraphId, up_to: Option<Seq>) -> Result<Vec<Record>> {
        let mut stmt = self.conn.prepare(
            "SELECT seq, actor, at, payload FROM events
             WHERE graph_id = ?1 AND (?2 IS NULL OR seq <= ?2) ORDER BY seq",
        )?;
        let rows = stmt.query_map(params![graph.as_str(), up_to.map(|s| s.0 as i64)], |row| {
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, i64>(2)?,
                row.get::<_, String>(3)?,
            ))
        })?;

        let mut out = Vec::new();
        for row in rows {
            let (seq, actor, at, payload) = row?;
            out.push(Record {
                seq: Seq(seq as u64),
                graph: graph.clone(),
                actor: serde_json::from_str(&actor)?,
                at: Timestamp(at),
                event: serde_json::from_str(&payload)?,
            });
        }
        Ok(out)
    }

    pub fn list(&self, filter: &ListFilter) -> Result<Vec<GraphSummary>> {
        let mut sql = String::from("SELECT * FROM graph_index WHERE 1=1");
        if !filter.include_terminal && filter.state.is_none() {
            sql.push_str(" AND state NOT IN ('done','failed','cancelled')");
        }
        if let Some(s) = &filter.state {
            sql.push_str(&format!(" AND state = '{}'", s.as_str()));
        }
        if let Some(t) = &filter.tag {
            sql.push_str(&format!(" AND tags LIKE '%\"{}\"%'", t.replace('\'', "")));
        }
        sql.push_str(" ORDER BY updated_at DESC");
        if let Some(n) = filter.limit {
            sql.push_str(&format!(" LIMIT {n}"));
        }

        let mut stmt = self.conn.prepare(&sql)?;
        let rows = stmt.query_map([], |row| {
            Ok(GraphSummary {
                id: GraphId::parse(&row.get::<_, String>("graph_id")?).expect("stored id"),
                title: row.get("title")?,
                description: row.get("description")?,
                task: row.get("task")?,
                state: parse_graph_state(&row.get::<_, String>("state")?),
                parent: row
                    .get::<_, Option<String>>("parent")?
                    .and_then(|s| GraphId::parse(&s).ok()),
                created_at: Timestamp(row.get("created_at")?),
                updated_at: Timestamp(row.get("updated_at")?),
                completed_at: row.get::<_, Option<i64>>("completed_at")?.map(Timestamp),
                nodes_total: row.get::<_, i64>("nodes_total")? as u32,
                nodes_done: row.get::<_, i64>("nodes_done")? as u32,
                nodes_outstanding: row.get::<_, i64>("nodes_outstanding")? as u32,
                nodes_awaiting: row.get::<_, i64>("nodes_awaiting")? as u32,
                beliefs_contested: row.get::<_, i64>("beliefs_contested")? as u32,
                tokens: row.get::<_, i64>("tokens")? as u64,
                micros_usd: row.get::<_, i64>("micros_usd")? as u64,
                tags: serde_json::from_str(&row.get::<_, String>("tags")?).unwrap_or_default(),
            })
        })?;
        rows.collect::<std::result::Result<Vec<_>, _>>().map_err(Into::into)
    }

    /// Claims whose lease has run out as of `now`.
    ///
    /// Expiry is a query-time view, never stored state — a fold that consulted
    /// the clock would not replay.
    /// When an event was recorded. A human node's deadline is measured from the
    /// `asked_at` seq, and only the log knows what time that was.
    pub fn event_time(&self, graph: &GraphId, seq: Seq) -> Result<Option<Timestamp>> {
        let mut stmt =
            self.conn.prepare("SELECT at FROM events WHERE graph_id = ?1 AND seq = ?2")?;
        let mut rows = stmt.query(params![graph.as_str(), seq.0])?;
        Ok(match rows.next()? {
            Some(r) => Some(Timestamp(r.get(0)?)),
            None => None,
        })
    }

    pub fn expired_claims(&self, now: Timestamp) -> Result<Vec<ActiveClaim>> {
        let mut stmt = self.conn.prepare(
            "SELECT node_id, graph_id, claim_id, session_id, expires_at
             FROM active_claims WHERE expires_at <= ?1 ORDER BY node_id",
        )?;
        let rows = stmt.query_map(params![now.0], read_active_claim)?;
        rows.collect::<std::result::Result<Vec<_>, _>>().map_err(Into::into)
    }

    pub fn claims_of(&self, session: &SessionId) -> Result<Vec<ActiveClaim>> {
        let mut stmt = self.conn.prepare(
            "SELECT node_id, graph_id, claim_id, session_id, expires_at
             FROM active_claims WHERE session_id = ?1 ORDER BY node_id",
        )?;
        let rows = stmt.query_map(params![session.0], read_active_claim)?;
        rows.collect::<std::result::Result<Vec<_>, _>>().map_err(Into::into)
    }

    // ----------------------------------------------------------- maintenance

    /// Discard every cache and re-derive it from the log.
    ///
    /// Always safe. If this ever changes a served answer, something other than
    /// the log has become load-bearing.
    pub fn rebuild(&mut self) -> Result<()> {
        let graphs = self.graph_ids()?;
        let tx = self.conn.transaction_with_behavior(rusqlite::TransactionBehavior::Immediate)?;
        tx.execute("DELETE FROM folds", [])?;
        tx.execute("DELETE FROM graph_index", [])?;
        tx.execute("DELETE FROM active_claims", [])?;
        for g in &graphs {
            let records = records_in_tx(&tx, g)?;
            let state = fold(&records)?;
            save_fold(&tx, g, &state)?;
            sync_claims(&tx, g, &state)?;
            sync_index(&tx, g, &state)?;
        }
        tx.commit()?;
        Ok(())
    }

    /// Collapse records whose removal provably cannot change the fold, then
    /// verify that claim before committing.
    pub fn compact(&mut self) -> Result<CompactionReport> {
        let graphs = self.graph_ids()?;
        let mut before = Vec::new();
        for g in &graphs {
            before.push((g.clone(), self.state(g)?));
        }

        let tx = self.conn.transaction_with_behavior(rusqlite::TransactionBehavior::Immediate)?;
        let mut removed = 0u64;

        for (g, _) in &before {
            let records = records_in_tx(&tx, g)?;
            for drop_seq in compactable(&records) {
                tx.execute("DELETE FROM events WHERE seq = ?1", params![drop_seq.0 as i64])?;
                removed += 1;
            }
        }

        for (g, prior) in &before {
            let records = records_in_tx(&tx, g)?;
            let after = fold(&records)?;
            if !folds_equivalent(prior, &after) {
                return Err(StoreError::CompactionUnsafe);
            }
            save_fold(&tx, g, &after)?;
        }

        let kept: i64 = tx.query_row("SELECT COUNT(*) FROM events", [], |r| r.get(0))?;
        tx.commit()?;
        Ok(CompactionReport { removed, kept: kept as u64 })
    }

    pub fn graph_ids(&self) -> Result<Vec<GraphId>> {
        let mut stmt =
            self.conn.prepare("SELECT DISTINCT graph_id FROM events ORDER BY graph_id")?;
        let rows = stmt.query_map([], |r| r.get::<_, String>(0))?;
        let mut out = Vec::new();
        for r in rows {
            if let Ok(id) = GraphId::parse(&r?) {
                out.push(id);
            }
        }
        Ok(out)
    }

    /// Every record, newline-delimited JSON — for git, diffing, and replay.
    pub fn export(&self, graph: &GraphId) -> Result<String> {
        let mut out = String::new();
        for r in self.records(graph)? {
            out.push_str(&serde_json::to_string(&r)?);
            out.push('\n');
        }
        Ok(out)
    }

    /// Import a JSONL log, preserving its sequence numbers.
    pub fn import(&mut self, jsonl: &str) -> Result<u64> {
        let tx = self.conn.transaction_with_behavior(rusqlite::TransactionBehavior::Immediate)?;
        let mut count = 0u64;
        let mut graphs: Vec<GraphId> = Vec::new();

        for line in jsonl.lines().filter(|l| !l.trim().is_empty()) {
            let record: Record = serde_json::from_str(line)?;
            tx.execute(
                "INSERT INTO events (seq, graph_id, kind, actor, at, payload)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
                params![
                    record.seq.0 as i64,
                    record.graph.as_str(),
                    record.event.kind(),
                    serde_json::to_string(&record.actor)?,
                    record.at.0,
                    serde_json::to_string(&record.event)?,
                ],
            )?;
            if !graphs.contains(&record.graph) {
                graphs.push(record.graph.clone());
            }
            count += 1;
        }

        for g in &graphs {
            let records = records_in_tx(&tx, g)?;
            let state = fold(&records)?;
            save_fold(&tx, g, &state)?;
            sync_claims(&tx, g, &state)?;
            sync_index(&tx, g, &state)?;
        }
        tx.commit()?;
        Ok(count)
    }
}

// ------------------------------------------------------------------ helpers

fn read_active_claim(row: &rusqlite::Row<'_>) -> rusqlite::Result<ActiveClaim> {
    Ok(ActiveClaim {
        node: NodeId::parse(&row.get::<_, String>(0)?).expect("stored id"),
        graph: GraphId::parse(&row.get::<_, String>(1)?).expect("stored id"),
        claim: row.get(2)?,
        session: SessionId(row.get(3)?),
        expires_at: Timestamp(row.get(4)?),
    })
}

fn load_fold(tx: &Transaction<'_>, graph: &GraphId) -> Result<(State, bool)> {
    let row: Option<String> = tx
        .query_row("SELECT state FROM folds WHERE graph_id = ?1", params![graph.as_str()], |r| {
            r.get(0)
        })
        .optional()?;
    match row {
        Some(json) => Ok((serde_json::from_str(&json)?, true)),
        None => Ok((State::default(), false)),
    }
}

fn save_fold(tx: &Transaction<'_>, graph: &GraphId, state: &State) -> Result<()> {
    tx.execute(
        "INSERT INTO folds (graph_id, fold_seq, state) VALUES (?1, ?2, ?3)
         ON CONFLICT(graph_id) DO UPDATE SET fold_seq = excluded.fold_seq, state = excluded.state",
        params![graph.as_str(), state.seq.0 as i64, serde_json::to_string(state)?],
    )?;
    Ok(())
}

fn sync_claims(tx: &Transaction<'_>, graph: &GraphId, state: &State) -> Result<()> {
    tx.execute("DELETE FROM active_claims WHERE graph_id = ?1", params![graph.as_str()])?;
    for (node, claim_id) in &state.active_claims {
        let Some(claim) = state.claims.get(claim_id) else { continue };
        tx.execute(
            "INSERT INTO active_claims (node_id, graph_id, claim_id, session_id, expires_at)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params![
                node.as_str(),
                graph.as_str(),
                claim_id.as_str(),
                claim.session.0,
                claim.expires_at.0 .0
            ],
        )?;
    }
    Ok(())
}

fn sync_index(tx: &Transaction<'_>, graph: &GraphId, state: &State) -> Result<()> {
    let Some(g) = &state.graph else { return Ok(()) };

    let nodes_total = state.nodes.len() as i64;
    let nodes_done = state.nodes.values().filter(|n| n.state == NodeState::Done).count() as i64;
    let nodes_outstanding =
        state.nodes.values().filter(|n| n.state.is_outstanding()).count() as i64;
    let nodes_awaiting =
        state.nodes.values().filter(|n| n.state == NodeState::Awaiting).count() as i64;
    let contested =
        state.beliefs.values().filter(|b| b.state == graphene_core::TruthState::Both).count()
            as i64;

    tx.execute(
        "INSERT INTO graph_index (
            graph_id, title, description, task, state, parent,
            created_at, updated_at, completed_at,
            nodes_total, nodes_done, nodes_outstanding, nodes_awaiting,
            beliefs_contested, tokens, micros_usd, tags
         ) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15,?16,?17)
         ON CONFLICT(graph_id) DO UPDATE SET
            title=excluded.title, description=excluded.description, task=excluded.task,
            state=excluded.state, parent=excluded.parent,
            updated_at=excluded.updated_at, completed_at=excluded.completed_at,
            nodes_total=excluded.nodes_total, nodes_done=excluded.nodes_done,
            nodes_outstanding=excluded.nodes_outstanding, nodes_awaiting=excluded.nodes_awaiting,
            beliefs_contested=excluded.beliefs_contested,
            tokens=excluded.tokens, micros_usd=excluded.micros_usd, tags=excluded.tags",
        params![
            graph.as_str(),
            g.title,
            g.description,
            g.task,
            g.state.as_str(),
            g.parent.as_ref().map(|p| p.as_str()),
            g.created_at.0,
            g.updated_at.0,
            g.completed_at.map(|t| t.0),
            nodes_total,
            nodes_done,
            nodes_outstanding,
            nodes_awaiting,
            contested,
            g.spend.tokens as i64,
            g.spend.micros_usd as i64,
            serde_json::to_string(&g.tags)?,
        ],
    )?;
    Ok(())
}

fn records_in_tx(tx: &Transaction<'_>, graph: &GraphId) -> Result<Vec<Record>> {
    let mut stmt =
        tx.prepare("SELECT seq, actor, at, payload FROM events WHERE graph_id = ?1 ORDER BY seq")?;
    let rows = stmt.query_map(params![graph.as_str()], |row| {
        Ok((
            row.get::<_, i64>(0)?,
            row.get::<_, String>(1)?,
            row.get::<_, i64>(2)?,
            row.get::<_, String>(3)?,
        ))
    })?;
    let mut out = Vec::new();
    for row in rows {
        let (seq, actor, at, payload) = row?;
        out.push(Record {
            seq: Seq(seq as u64),
            graph: graph.clone(),
            actor: serde_json::from_str(&actor)?,
            at: Timestamp(at),
            event: serde_json::from_str(&payload)?,
        });
    }
    Ok(out)
}

/// Sequence numbers safe to drop: a run of consecutive heartbeats keeps only its
/// last, and every check result but the newest goes.
fn compactable(records: &[Record]) -> Vec<Seq> {
    let mut drop = Vec::new();

    let heartbeats: Vec<usize> = records
        .iter()
        .enumerate()
        .filter(|(_, r)| matches!(r.event, Event::SessionHeartbeat { .. }))
        .map(|(i, _)| i)
        .collect();
    for pair in heartbeats.windows(2) {
        if pair[1] == pair[0] + 1 {
            drop.push(records[pair[0]].seq);
        }
    }

    let checks: Vec<usize> = records
        .iter()
        .enumerate()
        .filter(|(_, r)| matches!(r.event, Event::CheckResult { .. }))
        .map(|(i, _)| i)
        .collect();
    if checks.len() > 1 {
        for i in &checks[..checks.len() - 1] {
            drop.push(records[*i].seq);
        }
    }

    drop.sort();
    drop.dedup();
    drop
}

/// Compare folds ignoring `seq`, which necessarily moves when records are
/// dropped. Everything a caller can observe must be identical.
fn folds_equivalent(a: &State, b: &State) -> bool {
    let mut a = a.clone();
    let mut b = b.clone();
    a.seq = Seq::ZERO;
    b.seq = Seq::ZERO;
    a.sessions.values_mut().for_each(|s| s.last_seen = Seq::ZERO);
    b.sessions.values_mut().for_each(|s| s.last_seen = Seq::ZERO);
    a == b
}

fn parse_graph_state(s: &str) -> GraphState {
    match s {
        "draft" => GraphState::Draft,
        "checked" => GraphState::Checked,
        "reviewed" => GraphState::Reviewed,
        "approved" => GraphState::Approved,
        "running" => GraphState::Running,
        "done" => GraphState::Done,
        "failed" => GraphState::Failed,
        _ => GraphState::Cancelled,
    }
}
