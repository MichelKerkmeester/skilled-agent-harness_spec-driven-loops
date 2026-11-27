//! The answers that write, checked argv by argv.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::state::ItemId;

/// The deny key writes the deny scope and the approve key writes once, each with its own word.
#[test]
fn argv_is_exactly_answer_id_text_scope() {
    flow(
        "af-argv-is-exactly-answer-id-text-scope",
        "ok",
        |app, fx| {
            open(app, HELLO);
            assert_frame("Decision overlay, idle", &draw(app), &[]);
            assert_eq!(
                press(app, Key::Char('n')),
                None,
                "the deny key sends no quit"
            );
            assert!(app.settle(SETTLE), "the deny lands");
            assert_eq!(answers(fx), vec![answer_line(fx, "deny", HELLO, "deny")]);
            assert_eq!(phase(app), None, "the overlay closes on the reply");
        },
    );

    flow(
        "af-argv-is-exactly-answer-id-text-scope-approve",
        "ok",
        |app, fx| {
            open(app, HELLO);
            assert_eq!(
                press(app, Key::Char('y')),
                None,
                "the approve key sends no quit"
            );
            assert!(app.settle(SETTLE), "the approve lands");
            assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "approve")]);
        },
    );
}

/// A digit picks an option only inside the overlay, so the inbox list keeps its own keys.
#[test]
fn digit_picks_option_inside_overlay_only() {
    flow(
        "af-digit-picks-option-inside-overlay-only",
        "ok",
        |app, fx| {
            select(app, DIGEST);
            assert_eq!(press(app, Key::Char('2')), None, "the digit sends no quit");
            assert_eq!(phase(app), None, "a digit opens no overlay");
            assert!(app.settle(SETTLE), "the digit sends nothing");
            assert!(answers(fx).is_empty(), "{:?}", answers(fx));
            assert_reads_logged(fx);

            press(app, Key::Enter);
            let overlay = app.state.overlay.as_ref().expect("the overlay opens");
            assert_eq!(overlay.item_id, ItemId(DIGEST.to_string()));
            assert_frame("Choice overlay, numbered options", &draw(app), &[]);

            assert_eq!(press(app, Key::Char('2')), None, "the pick sends no quit");
            assert!(app.settle(SETTLE), "the pick lands");
            assert_eq!(answers(fx), vec![answer_line(fx, "once", DIGEST, "chat")]);
        },
    );
}

/// A typed line is sent as the answer text with the once scope.
#[test]
fn free_text_answer_writes_typed_line() {
    flow("af-free-text-answer-writes-typed-line", "ok", |app, fx| {
        open(app, HELLO);
        assert_eq!(
            press(app, Key::Char('t')),
            None,
            "the type key sends no quit"
        );
        type_text(app, "hold");
        assert_eq!(press(app, Key::Enter), None, "the send key sends no quit");
        assert!(app.settle(SETTLE), "the typed line lands");
        assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "hold")]);
    });
}

/// Text mode takes a leading y as text, so a typed line may begin with the approve key.
#[test]
fn text_mode_accepts_a_leading_y() {
    flow("af-text-mode-accepts-a-leading-y", "ok", |app, fx| {
        open(app, HELLO);
        press(app, Key::Char('t'));
        type_text(app, "yes, after the freeze");
        press(app, Key::Enter);
        assert!(app.settle(SETTLE), "the typed line lands");
        assert_eq!(
            answers(fx),
            vec![answer_line(fx, "once", HELLO, "yes, after the freeze")]
        );
    });
}

/// A line that starts with a dash reaches the CLI after the terminator, so it is read as text.
#[test]
fn dash_led_text_follows_the_terminator() {
    flow(
        "af-dash-led-text-follows-the-terminator",
        "ok",
        |app, fx| {
            open(app, HELLO);
            press(app, Key::Char('t'));
            type_text(app, "-1");
            press(app, Key::Enter);
            assert!(app.settle(SETTLE), "the typed line lands");
            assert_eq!(answers(fx), vec![answer_line(fx, "once", HELLO, "-1")]);
        },
    );
}

/// The screen sends reject with the once scope and the runtime records that as a deny, so this test proves the screen's half.
#[test]
fn review_reject_records_deny() {
    flow("af-review-reject-records-deny", "ok", |app, fx| {
        let mut rows = app.state.inbox.rows.clone();
        rows.push(review_item());
        inject_inbox(app, rows);
        open(app, REVIEW);
        assert_eq!(press(app, Key::Char('2')), None, "the pick sends no quit");
        assert!(app.settle(SETTLE), "the reject lands");
        assert_eq!(answers(fx), vec![answer_line(fx, "once", REVIEW, "reject")]);
        assert_eq!(phase(app), None, "the overlay closes on the reply");
    });
}
