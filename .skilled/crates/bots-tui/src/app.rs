use std::sync::mpsc::{self, Receiver, Sender};
use std::time::{Duration, Instant};

use ratatui::backend::Backend;
use ratatui::Terminal;

use crate::cli::Program;
use crate::data::{ChatWorker, ThreadGuard, Worker};
use crate::event::EventSource;
use crate::state::{Effect, Msg, State};
use crate::Options;

/// The loop's own state, its channel ends and the worker it hands effects to.
pub struct App<'t, B: Backend> {
    terminal: &'t mut Terminal<B>,
    /// Everything the reducer reads and the view draws.
    pub state: State,
    rx: Receiver<Msg>,
    tx: Sender<Msg>,
    worker: Option<Worker>,
    chat: Option<ChatWorker>,
    opts: Options,
}

impl<'t, B: Backend> App<'t, B> {
    /// Builds the loop and starts its worker.
    pub fn new(terminal: &'t mut Terminal<B>, program: Program, opts: Options) -> App<'t, B> {
        let (tx, rx) = mpsc::channel::<Msg>();
        // The checkout names this screen's own identity, so it is read before the program moves on.
        let state = State {
            checkout: Some(program.repo.to_string_lossy().into_owned()),
            ..State::default()
        };
        // The loop thread never starts a process, so every read and write goes to the read worker
        // and every chat send to the chat worker.
        let chat = ChatWorker::spawn(program.clone(), tx.clone());
        let worker = Worker::spawn(program, tx.clone());
        App {
            terminal,
            state,
            rx,
            tx,
            worker: Some(worker),
            chat: Some(chat),
            opts,
        }
    }

    /// A second sender, for the event source and the worker.
    pub fn sender(&self) -> Sender<Msg> {
        self.tx.clone()
    }

    /// Reduces one message, hands off its effects and reports a quit.
    pub fn handle(&mut self, msg: Msg) -> Option<i32> {
        for effect in crate::state::update(&mut self.state, msg) {
            match effect {
                // A quit ends the loop at once, so nothing queued behind it is sent.
                Effect::Quit { code } => {
                    self.shutdown();
                    return Some(code);
                }
                Effect::Fetch { .. } | Effect::Answer { .. } => {
                    if let Some(worker) = &self.worker {
                        worker.submit(&effect);
                    }
                }
                Effect::ChatSend { .. } => {
                    if let Some(chat) = &self.chat {
                        chat.submit(&effect);
                    }
                }
            }
        }
        None
    }

    /// Handles worker replies, a Msg::ChatSent from the chat worker included, until nothing is in flight, false on timeout.
    pub fn settle(&mut self, deadline: Duration) -> bool {
        let started = Instant::now();
        loop {
            if self.idle() {
                return true;
            }
            let Some(left) = deadline.checked_sub(started.elapsed()) else {
                return false;
            };
            match self.rx.recv_timeout(left) {
                Ok(msg) => {
                    if self.handle(msg).is_some() {
                        return true;
                    }
                }
                Err(_) => return false,
            }
        }
    }

    /// Draws one frame from the state.
    pub fn draw(&mut self) {
        let _ = self.try_draw();
    }

    /// Stops both workers, once, however the loop leaves. The chat worker is let go, never joined.
    fn shutdown(&mut self) {
        if let Some(worker) = self.worker.take() {
            worker.shutdown();
        }
        if let Some(chat) = self.chat.take() {
            chat.shutdown();
        }
    }

    /// Whether no read is out, no answer is waiting for its reply and no chat send is out.
    fn idle(&self) -> bool {
        !self.state.status.in_flight
            && !self.state.activity.in_flight
            && !self.state.inbox.in_flight
            && !self.state.routines.in_flight
            && !self.state.chat.in_flight
            && self.state.chat_view.sending.is_none()
            && self.state.pending_answers.is_empty()
    }

    /// Draws one frame and reports a terminal that refused it.
    fn try_draw(&mut self) -> std::io::Result<()> {
        let state = &self.state;
        let opts = &self.opts;
        match self
            .terminal
            .draw(|frame| crate::view::draw(frame, state, opts))
        {
            Ok(_) => Ok(()),
            Err(error) => Err(std::io::Error::other(error.to_string())),
        }
    }
}

impl<'t, B: Backend> Drop for App<'t, B> {
    fn drop(&mut self) {
        self.shutdown();
    }
}

/// Runs the loop until it quits and returns its exit code.
pub fn run<B: Backend>(
    terminal: &mut Terminal<B>,
    events: Box<dyn EventSource>,
    program: Program,
    opts: Options,
) -> i32 {
    let mut app = App::new(terminal, program, opts);
    let tx = app.sender();
    // The input thread ends with the process, so it is never joined.
    let input = std::thread::Builder::new()
        .name("bots-ui-input".to_string())
        .spawn(move || {
            let _guard = ThreadGuard::new(tx.clone(), "input");
            events.run(tx);
        });
    if input.is_err() {
        app.shutdown();
        return 1;
    }
    if app.try_draw().is_err() {
        app.shutdown();
        return 1;
    }
    loop {
        let msg = match app.rx.recv() {
            Ok(msg) => msg,
            Err(_) => {
                app.shutdown();
                return 1;
            }
        };
        if let Some(code) = app.handle(msg) {
            return code;
        }
        // A burst of replies costs one draw, so every waiting message is taken before it.
        while let Ok(msg) = app.rx.try_recv() {
            if let Some(code) = app.handle(msg) {
                return code;
            }
        }
        if app.try_draw().is_err() {
            app.shutdown();
            return 1;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cli::{test_dir, test_program};
    use crate::event::ScriptedEvents;
    use crate::keys::Key;
    use crate::state::{BotId, ChatMode, Tab};
    use ratatui::backend::TestBackend;

    /// A terminal the loop can draw into without a real screen.
    fn test_terminal() -> Terminal<TestBackend> {
        Terminal::new(TestBackend::new(80, 24)).expect("the test terminal starts")
    }

    /// The calls the fixture logged, one per line.
    fn logged(log: &std::path::Path) -> String {
        std::fs::read_to_string(log).unwrap_or_default()
    }

    #[test]
    fn closed_input_writes_nothing() {
        let dir = test_dir("closed-input-writes-nothing");
        let log = dir.join("argv.log");
        let program = test_program(&log, "ok");
        let mut terminal = test_terminal();
        let mut app = App::new(&mut terminal, program, Options::default());

        assert_eq!(app.handle(Msg::Resize { cols: 80, rows: 24 }), None);
        assert_eq!(
            app.handle(Msg::Tick {
                now: 1_795_641_244_000
            }),
            None
        );
        assert!(app.settle(Duration::from_secs(10)));
        assert_eq!(app.state.inbox.rows.len(), 3);

        app.state.active_tab = Tab::Inbox;
        let first = app.state.inbox.rows[0].id.clone();
        app.state.inbox_view.selected = Some(first);

        assert_eq!(app.handle(Msg::InputClosed), Some(0));

        let calls = logged(&log);
        assert!(
            calls.lines().any(|line| line.starts_with("inbox --json")),
            "{calls}"
        );
        assert!(
            calls.lines().any(|line| line.starts_with("status --json")),
            "{calls}"
        );
        assert!(
            !calls.lines().any(|line| line.starts_with("answer")),
            "{calls}"
        );

        let dir = test_dir("closed-input-writes-nothing-run");
        let log = dir.join("argv.log");
        let program = test_program(&log, "ok");
        let mut terminal = test_terminal();
        let events = Box::new(ScriptedEvents::new(vec![
            Msg::Resize { cols: 80, rows: 24 },
            Msg::Tick {
                now: 1_795_641_244_000,
            },
        ]));
        assert_eq!(run(&mut terminal, events, program, Options::default()), 0);
        let calls = logged(&log);
        assert!(
            !calls.lines().any(|line| line.starts_with("answer")),
            "{calls}"
        );
    }

    #[test]
    fn empty_frame_draws() {
        let dir = test_dir("empty-frame-draws");
        let program = test_program(&dir.join("argv.log"), "ok");
        let mut terminal = test_terminal();
        {
            let mut app = App::new(&mut terminal, program, Options::default());
            app.draw();
        }
        let buffer = terminal.backend().buffer();
        for cell in buffer.content() {
            assert_eq!(cell.symbol(), " ");
        }
    }

    #[test]
    fn esc_writes_nothing() {
        let dir = test_dir("esc-writes-nothing");
        let log = dir.join("argv.log");
        let program = test_program(&log, "ok");
        let mut terminal = test_terminal();
        let mut app = App::new(&mut terminal, program, Options::default());

        assert_eq!(app.handle(Msg::Key(Key::Esc)), None);
        assert!(app.settle(Duration::from_secs(10)));

        let calls = logged(&log);
        assert!(
            !calls.lines().any(|line| line.starts_with("answer")),
            "{calls}"
        );
    }

    #[test]
    fn run_returns_the_quit_code() {
        let dir = test_dir("run-returns-the-quit-code");
        let log = dir.join("argv.log");

        let program = test_program(&log, "ok");
        let mut terminal = test_terminal();
        let events = Box::new(ScriptedEvents::new(vec![Msg::Terminate { signal: 15 }]));
        assert_eq!(run(&mut terminal, events, program, Options::default()), 143);

        let program = test_program(&log, "ok");
        let mut terminal = test_terminal();
        let events = Box::new(ScriptedEvents::new(vec![Msg::ThreadLost {
            thread: "input",
        }]));
        assert_eq!(run(&mut terminal, events, program, Options::default()), 1);
    }

    #[test]
    fn chat_send_does_not_hold_the_quit() {
        let dir = test_dir("chat-send-does-not-hold-the-quit");
        let log = dir.join("argv.log");
        let program = test_program(&log, "chat-slow");
        let mut terminal = test_terminal();
        let mut app = App::new(&mut terminal, program, Options::default());

        // A key resolves against the size, so the terminal is sized before one is sent.
        assert_eq!(app.handle(Msg::Resize { cols: 80, rows: 24 }), None);
        app.state.active_tab = Tab::Chat;
        app.state.chat_view.bot = Some(BotId("hello".into()));
        app.state.chat_view.mode = ChatMode::Typing;
        app.state.chat_view.draft = "hi".into();
        assert_eq!(app.handle(Msg::Key(Key::Enter)), None);
        // Long enough for the send to be out and the fixture to be sleeping on it.
        std::thread::sleep(Duration::from_millis(300));

        let started = Instant::now();
        assert_eq!(app.handle(Msg::Key(Key::Ctrl('d'))), Some(0));
        let elapsed = started.elapsed();
        assert!(elapsed < Duration::from_millis(500), "{elapsed:?}");

        let deadline = Instant::now() + Duration::from_secs(10);
        while Instant::now() < deadline && !logged(&log).contains("fixture-chat-done") {
            std::thread::sleep(Duration::from_millis(100));
        }
        let calls = logged(&log);
        assert!(calls.contains("fixture-chat-done"), "{calls}");
    }
}
