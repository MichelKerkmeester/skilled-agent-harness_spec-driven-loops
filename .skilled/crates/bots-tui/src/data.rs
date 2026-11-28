use std::collections::VecDeque;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::mpsc::{self, Receiver, Sender};
use std::sync::Arc;
use std::thread::JoinHandle;

use crate::cli::{self, Program};
use crate::state::{BotId, Effect, FailKind, ItemId, Msg, ReadError, Scope, Surface};

/// One unit of work the worker thread runs.
#[derive(Clone, Debug, PartialEq)]
pub enum Job {
    /// One read of one surface.
    Fetch {
        /// The surface to read.
        surface: Surface,
        /// The chosen bot, present only for the chat surface.
        bot: Option<BotId>,
        /// The generation the read is issued at.
        generation: u64,
    },
    /// The one write.
    Answer {
        /// The answered item.
        id: ItemId,
        /// The text the answer carries.
        text: String,
        /// The scope the answer carries.
        scope: Scope,
    },
}

/// The thread that runs every call, so the loop never blocks on one.
pub struct Worker {
    jobs: Option<Sender<Job>>,
    shutting_down: Arc<AtomicBool>,
    handle: Option<JoinHandle<()>>,
}

impl Worker {
    /// Starts the worker thread and returns the handle the loop keeps.
    ///
    /// The thread is named, so a panic report says which one died, and it
    /// holds a guard that reports the loss on the message channel. A thread
    /// that cannot start leaves no handle, and every later submit is dropped
    /// because the job channel has no receiver.
    pub fn spawn(program: Program, tx: Sender<Msg>) -> Worker {
        let (jobs, queue) = mpsc::channel::<Job>();
        let shutting_down = Arc::new(AtomicBool::new(false));
        let flag = Arc::clone(&shutting_down);
        let handle = std::thread::Builder::new()
            .name("bots-ui-worker".to_string())
            .spawn(move || run(program, queue, tx, flag))
            .ok();
        Worker {
            jobs: Some(jobs),
            shutting_down,
            handle,
        }
    }

    /// Hands one effect to the worker, when the effect is a call.
    ///
    /// The send never blocks and never starts a thread, so the caller's
    /// thread only ever queues work. A closed channel means the worker has
    /// gone, and that loss reaches the loop through the guard instead.
    pub fn submit(&self, effect: &Effect) {
        let job = match effect {
            Effect::Fetch {
                surface,
                bot,
                generation,
            } => Job::Fetch {
                surface: *surface,
                bot: bot.clone(),
                generation: *generation,
            },
            Effect::Answer { id, text, scope } => Job::Answer {
                id: id.clone(),
                text: text.clone(),
                scope: *scope,
            },
            Effect::ChatSend { .. } => return,
            Effect::Quit { .. } => return,
        };
        if let Some(jobs) = &self.jobs {
            let _ = jobs.send(job);
        }
    }

    /// Stops the worker and waits for its thread.
    ///
    /// The flag stops a read that is already running and the dropped sender
    /// ends a thread that is waiting for work. A join error is ignored,
    /// because a panicked worker has already reported itself through its
    /// guard.
    pub fn shutdown(self) {
        self.shutting_down.store(true, Ordering::Relaxed);
        drop(self.jobs);
        if let Some(handle) = self.handle {
            let _ = handle.join();
        }
    }
}

/// The worker thread's whole life, from the first job to the closed channel.
///
/// One job runs at a time, so a reply always describes the state the next job
/// starts from. Every waiting job moves into a local queue before the next one
/// is picked, so an answer that arrived while a read ran is seen and taken
/// ahead of the reads behind it.
fn run(program: Program, jobs: Receiver<Job>, tx: Sender<Msg>, shutting_down: Arc<AtomicBool>) {
    let _guard = ThreadGuard::new(tx.clone(), "worker");
    let mut queue: VecDeque<Job> = VecDeque::new();
    loop {
        match jobs.recv() {
            Ok(job) => queue.push_back(job),
            // The loop dropped its sender, so no further job can arrive.
            Err(_) => return,
        }
        drain_waiting(&jobs, &mut queue);
        while !queue.is_empty() {
            if shutting_down.load(Ordering::Relaxed) {
                abandon(&program, queue);
                return;
            }
            let index = first_answer(&queue);
            if let Some(job) = queue.remove(index) {
                run_job(&program, &tx, &shutting_down, job);
            }
            drain_waiting(&jobs, &mut queue);
        }
    }
}

/// Moves every job already waiting into the local queue.
fn drain_waiting(jobs: &Receiver<Job>, queue: &mut VecDeque<Job>) {
    while let Ok(job) = jobs.try_recv() {
        queue.push_back(job);
    }
}

/// The index of the first answer in the queue, or the front when none waits.
fn first_answer(queue: &VecDeque<Job>) -> usize {
    queue
        .iter()
        .position(|job| matches!(job, Job::Answer { .. }))
        .unwrap_or(0)
}

/// Runs one job and sends its reply, ignoring a send nobody reads.
fn run_job(program: &Program, tx: &Sender<Msg>, shutting_down: &AtomicBool, job: Job) {
    match job {
        Job::Fetch {
            surface,
            bot,
            generation,
        } => {
            // The chat read is the one read that names a bot, so it takes its own call.
            let outcome = match (surface, bot) {
                (Surface::Chat, Some(bot)) => cli::chat_transcript(program, &bot, shutting_down),
                (Surface::Chat, None) => Err(ReadError {
                    kind: FailKind::Spawn,
                    line: "bots-ui: chat --transcript --json needs a bot".to_string(),
                }),
                (surface, _) => cli::read(program, surface, shutting_down),
            };
            let _ = tx.send(Msg::Fetched {
                surface,
                generation,
                outcome,
            });
        }
        Job::Answer { id, text, scope } => {
            let outcome = cli::answer(program, &id, &text, scope, shutting_down);
            let _ = tx.send(Msg::Answered {
                id,
                text,
                scope,
                outcome,
            });
        }
    }
}

/// Ends the queue at quit: reads are dropped and answers are started detached.
///
/// A detached answer is never waited for, because the write outlives the
/// screen and the quit path must not hold it open. A read that is already
/// running is stopped by the flag the call watches, so nothing here waits on
/// one either.
fn abandon(program: &Program, queue: VecDeque<Job>) {
    for job in queue {
        if let Job::Answer { id, text, scope } = job {
            let _ = cli::answer_detached(program, &id, &text, scope);
        }
    }
}

/// One chat send the chat worker runs.
#[derive(Clone, Debug, PartialEq)]
pub struct ChatJob {
    /// The bot the send is addressed to.
    pub bot: BotId,
    /// The trimmed draft.
    pub text: String,
}

/// The thread that runs chat sends, so a bot run that lasts minutes never holds a read.
pub struct ChatWorker {
    jobs: Option<Sender<ChatJob>>,
    handle: Option<JoinHandle<()>>,
}

impl ChatWorker {
    /// Starts the chat worker thread beside the read worker.
    ///
    /// The thread is named and holds a guard that reports a panic on the message channel, as the
    /// read worker does.
    pub fn spawn(program: Program, tx: Sender<Msg>) -> ChatWorker {
        let (jobs, queue) = mpsc::channel::<ChatJob>();
        let handle = std::thread::Builder::new()
            .name("bots-ui-chat".to_string())
            .spawn(move || run_chat(program, queue, tx))
            .ok();
        ChatWorker {
            jobs: Some(jobs),
            handle,
        }
    }

    /// Hands one chat send to the chat worker, and ignores every other effect.
    pub fn submit(&self, effect: &Effect) {
        let job = match effect {
            Effect::ChatSend { bot, text } => ChatJob {
                bot: bot.clone(),
                text: text.clone(),
            },
            _ => return,
        };
        if let Some(jobs) = &self.jobs {
            let _ = jobs.send(job);
        }
    }

    /// Drops the job sender and returns at once, without joining the thread.
    ///
    /// A send in flight runs on in its own process group and appends its reply to the
    /// conversation file, so quitting never waits for it.
    pub fn shutdown(self) {
        drop(self.jobs);
        drop(self.handle);
    }
}

/// The chat worker thread's whole life: one send at a time until the job channel closes.
fn run_chat(program: Program, jobs: Receiver<ChatJob>, tx: Sender<Msg>) {
    let _guard = ThreadGuard::new(tx.clone(), "chat");
    while let Ok(job) = jobs.recv() {
        let outcome = cli::chat_send(&program, &job.bot, &job.text);
        let _ = tx.send(Msg::ChatSent {
            bot: job.bot,
            text: job.text,
            outcome,
        });
    }
}

/// Reports a thread that died by panicking, so the loop can leave with 1.
pub struct ThreadGuard {
    tx: Sender<Msg>,
    thread: &'static str,
}

impl ThreadGuard {
    /// Builds the guard around the channel and the thread's name.
    pub fn new(tx: Sender<Msg>, thread: &'static str) -> ThreadGuard {
        ThreadGuard { tx, thread }
    }
}

impl Drop for ThreadGuard {
    fn drop(&mut self) {
        if std::thread::panicking() {
            let _ = self.tx.send(Msg::ThreadLost {
                thread: self.thread,
            });
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::cli::{test_dir, test_program};
    use crate::state::{ChatOk, FailKind};
    use std::path::Path;
    use std::time::{Duration, Instant};

    /// The verbs the fixture logged, in the order it logged them.
    fn logged_verbs(log: &Path) -> Vec<String> {
        std::fs::read_to_string(log)
            .unwrap_or_default()
            .lines()
            .filter_map(|line| line.split_whitespace().next().map(str::to_string))
            .collect()
    }

    /// The next message the worker sends, or a panic when none arrives.
    fn next(rx: &Receiver<Msg>) -> Msg {
        rx.recv_timeout(Duration::from_secs(15))
            .expect("the worker replies")
    }

    #[test]
    fn answer_jumps_queued_reads() {
        let dir = test_dir("answer-jumps-queued-reads");
        let log = dir.join("argv.log");
        let program = test_program(&log, "slow");
        let (tx, rx) = mpsc::channel::<Msg>();
        let worker = Worker::spawn(program, tx);

        worker.submit(&Effect::Fetch {
            surface: Surface::Status,
            bot: None,
            generation: 1,
        });
        // Long enough for the worker to have started the status read, so the
        // three jobs below are queued behind a read that is already running.
        std::thread::sleep(Duration::from_millis(300));
        worker.submit(&Effect::Fetch {
            surface: Surface::Activity,
            bot: None,
            generation: 1,
        });
        worker.submit(&Effect::Fetch {
            surface: Surface::Inbox,
            bot: None,
            generation: 1,
        });
        worker.submit(&Effect::Answer {
            id: ItemId("20261125T211204Z-7c1e9a40".to_string()),
            text: "approve".to_string(),
            scope: Scope::Once,
        });

        let first = next(&rx);
        assert!(
            matches!(
                &first,
                Msg::Fetched {
                    surface: Surface::Status,
                    generation: 1,
                    ..
                }
            ),
            "{first:?}"
        );
        let second = next(&rx);
        assert!(matches!(&second, Msg::Answered { .. }), "{second:?}");
        let third = next(&rx);
        assert!(
            matches!(
                &third,
                Msg::Fetched {
                    surface: Surface::Activity,
                    ..
                }
            ),
            "{third:?}"
        );
        let fourth = next(&rx);
        assert!(
            matches!(
                &fourth,
                Msg::Fetched {
                    surface: Surface::Inbox,
                    ..
                }
            ),
            "{fourth:?}"
        );

        assert_eq!(
            logged_verbs(&log),
            vec!["status", "answer", "activity", "inbox"]
        );
        worker.shutdown();
    }

    #[test]
    fn child_past_timeout_is_killed() {
        let dir = test_dir("child-past-timeout-is-killed");
        let log = dir.join("argv.log");
        let mut program = test_program(&log, "slow");
        program.read_timeout = Duration::from_secs(1);
        let (tx, rx) = mpsc::channel::<Msg>();
        let worker = Worker::spawn(program, tx);

        let started = Instant::now();
        worker.submit(&Effect::Fetch {
            surface: Surface::Status,
            bot: None,
            generation: 1,
        });
        let reply = next(&rx);
        let elapsed = started.elapsed();

        match reply {
            Msg::Fetched {
                surface,
                generation,
                outcome,
            } => {
                assert_eq!(surface, Surface::Status);
                assert_eq!(generation, 1);
                let error = outcome.expect_err("the slow read is killed at its deadline");
                assert_eq!(error.kind, FailKind::Timeout);
            }
            other => panic!("expected a fetch reply, got {other:?}"),
        }
        assert!(elapsed < Duration::from_millis(1900), "{elapsed:?}");
        worker.shutdown();
    }

    #[test]
    fn loop_thread_spawns_nothing() {
        let dir = test_dir("loop-thread-spawns-nothing");
        let log = dir.join("argv.log");
        let program = test_program(&log, "slow");
        let (tx, rx) = mpsc::channel::<Msg>();
        let worker = Worker::spawn(program, tx);

        let started = Instant::now();
        worker.submit(&Effect::Fetch {
            surface: Surface::Status,
            bot: None,
            generation: 1,
        });
        let elapsed = started.elapsed();
        assert!(elapsed < Duration::from_millis(100), "{elapsed:?}");

        let reply = rx
            .recv_timeout(Duration::from_secs(5))
            .expect("the worker replies");
        match reply {
            Msg::Fetched {
                surface, outcome, ..
            } => {
                assert_eq!(surface, Surface::Status);
                assert!(outcome.is_ok(), "{outcome:?}");
            }
            other => panic!("expected a fetch reply, got {other:?}"),
        }
        worker.shutdown();
    }

    #[test]
    fn shutdown_drops_queued_reads() {
        let dir = test_dir("shutdown-drops-queued-reads");
        let log = dir.join("argv.log");
        let program = test_program(&log, "slow");
        let (tx, _rx) = mpsc::channel::<Msg>();
        let worker = Worker::spawn(program, tx);

        worker.submit(&Effect::Fetch {
            surface: Surface::Status,
            bot: None,
            generation: 1,
        });
        worker.submit(&Effect::Fetch {
            surface: Surface::Activity,
            bot: None,
            generation: 1,
        });
        // Long enough for the status read to be running and the activity read
        // to be waiting behind it.
        std::thread::sleep(Duration::from_millis(300));

        let started = Instant::now();
        worker.shutdown();
        let elapsed = started.elapsed();

        assert!(elapsed < Duration::from_millis(1500), "{elapsed:?}");
        assert_eq!(logged_verbs(&log), vec!["status"]);
    }

    #[test]
    fn chat_job_replies_with_its_outcome() {
        let dir = test_dir("chat-job-replies-with-its-outcome");
        let log = dir.join("argv.log");
        let program = test_program(&log, "ok");
        let (tx, rx) = mpsc::channel::<Msg>();
        let worker = ChatWorker::spawn(program, tx);

        worker.submit(&Effect::ChatSend {
            bot: BotId("hello".to_string()),
            text: "hi".to_string(),
        });

        assert_eq!(
            next(&rx),
            Msg::ChatSent {
                bot: BotId("hello".to_string()),
                text: "hi".to_string(),
                outcome: Ok(ChatOk {
                    code: 0,
                    warning: None,
                }),
            }
        );
        worker.shutdown();
    }

    #[test]
    fn chat_shutdown_returns_while_a_send_runs() {
        let dir = test_dir("chat-shutdown-returns-while-a-send-runs");
        let log = dir.join("argv.log");
        let program = test_program(&log, "chat-slow");
        let (tx, _rx) = mpsc::channel::<Msg>();
        let worker = ChatWorker::spawn(program, tx);

        worker.submit(&Effect::ChatSend {
            bot: BotId("hello".to_string()),
            text: "hi".to_string(),
        });
        // Long enough for the chat worker to have started the send.
        std::thread::sleep(Duration::from_millis(300));

        let started = Instant::now();
        worker.shutdown();
        let elapsed = started.elapsed();
        assert!(elapsed < Duration::from_millis(200), "{elapsed:?}");

        // The send outlives the worker, so its own line lands after the shutdown returned.
        let deadline = Instant::now() + Duration::from_secs(10);
        loop {
            let done = std::fs::read_to_string(&log)
                .unwrap_or_default()
                .lines()
                .any(|line| line == "fixture-chat-done");
            if done {
                break;
            }
            assert!(Instant::now() < deadline, "the send never finished");
            std::thread::sleep(Duration::from_millis(100));
        }
    }

    #[test]
    fn chat_read_goes_to_the_transcript_call() {
        let dir = test_dir("chat-read-goes-to-the-transcript-call");
        let log = dir.join("argv.log");
        let program = test_program(&log, "ok");
        let (tx, rx) = mpsc::channel::<Msg>();
        let worker = Worker::spawn(program, tx);

        worker.submit(&Effect::Fetch {
            surface: Surface::Chat,
            bot: Some(BotId("hello".to_string())),
            generation: 1,
        });

        match next(&rx) {
            Msg::Fetched {
                surface,
                generation,
                outcome,
            } => {
                assert_eq!(surface, Surface::Chat);
                assert_eq!(generation, 1);
                assert!(outcome.is_ok(), "{outcome:?}");
            }
            other => panic!("expected a fetch reply, got {other:?}"),
        }

        let calls = std::fs::read_to_string(&log).expect("the fixture logs its call");
        let first = calls.lines().next().expect("the fixture logged one call");
        assert!(first.starts_with("chat --transcript --json"), "{first}");
        assert!(first.ends_with("-- hello"), "{first}");
        worker.shutdown();
    }

    #[test]
    fn chat_read_without_a_bot_is_refused() {
        let dir = test_dir("chat-read-without-a-bot-is-refused");
        let log = dir.join("argv.log");
        let program = test_program(&log, "ok");
        let (tx, rx) = mpsc::channel::<Msg>();
        let worker = Worker::spawn(program, tx);

        worker.submit(&Effect::Fetch {
            surface: Surface::Chat,
            bot: None,
            generation: 1,
        });

        match next(&rx) {
            Msg::Fetched {
                surface,
                generation,
                outcome,
            } => {
                assert_eq!(surface, Surface::Chat);
                assert_eq!(generation, 1);
                let error = outcome.expect_err("a chat read needs a bot");
                assert_eq!(error.kind, FailKind::Spawn);
            }
            other => panic!("expected a fetch reply, got {other:?}"),
        }

        let calls = std::fs::read_to_string(&log).unwrap_or_default();
        assert!(calls.is_empty(), "{calls}");
        worker.shutdown();
    }
}
