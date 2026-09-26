//! Private execution and attribution for compiler-instrumented Rust artifacts.
//!
//! The compiler frontend freezes the complete denominator before this module
//! launches anything. Ordinary Cargo artifacts run once under the selected
//! toolchain's exact libtest companion and share one authenticated mmap whose
//! dynamic contexts are partitioned by test. Nextest attempts and opaque
//! custom harnesses retain their intrinsic process boundary. Context-zero
//! records are always published as invocation background, never as test work.

use std::{
    collections::{BTreeMap, BTreeSet},
    ffi::OsString,
    fs::{self, OpenOptions},
    io::{self, Write},
    path::{Component, Path, PathBuf},
    sync::{
        Mutex,
        atomic::{AtomicUsize, Ordering},
    },
    time::{SystemTime, UNIX_EPOCH},
};

use nextest_metadata::{BuildPlatform, FilterMatch, NextestExitCode, RustTestSuiteStatusSummary};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use supercov_contracts::{
    AttributionPrecision, ExecutionModel, FrontendAttribution, FrontendLimitation,
    FrontendLimitationScope, FrontendRunDeclaration, FrontendRunnerDeclaration,
    LANGUAGE_FRONTEND_PROTOCOL_VERSION, StructuralSource,
};

use crate::workspace::canonicalize_simplified;
use crate::{
    coverage_report::{
        CoverageModelDeclaration, CoveragePhase, CoverageReportRequest, ExecutionScope,
        ExitCodeInput, PersistedCoverageModel, RawTestResult, RuntimeSnapshot, TestProvenance,
    },
    evidence_archive::EvidenceArchiveEntry,
    process_supervision::{
        CommandSpec, ProcessSupervisor, SupervisedOutput, SupervisedResult, SupervisionOptions,
    },
    rust_cargo_configuration::{
        RustCargoResolvedRunner, RustCargoResolvedTargetRunner, RustCargoRunnerPlan,
    },
    rust_compiler_ctfe::RustCompilerCtfeUnit,
    rust_compiler_evidence::{
        RustCompilerEvidenceProjection, RustCompilerTransportHealth, project_rust_compiler_evidence,
    },
    rust_compiler_manifest::NormalizedRustCompilerManifest,
    rust_compiler_orchestration::{
        RustCompilerBuild, RustCompilerBuildRequest, RustCompilerTestArtifact,
    },
    rust_doctest::{RustdocJoinedOutcomeState, RustdocOutcomeResolution, RustdocOutcomeStatus},
    rust_libtest_events::{
        RUST_LIBTEST_EVENTS_ENV, RUST_LIBTEST_TOKEN_ENV, RustLibtestEvent, RustLibtestRunEvents,
        RustLibtestTerminalResult, create_rust_libtest_event_file, read_rust_libtest_events,
        validate_rust_libtest_run_events,
    },
    rust_probe_transport::{
        DEFAULT_DESCRIPTOR_CAPACITY, DEFAULT_PAYLOAD_CAPACITY, RUST_CONTEXT_ENV,
        RUST_TRANSPORT_ENV, RUST_TRANSPORT_TOKEN_ENV, RustTransportPartition, RustTransportRead,
        create_rust_transport, partition_rust_transport_by_test_contexts, read_rust_transport,
    },
    rust_runner_attempt::{
        NextestAttemptIdentity, RustRunnerInvocationIdentity, classify_rust_runner_environment,
    },
    rust_test_context::preflight_rust_test_contexts,
    rust_test_runner::rust_libtest_selection,
};

const TOKEN_BYTES: usize = supercov_contracts::RUST_PROBE_TRANSPORT_TOKEN_SIZE;
pub const RUST_CARGO_RUNNER_CONFIG_ENV: &str = "SUPERCOV_RUST_CARGO_RUNNER_CONFIG";
pub const RUST_CARGO_RUNNER_VERSION: u32 = 6;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize)]
#[serde(rename_all = "kebab-case")]
pub enum RustCargoRunnerKind {
    CargoTest,
    CargoCustomHarness,
    Nextest,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCargoRunnerArtifact {
    pub executable: PathBuf,
    pub test_harness: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCargoRunnerConfig {
    pub version: u32,
    pub run_id: String,
    pub target_directory: PathBuf,
    pub output_directory: PathBuf,
    pub target_runners: Vec<RustCargoResolvedTargetRunner>,
    pub artifacts: Vec<RustCargoRunnerArtifact>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCargoRunnerAttempt {
    pub test: String,
    pub context_id: u64,
    pub retry: usize,
    pub total_attempts: usize,
    pub runner_attempt_id: String,
    pub outcome: RustCargoRunnerAttemptOutcome,
    pub transport: RustTransportRead,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(tag = "kind", rename_all = "kebab-case", deny_unknown_fields)]
pub enum RustCargoRunnerAttemptOutcome {
    Libtest {
        result: RustLibtestTerminalResult,
        timed_out: bool,
    },
    Unstarted,
    OpaqueProcess,
}

fn attempt_outcome_succeeded(outcome: &RustCargoRunnerAttemptOutcome) -> bool {
    matches!(
        outcome,
        RustCargoRunnerAttemptOutcome::Libtest {
            result: RustLibtestTerminalResult::Passed
                | RustLibtestTerminalResult::Ignored
                | RustLibtestTerminalResult::Benchmarked,
            ..
        }
    )
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCargoRunnerInvocation {
    pub result: SupervisedResult,
    pub started_at_ms: i64,
    pub ended_at_ms: i64,
    pub stdout: Vec<u8>,
    pub stderr: Vec<u8>,
    pub background_transport: RustTransportRead,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCargoRunnerUnit {
    pub version: u32,
    pub run_id: String,
    pub invocation_ordinal: u64,
    pub runner: RustCargoRunnerKind,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub runner_run_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub runner_version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub runner_binary_id: Option<String>,
    pub target: String,
    pub artifact: PathBuf,
    pub arguments: Vec<String>,
    pub invocation: RustCargoRunnerInvocation,
    pub attempts: Vec<RustCargoRunnerAttempt>,
    /// Deterministic join-bounded quarantine notes: one per thread phase whose
    /// lifetime escaped its creating test in this invocation's transport.
    pub thread_scope_limitations: BTreeSet<String>,
}

fn validate_persisted_runner_transport(
    unit: &RustCargoRunnerUnit,
) -> Result<(), RustCompilerTestError> {
    let mut roots = BTreeSet::new();
    let mut combined = unit.invocation.background_transport.clone();
    for attempt in &unit.attempts {
        if matches!(attempt.context_id, 0 | u64::MAX) || !roots.insert(attempt.context_id) {
            return Err(RustCompilerTestError::Context(format!(
                "Cargo runner unit {} has a reserved or duplicate test context",
                unit.invocation_ordinal
            )));
        }
        combined
            .observations
            .extend(attempt.transport.observations.iter().cloned());
        combined
            .ordinal_hits
            .extend(attempt.transport.ordinal_hits.iter().copied());
        combined
            .phases
            .extend(attempt.transport.phases.iter().cloned());
        combined
            .thread_phases
            .extend(attempt.transport.thread_phases.iter().copied());
        combined
            .thread_ends
            .extend(attempt.transport.thread_ends.iter().copied());
        combined
            .test_boundaries
            .extend(attempt.transport.test_boundaries.iter().copied());
        combined.committed = combined
            .committed
            .checked_add(attempt.transport.committed)
            .ok_or_else(|| {
                RustCompilerTestError::Context(
                    "Cargo runner committed transport count overflowed u64".into(),
                )
            })?;
        combined.incomplete = combined
            .incomplete
            .checked_add(attempt.transport.incomplete)
            .ok_or_else(|| {
                RustCompilerTestError::Context(
                    "Cargo runner incomplete transport count overflowed u64".into(),
                )
            })?;
        combined.dropped = combined
            .dropped
            .checked_add(attempt.transport.dropped)
            .ok_or_else(|| {
                RustCompilerTestError::Context(
                    "Cargo runner dropped transport count overflowed u64".into(),
                )
            })?;
        combined.attachments = combined
            .attachments
            .checked_add(attempt.transport.attachments)
            .ok_or_else(|| {
                RustCompilerTestError::Context(
                    "Cargo runner transport attachment count overflowed u64".into(),
                )
            })?;
    }
    let repartitioned =
        partition_rust_transport_by_test_contexts(&combined, &roots).map_err(|error| {
            RustCompilerTestError::Context(format!(
                "Cargo runner unit {} has invalid persisted attribution: {error}",
                unit.invocation_ordinal
            ))
        })?;
    if repartitioned.background != unit.invocation.background_transport
        || repartitioned.thread_scope_limitations != unit.thread_scope_limitations
        || unit.attempts.iter().any(|attempt| {
            repartitioned.attributed.get(&attempt.context_id) != Some(&attempt.transport)
        })
    {
        return Err(RustCompilerTestError::Context(format!(
            "Cargo runner unit {} does not preserve its exact transport partition",
            unit.invocation_ordinal
        )));
    }
    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize, Serialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
struct RustCargoRunnerFailure {
    version: u32,
    run_id: String,
    invocation_ordinal: u64,
    target: Option<String>,
    artifact: Option<PathBuf>,
    error: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct RustCargoRunnerExecution {
    pub exit_code: i32,
    pub unit_path: Option<PathBuf>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct RustCompilerRunRequest {
    pub project_root: PathBuf,
    pub command: Vec<String>,
    pub run_id: String,
    pub generated_at: String,
    pub wrapper_path: PathBuf,
    pub companion_candidates: Vec<PathBuf>,
    pub require_public_capabilities: bool,
    pub cargo_runner_plan: RustCargoRunnerPlan,
    pub watchdog_program: Option<PathBuf>,
}

impl RustCompilerRunRequest {
    fn build_request(&self) -> RustCompilerBuildRequest {
        RustCompilerBuildRequest {
            project_root: self.project_root.clone(),
            command: self.command.clone(),
            run_id: self.run_id.clone(),
            wrapper_path: self.wrapper_path.clone(),
            companion_candidates: self.companion_candidates.clone(),
            require_public_capabilities: self.require_public_capabilities,
            cargo_runner_plan: self.cargo_runner_plan.clone(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustCompilerTransportHealthRecord {
    pub scope_id: String,
    pub scope_kind: String,
    pub status: String,
    pub transport: RustCompilerTransportHealth,
    /// Join-bounded thread quarantine notes for this scope's transport. Work
    /// under an escaped thread phase is deterministic background evidence.
    #[serde(skip_serializing_if = "BTreeSet::is_empty")]
    pub thread_scope_limitations: BTreeSet<String>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct RustCompilerFrontendRun {
    pub selection: crate::rust_compiler_selection::SelectedRustCompilerCompanion,
    pub declaration: FrontendRunDeclaration,
    pub request: CoverageReportRequest,
    pub exit_code: i32,
    pub artifacts: usize,
    pub artifact_files: Vec<PathBuf>,
    pub transport_health: Vec<RustCompilerTransportHealthRecord>,
    pub build_ms: f64,
    pub execution_ms: f64,
}

impl RustCompilerFrontendRun {
    pub fn archive_entries(&self) -> Result<Vec<EvidenceArchiveEntry>, serde_json::Error> {
        let model = PersistedCoverageModel::from_declaration(
            self.request
                .coverage_model
                .as_ref()
                .expect("Rust compiler frontend always declares a coverage model"),
        )
        .expect("Rust compiler coverage model is contract-valid");
        let mut entries = vec![
            EvidenceArchiveEntry {
                path: "coverage-model.json".into(),
                contents: serde_json::to_vec(&model)?,
            },
            EvidenceArchiveEntry {
                path: "frontend.json".into(),
                contents: serde_json::to_vec(&self.declaration)?,
            },
            EvidenceArchiveEntry {
                path: "manifest.json".into(),
                contents: serde_json::to_vec(&self.request.manifest)?,
            },
        ];
        for (index, result) in self.request.raw_results.iter().enumerate() {
            entries.push(EvidenceArchiveEntry {
                path: format!("results/{index:08}/mcdc.json"),
                contents: serde_json::to_vec(result)?,
            });
        }
        entries.push(EvidenceArchiveEntry {
            path: "rust/transport-health.json".into(),
            contents: serde_json::to_vec(&self.transport_health)?,
        });
        Ok(entries)
    }
}

#[derive(Debug)]
pub enum RustCompilerTestError {
    Build(String),
    Io { path: PathBuf, reason: String },
    UnsafeArtifact(String),
    List { artifact: PathBuf, reason: String },
    Context(String),
    DuplicateTest(String),
    Random(String),
    Launch { test: String, reason: String },
    Transport { test: String, reason: String },
    DroppedEvidence { test: String, dropped: u64 },
    Projection { test: String, reason: String },
    UnsupportedCommand(String),
    UnverifiedExecution { code: i32, reason: String },
    Interrupted { code: i32, signal: String },
}

impl std::fmt::Display for RustCompilerTestError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Build(reason) => write!(formatter, "Rust compiler build failed: {reason}"),
            Self::Io { path, reason } => write!(formatter, "{}: {reason}", path.display()),
            Self::UnsafeArtifact(reason) => {
                write!(formatter, "unsafe Rust test artifact: {reason}")
            }
            Self::List { artifact, reason } => write!(
                formatter,
                "could not enumerate tests in {}: {reason}",
                artifact.display()
            ),
            Self::Context(reason) => write!(formatter, "invalid Rust test context: {reason}"),
            Self::DuplicateTest(test) => write!(formatter, "duplicate Rust test identity: {test}"),
            Self::Random(reason) => {
                write!(formatter, "could not authenticate Rust evidence: {reason}")
            }
            Self::Launch { test, reason } => {
                write!(formatter, "could not launch Rust test {test}: {reason}")
            }
            Self::Transport { test, reason } => {
                write!(formatter, "invalid Rust transport for {test}: {reason}")
            }
            Self::DroppedEvidence { test, dropped } => write!(
                formatter,
                "Rust transport dropped {dropped} record(s) for {test}; refusing partial coverage"
            ),
            Self::Projection { test, reason } => {
                write!(formatter, "invalid Rust evidence for {test}: {reason}")
            }
            Self::UnsupportedCommand(reason) => formatter.write_str(reason),
            Self::UnverifiedExecution { code, reason } => write!(
                formatter,
                "Rust test command exited {code}, but Supercov could not authenticate complete coverage evidence: {reason}"
            ),
            Self::Interrupted { signal, .. } => {
                write!(formatter, "Rust test run was interrupted by {signal}")
            }
        }
    }
}

impl std::error::Error for RustCompilerTestError {}

fn io_error(path: &Path, error: impl std::fmt::Display) -> RustCompilerTestError {
    RustCompilerTestError::Io {
        path: path.to_path_buf(),
        reason: error.to_string(),
    }
}

#[derive(Debug, Clone)]
struct TestArtifact {
    executable: PathBuf,
    runner_argument: Option<OsString>,
    package: String,
    target_key: String,
    kind: String,
    source: String,
    test_harness: bool,
}

#[derive(Debug, Clone)]
struct ProcessTask {
    ordinal: usize,
    artifact_index: usize,
    artifact: TestArtifact,
    test: String,
    test_id: String,
    context_id: u64,
    retry: usize,
    total_attempts: usize,
    runner_attempt_id: String,
    runner: RustCargoRunnerKind,
    transport: PathBuf,
    libtest_events: PathBuf,
    test_arguments: Vec<OsString>,
    underlying_runner: Option<RustCargoResolvedRunner>,
}

#[derive(Debug)]
struct ProcessOutcome {
    task: ProcessTask,
    output: SupervisedOutput,
    read: RustTransportRead,
    attempt_outcome: RustCargoRunnerAttemptOutcome,
    started_at_ms: i64,
    ended_at_ms: i64,
}

struct StockLibtestExecution {
    output: SupervisedOutput,
    events: RustLibtestRunEvents,
    partition: RustTransportPartition,
    started_at_ms: i64,
    ended_at_ms: i64,
}

struct RemoveFileOnDrop(Option<PathBuf>);

impl Drop for RemoveFileOnDrop {
    fn drop(&mut self) {
        if let Some(path) = self.0.take() {
            let _ = fs::remove_file(path);
        }
    }
}

fn stock_libtest_transport_reason(
    reason: impl std::fmt::Display,
    output: &SupervisedOutput,
) -> String {
    const LIMIT: usize = 16 * 1024;
    fn tail(bytes: &[u8]) -> String {
        let start = bytes.len().saturating_sub(LIMIT);
        String::from_utf8_lossy(&bytes[start..]).into_owned()
    }

    let mut message = format!(
        "{reason}; stock libtest process exit={} ",
        output.result.exit_code()
    );
    if !output.stdout.is_empty() {
        message.push_str("\nstdout tail:\n");
        message.push_str(&tail(&output.stdout));
    }
    if !output.stderr.is_empty() {
        message.push_str("\nstderr tail:\n");
        message.push_str(&tail(&output.stderr));
    }
    message
}

fn epoch_ms() -> Result<i64, RustCompilerTestError> {
    let millis = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map_err(|error| RustCompilerTestError::Random(error.to_string()))?
        .as_millis();
    i64::try_from(millis).map_err(|error| RustCompilerTestError::Random(error.to_string()))
}

fn relative_source(root: &Path, source: &Path) -> Result<String, RustCompilerTestError> {
    let source = canonicalize_simplified(source).map_err(|error| io_error(source, error))?;
    let relative = source
        .strip_prefix(root)
        .map_err(|_| RustCompilerTestError::UnsafeArtifact(source.display().to_string()))?;
    if relative.as_os_str().is_empty()
        || relative
            .components()
            .any(|component| !matches!(component, Component::Normal(_)))
    {
        return Err(RustCompilerTestError::UnsafeArtifact(
            source.display().to_string(),
        ));
    }
    Ok(relative.to_string_lossy().replace('\\', "/"))
}

fn normalize_artifacts(
    project_root: &Path,
    target_directory: &Path,
    artifacts: &[RustCompilerTestArtifact],
) -> Result<Vec<TestArtifact>, RustCompilerTestError> {
    let target_directory = canonicalize_simplified(target_directory)
        .map_err(|error| io_error(target_directory, error))?;
    artifacts
        .iter()
        .map(|artifact| {
            let executable = canonicalize_simplified(&artifact.executable)
                .map_err(|error| io_error(&artifact.executable, error))?;
            if !executable.starts_with(&target_directory) {
                return Err(RustCompilerTestError::UnsafeArtifact(
                    executable.display().to_string(),
                ));
            }
            let mut target_kinds = artifact.target_kinds.clone();
            target_kinds.sort();
            target_kinds.dedup();
            Ok(TestArtifact {
                executable,
                runner_argument: None,
                package: artifact.package.clone(),
                target_key: format!("{}:{}", target_kinds.join("+"), artifact.target_name),
                kind: if artifact.target_kinds.iter().any(|kind| kind == "test") {
                    "integration".into()
                } else {
                    "unit".into()
                },
                source: relative_source(project_root, &artifact.source_path)?,
                test_harness: artifact.test_harness,
            })
        })
        .collect()
}

fn libtest_id(compilation_target: &str, artifact: &TestArtifact, test: &str) -> String {
    format!(
        "rust:libtest:{compilation_target}:{}:{}:{}::{test}",
        artifact.package, artifact.target_key, artifact.source,
    )
}

fn custom_harness_id(compilation_target: &str, artifact: &TestArtifact) -> String {
    format!(
        "rust:custom-harness:{compilation_target}:{}:{}:{}",
        artifact.package, artifact.target_key, artifact.source,
    )
}

fn list_tests(
    project_root: &Path,
    artifact: &TestArtifact,
    selection_arguments: &[String],
    underlying_runner: Option<&RustCargoResolvedRunner>,
    supervisor: &ProcessSupervisor,
    options: SupervisionOptions,
    event_path: &Path,
) -> Result<Vec<String>, RustCompilerTestError> {
    let mut test_arguments = selection_arguments
        .iter()
        .map(OsString::from)
        .collect::<Vec<_>>();
    test_arguments.extend(["--list".into(), "--format".into(), "terse".into()]);
    let (program, arguments) = artifact_command(artifact, underlying_runner, test_arguments);
    let mut event_token = [0_u8; supercov_contracts::RUST_LIBTEST_EVENT_TOKEN_SIZE];
    getrandom::fill(&mut event_token).map_err(|error| {
        RustCompilerTestError::Random(format!("libtest listing token: {error}"))
    })?;
    create_rust_libtest_event_file(event_path, event_token).map_err(|error| {
        RustCompilerTestError::List {
            artifact: artifact.executable.clone(),
            reason: error.to_string(),
        }
    })?;
    let mut event_cleanup = RemoveFileOnDrop(Some(event_path.to_owned()));
    let output = supervisor
        .supervise_captured(
            &CommandSpec {
                program,
                arguments,
                cwd: project_root.to_owned(),
                environment: Some(inherited_environment([
                    (
                        OsString::from(RUST_LIBTEST_EVENTS_ENV),
                        event_path.as_os_str().to_owned(),
                    ),
                    (
                        OsString::from(RUST_LIBTEST_TOKEN_ENV),
                        OsString::from(token_hex(&event_token)),
                    ),
                ])),
                captured_output: None,
            },
            options,
            &mut io::sink(),
        )
        .map_err(|error| RustCompilerTestError::List {
            artifact: artifact.executable.clone(),
            reason: error.to_string(),
        })?;
    if output.result.exit_code() != 0 {
        return Err(RustCompilerTestError::List {
            artifact: artifact.executable.clone(),
            reason: format!(
                "{}{}",
                String::from_utf8_lossy(&output.stderr),
                String::from_utf8_lossy(&output.stdout)
            )
            .trim()
            .to_owned(),
        });
    }
    let mut tests = String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| {
            line.strip_suffix(": test")
                .or_else(|| line.strip_suffix(": benchmark"))
        })
        .map(str::to_owned)
        .collect::<Vec<_>>();
    tests.sort();
    tests.dedup();
    let events = read_rust_libtest_events(event_path, &event_token).map_err(|error| {
        RustCompilerTestError::List {
            artifact: artifact.executable.clone(),
            reason: error.to_string(),
        }
    })?;
    if !matches!(
        events.as_slice(),
        [RustLibtestEvent::FilteredOut { .. }, RustLibtestEvent::Filtered { count, .. }]
            if *count == tests.len() as u64
    ) {
        return Err(RustCompilerTestError::List {
            artifact: artifact.executable.clone(),
            reason: "authenticated libtest listing events disagree with terse output".into(),
        });
    }
    fs::remove_file(event_path).map_err(|error| io_error(event_path, error))?;
    event_cleanup.0 = None;
    Ok(tests)
}

fn artifact_command(
    artifact: &TestArtifact,
    underlying_runner: Option<&RustCargoResolvedRunner>,
    test_arguments: Vec<OsString>,
) -> (OsString, Vec<OsString>) {
    match underlying_runner {
        Some(runner) => {
            let mut arguments = runner
                .arguments
                .iter()
                .map(OsString::from)
                .collect::<Vec<_>>();
            arguments.push(
                artifact
                    .runner_argument
                    .clone()
                    .unwrap_or_else(|| artifact.executable.clone().into_os_string()),
            );
            arguments.extend(test_arguments);
            (runner.program.clone().into_os_string(), arguments)
        }
        None => (artifact.executable.clone().into_os_string(), test_arguments),
    }
}

fn token_hex<const N: usize>(token: &[u8; N]) -> String {
    token.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn phase_id(run_id: &str, attempt_id: &str) -> String {
    let mut digest = Sha256::new();
    digest.update((run_id.len() as u64).to_be_bytes());
    digest.update(run_id.as_bytes());
    digest.update((attempt_id.len() as u64).to_be_bytes());
    digest.update(attempt_id.as_bytes());
    let hex = format!("{:x}", digest.finalize());
    format!("rust-test:{}", &hex[..40])
}

fn snapshot_has_evidence(snapshot: &RuntimeSnapshot) -> bool {
    !snapshot.hits.is_empty() || !snapshot.decisions.is_empty() || !snapshot.events.is_empty()
}

fn inherited_environment(
    overrides: impl IntoIterator<Item = (OsString, OsString)>,
) -> Vec<(OsString, OsString)> {
    let mut environment = std::env::vars_os().collect::<BTreeMap<_, _>>();
    environment.extend(overrides);
    environment.into_iter().collect()
}

fn run_process(
    project_root: &Path,
    task: &ProcessTask,
    supervisor: &ProcessSupervisor,
    options: SupervisionOptions,
) -> Result<ProcessOutcome, String> {
    let mut token = [0_u8; TOKEN_BYTES];
    getrandom::fill(&mut token).map_err(|error| error.to_string())?;
    create_rust_transport(
        &task.transport,
        token,
        DEFAULT_DESCRIPTOR_CAPACITY,
        DEFAULT_PAYLOAD_CAPACITY,
    )
    .map_err(|error| error.to_string())?;
    let mut transport_cleanup = RemoveFileOnDrop(Some(task.transport.clone()));
    let event_token = if task.runner == RustCargoRunnerKind::CargoCustomHarness {
        None
    } else {
        let mut token = [0_u8; supercov_contracts::RUST_LIBTEST_EVENT_TOKEN_SIZE];
        getrandom::fill(&mut token).map_err(|error| error.to_string())?;
        create_rust_libtest_event_file(&task.libtest_events, token)
            .map_err(|error| error.to_string())?;
        Some(token)
    };
    let mut event_cleanup =
        RemoveFileOnDrop(event_token.is_some().then(|| task.libtest_events.clone()));
    let started_at_ms = epoch_ms().map_err(|error| error.to_string())?;
    let (program, arguments) = artifact_command(
        &task.artifact,
        task.underlying_runner.as_ref(),
        task.test_arguments.clone(),
    );
    let mut environment = vec![
        (
            OsString::from(RUST_TRANSPORT_ENV),
            task.transport.clone().into_os_string(),
        ),
        (
            OsString::from(RUST_TRANSPORT_TOKEN_ENV),
            OsString::from(token_hex(&token)),
        ),
        (
            OsString::from(RUST_CONTEXT_ENV),
            OsString::from(format!("{:016x}", task.context_id)),
        ),
    ];
    if let Some(event_token) = &event_token {
        environment.extend([
            (
                OsString::from(RUST_LIBTEST_EVENTS_ENV),
                task.libtest_events.clone().into_os_string(),
            ),
            (
                OsString::from(RUST_LIBTEST_TOKEN_ENV),
                OsString::from(token_hex(event_token)),
            ),
        ]);
    }
    let output = supervisor
        .supervise_captured(
            &CommandSpec {
                program,
                arguments,
                cwd: project_root.to_owned(),
                environment: Some(inherited_environment(environment)),
                captured_output: None,
            },
            options,
            &mut io::sink(),
        )
        .map_err(|error| error.to_string())?;
    let ended_at_ms = epoch_ms().map_err(|error| error.to_string())?;
    let read = read_rust_transport(&task.transport, &token).map_err(|error| error.to_string())?;
    let attempt_outcome = if let Some(event_token) = &event_token {
        let events = read_rust_libtest_events(&task.libtest_events, event_token)
            .map_err(|error| error.to_string())?;
        let joined = validate_rust_libtest_run_events(&events, [task.test.clone()])
            .map_err(|error| error.to_string())?;
        let [attempt] = joined.attempts.as_slice() else {
            return Err("exact libtest attempt did not produce one terminal event".into());
        };
        if !joined.unstarted.is_empty()
            || (matches!(
                attempt.result,
                RustLibtestTerminalResult::Passed
                    | RustLibtestTerminalResult::Ignored
                    | RustLibtestTerminalResult::Benchmarked
            ) != (output.result.exit_code() == 0))
        {
            return Err("exact libtest terminal event disagrees with process status".into());
        }
        RustCargoRunnerAttemptOutcome::Libtest {
            result: attempt.result,
            timed_out: attempt.timed_out,
        }
    } else {
        RustCargoRunnerAttemptOutcome::OpaqueProcess
    };
    fs::remove_file(&task.transport).map_err(|error| error.to_string())?;
    transport_cleanup.0 = None;
    if event_token.is_some() {
        fs::remove_file(&task.libtest_events).map_err(|error| error.to_string())?;
        event_cleanup.0 = None;
    }
    Ok(ProcessOutcome {
        task: task.clone(),
        output,
        read,
        attempt_outcome,
        started_at_ms,
        ended_at_ms,
    })
}

#[allow(clippy::too_many_arguments)]
fn run_stock_libtest_artifact(
    project_root: &Path,
    artifact: &TestArtifact,
    underlying_runner: Option<&RustCargoResolvedRunner>,
    arguments: Vec<OsString>,
    selected_tests: &[String],
    contexts: &BTreeMap<String, u64>,
    transport_path: &Path,
    event_path: &Path,
    supervisor: &ProcessSupervisor,
    options: SupervisionOptions,
) -> Result<StockLibtestExecution, RustCompilerTestError> {
    let mut token = [0_u8; TOKEN_BYTES];
    getrandom::fill(&mut token)
        .map_err(|error| RustCompilerTestError::Random(error.to_string()))?;
    create_rust_transport(
        transport_path,
        token,
        DEFAULT_DESCRIPTOR_CAPACITY,
        DEFAULT_PAYLOAD_CAPACITY,
    )
    .map_err(|error| RustCompilerTestError::Transport {
        test: artifact.target_key.clone(),
        reason: error.to_string(),
    })?;
    let mut transport_cleanup = RemoveFileOnDrop(Some(transport_path.to_owned()));
    let mut event_token = [0_u8; supercov_contracts::RUST_LIBTEST_EVENT_TOKEN_SIZE];
    getrandom::fill(&mut event_token)
        .map_err(|error| RustCompilerTestError::Random(error.to_string()))?;
    create_rust_libtest_event_file(event_path, event_token).map_err(|error| {
        RustCompilerTestError::Transport {
            test: artifact.target_key.clone(),
            reason: error.to_string(),
        }
    })?;
    let mut event_cleanup = RemoveFileOnDrop(Some(event_path.to_owned()));
    let (program, arguments) = artifact_command(artifact, underlying_runner, arguments);
    let started_at_ms = epoch_ms()?;
    let output = supervisor
        .supervise_captured(
            &CommandSpec {
                program,
                arguments,
                cwd: project_root.to_owned(),
                environment: Some(inherited_environment([
                    (
                        OsString::from(RUST_TRANSPORT_ENV),
                        transport_path.as_os_str().to_owned(),
                    ),
                    (
                        OsString::from(RUST_TRANSPORT_TOKEN_ENV),
                        OsString::from(token_hex(&token)),
                    ),
                    (
                        OsString::from(RUST_CONTEXT_ENV),
                        OsString::from("0000000000000000"),
                    ),
                    (
                        OsString::from(RUST_LIBTEST_EVENTS_ENV),
                        event_path.as_os_str().to_owned(),
                    ),
                    (
                        OsString::from(RUST_LIBTEST_TOKEN_ENV),
                        OsString::from(token_hex(&event_token)),
                    ),
                ])),
                captured_output: None,
            },
            options,
            &mut io::sink(),
        )
        .map_err(|error| RustCompilerTestError::Launch {
            test: artifact.target_key.clone(),
            reason: error.to_string(),
        })?;
    let ended_at_ms = epoch_ms()?;
    let read = read_rust_transport(transport_path, &token).map_err(|error| {
        RustCompilerTestError::Transport {
            test: artifact.target_key.clone(),
            reason: error.to_string(),
        }
    })?;
    let events = read_rust_libtest_events(event_path, &event_token).map_err(|error| {
        RustCompilerTestError::Transport {
            test: artifact.target_key.clone(),
            reason: stock_libtest_transport_reason(error, &output),
        }
    })?;
    let events = validate_rust_libtest_run_events(&events, selected_tests.iter().cloned())
        .map_err(|error| RustCompilerTestError::Transport {
            test: artifact.target_key.clone(),
            reason: stock_libtest_transport_reason(error, &output),
        })?;
    let terminal_failure = events
        .attempts
        .iter()
        .any(|attempt| attempt.result == RustLibtestTerminalResult::Failed);
    let expected_success = !terminal_failure && events.unstarted.is_empty();
    if expected_success != (output.result.exit_code() == 0) {
        return Err(RustCompilerTestError::UnverifiedExecution {
            code: output.result.exit_code(),
            reason: "stock libtest process status disagrees with authenticated terminal and fail-fast events"
                .into(),
        });
    }
    let roots = contexts.values().copied().collect::<BTreeSet<_>>();
    let partition = partition_rust_transport_by_test_contexts(&read, &roots).map_err(|error| {
        RustCompilerTestError::Transport {
            test: artifact.target_key.clone(),
            reason: error.to_string(),
        }
    })?;
    fs::remove_file(transport_path).map_err(|error| io_error(transport_path, error))?;
    transport_cleanup.0 = None;
    fs::remove_file(event_path).map_err(|error| io_error(event_path, error))?;
    event_cleanup.0 = None;
    Ok(StockLibtestExecution {
        output,
        events,
        partition,
        started_at_ms,
        ended_at_ms,
    })
}

fn execute_process_tasks(
    project_root: &Path,
    tasks: &[ProcessTask],
    requested_workers: usize,
    supervisor: &ProcessSupervisor,
    options: SupervisionOptions,
) -> Result<Vec<ProcessOutcome>, RustCompilerTestError> {
    let workers = requested_workers.min(tasks.len());
    let next = AtomicUsize::new(0);
    let outcomes = Mutex::new(Vec::<Result<ProcessOutcome, String>>::with_capacity(
        tasks.len(),
    ));
    std::thread::scope(|scope| {
        for _ in 0..workers {
            scope.spawn(|| {
                loop {
                    let index = next.fetch_add(1, Ordering::Relaxed);
                    let Some(task) = tasks.get(index) else { break };
                    outcomes
                        .lock()
                        .expect("Rust compiler result lock poisoned")
                        .push(run_process(project_root, task, supervisor, options));
                }
            });
        }
    });
    let mut outcomes = outcomes
        .into_inner()
        .map_err(|_| RustCompilerTestError::Context("Rust compiler result lock poisoned".into()))?
        .into_iter()
        .collect::<Result<Vec<_>, _>>()
        .map_err(|reason| RustCompilerTestError::Launch {
            test: "unknown attempt".into(),
            reason,
        })?;
    outcomes.sort_by_key(|outcome| outcome.task.ordinal);
    Ok(outcomes)
}

fn regular_directory(path: &Path) -> Result<PathBuf, RustCompilerTestError> {
    let metadata = fs::symlink_metadata(path).map_err(|error| io_error(path, error))?;
    if !metadata.file_type().is_dir() {
        return Err(RustCompilerTestError::UnsafeArtifact(
            path.display().to_string(),
        ));
    }
    canonicalize_simplified(path).map_err(|error| io_error(path, error))
}

#[cfg(unix)]
fn sync_directory(path: &Path) -> Result<(), RustCompilerTestError> {
    fs::File::open(path)
        .and_then(|directory| directory.sync_all())
        .map_err(|error| io_error(path, error))
}

#[cfg(not(unix))]
fn sync_directory(_path: &Path) -> Result<(), RustCompilerTestError> {
    Ok(())
}

fn write_cargo_runner_unit(
    output_directory: &Path,
    unit: &RustCargoRunnerUnit,
) -> Result<PathBuf, RustCompilerTestError> {
    let artifact = unit.artifact.to_str().ok_or_else(|| {
        RustCompilerTestError::Context("Cargo test artifact path is not UTF-8".into())
    })?;
    let mut identity = Sha256::new();
    identity.update((unit.target.len() as u64).to_be_bytes());
    identity.update(unit.target.as_bytes());
    identity.update((artifact.len() as u64).to_be_bytes());
    identity.update(artifact.as_bytes());
    let digest = format!("{:x}", identity.finalize());
    let destination = output_directory.join(format!(
        "libtest-{:016}-{}.json",
        unit.invocation_ordinal,
        &digest[..24]
    ));
    let partial = output_directory.join(format!(
        ".libtest-{:016}-{}-{}.partial",
        unit.invocation_ordinal,
        &digest[..24],
        std::process::id()
    ));
    let bytes = serde_json::to_vec(unit)
        .map_err(|error| RustCompilerTestError::Context(error.to_string()))?;
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let mut file = options
        .open(&partial)
        .map_err(|error| io_error(&partial, error))?;
    let write_result = (|| {
        file.write_all(&bytes)
            .map_err(|error| io_error(&partial, error))?;
        file.sync_all().map_err(|error| io_error(&partial, error))?;
        drop(file);
        fs::rename(&partial, &destination).map_err(|error| io_error(&destination, error))?;
        sync_directory(output_directory)
    })();
    if write_result.is_err() {
        let _ = fs::remove_file(&partial);
    }
    write_result.map(|()| destination)
}

fn write_cargo_runner_failure(
    output_directory: &Path,
    failure: &RustCargoRunnerFailure,
) -> Result<PathBuf, RustCompilerTestError> {
    let destination =
        output_directory.join(format!("failure-{:016}.json", failure.invocation_ordinal));
    let partial = output_directory.join(format!(
        ".failure-{:016}-{}.partial",
        failure.invocation_ordinal,
        std::process::id()
    ));
    let bytes = serde_json::to_vec(failure)
        .map_err(|error| RustCompilerTestError::Context(error.to_string()))?;
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt as _;
        options.mode(0o600);
    }
    let mut file = options
        .open(&partial)
        .map_err(|error| io_error(&partial, error))?;
    let write_result = (|| {
        file.write_all(&bytes)
            .map_err(|error| io_error(&partial, error))?;
        file.sync_all().map_err(|error| io_error(&partial, error))?;
        drop(file);
        fs::rename(&partial, &destination).map_err(|error| io_error(&destination, error))?;
        sync_directory(output_directory)
    })();
    if write_result.is_err() {
        let _ = fs::remove_file(&partial);
    }
    write_result.map(|()| destination)
}

fn reserve_cargo_runner_ordinal(output_directory: &Path) -> Result<u64, RustCompilerTestError> {
    for ordinal in 0..1_000_000_u64 {
        let reservation = output_directory.join(format!(".sequence-{ordinal:016}.reserved"));
        let mut options = OpenOptions::new();
        options.write(true).create_new(true);
        #[cfg(unix)]
        {
            use std::os::unix::fs::OpenOptionsExt as _;
            options.mode(0o600);
        }
        match options.open(&reservation) {
            Ok(file) => {
                file.sync_all()
                    .map_err(|error| io_error(&reservation, error))?;
                sync_directory(output_directory)?;
                return Ok(ordinal);
            }
            Err(error) if error.kind() == io::ErrorKind::AlreadyExists => {}
            Err(error) => return Err(io_error(&reservation, error)),
        }
    }
    Err(RustCompilerTestError::Context(
        "Cargo runner invocation ordinal space is exhausted".into(),
    ))
}

fn run_nextest_list_passthrough(
    current_directory: &Path,
    artifact: &TestArtifact,
    underlying_runner: Option<&RustCargoResolvedRunner>,
    arguments: Vec<OsString>,
    watchdog_program: Option<&Path>,
    stdout: &mut dyn Write,
    stderr: &mut dyn Write,
) -> Result<RustCargoRunnerExecution, RustCompilerTestError> {
    let supervisor = watchdog_program
        .map_or_else(ProcessSupervisor::new, ProcessSupervisor::new_crash_safe)
        .map_err(|error| RustCompilerTestError::Launch {
            test: "nextest list".into(),
            reason: error.to_string(),
        })?;
    let options =
        SupervisionOptions::from_environment().map_err(|error| RustCompilerTestError::Launch {
            test: "nextest list".into(),
            reason: error.to_string(),
        })?;
    let (program, arguments) = artifact_command(artifact, underlying_runner, arguments);
    let output = supervisor
        .supervise_captured(
            &CommandSpec {
                program,
                arguments,
                cwd: current_directory.to_owned(),
                environment: Some(inherited_environment([])),
                captured_output: None,
            },
            options,
            &mut io::sink(),
        )
        .map_err(|error| RustCompilerTestError::Launch {
            test: "nextest list".into(),
            reason: error.to_string(),
        })?;
    stdout
        .write_all(&output.stdout)
        .map_err(|error| io_error(current_directory, error))?;
    stderr
        .write_all(&output.stderr)
        .map_err(|error| io_error(current_directory, error))?;
    Ok(RustCargoRunnerExecution {
        exit_code: output.result.exit_code(),
        unit_path: None,
    })
}

pub fn run_cargo_libtest_runner(
    config_path: &Path,
    arguments: Vec<OsString>,
    watchdog_program: Option<PathBuf>,
    stdout: &mut dyn Write,
    stderr: &mut dyn Write,
) -> Result<RustCargoRunnerExecution, RustCompilerTestError> {
    let config_metadata =
        fs::symlink_metadata(config_path).map_err(|error| io_error(config_path, error))?;
    if !config_metadata.file_type().is_file() {
        return Err(RustCompilerTestError::UnsafeArtifact(
            config_path.display().to_string(),
        ));
    }
    let config: RustCargoRunnerConfig = serde_json::from_slice(
        &fs::read(config_path).map_err(|error| io_error(config_path, error))?,
    )
    .map_err(|error| {
        RustCompilerTestError::Context(format!("invalid Cargo runner config: {error}"))
    })?;
    if config.version != RUST_CARGO_RUNNER_VERSION
        || !config.run_id.starts_with("run_")
        || config.run_id.len() != 20
        || !config.run_id[4..]
            .bytes()
            .all(|byte| byte.is_ascii_hexdigit())
    {
        return Err(RustCompilerTestError::Context(
            "Cargo runner config has an unsupported version or invalid run ID".into(),
        ));
    }
    let target_directory = regular_directory(&config.target_directory)?;
    let output_directory = regular_directory(&config.output_directory)?;
    let run_root = target_directory
        .parent()
        .ok_or_else(|| RustCompilerTestError::Context("Cargo target has no run root".into()))?;
    if !output_directory.starts_with(run_root) || output_directory == target_directory {
        return Err(RustCompilerTestError::UnsafeArtifact(
            output_directory.display().to_string(),
        ));
    }
    let mut configured_targets = BTreeSet::new();
    if config.target_runners.is_empty()
        || config
            .target_runners
            .iter()
            .any(|target| target.target.is_empty() || !configured_targets.insert(&target.target))
    {
        return Err(RustCompilerTestError::Context(
            "Cargo runner config has empty or duplicate target identities".into(),
        ));
    }
    let mut configured_artifacts = BTreeSet::new();
    if config.artifacts.iter().any(|artifact| {
        !configured_artifacts.insert(&artifact.executable)
            || !artifact.executable.starts_with(&target_directory)
    }) {
        return Err(RustCompilerTestError::Context(
            "Cargo runner config has duplicate or out-of-target artifacts".into(),
        ));
    }
    let runner_identity = classify_rust_runner_environment()
        .map_err(|error| RustCompilerTestError::Context(error.to_string()))?;
    let run_id = config.run_id.clone();
    let failure_target = arguments
        .first()
        .and_then(|target| target.clone().into_string().ok());
    let failure_artifact = arguments.get(1).map(PathBuf::from);
    let mut runner_arguments = arguments.into_iter();
    let target = runner_arguments
        .next()
        .ok_or_else(|| {
            RustCompilerTestError::Context("Cargo runner received no target identity".into())
        })?
        .into_string()
        .map_err(|_| {
            RustCompilerTestError::Context(
                "Cargo runner received a non-UTF-8 target identity".into(),
            )
        })?;
    let target_runner = config
        .target_runners
        .iter()
        .find(|candidate| candidate.target == target)
        .ok_or_else(|| {
            RustCompilerTestError::Context(format!(
                "Cargo runner received an unconfigured target identity: {target}"
            ))
        })?;
    let artifact_argument = runner_arguments.next().ok_or_else(|| {
        RustCompilerTestError::Context("Cargo runner received no artifact".into())
    })?;
    let artifact_path = PathBuf::from(&artifact_argument);
    let artifact =
        canonicalize_simplified(&artifact_path).map_err(|error| io_error(&artifact_path, error))?;
    if !artifact.starts_with(&target_directory)
        || !fs::symlink_metadata(&artifact).is_ok_and(|metadata| metadata.file_type().is_file())
    {
        return Err(RustCompilerTestError::UnsafeArtifact(
            artifact.display().to_string(),
        ));
    }
    let test_harness = config
        .artifacts
        .iter()
        .find(|candidate| candidate.executable == artifact)
        .map(|candidate| candidate.test_harness);
    if test_harness.is_none()
        && !matches!(
            runner_identity,
            RustRunnerInvocationIdentity::NextestList(_)
        )
    {
        return Err(RustCompilerTestError::Context(format!(
            "Cargo runner executed an unclassified artifact: {}",
            artifact.display()
        )));
    }
    let arguments = runner_arguments.collect::<Vec<_>>();
    let current_directory = std::env::current_dir()
        .and_then(fs::canonicalize)
        .map_err(|error| io_error(Path::new("."), error))?;
    let test_artifact = TestArtifact {
        executable: artifact.clone(),
        runner_argument: Some(artifact_argument),
        package: "cargo-pending".into(),
        target_key: "cargo-pending".into(),
        kind: "cargo-pending".into(),
        source: "cargo-pending".into(),
        test_harness: test_harness.unwrap_or(true),
    };
    let underlying_runner = target_runner.underlying_runner.clone();
    if matches!(
        runner_identity,
        RustRunnerInvocationIdentity::NextestList(_)
    ) {
        return run_nextest_list_passthrough(
            &current_directory,
            &test_artifact,
            underlying_runner.as_ref(),
            arguments,
            watchdog_program.as_deref(),
            stdout,
            stderr,
        );
    }

    let invocation_ordinal = reserve_cargo_runner_ordinal(&output_directory)?;
    let result = (|| {
        let utf8_arguments = arguments
            .iter()
            .cloned()
            .map(|argument| {
                argument.into_string().map_err(|_| {
                    RustCompilerTestError::Context(
                        "Cargo runner received a non-UTF-8 libtest argument".into(),
                    )
                })
            })
            .collect::<Result<Vec<_>, _>>()?;
        let invocation = crate::rust_test_runner::CargoTestInvocation {
            program: "cargo".into(),
            kind: crate::rust_test_runner::RustCargoCommandKind::CargoTest,
            arguments: vec!["test".into()],
            runner_arguments: utf8_arguments.clone(),
        };
        let artifact_digest = format!(
            "{:x}",
            Sha256::digest(artifact.as_os_str().as_encoded_bytes())
        );
        let transport_directory = output_directory.join("attempts").join(format!(
            "{invocation_ordinal:016}-{}",
            &artifact_digest[..24]
        ));
        fs::create_dir_all(&transport_directory)
            .map_err(|error| io_error(&transport_directory, error))?;
        let transport_directory = regular_directory(&transport_directory)?;
        let supervisor = watchdog_program
            .as_deref()
            .map_or_else(ProcessSupervisor::new, ProcessSupervisor::new_crash_safe)
            .map_err(|error| RustCompilerTestError::Launch {
                test: "Cargo runner".into(),
                reason: error.to_string(),
            })?;
        let options = SupervisionOptions::from_environment().map_err(|error| {
            RustCompilerTestError::Launch {
                test: "Cargo runner".into(),
                reason: error.to_string(),
            }
        })?;
        let (runner, runner_run_id, runner_version, runner_binary_id, requested_workers, attempts) =
            match &runner_identity {
                RustRunnerInvocationIdentity::CargoSingleAttempt if test_artifact.test_harness => {
                    let selection = rust_libtest_selection(&invocation).map_err(|error| {
                        RustCompilerTestError::UnsupportedCommand(error.to_string())
                    })?;
                    let tests = list_tests(
                        &current_directory,
                        &test_artifact,
                        &selection.list_arguments,
                        underlying_runner.as_ref(),
                        &supervisor,
                        options,
                        &transport_directory.join("list.events"),
                    )?;
                    let contexts = preflight_rust_test_contexts(tests.clone())
                        .map_err(|error| RustCompilerTestError::Context(error.to_string()))?;
                    let stock = run_stock_libtest_artifact(
                        &current_directory,
                        &test_artifact,
                        underlying_runner.as_ref(),
                        arguments.clone(),
                        &tests,
                        &contexts,
                        &transport_directory.join("artifact.mmap"),
                        &transport_directory.join("artifact.libtest-events"),
                        &supervisor,
                        options,
                    )?;
                    let StockLibtestExecution {
                        output,
                        events,
                        mut partition,
                        started_at_ms,
                        ended_at_ms,
                    } = stock;
                    let exit_code = output.result.exit_code();
                    stdout
                        .write_all(&output.stdout)
                        .and_then(|()| stderr.write_all(&output.stderr))
                        .map_err(|error| io_error(&output_directory, error))?;
                    let mut attempts = Vec::with_capacity(tests.len());
                    for attempt in events.attempts {
                        let context_id = contexts[&attempt.name];
                        let index = attempts.len();
                        attempts.push(RustCargoRunnerAttempt {
                            test: attempt.name,
                            context_id,
                            retry: 0,
                            total_attempts: 1,
                            runner_attempt_id: format!(
                                "{}:cargo:{invocation_ordinal:016}:{index:08}",
                                config.run_id
                            ),
                            outcome: RustCargoRunnerAttemptOutcome::Libtest {
                                result: attempt.result,
                                timed_out: attempt.timed_out,
                            },
                            transport: partition
                                .attributed
                                .remove(&context_id)
                                .expect("every selected test context was partitioned"),
                        });
                    }
                    for test in events.unstarted {
                        let context_id = contexts[&test];
                        let index = attempts.len();
                        attempts.push(RustCargoRunnerAttempt {
                            test,
                            context_id,
                            retry: 0,
                            total_attempts: 1,
                            runner_attempt_id: format!(
                                "{}:cargo:{invocation_ordinal:016}:{index:08}",
                                config.run_id
                            ),
                            outcome: RustCargoRunnerAttemptOutcome::Unstarted,
                            transport: partition
                                .attributed
                                .remove(&context_id)
                                .expect("every unstarted test context was partitioned"),
                        });
                    }
                    if !partition.attributed.is_empty() {
                        return Err(RustCompilerTestError::Context(
                            "stock libtest event join left selected test contexts unclaimed".into(),
                        ));
                    }
                    let unit = RustCargoRunnerUnit {
                        version: RUST_CARGO_RUNNER_VERSION,
                        run_id: run_id.clone(),
                        invocation_ordinal,
                        runner: RustCargoRunnerKind::CargoTest,
                        runner_run_id: None,
                        runner_version: None,
                        runner_binary_id: None,
                        target,
                        artifact,
                        arguments: utf8_arguments,
                        invocation: RustCargoRunnerInvocation {
                            result: output.result,
                            started_at_ms,
                            ended_at_ms,
                            stdout: output.stdout,
                            stderr: output.stderr,
                            background_transport: partition.background,
                        },
                        attempts,
                        thread_scope_limitations: partition.thread_scope_limitations,
                    };
                    let unit_path = write_cargo_runner_unit(&output_directory, &unit)?;
                    fs::remove_dir(&transport_directory)
                        .map_err(|error| io_error(&transport_directory, error))?;
                    return Ok(RustCargoRunnerExecution {
                        exit_code,
                        unit_path: Some(unit_path),
                    });
                }
                RustRunnerInvocationIdentity::CargoSingleAttempt => (
                    RustCargoRunnerKind::CargoCustomHarness,
                    None,
                    None,
                    None,
                    1,
                    vec![(
                        "custom-harness".into(),
                        0,
                        1,
                        format!("{}:cargo:{invocation_ordinal:016}:00000000", config.run_id),
                        arguments.clone(),
                    )],
                ),
                RustRunnerInvocationIdentity::NextestAttempt(NextestAttemptIdentity {
                    invocation,
                    test_name,
                    retry,
                    total_attempts,
                    runner_attempt_id,
                }) => {
                    if !test_artifact.test_harness {
                        return Err(RustCompilerTestError::Context(
                            "nextest attempted to execute a custom Cargo harness".into(),
                        ));
                    }
                    if !utf8_arguments
                        .windows(2)
                        .any(|pair| pair == ["--exact", test_name])
                    {
                        return Err(RustCompilerTestError::Context(
                            "nextest target-runner arguments do not select NEXTEST_TEST_NAME exactly"
                                .into(),
                        ));
                    }
                    (
                        RustCargoRunnerKind::Nextest,
                        Some(invocation.run_id.clone()),
                        Some(invocation.version.clone()),
                        Some(invocation.binary_id.clone()),
                        1,
                        vec![(
                            test_name.clone(),
                            *retry,
                            *total_attempts,
                            runner_attempt_id.clone(),
                            arguments.clone(),
                        )],
                    )
                }
                RustRunnerInvocationIdentity::NextestList(_) => unreachable!("handled above"),
            };
        let tests = attempts
            .iter()
            .map(|(test, _, _, _, _)| test.clone())
            .collect::<Vec<_>>();
        let contexts = preflight_rust_test_contexts(tests.clone())
            .map_err(|error| RustCompilerTestError::Context(error.to_string()))?;
        let tasks = attempts
            .into_iter()
            .enumerate()
            .map(
                |(index, (test, retry, total_attempts, runner_attempt_id, test_arguments))| {
                    ProcessTask {
                        ordinal: index,
                        artifact_index: 0,
                        artifact: test_artifact.clone(),
                        test: test.clone(),
                        test_id: format!("rust:cargo-runner:{}::{test}", &artifact_digest[..24]),
                        context_id: contexts[&test],
                        retry,
                        total_attempts,
                        runner_attempt_id,
                        runner,
                        transport: transport_directory.join(format!("{index:08}.mmap")),
                        libtest_events: transport_directory
                            .join(format!("{index:08}.libtest-events")),
                        test_arguments,
                        underlying_runner: underlying_runner.clone(),
                    }
                },
            )
            .collect::<Vec<_>>();
        let mut outcomes = execute_process_tasks(
            &current_directory,
            &tasks,
            requested_workers,
            &supervisor,
            options,
        )?;
        let [outcome] = outcomes.as_mut_slice() else {
            return Err(RustCompilerTestError::Context(
                "custom-harness and nextest runner invocations must own exactly one process".into(),
            ));
        };
        stdout
            .write_all(&outcome.output.stdout)
            .and_then(|()| stderr.write_all(&outcome.output.stderr))
            .map_err(|error| io_error(&output_directory, error))?;
        let exit_code = outcome.output.result.exit_code();
        let roots = BTreeSet::from([outcome.task.context_id]);
        let mut partition = partition_rust_transport_by_test_contexts(&outcome.read, &roots)
            .map_err(|error| RustCompilerTestError::Transport {
                test: outcome.task.test.clone(),
                reason: error.to_string(),
            })?;
        let attempt_outcome = match runner {
            RustCargoRunnerKind::CargoCustomHarness => RustCargoRunnerAttemptOutcome::OpaqueProcess,
            RustCargoRunnerKind::Nextest => match outcome.attempt_outcome {
                RustCargoRunnerAttemptOutcome::Libtest { result, timed_out } => {
                    RustCargoRunnerAttemptOutcome::Libtest { result, timed_out }
                }
                _ => {
                    return Err(RustCompilerTestError::Context(
                        "nextest process has no authenticated libtest terminal event".into(),
                    ));
                }
            },
            RustCargoRunnerKind::CargoTest => unreachable!("stock libtest returned above"),
        };
        let attempts = vec![RustCargoRunnerAttempt {
            test: outcome.task.test.clone(),
            context_id: outcome.task.context_id,
            retry: outcome.task.retry,
            total_attempts: outcome.task.total_attempts,
            runner_attempt_id: outcome.task.runner_attempt_id.clone(),
            outcome: attempt_outcome,
            transport: partition
                .attributed
                .remove(&outcome.task.context_id)
                .expect("the one attempt context was partitioned"),
        }];
        let unit = RustCargoRunnerUnit {
            version: RUST_CARGO_RUNNER_VERSION,
            run_id: run_id.clone(),
            invocation_ordinal,
            runner,
            runner_run_id,
            runner_version,
            runner_binary_id,
            target,
            artifact,
            arguments: utf8_arguments,
            invocation: RustCargoRunnerInvocation {
                result: outcome.output.result.clone(),
                started_at_ms: outcome.started_at_ms,
                ended_at_ms: outcome.ended_at_ms,
                stdout: outcome.output.stdout.clone(),
                stderr: outcome.output.stderr.clone(),
                background_transport: partition.background,
            },
            attempts,
            thread_scope_limitations: partition.thread_scope_limitations,
        };
        let unit_path = write_cargo_runner_unit(&output_directory, &unit)?;
        fs::remove_dir(&transport_directory)
            .map_err(|error| io_error(&transport_directory, error))?;
        Ok(RustCargoRunnerExecution {
            exit_code,
            unit_path: Some(unit_path),
        })
    })();
    if let Err(error) = &result {
        let failure = RustCargoRunnerFailure {
            version: RUST_CARGO_RUNNER_VERSION,
            run_id,
            invocation_ordinal,
            target: failure_target,
            artifact: failure_artifact,
            error: error.to_string(),
        };
        if let Err(publication_error) = write_cargo_runner_failure(&output_directory, &failure) {
            return Err(RustCompilerTestError::Context(format!(
                "{error}; Cargo runner also could not publish its failure: {publication_error}"
            )));
        }
    }
    result
}

pub fn read_cargo_runner_units(
    output_directory: &Path,
    run_id: &str,
    expected_targets: &[String],
) -> Result<Vec<RustCargoRunnerUnit>, RustCompilerTestError> {
    let output_directory = regular_directory(output_directory)?;
    let expected_target_count = expected_targets.len();
    let expected_targets = expected_targets.iter().collect::<BTreeSet<_>>();
    if expected_targets.is_empty() || expected_targets.len() != expected_target_count {
        return Err(RustCompilerTestError::Context(
            "Cargo runner expected-target set is empty or duplicated".into(),
        ));
    }
    let mut reservations = BTreeSet::new();
    let mut units = Vec::new();
    let mut failures = Vec::new();
    let mut retained_attempt_state = false;
    for entry in
        fs::read_dir(&output_directory).map_err(|error| io_error(&output_directory, error))?
    {
        let entry = entry.map_err(|error| io_error(&output_directory, error))?;
        let path = entry.path();
        let metadata = fs::symlink_metadata(&path).map_err(|error| io_error(&path, error))?;
        let name = entry.file_name();
        let name = name.to_str().ok_or_else(|| {
            RustCompilerTestError::Context("Cargo runner output name is not UTF-8".into())
        })?;
        if name == "attempts" && metadata.file_type().is_dir() {
            retained_attempt_state = fs::read_dir(&path)
                .map_err(|error| io_error(&path, error))?
                .next()
                .transpose()
                .map_err(|error| io_error(&path, error))?
                .is_some();
            continue;
        }
        if name.starts_with(".sequence-") && name.ends_with(".reserved") {
            if !metadata.file_type().is_file() || metadata.len() != 0 {
                return Err(RustCompilerTestError::UnsafeArtifact(
                    path.display().to_string(),
                ));
            }
            let ordinal = name
                .strip_prefix(".sequence-")
                .and_then(|name| name.strip_suffix(".reserved"))
                .filter(|value| {
                    value.len() == 16 && value.bytes().all(|byte| byte.is_ascii_digit())
                })
                .and_then(|value| value.parse::<u64>().ok())
                .ok_or_else(|| {
                    RustCompilerTestError::Context("malformed Cargo runner reservation".into())
                })?;
            if !reservations.insert(ordinal) {
                return Err(RustCompilerTestError::Context(
                    "duplicate Cargo runner reservation".into(),
                ));
            }
            continue;
        }
        if name.starts_with("failure-") && name.ends_with(".json") {
            if !metadata.file_type().is_file() {
                return Err(RustCompilerTestError::UnsafeArtifact(
                    path.display().to_string(),
                ));
            }
            let failure: RustCargoRunnerFailure =
                serde_json::from_slice(&fs::read(&path).map_err(|error| io_error(&path, error))?)
                    .map_err(|error| {
                    RustCompilerTestError::Context(format!(
                        "invalid Cargo runner failure unit: {error}"
                    ))
                })?;
            if failure.version != RUST_CARGO_RUNNER_VERSION || failure.run_id != run_id {
                return Err(RustCompilerTestError::Context(
                    "Cargo runner failure unit has incompatible identity".into(),
                ));
            }
            failures.push(failure);
            continue;
        }
        if !name.starts_with("libtest-")
            || !name.ends_with(".json")
            || !metadata.file_type().is_file()
        {
            return Err(RustCompilerTestError::UnsafeArtifact(
                path.display().to_string(),
            ));
        }
        let unit: RustCargoRunnerUnit =
            serde_json::from_slice(&fs::read(&path).map_err(|error| io_error(&path, error))?)
                .map_err(|error| {
                    RustCompilerTestError::Context(format!("invalid Cargo runner unit: {error}"))
                })?;
        if unit.version != RUST_CARGO_RUNNER_VERSION || unit.run_id != run_id {
            return Err(RustCompilerTestError::Context(
                "Cargo runner unit has incompatible identity".into(),
            ));
        }
        if !expected_targets.contains(&unit.target) {
            return Err(RustCompilerTestError::Context(format!(
                "Cargo runner unit has an unselected target identity: {}",
                unit.target
            )));
        }
        validate_persisted_runner_transport(&unit)?;
        units.push(unit);
    }
    units.sort_by_key(|unit| unit.invocation_ordinal);
    failures.sort_by_key(|failure| failure.invocation_ordinal);
    let mut publications = BTreeSet::new();
    for ordinal in units
        .iter()
        .map(|unit| unit.invocation_ordinal)
        .chain(failures.iter().map(|failure| failure.invocation_ordinal))
    {
        if !reservations.contains(&ordinal) || !publications.insert(ordinal) {
            return Err(RustCompilerTestError::Context(
                "Cargo runner invocation publications are malformed or duplicated".into(),
            ));
        }
    }
    if reservations.len() != publications.len()
        || reservations
            .iter()
            .enumerate()
            .any(|(expected, ordinal)| *ordinal != expected as u64)
    {
        return Err(RustCompilerTestError::Context(
            "Cargo runner reserved an invocation without publishing its unit".into(),
        ));
    }
    if let Some(failure) = failures.first() {
        return Err(RustCompilerTestError::Context(format!(
            "Cargo runner invocation {} failed for {}: {}",
            failure.invocation_ordinal,
            failure.artifact.as_ref().map_or_else(
                || "an unknown artifact".into(),
                |path| path.display().to_string()
            ),
            failure.error
        )));
    }
    if retained_attempt_state {
        return Err(RustCompilerTestError::Context(
            "Cargo runner retained attempt transport state".into(),
        ));
    }
    let runner_kinds = units
        .iter()
        .map(|unit| unit.runner)
        .collect::<BTreeSet<_>>();
    if runner_kinds.contains(&RustCargoRunnerKind::Nextest) && runner_kinds.len() > 1 {
        return Err(RustCompilerTestError::Context(
            "Cargo runner mixed standard Cargo and nextest units".into(),
        ));
    }
    let mut attempt_ids = BTreeSet::new();
    if units.iter().flat_map(|unit| &unit.attempts).any(|attempt| {
        attempt.runner_attempt_id.is_empty()
            || !attempt_ids.insert(attempt.runner_attempt_id.clone())
    }) {
        return Err(RustCompilerTestError::Context(
            "Cargo runner attempt identity is empty or duplicated".into(),
        ));
    }
    if runner_kinds.contains(&RustCargoRunnerKind::Nextest) {
        let mut nextest_identity = None;
        let mut logical_attempts =
            BTreeMap::<(String, PathBuf, String), Vec<&RustCargoRunnerAttempt>>::new();
        for unit in &units {
            let identity = (unit.runner_run_id.as_ref(), unit.runner_version.as_ref());
            if identity.0.is_none()
                || identity.1.is_none()
                || unit.runner_binary_id.is_none()
                || unit.attempts.len() != 1
            {
                return Err(RustCompilerTestError::Context(
                    "nextest runner unit lacks exact invocation or attempt identity".into(),
                ));
            }
            match &nextest_identity {
                Some(expected) if *expected != identity => {
                    return Err(RustCompilerTestError::Context(
                        "nextest runner units belong to different runs or versions".into(),
                    ));
                }
                None => nextest_identity = Some(identity),
                _ => {}
            }
            let attempt = &unit.attempts[0];
            logical_attempts
                .entry((
                    unit.target.clone(),
                    unit.artifact.clone(),
                    attempt.test.clone(),
                ))
                .or_default()
                .push(attempt);
        }
        for attempts in logical_attempts.values_mut() {
            attempts.sort_by_key(|attempt| attempt.retry);
            let total_attempts = attempts[0].total_attempts;
            for (expected_retry, attempt) in attempts.iter().enumerate() {
                if attempt.retry != expected_retry
                    || attempt.total_attempts != total_attempts
                    || attempt.retry >= total_attempts
                    || (expected_retry + 1 < attempts.len()
                        && attempt_outcome_succeeded(&attempt.outcome))
                {
                    return Err(RustCompilerTestError::Context(
                        "nextest retry sequence is noncontiguous, inconsistent, or continues after success"
                            .into(),
                    ));
                }
            }
        }
    } else {
        let mut artifacts = BTreeSet::new();
        if units.iter().any(|unit| {
            unit.runner_run_id.is_some()
                || unit.runner_version.is_some()
                || unit.runner_binary_id.is_some()
                || !artifacts.insert((unit.target.clone(), unit.artifact.clone()))
                || unit
                    .attempts
                    .iter()
                    .any(|attempt| attempt.retry != 0 || attempt.total_attempts != 1)
                || (unit.runner == RustCargoRunnerKind::CargoCustomHarness
                    && (unit.attempts.len() != 1 || unit.attempts[0].test != "custom-harness"))
        }) {
            return Err(RustCompilerTestError::Context(
                "Cargo runner units violate the single-attempt artifact identity contract".into(),
            ));
        }
    }
    Ok(units)
}

fn rust_compiler_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "rust".into(),
        variant: "rustc-mir-owned-v1".into(),
        name: "supercov-rust-compiler-v1".into(),
        completeness_meaning: "Every compiler-derived obligation in the frozen owned-source denominator was observed; explicit compiler limitations identify Rust surfaces not yet measured.".into(),
        measured: vec![
            "compiler-derived owned Rust statement and function-entry obligations".into(),
            "compiler-derived control-flow alternatives and atomic decision vectors".into(),
            "macro-expanded and generated owned code with exact compiler provenance".into(),
            "exact stock-libtest in-process context attribution".into(),
            "exact process-per-custom-harness-invocation attribution".into(),
            "exact assertion-phase attribution for supported assertion macros".into(),
        ],
        not_measured: vec![
            "capabilities explicitly listed in the compiler manifest limitations".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

fn runner_declaration() -> FrontendRunnerDeclaration {
    FrontendRunnerDeclaration {
        runner: "rust-libtest".into(),
        execution_model: ExecutionModel::ParallelContextPropagated,
        attribution: FrontendAttribution {
            run: AttributionPrecision::Exact,
            worker: AttributionPrecision::Exact,
            test: AttributionPrecision::Exact,
            retry: AttributionPrecision::Exact,
            phase: AttributionPrecision::Exact,
            action: AttributionPrecision::Unavailable,
            assertion: AttributionPrecision::Exact,
        },
        limitations: vec![FrontendLimitation {
            id: "rust-action-linkage-unavailable".into(),
            scopes: vec![FrontendLimitationScope::Action],
            reason: "Rust libtest exposes no general application-action lifecycle".into(),
        }],
    }
}

fn nextest_runner_declaration() -> FrontendRunnerDeclaration {
    let mut declaration = runner_declaration();
    declaration.runner = "rust-nextest".into();
    declaration.execution_model = ExecutionModel::ProcessPerTest;
    declaration.limitations[0].reason =
        "nextest exposes no general application-action lifecycle".into();
    declaration
}

fn custom_harness_runner_declaration() -> FrontendRunnerDeclaration {
    let mut declaration = runner_declaration();
    declaration.runner = "rust-custom-harness".into();
    declaration.execution_model = ExecutionModel::ProcessPerTest;
    declaration.limitations[0].id = "rust-custom-harness-action-linkage-unavailable".into();
    declaration.limitations[0].reason =
        "A custom Cargo harness exposes no general application-action lifecycle".into();
    declaration.limitations.push(FrontendLimitation {
        id: "rust-custom-harness-internal-tests-opaque".into(),
        scopes: vec![FrontendLimitationScope::Test],
        reason: "Cargo exposes a custom harness as one target invocation; Supercov attributes that invocation exactly without inventing internal test-case identities".into(),
    });
    declaration
}

fn compiler_runner_declaration() -> FrontendRunnerDeclaration {
    FrontendRunnerDeclaration {
        runner: "rustc".into(),
        execution_model: ExecutionModel::ProcessPerTest,
        attribution: FrontendAttribution {
            run: AttributionPrecision::Exact,
            worker: AttributionPrecision::Exact,
            test: AttributionPrecision::Exact,
            retry: AttributionPrecision::Exact,
            phase: AttributionPrecision::Exact,
            action: AttributionPrecision::Unavailable,
            assertion: AttributionPrecision::Unavailable,
        },
        limitations: vec![
            FrontendLimitation {
                id: "rust-ctfe-action-linkage-unavailable".into(),
                scopes: vec![FrontendLimitationScope::Action],
                reason: "Compile-time evaluation is build execution, not an application action"
                    .into(),
            },
            FrontendLimitation {
                id: "rust-ctfe-assertion-linkage-unavailable".into(),
                scopes: vec![FrontendLimitationScope::Assertion],
                reason: "Compile-time execution has no user-test assertion lifecycle".into(),
            },
        ],
    }
}

fn rustdoc_runner_declaration() -> FrontendRunnerDeclaration {
    FrontendRunnerDeclaration {
        runner: "rustdoc".into(),
        execution_model: ExecutionModel::ParallelContextPropagated,
        attribution: FrontendAttribution {
            run: AttributionPrecision::Exact,
            worker: AttributionPrecision::Exact,
            test: AttributionPrecision::Exact,
            retry: AttributionPrecision::Exact,
            phase: AttributionPrecision::Exact,
            action: AttributionPrecision::Unavailable,
            assertion: AttributionPrecision::Exact,
        },
        limitations: vec![FrontendLimitation {
            id: "rustdoc-action-linkage-unavailable".into(),
            scopes: vec![FrontendLimitationScope::Action],
            reason: "Rust doctests expose assertions but no general application-action lifecycle"
                .into(),
        }],
    }
}

fn doctest_raw_results(
    run_id: &str,
    resolution: &RustdocOutcomeResolution,
    started_at_ms: i64,
    ended_at_ms: i64,
    normalized: &NormalizedRustCompilerManifest,
) -> Result<(Vec<RawTestResult>, Vec<RustCompilerTransportHealthRecord>), RustCompilerTestError> {
    let mut results = Vec::new();
    let mut health = Vec::new();
    for group in &resolution.groups {
        if group.transport.dropped != 0 {
            return Err(RustCompilerTestError::DroppedEvidence {
                test: format!("rustdoc:{}", group.group),
                dropped: group.transport.dropped,
            });
        }
        let worker_id = format!("rustdoc-{}", &group.invocation_id[..16]);
        let mut accounted_committed = 0_u64;
        for joined in &group.entries {
            let entry = &joined.catalog;
            let test_id = format!("rust:doctest:{}:{}:{}", group.group, entry.file, entry.line);
            let attempt_id = format!(
                "{run_id}:doctest:{}:{}",
                group.invocation_id, joined.catalog_index
            );
            let (status, error, started, completed) = match &joined.state {
                RustdocJoinedOutcomeState::Completed { outcome } => (
                    match outcome.status {
                        RustdocOutcomeStatus::Passed => "passed",
                        RustdocOutcomeStatus::Failed => "failed",
                        RustdocOutcomeStatus::Ignored => "skipped",
                    },
                    (outcome.status == RustdocOutcomeStatus::Failed).then(|| {
                        outcome
                            .message
                            .as_deref()
                            .or(outcome.reason.as_deref())
                            .unwrap_or("rustdoc reported a failed doctest")
                            .to_owned()
                    }),
                    true,
                    true,
                ),
                RustdocJoinedOutcomeState::UnfinishedStarted => (
                    "unknown",
                    Some("rustdoc fail-fast ended after this doctest started".into()),
                    true,
                    false,
                ),
                RustdocJoinedOutcomeState::Unstarted => (
                    "unknown",
                    Some("rustdoc fail-fast ended before this doctest started".into()),
                    false,
                    false,
                ),
                RustdocJoinedOutcomeState::FilteredOut => ("skipped", None, false, false),
                RustdocJoinedOutcomeState::NotRunAmbiguous => (
                    "unknown",
                    Some(
                        "rustdoc did not identify whether this doctest was filtered or left unstarted by fail-fast"
                            .into(),
                    ),
                    false,
                    false,
                ),
            };
            let mut phases = started
                .then(|| CoveragePhase {
                    id: phase_id(run_id, &attempt_id),
                    kind: "test".into(),
                    operation: format!("Rust doctest {}", entry.name),
                    source: Some(entry.file.clone()),
                    caused_by_phase_id: None,
                    // Pinned libtest reports duration but no wall-clock
                    // boundaries. The authenticated rustdoc invocation is the
                    // narrowest non-invented interval available; an unfinished
                    // test deliberately has no terminal timestamp.
                    started_at_ms,
                    ended_at_ms: completed.then_some(ended_at_ms),
                    status: Some(status.into()),
                    error: error.clone(),
                })
                .into_iter()
                .collect::<Vec<_>>();
            let (base_context, transport) =
                group.attributed_transport(joined).map_err(|error| {
                    RustCompilerTestError::Projection {
                        test: test_id.clone(),
                        reason: error.to_string(),
                    }
                })?;
            accounted_committed = accounted_committed
                .checked_add(transport.committed)
                .ok_or_else(|| RustCompilerTestError::Projection {
                    test: test_id.clone(),
                    reason: "rustdoc committed evidence count overflow".into(),
                })?;
            if !started && transport.committed != 0 {
                return Err(RustCompilerTestError::Projection {
                    test: test_id,
                    reason: "a filtered or unstarted doctest emitted runtime evidence".into(),
                });
            }
            let runtime = if let Some(base_phase) = phases.first() {
                let projection = project_rust_compiler_evidence(
                    base_context,
                    base_phase,
                    &transport,
                    normalized,
                )
                .map_err(|error| RustCompilerTestError::Projection {
                    test: test_id.clone(),
                    reason: error.to_string(),
                })?;
                if snapshot_has_evidence(&projection.background) {
                    return Err(RustCompilerTestError::Projection {
                        test: test_id.clone(),
                        reason: "doctest context partition retained background evidence".into(),
                    });
                }
                phases.extend(projection.assertion_phases);
                vec![projection.attributed]
            } else {
                Vec::new()
            };
            results.push(RawTestResult {
                test_id: Some(test_id.clone()),
                scope: Some(ExecutionScope {
                    version: 1,
                    run_id: run_id.into(),
                    worker_id: worker_id.clone(),
                    test_id: test_id.clone(),
                    test_key: test_id.clone(),
                    retry: 0,
                    attempt_id,
                }),
                test: test_id,
                test_file: Some(entry.file.clone()),
                title: Some(entry.name.clone()),
                retry: Some(0),
                status: Some(status.into()),
                expected_status: Some("passed".into()),
                flaky: false,
                provenance: TestProvenance {
                    runner: "rustdoc".into(),
                    kind: "doctest".into(),
                    project: Some(group.group.clone()),
                    source: "supercov-rustdoc-outcome".into(),
                },
                role: "test".into(),
                attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
                phases,
                runtime,
                browser: Vec::new(),
                server: Vec::new(),
            });
        }

        let background =
            group
                .background_transport()
                .map_err(|error| RustCompilerTestError::Projection {
                    test: format!("rustdoc:{}", group.group),
                    reason: error.to_string(),
                })?;
        accounted_committed = accounted_committed
            .checked_add(background.committed)
            .ok_or_else(|| RustCompilerTestError::Projection {
                test: format!("rustdoc:{}", group.group),
                reason: "rustdoc background evidence count overflow".into(),
            })?;
        if accounted_committed != group.transport.committed {
            return Err(RustCompilerTestError::Projection {
                test: format!("rustdoc:{}", group.group),
                reason: format!(
                    "rustdoc context partition accounted for {accounted_committed} of {} committed records",
                    group.transport.committed
                ),
            });
        }
        if background.committed != 0 {
            let background_id = format!("background:rustdoc:{}", group.invocation_id);
            let background_phase = CoveragePhase {
                id: phase_id(run_id, &background_id),
                kind: "setup".into(),
                operation: format!("Background while running Rust doctests for {}", group.group),
                source: None,
                caused_by_phase_id: None,
                started_at_ms,
                ended_at_ms: Some(ended_at_ms),
                status: Some("passed".into()),
                error: None,
            };
            // The rustdoc background partition may hold join-bounded
            // quarantined thread evidence with real contexts; flatten every
            // record to context zero so escaped-thread work can never become
            // test or phase attributed downstream.
            let mut flattened = background.clone();
            for observation in &mut flattened.observations {
                observation.context_id = 0;
            }
            for hit in &mut flattened.ordinal_hits {
                hit.context_id = 0;
            }
            flattened.phases.clear();
            flattened.thread_phases.clear();
            flattened.thread_ends.clear();
            flattened.test_boundaries.clear();
            let projection =
                project_rust_compiler_evidence(1, &background_phase, &flattened, normalized)
                    .map_err(|error| RustCompilerTestError::Projection {
                        test: background_id.clone(),
                        reason: error.to_string(),
                    })?;
            if snapshot_has_evidence(&projection.attributed)
                || !projection.assertion_phases.is_empty()
            {
                return Err(RustCompilerTestError::Projection {
                    test: background_id,
                    reason: "context-zero doctest evidence became test-attributed".into(),
                });
            }
            results.push(RawTestResult {
                test_id: Some(background_id.clone()),
                scope: Some(ExecutionScope {
                    version: 1,
                    run_id: run_id.into(),
                    worker_id: worker_id.clone(),
                    test_id: background_id.clone(),
                    test_key: background_id.clone(),
                    retry: 0,
                    attempt_id: format!("{run_id}:doctest:{}:background", group.invocation_id),
                }),
                test: background_id,
                test_file: None,
                title: Some(format!("Background Rust doctest work for {}", group.group)),
                retry: Some(0),
                status: Some("passed".into()),
                expected_status: Some("passed".into()),
                flaky: false,
                provenance: TestProvenance {
                    runner: "rustdoc".into(),
                    kind: "doctest".into(),
                    project: Some(group.group.clone()),
                    source: "supercov-rustdoc-context-zero".into(),
                },
                role: "background".into(),
                attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
                phases: Vec::new(),
                runtime: vec![projection.background],
                browser: Vec::new(),
                server: Vec::new(),
            });
        }
        health.push(RustCompilerTransportHealthRecord {
            scope_id: format!("rustdoc:{}", group.invocation_id),
            scope_kind: "runner-invocation".into(),
            status: if group.transport.dropped == 0 && group.transport.incomplete == 0 {
                "passed".into()
            } else {
                "unknown".into()
            },
            transport: RustCompilerTransportHealth {
                committed: group.transport.committed,
                incomplete: group.transport.incomplete,
                dropped: group.transport.dropped,
                attachments: group.transport.attachments,
            },
            thread_scope_limitations: group.thread_scope_limitations().map_err(|error| {
                RustCompilerTestError::Projection {
                    test: format!("rustdoc:{}", group.group),
                    reason: error.to_string(),
                }
            })?,
        });
    }
    Ok((results, health))
}

fn doctest_command_failed(resolution: &RustdocOutcomeResolution) -> bool {
    resolution.groups.iter().any(|group| {
        group.entries.iter().any(|joined| match &joined.state {
            RustdocJoinedOutcomeState::Completed { outcome } => {
                outcome.status == RustdocOutcomeStatus::Failed
            }
            RustdocJoinedOutcomeState::UnfinishedStarted | RustdocJoinedOutcomeState::Unstarted => {
                true
            }
            RustdocJoinedOutcomeState::FilteredOut => false,
            RustdocJoinedOutcomeState::NotRunAmbiguous => true,
        }) || group.ambiguous_unstarted_tests != 0
    })
}

fn ctfe_raw_results(
    run_id: &str,
    units: Vec<RustCompilerCtfeUnit>,
    started_at_ms: i64,
    ended_at_ms: i64,
) -> Vec<RawTestResult> {
    units
        .into_iter()
        .enumerate()
        .map(|(index, unit)| {
            let worker_id = format!("rustc-{index:04}");
            let test_id = format!("rust:build:ctfe:{}:{index:04}", unit.crate_name);
            let attempt_id = format!("{run_id}:ctfe:{index:04}");
            let phase_id = phase_id(run_id, &attempt_id);
            let mut snapshot = unit.snapshot;
            for event in &mut snapshot.events {
                event.phase_id = Some(phase_id.clone());
            }
            RawTestResult {
                test_id: Some(test_id.clone()),
                scope: Some(ExecutionScope {
                    version: 1,
                    run_id: run_id.into(),
                    worker_id,
                    test_id: test_id.clone(),
                    test_key: test_id.clone(),
                    retry: 0,
                    attempt_id,
                }),
                test: test_id.clone(),
                test_file: None,
                title: Some(format!(
                    "Compile-time evaluation for {} ({})",
                    unit.crate_name, unit.identity
                )),
                retry: Some(0),
                status: Some("passed".into()),
                expected_status: Some("passed".into()),
                flaky: false,
                provenance: TestProvenance {
                    runner: "rustc".into(),
                    kind: "build".into(),
                    project: Some(unit.crate_name),
                    source: "supercov-rustc-ctfe".into(),
                },
                role: "setup".into(),
                attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
                phases: vec![CoveragePhase {
                    id: phase_id,
                    kind: "setup".into(),
                    operation: "Rust constant evaluation".into(),
                    source: None,
                    caused_by_phase_id: None,
                    started_at_ms,
                    ended_at_ms: Some(ended_at_ms),
                    status: Some("passed".into()),
                    error: None,
                }],
                runtime: vec![snapshot],
                browser: Vec::new(),
                server: Vec::new(),
            }
        })
        .collect()
}

fn status(
    outcome: &RustCargoRunnerAttemptOutcome,
    output: &SupervisedOutput,
) -> (&'static str, i32) {
    match outcome {
        RustCargoRunnerAttemptOutcome::Libtest {
            result: RustLibtestTerminalResult::Passed | RustLibtestTerminalResult::Benchmarked,
            ..
        } => ("passed", 0),
        RustCargoRunnerAttemptOutcome::Libtest {
            result: RustLibtestTerminalResult::Ignored,
            ..
        } => ("skipped", 0),
        RustCargoRunnerAttemptOutcome::Libtest {
            result: RustLibtestTerminalResult::Failed,
            ..
        } => ("failed", 101),
        RustCargoRunnerAttemptOutcome::Unstarted => ("unstarted", 0),
        RustCargoRunnerAttemptOutcome::OpaqueProcess => {
            let exit = output.result.exit_code();
            (if exit == 0 { "passed" } else { "failed" }, exit)
        }
    }
}

fn raw_result(
    run_id: &str,
    task: &ProcessTask,
    status: &str,
    base_phase: CoveragePhase,
    projection: RustCompilerEvidenceProjection,
) -> (RawTestResult, RustCompilerTransportHealthRecord) {
    let worker_id = format!("artifact-{:04}", task.artifact_index);
    let attempt_id = task.runner_attempt_id.clone();
    let runner = match task.runner {
        RustCargoRunnerKind::CargoTest => "rust-libtest",
        RustCargoRunnerKind::CargoCustomHarness => "rust-custom-harness",
        RustCargoRunnerKind::Nextest => "rust-nextest",
    };
    let scope = ExecutionScope {
        version: 1,
        run_id: run_id.into(),
        worker_id: worker_id.clone(),
        test_id: task.test_id.clone(),
        test_key: task.test_id.clone(),
        retry: task.retry,
        attempt_id: attempt_id.clone(),
    };
    let mut phases = vec![base_phase];
    phases.extend(projection.assertion_phases);
    let result = RawTestResult {
        test_id: Some(task.test_id.clone()),
        scope: Some(scope),
        test: task.test_id.clone(),
        test_file: Some(task.artifact.source.clone()),
        title: Some(if task.runner == RustCargoRunnerKind::CargoCustomHarness {
            task.artifact.target_key.clone()
        } else {
            task.test.clone()
        }),
        retry: Some(task.retry),
        status: Some(status.into()),
        expected_status: Some("passed".into()),
        flaky: false,
        provenance: TestProvenance {
            runner: runner.into(),
            kind: task.artifact.kind.clone(),
            project: Some(task.artifact.package.clone()),
            source: match task.runner {
                RustCargoRunnerKind::CargoTest => "supercov-rustc-stock-libtest-context",
                RustCargoRunnerKind::CargoCustomHarness => "supercov-rustc-custom-harness-process",
                RustCargoRunnerKind::Nextest => "supercov-rustc-nextest-process",
            }
            .into(),
        },
        role: "test".into(),
        attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
        phases,
        runtime: vec![projection.attributed],
        browser: Vec::new(),
        server: Vec::new(),
    };
    let health = RustCompilerTransportHealthRecord {
        scope_id: task.test_id.clone(),
        scope_kind: "test-attempt".into(),
        status: status.into(),
        transport: projection.health,
        thread_scope_limitations: BTreeSet::new(),
    };
    (result, health)
}

fn cargo_runner_background_result(
    run_id: &str,
    artifact_index: usize,
    artifact: &TestArtifact,
    unit: &RustCargoRunnerUnit,
    normalized: &NormalizedRustCompilerManifest,
) -> Result<(Option<RawTestResult>, RustCompilerTransportHealthRecord), RustCompilerTestError> {
    let transport = &unit.invocation.background_transport;
    let background_id = format!("background:rust-runner:{:016}", unit.invocation_ordinal);
    let invocation_status = if unit.invocation.result.exit_code() == 0 {
        "passed"
    } else {
        "failed"
    };
    let base_phase = CoveragePhase {
        id: phase_id(run_id, &background_id),
        kind: "setup".into(),
        operation: format!("Background while running {}", artifact.target_key),
        source: Some(artifact.source.clone()),
        caused_by_phase_id: None,
        started_at_ms: unit.invocation.started_at_ms,
        ended_at_ms: Some(unit.invocation.ended_at_ms),
        status: Some(invocation_status.into()),
        error: None,
    };
    // The persisted background partition holds context-zero records plus
    // join-bounded quarantined thread evidence that keeps its real contexts.
    // Projection deliberately flattens every record to context zero under a
    // non-reserved synthetic base: the shared projector still validates probe
    // identities while escaped-thread work can never become test or phase
    // attributed downstream.
    let mut flattened = transport.clone();
    for observation in &mut flattened.observations {
        observation.context_id = 0;
    }
    for hit in &mut flattened.ordinal_hits {
        hit.context_id = 0;
    }
    flattened.phases.clear();
    flattened.thread_phases.clear();
    flattened.thread_ends.clear();
    flattened.test_boundaries.clear();
    let projection = project_rust_compiler_evidence(1, &base_phase, &flattened, normalized)
        .map_err(|error| RustCompilerTestError::Projection {
            test: background_id.clone(),
            reason: error.to_string(),
        })?;
    if snapshot_has_evidence(&projection.attributed) || !projection.assertion_phases.is_empty() {
        return Err(RustCompilerTestError::Projection {
            test: background_id,
            reason: "context-zero Cargo evidence became test-attributed".into(),
        });
    }
    let runner = match unit.runner {
        RustCargoRunnerKind::CargoTest => "rust-libtest",
        RustCargoRunnerKind::CargoCustomHarness => "rust-custom-harness",
        RustCargoRunnerKind::Nextest => "rust-nextest",
    };
    let result = snapshot_has_evidence(&projection.background).then(|| RawTestResult {
        test_id: Some(background_id.clone()),
        scope: Some(ExecutionScope {
            version: 1,
            run_id: run_id.into(),
            worker_id: format!("artifact-{artifact_index:04}"),
            test_id: background_id.clone(),
            test_key: background_id.clone(),
            retry: 0,
            attempt_id: format!("{run_id}:cargo:{:016}:background", unit.invocation_ordinal),
        }),
        test: background_id.clone(),
        test_file: Some(artifact.source.clone()),
        title: Some(format!("Background Rust work for {}", artifact.target_key)),
        retry: Some(0),
        status: Some(invocation_status.into()),
        expected_status: Some("passed".into()),
        flaky: false,
        provenance: TestProvenance {
            runner: runner.into(),
            kind: artifact.kind.clone(),
            project: Some(artifact.package.clone()),
            source: "supercov-rustc-context-zero".into(),
        },
        role: "background".into(),
        attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
        phases: Vec::new(),
        runtime: vec![projection.background],
        browser: Vec::new(),
        server: Vec::new(),
    });
    Ok((
        result,
        RustCompilerTransportHealthRecord {
            scope_id: background_id,
            scope_kind: "runner-invocation".into(),
            status: invocation_status.into(),
            transport: projection.health,
            thread_scope_limitations: unit.thread_scope_limitations.clone(),
        },
    ))
}

pub fn run_rust_compiler_frontend(
    request: &RustCompilerRunRequest,
    diagnostics: &mut dyn Write,
) -> Result<RustCompilerFrontendRun, RustCompilerTestError> {
    let supervisor = request
        .watchdog_program
        .as_deref()
        .map_or_else(ProcessSupervisor::new, ProcessSupervisor::new_crash_safe)
        .map_err(|error| RustCompilerTestError::Build(error.to_string()))?;
    let options = SupervisionOptions::from_environment()
        .map_err(|error| RustCompilerTestError::Build(error.to_string()))?;
    let build = crate::rust_compiler_orchestration::build_with_rust_compiler_companion_supervised(
        &request.build_request(),
        &supervisor,
        options,
        diagnostics,
    )
    .map_err(|error| {
        match error {
        crate::rust_compiler_orchestration::RustCompilerOrchestrationError::Interrupted {
            code,
            signal,
        } => RustCompilerTestError::Interrupted { code, signal },
        crate::rust_compiler_orchestration::RustCompilerOrchestrationError::UnverifiedExecution {
            code,
            reason,
        } => RustCompilerTestError::UnverifiedExecution { code, reason },
        error => RustCompilerTestError::Build(error.to_string()),
    }
    })?;
    execute_compiler_build(request, build, diagnostics)
}

fn execute_compiler_build(
    request: &RustCompilerRunRequest,
    build: RustCompilerBuild,
    diagnostics: &mut dyn Write,
) -> Result<RustCompilerFrontendRun, RustCompilerTestError> {
    let project_root = canonicalize_simplified(&request.project_root)
        .map_err(|error| io_error(&request.project_root, error))?;
    let artifacts = normalize_artifacts(&project_root, &build.target_directory, &build.artifacts)?;
    let artifact_by_path = artifacts
        .iter()
        .enumerate()
        .map(|(index, artifact)| (artifact.executable.clone(), (index, artifact.clone())))
        .collect::<BTreeMap<_, _>>();
    let nextest_version = match build.command_kind {
        crate::rust_test_runner::RustCargoCommandKind::NextestRun => {
            Some(build.nextest_version.as_deref().ok_or_else(|| {
                RustCompilerTestError::Context(
                    "nextest execution lacks its authenticated version handshake".into(),
                )
            })?)
        }
        crate::rust_test_runner::RustCargoCommandKind::CargoTest => {
            if build.nextest_version.is_some() || build.nextest_catalog.is_some() {
                return Err(RustCompilerTestError::Context(
                    "standard Cargo execution carries foreign nextest preflight state".into(),
                ));
            }
            None
        }
    };
    let mut nextest_selected =
        BTreeMap::<(PathBuf, String), (String, usize, TestArtifact, String)>::new();
    let mut nextest_selected_ids = BTreeSet::new();
    let mut nextest_binary_by_artifact = BTreeMap::<PathBuf, String>::new();
    if let Some(catalog) = &build.nextest_catalog {
        if build.command_kind != crate::rust_test_runner::RustCargoCommandKind::NextestRun {
            return Err(RustCompilerTestError::Context(
                "a nextest catalog was attached to a non-nextest build".into(),
            ));
        }
        for (binary_id, suite) in &catalog.rust_suites {
            if suite.status != RustTestSuiteStatusSummary::LISTED && !suite.test_cases.is_empty() {
                return Err(RustCompilerTestError::Context(format!(
                    "nextest skipped suite {binary_id} contains test cases"
                )));
            }
            let executable = canonicalize_simplified(suite.binary.binary_path.as_std_path())
                .map_err(|error| io_error(suite.binary.binary_path.as_std_path(), error))?;
            let (artifact_index, artifact) =
                artifact_by_path.get(&executable).ok_or_else(|| {
                    RustCompilerTestError::Context(format!(
                        "nextest catalog contains an unknown artifact: {}",
                        executable.display()
                    ))
                })?;
            if nextest_binary_by_artifact
                .insert(executable.clone(), binary_id.to_string())
                .is_some()
            {
                return Err(RustCompilerTestError::Context(
                    "nextest catalog aliases two binary identities to one artifact".into(),
                ));
            }
            let compilation_target = match suite.binary.build_platform {
                BuildPlatform::Host => catalog
                    .rust_build_meta
                    .platforms
                    .as_ref()
                    .map(|platforms| platforms.host.platform.triple.as_str()),
                BuildPlatform::Target => {
                    catalog
                        .rust_build_meta
                        .platforms
                        .as_ref()
                        .and_then(|platforms| {
                            if platforms.targets.len() > 1 {
                                None
                            } else {
                                platforms
                                    .targets
                                    .first()
                                    .map(|target| target.platform.triple.as_str())
                                    .or(Some(platforms.host.platform.triple.as_str()))
                            }
                        })
                }
            }
            .ok_or_else(|| {
                RustCompilerTestError::Context(format!(
                    "nextest binary {binary_id} lacks one exact compilation target"
                ))
            })?
            .to_owned();
            if !request
                .cargo_runner_plan
                .targets
                .iter()
                .any(|target| target.target == compilation_target)
            {
                return Err(RustCompilerTestError::Context(format!(
                    "nextest binary {binary_id} uses unselected target {compilation_target}"
                )));
            }
            for (test, summary) in &suite.test_cases {
                if summary.kind.is_none() {
                    return Err(RustCompilerTestError::Context(format!(
                        "nextest catalog test {binary_id}::{test} lacks a test kind"
                    )));
                }
                if summary.filter_match == FilterMatch::Matches {
                    let test = test.to_string();
                    let test_id = libtest_id(&compilation_target, artifact, &test);
                    if !nextest_selected_ids.insert(test_id.clone()) {
                        return Err(RustCompilerTestError::DuplicateTest(test_id));
                    }
                    if nextest_selected
                        .insert(
                            (executable.clone(), test.clone()),
                            (
                                compilation_target.clone(),
                                *artifact_index,
                                artifact.clone(),
                                test,
                            ),
                        )
                        .is_some()
                    {
                        return Err(RustCompilerTestError::DuplicateTest(test_id));
                    }
                }
            }
        }
    } else if build.command_kind == crate::rust_test_runner::RustCargoCommandKind::NextestRun {
        return Err(RustCompilerTestError::Context(
            "nextest execution lacks its exact selected-test catalog".into(),
        ));
    }
    let mut outcomes = Vec::new();
    let mut identities = BTreeSet::new();
    let mut attempt_ids = BTreeSet::new();
    let mut nextest_attempted = BTreeSet::new();
    for unit in &build.cargo_runner_units {
        let (artifact_index, artifact) = artifact_by_path.get(&unit.artifact).ok_or_else(|| {
            RustCompilerTestError::Context(format!(
                "Cargo runner executed an unknown artifact: {}",
                unit.artifact.display()
            ))
        })?;
        let tests = unit
            .attempts
            .iter()
            .map(|attempt| attempt.test.clone())
            .collect::<Vec<_>>();
        let contexts = preflight_rust_test_contexts(tests)
            .map_err(|error| RustCompilerTestError::Context(error.to_string()))?;
        for (test_index, attempt) in unit.attempts.iter().enumerate() {
            if contexts[&attempt.test] != attempt.context_id {
                return Err(RustCompilerTestError::Context(format!(
                    "Cargo runner context changed for {}",
                    attempt.test
                )));
            }
            let test_id = match unit.runner {
                RustCargoRunnerKind::CargoCustomHarness => {
                    custom_harness_id(&unit.target, artifact)
                }
                RustCargoRunnerKind::CargoTest | RustCargoRunnerKind::Nextest => {
                    libtest_id(&unit.target, artifact, &attempt.test)
                }
            };
            if unit.runner == RustCargoRunnerKind::Nextest {
                if unit.runner_version.as_deref() != nextest_version {
                    return Err(RustCompilerTestError::Context(format!(
                        "nextest target-runner version disagrees with the authenticated outer handshake for {test_id}"
                    )));
                }
                let expected_binary =
                    nextest_binary_by_artifact
                        .get(&unit.artifact)
                        .ok_or_else(|| {
                            RustCompilerTestError::Context(format!(
                                "nextest executed an uncatalogued artifact: {}",
                                unit.artifact.display()
                            ))
                        })?;
                if unit.runner_binary_id.as_deref() != Some(expected_binary.as_str()) {
                    return Err(RustCompilerTestError::Context(format!(
                        "nextest runner binary identity disagrees with the selected-test catalog for {}",
                        unit.artifact.display()
                    )));
                }
                if !nextest_selected.contains_key(&(unit.artifact.clone(), attempt.test.clone())) {
                    return Err(RustCompilerTestError::Context(format!(
                        "nextest executed a test excluded by its machine-readable catalog: {test_id}"
                    )));
                }
                nextest_attempted.insert(test_id.clone());
            }
            if !identities.insert((test_id.clone(), attempt.retry)) {
                return Err(RustCompilerTestError::DuplicateTest(format!(
                    "{test_id} retry {}",
                    attempt.retry
                )));
            }
            if !attempt_ids.insert(attempt.runner_attempt_id.clone()) {
                return Err(RustCompilerTestError::Context(format!(
                    "Cargo runner attempt ID is duplicated: {}",
                    attempt.runner_attempt_id
                )));
            }
            let task = ProcessTask {
                ordinal: outcomes.len(),
                artifact_index: *artifact_index,
                artifact: artifact.clone(),
                test: attempt.test.clone(),
                test_id,
                context_id: attempt.context_id,
                retry: attempt.retry,
                total_attempts: attempt.total_attempts,
                runner_attempt_id: attempt.runner_attempt_id.clone(),
                runner: unit.runner,
                transport: build.compiler_output_directory.join(format!(
                    "cargo-runner/libtest-{:04}-{test_index:08}.json",
                    unit.invocation_ordinal
                )),
                libtest_events: build.compiler_output_directory.join(format!(
                    "cargo-runner/libtest-{:04}-{test_index:08}.events",
                    unit.invocation_ordinal
                )),
                test_arguments: Vec::new(),
                underlying_runner: None,
            };
            outcomes.push(ProcessOutcome {
                task,
                output: SupervisedOutput {
                    result: unit.invocation.result.clone(),
                    stdout: unit.invocation.stdout.clone(),
                    stderr: unit.invocation.stderr.clone(),
                },
                read: attempt.transport.clone(),
                attempt_outcome: attempt.outcome.clone(),
                started_at_ms: unit.invocation.started_at_ms,
                ended_at_ms: unit.invocation.ended_at_ms,
            });
        }
    }
    let standard_cargo_units = build
        .cargo_runner_units
        .iter()
        .filter(|unit| {
            matches!(
                unit.runner,
                RustCargoRunnerKind::CargoTest | RustCargoRunnerKind::CargoCustomHarness
            )
        })
        .count();
    if build.execution_exit_code == 0
        && build.run_libtests
        && standard_cargo_units != 0
        && standard_cargo_units != artifacts.len()
    {
        return Err(RustCompilerTestError::Context(format!(
            "Cargo completed successfully but published {} runner unit(s) for {} artifact(s)",
            standard_cargo_units,
            artifacts.len()
        )));
    }
    let mut nextest_attempt_groups = BTreeMap::<String, Vec<&ProcessOutcome>>::new();
    for outcome in &outcomes {
        if outcome.task.runner == RustCargoRunnerKind::Nextest {
            nextest_attempt_groups
                .entry(outcome.task.test_id.clone())
                .or_default()
                .push(outcome);
        }
    }
    for attempts in nextest_attempt_groups.values_mut() {
        attempts.sort_by_key(|outcome| outcome.task.retry);
    }
    let nextest_terminal_failure = nextest_attempt_groups.values().any(|attempts| {
        attempts
            .last()
            .is_some_and(|outcome| outcome.output.result.exit_code() != 0)
    });
    let nextest_flaky = nextest_attempt_groups.values().any(|attempts| {
        attempts
            .last()
            .is_some_and(|outcome| outcome.output.result.exit_code() == 0)
            && attempts
                .iter()
                .take(attempts.len().saturating_sub(1))
                .any(|outcome| outcome.output.result.exit_code() != 0)
    });
    let nextest_unstarted = nextest_selected
        .values()
        .filter(|(target, _, artifact, test)| {
            !nextest_attempted.contains(&libtest_id(target, artifact, test))
        })
        .cloned()
        .collect::<Vec<_>>();

    let mut raw_results = ctfe_raw_results(
        &request.run_id,
        build.ctfe_units.clone(),
        build.build_started_at_ms,
        build.build_ended_at_ms,
    );
    let (doctest_results, mut transport_health) = doctest_raw_results(
        &request.run_id,
        &build.doctest_outcomes,
        build.build_started_at_ms,
        build.build_ended_at_ms,
        &build.normalized,
    )?;
    raw_results.extend(doctest_results);
    for unit in &build.cargo_runner_units {
        let (artifact_index, artifact) = artifact_by_path.get(&unit.artifact).ok_or_else(|| {
            RustCompilerTestError::Context(format!(
                "Cargo runner published background evidence for an unknown artifact: {}",
                unit.artifact.display()
            ))
        })?;
        let (background, health) = cargo_runner_background_result(
            &request.run_id,
            *artifact_index,
            artifact,
            unit,
            &build.normalized,
        )?;
        if let Some(background) = background {
            raw_results.push(background);
        }
        transport_health.push(health);
    }
    let overall_exit = build.execution_exit_code;
    if overall_exit != 0 {
        diagnostics
            .write_all(&build.execution_stdout)
            .and_then(|_| diagnostics.write_all(&build.execution_stderr))
            .map_err(|error| RustCompilerTestError::Io {
                path: build.compiler_output_directory.clone(),
                reason: error.to_string(),
            })?;
    }
    match build.command_kind {
        crate::rust_test_runner::RustCargoCommandKind::CargoTest => {
            let authenticated_failure = doctest_command_failed(&build.doctest_outcomes)
                || outcomes
                    .iter()
                    .any(|outcome| outcome.output.result.exit_code() != 0);
            if (overall_exit != 0) != authenticated_failure {
                return Err(RustCompilerTestError::Context(
                    "Cargo exit status disagrees with authenticated libtest/doctest outcomes"
                        .into(),
                ));
            }
        }
        crate::rust_test_runner::RustCargoCommandKind::NextestRun => match overall_exit {
            NextestExitCode::OK => {
                if nextest_terminal_failure || !nextest_unstarted.is_empty() {
                    return Err(RustCompilerTestError::Context(
                        "nextest exited successfully without terminal successful attempts for every selected test"
                            .into(),
                    ));
                }
            }
            NextestExitCode::TEST_RUN_FAILED => {
                if !nextest_terminal_failure && !nextest_flaky {
                    return Err(RustCompilerTestError::Context(
                        "nextest reported test failure without an authenticated terminal failure or flaky attempt sequence"
                            .into(),
                    ));
                }
            }
            NextestExitCode::NO_TESTS_RUN if nextest_selected.is_empty() => {}
            code => {
                return Err(RustCompilerTestError::UnverifiedExecution {
                    code,
                    reason: "nextest returned an infrastructure/status code that is not authenticated by test attempts"
                        .into(),
                });
            }
        },
    }
    for outcome in outcomes {
        let (test_status, exit) = status(&outcome.attempt_outcome, &outcome.output);
        if outcome.read.dropped != 0 {
            return Err(RustCompilerTestError::DroppedEvidence {
                test: outcome.task.test_id,
                dropped: outcome.read.dropped,
            });
        }
        let attempt_id = outcome.task.runner_attempt_id.clone();
        let base_phase = CoveragePhase {
            id: phase_id(&request.run_id, &attempt_id),
            kind: "test".into(),
            operation: format!(
                "{} {}",
                match outcome.task.runner {
                    RustCargoRunnerKind::CargoTest => "Rust libtest",
                    RustCargoRunnerKind::CargoCustomHarness => "Rust custom harness",
                    RustCargoRunnerKind::Nextest => "Rust nextest test",
                },
                if outcome.task.runner == RustCargoRunnerKind::CargoCustomHarness {
                    &outcome.task.artifact.target_key
                } else {
                    &outcome.task.test
                }
            ),
            source: Some(outcome.task.artifact.source.clone()),
            caused_by_phase_id: None,
            started_at_ms: outcome.started_at_ms,
            ended_at_ms: Some(outcome.ended_at_ms),
            status: Some(test_status.into()),
            error: (exit != 0).then(|| {
                String::from_utf8_lossy(&outcome.output.stderr)
                    .trim()
                    .to_owned()
            }),
        };
        let projection = project_rust_compiler_evidence(
            outcome.task.context_id,
            &base_phase,
            &outcome.read,
            &build.normalized,
        )
        .map_err(|error| RustCompilerTestError::Projection {
            test: outcome.task.test_id.clone(),
            reason: error.to_string(),
        })?;
        if snapshot_has_evidence(&projection.background) {
            return Err(RustCompilerTestError::Projection {
                test: outcome.task.test_id,
                reason: "a persisted test partition retained context-zero evidence".into(),
            });
        }
        let (result, health) = raw_result(
            &request.run_id,
            &outcome.task,
            test_status,
            base_phase,
            projection,
        );
        raw_results.push(result);
        transport_health.push(health);
    }
    for (target, _artifact_index, artifact, test) in nextest_unstarted {
        let test_id = libtest_id(&target, &artifact, &test);
        raw_results.push(RawTestResult {
            test_id: Some(test_id.clone()),
            scope: None,
            test: test_id,
            test_file: Some(artifact.source.clone()),
            title: Some(test),
            retry: None,
            status: Some("unstarted".into()),
            expected_status: Some("passed".into()),
            flaky: false,
            provenance: TestProvenance {
                runner: "rust-nextest".into(),
                kind: artifact.kind,
                project: Some(artifact.package),
                source: "nextest-selected-but-not-started".into(),
            },
            role: "test".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: Vec::new(),
            runtime: Vec::new(),
            browser: Vec::new(),
            server: Vec::new(),
        });
    }

    let mut structural_limitations = build
        .normalized
        .manifest
        .limitations
        .iter()
        .filter_map(|limitation| {
            limitation
                .get("id")
                .and_then(|id| id.as_str())
                .map(str::to_owned)
        })
        .collect::<Vec<_>>();
    if !build.doctest_outcomes.is_fully_catalogued() {
        structural_limitations.push("rust-doctest-outcome-catalog-incomplete".into());
    }
    if build.doctest_outcomes.has_ambiguous_outcomes() {
        structural_limitations.push("rust-doctest-filter-fail-fast-identity-ambiguous".into());
    }
    structural_limitations.sort();
    structural_limitations.dedup();
    let observed_runners = raw_results
        .iter()
        .map(|result| result.provenance.runner.as_str())
        .collect::<BTreeSet<_>>();
    if observed_runners.iter().any(|runner| {
        !matches!(
            *runner,
            "rustc" | "rust-libtest" | "rust-custom-harness" | "rust-nextest" | "rustdoc"
        )
    }) {
        return Err(RustCompilerTestError::Context(
            "Rust compiler run produced an unknown runner identity".into(),
        ));
    }
    // The frontend contract declares capabilities actually present in this
    // run. In particular, `cargo test --doc` must not advertise an unobserved
    // libtest runner, and an explicit non-doc target must not advertise
    // rustdoc. The shared analyzer deliberately rejects such declarations.
    let runners = [
        ("rustc", compiler_runner_declaration()),
        ("rust-libtest", runner_declaration()),
        ("rust-custom-harness", custom_harness_runner_declaration()),
        ("rust-nextest", nextest_runner_declaration()),
        ("rustdoc", rustdoc_runner_declaration()),
    ]
    .into_iter()
    .filter_map(|(name, declaration)| observed_runners.contains(name).then_some(declaration))
    .collect();
    let declaration = FrontendRunDeclaration {
        protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
        frontend_id: "rust".into(),
        frontend_version: "rust-compiler-v1".into(),
        language: "rust".into(),
        structural_source: StructuralSource::OwnedProbes,
        runners,
        structural_limitations,
    };
    Ok(RustCompilerFrontendRun {
        selection: build.selection,
        declaration,
        request: CoverageReportRequest {
            run_id: request.run_id.clone(),
            manifest: build.normalized.manifest,
            raw_results,
            generated_at: request.generated_at.clone(),
            coverage_model: Some(rust_compiler_coverage_model()),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(overall_exit)),
        },
        exit_code: overall_exit,
        artifacts: artifacts.len(),
        artifact_files: artifacts
            .into_iter()
            .map(|artifact| artifact.executable)
            .collect(),
        transport_health,
        build_ms: build.build_ms,
        execution_ms: build.execution_ms,
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        coverage_analysis::PointKind,
        coverage_report::{CoverageManifest, PointMeta},
        rust_doctest::{
            RustdocDoctestAttributes, RustdocDoctestCode, RustdocDoctestIgnore,
            RustdocDoctestWrapper, RustdocExtractedDoctest, RustdocJoinedOutcome,
            RustdocMergedEntry, RustdocOutcomeGroupJoin, RustdocTestOutcome,
        },
        rust_probe_transport::RustOrdinalHit,
    };

    fn test_transport() -> RustTransportRead {
        RustTransportRead::empty()
    }

    fn test_invocation(status: i32) -> RustCargoRunnerInvocation {
        RustCargoRunnerInvocation {
            result: SupervisedResult {
                status: Some(status),
                signal: None,
                timed_out: false,
                interrupted_signal: None,
            },
            started_at_ms: 0,
            ended_at_ms: 1,
            stdout: Vec::new(),
            stderr: Vec::new(),
            background_transport: test_transport(),
        }
    }

    fn test_runner_unit() -> RustCargoRunnerUnit {
        RustCargoRunnerUnit {
            version: RUST_CARGO_RUNNER_VERSION,
            run_id: "run_0123456789abcdef".into(),
            invocation_ordinal: 0,
            runner: RustCargoRunnerKind::CargoTest,
            runner_run_id: None,
            runner_version: None,
            runner_binary_id: None,
            target: "aarch64-apple-darwin".into(),
            artifact: PathBuf::from("target/test-artifact"),
            arguments: Vec::new(),
            invocation: test_invocation(0),
            attempts: Vec::new(),
            thread_scope_limitations: BTreeSet::new(),
        }
    }

    #[test]
    fn persisted_runner_transport_rejects_cross_partition_and_count_tampering() {
        let mut unit = test_runner_unit();
        unit.attempts.push(RustCargoRunnerAttempt {
            test: "tests::one".into(),
            context_id: 7,
            retry: 0,
            total_attempts: 1,
            runner_attempt_id: "attempt-one".into(),
            outcome: RustCargoRunnerAttemptOutcome::Libtest {
                result: RustLibtestTerminalResult::Passed,
                timed_out: false,
            },
            transport: test_transport(),
        });
        validate_persisted_runner_transport(&unit).unwrap();

        unit.attempts[0]
            .transport
            .ordinal_hits
            .push(RustOrdinalHit {
                process_id: 1,
                context_id: 0,
                ordinal: 9,
            });
        unit.attempts[0].transport.committed = 1;
        assert!(
            validate_persisted_runner_transport(&unit)
                .unwrap_err()
                .to_string()
                .contains("exact transport partition")
        );

        unit.attempts[0].transport.ordinal_hits[0].context_id = 7;
        unit.attempts[0].transport.committed = 2;
        assert!(
            validate_persisted_runner_transport(&unit)
                .unwrap_err()
                .to_string()
                .contains("persisted attribution")
        );
    }

    #[test]
    fn empty_selected_suite_publishes_invocation_background_without_a_test_attempt() {
        let point_id = "rs:statement:111111111111111111111111";
        let mut unit = test_runner_unit();
        unit.invocation.background_transport = RustTransportRead {
            ordinal_hits: vec![RustOrdinalHit {
                process_id: 1,
                context_id: 0,
                ordinal: 9,
            }],
            committed: 1,
            attachments: 1,
            ..RustTransportRead::empty()
        };
        validate_persisted_runner_transport(&unit).unwrap();
        let normalized = NormalizedRustCompilerManifest {
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: Vec::new(),
                points: vec![PointMeta {
                    id: point_id.into(),
                    kind: PointKind::Statement,
                    file: "src/lib.rs".into(),
                    line: 1,
                    column: 1,
                    source: "setup();".into(),
                    label: None,
                }],
                branches: Vec::new(),
                limitations: Vec::new(),
                scope: None,
            },
            hit_obligations_by_ordinal: BTreeMap::from([(9, vec![point_id.into()])]),
            internal_ordinals: BTreeSet::new(),
            decision_outcome_obligations: BTreeMap::new(),
            decision_loop_obligations: BTreeMap::new(),
            decision_logical_selection_obligations: BTreeMap::new(),
        };
        let artifact = TestArtifact {
            executable: unit.artifact.clone(),
            runner_argument: None,
            package: "package:.".into(),
            target_key: "lib:fixture".into(),
            kind: "unit".into(),
            source: "src/lib.rs".into(),
            test_harness: true,
        };
        let (result, health) =
            cargo_runner_background_result(&unit.run_id, 0, &artifact, &unit, &normalized).unwrap();
        let result = result.expect("context-zero evidence must remain queryable");
        assert_eq!(result.role, "background");
        assert!(result.runtime[0].hits.iter().any(|hit| hit == point_id));
        assert_eq!(health.scope_kind, "runner-invocation");
        assert_eq!(health.transport.committed, 1);
    }

    #[test]
    fn tokens_and_phase_ids_are_fixed_width_and_domain_separated() {
        assert_eq!(token_hex(&[0xab; TOKEN_BYTES]), "ab".repeat(TOKEN_BYTES));
        let first = phase_id("run-a", "attempt");
        assert_eq!(first.len(), "rust-test:".len() + 40);
        assert_ne!(first, phase_id("run-b", "attempt"));
        assert_ne!(first, phase_id("run-a", "attempt-b"));
    }

    #[test]
    fn test_identities_include_runner_package_target_and_workspace_source() {
        let artifact = |package: &str, target_key: &str| TestArtifact {
            executable: PathBuf::from("test-artifact"),
            runner_argument: None,
            package: package.into(),
            target_key: target_key.into(),
            kind: "unit".into(),
            source: "shared/src/lib.rs".into(),
            test_harness: true,
        };
        let root = artifact("package:.", "lib:same");
        let sibling = artifact("package:crates/sibling", "lib:same");
        let integration = artifact("package:.", "test:same");
        assert_eq!(
            libtest_id("aarch64-apple-darwin", &root, "tests::same_name"),
            "rust:libtest:aarch64-apple-darwin:package:.:lib:same:shared/src/lib.rs::tests::same_name"
        );
        assert_ne!(
            libtest_id("aarch64-apple-darwin", &root, "tests::same_name"),
            libtest_id("aarch64-apple-darwin", &sibling, "tests::same_name")
        );
        assert_ne!(
            libtest_id("aarch64-apple-darwin", &root, "tests::same_name"),
            libtest_id("aarch64-apple-darwin", &integration, "tests::same_name")
        );
        assert_ne!(
            libtest_id("aarch64-apple-darwin", &root, "tests::same_name"),
            libtest_id("x86_64-apple-darwin", &root, "tests::same_name")
        );
        assert_eq!(
            custom_harness_id("aarch64-apple-darwin", &integration),
            "rust:custom-harness:aarch64-apple-darwin:package:.:test:same:shared/src/lib.rs"
        );
        assert_ne!(
            custom_harness_id("aarch64-apple-darwin", &integration),
            libtest_id("aarch64-apple-darwin", &integration, "custom-harness")
        );
    }

    #[test]
    fn cargo_runner_failure_units_are_atomic_and_diagnostic() {
        let root = std::env::temp_dir().join(format!(
            "supercov-cargo-runner-failure-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir(&root).unwrap();
        let ordinal = reserve_cargo_runner_ordinal(&root).unwrap();
        assert_eq!(ordinal, 0);
        let failure = RustCargoRunnerFailure {
            version: RUST_CARGO_RUNNER_VERSION,
            run_id: "run_0123456789abcdef".into(),
            invocation_ordinal: ordinal,
            target: Some("aarch64-apple-darwin".into()),
            artifact: Some(PathBuf::from("target/test-artifact")),
            error: "deliberate runner failure".into(),
        };
        let published = write_cargo_runner_failure(&root, &failure).unwrap();
        assert_eq!(
            published.file_name().unwrap(),
            "failure-0000000000000000.json"
        );
        assert!(fs::read_dir(&root).unwrap().all(|entry| {
            !entry
                .unwrap()
                .file_name()
                .to_string_lossy()
                .ends_with(".partial")
        }));
        let error = read_cargo_runner_units(
            &root,
            "run_0123456789abcdef",
            &["aarch64-apple-darwin".into()],
        )
        .unwrap_err();
        let error = error.to_string();
        assert!(error.contains("invocation 0 failed"), "{error}");
        assert!(error.contains("deliberate runner failure"), "{error}");
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cargo_runner_process_death_is_distinct_from_an_internal_failure() {
        let root = std::env::temp_dir().join(format!(
            "supercov-cargo-runner-death-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir(&root).unwrap();
        reserve_cargo_runner_ordinal(&root).unwrap();
        let error = read_cargo_runner_units(
            &root,
            "run_0123456789abcdef",
            &["aarch64-apple-darwin".into()],
        )
        .unwrap_err()
        .to_string();
        assert!(error.contains("without publishing its unit"), "{error}");
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn cargo_runner_units_are_bound_to_the_selected_target_set() {
        let root = std::env::temp_dir().join(format!(
            "supercov-cargo-runner-target-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir(&root).unwrap();
        let ordinal = reserve_cargo_runner_ordinal(&root).unwrap();
        write_cargo_runner_unit(
            &root,
            &RustCargoRunnerUnit {
                version: RUST_CARGO_RUNNER_VERSION,
                run_id: "run_0123456789abcdef".into(),
                invocation_ordinal: ordinal,
                runner: RustCargoRunnerKind::CargoTest,
                runner_run_id: None,
                runner_version: None,
                runner_binary_id: None,
                target: "aarch64-apple-darwin".into(),
                artifact: PathBuf::from("target/test-artifact"),
                arguments: Vec::new(),
                invocation: test_invocation(0),
                attempts: Vec::new(),
                thread_scope_limitations: BTreeSet::new(),
            },
        )
        .unwrap();
        let second_ordinal = reserve_cargo_runner_ordinal(&root).unwrap();
        write_cargo_runner_unit(
            &root,
            &RustCargoRunnerUnit {
                version: RUST_CARGO_RUNNER_VERSION,
                run_id: "run_0123456789abcdef".into(),
                invocation_ordinal: second_ordinal,
                runner: RustCargoRunnerKind::CargoTest,
                runner_run_id: None,
                runner_version: None,
                runner_binary_id: None,
                target: "x86_64-unknown-linux-gnu".into(),
                artifact: PathBuf::from("target/test-artifact"),
                arguments: Vec::new(),
                invocation: test_invocation(0),
                attempts: Vec::new(),
                thread_scope_limitations: BTreeSet::new(),
            },
        )
        .unwrap();
        assert_eq!(
            read_cargo_runner_units(
                &root,
                "run_0123456789abcdef",
                &[
                    "aarch64-apple-darwin".into(),
                    "x86_64-unknown-linux-gnu".into(),
                ],
            )
            .unwrap()
            .len(),
            2
        );
        let error = read_cargo_runner_units(
            &root,
            "run_0123456789abcdef",
            &["x86_64-unknown-linux-gnu".into()],
        )
        .unwrap_err()
        .to_string();
        assert!(error.contains("unselected target identity"), "{error}");
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn nextest_retry_units_preserve_each_exact_attempt_and_reject_gaps() {
        let root = std::env::temp_dir().join(format!(
            "supercov-nextest-retries-{}-{}",
            std::process::id(),
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir(&root).unwrap();
        let unit = |ordinal: u64, retry: usize, status: i32| RustCargoRunnerUnit {
            version: RUST_CARGO_RUNNER_VERSION,
            run_id: "run_0123456789abcdef".into(),
            invocation_ordinal: ordinal,
            runner: RustCargoRunnerKind::Nextest,
            runner_run_id: Some("2ae19189-240a-433a-a31d-acc411fe8e1f".into()),
            runner_version: Some("0.9.140".into()),
            runner_binary_id: Some("fixture".into()),
            target: "aarch64-apple-darwin".into(),
            artifact: PathBuf::from("target/test-artifact"),
            arguments: vec!["--exact".into(), "tests::flaky".into()],
            invocation: RustCargoRunnerInvocation {
                started_at_ms: retry as i64,
                ended_at_ms: retry as i64 + 1,
                ..test_invocation(status)
            },
            attempts: vec![RustCargoRunnerAttempt {
                test: "tests::flaky".into(),
                context_id: 7,
                retry,
                total_attempts: 2,
                runner_attempt_id: format!(
                    "2ae19189-240a-433a-a31d-acc411fe8e1f:fixture$tests::flaky{}",
                    if retry == 0 {
                        String::new()
                    } else {
                        format!("#{}", retry + 1)
                    }
                ),
                outcome: RustCargoRunnerAttemptOutcome::Libtest {
                    result: if status == 0 {
                        RustLibtestTerminalResult::Passed
                    } else {
                        RustLibtestTerminalResult::Failed
                    },
                    timed_out: false,
                },
                transport: test_transport(),
            }],
            thread_scope_limitations: BTreeSet::new(),
        };

        let first = reserve_cargo_runner_ordinal(&root).unwrap();
        write_cargo_runner_unit(&root, &unit(first, 0, 101)).unwrap();
        let second = reserve_cargo_runner_ordinal(&root).unwrap();
        write_cargo_runner_unit(&root, &unit(second, 1, 0)).unwrap();
        let read = read_cargo_runner_units(
            &root,
            "run_0123456789abcdef",
            &["aarch64-apple-darwin".into()],
        )
        .unwrap();
        assert_eq!(read.len(), 2);
        assert_eq!(read[0].attempts[0].retry, 0);
        assert_eq!(read[1].attempts[0].retry, 1);
        fs::remove_dir_all(&root).unwrap();

        let gap_root = root.with_extension("gap");
        fs::create_dir(&gap_root).unwrap();
        let first = reserve_cargo_runner_ordinal(&gap_root).unwrap();
        write_cargo_runner_unit(&gap_root, &unit(first, 1, 0)).unwrap();
        let error = read_cargo_runner_units(
            &gap_root,
            "run_0123456789abcdef",
            &["aarch64-apple-darwin".into()],
        )
        .unwrap_err()
        .to_string();
        assert!(error.contains("retry sequence"), "{error}");
        fs::remove_dir_all(gap_root).unwrap();
    }

    #[cfg(unix)]
    #[test]
    fn nextest_list_passthrough_preserves_output_and_publishes_no_unit() {
        let artifact = TestArtifact {
            executable: PathBuf::from("/bin/echo"),
            runner_argument: None,
            package: "fixture".into(),
            target_key: "lib:fixture".into(),
            kind: "unit".into(),
            source: "src/lib.rs".into(),
            test_harness: true,
        };
        let mut stdout = Vec::new();
        let mut stderr = Vec::new();
        let execution = run_nextest_list_passthrough(
            Path::new("/tmp"),
            &artifact,
            None,
            vec![OsString::from("--list"), OsString::from("--format=terse")],
            None,
            &mut stdout,
            &mut stderr,
        )
        .unwrap();
        assert_eq!(execution.exit_code, 0);
        assert!(execution.unit_path.is_none());
        assert_eq!(stdout, b"--list --format=terse\n");
        assert!(stderr.is_empty());
    }

    #[test]
    fn compiler_runner_declares_exact_assertion_but_not_action_causality() {
        let runner = runner_declaration();
        assert_eq!(runner.attribution.assertion, AttributionPrecision::Exact);
        assert_eq!(runner.attribution.action, AttributionPrecision::Unavailable);
        assert_eq!(runner.limitations.len(), 1);
        let compiler = compiler_runner_declaration();
        assert_eq!(compiler.attribution.phase, AttributionPrecision::Exact);
        assert_eq!(
            compiler.attribution.assertion,
            AttributionPrecision::Unavailable
        );
        let rustdoc = rustdoc_runner_declaration();
        assert_eq!(
            rustdoc.execution_model,
            ExecutionModel::ParallelContextPropagated
        );
        assert_eq!(rustdoc.attribution.test, AttributionPrecision::Exact);
        assert_eq!(rustdoc.attribution.assertion, AttributionPrecision::Exact);
    }

    #[test]
    fn doctest_outcomes_project_exact_status_identity_and_fail_fast_state() {
        let entry = |module: &str, line: u64| RustdocMergedEntry {
            module: module.into(),
            display_name: format!("src/lib.rs - (line {line})"),
            path: "src/lib.rs".into(),
            line,
            ignored: false,
            no_run: false,
            should_panic: false,
        };
        let catalog = |line: u64| RustdocExtractedDoctest {
            file: "src/lib.rs".into(),
            line,
            doctest_attributes: RustdocDoctestAttributes {
                original: String::new(),
                should_panic: false,
                no_run: false,
                ignore: RustdocDoctestIgnore::None,
                rust: true,
                test_harness: false,
                compile_fail: false,
                standalone_crate: false,
                error_codes: Vec::new(),
                edition: None,
                added_css_classes: Vec::new(),
                unknown: Vec::new(),
            },
            original_code: "assert!(true);".into(),
            doctest_code: Some(RustdocDoctestCode {
                crate_level: String::new(),
                code: "assert!(true);".into(),
                wrapper: Some(RustdocDoctestWrapper {
                    before: "fn main() {".into(),
                    after: "}".into(),
                    returns_result: false,
                }),
            }),
            name: format!("src/lib.rs - (line {line})"),
        };
        let completed = |catalog_index, entry: RustdocMergedEntry, status| RustdocJoinedOutcome {
            catalog_index,
            catalog: catalog(entry.line),
            merged_entry: Some(entry.clone()),
            state: RustdocJoinedOutcomeState::Completed {
                outcome: RustdocTestOutcome {
                    display_name: entry.display_name,
                    status,
                    execution_seconds: Some(0.1),
                    stdout: None,
                    message: None,
                    reason: None,
                    timeout_warning: false,
                },
            },
        };
        let resolution = RustdocOutcomeResolution {
            groups: vec![RustdocOutcomeGroupJoin {
                invocation_id: "1".repeat(64),
                group: "fixture".into(),
                companion_build_id: "2".repeat(64),
                raw_catalog_sha256: "4".repeat(64),
                raw_events_sha256: "3".repeat(64),
                transport_sha256: "5".repeat(64),
                join: None,
                transport: RustTransportRead::empty(),
                entries: vec![
                    completed(0, entry("__doctest_0", 3), RustdocOutcomeStatus::Passed),
                    RustdocJoinedOutcome {
                        catalog_index: 1,
                        catalog: catalog(10),
                        merged_entry: Some(entry("__doctest_1", 10)),
                        state: RustdocJoinedOutcomeState::Unstarted,
                    },
                ],
                ambiguous_filtered_out: 0,
                ambiguous_unstarted_tests: 0,
            }],
            unmatched_maps: Vec::new(),
        };
        let normalized = NormalizedRustCompilerManifest {
            manifest: crate::coverage_report::CoverageManifest {
                unmeasured: Vec::new(),
                decisions: Vec::new(),
                points: Vec::new(),
                branches: Vec::new(),
                limitations: Vec::new(),
                scope: None,
            },
            hit_obligations_by_ordinal: std::collections::BTreeMap::new(),
            internal_ordinals: BTreeSet::new(),
            decision_outcome_obligations: std::collections::BTreeMap::new(),
            decision_loop_obligations: std::collections::BTreeMap::new(),
            decision_logical_selection_obligations: std::collections::BTreeMap::new(),
        };
        let (results, health) =
            doctest_raw_results("run", &resolution, 10, 20, &normalized).unwrap();
        assert_eq!(results.len(), 2);
        assert_eq!(health.len(), 1);
        assert_eq!(results[0].status.as_deref(), Some("passed"));
        assert_eq!(results[1].status.as_deref(), Some("unknown"));
        assert_eq!(results[0].retry, Some(0));
        assert_eq!(results[0].test_file.as_deref(), Some("src/lib.rs"));
        assert_eq!(
            results[0].test_id.as_deref(),
            Some("rust:doctest:fixture:src/lib.rs:3")
        );
        assert_eq!(results[0].scope.as_ref().unwrap().test_id, results[0].test);
        assert!(doctest_command_failed(&resolution));
        assert!(results[1].phases.is_empty());
        assert!(resolution.is_fully_catalogued());
    }
}
