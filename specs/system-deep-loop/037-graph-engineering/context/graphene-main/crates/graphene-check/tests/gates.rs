//! Spec 10 §3: every gate gets an adversarial case, not a happy path.
//!
//! Each test crafts the event stream a caller could not produce through the CLI
//! and asserts the gate catches it anyway — that is the difference between a
//! check and a gate.

use graphene_check::gates::{validate, Gate, GateReport};
use graphene_check::Capabilities;
use graphene_core::belief::{Fidelity, Provenance, Sensitivity, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Limits, Spend};
use graphene_core::event::{Event, Record};
use graphene_core::id::{Actor, BeliefId, GraphId, NodeId, NogoodId};
use graphene_core::time::{ObservedAt, Seq, Timestamp};
use graphene_core::BeliefEdge;

struct Log {
    graph: GraphId,
    records: Vec<Record>,
    seq: u64,
}

impl Log {
    fn new() -> Self {
        let graph = GraphId::from_seed("gates");
        let mut l = Log { graph: graph.clone(), records: vec![], seq: 0 };
        l.push(Event::GraphCreate {
            seed: "gates".into(),
            title: "t".into(),
            description: String::new(),
            task: "task".into(),
            budget: Budget::UNLIMITED,
            limits: Limits::default(),
            tags: vec![],
            parent: None,
        });
        l
    }

    fn push(&mut self, event: Event) -> Seq {
        self.seq += 1;
        self.records.push(Record {
            seq: Seq(self.seq),
            graph: self.graph.clone(),
            actor: Actor::System,
            at: Timestamp(1_000 + self.seq as i64),
            event,
        });
        Seq(self.seq)
    }

    fn believe(&mut self, content: &str, prov: Provenance, src: SourceRef) -> BeliefId {
        self.believe_full(content, prov, src, vec![], Sensitivity::none())
    }

    fn believe_full(
        &mut self,
        content: &str,
        prov: Provenance,
        src: SourceRef,
        edges: Vec<(BeliefEdge, BeliefId)>,
        sensitivity: Sensitivity,
    ) -> BeliefId {
        let id = BeliefId::for_content(&self.graph, content, prov.as_str(), &src.key());
        self.push(Event::BeliefAdd {
            id: id.clone(),
            provenance: prov,
            fidelity: Fidelity::Claimed,
            content: content.into(),
            summary: content.chars().take(80).collect(),
            source: src,
            observed_at: ObservedAt::observed(Timestamp(500)),
            support_mode: SupportMode::All,
            sensitivity,
            edges,
            produced_by: None,
            scoped_to: None,
        });
        id
    }

    fn run(&self) -> GateReport {
        let state = graphene_core::fold::fold(&self.records).expect("the fixture log folds");
        validate(&self.records, &state, &Capabilities::default())
    }
}

fn failed(r: &GateReport, gate: Gate) -> bool {
    r.failures.iter().any(|f| f.gate == gate)
}

fn detail(r: &GateReport, gate: Gate) -> String {
    r.failures
        .iter()
        .filter(|f| f.gate == gate)
        .map(|f| f.detail.clone())
        .collect::<Vec<_>>()
        .join(" | ")
}

#[test]
fn a_clean_log_passes_every_gate() {
    let mut l = Log::new();
    let a = l.believe("the migration ran", Provenance::ToolObservation, SourceRef::new("db"));
    l.believe_full(
        "the schema is current",
        Provenance::Derived,
        SourceRef::new("inference"),
        vec![(BeliefEdge::DerivesFrom, a)],
        Sensitivity::none(),
    );
    let r = l.run();
    assert!(r.ok, "{:?}", r.failures);
    assert_eq!(r.gates_run.len(), 11, "every gate runs, every time");
}

/// G1 — a receipt naming a source that never existed.
#[test]
fn g1_catches_a_belief_with_no_source() {
    let mut l = Log::new();
    l.believe("it is so", Provenance::ToolObservation, SourceRef::new("   "));
    let r = l.run();
    assert!(failed(&r, Gate::G1Grounding), "{:?}", r.failures);
}

/// G2 — a cycle assembled across three separate events, none of which closes a
/// loop on its own. Ids are content-anchored, so all three are computable before
/// any of them exists — which is exactly how the loop gets built forwards.
#[test]
fn g2_catches_a_derives_from_cycle_built_across_events() {
    let mut l = Log::new();
    let src = SourceRef::new("s");
    let id = |c: &str, g: &GraphId| BeliefId::for_content(g, c, "derived", &src.key());
    let (a, b, c) = (id("a", &l.graph), id("b", &l.graph), id("c", &l.graph));

    l.believe_full(
        "a",
        Provenance::Derived,
        src.clone(),
        vec![(BeliefEdge::DerivesFrom, c.clone())],
        Sensitivity::none(),
    );
    l.believe_full(
        "b",
        Provenance::Derived,
        src.clone(),
        vec![(BeliefEdge::DerivesFrom, a)],
        Sensitivity::none(),
    );
    l.believe_full(
        "c",
        Provenance::Derived,
        src,
        vec![(BeliefEdge::DerivesFrom, b)],
        Sensitivity::none(),
    );
    let _ = c;

    let r = l.run();
    assert!(failed(&r, Gate::G2Edges), "{:?}", r.failures);
    assert!(detail(&r, Gate::G2Edges).contains("cycle"));
}

#[test]
fn g2_catches_an_edge_to_a_belief_that_does_not_exist() {
    let mut l = Log::new();
    let ghost = BeliefId::for_content(&l.graph, "never recorded", "derived", "nowhere");
    l.believe_full(
        "rests on nothing",
        Provenance::Derived,
        SourceRef::new("s"),
        vec![(BeliefEdge::DerivesFrom, ghost)],
        Sensitivity::none(),
    );

    let r = l.run();
    assert!(failed(&r, Gate::G2Edges), "{:?}", r.failures);
}

/// G3 — a state that cannot be derived from its events. The store is handed a
/// fold that disagrees with the log it came from.
#[test]
fn g3_catches_a_state_the_log_does_not_produce() {
    let mut l = Log::new();
    let a = l.believe("a", Provenance::Hypothesis, SourceRef::new("s"));

    let mut tampered = graphene_core::fold::fold(&l.records).unwrap();
    tampered.beliefs.get_mut(&a).unwrap().state = graphene_core::belief::TruthState::Out;

    let r = validate(&l.records, &tampered, &Capabilities::default());
    assert!(failed(&r, Gate::G3States), "{:?}", r.failures);
    assert!(detail(&r, Gate::G3States).contains("re-derived"));
}

/// G4 — two distinct contents colliding to one id, which would silently merge
/// two different claims.
#[test]
fn g4_catches_an_id_that_is_not_anchored_in_its_content() {
    let mut l = Log::new();
    let honest = l.believe("the real content", Provenance::ToolObservation, SourceRef::new("s"));

    let mut state = graphene_core::fold::fold(&l.records).unwrap();
    state.beliefs.get_mut(&honest).unwrap().content = "something else entirely".into();

    let r = validate(&l.records, &state, &Capabilities::default());
    assert!(failed(&r, Gate::G4Identity), "{:?}", r.failures);
}

/// G5 — `RETRACT` on an observation via a crafted event stream, bypassing the
/// call site that would have refused it.
#[test]
fn g5_catches_a_retraction_the_provenance_forbids() {
    let mut l = Log::new();
    let obs = l.believe("the API returned 47", Provenance::ToolObservation, SourceRef::new("api"));
    l.push(Event::Retract { id: obs, reason: "inconvenient".into(), evidence: vec![], rule: None });

    let r = l.run();
    assert!(failed(&r, Gate::G5Permissions), "{:?}", r.failures);
    assert!(detail(&r, Gate::G5Permissions).contains("tool-observation"));
}

#[test]
fn g5_allows_retracting_what_the_matrix_permits() {
    let mut l = Log::new();
    let hyp = l.believe("probably the index", Provenance::Hypothesis, SourceRef::new("guess"));
    l.push(Event::Retract { id: hyp, reason: "ruled out".into(), evidence: vec![], rule: None });
    let r = l.run();
    assert!(!failed(&r, Gate::G5Permissions), "{:?}", r.failures);
}

/// G6 — `CORROBORATE` from the same `source_ref`, which is one witness read
/// twice rather than two witnesses.
#[test]
fn g6_catches_corroboration_from_the_same_source() {
    let mut l = Log::new();
    let src = SourceRef::new("zendesk").at("tickets/c17");
    let a = l.believe("47 churned", Provenance::ToolObservation, src.clone());
    let b = l.believe("47 churned, read again", Provenance::ToolObservation, src);
    l.push(Event::Corroborate { id: a, by: b });

    let r = l.run();
    assert!(failed(&r, Gate::G6Fidelity), "{:?}", r.failures);
}

#[test]
fn g6_allows_corroboration_from_a_distinct_source() {
    let mut l = Log::new();
    let a = l.believe("47 churned", Provenance::ToolObservation, SourceRef::new("zendesk"));
    let b = l.believe("47 churned", Provenance::ToolObservation, SourceRef::new("salesforce"));
    l.push(Event::Corroborate { id: a, by: b });
    let r = l.run();
    assert!(!failed(&r, Gate::G6Fidelity), "{:?}", r.failures);
}

/// G7 — **the one that must never be relaxed.** Laundering has two layers, and
/// both are tested: the fold joins the label at write time so a clean
/// conclusion from restricted support cannot be recorded at all, and the gate
/// catches it anyway if a state ever claims otherwise.
#[test]
fn g7_the_fold_will_not_record_a_laundered_label() {
    let mut l = Log::new();
    let restricted = l.believe_full(
        "salary band for employee 88",
        Provenance::ToolObservation,
        SourceRef::new("hr"),
        vec![],
        Sensitivity(vec!["hr-confidential".into()]),
    );
    // Asked for clean. Derived from restricted support.
    let laundered = l.believe_full(
        "employee 88 is expensive",
        Provenance::Derived,
        SourceRef::new("inference"),
        vec![(BeliefEdge::DerivesFrom, restricted)],
        Sensitivity::none(),
    );

    let state = graphene_core::fold::fold(&l.records).unwrap();
    assert!(
        state.beliefs[&laundered].sensitivity.0.contains(&"hr-confidential".to_string()),
        "the join is applied when the belief is written, not asked for politely"
    );
    assert!(l.run().ok, "so nothing is left for the gate to find");
}

#[test]
fn g7_catches_a_laundering_chain_in_a_state_that_claims_otherwise() {
    let mut l = Log::new();
    let restricted = l.believe_full(
        "salary band for employee 88",
        Provenance::ToolObservation,
        SourceRef::new("hr"),
        vec![],
        Sensitivity(vec!["hr-confidential".into()]),
    );
    let middle = l.believe_full(
        "employee 88 is in the upper band",
        Provenance::Derived,
        SourceRef::new("inference"),
        vec![(BeliefEdge::DerivesFrom, restricted)],
        Sensitivity::none(),
    );
    let end = l.believe_full(
        "employee 88 is expensive",
        Provenance::Derived,
        SourceRef::new("inference"),
        vec![(BeliefEdge::DerivesFrom, middle)],
        Sensitivity::none(),
    );

    // Strip the label off the tail of the chain, as a corrupted store or a
    // future write path that forgot the join would.
    let mut state = graphene_core::fold::fold(&l.records).unwrap();
    state.beliefs.get_mut(&end).unwrap().sensitivity = Sensitivity::none();

    let r = validate(&l.records, &state, &Capabilities::default());
    assert!(
        failed(&r, Gate::G7Sensitivity),
        "a conclusion may not sit below its support: {:?}",
        r.failures
    );
    assert!(detail(&r, Gate::G7Sensitivity).contains("hr-confidential"));
}

#[test]
fn g7_passes_when_the_conclusion_carries_the_join() {
    let mut l = Log::new();
    let a = l.believe_full(
        "restricted a",
        Provenance::ToolObservation,
        SourceRef::new("hr"),
        vec![],
        Sensitivity(vec!["hr".into()]),
    );
    let b = l.believe_full(
        "restricted b",
        Provenance::ToolObservation,
        SourceRef::new("finance"),
        vec![],
        Sensitivity(vec!["finance".into()]),
    );
    l.believe_full(
        "a conclusion over both",
        Provenance::Derived,
        SourceRef::new("inference"),
        vec![(BeliefEdge::DerivesFrom, a), (BeliefEdge::DerivesFrom, b)],
        Sensitivity(vec!["hr".into(), "finance".into()]),
    );

    let r = l.run();
    assert!(!failed(&r, Gate::G7Sensitivity), "{:?}", r.failures);
}

/// G8 — a set assembled to violate a recorded impossibility.
#[test]
fn g8_catches_an_in_set_containing_every_member_of_a_nogood() {
    let mut l = Log::new();
    let a = l.believe("the migration ran", Provenance::ToolObservation, SourceRef::new("db"));
    let b = l.believe("the migration never ran", Provenance::ToolObservation, SourceRef::new("ci"));
    let members = {
        let mut m = vec![a.clone(), b.clone()];
        m.sort();
        m
    };
    l.push(Event::Nogood {
        id: NogoodId::for_set(&l.graph, &members),
        members,
        note: "these cannot both hold".into(),
    });

    let r = l.run();
    assert!(failed(&r, Gate::G8Nogoods), "{:?}", r.failures);
}

/// G9 — a belief with no place in time, which makes out-of-order arrival
/// unresolvable.
#[test]
fn g9_catches_a_belief_with_no_observation_time() {
    let mut l = Log::new();
    let src = SourceRef::new("s");
    let id = BeliefId::for_content(&l.graph, "undated", "tool-observation", &src.key());
    l.push(Event::BeliefAdd {
        id,
        provenance: Provenance::ToolObservation,
        fidelity: Fidelity::Claimed,
        content: "undated".into(),
        summary: "undated".into(),
        source: src,
        observed_at: ObservedAt { at: Timestamp(0), imputed: false },
        support_mode: SupportMode::All,
        sensitivity: Sensitivity::none(),
        edges: vec![],
        produced_by: None,
        scoped_to: None,
    });

    let r = l.run();
    assert!(failed(&r, Gate::G9Temporal), "{:?}", r.failures);
}

#[test]
fn g9_accepts_an_explicitly_imputed_time() {
    let mut l = Log::new();
    let src = SourceRef::new("s");
    let id = BeliefId::for_content(&l.graph, "undated", "tool-observation", &src.key());
    l.push(Event::BeliefAdd {
        id,
        provenance: Provenance::ToolObservation,
        fidelity: Fidelity::Claimed,
        content: "undated".into(),
        summary: "undated".into(),
        source: src,
        observed_at: ObservedAt::imputed(Timestamp(0)),
        support_mode: SupportMode::All,
        sensitivity: Sensitivity::none(),
        edges: vec![],
        produced_by: None,
        scoped_to: None,
    });

    let r = l.run();
    assert!(!failed(&r, Gate::G9Temporal), "imputing is the explicit admission, not the failure");
}

/// G10 — a model call missing its prompt hash, which is a step nobody can
/// replay.
#[test]
fn g10_catches_a_model_call_missing_its_hash() {
    let mut l = Log::new();
    l.push(Event::ModelCall {
        purpose: "decide the branch".into(),
        model_id: "some-model".into(),
        prompt_hash: String::new(),
        output: serde_json::json!({"choice": "left"}),
    });

    let r = l.run();
    assert!(failed(&r, Gate::G10Determinism), "{:?}", r.failures);
}

/// G11 — the plan checks are gates too, and their findings arrive whole rather
/// than summarised.
#[test]
fn g11_surfaces_plan_findings_through_the_same_report() {
    use graphene_core::node::{Node, NodeSpec, NodeState, RetryPolicy};

    let mut l = Log::new();
    let id = NodeId::for_name(&l.graph, "mystery");
    l.push(Event::NodeAdd {
        node: Box::new(Node {
            id: id.clone(),
            graph: l.graph.clone(),
            name: "mystery".into(),
            spec: NodeSpec::Agent { prompt: "p".into(), system: None },
            capability: "launch_missiles".into(),
            inputs: serde_json::json!({"type":"object"}),
            outputs: serde_json::json!({"type":"object"}),
            bindings: vec![],
            needs: vec![],
            for_each: None,
            budget: Budget::default(),
            retry: RetryPolicy::None,
            idempotency: None,
            writes: vec![],
            state: NodeState::Ready,
            claim: None,
            output: None,
            checkpoints: vec![],
            attempts: 0,
            spend: Spend::default(),
            parent: None,
            failure: None,
        }),
    });

    let r = l.run();
    assert!(failed(&r, Gate::G11Graph), "{:?}", r.failures);
    assert!(!r.plan.ok, "the plan report travels intact, not as a summary");
}

#[test]
fn a_gate_failure_always_names_a_remedy() {
    let mut l = Log::new();
    l.believe("ungrounded", Provenance::ToolObservation, SourceRef::new(""));
    let obs = l.believe("observed", Provenance::ToolObservation, SourceRef::new("api"));
    l.push(Event::Retract { id: obs, reason: "no".into(), evidence: vec![], rule: None });

    let r = l.run();
    assert!(!r.failures.is_empty());
    for f in &r.failures {
        assert!(!f.fix_hint.trim().is_empty(), "{:?} has no fix_hint", f.gate);
        assert!(!f.detail.trim().is_empty(), "{:?} has no detail", f.gate);
    }
}

#[test]
fn gate_names_are_stable_and_distinct() {
    let mut seen = std::collections::BTreeSet::new();
    for g in Gate::ALL {
        assert!(seen.insert(g.as_str()), "{g:?} shares a name with another gate");
        assert!(g.as_str().starts_with('G'));
    }
    assert_eq!(seen.len(), 11);
}

/// A graph that never used the belief layer still passes: the gates must not
/// require evidence a plan-only graph has no reason to hold.
#[test]
fn a_graph_with_no_beliefs_is_not_a_failure() {
    let l = Log::new();
    let r = l.run();
    assert!(r.ok, "{:?}", r.failures);
}
