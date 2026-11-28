//! Draws the four pane bodies into the body band.
//! Every runtime string passes through the theme's sanitizer before it reaches a cell.

use ratatui::layout::Rect;
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use ratatui::Frame;
use unicode_width::{UnicodeWidthChar, UnicodeWidthStr};

use crate::model::{
    parse_utc, ActivityGroup, ActivityRow, InboxItem, ItemState, Role, Routine, RunState,
};
use crate::state::{
    activity_key, chat_bots, chat_unanswered, chat_window, ActivityKey, BotId, ChatLine, ChatMode,
    EpochMs, Outcome, PaneState, State, Tab,
};
use crate::theme::{marker, printable, state_color, Theme};
use crate::view::{banner, header, window_start};

/// The narrowest body that draws the detail column beside the list.
const WIDE: u16 = 120;

/// The columns the rule and the detail column take from a wide body.
const DETAIL_BAND: u16 = 48;

/// The columns a detail line is cut to.
const DETAIL_WIDTH: usize = 47;

/// The line the inbox pane draws under its items once one of them has expired.
const EXPIRED_NOTE: &str = "Expired items stay listed and cannot be answered.";

/// The display lines one routine takes, so a routine's first line is four times its index.
const ROUTINE_LINES: usize = 4;

/// The three lines the routines pane draws when the payload holds no routine.
const ROUTINE_EMPTY_LINES: [&str; 3] = [
    "  No routine yet.",
    "  A routine is the four-part block in a BOT.md: what it does,",
    "  when it starts, whether it acts or tells, and when it is done.",
];

/// The line the chat pane draws under a failed read, so the reader knows why the list is empty.
const CHAT_ERROR_NOTE: &str = "  No messages yet. The last read failed.";

/// The line the chat pane draws when the status read lists no bot.
const CHAT_NO_BOTS: &str = "  No bots installed.";

/// The line the chat pane draws when a bot is installed and none is chosen.
const CHAT_NO_BOT: &str = "  No bot chosen. Press b to choose one.";

/// The line the chat pane draws when the conversation holds no message.
const CHAT_EMPTY_NOTE: &str = "  No messages yet.";

/// The line the picker draws under its bots, so the reader knows what a pick does.
const PICKER_NOTE: &str = "  The bot you pick is the default bot of its own conversation.";

/// The note a stale transcript draws under its messages.
const STALE_NOTE: &str = "  Messages from the last successful read stay on screen.";

/// One data pane's name and the verb its loading line names.
struct Pane {
    /// The pane's name, drawn as its title.
    name: &'static str,
    /// The verb the loading line names.
    verb: &'static str,
}

/// The activity pane.
const ACTIVITY: Pane = Pane {
    name: "Activity",
    verb: "activity",
};

/// The inbox pane.
const INBOX: Pane = Pane {
    name: "Inbox",
    verb: "inbox",
};

/// The routines pane.
const ROUTINES: Pane = Pane {
    name: "Routines",
    verb: "routines",
};

/// The two lines the activity pane draws when it holds no row.
const ACTIVITY_EMPTY_LINES: [&str; 2] = [
    "  No activity yet.",
    "  A run appears here once a bot has run.",
];

/// The two lines the inbox pane draws when it holds no item.
const INBOX_EMPTY_LINES: [&str; 2] = [
    "  No open or expired items.",
    "  A bot that needs an answer appears here.",
];

/// The line a pane draws under a failed read, so the reader knows why the list is empty.
const ERROR_NOTE: &str = "  No rows yet. The last read failed.";

/// The detail line the activity pane draws when no row is selected.
const NO_ROW_SELECTED: &str = "No row selected.";

/// Cuts text to a display width, marking the cut so a clipped line never reads as complete.
///
/// The walk stops at the first character that does not fit, so a double-width character is
/// never split across two cells and a combining mark is dropped with the base it modifies.
pub fn clip(text: &str, width: usize, ascii: bool) -> String {
    if UnicodeWidthStr::width(text) <= width {
        return text.to_string();
    }
    let ellipsis = if ascii { "..." } else { "\u{2026}" };
    let ellipsis_width = UnicodeWidthStr::width(ellipsis);
    if width < ellipsis_width {
        return ellipsis.chars().take(width).collect();
    }
    let budget = width - ellipsis_width;
    let mut drawn = String::new();
    let mut used: usize = 0;
    for c in text.chars() {
        let step = UnicodeWidthChar::width(c).unwrap_or(0);
        if used.saturating_add(step) > budget {
            break;
        }
        drawn.push(c);
        used += step;
    }
    drawn.push_str(ellipsis);
    drawn
}

/// Cuts a line of styled spans to a display width, keeping each span's own style.
///
/// A span that does not fit is cut with the same character walk `clip` uses, so a wide cell
/// is never split and every later span is dropped rather than drawn past the width.
fn clip_spans(spans: Vec<Span<'static>>, width: usize, ascii: bool) -> Line<'static> {
    let total: usize = spans
        .iter()
        .map(|span| UnicodeWidthStr::width(span.content.as_ref()))
        .sum();
    if total <= width {
        return Line::from(spans);
    }
    let ellipsis = if ascii { "..." } else { "\u{2026}" };
    let ellipsis_width = UnicodeWidthStr::width(ellipsis);
    if width < ellipsis_width {
        return Line::from(ellipsis.chars().take(width).collect::<String>());
    }
    let budget = width - ellipsis_width;
    let mut kept: Vec<Span<'static>> = Vec::new();
    let mut used: usize = 0;
    for span in spans {
        let span_width = UnicodeWidthStr::width(span.content.as_ref());
        if used.saturating_add(span_width) <= budget {
            used += span_width;
            kept.push(span);
            continue;
        }
        let style = span.style;
        let mut drawn = String::new();
        let mut local: usize = 0;
        for c in span.content.chars() {
            let step = UnicodeWidthChar::width(c).unwrap_or(0);
            if used.saturating_add(local).saturating_add(step) > budget {
                break;
            }
            drawn.push(c);
            local += step;
        }
        drawn.push_str(ellipsis);
        kept.push(Span::styled(drawn, style));
        return Line::from(kept);
    }
    Line::from(kept)
}

/// Pads text with spaces to a display width, always adding at least one.
fn pad(text: &str, width: usize) -> String {
    let mut out = String::from(text);
    let fill = width.saturating_sub(UnicodeWidthStr::width(text)).max(1);
    out.push_str(&" ".repeat(fill));
    out
}

/// Drops the fraction from a timestamp or draws a question mark when it does not parse.
fn instant(text: &str) -> String {
    if parse_utc(text).is_none() {
        return "?".to_string();
    }
    match text.split_once('.') {
        Some((head, _)) => format!("{head}Z"),
        None => text.to_string(),
    }
}

/// The age of a timestamp or a question mark when it does not parse.
fn age(state: &State, text: &str) -> String {
    match parse_utc(text) {
        Some(at) => header::age_label(state.now, at),
        None => "?".to_string(),
    }
}

/// One detail line: a fixed key, then the sanitized value.
fn field(key: &str, value: &str) -> String {
    format!("{key:<9} {}", printable(value))
}

/// A count with its singular or plural noun.
fn count(n: usize, one: &str, many: &str) -> String {
    if n == 1 {
        format!("1 {one}")
    } else {
        format!("{n} {many}")
    }
}

/// One pane's title, list lines and detail lines, ready to paint.
struct Body {
    /// The pane title, drawn on the body's first row.
    title: Line<'static>,
    /// The list lines, drawn from the body's third row.
    lines: Vec<Line<'static>>,
    /// The detail lines, drawn from the body's first row when the body is wide.
    detail: Vec<Line<'static>>,
}

/// Where one pane's title, list window and detail column sit inside the body band.
struct Geometry {
    /// The rectangle the list lines draw into.
    list: Rect,
    /// The column the vertical rule draws in, present only when the body is wide.
    rule: Option<u16>,
    /// The rectangle the detail lines draw into, present only when the body is wide.
    detail: Option<Rect>,
    /// How many list lines fit below the title and its blank row.
    visible: usize,
    /// The display width the list lines are cut to.
    width: usize,
}

/// Splits the body band into the title row, the list window and the detail column.
fn geometry(area: Rect) -> Geometry {
    let wide = area.width >= WIDE;
    let list_width = if wide {
        area.width.saturating_sub(DETAIL_BAND)
    } else {
        area.width
    };
    let list = Rect::new(
        area.x,
        area.y.saturating_add(2),
        list_width,
        area.height.saturating_sub(2),
    );
    let (rule, detail) = if wide {
        let column = area.x.saturating_add(list_width);
        let width = area.width.saturating_sub(list_width).saturating_sub(1);
        (
            Some(column),
            Some(Rect::new(
                column.saturating_add(1),
                area.y,
                width,
                area.height,
            )),
        )
    } else {
        (None, None)
    };
    Geometry {
        list,
        rule,
        detail,
        visible: usize::from(area.height.saturating_sub(2)),
        width: usize::from(list_width),
    }
}

/// Draws one pane body and returns the number of list lines it built.
fn paint(frame: &mut Frame, area: Rect, theme: &Theme, body: Body) -> usize {
    let Body {
        title,
        lines,
        detail,
    } = body;
    let count = lines.len();
    let g = geometry(area);
    let colors = theme.colors();
    let title = clip_spans(title.spans, g.width, theme.ascii);
    frame.render_widget(
        Paragraph::new(title),
        Rect::new(area.x, area.y, g.list.width, 1),
    );
    frame.render_widget(Paragraph::new(lines), g.list);
    if let Some(column) = g.rule {
        let rule = if theme.ascii { "|" } else { "\u{2502}" };
        let buffer = frame.buffer_mut();
        for row in 0..area.height {
            if let Some(cell) = buffer.cell_mut((column, area.y.saturating_add(row))) {
                cell.set_symbol(rule);
                cell.set_style(Style::default().fg(colors.dim));
            }
        }
    }
    if let Some(rect) = g.detail {
        frame.render_widget(Paragraph::new(detail), rect);
    }
    count
}

/// The body a pane draws before its first read lands.
fn loading_body(theme: &Theme, area: Rect, pane: &Pane) -> Body {
    let g = geometry(area);
    let ellipsis = if theme.ascii { "..." } else { "\u{2026}" };
    let verb = pane.verb;
    let line = format!("  Loading{ellipsis}  bots {verb} --json");
    Body {
        title: Line::from(clip(pane.name, g.width, theme.ascii)),
        lines: vec![Line::from(clip(&line, g.width, theme.ascii))],
        detail: Vec::new(),
    }
}

/// The body a pane draws when its first read failed, with the failure's first line.
fn error_body(theme: &Theme, area: Rect, pane: &Pane, error: Option<&str>) -> Body {
    let g = geometry(area);
    let first = error
        .and_then(|line| line.lines().next())
        .unwrap_or_default();
    // The two spaces that indent the line come out of the list width, so the line still fits.
    let text = clip(&printable(first), g.width.saturating_sub(2), theme.ascii);
    Body {
        title: Line::from(clip(pane.name, g.width, theme.ascii)),
        lines: vec![
            Line::from(format!("  {text}")),
            Line::from(""),
            Line::from(clip(ERROR_NOTE, g.width, theme.ascii)),
        ],
        detail: Vec::new(),
    }
}

/// The title a stale pane draws, its name and the age of its last good read.
fn stale_title(state: &State, pane: &Pane, last_ok_at: Option<EpochMs>) -> String {
    match last_ok_at {
        Some(at) => format!(
            "{} \u{b7} {}",
            pane.name,
            header::stale_label(state.now, at)
        ),
        None => pane.name.to_string(),
    }
}

/// Draws the active tab's pane into the body and returns the list lines it built.
pub fn draw(frame: &mut Frame, area: Rect, state: &State, theme: &Theme) -> usize {
    let body = match state.active_tab {
        Tab::Activity => activity_pane(state, theme, area),
        Tab::Inbox => inbox_pane(state, theme, area),
        Tab::Routines => routines_pane(state, theme, area),
        Tab::Chat => chat_pane(state, theme, area),
    };
    paint(frame, area, theme, body)
}

/// The activity groups that hold at least one row, in payload order.
fn kept_groups(state: &State) -> Vec<&ActivityGroup> {
    state
        .activity
        .rows
        .iter()
        .filter(|group| !group.rows.is_empty())
        .collect()
}

/// Builds the activity pane's body for whichever state its remote derives.
fn activity_pane(state: &State, theme: &Theme, area: Rect) -> Body {
    let pane = ACTIVITY;
    let kept = kept_groups(state);
    let rows: usize = kept.iter().map(|group| group.rows.len()).sum();
    let title = format!(
        "{} \u{b7} {} \u{b7} {}",
        pane.name,
        count(kept.len(), "group", "groups"),
        count(rows, "row", "rows")
    );
    match state.activity.pane_state() {
        PaneState::Loading => loading_body(theme, area, &pane),
        PaneState::Error => error_body(theme, area, &pane, state.activity.error.as_deref()),
        PaneState::Empty => activity_empty_body(theme, area, pane.name),
        PaneState::Rows => activity_body(state, theme, area, &title, &kept),
        PaneState::Stale if rows == 0 => activity_empty_body(
            theme,
            area,
            &stale_title(state, &pane, state.activity.last_ok_at),
        ),
        PaneState::Stale => activity_body(
            state,
            theme,
            area,
            &stale_title(state, &pane, state.activity.last_ok_at),
            &kept,
        ),
    }
}

/// Builds the activity pane's empty lines and the detail column's own note.
fn activity_empty_body(theme: &Theme, area: Rect, title: &str) -> Body {
    let g = geometry(area);
    let lines = ACTIVITY_EMPTY_LINES
        .iter()
        .map(|line| Line::from(clip(line, g.width, theme.ascii)))
        .collect();
    let detail = vec![
        Line::from(clip("Detail", DETAIL_WIDTH, theme.ascii)),
        Line::from(""),
        Line::from(clip(NO_ROW_SELECTED, DETAIL_WIDTH, theme.ascii)),
    ];
    Body {
        title: Line::from(clip(title, g.width, theme.ascii)),
        lines,
        detail,
    }
}

/// Builds the activity pane's visible row lines and its detail column under the given title.
fn activity_body(
    state: &State,
    theme: &Theme,
    area: Rect,
    title: &str,
    kept: &[&ActivityGroup],
) -> Body {
    let g = geometry(area);
    let ascii = theme.ascii;
    let selected = state.activity_view.selected.as_ref();
    let start = window_start(
        activity_selected_line(kept, selected),
        state.activity_view.scroll,
        g.visible,
    );

    // Only the lines inside the window are built, so a payload of thousands of rows costs the
    // same as one that fits.
    let mut lines: Vec<Line<'static>> = Vec::new();
    let mut line_no = 0usize;
    for group in kept {
        let group_len = 1 + group.rows.len();
        if line_no.saturating_add(group_len) <= start {
            line_no += group_len;
            continue;
        }
        if line_no >= start {
            if lines.len() >= g.visible {
                break;
            }
            lines.push(clip_spans(
                vec![Span::raw(printable(&group.title))],
                g.width,
                ascii,
            ));
        }
        let first_row = line_no.saturating_add(1);
        let skip = start.saturating_sub(first_row);
        for row in group.rows.iter().skip(skip) {
            if lines.len() >= g.visible {
                break;
            }
            lines.push(activity_row_line(
                state, theme, group, row, selected, g.width,
            ));
        }
        line_no += group_len;
        if lines.len() >= g.visible {
            break;
        }
    }

    let detail = match selected.and_then(|key| find_row(kept, key)) {
        Some(row) => activity_detail(row, DETAIL_WIDTH, ascii),
        None => Vec::new(),
    };
    Body {
        title: Line::from(clip(title, g.width, ascii)),
        lines,
        detail,
    }
}

/// The first display line of the selected activity row or zero when nothing is selected.
fn activity_selected_line(groups: &[&ActivityGroup], selected: Option<&ActivityKey>) -> usize {
    let Some(selected) = selected else {
        return 0;
    };
    let mut line = 0usize;
    for group in groups {
        line += 1;
        for row in &group.rows {
            if &activity_key(group, row) == selected {
                return line;
            }
            line += 1;
        }
    }
    0
}

/// The activity row the selection names, when the payload still holds it.
fn find_row<'a>(groups: &[&'a ActivityGroup], selected: &ActivityKey) -> Option<&'a ActivityRow> {
    for group in groups {
        for row in &group.rows {
            if &activity_key(group, row) == selected {
                return Some(row);
            }
        }
    }
    None
}

/// The word an activity row draws for its state, with an empty one reading as missing.
fn state_word(row: &ActivityRow) -> String {
    let raw = row.state.as_str();
    if raw.is_empty() {
        "missing".to_string()
    } else {
        printable(raw)
    }
}

/// The time column of an activity row.
fn activity_time(state: &State, row: &ActivityRow) -> String {
    match row.state {
        RunState::Working => "now".to_string(),
        RunState::Recurring => match row.schedule.as_deref() {
            Some(schedule) => printable(schedule),
            None => age(state, &row.at),
        },
        _ => age(state, &row.at),
    }
}

/// One activity row line: the focus mark, the state marker and the three columns.
fn activity_row_line(
    state: &State,
    theme: &Theme,
    group: &ActivityGroup,
    row: &ActivityRow,
    selected: Option<&ActivityKey>,
    width: usize,
) -> Line<'static> {
    let colors = theme.colors();
    let is_selected = selected == Some(&activity_key(group, row));
    let mut mark = Style::default().fg(state_color(&colors, &row.state));
    let mut text = Style::default();
    if is_selected {
        // The reverse video sits on top of the mark, so the row still reads without colour.
        mark = mark.add_modifier(Modifier::REVERSED);
        text = text.add_modifier(Modifier::REVERSED);
    }
    let prefix = if is_selected {
        format!("{} ", theme.focus_mark())
    } else {
        "  ".to_string()
    };
    let columns = format!(
        " {}{}{}",
        pad(&printable(&row.bot_id), 17),
        pad(&state_word(row), 12),
        activity_time(state, row)
    );
    clip_spans(
        vec![
            Span::styled(prefix, text),
            Span::styled(theme.marker(&row.state), mark),
            Span::styled(columns, text),
        ],
        width,
        theme.ascii,
    )
}

/// The detail column of the selected activity row.
fn activity_detail(row: &ActivityRow, width: usize, ascii: bool) -> Vec<Line<'static>> {
    let word = state_word(row);
    let at = instant(&row.at);
    let actor = row.actor.as_deref().unwrap_or("-");
    let run_id = row.run_id.as_deref().unwrap_or("-");
    let fields = [
        ("bot", row.bot_id.as_str()),
        ("identity", row.identity.as_str()),
        ("state", word.as_str()),
        ("at", at.as_str()),
        ("actor", actor),
        ("runId", run_id),
    ];
    let mut lines = vec![Line::from(clip("Detail", width, ascii)), Line::from("")];
    for (key, value) in fields {
        lines.push(Line::from(clip(&field(key, value), width, ascii)));
    }
    lines
}

/// The outcome word an answered item draws, when a mark still names it.
fn answered_word(state: &State, item: &InboxItem) -> Option<&'static str> {
    state
        .answered
        .iter()
        .find(|mark| mark.id == item.id)
        .map(|mark| match mark.outcome {
            Outcome::Approved => "approved",
            Outcome::Denied => "denied",
            Outcome::Answered => "answered",
        })
}

/// Whether an item still waits for an answer, so its row draws the gutter mark.
fn is_open(state: &State, item: &InboxItem) -> bool {
    item.state == ItemState::Open && answered_word(state, item).is_none()
}

/// The word an inbox row draws for its state, the answered word when one is marked.
fn item_word(state: &State, item: &InboxItem) -> String {
    match answered_word(state, item) {
        Some(word) => word.to_string(),
        None => printable(item.state.as_str()),
    }
}

/// The time column of an inbox row, the expiry on an item that can no longer be answered.
fn item_time(state: &State, item: &InboxItem) -> String {
    if item.state == ItemState::Expired {
        age(state, &item.expires_at)
    } else {
        age(state, &item.at)
    }
}

/// The inbox item the selection names, when the payload still holds it.
fn selected_item(state: &State) -> Option<&InboxItem> {
    let selected = state.inbox_view.selected.as_ref()?;
    state.inbox.rows.iter().find(|item| &item.id == selected)
}

/// The first display line of the selected inbox item or zero when nothing is selected.
fn inbox_selected_line(state: &State) -> usize {
    let Some(selected) = state.inbox_view.selected.as_ref() else {
        return 0;
    };
    state
        .inbox
        .rows
        .iter()
        .position(|item| &item.id == selected)
        .unwrap_or(0)
}

/// Builds the inbox pane's body for whichever state its remote derives.
fn inbox_pane(state: &State, theme: &Theme, area: Rect) -> Body {
    let pane = INBOX;
    let items = &state.inbox.rows;
    let open = items.iter().filter(|item| is_open(state, item)).count();
    let expired = items
        .iter()
        .filter(|item| item.state == ItemState::Expired)
        .count();
    let title = format!("{} \u{b7} {open} open \u{b7} {expired} expired", pane.name);
    match state.inbox.pane_state() {
        PaneState::Loading => loading_body(theme, area, &pane),
        PaneState::Error => error_body(theme, area, &pane, state.inbox.error.as_deref()),
        PaneState::Empty => inbox_empty_body(theme, area, pane.name),
        PaneState::Rows => inbox_body(state, theme, area, &title),
        PaneState::Stale if items.is_empty() => inbox_empty_body(
            theme,
            area,
            &stale_title(state, &pane, state.inbox.last_ok_at),
        ),
        PaneState::Stale => inbox_body(
            state,
            theme,
            area,
            &stale_title(state, &pane, state.inbox.last_ok_at),
        ),
    }
}

/// Builds the inbox pane's empty lines, which say what lands in it.
fn inbox_empty_body(theme: &Theme, area: Rect, title: &str) -> Body {
    let g = geometry(area);
    let lines = INBOX_EMPTY_LINES
        .iter()
        .map(|line| Line::from(clip(line, g.width, theme.ascii)))
        .collect();
    Body {
        title: Line::from(clip(title, g.width, theme.ascii)),
        lines,
        detail: Vec::new(),
    }
}

/// Builds the inbox pane's visible item lines and its detail column under the given title.
fn inbox_body(state: &State, theme: &Theme, area: Rect, title: &str) -> Body {
    let g = geometry(area);
    let ascii = theme.ascii;
    let items = &state.inbox.rows;
    let expired = items
        .iter()
        .filter(|item| item.state == ItemState::Expired)
        .count();
    let start = window_start(
        inbox_selected_line(state),
        state.inbox_view.scroll,
        g.visible,
    );
    // The note under the items takes two display lines of its own, so the window counts them.
    let total = items.len() + if expired > 0 { 2 } else { 0 };
    let end = start.saturating_add(g.visible).min(total);

    // Only the lines inside the window are built, so a long inbox costs the same as a short one.
    let mut lines: Vec<Line<'static>> = Vec::new();
    for line_no in start..end {
        if let Some(item) = items.get(line_no) {
            lines.push(inbox_row_line(state, theme, item, g.width));
        } else if line_no == items.len() {
            lines.push(Line::from(""));
        } else {
            lines.push(Line::from(clip(EXPIRED_NOTE, g.width, ascii)));
        }
    }

    let detail = match selected_item(state) {
        Some(item) => inbox_detail(state, item, DETAIL_WIDTH, ascii),
        None => Vec::new(),
    };
    Body {
        title: Line::from(clip(title, g.width, ascii)),
        lines,
        detail,
    }
}

/// One inbox row line: the focus mark, the needs-you gutter and the four columns.
fn inbox_row_line(state: &State, theme: &Theme, item: &InboxItem, width: usize) -> Line<'static> {
    let colors = theme.colors();
    let open = is_open(state, item);
    let is_selected = state.inbox_view.selected.as_ref() == Some(&item.id);
    let mut text = Style::default();
    if !open {
        // A row that cannot be answered is dimmed, so the gutter alone says which rows can.
        text = text.fg(colors.dim).add_modifier(Modifier::DIM);
    }
    if is_selected {
        text = text.add_modifier(Modifier::REVERSED);
    }
    let mut gutter = if open {
        Style::default().fg(colors.needs_you)
    } else {
        text
    };
    if is_selected {
        gutter = gutter.add_modifier(Modifier::REVERSED);
    }
    let focus = if is_selected { theme.focus_mark() } else { " " };
    let mark = if open { "!" } else { " " };
    let columns = format!(
        " {}{}{}{}",
        pad(&printable(&item.bot_id), 17),
        pad(&item_word(state, item), 9),
        pad(&item_time(state, item), 9),
        printable(&item.question)
    );
    clip_spans(
        vec![
            Span::styled(format!("  {focus} "), text),
            Span::styled(mark, gutter),
            Span::styled(columns, text),
        ],
        width,
        theme.ascii,
    )
}

/// The detail column of the selected inbox item.
fn inbox_detail(state: &State, item: &InboxItem, width: usize, ascii: bool) -> Vec<Line<'static>> {
    let word = item_word(state, item);
    let kind = item.kind.as_deref().unwrap_or("decision");
    let at = instant(&item.at);
    let expires_at = instant(&item.expires_at);
    let options = if item.options.is_empty() {
        "none".to_string()
    } else {
        item.options.join(", ")
    };
    let fields = [
        ("id", item.id.0.as_str()),
        ("botId", item.bot_id.as_str()),
        ("kind", kind),
        ("state", word.as_str()),
        ("at", at.as_str()),
        ("expiresAt", expires_at.as_str()),
        ("options", options.as_str()),
    ];
    let mut lines = vec![Line::from(clip("Detail", width, ascii)), Line::from("")];
    for (key, value) in fields {
        lines.push(Line::from(clip(&field(key, value), width, ascii)));
    }
    // A grant line sits under the options, so the reader sees what the answer would grant.
    if let Some(grant) = item.grants.as_ref() {
        let value = format!("kind {} \u{b7} rung {}", grant.kind, grant.rung);
        lines.push(Line::from(clip(&field("grant", &value), width, ascii)));
    }
    lines.push(Line::from(""));
    // The hint says what Enter does, so a row that cannot be answered offers no answer key.
    let hint = if is_open(state, item) {
        "Enter opens the overlay."
    } else {
        "Enter shows it is no longer open."
    };
    lines.push(Line::from(clip(hint, width, ascii)));
    lines
}

/// The start a routine draws, its summary first, then its expression, then its kind.
fn routine_start(routine: &Routine) -> String {
    let Some(start) = routine.starts.first() else {
        return "-".to_string();
    };
    let text = start
        .summary
        .as_deref()
        .or(start.expression.as_deref())
        .unwrap_or(start.kind.as_str());
    printable(text)
}

/// The second line of a routine: when it starts, what it does and when it is done.
fn routine_sentence(routine: &Routine) -> String {
    let mut line = format!(
        "    starts  {} \u{b7} does {}",
        routine_start(routine),
        printable(&routine.does)
    );
    if let Some(until) = routine.until.as_deref() {
        line.push_str(&format!(" \u{b7} until \"{}\"", printable(until)));
    }
    line
}

/// The third line of a routine: its switch and how many runs in a row have failed.
fn routine_state_line(routine: &Routine) -> String {
    format!(
        "    state   {} \u{b7} streak {}",
        printable(&routine.switch),
        routine.failure_streak
    )
}

/// One of a routine's four display lines, the first carrying the focus mark and the reverse video.
fn routine_line(
    theme: &Theme,
    routine: &Routine,
    offset: usize,
    selected: Option<&BotId>,
    width: usize,
) -> Line<'static> {
    let is_selected = selected == Some(&routine.bot_id);
    match offset {
        0 => {
            let mut style = Style::default();
            if is_selected {
                // The reverse video marks the whole first line, so the row reads without colour.
                style = style.add_modifier(Modifier::REVERSED);
            }
            let focus = if is_selected { theme.focus_mark() } else { " " };
            clip_spans(
                vec![Span::styled(
                    format!("  {focus} {}", printable(&routine.bot_id.0)),
                    style,
                )],
                width,
                theme.ascii,
            )
        }
        1 => Line::from(clip(&routine_sentence(routine), width, theme.ascii)),
        2 => Line::from(clip(&routine_state_line(routine), width, theme.ascii)),
        _ => Line::from(""),
    }
}

/// The detail column of the selected routine.
fn routines_detail(routine: &Routine, width: usize, ascii: bool) -> Vec<Line<'static>> {
    let start = routine_start(routine);
    let until = routine.until.as_deref().unwrap_or("-");
    let until_met_at = routine
        .until_met_at
        .as_deref()
        .map_or_else(|| "-".to_string(), instant);
    let streak = routine.failure_streak.to_string();
    let fields = [
        ("botId", routine.bot_id.0.as_str()),
        ("what", routine.what.as_str()),
        ("starts", start.as_str()),
        ("does", routine.does.as_str()),
        ("until", until),
        ("untilMetAt", until_met_at.as_str()),
        ("streak", streak.as_str()),
        ("switch", routine.switch.as_str()),
    ];
    let mut lines = vec![Line::from(clip("Detail", width, ascii)), Line::from("")];
    for (key, value) in fields {
        lines.push(Line::from(clip(&field(key, value), width, ascii)));
    }
    lines
}

/// Builds the routines pane's body for whichever state its remote derives.
fn routines_pane(state: &State, theme: &Theme, area: Rect) -> Body {
    let pane = ROUTINES;
    let routines = &state.routines.rows;
    let title = format!(
        "{} \u{b7} {}",
        pane.name,
        count(routines.len(), "routine", "routines")
    );
    match state.routines.pane_state() {
        PaneState::Loading => loading_body(theme, area, &pane),
        PaneState::Error => error_body(theme, area, &pane, state.routines.error.as_deref()),
        PaneState::Empty => routines_empty_body(theme, area, pane.name),
        PaneState::Rows => routines_body(state, theme, area, &title),
        PaneState::Stale if routines.is_empty() => routines_empty_body(
            theme,
            area,
            &stale_title(state, &pane, state.routines.last_ok_at),
        ),
        PaneState::Stale => routines_body(
            state,
            theme,
            area,
            &stale_title(state, &pane, state.routines.last_ok_at),
        ),
    }
}

/// Builds the routines pane's visible routine lines and its detail column under the given title.
fn routines_body(state: &State, theme: &Theme, area: Rect, title: &str) -> Body {
    let g = geometry(area);
    let ascii = theme.ascii;
    let routines = &state.routines.rows;
    let selected = state.routines_view.selected.as_ref();
    let selected_line = selected
        .and_then(|key| routines.iter().position(|routine| &routine.bot_id == key))
        .map_or(0, |index| index * ROUTINE_LINES);
    let start = window_start(selected_line, state.routines_view.scroll, g.visible);
    let total = routines.len() * ROUTINE_LINES;
    let end = start.saturating_add(g.visible).min(total);

    // Only the lines inside the window are built, so a long list costs the same as a short one.
    let mut lines: Vec<Line<'static>> = Vec::new();
    for line_no in start..end {
        let Some(routine) = routines.get(line_no / ROUTINE_LINES) else {
            continue;
        };
        lines.push(routine_line(
            theme,
            routine,
            line_no % ROUTINE_LINES,
            selected,
            g.width,
        ));
    }

    let detail =
        match selected.and_then(|key| routines.iter().find(|routine| &routine.bot_id == key)) {
            Some(routine) => routines_detail(routine, DETAIL_WIDTH, ascii),
            None => Vec::new(),
        };
    Body {
        title: Line::from(clip(title, g.width, ascii)),
        lines,
        detail,
    }
}

/// Builds the routines pane's empty lines, which say what a routine is.
fn routines_empty_body(theme: &Theme, area: Rect, title: &str) -> Body {
    let g = geometry(area);
    let lines = ROUTINE_EMPTY_LINES
        .iter()
        .map(|line| Line::from(clip(line, g.width, theme.ascii)))
        .collect();
    Body {
        title: Line::from(clip(title, g.width, theme.ascii)),
        lines,
        detail: Vec::new(),
    }
}

/// The UTC hour and minute of a timestamp or a question mark when it does not parse.
fn clock(at: &str) -> String {
    match parse_utc(at) {
        Some(at) => {
            let minutes = at.div_euclid(60_000).rem_euclid(1_440);
            format!("{:02}:{:02}", minutes / 60, minutes % 60)
        }
        None => "?".to_string(),
    }
}

/// One chat detail line: a fixed key, then the sanitized value.
fn chat_field(key: &str, value: &str) -> String {
    format!("{key:<13} {}", printable(value))
}

/// One chat detail line, cut to the detail column's width.
fn chat_detail_line(key: &str, value: &str, width: usize, ascii: bool) -> Line<'static> {
    Line::from(clip(&chat_field(key, value), width, ascii))
}

/// The conversation file a bot's messages are stored in.
fn chat_file(bot: &BotId) -> String {
    format!("conversations/{}.jsonl", bot.0)
}

/// The item id inside the first `(item ...)` of a parked message's text.
fn item_id(text: &str) -> Option<String> {
    let rest = text.split_once("(item ")?.1;
    Some(rest.split_once(')')?.0.to_string())
}

/// The secret's name inside the first `[redacted: ...]` of a message's text.
fn redacted_name(text: &str) -> Option<String> {
    let rest = text.split_once("[redacted: ")?.1;
    Some(rest.split_once(']')?.0.to_string())
}

/// The tail of a text that fits a display width, so the newest typed character stays on screen.
fn tail(text: &str, width: usize) -> String {
    let mut used = 0usize;
    let mut kept: Vec<char> = Vec::new();
    for c in text.chars().rev() {
        let step = UnicodeWidthChar::width(c).unwrap_or(0);
        if used.saturating_add(step) > width {
            break;
        }
        used += step;
        kept.push(c);
    }
    kept.iter().rev().collect()
}

/// The chat pane's title, which names the conversation, its message count and its read state.
fn chat_title(state: &State, bot: Option<&BotId>, pane: PaneState, ellipsis: &str) -> String {
    if state.chat_view.mode == ChatMode::Picking {
        return "Chat \u{b7} choose a bot".to_string();
    }
    let Some(bot) = bot else {
        return "Chat".to_string();
    };
    if matches!(pane, PaneState::Loading | PaneState::Error) {
        return format!("Chat \u{b7} {}", printable(&bot.0));
    }
    let mut title = format!(
        "Chat \u{b7} {} \u{b7} {}",
        printable(&bot.0),
        count(state.chat.rows.messages.len(), "message", "messages")
    );
    if state.chat_view.sending.is_some() {
        title.push_str(&format!(" \u{b7} sending{ellipsis}"));
    }
    if pane == PaneState::Stale {
        if let Some(at) = state.chat.last_ok_at {
            title.push_str(&format!(" \u{b7} {}", header::stale_label(state.now, at)));
        }
    }
    title
}

/// The picker's bot lines and the note under them, with the selected row marked.
fn chat_picker_lines(state: &State, theme: &Theme, width: usize) -> Vec<Line<'static>> {
    let ascii = theme.ascii;
    let bots = chat_bots(state);
    if bots.is_empty() {
        return vec![Line::from(clip(CHAT_NO_BOTS, width, ascii))];
    }
    let mut lines: Vec<Line<'static>> = Vec::new();
    for (index, bot) in bots.iter().enumerate() {
        let name = printable(&bot.0);
        if index == state.chat_view.picker_selected {
            // The reverse video marks the selected row, so the picker reads without colour.
            lines.push(clip_spans(
                vec![Span::styled(
                    format!("{} {name}", theme.focus_mark()),
                    Style::default().add_modifier(Modifier::REVERSED),
                )],
                width,
                ascii,
            ));
        } else {
            lines.push(Line::from(clip(&format!("  {name}"), width, ascii)));
        }
    }
    lines.push(Line::from(""));
    lines.push(Line::from(clip(PICKER_NOTE, width, ascii)));
    lines
}

/// The label line of one message: who wrote it, to which bot and when.
fn chat_label(state: &State, theme: &Theme, index: usize, width: usize) -> Line<'static> {
    let ascii = theme.ascii;
    let Some(message) = state.chat.rows.messages.get(index) else {
        return Line::from("");
    };
    let at = clock(&message.at);
    match &message.role {
        Role::Human => {
            let mut text = format!(
                "  {} \u{2192} {} \u{b7} {at}",
                printable(&message.by),
                printable(&message.bot_id)
            );
            if chat_unanswered(state, index) {
                text.push_str(" \u{b7} no reply yet");
            }
            Line::from(clip(&text, width, ascii))
        }
        Role::Bot => {
            let state_word = if message.text.starts_with("needs you: ") {
                RunState::NeedsYou
            } else if message.text.starts_with("failed: ") {
                RunState::Failed
            } else {
                RunState::Done
            };
            let colors = theme.colors();
            clip_spans(
                vec![
                    Span::styled(
                        marker(&state_word, ascii),
                        Style::default().fg(state_color(&colors, &state_word)),
                    ),
                    Span::styled(
                        format!(" {} \u{b7} {at}", printable(&message.bot_id)),
                        Style::default(),
                    ),
                ],
                width,
                ascii,
            )
        }
        Role::Unknown(raw) => Line::from(clip(
            &format!(
                "? {} \u{b7} {} \u{b7} {at}",
                printable(raw),
                printable(&message.bot_id)
            ),
            width,
            ascii,
        )),
    }
}

/// One transcript line, styled by the message it belongs to.
fn chat_line(
    state: &State,
    theme: &Theme,
    line: &ChatLine,
    bot: &BotId,
    width: usize,
) -> Line<'static> {
    let ascii = theme.ascii;
    let ellipsis = if ascii { "..." } else { "\u{2026}" };
    match line {
        ChatLine::Earlier(n) => Line::from(clip(
            &format!(
                "  \u{2191} {} \u{b7} PgUp",
                count(*n, "earlier message", "earlier messages")
            ),
            width,
            ascii,
        )),
        ChatLine::Label(index) => chat_label(state, theme, *index, width),
        ChatLine::Text(text) => Line::from(clip(text, width, ascii)),
        ChatLine::Working => {
            let colors = theme.colors();
            let name = state
                .chat
                .rows
                .messages
                .iter()
                .rfind(|message| message.role == Role::Human)
                .map_or_else(|| bot.0.clone(), |message| message.bot_id.clone());
            clip_spans(
                vec![
                    Span::styled(
                        marker(&RunState::Working, ascii),
                        Style::default().fg(state_color(&colors, &RunState::Working)),
                    ),
                    Span::styled(
                        format!(" {} \u{b7} working{ellipsis}", printable(&name)),
                        Style::default(),
                    ),
                ],
                width,
                ascii,
            )
        }
        ChatLine::StaleNote => Line::from(clip(STALE_NOTE, width, ascii)),
        ChatLine::Blank => Line::from(""),
    }
}

/// The composer row: the bot's name, the prompt and the draft or the hint.
fn chat_composer(state: &State, theme: &Theme, bot: &BotId, width: usize) -> Line<'static> {
    let prefix = format!("[{}] > ", printable(&bot.0));
    let body = match state.chat_view.mode {
        ChatMode::Typing => {
            let room = width.saturating_sub(UnicodeWidthStr::width(prefix.as_str()));
            tail(&printable(&state.chat_view.draft), room)
        }
        _ => "(Enter to type)".to_string(),
    };
    Line::from(clip(&format!("{prefix}{body}"), width, theme.ascii))
}

/// The chat pane's detail column: the conversation, its newest reply and what it holds.
fn chat_detail(
    state: &State,
    bot: Option<&BotId>,
    pane: PaneState,
    width: usize,
    ascii: bool,
) -> Vec<Line<'static>> {
    let messages = &state.chat.rows.messages;
    let mut lines = vec![Line::from(clip("Detail", width, ascii)), Line::from("")];
    if state.chat_view.mode == ChatMode::Picking {
        let bots = chat_bots(state);
        if let Some(selected) = bots.get(state.chat_view.picker_selected) {
            lines.push(chat_detail_line("bot", &selected.0, width, ascii));
            lines.push(chat_detail_line("conversation", &selected.0, width, ascii));
            // The count belongs to the chosen conversation, so it is drawn only for that row.
            if Some(selected) == bot && state.chat.last_ok_at.is_some() {
                lines.push(chat_detail_line(
                    "messages",
                    &messages.len().to_string(),
                    width,
                    ascii,
                ));
            }
        }
        return lines;
    }
    let Some(bot) = bot else {
        return lines;
    };
    lines.push(chat_detail_line("conversation", &bot.0, width, ascii));
    lines.push(chat_detail_line("default bot", &bot.0, width, ascii));
    if matches!(pane, PaneState::Loading | PaneState::Error) {
        return lines;
    }
    lines.push(chat_detail_line(
        "messages",
        &messages.len().to_string(),
        width,
        ascii,
    ));
    let file = chat_file(bot);
    if state.chat_view.sending.is_some() {
        let since = messages.iter().rfind(|message| message.role == Role::Human);
        let value = match since {
            Some(message) => format!("to {}, since {}", bot.0, clock(&message.at)),
            None => format!("to {}", bot.0),
        };
        lines.push(chat_detail_line("sending", &value, width, ascii));
        lines.push(chat_detail_line("file", &file, width, ascii));
        return lines;
    }
    if messages
        .last()
        .is_some_and(|message| message.role == Role::Human)
    {
        let unanswered: Vec<usize> = (0..messages.len())
            .filter(|index| chat_unanswered(state, *index))
            .collect();
        let newest = unanswered.last().and_then(|index| messages.get(*index));
        let value = match newest {
            Some(message) => format!(
                "{}, {} \u{b7} {}",
                unanswered.len(),
                message.by,
                clock(&message.at)
            ),
            None => unanswered.len().to_string(),
        };
        lines.push(chat_detail_line("unanswered", &value, width, ascii));
        lines.push(chat_detail_line("file", &file, width, ascii));
        return lines;
    }
    if let Some(reply) = messages
        .iter()
        .rev()
        .find(|message| message.role == Role::Bot)
    {
        let mut value = format!("{} \u{b7} {}", reply.bot_id, clock(&reply.at));
        if reply.text.starts_with("needs you: ") {
            value.push_str(" \u{b7} needs you");
        } else if reply.text.starts_with("failed: ") {
            value.push_str(" \u{b7} failed");
        }
        lines.push(chat_detail_line("last reply", &value, width, ascii));
        if let Some(run_id) = reply.run_id.as_deref() {
            lines.push(chat_detail_line("run", run_id, width, ascii));
        }
        if reply.text.starts_with("needs you: ") {
            if let Some(item) = item_id(&reply.text) {
                lines.push(chat_detail_line("item", &item, width, ascii));
            }
            let answer = format!("Inbox, {}", banner::inbox_key());
            lines.push(chat_detail_line("answer in", &answer, width, ascii));
        } else if let Some(reason) = reply.text.strip_prefix("failed: ") {
            let first = reason.lines().next().unwrap_or_default();
            lines.push(chat_detail_line("reason", first, width, ascii));
        } else if let Some(name) = redacted_name(&reply.text) {
            lines.push(chat_detail_line("redacted", &name, width, ascii));
        } else {
            lines.push(chat_detail_line("file", &file, width, ascii));
        }
        return lines;
    }
    lines.push(chat_detail_line("file", &file, width, ascii));
    lines
}

/// Builds the chat pane's body for whichever state its remote derives.
fn chat_pane(state: &State, theme: &Theme, area: Rect) -> Body {
    let g = geometry(area);
    let ascii = theme.ascii;
    let ellipsis = if ascii { "..." } else { "\u{2026}" };
    let bot = state.chat_view.bot.as_ref();
    let mode = state.chat_view.mode;
    let messages = &state.chat.rows.messages;
    let pane = state.chat.pane_state();
    let list_rows = g.visible;
    let window_rows = list_rows.saturating_sub(2).max(1);
    let title = chat_title(state, bot, pane, ellipsis);

    let mut lines: Vec<Line<'static>> = Vec::new();
    if mode == ChatMode::Picking {
        lines.extend(chat_picker_lines(state, theme, g.width));
    } else if let Some(bot) = bot {
        match pane {
            PaneState::Loading => {
                let line = format!(
                    "  Loading{ellipsis}  bots chat {} --transcript --json",
                    printable(&bot.0)
                );
                lines.push(Line::from(clip(&line, g.width, ascii)));
            }
            PaneState::Error => {
                let first = state
                    .chat
                    .error
                    .as_deref()
                    .and_then(|line| line.lines().next())
                    .unwrap_or_default();
                // The two spaces that indent the line come out of the list width, so it still fits.
                let text = clip(&printable(first), g.width.saturating_sub(2), ascii);
                lines.push(Line::from(format!("  {text}")));
                lines.push(Line::from(""));
                lines.push(Line::from(clip(CHAT_ERROR_NOTE, g.width, ascii)));
            }
            _ if messages.is_empty() && state.chat_view.sending.is_none() => {
                lines.push(Line::from(clip(CHAT_EMPTY_NOTE, g.width, ascii)));
                let line = format!(
                    "  Press Enter, type a line and press Enter to send it to {}.",
                    printable(&bot.0)
                );
                lines.push(Line::from(clip(&line, g.width, ascii)));
                while lines.len() + 1 < list_rows {
                    lines.push(Line::from(""));
                }
                lines.push(chat_composer(state, theme, bot, g.width));
            }
            _ => {
                let window = chat_window(state, g.width, window_rows);
                for _ in 0..window_rows.saturating_sub(window.len()) {
                    lines.push(Line::from(""));
                }
                for line in &window {
                    lines.push(chat_line(state, theme, line, bot, g.width));
                }
                lines.push(Line::from(""));
                lines.push(chat_composer(state, theme, bot, g.width));
            }
        }
    } else {
        let line = if chat_bots(state).is_empty() {
            CHAT_NO_BOTS
        } else {
            CHAT_NO_BOT
        };
        lines.push(Line::from(clip(line, g.width, ascii)));
    }

    Body {
        title: Line::from(clip(&title, g.width, ascii)),
        lines,
        detail: chat_detail(state, bot, pane, DETAIL_WIDTH, ascii),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// A clipped string keeps its text when it fits and never draws wider than its width.
    #[test]
    fn clips_by_display_width() {
        assert_eq!(clip("hello", 5, false), "hello");
        assert_eq!(clip("hello", 9, true), "hello");

        assert_eq!(clip("hello world", 8, false), "hello w\u{2026}");
        assert_eq!(clip("hello world", 8, true), "hello...");

        // A double-width character is dropped whole rather than split across two cells.
        assert_eq!(
            clip(
                "\u{65e5}\u{672c}\u{8a9e}\u{30c6}\u{30ad}\u{30b9}\u{30c8}",
                7,
                false
            ),
            "\u{65e5}\u{672c}\u{8a9e}\u{2026}"
        );
        assert_eq!(
            clip(
                "\u{65e5}\u{672c}\u{8a9e}\u{30c6}\u{30ad}\u{30b9}\u{30c8}",
                6,
                false
            ),
            "\u{65e5}\u{672c}\u{2026}"
        );
        assert_eq!(clip("ab\u{1f680}cd", 4, false), "ab\u{2026}");

        // A combining mark stays with the base character it modifies.
        assert_eq!(
            clip("e\u{301}e\u{301}e\u{301}xyz", 3, false),
            "e\u{301}e\u{301}\u{2026}"
        );

        assert_eq!(clip("hello", 0, false), "");
        assert_eq!(clip("hello world", 2, true), "..");

        for width in 0..=12 {
            for text in [
                "hello world",
                "\u{65e5}\u{672c}\u{8a9e}\u{30c6}\u{30ad}\u{30b9}\u{30c8}",
                "ab\u{1f680}cd",
                "e\u{301}e\u{301}e\u{301}xyz",
            ] {
                for ascii in [false, true] {
                    let drawn = clip(text, width, ascii);
                    assert!(
                        UnicodeWidthStr::width(drawn.as_str()) <= width,
                        "{text:?} at {width} ascii {ascii} drew {drawn:?}"
                    );
                }
            }
        }
    }
}
