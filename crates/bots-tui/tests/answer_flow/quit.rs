//! The quit path, which never waits for an answer child and leaves its unread streams null.

use super::common::fixture::Fixture;
use super::support::*;
use bots_tui::keys::Key;
use bots_tui::state::Msg;
use std::time::{Duration, Instant};

/// Polls the fixture log until one line matches, so a test waits on the child rather than on a fixed sleep.
fn wait_for_line(fx: &Fixture, line: &str, limit: Duration) -> bool {
    let started = Instant::now();
    loop {
        if fx.logged().iter().any(|logged| logged == line) {
            return true;
        }
        if started.elapsed() >= limit {
            return false;
        }
        std::thread::sleep(Duration::from_millis(20));
    }
}

/// A quit returns at once while the answer child still runs, and its unread stdout is null.
#[test]
fn quit_does_not_wait_for_answer() {
    flow(
        "af-quit-does-not-wait-for-answer",
        "hold-answer",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(
                press(app, Key::Char('y')),
                None,
                "the approve key sends no quit"
            );
            assert!(
                wait_for_line(fx, "fixture-answer-started", Duration::from_secs(5)),
                "{:?}",
                fx.logged()
            );

            let started = Instant::now();
            assert_eq!(app.handle(Msg::InputClosed), Some(0));
            assert!(
                started.elapsed() < Duration::from_millis(1000),
                "the quit waited {:?} for the answer child",
                started.elapsed()
            );

            let logged = fx.logged();
            assert!(
                !logged.iter().any(|line| line == "fixture-answer-done"),
                "the loop returned before the child exited: {logged:?}"
            );
            // Stderr stays a pipe because a refused answer's line is read from it.
            assert!(
                logged
                    .iter()
                    .any(|line| line.starts_with("fixture-fds stdout=null")),
                "{logged:?}"
            );
            assert!(
                wait_for_line(fx, "fixture-answer-done", Duration::from_secs(5)),
                "the child was left running rather than killed: {:?}",
                fx.logged()
            );
        },
    );
}

/// A quit starts a queued answer detached, so its stdin, stdout and stderr are all null.
#[test]
fn quit_starts_a_queued_answer_detached() {
    flow(
        "af-quit-starts-a-queued-answer-detached",
        "slow-hold-answer",
        |app, fx| {
            open(app, HELLO);
            app.handle(Msg::Tick {
                now: NOW_MS + 10_000,
            });
            std::thread::sleep(Duration::from_millis(300));
            assert_eq!(
                press(app, Key::Char('y')),
                None,
                "the approve key queues the answer behind the running read"
            );

            let started = Instant::now();
            assert_eq!(app.handle(Msg::InputClosed), Some(0));
            assert!(
                started.elapsed() < Duration::from_millis(1500),
                "the quit waited {:?} for the queued answer",
                started.elapsed()
            );

            assert!(
                wait_for_line(
                    fx,
                    "fixture-fds stdout=null stderr=null",
                    Duration::from_secs(5)
                ),
                "{:?}",
                fx.logged()
            );
            assert!(
                wait_for_line(fx, "fixture-answer-done", Duration::from_secs(5)),
                "{:?}",
                fx.logged()
            );
        },
    );
}
