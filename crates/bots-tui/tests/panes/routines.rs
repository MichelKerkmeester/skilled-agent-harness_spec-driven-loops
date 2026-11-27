//! The routines pane, four lines per routine.

use super::support::*;
use bots_tui::model::{Routine, Start};
use bots_tui::state::{BotId, Payload, Tab};
use bots_tui::Options;

/// One drawn row with the padding the buffer fills it with taken off.
fn row(drawn: &[String], y: usize) -> &str {
    drawn[y].trim_end()
}

/// The first fixture routine on its own, so a count of one is drawn.
fn first_routine() -> Vec<Routine> {
    let mut routines = routines_fixture();
    routines.truncate(1);
    routines
}

/// One routine whose only start carries an expression and no summary, and which never ends.
fn expression_routine() -> Routine {
    Routine {
        bot_id: BotId("nightly-report".to_string()),
        what: "the nightly report".to_string(),
        starts: vec![Start {
            kind: "cron".to_string(),
            expression: Some("0 2 * * *".to_string()),
            ..Start::default()
        }],
        does: "act".to_string(),
        until: None,
        failure_streak: 1,
        switch: "enabled".to_string(),
        ..Routine::default()
    }
}

/// One routine that no start triggers.
fn startless_routine() -> Routine {
    Routine {
        bot_id: BotId("digest".to_string()),
        what: "the morning digest".to_string(),
        does: "tell".to_string(),
        switch: "enabled".to_string(),
        ..Routine::default()
    }
}

/// A routine draws its bot id, its sentence and its state line on three of its four lines.
#[test]
fn routine_row_draws_bot_id_sentence_and_state() {
    assert_body("Shell, Routines tab, rows");

    let mut state = base(80, 24, Tab::Routines);
    land(&mut state, Payload::Routines(first_routine()));
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());

    assert!(
        row(&drawn, 3).starts_with("Routines \u{b7} 1 routine"),
        "{}",
        row(&drawn, 3)
    );
    assert_eq!(row(&drawn, 5), "  \u{203a} digest");
    assert!(
        row(&drawn, 6)
            .contains("starts  every 6h \u{b7} does tell \u{b7} until \"the digest is sent\""),
        "{}",
        row(&drawn, 6)
    );
    assert_eq!(row(&drawn, 7), "    state   enabled \u{b7} streak 0");

    // A start with no summary draws its expression, and a routine with no stop condition
    // draws no until clause at all.
    let mut state = base(80, 24, Tab::Routines);
    land(&mut state, Payload::Routines(vec![expression_routine()]));
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    assert_eq!(row(&drawn, 6), "    starts  0 2 * * * \u{b7} does act");
    assert!(!row(&drawn, 6).contains("until"), "{}", row(&drawn, 6));

    // A routine that no start triggers still draws a start column.
    let mut state = base(80, 24, Tab::Routines);
    land(&mut state, Payload::Routines(vec![startless_routine()]));
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    assert_eq!(row(&drawn, 6), "    starts  - \u{b7} does tell");
}

/// The empty pane says what a routine is, so a reader with no routine knows what to write.
#[test]
fn routines_empty_line_says_what_a_routine_is() {
    assert_body("Routines, empty");

    let state = frame_state("Routines, empty", 80, 24);
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    let body = drawn[3..].join("\n");
    assert!(
        body.contains("A routine is the four-part block in a BOT.md"),
        "{body}"
    );
}
