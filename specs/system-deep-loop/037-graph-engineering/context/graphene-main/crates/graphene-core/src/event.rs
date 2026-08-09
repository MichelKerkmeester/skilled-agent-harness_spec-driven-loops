//! The event log: the only thing that is true.
//!
//! Everything else in Graphene is a fold over these. No event is ever updated or
//! deleted (I1, I2).

use serde::{Deserialize, Serialize};

use crate::belief::{
    BeliefEdge, CascadeRule, Contradiction, Fidelity, Provenance, Sensitivity, SourceRef,
    SupportMode, TruthState,
};
use crate::budget::{Budget, Limits, Spend};
use crate::graph::GraphState;
use crate::id::{Actor, BeliefId, ClaimId, FindingId, GraphId, NodeId, NogoodId, SessionId};
use crate::node::{EdgeKind, Node, NodeState, TimeoutPolicy};
use crate::time::{Deadline, ObservedAt, Seq, Timestamp};

/// A log record. `seq` is assigned by the store on append, never by a caller.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Record {
    pub seq: Seq,
    pub graph: GraphId,
    pub actor: Actor,
    /// Wall time, informational. The fold never reads it.
    pub at: Timestamp,
    #[serde(flatten)]
    pub event: Event,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(tag = "t", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Event {
    GraphCreate {
        seed: String,
        title: String,
        #[serde(default)]
        description: String,
        task: String,
        #[serde(default)]
        budget: Budget,
        #[serde(default)]
        limits: Limits,
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        tags: Vec<String>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        parent: Option<GraphId>,
    },
    GraphState {
        to: GraphState,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        reason: Option<String>,
    },

    NodeAdd {
        node: Box<Node>,
    },
    NodeUpdate {
        id: NodeId,
        node: Box<Node>,
    },
    NodeRemove {
        id: NodeId,
    },
    EdgeAdd {
        from: NodeId,
        to: NodeId,
        kind: EdgeKind,
    },
    /// `forEach` materialization. Children carry deterministic ids derived from
    /// `(parent, index)`.
    NodeExpand {
        parent: NodeId,
        children: Vec<Node>,
    },
    NodeState {
        id: NodeId,
        to: NodeState,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        reason: Option<String>,
    },

    Claim {
        id: ClaimId,
        node: NodeId,
        session: SessionId,
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        read_set: Vec<BeliefId>,
        expires_at: Deadline,
    },
    ClaimRelease {
        id: ClaimId,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        reason: Option<String>,
    },
    ClaimRevoke {
        id: ClaimId,
        reason: RevokeReason,
    },
    Checkpoint {
        node: NodeId,
        state: serde_json::Value,
    },
    NodeDone {
        node: NodeId,
        output: serde_json::Value,
        #[serde(default)]
        spend: Spend,
    },
    NodeFail {
        node: NodeId,
        reason: String,
        #[serde(default)]
        retryable: bool,
    },

    HumanAsk {
        node: NodeId,
        ask: String,
        options: Vec<String>,
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        context: Vec<BeliefId>,
        /// Which dependents each answer releases. Anything an answer does not
        /// name is skipped, which is what makes the gate a gate.
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        consequence: Vec<(String, Vec<NodeId>)>,
        on_timeout: TimeoutPolicy,
    },
    /// Raised past its deadline and still unanswered. Recorded once, so the
    /// sweep is idempotent and the escalation is a fact rather than a repeated
    /// side effect.
    HumanEscalate {
        node: NodeId,
        waited_ms: i64,
    },
    HumanResolve {
        node: NodeId,
        by: String,
        choice: String,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        input: Option<serde_json::Value>,
    },

    BeliefAdd {
        id: BeliefId,
        provenance: Provenance,
        fidelity: Fidelity,
        content: String,
        summary: String,
        source: SourceRef,
        observed_at: ObservedAt,
        #[serde(default)]
        support_mode: SupportMode,
        #[serde(default)]
        sensitivity: Sensitivity,
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        edges: Vec<(BeliefEdge, BeliefId)>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        produced_by: Option<NodeId>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        scoped_to: Option<NodeId>,
    },
    Retract {
        id: BeliefId,
        reason: String,
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        evidence: Vec<BeliefId>,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        rule: Option<CascadeRule>,
    },
    Reinstate {
        id: BeliefId,
        reason: String,
    },
    Supersede {
        old: BeliefId,
        new: BeliefId,
        reason: String,
        /// Required when superseding a `tool-observation`. Graphene records that
        /// a check was claimed; it cannot verify it, because it has no notion of
        /// a turn (spec 02 §3.1).
        #[serde(default, skip_serializing_if = "Option::is_none")]
        observation_proof: Option<serde_json::Value>,
    },
    Contradict {
        id: BeliefId,
        reason: String,
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        evidence: Vec<BeliefId>,
    },
    Uncontradict {
        id: BeliefId,
        reason: String,
    },
    Corroborate {
        id: BeliefId,
        by: BeliefId,
    },
    Stale {
        source: SourceRef,
    },
    Pin {
        id: BeliefId,
        on: bool,
    },
    Nogood {
        id: NogoodId,
        members: Vec<BeliefId>,
        note: String,
    },

    SessionAttach {
        session: SessionId,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        label: Option<String>,
    },
    SessionDetach {
        session: SessionId,
    },
    SessionHeartbeat {
        session: SessionId,
    },

    CheckResult {
        passed: bool,
        #[serde(default)]
        errors: u32,
        #[serde(default)]
        warnings: u32,
        /// Which codes fired, and how often. Counts alone cannot answer "are we
        /// still writing fake edges?", which is the signal spec 09 §7 wants.
        #[serde(default, skip_serializing_if = "Vec::is_empty")]
        codes: Vec<(String, u32)>,
    },
    ReviewFinding {
        id: FindingId,
        review_node: NodeId,
        target: NodeId,
        severity: String,
        body: String,
    },
    FindingResolve {
        id: FindingId,
        resolution: FindingResolution,
        #[serde(default, skip_serializing_if = "Option::is_none")]
        reason: Option<String>,
    },

    /// Written by the caller, opaque to the fold. Exists so a caller's
    /// non-deterministic decisions replay (I5).
    ModelCall {
        purpose: String,
        model_id: String,
        prompt_hash: String,
        output: serde_json::Value,
    },
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RevokeReason {
    LeaseExpired,
    SessionGone,
    Preempted,
    GraphCancelled,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FindingResolution {
    Applied,
    Rejected,
}

impl Event {
    pub fn kind(&self) -> &'static str {
        match self {
            Event::GraphCreate { .. } => "GRAPH_CREATE",
            Event::GraphState { .. } => "GRAPH_STATE",
            Event::NodeAdd { .. } => "NODE_ADD",
            Event::NodeUpdate { .. } => "NODE_UPDATE",
            Event::NodeRemove { .. } => "NODE_REMOVE",
            Event::EdgeAdd { .. } => "EDGE_ADD",
            Event::NodeExpand { .. } => "NODE_EXPAND",
            Event::NodeState { .. } => "NODE_STATE",
            Event::Claim { .. } => "CLAIM",
            Event::ClaimRelease { .. } => "CLAIM_RELEASE",
            Event::ClaimRevoke { .. } => "CLAIM_REVOKE",
            Event::Checkpoint { .. } => "CHECKPOINT",
            Event::NodeDone { .. } => "NODE_DONE",
            Event::NodeFail { .. } => "NODE_FAIL",
            Event::HumanAsk { .. } => "HUMAN_ASK",
            Event::HumanEscalate { .. } => "HUMAN_ESCALATE",
            Event::HumanResolve { .. } => "HUMAN_RESOLVE",
            Event::BeliefAdd { .. } => "BELIEF_ADD",
            Event::Retract { .. } => "RETRACT",
            Event::Reinstate { .. } => "REINSTATE",
            Event::Supersede { .. } => "SUPERSEDE",
            Event::Contradict { .. } => "CONTRADICT",
            Event::Uncontradict { .. } => "UNCONTRADICT",
            Event::Corroborate { .. } => "CORROBORATE",
            Event::Stale { .. } => "STALE",
            Event::Pin { .. } => "PIN",
            Event::Nogood { .. } => "NOGOOD",
            Event::SessionAttach { .. } => "SESSION_ATTACH",
            Event::SessionDetach { .. } => "SESSION_DETACH",
            Event::SessionHeartbeat { .. } => "SESSION_HEARTBEAT",
            Event::CheckResult { .. } => "CHECK_RESULT",
            Event::ReviewFinding { .. } => "REVIEW_FINDING",
            Event::FindingResolve { .. } => "FINDING_RESOLVE",
            Event::ModelCall { .. } => "MODEL_CALL",
        }
    }

    /// Heartbeats and superseded check results are the only records `compact`
    /// may collapse, because they are the only ones whose removal provably
    /// cannot change the fold (spec 03 §9).
    pub fn is_compactable(&self) -> bool {
        matches!(self, Event::SessionHeartbeat { .. } | Event::CheckResult { .. })
    }
}

/// A contradiction record built from a `Contradict` event.
pub fn contradiction_from(reason: String, evidence: Vec<BeliefId>, at: Seq) -> Contradiction {
    Contradiction { reason, evidence, at }
}

/// Whether a belief's declared support is available and satisfying.
///
/// `Unresolved` and `Withdrawn` are different situations and must not be
/// conflated: support that has not arrived yet leaves a belief `NEITHER`, while
/// support that existed and stopped holding drives it `OUT`.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Support {
    /// Every declared support exists and the mode is satisfied.
    Satisfied,
    /// Support exists but no longer satisfies the mode.
    Withdrawn,
    /// Support is contested rather than gone. Contestation propagates: a
    /// conclusion resting on contested evidence is itself contested.
    Contested,
    /// A declared support belief is not in the store yet.
    Unresolved,
}

/// Which truth state a belief takes from its own events plus its support.
pub fn intrinsic_state(contradicted: bool, retracted: bool, support: Support) -> TruthState {
    if retracted || support == Support::Withdrawn {
        return TruthState::Out;
    }
    if contradicted || support == Support::Contested {
        return TruthState::Both;
    }
    match support {
        Support::Unresolved => TruthState::Neither,
        Support::Satisfied => TruthState::In,
        Support::Withdrawn | Support::Contested => unreachable!("handled above"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::node::TimeoutPolicy;

    fn record(event: Event) -> Record {
        Record {
            seq: Seq(1),
            graph: GraphId::from_seed("t"),
            actor: Actor::session("s1"),
            at: Timestamp(0),
            event,
        }
    }

    #[test]
    fn records_round_trip_with_a_tagged_wire_form() {
        let r = record(Event::Stale { source: SourceRef::new("repo").at("src/a.rs") });
        let s = serde_json::to_string(&r).unwrap();
        assert!(s.contains("\"t\":\"STALE\""));
        let back: Record = serde_json::from_str(&s).unwrap();
        assert_eq!(r, back);
    }

    #[test]
    fn model_call_output_is_opaque_json() {
        let r = record(Event::ModelCall {
            purpose: "extract".into(),
            model_id: "m".into(),
            prompt_hash: "h".into(),
            output: serde_json::json!({"anything": [1, 2, {"nested": true}]}),
        });
        let back: Record = serde_json::from_str(&serde_json::to_string(&r).unwrap()).unwrap();
        assert_eq!(r, back);
    }

    #[test]
    fn only_heartbeats_and_check_results_are_compactable() {
        assert!(Event::SessionHeartbeat { session: SessionId("s".into()) }.is_compactable());
        assert!(Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] }
            .is_compactable());
        assert!(!Event::Retract {
            id: BeliefId::for_content(&GraphId::from_seed("t"), "c", "derived", "s"),
            reason: "r".into(),
            evidence: vec![],
            rule: None,
        }
        .is_compactable());
    }

    #[test]
    fn intrinsic_states() {
        use super::Support::*;
        assert_eq!(intrinsic_state(false, false, Satisfied), TruthState::In);
        assert_eq!(intrinsic_state(false, false, Unresolved), TruthState::Neither);
        assert_eq!(intrinsic_state(true, false, Satisfied), TruthState::Both);
        assert_eq!(intrinsic_state(false, true, Satisfied), TruthState::Out);
        assert_eq!(intrinsic_state(true, true, Satisfied), TruthState::Out);
    }

    #[test]
    fn withdrawn_support_is_out_not_neither() {
        use super::Support::*;
        assert_eq!(intrinsic_state(false, false, Withdrawn), TruthState::Out);
        assert_eq!(intrinsic_state(true, false, Withdrawn), TruthState::Out);
    }

    #[test]
    fn contested_support_propagates_rather_than_withdrawing() {
        use super::Support::*;
        assert_eq!(intrinsic_state(false, false, Contested), TruthState::Both);
        assert_eq!(intrinsic_state(false, true, Contested), TruthState::Out);
    }

    #[test]
    fn human_ask_requires_a_timeout_policy() {
        let r = record(Event::HumanAsk {
            node: NodeId::for_name(&GraphId::from_seed("t"), "approve"),
            ask: "ok?".into(),
            options: vec!["approve".into(), "reject".into()],
            context: vec![],
            consequence: vec![],
            on_timeout: TimeoutPolicy::Expire { after_ms: 1000 },
        });
        let s = serde_json::to_string(&r).unwrap();
        assert!(s.contains("on_timeout"));
        let missing = s.replace(",\"on_timeout\":{\"then\":\"expire\",\"after_ms\":1000}", "");
        assert!(serde_json::from_str::<Record>(&missing).is_err());
    }
}
