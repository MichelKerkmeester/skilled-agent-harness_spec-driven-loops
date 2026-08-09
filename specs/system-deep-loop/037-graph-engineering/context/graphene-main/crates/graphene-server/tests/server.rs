use std::path::PathBuf;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::Duration;

use graphene_core::belief::{Fidelity, Provenance, SourceRef, SupportMode};
use graphene_core::budget::{Budget, Spend};
use graphene_core::event::Event;
use graphene_core::graph::GraphState;
use graphene_core::id::{Actor, BeliefId, ClaimId, GraphId, NodeId, SessionId};
use graphene_core::node::{HumanAsk, Node, NodeSpec, NodeState, RetryPolicy, TimeoutPolicy};
use graphene_core::time::{Deadline, ObservedAt, Seq, Timestamp};
use graphene_server::discovery;
use graphene_server::protocol::{
    ClientFrame, ErrorCode, EventKind, PushEvent, ServerFrame, PROTOCOL_VERSION,
};
use graphene_server::wait::{wait, WaitOptions, WaitResult};
use graphene_server::{Config, Server};
use graphene_store::Store;
use serde_json::json;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt, BufReader};
use tokio::net::TcpStream;

static NEXT: AtomicUsize = AtomicUsize::new(0);

/// A lease the live server's sweep will not revoke. `expires_at` is absolute
/// wall-clock, and the server sweeps against the real clock — a synthetic
/// timestamp reads as long expired.
fn far_future() -> Deadline {
    Deadline(Timestamp(
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis() as i64)
            .unwrap_or(0)
            + 3_600_000,
    ))
}

fn tmp_store() -> PathBuf {
    let d = std::env::temp_dir().join(format!(
        "graphene-srv-{}-{}",
        std::process::id(),
        NEXT.fetch_add(1, Ordering::SeqCst)
    ));
    std::fs::create_dir_all(&d).unwrap();
    d.join("store.db")
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

struct Seeded {
    path: PathBuf,
    graph: GraphId,
    clock: i64,
}

impl Seeded {
    fn new(seed: &str) -> Seeded {
        let path = tmp_store();
        let graph = GraphId::from_seed(seed);
        let mut store = Store::open(&path).unwrap();
        store
            .append(
                &graph,
                Actor::System,
                Timestamp(0),
                Event::GraphCreate {
                    seed: seed.into(),
                    title: "t".into(),
                    description: String::new(),
                    task: "work".into(),
                    budget: Budget::tokens(100_000),
                    limits: Default::default(),
                    tags: vec![],
                    parent: None,
                },
            )
            .unwrap();
        Seeded { path, graph, clock: 0 }
    }

    fn tick(&mut self) -> Timestamp {
        self.clock += 1000;
        Timestamp(self.clock)
    }

    fn store(&self) -> Store {
        Store::open(&self.path).unwrap()
    }

    fn push(&mut self, event: Event) {
        let at = self.tick();
        self.store().append(&self.graph, Actor::System, at, event).unwrap();
    }

    fn drive_to_running(&mut self) {
        let mut review = node(&self.graph, "review-granularity", vec![]);
        review.spec = NodeSpec::Review { lens: "g".into(), prompt: "p".into() };
        review.capability = "review".into();
        let review_id = review.id.clone();
        self.push(Event::NodeAdd { node: Box::new(review) });
        self.push(Event::CheckResult { passed: true, errors: 0, warnings: 0, codes: vec![] });
        self.push(Event::NodeDone { node: review_id, output: json!({}), spend: Spend::default() });
        for to in
            [GraphState::Checked, GraphState::Reviewed, GraphState::Approved, GraphState::Running]
        {
            self.push(Event::GraphState { to, reason: None });
        }
    }
}

/// A minimal WebSocket client: enough to drive the real handshake and read
/// frames, without pulling in a client library.
struct Ws {
    stream: TcpStream,
}

impl Ws {
    async fn connect(port: u16) -> Ws {
        let mut stream = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
        let req = format!(
            "GET /ws HTTP/1.1\r\nHost: 127.0.0.1:{port}\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\r\nSec-WebSocket-Version: 13\r\n\r\n"
        );
        stream.write_all(req.as_bytes()).await.unwrap();

        let mut reader = BufReader::new(&mut stream);
        loop {
            let mut line = String::new();
            reader.read_line(&mut line).await.unwrap();
            if line == "\r\n" || line.is_empty() {
                break;
            }
        }
        Ws { stream }
    }

    async fn send(&mut self, frame: &ClientFrame) {
        let payload = serde_json::to_vec(frame).unwrap();
        let mut buf = vec![0x81u8];
        let mask = [0x12u8, 0x34, 0x56, 0x78];

        if payload.len() < 126 {
            buf.push(0x80 | payload.len() as u8);
        } else {
            buf.push(0x80 | 126);
            buf.extend_from_slice(&(payload.len() as u16).to_be_bytes());
        }
        buf.extend_from_slice(&mask);
        buf.extend(payload.iter().enumerate().map(|(i, b)| b ^ mask[i % 4]));
        self.stream.write_all(&buf).await.unwrap();
    }

    async fn recv(&mut self) -> Option<ServerFrame> {
        use tokio::io::AsyncReadExt;
        let mut header = [0u8; 2];
        self.stream.read_exact(&mut header).await.ok()?;
        let len = (header[1] & 0x7f) as usize;
        let len = match len {
            126 => {
                let mut ext = [0u8; 2];
                self.stream.read_exact(&mut ext).await.ok()?;
                u16::from_be_bytes(ext) as usize
            }
            127 => {
                let mut ext = [0u8; 8];
                self.stream.read_exact(&mut ext).await.ok()?;
                u64::from_be_bytes(ext) as usize
            }
            n => n,
        };
        let mut payload = vec![0u8; len];
        self.stream.read_exact(&mut payload).await.ok()?;
        serde_json::from_slice(&payload).ok()
    }

    async fn recv_timeout(&mut self, ms: u64) -> Option<ServerFrame> {
        tokio::time::timeout(Duration::from_millis(ms), self.recv()).await.ok().flatten()
    }

    fn hello(session: &str, graph: &GraphId, interests: Vec<EventKind>) -> ClientFrame {
        ClientFrame::Hello {
            session: SessionId(session.into()),
            graph: graph.clone(),
            label: Some(session.into()),
            protocol: PROTOCOL_VERSION,
            interests,
            since: None,
        }
    }
}

async fn serve(path: &PathBuf) -> Server {
    let mut cfg = Config::new(path);
    cfg.idle_exit = None;
    Server::start(cfg).await.unwrap()
}

// ------------------------------------------------------------------ lifecycle

#[tokio::test]
async fn a_server_publishes_a_discoverable_record_and_clears_it_on_shutdown() {
    let s = Seeded::new("discover");
    let server = serve(&s.path).await;

    let info = discovery::find_live(&s.path).expect("a record beside the store");
    assert_eq!(info.port, server.info.port);
    assert_eq!(info.protocol, PROTOCOL_VERSION);
    assert!(info.is_alive());
    assert_eq!(info.url(), format!("ws://127.0.0.1:{}/ws", info.port));

    server.shutdown().await;
    tokio::time::sleep(Duration::from_millis(50)).await;
    assert!(discovery::read(&s.path).is_none(), "the record is cleared on exit");
}

#[tokio::test]
async fn the_port_is_os_assigned_so_two_stores_never_collide() {
    let a = Seeded::new("port-a");
    let b = Seeded::new("port-b");
    let sa = serve(&a.path).await;
    let sb = serve(&b.path).await;
    assert_ne!(sa.info.port, sb.info.port);
    sa.shutdown().await;
    sb.shutdown().await;
}

#[tokio::test]
async fn a_protocol_mismatch_is_refused_rather_than_spoken() {
    let s = Seeded::new("proto");
    let server = serve(&s.path).await;

    let mut ws = Ws::connect(server.info.port).await;
    ws.send(&ClientFrame::Hello {
        session: SessionId("s1".into()),
        graph: s.graph.clone(),
        label: None,
        protocol: PROTOCOL_VERSION + 99,
        interests: vec![],
        since: None,
    })
    .await;

    match ws.recv_timeout(1000).await {
        Some(ServerFrame::Error { code, .. }) => assert_eq!(code, ErrorCode::ProtocolMismatch),
        other => panic!("expected a refusal, got {other:?}"),
    }
    server.shutdown().await;
}

// ------------------------------------------------------------------ handshake

#[tokio::test]
async fn a_welcome_carries_the_current_seq_and_the_peers() {
    let mut s = Seeded::new("welcome");
    s.push(Event::NodeAdd { node: Box::new(node(&s.graph, "a", vec![])) });
    let server = serve(&s.path).await;

    let mut one = Ws::connect(server.info.port).await;
    one.send(&Ws::hello("s1", &s.graph, vec![])).await;
    match one.recv_timeout(1000).await {
        Some(ServerFrame::Welcome { protocol, seq, sessions, .. }) => {
            assert_eq!(protocol, PROTOCOL_VERSION);
            assert!(seq > Seq::ZERO);
            assert!(sessions.is_empty(), "the first session has no peers");
        }
        other => panic!("expected welcome, got {other:?}"),
    }

    let mut two = Ws::connect(server.info.port).await;
    two.send(&Ws::hello("s2", &s.graph, vec![])).await;
    match two.recv_timeout(1000).await {
        Some(ServerFrame::Welcome { sessions, .. }) => {
            assert_eq!(sessions.len(), 1);
            assert_eq!(sessions[0].session, SessionId("s1".into()));
        }
        other => panic!("expected welcome, got {other:?}"),
    }
    server.shutdown().await;
}

// -------------------------------------------------------------------- routing

#[tokio::test]
async fn a_node_becoming_ready_is_pushed_without_being_asked_for() {
    let mut s = Seeded::new("push");
    let a = node(&s.graph, "a", vec![]);
    let mut b = node(&s.graph, "b", vec![a.id.clone()]);
    b.state = NodeState::Pending;
    b.bindings = vec![graphene_core::node::Binding {
        from: a.id.clone(),
        select: "$".into(),
        into: "in".into(),
    }];
    b.inputs = json!({"type":"object","properties":{"in":{}}});
    let (a_id, b_id) = (a.id.clone(), b.id.clone());
    s.push(Event::NodeAdd { node: Box::new(a) });
    s.push(Event::NodeAdd { node: Box::new(b) });
    s.drive_to_running();

    let server = serve(&s.path).await;
    let mut ws = Ws::connect(server.info.port).await;
    ws.send(&Ws::hello("s1", &s.graph, vec![])).await;
    let _welcome = ws.recv_timeout(1000).await;

    s.push(Event::NodeDone { node: a_id, output: json!({}), spend: Spend::default() });

    let frame = ws.recv_timeout(3000).await.expect("a push arrived unprompted");
    match frame {
        ServerFrame::Event { event: PushEvent::NodeReady { nodes }, .. } => {
            assert!(nodes.contains(&b_id));
        }
        other => panic!("expected node-ready, got {other:?}"),
    }
    server.shutdown().await;
}

#[tokio::test]
async fn premise_invalidation_reaches_the_holder_and_only_the_holder() {
    let mut s = Seeded::new("routing");
    let one = node(&s.graph, "one", vec![]);
    let two = node(&s.graph, "two", vec![]);
    let (one_id, two_id) = (one.id.clone(), two.id.clone());
    s.push(Event::NodeAdd { node: Box::new(one) });
    s.push(Event::NodeAdd { node: Box::new(two) });

    let premise = BeliefId::for_content(&s.graph, "migration applied", "tool-observation", "db");
    s.push(Event::BeliefAdd {
        id: premise.clone(),
        provenance: Provenance::ToolObservation,
        fidelity: Fidelity::Claimed,
        content: "migration applied".into(),
        summary: "migration".into(),
        source: SourceRef::new("db").shared(),
        observed_at: ObservedAt::observed(Timestamp(1)),
        support_mode: SupportMode::All,
        sensitivity: Default::default(),
        edges: vec![],
        produced_by: None,
        scoped_to: None,
    });
    s.drive_to_running();

    let sess1 = SessionId("s1".into());
    let sess2 = SessionId("s2".into());
    s.push(Event::SessionAttach { session: sess1.clone(), label: None });
    s.push(Event::SessionAttach { session: sess2.clone(), label: None });
    s.push(Event::Claim {
        id: ClaimId::for_claim(&one_id, &sess1, 1),
        node: one_id.clone(),
        session: sess1.clone(),
        read_set: vec![premise.clone()],
        expires_at: far_future(),
    });
    s.push(Event::Claim {
        id: ClaimId::for_claim(&two_id, &sess2, 2),
        node: two_id,
        session: sess2.clone(),
        read_set: vec![],
        expires_at: far_future(),
    });

    let server = serve(&s.path).await;
    let mut holder = Ws::connect(server.info.port).await;
    holder.send(&Ws::hello("s1", &s.graph, vec![EventKind::PremiseInvalidated])).await;
    holder.recv_timeout(1000).await;

    let mut bystander = Ws::connect(server.info.port).await;
    bystander.send(&Ws::hello("s2", &s.graph, vec![EventKind::PremiseInvalidated])).await;
    bystander.recv_timeout(1000).await;

    s.push(Event::Contradict {
        id: premise.clone(),
        reason: "rolled back".into(),
        evidence: vec![],
    });

    let got = holder.recv_timeout(3000).await.expect("the holder is told");
    match got {
        ServerFrame::Event { event: PushEvent::PremiseInvalidated { belief, .. }, .. } => {
            assert_eq!(belief, premise);
        }
        other => panic!("expected premise-invalidated, got {other:?}"),
    }

    assert!(
        bystander.recv_timeout(800).await.is_none(),
        "a session not standing on the belief must not be woken"
    );
    server.shutdown().await;
}

#[tokio::test]
async fn a_session_cannot_filter_out_learning_the_graph_was_cancelled() {
    let mut s = Seeded::new("mandatory");
    s.push(Event::NodeAdd { node: Box::new(node(&s.graph, "a", vec![])) });
    s.drive_to_running();

    let server = serve(&s.path).await;
    let mut ws = Ws::connect(server.info.port).await;
    ws.send(&Ws::hello("s1", &s.graph, vec![EventKind::NodeReady])).await;
    ws.recv_timeout(1000).await;

    s.push(Event::GraphState { to: GraphState::Cancelled, reason: Some("stop".into()) });

    let got = ws.recv_timeout(3000).await.expect("graph-changed is mandatory");
    match got {
        ServerFrame::Event { event: PushEvent::GraphChanged { state }, .. } => {
            assert_eq!(state, GraphState::Cancelled);
        }
        other => panic!("expected graph-changed, got {other:?}"),
    }
    server.shutdown().await;
}

#[tokio::test]
async fn human_resolution_is_pushed_to_a_waiting_session() {
    let mut s = Seeded::new("human");
    let mut gate = node(&s.graph, "approve", vec![]);
    gate.spec = NodeSpec::Human(HumanAsk {
        ask: "ok?".into(),
        options: vec!["approve".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    gate.capability = "human".into();
    let gate_id = gate.id.clone();
    s.push(Event::NodeAdd { node: Box::new(gate) });
    s.drive_to_running();
    s.push(Event::HumanAsk {
        node: gate_id.clone(),
        ask: "ok?".into(),
        options: vec!["approve".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });

    let server = serve(&s.path).await;
    let mut ws = Ws::connect(server.info.port).await;
    ws.send(&Ws::hello("s1", &s.graph, vec![])).await;
    ws.recv_timeout(1000).await;

    s.push(Event::HumanResolve {
        node: gate_id.clone(),
        by: "mel".into(),
        choice: "approve".into(),
        input: None,
    });

    let mut saw = false;
    for _ in 0..4 {
        if let Some(ServerFrame::Event { event: PushEvent::HumanResolved { node, .. }, .. }) =
            ws.recv_timeout(2000).await
        {
            assert_eq!(node, gate_id);
            saw = true;
            break;
        }
    }
    assert!(saw, "the blocked session learns a person answered");
    server.shutdown().await;
}

// ------------------------------------------------------------------- presence

#[tokio::test]
async fn a_dropped_socket_releases_that_sessions_claims() {
    let mut s = Seeded::new("presence");
    let a = node(&s.graph, "a", vec![]);
    let a_id = a.id.clone();
    s.push(Event::NodeAdd { node: Box::new(a) });
    s.drive_to_running();

    let session = SessionId("s1".into());
    s.push(Event::SessionAttach { session: session.clone(), label: None });
    s.push(Event::Claim {
        id: ClaimId::for_claim(&a_id, &session, 1),
        node: a_id.clone(),
        session: session.clone(),
        read_set: vec![],
        expires_at: far_future(),
    });
    assert_eq!(s.store().state(&s.graph).unwrap().nodes[&a_id].state, NodeState::Claimed);

    let server = serve(&s.path).await;
    {
        let mut ws = Ws::connect(server.info.port).await;
        ws.send(&Ws::hello("s1", &s.graph, vec![])).await;
        ws.recv_timeout(1000).await;
    }

    let mut released = false;
    for _ in 0..20 {
        tokio::time::sleep(Duration::from_millis(200)).await;
        if s.store().state(&s.graph).unwrap().nodes[&a_id].state == NodeState::Ready {
            released = true;
            break;
        }
    }
    assert!(released, "a crashed session's work returns to the pool in seconds");
    server.shutdown().await;
}

// --------------------------------------------------------------------- degrade

#[tokio::test]
async fn writes_continue_and_wait_still_works_with_no_server() {
    let mut s = Seeded::new("degrade");
    let a = node(&s.graph, "a", vec![]);
    let mut b = node(&s.graph, "b", vec![a.id.clone()]);
    b.state = NodeState::Pending;
    b.bindings = vec![graphene_core::node::Binding {
        from: a.id.clone(),
        select: "$".into(),
        into: "in".into(),
    }];
    b.inputs = json!({"type":"object","properties":{"in":{}}});
    let a_id = a.id.clone();
    s.push(Event::NodeAdd { node: Box::new(a) });
    s.push(Event::NodeAdd { node: Box::new(b) });
    s.drive_to_running();

    assert!(discovery::find_live(&s.path).is_none(), "no server is running");

    let path = s.path.clone();
    let graph = s.graph.clone();
    let waiter = tokio::spawn(async move {
        let mut opts = WaitOptions::new(SessionId("s1".into()), graph);
        opts.timeout = Duration::from_secs(5);
        opts.poll = Duration::from_millis(50);
        wait(&path, opts).await.unwrap()
    });

    tokio::time::sleep(Duration::from_millis(200)).await;
    s.push(Event::NodeDone { node: a_id, output: json!({}), spend: Spend::default() });

    match waiter.await.unwrap() {
        WaitResult::Event { event: PushEvent::NodeReady { .. }, .. } => {}
        other => panic!("the fallback must still deliver, got {other:?}"),
    }
}

#[tokio::test]
async fn wait_reports_a_timeout_with_what_is_still_outstanding() {
    let mut s = Seeded::new("timeout");
    let mut gate = node(&s.graph, "approve", vec![]);
    gate.spec = NodeSpec::Human(HumanAsk {
        ask: "ok?".into(),
        options: vec!["approve".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });
    gate.capability = "human".into();
    let gate_id = gate.id.clone();
    s.push(Event::NodeAdd { node: Box::new(gate) });
    s.drive_to_running();
    s.push(Event::HumanAsk {
        node: gate_id.clone(),
        ask: "ok?".into(),
        options: vec!["approve".into()],
        context: vec![],
        consequence: vec![],
        on_timeout: TimeoutPolicy::Wait,
    });

    let mut opts = WaitOptions::new(SessionId("s1".into()), s.graph.clone());
    opts.timeout = Duration::from_millis(400);
    opts.poll = Duration::from_millis(50);

    match wait(&s.path, opts).await.unwrap() {
        WaitResult::Timeout { graph_state, awaiting, .. } => {
            assert_eq!(graph_state, GraphState::Running);
            assert_eq!(awaiting, vec![gate_id], "the caller learns what it is still waiting on");
        }
        other => panic!("expected a timeout, got {other:?}"),
    }
}

#[tokio::test]
async fn killing_the_server_loses_push_not_data() {
    let mut s = Seeded::new("kill");
    let a = node(&s.graph, "a", vec![]);
    let a_id = a.id.clone();
    s.push(Event::NodeAdd { node: Box::new(a) });
    s.drive_to_running();

    let server = serve(&s.path).await;
    server.shutdown().await;
    tokio::time::sleep(Duration::from_millis(100)).await;

    s.push(Event::NodeDone { node: a_id.clone(), output: json!({}), spend: Spend::default() });

    let state = s.store().state(&s.graph).unwrap();
    assert_eq!(state.nodes[&a_id].state, NodeState::Done, "the write landed with no server");

    let again = serve(&s.path).await;
    assert!(discovery::find_live(&s.path).is_some(), "push resumes on restart");
    again.shutdown().await;
}

// ------------------------------------------------------------------ read APIs

#[tokio::test]
async fn the_http_surface_is_read_only() {
    let mut s = Seeded::new("http");
    s.push(Event::NodeAdd { node: Box::new(node(&s.graph, "a", vec![])) });
    let server = serve(&s.path).await;

    let body = http_get(server.info.port, "/api/health").await;
    assert!(body.contains("\"ok\":true"));

    let graphs = http_get(server.info.port, "/api/graphs").await;
    assert!(graphs.contains(s.graph.as_str()));

    for method in ["POST", "PUT", "DELETE", "PATCH"] {
        let status = http_method(server.info.port, method, "/api/graphs").await;
        assert!(
            status.starts_with("HTTP/1.1 405") || status.starts_with("HTTP/1.1 404"),
            "{method} must not be routable: {status}"
        );
    }
    server.shutdown().await;
}

async fn http_get(port: u16, path: &str) -> String {
    let mut stream = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
    stream
        .write_all(
            format!("GET {path} HTTP/1.1\r\nHost: localhost\r\nConnection: close\r\n\r\n")
                .as_bytes(),
        )
        .await
        .unwrap();
    let mut buf = Vec::new();
    tokio::io::AsyncReadExt::read_to_end(&mut stream, &mut buf).await.unwrap();
    String::from_utf8_lossy(&buf).to_string()
}

async fn http_method(port: u16, method: &str, path: &str) -> String {
    let mut stream = TcpStream::connect(("127.0.0.1", port)).await.unwrap();
    stream
        .write_all(
            format!(
                "{method} {path} HTTP/1.1\r\nHost: localhost\r\nContent-Length: 0\r\nConnection: close\r\n\r\n"
            )
            .as_bytes(),
        )
        .await
        .unwrap();
    let mut buf = Vec::new();
    tokio::io::AsyncReadExt::read_to_end(&mut stream, &mut buf).await.unwrap();
    String::from_utf8_lossy(&buf).lines().next().unwrap_or("").to_string()
}
