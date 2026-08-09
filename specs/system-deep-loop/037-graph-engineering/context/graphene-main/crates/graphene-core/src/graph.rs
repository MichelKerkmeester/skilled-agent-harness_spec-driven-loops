use serde::{Deserialize, Serialize};

use crate::budget::{Budget, Limits, Spend};
use crate::id::{Actor, GraphId};
use crate::refusal::{Refusal, RefusalCode, Suggestion};
use crate::time::{Seq, Timestamp};

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum GraphState {
    Draft,
    Checked,
    Reviewed,
    Approved,
    Running,
    Done,
    Failed,
    Cancelled,
}

impl GraphState {
    pub fn as_str(&self) -> &'static str {
        match self {
            GraphState::Draft => "draft",
            GraphState::Checked => "checked",
            GraphState::Reviewed => "reviewed",
            GraphState::Approved => "approved",
            GraphState::Running => "running",
            GraphState::Done => "done",
            GraphState::Failed => "failed",
            GraphState::Cancelled => "cancelled",
        }
    }

    pub fn is_terminal(&self) -> bool {
        matches!(self, GraphState::Done | GraphState::Failed | GraphState::Cancelled)
    }

    pub fn is_mutable(&self) -> bool {
        matches!(self, GraphState::Draft | GraphState::Checked | GraphState::Reviewed)
    }
}

/// Everything a transition needs to know, gathered by the fold so the state
/// machine itself stays a pure function.
#[derive(Clone, Copy, Debug, Default)]
pub struct TransitionFacts {
    pub check_passed: bool,
    pub review_nodes: u32,
    pub review_nodes_done: u32,
    pub findings_open: u32,
    pub nodes_ready: u32,
    pub nodes_outstanding: u32,
    pub nodes_failed_terminally: u32,
    pub has_path_to_terminal: bool,
}

pub fn can_transition(
    from: GraphState,
    to: GraphState,
    f: &TransitionFacts,
) -> Result<(), Box<Refusal>> {
    use GraphState::*;

    let refuse = |reason: &str, suggestion| {
        Err(Box::new(Refusal::new(RefusalCode::BadGraphState, suggestion, reason.to_string())))
    };

    match (from, to) {
        (_, Cancelled) => Ok(()),

        (Draft, Checked) | (Checked, Checked) => {
            if f.check_passed {
                Ok(())
            } else {
                refuse("`check` has not passed", Suggestion::FixCheckErrors)
            }
        }

        (Checked, Reviewed) => {
            if f.review_nodes == 0 {
                refuse(
                    "the plan carries no review nodes; instantiate the review subgraph",
                    Suggestion::ResolveFindings,
                )
            } else if f.review_nodes_done < f.review_nodes {
                refuse("review nodes have not all completed", Suggestion::AwaitHuman)
            } else if f.findings_open > 0 {
                refuse("review findings are unresolved", Suggestion::ResolveFindings)
            } else {
                Ok(())
            }
        }

        (Reviewed, Approved) => Ok(()),

        (Approved, Running) => {
            if f.nodes_ready == 0 {
                refuse("no node is ready to run", Suggestion::AdvanceGraphState)
            } else {
                Ok(())
            }
        }

        (Running, Done) => {
            if f.nodes_outstanding > 0 {
                refuse("nodes are still outstanding", Suggestion::AwaitHuman)
            } else {
                Ok(())
            }
        }

        (Running, Failed) => {
            if f.nodes_failed_terminally > 0 && !f.has_path_to_terminal {
                Ok(())
            } else {
                refuse("the graph still has a path to completion", Suggestion::AdvanceGraphState)
            }
        }

        (a, b) if a == b => Err(Box::new(Refusal::new(
            RefusalCode::AlreadyApplied,
            Suggestion::AlreadyApplied,
            format!("the graph is already `{}`", a.as_str()),
        ))),

        (a, b) => refuse(
            &format!("`{}` cannot become `{}`", a.as_str(), b.as_str()),
            Suggestion::AdvanceGraphState,
        ),
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Graph {
    pub id: GraphId,
    pub title: String,
    #[serde(default)]
    pub description: String,
    /// The originating request, verbatim.
    pub task: String,
    pub state: GraphState,
    /// Set by clone or amendment.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub parent: Option<GraphId>,
    #[serde(default)]
    pub budget: Budget,
    #[serde(default)]
    pub spend: Spend,
    #[serde(default)]
    pub limits: Limits,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub tags: Vec<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub completed_at: Option<Timestamp>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub requested_by: Option<Actor>,
    pub created_seq: Seq,
}

impl Graph {
    /// A `done` graph is immutable; `clone` makes a new one.
    pub fn accepts_edits(&self) -> bool {
        self.state.is_mutable()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn facts() -> TransitionFacts {
        TransitionFacts { check_passed: true, ..Default::default() }
    }

    #[test]
    fn check_gates_draft_to_checked() {
        let mut f = facts();
        f.check_passed = false;
        let r = can_transition(GraphState::Draft, GraphState::Checked, &f).unwrap_err();
        assert_eq!(r.suggestion, Suggestion::FixCheckErrors);

        f.check_passed = true;
        assert!(can_transition(GraphState::Draft, GraphState::Checked, &f).is_ok());
    }

    #[test]
    fn reviewed_requires_review_nodes_done_and_findings_resolved() {
        let mut f = facts();
        assert!(can_transition(GraphState::Checked, GraphState::Reviewed, &f).is_err());

        f.review_nodes = 6;
        f.review_nodes_done = 5;
        assert!(can_transition(GraphState::Checked, GraphState::Reviewed, &f).is_err());

        f.review_nodes_done = 6;
        f.findings_open = 2;
        let r = can_transition(GraphState::Checked, GraphState::Reviewed, &f).unwrap_err();
        assert_eq!(r.suggestion, Suggestion::ResolveFindings);

        f.findings_open = 0;
        assert!(can_transition(GraphState::Checked, GraphState::Reviewed, &f).is_ok());
    }

    #[test]
    fn done_requires_nothing_outstanding() {
        let mut f = facts();
        f.nodes_outstanding = 1;
        assert!(can_transition(GraphState::Running, GraphState::Done, &f).is_err());
        f.nodes_outstanding = 0;
        assert!(can_transition(GraphState::Running, GraphState::Done, &f).is_ok());
    }

    #[test]
    fn failed_requires_no_remaining_path() {
        let mut f = facts();
        f.nodes_failed_terminally = 1;
        f.has_path_to_terminal = true;
        assert!(can_transition(GraphState::Running, GraphState::Failed, &f).is_err());
        f.has_path_to_terminal = false;
        assert!(can_transition(GraphState::Running, GraphState::Failed, &f).is_ok());
    }

    #[test]
    fn cancellation_is_always_permitted() {
        for s in [
            GraphState::Draft,
            GraphState::Checked,
            GraphState::Reviewed,
            GraphState::Approved,
            GraphState::Running,
        ] {
            assert!(can_transition(s, GraphState::Cancelled, &facts()).is_ok());
        }
    }

    #[test]
    fn skipping_states_is_refused() {
        assert!(can_transition(GraphState::Draft, GraphState::Running, &facts()).is_err());
        assert!(can_transition(GraphState::Checked, GraphState::Approved, &facts()).is_err());
    }

    #[test]
    fn terminal_graphs_reject_edits() {
        for s in [GraphState::Done, GraphState::Failed, GraphState::Cancelled] {
            assert!(!s.is_mutable());
        }
    }
}
