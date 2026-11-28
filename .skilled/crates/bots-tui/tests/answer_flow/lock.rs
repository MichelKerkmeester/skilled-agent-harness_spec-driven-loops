//! The in-flight lock.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::state::Phase;

/// A second press while an answer is out writes nothing, and the lock holds through every answer key.
#[test]
fn second_press_writes_nothing() {
    flow("af-second-press-writes-nothing", "ok", |app, fx| {
        open(app, HELLO);
        // The lock as the reducer holds it, set here so the test needs no process.
        app.state
            .overlay
            .as_mut()
            .expect("the overlay is open")
            .phase = Phase::Sending;
        assert_frame("Decision overlay, sending", &draw(app), &[]);

        for key in [
            Key::Char('y'),
            Key::Char('n'),
            Key::Char('t'),
            Key::Enter,
            Key::Char('1'),
        ] {
            assert_eq!(press(app, key), None, "{key:?} sends nothing");
            assert_eq!(phase(app), Some(Phase::Sending), "{key:?} keeps the lock");
        }

        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });

    flow("af-second-press-writes-nothing", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(press(app, Key::Char('y')), None);
        assert_eq!(phase(app), Some(Phase::Sending));
        assert_eq!(press(app, Key::Char('y')), None);
        assert_eq!(press(app, Key::Char('n')), None);
        assert_eq!(phase(app), Some(Phase::Sending));
        assert!(app.settle(SETTLE));
        assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "approve")]);
    });
}

/// A refresh that drops the answered row leaves the answer in flight and writes it once.
#[test]
fn refresh_while_sending_keeps_sending() {
    flow("af-refresh-while-sending-keeps-sending", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(press(app, Key::Char('y')), None);
        let rows = rows_without(app, HELLO);
        inject_inbox(app, rows);
        assert_eq!(phase(app), Some(Phase::Sending));
        assert!(app.settle(SETTLE));
        assert_eq!(phase(app), None);
        assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "approve")]);
    });
}

/// Closing the overlay mid-flight and reopening the row comes back locked, so the answer is written once.
#[test]
fn reopen_while_in_flight_stays_locked() {
    flow("af-reopen-while-in-flight-stays-locked", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(press(app, Key::Char('y')), None);
        assert_eq!(press(app, Key::Esc), None);
        assert_eq!(phase(app), None);
        assert_eq!(press(app, Key::Enter), None);
        assert_eq!(phase(app), Some(Phase::Sending));
        assert_eq!(press(app, Key::Char('y')), None);
        assert_eq!(press(app, Key::Char('n')), None);
        assert_eq!(phase(app), Some(Phase::Sending));
        assert!(app.settle(SETTLE));
        assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "approve")]);
    });
}
