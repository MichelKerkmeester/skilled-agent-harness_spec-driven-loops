//! One versioned view of a run, shared by every gate, export and report.
//!
//! A threshold check, a changed-line check, an LCOV export and an HTML report
//! all have to agree about what a run measured. Deriving that four times is how
//! a gate and a report come to disagree about the same run, so it is derived
//! once, here, from the same core that produced the run's own summary.
//!
//! The view keeps applicability separate from the numbers. A percentage cannot
//! distinguish "nothing was uncovered" from "nothing was measured", and a gate
//! that treats those alike reports success for a run that proved nothing.

use std::collections::{BTreeMap, BTreeSet};

use serde::Serialize;

use crate::coverage_analysis::CoverageSummary;
use crate::coverage_report::{CoverageView, ReportError, coverage_summary_for_file};

pub const RUN_VIEW_SCHEMA_VERSION: u32 = 1;

/// The structural metrics a floor can be set on.
///
/// Assertion assessment is deliberately absent. It answers a different
/// question -- whether a test checks what it executes -- and its own check
/// already carries the freshness and acknowledgement rules that answer costs.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum Metric {
    Lines,
    Statements,
    Functions,
    Branches,
    Mcdc,
}

impl Metric {
    pub const ALL: [Metric; 5] = [
        Metric::Lines,
        Metric::Statements,
        Metric::Functions,
        Metric::Branches,
        Metric::Mcdc,
    ];

    pub fn name(self) -> &'static str {
        match self {
            Metric::Lines => "lines",
            Metric::Statements => "statements",
            Metric::Functions => "functions",
            Metric::Branches => "branches",
            Metric::Mcdc => "mcdc",
        }
    }

    pub fn parse(value: &str) -> Option<Self> {
        Metric::ALL
            .into_iter()
            .find(|metric| metric.name() == value.to_ascii_lowercase())
    }

    /// The flag that sets this metric's floor, for error messages that tell the
    /// reader what to change.
    pub fn flag(self) -> &'static str {
        match self {
            Metric::Lines => "--min-lines",
            Metric::Statements => "--min-statements",
            Metric::Functions => "--min-functions",
            Metric::Branches => "--min-branches",
            Metric::Mcdc => "--min-mcdc",
        }
    }
}

/// Whether a metric can be judged at all, before any number is compared.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase", tag = "state")]
pub enum Applicability {
    /// Measured exactly. Only this state can pass or fail a floor.
    Measured,
    /// Nothing eligible. Zero of zero is not a hundred percent, and a floor on
    /// it is a policy decision the author has to make rather than one this
    /// tool should make quietly.
    NotApplicable,
    /// The run declined some obligations, so a floor cannot be judged without
    /// deciding what the unmeasured ones would have been. A measurement gap is
    /// not a coverage gap, and reporting one as the other is a wrong number.
    Incomplete { unmeasured: usize },
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct MetricView {
    pub metric: Metric,
    pub covered: usize,
    pub eligible: usize,
    #[serde(flatten)]
    pub applicability: Applicability,
}

impl MetricView {
    /// Exact comparison against a floor in parts per million of a percentage.
    ///
    /// The counts are compared directly, never a formatted percentage: a run
    /// that displays `100.00%` with one line of ten thousand uncovered must
    /// fail a 100% requirement, and a float percentage cannot promise that.
    pub fn meets(&self, floor_ppm: u64) -> bool {
        u128::from(self.covered as u64) * 1_000_000
            >= u128::from(floor_ppm) * u128::from(self.eligible as u64)
    }

    /// For display only. Never compare this.
    pub fn percentage(&self) -> Option<f64> {
        (self.eligible > 0).then(|| self.covered as f64 * 100.0 / self.eligible as f64)
    }
}

fn metric_counts(summary: &CoverageSummary, metric: Metric) -> (usize, usize) {
    match metric {
        Metric::Lines => (summary.lines.covered, summary.lines.total),
        Metric::Statements => (summary.statements.covered, summary.statements.total),
        Metric::Functions => (summary.functions.covered, summary.functions.total),
        Metric::Branches => (summary.branches.covered, summary.branches.total),
        Metric::Mcdc => (summary.covered_conditions, summary.conditions),
    }
}

fn metrics_of(summary: &CoverageSummary) -> Vec<MetricView> {
    let unmeasured = summary.unmeasured_obligations.unwrap_or(0);
    Metric::ALL
        .into_iter()
        .map(|metric| {
            let (covered, eligible) = metric_counts(summary, metric);
            let applicability = if eligible == 0 {
                Applicability::NotApplicable
            } else if unmeasured > 0 {
                Applicability::Incomplete { unmeasured }
            } else {
                Applicability::Measured
            };
            MetricView {
                metric,
                covered,
                eligible,
                applicability,
            }
        })
        .collect()
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Location {
    pub line: usize,
    pub column: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FunctionRecord {
    pub line: usize,
    pub name: String,
    pub covered: bool,
}

/// One alternative of one branch, in the shape every export format wants:
/// which decision it belongs to and whether it was taken.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BranchRecord {
    pub line: usize,
    pub block: usize,
    pub index: usize,
    pub taken: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileView {
    pub file: String,
    pub metrics: Vec<MetricView>,
    /// Every line the language adapter decided was executable, in source
    /// order. A changed-line check intersects a patch with this rather than
    /// parsing syntax of its own: the adapter already knows which lines are
    /// comments, blanks or declarations.
    pub measured_lines: Vec<usize>,
    /// Measured lines no selected test reached, in source order.
    pub uncovered_lines: Vec<usize>,
    pub missing_branches: Vec<Location>,
    pub missing_conditions: Vec<Location>,
    pub functions: Vec<FunctionRecord>,
    pub branches: Vec<BranchRecord>,
}

impl FileView {
    pub fn metric(&self, metric: Metric) -> Option<&MetricView> {
        self.metrics.iter().find(|view| view.metric == metric)
    }

    /// Every measured line paired with whether a selected test reached it.
    ///
    /// Derived rather than stored, so a line can never appear covered here and
    /// uncovered in the counts beside it.
    pub fn line_hits(&self) -> impl Iterator<Item = (usize, bool)> + '_ {
        self.measured_lines
            .iter()
            .map(|line| (*line, self.uncovered_lines.binary_search(line).is_err()))
    }
}

/// Why a run cannot be gated at all, regardless of its numbers.
#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Blocker {
    pub reason: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RunView {
    pub schema_version: u32,
    pub run: String,
    pub generated_at: String,
    /// The wrapped test command's own result. A report from a failed suite can
    /// still be useful, but it must never turn a CI run green.
    pub suite_passed: bool,
    pub stale: bool,
    pub stale_reasons: Vec<String>,
    pub complete: bool,
    pub limitations: Vec<String>,
    pub totals: Vec<MetricView>,
    pub files: Vec<FileView>,
    /// Directories the run discovered product source in, paired with the
    /// extensions it measured there.
    ///
    /// A changed file the run never measured is only worth reporting when it
    /// is the kind of file this project measures. Without this, every changed
    /// README, lockfile and test would be announced as an unmeasured gap, and
    /// a list that is mostly noise stops being read.
    pub source_neighbourhoods: BTreeSet<(String, String)>,
}

impl RunView {
    pub fn metric(&self, metric: Metric) -> Option<&MetricView> {
        self.totals.iter().find(|view| view.metric == metric)
    }

    pub fn file(&self, path: &str) -> Option<&FileView> {
        self.files.iter().find(|file| file.file == path)
    }

    /// Whether the adapter treated this line as executable at all.
    pub fn measured_line(&self, path: &str, line: usize) -> bool {
        self.file(path)
            .is_some_and(|file| file.measured_lines.binary_search(&line).is_ok())
    }

    /// Whether this path looks like product source for this project: a file
    /// sitting where the run found measured source, with an extension it
    /// measured there. True for a file added beside existing source, false for
    /// a document, a lockfile or a test living somewhere nothing is measured.
    pub fn looks_like_source(&self, path: &str) -> bool {
        neighbourhood(path).is_some_and(|key| self.source_neighbourhoods.contains(&key))
    }

    /// Everything that makes this run unusable as evidence for a gate.
    pub fn blockers(&self) -> Vec<Blocker> {
        let mut blockers = Vec::new();
        if !self.suite_passed {
            blockers.push(Blocker {
                reason: "the wrapped test command did not pass; a gate over a failed suite cannot report success".into(),
            });
        }
        if self.stale {
            let detail = if self.stale_reasons.is_empty() {
                "the run no longer matches the current checkout".to_owned()
            } else {
                format!(
                    "the run no longer matches the current checkout: {}",
                    self.stale_reasons.join(", ")
                )
            };
            blockers.push(Blocker { reason: detail });
        }
        blockers
    }
}

/// A path's directory and extension, the pair that decides whether a file
/// belongs to the same measured population as its neighbours.
fn neighbourhood(path: &str) -> Option<(String, String)> {
    let (directory, name) = path.rsplit_once('/').unwrap_or(("", path));
    let (_, extension) = name.rsplit_once('.')?;
    Some((directory.to_owned(), extension.to_owned()))
}

/// Build the shared view from a run's coverage view.
pub fn build(
    run: &str,
    generated_at: &str,
    view: &CoverageView,
    suite_passed: bool,
    stale: bool,
    stale_reasons: Vec<String>,
) -> Result<RunView, ReportError> {
    let mut files = BTreeMap::<String, FileView>::new();
    for line in &view.lines {
        files
            .entry(line.file.clone())
            .or_insert_with(|| FileView {
                file: line.file.clone(),
                metrics: Vec::new(),
                measured_lines: Vec::new(),
                uncovered_lines: Vec::new(),
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: Vec::new(),
                branches: Vec::new(),
            })
            .measured_lines
            .extend(line.measured.then_some(line.line));
        if line.measured
            && !line.covered
            && let Some(file) = files.get_mut(&line.file)
        {
            file.uncovered_lines.push(line.line);
        }
    }
    for branch in &view.branches {
        let entry = files
            .entry(branch.meta.file.clone())
            .or_insert_with(|| FileView {
                file: branch.meta.file.clone(),
                metrics: Vec::new(),
                measured_lines: Vec::new(),
                uncovered_lines: Vec::new(),
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: Vec::new(),
                branches: Vec::new(),
            });
        for alternative in branch.alternatives.iter().filter(|a| !a.covered) {
            entry.missing_branches.push(Location {
                line: branch.meta.line,
                column: branch.meta.column,
            });
            let _ = alternative;
        }
    }
    for point in &view.points {
        if point.meta.kind != crate::coverage_analysis::PointKind::Function {
            continue;
        }
        if let Some(file) = files.get_mut(&point.meta.file) {
            file.functions.push(FunctionRecord {
                line: point.meta.line,
                name: point
                    .meta
                    .label
                    .clone()
                    .unwrap_or_else(|| format!("{}:{}", point.meta.line, point.meta.column)),
                covered: point.covered,
            });
        }
    }
    for (block, branch) in view.branches.iter().enumerate() {
        if let Some(file) = files.get_mut(&branch.meta.file) {
            for (index, alternative) in branch.alternatives.iter().enumerate() {
                file.branches.push(BranchRecord {
                    line: branch.meta.line,
                    block,
                    index,
                    taken: alternative.covered,
                });
            }
        }
    }
    for decision in &view.decisions {
        let entry = files
            .entry(decision.meta.file.clone())
            .or_insert_with(|| FileView {
                file: decision.meta.file.clone(),
                metrics: Vec::new(),
                measured_lines: Vec::new(),
                uncovered_lines: Vec::new(),
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: Vec::new(),
                branches: Vec::new(),
            });
        for _ in decision.conditions.iter().filter(|c| !c.covered) {
            entry.missing_conditions.push(Location {
                line: decision.meta.line,
                column: decision.meta.column,
            });
        }
    }
    let mut built = Vec::new();
    for (path, mut file) in files {
        file.metrics = metrics_of(&coverage_summary_for_file(view, &path)?);
        file.measured_lines.sort_unstable();
        file.measured_lines.dedup();
        file.uncovered_lines.sort_unstable();
        file.uncovered_lines.dedup();
        file.missing_branches.sort_by_key(|at| (at.line, at.column));
        file.missing_conditions
            .sort_by_key(|at| (at.line, at.column));
        file.functions
            .sort_by(|a, b| (a.line, &a.name).cmp(&(b.line, &b.name)));
        file.branches
            .sort_by_key(|record| (record.line, record.block, record.index));
        built.push(file);
    }
    let source_neighbourhoods = built
        .iter()
        .filter_map(|file| neighbourhood(&file.file))
        .collect::<BTreeSet<_>>();
    Ok(RunView {
        schema_version: RUN_VIEW_SCHEMA_VERSION,
        run: run.to_owned(),
        generated_at: generated_at.to_owned(),
        suite_passed,
        stale,
        stale_reasons,
        complete: view.summary.coverage_complete,
        limitations: view
            .limitations
            .iter()
            .map(|limitation| limitation.to_string())
            .collect(),
        totals: metrics_of(&view.summary),
        files: built,
        source_neighbourhoods,
    })
}

/// A percentage floor, held in parts per million so a fractional target is
/// compared exactly rather than through a float.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Floor {
    pub metric: Metric,
    pub ppm: u64,
}

/// Parse a percentage into parts per million, rejecting anything that is not a
/// plain number between 0 and 100.
pub fn parse_percentage(value: &str) -> Result<u64, String> {
    let text = value.trim();
    let (whole, fraction) = match text.split_once('.') {
        Some((whole, fraction)) => (whole, fraction),
        None => (text, ""),
    };
    if whole.is_empty() && fraction.is_empty() {
        return Err(format!("{value:?} is not a percentage"));
    }
    if !whole.chars().all(|c| c.is_ascii_digit())
        || !fraction.chars().all(|c| c.is_ascii_digit())
        || fraction.len() > 4
    {
        return Err(format!(
            "{value:?} is not a percentage between 0 and 100 with at most four decimal places"
        ));
    }
    let whole: u64 = if whole.is_empty() {
        0
    } else {
        whole
            .parse()
            .map_err(|_| format!("{value:?} is too large"))?
    };
    let scaled: u64 = if fraction.is_empty() {
        0
    } else {
        format!("{fraction:0<4}")
            .parse()
            .map_err(|_| format!("{value:?} is not a percentage"))?
    };
    let ppm = whole
        .checked_mul(10_000)
        .and_then(|whole| whole.checked_add(scaled))
        .ok_or_else(|| format!("{value:?} is too large"))?;
    (ppm <= 1_000_000)
        .then_some(ppm)
        .ok_or_else(|| format!("{value:?} is above 100"))
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Violation {
    /// Absent for a run-wide floor.
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file: Option<String>,
    pub metric: Metric,
    pub covered: usize,
    pub eligible: usize,
    pub floor_ppm: u64,
    pub uncovered_lines: Vec<usize>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase", tag = "result")]
pub enum Outcome {
    Pass,
    Fail {
        violations: Vec<Violation>,
    },
    /// The request or the evidence cannot answer the question asked. Never a
    /// pass, and never reported as a policy failure either.
    Error {
        reasons: Vec<String>,
    },
}

impl Outcome {
    pub fn exit_code(&self) -> u8 {
        match self {
            Outcome::Pass => 0,
            Outcome::Fail { .. } => 1,
            Outcome::Error { .. } => 2,
        }
    }
}

/// Judge a run against percentage floors.
///
/// Insufficient evidence is an error, never a pass: an unsupported metric, an
/// empty scope, a partial measurement, a failed suite or a stale run all leave
/// the question unanswered, and answering it anyway is how a gate goes green
/// over a suite that never ran.
pub fn check(view: &RunView, floors: &[Floor], per_file: bool) -> Outcome {
    let mut reasons = view
        .blockers()
        .into_iter()
        .map(|blocker| blocker.reason)
        .collect::<Vec<_>>();
    if floors.is_empty() {
        reasons.push("no floor requested; give at least one --min-<metric>".into());
    }
    for floor in floors {
        match view.metric(floor.metric) {
            None => reasons.push(format!(
                "{} is not measured by this run's language adapter; remove {}",
                floor.metric.name(),
                floor.metric.flag()
            )),
            Some(metric) => match &metric.applicability {
                Applicability::NotApplicable => reasons.push(format!(
                    "{} has nothing eligible in this run, which is not the same as complete; remove {} or widen the scope",
                    floor.metric.name(),
                    floor.metric.flag()
                )),
                Applicability::Incomplete { unmeasured } => reasons.push(format!(
                    "{} left {unmeasured} obligation(s) unmeasured, so {} cannot be judged exactly",
                    floor.metric.name(),
                    floor.metric.flag()
                )),
                Applicability::Measured => {}
            },
        }
    }
    if !reasons.is_empty() {
        return Outcome::Error { reasons };
    }

    let mut violations = Vec::new();
    for floor in floors {
        let Some(metric) = view.metric(floor.metric) else {
            continue;
        };
        if !metric.meets(floor.ppm) {
            violations.push(Violation {
                file: None,
                metric: floor.metric,
                covered: metric.covered,
                eligible: metric.eligible,
                floor_ppm: floor.ppm,
                uncovered_lines: Vec::new(),
            });
        }
        if !per_file {
            continue;
        }
        for file in &view.files {
            let Some(counts) = file.metric(floor.metric) else {
                continue;
            };
            // A file with nothing eligible for this metric is not a hundred
            // percent and not a violation either; it simply has no obligation.
            if counts.eligible == 0 || counts.meets(floor.ppm) {
                continue;
            }
            violations.push(Violation {
                file: Some(file.file.clone()),
                metric: floor.metric,
                covered: counts.covered,
                eligible: counts.eligible,
                floor_ppm: floor.ppm,
                uncovered_lines: file.uncovered_lines.clone(),
            });
        }
    }
    if violations.is_empty() {
        Outcome::Pass
    } else {
        Outcome::Fail { violations }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn metric(covered: usize, eligible: usize) -> MetricView {
        MetricView {
            metric: Metric::Lines,
            covered,
            eligible,
            applicability: if eligible == 0 {
                Applicability::NotApplicable
            } else {
                Applicability::Measured
            },
        }
    }

    fn view(totals: Vec<MetricView>, files: Vec<FileView>) -> RunView {
        RunView {
            schema_version: RUN_VIEW_SCHEMA_VERSION,
            run: "run_1".into(),
            generated_at: "now".into(),
            suite_passed: true,
            stale: false,
            stale_reasons: Vec::new(),
            complete: true,
            limitations: Vec::new(),
            totals,
            files,
            source_neighbourhoods: BTreeSet::new(),
        }
    }

    #[test]
    fn a_floor_is_compared_against_counts_and_never_a_rounded_percentage() {
        // 9_999 of 10_000 displays as 100.00%. A gate that reads the display
        // passes a run with an uncovered line, which is the whole reason this
        // compares the counts instead.
        let almost = metric(9_999, 10_000);
        assert_eq!(format!("{:.2}", almost.percentage().unwrap()), "99.99");
        assert!(!almost.meets(1_000_000));
        assert!(almost.meets(999_000));
        assert!(metric(10_000, 10_000).meets(1_000_000));

        // And a fractional floor is exact in both directions.
        assert!(metric(995, 1_000).meets(parse_percentage("99.5").unwrap()));
        assert!(!metric(994, 1_000).meets(parse_percentage("99.5").unwrap()));
    }

    #[test]
    fn nothing_eligible_is_not_complete_coverage() {
        // Zero of zero satisfies every floor arithmetically, so applicability
        // has to be decided before the comparison, not by it.
        let empty = metric(0, 0);
        assert!(empty.meets(1_000_000));
        assert_eq!(empty.applicability, Applicability::NotApplicable);
        let outcome = check(
            &view(vec![empty], Vec::new()),
            &[Floor {
                metric: Metric::Lines,
                ppm: 1_000_000,
            }],
            false,
        );
        assert!(matches!(outcome, Outcome::Error { .. }), "{outcome:?}");
        assert_eq!(outcome.exit_code(), 2);
    }

    #[test]
    fn evidence_that_cannot_answer_the_question_never_passes() {
        let floors = [Floor {
            metric: Metric::Lines,
            ppm: 500_000,
        }];
        // Fully covered, but the suite failed: a gate over a failed suite must
        // not report success however good the numbers look.
        let mut failed = view(vec![metric(10, 10)], Vec::new());
        failed.suite_passed = false;
        assert_eq!(check(&failed, &floors, false).exit_code(), 2);

        // Fully covered, but the run no longer matches the checkout.
        let mut stale = view(vec![metric(10, 10)], Vec::new());
        stale.stale = true;
        stale.stale_reasons = vec!["instrumented source changed".into()];
        let outcome = check(&stale, &floors, false);
        assert_eq!(outcome.exit_code(), 2);
        let Outcome::Error { reasons } = outcome else {
            panic!("expected an error");
        };
        assert!(
            reasons[0].contains("instrumented source changed"),
            "{reasons:?}"
        );

        // A partial measurement cannot be judged exactly either.
        let mut partial = view(vec![metric(10, 10)], Vec::new());
        partial.totals[0].applicability = Applicability::Incomplete { unmeasured: 3 };
        assert_eq!(check(&partial, &floors, false).exit_code(), 2);

        // A metric this adapter never records is a request error, not a pass.
        assert_eq!(
            check(
                &view(vec![metric(10, 10)], Vec::new()),
                &[Floor {
                    metric: Metric::Mcdc,
                    ppm: 500_000
                }],
                false
            )
            .exit_code(),
            2
        );
    }

    #[test]
    fn every_violation_is_reported_with_the_counts_behind_it() {
        // One message per failing rule, each carrying its own numerator and
        // denominator, so a reader can act without rerunning anything.
        let files = vec![
            FileView {
                file: "src/a.ts".into(),
                metrics: vec![MetricView {
                    metric: Metric::Lines,
                    covered: 1,
                    eligible: 4,
                    applicability: Applicability::Measured,
                }],
                measured_lines: vec![1, 2, 3, 4],
                uncovered_lines: vec![2, 3, 4],
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: Vec::new(),
                branches: Vec::new(),
            },
            FileView {
                file: "src/b.ts".into(),
                metrics: vec![MetricView {
                    metric: Metric::Lines,
                    covered: 6,
                    eligible: 6,
                    applicability: Applicability::Measured,
                }],
                measured_lines: vec![1, 2, 3, 4, 5, 6],
                uncovered_lines: Vec::new(),
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: Vec::new(),
                branches: Vec::new(),
            },
        ];
        let outcome = check(
            &view(vec![metric(7, 10)], files),
            &[Floor {
                metric: Metric::Lines,
                ppm: 900_000,
            }],
            true,
        );
        let Outcome::Fail { violations } = outcome else {
            panic!("expected a policy failure");
        };
        assert_eq!(violations.len(), 2, "{violations:?}");
        assert_eq!(violations[0].file, None);
        assert_eq!((violations[0].covered, violations[0].eligible), (7, 10));
        assert_eq!(violations[1].file.as_deref(), Some("src/a.ts"));
        assert_eq!(violations[1].uncovered_lines, [2, 3, 4]);
    }

    #[test]
    fn a_percentage_is_read_exactly_or_refused() {
        assert_eq!(parse_percentage("90").unwrap(), 900_000);
        assert_eq!(parse_percentage("99.5").unwrap(), 995_000);
        assert_eq!(parse_percentage("100").unwrap(), 1_000_000);
        assert_eq!(parse_percentage("0").unwrap(), 0);
        assert_eq!(parse_percentage(" 87.6543 ").unwrap(), 876_543);
        for refused in ["101", "-1", "abc", "", "1e2", "50.123456", "100.0001"] {
            assert!(parse_percentage(refused).is_err(), "{refused} was accepted");
        }
    }
}
