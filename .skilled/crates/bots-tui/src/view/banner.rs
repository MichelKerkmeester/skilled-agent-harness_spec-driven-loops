//! The row above the status row that counts the items waiting on an answer.

use ratatui::layout::Rect;
use ratatui::style::Style;
use ratatui::widgets::Paragraph;
use ratatui::Frame;

use crate::keys::{Action, Context, Key, KeyMatch};
use crate::model::ItemState;
use crate::state::{State, Tab};
use crate::theme::Theme;

/// The items in the inbox that are open and carry no answer mark.
pub fn open_count(state: &State) -> usize {
    state
        .inbox
        .rows
        .iter()
        .filter(|item| item.state == ItemState::Open)
        .filter(|item| !state.answered.iter().any(|mark| mark.id == item.id))
        .count()
}

/// The label of the key bound to the inbox tab, read from the key table so it is never typed twice.
pub fn inbox_key() -> String {
    for row in crate::keys::rows() {
        if row.context != Context::Main || row.action != Action::SelectTab(Tab::Inbox) {
            continue;
        }
        return match row.key {
            KeyMatch::Exact(Key::Alt(c)) => format!("Alt+{c}"),
            KeyMatch::Exact(Key::Ctrl(c)) => format!("Ctrl+{}", c.to_uppercase()),
            KeyMatch::Exact(Key::Char(c)) => format!("{c}"),
            _ => "?".to_string(),
        };
    }
    "?".to_string()
}

/// The banner line, absent when nothing waits on an answer or a panel covers the row.
pub fn text(state: &State) -> Option<String> {
    if state.palette.is_some() || state.overlay.is_some() {
        return None;
    }
    state.inbox.last_ok_at?;
    let count = open_count(state);
    if count == 0 {
        return None;
    }
    let noun = if count == 1 {
        "pending approval"
    } else {
        "pending approvals"
    };
    Some(format!(
        "! {count} {noun} \u{b7} {} \u{2192} inbox",
        inbox_key()
    ))
}

/// Draws the banner row, or nothing when no item waits on an answer.
pub fn draw(frame: &mut Frame, area: Rect, state: &State, theme: &Theme) {
    let Some(line) = text(state) else {
        return;
    };
    frame.render_widget(
        Paragraph::new(line).style(Style::default().fg(theme.colors().needs_you)),
        area,
    );
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::InboxItem;
    use crate::state::{AnsweredRow, ItemId, Outcome, Palette, Remote, Size};
    use ratatui::backend::TestBackend;
    use ratatui::Terminal;

    /// One inbox item in the given state.
    fn item(id: &str, state: ItemState) -> InboxItem {
        InboxItem {
            id: ItemId(id.to_string()),
            state,
            ..InboxItem::default()
        }
    }

    /// A state at 80x24 whose inbox read landed with these rows.
    fn state_with(rows: Vec<InboxItem>) -> State {
        State {
            size: Size { cols: 80, rows: 24 },
            inbox: Remote {
                rows,
                last_ok_at: Some(0),
                ..Remote::default()
            },
            ..State::default()
        }
    }

    /// Draws a whole frame and returns the banner row with its trailing spaces trimmed.
    fn banner_row(state: &State) -> String {
        let mut terminal =
            Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
        terminal
            .draw(|frame| crate::view::draw(frame, state, &crate::Options::default()))
            .expect("the frame draws");
        let buffer = terminal.backend().buffer();
        let row: String = (0..80u16).map(|x| buffer[(x, 20)].symbol()).collect();
        row.trim_end().to_string()
    }

    /// The banner counts the open items, drops the answered ones and names the inbox key.
    #[test]
    fn banner_counts_open_items() {
        let one = state_with(vec![item("a", ItemState::Open)]);
        assert_eq!(
            text(&one).as_deref(),
            Some("! 1 pending approval \u{b7} Alt+2 \u{2192} inbox")
        );
        assert_eq!(
            banner_row(&one),
            "! 1 pending approval \u{b7} Alt+2 \u{2192} inbox"
        );

        let two = state_with(vec![
            item("a", ItemState::Open),
            item("b", ItemState::Open),
            item("c", ItemState::Expired),
        ]);
        assert_eq!(
            text(&two).as_deref(),
            Some("! 2 pending approvals \u{b7} Alt+2 \u{2192} inbox")
        );
        assert_eq!(
            banner_row(&two),
            "! 2 pending approvals \u{b7} Alt+2 \u{2192} inbox"
        );

        let answered = State {
            answered: vec![AnsweredRow {
                id: ItemId("a".to_string()),
                outcome: Outcome::Approved,
                inbox_generation: 0,
            }],
            ..two
        };
        assert_eq!(
            text(&answered).as_deref(),
            Some("! 1 pending approval \u{b7} Alt+2 \u{2192} inbox")
        );
        assert_eq!(
            banner_row(&answered),
            "! 1 pending approval \u{b7} Alt+2 \u{2192} inbox"
        );
    }

    /// Nothing waits, or a panel covers the row, so the banner draws no text and no cells.
    #[test]
    fn banner_is_blank_with_none() {
        let cases = [
            state_with(Vec::new()),
            state_with(vec![item("a", ItemState::Expired)]),
            State {
                inbox: Remote {
                    rows: vec![item("a", ItemState::Open)],
                    last_ok_at: None,
                    ..Remote::default()
                },
                ..state_with(Vec::new())
            },
            State {
                palette: Some(Palette::default()),
                ..state_with(vec![item("a", ItemState::Open)])
            },
        ];
        for state in cases {
            assert_eq!(text(&state), None);
            assert_eq!(banner_row(&state), "");
        }
    }
}
