//! The scripted loop, from the fake CLI to a drawn frame, compared cell for cell with the design.
mod common;
#[path = "panes/support.rs"]
mod support;

use std::time::Duration;

use bots_tui::app::App;
use bots_tui::keys::Key;
use bots_tui::state::Msg;
use bots_tui::Options;
use ratatui::backend::TestBackend;
use ratatui::Terminal;

/// The rows a terminal's buffer holds, each row's cell symbols joined.
fn buffer_rows(terminal: &Terminal<TestBackend>, cols: u16, rows: u16) -> Vec<String> {
    let buffer = terminal.backend().buffer();
    (0..rows)
        .map(|y| (0..cols).map(|x| buffer[(x, y)].symbol()).collect())
        .collect()
}

/// Proves the loop's first frame, drawn from the fake CLI's reads, is the design's frame one.
#[test]
fn scripted_loop_draws_frame_one() {
    for (cols, rows) in [(80u16, 24u16), (120, 40)] {
        let fx = common::fixture::fixture(&format!("e2e-frame-one-{cols}x{rows}"), "ok");
        let mut terminal =
            Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
        {
            let mut app = App::new(&mut terminal, fx.program.clone(), Options::default());
            assert_eq!(app.handle(Msg::Resize { cols, rows }), None);
            assert_eq!(
                app.handle(Msg::Tick {
                    now: support::now()
                }),
                None
            );
            assert!(app.settle(Duration::from_secs(10)), "the first reads land");
            app.draw();
        }

        let drawn = buffer_rows(&terminal, cols, rows);
        let expected =
            support::expected_frame("Shell, Activity tab, rows", &format!("{cols}x{rows}"));
        for row in 0..usize::from(rows) {
            assert_eq!(
                drawn[row], expected[row],
                "frame 1 at {cols}x{rows} row {row}"
            );
        }
    }
}

/// Proves the loop's answer writes one argv and draws the design's answered frame.
#[test]
fn scripted_answer_draws_frame_27() {
    for (cols, rows) in [(80u16, 24u16), (120, 40)] {
        let fx = common::fixture::fixture(&format!("e2e-frame-27-{cols}x{rows}"), "ok");
        let mut terminal =
            Terminal::new(TestBackend::new(cols, rows)).expect("the test terminal opens");
        {
            let mut app = App::new(&mut terminal, fx.program.clone(), Options::default());
            assert_eq!(app.handle(Msg::Resize { cols, rows }), None);
            assert_eq!(
                app.handle(Msg::Tick {
                    now: support::now()
                }),
                None
            );
            assert!(app.settle(Duration::from_secs(10)), "the first reads land");
            assert_eq!(app.handle(Msg::Key(Key::Alt('2'))), None);
            assert!(app.settle(Duration::from_secs(10)), "the inbox read lands");
            assert_eq!(app.handle(Msg::Key(Key::Enter)), None);
            assert_eq!(app.handle(Msg::Key(Key::Char('y'))), None);
            assert!(app.settle(Duration::from_secs(10)), "the answer lands");
            app.draw();
        }

        let answers: Vec<String> = fx
            .logged()
            .into_iter()
            .filter(|line| line.starts_with("answer"))
            .collect();
        assert_eq!(
            answers,
            vec![format!(
                "answer --scope once --repo {} -- 20261125T211204Z-7c1e9a40 approve",
                fx.dir.display()
            )]
        );

        let drawn = buffer_rows(&terminal, cols, rows);
        let expected = support::expected_frame("Inbox, answered row", &format!("{cols}x{rows}"));
        for row in 0..usize::from(rows) {
            assert_eq!(
                drawn[row], expected[row],
                "frame 27 at {cols}x{rows} row {row}"
            );
        }
    }
}
