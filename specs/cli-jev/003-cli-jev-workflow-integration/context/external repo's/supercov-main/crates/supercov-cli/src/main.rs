use std::{
    ffi::{OsStr, OsString},
    fs,
    io::Read,
    path::{Component, Path, PathBuf},
    process::{Command, ExitCode, Stdio},
    time::{Duration, Instant},
};

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use supercov_engine::{
    agent_json,
    coverage_analysis::{CoverageCoreInput, analyze_core},
    coverage_index::{CoverageIndex, coverage_index_sections},
    coverage_query::{
        CoverageCoversQueryOptions, CoverageDecisionQueryOptions, CoverageDiffQueryOptions,
        CoverageDimensionQueryData, CoverageDimensionQueryOptions, CoverageFileDecisionsOptions,
        CoverageFileDetailOptions, CoverageFileQueryData, CoverageFileQueryOptions,
        CoverageMinimizeQueryOptions, CoverageQueryFilters, CoverageScopeQueryOptions,
        CoverageSummaryQueryOptions, CoverageTestQueryOptions, DecisionSort, MinimizeMetric,
        MinimumTestSetRequest, coverage_covers_query, coverage_decision_query, coverage_diff_query,
        coverage_dimension_query, coverage_file_decisions_query, coverage_file_detail_query,
        coverage_file_query, coverage_minimize_query, coverage_scope_query, coverage_summary_query,
        coverage_test_query, minimum_test_set_for_request,
    },
    coverage_report::{
        ArchiveReportRequest, CoverageReportRequest, ReportError, analyze_coverage_archive,
        analyze_coverage_results,
    },
    evidence_archive::{
        EvidenceArchiveEntry, EvidenceArchiveSource, collect_sources, write_archive,
    },
    indexed_query::{
        IndexedQueryOutput, IndexedQueryRequest, NewerQuery, execute_indexed_query, query_indexed,
    },
    js_instrumenter::instrument_candidate,
    query_index::{QueryIndex, QueryIndexIdentity, write_query_index},
    run_query::{RunListData, run_list_query},
    run_store::{
        RunIndexError, RunInventory, RunStoreError, StoredRun, compare_run_integrity,
        discover_runs, open_or_rebuild_query_index, select_run,
    },
};
use time::{OffsetDateTime, macros::format_description};

mod assertions_human;
mod assertions_query;
mod html_report;
mod human_query;
mod public_query;
mod quality;
mod tests_query;

use human_query::render_human;
use public_query::{PublicQueryInvocation, help_for, parse_public_query};
use supercov_engine::progress::ProgressLine;

const HELP: &str = r#"Coverage, security and code quality for coding agents.

Score the source with Jev:
  supercov quality                     score this repository
  supercov quality gaps                only files something fired on
  supercov quality file <path>         one file, every check
  supercov quality patch               what a change introduced
  supercov quality --help              every quality query
  supercov security                    security surface, file by file
  supercov security patch              what a change introduced, security only

Measure your full test command:
  npx supercov -- npm test
  supercov -- <test command>           measure the complete command
  supercov --exact-attribution -- ...  credit every test, running yours in order

Inspect a run with small, paginated answers:
  supercov runs latest                 newest run summary
  supercov runs latest gaps            files with unresolved obligations
  supercov runs latest gaps --kind e2e E2E gaps by origin
  supercov runs latest file <path>     gap lines in one file
  supercov runs <id> --help            every run query
  supercov runs <run-id> [resource]    query one immutable run

Check what the tests assert:
  supercov runs latest assertions      assertions and their status
  supercov runs latest assertion <id>  one assertion and its flows
  supercov assertions --help           assertion map schema and syntax

Compare, combine, and maintain:
  supercov diff <older> <newer>        compare two runs
  supercov report [run-id]             open a portable interactive HTML report
  supercov merge <id> <id> [...]       combine compatible runs
  supercov runs clean [--keep N]       remove stored runs (all by default)
  supercov quality clean [--keep N]    remove saved assessments

Guides:
  supercov docs                        list bundled guides
  supercov docs <topic>                print Markdown to stdout
"#;

const DOC_TOPICS: &[&str] = &[
    "getting-started",
    "agent-loop",
    "assertions",
    "assertion-evidence",
    "assertion-maps",
    "assertion-agent",
    "troubleshooting",
    "cli",
    "coverage-model",
    "quality",
    "security",
    "evidence",
    "supported-suites",
    "verification",
    "performance",
    "reports",
    "workspace-isolation",
];

fn hydrate_line_source_from_working_tree(
    root: &Path,
    stale: bool,
    data: &mut supercov_engine::coverage_query::CoverageCoversData,
) {
    let (location, source, origin) = match data {
        supercov_engine::coverage_query::CoverageCoversData::Line(data) => {
            (&data.location, &mut data.source, &mut data.source_origin)
        }
        supercov_engine::coverage_query::CoverageCoversData::Anchors(data) => {
            (&data.location, &mut data.source, &mut data.source_origin)
        }
    };
    if source.is_some() {
        return;
    }
    let relative = Path::new(&location.file);
    if relative.components().any(|component| {
        matches!(
            component,
            Component::ParentDir | Component::RootDir | Component::Prefix(_)
        )
    }) {
        return;
    }
    let Ok(contents) = fs::read_to_string(root.join(relative)) else {
        return;
    };
    let Some(line) = contents.lines().nth(location.line.saturating_sub(1)) else {
        return;
    };
    *source = Some(line.into());
    *origin = Some(
        if stale {
            "working-tree-stale"
        } else {
            "working-tree-current"
        }
        .into(),
    );
}

fn is_executable_wrapper_program(argument: &OsStr) -> bool {
    if argument
        .to_str()
        .is_some_and(|argument| argument.starts_with(['-', '@']))
    {
        return false;
    }
    let path = Path::new(argument);
    let candidates = if path.is_absolute() || path.components().count() > 1 {
        vec![path.to_path_buf()]
    } else {
        std::env::var_os("PATH")
            .map(|value| {
                std::env::split_paths(&value)
                    .map(|directory| directory.join(path))
                    .collect()
            })
            .unwrap_or_default()
    };
    candidates.into_iter().any(|candidate| {
        let Ok(metadata) = fs::metadata(candidate) else {
            return false;
        };
        if !metadata.is_file() {
            return false;
        }
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt as _;
            metadata.permissions().mode() & 0o111 != 0
        }
        #[cfg(not(unix))]
        {
            true
        }
    })
}

fn main() -> ExitCode {
    let os_arguments = std::env::args_os().skip(1).collect::<Vec<_>>();
    if os_arguments
        .first()
        .is_some_and(|argument| argument == "__cargo-test-runner")
    {
        return rust_cargo_test_runner(os_arguments.into_iter().skip(1).collect());
    }
    // nextest's target runner for the owned frontend: test arguments pass
    // through untouched, so dispatch before anything reads them as UTF-8.
    if os_arguments.first().is_some_and(|argument| {
        argument == supercov_engine::rust_owned_nextest::RUNNER_MODE_ARGUMENT
    }) {
        return ExitCode::from(
            supercov_engine::rust_owned_nextest::nextest_runner(
                os_arguments.into_iter().skip(1).collect(),
            )
            .clamp(0, 255) as u8,
        );
    }
    if std::env::var_os(supercov_engine::rust_compiler_orchestration::RUST_COMPILER_INNER_MODE_ENV)
        .is_some()
    {
        return rust_compiler_inner(os_arguments);
    }
    // The parent-death watchdog inherits arbitrary wrapper environments. It
    // must dispatch before Cargo/rustdoc wrapper detection and must never emit
    // user-visible output.
    if os_arguments.as_slice() == [OsStr::new("__watch-process-group")] {
        return match supercov_engine::process_supervision::watch_parent_process_group() {
            Ok(()) => ExitCode::SUCCESS,
            Err(_) => ExitCode::from(125),
        };
    }
    // Cargo inherits both wrapper-mode variables during a doctest build. Its
    // rustc wrapper protocol always prepends the real compiler executable,
    // whereas RUSTDOC receives rustdoc's arguments directly. Dispatch the
    // nested rustc version/build probes first or the rustdoc path would wait
    // for the selection attestation that this same process must publish.
    if std::env::var_os(
        supercov_engine::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV,
    )
    .is_some()
        && os_arguments
            .first()
            .is_some_and(|argument| is_executable_wrapper_program(argument))
    {
        return rust_compiler_wrapper(os_arguments);
    }
    let arguments = std::env::args().skip(1).collect::<Vec<_>>();
    // Doctests of the owned frontend: a merged harness spawns this program
    // once per case; Cargo runs it in place of rustdoc during `cargo test
    // --doc`. Both are told apart by their environment alone.
    if supercov_engine::rust_owned_doctests::is_doctest_child() {
        return ExitCode::from(
            supercov_engine::rust_owned_doctests::doctest_child().clamp(0, 255) as u8,
        );
    }
    if supercov_engine::rust_owned_doctests::is_rustdoc_wrapper(&arguments) {
        return ExitCode::from(
            supercov_engine::rust_owned_doctests::rustdoc_wrapper(arguments).clamp(0, 255) as u8,
        );
    }
    if std::env::var_os(supercov_engine::rust_compiler_orchestration::RUSTDOC_WRAPPER_MODE_ENV)
        .is_some()
    {
        return rustdoc_wrapper(arguments);
    }
    if std::env::var_os(
        supercov_engine::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV,
    )
    .is_some()
    {
        return rust_compiler_wrapper(os_arguments);
    }
    let mut arguments = arguments.into_iter();
    match arguments.next().as_deref() {
        None | Some("help" | "--help" | "-h") => {
            print!("{HELP}");
            ExitCode::SUCCESS
        }
        Some("--version" | "-V") => {
            println!(
                "supercov {} (rust contract v{})",
                supercov_engine::version(),
                supercov_contracts::CONTRACT_VERSION
            );
            ExitCode::SUCCESS
        }
        Some("--") => public_coverage_run(arguments.collect(), RunOptions::default()),
        // The one thing worth asking for before the command: credit every test
        // with what it reached, wherever that can only be had by running the
        // suite differently. Written once here rather than as a flag per
        // language, because what someone wants is the same thing in all of
        // them.
        Some("--exact-attribution") => match arguments.next().as_deref() {
            Some("--") => public_coverage_run(
                arguments.collect(),
                RunOptions {
                    exact_attribution: true,
                },
            ),
            _ => {
                eprintln!(
                    "[supercov] --exact-attribution goes before the command: supercov --exact-attribution -- <test command>"
                );
                ExitCode::from(2)
            }
        },
        Some("__instrument-js") => instrument_js(),
        Some("__analyze-coverage-core") => analyze_coverage_core(),
        Some("__analyze-coverage-results") => analyze_coverage_report(),
        Some("__analyze-evidence-archive") => analyze_evidence_archive(),
        Some("__minimum-test-set") => minimum_test_sets(),
        Some("__roundtrip-query-index") => roundtrip_query_indexes(),
        Some("__query-index-files") => query_index_files(),
        Some("__query-stored-run") => query_stored_run(),
        Some("__discover-source") => discover_source(),
        Some("__discover-project") => discover_project(),
        Some("__lifecycle") => lifecycle(),
        Some("__workspace") => workspace(),
        Some("__supervise") => supervise(),
        Some("__run-js-direct") => run_js_direct(),
        Some("__sweep-trash") => sweep_trash(),
        Some("__benchmark-js-transform") => benchmark_js_transform(),
        Some("__pack-evidence") => pack_evidence(),
        Some("__validate-rust-compiler-manifest") => validate_rust_compiler_manifest(),
        Some("__normalize-rust-compiler-manifest") => normalize_rust_compiler_manifest(),
        Some("__join-rustdoc-merged-manifest") => join_rustdoc_merged_manifest(),
        Some("__prepare-rustdoc-transport") => prepare_rustdoc_transport(arguments.collect()),
        Some("__publish-rustdoc-outcome") => publish_rustdoc_outcome(arguments.collect()),
        Some(supercov_engine::rust_owned_doctests::RUNTOOL_MODE_ARGUMENT) => ExitCode::from(
            supercov_engine::rust_owned_doctests::doctest_runtool(arguments.collect()).clamp(0, 255)
                as u8,
        ),
        Some("__project-rust-compiler-evidence") => project_rust_compiler_evidence(),
        Some("__select-rust-compiler-companion") => select_rust_compiler_companion(),
        Some("__prepare-rust-libtest-source") => prepare_rust_libtest_source(arguments.collect()),
        Some("__build-rust-libtest-companion") => build_rust_libtest_companion(arguments.collect()),
        Some("__build-rust-compiler") => build_rust_compiler(),
        Some("__run-rust-compiler") => run_rust_compiler(),
        Some("quality") => quality::command(arguments.collect()),
        Some("security") => quality::security_command(arguments.collect()),
        Some("docs") => docs_command(arguments.collect()),
        Some("assertions") => assertions_query::global_command(&arguments.collect::<Vec<_>>()),
        Some("runs") => {
            let arguments: Vec<String> = arguments.collect();
            match arguments.split_first() {
                Some((first, rest)) if first == "clean" => cleanup_command(rest.to_vec()),
                _ => public_query_command("runs", arguments),
            }
        }
        Some("diff") => public_query_command("diff", arguments.collect()),
        Some("report") => html_report::report_command(arguments.collect()),
        Some("merge") => merge_command(arguments.collect()),
        Some(command) => {
            eprintln!("[supercov] Unknown command: {command}. Try supercov help.");
            ExitCode::from(2)
        }
    }
}

fn prepare_rust_libtest_source(arguments: Vec<String>) -> ExitCode {
    let result = (|| -> Result<(), String> {
        let [source_root, destination, rustc] = arguments.as_slice() else {
            return Err(
                "__prepare-rust-libtest-source requires SOURCE_ROOT DESTINATION RUSTC".into(),
            );
        };
        let compiler =
            supercov_engine::rust_compiler_selection::probe_rustc_identity(Path::new(rustc))
                .map_err(|error| error.to_string())?;
        let identity = supercov_engine::rust_libtest_companion::prepare_exact_libtest_source(
            Path::new(source_root),
            Path::new(destination),
            &compiler,
        )
        .map_err(|error| error.to_string())?;
        println!(
            "{}",
            serde_json::to_string(&identity).map_err(|error| error.to_string())?
        );
        Ok(())
    })();
    match result {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn build_rust_libtest_companion(arguments: Vec<String>) -> ExitCode {
    let result = (|| -> Result<(), String> {
        let [source_root, work_root, rustc, compiler_companion] = arguments.as_slice() else {
            return Err(
                "__build-rust-libtest-companion requires SOURCE_ROOT WORK_ROOT RUSTC COMPILER_COMPANION"
                    .into(),
            );
        };
        let selected = supercov_engine::rust_libtest_companion::build_exact_rust_libtest_companion(
            Path::new(source_root),
            Path::new(work_root),
            Path::new(rustc),
            Path::new(compiler_companion),
        )
        .map_err(|error| error.to_string())?;
        println!(
            "{}",
            serde_json::to_string(&selected.bundle).map_err(|error| error.to_string())?
        );
        Ok(())
    })();
    match result {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

/// The command the reader used to start Supercov. The npm package sets
/// `SUPERCOV_PACKAGE_ROOT`, the Go launcher sets `SUPERCOV_LAUNCHER=go`, and
/// the PyPI, Ruby and Rust packages run the binary itself as `supercov`.
fn launcher_command() -> &'static str {
    match std::env::var("SUPERCOV_LAUNCHER").as_deref() {
        Ok("go") => "go run github.com/supercorp-ai/supercov/cmd/supercov@latest",
        _ if std::env::var_os("SUPERCOV_PACKAGE_ROOT").is_some() => "npx supercov",
        _ => "supercov",
    }
}

/// Guides write commands as `npx supercov …`, and sometimes as bare
/// `supercov …`. Print both the way the reader started Supercov, in shell
/// blocks and inline code, so a pasted command runs. `text` blocks are
/// recorded output and stay exactly as recorded.
fn localize_guide(markdown: &str, command: &str) -> String {
    // A bare `supercov` on its own names the binary; with arguments it is a command.
    let rewrite = |code: &str| -> Option<String> {
        if let Some(rest) = code.strip_prefix("npx supercov") {
            return (rest.is_empty() || rest.starts_with(' ')).then(|| format!("{command}{rest}"));
        }
        let rest = code.strip_prefix("supercov")?;
        rest.starts_with(' ').then(|| format!("{command}{rest}"))
    };
    let mut fence: Option<bool> = None;
    let mut out = String::with_capacity(markdown.len());
    for line in markdown.split_inclusive('\n') {
        let trimmed = line.trim_start();
        if trimmed.starts_with("```") {
            fence = match fence {
                Some(_) => None,
                None => {
                    let info = trimmed.trim_start_matches('`').trim();
                    let language = info.split_whitespace().next().unwrap_or("");
                    Some(matches!(language, "sh" | "bash" | "shell" | "console"))
                }
            };
            out.push_str(line);
            continue;
        }
        match fence {
            Some(true) => {
                let indent = &line[..line.len() - trimmed.len()];
                let (prompt, body) = trimmed
                    .strip_prefix("$ ")
                    .map_or(("", trimmed), |body| ("$ ", body));
                match rewrite(body) {
                    Some(text) => out.push_str(&format!("{indent}{prompt}{text}")),
                    None => out.push_str(line),
                }
            }
            Some(false) => out.push_str(line),
            None => {
                // Inline code: every other backtick-separated piece is code.
                for (index, piece) in line.split('`').enumerate() {
                    if index > 0 {
                        out.push('`');
                    }
                    match (index % 2 == 1).then(|| rewrite(piece)).flatten() {
                        Some(text) => out.push_str(&text),
                        None => out.push_str(piece),
                    }
                }
            }
        }
    }
    out
}

fn docs_command(arguments: Vec<String>) -> ExitCode {
    if arguments
        .iter()
        .any(|argument| matches!(argument.as_str(), "--help" | "-h"))
    {
        println!(
            "Usage: supercov docs [topic]\n\nWithout a topic, lists bundled Markdown guides. With a topic, prints that guide to stdout."
        );
        return ExitCode::SUCCESS;
    }
    if arguments.len() > 1 {
        eprintln!("[supercov] docs accepts at most one topic");
        return ExitCode::from(2);
    }
    let Some(topic) = arguments.first() else {
        println!("Bundled guides");
        for topic in DOC_TOPICS {
            println!("  {topic}");
        }
        return ExitCode::SUCCESS;
    };
    if !DOC_TOPICS.contains(&topic.as_str()) {
        eprintln!("[supercov] unknown guide {topic:?}; run `supercov docs` to list topics");
        return ExitCode::from(2);
    }
    let embedded = match topic.as_str() {
        "getting-started" => Some(include_str!("../assets/docs/getting-started.md")),
        "agent-loop" => Some(include_str!("../assets/docs/agent-loop.md")),
        "assertions" => Some(include_str!("../assets/docs/assertions.md")),
        "assertion-evidence" => Some(include_str!("../assets/docs/assertion-evidence.md")),
        "assertion-maps" => Some(include_str!("../assets/docs/assertion-maps.md")),
        "assertion-agent" => Some(include_str!("../assets/docs/assertion-agent.md")),
        "troubleshooting" => Some(include_str!("../assets/docs/troubleshooting.md")),
        "cli" => Some(include_str!("../assets/docs/cli.md")),
        "coverage-model" => Some(include_str!("../assets/docs/coverage-model.md")),
        "quality" => Some(include_str!("../assets/docs/quality.md")),
        "security" => Some(include_str!("../assets/docs/security.md")),
        "evidence" => Some(include_str!("../assets/docs/evidence.md")),
        "supported-suites" => Some(include_str!("../assets/docs/supported-suites.md")),
        "verification" => Some(include_str!("../assets/docs/verification.md")),
        "performance" => Some(include_str!("../assets/docs/performance.md")),
        "workspace-isolation" => Some(include_str!("../assets/docs/workspace-isolation.md")),
        _ => None,
    };
    let command = launcher_command();
    if let Some(markdown) = embedded {
        print!("{}", localize_guide(markdown, command));
        return ExitCode::SUCCESS;
    }
    let mut roots = Vec::new();
    if let Some(root) = std::env::var_os("SUPERCOV_PACKAGE_ROOT") {
        roots.push(PathBuf::from(root));
    }
    if let Ok(root) = std::env::current_dir() {
        roots.push(root);
    }
    roots.push(PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../.."));
    for root in roots {
        let path = root.join("docs").join(format!("{topic}.md"));
        match fs::read_to_string(&path) {
            Ok(markdown) => {
                print!("{}", localize_guide(&markdown, command));
                if !markdown.ends_with('\n') {
                    println!();
                }
                return ExitCode::SUCCESS;
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => continue,
            Err(error) => {
                eprintln!("[supercov] could not read {}: {error}", path.display());
                return ExitCode::from(1);
            }
        }
    }
    eprintln!(
        "[supercov] guide {topic:?} is not present in this installation; reinstall Supercov or use the repository documentation"
    );
    ExitCode::from(1)
}

fn rust_cargo_test_runner(arguments: Vec<OsString>) -> ExitCode {
    let Some(config_path) =
        std::env::var_os(supercov_engine::rust_compiler_test_runner::RUST_CARGO_RUNNER_CONFIG_ENV)
            .map(PathBuf::from)
    else {
        eprintln!("[supercov] Cargo test runner configuration is missing");
        return ExitCode::from(2);
    };
    let watchdog = std::env::current_exe()
        .ok()
        .and_then(|path| fs::canonicalize(path).ok());
    let mut stdout = std::io::stdout().lock();
    let mut stderr = std::io::stderr().lock();
    match supercov_engine::rust_compiler_test_runner::run_cargo_libtest_runner(
        &config_path,
        arguments,
        watchdog,
        &mut stdout,
        &mut stderr,
    ) {
        Ok(execution) => ExitCode::from(execution.exit_code.clamp(0, 255) as u8),
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn strip_injected_rustdoc_runner(
    arguments: Vec<String>,
    runner: &Path,
    target_runners: &[supercov_engine::rust_cargo_configuration::RustCargoResolvedTargetRunner],
) -> Result<Vec<String>, String> {
    let runner = runner
        .to_str()
        .ok_or_else(|| "the injected Cargo runner path is not UTF-8".to_owned())?;
    let mut stripped = Vec::with_capacity(arguments.len());
    let mut arguments = arguments.into_iter();
    let mut removed_runner = false;
    let mut runner_arguments = Vec::new();
    while let Some(argument) = arguments.next() {
        if argument == "--test-runtool" {
            let value = arguments
                .next()
                .ok_or_else(|| "rustdoc --test-runtool has no value".to_owned())?;
            if value != runner || removed_runner {
                return Err(format!(
                    "rustdoc received an unexpected test runner: {value}"
                ));
            }
            removed_runner = true;
            continue;
        }
        if let Some(value) = argument.strip_prefix("--test-runtool=") {
            if value != runner || removed_runner {
                return Err(format!(
                    "rustdoc received an unexpected test runner: {value}"
                ));
            }
            removed_runner = true;
            continue;
        }
        if argument == "--test-runtool-arg" {
            let value = arguments
                .next()
                .ok_or_else(|| "rustdoc --test-runtool-arg has no value".to_owned())?;
            runner_arguments.push(value);
            continue;
        }
        if let Some(value) = argument.strip_prefix("--test-runtool-arg=") {
            runner_arguments.push(value.to_owned());
            continue;
        }
        stripped.push(argument);
    }
    if !removed_runner {
        return Err("rustdoc did not receive Supercov's injected Cargo runner".into());
    }
    let [marker, target] = runner_arguments.as_slice() else {
        return Err(format!(
            "rustdoc received {} injected Cargo runner arguments; expected the marker and target identity",
            runner_arguments.len()
        ));
    };
    if marker != "__cargo-test-runner" {
        return Err(format!(
            "rustdoc received an unexpected test-runner marker: {marker}"
        ));
    }
    let mut matching_targets = target_runners
        .iter()
        .filter(|candidate| candidate.target == *target);
    let target_runner = matching_targets.next().ok_or_else(|| {
        format!("rustdoc received an unconfigured Cargo target identity: {target}")
    })?;
    if matching_targets.next().is_some() {
        return Err(format!(
            "Rust compiler wrapper configuration duplicates Cargo target identity: {target}"
        ));
    }
    if let Some(underlying_runner) = &target_runner.underlying_runner {
        let program = underlying_runner
            .program
            .to_str()
            .ok_or_else(|| "the configured Cargo runner path is not UTF-8".to_owned())?;
        stripped.extend(["--test-runtool".into(), program.into()]);
        for argument in &underlying_runner.arguments {
            stripped.extend(["--test-runtool-arg".into(), argument.clone()]);
        }
    }
    Ok(stripped)
}

fn rustdoc_wrapper(arguments: Vec<String>) -> ExitCode {
    let Some(config_path) = std::env::var_os(
        supercov_engine::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV,
    )
    .map(PathBuf::from) else {
        eprintln!("[supercov] Cargo rustdoc wrapper configuration is missing");
        return ExitCode::from(2);
    };
    let result = (|| -> Result<ExitCode, String> {
        let metadata = fs::symlink_metadata(&config_path).map_err(|error| error.to_string())?;
        if !metadata.file_type().is_file() {
            return Err(format!(
                "unsafe Rust compiler wrapper configuration: {}",
                config_path.display()
            ));
        }
        let config: supercov_engine::rust_compiler_orchestration::RustCompilerWrapperConfig =
            serde_json::from_slice(&fs::read(&config_path).map_err(|error| error.to_string())?)
                .map_err(|error| format!("invalid Rust compiler wrapper configuration: {error}"))?;
        let engine = fs::canonicalize(std::env::current_exe().map_err(|error| error.to_string())?)
            .map_err(|error| error.to_string())?;
        // Cargo forwards the configured target runner to rustdoc as
        // --test-runtool. Ordinary libtest artifacts must pass through the
        // Cargo-authoritative runner, while rustdoc already has its own exact
        // catalog/outcome/transport supervisor below. Remove only Supercov's
        // injected pair so the same executable is not misclassified twice.
        // Any configured or malformed alternative fails closed.
        let arguments = strip_injected_rustdoc_runner(arguments, &engine, &config.target_runners)?;
        let started = Instant::now();
        let selection = loop {
            match supercov_engine::rust_compiler_orchestration::verified_compiler_selection(
                &config.selection_directory,
                &config.candidates,
                config.require_public_capabilities,
                true,
            )
            .map_err(|error| error.to_string())?
            {
                Some(selection) => break selection,
                None if started.elapsed() < Duration::from_secs(30) => {
                    std::thread::sleep(Duration::from_millis(10));
                }
                None => {
                    return Err(
                        "timed out waiting for Cargo's authenticated rustc selection before rustdoc"
                            .into(),
                    );
                }
            }
        };
        let rustdoc =
            supercov_engine::rust_compiler_selection::resolve_matching_rustdoc(&selection)
                .map_err(|error| error.to_string())?;
        let mut command = Command::new(&selection.companion_path);
        command
            .args(&arguments)
            .env_remove(supercov_engine::rust_compiler_orchestration::RUSTDOC_WRAPPER_MODE_ENV)
            .env(
                supercov_engine::rust_compiler_orchestration::RUST_REAL_RUSTDOC_ENV,
                &rustdoc,
            )
            .env(
                supercov_engine::rust_compiler_orchestration::RUST_COMPANION_PATH_ENV,
                &selection.companion_path,
            )
            .env(
                supercov_engine::rust_compiler_orchestration::RUSTDOC_CAPTURE_OUTCOMES_ENV,
                "1",
            )
            .env(
                supercov_engine::rust_compiler_orchestration::RUSTDOC_ENGINE_PATH_ENV,
                &engine,
            )
            .env(
                supercov_engine::rust_compiler_orchestration::RUST_STATIC_RUNTIME_DIRECTORY_ENV,
                &config.shared_runtime_directory,
            );
        supercov_engine::rust_compiler_selection::configure_companion_loader_environment(
            &mut command,
            &selection.compiler_library_directory,
        )
        .map_err(|error| error.to_string())?;
        #[cfg(unix)]
        {
            use std::os::unix::process::CommandExt as _;
            command.arg0("supercov-rustdoc-backend-spike");
            let error = command.exec();
            Err(format!(
                "could not execute exact Rust rustdoc companion: {error}"
            ))
        }
        #[cfg(not(unix))]
        {
            // Windows has no exec: run the companion in place and hand its
            // exit status back to Cargo.
            let status = command.status().map_err(|error| {
                format!("could not execute exact Rust rustdoc companion: {error}")
            })?;
            Ok(ExitCode::from(
                status.code().unwrap_or(1).clamp(0, 255) as u8
            ))
        }
    })();
    match result {
        Ok(status) => status,
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn load_rust_compiler_wrapper_config()
-> Result<supercov_engine::rust_compiler_orchestration::RustCompilerWrapperConfig, String> {
    let Some(config_path) = std::env::var_os(
        supercov_engine::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV,
    )
    .map(PathBuf::from) else {
        return Err("Cargo compiler wrapper configuration is missing".into());
    };
    let metadata = fs::symlink_metadata(&config_path).map_err(|error| error.to_string())?;
    if !metadata.file_type().is_file() {
        return Err(format!(
            "unsafe Rust compiler wrapper configuration: {}",
            config_path.display()
        ));
    }
    serde_json::from_slice(&fs::read(&config_path).map_err(|error| error.to_string())?)
        .map_err(|error| format!("invalid Rust compiler wrapper configuration: {error}"))
}

fn canonical_program(path: &Path, cwd: &Path) -> Result<PathBuf, String> {
    let candidates = if path.is_absolute() {
        vec![path.to_owned()]
    } else if path.components().count() > 1 {
        vec![cwd.join(path)]
    } else {
        std::env::var_os("PATH")
            .map(|value| {
                std::env::split_paths(&value)
                    .map(|directory| directory.join(path))
                    .collect()
            })
            .unwrap_or_default()
    };
    candidates
        .into_iter()
        .find_map(|candidate| fs::canonicalize(candidate).ok())
        .ok_or_else(|| format!("could not resolve compiler program {}", path.display()))
}

fn same_program(left: &OsStr, right: &Path, cwd: &Path) -> Result<bool, String> {
    if left == right.as_os_str() {
        return Ok(true);
    }
    Ok(canonical_program(Path::new(left), cwd)? == canonical_program(right, cwd)?)
}

fn execute_compiler_command(mut command: Command) -> Result<ExitCode, String> {
    #[cfg(unix)]
    {
        use std::os::unix::process::CommandExt as _;
        let error = command.exec();
        Err(format!("could not execute Cargo compiler chain: {error}"))
    }
    #[cfg(not(unix))]
    {
        let status = command
            .status()
            .map_err(|error| format!("could not execute Cargo compiler chain: {error}"))?;
        Ok(ExitCode::from(
            status.code().unwrap_or(1).clamp(0, 255) as u8
        ))
    }
}

fn is_test_extern(value: &OsStr) -> bool {
    let value = value.to_string_lossy();
    value
        .split_once('=')
        .map_or(value.as_ref(), |(name, _)| name)
        .split(':')
        .next_back()
        == Some("test")
}

fn rustc_builds_test_harness(arguments: &[OsString]) -> Result<bool, String> {
    let builds_harness = arguments.iter().any(|argument| argument == "--test");
    if !builds_harness {
        return Ok(false);
    }
    let mut index = 0;
    while index < arguments.len() {
        let argument = &arguments[index];
        let existing_test = if argument == "--extern" {
            index += 1;
            arguments
                .get(index)
                .is_some_and(|value| is_test_extern(value))
        } else {
            argument
                .to_string_lossy()
                .strip_prefix("--extern=")
                .is_some_and(|value| is_test_extern(OsStr::new(value)))
        };
        if existing_test {
            return Err(
                "a Cargo test-harness compiler invocation already supplies an external `test` crate"
                    .into(),
            );
        }
        index += 1;
    }
    Ok(true)
}

fn rust_compiler_inner(mut arguments: Vec<OsString>) -> ExitCode {
    let result = (|| -> Result<ExitCode, String> {
        let config = load_rust_compiler_wrapper_config()?;
        let rustc = std::env::var_os(
            supercov_engine::rust_compiler_orchestration::RUST_ORIGINAL_COMPILER_ENV,
        )
        .ok_or_else(|| "Cargo compiler bridge has no original compiler identity".to_owned())?;
        let selection = supercov_engine::rust_compiler_selection::select_rust_compiler_companion(
            Path::new(&rustc),
            &config.candidates,
            config.require_public_capabilities,
        )
        .map_err(|error| error.to_string())?;
        if rustc_builds_test_harness(&arguments)? {
            let libtest =
                supercov_engine::rust_libtest_companion::select_rust_libtest_companion(&selection)
                    .map_err(|error| error.to_string())?;
            arguments.push("--extern".into());
            arguments.push(format!("test={}", libtest.artifact_path.display()).into());
        }

        let mut command = Command::new(&selection.companion_path);
        command
            .arg(&selection.rustc_path)
            .args(&arguments)
            .env_remove(supercov_engine::rust_compiler_orchestration::RUST_COMPILER_INNER_MODE_ENV)
            .env_remove(supercov_engine::rust_compiler_orchestration::RUST_ORIGINAL_COMPILER_ENV)
            .env_remove(
                supercov_engine::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV,
            )
            .env(
                supercov_engine::rust_compiler_orchestration::RUST_STATIC_RUNTIME_DIRECTORY_ENV,
                &config.shared_runtime_directory,
            );
        config
            .original_wrapper_environment
            .restore(&mut command)
            .map_err(|error| error.to_string())?;
        supercov_engine::rust_compiler_selection::configure_companion_loader_environment(
            &mut command,
            &selection.compiler_library_directory,
        )
        .map_err(|error| error.to_string())?;
        execute_compiler_command(command)
    })();
    match result {
        Ok(status) => status,
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn rust_compiler_wrapper(arguments: Vec<OsString>) -> ExitCode {
    let result = (|| -> Result<ExitCode, String> {
        let config = load_rust_compiler_wrapper_config()?;
        let engine = fs::canonicalize(std::env::current_exe().map_err(|error| error.to_string())?)
            .map_err(|error| error.to_string())?;
        let Some(first) = arguments.first() else {
            return Err("Cargo compiler wrapper received no compiler path".into());
        };
        let workspace_invocation = same_program(first, &engine, &config.project_root)?;
        let (rustc, compiler_arguments) = if workspace_invocation {
            let Some(rustc) = arguments.get(1) else {
                return Err("Cargo workspace compiler bridge received no rustc path".into());
            };
            (rustc, &arguments[2..])
        } else {
            (first, &arguments[1..])
        };
        let general_wrapper = config
            .compiler
            .rustc_wrapper
            .as_ref()
            .map(|program| program.resolve(&config.project_root));
        let workspace_wrapper = config
            .compiler
            .rustc_workspace_wrapper
            .as_ref()
            .map(|program| program.resolve(&config.project_root));
        for wrapper in general_wrapper.iter().chain(workspace_wrapper.iter()) {
            if same_program(wrapper.as_os_str(), &engine, &config.project_root)? {
                return Err(format!(
                    "the original Cargo compiler-wrapper chain recursively contains Supercov: {}",
                    wrapper.display()
                ));
            }
        }

        let mut chain = Vec::<OsString>::new();
        if let Some(wrapper) = &general_wrapper {
            chain.push(wrapper.clone().into_os_string());
        }
        if workspace_invocation {
            if let Some(wrapper) = &workspace_wrapper {
                chain.push(wrapper.clone().into_os_string());
            }
            let selection =
                supercov_engine::rust_compiler_selection::select_rust_compiler_companion(
                    Path::new(rustc),
                    &config.candidates,
                    config.require_public_capabilities,
                )
                .map_err(|error| error.to_string())?;
            supercov_engine::rust_compiler_orchestration::publish_compiler_selection_attestation(
                &config.selection_directory,
                &selection,
            )
            .map_err(|error| error.to_string())?;
            supercov_engine::rust_compiler_orchestration::prepare_shared_rust_runtime(
                Path::new(rustc),
                &config.shared_runtime_directory,
            )
            .map_err(|error| error.to_string())?;
            chain.push(engine.clone().into_os_string());
        } else {
            chain.push(rustc.clone());
        }
        chain.extend(compiler_arguments.iter().cloned());
        let program = PathBuf::from(chain.remove(0));
        let mut command = Command::new(program);
        command.args(chain);
        config
            .original_wrapper_environment
            .restore(&mut command)
            .map_err(|error| error.to_string())?;
        if workspace_invocation {
            command.env(
                supercov_engine::rust_compiler_orchestration::RUST_COMPILER_INNER_MODE_ENV,
                "1",
            );
            command.env(
                supercov_engine::rust_compiler_orchestration::RUST_ORIGINAL_COMPILER_ENV,
                rustc,
            );
        } else {
            command
                .env_remove(
                    supercov_engine::rust_compiler_orchestration::RUST_COMPILER_INNER_MODE_ENV,
                )
                .env_remove(
                    supercov_engine::rust_compiler_orchestration::RUST_COMPILER_WRAPPER_CONFIG_ENV,
                )
                .env_remove(
                    supercov_engine::rust_compiler_orchestration::RUST_ORIGINAL_COMPILER_ENV,
                );
        }
        execute_compiler_command(command)
    })();
    match result {
        Ok(status) => status,
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn build_rust_compiler() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: supercov_engine::rust_compiler_orchestration::RustCompilerBuildRequest =
        match serde_json::from_str(&input) {
            Ok(request) => request,
            Err(error) => {
                eprintln!("[supercov] invalid Rust compiler build request: {error}");
                return ExitCode::from(2);
            }
        };
    match supercov_engine::rust_compiler_orchestration::build_with_rust_compiler_companion(&request)
    {
        Ok(build) => match serde_json::to_string(&build) {
            Ok(output) => {
                println!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                eprintln!("[supercov] could not serialize Rust compiler build: {error}");
                ExitCode::from(2)
            }
        },
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn run_rust_compiler() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let mut request: supercov_engine::rust_compiler_run::DirectRustCompilerRunRequest =
        match serde_json::from_str(&input) {
            Ok(request) => request,
            Err(error) => {
                eprintln!("[supercov] invalid Rust compiler run request: {error}");
                return ExitCode::from(2);
            }
        };
    request.watchdog_program = std::env::current_exe()
        .ok()
        .and_then(|path| fs::canonicalize(path).ok());
    request.publication_fault = match std::env::var("SUPERCOV_RUSTC_SPIKE_PUBLICATION_FAULT") {
        Ok(_) if request.require_public_capabilities => {
            eprintln!("[supercov] Rust compiler publication faults are private spike-only inputs");
            return ExitCode::from(2);
        }
        Ok(value) if value == "archive-enospc" => {
            Some(supercov_engine::rust_compiler_run::RustCompilerPublicationFault::ArchiveEnospc)
        }
        Ok(value) if value == "final-rename" => {
            Some(supercov_engine::rust_compiler_run::RustCompilerPublicationFault::FinalRename)
        }
        Ok(value) if value == "wait-before-publication" => Some(
            supercov_engine::rust_compiler_run::RustCompilerPublicationFault::WaitBeforePublication,
        ),
        Ok(value) => {
            eprintln!("[supercov] unknown Rust compiler publication fault: {value}");
            return ExitCode::from(2);
        }
        Err(std::env::VarError::NotPresent) => None,
        Err(error) => {
            eprintln!("[supercov] invalid Rust compiler publication fault: {error}");
            return ExitCode::from(2);
        }
    };
    let run = match supercov_engine::rust_compiler_run::run_direct_rust_compiler(
        &request,
        &mut std::io::stderr(),
    ) {
        Ok(run) => run,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(error.exit_code.clamp(0, 255) as u8);
        }
    };
    match serde_json::to_string(&run) {
        Ok(output) => {
            println!("{output}");
            ExitCode::from(run.exit_code.clamp(0, 255) as u8)
        }
        Err(error) => {
            eprintln!("[supercov] could not serialize Rust compiler run: {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RustCompilerSelectionInput {
    rustc_path: PathBuf,
    candidates: Vec<PathBuf>,
    require_public_capabilities: bool,
}

fn select_rust_compiler_companion() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: RustCompilerSelectionInput = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid Rust compiler selection request: {error}");
            return ExitCode::from(2);
        }
    };
    match supercov_engine::rust_compiler_selection::select_rust_compiler_companion(
        &request.rustc_path,
        &request.candidates,
        request.require_public_capabilities,
    ) {
        Ok(selection) => match serde_json::to_string(&selection) {
            Ok(output) => {
                println!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                eprintln!("[supercov] could not serialize Rust compiler selection: {error}");
                ExitCode::from(2)
            }
        },
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RustCompilerProjectionInput {
    normalization: supercov_engine::rust_compiler_manifest::RustCompilerNormalizationRequest,
    transport_path: PathBuf,
    token_hex: String,
    base_context_id: String,
    base_phase: supercov_engine::coverage_report::CoveragePhase,
}

fn rust_transport_token(value: &str) -> Result<[u8; 16], String> {
    if value.len() != 32 || !value.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        return Err("Rust transport token must be exactly 32 hexadecimal digits".into());
    }
    let mut token = [0_u8; 16];
    for (index, byte) in token.iter_mut().enumerate() {
        *byte = u8::from_str_radix(&value[index * 2..index * 2 + 2], 16)
            .map_err(|error| format!("invalid Rust transport token: {error}"))?;
    }
    Ok(token)
}

fn project_rust_compiler_evidence() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: RustCompilerProjectionInput = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid Rust compiler evidence request: {error}");
            return ExitCode::from(2);
        }
    };
    let result = (|| {
        let normalized = request
            .normalization
            .manifest
            .normalize(&request.normalization.sources)
            .map_err(|error| error.to_string())?;
        let token = rust_transport_token(&request.token_hex)?;
        let context = request
            .base_context_id
            .parse::<u64>()
            .map_err(|error| format!("invalid Rust base context: {error}"))?;
        let transport = supercov_engine::rust_probe_transport::read_rust_transport(
            &request.transport_path,
            &token,
        )
        .map_err(|error| error.to_string())?;
        supercov_engine::rust_compiler_evidence::project_rust_compiler_evidence(
            context,
            &request.base_phase,
            &transport,
            &normalized,
        )
        .map_err(|error| error.to_string())
    })();
    match result.and_then(|projection| {
        serde_json::to_string(&projection)
            .map_err(|error| format!("could not serialize Rust compiler evidence: {error}"))
    }) {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn normalize_rust_compiler_manifest() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    match supercov_engine::rust_compiler_manifest::RustCompilerNormalizationRequest::parse_and_normalize(
        input.as_bytes(),
    ) {
        Ok(normalized) => match serde_json::to_string(&normalized) {
            Ok(output) => {
                println!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                eprintln!("[supercov] could not serialize normalized Rust manifest: {error}");
                ExitCode::from(2)
            }
        },
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn validate_rust_compiler_manifest() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    match supercov_engine::rust_compiler_manifest::RustCompilerManifest::parse(input.as_bytes()) {
        Ok(manifest) => {
            println!("{}", manifest.crate_name);
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RustdocMergedJoinInput {
    pending_manifest: serde_json::Value,
    pending_sources: serde_json::Value,
    map: serde_json::Value,
    authored_sources: std::collections::BTreeMap<
        String,
        supercov_engine::rust_compiler_manifest::RustCompilerSource,
    >,
}

fn join_rustdoc_merged_manifest() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: RustdocMergedJoinInput = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid merged rustdoc join request: {error}");
            return ExitCode::from(2);
        }
    };
    let result = (|| {
        let manifest = serde_json::to_vec(&request.pending_manifest)
            .map_err(|error| format!("could not encode pending rustdoc manifest: {error}"))?;
        let sources = serde_json::to_vec(&request.pending_sources)
            .map_err(|error| format!("could not encode pending rustdoc sources: {error}"))?;
        let map = serde_json::to_vec(&request.map)
            .map_err(|error| format!("could not encode rustdoc source map: {error}"))?;
        let joined = supercov_engine::rust_doctest::join_merged_doctest(
            &manifest,
            &sources,
            &map,
            &request.authored_sources,
        )
        .map_err(|error| error.to_string())?;
        serde_json::to_string(&joined)
            .map_err(|error| format!("could not serialize merged rustdoc join: {error}"))
    })();
    match result {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn publish_rustdoc_outcome(arguments: Vec<String>) -> ExitCode {
    let [directory, invocation_id, group, companion_build_id] = arguments.as_slice() else {
        eprintln!(
            "[supercov] rustdoc outcome publication requires directory, invocation, group and companion build identity"
        );
        return ExitCode::from(2);
    };
    let input = match stdin_bytes() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let result = (|| {
        let transport_path =
            std::env::var_os(supercov_engine::rust_probe_transport::RUST_TRANSPORT_ENV)
                .ok_or_else(|| {
                    supercov_engine::rust_doctest::RustdocOutcomeError::Invalid(
                        "rustdoc outcome publisher has no reserved transport path".into(),
                    )
                })?;
        let transport_token =
            std::env::var(supercov_engine::rust_probe_transport::RUST_TRANSPORT_TOKEN_ENV)
                .map_err(|_| {
                    supercov_engine::rust_doctest::RustdocOutcomeError::Invalid(
                        "rustdoc outcome publisher has no reserved transport token".into(),
                    )
                })?;
        let transport_path = PathBuf::from(transport_path);
        let transport = supercov_engine::rust_doctest::read_reserved_rustdoc_transport(
            &transport_path,
            &transport_token,
        )?;
        let unit = supercov_engine::rust_doctest::rustdoc_outcome_unit_from_framed_input(
            invocation_id.clone(),
            group.clone(),
            companion_build_id.clone(),
            &input,
            transport,
        )?;
        let path = supercov_engine::rust_doctest::publish_rustdoc_outcome_unit(
            Path::new(directory),
            &unit,
        )?;
        fs::remove_file(&transport_path).map_err(|error| {
            supercov_engine::rust_doctest::RustdocOutcomeError::Io {
                path: transport_path,
                reason: error.to_string(),
            }
        })?;
        serde_json::to_string(&serde_json::json!({
            "path": path,
            "unit": unit,
        }))
        .map_err(|error| {
            supercov_engine::rust_doctest::RustdocOutcomeError::Json(error.to_string())
        })
    })();
    match result {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn prepare_rustdoc_transport(arguments: Vec<String>) -> ExitCode {
    let [directory, invocation_id] = arguments.as_slice() else {
        eprintln!(
            "[supercov] rustdoc transport preparation requires directory and invocation identity"
        );
        return ExitCode::from(2);
    };
    let result = supercov_engine::rust_doctest::reserve_rustdoc_transport(
        Path::new(directory),
        invocation_id,
    )
    .and_then(|reservation| {
        serde_json::to_string(&serde_json::json!({
            "path": reservation.path,
            "token": supercov_engine::rust_doctest::rustdoc_transport_token_hex(
                &reservation.token,
            ),
        }))
        .map_err(|error| {
            supercov_engine::rust_doctest::RustdocOutcomeError::Json(error.to_string())
        })
    });
    match result {
        Ok(output) => {
            println!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn merge_command(run_ids: Vec<String>) -> ExitCode {
    if run_ids
        .iter()
        .any(|argument| matches!(argument.as_str(), "--help" | "-h"))
    {
        println!("Usage: supercov merge <run-id> <run-id> [...]");
        return ExitCode::SUCCESS;
    }
    let root = match std::env::current_dir() {
        Ok(root) => root,
        Err(error) => {
            eprintln!("[supercov] could not resolve the current directory: {error}");
            return ExitCode::from(2);
        }
    };
    let (run_id, started_at) = match public_run_identity() {
        Ok(identity) => identity,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    match supercov_engine::run_merge::merge_coverage_runs(&root, &run_ids, &run_id, &started_at) {
        Ok(merged) => {
            println!("[supercov] merged run {merged}");
            println!("npx supercov runs {merged}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

const PUBLIC_TIMESTAMP_FORMAT: &[time::format_description::BorrowedFormatItem<'static>] =
    format_description!("[year]-[month]-[day]T[hour]:[minute]:[second].[subsecond digits:3]Z");

fn public_run_identity() -> Result<(String, String), String> {
    let started_at = OffsetDateTime::now_utc()
        .format(PUBLIC_TIMESTAMP_FORMAT)
        .map_err(|error| format!("could not generate the run identity: {error}"))?;
    let identity = format!(
        "{started_at}\0{}\0{}",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_nanos()
    );
    let digest = format!("{:x}", Sha256::digest(identity.as_bytes()));
    let run_id = format!("run_{}", &digest[..16]);
    Ok((run_id, started_at))
}

fn public_run_id(value: &str) -> bool {
    value.len() == 20
        && value.starts_with("run_")
        && value[4..]
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
}

const CHECK_USAGE: &str = "supercov runs <run-id> check [--min-lines <pct>] [--min-statements <pct>]\n                           [--min-functions <pct>] [--min-branches <pct>] [--min-mcdc <pct>]\n                           [--per-file] [--json]\n";

/// Gate a recorded run against percentage floors, without running tests again.
///
/// Exit codes follow the CLI contract: 0 passed, 1 a valid measurement that
/// fails policy, 2 a request or evidence that cannot answer the question. The
/// third is the important one -- a failed suite, a stale run, an empty scope or
/// a partly measured metric must never leave a gate green.
fn coverage_check_command(arguments: &[String]) -> ExitCode {
    let mut floors: Vec<supercov_engine::run_view::Floor> = Vec::new();
    let mut per_file = false;
    let mut json = false;
    let mut selector: Option<&str> = None;
    let mut index = 0;
    // `runs <id> check ...`; the id may be absent, meaning the latest run.
    let rest = &arguments[1..];
    if let Some(first) = arguments.first()
        && first != "check"
    {
        selector = Some(first.as_str());
    }
    while index < rest.len() {
        let argument = rest[index].as_str();
        index += 1;
        if argument == "check" {
            continue;
        }
        match argument {
            "--per-file" => per_file = true,
            "--json" => json = true,
            "--help" | "-h" => {
                print!("{CHECK_USAGE}");
                return ExitCode::SUCCESS;
            }
            flag if flag.starts_with("--min-") => {
                let Some(metric) = supercov_engine::run_view::Metric::parse(&flag[6..]) else {
                    eprintln!("[supercov] unknown metric in {flag}\n{CHECK_USAGE}");
                    return ExitCode::from(2);
                };
                let Some(value) = rest.get(index) else {
                    eprintln!("[supercov] {flag} needs a percentage\n{CHECK_USAGE}");
                    return ExitCode::from(2);
                };
                index += 1;
                match supercov_engine::run_view::parse_percentage(value) {
                    Ok(ppm) => floors.push(supercov_engine::run_view::Floor { metric, ppm }),
                    Err(error) => {
                        eprintln!("[supercov] {flag}: {error}");
                        return ExitCode::from(2);
                    }
                }
            }
            other => {
                eprintln!("[supercov] unknown option {other}\n{CHECK_USAGE}");
                return ExitCode::from(2);
            }
        }
    }

    let result = (|| -> Result<supercov_engine::run_view::Outcome, String> {
        let view = load_run_view(selector)?;
        let outcome = supercov_engine::run_view::check(&view, &floors, per_file);
        if json {
            print!(
                "{}",
                agent_json::success(
                    "coverage.check",
                    &serde_json::json!({"view": view, "outcome": outcome}),
                    None,
                )
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes))?
            );
        } else {
            print!("{}", render_check(&view, &floors, &outcome));
        }
        Ok(outcome)
    })();
    match result {
        Ok(outcome) => ExitCode::from(outcome.exit_code()),
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn render_percentage(covered: usize, eligible: usize) -> String {
    if eligible == 0 {
        return "n/a".into();
    }
    format!("{:.2}%", covered as f64 * 100.0 / eligible as f64)
}

fn render_floor(ppm: u64) -> String {
    let text = format!("{:.4}", ppm as f64 / 10_000.0);
    let trimmed = text.trim_end_matches('0').trim_end_matches('.');
    format!("{trimmed}%")
}

fn render_check(
    view: &supercov_engine::run_view::RunView,
    floors: &[supercov_engine::run_view::Floor],
    outcome: &supercov_engine::run_view::Outcome,
) -> String {
    use supercov_engine::run_view::Outcome;
    let mut out = format!("Coverage check for {}\n", view.run);
    for floor in floors {
        if let Some(metric) = view.metric(floor.metric) {
            out.push_str(&format!(
                "  {:<11} {:>8}  {}/{}  (floor {})\n",
                metric.metric.name(),
                render_percentage(metric.covered, metric.eligible),
                metric.covered,
                metric.eligible,
                render_floor(floor.ppm),
            ));
        }
    }
    match outcome {
        Outcome::Pass => out.push_str("\nPASS: every floor is met.\n"),
        Outcome::Fail { violations } => {
            out.push_str(&format!("\nFAIL: {} floor(s) not met.\n", violations.len()));
            for violation in violations {
                let scope = violation.file.as_deref().unwrap_or("(whole run)");
                out.push_str(&format!(
                    "  {scope}: {} {}  {}/{} below {}\n",
                    violation.metric.name(),
                    render_percentage(violation.covered, violation.eligible),
                    violation.covered,
                    violation.eligible,
                    render_floor(violation.floor_ppm),
                ));
                if !violation.uncovered_lines.is_empty() {
                    let shown = violation
                        .uncovered_lines
                        .iter()
                        .take(10)
                        .map(usize::to_string)
                        .collect::<Vec<_>>()
                        .join(", ");
                    let more = violation.uncovered_lines.len().saturating_sub(10);
                    out.push_str(&format!(
                        "    uncovered lines: {shown}{}\n",
                        if more > 0 {
                            format!(", and {more} more")
                        } else {
                            String::new()
                        }
                    ));
                }
            }
        }
        Outcome::Error { reasons } => {
            out.push_str("\nERROR: this run cannot answer the question asked.\n");
            for reason in reasons {
                out.push_str(&format!("  {reason}\n"));
            }
        }
    }
    out
}

const PATCH_USAGE: &str = "supercov runs <run-id> patch --base <ref> [--min-lines <pct>]\n                           [--annotate github] [--max-annotations <n>] [--json]\n";

fn git_output(root: &Path, arguments: &[&str]) -> Result<String, String> {
    let output = Command::new("git")
        .args(arguments)
        .current_dir(root)
        .output()
        .map_err(|error| format!("could not run git: {error}"))?;
    if !output.status.success() {
        return Err(format!(
            "git {} failed: {}",
            arguments.join(" "),
            String::from_utf8_lossy(&output.stderr).trim()
        ));
    }
    Ok(String::from_utf8_lossy(&output.stdout).into_owned())
}

/// Changed lines between the merge base with `base` and the working tree.
///
/// The merge base is the point the branch diverged, not the previous commit.
/// Comparing against the tip of a target branch that has moved on would report
/// other people's lines as this change's obligation.
fn changed_lines_against(
    root: &Path,
    base: &str,
    measured: &supercov_engine::run_view::RunView,
) -> Result<supercov_engine::patch_view::ChangedLines, String> {
    let top = git_output(root, &["rev-parse", "--show-toplevel"])?
        .trim()
        .to_owned();
    let merge_base = git_output(root, &["merge-base", base, "HEAD"])
        .map_err(|error| format!(
            "{error}\nCould not find where this branch left {base}. A shallow checkout has no merge base: fetch with enough history (actions/checkout uses fetch-depth: 0), and make sure {base} exists locally."
        ))?
        .trim()
        .to_owned();
    let diff = git_output(
        root,
        &[
            "diff",
            "--unified=0",
            "--no-color",
            "--find-renames",
            &merge_base,
            "--",
        ],
    )?;
    // Git speaks in repository-relative paths; the run speaks in paths
    // relative to wherever Supercov ran. Translate rather than matching by
    // basename, which would attribute one `index.ts` to another.
    let top = fs::canonicalize(&top).unwrap_or_else(|_| PathBuf::from(&top));
    let here = fs::canonicalize(root).unwrap_or_else(|_| root.to_owned());
    let prefix = here
        .strip_prefix(&top)
        .ok()
        .map(|rest| rest.to_string_lossy().replace('\\', "/"))
        .filter(|rest| !rest.is_empty())
        .map(|rest| format!("{rest}/"));
    let relocate = |path: String| -> Option<String> {
        match prefix.as_ref() {
            Some(prefix) => path.strip_prefix(prefix).map(str::to_owned),
            None => Some(path),
        }
    };
    let mut changed = supercov_engine::patch_view::changed_lines(&diff)
        .into_iter()
        .filter_map(|(path, lines)| relocate(path).map(|path| (path, lines)))
        .collect::<supercov_engine::patch_view::ChangedLines>();
    // An untracked file is entirely new, so every line the adapter measured in
    // it is a changed line. Reading the adapter's own set keeps this consistent
    // with the rest of the denominator.
    for path in git_output(root, &["ls-files", "--others", "--exclude-standard"])?.lines() {
        let Some(path) = relocate(path.trim().to_owned()) else {
            continue;
        };
        if let Some(file) = measured.file(&path) {
            changed
                .entry(path)
                .or_default()
                .extend(file.measured_lines.iter().copied());
        }
    }
    Ok(changed)
}

/// Report coverage of the lines a change touches.
fn coverage_patch_command(arguments: &[String]) -> ExitCode {
    let mut base: Option<String> = None;
    let mut floor: Option<u64> = None;
    let mut annotate = false;
    let mut max_annotations = 50_usize;
    let mut json = false;
    let mut selector: Option<&str> = None;
    if let Some(first) = arguments.first()
        && first != "patch"
    {
        selector = Some(first.as_str());
    }
    let rest = &arguments[1..];
    let mut index = 0;
    while index < rest.len() {
        let argument = rest[index].as_str();
        index += 1;
        match argument {
            "patch" => continue,
            "--json" => json = true,
            "--help" | "-h" => {
                print!("{PATCH_USAGE}");
                return ExitCode::SUCCESS;
            }
            "--base" | "--min-lines" | "--annotate" | "--max-annotations" => {
                let Some(value) = rest.get(index) else {
                    eprintln!("[supercov] {argument} needs a value\n{PATCH_USAGE}");
                    return ExitCode::from(2);
                };
                index += 1;
                match argument {
                    "--base" => base = Some(value.clone()),
                    "--min-lines" => match supercov_engine::run_view::parse_percentage(value) {
                        Ok(ppm) => floor = Some(ppm),
                        Err(error) => {
                            eprintln!("[supercov] --min-lines: {error}");
                            return ExitCode::from(2);
                        }
                    },
                    "--annotate" => {
                        if value != "github" {
                            eprintln!("[supercov] --annotate only supports github");
                            return ExitCode::from(2);
                        }
                        annotate = true;
                    }
                    _ => match value.parse::<usize>() {
                        Ok(parsed) => max_annotations = parsed,
                        Err(_) => {
                            eprintln!("[supercov] --max-annotations needs a whole number");
                            return ExitCode::from(2);
                        }
                    },
                }
            }
            other => {
                eprintln!("[supercov] unknown option {other}\n{PATCH_USAGE}");
                return ExitCode::from(2);
            }
        }
    }
    let Some(base) = base else {
        eprintln!("[supercov] patch needs --base <ref>\n{PATCH_USAGE}");
        return ExitCode::from(2);
    };

    let result = (|| -> Result<u8, String> {
        let root = std::env::current_dir().map_err(|error| error.to_string())?;
        let view = load_run_view(selector)?;
        // Mapping a patch onto coverage recorded from different source would
        // annotate the wrong lines, which is worse than refusing.
        let blockers = view.blockers();
        if !blockers.is_empty() {
            let reasons = blockers
                .into_iter()
                .map(|blocker| blocker.reason)
                .collect::<Vec<_>>();
            if json {
                print!(
                    "{}",
                    agent_json::success(
                        "coverage.patch",
                        &serde_json::json!({"result": "error", "reasons": reasons}),
                        None,
                    )
                    .map_err(|error| format!("response exceeds {} bytes", error.max_bytes))?
                );
            } else {
                eprintln!("[supercov] this run cannot map a patch:");
                for reason in &reasons {
                    eprintln!("  {reason}");
                }
            }
            return Ok(2);
        }
        let changed = changed_lines_against(&root, &base, &view)?;
        let patch = supercov_engine::patch_view::build(&view, &changed);
        let passed = floor.is_none_or(|ppm| patch.is_empty() || patch.meets(ppm));
        if json {
            print!(
                "{}",
                agent_json::success(
                    "coverage.patch",
                    &serde_json::json!({
                        "result": if passed { "pass" } else { "fail" },
                        "base": base,
                        "patch": patch,
                    }),
                    None,
                )
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes))?
            );
        } else {
            print!("{}", render_patch(&patch, &base, floor, passed));
        }
        if annotate {
            for annotation in supercov_engine::patch_view::annotations(&patch, max_annotations) {
                println!("{annotation}");
            }
        }
        Ok(u8::from(!passed))
    })();
    match result {
        Ok(code) => ExitCode::from(code),
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn render_patch(
    patch: &supercov_engine::patch_view::PatchView,
    base: &str,
    floor: Option<u64>,
    passed: bool,
) -> String {
    let mut out = format!("Changed-line coverage against {base}\n");
    if patch.is_empty() {
        out.push_str("  No executable changes.\n");
    } else {
        out.push_str(&format!(
            "  {} of {} changed executable line(s) covered ({})\n",
            patch.covered,
            patch.eligible,
            render_percentage(patch.covered, patch.eligible),
        ));
        for file in patch.files.iter().filter(|f| !f.uncovered.is_empty()) {
            let ranges = supercov_engine::patch_view::ranges(&file.uncovered)
                .into_iter()
                .map(|(start, end)| {
                    if start == end {
                        start.to_string()
                    } else {
                        format!("{start}-{end}")
                    }
                })
                .collect::<Vec<_>>()
                .join(", ");
            out.push_str(&format!("  {}: {ranges}\n", file.file));
        }
    }
    if !patch.missing_from_run.is_empty() {
        out.push_str("  Changed but not measured by this run:\n");
        for file in &patch.missing_from_run {
            out.push_str(&format!("    {file}\n"));
        }
    }
    match (floor, passed) {
        (Some(ppm), false) => out.push_str(&format!("\nFAIL: below {}\n", render_floor(ppm))),
        (Some(ppm), true) if patch.is_empty() => out.push_str(&format!(
            "\nPASS: nothing executable changed, so {} does not apply.\n",
            render_floor(ppm)
        )),
        (Some(ppm), true) => out.push_str(&format!("\nPASS: at or above {}\n", render_floor(ppm))),
        (None, _) => {}
    }
    out
}

/// Resolve a run and build the shared view every workflow command reads.
pub(crate) fn load_run_view(
    selector: Option<&str>,
) -> Result<supercov_engine::run_view::RunView, String> {
    let root = std::env::current_dir().map_err(|error| error.to_string())?;
    let inventory = public_run_inventory(&root).map_err(|error| error.to_string())?;
    let run = select_run(&inventory, selector).map_err(|error| error.to_string())?;
    let comparison = current_integrity_for_run(&root, run)
        .map(|current| compare_run_integrity(Some(&run.metadata.integrity), &current));
    let report = analyze_stored_run(run)?;
    supercov_engine::run_view::build(
        &run.id,
        &run.metadata.started_at,
        &report.filters.passed,
        run.metadata.test_exit_code == Some(0),
        comparison.as_ref().is_some_and(|c| c.stale),
        comparison.map(|c| c.reasons).unwrap_or_default(),
    )
    .map_err(|error| format!("{error:?}"))
}

/// A flow of a saved run's assertion map with the lines it is credited with,
/// and the text the agent wrote about it. The text is what makes the credit
/// mean something: an assertion that checks the injection succeeded and one
/// that checks the input was rejected credit the same sink line.
#[derive(Debug, Clone, serde::Serialize)]
pub(crate) struct CreditedFlow {
    pub key: String,
    pub assertion: String,
    pub observes: Vec<String>,
    pub explanation: String,
    pub nodes: Vec<String>,
    pub lines: Vec<(String, u64)>,
}

/// Every credited flow of the run the coverage join uses, so a security
/// finding can be placed on one of three shelves: code no test executes, code
/// tests execute but no assertion is credited with, and code an assertion
/// checks, where the flow's own text says what was checked. Empty when the
/// run carries no assertion map; that is not an error.
pub(crate) fn load_credited_flows(selector: Option<&str>) -> Result<Vec<CreditedFlow>, String> {
    let root = std::env::current_dir().map_err(|error| error.to_string())?;
    let inventory = public_run_inventory(&root).map_err(|error| error.to_string())?;
    let run = select_run(&inventory, selector).map_err(|error| error.to_string())?;
    let report = supercov_engine::assertion_store::report(&root, run)?;
    let empty = Vec::new();
    let mut flows = Vec::new();
    for assertion in report["assertions"].as_array().unwrap_or(&empty) {
        let text = assertion["at"]["text"].as_str().unwrap_or("").to_owned();
        let observes: Vec<String> = assertion["observes"]
            .as_array()
            .unwrap_or(&empty)
            .iter()
            .filter_map(|o| o.as_str().map(str::to_owned))
            .collect();
        for flow in assertion["flows"].as_array().unwrap_or(&empty) {
            let mut lines = Vec::new();
            let mut nodes = Vec::new();
            for node in flow["nodeCredit"].as_array().unwrap_or(&empty) {
                if let Some(t) = node["text"].as_str() {
                    nodes.push(t.to_owned());
                }
                if node["status"] == "credited"
                    && let (Some(file), Some(line)) = (
                        node["location"]["file"].as_str(),
                        node["location"]["line"].as_u64(),
                    )
                {
                    lines.push((file.to_owned(), line));
                }
            }
            if lines.is_empty() {
                continue;
            }
            flows.push(CreditedFlow {
                key: format!(
                    "{}/{}",
                    assertion["id"].as_str().unwrap_or("?"),
                    flow["id"].as_str().unwrap_or("?")
                ),
                assertion: text.clone(),
                observes: observes.clone(),
                explanation: flow["explanation"].as_str().unwrap_or("").to_owned(),
                nodes,
                lines,
            });
        }
    }
    Ok(flows)
}

/// Which lines of which files a saved run's assertions are credited with.
pub(crate) fn load_asserted_lines(
    selector: Option<&str>,
) -> Result<std::collections::BTreeMap<String, std::collections::BTreeSet<u64>>, String> {
    let mut lines: std::collections::BTreeMap<String, std::collections::BTreeSet<u64>> =
        Default::default();
    for flow in load_credited_flows(selector)? {
        for (file, line) in flow.lines {
            lines.entry(file).or_default().insert(line);
        }
    }
    Ok(lines)
}

/// Which tests executed which lines, from a saved run: every covered
/// statement with the tests credited for it. This is the run's own account of
/// what ran together, which no import graph can give: a handler and a helper
/// reached only through a lookup table are still executed by one test.
pub(crate) fn load_point_tests(
    selector: Option<&str>,
) -> Result<Vec<(String, usize, Vec<String>)>, String> {
    let root = std::env::current_dir().map_err(|error| error.to_string())?;
    let inventory = public_run_inventory(&root).map_err(|error| error.to_string())?;
    let run = select_run(&inventory, selector).map_err(|error| error.to_string())?;
    let coverage = supercov_engine::assertion_store::coverage(run)?;
    Ok(coverage
        .view
        .points
        .iter()
        .filter(|point| point.covered && !point.tests.is_empty())
        .map(|point| {
            (
                point.meta.file.clone(),
                point.meta.line,
                point
                    .tests
                    .iter()
                    .map(|test| test.as_str().to_owned())
                    .collect(),
            )
        })
        .collect())
}

/// The format names live in the engine module the packaging audit reads, so
/// this file never spells them: Supercov emits those formats and must never
/// look like it invokes the tools they are named after.
fn report_usage() -> String {
    format!(
        "supercov runs <run-id> report --format {} [--output <path>] [--force]\n",
        supercov_engine::coverage_export::FORMATS
    )
}

/// Write the file atomically, so a reader never sees a half-written report and
/// a failed write leaves the previous one intact.
fn write_atomically(path: &Path, contents: &str, force: bool) -> Result<(), String> {
    if path.exists() && !force {
        return Err(format!(
            "{} already exists; pass --force to replace it",
            path.display()
        ));
    }
    if let Some(parent) = path
        .parent()
        .filter(|parent| !parent.as_os_str().is_empty())
    {
        fs::create_dir_all(parent)
            .map_err(|error| format!("could not create {}: {error}", parent.display()))?;
    }
    let temporary = path.with_extension(format!(
        "{}.supercov-{}",
        path.extension().and_then(|e| e.to_str()).unwrap_or("tmp"),
        std::process::id()
    ));
    fs::write(&temporary, contents)
        .map_err(|error| format!("could not write {}: {error}", temporary.display()))?;
    fs::rename(&temporary, path).map_err(|error| {
        let _ = fs::remove_file(&temporary);
        format!("could not replace {}: {error}", path.display())
    })
}

/// Export a recorded run in a format other tools already read.
fn coverage_report_command(arguments: &[String]) -> ExitCode {
    let mut format: Option<String> = None;
    let mut output: Option<PathBuf> = None;
    let mut force = false;
    let mut selector: Option<&str> = None;
    if let Some(first) = arguments.first()
        && first != "report"
    {
        selector = Some(first.as_str());
    }
    let rest = &arguments[1..];
    let mut index = 0;
    while index < rest.len() {
        let argument = rest[index].as_str();
        index += 1;
        match argument {
            "report" => continue,
            "--force" => force = true,
            "--help" | "-h" => {
                print!("{}", report_usage());
                return ExitCode::SUCCESS;
            }
            "--format" | "--output" => {
                let Some(value) = rest.get(index) else {
                    eprintln!("[supercov] {argument} needs a value\n{}", report_usage());
                    return ExitCode::from(2);
                };
                index += 1;
                if argument == "--format" {
                    format = Some(value.to_ascii_lowercase());
                } else {
                    output = Some(PathBuf::from(value));
                }
            }
            other => {
                eprintln!("[supercov] unknown option {other}\n{}", report_usage());
                return ExitCode::from(2);
            }
        }
    }
    let Some(format) = format else {
        eprintln!("[supercov] report needs --format\n{}", report_usage());
        return ExitCode::from(2);
    };

    let result = (|| -> Result<(), String> {
        let view = load_run_view(selector)?;
        // A report from a failed or stale run is still worth reading, so this
        // writes it and says so on stderr rather than refusing. Only a gate
        // must never go green over one.
        for blocker in view.blockers() {
            eprintln!("[supercov] warning: {}", blocker.reason);
        }
        let timestamp = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map(|since| since.as_secs())
            .unwrap_or(0);
        let contents = if format == "html" {
            // Annotating source that no longer matches the run would point at
            // the wrong lines, so the text is embedded only when the run still
            // describes this checkout. Otherwise the report shows line numbers
            // and says why.
            let (sources, reason) = if view.stale {
                (
                    std::collections::BTreeMap::new(),
                    format!(
                        "The run no longer matches the checkout: {}.",
                        view.stale_reasons.join(", ")
                    ),
                )
            } else {
                let root = std::env::current_dir().map_err(|error| error.to_string())?;
                let sources = view
                    .files
                    .iter()
                    .filter_map(|file| {
                        let text = fs::read_to_string(root.join(&file.file)).ok()?;
                        Some((file.file.clone(), text))
                    })
                    .collect::<std::collections::BTreeMap<_, _>>();
                (
                    sources,
                    "The file could not be read from this checkout.".to_owned(),
                )
            };
            supercov_engine::coverage_html::html(&view, &sources, &reason)
        } else {
            supercov_engine::coverage_export::export(&view, &format, timestamp)?
        };
        match output {
            Some(path) => {
                // `--output coverage/report` names a directory for the HTML
                // report; the document itself is always one self-contained
                // file, so nothing here ever removes a directory tree.
                let path = if format == "html"
                    && path.extension().is_none_or(|extension| extension != "html")
                {
                    path.join("index.html")
                } else {
                    path
                };
                write_atomically(&path, &contents, force)?;
                // Diagnostics go to stderr so a shell redirect of stdout still
                // captures only the report.
                eprintln!("[supercov] wrote {} ({})", path.display(), format);
            }
            None => print!("{contents}"),
        }
        Ok(())
    })();
    match result {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(2)
        }
    }
}

fn public_run_inventory(root: &Path) -> Result<RunInventory, RunStoreError> {
    let mut inventory = discover_runs(root)?;
    // Timestamp-named runs belonged to the pre-release local store contract.
    // They are intentionally not a public compatibility surface: the CLI has
    // one stable identity shape and `supercov runs clean` removes old stores.
    inventory.runs.retain(|run| public_run_id(&run.id));
    Ok(inventory)
}

fn javascript_number(value: f64) -> String {
    let rounded = (value * 10.0).round() / 10.0;
    if rounded.fract() == 0.0 {
        format!("{rounded:.0}")
    } else {
        format!("{rounded:.1}")
    }
}

/// `run_ms` is the engine's own clock, which stops before the run is published;
/// `command_ms`, when the run was published, is the whole command. What lies
/// between is publication -- analysing the evidence once for the assertion map,
/// the summary and the query index -- and it is reported, so that the total is
/// what the command cost rather than what it cost before publishing.
fn format_run_timings(
    timings: &supercov_engine::run_store::RunTimings,
    run_ms: f64,
    command_ms: Option<f64>,
) -> String {
    let phases = format!(
        "initialization={}ms workspace={}ms setup={}ms build={}ms tests={}ms evidence={}ms",
        javascript_number(timings.initialization_ms),
        javascript_number(timings.workspace_preparation_ms),
        javascript_number(timings.adapter_setup_ms),
        javascript_number(timings.instrumented_build_ms),
        javascript_number(timings.test_command_ms),
        javascript_number(timings.evidence_publication_ms),
    );
    match command_ms {
        Some(command_ms) => format!(
            "{phases} publication={}ms total={}ms",
            javascript_number((command_ms - run_ms).max(0.0)),
            javascript_number(command_ms.max(run_ms)),
        ),
        None => format!("{phases} total={}ms", javascript_number(run_ms)),
    }
}

/// What the caller asked for beyond the command itself.
#[derive(Debug, Clone, Copy, Default)]
struct RunOptions {
    /// Credit every test with what it reached, at whatever the language's
    /// frontend has to do differently to manage it.
    ///
    /// Off by default, because what it costs is not measurement time but the
    /// suite's own: a JUnit project with parallel execution runs in order, and
    /// so does a Go package whose tests call `t.Parallel()`. Where a frontend
    /// attributes exactly at no cost -- one process per test, per-test
    /// coverage maps -- it already does, and this changes nothing.
    exact_attribution: bool,
}

fn process_exit_code(code: i32) -> ExitCode {
    ExitCode::from(u8::try_from(code).unwrap_or(1))
}

fn public_coverage_run(command: Vec<String>, options: RunOptions) -> ExitCode {
    let command_started = Instant::now();
    let command_ms = || command_started.elapsed().as_secs_f64() * 1000.0;
    if command.is_empty() {
        eprintln!("Usage: supercov -- <test command>");
        return ExitCode::from(2);
    }
    let root = match std::env::current_dir() {
        Ok(root) => root,
        Err(error) => {
            eprintln!("[supercov] could not resolve the current directory: {error}");
            return ExitCode::from(2);
        }
    };
    let (run_id, started_at) = match public_run_identity() {
        Ok(timestamp) => timestamp,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    spawn_trash_sweeper(&root);
    let detection = supercov_engine::frontend_detection::detect_frontends(&root, &command);
    let unsupported =
        supercov_engine::frontend_detection::detect_unsupported_ecosystem(&root, &command);
    // The test command is authoritative: `supercov -- go test` deserves the
    // Go answer even when a package.json would otherwise route the run to the
    // JavaScript frontend, which could only produce an empty, misleading run.
    // A genuinely mixed command that also launches a supported runner still
    // proceeds.
    if let Some(ecosystem) = unsupported.as_ref().filter(|ecosystem| {
        ecosystem.from_command
            && !supercov_engine::frontend_detection::command_launches_supported_frontend(
                &root, &command,
            )
    }) {
        eprintln!(
            "[supercov] This looks like a {} test run ({}), and Supercov does not support {} yet.",
            ecosystem.language, ecosystem.evidence, ecosystem.language
        );
        eprintln!(
            "[supercov] Supercov currently measures JavaScript, TypeScript, Rust, Python, Ruby, Go, Java, and Kotlin test runs. If you'd like {} support, please open an issue or PR: https://github.com/supercorp-ai/supercov",
            ecosystem.language
        );
        return ExitCode::from(2);
    }
    if detection.frontends.is_empty() {
        match unsupported {
            Some(ecosystem) => {
                eprintln!(
                    "[supercov] This looks like a {} project ({}), and Supercov does not support {} yet.",
                    ecosystem.language, ecosystem.evidence, ecosystem.language
                );
                eprintln!(
                    "[supercov] Supercov currently measures JavaScript, TypeScript, Rust, Python, Ruby, Go, Java, and Kotlin test runs. If you'd like {} support, please open an issue or PR: https://github.com/supercorp-ai/supercov",
                    ecosystem.language
                );
            }
            None => {
                eprintln!(
                    "[supercov] Supercov could not recognize this project's language or test framework: no supported test files or manifests were found, and the command does not launch a runner Supercov knows."
                );
                eprintln!(
                    "[supercov] Supercov currently measures JavaScript, TypeScript, Rust, Python, Ruby, Go, Java, and Kotlin test runs. Alternatively, Supercov may simply not support your test suite yet — if so, please open an issue or PR: https://github.com/supercorp-ai/supercov"
                );
            }
        }
        return ExitCode::from(2);
    }
    if detection.frontends.len() > 1 {
        let languages = detection
            .frontends
            .iter()
            .map(|language| format!("{language:?}").to_ascii_lowercase())
            .collect::<Vec<_>>()
            .join(", ");
        eprintln!(
            "[supercov] the test command launches multiple language frontends ({languages}); combined polyglot evidence is not implemented yet, so Supercov refuses to publish a partial run"
        );
        return ExitCode::from(2);
    }
    if detection.frontends == [supercov_engine::frontend_detection::FrontendLanguage::Rust] {
        let request = supercov_engine::rust_run::DirectRustRunRequest {
            root: root.clone(),
            command,
            run_id,
            started_at,
        };
        let mut diagnostics = std::io::stderr().lock();
        let result = supercov_engine::rust_run::run_direct_rust(&request, &mut diagnostics);
        spawn_trash_sweeper(&root);
        return match result {
            Ok(result) => {
                println!(
                    "[coverage] evidence: {}",
                    result.run_directory.join("evidence.raw.gz").display()
                );
                eprintln!(
                    "[supercov] Rust coverage: {} test(s) across {} artifact(s)",
                    result.tests, result.artifacts
                );
                if let Some(timings) = &result.metadata.timings {
                    eprintln!(
                        "[supercov] timings {}",
                        format_run_timings(
                            timings,
                            result.metadata.duration_ms,
                            Some(command_ms())
                        )
                    );
                }
                process_exit_code(result.exit_code)
            }
            Err(error) => {
                eprintln!("[supercov] {error}");
                ExitCode::from(1)
            }
        };
    }
    if detection.frontends == [supercov_engine::frontend_detection::FrontendLanguage::Go] {
        let request = supercov_engine::go_run::DirectGoRunRequest {
            root: root.clone(),
            command,
            run_id,
            started_at,
            exact_attribution: options.exact_attribution,
        };
        let mut diagnostics = std::io::stderr().lock();
        let result = supercov_engine::go_run::run_direct_go(&request, &mut diagnostics);
        spawn_trash_sweeper(&root);
        return match result {
            Ok(result) => {
                println!(
                    "[coverage] evidence: {}",
                    result.run_directory.join("evidence.raw.gz").display()
                );
                eprintln!(
                    "[supercov] Go coverage: {} test(s) across {} source file(s) in {} package(s)",
                    result.tests, result.source_files, result.packages
                );
                // A run of nothing but parallel tests measures a whole package
                // and can name none of it. Printing "0 test(s)" and stopping
                // reads as an empty suite, which is a different thing and the
                // wrong thing to act on.
                if result.unattributed > 0 {
                    eprintln!(
                        "[supercov] {} test(s) could not announce themselves (t.Parallel, Example or Fuzz); what they reached counts run-wide and belongs to no test",
                        result.unattributed
                    );
                }
                // A hole in the denominator travels with the number it was
                // taken out of: the warning above scrolls past, this is on the
                // line that reports the result.
                if result.unparseable_sources > 0 {
                    eprintln!(
                        "[supercov] {} source file(s) did not parse and are absent from the denominator; the run records them as a blocking limitation",
                        result.unparseable_sources
                    );
                }
                // The tests in it still ran, and what they reached still
                // counts; what is missing is the name to put it under.
                if result.unparseable_tests > 0 {
                    eprintln!(
                        "[supercov] {} test file(s) did not parse; the tests they declare ran unattributed",
                        result.unparseable_tests
                    );
                }
                if let Some(timings) = &result.metadata.timings {
                    eprintln!(
                        "[supercov] timings {}",
                        format_run_timings(
                            timings,
                            result.metadata.duration_ms,
                            Some(command_ms())
                        )
                    );
                }
                process_exit_code(result.exit_code)
            }
            Err(error) => {
                eprintln!("[supercov] {error}");
                ExitCode::from(1)
            }
        };
    }
    if detection.frontends == [supercov_engine::frontend_detection::FrontendLanguage::Jvm] {
        let request = supercov_engine::jvm_run::DirectJvmRunRequest {
            root: root.clone(),
            command,
            run_id,
            started_at,
            exact_attribution: options.exact_attribution,
        };
        let mut diagnostics = std::io::stderr().lock();
        let result = supercov_engine::jvm_run::run_direct_jvm(&request, &mut diagnostics);
        spawn_trash_sweeper(&root);
        return match result {
            Ok(result) => {
                println!(
                    "[coverage] evidence: {}",
                    result.run_directory.join("evidence.raw.gz").display()
                );
                eprintln!(
                    "[supercov] JVM coverage: {} test(s) across {} source file(s) in {} module(s)",
                    result.tests, result.source_files, result.modules
                );
                if let Some(timings) = &result.metadata.timings {
                    eprintln!(
                        "[supercov] timings {}",
                        format_run_timings(
                            timings,
                            result.metadata.duration_ms,
                            Some(command_ms())
                        )
                    );
                }
                process_exit_code(result.exit_code)
            }
            Err(error) => {
                eprintln!("[supercov] {error}");
                ExitCode::from(1)
            }
        };
    }
    if detection.frontends == [supercov_engine::frontend_detection::FrontendLanguage::Python] {
        let request = supercov_engine::python_run::DirectPythonRunRequest {
            root: root.clone(),
            command,
            run_id,
            started_at,
        };
        let mut diagnostics = std::io::stderr().lock();
        let result = supercov_engine::python_run::run_direct_python(&request, &mut diagnostics);
        spawn_trash_sweeper(&root);
        return match result {
            Ok(result) => {
                println!(
                    "[coverage] evidence: {}",
                    result.run_directory.join("evidence.raw.gz").display()
                );
                eprintln!(
                    "[supercov] Python coverage: {} test(s) across {} source file(s), {} interpreter process(es) on Python {}",
                    result.tests,
                    result.source_files,
                    result.interpreters,
                    result.python_versions.join(", ")
                );
                if let Some(timings) = &result.metadata.timings {
                    eprintln!(
                        "[supercov] timings {}",
                        format_run_timings(
                            timings,
                            result.metadata.duration_ms,
                            Some(command_ms())
                        )
                    );
                }
                process_exit_code(result.exit_code)
            }
            Err(error) => {
                eprintln!("[supercov] {error}");
                ExitCode::from(1)
            }
        };
    }
    if detection.frontends == [supercov_engine::frontend_detection::FrontendLanguage::Ruby] {
        let request = supercov_engine::ruby_run::DirectRubyRunRequest {
            root: root.clone(),
            command,
            run_id,
            started_at,
        };
        let mut diagnostics = std::io::stderr().lock();
        let result = supercov_engine::ruby_run::run_direct_ruby(&request, &mut diagnostics);
        spawn_trash_sweeper(&root);
        return match result {
            Ok(result) => {
                println!(
                    "[coverage] evidence: {}",
                    result.run_directory.join("evidence.raw.gz").display()
                );
                eprintln!(
                    "[supercov] Ruby coverage: {} test(s) across {} source file(s), {} interpreter process(es) on Ruby {}",
                    result.tests,
                    result.source_files,
                    result.interpreters,
                    result.ruby_versions.join(", ")
                );
                if let Some(timings) = &result.metadata.timings {
                    eprintln!(
                        "[supercov] timings {}",
                        format_run_timings(
                            timings,
                            result.metadata.duration_ms,
                            Some(command_ms())
                        )
                    );
                }
                process_exit_code(result.exit_code)
            }
            Err(error) => {
                eprintln!("[supercov] {error}");
                ExitCode::from(1)
            }
        };
    }
    let watchdog_program = std::env::current_exe()
        .ok()
        .and_then(|path| fs::canonicalize(path).ok());
    let request = supercov_engine::javascript_run::DirectJavascriptRunRequest {
        root: root.clone(),
        command,
        run_id: Some(run_id),
        started_at: Some(started_at),
        watchdog_program,
    };
    let mut diagnostics = std::io::stderr().lock();
    let result = supercov_engine::javascript_run::run_direct_javascript(&request, &mut diagnostics);
    spawn_trash_sweeper(&root);
    match result {
        Ok(result) => {
            println!(
                "[coverage] evidence: {}",
                result.run_directory.join("evidence.raw.gz").display()
            );
            if let Some(timings) = &result.metadata.timings {
                eprintln!(
                    "[supercov] timings {}",
                    format_run_timings(timings, result.metadata.duration_ms, Some(command_ms()))
                );
            }
            process_exit_code(result.exit_code)
        }
        Err(supercov_engine::javascript_run::DirectJavascriptRunError::Interrupted {
            exit_code,
            timings,
            total_ms,
            ..
        }) => {
            eprintln!(
                "[supercov] timings {}",
                format_run_timings(&timings, total_ms, None)
            );
            process_exit_code(exit_code)
        }
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::from(1)
        }
    }
}

fn parse_cleanup_options(arguments: &[String]) -> Result<(usize, bool), String> {
    let mut keep = 0;
    let mut dry_run = false;
    let mut index = 0;
    while index < arguments.len() {
        let argument = &arguments[index];
        if argument == "--dry-run" {
            dry_run = true;
        } else if argument == "--keep" {
            index += 1;
            let Some(value) = arguments.get(index) else {
                return Err("--keep must be a non-negative integer".into());
            };
            keep = value
                .parse::<usize>()
                .map_err(|_| "--keep must be a non-negative integer".to_owned())?;
        } else {
            return Err(format!("Unknown clean option: {argument}"));
        }
        index += 1;
    }
    Ok((keep, dry_run))
}

fn cleanup_summary(
    keep: usize,
    dry_run: bool,
    result: &supercov_engine::lifecycle::CleanupResult,
) -> String {
    format!(
        "[supercov] {} {} stored run(s), {} per-run workspace(s), {}and {} isolated build cache; keeping {} newest run(s)",
        if dry_run { "would remove" } else { "removed" },
        result.removed_runs.len(),
        result.removed_workspaces.len(),
        // Named separately because it is not a run: it is what a run Supercov
        // failed to publish measured, and removing it is irreversible.
        if result.removed_failed_evidence.is_empty() {
            String::new()
        } else {
            format!(
                "the kept evidence of {} failed run(s), ",
                result.removed_failed_evidence.len()
            )
        },
        if result.removed_build_cache {
            "the"
        } else {
            "no"
        },
        keep,
    )
}

fn cleanup_command(arguments: Vec<String>) -> ExitCode {
    if arguments
        .iter()
        .any(|argument| matches!(argument.as_str(), "--help" | "-h"))
    {
        print!(
            "Usage: supercov runs clean [--keep N] [--dry-run]\n\nRemoves all stored runs and Supercov's isolated build cache by default.\nUse --keep N to retain the N newest runs.\n\nSaved quality assessments are never removed here; they cost money to\nproduce and are not reproducible. Use supercov quality clean for those.\nGenerated reports in .supercov/reports are left alone too.\n"
        );
        return ExitCode::SUCCESS;
    }
    let (keep, dry_run) = match parse_cleanup_options(&arguments) {
        Ok(options) => options,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let root = match std::env::current_dir() {
        Ok(root) => root,
        Err(error) => {
            eprintln!("[supercov] could not resolve the current directory: {error}");
            return ExitCode::from(2);
        }
    };
    spawn_trash_sweeper(&root);
    let options = supercov_engine::lifecycle::CleanupOptions { keep, dry_run };
    let updated_at = format!(
        "unix-{}",
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs()
    );
    let result = supercov_engine::lifecycle::clean_storage(&root, options, &updated_at);
    let result = match result {
        Ok(result) => result,
        Err(error) => {
            eprintln!("[supercov] clean failed: {error}");
            return ExitCode::from(2);
        }
    };
    spawn_trash_sweeper(&root);
    println!("{}", cleanup_summary(keep, dry_run, &result));
    for id in result.removed_runs {
        println!("{id}");
    }
    ExitCode::SUCCESS
}

fn internal_agent_error(message: impl Into<String>) -> agent_json::AgentError {
    agent_json::AgentError {
        code: agent_json::ErrorCode::InternalError,
        message: message.into(),
        retryable: false,
        details: None,
    }
}

fn run_store_agent_error(error: RunStoreError) -> agent_json::AgentError {
    match error {
        RunStoreError::NoRuns => agent_json::AgentError {
            code: agent_json::ErrorCode::NoRuns,
            message: "No local coverage runs. Run supercov first.".into(),
            retryable: false,
            details: None,
        },
        RunStoreError::RunNotFound(selector) => agent_json::AgentError {
            code: agent_json::ErrorCode::RunNotFound,
            message: format!("Coverage run not found: {selector}"),
            retryable: false,
            details: Some(serde_json::json!({ "selector": selector })),
        },
        error => internal_agent_error(format!("Failed to read local coverage runs: {error}")),
    }
}

fn current_javascript_integrity(
    root: &Path,
    command: &[String],
    source_roots: Option<&[String]>,
) -> Option<supercov_engine::run_store::RunIntegrity> {
    supercov_engine::javascript_run::current_javascript_integrity(root, command, source_roots).ok()
}

/// Which frontend measured a run, from the contract version it recorded.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Frontend {
    Rust,
    Ruby,
    Python,
    Go,
    Jvm,
    JavaScript,
}

/// Only the frontend that measured a run can say what its checkout looks like
/// now. JavaScript is the last resort rather than the default for anything
/// unrecognised -- a mapping that silently answered for Go and the JVM, which
/// were added later and never listed. samber/lo is Go with a JavaScript docs
/// site: every one of its runs compared a Go fingerprint against a JavaScript
/// one and reported five simultaneous changes to a checkout nobody had
/// touched. A Go or JVM project with no package.json fared no better -- the
/// JavaScript answer was None and staleness silently stopped being checked at
/// all.
fn frontend_of(instrumenter_version: &str) -> Frontend {
    for (prefix, frontend) in [
        ("supercov-rust-", Frontend::Rust),
        ("supercov-ruby-", Frontend::Ruby),
        ("supercov-python-", Frontend::Python),
        ("supercov-go-", Frontend::Go),
        ("supercov-jvm-", Frontend::Jvm),
    ] {
        if instrumenter_version.starts_with(prefix) {
            return frontend;
        }
    }
    Frontend::JavaScript
}

fn current_integrity_for_run(
    root: &Path,
    run: &StoredRun,
) -> Option<supercov_engine::run_store::RunIntegrity> {
    let command = &run.metadata.command;
    let roots = run.metadata.source_roots.as_deref();
    match frontend_of(&run.metadata.integrity.instrumenter_version) {
        Frontend::Rust => {
            supercov_engine::rust_run::current_rust_integrity(root, command, roots).ok()
        }
        Frontend::Ruby => {
            supercov_engine::ruby_run::current_ruby_integrity(root, command, roots).ok()
        }
        Frontend::Python => {
            supercov_engine::python_run::current_python_integrity(root, command, roots).ok()
        }
        Frontend::Go => supercov_engine::go_run::current_go_integrity(root, command, roots).ok(),
        Frontend::Jvm => supercov_engine::jvm_run::current_jvm_integrity(root, command, roots).ok(),
        Frontend::JavaScript => current_javascript_integrity(root, command, roots),
    }
}

fn selected_package_script(command: &[String]) -> Option<&str> {
    let program = command
        .first()
        .and_then(|value| Path::new(value).file_stem())
        .and_then(OsStr::to_str)?;
    if !matches!(program, "npm" | "pnpm" | "yarn") {
        return None;
    }
    match command.get(1).map(String::as_str) {
        Some("test") => Some("test"),
        Some("run") => command.get(2).map(String::as_str),
        Some(value) if program != "npm" && !value.starts_with('-') => Some(value),
        _ => None,
    }
}

fn full_suite_hints(root: &Path, command: &[String], observed_kinds: &[String]) -> Vec<String> {
    if observed_kinds.len() != 1 {
        return Vec::new();
    }
    let Ok(raw) = fs::read_to_string(root.join("package.json")) else {
        return Vec::new();
    };
    let Ok(package) = serde_json::from_str::<serde_json::Value>(&raw) else {
        return Vec::new();
    };
    let Some(scripts) = package
        .get("scripts")
        .and_then(serde_json::Value::as_object)
    else {
        return Vec::new();
    };
    if !scripts.contains_key("test") {
        return Vec::new();
    }
    let selected = selected_package_script(command);
    if selected == Some("test") {
        return Vec::new();
    }
    let alternatives = scripts
        .keys()
        .filter(|name| name.starts_with("test:") && Some(name.as_str()) != selected)
        .take(4)
        .cloned()
        .collect::<Vec<_>>();
    if selected.is_none() && alternatives.is_empty() {
        return Vec::new();
    }
    let suites = if alternatives.is_empty() {
        String::new()
    } else {
        format!(" Other test scripts include {}.", alternatives.join(", "))
    };
    vec![format!(
        "This run observed only the `{}` test kind and wrapped `{}`.{suites} For whole-project coverage, measure the package's full test command: `npx supercov -- npm test`.",
        observed_kinds[0],
        command.join(" ")
    )]
}

enum PublicQueryOutput {
    Runs {
        data: RunListData,
        pagination: supercov_contracts::AgentPagination,
    },
    Coverage {
        output: IndexedQueryOutput,
        warnings: Vec<String>,
    },
}

impl PublicQueryOutput {
    fn agent_json(&self) -> Result<String, agent_json::AgentError> {
        match self {
            Self::Runs { data, pagination } => agent_json::success("runs", data, Some(pagination))
                .map_err(|error| {
                    supercov_engine::indexed_query::IndexedQueryError::ResponseTooLarge(error)
                        .agent_error()
                }),
            Self::Coverage { output, .. } => {
                output.agent_json().map_err(|error| error.agent_error())
            }
        }
    }
}

struct PublicQueryExecutionError {
    error: Box<agent_json::AgentError>,
    warnings: Vec<String>,
}

impl From<agent_json::AgentError> for PublicQueryExecutionError {
    fn from(error: agent_json::AgentError) -> Self {
        Self {
            error: Box::new(error),
            warnings: Vec::new(),
        }
    }
}

fn execute_public_query(
    root: &Path,
    invocation: &PublicQueryInvocation,
) -> Result<PublicQueryOutput, PublicQueryExecutionError> {
    match invocation {
        PublicQueryInvocation::Runs {
            filter,
            offset,
            limit,
            ..
        } => {
            let inventory = public_run_inventory(root).map_err(run_store_agent_error)?;
            let view = match filter.as_str() {
                "all" => supercov_engine::coverage_index::CoverageViewId::All,
                "passed" => supercov_engine::coverage_index::CoverageViewId::Passed,
                "failed" => supercov_engine::coverage_index::CoverageViewId::Failed,
                _ => unreachable!("public parser validates coverage filters"),
            };
            let (data, page) = run_list_query(
                &inventory,
                &|run| current_integrity_for_run(root, run),
                view,
                *offset,
                *limit,
            )
            .map_err(|error| {
                internal_agent_error(format!("Failed to prepare run summaries: {error}"))
            })?;
            Ok(PublicQueryOutput::Runs {
                data,
                pagination: page,
            })
        }
        PublicQueryInvocation::Coverage {
            request,
            newer_run_id,
            ..
        } => {
            let mut request = (**request).clone();
            let inventory = public_run_inventory(root).map_err(run_store_agent_error)?;
            let run =
                select_run(&inventory, Some(&request.run_id)).map_err(run_store_agent_error)?;
            request.run_id.clone_from(&run.id);
            request
                .valid
                .get_or_insert(run.metadata.test_exit_code == Some(0));
            request.test_exit_code = run.metadata.test_exit_code;
            let current = current_integrity_for_run(root, run);
            let mut warnings = Vec::new();
            if let Some(current) = current.as_ref() {
                let comparison = compare_run_integrity(Some(&run.metadata.integrity), current);
                request.stale.get_or_insert(comparison.stale);
                request
                    .stale_reasons
                    .get_or_insert_with(|| comparison.reasons.clone());
                if comparison.stale {
                    warnings.push(format!(
                        "[supercov] stale run {}: {}",
                        run.id,
                        comparison.reasons.join(", ")
                    ));
                }
            }
            let result = (|| -> Result<IndexedQueryOutput, agent_json::AgentError> {
                let progress = ProgressLine::start("loading run evidence");
                let container = open_or_rebuild_query_index(run).map_err(|error| {
                    let message = if matches!(
                        error,
                        RunIndexError::Report(ReportError::NoEvidence(_))
                    ) {
                        match run.metadata.test_exit_code {
                            Some(code) => format!(
                                "The wrapped command exited {code} before publishing queryable coverage evidence. Inspect that command's original output and rerun after it passes."
                            ),
                            None => "The wrapped command ended without an exit status or queryable coverage evidence. Inspect that command's original output and rerun.".into(),
                        }
                    } else {
                        format!("Failed to open coverage index: {error}")
                    };
                    internal_agent_error(message)
                })?;
                let index = CoverageIndex::new(&container).map_err(|error| {
                    internal_agent_error(format!("Failed to read coverage index: {error}"))
                })?;
                drop(progress);
                let report = if request.command == "minimize" {
                    Some(
                        analyze_stored_run(run)
                            .map_err(|error| internal_agent_error(error.to_string()))?,
                    )
                } else {
                    None
                };

                let newer_container;
                let newer_index;
                let newer_query = if request.command == "diff" {
                    let selector = newer_run_id.as_deref().ok_or_else(|| {
                        supercov_engine::indexed_query::IndexedQueryError::MissingNewerRun
                            .agent_error()
                    })?;
                    let newer_run =
                        select_run(&inventory, Some(selector)).map_err(run_store_agent_error)?;
                    if let Some(current) = current_integrity_for_run(root, newer_run).as_ref() {
                        let comparison =
                            compare_run_integrity(Some(&newer_run.metadata.integrity), current);
                        if comparison.stale {
                            warnings.push(format!(
                                "[supercov] stale run {}: {}",
                                newer_run.id,
                                comparison.reasons.join(", ")
                            ));
                        }
                    }
                    let comparison_progress = ProgressLine::start("loading comparison run");
                    newer_container = open_or_rebuild_query_index(newer_run).map_err(|error| {
                        internal_agent_error(format!(
                            "Failed to open newer coverage index: {error}"
                        ))
                    })?;
                    newer_index = CoverageIndex::new(&newer_container).map_err(|error| {
                        internal_agent_error(format!(
                            "Failed to read newer coverage index: {error}"
                        ))
                    })?;
                    drop(comparison_progress);
                    Some(NewerQuery {
                        run_id: &newer_run.id,
                        index: &newer_index,
                    })
                } else {
                    None
                };
                query_indexed(&index, report.as_ref(), &request, newer_query)
                    .map_err(|error| error.agent_error())
            })();
            result
                .map(|mut output| {
                    if let supercov_engine::indexed_query::IndexedQueryData::Line(data) =
                        &mut output.data
                    {
                        hydrate_line_source_from_working_tree(
                            root,
                            request.stale.unwrap_or(false),
                            data,
                        );
                    }
                    if let supercov_engine::indexed_query::IndexedQueryData::Summary(data) =
                        &mut output.data
                    {
                        data.command.clone_from(&run.metadata.command);
                        if run.directory.join(supercov_engine::assertion_store::MAP_FILE).exists() {
                            data.assertion_coverage = Some(match if current.as_ref().is_some_and(|c| !compare_run_integrity(Some(&run.metadata.integrity), c).stale) {
                                supercov_engine::assertion_store::report_summary(root, run)
                            } else { Err("Current checkout differs from the run or cannot be verified; rerun tests to inherit the assertion map".into()) } {
                                Ok(report) => serde_json::json!({"available":true,"summary":report["summary"],"basis":report["basis"],"revision":report["revision"],"inheritance":report["inheritance"],"map":run.directory.join(supercov_engine::assertion_store::MAP_FILE),"validationErrors":report["validationErrors"],"scope":"whole run with matching current source; independent of structural query filters"}),
                                Err(error) => serde_json::json!({"available":false,"error":error}),
                            });
                        }

                        let observed_kinds = data
                            .coverage_by_kind
                            .iter()
                            .filter_map(|entry| entry.kind.clone())
                            .collect::<Vec<_>>();
                        data.hints = full_suite_hints(root, &run.metadata.command, &observed_kinds);
                        data.workspace = supercov_engine::workspace::cached_workspace_path(root)
                            .ok()
                            .filter(|path| path.is_dir())
                            .map(|path| path.display().to_string());
                    }
                    PublicQueryOutput::Coverage {
                        output,
                        warnings: warnings.clone(),
                    }
                })
                .map_err(|error| PublicQueryExecutionError {
                    error: Box::new(error),
                    warnings,
                })
        }
    }
}

fn public_query_command(command: &str, arguments: Vec<String>) -> ExitCode {
    if command == "runs"
        && arguments
            .get(1)
            .is_some_and(|a| matches!(a.as_str(), "assertions" | "assertion" | "source"))
    {
        return assertions_query::command(&arguments);
    }
    if command == "runs" && arguments.get(1).is_some_and(|a| a == "tests") {
        return tests_query::command(&arguments);
    }
    // Both `runs check` (the latest run) and `runs <id> check` reach here.
    if command == "runs"
        && (arguments.first().is_some_and(|a| a == "check")
            || arguments.get(1).is_some_and(|a| a == "check"))
    {
        return coverage_check_command(&arguments);
    }
    if command == "runs"
        && (arguments.first().is_some_and(|a| a == "patch")
            || arguments.get(1).is_some_and(|a| a == "patch"))
    {
        return coverage_patch_command(&arguments);
    }
    if command == "runs"
        && (arguments.first().is_some_and(|a| a == "report")
            || arguments.get(1).is_some_and(|a| a == "report"))
    {
        return coverage_report_command(&arguments);
    }
    if let Some(help) = help_for(command, &arguments) {
        print!("{help}");
        return ExitCode::SUCCESS;
    }
    let invocation = match parse_public_query(command, &arguments) {
        Ok(invocation) => invocation,
        Err(error) => {
            if error.json {
                print!(
                    "{}",
                    agent_json::failure(error.command.as_deref(), &error.error)
                );
            } else {
                eprintln!("[supercov] {}", error.error.message);
            }
            return ExitCode::from(2);
        }
    };
    let (json_output, agent_command) = match &invocation {
        PublicQueryInvocation::Runs { json, .. } => (*json, "runs".to_owned()),
        PublicQueryInvocation::Coverage {
            json,
            agent_command,
            ..
        } => (*json, agent_command.clone()),
    };
    let root = match std::env::current_dir() {
        Ok(root) => root,
        Err(error) => {
            let error =
                internal_agent_error(format!("Could not resolve the current directory: {error}"));
            print!("{}", agent_json::failure(Some(&agent_command), &error));
            return ExitCode::from(2);
        }
    };
    match execute_public_query(&root, &invocation) {
        Ok(output) if json_output => match output.agent_json() {
            Ok(output) => {
                print!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                print!("{}", agent_json::failure(Some(&agent_command), &error));
                ExitCode::from(2)
            }
        },
        Ok(output) => {
            if let PublicQueryOutput::Coverage { warnings, .. } = &output {
                for warning in warnings {
                    eprintln!("{warning}");
                }
            }
            println!("{}", render_human(&invocation, &output));
            ExitCode::SUCCESS
        }
        Err(failure) => {
            if !json_output {
                for warning in &failure.warnings {
                    eprintln!("{warning}");
                }
            }
            if json_output {
                print!(
                    "{}",
                    agent_json::failure(Some(&agent_command), &failure.error)
                );
            } else {
                eprintln!("[supercov] {}", failure.error.message);
            }
            ExitCode::from(2)
        }
    }
}

fn run_js_direct() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let mut request: supercov_engine::javascript_run::DirectJavascriptRunRequest =
        match serde_json::from_str(&input) {
            Ok(request) => request,
            Err(error) => {
                eprintln!("[supercov] invalid direct JavaScript run input: {error}");
                return ExitCode::from(2);
            }
        };
    request.watchdog_program = std::env::current_exe()
        .ok()
        .and_then(|path| fs::canonicalize(path).ok());
    let mut diagnostics = std::io::stderr().lock();
    match supercov_engine::javascript_run::run_direct_javascript(&request, &mut diagnostics) {
        Ok(result) => match serde_json::to_string(&result) {
            Ok(output) => {
                println!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                eprintln!("[supercov] failed to serialize direct JavaScript run: {error}");
                ExitCode::from(2)
            }
        },
        Err(error) => {
            eprintln!("[supercov] direct JavaScript run failed: {error}");
            ExitCode::from(2)
        }
    }
}

fn supervise() -> ExitCode {
    let mut arguments = std::env::args_os().skip(2).collect::<Vec<_>>();
    if arguments.first().is_some_and(|argument| argument == "--") {
        arguments.remove(0);
    }
    let Some(program) = arguments.first().cloned() else {
        eprintln!("[supercov] test command must not be empty");
        return ExitCode::from(2);
    };
    let diagnostic_interval = match supercov_engine::process_supervision::positive_milliseconds(
        std::env::var("SUPERCOV_DIAGNOSTIC_INTERVAL_MS")
            .ok()
            .as_deref(),
        "SUPERCOV_DIAGNOSTIC_INTERVAL_MS",
    ) {
        Ok(value) => value.unwrap_or_else(|| {
            std::time::Duration::from_millis(supercov_contracts::DEFAULT_DIAGNOSTIC_INTERVAL_MS)
        }),
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let timeout = match supercov_engine::process_supervision::positive_milliseconds(
        std::env::var("SUPERCOV_COMMAND_TIMEOUT_MS").ok().as_deref(),
        "SUPERCOV_COMMAND_TIMEOUT_MS",
    ) {
        Ok(value) => value,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let cwd = match std::env::current_dir() {
        Ok(cwd) => cwd,
        Err(error) => {
            eprintln!("[supercov] could not resolve the current directory: {error}");
            return ExitCode::from(2);
        }
    };
    let spec = supercov_engine::process_supervision::CommandSpec {
        program,
        arguments: arguments.into_iter().skip(1).collect(),
        cwd,
        environment: None,
        captured_output: None,
    };
    let mut stderr = std::io::stderr().lock();
    let supervisor = match std::env::current_exe()
        .map_err(|error| error.to_string())
        .and_then(|path| {
            supercov_engine::process_supervision::ProcessSupervisor::new_crash_safe(&path)
                .map_err(|error| error.to_string())
        }) {
        Ok(supervisor) => supervisor,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::FAILURE;
        }
    };
    match supervisor.supervise(
        &spec,
        supercov_engine::process_supervision::SupervisionOptions {
            diagnostic_interval,
            timeout,
            termination_grace: std::time::Duration::from_millis(
                supercov_contracts::COMMAND_TERMINATION_GRACE_MS,
            ),
        },
        &mut stderr,
    ) {
        Ok(result) => match u8::try_from(result.exit_code()) {
            Ok(code) => ExitCode::from(code),
            Err(_) => ExitCode::FAILURE,
        },
        Err(error) => {
            eprintln!("[supercov] {error}");
            ExitCode::FAILURE
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct WorkspaceRequest {
    root: PathBuf,
    action: String,
    run_id: Option<String>,
    reuse_paths: Option<Vec<PathBuf>>,
}

/// Internal differential surface for workspace publication and recovery.
/// The public run path is enabled only after workspace and supervision gates
/// are complete.
fn workspace() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: WorkspaceRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid workspace input: {error}");
            return ExitCode::from(2);
        }
    };
    let result = (|| -> Result<serde_json::Value, String> {
        let run_id = request
            .run_id
            .as_deref()
            .unwrap_or("workspace-differential");
        let mut lock =
            supercov_engine::lifecycle::ProjectLock::acquire(&request.root, run_id, "internal")
                .map_err(|error| error.to_string())?;
        let value = match request.action.as_str() {
            "prepare-isolated" => serde_json::json!({
                "workspace": supercov_engine::workspace::prepare_isolated_workspace(
                    &request.root,
                    run_id,
                    &lock,
                ).map_err(|error| error.to_string())?,
            }),
            "prepare-cached" => serde_json::json!({
                "workspace": supercov_engine::workspace::prepare_cached_workspace(
                    &request.root,
                    &lock,
                    request.reuse_paths.as_deref().unwrap_or_default(),
                ).map_err(|error| error.to_string())?,
            }),
            "recover-cache" => serde_json::to_value(
                supercov_engine::workspace::recover_cached_workspace(&request.root, &lock)
                    .map_err(|error| error.to_string())?,
            )
            .map_err(|error| error.to_string())?,
            "prune-cache" => serde_json::json!({
                "removed": supercov_engine::workspace::prune_cached_workspace_sources(
                    &request.root,
                    &lock,
                ).map_err(|error| error.to_string())?,
            }),
            _ => return Err(format!("unsupported workspace action: {}", request.action)),
        };
        lock.release().map_err(|error| error.to_string())?;
        Ok(value)
    })();
    match result {
        Ok(result) => {
            spawn_trash_sweeper(&request.root);
            println!("{result}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] workspace failed: {error}");
            ExitCode::from(2)
        }
    }
}

fn spawn_trash_sweeper(root: &Path) {
    let Ok(executable) = std::env::current_exe() else {
        return;
    };
    let mut command = Command::new(executable);
    command
        .arg("__sweep-trash")
        .arg(root)
        // Keep the best-effort child from pinning a project or isolated
        // workspace as its cwd. This is required for recursive cleanup on
        // Windows and harmless on Unix filesystems.
        .current_dir(std::env::temp_dir())
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());
    #[cfg(unix)]
    {
        use std::os::unix::process::CommandExt;
        command.process_group(0);
    }
    let Ok(mut child) = command.spawn() else {
        return;
    };
    // Most sweeps complete in a few milliseconds. Give that fast path a
    // bounded opportunity to finish so a command launched immediately after
    // Supercov cannot discover copied config files in deferred trash. Slow
    // filesystems remain asynchronous, and the independent process group lets
    // the best-effort child survive the parent CLI exiting on Unix.
    for _ in 0..10 {
        match child.try_wait() {
            Ok(Some(_)) | Err(_) => return,
            Ok(None) => std::thread::sleep(Duration::from_millis(10)),
        }
    }
}

fn sweep_trash() -> ExitCode {
    let Some(root) = std::env::args_os().nth(2).map(PathBuf::from) else {
        return ExitCode::from(2);
    };
    match supercov_engine::lifecycle::sweep_trash(&root) {
        Ok(_) => ExitCode::SUCCESS,
        Err(_) => ExitCode::from(2),
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct LifecycleRequest {
    root: PathBuf,
    action: String,
    keep: Option<usize>,
    dry_run: Option<bool>,
    updated_at: Option<String>,
}

fn lifecycle() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: LifecycleRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid lifecycle input: {error}");
            return ExitCode::from(2);
        }
    };
    spawn_trash_sweeper(&request.root);
    let result = match request.action.as_str() {
        "clean" => {
            let options = supercov_engine::lifecycle::CleanupOptions {
                keep: request.keep.unwrap_or(0),
                dry_run: request.dry_run.unwrap_or(false),
            };
            let updated_at = request.updated_at.as_deref().unwrap_or("internal");
            supercov_engine::lifecycle::clean_storage(&request.root, options, updated_at).and_then(
                |result| {
                    serde_json::to_value(result)
                        .map_err(supercov_engine::lifecycle::LifecycleError::Metadata)
                },
            )
        }
        "recover" => supercov_engine::lifecycle::recover_abandoned_runs(
            &request.root,
            request.updated_at.as_deref().unwrap_or("internal"),
        )
        .and_then(|result| {
            serde_json::to_value(result)
                .map_err(supercov_engine::lifecycle::LifecycleError::Metadata)
        }),
        "sweep" => supercov_engine::lifecycle::sweep_trash(&request.root).and_then(|result| {
            serde_json::to_value(result)
                .map_err(supercov_engine::lifecycle::LifecycleError::Metadata)
        }),
        _ => {
            eprintln!("[supercov] unsupported lifecycle action");
            return ExitCode::from(2);
        }
    };
    match result {
        Ok(result) => {
            spawn_trash_sweeper(&request.root);
            println!("{result}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] lifecycle failed: {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct StoredQueryRequest {
    root: PathBuf,
    query: IndexedQueryRequest,
    newer_run_id: Option<String>,
}

fn analyze_stored_run(
    run: &StoredRun,
) -> Result<supercov_engine::coverage_report::CoverageReport, String> {
    analyze_coverage_archive(&ArchiveReportRequest {
        archive_path: run.evidence_path.clone(),
        run_id: run.id.clone(),
        generated_at: run.metadata.started_at.clone(),
        integrity: serde_json::to_value(&run.metadata.integrity).ok(),
        test_exit_code: supercov_engine::coverage_report::ExitCodeInput::Present(
            run.metadata.test_exit_code,
        ),
    })
    .map_err(|error| format!("invalid coverage archive: {error:?}"))
}

/// Internal differential surface for real persisted-run opening and indexing.
/// Public argument parsing is enabled only after this path has exact parity.
fn query_stored_run() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let mut request: StoredQueryRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid stored query input: {error}");
            return ExitCode::from(2);
        }
    };
    let result = (|| -> Result<String, String> {
        let inventory = discover_runs(&request.root).map_err(|error| error.to_string())?;
        let run = select_run(&inventory, Some(&request.query.run_id))
            .map_err(|error| error.to_string())?;
        request.query.run_id.clone_from(&run.id);
        request
            .query
            .valid
            .get_or_insert(run.metadata.test_exit_code == Some(0));
        let container = open_or_rebuild_query_index(run).map_err(|error| error.to_string())?;
        let index = CoverageIndex::new(&container).map_err(|error| error.to_string())?;
        let report = if request.query.command == "minimize" {
            Some(analyze_stored_run(run)?)
        } else {
            None
        };

        let newer_container;
        let newer_index;
        let newer_query = if request.query.command == "diff" {
            let selector = request
                .newer_run_id
                .as_deref()
                .ok_or_else(|| "stored diff requires a newer run ID".to_owned())?;
            let newer_run =
                select_run(&inventory, Some(selector)).map_err(|error| error.to_string())?;
            newer_container =
                open_or_rebuild_query_index(newer_run).map_err(|error| error.to_string())?;
            newer_index =
                CoverageIndex::new(&newer_container).map_err(|error| error.to_string())?;
            Some(NewerQuery {
                run_id: &newer_run.id,
                index: &newer_index,
            })
        } else {
            None
        };
        execute_indexed_query(&index, report.as_ref(), &request.query, newer_query)
            .map_err(|error| error.to_string())
    })();
    match result {
        Ok(output) => {
            print!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] stored query failed: {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct DiscoverSourceRequest {
    root: PathBuf,
    configured_roots: Option<Vec<String>>,
}

fn discover_source() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: DiscoverSourceRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid source-discovery input: {error}");
            return ExitCode::from(2);
        }
    };
    match supercov_engine::source_discovery::discover_source_scope(
        &request.root,
        request.configured_roots.as_deref(),
    ) {
        Ok(discovered) => match serde_json::to_string(&discovered) {
            Ok(output) => {
                println!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                eprintln!("[supercov] failed to serialize source discovery: {error}");
                ExitCode::from(2)
            }
        },
        Err(error) => {
            eprintln!("[supercov] source discovery failed: {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct DiscoverProjectRequest {
    root: PathBuf,
    #[serde(default)]
    environment: std::collections::BTreeMap<String, String>,
    #[serde(default)]
    command: Vec<String>,
}

fn discover_project() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: DiscoverProjectRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid project-discovery input: {error}");
            return ExitCode::from(2);
        }
    };
    match supercov_engine::project_discovery::discover_coverage_project(
        &request.root,
        &request.environment,
        &request.command,
    ) {
        Ok(project) => match serde_json::to_string(&project) {
            Ok(output) => {
                println!("{output}");
                ExitCode::SUCCESS
            }
            Err(error) => {
                eprintln!("[supercov] failed to serialize project discovery: {error}");
                ExitCode::from(2)
            }
        },
        Err(error) => {
            eprintln!("[supercov] project discovery failed: {error}");
            ExitCode::from(2)
        }
    }
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct IndexedFileQueryRequest {
    archive_path: PathBuf,
    run_id: String,
    generated_at: String,
    filter: String,
    command: String,
    metric: MinimizeMetric,
    kind: Option<String>,
    runner: Option<String>,
    file: Option<String>,
    line: Option<usize>,
    selector: Option<String>,
    sort: Option<DecisionSort>,
    valid: Option<bool>,
    stale: Option<bool>,
    stale_reasons: Option<Vec<String>>,
    offset: usize,
    limit: usize,
    target: Option<f64>,
    max_states: Option<usize>,
    newer_archive_path: Option<PathBuf>,
    newer_run_id: Option<String>,
}

fn query_index_files() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: IndexedFileQueryRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid Rust indexed query input: {error}");
            return ExitCode::from(2);
        }
    };
    let view = match request.filter.as_str() {
        "all" => supercov_engine::coverage_index::CoverageViewId::All,
        "passed" => supercov_engine::coverage_index::CoverageViewId::Passed,
        "failed" => supercov_engine::coverage_index::CoverageViewId::Failed,
        _ => {
            eprintln!("[supercov] invalid coverage filter");
            return ExitCode::from(2);
        }
    };
    let gaps_only = match request.command.as_str() {
        "files" => Some(false),
        "gaps" => Some(true),
        "file-decisions" | "kinds" | "runners" | "summary" | "scope" | "line" | "test"
        | "decision" | "file-detail" | "minimize" | "diff" => None,
        _ => {
            eprintln!("[supercov] unsupported indexed query");
            return ExitCode::from(2);
        }
    };
    let archive_request = ArchiveReportRequest {
        archive_path: request.archive_path.clone(),
        run_id: request.run_id.clone(),
        generated_at: request.generated_at.clone(),
        integrity: None,
        test_exit_code: Default::default(),
    };
    let report = match analyze_coverage_archive(&archive_request) {
        Ok(report) => report,
        Err(error) => {
            eprintln!("[supercov] invalid coverage archive: {error:?}");
            return ExitCode::from(2);
        }
    };
    let root = std::env::temp_dir().join(format!("supercov-indexed-query-{}", std::process::id()));
    if let Err(error) = fs::create_dir_all(&root) {
        eprintln!("[supercov] failed to create indexed query directory: {error}");
        return ExitCode::from(2);
    }
    let path = root.join("query-index.v1.bin");
    let identity = QueryIndexIdentity {
        evidence_sha256: [1; 32],
        evidence_bytes: fs::metadata(&request.archive_path)
            .map(|metadata| metadata.len())
            .unwrap_or(0),
        analysis_sha256: [2; 32],
        producer_sha256: [3; 32],
        archive_schema_version: 2,
    };
    let result = (|| -> Result<String, String> {
        let sections = coverage_index_sections(&report).map_err(|error| error.to_string())?;
        write_query_index(&sections, &identity, &path).map_err(|error| error.to_string())?;
        let container = QueryIndex::open(&path, &identity).map_err(|error| error.to_string())?;
        let index = CoverageIndex::new(&container).map_err(|error| error.to_string())?;
        if request.command == "diff" {
            let newer_archive_path = request
                .newer_archive_path
                .as_ref()
                .ok_or_else(|| "indexed diff requires a newer archive".to_owned())?;
            let newer_run_id = request
                .newer_run_id
                .as_deref()
                .ok_or_else(|| "indexed diff requires a newer run ID".to_owned())?;
            let newer_report = analyze_coverage_archive(&ArchiveReportRequest {
                archive_path: newer_archive_path.clone(),
                run_id: newer_run_id.into(),
                generated_at: request.generated_at.clone(),
                integrity: None,
                test_exit_code: Default::default(),
            })
            .map_err(|error| format!("invalid newer coverage archive: {error:?}"))?;
            let newer_path = root.join("newer-query-index.v1.bin");
            let newer_identity = QueryIndexIdentity {
                evidence_sha256: [4; 32],
                evidence_bytes: fs::metadata(newer_archive_path)
                    .map(|metadata| metadata.len())
                    .unwrap_or(0),
                analysis_sha256: [5; 32],
                producer_sha256: [6; 32],
                archive_schema_version: 2,
            };
            write_query_index(
                &coverage_index_sections(&newer_report).map_err(|error| error.to_string())?,
                &newer_identity,
                &newer_path,
            )
            .map_err(|error| error.to_string())?;
            let newer_container = QueryIndex::open(&newer_path, &newer_identity)
                .map_err(|error| error.to_string())?;
            let newer_index =
                CoverageIndex::new(&newer_container).map_err(|error| error.to_string())?;
            let (data, page) = coverage_diff_query(
                &index,
                &newer_index,
                CoverageDiffQueryOptions {
                    older_run: &request.run_id,
                    newer_run: newer_run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("diff", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "minimize" {
            let coverage_view = match view {
                supercov_engine::coverage_index::CoverageViewId::All => &report.view,
                supercov_engine::coverage_index::CoverageViewId::Passed => &report.filters.passed,
                supercov_engine::coverage_index::CoverageViewId::Failed => &report.filters.failed,
            };
            let (data, page) = coverage_minimize_query(
                coverage_view,
                CoverageMinimizeQueryOptions {
                    run: &request.run_id,
                    view_id: view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    target: request.target.unwrap_or(100.0),
                    metric: request.metric,
                    max_states: request.max_states.unwrap_or(5_000),
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.minimize", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "summary" {
            let data = coverage_summary_query(
                &index,
                CoverageSummaryQueryOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    valid: request.valid.unwrap_or(false),
                    test_exit_code: None,
                    stale: request.stale.unwrap_or(false),
                    stale_reasons: request.stale_reasons.clone().unwrap_or_default(),
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.summary", &data, None)
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "scope" {
            let (data, page) = coverage_scope_query(
                &index,
                CoverageScopeQueryOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.scope", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "line" {
            let file = request
                .file
                .as_deref()
                .ok_or_else(|| "indexed line query requires a file".to_owned())?;
            let line = request
                .line
                .ok_or_else(|| "indexed line query requires a line".to_owned())?;
            let (data, page) = coverage_covers_query(
                &index,
                CoverageCoversQueryOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    file,
                    line,
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.line", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "test" {
            let selector = request
                .selector
                .as_deref()
                .ok_or_else(|| "indexed test query requires a selector".to_owned())?;
            let (data, page) = coverage_test_query(
                &index,
                CoverageTestQueryOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    selector,
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.test", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "decision" {
            let selector = request
                .selector
                .as_deref()
                .ok_or_else(|| "indexed decision query requires a selector".to_owned())?;
            let (data, page) = coverage_decision_query(
                &index,
                CoverageDecisionQueryOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    selector,
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.decision", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "file-detail" {
            let selector = request
                .file
                .as_deref()
                .ok_or_else(|| "indexed file query requires a file".to_owned())?;
            let (data, page) = coverage_file_detail_query(
                &index,
                CoverageFileDetailOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    selector,
                    metric: request.metric,
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.file", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "kinds" || request.command == "runners" {
            let dimension = if request.command == "kinds" {
                supercov_engine::coverage_index::CoverageDimension::Kind
            } else {
                supercov_engine::coverage_index::CoverageDimension::Runner
            };
            let filters = CoverageQueryFilters {
                outcome: request.filter.clone(),
                kind: request.kind.clone(),
                runner: request.runner.clone(),
            };
            let (data, page) = coverage_dimension_query(
                &index,
                CoverageDimensionQueryOptions {
                    run: &request.run_id,
                    view,
                    dimension,
                    filters,
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            let command = if request.command == "kinds" {
                "coverage.kinds"
            } else {
                "coverage.runners"
            };
            return match data {
                CoverageDimensionQueryData::Kinds(data) => {
                    agent_json::success(command, &data, Some(&page))
                }
                CoverageDimensionQueryData::Runners(data) => {
                    agent_json::success(command, &data, Some(&page))
                }
            }
            .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        if request.command == "file-decisions" {
            let file = request
                .file
                .as_deref()
                .ok_or_else(|| "indexed file-decision query requires a file".to_owned())?;
            let (data, page) = coverage_file_decisions_query(
                &index,
                CoverageFileDecisionsOptions {
                    run: &request.run_id,
                    view,
                    kind: request.kind.as_deref(),
                    runner: request.runner.as_deref(),
                    file,
                    sort: request.sort.unwrap_or(DecisionSort::Location),
                    offset: request.offset,
                    limit: request.limit,
                },
            )
            .map_err(|error| format!("{error:?}"))?;
            return agent_json::success("coverage.file", &data, Some(&page))
                .map_err(|error| format!("response exceeds {} bytes", error.max_bytes));
        }
        let query = coverage_file_query(
            &index,
            CoverageFileQueryOptions {
                run: &request.run_id,
                view,
                metric: request.metric,
                gaps_only: gaps_only.expect("files/gaps command"),
                kind: request.kind.as_deref(),
                runner: request.runner.as_deref(),
                offset: request.offset,
                limit: request.limit,
            },
        )
        .map_err(|error| format!("{error:?}"))?;
        let command = if gaps_only == Some(true) {
            "coverage.gaps"
        } else {
            "coverage.files"
        };
        match query.data {
            CoverageFileQueryData::Files(data) => {
                agent_json::success(command, &data, Some(&query.pagination))
            }
            CoverageFileQueryData::Gaps(data) => {
                agent_json::success(command, &data, Some(&query.pagination))
            }
        }
        .map_err(|error| format!("response exceeds {} bytes", error.max_bytes))
    })();
    let _ = fs::remove_dir_all(&root);
    match result {
        Ok(output) => {
            print!("{output}");
            ExitCode::SUCCESS
        }
        Err(error) => {
            eprintln!("[supercov] indexed query failed: {error}");
            ExitCode::from(2)
        }
    }
}

fn roundtrip_query_indexes() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let requests: Vec<ArchiveReportRequest> = match serde_json::from_str(&input) {
        Ok(requests) => requests,
        Err(error) => {
            eprintln!("[supercov] invalid Rust query-index input: {error}");
            return ExitCode::from(2);
        }
    };
    let root = std::env::temp_dir().join(format!(
        "supercov-query-index-roundtrip-{}",
        std::process::id()
    ));
    if let Err(error) = fs::create_dir_all(&root) {
        eprintln!("[supercov] failed to create query-index test directory: {error}");
        return ExitCode::from(2);
    }
    let result = (|| -> Result<Vec<_>, String> {
        let mut snapshots = Vec::with_capacity(requests.len());
        for (index, request) in requests.iter().enumerate() {
            let report = analyze_coverage_archive(request)
                .map_err(|error| format!("invalid coverage archive: {error:?}"))?;
            let seed = u8::try_from(index % 251).unwrap_or(0);
            let identity = QueryIndexIdentity {
                evidence_sha256: [seed; 32],
                evidence_bytes: fs::metadata(&request.archive_path)
                    .map_err(|error| error.to_string())?
                    .len(),
                analysis_sha256: [seed.wrapping_add(1); 32],
                producer_sha256: [seed.wrapping_add(2); 32],
                archive_schema_version: 2,
            };
            let path = root.join(format!("{index}.bin"));
            let sections = coverage_index_sections(&report).map_err(|error| error.to_string())?;
            write_query_index(&sections, &identity, &path).map_err(|error| error.to_string())?;
            let container =
                QueryIndex::open(&path, &identity).map_err(|error| error.to_string())?;
            snapshots.push(
                CoverageIndex::new(&container)
                    .and_then(|index| index.snapshot())
                    .map_err(|error| error.to_string())?,
            );
        }
        Ok(snapshots)
    })();
    let _ = fs::remove_dir_all(&root);
    let snapshots = match result {
        Ok(snapshots) => snapshots,
        Err(error) => {
            eprintln!("[supercov] query-index roundtrip failed: {error}");
            return ExitCode::from(2);
        }
    };
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &snapshots) {
        eprintln!("[supercov] failed to write Rust query-index output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

fn minimum_test_sets() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let requests: Vec<MinimumTestSetRequest> = match serde_json::from_str(&input) {
        Ok(requests) => requests,
        Err(error) => {
            eprintln!("[supercov] invalid Rust minimization input: {error}");
            return ExitCode::from(2);
        }
    };
    let mut results = Vec::with_capacity(requests.len());
    for request in &requests {
        match minimum_test_set_for_request(request) {
            Ok(result) => results.push(result),
            Err(error) => {
                eprintln!("[supercov] coverage minimization failed: {error:?}");
                return ExitCode::from(2);
            }
        }
    }
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &results) {
        eprintln!("[supercov] failed to write Rust minimization output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

fn analyze_evidence_archive() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: ArchiveReportRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid Rust archive analysis input: {error}");
            return ExitCode::from(2);
        }
    };
    let report = match analyze_coverage_archive(&request) {
        Ok(report) => report,
        Err(error) => {
            eprintln!("[supercov] invalid coverage archive: {error:?}");
            return ExitCode::from(2);
        }
    };
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &report) {
        eprintln!("[supercov] failed to write Rust archive report output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

fn analyze_coverage_report() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let requests: Vec<CoverageReportRequest> = match serde_json::from_str(&input) {
        Ok(requests) => requests,
        Err(error) => {
            eprintln!("[supercov] invalid Rust coverage report input: {error}");
            return ExitCode::from(2);
        }
    };
    let mut reports = Vec::with_capacity(requests.len());
    for request in &requests {
        match analyze_coverage_results(request) {
            Ok(report) => reports.push(report),
            Err(error) => {
                eprintln!("[supercov] invalid coverage evidence: {error:?}");
                return ExitCode::from(2);
            }
        }
    }
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &reports) {
        eprintln!("[supercov] failed to write Rust coverage report output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

fn analyze_coverage_core() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let requests: Vec<CoverageCoreInput> = match serde_json::from_str(&input) {
        Ok(requests) => requests,
        Err(error) => {
            eprintln!("[supercov] invalid Rust coverage analysis input: {error}");
            return ExitCode::from(2);
        }
    };
    let mut outputs = Vec::with_capacity(requests.len());
    for request in &requests {
        match analyze_core(request) {
            Ok(output) => outputs.push(output),
            Err(error) => {
                eprintln!("[supercov] invalid coverage vectors: {error:?}");
                return ExitCode::from(2);
            }
        }
    }
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &outputs) {
        eprintln!("[supercov] failed to write Rust coverage analysis output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct TransformBenchmarkResult {
    files: usize,
    duration_ns: u128,
}

/// Development-only measurement boundary for the frozen Phase 3 transform
/// gate. Input decoding and output transport are measured separately by the
/// caller; this reports only parse -> transform -> codegen engine time.
fn benchmark_js_transform() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let cases: Vec<InstrumentCase> = match serde_json::from_str(&input) {
        Ok(cases) => cases,
        Err(error) => {
            eprintln!("[supercov] invalid Rust benchmark input: {error}");
            return ExitCode::from(2);
        }
    };
    let files = cases.len();
    let started = Instant::now();
    for case in cases {
        if let Err(error) = instrument_candidate(&case.source, &case.file) {
            eprintln!("[supercov] {}: {error:?}", case.file);
            return ExitCode::from(2);
        }
    }
    let result = TransformBenchmarkResult {
        files,
        duration_ns: started.elapsed().as_nanos(),
    };
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &result) {
        eprintln!("[supercov] failed to write Rust benchmark output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

fn stdin() -> Result<String, String> {
    let input = stdin_bytes()?;
    String::from_utf8(input).map_err(|error| format!("Rust engine input is not UTF-8: {error}"))
}

fn stdin_bytes() -> Result<Vec<u8>, String> {
    if let Some(path) = std::env::var_os("SUPERCOV_INTERNAL_INPUT_FILE") {
        return fs::read(&path).map_err(|error| {
            format!(
                "failed to read Rust engine input {}: {error}",
                Path::new(&path).display()
            )
        });
    }
    let mut input = Vec::new();
    std::io::stdin()
        .read_to_end(&mut input)
        .map_err(|error| format!("failed to read Rust engine input: {error}"))?;
    Ok(input)
}

#[derive(Deserialize)]
struct InstrumentCase {
    file: String,
    source: String,
}

/// Private batch protocol used by conformance and performance harnesses.
fn instrument_js() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let cases: Vec<InstrumentCase> = match serde_json::from_str(&input) {
        Ok(cases) => cases,
        Err(error) => {
            eprintln!("[supercov] invalid Rust instrumenter input: {error}");
            return ExitCode::from(2);
        }
    };
    let mut outputs = Vec::with_capacity(cases.len());
    for case in cases {
        match instrument_candidate(&case.source, &case.file) {
            Ok(output) => outputs.push(output),
            Err(error) => {
                eprintln!("[supercov] {}: {error:?}", case.file);
                return ExitCode::from(2);
            }
        }
    }
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &outputs) {
        eprintln!("[supercov] failed to write Rust instrumenter output: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct PackEvidenceRequest {
    destination: PathBuf,
    #[serde(default)]
    sources: Vec<PackEvidenceSource>,
    #[serde(default)]
    entries: Vec<PackEvidenceEntry>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct PackEvidenceSource {
    directory: Option<PathBuf>,
    prefix: Option<String>,
    file: Option<PathBuf>,
    path: Option<String>,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct PackEvidenceEntry {
    path: String,
    contents: String,
}

fn pack_evidence() -> ExitCode {
    let input = match stdin() {
        Ok(input) => input,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let request: PackEvidenceRequest = match serde_json::from_str(&input) {
        Ok(request) => request,
        Err(error) => {
            eprintln!("[supercov] invalid Rust evidence request: {error}");
            return ExitCode::from(2);
        }
    };
    if !request.sources.is_empty() && !request.entries.is_empty() {
        eprintln!("[supercov] Rust evidence request cannot mix sources and entries");
        return ExitCode::from(2);
    }
    let entries = if request.entries.is_empty() {
        let mut sources = Vec::with_capacity(request.sources.len());
        for source in request.sources {
            match (source.directory, source.file, source.path) {
                (Some(directory), None, None) => sources.push(EvidenceArchiveSource::Directory {
                    directory,
                    prefix: source.prefix,
                }),
                (None, Some(file), Some(path)) if source.prefix.is_none() => {
                    sources.push(EvidenceArchiveSource::File { file, path });
                }
                _ => {
                    eprintln!(
                        "[supercov] each evidence source must be one directory with an optional prefix or one file with an archive path"
                    );
                    return ExitCode::from(2);
                }
            }
        }
        match collect_sources(&sources) {
            Ok(entries) => entries,
            Err(error) => {
                eprintln!("[supercov] failed to collect evidence: {error}");
                return ExitCode::from(2);
            }
        }
    } else {
        request
            .entries
            .into_iter()
            .map(|entry| EvidenceArchiveEntry {
                path: entry.path,
                contents: entry.contents.into_bytes(),
            })
            .collect()
    };
    let metadata = match write_archive(entries, &request.destination) {
        Ok(metadata) => metadata,
        Err(error) => {
            eprintln!("[supercov] failed to pack evidence: {error}");
            return ExitCode::from(2);
        }
    };
    if let Err(error) = serde_json::to_writer(std::io::stdout(), &metadata) {
        eprintln!("[supercov] failed to serialize evidence metadata: {error}");
        return ExitCode::from(2);
    }
    ExitCode::SUCCESS
}

#[cfg(test)]
mod docs_command_tests {
    use super::localize_guide;

    const GUIDE: &str = "Run `npx supercov security` or `supercov quality`.\nKeep `supercov-cli` and `supercov`.\n\n```sh\nnpx supercov -- npm test\nsupercov runs latest   # newest run\n$ supercov security patch\n```\n\n```text\nsupercov security: 3 files flagged\n```\n";

    #[test]
    fn guides_print_commands_the_way_the_reader_started_supercov() {
        let go = "go run github.com/supercorp-ai/supercov/cmd/supercov@latest";
        let printed = localize_guide(GUIDE, go);
        assert!(printed.contains(&format!("Run `{go} security` or `{go} quality`.")));
        assert!(printed.contains(&format!(
            "{go} -- npm test\n{go} runs latest   # newest run\n$ {go} security patch"
        )));
        // A package name, the bare binary name and recorded output stay put.
        assert!(printed.contains("Keep `supercov-cli` and `supercov`."));
        assert!(printed.contains("```text\nsupercov security: 3 files flagged\n```"));

        let npm = localize_guide(GUIDE, "npx supercov");
        assert!(npm.contains("`npx supercov quality`"));
        assert!(npm.contains("npx supercov runs latest"));
        assert!(!npm.contains("npx npx"));

        let native = localize_guide(GUIDE, "supercov");
        assert!(native.contains("`supercov security`"));
        assert!(native.contains("```sh\nsupercov -- npm test"));
    }
}

#[cfg(test)]
mod tests {
    /// The contract version each frontend actually records, so this cannot
    /// drift from the strings runs are stored with.
    #[test]
    fn every_frontend_answers_for_its_own_runs() {
        for (version, expected) in [
            ("supercov-rust-rust-owned-v1", Frontend::Rust),
            ("supercov-ruby-ruby-owned-v1", Frontend::Ruby),
            ("supercov-python-python-owned-v1", Frontend::Python),
            ("supercov-go-go-owned-v1", Frontend::Go),
            ("supercov-jvm-jvm-owned-v1", Frontend::Jvm),
            ("javascript-v1", Frontend::JavaScript),
        ] {
            assert_eq!(frontend_of(version), expected, "{version}");
        }
        // A frontend nobody has written yet must not quietly become
        // JavaScript's problem in a way that reads as a real answer -- but
        // JavaScript is what a run predating these prefixes recorded, so it
        // stays the fallback.
        assert_eq!(frontend_of("supercov-zig-v1"), Frontend::JavaScript);
    }

    use super::*;

    #[test]
    fn the_timings_line_reports_publication_and_the_whole_command() {
        let timings = supercov_engine::run_store::RunTimings {
            initialization_ms: 1.0,
            workspace_preparation_ms: 2.0,
            adapter_setup_ms: 3.0,
            instrumented_build_ms: 4.0,
            test_command_ms: 5.0,
            evidence_publication_ms: 6.0,
        };
        // Published: the command ran 30 ms, 21 of them before the engine's
        // clock stopped, so publication took the other 9 and total is 30.
        assert_eq!(
            format_run_timings(&timings, 21.0, Some(30.0)),
            "initialization=1ms workspace=2ms setup=3ms build=4ms tests=5ms evidence=6ms publication=9ms total=30ms"
        );
        // A clock that reads a hair under the engine's never reports negative
        // publication or a total below what the engine measured.
        assert_eq!(
            format_run_timings(&timings, 21.0, Some(20.9)),
            "initialization=1ms workspace=2ms setup=3ms build=4ms tests=5ms evidence=6ms publication=0ms total=21ms"
        );
        // Interrupted: nothing was published, and the line says only that.
        assert_eq!(
            format_run_timings(&timings, 21.0, None),
            "initialization=1ms workspace=2ms setup=3ms build=4ms tests=5ms evidence=6ms total=21ms"
        );
    }

    #[test]
    fn shell_reports_the_public_engine() {
        assert!(HELP.contains("Coverage, security and code quality for coding agents"));
        assert!(HELP.contains("full test command"));
        assert!(HELP.contains("npx supercov -- npm test"));
        assert!(HELP.contains("supercov docs"));
        // Quality, coverage, then assertions, each in its own section.
        let order = [
            "Score the source with Jev:",
            "Measure your full test command:",
            "Inspect a run with small, paginated answers:",
            "Check what the tests assert:",
        ];
        let mut at = 0;
        for needle in order {
            let found = HELP[at..].find(needle).expect(needle);
            at += found + needle.len();
        }
        assert!(!HELP.contains("Assertion map schema and syntax: supercov assertions"));
    }

    #[test]
    fn suite_slice_hint_points_to_the_existing_full_package_command() {
        let root = std::env::temp_dir().join(format!(
            "supercov-suite-hint-{}-{}",
            std::process::id(),
            OffsetDateTime::now_utc().unix_timestamp_nanos()
        ));
        fs::create_dir_all(&root).unwrap();
        fs::write(
            root.join("package.json"),
            r#"{"scripts":{"test":"npm run test:unit && npm run test:e2e","test:unit":"vitest run","test:e2e":"playwright test"}}"#,
        )
        .unwrap();
        let hints = full_suite_hints(
            &root,
            &["npm".into(), "run".into(), "test:unit".into()],
            &["unit".into()],
        );
        fs::remove_dir_all(&root).unwrap();
        assert_eq!(hints.len(), 1);
        assert!(hints[0].contains("only the `unit` test kind"));
        assert!(hints[0].contains("test:e2e"));
        assert!(hints[0].contains("npx supercov -- npm test"));
    }

    #[test]
    fn nested_cargo_wrapper_dispatch_requires_a_real_executable() {
        let executable = std::env::current_exe().unwrap();
        assert!(is_executable_wrapper_program(executable.as_os_str()));
        assert!(!is_executable_wrapper_program(OsStr::new("--edition=2024")));
        assert!(!is_executable_wrapper_program(OsStr::new(
            "@rustdoc-arguments"
        )));
        assert!(!is_executable_wrapper_program(OsStr::new("Cargo.toml")));
    }

    #[test]
    fn exact_libtest_injection_selects_only_unclaimed_test_harness_units() {
        assert!(
            rustc_builds_test_harness(&["--crate-name".into(), "fixture".into(), "--test".into(),])
                .unwrap()
        );
        assert!(
            !rustc_builds_test_harness(&[
                "--crate-name".into(),
                "dependency".into(),
                "--crate-type=lib".into(),
            ])
            .unwrap()
        );
        for existing in [
            vec![
                "--test".into(),
                "--extern".into(),
                "test=/tmp/libtest.rlib".into(),
            ],
            vec!["--test".into(), "--extern=test=/tmp/libtest.rlib".into()],
            vec![
                "--test".into(),
                "--extern=noprelude:priv:test=/tmp/libtest.rlib".into(),
            ],
        ] {
            assert!(rustc_builds_test_harness(&existing).is_err());
        }
    }

    #[test]
    fn rustdoc_removes_only_the_exact_injected_cargo_runner() {
        let runner = Path::new("/opt/supercov");
        let plain_target =
            supercov_engine::rust_cargo_configuration::RustCargoResolvedTargetRunner {
                target: "aarch64-apple-darwin".into(),
                underlying_runner: None,
            };
        assert_eq!(
            strip_injected_rustdoc_runner(
                vec![
                    "--crate-name".into(),
                    "fixture".into(),
                    "--test-runtool".into(),
                    "/opt/supercov".into(),
                    "--test-runtool-arg".into(),
                    "__cargo-test-runner".into(),
                    "--test-runtool-arg".into(),
                    "aarch64-apple-darwin".into(),
                    "src/lib.rs".into(),
                ],
                runner,
                std::slice::from_ref(&plain_target),
            )
            .unwrap(),
            ["--crate-name", "fixture", "src/lib.rs"]
        );
        assert_eq!(
            strip_injected_rustdoc_runner(
                vec![
                    "--test-runtool=/opt/supercov".into(),
                    "--test-runtool-arg=__cargo-test-runner".into(),
                    "--test-runtool-arg=aarch64-apple-darwin".into(),
                ],
                runner,
                std::slice::from_ref(&plain_target),
            )
            .unwrap(),
            Vec::<String>::new()
        );
        let underlying = supercov_engine::rust_cargo_configuration::RustCargoResolvedRunner {
            program: PathBuf::from("/opt/runner with spaces"),
            arguments: vec!["--fixed".into(), "two words".into()],
        };
        let configured_target =
            supercov_engine::rust_cargo_configuration::RustCargoResolvedTargetRunner {
                target: "aarch64-apple-darwin".into(),
                underlying_runner: Some(underlying),
            };
        assert_eq!(
            strip_injected_rustdoc_runner(
                vec![
                    "--test-runtool=/opt/supercov".into(),
                    "--test-runtool-arg=__cargo-test-runner".into(),
                    "--test-runtool-arg=aarch64-apple-darwin".into(),
                    "src/lib.rs".into(),
                ],
                runner,
                std::slice::from_ref(&configured_target),
            )
            .unwrap(),
            [
                "src/lib.rs",
                "--test-runtool",
                "/opt/runner with spaces",
                "--test-runtool-arg",
                "--fixed",
                "--test-runtool-arg",
                "two words",
            ]
        );
    }

    #[test]
    fn rustdoc_rejects_missing_or_foreign_runner_composition() {
        let runner = Path::new("/opt/supercov");
        let target = supercov_engine::rust_cargo_configuration::RustCargoResolvedTargetRunner {
            target: "aarch64-apple-darwin".into(),
            underlying_runner: None,
        };
        assert!(strip_injected_rustdoc_runner(vec!["--test".into()], runner, &[]).is_err());
        assert!(
            strip_injected_rustdoc_runner(
                vec![
                    "--test-runtool".into(),
                    "/opt/foreign".into(),
                    "--test-runtool-arg".into(),
                    "__cargo-test-runner".into(),
                    "--test-runtool-arg".into(),
                    "aarch64-apple-darwin".into(),
                ],
                runner,
                std::slice::from_ref(&target),
            )
            .is_err()
        );
        assert!(
            strip_injected_rustdoc_runner(
                vec!["--test-runtool".into(), "/opt/supercov".into()],
                runner,
                std::slice::from_ref(&target),
            )
            .is_err()
        );
        let injected = vec![
            "--test-runtool=/opt/supercov".into(),
            "--test-runtool-arg=__cargo-test-runner".into(),
            "--test-runtool-arg=x86_64-unknown-linux-gnu".into(),
        ];
        assert!(
            strip_injected_rustdoc_runner(injected.clone(), runner, std::slice::from_ref(&target))
                .unwrap_err()
                .contains("unconfigured Cargo target")
        );
    }

    #[test]
    fn rustdoc_restores_only_the_selected_targets_runner() {
        let runner = Path::new("/opt/supercov");
        let targets = [
            supercov_engine::rust_cargo_configuration::RustCargoResolvedTargetRunner {
                target: "aarch64-apple-darwin".into(),
                underlying_runner: Some(
                    supercov_engine::rust_cargo_configuration::RustCargoResolvedRunner {
                        program: "/opt/darwin-runner".into(),
                        arguments: vec!["--darwin".into()],
                    },
                ),
            },
            supercov_engine::rust_cargo_configuration::RustCargoResolvedTargetRunner {
                target: "x86_64-unknown-linux-gnu".into(),
                underlying_runner: Some(
                    supercov_engine::rust_cargo_configuration::RustCargoResolvedRunner {
                        program: "/opt/linux-runner".into(),
                        arguments: vec!["--linux".into()],
                    },
                ),
            },
        ];
        assert_eq!(
            strip_injected_rustdoc_runner(
                vec![
                    "--test-runtool=/opt/supercov".into(),
                    "--test-runtool-arg=__cargo-test-runner".into(),
                    "--test-runtool-arg=x86_64-unknown-linux-gnu".into(),
                    "src/lib.rs".into(),
                ],
                runner,
                &targets,
            )
            .unwrap(),
            [
                "src/lib.rs",
                "--test-runtool",
                "/opt/linux-runner",
                "--test-runtool-arg",
                "--linux",
            ]
        );
        assert!(
            strip_injected_rustdoc_runner(
                vec![
                    "--test-runtool=/opt/supercov".into(),
                    "--test-runtool-arg=__cargo-test-runner".into(),
                    "--test-runtool-arg=aarch64-apple-darwin".into(),
                ],
                runner,
                &[targets[0].clone(), targets[0].clone()],
            )
            .unwrap_err()
            .contains("duplicates Cargo target identity")
        );
    }

    #[test]
    fn cleanup_options_preserve_the_frozen_cli_contract() {
        assert_eq!(parse_cleanup_options(&[]).unwrap(), (0, false));
        assert_eq!(
            parse_cleanup_options(&["--keep".into(), "20".into(), "--dry-run".into()]).unwrap(),
            (20, true)
        );
        assert_eq!(
            parse_cleanup_options(&["--keep".into()]).unwrap_err(),
            "--keep must be a non-negative integer"
        );
        assert_eq!(
            parse_cleanup_options(&["--unknown".into()]).unwrap_err(),
            "Unknown clean option: --unknown"
        );
        let result = supercov_engine::lifecycle::CleanupResult {
            removed_runs: vec!["run-1".into(), "run-0".into()],
            removed_workspaces: vec!["run-1".into()],
            removed_evidence: vec![],
            removed_failed_evidence: vec![],
            removed_build_cache: false,
        };
        assert_eq!(
            cleanup_summary(0, false, &result),
            "[supercov] removed 2 stored run(s), 1 per-run workspace(s), and no isolated build cache; keeping 0 newest run(s)"
        );
        // Kept evidence is the one thing here a user cannot get back, so the
        // line says it went rather than leaving it to the run count.
        let with_kept = supercov_engine::lifecycle::CleanupResult {
            removed_failed_evidence: vec!["run_kept".into()],
            ..result
        };
        assert_eq!(
            cleanup_summary(0, false, &with_kept),
            "[supercov] removed 2 stored run(s), 1 per-run workspace(s), the kept evidence of 1 failed run(s), and no isolated build cache; keeping 0 newest run(s)"
        );
    }

    #[test]
    fn public_run_ids_are_short_opaque_and_unique() {
        let (first, first_started_at) = public_run_identity().unwrap();
        let (second, second_started_at) = public_run_identity().unwrap();
        assert!(first.starts_with("run_"));
        assert_eq!(first.len(), 20);
        assert!(public_run_id(&first));
        assert_ne!(first, second);
        assert!(!public_run_id("2026-08-25T23-33-12-211Z"));
        assert!(!public_run_id("run_35c35ceeaf4b843Z"));
        assert!(first_started_at.contains('T'));
        assert!(second_started_at.contains('T'));
    }
}
