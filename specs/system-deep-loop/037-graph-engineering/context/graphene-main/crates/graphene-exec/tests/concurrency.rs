//! Spec 10 §4 and §6: concurrency asserted by racing real OS threads against a
//! real SQLite file, not by reasoning about a mock.
//!
//! Each test opens one `Store` per thread against the same path, which is the
//! arrangement the product actually runs in: separate `gr` processes, no shared
//! memory, the database as the only synchroniser.

use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Barrier};

use graphene_core::belief::{Fidelity, Provenance, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Limits, Spend};
use graphene_core::event::Event;
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, GraphId, NodeId, SessionId};
use graphene_core::node::{Node, NodeSpec, NodeState, RetryPolicy};
use graphene_core::refusal::RefusalCode;
use graphene_core::time::{ObservedAt, Timestamp};
use graphene_exec::{ExecError, Executor, DEFAULT_LEASE_MS};
use graphene_store::Store;
use serde_json::json;

static NEXT: AtomicUsize = AtomicUsize::new(0);

struct Fixture {
    path: std::path::PathBuf,
    graph: GraphId,
    clock: i64,
}

fn tmp_store() -> std::path::PathBuf {
    let d = std::env::temp_dir().join(format!(
        "graphene-conc-{}-{}",
        std::process::id(),
        NEXT.fetch_add(1, Ordering::SeqCst)
    ));
    std::fs::create_dir_all(&d).unwrap();
    d.join("store.db")
}

impl Fixture {
    /// A running graph on disk, with `n` claimable nodes.
    fn running(n: usize) -> (Self, Vec<NodeId>) {
        let path = tmp_store();
        let graph = GraphId::from_seed("conc");
        let mut store = Store::open(&path).unwrap();
        let mut clock = 1_000i64;
        let mut tick = || {
            clock += 1;
            Timestamp(clock)
        };

        store
            .append(
                &graph,
                Actor::System,
                tick(),
                Event::GraphCreate {
                    seed: "conc".into(),
                    title: "t".into(),
                    description: String::new(),
                    task: "task".into(),
                    budget: Budget::UNLIMITED,
                    limits: Limits::default(),
                    tags: vec![],
                    parent: None,
                },
            )
            .unwrap();

        let mut ids = Vec::new();
        for i in 0..n {
            let name = format!("work{i}");
            let id = NodeId::for_name(&graph, &name);
            store
                .append(
                    &graph,
                    Actor::System,
                    tick(),
                    Event::NodeAdd {
                        node: Box::new(Node {
                            id: id.clone(),
                            graph: graph.clone(),
                            name,
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
                        }),
                    },
                )
                .unwrap();
            ids.push(id);
        }

        // A review node, so the lifecycle can reach `running` the way it does in
        // the product rather than by skipping the gate.
        let review_id = NodeId::for_name(&graph, "review-granularity");
        store
            .append(
                &graph,
                Actor::System,
                tick(),
                Event::NodeAdd {
                    node: Box::new(Node {
                        id: review_id.clone(),
                        graph: graph.clone(),
                        name: "review-granularity".into(),
                        spec: NodeSpec::Review { lens: "granularity".into(), prompt: "p".into() },
                        capability: "review".into(),
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

        store
            .append(
                &graph,
                Actor::System,
                tick(),
                Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] },
            )
            .unwrap();
        store
            .append(
                &graph,
                Actor::System,
                tick(),
                Event::NodeDone { node: review_id, output: json!({}), spend: Spend::default() },
            )
            .unwrap();
        for to in
            [GraphState::Checked, GraphState::Reviewed, GraphState::Approved, GraphState::Running]
        {
            store
                .append(&graph, Actor::System, tick(), Event::GraphState { to, reason: None })
                .unwrap();
        }

        (Fixture { path, graph, clock }, ids)
    }

    fn exec(&self) -> Executor {
        Executor::new(Store::open(&self.path).unwrap())
    }

    fn now(&self) -> Timestamp {
        Timestamp(self.clock + 100)
    }
}

/// The flagship concurrency claim: N sessions race for one node, exactly one
/// wins, and the losers get structured refusals rather than a lost update.
#[test]
fn exactly_one_of_many_racing_sessions_claims_a_node() {
    const RACERS: usize = 12;
    let (f, nodes) = Fixture::running(1);
    let node = nodes[0].clone();
    let barrier = Arc::new(Barrier::new(RACERS));
    let path = Arc::new(f.path.clone());
    let graph = Arc::new(f.graph.clone());
    let now = f.now();

    let handles: Vec<_> = (0..RACERS)
        .map(|i| {
            let barrier = Arc::clone(&barrier);
            let path = Arc::clone(&path);
            let graph = Arc::clone(&graph);
            let node = node.clone();
            std::thread::spawn(move || {
                let mut exec = Executor::new(Store::open(path.as_path()).unwrap());
                let session = SessionId(format!("racer{i}"));
                barrier.wait();
                exec.claim(&graph, &node, &session, &[], DEFAULT_LEASE_MS, now)
            })
        })
        .collect();

    let results: Vec<_> = handles.into_iter().map(|h| h.join().unwrap()).collect();
    let winners = results.iter().filter(|r| r.is_ok()).count();
    assert_eq!(winners, 1, "a node is held by one session or none");

    for r in results.iter().filter(|r| r.is_err()) {
        match r.as_ref().unwrap_err() {
            ExecError::Refused(refusal) => {
                assert_eq!(refusal.code, RefusalCode::AlreadyClaimed);
                assert!(
                    refusal.detail().and_then(|d| d.held_by.clone()).is_some(),
                    "a loser is told who holds it"
                );
            }
            other => panic!("a loser got an error rather than a refusal: {other:?}"),
        }
    }

    let state = f.exec().store().state(&f.graph).unwrap();
    assert_eq!(state.active_claims.len(), 1, "the store agrees there is one holder");
}

/// Many nodes, many racers: every node ends with exactly one holder and no
/// session holds a node another session also thinks it holds.
#[test]
fn concurrent_claims_across_many_nodes_never_double_book() {
    const NODES: usize = 8;
    const RACERS: usize = 6;
    let (f, nodes) = Fixture::running(NODES);
    let barrier = Arc::new(Barrier::new(RACERS));
    let path = Arc::new(f.path.clone());
    let graph = Arc::new(f.graph.clone());
    let now = f.now();

    let handles: Vec<_> = (0..RACERS)
        .map(|i| {
            let barrier = Arc::clone(&barrier);
            let path = Arc::clone(&path);
            let graph = Arc::clone(&graph);
            let nodes = nodes.clone();
            std::thread::spawn(move || {
                let mut exec = Executor::new(Store::open(path.as_path()).unwrap());
                let session = SessionId(format!("racer{i}"));
                barrier.wait();
                let mut mine = Vec::new();
                for n in &nodes {
                    if exec.claim(&graph, n, &session, &[], DEFAULT_LEASE_MS, now).is_ok() {
                        mine.push(n.clone());
                    }
                }
                mine
            })
        })
        .collect();

    let claimed: Vec<Vec<NodeId>> = handles.into_iter().map(|h| h.join().unwrap()).collect();
    let total: usize = claimed.iter().map(|c| c.len()).sum();
    assert_eq!(total, NODES, "every node claimed exactly once across all sessions");

    let mut seen = std::collections::BTreeSet::new();
    for set in &claimed {
        for n in set {
            assert!(seen.insert(n.clone()), "`{n}` was handed to two sessions");
        }
    }
}

/// Lease safety: once a claim is revoked, the holder's `done` is refused. The
/// work it did is not silently accepted into a node someone else now owns.
#[test]
fn done_is_refused_after_the_lease_is_revoked() {
    let (f, nodes) = Fixture::running(1);
    let node = nodes[0].clone();
    let mut exec = f.exec();

    exec.claim(&f.graph, &node, &SessionId("slow".into()), &[], 1_000, f.now()).unwrap();

    let swept = exec.sweep_deadlines(&f.graph, Timestamp(f.now().0 + 10_000)).unwrap();
    assert_eq!(swept.revoked.len(), 1);

    let e = exec
        .done(&f.graph, &node, json!({}), Spend::default(), Timestamp(f.now().0 + 10_001))
        .unwrap_err();
    let ExecError::Refused(r) = e else { panic!("expected a refusal") };
    assert_eq!(r.code, RefusalCode::ClaimRevoked);
}

/// After a revocation the node is claimable again, and a different session gets
/// it — a lapsed lease returns work to the pool rather than stranding it.
#[test]
fn a_revoked_node_returns_to_the_pool_for_another_session() {
    let (f, nodes) = Fixture::running(1);
    let node = nodes[0].clone();
    let mut exec = f.exec();

    exec.claim(&f.graph, &node, &SessionId("gone".into()), &[], 1_000, f.now()).unwrap();
    let later = Timestamp(f.now().0 + 10_000);
    exec.sweep_deadlines(&f.graph, later).unwrap();

    exec.claim(&f.graph, &node, &SessionId("next".into()), &[], DEFAULT_LEASE_MS, later)
        .expect("the node is free");

    let state = exec.store().state(&f.graph).unwrap();
    let holder =
        state.active_claims.get(&node).and_then(|c| state.claims.get(c)).map(|c| c.session.clone());
    assert_eq!(holder, Some(SessionId("next".into())));
}

/// Concurrent writers to the same graph must serialise: no lost events, and the
/// sequence has no gaps or duplicates.
#[test]
fn concurrent_writers_produce_a_gapless_sequence() {
    const WRITERS: usize = 8;
    const EACH: usize = 25;
    // One node, because a graph with nothing to run cannot reach `running` —
    // the lifecycle guard is right and this test is not about it.
    let (f, _) = Fixture::running(1);
    let barrier = Arc::new(Barrier::new(WRITERS));
    let path = Arc::new(f.path.clone());
    let graph = Arc::new(f.graph.clone());

    let handles: Vec<_> = (0..WRITERS)
        .map(|w| {
            let barrier = Arc::clone(&barrier);
            let path = Arc::clone(&path);
            let graph = Arc::clone(&graph);
            std::thread::spawn(move || {
                let mut store = Store::open(path.as_path()).unwrap();
                barrier.wait();
                for i in 0..EACH {
                    let content = format!("writer {w} claim {i}");
                    let src = SourceRef::new("gen");
                    let id =
                        BeliefId::for_content(&graph, &content, "tool-observation", &src.key());
                    store
                        .append(
                            &graph,
                            Actor::System,
                            Timestamp(5_000 + (w * EACH + i) as i64),
                            Event::BeliefAdd {
                                id,
                                provenance: Provenance::ToolObservation,
                                fidelity: Fidelity::Claimed,
                                content: content.clone(),
                                summary: content,
                                source: src,
                                observed_at: ObservedAt::observed(Timestamp(4_000)),
                                support_mode: SupportMode::All,
                                sensitivity: Default::default(),
                                edges: vec![],
                                produced_by: None,
                                scoped_to: None,
                            },
                        )
                        .expect("a concurrent append must not fail");
                }
            })
        })
        .collect();

    for h in handles {
        h.join().unwrap();
    }

    let store = Store::open(&f.path).unwrap();
    let records = store.records(&f.graph).unwrap();
    let seqs: Vec<u64> = records.iter().map(|r| r.seq.0).collect();
    let mut sorted = seqs.clone();
    sorted.sort_unstable();
    sorted.dedup();
    assert_eq!(seqs.len(), sorted.len(), "the log has duplicate sequence numbers");
    assert_eq!(seqs, sorted, "the log is not in sequence order");

    let state = store.state(&f.graph).unwrap();
    assert_eq!(state.beliefs.len(), WRITERS * EACH, "every concurrent write survived");
}

/// A premise dying under a holder must refuse that holder's next claim, and the
/// refusal must name what killed it — across processes, through the file.
#[test]
fn a_premise_invalidated_by_another_session_refuses_the_holders_reclaim() {
    let (f, nodes) = Fixture::running(2);
    let mut writer = f.exec();

    let content = "the migration ran";
    let src = SourceRef::new("db");
    let premise = BeliefId::for_content(&f.graph, content, "tool-observation", &src.key());
    writer
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            f.now(),
            Event::BeliefAdd {
                id: premise.clone(),
                provenance: Provenance::ToolObservation,
                fidelity: Fidelity::Claimed,
                content: content.into(),
                summary: content.into(),
                source: src,
                observed_at: ObservedAt::observed(Timestamp(900)),
                support_mode: SupportMode::All,
                sensitivity: Default::default(),
                edges: vec![],
                produced_by: None,
                scoped_to: None,
            },
        )
        .unwrap();

    let mut holder = f.exec();
    holder
        .claim(
            &f.graph,
            &nodes[0],
            &SessionId("holder".into()),
            std::slice::from_ref(&premise),
            DEFAULT_LEASE_MS,
            f.now(),
        )
        .unwrap();

    // A different process contradicts it.
    let mut other = f.exec();
    other
        .store_mut()
        .append(
            &f.graph,
            Actor::System,
            f.now(),
            Event::Contradict {
                id: premise.clone(),
                reason: "the migration table disagrees".into(),
                evidence: vec![],
            },
        )
        .unwrap();

    let e = holder
        .claim(
            &f.graph,
            &nodes[1],
            &SessionId("holder".into()),
            std::slice::from_ref(&premise),
            DEFAULT_LEASE_MS,
            f.now(),
        )
        .unwrap_err();

    let ExecError::Refused(r) = e else { panic!("expected a refusal, got {e:?}") };
    assert_eq!(r.code, RefusalCode::StalePremise);
    let stale = r.detail().map(|d| d.stale.clone()).unwrap_or_default();
    assert!(
        stale.iter().any(|s| s.id == premise),
        "the refusal names the belief that died, not just that one did"
    );
}

/// Two processes folding the same file must agree. Determinism across processes
/// is the property that makes a shared store possible at all.
#[test]
fn separate_connections_fold_the_same_file_identically() {
    let (f, nodes) = Fixture::running(3);
    let mut exec = f.exec();
    exec.claim(&f.graph, &nodes[0], &SessionId("a".into()), &[], DEFAULT_LEASE_MS, f.now())
        .unwrap();
    exec.done(&f.graph, &nodes[0], json!({"v": 1}), Spend::default(), f.now()).unwrap();

    let one = Store::open(&f.path).unwrap().state(&f.graph).unwrap();
    let two = Store::open(&f.path).unwrap().state(&f.graph).unwrap();
    assert_eq!(one, two);

    let rebuilt = {
        let store = Store::open(&f.path).unwrap();
        graphene_core::fold::fold(&store.records(&f.graph).unwrap()).unwrap()
    };
    assert_eq!(one, rebuilt, "the cached fold and a fresh rebuild disagree");
}
