use std::{env, fs::OpenOptions, io::Write as _, path::PathBuf};

use supercov_custom_harness_fixture::selected;

fn main() {
    assert_eq!(selected(true), 11);
    assert_eq!(selected(false), 17);
    if let Some(log) = env::var_os("SUPERCOV_CUSTOM_HARNESS_LOG").map(PathBuf::from) {
        let mut file = OpenOptions::new().create(true).append(true).open(log).unwrap();
        writeln!(file, "{}", env::args().skip(1).collect::<Vec<_>>().join("\u{1f}"))
            .unwrap();
    }
}
