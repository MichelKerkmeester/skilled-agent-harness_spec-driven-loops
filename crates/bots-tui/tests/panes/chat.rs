//! The chat placeholder and its fixed copy.

use super::support::*;
use bots_tui::Options;

/// The chat tab draws its fixed copy, reports no list line and leaves every pane view alone.
#[test]
fn chat_placeholder_names_phase_010() {
    assert_body("Shell, Chat tab, placeholder");

    let state = frame_state("Shell, Chat tab, placeholder", 80, 24);
    let activity_view = state.activity_view.clone();
    let inbox_view = state.inbox_view.clone();
    let routines_view = state.routines_view.clone();
    let (drawn, count) = draw_body(&state, 80, 24, Options::default());
    // The body band runs from the row under the rule to the row above the banner.
    let body = drawn[3..drawn.len() - 4].join("\n");
    assert!(
        body.contains("phase 010"),
        "the body names the phase: {body}"
    );
    assert!(
        body.contains("bots chat"),
        "the body names the verb: {body}"
    );
    assert_eq!(count, 0, "the chat tab builds no list line");
    assert_eq!(
        state.activity_view, activity_view,
        "the activity view moved"
    );
    assert_eq!(state.inbox_view, inbox_view, "the inbox view moved");
    assert_eq!(
        state.routines_view, routines_view,
        "the routines view moved"
    );
}
