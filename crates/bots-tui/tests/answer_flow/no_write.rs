//! The paths that must write nothing.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::model::ItemState;
use bots_tui::state::{ItemId, Msg, Phase};

/// Esc closes the overlay and leaves the item open, so closing writes nothing.
#[test]
fn esc_closes_overlay_and_writes_nothing() {
    flow(
        "af-esc_closes_overlay_and_writes_nothing",
        "ok",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(press(app, Key::Esc), None);
            assert_eq!(phase(app), None);
            assert!(app.settle(SETTLE));
            assert_reads_logged(fx);
            let written = answers(fx);
            assert!(written.is_empty(), "{written:?}");
            let row = app
                .state
                .inbox
                .rows
                .iter()
                .find(|item| item.id == ItemId(HELLO.to_string()))
                .expect("the hello row is still listed");
            assert_eq!(row.state, ItemState::Open);
        },
    );
}

/// A closed stdin quits the loop and writes nothing, even with an overlay open.
#[test]
fn closed_input_writes_nothing() {
    flow("af-closed_input_writes_nothing", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(app.handle(Msg::InputClosed), Some(0));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });
}

/// Ctrl+C closes the overlay and writes nothing, and quits once no overlay is open.
#[test]
fn ctrl_c_closes_overlay_and_writes_nothing() {
    flow(
        "af-ctrl_c_closes_overlay_and_writes_nothing",
        "ok",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(press(app, Key::Ctrl('c')), None);
            assert_eq!(phase(app), None);
            assert!(app.settle(SETTLE));
            assert_reads_logged(fx);
            let written = answers(fx);
            assert!(written.is_empty(), "{written:?}");
            assert_eq!(press(app, Key::Ctrl('c')), Some(0));
        },
    );
}

/// Every key the overlay does not bind leaves the phase alone and writes nothing.
#[test]
fn unbound_key_writes_nothing() {
    flow("af-unbound_key_writes_nothing", "ok", |app, fx| {
        open(app, HELLO);
        let unbound = [
            Key::Char('x'),
            Key::Char('a'),
            Key::Char('1'),
            Key::Enter,
            Key::Other,
            Key::Backspace,
            Key::Alt('2'),
            Key::Char('?'),
        ];
        for key in unbound {
            assert_eq!(press(app, key), None, "{key:?} sends nothing");
            assert_eq!(phase(app), Some(Phase::Idle), "{key:?} keeps the phase");
        }
        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });
}

/// A blank typed line sends nothing and leaves the overlay in text mode.
#[test]
fn blank_line_sends_nothing() {
    flow("af-blank_line_sends_nothing", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(press(app, Key::Char('t')), None);
        type_text(app, "   ");
        assert_eq!(press(app, Key::Enter), None);
        assert_eq!(phase(app), Some(Phase::Typing));
        let buffer = app
            .state
            .overlay
            .as_ref()
            .expect("the overlay stays open")
            .buffer
            .clone();
        assert_eq!(buffer, "   ");
        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });
}

/// Text mode pauses every single-key shortcut, so a typed y or n never answers.
#[test]
fn typing_pauses_single_key_shortcuts() {
    flow("af-typing_pauses_single_key_shortcuts", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(press(app, Key::Char('t')), None);
        type_text(app, "ship it after the freeze");
        assert_frame("Decision overlay, typing", &draw(app), &[]);
        type_text(app, " no y");
        assert_eq!(phase(app), Some(Phase::Typing));
        let buffer = app
            .state
            .overlay
            .as_ref()
            .expect("the overlay stays open")
            .buffer
            .clone();
        assert_eq!(buffer, "ship it after the freeze no y");
        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });
}

/// A bracketed paste never answers, and only a text-mode overlay takes its text.
#[test]
fn paste_never_answers() {
    flow("af-paste_never_answers", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(app.handle(Msg::Paste("y\n".to_string())), None);
        assert_eq!(phase(app), Some(Phase::Idle));
        assert_eq!(press(app, Key::Esc), None);
        assert_eq!(phase(app), None);
        assert_eq!(app.handle(Msg::Paste("y\n".to_string())), None);
        assert_eq!(phase(app), None);
        open(app, HELLO);
        assert_eq!(press(app, Key::Char('t')), None);
        assert_eq!(app.handle(Msg::Paste("y\n".to_string())), None);
        let buffer = app
            .state
            .overlay
            .as_ref()
            .expect("the overlay stays open")
            .buffer
            .clone();
        assert_eq!(buffer, "y ");
        assert_eq!(phase(app), Some(Phase::Typing));
        assert!(app.settle(SETTLE));
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
    });
}
