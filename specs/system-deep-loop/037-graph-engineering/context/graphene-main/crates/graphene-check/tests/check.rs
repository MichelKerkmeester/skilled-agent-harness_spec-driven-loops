use graphene_check::{check, Capabilities, CapabilityRegistry, Code, Report};
use graphene_core::budget::{Budget, Limits, Spend};
use graphene_core::fold::State;
use graphene_core::graph::{Graph, GraphState};
use graphene_core::id::{GraphId, NodeId};
use graphene_core::node::{
    Binding, ForEach, HumanAsk, Node, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy,
};
use graphene_core::time::{Seq, Timestamp};
use serde_json::{json, Value};

struct Plan {
    graph: GraphId,
    state: State,
}

impl Plan {
    fn new() -> Self {
        let graph = GraphId::from_seed("check");
        let mut state = State::default();
        state.graph = Some(Graph {
            id: graph.clone(),
            title: "t".into(),
            description: String::new(),
            task: "task".into(),
            state: GraphState::Draft,
            parent: None,
            budget: Budget::UNLIMITED,
            spend: Spend::default(),
            limits: Limits::default(),
            tags: vec![],
            created_at: Timestamp(0),
            updated_at: Timestamp(0),
            completed_at: None,
            requested_by: None,
            created_seq: Seq(1),
        });
        Plan { graph, state }
    }

    fn limits(mut self, f: impl FnOnce(&mut Limits)) -> Self {
        f(&mut self.state.graph.as_mut().unwrap().limits);
        self
    }

    fn budget(mut self, b: Budget) -> Self {
        self.state.graph.as_mut().unwrap().budget = b;
        self
    }

    fn add(mut self, n: Node) -> Self {
        for need in &n.needs {
            self.state
                .edges
                .insert((need.clone(), n.id.clone()), graphene_core::node::EdgeKind::Deterministic);
        }
        self.state.nodes.insert(n.id.clone(), n);
        self
    }

    fn node(&self, name: &str) -> NodeBuilder {
        NodeBuilder {
            graph: self.graph.clone(),
            name: name.to_string(),
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
        }
    }

    fn run(&self) -> Report {
        check(&self.state, &Capabilities::default())
    }

    fn run_with(&self, caps: &Capabilities) -> Report {
        check(&self.state, caps)
    }
}

struct NodeBuilder {
    graph: GraphId,
    name: String,
    spec: NodeSpec,
    capability: String,
    inputs: Value,
    outputs: Value,
    bindings: Vec<Binding>,
    needs: Vec<NodeId>,
    for_each: Option<ForEach>,
    budget: Budget,
    retry: RetryPolicy,
    idempotency: Option<String>,
    writes: Vec<String>,
}

impl NodeBuilder {
    fn spec(mut self, s: NodeSpec) -> Self {
        self.spec = s;
        self
    }
    fn cap(mut self, c: &str) -> Self {
        self.capability = c.into();
        self
    }
    fn inputs(mut self, v: Value) -> Self {
        self.inputs = v;
        self
    }
    fn outputs(mut self, v: Value) -> Self {
        self.outputs = v;
        self
    }
    fn needs(mut self, n: &NodeId) -> Self {
        self.needs.push(n.clone());
        self
    }
    fn bind(mut self, from: &NodeId, select: &str, into: &str) -> Self {
        self.bindings.push(Binding {
            from: from.clone(),
            select: select.into(),
            into: into.into(),
        });
        self
    }
    fn for_each(mut self, from: &NodeId, select: &str, field: &str, max: u32) -> Self {
        self.for_each = Some(ForEach {
            over: Binding { from: from.clone(), select: select.into(), into: field.into() },
            max,
            as_field: field.into(),
        });
        self
    }
    fn budget(mut self, b: Budget) -> Self {
        self.budget = b;
        self
    }
    fn retry(mut self, r: RetryPolicy) -> Self {
        self.retry = r;
        self
    }
    fn idempotency(mut self, k: &str) -> Self {
        self.idempotency = Some(k.into());
        self
    }
    fn writes(mut self, a: &str) -> Self {
        self.writes.push(a.into());
        self
    }
    fn id(&self) -> NodeId {
        NodeId::for_name(&self.graph, &self.name)
    }
    fn build(self) -> Node {
        Node {
            id: NodeId::for_name(&self.graph, &self.name),
            graph: self.graph,
            name: self.name,
            spec: self.spec,
            capability: self.capability,
            inputs: self.inputs,
            outputs: self.outputs,
            bindings: self.bindings,
            needs: self.needs,
            for_each: self.for_each,
            budget: self.budget,
            retry: self.retry,
            idempotency: self.idempotency,
            writes: self.writes,
            state: NodeState::Pending,
            claim: None,
            output: None,
            checkpoints: vec![],
            attempts: 0,
            spend: Spend::default(),
            parent: None,
            failure: None,
        }
    }
}

fn human(options: &[&str], on_timeout: TimeoutPolicy) -> NodeSpec {
    NodeSpec::Human(HumanAsk {
        ask: "approve?".into(),
        options: options.iter().map(|s| s.to_string()).collect(),
        context: vec![],
        consequence: vec![],
        on_timeout,
    })
}

fn codes(r: &Report) -> Vec<Code> {
    r.errors.iter().map(|f| f.code).collect()
}

fn has(r: &Report, c: Code) -> bool {
    codes(r).contains(&c)
}

// ---------------------------------------------------------------- the happy path

#[test]
fn a_well_formed_plan_passes() {
    let p = Plan::new();
    let fetch = p.node("fetch")
        .outputs(json!({"type":"object","properties":{"rows":{"type":"array","items":{"type":"string"}}},"required":["rows"]}));
    let fetch_id = fetch.id();
    let score = p
        .node("score")
        .inputs(json!({"type":"object","properties":{"rows":{"type":"array","items":{"type":"string"}}},"required":["rows"]}))
        .outputs(json!({"type":"object","properties":{"risk":{"type":"number"}},"required":["risk"]}))
        .needs(&fetch_id)
        .bind(&fetch_id, "$.rows", "rows");

    let r = p.add(fetch.build()).add(score.build()).run();
    assert!(r.ok, "expected a clean plan, got {:?}", r.errors);
}

// ------------------------------------------------------------------- structure

#[test]
fn s1_cycles_are_caught() {
    let p = Plan::new();
    let a_id = NodeId::for_name(&p.graph, "a");
    let b_id = NodeId::for_name(&p.graph, "b");
    let a = p
        .node("a")
        .needs(&b_id)
        .bind(&b_id, "$", "in")
        .inputs(json!({"type":"object","properties":{"in":{}}}));
    let b = p
        .node("b")
        .needs(&a_id)
        .bind(&a_id, "$", "in")
        .inputs(json!({"type":"object","properties":{"in":{}}}));

    let r = p.add(a.build()).add(b.build()).run();
    assert!(has(&r, Code::Cycle));
}

#[test]
fn s2_an_unresolved_need_is_caught() {
    let p = Plan::new();
    let ghost = NodeId::for_name(&p.graph, "ghost");
    let n = p
        .node("real")
        .needs(&ghost)
        .bind(&ghost, "$", "in")
        .inputs(json!({"type":"object","properties":{"in":{}}}));
    let r = p.add(n.build()).run();
    assert!(has(&r, Code::UnresolvedNeed));
}

#[test]
fn s4_a_disconnected_node_is_caught() {
    let p = Plan::new();
    let a = p.node("a");
    let a_id = a.id();
    let b = p
        .node("b")
        .needs(&a_id)
        .bind(&a_id, "$", "in")
        .inputs(json!({"type":"object","properties":{"in":{}}}));
    let orphan = p.node("nobody-asked");

    let r = p.add(a.build()).add(b.build()).add(orphan.build()).run();
    assert!(has(&r, Code::OrphanNode));
}

#[test]
fn s5_a_required_input_that_nothing_binds_is_caught() {
    let p = Plan::new();
    let n = p.node("needs-input").inputs(json!({
        "type":"object","properties":{"customers":{"type":"array"}},"required":["customers"]
    }));
    let r = p.add(n.build()).run();
    assert!(has(&r, Code::UnboundInput));
}

#[test]
fn s6_a_select_path_the_source_does_not_provide_is_caught() {
    let p = Plan::new();
    let src = p.node("src").outputs(json!({"type":"object","properties":{"a":{"type":"string"}}}));
    let src_id = src.id();
    let dst = p
        .node("dst")
        .inputs(json!({"type":"object","properties":{"v":{"type":"string"}}}))
        .needs(&src_id)
        .bind(&src_id, "$.does_not_exist", "v");

    let r = p.add(src.build()).add(dst.build()).run();
    assert!(has(&r, Code::BadSelectPath));
}

#[test]
fn s7_a_type_mismatch_across_a_binding_is_caught() {
    let p = Plan::new();
    let src = p
        .node("src")
        .outputs(json!({"type":"object","properties":{"n":{"type":"string"}},"required":["n"]}));
    let src_id = src.id();
    let dst = p
        .node("dst")
        .inputs(json!({"type":"object","properties":{"n":{"type":"number"}},"required":["n"]}))
        .needs(&src_id)
        .bind(&src_id, "$.n", "n");

    let r = p.add(src.build()).add(dst.build()).run();
    assert!(has(&r, Code::TypeMismatch));
}

#[test]
fn s8_a_fake_edge_is_a_declaration_contradiction_not_a_guess() {
    let p = Plan::new();
    let summarize = p
        .node("summarize")
        .outputs(json!({"type":"object","properties":{"text":{"type":"string"}}}));
    let calendar = p.node("check-calendar").outputs(json!({"type":"object"}));
    let summarize_id = summarize.id();
    let calendar_id = calendar.id();

    let report = p
        .node("report")
        .inputs(json!({"type":"object","properties":{"text":{"type":"string"}}}))
        .needs(&summarize_id)
        .needs(&calendar_id)
        .bind(&summarize_id, "$.text", "text");

    let r = p.add(summarize.build()).add(calendar.build()).add(report.build()).run();
    assert!(has(&r, Code::FakeEdge));

    let f = r.errors.iter().find(|f| f.code == Code::FakeEdge).unwrap();
    assert!(f.detail.contains("check-calendar"));
    assert!(f.fix_hint.contains("parallel"), "the hint names the actual remedy");
}

#[test]
fn an_unverifiable_schema_is_refused_rather_than_skipped() {
    let p = Plan::new();
    let n = p.node("clever").outputs(json!({"anyOf":[{"type":"string"},{"type":"number"}]}));
    let r = p.add(n.build()).run();
    assert!(has(&r, Code::UnsupportedSchema));
}

// ----------------------------------------------------------------- capability

#[test]
fn c1_an_unregistered_capability_is_caught() {
    let p = Plan::new();
    let n = p.node("mystery").cap("launch_missiles");
    let r = p.add(n.build()).run();
    assert!(has(&r, Code::UnknownCapability));
}

#[test]
fn c2_an_irreversible_capability_with_no_gate_on_the_path_is_caught() {
    let p = Plan::new();
    let draft =
        p.node("draft").outputs(json!({"type":"object","properties":{"body":{"type":"string"}}}));
    let draft_id = draft.id();
    let send = p
        .node("send")
        .cap("send_email")
        .inputs(json!({"type":"object","properties":{"body":{"type":"string"}}}))
        .needs(&draft_id)
        .bind(&draft_id, "$.body", "body");

    let r = p.add(draft.build()).add(send.build()).run();
    assert!(has(&r, Code::UngatedCapability));
    let f = r.errors.iter().find(|f| f.code == Code::UngatedCapability).unwrap();
    assert!(f.detail.contains("draft"), "the unguarded path is named: {}", f.detail);
}

#[test]
fn c2_a_human_gate_on_the_path_satisfies_the_check() {
    let p = Plan::new();
    let draft =
        p.node("draft").outputs(json!({"type":"object","properties":{"body":{"type":"string"}}}));
    let draft_id = draft.id();
    let gate = p
        .node("approve")
        .cap("human")
        .spec(human(&["approve", "reject"], TimeoutPolicy::Escalate { after_ms: 86_400_000 }))
        .inputs(json!({"type":"object","properties":{"body":{"type":"string"}}}))
        .outputs(json!({"type":"object","properties":{"choice":{"type":"string"}},"required":["choice"]}))
        .needs(&draft_id)
        .bind(&draft_id, "$.body", "body");
    let gate_id = gate.id();
    let send = p
        .node("send")
        .cap("send_email")
        .inputs(json!({"type":"object","properties":{"choice":{"type":"string"}}}))
        .needs(&gate_id)
        .bind(&gate_id, "$.choice", "choice");

    let r = p.add(draft.build()).add(gate.build()).add(send.build()).run();
    assert!(!has(&r, Code::UngatedCapability), "{:?}", r.errors);
}

#[test]
fn c3_a_human_node_may_not_hold_a_machine_capability() {
    let p = Plan::new();
    let n = p.node("approve").cap("send_email").spec(human(&["approve"], TimeoutPolicy::Wait));
    let r = p.add(n.build()).run();
    assert!(has(&r, Code::HumanNodeCapability));
}

#[test]
fn c4_a_merge_node_with_one_input_is_caught() {
    let p = Plan::new();
    let a = p.node("a").outputs(json!({"type":"object"}));
    let a_id = a.id();
    let m = p
        .node("merge")
        .cap("merge")
        .spec(NodeSpec::Merge { prompt: "m".into() })
        .inputs(json!({"type":"object","properties":{"x":{}}}))
        .needs(&a_id)
        .bind(&a_id, "$", "x");

    let r = p.add(a.build()).add(m.build()).run();
    assert!(has(&r, Code::MergeWithoutFanIn));
}

#[test]
fn c4_an_unowned_fan_in_is_a_warning() {
    let p = Plan::new();
    let a = p.node("a").outputs(json!({"type":"object"}));
    let b = p.node("b").outputs(json!({"type":"object"}));
    let (a_id, b_id) = (a.id(), b.id());
    let joiner = p
        .node("joiner")
        .inputs(json!({"type":"object","properties":{"x":{},"y":{}}}))
        .needs(&a_id)
        .needs(&b_id)
        .bind(&a_id, "$", "x")
        .bind(&b_id, "$", "y");

    let r = p.add(a.build()).add(b.build()).add(joiner.build()).run();
    assert!(r.ok, "a warning must not block");
    assert!(r.warnings.iter().any(|f| f.code == Code::FanInWithoutMerge));
    assert!(r.warnings[0].fix_hint.contains("17.2"), "the hint carries the evidence");
}

// --------------------------------------------------------------------- bounds

#[test]
fn b1_too_many_nodes_is_caught() {
    let mut p = Plan::new().limits(|l| l.max_nodes = 2);
    for i in 0..4 {
        let n = p.node(&format!("n{i}")).build();
        p = p.add(n);
    }
    assert!(has(&p.run(), Code::TooManyNodes));
}

#[test]
fn b2_an_over_deep_chain_is_caught() {
    let mut p = Plan::new().limits(|l| l.max_depth = 2);
    let mut prev: Option<NodeId> = None;
    for i in 0..5 {
        let mut nb = p.node(&format!("n{i}")).outputs(json!({"type":"object"}));
        if let Some(prev_id) = &prev {
            nb = nb
                .inputs(json!({"type":"object","properties":{"in":{}}}))
                .needs(prev_id)
                .bind(prev_id, "$", "in");
        }
        prev = Some(nb.id());
        p = p.add(nb.build());
    }
    assert!(has(&p.run(), Code::TooDeep));
}

#[test]
fn b3_an_unbounded_fan_out_is_rejected_at_authoring_time() {
    let p = Plan::new().limits(|l| l.max_for_each = 200);
    let list = p.node("list").outputs(json!({
        "type":"object","properties":{"rows":{"type":"array","items":{"type":"string"}}},"required":["rows"]
    }));
    let list_id = list.id();
    let each = p
        .node("per-row")
        .inputs(json!({"type":"object","properties":{"row":{"type":"string"}}}))
        .needs(&list_id)
        .for_each(&list_id, "$.rows", "row", 50_000);

    let r = p.add(list.build()).add(each.build()).run();
    assert!(has(&r, Code::ForEachUnbounded));
    let f = r.errors.iter().find(|f| f.code == Code::ForEachUnbounded).unwrap();
    assert!(f.fix_hint.contains("node 500"));
}

#[test]
fn b3_expanding_over_something_that_is_not_an_array_is_caught() {
    let p = Plan::new();
    let list =
        p.node("list").outputs(json!({"type":"object","properties":{"count":{"type":"number"}}}));
    let list_id = list.id();
    let each = p
        .node("per-row")
        .inputs(json!({"type":"object","properties":{"row":{}}}))
        .needs(&list_id)
        .for_each(&list_id, "$.count", "row", 10);

    assert!(has(&p.add(list.build()).add(each.build()).run(), Code::TypeMismatch));
}

#[test]
fn b4_an_unbounded_loop_is_caught() {
    let p = Plan::new().limits(|l| l.max_rounds = 3);
    let n = p.node("flaky").retry(RetryPolicy::Bounded { attempts: 99 }).idempotency("k");
    assert!(has(&p.add(n.build()).run(), Code::LoopUnbounded));
}

#[test]
fn b5_budget_overflow_fails_at_plan_time() {
    let p = Plan::new().budget(Budget::tokens(1_000));
    let a = p.node("a").budget(Budget::tokens(800));
    let b = p.node("b").budget(Budget::tokens(800));
    assert!(has(&p.add(a.build()).add(b.build()).run(), Code::BudgetOverflow));
}

#[test]
fn b5_an_undeclared_node_budget_warns_rather_than_blocks() {
    let p = Plan::new().budget(Budget::tokens(1_000));
    let n = p.node("unbounded");
    let r = p.add(n.build()).run();
    assert!(!has(&r, Code::BudgetOverflow), "an unknown sum is not a demonstrable overflow");
    assert!(
        r.warnings.iter().any(|f| f.code == Code::BudgetOverflow),
        "but it is worth saying — the ceiling only bites at claim time"
    );
}

#[test]
fn a_review_node_is_allowed_to_be_disconnected() {
    let p = Plan::new();
    let work = p.node("work");
    let review = p
        .node("review-granularity")
        .cap("review")
        .spec(NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() });

    let r = p.add(work.build()).add(review.build()).run();
    assert!(
        !has(&r, Code::OrphanNode),
        "a review node reviews the plan; it is not part of the work"
    );
}

// ---------------------------------------------------------------- determinism

#[test]
fn d1_a_node_without_an_output_schema_is_caught() {
    let p = Plan::new();
    let n = p.node("opaque").outputs(json!({}));
    let r = p.add(n.build()).run();
    assert!(has(&r, Code::MissingOutputSchema));
    let f = r.errors.iter().find(|f| f.code == Code::MissingOutputSchema).unwrap();
    assert!(f.fix_hint.contains("testable alone"));
}

#[test]
fn d2_a_retryable_node_without_an_idempotency_key_is_caught() {
    let p = Plan::new();
    let n = p.node("retries").retry(RetryPolicy::Bounded { attempts: 2 });
    assert!(has(&p.add(n.build()).run(), Code::MissingIdempotency));
}

#[test]
fn d4_a_human_node_with_no_options_is_caught() {
    let p = Plan::new();
    let n = p.node("ask").cap("human").spec(human(&[], TimeoutPolicy::Wait));
    assert!(has(&p.add(n.build()).run(), Code::MissingTimeoutPolicy));
}

#[test]
fn an_approval_that_waits_forever_is_warned_about() {
    let p = Plan::new();
    let n = p.node("approve").cap("human").spec(human(&["approve", "reject"], TimeoutPolicy::Wait));
    let r = p.add(n.build()).run();
    assert!(r.warnings.iter().any(|f| f.code == Code::MissingTimeoutPolicy));
}

// ---------------------------------------------------------------- concurrency

#[test]
fn x1_two_concurrent_writers_to_one_artifact_are_caught() {
    let p = Plan::new();
    let a = p.node("writer-a").writes("report.md");
    let b = p.node("writer-b").writes("report.md");
    let r = p.add(a.build()).add(b.build()).run();
    assert!(has(&r, Code::MultipleWriters));
}

#[test]
fn x1_sequenced_writers_to_one_artifact_are_fine() {
    let p = Plan::new();
    let a = p.node("first").writes("report.md").outputs(json!({"type":"object"}));
    let a_id = a.id();
    let b = p
        .node("second")
        .writes("report.md")
        .inputs(json!({"type":"object","properties":{"in":{}}}))
        .needs(&a_id)
        .bind(&a_id, "$", "in");

    let r = p.add(a.build()).add(b.build()).run();
    assert!(!has(&r, Code::MultipleWriters), "ordered writes are safe");
}

// ----------------------------------------------------------------- reporting

#[test]
fn every_error_carries_a_fix_hint() {
    let p = Plan::new();
    let ghost = NodeId::for_name(&p.graph, "ghost");
    let n = p
        .node("broken")
        .cap("nope")
        .outputs(json!({}))
        .needs(&ghost)
        .retry(RetryPolicy::Bounded { attempts: 0 });

    let r = p.add(n.build()).run();
    assert!(!r.errors.is_empty());
    for f in &r.errors {
        assert!(!f.fix_hint.is_empty(), "{:?} has no fix hint", f.code);
        assert!(!f.detail.is_empty(), "{:?} has no detail", f.code);
    }
}

#[test]
fn errors_block_and_warnings_do_not() {
    let p = Plan::new();
    let n = p.node("solo");
    assert!(p.add(n.build()).run().ok);

    let p2 = Plan::new();
    let bad = p2.node("bad").outputs(json!({}));
    assert!(!p2.add(bad.build()).run().ok);
}

#[test]
fn findings_are_ordered_deterministically() {
    let build = || {
        let p = Plan::new();
        let a = p.node("a").outputs(json!({})).cap("unknown-1");
        let b = p.node("b").outputs(json!({})).cap("unknown-2");
        p.add(a.build()).add(b.build()).run()
    };
    let first = build();
    for _ in 0..5 {
        assert_eq!(build(), first);
    }
}

#[test]
fn a_report_round_trips_as_json_with_kebab_case_codes() {
    let p = Plan::new();
    let n = p.node("x").outputs(json!({}));
    let r = p.add(n.build()).run();
    let s = serde_json::to_string(&r).unwrap();
    assert!(s.contains("missing-output-schema"));
    assert_eq!(serde_json::from_str::<Report>(&s).unwrap(), r);
}

#[test]
fn a_five_hundred_node_plan_checks_quickly() {
    let mut p = Plan::new().limits(|l| {
        l.max_nodes = 1000;
        l.max_depth = 1000;
    });
    let mut prev: Option<NodeId> = None;
    for i in 0..500 {
        let mut nb = p.node(&format!("n{i}")).outputs(json!({"type":"object"}));
        if let Some(prev_id) = &prev {
            nb = nb
                .inputs(json!({"type":"object","properties":{"in":{}}}))
                .needs(prev_id)
                .bind(prev_id, "$", "in");
        }
        prev = Some(nb.id());
        p = p.add(nb.build());
    }

    let start = std::time::Instant::now();
    let r = p.run();
    let elapsed = start.elapsed();

    assert!(r.ok, "{:?}", r.errors.first());
    assert!(
        elapsed.as_millis() < 500,
        "check took {elapsed:?}; it must be cheap enough to run after every edit"
    );
}

#[test]
fn a_declared_capability_satisfies_c1() {
    let registry = CapabilityRegistry {
        registered: ["read_zendesk".to_string()].into_iter().collect(),
        gated: Default::default(),
    };
    let p = Plan::new();
    let n = p.node("fetch").cap("read_zendesk");
    let r = p.add(n.build()).run_with(&registry.resolve());
    assert!(!has(&r, Code::UnknownCapability), "{:?}", r.errors);
}

#[test]
fn a_declared_gate_applies_to_a_declared_capability() {
    let registry = CapabilityRegistry {
        registered: ["issue_refund".to_string()].into_iter().collect(),
        gated: ["issue_refund".to_string()].into_iter().collect(),
    };
    let p = Plan::new();
    let n = p.node("refund").cap("issue_refund");
    let r = p.add(n.build()).run_with(&registry.resolve());
    assert!(has(&r, Code::UngatedCapability), "a declared gate must be enforced: {:?}", r.errors);
}

/// Registration must not become a supported way to delete a gate.
#[test]
fn registering_a_gated_capability_does_not_un_gate_it() {
    let registry = CapabilityRegistry {
        registered: graphene_check::BUILT_IN_GATED.iter().map(|s| s.to_string()).collect(),
        gated: Default::default(),
    };
    let caps = registry.resolve();

    for name in graphene_check::BUILT_IN_GATED {
        assert!(caps.gated.contains(name), "{name} was un-gated by registration");
    }

    let p = Plan::new();
    let draft =
        p.node("draft").outputs(json!({"type":"object","properties":{"body":{"type":"string"}}}));
    let draft_id = draft.id();
    let send = p
        .node("send")
        .cap("send_email")
        .inputs(json!({"type":"object","properties":{"body":{"type":"string"}}}))
        .needs(&draft_id)
        .bind(&draft_id, "$.body", "body");

    let r = p.add(draft.build()).add(send.build()).run_with(&caps);
    assert!(has(&r, Code::UngatedCapability), "the gate survived registration: {:?}", r.errors);

    assert_eq!(
        registry.redundant_gates().len(),
        graphene_check::BUILT_IN_GATED.len(),
        "the registry should report which of its declarations the built-in set already gates"
    );
}

/// C2 proves a gate is on the path. This proves the answer is load-bearing: a
/// human node whose every option releases the same dependents is decoration.
#[test]
fn a_human_node_must_say_what_each_answer_releases() {
    let p = Plan::new();
    let draft =
        p.node("draft").outputs(json!({"type":"object","properties":{"body":{"type":"string"}}}));
    let draft_id = draft.id();
    let gate = p
        .node("approve")
        .cap("human")
        .spec(human(&["approve", "reject"], TimeoutPolicy::Escalate { after_ms: 86_400_000 }))
        .inputs(json!({"type":"object","properties":{"body":{"type":"string"}}}))
        .outputs(json!({"type":"object","properties":{"choice":{"type":"string"}},"required":["choice"]}))
        .needs(&draft_id)
        .bind(&draft_id, "$.body", "body");
    let gate_id = gate.id();
    let send = p
        .node("send")
        .cap("send_email")
        .inputs(json!({"type":"object","properties":{"choice":{"type":"string"}}}))
        .needs(&gate_id)
        .bind(&gate_id, "$.choice", "choice");

    let r = p.add(draft.build()).add(gate.build()).add(send.build()).run();
    assert!(has(&r, Code::UngatedChoice), "{:?}", r.errors);
    let f = r.errors.iter().find(|f| f.code == Code::UngatedChoice).unwrap();
    assert!(f.detail.contains("approve") && f.detail.contains("reject"), "{}", f.detail);
}

#[test]
fn a_gate_that_declares_its_consequences_passes() {
    let p = Plan::new();
    let draft =
        p.node("draft").outputs(json!({"type":"object","properties":{"body":{"type":"string"}}}));
    let draft_id = draft.id();
    let send_id = NodeId::for_name(&p.graph, "send");

    let mut spec = human(&["approve", "reject"], TimeoutPolicy::Escalate { after_ms: 86_400_000 });
    if let NodeSpec::Human(h) = &mut spec {
        h.consequence = vec![("approve".into(), vec![send_id.clone()]), ("reject".into(), vec![])];
    }

    let gate = p
        .node("approve")
        .cap("human")
        .spec(spec)
        .inputs(json!({"type":"object","properties":{"body":{"type":"string"}}}))
        .outputs(json!({"type":"object","properties":{"choice":{"type":"string"}},"required":["choice"]}))
        .needs(&draft_id)
        .bind(&draft_id, "$.body", "body");
    let gate_id = gate.id();
    let send = p
        .node("send")
        .cap("send_email")
        .inputs(json!({"type":"object","properties":{"choice":{"type":"string"}}}))
        .needs(&gate_id)
        .bind(&gate_id, "$.choice", "choice");

    let r = p.add(draft.build()).add(gate.build()).add(send.build()).run();
    assert!(!has(&r, Code::UngatedChoice), "{:?}", r.errors);
    assert!(!has(&r, Code::UngatedCapability), "{:?}", r.errors);
}

/// A human node with no dependents gates nothing, so there is nothing to declare.
#[test]
fn a_terminal_question_needs_no_consequences() {
    let p = Plan::new();
    let ask = p
        .node("confirm")
        .cap("human")
        .spec(human(&["yes", "no"], TimeoutPolicy::Wait))
        .outputs(json!({"type":"object","properties":{"choice":{"type":"string"}},"required":["choice"]}));
    let r = p.add(ask.build()).run();
    assert!(!has(&r, Code::UngatedChoice), "{:?}", r.errors);
}
