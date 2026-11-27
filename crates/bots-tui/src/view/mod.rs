pub mod banner;
pub mod footer;
pub mod header;
pub mod panes;
pub mod tabs;

use ratatui::layout::Rect;
use ratatui::style::{Modifier, Style};
use ratatui::text::Line;
use ratatui::widgets::{Block, Clear, Padding, Paragraph};
use ratatui::Frame;

use crate::state::{Palette, Size, State};
use crate::theme::Theme;
use crate::Options;

/// The narrowest terminal the shell draws in.
pub const MIN_COLS: u16 = 24;

/// The shortest terminal the shell draws in.
pub const MIN_ROWS: u16 = 8;

/// The one line the shell draws when the terminal is below the floor.
pub const TOO_SMALL: &str = "Too small · Ctrl+D exit";

/// The seven rows the shell splits the frame into.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Bands {
    /// The title row.
    pub header: Rect,
    /// The tab bar row.
    pub tabs: Rect,
    /// The rule under the tab bar.
    pub rule: Rect,
    /// The rows the panes draw into.
    pub body: Rect,
    /// The row a banner draws into.
    pub banner: Rect,
    /// The status row.
    pub status: Rect,
    /// The two key lines.
    pub footer: Rect,
}

/// Splits the frame into the seven bands, with the body taking the rows the other six leave.
pub fn bands(area: Rect) -> Bands {
    let h = area.height;
    Bands {
        header: Rect::new(area.x, area.y, area.width, 1),
        tabs: Rect::new(area.x, area.y.saturating_add(1), area.width, 1),
        rule: Rect::new(area.x, area.y.saturating_add(2), area.width, 1),
        body: Rect::new(
            area.x,
            area.y.saturating_add(3),
            area.width,
            h.saturating_sub(7),
        ),
        banner: Rect::new(
            area.x,
            area.y.saturating_add(h.saturating_sub(4)),
            area.width,
            1,
        ),
        status: Rect::new(
            area.x,
            area.y.saturating_add(h.saturating_sub(3)),
            area.width,
            1,
        ),
        footer: Rect::new(
            area.x,
            area.y.saturating_add(h.saturating_sub(2)),
            area.width,
            h.min(2),
        ),
    }
}

/// The panel's rectangle, centred in the body and never wider than the body allows.
pub fn palette_rect(body: Rect) -> Rect {
    let width = body.width.saturating_sub(2).min(100);
    let height = body.height.min(8);
    let x = body.x.saturating_add(body.width.saturating_sub(width) / 2);
    let y = body
        .y
        .saturating_add(body.height.saturating_sub(height) / 2);
    Rect::new(x, y, width, height)
}

/// The first entry the panel draws, moved only as far as keeps the selection in view.
pub fn window_start(selected: usize, scroll: usize, visible: usize) -> usize {
    if visible == 0 {
        return 0;
    }
    if selected < scroll {
        selected
    } else if selected >= scroll.saturating_add(visible) {
        selected.saturating_add(1).saturating_sub(visible)
    } else {
        scroll
    }
}

/// Draws the shell bands and the palette when one is open.
///
/// Nothing is drawn until the first resize arrives, so the frame before the loop knows its size
/// stays empty.
pub fn draw(frame: &mut Frame, state: &State, opts: &Options) {
    let area = frame.area();
    frame.render_widget(Clear, area);
    if state.size == Size::default() {
        return;
    }
    let theme = Theme::new(opts);
    if area.width < MIN_COLS || area.height < MIN_ROWS {
        let line = Rect::new(area.x, area.y, area.width, area.height.min(1));
        frame.render_widget(Paragraph::new(TOO_SMALL), line);
        return;
    }
    let b = bands(area);
    header::draw(frame, b.header, state, &theme);
    tabs::draw(frame, b.tabs, state, &theme);
    let rule = theme.rule().repeat(usize::from(b.rule.width));
    frame.render_widget(
        Paragraph::new(rule).style(Style::default().fg(theme.colors().dim)),
        b.rule,
    );
    footer::draw_status(frame, b.status, state, &theme);
    footer::draw(frame, b.footer, state, &theme);
    // The pane draws before the palette, so an open palette covers the body.
    panes::draw(frame, b.body, state, &theme);
    banner::draw(frame, b.banner, state, &theme);
    if let Some(palette) = state.palette.as_ref() {
        draw_palette(frame, b.body, palette, &theme);
    }
}

/// Draws the command palette panel over the body.
pub fn draw_palette(frame: &mut Frame, body: Rect, palette: &Palette, theme: &Theme) {
    let rect = palette_rect(body);
    frame.render_widget(Clear, rect);
    let colors = theme.colors();
    let text = Style::default().fg(colors.text);
    let block = Block::bordered()
        .title(" Commands ")
        .padding(Padding::horizontal(1))
        .style(text);
    let inner = block.inner(rect);
    frame.render_widget(block, rect);

    let mut lines = vec![
        Line::from(format!("> {}", crate::theme::printable(&palette.filter))),
        Line::from(""),
    ];
    let entries = crate::keys::palette_filtered(&palette.filter);
    let visible = (inner.height as usize).saturating_sub(2);
    let start = window_start(palette.selected, palette.scroll, visible);
    let end = start.saturating_add(visible).min(entries.len());
    for (i, entry) in entries.iter().enumerate().take(end).skip(start) {
        let label = entry.label;
        if i == palette.selected {
            // The mark sits beside the reverse video, so the selection still reads without it.
            lines.push(Line::styled(
                format!("{} {}", theme.focus_mark(), label),
                text.add_modifier(Modifier::REVERSED),
            ));
        } else {
            lines.push(Line::styled(format!("  {label}"), text));
        }
    }
    frame.render_widget(Paragraph::new(lines), inner);
}

#[cfg(test)]
mod tests {
    use super::*;
    use ratatui::backend::TestBackend;
    use ratatui::Terminal;

    /// Draws one frame at the given size and returns each row's text.
    fn rows_with(state: &State, opts: &Options, width: u16, height: u16) -> Vec<String> {
        let mut terminal =
            Terminal::new(TestBackend::new(width, height)).expect("the test terminal opens");
        terminal
            .draw(|frame| draw(frame, state, opts))
            .expect("the frame draws");
        let buffer = terminal.backend().buffer();
        (0..height)
            .map(|y| (0..width).map(|x| buffer[(x, y)].symbol()).collect())
            .collect()
    }

    /// Draws one frame with the default options and returns each row's text.
    fn rows(state: &State, width: u16, height: u16) -> Vec<String> {
        rows_with(state, &Options::default(), width, height)
    }

    /// A state that has seen one resize, so the shell draws it.
    fn sized(width: u16, height: u16) -> State {
        State {
            size: Size {
                cols: width,
                rows: height,
            },
            ..State::default()
        }
    }

    /// The first row the too-small screen draws at this width.
    fn too_small_row(width: u16) -> String {
        let mut row: String = TOO_SMALL.chars().take(usize::from(width)).collect();
        while row.chars().count() < usize::from(width) {
            row.push(' ');
        }
        row
    }

    /// The seven bands sit on the rows the shell names, and the body takes what is left.
    #[test]
    fn bands_split_the_seven_rows() {
        let b = bands(Rect::new(0, 0, 80, 24));
        assert_eq!(b.header, Rect::new(0, 0, 80, 1));
        assert_eq!(b.tabs, Rect::new(0, 1, 80, 1));
        assert_eq!(b.rule, Rect::new(0, 2, 80, 1));
        assert_eq!(b.body, Rect::new(0, 3, 80, 17));
        assert_eq!(b.banner, Rect::new(0, 20, 80, 1));
        assert_eq!(b.status, Rect::new(0, 21, 80, 1));
        assert_eq!(b.footer, Rect::new(0, 22, 80, 2));

        let b = bands(Rect::new(0, 0, 120, 40));
        assert_eq!(b.body, Rect::new(0, 3, 120, 33));
        assert_eq!(b.banner, Rect::new(0, 36, 120, 1));
        assert_eq!(b.status, Rect::new(0, 37, 120, 1));
        assert_eq!(b.footer, Rect::new(0, 38, 120, 2));
    }

    /// Every small frame splits without an underflow, down to a zero-sized one.
    #[test]
    fn bands_never_underflow() {
        for width in 0..=30 {
            for height in 0..=10 {
                let b = bands(Rect::new(0, 0, width, height));
                assert_eq!(b.header.width, width);
                assert_eq!(b.footer.width, width);
            }
        }
    }

    /// The panel is centred in the body, capped at a hundred columns and eight rows.
    #[test]
    fn palette_rect_matches_the_frame() {
        assert_eq!(
            palette_rect(Rect::new(0, 3, 80, 17)),
            Rect::new(1, 7, 78, 8)
        );
        assert_eq!(
            palette_rect(Rect::new(0, 3, 120, 33)),
            Rect::new(10, 15, 100, 8)
        );
        assert_eq!(palette_rect(Rect::new(0, 3, 80, 3)).height, 3);
    }

    /// The window moves only when the selection would leave it.
    #[test]
    fn window_start_keeps_the_selection_visible() {
        assert_eq!(window_start(0, 0, 4), 0);
        assert_eq!(window_start(5, 0, 4), 2);
        assert_eq!(window_start(1, 3, 4), 1);
        assert_eq!(window_start(3, 0, 4), 0);
        assert_eq!(window_start(7, 1, 0), 0);
    }

    /// Below the floor the shell draws the one line and nothing else.
    #[test]
    fn too_small_draws_the_resize_line() {
        for (width, height) in [(23, 8), (24, 7), (30, 7), (5, 3), (1, 1)] {
            let drawn = rows(&sized(width, height), width, height);
            assert_eq!(drawn[0], too_small_row(width), "at {width}x{height}");
            for row in &drawn[1..] {
                assert_eq!(row.trim_end(), "", "at {width}x{height}");
            }
        }
        for width in 1..=30 {
            for height in 1..=10 {
                let _ = rows(&sized(width, height), width, height);
            }
        }
    }

    /// A state that has seen no resize draws nothing at all.
    #[test]
    fn no_size_draws_the_empty_frame() {
        let drawn = rows(&State::default(), 80, 24);
        let blank = " ".repeat(80);
        for row in &drawn {
            assert_eq!(row, &blank);
        }
    }

    /// The rule fills its band in the glyph the theme names.
    #[test]
    fn rule_spans_the_width() {
        let state = sized(80, 24);
        assert_eq!(rows(&state, 80, 24)[2], "\u{2500}".repeat(80));
        let ascii = Options {
            mono: false,
            ascii: true,
        };
        assert_eq!(rows_with(&state, &ascii, 80, 24)[2], "-".repeat(80));
    }

    /// The panel lands on the rows the frame position names, with the selection marked.
    #[test]
    fn palette_panel_draws_at_the_frame_position() {
        let state = State {
            palette: Some(Palette {
                filter: "ex".to_string(),
                selected: 0,
                scroll: 0,
            }),
            ..sized(80, 24)
        };
        let drawn = rows(&state, 80, 24);
        assert!(drawn[7].starts_with(" \u{250c} Commands "), "{}", drawn[7]);
        assert!(drawn[8].starts_with(" \u{2502} > ex"), "{}", drawn[8]);
        assert!(
            drawn[10].starts_with(" \u{2502} \u{203a} Ctrl+C exit"),
            "{}",
            drawn[10]
        );
        assert!(
            drawn[11].starts_with(" \u{2502}   Ctrl+D exit"),
            "{}",
            drawn[11]
        );
        assert!(drawn[14].starts_with(" \u{2514}"), "{}", drawn[14]);
        assert!(!drawn[6].contains('\u{250c}'), "{}", drawn[6]);
    }
}
