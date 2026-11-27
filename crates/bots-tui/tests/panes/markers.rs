//! The marker column, in both glyph sets.

use super::support::*;
use bots_tui::model::{ActivityGroup, ActivityRow, RunState};
use bots_tui::state::{Payload, Tab};
use bots_tui::Options;

/// One group per state word, each holding one row, so every marker lands on its own line.
fn groups_of(raws: &[&str]) -> Vec<ActivityGroup> {
    raws.iter()
        .enumerate()
        .map(|(i, raw)| ActivityGroup {
            id: format!("g{i}"),
            title: format!("Group {i}"),
            rows: vec![ActivityRow {
                bot_id: format!("b{i}"),
                identity: "x".to_string(),
                state: RunState::from_raw(raw),
                at: NOW.to_string(),
                ..ActivityRow::default()
            }],
        })
        .collect()
}

/// The symbol one column of a drawn row holds.
fn cell(line: &str, column: usize) -> String {
    line.chars().skip(column).take(1).collect()
}

/// Every run state draws its own ASCII marker in the marker column.
#[test]
fn panes_draw_the_ascii_markers() {
    let mut state = base(80, 24, Tab::Activity);
    let raws = [
        "working",
        "done",
        "failed",
        "needs_you",
        "stopped",
        "scheduled",
        "recurring",
        "some-new-state",
    ];
    land(&mut state, Payload::Activity(groups_of(&raws)));
    // Eight groups draw sixteen lines, so the body is drawn taller than the state's own size
    // and every marker lands inside it.
    let (drawn, _) = draw_body(
        &state,
        80,
        40,
        Options {
            mono: false,
            ascii: true,
        },
    );
    let marks = ["*", "+", "x", "!", "-", "o", "r", "?"];
    for (i, mark) in marks.iter().enumerate() {
        let row = 6 + 2 * i;
        assert_eq!(cell(&drawn[row], 2), *mark, "row {row}");
    }
    assert!(drawn[6].starts_with("> "), "{}", drawn[6]);
}

/// The scheduled, recurring and unknown states keep their own glyph and an empty state reads missing.
#[test]
fn scheduled_recurring_and_unknown_carry_their_own_glyph() {
    let mut state = base(80, 24, Tab::Activity);
    let raws = ["scheduled", "recurring", "some-new-state", ""];
    land(&mut state, Payload::Activity(groups_of(&raws)));
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    let marks = ["\u{25cb}", "\u{21bb}", "?", "?"];
    for (i, mark) in marks.iter().enumerate() {
        let row = 6 + 2 * i;
        assert_eq!(cell(&drawn[row], 2), *mark, "row {row}");
    }
    assert!(drawn[10].contains("some-new-state"), "{}", drawn[10]);
    assert!(drawn[12].contains("missing"), "{}", drawn[12]);
}
