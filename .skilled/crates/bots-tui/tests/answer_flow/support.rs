#![allow(dead_code)]
//! The shared flow every answer-flow test runs, and the helpers that read its argv log and draw its frame.

use std::time::Duration;

use bots_tui::app::App;
use bots_tui::keys::Key;
use bots_tui::model::{InboxItem, ItemState};
use bots_tui::state::{ItemId, Msg, Payload, Phase, Read, Surface};
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

use super::common::fixture::{fixture, Fixture};
use super::common::frames;

/// The instant every fixture payload is written against, 2026-11-25T21:14:04Z.
pub const NOW_MS: i64 = 1_795_641_244_000;

/// The open item with no options.
pub const HELLO: &str = "20261125T211204Z-7c1e9a40";

/// The open item with the options email and chat.
pub const DIGEST: &str = "20261125T210504Z-3f9d2b11";

/// The expired item.
pub const ARCHIVE: &str = "20261124T201404Z-c8f3a6e2";

/// A review item no fixture payload carries.
pub const REVIEW: &str = "20261125T211304Z-5eed0001";

/// How long one settle may wait for the reads and the write to land.
pub const SETTLE: Duration = Duration::from_secs(10);

/// Runs the shared flow on one fixture and hands the loop to the test body.
///
/// The flow lands the first reads, switches to the inbox and lands its read, so every
/// test starts from three rows with the open item selected.
pub fn flow(name: &str, scenario: &str, body: impl FnOnce(&mut App<'_, TestBackend>, &Fixture)) {
    let fx = fixture(name, scenario);
    let mut terminal = Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
    let mut app = App::new(&mut terminal, fx.program.clone(), Options::default());

    app.handle(Msg::Resize { cols: 80, rows: 24 });
    app.handle(Msg::Tick { now: NOW_MS });
    assert!(app.settle(SETTLE), "the first reads land");

    app.handle(Msg::Key(Key::Alt('2')));
    assert!(app.settle(SETTLE), "the inbox read lands");

    assert_eq!(app.state.inbox.rows.len(), 3);
    assert_eq!(
        app.state.inbox_view.selected,
        Some(ItemId(HELLO.to_string()))
    );

    body(&mut app, &fx);
}

/// Presses one key and reports the exit code the loop returned, if any.
pub fn press(app: &mut App<'_, TestBackend>, key: Key) -> Option<i32> {
    app.handle(Msg::Key(key))
}

/// Types one line a character at a time, none of which may send anything.
pub fn type_text(app: &mut App<'_, TestBackend>, text: &str) {
    for c in text.chars() {
        assert_eq!(press(app, Key::Char(c)), None, "typing {c} sends nothing");
    }
}

/// Moves the inbox selection onto one item, from the top of the list.
pub fn select(app: &mut App<'_, TestBackend>, id: &str) {
    let rows = app.state.inbox.rows.len();
    for _ in 0..rows {
        press(app, Key::Up);
    }
    for _ in 0..=rows {
        if app.state.inbox_view.selected == Some(ItemId(id.to_string())) {
            return;
        }
        press(app, Key::Down);
    }
    panic!("the inbox never selects {id}");
}

/// Selects one item and opens its overlay.
pub fn open(app: &mut App<'_, TestBackend>, id: &str) {
    select(app, id);
    press(app, Key::Enter);
    let overlay = app.state.overlay.as_ref().expect("the overlay opens");
    assert_eq!(overlay.item_id, ItemId(id.to_string()));
}

/// The open overlay's phase, absent while no overlay is open.
pub fn phase(app: &App<'_, TestBackend>) -> Option<Phase> {
    app.state.overlay.as_ref().map(|open| open.phase.clone())
}

/// The lines the fake CLI logged for a write, empty when it wrote nothing.
pub fn answers(fx: &Fixture) -> Vec<String> {
    fx.logged()
        .into_iter()
        .filter(|line| line.starts_with("answer"))
        .collect()
}

/// Asserts the fixture logged both reads, so an empty log cannot pass for a quiet one.
pub fn assert_reads_logged(fx: &Fixture) {
    let logged = fx.logged();
    assert!(
        logged.iter().any(|line| line.starts_with("inbox --json")),
        "{logged:?}"
    );
    assert!(
        logged.iter().any(|line| line.starts_with("status --json")),
        "{logged:?}"
    );
}

/// The exact line the fake CLI logs for one answer.
pub fn answer_line(fx: &Fixture, scope: &str, id: &str, text: &str) -> String {
    format!(
        "answer --scope {scope} --repo {} -- {id} {text}",
        fx.dir.display()
    )
}

/// Lands a fresh inbox payload at the current generation, as a refresh would.
pub fn inject_inbox(app: &mut App<'_, TestBackend>, items: Vec<InboxItem>) {
    let generation = app.state.inbox.generation;
    app.handle(Msg::Fetched {
        surface: Surface::Inbox,
        generation,
        outcome: Ok(Read {
            payload: Payload::Inbox(items),
            warning: None,
        }),
    });
}

/// The current inbox rows without the one that carries this id.
pub fn rows_without(app: &App<'_, TestBackend>, id: &str) -> Vec<InboxItem> {
    app.state
        .inbox
        .rows
        .iter()
        .filter(|item| item.id != ItemId(id.to_string()))
        .cloned()
        .collect()
}

/// A review item no fixture payload carries, so a test can land one of its own.
pub fn review_item() -> InboxItem {
    InboxItem {
        id: ItemId(REVIEW.to_string()),
        bot_id: "memory".to_string(),
        kind: Some("memory-proposal".to_string()),
        question: "Remember this fact?".to_string(),
        state: ItemState::Open,
        at: "2026-11-25T21:13:04.000Z".to_string(),
        options: vec!["confirm".to_string(), "reject".to_string()],
        expires_at: "2026-11-26T21:13:04.000Z".to_string(),
        ..InboxItem::default()
    }
}

/// Draws the whole shell at 80x24 and returns each row's cells.
pub fn draw(app: &App<'_, TestBackend>) -> Vec<String> {
    let mut terminal = Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
    terminal
        .draw(|frame| view::draw(frame, &app.state, &Options::default()))
        .expect("the frame draws");
    let buffer = terminal.backend().buffer();
    (0..24)
        .map(|y| (0..80).map(|x| buffer[(x, y)].symbol()).collect())
        .collect()
}

/// Compares the drawn rows against one 80x24 frame, leaving the skipped rows alone.
pub fn assert_frame(heading: &str, drawn: &[String], skip: &[usize]) {
    let expected = frames::load_frame(heading, "80x24");
    for row in 0..24 {
        if skip.contains(&row) {
            continue;
        }
        assert_eq!(drawn[row], expected[row], "{heading} row {row}");
    }
}

#[test]
fn flow_lands_the_reads() {
    flow("flow-lands-the-reads", "ok", |app, fx| {
        assert_reads_logged(fx);
        let written = answers(fx);
        assert!(written.is_empty(), "{written:?}");
        assert_eq!(phase(app), None);
    });
}
