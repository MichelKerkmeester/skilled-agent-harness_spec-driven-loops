use crate::keys::{self, Action, Cond, Context, Key};
use crate::model::{
    ActivityGroup, ActivityRow, InboxItem, ItemState, Role, Routine, StatusPayload, Transcript,
};
use unicode_width::{UnicodeWidthChar, UnicodeWidthStr};

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
    /// The chat tab, which reads the chosen bot's conversation.
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
    /// The `chat --transcript --json` read of the chosen bot's conversation.
    Chat,
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

/// The chat pane's own state, kept across tab switches.
#[derive(Clone, Debug, Default, PartialEq)]
pub struct ChatView {
    /// The chosen bot, which is also the conversation id.
    pub bot: Option<BotId>,
    /// Where the pane is.
    pub mode: ChatMode,
    /// The line being written, kept across Esc and tab switches.
    pub draft: String,
    /// The draft kept aside while a sent line is recalled, put back after the newest.
    pub saved_draft: String,
    /// The lines sent from this pane in this session, newest last.
    pub history: Vec<String>,
    /// The recalled line, absent while the draft is being edited.
    pub history_index: Option<usize>,
    /// How many display lines the transcript window sits above its bottom, 0 at the bottom.
    pub scroll_from_bottom: usize,
    /// The text of the send in flight, absent when none is out.
    pub sending: Option<String>,
    /// The picker's selected row.
    pub picker_selected: usize,
}

/// Where the chat pane is: the main context, or one of the chat context's two modes.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum ChatMode {
    /// The main context, with the transcript in view and no text entry.
    #[default]
    Main,
    /// Every printable key is text for the draft.
    Typing,
    /// The bot picker is open.
    Picking,
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
    /// The chosen bot's conversation, read by the chat pane.
    pub chat: Remote<Transcript>,
    /// The chat pane's bot, mode, draft, history, scroll, send in flight and picker row.
    pub chat_view: ChatView,
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
    /// The checkout passed as `--repo`, which names this screen's own identity.
    pub checkout: Option<String>,
    /// The identity of the status bot row whose path is the checkout, once a status read names one.
    pub own_identity: Option<String>,
    /// The needs-you items the last status read lists under another identity.
    pub foreign_items: Vec<ItemId>,
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
    /// The chat pane's send.
    ChatSend,
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
    /// The chat send's reply.
    ChatSent {
        /// The bot the send was addressed to.
        bot: BotId,
        /// The text the send carried.
        text: String,
        /// The exit the send ended with, or the reason nothing was appended.
        outcome: Result<ChatOk, ChatError>,
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
    /// The `chat --transcript --json` payload.
    Chat(Transcript),
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

/// A chat send that exited 0, 1 or 5, so a message was appended and the transcript is read again.
#[derive(Clone, Debug, PartialEq)]
pub struct ChatOk {
    /// The send's exit code.
    pub code: i32,
    /// The line the status row draws, when the send wrote one.
    pub warning: Option<String>,
}

/// A chat send that appended nothing: exit 2 or 4, or a child that did not start.
#[derive(Clone, Debug, PartialEq)]
pub struct ChatError {
    /// Why the send failed.
    pub kind: FailKind,
    /// The line the status row draws.
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
        /// The chosen bot, present only for the chat surface.
        bot: Option<BotId>,
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
    /// One chat send, run on the chat worker.
    ChatSend {
        /// The bot the send is addressed to.
        bot: BotId,
        /// The trimmed draft.
        text: String,
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

impl RowCount for Transcript {
    fn row_count(&self) -> usize {
        self.messages.len()
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
    /// The surface this tab draws.
    pub fn surface(self) -> Option<Surface> {
        match self {
            Tab::Activity => Some(Surface::Activity),
            Tab::Inbox => Some(Surface::Inbox),
            Tab::Routines => Some(Surface::Routines),
            Tab::Chat => Some(Surface::Chat),
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
        // A paste is one message and never a key, so it can only add text to a typed line.
        Msg::Paste(text) => {
            overlay_on_paste(state, &text);
            chat_on_paste(state, &text);
            Vec::new()
        }
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
            // The first status read names the bots, so the chat pane can choose one and read it.
            if surface == Surface::Status && chat_first_choice(state) {
                issue_fetch(&mut state.chat, Surface::Chat, state.chat_view.bot.clone())
                    .into_iter()
                    .collect()
            } else {
                Vec::new()
            }
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
        Msg::ChatSent { bot, text, outcome } => on_chat_sent(state, bot, text, outcome),
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
    if let Some(effect) = issue_fetch(&mut state.inbox, Surface::Inbox, None) {
        effects.push(effect);
    }
    match state.active_tab {
        Tab::Activity => {
            if let Some(effect) = issue_fetch(&mut state.activity, Surface::Activity, None) {
                effects.push(effect);
            }
        }
        Tab::Routines => {
            if let Some(effect) = issue_fetch(&mut state.routines, Surface::Routines, None) {
                effects.push(effect);
            }
        }
        Tab::Chat => {
            if let Some(bot) = state.chat_view.bot.clone() {
                if let Some(effect) = issue_fetch(&mut state.chat, Surface::Chat, Some(bot)) {
                    effects.push(effect);
                }
            }
        }
        Tab::Inbox => {}
    }
    if let Some(effect) = issue_fetch(&mut state.status, Surface::Status, None) {
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
    // A transcript read that lands while the window is scrolled keeps the window where it was, so
    // the lines the read added above it do not move it.
    let before =
        if surface == Surface::Chat && outcome.is_ok() && state.chat_view.scroll_from_bottom > 0 {
            Some(chat_lines(state, chat_width(state)).len())
        } else {
            None
        };
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
            // A status read is the only one that names the own identity, so it filters every pane.
            if surface == Surface::Status {
                learn_identity(state);
            }
            keep_own_rows(state);
        }
        Err(error) => {
            mark_read_failed(state, surface, error.line.clone());
            state.last_error = Some(StatusLine {
                source: Source::Read(surface),
                text: error.line,
            });
        }
    }
    if let Some(before) = before {
        let after = chat_lines(state, chat_width(state)).len();
        state.chat_view.scroll_from_bottom = (state.chat_view.scroll_from_bottom
            + after.saturating_sub(before))
        .min(chat_max_scroll(state));
    }
    reconcile_selection(state, surface);
    if surface == Surface::Inbox {
        reconcile_overlay(state);
    }
    // A status read can drop a row the selection or an open overlay still names, so both move now.
    if surface == Surface::Status {
        reconcile_selection(state, Surface::Activity);
        reconcile_selection(state, Surface::Inbox);
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
        Tab::Chat => match state.chat_view.mode {
            ChatMode::Main => vec![Context::Main],
            ChatMode::Typing | ChatMode::Picking => vec![Context::Chat],
        },
    }
}

/// The facts a row's conditions read.
pub fn cond(state: &State) -> Cond {
    let overlay = state.overlay.as_ref();
    // The chat pane's own modes count only while no overlay and no palette hold the keys.
    let chat = state.overlay.is_none() && state.palette.is_none() && state.active_tab == Tab::Chat;
    Cond {
        inbox_tab: state.active_tab == Tab::Inbox,
        has_options: overlay.is_some_and(|open| !open.options.is_empty()),
        typing: overlay.is_some_and(|open| open.phase == Phase::Typing)
            || (chat && state.chat_view.mode == ChatMode::Typing),
        gone: overlay.is_some_and(|open| open.phase == Phase::Gone),
        sending: overlay.is_some_and(|open| open.phase == Phase::Sending)
            || (chat && state.chat_view.sending.is_some()),
        chat_tab: state.active_tab == Tab::Chat,
        picking: chat && state.chat_view.mode == ChatMode::Picking,
    }
}

/// Routes one action to the arm that owns it.
pub fn apply(state: &mut State, action: Action) -> Vec<Effect> {
    let chat = state.active_tab == Tab::Chat && state.overlay.is_none() && state.palette.is_none();
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
            } else if chat {
                on_chat_action(state, action)
            } else {
                Vec::new()
            }
        }
        Action::MoveUp | Action::MoveDown | Action::PageUp | Action::PageDown => {
            if chat {
                on_chat_action(state, action)
            } else {
                on_list_action(state, action)
            }
        }
        Action::EnterText | Action::TypeChar(_) | Action::DeleteChar | Action::SendText => {
            if chat {
                on_chat_action(state, action)
            } else {
                on_overlay_action(state, action)
            }
        }
        Action::OpenItem | Action::Deny | Action::ApproveOnce | Action::Pick(_) => {
            on_overlay_action(state, action)
        }
        Action::ChatPick | Action::ChatChoose | Action::ChatHistoryUp | Action::ChatHistoryDown => {
            on_chat_action(state, action)
        }
    }
}

/// The generation the newest fetch for this surface was issued at.
fn generation_of(state: &State, surface: Surface) -> u64 {
    match surface {
        Surface::Status => state.status.generation,
        Surface::Activity => state.activity.generation,
        Surface::Inbox => state.inbox.generation,
        Surface::Routines => state.routines.generation,
        Surface::Chat => state.chat.generation,
    }
}

/// Marks whether a fetch for this surface is still out.
fn set_in_flight(state: &mut State, surface: Surface, in_flight: bool) {
    match surface {
        Surface::Status => state.status.in_flight = in_flight,
        Surface::Activity => state.activity.in_flight = in_flight,
        Surface::Inbox => state.inbox.in_flight = in_flight,
        Surface::Routines => state.routines.in_flight = in_flight,
        Surface::Chat => state.chat.in_flight = in_flight,
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
        Surface::Chat => {
            if let Payload::Chat(rows) = payload {
                state.chat.rows = rows;
            }
            state.chat.last_ok_at = Some(now);
            state.chat.error = None;
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
        Surface::Chat => state.chat.error = Some(line),
    }
}

/// Issues one fetch for a surface that is not already in flight.
fn issue_fetch<T>(remote: &mut Remote<T>, surface: Surface, bot: Option<BotId>) -> Option<Effect> {
    if remote.in_flight {
        return None;
    }
    remote.generation += 1;
    remote.in_flight = true;
    Some(Effect::Fetch {
        surface,
        bot,
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

/// A path with one trailing slash removed, so two spellings of one checkout compare equal.
fn trim_slash(path: &str) -> &str {
    path.strip_suffix('/').unwrap_or(path)
}

/// The identity of the status bot row whose path is the checkout, absent when no row names it.
pub fn own_identity(status: &StatusPayload, checkout: &str) -> Option<String> {
    let wanted = trim_slash(checkout);
    status
        .rows
        .iter()
        .filter(|row| row.kind == "bot" && !row.identity.is_empty())
        .find(|row| {
            row.path
                .as_deref()
                .is_some_and(|path| trim_slash(path) == wanted)
        })
        .map(|row| row.identity.clone())
}

/// Reads the own identity and the foreign items out of the status rows the last read stored.
fn learn_identity(state: &mut State) {
    let own = state
        .checkout
        .as_deref()
        .and_then(|checkout| own_identity(&state.status.rows, checkout));
    state.foreign_items = match &own {
        Some(own) => state
            .status
            .rows
            .rows
            .iter()
            .filter(|row| row.kind == "needs-you" && row.identity != *own)
            .filter_map(|row| row.item_id.clone().map(ItemId))
            .collect(),
        None => Vec::new(),
    };
    state.own_identity = own;
}

/// Drops every row the last status read places under another identity, so no pane names one.
fn keep_own_rows(state: &mut State) {
    let Some(own) = state.own_identity.as_deref() else {
        return;
    };
    state.status.rows.rows.retain(|row| row.identity == own);
    for group in &mut state.activity.rows {
        group.rows.retain(|row| row.identity == own);
    }
    state.activity.rows.retain(|group| !group.rows.is_empty());
    let foreign = &state.foreign_items;
    state.inbox.rows.retain(|item| !foreign.contains(&item.id));
}

/// The bots the picker lists: every bot row of the last status read, sorted and without repeats.
pub fn chat_bots(state: &State) -> Vec<BotId> {
    let mut bots: Vec<BotId> = state
        .status
        .rows
        .rows
        .iter()
        .filter(|row| row.kind == "bot" && !row.bot_id.is_empty())
        .map(|row| BotId(row.bot_id.clone()))
        .collect();
    bots.sort();
    bots.dedup();
    bots
}

/// Picks the pane's first bot when none is chosen: one listed bot is chosen, more open the picker.
fn chat_first_choice(state: &mut State) -> bool {
    if state.active_tab != Tab::Chat
        || state.chat_view.bot.is_some()
        || state.chat_view.mode != ChatMode::Main
    {
        return false;
    }
    let bots = chat_bots(state);
    match bots.len() {
        0 => false,
        1 => {
            state.chat_view.bot = bots.first().cloned();
            true
        }
        _ => {
            state.chat_view.mode = ChatMode::Picking;
            state.chat_view.picker_selected = 0;
            false
        }
    }
}

/// The shell's own actions: the tabs, the palette and the quit a palette entry can run.
pub fn on_shell_action(state: &mut State, action: Action) -> Vec<Effect> {
    match action {
        Action::SelectTab(tab) => {
            state.active_tab = tab;
            chat_first_choice(state);
            refresh(state)
        }
        Action::PrevTab => {
            state.active_tab = state.active_tab.prev();
            chat_first_choice(state);
            refresh(state)
        }
        Action::NextTab => {
            state.active_tab = state.active_tab.next();
            chat_first_choice(state);
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

/// The chat pane's own actions: the transcript window, the draft and its history, the send and the bot picker.
pub fn on_chat_action(state: &mut State, action: Action) -> Vec<Effect> {
    match state.chat_view.mode {
        ChatMode::Main => match action {
            Action::MoveUp => {
                state.chat_view.scroll_from_bottom =
                    (state.chat_view.scroll_from_bottom + 1).min(chat_max_scroll(state));
                Vec::new()
            }
            Action::MoveDown => {
                state.chat_view.scroll_from_bottom =
                    state.chat_view.scroll_from_bottom.saturating_sub(1);
                Vec::new()
            }
            Action::PageUp => {
                state.chat_view.scroll_from_bottom = (state.chat_view.scroll_from_bottom
                    + chat_window_rows(state))
                .min(chat_max_scroll(state));
                Vec::new()
            }
            Action::PageDown => {
                state.chat_view.scroll_from_bottom = state
                    .chat_view
                    .scroll_from_bottom
                    .saturating_sub(chat_window_rows(state));
                Vec::new()
            }
            Action::EnterText => {
                // The key table binds this key only once a bot is chosen, so no bot leaves nothing to type to.
                if state.chat_view.bot.is_some() {
                    state.chat_view.mode = ChatMode::Typing;
                    state.chat_view.history_index = None;
                }
                Vec::new()
            }
            Action::ChatPick => {
                let bots = chat_bots(state);
                state.chat_view.mode = ChatMode::Picking;
                state.chat_view.picker_selected = state
                    .chat_view
                    .bot
                    .as_ref()
                    .and_then(|bot| bots.iter().position(|listed| listed == bot))
                    .unwrap_or(0);
                Vec::new()
            }
            _ => Vec::new(),
        },
        ChatMode::Typing => match action {
            Action::TypeChar(c) => {
                state.chat_view.draft.push(c);
                state.chat_view.history_index = None;
                state.chat_view.saved_draft.clear();
                Vec::new()
            }
            Action::DeleteChar => {
                state.chat_view.draft.pop();
                state.chat_view.history_index = None;
                state.chat_view.saved_draft.clear();
                Vec::new()
            }
            Action::ChatHistoryUp => {
                let len = state.chat_view.history.len();
                if len == 0 {
                    return Vec::new();
                }
                let index = match state.chat_view.history_index {
                    Some(index) => index.saturating_sub(1),
                    None => {
                        // The draft is kept aside, so the newest line's Down puts it back.
                        state.chat_view.saved_draft = state.chat_view.draft.clone();
                        len - 1
                    }
                };
                state.chat_view.history_index = Some(index);
                state.chat_view.draft = state.chat_view.history[index].clone();
                Vec::new()
            }
            Action::ChatHistoryDown => {
                let Some(index) = state.chat_view.history_index else {
                    return Vec::new();
                };
                if index + 1 < state.chat_view.history.len() {
                    let next = index + 1;
                    state.chat_view.history_index = Some(next);
                    state.chat_view.draft = state.chat_view.history[next].clone();
                } else {
                    state.chat_view.history_index = None;
                    state.chat_view.draft = std::mem::take(&mut state.chat_view.saved_draft);
                }
                Vec::new()
            }
            Action::SendText => {
                let text = state.chat_view.draft.trim().to_string();
                let Some(bot) = state.chat_view.bot.clone() else {
                    return Vec::new();
                };
                if text.is_empty() || state.chat_view.sending.is_some() {
                    return Vec::new();
                }
                // A line equal to the newest one is not added twice, so a retry does not fill the history.
                if state.chat_view.history.last() != Some(&text) {
                    state.chat_view.history.push(text.clone());
                }
                state.chat_view.history_index = None;
                state.chat_view.saved_draft.clear();
                state.chat_view.draft.clear();
                state.chat_view.sending = Some(text.clone());
                vec![Effect::ChatSend { bot, text }]
            }
            Action::Close => {
                // The draft is kept, so a half-written message survives a look at another tab.
                state.chat_view.mode = ChatMode::Main;
                Vec::new()
            }
            _ => Vec::new(),
        },
        ChatMode::Picking => {
            let bots = chat_bots(state);
            match action {
                Action::MoveUp => {
                    state.chat_view.picker_selected =
                        state.chat_view.picker_selected.saturating_sub(1);
                    Vec::new()
                }
                Action::MoveDown => {
                    if state.chat_view.picker_selected + 1 < bots.len() {
                        state.chat_view.picker_selected += 1;
                    }
                    Vec::new()
                }
                Action::ChatChoose => {
                    let Some(bot) = bots.get(state.chat_view.picker_selected).cloned() else {
                        return Vec::new();
                    };
                    if state.chat_view.bot.as_ref() != Some(&bot) {
                        state.chat_view.bot = Some(bot);
                        // The generation is kept, so a reply for the bot left behind is dropped.
                        state.chat.rows = Transcript::default();
                        state.chat.last_ok_at = None;
                        state.chat.error = None;
                        state.chat.in_flight = false;
                        state.chat_view.scroll_from_bottom = 0;
                        if matches!(&state.last_error, Some(line) if line.source == Source::Read(Surface::Chat))
                        {
                            state.last_error = None;
                        }
                    }
                    state.chat_view.mode = ChatMode::Main;
                    issue_fetch(&mut state.chat, Surface::Chat, state.chat_view.bot.clone())
                        .into_iter()
                        .collect()
                }
                Action::Close => {
                    // The bot chosen before is kept, so Esc leaves the picker without changing the conversation.
                    state.chat_view.mode = ChatMode::Main;
                    Vec::new()
                }
                _ => Vec::new(),
            }
        }
    }
}

/// Keeps the selection when it survives a read, else falls to the nearest row.
pub fn reconcile_selection(state: &mut State, surface: Surface) {
    match surface {
        Surface::Status | Surface::Chat => return,
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
pub fn on_overlay_action(state: &mut State, action: Action) -> Vec<Effect> {
    match action {
        Action::OpenItem => {
            if state.overlay.is_some() {
                return Vec::new();
            }
            let Some(selected) = state.inbox_view.selected.clone() else {
                return Vec::new();
            };
            let Some(item) = state
                .inbox
                .rows
                .iter()
                .find(|item| item.id == selected)
                .cloned()
            else {
                return Vec::new();
            };
            // The captured id decides the phase, so a refresh that reorders rows cannot retarget the answer.
            let phase = if state.pending_answers.contains(&item.id) {
                Phase::Sending
            } else if item.state != ItemState::Open
                || state.answered.iter().any(|mark| mark.id == item.id)
            {
                Phase::Gone
            } else {
                Phase::Idle
            };
            state.overlay = Some(Overlay {
                item_id: item.id.clone(),
                options: item.options.clone(),
                item,
                phase,
                buffer: String::new(),
            });
            Vec::new()
        }
        Action::Close => {
            // The answer in flight still lands, so the pending list is left alone.
            state.overlay = None;
            Vec::new()
        }
        _ => {
            let Some(mut overlay) = state.overlay.take() else {
                return Vec::new();
            };
            let id = overlay.item_id.clone();
            let answerable = matches!(overlay.phase, Phase::Idle | Phase::Refused(_))
                && !state.pending_answers.contains(&id);
            let mut answer: Option<(String, Scope)> = None;
            match action {
                Action::Deny if answerable => answer = Some(("deny".to_string(), Scope::Deny)),
                Action::ApproveOnce if answerable && overlay.options.is_empty() => {
                    answer = Some(("approve".to_string(), Scope::Once));
                }
                Action::Pick(k) if answerable && !overlay.options.is_empty() => {
                    let picked = usize::from(k)
                        .checked_sub(1)
                        .and_then(|index| overlay.options.get(index))
                        .cloned();
                    if let Some(text) = picked {
                        answer = Some((text, Scope::Once));
                    }
                }
                Action::EnterText
                    if matches!(overlay.phase, Phase::Idle | Phase::Refused(_))
                        && overlay.options.is_empty() =>
                {
                    // The buffer is kept, so a refused line comes back to be edited.
                    overlay.phase = Phase::Typing;
                }
                Action::TypeChar(c) if overlay.phase == Phase::Typing => overlay.buffer.push(c),
                Action::DeleteChar if overlay.phase == Phase::Typing => {
                    overlay.buffer.pop();
                }
                Action::SendText if overlay.phase == Phase::Typing => {
                    if !overlay.buffer.trim().is_empty() && !state.pending_answers.contains(&id) {
                        answer = Some((overlay.buffer.clone(), Scope::Once));
                    }
                }
                _ => {}
            }
            let effects = match answer {
                Some((text, scope)) => {
                    overlay.phase = Phase::Sending;
                    state.pending_answers.push(id.clone());
                    vec![Effect::Answer { id, text, scope }]
                }
                None => Vec::new(),
            };
            state.overlay = Some(overlay);
            effects
        }
    }
}

/// Moves an open overlay to gone when its item is no longer listed.
pub fn reconcile_overlay(state: &mut State) {
    let Some(mut overlay) = state.overlay.take() else {
        return;
    };
    if matches!(
        overlay.phase,
        Phase::Idle | Phase::Typing | Phase::Refused(_)
    ) {
        let listed = state
            .inbox
            .rows
            .iter()
            .any(|item| item.id == overlay.item_id && item.state == ItemState::Open);
        if !listed {
            // The item is kept as it stood, because the gone panel draws it.
            overlay.phase = Phase::Gone;
        }
    }
    state.overlay = Some(overlay);
}

/// Moves a sending overlay on the reply it was waiting for.
pub fn overlay_on_answered(
    state: &mut State,
    id: &ItemId,
    outcome: &Result<AnswerOk, AnswerError>,
) {
    let Some(mut overlay) = state.overlay.take() else {
        return;
    };
    if &overlay.item_id != id || overlay.phase != Phase::Sending {
        state.overlay = Some(overlay);
        return;
    }
    match outcome {
        Ok(_) => {
            // A landed answer closes the overlay, so the row draws the outcome word instead.
            return;
        }
        Err(error) => {
            let gone_class = matches!(
                error.refusal.as_deref(),
                Some("item-unknown") | Some("item-expired") | Some("item-answered-differently")
            );
            if gone_class {
                overlay.phase = Phase::Gone;
            } else {
                let listed = state
                    .inbox
                    .rows
                    .iter()
                    .any(|item| item.id == overlay.item_id && item.state == ItemState::Open);
                overlay.phase = if listed {
                    Phase::Refused(error.line.clone())
                } else {
                    Phase::Gone
                };
            }
        }
    }
    state.overlay = Some(overlay);
}

/// Appends a pasted text to the typed line, and does nothing anywhere else.
fn overlay_on_paste(state: &mut State, text: &str) {
    let Some(overlay) = state.overlay.as_mut() else {
        return;
    };
    if overlay.phase != Phase::Typing {
        return;
    }
    for c in text.chars() {
        overlay.buffer.push(match c {
            '\r' | '\n' => ' ',
            other => other,
        });
    }
}

/// Ends the send in flight: a send that appended re-reads the transcript, a refused one puts its draft back.
pub fn on_chat_sent(
    state: &mut State,
    bot: BotId,
    text: String,
    outcome: Result<ChatOk, ChatError>,
) -> Vec<Effect> {
    state.chat_view.sending = None;
    match outcome {
        Ok(ok) => {
            match ok.warning {
                Some(warning) => {
                    state.last_error = Some(StatusLine {
                        source: Source::ChatSend,
                        text: warning,
                    });
                }
                None => {
                    if matches!(&state.last_error, Some(line) if line.source == Source::ChatSend) {
                        state.last_error = None;
                    }
                }
            }
            if state.chat_view.bot.as_ref() == Some(&bot) {
                issue_fetch(&mut state.chat, Surface::Chat, Some(bot))
                    .into_iter()
                    .collect()
            } else {
                Vec::new()
            }
        }
        Err(error) => {
            // Nothing was appended, so the text goes back to be edited and sent again.
            if state.chat_view.draft.trim().is_empty() {
                state.chat_view.draft = text;
            } else {
                state.chat_view.draft = format!("{text} {}", state.chat_view.draft);
            }
            state.chat_view.history_index = None;
            state.last_error = Some(StatusLine {
                source: Source::ChatSend,
                text: error.line,
            });
            Vec::new()
        }
    }
}

/// Appends a pasted text to the chat draft while typing, each line break as one space, and never sends.
fn chat_on_paste(state: &mut State, text: &str) {
    if state.active_tab != Tab::Chat || state.overlay.is_some() || state.palette.is_some() {
        return;
    }
    if state.chat_view.mode != ChatMode::Typing {
        return;
    }
    for c in text.chars() {
        state.chat_view.draft.push(match c {
            '\r' | '\n' => ' ',
            other => other,
        });
    }
    state.chat_view.history_index = None;
}

/// One display line of the chat transcript, before the view styles it.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ChatLine {
    /// The marker for the messages above the window, holding how many there are.
    Earlier(usize),
    /// The label line of the message at this index of the transcript.
    Label(usize),
    /// One line of a message's text, already indented four columns.
    Text(String),
    /// The line under the newest human message while its send is in flight.
    Working,
    /// The note a stale transcript draws under its messages.
    StaleNote,
    /// An empty line.
    Blank,
}

/// The columns the transcript and the composer draw in: the list column when the detail column is drawn.
pub fn chat_width(state: &State) -> usize {
    if state.wide() {
        usize::from(state.size.cols).saturating_sub(48)
    } else {
        usize::from(state.size.cols)
    }
}

/// The transcript window's rows: the body less its title, the two blank rows and the composer.
pub fn chat_window_rows(state: &State) -> usize {
    state.body_rows().saturating_sub(4).max(1)
}

/// A message's text as drawn lines: split on each line feed, made printable, wrapped and indented four columns.
pub fn chat_text_lines(text: &str, width: usize) -> Vec<String> {
    let budget = width.saturating_sub(4).max(1);
    let mut lines = Vec::new();
    for piece in text.split('\n') {
        let piece = piece.strip_suffix('\r').unwrap_or(piece);
        for line in wrap(&crate::theme::printable(piece), budget) {
            lines.push(format!("    {line}"));
        }
    }
    lines
}

/// Wraps one line at a display width, breaking at the last space that fits and never splitting a wide cell.
fn wrap(text: &str, width: usize) -> Vec<String> {
    let mut lines = Vec::new();
    let mut line = String::new();
    let mut used = 0;
    for c in text.chars() {
        let step = UnicodeWidthChar::width(c).unwrap_or(0);
        if used + step > width && !line.is_empty() {
            match line.rfind(' ') {
                Some(at) => {
                    // The space is dropped and the rest of the line carries over to the next one.
                    let rest = line[at + 1..].to_string();
                    line.truncate(at);
                    lines.push(std::mem::take(&mut line));
                    line = rest;
                    used = UnicodeWidthStr::width(line.as_str());
                }
                None => {
                    lines.push(std::mem::take(&mut line));
                    used = 0;
                }
            }
        }
        line.push(c);
        used += step;
    }
    lines.push(line);
    lines
}

/// Every display line of the transcript in file order, with the working line and the stale note after it.
pub fn chat_lines(state: &State, width: usize) -> Vec<ChatLine> {
    let mut lines = Vec::new();
    for (index, message) in state.chat.rows.messages.iter().enumerate() {
        if index > 0 {
            lines.push(ChatLine::Blank);
        }
        lines.push(ChatLine::Label(index));
        for line in chat_text_lines(&message.text, width) {
            lines.push(ChatLine::Text(line));
        }
    }
    if state.chat_view.sending.is_some() {
        if !lines.is_empty() {
            lines.push(ChatLine::Blank);
        }
        lines.push(ChatLine::Working);
    }
    if state.chat.pane_state() == PaneState::Stale {
        if !lines.is_empty() {
            lines.push(ChatLine::Blank);
        }
        lines.push(ChatLine::StaleNote);
    }
    lines
}

/// The lines the transcript window draws, top first, never more than its rows.
///
/// Scroll counts display lines up from the bottom. When the lines above the window's end do not
/// fit, whole messages are dropped from the top and the marker and a blank take their place, so
/// no message is drawn without its label.
pub fn chat_window(state: &State, width: usize, rows: usize) -> Vec<ChatLine> {
    let lines = chat_lines(state, width);
    let len = lines.len();
    let scroll = state
        .chat_view
        .scroll_from_bottom
        .min(len.saturating_sub(rows));
    let end = len - scroll;
    if end <= rows {
        return lines[..end].to_vec();
    }
    if rows < 3 {
        return lines[end - rows..end].to_vec();
    }
    let labels: Vec<usize> = lines[..end]
        .iter()
        .enumerate()
        .filter(|(_, line)| matches!(line, ChatLine::Label(_)))
        .map(|(index, _)| index)
        .collect();
    let dropped = |at: usize| labels.iter().filter(|label| **label < at).count();
    if let Some(at) = labels.iter().copied().find(|at| 2 + (end - at) <= rows) {
        let mut window = vec![ChatLine::Earlier(dropped(at)), ChatLine::Blank];
        window.extend(lines[at..end].iter().cloned());
        return window;
    }
    let Some(at) = labels.last().copied() else {
        return lines[end - rows..end].to_vec();
    };
    let mut window = vec![ChatLine::Earlier(dropped(at)), ChatLine::Blank];
    window.extend(lines[at..at + rows - 2].iter().cloned());
    window
}

/// The largest scroll the window takes: the display lines that do not fit above it.
pub fn chat_max_scroll(state: &State) -> usize {
    chat_lines(state, chat_width(state))
        .len()
        .saturating_sub(chat_window_rows(state))
}

/// Whether the message at this index is a human message with no bot message after it.
///
/// The newest human message is not unanswered while a send is in flight, because it draws the
/// working line instead.
pub fn chat_unanswered(state: &State, index: usize) -> bool {
    let messages = &state.chat.rows.messages;
    let Some(message) = messages.get(index) else {
        return false;
    };
    if message.role != Role::Human {
        return false;
    }
    if messages[index + 1..]
        .iter()
        .any(|later| later.role == Role::Bot)
    {
        return false;
    }
    if state.chat_view.sending.is_some() {
        let newest = messages.iter().rposition(|later| later.role == Role::Human);
        if newest == Some(index) {
            return false;
        }
    }
    true
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::model::ActivityRow;
    use crate::model::StatusRow;

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

    /// The status rows the identity filter reads: two bot rows and two needs-you rows.
    fn status_payload() -> StatusPayload {
        StatusPayload {
            rows: vec![
                StatusRow {
                    kind: "bot".to_string(),
                    identity: "own/hello".to_string(),
                    path: Some("/r/hello".to_string()),
                    ..StatusRow::default()
                },
                StatusRow {
                    kind: "bot".to_string(),
                    identity: "other/far".to_string(),
                    path: Some("/r/far".to_string()),
                    ..StatusRow::default()
                },
                StatusRow {
                    kind: "needs-you".to_string(),
                    identity: "own/hello".to_string(),
                    item_id: Some("O1".to_string()),
                    ..StatusRow::default()
                },
                StatusRow {
                    kind: "needs-you".to_string(),
                    identity: "other/far".to_string(),
                    item_id: Some("F1".to_string()),
                    ..StatusRow::default()
                },
            ],
            ..StatusPayload::default()
        }
    }

    /// The two open inbox items the identity filter reads, one under each identity.
    fn inbox_payload() -> Vec<InboxItem> {
        vec![
            InboxItem {
                id: ItemId("O1".to_string()),
                state: ItemState::Open,
                ..InboxItem::default()
            },
            InboxItem {
                id: ItemId("F1".to_string()),
                state: ItemState::Open,
                ..InboxItem::default()
            },
        ]
    }

    /// The two activity groups the identity filter reads, the second one foreign only.
    fn activity_payload() -> Vec<ActivityGroup> {
        vec![
            ActivityGroup {
                id: "needs_you".to_string(),
                title: "Needs you".to_string(),
                rows: vec![
                    activity_row("own/hello", "run-1"),
                    activity_row("other/far", "run-2"),
                ],
            },
            ActivityGroup {
                id: "done".to_string(),
                title: "Done".to_string(),
                rows: vec![activity_row("other/far", "run-3")],
            },
        ]
    }

    /// Delivers one read at the generation the test set on its surface, as a landed fetch does.
    fn deliver(state: &mut State, surface: Surface, generation: u64, payload: Payload) {
        update(
            state,
            Msg::Fetched {
                surface,
                generation,
                outcome: Ok(Read {
                    payload,
                    warning: None,
                }),
            },
        );
    }

    /// The phase the overlay is in, absent when it is closed.
    fn phase_of(state: &State) -> Option<Phase> {
        state.overlay.as_ref().map(|open| open.phase.clone())
    }

    /// Whether any effect carries an answer, the one write a foreign row must never reach.
    fn answers(effects: &[Effect]) -> bool {
        effects
            .iter()
            .any(|effect| matches!(effect, Effect::Answer { .. }))
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
            bot: None,
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
                    bot: None,
                    generation: 1,
                },
                Effect::Fetch {
                    surface: Surface::Activity,
                    bot: None,
                    generation: 1,
                },
                Effect::Fetch {
                    surface: Surface::Status,
                    bot: None,
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
                    bot: None,
                    generation: 1,
                },
                Effect::Fetch {
                    surface: Surface::Status,
                    bot: None,
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
                bot: None,
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

    /// A status read that names the own identity drops every foreign row before a pane draws it.
    #[test]
    fn foreign_identity_rows_reach_no_pane() {
        let mut state = State {
            checkout: Some("/r/hello".to_string()),
            ..State::default()
        };
        state.inbox.generation = 1;
        deliver(
            &mut state,
            Surface::Inbox,
            1,
            Payload::Inbox(inbox_payload()),
        );
        state.activity.generation = 1;
        deliver(
            &mut state,
            Surface::Activity,
            1,
            Payload::Activity(activity_payload()),
        );
        state.status.generation = 1;
        deliver(
            &mut state,
            Surface::Status,
            1,
            Payload::Status(status_payload()),
        );

        assert_eq!(state.own_identity, Some("own/hello".to_string()));
        assert_eq!(
            state
                .status
                .rows
                .rows
                .iter()
                .filter(|row| row.kind == "bot")
                .count(),
            1
        );
        assert!(!state
            .activity
            .rows
            .iter()
            .flat_map(|group| group.rows.iter())
            .any(|row| row.identity == "other/far"));
        assert!(!state.activity.rows.iter().any(|group| group.id == "done"));
        assert_eq!(state.inbox.rows.len(), 1);
        assert_eq!(state.inbox.rows[0].id, ItemId("O1".to_string()));
        assert_ne!(state.inbox_view.selected, Some(ItemId("F1".to_string())));

        state.activity.generation = 2;
        deliver(
            &mut state,
            Surface::Activity,
            2,
            Payload::Activity(activity_payload()),
        );
        assert!(!state
            .activity
            .rows
            .iter()
            .flat_map(|group| group.rows.iter())
            .any(|row| row.identity == "other/far"));
    }

    /// An overlay opened on a foreign item before the identity is known goes gone and answers nothing.
    #[test]
    fn foreign_item_cannot_be_answered() {
        let mut state = State {
            size: Size { cols: 80, rows: 24 },
            active_tab: Tab::Inbox,
            checkout: Some("/r/hello".to_string()),
            ..State::default()
        };
        state.inbox.generation = 1;
        deliver(
            &mut state,
            Surface::Inbox,
            1,
            Payload::Inbox(inbox_payload()),
        );
        state.inbox_view.selected = Some(ItemId("F1".to_string()));

        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert!(effects.is_empty());
        assert_eq!(phase_of(&state), Some(Phase::Idle));

        state.activity.generation = 1;
        deliver(
            &mut state,
            Surface::Activity,
            1,
            Payload::Activity(activity_payload()),
        );
        state.status.generation = 1;
        deliver(
            &mut state,
            Surface::Status,
            1,
            Payload::Status(status_payload()),
        );
        assert_eq!(phase_of(&state), Some(Phase::Gone));

        for key in [Key::Char('y'), Key::Char('n')] {
            let effects = update(&mut state, Msg::Key(key));
            assert!(!answers(&effects), "{key:?} answered a foreign item");
        }

        let effects = update(&mut state, Msg::Key(Key::Esc));
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());

        state.inbox_view.selected = Some(ItemId("F1".to_string()));
        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());
    }

    /// A checkout no status bot row names leaves the own identity unknown, so nothing is dropped.
    #[test]
    fn unknown_identity_keeps_every_row() {
        let mut state = State {
            checkout: Some("/elsewhere".to_string()),
            ..State::default()
        };
        state.inbox.generation = 1;
        deliver(
            &mut state,
            Surface::Inbox,
            1,
            Payload::Inbox(inbox_payload()),
        );
        state.activity.generation = 1;
        deliver(
            &mut state,
            Surface::Activity,
            1,
            Payload::Activity(activity_payload()),
        );
        state.status.generation = 1;
        deliver(
            &mut state,
            Surface::Status,
            1,
            Payload::Status(status_payload()),
        );

        assert_eq!(state.own_identity, None);
        assert_eq!(state.inbox.rows.len(), 2);
        assert_eq!(state.status.rows.rows.len(), 4);
        assert_eq!(state.activity.rows.len(), 2);
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
            bot: None,
            generation: 1,
        }));
        assert!(effects.contains(&Effect::Fetch {
            surface: Surface::Status,
            bot: None,
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

#[cfg(test)]
mod on_overlay_action {
    use super::*;

    /// A state at a size the screen draws, so keys resolve against the overlay and not the too-small context.
    fn state_on_inbox() -> State {
        State {
            size: Size { cols: 80, rows: 24 },
            active_tab: Tab::Inbox,
            ..State::default()
        }
    }

    /// One inbox item with the fields the answer flow reads.
    fn item(id: &str, state: ItemState, options: &[&str]) -> InboxItem {
        InboxItem {
            id: ItemId(id.to_string()),
            bot_id: "hello".to_string(),
            question: "Ship it?".to_string(),
            state,
            options: options.iter().map(|option| option.to_string()).collect(),
            ..InboxItem::default()
        }
    }

    /// A state on the inbox with one item listed and an overlay open on it.
    fn state_with(phase: Phase, rows: Vec<InboxItem>) -> State {
        let mut state = state_on_inbox();
        state.inbox.generation = 1;
        state.inbox.rows = rows;
        state.inbox_view.selected = Some(ItemId("i1".to_string()));
        if phase == Phase::Sending {
            state.pending_answers.push(ItemId("i1".to_string()));
        }
        state.overlay = Some(Overlay {
            item_id: ItemId("i1".to_string()),
            options: Vec::new(),
            item: item("i1", ItemState::Open, &[]),
            phase,
            buffer: String::new(),
        });
        state
    }

    /// One inbox read's reply at this generation.
    fn fetched(generation: u64, rows: Vec<InboxItem>) -> Msg {
        Msg::Fetched {
            surface: Surface::Inbox,
            generation,
            outcome: Ok(Read {
                payload: Payload::Inbox(rows),
                warning: None,
            }),
        }
    }

    /// One answer's reply for this item.
    fn answered(id: &str, outcome: Result<AnswerOk, AnswerError>) -> Msg {
        Msg::Answered {
            id: ItemId(id.to_string()),
            text: "approve".to_string(),
            scope: Scope::Once,
            outcome,
        }
    }

    /// The one effect an answer key returns for the overlay's item.
    fn answer(text: &str, scope: Scope) -> Vec<Effect> {
        vec![Effect::Answer {
            id: ItemId("i1".to_string()),
            text: text.to_string(),
            scope,
        }]
    }

    /// The phase the overlay is in, absent when it is closed.
    fn phase_of(state: &State) -> Option<Phase> {
        state.overlay.as_ref().map(|open| open.phase.clone())
    }

    /// The typed line the overlay holds, empty when it is closed.
    fn buffer_of(state: &State) -> &str {
        state
            .overlay
            .as_ref()
            .map(|open| open.buffer.as_str())
            .unwrap_or("")
    }

    /// The first press sends one answer and every later answer key is a no-op until the reply lands.
    #[test]
    fn overlay_locks_after_first_press() {
        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));

        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert!(effects.is_empty());
        assert_eq!(phase_of(&state), Some(Phase::Idle));

        let effects = update(&mut state, Msg::Key(Key::Char('y')));
        assert_eq!(effects, answer("approve", Scope::Once));
        assert_eq!(phase_of(&state), Some(Phase::Sending));
        assert_eq!(state.pending_answers, vec![ItemId("i1".to_string())]);

        for key in [
            Key::Char('y'),
            Key::Char('n'),
            Key::Char('t'),
            Key::Enter,
            Key::Char('1'),
            Key::Backspace,
        ] {
            let effects = update(&mut state, Msg::Key(key));
            assert!(effects.is_empty(), "{key:?} produced {effects:?}");
            assert_eq!(
                state.pending_answers,
                vec![ItemId("i1".to_string())],
                "{key:?} changed the pending list"
            );
        }
    }

    /// Every key the overlay binds, from each phase it can start in, with where it lands.
    #[test]
    fn overlay_transition_table() {
        type Case = (
            Phase,
            &'static [&'static str],
            &'static str,
            Key,
            Option<Phase>,
            &'static str,
            Vec<Effect>,
        );
        let refused = || Phase::Refused("bots: answer-not-approver".to_string());
        let cases: Vec<Case> = vec![
            // Idle, the decision shape.
            (
                Phase::Idle,
                &[],
                "",
                Key::Char('t'),
                Some(Phase::Typing),
                "",
                Vec::new(),
            ),
            (
                Phase::Idle,
                &[],
                "",
                Key::Char('n'),
                Some(Phase::Sending),
                "",
                answer("deny", Scope::Deny),
            ),
            (
                Phase::Idle,
                &[],
                "",
                Key::Char('y'),
                Some(Phase::Sending),
                "",
                answer("approve", Scope::Once),
            ),
            (
                Phase::Idle,
                &[],
                "",
                Key::Char('1'),
                Some(Phase::Idle),
                "",
                Vec::new(),
            ),
            (Phase::Idle, &[], "", Key::Esc, None, "", Vec::new()),
            (Phase::Idle, &[], "", Key::Ctrl('c'), None, "", Vec::new()),
            (
                Phase::Idle,
                &[],
                "",
                Key::Char('x'),
                Some(Phase::Idle),
                "",
                Vec::new(),
            ),
            (
                Phase::Idle,
                &[],
                "",
                Key::Ctrl('d'),
                Some(Phase::Idle),
                "",
                vec![Effect::Quit { code: 0 }],
            ),
            // Idle, the choice shape.
            (
                Phase::Idle,
                &["email", "chat"],
                "",
                Key::Char('2'),
                Some(Phase::Sending),
                "",
                answer("chat", Scope::Once),
            ),
            (
                Phase::Idle,
                &["email", "chat"],
                "",
                Key::Char('3'),
                Some(Phase::Idle),
                "",
                Vec::new(),
            ),
            (
                Phase::Idle,
                &["email", "chat"],
                "",
                Key::Char('y'),
                Some(Phase::Idle),
                "",
                Vec::new(),
            ),
            (
                Phase::Idle,
                &["email", "chat"],
                "",
                Key::Char('t'),
                Some(Phase::Idle),
                "",
                Vec::new(),
            ),
            // Typing.
            (
                Phase::Typing,
                &[],
                "hol",
                Key::Char('d'),
                Some(Phase::Typing),
                "hold",
                Vec::new(),
            ),
            (
                Phase::Typing,
                &[],
                "hol",
                Key::Char('y'),
                Some(Phase::Typing),
                "holy",
                Vec::new(),
            ),
            (
                Phase::Typing,
                &[],
                "hold",
                Key::Backspace,
                Some(Phase::Typing),
                "hol",
                Vec::new(),
            ),
            (
                Phase::Typing,
                &[],
                "hold",
                Key::Enter,
                Some(Phase::Sending),
                "hold",
                answer("hold", Scope::Once),
            ),
            (
                Phase::Typing,
                &[],
                "   ",
                Key::Enter,
                Some(Phase::Typing),
                "   ",
                Vec::new(),
            ),
            (Phase::Typing, &[], "", Key::Esc, None, "", Vec::new()),
            // Sending.
            (
                Phase::Sending,
                &[],
                "",
                Key::Char('y'),
                Some(Phase::Sending),
                "",
                Vec::new(),
            ),
            (
                Phase::Sending,
                &[],
                "",
                Key::Char('n'),
                Some(Phase::Sending),
                "",
                Vec::new(),
            ),
            (
                Phase::Sending,
                &[],
                "",
                Key::Char('t'),
                Some(Phase::Sending),
                "",
                Vec::new(),
            ),
            (
                Phase::Sending,
                &[],
                "",
                Key::Enter,
                Some(Phase::Sending),
                "",
                Vec::new(),
            ),
            (
                Phase::Sending,
                &[],
                "",
                Key::Char('1'),
                Some(Phase::Sending),
                "",
                Vec::new(),
            ),
            (Phase::Sending, &[], "", Key::Esc, None, "", Vec::new()),
            // Refused.
            (
                refused(),
                &[],
                "",
                Key::Char('y'),
                Some(Phase::Sending),
                "",
                answer("approve", Scope::Once),
            ),
            (
                refused(),
                &[],
                "",
                Key::Char('n'),
                Some(Phase::Sending),
                "",
                answer("deny", Scope::Deny),
            ),
            (
                refused(),
                &[],
                "hold",
                Key::Char('t'),
                Some(Phase::Typing),
                "hold",
                Vec::new(),
            ),
            (refused(), &[], "", Key::Esc, None, "", Vec::new()),
            // Gone.
            (
                Phase::Gone,
                &[],
                "",
                Key::Char('y'),
                Some(Phase::Gone),
                "",
                Vec::new(),
            ),
            (
                Phase::Gone,
                &[],
                "",
                Key::Char('n'),
                Some(Phase::Gone),
                "",
                Vec::new(),
            ),
            (
                Phase::Gone,
                &[],
                "",
                Key::Char('t'),
                Some(Phase::Gone),
                "",
                Vec::new(),
            ),
            (
                Phase::Gone,
                &[],
                "",
                Key::Enter,
                Some(Phase::Gone),
                "",
                Vec::new(),
            ),
            (
                Phase::Gone,
                &[],
                "",
                Key::Char('1'),
                Some(Phase::Gone),
                "",
                Vec::new(),
            ),
            (Phase::Gone, &[], "", Key::Esc, None, "", Vec::new()),
            (Phase::Gone, &[], "", Key::Ctrl('c'), None, "", Vec::new()),
        ];

        for (phase, options, buffer, key, expected_phase, expected_buffer, expected_effects) in
            cases
        {
            let mut state = state_on_inbox();
            state.inbox.rows = vec![item("i1", ItemState::Open, options)];
            state.inbox_view.selected = Some(ItemId("i1".to_string()));
            if phase == Phase::Sending {
                state.pending_answers.push(ItemId("i1".to_string()));
            }
            state.overlay = Some(Overlay {
                item_id: ItemId("i1".to_string()),
                options: options.iter().map(|option| option.to_string()).collect(),
                item: item("i1", ItemState::Open, options),
                phase: phase.clone(),
                buffer: buffer.to_string(),
            });

            let effects = update(&mut state, Msg::Key(key));
            let label = format!("{phase:?} {key:?}");
            assert_eq!(phase_of(&state), expected_phase, "phase after {label}");
            assert_eq!(buffer_of(&state), expected_buffer, "buffer after {label}");
            assert_eq!(effects, expected_effects, "effects after {label}");
        }
    }

    /// Closing the overlay leaves the answer in flight, and its reply still lands on the status row.
    #[test]
    fn close_while_sending_keeps_the_answer() {
        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));

        update(&mut state, Msg::Key(Key::Enter));
        update(&mut state, Msg::Key(Key::Char('y')));
        assert_eq!(state.pending_answers, vec![ItemId("i1".to_string())]);

        let effects = update(&mut state, Msg::Key(Key::Esc));
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());
        assert_eq!(state.pending_answers, vec![ItemId("i1".to_string())]);

        update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(phase_of(&state), Some(Phase::Sending));

        let effects = update(&mut state, Msg::Key(Key::Esc));
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());

        let effects = update(
            &mut state,
            Msg::Answered {
                id: ItemId("i1".to_string()),
                text: "approve".to_string(),
                scope: Scope::Once,
                outcome: Err(AnswerError {
                    kind: FailKind::Exit(4),
                    refusal: Some("answer-not-approver".to_string()),
                    line: "bots: answer-not-approver".to_string(),
                }),
            },
        );
        assert!(effects.is_empty());
        assert!(state.pending_answers.is_empty());
        assert!(state.overlay.is_none());
        assert_eq!(
            state.last_error,
            Some(StatusLine {
                source: Source::Answer,
                text: "bots: answer-not-approver".to_string(),
            })
        );

        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));

        update(&mut state, Msg::Key(Key::Enter));
        update(&mut state, Msg::Key(Key::Char('y')));
        let effects = update(&mut state, Msg::Key(Key::Ctrl('c')));
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());
        assert_eq!(state.pending_answers, vec![ItemId("i1".to_string())]);

        let effects = update(
            &mut state,
            Msg::Answered {
                id: ItemId("i1".to_string()),
                text: "approve".to_string(),
                scope: Scope::Once,
                outcome: Ok(AnswerOk { warning: None }),
            },
        );
        assert!(effects.is_empty());
        assert!(state.pending_answers.is_empty());
        assert!(state.overlay.is_none());
        assert_eq!(state.answered.len(), 1);
        assert_eq!(state.answered[0].id, ItemId("i1".to_string()));
        assert_eq!(state.answered[0].outcome, Outcome::Approved);
    }

    /// A landed answer issues no read of its own, so the outcome word stays until the next poll.
    #[test]
    fn outcome_word_stays_until_the_next_poll() {
        let mut state = state_on_inbox();
        state.now = 1_000;
        state.next_poll_at = 6_000;
        state.inbox.generation = 1;
        state.inbox.in_flight = false;
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));

        update(&mut state, Msg::Key(Key::Enter));
        let effects = update(&mut state, Msg::Key(Key::Char('y')));
        assert_eq!(effects, answer("approve", Scope::Once));
        assert!(!effects
            .iter()
            .any(|effect| matches!(effect, Effect::Fetch { .. })));

        let effects = update(
            &mut state,
            Msg::Answered {
                id: ItemId("i1".to_string()),
                text: "approve".to_string(),
                scope: Scope::Once,
                outcome: Ok(AnswerOk { warning: None }),
            },
        );
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());
        assert_eq!(state.answered.len(), 1);
        assert_eq!(state.answered[0].outcome, Outcome::Approved);

        let effects = update(&mut state, Msg::Tick { now: 2_000 });
        assert!(effects.is_empty());
        assert_eq!(state.answered.len(), 1);

        update(
            &mut state,
            fetched(1, vec![item("i1", ItemState::Open, &[])]),
        );
        assert_eq!(state.answered.len(), 1);

        let effects = update(&mut state, Msg::Tick { now: 6_000 });
        assert!(effects.contains(&Effect::Fetch {
            surface: Surface::Inbox,
            bot: None,
            generation: 2,
        }));

        update(&mut state, fetched(2, Vec::new()));
        assert!(state.answered.is_empty());
    }

    /// A refresh that drops the item moves the overlay on, and a reply moves it by the refusal it carries.
    #[test]
    fn overlay_moves_on_refresh_and_reply() {
        for phase in [
            Phase::Idle,
            Phase::Typing,
            Phase::Refused("bots: answer-not-approver".to_string()),
        ] {
            let mut state = state_with(phase.clone(), vec![item("i1", ItemState::Open, &[])]);
            update(&mut state, fetched(1, Vec::new()));
            assert_eq!(
                phase_of(&state),
                Some(Phase::Gone),
                "dropped from {phase:?}"
            );

            let mut state = state_with(phase.clone(), vec![item("i1", ItemState::Open, &[])]);
            update(
                &mut state,
                fetched(1, vec![item("i1", ItemState::Expired, &[])]),
            );
            assert_eq!(
                phase_of(&state),
                Some(Phase::Gone),
                "expired from {phase:?}"
            );
        }

        let mut state = state_with(Phase::Sending, vec![item("i1", ItemState::Open, &[])]);
        update(&mut state, fetched(1, Vec::new()));
        assert_eq!(phase_of(&state), Some(Phase::Sending));

        let mut state = state_with(Phase::Sending, vec![item("i1", ItemState::Open, &[])]);
        update(
            &mut state,
            answered(
                "i1",
                Err(AnswerError {
                    kind: FailKind::Exit(4),
                    refusal: Some("item-answered-differently".to_string()),
                    line: "bots: item-answered-differently".to_string(),
                }),
            ),
        );
        assert_eq!(phase_of(&state), Some(Phase::Gone));

        let mut state = state_with(Phase::Sending, vec![item("i1", ItemState::Open, &[])]);
        update(
            &mut state,
            answered(
                "i1",
                Err(AnswerError {
                    kind: FailKind::Exit(4),
                    refusal: Some("item-busy".to_string()),
                    line: "bots: item-busy".to_string(),
                }),
            ),
        );
        assert_eq!(
            phase_of(&state),
            Some(Phase::Refused("bots: item-busy".to_string()))
        );

        let mut state = state_with(Phase::Sending, Vec::new());
        update(
            &mut state,
            answered(
                "i1",
                Err(AnswerError {
                    kind: FailKind::Exit(4),
                    refusal: Some("item-busy".to_string()),
                    line: "bots: item-busy".to_string(),
                }),
            ),
        );
        assert_eq!(phase_of(&state), Some(Phase::Gone));

        let mut state = state_with(Phase::Sending, vec![item("i1", ItemState::Open, &[])]);
        update(
            &mut state,
            answered(
                "i1",
                Err(AnswerError {
                    kind: FailKind::Timeout,
                    refusal: None,
                    line: "bots-ui: answer timed out after 30s, it may have landed".to_string(),
                }),
            ),
        );
        assert_eq!(
            phase_of(&state),
            Some(Phase::Refused(
                "bots-ui: answer timed out after 30s, it may have landed".to_string()
            ))
        );

        let mut state = state_with(Phase::Sending, vec![item("i1", ItemState::Open, &[])]);
        update(
            &mut state,
            answered("other", Ok(AnswerOk { warning: None })),
        );
        assert_eq!(phase_of(&state), Some(Phase::Sending));
    }

    /// A paste adds text to a typed line and never answers, opens a row or leaves the overlay alone.
    #[test]
    fn paste_appends_only_while_typing() {
        let mut state = state_with(Phase::Typing, vec![item("i1", ItemState::Open, &[])]);
        state.overlay.as_mut().expect("the overlay is open").buffer = "a".to_string();
        let effects = update(&mut state, Msg::Paste("y\nz\r".to_string()));
        assert!(effects.is_empty());
        assert_eq!(buffer_of(&state), "ay z ");

        let mut state = state_with(Phase::Idle, vec![item("i1", ItemState::Open, &[])]);
        let effects = update(&mut state, Msg::Paste("y\nz\r".to_string()));
        assert!(effects.is_empty());
        assert_eq!(phase_of(&state), Some(Phase::Idle));
        assert_eq!(buffer_of(&state), "");

        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));
        let effects = update(&mut state, Msg::Paste("y\n".to_string()));
        assert!(effects.is_empty());
        assert!(state.overlay.is_none());
    }

    /// Opening an item reads its state, its answered mark and the answers already out.
    #[test]
    fn open_item_picks_its_phase() {
        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Expired, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));
        update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(phase_of(&state), Some(Phase::Gone));

        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));
        state.answered.push(AnsweredRow {
            id: ItemId("i1".to_string()),
            outcome: Outcome::Approved,
            inbox_generation: 0,
        });
        update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(phase_of(&state), Some(Phase::Gone));

        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));
        state.pending_answers.push(ItemId("i1".to_string()));
        update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(phase_of(&state), Some(Phase::Sending));

        let mut state = state_on_inbox();
        let listed = item("i1", ItemState::Open, &["email", "chat"]);
        state.inbox.rows = vec![listed.clone()];
        state.inbox_view.selected = Some(ItemId("i1".to_string()));
        update(&mut state, Msg::Key(Key::Enter));
        let overlay = state.overlay.as_ref().expect("the overlay is open");
        assert_eq!(overlay.phase, Phase::Idle);
        assert_eq!(
            overlay.options,
            vec!["email".to_string(), "chat".to_string()]
        );
        assert_eq!(overlay.item, listed);

        let mut state = state_on_inbox();
        state.inbox.rows = vec![item("i1", ItemState::Open, &[])];
        update(&mut state, Msg::Key(Key::Enter));
        assert!(state.overlay.is_none());
    }
}

#[cfg(test)]
mod on_chat_action {
    use super::*;
    use crate::model::{Message, StatusRow};

    /// The status payload the picker reads, one bot row per id.
    fn status_with(bots: &[&str]) -> StatusPayload {
        StatusPayload {
            rows: bots
                .iter()
                .map(|bot_id| StatusRow {
                    kind: "bot".to_string(),
                    bot_id: bot_id.to_string(),
                    ..StatusRow::default()
                })
                .collect(),
            ..StatusPayload::default()
        }
    }

    /// A state on the chat tab with a bot chosen and four bots listed, so the picker has rows to move over.
    fn state_on_chat() -> State {
        let mut state = State {
            size: Size { cols: 80, rows: 24 },
            active_tab: Tab::Chat,
            ..State::default()
        };
        state.chat_view.bot = Some(BotId("hello".to_string()));
        state.status.rows = status_with(&["archive", "digest", "hello", "nightly-report"]);
        state
    }

    /// One message of the transcript, with the fields the window reads.
    fn message(role: Role, text: &str) -> Message {
        Message {
            role,
            text: text.to_string(),
            ..Message::default()
        }
    }

    /// The chat context is the stack in both of its modes, and the main context is the stack before them.
    #[test]
    fn context_follows_the_chat_mode() {
        let mut state = state_on_chat();
        assert_eq!(context_stack(&state), vec![Context::Main]);
        state.chat_view.mode = ChatMode::Typing;
        assert_eq!(context_stack(&state), vec![Context::Chat]);
        state.chat_view.mode = ChatMode::Picking;
        assert_eq!(context_stack(&state), vec![Context::Chat]);
    }

    /// Enter enters typing, the typed line is sent trimmed, and a second Enter finds the send still out.
    #[test]
    fn enter_types_and_send_hands_off_the_trimmed_draft() {
        let mut state = state_on_chat();
        update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(state.chat_view.mode, ChatMode::Typing);
        for c in "  hi  ".chars() {
            update(&mut state, Msg::Key(Key::Char(c)));
        }
        assert_eq!(state.chat_view.draft, "  hi  ");

        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(
            effects,
            vec![Effect::ChatSend {
                bot: BotId("hello".to_string()),
                text: "hi".to_string(),
            }]
        );
        assert_eq!(state.chat_view.sending, Some("hi".to_string()));
        assert!(state.chat_view.draft.is_empty());
        assert!(update(&mut state, Msg::Key(Key::Enter)).is_empty());
    }

    /// A draft that is blank after trimming sends nothing and leaves the history alone.
    #[test]
    fn blank_draft_sends_nothing() {
        let mut state = state_on_chat();
        update(&mut state, Msg::Key(Key::Enter));
        for c in "   ".chars() {
            update(&mut state, Msg::Key(Key::Char(c)));
        }
        assert!(update(&mut state, Msg::Key(Key::Enter)).is_empty());
        assert_eq!(state.chat_view.sending, None);
        assert!(state.chat_view.history.is_empty());
    }

    /// Up walks the sent lines back to the oldest, and Down walks them forward to the kept draft.
    #[test]
    fn history_recalls_and_restores_the_draft() {
        let mut state = state_on_chat();
        update(&mut state, Msg::Key(Key::Enter));
        for text in ["one", "two"] {
            for c in text.chars() {
                update(&mut state, Msg::Key(Key::Char(c)));
            }
            update(&mut state, Msg::Key(Key::Enter));
            on_chat_sent(
                &mut state,
                BotId("hello".to_string()),
                text.to_string(),
                Ok(ChatOk {
                    code: 0,
                    warning: None,
                }),
            );
        }
        assert_eq!(
            state.chat_view.history,
            vec!["one".to_string(), "two".to_string()]
        );

        for c in "dra".chars() {
            update(&mut state, Msg::Key(Key::Char(c)));
        }
        update(&mut state, Msg::Key(Key::Up));
        assert_eq!(state.chat_view.draft, "two");
        update(&mut state, Msg::Key(Key::Up));
        assert_eq!(state.chat_view.draft, "one");
        update(&mut state, Msg::Key(Key::Down));
        assert_eq!(state.chat_view.draft, "two");
        update(&mut state, Msg::Key(Key::Down));
        assert_eq!(state.chat_view.draft, "dra");
    }

    /// A refused send appended nothing, so the text comes back and the next Enter sends it once.
    #[test]
    fn refused_send_puts_the_draft_back() {
        let mut state = state_on_chat();
        update(&mut state, Msg::Key(Key::Enter));
        for c in "hi".chars() {
            update(&mut state, Msg::Key(Key::Char(c)));
        }
        assert_eq!(update(&mut state, Msg::Key(Key::Enter)).len(), 1);

        let effects = on_chat_sent(
            &mut state,
            BotId("hello".to_string()),
            "hi".to_string(),
            Err(ChatError {
                kind: FailKind::Exit(4),
                line: "bots: body-secret".to_string(),
            }),
        );
        assert!(effects.is_empty());
        assert_eq!(state.chat_view.draft, "hi");
        assert_eq!(
            state.last_error,
            Some(StatusLine {
                source: Source::ChatSend,
                text: "bots: body-secret".to_string(),
            })
        );

        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(
            effects,
            vec![Effect::ChatSend {
                bot: BotId("hello".to_string()),
                text: "hi".to_string(),
            }]
        );
    }

    /// A send that appended draws its warning and reads the transcript again.
    #[test]
    fn appended_send_reads_the_transcript_again() {
        let mut state = state_on_chat();
        let effects = on_chat_sent(
            &mut state,
            BotId("hello".to_string()),
            "hi".to_string(),
            Ok(ChatOk {
                code: 1,
                warning: Some("bots: chat --message exited 1: executor exited 1".to_string()),
            }),
        );
        assert_eq!(
            state.last_error,
            Some(StatusLine {
                source: Source::ChatSend,
                text: "bots: chat --message exited 1: executor exited 1".to_string(),
            })
        );
        assert_eq!(
            effects,
            vec![Effect::Fetch {
                surface: Surface::Chat,
                bot: Some(BotId("hello".to_string())),
                generation: 1,
            }]
        );
    }

    /// The picker opens on the chosen bot's row, moves up it and chooses the row it lands on.
    #[test]
    fn picker_moves_and_chooses() {
        let mut state = state_on_chat();
        update(&mut state, Msg::Key(Key::Char('b')));
        assert_eq!(state.chat_view.mode, ChatMode::Picking);
        assert_eq!(state.chat_view.picker_selected, 2);

        update(&mut state, Msg::Key(Key::Up));
        assert_eq!(state.chat_view.picker_selected, 1);

        let effects = update(&mut state, Msg::Key(Key::Enter));
        assert_eq!(state.chat_view.bot, Some(BotId("digest".to_string())));
        assert_eq!(state.chat_view.mode, ChatMode::Main);
        assert_eq!(
            effects,
            vec![Effect::Fetch {
                surface: Surface::Chat,
                bot: Some(BotId("digest".to_string())),
                generation: 1,
            }]
        );
    }

    /// The first visit opens the picker when several bots are listed and chooses the only one when one is.
    #[test]
    fn first_visit_opens_the_picker_for_four_bots_and_chooses_a_lone_bot() {
        let mut state = State {
            size: Size { cols: 80, rows: 24 },
            active_tab: Tab::Activity,
            ..State::default()
        };
        state.status.rows = status_with(&["archive", "digest", "hello", "nightly-report"]);
        update(&mut state, Msg::Key(Key::Alt('4')));
        assert_eq!(state.active_tab, Tab::Chat);
        assert_eq!(state.chat_view.mode, ChatMode::Picking);
        assert_eq!(state.chat_view.picker_selected, 0);

        let mut state = State {
            size: Size { cols: 80, rows: 24 },
            active_tab: Tab::Activity,
            ..State::default()
        };
        state.status.rows = status_with(&["hello"]);
        let effects = update(&mut state, Msg::Key(Key::Alt('4')));
        assert_eq!(state.chat_view.bot, Some(BotId("hello".to_string())));
        assert!(effects.contains(&Effect::Fetch {
            surface: Surface::Chat,
            bot: Some(BotId("hello".to_string())),
            generation: 1,
        }));
    }

    /// A paste adds text to the draft while typing, each line break as one space, and never sends.
    #[test]
    fn paste_appends_while_typing_and_never_sends() {
        let mut state = state_on_chat();
        update(&mut state, Msg::Key(Key::Enter));
        let effects = update(&mut state, Msg::Paste("a\nb\rc".to_string()));
        assert!(effects.is_empty());
        assert_eq!(state.chat_view.draft, "a b c");
        assert_eq!(state.chat_view.sending, None);

        let mut state = state_on_chat();
        let effects = update(&mut state, Msg::Paste("a\nb\rc".to_string()));
        assert!(effects.is_empty());
        assert!(state.chat_view.draft.is_empty());
    }

    /// A window that cannot hold every line drops whole messages and marks how many it dropped.
    #[test]
    fn window_drops_whole_messages_and_marks_them() {
        let mut state = state_on_chat();
        state.chat.rows.messages = (0..5)
            .map(|index| message(Role::Human, &format!("m{index}")))
            .collect();
        state.chat_view.sending = Some("m4".to_string());

        let rows = chat_window_rows(&state);
        assert_eq!(rows, 13);
        let window = chat_window(&state, chat_width(&state), rows);
        assert_eq!(window[0], ChatLine::Earlier(2));
        assert_eq!(window[1], ChatLine::Blank);
        assert_eq!(window[2], ChatLine::Label(2));
        assert_eq!(window[window.len() - 2], ChatLine::Blank);
        assert_eq!(window[window.len() - 1], ChatLine::Working);
        assert!(window.len() <= rows);
    }

    /// The scroll stops at the lines above the window and comes back to the bottom.
    #[test]
    fn scroll_clamps_to_the_lines_above_the_window() {
        let mut state = state_on_chat();
        state.chat.rows.messages = (0..30)
            .map(|index| message(Role::Human, &format!("m{index}")))
            .collect();

        for _ in 0..1_000 {
            update(&mut state, Msg::Key(Key::Up));
        }
        assert_eq!(state.chat_view.scroll_from_bottom, chat_max_scroll(&state));

        for _ in 0..1_000 {
            update(&mut state, Msg::Key(Key::Down));
        }
        assert_eq!(state.chat_view.scroll_from_bottom, 0);
    }
}
