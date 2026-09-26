use std::{io::Read, process::ExitCode};

use serde::Deserialize;
use supercov_engine::js_instrumenter::instrument_candidate;

#[derive(Deserialize)]
struct Case {
    file: String,
    source: String,
}

fn main() -> ExitCode {
    let input = match std::env::args_os().nth(1) {
        Some(path) => match std::fs::read_to_string(&path) {
            Ok(input) => input,
            Err(error) => {
                eprintln!(
                    "failed to read differential corpus {}: {error}",
                    std::path::Path::new(&path).display()
                );
                return ExitCode::from(2);
            }
        },
        None => {
            let mut input = String::new();
            if let Err(error) = std::io::stdin().read_to_string(&mut input) {
                eprintln!("failed to read differential corpus: {error}");
                return ExitCode::from(2);
            }
            input
        }
    };
    let cases: Vec<Case> = match serde_json::from_str(&input) {
        Ok(cases) => cases,
        Err(error) => {
            eprintln!("invalid differential corpus: {error}");
            return ExitCode::from(2);
        }
    };
    let mut outputs = Vec::with_capacity(cases.len());
    for case in cases {
        match instrument_candidate(&case.source, &case.file) {
            Ok(output) => outputs.push(output),
            Err(error) => {
                eprintln!("{}: {error:?}", case.file);
                return ExitCode::from(2);
            }
        }
    }
    match serde_json::to_writer(std::io::stdout(), &outputs) {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("failed to serialize Rust candidate output: {error}");
            ExitCode::from(2)
        }
    }
}
