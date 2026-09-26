//! Validation boundary between language-specific producers and shared Rust analysis.
//!
//! Frontends contribute facts, never verdicts. This module enforces the frozen
//! per-run declaration against the normalized manifest/evidence request before
//! the language-neutral analyzer sees it.

use std::collections::{BTreeMap, BTreeSet};

use supercov_contracts::{
    AttributionPrecision, FrontendDeclarationError, FrontendRunDeclaration,
    FrontendRunnerDeclaration, validate_frontend_run_declaration,
};

use crate::coverage_report::{
    CoverageReport, CoverageReportRequest, RawTestResult, ReportError, analyze_coverage_results,
};

#[derive(Debug)]
pub enum FrontendProtocolError {
    Declaration(FrontendDeclarationError),
    InvalidManifestLimitation,
    DuplicateManifestLimitation(String),
    StructuralLimitationMismatch {
        declared: Vec<String>,
        manifest: Vec<String>,
    },
    UndeclaredRunner(String),
    UnobservedRunner(String),
    MissingExactIdentity {
        runner: String,
        axis: &'static str,
    },
    ScopeRunMismatch {
        expected: String,
        actual: String,
    },
    RetryMismatch {
        runner: String,
        result: usize,
        scope: usize,
    },
    InvalidUnstartedResult(String),
    InvalidPhaseKind(String),
    DuplicatePhase(String),
    UnknownPhaseReference(String),
    CyclicPhaseReference(String),
    Analysis(ReportError),
}

impl std::fmt::Display for FrontendProtocolError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Declaration(error) => write!(formatter, "{error}"),
            Self::InvalidManifestLimitation => {
                write!(
                    formatter,
                    "frontend manifest contains a limitation without an ID"
                )
            }
            Self::DuplicateManifestLimitation(id) => {
                write!(formatter, "duplicate frontend manifest limitation: {id}")
            }
            Self::StructuralLimitationMismatch { declared, manifest } => write!(
                formatter,
                "frontend structural limitation references differ: declared={declared:?} manifest={manifest:?}"
            ),
            Self::UndeclaredRunner(runner) => {
                write!(
                    formatter,
                    "frontend evidence uses undeclared runner: {runner}"
                )
            }
            Self::UnobservedRunner(runner) => {
                write!(
                    formatter,
                    "frontend declares an unobserved runner: {runner}"
                )
            }
            Self::MissingExactIdentity { runner, axis } => {
                write!(
                    formatter,
                    "frontend runner {runner} is missing exact {axis} identity"
                )
            }
            Self::ScopeRunMismatch { expected, actual } => write!(
                formatter,
                "frontend evidence run identity differs: expected={expected} actual={actual}"
            ),
            Self::RetryMismatch {
                runner,
                result,
                scope,
            } => write!(
                formatter,
                "frontend runner {runner} retry identity differs: result={result} scope={scope}"
            ),
            Self::InvalidUnstartedResult(reason) => {
                write!(
                    formatter,
                    "invalid selected-but-unstarted test record: {reason}"
                )
            }
            Self::InvalidPhaseKind(kind) => {
                write!(formatter, "unsupported frontend phase kind: {kind}")
            }
            Self::DuplicatePhase(id) => write!(formatter, "duplicate frontend phase ID: {id}"),
            Self::UnknownPhaseReference(id) => {
                write!(formatter, "unknown frontend phase reference: {id}")
            }
            Self::CyclicPhaseReference(id) => {
                write!(formatter, "cyclic frontend phase causality at: {id}")
            }
            Self::Analysis(error) => write!(formatter, "{error:?}"),
        }
    }
}

impl std::error::Error for FrontendProtocolError {}

impl From<FrontendDeclarationError> for FrontendProtocolError {
    fn from(error: FrontendDeclarationError) -> Self {
        Self::Declaration(error)
    }
}

fn manifest_limitation_ids(
    request: &CoverageReportRequest,
) -> Result<BTreeSet<String>, FrontendProtocolError> {
    let mut ids = BTreeSet::new();
    for limitation in &request.manifest.limitations {
        let id = limitation
            .get("id")
            .and_then(serde_json::Value::as_str)
            .filter(|id| !id.is_empty())
            .ok_or(FrontendProtocolError::InvalidManifestLimitation)?;
        if !ids.insert(id.to_owned()) {
            return Err(FrontendProtocolError::DuplicateManifestLimitation(
                id.to_owned(),
            ));
        }
    }
    Ok(ids)
}

fn present(value: &str) -> bool {
    !value.trim().is_empty() && !value.chars().any(char::is_control)
}

fn has_attributable_observations(raw: &RawTestResult) -> bool {
    !raw.phases.is_empty()
        || !raw.server.is_empty()
        || raw.runtime.iter().chain(&raw.browser).any(|snapshot| {
            !snapshot.decisions.is_empty()
                || !snapshot.hits.is_empty()
                || !snapshot.events.is_empty()
        })
}

fn require_exact_identities(
    runner: &FrontendRunnerDeclaration,
    raw: &RawTestResult,
    run_id: &str,
    global_phase_ids: &mut BTreeSet<String>,
) -> Result<(), FrontendProtocolError> {
    let missing = |axis| FrontendProtocolError::MissingExactIdentity {
        runner: runner.runner.clone(),
        axis,
    };
    if runner.attribution.test == AttributionPrecision::Exact
        && !raw.test_id.as_deref().is_some_and(present)
    {
        return Err(missing("test"));
    }
    let has_observations = has_attributable_observations(raw);
    let unstarted = raw.status.as_deref() == Some("unstarted");
    if unstarted
        && (raw.role != "test"
            || raw.scope.is_some()
            || raw.retry.is_some()
            || raw.flaky
            || has_observations)
    {
        return Err(FrontendProtocolError::InvalidUnstartedResult(
            "it must be a test with no scope, retry, flaky verdict, phase, or observation".into(),
        ));
    }
    if let Some(scope) = &raw.scope {
        if scope.run_id != run_id {
            return Err(FrontendProtocolError::ScopeRunMismatch {
                expected: run_id.to_owned(),
                actual: scope.run_id.clone(),
            });
        }
        if runner.attribution.worker == AttributionPrecision::Exact && !present(&scope.worker_id) {
            return Err(missing("worker"));
        }
        if runner.attribution.test == AttributionPrecision::Exact
            && (!present(&scope.test_id) || raw.test_id.as_deref() != Some(scope.test_id.as_str()))
        {
            return Err(missing("test"));
        }
        if runner.attribution.retry == AttributionPrecision::Exact {
            let result_retry = raw.retry.ok_or_else(|| missing("retry"))?;
            if result_retry != scope.retry {
                return Err(FrontendProtocolError::RetryMismatch {
                    runner: runner.runner.clone(),
                    result: result_retry,
                    scope: scope.retry,
                });
            }
        }
    } else if runner.attribution.worker == AttributionPrecision::Exact && has_observations {
        return Err(missing("worker"));
    } else if runner.attribution.retry == AttributionPrecision::Exact
        && raw.retry.is_none()
        && !unstarted
    {
        return Err(missing("retry"));
    }

    let mut phase_ids = BTreeSet::new();
    for phase in &raw.phases {
        if !matches!(
            phase.kind.as_str(),
            "setup" | "test" | "action" | "assertion" | "teardown" | "background"
        ) {
            return Err(FrontendProtocolError::InvalidPhaseKind(phase.kind.clone()));
        }
        if runner.attribution.phase == AttributionPrecision::Exact && !present(&phase.id) {
            return Err(missing("phase"));
        }
        if !phase_ids.insert(phase.id.clone()) {
            return Err(FrontendProtocolError::DuplicatePhase(phase.id.clone()));
        }
        if !global_phase_ids.insert(phase.id.clone()) {
            return Err(FrontendProtocolError::DuplicatePhase(phase.id.clone()));
        }
    }
    let phase_reference = |id: &str| {
        if present(id) && phase_ids.contains(id) {
            Ok(())
        } else {
            Err(FrontendProtocolError::UnknownPhaseReference(id.to_owned()))
        }
    };
    for phase in &raw.phases {
        if let Some(cause) = &phase.caused_by_phase_id {
            phase_reference(cause)?;
        }
    }
    let causes = raw
        .phases
        .iter()
        .filter_map(|phase| {
            phase
                .caused_by_phase_id
                .as_ref()
                .map(|cause| (phase.id.as_str(), cause.as_str()))
        })
        .collect::<BTreeMap<_, _>>();
    for start in causes.keys() {
        let mut visited = BTreeSet::new();
        let mut current = *start;
        while let Some(next) = causes.get(current) {
            if !visited.insert(current) {
                return Err(FrontendProtocolError::CyclicPhaseReference(
                    (*start).to_owned(),
                ));
            }
            current = next;
        }
    }
    for snapshot in raw.runtime.iter().chain(&raw.browser) {
        for event in &snapshot.events {
            if let Some(phase) = &event.phase_id {
                phase_reference(phase)?;
            }
        }
        if let Some(phase) = &snapshot.phase_id {
            phase_reference(phase)?;
        }
    }
    for record in &raw.server {
        if let Some(phase) = &record.phase_id {
            phase_reference(phase)?;
        }
    }
    Ok(())
}

pub fn validate_frontend_report_request(
    declaration: &FrontendRunDeclaration,
    request: &CoverageReportRequest,
) -> Result<(), FrontendProtocolError> {
    validate_frontend_run_declaration(declaration)?;
    let manifest = manifest_limitation_ids(request)?;
    let declared = declaration
        .structural_limitations
        .iter()
        .cloned()
        .collect::<BTreeSet<_>>();
    if declared != manifest {
        return Err(FrontendProtocolError::StructuralLimitationMismatch {
            declared: declared.into_iter().collect(),
            manifest: manifest.into_iter().collect(),
        });
    }

    let runners = declaration
        .runners
        .iter()
        .map(|runner| (runner.runner.as_str(), runner))
        .collect::<BTreeMap<_, _>>();
    let mut observed = BTreeSet::new();
    let mut phase_ids = BTreeSet::new();
    for raw in &request.raw_results {
        let name = raw.provenance.runner.as_str();
        let runner = runners
            .get(name)
            .ok_or_else(|| FrontendProtocolError::UndeclaredRunner(name.to_owned()))?;
        observed.insert(name);
        require_exact_identities(runner, raw, &request.run_id, &mut phase_ids)?;
    }
    for runner in runners.keys() {
        if !observed.contains(runner) {
            return Err(FrontendProtocolError::UnobservedRunner(
                (*runner).to_owned(),
            ));
        }
    }
    Ok(())
}

pub fn analyze_frontend_results(
    declaration: &FrontendRunDeclaration,
    request: &CoverageReportRequest,
) -> Result<CoverageReport, FrontendProtocolError> {
    validate_frontend_report_request(declaration, request)?;
    analyze_coverage_results(request).map_err(FrontendProtocolError::Analysis)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::{
        coverage_analysis::PointKind,
        coverage_report::{
            CoverageManifest, CoveragePhase, ExecutionScope, ExitCodeInput, PointMeta,
            RuntimeEvent, RuntimeSnapshot, TestProvenance,
        },
    };
    use supercov_contracts::{
        ExecutionModel, FrontendAttribution, FrontendLimitation, FrontendLimitationScope,
        FrontendRunnerDeclaration, LANGUAGE_FRONTEND_PROTOCOL_VERSION, StructuralSource,
    };

    fn declaration() -> FrontendRunDeclaration {
        FrontendRunDeclaration {
            protocol_version: LANGUAGE_FRONTEND_PROTOCOL_VERSION,
            frontend_id: "fixture".into(),
            frontend_version: "fixture-v1".into(),
            language: "fixture".into(),
            structural_source: StructuralSource::NativeImport,
            runners: vec![FrontendRunnerDeclaration {
                runner: "fixture-runner".into(),
                execution_model: ExecutionModel::SerialInProcess,
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
                    id: "no-action-hook".into(),
                    scopes: vec![FrontendLimitationScope::Action],
                    reason: "The fixture runner has no action lifecycle".into(),
                }],
            }],
            structural_limitations: vec!["dynamic-fixture".into()],
        }
    }

    fn request() -> CoverageReportRequest {
        CoverageReportRequest {
            run_id: "run".into(),
            manifest: CoverageManifest {
                unmeasured: Vec::new(),
                decisions: vec![],
                points: vec![PointMeta {
                    id: "point".into(),
                    kind: PointKind::Statement,
                    file: "src/example.py".into(),
                    line: 1,
                    column: 1,
                    source: "work()".into(),
                    label: None,
                }],
                branches: vec![],
                limitations: vec![serde_json::json!({
                    "id": "dynamic-fixture",
                    "kind": "dynamic-code",
                    "file": "src/example.py",
                    "line": 2,
                    "column": 1,
                    "source": "eval(source)",
                    "reason": "Runtime source has no stable denominator"
                })],
                scope: None,
            },
            raw_results: vec![RawTestResult {
                test_id: Some("test".into()),
                scope: Some(ExecutionScope {
                    version: 1,
                    run_id: "run".into(),
                    worker_id: "worker".into(),
                    test_id: "test".into(),
                    test_key: "test".into(),
                    retry: 0,
                    attempt_id: "attempt".into(),
                }),
                test: "test".into(),
                test_file: Some("tests/test_example.py".into()),
                title: Some("test".into()),
                retry: Some(0),
                status: Some("passed".into()),
                expected_status: Some("passed".into()),
                flaky: false,
                provenance: TestProvenance {
                    runner: "fixture-runner".into(),
                    kind: "integration".into(),
                    project: None,
                    source: "explicit".into(),
                },
                role: "test".into(),
                attribution: crate::coverage_report::ATTRIBUTION_EXACT.into(),
                phases: vec![CoveragePhase {
                    id: "assertion".into(),
                    kind: "assertion".into(),
                    operation: "assert result".into(),
                    source: Some("tests/test_example.py:1".into()),
                    caused_by_phase_id: None,
                    started_at_ms: 1,
                    ended_at_ms: Some(2),
                    status: Some("passed".into()),
                    error: None,
                }],
                runtime: vec![RuntimeSnapshot {
                    decisions: vec![],
                    hits: vec!["point".into()],
                    events: vec![RuntimeEvent {
                        event_type: "hit".into(),
                        id: "point".into(),
                        vector: None,
                        timestamp_ms: 1,
                        phase_id: Some("assertion".into()),
                        statement_id: None,
                        environment: "fixture".into(),
                    }],
                    logicals: vec![],
                    phase_id: None,
                }],
                browser: vec![],
                server: vec![],
            }],
            generated_at: "2026-08-25T00:00:00.000Z".into(),
            coverage_model: None,
            integrity: None,
            test_exit_code: ExitCodeInput::Present(Some(0)),
        }
    }

    #[test]
    fn validates_a_declared_frontend_before_shared_analysis() {
        let report = analyze_frontend_results(&declaration(), &request()).unwrap();
        assert!(report.execution.unwrap().valid);
        assert_eq!(report.view.summary.statements.covered, 1);
        assert!(!report.view.summary.coverage_complete);
    }

    #[test]
    fn rejects_hidden_limitations_undeclared_runners_and_missing_exact_scope() {
        let mut hidden = declaration();
        hidden.structural_limitations.clear();
        assert!(matches!(
            validate_frontend_report_request(&hidden, &request()),
            Err(FrontendProtocolError::StructuralLimitationMismatch { .. })
        ));

        let mut undeclared = request();
        undeclared.raw_results[0].provenance.runner = "other".into();
        assert!(matches!(
            validate_frontend_report_request(&declaration(), &undeclared),
            Err(FrontendProtocolError::UndeclaredRunner(runner)) if runner == "other"
        ));

        let mut missing_scope = request();
        missing_scope.raw_results[0].scope = None;
        assert!(matches!(
            validate_frontend_report_request(&declaration(), &missing_scope),
            Err(FrontendProtocolError::MissingExactIdentity { axis: "worker", .. })
        ));

        let mut unknown_phase = request();
        unknown_phase.raw_results[0].runtime[0].events[0].phase_id = Some("other".into());
        assert!(matches!(
            validate_frontend_report_request(&declaration(), &unknown_phase),
            Err(FrontendProtocolError::UnknownPhaseReference(id)) if id == "other"
        ));

        let mut cyclic_phase = request();
        cyclic_phase.raw_results[0].phases[0].caused_by_phase_id = Some("assertion".into());
        assert!(matches!(
            validate_frontend_report_request(&declaration(), &cyclic_phase),
            Err(FrontendProtocolError::CyclicPhaseReference(id)) if id == "assertion"
        ));
    }

    #[test]
    fn selected_but_unstarted_tests_have_no_invented_attempt_identity() {
        let mut unstarted = request();
        let raw = &mut unstarted.raw_results[0];
        raw.scope = None;
        raw.retry = None;
        raw.status = Some("unstarted".into());
        raw.phases.clear();
        raw.runtime.clear();
        assert!(validate_frontend_report_request(&declaration(), &unstarted).is_ok());

        let mut false_attempt = unstarted.clone();
        false_attempt.raw_results[0].retry = Some(0);
        assert!(matches!(
            validate_frontend_report_request(&declaration(), &false_attempt),
            Err(FrontendProtocolError::InvalidUnstartedResult(_))
        ));

        let mut false_observation = unstarted;
        false_observation.raw_results[0].runtime = request().raw_results[0].runtime.clone();
        assert!(matches!(
            validate_frontend_report_request(&declaration(), &false_observation),
            Err(FrontendProtocolError::InvalidUnstartedResult(_))
        ));
    }
}
