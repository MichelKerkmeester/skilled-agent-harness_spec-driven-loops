use crate::Options;

/// The two drawing flags, and the place the palettes and glyphs land later.
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
}
