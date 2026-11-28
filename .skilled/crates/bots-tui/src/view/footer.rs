use ratatui::layout::Rect;
use ratatui::style::Style;
use ratatui::widgets::Paragraph;
use ratatui::Frame;
use unicode_width::UnicodeWidthStr;

use crate::keys::FooterLine;
use crate::state::State;
use crate::theme::Theme;

/// The text between two footer labels, so one label never runs into the next.
pub const SEPARATOR: &str = " \u{b7} ";

/// The labels one footer line draws, in table order so the shell's keys lead the list keys.
pub fn labels(state: &State, line: FooterLine) -> Vec<&'static str> {
    let stack = crate::state::context_stack(state);
    let facts = crate::state::cond(state);
    let mut found: Vec<&'static str> = Vec::new();
    for row in crate::keys::rows() {
        if !stack.contains(&row.context) {
            continue;
        }
        if row.line != line {
            continue;
        }
        if !crate::keys::row_holds(row, &facts) {
            continue;
        }
        if found.contains(&row.label) {
            continue;
        }
        found.push(row.label);
    }
    found
}

/// One footer line, holding only the whole labels that fit inside the width.
pub fn key_line(state: &State, line: FooterLine, width: usize) -> String {
    let mut drawn = String::new();
    for label in labels(state, line) {
        let candidate = if drawn.is_empty() {
            label.to_string()
        } else {
            format!("{drawn}{SEPARATOR}{label}")
        };
        if UnicodeWidthStr::width(candidate.as_str()) > width {
            break;
        }
        drawn = candidate;
    }
    drawn
}

/// The status row's text, the first stderr line with every control character made visible.
///
/// The row draws only the first line, so a runtime message cannot move the cursor.
pub fn status_text(state: &State) -> String {
    match &state.last_error {
        None => String::new(),
        Some(line) => crate::theme::printable(line.text.lines().next().unwrap_or("")),
    }
}

/// The one-row band a footer line draws in, empty when the area has no such row.
fn row(area: Rect, index: u16) -> Rect {
    Rect {
        x: area.x,
        y: area.y.saturating_add(index),
        width: area.width,
        height: area.height.saturating_sub(index).min(1),
    }
}

/// Draws the two key lines into the footer band.
pub fn draw(frame: &mut Frame, area: Rect, state: &State, theme: &Theme) {
    let style = Style::default().fg(theme.colors().text);
    let width = area.width as usize;
    frame.render_widget(
        Paragraph::new(key_line(state, FooterLine::One, width)).style(style),
        row(area, 0),
    );
    if area.height >= 2 {
        frame.render_widget(
            Paragraph::new(key_line(state, FooterLine::Two, width)).style(style),
            row(area, 1),
        );
    }
}

/// Draws the status row, the newest failure or warning.
pub fn draw_status(frame: &mut Frame, area: Rect, state: &State, theme: &Theme) {
    frame.render_widget(
        Paragraph::new(status_text(state)).style(Style::default().fg(theme.colors().error)),
        area,
    );
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::{Palette, Size, Source, StatusLine, Tab};

    /// A state at a size that is not the too-small context, on the given tab.
    fn state_on(tab: Tab) -> State {
        State {
            size: Size { cols: 80, rows: 24 },
            active_tab: tab,
            ..State::default()
        }
    }

    /// The footer follows the context stack, so each tab and the palette draw their own keys.
    #[test]
    fn key_line_follows_the_context() {
        let chat = state_on(Tab::Chat);
        assert_eq!(
            key_line(&chat, FooterLine::One, 80),
            "Alt+1..4 tabs \u{b7} [ ] cycle"
        );

        let activity = state_on(Tab::Activity);
        assert_eq!(
            key_line(&activity, FooterLine::Two, 80),
            "Ctrl+P/? commands \u{b7} Ctrl+C exit \u{b7} Ctrl+D exit"
        );

        let inbox = state_on(Tab::Inbox);
        assert_eq!(
            key_line(&inbox, FooterLine::Two, 80),
            "Ctrl+P/? commands \u{b7} Ctrl+C exit \u{b7} Ctrl+D exit"
        );

        let palette = State {
            palette: Some(Palette::default()),
            ..state_on(Tab::Activity)
        };
        assert_eq!(
            key_line(&palette, FooterLine::One, 80),
            "\u{2191}\u{2193} select \u{b7} type to filter \u{b7} Bksp delete \u{b7} Enter select \u{b7} Esc close"
        );
        assert_eq!(
            key_line(&palette, FooterLine::Two, 80),
            "Ctrl+C close \u{b7} Ctrl+D exit"
        );
    }

    /// A label that does not fit is dropped whole, and the line stops at the first one that does not.
    #[test]
    fn key_line_drops_whole_labels() {
        let state = state_on(Tab::Activity);
        let line = |width: usize| key_line(&state, FooterLine::Two, width);
        assert_eq!(line(16), "");
        assert_eq!(line(24), "Ctrl+P/? commands");
        assert_eq!(line(30), "Ctrl+P/? commands");
        assert_eq!(line(31), "Ctrl+P/? commands \u{b7} Ctrl+C exit");
        assert_eq!(line(44), "Ctrl+P/? commands \u{b7} Ctrl+C exit");
        assert_eq!(
            line(45),
            "Ctrl+P/? commands \u{b7} Ctrl+C exit \u{b7} Ctrl+D exit"
        );
    }

    /// The status row draws the first stderr line only, with control characters made visible.
    #[test]
    fn status_text_takes_the_first_line() {
        let clean = state_on(Tab::Activity);
        assert_eq!(status_text(&clean), "");

        let failed = State {
            last_error: Some(StatusLine {
                source: Source::Shell,
                text: "bots: index locked\nsecond".to_string(),
            }),
            ..state_on(Tab::Activity)
        };
        assert_eq!(status_text(&failed), "bots: index locked");

        let escaped = State {
            last_error: Some(StatusLine {
                source: Source::Shell,
                text: "bots: bad\u{1b}[2Jvalue".to_string(),
            }),
            ..state_on(Tab::Activity)
        };
        assert_eq!(status_text(&escaped), "bots: bad?[2Jvalue");
    }
}
