//! The fold: log → state, and the cascade that keeps it consistent.
//!
//! Total, deterministic, side-effect free. `BTreeMap` throughout so iteration
//! order is stable; ties break by `Seq`, then by id.

use std::collections::{BTreeMap, BTreeSet, VecDeque};

use serde::{Deserialize, Serialize};

use crate::belief::{
    Belief, BeliefEdge, CascadeRule, Contradiction, Retraction, SourceRef, SupportMode, TruthState,
};
use crate::budget::Spend;
use crate::event::{intrinsic_state, Event, FindingResolution, Record, RevokeReason, Support};
use crate::graph::{can_transition, Graph, GraphState, TransitionFacts};
use crate::id::{Actor, BeliefId, ClaimId, FindingId, GraphId, NodeId, NogoodId, SessionId};
use crate::node::{
    Checkpoint, Claim, EdgeKind, Node, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy,
};
use crate::time::Seq;
use crate::time::Validity;

/// Classify a belief's support, distinguishing three failure modes that a naive
/// boolean would collapse into one.
///
/// `Contested` is the one that matters: support that is `BOTH` has not gone
/// away, so the dependent must be contested rather than withdrawn. Propagation
/// is unbounded by design — a conclusion resting on contested evidence is
/// contested however long the derivation chain is.
fn classify_support(mode: SupportMode, states: &[TruthState], declared: usize) -> Support {
    if states.len() < declared {
        return Support::Unresolved;
    }
    if states.is_empty() || mode.satisfied_by(states) {
        return Support::Satisfied;
    }
    match mode {
        SupportMode::All if states.contains(&TruthState::Both) => Support::Contested,
        SupportMode::Any if states.contains(&TruthState::Both) => Support::Contested,
        _ => Support::Withdrawn,
    }
}

mod edge_map {
    use super::*;
    use serde::{Deserializer, Serializer};

    pub fn serialize<S: Serializer>(
        m: &BTreeMap<(NodeId, NodeId), EdgeKind>,
        s: S,
    ) -> Result<S::Ok, S::Error> {
        let flat: Vec<(&NodeId, &NodeId, &EdgeKind)> =
            m.iter().map(|((a, b), k)| (a, b, k)).collect();
        flat.serialize(s)
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(
        d: D,
    ) -> Result<BTreeMap<(NodeId, NodeId), EdgeKind>, D::Error> {
        let flat = Vec::<(NodeId, NodeId, EdgeKind)>::deserialize(d)?;
        Ok(flat.into_iter().map(|(a, b, k)| ((a, b), k)).collect())
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Nogood {
    pub id: NogoodId,
    pub members: Vec<BeliefId>,
    pub note: String,
    pub discovered_at: Seq,
    pub by: Actor,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Finding {
    pub id: FindingId,
    pub review_node: NodeId,
    pub target: NodeId,
    pub severity: String,
    pub body: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub resolution: Option<FindingResolution>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Session {
    pub id: SessionId,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,
    pub attached: bool,
    pub last_seen: Seq,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct HumanPending {
    pub node: NodeId,
    pub ask: String,
    pub options: Vec<String>,
    pub context: Vec<BeliefId>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub consequence: Vec<(String, Vec<NodeId>)>,
    pub on_timeout: TimeoutPolicy,
    pub asked_at: Seq,
    /// How long it had waited when it was escalated. `Some` means the deadline
    /// has already been acted on, which is what stops the sweep re-firing.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub escalated_after_ms: Option<i64>,
    /// Present when this ask exists because the node failed under
    /// `retry: escalate`. The answer then decides whether the node runs again,
    /// rather than marking it done.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub failure: Option<String>,
}

/// The folded state of one graph.
#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct State {
    pub graph: Option<Graph>,
    pub nodes: BTreeMap<NodeId, Node>,
    /// Serialized as a sequence: a tuple is not a valid JSON object key.
    #[serde(with = "edge_map")]
    pub edges: BTreeMap<(NodeId, NodeId), EdgeKind>,
    pub beliefs: BTreeMap<BeliefId, Belief>,
    pub belief_edges: BTreeSet<(BeliefId, BeliefEdge, BeliefId)>,
    pub claims: BTreeMap<ClaimId, Claim>,
    /// Only claims that are neither released nor revoked.
    pub active_claims: BTreeMap<NodeId, ClaimId>,
    /// Reverse index from a belief to the claims standing on it. This is what
    /// makes premise invalidation an indexed lookup rather than a scan.
    pub assumed_by: BTreeMap<BeliefId, BTreeSet<ClaimId>>,
    pub sessions: BTreeMap<SessionId, Session>,
    pub nogoods: BTreeMap<NogoodId, Nogood>,
    pub findings: BTreeMap<FindingId, Finding>,
    pub human_pending: BTreeMap<NodeId, HumanPending>,
    pub check_passed: bool,
    pub seq: Seq,
}

/// A state change the fold made on its own, so callers can push notifications
/// without diffing the whole state.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
#[serde(tag = "effect", rename_all = "kebab-case")]
pub enum Effect {
    NodeReady { node: NodeId },
    NodeBlocked { node: NodeId },
    NodeSkipped { node: NodeId },
    HumanResolved { node: NodeId, unblocked: Vec<NodeId> },
    PremiseInvalidated { belief: BeliefId, claims: Vec<ClaimId>, nodes: Vec<NodeId> },
    ClaimRevoked { claim: ClaimId, node: NodeId, reason: RevokeReason },
    BeliefStateChanged { belief: BeliefId, to: TruthState, rule: Option<CascadeRule> },
    GraphStateChanged { to: GraphState },
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct Applied {
    pub effects: Vec<Effect>,
}

#[derive(Clone, Debug, PartialEq, Eq, thiserror::Error)]
pub enum FoldError {
    #[error("event at seq {seq} references unknown node `{id}`")]
    UnknownNode { seq: Seq, id: String },
    #[error("event at seq {seq} references unknown belief `{id}`")]
    UnknownBelief { seq: Seq, id: String },
    #[error("event at seq {seq} references unknown claim `{id}`")]
    UnknownClaim { seq: Seq, id: String },
    #[error("event at seq {seq} arrived before the graph was created")]
    NoGraph { seq: Seq },
    #[error("event at seq {seq} is out of order; the fold is at {at}")]
    OutOfOrder { seq: Seq, at: Seq },
    #[error("graph transition refused at seq {seq}: {reason}")]
    BadTransition { seq: Seq, reason: String },
}

/// Fold a whole log.
pub fn fold(records: &[Record]) -> Result<State, FoldError> {
    let mut state = State::default();
    for r in records {
        apply(&mut state, r)?;
    }
    Ok(state)
}

/// Fold up to and including `up_to` — "what did we believe when node X ran?"
pub fn fold_up_to(records: &[Record], up_to: Seq) -> Result<State, FoldError> {
    let mut state = State::default();
    for r in records.iter().filter(|r| r.seq <= up_to) {
        apply(&mut state, r)?;
    }
    Ok(state)
}

pub fn apply(state: &mut State, record: &Record) -> Result<Applied, FoldError> {
    if record.seq <= state.seq && state.seq != Seq::ZERO {
        return Err(FoldError::OutOfOrder { seq: record.seq, at: state.seq });
    }
    let mut out = Applied::default();
    apply_event(state, record, &mut out)?;
    state.seq = record.seq;
    settle(state, record.seq, &mut out);
    Ok(out)
}

fn apply_event(state: &mut State, r: &Record, out: &mut Applied) -> Result<(), FoldError> {
    match &r.event {
        Event::GraphCreate { seed, title, description, task, budget, limits, tags, parent } => {
            state.graph = Some(Graph {
                id: GraphId::from_seed(seed),
                title: title.clone(),
                description: description.clone(),
                task: task.clone(),
                state: GraphState::Draft,
                parent: parent.clone(),
                budget: *budget,
                spend: Spend::default(),
                limits: *limits,
                tags: tags.clone(),
                created_at: r.at,
                updated_at: r.at,
                completed_at: None,
                requested_by: Some(r.actor.clone()),
                created_seq: r.seq,
            });
        }

        Event::GraphState { to, .. } => {
            let facts = transition_facts(state);
            let g = state.graph.as_mut().ok_or(FoldError::NoGraph { seq: r.seq })?;
            can_transition(g.state, *to, &facts)
                .map_err(|e| FoldError::BadTransition { seq: r.seq, reason: e.reason })?;
            g.state = *to;
            g.updated_at = r.at;
            if to.is_terminal() {
                g.completed_at = Some(r.at);
            }
            out.effects.push(Effect::GraphStateChanged { to: *to });

            if *to == GraphState::Cancelled {
                cancel_all(state, r.seq, out);
            }
        }

        Event::NodeAdd { node } | Event::NodeUpdate { node, .. } => {
            state.nodes.insert(node.id.clone(), (**node).clone());
            for n in &node.needs {
                state.edges.entry((n.clone(), node.id.clone())).or_insert(EdgeKind::Deterministic);
            }
        }

        Event::NodeRemove { id } => {
            state.nodes.remove(id);
            state.edges.retain(|(a, b), _| a != id && b != id);
        }

        Event::EdgeAdd { from, to, kind } => {
            state.edges.insert((from.clone(), to.clone()), *kind);
        }

        Event::NodeExpand { parent, children } => {
            require_node(state, parent, r.seq)?;
            for c in children {
                state.nodes.insert(c.id.clone(), c.clone());
                for n in &c.needs {
                    state.edges.entry((n.clone(), c.id.clone())).or_insert(EdgeKind::Deterministic);
                }
                state
                    .edges
                    .entry((c.id.clone(), parent.clone()))
                    .or_insert(EdgeKind::Deterministic);
            }
            // The template has no work of its own once it has expanded: it now
            // waits on its children and its output is what they produced. Left
            // `ready` it is claimable, and claiming it fails on inputs the
            // children were given instead.
            let kids: Vec<NodeId> = children.iter().map(|c| c.id.clone()).collect();
            let p = require_node_mut(state, parent, r.seq)?;
            // Keep the original dependencies: the `forEach` source is still a
            // real edge, and dropping it makes the collection look unbound.
            p.needs.extend(kids);
            p.state = NodeState::Pending;
        }

        Event::NodeState { id, to, .. } => {
            let n = require_node_mut(state, id, r.seq)?;
            n.state = *to;
        }

        Event::Claim { id, node, session, read_set, expires_at } => {
            require_node(state, node, r.seq)?;
            let claim = Claim {
                id: id.clone(),
                session: session.clone(),
                read_set: read_set.clone(),
                leased_at: r.at,
                expires_at: *expires_at,
            };
            state.claims.insert(id.clone(), claim.clone());
            state.active_claims.insert(node.clone(), id.clone());
            for b in read_set {
                state.assumed_by.entry(b.clone()).or_default().insert(id.clone());
                state.belief_edges.insert((b.clone(), BeliefEdge::AssumedBy, b.clone()));
            }
            let n = require_node_mut(state, node, r.seq)?;
            n.claim = Some(claim);
            // Renewing a lease re-emits the same claim. Work already under way
            // must not be walked back to `claimed` for reporting progress.
            if n.state != NodeState::Running {
                n.state = NodeState::Claimed;
            }
        }

        Event::ClaimRelease { id, .. } => {
            release_claim(state, id, r.seq, None, out)?;
        }

        Event::ClaimRevoke { id, reason } => {
            release_claim(state, id, r.seq, Some(*reason), out)?;
        }

        Event::Checkpoint { node, state: cp } => {
            let n = require_node_mut(state, node, r.seq)?;
            n.checkpoints.push(Checkpoint { seq: r.seq, state: cp.clone() });
            if n.state == NodeState::Claimed {
                n.state = NodeState::Running;
            }
        }

        Event::NodeDone { node, output, spend } => {
            let claim_id = state.active_claims.remove(node);
            let n = require_node_mut(state, node, r.seq)?;
            n.output = Some(output.clone());
            n.spend = n.spend.plus(*spend);
            n.state = NodeState::Done;
            n.claim = None;
            if let Some(cid) = claim_id {
                drop_claim_index(state, &cid);
            }
            if let Some(g) = state.graph.as_mut() {
                g.spend = g.spend.plus(*spend);
            }
            state.human_pending.remove(node);
        }

        Event::NodeFail { node, reason, retryable } => {
            let claim_id = state.active_claims.remove(node);
            if let Some(cid) = &claim_id {
                drop_claim_index(state, cid);
            }
            let n = require_node_mut(state, node, r.seq)?;
            n.attempts += 1;
            n.failure = Some(reason.clone());
            n.claim = None;
            let attempts = n.attempts;
            let policy = n.retry;
            n.state = if *retryable && policy.allows_retry(attempts.saturating_sub(1)) {
                NodeState::Ready
            } else if matches!(policy, RetryPolicy::Escalate) {
                NodeState::Awaiting
            } else {
                NodeState::Failed
            };

            // `Awaiting` with nothing pending is a node no person can see and no
            // person can answer, blocking its dependents forever. Escalating a
            // failure has to put a real question in front of someone.
            if n.state == NodeState::Awaiting {
                let name = n.name.clone();
                state.human_pending.insert(
                    node.clone(),
                    HumanPending {
                        node: node.clone(),
                        ask: format!(
                            "`{name}` failed: {reason}. Run it again, or give up on this branch?"
                        ),
                        options: vec!["retry".into(), "abandon".into()],
                        context: vec![],
                        consequence: vec![("retry".into(), vec![]), ("abandon".into(), vec![])],
                        on_timeout: TimeoutPolicy::Wait,
                        asked_at: r.seq,
                        escalated_after_ms: None,
                        failure: Some(reason.clone()),
                    },
                );
            }
        }

        Event::HumanAsk { node, ask, options, context, consequence, on_timeout } => {
            require_node(state, node, r.seq)?;
            let declared = if consequence.is_empty() {
                match &require_node(state, node, r.seq)?.spec {
                    NodeSpec::Human(h) => h.consequence.clone(),
                    _ => vec![],
                }
            } else {
                consequence.clone()
            };
            state.human_pending.insert(
                node.clone(),
                HumanPending {
                    node: node.clone(),
                    ask: ask.clone(),
                    options: options.clone(),
                    context: context.clone(),
                    consequence: declared,
                    on_timeout: *on_timeout,
                    asked_at: r.seq,
                    escalated_after_ms: None,
                    failure: None,
                },
            );
            let n = require_node_mut(state, node, r.seq)?;
            n.state = NodeState::Awaiting;
        }

        Event::HumanEscalate { node, waited_ms } => {
            if let Some(p) = state.human_pending.get_mut(node) {
                p.escalated_after_ms = Some(*waited_ms);
            }
        }

        Event::HumanResolve { node, choice, input, .. } => {
            // An escalated *failure* is not a plan decision: the answer says
            // whether the work runs again. Marking it `done` here would let the
            // dependents read an output the node never produced.
            if let Some(failed) = state.human_pending.get(node).and_then(|p| p.failure.clone()) {
                state.human_pending.remove(node);
                let n = require_node_mut(state, node, r.seq)?;
                if choice == "retry" {
                    n.state = NodeState::Ready;
                    n.failure = None;
                } else {
                    n.state = NodeState::Failed;
                    n.failure = Some(format!("abandoned after failing: {failed}"));
                }
                out.effects.push(Effect::HumanResolved { node: node.clone(), unblocked: vec![] });
                return Ok(());
            }

            let declared = state
                .human_pending
                .get(node)
                .map(|p| p.consequence.clone())
                .or_else(|| match &state.nodes.get(node)?.spec {
                    NodeSpec::Human(h) => Some(h.consequence.clone()),
                    _ => None,
                })
                .unwrap_or_default();

            state.human_pending.remove(node);
            let n = require_node_mut(state, node, r.seq)?;
            n.output = Some(match input {
                Some(v) => serde_json::json!({ "choice": choice, "input": v }),
                None => serde_json::json!({ "choice": choice }),
            });
            n.state = NodeState::Done;

            let all = dependents(state, node);

            // A gate that releases every dependent whatever the answer is not a
            // gate. When the ask declares consequences, an answer unblocks only
            // the nodes it names; the rest are skipped, so answering "no" to
            // "send this?" cannot leave the send node claimable.
            let unblocked: Vec<NodeId> = if declared.is_empty() {
                all
            } else {
                let chosen: BTreeSet<&NodeId> = declared
                    .iter()
                    .filter(|(opt, _)| opt == choice)
                    .flat_map(|(_, nodes)| nodes.iter())
                    .collect();

                let (yes, no): (Vec<NodeId>, Vec<NodeId>) =
                    all.into_iter().partition(|d| chosen.contains(d));

                for d in no {
                    if let Some(dn) = state.nodes.get_mut(&d) {
                        if !dn.state.is_terminal() {
                            dn.state = NodeState::Skipped;
                            out.effects.push(Effect::NodeSkipped { node: d.clone() });
                        }
                    }
                }
                yes
            };

            out.effects.push(Effect::HumanResolved { node: node.clone(), unblocked });
        }

        Event::BeliefAdd {
            id,
            provenance,
            fidelity,
            content,
            summary,
            source,
            observed_at,
            support_mode,
            sensitivity,
            edges,
            produced_by,
            scoped_to,
        } => {
            let graph = state.graph.as_ref().ok_or(FoldError::NoGraph { seq: r.seq })?.id.clone();
            let inherited = inherited_sensitivity(state, edges).join(sensitivity);
            state.beliefs.insert(
                id.clone(),
                Belief {
                    id: id.clone(),
                    graph,
                    provenance: *provenance,
                    fidelity: *fidelity,
                    state: TruthState::Neither,
                    content: content.clone(),
                    summary: summary.clone(),
                    support_mode: *support_mode,
                    observed_at: *observed_at,
                    recorded_at: r.seq,
                    validity: Validity::open(),
                    sensitivity: inherited,
                    source: source.clone(),
                    produced_by: produced_by.clone(),
                    contradiction: None,
                    retraction: None,
                    supersedes: None,
                    superseded_by: None,
                    stale: false,
                    pinned: false,
                    corroborated_by: Vec::new(),
                    content_hash: crate::id::content_hash(content.as_bytes()),
                },
            );
            for (kind, target) in edges {
                state.belief_edges.insert((id.clone(), *kind, target.clone()));
            }
            if let Some(scope) = scoped_to {
                state.belief_edges.insert((
                    id.clone(),
                    BeliefEdge::ScopedTo,
                    scope_belief_marker(scope),
                ));
            }
        }

        Event::Retract { id, reason, evidence, rule } => {
            let b = require_belief_mut(state, id, r.seq)?;
            b.retraction = Some(Retraction {
                reason: reason.clone(),
                evidence: evidence.clone(),
                by: r.actor.clone(),
                rule: *rule,
                at: r.seq,
            });
        }

        Event::Reinstate { id, .. } => {
            let b = require_belief_mut(state, id, r.seq)?;
            b.retraction = None;
            b.stale = false;
        }

        Event::Supersede { old, new, .. } => {
            require_belief(state, new, r.seq)?;
            {
                let b = require_belief_mut(state, old, r.seq)?;
                b.superseded_by = Some(new.clone());
                b.validity = Validity::closed_at(r.at);
                b.stale = false;
                b.retraction = Some(Retraction {
                    reason: "superseded".into(),
                    evidence: vec![new.clone()],
                    by: r.actor.clone(),
                    rule: Some(CascadeRule::Superseded),
                    at: r.seq,
                });
            }
            let nb = require_belief_mut(state, new, r.seq)?;
            nb.supersedes = Some(old.clone());
            state.belief_edges.insert((new.clone(), BeliefEdge::Supersedes, old.clone()));
        }

        Event::Contradict { id, reason, evidence } => {
            let b = require_belief_mut(state, id, r.seq)?;
            b.contradiction = Some(Contradiction {
                reason: reason.clone(),
                evidence: evidence.clone(),
                at: r.seq,
            });
            for e in evidence {
                state.belief_edges.insert((e.clone(), BeliefEdge::Refutes, id.clone()));
            }
        }

        Event::Uncontradict { id, .. } => {
            let b = require_belief_mut(state, id, r.seq)?;
            b.contradiction = None;
        }

        Event::Corroborate { id, by } => {
            let source = require_belief(state, by, r.seq)?.source.clone();
            let b = require_belief_mut(state, id, r.seq)?;
            let _ = b.corroborate(&source);
            state.belief_edges.insert((by.clone(), BeliefEdge::Corroborates, id.clone()));
        }

        Event::Stale { source } => {
            mark_stale(state, source, r.seq, out);
        }

        Event::Pin { id, on } => {
            let b = require_belief_mut(state, id, r.seq)?;
            b.pinned = *on;
        }

        Event::Nogood { id, members, note } => {
            let mut m = members.clone();
            m.sort();
            m.dedup();
            state.nogoods.insert(
                id.clone(),
                Nogood {
                    id: id.clone(),
                    members: m,
                    note: note.clone(),
                    discovered_at: r.seq,
                    by: r.actor.clone(),
                },
            );
        }

        Event::SessionAttach { session, label } => {
            state.sessions.insert(
                session.clone(),
                Session {
                    id: session.clone(),
                    label: label.clone(),
                    attached: true,
                    last_seen: r.seq,
                },
            );
        }

        Event::SessionDetach { session } => {
            if let Some(s) = state.sessions.get_mut(session) {
                s.attached = false;
                s.last_seen = r.seq;
            }
            let owned: Vec<ClaimId> = state
                .active_claims
                .values()
                .filter(|c| state.claims.get(*c).is_some_and(|cl| &cl.session == session))
                .cloned()
                .collect();
            for cid in owned {
                release_claim(state, &cid, r.seq, Some(RevokeReason::SessionGone), out)?;
            }
        }

        Event::SessionHeartbeat { session } => {
            if let Some(s) = state.sessions.get_mut(session) {
                s.last_seen = r.seq;
            }
        }

        Event::CheckResult { passed, .. } => {
            state.check_passed = *passed;
        }

        Event::ReviewFinding { id, review_node, target, severity, body } => {
            state.findings.insert(
                id.clone(),
                Finding {
                    id: id.clone(),
                    review_node: review_node.clone(),
                    target: target.clone(),
                    severity: severity.clone(),
                    body: body.clone(),
                    resolution: None,
                },
            );
        }

        Event::FindingResolve { id, resolution, .. } => {
            if let Some(f) = state.findings.get_mut(id) {
                f.resolution = Some(*resolution);
            }
        }

        Event::ModelCall { .. } => {}
    }
    Ok(())
}

/// Recompute derived state after an event: belief truth values, then node
/// readiness. Runs to a fixed point, which terminates because each pass can only
/// move a belief further down the lattice.
fn settle(state: &mut State, seq: Seq, out: &mut Applied) {
    settle_beliefs(state, seq, out);
    settle_nodes(state, out);
}

/// Does a contradiction still hold?
///
/// A contradiction that *named its evidence* stands only while some of that
/// evidence is still believed. Withdraw the ground and the objection goes with
/// it — otherwise a claim stays contested forever because of a marker whose
/// basis nobody holds any more, which is the fold trusting itself over its log.
///
/// A contradiction with no declared evidence is the caller's own assertion, and
/// stands until they take it back with `uncontradict`.
fn stands(state: &State, c: &Contradiction) -> bool {
    if c.evidence.is_empty() {
        return true;
    }
    c.evidence.iter().any(|e| state.beliefs.get(e).is_none_or(|b| b.state != TruthState::Out))
}

fn settle_beliefs(state: &mut State, seq: Seq, out: &mut Applied) {
    let order: Vec<BeliefId> = state.beliefs.keys().cloned().collect();
    let mut changed = true;
    let mut rounds = 0u32;

    while changed && rounds <= order.len() as u32 + 1 {
        changed = false;
        rounds += 1;

        for id in &order {
            let Some(b) = state.beliefs.get(id) else { continue };
            let before = b.state;

            let support: Vec<BeliefId> = state
                .belief_edges
                .iter()
                .filter(|(from, kind, _)| from == id && *kind == BeliefEdge::DerivesFrom)
                .map(|(_, _, to)| to.clone())
                .collect();

            let support_states: Vec<TruthState> =
                support.iter().filter_map(|s| state.beliefs.get(s).map(|b| b.state)).collect();

            let support_status = classify_support(b.support_mode, &support_states, support.len());
            let retracted = b.retraction.is_some();
            let contradicted = b.contradiction.as_ref().is_some_and(|c| stands(state, c));

            let scope_gone = scope_withdrawn(state, id);
            let after = if scope_gone {
                TruthState::Out
            } else {
                intrinsic_state(contradicted, retracted, support_status)
            };

            if after != before {
                let rule = if scope_gone {
                    Some(CascadeRule::ScopeExit)
                } else if support_status == Support::Withdrawn {
                    Some(CascadeRule::SupportWithdrawn)
                } else if support_status == Support::Contested {
                    Some(CascadeRule::ContradictionCascade)
                } else {
                    None
                };
                if let Some(b) = state.beliefs.get_mut(id) {
                    b.state = after;
                }
                out.effects.push(Effect::BeliefStateChanged {
                    belief: id.clone(),
                    to: after,
                    rule,
                });
                if !after.is_usable_premise() {
                    invalidate_premise(state, id, out);
                }
                changed = true;
            }
        }
        let _ = seq;
    }
}

/// An expanded `forEach` parent produces the array of its children's outputs.
/// Nothing else can: the children are the work, and a downstream binding names
/// the parent, so without this the collection has no producer.
fn aggregate_expansions(state: &mut State, out: &mut Applied) {
    let parents: Vec<NodeId> = state
        .nodes
        .values()
        .filter(|n| n.for_each.is_some() && n.output.is_none() && !n.needs.is_empty())
        .map(|n| n.id.clone())
        .collect();

    for parent in parents {
        // Only this parent's own children. Its original dependencies are still
        // in `needs` and are not part of the collection.
        let kids: Vec<NodeId> = state
            .nodes
            .values()
            .filter(|c| c.parent.as_ref() == Some(&parent))
            .map(|c| c.id.clone())
            .collect();
        if kids.is_empty() {
            continue;
        }

        let mut collected = Vec::with_capacity(kids.len());
        for k in &kids {
            let Some(child) = state.nodes.get(k) else { return };
            match (child.state, &child.output) {
                (NodeState::Done, Some(v)) => collected.push(v.clone()),
                (NodeState::Skipped, _) => {}
                _ => return,
            }
        }

        if let Some(p) = state.nodes.get_mut(&parent) {
            p.output = Some(serde_json::Value::Array(collected));
            p.state = NodeState::Done;
            let _ = out;
        }
    }
}

fn settle_nodes(state: &mut State, out: &mut Applied) {
    aggregate_expansions(state, out);
    let ids: Vec<NodeId> = state.nodes.keys().cloned().collect();
    for id in ids {
        let Some(node) = state.nodes.get(&id) else { continue };
        if node.state.is_terminal()
            || matches!(node.state, NodeState::Claimed | NodeState::Running | NodeState::Awaiting)
        {
            continue;
        }

        let deps: Vec<NodeState> =
            node.needs.iter().filter_map(|n| state.nodes.get(n).map(|d| d.state)).collect();

        let blocked = deps.iter().any(|d| d.blocks_dependents());
        let satisfied = deps.iter().all(|d| d.satisfies_dependents());

        let next = if blocked {
            NodeState::Blocked
        } else if satisfied {
            NodeState::Ready
        } else {
            NodeState::Pending
        };

        if next != node.state {
            if let Some(n) = state.nodes.get_mut(&id) {
                n.state = next;
            }
            match next {
                NodeState::Ready => out.effects.push(Effect::NodeReady { node: id.clone() }),
                NodeState::Blocked => out.effects.push(Effect::NodeBlocked { node: id.clone() }),
                _ => {}
            }
        }
    }

    let failed: Vec<NodeId> = state
        .nodes
        .values()
        .filter(|n| n.state == NodeState::Failed)
        .map(|n| n.id.clone())
        .collect();
    for f in failed {
        for d in descendants(state, &f) {
            if let Some(n) = state.nodes.get_mut(&d) {
                if !n.state.is_terminal() && n.state != NodeState::Awaiting {
                    n.state = NodeState::Skipped;
                    out.effects.push(Effect::NodeSkipped { node: d.clone() });
                }
            }
        }
    }
}

fn scope_withdrawn(state: &State, id: &BeliefId) -> bool {
    state
        .belief_edges
        .iter()
        .filter(|(from, kind, _)| from == id && *kind == BeliefEdge::ScopedTo)
        .any(|(_, _, marker)| {
            scope_node_from_marker(marker)
                .and_then(|n| state.nodes.get(&n))
                .is_some_and(|n| matches!(n.state, NodeState::Skipped | NodeState::Failed))
        })
}

fn invalidate_premise(state: &mut State, belief: &BeliefId, out: &mut Applied) {
    let Some(claims) = state.assumed_by.get(belief) else { return };
    let active: Vec<ClaimId> =
        claims.iter().filter(|c| state.active_claims.values().any(|a| a == *c)).cloned().collect();
    if active.is_empty() {
        return;
    }
    let nodes: Vec<NodeId> = state
        .active_claims
        .iter()
        .filter(|(_, cid)| active.contains(cid))
        .map(|(n, _)| n.clone())
        .collect();
    out.effects.push(Effect::PremiseInvalidated { belief: belief.clone(), claims: active, nodes });
}

fn mark_stale(state: &mut State, written: &SourceRef, _seq: Seq, out: &mut Applied) {
    let ids: Vec<BeliefId> = state
        .beliefs
        .values()
        .filter(|b| b.source.invalidated_by(written) && !b.stale)
        .map(|b| b.id.clone())
        .collect();
    for id in ids {
        let summary = state.beliefs.get(&id).map(|b| b.summary.clone()).unwrap_or_default();
        if let Some(b) = state.beliefs.get_mut(&id) {
            b.stale = true;
        }
        invalidate_premise(state, &id, out);
        let dependents: Vec<BeliefId> = state
            .belief_edges
            .iter()
            .filter(|(_, kind, to)| *kind == BeliefEdge::DerivesFrom && to == &id)
            .map(|(from, _, _)| from.clone())
            .collect();
        for d in dependents {
            if let Some(b) = state.beliefs.get_mut(&d) {
                if b.contradiction.is_none() {
                    b.contradiction = Some(Contradiction {
                        reason: format!("a premise went stale — {summary}"),
                        evidence: vec![id.clone()],
                        at: _seq,
                    });
                }
            }
        }
    }
}

fn release_claim(
    state: &mut State,
    id: &ClaimId,
    seq: Seq,
    revoked: Option<RevokeReason>,
    out: &mut Applied,
) -> Result<(), FoldError> {
    let Some(claim) = state.claims.get(id).cloned() else {
        return Err(FoldError::UnknownClaim { seq, id: id.to_string() });
    };
    let node = state.active_claims.iter().find(|(_, cid)| *cid == id).map(|(n, _)| n.clone());

    if let Some(n) = &node {
        state.active_claims.remove(n);
        if let Some(node_mut) = state.nodes.get_mut(n) {
            node_mut.claim = None;
            if !node_mut.state.is_terminal() && node_mut.state != NodeState::Awaiting {
                node_mut.state = NodeState::Ready;
                out.effects.push(Effect::NodeReady { node: n.clone() });
            }
        }
        if let Some(reason) = revoked {
            out.effects.push(Effect::ClaimRevoked { claim: id.clone(), node: n.clone(), reason });
        }
    }
    drop_claim_index(state, id);
    let _ = claim;
    Ok(())
}

fn drop_claim_index(state: &mut State, id: &ClaimId) {
    for set in state.assumed_by.values_mut() {
        set.remove(id);
    }
    state.assumed_by.retain(|_, v| !v.is_empty());
}

fn cancel_all(state: &mut State, seq: Seq, out: &mut Applied) {
    let active: Vec<ClaimId> = state.active_claims.values().cloned().collect();
    for cid in active {
        let _ = release_claim(state, &cid, seq, Some(RevokeReason::GraphCancelled), out);
    }
    let ids: Vec<NodeId> = state.nodes.keys().cloned().collect();
    for id in ids {
        if let Some(n) = state.nodes.get_mut(&id) {
            if !n.state.is_terminal() {
                n.state = NodeState::Skipped;
                out.effects.push(Effect::NodeSkipped { node: id.clone() });
            }
        }
    }
    state.human_pending.clear();
}

fn inherited_sensitivity(
    state: &State,
    edges: &[(BeliefEdge, BeliefId)],
) -> crate::belief::Sensitivity {
    let supports = edges
        .iter()
        .filter(|(k, _)| *k == BeliefEdge::DerivesFrom)
        .filter_map(|(_, id)| state.beliefs.get(id))
        .map(|b| &b.sensitivity);
    crate::belief::Sensitivity::join_all(supports)
}

fn dependents(state: &State, node: &NodeId) -> Vec<NodeId> {
    let mut v: Vec<NodeId> =
        state.edges.keys().filter(|(from, _)| from == node).map(|(_, to)| to.clone()).collect();
    v.sort();
    v.dedup();
    v
}

fn descendants(state: &State, node: &NodeId) -> Vec<NodeId> {
    let mut seen = BTreeSet::new();
    let mut queue: VecDeque<NodeId> = dependents(state, node).into();
    while let Some(n) = queue.pop_front() {
        if seen.insert(n.clone()) {
            for d in dependents(state, &n) {
                queue.push_back(d);
            }
        }
    }
    seen.into_iter().collect()
}

/// A `scoped-to` edge points at a node, but belief edges are belief-to-belief.
/// The node id is carried in a marker belief id so the edge set stays uniform.
fn scope_belief_marker(node: &NodeId) -> BeliefId {
    BeliefId::derive(&[b"scope-marker", node.as_str().as_bytes()])
}

fn scope_node_from_marker(_marker: &BeliefId) -> Option<NodeId> {
    None
}

/// The merge node that owns the review's findings, identified structurally: a
/// merge whose every dependency is a review node. Spec 09 §5 puts exactly one
/// owner on the review fan-in, and naming it by shape rather than by id keeps
/// the rule out of the node names.
pub fn review_owner(state: &State) -> Option<&Node> {
    state.nodes.values().find(|n| {
        n.kind() == crate::node::NodeKind::Merge
            && !n.needs.is_empty()
            && n.needs.iter().all(|d| {
                state.nodes.get(d).is_some_and(|u| u.kind() == crate::node::NodeKind::Review)
            })
    })
}

/// Review is complete when every lens has run **and** the owner has
/// consolidated. Counting only the lenses declares review done while the node
/// that resolves their findings is still sitting in `ready`.
pub fn review_progress(state: &State) -> (u32, u32) {
    let lenses: Vec<&Node> =
        state.nodes.values().filter(|n| n.kind() == crate::node::NodeKind::Review).collect();
    let owner = review_owner(state);

    let total = lenses.len() as u32 + u32::from(owner.is_some());
    let done = lenses.iter().filter(|n| n.state == NodeState::Done).count() as u32
        + u32::from(owner.is_some_and(|o| o.state == NodeState::Done));
    (done, total)
}

pub fn transition_facts(state: &State) -> TransitionFacts {
    let (review_nodes_done, review_nodes) = review_progress(state);
    let findings_open = state.findings.values().filter(|f| f.resolution.is_none()).count() as u32;
    let nodes_ready = state.nodes.values().filter(|n| n.state == NodeState::Ready).count() as u32;
    let nodes_outstanding =
        state.nodes.values().filter(|n| n.state.is_outstanding()).count() as u32;
    let nodes_failed_terminally =
        state.nodes.values().filter(|n| n.state == NodeState::Failed).count() as u32;

    TransitionFacts {
        check_passed: state.check_passed,
        review_nodes,
        review_nodes_done,
        findings_open,
        nodes_ready,
        nodes_outstanding,
        nodes_failed_terminally,
        has_path_to_terminal: nodes_outstanding > 0 && nodes_failed_terminally == 0,
    }
}

fn require_node<'a>(state: &'a State, id: &NodeId, seq: Seq) -> Result<&'a Node, FoldError> {
    state.nodes.get(id).ok_or_else(|| FoldError::UnknownNode { seq, id: id.to_string() })
}

fn require_node_mut<'a>(
    state: &'a mut State,
    id: &NodeId,
    seq: Seq,
) -> Result<&'a mut Node, FoldError> {
    state.nodes.get_mut(id).ok_or_else(|| FoldError::UnknownNode { seq, id: id.to_string() })
}

fn require_belief<'a>(state: &'a State, id: &BeliefId, seq: Seq) -> Result<&'a Belief, FoldError> {
    state.beliefs.get(id).ok_or_else(|| FoldError::UnknownBelief { seq, id: id.to_string() })
}

fn require_belief_mut<'a>(
    state: &'a mut State,
    id: &BeliefId,
    seq: Seq,
) -> Result<&'a mut Belief, FoldError> {
    state.beliefs.get_mut(id).ok_or_else(|| FoldError::UnknownBelief { seq, id: id.to_string() })
}
