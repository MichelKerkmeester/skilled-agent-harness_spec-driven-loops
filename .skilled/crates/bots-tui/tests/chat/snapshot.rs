//! One whole-frame snapshot per chat state at 80x24 and at 120x40.

use super::support::*;

/// Compares every row of one whole frame against the approved chat frame.
fn assert_frame(heading: &str, cols: u16, rows: u16) {
    let state = frame_state(heading, cols, rows);
    let drawn = draw_frame(&state, cols, rows);
    let size = format!("{cols}x{rows}");
    let frame = expected(heading, &size);
    for row in 0..usize::from(rows) {
        assert_eq!(drawn[row], frame[row], "{heading} at {size} row {row}");
    }
}

/// Expands one table row into the two size tests that compare its whole frame.
macro_rules! frames {
    ($($narrow:ident, $wide:ident => $heading:literal),+ $(,)?) => {
        $(
            /// Compares the whole 80x24 frame against the approved chat frame.
            #[test]
            fn $narrow() {
                assert_frame($heading, 80, 24);
            }

            /// Compares the whole 120x40 frame against the approved chat frame.
            #[test]
            fn $wide() {
                assert_frame($heading, 120, 40);
            }
        )+
    };
}

frames! {
    frame_c01_80x24, frame_c01_120x40 => "Chat, loading",
    frame_c02_80x24, frame_c02_120x40 => "Chat, empty",
    frame_c03_80x24, frame_c03_120x40 => "Chat, loaded",
    frame_c04_80x24, frame_c04_120x40 => "Chat, composing",
    frame_c05_80x24, frame_c05_120x40 => "Chat, sending",
    frame_c06_80x24, frame_c06_120x40 => "Chat, reply arrived",
    frame_c07_80x24, frame_c07_120x40 => "Chat, parked with its item id",
    frame_c08_80x24, frame_c08_120x40 => "Chat, failed with its reason",
    frame_c09_80x24, frame_c09_120x40 => "Chat, redacted reply",
    frame_c10_80x24, frame_c10_120x40 => "Chat, unanswered message",
    frame_c11_80x24, frame_c11_120x40 => "Chat, stale with the rows kept",
    frame_c12_80x24, frame_c12_120x40 => "Chat, load error with no rows",
    frame_c13_80x24, frame_c13_120x40 => "Chat, bot picker",
}

/// Every chat frame loads at both sizes with the row count its size names.
#[test]
fn chat_mockups_load_at_both_sizes() {
    for heading in CHAT_FRAMES {
        assert_eq!(expected(heading, "80x24").len(), 24, "{heading} at 80x24");
        assert_eq!(expected(heading, "120x40").len(), 40, "{heading} at 120x40");
    }
}
