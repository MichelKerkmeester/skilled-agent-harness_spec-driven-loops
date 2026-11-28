//! The chat tab: its frames against the approved chat mockups, and the flows behind them.
//! An integration test file is a crate root, so each group names its file under `tests/chat/`.
mod common;
#[path = "chat/flow.rs"]
mod flow;
#[path = "chat/snapshot.rs"]
mod snapshot;
#[path = "chat/support.rs"]
mod support;
