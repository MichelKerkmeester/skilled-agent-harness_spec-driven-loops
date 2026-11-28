//! The activity pane's rows, their order and the frame they must match.

use super::support::*;
use bots_tui::keys::Key;
use bots_tui::model::ActivityGroup;
use bots_tui::state::{update, Msg, Payload, Tab};
use bots_tui::Options;

/// The list side of one drawn row, the columns left of the rule.
fn left(line: &str) -> String {
    line.chars().take(72).collect()
}

/// The activity pane draws its groups in payload order and leaves an empty group out.
#[test]
fn activity_groups_draw_in_payload_order() {
    let mut state = base(120, 40, Tab::Activity);
    let mut groups = activity_fixture();
    groups.insert(
        1,
        ActivityGroup {
            id: "empty".to_string(),
            title: "Empty".to_string(),
            rows: Vec::new(),
        },
    );
    land(&mut state, Payload::Activity(groups));
    let (drawn, _) = draw_body(&state, 120, 40, Options::default());

    assert_eq!(
        left(&drawn[3]).trim_end(),
        "Activity \u{b7} 7 groups \u{b7} 10 rows"
    );

    let headings = [
        "Needs you",
        "Working",
        "Scheduled",
        "Done",
        "Stopped",
        "Failed",
        "Recurring",
    ];
    let mut positions: Vec<usize> = Vec::new();
    for heading in headings {
        let found = (5..40).find(|row| left(&drawn[*row]).trim_end() == heading);
        positions.push(found.unwrap_or_else(|| panic!("the heading {heading} is not drawn")));
    }
    assert!(
        positions.windows(2).all(|pair| pair[0] < pair[1]),
        "{positions:?}"
    );

    for row in &drawn {
        assert!(!row.contains("Empty"), "{row}");
    }

    for group in activity_fixture() {
        for row in &group.rows {
            let found = (5..40).any(|line| {
                let text = left(&drawn[line]);
                text.contains(&row.bot_id) && text.contains(row.state.as_str())
            });
            assert!(
                found,
                "the row {} {} is not drawn",
                row.bot_id,
                row.state.as_str()
            );
        }
    }
}

/// The activity rows match the mockup frame at both sizes.
#[test]
fn activity_rows_match_the_frame() {
    assert_body("Shell, Activity tab, rows");
}

/// Down moves the mark to the next row and the detail column follows it.
#[test]
fn down_moves_the_mark_and_the_detail() {
    let mut state = frame_state("Shell, Activity tab, rows", 120, 40);
    update(&mut state, Msg::Key(Key::Down));
    let (drawn, _) = draw_body(&state, 120, 40, Options::default());
    assert!(drawn[7].starts_with("\u{203a} ! digest"), "{}", drawn[7]);
    assert!(drawn[6].starts_with("  ! hello"), "{}", drawn[6]);
    let detail: String = drawn[5].chars().skip(73).collect();
    assert!(detail.starts_with("bot       digest"), "{detail}");
}
