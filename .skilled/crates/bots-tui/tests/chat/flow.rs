//! The chat flows: the send's exit routing, the four footer lines, the chat worker beside the
//! reads, the quit with a send out and one send read back through the transcript.

use std::sync::atomic::AtomicBool;
use std::time::{Duration, Instant};

use bots_tui::app::App;
use bots_tui::cli::{chat_send, chat_transcript};
use bots_tui::keys::{self, FooterLine, Key};
use bots_tui::state::{
    cond, context_stack, update, ChatMode, Effect, Msg, Payload, Size, Source, State, StatusLine,
    Surface, Tab,
};
use bots_tui::view::footer;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

use super::common::fixture::{fixture, Fixture};
use super::support::*;

/// A state at one size on the chat tab with the transcript fixture landed, so a flow test starts
/// from the rows the pane draws.
fn chat_state(cols: u16, rows: u16) -> State {
    let mut state = base(cols, rows);
    land_chat(&mut state, "chat-transcript.json");
    state
}

/// The loop on the chat tab at 80x24 with the bot chosen, so a key resolves against a real size.
fn app_on_chat<'t>(terminal: &'t mut Terminal<TestBackend>, fx: &Fixture) -> App<'t, TestBackend> {
    let mut app = App::new(terminal, fx.program.clone(), Options::default());
    app.state.size = Size { cols: 80, rows: 24 };
    app.state.active_tab = Tab::Chat;
    app.state.chat_view.bot = Some(hello());
    app
}

/// Polls the fixture log until one line contains the needle, so a test waits on the child rather
/// than on a fixed sleep.
fn wait_for_line(fx: &Fixture, needle: &str, limit: Duration) -> bool {
    let started = Instant::now();
    loop {
        if fx.logged().iter().any(|line| line.contains(needle)) {
            return true;
        }
        if started.elapsed() >= limit {
            return false;
        }
        std::thread::sleep(Duration::from_millis(100));
    }
}

/// Kills the process group a sleeping fixture send leads, so no send outlives its test.
fn kill_group_of(fx: &Fixture) {
    let pgid = fx.logged().iter().find_map(|line| {
        line.strip_prefix("fixture-chat-pgid ")
            .and_then(|rest| rest.split_whitespace().next())
            .map(str::to_string)
    });
    let Some(pgid) = pgid else {
        return;
    };
    let _ = std::process::Command::new("kill")
        .arg("-TERM")
        .arg(format!("-{pgid}"))
        .status();
}

/// Runs the real send against one fixture scenario and reduces its outcome, so a test reads the
/// routing the screen takes rather than a hand-built result.
fn sent(name: &str, scenario: &str) -> (State, Vec<Effect>) {
    let fx = fixture(name, scenario);
    let outcome = chat_send(&fx.program, &hello(), "is the release ready?");
    let mut state = chat_state(80, 24);
    state.chat_view.mode = ChatMode::Typing;
    state.chat_view.sending = Some("is the release ready?".to_string());
    state.chat_view.draft = String::new();
    let effects = update(
        &mut state,
        Msg::ChatSent {
            bot: hello(),
            text: "is the release ready?".to_string(),
            outcome,
        },
    );
    (state, effects)
}

/// Asserts every chat row bound where the state stands draws its label on one of the two lines.
fn assert_labels_drawn(state: &State, one: &str, two: &str) {
    let stack = context_stack(state);
    let facts = cond(state);
    for row in keys::CHAT_ROWS {
        if !stack.contains(&row.context) || !keys::row_holds(row, &facts) {
            continue;
        }
        assert!(
            one.contains(row.label) || two.contains(row.label),
            "the {:?} row labelled {:?} is not drawn: {one:?} / {two:?}",
            row.context,
            row.label
        );
    }
}

/// A send that exited 0 appended a message, so the transcript is read again.
#[test]
fn exit_0_reads_the_transcript_again() {
    let (state, effects) = sent("chat-exit-0", "ok");
    assert_eq!(
        effects,
        vec![Effect::Fetch {
            surface: Surface::Chat,
            bot: Some(hello()),
            generation: state.chat.generation,
        }]
    );
    assert_eq!(state.chat_view.sending, None);
    assert_eq!(state.chat_view.draft, "");
    assert_eq!(state.last_error, None);
}

/// A send that exited 5 parked its reply, so the transcript is read again and nothing is reported.
#[test]
fn exit_5_reads_the_parked_reply() {
    let (state, effects) = sent("chat-exit-5", "chat-park");
    assert_eq!(
        effects,
        vec![Effect::Fetch {
            surface: Surface::Chat,
            bot: Some(hello()),
            generation: state.chat.generation,
        }]
    );
    assert_eq!(state.last_error, None);
}

/// A send that exited 1 appended a failed reply, so the transcript is read again and the line is named.
#[test]
fn exit_1_reads_the_failure_and_names_it() {
    let (state, effects) = sent("chat-exit-1", "chat-fail");
    assert_eq!(
        effects,
        vec![Effect::Fetch {
            surface: Surface::Chat,
            bot: Some(hello()),
            generation: state.chat.generation,
        }]
    );
    assert_eq!(
        state.last_error,
        Some(StatusLine {
            source: Source::ChatSend,
            text: "bots: chat --message exited 1: executor exited 1".to_string(),
        })
    );
}

/// A send that exited 2 appended nothing, so the draft comes back to be edited and sent again.
#[test]
fn exit_2_puts_the_draft_back() {
    let (state, effects) = sent("chat-exit-2", "chat-usage");
    assert!(effects.is_empty(), "{effects:?}");
    assert_eq!(state.chat_view.draft, "is the release ready?");
    assert_eq!(
        state.last_error,
        Some(StatusLine {
            source: Source::ChatSend,
            text: "bots: chat: the message is empty".to_string(),
        })
    );
    assert_eq!(state.chat_view.mode, ChatMode::Typing);
}

/// A send that exited 4 appended nothing, so the draft comes back and Enter sends it once more.
#[test]
fn exit_4_puts_the_draft_back_and_sends_once_more() {
    let (mut state, effects) = sent("chat-exit-4", "chat-refuse-body-secret");
    assert!(effects.is_empty(), "{effects:?}");
    assert_eq!(state.chat_view.draft, "is the release ready?");
    assert_eq!(
        state.last_error,
        Some(StatusLine {
            source: Source::ChatSend,
            text: "bots: body-secret".to_string(),
        })
    );
    assert_eq!(
        update(&mut state, Msg::Key(Key::Enter)),
        vec![Effect::ChatSend {
            bot: hello(),
            text: "is the release ready?".to_string(),
        }]
    );
}

/// The main context draws the shell's keys and the chat pane's scroll, type and picker keys.
#[test]
fn keys_main_lines() {
    let state = chat_state(80, 24);
    let one = footer::key_line(&state, FooterLine::One, 80);
    let two = footer::key_line(&state, FooterLine::Two, 80);
    assert_eq!(
        one,
        "Alt+1..4 tabs · [ ] cycle · ↑↓ scroll · PgUp/PgDn page · Enter type"
    );
    assert_eq!(two, "Ctrl+P/? commands · b bot · Ctrl+C exit · Ctrl+D exit");
    assert_labels_drawn(&state, &one, &two);
}

/// Typing draws the send key and the draft keys, and the quit keys stay on the second line.
#[test]
fn keys_typing_lines() {
    let mut state = chat_state(80, 24);
    state.chat_view.mode = ChatMode::Typing;
    let one = footer::key_line(&state, FooterLine::One, 80);
    let two = footer::key_line(&state, FooterLine::Two, 80);
    assert_eq!(
        one,
        "type message · Enter send · ↑↓ history · Bksp delete · Esc leave"
    );
    assert_eq!(two, "Ctrl+C leave · Ctrl+D exit");
    assert_labels_drawn(&state, &one, &two);
}

/// A send in flight drops the send key, so Enter cannot queue a second line behind the first.
#[test]
fn keys_sending_lines() {
    let mut state = chat_state(80, 24);
    state.chat_view.mode = ChatMode::Typing;
    state.chat_view.sending = Some("hi".to_string());
    let one = footer::key_line(&state, FooterLine::One, 80);
    let two = footer::key_line(&state, FooterLine::Two, 80);
    assert_eq!(one, "type message · ↑↓ history · Bksp delete · Esc leave");
    assert_eq!(two, "Ctrl+C leave · Ctrl+D exit");
    assert_labels_drawn(&state, &one, &two);
}

/// The picker draws its own select, choose and close keys in place of the typing ones.
#[test]
fn keys_picking_lines() {
    let mut state = chat_state(80, 24);
    state.chat_view.mode = ChatMode::Picking;
    let one = footer::key_line(&state, FooterLine::One, 80);
    let two = footer::key_line(&state, FooterLine::Two, 80);
    assert_eq!(one, "↑↓ select · Enter choose · Esc close");
    assert_eq!(two, "Ctrl+C close · Ctrl+D exit");
    assert_labels_drawn(&state, &one, &two);
}

/// The reads keep landing while a send is out, so the header's index age moves on under it.
#[test]
fn worker_reads_go_on_while_a_send_is_out() {
    let fx = fixture("chat-worker-reads", "chat-sleep");
    let mut terminal = Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
    let mut app = app_on_chat(&mut terminal, &fx);
    app.state.chat_view.mode = ChatMode::Typing;
    app.state.chat_view.draft = "hi".to_string();
    assert_eq!(app.handle(Msg::Key(Key::Enter)), None);
    // Long enough for the send to be out and the fixture to be sleeping on it.
    std::thread::sleep(Duration::from_millis(300));

    assert_eq!(app.handle(Msg::Tick { now: now() }), None);
    assert!(
        !app.settle(Duration::from_secs(3)),
        "the send is still out, so the loop is not idle"
    );
    assert_eq!(app.state.status.last_ok_at, Some(now()));
    assert!(app.state.chat_view.sending.is_some());
    let header = &draw_frame(&app.state, 80, 24)[0];
    assert!(header.contains("index"), "{header}");

    assert_eq!(
        app.handle(Msg::Tick {
            now: now() + 60_000
        }),
        None
    );
    let _ = app.settle(Duration::from_secs(3));
    let header = &draw_frame(&app.state, 80, 24)[0];
    assert!(header.contains("1m ago"), "{header}");

    kill_group_of(&fx);
}

/// A send has no deadline of its own and leads its own process group, so a quit never reaches it.
#[test]
fn worker_send_has_no_deadline_and_its_own_group() {
    let fx = fixture("chat-worker-send", "chat-slow");
    let mut program = fx.program.clone();
    program.read_timeout = Duration::from_secs(1);
    program.answer_timeout = Duration::from_secs(1);

    let started = Instant::now();
    let outcome = chat_send(&program, &hello(), "hi").expect("the fixture answers");
    let elapsed = started.elapsed();
    assert_eq!(outcome.code, 0);
    assert!(elapsed >= Duration::from_secs(2), "{elapsed:?}");

    let logged = fx.logged();
    assert!(
        logged.iter().any(|line| line == "fixture-chat-done"),
        "{logged:?}"
    );
    let group = logged
        .iter()
        .find(|line| line.starts_with("fixture-chat-pgid "))
        .expect("the fixture logs its process group");
    let mut parts = group.split_whitespace();
    assert_eq!(parts.next(), Some("fixture-chat-pgid"));
    let pgid = parts.next().expect("the line names a pgid");
    let pid = parts.next().expect("the line names a pid");
    assert_eq!(pgid, pid, "the send leads its own group: {group}");
    assert!(
        logged
            .iter()
            .any(|line| line == "fixture-chat-fds stdout=null"),
        "{logged:?}"
    );
}

/// A quit returns at once while a chat send is out, and the send still appends its reply.
#[test]
fn quit_does_not_wait_for_a_chat_send() {
    let fx = fixture("chat-quit", "chat-slow");
    let mut terminal = Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
    let mut app = app_on_chat(&mut terminal, &fx);
    app.state.chat_view.mode = ChatMode::Typing;
    app.state.chat_view.draft = "hi".to_string();
    assert_eq!(app.handle(Msg::Key(Key::Enter)), None);
    // Long enough for the send to be out and the fixture to be sleeping on it.
    std::thread::sleep(Duration::from_millis(300));

    let started = Instant::now();
    assert_eq!(app.handle(Msg::Key(Key::Ctrl('d'))), Some(0));
    let elapsed = started.elapsed();
    assert!(elapsed < Duration::from_millis(500), "{elapsed:?}");
    drop(app);

    assert!(
        wait_for_line(&fx, "fixture-chat-done", Duration::from_secs(10)),
        "{:?}",
        fx.logged()
    );
    let logged = fx.logged();
    assert!(
        logged
            .iter()
            .any(|line| line.contains("chat --message - --repo") && line.ends_with("-- hello")),
        "{logged:?}"
    );
}

/// A paste joins its lines into the draft with one space each and never sends.
#[test]
fn paste_joins_lines_into_the_draft() {
    let mut state = chat_state(80, 24);
    state.chat_view.mode = ChatMode::Typing;
    state.chat_view.draft = "a".to_string();
    let effects = update(&mut state, Msg::Paste("b\nc\r\nd".to_string()));
    assert!(effects.is_empty(), "{effects:?}");
    assert_eq!(state.chat_view.draft, "ab c  d");
}

/// A line typed in the chat tab is appended, read back by the reducer and read back by the verb.
#[test]
fn send_reads_back_through_the_transcript() {
    let fx = fixture("chat-send-reads-back", "ok");
    let mut terminal = Terminal::new(TestBackend::new(80, 24)).expect("the test terminal opens");
    let mut app = app_on_chat(&mut terminal, &fx);
    assert_eq!(app.handle(Msg::Tick { now: now() }), None);
    assert!(app.settle(Duration::from_secs(10)), "the first reads land");

    let drawn = draw_frame(&app.state, 80, 24).join("\n");
    assert!(
        drawn.contains("what changed on main since yesterday?"),
        "{drawn}"
    );
    assert!(
        drawn.contains("Three merges: the lint fix, the changelog and the CI cache bump."),
        "{drawn}"
    );

    assert_eq!(app.handle(Msg::Key(Key::Enter)), None);
    for c in ['h', 'e', 'l', 'l', 'o'] {
        assert_eq!(app.handle(Msg::Key(Key::Char(c))), None);
    }
    assert_eq!(app.handle(Msg::Key(Key::Enter)), None);
    assert!(
        app.settle(Duration::from_secs(10)),
        "the send and its read land"
    );

    let texts: Vec<&str> = app
        .state
        .chat
        .rows
        .messages
        .iter()
        .map(|message| message.text.as_str())
        .collect();
    assert!(texts.ends_with(&["hello", "fixture reply"]), "{texts:?}");

    let read = chat_transcript(&fx.program, &hello(), &AtomicBool::new(false))
        .expect("the transcript reads");
    match read.payload {
        Payload::Chat(transcript) => {
            let len = transcript.messages.len();
            assert_eq!(transcript.messages[len - 2].text, "hello");
        }
        other => panic!("the chat read carries a transcript, not {other:?}"),
    }
}
