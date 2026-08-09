//! `status` — the deterministic half of the workflow.
//!
//! State → next action is a lookup, so it lives in code rather than in prose the
//! agent has to remember. The skill's procedural section reduces to *"run
//! status, do what it says, repeat"*, which leaves its prose free for the parts
//! that genuinely need judgment.

use std::collections::BTreeMap;

use graphene_core::belief::TruthState;
use graphene_core::fold::State;
use graphene_core::graph::GraphState;
use graphene_core::id::{GraphId, NodeId, SessionId};
use graphene_core::node::NodeState;
use graphene_core::time::Timestamp;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "do", rename_all = "kebab-case")]
pub enum NextAction {
    Check,
    FixCheckErrors,
    Review,
    ResolveFindings { open: u32 },
    PresentToUser,
    Start,
    Claim { nodes: Vec<NodeId> },
    ReportAwaiting { nodes: Vec<NodeId> },
    Wait { reason: String },
    Finish,
    Nothing { reason: String },
}

#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct NodeCounts {
    pub total: u32,
    pub pending: u32,
    pub ready: u32,
    pub claimed: u32,
    pub running: u32,
    pub awaiting: u32,
    pub blocked: u32,
    pub done: u32,
    pub failed: u32,
    pub skipped: u32,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct SessionView {
    pub id: SessionId,
    pub label: Option<String>,
    pub attached: bool,
    pub holding: Vec<NodeId>,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Status {
    pub graph: GraphId,
    pub title: String,
    pub state: GraphState,
    pub nodes: NodeCounts,
    pub beliefs_contested: u32,
    pub sessions: Vec<SessionView>,
    pub budget: BudgetView,
    pub next_action: NextAction,
    pub why: String,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct BudgetView {
    pub tokens_used: u64,
    pub tokens_limit: Option<u64>,
    pub micros_usd_used: u64,
    pub micros_usd_limit: Option<u64>,
}

/// Every session with a stake in this graph: those that attached, **and** those
/// holding a claim without having attached. A session driving the CLI never has
/// to attach, so listing only attached sessions hides exactly the holder whose
/// work you are trying to find.
pub fn sessions(state: &State) -> Vec<SessionView> {
    let mut holding: BTreeMap<SessionId, Vec<NodeId>> = BTreeMap::new();
    for (node, cid) in &state.active_claims {
        if let Some(c) = state.claims.get(cid) {
            holding.entry(c.session.clone()).or_default().push(node.clone());
        }
    }

    let mut out: Vec<SessionView> = state
        .sessions
        .values()
        .map(|s| SessionView {
            id: s.id.clone(),
            label: s.label.clone(),
            attached: s.attached,
            holding: holding.remove(&s.id).unwrap_or_default(),
        })
        .collect();

    out.extend(holding.into_iter().map(|(id, nodes)| SessionView {
        id,
        label: None,
        attached: false,
        holding: nodes,
    }));

    out.sort_by(|a, b| a.id.cmp(&b.id));
    out
}

pub fn compute(state: &State, session: Option<&SessionId>, _now: Timestamp) -> Status {
    let counts = count(state);
    let graph = state.graph.as_ref();

    let holding_by_me: Vec<NodeId> = match session {
        Some(s) => state
            .active_claims
            .iter()
            .filter(|(_, cid)| state.claims.get(*cid).is_some_and(|c| &c.session == s))
            .map(|(n, _)| n.clone())
            .collect(),
        None => vec![],
    };

    let claimable: Vec<NodeId> = state
        .nodes
        .values()
        .filter(|n| n.state.is_claimable() && !state.active_claims.contains_key(&n.id))
        .map(|n| n.id.clone())
        .collect();

    let awaiting: Vec<NodeId> = state
        .nodes
        .values()
        .filter(|n| n.state == NodeState::Awaiting)
        .map(|n| n.id.clone())
        .collect();

    let findings_open = state.findings.values().filter(|f| f.resolution.is_none()).count() as u32;
    let (review_done, review_nodes) = graphene_core::fold::review_progress(state);

    let (next_action, why) = decide(&Facts {
        graph_state: graph.map(|g| g.state),
        check_passed: state.check_passed,
        review_nodes,
        review_done,
        findings_open,
        claimable: &claimable,
        awaiting: &awaiting,
        counts: &counts,
        holding: &holding_by_me,
    });

    Status {
        graph: graph.map(|g| g.id.clone()).unwrap_or_else(|| GraphId::from_seed("unknown")),
        title: graph.map(|g| g.title.clone()).unwrap_or_default(),
        state: graph.map(|g| g.state).unwrap_or(GraphState::Draft),
        nodes: counts,
        beliefs_contested: state.beliefs.values().filter(|b| b.state == TruthState::Both).count()
            as u32,
        sessions: sessions(state),
        budget: BudgetView {
            tokens_used: graph.map(|g| g.spend.tokens).unwrap_or(0),
            tokens_limit: graph.and_then(|g| g.budget.tokens),
            micros_usd_used: graph.map(|g| g.spend.micros_usd).unwrap_or(0),
            micros_usd_limit: graph.and_then(|g| g.budget.micros_usd),
        },
        next_action,
        why,
    }
}

/// Bundled so the decision reads as a table rather than a call with eight
/// positional booleans.
struct Facts<'a> {
    graph_state: Option<GraphState>,
    check_passed: bool,
    review_nodes: u32,
    review_done: u32,
    findings_open: u32,
    claimable: &'a [NodeId],
    awaiting: &'a [NodeId],
    counts: &'a NodeCounts,
    holding: &'a [NodeId],
}

fn decide(f: &Facts<'_>) -> (NextAction, String) {
    let Facts {
        graph_state,
        check_passed,
        review_nodes,
        review_done,
        findings_open,
        claimable,
        awaiting,
        counts,
        holding,
    } = *f;

    let Some(gs) = graph_state else {
        return (
            NextAction::Nothing { reason: "no graph".into() },
            "this store has no graph by that id".into(),
        );
    };

    match gs {
        GraphState::Draft => {
            if check_passed {
                (NextAction::Check, "the plan passes check; record the transition".into())
            } else {
                (NextAction::Check, "a draft must pass `check` before anything else".into())
            }
        }
        GraphState::Checked => {
            if review_nodes == 0 {
                (
                    NextAction::Review,
                    "the plan carries no review nodes; instantiate the review subgraph".into(),
                )
            } else if review_done < review_nodes {
                (
                    NextAction::Review,
                    format!("{review_done}/{review_nodes} review nodes have completed"),
                )
            } else if findings_open > 0 {
                (
                    NextAction::ResolveFindings { open: findings_open },
                    format!("{findings_open} review finding(s) are unresolved"),
                )
            } else {
                (NextAction::PresentToUser, "review is complete; show the plan and wait".into())
            }
        }
        GraphState::Reviewed => (
            NextAction::PresentToUser,
            "show the plan and wait for approval before spending anything".into(),
        ),
        GraphState::Approved => (NextAction::Start, "approved; start the run".into()),
        GraphState::Running => {
            if !claimable.is_empty() {
                (
                    NextAction::Claim { nodes: claimable.to_vec() },
                    format!("{} node(s) ready and you hold {}", claimable.len(), holding.len()),
                )
            } else if counts.is_outstanding() {
                if !awaiting.is_empty() && counts.claimed + counts.running == 0 {
                    (
                        NextAction::ReportAwaiting { nodes: awaiting.to_vec() },
                        "all runnable work is done; only human input remains".into(),
                    )
                } else {
                    (
                        NextAction::Wait { reason: "work is in flight elsewhere".into() },
                        "nothing claimable right now; block on `wait`".into(),
                    )
                }
            } else {
                (NextAction::Finish, "no node is outstanding".into())
            }
        }
        GraphState::Done | GraphState::Failed | GraphState::Cancelled => (
            NextAction::Nothing { reason: format!("the graph is {}", gs.as_str()) },
            "a terminal graph is immutable; clone it to run again".into(),
        ),
    }
}

impl NodeCounts {
    pub fn is_outstanding(&self) -> bool {
        self.pending + self.ready + self.claimed + self.running + self.awaiting + self.blocked > 0
    }
}

fn count(state: &State) -> NodeCounts {
    let mut c = NodeCounts { total: state.nodes.len() as u32, ..Default::default() };
    for n in state.nodes.values() {
        match n.state {
            NodeState::Pending => c.pending += 1,
            NodeState::Ready => c.ready += 1,
            NodeState::Claimed => c.claimed += 1,
            NodeState::Running => c.running += 1,
            NodeState::Awaiting => c.awaiting += 1,
            NodeState::Blocked => c.blocked += 1,
            NodeState::Done => c.done += 1,
            NodeState::Failed => c.failed += 1,
            NodeState::Skipped => c.skipped += 1,
        }
    }
    c
}
