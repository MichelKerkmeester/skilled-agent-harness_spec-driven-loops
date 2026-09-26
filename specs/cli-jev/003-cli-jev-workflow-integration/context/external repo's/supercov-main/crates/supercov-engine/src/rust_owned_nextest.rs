//! `cargo nextest run` for the owned Rust frontend.
//!
//! nextest already runs every test in a process of its own and honours
//! Cargo's target runner, so nothing about its scheduling, retries or output
//! has to be reproduced: nextest builds the instrumented workspace, lists it
//! and runs it exactly as the user asked, and this program is configured as
//! the target runner. Every attempt nextest launches passes through here,
//! gets an evidence directory of its own, and is recorded together with the
//! exact identity nextest exposes to runners (`NEXTEST_TEST_NAME`,
//! `NEXTEST_ATTEMPT`, `NEXTEST_BINARY_ID`, ...). The listing nextest produced
//! beforehand names every selected test, so a test that ran unrecorded, or
//! was listed but never ran, fails the run rather than thinning the report.
//!
//! A runner the user already configured for the target keeps running the
//! binaries: this program wraps it rather than replacing it.

use std::{
    collections::{BTreeMap, BTreeSet},
    ffi::OsString,
    fs,
    io::Write,
    path::{Path, PathBuf},
    process::Command,
};

use nextest_metadata::TestListSummary;
use serde::{Deserialize, Serialize};

use crate::{
    coverage_report::{ExecutionScope, RawTestResult, TestProvenance},
    rust_cargo_configuration::{RustCargoResolvedRunner, resolve_cargo_runner_plan},
    rust_compiler_orchestration::{CargoMetadataOutput, cargo_metadata_arguments},
    rust_project::PreparedRustProject,
    rust_runner_attempt::{
        RustRunnerInvocationIdentity, classify_rust_runner_environment,
        parse_nextest_version_output, validate_nextest_version,
    },
    rust_test_runner::{
        CargoTestInvocation, RustTestRunnerError, capped_rustflags, instrumented_stack_environment,
        io_error, nextest_list_invocation, nextest_version_arguments, relative_source, snapshot,
    },
};

/// The first argument that makes this program nextest's target runner.
pub const RUNNER_MODE_ARGUMENT: &str = "__nextest-runner";
const EVIDENCE_DIR_ENV: &str = "SUPERCOV_RUST_EVIDENCE_DIR";
const PLAN_FILE: &str = "runner-plan.json";
const ATTEMPTS_DIRECTORY: &str = "attempts";

/// What the runner needs to know per target: the runner the user configured,
/// if any, which this program wraps.
#[derive(Debug, Serialize, Deserialize)]
struct RunnerPlan {
    targets: Vec<RunnerTarget>,
}

#[derive(Debug, Serialize, Deserialize)]
struct RunnerTarget {
    target: String,
    underlying: Option<RustCargoResolvedRunner>,
}

/// One attempt nextest launched, as the runner recorded it.
#[derive(Debug, Serialize, Deserialize)]
struct AttemptRecord {
    binary_id: String,
    test_name: String,
    attempt: usize,
    total_attempts: usize,
    runner_attempt_id: String,
    exit_code: i32,
    evidence: PathBuf,
}

/// A test binary nextest listed, joined to the Cargo target it was built from.
#[derive(Debug, Clone)]
struct NextestArtifact {
    executable: PathBuf,
    binary_name: String,
    kind: String,
    source: String,
}

pub struct NextestOutcome {
    pub results: Vec<RawTestResult>,
    pub artifact_files: Vec<PathBuf>,
    pub exit_code: i32,
}

// -------------------------------------------------------------- the engine

/// Run the user's `cargo nextest run` against the instrumented workspace with
/// this program as the target runner, and read back every attempt.
pub(crate) fn run_nextest(
    project: &PreparedRustProject,
    invocation: &CargoTestInvocation,
    root: &Path,
    run_id: &str,
    diagnostics: &mut dyn Write,
) -> Result<NextestOutcome, RustTestRunnerError> {
    fs::create_dir_all(root.join(ATTEMPTS_DIRECTORY)).map_err(io_error)?;
    let program = std::env::current_exe()
        .and_then(fs::canonicalize)
        .map_err(io_error)?;
    let cargo = |arguments: &[String]| {
        let mut command = Command::new(&invocation.program);
        command
            .args(arguments)
            .current_dir(&project.workspace_root)
            .env("CARGO_TARGET_DIR", &project.target_directory)
            .env("RUSTFLAGS", capped_rustflags());
        command
    };

    // The identity contract is pinned to the nextest versions it was verified
    // against; anything else fails before a test runs.
    let version = cargo(&nextest_version_arguments(invocation)?)
        .output()
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    if !version.status.success() {
        return Err(RustTestRunnerError::CargoFailed(combined_output(
            &version.stdout,
            &version.stderr,
        )));
    }
    let version = parse_nextest_version_output(&version.stdout)
        .map_err(|error| RustTestRunnerError::Context(error.to_string()))?;
    validate_nextest_version(&version).map_err(|error| {
        RustTestRunnerError::UnsupportedCommand(format!("cargo-nextest {version}: {error}"))
    })?;

    // The target runner configuration: one entry per target nextest may run
    // for, each wrapping whatever runner the user had configured.
    let plan =
        resolve_cargo_runner_plan(&project.workspace_root, &project.workspace_root, invocation)
            .map_err(|error| RustTestRunnerError::Context(error.to_string()))?;
    let runner_plan = RunnerPlan {
        targets: plan
            .targets
            .iter()
            .map(|target| RunnerTarget {
                target: target.target.clone(),
                underlying: target
                    .underlying_runner
                    .as_ref()
                    .map(|runner| runner.resolve(&project.workspace_root)),
            })
            .collect(),
    };
    fs::write(root.join(PLAN_FILE), serde_json::to_vec(&runner_plan)?).map_err(io_error)?;
    let runner_configuration = runner_configuration_arguments(&program, root, &runner_plan)?;

    // The listing: every test nextest selected, per binary, before any runs.
    let listing = nextest_list_invocation(invocation)?;
    let mut list_arguments = listing.arguments;
    list_arguments.extend(runner_configuration.iter().cloned());
    if !listing.runner_arguments.is_empty() {
        list_arguments.push("--".into());
        list_arguments.extend(listing.runner_arguments);
    }
    let listed = cargo(&list_arguments)
        .output()
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    if !listed.status.success() {
        return Err(RustTestRunnerError::CargoFailed(combined_output(
            &listed.stdout,
            &listed.stderr,
        )));
    }
    let catalog =
        TestListSummary::parse_json(String::from_utf8_lossy(&listed.stdout)).map_err(|error| {
            RustTestRunnerError::CargoJson(format!("invalid nextest test listing: {error}"))
        })?;
    let metadata = cargo(
        &cargo_metadata_arguments(invocation)
            .map_err(|error| RustTestRunnerError::Context(error.to_string()))?,
    )
    .output()
    .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    if !metadata.status.success() {
        return Err(RustTestRunnerError::CargoFailed(combined_output(
            &metadata.stdout,
            &metadata.stderr,
        )));
    }
    let metadata: CargoMetadataOutput =
        serde_json::from_slice(&metadata.stdout).map_err(|error| {
            RustTestRunnerError::CargoJson(format!("invalid Cargo metadata: {error}"))
        })?;
    let artifacts = nextest_artifacts(project, &catalog, &metadata)?;

    // The run itself, streaming nextest's own output.
    let command = invocation.command_position().ok_or_else(|| {
        RustTestRunnerError::UnsupportedCommand(
            "the expanded Cargo invocation lost its nextest run subcommand".into(),
        )
    })?;
    let mut run_arguments = invocation.arguments[..command + 2].to_vec();
    run_arguments.extend(runner_configuration.iter().cloned());
    run_arguments.extend(invocation.arguments[command + 2..].iter().cloned());
    if !invocation.runner_arguments.is_empty() {
        run_arguments.push("--".into());
        run_arguments.extend(invocation.runner_arguments.iter().cloned());
    }
    let status = crate::child_signal_guard::status(&mut cargo(&run_arguments))
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    let exit_code = status.code().unwrap_or(1);

    // Every attempt the runner recorded, checked against the listing.
    let mut selected = BTreeSet::new();
    for (binary_id, suite) in &catalog.rust_suites {
        for (name, case) in &suite.test_cases {
            if case.filter_match.is_match() {
                selected.insert((binary_id.to_string(), name.to_string()));
            }
        }
    }
    let mut records = read_attempts(&root.join(ATTEMPTS_DIRECTORY))?;
    records.sort_by(|left, right| {
        (&left.binary_id, &left.test_name, left.attempt).cmp(&(
            &right.binary_id,
            &right.test_name,
            right.attempt,
        ))
    });
    let mut seen = BTreeSet::new();
    let mut ran = BTreeSet::new();
    let mut results = Vec::with_capacity(records.len());
    for record in records {
        let key = (record.binary_id.clone(), record.test_name.clone());
        if !selected.contains(&key) {
            return Err(RustTestRunnerError::Context(format!(
                "nextest ran a test its listing did not select: {} {}",
                record.binary_id, record.test_name
            )));
        }
        if !seen.insert((key.clone(), record.attempt)) {
            return Err(RustTestRunnerError::Context(format!(
                "nextest attempt {} of {} {} was recorded twice",
                record.attempt, record.binary_id, record.test_name
            )));
        }
        ran.insert(key);
        let artifact = artifacts.get(&record.binary_id).ok_or_else(|| {
            RustTestRunnerError::Context(format!(
                "nextest ran a binary its listing lacks: {}",
                record.binary_id
            ))
        })?;
        let test_id = format!("{}::{}", artifact.source, record.test_name);
        let passed = record.exit_code == 0;
        if !passed {
            writeln!(
                diagnostics,
                "[supercov] Rust test failed on attempt {}: {test_id}",
                record.attempt
            )
            .map_err(io_error)?;
        }
        let attempt_id = format!("{run_id}:{}:{}", record.runner_attempt_id, record.attempt);
        let evidence = snapshot(&project.manifest, &record.evidence, &attempt_id)?;
        results.push(RawTestResult {
            test_id: Some(test_id.clone()),
            scope: Some(ExecutionScope {
                version: 1,
                run_id: run_id.into(),
                worker_id: format!("nextest-{}", record.binary_id),
                test_id: test_id.clone(),
                test_key: test_id.clone(),
                retry: record.attempt - 1,
                attempt_id: attempt_id.clone(),
            }),
            test: test_id,
            test_file: Some(artifact.source.clone()),
            title: Some(record.test_name.clone()),
            retry: Some(record.attempt - 1),
            status: Some(if passed { "passed" } else { "failed" }.into()),
            expected_status: Some("passed".into()),
            flaky: passed && record.attempt > 1,
            provenance: TestProvenance {
                runner: "nextest".into(),
                kind: artifact.kind.clone(),
                project: Some(artifact.binary_name.clone()),
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
    // nextest stops early on a failure when asked to; then a listed test that
    // never ran is expected, and the exit code already says so.
    if exit_code == 0 {
        let missing = selected
            .difference(&ran)
            .map(|(binary_id, name)| format!("{binary_id} {name}"))
            .collect::<Vec<_>>();
        if !missing.is_empty() {
            return Err(RustTestRunnerError::Context(format!(
                "nextest listed {} test(s) it never ran through the runner: {}",
                missing.len(),
                missing.join(", ")
            )));
        }
    }
    Ok(NextestOutcome {
        results,
        artifact_files: artifacts
            .into_values()
            .map(|artifact| artifact.executable)
            .collect(),
        exit_code,
    })
}

/// `--config target.<triple>.runner=[...]` for every target of the plan: this
/// program in runner mode, told where to record and which target it serves.
fn runner_configuration_arguments(
    program: &Path,
    root: &Path,
    plan: &RunnerPlan,
) -> Result<Vec<String>, RustTestRunnerError> {
    let json = |value: &str| serde_json::to_string(value).map_err(RustTestRunnerError::Json);
    let program = json(program.to_str().ok_or_else(|| {
        RustTestRunnerError::Context("the Supercov executable path is not UTF-8".into())
    })?)?;
    let root = json(root.to_str().ok_or_else(|| {
        RustTestRunnerError::Context("the nextest evidence root is not UTF-8".into())
    })?)?;
    let marker = json(RUNNER_MODE_ARGUMENT)?;
    let mut arguments = Vec::with_capacity(plan.targets.len() * 2);
    let mut seen = BTreeSet::new();
    for target in &plan.targets {
        if !seen.insert(target.target.as_str()) {
            return Err(RustTestRunnerError::Context(format!(
                "the Cargo runner plan names target {} twice",
                target.target
            )));
        }
        let triple = json(&target.target)?;
        arguments.push("--config".into());
        arguments.push(format!(
            "target.{triple}.runner=[{program},{marker},{root},{triple}]"
        ));
    }
    if arguments.is_empty() {
        return Err(RustTestRunnerError::Context(
            "the Cargo runner plan selected no targets".into(),
        ));
    }
    Ok(arguments)
}

/// Join nextest's listing to Cargo's metadata: each binary to the target it
/// was built from, and so to the source file its tests are attributed to.
fn nextest_artifacts(
    project: &PreparedRustProject,
    catalog: &TestListSummary,
    metadata: &CargoMetadataOutput,
) -> Result<BTreeMap<String, NextestArtifact>, RustTestRunnerError> {
    let canonical_target = fs::canonicalize(&project.target_directory).map_err(io_error)?;
    let packages = metadata
        .packages
        .iter()
        .map(|package| (package.id.as_str(), package))
        .collect::<BTreeMap<_, _>>();
    let mut artifacts = BTreeMap::new();
    for (binary_id, suite) in &catalog.rust_suites {
        let binary_id = binary_id.to_string();
        if suite.binary.binary_id.to_string() != binary_id {
            return Err(RustTestRunnerError::CargoJson(format!(
                "nextest suite key disagrees with binary identity {binary_id}"
            )));
        }
        let package = packages
            .get(suite.binary.package_id.as_str())
            .ok_or_else(|| {
                RustTestRunnerError::CargoJson(format!(
                    "nextest binary {binary_id} names an unknown Cargo package {}",
                    suite.binary.package_id
                ))
            })?;
        if package.name != suite.package_name {
            return Err(RustTestRunnerError::CargoJson(format!(
                "nextest binary {binary_id} package name disagrees with Cargo metadata"
            )));
        }
        let mut targets = package.targets.iter().filter(|target| {
            target.name == suite.binary.binary_name
                && target
                    .kind
                    .iter()
                    .any(|kind| kind == suite.binary.kind.as_str())
        });
        let target = targets.next().ok_or_else(|| {
            RustTestRunnerError::CargoJson(format!(
                "nextest binary {binary_id} has no exact Cargo metadata target"
            ))
        })?;
        if targets.next().is_some() {
            return Err(RustTestRunnerError::CargoJson(format!(
                "nextest binary {binary_id} ambiguously matches Cargo metadata targets"
            )));
        }
        let executable =
            fs::canonicalize(suite.binary.binary_path.as_std_path()).map_err(io_error)?;
        if !executable.starts_with(&canonical_target)
            || !fs::metadata(&executable).is_ok_and(|metadata| metadata.is_file())
        {
            return Err(RustTestRunnerError::UnsafeArtifact(
                executable.display().to_string(),
            ));
        }
        let source = fs::canonicalize(&target.src_path).map_err(io_error)?;
        artifacts.insert(
            binary_id,
            NextestArtifact {
                executable,
                binary_name: suite.binary.binary_name.clone(),
                kind: if suite.binary.kind.as_str() == "test" {
                    "integration".into()
                } else {
                    "unit".into()
                },
                source: relative_source(&project.workspace_root, &source)?,
            },
        );
    }
    if artifacts.is_empty() {
        return Err(RustTestRunnerError::CargoJson(
            "nextest listed no test binaries".into(),
        ));
    }
    Ok(artifacts)
}

fn read_attempts(directory: &Path) -> Result<Vec<AttemptRecord>, RustTestRunnerError> {
    let mut records = Vec::new();
    for entry in fs::read_dir(directory).map_err(io_error)? {
        let path = entry.map_err(io_error)?.path();
        if path
            .extension()
            .is_some_and(|extension| extension == "json")
        {
            records.push(serde_json::from_slice(&fs::read(&path).map_err(io_error)?)?);
        }
    }
    Ok(records)
}

fn combined_output(stdout: &[u8], stderr: &[u8]) -> String {
    format!(
        "{}{}",
        String::from_utf8_lossy(stderr),
        String::from_utf8_lossy(stdout)
    )
    .trim()
    .to_owned()
}

// -------------------------------------------------------------- the runner

/// This program as nextest's target runner: `__nextest-runner <root> <target>
/// <binary> <arguments...>`. A list pass runs the binary untouched; an attempt
/// runs it under an evidence directory of its own and records the identity
/// nextest supplied.
pub fn nextest_runner(arguments: Vec<OsString>) -> i32 {
    match nextest_runner_inner(arguments) {
        Ok(code) => code,
        Err(error) => {
            eprintln!("[supercov] {error}");
            2
        }
    }
}

fn nextest_runner_inner(arguments: Vec<OsString>) -> Result<i32, RustTestRunnerError> {
    let mut arguments = arguments.into_iter();
    let (Some(root), Some(target), Some(binary)) =
        (arguments.next(), arguments.next(), arguments.next())
    else {
        return Err(RustTestRunnerError::Context(
            "the nextest runner needs an evidence root, a target and a binary".into(),
        ));
    };
    let root = PathBuf::from(root);
    let target = target.into_string().map_err(|_| {
        RustTestRunnerError::Context("the nextest runner target is not UTF-8".into())
    })?;
    let rest = arguments.collect::<Vec<_>>();
    let plan: RunnerPlan =
        serde_json::from_slice(&fs::read(root.join(PLAN_FILE)).map_err(io_error)?)?;
    let planned = plan
        .targets
        .iter()
        .find(|candidate| candidate.target == target)
        .ok_or_else(|| {
            RustTestRunnerError::Context(format!(
                "the nextest runner was invoked for an unplanned target: {target}"
            ))
        })?;
    let mut command = match &planned.underlying {
        Some(underlying) => {
            let mut command = Command::new(&underlying.program);
            command.args(&underlying.arguments).arg(&binary);
            command
        }
        None => Command::new(&binary),
    };
    command.args(&rest);
    let identity = classify_rust_runner_environment()
        .map_err(|error| RustTestRunnerError::Context(error.to_string()))?;
    let attempt = match identity {
        RustRunnerInvocationIdentity::NextestList(_) => {
            let status = command
                .status()
                .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
            return Ok(exit_code(&status));
        }
        RustRunnerInvocationIdentity::CargoSingleAttempt => {
            return Err(RustTestRunnerError::Context(
                "the nextest runner was invoked without nextest's identity".into(),
            ));
        }
        RustRunnerInvocationIdentity::NextestAttempt(attempt) => attempt,
    };
    let attempts = root.join(ATTEMPTS_DIRECTORY);
    let sequence = claim_sequence(&attempts)?;
    let evidence = attempts.join(format!("{sequence:08}"));
    fs::create_dir_all(&evidence).map_err(io_error)?;
    let status = command
        .envs(instrumented_stack_environment())
        .env(EVIDENCE_DIR_ENV, &evidence)
        .status()
        .map_err(|error| RustTestRunnerError::Launch(error.to_string()))?;
    let code = exit_code(&status);
    let record = AttemptRecord {
        binary_id: attempt.invocation.binary_id,
        test_name: attempt.test_name,
        attempt: attempt.retry + 1,
        total_attempts: attempt.total_attempts,
        runner_attempt_id: attempt.runner_attempt_id,
        exit_code: code,
        evidence,
    };
    fs::write(
        attempts.join(format!("{sequence:08}.json")),
        serde_json::to_vec(&record)?,
    )
    .map_err(io_error)?;
    Ok(code)
}

/// Attempts run concurrently; each claims the next free sequence number by
/// creating its marker exclusively.
fn claim_sequence(directory: &Path) -> Result<usize, RustTestRunnerError> {
    fs::create_dir_all(directory).map_err(io_error)?;
    for candidate in 0..1_000_000_usize {
        match fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(directory.join(format!("{candidate:08}.claim")))
        {
            Ok(_) => return Ok(candidate),
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => continue,
            Err(error) => return Err(io_error(error)),
        }
    }
    Err(RustTestRunnerError::Io(
        "too many nextest attempt claims".into(),
    ))
}

/// The child's exit code as nextest should see it: the code itself, or the
/// shell convention of 128 plus the signal that ended it.
fn exit_code(status: &std::process::ExitStatus) -> i32 {
    if let Some(code) = status.code() {
        return code;
    }
    #[cfg(unix)]
    {
        use std::os::unix::process::ExitStatusExt;
        if let Some(signal) = status.signal() {
            return 128 + signal;
        }
    }
    1
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn runner_configuration_names_every_target_once() {
        let plan = RunnerPlan {
            targets: vec![
                RunnerTarget {
                    target: "aarch64-apple-darwin".into(),
                    underlying: None,
                },
                RunnerTarget {
                    target: "x86_64-unknown-linux-gnu".into(),
                    underlying: Some(RustCargoResolvedRunner {
                        program: "/opt/qemu".into(),
                        arguments: vec!["--fast".into()],
                    }),
                },
            ],
        };
        let arguments = runner_configuration_arguments(
            Path::new("/opt/super cov/supercov"),
            Path::new("/work/.supercov/rust-evidence/run/nextest"),
            &plan,
        )
        .unwrap();
        assert_eq!(
            arguments,
            [
                "--config",
                "target.\"aarch64-apple-darwin\".runner=[\"/opt/super cov/supercov\",\"__nextest-runner\",\"/work/.supercov/rust-evidence/run/nextest\",\"aarch64-apple-darwin\"]",
                "--config",
                "target.\"x86_64-unknown-linux-gnu\".runner=[\"/opt/super cov/supercov\",\"__nextest-runner\",\"/work/.supercov/rust-evidence/run/nextest\",\"x86_64-unknown-linux-gnu\"]",
            ]
        );
        let duplicated = RunnerPlan {
            targets: vec![
                RunnerTarget {
                    target: "aarch64-apple-darwin".into(),
                    underlying: None,
                },
                RunnerTarget {
                    target: "aarch64-apple-darwin".into(),
                    underlying: None,
                },
            ],
        };
        assert!(
            runner_configuration_arguments(Path::new("/s"), Path::new("/r"), &duplicated).is_err()
        );
    }

    #[test]
    fn attempt_records_round_trip() {
        let record = AttemptRecord {
            binary_id: "fixture::suite".into(),
            test_name: "passes_on_retry".into(),
            attempt: 2,
            total_attempts: 2,
            runner_attempt_id: "run:fixture::suite$passes_on_retry".into(),
            exit_code: 0,
            evidence: "/r/attempts/00000003".into(),
        };
        let decoded: AttemptRecord =
            serde_json::from_slice(&serde_json::to_vec(&record).unwrap()).unwrap();
        assert_eq!(decoded.attempt, 2);
        assert_eq!(decoded.test_name, "passes_on_retry");
        assert_eq!(decoded.evidence, PathBuf::from("/r/attempts/00000003"));
    }
}
