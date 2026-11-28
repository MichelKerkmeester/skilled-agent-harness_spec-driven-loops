#![allow(dead_code)]
//! The shared helpers the pane tests build their states and compare their frames with.

use bots_tui::model::{
    parse_utc, ActivityGroup, ActivityPayload, InboxItem, InboxPayload, Routine, RoutinesPayload,
    RunState, StatusPayload, Transcript,
};
use bots_tui::state::{
    on_answered, on_fetched, AnswerOk, FailKind, Payload, Read, ReadError, Scope, Size, State,
    Surface, Tab,
};
use bots_tui::theme::Theme;
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;
use unicode_width::UnicodeWidthStr;

use super::common::frames;

/// The instant every fixture is written against.
pub const NOW: &str = "2026-11-25T21:14:04.000Z";

/// The instant every fixture is written against, parsed so a bad literal fails loudly.
pub fn now() -> i64 {
    parse_utc(NOW).expect("the fixture instant parses")
}

/// The activity fixture, parsed from the payload the runtime prints.
pub fn activity_fixture() -> Vec<ActivityGroup> {
    let payload: ActivityPayload =
        serde_json::from_str(include_str!("../fixtures/payloads/activity.json"))
            .expect("the activity fixture parses");
    payload.groups
}

/// The inbox fixture, parsed from the payload the runtime prints.
pub fn inbox_fixture() -> Vec<InboxItem> {
    let payload: InboxPayload =
        serde_json::from_str(include_str!("../fixtures/payloads/inbox.json"))
            .expect("the inbox fixture parses");
    payload.items
}

/// The routines fixture, parsed from the payload the runtime prints.
pub fn routines_fixture() -> Vec<Routine> {
    let payload: RoutinesPayload =
        serde_json::from_str(include_str!("../fixtures/payloads/routines.json"))
            .expect("the routines fixture parses");
    payload.routines
}

/// The status fixture, parsed from the payload the runtime prints.
pub fn status_fixture() -> StatusPayload {
    serde_json::from_str(include_str!("../fixtures/payloads/status.json"))
        .expect("the status fixture parses")
}

/// The chat transcript fixture, parsed from the payload the runtime prints.
pub fn chat_fixture() -> Transcript {
    serde_json::from_str(include_str!("../fixtures/payloads/chat-transcript.json"))
        .expect("the chat transcript fixture parses")
}

/// The activity fixture without the two rows the mockup leaves out of its stale frame.
pub fn eight() -> Vec<ActivityGroup> {
    let mut groups = activity_fixture();
    for group in &mut groups {
        group.rows.retain(|row| {
            !(row.bot_id == "nightly-report"
                && matches!(row.state, RunState::Scheduled | RunState::Recurring))
        });
    }
    groups
}

/// The surface a payload belongs to.
pub fn surface_of(payload: &Payload) -> Surface {
    match payload {
        Payload::Status(_) => Surface::Status,
        Payload::Activity(_) => Surface::Activity,
        Payload::Inbox(_) => Surface::Inbox,
        Payload::Routines(_) => Surface::Routines,
        Payload::Chat(_) => Surface::Chat,
    }
}

/// Adds one to a surface's generation and returns it, so the reply is the newest one.
pub fn bump(state: &mut State, surface: Surface) -> u64 {
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

/// A state at one size on one tab, with the status fixture landed.
pub fn base(cols: u16, rows: u16, tab: Tab) -> State {
    let mut state = State {
        size: Size { cols, rows },
        now: now(),
        active_tab: tab,
        ..State::default()
    };
    land(&mut state, Payload::Status(status_fixture()));
    state
}

/// Lands one payload on the surface its variant names.
pub fn land(state: &mut State, payload: Payload) {
    let surface = surface_of(&payload);
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

/// Fails one surface with the line its verb prints when the index is locked.
pub fn fail(state: &mut State, surface: Surface) {
    let verb = match surface {
        Surface::Status => "status",
        Surface::Activity => "activity",
        Surface::Inbox => "inbox",
        Surface::Routines => "routines",
        Surface::Chat => "chat --transcript",
    };
    let generation = bump(state, surface);
    on_fetched(
        state,
        surface,
        generation,
        Err(ReadError {
            kind: FailKind::Exit(1),
            line: format!("bots: {verb} --json exited 1: index locked"),
        }),
    );
}

/// Lands a payload, then fails the same surface later, so the rows stay and the pane is stale.
pub fn land_stale(state: &mut State, payload: Payload) {
    let surface = surface_of(&payload);
    state.now = now() - 150_000;
    land(state, payload);
    state.now = now();
    fail(state, surface);
}

/// The sixteen mockup frames the pane tests compare against.
pub const PANE_FRAMES: [&str; 16] = [
    "Shell, Activity tab, rows",
    "Shell, Inbox tab, open and expired items",
    "Shell, Routines tab, rows",
    "Activity, loading",
    "Activity, empty",
    "Activity, stale with the rows kept",
    "Activity, error with no rows",
    "Inbox, loading",
    "Inbox, empty, banner hidden",
    "Inbox, stale with the rows kept",
    "Inbox, error with no rows",
    "Routines, loading",
    "Routines, empty",
    "Routines, stale with the rows kept",
    "Routines, error with no rows",
    "Inbox, answered row",
];

/// The state one mockup frame is drawn from.
pub fn frame_state(heading: &str, cols: u16, rows: u16) -> State {
    match heading {
        "Shell, Activity tab, rows" => {
            let mut state = base(cols, rows, Tab::Activity);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            land(&mut state, Payload::Activity(activity_fixture()));
            state
        }
        "Shell, Inbox tab, open and expired items" => {
            let mut state = base(cols, rows, Tab::Inbox);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            state
        }
        "Shell, Routines tab, rows" => {
            let mut state = base(cols, rows, Tab::Routines);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            land(&mut state, Payload::Routines(routines_fixture()));
            state
        }
        "Activity, loading" => {
            let mut state = base(cols, rows, Tab::Activity);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            state
        }
        "Activity, empty" => {
            let mut state = base(cols, rows, Tab::Activity);
            land(&mut state, Payload::Inbox(Vec::new()));
            land(&mut state, Payload::Activity(Vec::new()));
            state
        }
        "Activity, stale with the rows kept" => {
            let mut state = base(cols, rows, Tab::Activity);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            land_stale(&mut state, Payload::Activity(eight()));
            state
        }
        "Activity, error with no rows" => {
            let mut state = base(cols, rows, Tab::Activity);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            fail(&mut state, Surface::Activity);
            state
        }
        "Inbox, loading" => base(cols, rows, Tab::Inbox),
        "Inbox, empty, banner hidden" => {
            let mut state = base(cols, rows, Tab::Inbox);
            land(&mut state, Payload::Inbox(Vec::new()));
            state
        }
        "Inbox, stale with the rows kept" => {
            let mut state = base(cols, rows, Tab::Inbox);
            land_stale(&mut state, Payload::Inbox(inbox_fixture()));
            state
        }
        "Inbox, error with no rows" => {
            let mut state = base(cols, rows, Tab::Inbox);
            fail(&mut state, Surface::Inbox);
            state
        }
        "Routines, loading" => {
            let mut state = base(cols, rows, Tab::Routines);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            state
        }
        "Routines, empty" => {
            let mut state = base(cols, rows, Tab::Routines);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            land(&mut state, Payload::Routines(Vec::new()));
            state
        }
        "Routines, stale with the rows kept" => {
            let mut state = base(cols, rows, Tab::Routines);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            land_stale(&mut state, Payload::Routines(routines_fixture()));
            state
        }
        "Routines, error with no rows" => {
            let mut state = base(cols, rows, Tab::Routines);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            fail(&mut state, Surface::Routines);
            state
        }
        "Inbox, answered row" => {
            let mut state = base(cols, rows, Tab::Inbox);
            land(&mut state, Payload::Inbox(inbox_fixture()));
            let id = inbox_fixture()
                .into_iter()
                .next()
                .map(|item| item.id)
                .unwrap_or_default();
            on_answered(
                &mut state,
                id,
                "approve".to_string(),
                Scope::Once,
                Ok(AnswerOk { warning: None }),
            );
            state
        }
        other => panic!("no frame state is built for {other}"),
    }
}

/// Draws the pane body at one size and returns every row's cells and the count draw returned.
pub fn draw_body(state: &State, cols: u16, rows: u16, opts: Options) -> (Vec<String>, usize) {
    let mut terminal =
        Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
    let mut count = 0usize;
    terminal
        .draw(|frame| {
            let body = view::bands(frame.area()).body;
            count = view::panes::draw(frame, body, state, &Theme::new(&opts));
        })
        .expect("the frame draws");
    let buffer = terminal.backend().buffer();
    let drawn = (0..rows)
        .map(|y| (0..cols).map(|x| buffer[(x, y)].symbol()).collect())
        .collect();
    (drawn, count)
}

/// Draws the whole shell at one size and returns every row's cells.
pub fn draw_frame(state: &State, cols: u16, rows: u16, opts: Options) -> Vec<String> {
    let mut terminal =
        Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
    terminal
        .draw(|frame| view::draw(frame, state, &opts))
        .expect("the frame draws");
    let buffer = terminal.backend().buffer();
    (0..rows)
        .map(|y| (0..cols).map(|x| buffer[(x, y)].symbol()).collect())
        .collect()
}

/// One mockup row the fixtures and the shared rules cannot draw as the mockup does.
pub struct Correction {
    /// The frame the row belongs to.
    pub heading: &'static str,
    /// The frame size the row belongs to.
    pub size: &'static str,
    /// The frame row the correction replaces.
    pub row: usize,
    /// The list side of the corrected row.
    pub left: &'static str,
    /// The detail side of the corrected row.
    pub right: &'static str,
    /// Why the mockup and the drawn row differ.
    pub reason: &'static str,
}

/// The eleven mockup rows the drawn frame corrects.
pub const CORRECTIONS: &[Correction] = &[
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "80x24",
        row: 12,
        left: "  \u{25cb} nightly-report   scheduled   in 4h",
        right: "",
        reason: "the mockup draws in 5h, but the next fire is 4h 45m 56s ahead and the one age formatter rounds down",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 3,
        left: "Activity \u{b7} 7 groups \u{b7} 10 rows",
        right: "Detail",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 4,
        left: "",
        right: "",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 5,
        left: "Needs you",
        right: "bot       hello",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 6,
        left: "\u{203a} ! hello            needs_you   2m ago",
        right: "identity  skilled-scratch/hello",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 7,
        left: "  ! digest           needs_you   9m ago",
        right: "state     needs_you",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 8,
        left: "Working",
        right: "at        2026-11-25T21:12:04Z",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 9,
        left: "  \u{b7} nightly-report   working     now",
        right: "actor     ada",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 10,
        left: "Scheduled",
        right: "runId     20261125T211204Z-7c1e9a40",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 11,
        left: "  \u{25cb} digest           scheduled   in 3h",
        right: "",
        reason: "the mockup draws this detail column two rows low with no rule on rows 3 and 4, unlike every other 120x40 pane frame",
    },
    Correction {
        heading: "Shell, Activity tab, rows",
        size: "120x40",
        row: 12,
        left: "  \u{25cb} nightly-report   scheduled   in 4h",
        right: "",
        reason: "the mockup draws in 5h, but the next fire is 4h 45m 56s ahead and the one age formatter rounds down",
    },
];

/// The mockup frame with every correction of this heading and size put in place.
pub fn expected_frame(heading: &str, size: &str) -> Vec<String> {
    let mut lines = frames::load_frame(heading, size);
    let cols = size
        .split_once('x')
        .map_or(0usize, |(cols, _)| cols.parse().unwrap_or(0));
    for correction in CORRECTIONS
        .iter()
        .filter(|row| row.heading == heading && row.size == size)
    {
        let mut line = String::from(correction.left);
        if cols >= 120 {
            let width = UnicodeWidthStr::width(correction.left);
            line.push_str(&" ".repeat(72usize.saturating_sub(width)));
            line.push('\u{2502}');
            line.push_str(correction.right);
        }
        let width = UnicodeWidthStr::width(line.as_str());
        line.push_str(&" ".repeat(cols.saturating_sub(width)));
        assert_ne!(
            lines[correction.row], line,
            "the mockup now draws this row, so remove the correction: {heading} at {size} row {}",
            correction.row
        );
        lines[correction.row] = line;
    }
    lines
}

/// Compares the drawn rows against the frame's rows, every cell.
pub fn assert_rows(
    heading: &str,
    size: &str,
    drawn: &[String],
    rows: std::ops::RangeInclusive<usize>,
) {
    let expected = expected_frame(heading, size);
    for row in rows {
        assert_eq!(drawn[row], expected[row], "{heading} at {size} row {row}");
    }
}

/// Compares the body rows of one frame at both sizes against the mockup.
pub fn assert_body(heading: &str) {
    for (cols, rows) in [(80u16, 24u16), (120u16, 40u16)] {
        let state = frame_state(heading, cols, rows);
        let (drawn, _) = draw_body(&state, cols, rows, Options::default());
        let size = format!("{cols}x{rows}");
        assert_rows(heading, &size, &drawn, 3..=usize::from(rows) - 5);
    }
}
