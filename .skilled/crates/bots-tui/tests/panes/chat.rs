//! The chat body's pane test.

use super::support::*;
use bots_tui::state::{BotId, Payload, Tab};
use bots_tui::Options;

/// The chat body draws the transcript's first message and never more lines than its window.
#[test]
fn chat_body_draws_the_first_message() {
    let mut state = base(80, 24, Tab::Chat);
    land(&mut state, Payload::Inbox(inbox_fixture()));
    state.chat_view.bot = Some(BotId("hello".to_string()));
    land(&mut state, Payload::Chat(chat_fixture()));

    for (cols, rows) in [(80u16, 24u16), (120u16, 40u16)] {
        let (drawn, count) = draw_body(&state, cols, rows, Options::default());
        // The body band runs from the row under the rule to the row above the banner.
        let body = drawn[3..drawn.len() - 4].join("\n");
        assert!(
            body.contains("  ada \u{2192} hello \u{b7} 21:02"),
            "the body draws the first label at {cols}x{rows}: {body}"
        );
        assert!(
            body.contains("    what changed on main since yesterday?"),
            "the body draws the first message at {cols}x{rows}: {body}"
        );
        assert!(
            !body.contains("phase 010"),
            "the body draws no placeholder at {cols}x{rows}: {body}"
        );
        let list_rows = usize::from(rows) - 7 - 2;
        assert!(
            count <= list_rows,
            "the body built {count} lines for a {list_rows} line window at {cols}x{rows}"
        );
    }

    // A long transcript draws only the window, so the count stays inside the body's list rows.
    let first = state.chat.rows.messages[0].clone();
    state.chat.rows.messages = vec![first; 1_000];
    let (_, count) = draw_body(&state, 80, 24, Options::default());
    assert!(
        count <= 15,
        "a thousand messages built {count} lines for a 15 line window"
    );
}
