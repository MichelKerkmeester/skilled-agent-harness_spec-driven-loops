//! Graphene core: the deterministic model, fold, and cascade.
//!
//! **No I/O, no clock, no randomness, no async.** That constraint is what makes
//! determinism testable rather than aspirational, and it is enforced here by
//! having no dependency capable of any of them.

pub mod belief;
pub mod budget;
pub mod event;
pub mod fold;
pub mod graph;
pub mod id;
pub mod node;
pub mod refusal;
pub mod time;

pub use belief::{
    Belief, BeliefEdge, CascadeRule, Fidelity, Provenance, Sensitivity, SourceRef, SupportMode,
    TruthState,
};
pub use budget::{Budget, Dimension, Limits, Spend};
pub use event::{Event, FindingResolution, Record, RevokeReason};
pub use fold::{apply, fold, fold_up_to, Applied, Effect, FoldError, State};
pub use graph::{Graph, GraphState, TransitionFacts};
pub use id::{Actor, BeliefId, ClaimId, FindingId, GraphId, NodeId, NogoodId, SessionId};
pub use node::{
    Binding, Checkpoint, Claim, EdgeKind, ForEach, HumanAsk, Node, NodeKind, NodeSpec, NodeState,
    RetryPolicy, TimeoutPolicy,
};
pub use refusal::{Outcome, Refusal, RefusalCode, Suggestion};
pub use time::{Deadline, ObservedAt, Seq, Timestamp, Validity};
