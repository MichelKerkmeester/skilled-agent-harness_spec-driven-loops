//! Proves the shell draws every bound key and holds its bands at both sizes.
//! The body rows are skipped, because the panes own them.

use bots_tui::keys::{self, Action, Cond, Context, FooterLine, Key, KeyMatch, Row, When};
use bots_tui::model::{parse_utc, InboxItem, StatusPayload, StatusRow};
use bots_tui::state::{
    on_fetched, update, Effect, FailKind, ItemId, Msg, Overlay, Palette, Payload, Phase, Read,
    ReadError, Remote, Size, Source, State, StatusLine, Surface, Tab,
};
use bots_tui::view;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

/// The instant a test names, parsed so a bad literal fails loudly.
fn at(text: &str) -> i64 {
    parse_utc(text).expect("the instant parses")
}

/// A status payload with this many bot rows and one needs-you row.
fn bots(n: usize) -> StatusPayload {
    let mut rows: Vec<StatusRow> = (0..n)
        .map(|_| StatusRow {
            kind: "bot".to_string(),
            ..StatusRow::default()
        })
        .collect();
    rows.push(StatusRow {
        kind: "needs-you".to_string(),
        ..StatusRow::default()
    });
    StatusPayload {
        updated_at: Some("2026-11-25T21:13:52.000Z".to_string()),
        stale: false,
        rows,
        ..StatusPayload::default()
    }
}

/// A state that has seen one resize, with a status read that landed twelve seconds ago.
fn shell(cols: u16, rows: u16) -> State {
    let now = at("2026-11-25T21:14:04.000Z");
    State {
        size: Size { cols, rows },
        now,
        active_tab: Tab::Activity,
        status: Remote {
            rows: bots(4),
            last_ok_at: Some(now),
            ..Remote::default()
        },
        inbox: Remote {
            last_ok_at: Some(now),
            ..Remote::default()
        },
        ..State::default()
    }
}

/// Draws one frame at the given size and returns each row's text.
fn draw(state: &State, cols: u16, rows: u16) -> Vec<String> {
    let mut terminal =
        Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
    terminal
        .draw(|frame| view::draw(frame, state, &Options::default()))
        .expect("the frame draws");
    let buffer = terminal.backend().buffer();
    (0..rows)
        .map(|y| {
            let line: String = (0..cols).map(|x| buffer[(x, y)].symbol()).collect();
            line.trim_end().to_string()
        })
        .collect()
}

/// Reduces one key press and returns the effects it asks for.
fn press(state: &mut State, key: Key) -> Vec<Effect> {
    update(state, Msg::Key(key))
}

/// The shell bands at 80x24, the rows the panes do not own.
const SHELL_80X24: [(usize, &str); 7] = [
    (0, "bots · 4 bots · index 12s ago"),
    (1, "  1 Activity   2 Inbox   3 Routines  [4 Chat]"),
    (
        2,
        "────────────────────────────────────────────────────────────────────────────────",
    ),
    (20, ""),
    (21, ""),
    (22, "Alt+1..4 tabs · [ ] cycle"),
    (23, "Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit"),
];

/// The shell bands at 120x40, the same rows at the taller size.
const SHELL_120X40: [(usize, &str); 7] = [
    (0, "bots · 4 bots · index 12s ago"),
    (1, "  1 Activity   2 Inbox   3 Routines  [4 Chat]"),
    (2, "────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────"),
    (36, ""),
    (37, ""),
    (38, "Alt+1..4 tabs · [ ] cycle"),
    (39, "Ctrl+P/? commands · Ctrl+C exit · Ctrl+D exit"),
];

/// Every row of the key table draws its label in the context it binds.
#[test]
fn every_bound_label_is_drawn() {
    for row in keys::rows() {
        let mut state = shell(80, 24);
        let (cols, rows) = match row.context {
            Context::Main => {
                state.active_tab = Tab::Activity;
                (80, 24)
            }
            Context::Inbox => {
                state.active_tab = Tab::Inbox;
                (80, 24)
            }
            Context::List => {
                state.active_tab = if row.when.contains(&When::InboxTab) {
                    Tab::Inbox
                } else {
                    Tab::Activity
                };
                (80, 24)
            }
            Context::Palette => {
                state.active_tab = Tab::Activity;
                state.palette = Some(Palette::default());
                (80, 24)
            }
            Context::TooSmall => {
                state.size = Size { cols: 30, rows: 7 };
                (30, 7)
            }
            Context::Overlay => {
                state.active_tab = Tab::Inbox;
                state.overlay = Some(Overlay {
                    item_id: ItemId("x".to_string()),
                    options: if row.when.contains(&When::Options) {
                        vec!["a".to_string(), "b".to_string()]
                    } else {
                        Vec::new()
                    },
                    item: InboxItem::default(),
                    phase: if row.when.contains(&When::Typing) {
                        Phase::Typing
                    } else {
                        Phase::Idle
                    },
                    buffer: String::new(),
                });
                (80, 24)
            }
        };
        let drawn = draw(&state, cols, rows).join("\n");
        assert!(
            drawn.contains(row.label),
            "the {:?} row labelled {:?} is not drawn at {cols}x{rows}:\n{drawn}",
            row.context,
            row.label
        );
    }
}

/// The shell bands at 80x24 hold the rows the panes do not own.
#[test]
fn shell_snapshot_80x24() {
    let state = State {
        active_tab: Tab::Chat,
        ..shell(80, 24)
    };
    let drawn = draw(&state, 80, 24);
    for (index, text) in SHELL_80X24 {
        assert_eq!(drawn[index], text, "row {index}");
    }
}

/// The shell bands at 120x40 hold the same rows at the taller size.
#[test]
fn shell_snapshot_120x40() {
    let state = State {
        active_tab: Tab::Chat,
        ..shell(120, 40)
    };
    let drawn = draw(&state, 120, 40);
    for (index, text) in SHELL_120X40 {
        assert_eq!(drawn[index], text, "row {index}");
    }
}

/// The footer names the tab keys and the two quit keys on every tab that binds them.
#[test]
fn footer_names_alt_1_4_brackets_ctrl_p_ctrl_d() {
    for tab in [Tab::Activity, Tab::Inbox, Tab::Chat] {
        let state = State {
            active_tab: tab,
            ..shell(80, 24)
        };
        let drawn = draw(&state, 80, 24);
        let footer = format!("{}\n{}", drawn[22], drawn[23]);
        for label in [
            "Alt+1..4 tabs",
            "[ ] cycle",
            "Ctrl+P/? commands",
            "Ctrl+C exit",
            "Ctrl+D exit",
        ] {
            assert!(
                footer.contains(label),
                "{tab:?} does not draw {label:?}:\n{footer}"
            );
        }
    }
}

/// The chat tab carries the active mark and the activity tab does not.
#[test]
fn chat_tab_carries_the_active_mark() {
    let state = State {
        active_tab: Tab::Chat,
        ..shell(80, 24)
    };
    let drawn = draw(&state, 80, 24);
    assert!(drawn[1].contains("[4 Chat]"), "{}", drawn[1]);
    assert!(!drawn[1].contains("[1 Activity]"), "{}", drawn[1]);
}

/// Below the floor the shell draws the resize line and nothing else.
#[test]
fn too_small_draws_resize_line_only() {
    for (cols, rows) in [(23, 8), (24, 7)] {
        let mut state = shell(cols, rows);
        let drawn = draw(&state, cols, rows);
        assert_eq!(drawn[0], view::TOO_SMALL, "at {cols}x{rows}");
        for row in &drawn[1..] {
            assert_eq!(row, "", "at {cols}x{rows}");
        }
        for row in &drawn {
            assert!(!row.contains("Activity"), "at {cols}x{rows}: {row}");
        }
        // The line names the one key the screen binds, and that key quits.
        assert_eq!(
            press(&mut state, Key::Ctrl('d')),
            vec![Effect::Quit { code: 0 }],
            "at {cols}x{rows}"
        );
    }
    for cols in 1..=40u16 {
        for rows in 1..=10u16 {
            if cols >= 24 && rows >= 8 {
                continue;
            }
            let state = shell(cols, rows);
            let drawn = draw(&state, cols, rows);
            let expected: String = view::TOO_SMALL.chars().take(usize::from(cols)).collect();
            assert_eq!(drawn[0], expected.trim_end(), "at {cols}x{rows}");
        }
    }
}

/// The header counts the bot rows and leaves the needs-you row out.
#[test]
fn header_draws_bot_count() {
    let mut state = shell(80, 24);
    state.status.rows = bots(3);
    let drawn = draw(&state, 80, 24);
    assert_eq!(drawn[0], "bots · 3 bots · index 12s ago");
}

/// A stale index draws its age and the stale flag beside it.
#[test]
fn header_draws_stale_age() {
    let mut state = shell(80, 24);
    state.status.rows = bots(3);
    state.status.rows.stale = true;
    state.now = at("2026-11-25T21:15:52.000Z");
    let drawn = draw(&state, 80, 24);
    assert!(
        drawn[0].starts_with("bots · 3 bots · index 2m ago"),
        "{}",
        drawn[0]
    );
    assert!(drawn[0].ends_with("stale 2m"), "{}", drawn[0]);
}

/// A failed status read keeps the last count and draws the failure line.
#[test]
fn header_keeps_the_count_on_error() {
    let mut state = shell(80, 24);
    state.status = Remote {
        generation: 1,
        ..Remote::default()
    };
    on_fetched(
        &mut state,
        Surface::Status,
        1,
        Ok(Read {
            payload: Payload::Status(bots(3)),
            warning: None,
        }),
    );
    state.status.generation = 2;
    on_fetched(
        &mut state,
        Surface::Status,
        2,
        Err(ReadError {
            kind: FailKind::Exit(1),
            line: "bots: index locked".to_string(),
        }),
    );
    let drawn = draw(&state, 80, 24);
    assert!(drawn[0].contains("3 bots"), "{}", drawn[0]);
    assert!(drawn[0].ends_with("status failed"), "{}", drawn[0]);
    assert_eq!(drawn[21], "bots: index locked");
}

/// The status row draws the first stderr line only.
#[test]
fn status_row_draws_first_stderr_line() {
    let mut state = shell(80, 24);
    state.last_error = Some(StatusLine {
        source: Source::Read(Surface::Inbox),
        text: "bots: index locked\nsecond line".to_string(),
    });
    let drawn = draw(&state, 80, 24);
    assert_eq!(drawn[21], "bots: index locked");
}

/// The status row is blank while no failure is recorded.
#[test]
fn status_row_is_blank_without_error() {
    let drawn = draw(&shell(80, 24), 80, 24);
    assert_eq!(drawn[21], "");
}

/// The status row replaces control characters so a payload cannot move the cursor.
#[test]
fn status_row_strips_control_characters() {
    let mut state = shell(80, 24);
    state.last_error = Some(StatusLine {
        source: Source::Read(Surface::Inbox),
        text: "bots: bad\u{1b}[2Jvalue".to_string(),
    });
    let drawn = draw(&state, 80, 24);
    assert_eq!(drawn[21], "bots: bad?[2Jvalue");
    for row in &drawn {
        assert!(!row.contains('\u{1b}'), "{row:?}");
    }
}

/// The palette lists one row per bound label, and every entry scrolls into the panel.
#[test]
fn palette_lists_every_binding() {
    let mut state = shell(80, 24);
    press(&mut state, Key::Ctrl('p'));
    let entries = keys::palette_entries();
    let mut labels: Vec<&str> = Vec::new();
    for entry in &entries {
        assert!(
            !labels.contains(&entry.label),
            "two rows share the label {:?}",
            entry.label
        );
        labels.push(entry.label);
    }
    assert_eq!(keys::palette_filtered("").len(), entries.len());
    for entry in &entries {
        let drawn = draw(&state, 80, 24);
        let panel = drawn[7..=14].join("\n");
        assert!(
            panel.contains(entry.label),
            "the palette does not draw {:?}:\n{panel}",
            entry.label
        );
        press(&mut state, Key::Down);
    }
}

/// Typing narrows the palette to the labels that match, and the footer names the palette keys.
#[test]
fn palette_filters_as_the_operator_types() {
    let mut state = shell(80, 24);
    press(&mut state, Key::Ctrl('p'));
    press(&mut state, Key::Char('e'));
    press(&mut state, Key::Char('x'));
    let palette = state.palette.as_ref().expect("the palette is open");
    assert_eq!(palette.filter, "ex");
    assert_eq!(state.active_tab, Tab::Activity);

    let drawn = draw(&state, 80, 24);
    let panel = drawn[7..=14].join("\n");
    assert!(panel.contains("Ctrl+C exit"), "{panel}");
    assert!(panel.contains("Ctrl+D exit"), "{panel}");
    assert!(!panel.contains("[ ] cycle"), "{panel}");
    assert!(!panel.contains("Alt+1..4 tabs"), "{panel}");
    assert_eq!(
        drawn[22],
        "↑↓ select · type to filter · Bksp delete · Enter select · Esc close"
    );
    assert_eq!(drawn[23], "Ctrl+C close · Ctrl+D exit");

    press(&mut state, Key::Char(']'));
    let palette = state.palette.as_ref().expect("the palette is open");
    assert_eq!(state.active_tab, Tab::Activity);
    assert_eq!(palette.filter, "ex]");
}

/// Enter runs the first row bound where the palette opened, and a row bound elsewhere runs nothing.
#[test]
fn palette_enter_runs_the_selected_action() {
    let mut state = State {
        active_tab: Tab::Inbox,
        ..shell(80, 24)
    };
    press(&mut state, Key::Ctrl('p'));
    for c in ['t', 'a', 'b', 's'] {
        press(&mut state, Key::Char(c));
    }
    press(&mut state, Key::Enter);
    assert!(state.palette.is_none());
    assert_eq!(state.active_tab, Tab::Activity);

    let mut state = shell(80, 24);
    press(&mut state, Key::Ctrl('p'));
    press(&mut state, Key::Char('e'));
    press(&mut state, Key::Char('x'));
    press(&mut state, Key::Down);
    let effects = press(&mut state, Key::Enter);
    assert_eq!(effects, vec![Effect::Quit { code: 0 }]);

    // A row bound in another context, so the palette finds nothing to run here.
    const ELSEWHERE: &[Row] = &[Row {
        context: Context::List,
        key: KeyMatch::Exact(Key::Down),
        when: &[],
        action: Action::MoveDown,
        label: "down move",
        line: FooterLine::One,
    }];
    assert_eq!(
        keys::palette_action_in(
            ELSEWHERE.iter(),
            "down move",
            &[Context::Main],
            &Cond::default()
        ),
        None
    );
}

/// Esc closes the palette and leaves the context it opened from live.
#[test]
fn palette_esc_closes() {
    let mut state = State {
        active_tab: Tab::Inbox,
        ..shell(80, 24)
    };
    press(&mut state, Key::Ctrl('p'));
    let effects = press(&mut state, Key::Esc);
    assert!(effects.is_empty());
    assert!(state.palette.is_none());
    assert_eq!(state.active_tab, Tab::Inbox);
    press(&mut state, Key::Alt('1'));
    assert_eq!(state.active_tab, Tab::Activity);

    press(&mut state, Key::Char('?'));
    assert!(state.palette.is_some());
    let effects = press(&mut state, Key::Ctrl('c'));
    assert!(state.palette.is_none());
    assert!(!effects
        .iter()
        .any(|effect| matches!(effect, Effect::Quit { .. })));
}
