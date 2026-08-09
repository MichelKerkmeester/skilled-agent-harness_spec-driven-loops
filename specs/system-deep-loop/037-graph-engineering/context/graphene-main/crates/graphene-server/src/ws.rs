use std::sync::Arc;

use axum::extract::ws::{Message, WebSocket, WebSocketUpgrade};
use axum::extract::{Query, State as AxumState};
use axum::response::sse::{Event as SseEvent, Sse};
use axum::response::IntoResponse;
use futures_util::stream::Stream;
use futures_util::{SinkExt, StreamExt};
use graphene_core::id::GraphId;
use graphene_core::time::Seq;
use tokio::sync::mpsc;

use crate::hub::Connection;
use crate::protocol::{ClientFrame, ErrorCode, PushEvent, ServerFrame, PROTOCOL_VERSION};
use crate::{watch, Shared};

pub(crate) async fn upgrade(
    ws: WebSocketUpgrade,
    AxumState(shared): AxumState<Arc<Shared>>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle(socket, shared))
}

async fn handle(socket: WebSocket, shared: Arc<Shared>) {
    let (mut sink, mut stream) = socket.split();

    let Some(Ok(Message::Text(first))) = stream.next().await else {
        return;
    };
    let hello: ClientFrame = match serde_json::from_str(&first) {
        Ok(f) => f,
        Err(e) => {
            let _ = sink
                .send(Message::Text(
                    serde_json::to_string(&ServerFrame::Error {
                        code: ErrorCode::Malformed,
                        message: e.to_string(),
                    })
                    .unwrap_or_default()
                    .into(),
                ))
                .await;
            return;
        }
    };

    let ClientFrame::Hello { session, graph, label, protocol, interests, since } = hello else {
        return;
    };

    if protocol != PROTOCOL_VERSION {
        let _ = sink
            .send(Message::Text(
                serde_json::to_string(&ServerFrame::Error {
                    code: ErrorCode::ProtocolMismatch,
                    message: format!(
                        "this server speaks protocol {PROTOCOL_VERSION}; the client speaks {protocol}"
                    ),
                })
                .unwrap_or_default()
                .into(),
            ))
            .await;
        return;
    }

    let (tx, mut rx) = mpsc::unbounded_channel::<ServerFrame>();

    let (seq, peers) = {
        let exec = shared.exec.lock().await;
        let state = exec.store().state(&graph).unwrap_or_default();
        (state.seq, shared.hub.peers(&graph, &state).await)
    };

    let _conn = shared
        .hub
        .join(Connection { session: session.clone(), graph: graph.clone(), label, interests, tx })
        .await;
    shared.touch().await;

    let welcome = ServerFrame::Welcome {
        protocol: PROTOCOL_VERSION,
        graph: graph.clone(),
        seq,
        sessions: peers,
    };
    if sink
        .send(Message::Text(serde_json::to_string(&welcome).unwrap_or_default().into()))
        .await
        .is_err()
    {
        shared.hub.leave(&session).await;
        return;
    }

    if let Some(since) = since {
        for (seq, event) in watch::replay_since(&shared, &graph, since).await {
            let frame = ServerFrame::Event { seq, event };
            if sink
                .send(Message::Text(serde_json::to_string(&frame).unwrap_or_default().into()))
                .await
                .is_err()
            {
                shared.hub.leave(&session).await;
                return;
            }
        }
    }

    shared.watermarks.write().await.entry(graph.clone()).or_insert(seq);

    let writer_session = session.clone();
    let writer_shared = Arc::clone(&shared);
    let writer = tokio::spawn(async move {
        while let Some(frame) = rx.recv().await {
            let text = serde_json::to_string(&frame).unwrap_or_default();
            if sink.send(Message::Text(text.into())).await.is_err() {
                break;
            }
        }
        writer_shared.hub.leave(&writer_session).await;
    });

    while let Some(Ok(msg)) = stream.next().await {
        match msg {
            Message::Text(t) => match serde_json::from_str::<ClientFrame>(&t) {
                Ok(ClientFrame::Heartbeat { session }) => {
                    let mut exec = shared.exec.lock().await;
                    let _ = exec.heartbeat(&graph, &session, crate::now_millis_ts());
                    shared.touch().await;
                }
                Ok(ClientFrame::Bye { session }) => {
                    shared.hub.leave(&session).await;
                    break;
                }
                _ => {}
            },
            Message::Close(_) => break,
            _ => {}
        }
    }

    shared.hub.leave(&session).await;
    writer.abort();
}

#[derive(serde::Deserialize)]
pub(crate) struct SseQuery {
    graph: String,
    #[serde(default)]
    since: Option<u64>,
}

/// The UI's read stream. Same events as the socket, no write path.
pub(crate) async fn sse(
    AxumState(shared): AxumState<Arc<Shared>>,
    Query(q): Query<SseQuery>,
) -> Sse<impl Stream<Item = Result<SseEvent, std::convert::Infallible>>> {
    let graph = GraphId::parse(&q.graph).ok();
    let since = Seq(q.since.unwrap_or(0));

    let stream = async_stream::stream(shared, graph, since);
    Sse::new(stream).keep_alive(axum::response::sse::KeepAlive::default())
}

mod async_stream {
    use super::*;
    use futures_util::stream::unfold;

    pub(super) fn stream(
        shared: Arc<Shared>,
        graph: Option<GraphId>,
        since: Seq,
    ) -> impl Stream<Item = Result<SseEvent, std::convert::Infallible>> {
        unfold(
            (shared, graph, since, Vec::new()),
            |(shared, graph, mut seq, mut queue)| async move {
                loop {
                    if let Some((s, event)) = queue.pop() {
                        let data = serde_json::to_string(&(s, &event)).unwrap_or_default();
                        return Some((
                            Ok(SseEvent::default().data(data)),
                            (shared, graph, seq, queue),
                        ));
                    }

                    tokio::time::sleep(std::time::Duration::from_millis(crate::POLL_MS)).await;

                    let Some(g) = &graph else {
                        return None;
                    };
                    let fresh: Vec<(Seq, PushEvent)> = watch::replay_since(&shared, g, seq).await;
                    if !fresh.is_empty() {
                        seq = fresh.iter().map(|(s, _)| *s).max().unwrap_or(seq);
                        queue = fresh;
                        queue.reverse();
                    }
                }
            },
        )
    }
}
