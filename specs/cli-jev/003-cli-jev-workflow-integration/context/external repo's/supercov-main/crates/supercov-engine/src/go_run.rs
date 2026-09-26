//! Public, isolated Go coverage run lifecycle.
//!
//! Supercov owns the probes here, which means it rewrites the module's own
//! sources. That cannot happen in the user's tree, so the run copies the
//! project into an isolated workspace, instruments it there, and runs the
//! user's command against the copy. Nothing in the tree the author edits is
//! touched.
//!
//! Two facts about `go test` shape the rest:
//!
//! - It builds and runs **one test binary per package**, each its own process
//!   with its own probe array. So each test package writes its own evidence
//!   file and the run merges them, rather than every process racing to write
//!   one path.
//! - It **caches** successful results. A cached package does not run, so it
//!   records nothing, and a run that silently measured half a suite is worse
//!   than one that took longer. The run adds `-count=1` when the command does
//!   not already say otherwise, and says so.

use std::{
    collections::{BTreeMap, BTreeSet},
    ffi::OsString,
    fs,
    io::Write,
    path::{Path, PathBuf},
    time::Instant,
};

use serde::{Deserialize, Serialize};

use crate::{
    evidence_archive::write_archive,
    frontend_protocol::validate_frontend_report_request,
    go_instrumenter::{RUNTIME_ALIAS, RUNTIME_IMPORT, rewrite},
    go_project::{PreparedGoProject, go_integrity_inputs, module_path, prepare_go_project},
    go_test_harness::{instrument_test_file, probe_array_file, synthesized_harness},
    integrity::{FrontendIntegrityInputs, create_explicit_run_integrity},
    lifecycle::{
        ProjectLock, finalize_published_run, note_kept_evidence, publish_run,
        recover_abandoned_runs, remove_stored_tree_deferred,
    },
    orchestration::{ExecutionPhase, ExecutionPlan, PhaseKind, execute_plan},
    owned_evidence::{
        OwnedRunInputs, OwnedTestOutcome, build_frontend_run, go_coverage_model, go_declaration,
        merge_evidence, read_evidence,
    },
    process_supervision::{CommandSpec, SupervisionOptions},
    run_store::{RawEvidenceMetadata, RunMetadata, RunTimings},
    workspace::{canonicalize_simplified, prepare_cached_workspace, recover_cached_workspace},
};

/// Where the runtime package lands inside the workspace.
///
/// A plain directory rather than something hidden: the Go tool ignores any
/// directory whose name begins with `.` or `_`, so a runtime placed out of
/// sight would also be out of the build.
const RUNTIME_DIRECTORY: &str = "supercov_runtime";

const RUNTIME_SOURCE: &str = include_str!("../runtime-assets/go/supercov/supercov.go");

/// The generated file that declares a package's probe array.
const PROBE_FILE: &str = "supercov_probes.go";

/// The generated file that arms the runtime and binds each test.
const HARNESS_FILE: &str = "supercov_generated_test.go";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectGoRunRequest {
    pub root: PathBuf,
    pub command: Vec<String>,
    pub run_id: String,
    pub started_at: String,
    /// Credit every test with what it reached, by running the package's tests
    /// one at a time.
    ///
    /// Probes are a store into one array the whole process shares, so a test
    /// that called `t.Parallel()` can only be credited with its own work if
    /// nothing else is running while it does it. `-parallel 1` is what buys
    /// that, and what it costs is the suite's own parallelism -- which is why
    /// it is asked for rather than assumed.
    #[serde(default)]
    pub exact_attribution: bool,
}

#[derive(Debug, Clone, PartialEq)]
pub struct DirectGoRunResult {
    pub run_id: String,
    pub run_directory: PathBuf,
    pub exit_code: i32,
    pub tests: usize,
    /// Test functions `go test` ran that no evidence can be credited to: one
    /// that called `t.Parallel()`, and every Example or Fuzz target. What they
    /// reached counts run-wide, so a run of nothing but these is a measured
    /// run with no per-test attribution -- which is a different thing from an
    /// empty suite, and the summary has to be able to say which it was.
    pub unattributed: usize,
    pub source_files: usize,
    /// Source files that did not parse, and so carry no obligations. A hole in
    /// the denominator travels with the number it was taken out of.
    pub unparseable_sources: usize,
    /// Test files that did not parse. Their tests still run and still reach
    /// what they reach; what is lost is the announcement that would name them
    /// for it.
    pub unparseable_tests: usize,
    pub packages: usize,
    pub recovered_runs: Vec<String>,
    pub metadata: RunMetadata,
}

fn elapsed_ms(started: Instant) -> f64 {
    (started.elapsed().as_secs_f64() * 10_000.0).round() / 10.0
}

/// One package whose tests will run, and where its evidence lands.
#[derive(Debug, Clone)]
struct GoTestPackage {
    /// Directory relative to the workspace root, `/`-separated, `.` for the
    /// module root.
    directory: String,
    evidence: PathBuf,
    /// Which file declared each test, so a result can point at its source.
    declared_in: BTreeMap<String, String>,
    /// What ran here and announced nothing: parallel tests, Examples, Fuzz
    /// targets.
    unattributed: BTreeSet<String>,
}

struct InstrumentedWorkspace {
    project: PreparedGoProject,
    packages: Vec<GoTestPackage>,
    /// Test files that did not parse, with the reason. They cost the tests
    /// they declare their attribution and nothing else.
    unparseable_tests: Vec<(String, String)>,
}

fn directory_of(relative: &str) -> String {
    match relative.rsplit_once('/') {
        Some((directory, _)) => directory.to_owned(),
        None => ".".to_owned(),
    }
}

/// The `package` a Go file declares.
///
/// Scanned rather than parsed: the clause is the first thing in a Go file that
/// is not a comment, so stripping comments and reading the next word gets the
/// same answer as a parse for a fraction of the cost — and preparing a project
/// already parses every file once, which is enough.
fn package_name(source: &str) -> Option<String> {
    let bytes = source.as_bytes();
    let mut at = 0;
    while at < bytes.len() {
        let rest = &source[at..];
        if rest.starts_with("//") {
            at += rest.find('\n').map_or(rest.len(), |end| end + 1);
        } else if rest.starts_with("/*") {
            // An unterminated comment is not Go; there is no clause to find.
            at += rest.find("*/").map_or(rest.len(), |end| end + 2);
        } else if bytes[at].is_ascii_whitespace() {
            at += 1;
        } else {
            return rest
                .strip_prefix("package")
                .and_then(|rest| rest.strip_prefix(|c: char| c.is_ascii_whitespace()))
                .and_then(|rest| rest.split_whitespace().next())
                .map(str::to_owned);
        }
    }
    None
}

fn read(path: &Path) -> Result<String, String> {
    fs::read_to_string(path).map_err(|error| format!("{}: {error}", path.display()))
}

fn write(path: &Path, contents: &str) -> Result<(), String> {
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).map_err(|error| format!("{}: {error}", parent.display()))?;
    }
    fs::write(path, contents).map_err(|error| format!("{}: {error}", path.display()))
}

/// A file-system-safe name for a package's evidence, so two packages cannot
/// collide on one path.
fn evidence_name(directory: &str) -> String {
    let slug = directory
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() { c } else { '_' })
        .collect::<String>();
    format!("{slug}.bin")
}

/// Rewrite the workspace in place: instrumented sources, the runtime package
/// they import, a probe array per package, and a harness per test package.
fn instrument_workspace(
    workspace: &Path,
    evidence_directory: &Path,
    serialised: bool,
    roots: Option<&crate::source_discovery::ExplicitSourceRoots>,
) -> Result<InstrumentedWorkspace, String> {
    let mut project = prepare_go_project(workspace, roots)?;
    let mut unparseable_tests: Vec<(String, String)> = Vec::new();

    // A go.work repository has several modules and no module at its root, so
    // each gets a runtime of its own: an import is resolved against the module
    // that names it, and one module cannot import a package inside another.
    let members = crate::go_project::workspace_modules(workspace);
    let directories = if members.is_empty() {
        vec![".".to_owned()]
    } else {
        members.into_iter().collect::<Vec<_>>()
    };
    let mut runtimes: Vec<(String, String)> = Vec::new();
    for directory in &directories {
        let at = workspace.join(directory);
        let module = module_path(&at).ok_or_else(|| {
            format!(
                "{}: no module path in go.mod, so Supercov cannot name the package its runtime is imported from",
                at.display()
            )
        })?;
        write(
            &at.join(RUNTIME_DIRECTORY).join("supercov.go"),
            RUNTIME_SOURCE,
        )?;
        runtimes.push((directory.clone(), format!("{module}/{RUNTIME_DIRECTORY}")));
    }
    // Longest first, so a nested module wins over the root it sits under.
    runtimes.sort_by_key(|(directory, _)| std::cmp::Reverse(directory.len()));
    let import_for = |relative: &str| -> &str {
        runtimes
            .iter()
            .find(|(directory, _)| {
                directory == "."
                    || relative == directory
                    || relative.starts_with(&format!("{directory}/"))
            })
            .map(|(_, import)| import.as_str())
            .unwrap_or_default()
    };

    // Probe ids are handed out across the whole module, so every package
    // reserves the same total: a probe from one package is the same index in
    // the binary that links it as a dependency.
    let probe_count = project
        .probes
        .keys()
        .max()
        .map_or(0, |highest| *highest as usize + 1);

    let mut source_packages: BTreeMap<String, String> = BTreeMap::new();
    for (relative, instrumented) in &project.instrumented {
        let instrumented = instrumented.replace(RUNTIME_IMPORT, import_for(relative));
        let path = workspace.join(relative);
        if let Some(name) = package_name(&instrumented) {
            source_packages
                .entry(directory_of(relative))
                .or_insert(name);
        }
        write(&path, &instrumented)?;
    }
    for (directory, package) in &source_packages {
        write(
            &workspace.join(directory).join(PROBE_FILE),
            &probe_array_file(
                package,
                RUNTIME_ALIAS,
                import_for(&format!("{directory}/x.go")),
                probe_count,
            ),
        )?;
    }

    let mut by_directory: BTreeMap<String, Vec<&String>> = BTreeMap::new();
    for relative in &project.files.tests {
        by_directory
            .entry(directory_of(relative))
            .or_default()
            .push(relative);
    }

    let mut packages = Vec::new();
    for (directory, tests) in by_directory {
        let evidence = evidence_directory.join(evidence_name(&directory));
        let evidence_literal = evidence.to_string_lossy().replace('\\', "\\\\");
        let mut declared_in = BTreeMap::new();
        let mut unattributed = BTreeSet::new();
        let mut declares_test_main = false;
        // The harness joins whichever package the tests are in. A directory
        // can hold both `foo` and `foo_test` files; the internal one wins,
        // because that is where the instrumented sources are.
        let mut harness_package: Option<String> = None;
        for relative in tests {
            let path = workspace.join(relative);
            let source = read(&path)?;
            let Some(name) = package_name(&source) else {
                continue;
            };
            // The package a harness joins is read from the text, so it is
            // known whether or not the file parses -- and a package whose only
            // test file is unreadable still needs one.
            let internal = source_packages.get(&directory) == Some(&name);
            if internal || harness_package.is_none() {
                harness_package = Some(name);
            }
            // A file the toolchain never builds declares nothing Supercov has
            // to work around, and reading its `TestMain` as the package's own
            // stood the harness down for a package that had none -- so the
            // runtime was never armed and a passing suite published nothing.
            let built = !build_ignored(&source);
            let file =
                match instrument_test_file(&source, RUNTIME_ALIAS, &evidence_literal, serialised) {
                    Ok(file) => file,
                    Err(error) => {
                        // Taking the run down with it is the reflex a source file
                        // was corrected for, and it is worse here: a test file
                        // need not even be in the build for Supercov to refuse the
                        // suite the toolchain just passed. What it costs is the
                        // attribution of the tests it declares, because there is
                        // nowhere to put the announcement. What they reach still
                        // counts run-wide, like any execution no test could claim.
                        project.manifest.limitations.push(
                            crate::go_project::unparseable_limitation(relative, &error.to_string()),
                        );
                        unparseable_tests.push((relative.clone(), error.to_string()));
                        // A TestMain nobody could read is still a TestMain, and Go
                        // permits one per package. Synthesising a second does not
                        // fail to measure, it fails to build -- so this is scanned
                        // for rather than parsed for, which is the one question
                        // that cannot go unanswered.
                        declares_test_main |= built && declares_test_main_textually(&source);
                        continue;
                    }
                };
            declares_test_main |= built && file.declares_test_main;
            for test in &file.tests {
                declared_in.insert(test.clone(), relative.clone());
            }
            unattributed.extend(file.unattributed.iter().cloned());
            if !file.edits.is_empty() {
                write(
                    &path,
                    &rewrite(&source, &file.edits).replace(RUNTIME_IMPORT, import_for(relative)),
                )?;
            }
        }
        let Some(package) = harness_package else {
            continue;
        };
        write(
            &workspace.join(&directory).join(HARNESS_FILE),
            &synthesized_harness(
                &package,
                RUNTIME_ALIAS,
                import_for(&format!("{directory}/x.go")),
                probe_count,
                &project.decision_widths,
                &evidence_literal,
                declares_test_main,
            ),
        )?;
        packages.push(GoTestPackage {
            directory,
            evidence,
            declared_in,
            unattributed,
        });
    }
    Ok(InstrumentedWorkspace {
        project,
        packages,
        unparseable_tests,
    })
}

/// Whether the toolchain will refuse to build this file whatever it is asked.
///
/// Build constraints in general cannot be answered without knowing the GOOS,
/// GOARCH and tags a build will use, and guessing at them would drop files a
/// run does measure. `ignore` needs none of that: it is not a GOOS, not a
/// GOARCH, and nothing defines it, which is exactly why it is the convention
/// for Go kept beside Go without being compiled -- a reference harness, a
/// generator's input. So it is the one constraint that can be read alone, and
/// the only one that is.
fn build_ignored(source: &str) -> bool {
    // Constraints live above the package clause and nowhere else: the
    // toolchain stops reading them there, so a `//go:build ignore` in a
    // comment further down is text about Go rather than a constraint on it.
    let header = if source.starts_with("package ") {
        // Nothing precedes a clause on the first line, and looking for a
        // newline before it would find none and read the whole file.
        ""
    } else {
        source
            .find("\npackage ")
            .map_or(source, |clause| &source[..clause])
    };
    header
        .lines()
        .map(str::trim)
        .filter_map(|line| {
            line.strip_prefix("//go:build")
                // The spelling Go used before 1.17, still in trees today.
                .or_else(|| line.strip_prefix("// +build"))
        })
        .any(|constraint| {
            constraint
                .split(|c: char| !(c.is_alphanumeric() || c == '_'))
                .any(|term| term == "ignore")
        })
}

/// Whether a file declares `TestMain`, read from the text rather than a tree.
///
/// Only ever asked of a file that did not parse, which is exactly when there
/// is no tree to ask. It errs towards seeing one: believing in a `TestMain`
/// that is not there costs the package Supercov's own harness, while missing
/// one that is there declares it twice and the package stops compiling.
fn declares_test_main_textually(source: &str) -> bool {
    source.split("func TestMain").skip(1).any(|rest| {
        rest.trim_start()
            .strip_prefix('(')
            .is_some_and(|arguments| arguments.contains("testing.M"))
    })
}

/// `go test` caches a package that passed, and a cached package does not run.
/// The command with Go's test parallelism turned down to one.
///
/// `-parallel` bounds how many tests calling `t.Parallel()` run at once. At 1
/// they resume one at a time, so each is the only test running when its probes
/// fire and the harness can announce it like any serial test.
fn command_run_in_order(command: &[String]) -> (Vec<String>, bool) {
    if command
        .iter()
        .any(|argument| argument == "-parallel" || argument.starts_with("-parallel="))
    {
        // The author already said what they wanted; saying it louder is not
        // Supercov's call.
        return (command.to_vec(), false);
    }
    let mut updated = command.to_vec();
    let position = updated
        .iter()
        .position(|argument| argument == "test")
        .map_or(updated.len(), |index| index + 1);
    updated.insert(position, "-parallel=1".into());
    (updated, true)
}

fn command_with_fresh_results(command: &[String]) -> (Vec<String>, bool) {
    if command
        .iter()
        .any(|argument| argument == "-count" || argument.starts_with("-count="))
    {
        return (command.to_vec(), false);
    }
    let mut updated = command.to_vec();
    // After the subcommand, so `go -count=1 test` is never produced.
    let position = updated
        .iter()
        .position(|argument| argument == "test")
        .map_or(updated.len(), |index| index + 1);
    updated.insert(position, "-count=1".into());
    (updated, true)
}

/// The fingerprint a later query compares against the stored run.
pub fn current_go_integrity(
    root: &Path,
    command: &[String],
    source_roots: Option<&[String]>,
) -> Result<crate::run_store::RunIntegrity, String> {
    let root = canonicalize_simplified(root).map_err(|error| error.to_string())?;
    let files = crate::go_project::discover_go_files(&root)?;
    let mut inputs = go_integrity_inputs(&files, command);
    crate::source_discovery::fold_roots_into_configuration(
        &mut inputs.execution_configuration,
        source_roots,
    );
    create_explicit_run_integrity(&root, &inputs, &FrontendIntegrityInputs::embedded_go())
        .map_err(|error| error.to_string())
}

pub fn run_direct_go(
    request: &DirectGoRunRequest,
    diagnostics: &mut dyn Write,
) -> Result<DirectGoRunResult, String> {
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
        let files = crate::go_project::discover_go_files(&root)?;
        let source_roots = crate::source_discovery::configured_source_roots(
            &std::env::vars().collect::<std::collections::BTreeMap<_, _>>(),
        );
        let mut integrity_inputs = go_integrity_inputs(&files, &request.command);
        crate::source_discovery::fold_roots_into_configuration(
            &mut integrity_inputs.execution_configuration,
            source_roots.as_deref(),
        );
        let assertion_inputs =
            crate::assertion_inputs::capture(&root, "go", integrity_inputs.assertion_paths())?;
        let integrity = create_explicit_run_integrity(
            &root,
            &integrity_inputs,
            &FrontendIntegrityInputs::embedded_go(),
        )
        .map_err(|error| error.to_string())?;

        let workspace_started = Instant::now();
        recover_cached_workspace(&root, &lock).map_err(|error| error.to_string())?;
        let workspace =
            prepare_cached_workspace(&root, &lock, &[]).map_err(|error| error.to_string())?;
        let evidence_directory = work_directory.join("go/evidence");
        fs::create_dir_all(&evidence_directory).map_err(|error| error.to_string())?;
        // Decided before instrumenting, because whether a parallel test can be
        // announced depends on whether anything will be running beside it.
        let (command, serialised) = if request.exact_attribution {
            command_run_in_order(&request.command)
        } else {
            (request.command.clone(), false)
        };
        let ambient = std::env::vars().collect::<std::collections::BTreeMap<_, _>>();
        let roots = crate::source_discovery::ExplicitSourceRoots::from_environment_in(
            &root, &workspace, &ambient,
        )
        .map_err(|error| error.to_string())?;
        let instrumented =
            instrument_workspace(&workspace, &evidence_directory, serialised, roots.as_ref())?;
        let workspace_preparation_ms = elapsed_ms(workspace_started);
        let adapter_setup_ms = (elapsed_ms(adapter_started) - workspace_preparation_ms).max(0.0);
        writeln!(
            diagnostics,
            "[supercov] detected Go; instrumenting {} source file(s) across {} test package(s) in isolated workspace {}",
            instrumented.project.instrumented.len(),
            instrumented.packages.len(),
            workspace.display()
        )
        .map_err(|error| error.to_string())?;
        for (file, reason) in &instrumented.project.unparseable {
            writeln!(
                diagnostics,
                "[supercov] could not parse {file}: {reason}; it carries no obligations"
            )
            .map_err(|error| error.to_string())?;
        }
        for (file, reason) in &instrumented.unparseable_tests {
            writeln!(
                diagnostics,
                "[supercov] could not parse {file}: {reason}; the tests it declares run unattributed and what they reach counts run-wide"
            )
            .map_err(|error| error.to_string())?;
        }
        if instrumented.packages.is_empty() {
            return Err(
                "no Go test packages were found, so a run would measure nothing: Supercov needs at least one _test.go file"
                    .into(),
            );
        }
        // A file that does not parse is a hole in the denominator, and one
        // hole is reported and measured around. Every file being a hole is not
        // a hole: there is no denominator left, and a run of nothing satisfies
        // every floor there is. Reporting that as success with exit 0 is the
        // failure mode most likely to go unnoticed, so it is refused here the
        // same way a project with no test package is.
        if instrumented.project.instrumented.is_empty()
            && !instrumented.project.files.sources.is_empty()
        {
            return Err(format!(
                "none of the {} Go source file(s) could be parsed, so the run would measure a denominator of nothing: {}",
                instrumented.project.files.sources.len(),
                instrumented
                    .project
                    .unparseable
                    .iter()
                    .map(|(file, reason)| format!("{file}: {reason}"))
                    .collect::<Vec<_>>()
                    .join("; ")
            ));
        }

        if serialised {
            writeln!(
                diagnostics,
                "[supercov] added -parallel=1 for --exact-attribution: a test that calls t.Parallel() can only be credited with what it reached when nothing else is running. Your suite runs in order, which is slower."
            )
            .map_err(|error| error.to_string())?;
        }
        let (command, forced_fresh) = command_with_fresh_results(&command);
        if forced_fresh {
            writeln!(
                diagnostics,
                "[supercov] added -count=1: `go test` caches passing packages, and a cached package does not run, so it would record no coverage"
            )
            .map_err(|error| error.to_string())?;
        }
        let test_started = Instant::now();
        let plan = ExecutionPlan {
            preparation: Vec::new(),
            test: ExecutionPhase {
                name: "test".into(),
                kind: PhaseKind::Test,
                command: CommandSpec {
                    program: command[0].clone().into(),
                    arguments: command[1..].iter().map(OsString::from).collect(),
                    cwd: workspace.clone(),
                    environment: None,
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
        let exit_code = execution.exit_code;

        let publication_started = Instant::now();
        let mut parts = Vec::new();
        let mut outcomes = Vec::new();
        let mut silent = Vec::new();
        for package in &instrumented.packages {
            let Ok(bytes) = fs::read(&package.evidence) else {
                silent.push(package.directory.clone());
                continue;
            };
            let evidence = read_evidence(&bytes)
                .map_err(|error| format!("{}: {error}", package.evidence.display()))?;
            for test in &evidence.tests {
                outcomes.push(OwnedTestOutcome {
                    name: test.name.clone(),
                    runner: test.runner.clone(),
                    package: package.directory.clone(),
                    file: package.declared_in.get(&test.name).cloned(),
                    status: test.status.clone(),
                    attributed: !test.unattributed,
                });
            }
            parts.push(evidence);
        }
        if !silent.is_empty() {
            writeln!(
                diagnostics,
                "[supercov] {} test package(s) wrote no evidence and are absent from this run: {}",
                silent.len(),
                silent.join(", ")
            )
            .map_err(|error| error.to_string())?;
        }
        let evidence = merge_evidence(parts);
        let unattributed = instrumented
            .packages
            .iter()
            .map(|package| package.unattributed.len())
            .sum::<usize>();
        // What the run reached, whether or not a test can be named for it. A
        // package whose every test calls `t.Parallel()` announces nothing by
        // design -- the coverage is real and simply has no owner -- and
        // discarding the run there threw away the lines, branches and MC/DC of
        // a fully measured suite. `t.Parallel()` is idiomatic Go: one reported
        // codebase calls it in 935 of its 1144 test files.
        let reached_something = evidence.global.iter().any(|total| *total != 0);
        if outcomes.is_empty() && !reached_something {
            let because = if unattributed > 0 {
                format!(
                    "; {unattributed} test(s) ran without being able to announce themselves (t.Parallel, Example or Fuzz) and reached nothing measured either"
                )
            } else {
                String::new()
            };
            return Err(format!(
                "no Go test recorded evidence (the command exited {exit_code}); a run that measured nothing is not published{because}"
            ));
        }
        measured.set(true);
        let run = build_frontend_run(OwnedRunInputs {
            declaration: go_declaration(),
            environment: "go",
            manifest: &instrumented.project.manifest,
            probes: &instrumented.project.probes,
            evidence: &evidence,
            outcomes: &outcomes,
            run_id: &request.run_id,
            generated_at: &request.started_at,
            test_exit_code: exit_code,
            coverage_model: go_coverage_model(),
        })
        .map_err(|error| error.to_string())?;
        // Before anything is written: a run that cannot be read back is not a
        // run, and finding that out at publication is far better than finding
        // it out when someone asks for the report.
        validate_frontend_report_request(&run.declaration, &run.request)
            .map_err(|error| error.to_string())?;
        let archive_path = work_directory.join("evidence.raw.gz");
        let raw = write_archive(
            crate::assertion_inputs::append(
                run.archive_entries().map_err(|error| error.to_string())?,
                &assertion_inputs,
            )?,
            &archive_path,
        )
        .map_err(|error| error.to_string())?;
        let evidence_publication_ms = elapsed_ms(publication_started);

        let timings = RunTimings {
            initialization_ms,
            workspace_preparation_ms,
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
            test_exit_code: Some(exit_code),
            integrity,
            raw_evidence: RawEvidenceMetadata {
                schema_version: raw.schema_version,
                format: raw.format.into(),
                file: raw.file.into(),
                files: raw.files,
                uncompressed_bytes: raw.uncompressed_bytes,
                compressed_bytes: raw.compressed_bytes,
            },
            isolated_build: Some(true),
            instrumented_build_cache: None,
            timings: Some(timings),
            merged: None,
            parents: None,
            source_roots: source_roots.clone(),
        };
        let run_directory =
            publish_run(&root, &metadata, &archive_path).map_err(|error| error.to_string())?;
        finalize_published_run(&root, &request.run_id).map_err(|error| error.to_string())?;
        Ok(DirectGoRunResult {
            run_id: request.run_id.clone(),
            run_directory,
            exit_code,
            tests: outcomes
                .iter()
                .map(|outcome| outcome.name.as_str())
                .collect::<BTreeSet<_>>()
                .len(),
            unattributed,
            source_files: instrumented.project.instrumented.len(),
            unparseable_sources: instrumented.project.unparseable.len(),
            unparseable_tests: instrumented.unparseable_tests.len(),
            packages: instrumented.packages.len(),
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
            &work_directory.join("go/evidence"),
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_package_clause_is_found_past_whatever_precedes_it() {
        // A build tag, a licence header, a block comment: all of them sit
        // above the clause in real Go, and a reader that took the first line
        // would find none of them.
        assert_eq!(package_name("package main\n").as_deref(), Some("main"));
        assert_eq!(
            package_name("//go:build linux\n\n// Copyright.\npackage worker\n").as_deref(),
            Some("worker")
        );
        assert_eq!(
            package_name("/*\nA package comment\nspanning lines.\n*/\npackage doc\n").as_deref(),
            Some("doc")
        );
        assert_eq!(
            package_name("/* one line */ package inline\n").as_deref(),
            Some("inline")
        );
        // A trailing comment is not part of the name.
        assert_eq!(
            package_name("package api // the public surface\n").as_deref(),
            Some("api")
        );
        assert_eq!(package_name("import \"fmt\"\n"), None);
    }

    #[test]
    fn caching_is_disabled_unless_the_author_already_chose() {
        // `go test` skips a package whose result it has cached, and a package
        // that does not run records nothing. A run that measured half a suite
        // without saying so would be worse than a slow one.
        let (command, forced) =
            command_with_fresh_results(&["go".into(), "test".into(), "./...".into()]);
        assert!(forced);
        assert_eq!(command, ["go", "test", "-count=1", "./..."]);

        // An author who already said how many times to run means it.
        let (command, forced) =
            command_with_fresh_results(&["go".into(), "test".into(), "-count=3".into()]);
        assert!(!forced);
        assert_eq!(command, ["go", "test", "-count=3"]);
    }

    #[test]
    fn each_package_gets_an_evidence_file_of_its_own() {
        // One test binary per package, each its own process: sharing a path
        // would mean the last one to finish overwrote everyone else.
        assert_ne!(evidence_name("internal/auth"), evidence_name("internal/db"));
        assert_eq!(evidence_name("."), "_.bin");
        assert!(!evidence_name("internal/auth").contains('/'));
    }

    #[test]
    fn only_the_constraint_nothing_ever_defines_is_read_alone() {
        // `ignore` is not a GOOS, not a GOARCH, and nothing sets it, which is
        // why it is the convention for Go kept beside Go without being
        // compiled. Every other constraint needs a GOOS, a GOARCH and a tag
        // set to answer, and guessing at those would drop files a run does
        // measure.
        assert!(build_ignored("//go:build ignore\n\npackage p\n"));
        assert!(build_ignored("// +build ignore\n\npackage p\n"));
        assert!(build_ignored(
            "// Copyright.\n\n//go:build ignore\n\npackage p\n"
        ));
        // Constraints combine, and one of the terms is still the term.
        assert!(build_ignored("//go:build ignore || linux\n\npackage p\n"));

        // Everything else is a question this cannot answer, so it does not.
        assert!(!build_ignored("//go:build linux\n\npackage p\n"));
        assert!(!build_ignored("//go:build !windows\n\npackage p\n"));
        assert!(!build_ignored("package p\n"));
        // A tag that merely starts with the word is a different tag.
        assert!(!build_ignored("//go:build ignored\n\npackage p\n"));
        assert!(!build_ignored("//go:build ignore_me\n\npackage p\n"));
        // And a constraint has to be above the package clause to be one. The
        // toolchain ignores the text below it, so reading it there would drop
        // a file the build takes.
        assert!(!build_ignored(
            "package p\n\n//go:build ignore\n\nfunc f() {}\n"
        ));
        assert!(!build_ignored(
            "package p\n\nvar doc = \"//go:build ignore\"\n"
        ));
    }

    #[test]
    fn a_test_main_is_seen_in_a_file_nothing_could_parse() {
        // Only ever asked of a file that did not parse, which is exactly when
        // there is no tree to ask. Missing a real one declares a second
        // TestMain and the package stops compiling, so this errs towards
        // seeing one -- but not so far that any mention of the word counts.
        assert!(declares_test_main_textually(
            "package p\n\nfunc TestMain(m *testing.M) {\n\tos.Exit(m.Run())\n}\n"
        ));
        // Spacing is the author's business.
        assert!(declares_test_main_textually(
            "package p\n\nfunc TestMain( m  *testing.M ) {}\n"
        ));
        assert!(declares_test_main_textually(
            "package p\n\nfunc TestMain(m *testing.M) { broken( }\n"
        ));

        // `TestMainHelper` is an ordinary function whose name starts with the
        // word, exactly as `Testify` is not a test.
        assert!(!declares_test_main_textually(
            "package p\n\nfunc TestMainHelper(t *testing.T) {}\n"
        ));
        // A test that merely takes a *testing.T is not the package's harness.
        assert!(!declares_test_main_textually(
            "package p\n\nfunc TestMain(t *testing.T) {}\n"
        ));
        assert!(!declares_test_main_textually(
            "package p\n\n// func TestMain\n"
        ));
        assert!(!declares_test_main_textually("package p\n"));
    }
}
