//! Structured refusals.
//!
//! **Every refusal names the alternative.** A refusal that reads as a failure
//! teaches the caller nothing; one that names what to do instead is how the
//! model learns the model (spec 02 §3).
//!
//! This is a correctness property, tested as one: `permission totality` asserts
//! that every refused operation carries a `suggestion` or a `fix_hint`
//! (spec 10 §4).
//!
//! Refusals are **results, not errors** — the CLI returns them on stdout with
//! exit 0, because the caller is meant to read and act on them (spec 07 §2).

use serde::{Deserialize, Serialize};

use crate::id::{BeliefId, ClaimId, NodeId, NogoodId, SessionId};

/// What the caller should do instead.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Suggestion {
    /// The world is not retractable by fiat (I6). Record that something
    /// contradicts it instead.
    Contradict,
    /// Make a fresh observation; only that supersedes an old one.
    ObserveAgain,
    /// Corroborate from a *different* source — the same source twice is one
    /// witness, not two.
    CorroborateFromDistinctSource,
    /// Re-read what went stale, then claim again.
    RebindAndReclaim,
    /// Someone else holds this node; take a different one.
    ClaimAnother,
    /// Wait for the current holder's lease to lapse or be released.
    WaitForRelease,
    /// The graph is not in a state that permits this yet.
    AdvanceGraphState,
    /// Fix the reported check errors first.
    FixCheckErrors,
    /// Resolve the outstanding review findings.
    ResolveFindings,
    /// A human must answer before this can proceed.
    AwaitHuman,
    /// The set is jointly inconsistent; drop a member or record why it holds.
    DropAMember,
    /// Raise the budget or reduce the work.
    ReduceScopeOrRaiseBudget,
    /// Nothing to do — the operation was already applied.
    AlreadyApplied,
}

/// A refused operation.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Refusal {
    pub code: RefusalCode,
    /// Always present. This is the invariant the totality test enforces.
    pub suggestion: Suggestion,
    /// Human- and model-readable explanation, naming the rule.
    pub reason: String,
    /// Boxed so a `Refusal` stays small enough to sit in a `Result` without
    /// bloating every call site that can refuse.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub detail: Option<Box<Detail>>,
}

impl Refusal {
    pub fn new(code: RefusalCode, suggestion: Suggestion, reason: impl Into<String>) -> Self {
        Self { code, suggestion, reason: reason.into(), detail: None }
    }

    pub fn with_detail(mut self, detail: Detail) -> Self {
        self.detail = Some(Box::new(detail));
        self
    }

    pub fn detail(&self) -> Option<&Detail> {
        self.detail.as_deref()
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RefusalCode {
    /// The entry's provenance forbids this operation (I3).
    TypeForbidden,
    /// `SUPERSEDE` on an observation without evidence of a fresh observation.
    NoObservationProof,
    /// A fidelity raise without a distinct-source corroboration (I8).
    SameSourceCorroboration,
    /// Fidelity may only rise, and only with evidence.
    FidelityWouldFall,
    /// A derived belief may not sit below the join of its support (I7).
    SensitivityWouldFall,
    /// This edge set would create a cycle in `derives-from`.
    WouldCycle,
    /// This derivation would complete a recorded nogood.
    WouldCompleteNogood,
    /// Every member of the nogood sits in a set the caller emits
    /// unconditionally, so nothing can be evicted. A human problem.
    NogoodUnenforceable,
    /// Another session holds an active claim on this node.
    AlreadyClaimed,
    /// One or more premises in the read-set are no longer believed.
    StalePremise,
    /// The claim was revoked — lease expiry or preemption.
    ClaimRevoked,
    /// The node is not in a state that can be claimed.
    NotClaimable,
    /// The graph's lifecycle state does not permit this transition.
    BadGraphState,
    /// A node output failed validation against its declared schema.
    OutputSchemaViolation,
    /// A declared budget dimension is exhausted.
    BudgetExhausted,
    /// A declared limit would be exceeded.
    LimitExceeded,
    /// The referenced object does not exist.
    NotFound,
    /// The operation has already been applied; repeating it is a no-op.
    AlreadyApplied,
}

/// Structured evidence attached to a refusal, so the caller can act without
/// parsing prose.
#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Detail {
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub stale: Vec<StalePremise>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub held_by: Option<SessionId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim: Option<ClaimId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub node: Option<NodeId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub nogood: Option<NogoodId>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub members: Vec<BeliefId>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub cycle: Vec<BeliefId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub dimension: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub limit: Option<u64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub actual: Option<u64>,
}

impl Detail {
    pub fn is_empty(&self) -> bool {
        *self == Detail::default()
    }
}

/// A refusal is an *outcome*, not an error, so it travels boxed to keep the
/// happy path cheap.
pub type Outcome<T> = Result<T, Box<Refusal>>;

/// A premise in a read-set that is no longer believed, and what killed it.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct StalePremise {
    pub id: BeliefId,
    pub state: crate::belief::TruthState,
    pub summary: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contradicted_by: Option<BeliefId>,
    #[serde(default)]
    pub stale: bool,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn every_refusal_carries_a_suggestion() {
        let r = Refusal::new(
            RefusalCode::TypeForbidden,
            Suggestion::Contradict,
            "I6 — an observation stops being believed only through a new observation",
        );
        assert_eq!(r.suggestion, Suggestion::Contradict);
        assert!(!r.reason.is_empty());
    }

    #[test]
    fn refusals_round_trip_as_json() {
        let r = Refusal::new(
            RefusalCode::AlreadyClaimed,
            Suggestion::ClaimAnother,
            "another session holds this node",
        )
        .with_detail(Detail { held_by: Some(SessionId("s2".into())), ..Default::default() });
        let s = serde_json::to_string(&r).unwrap();
        let back: Refusal = serde_json::from_str(&s).unwrap();
        assert_eq!(r, back);
        assert!(s.contains("\"already-claimed\""));
        assert!(s.contains("\"claim-another\""));
    }

    #[test]
    fn empty_detail_is_omitted_from_the_wire() {
        let r = Refusal::new(RefusalCode::NotFound, Suggestion::AlreadyApplied, "gone");
        let s = serde_json::to_string(&r).unwrap();
        assert!(!s.contains("detail"));
    }
}
