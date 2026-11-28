mod common;

use std::sync::atomic::AtomicBool;

use bots_tui::cli::{answer, read};
use bots_tui::state::{FailKind, Payload, Scope, Surface};
use common::fixture::{fixture, Fixture};
use common::frames::load_frame;
use unicode_width::UnicodeWidthStr;

/// The one line the fixture logs for a read of this verb.
fn read_line(fx: &Fixture, verb: &str) -> String {
    format!("{verb} --json --repo {}", fx.dir.display())
}

#[test]
fn reads_status() {
    let fx = fixture("reads_status", "ok");
    let cancel = AtomicBool::new(false);
    let outcome = read(&fx.program, Surface::Status, &cancel).expect("the fixture answers a read");
    assert_eq!(fx.logged(), vec![read_line(&fx, "status")]);
    match outcome.payload {
        Payload::Status(payload) => {
            assert_eq!(payload.rows.len(), 7);
            assert_eq!(
                payload.rows.iter().filter(|row| row.kind == "bot").count(),
                4
            );
        }
        other => panic!("expected a status payload, got {other:?}"),
    }
}

#[test]
fn reads_activity() {
    let fx = fixture("reads_activity", "ok");
    let cancel = AtomicBool::new(false);
    let outcome =
        read(&fx.program, Surface::Activity, &cancel).expect("the fixture answers a read");
    assert_eq!(fx.logged(), vec![read_line(&fx, "activity")]);
    match outcome.payload {
        Payload::Activity(groups) => {
            assert_eq!(groups.len(), 7);
            let rows: usize = groups.iter().map(|group| group.rows.len()).sum();
            assert_eq!(rows, 10);
        }
        other => panic!("expected an activity payload, got {other:?}"),
    }
}

#[test]
fn reads_inbox() {
    let fx = fixture("reads_inbox", "ok");
    let cancel = AtomicBool::new(false);
    let outcome = read(&fx.program, Surface::Inbox, &cancel).expect("the fixture answers a read");
    assert_eq!(fx.logged(), vec![read_line(&fx, "inbox")]);
    match outcome.payload {
        Payload::Inbox(items) => assert_eq!(items.len(), 3),
        other => panic!("expected an inbox payload, got {other:?}"),
    }
}

#[test]
fn reads_routines() {
    let fx = fixture("reads_routines", "ok");
    let cancel = AtomicBool::new(false);
    let outcome =
        read(&fx.program, Surface::Routines, &cancel).expect("the fixture answers a read");
    assert_eq!(fx.logged(), vec![read_line(&fx, "routines")]);
    match outcome.payload {
        Payload::Routines(routines) => assert_eq!(routines.len(), 2),
        other => panic!("expected a routines payload, got {other:?}"),
    }
}

#[test]
fn answer_once_and_deny_are_logged() {
    let fx = fixture("answer_once_and_deny_are_logged", "ok");
    let cancel = AtomicBool::new(false);
    let inbox = read(&fx.program, Surface::Inbox, &cancel).expect("the fixture answers a read");
    let id = match inbox.payload {
        Payload::Inbox(items) => items.first().expect("the fixture lists an item").id.clone(),
        other => panic!("expected an inbox payload, got {other:?}"),
    };

    let once = answer(&fx.program, &id, "hold", Scope::Once, &cancel);
    assert!(once.is_ok(), "{once:?}");
    let deny = answer(&fx.program, &id, "deny", Scope::Deny, &cancel);
    assert!(deny.is_ok(), "{deny:?}");

    let repo = fx.dir.display();
    assert_eq!(
        fx.logged(),
        vec![
            format!("inbox --json --repo {repo}"),
            format!("answer --scope once --repo {repo} -- {} hold", id.0),
            format!("answer --scope deny --repo {repo} -- {} deny", id.0),
        ]
    );
}

#[test]
fn non_zero_exit_carries_stderr() {
    let fx = fixture("non_zero_exit_carries_stderr", "fail-status");
    let cancel = AtomicBool::new(false);
    let failed = read(&fx.program, Surface::Status, &cancel);
    let inbox = read(&fx.program, Surface::Inbox, &cancel).expect("the fixture answers a read");

    let repo = fx.dir.display();
    assert_eq!(
        fx.logged(),
        vec![
            format!("status --json --repo {repo}"),
            format!("inbox --json --repo {repo}"),
        ]
    );

    let error = failed.expect_err("the fixture fails a status read");
    assert_eq!(error.kind, FailKind::Exit(1));
    assert_eq!(error.line, "bots: status --json exited 1: index locked");
    match inbox.payload {
        Payload::Inbox(items) => assert_eq!(items.len(), 3),
        other => panic!("expected an inbox payload, got {other:?}"),
    }
}

#[test]
fn empty_scenario_reads_no_rows() {
    let fx = fixture("empty_scenario_reads_no_rows", "empty");
    let cancel = AtomicBool::new(false);
    let status = read(&fx.program, Surface::Status, &cancel).expect("the fixture answers a read");
    let inbox = read(&fx.program, Surface::Inbox, &cancel).expect("the fixture answers a read");

    let repo = fx.dir.display();
    assert_eq!(
        fx.logged(),
        vec![
            format!("status --json --repo {repo}"),
            format!("inbox --json --repo {repo}"),
        ]
    );

    match status.payload {
        Payload::Status(payload) => assert_eq!(payload.rows.len(), 0),
        other => panic!("expected a status payload, got {other:?}"),
    }
    match inbox.payload {
        Payload::Inbox(items) => assert_eq!(items.len(), 0),
        other => panic!("expected an inbox payload, got {other:?}"),
    }
}

#[test]
fn frame_loader_reads_frame_1() {
    let frame = load_frame("Shell, Activity tab, rows", "80x24");
    assert_eq!(frame.len(), 24);
    assert_eq!(frame[3].trim_end(), "Activity · 7 groups · 10 rows");
    for line in &frame {
        assert_eq!(line.width(), 80, "{line:?}");
    }

    let tall = load_frame("Shell, Activity tab, rows", "120x40");
    assert_eq!(tall.len(), 40);
}
