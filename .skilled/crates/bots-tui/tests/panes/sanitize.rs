//! Control characters never reaching the buffer.

use super::support::*;
use bots_tui::model::{ActivityGroup, ActivityRow, InboxItem, ItemState, RunState};
use bots_tui::state::{ItemId, Payload, Tab};
use bots_tui::Options;

/// The column the detail column starts in on a wide body.
const DETAIL_COLUMN: usize = 73;

/// One activity group whose title and row carry control characters.
fn evil_activity() -> Vec<ActivityGroup> {
    vec![ActivityGroup {
        id: "done".to_string(),
        title: "Done\u{7}".to_string(),
        rows: vec![ActivityRow {
            bot_id: "evil\u{1b}[2J".to_string(),
            identity: "x\u{0}y".to_string(),
            state: RunState::Done,
            at: NOW.to_string(),
            actor: Some("a\u{9b}b".to_string()),
            run_id: Some("r1".to_string()),
            ..ActivityRow::default()
        }],
    }]
}

/// One open inbox item whose bot id and question carry control characters.
fn evil_inbox() -> Vec<InboxItem> {
    vec![InboxItem {
        id: ItemId("i1".to_string()),
        bot_id: "evil\u{1b}[2J".to_string(),
        question: "Ship\u{0}it\u{7f}now\u{9b}\u{202e}".to_string(),
        state: ItemState::Open,
        at: NOW.to_string(),
        expires_at: NOW.to_string(),
        ..InboxItem::default()
    }]
}

/// The detail column of a wide body, every row joined by a newline.
fn detail_column(rows: &[String]) -> String {
    let mut text = String::new();
    for row in rows {
        text.extend(row.chars().skip(DETAIL_COLUMN));
        text.push('\n');
    }
    text
}

/// Asserts no drawn row holds a control character or a bidi override.
fn assert_clean(rows: &[String], case: &str) {
    for row in rows {
        for c in row.chars() {
            assert!(
                !c.is_control(),
                "{case} drew the control character {c:?} in {row:?}"
            );
            assert_ne!(c, '\u{202e}', "{case} drew a bidi override in {row:?}");
        }
    }
}

/// A control character in a payload is replaced before it reaches a cell, so no drawn row
/// carries one and the text around it still draws.
#[test]
fn control_characters_never_reach_the_buffer() {
    let mut state = base(120, 40, Tab::Activity);
    land(&mut state, Payload::Activity(evil_activity()));
    let (drawn, _) = draw_body(&state, 120, 40, Options::default());
    assert!(
        drawn.iter().any(|row| row.contains("evil?[2J")),
        "the activity row draws its bot id with the escape replaced: {drawn:?}"
    );
    assert!(
        drawn.iter().any(|row| row.contains("Done?")),
        "the activity heading draws its title with the bell replaced: {drawn:?}"
    );
    let detail = detail_column(&drawn);
    assert!(
        detail.contains("x?y"),
        "the identity field draws with the null replaced: {detail:?}"
    );
    assert!(
        detail.contains("a?b"),
        "the actor field draws with the control replaced: {detail:?}"
    );
    assert_clean(&drawn, "activity");

    let mut state = base(120, 40, Tab::Inbox);
    land(&mut state, Payload::Inbox(evil_inbox()));
    let (drawn, _) = draw_body(&state, 120, 40, Options::default());
    assert!(
        drawn.iter().any(|row| row.contains("evil?[2J")),
        "the inbox row draws its bot id with the escape replaced: {drawn:?}"
    );
    assert!(
        drawn.iter().any(|row| row.contains("Ship?it?now??")),
        "the inbox row draws its question with every control replaced: {drawn:?}"
    );
    assert_clean(&drawn, "inbox");
}
