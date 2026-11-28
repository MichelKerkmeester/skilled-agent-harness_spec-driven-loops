//! The decision and choice overlay: the item, its options, its grant, the typed line and the phase it is in.

use ratatui::layout::Rect;
use ratatui::style::Style;
use ratatui::text::Line;
use ratatui::widgets::{Block, Clear, Padding, Paragraph};
use ratatui::Frame;
use unicode_width::{UnicodeWidthChar, UnicodeWidthStr};

use crate::model::{parse_utc, InboxItem, ItemState};
use crate::state::{Overlay, Phase, State};
use crate::theme::{self, Theme};
use crate::view::{header, panes};

/// The columns a field's key takes, so every value in the panel starts in the same column.
pub const LABEL_WIDTH: usize = 9;

/// One field line: a fixed key, then the value the caller already made printable.
pub fn field(key: &str, value: &str) -> String {
    format!("{key:<9}{value}")
}

/// The panel's rectangle, centred in the body and never wider than the body allows.
pub fn overlay_rect(body: Rect) -> Rect {
    let width = body.width.saturating_sub(2).min(100);
    let height = body.height.min(17);
    let x = body.x.saturating_add(body.width.saturating_sub(width) / 2);
    let y = body
        .y
        .saturating_add(body.height.saturating_sub(height) / 2);
    Rect::new(x, y, width, height)
}

/// The status line the panel draws on its last inner row.
pub fn status_text(overlay: &Overlay) -> String {
    let value = match &overlay.phase {
        Phase::Idle => "ready".to_string(),
        Phase::Typing => "typing \u{b7} single-key shortcuts paused".to_string(),
        Phase::Sending => "sending\u{2026}  keys locked".to_string(),
        Phase::Refused(line) => theme::printable(line.lines().next().unwrap_or("")),
        Phase::Gone => "This item is no longer open. Esc closes.".to_string(),
    };
    field("status", &value)
}

/// The typed line as the panel draws it, with its tail kept when the line is wider than the panel.
pub fn answer_value(buffer: &str, width: usize) -> String {
    let text = theme::printable(buffer);
    let budget = width.saturating_sub(LABEL_WIDTH + 2);
    format!("> {}", tail_within(&text, budget))
}

/// The tail of a line that fits a display width, so the end of a long line stays in view.
fn tail_within(text: &str, width: usize) -> String {
    if UnicodeWidthStr::width(text) <= width {
        return text.to_string();
    }
    let mut kept: Vec<char> = Vec::new();
    let mut used: usize = 0;
    for c in text.chars().rev() {
        let step = UnicodeWidthChar::width(c).unwrap_or(0);
        if used.saturating_add(step) > width {
            break;
        }
        kept.push(c);
        used += step;
    }
    kept.iter().rev().collect()
}

/// The panel lines above the status line, in the order the frame draws them.
pub fn content(state: &State, overlay: &Overlay, width: usize) -> Vec<String> {
    let item = &overlay.item;
    let mut lines = vec![
        head(state, item),
        String::new(),
        theme::printable(&item.question),
        String::new(),
    ];
    lines.extend(option_lines(overlay));
    if let Some(grant) = item.grants.as_ref() {
        lines.push(field(
            "grant",
            &format!(
                "kind {} \u{b7} rung {}",
                theme::printable(&grant.kind),
                theme::printable(&grant.rung)
            ),
        ));
    }
    if overlay.phase == Phase::Typing || !overlay.buffer.is_empty() {
        lines.push(String::new());
        lines.push(field("answer", &answer_value(&overlay.buffer, width)));
    }
    lines
}

/// The item's first line: the bot, the state word and the age of the timestamp that matters.
fn head(state: &State, item: &InboxItem) -> String {
    let at = if item.state == ItemState::Expired {
        &item.expires_at
    } else {
        &item.at
    };
    let age = match parse_utc(at) {
        Some(at) => header::age_label(state.now, at),
        None => "?".to_string(),
    };
    format!(
        "{} \u{b7} {} \u{b7} {}",
        theme::printable(&item.bot_id),
        theme::printable(item.state.as_str()),
        age
    )
}

/// The options the panel draws, numbered while a digit can still pick one.
fn option_lines(overlay: &Overlay) -> Vec<String> {
    if overlay.options.is_empty() {
        return vec![field("options", "none")];
    }
    if overlay.phase == Phase::Gone {
        let joined: Vec<String> = overlay
            .options
            .iter()
            .map(|option| theme::printable(option))
            .collect();
        return vec![field("options", &joined.join(", "))];
    }
    let mut lines: Vec<String> = overlay
        .options
        .iter()
        .take(9)
        .enumerate()
        .map(|(index, option)| format!("  {}  {}", index + 1, theme::printable(option)))
        .collect();
    if overlay.options.len() > 9 {
        lines.push(field(
            "more",
            &format!(
                "bots answer --scope once --repo <repo> -- {} <text>",
                theme::printable(&overlay.item_id.0)
            ),
        ));
    }
    lines
}

/// Draws the panel over the body, or nothing when no overlay is open.
pub fn draw(frame: &mut Frame, body: Rect, state: &State, theme: &Theme) {
    let Some(overlay) = state.overlay.as_ref() else {
        return;
    };
    // The body outside the panel draws blank, so no pane row shows under the overlay.
    frame.render_widget(Clear, body);
    let rect = overlay_rect(body);
    let colors = theme.colors();
    let base = if overlay.phase == Phase::Sending {
        colors.dim
    } else {
        colors.text
    };
    let style = Style::default().fg(base);
    let block = Block::bordered()
        .title(" Approval ")
        .padding(Padding::horizontal(1))
        .style(style);
    let inner = block.inner(rect);
    frame.render_widget(block, rect);
    if inner.width == 0 || inner.height == 0 {
        return;
    }
    let width = usize::from(inner.width);
    let lines = content(state, overlay, width);
    // The status line keeps the last inner row, so a short body cuts the lines between.
    let room = inner.height.saturating_sub(1);
    let drawn: Vec<Line> = lines
        .iter()
        .take(usize::from(room))
        .map(|line| Line::styled(panes::clip(line, width, theme.ascii), style))
        .collect();
    frame.render_widget(
        Paragraph::new(drawn).style(style),
        Rect::new(inner.x, inner.y, inner.width, room),
    );
    let status_style = if matches!(overlay.phase, Phase::Refused(_)) {
        Style::default().fg(colors.error)
    } else {
        style
    };
    frame.render_widget(
        Paragraph::new(panes::clip(&status_text(overlay), width, theme.ascii)).style(status_style),
        Rect::new(inner.x, inner.y.saturating_add(room), inner.width, 1),
    );
    if overlay.phase == Phase::Typing {
        // The cursor sits on the cell after the typed line, so the operator sees where typing lands.
        let index = lines.len().saturating_sub(1);
        if let Some(line) = lines.get(index).filter(|_| index < usize::from(room)) {
            let drawn = panes::clip(line, width, theme.ascii);
            let used = u16::try_from(UnicodeWidthStr::width(drawn.as_str())).unwrap_or(u16::MAX);
            let x = inner.x.saturating_add(used);
            let y = inner
                .y
                .saturating_add(u16::try_from(index).unwrap_or(u16::MAX));
            if x < inner.x.saturating_add(inner.width) && y < inner.y.saturating_add(inner.height) {
                frame.set_cursor_position((x, y));
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::keys::{self, FooterLine};
    use crate::model::Grant;
    use crate::state::{ItemId, Size, Source, StatusLine, Tab};
    use crate::Options;
    use ratatui::backend::TestBackend;
    use ratatui::Terminal;

    /// The clock every frame in this module draws against.
    const NOW: i64 = 1_795_641_244_000;

    /// The decision item: one question and no options.
    fn hello_item() -> InboxItem {
        InboxItem {
            id: ItemId("20261125T211204Z-7c1e9a40".to_string()),
            bot_id: "hello".to_string(),
            question: "Ship the release?".to_string(),
            state: ItemState::Open,
            at: "2026-11-25T21:12:04.000Z".to_string(),
            expires_at: "2026-11-26T21:12:04.000Z".to_string(),
            options: Vec::new(),
            ..InboxItem::default()
        }
    }

    /// The choice item: one question and two options.
    fn digest_item() -> InboxItem {
        InboxItem {
            id: ItemId("20261125T210504Z-3f9d2b11".to_string()),
            bot_id: "digest".to_string(),
            question: "Which channel?".to_string(),
            state: ItemState::Open,
            at: "2026-11-25T21:05:04.000Z".to_string(),
            expires_at: "2026-11-26T21:05:04.000Z".to_string(),
            options: vec!["email".to_string(), "chat".to_string()],
            ..InboxItem::default()
        }
    }

    /// A state at the given size with this item open in this phase.
    fn state_with(item: InboxItem, phase: Phase, buffer: &str, width: u16, height: u16) -> State {
        State {
            size: Size {
                cols: width,
                rows: height,
            },
            now: NOW,
            active_tab: Tab::Inbox,
            overlay: Some(Overlay {
                item_id: item.id.clone(),
                options: item.options.clone(),
                item,
                phase,
                buffer: buffer.to_string(),
            }),
            ..State::default()
        }
    }

    /// Draws one frame at the given size and returns each row's text.
    fn rows_with(state: &State, width: u16, height: u16) -> Vec<String> {
        let mut terminal =
            Terminal::new(TestBackend::new(width, height)).expect("the test terminal opens");
        terminal
            .draw(|frame| crate::view::draw(frame, state, &Options::default()))
            .expect("the frame draws");
        let buffer = terminal.backend().buffer();
        (0..height)
            .map(|y| (0..width).map(|x| buffer[(x, y)].symbol()).collect())
            .collect()
    }

    /// The panel draws the deny key before the approve key, and the choice shape numbers its options.
    #[test]
    fn overlay_draws_deny_first() {
        let decision = rows_with(&state_with(hello_item(), Phase::Idle, "", 80, 24), 80, 24);
        assert_eq!(
            decision[22].trim(),
            "t type \u{b7} n deny \u{b7} y approve once \u{b7} Esc close"
        );
        let deny = decision[22]
            .find("n deny")
            .expect("the deny label is drawn");
        let approve = decision[22]
            .find("y approve once")
            .expect("the approve label is drawn");
        assert!(deny < approve, "{}", decision[22]);
        assert_eq!(decision[23].trim(), "Ctrl+C close \u{b7} Ctrl+D exit");
        for row in &decision {
            assert!(!row.contains("always"), "{row}");
        }
        assert!(
            decision[3].starts_with(" \u{250c} Approval "),
            "{}",
            decision[3]
        );
        assert!(
            decision[4].starts_with(" \u{2502} hello \u{b7} open \u{b7} 2m ago"),
            "{}",
            decision[4]
        );
        assert!(
            decision[8].starts_with(" \u{2502} options  none"),
            "{}",
            decision[8]
        );
        assert!(
            decision[18].starts_with(" \u{2502} status   ready"),
            "{}",
            decision[18]
        );
        assert!(decision[19].starts_with(" \u{2514}"), "{}", decision[19]);

        let choice = rows_with(&state_with(digest_item(), Phase::Idle, "", 80, 24), 80, 24);
        assert_eq!(choice[22].trim(), "n deny \u{b7} 1-9 pick \u{b7} Esc close");
        assert!(
            choice[8].starts_with(" \u{2502}   1  email"),
            "{}",
            choice[8]
        );
        assert!(
            choice[9].starts_with(" \u{2502}   2  chat"),
            "{}",
            choice[9]
        );

        let wide = rows_with(&state_with(hello_item(), Phase::Idle, "", 120, 40), 120, 40);
        assert!(
            wide[11].starts_with("          \u{250c} Approval "),
            "{}",
            wide[11]
        );
        for index in (3..=10).chain(28..=35) {
            assert_eq!(wide[index].trim_end(), "", "row {index}");
        }
    }

    /// Every overlay row whose conditions hold draws its label on the footer line it names.
    #[test]
    fn overlay_labels_are_drawn() {
        let cases = [
            (
                "decision",
                state_with(hello_item(), Phase::Idle, "", 80, 24),
            ),
            ("choice", state_with(digest_item(), Phase::Idle, "", 80, 24)),
            (
                "typing",
                state_with(hello_item(), Phase::Typing, "", 80, 24),
            ),
        ];
        for (name, state) in cases {
            let drawn = rows_with(&state, 80, 24);
            let facts = crate::state::cond(&state);
            for row in keys::OVERLAY_ROWS {
                if !keys::row_holds(row, &facts) {
                    continue;
                }
                let line = match row.line {
                    FooterLine::One => &drawn[22],
                    FooterLine::Two => &drawn[23],
                };
                assert!(
                    line.contains(row.label),
                    "{name} does not draw {:?}: {line}",
                    row.label
                );
            }
        }

        let decision = state_with(hello_item(), Phase::Idle, "", 80, 24);
        let facts = crate::state::cond(&decision);
        assert!(keys::OVERLAY_ROWS
            .iter()
            .any(|row| row.label == "t type" && keys::row_holds(row, &facts)));

        let choice = rows_with(&state_with(digest_item(), Phase::Idle, "", 80, 24), 80, 24);
        assert!(!choice[22].contains("y approve once"), "{}", choice[22]);
    }

    /// A sending overlay dims every cell inside the panel and leaves only the close key live.
    #[test]
    fn sending_dims_every_key() {
        let state = state_with(hello_item(), Phase::Sending, "", 80, 24);
        let mut terminal =
            Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
        terminal
            .draw(|frame| crate::view::draw(frame, &state, &Options::default()))
            .expect("the frame draws");
        let buffer = terminal.backend().buffer();
        let drawn: Vec<String> = (0..24u16)
            .map(|y| (0..80u16).map(|x| buffer[(x, y)].symbol()).collect())
            .collect();
        assert!(
            drawn[18].starts_with(" \u{2502} status   sending\u{2026}  keys locked"),
            "{}",
            drawn[18]
        );
        assert_eq!(drawn[22].trim(), "Esc close");

        let rect = overlay_rect(crate::view::bands(Rect::new(0, 0, 80, 24)).body);
        let dim = Theme::new(&Options::default()).colors().dim;
        for y in (rect.y + 1)..=(rect.y + rect.height - 2) {
            for x in (rect.x + 2)..=(rect.x + rect.width - 3) {
                let cell = &buffer[(x, y)];
                if cell.symbol() == " " {
                    continue;
                }
                assert_eq!(cell.fg, dim, "the cell at {x},{y} is not dim");
            }
        }
    }

    /// A refusal draws its first stderr line in the panel and leaves the answer keys live.
    #[test]
    fn refused_adds_the_stderr_line() {
        let line = "bots: answer-not-approver";
        let mut state = state_with(hello_item(), Phase::Refused(line.to_string()), "", 80, 24);
        state.last_error = Some(StatusLine {
            source: Source::Answer,
            text: line.to_string(),
        });
        let drawn = rows_with(&state, 80, 24);
        assert!(
            drawn[18].starts_with(" \u{2502} status   bots: answer-not-approver"),
            "{}",
            drawn[18]
        );
        assert_eq!(drawn[21].trim(), "bots: answer-not-approver");
        assert_eq!(
            drawn[22].trim(),
            "t type \u{b7} n deny \u{b7} y approve once \u{b7} Esc close"
        );

        let escaped = "bots: x\u{1b}[2J\nsecond";
        let mut state = state_with(
            hello_item(),
            Phase::Refused(escaped.to_string()),
            "",
            80,
            24,
        );
        state.last_error = Some(StatusLine {
            source: Source::Answer,
            text: escaped.to_string(),
        });
        let drawn = rows_with(&state, 80, 24);
        assert!(
            drawn[18].starts_with(" \u{2502} status   bots: x?[2J"),
            "{}",
            drawn[18]
        );
        for row in &drawn {
            assert!(!row.contains("second"), "{row}");
        }
    }

    /// A gone item says so, lists its options without digits and leaves only the close key.
    #[test]
    fn gone_replaces_the_choices() {
        let decision = rows_with(&state_with(hello_item(), Phase::Gone, "", 80, 24), 80, 24);
        assert!(
            decision[18].starts_with(" \u{2502} status   This item is no longer open. Esc closes."),
            "{}",
            decision[18]
        );
        assert!(
            decision[8].starts_with(" \u{2502} options  none"),
            "{}",
            decision[8]
        );
        assert_eq!(decision[22].trim(), "Esc close");

        let choice = rows_with(&state_with(digest_item(), Phase::Gone, "", 80, 24), 80, 24);
        for row in &choice {
            assert!(!row.contains("  1  email"), "{row}");
        }
        assert!(
            choice
                .iter()
                .any(|row| row.starts_with(" \u{2502} options  email, chat")),
            "{}",
            choice[8]
        );
        assert_eq!(choice[22].trim(), "Esc close");
    }

    /// The grant row draws only when the item carries a grant.
    #[test]
    fn grant_row_draws_only_when_present() {
        let mut item = hello_item();
        item.grants = Some(Grant {
            kind: "send".to_string(),
            rung: "kind".to_string(),
        });
        let drawn = rows_with(&state_with(item, Phase::Idle, "", 80, 24), 80, 24);
        assert!(
            drawn[9].starts_with(" \u{2502} grant    kind send \u{b7} rung kind"),
            "{}",
            drawn[9]
        );

        let drawn = rows_with(&state_with(hello_item(), Phase::Idle, "", 80, 24), 80, 24);
        for row in &drawn {
            assert!(!row.contains("grant"), "{row}");
        }
    }

    /// Typing draws the line, puts the cursor after it and keeps the end of a long line in view.
    #[test]
    fn typing_draws_the_line_and_the_cursor() {
        let state = state_with(
            hello_item(),
            Phase::Typing,
            "ship it after the freeze",
            80,
            24,
        );
        let mut terminal =
            Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
        terminal
            .draw(|frame| crate::view::draw(frame, &state, &Options::default()))
            .expect("the frame draws");
        let buffer = terminal.backend().buffer();
        let drawn: Vec<String> = (0..24u16)
            .map(|y| (0..80u16).map(|x| buffer[(x, y)].symbol()).collect())
            .collect();
        assert!(
            drawn[10].starts_with(" \u{2502} answer   > ship it after the freeze"),
            "{}",
            drawn[10]
        );
        assert!(
            drawn[18].starts_with(" \u{2502} status   typing \u{b7} single-key shortcuts paused"),
            "{}",
            drawn[18]
        );
        assert_eq!(
            drawn[22].trim(),
            "type answer \u{b7} Enter send \u{b7} Bksp delete \u{b7} Esc close"
        );
        let cursor = terminal.backend().cursor_position();
        let used = UnicodeWidthStr::width("answer   > ship it after the freeze");
        assert_eq!(
            cursor.x,
            3 + u16::try_from(used).expect("the line fits a row")
        );
        assert_eq!(cursor.y, 10);

        let long = format!("{}END", "a".repeat(500));
        let drawn = rows_with(
            &state_with(hello_item(), Phase::Typing, &long, 80, 24),
            80,
            24,
        );
        assert!(
            drawn[10].trim_end().ends_with("END \u{2502}"),
            "{}",
            drawn[10]
        );
    }

    /// A body shorter than the panel keeps the head line and the status line.
    #[test]
    fn short_body_keeps_the_head_and_status() {
        let drawn = rows_with(&state_with(hello_item(), Phase::Idle, "", 80, 12), 80, 12);
        assert!(
            drawn
                .iter()
                .any(|row| row.contains("hello \u{b7} open \u{b7} 2m ago")),
            "{drawn:?}"
        );
        assert!(
            drawn.iter().any(|row| row.contains("status   ready")),
            "{drawn:?}"
        );
    }
}
