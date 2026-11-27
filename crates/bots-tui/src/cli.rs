use std::io::Read as _;
use std::os::unix::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{Duration, Instant};

use crate::model::{ActivityPayload, InboxPayload, RoutinesPayload, StatusPayload};
use crate::state::{
    AnswerError, AnswerOk, FailKind, ItemId, Payload, Read, ReadError, Scope, Surface,
};

/// How often the wait loop looks at a child.
const POLL: Duration = Duration::from_millis(10);

/// The program and the arguments every call starts with.
#[derive(Clone, Debug, PartialEq)]
pub struct Program {
    /// The program to run.
    pub program: PathBuf,
    /// The arguments that come before the verb.
    pub leading: Vec<String>,
    /// The checkout passed as `--repo` on every call.
    pub repo: PathBuf,
    /// How long a read may run.
    pub read_timeout: Duration,
    /// How long a write may run.
    pub answer_timeout: Duration,
}

impl Program {
    /// The production program, the bots CLI inside the skilled tree.
    pub fn production(skilled_tree: &Path, repo: &Path) -> Program {
        Program {
            program: PathBuf::from("node"),
            leading: vec![skilled_tree
                .join(".skilled/bin/bots.cjs")
                .to_string_lossy()
                .into_owned()],
            repo: repo.to_path_buf(),
            read_timeout: Duration::from_secs(10),
            answer_timeout: Duration::from_secs(30),
        }
    }

    /// The argv of one read.
    pub fn read_argv(&self, surface: Surface) -> Vec<String> {
        let mut argv = self.leading.clone();
        argv.push(verb(surface).to_string());
        argv.push("--json".to_string());
        argv.push("--repo".to_string());
        argv.push(self.repo.to_string_lossy().into_owned());
        argv
    }

    /// The argv of one write.
    pub fn answer_argv(&self, id: &ItemId, text: &str, scope: Scope) -> Vec<String> {
        let mut argv = self.leading.clone();
        argv.push("answer".to_string());
        argv.push("--scope".to_string());
        argv.push(scope_word(scope).to_string());
        argv.push("--repo".to_string());
        argv.push(self.repo.to_string_lossy().into_owned());
        argv.push("--".to_string());
        argv.push(id.0.clone());
        argv.push(text.to_string());
        argv
    }
}

/// The verb one surface reads.
pub fn verb(surface: Surface) -> &'static str {
    match surface {
        Surface::Status => "status",
        Surface::Activity => "activity",
        Surface::Inbox => "inbox",
        Surface::Routines => "routines",
    }
}

/// The word `--scope` carries.
fn scope_word(scope: Scope) -> &'static str {
    match scope {
        Scope::Once => "once",
        Scope::Deny => "deny",
    }
}

/// Builds the one command every call starts from.
///
/// The environment is inherited unchanged, so the child reads the same
/// variables the screen does, and stdin is null so no call can wait on a
/// terminal the screen already owns.
fn command(program: &Program, argv: &[String]) -> Command {
    let mut command = Command::new(&program.program);
    command.args(argv);
    command.stdin(Stdio::null());
    command
}

/// How one child stopped.
enum Stop {
    /// The child exited with this code, -1 when a signal ended it.
    Exited(i32),
    /// The deadline passed first.
    Timeout,
    /// The quit flag was set first.
    Cancel,
}

/// Waits for one child, polling so a deadline and a quit flag are both seen.
fn wait_for(child: &mut Child, timeout: Duration, cancel: &AtomicBool) -> Stop {
    let started = Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(status)) => return Stop::Exited(status.code().unwrap_or(-1)),
            Ok(None) => {}
            Err(_) => {
                // A wait that fails leaves the child's state unknown, so it is
                // killed and reported as the no-code exit rather than leaked.
                let _ = child.kill();
                let _ = child.wait();
                return Stop::Exited(-1);
            }
        }
        if cancel.load(Ordering::Relaxed) {
            return Stop::Cancel;
        }
        if started.elapsed() >= timeout {
            return Stop::Timeout;
        }
        std::thread::sleep(POLL);
    }
}

/// Kills one read and everything it started.
///
/// The child leads its own process group, so the group kill reaches a
/// grandchild that still holds the pipes open. Without it the readers would
/// stay blocked until that grandchild exited on its own.
fn kill_tree(child: &mut Child) {
    let group = child.id() as i32;
    // SAFETY: the child leads the process group it was spawned into, so the
    // negated id names that group and nothing else.
    unsafe {
        libc::kill(-group, libc::SIGKILL);
    }
    let _ = child.kill();
    let _ = child.wait();
}

/// Runs one read and parses its payload.
pub fn read(program: &Program, surface: Surface, cancel: &AtomicBool) -> Result<Read, ReadError> {
    let verb = verb(surface);
    let argv = program.read_argv(surface);
    let mut child = command(program, &argv)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .process_group(0)
        .spawn()
        .map_err(|error| ReadError {
            kind: FailKind::Spawn,
            line: format!("bots-ui: {verb} --json did not start: {error}"),
        })?;

    let stdout_pipe = child.stdout.take();
    let stderr_pipe = child.stderr.take();

    let (stdout, stderr, stop) = std::thread::scope(|scope| {
        // One reader per pipe, each draining to the end, so a payload larger
        // than the pipe buffer cannot block the child while it writes.
        let stdout_reader = stdout_pipe.map(|mut pipe| {
            scope.spawn(move || {
                let mut buffer = Vec::new();
                let _ = pipe.read_to_end(&mut buffer);
                buffer
            })
        });
        let stderr_reader = stderr_pipe.map(|mut pipe| {
            scope.spawn(move || {
                let mut buffer = Vec::new();
                let _ = pipe.read_to_end(&mut buffer);
                buffer
            })
        });

        let stop = wait_for(&mut child, program.read_timeout, cancel);
        if !matches!(stop, Stop::Exited(_)) {
            kill_tree(&mut child);
        }

        let stdout = stdout_reader
            .map(|reader| reader.join().unwrap_or_default())
            .unwrap_or_default();
        let stderr = stderr_reader
            .map(|reader| reader.join().unwrap_or_default())
            .unwrap_or_default();
        (stdout, stderr, stop)
    });

    let stdout = String::from_utf8_lossy(&stdout).into_owned();
    let stderr = String::from_utf8_lossy(&stderr).into_owned();

    match stop {
        Stop::Timeout => Err(ReadError {
            kind: FailKind::Timeout,
            line: format!(
                "bots-ui: {verb} timed out after {}s",
                program.read_timeout.as_secs()
            ),
        }),
        Stop::Cancel => Err(ReadError {
            kind: FailKind::Timeout,
            line: format!("bots-ui: {verb} stopped at quit"),
        }),
        Stop::Exited(0) => match parse_payload(surface, &stdout) {
            Ok(payload) => Ok(Read {
                payload,
                warning: first_line(&stderr),
            }),
            Err(line) => Err(ReadError {
                kind: FailKind::Parse,
                line,
            }),
        },
        Stop::Exited(code) => Err(ReadError {
            kind: FailKind::Exit(code),
            line: exit_line(&format!("{verb} --json"), code, &stderr),
        }),
    }
}

/// Runs one write and reports whether it landed.
///
/// The child is left running when the deadline passes or the screen quits,
/// because a kill could land between the item write and the print and turn a
/// landed answer into a reported failure.
#[allow(clippy::zombie_processes)]
pub fn answer(
    program: &Program,
    id: &ItemId,
    text: &str,
    scope: Scope,
    cancel: &AtomicBool,
) -> Result<AnswerOk, AnswerError> {
    let argv = program.answer_argv(id, text, scope);
    let mut child = command(program, &argv)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .process_group(0)
        .spawn()
        .map_err(|error| AnswerError {
            kind: FailKind::Spawn,
            refusal: None,
            line: format!("bots-ui: answer did not start: {error}"),
        })?;

    let stdout_pipe = child.stdout.take();
    let stderr_pipe = child.stderr.take();

    // Plain threads rather than scoped ones, so this call can return while the
    // child still runs. Only stderr is joined, because the failure line needs
    // it and the child has already exited by then.
    let _stdout_reader = stdout_pipe.map(|mut pipe| {
        std::thread::spawn(move || {
            let mut buffer = Vec::new();
            let _ = pipe.read_to_end(&mut buffer);
            buffer
        })
    });
    let stderr_reader = stderr_pipe.map(|mut pipe| {
        std::thread::spawn(move || {
            let mut buffer = Vec::new();
            let _ = pipe.read_to_end(&mut buffer);
            buffer
        })
    });

    match wait_for(&mut child, program.answer_timeout, cancel) {
        Stop::Timeout | Stop::Cancel => Err(AnswerError {
            kind: FailKind::Timeout,
            refusal: None,
            line: format!(
                "bots-ui: answer timed out after {}s, it may have landed",
                program.answer_timeout.as_secs()
            ),
        }),
        Stop::Exited(code) => {
            let stderr = stderr_reader
                .map(|reader| reader.join().unwrap_or_default())
                .unwrap_or_default();
            let stderr = String::from_utf8_lossy(&stderr).into_owned();
            if code == 0 {
                Ok(AnswerOk {
                    warning: first_line(&stderr),
                })
            } else {
                Err(AnswerError {
                    kind: FailKind::Exit(code),
                    refusal: first_line(&stderr).as_deref().and_then(refusal_name),
                    line: match first_line(&stderr) {
                        Some(line) => line,
                        None => format!("bots-ui: answer exited {code}"),
                    },
                })
            }
        }
    }
}

/// Runs one write on a thread of its own, so a closed overlay still completes it.
///
/// The child is never waited for, because the write outlives the screen and a
/// wait here would hold the quit path open.
#[allow(clippy::zombie_processes)]
pub fn answer_detached(
    program: &Program,
    id: &ItemId,
    text: &str,
    scope: Scope,
) -> std::io::Result<()> {
    let argv = program.answer_argv(id, text, scope);
    command(program, &argv)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .process_group(0)
        .spawn()?;
    Ok(())
}

/// Parses one read's stdout into the payload its surface carries.
pub fn parse_payload(surface: Surface, stdout: &str) -> Result<Payload, String> {
    let verb = verb(surface);
    match surface {
        Surface::Status => {
            let payload: StatusPayload =
                serde_json::from_str(stdout).map_err(|error| no_payload(verb, &error))?;
            check_version(verb, payload.version)?;
            Ok(Payload::Status(payload))
        }
        Surface::Activity => {
            let payload: ActivityPayload =
                serde_json::from_str(stdout).map_err(|error| no_payload(verb, &error))?;
            check_version(verb, payload.version)?;
            Ok(Payload::Activity(payload.groups))
        }
        Surface::Inbox => {
            let payload: InboxPayload =
                serde_json::from_str(stdout).map_err(|error| no_payload(verb, &error))?;
            check_version(verb, payload.version)?;
            Ok(Payload::Inbox(payload.items))
        }
        Surface::Routines => {
            let payload: RoutinesPayload =
                serde_json::from_str(stdout).map_err(|error| no_payload(verb, &error))?;
            check_version(verb, payload.version)?;
            Ok(Payload::Routines(payload.routines))
        }
    }
}

/// The line a read composes when its stdout does not parse.
fn no_payload(verb: &str, error: &serde_json::Error) -> String {
    format!("bots-ui: {verb} --json printed no payload: {error}")
}

/// Rejects a payload whose contract major is newer than this build reads.
fn check_version(verb: &str, version: u32) -> Result<(), String> {
    if version > crate::CONTRACT {
        Err(format!(
            "bots-ui: {verb} --json speaks version {version}, the screen reads version {}",
            crate::CONTRACT
        ))
    } else {
        Ok(())
    }
}

/// The failure line one call composes from its exit code and its stderr.
fn exit_line(call: &str, code: i32, stderr: &str) -> String {
    match first_line(stderr) {
        Some(line) => {
            let rest = line.strip_prefix("bots: ").unwrap_or(line.as_str());
            format!("bots: {call} exited {code}: {rest}")
        }
        None => format!("bots: {call} exited {code}"),
    }
}

/// The first line of a stderr stream, when it holds one.
pub fn first_line(stderr: &str) -> Option<String> {
    stderr
        .lines()
        .map(str::trim)
        .find(|line| !line.is_empty())
        .map(str::to_string)
}

/// The refusal name a stderr line carries, when it names one.
pub fn refusal_name(line: &str) -> Option<String> {
    let rest = line.strip_prefix("bots: ")?;
    let name = match rest.find(':') {
        Some(index) => &rest[..index],
        None => rest,
    }
    .trim();
    let parts: Vec<&str> = name.split('-').collect();
    if parts.len() < 2 {
        return None;
    }
    let shaped = parts.iter().all(|part| {
        !part.is_empty()
            && part
                .chars()
                .all(|character| character.is_ascii_lowercase() || character.is_ascii_digit())
    });
    if shaped {
        Some(name.to_string())
    } else {
        None
    }
}

/// A fresh temporary directory for one test.
#[cfg(test)]
#[allow(dead_code)]
pub(crate) fn test_dir(name: &str) -> PathBuf {
    let path = std::env::temp_dir().join(format!("bots-tui-{}-{}", std::process::id(), name));
    if path.exists() {
        let _ = std::fs::remove_dir_all(&path);
    }
    let _ = std::fs::create_dir_all(&path);
    path
}

/// The fixture program one test runs, with its log path and its scenario.
#[cfg(test)]
#[allow(dead_code)]
pub(crate) fn test_program(log: &Path, scenario: &str) -> Program {
    Program {
        program: PathBuf::from("bash"),
        leading: vec![
            concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots").to_string(),
            "--fixture-log".to_string(),
            log.display().to_string(),
            "--fixture-scenario".to_string(),
            scenario.to_string(),
        ],
        repo: PathBuf::from(env!("CARGO_MANIFEST_DIR")),
        read_timeout: Duration::from_secs(10),
        answer_timeout: Duration::from_secs(30),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// The expected argv, so a comparison reads as the command line it names.
    fn strings(items: &[&str]) -> Vec<String> {
        items.iter().map(|item| item.to_string()).collect()
    }

    #[test]
    fn program_defaults_to_node_and_bots_cjs() {
        let program = Program::production(Path::new("/s"), Path::new("/r"));
        assert_eq!(program.program, PathBuf::from("node"));
        assert_eq!(program.leading, strings(&["/s/.skilled/bin/bots.cjs"]));
        assert_eq!(program.read_timeout, Duration::from_secs(10));
        assert_eq!(program.answer_timeout, Duration::from_secs(30));
        assert_eq!(
            program.read_argv(Surface::Status),
            strings(&[
                "/s/.skilled/bin/bots.cjs",
                "status",
                "--json",
                "--repo",
                "/r"
            ])
        );
    }

    #[test]
    fn answer_argv_carries_scope() {
        let program = Program::production(Path::new("/s"), Path::new("/r"));
        let once = program.answer_argv(&ItemId("x".into()), "hold", Scope::Once);
        assert_eq!(
            &once[once.len() - 8..],
            strings(&["answer", "--scope", "once", "--repo", "/r", "--", "x", "hold"]).as_slice()
        );
        let deny = program.answer_argv(&ItemId("x".into()), "hold", Scope::Deny);
        assert_eq!(
            &deny[deny.len() - 8..],
            strings(&["answer", "--scope", "deny", "--repo", "/r", "--", "x", "hold"]).as_slice()
        );
    }

    #[test]
    fn child_stdin_is_null() {
        const SCRIPT: &str = r#"if [ -t 0 ]; then echo "bots: stdin is a terminal" >&2; exit 3; fi; if IFS= read -r -t 2 line; then echo "bots: stdin had data" >&2; exit 3; fi; printf '{"version":1,"rows":[]}'"#;
        let program = Program {
            program: PathBuf::from("bash"),
            leading: strings(&["-c", SCRIPT, "bots"]),
            repo: PathBuf::from("/r"),
            read_timeout: Duration::from_secs(10),
            answer_timeout: Duration::from_secs(30),
        };
        let cancel = AtomicBool::new(false);
        let outcome = read(&program, Surface::Status, &cancel);
        assert!(outcome.is_ok(), "{outcome:?}");
    }

    #[test]
    fn argv_never_carries_as() {
        let program = Program::production(Path::new("/s"), Path::new("/r"));
        for surface in [
            Surface::Status,
            Surface::Activity,
            Surface::Inbox,
            Surface::Routines,
        ] {
            let argv = program.read_argv(surface);
            assert!(!argv.iter().any(|item| item == "--as"), "{argv:?}");
        }
        for scope in [Scope::Once, Scope::Deny] {
            let argv = program.answer_argv(&ItemId("x".into()), "hold", scope);
            assert!(!argv.iter().any(|item| item == "--as"), "{argv:?}");
        }
    }

    #[test]
    fn read_parses_the_fixture() {
        let dir = test_dir("read-parses-the-fixture");
        let log = dir.join("calls.log");
        let program = test_program(&log, "ok");
        let cancel = AtomicBool::new(false);
        let outcome = read(&program, Surface::Status, &cancel).expect("the fixture answers");
        assert_eq!(outcome.warning, None);
        match outcome.payload {
            Payload::Status(payload) => assert_eq!(payload.rows.len(), 7),
            other => panic!("expected a status payload, got {other:?}"),
        }
        let calls = std::fs::read_to_string(&log).expect("the fixture logs its call");
        let expected = format!("status --json --repo {}", program.repo.display());
        assert!(calls.lines().any(|line| line == expected), "{calls}");
    }

    #[test]
    fn read_failure_composes_the_line() {
        let dir = test_dir("read-failure-composes-the-line");
        let program = test_program(&dir.join("calls.log"), "fail-status");
        let cancel = AtomicBool::new(false);
        let error = read(&program, Surface::Status, &cancel).expect_err("the fixture fails");
        assert_eq!(error.kind, FailKind::Exit(1));
        assert_eq!(error.line, "bots: status --json exited 1: index locked");
    }

    #[test]
    fn read_warning_keeps_the_payload() {
        let dir = test_dir("read-warning-keeps-the-payload");
        let program = test_program(&dir.join("calls.log"), "warn");
        let cancel = AtomicBool::new(false);
        let outcome = read(&program, Surface::Inbox, &cancel).expect("the fixture answers");
        assert_eq!(
            outcome.warning,
            Some("bots: item 20261124T090000Z-0badf00d did not read".to_string())
        );
        match outcome.payload {
            Payload::Inbox(items) => assert_eq!(items.len(), 3),
            other => panic!("expected an inbox payload, got {other:?}"),
        }
    }

    #[test]
    fn read_past_timeout_is_killed() {
        let dir = test_dir("read-past-timeout-is-killed");
        let mut program = test_program(&dir.join("calls.log"), "slow");
        program.read_timeout = Duration::from_secs(1);
        let cancel = AtomicBool::new(false);
        let started = Instant::now();
        let error = read(&program, Surface::Status, &cancel).expect_err("the fixture is slow");
        let elapsed = started.elapsed();
        assert_eq!(error.kind, FailKind::Timeout);
        assert_eq!(error.line, "bots-ui: status timed out after 1s");
        assert!(elapsed < Duration::from_millis(1900), "{elapsed:?}");
    }

    #[test]
    fn answer_refusal_names_the_reason() {
        let dir = test_dir("answer-refusal-names-the-reason");
        let program = test_program(&dir.join("calls.log"), "refuse-item-expired");
        let cancel = AtomicBool::new(false);
        let error = answer(&program, &ItemId("x".into()), "hold", Scope::Once, &cancel)
            .expect_err("the fixture refuses");
        assert_eq!(error.kind, FailKind::Exit(4));
        assert_eq!(error.refusal, Some("item-expired".to_string()));
        assert_eq!(error.line, "bots: item-expired");
    }

    #[test]
    fn answer_failure_without_stderr_names_the_exit() {
        let program = Program {
            program: "bash".into(),
            leading: vec!["-c".into(), "exit 3".into()],
            repo: test_dir("answer-failure-without-stderr-names-the-exit"),
            read_timeout: Duration::from_secs(10),
            answer_timeout: Duration::from_secs(30),
        };
        let cancel = AtomicBool::new(false);
        let error = answer(&program, &ItemId("x".into()), "hold", Scope::Once, &cancel)
            .expect_err("the program exits without a line");
        assert_eq!(error.kind, FailKind::Exit(3));
        assert_eq!(error.refusal, None);
        assert_eq!(error.line, "bots-ui: answer exited 3");
    }

    #[test]
    fn answer_success_is_ok() {
        let dir = test_dir("answer-success-is-ok");
        let log = dir.join("calls.log");
        let program = test_program(&log, "ok");
        let cancel = AtomicBool::new(false);
        let id = ItemId("20261124T090000Z-0badf00d".to_string());
        let outcome = answer(&program, &id, "deny", Scope::Deny, &cancel);
        assert!(outcome.is_ok(), "{outcome:?}");
        let calls = std::fs::read_to_string(&log).expect("the fixture logs its call");
        let expected = format!(
            "answer --scope deny --repo {} -- {} deny",
            program.repo.display(),
            id.0
        );
        assert!(calls.lines().any(|line| line == expected), "{calls}");
    }

    #[test]
    fn refusal_name_reads_only_kebab_names() {
        assert_eq!(
            refusal_name("bots: item-expired"),
            Some("item-expired".to_string())
        );
        assert_eq!(
            refusal_name("bots: answer-not-approver: detail"),
            Some("answer-not-approver".to_string())
        );
        assert_eq!(refusal_name("bots: index locked"), None);
        assert_eq!(refusal_name("bots: --as needs a tty"), None);
        assert_eq!(refusal_name("item-expired"), None);
    }

    #[test]
    fn newer_version_is_a_failed_read() {
        let error = parse_payload(Surface::Inbox, r#"{"version":2,"items":[]}"#)
            .expect_err("version 2 is newer than this build reads");
        assert_eq!(
            error,
            "bots-ui: inbox --json speaks version 2, the screen reads version 1"
        );
    }
}
