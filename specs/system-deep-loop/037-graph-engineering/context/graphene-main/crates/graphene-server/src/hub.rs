//! Connection registry, presence, and routing.
//!
//! Routing precision is the point: `premise-invalidated` reaches only the
//! sessions standing on the dead belief. A broadcast everyone learns to ignore
//! is not a notification.

use std::collections::{BTreeMap, BTreeSet};
use std::sync::Arc;

use graphene_core::fold::{Effect, State};
use graphene_core::id::{GraphId, NodeId, SessionId};
use graphene_core::time::Seq;
use tokio::sync::{mpsc, RwLock};

use crate::protocol::{EventKind, PeerView, PushEvent, ServerFrame};

#[derive(Debug)]
pub struct Connection {
    pub session: SessionId,
    pub graph: GraphId,
    pub label: Option<String>,
    pub interests: Vec<EventKind>,
    pub tx: mpsc::UnboundedSender<ServerFrame>,
}

impl Connection {
    fn wants(&self, kind: EventKind) -> bool {
        kind.is_mandatory() || self.interests.is_empty() || self.interests.contains(&kind)
    }
}

#[derive(Default)]
pub struct Hub {
    connections: RwLock<BTreeMap<SessionId, Arc<Connection>>>,
    /// Sessions whose socket was open and then closed.
    ///
    /// Presence releases work for these and **only** these. A session that never
    /// connected has not gone anywhere — it may be driving the CLI without ever
    /// opening a socket, and yanking its claim would be a bug, not a recovery.
    departed: RwLock<BTreeSet<SessionId>>,
}

impl Hub {
    pub fn new() -> Arc<Hub> {
        Arc::new(Hub::default())
    }

    pub async fn join(&self, conn: Connection) -> Arc<Connection> {
        let conn = Arc::new(conn);
        self.departed.write().await.remove(&conn.session);
        self.connections.write().await.insert(conn.session.clone(), Arc::clone(&conn));
        conn
    }

    pub async fn leave(&self, session: &SessionId) -> Option<Arc<Connection>> {
        let gone = self.connections.write().await.remove(session);
        if gone.is_some() {
            self.departed.write().await.insert(session.clone());
        }
        gone
    }

    /// Sessions that connected and then lost their socket, and whose work has
    /// not yet been reclaimed.
    pub async fn departed(&self) -> BTreeSet<SessionId> {
        self.departed.read().await.clone()
    }

    pub async fn forget_departed(&self, session: &SessionId) {
        self.departed.write().await.remove(session);
    }

    pub async fn is_connected(&self, session: &SessionId) -> bool {
        self.connections.read().await.contains_key(session)
    }

    pub async fn peers(&self, graph: &GraphId, state: &State) -> Vec<PeerView> {
        self.connections
            .read()
            .await
            .values()
            .filter(|c| &c.graph == graph)
            .map(|c| PeerView {
                session: c.session.clone(),
                label: c.label.clone(),
                holding: holding(state, &c.session),
            })
            .collect()
    }

    pub async fn sessions_on(&self, graph: &GraphId) -> Vec<SessionId> {
        self.connections
            .read()
            .await
            .values()
            .filter(|c| &c.graph == graph)
            .map(|c| c.session.clone())
            .collect()
    }

    /// Deliver to a computed audience. Frames are dropped for a session whose
    /// receiver has gone away; the watcher's presence sweep cleans it up.
    pub async fn deliver(
        &self,
        graph: &GraphId,
        seq: Seq,
        event: PushEvent,
        audience: &Audience,
    ) -> usize {
        let kind = event.kind();
        let frame = ServerFrame::Event { seq, event };
        let mut sent = 0;

        for conn in self.connections.read().await.values() {
            if &conn.graph != graph || !conn.wants(kind) || !audience.includes(&conn.session) {
                continue;
            }
            if conn.tx.send(frame.clone()).is_ok() {
                sent += 1;
            }
        }
        sent
    }
}

/// Who an event goes to.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Audience {
    All,
    Only(Vec<SessionId>),
}

impl Audience {
    fn includes(&self, s: &SessionId) -> bool {
        match self {
            Audience::All => true,
            Audience::Only(list) => list.contains(s),
        }
    }
}

/// Translate a fold effect into a push, and decide who hears it.
///
/// Returning `None` means the effect is internal — real state movement that no
/// session needs woken for.
pub fn route(effect: &Effect, state: &State) -> Option<(PushEvent, Audience)> {
    match effect {
        Effect::NodeReady { node } => {
            Some((PushEvent::NodeReady { nodes: vec![node.clone()] }, Audience::All))
        }

        Effect::HumanResolved { node, unblocked } => Some((
            PushEvent::HumanResolved { node: node.clone(), unblocked: unblocked.clone() },
            Audience::All,
        )),

        Effect::PremiseInvalidated { belief, claims, nodes } => {
            let holders: Vec<SessionId> = claims
                .iter()
                .filter_map(|c| state.claims.get(c).map(|claim| claim.session.clone()))
                .collect();
            Some((
                PushEvent::PremiseInvalidated {
                    belief: belief.clone(),
                    claims: claims.clone(),
                    nodes: nodes.clone(),
                },
                Audience::Only(holders),
            ))
        }

        Effect::ClaimRevoked { claim, node, reason } => {
            let holder = state.claims.get(claim).map(|c| c.session.clone());
            Some((
                PushEvent::ClaimRevoked {
                    claim: claim.clone(),
                    node: node.clone(),
                    reason: *reason,
                },
                match holder {
                    Some(s) => Audience::Only(vec![s]),
                    None => Audience::All,
                },
            ))
        }

        Effect::NodeSkipped { .. } => None,
        Effect::NodeBlocked { .. } => None,
        Effect::BeliefStateChanged { .. } => None,

        Effect::GraphStateChanged { to } => {
            Some((PushEvent::GraphChanged { state: *to }, Audience::All))
        }
    }
}

/// Collapse a burst into the frames worth sending.
///
/// A run of `node-ready` becomes one frame naming every node, and the skipped
/// set produced by a failure is attached to its `node-failed` rather than
/// arriving as its own noise.
pub fn coalesce(effects: &[Effect], state: &State) -> Vec<(PushEvent, Audience)> {
    let mut ready: Vec<NodeId> = Vec::new();
    let mut skipped: Vec<NodeId> = Vec::new();
    let mut out: Vec<(PushEvent, Audience)> = Vec::new();

    for e in effects {
        match e {
            Effect::NodeReady { node } => ready.push(node.clone()),
            Effect::NodeSkipped { node } => skipped.push(node.clone()),
            other => {
                if let Some(routed) = route(other, state) {
                    out.push(routed);
                }
            }
        }
    }

    if !ready.is_empty() {
        ready.sort();
        ready.dedup();
        out.insert(0, (PushEvent::NodeReady { nodes: ready }, Audience::All));
    }

    if !skipped.is_empty() {
        skipped.sort();
        skipped.dedup();
        if let Some(failed) = state
            .nodes
            .values()
            .find(|n| n.state == graphene_core::node::NodeState::Failed)
            .map(|n| n.id.clone())
        {
            out.push((PushEvent::NodeFailed { node: failed, skipped }, Audience::All));
        }
    }

    out
}

fn holding(state: &State, session: &SessionId) -> Vec<NodeId> {
    let mut v: Vec<NodeId> = state
        .active_claims
        .iter()
        .filter(|(_, cid)| state.claims.get(*cid).is_some_and(|c| &c.session == session))
        .map(|(n, _)| n.clone())
        .collect();
    v.sort();
    v
}

#[cfg(test)]
mod tests {
    use super::*;
    use graphene_core::id::{BeliefId, ClaimId};

    fn sid(s: &str) -> SessionId {
        SessionId(s.into())
    }

    #[tokio::test]
    async fn presence_only_tracks_sessions_that_actually_connected() {
        let hub = Hub::new();
        let (tx, _rx) = mpsc::unbounded_channel();
        hub.join(Connection {
            session: sid("s1"),
            graph: GraphId::from_seed("g"),
            label: None,
            interests: vec![],
            tx,
        })
        .await;

        assert!(hub.departed().await.is_empty(), "a live session has not departed");
        assert!(
            !hub.departed().await.contains(&sid("never-seen")),
            "a session that never connected is not departed either"
        );

        hub.leave(&sid("s1")).await;
        assert!(hub.departed().await.contains(&sid("s1")));

        hub.forget_departed(&sid("s1")).await;
        assert!(hub.departed().await.is_empty(), "reclaimed work is forgotten");
    }

    #[test]
    fn interests_filter_optional_events_but_not_mandatory_ones() {
        let (tx, _rx) = mpsc::unbounded_channel();
        let conn = Connection {
            session: sid("s1"),
            graph: GraphId::from_seed("g"),
            label: None,
            interests: vec![EventKind::NodeReady],
            tx,
        };
        assert!(conn.wants(EventKind::NodeReady));
        assert!(!conn.wants(EventKind::HumanResolved));
        assert!(conn.wants(EventKind::ClaimRevoked), "a session cannot opt out of this");
        assert!(conn.wants(EventKind::GraphChanged), "nor this");
    }

    #[test]
    fn an_empty_interest_list_means_everything() {
        let (tx, _rx) = mpsc::unbounded_channel();
        let conn = Connection {
            session: sid("s1"),
            graph: GraphId::from_seed("g"),
            label: None,
            interests: vec![],
            tx,
        };
        for k in [
            EventKind::NodeReady,
            EventKind::HumanResolved,
            EventKind::PremiseInvalidated,
            EventKind::NodeFailed,
        ] {
            assert!(conn.wants(k));
        }
    }

    #[test]
    fn premise_invalidation_routes_only_to_holders() {
        let graph = GraphId::from_seed("g");
        let mut state = State::default();
        let node = NodeId::for_name(&graph, "work");
        let claim = ClaimId::for_claim(&node, &sid("s1"), 1);
        state.claims.insert(
            claim.clone(),
            graphene_core::node::Claim {
                id: claim.clone(),
                session: sid("s1"),
                read_set: vec![],
                leased_at: graphene_core::time::Timestamp(0),
                expires_at: graphene_core::time::Deadline(graphene_core::time::Timestamp(1)),
            },
        );

        let belief = BeliefId::for_content(&graph, "c", "derived", "s");
        let effect = Effect::PremiseInvalidated { belief, claims: vec![claim], nodes: vec![node] };

        let (_, audience) = route(&effect, &state).unwrap();
        assert_eq!(audience, Audience::Only(vec![sid("s1")]));
    }

    #[test]
    fn internal_effects_wake_nobody() {
        let state = State::default();
        let graph = GraphId::from_seed("g");
        let belief = BeliefId::for_content(&graph, "c", "derived", "s");
        assert!(route(
            &Effect::BeliefStateChanged { belief, to: graphene_core::TruthState::Out, rule: None },
            &state
        )
        .is_none());
    }

    #[test]
    fn a_burst_of_ready_nodes_becomes_one_frame() {
        let graph = GraphId::from_seed("g");
        let state = State::default();
        let effects: Vec<Effect> = (0..5)
            .map(|i| Effect::NodeReady { node: NodeId::for_name(&graph, &format!("n{i}")) })
            .collect();

        let out = coalesce(&effects, &state);
        assert_eq!(out.len(), 1);
        match &out[0].0 {
            PushEvent::NodeReady { nodes } => assert_eq!(nodes.len(), 5),
            other => panic!("expected one coalesced frame, got {other:?}"),
        }
    }
}
