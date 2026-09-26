//! Public Ruby coverage run lifecycle.
//!
//! The project runs in place with its own interpreter, bundle and test
//! command. Supercov prepares the complete obligation manifest and probe plan
//! from source, materialises its stdlib-only runtime under `.supercov/`, loads
//! it through `RUBYOPT`, supervises the user's command unchanged, and
//! publishes the joined evidence.

use std::{
    ffi::OsString,
    fs,
    io::Write,
    path::{Path, PathBuf},
    time::Instant,
};

use serde::{Deserialize, Serialize};

use crate::workspace::canonicalize_simplified;
use crate::{
    evidence_archive::write_archive,
    frontend_protocol::validate_frontend_report_request,
    integrity::{FrontendIntegrityInputs, create_explicit_run_integrity},
    lifecycle::{
        ProjectLock, finalize_published_run, note_kept_evidence, publish_run,
        recover_abandoned_runs, remove_stored_tree_deferred,
    },
    orchestration::{ExecutionPhase, ExecutionPlan, PhaseKind, execute_plan},
    process_supervision::{CommandSpec, SupervisionOptions},
    ruby_evidence::{RubyAssertionInventory, RubyFrontendRun, build_ruby_frontend_run},
    ruby_project::{PreparedRubyProject, prepare_ruby_project, ruby_integrity_inputs},
    run_store::{RawEvidenceMetadata, RunMetadata, RunTimings},
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectRubyRunRequest {
    pub root: PathBuf,
    pub command: Vec<String>,
    pub run_id: String,
    pub started_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct DirectRubyRunResult {
    pub run_id: String,
    pub run_directory: PathBuf,
    pub exit_code: i32,
    pub tests: usize,
    pub source_files: usize,
    pub interpreters: usize,
    pub ruby_versions: Vec<String>,
    pub recovered_runs: Vec<String>,
    pub metadata: RunMetadata,
}

fn elapsed_ms(started: Instant) -> f64 {
    (started.elapsed().as_secs_f64() * 10_000.0).round() / 10.0
}

fn embedded_runtime_files() -> [(&'static str, &'static [u8]); 5] {
    [
        (
            "supercov_runtime.rb",
            include_bytes!("../runtime-assets/ruby/supercov_runtime.rb"),
        ),
        (
            "supercov_rspec.rb",
            include_bytes!("../runtime-assets/ruby/supercov_rspec.rb"),
        ),
        (
            "supercov_minitest.rb",
            include_bytes!("../runtime-assets/ruby/supercov_minitest.rb"),
        ),
        (
            "supercov_testunit.rb",
            include_bytes!("../runtime-assets/ruby/supercov_testunit.rb"),
        ),
        (
            "supercov_cucumber.rb",
            include_bytes!("../runtime-assets/ruby/supercov_cucumber.rb"),
        ),
    ]
}

fn write_runtime(directory: &Path) -> Result<(), String> {
    fs::create_dir_all(directory).map_err(|error| format!("{}: {error}", directory.display()))?;
    for (name, contents) in embedded_runtime_files() {
        let path = directory.join(name);
        fs::write(&path, contents).map_err(|error| format!("{}: {error}", path.display()))?;
    }
    Ok(())
}

fn copy_tree(source: &Path, destination: &Path) -> Result<(), String> {
    for entry in fs::read_dir(source).map_err(|error| format!("{}: {error}", source.display()))? {
        let entry = entry.map_err(|error| error.to_string())?;
        let target = destination.join(entry.file_name());
        if entry
            .file_type()
            .map_err(|error| error.to_string())?
            .is_dir()
        {
            fs::create_dir_all(&target).map_err(|error| error.to_string())?;
            copy_tree(&entry.path(), &target)?;
        } else {
            fs::copy(entry.path(), &target).map_err(|error| error.to_string())?;
        }
    }
    Ok(())
}

fn environment(
    root: &Path,
    run_id: &str,
    runtime_directory: &Path,
    plan_path: &Path,
    evidence_directory: &Path,
) -> Vec<(OsString, OsString)> {
    let mut variables = std::env::vars_os().collect::<Vec<_>>();
    let mut take = |key: &str| {
        let position = variables.iter().position(|(name, _)| name == key);
        position.map(|index| variables.remove(index).1)
    };
    // `-r` with an absolute path loads the runtime before the main script in
    // every Ruby the command starts, including bundler and forked workers.
    let mut rubyopt = OsString::from("-r");
    rubyopt.push(runtime_directory.join("supercov_runtime.rb"));
    if let Some(existing) = take("RUBYOPT").filter(|existing| !existing.is_empty()) {
        rubyopt.push(" ");
        rubyopt.push(existing);
    }
    for key in [
        "SUPERCOV_RUBY_PLAN",
        "SUPERCOV_RUBY_EVIDENCE_DIR",
        "SUPERCOV_RUN_ID",
        "SUPERCOV_PROJECT_ROOT",
        "SUPERCOV_CONTEXT",
        "SUPERCOV_RUBY_WORKER",
    ] {
        take(key);
    }
    variables.extend([
        ("RUBYOPT".into(), rubyopt),
        (
            "SUPERCOV_RUBY_PLAN".into(),
            plan_path.as_os_str().to_owned(),
        ),
        (
            "SUPERCOV_RUBY_EVIDENCE_DIR".into(),
            evidence_directory.as_os_str().to_owned(),
        ),
        ("SUPERCOV_RUN_ID".into(), run_id.into()),
        ("SUPERCOV_PROJECT_ROOT".into(), root.as_os_str().to_owned()),
    ]);
    variables
}

/// The fingerprint a later query compares against the stored run: the same
/// discovery and inputs the run used, without preparing a plan.
pub fn current_ruby_integrity(
    root: &Path,
    command: &[String],
    source_roots: Option<&[String]>,
) -> Result<crate::run_store::RunIntegrity, String> {
    let root = canonicalize_simplified(root).map_err(|error| error.to_string())?;
    let mut files = crate::ruby_project::discover_ruby_files(&root)?;
    // The roots the run was measured under, not this shell's: the run
    // digested the files they kept, and nothing else would match it.
    if let Some(configured) = source_roots.filter(|roots| !roots.is_empty()) {
        crate::source_discovery::ExplicitSourceRoots::resolve(&root, configured)
            .map_err(|error| error.to_string())?
            .narrow(&mut files.sources, &mut files.excluded, String::as_str);
    }
    let mut inputs = ruby_integrity_inputs(&files, command);
    crate::source_discovery::fold_roots_into_configuration(
        &mut inputs.execution_configuration,
        source_roots,
    );
    create_explicit_run_integrity(&root, &inputs, &FrontendIntegrityInputs::embedded_ruby())
        .map_err(|error| error.to_string())
}

pub fn run_direct_ruby(
    request: &DirectRubyRunRequest,
    diagnostics: &mut dyn Write,
) -> Result<DirectRubyRunResult, String> {
    if request.command.is_empty() {
        return Err("test command must not be empty".into());
    }
    let total_started = Instant::now();
    let initialization_started = Instant::now();
    let root = canonicalize_simplified(&request.root)
        .map_err(|error| format!("{}: {error}", request.root.display()))?;
    let mut lock = ProjectLock::acquire(&root, &request.run_id, &request.started_at)
        .map_err(|error| error.to_string())?;
    let initialization_ms = elapsed_ms(initialization_started);
    let work_directory = root.join(".supercov/work").join(&request.run_id);
    // Whether the tests were measured. A run that failed before that has no
    // evidence worth keeping; one that failed after has evidence that cost the
    // suite its wall clock.
    let measured = std::cell::Cell::new(false);
    let result = (|| {
        let recovered_runs = recover_abandoned_runs(&root, &request.started_at)
            .map_err(|error| error.to_string())?;
        if !recovered_runs.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] recovered abandoned run(s): {}",
                recovered_runs.join(", ")
            )
            .map_err(|error| error.to_string())?;
        }

        let adapter_started = Instant::now();
        let ambient = std::env::vars().collect::<std::collections::BTreeMap<_, _>>();
        let roots = crate::source_discovery::ExplicitSourceRoots::from_environment(&root, &ambient)
            .map_err(|error| error.to_string())?;
        let project: PreparedRubyProject = prepare_ruby_project(&root, roots.as_ref())?;
        let source_roots = crate::source_discovery::configured_source_roots(
            &std::env::vars().collect::<std::collections::BTreeMap<_, _>>(),
        );
        let mut integrity_inputs = ruby_integrity_inputs(&project.files, &request.command);
        crate::source_discovery::fold_roots_into_configuration(
            &mut integrity_inputs.execution_configuration,
            source_roots.as_deref(),
        );
        let integrity = create_explicit_run_integrity(
            &root,
            &integrity_inputs,
            &FrontendIntegrityInputs::embedded_ruby(),
        )
        .map_err(|error| error.to_string())?;
        let assertion_inputs = crate::assertion_inputs::capture(
            &root,
            "ruby",
            ruby_integrity_inputs(&project.files, &request.command).assertion_paths(),
        )?;
        let ruby_directory = work_directory.join("ruby");
        let runtime_directory = ruby_directory.join("runtime");
        let evidence_directory = ruby_directory.join("evidence");
        // The plan is a Ruby literal rather than JSON: the runtime is
        // required through `RUBYOPT` before Bundler runs, and loading the
        // `json` default gem there would clash with the version an
        // application's Gemfile pins.
        let plan_path = ruby_directory.join("plan.rb");
        write_runtime(&runtime_directory)?;
        fs::create_dir_all(&evidence_directory).map_err(|error| error.to_string())?;
        fs::write(
            &plan_path,
            ruby_literal(&serde_json::to_value(&project.plan).map_err(|error| error.to_string())?)
                .into_bytes(),
        )
        .map_err(|error| format!("{}: {error}", plan_path.display()))?;
        writeln!(
            diagnostics,
            "[supercov] detected Ruby; measuring {} source file(s) in place through Ruby's Coverage module and load-time probes",
            project.plan.files.len()
        )
        .map_err(|error| error.to_string())?;
        for (file, reason) in &project.unparseable {
            writeln!(
                diagnostics,
                "[supercov] could not parse {file}: {reason}; it carries no obligations"
            )
            .map_err(|error| error.to_string())?;
        }
        let adapter_setup_ms = elapsed_ms(adapter_started);

        let test_started = Instant::now();
        let plan = ExecutionPlan {
            preparation: Vec::new(),
            test: ExecutionPhase {
                name: "test".into(),
                kind: PhaseKind::Test,
                command: CommandSpec {
                    program: request.command[0].clone().into(),
                    arguments: request.command[1..].iter().map(OsString::from).collect(),
                    cwd: root.clone(),
                    environment: Some(environment(
                        &root,
                        &request.run_id,
                        &runtime_directory,
                        &plan_path,
                        &evidence_directory,
                    )),
                    captured_output: None,
                },
            },
        };
        let options = SupervisionOptions::from_environment().map_err(|error| error.to_string())?;
        let execution = execute_plan(&plan, options, diagnostics, |_, _| Ok(()))
            .map_err(|error| error.to_string())?;
        let test_command_ms = elapsed_ms(test_started);
        if let Some(signal) = execution.interrupted_signal {
            return Err(format!(
                "the test command was interrupted by {signal:?}; no run was published"
            ));
        }

        if std::env::var("SUPERCOV_KEEP_WORK").is_ok_and(|value| !value.is_empty()) {
            // Kept before the join so a rejected evidence file stays inspectable.
            let debug_directory = root.join(".supercov/ruby-debug").join(&request.run_id);
            fs::create_dir_all(&debug_directory).map_err(|error| error.to_string())?;
            copy_tree(&ruby_directory, &debug_directory)?;
        }
        let publication_started = Instant::now();
        measured.set(true);
        let run: RubyFrontendRun = match build_ruby_frontend_run(
            &project.manifest,
            &evidence_directory,
            &request.run_id,
            &request.started_at,
            execution.exit_code,
            &RubyAssertionInventory::new(&root, &assertion_inputs),
        ) {
            // No test reported an outcome and the command itself failed: it
            // never ran its tests (`No module named pytest`, an error while
            // collecting). That is the command's failure, said in its own
            // output, not a Supercov bug to report with evidence.
            Err(
                crate::ruby_evidence::RubyEvidenceError::NoTests
                | crate::ruby_evidence::RubyEvidenceError::NoInterpreter,
            ) if execution.exit_code != 0 => {
                measured.set(false);
                return Err(format!(
                    "the test command exited {} before any test reported an outcome; its own output above says why, and no run was published",
                    execution.exit_code
                ));
            }
            result => result.map_err(|error| error.to_string())?,
        };
        validate_frontend_report_request(&run.declaration, &run.request)
            .map_err(|error| error.to_string())?;
        let archive_path = work_directory.join("evidence.raw.gz");
        let entries = run.archive_entries().map_err(|error| error.to_string())?;
        let entries = crate::assertion_inputs::append(entries, &assertion_inputs)?;
        let raw = write_archive(entries, &archive_path).map_err(|error| error.to_string())?;
        remove_stored_tree_deferred(&root, &ruby_directory).map_err(|error| error.to_string())?;
        let evidence_publication_ms = elapsed_ms(publication_started);
        let timings = RunTimings {
            initialization_ms,
            workspace_preparation_ms: 0.0,
            adapter_setup_ms,
            instrumented_build_ms: 0.0,
            test_command_ms,
            evidence_publication_ms,
        };
        let metadata = RunMetadata {
            id: request.run_id.clone(),
            started_at: request.started_at.clone(),
            duration_ms: elapsed_ms(total_started),
            command: request.command.clone(),
            test_exit_code: Some(execution.exit_code),
            integrity,
            raw_evidence: RawEvidenceMetadata {
                schema_version: raw.schema_version,
                format: raw.format.into(),
                file: raw.file.into(),
                files: raw.files,
                uncompressed_bytes: raw.uncompressed_bytes,
                compressed_bytes: raw.compressed_bytes,
            },
            isolated_build: None,
            instrumented_build_cache: None,
            timings: Some(timings),
            merged: None,
            parents: None,
            source_roots: source_roots.clone(),
        };
        let run_directory =
            publish_run(&root, &metadata, &archive_path).map_err(|error| error.to_string())?;
        finalize_published_run(&root, &request.run_id).map_err(|error| error.to_string())?;
        Ok(DirectRubyRunResult {
            run_id: request.run_id.clone(),
            run_directory,
            exit_code: execution.exit_code,
            tests: run.tests,
            source_files: project.plan.files.len(),
            interpreters: run.interpreters,
            ruby_versions: run.ruby_versions,
            recovered_runs,
            metadata,
        })
    })();
    let result = result.map_err(|error| {
        if !measured.get() {
            return error;
        }
        note_kept_evidence(
            &root,
            &work_directory.join("ruby/evidence"),
            &request.run_id,
            error,
        )
    });
    if result.is_err() {
        let _ = remove_stored_tree_deferred(&root, &work_directory);
    }
    let release = lock.release().map_err(|error| error.to_string());
    match (result, release) {
        (Ok(result), Ok(())) => Ok(result),
        (Err(error), _) => Err(error),
        (Ok(_), Err(error)) => Err(error),
    }
}

/// Render a JSON value as a Ruby literal: `nil`, booleans and numbers as
/// themselves, strings double-quoted with JSON escapes (which Ruby shares)
/// plus `#` escaped so nothing interpolates, arrays as `[..]` and objects as
/// `{"key" => value, ..}` so keys stay strings rather than becoming symbols.
pub(crate) fn ruby_literal(value: &serde_json::Value) -> String {
    fn write(value: &serde_json::Value, out: &mut String) {
        match value {
            serde_json::Value::Null => out.push_str("nil"),
            serde_json::Value::Bool(flag) => out.push_str(if *flag { "true" } else { "false" }),
            serde_json::Value::Number(number) => out.push_str(&number.to_string()),
            serde_json::Value::String(text) => write_string(text, out),
            serde_json::Value::Array(items) => {
                out.push('[');
                for (index, item) in items.iter().enumerate() {
                    if index > 0 {
                        out.push(',');
                    }
                    write(item, out);
                }
                out.push(']');
            }
            serde_json::Value::Object(entries) => {
                out.push('{');
                for (index, (key, item)) in entries.iter().enumerate() {
                    if index > 0 {
                        out.push(',');
                    }
                    write_string(key, out);
                    out.push_str("=>");
                    write(item, out);
                }
                out.push('}');
            }
        }
    }

    fn write_string(text: &str, out: &mut String) {
        let json = serde_json::to_string(text).unwrap_or_else(|_| "\"\"".into());
        out.push_str(&json.replace('#', "\\#"));
    }

    let mut out = String::new();
    write(value, &mut out);
    out.push('\n');
    out
}

#[cfg(test)]
mod literal_tests {
    use super::ruby_literal;

    #[test]
    fn ruby_literal_keeps_strings_inert_and_keys_as_strings() {
        let value = serde_json::json!({
            "a": [1, 2.5, -3, true, false, null],
            "text": "quote \" backslash \\ interpolation #{x} tab \t unicode \u{e9}",
            "nested": {"k": []}
        });
        let literal = ruby_literal(&value);
        assert_eq!(
            literal,
            "{\"a\"=>[1,2.5,-3,true,false,nil],\"text\"=>\"quote \\\" backslash \\\\ interpolation \\#{x} tab \\t unicode \u{e9}\",\"nested\"=>{\"k\"=>[]}}\n"
        );
    }
}
