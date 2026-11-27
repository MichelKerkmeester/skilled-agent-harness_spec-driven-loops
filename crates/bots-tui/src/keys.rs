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

/// The shell's rows, filled by the shell work.
pub const SHELL_ROWS: &[Row] = &[];

/// The panes' rows, filled by the list work.
pub const LIST_ROWS: &[Row] = &[];

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

    #[test]
    fn rows_are_empty_until_filled() {
        assert_eq!(rows().count(), 0);
        assert!(palette_entries().is_empty());
    }
}
