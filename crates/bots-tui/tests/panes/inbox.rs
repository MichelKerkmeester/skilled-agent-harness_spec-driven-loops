//! The inbox rows, their states and the expired note.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::model::{InboxItem, ItemState};
use bots_tui::state::{update, ItemId, Msg, Payload, State, Tab};
use bots_tui::theme::Theme;
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::buffer::Buffer;
use ratatui::style::Modifier;
use ratatui::Terminal;

/// The column the needs-you gutter draws in, the one cell that says a row can be answered.
const GUTTER: u16 = 4;

/// The column the detail column starts in on a wide body.
const DETAIL: u16 = 73;

/// Draws the pane body at one size and returns the buffer it wrote.
fn draw_buffer(state: &State, cols: u16, rows: u16, opts: Options) -> Buffer {
    let mut terminal =
        Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
    terminal
        .draw(|frame| {
            let body = view::bands(frame.area()).body;
            view::panes::draw(frame, body, state, &Theme::new(&opts));
        })
        .expect("the frame draws");
    terminal.backend().buffer().clone()
}

/// One drawn row as a string, every cell in order.
fn row_text(buffer: &Buffer, y: u16, cols: u16) -> String {
    (0..cols).map(|x| buffer[(x, y)].symbol()).collect()
}

/// The detail column of a wide body, every row joined by a newline.
fn detail_text(buffer: &Buffer, cols: u16, rows: u16) -> String {
    let mut text = String::new();
    for y in 0..rows {
        for x in DETAIL..cols {
            text.push_str(buffer[(x, y)].symbol());
        }
        text.push('\n');
    }
    text
}

/// Whether every cell of one span carries the dim modifier.
fn dimmed(buffer: &Buffer, y: u16, from: u16, to: u16) -> bool {
    (from..to).all(|x| buffer[(x, y)].modifier.contains(Modifier::DIM))
}

/// The inbox rows match the mockup frame at both sizes.
#[test]
fn inbox_rows_match_the_frame() {
    assert_body("Shell, Inbox tab, open and expired items");
}

/// An expired row draws dimmed with no gutter mark and its detail offers no answer key.
#[test]
fn expired_item_draws_dimmed_without_answer_key() {
    let mut state = frame_state("Shell, Inbox tab, open and expired items", 120, 40);
    update(&mut state, Msg::Key(Key::Down));
    update(&mut state, Msg::Key(Key::Down));
    let buffer = draw_buffer(&state, 120, 40, Options::default());

    assert_eq!(buffer[(GUTTER, 7)].symbol(), " ");
    let row = row_text(&buffer, 7, 120);
    assert!(row.contains("expired"), "{row}");
    assert!(dimmed(&buffer, 7, 6, 13), "the archive cells are dimmed");

    let detail = detail_text(&buffer, 120, 40);
    assert!(
        detail.contains("Enter shows it is no longer open."),
        "{detail}"
    );
    assert!(!detail.contains("Enter opens the overlay."), "{detail}");

    assert_eq!(buffer[(GUTTER, 5)].symbol(), "!");
    assert!(!dimmed(&buffer, 5, 0, 72), "the open row is not dimmed");
}

/// An answered row draws its outcome word in place of its state word and offers no answer key.
#[test]
fn answered_row_draws_its_outcome_word() {
    assert_body("Inbox, answered row");
    let state = frame_state("Inbox, answered row", 120, 40);
    let buffer = draw_buffer(&state, 120, 40, Options::default());

    assert_eq!(buffer[(GUTTER, 5)].symbol(), " ");
    let row = row_text(&buffer, 5, 120);
    assert!(row.contains("approved"), "{row}");
    assert!(dimmed(&buffer, 5, 6, 11), "the hello cells are dimmed");

    let title = row_text(&buffer, 3, 120);
    assert!(
        title.starts_with("Inbox \u{b7} 1 open \u{b7} 1 expired"),
        "{title}"
    );

    let detail = detail_text(&buffer, 120, 40);
    assert!(detail.contains("state     approved"), "{detail}");
}

/// A state word this build does not know draws dimmed with no gutter mark and no answer key.
#[test]
fn unknown_state_draws_dimmed_without_answer_key() {
    let mut state = base(120, 40, Tab::Inbox);
    land(
        &mut state,
        Payload::Inbox(vec![InboxItem {
            id: ItemId("20261125T211204Z-7c1e9a40".to_string()),
            bot_id: "hello".to_string(),
            question: "What now?".to_string(),
            state: ItemState::from_raw("some-new-state"),
            at: NOW.to_string(),
            expires_at: NOW.to_string(),
            ..InboxItem::default()
        }]),
    );
    let buffer = draw_buffer(&state, 120, 40, Options::default());

    assert_eq!(buffer[(GUTTER, 5)].symbol(), " ");
    let row = row_text(&buffer, 5, 120);
    assert!(row.contains("some-new-state"), "{row}");
    assert!(dimmed(&buffer, 5, 6, 11), "the hello cells are dimmed");

    let title = row_text(&buffer, 3, 120);
    assert!(
        title.starts_with("Inbox \u{b7} 0 open \u{b7} 0 expired"),
        "{title}"
    );

    let detail = detail_text(&buffer, 120, 40);
    assert!(
        detail.contains("Enter shows it is no longer open."),
        "{detail}"
    );
}
