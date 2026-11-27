//! The row budget: a large payload visits at most the body height.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::model::{ActivityGroup, ActivityRow, RunState};
use bots_tui::state::{update, ActivityKey, Msg, Payload, State, Tab};
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;
use std::time::{Duration, Instant};

/// The body rows a 120x40 terminal leaves for the pane.
const BODY_ROWS: usize = 33;

/// The list lines a 120x40 terminal leaves below the pane title and its blank row.
const LIST_LINES: usize = 31;

/// One row of the large payload, named by its index.
fn row(index: usize) -> ActivityRow {
    ActivityRow {
        bot_id: format!("b{index}"),
        identity: "x".to_string(),
        state: RunState::Done,
        at: NOW.to_string(),
        actor: None,
        run_id: Some(format!("r{index}")),
        schedule: None,
    }
}

/// One group of the large payload, holding `count` rows from `first` on.
fn group(id: String, title: String, first: usize, count: usize) -> ActivityGroup {
    ActivityGroup {
        id,
        title,
        rows: (first..first + count).map(row).collect(),
    }
}

/// The 2,000 rows in one group, landed on the activity tab at 120x40.
fn one_group() -> State {
    let mut state = base(120, 40, Tab::Activity);
    land(
        &mut state,
        Payload::Activity(vec![group(
            "done".to_string(),
            "Done".to_string(),
            0,
            2_000,
        )]),
    );
    state
}

/// The 2,000 rows spread over 200 groups of ten, landed on the activity tab at 120x40.
fn many_groups() -> State {
    let mut state = base(120, 40, Tab::Activity);
    let groups = (0..200)
        .map(|n| group(format!("g{n}"), format!("g{n}"), n * 10, 10))
        .collect();
    land(&mut state, Payload::Activity(groups));
    state
}

/// The bot id and run id the activity selection names.
fn selected_row(state: &State) -> (String, String) {
    match state.activity_view.selected.as_ref() {
        Some(ActivityKey::Run { bot_id, run_id, .. }) => (bot_id.clone(), run_id.clone()),
        other => panic!("the activity selection is not a run: {other:?}"),
    }
}

/// The one frame row that carries the focus mark.
fn focus_row(drawn: &[String]) -> &str {
    let marked: Vec<&String> = drawn
        .iter()
        .filter(|line| line.contains('\u{203a}'))
        .collect();
    assert_eq!(
        marked.len(),
        1,
        "one row carries the focus mark: {marked:?}"
    );
    marked[0].as_str()
}

/// The count a draw returns stays inside the list window and the body height.
fn assert_within_budget(state: &State, count: usize) {
    assert_eq!(state.body_rows(), BODY_ROWS, "the body band at 120x40");
    assert_eq!(state.page_rows(), LIST_LINES, "the list window at 120x40");
    assert!(count >= 1, "the draw built no list line");
    assert!(
        count <= LIST_LINES,
        "the draw built {count} lines for a {LIST_LINES} line window"
    );
    assert!(
        count <= BODY_ROWS,
        "the draw built {count} lines for a {BODY_ROWS} row body"
    );
}

/// A payload of 2,000 rows costs only the lines the body shows, however far the selection moves.
#[test]
fn two_thousand_rows_visit_at_most_the_body_height() {
    let mut state = one_group();
    let (_, count) = draw_body(&state, 120, 40, Options::default());
    assert_within_budget(&state, count);

    for _ in 0..40 {
        update(&mut state, Msg::Key(Key::PageDown));
    }
    let (bot, run) = selected_row(&state);
    assert_eq!(
        run, "r1240",
        "forty pages of 31 rows land on the 1,241st row"
    );
    assert_eq!(bot, "b1240", "the 1,241st row belongs to the 1,241st bot");
    let (drawn, count) = draw_body(&state, 120, 40, Options::default());
    assert_within_budget(&state, count);
    assert!(
        focus_row(&drawn).contains("b1240"),
        "the focus row does not hold b1240: {}",
        focus_row(&drawn)
    );

    let mut state = many_groups();
    for _ in 0..50 {
        update(&mut state, Msg::Key(Key::PageDown));
    }
    let (bot, _) = selected_row(&state);
    let (drawn, count) = draw_body(&state, 120, 40, Options::default());
    assert_within_budget(&state, count);
    assert!(
        focus_row(&drawn).contains(&bot),
        "the focus row does not hold {bot}: {}",
        focus_row(&drawn)
    );
}

/// Ten draws of the 2,000-row payload stay inside one 60 Hz frame.
#[test]
#[ignore = "a timing check the operator runs locally, so a loaded runner cannot fail the gate"]
fn two_thousand_rows_draw_under_16ms() {
    let state = one_group();
    let opts = Options::default();
    let mut terminal = Terminal::new(TestBackend::new(120, 40)).expect("the test terminal opens");
    terminal
        .draw(|frame| view::draw(frame, &state, &opts))
        .expect("the warm up frame draws");

    let mut times = Vec::new();
    for _ in 0..10 {
        let start = Instant::now();
        terminal
            .draw(|frame| view::draw(frame, &state, &opts))
            .expect("the timed frame draws");
        times.push(start.elapsed());
    }
    println!("ten draws of 2,000 rows: {times:?}");

    let slowest = times.iter().max().copied().unwrap_or_default();
    assert!(
        slowest < Duration::from_millis(16),
        "the slowest draw took {slowest:?}, over the 16 ms frame budget: {times:?}"
    );
}
