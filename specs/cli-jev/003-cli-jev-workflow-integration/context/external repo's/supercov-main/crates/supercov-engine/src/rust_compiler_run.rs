//! Private transactional lifecycle for the compiler-owned Rust frontend.

use std::{
    fs,
    io::Write,
    path::PathBuf,
    thread,
    time::{Duration, Instant},
};

use serde::{Deserialize, Serialize};

use crate::{
    coverage_report::{ArchiveReportRequest, ExitCodeInput, analyze_coverage_archive},
    evidence_archive::{EvidenceArchiveWriteFault, write_archive, write_archive_with_fault},
    lifecycle::{
        ProjectLock, RunPublicationFault, RunState, RunStateStatus, atomic_write,
        finalize_published_run, publish_run, publish_run_with_fault, recover_abandoned_runs,
        remove_stored_tree_deferred, update_run_state, write_run_state,
    },
    run_store::{RawEvidenceMetadata, RunMetadata, RunTimings},
    rust_cargo_configuration::resolve_cargo_runner_plan,
    rust_compiler_test_runner::{RustCompilerRunRequest, run_rust_compiler_frontend},
    rust_run::current_rust_integrity,
    rust_test_runner::cargo_invocation,
    workspace::{prepare_cargo_cached_workspace, remove_cargo_workspace_run},
};

#[derive(Debug, Clone, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct DirectRustCompilerRunRequest {
    pub root: PathBuf,
    pub command: Vec<String>,
    pub run_id: String,
    pub started_at: String,
    pub wrapper_path: PathBuf,
    pub companion_candidates: Vec<PathBuf>,
    pub require_public_capabilities: bool,
    #[serde(skip)]
    pub watchdog_program: Option<PathBuf>,
    #[serde(skip)]
    pub publication_fault: Option<RustCompilerPublicationFault>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum RustCompilerPublicationFault {
    ArchiveEnospc,
    FinalRename,
    WaitBeforePublication,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DirectRustCompilerRunResult {
    pub run_id: String,
    pub run_directory: PathBuf,
    pub exit_code: i32,
    pub tests: usize,
    pub libtests: usize,
    pub doctests: usize,
    pub setup_results: usize,
    pub background_results: usize,
    pub artifacts: usize,
    pub selection: crate::rust_compiler_selection::SelectedRustCompilerCompanion,
    pub denominator: RustCompilerDenominatorCounts,
    pub transport_health: Vec<crate::rust_compiler_test_runner::RustCompilerTransportHealthRecord>,
    pub summary: crate::coverage_analysis::CoverageSummary,
    pub recovered_runs: Vec<String>,
    pub metadata: RunMetadata,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RustCompilerDenominatorCounts {
    pub points: usize,
    pub branches: usize,
    pub decisions: usize,
    pub limitations: usize,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DirectRustCompilerRunError {
    pub message: String,
    pub exit_code: i32,
    pub signal: Option<String>,
}

impl std::fmt::Display for DirectRustCompilerRunError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        formatter.write_str(&self.message)
    }
}

impl std::error::Error for DirectRustCompilerRunError {}

impl From<String> for DirectRustCompilerRunError {
    fn from(message: String) -> Self {
        Self {
            message,
            exit_code: 2,
            signal: None,
        }
    }
}

impl From<&str> for DirectRustCompilerRunError {
    fn from(message: &str) -> Self {
        message.to_owned().into()
    }
}

fn elapsed_ms(started: Instant) -> f64 {
    (started.elapsed().as_secs_f64() * 10_000.0).round() / 10.0
}

fn direct_frontend_error(
    error: crate::rust_compiler_test_runner::RustCompilerTestError,
) -> DirectRustCompilerRunError {
    match error {
        crate::rust_compiler_test_runner::RustCompilerTestError::Interrupted { code, signal } => {
            DirectRustCompilerRunError {
                message: format!("Rust compiler run was interrupted by {signal}"),
                exit_code: code,
                signal: Some(signal),
            }
        }
        crate::rust_compiler_test_runner::RustCompilerTestError::UnverifiedExecution {
            code,
            reason,
        } => DirectRustCompilerRunError {
            message: format!(
                "Rust test command exited {code}, but Supercov could not authenticate complete coverage evidence: {reason}"
            ),
            exit_code: code,
            signal: None,
        },
        error => error.to_string().into(),
    }
}

fn wait_before_publication(root: &std::path::Path, run_id: &str) -> Result<(), String> {
    let work = root.join(".supercov/work").join(run_id);
    let ready = work.join("spike-publication-ready");
    let release = work.join("spike-publication-release");
    atomic_write(root, &ready, b"ready\n").map_err(|error| error.to_string())?;
    let started = Instant::now();
    loop {
        match fs::symlink_metadata(&release) {
            Ok(metadata) if metadata.file_type().is_file() => return Ok(()),
            Ok(_) => {
                return Err(format!(
                    "invalid private publication release marker: {}",
                    release.display()
                ));
            }
            Err(error) if error.kind() == std::io::ErrorKind::NotFound => {}
            Err(error) => return Err(format!("{}: {error}", release.display())),
        }
        if started.elapsed() >= Duration::from_secs(120) {
            return Err("timed out at private compiler publication gate".into());
        }
        thread::sleep(Duration::from_millis(25));
    }
}

pub fn run_direct_rust_compiler(
    request: &DirectRustCompilerRunRequest,
    diagnostics: &mut dyn Write,
) -> Result<DirectRustCompilerRunResult, DirectRustCompilerRunError> {
    if request.command.is_empty() || request.companion_candidates.is_empty() {
        return Err("test command and exact compiler companion candidates are required".into());
    }
    let total_started = Instant::now();
    let initialization_started = Instant::now();
    let root = fs::canonicalize(&request.root)
        .map_err(|error| format!("{}: {error}", request.root.display()))?;
    let cargo_invocation =
        cargo_invocation(&root, &request.command).map_err(|error| error.to_string())?;
    let mut lock = ProjectLock::acquire(&root, &request.run_id, &request.started_at)
        .map_err(|error| error.to_string())?;
    let initialization_ms = elapsed_ms(initialization_started);
    let result = (|| -> Result<DirectRustCompilerRunResult, DirectRustCompilerRunError> {
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
        let integrity = current_rust_integrity(&root, &request.command, None)?;
        let assertion_inputs = crate::assertion_inputs::capture(
            &root,
            "rust",
            crate::rust_run::collect_integrity_inputs(&root, &request.command)?.assertion_paths(),
        )?;
        let workspace_started = Instant::now();
        let workspace =
            prepare_cargo_cached_workspace(&root, &lock).map_err(|error| error.to_string())?;
        let cargo_runner_plan = resolve_cargo_runner_plan(&root, &workspace, &cargo_invocation)
            .map_err(|error| error.to_string())?;
        let workspace_preparation_ms = elapsed_ms(workspace_started);
        let adapter_setup_ms = (elapsed_ms(adapter_started) - workspace_preparation_ms).max(0.0);

        write_run_state(
            &root,
            &RunState {
                id: request.run_id.clone(),
                pid: std::process::id(),
                root: root.display().to_string(),
                workspace: workspace.display().to_string(),
                started_at: request.started_at.clone(),
                updated_at: request.started_at.clone(),
                status: RunStateStatus::Preparing,
                signal: None,
                error: None,
            },
        )
        .map_err(|error| error.to_string())?;
        update_run_state(
            &root,
            &request.run_id,
            RunStateStatus::Building,
            &request.started_at,
            None,
        )
        .map_err(|error| error.to_string())?;

        let run = run_rust_compiler_frontend(
            &RustCompilerRunRequest {
                project_root: workspace.clone(),
                command: request.command.clone(),
                run_id: request.run_id.clone(),
                generated_at: request.started_at.clone(),
                wrapper_path: request.wrapper_path.clone(),
                companion_candidates: request.companion_candidates.clone(),
                require_public_capabilities: request.require_public_capabilities,
                cargo_runner_plan,
                watchdog_program: request.watchdog_program.clone(),
            },
            diagnostics,
        )
        .map_err(direct_frontend_error)?;

        let publication_started = Instant::now();
        let archive_path = root
            .join(".supercov/work")
            .join(&request.run_id)
            .join("evidence.raw.gz");
        let archive_entries = crate::assertion_inputs::append(
            run.archive_entries().map_err(|error| error.to_string())?,
            &assertion_inputs,
        )?;
        let raw = match request.publication_fault {
            Some(RustCompilerPublicationFault::ArchiveEnospc) => write_archive_with_fault(
                archive_entries,
                &archive_path,
                EvidenceArchiveWriteFault::NoSpaceAfterBytes(128),
            ),
            _ => write_archive(archive_entries, &archive_path),
        }
        .map_err(|error| error.to_string())?;
        let report = analyze_coverage_archive(&ArchiveReportRequest {
            archive_path: archive_path.clone(),
            run_id: request.run_id.clone(),
            generated_at: request.started_at.clone(),
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(run.exit_code)),
        })
        .map_err(|error| format!("archived Rust compiler evidence is invalid: {error:?}"))?;
        let evidence_publication_ms = elapsed_ms(publication_started);
        let timings = RunTimings {
            initialization_ms,
            workspace_preparation_ms,
            adapter_setup_ms,
            instrumented_build_ms: (run.build_ms * 10.0).round() / 10.0,
            test_command_ms: (run.execution_ms * 10.0).round() / 10.0,
            evidence_publication_ms,
        };
        let metadata = RunMetadata {
            id: request.run_id.clone(),
            started_at: request.started_at.clone(),
            duration_ms: elapsed_ms(total_started),
            command: request.command.clone(),
            test_exit_code: Some(run.exit_code),
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
            source_roots: None,
        };
        let tests = run
            .request
            .raw_results
            .iter()
            .filter(|result| result.role == "test")
            .map(|result| result.test_id.as_deref().unwrap_or(&result.test))
            .collect::<std::collections::BTreeSet<_>>()
            .len();
        let libtests = run
            .request
            .raw_results
            .iter()
            .filter(|result| {
                result.role == "test"
                    && matches!(
                        result.provenance.runner.as_str(),
                        "rust-libtest" | "rust-custom-harness" | "rust-nextest"
                    )
            })
            .map(|result| result.test_id.as_deref().unwrap_or(&result.test))
            .collect::<std::collections::BTreeSet<_>>()
            .len();
        let doctests = run
            .request
            .raw_results
            .iter()
            .filter(|result| result.role == "test" && result.provenance.runner == "rustdoc")
            .map(|result| result.test_id.as_deref().unwrap_or(&result.test))
            .collect::<std::collections::BTreeSet<_>>()
            .len();
        if tests != libtests + doctests {
            return Err("Rust compiler run contains an unclassified test runner".into());
        }
        let background_results = run
            .request
            .raw_results
            .iter()
            .filter(|result| result.role == "background")
            .count();
        let setup_results = run
            .request
            .raw_results
            .iter()
            .filter(|result| result.role == "setup")
            .count();
        let denominator = RustCompilerDenominatorCounts {
            points: run.request.manifest.points.len(),
            branches: run.request.manifest.branches.len(),
            decisions: run.request.manifest.decisions.len(),
            limitations: run.request.manifest.limitations.len(),
        };
        update_run_state(
            &root,
            &request.run_id,
            RunStateStatus::Publishing,
            &request.started_at,
            None,
        )
        .map_err(|error| error.to_string())?;
        if request.publication_fault == Some(RustCompilerPublicationFault::WaitBeforePublication) {
            wait_before_publication(&root, &request.run_id)?;
        }
        let run_directory = match request.publication_fault {
            Some(RustCompilerPublicationFault::FinalRename) => publish_run_with_fault(
                &root,
                &metadata,
                &archive_path,
                crate::lifecycle::Archived::default(),
                Some(RunPublicationFault::FinalRename),
            ),
            _ => publish_run(&root, &metadata, &archive_path),
        }
        .map_err(|error| error.to_string())?;
        update_run_state(
            &root,
            &request.run_id,
            if run.exit_code == 0 {
                RunStateStatus::Complete
            } else {
                RunStateStatus::Failed
            },
            &request.started_at,
            None,
        )
        .map_err(|error| error.to_string())?;
        finalize_published_run(&root, &request.run_id).map_err(|error| error.to_string())?;
        remove_cargo_workspace_run(&root, &request.run_id).map_err(|error| error.to_string())?;
        Ok(DirectRustCompilerRunResult {
            run_id: request.run_id.clone(),
            run_directory,
            exit_code: run.exit_code,
            tests,
            libtests,
            doctests,
            setup_results,
            background_results,
            artifacts: run.artifacts,
            selection: run.selection,
            denominator,
            transport_health: run.transport_health,
            summary: report.view.summary,
            recovered_runs,
            metadata,
        })
    })();
    if let Err(error) = &result {
        if let Some(signal) = &error.signal {
            let _ = crate::lifecycle::interrupt_run_state(
                &root,
                &request.run_id,
                &request.started_at,
                signal,
            );
        } else {
            let _ = update_run_state(
                &root,
                &request.run_id,
                RunStateStatus::Failed,
                &request.started_at,
                Some(error.message.clone()),
            );
        }
        let _ =
            remove_stored_tree_deferred(&root, &root.join(".supercov/work").join(&request.run_id));
        let _ = remove_cargo_workspace_run(&root, &request.run_id);
    }
    let release = lock.release().map_err(|error| error.to_string());
    match (result, release) {
        (Ok(result), Ok(())) => Ok(result),
        (Err(error), _) => Err(error),
        (Ok(_), Err(error)) => Err(error.into()),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn unverified_test_runner_status_preserves_the_user_exit_code() {
        let error = direct_frontend_error(
            crate::rust_compiler_test_runner::RustCompilerTestError::UnverifiedExecution {
                code: 104,
                reason: "runner setup failed".into(),
            },
        );
        assert_eq!(error.exit_code, 104);
        assert!(error.signal.is_none());
        assert!(error.message.contains("could not authenticate"));
    }
}
