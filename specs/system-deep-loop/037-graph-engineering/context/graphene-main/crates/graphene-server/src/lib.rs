//! Presence and push over WebSocket, plus a read-only HTTP surface.
//!
//! The server **observes and notifies; it never mediates writes.** Sessions
//! write to SQLite directly, so a server crash costs push, not data — and there
//! is no daemon to install or supervise.

mod assets;
pub mod discovery;
pub mod hub;
pub mod protocol;
pub mod wait;
mod watch;
mod ws;

use std::collections::BTreeMap;
use std::net::SocketAddr;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use axum::extract::State as AxumState;
use axum::response::IntoResponse;
use axum::routing::get;
use axum::{Json, Router};
use graphene_core::id::{GraphId, NodeId};
use graphene_exec::Executor;
use graphene_store::{ListFilter, Store};
use tokio::sync::{Mutex, RwLock};

use crate::discovery::ServerInfo;
use crate::hub::Hub;
use crate::protocol::PROTOCOL_VERSION;

pub const HEARTBEAT_MS: u64 = 15_000;
pub const PRESENCE_GONE_MS: u64 = 45_000;
pub const IDLE_EXIT_MS: u64 = 300_000;
pub const POLL_MS: u64 = 250;

#[derive(Debug, thiserror::Error)]
pub enum ServerError {
    #[error("store: {0}")]
    Store(#[from] graphene_store::StoreError),
    #[error("io: {0}")]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Discovery(#[from] discovery::DiscoveryError),
}

#[derive(Clone, Debug)]
pub struct Config {
    pub store_path: PathBuf,
    /// `0` asks the OS for a free port, which is what makes the whole thing
    /// configuration-free.
    pub port: u16,
    pub idle_exit: Option<Duration>,
}

impl Config {
    pub fn new(store_path: impl Into<PathBuf>) -> Self {
        Config {
            store_path: store_path.into(),
            port: 0,
            idle_exit: Some(Duration::from_millis(IDLE_EXIT_MS)),
        }
    }
}

pub(crate) struct Shared {
    pub exec: Mutex<Executor>,
    pub hub: Arc<Hub>,
    pub store_path: PathBuf,
    /// Per-graph high-water mark, so the watcher only folds what is new.
    pub watermarks: RwLock<BTreeMap<GraphId, graphene_core::time::Seq>>,
    pub last_activity: RwLock<std::time::Instant>,
}

impl Shared {
    pub(crate) async fn touch(&self) {
        *self.last_activity.write().await = std::time::Instant::now();
    }
}

/// A running server. Dropping the handle does not stop it; call [`Server::shutdown`].
pub struct Server {
    pub info: ServerInfo,
    shutdown: tokio::sync::oneshot::Sender<()>,
    joined: tokio::task::JoinHandle<()>,
}

impl Server {
    pub async fn start(config: Config) -> Result<Server, ServerError> {
        let store = Store::open(&config.store_path)?;
        let shared = Arc::new(Shared {
            exec: Mutex::new(Executor::new(store)),
            hub: Hub::new(),
            store_path: config.store_path.clone(),
            watermarks: RwLock::new(BTreeMap::new()),
            last_activity: RwLock::new(std::time::Instant::now()),
        });

        let app = router(Arc::clone(&shared));
        let listener =
            tokio::net::TcpListener::bind(SocketAddr::from(([127, 0, 0, 1], config.port))).await?;
        let port = listener.local_addr()?.port();

        let info = ServerInfo {
            pid: std::process::id(),
            port,
            protocol: PROTOCOL_VERSION,
            store: config.store_path.clone(),
            started_at: now_millis(),
        };
        discovery::write(&config.store_path, &info)?;

        let (shutdown, rx) = tokio::sync::oneshot::channel();
        let serve_shared = Arc::clone(&shared);
        let store_path = config.store_path.clone();
        let idle_exit = config.idle_exit;

        let joined = tokio::spawn(async move {
            let watcher = tokio::spawn(watch::run(Arc::clone(&serve_shared)));
            let presence = tokio::spawn(watch::presence(Arc::clone(&serve_shared)));
            let idle = tokio::spawn(watch::idle_exit(Arc::clone(&serve_shared), idle_exit));

            let _ = axum::serve(listener, app)
                .with_graceful_shutdown(async {
                    tokio::select! {
                        _ = rx => {}
                        _ = idle => {}
                    }
                })
                .await;

            watcher.abort();
            presence.abort();
            discovery::clear(&store_path);
        });

        Ok(Server { info, shutdown, joined })
    }

    pub fn url(&self) -> String {
        self.info.url()
    }

    pub fn http(&self) -> String {
        self.info.http()
    }

    pub async fn shutdown(self) {
        let _ = self.shutdown.send(());
        let _ = self.joined.await;
    }
}

fn router(shared: Arc<Shared>) -> Router {
    Router::new()
        .route("/", get(assets::index))
        .route("/{*path}", get(assets::asset))
        .route("/ws", get(ws::upgrade))
        .route("/api/health", get(health))
        .route("/api/graphs", get(list_graphs))
        .route("/api/graph/{id}", get(get_graph))
        .route("/api/node/{graph}/{id}", get(get_node))
        .route("/api/why/{graph}/{id}", get(get_why))
        .route("/api/awaiting/{graph}", get(get_awaiting))
        .route("/events", get(ws::sse))
        .with_state(shared)
}

/// Every HTTP route is a **read**. There is no write endpoint anywhere, which is
/// what lets the UI ship with no auth surface.
async fn health(AxumState(s): AxumState<Arc<Shared>>) -> impl IntoResponse {
    Json(serde_json::json!({
        "ok": true,
        "protocol": PROTOCOL_VERSION,
        "store": s.store_path,
        "sessions": s.hub.sessions_on(&GraphId::from_seed("")).await.len(),
    }))
}

async fn list_graphs(AxumState(s): AxumState<Arc<Shared>>) -> impl IntoResponse {
    let exec = s.exec.lock().await;
    match exec.store().list(&ListFilter { include_terminal: true, ..Default::default() }) {
        Ok(v) => Json(serde_json::to_value(v).unwrap_or_default()).into_response(),
        Err(e) => error_response(e.to_string()),
    }
}

async fn get_graph(
    AxumState(s): AxumState<Arc<Shared>>,
    axum::extract::Path(id): axum::extract::Path<String>,
) -> impl IntoResponse {
    let Ok(graph) = GraphId::parse(&id) else {
        return error_response(format!("`{id}` is not a graph id"));
    };
    let exec = s.exec.lock().await;
    match exec.store().state(&graph) {
        Ok(state) => Json(serde_json::to_value(state).unwrap_or_default()).into_response(),
        Err(e) => error_response(e.to_string()),
    }
}

async fn get_node(
    AxumState(s): AxumState<Arc<Shared>>,
    axum::extract::Path((graph, id)): axum::extract::Path<(String, String)>,
) -> impl IntoResponse {
    let (Ok(graph), Ok(node)) = (GraphId::parse(&graph), NodeId::parse(&id)) else {
        return error_response("malformed ids".to_string());
    };
    let exec = s.exec.lock().await;
    if let Ok(view) = exec.human_node(&graph, &node) {
        return Json(serde_json::to_value(view).unwrap_or_default()).into_response();
    }
    match exec.store().state(&graph) {
        Ok(state) => match state.nodes.get(&node) {
            Some(n) => Json(serde_json::to_value(n).unwrap_or_default()).into_response(),
            None => error_response(format!("no node `{node}`")),
        },
        Err(e) => error_response(e.to_string()),
    }
}

async fn get_why(
    AxumState(s): AxumState<Arc<Shared>>,
    axum::extract::Path((graph, id)): axum::extract::Path<(String, String)>,
) -> impl IntoResponse {
    let Ok(graph) = GraphId::parse(&graph) else {
        return error_response("malformed graph id".to_string());
    };
    let exec = s.exec.lock().await;
    match exec.store().state(&graph) {
        Ok(state) => {
            let belief = graphene_core::id::BeliefId::parse(&id).ok();
            let payload = belief
                .and_then(|b| state.beliefs.get(&b).cloned())
                .map(|b| serde_json::to_value(b).unwrap_or_default());
            match payload {
                Some(v) => Json(v).into_response(),
                None => error_response(format!("no belief `{id}`")),
            }
        }
        Err(e) => error_response(e.to_string()),
    }
}

async fn get_awaiting(
    AxumState(s): AxumState<Arc<Shared>>,
    axum::extract::Path(graph): axum::extract::Path<String>,
) -> impl IntoResponse {
    let Ok(graph) = GraphId::parse(&graph) else {
        return error_response("malformed graph id".to_string());
    };
    let exec = s.exec.lock().await;
    match exec.awaiting(&graph) {
        Ok(v) => Json(serde_json::to_value(v).unwrap_or_default()).into_response(),
        Err(e) => error_response(e.to_string()),
    }
}

fn error_response(message: String) -> axum::response::Response {
    (axum::http::StatusCode::NOT_FOUND, Json(serde_json::json!({ "error": message })))
        .into_response()
}

pub(crate) fn now_millis_ts() -> graphene_core::time::Timestamp {
    graphene_core::time::Timestamp(now_millis())
}

pub(crate) fn now_millis() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0)
}
