//! `task.v1` — the authoring format.
//!
//! Nodes are named locally (`"id": "fetch"`) and Graphene derives the
//! content-anchored `NodeId`. An agent authoring a plan must never have to
//! compute a hash, and local names are what make a plan readable, diffable, and
//! writable by a person in the panel.

use std::collections::BTreeMap;

use graphene_core::budget::{Budget, Spend};
use graphene_core::id::{GraphId, NodeId};
use graphene_core::node::{
    Binding, ForEach, HumanAsk, Node, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy,
};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct TaskDoc {
    #[serde(default = "default_kind")]
    pub graph: String,
    #[serde(default)]
    pub goal: Option<String>,
    pub nodes: Vec<NodeDoc>,
}

fn default_kind() -> String {
    "task.v1".into()
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NodeDoc {
    /// Local name, unique within the plan. The `NodeId` is derived from it.
    pub id: String,
    /// The capability this node exercises.
    pub job: String,
    #[serde(default)]
    pub needs: Vec<String>,
    #[serde(default)]
    pub bindings: Vec<BindingDoc>,
    #[serde(default)]
    pub inputs: Option<Value>,
    #[serde(default)]
    pub outputs: Option<Value>,
    #[serde(default)]
    pub prompt: Option<String>,
    #[serde(default)]
    pub run: Option<String>,
    #[serde(default)]
    pub ask: Option<AskDoc>,
    #[serde(default)]
    pub lens: Option<String>,
    #[serde(default)]
    pub for_each: Option<ForEachDoc>,
    #[serde(default)]
    pub retry: Option<RetryDoc>,
    #[serde(default)]
    pub idempotency: Option<String>,
    #[serde(default)]
    pub writes: Vec<String>,
    #[serde(default)]
    pub tokens: Option<u64>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BindingDoc {
    pub from: String,
    pub select: String,
    pub into: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct ForEachDoc {
    pub from: String,
    pub select: String,
    pub as_field: String,
    pub max: u32,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AskDoc {
    pub question: String,
    pub options: Vec<String>,
    /// Which dependents each answer releases, by local name. An option mapped
    /// to an empty list releases nothing — that is how `no` is expressed.
    #[serde(default)]
    pub unblocks: BTreeMap<String, Vec<String>>,
    /// `wait` | `expire:<ms>` | `escalate:<ms>`. **Required** — silence must
    /// never be indistinguishable from approval.
    pub on_timeout: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum RetryDoc {
    None,
    Bounded { attempts: u32 },
    Escalate,
}

#[derive(Debug, thiserror::Error)]
pub enum PlanError {
    #[error("`{0}` is not a task.v1 document")]
    WrongKind(String),
    #[error("node `{node}` needs `{missing}`, which is not in this plan")]
    UnknownName { node: String, missing: String },
    #[error("two nodes are named `{0}`")]
    DuplicateName(String),
    #[error("node `{node}`: {message}")]
    Malformed { node: String, message: String },
}

/// Resolve local names to content-anchored ids and build real nodes.
pub fn compile(doc: &TaskDoc, graph: &GraphId) -> Result<Vec<Node>, PlanError> {
    if doc.graph != "task.v1" {
        return Err(PlanError::WrongKind(doc.graph.clone()));
    }

    let mut ids: BTreeMap<&str, NodeId> = BTreeMap::new();
    for n in &doc.nodes {
        if ids.insert(n.id.as_str(), NodeId::for_name(graph, &n.id)).is_some() {
            return Err(PlanError::DuplicateName(n.id.clone()));
        }
    }

    let resolve = |owner: &str, name: &str| -> Result<NodeId, PlanError> {
        ids.get(name).cloned().ok_or_else(|| PlanError::UnknownName {
            node: owner.to_string(),
            missing: name.to_string(),
        })
    };

    let mut out = Vec::with_capacity(doc.nodes.len());
    for n in &doc.nodes {
        let spec = build_spec(n, &ids)?;
        let mut bindings = Vec::new();
        for b in &n.bindings {
            bindings.push(Binding {
                from: resolve(&n.id, &b.from)?,
                select: b.select.clone(),
                into: b.into.clone(),
            });
        }

        let for_each = match &n.for_each {
            Some(fe) => Some(ForEach {
                over: Binding {
                    from: resolve(&n.id, &fe.from)?,
                    select: fe.select.clone(),
                    into: fe.as_field.clone(),
                },
                max: fe.max,
                as_field: fe.as_field.clone(),
            }),
            None => None,
        };

        let mut needs = Vec::new();
        for name in &n.needs {
            needs.push(resolve(&n.id, name)?);
        }

        out.push(Node {
            id: ids[n.id.as_str()].clone(),
            graph: graph.clone(),
            name: n.id.clone(),
            capability: n.job.clone(),
            inputs: n.inputs.clone().unwrap_or_else(|| json!({"type":"object"})),
            outputs: n.outputs.clone().unwrap_or_else(|| json!({"type":"object"})),
            bindings,
            needs,
            for_each,
            budget: n.tokens.map(Budget::tokens).unwrap_or_default(),
            retry: match &n.retry {
                Some(RetryDoc::Bounded { attempts }) => {
                    RetryPolicy::Bounded { attempts: *attempts }
                }
                Some(RetryDoc::Escalate) => RetryPolicy::Escalate,
                _ => RetryPolicy::None,
            },
            idempotency: n.idempotency.clone(),
            writes: n.writes.clone(),
            state: if n.needs.is_empty() { NodeState::Ready } else { NodeState::Pending },
            claim: None,
            output: None,
            checkpoints: vec![],
            attempts: 0,
            spend: Spend::default(),
            parent: None,
            failure: None,
            spec,
        });
    }
    Ok(out)
}

fn build_spec(n: &NodeDoc, ids: &BTreeMap<&str, NodeId>) -> Result<NodeSpec, PlanError> {
    let malformed = |m: &str| PlanError::Malformed { node: n.id.clone(), message: m.into() };

    Ok(match n.job.as_str() {
        "human" => {
            let ask = n.ask.as_ref().ok_or_else(|| malformed("a human node needs an `ask`"))?;
            let mut consequence = Vec::new();
            for (option, targets) in &ask.unblocks {
                if !ask.options.contains(option) {
                    return Err(malformed(&format!(
                        "`unblocks` names `{option}`, which is not one of the declared options"
                    )));
                }
                let targets = targets
                    .iter()
                    .map(|name| {
                        ids.get(name.as_str()).cloned().ok_or_else(|| PlanError::UnknownName {
                            node: n.id.clone(),
                            missing: name.clone(),
                        })
                    })
                    .collect::<Result<Vec<_>, _>>()?;
                consequence.push((option.clone(), targets));
            }
            NodeSpec::Human(HumanAsk {
                ask: ask.question.clone(),
                options: ask.options.clone(),
                context: vec![],
                consequence,
                on_timeout: parse_timeout(&ask.on_timeout).ok_or_else(|| {
                    malformed("`on_timeout` must be wait | expire:<ms> | escalate:<ms>")
                })?,
            })
        }
        "review" => NodeSpec::Review {
            lens: n.lens.clone().unwrap_or_else(|| "granularity".into()),
            prompt: n.prompt.clone().unwrap_or_default(),
        },
        "merge" => NodeSpec::Merge { prompt: n.prompt.clone().unwrap_or_default() },
        "function" => NodeSpec::Function {
            run: n.run.clone().ok_or_else(|| malformed("a function node needs `run`"))?,
        },
        "retrieval" => NodeSpec::Retrieval {
            source: n.run.clone().unwrap_or_default(),
            query: n.prompt.clone(),
        },
        _ => NodeSpec::Agent { prompt: n.prompt.clone().unwrap_or_default(), system: None },
    })
}

fn parse_timeout(s: &str) -> Option<TimeoutPolicy> {
    if s == "wait" {
        return Some(TimeoutPolicy::Wait);
    }
    let (kind, ms) = s.split_once(':')?;
    let after_ms = ms.parse().ok()?;
    match kind {
        "expire" => Some(TimeoutPolicy::Expire { after_ms }),
        "escalate" => Some(TimeoutPolicy::Escalate { after_ms }),
        _ => None,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn doc(json: Value) -> TaskDoc {
        serde_json::from_value(json).unwrap()
    }

    #[test]
    fn local_names_resolve_to_content_anchored_ids() {
        let graph = GraphId::from_seed("g");
        let d = doc(json!({
            "graph": "task.v1",
            "nodes": [
                { "id": "fetch", "job": "agent",
                  "outputs": {"type":"object","properties":{"rows":{"type":"array"}},"required":["rows"]} },
                { "id": "score", "job": "agent", "needs": ["fetch"],
                  "inputs": {"type":"object","properties":{"rows":{"type":"array"}},"required":["rows"]},
                  "bindings": [{ "from": "fetch", "select": "$.rows", "into": "rows" }] }
            ]
        }));

        let nodes = compile(&d, &graph).unwrap();
        assert_eq!(nodes[1].name, "score");
        assert_eq!(nodes[1].needs, vec![NodeId::for_name(&graph, "fetch")]);
        assert_eq!(nodes[1].bindings[0].from, NodeId::for_name(&graph, "fetch"));
        assert!(nodes[0].fake_edges().is_empty());
        assert!(nodes[1].fake_edges().is_empty());
    }

    #[test]
    fn a_reference_to_an_absent_node_names_both_sides() {
        let d = doc(json!({
            "graph": "task.v1",
            "nodes": [{ "id": "score", "job": "agent", "needs": ["ghost"] }]
        }));
        match compile(&d, &GraphId::from_seed("g")).unwrap_err() {
            PlanError::UnknownName { node, missing } => {
                assert_eq!(node, "score");
                assert_eq!(missing, "ghost");
            }
            other => panic!("{other:?}"),
        }
    }

    #[test]
    fn duplicate_names_are_refused() {
        let d = doc(json!({
            "graph": "task.v1",
            "nodes": [{ "id": "a", "job": "agent" }, { "id": "a", "job": "agent" }]
        }));
        assert!(matches!(
            compile(&d, &GraphId::from_seed("g")).unwrap_err(),
            PlanError::DuplicateName(_)
        ));
    }

    #[test]
    fn a_human_node_without_a_timeout_policy_is_refused() {
        let d = doc(json!({
            "graph": "task.v1",
            "nodes": [{ "id": "approve", "job": "human",
                        "ask": { "question": "ok?", "options": ["approve"], "on_timeout": "nonsense" } }]
        }));
        assert!(matches!(
            compile(&d, &GraphId::from_seed("g")).unwrap_err(),
            PlanError::Malformed { .. }
        ));
    }

    #[test]
    fn roots_start_ready_and_dependents_start_pending() {
        let d = doc(json!({
            "graph": "task.v1",
            "nodes": [
                { "id": "a", "job": "agent" },
                { "id": "b", "job": "agent", "needs": ["a"],
                  "bindings": [{ "from": "a", "select": "$", "into": "in" }],
                  "inputs": {"type":"object","properties":{"in":{}}} }
            ]
        }));
        let nodes = compile(&d, &GraphId::from_seed("g")).unwrap();
        assert_eq!(nodes[0].state, NodeState::Ready);
        assert_eq!(nodes[1].state, NodeState::Pending);
    }

    #[test]
    fn a_wrong_document_kind_is_refused() {
        let d = doc(json!({ "graph": "workflow.v9", "nodes": [] }));
        assert!(matches!(
            compile(&d, &GraphId::from_seed("g")).unwrap_err(),
            PlanError::WrongKind(_)
        ));
    }
}
