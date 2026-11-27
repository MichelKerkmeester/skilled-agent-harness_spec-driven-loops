use crate::state::Tab;

/// Where a key row binds.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Context {
    /// The main context, outside any list.
    Main,
    /// The inbox list.
    Inbox,
    /// A list on any tab.
    List,
    /// The decision or choice overlay.
    Overlay,
    /// The command palette.
    Palette,
    /// The too-small screen.
    TooSmall,
}

/// A key after the event source maps it.
#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum Key {
    /// A plain character.
    Char(char),
    /// A character with Alt held.
    Alt(char),
    /// A character with Ctrl held.
    Ctrl(char),
    /// The Enter key.
    Enter,
    /// The Esc key.
    Esc,
    /// The Backspace key.
    Backspace,
    /// The Up arrow.
    Up,
    /// The Down arrow.
    Down,
    /// The Page Up key.
    PageUp,
    /// The Page Down key.
    PageDown,
    /// Any key the screen does not bind.
    Other,
}

/// What a row matches.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum KeyMatch {
    /// Exactly this key.
    Exact(Key),
    /// One of the digits 1 to 9.
    Digit,
    /// Any printable character.
    Printable,
}

/// One condition a row needs beyond its context.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum When {
    /// The inbox tab is the active one.
    InboxTab,
    /// The open item offers no options.
    NoOptions,
    /// The open item offers options.
    Options,
    /// The overlay is not typing.
    NotTyping,
    /// The overlay is typing.
    Typing,
    /// The open item is not gone.
    NotGone,
    /// No answer is out.
    NotSending,
}

/// The footer line a label lands on.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FooterLine {
    /// The first footer line.
    One,
    /// The second footer line.
    Two,
}

/// One row of the key map.
#[derive(Clone, Debug, PartialEq)]
pub struct Row {
    /// Where the row binds.
    pub context: Context,
    /// What it matches.
    pub key: KeyMatch,
    /// Every condition here must hold.
    pub when: &'static [When],
    /// What it does.
    pub action: Action,
    /// What the frame draws.
    pub label: &'static str,
    /// Where the footer draws it.
    pub line: FooterLine,
}

/// What a key row does.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Action {
    /// Switch to this tab.
    SelectTab(Tab),
    /// Move to the tab on the left.
    PrevTab,
    /// Move to the tab on the right.
    NextTab,
    /// Move the selection up one row.
    MoveUp,
    /// Move the selection down one row.
    MoveDown,
    /// Move the selection up one page.
    PageUp,
    /// Move the selection down one page.
    PageDown,
    /// Open the selected inbox item.
    OpenItem,
    /// Open the command palette.
    OpenPalette,
    /// Move the palette selection up one entry.
    PaletteUp,
    /// Move the palette selection down one entry.
    PaletteDown,
    /// Append a character to the palette filter.
    PaletteType(char),
    /// Delete the last character of the palette filter.
    PaletteDelete,
    /// Run the selected palette entry.
    PaletteRun,
    /// Close the overlay or the palette.
    Close,
    /// Start typing a line in the overlay.
    EnterText,
    /// Deny the open item.
    Deny,
    /// Approve the open item once.
    ApproveOnce,
    /// Pick the option at this position.
    Pick(u8),
    /// Append a character to the typed line.
    TypeChar(char),
    /// Delete the last character of the typed line.
    DeleteChar,
    /// Send the typed line.
    SendText,
    /// Leave the screen.
    Quit,
}

/// The facts a row's conditions read.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct Cond {
    /// The inbox tab is the active one.
    pub inbox_tab: bool,
    /// The open item offers options.
    pub has_options: bool,
    /// The overlay is typing.
    pub typing: bool,
    /// The open item is gone.
    pub gone: bool,
    /// An answer is out.
    pub sending: bool,
}

/// The shell's rows: the tab, palette and quit keys of the main, inbox, palette and too-small contexts.
pub const SHELL_ROWS: &[Row] = &[
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Alt('1')),
        when: &[],
        action: Action::SelectTab(Tab::Activity),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Alt('2')),
        when: &[],
        action: Action::SelectTab(Tab::Inbox),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Alt('3')),
        when: &[],
        action: Action::SelectTab(Tab::Routines),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Alt('4')),
        when: &[],
        action: Action::SelectTab(Tab::Chat),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Char('[')),
        when: &[],
        action: Action::PrevTab,
        label: "[ ] cycle",
        line: FooterLine::One,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Char(']')),
        when: &[],
        action: Action::NextTab,
        label: "[ ] cycle",
        line: FooterLine::One,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Ctrl('p')),
        when: &[],
        action: Action::OpenPalette,
        label: "Ctrl+P/? commands",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Char('?')),
        when: &[],
        action: Action::OpenPalette,
        label: "Ctrl+P/? commands",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Ctrl('c')),
        when: &[],
        action: Action::Quit,
        label: "Ctrl+C exit",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Main,
        key: KeyMatch::Exact(Key::Ctrl('d')),
        when: &[],
        action: Action::Quit,
        label: "Ctrl+D exit",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Alt('1')),
        when: &[],
        action: Action::SelectTab(Tab::Activity),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Alt('2')),
        when: &[],
        action: Action::SelectTab(Tab::Inbox),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Alt('3')),
        when: &[],
        action: Action::SelectTab(Tab::Routines),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Alt('4')),
        when: &[],
        action: Action::SelectTab(Tab::Chat),
        label: "Alt+1..4 tabs",
        line: FooterLine::One,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Char('[')),
        when: &[],
        action: Action::PrevTab,
        label: "[ ] cycle",
        line: FooterLine::One,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Char(']')),
        when: &[],
        action: Action::NextTab,
        label: "[ ] cycle",
        line: FooterLine::One,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Ctrl('p')),
        when: &[],
        action: Action::OpenPalette,
        label: "Ctrl+P/? commands",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Char('?')),
        when: &[],
        action: Action::OpenPalette,
        label: "Ctrl+P/? commands",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Ctrl('c')),
        when: &[],
        action: Action::Quit,
        label: "Ctrl+C exit",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Inbox,
        key: KeyMatch::Exact(Key::Ctrl('d')),
        when: &[],
        action: Action::Quit,
        label: "Ctrl+D exit",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Up),
        when: &[],
        action: Action::PaletteUp,
        label: "↑↓ select",
        line: FooterLine::One,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Down),
        when: &[],
        action: Action::PaletteDown,
        label: "↑↓ select",
        line: FooterLine::One,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Printable,
        when: &[],
        action: Action::PaletteType(' '),
        label: "type to filter",
        line: FooterLine::One,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Backspace),
        when: &[],
        action: Action::PaletteDelete,
        label: "Bksp delete",
        line: FooterLine::One,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Enter),
        when: &[],
        action: Action::PaletteRun,
        label: "Enter select",
        line: FooterLine::One,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Esc),
        when: &[],
        action: Action::Close,
        label: "Esc close",
        line: FooterLine::One,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Ctrl('c')),
        when: &[],
        action: Action::Close,
        label: "Ctrl+C close",
        line: FooterLine::Two,
    },
    Row {
        context: Context::Palette,
        key: KeyMatch::Exact(Key::Ctrl('d')),
        when: &[],
        action: Action::Quit,
        label: "Ctrl+D exit",
        line: FooterLine::Two,
    },
    Row {
        context: Context::TooSmall,
        key: KeyMatch::Exact(Key::Ctrl('d')),
        when: &[],
        action: Action::Quit,
        label: "Ctrl+D exit",
        line: FooterLine::Two,
    },
];

/// The panes' rows: the list moves on every data pane, and Enter opens an item on the inbox only.
pub const LIST_ROWS: &[Row] = &[
    Row {
        context: Context::List,
        key: KeyMatch::Exact(Key::Up),
        when: &[],
        action: Action::MoveUp,
        label: "↑↓ select",
        line: FooterLine::One,
    },
    Row {
        context: Context::List,
        key: KeyMatch::Exact(Key::Down),
        when: &[],
        action: Action::MoveDown,
        label: "↑↓ select",
        line: FooterLine::One,
    },
    Row {
        context: Context::List,
        key: KeyMatch::Exact(Key::PageUp),
        when: &[],
        action: Action::PageUp,
        label: "PgUp/PgDn page",
        line: FooterLine::One,
    },
    Row {
        context: Context::List,
        key: KeyMatch::Exact(Key::PageDown),
        when: &[],
        action: Action::PageDown,
        label: "PgUp/PgDn page",
        line: FooterLine::One,
    },
    Row {
        context: Context::List,
        key: KeyMatch::Exact(Key::Enter),
        when: &[When::InboxTab],
        action: Action::OpenItem,
        label: "Enter open",
        line: FooterLine::One,
    },
];

/// The overlay's rows, filled by the answer-flow work.
pub const OVERLAY_ROWS: &[Row] = &[];

/// Every row of the key map, in owner order.
pub fn rows() -> impl Iterator<Item = &'static Row> {
    SHELL_ROWS.iter().chain(LIST_ROWS).chain(OVERLAY_ROWS)
}

/// The first row whose context, key and conditions match.
pub fn resolve_in<'a>(
    rows: impl Iterator<Item = &'a Row>,
    stack: &[Context],
    key: &Key,
    cond: &Cond,
) -> Option<Action> {
    let table: Vec<&Row> = rows.collect();
    for context in stack {
        for row in &table {
            if row.context != *context {
                continue;
            }
            if !key_matches(row.key, key) {
                continue;
            }
            if !row.when.iter().all(|when| when_holds(*when, cond)) {
                continue;
            }
            return Some(action_for(row, key));
        }
    }
    None
}

/// The first row of the whole table whose context, key and conditions match.
pub fn resolve(stack: &[Context], key: &Key, cond: &Cond) -> Option<Action> {
    resolve_in(rows(), stack, key, cond)
}

/// The rows the palette lists, one per distinct label.
pub fn palette_entries_in<'a>(rows: impl Iterator<Item = &'a Row>) -> Vec<&'a Row> {
    let mut labels: Vec<&'static str> = Vec::new();
    let mut entries: Vec<&'a Row> = Vec::new();
    for row in rows {
        if !matches!(row.context, Context::Main | Context::Inbox | Context::List) {
            continue;
        }
        if labels.contains(&row.label) {
            continue;
        }
        labels.push(row.label);
        entries.push(row);
    }
    entries
}

/// The palette's entries, one per distinct label.
pub fn palette_entries() -> Vec<&'static Row> {
    palette_entries_in(rows())
}

/// The entry lines the palette panel shows at its full height, so the reducer's scroll and the drawn window agree.
pub const PALETTE_LINES: usize = 4;

/// Whether every condition a row carries holds, so the footer draws only the rows whose conditions hold.
pub fn row_holds(row: &Row, cond: &Cond) -> bool {
    row.when.iter().all(|when| when_holds(*when, cond))
}

/// The palette's entries whose label contains the filter, in table order so typing narrows the list without reordering it.
pub fn palette_filtered_in<'a>(rows: impl Iterator<Item = &'a Row>, filter: &str) -> Vec<&'a Row> {
    let needle = filter.to_lowercase();
    palette_entries_in(rows)
        .into_iter()
        .filter(|row| row.label.to_lowercase().contains(&needle))
        .collect()
}

/// The palette's entries whose label contains the filter, in table order.
pub fn palette_filtered(filter: &str) -> Vec<&'static Row> {
    palette_filtered_in(rows(), filter)
}

/// The action of the first row with this label that is bound where the palette was opened, because one label can cover several rows.
pub fn palette_action_in<'a>(
    mut rows: impl Iterator<Item = &'a Row>,
    label: &str,
    stack: &[Context],
    cond: &Cond,
) -> Option<Action> {
    rows.find(|row| row.label == label && stack.contains(&row.context) && row_holds(row, cond))
        .map(|row| row.action)
}

/// The action of the first row with this label that is bound where the palette was opened.
pub fn palette_action(label: &str, stack: &[Context], cond: &Cond) -> Option<Action> {
    palette_action_in(rows(), label, stack, cond)
}

/// Whether a row's match covers the pressed key.
fn key_matches(key_match: KeyMatch, key: &Key) -> bool {
    match key_match {
        KeyMatch::Exact(bound) => *key == bound,
        KeyMatch::Digit => matches!(key, Key::Char(c) if c.is_ascii_digit() && *c != '0'),
        KeyMatch::Printable => matches!(key, Key::Char(c) if !c.is_control()),
    }
}

/// Whether one condition holds for the given facts.
fn when_holds(when: When, cond: &Cond) -> bool {
    match when {
        When::InboxTab => cond.inbox_tab,
        When::NoOptions => !cond.has_options,
        When::Options => cond.has_options,
        When::NotTyping => !cond.typing,
        When::Typing => cond.typing,
        When::NotGone => !cond.gone,
        When::NotSending => !cond.sending,
    }
}

/// The action a matched row yields, with the pressed key filled into its payload slot.
fn action_for(row: &Row, key: &Key) -> Action {
    let Key::Char(pressed) = *key else {
        return row.action;
    };
    match (row.key, row.action) {
        (KeyMatch::Digit, Action::Pick(_)) if pressed.is_ascii_digit() && pressed != '0' => {
            Action::Pick(pressed as u8 - b'0')
        }
        (KeyMatch::Printable, Action::PaletteType(_)) => Action::PaletteType(pressed),
        (KeyMatch::Printable, Action::TypeChar(_)) => Action::TypeChar(pressed),
        _ => row.action,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    const STACK_ROWS: &[Row] = &[
        Row {
            context: Context::Main,
            key: KeyMatch::Exact(Key::Char('q')),
            when: &[],
            action: Action::Quit,
            label: "q quit",
            line: FooterLine::One,
        },
        Row {
            context: Context::List,
            key: KeyMatch::Exact(Key::Down),
            when: &[],
            action: Action::MoveDown,
            label: "down move",
            line: FooterLine::One,
        },
        Row {
            context: Context::Main,
            key: KeyMatch::Exact(Key::Down),
            when: &[],
            action: Action::NextTab,
            label: "down next",
            line: FooterLine::One,
        },
    ];

    const DIGIT_ROWS: &[Row] = &[Row {
        context: Context::Overlay,
        key: KeyMatch::Digit,
        when: &[When::Options],
        action: Action::Pick(0),
        label: "1-9 pick",
        line: FooterLine::Two,
    }];

    const PRINTABLE_ROWS: &[Row] = &[Row {
        context: Context::Palette,
        key: KeyMatch::Printable,
        when: &[],
        action: Action::PaletteType(' '),
        label: "type filter",
        line: FooterLine::One,
    }];

    const GATED_ROWS: &[Row] = &[Row {
        context: Context::Overlay,
        key: KeyMatch::Exact(Key::Char('y')),
        when: &[
            When::NoOptions,
            When::NotTyping,
            When::NotGone,
            When::NotSending,
        ],
        action: Action::ApproveOnce,
        label: "y approve once",
        line: FooterLine::Two,
    }];

    const PALETTE_ROWS: &[Row] = &[
        Row {
            context: Context::Main,
            key: KeyMatch::Exact(Key::Char('x')),
            when: &[],
            action: Action::Quit,
            label: "Ctrl+D exit",
            line: FooterLine::One,
        },
        Row {
            context: Context::Main,
            key: KeyMatch::Exact(Key::Char('q')),
            when: &[],
            action: Action::Quit,
            label: "Ctrl+D exit",
            line: FooterLine::One,
        },
        Row {
            context: Context::List,
            key: KeyMatch::Exact(Key::Up),
            when: &[],
            action: Action::MoveUp,
            label: "↑↓ select",
            line: FooterLine::One,
        },
        Row {
            context: Context::Overlay,
            key: KeyMatch::Exact(Key::Esc),
            when: &[],
            action: Action::Close,
            label: "Esc close",
            line: FooterLine::One,
        },
    ];

    #[test]
    fn resolve_walks_the_context_stack() {
        let cond = Cond::default();
        assert_eq!(
            resolve_in(
                STACK_ROWS.iter(),
                &[Context::Inbox, Context::List],
                &Key::Down,
                &cond
            ),
            Some(Action::MoveDown)
        );
        assert_eq!(
            resolve_in(
                STACK_ROWS.iter(),
                &[Context::Main, Context::List],
                &Key::Down,
                &cond
            ),
            Some(Action::NextTab)
        );
        assert_eq!(
            resolve_in(STACK_ROWS.iter(), &[Context::Inbox], &Key::Down, &cond),
            None
        );
        assert_eq!(
            resolve_in(STACK_ROWS.iter(), &[Context::Main], &Key::Char('x'), &cond),
            None
        );
    }

    #[test]
    fn digit_row_returns_the_pressed_digit() {
        let open = Cond {
            has_options: true,
            ..Cond::default()
        };
        let closed = Cond::default();
        let stack = [Context::Overlay];
        assert_eq!(
            resolve_in(DIGIT_ROWS.iter(), &stack, &Key::Char('3'), &open),
            Some(Action::Pick(3))
        );
        assert_eq!(
            resolve_in(DIGIT_ROWS.iter(), &stack, &Key::Char('9'), &open),
            Some(Action::Pick(9))
        );
        assert_eq!(
            resolve_in(DIGIT_ROWS.iter(), &stack, &Key::Char('0'), &open),
            None
        );
        assert_eq!(
            resolve_in(DIGIT_ROWS.iter(), &stack, &Key::Char('3'), &closed),
            None
        );
    }

    #[test]
    fn printable_row_returns_the_pressed_char() {
        let cond = Cond::default();
        let stack = [Context::Palette];
        assert_eq!(
            resolve_in(PRINTABLE_ROWS.iter(), &stack, &Key::Char('k'), &cond),
            Some(Action::PaletteType('k'))
        );
        assert_eq!(
            resolve_in(PRINTABLE_ROWS.iter(), &stack, &Key::Char('\u{7}'), &cond),
            None
        );
    }

    #[test]
    fn when_conditions_gate_a_row() {
        let stack = [Context::Overlay];
        let key = Key::Char('y');
        assert_eq!(
            resolve_in(GATED_ROWS.iter(), &stack, &key, &Cond::default()),
            Some(Action::ApproveOnce)
        );
        let blocked = [
            Cond {
                has_options: true,
                ..Cond::default()
            },
            Cond {
                typing: true,
                ..Cond::default()
            },
            Cond {
                gone: true,
                ..Cond::default()
            },
            Cond {
                sending: true,
                ..Cond::default()
            },
        ];
        for cond in blocked {
            assert_eq!(resolve_in(GATED_ROWS.iter(), &stack, &key, &cond), None);
        }
    }

    #[test]
    fn palette_lists_one_row_per_label() {
        let entries = palette_entries_in(PALETTE_ROWS.iter());
        assert_eq!(entries.len(), 2);
        assert_eq!(entries[0].label, "Ctrl+D exit");
        assert_eq!(entries[1].label, "↑↓ select");
    }

    /// The palette filter keeps the matching labels in table order and ignores case.
    #[test]
    fn palette_filter_keeps_matching_labels() {
        let labels = |filter: &str| -> Vec<&'static str> {
            palette_filtered(filter)
                .into_iter()
                .map(|row| row.label)
                .collect()
        };
        assert_eq!(labels("ex"), ["Ctrl+C exit", "Ctrl+D exit"]);
        assert_eq!(labels("EX"), ["Ctrl+C exit", "Ctrl+D exit"]);
        assert_eq!(palette_filtered("").len(), palette_entries().len());
        assert_eq!(labels("tabs"), ["Alt+1..4 tabs"]);
        assert!(palette_filtered("zzz").is_empty());
    }

    /// Enter runs the first row in table order that is bound where the palette was opened.
    #[test]
    fn palette_action_takes_the_first_bound_row() {
        let cond = Cond::default();
        assert_eq!(
            palette_action("Alt+1..4 tabs", &[Context::Inbox, Context::List], &cond),
            Some(Action::SelectTab(Tab::Activity))
        );
        assert_eq!(
            palette_action("Alt+1..4 tabs", &[Context::Main], &cond),
            Some(Action::SelectTab(Tab::Activity))
        );
        const LIST_ONLY: &[Row] = &[Row {
            context: Context::List,
            key: KeyMatch::Exact(Key::Down),
            when: &[],
            action: Action::MoveDown,
            label: "down move",
            line: FooterLine::One,
        }];
        assert_eq!(
            palette_action_in(LIST_ONLY.iter(), "down move", &[Context::Main], &cond),
            None
        );
        assert_eq!(
            palette_action_in(
                LIST_ONLY.iter(),
                "down move",
                &[Context::Main, Context::List],
                &cond
            ),
            Some(Action::MoveDown)
        );
    }

    /// A row holds only when every condition it carries holds, and a row with none always holds.
    #[test]
    fn row_holds_reads_the_conditions() {
        let gated = Row {
            context: Context::Main,
            key: KeyMatch::Exact(Key::Char('i')),
            when: &[When::InboxTab],
            action: Action::OpenItem,
            label: "i open",
            line: FooterLine::One,
        };
        assert!(row_holds(
            &gated,
            &Cond {
                inbox_tab: true,
                ..Cond::default()
            }
        ));
        assert!(!row_holds(&gated, &Cond::default()));
        let open = Row {
            context: Context::Main,
            key: KeyMatch::Exact(Key::Char('i')),
            when: &[],
            action: Action::OpenItem,
            label: "i open",
            line: FooterLine::One,
        };
        assert!(row_holds(&open, &Cond::default()));
    }

    /// Every row carries a label, and the shell's rows stay inside the four shell contexts.
    #[test]
    fn every_row_has_a_label() {
        for row in rows() {
            let key = row.key;
            assert!(!row.label.is_empty(), "row {key:?} has no label");
        }
        for row in SHELL_ROWS {
            let context = row.context;
            let key = row.key;
            assert!(
                matches!(
                    context,
                    Context::Main | Context::Inbox | Context::Palette | Context::TooSmall
                ),
                "shell row {key:?} sits in {context:?}"
            );
        }
        assert_eq!(SHELL_ROWS.len(), 29);
    }

    /// Alt plus a digit selects the tab that digit numbers, on the main and the inbox stacks.
    #[test]
    fn alt_2_selects_inbox() {
        let cond = Cond::default();
        let stacks: [&[Context]; 2] = [
            &[Context::Main, Context::List],
            &[Context::Inbox, Context::List],
        ];
        for stack in stacks {
            assert_eq!(
                resolve(stack, &Key::Alt('2'), &cond),
                Some(Action::SelectTab(Tab::Inbox))
            );
            assert_eq!(
                resolve(stack, &Key::Alt('1'), &cond),
                Some(Action::SelectTab(Tab::Activity))
            );
            assert_eq!(
                resolve(stack, &Key::Alt('3'), &cond),
                Some(Action::SelectTab(Tab::Routines))
            );
            assert_eq!(
                resolve(stack, &Key::Alt('4'), &cond),
                Some(Action::SelectTab(Tab::Chat))
            );
        }
    }

    /// The right bracket moves to the next tab on the main and the inbox stacks.
    #[test]
    fn bracket_right_cycles_forward() {
        let cond = Cond::default();
        assert_eq!(
            resolve(&[Context::Main, Context::List], &Key::Char(']'), &cond),
            Some(Action::NextTab)
        );
        assert_eq!(
            resolve(&[Context::Inbox, Context::List], &Key::Char(']'), &cond),
            Some(Action::NextTab)
        );
    }

    /// The left bracket moves to the previous tab on the main and the inbox stacks.
    #[test]
    fn bracket_left_cycles_back() {
        let cond = Cond::default();
        assert_eq!(
            resolve(&[Context::Main, Context::List], &Key::Char('['), &cond),
            Some(Action::PrevTab)
        );
        assert_eq!(
            resolve(&[Context::Inbox, Context::List], &Key::Char('['), &cond),
            Some(Action::PrevTab)
        );
    }

    /// Ctrl+P and the question mark open the palette from the main, the inbox and the chat stacks.
    #[test]
    fn ctrl_p_opens_palette() {
        let cond = Cond::default();
        let stacks: [&[Context]; 3] = [
            &[Context::Main, Context::List],
            &[Context::Inbox, Context::List],
            &[Context::Main],
        ];
        for stack in stacks {
            assert_eq!(
                resolve(stack, &Key::Ctrl('p'), &cond),
                Some(Action::OpenPalette)
            );
            assert_eq!(
                resolve(stack, &Key::Char('?'), &cond),
                Some(Action::OpenPalette)
            );
        }
    }

    /// Ctrl+D quits from every context the shell binds, the too-small screen included.
    #[test]
    fn ctrl_d_quits() {
        let cond = Cond::default();
        let stacks: [&[Context]; 5] = [
            &[Context::Main],
            &[Context::Main, Context::List],
            &[Context::Inbox, Context::List],
            &[Context::Palette],
            &[Context::TooSmall],
        ];
        for stack in stacks {
            assert_eq!(resolve(stack, &Key::Ctrl('d'), &cond), Some(Action::Quit));
        }
    }

    /// Ctrl+C quits outside the palette, closes the palette, and is unbound on the too-small screen.
    #[test]
    fn ctrl_c_quits_and_emits_no_answer() {
        let cond = Cond::default();
        assert_eq!(
            resolve(&[Context::Main, Context::List], &Key::Ctrl('c'), &cond),
            Some(Action::Quit)
        );
        assert_eq!(
            resolve(&[Context::Inbox, Context::List], &Key::Ctrl('c'), &cond),
            Some(Action::Quit)
        );
        assert_eq!(
            resolve(&[Context::Palette], &Key::Ctrl('c'), &cond),
            Some(Action::Close)
        );
        assert_eq!(resolve(&[Context::TooSmall], &Key::Ctrl('c'), &cond), None);

        // A 0x0 size is the too-small context, where Ctrl+C is unbound, so the size is set here.
        let mut state = crate::state::State {
            size: crate::state::Size { cols: 80, rows: 24 },
            ..crate::state::State::default()
        };
        let effects = crate::state::update(&mut state, crate::state::Msg::Key(Key::Ctrl('c')));
        assert_eq!(effects, vec![crate::state::Effect::Quit { code: 0 }]);
        assert!(!effects
            .iter()
            .any(|effect| matches!(effect, crate::state::Effect::Answer { .. })));
    }

    /// Typing in the palette filters the list, so a key that binds outside it never fires while the filter is open.
    #[test]
    fn palette_filter_pauses_shortcuts() {
        // A 0x0 size is the too-small context, where only Ctrl+D is bound, so the size is set here.
        let mut state = crate::state::State {
            size: crate::state::Size { cols: 80, rows: 24 },
            ..crate::state::State::default()
        };
        crate::state::update(&mut state, crate::state::Msg::Key(Key::Ctrl('p')));
        for c in ['e', 'x', ']', '[', '?'] {
            crate::state::update(&mut state, crate::state::Msg::Key(Key::Char(c)));
        }
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.filter, "ex][?");
        assert_eq!(state.active_tab, Tab::Activity);
        assert_eq!(
            resolve(&[Context::Palette], &Key::Char(']'), &Cond::default()),
            Some(Action::PaletteType(']'))
        );

        crate::state::update(&mut state, crate::state::Msg::Key(Key::Backspace));
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.filter, "ex][");
    }

    /// The palette's arrows move the selection, stop at both ends and keep the selection inside the drawn window.
    #[test]
    fn palette_up_and_down_move_the_selection() {
        // A 0x0 size is the too-small context, where only Ctrl+D is bound, so the size is set here.
        let mut state = crate::state::State {
            size: crate::state::Size { cols: 80, rows: 24 },
            ..crate::state::State::default()
        };
        crate::state::update(&mut state, crate::state::Msg::Key(Key::Ctrl('p')));
        let count = palette_filtered("").len();

        crate::state::update(&mut state, crate::state::Msg::Key(Key::Down));
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.selected, 1);

        for _ in 0..10 {
            crate::state::update(&mut state, crate::state::Msg::Key(Key::Down));
        }
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.selected, count - 1);
        assert!(palette.scroll <= palette.selected);
        assert!(palette.selected < palette.scroll + PALETTE_LINES);

        crate::state::update(&mut state, crate::state::Msg::Key(Key::Up));
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.selected, count - 2);

        for _ in 0..10 {
            crate::state::update(&mut state, crate::state::Msg::Key(Key::Up));
        }
        let palette = state.palette.as_ref().expect("the palette is open");
        assert_eq!(palette.selected, 0);
        assert_eq!(palette.scroll, 0);
    }

    /// The list keys move each pane's selection by its row key, and the footer names them where they bind.
    #[test]
    fn list_keys_move_the_selection() {
        use crate::model::InboxItem;
        use crate::state::{on_fetched, update, ItemId, Msg, Payload, Read, Size, State, Surface};

        let mut state = State {
            size: Size { cols: 80, rows: 24 },
            active_tab: Tab::Inbox,
            ..State::default()
        };
        state.inbox.generation = 1;
        let items: Vec<InboxItem> = (0..20)
            .map(|n| InboxItem {
                id: ItemId(format!("i{n}")),
                ..InboxItem::default()
            })
            .collect();
        on_fetched(
            &mut state,
            Surface::Inbox,
            1,
            Ok(Read {
                payload: Payload::Inbox(items),
                warning: None,
            }),
        );
        assert_eq!(state.inbox_view.selected, Some(ItemId("i0".to_string())));
        assert_eq!(state.inbox_view.anchor, 0);

        update(&mut state, Msg::Key(Key::Down));
        assert_eq!(state.inbox_view.selected, Some(ItemId("i1".to_string())));
        update(&mut state, Msg::Key(Key::Up));
        assert_eq!(state.inbox_view.selected, Some(ItemId("i0".to_string())));
        update(&mut state, Msg::Key(Key::Up));
        assert_eq!(state.inbox_view.selected, Some(ItemId("i0".to_string())));

        update(&mut state, Msg::Key(Key::PageDown));
        assert_eq!(state.inbox_view.selected, Some(ItemId("i15".to_string())));
        assert_eq!(state.inbox_view.scroll, 1);
        update(&mut state, Msg::Key(Key::PageDown));
        assert_eq!(state.inbox_view.selected, Some(ItemId("i19".to_string())));
        update(&mut state, Msg::Key(Key::PageUp));
        assert_eq!(state.inbox_view.selected, Some(ItemId("i4".to_string())));

        assert_eq!(
            resolve(
                &[Context::Inbox, Context::List],
                &Key::Enter,
                &Cond {
                    inbox_tab: true,
                    ..Cond::default()
                }
            ),
            Some(Action::OpenItem)
        );
        assert_eq!(
            resolve(
                &[Context::Main, Context::List],
                &Key::Enter,
                &Cond::default()
            ),
            None
        );

        assert_eq!(
            crate::view::footer::labels(&state, FooterLine::One),
            [
                "Alt+1..4 tabs",
                "[ ] cycle",
                "↑↓ select",
                "PgUp/PgDn page",
                "Enter open"
            ]
        );

        state.active_tab = Tab::Activity;
        assert_eq!(
            crate::view::footer::labels(&state, FooterLine::One),
            ["Alt+1..4 tabs", "[ ] cycle", "↑↓ select", "PgUp/PgDn page"]
        );

        state.active_tab = Tab::Routines;
        assert_eq!(
            crate::view::footer::labels(&state, FooterLine::One),
            ["Alt+1..4 tabs", "[ ] cycle", "↑↓ select", "PgUp/PgDn page"]
        );

        state.active_tab = Tab::Chat;
        assert_eq!(
            crate::view::footer::labels(&state, FooterLine::One),
            ["Alt+1..4 tabs", "[ ] cycle"]
        );

        let before = (
            state.activity_view.clone(),
            state.inbox_view.clone(),
            state.routines_view.clone(),
        );
        update(&mut state, Msg::Key(Key::Down));
        assert_eq!(
            (
                state.activity_view.clone(),
                state.inbox_view.clone(),
                state.routines_view.clone()
            ),
            before
        );
    }
}
