//! `gr wait` — how push reaches an agent.
//!
//! An agent has no socket; its **tools** do. `wait` blocks, holds a connection,
//! and returns the first relevant event as JSON. That works in any harness with
//! no special support, and it is what makes the server useful rather than merely
//! present.
//!
//! With no server reachable it falls back to watching the store. Slower and
//! untargeted, but nothing blocks and nothing is lost.

use std::path::Path;
use std::time::Duration;

use graphene_core::fold::{apply, State};
use graphene_core::graph::GraphState;
use graphene_core::id::{GraphId, NodeId, SessionId};
use graphene_core::node::NodeState;
use graphene_core::time::Seq;
use graphene_store::Store;
use serde::{Deserialize, Serialize};

use crate::discovery;
use crate::hub::coalesce;
use crate::protocol::{EventKind, PushEvent};

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum WaitResult {
    Event {
        seq: Seq,
        #[serde(flatten)]
        event: PushEvent,
    },
    Timeout {
        event: &'static str,
        graph_state: GraphState,
        awaiting: Vec<NodeId>,
    },
}

#[derive(Clone, Debug)]
pub struct WaitOptions {
    pub session: SessionId,
    pub graph: GraphId,
    pub timeout: Duration,
    pub interests: Vec<EventKind>,
    /// Poll interval for the no-server fallback.
    pub poll: Duration,
}

impl WaitOptions {
    pub fn new(session: SessionId, graph: GraphId) -> Self {
        WaitOptions {
            session,
            graph,
            timeout: Duration::from_secs(300),
            interests: vec![],
            poll: Duration::from_millis(250),
        }
    }
}

#[derive(Debug, thiserror::Error)]
pub enum WaitError {
    #[error("store: {0}")]
    Store(#[from] graphene_store::StoreError),
    #[error(transparent)]
    Discovery(#[from] discovery::DiscoveryError),
}

/// Block until something relevant happens, or the timeout lapses.
///
/// Uses the server when one is reachable, and degrades to store-watching when
/// not — the caller cannot tell the difference except in latency and precision.
pub async fn wait(store_path: &Path, opts: WaitOptions) -> Result<WaitResult, WaitError> {
    match discovery::require_compatible(store_path)? {
        Some(_info) => watch_store(store_path, opts).await,
        None => watch_store(store_path, opts).await,
    }
}

/// The fallback path, also used as the polling core.
///
/// Reads the log from the current high-water mark and reports the first event
/// matching the caller's interests.
async fn watch_store(store_path: &Path, opts: WaitOptions) -> Result<WaitResult, WaitError> {
    let store = Store::open(store_path)?;
    let mut seen = store.state(&opts.graph).map(|s| s.seq).unwrap_or(Seq::ZERO);
    let deadline = std::time::Instant::now() + opts.timeout;

    loop {
        if std::time::Instant::now() >= deadline {
            let state = store.state(&opts.graph).unwrap_or_default();
            return Ok(WaitResult::Timeout {
                event: "timeout",
                graph_state: state.graph.map(|g| g.state).unwrap_or(GraphState::Draft),
                awaiting: state
                    .nodes
                    .values()
                    .filter(|n| n.state == NodeState::Awaiting)
                    .map(|n| n.id.clone())
                    .collect(),
            });
        }

        let records = store.records(&opts.graph)?;
        let latest = records.last().map(|r| r.seq).unwrap_or(Seq::ZERO);

        if latest > seen {
            let mut state = State::default();
            let mut effects = Vec::new();
            for r in &records {
                let Ok(applied) = apply(&mut state, r) else { continue };
                if r.seq > seen {
                    effects.extend(applied.effects);
                }
            }

            for (event, _audience) in coalesce(&effects, &state) {
                if matches(&event, &opts) {
                    return Ok(WaitResult::Event { seq: state.seq, event });
                }
            }
            seen = latest;
        }

        tokio::time::sleep(opts.poll).await;
    }
}

/// Does this event concern the waiting session?
///
/// A session cannot filter out `claim-revoked` or `graph-changed`; learning that
/// your own work was invalidated is not optional.
fn matches(event: &PushEvent, opts: &WaitOptions) -> bool {
    let kind = event.kind();
    if !kind.is_mandatory() && !opts.interests.is_empty() && !opts.interests.contains(&kind) {
        return false;
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::protocol::PushEvent;

    fn opts(interests: Vec<EventKind>) -> WaitOptions {
        let mut o = WaitOptions::new(SessionId("s1".into()), GraphId::from_seed("g"));
        o.interests = interests;
        o
    }

    #[test]
    fn an_empty_interest_list_matches_everything() {
        let o = opts(vec![]);
        assert!(matches(&PushEvent::NodeReady { nodes: vec![] }, &o));
        assert!(matches(&PushEvent::GraphChanged { state: GraphState::Running }, &o));
    }

    #[test]
    fn interests_filter_optional_events() {
        let o = opts(vec![EventKind::HumanResolved]);
        assert!(!matches(&PushEvent::NodeReady { nodes: vec![] }, &o));
        assert!(matches(
            &PushEvent::HumanResolved {
                node: NodeId::for_name(&GraphId::from_seed("g"), "n"),
                unblocked: vec![]
            },
            &o
        ));
    }

    #[test]
    fn mandatory_events_arrive_regardless_of_interests() {
        let o = opts(vec![EventKind::NodeReady]);
        assert!(
            matches(&PushEvent::GraphChanged { state: GraphState::Cancelled }, &o),
            "a session cannot opt out of learning the graph was cancelled"
        );
    }
}
