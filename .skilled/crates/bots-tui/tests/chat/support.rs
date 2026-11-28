#![allow(dead_code)]
//! The states the chat frames are drawn from and the helpers that build them.

use bots_tui::model::{parse_utc, InboxItem, InboxPayload, StatusPayload, Transcript};
use bots_tui::state::{
    on_fetched, BotId, ChatMode, FailKind, Payload, Read, ReadError, Size, Source, State,
    StatusLine, Surface, Tab,
};
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

/// The instant every fixture is written against.
pub const NOW: &str = "2026-11-25T21:14:04.000Z";

/// The instant every fixture is written against, parsed so a bad literal fails loudly.
pub fn now() -> i64 {
    parse_utc(NOW).expect("the fixture instant parses")
}

/// The bot whose conversation every chat frame draws.
pub const HELLO: &str = "hello";

/// The bot whose conversation every chat frame draws, as the pane's key.
pub fn hello() -> BotId {
    BotId(HELLO.to_string())
}

/// The path of one payload fixture, so a test reads the bytes the runtime prints.
pub fn payload_path(name: &str) -> String {
    let folder = concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/payloads/");
    format!("{folder}{name}")
}

/// One payload fixture, parsed from the bytes the runtime prints.
fn parse_fixture<T: serde::de::DeserializeOwned>(name: &str) -> T {
    let path = payload_path(name);
    let text = match std::fs::read_to_string(&path) {
        Ok(text) => text,
        Err(error) => panic!("{path} did not read: {error}"),
    };
    match serde_json::from_str(&text) {
        Ok(payload) => payload,
        Err(error) => panic!("{path} did not parse: {error}"),
    }
}

/// The transcript fixture, parsed from the payload the runtime prints.
pub fn transcript(name: &str) -> Transcript {
    parse_fixture(name)
}

/// The status fixture, parsed from the payload the runtime prints.
pub fn status_fixture() -> StatusPayload {
    parse_fixture("status.json")
}

/// The inbox fixture, parsed from the payload the runtime prints.
pub fn inbox_items() -> Vec<InboxItem> {
    let payload: InboxPayload = parse_fixture("inbox.json");
    payload.items
}

/// Adds one to a surface's generation and returns it, so the reply is the newest one.
fn bump(state: &mut State, surface: Surface) -> u64 {
    let generation = match surface {
        Surface::Status => &mut state.status.generation,
        Surface::Activity => &mut state.activity.generation,
        Surface::Inbox => &mut state.inbox.generation,
        Surface::Routines => &mut state.routines.generation,
        Surface::Chat => &mut state.chat.generation,
    };
    *generation += 1;
    *generation
}

/// Lands one payload on the surface it belongs to, as that surface's newest reply.
pub fn land(state: &mut State, surface: Surface, payload: Payload) {
    let generation = bump(state, surface);
    on_fetched(
        state,
        surface,
        generation,
        Ok(Read {
            payload,
            warning: None,
        }),
    );
}

/// Fails the chat read with the line the verb prints, so the pane draws its error.
pub fn fail_chat(state: &mut State, line: &str) {
    let generation = bump(state, Surface::Chat);
    on_fetched(
        state,
        Surface::Chat,
        generation,
        Err(ReadError {
            kind: FailKind::Exit(1),
            line: line.to_string(),
        }),
    );
}

/// The line the chat read prints when the conversation file cannot be read.
pub const UNREADABLE: &str =
    "bots: chat --transcript --json exited 1: conversation file unreadable";

/// A state at one size on the chat tab, with the status and inbox fixtures landed.
pub fn base(cols: u16, rows: u16) -> State {
    let mut state = State {
        size: Size { cols, rows },
        now: now(),
        active_tab: Tab::Chat,
        ..State::default()
    };
    land(
        &mut state,
        Surface::Status,
        Payload::Status(status_fixture()),
    );
    land(&mut state, Surface::Inbox, Payload::Inbox(inbox_items()));
    state.chat_view.bot = Some(hello());
    state
}

/// Lands one transcript fixture on the chat surface.
pub fn land_chat(state: &mut State, name: &str) {
    land(state, Surface::Chat, Payload::Chat(transcript(name)));
}

/// The thirteen chat frames the snapshot tests compare against.
pub const CHAT_FRAMES: [&str; 13] = [
    "Chat, loading",
    "Chat, empty",
    "Chat, loaded",
    "Chat, composing",
    "Chat, sending",
    "Chat, reply arrived",
    "Chat, parked with its item id",
    "Chat, failed with its reason",
    "Chat, redacted reply",
    "Chat, unanswered message",
    "Chat, stale with the rows kept",
    "Chat, load error with no rows",
    "Chat, bot picker",
];

/// The state one chat frame is drawn from.
pub fn frame_state(heading: &str, cols: u16, rows: u16) -> State {
    match heading {
        "Chat, loading" => base(cols, rows),
        "Chat, empty" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-empty.json");
            state
        }
        "Chat, loaded" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-transcript.json");
            state
        }
        "Chat, composing" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-transcript.json");
            state.chat_view.mode = ChatMode::Typing;
            state.chat_view.draft = "is the release ready?".to_string();
            state
        }
        "Chat, sending" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-sending.json");
            state.chat_view.mode = ChatMode::Typing;
            state.chat_view.draft = String::new();
            state.chat_view.sending = Some("is the release ready?".to_string());
            state
        }
        "Chat, reply arrived" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-reply.json");
            state
        }
        "Chat, parked with its item id" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-parked.json");
            state
        }
        "Chat, failed with its reason" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-failed.json");
            state.last_error = Some(StatusLine {
                source: Source::ChatSend,
                text: "bots: chat --message exited 1: executor exited 1".into(),
            });
            state
        }
        "Chat, redacted reply" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-redacted.json");
            state
        }
        "Chat, unanswered message" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-unanswered.json");
            state
        }
        "Chat, stale with the rows kept" => {
            let mut state = base(cols, rows);
            state.now = now() - 150_000;
            land_chat(&mut state, "chat-transcript.json");
            state.now = now();
            fail_chat(&mut state, UNREADABLE);
            state
        }
        "Chat, load error with no rows" => {
            let mut state = base(cols, rows);
            fail_chat(&mut state, UNREADABLE);
            state
        }
        "Chat, bot picker" => {
            let mut state = base(cols, rows);
            land_chat(&mut state, "chat-transcript.json");
            state.chat_view.mode = ChatMode::Picking;
            state.chat_view.picker_selected = 2;
            state
        }
        other => panic!("no chat frame state is built for {other}"),
    }
}

/// Draws the whole shell at one size and returns every row's cells.
pub fn draw_frame(state: &State, cols: u16, rows: u16) -> Vec<String> {
    let mut terminal =
        Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
    terminal
        .draw(|frame| view::draw(frame, state, &Options::default()))
        .expect("the frame draws");
    let buffer = terminal.backend().buffer();
    (0..rows)
        .map(|y| (0..cols).map(|x| buffer[(x, y)].symbol()).collect())
        .collect()
}

/// The approved chat frame at one size, padded to its declared width.
pub fn expected(heading: &str, size: &str) -> Vec<String> {
    super::common::frames::load_frame_in("chat-mockups.md", heading, size)
}
