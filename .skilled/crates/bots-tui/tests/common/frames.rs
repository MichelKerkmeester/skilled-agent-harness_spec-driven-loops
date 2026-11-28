// Loads one frame out of a design document, padded to its declared width.
// A test compares what the screen draws against the frame the design fixes.

use unicode_width::UnicodeWidthStr;

/// The crate's design folder, which holds every document a frame is loaded from.
const DESIGN: &str = concat!(env!("CARGO_MANIFEST_DIR"), "/design/");

/// Loads one frame out of the mockups document by its heading and its size.
pub fn load_frame(heading: &str, size: &str) -> Vec<String> {
    load_frame_in("mockups.md", heading, size)
}

/// Loads one frame out of a named design document by its heading and its size,
/// padded to the declared width.
///
/// The document trims trailing blanks, so every line comes back padded on the
/// right to exactly the frame's column count. A caller can then compare a
/// drawn line against a frame line without trimming either side.
pub fn load_frame_in(doc: &str, heading: &str, size: &str) -> Vec<String> {
    let path = format!("{DESIGN}{doc}");
    let (cols, rows) = parse_size(doc, heading, size);
    let text = match std::fs::read_to_string(&path) {
        Ok(text) => text,
        Err(error) => panic!("{doc}: {heading} at {size}: {path} did not read: {error}"),
    };
    let lines: Vec<&str> = text.lines().collect();
    let block = frame_lines(&lines, doc, heading, size);

    assert_eq!(
        block.len(),
        rows,
        "{doc}: {heading} at {size} draws {} lines, not {rows}",
        block.len()
    );

    block
        .iter()
        .map(|line| {
            let width = line.width();
            assert!(
                width <= cols,
                "{doc}: {heading} at {size} draws a {width}-cell line, wider than {cols}: {line:?}"
            );
            let mut padded = String::from(*line);
            padded.push_str(&" ".repeat(cols - width));
            padded
        })
        .collect()
}

/// The lines between the fences of one frame, found inside its heading's section.
///
/// The search stops at the next heading, so a size that a section does not draw
/// is reported against that section rather than against a later one.
fn frame_lines<'a>(lines: &'a [&'a str], doc: &str, heading: &str, size: &str) -> &'a [&'a str] {
    let heading_line = format!("### {heading}");
    let start = match lines.iter().position(|line| *line == heading_line) {
        Some(index) => index,
        None => panic!("{doc}: {heading} at {size}: no line reads {heading_line}"),
    };
    let end = lines[start + 1..]
        .iter()
        .position(|line| line.starts_with("### "))
        .map_or(lines.len(), |offset| start + 1 + offset);

    let size_line = format!("**{size}**");
    let size_at = match lines[start..end].iter().position(|line| *line == size_line) {
        Some(offset) => start + offset,
        None => panic!("{doc}: {heading} at {size}: no line reads {size_line}"),
    };

    let open_at = match lines[size_at..end]
        .iter()
        .position(|line| *line == "```text")
    {
        Some(offset) => size_at + offset,
        None => panic!("{doc}: {heading} at {size}: no ```text line follows {size_line}"),
    };

    let close_at = match lines[open_at + 1..end]
        .iter()
        .position(|line| *line == "```")
    {
        Some(offset) => open_at + 1 + offset,
        None => panic!("{doc}: {heading} at {size}: the ```text block never closes"),
    };

    &lines[open_at + 1..close_at]
}

/// Splits `<cols>x<rows>` into its two numbers.
fn parse_size(doc: &str, heading: &str, size: &str) -> (usize, usize) {
    let (cols, rows) = match size.split_once('x') {
        Some(pair) => pair,
        None => panic!("{doc}: {heading} at {size}: the size is not <cols>x<rows>"),
    };
    match (cols.parse::<usize>(), rows.parse::<usize>()) {
        (Ok(cols), Ok(rows)) => (cols, rows),
        _ => panic!("{doc}: {heading} at {size}: the size is not <cols>x<rows>"),
    }
}
