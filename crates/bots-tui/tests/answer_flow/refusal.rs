//! Refusals, gone items and expired items.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::model::ItemState;
use bots_tui::state::{ItemId, Phase};

/// A refusal draws the runtime's own stderr line and leaves the item open to a retry.
#[test]
fn refusal_shows_stderr_and_keeps_item() {
    flow(
        "af-refusal_shows_stderr_and_keeps_item",
        "refuse-answer-not-approver",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(press(app, Key::Char('y')), None);
            assert!(app.settle(SETTLE));

            assert_eq!(
                phase(app),
                Some(Phase::Refused("bots: answer-not-approver".to_string()))
            );
            let overlay = app.state.overlay.as_ref().expect("the overlay stays open");
            assert_eq!(overlay.item_id, ItemId(HELLO.to_string()));
            assert_eq!(
                app.state.last_error.as_ref().map(|line| line.text.as_str()),
                Some("bots: answer-not-approver")
            );
            let row = app
                .state
                .inbox
                .rows
                .iter()
                .find(|item| item.id == ItemId(HELLO.to_string()))
                .expect("the hello row is still listed");
            assert_eq!(row.state, ItemState::Open);
            assert_eq!(draw(app)[21].trim_end(), "bots: answer-not-approver");
            assert_frame("Decision overlay, refused", &draw(app), &[]);
            assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "approve")]);
        },
    );
}

/// A busy item refuses the answer and keeps the overlay live, so a second press writes again.
#[test]
fn item_busy_refusal_keeps_the_overlay() {
    flow(
        "af-item_busy_refusal_keeps_the_overlay",
        "refuse-item-busy",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(press(app, Key::Char('y')), None);
            assert!(app.settle(SETTLE));

            assert_eq!(
                phase(app),
                Some(Phase::Refused("bots: item-busy".to_string()))
            );
            let overlay = app.state.overlay.as_ref().expect("the overlay stays open");
            assert_eq!(overlay.item_id, ItemId(HELLO.to_string()));
            assert_eq!(draw(app)[21].trim_end(), "bots: item-busy");

            assert_eq!(press(app, Key::Char('y')), None);
            assert!(app.settle(SETTLE));
            assert_eq!(answers(fx).len(), 2);
        },
    );
}

/// A gone-class refusal moves the overlay to gone, so no later key writes a second answer.
#[test]
fn gone_class_refusal_moves_to_gone() {
    flow(
        "af-gone_class_refusal_moves_to_gone",
        "refuse-item-answered-differently",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(press(app, Key::Char('y')), None);
            assert!(app.settle(SETTLE));

            assert_eq!(phase(app), Some(Phase::Gone));
            assert_eq!(draw(app)[21].trim_end(), "bots: item-answered-differently");
            assert_frame("Decision overlay, gone", &draw(app), &[21]);

            for key in [
                Key::Char('y'),
                Key::Char('n'),
                Key::Char('t'),
                Key::Enter,
                Key::Char('1'),
            ] {
                assert_eq!(press(app, key), None, "{key:?} sends nothing");
                assert_eq!(phase(app), Some(Phase::Gone), "{key:?} keeps the phase");
            }
            assert!(app.settle(SETTLE));
            assert_eq!(answers(fx).len(), 1);
        },
    );
}

/// An item that leaves the inbox while its overlay is open disables every answer key.
#[test]
fn gone_item_disables_keys() {
    flow("af-gone_item_disables_keys", "ok", |app, fx| {
        open(app, HELLO);
        let rows = rows_without(app, HELLO);
        inject_inbox(app, rows);
        assert_eq!(phase(app), Some(Phase::Gone));
        assert_frame("Decision overlay, gone", &draw(app), &[]);

        for key in [
            Key::Char('y'),
            Key::Char('n'),
            Key::Char('t'),
            Key::Enter,
            Key::Char('1'),
            Key::Backspace,
        ] {
            assert_eq!(press(app, key), None, "{key:?} sends nothing");
            assert_eq!(phase(app), Some(Phase::Gone), "{key:?} keeps the phase");
        }

        assert_eq!(press(app, Key::Esc), None);
        assert_eq!(phase(app), None);
        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });
}

/// An expired item opens gone, says so and cannot be answered.
#[test]
fn expired_item_cannot_be_answered() {
    flow("af-expired_item_cannot_be_answered", "ok", |app, fx| {
        open(app, ARCHIVE);
        assert_eq!(phase(app), Some(Phase::Gone));
        let drawn = draw(app);
        assert!(
            drawn
                .iter()
                .any(|row| row.contains("archive \u{b7} expired")),
            "{drawn:?}"
        );
        assert!(
            drawn
                .iter()
                .any(|row| row.contains("status   This item is no longer open. Esc closes.")),
            "{drawn:?}"
        );

        for key in [
            Key::Char('y'),
            Key::Char('n'),
            Key::Char('t'),
            Key::Enter,
            Key::Char('1'),
        ] {
            assert_eq!(press(app, key), None, "{key:?} sends nothing");
            assert_eq!(phase(app), Some(Phase::Gone), "{key:?} keeps the phase");
        }

        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
        assert!(app
            .state
            .inbox
            .rows
            .iter()
            .any(|item| item.id == ItemId(ARCHIVE.to_string())));
    });
}
