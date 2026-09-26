//! Development tool: emit the Ruby probe plan for arbitrary files so the
//! position sweep (`scripts/ruby-position-sweep.rb`) can check every plan key
//! against what Ruby's `Coverage` module reports for the same source.
//!
//! Usage: `cargo run -p supercov-engine --example ruby_plan -- FILE...`
//! Prints one JSON object: `{ "<path>": { "edits", "branches", "methods",
//! "lines", "cases", "parseError" } }`.

use std::{collections::BTreeMap, fs};

use supercov_engine::ruby_instrumenter::build_ruby_obligations;

fn main() {
    let mut output = BTreeMap::new();
    let mut probe = 0u64;
    for path in std::env::args().skip(1) {
        let Ok(source) = fs::read(&path) else {
            continue;
        };
        match build_ruby_obligations(&path, &source, &mut probe) {
            Ok(obligations) => {
                output.insert(path, serde_json::to_value(obligations.plan).unwrap());
            }
            Err(error) => {
                output.insert(path, serde_json::json!({ "parseError": error.to_string() }));
            }
        }
    }
    println!("{}", serde_json::to_string(&output).unwrap());
}
