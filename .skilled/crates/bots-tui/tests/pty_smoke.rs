//! Runs the built `bots-ui` binary in a pseudo-terminal against the crate's fake bots CLI.
//! It presses the keys that approve one inbox item and proves the answer was written.

use std::ffi::{CStr, CString};
use std::fs::File;
use std::io::{Read as _, Write as _};
use std::os::fd::{FromRawFd, OwnedFd, RawFd};
use std::os::unix::process::CommandExt as _;
use std::path::Path;
use std::process::{Child, Command, Stdio};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

/// The columns the pseudo-terminal is set to, so the screen draws a full frame.
const COLS: usize = 80;

/// The rows the pseudo-terminal is set to, so the screen draws a full frame.
const ROWS: usize = 24;

/// How often a wait looks at the screen or at the child.
const POLL: Duration = Duration::from_millis(50);

/// The fake bots CLI the shim hands every call to.
const FIXTURE: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/tests/fixtures/bots");

/// The fixture's first open item, so the first Enter selects it.
const ITEM: &str = "20261125T211204Z-7c1e9a40";

/// A spawned screen that is killed and reaped when the test leaves, however it leaves.
struct Running {
    /// The child the test drives.
    child: Child,
}

impl Drop for Running {
    fn drop(&mut self) {
        if let Ok(None) = self.child.try_wait() {
            let _ = self.child.kill();
            let _ = self.child.wait();
        }
    }
}

/// Opens a pseudo-terminal and returns its master and slave descriptors.
///
/// The slave is opened by path rather than through `openpty`, because `openpty` needs libutil on
/// Linux and this crate links nothing extra.
fn open_pty() -> (RawFd, RawFd) {
    // SAFETY: `posix_openpt` takes flags only and returns a descriptor this function owns.
    let master = unsafe { libc::posix_openpt(libc::O_RDWR | libc::O_NOCTTY) };
    assert!(
        master >= 0,
        "posix_openpt failed: {}",
        std::io::Error::last_os_error()
    );

    // SAFETY: `master` is the descriptor `posix_openpt` just returned.
    let granted = unsafe { libc::grantpt(master) };
    assert_eq!(
        granted,
        0,
        "grantpt failed: {}",
        std::io::Error::last_os_error()
    );

    // SAFETY: `master` is the descriptor `posix_openpt` just returned.
    let unlocked = unsafe { libc::unlockpt(master) };
    assert_eq!(
        unlocked,
        0,
        "unlockpt failed: {}",
        std::io::Error::last_os_error()
    );

    // SAFETY: `master` is an unlocked pseudo-terminal master, so `ptsname` returns a pointer to
    // a NUL-terminated path that stays valid until the next call on the same master.
    let name = unsafe { libc::ptsname(master) };
    assert!(
        !name.is_null(),
        "ptsname failed: {}",
        std::io::Error::last_os_error()
    );

    // SAFETY: `name` is a NUL-terminated string owned by the C library and only read here.
    let path = unsafe { CStr::from_ptr(name) }
        .to_string_lossy()
        .into_owned();
    let slave_path = CString::new(path).expect("the slave path holds no NUL");

    // SAFETY: `slave_path` is a NUL-terminated path and the flags ask for a read-write
    // descriptor that does not become this process's controlling terminal.
    let slave = unsafe { libc::open(slave_path.as_ptr(), libc::O_RDWR | libc::O_NOCTTY) };
    assert!(
        slave >= 0,
        "opening the pseudo-terminal slave failed: {}",
        std::io::Error::last_os_error()
    );

    (master, slave)
}

/// Sets the pseudo-terminal to the size the screen reads, so it draws a full frame.
///
/// Without this the screen reads a zero size and draws nothing at all.
fn set_size(slave: RawFd) {
    let size = libc::winsize {
        ws_row: ROWS as libc::c_ushort,
        ws_col: COLS as libc::c_ushort,
        ws_xpixel: 0,
        ws_ypixel: 0,
    };
    // SAFETY: `slave` is an open descriptor and `size` is a live `winsize` that `TIOCSWINSZ`
    // only reads.
    let result = unsafe { libc::ioctl(slave, libc::TIOCSWINSZ as _, &size) };
    assert_eq!(
        result,
        0,
        "TIOCSWINSZ failed: {}",
        std::io::Error::last_os_error()
    );
}

/// Duplicates the slave descriptor into a standard stream the child owns.
fn slave_stdio(slave: RawFd) -> Stdio {
    // SAFETY: `slave` is an open descriptor for the length of the call and `dup` returns a
    // fresh descriptor that nothing else owns.
    let copy = unsafe { libc::dup(slave) };
    assert!(copy >= 0, "dup of the pseudo-terminal slave failed");
    // SAFETY: `copy` is a fresh descriptor from `dup`, so the `OwnedFd` is its only owner.
    Stdio::from(unsafe { OwnedFd::from_raw_fd(copy) })
}

/// Writes the shim that hands every call to the fake bots CLI.
///
/// The two paths are baked into the text, so the screen's one fixed program path reaches the
/// fixture without an environment variable the screen would have to read.
fn write_shim(path: &Path, log: &Path) {
    let fixture = serde_json::to_string(FIXTURE).expect("the fixture path quotes");
    let log = serde_json::to_string(log.to_string_lossy().as_ref()).expect("the log path quotes");
    let text = format!(
        "const {{ spawnSync }} = require('node:child_process');\n\
         const result = spawnSync('bash', [{fixture}, '--fixture-log', {log}, \
         '--fixture-scenario', 'ok', ...process.argv.slice(2)], {{ stdio: 'inherit' }});\n\
         process.exit(result.status === null ? 1 : result.status);\n"
    );
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent).expect("the shim folder is created");
    }
    std::fs::write(path, text).expect("the shim is written");
}

/// Starts the thread that collects everything the terminal writes.
///
/// The master returns an error once the child is gone, so a failed read ends the thread rather
/// than the test.
fn start_reader(master: RawFd, output: Arc<Mutex<Vec<u8>>>) -> std::thread::JoinHandle<()> {
    // SAFETY: `master` is an open descriptor and `dup` returns a fresh one the thread owns.
    let copy = unsafe { libc::dup(master) };
    assert!(copy >= 0, "dup of the pseudo-terminal master failed");
    // SAFETY: `copy` is a fresh descriptor from `dup` and the thread is its only owner.
    let mut reader = unsafe { File::from_raw_fd(copy) };
    std::thread::spawn(move || {
        let mut chunk = [0u8; 4096];
        loop {
            match reader.read(&mut chunk) {
                Ok(0) => break,
                Ok(read) => {
                    let mut bytes = output
                        .lock()
                        .unwrap_or_else(|poisoned| poisoned.into_inner());
                    bytes.extend_from_slice(&chunk[..read]);
                }
                Err(_) => break,
            }
        }
    })
}

/// Writes one key press to the terminal and flushes it, so the screen sees it at once.
fn press(keys: &mut File, bytes: &[u8]) {
    keys.write_all(bytes).expect("the key press is written");
    keys.flush().expect("the key press is flushed");
}

/// Reads one CSI parameter, defaulting to 1 the way a terminal does.
fn number(param: Option<&str>) -> usize {
    param
        .and_then(|text| text.parse::<usize>().ok())
        .filter(|value| *value > 0)
        .unwrap_or(1)
}

/// Reads the drawn screen out of the bytes the terminal wrote.
///
/// The model is deliberately small. The crossterm backend moves the cursor with a `CSI`
/// cursor-position sequence whose two parameters are the row and the column, clears with a
/// `CSI 2 J` and styles with a `CSI ... m`, so those three are all a frame needs.
fn screen(bytes: &[u8]) -> Vec<String> {
    let text = String::from_utf8_lossy(bytes);
    let mut grid = vec![vec![' '; COLS]; ROWS];
    let mut row = 0usize;
    let mut col = 0usize;
    let mut chars = text.chars().peekable();
    while let Some(ch) = chars.next() {
        match ch {
            '\x1b' => match chars.next() {
                Some('[') => {
                    let mut params = String::new();
                    let mut last = None;
                    for next in chars.by_ref() {
                        if ('@'..='~').contains(&next) {
                            last = Some(next);
                            break;
                        }
                        params.push(next);
                    }
                    match last {
                        Some('H') | Some('f') => {
                            let mut parts = params.split(';');
                            row = number(parts.next()).saturating_sub(1);
                            col = number(parts.next()).saturating_sub(1);
                        }
                        Some('J') if params == "2" => {
                            grid = vec![vec![' '; COLS]; ROWS];
                        }
                        _ => {}
                    }
                }
                Some(']') => {
                    while let Some(next) = chars.next() {
                        if next == '\x07' {
                            break;
                        }
                        if next == '\x1b' && chars.peek() == Some(&'\\') {
                            chars.next();
                            break;
                        }
                    }
                }
                Some(_) => {}
                None => {}
            },
            '\r' => col = 0,
            '\n' => row = row.saturating_add(1),
            ch if (ch as u32) < 0x20 => {}
            ch => {
                if row < ROWS && col < COLS {
                    grid[row][col] = ch;
                }
                col = col.saturating_add(1);
            }
        }
    }
    grid.into_iter()
        .map(|line| line.into_iter().collect())
        .collect()
}

/// Waits until some row of the drawn screen holds `text`, and returns the screen it found.
///
/// The panic prints every row of the last screen, so a timeout names what was on the screen
/// rather than only what was missing.
fn wait_screen(output: &Arc<Mutex<Vec<u8>>>, text: &str, limit: Duration) -> Vec<String> {
    let started = Instant::now();
    loop {
        let rows = {
            let bytes = output
                .lock()
                .unwrap_or_else(|poisoned| poisoned.into_inner());
            screen(&bytes)
        };
        if rows.iter().any(|row| row.contains(text)) {
            return rows;
        }
        assert!(
            started.elapsed() < limit,
            "the screen never drew {text:?} within {limit:?}. Last screen:\n{}",
            rows.join("\n")
        );
        std::thread::sleep(POLL);
    }
}

/// Proves the built binary answers one inbox item when it runs on a real terminal.
#[test]
fn answers_one_item_in_a_pseudo_terminal() {
    let dir = std::env::temp_dir().join(format!("bots-tui-pty-{}", std::process::id()));
    if dir.exists() {
        std::fs::remove_dir_all(&dir).expect("the old temp folder is removed");
    }
    std::fs::create_dir_all(&dir).expect("the temp folder is created");
    let tree = dir.join("tree");
    let repo = dir.join("repo");
    std::fs::create_dir_all(&repo).expect("the repo folder is created");
    let log = dir.join("argv.log");
    write_shim(&tree.join(".skilled/bin/bots.cjs"), &log);

    let (master, slave) = open_pty();
    set_size(slave);

    let mut command = Command::new(env!("CARGO_BIN_EXE_bots-ui"));
    command.arg("--repo").arg(&repo);
    command.arg("--skilled-tree").arg(&tree);
    command.stdin(slave_stdio(slave));
    command.stdout(slave_stdio(slave));
    command.stderr(slave_stdio(slave));
    // SAFETY: the closure runs in the child between `fork` and `exec`, and it only makes the
    // two async-signal-safe calls that give the child the slave as its controlling terminal.
    unsafe {
        command.pre_exec(|| {
            if libc::setsid() < 0 {
                return Err(std::io::Error::last_os_error());
            }
            if libc::ioctl(0, libc::TIOCSCTTY as _, 0) < 0 {
                return Err(std::io::Error::last_os_error());
            }
            Ok(())
        });
    }
    let child = command.spawn().expect("the screen starts");
    let mut running = Running { child };
    // SAFETY: `slave` is the parent's own copy and the child holds its own duplicates, so
    // closing it here only lets the master read end when the child exits.
    unsafe {
        libc::close(slave);
    }

    let output = Arc::new(Mutex::new(Vec::new()));
    let reader = start_reader(master, Arc::clone(&output));
    // SAFETY: `master` is the descriptor `open_pty` returned and the writer is its only owner.
    let mut keys = unsafe { File::from_raw_fd(master) };

    wait_screen(&output, "hello", Duration::from_secs(15));
    press(&mut keys, b"]");
    wait_screen(&output, "Ship the release?", Duration::from_secs(10));
    press(&mut keys, b"\r");
    wait_screen(&output, "Approval", Duration::from_secs(10));
    press(&mut keys, b"y");
    wait_screen(&output, "approved", Duration::from_secs(15));

    let written = std::fs::read_to_string(&log).expect("the fixture log is readable");
    let answers: Vec<&str> = written
        .lines()
        .filter(|line| line.starts_with("answer"))
        .collect();
    assert_eq!(answers.len(), 1, "one answer is written, log:\n{written}");
    assert_eq!(
        answers[0],
        format!(
            "answer --scope once --repo {} -- {ITEM} approve",
            repo.display()
        )
    );

    press(&mut keys, b"\x04");
    let started = Instant::now();
    let status = loop {
        match running.child.try_wait() {
            Ok(Some(status)) => break status,
            Ok(None) => {}
            Err(error) => panic!("waiting for the screen failed: {error}"),
        }
        assert!(
            started.elapsed() < Duration::from_secs(10),
            "the screen did not exit after Ctrl+D"
        );
        std::thread::sleep(POLL);
    };
    assert_eq!(status.code(), Some(0), "the screen exits cleanly");

    let _ = reader.join();
    drop(keys);
    std::fs::remove_dir_all(&dir).expect("the temp folder is removed");
}
