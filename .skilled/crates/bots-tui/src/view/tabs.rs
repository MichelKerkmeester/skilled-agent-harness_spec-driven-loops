use ratatui::layout::Rect;
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use ratatui::Frame;

use crate::state::{State, Tab};
use crate::theme::Theme;

/// The four tabs in the order the bar draws them, each with the label it shows.
pub const TABS: [(Tab, &str); 4] = [
    (Tab::Activity, "1 Activity"),
    (Tab::Inbox, "2 Inbox"),
    (Tab::Routines, "3 Routines"),
    (Tab::Chat, "4 Chat"),
];

/// One segment per tab, bracketed on the active one.
///
/// The brackets carry the mark on their own, so the active tab still reads with colour and
/// reverse video both off.
pub fn segments(active: Tab) -> Vec<String> {
    TABS.iter()
        .map(|(tab, label)| {
            if *tab == active {
                format!("[{label}]")
            } else {
                format!(" {label} ")
            }
        })
        .collect()
}

/// The whole bar as one line of text, with a leading space so it clears the edge.
pub fn tab_line(active: Tab) -> String {
    format!(" {}", segments(active).join(" "))
}

/// Draws the tab bar into one row.
///
/// The band draws the four tabs only. The chat tab's body belongs to the panes.
pub fn draw(frame: &mut Frame, area: Rect, state: &State, theme: &Theme) {
    let text = Style::default().fg(theme.colors().text);
    let active = state.active_tab;
    let mut spans = vec![Span::styled(" ", text)];
    for (index, (segment, (tab, _))) in segments(active).into_iter().zip(TABS).enumerate() {
        if index > 0 {
            spans.push(Span::styled(" ", text));
        }
        let style = if tab == active {
            text.add_modifier(Modifier::REVERSED)
        } else {
            text
        };
        spans.push(Span::styled(segment, style));
    }
    frame.render_widget(Paragraph::new(Line::from(spans)), area);
}

#[cfg(test)]
mod tests {
    use super::*;
    use ratatui::backend::TestBackend;
    use ratatui::Terminal;

    /// The row the bar draws for each tab, so a case reads as the cells it expects.
    fn expected(active: Tab) -> &'static str {
        match active {
            Tab::Activity => " [1 Activity]  2 Inbox   3 Routines   4 Chat",
            Tab::Inbox => "  1 Activity  [2 Inbox]  3 Routines   4 Chat",
            Tab::Routines => "  1 Activity   2 Inbox  [3 Routines]  4 Chat",
            Tab::Chat => "  1 Activity   2 Inbox   3 Routines  [4 Chat]",
        }
    }

    /// The brackets alone mark the active tab, so the row reads with colour off.
    #[test]
    fn tab_line_marks_the_active_tab() {
        for active in [Tab::Activity, Tab::Inbox, Tab::Routines, Tab::Chat] {
            assert_eq!(tab_line(active).trim_end(), expected(active));
        }
    }

    /// Only the active tab's segment is reversed, and the row is the one the text names.
    #[test]
    fn draw_reverses_only_the_active_tab() {
        let state = State {
            active_tab: Tab::Chat,
            ..State::default()
        };
        let mut terminal = Terminal::new(TestBackend::new(80, 1)).expect("the test terminal opens");
        terminal
            .draw(|frame| draw(frame, frame.area(), &state, &Theme::default()))
            .expect("the frame draws");

        let buffer = terminal.backend().buffer();
        let row: String = (0..80).map(|x| buffer[(x, 0)].symbol()).collect();
        assert_eq!(row.trim_end(), expected(Tab::Chat));

        let marked = expected(Tab::Chat)
            .find('[')
            .expect("the chat tab is marked");
        assert!(buffer[(marked as u16, 0)]
            .modifier
            .contains(Modifier::REVERSED));

        let plain = expected(Tab::Chat)
            .find('1')
            .expect("the activity tab is labelled");
        assert!(!buffer[(plain as u16, 0)]
            .modifier
            .contains(Modifier::REVERSED));
    }
}
