//! A single branded status line on stderr while a long, otherwise-silent
//! step runs.
//!
//! After one short delay the line `❋ message…` appears once — no animation,
//! no redrawing — so agents, CI logs, and quick commands never see churn,
//! and fast steps see nothing at all. It only appears when stderr is an
//! interactive terminal. The owner must drop it before writing other output.

// The status line is written only on Unix; the Windows arm stays silent, so
// the trait is unused there and the first Windows build said so.
use std::{
    io::IsTerminal,
    sync::{
        Arc,
        atomic::{AtomicBool, Ordering},
    },
    thread::JoinHandle,
};
#[cfg(unix)]
use std::{io::Write, time::Duration};

/// How long a step must run before the status line appears.
// Read only by the Unix progress path and its test.
#[cfg(unix)]
const QUIET_PERIOD: Duration = Duration::from_millis(120);

/// The run holds std's locked stderr as its diagnostics writer, so this
/// thread must never take that lock: an `eprintln!` here deadlocks against
/// it, and joining the thread then hangs the run — the field case was a real
/// project's first slow workspace phase on a TTY. The line goes straight to
/// a duplicate of the descriptor instead.
#[cfg(unix)]
fn status_output() -> Option<std::fs::File> {
    use std::os::fd::FromRawFd;
    let descriptor = unsafe { libc::dup(2) };
    (descriptor >= 0).then(|| unsafe { std::fs::File::from_raw_fd(descriptor) })
}

pub struct ProgressLine {
    stop: Arc<AtomicBool>,
    handle: Option<JoinHandle<()>>,
}

impl ProgressLine {
    pub fn start(message: &'static str) -> Option<Self> {
        if cfg!(not(unix)) || !std::io::stderr().is_terminal() {
            return None;
        }
        Self::start_on_terminal(message)
    }

    #[cfg(unix)]
    fn start_on_terminal(message: &'static str) -> Option<Self> {
        let mut output = status_output()?;
        let stop = Arc::new(AtomicBool::new(false));
        let flag = Arc::clone(&stop);
        let handle = std::thread::spawn(move || {
            std::thread::sleep(QUIET_PERIOD);
            if flag.load(Ordering::Relaxed) {
                return;
            }
            let _ = writeln!(output, "❋ {message}…");
        });
        Some(Self {
            stop,
            handle: Some(handle),
        })
    }

    #[cfg(not(unix))]
    fn start_on_terminal(_message: &'static str) -> Option<Self> {
        // Only unix has the lock-free descriptor path; other platforms stay
        // silent rather than risk the diagnostics writer's stderr lock.
        None
    }
}

impl Drop for ProgressLine {
    fn drop(&mut self) {
        self.stop.store(true, Ordering::Relaxed);
        if let Some(handle) = self.handle.take() {
            let _ = handle.join();
        }
    }
}

#[cfg(all(test, unix))]
mod tests {
    use super::*;

    /// The regression that shipped in 0.0.22: the run holds std's stderr
    /// lock as its diagnostics writer for the whole run, the status thread
    /// blocked on that lock via `eprint!`, and `Drop`'s join then hung the
    /// process. The status line must start, write, and drop to completion
    /// while the calling thread holds std's stderr lock.
    #[test]
    fn status_line_never_needs_stds_stderr_lock() {
        let diagnostics = std::io::stderr().lock();
        let line = ProgressLine::start_on_terminal("proving the status line stays lock-free");
        std::thread::sleep(QUIET_PERIOD * 2);
        let (sender, receiver) = std::sync::mpsc::channel();
        std::thread::spawn(move || {
            drop(line);
            let _ = sender.send(());
        });
        let dropped = receiver.recv_timeout(Duration::from_secs(10));
        drop(diagnostics);
        assert!(
            dropped.is_ok(),
            "dropping the status line deadlocked against std's stderr lock"
        );
    }
}
