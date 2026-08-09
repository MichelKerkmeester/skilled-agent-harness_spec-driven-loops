//! Work nodes: units of capability, with typed contracts.
//!
//! > *"A good node is boring. It does one thing, you can test it alone, and you
//! > can swap it out without touching anything else."*
//!
//! Graphene cannot check that — granularity is judgment, and belongs to the
//! review lenses. What it **can** check is that inputs and outputs are declared
//! and bound, and **declared contracts are what make "test it alone" true rather
//! than aspirational** (spec 01 §3.2, spec 06 §2).

use serde::{Deserialize, Serialize};

use crate::budget::{Budget, Spend};
use crate::id::{ClaimId, GraphId, NodeId, SessionId};
use crate::time::{Deadline, Seq, Timestamp};

/// What kind of capability a node is.
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum NodeKind {
    /// An agent loop in its own context. The common case.
    Agent,
    /// A deterministic call the agent performs: tests, a build, a script.
    Function,
    /// A read against a source. No side effects, by declaration.
    Retrieval,
    /// **A person.** Asynchronous; blocks only its dependents.
    Human,
    /// An agent loop reviewing the graph itself.
    Review,
    /// Consolidates parallel outputs. **One owner per fan-in.**
    Merge,
}

impl NodeKind {
    pub fn as_str(&self) -> &'static str {
        match self {
            NodeKind::Agent => "agent",
            NodeKind::Function => "function",
            NodeKind::Retrieval => "retrieval",
            NodeKind::Human => "human",
            NodeKind::Review => "review",
            NodeKind::Merge => "merge",
        }
    }

    /// Is this node run by a person rather than the agent?
    pub fn is_human(&self) -> bool {
        matches!(self, NodeKind::Human)
    }
}

/// Node execution states (spec 01 §3.3).
///
/// ```text
/// pending ──▶ ready ──▶ claimed ──▶ running ──┬─▶ done
///    ▲                     │                  ├─▶ failed ──▶ (retry) ready
///    │                     └──(lease lost)────┘  └─▶ awaiting ──▶ ready
/// blocked ◀── an upstream node failed or is awaiting
/// ```
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum NodeState {
    /// Upstream incomplete.
    Pending,
    /// All `needs` satisfied; claimable.
    Ready,
    /// A session holds a lease, not yet started.
    Claimed,
    /// In progress, lease held.
    Running,
    /// A `human` node waiting on a person. **Only its dependents block.**
    Awaiting,
    /// An upstream node is failed or awaiting.
    Blocked,
    /// Output recorded and schema-valid.
    Done,
    /// Terminal for this node.
    Failed,
    /// An ancestor failed; never attempted.
    Skipped,
}

impl NodeState {
    pub fn as_str(&self) -> &'static str {
        match self {
            NodeState::Pending => "pending",
            NodeState::Ready => "ready",
            NodeState::Claimed => "claimed",
            NodeState::Running => "running",
            NodeState::Awaiting => "awaiting",
            NodeState::Blocked => "blocked",
            NodeState::Done => "done",
            NodeState::Failed => "failed",
            NodeState::Skipped => "skipped",
        }
    }

    pub fn is_terminal(&self) -> bool {
        matches!(self, NodeState::Done | NodeState::Failed | NodeState::Skipped)
    }

    /// Does this node still owe work before the graph can finish?
    pub fn is_outstanding(&self) -> bool {
        !self.is_terminal()
    }

    pub fn is_claimable(&self) -> bool {
        matches!(self, NodeState::Ready)
    }

    /// Does this state satisfy a downstream `needs`?
    pub fn satisfies_dependents(&self) -> bool {
        matches!(self, NodeState::Done)
    }

    /// Does this state **block** dependents rather than merely not satisfy them?
    ///
    /// `Awaiting` blocks its dependents and **nothing else** — that is what lets
    /// a graph keep running while a person takes three days to answer.
    pub fn blocks_dependents(&self) -> bool {
        matches!(
            self,
            NodeState::Awaiting | NodeState::Failed | NodeState::Skipped | NodeState::Blocked
        )
    }
}

/// How an input field is filled from an upstream output.
///
/// **`needs` must equal the set of nodes referenced by bindings.** An edge with
/// no binding reading through it is a *fake edge*, and that is a structural fact
/// — a contradiction between two declarations — not a heuristic (spec 06 §3).
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Binding {
    pub from: NodeId,
    /// A JSON path into the source's declared output schema.
    pub select: String,
    /// The field in this node's input schema it fills.
    pub into: String,
}

/// Whether an edge's transition is decided by code or by a model.
///
/// Costs nothing to declare and buys the ability to count where a graph can go
/// wrong: a model-decided edge is a branch a model chose, and when a run went
/// somewhere unexpected those are the first things to look at (spec 01 §4).
#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum EdgeKind {
    /// "tests pass → deploy"
    Deterministic,
    /// "billing or abuse?"
    ModelDecided,
}

/// Runtime fan-out over an upstream array.
///
/// **The shape is fixed in the plan; only the cardinality is discovered.** The
/// model fills the jobs; it never invents the routing.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct ForEach {
    /// The array to expand over.
    pub over: Binding,
    /// Declared bound, checked against `Limits::max_for_each` at check time —
    /// which is why a fan-out over 50,000 rows is rejected at authoring time
    /// rather than discovered at node 500.
    pub max: u32,
    /// The input field each element binds into.
    pub as_field: String,
}

/// What to do when a node fails.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case", tag = "policy")]
pub enum RetryPolicy {
    /// Node fails; descendants are skipped.
    #[default]
    None,
    /// Back to `ready` up to `attempts` times, resuming from the last checkpoint.
    Bounded { attempts: u32 },
    /// **Convert to a `human` node carrying the failure as context.** The most
    /// useful and least obvious policy: a node that cannot be retried becomes a
    /// question for a person, without the graph dying.
    Escalate,
}

impl RetryPolicy {
    pub fn allows_retry(&self, attempts_so_far: u32) -> bool {
        match self {
            RetryPolicy::None | RetryPolicy::Escalate => false,
            RetryPolicy::Bounded { attempts } => attempts_so_far < *attempts,
        }
    }
}

/// A recorded checkpoint at an edge crossing.
///
/// > *"Checkpoint at every edge crossing. Failure stops meaning 'restart the
/// > run' and starts meaning 'retry the node.'"*
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Checkpoint {
    pub seq: Seq,
    pub state: serde_json::Value,
}

/// An active lease on a node, with the read-set the work stands on.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Claim {
    pub id: ClaimId,
    pub session: SessionId,
    /// The beliefs this work rests on. Validated at claim time and watched
    /// afterwards (spec 04 §3).
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub read_set: Vec<crate::id::BeliefId>,
    pub leased_at: Timestamp,
    pub expires_at: Deadline,
}

impl Claim {
    /// **Expiry is evaluated against a caller-supplied clock, never stored** —
    /// otherwise the fold would depend on wall time and stop being replayable.
    pub fn is_expired_at(&self, now: Timestamp) -> bool {
        self.expires_at.is_expired_at(now)
    }
}

/// What a `human` node is asking, and what happens on each answer.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct HumanAsk {
    pub ask: String,
    pub options: Vec<String>,
    /// Beliefs to show the person, with their states — this is what makes the
    /// node answerable **cold**, by someone who was not in the original session.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub context: Vec<crate::id::BeliefId>,
    /// Which nodes each answer unblocks.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub consequence: Vec<(String, Vec<NodeId>)>,
    /// **Required.** Silence must never be indistinguishable from approval, so
    /// there is no default and omitting it fails `check` (spec 06 §6, D4).
    pub on_timeout: TimeoutPolicy,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case", tag = "then")]
pub enum TimeoutPolicy {
    /// Raise to a wider audience.
    Escalate { after_ms: u64 },
    /// Give up; dependents are skipped.
    Expire { after_ms: u64 },
    /// Wait indefinitely — explicitly chosen, never defaulted.
    Wait,
}

/// Kind-specific payload.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "kebab-case")]
pub enum NodeSpec {
    /// A prompt for an agent loop.
    Agent {
        prompt: String,
        #[serde(default)]
        system: Option<String>,
    },
    /// A command or function reference the agent invokes.
    Function { run: String },
    /// A source to read.
    Retrieval {
        source: String,
        #[serde(default)]
        query: Option<String>,
    },
    /// A question for a person.
    Human(HumanAsk),
    /// A review lens.
    Review { lens: String, prompt: String },
    /// A consolidation instruction.
    Merge { prompt: String },
}

impl NodeSpec {
    pub fn kind(&self) -> NodeKind {
        match self {
            NodeSpec::Agent { .. } => NodeKind::Agent,
            NodeSpec::Function { .. } => NodeKind::Function,
            NodeSpec::Retrieval { .. } => NodeKind::Retrieval,
            NodeSpec::Human(_) => NodeKind::Human,
            NodeSpec::Review { .. } => NodeKind::Review,
            NodeSpec::Merge { .. } => NodeKind::Merge,
        }
    }
}

/// A unit of capability in a graph.
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Node {
    pub id: NodeId,
    pub graph: GraphId,
    /// Unique within the graph, agent-assigned, meaningful. **Node ids anchor on
    /// this**, so editing a prompt keeps every reference intact.
    pub name: String,
    pub spec: NodeSpec,
    /// What this node is permitted to do. Gated capabilities force a human node
    /// on every path to it (spec 06 §4, C2).
    pub capability: String,

    /// JSON Schema.
    pub inputs: serde_json::Value,
    /// JSON Schema. **Required** — it is what makes a node testable alone.
    pub outputs: serde_json::Value,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub bindings: Vec<Binding>,
    /// Must equal the set of nodes referenced by `bindings` (spec 06 §3, S8).
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub needs: Vec<NodeId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub for_each: Option<ForEach>,

    #[serde(default)]
    pub budget: Budget,
    #[serde(default)]
    pub retry: RetryPolicy,
    /// Required on retryable nodes — what makes retry safe when a node has
    /// external side effects (spec 06 §6, D2).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub idempotency: Option<String>,
    /// Artifacts this node writes. Drives the one-writer check (spec 06 §7).
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub writes: Vec<String>,

    pub state: NodeState,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claim: Option<Claim>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub output: Option<serde_json::Value>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub checkpoints: Vec<Checkpoint>,
    #[serde(default)]
    pub attempts: u32,
    #[serde(default)]
    pub spend: Spend,
    /// Set on `forEach` expansion.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent: Option<NodeId>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure: Option<String>,
}

impl Node {
    pub fn kind(&self) -> NodeKind {
        self.spec.kind()
    }

    /// The set of nodes actually read by bindings — the other half of the
    /// fake-edge comparison.
    pub fn bound_sources(&self) -> Vec<NodeId> {
        let mut v: Vec<NodeId> = self.bindings.iter().map(|b| b.from.clone()).collect();
        if let Some(fe) = &self.for_each {
            v.push(fe.over.from.clone());
        }
        v.sort();
        v.dedup();
        v
    }

    /// Declared dependencies, normalized.
    pub fn declared_needs(&self) -> Vec<NodeId> {
        let mut v = self.needs.clone();
        v.sort();
        v.dedup();
        v
    }

    /// Dependencies declared but never read. **A fake edge** — these nodes can
    /// run in parallel (spec 06 §3, S8).
    pub fn fake_edges(&self) -> Vec<NodeId> {
        let bound = self.bound_sources();
        self.declared_needs().into_iter().filter(|n| !bound.contains(n)).collect()
    }

    /// Bindings reading from a node that is not declared as a dependency.
    pub fn unbound_needs(&self) -> Vec<NodeId> {
        let needs = self.declared_needs();
        self.bound_sources().into_iter().filter(|n| !needs.contains(n)).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    fn node(name: &str, needs: Vec<NodeId>, bindings: Vec<Binding>) -> Node {
        let graph = GraphId::from_seed("t");
        Node {
            id: NodeId::for_name(&graph, name),
            graph,
            name: name.into(),
            spec: NodeSpec::Agent { prompt: "do a thing".into(), system: None },
            capability: "agent".into(),
            inputs: json!({"type": "object"}),
            outputs: json!({"type": "object"}),
            bindings,
            needs,
            for_each: None,
            budget: Budget::default(),
            retry: RetryPolicy::None,
            idempotency: None,
            writes: vec![],
            state: NodeState::Pending,
            claim: None,
            output: None,
            checkpoints: vec![],
            attempts: 0,
            spend: Spend::default(),
            parent: None,
            failure: None,
        }
    }

    #[test]
    fn awaiting_blocks_dependents_but_is_not_terminal() {
        assert!(NodeState::Awaiting.blocks_dependents());
        assert!(!NodeState::Awaiting.is_terminal());
        assert!(NodeState::Awaiting.is_outstanding());
        assert!(!NodeState::Awaiting.satisfies_dependents());
    }

    #[test]
    fn only_done_satisfies_dependents() {
        assert!(NodeState::Done.satisfies_dependents());
        for s in [
            NodeState::Pending,
            NodeState::Ready,
            NodeState::Claimed,
            NodeState::Running,
            NodeState::Awaiting,
            NodeState::Blocked,
            NodeState::Failed,
            NodeState::Skipped,
        ] {
            assert!(!s.satisfies_dependents(), "{s:?}");
        }
    }

    #[test]
    fn fake_edge_detection_is_set_difference_not_a_heuristic() {
        let graph = GraphId::from_seed("t");
        let fetch = NodeId::for_name(&graph, "fetch");
        let calendar = NodeId::for_name(&graph, "calendar");

        let n = node(
            "summarize",
            vec![fetch.clone(), calendar.clone()],
            vec![Binding { from: fetch.clone(), select: "$.text".into(), into: "text".into() }],
        );

        assert_eq!(n.fake_edges(), vec![calendar]);
        assert!(n.unbound_needs().is_empty());
    }

    #[test]
    fn for_each_source_counts_as_a_read() {
        let graph = GraphId::from_seed("t");
        let list = NodeId::for_name(&graph, "list");
        let mut n = node("per-item", vec![list.clone()], vec![]);
        n.for_each = Some(ForEach {
            over: Binding { from: list.clone(), select: "$.items".into(), into: "item".into() },
            max: 50,
            as_field: "item".into(),
        });
        assert!(n.fake_edges().is_empty(), "a forEach source is genuinely read");
    }

    #[test]
    fn binding_without_a_declared_need_is_caught() {
        let graph = GraphId::from_seed("t");
        let ghost = NodeId::for_name(&graph, "ghost");
        let n = node(
            "x",
            vec![],
            vec![Binding { from: ghost.clone(), select: "$.a".into(), into: "a".into() }],
        );
        assert_eq!(n.unbound_needs(), vec![ghost]);
    }

    #[test]
    fn retry_policies() {
        assert!(!RetryPolicy::None.allows_retry(0));
        assert!(RetryPolicy::Bounded { attempts: 2 }.allows_retry(0));
        assert!(RetryPolicy::Bounded { attempts: 2 }.allows_retry(1));
        assert!(!RetryPolicy::Bounded { attempts: 2 }.allows_retry(2));
        assert!(!RetryPolicy::Escalate.allows_retry(0));
    }

    #[test]
    fn timeout_policy_has_no_approve_variant() {
        let json = serde_json::to_string(&TimeoutPolicy::Expire { after_ms: 1 }).unwrap();
        assert!(json.contains("expire"));
        assert!(!json.contains("approve"));
    }

    #[test]
    fn node_round_trips_as_json() {
        let n = node("x", vec![], vec![]);
        let s = serde_json::to_string(&n).unwrap();
        let back: Node = serde_json::from_str(&s).unwrap();
        assert_eq!(n, back);
    }
}
