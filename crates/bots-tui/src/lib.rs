//! The terminal screen for skilled bots.
//! It reads the bots CLI's JSON verbs and draws them, one frame at a time.

pub mod app;
pub mod cli;
pub mod data;
pub mod event;
pub mod keys;
pub mod model;
pub mod state;
pub mod terminal;
pub mod theme;
pub mod view;

use std::path::PathBuf;
use std::sync::Arc;

/// The payload contract major this binary reads.
pub const CONTRACT: u32 = 1;

/// The parsed command line.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct Args {
    /// The checkout the bots CLI reads.
    pub repo: PathBuf,
    /// The skilled tree the bots CLI lives in.
    pub skilled_tree: PathBuf,
    /// Draw without colour.
    pub mono: bool,
    /// Draw with ASCII glyphs only.
    pub ascii: bool,
    /// Print the version line and leave.
    pub version: bool,
}

/// The two drawing flags the view needs.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub struct Options {
    /// Draw without colour.
    pub mono: bool,
    /// Draw with ASCII glyphs only.
    pub ascii: bool,
}

impl Args {
    /// Copies the two drawing flags out of the parsed arguments.
    pub fn options(&self) -> Options {
        Options {
            mono: self.mono,
            ascii: self.ascii,
        }
    }
}

/// The one line `--version` prints.
pub fn version_line() -> String {
    format!(
        "bots-ui {} contract {}",
        env!("CARGO_PKG_VERSION"),
        CONTRACT
    )
}

/// Parses argv into the arguments the loop needs.
///
/// The binary reads no environment variable. The `bots ui` verb reads the no-colour setting
/// and passes `--mono`, so every flag here comes from argv alone.
pub fn parse_args(argv: &[String]) -> Result<Args, String> {
    let mut args = Args::default();
    let mut rest = argv.iter();
    while let Some(option) = rest.next() {
        match option.as_str() {
            "--repo" => args.repo = PathBuf::from(next_value(&mut rest, "--repo")?),
            "--skilled-tree" => {
                args.skilled_tree = PathBuf::from(next_value(&mut rest, "--skilled-tree")?)
            }
            "--mono" => args.mono = true,
            "--ascii" => args.ascii = true,
            "--version" => args.version = true,
            other => return Err(format!("unknown option: {other}")),
        }
    }

    // A version request answers before the loop needs a checkout, so the two paths are only
    // required when the screen is about to run.
    if !args.version {
        if args.repo.as_os_str().is_empty() {
            return Err("--repo is required".to_string());
        }
        if args.skilled_tree.as_os_str().is_empty() {
            return Err("--skilled-tree is required".to_string());
        }
    }

    Ok(args)
}

/// Takes the argument that follows an option, refusing a missing one and a flag.
fn next_value<'a>(
    rest: &mut std::slice::Iter<'a, String>,
    option: &str,
) -> Result<&'a str, String> {
    match rest.next() {
        Some(value) if !value.starts_with("--") => Ok(value.as_str()),
        _ => Err(format!("{option} needs a value")),
    }
}

/// Runs the screen and returns its exit code.
///
/// The guard restores the terminal however the loop leaves, so it outlives the terminal and
/// is dropped last.
pub fn run(args: Args) -> i32 {
    let guard = match terminal::Guard::install(Arc::new(terminal::CrosstermModes)) {
        Ok(guard) => guard,
        Err(error) => {
            eprintln!("bots-ui: the terminal did not open: {error}");
            return 1;
        }
    };

    let mut terminal =
        match ratatui::Terminal::new(ratatui::backend::CrosstermBackend::new(std::io::stdout())) {
            Ok(terminal) => terminal,
            Err(error) => {
                drop(guard);
                eprintln!("bots-ui: the terminal did not open: {error}");
                return 1;
            }
        };

    let code = app::run(
        &mut terminal,
        Box::new(event::TerminalEvents::new(Box::new(event::SystemClock))),
        cli::Program::production(&args.skilled_tree, &args.repo),
        args.options(),
    );

    drop(terminal);
    drop(guard);
    code
}

/// The whole binary, from argv to exit code.
pub fn main_with(argv: &[String]) -> i32 {
    match parse_args(argv) {
        Ok(args) => {
            if args.version {
                println!("{}", version_line());
                0
            } else {
                run(args)
            }
        }
        Err(message) => {
            eprintln!("bots-ui: {message}");
            eprintln!(
                "usage: bots-ui --repo <path> --skilled-tree <path> [--mono] [--ascii] | --version"
            );
            2
        }
    }
}

#[cfg(test)]
mod args {
    use super::*;

    /// The argv a case passes, so the case reads as the command line it names.
    fn strings(items: &[&str]) -> Vec<String> {
        items.iter().map(|item| item.to_string()).collect()
    }

    #[test]
    fn version_flag_prints_the_contract() {
        let parsed = parse_args(&strings(&["--version"])).expect("--version parses");
        assert!(parsed.version);
        assert!(version_line().ends_with(" contract 1"));
        assert_eq!(main_with(&strings(&["--version"])), 0);
    }

    #[test]
    fn mono_flag_selects_mono() {
        let parsed = parse_args(&strings(&[
            "--repo",
            "/r",
            "--skilled-tree",
            "/s",
            "--mono",
        ]))
        .expect("the flags parse");
        assert_eq!(parsed.repo, PathBuf::from("/r"));
        assert_eq!(parsed.skilled_tree, PathBuf::from("/s"));
        let options = parsed.options();
        assert!(options.mono);
        assert!(!options.ascii);
    }

    #[test]
    fn ascii_flag_selects_the_ascii_glyphs() {
        let parsed = parse_args(&strings(&[
            "--repo",
            "/r",
            "--skilled-tree",
            "/s",
            "--ascii",
        ]))
        .expect("the flags parse");
        let options = parsed.options();
        assert!(options.ascii);
        assert!(theme::Theme::new(&options).ascii);
    }

    #[test]
    fn unknown_option_is_a_usage_error() {
        assert_eq!(
            parse_args(&strings(&["--bogus"])),
            Err("unknown option: --bogus".to_string())
        );
        assert_eq!(main_with(&strings(&["--bogus"])), 2);
    }

    #[test]
    fn repo_and_tree_are_required() {
        assert_eq!(parse_args(&[]), Err("--repo is required".to_string()));
        assert_eq!(
            parse_args(&strings(&["--repo", "/r"])),
            Err("--skilled-tree is required".to_string())
        );
        assert_eq!(
            parse_args(&strings(&["--repo", "--mono"])),
            Err("--repo needs a value".to_string())
        );
    }
}
