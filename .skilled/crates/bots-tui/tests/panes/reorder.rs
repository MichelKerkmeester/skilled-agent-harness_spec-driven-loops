//! The selection surviving a reorder of the payload.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::model::{ActivityGroup, InboxItem, Routine, RunState};
use bots_tui::state::{update, ActivityKey, BotId, ItemId, Msg, Payload, Tab};
use bots_tui::Options;

/// One inbox item carrying the id the selection keys on.
fn item(id: &str) -> InboxItem {
    InboxItem {
        id: ItemId(id.to_string()),
        ..InboxItem::default()
    }
}

/// One routine carrying the bot id the selection keys on.
fn routine(bot_id: &str) -> Routine {
    Routine {
        bot_id: BotId(bot_id.to_string()),
        ..Routine::default()
    }
}

/// The inbox selection key for one id, so an assertion reads as the row it names.
fn id(text: &str) -> ItemId {
    ItemId(text.to_string())
}

/// The routines selection key for one bot id, so an assertion reads as the row it names.
fn bot(text: &str) -> BotId {
    BotId(text.to_string())
}

/// The activity fixture with its working row moved into the done group and the working group gone.
fn moved_activity() -> Vec<ActivityGroup> {
    let mut kept = Vec::new();
    let mut moved = None;
    for mut group in activity_fixture() {
        if group.id == "working" {
            moved = group.rows.pop();
        } else {
            kept.push(group);
        }
    }
    let mut row = moved.expect("the fixture holds a working row");
    row.state = RunState::Done;
    let done = kept
        .iter_mut()
        .find(|group| group.id == "done")
        .expect("the fixture holds a done group");
    done.rows.insert(0, row);
    kept
}

/// The selection follows its row key through a poll that reorders rows, and falls to the row
/// nearest its old place when its item leaves.
#[test]
fn selection_survives_reorder() {
    // A selection kept by row index would point at `c` once the payload is reordered.
    let mut state = base(80, 24, Tab::Inbox);
    land(
        &mut state,
        Payload::Inbox(vec![item("a"), item("b"), item("c")]),
    );
    update(&mut state, Msg::Key(Key::Down));
    assert_eq!(state.inbox_view.selected, Some(id("b")));
    land(
        &mut state,
        Payload::Inbox(vec![item("b"), item("c"), item("a")]),
    );
    assert_eq!(state.inbox_view.selected, Some(id("b")));
    assert_eq!(state.inbox_view.anchor, 0);

    // An item that leaves takes the selection to the row now at its old index.
    let mut state = base(80, 24, Tab::Inbox);
    land(
        &mut state,
        Payload::Inbox(vec![item("a"), item("b"), item("c"), item("d")]),
    );
    update(&mut state, Msg::Key(Key::Down));
    update(&mut state, Msg::Key(Key::Down));
    assert_eq!(state.inbox_view.selected, Some(id("c")));
    assert_eq!(state.inbox_view.anchor, 2);
    land(
        &mut state,
        Payload::Inbox(vec![item("a"), item("b"), item("d")]),
    );
    assert_eq!(state.inbox_view.selected, Some(id("d")));
    assert_eq!(state.inbox_view.anchor, 2);
    land(&mut state, Payload::Inbox(vec![item("a")]));
    assert_eq!(state.inbox_view.selected, Some(id("a")));
    land(&mut state, Payload::Inbox(Vec::new()));
    assert_eq!(state.inbox_view.selected, None);
    land(&mut state, Payload::Inbox(vec![item("x")]));
    assert_eq!(state.inbox_view.selected, Some(id("x")));

    // A routine selection follows its bot id the same way.
    let mut state = base(80, 24, Tab::Routines);
    land(
        &mut state,
        Payload::Routines(vec![routine("digest"), routine("nightly")]),
    );
    update(&mut state, Msg::Key(Key::Down));
    assert_eq!(state.routines_view.selected, Some(bot("nightly")));
    land(
        &mut state,
        Payload::Routines(vec![routine("nightly"), routine("digest")]),
    );
    assert_eq!(state.routines_view.selected, Some(bot("nightly")));
    assert_eq!(state.routines_view.anchor, 0);

    // A run keeps its key across groups because the key carries the run id, not the group.
    let mut state = base(80, 24, Tab::Activity);
    land(&mut state, Payload::Activity(activity_fixture()));
    update(&mut state, Msg::Key(Key::Down));
    update(&mut state, Msg::Key(Key::Down));
    let key = ActivityKey::Run {
        identity: "skilled-scratch/hello".to_string(),
        bot_id: "nightly-report".to_string(),
        run_id: "20261125T211340Z-a4b8c2d0".to_string(),
    };
    assert_eq!(state.activity_view.selected, Some(key.clone()));
    land(&mut state, Payload::Activity(moved_activity()));
    assert_eq!(state.activity_view.selected, Some(key));

    // The drawn focus mark has to sit on the moved row, so the selection is visible and not
    // only stored.
    let (drawn, _) = draw_body(&state, 80, 24, Options::default());
    let focus = drawn
        .iter()
        .find(|line| line.contains('\u{203a}'))
        .expect("one drawn row holds the focus mark");
    assert!(focus.contains("nightly-report"), "{focus}");
    assert!(focus.contains("done"), "{focus}");
}
