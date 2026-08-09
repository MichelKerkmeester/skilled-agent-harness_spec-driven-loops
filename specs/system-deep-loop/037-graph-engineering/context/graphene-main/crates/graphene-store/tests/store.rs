use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Barrier};

use graphene_core::belief::{Fidelity, Provenance, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Spend};
use graphene_core::event::Event;
use graphene_core::fold::State;
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, ClaimId, GraphId, NodeId, SessionId};
use graphene_core::node::{Node, NodeSpec, NodeState, RetryPolicy};
use graphene_core::time::{Deadline, ObservedAt, Seq, Timestamp};
use graphene_store::{ListFilter, Store, StoreError};
use serde_json::json;

fn tmpdir() -> std::path::PathBuf {
    let base = std::env::temp_dir().join(format!(
        "graphene-test-{}-{}",
        std::process::id(),
        NEXT.fetch_add(1, Ordering::SeqCst)
    ));
    std::fs::create_dir_all(&base).unwrap();
    base
}
static NEXT: AtomicUsize = AtomicUsize::new(0);

fn seeded(store: &mut Store, seed: &str) -> GraphId {
    let graph = GraphId::from_seed(seed);
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(1000),
            Event::GraphCreate {
                seed: seed.into(),
                title: "churn outreach".into(),
                description: "d".into(),
                task: "find at-risk accounts".into(),
                budget: Budget::tokens(100_000),
                limits: Default::default(),
                tags: vec!["quarterly".into()],
                parent: None,
            },
        )
        .unwrap();
    graph
}

fn node(graph: &GraphId, name: &str, needs: Vec<NodeId>) -> Node {
    Node {
        id: NodeId::for_name(graph, name),
        graph: graph.clone(),
        name: name.into(),
        spec: NodeSpec::Agent { prompt: "p".into(), system: None },
        capability: "agent".into(),
        inputs: json!({"type":"object"}),
        outputs: json!({"type":"object"}),
        bindings: vec![],
        needs,
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

fn believe(store: &mut Store, graph: &GraphId, content: &str, src: SourceRef) -> BeliefId {
    let id = BeliefId::for_content(graph, content, "tool-observation", &src.key());
    store
        .append(
            graph,
            Actor::session("s1"),
            Timestamp(2000),
            Event::BeliefAdd {
                id: id.clone(),
                provenance: Provenance::ToolObservation,
                fidelity: Fidelity::Claimed,
                content: content.into(),
                summary: content.into(),
                source: src,
                observed_at: ObservedAt::observed(Timestamp(2000)),
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

#[test]
fn a_round_trip_through_the_store_preserves_the_fold() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "roundtrip");
    let n = node(&graph, "fetch", vec![]);
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(1),
            Event::NodeAdd { node: Box::new(n.clone()) },
        )
        .unwrap();

    let state = store.state(&graph).unwrap();
    assert_eq!(state.graph.as_ref().unwrap().title, "churn outreach");
    assert_eq!(state.nodes[&n.id].name, "fetch");
}

#[test]
fn rebuild_reproduces_the_incremental_fold_exactly() {
    let dir = tmpdir();
    let mut store = Store::open(dir.join("store.db")).unwrap();
    let graph = seeded(&mut store, "rebuild");

    let a = node(&graph, "a", vec![]);
    let b = node(&graph, "b", vec![a.id.clone()]);
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(1),
            Event::NodeAdd { node: Box::new(a.clone()) },
        )
        .unwrap();
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(2),
            Event::NodeAdd { node: Box::new(b.clone()) },
        )
        .unwrap();
    let obs = believe(&mut store, &graph, "12 tickets", SourceRef::new("zendesk").at("c17"));
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(3),
            Event::NodeDone {
                node: a.id.clone(),
                output: json!({"ok":true}),
                spend: Spend { tokens: 500, ..Default::default() },
            },
        )
        .unwrap();
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(4),
            Event::Stale { source: SourceRef::new("zendesk").at("c17") },
        )
        .unwrap();

    let incremental = store.state(&graph).unwrap();
    store.rebuild().unwrap();
    let rebuilt = store.state(&graph).unwrap();

    assert_eq!(incremental, rebuilt, "the fold is a pure function of the log");
    assert!(rebuilt.beliefs[&obs].stale);
}

#[test]
fn deleting_every_cache_changes_nothing_a_caller_can_observe() {
    let dir = tmpdir();
    let mut store = Store::open(dir.join("store.db")).unwrap();
    let graph = seeded(&mut store, "cachefree");
    let n = node(&graph, "x", vec![]);
    store
        .append(&graph, Actor::session("s1"), Timestamp(1), Event::NodeAdd { node: Box::new(n) })
        .unwrap();

    let before = store.state(&graph).unwrap();
    store.rebuild().unwrap();
    assert_eq!(before, store.state(&graph).unwrap());
}

#[test]
fn two_sessions_racing_to_claim_one_node_produce_exactly_one_winner() {
    let dir = tmpdir();
    let path = dir.join("store.db");
    let mut store = Store::open(&path).unwrap();
    let graph = seeded(&mut store, "race");
    let n = node(&graph, "contested-work", vec![]);
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(1),
            Event::NodeAdd { node: Box::new(n.clone()) },
        )
        .unwrap();
    drop(store);

    const RACERS: usize = 8;
    let barrier = Arc::new(Barrier::new(RACERS));
    let winners = Arc::new(AtomicUsize::new(0));
    let mut handles = Vec::new();

    for i in 0..RACERS {
        let path = path.clone();
        let graph = graph.clone();
        let node_id = n.id.clone();
        let barrier = Arc::clone(&barrier);
        let winners = Arc::clone(&winners);

        handles.push(std::thread::spawn(move || {
            let mut store = Store::open(&path).unwrap();
            let session = SessionId(format!("s{i}"));
            barrier.wait();

            let outcome = store.mutate(&graph, |state| {
                let node = state
                    .nodes
                    .get(&node_id)
                    .ok_or_else(|| StoreError::UnknownGraph("node".into()))?;
                if !node.state.is_claimable() {
                    return Err(StoreError::AlreadyClaimed {
                        node: node_id.to_string(),
                        session: "someone".into(),
                    });
                }
                Ok(vec![(
                    Actor::Session { id: session.clone() },
                    Timestamp(10),
                    Event::Claim {
                        id: ClaimId::for_claim(&node_id, &session, i as u64),
                        node: node_id.clone(),
                        session: session.clone(),
                        read_set: vec![],
                        expires_at: Deadline(Timestamp(999_999)),
                    },
                )])
            });

            if outcome.is_ok() {
                winners.fetch_add(1, Ordering::SeqCst);
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }

    assert_eq!(winners.load(Ordering::SeqCst), 1, "exactly one session may hold a node");

    let store = Store::open(&path).unwrap();
    let state = store.state(&graph).unwrap();
    assert_eq!(state.active_claims.len(), 1);
    assert_eq!(state.nodes[&n.id].state, NodeState::Claimed);
}

#[test]
fn concurrent_appends_to_the_same_graph_all_land_and_stay_ordered() {
    let dir = tmpdir();
    let path = dir.join("store.db");
    let mut store = Store::open(&path).unwrap();
    let graph = seeded(&mut store, "concurrent");
    drop(store);

    const WRITERS: usize = 8;
    const EACH: usize = 10;
    let barrier = Arc::new(Barrier::new(WRITERS));
    let mut handles = Vec::new();

    for w in 0..WRITERS {
        let path = path.clone();
        let graph = graph.clone();
        let barrier = Arc::clone(&barrier);
        handles.push(std::thread::spawn(move || {
            let mut store = Store::open(&path).unwrap();
            barrier.wait();
            for i in 0..EACH {
                store
                    .append(
                        &graph,
                        Actor::session(format!("s{w}")),
                        Timestamp((w * EACH + i) as i64),
                        Event::SessionHeartbeat { session: SessionId(format!("s{w}")) },
                    )
                    .unwrap();
            }
        }));
    }
    for h in handles {
        h.join().unwrap();
    }

    let store = Store::open(&path).unwrap();
    let records = store.records(&graph).unwrap();
    assert_eq!(records.len(), 1 + WRITERS * EACH, "no write was lost");

    let seqs: Vec<u64> = records.iter().map(|r| r.seq.0).collect();
    let mut sorted = seqs.clone();
    sorted.sort_unstable();
    sorted.dedup();
    assert_eq!(seqs, sorted, "sequence numbers are unique and monotonic");
}

#[test]
fn a_refused_decision_leaves_no_trace() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "rollback");
    let before = store.records(&graph).unwrap().len();

    let refused: Result<_, _> =
        store.mutate(&graph, |_| Err::<Vec<_>, _>(StoreError::UnknownGraph("deliberate".into())));
    assert!(refused.is_err());

    assert_eq!(store.records(&graph).unwrap().len(), before, "the transaction rolled back");
}

#[test]
fn state_at_reconstructs_a_point_in_time() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "pointintime");
    let b = believe(&mut store, &graph, "the migration ran", SourceRef::new("db"));
    let when = store.state(&graph).unwrap().seq;

    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(9),
            Event::Retract {
                id: b.clone(),
                reason: "it did not".into(),
                evidence: vec![],
                rule: None,
            },
        )
        .unwrap();

    assert_eq!(store.state(&graph).unwrap().beliefs[&b].state, graphene_core::TruthState::Out);
    assert_eq!(
        store.state_at(&graph, when).unwrap().beliefs[&b].state,
        graphene_core::TruthState::In,
        "what we believed when the node ran"
    );
}

#[test]
fn export_and_import_round_trip_to_an_identical_fold() {
    let mut source = Store::open_in_memory().unwrap();
    let graph = seeded(&mut source, "export");
    let n = node(&graph, "a", vec![]);
    source
        .append(&graph, Actor::session("s1"), Timestamp(1), Event::NodeAdd { node: Box::new(n) })
        .unwrap();
    believe(&mut source, &graph, "x", SourceRef::new("s"));

    let jsonl = source.export(&graph).unwrap();
    assert_eq!(jsonl.lines().count(), 3);

    let mut target = Store::open_in_memory().unwrap();
    let imported = target.import(&jsonl).unwrap();
    assert_eq!(imported, 3);
    assert_eq!(source.state(&graph).unwrap(), target.state(&graph).unwrap());
}

#[test]
fn compaction_drops_only_records_that_cannot_change_the_fold() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "compact");

    for i in 0..5 {
        store
            .append(
                &graph,
                Actor::session("s1"),
                Timestamp(i),
                Event::SessionHeartbeat { session: SessionId("s1".into()) },
            )
            .unwrap();
    }
    for i in 0..3 {
        store
            .append(
                &graph,
                Actor::session("s1"),
                Timestamp(100 + i),
                Event::CheckResult { passed: i == 2, errors: 0, warnings: 0, codes: vec![] },
            )
            .unwrap();
    }
    let b = believe(&mut store, &graph, "load bearing", SourceRef::new("s"));
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(200),
            Event::Retract {
                id: b.clone(),
                reason: "a reason that must survive compaction".into(),
                evidence: vec![],
                rule: None,
            },
        )
        .unwrap();

    let before = store.state(&graph).unwrap();
    let report = store.compact().unwrap();
    let after = store.state(&graph).unwrap();

    assert!(report.removed > 0, "there was something to collapse");
    assert_eq!(before.beliefs, after.beliefs, "beliefs are untouched");
    assert_eq!(before.check_passed, after.check_passed);

    let retraction = after.beliefs[&b].retraction.as_ref().unwrap();
    assert_eq!(retraction.reason, "a reason that must survive compaction");
}

#[test]
fn lease_expiry_is_a_query_not_stored_state() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "leases");
    let n = node(&graph, "work", vec![]);
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(1),
            Event::NodeAdd { node: Box::new(n.clone()) },
        )
        .unwrap();

    let session = SessionId("s1".into());
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(2),
            Event::Claim {
                id: ClaimId::for_claim(&n.id, &session, 1),
                node: n.id.clone(),
                session: session.clone(),
                read_set: vec![],
                expires_at: Deadline(Timestamp(5_000)),
            },
        )
        .unwrap();

    assert!(store.expired_claims(Timestamp(4_999)).unwrap().is_empty());
    let expired = store.expired_claims(Timestamp(5_000)).unwrap();
    assert_eq!(expired.len(), 1, "the same stored row is expired or not depending on `now`");
    assert_eq!(expired[0].node, n.id);

    assert_eq!(store.claims_of(&session).unwrap().len(), 1);
}

#[test]
fn listing_defaults_to_the_pending_set() {
    let mut store = Store::open_in_memory().unwrap();
    let live = seeded(&mut store, "live");
    let done = seeded(&mut store, "finished");
    store
        .append(
            &done,
            Actor::session("s1"),
            Timestamp(5),
            Event::GraphState { to: GraphState::Cancelled, reason: Some("done with it".into()) },
        )
        .unwrap();

    let pending = store.list(&ListFilter::default()).unwrap();
    assert_eq!(pending.len(), 1);
    assert_eq!(pending[0].id, live);

    let all = store.list(&ListFilter { include_terminal: true, ..Default::default() }).unwrap();
    assert_eq!(all.len(), 2);

    let tagged =
        store.list(&ListFilter { tag: Some("quarterly".into()), ..Default::default() }).unwrap();
    assert_eq!(tagged.len(), 1);
}

#[test]
fn the_index_carries_enough_to_list_without_loading_a_fold() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "index");
    let a = node(&graph, "a", vec![]);
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(1),
            Event::NodeAdd { node: Box::new(a.clone()) },
        )
        .unwrap();
    store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(2),
            Event::NodeDone {
                node: a.id,
                output: json!({}),
                spend: Spend { tokens: 4_200, micros_usd: 17, ..Default::default() },
            },
        )
        .unwrap();

    let summary = &store.list(&ListFilter::default()).unwrap()[0];
    assert_eq!(summary.title, "churn outreach");
    assert_eq!(summary.task, "find at-risk accounts");
    assert_eq!(summary.nodes_total, 1);
    assert_eq!(summary.nodes_done, 1);
    assert_eq!(summary.nodes_outstanding, 0);
    assert_eq!(summary.tokens, 4_200);
    assert_eq!(summary.micros_usd, 17);
    assert_eq!(summary.tags, vec!["quarterly".to_string()]);
}

#[test]
fn discovery_walks_up_like_git() {
    let root = tmpdir();
    let nested = root.join("a").join("b").join("c");
    std::fs::create_dir_all(&nested).unwrap();

    assert!(matches!(Store::discover(&nested), Err(StoreError::NotFound(_))));

    let mut created = Store::discover_or_init(&root).unwrap();
    let graph = seeded(&mut created, "discovered");
    drop(created);

    let found = Store::discover(&nested).unwrap();
    assert_eq!(found.state(&graph).unwrap().graph.unwrap().id, graph);
}

#[test]
fn an_unknown_graph_is_an_error_not_an_empty_state() {
    let store = Store::open_in_memory().unwrap();
    let missing = GraphId::from_seed("never-created");
    assert!(matches!(store.state(&missing), Err(StoreError::UnknownGraph(_))));
}

#[test]
fn the_stale_premise_case_survives_a_restart() {
    let dir = tmpdir();
    let path = dir.join("store.db");
    let graph;
    let draft;

    {
        let mut store = Store::open(&path).unwrap();
        graph = seeded(&mut store, "flagship");
        let src = SourceRef::new("zendesk").at("tickets/c17").shared();
        let tickets = believe(&mut store, &graph, "12 open tickets", src);

        let source = SourceRef::new("inference");
        draft = BeliefId::for_content(&graph, "outreach draft", "derived", &source.key());
        store
            .append(
                &graph,
                Actor::session("s1"),
                Timestamp(3),
                Event::BeliefAdd {
                    id: draft.clone(),
                    provenance: Provenance::Derived,
                    fidelity: Fidelity::Claimed,
                    content: "outreach draft".into(),
                    summary: "draft".into(),
                    source,
                    observed_at: ObservedAt::observed(Timestamp(3)),
                    support_mode: SupportMode::All,
                    sensitivity: Default::default(),
                    edges: vec![(graphene_core::BeliefEdge::DerivesFrom, tickets.clone())],
                    produced_by: None,
                    scoped_to: None,
                },
            )
            .unwrap();

        store
            .append(
                &graph,
                Actor::session("s1"),
                Timestamp(4),
                Event::Stale { source: SourceRef::new("zendesk").at("tickets/c17") },
            )
            .unwrap();
    }

    let store = Store::open(&path).unwrap();
    assert_eq!(
        store.state(&graph).unwrap().beliefs[&draft].state,
        graphene_core::TruthState::Both,
        "the draft still knows its premise died, across a process boundary"
    );
}

#[test]
fn folds_are_stable_across_repeated_loads() {
    let dir = tmpdir();
    let path = dir.join("store.db");
    let mut store = Store::open(&path).unwrap();
    let graph = seeded(&mut store, "stable");
    believe(&mut store, &graph, "a", SourceRef::new("x"));
    let first: State = store.state(&graph).unwrap();
    drop(store);

    for _ in 0..5 {
        let store = Store::open(&path).unwrap();
        assert_eq!(store.state(&graph).unwrap(), first);
    }
}

#[test]
fn a_seq_gap_from_compaction_does_not_break_later_appends() {
    let mut store = Store::open_in_memory().unwrap();
    let graph = seeded(&mut store, "gaps");
    for i in 0..4 {
        store
            .append(
                &graph,
                Actor::session("s1"),
                Timestamp(i),
                Event::SessionHeartbeat { session: SessionId("s1".into()) },
            )
            .unwrap();
    }
    store.compact().unwrap();

    let n = node(&graph, "after", vec![]);
    let (record, _) = store
        .append(
            &graph,
            Actor::session("s1"),
            Timestamp(50),
            Event::NodeAdd { node: Box::new(n.clone()) },
        )
        .unwrap();
    assert!(record.seq > Seq::ZERO);
    assert_eq!(store.state(&graph).unwrap().nodes[&n.id].name, "after");
}
