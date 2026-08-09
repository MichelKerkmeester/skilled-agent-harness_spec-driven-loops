use graphene_core::belief::{Fidelity, Provenance, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Spend};
use graphene_core::event::Event;
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, GraphId, NodeId, SessionId};
use graphene_core::node::{
    Binding, HumanAsk, Node, NodeKind, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy,
};
use graphene_core::refusal::{RefusalCode, Suggestion};
use graphene_core::time::{ObservedAt, Timestamp};
use graphene_core::TruthState;
use graphene_exec::{Ask, ExecError, Executor, NextAction, DEFAULT_LEASE_MS};
use graphene_store::Store;
use serde_json::{json, Value};

struct Fixture {
    exec: Executor,
    graph: GraphId,
    clock: i64,
}

impl Fixture {
    fn new() -> Self {
        let mut store = Store::open_in_memory().unwrap();
        let graph = GraphId::from_seed("exec");
        store
            .append(
                &graph,
                Actor::session("s1"),
                Timestamp(0),
                Event::GraphCreate {
                    seed: "exec".into(),
                    title: "t".into(),
                    description: String::new(),
                    task: "do the work".into(),
                    budget: Budget::tokens(100_000),
                    limits: Default::default(),
                    tags: vec![],
                    parent: None,
                },
            )
            .unwrap();
        Fixture { exec: Executor::new(store), graph, clock: 1000 }
    }

    fn tick(&mut self) -> Timestamp {
        self.clock += 1000;
        Timestamp(self.clock)
    }

    fn now(&self) -> Timestamp {
        Timestamp(self.clock)
    }

    fn add(&mut self, n: Node) -> NodeId {
        let id = n.id.clone();
        let at = self.tick();
        self.exec
            .store_mut()
            .append(&self.graph, Actor::System, at, Event::NodeAdd { node: Box::new(n) })
            .unwrap();
        id
    }

    fn node(&self, name: &str) -> Node {
        Node {
            id: NodeId::for_name(&self.graph, name),
            graph: self.graph.clone(),
            name: name.into(),
            spec: NodeSpec::Agent { prompt: "p".into(), system: None },
            capability: "agent".into(),
            inputs: json!({"type":"object"}),
            outputs: json!({"type":"object"}),
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
        }
    }

    /// Drive a graph to `running`, including the review nodes the lifecycle
    /// requires. Every transition unwraps, so a precondition that starts
    /// refusing fails loudly here rather than leaving tests stuck at `checked`.
    fn run(&mut self) {
        let mut review = self.node("review-granularity");
        review.spec = NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() };
        review.capability = "review".into();
        let review_id = self.add(review);

        let at = self.tick();
        self.exec
            .store_mut()
            .append(
                &self.graph,
                Actor::System,
                at,
                Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
            )
            .unwrap();

        let at = self.tick();
        self.exec
            .store_mut()
            .append(
                &self.graph,
                Actor::System,
                at,
                Event::NodeDone { node: review_id, output: json!({}), spend: Spend::default() },
            )
            .unwrap();

        for to in
            [GraphState::Checked, GraphState::Reviewed, GraphState::Approved, GraphState::Running]
        {
            let at = self.tick();
            self.exec
                .store_mut()
                .append(&self.graph, Actor::System, at, Event::GraphState { to, reason: None })
                .unwrap();
        }
    }

    fn believe(&mut self, content: &str, src: SourceRef) -> BeliefId {
        let id = BeliefId::for_content(&self.graph, content, "tool-observation", &src.key());
        let at = self.tick();
        self.exec
            .store_mut()
            .append(
                &self.graph,
                Actor::System,
                at,
                Event::BeliefAdd {
                    id: id.clone(),
                    provenance: Provenance::ToolObservation,
                    fidelity: Fidelity::Claimed,
                    content: content.into(),
                    summary: content.into(),
                    source: src,
                    observed_at: ObservedAt::observed(Timestamp(1)),
                    support_mode: SupportMode::All,
                    sensitivity: Default::default(),
                    edges: vec![],
                    produced_by: None,
                    scoped_to: None,
                },
            )
            .unwrap();
        id
    }

    fn derive(&mut self, content: &str, from: &[BeliefId]) -> BeliefId {
        let id = BeliefId::for_content(&self.graph, content, "derived", "inference");
        let at = self.tick();
        self.exec
            .store_mut()
            .append(
                &self.graph,
                Actor::System,
                at,
                Event::BeliefAdd {
                    id: id.clone(),
                    provenance: Provenance::Derived,
                    fidelity: Fidelity::Claimed,
                    content: content.into(),
                    summary: content.into(),
                    source: SourceRef::new("inference"),
                    observed_at: ObservedAt::observed(Timestamp(1)),
                    support_mode: SupportMode::All,
                    sensitivity: Default::default(),
                    edges: from
                        .iter()
                        .map(|b| (graphene_core::BeliefEdge::DerivesFrom, b.clone()))
                        .collect(),
                    produced_by: None,
                    scoped_to: None,
                },
            )
            .unwrap();
        id
    }

    fn mark_stale(&mut self, src: &SourceRef) {
        let at = self.tick();
        self.exec
            .store_mut()
            .append(&self.graph, Actor::System, at, Event::Stale { source: src.clone() })
            .unwrap();
    }
}

fn human_node(f: &Fixture, name: &str, needs: Vec<NodeId>) -> Node {
    let mut n = f.node(name);
    n.spec = NodeSpec::Human(HumanAsk {
        ask: "Approve the outreach to c17?".into(),
        options: vec!["approve".into(), "reject".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    n.capability = "human".into();
    n.outputs =
        json!({"type":"object","properties":{"choice":{"type":"string"}},"required":["choice"]});
    n.bindings = needs
        .iter()
        .map(|d| Binding { from: d.clone(), select: "$".into(), into: "in".into() })
        .collect();
    n.needs = needs;
    n.state = NodeState::Pending;
    n
}

fn s(name: &str) -> SessionId {
    SessionId(name.into())
}

// ------------------------------------------------------------- the session loop

#[test]
fn a_review_node_is_claimable_before_the_graph_runs() {
    let mut f = Fixture::new();
    let mut review = f.node("review-granularity");
    review.spec = NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() };
    review.capability = "review".into();
    let review_id = f.add(review);
    let work = f.add(f.node("work"));

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Checked, reason: None },
        )
        .unwrap();

    f.exec
        .claim(&f.graph, &review_id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now())
        .expect("review runs before the plan is approved, or the lifecycle deadlocks");

    let err = f.exec.claim(&f.graph, &work, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap_err();
    assert_eq!(
        err.refusal().unwrap().code,
        RefusalCode::BadGraphState,
        "ordinary work still waits for `running`"
    );
}

#[test]
fn the_loop_is_status_claim_work_report() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    f.run();

    let now = f.now();
    let status = f.exec.attach(&f.graph, &s("s1"), Some("impl".into()), now).unwrap();
    assert!(matches!(status.next_action, NextAction::Claim { .. }));

    let claimed = f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    assert_eq!(claimed.name, "a");
    assert_eq!(claimed.kind, NodeKind::Agent);

    let at = f.tick();
    f.exec
        .done(&f.graph, &a, json!({"ok": true}), Spend { tokens: 10, ..Default::default() }, at)
        .unwrap();

    let status = f.exec.status(&f.graph, Some(&s("s1")), f.now()).unwrap();
    assert_eq!(status.next_action, NextAction::Finish);
    assert_eq!(status.budget.tokens_used, 10);
}

#[test]
fn a_second_session_cannot_take_a_held_node() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    f.run();

    f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let err = f.exec.claim(&f.graph, &a, &s("s2"), &[], DEFAULT_LEASE_MS, f.now()).unwrap_err();

    let r = err.refusal().expect("a structured refusal");
    assert_eq!(r.code, RefusalCode::AlreadyClaimed);
    assert_eq!(r.detail().unwrap().held_by, Some(s("s1")));
}

#[test]
fn inputs_are_resolved_from_upstream_outputs() {
    let mut f = Fixture::new();
    let mut fetch = f.node("fetch");
    fetch.outputs = json!({
        "type":"object",
        "properties":{"customers":{"type":"array","items":{"type":"string"}}},
        "required":["customers"]
    });
    let fetch_id = f.add(fetch);

    let mut score = f.node("score");
    score.inputs = json!({
        "type":"object",
        "properties":{"rows":{"type":"array","items":{"type":"string"}}},
        "required":["rows"]
    });
    score.needs = vec![fetch_id.clone()];
    score.bindings =
        vec![Binding { from: fetch_id.clone(), select: "$.customers".into(), into: "rows".into() }];
    score.state = NodeState::Pending;
    let score_id = f.add(score);

    f.run();
    f.exec.claim(&f.graph, &fetch_id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec
        .done(&f.graph, &fetch_id, json!({"customers":["c17","c18"]}), Spend::default(), at)
        .unwrap();

    let claimed =
        f.exec.claim(&f.graph, &score_id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    assert_eq!(claimed.inputs, json!({"rows":["c17","c18"]}));
}

// ---------------------------------------------------------- read-set assertion

#[test]
fn claiming_on_a_dead_premise_is_refused_and_names_what_killed_it() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    let premise = f.believe("migration 0042 applied", SourceRef::new("db"));
    f.run();

    f.exec
        .claim(&f.graph, &a, &s("s1"), std::slice::from_ref(&premise), DEFAULT_LEASE_MS, f.now())
        .unwrap();
    let at = f.tick();
    f.exec.release(&f.graph, &a, None, at).unwrap();

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::Contradict {
                id: premise.clone(),
                reason: "the migration was rolled back".into(),
                evidence: vec![],
            },
        )
        .unwrap();

    let err = f
        .exec
        .claim(&f.graph, &a, &s("s1"), std::slice::from_ref(&premise), DEFAULT_LEASE_MS, f.now())
        .unwrap_err();

    let r = err.refusal().unwrap();
    assert_eq!(r.code, RefusalCode::StalePremise);
    let stale = &r.detail().unwrap().stale;
    assert_eq!(stale.len(), 1);
    assert_eq!(stale[0].id, premise);
    assert_eq!(stale[0].state, TruthState::Both);
    assert!(r.suggestion == graphene_core::Suggestion::RebindAndReclaim);
}

#[test]
fn a_stale_source_invalidates_a_premise_for_claiming() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    let src = SourceRef::new("zendesk").at("tickets/c17").shared();
    let premise = f.believe("12 open tickets", src);
    f.run();

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::Stale { source: SourceRef::new("zendesk").at("tickets/c17") },
        )
        .unwrap();

    let err =
        f.exec.claim(&f.graph, &a, &s("s1"), &[premise], DEFAULT_LEASE_MS, f.now()).unwrap_err();
    assert_eq!(err.refusal().unwrap().code, RefusalCode::StalePremise);
    assert!(err.refusal().unwrap().detail().unwrap().stale[0].stale);
}

// ------------------------------------------------------------------- outputs

#[test]
fn an_output_that_violates_its_declared_schema_is_refused() {
    let mut f = Fixture::new();
    let mut n = f.node("scores");
    n.outputs =
        json!({"type":"object","properties":{"risk":{"type":"number"}},"required":["risk"]});
    let id = f.add(n);
    f.run();
    f.exec.claim(&f.graph, &id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();

    let at = f.tick();
    let err =
        f.exec.done(&f.graph, &id, json!({"risk": "high"}), Spend::default(), at).unwrap_err();

    let r = err.refusal().unwrap();
    assert_eq!(r.code, RefusalCode::OutputSchemaViolation);
    assert!(r.reason.contains("$.risk"), "the failing path is named: {}", r.reason);

    let at = f.tick();
    f.exec.done(&f.graph, &id, json!({"risk": 0.81}), Spend::default(), at).unwrap();
    assert_eq!(f.exec.store().state(&f.graph).unwrap().nodes[&id].state, NodeState::Done);
}

#[test]
fn a_missing_required_output_field_is_refused() {
    let mut f = Fixture::new();
    let mut n = f.node("scores");
    n.outputs =
        json!({"type":"object","properties":{"risk":{"type":"number"}},"required":["risk"]});
    let id = f.add(n);
    f.run();
    f.exec.claim(&f.graph, &id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();

    let at = f.tick();
    let err = f.exec.done(&f.graph, &id, json!({}), Spend::default(), at).unwrap_err();
    assert_eq!(err.refusal().unwrap().code, RefusalCode::OutputSchemaViolation);
}

#[test]
fn reporting_done_on_a_released_node_is_refused() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    f.run();
    f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec.release(&f.graph, &a, Some("giving up".into()), at).unwrap();

    let at = f.tick();
    let err = f.exec.done(&f.graph, &a, json!({}), Spend::default(), at).unwrap_err();
    assert_eq!(err.refusal().unwrap().code, RefusalCode::ClaimRevoked);
}

// ---------------------------------------------------------------- human nodes

#[test]
fn a_human_node_view_is_answerable_by_a_cold_agent() {
    let mut f = Fixture::new();
    let src = SourceRef::new("zendesk").at("tickets/c17").shared();
    let tickets = f.believe("12 open tickets", src);
    let gate = f.add(human_node(&f, "approve-send", vec![]));
    f.run();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate,
            Ask {
                question: "Approve the outreach to c17?".into(),
                options: vec!["approve".into(), "reject".into()],
                context: vec![tickets.clone()],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let view = f.exec.human_node(&f.graph, &gate).unwrap();
    assert_eq!(view.ask, "Approve the outreach to c17?");
    assert_eq!(view.options, vec!["approve", "reject"]);
    assert_eq!(view.task, "do the work", "the graph's original request travels with the ask");
    assert_eq!(view.context.len(), 1);
    assert_eq!(view.context[0].state, TruthState::In);
    assert!(!view.context[0].stale);
}

#[test]
fn the_view_shows_a_premise_that_died_while_the_human_was_deciding() {
    let mut f = Fixture::new();
    let src = SourceRef::new("zendesk").at("tickets/c17").shared();
    let tickets = f.believe("12 open tickets", src);
    let gate = f.add(human_node(&f, "approve-send", vec![]));
    f.run();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate,
            Ask {
                question: "Approve?".into(),
                options: vec!["approve".into(), "reject".into()],
                context: vec![tickets.clone()],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();
    assert!(!f.exec.human_node(&f.graph, &gate).unwrap().context[0].stale);

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::Stale { source: SourceRef::new("zendesk").at("tickets/c17") },
        )
        .unwrap();

    let view = f.exec.human_node(&f.graph, &gate).unwrap();
    assert!(
        view.context[0].stale,
        "the approver sees the premise died before they act on the draft"
    );
    assert_eq!(view.state, NodeState::Awaiting, "and the node is still waiting");
}

#[test]
fn an_awaiting_node_blocks_only_downstream() {
    let mut f = Fixture::new();
    let root = f.add(f.node("root"));
    let mut gate = human_node(&f, "approve", vec![root.clone()]);
    gate.inputs = json!({"type":"object","properties":{"in":{}}});
    let gate_id = f.add(gate);

    let mut send = f.node("send");
    send.needs = vec![gate_id.clone()];
    send.bindings = vec![Binding { from: gate_id.clone(), select: "$".into(), into: "in".into() }];
    send.inputs = json!({"type":"object","properties":{"in":{}}});
    send.state = NodeState::Pending;
    let send_id = f.add(send);

    let mut aside = f.node("archive");
    aside.needs = vec![root.clone()];
    aside.bindings = vec![Binding { from: root.clone(), select: "$".into(), into: "in".into() }];
    aside.inputs = json!({"type":"object","properties":{"in":{}}});
    aside.state = NodeState::Pending;
    let aside_id = f.add(aside);

    f.run();
    f.exec.claim(&f.graph, &root, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec.done(&f.graph, &root, json!({}), Spend::default(), at).unwrap();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate_id,
            Ask {
                question: "ok?".into(),
                options: vec!["approve".into()],
                context: vec![],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&gate_id].state, NodeState::Awaiting);
    assert_eq!(st.nodes[&send_id].state, NodeState::Blocked);
    assert_eq!(st.nodes[&aside_id].state, NodeState::Ready, "unrelated work keeps running");

    let status = f.exec.status(&f.graph, Some(&s("s1")), f.now()).unwrap();
    assert!(matches!(status.next_action, NextAction::Claim { .. }));
}

#[test]
fn when_only_human_input_remains_status_says_so() {
    let mut f = Fixture::new();
    let gate = f.add(human_node(&f, "approve", vec![]));
    f.run();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate,
            Ask {
                question: "ok?".into(),
                options: vec!["approve".into()],
                context: vec![],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let status = f.exec.status(&f.graph, Some(&s("s1")), f.now()).unwrap();
    match status.next_action {
        NextAction::ReportAwaiting { nodes } => assert_eq!(nodes, vec![gate]),
        other => panic!("expected ReportAwaiting, got {other:?}"),
    }
    assert!(status.why.contains("human input"));
}

#[test]
fn resolving_unblocks_downstream_and_records_the_choice() {
    let mut f = Fixture::new();
    let gate = f.add(human_node(&f, "approve", vec![]));
    let mut send = f.node("send");
    send.needs = vec![gate.clone()];
    send.bindings = vec![Binding { from: gate.clone(), select: "$".into(), into: "in".into() }];
    send.inputs = json!({"type":"object","properties":{"in":{}}});
    send.state = NodeState::Pending;
    let send_id = f.add(send);
    f.run();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate,
            Ask {
                question: "ok?".into(),
                options: vec!["approve".into(), "reject".into()],
                context: vec![],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let at = f.tick();
    f.exec.resolve(&f.graph, &gate, "mel", "approve", Some(json!({"tone":"warm"})), at).unwrap();

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&gate].state, NodeState::Done);
    assert_eq!(st.nodes[&send_id].state, NodeState::Ready);
    let out = st.nodes[&gate].output.as_ref().unwrap();
    assert_eq!(out["choice"], "approve");
    assert_eq!(out["input"]["tone"], "warm");
}

#[test]
fn an_answer_outside_the_offered_options_is_refused() {
    let mut f = Fixture::new();
    let gate = f.add(human_node(&f, "approve", vec![]));
    f.run();
    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate,
            Ask {
                question: "ok?".into(),
                options: vec!["approve".into(), "reject".into()],
                context: vec![],
                consequence: vec![],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let at = f.tick();
    let err = f.exec.resolve(&f.graph, &gate, "mel", "maybe", None, at).unwrap_err();
    assert!(err.refusal().unwrap().reason.contains("approve, reject"));
}

// ---------------------------------------------------------------------- retry

#[test]
fn escalate_converts_a_failure_into_a_question_for_a_person() {
    let mut f = Fixture::new();
    let mut n = f.node("risky");
    n.retry = RetryPolicy::Escalate;
    let id = f.add(n);
    f.run();
    f.exec.claim(&f.graph, &id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();

    let at = f.tick();
    f.exec.fail(&f.graph, &id, "the API refused", false, at).unwrap();

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&id].state, NodeState::Awaiting, "the graph does not die");
    assert_eq!(st.nodes[&id].failure.as_deref(), Some("the API refused"));
}

#[test]
fn a_bounded_retry_returns_work_to_the_pool_then_gives_up() {
    let mut f = Fixture::new();
    let mut n = f.node("flaky");
    n.retry = RetryPolicy::Bounded { attempts: 2 };
    n.idempotency = Some("k".into());
    let id = f.add(n);
    f.run();

    for _ in 0..2 {
        f.exec.claim(&f.graph, &id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
        let at = f.tick();
        f.exec.fail(&f.graph, &id, "flaked", true, at).unwrap();
        assert_eq!(f.exec.store().state(&f.graph).unwrap().nodes[&id].state, NodeState::Ready);
    }

    f.exec.claim(&f.graph, &id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec.fail(&f.graph, &id, "flaked".to_string(), true, at).unwrap();
    assert_eq!(f.exec.store().state(&f.graph).unwrap().nodes[&id].state, NodeState::Failed);
}

// ----------------------------------------------------------------- checkpoints

#[test]
fn checkpoints_survive_for_a_retry_to_resume_from() {
    let mut f = Fixture::new();
    let a = f.add(f.node("scan"));
    f.run();
    f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();

    for cursor in ["c17", "c40"] {
        let at = f.tick();
        f.exec.checkpoint(&f.graph, &a, json!({"cursor": cursor}), at).unwrap();
    }

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&a].checkpoints.len(), 2);
    assert_eq!(st.nodes[&a].state, NodeState::Running, "a checkpoint marks progress");

    let at = f.tick();
    f.exec.fail(&f.graph, &a, "died".to_string(), false, at).unwrap();
    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&a].checkpoints.len(), 2, "progress is not lost on failure");
}

// ------------------------------------------------------------------ expansion

#[test]
fn for_each_expands_deterministically_from_the_source_output() {
    let mut f = Fixture::new();
    let mut list = f.node("list");
    list.outputs = json!({
        "type":"object",
        "properties":{"rows":{"type":"array","items":{"type":"string"}}},
        "required":["rows"]
    });
    let list_id = f.add(list);

    let mut each = f.node("per-row");
    each.needs = vec![list_id.clone()];
    each.inputs = json!({"type":"object","properties":{"row":{}}});
    each.for_each = Some(graphene_core::node::ForEach {
        over: Binding { from: list_id.clone(), select: "$.rows".into(), into: "row".into() },
        max: 10,
        as_field: "row".into(),
    });
    each.state = NodeState::Pending;
    let each_id = f.add(each);

    f.run();
    f.exec.claim(&f.graph, &list_id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec.done(&f.graph, &list_id, json!({"rows":["a","b","c"]}), Spend::default(), at).unwrap();

    let at = f.tick();
    let children = f.exec.expand(&f.graph, &each_id, at).unwrap();
    assert_eq!(children.len(), 3);
    assert_eq!(children[0], NodeId::for_expansion(&each_id, 0), "child ids replay identically");

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&children[1]].name, "per-row[1]");
    assert_eq!(st.nodes[&children[1]].parent.as_ref(), Some(&each_id));
}

#[test]
fn an_expansion_past_its_declared_bound_is_refused() {
    let mut f = Fixture::new();
    let mut list = f.node("list");
    list.outputs = json!({
        "type":"object",
        "properties":{"rows":{"type":"array","items":{"type":"string"}}},
        "required":["rows"]
    });
    let list_id = f.add(list);

    let mut each = f.node("per-row");
    each.needs = vec![list_id.clone()];
    each.inputs = json!({"type":"object","properties":{"row":{}}});
    each.for_each = Some(graphene_core::node::ForEach {
        over: Binding { from: list_id.clone(), select: "$.rows".into(), into: "row".into() },
        max: 2,
        as_field: "row".into(),
    });
    each.state = NodeState::Pending;
    let each_id = f.add(each);

    f.run();
    f.exec.claim(&f.graph, &list_id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec
        .done(&f.graph, &list_id, json!({"rows":["a","b","c","d"]}), Spend::default(), at)
        .unwrap();

    let at = f.tick();
    let err = f.exec.expand(&f.graph, &each_id, at).unwrap_err();
    let r = err.refusal().unwrap();
    assert_eq!(r.code, RefusalCode::LimitExceeded);
    assert_eq!(r.detail().unwrap().actual, Some(4));
}

// ---------------------------------------------------------------------- leases

#[test]
fn a_lapsed_lease_is_swept_and_the_node_returns_to_the_pool() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    f.run();
    f.exec.claim(&f.graph, &a, &s("s1"), &[], 1_000, f.now()).unwrap();
    assert_eq!(f.exec.store().state(&f.graph).unwrap().nodes[&a].state, NodeState::Claimed);

    let before = Timestamp(f.now().0 + 500);
    assert!(f.exec.sweep_leases(before).unwrap().is_empty(), "not yet expired");

    let after = Timestamp(f.now().0 + 2_000);
    let revoked = f.exec.sweep_leases(after).unwrap();
    assert_eq!(revoked.len(), 1);
    assert_eq!(revoked[0].node, a);

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&a].state, NodeState::Ready, "the work returns to the pool");
    assert!(st.active_claims.is_empty());
}

#[test]
fn a_detaching_session_releases_what_it_holds() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    f.run();
    let now = f.now();
    f.exec.attach(&f.graph, &s("s1"), None, now).unwrap();
    f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();

    let at = f.tick();
    f.exec.detach(&f.graph, &s("s1"), at).unwrap();

    let st = f.exec.store().state(&f.graph).unwrap();
    assert_eq!(st.nodes[&a].state, NodeState::Ready);
    assert!(st.active_claims.is_empty());
}

// ----------------------------------------------------------------- next_action

#[test]
fn next_action_walks_the_lifecycle() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    let mut review = f.node("review-granularity");
    review.spec = NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() };
    review.capability = "review".into();
    let review_id = f.add(review);

    let st = |f: &Fixture| f.exec.status(&f.graph, Some(&s("s1")), f.now()).unwrap().next_action;

    assert_eq!(st(&f), NextAction::Check);

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Checked, reason: None },
        )
        .unwrap();
    assert_eq!(st(&f), NextAction::Review, "review nodes have not completed");

    f.exec
        .claim(&f.graph, &review_id, &s("s1"), &[], DEFAULT_LEASE_MS, f.now())
        .expect("review nodes run in `checked`");
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::NodeDone { node: review_id, output: json!({}), spend: Spend::default() },
        )
        .unwrap();
    assert_eq!(st(&f), NextAction::PresentToUser);

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Reviewed, reason: None },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Approved, reason: None },
        )
        .unwrap();
    assert_eq!(st(&f), NextAction::Start);

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Running, reason: None },
        )
        .unwrap();
    assert!(matches!(st(&f), NextAction::Claim { .. }));

    f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let at = f.tick();
    f.exec.done(&f.graph, &a, json!({}), Spend::default(), at).unwrap();
    assert_eq!(st(&f), NextAction::Finish);
}

#[test]
fn status_serializes_with_a_tagged_next_action() {
    let mut f = Fixture::new();
    f.add(f.node("a"));
    f.run();
    let status = f.exec.status(&f.graph, Some(&s("s1")), f.now()).unwrap();
    let json: Value = serde_json::to_value(&status).unwrap();
    assert_eq!(json["next_action"]["do"], "claim");
    assert!(json["why"].as_str().unwrap().contains("ready"));
}

#[test]
fn a_refusal_is_a_result_not_a_generic_store_failure() {
    let mut f = Fixture::new();
    let a = f.add(f.node("a"));
    f.run();
    f.exec.claim(&f.graph, &a, &s("s1"), &[], DEFAULT_LEASE_MS, f.now()).unwrap();
    let err = f.exec.claim(&f.graph, &a, &s("s2"), &[], DEFAULT_LEASE_MS, f.now()).unwrap_err();

    assert!(matches!(err, ExecError::Refused(_)), "refusals must not arrive as Store errors");
    let wire = serde_json::to_string(err.refusal().unwrap()).unwrap();
    assert!(wire.contains("\"already-claimed\""));
    assert!(wire.contains("\"claim-another\""));
}

fn review_node(f: &Fixture, name: &str, lens: &str) -> Node {
    let mut n = f.node(name);
    n.spec = NodeSpec::Review { lens: lens.into(), prompt: "p".into() };
    n.capability = "review".into();
    n.outputs = json!({
        "type": "object",
        "properties": { "findings": { "type": "array", "items": { "type": "object" } } },
        "required": ["findings"]
    });
    n
}

/// The defect the dogfood run found: a lens reported six real findings, they
/// were recorded as opaque node output, and `resolve-findings` could never fire.
#[test]
fn a_review_nodes_findings_become_resolvable_findings() {
    let mut f = Fixture::new();
    let target = f.add(f.node("draft-and-send"));
    let review = f.add(review_node(&f, "review-granularity", "granularity"));

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Checked, reason: None },
        )
        .unwrap();

    let at = f.tick();
    f.exec.claim(&f.graph, &review, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();

    let at = f.tick();
    f.exec
        .done(
            &f.graph,
            &review,
            json!({"findings": [
                {"target": "draft-and-send", "severity": "error", "body": "does two things"}
            ]}),
            Spend::default(),
            at,
        )
        .unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.findings.len(), 1, "the finding was not recorded");
    let finding = state.findings.values().next().unwrap();
    assert_eq!(finding.target, target);
    assert_eq!(finding.severity, "error");
    assert!(finding.resolution.is_none());

    let status = graphene_exec::compute_status(&state, None, Timestamp(f.clock));
    assert!(
        matches!(status.next_action, NextAction::ResolveFindings { open: 1 }),
        "an open finding must hold the graph, got {:?}",
        status.next_action
    );

    let at = f.tick();
    f.exec
        .resolve_finding(
            &f.graph,
            &finding.id.clone(),
            graphene_core::event::FindingResolution::Applied,
            "split into two nodes".into(),
            at,
        )
        .unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert!(state.findings.values().all(|x| x.resolution.is_some()));
    let status = graphene_exec::compute_status(&state, None, Timestamp(f.clock));
    assert!(
        matches!(status.next_action, NextAction::PresentToUser),
        "with every finding resolved the plan is ready to show, got {:?}",
        status.next_action
    );
}

#[test]
fn a_finding_against_a_node_that_does_not_exist_is_refused() {
    let mut f = Fixture::new();
    f.add(f.node("real-node"));
    let review = f.add(review_node(&f, "review-granularity", "granularity"));

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Checked, reason: None },
        )
        .unwrap();
    let at = f.tick();
    f.exec.claim(&f.graph, &review, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();

    let at = f.tick();
    let e = f
        .exec
        .done(
            &f.graph,
            &review,
            json!({"findings": [{"target": "ghost", "severity": "error", "body": "b"}]}),
            Spend::default(),
            at,
        )
        .unwrap_err();

    let ExecError::Refused(r) = e else { panic!("expected a refusal, got {e:?}") };
    assert_eq!(r.code, RefusalCode::OutputSchemaViolation);
    assert!(r.reason.contains("ghost"), "the refusal names the missing target: {}", r.reason);
}

#[test]
fn a_finding_resolves_once() {
    let mut f = Fixture::new();
    f.add(f.node("target"));
    let review = f.add(review_node(&f, "review-granularity", "granularity"));

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Checked, reason: None },
        )
        .unwrap();
    let at = f.tick();
    f.exec.claim(&f.graph, &review, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec
        .done(
            &f.graph,
            &review,
            json!({"findings": [{"target": "target", "severity": "note", "body": "b"}]}),
            Spend::default(),
            at,
        )
        .unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    let id = state.findings.keys().next().unwrap().clone();

    let at = f.tick();
    f.exec
        .resolve_finding(
            &f.graph,
            &id,
            graphene_core::event::FindingResolution::Rejected,
            "r".into(),
            at,
        )
        .unwrap();
    let at = f.tick();
    let e = f
        .exec
        .resolve_finding(
            &f.graph,
            &id,
            graphene_core::event::FindingResolution::Applied,
            "r".into(),
            at,
        )
        .unwrap_err();
    let ExecError::Refused(r) = e else { panic!("expected a refusal") };
    assert_eq!(r.code, RefusalCode::AlreadyApplied);
}

/// Spec 09 §5 puts one merge node on the review fan-in. Counting only the
/// lenses declares review complete while the node that owns their findings is
/// still sitting in `ready`.
#[test]
fn review_is_not_complete_until_its_merge_owner_has_run() {
    let mut f = Fixture::new();
    let a = f.add(review_node(&f, "review-granularity", "granularity"));
    let b = f.add(review_node(&f, "review-dependency", "dependency"));

    let mut owner = f.node("review-findings");
    owner.spec = NodeSpec::Merge { prompt: "consolidate".into() };
    owner.capability = "merge".into();
    owner.needs = vec![a.clone(), b.clone()];
    owner.state = NodeState::Pending;
    let owner_id = f.add(owner);

    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
        )
        .unwrap();
    let at = f.tick();
    f.exec
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Checked, reason: None },
        )
        .unwrap();

    for lens in [&a, &b] {
        let at = f.tick();
        f.exec.claim(&f.graph, lens, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
        let at = f.tick();
        f.exec.done(&f.graph, lens, json!({"findings": []}), Spend::default(), at).unwrap();
    }

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(
        graphene_core::fold::review_owner(&state).map(|n| n.id.clone()),
        Some(owner_id.clone()),
        "the owner is the merge whose every dependency is a lens"
    );
    let status = graphene_exec::compute_status(&state, None, Timestamp(f.clock));
    assert!(
        matches!(status.next_action, NextAction::Review),
        "review is not done while its owner has not run, got {:?}",
        status.next_action
    );

    let at = f.tick();
    f.exec.claim(&f.graph, &owner_id, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec.done(&f.graph, &owner_id, json!({}), Spend::default(), at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    let status = graphene_exec::compute_status(&state, None, Timestamp(f.clock));
    assert!(
        matches!(status.next_action, NextAction::PresentToUser),
        "got {:?}",
        status.next_action
    );
}

/// The dogfood run's worst finding: `gr check` proved a human node sat on every
/// path to `send_email`, the person answered "no", and the send node was
/// claimable anyway. A gate that releases its dependents whatever the answer is
/// not a gate.
#[test]
fn answering_no_skips_the_irreversible_node() {
    let mut f = Fixture::new();

    let mut gate = f.node("approve-send");
    gate.capability = "human".into();
    gate.spec = NodeSpec::Human(HumanAsk {
        ask: "Send it?".into(),
        options: vec!["send".into(), "cancel".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    let gate_id = f.add(gate);

    let mut send = f.node("send");
    send.capability = "send_email".into();
    send.needs = vec![gate_id.clone()];
    send.state = NodeState::Pending;
    let send_id = f.add(send);

    f.run();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate_id,
            Ask {
                question: "Send it?".into(),
                options: vec!["send".into(), "cancel".into()],
                context: vec![],
                consequence: vec![
                    ("send".into(), vec![send_id.clone()]),
                    ("cancel".into(), vec![]),
                ],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let at = f.tick();
    f.exec.resolve(&f.graph, &gate_id, "mels", "cancel", None, at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(
        state.nodes[&send_id].state,
        NodeState::Skipped,
        "answering `cancel` must not leave the send claimable"
    );

    let at = f.tick();
    let e = f.exec.claim(&f.graph, &send_id, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap_err();
    let ExecError::Refused(r) = e else { panic!("expected a refusal, got {e:?}") };
    assert_eq!(r.code, RefusalCode::NotClaimable);
}

#[test]
fn answering_yes_releases_exactly_what_it_names() {
    let mut f = Fixture::new();

    let mut gate = f.node("approve-send");
    gate.capability = "human".into();
    gate.spec = NodeSpec::Human(HumanAsk {
        ask: "Send it?".into(),
        options: vec!["send".into(), "redraft".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    let gate_id = f.add(gate);

    let mut send = f.node("send");
    send.capability = "send_email".into();
    send.needs = vec![gate_id.clone()];
    send.state = NodeState::Pending;
    let send_id = f.add(send);

    let mut redraft = f.node("redraft");
    redraft.needs = vec![gate_id.clone()];
    redraft.state = NodeState::Pending;
    let redraft_id = f.add(redraft);

    f.run();

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate_id,
            Ask {
                question: "Send it?".into(),
                options: vec!["send".into(), "redraft".into()],
                context: vec![],
                consequence: vec![
                    ("send".into(), vec![send_id.clone()]),
                    ("redraft".into(), vec![redraft_id.clone()]),
                ],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let at = f.tick();
    f.exec.resolve(&f.graph, &gate_id, "mels", "redraft", None, at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&redraft_id].state, NodeState::Ready, "the named branch runs");
    assert_eq!(state.nodes[&send_id].state, NodeState::Skipped, "the unnamed branch does not");
}

/// The flagship behaviour, end to end: a source written after a draft reached a
/// person must be unmissable on the ask, not something an agent has to notice by
/// scanning `context`.
#[test]
fn a_source_written_after_the_ask_is_announced_on_the_gate() {
    let mut f = Fixture::new();

    let mut gate = f.node("approve");
    gate.capability = "human".into();
    gate.spec = NodeSpec::Human(HumanAsk {
        ask: "Send it?".into(),
        options: vec!["send".into(), "cancel".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    let gate_id = f.add(gate);
    f.run();

    let src = SourceRef::new("salesforce").at("report/churn-q3");
    let observed = f.believe("47 accounts churned in Q3", src.clone());
    let derived = f.derive("the draft targets those 47 accounts", std::slice::from_ref(&observed));

    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate_id,
            Ask {
                question: "Send it?".into(),
                options: vec!["send".into(), "cancel".into()],
                context: vec![observed.clone(), derived.clone()],
                consequence: vec![("send".into(), vec![]), ("cancel".into(), vec![])],
                on_timeout: TimeoutPolicy::Wait,
            },
            at,
        )
        .unwrap();

    let before = f.exec.human_node(&f.graph, &gate_id).unwrap();
    assert!(before.premises_moved.is_none(), "nothing has moved yet");

    f.mark_stale(&src);

    let after = f.exec.human_node(&f.graph, &gate_id).unwrap();
    let warning = after.premises_moved.expect("a moved premise must be announced");
    assert!(warning.contains("churned"), "it names the observation: {warning}");
    assert!(warning.contains("draft"), "and the conclusion resting on it: {warning}");

    assert!(after.context.iter().any(|c| c.stale), "the observation is flagged stale");
    assert!(
        after.context.iter().any(|c| c.state == TruthState::Both),
        "the conclusion resting on it is contested"
    );
}

/// A session driving the CLI never has to attach, so listing only attached
/// sessions hides exactly the holder whose work you are trying to find.
#[test]
fn a_claim_holder_that_never_attached_is_still_listed() {
    let mut f = Fixture::new();
    let node = f.add(f.node("work"));
    f.run();

    let at = f.tick();
    f.exec.claim(&f.graph, &node, &s("cli-only"), &[], DEFAULT_LEASE_MS, at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert!(!state.sessions.contains_key(&s("cli-only")), "it never attached");

    let listed = graphene_exec::sessions(&state);
    let holder = listed
        .iter()
        .find(|v| v.id == s("cli-only"))
        .expect("a claim holder must be listed even without attaching");
    assert!(!holder.attached);
    assert_eq!(holder.holding, vec![node.clone()]);

    let at = f.tick();
    f.exec.release(&f.graph, &node, None, at).unwrap();
    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert!(
        !graphene_exec::sessions(&state).iter().any(|v| v.id == s("cli-only")),
        "once it holds nothing there is nothing to report"
    );
}

fn gate_with(f: &mut Fixture, policy: TimeoutPolicy) -> (NodeId, NodeId) {
    let mut gate = f.node("gate");
    gate.capability = "human".into();
    gate.spec = NodeSpec::Human(HumanAsk {
        ask: "Publish?".into(),
        options: vec!["publish".into(), "hold".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: policy,
    });
    let gate_id = f.add(gate);

    let mut ship = f.node("ship");
    ship.capability = "publish_view".into();
    ship.needs = vec![gate_id.clone()];
    ship.state = NodeState::Pending;
    let ship_id = f.add(ship);

    f.run();
    let at = f.tick();
    f.exec
        .ask(
            &f.graph,
            &gate_id,
            Ask {
                question: "Publish?".into(),
                options: vec!["publish".into(), "hold".into()],
                context: vec![],
                consequence: vec![
                    ("publish".into(), vec![ship_id.clone()]),
                    ("hold".into(), vec![]),
                ],
                on_timeout: policy,
            },
            at,
        )
        .unwrap();
    (gate_id, ship_id)
}

/// `sweep_human_timeouts` had no caller anywhere, so `expire` was accepted,
/// validated, stored and ignored — silence *was* indistinguishable from
/// approval, which is the one thing the policy exists to prevent.
#[test]
fn an_unanswered_gate_expires_and_takes_its_dependents_with_it() {
    let mut f = Fixture::new();
    let (gate, ship) = gate_with(&mut f, TimeoutPolicy::Expire { after_ms: 1000 });

    let swept = f.exec.sweep_deadlines(&f.graph, Timestamp(f.clock + 500)).unwrap();
    assert!(swept.is_empty(), "not yet past the deadline");

    let swept = f.exec.sweep_deadlines(&f.graph, Timestamp(f.clock + 5_000)).unwrap();
    assert_eq!(swept.timed_out, vec![gate.clone()]);

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&gate].state, NodeState::Failed);
    assert_eq!(
        state.nodes[&ship].state,
        NodeState::Skipped,
        "nothing downstream of an unanswered gate may run"
    );
}

#[test]
fn escalation_raises_the_ask_without_answering_it() {
    let mut f = Fixture::new();
    let (gate, ship) = gate_with(&mut f, TimeoutPolicy::Escalate { after_ms: 1000 });

    f.exec.sweep_deadlines(&f.graph, Timestamp(f.clock + 5_000)).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&gate].state, NodeState::Awaiting, "still a person's to answer");
    assert_eq!(state.nodes[&ship].state, NodeState::Blocked, "and still blocked");

    let view = f.exec.human_node(&f.graph, &gate).unwrap();
    assert!(
        view.escalated_after_ms.is_some_and(|ms| ms >= 1000),
        "an escalation nobody can see is the same as no escalation"
    );
}

/// The sweep runs on every read, so an escalation that re-fires appends an event
/// per `gr status` — unbounded log growth from doing nothing.
#[test]
fn escalation_fires_once_however_often_the_clock_is_read() {
    let mut f = Fixture::new();
    gate_with(&mut f, TimeoutPolicy::Escalate { after_ms: 1000 });

    let mut acted = 0;
    for i in 0..10 {
        acted += f
            .exec
            .sweep_deadlines(&f.graph, Timestamp(f.clock + 5_000 + i * 100))
            .unwrap()
            .timed_out
            .len();
    }
    assert_eq!(acted, 1, "escalation is a fact, not a repeated side effect");

    let escalations = f
        .exec
        .store_mut()
        .records(&f.graph)
        .unwrap()
        .iter()
        .filter(|r| matches!(r.event, Event::HumanEscalate { .. }))
        .count();
    assert_eq!(escalations, 1);
}

#[test]
fn a_wait_policy_never_times_out() {
    let mut f = Fixture::new();
    let (gate, _) = gate_with(&mut f, TimeoutPolicy::Wait);
    let swept = f.exec.sweep_deadlines(&f.graph, Timestamp(f.clock + 100_000_000)).unwrap();
    assert!(swept.is_empty(), "`wait` means wait");
    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&gate].state, NodeState::Awaiting);
}

/// `sweep_leases` existed but was called only from one unit test, so in practice
/// a session that died holding a claim held it forever.
#[test]
fn a_lapsed_lease_is_revoked_by_the_same_sweep() {
    let mut f = Fixture::new();
    let node = f.add(f.node("work"));
    f.run();

    let at = f.tick();
    f.exec.claim(&f.graph, &node, &s("gone"), &[], 1_000, at).unwrap();

    let swept = f.exec.sweep_deadlines(&f.graph, Timestamp(f.clock + 500)).unwrap();
    assert!(swept.is_empty(), "the lease is still good");

    let swept = f.exec.sweep_deadlines(&f.graph, Timestamp(f.clock + 5_000)).unwrap();
    assert_eq!(swept.revoked.len(), 1);
    assert_eq!(swept.revoked[0].node, node);

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert!(!state.active_claims.contains_key(&node), "the node is free to reclaim");
    assert_eq!(state.nodes[&node].state, NodeState::Ready);
}

fn escalating_node(f: &mut Fixture) -> (NodeId, NodeId) {
    let mut risky = f.node("risky");
    risky.retry = RetryPolicy::Escalate;
    risky.outputs = json!({"type":"object","properties":{"v":{"type":"string"}},"required":["v"]});
    let risky_id = f.add(risky);

    let mut after = f.node("after");
    after.needs = vec![risky_id.clone()];
    after.state = NodeState::Pending;
    let after_id = f.add(after);

    f.run();
    (risky_id, after_id)
}

/// `retry: escalate` set the node to `awaiting` without creating a pending ask:
/// invisible to `gr awaiting`, answerable with any invented string, and blocking
/// its dependents forever.
#[test]
fn an_escalated_failure_becomes_a_question_someone_can_actually_answer() {
    let mut f = Fixture::new();
    let (risky, _) = escalating_node(&mut f);

    let at = f.tick();
    f.exec.claim(&f.graph, &risky, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec.fail(&f.graph, &risky, "the API key is not valid", false, at).unwrap();

    let pending = f.exec.awaiting(&f.graph).unwrap();
    assert_eq!(pending.len(), 1, "an escalated failure must show up in `awaiting`");
    assert!(pending[0].ask.contains("the API key is not valid"), "{}", pending[0].ask);
    assert_eq!(pending[0].options, vec!["retry".to_string(), "abandon".to_string()]);

    let at = f.tick();
    let e = f.exec.resolve(&f.graph, &risky, "mels", "whatever", None, at).unwrap_err();
    let ExecError::Refused(r) = e else { panic!("an invented answer must be refused") };
    assert_eq!(r.code, RefusalCode::NotFound);
}

#[test]
fn retrying_an_escalated_failure_runs_the_work_again() {
    let mut f = Fixture::new();
    let (risky, after) = escalating_node(&mut f);

    let at = f.tick();
    f.exec.claim(&f.graph, &risky, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec.fail(&f.graph, &risky, "transient", false, at).unwrap();
    let at = f.tick();
    f.exec.resolve(&f.graph, &risky, "mels", "retry", None, at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&risky].state, NodeState::Ready, "the work is claimable again");
    assert_eq!(state.nodes[&risky].failure, None);
    assert_eq!(
        state.nodes[&after].state,
        NodeState::Pending,
        "and its dependent has not been released on an output that does not exist"
    );
}

#[test]
fn abandoning_an_escalated_failure_stops_the_branch() {
    let mut f = Fixture::new();
    let (risky, after) = escalating_node(&mut f);

    let at = f.tick();
    f.exec.claim(&f.graph, &risky, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec.fail(&f.graph, &risky, "permission denied", false, at).unwrap();
    let at = f.tick();
    f.exec.resolve(&f.graph, &risky, "mels", "abandon", None, at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&risky].state, NodeState::Failed);
    assert!(state.nodes[&risky]
        .failure
        .as_deref()
        .is_some_and(|r| r.contains("permission denied")));
    assert_eq!(state.nodes[&after].state, NodeState::Skipped);
}

#[test]
fn a_bounded_retry_returns_the_node_until_the_budget_runs_out() {
    let mut f = Fixture::new();
    let mut flaky = f.node("flaky");
    flaky.retry = RetryPolicy::Bounded { attempts: 2 };
    let flaky_id = f.add(flaky);
    let mut after = f.node("after");
    after.needs = vec![flaky_id.clone()];
    after.state = NodeState::Pending;
    let after_id = f.add(after);
    let sibling = f.add(f.node("sibling"));
    f.run();

    for expected in [NodeState::Ready, NodeState::Ready, NodeState::Failed] {
        let at = f.tick();
        f.exec.claim(&f.graph, &flaky_id, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
        let at = f.tick();
        f.exec.fail(&f.graph, &flaky_id, "503", true, at).unwrap();
        let state = f.exec.store_mut().state(&f.graph).unwrap();
        assert_eq!(state.nodes[&flaky_id].state, expected);
    }

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(state.nodes[&after_id].state, NodeState::Skipped, "the blast radius is the branch");
    assert_eq!(state.nodes[&sibling].state, NodeState::Ready, "and only the branch");
}

/// The fan-out path was unusable: `expand` writes `$.urls[0]` bindings and the
/// value resolver understood only `[*]`, so no child could ever be claimed.
#[test]
fn a_fan_out_runs_end_to_end_and_the_parent_collects_it() {
    let mut f = Fixture::new();

    let mut gather = f.node("gather");
    gather.outputs = json!({
        "type":"object",
        "properties":{"urls":{"type":"array","items":{"type":"string"}}},
        "required":["urls"]
    });
    let gather_id = f.add(gather);

    let mut each = f.node("check-each");
    each.needs = vec![gather_id.clone()];
    each.state = NodeState::Pending;
    each.capability = "agent".into();
    each.inputs =
        json!({"type":"object","properties":{"url":{"type":"string"}},"required":["url"]});
    each.outputs =
        json!({"type":"object","properties":{"verdict":{"type":"string"}},"required":["verdict"]});
    each.for_each = Some(graphene_core::node::ForEach {
        over: Binding { from: gather_id.clone(), select: "$.urls".into(), into: "url".into() },
        max: 5,
        as_field: "url".into(),
    });
    let each_id = f.add(each);
    f.run();

    let at = f.tick();
    f.exec.claim(&f.graph, &gather_id, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec.done(&f.graph, &gather_id, json!({"urls":["a","b","c"]}), Spend::default(), at).unwrap();

    let at = f.tick();
    let children = f.exec.expand(&f.graph, &each_id, at).unwrap();
    assert_eq!(children.len(), 3);

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_ne!(
        state.nodes[&each_id].state,
        NodeState::Ready,
        "the template is not work once it has expanded"
    );

    for (i, child) in children.iter().enumerate() {
        let resolved = graphene_exec::resolve_inputs(&state, &state.nodes[child]).unwrap();
        assert_eq!(resolved["url"], json!(["a", "b", "c"][i]), "each child gets its own item");
    }

    for (i, child) in children.iter().enumerate() {
        let at = f.tick();
        f.exec.claim(&f.graph, child, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
        let at = f.tick();
        f.exec
            .done(&f.graph, child, json!({ "verdict": format!("v{i}") }), Spend::default(), at)
            .unwrap();
    }

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    let parent = &state.nodes[&each_id];
    assert_eq!(parent.state, NodeState::Done, "the parent completes from its children");
    assert_eq!(
        parent.output,
        Some(json!([{"verdict":"v0"},{"verdict":"v1"},{"verdict":"v2"}])),
        "and its output is the collection nothing else could produce"
    );

    let picked = graphene_check::schema::select(parent.output.as_ref().unwrap(), "$[*].verdict");
    assert_eq!(picked, Some(json!(["v0", "v1", "v2"])));
}

#[test]
fn expanding_past_the_declared_bound_is_refused() {
    let mut f = Fixture::new();
    let mut gather = f.node("gather");
    gather.outputs = json!({
        "type":"object",
        "properties":{"urls":{"type":"array","items":{"type":"string"}}},
        "required":["urls"]
    });
    let gather_id = f.add(gather);

    let mut each = f.node("each");
    each.needs = vec![gather_id.clone()];
    each.state = NodeState::Pending;
    each.for_each = Some(graphene_core::node::ForEach {
        over: Binding { from: gather_id.clone(), select: "$.urls".into(), into: "u".into() },
        max: 2,
        as_field: "u".into(),
    });
    let each_id = f.add(each);
    f.run();

    let at = f.tick();
    f.exec.claim(&f.graph, &gather_id, &s("s1"), &[], DEFAULT_LEASE_MS, at).unwrap();
    let at = f.tick();
    f.exec.done(&f.graph, &gather_id, json!({"urls":["a","b","c"]}), Spend::default(), at).unwrap();

    let at = f.tick();
    let e = f.exec.expand(&f.graph, &each_id, at).unwrap_err();
    let ExecError::Refused(r) = e else { panic!("expected a refusal, got {e:?}") };
    assert_eq!(r.code, RefusalCode::LimitExceeded);
}

/// `renew`, `release` and `checkpoint` reported `unknown node` for a node that
/// existed but was not held — a hard error with no suggestion, escaping the
/// contract that every refusal names what to do instead. `checkpoint` checked
/// nothing at all and would write to a node that did not exist.
#[test]
fn acting_on_a_node_you_do_not_hold_is_a_refusal_not_an_error() {
    let mut f = Fixture::new();
    let node = f.add(f.node("work"));
    f.run();

    let ghost = NodeId::for_name(&f.graph, "no-such-node");
    for (label, e) in [
        ("renew", f.exec.renew(&f.graph, &node, 60_000, f.now()).err()),
        ("release", f.exec.release(&f.graph, &node, None, f.now()).err()),
        ("checkpoint", f.exec.checkpoint(&f.graph, &node, json!({}), f.now()).err()),
    ] {
        let Some(ExecError::Refused(r)) = e else { panic!("{label} must refuse") };
        assert_eq!(r.code, RefusalCode::ClaimRevoked, "{label}");
        assert_eq!(r.suggestion, Suggestion::RebindAndReclaim, "{label}");
    }

    let Some(ExecError::Refused(r)) = f.exec.checkpoint(&f.graph, &ghost, json!({}), f.now()).err()
    else {
        panic!("a checkpoint against a node that does not exist must refuse")
    };
    assert_eq!(r.code, RefusalCode::NotFound);
}

#[test]
fn a_checkpoint_renews_the_lease_without_undoing_progress() {
    let mut f = Fixture::new();
    let node = f.add(f.node("long"));
    f.run();

    let at = f.tick();
    f.exec.claim(&f.graph, &node, &s("s1"), &[], 1_000, at).unwrap();
    let first =
        f.exec.store_mut().state(&f.graph).unwrap().claims.values().next().unwrap().expires_at;

    let at = f.tick();
    f.exec.checkpoint(&f.graph, &node, json!({"at": "step 2"}), at).unwrap();

    let state = f.exec.store_mut().state(&f.graph).unwrap();
    assert_eq!(
        state.nodes[&node].state,
        NodeState::Running,
        "reporting progress must not walk the node back to `claimed`"
    );
    assert_eq!(state.nodes[&node].checkpoints.len(), 1);
    let renewed = state.claims.values().next().unwrap().expires_at;
    assert!(
        renewed.0 .0 > first.0 .0,
        "a node that checkpoints should not be preempted for taking its time"
    );
}
