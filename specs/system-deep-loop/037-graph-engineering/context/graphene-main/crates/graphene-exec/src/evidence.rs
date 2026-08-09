//! Spec 09 §7: what the accumulated graphs say about the guidance.
//!
//! The skill's hard half is judgment — decomposition, granularity, gate
//! placement — and judgment cannot be checked. But it leaves a trace: nodes that
//! fail, gates nobody ever declines, plans that get amended. This reads that
//! trace so §4 stops being guesswork.
//!
//! Every signal here is a count over completed work, not a score. It says where
//! to look; it does not say what to conclude.

use std::collections::BTreeMap;

use graphene_core::event::Event;
use graphene_core::graph::GraphState;
use graphene_core::node::{NodeKind, NodeState};
use graphene_store::Store;
use serde::{Deserialize, Serialize};

use crate::Result;

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct Evidence {
    pub graphs: u32,
    pub graphs_completed: u32,
    pub graphs_cancelled: u32,
    pub graphs_amended: u32,
    /// Capabilities ranked by how often their nodes failed. A decomposition
    /// pattern that does not survive contact shows up here first.
    pub failures_by_capability: Vec<Count>,
    /// A gate nobody has ever declined is a gate that is not deciding anything.
    pub gates: Vec<Gate>,
    /// What `check` caught, per plan. Falling counts mean the prose is landing.
    pub check_findings: Vec<Count>,
    pub findings_per_plan: f64,
    /// Review findings that were rejected rather than applied, by lens. A lens
    /// nobody agrees with is a lens to cut.
    pub lens_rejection_rate: Vec<Rate>,
    /// Graphs left running with nothing outstanding and nothing finished.
    pub abandoned: u32,
    pub notes: Vec<String>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct Count {
    pub name: String,
    pub count: u32,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Rate {
    pub name: String,
    pub of: u32,
    pub rate: f64,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
pub struct Gate {
    pub ask: String,
    pub asked: u32,
    pub proceeded: u32,
    /// `None` until it has been answered at least twice — one answer is not a
    /// pattern, and reporting it as one invites acting on noise.
    pub always_proceeds: Option<bool>,
}

pub fn gather(store: &Store) -> Result<Evidence> {
    let mut e = Evidence::default();
    let mut failures: BTreeMap<String, u32> = BTreeMap::new();
    let mut findings: BTreeMap<String, u32> = BTreeMap::new();
    let mut gates: BTreeMap<String, (u32, u32)> = BTreeMap::new();
    let mut lens: BTreeMap<String, (u32, u32)> = BTreeMap::new();
    let mut checked_plans = 0u32;
    let mut total_findings = 0u32;

    for graph in store.graph_ids()? {
        e.graphs += 1;
        let state = store.state(&graph)?;
        let records = store.records(&graph)?;

        match state.graph.as_ref().map(|g| g.state) {
            Some(GraphState::Done) => e.graphs_completed += 1,
            Some(GraphState::Cancelled) => e.graphs_cancelled += 1,
            _ => {}
        }
        if state.graph.as_ref().is_some_and(|g| g.parent.is_some()) {
            e.graphs_amended += 1;
        }

        for n in state.nodes.values() {
            if n.state == NodeState::Failed || n.attempts > 1 {
                *failures.entry(n.capability.clone()).or_default() += 1;
            }
        }

        // A human node's answer is only informative once it has been given.
        for n in state.nodes.values().filter(|n| n.kind() == NodeKind::Human) {
            let Some(output) = &n.output else { continue };
            let Some(choice) = output.get("choice").and_then(|c| c.as_str()) else { continue };
            let ask = match &n.spec {
                graphene_core::node::NodeSpec::Human(h) => h.ask.clone(),
                _ => n.name.clone(),
            };
            let entry = gates.entry(ask).or_insert((0, 0));
            entry.0 += 1;
            if proceeds(n, choice) {
                entry.1 += 1;
            }
        }

        for f in state.findings.values() {
            let name = state
                .nodes
                .get(&f.review_node)
                .map(|n| n.name.clone())
                .unwrap_or_else(|| f.review_node.to_string());
            let entry = lens.entry(name).or_insert((0, 0));
            entry.0 += 1;
            if matches!(f.resolution, Some(graphene_core::event::FindingResolution::Rejected)) {
                entry.1 += 1;
            }
        }

        let mut saw_check = false;
        for r in &records {
            if let Event::CheckResult { errors, warnings, codes, .. } = &r.event {
                saw_check = true;
                total_findings += errors + warnings;
                for (code, n) in codes {
                    *findings.entry(code.clone()).or_default() += n;
                }
            }
        }
        if saw_check {
            checked_plans += 1;
        }

        let outstanding = state.nodes.values().filter(|n| n.state.is_outstanding()).count();
        let done = state.nodes.values().filter(|n| n.state == NodeState::Done).count();
        let running = state.graph.as_ref().is_some_and(|g| g.state == GraphState::Running);
        if running && outstanding == 0 && done < state.nodes.len() {
            e.abandoned += 1;
        }
    }

    e.check_findings = sorted(findings);
    e.findings_per_plan =
        if checked_plans == 0 { 0.0 } else { total_findings as f64 / checked_plans as f64 };

    e.failures_by_capability = sorted(failures);
    e.gates = gates
        .into_iter()
        .map(|(ask, (asked, proceeded))| Gate {
            ask,
            asked,
            proceeded,
            always_proceeds: (asked >= 2).then_some(asked == proceeded),
        })
        .collect();
    e.gates.sort_by_key(|g| std::cmp::Reverse(g.asked));

    e.lens_rejection_rate = lens
        .into_iter()
        .filter(|(_, (of, _))| *of > 0)
        .map(|(name, (of, rejected))| Rate { name, of, rate: rejected as f64 / of as f64 })
        .collect();
    e.lens_rejection_rate.sort_by(|a, b| b.rate.total_cmp(&a.rate));

    e.notes = notes(&e);
    Ok(e)
}

/// Which answers let the work continue. Declared consequences say it exactly;
/// without them every answer proceeds, which is the thing `ungated-choice`
/// exists to prevent.
fn proceeds(node: &graphene_core::node::Node, choice: &str) -> bool {
    match &node.spec {
        graphene_core::node::NodeSpec::Human(h) if !h.consequence.is_empty() => h
            .consequence
            .iter()
            .find(|(opt, _)| opt == choice)
            .is_some_and(|(_, nodes)| !nodes.is_empty()),
        _ => true,
    }
}

fn sorted(m: BTreeMap<String, u32>) -> Vec<Count> {
    let mut v: Vec<Count> = m.into_iter().map(|(name, count)| Count { name, count }).collect();
    v.sort_by(|a, b| b.count.cmp(&a.count).then(a.name.cmp(&b.name)));
    v
}

/// The reading, stated plainly. A table of numbers nobody interprets changes
/// nothing, and the interpretation is the same every time — so it belongs here
/// rather than in whoever happens to be looking.
fn notes(e: &Evidence) -> Vec<String> {
    let mut out = Vec::new();

    if e.graphs < 5 {
        out.push(format!(
            "{} graph(s) is not yet evidence. These signals mean something once a few dozen have run.",
            e.graphs
        ));
    }

    for g in e.gates.iter().filter(|g| g.always_proceeds == Some(true) && g.asked >= 3) {
        out.push(format!(
            "`{}` has been approved {}/{} times. A gate nobody declines is not deciding anything — move it to where a mistake is expensive, or drop it.",
            g.ask, g.proceeded, g.asked
        ));
    }

    if let Some(worst) = e.failures_by_capability.first() {
        if worst.count >= 3 {
            out.push(format!(
                "`{}` accounts for the most failures ({}). Either the capability is unreliable or the nodes asking for it are doing too much.",
                worst.name, worst.count
            ));
        }
    }

    if e.graphs_amended * 3 >= e.graphs && e.graphs >= 6 {
        out.push(format!(
            "{}/{} graphs were amended. A shape that keeps needing rework is a shape the decomposition guidance handles badly.",
            e.graphs_amended, e.graphs
        ));
    }

    for l in e.lens_rejection_rate.iter().filter(|l| l.of >= 4 && l.rate >= 0.75) {
        out.push(format!(
            "`{}` findings are rejected {:.0}% of the time. A lens nobody agrees with costs a node and teaches nothing.",
            l.name,
            l.rate * 100.0
        ));
    }

    if e.abandoned >= 2 {
        out.push(format!(
            "{} graph(s) are running with nothing left to do and nothing finished. Look at what shape they share.",
            e.abandoned
        ));
    }

    if out.is_empty() {
        out.push("Nothing stands out. The guidance is not visibly wrong yet.".into());
    }
    out
}
