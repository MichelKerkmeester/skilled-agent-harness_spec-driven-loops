//! Changed-line coverage: are the lines this change touches tested?
//!
//! The denominator is the part that has to be right. It is the intersection of
//! two facts already established elsewhere: the lines a patch added or
//! modified, and the lines the run's language adapter decided were executable.
//! Taking the intersection means comments, blank lines and declarations are
//! excluded because the adapter already excluded them, not because this module
//! guessed at syntax it does not parse.
//!
//! Git invocation lives at the edge, in the CLI. Everything here is a pure
//! function of a diff and a run view, so the cases that matter -- renames,
//! deletions, comment-only changes, files absent from the recording -- are
//! testable without a repository.

use std::collections::{BTreeMap, BTreeSet};

use serde::Serialize;

use crate::run_view::{Metric, RunView};

/// Added and modified lines per file, as a unified diff describes them.
pub type ChangedLines = BTreeMap<String, BTreeSet<usize>>;

/// Parse `git diff --unified=0` output into the lines each file gained.
///
/// Only the post-image side is read. A deleted line has no line in the new
/// file to cover, and counting it would ask a patch to test code it removed.
pub fn changed_lines(diff: &str) -> ChangedLines {
    let mut changed = ChangedLines::new();
    let mut file: Option<String> = None;
    for line in diff.lines() {
        if let Some(rest) = line.strip_prefix("+++ ") {
            // `/dev/null` is a deletion; it has no post-image to attribute to.
            file = rest
                .strip_prefix("b/")
                .or(Some(rest))
                .filter(|path| *path != "/dev/null")
                .map(|path| path.trim_end().to_owned());
            continue;
        }
        let Some(rest) = line.strip_prefix("@@ ") else {
            continue;
        };
        let Some(file) = file.as_ref() else {
            continue;
        };
        // "@@ -12,0 +13,4 @@" -- the "+" side is start[,count], count
        // defaulting to 1 and 0 meaning a pure deletion.
        let Some(plus) = rest.split_whitespace().find(|part| part.starts_with('+')) else {
            continue;
        };
        let mut numbers = plus[1..].split(',');
        let Some(start) = numbers.next().and_then(|n| n.parse::<usize>().ok()) else {
            continue;
        };
        let count = numbers
            .next()
            .map_or(Some(1), |n| n.parse::<usize>().ok())
            .unwrap_or(1);
        if count == 0 {
            continue;
        }
        changed
            .entry(file.clone())
            .or_default()
            .extend(start..start + count);
    }
    changed
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PatchFile {
    pub file: String,
    /// Changed lines the run measured, in source order.
    pub executable: Vec<usize>,
    pub uncovered: Vec<usize>,
    /// The file changed but the run never measured it. That is not the same as
    /// a file with no executable change, and calling it zero uncovered lines
    /// would report success for code nothing ran.
    pub missing_from_run: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PatchView {
    pub schema_version: u32,
    pub run: String,
    pub covered: usize,
    pub eligible: usize,
    pub files: Vec<PatchFile>,
    /// Files that changed and are absent from the run, named so the reader can
    /// tell an untested change from an unmeasured one.
    pub missing_from_run: Vec<String>,
}

impl PatchView {
    /// No executable line changed. Honest absence, not a perfect score: a
    /// comment-only patch should say so rather than claim full coverage.
    pub fn is_empty(&self) -> bool {
        self.eligible == 0
    }

    pub fn meets(&self, floor_ppm: u64) -> bool {
        u128::from(self.covered as u64) * 1_000_000
            >= u128::from(floor_ppm) * u128::from(self.eligible as u64)
    }

    pub fn percentage(&self) -> Option<f64> {
        (self.eligible > 0).then(|| self.covered as f64 * 100.0 / self.eligible as f64)
    }
}

/// Intersect a patch with what the run measured.
pub fn build(view: &RunView, changed: &ChangedLines) -> PatchView {
    let measured = view
        .files
        .iter()
        .map(|file| {
            let uncovered = file
                .uncovered_lines
                .iter()
                .copied()
                .collect::<BTreeSet<_>>();
            let eligible = file
                .metric(Metric::Lines)
                .map(|metric| metric.eligible)
                .unwrap_or(0);
            (file.file.as_str(), (uncovered, eligible))
        })
        .collect::<BTreeMap<_, _>>();

    let mut files = Vec::new();
    let mut missing = Vec::new();
    let (mut covered, mut eligible) = (0_usize, 0_usize);
    for (path, lines) in changed {
        let Some((uncovered_lines, _)) = measured.get(path.as_str()) else {
            // Only product source is worth reporting as unmeasured. A changed
            // README, lockfile or test is not a coverage gap, and a list that
            // is mostly those stops being read -- which costs more than the
            // occasional new file it would have caught.
            if view.looks_like_source(path) {
                missing.push(path.clone());
                files.push(PatchFile {
                    file: path.clone(),
                    executable: Vec::new(),
                    uncovered: Vec::new(),
                    missing_from_run: true,
                });
            }
            continue;
        };
        // A changed line is executable exactly when the run measured it. The
        // run view lists a file's uncovered measured lines; every other
        // measured line in it was covered, so membership of the file plus the
        // adapter's own line set is what decides this.
        let executable = lines
            .iter()
            .copied()
            .filter(|line| view.measured_line(path, *line))
            .collect::<Vec<_>>();
        let uncovered = executable
            .iter()
            .copied()
            .filter(|line| uncovered_lines.contains(line))
            .collect::<Vec<_>>();
        covered += executable.len() - uncovered.len();
        eligible += executable.len();
        if !executable.is_empty() {
            files.push(PatchFile {
                file: path.clone(),
                executable,
                uncovered,
                missing_from_run: false,
            });
        }
    }
    PatchView {
        schema_version: crate::run_view::RUN_VIEW_SCHEMA_VERSION,
        run: view.run.clone(),
        covered,
        eligible,
        files,
        missing_from_run: missing,
    }
}

/// Collapse consecutive uncovered lines into inclusive ranges, so a block of
/// twenty untested lines is one annotation rather than twenty.
pub fn ranges(lines: &[usize]) -> Vec<(usize, usize)> {
    let mut out: Vec<(usize, usize)> = Vec::new();
    for line in lines {
        match out.last_mut() {
            Some(last) if last.1 + 1 == *line => last.1 = *line,
            _ => out.push((*line, *line)),
        }
    }
    out
}

/// Escape a value for a GitHub Actions workflow command.
///
/// The transport is line based and delimits properties with `,` and `::`, so
/// an unescaped newline or colon in a path does not merely look wrong -- it
/// ends the command early and lets the remainder be read as a new one.
pub fn escape_property(value: &str) -> String {
    value
        .replace('%', "%25")
        .replace('\r', "%0D")
        .replace('\n', "%0A")
        .replace(':', "%3A")
        .replace(',', "%2C")
}

pub fn escape_message(value: &str) -> String {
    value
        .replace('%', "%25")
        .replace('\r', "%0D")
        .replace('\n', "%0A")
}

/// Render GitHub Actions annotations for the uncovered ranges, capped.
pub fn annotations(view: &PatchView, cap: usize) -> Vec<String> {
    let mut out = Vec::new();
    for file in &view.files {
        for (start, end) in ranges(&file.uncovered) {
            if out.len() == cap {
                return out;
            }
            let lines = if start == end {
                format!("line {start}")
            } else {
                format!("lines {start} to {end}")
            };
            out.push(format!(
                "::warning file={},line={},endLine={}::{}",
                escape_property(&file.file),
                start,
                end,
                escape_message(&format!(
                    "Changed {lines} not covered by the selected tests."
                )),
            ));
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::run_view::{Applicability, FileView, MetricView, RUN_VIEW_SCHEMA_VERSION};

    fn file(name: &str, eligible: usize, measured: &[usize], uncovered: &[usize]) -> FileView {
        FileView {
            file: name.into(),
            metrics: vec![MetricView {
                metric: Metric::Lines,
                covered: eligible - uncovered.len(),
                eligible,
                applicability: Applicability::Measured,
            }],
            measured_lines: measured.to_vec(),
            uncovered_lines: uncovered.to_vec(),
            missing_branches: Vec::new(),
            missing_conditions: Vec::new(),
            functions: Vec::new(),
            branches: Vec::new(),
        }
    }

    fn view(files: Vec<FileView>) -> RunView {
        let source_neighbourhoods = files
            .iter()
            .filter_map(|file| {
                let (directory, name) = file.file.rsplit_once('/').unwrap_or(("", &file.file));
                let (_, extension) = name.rsplit_once('.')?;
                Some((directory.to_owned(), extension.to_owned()))
            })
            .collect();
        RunView {
            source_neighbourhoods,
            schema_version: RUN_VIEW_SCHEMA_VERSION,
            run: "run_1".into(),
            generated_at: "now".into(),
            suite_passed: true,
            stale: false,
            stale_reasons: Vec::new(),
            complete: true,
            limitations: Vec::new(),
            totals: Vec::new(),
            files,
        }
    }

    #[test]
    fn only_the_post_image_of_a_diff_becomes_a_denominator() {
        // A deleted line has nothing left to cover, and a pure deletion hunk
        // (`+13,0`) must not claim line 13 of the new file.
        let diff = "\
--- a/src/a.ts
+++ b/src/a.ts
@@ -1,2 +1,3 @@
@@ -20,4 +21,0 @@
--- a/src/gone.ts
+++ /dev/null
@@ -1,5 +0,0 @@
--- a/src/b.ts
+++ b/src/b.ts
@@ -7 +7 @@
";
        let changed = changed_lines(diff);
        assert_eq!(changed["src/a.ts"], BTreeSet::from([1, 2, 3]));
        assert_eq!(changed["src/b.ts"], BTreeSet::from([7]));
        assert!(!changed.contains_key("/dev/null"));
        assert!(!changed.contains_key("src/gone.ts"));
    }

    #[test]
    fn the_denominator_is_the_adapter_s_executable_lines_not_every_changed_line() {
        // Lines 1 and 5 are comments as far as the adapter is concerned: it
        // never measured them, so they are not obligations this patch failed.
        let run = view(vec![file("src/a.ts", 3, &[2, 3, 4], &[3])]);
        let changed = ChangedLines::from([("src/a.ts".into(), BTreeSet::from([1, 2, 3, 5]))]);
        let patch = build(&run, &changed);
        assert_eq!(patch.files[0].executable, [2, 3]);
        assert_eq!(patch.files[0].uncovered, [3]);
        assert_eq!((patch.covered, patch.eligible), (1, 2));
        assert!(!patch.meets(1_000_000));
        assert!(patch.meets(500_000));
    }

    #[test]
    fn a_comment_only_change_is_empty_rather_than_perfect() {
        // Reporting 100% here would claim a patch was tested when nothing
        // testable changed. The distinction is the point.
        let run = view(vec![file("src/a.ts", 2, &[2, 3], &[])]);
        let changed = ChangedLines::from([("src/a.ts".into(), BTreeSet::from([1, 9]))]);
        let patch = build(&run, &changed);
        assert!(patch.is_empty());
        assert_eq!(patch.percentage(), None);
        assert!(patch.files.is_empty());
    }

    #[test]
    fn changed_source_the_run_never_measured_is_named_not_counted_as_covered() {
        // Silently treating it as zero uncovered lines would report success
        // for code that nothing ran.
        let run = view(vec![file("src/a.ts", 1, &[2], &[])]);
        let changed = ChangedLines::from([("src/new.ts".into(), BTreeSet::from([1, 2]))]);
        let patch = build(&run, &changed);
        assert_eq!(patch.missing_from_run, ["src/new.ts"]);
        assert!(patch.files[0].missing_from_run);
        assert_eq!((patch.covered, patch.eligible), (0, 0));

        // A document, a lockfile and a test in a directory nothing is measured
        // in are not coverage gaps. Announcing them would bury the one file
        // that is, which is how a useful list becomes an ignored one.
        let quiet = build(
            &run,
            &ChangedLines::from([
                ("README.md".into(), BTreeSet::from([1])),
                ("package-lock.json".into(), BTreeSet::from([2])),
                ("tests/a.test.ts".into(), BTreeSet::from([3])),
            ]),
        );
        assert!(
            quiet.missing_from_run.is_empty(),
            "{:?}",
            quiet.missing_from_run
        );
        assert!(quiet.files.is_empty());
    }

    #[test]
    fn adjacent_misses_become_one_annotation_and_the_transport_is_escaped() {
        // A file name carrying a comma, colon or newline would otherwise end
        // the workflow command early and let the rest be read as a new one.
        let run = view(vec![file("a,b:c.ts", 5, &[1, 2, 3, 4, 9], &[2, 3, 4, 9])]);
        let changed = ChangedLines::from([("a,b:c.ts".into(), BTreeSet::from([1, 2, 3, 4, 9]))]);
        let patch = build(&run, &changed);
        assert_eq!(ranges(&patch.files[0].uncovered), [(2, 4), (9, 9)]);
        let rendered = annotations(&patch, 10);
        assert_eq!(rendered.len(), 2);
        assert!(rendered[0].contains("file=a%2Cb%3Ac.ts"), "{}", rendered[0]);
        assert!(rendered[0].contains("line=2,endLine=4"), "{}", rendered[0]);
        assert!(!rendered[0].contains("\n"));
        assert_eq!(annotations(&patch, 1).len(), 1, "the cap is honoured");
        assert_eq!(escape_message("a\nb%c"), "a%0Ab%25c");
    }
}
