//! The detail column and the rule at 120 columns.

use super::support::*;
use bots_tui::model::{Grant, InboxItem, ItemState};
use bots_tui::state::{ItemId, Payload, State, Tab};
use bots_tui::Options;

/// The column the vertical rule draws in on a wide body.
const RULE: usize = 72;

/// The column the detail column starts in on a wide body.
const DETAIL: usize = 73;

/// The first body row of a frame, the row the pane title draws on.
const FIRST: usize = 3;

/// The last body row of a 40-row frame.
const LAST_WIDE: usize = 35;

/// The last body row of a 24-row frame.
const LAST_NARROW: usize = 19;

/// The rule a wide body draws between the list and the detail column.
const BAR: char = '\u{2502}';

/// Draws the pane body at one size and returns every row's cells.
fn body(state: &State, cols: u16, rows: u16) -> Vec<String> {
    draw_body(state, cols, rows, Options::default()).0
}

/// The drawn body rows up to the last one, each with the frame row it draws on.
fn body_rows<'a>(drawn: &'a [String], last: usize) -> impl Iterator<Item = (usize, &'a str)> + 'a {
    drawn
        .iter()
        .enumerate()
        .take(last.saturating_add(1))
        .skip(FIRST)
        .map(|(y, row)| (y, row.as_str()))
}

/// The symbol one drawn row holds at a column or a space when the row stops short.
fn cell(row: &str, column: usize) -> char {
    row.chars().nth(column).unwrap_or(' ')
}

/// The detail column of one drawn row, from the column after the rule.
fn detail(row: &str) -> String {
    row.chars().skip(DETAIL).collect()
}

/// The row of the detail column that reads exactly one line.
fn detail_row(drawn: &[String], line: &str) -> Option<usize> {
    body_rows(drawn, LAST_WIDE)
        .find(|(_, row)| detail(row).trim_end() == line)
        .map(|(y, _)| y)
}

/// The detail column draws beside the list at 120 columns and never below it.
#[test]
fn detail_draws_as_a_right_column_at_120() {
    let state = frame_state("Shell, Activity tab, rows", 120, 40);
    let drawn = body(&state, 120, 40);
    for (y, row) in body_rows(&drawn, LAST_WIDE) {
        assert_eq!(cell(row, RULE), BAR, "row {y} holds the rule");
    }
    assert_eq!(detail(&drawn[FIRST]).trim_end(), "Detail");

    let state = frame_state("Shell, Activity tab, rows", 80, 24);
    let drawn = body(&state, 80, 24);
    for (y, row) in body_rows(&drawn, LAST_NARROW) {
        assert!(!row.contains(BAR), "row {y} holds no rule at 80 columns");
        assert!(
            !row.contains("Detail"),
            "row {y} holds no detail at 80 columns"
        );
    }

    let item = InboxItem {
        id: ItemId("20261125T211204Z-7c1e9a40".to_string()),
        bot_id: "hello".to_string(),
        question: "Ship the release?".to_string(),
        state: ItemState::Open,
        at: NOW.to_string(),
        expires_at: NOW.to_string(),
        grants: Some(Grant {
            kind: "send".to_string(),
            rung: "kind".to_string(),
        }),
        ..InboxItem::default()
    };
    let mut state = base(120, 40, Tab::Inbox);
    land(&mut state, Payload::Inbox(vec![item.clone()]));
    let drawn = body(&state, 120, 40);
    let options =
        detail_row(&drawn, "options   none").expect("the detail column draws the options");
    assert_eq!(
        detail(&drawn[options + 1]).trim_end(),
        "grant     kind send \u{b7} rung kind"
    );

    let mut state = base(120, 40, Tab::Inbox);
    land(
        &mut state,
        Payload::Inbox(vec![InboxItem {
            grants: None,
            ..item
        }]),
    );
    let drawn = body(&state, 120, 40);
    for (y, row) in body_rows(&drawn, LAST_WIDE) {
        assert!(
            !detail(row).contains("grant"),
            "row {y} holds no grant line when the item carries none"
        );
    }

    for heading in ["Shell, Chat tab, placeholder", "Activity, loading"] {
        let state = frame_state(heading, 120, 40);
        let drawn = body(&state, 120, 40);
        for (y, row) in body_rows(&drawn, LAST_WIDE) {
            assert_eq!(cell(row, RULE), BAR, "{heading} row {y} holds the rule");
            assert!(!row.contains("Detail"), "{heading} row {y} holds no detail");
        }
    }
}
