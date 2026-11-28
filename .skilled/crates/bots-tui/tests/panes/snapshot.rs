//! One buffer snapshot per pane per state at both sizes.

use super::support::*;
use bots_tui::Options;

/// Compares every row of one whole frame against the frame the design fixes.
fn assert_frame(heading: &str, cols: u16, rows: u16) {
    let state = frame_state(heading, cols, rows);
    let drawn = draw_frame(&state, cols, rows, Options::default());
    let size = format!("{cols}x{rows}");
    let expected = expected_frame(heading, &size);
    for row in 0..usize::from(rows) {
        assert_eq!(drawn[row], expected[row], "{heading} at {size} row {row}");
    }
}

/// Expands one table row into the two size tests that compare its whole frame.
macro_rules! frames {
    ($($narrow:ident, $wide:ident => $heading:literal),+ $(,)?) => {
        /// Every frame the table draws, so a correction can be checked against it.
        const FRAMES: &[&str] = &[$($heading),+];

        $(
            /// Compares the whole 80x24 frame against the frame the design fixes.
            #[test]
            fn $narrow() {
                assert_frame($heading, 80, 24);
            }

            /// Compares the whole 120x40 frame against the frame the design fixes.
            #[test]
            fn $wide() {
                assert_frame($heading, 120, 40);
            }
        )+
    };
}

frames! {
    activity_rows_80x24, activity_rows_120x40 => "Shell, Activity tab, rows",
    activity_loading_80x24, activity_loading_120x40 => "Activity, loading",
    activity_empty_80x24, activity_empty_120x40 => "Activity, empty",
    activity_stale_80x24, activity_stale_120x40 => "Activity, stale with the rows kept",
    activity_error_80x24, activity_error_120x40 => "Activity, error with no rows",
    inbox_rows_80x24, inbox_rows_120x40 => "Shell, Inbox tab, open and expired items",
    inbox_loading_80x24, inbox_loading_120x40 => "Inbox, loading",
    inbox_empty_80x24, inbox_empty_120x40 => "Inbox, empty, banner hidden",
    inbox_stale_80x24, inbox_stale_120x40 => "Inbox, stale with the rows kept",
    inbox_error_80x24, inbox_error_120x40 => "Inbox, error with no rows",
    routines_rows_80x24, routines_rows_120x40 => "Shell, Routines tab, rows",
    routines_loading_80x24, routines_loading_120x40 => "Routines, loading",
    routines_empty_80x24, routines_empty_120x40 => "Routines, empty",
    routines_stale_80x24, routines_stale_120x40 => "Routines, stale with the rows kept",
    routines_error_80x24, routines_error_120x40 => "Routines, error with no rows",
    chat_placeholder_80x24, chat_placeholder_120x40 => "Shell, Chat tab, placeholder",
}

/// Every correction names a frame the table draws, at a size the table draws it.
#[test]
fn corrections_name_only_real_frames() {
    for correction in CORRECTIONS {
        assert!(
            FRAMES.contains(&correction.heading),
            "the correction names a frame the table does not draw: {}",
            correction.heading
        );
        let size = match correction.size {
            "80x24" | "120x40" => correction.size,
            other => panic!(
                "the correction names a size the table does not draw: {} at {other}",
                correction.heading
            ),
        };
        let frame = expected_frame(correction.heading, size);
        assert!(
            !frame.is_empty(),
            "the frame {} at {size} loaded no row",
            correction.heading
        );
    }
}
