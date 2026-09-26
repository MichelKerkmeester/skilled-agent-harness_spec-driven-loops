use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, OpenOptions},
    io::{Write, stdout},
    path::{Component, Path, PathBuf},
    process::{Command, ExitCode, Stdio},
};

use base64::{Engine as _, engine::general_purpose::STANDARD};
use flate2::{Compression, write::GzEncoder};
use serde::Serialize;
use sha2::{Digest, Sha256};
use supercov_engine::{
    coverage_index::{CoverageIndex, CoverageViewId, IndexedFileGap},
    coverage_query::{
        CoverageFileDetailOptions, CoverageScopeQueryOptions, CoverageSummaryQueryOptions,
        coverage_file_detail_query, coverage_scope_query, coverage_summary_query,
    },
    run_store::{StoredRun, compare_run_integrity, open_or_rebuild_query_index, select_run},
};

use crate::{current_integrity_for_run, full_suite_hints, public_run_inventory};

const REPORT_SCHEMA_VERSION: u32 = 2;
const DEFAULT_SNAPSHOTS: usize = 20;
const DEFAULT_RUNS: usize = 10;
const MAX_RUNS: usize = 20;
const MAX_REPORT_BYTES: usize = 24 * 1024 * 1024;
const MAX_SOURCE_BYTES: usize = 1024 * 1024;
const MAX_TOTAL_SOURCE_BYTES: usize = 16 * 1024 * 1024;
const PAYLOAD_MARKER: &str = "SUPERCOV_REPORT_PAYLOAD";
const REPORT_TEMPLATE: &str = include_str!("../assets/report.html");
/// Where a report lands when no `--output` is given, relative to the project
/// root. Inside the store, so the store's own `.gitignore` covers it.
const REPORT_DIRECTORY: &str = ".supercov/reports";
const DEFAULT_REPORT_NAME: &str = "supercov-report.html";

#[derive(Debug, Clone, PartialEq, Eq)]
struct ReportOptions {
    selector: String,
    comparison: Option<String>,
    /// An explicit destination. `None` means the store's reports directory.
    output: Option<PathBuf>,
    open: bool,
    runs: usize,
}

fn help() -> &'static str {
    "Usage: supercov report [run-id] [options]\n\nGenerates one private, self-contained interactive HTML file from stored runs.\nNo server or network connection is required.\n\nOptions:\n  --compare <run-id>   choose the initial comparison run\n  --runs <n>           include up to n runs (default: 10, maximum: 20)\n  --output <path>      write to this path, relative to the working directory
                       (default: .supercov/reports/supercov-report.html in the project)\n  --no-open            do not open the report in the default browser\n  -h, --help           show this help\n"
}

fn parse_options(arguments: &[String]) -> Result<ReportOptions, String> {
    let mut selector = None;
    let mut comparison = None;
    let mut output: Option<PathBuf> = None;
    let mut open = true;
    let mut runs = DEFAULT_RUNS;
    let mut index = 0;
    while index < arguments.len() {
        match arguments[index].as_str() {
            "--compare" => {
                index += 1;
                comparison = Some(
                    arguments
                        .get(index)
                        .ok_or_else(|| "--compare requires a run ID".to_owned())?
                        .clone(),
                );
            }
            "--output" | "-o" => {
                index += 1;
                output = Some(PathBuf::from(
                    arguments
                        .get(index)
                        .ok_or_else(|| "--output requires a path".to_owned())?,
                ));
            }
            "--runs" => {
                index += 1;
                runs = arguments
                    .get(index)
                    .and_then(|value| value.parse::<usize>().ok())
                    .filter(|value| (1..=MAX_RUNS).contains(value))
                    .ok_or_else(|| format!("--runs must be between 1 and {MAX_RUNS}"))?;
            }
            "--no-open" => open = false,
            "--help" | "-h" => return Err(help().into()),
            value if value.starts_with('-') => {
                return Err(format!("Unknown report option: {value}"));
            }
            value if selector.is_none() => selector = Some(value.to_owned()),
            value => return Err(format!("Unexpected report argument: {value}")),
        }
        index += 1;
    }
    if output
        .as_ref()
        .is_some_and(|path| path.as_os_str().is_empty())
    {
        return Err("--output requires a non-empty path".into());
    }
    Ok(ReportOptions {
        selector: selector.unwrap_or_else(|| "latest".into()),
        comparison,
        output,
        open,
        runs,
    })
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReportBundle {
    schema_version: u32,
    project: String,
    /// The timeline item the report opens on, which may be an assessment that
    /// no run pairs with.
    selected_id: String,
    selected_run_id: Option<String>,
    comparison_run_id: Option<String>,
    runs: Vec<ReportRun>,
    /// Saved assessments, newest first. Kept beside the runs rather than inside
    /// them: an assessment belongs to source, not to a test command, and one
    /// may pair with no run at all.
    qualities: Vec<ReportQuality>,
    securities: Vec<ReportQuality>,
    /// Runs and assessments on one axis, newest first.
    timeline: Vec<TimelineItem>,
}

/// One moment in the project's history, holding whichever of the two judgments
/// was made about that source.
///
/// A run and an assessment share an item only when both recorded the same
/// source fingerprint. Anything else stays on its own item: two judgments about
/// different source are two moments, and merging them on a guess about
/// timestamps would be the one thing this report must not do.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct TimelineItem {
    id: String,
    at: String,
    /// "paired", "run" or "quality".
    kind: &'static str,
    run_id: Option<String>,
    quality_id: Option<String>,
    security_id: Option<String>,
}

/// A saved quality assessment, as a report reads it.
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReportQuality {
    id: String,
    created_at: String,
    /// Which instrument answered. Two snapshots are only comparable when these
    /// three agree; the report must break a series rather than join across a
    /// change of any of them.
    instrument: String,
    catalog_version: String,
    model: String,
    /// The identity of what this assessment read. Not comparable with a run's
    /// source fingerprint, which keys a build cache and covers a wider set.
    assessed_files_fingerprint: Option<String>,
    health: Option<f64>,
    counts: serde_json::Value,
    /// Carries "no cutoffs" and "no failure on a finding", which is why this is
    /// never drawn as progress toward a target.
    policy: serde_json::Value,
    catalog: serde_json::Value,
    scope: serde_json::Value,
    limitation: serde_json::Value,
    files: serde_json::Value,
    paths: serde_json::Value,
    /// Carried only when no run in this report already carries the same source,
    /// so an assessment can be read beside its code with no run at all.
    sources: BTreeMap<String, ReportSource>,
    omitted_sources: Vec<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReportRun {
    id: String,
    git: Option<supercov_engine::run_store::GitIntegrity>,
    started_at: String,
    duration_ms: f64,
    command: Vec<String>,
    test_exit_code: Option<i32>,
    stale: bool,
    stale_reasons: Vec<String>,
    /// The run's own source fingerprint, recorded as evidence of what state the
    /// project was in. It keys the instrumented build cache, so it covers every
    /// file the frontend may rewrite rather than only what was measured, and it
    /// is not comparable with an assessment's.
    source_fingerprint: Option<String>,
    source_mode: &'static str,
    omitted_sources: Vec<String>,
    summary: serde_json::Value,
    files: Vec<IndexedFileGap>,
    file_details: BTreeMap<String, serde_json::Value>,
    file_totals: BTreeMap<String, BTreeMap<String, usize>>,
    decisions: serde_json::Value,
    assertions: Option<serde_json::Value>,
    tests: Vec<ReportTest>,
    lines: Vec<ReportLine>,
    scope: Option<serde_json::Value>,
    sources: BTreeMap<String, ReportSource>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReportSource {
    sha256: String,
    contents: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReportLine {
    file: String,
    line: usize,
    covered: bool,
    confidence: String,
    tests: Vec<String>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ReportTest {
    id: String,
    name: String,
    file: Option<String>,
    title: Option<String>,
    outcome: String,
    role: String,
    runner: String,
    kind: String,
    project: Option<String>,
    retries: Vec<usize>,
    attempts: serde_json::Value,
    lines: serde_json::Value,
    total_lines: usize,
    total_hits: usize,
    total_decisions: usize,
}

fn selected_runs<'a>(
    inventory: &'a supercov_engine::run_store::RunInventory,
    options: &ReportOptions,
) -> Result<Vec<&'a StoredRun>, String> {
    let selected =
        select_run(inventory, Some(&options.selector)).map_err(|error| error.to_string())?;
    let mut runs = vec![selected];
    let mut ids = BTreeSet::from([selected.id.as_str()]);
    if let Some(selector) = options.comparison.as_deref() {
        let comparison =
            select_run(inventory, Some(selector)).map_err(|error| error.to_string())?;
        if ids.insert(comparison.id.as_str()) {
            runs.push(comparison);
        }
    }
    let selected_position = inventory
        .runs
        .iter()
        .position(|run| run.id == selected.id)
        .expect("selected run belongs to inventory");
    for run in inventory.runs.iter().skip(selected_position + 1) {
        if runs.len()
            >= options
                .runs
                .max(usize::from(options.comparison.is_some()) + 1)
        {
            break;
        }
        if ids.insert(run.id.as_str()) {
            runs.push(run);
        }
    }
    Ok(runs)
}

fn safe_relative_source(root: &Path, relative: &str) -> Option<PathBuf> {
    let relative = Path::new(relative);
    if relative.is_absolute()
        || relative.components().any(|component| {
            matches!(
                component,
                Component::ParentDir | Component::RootDir | Component::Prefix(_)
            )
        })
    {
        return None;
    }
    let root = fs::canonicalize(root).ok()?;
    let source = fs::canonicalize(root.join(relative)).ok()?;
    source.starts_with(&root).then_some(source)
}

fn collect_sources(
    root: &Path,
    files: &[IndexedFileGap],
    exact: bool,
) -> (BTreeMap<String, ReportSource>, Vec<String>) {
    if !exact {
        return (BTreeMap::new(), Vec::new());
    }
    let mut sources = BTreeMap::new();
    let mut omitted = Vec::new();
    let mut total = 0_usize;
    for file in files {
        let Some(path) = safe_relative_source(root, &file.file) else {
            omitted.push(file.file.clone());
            continue;
        };
        let Ok(metadata) = fs::metadata(&path) else {
            omitted.push(file.file.clone());
            continue;
        };
        let Ok(length) = usize::try_from(metadata.len()) else {
            omitted.push(file.file.clone());
            continue;
        };
        if !metadata.is_file()
            || length > MAX_SOURCE_BYTES
            || total.saturating_add(length) > MAX_TOTAL_SOURCE_BYTES
        {
            omitted.push(file.file.clone());
            continue;
        }
        let Ok(contents) = fs::read_to_string(&path) else {
            omitted.push(file.file.clone());
            continue;
        };
        total += contents.len();
        sources.insert(
            file.file.clone(),
            ReportSource {
                sha256: format!("{:x}", Sha256::digest(contents.as_bytes())),
                contents,
            },
        );
    }
    (sources, omitted)
}

fn project_name(root: &Path) -> String {
    fs::read(root.join("package.json"))
        .ok()
        .and_then(|bytes| serde_json::from_slice::<serde_json::Value>(&bytes).ok())
        .and_then(|package| package.get("name")?.as_str().map(str::to_owned))
        .filter(|name| !name.trim().is_empty() && name.len() <= 200)
        .or_else(|| {
            root.file_name()
                .and_then(|name| name.to_str())
                .map(str::to_owned)
        })
        .unwrap_or_else(|| "project".into())
}

fn build_run(root: &Path, run: &StoredRun) -> Result<ReportRun, String> {
    let current_integrity = current_integrity_for_run(root, run);
    let source_exact = current_integrity.as_ref().is_some_and(|current| {
        current.fingerprint.source == run.metadata.integrity.fingerprint.source
    });
    let comparison = current_integrity
        .as_ref()
        .map(|current| compare_run_integrity(Some(&run.metadata.integrity), current));
    let stale = comparison.as_ref().is_some_and(|value| value.stale)
        || run.metadata.integrity.stale.unwrap_or(false);
    let stale_reasons = comparison
        .as_ref()
        .map(|value| value.reasons.clone())
        .or_else(|| run.metadata.integrity.stale_reasons.clone())
        .unwrap_or_default();
    let container = open_or_rebuild_query_index(run)
        .map_err(|error| format!("could not open run {}: {error}", run.id))?;
    let index = CoverageIndex::new(&container)
        .map_err(|error| format!("could not read run {}: {error}", run.id))?;
    let mut summary = coverage_summary_query(
        &index,
        CoverageSummaryQueryOptions {
            run: &run.id,
            view: CoverageViewId::All,
            kind: None,
            runner: None,
            valid: run.metadata.test_exit_code == Some(0),
            test_exit_code: run.metadata.test_exit_code,
            stale,
            stale_reasons: stale_reasons.clone(),
        },
    )
    .map_err(|error| format!("could not summarize run {}: {error:?}", run.id))?;
    summary.command.clone_from(&run.metadata.command);
    let observed_kinds = summary
        .coverage_by_kind
        .iter()
        .filter_map(|entry| entry.kind.clone())
        .collect::<Vec<_>>();
    summary.hints = full_suite_hints(root, &run.metadata.command, &observed_kinds);

    let files = index
        .file_gaps(CoverageViewId::All, None, None)
        .map_err(|error| format!("could not read files for run {}: {error}", run.id))?;
    let mut file_details = BTreeMap::new();
    for file in files
        .iter()
        .filter(|file| file.score > 0 || file.measurement_limitations > 0)
    {
        let (detail, _) = coverage_file_detail_query(
            &index,
            CoverageFileDetailOptions {
                run: &run.id,
                view: CoverageViewId::All,
                kind: None,
                runner: None,
                selector: &file.file,
                metric: supercov_engine::coverage_query::MinimizeMetric::All,
                offset: 0,
                limit: usize::MAX,
            },
        )
        .map_err(|error| format!("could not read {} in run {}: {error:?}", file.file, run.id))?;
        file_details.insert(
            file.file.clone(),
            serde_json::to_value(detail).map_err(|error| error.to_string())?,
        );
    }

    let mut file_totals: BTreeMap<String, BTreeMap<String, usize>> = BTreeMap::new();
    for hit in index
        .hit_metadata(CoverageViewId::All)
        .map_err(|error| format!("could not read file totals for run {}: {error}", run.id))?
    {
        let kind = match hit.obligation.as_str() {
            "statement" => "statements",
            "function" => "functions",
            "branch" => "branches",
            _ => continue,
        };
        *file_totals
            .entry(hit.file)
            .or_default()
            .entry(kind.into())
            .or_default() += 1;
    }

    let decisions = index
        .decision_details(CoverageViewId::All)
        .map_err(|error| format!("could not read decisions for run {}: {error}", run.id))?;
    for decision in &decisions {
        *file_totals
            .entry(decision.meta.file.clone())
            .or_default()
            .entry("branches".into())
            .or_default() += 2;
    }
    let tests = index
        .test_details(CoverageViewId::All)
        .map_err(|error| format!("could not read tests for run {}: {error}", run.id))?
        .into_iter()
        .map(|test| {
            let total_lines = test.lines.len();
            let total_hits = test.hits.len();
            let total_decisions = test.decisions.len();
            Ok(ReportTest {
                id: test.summary.id,
                name: test.summary.name,
                file: test.summary.file,
                title: test.summary.title,
                outcome: test.summary.outcome,
                role: test.summary.role,
                runner: test.summary.provenance.runner,
                kind: test.summary.provenance.kind,
                project: test.summary.provenance.project,
                retries: test.retries,
                attempts: serde_json::to_value(test.attempts).map_err(|error| error.to_string())?,
                lines: serde_json::to_value(test.lines).map_err(|error| error.to_string())?,
                total_lines,
                total_hits,
                total_decisions,
            })
        })
        .collect::<Result<Vec<_>, String>>()?;
    let lines = index
        .lines(CoverageViewId::All)
        .map_err(|error| format!("could not read lines for run {}: {error}", run.id))?
        .into_iter()
        .map(|line| ReportLine {
            file: line.file,
            line: line.line,
            covered: line.covered,
            confidence: line.confidence.level,
            tests: line.tests,
        })
        .collect();
    let scope = match coverage_scope_query(
        &index,
        CoverageScopeQueryOptions {
            run: &run.id,
            view: CoverageViewId::All,
            kind: None,
            runner: None,
            offset: 0,
            limit: usize::MAX,
        },
    ) {
        Ok((scope, _)) => Some(serde_json::to_value(scope).map_err(|error| error.to_string())?),
        Err(supercov_engine::coverage_query::QueryError::ScopeUnavailable) => None,
        Err(error) => {
            return Err(format!(
                "could not read scope for run {}: {error:?}",
                run.id
            ));
        }
    };
    let (sources, omitted_sources) = collect_sources(root, &files, source_exact);

    Ok(ReportRun {
        id: run.id.clone(),
        git: run.metadata.integrity.git.clone(),
        started_at: run.metadata.started_at.clone(),
        duration_ms: run.metadata.duration_ms,
        command: run.metadata.command.clone(),
        test_exit_code: run.metadata.test_exit_code,
        stale,
        stale_reasons,
        source_fingerprint: Some(run.metadata.integrity.fingerprint.source.clone()),
        source_mode: if source_exact { "exact" } else { "snippets" },
        omitted_sources,
        summary: serde_json::to_value(summary).map_err(|error| error.to_string())?,
        files,
        file_details,
        file_totals,
        decisions: serde_json::to_value(decisions).map_err(|error| error.to_string())?,
        assertions: build_assertions(root, run),
        tests,
        lines,
        scope,
        sources,
    })
}

/// What the assertion map claims this run proved, when there is a map to read.
///
/// The query path decides this the same way, and this is deliberately a copy of
/// that decision rather than a looser one: without a map there is nothing to
/// report, and against a changed checkout the map's claims are about source
/// that is no longer there, so the reason is reported instead of the numbers.
///
/// The absolute path to the map is dropped. The query path prints it to a
/// terminal on the machine that holds it; a report is meant to be attached to a
/// pull request, and the path names somebody's home directory.
fn build_assertions(root: &Path, run: &StoredRun) -> Option<serde_json::Value> {
    if !run
        .directory
        .join(supercov_engine::assertion_store::MAP_FILE)
        .exists()
    {
        return None;
    }
    let current = current_integrity_for_run(root, run);
    let usable = current.as_ref().is_some_and(|current| {
        !compare_run_integrity(Some(&run.metadata.integrity), current).stale
    });
    let report = if usable {
        supercov_engine::assertion_store::report(root, run)
    } else {
        Err("Current checkout differs from the run or cannot be verified; rerun tests to inherit the assertion map".into())
    };
    Some(match report {
        Ok(report) => serde_json::json!({
            "available": true,
            "summary": report["summary"],
            "basis": report["basis"],
            "revision": report["revision"],
            "inheritance": report["inheritance"],
            "validationErrors": report["validationErrors"],
            "scope": "whole run with matching current source; independent of structural query filters",
            "files": assertion_files(&report),
            "statements": assertion_statements(&report),
            "spans": statement_spans(&report),
            "sites": assertion_sites(&report, run),
        }),
        Err(error) => serde_json::json!({"available": false, "error": error}),
    })
}

/// Measured, declared and credited statements per source file.
///
/// The run-level percentage says how much of the run an assertion map explains;
/// this says where. It is folded from the same statement rows the query path
/// pages, so a file's numbers add up to the run's.
fn assertion_files(report: &serde_json::Value) -> serde_json::Value {
    let mut files = BTreeMap::<String, (usize, usize, usize)>::new();
    for statement in report["statements"].as_array().unwrap_or(&Vec::new()) {
        let Some(file) = statement["file"].as_str() else {
            continue;
        };
        let entry = files.entry(file.to_string()).or_default();
        entry.0 += 1;
        if statement["declared"] == true {
            entry.1 += 1;
        }
        if statement["asserted"] == true {
            entry.2 += 1;
        }
    }
    files
        .into_iter()
        .map(|(file, (total, declared, asserted))| {
            (
                file,
                serde_json::json!({"total": total, "declared": declared, "asserted": asserted}),
            )
        })
        .collect::<serde_json::Map<_, _>>()
        .into()
}

/// The statements an assertion map claims, with whether each earned credit.
///
/// Credit is per statement, not per line: a line holding a guard and its
/// consequence can have one claimed and the other not, and the engine's
/// line-level figure deliberately refuses such a line. The source view draws
/// statements, so it gets them. Unclaimed statements are left out; the file
/// totals above already count them.
fn assertion_statements(report: &serde_json::Value) -> serde_json::Value {
    report["statements"]
        .as_array()
        .unwrap_or(&Vec::new())
        .iter()
        .filter(|statement| statement["declared"] == true || statement["asserted"] == true)
        .map(|statement| {
            serde_json::json!({
                "file": statement["file"],
                "line": statement["line"],
                "column": statement["at"]["column"],
                "text": statement["at"]["text"],
                "asserted": statement["asserted"],
                "flows": statement["flows"],
            })
        })
        .collect::<Vec<_>>()
        .into()
}

/// Statements that continue past their first line, with their coverage.
///
/// Line coverage is recorded on the line a statement starts. A call whose
/// arguments run on for three more lines, or a block and its closing brace,
/// executed with that first line, and the source view should say so instead of
/// marking those lines as if they were comments. Only the multi-line ones are
/// carried; a single-line statement adds nothing the line record lacks.
fn statement_spans(report: &serde_json::Value) -> serde_json::Value {
    report["statements"]
        .as_array()
        .unwrap_or(&Vec::new())
        .iter()
        .filter_map(|statement| {
            let text = statement["at"]["text"].as_str()?;
            let extra = text.matches('\n').count();
            if extra == 0 {
                return None;
            }
            let line = statement["line"].as_u64()?;
            Some(serde_json::json!({
                "file": statement["file"],
                "line": line,
                "end": line + extra as u64,
                "covered": statement["covered"],
            }))
        })
        .collect::<Vec<_>>()
        .into()
}

/// Where each assertion sits, what it claims to observe, and each flow's own
/// explanation and selected tests, so a credited line can show the reasoning
/// behind it without carrying the whole map.
///
/// The explanation is authored text and lives only in the map file; the
/// engine's rows carry the flow's evaluation, so the two are joined here.
fn assertion_sites(report: &serde_json::Value, run: &StoredRun) -> serde_json::Value {
    let map = std::fs::read(
        run.directory
            .join(supercov_engine::assertion_store::MAP_FILE),
    )
    .ok()
    .and_then(|bytes| serde_json::from_slice::<serde_json::Value>(&bytes).ok())
    .unwrap_or(serde_json::Value::Null);
    let explanations = map["assertions"]
        .as_array()
        .unwrap_or(&Vec::new())
        .iter()
        .flat_map(|assertion| {
            let id = assertion["id"].as_str().unwrap_or_default().to_string();
            assertion["flows"]
                .as_array()
                .cloned()
                .unwrap_or_default()
                .into_iter()
                .map(move |flow| {
                    (
                        format!("{id}/{}", flow["id"].as_str().unwrap_or_default()),
                        flow["explanation"].clone(),
                    )
                })
        })
        .collect::<BTreeMap<_, _>>();
    report["assertions"]
        .as_array()
        .unwrap_or(&Vec::new())
        .iter()
        .map(|assertion| {
            let id = assertion["id"].as_str().unwrap_or_default();
            let flows = assertion["flows"]
                .as_array()
                .unwrap_or(&Vec::new())
                .iter()
                .map(|flow| {
                    let flow_id = flow["id"].as_str().unwrap_or_default();
                    serde_json::json!({
                        "id": flow_id,
                        "eligible": flow["eligible"],
                        "explanation": explanations.get(&format!("{id}/{flow_id}")).cloned().unwrap_or(serde_json::Value::Null),
                        "tests": flow["selectors"].as_array().unwrap_or(&Vec::new()).iter().map(|selector| serde_json::json!({
                            "file": selector["file"],
                            "name": selector["name"],
                            "status": selector["status"],
                        })).collect::<Vec<_>>(),
                    })
                })
                .collect::<Vec<_>>();
            serde_json::json!({
                "id": id,
                "file": assertion["at"]["file"],
                "line": assertion["at"]["line"],
                "text": assertion["at"]["text"],
                "observes": assertion["observes"],
                "flows": flows,
            })
        })
        .collect::<Vec<_>>()
        .into()
}

/// Source for assessed files, included only when it is still what was assessed.
///
/// The snapshot recorded a digest per file, so this can prove the match file by
/// file instead of trusting one fingerprint for the set: a file that changed
/// since the assessment is left out and named, and the rest are still readable.
fn collect_quality_sources(
    root: &Path,
    files: &serde_json::Value,
) -> (BTreeMap<String, ReportSource>, Vec<String>) {
    let mut sources = BTreeMap::new();
    let mut omitted = Vec::new();
    let mut total = 0_usize;
    for file in files.as_array().unwrap_or(&Vec::new()) {
        let (Some(relative), Some(recorded)) = (
            file.get("path").and_then(|value| value.as_str()),
            file.get("sha256").and_then(|value| value.as_str()),
        ) else {
            continue;
        };
        let omit = |omitted: &mut Vec<String>| omitted.push(relative.to_owned());
        let Some(path) = safe_relative_source(root, relative) else {
            omit(&mut omitted);
            continue;
        };
        let Ok(metadata) = fs::metadata(&path) else {
            omit(&mut omitted);
            continue;
        };
        let Ok(length) = usize::try_from(metadata.len()) else {
            omit(&mut omitted);
            continue;
        };
        if !metadata.is_file()
            || length > MAX_SOURCE_BYTES
            || total.saturating_add(length) > MAX_TOTAL_SOURCE_BYTES
        {
            omit(&mut omitted);
            continue;
        }
        let Ok(contents) = fs::read_to_string(&path) else {
            omit(&mut omitted);
            continue;
        };
        let sha256 = format!("{:x}", Sha256::digest(contents.as_bytes()));
        if sha256 != recorded {
            omit(&mut omitted);
            continue;
        }
        total += contents.len();
        sources.insert(relative.to_owned(), ReportSource { sha256, contents });
    }
    (sources, omitted)
}

/// Read saved assessments into the shape a report carries.
fn build_assessments(root: &Path, lane: &str, limit: usize) -> Vec<ReportQuality> {
    crate::quality::report_snapshots(root, lane, limit)
        .into_iter()
        .map(|(id, manifest, files)| {
            let text = |key: &str| {
                manifest
                    .get(key)
                    .and_then(|value| value.as_str())
                    .unwrap_or_default()
                    .to_owned()
            };
            ReportQuality {
                created_at: text("created_at"),
                instrument: text("instrument"),
                catalog_version: text("catalog_version"),
                model: text("model"),
                assessed_files_fingerprint: manifest
                    .get("assessed_files_fingerprint")
                    .and_then(|value| value.as_str())
                    .map(str::to_owned),
                health: manifest.get("health").and_then(serde_json::Value::as_f64),
                counts: manifest
                    .get("counts")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                policy: manifest
                    .get("policy")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                catalog: manifest
                    .get("catalog")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                scope: manifest
                    .get("scope")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                limitation: manifest
                    .get("limitation")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                paths: files
                    .get("paths")
                    .cloned()
                    .unwrap_or_else(|| serde_json::json!([])),
                sources: BTreeMap::new(),
                omitted_sources: Vec::new(),
                files: files
                    .get("files")
                    .cloned()
                    .unwrap_or(serde_json::Value::Null),
                id,
            }
        })
        .collect()
}

/// Give an assessment its own copy of the source when no run here has it.
///
/// A paired assessment needs none: the run beside it already carries the same
/// files, and a report attached to a pull request should not pay for them twice.
fn attach_quality_sources(root: &Path, qualities: &mut [ReportQuality], timeline: &[TimelineItem]) {
    let paired: BTreeSet<&str> = timeline
        .iter()
        .filter(|item| item.kind == "paired")
        .filter_map(|item| item.quality_id.as_deref())
        .collect();
    for quality in qualities.iter_mut() {
        if paired.contains(quality.id.as_str()) {
            continue;
        }
        let (sources, omitted) = collect_quality_sources(root, &quality.files);
        quality.sources = sources;
        quality.omitted_sources = omitted;
    }
}

/// Put runs and assessments on one axis.
///
/// The only thing that pairs them is an identical source fingerprint. A run
/// from before fingerprints were recorded has none, so it pairs with nothing
/// and says so, which is the honest answer rather than a guess from two
/// timestamps.
/// Whether a run and an assessment read identical bytes for their shared files.
///
/// A run's own source fingerprint cannot answer this. It digests the union of
/// the discovered source files and the ungenerated scope entries, so it covers
/// more than an assessment ever looks at, and on a real project the two never
/// agree. What does answer it is the digest each side records per file.
///
/// Sharing no file at all is not agreement, so it does not pair: two judgments
/// about disjoint code are two moments.
fn reads_the_same_source(run: &ReportRun, quality: &ReportQuality) -> bool {
    let empty = Vec::new();
    let mut shared = 0_usize;
    for file in quality.files.as_array().unwrap_or(&empty) {
        let (Some(path), Some(assessed)) = (
            file.get("path").and_then(|value| value.as_str()),
            file.get("sha256").and_then(|value| value.as_str()),
        ) else {
            continue;
        };
        let Some(measured) = run.sources.get(path) else {
            continue;
        };
        if measured.sha256 != assessed {
            return false;
        }
        shared += 1;
    }
    shared > 0
}

fn build_timeline(runs: &[ReportRun], qualities: &[ReportQuality]) -> Vec<TimelineItem> {
    let mut paired_quality: BTreeSet<&str> = BTreeSet::new();
    let mut items: Vec<TimelineItem> = runs
        .iter()
        .map(|run| {
            let partner = qualities
                .iter()
                .find(|quality| reads_the_same_source(run, quality));
            if let Some(quality) = partner {
                paired_quality.insert(quality.id.as_str());
            }
            TimelineItem {
                id: run.id.clone(),
                at: run.started_at.clone(),
                kind: if partner.is_some() { "paired" } else { "run" },
                run_id: Some(run.id.clone()),
                quality_id: partner.map(|quality| quality.id.clone()),
                security_id: None,
            }
        })
        .collect();
    items.extend(
        qualities
            .iter()
            .filter(|quality| !paired_quality.contains(quality.id.as_str()))
            .map(|quality| TimelineItem {
                id: quality.id.clone(),
                at: quality.created_at.clone(),
                kind: "quality",
                run_id: None,
                quality_id: Some(quality.id.clone()),
                security_id: None,
            }),
    );
    items.sort_by(|left, right| right.at.cmp(&left.at).then_with(|| right.id.cmp(&left.id)));
    items
}

/// Exact assessed scope and source bytes. Missing digests cannot prove equality.
fn assessment_source(assessment: &ReportQuality) -> Option<BTreeMap<String, String>> {
    let files = assessment.files.as_array()?;
    if files.is_empty() {
        return None;
    }
    files
        .iter()
        .map(|file| {
            Some((
                file.get("path")?.as_str()?.to_owned(),
                file.get("sha256")?.as_str()?.to_owned(),
            ))
        })
        .collect()
}

/// The newest security assessment represents each identical source snapshot.
/// Older audits remain in the bundle and on disk, without extra timeline rows.
fn attach_security(
    root: &Path,
    runs: &[ReportRun],
    securities: &mut [ReportQuality],
    timeline: &mut Vec<TimelineItem>,
) {
    let mut seen_sources = BTreeSet::new();
    for security in securities {
        let superseded =
            assessment_source(security).is_some_and(|source| !seen_sources.insert(source));
        let mut paired = false;
        for item in timeline.iter_mut() {
            if item.security_id.is_none()
                && let Some(run) = runs
                    .iter()
                    .find(|run| Some(&run.id) == item.run_id.as_ref())
                && reads_the_same_source(run, security)
            {
                item.security_id = Some(security.id.clone());
                paired = true;
            }
        }
        // Retain source for assessed files a paired coverage run did not measure, too.
        let (sources, omitted) = collect_quality_sources(root, &security.files);
        security.sources = sources;
        security.omitted_sources = omitted;
        if !paired && !superseded {
            timeline.push(TimelineItem {
                id: security.id.clone(),
                at: security.created_at.clone(),
                kind: "security",
                run_id: None,
                quality_id: None,
                security_id: Some(security.id.clone()),
            });
        }
    }
    timeline.sort_by(|left, right| right.at.cmp(&left.at).then_with(|| right.id.cmp(&left.id)));
}

fn render_html(bundle: &ReportBundle) -> Result<Vec<u8>, String> {
    let payload = serde_json::to_vec(bundle).map_err(|error| error.to_string())?;
    let mut gzip = GzEncoder::new(Vec::new(), Compression::best());
    gzip.write_all(&payload)
        .map_err(|error| error.to_string())?;
    let compressed = gzip.finish().map_err(|error| error.to_string())?;
    let encoded = STANDARD.encode(compressed);
    if REPORT_TEMPLATE.matches(PAYLOAD_MARKER).count() != 1 {
        return Err("embedded report template has an invalid payload marker".into());
    }
    Ok(REPORT_TEMPLATE
        .replacen(PAYLOAD_MARKER, &encoded, 1)
        .into_bytes())
}

fn write_atomic(path: &Path, bytes: &[u8]) -> Result<(), String> {
    let parent = path
        .parent()
        .filter(|path| !path.as_os_str().is_empty())
        .unwrap_or(Path::new("."));
    fs::create_dir_all(parent).map_err(|error| format!("{}: {error}", parent.display()))?;
    let file_name = path
        .file_name()
        .ok_or_else(|| format!("{} is not a file path", path.display()))?
        .to_string_lossy();
    let mut temporary = None;
    for attempt in 0..100_u32 {
        let candidate = parent.join(format!(
            ".{file_name}.{}.{}.tmp",
            std::process::id(),
            attempt
        ));
        match OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(&candidate)
        {
            Ok(file) => {
                temporary = Some((candidate, file));
                break;
            }
            Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => continue,
            Err(error) => return Err(format!("{}: {error}", candidate.display())),
        }
    }
    let (temporary_path, mut file) = temporary.ok_or_else(|| {
        format!(
            "could not allocate a temporary file beside {}",
            path.display()
        )
    })?;
    let result = (|| -> Result<(), String> {
        file.write_all(bytes)
            .map_err(|error| format!("{}: {error}", temporary_path.display()))?;
        file.sync_all()
            .map_err(|error| format!("{}: {error}", temporary_path.display()))?;
        drop(file);
        fs::rename(&temporary_path, path)
            .map_err(|error| format!("{}: {error}", path.display()))?;
        Ok(())
    })();
    if result.is_err() {
        let _ = fs::remove_file(&temporary_path);
    }
    result
}

fn open_report(path: &Path) -> Result<(), String> {
    let mut command = if cfg!(target_os = "macos") {
        let mut command = Command::new("open");
        command.arg(path);
        command
    } else if cfg!(target_os = "windows") {
        let mut command = Command::new("cmd");
        command.args(["/C", "start", ""]);
        command.arg(path);
        command
    } else {
        let mut command = Command::new("xdg-open");
        command.arg(path);
        command
    };
    command
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map(|_| ())
        .map_err(|error| error.to_string())
}

pub fn report_command(arguments: Vec<String>) -> ExitCode {
    if arguments
        .iter()
        .any(|argument| matches!(argument.as_str(), "--help" | "-h"))
    {
        print!("{}", help());
        return ExitCode::SUCCESS;
    }
    let options = match parse_options(&arguments) {
        Ok(options) => options,
        Err(error) => {
            eprintln!("[supercov] {error}");
            return ExitCode::from(2);
        }
    };
    let root = match std::env::current_dir() {
        Ok(root) => root,
        Err(error) => {
            eprintln!("[supercov] could not resolve the current directory: {error}");
            return ExitCode::from(2);
        }
    };
    let result = (|| -> Result<(PathBuf, usize), String> {
        let inventory = public_run_inventory(&root).map_err(|error| error.to_string())?;
        // An assessment is worth reading on its own, so no run is only fatal
        // when there is nothing else to show either.
        let selected = if inventory.runs.is_empty() {
            Vec::new()
        } else {
            selected_runs(&inventory, &options)?
        };
        let selected_run_id = selected.first().map(|run| run.id.clone());
        let comparison_run_id = options
            .comparison
            .as_deref()
            .map(|selector| select_run(&inventory, Some(selector)).map(|run| run.id.clone()))
            .transpose()
            .map_err(|error| error.to_string())?
            .or_else(|| selected.get(1).map(|run| run.id.clone()));
        let mut runs = Vec::with_capacity(selected.len());
        for (position, run) in selected.iter().enumerate() {
            eprint!(
                "\r[supercov] preparing report run {}/{}: {}",
                position + 1,
                selected.len(),
                run.id
            );
            let _ = std::io::stderr().flush();
            runs.push(build_run(&root, run)?);
        }
        eprint!("\r{}\r", " ".repeat(96));
        let _ = std::io::stderr().flush();
        let mut qualities = build_assessments(&root, "quality", DEFAULT_SNAPSHOTS);
        let mut securities = build_assessments(&root, "security", DEFAULT_SNAPSHOTS);
        let mut timeline = build_timeline(&runs, &qualities);
        attach_security(&root, &runs, &mut securities, &mut timeline);
        attach_quality_sources(&root, &mut qualities, &timeline);
        if timeline.is_empty() {
            return Err("no local coverage runs and no saved assessments to report".into());
        }
        // The chosen run when there is one, so an explicit selector still
        // decides; otherwise the newest thing there is.
        let selected_id = selected_run_id
            .clone()
            .unwrap_or_else(|| timeline[0].id.clone());
        let bundle = ReportBundle {
            schema_version: REPORT_SCHEMA_VERSION,
            project: project_name(&root),
            selected_id,
            selected_run_id,
            comparison_run_id,
            runs,
            qualities,
            securities,
            timeline,
        };
        let html = render_html(&bundle)?;
        if html.len() > MAX_REPORT_BYTES {
            return Err(format!(
                "report is {:.1} MB, above the 24 MB PR-attachment target; retry with --runs 1",
                html.len() as f64 / 1024.0 / 1024.0
            ));
        }
        // The default lives inside the store, which carries its own
        // `.gitignore`, so a report cannot be committed by accident. An
        // explicit path is the user's and resolves against where they ran
        // the command, like any other CLI path.
        let output = match &options.output {
            None => root.join(REPORT_DIRECTORY).join(DEFAULT_REPORT_NAME),
            Some(path) if path.is_absolute() => path.clone(),
            Some(path) => std::env::current_dir()
                .map_err(|error| format!("could not read the working directory: {error}"))?
                .join(path),
        };
        write_atomic(&output, &html)?;
        Ok((output, html.len()))
    })();
    let (output, bytes) = match result {
        Ok(result) => result,
        Err(error) => {
            eprint!("\r{}\r", " ".repeat(96));
            eprintln!("[supercov] report failed: {error}");
            return ExitCode::from(2);
        }
    };
    println!(
        "[supercov] wrote {} ({:.1} MB, self-contained and private)",
        output.display(),
        bytes as f64 / 1024.0 / 1024.0
    );
    if options.open {
        match open_report(&output) {
            Ok(()) => println!("[supercov] opened the report in your browser"),
            Err(error) => eprintln!(
                "[supercov] could not open the browser ({error}); open {} manually",
                output.display()
            ),
        }
    }
    let _ = stdout().flush();
    ExitCode::SUCCESS
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_portable_report_options() {
        assert_eq!(parse_options(&[]).unwrap().runs, 10);
        let options = parse_options(&[
            "run_123".into(),
            "--compare".into(),
            "run_122".into(),
            "--runs".into(),
            "4".into(),
            "--output".into(),
            "artifacts/coverage.html".into(),
            "--no-open".into(),
        ])
        .unwrap();
        assert_eq!(options.selector, "run_123");
        assert_eq!(options.comparison.as_deref(), Some("run_122"));
        assert_eq!(options.runs, 4);
        assert_eq!(
            options.output.as_deref(),
            Some(Path::new("artifacts/coverage.html"))
        );
        assert!(!options.open);
        // No --output means the store's reports directory, decided at write
        // time against the project root rather than here.
        assert_eq!(parse_options(&[]).unwrap().output, None);
    }

    #[test]
    fn rejects_ambiguous_or_unbounded_report_arguments() {
        assert!(parse_options(&["one".into(), "two".into()]).is_err());
        assert!(parse_options(&["--runs".into(), "0".into()]).is_err());
        assert!(parse_options(&["--runs".into(), "21".into()]).is_err());
        assert!(parse_options(&["--wat".into()]).is_err());
    }

    #[test]
    fn source_paths_cannot_escape_the_project() {
        let root =
            std::env::temp_dir().join(format!("supercov-report-paths-{}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        fs::create_dir_all(root.join("src")).unwrap();
        fs::write(root.join("src/app.py"), "answer = 42\n").unwrap();
        assert!(safe_relative_source(&root, "src/app.py").is_some());
        assert!(safe_relative_source(&root, "../secret").is_none());
        assert!(safe_relative_source(&root, "/etc/passwd").is_none());
        fs::remove_dir_all(root).unwrap();
    }
}
