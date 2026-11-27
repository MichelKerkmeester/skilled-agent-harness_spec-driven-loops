use crate::keys::{self, Action, Cond, Context, Key};
use crate::model::{ActivityGroup, ActivityRow, InboxItem, Routine, StatusPayload};

/// Milliseconds since the Unix epoch, UTC.
pub type EpochMs = i64;

/// An inbox item's id, the selection key and the only target an answer carries.
#[derive(Clone, Debug, Default, PartialEq, Eq, Hash, PartialOrd, Ord, serde::Deserialize)]
#[serde(transparent)]
pub struct ItemId(pub String);

/// A routine's bot id, the selection key inside one checkout.
#[derive(Clone, Debug, Default, PartialEq, Eq, Hash, PartialOrd, Ord, serde::Deserialize)]
#[serde(transparent)]
pub struct BotId(pub String);

/// The activity selection key, built from one row.
#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum ActivityKey {
    /// A row that carries a run id, so the key follows the run as it moves.
    Run {
        /// The bot's identity.
        identity: String,
        /// The bot's id.
        bot_id: String,
        /// The run's id.
        run_id: String,
    },
    /// A row with no run id, keyed by its group and its own timestamp.
    Slot {
        /// The bot's identity.
        identity: String,
        /// The bot's id.
        bot_id: String,
        /// The group the row sits in.
        group: String,
        /// The row's own timestamp.
        at: String,
    },
}

/// The four tabs in Alt+1..4 order.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq, Hash)]
pub enum Tab {
    /// The activity tab, the one the screen opens on.
    #[default]
    Activity,
    /// The inbox tab.
    Inbox,
    /// The routines tab.
    Routines,
    /// The chat tab, which holds no state and has no surface.
    Chat,
}

/// One per read verb, the unit a fetch and its generation belong to.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Surface {
    /// The `status --json` read.
    Status,
    /// The `activity --json` read.
    Activity,
    /// The `inbox --json` read.
    Inbox,
    /// The `routines --json` read.
    Routines,
}

/// The five states a data pane draws, derived and never stored.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PaneState {
    /// No read has landed and none has failed.
    Loading,
    /// No read has landed and one has failed.
    Error,
    /// A read landed and a later one failed.
    Stale,
    /// A read landed and the payload holds no row.
    Empty,
    /// A read landed and the payload holds at least one row.
    Rows,
}

/// The payload of one surface, with the bookkeeping a pane needs.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Remote<T> {
    /// The payload of the last successful read.
    pub rows: T,
    /// The state clock when the last successful read landed.
    pub last_ok_at: Option<EpochMs>,
    /// The composed failure line of the last failed read.
    pub error: Option<String>,
    /// A fetch for this surface is out and its reply has not landed.
    pub in_flight: bool,
    /// The generation of the newest fetch issued for this surface.
    pub generation: u64,
}

/// A terminal size in cells.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct Size {
    /// The terminal's columns.
    pub cols: u16,
    /// The terminal's rows.
    pub rows: u16,
}

/// One pane's selection and scroll.
#[derive(Clone, Debug, PartialEq)]
pub struct PaneView<K> {
    /// The selected row's key, absent only while the list is empty.
    pub selected: Option<K>,
    /// The selected row's index after the last move or reconcile.
    pub anchor: usize,
    /// The first visible display line of the list.
    pub scroll: usize,
}

impl<K> Default for PaneView<K> {
    fn default() -> Self {
        PaneView {
            selected: None,
            anchor: 0,
            scroll: 0,
        }
    }
}

/// The decision or choice overlay, when one is open.
#[derive(Clone, Debug, PartialEq)]
pub struct Overlay {
    /// The item id captured on open, the only id an answer from here carries.
    pub item_id: ItemId,
    /// The options captured on open, empty for the decision shape.
    pub options: Vec<String>,
    /// The item as it stood on open.
    pub item: InboxItem,
    /// Where the overlay is in the answer flow.
    pub phase: Phase,
    /// The typed line, kept through a refusal so a retry does not retype it.
    pub buffer: String,
}

/// Where the overlay is in the answer flow.
#[derive(Clone, Debug, PartialEq)]
pub enum Phase {
    /// The overlay is open and its shortcuts are live.
    Idle,
    /// Every printable key is text.
    Typing,
    /// An answer is out and every answer key is a no-op.
    Sending,
    /// The refusal's first stderr line, and the answer keys are live again.
    Refused(String),
    /// The item is gone and every answer key is disabled.
    Gone,
}

/// The command palette's filter, selection and scroll.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct Palette {
    /// The typed filter, matched against each entry's label.
    pub filter: String,
    /// The index into the filtered entries.
    pub selected: usize,
    /// The first visible entry.
    pub scroll: usize,
}

/// Everything the reducer reads and the view draws.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct State {
    /// The time the last tick carried, the only clock the reducer reads.
    pub now: EpochMs,
    /// The first tick at or after this time issues a refresh.
    pub next_poll_at: EpochMs,
    /// The terminal's columns and rows from the last resize.
    pub size: Size,
    /// The tab the body draws.
    pub active_tab: Tab,
    /// The `status --json` payload, read by the header.
    pub status: Remote<StatusPayload>,
    /// The `activity --json` payload, read by the activity pane.
    pub activity: Remote<Vec<ActivityGroup>>,
    /// The `inbox --json` payload, read by the inbox pane and the overlay.
    pub inbox: Remote<Vec<InboxItem>>,
    /// The `routines --json` payload, read by the routines pane.
    pub routines: Remote<Vec<Routine>>,
    /// The activity selection and scroll.
    pub activity_view: PaneView<ActivityKey>,
    /// The inbox selection and scroll.
    pub inbox_view: PaneView<ItemId>,
    /// The routines selection and scroll.
    pub routines_view: PaneView<BotId>,
    /// The decision or choice overlay, when open.
    pub overlay: Option<Overlay>,
    /// The command palette, when open.
    pub palette: Option<Palette>,
    /// What the status row draws, the newest failure or warning.
    pub last_error: Option<StatusLine>,
    /// Items with an answer out and no reply back yet.
    pub pending_answers: Vec<ItemId>,
    /// Outcome words drawn on answered rows until a later inbox read.
    pub answered: Vec<AnsweredRow>,
}

/// One status row message and the call it came from.
#[derive(Clone, Debug, PartialEq)]
pub struct StatusLine {
    /// Which call wrote the line.
    pub source: Source,
    /// The line itself.
    pub text: String,
}

/// Which call wrote a status line.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Source {
    /// A read of one surface.
    Read(Surface),
    /// The one write.
    Answer,
    /// The loop's own message.
    Shell,
}

/// The word drawn on an answered row.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Outcome {
    /// The answer approved the item.
    Approved,
    /// The answer denied the item.
    Denied,
    /// The answer carried a typed line.
    Answered,
}

/// One mark on an answered row, and the inbox generation it was set at.
#[derive(Clone, Debug, PartialEq)]
pub struct AnsweredRow {
    /// The answered item.
    pub id: ItemId,
    /// The word the row draws.
    pub outcome: Outcome,
    /// The inbox generation when the mark was set.
    pub inbox_generation: u64,
}

/// One message the loop reduces.
#[derive(Clone, Debug, PartialEq)]
pub enum Msg {
    /// One key press, mapped from crossterm.
    Key(Key),
    /// One bracketed paste, the whole pasted text.
    Paste(String),
    /// The terminal's size.
    Resize {
        /// The terminal's columns.
        cols: u16,
        /// The terminal's rows.
        rows: u16,
    },
    /// The time.
    Tick {
        /// Milliseconds since the Unix epoch.
        now: EpochMs,
    },
    /// Stdin closed or the terminal went away.
    InputClosed,
    /// A termination signal seen by the handler flag.
    Terminate {
        /// The signal number.
        signal: i32,
    },
    /// One read's reply.
    Fetched {
        /// The surface that was read.
        surface: Surface,
        /// The generation the read was issued at.
        generation: u64,
        /// The payload or the composed failure.
        outcome: Result<Read, ReadError>,
    },
    /// The write's reply.
    Answered {
        /// The answered item.
        id: ItemId,
        /// The text the answer carried.
        text: String,
        /// The scope the answer carried.
        scope: Scope,
        /// The reply or the composed failure.
        outcome: Result<AnswerOk, AnswerError>,
    },
    /// The input or worker thread died.
    ThreadLost {
        /// The thread's name.
        thread: &'static str,
    },
}

/// A read that exited 0, with its first stderr line when it wrote one.
#[derive(Clone, Debug, PartialEq)]
pub struct Read {
    /// The parsed payload.
    pub payload: Payload,
    /// The first stderr line, when the read wrote one.
    pub warning: Option<String>,
}

/// The payload one read verb prints.
#[derive(Clone, Debug, PartialEq)]
pub enum Payload {
    /// The `status --json` payload.
    Status(StatusPayload),
    /// The `activity --json` payload.
    Activity(Vec<ActivityGroup>),
    /// The `inbox --json` payload.
    Inbox(Vec<InboxItem>),
    /// The `routines --json` payload.
    Routines(Vec<Routine>),
}

/// A write that exited 0.
#[derive(Clone, Debug, PartialEq)]
pub struct AnswerOk {
    /// The first stderr line, when the write wrote one.
    pub warning: Option<String>,
}

/// A read that did not produce a payload.
#[derive(Clone, Debug, PartialEq)]
pub struct ReadError {
    /// Why the call failed.
    pub kind: FailKind,
    /// The composed failure line.
    pub line: String,
}

/// A write that did not land.
#[derive(Clone, Debug, PartialEq)]
pub struct AnswerError {
    /// Why the call failed.
    pub kind: FailKind,
    /// The refusal name, when stderr named one.
    pub refusal: Option<String>,
    /// The composed failure line.
    pub line: String,
}

/// Why a call failed.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FailKind {
    /// The call ran and exited with this code.
    Exit(i32),
    /// The call could not be started.
    Spawn,
    /// The call ran past its timeout.
    Timeout,
    /// The call exited 0 and its output did not parse.
    Parse,
}

/// One thing the loop asks the worker to do.
#[derive(Clone, Debug, PartialEq)]
pub enum Effect {
    /// One read of one surface.
    Fetch {
        /// The surface to read.
        surface: Surface,
        /// The generation the read is issued at.
        generation: u64,
    },
    /// The one write.
    Answer {
        /// The answered item.
        id: ItemId,
        /// The text the answer carries.
        text: String,
        /// The scope the answer carries.
        scope: Scope,
    },
    /// Leave the loop with this exit code.
    Quit {
        /// The exit code.
        code: i32,
    },
}

/// The two scopes the screen writes.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Scope {
    /// `--scope once`.
    Once,
    /// `--scope deny`.
    Deny,
}

/// How many rows a payload holds, so a pane state can tell empty from full.
pub trait RowCount {
    /// The number of rows the payload holds.
    fn row_count(&self) -> usize;
}

impl<T> RowCount for Vec<T> {
    fn row_count(&self) -> usize {
        self.len()
    }
}

impl RowCount for StatusPayload {
    fn row_count(&self) -> usize {
        self.rows.len()
    }
}

impl<T: RowCount> Remote<T> {
    /// Derives the pane state from the last read, the last failure and the rows.
    pub fn pane_state(&self) -> PaneState {
        match (self.last_ok_at, self.error.is_some()) {
            (None, false) => PaneState::Loading,
            (None, true) => PaneState::Error,
            (Some(_), true) => PaneState::Stale,
            (Some(_), false) => {
                if self.rows.row_count() == 0 {
                    PaneState::Empty
                } else {
                    PaneState::Rows
                }
            }
        }
    }
}

impl Tab {
    /// The surface this tab draws, absent for the chat tab.
    pub fn surface(self) -> Option<Surface> {
        match self {
            Tab::Activity => Some(Surface::Activity),
            Tab::Inbox => Some(Surface::Inbox),
            Tab::Routines => Some(Surface::Routines),
            Tab::Chat => None,
        }
    }

    /// The tab one step to the right, wrapping.
    pub fn next(self) -> Tab {
        match self {
            Tab::Activity => Tab::Inbox,
            Tab::Inbox => Tab::Routines,
            Tab::Routines => Tab::Chat,
            Tab::Chat => Tab::Activity,
        }
    }

    /// The tab one step to the left, wrapping.
    pub fn prev(self) -> Tab {
        match self {
            Tab::Activity => Tab::Chat,
            Tab::Inbox => Tab::Activity,
            Tab::Routines => Tab::Inbox,
            Tab::Chat => Tab::Routines,
        }
    }
}

impl State {
    /// Whether the terminal is too small to draw the screen.
    pub fn too_small(&self) -> bool {
        self.size.cols < 24 || self.size.rows < 8
    }

    /// The rows left for the body once the bands are taken.
    pub fn body_rows(&self) -> usize {
        usize::from(self.size.rows).saturating_sub(7)
    }

    /// The list rows a pane can draw, at least one.
    pub fn page_rows(&self) -> usize {
        self.body_rows().saturating_sub(2).max(1)
    }

    /// Whether the terminal is wide enough for the detail column.
    pub fn wide(&self) -> bool {
        self.size.cols >= 120
    }
}

/// Reduces one message and returns the effects it asks for.
pub fn update(state: &mut State, msg: Msg) -> Vec<Effect> {
    match msg {
        Msg::Key(key) => on_key(state, key),
        // A paste is one message and never a key, so it cannot approve or open a row.
        Msg::Paste(_) => Vec::new(),
        Msg::Resize { cols, rows } => {
            on_resize(state, cols, rows);
            Vec::new()
        }
        Msg::Tick { now } => on_tick(state, now),
        Msg::InputClosed => vec![Effect::Quit { code: 0 }],
        Msg::Terminate { signal } => vec![Effect::Quit { code: 128 + signal }],
        Msg::Fetched {
            surface,
            generation,
            outcome,
        } => {
            on_fetched(state, surface, generation, outcome);
            Vec::new()
        }
        Msg::Answered {
            id,
            text,
            scope,
            outcome,
        } => {
            on_answered(state, id, text, scope, outcome);
            Vec::new()
        }
        Msg::ThreadLost { .. } => vec![Effect::Quit { code: 1 }],
    }
}

/// Sets the clock and refreshes when the poll is due.
pub fn on_tick(state: &mut State, now: EpochMs) -> Vec<Effect> {
    state.now = now;
    if now >= state.next_poll_at {
        refresh(state)
    } else {
        Vec::new()
    }
}

/// Issues a fetch for every surface that is due and not already in flight.
pub fn refresh(state: &mut State) -> Vec<Effect> {
    let mut effects = Vec::new();
    if let Some(effect) = issue_fetch(&mut state.inbox, Surface::Inbox) {
        effects.push(effect);
    }
    match state.active_tab {
        Tab::Activity => {
            if let Some(effect) = issue_fetch(&mut state.activity, Surface::Activity) {
                effects.push(effect);
            }
        }
        Tab::Routines => {
            if let Some(effect) = issue_fetch(&mut state.routines, Surface::Routines) {
                effects.push(effect);
            }
        }
        Tab::Inbox | Tab::Chat => {}
    }
    if let Some(effect) = issue_fetch(&mut state.status, Surface::Status) {
        effects.push(effect);
    }
    state.next_poll_at = state.now + 5000;
    effects
}

/// Stores the new terminal size and re-clamps the scroll.
pub fn on_resize(state: &mut State, cols: u16, rows: u16) {
    state.size = Size { cols, rows };
    clamp_scroll(state);
}

/// Stores one read's reply and reconciles the selection and the overlay.
pub fn on_fetched(
    state: &mut State,
    surface: Surface,
    generation: u64,
    outcome: Result<Read, ReadError>,
) {
    // A reply to a fetch that a newer fetch has replaced says nothing about the surface now.
    if generation_of(state, surface) != generation {
        return;
    }
    set_in_flight(state, surface, false);
    match outcome {
        Ok(read) => {
            // The rows as they stood, so an answered item a read no longer lists stays drawn.
            let previous = if surface == Surface::Inbox {
                std::mem::take(&mut state.inbox.rows)
            } else {
                Vec::new()
            };
            store_read(state, surface, read.payload);
            match read.warning {
                Some(text) => {
                    state.last_error = Some(StatusLine {
                        source: Source::Read(surface),
                        text,
                    });
                }
                None => {
                    if matches!(&state.last_error, Some(line) if line.source == Source::Read(surface))
                    {
                        state.last_error = None;
                    }
                }
            }
            if surface == Surface::Inbox {
                keep_answered_rows(state, generation, previous);
            }
        }
        Err(error) => {
            mark_read_failed(state, surface, error.line.clone());
            state.last_error = Some(StatusLine {
                source: Source::Read(surface),
                text: error.line,
            });
        }
    }
    reconcile_selection(state, surface);
    if surface == Surface::Inbox {
        reconcile_overlay(state);
    }
}

/// Stores one write's reply and marks the answered row.
pub fn on_answered(
    state: &mut State,
    id: ItemId,
    text: String,
    scope: Scope,
    outcome: Result<AnswerOk, AnswerError>,
) {
    state.pending_answers.retain(|pending| pending != &id);
    match &outcome {
        Ok(ok) => {
            match &ok.warning {
                Some(warning) => {
                    state.last_error = Some(StatusLine {
                        source: Source::Answer,
                        text: warning.clone(),
                    });
                }
                None => {
                    if matches!(&state.last_error, Some(line) if line.source == Source::Answer) {
                        state.last_error = None;
                    }
                }
            }
            let word = match scope {
                Scope::Deny => Outcome::Denied,
                Scope::Once if text == "approve" => Outcome::Approved,
                Scope::Once => Outcome::Answered,
            };
            state.answered.push(AnsweredRow {
                id: id.clone(),
                outcome: word,
                inbox_generation: state.inbox.generation,
            });
        }
        Err(error) => {
            state.last_error = Some(StatusLine {
                source: Source::Answer,
                text: error.line.clone(),
            });
        }
    }
    overlay_on_answered(state, &id, &outcome);
}

/// Turns one key press into the action it binds and applies it.
pub fn on_key(state: &mut State, key: Key) -> Vec<Effect> {
    match keys::resolve(&context_stack(state), &key, &cond(state)) {
        Some(action) => apply(state, action),
        None => Vec::new(),
    }
}

/// The context stack the key map resolves against.
pub fn context_stack(state: &State) -> Vec<Context> {
    if state.too_small() {
        return vec![Context::TooSmall];
    }
    if state.overlay.is_some() {
        return vec![Context::Overlay];
    }
    if state.palette.is_some() {
        return vec![Context::Palette];
    }
    match state.active_tab {
        Tab::Inbox => vec![Context::Inbox, Context::List],
        Tab::Activity | Tab::Routines => vec![Context::Main, Context::List],
        Tab::Chat => vec![Context::Main],
    }
}

/// The facts a row's conditions read.
pub fn cond(state: &State) -> Cond {
    let overlay = state.overlay.as_ref();
    Cond {
        inbox_tab: state.active_tab == Tab::Inbox,
        has_options: overlay.is_some_and(|open| !open.options.is_empty()),
        typing: overlay.is_some_and(|open| open.phase == Phase::Typing),
        gone: overlay.is_some_and(|open| open.phase == Phase::Gone),
        sending: overlay.is_some_and(|open| open.phase == Phase::Sending),
    }
}

/// Routes one action to the arm that owns it.
pub fn apply(state: &mut State, action: Action) -> Vec<Effect> {
    match action {
        Action::Quit => vec![Effect::Quit { code: 0 }],
        Action::SelectTab(_)
        | Action::PrevTab
        | Action::NextTab
        | Action::OpenPalette
        | Action::PaletteUp
        | Action::PaletteDown
        | Action::PaletteType(_)
        | Action::PaletteDelete
        | Action::PaletteRun => on_shell_action(state, action),
        Action::Close => {
            if state.palette.is_some() {
                on_shell_action(state, action)
            } else if state.overlay.is_some() {
                on_overlay_action(state, action)
            } else {
                Vec::new()
            }
        }
        Action::MoveUp | Action::MoveDown | Action::PageUp | Action::PageDown => {
            on_list_action(state, action)
        }
        Action::OpenItem
        | Action::EnterText
        | Action::Deny
        | Action::ApproveOnce
        | Action::Pick(_)
        | Action::TypeChar(_)
        | Action::DeleteChar
        | Action::SendText => on_overlay_action(state, action),
    }
}

/// The generation the newest fetch for this surface was issued at.
fn generation_of(state: &State, surface: Surface) -> u64 {
    match surface {
        Surface::Status => state.status.generation,
        Surface::Activity => state.activity.generation,
        Surface::Inbox => state.inbox.generation,
        Surface::Routines => state.routines.generation,
    }
}

/// Marks whether a fetch for this surface is still out.
fn set_in_flight(state: &mut State, surface: Surface, in_flight: bool) {
    match surface {
        Surface::Status => state.status.in_flight = in_flight,
        Surface::Activity => state.activity.in_flight = in_flight,
        Surface::Inbox => state.inbox.in_flight = in_flight,
        Surface::Routines => state.routines.in_flight = in_flight,
    }
}

/// Stores a successful read's payload when it belongs to this surface.
fn store_read(state: &mut State, surface: Surface, payload: Payload) {
    let now = state.now;
    match surface {
        Surface::Status => {
            if let Payload::Status(rows) = payload {
                state.status.rows = rows;
            }
            state.status.last_ok_at = Some(now);
            state.status.error = None;
        }
        Surface::Activity => {
            if let Payload::Activity(rows) = payload {
                state.activity.rows = rows;
            }
            state.activity.last_ok_at = Some(now);
            state.activity.error = None;
        }
        Surface::Inbox => {
            if let Payload::Inbox(rows) = payload {
                state.inbox.rows = rows;
            }
            state.inbox.last_ok_at = Some(now);
            state.inbox.error = None;
        }
        Surface::Routines => {
            if let Payload::Routines(rows) = payload {
                state.routines.rows = rows;
            }
            state.routines.last_ok_at = Some(now);
            state.routines.error = None;
        }
    }
}

/// Records one failed read's composed line on its surface.
fn mark_read_failed(state: &mut State, surface: Surface, line: String) {
    match surface {
        Surface::Status => state.status.error = Some(line),
        Surface::Activity => state.activity.error = Some(line),
        Surface::Inbox => state.inbox.error = Some(line),
        Surface::Routines => state.routines.error = Some(line),
    }
}

/// Issues one fetch for a surface that is not already in flight.
fn issue_fetch<T>(remote: &mut Remote<T>, surface: Surface) -> Option<Effect> {
    if remote.in_flight {
        return None;
    }
    remote.generation += 1;
    remote.in_flight = true;
    Some(Effect::Fetch {
        surface,
        generation: remote.generation,
    })
}

/// Keeps the answered marks a read issued after the answer can clear, and the rows they mark.
fn keep_answered_rows(state: &mut State, generation: u64, previous: Vec<InboxItem>) {
    state
        .answered
        .retain(|mark| mark.inbox_generation >= generation);
    let mut carried = Vec::new();
    for mark in &state.answered {
        if state.inbox.rows.iter().any(|item| item.id == mark.id) {
            continue;
        }
        if let Some(item) = previous.iter().find(|item| item.id == mark.id) {
            carried.push(item.clone());
        }
    }
    state.inbox.rows.extend(carried);
}

/// The shell's own actions: the tabs, the palette and the quit a palette entry can run.
pub fn on_shell_action(state: &mut State, action: Action) -> Vec<Effect> {
    match action {
        Action::SelectTab(tab) => {
            state.active_tab = tab;
            refresh(state)
        }
        Action::PrevTab => {
            state.active_tab = state.active_tab.prev();
            refresh(state)
        }
        Action::NextTab => {
            state.active_tab = state.active_tab.next();
            refresh(state)
        }
        Action::OpenPalette => {
            state.palette = Some(Palette::default());
            Vec::new()
        }
        Action::PaletteUp => {
            if let Some(palette) = state.palette.as_mut() {
                palette.selected = palette.selected.saturating_sub(1);
                if palette.selected < palette.scroll {
                    palette.scroll = palette.selected;
                }
            }
            Vec::new()
        }
        Action::PaletteDown => {
            if let Some(palette) = state.palette.as_mut() {
                let count = keys::palette_filtered(&palette.filter).len();
                if palette.selected + 1 < count {
                    palette.selected += 1;
                }
                if palette.selected >= palette.scroll + keys::PALETTE_LINES {
                    palette.scroll = palette.selected + 1 - keys::PALETTE_LINES;
                }
            }
            Vec::new()
        }
        Action::PaletteType(c) => {
            if let Some(palette) = state.palette.as_mut() {
                palette.filter.push(c);
                palette.selected = 0;
                palette.scroll = 0;
            }
            Vec::new()
        }
        Action::PaletteDelete => {
            if let Some(palette) = state.palette.as_mut() {
                palette.filter.pop();
                palette.selected = 0;
                palette.scroll = 0;
            }
            Vec::new()
        }
        Action::PaletteRun => {
            let Some(palette) = state.palette.take() else {
                return Vec::new();
            };
            let entries = keys::palette_filtered(&palette.filter);
            let Some(row) = entries.get(palette.selected) else {
                return Vec::new();
            };
            // The stack is read after the palette closes, so Enter runs the row bound where the palette was opened.
            let stack = context_stack(state);
            let facts = cond(state);
            match keys::palette_action(row.label, &stack, &facts) {
                Some(next) => apply(state, next),
                None => Vec::new(),
            }
        }
        Action::Close => {
            state.palette = None;
            Vec::new()
        }
        Action::Quit => vec![Effect::Quit { code: 0 }],
        _ => Vec::new(),
    }
}

/// The list's move actions on the active tab's pane view.
pub fn on_list_action(state: &mut State, action: Action) -> Vec<Effect> {
    let page = state.page_rows();
    match state.active_tab {
        Tab::Activity => {
            let keys = activity_keys(state);
            if keys.is_empty() {
                return Vec::new();
            }
            let position = keys
                .iter()
                .position(|key| state.activity_view.selected.as_ref() == Some(key));
            let current = match position {
                Some(index) => index,
                None => state.activity_view.anchor.min(keys.len() - 1),
            };
            let next = match action {
                Action::MoveUp => current.saturating_sub(1),
                Action::MoveDown => (current + 1).min(keys.len() - 1),
                Action::PageUp => current.saturating_sub(page),
                Action::PageDown => (current + page).min(keys.len() - 1),
                _ => current,
            };
            state.activity_view.selected = Some(keys[next].clone());
            state.activity_view.anchor = next;
        }
        Tab::Inbox => {
            let keys = inbox_keys(state);
            if keys.is_empty() {
                return Vec::new();
            }
            let position = keys
                .iter()
                .position(|key| state.inbox_view.selected.as_ref() == Some(key));
            let current = match position {
                Some(index) => index,
                None => state.inbox_view.anchor.min(keys.len() - 1),
            };
            let next = match action {
                Action::MoveUp => current.saturating_sub(1),
                Action::MoveDown => (current + 1).min(keys.len() - 1),
                Action::PageUp => current.saturating_sub(page),
                Action::PageDown => (current + page).min(keys.len() - 1),
                _ => current,
            };
            state.inbox_view.selected = Some(keys[next].clone());
            state.inbox_view.anchor = next;
        }
        Tab::Routines => {
            let keys = routine_keys(state);
            if keys.is_empty() {
                return Vec::new();
            }
            let position = keys
                .iter()
                .position(|key| state.routines_view.selected.as_ref() == Some(key));
            let current = match position {
                Some(index) => index,
                None => state.routines_view.anchor.min(keys.len() - 1),
            };
            let next = match action {
                Action::MoveUp => current.saturating_sub(1),
                Action::MoveDown => (current + 1).min(keys.len() - 1),
                Action::PageUp => current.saturating_sub(page),
                Action::PageDown => (current + page).min(keys.len() - 1),
                _ => current,
            };
            state.routines_view.selected = Some(keys[next].clone());
            state.routines_view.anchor = next;
        }
        Tab::Chat => return Vec::new(),
    }
    clamp_scroll(state);
    Vec::new()
}

/// Keeps the selection when it survives a read, else falls to the nearest row.
pub fn reconcile_selection(state: &mut State, surface: Surface) {
    match surface {
        Surface::Status => return,
        Surface::Activity => {
            let keys = activity_keys(state);
            if keys.is_empty() {
                state.activity_view.selected = None;
                state.activity_view.anchor = 0;
                state.activity_view.scroll = 0;
            } else {
                let position = keys
                    .iter()
                    .position(|key| state.activity_view.selected.as_ref() == Some(key));
                match position {
                    Some(index) => state.activity_view.anchor = index,
                    None => {
                        let index = state.activity_view.anchor.min(keys.len() - 1);
                        state.activity_view.selected = Some(keys[index].clone());
                        state.activity_view.anchor = index;
                    }
                }
            }
        }
        Surface::Inbox => {
            let keys = inbox_keys(state);
            if keys.is_empty() {
                state.inbox_view.selected = None;
                state.inbox_view.anchor = 0;
                state.inbox_view.scroll = 0;
            } else {
                let position = keys
                    .iter()
                    .position(|key| state.inbox_view.selected.as_ref() == Some(key));
                match position {
                    Some(index) => state.inbox_view.anchor = index,
                    None => {
                        let index = state.inbox_view.anchor.min(keys.len() - 1);
                        state.inbox_view.selected = Some(keys[index].clone());
                        state.inbox_view.anchor = index;
                    }
                }
            }
        }
        Surface::Routines => {
            let keys = routine_keys(state);
            if keys.is_empty() {
                state.routines_view.selected = None;
                state.routines_view.anchor = 0;
                state.routines_view.scroll = 0;
            } else {
                let position = keys
                    .iter()
                    .position(|key| state.routines_view.selected.as_ref() == Some(key));
                match position {
                    Some(index) => state.routines_view.anchor = index,
                    None => {
                        let index = state.routines_view.anchor.min(keys.len() - 1);
                        state.routines_view.selected = Some(keys[index].clone());
                        state.routines_view.anchor = index;
                    }
                }
            }
        }
    }
    clamp_scroll(state);
}

/// Moves each scroll so its selected row stays visible.
pub fn clamp_scroll(state: &mut State) {
    let page = state.page_rows();
    let keys = activity_keys(state);
    let position = keys
        .iter()
        .position(|key| state.activity_view.selected.as_ref() == Some(key));
    match position {
        None => state.activity_view.scroll = 0,
        Some(index) => {
            let line = activity_line(state, index);
            if line < state.activity_view.scroll {
                state.activity_view.scroll = line;
            } else if line >= state.activity_view.scroll + page {
                state.activity_view.scroll = line + 1 - page;
            }
        }
    }

    let keys = inbox_keys(state);
    let position = keys
        .iter()
        .position(|key| state.inbox_view.selected.as_ref() == Some(key));
    match position {
        None => state.inbox_view.scroll = 0,
        Some(index) => {
            let line = inbox_line(index);
            if line < state.inbox_view.scroll {
                state.inbox_view.scroll = line;
            } else if line >= state.inbox_view.scroll + page {
                state.inbox_view.scroll = line + 1 - page;
            }
        }
    }

    let keys = routine_keys(state);
    let position = keys
        .iter()
        .position(|key| state.routines_view.selected.as_ref() == Some(key));
    match position {
        None => state.routines_view.scroll = 0,
        Some(index) => {
            let line = routine_line(index);
            if line < state.routines_view.scroll {
                state.routines_view.scroll = line;
            } else if line >= state.routines_view.scroll + page {
                state.routines_view.scroll = line + 1 - page;
            }
        }
    }
}

/// The selection key of one activity row, so the selection follows a run as it moves between groups.
pub fn activity_key(group: &ActivityGroup, row: &ActivityRow) -> ActivityKey {
    match &row.run_id {
        Some(run_id) => ActivityKey::Run {
            identity: row.identity.clone(),
            bot_id: row.bot_id.clone(),
            run_id: run_id.clone(),
        },
        None => ActivityKey::Slot {
            identity: row.identity.clone(),
            bot_id: row.bot_id.clone(),
            group: group.id.clone(),
            at: row.at.clone(),
        },
    }
}

/// The selection keys of the activity pane, in the order the pane draws its rows.
fn activity_keys(state: &State) -> Vec<ActivityKey> {
    let mut keys = Vec::new();
    for group in state
        .activity
        .rows
        .iter()
        .filter(|group| !group.rows.is_empty())
    {
        for row in &group.rows {
            keys.push(activity_key(group, row));
        }
    }
    keys
}

/// The selection keys of the inbox pane, in the order the pane draws its rows.
fn inbox_keys(state: &State) -> Vec<ItemId> {
    state
        .inbox
        .rows
        .iter()
        .map(|item| item.id.clone())
        .collect()
}

/// The selection keys of the routines pane, in the order the pane draws its rows.
fn routine_keys(state: &State) -> Vec<BotId> {
    state
        .routines
        .rows
        .iter()
        .map(|routine| routine.bot_id.clone())
        .collect()
}

/// The first display line of one activity row, counting the heading line each kept group draws.
fn activity_line(state: &State, index: usize) -> usize {
    let mut line = 0;
    let mut seen = 0;
    for group in state
        .activity
        .rows
        .iter()
        .filter(|group| !group.rows.is_empty())
    {
        if index < seen + group.rows.len() {
            return line + 1 + (index - seen);
        }
        seen += group.rows.len();
        line += 1 + group.rows.len();
    }
    line
}

/// The first display line of one inbox row, one line per item.
fn inbox_line(index: usize) -> usize {
    index
}

/// The first display line of one routine, four lines per routine.
fn routine_line(index: usize) -> usize {
    4 * index
}

/// The overlay's own actions, the answer flow.
pub fn on_overlay_action(_state: &mut State, _action: Action) -> Vec<Effect> {
    Vec::new()
}

/// Moves an open overlay to gone when its item is no longer listed.
pub fn reconcile_overlay(_state: &mut State) {}

/// Moves a sending overlay on the reply it was waiting for.
pub fn overlay_on_answered(
    _state: &mut State,
    _id: &ItemId,
    _outcome: &Result<AnswerOk, AnswerError>,
) {
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::ActivityRow;

    fn item(id: &str) -> InboxItem {
        InboxItem {
            id: ItemId(id.to_string()),
            ..InboxItem::default()
        }
    }

    fn inbox_read(items: Vec<InboxItem>) -> Result<Read, ReadError> {
        Ok(Read {
            payload: Payload::Inbox(items),
            warning: None,
        })
    }

    fn overlay(phase: Phase) -> Overlay {
        Overlay {
            item_id: ItemId("x".to_string()),
            options: Vec::new(),
            item: item("x"),
            phase,
            buffer: String::new(),
        }
    }

    fn activity_row(identity: &str, run_id: &str) -> ActivityRow {
        ActivityRow {
            identity: identity.to_string(),
            bot_id: identity.to_string(),
            run_id: Some(run_id.to_string()),
            ..ActivityRow::default()
        }
    }

    #[test]
    fn esc_produces_no_answer_effect() {
        let mut state = State::default();
        let effects = update(&mut state, Msg::Key(Key::Esc));
        assert!(!effects
            .iter()
            .any(|effect| matches!(effect, Effect::Answer { .. })));

        let mut state = State {
            overlay: Some(overlay(Phase::Idle)),
            ..State::default()
        };
        let effects = apply(&mut state, Action::Close);
        assert!(!effects
            .iter()
            .any(|effect| matches!(effect, Effect::Answer { .. })));
    }

    #[test]
    fn selection_is_a_row_key_per_pane() {
        let mut state = State {
            inbox: Remote {
                generation: 1,
                ..Remote::default()
            },
            inbox_view: PaneView {
                selected: Some(ItemId("b".to_string())),
                ..PaneView::default()
            },
            ..State::default()
        };
        on_fetched(
            &mut state,
            Surface::Inbox,
            1,
            inbox_read(vec![item("c"), item("b"), item("a")]),
        );
        assert_eq!(state.inbox_view.selected, Some(ItemId("b".to_string())));

        let key = ActivityKey::Run {
            identity: "hello".to_string(),
            bot_id: "hello".to_string(),
            run_id: "run-1".to_string(),
        };
        let mut state = State {
            activity: Remote {
                generation: 1,
                ..Remote::default()
            },
            activity_view: PaneView {
                selected: Some(key.clone()),
                ..PaneView::default()
            },
            ..State::default()
        };
        on_fetched(
            &mut state,
            Surface::Activity,
            1,
            Ok(Read {
                payload: Payload::Activity(vec![ActivityGroup {
                    id: "needs-you".to_string(),
                    title: "Needs you".to_string(),
                    rows: vec![
                        activity_row("other", "run-2"),
                        activity_row("hello", "run-1"),
                    ],
                }]),
                warning: None,
            }),
        );
        assert_eq!(state.activity_view.selected, Some(key));

        let mut state = State {
            routines: Remote {
                generation: 1,
                ..Remote::default()
            },
            routines_view: PaneView {
                selected: Some(BotId("hello".to_string())),
                ..PaneView::default()
            },
            ..State::default()
        };
        on_fetched(
            &mut state,
            Surface::Routines,
            1,
            Ok(Read {
                payload: Payload::Routines(vec![
                    Routine {
                        bot_id: BotId("other".to_string()),
                        ..Routine::default()
                    },
                    Routine {
                        bot_id: BotId("hello".to_string()),
                        ..Routine::default()
                    },
                ]),
                warning: None,
            }),
        );
        assert_eq!(
            state.routines_view.selected,
            Some(BotId("hello".to_string()))
        );
    }

    #[test]
    fn stale_generation_is_dropped() {
        let mut state = State {
            inbox: Remote {
                generation: 2,
                in_flight: true,
                ..Remote::default()
            },
            ..State::default()
        };
        let before = state.inbox.clone();
        on_fetched(&mut state, Surface::Inbox, 1, inbox_read(vec![item("a")]));
        assert_eq!(state.inbox.rows, before.rows);
        assert!(state.inbox.in_flight);
        assert_eq!(state.inbox.last_ok_at, before.last_ok_at);

        on_fetched(&mut state, Surface::Inbox, 2, inbox_read(vec![item("a")]));
        assert_eq!(state.inbox.rows, vec![item("a")]);
        assert!(!state.inbox.in_flight);
    }

    #[test]
    fn answered_issues_no_fetch() {
        let mut state = State::default();
        let effects = update(
            &mut state,
            Msg::Answered {
                id: ItemId("x".to_string()),
                text: "approve".to_string(),
                scope: Scope::Once,
                outcome: Ok(AnswerOk { warning: None }),
            },
        );
        assert!(effects.is_empty());
        assert_eq!(state.answered.len(), 1);
        assert_eq!(state.answered[0].id, ItemId("x".to_string()));
        assert_eq!(state.answered[0].outcome, Outcome::Approved);

        let mut state = State::default();
        let effects = update(
            &mut state,
            Msg::Answered {
                id: ItemId("y".to_string()),
                text: "deny".to_string(),
                scope: Scope::Deny,
                outcome: Ok(AnswerOk { warning: None }),
            },
        );
        assert!(effects.is_empty());
        assert_eq!(state.answered.len(), 1);
        assert_eq!(state.answered[0].outcome, Outcome::Denied);
    }

    #[test]
    fn outcome_word_survives_an_older_read() {
        let mut state = State {
            inbox: Remote {
                rows: vec![item("x"), item("y")],
                generation: 1,
                in_flight: true,
                ..Remote::default()
            },
            ..State::default()
        };
        let generation = state.inbox.generation;
        on_answered(
            &mut state,
            ItemId("x".to_string()),
            "approve".to_string(),
            Scope::Once,
            Ok(AnswerOk { warning: None }),
        );
        assert_eq!(state.answered.len(), 1);
        assert_eq!(state.answered[0].inbox_generation, generation);

        on_fetched(
            &mut state,
            Surface::Inbox,
            generation,
            inbox_read(vec![item("y")]),
        );
        assert_eq!(state.answered.len(), 1);
        assert!(state
            .inbox
            .rows
            .iter()
            .any(|row| row.id == ItemId("x".to_string())));

        let effects = refresh(&mut state);
        assert!(effects.contains(&Effect::Fetch {
            surface: Surface::Inbox,
            generation: generation + 1,
        }));

        on_fetched(
            &mut state,
            Surface::Inbox,
            generation + 1,
            inbox_read(vec![item("y")]),
        );
        assert!(state.answered.is_empty());
        assert!(!state
            .inbox
            .rows
            .iter()
            .any(|row| row.id == ItemId("x".to_string())));
    }

    #[test]
    fn refresh_issues_at_most_three_fetches() {
        let mut state = State {
            active_tab: Tab::Activity,
            ..State::default()
        };
        let effects = update(&mut state, Msg::Tick { now: 0 });
        assert_eq!(
            effects,
            vec![
                Effect::Fetch {
                    surface: Surface::Inbox,
                    generation: 1,
                },
                Effect::Fetch {
                    surface: Surface::Activity,
                    generation: 1,
                },
                Effect::Fetch {
                    surface: Surface::Status,
                    generation: 1,
                },
            ]
        );
        assert_eq!(state.next_poll_at, 5000);

        let mut state = State {
            active_tab: Tab::Chat,
            ..State::default()
        };
        let effects = update(&mut state, Msg::Tick { now: 0 });
        assert_eq!(
            effects,
            vec![
                Effect::Fetch {
                    surface: Surface::Inbox,
                    generation: 1,
                },
                Effect::Fetch {
                    surface: Surface::Status,
                    generation: 1,
                },
            ]
        );
    }

    #[test]
    fn in_flight_surface_is_not_fetched_twice() {
        let mut state = State {
            active_tab: Tab::Activity,
            ..State::default()
        };
        let first = update(&mut state, Msg::Tick { now: 0 });
        assert_eq!(first.len(), 3);

        let second = update(&mut state, Msg::Tick { now: 5000 });
        assert!(second.is_empty());

        on_fetched(&mut state, Surface::Inbox, 1, inbox_read(vec![item("a")]));
        let third = update(&mut state, Msg::Tick { now: 10000 });
        assert_eq!(
            third,
            vec![Effect::Fetch {
                surface: Surface::Inbox,
                generation: 2,
            }]
        );
    }

    #[test]
    fn failed_fetch_keeps_rows() {
        let mut state = State {
            inbox: Remote {
                generation: 1,
                ..Remote::default()
            },
            ..State::default()
        };
        on_fetched(
            &mut state,
            Surface::Inbox,
            1,
            inbox_read(vec![item("a"), item("b")]),
        );
        state.inbox.generation = 2;
        let line = "bots: inbox --json exited 1: index locked".to_string();
        on_fetched(
            &mut state,
            Surface::Inbox,
            2,
            Err(ReadError {
                kind: FailKind::Exit(1),
                line: line.clone(),
            }),
        );
        assert_eq!(state.inbox.rows.len(), 2);
        assert_eq!(state.inbox.error, Some(line.clone()));
        assert_eq!(
            state.last_error,
            Some(StatusLine {
                source: Source::Read(Surface::Inbox),
                text: line,
            })
        );
        assert_eq!(state.inbox.pane_state(), PaneState::Stale);
    }

    #[test]
    fn clean_read_clears_only_its_own_line() {
        let mut state = State {
            status: Remote {
                generation: 1,
                ..Remote::default()
            },
            last_error: Some(StatusLine {
                source: Source::Answer,
                text: "bots: answer-not-approver".to_string(),
            }),
            ..State::default()
        };
        on_fetched(
            &mut state,
            Surface::Status,
            1,
            Ok(Read {
                payload: Payload::Status(StatusPayload::default()),
                warning: None,
            }),
        );
        assert_eq!(
            state.last_error,
            Some(StatusLine {
                source: Source::Answer,
                text: "bots: answer-not-approver".to_string(),
            })
        );

        state.status.generation = 2;
        state.last_error = Some(StatusLine {
            source: Source::Read(Surface::Status),
            text: "bots: status --json exited 1".to_string(),
        });
        on_fetched(
            &mut state,
            Surface::Status,
            2,
            Ok(Read {
                payload: Payload::Status(StatusPayload::default()),
                warning: None,
            }),
        );
        assert_eq!(state.last_error, None);
    }

    #[test]
    fn quit_arms_return_their_codes() {
        let mut state = State::default();
        assert_eq!(
            update(&mut state, Msg::InputClosed),
            vec![Effect::Quit { code: 0 }]
        );
        assert_eq!(
            update(&mut state, Msg::Terminate { signal: 15 }),
            vec![Effect::Quit { code: 143 }]
        );
        assert_eq!(
            update(&mut state, Msg::ThreadLost { thread: "input" }),
            vec![Effect::Quit { code: 1 }]
        );
    }

    #[test]
    fn paste_does_nothing() {
        let mut state = State::default();
        let before = state.clone();
        let effects = update(&mut state, Msg::Paste("y".to_string()));
        assert!(effects.is_empty());
        assert_eq!(state, before);
    }
}

#[cfg(test)]
mod on_shell_action {
    use super::*;

    /// A state at a size the shell draws, so keys resolve against the shell and not the too-small context.
    fn state_on(tab: Tab) -> State {
        State {
            size: Size { cols: 80, rows: 24 },
            active_tab: tab,
            ..State::default()
        }
    }

    /// Ctrl+P and the question mark open the palette, Esc and Ctrl+C close it, and Ctrl+C quits once it is closed.
    #[test]
    fn palette_opens_and_closes() {
        let mut state = state_on(Tab::Activity);
        update(&mut state, Msg::Key(Key::Ctrl('p')));
        assert!(state.palette.is_some());

        let effects = update(&mut state, Msg::Key(Key::Esc));
        assert!(state.palette.is_none());
        assert!(effects.is_empty());

        update(&mut state, Msg::Key(Key::Char('?')));
        assert!(state.palette.is_some());

        let effects = update(&mut state, Msg::Key(Key::Ctrl('c')));
        assert!(state.palette.is_none());
        assert!(!effects
            .iter()
            .any(|effect| matches!(effect, Effect::Quit { .. })));

        let effects = update(&mut state, Msg::Key(Key::Ctrl('c')));
        assert_eq!(effects, vec![Effect::Quit { code: 0 }]);
    }

    /// Alt plus a digit and the brackets switch the tab and refresh the surfaces the new tab draws.
    #[test]
    fn select_tab_switches_and_refreshes() {
        let mut state = state_on(Tab::Activity);
        let effects = update(&mut state, Msg::Key(Key::Alt('2')));
        assert_eq!(state.active_tab, Tab::Inbox);
        assert!(effects.contains(&Effect::Fetch {
            surface: Surface::Inbox,
            generation: 1,
        }));
        assert!(effects.contains(&Effect::Fetch {
            surface: Surface::Status,
            generation: 1,
        }));

        let mut state = state_on(Tab::Chat);
        update(&mut state, Msg::Key(Key::Char(']')));
        assert_eq!(state.active_tab, Tab::Activity);

        let mut state = state_on(Tab::Activity);
        update(&mut state, Msg::Key(Key::Char('[')));
        assert_eq!(state.active_tab, Tab::Chat);
    }

    /// Enter runs the row bound where the palette was opened, not the row the same label names elsewhere.
    #[test]
    fn palette_run_takes_the_row_bound_where_it_opened() {
        let mut state = state_on(Tab::Inbox);
        update(&mut state, Msg::Key(Key::Ctrl('p')));
        for c in ['t', 'a', 'b', 's'] {
            update(&mut state, Msg::Key(Key::Char(c)));
        }
        update(&mut state, Msg::Key(Key::Enter));
        assert!(state.palette.is_none());
        assert_eq!(state.active_tab, Tab::Activity);

        let mut state = state_on(Tab::Activity);
        update(&mut state, Msg::Key(Key::Ctrl('p')));
        for c in ['e', 'x'] {
            update(&mut state, Msg::Key(Key::Char(c)));
        }
        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(effects, vec![Effect::Quit { code: 0 }]);
    }

    /// The palette selection stops at the last entry and the scroll keeps it inside the drawn window.
    #[test]
    fn palette_selection_stays_in_view() {
        let mut state = state_on(Tab::Activity);
        update(&mut state, Msg::Key(Key::Ctrl('p')));
        for _ in 0..10 {
            update(&mut state, Msg::Key(Key::Down));
        }
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.selected, keys::palette_filtered("").len() - 1);
        assert!(palette.selected >= palette.scroll);
        assert!(palette.selected < palette.scroll + keys::PALETTE_LINES);

        for _ in 0..10 {
            update(&mut state, Msg::Key(Key::Up));
        }
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.selected, 0);
        assert_eq!(palette.scroll, 0);
    }
}
