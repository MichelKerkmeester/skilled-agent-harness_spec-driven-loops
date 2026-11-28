use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};
use std::sync::{Arc, Mutex, Once};

/// One terminal mode the guard turns on and off.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Mode {
    /// Raw input, so a key arrives without a line ending.
    Raw,
    /// The alternate screen, so the shell's scrollback survives.
    AlternateScreen,
    /// Bracketed paste, so a paste arrives as one event.
    BracketedPaste,
    /// The hidden cursor.
    CursorHidden,
}

/// The terminal mode calls the guard makes.
pub trait Modes: Send + Sync {
    /// Turns one mode on or off.
    fn set(&self, mode: Mode, on: bool) -> std::io::Result<()>;
}

/// The production mode calls, made through crossterm.
pub struct CrosstermModes;

impl Modes for CrosstermModes {
    fn set(&self, mode: Mode, on: bool) -> std::io::Result<()> {
        match (mode, on) {
            (Mode::Raw, true) => crossterm::terminal::enable_raw_mode(),
            (Mode::Raw, false) => crossterm::terminal::disable_raw_mode(),
            (Mode::AlternateScreen, true) => {
                crossterm::execute!(std::io::stdout(), crossterm::terminal::EnterAlternateScreen)
            }
            (Mode::AlternateScreen, false) => {
                crossterm::execute!(std::io::stdout(), crossterm::terminal::LeaveAlternateScreen)
            }
            (Mode::BracketedPaste, true) => {
                crossterm::execute!(std::io::stdout(), crossterm::event::EnableBracketedPaste)
            }
            (Mode::BracketedPaste, false) => {
                crossterm::execute!(std::io::stdout(), crossterm::event::DisableBracketedPaste)
            }
            (Mode::CursorHidden, true) => {
                crossterm::execute!(std::io::stdout(), crossterm::cursor::Hide)
            }
            (Mode::CursorHidden, false) => {
                crossterm::execute!(std::io::stdout(), crossterm::cursor::Show)
            }
        }
    }
}

/// The live guard's modes and its restored flag, so the panic hook can reach them.
#[allow(clippy::type_complexity)]
static ACTIVE: Mutex<Option<(Arc<dyn Modes>, Arc<AtomicBool>)>> = Mutex::new(None);

/// Guards the one-time panic hook install.
static HOOK: Once = Once::new();

/// Turns every mode off in the order that leaves the terminal usable, and ignores each error so
/// one failure cannot skip the rest.
fn leave_all(modes: &dyn Modes) {
    for mode in [
        Mode::CursorHidden,
        Mode::BracketedPaste,
        Mode::AlternateScreen,
        Mode::Raw,
    ] {
        let _ = modes.set(mode, false);
    }
}

/// Restores from the panic hook. `try_lock` rather than `lock` keeps a panic that interrupts a
/// restore from deadlocking on the lock that restore already holds.
fn restore_active() {
    let active = match ACTIVE.try_lock() {
        Ok(active) => active,
        Err(std::sync::TryLockError::Poisoned(poisoned)) => poisoned.into_inner(),
        Err(std::sync::TryLockError::WouldBlock) => return,
    };
    if let Some((modes, restored)) = active.as_ref() {
        if !restored.swap(true, Ordering::SeqCst) {
            leave_all(modes.as_ref());
        }
    }
}

/// Restores every mode it turned on, once, however the loop leaves.
pub struct Guard {
    modes: Arc<dyn Modes>,
    restored: Arc<AtomicBool>,
}

impl Guard {
    /// Turns the modes on and returns the guard that turns them off.
    pub fn install(modes: Arc<dyn Modes>) -> std::io::Result<Guard> {
        for mode in [
            Mode::Raw,
            Mode::AlternateScreen,
            Mode::BracketedPaste,
            Mode::CursorHidden,
        ] {
            if let Err(error) = modes.set(mode, true) {
                leave_all(modes.as_ref());
                return Err(error);
            }
        }

        if let Err(error) = install_signal_handler() {
            leave_all(modes.as_ref());
            return Err(error);
        }

        let restored = Arc::new(AtomicBool::new(false));
        {
            let mut active = match ACTIVE.lock() {
                Ok(active) => active,
                Err(poisoned) => poisoned.into_inner(),
            };
            *active = Some((Arc::clone(&modes), Arc::clone(&restored)));
        }

        HOOK.call_once(|| {
            let previous = std::panic::take_hook();
            std::panic::set_hook(Box::new(move |info| {
                restore_active();
                // The previous hook runs after the restore, so the backtrace prints on a usable
                // terminal.
                previous(info);
            }));
        });

        Ok(Guard { modes, restored })
    }

    /// Turns the modes off, at most once.
    pub fn restore(&self) {
        if !self.restored.swap(true, Ordering::SeqCst) {
            leave_all(self.modes.as_ref());
        }

        let mut active = match ACTIVE.lock() {
            Ok(active) => active,
            Err(poisoned) => poisoned.into_inner(),
        };
        let mine = match active.as_ref() {
            Some((_, flag)) => Arc::ptr_eq(flag, &self.restored),
            None => false,
        };
        if mine {
            *active = None;
        }
    }
}

impl Drop for Guard {
    fn drop(&mut self) {
        self.restore();
    }
}

/// The termination signal the handler recorded, or 0 when none is pending.
static SIGNAL: AtomicI32 = AtomicI32::new(0);

/// Records the signal number and returns. It writes nothing to the terminal, because a handler
/// that wrote while the UI thread holds the output lock could deadlock.
extern "C" fn on_signal(signal: libc::c_int) {
    SIGNAL.store(signal, Ordering::SeqCst);
}

/// Installs the handler that records a termination signal.
pub fn install_signal_handler() -> std::io::Result<()> {
    for signal in [libc::SIGTERM, libc::SIGHUP, libc::SIGINT] {
        // SAFETY: `sigaction` is a plain C struct of integers and a handler pointer, so an
        // all-zero value is a valid starting point and every field is set before the call.
        let mut action: libc::sigaction = unsafe { std::mem::zeroed() };
        action.sa_sigaction = on_signal as usize;
        // SAFETY: `sa_mask` is a live `sigset_t` inside `action`, and `sigemptyset` writes only
        // into the pointer it is given.
        unsafe {
            libc::sigemptyset(&mut action.sa_mask);
        }
        action.sa_flags = 0;
        // SAFETY: `action` outlives the call and names a handler with the C calling convention,
        // and the null old-action pointer tells `sigaction` to write nothing back.
        let result = unsafe { libc::sigaction(signal, &action, std::ptr::null_mut()) };
        if result != 0 {
            return Err(std::io::Error::last_os_error());
        }
    }
    Ok(())
}

/// Takes the pending termination signal, when one arrived.
pub fn take_signal() -> Option<i32> {
    // Reading clears the flag, so one signal turns into one message.
    match SIGNAL.swap(0, Ordering::SeqCst) {
        0 => None,
        signal => Some(signal),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::Msg;

    /// The panic hook and `ACTIVE` are process-wide, so the tests run one at a time.
    static TEST_LOCK: Mutex<()> = Mutex::new(());

    struct RecordingModes {
        log: Mutex<Vec<(Mode, bool)>>,
        fail_on: Option<Mode>,
    }

    impl RecordingModes {
        fn new(fail_on: Option<Mode>) -> Self {
            Self {
                log: Mutex::new(Vec::new()),
                fail_on,
            }
        }

        fn entries(&self) -> Vec<(Mode, bool)> {
            self.log
                .lock()
                .unwrap_or_else(|error| error.into_inner())
                .clone()
        }

        fn offs(&self) -> Vec<(Mode, bool)> {
            self.entries().into_iter().filter(|(_, on)| !on).collect()
        }
    }

    impl Modes for RecordingModes {
        fn set(&self, mode: Mode, on: bool) -> std::io::Result<()> {
            self.log
                .lock()
                .unwrap_or_else(|error| error.into_inner())
                .push((mode, on));
            if on && self.fail_on == Some(mode) {
                return Err(std::io::Error::other("recording modes refused"));
            }
            Ok(())
        }
    }

    fn serial() -> std::sync::MutexGuard<'static, ()> {
        TEST_LOCK.lock().unwrap_or_else(|error| error.into_inner())
    }

    fn clear_active() {
        let mut active = ACTIVE.lock().unwrap_or_else(|error| error.into_inner());
        *active = None;
    }

    fn four_offs() -> Vec<(Mode, bool)> {
        vec![
            (Mode::CursorHidden, false),
            (Mode::BracketedPaste, false),
            (Mode::AlternateScreen, false),
            (Mode::Raw, false),
        ]
    }

    #[test]
    fn restore_runs_on_exit() {
        let _serial = serial();
        clear_active();
        let modes = Arc::new(RecordingModes::new(None));
        let dyn_modes: Arc<dyn Modes> = modes.clone();
        let guard = Guard::install(dyn_modes).unwrap();
        drop(guard);
        assert_eq!(
            modes.entries(),
            vec![
                (Mode::Raw, true),
                (Mode::AlternateScreen, true),
                (Mode::BracketedPaste, true),
                (Mode::CursorHidden, true),
                (Mode::CursorHidden, false),
                (Mode::BracketedPaste, false),
                (Mode::AlternateScreen, false),
                (Mode::Raw, false),
            ]
        );
    }

    #[test]
    fn restore_runs_on_panic() {
        let _serial = serial();
        clear_active();
        let modes = Arc::new(RecordingModes::new(None));
        let dyn_modes: Arc<dyn Modes> = modes.clone();
        let guard = Guard::install(dyn_modes).unwrap();
        let result = std::panic::catch_unwind(|| panic!("guard test panic"));
        assert!(result.is_err());
        assert_eq!(modes.offs(), four_offs());
        drop(guard);
        assert_eq!(modes.offs().len(), 4);
    }

    #[test]
    fn restore_is_idempotent() {
        let _serial = serial();
        clear_active();
        let modes = Arc::new(RecordingModes::new(None));
        let dyn_modes: Arc<dyn Modes> = modes.clone();
        let guard = Guard::install(dyn_modes).unwrap();
        guard.restore();
        guard.restore();
        drop(guard);
        assert_eq!(modes.offs().len(), 4);
    }

    #[test]
    fn enter_failure_restores() {
        let _serial = serial();
        clear_active();
        let modes = Arc::new(RecordingModes::new(Some(Mode::BracketedPaste)));
        let dyn_modes: Arc<dyn Modes> = modes.clone();
        let result = Guard::install(dyn_modes);
        assert!(result.is_err());
        assert_eq!(
            modes.entries(),
            vec![
                (Mode::Raw, true),
                (Mode::AlternateScreen, true),
                (Mode::BracketedPaste, true),
                (Mode::CursorHidden, false),
                (Mode::BracketedPaste, false),
                (Mode::AlternateScreen, false),
                (Mode::Raw, false),
            ]
        );
    }

    #[test]
    fn signal_becomes_terminate_event() {
        let _serial = serial();
        install_signal_handler().unwrap();
        // A signal left by an earlier test would otherwise be the one this test reads.
        let _ = take_signal();
        // SAFETY: the handler only stores the number into an atomic, so raising the signal
        // records it instead of ending the test process.
        unsafe {
            libc::raise(libc::SIGTERM);
        }
        let message = crate::event::signal_message();
        assert_eq!(
            message,
            Some(Msg::Terminate {
                signal: libc::SIGTERM
            })
        );
        assert_eq!(take_signal(), None);

        let mut terminal =
            ratatui::Terminal::new(ratatui::backend::TestBackend::new(80, 24)).unwrap();
        let log = crate::cli::test_dir("signal_becomes_terminate_event").join("argv.log");
        let code = crate::app::run(
            &mut terminal,
            Box::new(crate::event::ScriptedEvents::new(vec![message.unwrap()])),
            crate::cli::test_program(&log, "ok"),
            crate::Options::default(),
        );
        assert_eq!(code, 128 + libc::SIGTERM);
    }
}
