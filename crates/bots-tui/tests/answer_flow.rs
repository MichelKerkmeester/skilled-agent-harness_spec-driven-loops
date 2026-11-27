//! The answer flow, proven from the fake CLI's argv log, so no test needs a terminal.
//! An integration test file is a crate root, so each group names its file under `tests/answer_flow/`.
mod common;
#[path = "answer_flow/lock.rs"]
mod lock;
#[path = "answer_flow/no_write.rs"]
mod no_write;
#[path = "answer_flow/refusal.rs"]
mod refusal;
#[path = "answer_flow/support.rs"]
mod support;
#[path = "answer_flow/writes.rs"]
mod writes;
