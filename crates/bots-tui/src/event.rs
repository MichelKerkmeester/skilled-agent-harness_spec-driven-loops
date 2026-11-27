use std::sync::mpsc::Sender;
use std::time::{Duration, Instant, SystemTime, UNIX_EPOCH};

use crossterm::event::{Event, KeyCode, KeyEvent, KeyEventKind, KeyModifiers};

use crate::keys::Key;
use crate::state::{EpochMs, Msg};

/// How long one poll waits for an event before the loop looks at its other work.
const POLL_INTERVAL: Duration = Duration::from_millis(100);

/// How much time passes between two ticks.
const TICK_INTERVAL: Duration = Duration::from_secs(1);

/// A source of messages, run on a thread of its own.
pub trait EventSource: Send {
    /// Sends messages until the source is done.
    fn run(self: Box<Self>, tx: Sender<Msg>);
}

/// The clock the event source stamps its ticks with.
pub trait Clock: Send {
    /// Milliseconds since the Unix epoch.
    fn now(&self) -> EpochMs;
}

/// The production clock, read from the system time.
pub struct SystemClock;

impl Clock for SystemClock {
    fn now(&self) -> EpochMs {
        match SystemTime::now().duration_since(UNIX_EPOCH) {
            Ok(elapsed) => elapsed.as_millis() as EpochMs,
            Err(_) => 0,
        }
    }
}

/// The production event source, crossterm polled at a fixed interval.
pub struct TerminalEvents {
    clock: Box<dyn Clock>,
}

impl TerminalEvents {
    /// Builds the source around the clock its ticks carry.
    pub fn new(clock: Box<dyn Clock>) -> TerminalEvents {
        TerminalEvents { clock }
    }
}

impl EventSource for TerminalEvents {
    fn run(self: Box<Self>, tx: Sender<Msg>) {
        let Ok((cols, rows)) = crossterm::terminal::size() else {
            let _ = tx.send(Msg::InputClosed);
            return;
        };
        if tx.send(Msg::Resize { cols, rows }).is_err() {
            return;
        }
        if tx
            .send(Msg::Tick {
                now: self.clock.now(),
            })
            .is_err()
        {
            return;
        }
        // The tick is measured on the monotonic clock, so a wall clock jump cannot stall it
        // or flood it.
        let mut last_tick = Instant::now();
        loop {
            if let Some(message) = signal_message() {
                let _ = tx.send(message);
                return;
            }
            match crossterm::event::poll(POLL_INTERVAL) {
                Ok(true) => {
                    let Ok(event) = crossterm::event::read() else {
                        let _ = tx.send(Msg::InputClosed);
                        return;
                    };
                    if map_event(event).is_some_and(|message| tx.send(message).is_err()) {
                        return;
                    }
                }
                Ok(false) => {}
                // A poll error means the terminal went away, so the loop reports closed input.
                Err(_) => {
                    let _ = tx.send(Msg::InputClosed);
                    return;
                }
            }
            if last_tick.elapsed() >= TICK_INTERVAL {
                if tx
                    .send(Msg::Tick {
                        now: self.clock.now(),
                    })
                    .is_err()
                {
                    return;
                }
                last_tick = Instant::now();
            }
        }
    }
}

/// A source that sends a fixed list of messages, then closes the input.
pub struct ScriptedEvents {
    steps: Vec<Msg>,
}

impl ScriptedEvents {
    /// Builds the source around the messages it sends in order.
    pub fn new(steps: Vec<Msg>) -> ScriptedEvents {
        ScriptedEvents { steps }
    }
}

impl EventSource for ScriptedEvents {
    fn run(self: Box<Self>, tx: Sender<Msg>) {
        let ScriptedEvents { steps } = *self;
        for step in steps {
            if tx.send(step).is_err() {
                return;
            }
        }
        let _ = tx.send(Msg::InputClosed);
    }
}

/// Maps one crossterm key event to the key the reducer reads.
pub fn map_key(event: KeyEvent) -> Option<Key> {
    // A release arrives only on a terminal that reports event types, and the screen binds
    // presses.
    if matches!(event.kind, KeyEventKind::Release) {
        return None;
    }
    let key = match event.code {
        KeyCode::Char(c) if event.modifiers.contains(KeyModifiers::ALT) => Key::Alt(c),
        KeyCode::Char(c) if event.modifiers.contains(KeyModifiers::CONTROL) => {
            Key::Ctrl(c.to_ascii_lowercase())
        }
        KeyCode::Char(c) => Key::Char(c),
        KeyCode::Enter => Key::Enter,
        KeyCode::Esc => Key::Esc,
        KeyCode::Backspace => Key::Backspace,
        KeyCode::Up => Key::Up,
        KeyCode::Down => Key::Down,
        KeyCode::PageUp => Key::PageUp,
        KeyCode::PageDown => Key::PageDown,
        _ => Key::Other,
    };
    Some(key)
}

/// Maps one crossterm event to the message the loop reduces.
pub fn map_event(event: Event) -> Option<Msg> {
    match event {
        Event::Key(key) => map_key(key).map(Msg::Key),
        // A paste stays one message, so a pasted line feed cannot open a row and a pasted y
        // cannot approve.
        Event::Paste(text) => Some(Msg::Paste(text)),
        Event::Resize(cols, rows) => Some(Msg::Resize { cols, rows }),
        _ => None,
    }
}

/// The message a termination signal turns into, when one is pending.
pub fn signal_message() -> Option<Msg> {
    crate::terminal::take_signal().map(|signal| Msg::Terminate { signal })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn closed_input_is_one_event() {
        let (tx, rx) = std::sync::mpsc::channel();
        Box::new(ScriptedEvents::new(vec![])).run(tx);
        let got: Vec<Msg> = rx.try_iter().collect();
        assert_eq!(got, vec![Msg::InputClosed]);

        let (tx, rx) = std::sync::mpsc::channel();
        Box::new(ScriptedEvents::new(vec![Msg::Key(Key::Down)])).run(tx);
        let got: Vec<Msg> = rx.try_iter().collect();
        assert_eq!(got, vec![Msg::Key(Key::Down), Msg::InputClosed]);
    }

    #[test]
    fn paste_is_one_event() {
        let event = Event::Paste("y\nline two".to_string());
        assert_eq!(
            map_event(event),
            Some(Msg::Paste("y\nline two".to_string()))
        );
    }

    #[test]
    fn keys_map_to_the_table_keys() {
        let alt_two = KeyEvent::new(KeyCode::Char('2'), KeyModifiers::ALT);
        assert_eq!(map_key(alt_two), Some(Key::Alt('2')));

        let ctrl_c = KeyEvent::new(KeyCode::Char('C'), KeyModifiers::CONTROL);
        assert_eq!(map_key(ctrl_c), Some(Key::Ctrl('c')));

        let plain_y = KeyEvent::new(KeyCode::Char('y'), KeyModifiers::NONE);
        assert_eq!(map_key(plain_y), Some(Key::Char('y')));

        let enter = KeyEvent::new(KeyCode::Enter, KeyModifiers::NONE);
        assert_eq!(map_key(enter), Some(Key::Enter));

        let f5 = KeyEvent::new(KeyCode::F(5), KeyModifiers::NONE);
        assert_eq!(map_key(f5), Some(Key::Other));
    }

    #[test]
    fn release_is_ignored() {
        let event = KeyEvent::new_with_kind(
            KeyCode::Char('y'),
            KeyModifiers::NONE,
            KeyEventKind::Release,
        );
        assert_eq!(map_key(event), None);
    }
}
