//! The belief layer: three orthogonal axes and a four-valued truth lattice.
//!
//! Spec 02. The load-bearing decisions:
//!
//! - **Three axes, never collapsed** — provenance (immutable), fidelity (rises
//!   only with distinct-source evidence), truth state (computed by the fold).
//! - **A caller cannot write a truth state.** It emits events; the fold derives.
//!   That is what makes every state auditable — each has a derivation.
//! - **`BOTH` is a state, not a marker.** It elides content, propagates to
//!   dependents, and is queryable — because a refutation sitting *next to* a
//!   claim does not neutralize it.

use serde::{Deserialize, Serialize};

use crate::id::{BeliefId, NodeId};
use crate::refusal::{Refusal, RefusalCode, Suggestion};
use crate::time::{ObservedAt, Seq, Validity};

pub use crate::time::Validity as ValidityRef;

/// Where a belief came from. **Structural, never inferred from content, and
/// immutable after `ADD`.** Determines retraction permission (I3).
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Provenance {
    /// An operator's words.
    UserInstruction,
    /// What a system returned. I6 applies.
    ToolObservation,
    /// An inference over other beliefs. Cascades.
    Derived,
    /// Provisional, expected to be wrong. Cheap to drop.
    Hypothesis,
    /// Document or file content held for reference. Decays.
    Artifact,
    /// A node execution record. Immutable.
    Job,
    /// A durable lesson. Supersede only.
    Journal,
}

impl Provenance {
    pub fn as_str(&self) -> &'static str {
        match self {
            Provenance::UserInstruction => "user-instruction",
            Provenance::ToolObservation => "tool-observation",
            Provenance::Derived => "derived",
            Provenance::Hypothesis => "hypothesis",
            Provenance::Artifact => "artifact",
            Provenance::Job => "job",
            Provenance::Journal => "journal",
        }
    }

    /// May a caller retract a belief with this provenance? (I3, spec 02 §3)
    pub fn caller_may_retract(&self) -> bool {
        matches!(self, Provenance::Derived | Provenance::Hypothesis | Provenance::Artifact)
    }

    /// The escape valve when retraction is forbidden.
    pub fn retraction_alternative(&self) -> Suggestion {
        match self {
            Provenance::ToolObservation => Suggestion::Contradict,
            Provenance::Journal => Suggestion::ObserveAgain,
            _ => Suggestion::Contradict,
        }
    }

    /// A refusal that names the rule and the alternative.
    pub fn refuse_retraction(&self) -> Refusal {
        let reason = match self {
            Provenance::UserInstruction => {
                "user instructions are the operator's words; if one seems wrong, say so rather than routing around it"
            }
            Provenance::ToolObservation => {
                "I6 — an observation stops being believed only through a new observation, or by being contradicted"
            }
            Provenance::Job => "a job record is an immutable execution record",
            Provenance::Journal => "the journal is append-only; supersede instead",
            _ => "this provenance permits retraction",
        };
        Refusal::new(RefusalCode::TypeForbidden, self.retraction_alternative(), reason)
    }
}

/// How well grounded a belief is.
///
/// **Never silently upgrades** (I8): a rise requires a recorded corroboration
/// from a *distinct* source. This is the reliability signal that decides whether
/// belief revision is effective or inert.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Fidelity {
    /// Inferred. Real, but flagged.
    Guessed,
    /// Asserted by one source. The default.
    Claimed,
    /// Corroborated, with a receipt and an evaluated check.
    Confirmed,
}

impl Fidelity {
    pub fn as_str(&self) -> &'static str {
        match self {
            Fidelity::Guessed => "guessed",
            Fidelity::Claimed => "claimed",
            Fidelity::Confirmed => "confirmed",
        }
    }

    /// The next rung up, if any.
    pub fn raised(self) -> Option<Fidelity> {
        match self {
            Fidelity::Guessed => Some(Fidelity::Claimed),
            Fidelity::Claimed => Some(Fidelity::Confirmed),
            Fidelity::Confirmed => None,
        }
    }

    /// One rung down, used when a corroboration is withdrawn.
    pub fn lowered(self) -> Fidelity {
        match self {
            Fidelity::Confirmed => Fidelity::Claimed,
            Fidelity::Claimed => Fidelity::Guessed,
            Fidelity::Guessed => Fidelity::Guessed,
        }
    }

    /// **Trust degrades to the weakest link.** Used when reading across several
    /// beliefs — the deliberate asymmetry with sensitivity, which takes the max.
    pub fn meet(self, other: Fidelity) -> Fidelity {
        self.min(other)
    }
}

/// The Belnap four-valued truth lattice (spec 02 §2).
///
/// ```text
///             BOTH              supported AND contradicted
///            ╱    ╲
///          IN      OUT          believed / not believed
///            ╲    ╱
///           NEITHER             asserted, support unresolved
/// ```
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TruthState {
    In,
    Out,
    /// Supported **and** contradicted. Content is elided at render; the agent
    /// stopped staring at it without having stopped believing it.
    Both,
    /// Asserted, support not yet resolved. The streaming case.
    Neither,
}

impl TruthState {
    pub fn as_str(&self) -> &'static str {
        match self {
            TruthState::In => "IN",
            TruthState::Out => "OUT",
            TruthState::Both => "BOTH",
            TruthState::Neither => "NEITHER",
        }
    }

    /// Does a belief in this state provide support to its dependents?
    ///
    /// Only `IN` does. `BOTH` is contested and must not silently prop up
    /// conclusions; `NEITHER` has not established itself yet.
    pub fn supports(&self) -> bool {
        matches!(self, TruthState::In)
    }

    /// Is this belief safe to stand on when claiming work? (spec 04 §3)
    pub fn is_usable_premise(&self) -> bool {
        matches!(self, TruthState::In)
    }

    /// Should the renderer elide the content?
    pub fn elides_content(&self) -> bool {
        matches!(self, TruthState::Both | TruthState::Out)
    }
}

/// How a `derived` belief combines its support.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum SupportMode {
    /// Conjunctive: holds while **all** support is `IN`.
    #[default]
    All,
    /// Disjunctive: holds while **any** support is `IN`.
    Any,
}

impl SupportMode {
    pub fn satisfied_by(&self, support_states: &[TruthState]) -> bool {
        if support_states.is_empty() {
            return true;
        }
        match self {
            SupportMode::All => support_states.iter().all(|s| s.supports()),
            SupportMode::Any => support_states.iter().any(|s| s.supports()),
        }
    }
}

/// Typed belief edges. **Seven kinds, fixed** — an extensible edge vocabulary
/// becomes a domain ontology, which is out of scope (spec 02 §4).
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum BeliefEdge {
    /// The support edge. Forms a DAG; cycles rejected at `ADD`.
    DerivesFrom,
    /// An independent second source. Raises fidelity (I8).
    Corroborates,
    /// Evidence against. Drives the target to `BOTH`.
    Refutes,
    /// Replacement.
    Supersedes,
    /// Which node produced this. **Lineage only — never cascades**, because
    /// finishing work must not delete its findings.
    ProducedBy,
    /// Which node or graph this was created under. **Scope exit → `OUT`** — in
    /// practice the highest-volume cascade in the system.
    ScopedTo,
    /// A claim is standing on this belief. The cross-session mechanism
    /// (spec 02 §5).
    AssumedBy,
}

impl BeliefEdge {
    /// Does withdrawing the source of this edge cascade to the target?
    pub fn cascades(&self) -> bool {
        matches!(self, BeliefEdge::DerivesFrom | BeliefEdge::ScopedTo)
    }

    /// Must this edge kind stay acyclic?
    pub fn must_be_acyclic(&self) -> bool {
        matches!(self, BeliefEdge::DerivesFrom)
    }
}

/// Why a belief is contested, and on what evidence.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Contradiction {
    pub reason: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub evidence: Vec<BeliefId>,
    pub at: Seq,
}

/// Why a belief left the believed set, and on whose authority.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Retraction {
    pub reason: String,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub evidence: Vec<BeliefId>,
    pub by: crate::id::Actor,
    /// Set when a rule fired rather than a caller acting.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rule: Option<CascadeRule>,
    pub at: Seq,
}

/// The four cascade triggers (spec 02 §7, spec 04).
#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CascadeRule {
    /// Support no longer satisfies `SupportMode`.
    SupportWithdrawn,
    /// A goal, node, or graph this was scoped to ended. **Fires most often.**
    ScopeExit,
    /// A supporting belief became `BOTH`.
    ContradictionCascade,
    /// The source was written; observations from it are stale.
    SourceMutation,
    /// Superseded by a newer observation.
    Superseded,
}

/// Where a belief came from in the world. Declared, so "is this a shared
/// resource" is a lookup rather than a judgment (spec 02 §6).
#[derive(Clone, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct SourceRef {
    /// Stable identity of the system: a repo, a database, a service.
    pub system: String,
    /// Path, table, URL, or other locator within the system.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub path: Option<String>,
    /// Whether this source is shared across sessions. Drives §6's filter.
    #[serde(default)]
    pub shared: bool,
}

impl SourceRef {
    pub fn new(system: impl Into<String>) -> Self {
        Self { system: system.into(), path: None, shared: false }
    }
    pub fn shared(mut self) -> Self {
        self.shared = true;
        self
    }
    pub fn at(mut self, path: impl Into<String>) -> Self {
        self.path = Some(path.into());
        self
    }
    /// Canonical string form, used in id derivation.
    pub fn key(&self) -> String {
        match &self.path {
            Some(p) => format!("{}#{}", self.system, p),
            None => self.system.clone(),
        }
    }
    /// Does a write to `written` invalidate observations of `self`?
    pub fn invalidated_by(&self, written: &SourceRef) -> bool {
        if self.system != written.system {
            return false;
        }
        match (&self.path, &written.path) {
            (_, None) => true,
            (None, Some(_)) => false,
            (Some(mine), Some(theirs)) => mine == theirs || mine.starts_with(&format!("{theirs}/")),
        }
    }
}

/// Opaque access-control label. Graphene **carries and joins** these; it never
/// interprets them as policy (I7, spec 00 §6).
#[derive(Clone, Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct Sensitivity(pub Vec<String>);

impl Sensitivity {
    pub fn none() -> Self {
        Self(Vec::new())
    }

    pub fn of(labels: impl IntoIterator<Item = impl Into<String>>) -> Self {
        let mut v: Vec<String> = labels.into_iter().map(Into::into).collect();
        v.sort();
        v.dedup();
        Self(v)
    }

    /// **Access restricts to the strongest** (I7): the join is set union, and a
    /// derived belief is at least the join of its support. This is the
    /// deliberate asymmetry with fidelity, which takes the meet.
    pub fn join(&self, other: &Sensitivity) -> Sensitivity {
        let mut v = self.0.clone();
        v.extend(other.0.iter().cloned());
        v.sort();
        v.dedup();
        Sensitivity(v)
    }

    pub fn join_all<'a>(labels: impl IntoIterator<Item = &'a Sensitivity>) -> Sensitivity {
        labels.into_iter().fold(Sensitivity::none(), |acc, s| acc.join(s))
    }

    /// Does `self` dominate `other` — i.e. is it at least as restrictive?
    pub fn dominates(&self, other: &Sensitivity) -> bool {
        other.0.iter().all(|l| self.0.contains(l))
    }
}

/// A claim with provenance, support, and a truth state.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Belief {
    pub id: BeliefId,
    pub graph: crate::id::GraphId,

    pub provenance: Provenance,
    pub fidelity: Fidelity,
    /// **Computed by the fold, never written by a caller.**
    pub state: TruthState,

    pub content: String,
    /// ≤ 80 characters, used wherever content is elided.
    pub summary: String,

    pub support_mode: SupportMode,

    pub observed_at: ObservedAt,
    pub recorded_at: Seq,
    #[serde(default)]
    pub validity: Validity,

    #[serde(default)]
    pub sensitivity: Sensitivity,
    pub source: SourceRef,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub produced_by: Option<NodeId>,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub contradiction: Option<Contradiction>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub retraction: Option<Retraction>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub supersedes: Option<BeliefId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub superseded_by: Option<BeliefId>,

    /// Set by source mutation. **Stale is not retracted** — I6 forbids it.
    #[serde(default)]
    pub stale: bool,
    #[serde(default)]
    pub pinned: bool,

    /// Sources of corroboration already counted, so the same source cannot
    /// raise fidelity twice (I8).
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub corroborated_by: Vec<SourceRef>,

    pub content_hash: String,
}

impl Belief {
    /// Is this belief safe for a claim's read-set? (spec 04 §3)
    pub fn is_usable_premise(&self) -> bool {
        self.state.is_usable_premise() && !self.stale
    }

    /// Raise fidelity on corroboration.
    ///
    /// **Refuses same-source corroboration** — the same source twice is one
    /// witness, not two (I8).
    pub fn corroborate(&mut self, by: &SourceRef) -> crate::refusal::Outcome<Fidelity> {
        if by.key() == self.source.key() || self.corroborated_by.iter().any(|s| s.key() == by.key())
        {
            return Err(Box::new(Refusal::new(
                RefusalCode::SameSourceCorroboration,
                Suggestion::CorroborateFromDistinctSource,
                "I8 — fidelity rises only on corroboration from a distinct source; the same source twice is one witness, not two",
            )));
        }
        self.corroborated_by.push(by.clone());
        if let Some(next) = self.fidelity.raised() {
            self.fidelity = next;
        }
        Ok(self.fidelity)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_in_provides_support() {
        assert!(TruthState::In.supports());
        for s in [TruthState::Out, TruthState::Both, TruthState::Neither] {
            assert!(!s.supports(), "{s:?} must not prop up conclusions");
        }
    }

    #[test]
    fn both_elides_content() {
        assert!(TruthState::Both.elides_content());
        assert!(!TruthState::In.elides_content());
    }

    #[test]
    fn retraction_permissions_follow_provenance() {
        assert!(Provenance::Derived.caller_may_retract());
        assert!(Provenance::Hypothesis.caller_may_retract());
        assert!(Provenance::Artifact.caller_may_retract());
        for p in [
            Provenance::UserInstruction,
            Provenance::ToolObservation,
            Provenance::Job,
            Provenance::Journal,
        ] {
            assert!(!p.caller_may_retract(), "{p:?} must not be caller-retractable");
        }
    }

    #[test]
    fn observation_refusal_names_the_alternative() {
        let r = Provenance::ToolObservation.refuse_retraction();
        assert_eq!(r.code, RefusalCode::TypeForbidden);
        assert_eq!(r.suggestion, Suggestion::Contradict);
        assert!(r.reason.contains("I6"));
    }

    #[test]
    fn fidelity_meets_at_the_weakest() {
        assert_eq!(Fidelity::Confirmed.meet(Fidelity::Guessed), Fidelity::Guessed);
        assert_eq!(Fidelity::Claimed.meet(Fidelity::Confirmed), Fidelity::Claimed);
    }

    #[test]
    fn sensitivity_joins_at_the_strongest() {
        let a = Sensitivity::of(["hr"]);
        let b = Sensitivity::of(["finance"]);
        let j = a.join(&b);
        assert!(j.dominates(&a) && j.dominates(&b));
        assert_eq!(j.0, vec!["finance".to_string(), "hr".to_string()]); // sorted, deterministic
    }

    #[test]
    fn support_modes() {
        assert!(SupportMode::All.satisfied_by(&[TruthState::In, TruthState::In]));
        assert!(!SupportMode::All.satisfied_by(&[TruthState::In, TruthState::Out]));
        assert!(SupportMode::Any.satisfied_by(&[TruthState::In, TruthState::Out]));
        assert!(!SupportMode::Any.satisfied_by(&[TruthState::Out, TruthState::Both]));
        assert!(SupportMode::All.satisfied_by(&[]));
    }

    #[test]
    fn produced_by_never_cascades() {
        assert!(!BeliefEdge::ProducedBy.cascades());
        assert!(BeliefEdge::DerivesFrom.cascades());
        assert!(BeliefEdge::ScopedTo.cascades());
    }

    #[test]
    fn source_invalidation_is_path_aware() {
        let file = SourceRef::new("repo").at("src/auth.rs");
        let same = SourceRef::new("repo").at("src/auth.rs");
        let dir = SourceRef::new("repo").at("src");
        let other = SourceRef::new("repo").at("src/db.rs");
        let whole = SourceRef::new("repo");
        let elsewhere = SourceRef::new("crm").at("src/auth.rs");

        assert!(file.invalidated_by(&same));
        assert!(file.invalidated_by(&dir));
        assert!(file.invalidated_by(&whole));
        assert!(!file.invalidated_by(&other));
        assert!(!file.invalidated_by(&elsewhere));
    }

    #[test]
    fn same_source_cannot_corroborate() {
        let src = SourceRef::new("wiki").at("policy.md");
        let mut b = belief_fixture(src.clone(), Fidelity::Claimed);

        let refused = b.corroborate(&src).unwrap_err();
        assert_eq!(refused.code, RefusalCode::SameSourceCorroboration);
        assert_eq!(
            b.fidelity,
            Fidelity::Claimed,
            "fidelity must not move on a refused corroboration"
        );

        let other = SourceRef::new("crm").at("policies");
        assert_eq!(b.corroborate(&other).unwrap(), Fidelity::Confirmed);
        assert!(b.corroborate(&other).is_err());
    }

    fn belief_fixture(source: SourceRef, fidelity: Fidelity) -> Belief {
        let graph = crate::id::GraphId::from_seed("t");
        let content = "the refund window is 30 days";
        Belief {
            id: BeliefId::for_content(&graph, content, "tool-observation", &source.key()),
            graph,
            provenance: Provenance::ToolObservation,
            fidelity,
            state: TruthState::In,
            content: content.into(),
            summary: "refund window 30d".into(),
            support_mode: SupportMode::All,
            observed_at: ObservedAt::observed(crate::time::Timestamp(1)),
            recorded_at: Seq(1),
            validity: Validity::open(),
            sensitivity: Sensitivity::none(),
            source,
            produced_by: None,
            contradiction: None,
            retraction: None,
            supersedes: None,
            superseded_by: None,
            stale: false,
            pinned: false,
            corroborated_by: Vec::new(),
            content_hash: crate::id::content_hash(content.as_bytes()),
        }
    }
}
