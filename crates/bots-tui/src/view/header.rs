use ratatui::layout::{Alignment, Rect};
use ratatui::style::Style;
use ratatui::widgets::Paragraph;
use ratatui::Frame;

use crate::model::parse_utc;
use crate::state::{EpochMs, State};
use crate::theme::Theme;

/// The largest whole unit a duration fits, rounded down.
fn span(ms: i64) -> String {
    let s = ms.unsigned_abs() / 1000;
    if s < 60 {
        format!("{s}s")
    } else if s < 3_600 {
        format!("{}m", s / 60)
    } else if s < 86_400 {
        format!("{}h", s / 3_600)
    } else {
        format!("{}d", s / 86_400)
    }
}

/// How long ago an instant was, or how far ahead it is.
pub fn age_label(now: EpochMs, at: EpochMs) -> String {
    if now >= at {
        format!("{} ago", span(now - at))
    } else {
        format!("in {}", span(at - now))
    }
}

/// The one age formatter for a stale flag, which the header draws and every pane title calls.
pub fn stale_label(now: EpochMs, last_ok_at: EpochMs) -> String {
    format!("stale {}", span(now - last_ok_at))
}

/// The number of bot rows, which is what the header counts.
pub fn bot_count(state: &State) -> usize {
    state
        .status
        .rows
        .rows
        .iter()
        .filter(|row| row.kind == "bot")
        .count()
}

/// The header's one line, the bot count and the age of the index it came from.
pub fn title(state: &State) -> String {
    let count = bot_count(state);
    let bots = if count == 1 {
        "1 bot".to_string()
    } else {
        format!("{count} bots")
    };
    let age = match state.status.rows.updated_at.as_deref().or(state
        .status
        .rows
        .built_at
        .as_deref())
    {
        None => "never".to_string(),
        Some(text) => match parse_utc(text) {
            Some(at) => age_label(state.now, at),
            None => "?".to_string(),
        },
    };
    format!("bots \u{b7} {bots} \u{b7} index {age}")
}

/// The warning the header draws on the right, absent while the status read is clean.
pub fn flag(state: &State) -> Option<String> {
    if state.status.error.is_some() {
        return Some("status failed".to_string());
    }
    if !state.status.rows.stale {
        return None;
    }
    match state.status.rows.updated_at.as_deref().and_then(parse_utc) {
        Some(at) => Some(stale_label(state.now, at)),
        None => Some("stale".to_string()),
    }
}

/// Draws the title on the left and the warning on the right of one row.
pub fn draw(frame: &mut Frame, area: Rect, state: &State, theme: &Theme) {
    let colors = theme.colors();
    frame.render_widget(
        Paragraph::new(title(state)).style(Style::default().fg(colors.text)),
        area,
    );
    if let Some(text) = flag(state) {
        let color = if text == "status failed" {
            colors.error
        } else {
            colors.stale
        };
        frame.render_widget(
            Paragraph::new(text)
                .style(Style::default().fg(color))
                .alignment(Alignment::Right),
            area,
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::{StatusPayload, StatusRow};
    use crate::state::Remote;

    /// Every unit boundary the span formatter rounds down at.
    #[test]
    fn stale_label_formats_the_age() {
        assert_eq!(stale_label(1_000_120_000, 1_000_000_000), "stale 2m");
        assert_eq!(stale_label(1_000_059_000, 1_000_000_000), "stale 59s");
        assert_eq!(stale_label(1_000_119_999, 1_000_000_000), "stale 1m");
        assert_eq!(age_label(1_000_012_000, 1_000_000_000), "12s ago");
        assert_eq!(
            age_label(1_000_000_000, 1_000_000_000 + 10_856_000),
            "in 3h"
        );
        assert_eq!(
            age_label(1_000_000_000 + 2 * 86_400_000 + 5_000, 1_000_000_000),
            "2d ago"
        );
    }

    /// The header counts bot rows only, and the flag follows the read that filled them.
    #[test]
    fn title_counts_only_bot_rows() {
        let mut state = State {
            status: Remote {
                rows: StatusPayload {
                    updated_at: Some("2026-11-25T21:13:52.000Z".to_string()),
                    rows: vec![
                        StatusRow {
                            kind: "bot".to_string(),
                            ..StatusRow::default()
                        },
                        StatusRow {
                            kind: "bot".to_string(),
                            ..StatusRow::default()
                        },
                        StatusRow {
                            kind: "bot".to_string(),
                            ..StatusRow::default()
                        },
                        StatusRow {
                            kind: "needs-you".to_string(),
                            ..StatusRow::default()
                        },
                    ],
                    ..StatusPayload::default()
                },
                ..Remote::default()
            },
            now: parse_utc("2026-11-25T21:14:04.000Z").unwrap(),
            ..State::default()
        };
        assert_eq!(title(&state), "bots \u{b7} 3 bots \u{b7} index 12s ago");
        assert_eq!(flag(&state), None);

        state.status.rows.stale = true;
        state.now = parse_utc("2026-11-25T21:15:52.000Z").unwrap();
        assert_eq!(flag(&state), Some("stale 2m".to_string()));

        state.status.error = Some("x".to_string());
        assert_eq!(flag(&state), Some("status failed".to_string()));
        assert_eq!(title(&state), "bots \u{b7} 3 bots \u{b7} index 2m ago");

        state.status.rows.rows.clear();
        state.status.rows.updated_at = None;
        state.status.rows.built_at = None;
        assert_eq!(title(&state), "bots \u{b7} 0 bots \u{b7} index never");
    }
}
