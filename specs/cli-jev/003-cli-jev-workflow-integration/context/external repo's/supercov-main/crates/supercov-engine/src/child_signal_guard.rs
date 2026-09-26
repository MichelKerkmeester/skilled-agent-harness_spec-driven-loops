//! Take the test processes down with the runner.
//!
//! The owned Rust runner starts every libtest case in a process of its own and
//! waits for it. A signal that reaches the runner alone -- a supervisor's
//! SIGTERM, a `kill <pid>` from a script -- ended the runner and left the test
//! process running: on 2026-09-07 an orphaned tokio `test_tuning` spun on two
//! cores for an hour and starved every run that followed. Ctrl-C in a terminal
//! never showed this, because the shell signals the whole foreground process
//! group and the child dies with its parent.
//!
//! While a guard is installed, SIGHUP, SIGINT and SIGTERM first send SIGTERM
//! to every registered child, then let the signal take its default action, so
//! the runner exits exactly as it did before. The handler touches nothing but
//! a fixed table of atomics and `kill(2)`, both of which are safe inside a
//! signal handler.
//!
//! Windows delivers no signal a process can catch, but the kernel closes
//! every handle a dying process held: while a guard is installed, each
//! registered child is placed in a Job Object that kills its members when its
//! handle closes, so the test processes die with the runner however it ends.

use std::io;
use std::process::{Child, Command, ExitStatus, Output, Stdio};
use std::sync::atomic::{AtomicI32, AtomicUsize, Ordering};

/// How many children can be registered at once. The runner runs at most one
/// child per worker thread, and machines with more cores than this are rare;
/// a child that finds no free slot is simply not tracked.
const SLOTS: usize = 512;
static CHILDREN: [AtomicI32; SLOTS] = [const { AtomicI32::new(0) }; SLOTS];
static GUARDS: AtomicUsize = AtomicUsize::new(0);

/// Send `signal` to every registered child. Safe to call from a signal
/// handler: it only loads atomics and calls `kill(2)`.
pub fn signal_registered_children(signal: i32) {
    for slot in &CHILDREN {
        let pid = slot.load(Ordering::SeqCst);
        if pid > 0 {
            #[cfg(unix)]
            // SAFETY: `kill` with a positive pid signals that process only.
            unsafe {
                libc::kill(pid, signal);
            }
            #[cfg(not(unix))]
            let _ = signal;
        }
    }
}

/// A child's registration; dropping it removes the child from the table.
pub struct RegisteredChild {
    slot: Option<usize>,
}

impl Drop for RegisteredChild {
    fn drop(&mut self) {
        if let Some(slot) = self.slot {
            CHILDREN[slot].store(0, Ordering::SeqCst);
        }
    }
}

/// Register a running child so a signal to the runner reaches it.
pub fn register(child: &Child) -> RegisteredChild {
    let Ok(pid) = i32::try_from(child.id()) else {
        return RegisteredChild { slot: None };
    };
    #[cfg(windows)]
    windows_job::assign(child);
    for (index, slot) in CHILDREN.iter().enumerate() {
        if slot
            .compare_exchange(0, pid, Ordering::SeqCst, Ordering::SeqCst)
            .is_ok()
        {
            return RegisteredChild { slot: Some(index) };
        }
    }
    RegisteredChild { slot: None }
}

#[cfg(windows)]
mod windows_job {
    use std::process::Child;
    use std::sync::Mutex;

    use crate::process_supervision::JobHandle;

    /// One job for the guard's lifetime; children assigned to it die when the
    /// runner's handle closes, which the kernel does however the runner ends.
    static JOB: Mutex<Option<JobHandle>> = Mutex::new(None);

    fn job() -> std::sync::MutexGuard<'static, Option<JobHandle>> {
        JOB.lock().unwrap_or_else(|poisoned| poisoned.into_inner())
    }

    pub fn create() {
        // Best effort: a runner that cannot create a job runs as it did.
        if let Ok(handle) = JobHandle::new() {
            *job() = Some(handle);
        }
    }

    pub fn release() {
        // Closing the handle kills whatever is still assigned; the runner has
        // waited for every child by the time the outermost guard drops.
        *job() = None;
    }

    pub fn assign(child: &Child) {
        // A child already inside a job that forbids nesting stays outside
        // ours; the runner behaves as it did before the guard existed.
        if let Some(handle) = job().as_ref() {
            let _ = handle.assign(child);
        }
    }
}

/// `Command::output()`, with the child registered while it runs: stdin
/// closed, stdout and stderr captured, exactly as `output()` does.
pub fn output(command: &mut Command) -> io::Result<Output> {
    let child = command
        .stdin(Stdio::null())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;
    let _registered = register(&child);
    child.wait_with_output()
}

/// `Command::status()`, with the child registered while it runs.
pub fn status(command: &mut Command) -> io::Result<ExitStatus> {
    let mut child = command.spawn()?;
    let _registered = register(&child);
    child.wait()
}

#[cfg(unix)]
extern "C" fn on_signal(signal: libc::c_int) {
    signal_registered_children(libc::SIGTERM);
    // The default action, delivered once this handler returns: the runner
    // dies of the signal exactly as it did before the guard existed.
    // SAFETY: both calls are async-signal-safe; `signal` came from the kernel.
    unsafe {
        libc::signal(signal, libc::SIG_DFL);
        libc::raise(signal);
    }
}

/// Installs the handlers for the guard's lifetime and restores the previous
/// dispositions when dropped. Guards nest: only the outermost installs.
pub struct ChildSignalGuard {
    #[cfg(unix)]
    previous: Vec<(libc::c_int, libc::sighandler_t)>,
}

impl ChildSignalGuard {
    pub fn install() -> io::Result<Self> {
        #[cfg(unix)]
        {
            let mut previous = Vec::new();
            if GUARDS.fetch_add(1, Ordering::SeqCst) == 0 {
                for signal in [libc::SIGHUP, libc::SIGINT, libc::SIGTERM] {
                    // SAFETY: installs a handler that is async-signal-safe
                    // (see `on_signal`); the old disposition is kept to restore.
                    let old = unsafe {
                        libc::signal(
                            signal,
                            on_signal as extern "C" fn(libc::c_int) as libc::sighandler_t,
                        )
                    };
                    if old == libc::SIG_ERR {
                        let error = io::Error::last_os_error();
                        for (installed, disposition) in previous.drain(..).rev() {
                            // SAFETY: restores a disposition `signal` returned.
                            unsafe {
                                libc::signal(installed, disposition);
                            }
                        }
                        GUARDS.fetch_sub(1, Ordering::SeqCst);
                        return Err(error);
                    }
                    previous.push((signal, old));
                }
            }
            Ok(Self { previous })
        }
        #[cfg(not(unix))]
        {
            if GUARDS.fetch_add(1, Ordering::SeqCst) == 0 {
                #[cfg(windows)]
                windows_job::create();
            }
            Ok(Self {})
        }
    }
}

impl Drop for ChildSignalGuard {
    fn drop(&mut self) {
        #[cfg(unix)]
        for (signal, disposition) in self.previous.drain(..).rev() {
            // SAFETY: restores a disposition `signal` returned when installing.
            unsafe {
                libc::signal(signal, disposition);
            }
        }
        let outermost = GUARDS.fetch_sub(1, Ordering::SeqCst) == 1;
        #[cfg(windows)]
        if outermost {
            windows_job::release();
        }
        #[cfg(not(windows))]
        let _ = outermost;
    }
}

#[cfg(all(test, unix))]
mod tests {
    use std::process::{Command, Stdio};
    use std::time::{Duration, Instant};

    use super::*;

    fn sleeper() -> Child {
        Command::new("sleep")
            .arg("30")
            .stdin(Stdio::null())
            .stdout(Stdio::null())
            .stderr(Stdio::null())
            .spawn()
            .unwrap()
    }

    fn exits_within(child: &mut Child, limit: Duration) -> bool {
        let started = Instant::now();
        while started.elapsed() < limit {
            if child.try_wait().unwrap().is_some() {
                return true;
            }
            std::thread::sleep(Duration::from_millis(20));
        }
        false
    }

    #[test]
    fn a_registered_child_receives_the_signal_and_a_released_one_does_not() {
        let _guard = ChildSignalGuard::install().unwrap();
        let mut tracked = sleeper();
        let mut released = sleeper();
        let registration = register(&tracked);
        drop(register(&released));

        // What the handler does, without dying of the signal ourselves.
        signal_registered_children(libc::SIGTERM);

        assert!(
            exits_within(&mut tracked, Duration::from_secs(5)),
            "the registered child was not signalled"
        );
        assert!(
            released.try_wait().unwrap().is_none(),
            "a child whose registration was dropped must not be signalled"
        );
        drop(registration);
        released.kill().unwrap();
        released.wait().unwrap();
    }
}
