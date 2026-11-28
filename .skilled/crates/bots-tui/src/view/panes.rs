//! Draws the four pane bodies into the body band.
//! Every runtime string passes through the theme's sanitizer before it reaches a cell.

use ratatui::layout::Rect;
use ratatui::style::{Modifier, Style};
use ratatui::text::{Line, Span};
use ratatui::widgets::Paragraph;
use ratatui::Frame;
use unicode_width::{UnicodeWidthChar, UnicodeWidthStr};

use crate::model::{
    parse_utc, ActivityGroup, ActivityRow, InboxItem, ItemState, Routine, RunState,
};
use crate::state::{activity_key, ActivityKey, BotId, EpochMs, Outcome, PaneState, State, Tab};
use crate::theme::{printable, state_color, Theme};
use crate::view::{header, window_start};

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

/// The two lines the chat tab draws until the chat pane lands.
const CHAT_LINES: [&str; 2] = [
    "  The chat pane lands with phase 010 (`bots chat <id>`).",
    "  This tab holds no state until then.",
];

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
        Tab::Chat => chat_body(theme, area),
    };
    let count = paint(frame, area, theme, body);
    // The chat tab draws fixed copy and no list, so it reports no line to the caller.
    if state.active_tab == Tab::Chat {
        0
    } else {
        count
    }
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

/// Builds the chat tab's fixed copy, which reads no state and selects nothing.
fn chat_body(theme: &Theme, area: Rect) -> Body {
    let g = geometry(area);
    let lines = CHAT_LINES
        .iter()
        .map(|line| Line::from(clip(line, g.width, theme.ascii)))
        .collect();
    Body {
        title: Line::from(clip("Chat", g.width, theme.ascii)),
        lines,
        detail: Vec::new(),
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
