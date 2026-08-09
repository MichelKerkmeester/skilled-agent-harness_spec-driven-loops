//! The integrity gates, spec 10 §3.
//!
//! `check` asks whether a *plan* is well formed. These ask whether the *log and
//! the state derived from it* are. They are what `gr validate` runs, and they
//! fail closed.
//!
//! Every gate is a pure function of `(records, state)`, which is what makes an
//! adversarial case expressible: hand a crafted event stream to the same
//! function the store uses and assert it is caught.

use std::collections::{BTreeMap, BTreeSet};

use graphene_core::belief::{Sensitivity, TruthState};
use graphene_core::event::{Event, Record};
use graphene_core::fold::State;
use graphene_core::id::{BeliefId, NodeId};
use graphene_core::BeliefEdge;
use serde::{Deserialize, Serialize};

use crate::{check, Capabilities, Report};

#[derive(Clone, Copy, Debug, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Gate {
    G1Grounding,
    G2Edges,
    G3States,
    G4Identity,
    G5Permissions,
    G6Fidelity,
    G7Sensitivity,
    G8Nogoods,
    G9Temporal,
    G10Determinism,
    G11Graph,
}

impl Gate {
    pub fn as_str(&self) -> &'static str {
        use Gate::*;
        match self {
            G1Grounding => "G1-grounding",
            G2Edges => "G2-edges",
            G3States => "G3-states",
            G4Identity => "G4-identity",
            G5Permissions => "G5-permissions",
            G6Fidelity => "G6-fidelity",
            G7Sensitivity => "G7-sensitivity",
            G8Nogoods => "G8-nogoods",
            G9Temporal => "G9-temporal",
            G10Determinism => "G10-determinism",
            G11Graph => "G11-graph",
        }
    }

    pub const ALL: [Gate; 11] = [
        Gate::G1Grounding,
        Gate::G2Edges,
        Gate::G3States,
        Gate::G4Identity,
        Gate::G5Permissions,
        Gate::G6Fidelity,
        Gate::G7Sensitivity,
        Gate::G8Nogoods,
        Gate::G9Temporal,
        Gate::G10Determinism,
        Gate::G11Graph,
    ];
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct GateFailure {
    pub gate: Gate,
    pub detail: String,
    pub fix_hint: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub at: Option<u64>,
}

#[derive(Clone, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct GateReport {
    pub ok: bool,
    pub gates_run: Vec<Gate>,
    pub failures: Vec<GateFailure>,
    /// G11's own findings, kept whole so a caller sees the same shape `check`
    /// returns rather than a summary of it.
    pub plan: Report,
}

struct Failures(Vec<GateFailure>);

impl Failures {
    fn fail(&mut self, gate: Gate, detail: impl Into<String>, fix_hint: impl Into<String>) {
        self.0.push(GateFailure {
            gate,
            detail: detail.into(),
            fix_hint: fix_hint.into(),
            at: None,
        });
    }

    fn fail_at(
        &mut self,
        gate: Gate,
        seq: u64,
        detail: impl Into<String>,
        fix_hint: impl Into<String>,
    ) {
        self.0.push(GateFailure {
            gate,
            detail: detail.into(),
            fix_hint: fix_hint.into(),
            at: Some(seq),
        });
    }
}

pub fn validate(records: &[Record], state: &State, caps: &Capabilities) -> GateReport {
    let mut f = Failures(Vec::new());

    g1_grounding(state, &mut f);
    g2_edges(state, &mut f);
    g3_states(records, state, &mut f);
    g4_identity(state, &mut f);
    g5_permissions(records, state, &mut f);
    g6_fidelity(records, state, &mut f);
    g7_sensitivity(state, &mut f);
    g8_nogoods(state, &mut f);
    g9_temporal(state, &mut f);
    g10_determinism(records, &mut f);

    let plan = check(state, caps);
    if !plan.ok {
        for e in &plan.errors {
            f.fail(
                Gate::G11Graph,
                format!("{}: {}", e.code.as_str(), e.detail),
                e.fix_hint.clone(),
            );
        }
    }

    GateReport { ok: f.0.is_empty(), gates_run: Gate::ALL.to_vec(), failures: f.0, plan }
}

/// Every belief names a source. A receipt with nothing behind it is a belief
/// nobody can go and re-observe, which is the one move I6 depends on.
fn g1_grounding(state: &State, f: &mut Failures) {
    for b in state.beliefs.values() {
        if b.source.system.trim().is_empty() {
            f.fail(
                Gate::G1Grounding,
                format!("`{}` names no source system", b.id),
                "every belief carries where it came from; there is no anonymous evidence",
            );
        }
        if b.source.path.as_deref().is_some_and(|p| p.trim().is_empty()) {
            f.fail(
                Gate::G1Grounding,
                format!("`{}` has an empty source path", b.id),
                "omit the path or give it one; blank is neither",
            );
        }
    }
}

/// Support edges point at beliefs that exist, and `derives-from` is acyclic —
/// a cycle makes the truth-state fold non-terminating in principle and
/// meaningless in practice.
fn g2_edges(state: &State, f: &mut Failures) {
    for (from, edge, to) in &state.belief_edges {
        for (end, which) in [(from, "source"), (to, "target")] {
            if !state.beliefs.contains_key(end) {
                f.fail(
                    Gate::G2Edges,
                    format!("{edge:?} edge has a {which} `{end}` that is not a belief"),
                    "an edge to nothing cannot be folded; drop it or add the belief",
                );
            }
        }
    }

    let mut support: BTreeMap<&BeliefId, Vec<&BeliefId>> = BTreeMap::new();
    for (from, edge, to) in &state.belief_edges {
        if *edge == BeliefEdge::DerivesFrom {
            support.entry(from).or_default().push(to);
        }
    }

    let mut seen = BTreeSet::new();
    let mut stack = BTreeSet::new();
    for id in state.beliefs.keys() {
        if let Some(cycle) = find_cycle(id, &support, &mut seen, &mut stack) {
            f.fail(
                Gate::G2Edges,
                format!("`derives-from` cycle through `{cycle}`"),
                "support is a DAG; a belief cannot rest on itself, however indirectly",
            );
        }
    }
}

fn find_cycle<'a>(
    id: &'a BeliefId,
    support: &BTreeMap<&'a BeliefId, Vec<&'a BeliefId>>,
    seen: &mut BTreeSet<&'a BeliefId>,
    stack: &mut BTreeSet<&'a BeliefId>,
) -> Option<BeliefId> {
    if stack.contains(id) {
        return Some(id.clone());
    }
    if !seen.insert(id) {
        return None;
    }
    stack.insert(id);
    if let Some(deps) = support.get(id) {
        for d in deps {
            if let Some(c) = find_cycle(d, support, seen, stack) {
                stack.remove(id);
                return Some(c);
            }
        }
    }
    stack.remove(id);
    None
}

/// The strongest gate: re-derive the fold from the log and compare. A state
/// that cannot be reproduced from its events is a state nobody can audit.
fn g3_states(records: &[Record], state: &State, f: &mut Failures) {
    match graphene_core::fold::fold(records) {
        Ok(rederived) => {
            if rederived.beliefs.len() != state.beliefs.len() {
                f.fail(
                    Gate::G3States,
                    format!(
                        "re-deriving the log yields {} belief(s), the store holds {}",
                        rederived.beliefs.len(),
                        state.beliefs.len()
                    ),
                    "the fold is the only writer of derived state; `gr rebuild` re-derives it",
                );
            }
            for (id, b) in &state.beliefs {
                match rederived.beliefs.get(id) {
                    None => f.fail(
                        Gate::G3States,
                        format!("`{id}` is in the store but not derivable from the log"),
                        "every belief is a consequence of events; there is no other way in",
                    ),
                    Some(r) if r.state != b.state => f.fail(
                        Gate::G3States,
                        format!(
                            "`{id}` is `{}` in the store, `{}` when re-derived",
                            b.state.as_str(),
                            r.state.as_str()
                        ),
                        "a truth state is computed, never written; `gr rebuild`",
                    ),
                    Some(_) => {}
                }
            }
            for (id, n) in &state.nodes {
                if rederived.nodes.get(id).is_some_and(|r| r.state != n.state) {
                    f.fail(
                        Gate::G3States,
                        format!("node `{}` does not re-derive to its stored state", n.name),
                        "`gr rebuild` discards the cache and folds again",
                    );
                }
            }
        }
        Err(e) => f.fail(
            Gate::G3States,
            format!("the log does not fold: {e}"),
            "an unfoldable log is unrecoverable state; find the event at that seq",
        ),
    }
}

/// Ids are content-anchored, so a belief's id must be re-derivable from what it
/// says. Two distinct contents sharing an id would silently merge them.
fn g4_identity(state: &State, f: &mut Failures) {
    let mut by_content: BTreeMap<(&str, &str, String), &BeliefId> = BTreeMap::new();
    for b in state.beliefs.values() {
        let expected =
            BeliefId::for_content(&b.graph, &b.content, b.provenance.as_str(), &b.source.key());
        if expected != b.id {
            f.fail(
                Gate::G4Identity,
                format!("`{}` is not the content-anchored id of what it holds", b.id),
                "ids are derived, never assigned; re-record the belief rather than renaming it",
            );
        }
        let key = (b.content.as_str(), b.provenance.as_str(), b.source.key());
        if let Some(prior) = by_content.insert(key, &b.id) {
            if prior != &b.id {
                f.fail(
                    Gate::G4Identity,
                    format!("`{prior}` and `{}` are the same content under two ids", b.id),
                    "identical content from one source is one belief",
                );
            }
        }
    }

    for n in state.nodes.values() {
        let expected = match &n.parent {
            Some(p) => {
                let idx =
                    n.name.rsplit_once('[').and_then(|(_, i)| i.trim_end_matches(']').parse().ok());
                idx.map(|i: u32| NodeId::for_expansion(p, i))
            }
            None => Some(NodeId::for_name(&n.graph, &n.name)),
        };
        if expected.is_some_and(|e| e != n.id) {
            f.fail(
                Gate::G4Identity,
                format!("node `{}` does not carry its content-anchored id", n.name),
                "a node id is derived from the graph and its local name",
            );
        }
    }
}

/// The retraction matrix, enforced over the event stream rather than at the
/// call site — a crafted log must not get past what a caller cannot.
fn g5_permissions(records: &[Record], state: &State, f: &mut Failures) {
    for r in records {
        if let Event::Retract { id, .. } = &r.event {
            if let Some(b) = state.beliefs.get(id) {
                if !b.provenance.caller_may_retract() {
                    f.fail_at(
                        Gate::G5Permissions,
                        r.seq.0,
                        format!(
                            "`RETRACT` on `{id}`, whose provenance is `{}`",
                            b.provenance.as_str()
                        ),
                        "I6 — contradict an observation, or observe again; do not delete it",
                    );
                }
            }
        }
    }
}

/// Fidelity rises only on evidence from a source not already counted. Same
/// source twice is one witness.
fn g6_fidelity(records: &[Record], state: &State, f: &mut Failures) {
    for r in records {
        if let Event::Corroborate { id, by } = &r.event {
            let (Some(target), Some(witness)) = (state.beliefs.get(id), state.beliefs.get(by))
            else {
                continue;
            };
            if witness.source.key() == target.source.key() {
                f.fail_at(
                    Gate::G6Fidelity,
                    r.seq.0,
                    format!("`{id}` corroborated from its own source `{}`", target.source.key()),
                    "I8 — corroboration needs a distinct source, or it is the same witness twice",
                );
            }
        }
    }

    for b in state.beliefs.values() {
        let mut seen = BTreeSet::new();
        for s in &b.corroborated_by {
            if !seen.insert(s.key()) {
                f.fail(
                    Gate::G6Fidelity,
                    format!("`{}` counts `{}` as corroboration twice", b.id, s.key()),
                    "each source is one witness however often it is read",
                );
            }
        }
    }
}

/// **Never relax this one.** Sensitivity is a lattice join over support, so a
/// derived belief below its support is a laundering path: infer an unrestricted
/// conclusion from restricted evidence and the label is gone.
fn g7_sensitivity(state: &State, f: &mut Failures) {
    let mut support: BTreeMap<&BeliefId, Vec<&BeliefId>> = BTreeMap::new();
    for (from, edge, to) in &state.belief_edges {
        if *edge == BeliefEdge::DerivesFrom {
            support.entry(from).or_default().push(to);
        }
    }

    for (id, deps) in &support {
        let Some(b) = state.beliefs.get(*id) else { continue };
        let labels: Vec<&Sensitivity> =
            deps.iter().filter_map(|d| state.beliefs.get(*d)).map(|d| &d.sensitivity).collect();
        if labels.is_empty() {
            continue;
        }
        let required = Sensitivity::join_all(labels);
        let missing: Vec<&String> =
            required.0.iter().filter(|l| !b.sensitivity.0.contains(l)).collect();
        if !missing.is_empty() {
            f.fail(
                Gate::G7Sensitivity,
                format!(
                    "`{id}` is derived from support labelled {:?} but does not carry {missing:?}",
                    required.0
                ),
                "I7 — sensitivity is the join over support; a conclusion is at least as restricted as what it rests on",
            );
        }
    }
}

/// A recorded impossibility must stay impossible: no set that is entirely `IN`.
fn g8_nogoods(state: &State, f: &mut Failures) {
    for ng in state.nogoods.values() {
        if ng.members.len() < 2 {
            f.fail(
                Gate::G8Nogoods,
                format!("nogood `{}` has {} member(s)", ng.id, ng.members.len()),
                "one belief cannot be jointly inconsistent",
            );
            continue;
        }
        let all_in = ng
            .members
            .iter()
            .all(|m| state.beliefs.get(m).is_some_and(|b| b.state == TruthState::In));
        if all_in {
            f.fail(
                Gate::G8Nogoods,
                format!("every member of nogood `{}` is believed", ng.id),
                "drop a member, or record why the set holds after all",
            );
        }
    }
}

/// Every belief is placed in time. Out-of-order arrival is resolved by
/// `observed_at`, which only works if it is always there.
fn g9_temporal(state: &State, f: &mut Failures) {
    for b in state.beliefs.values() {
        // Zero is "never set". Imputed is fine — it is the explicit admission
        // that the source has no notion of observation time.
        if b.observed_at.at.0 == 0 && !b.observed_at.imputed {
            f.fail(
                Gate::G9Temporal,
                format!("`{}` has no `observed_at` and none imputed", b.id),
                "say when it was true, or mark it imputed and take arrival order",
            );
        }
        if b.recorded_at.0 == 0 {
            f.fail(
                Gate::G9Temporal,
                format!("`{}` has no recorded_at seq", b.id),
                "recorded_at is the log position; it is assigned by the store",
            );
        }
    }
}

/// A model call replays only if it carries what produced it.
fn g10_determinism(records: &[Record], f: &mut Failures) {
    for r in records {
        if let Event::ModelCall { purpose, model_id, prompt_hash, .. } = &r.event {
            for (field, value) in
                [("purpose", purpose), ("model_id", model_id), ("prompt_hash", prompt_hash)]
            {
                if value.trim().is_empty() {
                    f.fail_at(
                        Gate::G10Determinism,
                        r.seq.0,
                        format!("a MODEL_CALL carries no `{field}`"),
                        "I5 — a non-deterministic step replays only if what produced it is recorded",
                    );
                }
            }
        }
    }
}
