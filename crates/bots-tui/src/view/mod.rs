use ratatui::widgets::Clear;
use ratatui::Frame;

use crate::state::State;
use crate::Options;

/// Draws the empty frame the loop proves itself with.
pub fn draw(frame: &mut Frame, _state: &State, _opts: &Options) {
    frame.render_widget(Clear, frame.area());
}
