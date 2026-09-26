//! Rust-owned JavaScript execution for the public Supercov engine.

use std::{
    collections::BTreeMap,
    ffi::OsString,
    path::{Path, PathBuf},
    time::{Instant, SystemTime, UNIX_EPOCH},
};

use serde::{Deserialize, Serialize};
use supercov_contracts::{
    AttributionPrecision, ExecutionModel, FrontendAttribution, FrontendLimitation,
    FrontendLimitationScope, FrontendRunDeclaration, FrontendRunnerDeclaration,
    LANGUAGE_FRONTEND_PROTOCOL_VERSION, StructuralSource,
};

use crate::{
    build_cache::{build_cache_key, read_build_cache, reuse_paths, write_build_cache},
    coverage_report::{PersistedCoverageModel, RawTestResult, javascript_coverage_model},
    evidence_archive::{
        EvidenceArchiveEntry, EvidenceArchiveSource, collect_sources, write_archive,
    },
    integrity::{FrontendIntegrityInputs, create_run_integrity},
    javascript_frontend::{
        javascript_frontend_reuse_paths, load_cached_javascript_frontend,
        prepare_javascript_frontend, read_javascript_frontend_cache,
    },
    lifecycle::{
        ProjectLock, RunState, RunStateStatus, finalize_published_run, interrupt_run_state,
        publish_run, recover_abandoned_runs, remove_stored_tree_deferred, update_run_state,
        write_run_state,
    },
    orchestration::{
        ExecutionPhase, ExecutionPlan, OrchestrationError, PhaseKind, execute_plan_with_supervisor,
    },
    process_supervision::{
        CommandSpec, ForwardedSignal, ProcessSupervisor, SupervisionOptions, positive_milliseconds,
    },
    project_discovery::{BuildAdapter, discover_coverage_project},
    run_store::{
        InstrumentedBuildCache, RawEvidenceMetadata, RunIntegrity, RunMetadata, RunTimings,
    },
    workspace::{
        cached_workspace_path, prepare_cached_workspace, prune_cached_workspace_sources,
        sync_command_outputs, workspace_output_baseline,
    },
};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectJavascriptRunRequest {
    pub root: PathBuf,
    pub command: Vec<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub run_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub started_at: Option<String>,
    #[serde(skip)]
    pub watchdog_program: Option<PathBuf>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectJavascriptRunResult {
    pub run_id: String,
    pub run_directory: PathBuf,
    pub workspace: PathBuf,
    pub exit_code: i32,
    pub assertion_calls: usize,
    pub recovered_runs: Vec<String>,
    pub metadata: RunMetadata,
}

#[derive(Debug)]
pub enum DirectJavascriptRunError {
    Interrupted {
        signal: ForwardedSignal,
        exit_code: i32,
        timings: RunTimings,
        total_ms: f64,
    },
    Failed(String),
}

impl std::fmt::Display for DirectJavascriptRunError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Interrupted { signal, .. } => {
                write!(formatter, "interrupted by {}", signal_name(*signal))
            }
            Self::Failed(message) => formatter.write_str(message),
        }
    }
}

impl std::error::Error for DirectJavascriptRunError {}

impl From<String> for DirectJavascriptRunError {
    fn from(value: String) -> Self {
        Self::Failed(value)
    }
}

fn signal_name(signal: ForwardedSignal) -> &'static str {
    match signal {
        ForwardedSignal::Sighup => "SIGHUP",
        ForwardedSignal::Sigint => "SIGINT",
        ForwardedSignal::Sigterm => "SIGTERM",
    }
}

fn javascript_runner_declaration(
    runner: String,
    results: &[&RawTestResult],
) -> FrontendRunnerDeclaration {
    let has_observations = |raw: &&RawTestResult| {
        !raw.phases.is_empty()
            || !raw.server.is_empty()
            || raw.runtime.iter().chain(&raw.browser).any(|snapshot| {
                !snapshot.decisions.is_empty()
                    || !snapshot.hits.is_empty()
                    || !snapshot.events.is_empty()
            })
    };
    let exact_test = results.iter().all(|raw| {
        raw.test_id
            .as_deref()
            .is_some_and(|value| !value.is_empty())
            && raw
                .scope
                .as_ref()
                .is_none_or(|scope| raw.test_id.as_deref() == Some(scope.test_id.as_str()))
    });
    let exact_worker = results.iter().all(|raw| {
        !has_observations(raw)
            || raw
                .scope
                .as_ref()
                .is_some_and(|scope| !scope.worker_id.is_empty())
    });
    let exact_retry = results.iter().all(|raw| {
        raw.retry.is_some()
            && raw
                .scope
                .as_ref()
                .is_none_or(|scope| raw.retry == Some(scope.retry))
    });
    let contextual = !results.is_empty() && exact_test && exact_worker && exact_retry;
    let precision = |exact| {
        if exact {
            AttributionPrecision::Exact
        } else {
            AttributionPrecision::Unavailable
        }
    };
    let attribution = FrontendAttribution {
        run: AttributionPrecision::Exact,
        worker: precision(contextual),
        test: precision(contextual),
        retry: precision(contextual),
        phase: precision(contextual),
        action: precision(contextual),
        assertion: precision(contextual),
    };
    let mut limitations = Vec::new();
    if !contextual {
        for (suffix, scope) in [
            ("worker", FrontendLimitationScope::Worker),
            ("test", FrontendLimitationScope::Test),
            ("retry", FrontendLimitationScope::Retry),
            ("phase", FrontendLimitationScope::Phase),
            ("action", FrontendLimitationScope::Action),
            ("assertion", FrontendLimitationScope::Assertion),
        ] {
            limitations.push(FrontendLimitation {
                id: format!("{runner}-no-{suffix}").replace(':', "-"),
                scopes: vec![scope],
                reason: format!(
                    "Runner {runner} did not expose exact {suffix} identity for every result"
                ),
            });
        }
    }
    FrontendRunnerDeclaration {
        runner,
        execution_model: if contextual {
            ExecutionModel::ParallelContextPropagated
        } else {
            ExecutionModel::ParallelUnattributed
        },
        attribution,
        limitations,
    }
}

fn javascript_archive_entries(
    mut entries: Vec<EvidenceArchiveEntry>,
    manifest: &crate::javascript_frontend::JavascriptManifest,
    run_id: &str,
    exit_code: i32,
) -> Result<Vec<EvidenceArchiveEntry>, String> {
    let mut results = Vec::new();
    for entry in &entries {
        if entry.path == "mcdc.json" || entry.path.ends_with("/mcdc.json") {
            results.push(
                serde_json::from_slice::<RawTestResult>(&entry.contents)
                    .map_err(|error| format!("invalid {}: {error}", entry.path))?,
            );
        } else if entry.path == "mcdc.jsonl" || entry.path.ends_with(".mcdc.jsonl") {
            let contents = entry
                .contents
                .strip_suffix(b"\n")
                .ok_or_else(|| format!("{} does not end with a newline", entry.path))?;
            for (index, line) in contents.split(|byte| *byte == b'\n').enumerate() {
                if line.is_empty() {
                    return Err(format!(
                        "{} contains a blank record at line {}",
                        entry.path,
                        index + 1
                    ));
                }
                results.push(
                    serde_json::from_slice::<RawTestResult>(line).map_err(|error| {
                        format!(
                            "invalid {} record at line {}: {error}",
                            entry.path,
                            index + 1
                        )
                    })?,
                );
            }
        }
    }
    if results.is_empty() {
        let status = match exit_code {
            0 => "passed",
            supercov_contracts::COMMAND_TIMEOUT_EXIT_CODE => "timedOut",
            _ => "failed",
        };
        let command_result = RawTestResult {
            test_id: Some(format!("command:{run_id}")),
            scope: None,
            test: "Test command".into(),
            test_file: None,
            title: Some("Test command".into()),
            retry: Some(0),
            status: Some(status.into()),
            expected_status: None,
            flaky: false,
            provenance: crate::coverage_report::TestProvenance {
                runner: "command".into(),
                kind: "setup".into(),
                project: None,
                source: "engine".into(),
            },
            role: "setup".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: vec![],
            runtime: vec![],
            browser: vec![],
            server: vec![],
        };
        entries.push(EvidenceArchiveEntry {
            path: "results/command/mcdc.json".into(),
            contents: serde_json::to_vec(&command_result).map_err(|error| error.to_string())?,
        });
        results.push(command_result);
    }
    let mut by_runner = BTreeMap::<String, Vec<&RawTestResult>>::new();
    for result in &results {
        by_runner
            .entry(result.provenance.runner.clone())
            .or_default()
            .push(result);
    }
    if entries
        .iter()
        .any(|entry| entry.path.starts_with("server/background/") && entry.path.ends_with(".jsonl"))
    {
        by_runner.entry("background".into()).or_default();
    }
    let declaration = FrontendRunDeclaration {
        protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
        frontend_id: "javascript".into(),
        frontend_version: "javascript-owned-v1".into(),
        language: "javascript".into(),
        structural_source: StructuralSource::OwnedProbes,
        runners: by_runner
            .into_iter()
            .map(|(runner, results)| javascript_runner_declaration(runner, &results))
            .collect(),
        structural_limitations: manifest
            .limitations
            .iter()
            .map(|limitation| limitation.id.clone())
            .collect(),
    };
    entries.push(EvidenceArchiveEntry {
        path: "coverage-model.json".into(),
        contents: serde_json::to_vec(
            &PersistedCoverageModel::from_declaration(&javascript_coverage_model())
                .expect("JavaScript coverage model is contract-valid"),
        )
        .map_err(|error| error.to_string())?,
    });
    entries.push(EvidenceArchiveEntry {
        path: "frontend.json".into(),
        contents: serde_json::to_vec(&declaration).map_err(|error| error.to_string())?,
    });
    Ok(entries)
}

struct RunCleanup {
    root: PathBuf,
    run_id: String,
    started_at: String,
    lock: ProjectLock,
    workspace: Option<PathBuf>,
    state_written: bool,
    terminal_recorded: bool,
}

impl RunCleanup {
    fn lock(&self) -> &ProjectLock {
        &self.lock
    }

    fn set_workspace(&mut self, workspace: PathBuf) {
        self.workspace = Some(workspace);
    }

    fn mark_state_written(&mut self) {
        self.state_written = true;
    }

    fn mark_terminal(&mut self) {
        self.terminal_recorded = true;
    }
}

impl Drop for RunCleanup {
    fn drop(&mut self) {
        if self.state_written && !self.terminal_recorded {
            let _ = update_run_state(
                &self.root,
                &self.run_id,
                RunStateStatus::Failed,
                &self.started_at,
                Some("Rust run exited before reaching a terminal lifecycle state".into()),
            );
        }
        if let Some(workspace) = &self.workspace {
            let _ = remove_stored_tree_deferred(
                &self.root,
                &workspace.join(".supercov/evidence").join(&self.run_id),
            );
            let _ = remove_stored_tree_deferred(
                &self.root,
                &workspace
                    .join(".supercov/server-evidence")
                    .join(&self.run_id),
            );
            let keep_workspace =
                std::env::var("SUPERCOV_KEEP_WORKSPACE").is_ok_and(|value| !value.is_empty());
            if !keep_workspace {
                let _ = prune_cached_workspace_sources(&self.root, &self.lock);
            }
        }
        let _ = self.lock.release();
    }
}

fn now_nonce() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
}

fn elapsed_ms(started: Instant) -> f64 {
    started.elapsed().as_secs_f64() * 1000.0
}

fn rounded_millisecond(value: f64) -> f64 {
    (value * 10.0).round() / 10.0
}

fn supervision_options() -> Result<SupervisionOptions, String> {
    let defaults = SupervisionOptions::default();
    Ok(SupervisionOptions {
        diagnostic_interval: positive_milliseconds(
            std::env::var("SUPERCOV_DIAGNOSTIC_INTERVAL_MS")
                .ok()
                .as_deref(),
            "SUPERCOV_DIAGNOSTIC_INTERVAL_MS",
        )
        .map_err(|error| error.to_string())?
        .unwrap_or(defaults.diagnostic_interval),
        timeout: positive_milliseconds(
            std::env::var("SUPERCOV_COMMAND_TIMEOUT_MS").ok().as_deref(),
            "SUPERCOV_COMMAND_TIMEOUT_MS",
        )
        .map_err(|error| error.to_string())?,
        termination_grace: defaults.termination_grace,
    })
}

fn remove_derived_pnpm_config(environment: &mut BTreeMap<OsString, OsString>) {
    // `npx supercov` is itself launched by npm, which exports project `.npmrc`
    // keys as `npm_config_*`. pnpm-only keys then make every nested npm process
    // print a second set of "Unknown env config" warnings. They have no npm
    // semantics (npm 11 reports them as unknown), so do not leak those derived
    // environment aliases into the user's already-configured test command.
    const PNPM_ONLY_NPM_CONFIG: &[&str] = &[
        "npm_config_auto_install_peers",
        "npm_config_enable_pre_post_scripts",
        "npm_config_shamefully_hoist",
    ];
    environment.retain(|key, _| {
        let key = key.to_string_lossy().to_ascii_lowercase();
        !PNPM_ONLY_NPM_CONFIG.contains(&key.as_str())
    });
}

fn environment_with(values: BTreeMap<String, String>) -> Vec<(OsString, OsString)> {
    let mut environment = std::env::vars_os().collect::<BTreeMap<_, _>>();
    remove_derived_pnpm_config(&mut environment);
    for (key, value) in values {
        environment.retain(|existing, _| !existing.to_string_lossy().eq_ignore_ascii_case(&key));
        environment.insert(key.into(), value.into());
    }
    environment.into_iter().collect()
}

fn node_options(preload: &Path) -> String {
    // The register import must be ABSOLUTE: node resolves a relative
    // `--import` against each child process's OWN working directory, and
    // monorepo runners spawn tasks inside package directories. turbo running
    // `packages/react#build` resolved `.supercov/register.mjs` against
    // `packages/react/` and aborted every task with ERR_MODULE_NOT_FOUND.
    let preload = std::path::absolute(preload).unwrap_or_else(|_| preload.to_path_buf());
    // And it must be a URL, not a path: Node reads a bare `C:\...` as a URL
    // with scheme `c:` and refuses it, so on Windows the first Node child died
    // at startup and the suite reported only that its exit code was 1. The
    // JavaScript runtime already passes this import as a file URL; so does
    // this.
    [
        std::env::var("NODE_OPTIONS").ok(),
        Some("--enable-source-maps".into()),
        Some(format!("--import={}", crate::workspace::file_url(&preload))),
    ]
    .into_iter()
    .flatten()
    .filter(|value| !value.is_empty())
    .collect::<Vec<_>>()
    .join(" ")
}

/// Fingerprint the current JavaScript project using the same discovery and
/// runtime-shim inputs as a Rust-owned execution. Query callers deliberately
/// treat failure as "staleness unavailable", matching the frozen CLI contract.
pub fn current_javascript_integrity(
    root: &Path,
    command: &[String],
    source_roots: Option<&[String]>,
) -> Result<RunIntegrity, String> {
    let mut environment = std::env::vars().collect::<BTreeMap<_, _>>();
    // The roots the run was measured under, not this shell's. A run recorded
    // with the variable and queried from a shell without it discovered a
    // different scope and read as stale -- or, where automatic discovery found
    // nothing, stopped being checked at all.
    match source_roots.filter(|roots| !roots.is_empty()) {
        Some(roots) => {
            environment.insert(
                crate::source_discovery::SOURCE_ROOTS_VARIABLE.into(),
                roots.join(","),
            );
        }
        None => {
            environment.remove(crate::source_discovery::SOURCE_ROOTS_VARIABLE);
        }
    }
    let project = discover_coverage_project(root, &environment, command)
        .map_err(|error| error.to_string())?;
    javascript_integrity_for_project(root, &project)
}

fn javascript_integrity_for_project(
    root: &Path,
    project: &crate::project_discovery::CoverageProject,
) -> Result<RunIntegrity, String> {
    let frontend = FrontendIntegrityInputs::embedded_javascript();
    create_run_integrity(root, project, &frontend).map_err(|error| error.to_string())
}

/// Execute one JavaScript suite with every language-neutral stage owned by
/// Rust. Target-language runtime and runner adapters remain generated shims.
pub fn run_direct_javascript(
    request: &DirectJavascriptRunRequest,
    diagnostics: &mut dyn std::io::Write,
) -> Result<DirectJavascriptRunResult, DirectJavascriptRunError> {
    if request.command.is_empty() {
        return Err(DirectJavascriptRunError::Failed(
            "test command must not be empty".into(),
        ));
    }
    let total_started = Instant::now();
    let initialization_started = Instant::now();
    let root = crate::workspace::canonicalize_simplified(&request.root)
        .map_err(|error| format!("{}: {error}", request.root.display()))?;
    let nonce = now_nonce();
    let run_id = request
        .run_id
        .clone()
        .unwrap_or_else(|| format!("rust-{nonce}"));
    let started_at = request
        .started_at
        .clone()
        .unwrap_or_else(|| format!("unix-ms-{nonce}"));
    let lock =
        ProjectLock::acquire(&root, &run_id, &started_at).map_err(|error| error.to_string())?;
    let mut cleanup = RunCleanup {
        root: root.clone(),
        run_id: run_id.clone(),
        started_at: started_at.clone(),
        lock,
        workspace: None,
        state_written: false,
        terminal_recorded: false,
    };
    let recovered_runs =
        recover_abandoned_runs(&root, &started_at).map_err(|error| error.to_string())?;
    if !recovered_runs.is_empty() {
        writeln!(
            diagnostics,
            "[supercov] recovered abandoned run(s): {}",
            recovered_runs.join(", ")
        )
        .map_err(|error| error.to_string())?;
    }
    let environment = std::env::vars().collect::<BTreeMap<_, _>>();
    let source_roots = crate::source_discovery::configured_source_roots(&environment);
    let project = discover_coverage_project(&root, &environment, &request.command)
        .map_err(|error| error.to_string())?;
    let integrity = javascript_integrity_for_project(&root, &project)?;
    let assertion_inputs = crate::assertion_inputs::capture_with_expect_modules(
        &root,
        "javascript",
        crate::integrity::javascript_assertion_paths(&root, &project).map_err(|e| e.to_string())?,
        std::slice::from_ref(&project.playwright_module),
    )?;
    let build_cache_key = build_cache_key(&integrity, &project)?;
    // The root too: a generic build's sources import the runtime by
    // absolute path, which a moved project must not reuse.
    let frontend_cache_key = format!(
        "{}:{}:{}:{}",
        integrity.fingerprint.combined,
        integrity.fingerprint.execution,
        crate::assertion_map::digest(&request.command),
        crate::assertion_map::digest(&project.root.to_string_lossy())
    );
    let prior_workspace = cached_workspace_path(&root).map_err(|error| error.to_string())?;
    let reusable_build = if project.build_adapter == BuildAdapter::Direct {
        None
    } else {
        read_build_cache(&prior_workspace, &build_cache_key)
    };
    let reusable_frontend = read_javascript_frontend_cache(&prior_workspace, &frontend_cache_key);
    let mut cached_paths = reusable_build.as_ref().map(reuse_paths).unwrap_or_default();
    if let Some(frontend) = &reusable_frontend {
        cached_paths.extend(javascript_frontend_reuse_paths(frontend));
        cached_paths.sort();
        cached_paths.dedup();
    }
    let initialization_ms = elapsed_ms(initialization_started);

    let workspace_started = Instant::now();
    let workspace_progress = crate::progress::ProgressLine::start("preparing isolated workspace");
    let workspace = prepare_cached_workspace(&root, cleanup.lock(), &cached_paths)
        .map_err(|error| error.to_string())?;
    drop(workspace_progress);
    cleanup.set_workspace(workspace.clone());
    if let Err(error) = crate::workspace::mirror_git_repository(&root, &workspace)
        && std::env::var_os("SUPERCOV_DEBUG").is_some()
    {
        eprintln!("[supercov] the workspace has no git repository of its own: {error}");
    }
    let workspace_preparation_ms = elapsed_ms(workspace_started);
    writeln!(
        diagnostics,
        "[supercov] instrumenting isolated workspace {}",
        workspace.display()
    )
    .map_err(|error| error.to_string())?;
    cleanup.mark_state_written();
    write_run_state(
        &root,
        &RunState {
            id: run_id.clone(),
            pid: std::process::id(),
            root: root.display().to_string(),
            workspace: workspace.display().to_string(),
            started_at: started_at.clone(),
            updated_at: started_at.clone(),
            status: RunStateStatus::Preparing,
            signal: None,
            error: None,
        },
    )
    .map_err(|error| error.to_string())?;

    let adapter_started = Instant::now();
    let instrumentation_progress = crate::progress::ProgressLine::start("instrumenting sources");
    let collector_id = format!("collector-{}", integrity.fingerprint.execution);
    let frontend = if let Some(cache) = &reusable_frontend {
        load_cached_javascript_frontend(&workspace, cache)
    } else {
        prepare_javascript_frontend(
            &workspace,
            &project,
            &collector_id,
            &frontend_cache_key,
            &request.command,
        )
    }
    .map_err(|error| error.to_string())?;
    crate::workspace::hide_rewritten_files(
        &workspace,
        &crate::javascript_frontend::rewritten_files(&workspace),
    );
    drop(instrumentation_progress);
    let adapter_setup_ms = elapsed_ms(adapter_started);
    if let Some(detail) = crate::javascript_frontend::setup_timing_detail() {
        writeln!(diagnostics, "[supercov] {detail}").map_err(|error| error.to_string())?;
    }

    let evidence_relative = format!(".supercov/evidence/{run_id}");
    let evidence_directory = workspace.join(&evidence_relative);
    let server_evidence_root = workspace.join(".supercov/server-evidence");
    let diagnostic_owner = workspace.join(format!(".supercov/diagnostic-owner-{run_id}"));
    let mut overrides = BTreeMap::from([
        ("NODE_OPTIONS".into(), node_options(&frontend.preload_path)),
        ("SUPERCOV_CJS_INTERCEPT".into(), "1".into()),
        ("SUPERCOV_DIRECT_INSTRUMENTATION".into(), "1".into()),
        // tap measures its own coverage and fails a run short of 100%. Under
        // Supercov it measures the instrumented copies, whose probes are
        // branches the suite was never meant to cover: minimatch passed all
        // 6,236 tests and still failed. Its report stays; only the gate goes.
        ("TAP_ALLOW_INCOMPLETE_COVERAGE".into(), "1".into()),
        // Must be absolute: monorepo runners spawn test processes with a
        // package directory as cwd, and a relative evidence directory made
        // every per-test record land beside the package, never collected.
        (
            "SUPERCOV_EVIDENCE_DIR".into(),
            evidence_directory.display().to_string(),
        ),
        (
            "SUPERCOV_DIAGNOSTIC_OWNER_FILE".into(),
            diagnostic_owner.display().to_string(),
        ),
        (
            "SUPERCOV_EXECUTION_FINGERPRINT".into(),
            integrity.fingerprint.execution.clone(),
        ),
        (
            "SUPERCOV_EXECUTION_LOG".into(),
            evidence_directory
                .join("execution.jsonl")
                .display()
                .to_string(),
        ),
        (
            "SUPERCOV_MANIFEST".into(),
            frontend.manifest_path.display().to_string(),
        ),
        (
            "SUPERCOV_PROJECT_ROOT".into(),
            workspace.display().to_string(),
        ),
        ("SUPERCOV_RUN_ID".into(), run_id.clone()),
        (
            "SUPERCOV_SERVER_EVIDENCE_ROOT".into(),
            server_evidence_root.display().to_string(),
        ),
        (
            "SUPERCOV_SOURCE_PROJECT_ROOT".into(),
            root.display().to_string(),
        ),
    ]);
    // A wrapped npm/pnpm/yarn script can launch either runner several process
    // generations later. The preload is the discovery boundary, so always
    // provide both generated configs; each runner ignores the unrelated one.
    overrides.insert(
        "SUPERCOV_GENERATED_VITEST_CONFIG".into(),
        frontend.vitest_config_path.display().to_string(),
    );
    overrides.insert(
        "SUPERCOV_GENERATED_PLAYWRIGHT_CONFIG".into(),
        frontend.playwright_config_path.display().to_string(),
    );
    overrides.insert(
        "SUPERCOV_PLAYWRIGHT_MODULE".into(),
        project.playwright_module.clone(),
    );
    overrides.insert(
        "SUPERCOV_PLAYWRIGHT_TEST_EXPORT".into(),
        project.playwright_test_export.clone(),
    );
    overrides.insert(
        "SUPERCOV_PLAYWRIGHT_WRAPPER".into(),
        "./.supercov/node_modules/playwright.mjs".into(),
    );
    if let Some(original) = project
        .playwright_config
        .as_ref()
        .and_then(|path| path.strip_prefix(&root).ok())
        .map(|path| workspace.join(path))
    {
        overrides.insert(
            "SUPERCOV_ORIGINAL_PLAYWRIGHT_CONFIG".into(),
            original.display().to_string(),
        );
    }
    overrides.extend(project.build_environment.clone());
    let preparation = if reusable_build.is_some() {
        writeln!(
            diagnostics,
            "[supercov] reusing exact-fingerprint instrumented build {}",
            &build_cache_key[..12]
        )
        .map_err(|error| error.to_string())?;
        Vec::new()
    } else if project.build_adapter != BuildAdapter::Direct {
        let mut arguments = project.build_command[1..]
            .iter()
            .map(OsString::from)
            .collect::<Vec<_>>();
        if project.build_adapter == BuildAdapter::Vite {
            // npm hands a script the arguments after `--`; Yarn, pnpm and Bun
            // hand it every argument after the script's name.
            let npm = Path::new(&project.build_command[0])
                .file_stem()
                .is_some_and(|name| name.eq_ignore_ascii_case("npm"));
            if npm {
                arguments.push(OsString::from("--"));
            }
            arguments.extend([
                OsString::from("--config"),
                OsString::from(".supercov/vite.config.mjs"),
                OsString::from("--logLevel"),
                OsString::from("error"),
            ]);
        }
        let mut build_overrides = overrides.clone();
        build_overrides.insert("NODE_ENV".into(), "production".into());
        build_overrides.insert("npm_config_loglevel".into(), "error".into());
        let build_environment = environment_with(build_overrides);
        vec![ExecutionPhase {
            name: "build".into(),
            kind: PhaseKind::Build,
            command: CommandSpec {
                program: project.build_command[0].clone().into(),
                arguments,
                cwd: workspace.clone(),
                environment: Some(build_environment),
                captured_output: Some(
                    workspace
                        .join(".supercov")
                        .join(format!("build-output-{run_id}.log")),
                ),
            },
        }]
    } else {
        Vec::new()
    };
    let plan = ExecutionPlan {
        preparation,
        test: ExecutionPhase {
            name: "test".into(),
            kind: PhaseKind::Test,
            command: CommandSpec {
                program: request.command[0].clone().into(),
                arguments: request.command[1..].iter().map(OsString::from).collect(),
                cwd: workspace.clone(),
                environment: Some(environment_with(overrides)),
                captured_output: None,
            },
        },
    };
    let options = supervision_options()?;
    let watchdog_program = request.watchdog_program.as_ref().ok_or_else(|| {
        DirectJavascriptRunError::Failed(
            "the JavaScript run is missing its crash-containment executable".into(),
        )
    })?;
    let supervisor = ProcessSupervisor::new_crash_safe(watchdog_program)
        .map_err(|error| DirectJavascriptRunError::Failed(error.to_string()))?;
    let output_baseline = std::cell::RefCell::new(None);
    let execution = match execute_plan_with_supervisor(
        &supervisor,
        &plan,
        options,
        diagnostics,
        |phase, diagnostics| {
            let status = if phase.kind == PhaseKind::Test {
                // The snapshot boundary sits after Supercov's own build phase
                // and before the user's command, so only the command's own
                // effects flow back to the real project afterwards.
                *output_baseline.borrow_mut() =
                    Some(workspace_output_baseline(&workspace).map_err(|error| {
                        OrchestrationError::PhaseSetup {
                            phase: phase.name.clone(),
                            reason: error.to_string(),
                        }
                    })?);
                if frontend.assertion_calls > 0 {
                    writeln!(
                        diagnostics,
                        "[supercov] attributed {} native node:assert call(s)",
                        frontend.assertion_calls
                    )
                    .map_err(|error| OrchestrationError::PhaseSetup {
                        phase: phase.name.clone(),
                        reason: error.to_string(),
                    })?;
                }
                writeln!(
                    diagnostics,
                    "[supercov] running in isolated workspace: {}",
                    request.command.join(" ")
                )
                .map_err(|error| OrchestrationError::PhaseSetup {
                    phase: phase.name.clone(),
                    reason: error.to_string(),
                })?;
                RunStateStatus::Testing
            } else {
                RunStateStatus::Building
            };
            update_run_state(&root, &run_id, status, &started_at, None).map_err(|error| {
                OrchestrationError::PhaseSetup {
                    phase: phase.name.clone(),
                    reason: error.to_string(),
                }
            })?;
            Ok(())
        },
    ) {
        Ok(execution) => execution,
        Err(error) => {
            let message = error.to_string();
            let state_updated = update_run_state(
                &root,
                &run_id,
                RunStateStatus::Failed,
                &started_at,
                Some(message.clone()),
            )
            .is_ok();
            if state_updated {
                cleanup.mark_terminal();
            }
            return Err(message.into());
        }
    };
    let instrumented_build_ms = execution
        .phases
        .iter()
        .find(|phase| phase.kind == PhaseKind::Build)
        .map_or(0.0, |phase| phase.duration_ms as f64);
    let test_command_ms = execution
        .phases
        .iter()
        .find(|phase| phase.kind == PhaseKind::Test)
        .map_or(0.0, |phase| phase.duration_ms as f64);
    let build_succeeded = execution
        .phases
        .iter()
        .find(|phase| phase.kind == PhaseKind::Build)
        .is_some_and(|phase| phase.result.exit_code() == 0);
    if project.build_adapter != BuildAdapter::Direct && reusable_build.is_none() && build_succeeded
    {
        write_build_cache(&root, &workspace, &build_cache_key, &started_at)?;
    }
    if let Some(signal) = execution.interrupted_signal {
        interrupt_run_state(&root, &run_id, &started_at, signal_name(signal))
            .map_err(|error| error.to_string())?;
        cleanup.mark_terminal();
        return Err(DirectJavascriptRunError::Interrupted {
            signal,
            exit_code: execution.exit_code,
            timings: RunTimings {
                initialization_ms: rounded_millisecond(initialization_ms),
                workspace_preparation_ms: rounded_millisecond(workspace_preparation_ms),
                adapter_setup_ms: rounded_millisecond(adapter_setup_ms),
                instrumented_build_ms: rounded_millisecond(instrumented_build_ms),
                test_command_ms: rounded_millisecond(test_command_ms),
                evidence_publication_ms: 0.0,
            },
            total_ms: rounded_millisecond(elapsed_ms(total_started)),
        });
    }
    // Leave the real working tree as the command alone would have: updated
    // snapshots, generated fixtures, and reports belong in the repository,
    // not in the cache. Deletions and instrumented-source rewrites are
    // reported, never propagated.
    if let Some(baseline) = output_baseline.borrow().as_ref() {
        let protected = project
            .source_files
            .iter()
            .map(PathBuf::from)
            .collect::<std::collections::BTreeSet<_>>();
        let outputs = sync_command_outputs(&root, &workspace, baseline, &protected)
            .map_err(|error| error.to_string())?;
        if outputs.synced > 0 {
            let _ = writeln!(
                diagnostics,
                "[supercov] synced {} file(s) the command created or changed back to the project",
                outputs.synced
            );
        }
        if !outputs.skipped_instrumented.is_empty() {
            let _ = writeln!(
                diagnostics,
                "[supercov] {} file(s) stayed in the isolated workspace: they are instrumented copies, or were built from them, and must not overwrite your project: {}",
                outputs.skipped_instrumented.len(),
                outputs
                    .skipped_instrumented
                    .iter()
                    .take(3)
                    .map(|path| path.display().to_string())
                    .collect::<Vec<_>>()
                    .join(", ")
            );
        }
        if !outputs.deleted_in_workspace.is_empty() {
            let _ = writeln!(
                diagnostics,
                "[supercov] the command deleted {} file(s) in the isolated workspace; deletions are not propagated to the project",
                outputs.deleted_in_workspace.len()
            );
        }
    }
    update_run_state(
        &root,
        &run_id,
        RunStateStatus::Publishing,
        &started_at,
        None,
    )
    .map_err(|error| error.to_string())?;

    let publication_started = Instant::now();
    let archive_path = root
        .join(".supercov/work")
        .join(&run_id)
        .join("evidence.raw.gz");
    let entries = collect_sources(&[
        EvidenceArchiveSource::File {
            file: frontend.manifest_path,
            path: "manifest.json".into(),
        },
        EvidenceArchiveSource::File {
            file: workspace.join(".supercov/statement-exclusions.json"),
            path: "statement-exclusions.json".into(),
        },
        EvidenceArchiveSource::Directory {
            directory: evidence_directory,
            prefix: None,
        },
        EvidenceArchiveSource::Directory {
            directory: server_evidence_root.join(&run_id),
            prefix: Some("server".into()),
        },
    ])
    .map_err(|error| error.to_string())?;
    let entries =
        javascript_archive_entries(entries, &frontend.manifest, &run_id, execution.exit_code)?;
    let entries = crate::assertion_inputs::append(entries, &assertion_inputs)?;
    let raw = write_archive(entries, &archive_path).map_err(|error| error.to_string())?;
    remove_stored_tree_deferred(&root, &workspace.join(".supercov/evidence"))
        .map_err(|error| error.to_string())?;
    remove_stored_tree_deferred(&root, &server_evidence_root).map_err(|error| error.to_string())?;
    let evidence_publication_ms = elapsed_ms(publication_started);
    let timings = RunTimings {
        initialization_ms: rounded_millisecond(initialization_ms),
        workspace_preparation_ms: rounded_millisecond(workspace_preparation_ms),
        adapter_setup_ms: rounded_millisecond(adapter_setup_ms),
        instrumented_build_ms: rounded_millisecond(instrumented_build_ms),
        test_command_ms: rounded_millisecond(test_command_ms),
        evidence_publication_ms: rounded_millisecond(evidence_publication_ms),
    };
    let metadata = RunMetadata {
        id: run_id.clone(),
        started_at: started_at.clone(),
        duration_ms: rounded_millisecond(elapsed_ms(total_started)),
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
        isolated_build: Some(true),
        instrumented_build_cache: Some(InstrumentedBuildCache {
            key: build_cache_key,
            reused: reusable_build.is_some(),
        }),
        timings: Some(timings),
        merged: None,
        parents: None,
        source_roots: source_roots.clone(),
    };
    let run_directory =
        publish_run(&root, &metadata, &archive_path).map_err(|error| error.to_string())?;
    let terminal_status = if execution.exit_code == 0 {
        RunStateStatus::Complete
    } else {
        RunStateStatus::Failed
    };
    update_run_state(&root, &run_id, terminal_status, &started_at, None)
        .map_err(|error| error.to_string())?;
    finalize_published_run(&root, &run_id).map_err(|error| error.to_string())?;
    cleanup.mark_terminal();
    Ok(DirectJavascriptRunResult {
        run_id,
        run_directory,
        workspace,
        exit_code: execution.exit_code,
        assertion_calls: frontend.assertion_calls,
        recovered_runs,
        metadata,
    })
}

#[cfg(test)]
mod environment_tests {
    use super::*;

    #[test]
    fn nested_npm_drops_only_pnpm_derived_environment_aliases() {
        let mut environment = BTreeMap::from([
            ("npm_config_auto_install_peers".into(), "true".into()),
            ("NPM_CONFIG_SHAMEFULLY_HOIST".into(), "true".into()),
            (
                "npm_config_registry".into(),
                "https://registry.npmjs.org".into(),
            ),
            ("USER_VALUE".into(), "kept".into()),
        ]);
        remove_derived_pnpm_config(&mut environment);
        assert_eq!(
            environment,
            BTreeMap::from([
                ("USER_VALUE".into(), "kept".into()),
                (
                    "npm_config_registry".into(),
                    "https://registry.npmjs.org".into()
                ),
            ])
        );
    }
}
