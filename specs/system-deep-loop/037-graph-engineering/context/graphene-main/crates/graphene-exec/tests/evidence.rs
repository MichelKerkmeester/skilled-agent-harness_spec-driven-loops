//! Spec 09 §7: the signals only matter if they fire when the thing they name is
//! actually happening, and stay quiet when it is not.

use graphene_core::budget::{Budget, Limits, Spend};
use graphene_core::event::Event;
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, GraphId, NodeId};
use graphene_core::node::{HumanAsk, Node, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy};
use graphene_store::Store;
use serde_json::json;

struct Bench {
    store: Store,
    seq: i64,
}

impl Bench {
    fn new() -> Self {
        Bench { store: Store::open_in_memory().unwrap(), seq: 0 }
    }

    fn tick(&mut self) -> graphene_core::time::Timestamp {
        self.seq += 1;
        graphene_core::time::Timestamp(self.seq)
    }

    fn graph(&mut self, name: &str) -> GraphId {
        let g = GraphId::from_seed(name);
        let at = self.tick();
        self.store
            .append(
                &g,
                Actor::System,
                at,
                Event::GraphCreate {
                    seed: name.into(),
                    title: name.into(),
                    description: String::new(),
                    task: "t".into(),
                    budget: Budget::UNLIMITED,
                    limits: Limits::default(),
                    tags: vec![],
                    parent: None,
                },
            )
            .unwrap();
        g
    }

    fn node(&mut self, g: &GraphId, name: &str, capability: &str, spec: NodeSpec) -> NodeId {
        let id = NodeId::for_name(g, name);
        let at = self.tick();
        self.store
            .append(
                g,
                Actor::System,
                at,
                Event::NodeAdd {
                    node: Box::new(Node {
                        id: id.clone(),
                        graph: g.clone(),
                        name: name.into(),
                        spec,
                        capability: capability.into(),
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
                    }),
                },
            )
            .unwrap();
        id
    }

    fn gate(&mut self, g: &GraphId, name: &str, ask: &str, answer: &str, proceeds: bool) {
        let target = self.node(
            g,
            &format!("{name}-target"),
            "agent",
            NodeSpec::Agent { prompt: "p".into(), system: None },
        );
        let consequence = vec![
            ("go".to_string(), if proceeds { vec![target.clone()] } else { vec![] }),
            ("stop".to_string(), vec![]),
        ];
        let id = self.node(
            g,
            name,
            "human",
            NodeSpec::Human(HumanAsk {
                ask: ask.into(),
                options: vec!["go".into(), "stop".into()],
                context: vec![],
                consequence,
                on_timeout: TimeoutPolicy::Wait,
            }),
        );
        let at = self.tick();
        self.store
            .append(
                g,
                Actor::System,
                at,
                Event::HumanResolve {
                    node: id,
                    by: "mels".into(),
                    choice: answer.into(),
                    input: None,
                },
            )
            .unwrap();
    }

    fn fail(&mut self, g: &GraphId, name: &str, capability: &str) {
        let id =
            self.node(g, name, capability, NodeSpec::Agent { prompt: "p".into(), system: None });
        let at = self.tick();
        self.store
            .append(
                g,
                Actor::System,
                at,
                Event::NodeFail { node: id, reason: "boom".into(), retryable: false },
            )
            .unwrap();
    }

    /// Walk a graph all the way to `done` the way the lifecycle requires,
    /// rather than asserting a transition the product would refuse.
    fn complete(&mut self, g: &GraphId) {
        let review = self.node(
            g,
            "review-granularity",
            "review",
            NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() },
        );
        let work =
            self.node(g, "work", "agent", NodeSpec::Agent { prompt: "p".into(), system: None });
        let at = self.tick();
        self.store
            .append(
                g,
                Actor::System,
                at,
                Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
            )
            .unwrap();
        let at = self.tick();
        self.store
            .append(
                g,
                Actor::System,
                at,
                Event::NodeDone { node: review, output: json!({}), spend: Spend::default() },
            )
            .unwrap();
        for to in
            [GraphState::Checked, GraphState::Reviewed, GraphState::Approved, GraphState::Running]
        {
            let at = self.tick();
            self.store
                .append(g, Actor::System, at, Event::GraphState { to, reason: None })
                .unwrap();
        }
        let at = self.tick();
        self.store
            .append(
                g,
                Actor::System,
                at,
                Event::NodeDone { node: work, output: json!({}), spend: Spend::default() },
            )
            .unwrap();
        let at = self.tick();
        self.store
            .append(g, Actor::System, at, Event::GraphState { to: GraphState::Done, reason: None })
            .unwrap();
    }

    fn evidence(&self) -> graphene_exec::evidence::Evidence {
        graphene_exec::evidence::gather(&self.store).unwrap()
    }
}

#[test]
fn a_gate_nobody_ever_declines_is_reported_as_one() {
    let mut b = Bench::new();
    for i in 0..4 {
        let g = b.graph(&format!("g{i}"));
        b.gate(&g, "approve", "Ship it?", "go", true);
    }

    let e = b.evidence();
    let gate = e.gates.iter().find(|g| g.ask == "Ship it?").expect("the gate is counted");
    assert_eq!(gate.asked, 4);
    assert_eq!(gate.proceeded, 4);
    assert_eq!(gate.always_proceeds, Some(true));
    assert!(
        e.notes.iter().any(|n| n.contains("Ship it?") && n.contains("not deciding anything")),
        "{:?}",
        e.notes
    );
}

/// One answer is not a pattern. Reporting it as one invites acting on noise.
#[test]
fn a_gate_answered_once_is_not_yet_a_pattern() {
    let mut b = Bench::new();
    let g = b.graph("only");
    b.gate(&g, "approve", "Ship it?", "go", true);

    let e = b.evidence();
    let gate = e.gates.iter().find(|g| g.ask == "Ship it?").unwrap();
    assert_eq!(gate.always_proceeds, None);
    assert!(!e.notes.iter().any(|n| n.contains("not deciding anything")), "{:?}", e.notes);
}

#[test]
fn a_gate_that_is_sometimes_declined_is_doing_its_job() {
    let mut b = Bench::new();
    for (i, answer) in ["go", "go", "stop", "go"].iter().enumerate() {
        let g = b.graph(&format!("g{i}"));
        b.gate(&g, "approve", "Ship it?", answer, true);
    }

    let e = b.evidence();
    let gate = e.gates.iter().find(|g| g.ask == "Ship it?").unwrap();
    assert_eq!(gate.always_proceeds, Some(false));
    assert!(!e.notes.iter().any(|n| n.contains("not deciding anything")), "{:?}", e.notes);
}

#[test]
fn the_capability_that_fails_most_is_named() {
    let mut b = Bench::new();
    for i in 0..4 {
        let g = b.graph(&format!("g{i}"));
        b.fail(&g, "flaky", "read_zendesk");
    }
    let g = b.graph("other");
    b.fail(&g, "once", "read_web");

    let e = b.evidence();
    assert_eq!(e.failures_by_capability.first().map(|c| c.name.as_str()), Some("read_zendesk"));
    assert_eq!(e.failures_by_capability[0].count, 4);
    assert!(
        e.notes.iter().any(|n| n.contains("read_zendesk") && n.contains("most failures")),
        "{:?}",
        e.notes
    );
}

#[test]
fn a_thin_corpus_says_so_rather_than_pretending() {
    let mut b = Bench::new();
    b.graph("one");
    let e = b.evidence();
    assert_eq!(e.graphs, 1);
    assert!(e.notes.iter().any(|n| n.contains("not yet evidence")), "{:?}", e.notes);
}

#[test]
fn a_corpus_with_nothing_wrong_says_that_too() {
    let mut b = Bench::new();
    for i in 0..6 {
        let g = b.graph(&format!("g{i}"));
        b.gate(&g, "approve", "Ship it?", if i % 2 == 0 { "go" } else { "stop" }, true);
    }
    let e = b.evidence();
    assert_eq!(e.notes.len(), 1, "{:?}", e.notes);
    assert!(e.notes[0].contains("not visibly wrong"), "{:?}", e.notes);
}

#[test]
fn cancelled_and_completed_graphs_are_counted_apart() {
    let mut b = Bench::new();
    let done = b.graph("done");
    b.complete(&done);

    let cancelled = b.graph("cancelled");
    let at = b.tick();
    b.store
        .append(
            &cancelled,
            Actor::System,
            at,
            Event::GraphState { to: GraphState::Cancelled, reason: Some("not needed".into()) },
        )
        .unwrap();

    let e = b.evidence();
    assert_eq!(e.graphs_completed, 1);
    assert_eq!(e.graphs_cancelled, 1);
}
