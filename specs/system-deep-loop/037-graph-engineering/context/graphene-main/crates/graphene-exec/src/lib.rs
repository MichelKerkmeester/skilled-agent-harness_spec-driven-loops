//! The execution protocol: how an agent takes work, does it, and reports back.
//!
//! Graphene coordinates; the agent executes. Everything here decides *against*
//! state and writes the decision — which is why it runs inside `Store::mutate`,
//! under the write lock, rather than as a read followed by an append.

pub mod evidence;
mod status;

use std::collections::BTreeMap;

use graphene_check::schema::{self, Type};
use graphene_core::belief::TruthState;
use graphene_core::budget::Spend;
use graphene_core::event::{Event, FindingResolution, Record, RevokeReason};
use graphene_core::fold::{Applied, State};
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, ClaimId, FindingId, GraphId, NodeId, SessionId};
use graphene_core::node::{Binding, Node, NodeKind, NodeSpec, NodeState, TimeoutPolicy};
use graphene_core::refusal::{Detail, Refusal, RefusalCode, StalePremise, Suggestion};
use graphene_core::time::{Deadline, Seq, Timestamp};
use graphene_store::{Store, StoreError};
use serde::{Deserialize, Serialize};
use serde_json::Value;

pub use status::{compute as compute_status, sessions, NextAction, SessionView, Status};

pub const DEFAULT_LEASE_MS: i64 = 300_000;

#[derive(Debug, thiserror::Error)]
pub enum ExecError {
    #[error(transparent)]
    Store(StoreError),
    #[error("refused: {}", .0.reason)]
    Refused(Box<Refusal>),
    #[error("unknown node `{0}`")]
    UnknownNode(String),
}

/// A refusal raised inside a `decide` closure travels back as `Refused`, not as
/// a generic store failure — the caller is meant to read and act on it.
impl From<StoreError> for ExecError {
    fn from(e: StoreError) -> Self {
        match e {
            StoreError::Refusal(r) => ExecError::Refused(r),
            other => ExecError::Store(other),
        }
    }
}

impl From<Box<Refusal>> for ExecError {
    fn from(r: Box<Refusal>) -> Self {
        ExecError::Refused(r)
    }
}

impl ExecError {
    pub fn refusal(&self) -> Option<&Refusal> {
        match self {
            ExecError::Refused(r) => Some(r),
            _ => None,
        }
    }
}

type Result<T> = std::result::Result<T, ExecError>;

/// A node an agent may take, with everything needed to do the work.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Claimed {
    pub node: NodeId,
    pub name: String,
    pub kind: NodeKind,
    pub spec: NodeSpec,
    pub inputs: Value,
    pub outputs_schema: Value,
    pub claim: ClaimId,
    pub expires_at: Timestamp,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub checkpoints: Vec<Value>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Claimable {
    pub node: NodeId,
    pub name: String,
    pub kind: NodeKind,
    pub capability: String,
}

/// A human node, rendered so a cold agent in a fresh session can act on it.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct HumanNodeView {
    pub node: NodeId,
    pub name: String,
    pub state: NodeState,
    pub ask: String,
    pub options: Vec<String>,
    pub on_timeout: TimeoutPolicy,
    pub outputs_schema: Value,
    pub context: Vec<ContextBelief>,
    /// How long it had waited when its deadline passed. Present means nobody
    /// answered in time and the ask was raised — an escalation nobody can see is
    /// the same as no escalation.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub escalated_after_ms: Option<i64>,
    /// One sentence naming every premise that moved, so a cold agent does not
    /// have to notice it by scanning `context`. Present only when something is
    /// wrong, so its presence is the signal.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub premises_moved: Option<String>,
    pub consequence: Vec<(String, Vec<NodeId>)>,
    pub graph: GraphId,
    pub graph_title: String,
    pub task: String,
    pub asked_at: Option<Seq>,
}

/// A belief shown alongside a human node's ask.
///
/// `stale` and `contradiction` are the point: an approver must see that a
/// premise died before they act on the draft resting on it.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct ContextBelief {
    pub id: BeliefId,
    pub summary: String,
    pub state: TruthState,
    pub fidelity: graphene_core::Fidelity,
    pub source: String,
    pub stale: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub contradiction: Option<String>,
}

/// What a human node is asking.
///
/// `on_timeout` has no default: silence must never be indistinguishable from
/// approval.
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Ask {
    pub question: String,
    pub options: Vec<String>,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub context: Vec<BeliefId>,
    /// Which dependents each answer releases. Empty falls back to the node's
    /// own declaration; empty in both places is a gate that does not gate.
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub consequence: Vec<(String, Vec<NodeId>)>,
    pub on_timeout: TimeoutPolicy,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Swept {
    pub revoked: Vec<Revoked>,
    pub timed_out: Vec<NodeId>,
}

impl Swept {
    pub fn is_empty(&self) -> bool {
        self.revoked.is_empty() && self.timed_out.is_empty()
    }
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Revoked {
    pub claim: ClaimId,
    pub node: NodeId,
    pub graph: GraphId,
    pub session: SessionId,
    pub reason: RevokeReason,
}

pub struct Executor {
    store: Store,
}

impl Executor {
    pub fn new(store: Store) -> Self {
        Executor { store }
    }

    pub fn store(&self) -> &Store {
        &self.store
    }

    pub fn store_mut(&mut self) -> &mut Store {
        &mut self.store
    }

    // -------------------------------------------------------------- sessions

    pub fn attach(
        &mut self,
        graph: &GraphId,
        session: &SessionId,
        label: Option<String>,
        now: Timestamp,
    ) -> Result<Status> {
        self.store.append(
            graph,
            Actor::Session { id: session.clone() },
            now,
            Event::SessionAttach { session: session.clone(), label },
        )?;
        self.status(graph, Some(session), now)
    }

    pub fn detach(
        &mut self,
        graph: &GraphId,
        session: &SessionId,
        now: Timestamp,
    ) -> Result<Applied> {
        let (_, applied) = self.store.append(
            graph,
            Actor::Session { id: session.clone() },
            now,
            Event::SessionDetach { session: session.clone() },
        )?;
        Ok(applied)
    }

    pub fn heartbeat(
        &mut self,
        graph: &GraphId,
        session: &SessionId,
        now: Timestamp,
    ) -> Result<()> {
        self.store.append(
            graph,
            Actor::Session { id: session.clone() },
            now,
            Event::SessionHeartbeat { session: session.clone() },
        )?;
        Ok(())
    }

    // ------------------------------------------------------------------ work

    pub fn next(&self, graph: &GraphId) -> Result<Vec<Claimable>> {
        let state = self.store.state(graph)?;
        Ok(claimable(&state))
    }

    /// Take a node, asserting the beliefs the work will stand on.
    ///
    /// The read-set is validated *inside* the write lock, so a premise cannot
    /// die between the check and the claim.
    pub fn claim(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        session: &SessionId,
        read_set: &[BeliefId],
        lease_ms: i64,
        now: Timestamp,
    ) -> Result<Claimed> {
        let node = node.clone();
        let session = session.clone();
        let read_set = read_set.to_vec();
        let expires_at = Deadline(Timestamp(now.0 + lease_ms));

        let mut claimed: Option<Claimed> = None;
        let out = &mut claimed;

        let (_records, _) = self.store.mutate(graph, |state| {
            let n =
                state.nodes.get(&node).ok_or_else(|| StoreError::UnknownGraph(node.to_string()))?;

            if let Some(existing) = state.active_claims.get(&node) {
                let holder = state.claims.get(existing).map(|c| c.session.clone());
                return Err(refuse(
                    RefusalCode::AlreadyClaimed,
                    Suggestion::ClaimAnother,
                    "another session holds this node",
                    Detail { held_by: holder, claim: Some(existing.clone()), ..Default::default() },
                ));
            }

            if !n.state.is_claimable() {
                return Err(refuse(
                    RefusalCode::NotClaimable,
                    Suggestion::AdvanceGraphState,
                    format!("`{}` is `{}`, not claimable", n.name, n.state.as_str()),
                    Detail { node: Some(node.clone()), ..Default::default() },
                ));
            }

            let stale = stale_premises(state, &read_set);
            if !stale.is_empty() {
                return Err(refuse(
                    RefusalCode::StalePremise,
                    Suggestion::RebindAndReclaim,
                    "one or more premises in the read-set are no longer believed",
                    Detail { stale, node: Some(node.clone()), ..Default::default() },
                ));
            }

            if let Some(g) = &state.graph {
                // Review runs during `checked → reviewed`, before the plan is
                // approved. Requiring `running` would deadlock: the graph cannot
                // reach `reviewed` until review completes, and review could not
                // start until it had. The merge that owns the lenses' findings
                // is part of review, so it is subject to the same exception —
                // it is a `merge` by kind and unclaimable without this.
                let is_review_work = n.kind() == NodeKind::Review
                    || graphene_core::fold::review_owner(state).is_some_and(|o| o.id == node);
                let allowed = if is_review_work {
                    matches!(g.state, GraphState::Checked | GraphState::Running)
                } else {
                    g.state == GraphState::Running
                };
                if !allowed {
                    return Err(refuse(
                        RefusalCode::BadGraphState,
                        Suggestion::AdvanceGraphState,
                        format!(
                            "a `{}` node cannot be claimed while the graph is `{}`",
                            n.kind().as_str(),
                            g.state.as_str()
                        ),
                        Detail::default(),
                    ));
                }
                if let Err(dim) = g.spend.admits(estimate(n), &g.budget) {
                    let limit = match dim {
                        graphene_core::budget::Dimension::Tokens => g.budget.tokens,
                        graphene_core::budget::Dimension::MicrosUsd => g.budget.micros_usd,
                        graphene_core::budget::Dimension::WallMs => g.budget.wall_ms,
                    };
                    return Err(StoreError::Refusal(Box::new(Spend::refuse(
                        dim,
                        limit.unwrap_or(0),
                        g.spend.tokens,
                    ))));
                }
            }

            let inputs = resolve_inputs(state, n)?;
            let claim = ClaimId::for_claim(&node, &session, state.seq.0 + 1);

            *out = Some(Claimed {
                node: node.clone(),
                name: n.name.clone(),
                kind: n.kind(),
                spec: n.spec.clone(),
                inputs,
                outputs_schema: n.outputs.clone(),
                claim: claim.clone(),
                expires_at: expires_at.0,
                checkpoints: n.checkpoints.iter().map(|c| c.state.clone()).collect(),
            });

            Ok(vec![(
                Actor::Session { id: session.clone() },
                now,
                Event::Claim {
                    id: claim,
                    node: node.clone(),
                    session: session.clone(),
                    read_set: read_set.clone(),
                    expires_at,
                },
            )])
        })?;

        claimed.ok_or_else(|| ExecError::UnknownNode(node.to_string()))
    }

    pub fn renew(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        lease_ms: i64,
        now: Timestamp,
    ) -> Result<Timestamp> {
        let state = self.store.state(graph)?;
        let claim = held_claim(&state, node)?.clone();

        let expires_at = Deadline(Timestamp(now.0 + lease_ms));
        self.store.append(
            graph,
            Actor::Session { id: claim.session.clone() },
            now,
            Event::Claim {
                id: claim.id.clone(),
                node: node.clone(),
                session: claim.session,
                read_set: claim.read_set,
                expires_at,
            },
        )?;
        Ok(expires_at.0)
    }

    pub fn release(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        reason: Option<String>,
        now: Timestamp,
    ) -> Result<Applied> {
        let state = self.store.state(graph)?;
        let claim = held_claim(&state, node)?.id.clone();
        let (_, applied) = self.store.append(
            graph,
            Actor::System,
            now,
            Event::ClaimRelease { id: claim, reason },
        )?;
        Ok(applied)
    }

    /// Record progress at an edge crossing, and renew the lease while we are
    /// here — a long node that checkpoints is a long node that should not be
    /// preempted for taking its time.
    pub fn checkpoint(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        state_value: Value,
        now: Timestamp,
    ) -> Result<()> {
        let state = self.store.state(graph)?;
        let claim = held_claim(&state, node)?.clone();

        self.store.append(
            graph,
            Actor::System,
            now,
            Event::Checkpoint { node: node.clone(), state: state_value },
        )?;

        let lease = claim.expires_at.0 .0 - claim.leased_at.0;
        self.store.append(
            graph,
            Actor::Session { id: claim.session.clone() },
            now,
            Event::Claim {
                id: claim.id.clone(),
                node: node.clone(),
                session: claim.session,
                read_set: claim.read_set,
                expires_at: Deadline(Timestamp(now.0 + lease.max(DEFAULT_LEASE_MS))),
            },
        )?;
        Ok(())
    }

    /// Record a node's result. **Fails closed** on a schema mismatch.
    pub fn done(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        output: Value,
        spend: Spend,
        now: Timestamp,
    ) -> Result<Applied> {
        let node = node.clone();
        let (_, applied) = self.store.mutate(graph, |state| {
            let n =
                state.nodes.get(&node).ok_or_else(|| StoreError::UnknownGraph(node.to_string()))?;

            if !state.active_claims.contains_key(&node) && n.kind() != NodeKind::Human {
                return Err(refuse(
                    RefusalCode::ClaimRevoked,
                    Suggestion::RebindAndReclaim,
                    "this node is not claimed; the lease was released or revoked",
                    Detail { node: Some(node.clone()), ..Default::default() },
                ));
            }

            let ty = schema::parse(&n.outputs).map_err(|u| {
                refuse(
                    RefusalCode::OutputSchemaViolation,
                    Suggestion::FixCheckErrors,
                    format!(
                        "`{}` declares an output schema this runtime cannot verify: `{}`",
                        n.name, u.construct
                    ),
                    Detail { node: Some(node.clone()), ..Default::default() },
                )
            })?;

            if let Err(e) = schema::validate_value(&output, &ty) {
                return Err(refuse(
                    RefusalCode::OutputSchemaViolation,
                    Suggestion::FixCheckErrors,
                    format!(
                        "`{}` produced `{}` at `{}` where its declared schema requires `{}`",
                        n.name, e.found, e.at, e.expected
                    ),
                    Detail { node: Some(node.clone()), ..Default::default() },
                ));
            }

            let mut events = vec![(
                Actor::System,
                now,
                Event::NodeDone { node: node.clone(), output: output.clone(), spend },
            )];

            if n.kind() == NodeKind::Review {
                let by_name: BTreeMap<&str, &NodeId> =
                    state.nodes.values().map(|x| (x.name.as_str(), &x.id)).collect();
                for (i, f) in review_findings(&output, &node, &by_name)?.into_iter().enumerate() {
                    let _ = i;
                    events.push((Actor::System, now, f));
                }
            }

            Ok(events)
        })?;
        Ok(applied)
    }

    pub fn resolve_finding(
        &mut self,
        graph: &GraphId,
        finding: &FindingId,
        resolution: FindingResolution,
        reason: String,
        now: Timestamp,
    ) -> Result<Applied> {
        let finding = finding.clone();
        let (_, applied) = self.store.mutate(graph, |state| {
            let Some(f) = state.findings.get(&finding) else {
                return Err(refuse(
                    RefusalCode::NotFound,
                    Suggestion::FixCheckErrors,
                    format!("no finding `{finding}` in this graph"),
                    Detail::default(),
                ));
            };
            if f.resolution.is_some() {
                return Err(refuse(
                    RefusalCode::AlreadyApplied,
                    Suggestion::AlreadyApplied,
                    format!("`{finding}` is already resolved"),
                    Detail::default(),
                ));
            }
            Ok(vec![(
                Actor::System,
                now,
                Event::FindingResolve {
                    id: finding.clone(),
                    resolution,
                    reason: Some(reason.clone()),
                },
            )])
        })?;
        Ok(applied)
    }

    pub fn fail(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        reason: impl Into<String>,
        retryable: bool,
        now: Timestamp,
    ) -> Result<Applied> {
        let (_, applied) = self.store.append(
            graph,
            Actor::System,
            now,
            Event::NodeFail { node: node.clone(), reason: reason.into(), retryable },
        )?;
        Ok(applied)
    }

    // ----------------------------------------------------------- human nodes

    pub fn ask(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        ask: Ask,
        now: Timestamp,
    ) -> Result<Applied> {
        let (_, applied) = self.store.append(
            graph,
            Actor::System,
            now,
            Event::HumanAsk {
                node: node.clone(),
                ask: ask.question,
                options: ask.options,
                context: ask.context,
                consequence: ask.consequence,
                on_timeout: ask.on_timeout,
            },
        )?;
        Ok(applied)
    }

    /// Everything a cold agent needs to act on a pasted node id.
    pub fn human_node(&self, graph: &GraphId, node: &NodeId) -> Result<HumanNodeView> {
        let state = self.store.state(graph)?;
        let n = state.nodes.get(node).ok_or_else(|| ExecError::UnknownNode(node.to_string()))?;

        let pending = state.human_pending.get(node);
        let (ask, options, context, on_timeout, asked_at) = match (&n.spec, pending) {
            (_, Some(p)) => (
                p.ask.clone(),
                p.options.clone(),
                p.context.clone(),
                p.on_timeout,
                Some(p.asked_at),
            ),
            (NodeSpec::Human(h), None) => {
                (h.ask.clone(), h.options.clone(), h.context.clone(), h.on_timeout, None)
            }
            _ => {
                return Err(ExecError::Refused(Box::new(Refusal::new(
                    RefusalCode::NotFound,
                    Suggestion::AlreadyApplied,
                    format!("`{}` is not a human node", n.name),
                ))))
            }
        };

        let context: Vec<ContextBelief> = context
            .iter()
            .filter_map(|id| state.beliefs.get(id))
            .map(|b| ContextBelief {
                id: b.id.clone(),
                summary: b.summary.clone(),
                state: b.state,
                fidelity: b.fidelity,
                source: b.source.key(),
                stale: b.stale,
                contradiction: b.contradiction.as_ref().map(|c| c.reason.clone()),
            })
            .collect();

        let consequence = match &n.spec {
            NodeSpec::Human(h) if !h.consequence.is_empty() => h.consequence.clone(),
            _ => options.iter().map(|o| (o.clone(), dependents(&state, node))).collect(),
        };

        let graph_meta = state.graph.as_ref();
        Ok(HumanNodeView {
            node: node.clone(),
            name: n.name.clone(),
            state: n.state,
            ask,
            options,
            on_timeout,
            outputs_schema: n.outputs.clone(),
            escalated_after_ms: pending.and_then(|p| p.escalated_after_ms),
            premises_moved: describe_moved_premises(&context),
            context,
            consequence,
            graph: graph.clone(),
            graph_title: graph_meta.map(|g| g.title.clone()).unwrap_or_default(),
            task: graph_meta.map(|g| g.task.clone()).unwrap_or_default(),
            asked_at,
        })
    }

    pub fn resolve(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        by: impl Into<String>,
        choice: impl Into<String>,
        input: Option<Value>,
        now: Timestamp,
    ) -> Result<Applied> {
        let node = node.clone();
        let by = by.into();
        let choice = choice.into();

        let (_, applied) = self.store.mutate(graph, |state| {
            let n =
                state.nodes.get(&node).ok_or_else(|| StoreError::UnknownGraph(node.to_string()))?;

            let options = match (&n.spec, state.human_pending.get(&node)) {
                (_, Some(p)) => p.options.clone(),
                (NodeSpec::Human(h), None) => h.options.clone(),
                _ => vec![],
            };
            if !options.is_empty() && !options.contains(&choice) {
                return Err(refuse(
                    RefusalCode::NotFound,
                    Suggestion::AwaitHuman,
                    format!("`{choice}` is not one of: {}", options.join(", ")),
                    Detail { node: Some(node.clone()), ..Default::default() },
                ));
            }

            Ok(vec![(
                Actor::Human { id: by.clone() },
                now,
                Event::HumanResolve {
                    node: node.clone(),
                    by: by.clone(),
                    choice: choice.clone(),
                    input: input.clone(),
                },
            )])
        })?;
        Ok(applied)
    }

    pub fn awaiting(&self, graph: &GraphId) -> Result<Vec<HumanNodeView>> {
        let state = self.store.state(graph)?;
        let mut out = Vec::new();
        for node in state.human_pending.keys() {
            if let Ok(v) = self.human_node(graph, node) {
                out.push(v);
            }
        }
        Ok(out)
    }

    // -------------------------------------------------------------- expansion

    /// Materialize a `forEach` node's children from its source's output.
    pub fn expand(
        &mut self,
        graph: &GraphId,
        node: &NodeId,
        now: Timestamp,
    ) -> Result<Vec<NodeId>> {
        let node = node.clone();
        let mut ids = Vec::new();
        let out = &mut ids;

        self.store.mutate(graph, |state| {
            let n =
                state.nodes.get(&node).ok_or_else(|| StoreError::UnknownGraph(node.to_string()))?;
            let Some(fe) = &n.for_each else {
                return Ok(vec![]);
            };
            let source = state
                .nodes
                .get(&fe.over.from)
                .ok_or_else(|| StoreError::UnknownGraph(fe.over.from.to_string()))?;
            let Some(output) = &source.output else {
                return Ok(vec![]);
            };
            let Some(items) = schema::select(output, &fe.over.select).and_then(|v| match v {
                Value::Array(a) => Some(a),
                _ => None,
            }) else {
                return Ok(vec![]);
            };

            if items.len() as u32 > fe.max {
                return Err(refuse(
                    RefusalCode::LimitExceeded,
                    Suggestion::ReduceScopeOrRaiseBudget,
                    format!(
                        "`{}` would expand to {} children, above its declared bound of {}",
                        n.name,
                        items.len(),
                        fe.max
                    ),
                    Detail {
                        node: Some(node.clone()),
                        limit: Some(fe.max as u64),
                        actual: Some(items.len() as u64),
                        ..Default::default()
                    },
                ));
            }

            let mut children = Vec::new();
            for (i, item) in items.iter().enumerate() {
                let mut child = n.clone();
                child.id = NodeId::for_expansion(&node, i as u32);
                child.name = format!("{}[{}]", n.name, i);
                child.parent = Some(node.clone());
                child.for_each = None;
                child.state = NodeState::Pending;
                child.output = None;
                child.checkpoints = vec![];
                child.bindings.push(Binding {
                    from: fe.over.from.clone(),
                    select: format!("{}[{}]", fe.over.select, i),
                    into: fe.as_field.clone(),
                });
                let _ = item;
                out.push(child.id.clone());
                children.push(child);
            }

            Ok(vec![(Actor::System, now, Event::NodeExpand { parent: node.clone(), children })])
        })?;

        Ok(ids)
    }

    // ------------------------------------------------------------ maintenance

    /// Revoke every claim whose lease has run out.
    ///
    /// Expiry is evaluated here against a caller-supplied clock rather than
    /// stored, so the fold stays replayable.
    pub fn sweep_leases(&mut self, now: Timestamp) -> Result<Vec<Revoked>> {
        let expired = self.store.expired_claims(now)?;
        let mut out = Vec::new();
        for c in expired {
            self.store.append(
                &c.graph,
                Actor::System,
                now,
                Event::ClaimRevoke {
                    id: ClaimId::parse(&c.claim)
                        .map_err(|_| ExecError::UnknownNode(c.claim.clone()))?,
                    reason: RevokeReason::LeaseExpired,
                },
            )?;
            out.push(Revoked {
                claim: ClaimId::parse(&c.claim).expect("stored id"),
                node: c.node,
                graph: c.graph,
                session: c.session,
                reason: RevokeReason::LeaseExpired,
            });
        }
        Ok(out)
    }

    /// Everything that comes due with the passage of time: expired leases, and
    /// human nodes past their deadline.
    ///
    /// Both were unreachable before this existed — `sweep_human_timeouts` had no
    /// caller at all, so `expire` and `escalate` were accepted, validated,
    /// stored, and ignored, and silence *was* indistinguishable from approval.
    ///
    /// Deadlines are a function of the clock, so they cannot wait for a daemon:
    /// the server sweeps on its tick, and the CLI sweeps on the read paths where
    /// the answer would otherwise be wrong.
    pub fn sweep_deadlines(&mut self, graph: &GraphId, now: Timestamp) -> Result<Swept> {
        let revoked = self.sweep_leases(now)?;
        let timed_out = self.sweep_human_timeouts(graph, now)?;
        Ok(Swept { revoked, timed_out })
    }

    /// Apply the declared timeout policy to human nodes that have waited too long.
    pub fn sweep_human_timeouts(&mut self, graph: &GraphId, now: Timestamp) -> Result<Vec<NodeId>> {
        let state = self.store.state(graph)?;
        let mut acted = Vec::new();

        for (node, pending) in &state.human_pending {
            let Some(asked) = self.store.event_time(graph, pending.asked_at)? else { continue };
            let waited = now.0 - asked.0;
            let over = match pending.on_timeout {
                TimeoutPolicy::Wait => false,
                TimeoutPolicy::Expire { after_ms } | TimeoutPolicy::Escalate { after_ms } => {
                    waited >= after_ms as i64
                }
            };
            if !over || pending.escalated_after_ms.is_some() {
                continue;
            }
            match pending.on_timeout {
                TimeoutPolicy::Expire { .. } => {
                    self.store.append(
                        graph,
                        Actor::System,
                        now,
                        Event::NodeFail {
                            node: node.clone(),
                            reason: "the human node expired unanswered".into(),
                            retryable: false,
                        },
                    )?;
                    acted.push(node.clone());
                }
                TimeoutPolicy::Escalate { .. } => {
                    // Escalation raises the ask; it does not answer it, so the
                    // node stays `awaiting`. Recording it once is what keeps a
                    // repeated read from appending an event every time.
                    self.store.append(
                        graph,
                        Actor::System,
                        now,
                        Event::HumanEscalate { node: node.clone(), waited_ms: waited },
                    )?;
                    acted.push(node.clone());
                }
                TimeoutPolicy::Wait => {}
            }
        }
        Ok(acted)
    }

    pub fn status(
        &self,
        graph: &GraphId,
        session: Option<&SessionId>,
        now: Timestamp,
    ) -> Result<Status> {
        let state = self.store.state(graph)?;
        Ok(status::compute(&state, session, now))
    }

    pub fn records(&self, graph: &GraphId) -> Result<Vec<Record>> {
        Ok(self.store.records(graph)?)
    }
}

// ------------------------------------------------------------------ helpers

fn refuse(
    code: RefusalCode,
    suggestion: Suggestion,
    reason: impl Into<String>,
    detail: Detail,
) -> StoreError {
    let r = Refusal::new(code, suggestion, reason).with_detail(detail);
    StoreError::Refusal(Box::new(r))
}

pub(crate) fn claimable(state: &State) -> Vec<Claimable> {
    state
        .nodes
        .values()
        .filter(|n| n.state.is_claimable() && !state.active_claims.contains_key(&n.id))
        .map(|n| Claimable {
            node: n.id.clone(),
            name: n.name.clone(),
            kind: n.kind(),
            capability: n.capability.clone(),
        })
        .collect()
}

fn stale_premises(state: &State, read_set: &[BeliefId]) -> Vec<StalePremise> {
    read_set
        .iter()
        .filter_map(|id| state.beliefs.get(id))
        .filter(|b| !b.is_usable_premise())
        .map(|b| StalePremise {
            id: b.id.clone(),
            state: b.state,
            summary: b.summary.clone(),
            contradicted_by: b.contradiction.as_ref().and_then(|c| c.evidence.first().cloned()),
            stale: b.stale,
        })
        .collect()
}

fn estimate(node: &Node) -> Spend {
    Spend {
        tokens: node.budget.tokens.unwrap_or(0),
        micros_usd: node.budget.micros_usd.unwrap_or(0),
        wall_ms: node.budget.wall_ms.unwrap_or(0),
    }
}

/// Build a node's concrete inputs by pulling each binding from its source's
/// recorded output.
pub fn resolve_inputs(state: &State, node: &Node) -> std::result::Result<Value, StoreError> {
    let mut obj = serde_json::Map::new();

    for b in &node.bindings {
        let source =
            state.nodes.get(&b.from).ok_or_else(|| StoreError::UnknownGraph(b.from.to_string()))?;
        let Some(output) = &source.output else {
            return Err(refuse(
                RefusalCode::NotClaimable,
                Suggestion::AdvanceGraphState,
                format!("`{}` has not produced its output yet", source.name),
                Detail { node: Some(b.from.clone()), ..Default::default() },
            ));
        };
        let Some(value) = schema::select(output, &b.select) else {
            return Err(refuse(
                RefusalCode::OutputSchemaViolation,
                Suggestion::FixCheckErrors,
                format!("`{}` does not provide `{}`", source.name, b.select),
                Detail { node: Some(b.from.clone()), ..Default::default() },
            ));
        };
        obj.insert(b.into.clone(), value);
    }

    let value = Value::Object(obj);
    if let Ok(ty @ Type::Object { .. }) = schema::parse(&node.inputs) {
        if let Err(e) = schema::validate_value(&value, &ty) {
            return Err(refuse(
                RefusalCode::OutputSchemaViolation,
                Suggestion::FixCheckErrors,
                format!(
                    "resolved inputs for `{}` are `{}` at `{}` where `{}` is required",
                    node.name, e.found, e.at, e.expected
                ),
                Detail { node: Some(node.id.clone()), ..Default::default() },
            ));
        }
    }
    Ok(value)
}

pub(crate) fn dependents(state: &State, node: &NodeId) -> Vec<NodeId> {
    let mut v: Vec<NodeId> =
        state.nodes.values().filter(|n| n.needs.contains(node)).map(|n| n.id.clone()).collect();
    v.sort();
    v
}

/// Turn a review node's declared `findings` into real `ReviewFinding` events.
///
/// Without this the lenses' output is opaque JSON: `state.findings` stays
/// empty, `findings_open` is always zero, and `resolve-findings` can never
/// fire — the whole reason review is nodes rather than a linter.
///
/// A `target` naming no node is refused. A finding aimed at nothing cannot be
/// applied, and silently keeping it would hold the graph forever.
/// The sentence an agent reads to the person before asking them to decide.
fn describe_moved_premises(context: &[ContextBelief]) -> Option<String> {
    let contested: Vec<&str> = context
        .iter()
        .filter(|c| c.state == TruthState::Both)
        .map(|c| c.summary.as_str())
        .collect();
    let stale: Vec<&str> = context
        .iter()
        .filter(|c| c.stale && c.state != TruthState::Both)
        .map(|c| c.summary.as_str())
        .collect();

    if contested.is_empty() && stale.is_empty() {
        return None;
    }

    let mut parts = Vec::new();
    if !contested.is_empty() {
        parts.push(format!("contested: {}", contested.join("; ")));
    }
    if !stale.is_empty() {
        parts.push(format!("read from a source that has since been written: {}", stale.join("; ")));
    }
    Some(format!(
        "This decision rests on {} premise(s) that have moved — {}. Say so before asking anyone to decide.",
        contested.len() + stale.len(),
        parts.join(" | ")
    ))
}

/// The claim a caller must hold to act on a node. Distinguishes "no such node"
/// from "you do not hold it" — both used to surface as `unknown node`, an error
/// rather than a refusal, with no suggestion attached.
fn held_claim<'a>(state: &'a State, node: &NodeId) -> Result<&'a graphene_core::node::Claim> {
    if !state.nodes.contains_key(node) {
        return Err(ExecError::Refused(Box::new(
            Refusal::new(
                RefusalCode::NotFound,
                Suggestion::FixCheckErrors,
                format!("no node `{node}` in this graph"),
            )
            .with_detail(Detail { node: Some(node.clone()), ..Default::default() }),
        )));
    }
    state.active_claims.get(node).and_then(|c| state.claims.get(c)).ok_or_else(|| {
        ExecError::Refused(Box::new(
            Refusal::new(
                RefusalCode::ClaimRevoked,
                Suggestion::RebindAndReclaim,
                "you do not hold this node; claim it before acting on it",
            )
            .with_detail(Detail { node: Some(node.clone()), ..Default::default() }),
        ))
    })
}

fn review_findings(
    output: &Value,
    review_node: &NodeId,
    by_name: &BTreeMap<&str, &NodeId>,
) -> std::result::Result<Vec<Event>, StoreError> {
    let Some(items) = output.get("findings").and_then(Value::as_array) else {
        return Ok(vec![]);
    };

    let mut events = Vec::with_capacity(items.len());
    for (i, item) in items.iter().enumerate() {
        let bad = |what: &str| {
            refuse(
                RefusalCode::OutputSchemaViolation,
                Suggestion::FixCheckErrors,
                format!("finding[{i}]: {what}"),
                Detail { node: Some(review_node.clone()), ..Default::default() },
            )
        };

        let Some(obj) = item.as_object() else {
            return Err(bad("must be an object with `target`, `severity`, and `body`"));
        };
        let target_name = obj
            .get("target")
            .and_then(Value::as_str)
            .ok_or_else(|| bad("has no `target` naming the node it is about"))?;
        let target = by_name.get(target_name).ok_or_else(|| {
            bad(&format!("targets `{target_name}`, which is not a node in this plan"))
        })?;
        let severity =
            obj.get("severity").and_then(Value::as_str).ok_or_else(|| bad("has no `severity`"))?;
        let body = obj.get("body").and_then(Value::as_str).ok_or_else(|| bad("has no `body`"))?;

        events.push(Event::ReviewFinding {
            id: FindingId::for_finding(review_node, i as u32),
            review_node: review_node.clone(),
            target: (*target).clone(),
            severity: severity.to_string(),
            body: body.to_string(),
        });
    }
    Ok(events)
}
