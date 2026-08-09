//! The wire protocol.
//!
//! Every server frame carries `seq`, so a client that reconnects sends its last
//! seen value and receives everything since. A dropped connection never loses an
//! event.

use graphene_core::event::RevokeReason;
use graphene_core::graph::GraphState;
use graphene_core::id::{BeliefId, ClaimId, GraphId, NodeId, SessionId};
use graphene_core::time::Seq;
use serde::{Deserialize, Serialize};

pub const PROTOCOL_VERSION: u32 = 1;

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "t", rename_all = "kebab-case")]
pub enum ClientFrame {
    Hello {
        session: SessionId,
        graph: GraphId,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        label: Option<String>,
        protocol: u32,
        /// A filter, not a subscription list. `claim-revoked` and
        /// `graph-changed` are delivered regardless — a session must not be
        /// able to opt out of learning that its work was invalidated.
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        interests: Vec<EventKind>,
        /// Everything after this is replayed on connect.
        #[serde(default, skip_serializing_if = "Option::is_none")]
        since: Option<Seq>,
    },
    Heartbeat {
        session: SessionId,
    },
    Bye {
        session: SessionId,
    },
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum EventKind {
    NodeReady,
    HumanResolved,
    PremiseInvalidated,
    ClaimRevoked,
    NodeFailed,
    GraphChanged,
}

impl EventKind {
    /// Frames a session may never filter out.
    pub fn is_mandatory(&self) -> bool {
        matches!(self, EventKind::ClaimRevoked | EventKind::GraphChanged)
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "t", rename_all = "kebab-case")]
pub enum ServerFrame {
    Welcome {
        protocol: u32,
        graph: GraphId,
        seq: Seq,
        sessions: Vec<PeerView>,
    },
    Event {
        seq: Seq,
        #[serde(flatten)]
        event: PushEvent,
    },
    Error {
        code: ErrorCode,
        message: String,
    },
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct PeerView {
    pub session: SessionId,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub holding: Vec<NodeId>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "kebab-case")]
pub enum PushEvent {
    NodeReady { nodes: Vec<NodeId> },
    HumanResolved { node: NodeId, unblocked: Vec<NodeId> },
    PremiseInvalidated { belief: BeliefId, claims: Vec<ClaimId>, nodes: Vec<NodeId> },
    ClaimRevoked { claim: ClaimId, node: NodeId, reason: RevokeReason },
    NodeFailed { node: NodeId, skipped: Vec<NodeId> },
    GraphChanged { state: GraphState },
}

impl PushEvent {
    pub fn kind(&self) -> EventKind {
        match self {
            PushEvent::NodeReady { .. } => EventKind::NodeReady,
            PushEvent::HumanResolved { .. } => EventKind::HumanResolved,
            PushEvent::PremiseInvalidated { .. } => EventKind::PremiseInvalidated,
            PushEvent::ClaimRevoked { .. } => EventKind::ClaimRevoked,
            PushEvent::NodeFailed { .. } => EventKind::NodeFailed,
            PushEvent::GraphChanged { .. } => EventKind::GraphChanged,
        }
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ErrorCode {
    /// The client speaks a different protocol version. It must upgrade rather
    /// than continue against a stale contract.
    ProtocolMismatch,
    UnknownGraph,
    Malformed,
}

/// What `gr wait` prints and exits with.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "event", rename_all = "kebab-case")]
pub enum WaitOutcome {
    #[serde(untagged)]
    Pushed {
        seq: Seq,
        #[serde(flatten)]
        event: PushEvent,
    },
    #[serde(untagged)]
    TimedOut { event: TimedOut, graph_state: GraphState, awaiting: Vec<NodeId> },
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TimedOut {
    Timeout,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn mandatory_events_cannot_be_filtered_out() {
        assert!(EventKind::ClaimRevoked.is_mandatory());
        assert!(EventKind::GraphChanged.is_mandatory());
        assert!(!EventKind::NodeReady.is_mandatory());
    }

    #[test]
    fn frames_round_trip_with_a_tagged_wire_form() {
        let f = ServerFrame::Event { seq: Seq(42), event: PushEvent::NodeReady { nodes: vec![] } };
        let s = serde_json::to_string(&f).unwrap();
        assert!(s.contains("\"t\":\"event\""));
        assert!(s.contains("\"event\":\"node-ready\""));
        assert_eq!(serde_json::from_str::<ServerFrame>(&s).unwrap(), f);
    }

    #[test]
    fn a_hello_carries_a_resume_point() {
        let f = ClientFrame::Hello {
            session: SessionId("s1".into()),
            graph: GraphId::from_seed("g"),
            label: Some("impl".into()),
            protocol: PROTOCOL_VERSION,
            interests: vec![EventKind::NodeReady],
            since: Some(Seq(17)),
        };
        let s = serde_json::to_string(&f).unwrap();
        assert_eq!(serde_json::from_str::<ClientFrame>(&s).unwrap(), f);
    }
}
