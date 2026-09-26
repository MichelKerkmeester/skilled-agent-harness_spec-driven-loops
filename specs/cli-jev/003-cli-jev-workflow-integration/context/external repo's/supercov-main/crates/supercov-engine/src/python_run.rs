//! Public Python coverage run lifecycle.
//!
//! The project runs in place with its own interpreter, environment and test
//! command. Supercov prepares the complete obligation manifest and probe plan
//! from source, materialises its stdlib-only runtime under `.supercov/`,
//! points the interpreter at it through environment variables, supervises the
//! user's command unchanged, and publishes the joined evidence.

use std::{
    collections::BTreeMap,
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
        Archived, ProjectLock, finalize_published_run, note_kept_evidence, publish_archived_run,
        recover_abandoned_runs, remove_stored_tree_deferred,
    },
    orchestration::{ExecutionPhase, ExecutionPlan, PhaseKind, execute_plan},
    process_supervision::{CommandSpec, SupervisionOptions},
    python_evidence::{PythonAssertionInventory, PythonFrontendRun, build_python_frontend_run},
    python_project::{PreparedPythonProject, prepare_python_project, python_integrity_inputs},
    run_store::{RawEvidenceMetadata, RunMetadata, RunTimings},
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectPythonRunRequest {
    pub root: PathBuf,
    pub command: Vec<String>,
    pub run_id: String,
    pub started_at: String,
}

#[derive(Debug, Clone, PartialEq)]
pub struct DirectPythonRunResult {
    pub run_id: String,
    pub run_directory: PathBuf,
    pub exit_code: i32,
    pub tests: usize,
    pub source_files: usize,
    pub interpreters: usize,
    pub python_versions: Vec<String>,
    pub recovered_runs: Vec<String>,
    pub metadata: RunMetadata,
}

fn elapsed_ms(started: Instant) -> f64 {
    (started.elapsed().as_secs_f64() * 10_000.0).round() / 10.0
}

fn embedded_runtime_files() -> [(&'static str, &'static [u8]); 6] {
    [
        (
            "sitecustomize.py",
            include_bytes!("../runtime-assets/python/sitecustomize.py"),
        ),
        (
            "supercov_runtime.py",
            include_bytes!("../runtime-assets/python/supercov_runtime.py"),
        ),
        (
            "supercov_pytest.py",
            include_bytes!("../runtime-assets/python/supercov_pytest.py"),
        ),
        (
            "supercov_unittest.py",
            include_bytes!("../runtime-assets/python/supercov_unittest.py"),
        ),
        (
            "supercov_probes.py",
            include_bytes!("../runtime-assets/python/supercov_probes.py"),
        ),
        (
            "supercov_instrument.py",
            include_bytes!("../runtime-assets/python/supercov_instrument.py"),
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

fn prepend_path_list(existing: Option<OsString>, entry: &Path) -> OsString {
    let mut value = entry.as_os_str().to_owned();
    if let Some(existing) = existing.filter(|existing| !existing.is_empty()) {
        value.push(if cfg!(windows) { ";" } else { ":" });
        value.push(existing);
    }
    value
}

fn append_list(existing: Option<OsString>, entry: &str, separator: &str) -> OsString {
    match existing.filter(|existing| !existing.is_empty()) {
        Some(existing) => {
            let mut value = existing;
            value.push(separator);
            value.push(entry);
            value
        }
        None => entry.into(),
    }
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
    let python_path = prepend_path_list(take("PYTHONPATH"), runtime_directory);
    let pytest_plugins = append_list(take("PYTEST_PLUGINS"), "supercov_pytest", ",");
    // Supercov no longer turns on pytest's assertion-pass hook. Assertion
    // sites come from line events on the lines the plan names, and the hook
    // made pytest build a failure explanation for every passing assertion --
    // 30 microseconds each on two integers, 140 on a nested dict, more than
    // everything else the runtime does put together. A user's own
    // `PYTEST_ADDOPTS` passes through untouched; if it enables the hook, the
    // plugin still records what the hook reports.
    let pytest_addopts = take("PYTEST_ADDOPTS").unwrap_or_default();
    for key in [
        "SUPERCOV_PYTHON_PLAN",
        "SUPERCOV_PYTHON_EVIDENCE_DIR",
        "SUPERCOV_RUN_ID",
        "SUPERCOV_PROJECT_ROOT",
        "SUPERCOV_CONTEXT",
        "SUPERCOV_PYTHON_WORKER",
    ] {
        take(key);
    }
    variables.extend([
        ("PYTHONPATH".into(), python_path),
        ("PYTEST_PLUGINS".into(), pytest_plugins),
        ("PYTEST_ADDOPTS".into(), pytest_addopts),
        (
            "SUPERCOV_PYTHON_PLAN".into(),
            plan_path.as_os_str().to_owned(),
        ),
        (
            "SUPERCOV_PYTHON_EVIDENCE_DIR".into(),
            evidence_directory.as_os_str().to_owned(),
        ),
        ("SUPERCOV_RUN_ID".into(), run_id.into()),
        ("SUPERCOV_PROJECT_ROOT".into(), root.as_os_str().to_owned()),
    ]);
    variables
}

/// The fingerprint a later query compares against the stored run: the same
/// discovery and inputs the run used, without preparing a plan.
pub fn current_python_integrity(
    root: &Path,
    command: &[String],
    source_roots: Option<&[String]>,
) -> Result<crate::run_store::RunIntegrity, String> {
    let root = canonicalize_simplified(root).map_err(|error| error.to_string())?;
    let mut files = crate::python_project::discover_python_files(&root)?;
    // The roots the run was measured under, not this shell's: the run
    // digested the files they kept, and nothing else would match it.
    if let Some(configured) = source_roots.filter(|roots| !roots.is_empty()) {
        crate::source_discovery::ExplicitSourceRoots::resolve(&root, configured)
            .map_err(|error| error.to_string())?
            .narrow(&mut files.sources, &mut files.excluded, String::as_str);
    }
    let mut inputs = python_integrity_inputs(&files, command);
    crate::source_discovery::fold_roots_into_configuration(
        &mut inputs.execution_configuration,
        source_roots,
    );
    create_explicit_run_integrity(&root, &inputs, &FrontendIntegrityInputs::embedded_python())
        .map_err(|error| error.to_string())
}

/// The lines of each test file that hold an inventoried assertion site, for
/// the plan. Sorted and deduplicated: a line with two sites is one line to
/// arm, and the report keeps telling the two apart by column.
fn assertion_sites(
    inventory: &[crate::assertion_map::InventorySite],
) -> BTreeMap<String, Vec<usize>> {
    let mut sites = BTreeMap::<String, Vec<usize>>::new();
    for site in inventory {
        sites
            .entry(site.at.file.clone())
            .or_default()
            .push(site.at.line);
    }
    for lines in sites.values_mut() {
        lines.sort_unstable();
        lines.dedup();
    }
    sites
}

pub fn run_direct_python(
    request: &DirectPythonRunRequest,
    diagnostics: &mut dyn Write,
) -> Result<DirectPythonRunResult, String> {
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
        let project: PreparedPythonProject = prepare_python_project(&root, roots.as_ref())?;
        let source_roots = crate::source_discovery::configured_source_roots(
            &std::env::vars().collect::<std::collections::BTreeMap<_, _>>(),
        );
        let mut integrity_inputs = python_integrity_inputs(&project.files, &request.command);
        crate::source_discovery::fold_roots_into_configuration(
            &mut integrity_inputs.execution_configuration,
            source_roots.as_deref(),
        );
        let integrity = create_explicit_run_integrity(
            &root,
            &integrity_inputs,
            &FrontendIntegrityInputs::embedded_python(),
        )
        .map_err(|error| error.to_string())?;
        let assertion_inputs = crate::assertion_inputs::capture(
            &root,
            "python",
            python_integrity_inputs(&project.files, &request.command).assertion_paths(),
        )?;
        let python_directory = work_directory.join("python");
        let runtime_directory = python_directory.join("runtime");
        let evidence_directory = python_directory.join("evidence");
        let plan_path = python_directory.join("plan.json");
        write_runtime(&runtime_directory)?;
        fs::create_dir_all(&evidence_directory).map_err(|error| error.to_string())?;
        let plan = crate::python_instrumenter::PythonProbePlan {
            assertion_sites: assertion_sites(&assertion_inputs.assertions),
            ..project.plan.clone()
        };
        fs::write(
            &plan_path,
            serde_json::to_vec(&plan).map_err(|error| error.to_string())?,
        )
        .map_err(|error| format!("{}: {error}", plan_path.display()))?;
        writeln!(
            diagnostics,
            "[supercov] detected Python; measuring {} source file(s) in place through probes compiled at import",
            project.plan.files.len(),
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

        let publication_started = Instant::now();
        let verbose = std::env::var("SUPERCOV_VERBOSE")
            .or_else(|_| std::env::var("SUPERCOV_DEBUG"))
            .is_ok_and(|value| matches!(value.as_str(), "1" | "true" | "yes"));
        measured.set(true);
        let mut run: PythonFrontendRun = match build_python_frontend_run(
            &project.manifest,
            &evidence_directory,
            &request.run_id,
            &request.started_at,
            execution.exit_code,
            &PythonAssertionInventory::new(&root, &assertion_inputs),
        ) {
            // No test reported an outcome and the command itself failed: it
            // never ran its tests (`No module named pytest`, an error while
            // collecting). That is the command's failure, said in its own
            // output, not a Supercov bug to report with evidence.
            Err(
                crate::python_evidence::PythonEvidenceError::NoTests
                | crate::python_evidence::PythonEvidenceError::NoInterpreter,
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
        let joined_ms = elapsed_ms(publication_started);
        let archive_path = work_directory.join("evidence.raw.gz");
        // Analysed as the archive will analyse -- the request it archives,
        // with the run's integrity record, which the archive does not hold
        // -- while it is written: neither waits on the other.
        run.request.integrity = serde_json::to_value(&integrity).ok();
        let (archived, analysed) = std::thread::scope(|scope| {
            let analysis = scope.spawn(|| {
                crate::coverage_report::analyze_frontend_request(
                    &run.declaration,
                    &run.request,
                    crate::coverage_report::TransportStats::none(),
                )
            });
            let archived = (|| {
                let entries = run.archive_entries().map_err(|error| error.to_string())?;
                let serialized_ms = elapsed_ms(publication_started) - joined_ms;
                let entries = crate::assertion_inputs::append(entries, &assertion_inputs)?;
                let raw =
                    write_archive(entries, &archive_path).map_err(|error| error.to_string())?;
                let archive_ms = elapsed_ms(publication_started) - joined_ms - serialized_ms;
                Ok::<_, String>((raw, serialized_ms, archive_ms))
            })();
            let analysed = analysis
                .join()
                .unwrap_or_else(|panic| std::panic::resume_unwind(panic));
            (archived, analysed)
        });
        let analysis_ms = elapsed_ms(publication_started) - joined_ms;
        let (raw, serialized_ms, archive_ms) = archived?;
        // The joined evidence is in the archive now, and publication reads it
        // from there. Held to the end for three counts, it was the largest
        // thing alive while publication analysed the archive: 1.4 GB on a
        // 3,900-test run, on top of the analysis's own.
        let (tests, interpreters, python_versions) =
            (run.tests, run.interpreters, run.python_versions.clone());
        if verbose {
            writeln!(
                diagnostics,
                "[supercov] python evidence: join={joined_ms}ms serialize={serialized_ms}ms archive={archive_ms}ms analysis={analysis_ms}ms (beside the archive)"
            )
            .map_err(|error| error.to_string())?;
        }
        if std::env::var("SUPERCOV_KEEP_WORK").is_ok_and(|value| !value.is_empty()) {
            let debug_directory = root.join(".supercov/python-debug").join(&request.run_id);
            fs::create_dir_all(&debug_directory).map_err(|error| error.to_string())?;
            copy_tree(&python_directory, &debug_directory)?;
        }
        remove_stored_tree_deferred(&root, &python_directory).map_err(|error| error.to_string())?;
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
        drop(run);
        let run_directory = publish_archived_run(
            &root,
            &metadata,
            &archive_path,
            Archived {
                report: analysed.ok(),
                inputs: Some(assertion_inputs.manifest()),
            },
        )
        .map_err(|error| error.to_string())?;
        finalize_published_run(&root, &request.run_id).map_err(|error| error.to_string())?;
        Ok(DirectPythonRunResult {
            run_id: request.run_id.clone(),
            run_directory,
            exit_code: execution.exit_code,
            tests,
            source_files: project.plan.files.len(),
            interpreters,
            python_versions,
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
            &work_directory.join("python/evidence"),
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

    // The plan names each test file's assertion lines from the inventory, so
    // the runtime can record a site from the line event that runs it and
    // pytest's assertion-pass hook -- a failure explanation built for every
    // passing assertion -- stays off.
    #[test]
    fn the_plan_names_each_test_files_assertion_lines_once_and_sorted() {
        use crate::assertion_map::{Anchor, InventorySite};
        let site = |file: &str, line: usize, column: usize| InventorySite {
            at: Anchor {
                file: file.into(),
                line,
                column,
                text: String::new(),
            },
            operation: "assert".into(),
        };
        let inventory = vec![
            site("tests/test_b.py", 9, 4),
            site("tests/test_a.py", 12, 4),
            // Two sites on one line are one line to arm.
            site("tests/test_a.py", 12, 30),
            site("tests/test_a.py", 3, 4),
        ];
        let sites = assertion_sites(&inventory);
        assert_eq!(
            sites,
            BTreeMap::from([
                ("tests/test_a.py".to_string(), vec![3, 12]),
                ("tests/test_b.py".to_string(), vec![9]),
            ])
        );

        // Serialized under the key the runtime reads, and absent -- not an
        // empty object -- when there is nothing to arm.
        let plan = crate::python_instrumenter::PythonProbePlan {
            version: 1,
            root: "/p".into(),
            files: BTreeMap::new(),
            assertion_sites: sites,
        };
        let json = serde_json::to_string(&plan).unwrap();
        assert!(
            json.contains("\"assertionSites\":{\"tests/test_a.py\":[3,12]"),
            "{json}"
        );
        let empty = crate::python_instrumenter::PythonProbePlan {
            assertion_sites: BTreeMap::new(),
            ..plan
        };
        assert!(
            !serde_json::to_string(&empty)
                .unwrap()
                .contains("assertionSites")
        );
    }
    use super::*;
    use crate::source_discovery::{ExplicitSourceRoots, fold_roots_into_configuration};

    fn fixture(name: &str) -> PathBuf {
        static UNIQUE: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
        let root = std::env::temp_dir().join(format!(
            "supercov-python-run-{}-{}-{name}",
            std::process::id(),
            UNIQUE.fetch_add(1, std::sync::atomic::Ordering::Relaxed)
        ));
        let _ = fs::remove_dir_all(&root);
        for (file, contents) in [
            ("a.py", "def f(x):\n    return x if x else 0\n"),
            ("vendor/pkg/b.py", "def g():\n    return 1\n"),
            ("test/test_a.py", "from a import f\n"),
        ] {
            let path = root.join(file);
            fs::create_dir_all(path.parent().unwrap()).unwrap();
            fs::write(path, contents).unwrap();
        }
        canonicalize_simplified(&root).unwrap()
    }

    #[test]
    fn a_rooted_run_is_current_whatever_shell_asks() {
        // A run recorded under roots digested only the files they kept, while
        // the query that later judged it rediscovered every file: the two could
        // never agree, and each rooted run read as stale the moment it was
        // written. The query has to replay the roots the run recorded, because
        // the shell it runs in is usually not the one the run came from.
        let root = fixture("current");
        let configured = vec!["a.py".to_owned()];
        let command = vec!["python".to_owned(), "-m".to_owned(), "unittest".to_owned()];

        let roots = ExplicitSourceRoots::resolve(&root, &configured).unwrap();
        let project = crate::python_project::prepare_python_project(&root, Some(&roots)).unwrap();
        let mut inputs = python_integrity_inputs(&project.files, &command);
        fold_roots_into_configuration(&mut inputs.execution_configuration, Some(&configured));
        let recorded = create_explicit_run_integrity(
            &root,
            &inputs,
            &FrontendIntegrityInputs::embedded_python(),
        )
        .unwrap();

        let replayed = current_python_integrity(&root, &command, Some(&configured)).unwrap();
        assert_eq!(recorded.fingerprint, replayed.fingerprint);

        // Judged without the roots, it is a different run -- which is what the
        // query used to do.
        let ignoring = current_python_integrity(&root, &command, None).unwrap();
        assert_ne!(recorded.fingerprint, ignoring.fingerprint);

        // A change the roots left out is not a change to this run; one they
        // kept is.
        fs::write(root.join("vendor/pkg/b.py"), "def g():\n    return 2\n").unwrap();
        assert_eq!(
            current_python_integrity(&root, &command, Some(&configured))
                .unwrap()
                .fingerprint,
            recorded.fingerprint,
            "a vendored file changing does not make a rooted run stale"
        );
        fs::write(root.join("a.py"), "def f(x):\n    return 1\n").unwrap();
        assert_ne!(
            current_python_integrity(&root, &command, Some(&configured))
                .unwrap()
                .fingerprint,
            recorded.fingerprint,
            "a first-party file changing does"
        );
        fs::remove_dir_all(root).ok();
    }
}
