// Builds a fresh fixture folder and the program that runs the fake bots CLI.
// Each test gets its own folder and log, so two tests never read each other's calls.

use std::path::PathBuf;
use std::time::Duration;

use bots_tui::cli::Program;

/// The fake bots CLI the tests run.
pub const FIXTURE: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots");

/// One test's fixture folder, its call log and the program that writes it.
pub struct Fixture {
    /// The folder the program passes as `--repo`.
    pub dir: PathBuf,
    /// The file the fake CLI appends each call to.
    pub log: PathBuf,
    /// The program every call starts from.
    pub program: Program,
}

/// Makes a fresh fixture folder for one test.
///
/// The folder is named after the process and the test, so a rerun starts from
/// an empty log rather than from the calls the last run left behind.
pub fn fixture(name: &str, scenario: &str) -> Fixture {
    let dir = std::env::temp_dir().join(format!("bots-tui-it-{}-{}", std::process::id(), name));
    if dir.exists() {
        let _ = std::fs::remove_dir_all(&dir);
    }
    let _ = std::fs::create_dir_all(&dir);

    let log = dir.join("argv.log");
    let program = Program {
        program: "bash".into(),
        leading: vec![
            FIXTURE.into(),
            "--fixture-log".into(),
            log.to_string_lossy().into_owned(),
            "--fixture-scenario".into(),
            scenario.into(),
        ],
        repo: dir.clone(),
        read_timeout: Duration::from_secs(10),
        answer_timeout: Duration::from_secs(30),
    };

    Fixture { dir, log, program }
}

impl Fixture {
    /// The calls the fake CLI has logged, empty before the first call.
    pub fn logged(&self) -> Vec<String> {
        match std::fs::read_to_string(&self.log) {
            Ok(text) => text.lines().map(str::to_string).collect(),
            Err(_) => Vec::new(),
        }
    }
}
