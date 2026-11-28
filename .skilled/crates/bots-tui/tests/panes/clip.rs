//! The display-width cut, including a double-width cell.

use super::support::*;
use bots_tui::model::{InboxItem, ItemState};
use bots_tui::state::{ItemId, Payload, State, Tab};
use bots_tui::theme::Theme;
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::buffer::Buffer;
use ratatui::Terminal;
use unicode_width::UnicodeWidthStr;

/// The frame width every case draws at.
const COLS: u16 = 80;

/// The frame height every case draws at.
const ROWS: u16 = 24;

/// The frame row the one landed item draws on.
const ROW: u16 = 5;

/// A question of `a` letters, then the rocket, then a combining mark and a tail.
fn question(a: usize) -> String {
    let mut text = "a".repeat(a);
    text.push('\u{1f680}');
    text.push('e');
    text.push('\u{301}');
    text.push_str("tail");
    text
}

/// A state at 80x24 on the inbox tab with one open item carrying this question.
fn inbox_state(asked: &str) -> State {
    let mut state = base(COLS, ROWS, Tab::Inbox);
    land(
        &mut state,
        Payload::Inbox(vec![InboxItem {
            id: ItemId("i1".to_string()),
            bot_id: "hello".to_string(),
            question: asked.to_string(),
            state: ItemState::Open,
            at: NOW.to_string(),
            expires_at: NOW.to_string(),
            ..InboxItem::default()
        }]),
    );
    state
}

/// Draws the pane body at 80x24 and returns the buffer it wrote.
fn draw_buffer(state: &State, opts: Options) -> Buffer {
    let mut terminal =
        Terminal::new(TestBackend::new(COLS, ROWS)).expect("the test terminal opens");
    terminal
        .draw(|frame| {
            let body = view::bands(frame.area()).body;
            view::panes::draw(frame, body, state, &Theme::new(&opts));
        })
        .expect("the frame draws");
    terminal.backend().buffer().clone()
}

/// The symbols of the item row, every cell in order.
fn row_cells(buffer: &Buffer) -> Vec<String> {
    (0..COLS)
        .map(|x| buffer[(x, ROW)].symbol().to_string())
        .collect()
}

/// Asserts every double-width cell of the row keeps its second column inside the width.
fn assert_wide_cells_whole(cells: &[String], label: &str) {
    for (x, cell) in cells.iter().enumerate() {
        if UnicodeWidthStr::width(cell.as_str()) == 2 {
            assert!(
                x + 1 < cells.len(),
                "{label}: the wide cell at column {x} has no column to its right"
            );
        }
    }
}

/// A question cut inside the width never splits a double-width cell.
#[test]
fn clip_never_splits_a_wide_cell() {
    // The rocket would need the last two columns, so the cut lands on it.
    let state = inbox_state(&question(37));
    let cells = row_cells(&draw_buffer(&state, Options::default()));
    assert_eq!(
        cells[78], "\u{2026}",
        "the cut mark sits in the last column it may use"
    );
    assert!(
        !cells.iter().any(|cell| cell.contains('\u{1f680}')),
        "a double-width cell that does not fit is dropped whole"
    );
    assert_eq!(cells[79], " ", "the cut stops one column short of the edge");
    assert_wide_cells_whole(&cells, "the rocket cut");

    // The rocket fits whole, so the cut lands on the combining mark that follows it.
    let state = inbox_state(&question(36));
    let cells = row_cells(&draw_buffer(&state, Options::default()));
    assert_eq!(
        cells[77], "\u{1f680}",
        "the rocket starts in the column it fits in"
    );
    assert_eq!(
        cells[79], "\u{2026}",
        "the cut mark sits in the last column"
    );
    assert!(
        !cells.iter().any(|cell| cell.contains('\u{301}')),
        "a combining mark is dropped with the base it modifies"
    );
    assert_wide_cells_whole(&cells, "the rocket kept");

    // The ASCII cut marks the same question with three dots.
    let state = inbox_state(&question(37));
    let cells = row_cells(&draw_buffer(
        &state,
        Options {
            mono: false,
            ascii: true,
        },
    ));
    assert_eq!(cells[77], ".", "the ascii cut starts in column 77");
    assert_eq!(cells[78], ".", "the ascii cut fills column 78");
    assert_eq!(cells[79], ".", "the ascii cut ends in the last column");
    assert_wide_cells_whole(&cells, "the ascii cut");
}
