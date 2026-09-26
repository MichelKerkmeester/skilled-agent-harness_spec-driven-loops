//! `supercov runs <run> tests affected`: which of a run's tests the changes
//! since that run could have reached.

use serde_json::{Value, json};
use std::{collections::BTreeSet, path::Path, process::ExitCode};
use supercov_engine::{
    agent_json, assertion_store as maps,
    run_store::{StoredRun, compare_run_integrity, discover_runs, select_run},
};

const HELP: &str = r#"Usage: supercov runs <run> tests affected [--json | --names | --files]

Which of the run's tests the changes since that run could have reached, from
what each test executed and what changed, declaration by declaration.

A test is affected by a change in code it ran, in its test file, or in the
shape of a file it ran code in -- a declaration added, removed or renamed. It
is not affected by a change confined to code it never ran, nor by comments,
blank lines or trailing whitespace. A test that did not pass in the run is
listed as affected: it has a result to establish.

A dependency, lockfile, configuration or toolchain change affects every test.
A source file added since the run is not seen by any test's record; the
working-tree check names that case and the suite should run in full.

--json     Structured output for integrations.
--names    One affected test name per line, for a runner's filter.
--files    One affected test file per line, for a runner's file list.

Exit 0 when the run has a record to answer from; exit 2 otherwise.
"#;

/// Working-tree differences the per-test record cannot see: every test is
/// affected by them.
const RUN_WIDE: [&str; 6] = [
    "coverage schema changed",
    "instrumenter contract changed",
    "dependencies or lockfile changed",
    "test/build configuration changed",
    "execution environment changed",
    "run predates integrity fingerprints",
];

pub fn command(args: &[String]) -> ExitCode {
    if args.iter().any(|a| matches!(a.as_str(), "--help" | "-h"))
        || args.get(2).map(String::as_str) != Some("affected")
    {
        print!("{HELP}");
        return if args
            .get(2)
            .is_some_and(|a| a != "affected" && !a.starts_with('-'))
        {
            eprintln!("[supercov] unknown tests action: {}", args[2]);
            ExitCode::from(2)
        } else {
            ExitCode::SUCCESS
        };
    }
    let mut json_output = false;
    let mut names = false;
    let mut files = false;
    let mut seen = BTreeSet::new();
    for flag in &args[3..] {
        if !seen.insert(flag.as_str()) {
            return usage(format!("Duplicate option: {flag}"));
        }
        match flag.as_str() {
            "--json" => json_output = true,
            "--names" => names = true,
            "--files" => files = true,
            other => return usage(format!("Unknown option: {other}")),
        }
    }
    if [json_output, names, files].iter().filter(|f| **f).count() > 1 {
        return usage("Choose one of --json, --names or --files".into());
    }
    let result = (|| -> Result<Value, String> {
        let root = std::env::current_dir().map_err(|e| e.to_string())?;
        let inventory = discover_runs(&root).map_err(|e| e.to_string())?;
        let run = select_run(&inventory, Some(&args[0])).map_err(|e| e.to_string())?;
        let mut data = maps::affected_tests(&root, run)?;
        data["workingTree"] = working_tree(&root, run, &mut data);
        Ok(data)
    })();
    match result {
        Ok(data) => {
            if json_output {
                match agent_json::success("runs.tests.affected", &data, None) {
                    Ok(output) => print!("{output}"),
                    Err(size) => {
                        print!(
                            "{}",
                            agent_json::failure(
                                Some("runs.tests.affected"),
                                &agent_json::AgentError {
                                    code: agent_json::ErrorCode::ResponseTooLarge,
                                    message: "Response too large; use the text view (omit --json)"
                                        .into(),
                                    retryable: false,
                                    details: Some(
                                        json!({"actualBytes": size.actual_bytes, "maxBytes": size.max_bytes})
                                    ),
                                }
                            )
                        );
                        return ExitCode::from(2);
                    }
                }
            } else if names || files {
                let key = if names { "name" } else { "file" };
                // Both buckets. This output feeds a runner, so it has to be
                // the set that is safe to run rather than the set that is
                // proven affected: a test whose coverage nothing could
                // attribute is exactly the one a narrower list would drop, and
                // dropping it is how a change to code it exercised goes
                // untested while the command exits 0.
                let mut lines = ["affected", "undetermined"]
                    .iter()
                    .flat_map(|bucket| data[*bucket].as_array().into_iter().flatten())
                    .filter_map(|t| t[key].as_str())
                    .collect::<Vec<_>>();
                lines.sort_unstable();
                lines.dedup();
                for line in lines {
                    println!("{line}");
                }
            } else {
                print!("{}", render(&data));
            }
            ExitCode::SUCCESS
        }
        Err(message) => {
            if json_output {
                print!(
                    "{}",
                    agent_json::failure(
                        Some("runs.tests.affected"),
                        &agent_json::AgentError {
                            code: agent_json::ErrorCode::InvalidArgument,
                            message,
                            retryable: false,
                            details: None,
                        }
                    )
                );
            } else {
                eprintln!("[supercov] {message}");
            }
            ExitCode::from(2)
        }
    }
}

fn usage(message: String) -> ExitCode {
    eprintln!("[supercov] {message}");
    print!("{HELP}");
    ExitCode::from(2)
}

/// The checkout against the run, and what that means for the answer: a
/// run-wide difference makes every test affected; a source set that changed
/// without any captured file changing means a file was added.
fn working_tree(root: &Path, run: &StoredRun, data: &mut Value) -> Value {
    let Some(current) = super::current_integrity_for_run(root, run) else {
        return json!({"stale": null, "reason": "current source integrity unavailable"});
    };
    let comparison = compare_run_integrity(Some(&run.metadata.integrity), &current);
    let run_wide = comparison
        .reasons
        .iter()
        .filter(|r| RUN_WIDE.contains(&r.as_str()))
        .cloned()
        .collect::<Vec<_>>();
    if !run_wide.is_empty() {
        let reason = format!("{} (every test)", run_wide.join("; "));
        let mut all = data["affected"].as_array().cloned().unwrap_or_default();
        for bucket in ["undetermined", "unaffected"] {
            for test in data[bucket].as_array().cloned().unwrap_or_default() {
                all.push(test);
            }
        }
        for test in &mut all {
            let reasons = test["reasons"].as_array_mut().unwrap();
            reasons.insert(0, json!(reason));
        }
        all.sort_by(|a, b| {
            (a["file"].as_str(), a["name"].as_str()).cmp(&(b["file"].as_str(), b["name"].as_str()))
        });
        data["summary"]["affected"] = json!(all.len());
        data["summary"]["undetermined"] = json!(0);
        data["summary"]["unaffected"] = json!(0);
        data["affected"] = json!(all);
        data["undetermined"] = json!([]);
        data["unaffected"] = json!([]);
    }
    let source_set_changed = comparison
        .reasons
        .iter()
        .any(|r| r == "instrumented source changed" || r == "test files changed")
        && data["changedFiles"].as_array().is_some_and(Vec::is_empty);
    json!({
        "stale": comparison.stale,
        "reasons": comparison.reasons,
        "runWide": run_wide,
        "sourceSetChanged": source_set_changed,
        "note": if source_set_changed {
            Some("A source or test file exists that the run did not capture; no test's record can say whether it loads it. Run the suite in full.")
        } else {
            None
        },
    })
}

fn render(data: &Value) -> String {
    let mut out = String::new();
    let affected = data["affected"].as_array().cloned().unwrap_or_default();
    let undetermined = data["undetermined"].as_array().cloned().unwrap_or_default();
    let total = data["summary"]["tests"].as_u64().unwrap_or(0);
    out.push_str(&format!(
        "Run {}: {} of {} tests affected by changes since the run{}\n",
        data["run"].as_str().unwrap_or(""),
        affected.len(),
        total,
        if undetermined.is_empty() {
            String::new()
        } else {
            format!(", {} undetermined", undetermined.len())
        }
    ));
    fn entries(out: &mut String, tests: &[Value]) {
        for test in tests {
            out.push_str(&format!(
                "\n  {} › {}\n",
                test["file"].as_str().unwrap_or(""),
                test["name"].as_str().unwrap_or("")
            ));
            for reason in test["reasons"].as_array().into_iter().flatten() {
                out.push_str(&format!("    {}\n", reason.as_str().unwrap_or("")));
            }
        }
    }
    entries(&mut out, &affected);
    if !undetermined.is_empty() {
        out.push_str(
            "\nUndetermined — what these ran was not fully recorded, so nothing can say the\nchange missed them. It is inside what the run covered, so it could have reached\nthem. Run them.\n",
        );
        entries(&mut out, &undetermined);
    }
    let files = data["changedFiles"].as_array().cloned().unwrap_or_default();
    if files.is_empty() {
        out.push_str("\nNo captured file has changed.\n");
    } else {
        out.push_str("\nChanged files:\n");
        for file in &files {
            out.push_str(&format!(
                "  {}  {}{}\n",
                file["file"].as_str().unwrap_or(""),
                file["change"].as_str().unwrap_or(""),
                file["detail"]
                    .as_str()
                    .map(|d| format!("  {d}"))
                    .unwrap_or_default()
            ));
        }
    }
    let tree = &data["workingTree"];
    match tree["stale"] {
        Value::Bool(false) => out.push_str("\nWorking tree: matches the run.\n"),
        Value::Bool(true) => {
            out.push_str("\nWorking tree: differs from the run:\n");
            for reason in tree["reasons"].as_array().into_iter().flatten() {
                out.push_str(&format!("  {}\n", reason.as_str().unwrap_or("")));
            }
            if let Some(note) = tree["note"].as_str() {
                out.push_str(&format!("  {note}\n"));
            }
        }
        _ => out.push_str("\nWorking tree: could not be compared with the run.\n"),
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_text_view_names_each_affected_test_and_its_reasons() {
        let data = json!({
            "run": "r1",
            "summary": {"tests": 3},
            "affected": [{"file": "tests/a.test.js", "name": "adds", "reasons": ["src/a.js: add (line 1) changed (this test ran it)"]}],
            "changedFiles": [{"file": "src/a.js", "change": "bodies", "detail": "add (line 1)"}],
            "workingTree": {"stale": false}
        });
        let text = render(&data);
        assert!(text.contains("1 of 3 tests affected"), "{text}");
        assert!(text.contains("tests/a.test.js › adds"), "{text}");
        assert!(
            text.contains("    src/a.js: add (line 1) changed (this test ran it)"),
            "{text}"
        );
        assert!(text.contains("  src/a.js  bodies  add (line 1)"), "{text}");
        assert!(text.contains("matches the run"), "{text}");
    }
}
