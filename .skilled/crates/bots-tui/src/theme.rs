use ratatui::style::Color;

use crate::model::RunState;
use crate::Options;

/// The two drawing flags, and the palettes and glyphs they select.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct Theme {
    /// Draw without colour.
    pub mono: bool,
    /// Draw with ASCII glyphs only.
    pub ascii: bool,
}

impl Theme {
    /// Copies the two drawing flags out of the options.
    pub fn new(opts: &Options) -> Theme {
        Theme {
            mono: opts.mono,
            ascii: opts.ascii,
        }
    }

    /// The palette this theme draws with.
    pub fn colors(&self) -> Colors {
        if self.mono {
            MONO
        } else {
            SYSTEM
        }
    }

    /// The marker glyph for a row state, in this theme's glyph column.
    pub fn marker(&self, state: &RunState) -> &'static str {
        marker(state, self.ascii)
    }

    /// The glyph that marks the focused row.
    pub fn focus_mark(&self) -> &'static str {
        if self.ascii {
            ">"
        } else {
            "\u{203a}"
        }
    }

    /// The glyph that draws a horizontal rule.
    pub fn rule(&self) -> &'static str {
        if self.ascii {
            "-"
        } else {
            "\u{2500}"
        }
    }
}

/// One colour per meaning the screen draws.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Colors {
    /// Ordinary text.
    pub text: Color,
    /// Secondary text.
    pub dim: Color,
    /// The accent the shell uses for focus.
    pub accent: Color,
    /// The header's stale warning.
    pub stale: Color,
    /// An error.
    pub error: Color,
    /// A run waiting for an answer.
    pub needs_you: Color,
    /// A run in progress.
    pub working: Color,
    /// A run that has not started.
    pub scheduled: Color,
    /// A run that finished.
    pub done: Color,
    /// A run that was stopped.
    pub stopped: Color,
    /// A run that failed.
    pub failed: Color,
    /// A run that repeats on a schedule.
    pub recurring: Color,
    /// A state word this build does not know.
    pub unknown: Color,
}

impl Colors {
    /// The thirteen colours in declaration order, so a caller can sweep them all.
    pub fn all(&self) -> [Color; 13] {
        [
            self.text,
            self.dim,
            self.accent,
            self.stale,
            self.error,
            self.needs_you,
            self.working,
            self.scheduled,
            self.done,
            self.stopped,
            self.failed,
            self.recurring,
            self.unknown,
        ]
    }
}

/// The palette a colour terminal draws.
pub const SYSTEM: Colors = Colors {
    text: Color::Reset,
    dim: Color::DarkGray,
    accent: Color::Cyan,
    stale: Color::Yellow,
    error: Color::Red,
    needs_you: Color::Yellow,
    working: Color::Cyan,
    scheduled: Color::Blue,
    done: Color::Green,
    stopped: Color::DarkGray,
    failed: Color::Red,
    recurring: Color::Magenta,
    unknown: Color::Reset,
};

/// In Mono every colour resets, so the glyph and the word carry every meaning.
pub const MONO: Colors = Colors {
    text: Color::Reset,
    dim: Color::Reset,
    accent: Color::Reset,
    stale: Color::Reset,
    error: Color::Reset,
    needs_you: Color::Reset,
    working: Color::Reset,
    scheduled: Color::Reset,
    done: Color::Reset,
    stopped: Color::Reset,
    failed: Color::Reset,
    recurring: Color::Reset,
    unknown: Color::Reset,
};

/// One row state's marker in both glyph columns.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Glyph {
    /// The state word the row belongs to.
    pub state: &'static str,
    /// The marker a Unicode terminal draws.
    pub unicode: &'static str,
    /// The marker an ASCII terminal draws.
    pub ascii: &'static str,
}

/// The one glyph table, so the markers and their fallback are defined once.
pub const GLYPHS: [Glyph; 8] = [
    Glyph {
        state: "working",
        unicode: "\u{b7}",
        ascii: "*",
    },
    Glyph {
        state: "done",
        unicode: "\u{2713}",
        ascii: "+",
    },
    Glyph {
        state: "failed",
        unicode: "\u{2717}",
        ascii: "x",
    },
    Glyph {
        state: "needs_you",
        unicode: "!",
        ascii: "!",
    },
    Glyph {
        state: "stopped",
        unicode: "\u{2013}",
        ascii: "-",
    },
    Glyph {
        state: "scheduled",
        unicode: "\u{25cb}",
        ascii: "o",
    },
    Glyph {
        state: "recurring",
        unicode: "\u{21bb}",
        ascii: "r",
    },
    Glyph {
        state: "unknown",
        unicode: "?",
        ascii: "?",
    },
];

/// The one place a row state becomes a character.
pub fn marker(state: &RunState, ascii: bool) -> &'static str {
    let row = match state {
        RunState::Working => GLYPHS[0],
        RunState::Done => GLYPHS[1],
        RunState::Failed => GLYPHS[2],
        RunState::NeedsYou => GLYPHS[3],
        RunState::Stopped => GLYPHS[4],
        RunState::Scheduled => GLYPHS[5],
        RunState::Recurring => GLYPHS[6],
        RunState::Unknown(_) => GLYPHS[7],
    };
    if ascii {
        row.ascii
    } else {
        row.unicode
    }
}

/// The colour a row state draws in.
pub fn state_color(colors: &Colors, state: &RunState) -> Color {
    match state {
        RunState::NeedsYou => colors.needs_you,
        RunState::Working => colors.working,
        RunState::Scheduled => colors.scheduled,
        RunState::Done => colors.done,
        RunState::Stopped => colors.stopped,
        RunState::Failed => colors.failed,
        RunState::Recurring => colors.recurring,
        RunState::Unknown(_) => colors.unknown,
    }
}

/// Replaces every control character and every bidirectional override with a question mark.
///
/// Runtime text passes through here before it is drawn, so a payload cannot move the cursor
/// or reorder a cell.
pub fn printable(text: &str) -> String {
    text.chars()
        .map(|c| {
            if c.is_control() || matches!(c, '\u{202a}'..='\u{202e}' | '\u{2066}'..='\u{2069}') {
                '?'
            } else {
                c
            }
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Every row state the screen can draw, so a sweep covers the whole table.
    fn every_state() -> [RunState; 8] {
        [
            RunState::NeedsYou,
            RunState::Working,
            RunState::Scheduled,
            RunState::Done,
            RunState::Stopped,
            RunState::Failed,
            RunState::Recurring,
            RunState::Unknown("some-new-state".to_string()),
        ]
    }

    /// Mono resets all thirteen colours and the colour palette keeps at least one.
    #[test]
    fn mono_resets_every_colour() {
        for color in MONO.all() {
            assert_eq!(color, Color::Reset);
        }
        assert_eq!(
            Theme::new(&crate::Options {
                mono: true,
                ascii: false,
            })
            .colors(),
            MONO
        );
        assert_eq!(
            Theme::new(&crate::Options {
                mono: false,
                ascii: false,
            })
            .colors(),
            SYSTEM
        );
        assert!(SYSTEM.all().iter().any(|color| *color != Color::Reset));
    }

    /// The ASCII column holds one ASCII character per row, in table order.
    #[test]
    fn ascii_glyphs_are_ascii() {
        for glyph in GLYPHS {
            assert!(glyph.ascii.is_ascii(), "{} must be ASCII", glyph.state);
            assert_eq!(
                glyph.ascii.chars().count(),
                1,
                "{} must be one char",
                glyph.state
            );
        }
        let joined: String = GLYPHS.iter().map(|glyph| glyph.ascii).collect();
        assert_eq!(joined, "*+x!-or?");
    }

    /// Every Unicode marker is one distinct character with an ASCII fallback beside it.
    #[test]
    fn every_marker_has_an_ascii_counterpart() {
        assert_eq!(GLYPHS.len(), 8);
        for glyph in GLYPHS {
            assert!(!glyph.unicode.is_empty(), "{} has no marker", glyph.state);
            assert_eq!(
                glyph.unicode.chars().count(),
                1,
                "{} must be one char",
                glyph.state
            );
            assert!(!glyph.ascii.is_empty(), "{} has no fallback", glyph.state);
        }
        let joined: String = GLYPHS.iter().map(|glyph| glyph.unicode).collect();
        assert_eq!(joined, "\u{b7}\u{2713}\u{2717}!\u{2013}\u{25cb}\u{21bb}?");
        for (index, glyph) in GLYPHS.iter().enumerate() {
            for other in GLYPHS.iter().skip(index + 1) {
                assert_ne!(glyph.unicode, other.unicode);
            }
        }
    }

    /// Each state draws exactly one glyph, and the pair is the one the table names.
    #[test]
    fn marker_draws_one_glyph_per_state() {
        for state in every_state() {
            assert_eq!(marker(&state, false).chars().count(), 1);
            assert_eq!(marker(&state, true).chars().count(), 1);
            assert!(marker(&state, true).is_ascii());
        }
        assert_eq!(marker(&RunState::Working, false), "\u{b7}");
        assert_eq!(marker(&RunState::Working, true), "*");
        assert_eq!(marker(&RunState::Done, false), "\u{2713}");
        assert_eq!(marker(&RunState::Done, true), "+");
        assert_eq!(marker(&RunState::Failed, false), "\u{2717}");
        assert_eq!(marker(&RunState::Failed, true), "x");
        assert_eq!(marker(&RunState::NeedsYou, false), "!");
        assert_eq!(marker(&RunState::NeedsYou, true), "!");
        assert_eq!(marker(&RunState::Stopped, false), "\u{2013}");
        assert_eq!(marker(&RunState::Stopped, true), "-");
        assert_eq!(marker(&RunState::Scheduled, false), "\u{25cb}");
        assert_eq!(marker(&RunState::Scheduled, true), "o");
        assert_eq!(marker(&RunState::Recurring, false), "\u{21bb}");
        assert_eq!(marker(&RunState::Recurring, true), "r");
        assert_eq!(
            marker(&RunState::Unknown("some-new-state".to_string()), false),
            "?"
        );
        assert_eq!(
            marker(&RunState::Unknown("some-new-state".to_string()), true),
            "?"
        );
    }

    /// Control characters and bidirectional overrides become question marks, the rest stays.
    #[test]
    fn printable_replaces_control_characters() {
        assert_eq!(printable("bots: bad\u{1b}[2Jvalue"), "bots: bad?[2Jvalue");
        assert_eq!(printable("a\nb\rc\td"), "a?b?c?d");
        assert_eq!(printable("x\u{202e}y\u{2066}z"), "x?y?z");
        assert_eq!(printable("caf\u{e9} \u{2713}"), "caf\u{e9} \u{2713}");
    }

    /// The focus mark and the rule follow the ASCII flag and nothing else.
    #[test]
    fn focus_mark_and_rule_follow_ascii() {
        let unicode = Theme {
            mono: false,
            ascii: false,
        };
        assert_eq!(unicode.focus_mark(), "\u{203a}");
        assert_eq!(unicode.rule(), "\u{2500}");
        let ascii = Theme {
            mono: false,
            ascii: true,
        };
        assert_eq!(ascii.focus_mark(), ">");
        assert_eq!(ascii.rule(), "-");
    }

    /// Mono changes colour only, so the System and Mono frames draw the same symbols and no
    /// meaning rides on colour alone.
    #[test]
    fn mono_draws_the_same_symbols() {
        let colour = Theme {
            mono: false,
            ascii: false,
        };
        let mono = Theme {
            mono: true,
            ascii: false,
        };
        for state in every_state() {
            assert_eq!(mono.marker(&state), colour.marker(&state));
        }
        assert_eq!(mono.focus_mark(), colour.focus_mark());
        assert_eq!(mono.rule(), colour.rule());

        // A sized state on the activity tab, with a stale index and one failure line, so the
        // frame draws every band the shell owns rather than an empty screen.
        let state = crate::state::State {
            size: crate::state::Size { cols: 80, rows: 24 },
            active_tab: crate::state::Tab::Activity,
            status: crate::state::Remote {
                rows: crate::model::StatusPayload {
                    updated_at: Some("2026-11-25T21:13:52.000Z".to_string()),
                    stale: true,
                    rows: vec![
                        crate::model::StatusRow {
                            kind: "bot".to_string(),
                            ..crate::model::StatusRow::default()
                        },
                        crate::model::StatusRow {
                            kind: "bot".to_string(),
                            ..crate::model::StatusRow::default()
                        },
                    ],
                    ..crate::model::StatusPayload::default()
                },
                ..crate::state::Remote::default()
            },
            now: crate::model::parse_utc("2026-11-25T21:15:52.000Z").expect("the clock parses"),
            last_error: Some(crate::state::StatusLine {
                source: crate::state::Source::Read(crate::state::Surface::Status),
                text: "bots: index locked".to_string(),
            }),
            ..crate::state::State::default()
        };

        let drawn = |options: crate::Options| {
            let mut terminal = ratatui::Terminal::new(ratatui::backend::TestBackend::new(80, 24))
                .expect("the test terminal opens");
            terminal
                .draw(|frame| crate::view::draw(frame, &state, &options))
                .expect("the frame draws");
            terminal.backend().buffer().clone()
        };
        let system = drawn(crate::Options {
            mono: false,
            ascii: false,
        });
        let plain = drawn(crate::Options {
            mono: true,
            ascii: false,
        });

        let mut coloured = false;
        for y in 0..24u16 {
            for x in 0..80u16 {
                assert_eq!(
                    plain[(x, y)].symbol(),
                    system[(x, y)].symbol(),
                    "the symbol at {x},{y}"
                );
                assert_eq!(plain[(x, y)].fg, Color::Reset, "the fg at {x},{y}");
                assert_eq!(plain[(x, y)].bg, Color::Reset, "the bg at {x},{y}");
                if system[(x, y)].fg != Color::Reset {
                    coloured = true;
                }
            }
        }
        assert!(coloured, "the System frame draws at least one colour");

        let header: String = (0..80u16).map(|x| system[(x, 0)].symbol()).collect();
        assert!(header.contains("stale 2m"), "{header}");
    }
}
