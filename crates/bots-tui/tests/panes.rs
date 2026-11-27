//! The pane bodies, their states and the frames they must match.
//! An integration test file is a crate root, so each group names its file under `tests/panes/`.
#[path = "panes/activity.rs"]
mod activity;
#[path = "panes/budget.rs"]
mod budget;
#[path = "panes/chat.rs"]
mod chat;
#[path = "panes/clip.rs"]
mod clip;
mod common;
#[path = "panes/inbox.rs"]
mod inbox;
#[path = "panes/markers.rs"]
mod markers;
#[path = "panes/reorder.rs"]
mod reorder;
#[path = "panes/routines.rs"]
mod routines;
#[path = "panes/sanitize.rs"]
mod sanitize;
#[path = "panes/snapshot.rs"]
mod snapshot;
#[path = "panes/states.rs"]
mod states;
#[path = "panes/support.rs"]
mod support;
#[path = "panes/wide.rs"]
mod wide;
