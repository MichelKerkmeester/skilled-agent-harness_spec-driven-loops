//! One agent-query implementation over an authenticated immutable query index.
//!
//! Opening, rebuilding and storing indexes belongs to `run_store`; this module
//! is deliberately unaware of paths. Both archive differential tests and the
//! persisted-run CLI therefore exercise exactly the same query operators.

use serde::{Deserialize, Serialize};
use serde_json::{Map, Value, json};

use crate::{
    agent_json::{self, ResponseTooLarge},
    coverage_index::{CoverageDimension, CoverageIndex, CoverageViewId},
    coverage_query::{
        CoverageCoversData, CoverageCoversQueryOptions, CoverageDecisionData,
        CoverageDecisionQueryOptions, CoverageDiffData, CoverageDiffQueryOptions,
        CoverageDimensionQueryData, CoverageDimensionQueryOptions, CoverageFileDecisionsData,
        CoverageFileDecisionsOptions, CoverageFileDetailData, CoverageFileDetailOptions,
        CoverageFileQueryData, CoverageFileQueryOptions, CoverageFilesData, CoverageGapsData,
        CoverageKindsData, CoverageMinimizeData, CoverageMinimizeQueryOptions,
        CoverageQueryFilters, CoverageRunnersData, CoverageScopeData, CoverageScopeQueryOptions,
        CoverageSummaryData, CoverageSummaryQueryOptions, CoverageTestData,
        CoverageTestQueryOptions, DecisionSort, MinimizeMetric, QueryError, coverage_covers_query,
        coverage_decision_query, coverage_diff_query, coverage_dimension_query,
        coverage_file_decisions_query, coverage_file_detail_query, coverage_file_query,
        coverage_minimize_query, coverage_scope_query, coverage_summary_query, coverage_test_query,
    },
    coverage_report::CoverageReport,
};

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct IndexedQueryRequest {
    pub run_id: String,
    pub filter: String,
    pub command: String,
    #[serde(default = "default_metric")]
    pub metric: MinimizeMetric,
    pub kind: Option<String>,
    pub runner: Option<String>,
    pub file: Option<String>,
    pub line: Option<usize>,
    pub selector: Option<String>,
    pub sort: Option<DecisionSort>,
    pub valid: Option<bool>,
    pub test_exit_code: Option<i32>,
    pub stale: Option<bool>,
    pub stale_reasons: Option<Vec<String>>,
    #[serde(default)]
    pub offset: usize,
    #[serde(default = "default_limit")]
    pub limit: usize,
    pub target: Option<f64>,
    pub max_states: Option<usize>,
}

fn default_limit() -> usize {
    20
}

fn default_metric() -> MinimizeMetric {
    MinimizeMetric::All
}

impl IndexedQueryRequest {
    pub fn view(&self) -> Result<CoverageViewId, IndexedQueryError> {
        match self.filter.as_str() {
            "all" => Ok(CoverageViewId::All),
            "passed" => Ok(CoverageViewId::Passed),
            "failed" => Ok(CoverageViewId::Failed),
            _ => Err(IndexedQueryError::InvalidFilter(self.filter.clone())),
        }
    }
}

#[derive(Debug)]
pub enum IndexedQueryError {
    InvalidFilter(String),
    UnsupportedCommand(String),
    MissingArgument(&'static str),
    MissingNewerRun,
    MissingReport,
    Query(QueryError),
    ResponseTooLarge(ResponseTooLarge),
}

impl From<QueryError> for IndexedQueryError {
    fn from(value: QueryError) -> Self {
        Self::Query(value)
    }
}

impl From<ResponseTooLarge> for IndexedQueryError {
    fn from(value: ResponseTooLarge) -> Self {
        Self::ResponseTooLarge(value)
    }
}

impl std::fmt::Display for IndexedQueryError {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::InvalidFilter(filter) => write!(formatter, "invalid coverage filter: {filter}"),
            Self::UnsupportedCommand(command) => {
                write!(formatter, "unsupported indexed query: {command}")
            }
            Self::MissingArgument(argument) => {
                write!(formatter, "indexed query requires {argument}")
            }
            Self::MissingNewerRun => write!(formatter, "indexed diff requires a newer run"),
            Self::MissingReport => write!(
                formatter,
                "coverage minimization requires reconstructed per-test evidence"
            ),
            Self::Query(error) => write!(formatter, "{error:?}"),
            Self::ResponseTooLarge(error) => write!(
                formatter,
                "response is {} bytes and exceeds the {}-byte limit",
                error.actual_bytes, error.max_bytes
            ),
        }
    }
}

impl std::error::Error for IndexedQueryError {}

fn grouped_decimal(value: usize) -> String {
    let digits = value.to_string();
    let mut grouped = String::with_capacity(digits.len() + digits.len() / 3);
    for (index, digit) in digits.bytes().enumerate() {
        if index > 0 && (digits.len() - index).is_multiple_of(3) {
            grouped.push(',');
        }
        grouped.push(char::from(digit));
    }
    grouped
}

fn metric_name(metric: MinimizeMetric) -> &'static str {
    match metric {
        MinimizeMetric::All => "all",
        MinimizeMetric::Lines => "lines",
        MinimizeMetric::Statements => "statements",
        MinimizeMetric::Functions => "functions",
        MinimizeMetric::Branches => "branches",
        MinimizeMetric::Mcdc => "mcdc",
    }
}

fn test_filter_details(kind: &Option<String>, runner: &Option<String>) -> (String, Value) {
    let mut labels = Vec::new();
    let mut details = Map::new();
    if let Some(kind) = kind {
        labels.push(format!("kind={kind}"));
        details.insert("kind".into(), Value::String(kind.clone()));
    }
    if let Some(runner) = runner {
        labels.push(format!("runner={runner}"));
        details.insert("runner".into(), Value::String(runner.clone()));
    }
    (labels.join(", "), Value::Object(details))
}

impl IndexedQueryError {
    pub fn agent_error(&self) -> agent_json::AgentError {
        use agent_json::ErrorCode;

        let (code, message, details) = match self {
            Self::InvalidFilter(_) => (
                ErrorCode::InvalidArgument,
                "--filter must be all, passed, or failed".into(),
                None,
            ),
            Self::UnsupportedCommand(command) => (
                ErrorCode::UnknownCommand,
                format!("Unknown coverage resource: {command}"),
                Some(json!({ "command": command })),
            ),
            Self::MissingArgument(argument) => (
                ErrorCode::InvalidArgument,
                format!("Coverage query requires {argument}"),
                None,
            ),
            Self::MissingNewerRun => (
                ErrorCode::InvalidArgument,
                "Diff requires an older and newer run ID".into(),
                None,
            ),
            Self::MissingReport => (
                ErrorCode::InternalError,
                "Coverage minimization requires reconstructed per-test evidence".into(),
                None,
            ),
            Self::ResponseTooLarge(error) => (
                ErrorCode::ResponseTooLarge,
                format!(
                    "JSON response is {} bytes; the maximum is {} bytes",
                    error.actual_bytes, error.max_bytes
                ),
                Some(json!({
                    "actualBytes": error.actual_bytes,
                    "maxBytes": error.max_bytes,
                    "hint": "Use --offset/--limit or a narrower coverage query."
                })),
            ),
            Self::Query(error) => match error {
                QueryError::InvalidTarget(_) => (
                    ErrorCode::InvalidArgument,
                    "--target must be between 0 and 100".into(),
                    None,
                ),
                QueryError::UnattributedEvidence => (
                    ErrorCode::UnattributedEvidence,
                    "Cannot minimize exactly: this coverage view contains background/unattributed evidence. Use a runner with exact test attribution or select a fully attributed coverage view.".into(),
                    None,
                ),
                QueryError::TargetUnreachable {
                    metric,
                    target,
                    reachable,
                } => (
                    ErrorCode::TargetUnreachable,
                    format!(
                        "The full selected test view reaches only {reachable:.2}% {}; target {target}% is impossible",
                        metric_name(*metric)
                    ),
                    Some(json!({ "metric": metric, "target": target, "reachable": reachable })),
                ),
                QueryError::ComplexityLimit {
                    candidate_tests,
                    obligations,
                    explored_states,
                    max_states,
                    target,
                    metric,
                } => (
                    ErrorCode::MinimizationComplexityLimit,
                    format!(
                        "Exact minimization exceeded its {}-state safety budget. Narrow the test view with --kind or --runner, or request a different target.",
                        grouped_decimal(*max_states)
                    ),
                    Some(json!({
                        "candidateTests": candidate_tests,
                        "obligations": obligations,
                        "exploredStates": explored_states,
                        "maxStates": max_states,
                        "target": target,
                        "metric": metric,
                    })),
                ),
                QueryError::InvalidPagination => (
                    ErrorCode::InvalidArgument,
                    "--limit must be a positive integer".into(),
                    None,
                ),
                QueryError::TestFilterEmpty { kind, runner } => {
                    let (filter, details) = test_filter_details(kind, runner);
                    (
                        ErrorCode::TestFilterEmpty,
                        format!("No tests match {filter}"),
                        Some(details),
                    )
                }
                QueryError::TestNotFound(selector) => (
                    ErrorCode::TestNotFound,
                    format!("Test not found: {selector}"),
                    Some(json!({ "selector": selector })),
                ),
                QueryError::DecisionNotFound(selector) => (
                    ErrorCode::DecisionNotFound,
                    format!("Decision not found: {selector}"),
                    Some(json!({ "selector": selector })),
                ),
                QueryError::SourceNotFound(selector) => (
                    ErrorCode::SourceNotFound,
                    format!("Source file not found: {selector}"),
                    Some(json!({ "selector": selector })),
                ),
                QueryError::AmbiguousSelector { selector, matches } => (
                    ErrorCode::AmbiguousSelector,
                    format!("Ambiguous file selector: {}", matches.join(", ")),
                    Some(json!({ "selector": selector, "matches": matches })),
                ),
                QueryError::ScopeUnavailable => (
                    ErrorCode::ScopeUnavailable,
                    "This run does not contain a source-scope inventory.".into(),
                    None,
                ),
                QueryError::Analysis(error) => (
                    ErrorCode::InternalError,
                    format!("Coverage analysis failed: {error:?}"),
                    None,
                ),
                QueryError::Index(error) => (
                    ErrorCode::InternalError,
                    format!("Coverage index query failed: {error}"),
                    None,
                ),
                QueryError::InvalidRecordSelection => (
                    ErrorCode::InternalError,
                    "Coverage index contains inconsistent references".into(),
                    None,
                ),
            },
        };
        agent_json::AgentError {
            code,
            message,
            retryable: false,
            details,
        }
    }
}

pub struct NewerQuery<'a> {
    pub run_id: &'a str,
    pub index: &'a CoverageIndex<'a>,
}

#[derive(Debug, Clone, PartialEq, Serialize)]
#[serde(untagged)]
pub enum IndexedQueryData {
    Summary(Box<CoverageSummaryData>),
    Scope(Box<CoverageScopeData>),
    Line(Box<CoverageCoversData>),
    Test(Box<CoverageTestData>),
    Decision(Box<CoverageDecisionData>),
    FileDetail(Box<CoverageFileDetailData>),
    FileDecisions(Box<CoverageFileDecisionsData>),
    Kinds(Box<CoverageKindsData>),
    Runners(Box<CoverageRunnersData>),
    Files(Box<CoverageFilesData>),
    Gaps(Box<CoverageGapsData>),
    Minimize(Box<CoverageMinimizeData>),
    Diff(Box<CoverageDiffData>),
}

#[derive(Debug, Clone, PartialEq)]
pub struct IndexedQueryOutput {
    pub command: &'static str,
    pub data: IndexedQueryData,
    pub pagination: Option<supercov_contracts::AgentPagination>,
}

impl IndexedQueryOutput {
    pub fn agent_json(&self) -> Result<String, IndexedQueryError> {
        Ok(agent_json::success(
            self.command,
            &self.data,
            self.pagination.as_ref(),
        )?)
    }
}

/// Execute a frozen agent query against an already authenticated index.
///
/// Only minimization needs the reconstructed per-test report today. All other
/// commands are served directly from the mmap-backed index.
pub fn execute_indexed_query(
    index: &CoverageIndex<'_>,
    report: Option<&CoverageReport>,
    request: &IndexedQueryRequest,
    newer: Option<NewerQuery<'_>>,
) -> Result<String, IndexedQueryError> {
    query_indexed(index, report, request, newer)?.agent_json()
}

pub fn query_indexed(
    index: &CoverageIndex<'_>,
    report: Option<&CoverageReport>,
    request: &IndexedQueryRequest,
    newer: Option<NewerQuery<'_>>,
) -> Result<IndexedQueryOutput, IndexedQueryError> {
    let view = request.view()?;
    let gaps_only = match request.command.as_str() {
        "files" => Some(false),
        "gaps" => Some(true),
        "file-decisions" | "kinds" | "runners" | "summary" | "scope" | "line" | "test"
        | "decision" | "file-detail" | "minimize" | "diff" => None,
        _ => {
            return Err(IndexedQueryError::UnsupportedCommand(
                request.command.clone(),
            ));
        }
    };

    if request.command == "diff" {
        let newer = newer.ok_or(IndexedQueryError::MissingNewerRun)?;
        let (data, page) = coverage_diff_query(
            index,
            newer.index,
            CoverageDiffQueryOptions {
                older_run: &request.run_id,
                newer_run: newer.run_id,
                view,
                kind: request.kind.as_deref(),
                runner: request.runner.as_deref(),
                offset: request.offset,
                limit: request.limit,
            },
        )?;
        return Ok(IndexedQueryOutput {
            command: "diff",
            data: IndexedQueryData::Diff(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "minimize" {
        let report = report.ok_or(IndexedQueryError::MissingReport)?;
        let coverage_view = match view {
            CoverageViewId::All => &report.view,
            CoverageViewId::Passed => &report.filters.passed,
            CoverageViewId::Failed => &report.filters.failed,
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
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.minimize",
            data: IndexedQueryData::Minimize(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "summary" {
        let data = coverage_summary_query(
            index,
            CoverageSummaryQueryOptions {
                run: &request.run_id,
                view,
                kind: request.kind.as_deref(),
                runner: request.runner.as_deref(),
                valid: request.valid.unwrap_or(false),
                test_exit_code: request.test_exit_code,
                stale: request.stale.unwrap_or(false),
                stale_reasons: request.stale_reasons.clone().unwrap_or_default(),
            },
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.summary",
            data: IndexedQueryData::Summary(Box::new(data)),
            pagination: None,
        });
    }

    if request.command == "scope" {
        let (data, page) = coverage_scope_query(
            index,
            CoverageScopeQueryOptions {
                run: &request.run_id,
                view,
                kind: request.kind.as_deref(),
                runner: request.runner.as_deref(),
                offset: request.offset,
                limit: request.limit,
            },
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.scope",
            data: IndexedQueryData::Scope(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "line" {
        let file = request
            .file
            .as_deref()
            .ok_or(IndexedQueryError::MissingArgument("a file"))?;
        let line = request
            .line
            .ok_or(IndexedQueryError::MissingArgument("a line"))?;
        let (data, page) = coverage_covers_query(
            index,
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
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.line",
            data: IndexedQueryData::Line(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "test" {
        let selector = request
            .selector
            .as_deref()
            .ok_or(IndexedQueryError::MissingArgument("a test selector"))?;
        let (data, page) = coverage_test_query(
            index,
            CoverageTestQueryOptions {
                run: &request.run_id,
                view,
                kind: request.kind.as_deref(),
                runner: request.runner.as_deref(),
                selector,
                offset: request.offset,
                limit: request.limit,
            },
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.test",
            data: IndexedQueryData::Test(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "decision" {
        let selector = request
            .selector
            .as_deref()
            .ok_or(IndexedQueryError::MissingArgument("a decision selector"))?;
        let (data, page) = coverage_decision_query(
            index,
            CoverageDecisionQueryOptions {
                run: &request.run_id,
                view,
                kind: request.kind.as_deref(),
                runner: request.runner.as_deref(),
                selector,
                offset: request.offset,
                limit: request.limit,
            },
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.decision",
            data: IndexedQueryData::Decision(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "file-detail" {
        let selector = request
            .file
            .as_deref()
            .ok_or(IndexedQueryError::MissingArgument("a file"))?;
        let (data, page) = coverage_file_detail_query(
            index,
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
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.file",
            data: IndexedQueryData::FileDetail(Box::new(data)),
            pagination: Some(page),
        });
    }

    if request.command == "kinds" || request.command == "runners" {
        let dimension = if request.command == "kinds" {
            CoverageDimension::Kind
        } else {
            CoverageDimension::Runner
        };
        let filters = CoverageQueryFilters {
            outcome: request.filter.clone(),
            kind: request.kind.clone(),
            runner: request.runner.clone(),
        };
        let (data, page) = coverage_dimension_query(
            index,
            CoverageDimensionQueryOptions {
                run: &request.run_id,
                view,
                dimension,
                filters,
                offset: request.offset,
                limit: request.limit,
            },
        )?;
        let command = if request.command == "kinds" {
            "coverage.kinds"
        } else {
            "coverage.runners"
        };
        return Ok(match data {
            CoverageDimensionQueryData::Kinds(data) => IndexedQueryOutput {
                command,
                data: IndexedQueryData::Kinds(Box::new(data)),
                pagination: Some(page),
            },
            CoverageDimensionQueryData::Runners(data) => IndexedQueryOutput {
                command,
                data: IndexedQueryData::Runners(Box::new(data)),
                pagination: Some(page),
            },
        });
    }

    if request.command == "file-decisions" {
        let file = request
            .file
            .as_deref()
            .ok_or(IndexedQueryError::MissingArgument("a file"))?;
        let (data, page) = coverage_file_decisions_query(
            index,
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
        )?;
        return Ok(IndexedQueryOutput {
            command: "coverage.file",
            data: IndexedQueryData::FileDecisions(Box::new(data)),
            pagination: Some(page),
        });
    }

    let query = coverage_file_query(
        index,
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
    )?;
    let command = if gaps_only == Some(true) {
        "coverage.gaps"
    } else {
        "coverage.files"
    };
    Ok(match query.data {
        CoverageFileQueryData::Files(data) => IndexedQueryOutput {
            command,
            data: IndexedQueryData::Files(Box::new(data)),
            pagination: Some(query.pagination),
        },
        CoverageFileQueryData::Gaps(data) => IndexedQueryOutput {
            command,
            data: IndexedQueryData::Gaps(Box::new(data)),
            pagination: Some(query.pagination),
        },
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn maps_typed_selection_failures_to_the_frozen_agent_contract() {
        let source =
            IndexedQueryError::Query(QueryError::SourceNotFound("missing.ts".into())).agent_error();
        assert_eq!(source.code, agent_json::ErrorCode::SourceNotFound);
        assert_eq!(source.message, "Source file not found: missing.ts");
        assert_eq!(source.details, Some(json!({ "selector": "missing.ts" })));

        let filtered = IndexedQueryError::Query(QueryError::TestFilterEmpty {
            kind: Some("e2e".into()),
            runner: Some("playwright".into()),
        })
        .agent_error();
        assert_eq!(filtered.code, agent_json::ErrorCode::TestFilterEmpty);
        assert_eq!(
            filtered.message,
            "No tests match kind=e2e, runner=playwright"
        );
        assert_eq!(
            filtered.details,
            Some(json!({ "kind": "e2e", "runner": "playwright" }))
        );
    }

    #[test]
    fn maps_solver_limits_without_losing_machine_readable_details() {
        let error = IndexedQueryError::Query(QueryError::ComplexityLimit {
            candidate_tests: 200,
            obligations: 900,
            explored_states: 5_001,
            max_states: 5_000,
            target: 100.0,
            metric: MinimizeMetric::All,
        })
        .agent_error();
        assert_eq!(
            error.code,
            agent_json::ErrorCode::MinimizationComplexityLimit
        );
        assert!(error.message.contains("5,000-state safety budget"));
        assert_eq!(error.details.as_ref().unwrap()["exploredStates"], 5_001);
    }
}
