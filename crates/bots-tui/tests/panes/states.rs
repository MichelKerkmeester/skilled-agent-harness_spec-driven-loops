//! The five pane states and their titles.

use super::support::*;
use bots_tui::state::{PaneState, Payload, Surface, Tab};
use bots_tui::Options;

/// The frame row the pane title draws on, the first row of the body band.
const TITLE_ROW: usize = 3;

/// The frame row the first list line draws on, two rows under the title.
const FIRST_LINE: usize = 5;

/// The three data panes, each with the verb its loading line names.
const LOADING: [(&str, &str); 3] = [
    ("Activity, loading", "activity"),
    ("Inbox, loading", "inbox"),
    ("Routines, loading", "routines"),
];

/// The twelve state frames, each compared at both sizes.
const STATES: [&str; 12] = [
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
];

/// One drawn row with the padding the buffer fills it with taken off.
fn row(drawn: &[String], y: usize) -> &str {
    drawn[y].trim_end()
}

/// The ASCII options, so a pane draws its ASCII column.
fn ascii() -> Options {
    Options {
        mono: false,
        ascii: true,
    }
}

/// Every data pane names the verb it waits on while its first read is out.
#[test]
fn loading_draws_a_named_line() {
    for (heading, verb) in LOADING {
        let state = frame_state(heading, 80, 24);
        let (drawn, _) = draw_body(&state, 80, 24, Options::default());
        assert_eq!(
            row(&drawn, FIRST_LINE),
            format!("  Loading\u{2026}  bots {verb} --json"),
            "{heading}"
        );

        let (drawn, _) = draw_body(&state, 80, 24, ascii());
        assert_eq!(
            row(&drawn, FIRST_LINE),
            format!("  Loading...  bots {verb} --json"),
            "{heading} under --ascii"
        );
    }
}

/// A failed read keeps the rows of the last good read and marks the pane stale.
#[test]
fn error_keeps_rows_and_sets_stale() {
    let mut state = base(80, 24, Tab::Activity);
    land(&mut state, Payload::Activity(activity_fixture()));
    state.now = now() + 150_000;
    fail(&mut state, Surface::Activity);

    assert_eq!(state.activity.pane_state(), PaneState::Stale);
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    assert_eq!(row(&drawn, TITLE_ROW), "Activity \u{b7} stale 2m");
    assert!(
        drawn
            .iter()
            .any(|line| line.contains("hello") && line.contains("needs_you")),
        "the kept rows are still drawn: {drawn:?}"
    );
    assert_eq!(
        state.last_error.as_ref().map(|line| line.text.as_str()),
        Some("bots: activity --json exited 1: index locked")
    );

    let mut state = base(80, 24, Tab::Inbox);
    land(&mut state, Payload::Inbox(inbox_fixture()));
    state.now = now() + 150_000;
    fail(&mut state, Surface::Inbox);

    assert_eq!(state.inbox.pane_state(), PaneState::Stale);
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    assert_eq!(row(&drawn, TITLE_ROW), "Inbox \u{b7} stale 2m");
    assert!(
        drawn
            .iter()
            .any(|line| line.contains("hello") && line.contains("open")),
        "the kept items are still drawn: {drawn:?}"
    );
    assert_eq!(
        state.last_error.as_ref().map(|line| line.text.as_str()),
        Some("bots: inbox --json exited 1: index locked")
    );
}

/// Every state of every data pane matches its mockup frame at both sizes.
#[test]
fn every_state_frame_matches() {
    for heading in STATES {
        assert_body(heading);
    }
}
