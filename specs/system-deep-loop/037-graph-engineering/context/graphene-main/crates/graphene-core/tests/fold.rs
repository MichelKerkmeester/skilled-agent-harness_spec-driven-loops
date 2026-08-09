use graphene_core::belief::{Fidelity, Provenance, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Spend};
use graphene_core::event::{Event, Record};
use graphene_core::fold::{fold, fold_up_to, Effect, State};
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, ClaimId, GraphId, NodeId, SessionId};
use graphene_core::node::{
    Binding, Node, NodeKind, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy,
};
use graphene_core::time::{Deadline, ObservedAt, Seq, Timestamp};
use graphene_core::{BeliefEdge, TruthState};
use serde_json::json;

struct Log {
    graph: GraphId,
    records: Vec<Record>,
    seq: u64,
}

impl Log {
    fn new() -> Self {
        let graph = GraphId::from_seed("test");
        let mut l = Log { graph: graph.clone(), records: vec![], seq: 0 };
        l.push(
            Actor::session("s1"),
            Event::GraphCreate {
                seed: "test".into(),
                title: "t".into(),
                description: String::new(),
                task: "do the thing".into(),
                budget: Budget::default(),
                limits: Default::default(),
                tags: vec![],
                parent: None,
            },
        );
        l
    }

    fn push(&mut self, actor: Actor, event: Event) -> Seq {
        self.seq += 1;
        let seq = Seq(self.seq);
        self.records.push(Record {
            seq,
            graph: self.graph.clone(),
            actor,
            at: Timestamp(self.seq as i64 * 1000),
            event,
        });
        seq
    }

    fn s(&mut self, event: Event) -> Seq {
        self.push(Actor::session("s1"), event)
    }

    fn state(&self) -> State {
        fold(&self.records).expect("fold")
    }

    fn node(&mut self, name: &str, kind: NodeKind, needs: Vec<&NodeId>) -> NodeId {
        let id = NodeId::for_name(&self.graph, name);
        let needs: Vec<NodeId> = needs.into_iter().cloned().collect();
        let bindings = needs
            .iter()
            .map(|n| Binding { from: n.clone(), select: "$".into(), into: "in".into() })
            .collect();
        let spec = match kind {
            NodeKind::Human => NodeSpec::Human(graphene_core::node::HumanAsk {
                ask: "approve?".into(),
                options: vec!["approve".into(), "reject".into()],
                context: vec![],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            }),
            NodeKind::Review => NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() },
            NodeKind::Merge => NodeSpec::Merge { prompt: "merge".into() },
            NodeKind::Function => NodeSpec::Function { run: "true".into() },
            NodeKind::Retrieval => NodeSpec::Retrieval { source: "s".into(), query: None },
            NodeKind::Agent => NodeSpec::Agent { prompt: "p".into(), system: None },
        };
        self.s(Event::NodeAdd {
            node: Box::new(Node {
                id: id.clone(),
                graph: self.graph.clone(),
                name: name.into(),
                spec,
                capability: "agent".into(),
                inputs: json!({"type":"object"}),
                outputs: json!({"type":"object"}),
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
            }),
        });
        id
    }

    fn believe(&mut self, content: &str, prov: Provenance, source: SourceRef) -> BeliefId {
        let id = BeliefId::for_content(&self.graph, content, prov.as_str(), &source.key());
        self.s(Event::BeliefAdd {
            id: id.clone(),
            provenance: prov,
            fidelity: Fidelity::Claimed,
            content: content.into(),
            summary: content.chars().take(60).collect(),
            source,
            observed_at: ObservedAt::observed(Timestamp(1000)),
            support_mode: SupportMode::All,
            sensitivity: Default::default(),
            edges: vec![],
            produced_by: None,
            scoped_to: None,
        });
        id
    }

    fn derive(&mut self, content: &str, from: Vec<&BeliefId>) -> BeliefId {
        let source = SourceRef::new("inference");
        let id = BeliefId::for_content(&self.graph, content, "derived", &source.key());
        self.s(Event::BeliefAdd {
            id: id.clone(),
            provenance: Provenance::Derived,
            fidelity: Fidelity::Claimed,
            content: content.into(),
            summary: content.chars().take(60).collect(),
            source,
            observed_at: ObservedAt::observed(Timestamp(1000)),
            support_mode: SupportMode::All,
            sensitivity: Default::default(),
            edges: from.into_iter().map(|b| (BeliefEdge::DerivesFrom, b.clone())).collect(),
            produced_by: None,
            scoped_to: None,
        });
        id
    }
}

#[test]
fn a_belief_with_satisfied_support_is_in() {
    let mut l = Log::new();
    let obs = l.believe("churn is 4.2%", Provenance::ToolObservation, SourceRef::new("warehouse"));
    let conclusion = l.derive("c17 is at risk", vec![&obs]);

    let s = l.state();
    assert_eq!(s.beliefs[&obs].state, TruthState::In);
    assert_eq!(s.beliefs[&conclusion].state, TruthState::In);
}

#[test]
fn retracting_a_premise_cascades_to_its_dependents() {
    let mut l = Log::new();
    let a = l.believe("a", Provenance::Derived, SourceRef::new("x"));
    let b = l.derive("b rests on a", vec![&a]);
    let c = l.derive("c rests on b", vec![&b]);

    assert_eq!(l.state().beliefs[&c].state, TruthState::In);

    l.s(Event::Retract { id: a.clone(), reason: "wrong".into(), evidence: vec![], rule: None });

    let s = l.state();
    assert_eq!(s.beliefs[&a].state, TruthState::Out);
    assert_eq!(s.beliefs[&b].state, TruthState::Out, "support withdrawn");
    assert_eq!(s.beliefs[&c].state, TruthState::Out, "cascade is transitive");
}

#[test]
fn any_support_mode_survives_losing_one_ground() {
    let mut l = Log::new();
    let a = l.believe("ground a", Provenance::Derived, SourceRef::new("x"));
    let b = l.believe("ground b", Provenance::Derived, SourceRef::new("y"));

    let source = SourceRef::new("inference");
    let merged = BeliefId::for_content(&l.graph, "either holds", "derived", &source.key());
    l.s(Event::BeliefAdd {
        id: merged.clone(),
        provenance: Provenance::Derived,
        fidelity: Fidelity::Claimed,
        content: "either holds".into(),
        summary: "either".into(),
        source,
        observed_at: ObservedAt::observed(Timestamp(1)),
        support_mode: SupportMode::Any,
        sensitivity: Default::default(),
        edges: vec![(BeliefEdge::DerivesFrom, a.clone()), (BeliefEdge::DerivesFrom, b.clone())],
        produced_by: None,
        scoped_to: None,
    });

    l.s(Event::Retract { id: a, reason: "gone".into(), evidence: vec![], rule: None });
    assert_eq!(l.state().beliefs[&merged].state, TruthState::In);

    l.s(Event::Retract { id: b, reason: "also gone".into(), evidence: vec![], rule: None });
    assert_eq!(l.state().beliefs[&merged].state, TruthState::Out);
}

#[test]
fn contradiction_produces_both_and_propagates() {
    let mut l = Log::new();
    let obs = l.believe("no touchpoint in 90d", Provenance::ToolObservation, SourceRef::new("crm"));
    let conclusion = l.derive("c17 is neglected", vec![&obs]);

    l.s(Event::Contradict {
        id: obs.clone(),
        reason: "CRM shows a call on 2026-07-30".into(),
        evidence: vec![],
    });

    let s = l.state();
    assert_eq!(s.beliefs[&obs].state, TruthState::Both);
    assert_eq!(
        s.beliefs[&conclusion].state,
        TruthState::Both,
        "a conclusion resting on contested evidence is itself contested"
    );
}

#[test]
fn uncontradict_restores_in() {
    let mut l = Log::new();
    let b = l.believe("x", Provenance::ToolObservation, SourceRef::new("s"));
    l.s(Event::Contradict { id: b.clone(), reason: "r".into(), evidence: vec![] });
    assert_eq!(l.state().beliefs[&b].state, TruthState::Both);
    l.s(Event::Uncontradict { id: b.clone(), reason: "resolved".into() });
    assert_eq!(l.state().beliefs[&b].state, TruthState::In);
}

#[test]
fn source_mutation_marks_stale_and_contests_dependents() {
    let mut l = Log::new();
    let src = SourceRef::new("zendesk").at("tickets/c17").shared();
    let obs = l.believe("12 open tickets", Provenance::ToolObservation, src.clone());
    let score = l.derive("c17 churn risk 0.81", vec![&obs]);

    l.s(Event::Stale { source: SourceRef::new("zendesk").at("tickets/c17") });

    let s = l.state();
    assert!(s.beliefs[&obs].stale, "the observation is stale");
    assert_eq!(s.beliefs[&obs].state, TruthState::In, "I6 — stale is not retracted");
    assert_eq!(s.beliefs[&score].state, TruthState::Both, "the conclusion is now contested");
}

#[test]
fn the_flagship_case_a_draft_flags_its_own_dead_premise() {
    let mut l = Log::new();
    let src = SourceRef::new("zendesk").at("tickets/c17").shared();
    let tickets = l.believe("12 open tickets", Provenance::ToolObservation, src);
    let score = l.derive("c17 churn risk 0.81", vec![&tickets]);
    let draft = l.derive("outreach draft for c17", vec![&score]);

    let approve = l.node("approve-send", NodeKind::Human, vec![]);
    l.s(Event::HumanAsk {
        node: approve.clone(),
        ask: "Approve the outreach to c17?".into(),
        options: vec!["approve".into(), "reject".into()],
        context: vec![score.clone(), draft.clone()],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });

    assert_eq!(l.state().nodes[&approve].state, NodeState::Awaiting);
    assert_eq!(l.state().beliefs[&draft].state, TruthState::In);

    l.s(Event::Stale { source: SourceRef::new("zendesk").at("tickets/c17") });

    let s = l.state();
    assert_eq!(
        s.beliefs[&score].state,
        TruthState::Both,
        "the premise under the draft is contested"
    );
    assert_eq!(
        s.beliefs[&draft].state,
        TruthState::Both,
        "the draft awaiting approval flags itself before anyone acts on it"
    );
    assert_eq!(s.nodes[&approve].state, NodeState::Awaiting, "the human node still waits");
}

#[test]
fn an_awaiting_human_node_blocks_only_its_dependents() {
    let mut l = Log::new();
    let root = l.node("plan", NodeKind::Function, vec![]);
    let gate = l.node("approve", NodeKind::Human, vec![&root]);
    let after_gate = l.node("send", NodeKind::Function, vec![&gate]);
    let independent = l.node("archive-logs", NodeKind::Function, vec![&root]);

    l.s(Event::NodeDone { node: root.clone(), output: json!({}), spend: Spend::default() });
    l.s(Event::HumanAsk {
        node: gate.clone(),
        ask: "ok?".into(),
        options: vec!["approve".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });

    let s = l.state();
    assert_eq!(s.nodes[&gate].state, NodeState::Awaiting);
    assert_eq!(s.nodes[&after_gate].state, NodeState::Blocked, "downstream of the gate blocks");
    assert_eq!(
        s.nodes[&independent].state,
        NodeState::Ready,
        "work not downstream of the gate keeps running"
    );
}

#[test]
fn resolving_a_human_node_unblocks_downstream() {
    let mut l = Log::new();
    let gate = l.node("approve", NodeKind::Human, vec![]);
    let send = l.node("send", NodeKind::Function, vec![&gate]);

    l.s(Event::HumanAsk {
        node: gate.clone(),
        ask: "ok?".into(),
        options: vec!["approve".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    assert_eq!(l.state().nodes[&send].state, NodeState::Blocked);

    let applied = {
        let mut st = fold(&l.records).unwrap();
        let seq = l.push(
            Actor::human("mel"),
            Event::HumanResolve {
                node: gate.clone(),
                by: "mel".into(),
                choice: "approve".into(),
                input: None,
            },
        );
        let rec = l.records.last().unwrap().clone();
        assert_eq!(rec.seq, seq);
        graphene_core::fold::apply(&mut st, &rec).unwrap()
    };

    assert!(applied
        .effects
        .iter()
        .any(|e| matches!(e, Effect::HumanResolved { node, .. } if node == &gate)));
    assert_eq!(l.state().nodes[&send].state, NodeState::Ready);
}

#[test]
fn a_failed_node_skips_its_descendants_but_not_independent_branches() {
    let mut l = Log::new();
    let root = l.node("root", NodeKind::Function, vec![]);
    let a = l.node("a", NodeKind::Function, vec![&root]);
    let a_child = l.node("a-child", NodeKind::Function, vec![&a]);
    let b = l.node("b", NodeKind::Function, vec![&root]);

    l.s(Event::NodeDone { node: root, output: json!({}), spend: Spend::default() });
    l.s(Event::NodeFail { node: a.clone(), reason: "boom".into(), retryable: false });

    let s = l.state();
    assert_eq!(s.nodes[&a].state, NodeState::Failed);
    assert_eq!(s.nodes[&a_child].state, NodeState::Skipped, "blast radius is the subtree");
    assert_eq!(s.nodes[&b].state, NodeState::Ready, "independent branches continue");
}

#[test]
fn escalate_turns_a_failure_into_a_question_for_a_person() {
    let mut l = Log::new();
    let id = NodeId::for_name(&l.graph, "risky");
    l.s(Event::NodeAdd {
        node: Box::new(Node {
            id: id.clone(),
            graph: l.graph.clone(),
            name: "risky".into(),
            spec: NodeSpec::Function { run: "false".into() },
            capability: "function".into(),
            inputs: json!({}),
            outputs: json!({}),
            bindings: vec![],
            needs: vec![],
            for_each: None,
            budget: Budget::default(),
            retry: RetryPolicy::Escalate,
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

    l.s(Event::NodeFail { node: id.clone(), reason: "cannot proceed".into(), retryable: false });

    let s = l.state();
    assert_eq!(s.nodes[&id].state, NodeState::Awaiting, "the graph does not die; a person decides");
    assert_eq!(s.nodes[&id].failure.as_deref(), Some("cannot proceed"));
}

#[test]
fn bounded_retry_returns_a_node_to_ready() {
    let mut l = Log::new();
    let id = NodeId::for_name(&l.graph, "flaky");
    l.s(Event::NodeAdd {
        node: Box::new(Node {
            id: id.clone(),
            graph: l.graph.clone(),
            name: "flaky".into(),
            spec: NodeSpec::Function { run: "maybe".into() },
            capability: "function".into(),
            inputs: json!({}),
            outputs: json!({}),
            bindings: vec![],
            needs: vec![],
            for_each: None,
            budget: Budget::default(),
            retry: RetryPolicy::Bounded { attempts: 2 },
            idempotency: Some("k".into()),
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

    l.s(Event::NodeFail { node: id.clone(), reason: "1".into(), retryable: true });
    assert_eq!(l.state().nodes[&id].state, NodeState::Ready);
    l.s(Event::NodeFail { node: id.clone(), reason: "2".into(), retryable: true });
    assert_eq!(l.state().nodes[&id].state, NodeState::Ready);
    l.s(Event::NodeFail { node: id.clone(), reason: "3".into(), retryable: true });
    assert_eq!(l.state().nodes[&id].state, NodeState::Failed, "the bound is honoured");
}

#[test]
fn a_dying_session_releases_its_claims_and_the_node_returns_to_ready() {
    let mut l = Log::new();
    let n = l.node("work", NodeKind::Agent, vec![]);
    let premise = l.believe("db is migrated", Provenance::ToolObservation, SourceRef::new("db"));

    l.s(Event::SessionAttach { session: SessionId("s1".into()), label: None });
    let claim = ClaimId::for_claim(&n, &SessionId("s1".into()), 1);
    l.s(Event::Claim {
        id: claim.clone(),
        node: n.clone(),
        session: SessionId("s1".into()),
        read_set: vec![premise.clone()],
        expires_at: Deadline(Timestamp(999_999)),
    });

    assert_eq!(l.state().nodes[&n].state, NodeState::Claimed);
    assert_eq!(l.state().active_claims.get(&n), Some(&claim));

    l.s(Event::SessionDetach { session: SessionId("s1".into()) });

    let s = l.state();
    assert_eq!(s.nodes[&n].state, NodeState::Ready, "the work returns to the pool");
    assert!(s.active_claims.is_empty());
    assert!(s.assumed_by.is_empty(), "the read-set index is cleaned up");
}

#[test]
fn premise_invalidation_targets_only_claims_standing_on_it() {
    let mut l = Log::new();
    let n1 = l.node("uses-premise", NodeKind::Agent, vec![]);
    let n2 = l.node("does-not", NodeKind::Agent, vec![]);
    let premise = l.believe("migration 0042 applied", Provenance::Derived, SourceRef::new("db"));
    let other = l.believe("unrelated", Provenance::Derived, SourceRef::new("x"));

    let c1 = ClaimId::for_claim(&n1, &SessionId("s1".into()), 1);
    let c2 = ClaimId::for_claim(&n2, &SessionId("s2".into()), 2);
    l.s(Event::Claim {
        id: c1.clone(),
        node: n1.clone(),
        session: SessionId("s1".into()),
        read_set: vec![premise.clone()],
        expires_at: Deadline(Timestamp(999_999)),
    });
    l.s(Event::Claim {
        id: c2.clone(),
        node: n2.clone(),
        session: SessionId("s2".into()),
        read_set: vec![other],
        expires_at: Deadline(Timestamp(999_999)),
    });

    let mut st = fold(&l.records).unwrap();
    l.s(Event::Retract {
        id: premise.clone(),
        reason: "migration was rolled back".into(),
        evidence: vec![],
        rule: None,
    });
    let applied = graphene_core::fold::apply(&mut st, l.records.last().unwrap()).unwrap();

    let invalidations: Vec<_> = applied
        .effects
        .iter()
        .filter_map(|e| match e {
            Effect::PremiseInvalidated { belief, claims, .. } => Some((belief, claims)),
            _ => None,
        })
        .collect();

    assert_eq!(invalidations.len(), 1);
    assert_eq!(invalidations[0].0, &premise);
    assert_eq!(invalidations[0].1, &vec![c1], "only the session standing on it is notified");
}

#[test]
fn cancelling_a_graph_skips_outstanding_work_and_releases_claims() {
    let mut l = Log::new();
    let n = l.node("work", NodeKind::Agent, vec![]);
    let claim = ClaimId::for_claim(&n, &SessionId("s1".into()), 1);
    l.s(Event::Claim {
        id: claim.clone(),
        node: n.clone(),
        session: SessionId("s1".into()),
        read_set: vec![],
        expires_at: Deadline(Timestamp(999_999)),
    });

    l.s(Event::GraphState { to: GraphState::Cancelled, reason: Some("changed our mind".into()) });

    let s = l.state();
    assert_eq!(s.graph.as_ref().unwrap().state, GraphState::Cancelled);
    assert_eq!(s.nodes[&n].state, NodeState::Skipped);
    assert!(s.active_claims.is_empty());
}

#[test]
fn graph_lifecycle_requires_check_review_and_approval_in_order() {
    let mut l = Log::new();
    let work = l.node("work", NodeKind::Agent, vec![]);
    let review = l.node("review-granularity", NodeKind::Review, vec![]);

    assert!(
        fold(&{
            let mut r = l.records.clone();
            r.push(Record {
                seq: Seq(999),
                graph: l.graph.clone(),
                actor: Actor::session("s1"),
                at: Timestamp(0),
                event: Event::GraphState { to: GraphState::Checked, reason: None },
            });
            r
        })
        .is_err(),
        "check must pass first"
    );

    l.s(Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] });
    l.s(Event::GraphState { to: GraphState::Checked, reason: None });
    assert_eq!(l.state().graph.as_ref().unwrap().state, GraphState::Checked);

    l.s(Event::NodeDone { node: review, output: json!({}), spend: Spend::default() });
    l.s(Event::GraphState { to: GraphState::Reviewed, reason: None });
    l.s(Event::GraphState { to: GraphState::Approved, reason: None });
    l.s(Event::GraphState { to: GraphState::Running, reason: None });

    let s = l.state();
    assert_eq!(s.graph.as_ref().unwrap().state, GraphState::Running);
    assert_eq!(s.nodes[&work].state, NodeState::Ready);
}

#[test]
fn open_findings_block_the_reviewed_transition() {
    let mut l = Log::new();
    let target = l.node("fat-node", NodeKind::Agent, vec![]);
    let review = l.node("review-granularity", NodeKind::Review, vec![]);

    l.s(Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] });
    l.s(Event::GraphState { to: GraphState::Checked, reason: None });

    let finding = graphene_core::id::FindingId::for_finding(&review, 0);
    l.s(Event::ReviewFinding {
        id: finding.clone(),
        review_node: review.clone(),
        target,
        severity: "high".into(),
        body: "this node does three things".into(),
    });
    l.s(Event::NodeDone { node: review, output: json!({}), spend: Spend::default() });

    let mut with_transition = l.records.clone();
    with_transition.push(Record {
        seq: Seq(900),
        graph: l.graph.clone(),
        actor: Actor::session("s1"),
        at: Timestamp(0),
        event: Event::GraphState { to: GraphState::Reviewed, reason: None },
    });
    assert!(fold(&with_transition).is_err(), "an unresolved finding blocks review");

    l.s(Event::FindingResolve {
        id: finding,
        resolution: graphene_core::event::FindingResolution::Applied,
        reason: None,
    });
    l.s(Event::GraphState { to: GraphState::Reviewed, reason: None });
    assert_eq!(l.state().graph.as_ref().unwrap().state, GraphState::Reviewed);
}

#[test]
fn sensitivity_joins_over_support_and_cannot_be_laundered() {
    let mut l = Log::new();
    let restricted = BeliefId::for_content(&l.graph, "salary data", "tool-observation", "hr");
    l.s(Event::BeliefAdd {
        id: restricted.clone(),
        provenance: Provenance::ToolObservation,
        fidelity: Fidelity::Claimed,
        content: "salary data".into(),
        summary: "salary".into(),
        source: SourceRef::new("hr"),
        observed_at: ObservedAt::observed(Timestamp(1)),
        support_mode: SupportMode::All,
        sensitivity: graphene_core::Sensitivity::of(["hr-restricted"]),
        edges: vec![],
        produced_by: None,
        scoped_to: None,
    });

    let conclusion = l.derive("average comp is X", vec![&restricted]);

    let s = l.state();
    assert!(
        s.beliefs[&conclusion]
            .sensitivity
            .dominates(&graphene_core::Sensitivity::of(["hr-restricted"])),
        "a conclusion drawn from restricted support is restricted, transitively"
    );
}

#[test]
fn fold_up_to_reconstructs_a_point_in_time() {
    let mut l = Log::new();
    let b = l.believe("the migration ran", Provenance::ToolObservation, SourceRef::new("db"));
    let before = l.state().seq;
    l.s(Event::Retract {
        id: b.clone(),
        reason: "it did not".into(),
        evidence: vec![],
        rule: None,
    });

    assert_eq!(l.state().beliefs[&b].state, TruthState::Out, "now");
    let then = fold_up_to(&l.records, before).unwrap();
    assert_eq!(then.beliefs[&b].state, TruthState::In, "what we believed when the node ran");
}

#[test]
fn the_fold_is_deterministic() {
    let mut l = Log::new();
    let a = l.believe("a", Provenance::ToolObservation, SourceRef::new("x"));
    let b = l.derive("b", vec![&a]);
    l.s(Event::Contradict { id: a.clone(), reason: "r".into(), evidence: vec![] });
    let n = l.node("work", NodeKind::Agent, vec![]);
    l.s(Event::NodeDone { node: n, output: json!({}), spend: Spend::default() });
    let _ = b;

    let first = fold(&l.records).unwrap();
    for _ in 0..8 {
        assert_eq!(fold(&l.records).unwrap(), first);
    }
    assert_eq!(
        serde_json::to_string(&first).unwrap(),
        serde_json::to_string(&fold(&l.records).unwrap()).unwrap()
    );
}

#[test]
fn out_of_order_records_are_rejected() {
    let mut l = Log::new();
    l.believe("x", Provenance::Derived, SourceRef::new("s"));
    let mut records = l.records.clone();
    records.swap(0, 1);
    assert!(fold(&records).is_err());
}

#[test]
fn a_model_call_is_opaque_and_changes_nothing() {
    let mut l = Log::new();
    let before = l.state();
    l.s(Event::ModelCall {
        purpose: "extract".into(),
        model_id: "m".into(),
        prompt_hash: "h".into(),
        output: json!({"whatever": true}),
    });
    let after = l.state();
    assert_eq!(before.beliefs, after.beliefs);
    assert_eq!(before.nodes, after.nodes);
}

#[test]
fn superseding_closes_validity_and_retires_the_old_belief() {
    let mut l = Log::new();
    let src = SourceRef::new("crm").at("c17");
    let old = l.believe("owner is alice", Provenance::ToolObservation, src.clone());
    let new =
        l.believe("owner is bob", Provenance::ToolObservation, SourceRef::new("crm").at("c17b"));

    l.s(Event::Supersede {
        old: old.clone(),
        new: new.clone(),
        reason: "re-read the CRM".into(),
        observation_proof: Some(json!({"tool_call": "crm.get"})),
    });

    let s = l.state();
    assert_eq!(s.beliefs[&old].state, TruthState::Out);
    assert_eq!(s.beliefs[&old].superseded_by.as_ref(), Some(&new));
    assert!(!s.beliefs[&old].validity.is_open());
    assert_eq!(s.beliefs[&new].supersedes.as_ref(), Some(&old));
    assert_eq!(s.beliefs[&new].state, TruthState::In);
}

/// A contradiction that named its evidence stands only while some of that
/// evidence is still believed. Found by the belief benchmark: a claim stayed
/// contested forever because of a marker whose basis nobody held any more,
/// which is the fold trusting itself over its own log.
#[test]
fn a_contradiction_lifts_when_the_evidence_behind_it_is_withdrawn() {
    let mut f = Log::new();
    let evidence =
        f.believe("the user adopted two cats", Provenance::Hypothesis, SourceRef::new("obs"));
    let claim =
        f.believe("the user prefers dogs", Provenance::ToolObservation, SourceRef::new("convo"));

    f.s(Event::Contradict {
        id: claim.clone(),
        reason: "adopted two cats".into(),
        evidence: vec![evidence.clone()],
    });
    assert_eq!(f.state().beliefs[&claim].state, TruthState::Both);

    f.s(Event::Retract {
        id: evidence,
        reason: "that observation was mistaken".into(),
        evidence: vec![],
        rule: None,
    });

    assert_eq!(
        f.state().beliefs[&claim].state,
        TruthState::In,
        "an objection with no surviving ground is not an objection"
    );
}

/// A contradiction that named no evidence is the caller's own assertion, and
/// stands until they take it back.
#[test]
fn a_contradiction_with_no_declared_evidence_stands_on_its_own() {
    let mut f = Log::new();
    let claim =
        f.believe("the user prefers dogs", Provenance::ToolObservation, SourceRef::new("convo"));
    f.s(Event::Contradict {
        id: claim.clone(),
        reason: "I simply disagree".into(),
        evidence: vec![],
    });
    assert_eq!(f.state().beliefs[&claim].state, TruthState::Both);

    f.s(Event::Uncontradict { id: claim.clone(), reason: "withdrawn".into() });
    assert_eq!(f.state().beliefs[&claim].state, TruthState::In);
}
