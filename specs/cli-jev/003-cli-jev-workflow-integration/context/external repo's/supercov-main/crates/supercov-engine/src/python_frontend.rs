//! Development-only Python oracle importer backed by coverage.py's documented
//! API. This module is excluded from ordinary product builds and must never be
//! selected for a user run.
//!
//! The Python shim exports facts only. Rust validates the complete denominator,
//! preserves background evidence, constructs normalized obligations and then
//! invokes the same language-neutral analyzer used by every frontend.

use std::{
    collections::{BTreeMap, BTreeSet},
    path::{Component, Path},
};

use serde::Deserialize;
use serde_json::json;
use sha2::{Digest, Sha256};
use supercov_contracts::{
    AttributionPrecision, ExecutionModel, FrontendAttribution, FrontendLimitation,
    FrontendLimitationScope, FrontendRunDeclaration, FrontendRunnerDeclaration,
    LANGUAGE_FRONTEND_PROTOCOL_VERSION, StructuralSource,
};

use crate::{
    coverage_analysis::PointKind,
    coverage_report::{
        BranchAlternativeMeta, BranchMeta, CoverageManifest, CoverageModelDeclaration,
        CoveragePhase, CoverageReportRequest, ExecutionScope, ExitCodeInput,
        PersistedCoverageModel, PointMeta, RawTestResult, RuntimeEvent, RuntimeSnapshot,
        TestProvenance,
    },
    evidence_archive::EvidenceArchiveEntry,
};

pub const PYTHON_COVERAGE_IMPORT_SCHEMA_VERSION: u32 = 1;
const MCDC_LIMITATION: &str = "python-mcdc-unavailable";
const COLUMN_LIMITATION: &str = "python-column-location-unavailable";
const LOW_LEVEL_THREAD_LIMITATION: &str = "python-low-level-thread-context-unavailable";
const LOW_LEVEL_PROCESS_LIMITATION: &str = "python-low-level-process-coverage-unavailable";
const HARD_KILL_LIMITATION: &str = "python-hard-kill-evidence-unflushable";

fn python_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "python".into(),
        variant: "python-native-branch".into(),
        name: "python-coverage-py-tier-a-v1".into(),
        completeness_meaning: "Every executable statement and branch arc reported by the coverage.py oracle was observed; MC/DC, exact columns, assertion strength and product correctness remain separate limitations.".into(),
        measured: vec![
            "coverage.py executable statement lines".into(),
            "coverage.py branch arcs".into(),
            "pytest worker, test, retry and setup/test/teardown phase identity".into(),
        ],
        not_measured: vec![
            "atomic condition outcomes and masking MC/DC independence".into(),
            "exact source columns for statement and branch obligations".into(),
            "causal linkage to individual actions or passing assertions".into(),
            "causal test context for raw _thread or native-extension-created threads".into(),
            "child coverage outside Python subprocess.Popen and multiprocessing spawn adapters".into(),
            "in-memory coverage observations lost to SIGKILL or equivalent uncatchable termination".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonCoverageProducer {
    pub name: String,
    pub version: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonSourceLine {
    pub line: usize,
    pub source: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonCoverageFile {
    pub path: String,
    pub statements: Vec<usize>,
    pub excluded_lines: Vec<usize>,
    pub executed_lines: Vec<usize>,
    pub missing_lines: Vec<usize>,
    pub executed_branches: Vec<[i64; 2]>,
    pub missing_branches: Vec<[i64; 2]>,
    pub source_lines: Vec<PythonSourceLine>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonContextIdentity {
    pub run_id: String,
    pub worker_id: String,
    pub test_id: String,
    pub retry: usize,
    pub phase: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonContextFile {
    pub path: String,
    pub lines: Vec<usize>,
    pub arcs: Vec<[i64; 2]>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonCoverageContext {
    pub kind: String,
    pub identity: Option<PythonContextIdentity>,
    pub worker_id: String,
    pub files: Vec<PythonContextFile>,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PytestOutcome {
    pub run_id: String,
    pub worker_id: String,
    pub test_id: String,
    pub retry: usize,
    pub phase: String,
    pub outcome: String,
    pub was_xfail: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct PythonCoverageExport {
    pub schema_version: u32,
    pub producer: PythonCoverageProducer,
    pub runner: String,
    pub collector_core: String,
    pub branch: bool,
    pub root: String,
    pub files: Vec<PythonCoverageFile>,
    pub contexts: Vec<PythonCoverageContext>,
    pub outcomes: Vec<PytestOutcome>,
}

#[derive(Debug, Clone, PartialEq)]
pub struct PythonFrontendImport {
    pub declaration: FrontendRunDeclaration,
    pub request: CoverageReportRequest,
}

impl PythonFrontendImport {
    pub fn archive_entries(&self) -> Result<Vec<EvidenceArchiveEntry>, serde_json::Error> {
        let mut entries = vec![
            EvidenceArchiveEntry {
                path: "coverage-model.json".into(),
                contents: serde_json::to_vec(
                    &PersistedCoverageModel::from_declaration(
                        self.request
                            .coverage_model
                            .as_ref()
                            .expect("Python imports always declare a coverage model"),
                    )
                    .expect("Python coverage model is contract-valid"),
                )?,
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
        Ok(entries)
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PythonFrontendError {
    Json(String),
    UnsupportedSchema(u32),
    InvalidProducer,
    UnsupportedCollectorCore(String),
    BranchMeasurementRequired,
    InvalidRoot,
    InvalidRunner,
    InvalidPath(String),
    DuplicateFile(String),
    InvalidFile(String),
    InvalidContext(String),
    InvalidOutcome(String),
    RunMismatch(String),
    UnattributedExecutedLine(String, usize),
    UnattributedExecutedBranch(String, i64, i64),
}

impl std::fmt::Display for PythonFrontendError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Json(reason) => write!(formatter, "invalid Python coverage export: {reason}"),
            Self::UnsupportedSchema(version) => {
                write!(
                    formatter,
                    "unsupported Python coverage export schema: {version}"
                )
            }
            Self::InvalidProducer => {
                write!(formatter, "Python coverage producer must be coverage.py")
            }
            Self::UnsupportedCollectorCore(core) => write!(
                formatter,
                "coverage.py collector core {core:?} cannot claim exact contexts"
            ),
            Self::BranchMeasurementRequired => {
                write!(formatter, "coverage.py branch mode is required")
            }
            Self::InvalidRoot => write!(formatter, "Python coverage export root must be '.'"),
            Self::InvalidRunner => {
                write!(formatter, "Python Tier-A import currently requires pytest")
            }
            Self::InvalidPath(path) => write!(formatter, "invalid Python source path: {path}"),
            Self::DuplicateFile(path) => write!(formatter, "duplicate Python source file: {path}"),
            Self::InvalidFile(path) => {
                write!(formatter, "inconsistent Python coverage facts: {path}")
            }
            Self::InvalidContext(reason) => {
                write!(formatter, "invalid Python coverage context: {reason}")
            }
            Self::InvalidOutcome(reason) => write!(formatter, "invalid pytest outcome: {reason}"),
            Self::RunMismatch(actual) => {
                write!(formatter, "Python evidence belongs to run {actual}")
            }
            Self::UnattributedExecutedLine(file, line) => {
                write!(
                    formatter,
                    "executed Python line has no context: {file}:{line}"
                )
            }
            Self::UnattributedExecutedBranch(file, from, to) => write!(
                formatter,
                "executed Python branch has no context: {file}:{from}->{to}"
            ),
        }
    }
}

impl std::error::Error for PythonFrontendError {}

fn valid_relative_path(value: &str) -> bool {
    !value.is_empty()
        && !value.contains('\\')
        && Path::new(value)
            .components()
            .all(|part| matches!(part, Component::Normal(_)))
}

fn is_sorted_unique<T: Ord>(values: &[T]) -> bool {
    values.windows(2).all(|pair| pair[0] < pair[1])
}

fn line_id(file: &str, line: usize) -> String {
    format!("python:statement:{file}:{line}")
}

fn branch_id(file: &str, line: i64) -> String {
    format!("python:branch:{file}:{line}")
}

fn alternative_id(file: &str, from: i64, to: i64) -> String {
    format!("python:arc:{file}:{from}:{to}")
}

fn stable_id(prefix: &str, values: &[&str]) -> String {
    let mut digest = Sha256::new();
    for value in values {
        digest.update((value.len() as u64).to_be_bytes());
        digest.update(value.as_bytes());
    }
    format!("{prefix}:{:x}", digest.finalize())
}

fn validate_file(file: &PythonCoverageFile) -> Result<(), PythonFrontendError> {
    if !valid_relative_path(&file.path) {
        return Err(PythonFrontendError::InvalidPath(file.path.clone()));
    }
    if file.statements.is_empty()
        || !is_sorted_unique(&file.statements)
        || file.statements.contains(&0)
        || !is_sorted_unique(&file.executed_lines)
        || !is_sorted_unique(&file.missing_lines)
        || !is_sorted_unique(&file.excluded_lines)
        || !is_sorted_unique(&file.executed_branches)
        || !is_sorted_unique(&file.missing_branches)
    {
        return Err(PythonFrontendError::InvalidFile(file.path.clone()));
    }
    let statements = file.statements.iter().copied().collect::<BTreeSet<_>>();
    let executed = file.executed_lines.iter().copied().collect::<BTreeSet<_>>();
    let missing = file.missing_lines.iter().copied().collect::<BTreeSet<_>>();
    if !executed.is_disjoint(&missing)
        || executed.union(&missing).copied().collect::<BTreeSet<_>>() != statements
    {
        return Err(PythonFrontendError::InvalidFile(file.path.clone()));
    }
    let executed_branches = file
        .executed_branches
        .iter()
        .copied()
        .collect::<BTreeSet<_>>();
    let missing_branches = file
        .missing_branches
        .iter()
        .copied()
        .collect::<BTreeSet<_>>();
    if !executed_branches.is_disjoint(&missing_branches)
        || executed_branches
            .union(&missing_branches)
            .any(|arc| arc[0] <= 0 || arc[1] == 0)
    {
        return Err(PythonFrontendError::InvalidFile(file.path.clone()));
    }
    let source_lines = file
        .source_lines
        .iter()
        .map(|source| source.line)
        .collect::<BTreeSet<_>>();
    if source_lines.len() != file.source_lines.len() || source_lines != statements {
        return Err(PythonFrontendError::InvalidFile(file.path.clone()));
    }
    Ok(())
}

fn validate_export(export: &PythonCoverageExport, run_id: &str) -> Result<(), PythonFrontendError> {
    if export.schema_version != PYTHON_COVERAGE_IMPORT_SCHEMA_VERSION {
        return Err(PythonFrontendError::UnsupportedSchema(
            export.schema_version,
        ));
    }
    if export.producer.name != "coverage.py" || export.producer.version.trim().is_empty() {
        return Err(PythonFrontendError::InvalidProducer);
    }
    if !matches!(export.collector_core.as_str(), "ctrace" | "pytrace") {
        return Err(PythonFrontendError::UnsupportedCollectorCore(
            export.collector_core.clone(),
        ));
    }
    if !export.branch {
        return Err(PythonFrontendError::BranchMeasurementRequired);
    }
    if export.root != "." {
        return Err(PythonFrontendError::InvalidRoot);
    }
    if export.runner != "pytest" {
        return Err(PythonFrontendError::InvalidRunner);
    }
    let mut files = BTreeSet::new();
    for file in &export.files {
        validate_file(file)?;
        if !files.insert(file.path.clone()) {
            return Err(PythonFrontendError::DuplicateFile(file.path.clone()));
        }
    }
    if files.is_empty() {
        return Err(PythonFrontendError::InvalidFile("no measured files".into()));
    }
    for context in &export.contexts {
        if !matches!(context.kind.as_str(), "test-phase" | "background")
            || context.worker_id.trim().is_empty()
            || (context.kind == "test-phase") != context.identity.is_some()
        {
            return Err(PythonFrontendError::InvalidContext(context.kind.clone()));
        }
        if let Some(identity) = &context.identity {
            if identity.run_id != run_id {
                return Err(PythonFrontendError::RunMismatch(identity.run_id.clone()));
            }
            if identity.worker_id != context.worker_id
                || identity.test_id.trim().is_empty()
                || !matches!(identity.phase.as_str(), "setup" | "call" | "teardown")
            {
                return Err(PythonFrontendError::InvalidContext(
                    identity.test_id.clone(),
                ));
            }
        }
        for observation in &context.files {
            let Some(file) = export
                .files
                .iter()
                .find(|file| file.path == observation.path)
            else {
                return Err(PythonFrontendError::InvalidContext(
                    observation.path.clone(),
                ));
            };
            if !is_sorted_unique(&observation.lines)
                || !is_sorted_unique(&observation.arcs)
                || observation
                    .lines
                    .iter()
                    .any(|line| !file.executed_lines.contains(line))
            {
                return Err(PythonFrontendError::InvalidContext(
                    observation.path.clone(),
                ));
            }
        }
    }
    // One outcome per (worker, test, retry, phase), and a repeat is refused
    // rather than folded. The product frontend folds instead, because a runner
    // does repeat a phase -- pytest-subtests reports every subtest under one
    // node id and one `call` phase, which cost a run in #40. That fold is
    // right there and wrong here: this importer exists to disagree with the
    // product independently, and an oracle that quietly accepts a shape it was
    // not built for reports agreement it did not establish. Its inputs are
    // fixtures written by its own tests, never a real suite, so there is no
    // repeat to accept. Widen it only together with a fixture that repeats.
    let mut outcome_keys = BTreeSet::new();
    for outcome in &export.outcomes {
        if outcome.run_id != run_id {
            return Err(PythonFrontendError::RunMismatch(outcome.run_id.clone()));
        }
        if outcome.worker_id.trim().is_empty()
            || outcome.test_id.trim().is_empty()
            || !matches!(outcome.phase.as_str(), "setup" | "call" | "teardown")
            || !matches!(
                outcome.outcome.as_str(),
                "passed" | "failed" | "skipped" | "rerun"
            )
            || !outcome_keys.insert((
                outcome.worker_id.as_str(),
                outcome.test_id.as_str(),
                outcome.retry,
                outcome.phase.as_str(),
            ))
        {
            return Err(PythonFrontendError::InvalidOutcome(outcome.test_id.clone()));
        }
    }
    Ok(())
}

fn phase_id(run: &str, worker: &str, test: &str, retry: usize, phase: &str) -> String {
    stable_id(
        "python-phase",
        &[run, worker, test, &retry.to_string(), phase],
    )
}

fn test_status(outcomes: &[&PytestOutcome]) -> String {
    if outcomes
        .iter()
        .any(|outcome| matches!(outcome.outcome.as_str(), "failed" | "rerun"))
    {
        "failed"
    } else if outcomes.iter().any(|outcome| outcome.outcome == "skipped") {
        "skipped"
    } else {
        "passed"
    }
    .into()
}

fn scope(run: &str, worker: &str, test: &str, retry: usize) -> ExecutionScope {
    ExecutionScope {
        version: 1,
        run_id: run.into(),
        worker_id: worker.into(),
        test_id: test.into(),
        test_key: stable_id("python-test", &[worker, test]),
        retry,
        attempt_id: stable_id("python-attempt", &[run, worker, test, &retry.to_string()]),
    }
}

fn snapshot_for_context(
    context: &PythonCoverageContext,
    phase: &str,
    manifest_files: &BTreeMap<&str, &PythonCoverageFile>,
    branch_alternatives: &BTreeSet<(String, i64, i64)>,
) -> RuntimeSnapshot {
    let mut hits = BTreeSet::new();
    for observation in &context.files {
        for line in &observation.lines {
            hits.insert(line_id(&observation.path, *line));
        }
        for [from, to] in &observation.arcs {
            if branch_alternatives.contains(&(observation.path.clone(), *from, *to)) {
                hits.insert(alternative_id(&observation.path, *from, *to));
            }
        }
    }
    let _ = manifest_files;
    let events = hits
        .iter()
        .enumerate()
        .map(|(index, id)| RuntimeEvent {
            event_type: "hit".into(),
            id: id.clone(),
            vector: None,
            timestamp_ms: index as i64 + 1,
            phase_id: Some(phase.into()),
            statement_id: None,
            environment: "python".into(),
        })
        .collect();
    RuntimeSnapshot {
        decisions: Vec::new(),
        hits: hits.into_iter().collect(),
        events,
        logicals: Vec::new(),
        phase_id: None,
    }
}

pub fn import_python_coverage_json(
    bytes: &[u8],
    run_id: &str,
    generated_at: &str,
    test_exit_code: Option<i32>,
) -> Result<PythonFrontendImport, PythonFrontendError> {
    let export: PythonCoverageExport = serde_json::from_slice(bytes)
        .map_err(|error| PythonFrontendError::Json(error.to_string()))?;
    validate_export(&export, run_id)?;

    let source_by_file = export
        .files
        .iter()
        .map(|file| {
            (
                file.path.as_str(),
                file.source_lines
                    .iter()
                    .map(|line| (line.line, line.source.as_str()))
                    .collect::<BTreeMap<_, _>>(),
            )
        })
        .collect::<BTreeMap<_, _>>();
    let points = export
        .files
        .iter()
        .flat_map(|file| {
            file.statements.iter().map(|line| PointMeta {
                id: line_id(&file.path, *line),
                kind: PointKind::Statement,
                file: file.path.clone(),
                line: *line,
                column: 1,
                source: source_by_file[file.path.as_str()][line].into(),
                label: None,
            })
        })
        .collect::<Vec<_>>();
    let mut arcs_by_line = BTreeMap::<(String, i64), BTreeSet<i64>>::new();
    for file in &export.files {
        for [from, to] in file.executed_branches.iter().chain(&file.missing_branches) {
            arcs_by_line
                .entry((file.path.clone(), *from))
                .or_default()
                .insert(*to);
        }
    }
    let branch_alternatives = arcs_by_line
        .iter()
        .flat_map(|((file, from), destinations)| {
            destinations.iter().map(|to| (file.clone(), *from, *to))
        })
        .collect::<BTreeSet<_>>();
    let branches = arcs_by_line
        .iter()
        .map(|((file, from), destinations)| BranchMeta {
            id: branch_id(file, *from),
            kind: "python-arc".into(),
            file: file.clone(),
            line: *from as usize,
            column: 1,
            source: source_by_file[file.as_str()][&(*from as usize)].into(),
            alternatives: destinations
                .iter()
                .map(|to| BranchAlternativeMeta {
                    id: alternative_id(file, *from, *to),
                    label: format!("{from} -> {to}"),
                })
                .collect(),
        })
        .collect::<Vec<_>>();
    let limitation_file = export.files[0].path.clone();
    let limitations = vec![
        json!({
            "id": COLUMN_LIMITATION,
            "kind": "semantic-safety",
            "file": limitation_file,
            "line": 1,
            "column": 1,
            "source": "",
            "reason": "coverage.py reports Python obligations at line and arc granularity, without exact source columns"
        }),
        json!({
            "id": MCDC_LIMITATION,
            "kind": "semantic-safety",
            "file": export.files[0].path,
            "line": 1,
            "column": 1,
            "source": "",
            "reason": "coverage.py does not expose atomic-condition vectors or masking MC/DC witnesses"
        }),
        json!({
            "id": LOW_LEVEL_THREAD_LIMITATION,
            "kind": "semantic-safety",
            "file": export.files[0].path,
            "line": 1,
            "column": 1,
            "source": "",
            "reason": "raw _thread and native-extension-created threads do not pass through the proven causal-context adapter"
        }),
        json!({
            "id": LOW_LEVEL_PROCESS_LIMITATION,
            "kind": "semantic-safety",
            "file": export.files[0].path,
            "line": 1,
            "column": 1,
            "source": "",
            "reason": "low-level os spawn, exec, system, fork, and forkserver surfaces are not yet proven by the Python child-process adapter"
        }),
        json!({
            "id": HARD_KILL_LIMITATION,
            "kind": "semantic-safety",
            "file": export.files[0].path,
            "line": 1,
            "column": 1,
            "source": "",
            "reason": "coverage.py stores observations in worker memory, so SIGKILL and equivalent uncatchable termination cannot flush pre-crash evidence"
        }),
    ];

    let manifest_files = export
        .files
        .iter()
        .map(|file| (file.path.as_str(), file))
        .collect::<BTreeMap<_, _>>();
    let mut raw_results = Vec::new();
    let grouped_outcomes = export.outcomes.iter().fold(
        BTreeMap::<(String, String, usize), Vec<&PytestOutcome>>::new(),
        |mut grouped, outcome| {
            grouped
                .entry((
                    outcome.worker_id.clone(),
                    outcome.test_id.clone(),
                    outcome.retry,
                ))
                .or_default()
                .push(outcome);
            grouped
        },
    );
    for ((worker, test, retry), mut outcomes) in grouped_outcomes {
        outcomes.sort_by_key(|outcome| match outcome.phase.as_str() {
            "setup" => 0,
            "call" => 1,
            _ => 2,
        });
        let phases = outcomes
            .iter()
            .enumerate()
            .map(|(index, outcome)| CoveragePhase {
                id: phase_id(run_id, &worker, &test, retry, &outcome.phase),
                kind: match outcome.phase.as_str() {
                    "call" => "test",
                    value => value,
                }
                .into(),
                operation: format!("pytest {}", outcome.phase),
                source: Some(test.clone()),
                caused_by_phase_id: None,
                started_at_ms: index as i64 * 2 + 1,
                ended_at_ms: Some(index as i64 * 2 + 2),
                status: Some(outcome.outcome.clone()),
                error: None,
            })
            .collect::<Vec<_>>();
        let runtime = export
            .contexts
            .iter()
            .filter(|context| {
                context.identity.as_ref().is_some_and(|identity| {
                    identity.worker_id == worker
                        && identity.test_id == test
                        && identity.retry == retry
                })
            })
            .map(|context| {
                let identity = context.identity.as_ref().expect("filtered identity");
                snapshot_for_context(
                    context,
                    &phase_id(run_id, &worker, &test, retry, &identity.phase),
                    &manifest_files,
                    &branch_alternatives,
                )
            })
            .collect();
        raw_results.push(RawTestResult {
            test_id: Some(test.clone()),
            scope: Some(scope(run_id, &worker, &test, retry)),
            test: test.clone(),
            test_file: test.split("::").next().map(str::to_owned),
            title: test.rsplit("::").next().map(str::to_owned),
            retry: Some(retry),
            status: Some(test_status(&outcomes)),
            expected_status: Some(
                if outcomes.iter().any(|outcome| outcome.was_xfail) {
                    "failed"
                } else {
                    "passed"
                }
                .into(),
            ),
            flaky: false,
            provenance: TestProvenance {
                runner: export.runner.clone(),
                kind: "unknown".into(),
                project: None,
                source: "python-coverage-v1".into(),
            },
            role: "test".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases,
            runtime,
            browser: Vec::new(),
            server: Vec::new(),
        });
    }
    for context in export
        .contexts
        .iter()
        .filter(|context| context.kind == "background")
    {
        let test = format!("__supercov_background__:{}", context.worker_id);
        let phase = phase_id(run_id, &context.worker_id, &test, 0, "background");
        raw_results.push(RawTestResult {
            test_id: Some(test.clone()),
            scope: Some(scope(run_id, &context.worker_id, &test, 0)),
            test: "Python background execution".into(),
            test_file: None,
            title: None,
            retry: Some(0),
            status: Some("unknown".into()),
            expected_status: None,
            flaky: false,
            provenance: TestProvenance {
                runner: export.runner.clone(),
                kind: "unknown".into(),
                project: None,
                source: "python-coverage-v1".into(),
            },
            role: "background".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: vec![CoveragePhase {
                id: phase.clone(),
                kind: "background".into(),
                operation: "Python import and collection background".into(),
                source: None,
                caused_by_phase_id: None,
                started_at_ms: 0,
                ended_at_ms: Some(0),
                status: Some("passed".into()),
                error: None,
            }],
            runtime: vec![snapshot_for_context(
                context,
                &phase,
                &manifest_files,
                &branch_alternatives,
            )],
            browser: Vec::new(),
            server: Vec::new(),
        });
    }

    let observed_hits = raw_results
        .iter()
        .flat_map(|raw| raw.runtime.iter())
        .flat_map(|snapshot| snapshot.hits.iter())
        .cloned()
        .collect::<BTreeSet<_>>();
    for file in &export.files {
        for line in &file.executed_lines {
            if !observed_hits.contains(&line_id(&file.path, *line)) {
                return Err(PythonFrontendError::UnattributedExecutedLine(
                    file.path.clone(),
                    *line,
                ));
            }
        }
        for [from, to] in &file.executed_branches {
            if !observed_hits.contains(&alternative_id(&file.path, *from, *to)) {
                return Err(PythonFrontendError::UnattributedExecutedBranch(
                    file.path.clone(),
                    *from,
                    *to,
                ));
            }
        }
    }

    let declaration = FrontendRunDeclaration {
        protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
        frontend_id: "python".into(),
        frontend_version: "python-coverage-v1".into(),
        language: "python".into(),
        structural_source: StructuralSource::NativeImport,
        runners: vec![FrontendRunnerDeclaration {
            runner: export.runner,
            execution_model: ExecutionModel::ParallelContextPropagated,
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
                    id: "python-action-linkage".into(),
                    scopes: vec![FrontendLimitationScope::Action],
                    reason: "pytest exposes no general action lifecycle".into(),
                },
                FrontendLimitation {
                    id: "python-assertion-linkage".into(),
                    scopes: vec![FrontendLimitationScope::Assertion],
                    reason: "pytest phase outcomes do not identify each passing assertion or the obligations caused by it".into(),
                },
            ],
        }],
        structural_limitations: vec![
            COLUMN_LIMITATION.into(),
            HARD_KILL_LIMITATION.into(),
            LOW_LEVEL_PROCESS_LIMITATION.into(),
            LOW_LEVEL_THREAD_LIMITATION.into(),
            MCDC_LIMITATION.into(),
        ],
    };
    Ok(PythonFrontendImport {
        declaration,
        request: CoverageReportRequest {
            run_id: run_id.into(),
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: Vec::new(),
                points,
                branches,
                limitations,
                scope: None,
            },
            raw_results,
            generated_at: generated_at.into(),
            coverage_model: Some(python_coverage_model()),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(test_exit_code),
        },
    })
}

#[cfg(test)]
mod tests {
    use std::{fs, time::SystemTime};

    use super::*;
    use crate::{
        coverage_report::{ArchiveReportRequest, analyze_coverage_archive},
        evidence_archive::write_archive,
        frontend_protocol::{analyze_frontend_results, validate_frontend_report_request},
    };

    const GOLDEN: &[u8] = include_bytes!("../test-assets/python-coverage-v1/pytest-basic.json");
    const XDIST_GOLDEN: &[u8] =
        include_bytes!("../test-assets/python-coverage-v1/pytest-xdist.json");
    const OUTCOMES_GOLDEN: &[u8] =
        include_bytes!("../test-assets/python-coverage-v1/pytest-outcomes.json");
    const RETRY_GOLDEN: &[u8] =
        include_bytes!("../test-assets/python-coverage-v1/pytest-retry.json");
    const CONCURRENCY_GOLDEN: &[u8] =
        include_bytes!("../test-assets/python-coverage-v1/pytest-concurrency.json");
    const WORKER_CRASH_GOLDEN: &[u8] =
        include_bytes!("../test-assets/python-coverage-v1/pytest-worker-crash.json");
    const PATHS_GOLDEN: &[u8] =
        include_bytes!("../test-assets/python-coverage-v1/pytest-paths.json");

    #[test]
    fn imports_the_coverage_py_oracle_without_inventing_assertion_or_mcdc_facts() {
        let imported = import_python_coverage_json(
            GOLDEN,
            "python-tier-a-ctrace",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        validate_frontend_report_request(&imported.declaration, &imported.request).unwrap();
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.lines.total
            ),
            (10, 12)
        );
        assert_eq!(
            (
                report.view.summary.branches.covered,
                report.view.summary.branches.total
            ),
            (6, 8)
        );
        assert_eq!(report.view.summary.decisions, 0);
        assert_eq!(report.view.variant, "python-native-branch");
        assert!(
            report
                .view
                .model
                .not_measured
                .iter()
                .any(|item| item.contains("MC/DC"))
        );
        assert_eq!(report.view.limitations.len(), 5);
        assert_eq!(
            report
                .view
                .tests
                .iter()
                .filter(|test| test.role == "test")
                .count(),
            2
        );
        assert!(
            report
                .view
                .lines
                .iter()
                .all(|line| !line.confidence.asserted)
        );
        assert!(
            report
                .view
                .lines
                .iter()
                .filter(|line| matches!(line.line, 1 | 9))
                .all(|line| line.confidence.background_only)
        );
    }

    #[test]
    fn refuses_context_inexact_sysmon_exports() {
        let mut value: serde_json::Value = serde_json::from_slice(GOLDEN).unwrap();
        value["collectorCore"] = "sysmon".into();
        assert!(matches!(
            import_python_coverage_json(
                &serde_json::to_vec(&value).unwrap(),
                "python-tier-a-ctrace",
                "2026-08-25T00:00:00.000Z",
                Some(0)
            ),
            Err(PythonFrontendError::UnsupportedCollectorCore(core)) if core == "sysmon"
        ));
    }

    #[test]
    fn keeps_xdist_workers_and_their_background_imports_separate() {
        let imported = import_python_coverage_json(
            XDIST_GOLDEN,
            "python-tier-a-xdist2",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.lines.total,
                report.view.summary.branches.covered,
                report.view.summary.branches.total,
            ),
            (10, 12, 6, 8)
        );
        let workers = imported
            .request
            .raw_results
            .iter()
            .map(|result| result.scope.as_ref().unwrap().worker_id.as_str())
            .collect::<BTreeSet<_>>();
        assert_eq!(workers, BTreeSet::from(["gw0", "gw1"]));
        assert_eq!(
            imported
                .request
                .raw_results
                .iter()
                .filter(|result| result.role == "background")
                .count(),
            2
        );
    }

    #[test]
    fn filters_real_pytest_outcomes_without_verifying_background_or_xfail() {
        let imported = import_python_coverage_json(
            OUTCOMES_GOLDEN,
            "python-tier-a-outcomes2",
            "2026-08-25T00:00:00.000Z",
            Some(1),
        )
        .unwrap();
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.lines.total,
                report.view.summary.branches.covered,
                report.view.summary.branches.total,
            ),
            (11, 12, 7, 8)
        );
        assert_eq!(
            (
                report.filters.passed.summary.lines.covered,
                report.filters.passed.summary.branches.covered,
                report.filters.failed.summary.lines.covered,
                report.filters.failed.summary.branches.covered,
            ),
            (3, 2, 7, 5)
        );
        assert!(!report.execution.as_ref().unwrap().valid);
        let outcomes = report
            .view
            .tests
            .iter()
            .filter(|test| test.role == "test")
            .fold(BTreeMap::<&str, usize>::new(), |mut counts, test| {
                *counts.entry(&test.outcome).or_default() += 1;
                counts
            });
        assert_eq!(
            outcomes,
            BTreeMap::from([("failed", 3), ("passed", 1), ("skipped", 2)])
        );
        assert!(
            report
                .filters
                .passed
                .tests
                .iter()
                .all(|test| !test.name.contains("expected_failure"))
        );
        assert!(
            report
                .filters
                .passed
                .tests
                .iter()
                .all(|test| test.role != "background")
        );
        assert!(
            report
                .view
                .lines
                .iter()
                .find(|line| line.line == 5)
                .unwrap()
                .confidence
                .setup_only
        );
    }

    #[test]
    fn preserves_the_supervised_exit_code_and_expected_failure_semantics() {
        let mut value: serde_json::Value = serde_json::from_slice(GOLDEN).unwrap();
        value["outcomes"][0]["wasXfail"] = true.into();
        let imported = import_python_coverage_json(
            &serde_json::to_vec(&value).unwrap(),
            "python-tier-a-ctrace",
            "2026-08-25T00:00:00.000Z",
            Some(1),
        )
        .unwrap();
        assert_eq!(
            imported.request.test_exit_code,
            ExitCodeInput::Present(Some(1))
        );
        let expected_failure = imported
            .request
            .raw_results
            .iter()
            .find(|result| result.test.ends_with("test_positive_path"))
            .unwrap();
        assert_eq!(expected_failure.expected_status.as_deref(), Some("failed"));
    }

    #[test]
    fn keeps_retry_attempts_separate_and_verifies_only_the_terminal_pass() {
        let imported = import_python_coverage_json(
            RETRY_GOLDEN,
            "python-tier-a-retry2",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.branches.covered,
                report.filters.passed.summary.lines.covered,
                report.filters.passed.summary.branches.covered,
                report.filters.failed.summary.lines.covered,
                report.filters.failed.summary.branches.covered,
            ),
            (6, 3, 3, 2, 2, 1)
        );
        let attempts = imported
            .request
            .raw_results
            .iter()
            .filter(|result| result.role == "test")
            .map(|result| (result.retry.unwrap(), result.status.as_deref().unwrap()))
            .collect::<BTreeMap<_, _>>();
        assert_eq!(attempts, BTreeMap::from([(0, "failed"), (1, "passed")]));
        assert_eq!(
            report
                .view
                .tests
                .iter()
                .find(|test| test.role == "test")
                .unwrap()
                .outcome,
            "flaky"
        );
    }

    #[test]
    fn preserves_causal_context_across_async_threads_and_processes() {
        let imported = import_python_coverage_json(
            CONCURRENCY_GOLDEN,
            "python-tier-a-concurrency",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        assert_eq!(
            imported.declaration.runners[0].execution_model,
            ExecutionModel::ParallelContextPropagated
        );
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.lines.total,
                report.view.summary.branches.covered,
                report.view.summary.branches.total,
                report.filters.passed.summary.lines.covered,
                report.filters.passed.summary.branches.covered,
            ),
            (7, 12, 4, 8, 7, 4)
        );
        let tests = report
            .view
            .tests
            .iter()
            .filter(|test| test.role == "test")
            .collect::<Vec<_>>();
        assert_eq!(tests.len(), 14);
        assert!(tests.iter().all(|test| test.outcome == "passed"));

        let lines_for = |suffix: &str| {
            tests
                .iter()
                .find(|test| test.name.ends_with(suffix))
                .unwrap()
                .lines
                .iter()
                .map(|line| line.line)
                .collect::<BTreeSet<_>>()
        };
        assert_eq!(
            lines_for("test_starts_work_that_outlives_its_phase"),
            BTreeSet::from([10, 11])
        );
        assert_eq!(
            lines_for("test_starts_a_late_python_subprocess"),
            BTreeSet::from([1, 9, 10, 12, 14])
        );
        assert!(lines_for("test_releases_prior_subprocess_without_claiming_it").is_empty());
        assert_eq!(
            lines_for("test_starts_an_async_task_that_outlives_the_test"),
            BTreeSet::from([10, 11])
        );
    }

    #[test]
    fn joins_xdist_worker_crash_evidence_to_the_exact_rerun_attempt() {
        let imported = import_python_coverage_json(
            WORKER_CRASH_GOLDEN,
            "python-tier-a-worker-crash1",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.branches.covered,
                report.filters.passed.summary.lines.covered,
                report.filters.passed.summary.branches.covered,
                report.filters.failed.summary.lines.covered,
                report.filters.failed.summary.branches.covered,
            ),
            (6, 3, 3, 2, 2, 1)
        );
        let attempts = imported
            .request
            .raw_results
            .iter()
            .filter(|result| result.role == "test")
            .map(|result| {
                (
                    (
                        result.scope.as_ref().unwrap().worker_id.as_str(),
                        result.retry.unwrap(),
                    ),
                    result.status.as_deref().unwrap(),
                )
            })
            .collect::<BTreeMap<_, _>>();
        assert_eq!(
            attempts,
            BTreeMap::from([(("gw0", 0), "failed"), (("gw1", 1), "passed")])
        );
        assert_eq!(
            report
                .view
                .tests
                .iter()
                .find(|test| test.role == "test")
                .unwrap()
                .outcome,
            "flaky"
        );
    }

    #[test]
    fn preserves_multiple_roots_physical_aliases_unicode_and_generated_paths() {
        let imported = import_python_coverage_json(
            PATHS_GOLDEN,
            "python-tier-a-paths2",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        let report = analyze_frontend_results(&imported.declaration, &imported.request).unwrap();
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.lines.total,
                report.view.summary.branches.covered,
                report.view.summary.branches.total,
            ),
            (13, 16, 5, 8)
        );
        let files = report
            .view
            .lines
            .iter()
            .map(|line| line.file.as_str())
            .collect::<BTreeSet<_>>();
        assert_eq!(
            files,
            BTreeSet::from([
                "generated_src/runtime_generated.py",
                "other_src/secondary.py",
                "path_src/namespace_pkg/plugin.py",
                "path_src/unicodé space/module.py",
            ])
        );
        assert_eq!(
            report
                .view
                .lines
                .iter()
                .filter(|line| line.file == "path_src/namespace_pkg/plugin.py")
                .count(),
            4
        );
        assert_eq!(
            report
                .view
                .tests
                .iter()
                .filter(|test| test.role == "test")
                .count(),
            4
        );
    }

    #[test]
    fn persists_and_reanalyzes_the_language_model_through_archive_v3() {
        let imported = import_python_coverage_json(
            GOLDEN,
            "python-tier-a-ctrace",
            "2026-08-25T00:00:00.000Z",
            Some(0),
        )
        .unwrap();
        let nonce = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-python-archive-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(&root).unwrap();
        let archive = root.join("evidence.raw.gz");
        write_archive(imported.archive_entries().unwrap(), &archive).unwrap();
        let report = analyze_coverage_archive(&ArchiveReportRequest {
            archive_path: archive,
            run_id: "python-tier-a-ctrace".into(),
            generated_at: "2026-08-25T00:00:00.000Z".into(),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(0)),
        })
        .unwrap();
        assert_eq!(report.view.variant, "python-native-branch");
        assert_eq!(
            (
                report.view.summary.lines.covered,
                report.view.summary.lines.total,
                report.view.summary.branches.covered,
                report.view.summary.branches.total,
            ),
            (10, 12, 6, 8)
        );
        assert!(!report.view.summary.coverage_complete);

        let invalid_archive = root.join("invalid-evidence.raw.gz");
        let mut invalid_entries = imported.archive_entries().unwrap();
        let model = invalid_entries
            .iter_mut()
            .find(|entry| entry.path == "coverage-model.json")
            .unwrap();
        let mut invalid_model: serde_json::Value = serde_json::from_slice(&model.contents).unwrap();
        invalid_model["coverageVerdict"] = serde_json::json!(100);
        model.contents = serde_json::to_vec(&invalid_model).unwrap();
        write_archive(invalid_entries, &invalid_archive).unwrap();
        assert!(matches!(
            analyze_coverage_archive(&ArchiveReportRequest {
                archive_path: invalid_archive,
                run_id: "python-tier-a-ctrace".into(),
                generated_at: "2026-08-25T00:00:00.000Z".into(),
                integrity: None,
                test_exit_code: ExitCodeInput::Present(Some(0)),
            }),
            Err(crate::coverage_report::ReportError::InvalidJson { path, .. })
                if path == "coverage-model.json"
        ));
        fs::remove_dir_all(root).unwrap();
    }

    #[test]
    fn refuses_denominator_and_context_drift() {
        let mut value: serde_json::Value = serde_json::from_slice(GOLDEN).unwrap();
        value["files"][0]["missingLines"] = serde_json::json!([6]);
        assert!(matches!(
            import_python_coverage_json(
                &serde_json::to_vec(&value).unwrap(),
                "python-tier-a-ctrace",
                "2026-08-25T00:00:00.000Z",
                Some(0)
            ),
            Err(PythonFrontendError::InvalidFile(_))
        ));

        let mut value: serde_json::Value = serde_json::from_slice(GOLDEN).unwrap();
        value["contexts"][1]["files"][0]["lines"] = serde_json::json!([2, 999]);
        assert!(matches!(
            import_python_coverage_json(
                &serde_json::to_vec(&value).unwrap(),
                "python-tier-a-ctrace",
                "2026-08-25T00:00:00.000Z",
                Some(0)
            ),
            Err(PythonFrontendError::InvalidContext(_))
        ));
    }
}
