use std::io::{Read as _, Write as _};
use std::os::unix::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::time::{Duration, Instant};

use crate::model::{ActivityPayload, InboxPayload, RoutinesPayload, StatusPayload, Transcript};
use crate::state::{
    AnswerError, AnswerOk, BotId, ChatError, ChatOk, FailKind, ItemId, Payload, Read, ReadError,
    Scope, Surface,
};

/// How often the wait loop looks at a child.
const POLL: Duration = Duration::from_millis(10);

/// The number of chat sends this process has started, so two sends never share a stderr file.
static CHAT_SEND_COUNT: AtomicU64 = AtomicU64::new(0);

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

    /// The argv of the chat transcript read. The `--` ends the options, so a bot id is never read as a flag.
    pub fn chat_transcript_argv(&self, bot: &BotId) -> Vec<String> {
        let mut argv = self.leading.clone();
        argv.push("chat".to_string());
        argv.push("--transcript".to_string());
        argv.push("--json".to_string());
        argv.push("--repo".to_string());
        argv.push(self.repo.to_string_lossy().into_owned());
        argv.push("--".to_string());
        argv.push(bot.0.clone());
        argv
    }

    /// The argv of one chat send. `--message -` reads the text from stdin, so the draft is never in a process table.
    pub fn chat_send_argv(&self, bot: &BotId) -> Vec<String> {
        let mut argv = self.leading.clone();
        argv.push("chat".to_string());
        argv.push("--message".to_string());
        argv.push("-".to_string());
        argv.push("--repo".to_string());
        argv.push(self.repo.to_string_lossy().into_owned());
        argv.push("--".to_string());
        argv.push(bot.0.clone());
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
        Surface::Chat => "chat",
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

/// Runs one read on the read worker and parses its payload.
///
/// Both reads share this path, so a deadline, a quit and a killed process
/// group behave the same for the transcript as for a surface. The spawn and
/// exit lines name the whole call, the timeout and quit lines name its verb.
fn read_call<F>(
    program: &Program,
    argv: Vec<String>,
    call: &str,
    verb: &str,
    cancel: &AtomicBool,
    parse: F,
) -> Result<Read, ReadError>
where
    F: FnOnce(&str) -> Result<Payload, String>,
{
    let mut child = command(program, &argv)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .process_group(0)
        .spawn()
        .map_err(|error| ReadError {
            kind: FailKind::Spawn,
            line: format!("bots-ui: {call} did not start: {error}"),
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
        Stop::Exited(0) => match parse(&stdout) {
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
            line: exit_line(call, code, &stderr),
        }),
    }
}

/// Runs one read and parses its payload.
pub fn read(program: &Program, surface: Surface, cancel: &AtomicBool) -> Result<Read, ReadError> {
    // The chat read names one bot, so the surface alone cannot build its call.
    if surface == Surface::Chat {
        return Err(ReadError {
            kind: FailKind::Spawn,
            line: "bots-ui: chat --transcript --json needs a bot".to_string(),
        });
    }
    let verb = verb(surface);
    read_call(
        program,
        program.read_argv(surface),
        &format!("{verb} --json"),
        verb,
        cancel,
        |stdout| parse_payload(surface, stdout),
    )
}

/// Reads the chosen bot's conversation on the read worker, under the read deadline.
pub fn chat_transcript(
    program: &Program,
    bot: &BotId,
    cancel: &AtomicBool,
) -> Result<Read, ReadError> {
    read_call(
        program,
        program.chat_transcript_argv(bot),
        "chat --transcript --json",
        "chat",
        cancel,
        |stdout| parse_transcript(bot, stdout),
    )
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
        .stdout(Stdio::null())
        .stderr(Stdio::piped())
        .process_group(0)
        .spawn()
        .map_err(|error| AnswerError {
            kind: FailKind::Spawn,
            refusal: None,
            line: format!("bots-ui: answer did not start: {error}"),
        })?;

    let stderr_pipe = child.stderr.take();

    // A plain thread rather than a scoped one, so this call can return while
    // the child still runs. Stdout is null because nothing reads it. Stderr
    // keeps its reader because a refused answer's line is the child's first
    // stderr line.
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

/// The stderr file path one chat send writes, unique across processes and calls.
fn chat_stderr_path() -> PathBuf {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|elapsed| elapsed.as_nanos())
        .unwrap_or(0);
    let count = CHAT_SEND_COUNT.fetch_add(1, Ordering::Relaxed);
    std::env::temp_dir().join(format!(
        "bots-ui-chat-{}-{}-{}.err",
        std::process::id(),
        nanos,
        count
    ))
}

/// Runs one chat send and waits for it with no deadline, because a bot run lasts as long as its own bound.
///
/// The child leads its own process group, so a signal to the screen's group does not stop the
/// run. Its stdout is null, because the reply is read from the transcript. The draft goes to its
/// stdin as one line. Its stderr goes to a temporary file that is read after it exits and then
/// removed, so no pipe reader has to outlive the screen.
pub fn chat_send(program: &Program, bot: &BotId, text: &str) -> Result<ChatOk, ChatError> {
    let stderr_path = chat_stderr_path();
    let file = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&stderr_path)
        .map_err(|error| ChatError {
            kind: FailKind::Spawn,
            line: format!("bots-ui: chat send did not start: {error}"),
        })?;

    let mut child = match command(program, &program.chat_send_argv(bot))
        .stdin(Stdio::piped())
        .stdout(Stdio::null())
        .stderr(Stdio::from(file))
        .process_group(0)
        .spawn()
    {
        Ok(child) => child,
        Err(error) => {
            let _ = std::fs::remove_file(&stderr_path);
            return Err(ChatError {
                kind: FailKind::Spawn,
                line: format!("bots-ui: chat send did not start: {error}"),
            });
        }
    };

    // The draft goes in as one line and stdin is then dropped, so the child reads it and sees EOF.
    if let Some(mut stdin) = child.stdin.take() {
        let _ = stdin.write_all(format!("{text}\n").as_bytes());
    }

    // A wait that fails leaves the exit unknown, so it is reported as the no-code exit.
    let code = match child.wait() {
        Ok(status) => status.code().unwrap_or(-1),
        Err(_) => -1,
    };

    let stderr = std::fs::read(&stderr_path)
        .map(|bytes| String::from_utf8_lossy(&bytes).into_owned())
        .unwrap_or_default();
    let _ = std::fs::remove_file(&stderr_path);

    match code {
        2 | 4 => Err(ChatError {
            kind: FailKind::Exit(code),
            line: match first_line(&stderr) {
                Some(line) => line,
                None => format!("bots-ui: chat --message exited {code}"),
            },
        }),
        0 | 5 => Ok(ChatOk {
            code,
            warning: first_line(&stderr),
        }),
        _ => Ok(ChatOk {
            code,
            warning: Some(exit_line("chat --message", code, &stderr)),
        }),
    }
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
        Surface::Chat => Err(
            "bots-ui: chat --transcript --json is read for one bot, not as a surface".to_string(),
        ),
    }
}

/// Parses the transcript payload and checks it is the chosen bot's conversation in a version this build reads.
pub fn parse_transcript(bot: &BotId, stdout: &str) -> Result<Payload, String> {
    let payload: Transcript =
        serde_json::from_str(stdout).map_err(|error| no_payload("chat --transcript", &error))?;
    check_version("chat --transcript", payload.version)?;
    if payload.conversation_id != bot.0 {
        return Err(format!(
            "bots-ui: chat --transcript --json printed conversation {}, not {}",
            payload.conversation_id, bot.0
        ));
    }
    Ok(Payload::Chat(payload))
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

    /// The chat stderr files this process has in the temp directory.
    fn chat_stderr_files(prefix: &str) -> Vec<String> {
        std::fs::read_dir(std::env::temp_dir())
            .expect("the temp dir reads")
            .filter_map(|entry| entry.ok())
            .map(|entry| entry.file_name().to_string_lossy().into_owned())
            .filter(|name| name.starts_with(prefix))
            .collect()
    }

    #[test]
    fn chat_argv_keeps_the_draft_out() {
        let program = Program::production(Path::new("/s"), Path::new("/r"));
        let bot = BotId("hello".to_string());
        let send = program.chat_send_argv(&bot);
        assert_eq!(
            &send[send.len() - 7..],
            strings(&["chat", "--message", "-", "--repo", "/r", "--", "hello"]).as_slice()
        );
        let transcript = program.chat_transcript_argv(&bot);
        assert_eq!(
            &transcript[transcript.len() - 7..],
            strings(&[
                "chat",
                "--transcript",
                "--json",
                "--repo",
                "/r",
                "--",
                "hello"
            ])
            .as_slice()
        );
        assert!(!send.iter().any(|item| item == "--as"), "{send:?}");
        assert!(
            !transcript.iter().any(|item| item == "--as"),
            "{transcript:?}"
        );
    }

    #[test]
    fn chat_transcript_reads_the_fixture() {
        let dir = test_dir("chat-transcript-reads-the-fixture");
        let program = test_program(&dir.join("calls.log"), "ok");
        let cancel = AtomicBool::new(false);
        let bot = BotId("hello".to_string());
        let outcome = chat_transcript(&program, &bot, &cancel).expect("the fixture answers");
        assert_eq!(outcome.warning, None);
        match outcome.payload {
            Payload::Chat(transcript) => assert_eq!(transcript.messages.len(), 4),
            other => panic!("expected a chat payload, got {other:?}"),
        }
    }

    #[test]
    fn chat_transcript_refuses_another_conversation() {
        let dir = test_dir("chat-transcript-refuses-another-conversation");
        let program = test_program(&dir.join("calls.log"), "ok");
        let cancel = AtomicBool::new(false);
        let bot = BotId("digest".to_string());
        let error = chat_transcript(&program, &bot, &cancel).expect_err("the fixture prints hello");
        assert_eq!(error.kind, FailKind::Parse);
        assert!(
            error
                .line
                .ends_with("printed conversation hello, not digest"),
            "{}",
            error.line
        );
    }

    #[test]
    fn chat_transcript_failure_composes_the_line() {
        let dir = test_dir("chat-transcript-failure-composes-the-line");
        let program = test_program(&dir.join("calls.log"), "fail-chat");
        let cancel = AtomicBool::new(false);
        let bot = BotId("hello".to_string());
        let error = chat_transcript(&program, &bot, &cancel).expect_err("the fixture fails");
        assert_eq!(error.kind, FailKind::Exit(1));
        assert_eq!(
            error.line,
            "bots: chat --transcript --json exited 1: index locked"
        );
    }

    #[test]
    fn chat_read_of_the_surface_starts_nothing() {
        let dir = test_dir("chat-read-of-the-surface-starts-nothing");
        let log = dir.join("calls.log");
        let program = test_program(&log, "ok");
        let cancel = AtomicBool::new(false);
        let error = read(&program, Surface::Chat, &cancel).expect_err("the surface names no bot");
        assert_eq!(error.kind, FailKind::Spawn);
        assert_eq!(error.line, "bots-ui: chat --transcript --json needs a bot");
        assert!(!log.exists(), "the fixture was started");
    }

    #[test]
    fn chat_send_writes_the_draft_on_stdin() {
        let dir = test_dir("chat-send-writes-the-draft-on-stdin");
        let log = dir.join("calls.log");
        let program = test_program(&log, "ok");
        let bot = BotId("hello".to_string());
        let outcome = chat_send(&program, &bot, "hello there").expect("the fixture answers");
        assert_eq!(outcome.code, 0);
        assert_eq!(outcome.warning, None);
        let calls = std::fs::read_to_string(&log).expect("the fixture logs its call");
        let expected = format!(
            "chat --message - --repo {} -- hello",
            program.repo.display()
        );
        assert!(calls.lines().any(|line| line == expected), "{calls}");
        assert!(
            calls
                .lines()
                .any(|line| line == "fixture-chat-stdin hello there"),
            "{calls}"
        );
        assert!(
            calls
                .lines()
                .any(|line| line == "fixture-chat-fds stdout=null"),
            "{calls}"
        );
        let carrying: Vec<&str> = calls
            .lines()
            .filter(|line| line.contains("hello there"))
            .collect();
        assert_eq!(carrying, vec!["fixture-chat-stdin hello there"], "{calls}");
    }

    #[test]
    fn chat_send_routes_each_code() {
        let bot = BotId("hello".to_string());

        let dir = test_dir("chat-send-routes-each-code-park");
        let program = test_program(&dir.join("calls.log"), "chat-park");
        let outcome = chat_send(&program, &bot, "ship it").expect("exit 5 appended a reply");
        assert_eq!(outcome.code, 5);
        assert_eq!(outcome.warning, None);

        let dir = test_dir("chat-send-routes-each-code-fail");
        let program = test_program(&dir.join("calls.log"), "chat-fail");
        let outcome = chat_send(&program, &bot, "ship it").expect("exit 1 appended a reply");
        assert_eq!(outcome.code, 1);
        assert_eq!(
            outcome.warning,
            Some("bots: chat --message exited 1: executor exited 1".to_string())
        );

        let dir = test_dir("chat-send-routes-each-code-refuse");
        let program = test_program(&dir.join("calls.log"), "chat-refuse-bot-unknown");
        let error = chat_send(&program, &bot, "ship it").expect_err("exit 4 appended nothing");
        assert_eq!(error.kind, FailKind::Exit(4));
        assert_eq!(error.line, "bots: bot-unknown");

        let dir = test_dir("chat-send-routes-each-code-usage");
        let program = test_program(&dir.join("calls.log"), "chat-usage");
        let error = chat_send(&program, &bot, "ship it").expect_err("exit 2 appended nothing");
        assert_eq!(error.kind, FailKind::Exit(2));
        assert_eq!(error.line, "bots: chat: the message is empty");
    }

    #[test]
    fn chat_send_outlives_the_read_deadline() {
        let dir = test_dir("chat-send-outlives-the-read-deadline");
        let log = dir.join("calls.log");
        let mut program = test_program(&log, "chat-slow");
        program.read_timeout = Duration::from_secs(1);
        program.answer_timeout = Duration::from_secs(1);
        let bot = BotId("hello".to_string());
        let started = Instant::now();
        let outcome = chat_send(&program, &bot, "ship it").expect("the fixture answers");
        let elapsed = started.elapsed();
        assert_eq!(outcome.code, 0);
        assert!(elapsed >= Duration::from_secs(2), "{elapsed:?}");
        let calls = std::fs::read_to_string(&log).expect("the fixture logs its call");
        assert!(
            calls.lines().any(|line| line == "fixture-chat-done"),
            "{calls}"
        );
    }

    #[test]
    fn chat_send_leaves_no_stderr_file() {
        let dir = test_dir("chat-send-leaves-no-stderr-file");
        let program = test_program(&dir.join("calls.log"), "chat-fail");
        let bot = BotId("hello".to_string());
        let _ = chat_send(&program, &bot, "ship it");
        let prefix = format!("bots-ui-chat-{}-", std::process::id());
        // A send in flight elsewhere in this process still holds its file, so the scan
        // waits for every send to finish and then reads what was left behind.
        let deadline = Instant::now() + Duration::from_secs(10);
        let mut left = chat_stderr_files(&prefix);
        while !left.is_empty() && Instant::now() < deadline {
            std::thread::sleep(Duration::from_millis(25));
            left = chat_stderr_files(&prefix);
        }
        assert!(left.is_empty(), "{left:?}");
    }
}
