//! Stable Cargo/libtest execution for the owned Rust frontend.
//!
//! Source preparation happens in an isolated workspace. For `cargo test`,
//! Cargo builds each test artifact once and every libtest case then runs in a
//! process of its own with an evidence directory of its own, so attribution
//! is exact by construction; doctests run through `rust_owned_doctests`, with
//! this program standing in for rustdoc. For `cargo nextest run`, nextest
//! keeps its own scheduling and retries and this program serves as its target
//! runner (`rust_owned_nextest`), recording each attempt it launches.

use std::{
    collections::{BTreeMap, BTreeSet},
    ffi::OsString,
    fs,
    io::Write,
    path::{Component, Path, PathBuf},
    process::{Command, Output},
    sync::{
        Mutex,
        atomic::{AtomicUsize, Ordering},
    },
    time::Instant,
};

use serde::Deserialize;
use supercov_contracts::{
    AttributionPrecision, ExecutionModel, FrontendAttribution, FrontendLimitation,
    FrontendLimitationScope, FrontendRunDeclaration, FrontendRunnerDeclaration,
    LANGUAGE_FRONTEND_PROTOCOL_VERSION, StructuralSource,
};

use crate::{
    coverage_analysis::McdcVector,
    coverage_report::{
        CoverageManifest, CoverageModelDeclaration, CoveragePhase, CoverageReportRequest,
        DecisionMeta, DecisionSnapshot, ExecutionScope, ExitCodeInput, PersistedCoverageModel,
        RawTestResult, RuntimeEvent, RuntimeSnapshot, TestProvenance,
    },
    evidence_archive::EvidenceArchiveEntry,
    rust_project::PreparedRustProject,
    rust_runtime::{RustProbeObservation, read_rust_probe_directory},
    rust_test_context::preflight_rust_test_contexts,
};

#[derive(Debug, Clone, PartialEq)]
pub struct RustFrontendRun {
    pub declaration: FrontendRunDeclaration,
    pub request: CoverageReportRequest,
    pub exit_code: i32,
    pub artifacts: usize,
    pub artifact_files: Vec<PathBuf>,
    pub build_ms: f64,
    pub execution_ms: f64,
}

impl RustFrontendRun {
    pub fn archive_entries(&self) -> Result<Vec<EvidenceArchiveEntry>, serde_json::Error> {
        let model = PersistedCoverageModel::from_declaration(
            self.request
                .coverage_model
                .as_ref()
                .expect("Rust frontend always declares a coverage model"),
        )
        .expect("Rust coverage model is contract-valid");
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
        Ok(entries)
    }
}

#[derive(Debug)]
pub enum RustTestRunnerError {
    UnsupportedCommand(String),
    Launch(String),
    CargoFailed(String),
    CargoJson(String),
    UnsafeArtifact(String),
    ListFailed(String),
    Probe(String),
    Context(String),
    UnknownProbe(String),
    InvalidVector {
        id: String,
        expected: usize,
        actual: usize,
    },
    Json(serde_json::Error),
    Io(String),
}

impl std::fmt::Display for RustTestRunnerError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::UnsupportedCommand(reason) => formatter.write_str(reason),
            Self::Launch(reason) => {
                write!(formatter, "could not launch Rust test process: {reason}")
            }
            Self::CargoFailed(reason) => write!(formatter, "Cargo test build failed: {reason}"),
            Self::CargoJson(reason) => write!(formatter, "invalid Cargo JSON output: {reason}"),
            Self::UnsafeArtifact(path) => {
                write!(formatter, "Cargo emitted an unsafe test artifact: {path}")
            }
            Self::ListFailed(reason) => {
                write!(formatter, "could not enumerate Rust tests: {reason}")
            }
            Self::Probe(reason) => write!(formatter, "invalid Rust probe evidence: {reason}"),
            Self::Context(reason) => write!(formatter, "invalid Rust test context: {reason}"),
            Self::UnknownProbe(id) => write!(
                formatter,
                "Rust runtime emitted an unknown obligation: {id}"
            ),
            Self::InvalidVector {
                id,
                expected,
                actual,
            } => write!(
                formatter,
                "Rust decision {id} emitted vector width {actual}; expected {expected}"
            ),
            Self::Json(error) => write!(formatter, "could not encode Rust evidence: {error}"),
            Self::Io(reason) => formatter.write_str(reason),
        }
    }
}

impl std::error::Error for RustTestRunnerError {}

impl From<serde_json::Error> for RustTestRunnerError {
    fn from(value: serde_json::Error) -> Self {
        Self::Json(value)
    }
}

#[derive(Debug, Deserialize)]
struct CargoMessage {
    reason: String,
    #[serde(default)]
    target: Option<CargoArtifactTarget>,
    #[serde(default)]
    profile: Option<CargoArtifactProfile>,
    executable: Option<PathBuf>,
    manifest_path: Option<PathBuf>,
}

#[derive(Debug, Deserialize)]
struct CargoArtifactTarget {
    name: String,
    kind: Vec<String>,
    src_path: PathBuf,
}

#[derive(Debug, Deserialize)]
struct CargoArtifactProfile {
    test: bool,
}

#[derive(Debug, Clone)]
struct TestArtifact {
    executable: PathBuf,
    name: String,
    kind: String,
    source: String,
    /// Where Cargo runs the binary: the directory of its package's manifest.
    /// tokio's `basic_fs` reads `Cargo.toml` from there.
    package_directory: PathBuf,
}

#[derive(Debug)]
struct ProcessTask {
    ordinal: usize,
    artifact_index: usize,
    test_index: usize,
    artifact: TestArtifact,
    test: String,
    context_id: u64,
    directory: PathBuf,
}

#[derive(Debug)]
struct ProcessOutcome {
    task: ProcessTask,
    output: Output,
}

fn shell_words(value: &str) -> Result<Vec<String>, RustTestRunnerError> {
    let mut words = Vec::new();
    let mut current = String::new();
    let mut quote = None;
    let mut escaped = false;
    for character in value.chars() {
        if escaped {
            current.push(character);
            escaped = false;
        } else if character == '\\' && quote != Some('\'') {
            escaped = true;
        } else if matches!(character, '\'' | '"') {
            if quote == Some(character) {
                quote = None;
            } else if quote.is_none() {
                quote = Some(character);
            } else {
                current.push(character);
            }
        } else if character.is_whitespace() && quote.is_none() {
            if !current.is_empty() {
                words.push(std::mem::take(&mut current));
            }
        } else {
            current.push(character);
        }
    }
    if escaped || quote.is_some() {
        return Err(RustTestRunnerError::UnsupportedCommand(
            "the expanded Cargo command contains an incomplete quote or escape".into(),
        ));
    }
    if !current.is_empty() {
        words.push(current);
    }
    Ok(words)
}

fn executable_name(value: &str) -> &str {
    Path::new(value)
        .file_name()
        .and_then(|name| name.to_str())
        .unwrap_or(value)
        .trim_end_matches(".exe")
        .trim_end_matches(".cmd")
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct CargoTestInvocation {
    pub program: String,
    pub kind: RustCargoCommandKind,
    pub arguments: Vec<String>,
    pub runner_arguments: Vec<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum RustCargoCommandKind {
    CargoTest,
    NextestRun,
}

impl CargoTestInvocation {
    pub(crate) fn command_position(&self) -> Option<usize> {
        match self.kind {
            RustCargoCommandKind::CargoTest => self
                .arguments
                .iter()
                .position(|argument| argument == "test"),
            RustCargoCommandKind::NextestRun => self
                .arguments
                .windows(2)
                .position(|pair| pair == ["nextest", "run"]),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct RustLibtestSelection {
    pub list_arguments: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct RustCargoExecutionSelection {
    pub run_libtests: bool,
    pub run_doctests: bool,
    pub doctest_arguments: Vec<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct NextestListInvocation {
    pub arguments: Vec<String>,
    pub runner_arguments: Vec<String>,
}

pub(crate) fn nextest_version_arguments(
    invocation: &CargoTestInvocation,
) -> Result<Vec<String>, RustTestRunnerError> {
    if invocation.kind != RustCargoCommandKind::NextestRun {
        return Err(RustTestRunnerError::UnsupportedCommand(
            "a nextest version handshake requires `cargo nextest run`".into(),
        ));
    }
    let command = invocation.command_position().ok_or_else(|| {
        RustTestRunnerError::UnsupportedCommand(
            "the expanded Cargo invocation lost its nextest run subcommand".into(),
        )
    })?;
    let mut arguments = invocation.arguments[..command].to_vec();
    arguments.extend(["nextest".into(), "--version".into()]);
    Ok(arguments)
}

fn nextest_run_only_option(argument: &str) -> Option<bool> {
    let name = argument.split_once('=').map_or(argument, |(name, _)| name);
    match name {
        "-j"
        | "--jobs"
        | "--test-threads"
        | "--retries"
        | "--flaky-result"
        | "--max-fail"
        | "--no-tests"
        | "--failure-output"
        | "--success-output"
        | "--status-level"
        | "--final-status-level"
        | "--show-progress"
        | "--max-progress-running"
        | "--message-format"
        | "--message-format-version" => Some(!argument.contains('=')),
        "--fail-fast"
        | "--ff"
        | "--no-fail-fast"
        | "--nff"
        | "--no-capture"
        | "--nocapture"
        | "--no-output-indent"
        | "--hide-progress-bar"
        | "--no-input-handler" => Some(false),
        _ if argument.starts_with("-j") && argument.len() > 2 => Some(false),
        _ => None,
    }
}

fn nextest_unsupported_run_option(argument: &str) -> Option<bool> {
    let name = argument.split_once('=').map_or(argument, |(name, _)| name);
    match name {
        "-R"
        | "--rerun"
        | "--debugger"
        | "--tracer"
        | "--stress-count"
        | "--stress-duration"
        | "--archive-file"
        | "--archive-format"
        | "--extract-to"
        | "--cargo-metadata"
        | "--workspace-remap"
        | "--binaries-metadata"
        | "--target-dir-remap"
        | "--build-dir-remap" => Some(!argument.contains('=')),
        "--no-run" | "--extract-overwrite" | "--persist-extract-tempdir" => Some(false),
        _ => None,
    }
}

fn nextest_shared_option(argument: &str) -> Option<bool> {
    let name = argument.split_once('=').map_or(argument, |(name, _)| name);
    match name {
        "--color"
        | "-p"
        | "--package"
        | "--exclude"
        | "--bin"
        | "--example"
        | "--test"
        | "--bench"
        | "-F"
        | "--features"
        | "--build-jobs"
        | "--cargo-profile"
        | "--target"
        | "--target-dir"
        | "--cargo-message-format"
        | "--config"
        | "--timings"
        | "-Z"
        | "--run-ignored"
        | "--partition"
        | "--platform-filter"
        | "-E"
        | "--filterset"
        | "--filter-expr"
        | "--manifest-path"
        | "--config-file"
        | "--user-config-file"
        | "--tool-config-file"
        | "-P"
        | "--profile" => Some(!argument.contains('=')),
        "--no-pager"
        | "-v"
        | "--verbose"
        | "--workspace"
        | "--all"
        | "--lib"
        | "--bins"
        | "--examples"
        | "--tests"
        | "--benches"
        | "--all-targets"
        | "--all-features"
        | "--no-default-features"
        | "-r"
        | "--release"
        | "--unit-graph"
        | "--frozen"
        | "--locked"
        | "--offline"
        | "--cargo-quiet"
        | "--cargo-verbose"
        | "--ignore-rust-version"
        | "--future-incompat-report"
        | "--ignore-default-filter"
        | "--override-version-check" => Some(false),
        _ if argument.starts_with("-p") && argument.len() > 2 => Some(false),
        _ if argument.starts_with("-F") && argument.len() > 2 => Some(false),
        _ if argument.starts_with("-E") && argument.len() > 2 => Some(false),
        _ if argument.starts_with("-P") && argument.len() > 2 => Some(false),
        _ if argument.starts_with("-Z") && argument.len() > 2 => Some(false),
        _ if argument.len() > 2
            && argument.starts_with('-')
            && argument[1..].bytes().all(|byte| byte == b'v') =>
        {
            Some(false)
        }
        _ if argument.starts_with("--timings=") => Some(false),
        _ => None,
    }
}

/// Reprojects a pinned `nextest run` invocation into the stable machine-readable
/// `nextest list` contract. Selection/build/configuration arguments are kept
/// byte-for-byte. Runner and presentation arguments are removed because they
/// do not affect the selected-test catalog. Options whose selection semantics
/// require an external recording or a different execution mode fail closed.
pub(crate) fn nextest_list_invocation(
    invocation: &CargoTestInvocation,
) -> Result<NextestListInvocation, RustTestRunnerError> {
    if invocation.kind != RustCargoCommandKind::NextestRun {
        return Err(RustTestRunnerError::UnsupportedCommand(
            "a nextest list projection requires `cargo nextest run`".into(),
        ));
    }
    let command = invocation.command_position().ok_or_else(|| {
        RustTestRunnerError::UnsupportedCommand(
            "the expanded Cargo invocation lost its nextest run subcommand".into(),
        )
    })?;
    let mut arguments = invocation.arguments[..command].to_vec();
    arguments.extend(["nextest".into(), "list".into()]);
    let mut index = command + 2;
    while index < invocation.arguments.len() {
        let argument = &invocation.arguments[index];
        if argument == "--" {
            arguments.extend(invocation.arguments[index..].iter().cloned());
            break;
        }
        if let Some(takes_value) = nextest_unsupported_run_option(argument) {
            if takes_value && invocation.arguments.get(index + 1).is_none() {
                return Err(RustTestRunnerError::UnsupportedCommand(format!(
                    "nextest option {argument} has no value"
                )));
            }
            return Err(RustTestRunnerError::UnsupportedCommand(format!(
                "nextest option {argument} cannot yet be assigned exact selected-test identity"
            )));
        }
        if let Some(takes_value) = nextest_run_only_option(argument) {
            if takes_value {
                index += 1;
                if index == invocation.arguments.len() {
                    return Err(RustTestRunnerError::UnsupportedCommand(format!(
                        "nextest option {argument} has no value"
                    )));
                }
            }
        } else if let Some(takes_value) = nextest_shared_option(argument) {
            arguments.push(argument.clone());
            if takes_value {
                index += 1;
                let value = invocation.arguments.get(index).ok_or_else(|| {
                    RustTestRunnerError::UnsupportedCommand(format!(
                        "nextest option {argument} has no value"
                    ))
                })?;
                arguments.push(value.clone());
            }
        } else if argument.starts_with('-') {
            return Err(RustTestRunnerError::UnsupportedCommand(format!(
                "the pinned nextest run contract does not recognize option {argument}"
            )));
        } else {
            arguments.push(argument.clone());
        }
        index += 1;
    }
    arguments.extend(["--message-format".into(), "json".into()]);
    Ok(NextestListInvocation {
        arguments,
        runner_arguments: invocation.runner_arguments.clone(),
    })
}

pub(crate) fn cargo_invocation(
    root: &Path,
    command: &[String],
) -> Result<CargoTestInvocation, RustTestRunnerError> {
    // A process argv is already tokenized. Joining and shell-parsing a direct
    // Cargo command destroys quotes that are payload (not shell syntax), most
    // notably TOML strings passed to Cargo's --config. Only opaque wrapper or
    // package-script commands need textual expansion and shell tokenization.
    let words = if command.iter().any(|word| executable_name(word) == "cargo") {
        command.to_vec()
    } else {
        let expanded = crate::project_discovery::expanded_command(root, command);
        shell_words(&expanded)?
    };
    let cargo = words
        .iter()
        .position(|word| executable_name(word) == "cargo")
        .ok_or_else(|| RustTestRunnerError::UnsupportedCommand(
            "Rust was detected, but the expanded command does not expose a stable Cargo invocation".into(),
        ))?;
    let cargo_test = words[cargo + 1..]
        .iter()
        .position(|word| word == "test")
        .map(|position| cargo + 1 + position);
    let nextest = words[cargo + 1..]
        .windows(2)
        .position(|pair| pair == ["nextest", "run"])
        .map(|position| cargo + 1 + position);
    let (kind, command) = match (cargo_test, nextest) {
        (Some(test), None) => (RustCargoCommandKind::CargoTest, test),
        (None, Some(nextest)) => (RustCargoCommandKind::NextestRun, nextest),
        (Some(_), Some(_)) => {
            return Err(RustTestRunnerError::UnsupportedCommand(
                "the Cargo invocation ambiguously contains both test and nextest run".into(),
            ));
        }
        (None, None) => {
            return Err(RustTestRunnerError::UnsupportedCommand(
                "the owned Rust runner currently requires `cargo test` or `cargo nextest run`; cross remains explicitly unsupported"
                    .into(),
            ));
        }
    };
    if words[cargo + 1..command]
        .iter()
        .any(|word| matches!(word.as_str(), "&&" | "||" | ";" | "|"))
    {
        return Err(RustTestRunnerError::UnsupportedCommand(
            "the Cargo invocation contains a shell boundary before `test`".into(),
        ));
    }
    let command_end = command
        + if kind == RustCargoCommandKind::NextestRun {
            1
        } else {
            0
        };
    let mut arguments = words[cargo + 1..=command_end].to_vec();
    let mut runner_arguments = Vec::new();
    let mut after_separator = false;
    for argument in &words[command_end + 1..] {
        if argument == "--" && !after_separator {
            after_separator = true;
            continue;
        }
        if matches!(argument.as_str(), "&&" | "||" | ";" | "|") {
            return Err(RustTestRunnerError::UnsupportedCommand(
                "the Cargo test command contains an unsupported shell boundary".into(),
            ));
        }
        if after_separator {
            runner_arguments.push(argument.clone());
        } else {
            arguments.push(argument.clone());
        }
    }
    Ok(CargoTestInvocation {
        program: words[cargo].clone(),
        kind,
        arguments,
        runner_arguments,
    })
}

fn cargo_option_takes_value(argument: &str) -> Option<bool> {
    let name = argument.split_once('=').map_or(argument, |(name, _)| name);
    match name {
        "-p" | "--package" | "--exclude" | "--bin" | "--example" | "--test" | "--bench" | "-F"
        | "--features" | "-j" | "--jobs" | "--profile" | "--target" | "--target-dir"
        | "--message-format" | "--color" | "--config" | "-Z" | "--manifest-path" => {
            Some(!argument.contains('='))
        }
        "--no-run"
        | "--no-fail-fast"
        | "--future-incompat-report"
        | "-q"
        | "--quiet"
        | "-v"
        | "--verbose"
        | "--workspace"
        | "--all"
        | "--lib"
        | "--bins"
        | "--examples"
        | "--tests"
        | "--benches"
        | "--all-targets"
        | "--doc"
        | "--all-features"
        | "--no-default-features"
        | "-r"
        | "--release"
        | "--timings"
        | "--ignore-rust-version"
        | "--locked"
        | "--offline"
        | "--frozen" => Some(false),
        _ if argument.starts_with("-vv") => Some(false),
        _ if argument.starts_with("-p") && argument.len() > 2 => Some(false),
        _ if argument.starts_with("-F") && argument.len() > 2 => Some(false),
        _ if argument.starts_with("-j") && argument.len() > 2 => Some(false),
        _ => None,
    }
}

pub(crate) fn rust_libtest_selection(
    invocation: &CargoTestInvocation,
) -> Result<RustLibtestSelection, RustTestRunnerError> {
    if invocation.kind != RustCargoCommandKind::CargoTest {
        return Err(RustTestRunnerError::UnsupportedCommand(
            "libtest selection cannot be reconstructed from a nextest command".into(),
        ));
    }
    let test = invocation
        .arguments
        .iter()
        .position(|argument| argument == "test")
        .ok_or_else(|| {
            RustTestRunnerError::UnsupportedCommand(
                "the expanded Cargo invocation lost its test subcommand".into(),
            )
        })?;
    let mut cargo_filter = None;
    let mut index = test + 1;
    while index < invocation.arguments.len() {
        let argument = &invocation.arguments[index];
        if argument.starts_with('-') {
            let takes_value = cargo_option_takes_value(argument).ok_or_else(|| {
                RustTestRunnerError::UnsupportedCommand(format!(
                    "the pinned Cargo test contract does not recognize option {argument}"
                ))
            })?;
            if takes_value {
                index += 1;
                if index == invocation.arguments.len() {
                    return Err(RustTestRunnerError::UnsupportedCommand(format!(
                        "Cargo option {argument} has no value"
                    )));
                }
            }
        } else if cargo_filter.replace(argument.clone()).is_some() {
            return Err(RustTestRunnerError::UnsupportedCommand(
                "Cargo test has more than one pre-separator TESTNAME".into(),
            ));
        }
        index += 1;
    }

    let mut list_arguments = cargo_filter.into_iter().collect::<Vec<_>>();
    let mut test_threads = None;
    let mut index = 0;
    while index < invocation.runner_arguments.len() {
        let argument = &invocation.runner_arguments[index];
        match argument.as_str() {
            "--ignored" | "--include-ignored" | "--exclude-should-panic" | "--test" | "--bench" => {
                list_arguments.push(argument.clone());
            }
            "--exact" => list_arguments.push(argument.clone()),
            "--skip" => {
                let value = invocation.runner_arguments.get(index + 1).ok_or_else(|| {
                    RustTestRunnerError::UnsupportedCommand(
                        "libtest --skip has no filter value".into(),
                    )
                })?;
                list_arguments.extend([argument.clone(), value.clone()]);
                index += 1;
            }
            _ if argument.starts_with("--skip=") && argument.len() > "--skip=".len() => {
                list_arguments.push(argument.clone());
            }
            "--test-threads" => {
                let value = invocation.runner_arguments.get(index + 1).ok_or_else(|| {
                    RustTestRunnerError::UnsupportedCommand(
                        "libtest --test-threads has no value".into(),
                    )
                })?;
                let parsed = parse_libtest_threads(value)?;
                if test_threads.replace(parsed).is_some() {
                    return Err(RustTestRunnerError::UnsupportedCommand(
                        "libtest --test-threads was provided more than once".into(),
                    ));
                }
                index += 1;
            }
            _ if argument.starts_with("--test-threads=") => {
                let value = &argument["--test-threads=".len()..];
                let parsed = parse_libtest_threads(value)?;
                if test_threads.replace(parsed).is_some() {
                    return Err(RustTestRunnerError::UnsupportedCommand(
                        "libtest --test-threads was provided more than once".into(),
                    ));
                }
            }
            "-Z" => {
                let value = invocation.runner_arguments.get(index + 1).ok_or_else(|| {
                    RustTestRunnerError::UnsupportedCommand(
                        "libtest -Z has no feature value".into(),
                    )
                })?;
                // `exclude-should-panic` and the other unstable selection
                // flags must be parsed under the same libtest feature gate
                // during discovery. The user's exact pair is also preserved
                // unchanged for the real artifact execution.
                list_arguments.extend([argument.clone(), value.clone()]);
                index += 1;
            }
            _ if argument.starts_with("-Z") && argument.len() > 2 => {
                list_arguments.push(argument.clone());
            }
            "--logfile" | "--color" | "--format" | "--shuffle-seed" => {
                if invocation.runner_arguments.get(index + 1).is_none() {
                    return Err(RustTestRunnerError::UnsupportedCommand(format!(
                        "libtest {argument} has no value"
                    )));
                }
                // Presentation-only values must not leak into the synthetic
                // terse listing. The original argument and value are passed
                // byte-for-byte to the one stock artifact execution.
                index += 1;
            }
            _ if ["--logfile=", "--color=", "--format=", "--shuffle-seed="]
                .iter()
                .any(|prefix| argument.starts_with(prefix) && argument.len() > prefix.len()) => {}
            "--force-run-in-process"
            | "--fail-fast"
            | "--no-capture"
            | "--nocapture"
            | "-q"
            | "--quiet"
            | "--show-output"
            | "--report-time"
            | "--ensure-time"
            | "--shuffle" => {
                // These affect only scheduling, execution or presentation.
                // They are intentionally absent from discovery and retained
                // unchanged in the real artifact argv.
            }
            "--list" | "-h" | "--help" => {
                return Err(RustTestRunnerError::UnsupportedCommand(format!(
                    "libtest {argument} does not execute a test suite; exact non-execution mode support is not implemented"
                )));
            }
            _ if !argument.starts_with('-') => list_arguments.push(argument.clone()),
            _ => {
                return Err(RustTestRunnerError::UnsupportedCommand(format!(
                    "the pinned Rust 1.95 libtest discovery contract does not recognize option {argument}"
                )));
            }
        }
        index += 1;
    }
    Ok(RustLibtestSelection { list_arguments })
}

fn parse_libtest_threads(value: &str) -> Result<usize, RustTestRunnerError> {
    match value.parse::<usize>() {
        Ok(0) => Err(RustTestRunnerError::UnsupportedCommand(
            "argument for --test-threads must not be 0".into(),
        )),
        Ok(value) => Ok(value),
        Err(error) => Err(RustTestRunnerError::UnsupportedCommand(format!(
            "argument for --test-threads must be a number > 0 (error: {error})"
        ))),
    }
}

pub(crate) fn rust_cargo_execution_selection(
    invocation: &CargoTestInvocation,
) -> Result<RustCargoExecutionSelection, RustTestRunnerError> {
    if invocation.kind == RustCargoCommandKind::NextestRun {
        return Ok(RustCargoExecutionSelection {
            run_libtests: true,
            run_doctests: false,
            doctest_arguments: Vec::new(),
        });
    }
    let test = invocation
        .arguments
        .iter()
        .position(|argument| argument == "test")
        .ok_or_else(|| {
            RustTestRunnerError::UnsupportedCommand(
                "the expanded Cargo invocation lost its test subcommand".into(),
            )
        })?;
    let mut doc = false;
    let mut other_target = false;
    let mut index = test + 1;
    while index < invocation.arguments.len() {
        let argument = &invocation.arguments[index];
        let name = argument
            .split_once('=')
            .map_or(argument.as_str(), |(name, _)| name);
        match name {
            "--doc" => doc = true,
            "--lib" | "--bins" | "--bin" | "--examples" | "--example" | "--tests" | "--test"
            | "--benches" | "--bench" | "--all-targets" => other_target = true,
            _ => {}
        }
        if argument.starts_with('-') {
            let takes_value = cargo_option_takes_value(argument).ok_or_else(|| {
                RustTestRunnerError::UnsupportedCommand(format!(
                    "the pinned Cargo test contract does not recognize option {argument}"
                ))
            })?;
            if takes_value {
                index += 1;
                if index == invocation.arguments.len() {
                    return Err(RustTestRunnerError::UnsupportedCommand(format!(
                        "Cargo option {argument} has no value"
                    )));
                }
            }
        }
        index += 1;
    }
    if doc && other_target {
        return Err(RustTestRunnerError::UnsupportedCommand(
            "Cargo --doc cannot be combined with another explicit target selection".into(),
        ));
    }
    let run_doctests = doc || !other_target;
    let run_libtests = !doc;
    let mut doctest_arguments = invocation.arguments.clone();
    if run_doctests && !doc {
        doctest_arguments.insert(test + 1, "--doc".into());
    }
    if !invocation.runner_arguments.is_empty() {
        doctest_arguments.push("--".into());
        doctest_arguments.extend(invocation.runner_arguments.iter().cloned());
    }
    Ok(RustCargoExecutionSelection {
        run_libtests,
        run_doctests,
        doctest_arguments,
    })
}

pub(crate) fn relative_source(root: &Path, path: &Path) -> Result<String, RustTestRunnerError> {
    let relative = path
        .strip_prefix(root)
        .map_err(|_| RustTestRunnerError::UnsafeArtifact(path.display().to_string()))?;
    if relative.as_os_str().is_empty()
        || relative
            .components()
            .any(|part| !matches!(part, Component::Normal(_)))
    {
        return Err(RustTestRunnerError::UnsafeArtifact(
            path.display().to_string(),
        ));
    }
    Ok(relative.to_string_lossy().replace('\\', "/"))
}

fn build_test_artifacts(
    project: &PreparedRustProject,
    command: &[String],
) -> Result<Vec<TestArtifact>, RustTestRunnerError> {
    let mut invocation = cargo_invocation(&project.workspace_root, command)?;
    invocation
        .arguments
        .extend(["--no-run".into(), "--message-format=json".into()]);
    // The instrumented workspace is ephemeral and its sources are generated,
    // so the HOST crate's lint policy must not reject them: serde builds with
    // `#![deny(warnings)]`, and http's `if ({ frame ... })` decision wrapping
    // trips `unused_parens` into a hard error under it. Capping lints to warn
    // changes nothing about the user's own `cargo test` runs. The user's
    // RUSTFLAGS are preserved ahead of the cap.
    let output = Command::new(&invocation.program)
        .args(invocation.arguments)
        .current_dir(&project.workspace_root)
        .env("CARGO_TARGET_DIR", &project.target_directory)
        .env("RUSTFLAGS", capped_rustflags())
        .output()
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    if !output.status.success() {
        // With --message-format=json the compiler's diagnostics travel on
        // stdout as JSON and Cargo's own summary on stderr; show both, or a
        // failed build says only which crate failed.
        let rendered = output
            .stdout
            .split(|byte| *byte == b'\n')
            .filter_map(|line| serde_json::from_slice::<serde_json::Value>(line).ok())
            .filter(|message| {
                message["reason"] == "compiler-message" && message["message"]["level"] == "error"
            })
            .filter_map(|message| message["message"]["rendered"].as_str().map(str::to_owned))
            .collect::<String>();
        return Err(RustTestRunnerError::CargoFailed(format!(
            "{rendered}{}",
            String::from_utf8_lossy(&output.stderr).trim()
        )));
    }
    let canonical_target = fs::canonicalize(&project.target_directory)
        .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
    let mut artifacts = Vec::new();
    for line in output
        .stdout
        .split(|byte| *byte == b'\n')
        .filter(|line| !line.is_empty())
    {
        let message: CargoMessage = serde_json::from_slice(line)
            .map_err(|error| RustTestRunnerError::CargoJson(error.to_string()))?;
        if message.reason != "compiler-artifact"
            || !message.profile.as_ref().is_some_and(|profile| profile.test)
        {
            continue;
        }
        let (Some(executable), Some(target)) = (message.executable, message.target) else {
            continue;
        };
        let executable = fs::canonicalize(&executable)
            .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
        if !executable.starts_with(&canonical_target)
            || !fs::metadata(&executable).is_ok_and(|metadata| metadata.is_file())
        {
            return Err(RustTestRunnerError::UnsafeArtifact(
                executable.display().to_string(),
            ));
        }
        let source = fs::canonicalize(target.src_path)
            .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
        let package_directory = message
            .manifest_path
            .as_deref()
            .and_then(Path::parent)
            .map_or_else(|| project.workspace_root.clone(), Path::to_path_buf);
        artifacts.push(TestArtifact {
            executable,
            package_directory,
            name: target.name,
            kind: if target.kind.iter().any(|kind| kind == "test") {
                "integration".into()
            } else {
                "unit".into()
            },
            source: relative_source(&project.workspace_root, &source)?,
        });
    }
    artifacts.sort_by(|left, right| left.executable.cmp(&right.executable));
    artifacts.dedup_by(|left, right| left.executable == right.executable);
    if artifacts.is_empty() {
        return Err(RustTestRunnerError::CargoJson(
            "Cargo emitted no libtest artifacts".into(),
        ));
    }
    Ok(artifacts)
}

/// The tests an artifact would run for this invocation. `filters` are the
/// user's libtest arguments that select tests -- a name, `--skip`, `--exact`,
/// `--ignored` -- and libtest applies them to `--list` exactly as it applies
/// them to a run, so the enumeration is the set plain Cargo would execute.
fn list_tests(
    executable: &Path,
    filters: &[String],
    environment: &[(&'static str, OsString)],
) -> Result<Vec<String>, RustTestRunnerError> {
    let output = Command::new(executable)
        .args(["--list", "--format", "terse"])
        .args(filters)
        .envs(environment.iter().map(|(key, value)| (key, value)))
        .output()
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    if !output.status.success() {
        // A libtest binary that dies on a signal writes nothing to stderr, so
        // reporting stderr alone produces an empty, undiagnosable message.
        // Name the artifact and how it ended, and fall back to stdout.
        let stderr = String::from_utf8_lossy(&output.stderr).trim().to_owned();
        let stdout = String::from_utf8_lossy(&output.stdout).trim().to_owned();
        let detail = if !stderr.is_empty() {
            stderr
        } else if !stdout.is_empty() {
            format!("no stderr; stdout was {stdout}")
        } else {
            "no output on either stream".to_owned()
        };
        return Err(RustTestRunnerError::ListFailed(format!(
            "{} exited with {} when asked to --list: {detail}",
            executable.display(),
            output.status
        )));
    }
    let mut tests = String::from_utf8_lossy(&output.stdout)
        .lines()
        .filter_map(|line| line.strip_suffix(": test"))
        .map(str::to_owned)
        .collect::<Vec<_>>();
    tests.sort();
    tests.dedup();
    Ok(tests)
}

/// What one test process recorded: the coverage snapshot and the assertion
/// phases the evidence witnesses.
pub(crate) struct RustEvidence {
    pub(crate) snapshot: RuntimeSnapshot,
    pub(crate) phases: Vec<CoveragePhase>,
}

/// One record a thread wrote, waiting to learn whether an assertion follows.
struct PendingRecord {
    event_type: &'static str,
    id: String,
    vector: Option<McdcVector>,
    sequence: i64,
}

/// `attempt` names what this evidence belongs to, so its phase IDs are
/// unique across the run: every test runs in a process of its own and numbers
/// its records from one.
pub(crate) fn snapshot(
    manifest: &CoverageManifest,
    directory: &Path,
    attempt: &str,
) -> Result<RustEvidence, RustTestRunnerError> {
    let points = manifest
        .points
        .iter()
        .map(|point| (point.id.as_str(), point))
        .collect::<BTreeMap<_, _>>();
    let alternatives = manifest
        .branches
        .iter()
        .flat_map(|branch| {
            branch
                .alternatives
                .iter()
                .map(|alternative| alternative.id.as_str())
        })
        .collect::<BTreeSet<_>>();
    let decisions = manifest
        .decisions
        .iter()
        .map(|decision| (decision.id.as_str(), decision))
        .collect::<BTreeMap<_, _>>();
    let mut hits = BTreeSet::new();
    let mut vectors = BTreeMap::<String, BTreeSet<(Vec<Option<bool>>, bool)>>::new();
    // Records a thread wrote since its last assertion. An assertion witnesses
    // its own thread's records and no other's: a test that spawns threads
    // interleaves them in one file.
    let mut pending = BTreeMap::<u64, Vec<PendingRecord>>::new();
    let mut events = Vec::new();
    let mut phases = Vec::new();
    // Records carry no clock. The order they were written in is what matters,
    // and a sequence number preserves exactly that.
    let mut sequence = 0_i64;
    // Evidence files are named by the instrumentation that wrote them. A
    // test may build and run a program instrumented on its own -- a fixture
    // prepared inside the instrumented workspace -- and that program
    // inherits the evidence directory; its obligations are not this run's.
    let token = crate::rust_project::manifest_token(manifest);
    for (name, observations) in read_rust_probe_directory(directory)
        .map_err(|error| RustTestRunnerError::Probe(error.to_string()))?
    {
        if !name.starts_with(&token) {
            continue;
        }
        for entry in observations {
            sequence += 1;
            let thread = entry.thread;
            match entry.observation {
                RustProbeObservation::Hit { id } => {
                    if !points.contains_key(id.as_str()) && !alternatives.contains(id.as_str()) {
                        return Err(RustTestRunnerError::UnknownProbe(id));
                    }
                    hits.insert(id.clone());
                    pending.entry(thread).or_default().push(PendingRecord {
                        event_type: "hit",
                        id,
                        vector: None,
                        sequence,
                    });
                }
                RustProbeObservation::Decision {
                    id,
                    values,
                    outcome,
                } => {
                    let Some(meta) = decisions.get(id.as_str()) else {
                        return Err(RustTestRunnerError::UnknownProbe(id));
                    };
                    if values.len() != meta.conditions.len() {
                        return Err(RustTestRunnerError::InvalidVector {
                            id,
                            expected: meta.conditions.len(),
                            actual: values.len(),
                        });
                    }
                    hits.insert(format!(
                        "{}:outcome:{}",
                        meta.id,
                        if outcome { "true" } else { "false" }
                    ));
                    vectors
                        .entry(meta.id.clone())
                        .or_default()
                        .insert((values.clone(), outcome));
                    pending.entry(thread).or_default().push(PendingRecord {
                        event_type: "decision",
                        id,
                        vector: Some(McdcVector { values, outcome }),
                        sequence,
                    });
                }
                RustProbeObservation::Assertion { id } => {
                    // The marker names the statement that asserts, which is
                    // a point of this manifest.
                    let Some(point) = points.get(id.as_str()) else {
                        return Err(RustTestRunnerError::UnknownProbe(id));
                    };
                    let witnessed = pending.remove(&thread).unwrap_or_default();
                    let phase_id = format!("{attempt}:assertion:{sequence}");
                    phases.push(CoveragePhase {
                        id: phase_id.clone(),
                        kind: "assertion".into(),
                        operation: format!(
                            "Rust assertion at {}:{}:{}",
                            point.file, point.line, point.column
                        ),
                        source: Some(point.source.clone()),
                        caused_by_phase_id: None,
                        started_at_ms: witnessed.first().map_or(sequence, |record| record.sequence),
                        ended_at_ms: Some(sequence),
                        // Reaching the marker is the proof: a failing
                        // assertion panics before it.
                        status: Some("passed".into()),
                        error: None,
                    });
                    for record in witnessed {
                        events.push(RuntimeEvent {
                            event_type: record.event_type.into(),
                            id: record.id,
                            vector: record.vector,
                            timestamp_ms: record.sequence,
                            phase_id: Some(phase_id.clone()),
                            statement_id: None,
                            environment: "server".into(),
                        });
                    }
                }
            }
        }
    }
    let mut decision_snapshots = Vec::new();
    for (id, observed) in vectors {
        let meta: DecisionMeta = (*decisions[id.as_str()]).clone();
        decision_snapshots.push(DecisionSnapshot {
            meta,
            vectors: observed
                .into_iter()
                .map(|(values, outcome)| McdcVector { values, outcome })
                .collect(),
        });
    }
    Ok(RustEvidence {
        snapshot: RuntimeSnapshot {
            decisions: decision_snapshots,
            hits: hits.into_iter().collect(),
            events,
            logicals: Vec::new(),
            phase_id: None,
        },
        phases,
    })
}

fn rust_coverage_model() -> CoverageModelDeclaration {
    CoverageModelDeclaration {
        language: "rust".into(),
        variant: "rust-owned-probes-v1".into(),
        name: "supercov-rust-owned-v1".into(),
        completeness_meaning: "Every semantics-proven Rust obligation in the owned source denominator was observed; explicit manifest limitations identify unmeasured Rust surfaces.".into(),
        measured: vec![
            "owned Rust statements and function entries".into(),
            "owned atomic condition vectors and decision outcomes".into(),
            "exact process-per-libtest attribution".into(),
            "exact process-per-doctest attribution".into(),
            "evidence a passing assertion of the same thread witnessed".into(),
        ],
        not_measured: vec![
            "macro-expanded and generated Rust code".into(),
            "const-evaluated code and unsupported structural branch probes".into(),
            "causal linkage to individual actions".into(),
            "all input values, semantic partitions, paths, or concurrency interleavings".into(),
            "mutation score or assertion fault-detection strength".into(),
        ],
    }
}

/// The user's RUSTFLAGS, then a cap so the HOST crate's lint policy cannot
/// reject generated sources: serde builds with `#![deny(warnings)]`, and
/// http's `if ({ frame ... })` decision wrapping trips `unused_parens` into a
/// hard error under it. The user's own `cargo test` runs are unaffected.
/// The stack an instrumented test thread gets. Probes add stack to every
/// frame -- a decision frame, a `?` operand copied through its probe, a
/// wrapper's temporaries -- and a test that recurses to a depth chosen against
/// the default 2 MiB (serde_json's recursion-limit test) overflows under
/// instrumentation. libtest sizes test threads from `RUST_MIN_STACK`, so an
/// instrumented process gets 16 MiB unless the user chose a size. The
/// reservation is virtual; only touched pages cost memory.
pub(crate) fn instrumented_stack_environment() -> Vec<(&'static str, &'static str)> {
    if std::env::var_os("RUST_MIN_STACK").is_some() {
        Vec::new()
    } else {
        vec![("RUST_MIN_STACK", "16777216")]
    }
}

/// One path the selected toolchain reports through `rustc --print`.
fn rustc_print_path(request: &str) -> Result<PathBuf, RustTestRunnerError> {
    let output = Command::new("rustc")
        .args(["--print", request])
        .output()
        .map_err(|error| {
            RustTestRunnerError::Launch(format!("rustc --print {request}: {error}"))
        })?;
    if !output.status.success() {
        return Err(RustTestRunnerError::Launch(format!(
            "rustc --print {request} exited with {}",
            output.status
        )));
    }
    Ok(PathBuf::from(
        String::from_utf8_lossy(&output.stdout).trim(),
    ))
}

/// The selected toolchain's sysroot, as `rustc --print sysroot` reports it.
pub(crate) fn rustc_sysroot() -> Result<PathBuf, RustTestRunnerError> {
    rustc_print_path("sysroot")
}

/// The directory holding the toolchain's own dynamic libraries
/// (`<sysroot>/lib/rustlib/<host>/lib`), where libstd's dylib lives; the
/// plain `<sysroot>/lib` no longer holds it.
pub(crate) fn rustc_target_libdir() -> Result<PathBuf, RustTestRunnerError> {
    rustc_print_path("target-libdir")
}

/// The dynamic library search path Cargo gives a test binary it runs: the
/// artifact's own directories and the toolchain's target library directory.
/// A proc-macro crate's test harness links libstd dynamically -- async-trait's
/// and serde_derive's cannot even list their tests without this -- and any
/// dylib dependency is found the same way. The user's own path follows.
pub(crate) fn dynamic_library_environment(
    target_libdir: &Path,
    executable: &Path,
) -> Vec<(&'static str, OsString)> {
    let variable = if cfg!(target_os = "macos") {
        "DYLD_FALLBACK_LIBRARY_PATH"
    } else if cfg!(windows) {
        "PATH"
    } else {
        "LD_LIBRARY_PATH"
    };
    let mut entries = Vec::new();
    if let Some(deps) = executable.parent() {
        entries.push(deps.to_path_buf());
        if let Some(profile) = deps.parent() {
            entries.push(profile.to_path_buf());
        }
    }
    entries.push(target_libdir.to_path_buf());
    if let Some(existing) = std::env::var_os(variable) {
        entries.extend(std::env::split_paths(&existing));
    }
    match std::env::join_paths(entries) {
        Ok(value) => vec![(variable, value)],
        Err(_) => Vec::new(),
    }
}

pub(crate) fn capped_rustflags() -> String {
    let mut rustflags = std::env::var("RUSTFLAGS").unwrap_or_default();
    if !rustflags.is_empty() {
        rustflags.push(' ');
    }
    rustflags.push_str("--cap-lints=warn");
    rustflags
}

pub(crate) fn io_error(error: impl std::fmt::Display) -> RustTestRunnerError {
    RustTestRunnerError::Io(error.to_string())
}

/// A libtest case that exited cleanly but ran nothing, or ran its one test as
/// ignored, was skipped rather than passed.
pub(crate) fn libtest_skipped(exit: i32, stdout: &str) -> bool {
    exit == 0 && (stdout.contains("running 0 tests") || stdout.contains("; 1 ignored;"))
}

/// Limitation IDs are unique across a declaration, so each runner names its
/// own: the libtest runner keeps the original IDs, rustdoc's carry its name.
fn rust_runner_limitations(runner: &str) -> Vec<FrontendLimitation> {
    let prefix = if runner == "rust-libtest" {
        "rust".to_owned()
    } else {
        runner.to_owned()
    };
    vec![
        FrontendLimitation {
            id: format!("{prefix}-action-linkage-unavailable"),
            scopes: vec![FrontendLimitationScope::Action],
            reason: "Rust test frameworks expose no general action lifecycle".into(),
        },
        FrontendLimitation {
            id: format!("{prefix}-assertion-linkage-unavailable"),
            scopes: vec![FrontendLimitationScope::Assertion],
            reason: "assertion macros do not expose a stable per-assertion success lifecycle"
                .into(),
        },
    ]
}

fn rust_runner_declaration(runner: &str) -> FrontendRunnerDeclaration {
    FrontendRunnerDeclaration {
        runner: runner.into(),
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
        limitations: rust_runner_limitations(runner),
    }
}

/// Obligations in files the build never read, declined rather than counted.
/// Returns the manifest to report against and the files it declined.
///
/// The obligations stay in the manifest: the evidence files are named by a
/// token derived from its obligation IDs, so removing them would orphan every
/// record the run wrote. `unmeasured` is what the report reads to take an
/// obligation out of the covered/uncovered denominator without pretending it
/// was never there.
fn decline_uncompiled_sources(
    project: &PreparedRustProject,
) -> (CoverageManifest, BTreeSet<String>) {
    let mut manifest = project.manifest.clone();
    let Some(compiled) = crate::rust_project::compiled_source_files(
        &project.workspace_root,
        &project.target_directory,
    ) else {
        return (manifest, BTreeSet::new());
    };
    let declined = project
        .source_files
        .iter()
        .filter(|file| !compiled.contains(*file))
        .cloned()
        .collect::<BTreeSet<_>>();
    // Depinfo that accounts for no crate root at all is depinfo this run did
    // not produce; declining on it would empty the denominator.
    if declined.is_empty()
        || project
            .crate_roots
            .iter()
            .all(|root| !compiled.contains(root))
    {
        return (manifest, BTreeSet::new());
    }
    let mut unmeasured = manifest.unmeasured.iter().cloned().collect::<BTreeSet<_>>();
    unmeasured.extend(
        manifest
            .points
            .iter()
            .filter(|point| declined.contains(&point.file))
            .map(|point| point.id.clone()),
    );
    unmeasured.extend(
        manifest
            .decisions
            .iter()
            .filter(|decision| declined.contains(&decision.file))
            .map(|decision| decision.id.clone()),
    );
    unmeasured.extend(
        manifest
            .branches
            .iter()
            .filter(|branch| declined.contains(&branch.file))
            .map(|branch| branch.id.clone()),
    );
    manifest.unmeasured = unmeasured.into_iter().collect();
    // A boundary declared inside a file that was never compiled says nothing.
    manifest.limitations.retain(|limitation| {
        limitation
            .get("file")
            .and_then(|file| file.as_str())
            .is_none_or(|file| !declined.contains(file))
    });
    (manifest, declined)
}

/// The manifest's structural limitation IDs, as the declaration references them.
fn structural_limitations(manifest: &CoverageManifest) -> Vec<String> {
    manifest
        .limitations
        .iter()
        .filter_map(|item| {
            item.get("id")
                .and_then(|value| value.as_str())
                .map(str::to_owned)
        })
        .collect()
}

pub fn run_prepared_rust_tests(
    project: &PreparedRustProject,
    command: &[String],
    run_id: &str,
    generated_at: &str,
    diagnostics: &mut dyn Write,
) -> Result<RustFrontendRun, RustTestRunnerError> {
    let invocation = cargo_invocation(&project.workspace_root, command)?;
    let selection = rust_cargo_execution_selection(&invocation)?;
    let build_started = Instant::now();
    // `cargo test --doc` alone builds nothing here: Cargo refuses `--no-run`
    // with `--doc`, and the doctest phase below builds what it runs.
    // nextest builds for itself; Cargo builds the libtest artifacts here.
    let artifacts = if selection.run_libtests && invocation.kind == RustCargoCommandKind::CargoTest
    {
        build_test_artifacts(project, command)?
    } else {
        Vec::new()
    };
    let build_ms = build_started.elapsed().as_secs_f64() * 1000.0;
    // The denominator is what the compiler built, not what the module tree
    // resolves: a module behind a `#[cfg]` that is off is resolved, never
    // compiled, and could never be covered.
    let (manifest, declined) = decline_uncompiled_sources(project);
    if !declined.is_empty() {
        writeln!(
            diagnostics,
            "[supercov] {} source file(s) this build did not compile are outside the denominator: {}{}",
            declined.len(),
            declined
                .iter()
                .take(3)
                .cloned()
                .collect::<Vec<_>>()
                .join(", "),
            if declined.len() > 3 { ", ..." } else { "" }
        )
        .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
    }
    let project = &PreparedRustProject {
        manifest,
        ..project.clone()
    };
    // A signal that reaches the runner alone must not leave the test
    // processes running: on 2026-09-07 an orphaned tokio test spun on two
    // cores for an hour. The guard covers every child spawned below.
    let _signal_guard = crate::child_signal_guard::ChildSignalGuard::install()
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    let evidence_root = project
        .workspace_root
        .join(".supercov/rust-evidence")
        .join(run_id);
    fs::create_dir_all(&evidence_root)
        .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
    let mut results = Vec::new();
    let mut overall_exit = 0;
    let execution_started = Instant::now();
    if invocation.kind == RustCargoCommandKind::NextestRun {
        // nextest builds, schedules and retries on its own; this program is
        // its target runner and records every attempt it launches.
        let outcome = crate::rust_owned_nextest::run_nextest(
            project,
            &invocation,
            &evidence_root.join("nextest"),
            run_id,
            diagnostics,
        )?;
        let artifact_count = outcome.artifact_files.len();
        return Ok(RustFrontendRun {
            declaration: FrontendRunDeclaration {
                protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
                frontend_id: "rust".into(),
                frontend_version: "rust-owned-v1".into(),
                language: "rust".into(),
                structural_source: StructuralSource::OwnedProbes,
                runners: vec![rust_runner_declaration("nextest")],
                structural_limitations: structural_limitations(&project.manifest),
            },
            request: CoverageReportRequest {
                run_id: run_id.into(),
                manifest: project.manifest.clone(),
                raw_results: outcome.results,
                generated_at: generated_at.into(),
                coverage_model: Some(rust_coverage_model()),
                integrity: None,
                test_exit_code: ExitCodeInput::Present(Some(outcome.exit_code)),
            },
            exit_code: outcome.exit_code,
            artifacts: artifact_count,
            artifact_files: outcome.artifact_files,
            build_ms,
            execution_ms: execution_started.elapsed().as_secs_f64() * 1000.0,
        });
    }
    // The user's libtest filters, validated against the discovery contract.
    // This was computed and never used: every artifact was listed bare, and
    // Supercov ran tests plain Cargo had been told to skip. It is read here,
    // after the nextest branch: a nextest command carries no libtest
    // selection to reconstruct, and nextest applies the user's filters itself.
    let libtest_selection = rust_libtest_selection(&invocation)?;
    // An ignored test the user asked for with `--ignored` is listed, and must
    // then run: `--exact name` alone would report it ignored again.
    let ignored_mode = libtest_selection
        .list_arguments
        .iter()
        .filter(|argument| {
            matches!(
                argument.as_str(),
                "--ignored" | "--include-ignored" | "--exclude-should-panic"
            )
        })
        .cloned()
        .collect::<Vec<_>>();
    let mut tasks = Vec::new();
    let target_libdir = if artifacts.is_empty() {
        PathBuf::new()
    } else {
        rustc_target_libdir()?
    };
    for (artifact_index, artifact) in artifacts.iter().enumerate() {
        let tests = list_tests(
            &artifact.executable,
            &libtest_selection.list_arguments,
            &dynamic_library_environment(&target_libdir, &artifact.executable),
        )?;
        let contexts = preflight_rust_test_contexts(tests.clone())
            .map_err(|error| RustTestRunnerError::Context(error.to_string()))?;
        for (test_index, test) in tests.into_iter().enumerate() {
            let directory = evidence_root.join(format!("{artifact_index:04}-{test_index:08}"));
            fs::create_dir(&directory)
                .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
            tasks.push(ProcessTask {
                ordinal: tasks.len(),
                artifact_index,
                test_index,
                artifact: artifact.clone(),
                context_id: contexts[&test],
                test,
                directory,
            });
        }
    }
    let workers = std::thread::available_parallelism()
        .map(usize::from)
        .unwrap_or(1)
        .min(tasks.len().max(1));
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
                    let result = crate::child_signal_guard::output(
                        Command::new(&task.artifact.executable)
                            // No --nocapture: libtest's in-memory capture is what
                            // plain `cargo test` gives users, and it re-emits a
                            // failing test's output, which `.output()` still
                            // receives. Streaming instead turns every print in a
                            // hot loop into an unbuffered stderr syscall: bytes'
                            // advance_bytes_mut_remaining_capacity prints per
                            // iteration, and --nocapture alone cost 6.9s of its
                            // 14.4s (baseline 8.0s streamed vs 1.0s captured).
                            .args(["--exact", &task.test])
                            .args(&ignored_mode)
                            .current_dir(&task.artifact.package_directory)
                            .envs(instrumented_stack_environment())
                            .envs(dynamic_library_environment(
                                &target_libdir,
                                &task.artifact.executable,
                            ))
                            .env("SUPERCOV_RUST_EVIDENCE_DIR", &task.directory)
                            .env(
                                crate::rust_probe_transport::RUST_CONTEXT_ENV,
                                format!("{:016x}", task.context_id),
                            ),
                    )
                    .map(|output| ProcessOutcome {
                        task: ProcessTask {
                            ordinal: task.ordinal,
                            artifact_index: task.artifact_index,
                            test_index: task.test_index,
                            artifact: task.artifact.clone(),
                            test: task.test.clone(),
                            context_id: task.context_id,
                            directory: task.directory.clone(),
                        },
                        output,
                    })
                    .map_err(|error| error.to_string());
                    outcomes
                        .lock()
                        .expect("Rust test result lock poisoned")
                        .push(result);
                }
            });
        }
    });
    let mut outcomes = outcomes
        .into_inner()
        .map_err(|_| RustTestRunnerError::Io("Rust test result lock poisoned".into()))?
        .into_iter()
        .map(|result| result.map_err(RustTestRunnerError::Launch))
        .collect::<Result<Vec<_>, _>>()?;
    outcomes.sort_by_key(|outcome| outcome.task.ordinal);
    for outcome in outcomes {
        let ProcessTask {
            artifact_index,
            test_index,
            artifact,
            test,
            directory,
            ..
        } = outcome.task;
        // Target names are not workspace-unique: two packages may both
        // expose `lib` or the same integration-test target. Source path +
        // libtest name is stable and unique within the frozen workspace.
        let test_id = format!("{}::{test}", artifact.source);
        let worker_id = format!("artifact-{artifact_index:04}");
        let attempt_id = format!("{run_id}:{artifact_index:04}:{test_index:08}");
        let output = outcome.output;
        let exit = output.status.code().unwrap_or(1);
        let stdout = String::from_utf8_lossy(&output.stdout);
        let skipped = libtest_skipped(exit, &stdout);
        if exit != 0 {
            writeln!(diagnostics, "[supercov] Rust test failed: {test_id}")
                .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
            diagnostics
                .write_all(&output.stdout)
                .and_then(|_| diagnostics.write_all(&output.stderr))
                .map_err(|error| RustTestRunnerError::Io(error.to_string()))?;
        }
        if exit != 0 {
            overall_exit = exit;
        }
        let evidence = snapshot(&project.manifest, &directory, &attempt_id)?;
        results.push(RawTestResult {
            test_id: Some(test_id.clone()),
            scope: Some(ExecutionScope {
                version: 1,
                run_id: run_id.into(),
                worker_id,
                test_id: test_id.clone(),
                test_key: format!("{}::{test}", artifact.source),
                retry: 0,
                attempt_id,
            }),
            test: test_id,
            test_file: Some(artifact.source.clone()),
            title: Some(test),
            retry: Some(0),
            status: Some(
                if exit != 0 {
                    "failed"
                } else if skipped {
                    "skipped"
                } else {
                    "passed"
                }
                .into(),
            ),
            expected_status: Some("passed".into()),
            flaky: false,
            provenance: TestProvenance {
                runner: "rust-libtest".into(),
                kind: artifact.kind,
                project: Some(artifact.name),
                source: "supercov-owned-process-per-test".into(),
            },
            role: "test".into(),
            attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
            phases: evidence.phases,
            runtime: vec![evidence.snapshot],
            browser: Vec::new(),
            server: Vec::new(),
        });
    }
    let doctest_results =
        if selection.run_doctests && invocation.kind == RustCargoCommandKind::CargoTest {
            crate::rust_owned_doctests::run_doctests(
                project,
                &invocation,
                &selection,
                &evidence_root.join("doctests"),
                run_id,
                diagnostics,
                &mut overall_exit,
            )?
        } else {
            Vec::new()
        };
    // Only observed runners may be declared. A run with no tests at all keeps
    // the libtest declaration, as it always has.
    let ran_libtests = !results.is_empty();
    let ran_doctests = !doctest_results.is_empty();
    results.extend(doctest_results);
    let mut runners = Vec::new();
    if ran_libtests || !ran_doctests {
        runners.push(rust_runner_declaration("rust-libtest"));
    }
    if ran_doctests {
        runners.push(rust_runner_declaration("rustdoc"));
    }
    let structural_limitations = structural_limitations(&project.manifest);
    Ok(RustFrontendRun {
        declaration: FrontendRunDeclaration {
            protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
            frontend_id: "rust".into(),
            frontend_version: "rust-owned-v1".into(),
            language: "rust".into(),
            structural_source: StructuralSource::OwnedProbes,
            runners,
            structural_limitations,
        },
        request: CoverageReportRequest {
            run_id: run_id.into(),
            manifest: project.manifest.clone(),
            raw_results: results,
            generated_at: generated_at.into(),
            coverage_model: Some(rust_coverage_model()),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(overall_exit)),
        },
        exit_code: overall_exit,
        artifacts: artifacts.len(),
        artifact_files: artifacts
            .iter()
            .map(|artifact| artifact.executable.clone())
            .collect(),
        build_ms,
        execution_ms: execution_started.elapsed().as_secs_f64() * 1000.0,
    })
}

#[cfg(test)]
mod tests {
    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;
    use crate::{
        coverage_report::{ArchiveReportRequest, analyze_coverage_archive},
        evidence_archive::write_archive,
        frontend_protocol::validate_frontend_report_request,
        rust_project::prepare_rust_project,
    };

    #[test]
    fn cargo_and_libtest_selection_is_preserved_without_presentation_guessing() {
        let root = Path::new(".");
        let invocation = cargo_invocation(
            root,
            &[
                "cargo".into(),
                "test".into(),
                "-p".into(),
                "fixture".into(),
                "authored".into(),
                "--".into(),
                "generated".into(),
                "--skip".into(),
                "slow".into(),
                "--include-ignored".into(),
            ],
        )
        .unwrap();
        assert_eq!(invocation.arguments, ["test", "-p", "fixture", "authored"]);
        assert_eq!(
            invocation.runner_arguments,
            ["generated", "--skip", "slow", "--include-ignored"]
        );
        let selection = rust_libtest_selection(&invocation).unwrap();
        assert_eq!(
            selection.list_arguments,
            [
                "authored",
                "generated",
                "--skip",
                "slow",
                "--include-ignored"
            ]
        );
    }

    #[test]
    fn direct_cargo_argv_preserves_toml_quotes_inside_config_values() {
        let config = "target.host.runner=[\"runner with spaces\",\"--fixed\"]";
        let invocation = cargo_invocation(
            Path::new("."),
            &[
                "cargo".into(),
                "test".into(),
                "--config".into(),
                config.into(),
            ],
        )
        .unwrap();
        assert_eq!(invocation.arguments, ["test", "--config", config]);
    }

    #[test]
    fn nextest_run_is_detected_without_reclassifying_its_filters_or_retries() {
        let invocation = cargo_invocation(
            Path::new("."),
            &[
                "cargo".into(),
                "+1.95.0".into(),
                "nextest".into(),
                "run".into(),
                "--retries".into(),
                "2".into(),
                "-E".into(),
                "test(/flaky/)".into(),
                "--".into(),
                "--nocapture".into(),
            ],
        )
        .unwrap();
        assert_eq!(invocation.kind, RustCargoCommandKind::NextestRun);
        assert_eq!(
            invocation.arguments,
            [
                "+1.95.0",
                "nextest",
                "run",
                "--retries",
                "2",
                "-E",
                "test(/flaky/)",
            ]
        );
        assert_eq!(invocation.runner_arguments, ["--nocapture"]);
        let execution = rust_cargo_execution_selection(&invocation).unwrap();
        assert!(execution.run_libtests);
        assert!(!execution.run_doctests);
        assert!(execution.doctest_arguments.is_empty());
        assert!(rust_libtest_selection(&invocation).is_err());
        assert_eq!(
            nextest_list_invocation(&invocation).unwrap(),
            NextestListInvocation {
                arguments: vec![
                    "+1.95.0".into(),
                    "nextest".into(),
                    "list".into(),
                    "-E".into(),
                    "test(/flaky/)".into(),
                    "--message-format".into(),
                    "json".into(),
                ],
                runner_arguments: vec!["--nocapture".into()],
            }
        );
    }

    #[test]
    fn nextest_list_projection_preserves_selection_and_rejects_external_state() {
        let invocation = CargoTestInvocation {
            program: "cargo".into(),
            kind: RustCargoCommandKind::NextestRun,
            arguments: vec![
                "nextest".into(),
                "run".into(),
                "--package=fixture".into(),
                "--partition".into(),
                "hash:1/2".into(),
                "--test-threads=8".into(),
                "--failure-output".into(),
                "final".into(),
                "name".into(),
            ],
            runner_arguments: vec!["--exact".into(), "full::name".into()],
        };
        assert_eq!(
            nextest_list_invocation(&invocation).unwrap(),
            NextestListInvocation {
                arguments: vec![
                    "nextest".into(),
                    "list".into(),
                    "--package=fixture".into(),
                    "--partition".into(),
                    "hash:1/2".into(),
                    "name".into(),
                    "--message-format".into(),
                    "json".into(),
                ],
                runner_arguments: vec!["--exact".into(), "full::name".into()],
            }
        );

        let mut rerun = invocation;
        rerun.arguments.extend(["--rerun".into(), "latest".into()]);
        assert!(
            nextest_list_invocation(&rerun)
                .unwrap_err()
                .to_string()
                .contains("cannot yet be assigned exact selected-test identity")
        );
    }

    #[test]
    fn nextest_list_projection_preserves_post_separator_libtest_selection() {
        let invocation = cargo_invocation(
            Path::new("."),
            &[
                "cargo".into(),
                "nextest".into(),
                "run".into(),
                "--timings".into(),
                "-vv".into(),
                "--".into(),
                "--include-ignored".into(),
                "--skip".into(),
                "slow".into(),
                "--exact".into(),
                "tests::selected".into(),
            ],
        )
        .unwrap();
        assert_eq!(
            nextest_list_invocation(&invocation).unwrap(),
            NextestListInvocation {
                arguments: vec![
                    "nextest".to_owned(),
                    "list".to_owned(),
                    "--timings".to_owned(),
                    "-vv".to_owned(),
                    "--message-format".to_owned(),
                    "json".to_owned(),
                ],
                runner_arguments: vec![
                    "--include-ignored".to_owned(),
                    "--skip".to_owned(),
                    "slow".to_owned(),
                    "--exact".to_owned(),
                    "tests::selected".to_owned(),
                ],
            }
        );
    }

    #[test]
    fn nextest_version_handshake_preserves_the_cargo_toolchain_selector() {
        let invocation = CargoTestInvocation {
            program: "cargo".into(),
            kind: RustCargoCommandKind::NextestRun,
            arguments: vec![
                "+1.95.0".into(),
                "nextest".into(),
                "run".into(),
                "-p".into(),
                "fixture".into(),
            ],
            runner_arguments: Vec::new(),
        };
        assert_eq!(
            nextest_version_arguments(&invocation).unwrap(),
            ["+1.95.0", "nextest", "--version"]
        );
    }

    #[test]
    fn stock_libtest_presentation_and_scheduling_options_do_not_change_discovery() {
        let invocation = CargoTestInvocation {
            program: "cargo".into(),
            kind: RustCargoCommandKind::CargoTest,
            arguments: vec!["test".into(), "cargo-filter".into()],
            runner_arguments: [
                "runner-filter",
                "--nocapture",
                "--show-output",
                "--format=json",
                "--color",
                "never",
                "--test-threads=4",
                "--fail-fast",
                "--shuffle-seed",
                "17",
                "-Zunstable-options",
                "--exclude-should-panic",
            ]
            .into_iter()
            .map(str::to_owned)
            .collect(),
        };
        let selection = rust_libtest_selection(&invocation).unwrap();
        assert_eq!(
            selection.list_arguments,
            [
                "cargo-filter",
                "runner-filter",
                "-Zunstable-options",
                "--exclude-should-panic"
            ]
        );
    }

    #[test]
    fn cargo_test_options_are_not_mistaken_for_the_test_name_filter() {
        let invocation = CargoTestInvocation {
            program: "cargo".into(),
            kind: RustCargoCommandKind::CargoTest,
            arguments: vec![
                "test".into(),
                "--manifest-path".into(),
                "nested/Cargo.toml".into(),
                "--features=one,two".into(),
                "needle".into(),
            ],
            runner_arguments: vec!["--ignored".into(), "other".into()],
        };
        let selection = rust_libtest_selection(&invocation).unwrap();
        assert_eq!(selection.list_arguments, ["needle", "--ignored", "other"]);
    }

    #[test]
    fn libtest_thread_count_is_preserved_as_runner_scheduling() {
        for arguments in [vec!["--test-threads", "1"], vec!["--test-threads=8"]] {
            let invocation = CargoTestInvocation {
                program: "cargo".into(),
                kind: RustCargoCommandKind::CargoTest,
                arguments: vec!["test".into()],
                runner_arguments: arguments.into_iter().map(str::to_owned).collect(),
            };
            let selection = rust_libtest_selection(&invocation).unwrap();
            assert!(selection.list_arguments.is_empty());
        }
    }

    #[test]
    fn invalid_or_duplicate_libtest_thread_counts_fail_closed() {
        for arguments in [
            vec!["--test-threads"],
            vec!["--test-threads=0"],
            vec!["--test-threads=abc"],
            vec!["--test-threads", "1", "--test-threads=2"],
        ] {
            let invocation = CargoTestInvocation {
                program: "cargo".into(),
                kind: RustCargoCommandKind::CargoTest,
                arguments: vec!["test".into()],
                runner_arguments: arguments.into_iter().map(str::to_owned).collect(),
            };
            assert!(rust_libtest_selection(&invocation).is_err());
        }
    }

    #[test]
    fn cargo_target_selection_reproduces_when_cargo_runs_doctests() {
        let invocation = CargoTestInvocation {
            program: "cargo".into(),
            kind: RustCargoCommandKind::CargoTest,
            arguments: vec![
                "test".into(),
                "-p".into(),
                "fixture".into(),
                "needle".into(),
            ],
            runner_arguments: vec!["--include-ignored".into()],
        };
        let selection = rust_cargo_execution_selection(&invocation).unwrap();
        assert!(selection.run_libtests);
        assert!(selection.run_doctests);
        assert_eq!(
            selection.doctest_arguments,
            [
                "test",
                "--doc",
                "-p",
                "fixture",
                "needle",
                "--",
                "--include-ignored"
            ]
        );

        let mut explicit_doc = invocation.clone();
        explicit_doc.arguments.insert(1, "--doc".into());
        let selection = rust_cargo_execution_selection(&explicit_doc).unwrap();
        assert!(!selection.run_libtests);
        assert!(selection.run_doctests);

        for target in ["--lib", "--tests", "--all-targets", "--example=demo"] {
            let mut selected = invocation.clone();
            selected.arguments.insert(1, target.into());
            let selection = rust_cargo_execution_selection(&selected).unwrap();
            assert!(selection.run_libtests);
            assert!(!selection.run_doctests);
        }
    }

    #[test]
    fn a_module_the_build_never_compiles_leaves_the_denominator() {
        // `#[cfg(feature = ...)]` with the feature off resolves as a module
        // and is never compiled, so nothing in it can ever be covered.
        // memchr carries thirteen such files for other architectures.
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-runner-cfg-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='fixture'\nversion='0.0.0'\nedition='2024'\n\n[features]\nextra=[]\n",
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            r#"
#[cfg(feature = "extra")]
mod extra;

pub fn kept(value: i32) -> i32 {
    if value > 0 { value } else { -value }
}
#[cfg(test)]
mod tests {
    #[test] fn positive() { assert_eq!(super::kept(2), 2); }
    #[test] fn negative() { assert_eq!(super::kept(-2), 2); }
}
"#,
        )
        .unwrap();
        fs::write(
            root.join("src/extra.rs"),
            "pub fn never_built(value: i32) -> i32 {\n    if value > 0 { 1 } else { 0 }\n}\n",
        )
        .unwrap();
        let project = prepare_rust_project(&root, None).unwrap();
        // Discovery still reaches it: the module tree is what rustc resolves.
        assert!(
            project
                .source_files
                .iter()
                .any(|file| file == "src/extra.rs"),
            "{:?}",
            project.source_files
        );
        let run = run_prepared_rust_tests(
            &project,
            &["cargo".into(), "test".into(), "--lib".into()],
            "rust-fixture-cfg",
            "2026-08-26T00:00:00.000Z",
            &mut Vec::new(),
        )
        .unwrap();
        assert_eq!(run.exit_code, 0);
        // Its obligations stay in the manifest, so the evidence token still
        // matches and the file is still addressable, but they are declined.
        let manifest = &run.request.manifest;
        assert!(
            manifest
                .points
                .iter()
                .any(|point| point.file == "src/extra.rs"),
            "the obligations must stay in the manifest"
        );
        let declined = manifest.unmeasured.iter().collect::<BTreeSet<_>>();
        for point in &manifest.points {
            assert_eq!(
                declined.contains(&point.id),
                point.file == "src/extra.rs",
                "{} in {}",
                point.id,
                point.file
            );
        }
        for decision in &manifest.decisions {
            assert_eq!(
                declined.contains(&decision.id),
                decision.file == "src/extra.rs"
            );
        }
        // The tests cover everything the build compiled.
        let report =
            crate::frontend_protocol::analyze_frontend_results(&run.declaration, &run.request)
                .unwrap();
        assert_eq!(
            report.view.summary.lines.percentage, 100.0,
            "declined obligations must not read as uncovered"
        );
        fs::remove_dir_all(&root).ok();
    }

    #[test]
    fn assertion_occurrences_are_retained_without_automatic_asserted_credit() {
        // Records are appended in execution order, so what a thread wrote
        // before it passed an assertion was in scope for that check. Without
        // this every Rust line read "execution only", however thoroughly the
        // tests checked it.
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-runner-assert-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='fixture'\nversion='0.0.0'\nedition='2024'\n",
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            r#"
pub fn checked(value: i32) -> i32 {
    value * 2
}
pub fn unchecked(value: i32) -> i32 {
    value + 1
}
#[cfg(test)]
mod tests {
    #[test]
    fn asserts() {
        let doubled = super::checked(2);
        assert_eq!(doubled, 4);
    }
    #[test]
    fn asserts_nothing() {
        let _ = super::unchecked(1);
    }
}
"#,
        )
        .unwrap();
        let project = prepare_rust_project(&root, None).unwrap();
        let run = run_prepared_rust_tests(
            &project,
            &["cargo".into(), "test".into(), "--lib".into()],
            "rust-fixture-assert",
            "2026-08-26T00:00:00.000Z",
            &mut Vec::new(),
        )
        .unwrap();
        assert_eq!(run.exit_code, 0);

        // The asserting test carries an assertion phase that passed; the
        // other carries none.
        let phases = |test: &str| {
            run.request
                .raw_results
                .iter()
                .find(|result| result.test.ends_with(test))
                .unwrap_or_else(|| panic!("no test {test}"))
                .phases
                .clone()
        };
        let asserting = phases("asserts");
        assert!(
            !asserting.is_empty(),
            "the asserting test recorded no phase"
        );
        assert!(
            asserting
                .iter()
                .all(|phase| phase.kind == "assertion" && phase.status.as_deref() == Some("passed"))
        );
        assert!(
            phases("asserts_nothing").is_empty(),
            "a test that checks nothing witnesses nothing"
        );

        let report =
            crate::frontend_protocol::analyze_frontend_results(&run.declaration, &run.request)
                .unwrap();
        let level = |line: usize| {
            report
                .view
                .lines
                .iter()
                .find(|entry| entry.file == "src/lib.rs" && entry.line == line)
                .map(|entry| entry.confidence.level.clone())
                .unwrap_or_else(|| panic!("no line {line}"))
        };
        // Both executed. Assertion meaning is supplied later by assertions.json.
        assert_eq!(level(3), "executed");
        assert_eq!(level(6), "executed");
        fs::remove_dir_all(&root).ok();
    }

    #[test]
    fn libtest_filters_select_the_tests_plain_cargo_would_run() {
        // The user's filters were parsed and never applied: every artifact
        // was listed bare, so `--skip` and a name filter changed nothing and
        // Supercov ran a test plain Cargo did not (tokio, 1414 against 1413).
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-runner-filters-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='fixture'\nversion='0.0.0'\nedition='2024'\n",
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            r#"
pub fn value(flag: bool) -> i32 { if flag { 1 } else { 0 } }
#[cfg(test)]
mod tests {
    #[test] fn alpha() { assert_eq!(super::value(true), 1); }
    #[test] fn beta() { assert_eq!(super::value(false), 0); }
    #[test] #[ignore] fn gamma_slow() { assert_eq!(super::value(true), 1); }
}
"#,
        )
        .unwrap();
        let project = prepare_rust_project(&root, None).unwrap();
        let names = |run: &str, command: &[&str]| {
            let run = run_prepared_rust_tests(
                &project,
                &command
                    .iter()
                    .map(|word| (*word).into())
                    .collect::<Vec<String>>(),
                run,
                "2026-08-26T00:00:00.000Z",
                &mut Vec::new(),
            )
            .unwrap();
            assert_eq!(run.exit_code, 0, "{:?}", run.request.raw_results);
            let mut names = run
                .request
                .raw_results
                .iter()
                .map(|result| {
                    (
                        result.test.rsplit("::").next().unwrap().to_owned(),
                        result.status.clone().unwrap(),
                    )
                })
                .collect::<Vec<_>>();
            names.sort();
            names
        };
        // Everything: the ignored test is listed and reported skipped.
        assert_eq!(
            names("rust-fixture-filters-1", &["cargo", "test", "--lib"]),
            [
                ("alpha".to_owned(), "passed".to_owned()),
                ("beta".to_owned(), "passed".to_owned()),
                ("gamma_slow".to_owned(), "skipped".to_owned()),
            ]
        );
        // A name filter and `--skip` narrow the enumeration as libtest does.
        assert_eq!(
            names(
                "rust-fixture-filters-2",
                &["cargo", "test", "--lib", "alpha"]
            ),
            [("alpha".to_owned(), "passed".to_owned())]
        );
        assert_eq!(
            names(
                "rust-fixture-filters-3",
                &["cargo", "test", "--lib", "--", "--skip", "beta"]
            ),
            [
                ("alpha".to_owned(), "passed".to_owned()),
                ("gamma_slow".to_owned(), "skipped".to_owned()),
            ]
        );
        // `--ignored` lists the ignored test, and then it has to RUN.
        assert_eq!(
            names(
                "rust-fixture-filters-4",
                &["cargo", "test", "--lib", "--", "--ignored"]
            ),
            [("gamma_slow".to_owned(), "passed".to_owned())]
        );
        fs::remove_dir_all(&root).ok();
    }

    #[test]
    fn libtest_processes_run_in_their_package_directory() {
        // Cargo runs a test binary in its package's directory, and tokio's
        // `basic_fs` reads `Cargo.toml` from there; the workspace root has a
        // different manifest.
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-runner-cwd-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(root.join("member/src")).unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[workspace]\nmembers = ['member']\nresolver = '2'\n",
        )
        .unwrap();
        fs::write(
            root.join("member/Cargo.toml"),
            "[package]\nname='member'\nversion='0.0.0'\nedition='2024'\n",
        )
        .unwrap();
        fs::write(
            root.join("member/src/lib.rs"),
            r#"
pub fn manifest() -> String {
    std::fs::read_to_string("Cargo.toml").unwrap()
}
#[cfg(test)]
mod tests {
    #[test] fn reads_own_manifest() { assert!(super::manifest().contains("name='member'")); }
}
"#,
        )
        .unwrap();
        let project = prepare_rust_project(&root, None).unwrap();
        let run = run_prepared_rust_tests(
            &project,
            &["cargo".into(), "test".into(), "--lib".into()],
            "rust-fixture-cwd",
            "2026-08-26T00:00:00.000Z",
            &mut Vec::new(),
        )
        .unwrap();
        assert_eq!(run.exit_code, 0, "{:?}", run.request.raw_results);
        assert_eq!(run.request.raw_results.len(), 1);
        assert_eq!(run.request.raw_results[0].status.as_deref(), Some("passed"));
        fs::remove_dir_all(&root).ok();
    }

    #[test]
    fn cargo_libtest_runs_produce_queryable_owned_evidence() {
        let nonce = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_nanos();
        let root = std::env::temp_dir().join(format!(
            "supercov-rust-runner-{}-{nonce}",
            std::process::id()
        ));
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(
            root.join("Cargo.toml"),
            "[package]\nname='fixture'\nversion='0.0.0'\nedition='2024'\n",
        )
        .unwrap();
        fs::write(
            root.join("src/lib.rs"),
            r#"
pub fn choose(left: bool, right: bool) -> i32 {
    if left && right { 1 } else { 0 }
}
pub fn pick(value: i32) -> &'static str {
    match value {
        0 => "zero",
        1 => "one",
        _ => "many",
    }
}
pub fn total(values: &[i32]) -> i32 {
    let mut sum = 0;
    for value in values {
        sum += value;
    }
    sum
}
pub fn first_even(values: &[i32]) -> Option<i32> {
    let mut index = 0;
    while index < values.len() {
        if values[index] % 2 == 0 {
            return Some(values[index]);
        }
        index += 1;
    }
    None
}
pub fn parse_twice(text: &str) -> Option<i32> {
    let value: i32 = text.parse().ok()?;
    Some(value * 2)
}
pub fn describe(value: Option<i32>, flag: bool) -> &'static str {
    if let Some(inner) = value && inner > 0 && flag {
        "positive"
    } else {
        "other"
    }
}
pub fn depth(n: u32) -> Result<u32, String> {
    if n == 0 {
        Ok(0)
    } else {
        let below = depth(n - 1)?;
        Ok(below + 1)
    }
}
#[cfg(test)]
mod tests {
    #[test] fn false_path() { assert_eq!(super::choose(false, true), 0); }
    #[test] fn true_path() { assert_eq!(super::choose(true, true), 1); }
    #[test] #[ignore] fn ignored_path() { unreachable!(); }
    #[test] fn pick_zero() { assert_eq!(super::pick(0), "zero"); }
    #[test] fn pick_many() { assert_eq!(super::pick(7), "many"); }
    #[test] fn total_empty() { assert_eq!(super::total(&[]), 0); }
    #[test] fn total_some() { assert_eq!(super::total(&[1, 2]), 3); }
    #[test] fn first_even_empty() { assert_eq!(super::first_even(&[]), None); }
    #[test] fn first_even_found() { assert_eq!(super::first_even(&[1, 4]), Some(4)); }
    #[test] fn parse_ok() { assert_eq!(super::parse_twice("4"), Some(8)); }
    #[test] fn parse_bad() { assert_eq!(super::parse_twice("x"), None); }
    #[test] fn chain_taken() { assert_eq!(super::describe(Some(1), true), "positive"); }
    #[test] fn chain_pattern_fails() { assert_eq!(super::describe(None, true), "other"); }
    #[test] fn chain_negative() { assert_eq!(super::describe(Some(-1), true), "other"); }
    #[test] fn chain_flag_fails() { assert_eq!(super::describe(Some(1), false), "other"); }
    #[test] fn deep_recursion() { assert_eq!(super::depth(5_000), Ok(5_000)); }
}
"#,
        )
        .unwrap();
        let project = prepare_rust_project(&root, None).unwrap();
        // Doctests need the CLI binary standing in for rustdoc, which this
        // test binary cannot do; scripts/rust-public-cargo-integration.mjs
        // covers them end to end. `--lib` keeps this run to the libtests.
        let run = run_prepared_rust_tests(
            &project,
            &["cargo".into(), "test".into(), "--lib".into()],
            "rust-fixture",
            "2026-08-26T00:00:00.000Z",
            &mut Vec::new(),
        )
        .unwrap();
        assert_eq!(run.exit_code, 0);
        assert_eq!(run.request.raw_results.len(), 16);
        let statuses = run
            .request
            .raw_results
            .iter()
            .filter_map(|result| result.status.as_deref())
            .collect::<Vec<_>>();
        assert_eq!(
            statuses
                .iter()
                .filter(|status| **status == "skipped")
                .count(),
            1
        );
        assert_eq!(
            statuses
                .iter()
                .filter(|status| **status == "passed")
                .count(),
            15
        );

        // The let chain's condition vectors, with the pattern's outcome
        // derived: [let Some(inner) = value, inner > 0, flag].
        let chain_vectors = |test: &str| {
            let result = run
                .request
                .raw_results
                .iter()
                .find(|result| result.test.ends_with(test))
                .unwrap_or_else(|| panic!("no test {test}"));
            let snapshot = result
                .runtime
                .iter()
                .flat_map(|snapshot| &snapshot.decisions)
                .find(|decision| decision.meta.source.starts_with("let Some(inner) = value"))
                .unwrap_or_else(|| panic!("{test} recorded no chain decision"));
            snapshot
                .vectors
                .iter()
                .map(|vector| (vector.values.clone(), vector.outcome))
                .collect::<Vec<_>>()
        };
        assert_eq!(
            chain_vectors("chain_taken"),
            [(vec![Some(true), Some(true), Some(true)], true)]
        );
        assert_eq!(
            chain_vectors("chain_pattern_fails"),
            [(vec![Some(false), None, None], false)]
        );
        assert_eq!(
            chain_vectors("chain_negative"),
            [(vec![Some(true), Some(false), None], false)]
        );
        assert_eq!(
            chain_vectors("chain_flag_fails"),
            [(vec![Some(true), Some(true), Some(false)], false)]
        );
        validate_frontend_report_request(&run.declaration, &run.request).unwrap();
        let archive = root.join("evidence.raw.gz");
        write_archive(run.archive_entries().unwrap(), &archive).unwrap();
        let report = analyze_coverage_archive(&ArchiveReportRequest {
            archive_path: archive,
            run_id: "rust-fixture".into(),
            generated_at: "2026-08-26T00:00:00.000Z".into(),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(0)),
        })
        .unwrap();
        assert_eq!(report.view.tests.len(), 16);
        assert!(report.view.summary.lines.covered > 0);
        assert!(report.view.summary.decisions > 0);

        // Loops, the try operator and the logical operator, each with both
        // outcomes attributed to the test that produced it.
        let single = |kind: &str| {
            let mut found = report
                .view
                .branches
                .iter()
                .filter(|branch| branch.meta.kind == kind);
            let branch = found.next().unwrap_or_else(|| panic!("no {kind} branch"));
            assert!(found.next().is_none(), "more than one {kind} branch");
            branch
        };
        let tests_of = |branch: &crate::coverage_report::BranchResult, label: &str| {
            branch
                .alternatives
                .iter()
                .find(|alternative| alternative.label == label)
                .unwrap_or_else(|| panic!("{} has no alternative {label}", branch.meta.kind))
                .tests
                .clone()
        };
        let for_loop = single("for-loop");
        assert_eq!(
            tests_of(for_loop, "zero iterations"),
            ["src/lib.rs::tests::total_empty"]
        );
        assert_eq!(
            tests_of(for_loop, "entered"),
            ["src/lib.rs::tests::total_some"]
        );
        let while_loop = single("while-loop");
        assert_eq!(
            tests_of(while_loop, "zero iterations"),
            ["src/lib.rs::tests::first_even_empty"]
        );
        assert_eq!(
            tests_of(while_loop, "entered"),
            ["src/lib.rs::tests::first_even_found"]
        );
        // `depth` adds a second `?`; the one in `parse_twice` is the one
        // exercised both ways.
        let try_operator = report
            .view
            .branches
            .iter()
            .find(|branch| {
                branch.meta.kind == "try-operator" && branch.meta.source.contains("parse().ok()")
            })
            .expect("parse_twice's try operator");
        assert_eq!(
            tests_of(try_operator, "continued"),
            ["src/lib.rs::tests::parse_ok"]
        );
        assert_eq!(
            tests_of(try_operator, "early return"),
            ["src/lib.rs::tests::parse_bad"]
        );
        let mut logical = report
            .view
            .branches
            .iter()
            .filter(|branch| branch.meta.kind == "logical-and")
            .collect::<Vec<_>>();
        logical.sort_by_key(|branch| (branch.meta.line, branch.meta.column));
        // `left && right` in choose, then the chain's two operators.
        assert_eq!(logical.len(), 3);
        assert_eq!(
            tests_of(logical[0], "short-circuited"),
            ["src/lib.rs::tests::false_path"]
        );
        assert_eq!(
            tests_of(logical[0], "right operand evaluated"),
            ["src/lib.rs::tests::true_path"]
        );
        assert_eq!(
            tests_of(logical[1], "short-circuited"),
            ["src/lib.rs::tests::chain_pattern_fails"]
        );
        assert_eq!(
            tests_of(logical[1], "right operand evaluated"),
            [
                "src/lib.rs::tests::chain_flag_fails",
                "src/lib.rs::tests::chain_negative",
                "src/lib.rs::tests::chain_taken",
            ]
        );
        assert_eq!(
            tests_of(logical[2], "short-circuited"),
            [
                "src/lib.rs::tests::chain_negative",
                "src/lib.rs::tests::chain_pattern_fails",
            ]
        );
        assert_eq!(
            tests_of(logical[2], "right operand evaluated"),
            [
                "src/lib.rs::tests::chain_flag_fails",
                "src/lib.rs::tests::chain_taken",
            ]
        );
        assert!(for_loop.covered && while_loop.covered && try_operator.covered);
        assert!(logical.iter().all(|branch| branch.covered));

        // The match in `pick`: pick(0) selects the first arm; pick(7) passes
        // the first two over and selects the last. Nothing selects `1`.
        let mut arms = report
            .view
            .branches
            .iter()
            .filter(|branch| branch.meta.kind == "match-arm")
            .collect::<Vec<_>>();
        arms.sort_by_key(|branch| branch.meta.line);
        assert_eq!(arms.len(), 3);
        let alternative = |arm: usize, label: &str| {
            arms[arm]
                .alternatives
                .iter()
                .find(|alternative| alternative.label == label)
                .unwrap_or_else(|| panic!("arm {arm} has no alternative {label}"))
        };
        assert_eq!(
            alternative(0, "selected").tests,
            ["src/lib.rs::tests::pick_zero"]
        );
        assert_eq!(
            alternative(0, "not selected").tests,
            ["src/lib.rs::tests::pick_many"]
        );
        assert!(!alternative(1, "selected").covered);
        assert_eq!(
            alternative(1, "not selected").tests,
            ["src/lib.rs::tests::pick_many"]
        );
        assert_eq!(arms[2].alternatives.len(), 1);
        assert_eq!(
            alternative(2, "selected").tests,
            ["src/lib.rs::tests::pick_many"]
        );
        assert!(arms[0].covered && !arms[1].covered && arms[2].covered);

        fs::remove_dir_all(root).unwrap();
    }
}
