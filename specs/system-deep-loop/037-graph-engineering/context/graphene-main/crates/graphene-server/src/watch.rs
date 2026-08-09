//! Watching the store, presence, and idle exit.
//!
//! The server learns about writes by folding what is new, using the same code
//! path the writer used — so the effects it pushes are the effects that actually
//! happened, not a reconstruction.

use std::sync::Arc;
use std::time::Duration;

use graphene_core::fold::{apply, State};
use graphene_core::id::GraphId;
use graphene_core::time::Seq;

use crate::hub::coalesce;
use crate::{Shared, POLL_MS};

pub(crate) async fn run(shared: Arc<Shared>) {
    let mut ticker = tokio::time::interval(Duration::from_millis(POLL_MS));
    loop {
        ticker.tick().await;
        if let Err(e) = sweep(&shared).await {
            eprintln!("graphene: watcher: {e}");
        }
    }
}

async fn sweep(shared: &Arc<Shared>) -> Result<(), graphene_store::StoreError> {
    let graphs = {
        let exec = shared.exec.lock().await;
        exec.store().graph_ids()?
    };

    for graph in graphs {
        // Before folding what is new, make what has come due *become* new: a
        // lease that lapsed or a gate past its deadline is a state change with
        // no writer, so nothing would ever push it.
        {
            let mut exec = shared.exec.lock().await;
            if let Err(e) = exec.sweep_deadlines(&graph, now()) {
                eprintln!("graphene: sweep: {e}");
            }
        }
        push_new(shared, &graph).await?;
    }
    Ok(())
}

fn now() -> graphene_core::time::Timestamp {
    graphene_core::time::Timestamp(
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|d| d.as_millis() as i64)
            .unwrap_or(0),
    )
}

/// Fold the records this server has not seen, and push what they caused.
async fn push_new(shared: &Arc<Shared>, graph: &GraphId) -> Result<(), graphene_store::StoreError> {
    let watched = shared.hub.sessions_on(graph).await;
    if watched.is_empty() {
        let exec = shared.exec.lock().await;
        if let Ok(state) = exec.store().state(graph) {
            shared.watermarks.write().await.insert(graph.clone(), state.seq);
        }
        return Ok(());
    }

    let from = shared.watermarks.read().await.get(graph).copied().unwrap_or(Seq::ZERO);

    let records = {
        let exec = shared.exec.lock().await;
        exec.store().records(graph)?
    };
    if records.last().map(|r| r.seq).unwrap_or(Seq::ZERO) <= from {
        return Ok(());
    }

    let mut state = State::default();
    let mut effects = Vec::new();
    for r in &records {
        let applied = match apply(&mut state, r) {
            Ok(a) => a,
            Err(_) => continue,
        };
        if r.seq > from {
            effects.extend(applied.effects);
        }
    }

    let latest = state.seq;
    for (event, audience) in coalesce(&effects, &state) {
        shared.hub.deliver(graph, latest, event, &audience).await;
    }

    shared.watermarks.write().await.insert(graph.clone(), latest);
    shared.touch().await;
    Ok(())
}

/// Replay everything a reconnecting client missed, so a dropped connection never
/// loses an event.
pub(crate) async fn replay_since(
    shared: &Arc<Shared>,
    graph: &GraphId,
    since: Seq,
) -> Vec<(Seq, crate::protocol::PushEvent)> {
    let records = {
        let exec = shared.exec.lock().await;
        match exec.store().records(graph) {
            Ok(r) => r,
            Err(_) => return vec![],
        }
    };

    let mut state = State::default();
    let mut effects = Vec::new();
    for r in &records {
        let Ok(applied) = apply(&mut state, r) else { continue };
        if r.seq > since {
            effects.extend(applied.effects);
        }
    }

    let seq = state.seq;
    coalesce(&effects, &state).into_iter().map(|(e, _)| (seq, e)).collect()
}

/// Release the claims of sessions whose socket has gone.
///
/// This is the operational payoff of presence: a crashed session's work returns
/// to the pool in seconds rather than after a lease timeout.
pub(crate) async fn presence(shared: Arc<Shared>) {
    let mut ticker = tokio::time::interval(Duration::from_millis(POLL_MS * 4));
    loop {
        ticker.tick().await;

        let departed = shared.hub.departed().await;
        if departed.is_empty() {
            continue;
        }

        let orphaned = {
            let exec = shared.exec.lock().await;
            let mut out = Vec::new();
            for graph in exec.store().graph_ids().unwrap_or_default() {
                let Ok(state) = exec.store().state(&graph) else { continue };
                for (node, claim_id) in &state.active_claims {
                    let Some(claim) = state.claims.get(claim_id) else { continue };
                    if departed.contains(&claim.session) {
                        out.push((graph.clone(), node.clone(), claim.session.clone()));
                    }
                }
            }
            out
        };

        for (graph, node, session) in orphaned {
            if shared.hub.is_connected(&session).await {
                continue;
            }
            let mut exec = shared.exec.lock().await;
            let _ = exec.release(
                &graph,
                &node,
                Some("session socket closed".into()),
                crate::now_millis_ts(),
            );
        }

        for session in departed {
            if !shared.hub.is_connected(&session).await {
                shared.hub.forget_departed(&session).await;
            }
        }
    }
}

/// Exit after a grace period with nothing attached. No orphans, no supervision.
pub(crate) async fn idle_exit(shared: Arc<Shared>, after: Option<Duration>) {
    let Some(after) = after else {
        std::future::pending::<()>().await;
        return;
    };
    let mut ticker = tokio::time::interval(Duration::from_millis(POLL_MS * 4));
    loop {
        ticker.tick().await;
        let idle_for = shared.last_activity.read().await.elapsed();
        let connected = {
            let exec = shared.exec.lock().await;
            let mut any = false;
            for graph in exec.store().graph_ids().unwrap_or_default() {
                if !shared.hub.sessions_on(&graph).await.is_empty() {
                    any = true;
                    break;
                }
            }
            any
        };
        if !connected && idle_for > after {
            return;
        }
    }
}
