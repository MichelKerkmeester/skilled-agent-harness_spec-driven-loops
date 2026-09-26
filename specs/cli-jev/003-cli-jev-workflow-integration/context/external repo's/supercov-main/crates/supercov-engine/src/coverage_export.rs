//! LCOV and Cobertura exports, written from the shared run view.
//!
//! These exist for compatibility, not as a headline: they let Supercov feed
//! the viewers, hosted services and CI integrations a team already uses. Both
//! read the same view the CLI and the gates read, so a consumer's totals match
//! what `check` enforced.
//!
//! Two things are deliberately not done. Supercov records whether a line ran,
//! not how many times, so an export states `1` or `0` and never invents an
//! execution frequency a consumer would display as fact. And MC/DC conditions
//! are not flattened into ordinary branches to fit a simpler model: a consumer
//! would then report condition obligations as branch coverage, which is a
//! different measurement. The richer evidence stays in the JSON view.

use std::fmt::Write as _;

use crate::run_view::{Metric, RunView};

/// Escape text for XML character data and attribute values.
fn xml(value: &str) -> String {
    let mut out = String::with_capacity(value.len());
    for character in value.chars() {
        match character {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&apos;"),
            // XML 1.0 cannot carry these at all; dropping them keeps the
            // document parseable rather than emitting bytes no reader accepts.
            c if (c < ' ' && c != '\t' && c != '\n' && c != '\r') => {}
            c => out.push(c),
        }
    }
    out
}

fn rate(covered: usize, total: usize) -> f64 {
    if total == 0 {
        // Cobertura has no "not applicable"; 1.0 is the convention for an
        // empty denominator and is what every reader expects.
        return 1.0;
    }
    covered as f64 / total as f64
}

fn counts(view: &RunView, metric: Metric) -> (usize, usize) {
    view.metric(metric)
        .map(|m| (m.covered, m.eligible))
        .unwrap_or((0, 0))
}

/// The export formats, named once so the rest of the product never has to
/// spell them. Supercov emits these formats; it never invokes the tools they
/// are named after, and the packaging audit that enforces that reads this
/// module as the single place allowed to name them.
pub const FORMATS: &str = "lcov|cobertura|html";

/// Render a run in the named format.
pub fn export(view: &RunView, format: &str, timestamp: u64) -> Result<String, String> {
    match format {
        "lcov" => Ok(lcov(view)),
        "cobertura" => Ok(cobertura(view, timestamp)),
        // `html` is rendered by `coverage_html`, which also needs verified
        // source text; the CLI routes it before reaching here.
        other => Err(format!(
            "unknown format {other}; Supercov exports {FORMATS}"
        )),
    }
}

/// An LCOV tracefile.
///
/// Line, function and branch records only. Modern LCOV does have an `MCDC`
/// record, but faithful mapping from Supercov's condition evidence and support
/// in downstream readers both need verifying before claiming it.
pub fn lcov(view: &RunView) -> String {
    let mut out = String::new();
    for file in &view.files {
        let _ = writeln!(out, "TN:");
        let _ = writeln!(out, "SF:{}", file.file);
        for function in &file.functions {
            let _ = writeln!(out, "FN:{},{}", function.line, function.name);
        }
        for function in &file.functions {
            // Hit or not hit. Supercov does not count invocations, and writing
            // a made-up frequency here would be displayed as one.
            let _ = writeln!(out, "FNDA:{},{}", u8::from(function.covered), function.name);
        }
        let (covered_functions, functions) = file
            .metric(Metric::Functions)
            .map(|m| (m.covered, m.eligible))
            .unwrap_or((0, 0));
        let _ = writeln!(out, "FNF:{functions}");
        let _ = writeln!(out, "FNH:{covered_functions}");
        for branch in &file.branches {
            let _ = writeln!(
                out,
                "BRDA:{},{},{},{}",
                branch.line,
                branch.block,
                branch.index,
                if branch.taken { "1" } else { "-" }
            );
        }
        let (covered_branches, branches) = file
            .metric(Metric::Branches)
            .map(|m| (m.covered, m.eligible))
            .unwrap_or((0, 0));
        let _ = writeln!(out, "BRF:{branches}");
        let _ = writeln!(out, "BRH:{covered_branches}");
        for (line, covered) in file.line_hits() {
            let _ = writeln!(out, "DA:{line},{}", u8::from(covered));
        }
        let (covered_lines, lines) = file
            .metric(Metric::Lines)
            .map(|m| (m.covered, m.eligible))
            .unwrap_or((0, 0));
        let _ = writeln!(out, "LF:{lines}");
        let _ = writeln!(out, "LH:{covered_lines}");
        let _ = writeln!(out, "end_of_record");
    }
    out
}

/// A Cobertura XML report.
pub fn cobertura(view: &RunView, timestamp: u64) -> String {
    let (covered_lines, lines) = counts(view, Metric::Lines);
    let (covered_branches, branches) = counts(view, Metric::Branches);
    let mut out = String::new();
    out.push_str("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    let _ = writeln!(
        out,
        "<coverage line-rate=\"{:.4}\" branch-rate=\"{:.4}\" lines-covered=\"{covered_lines}\" lines-valid=\"{lines}\" branches-covered=\"{covered_branches}\" branches-valid=\"{branches}\" complexity=\"0\" version=\"{}\" timestamp=\"{timestamp}\">",
        rate(covered_lines, lines),
        rate(covered_branches, branches),
        xml(env!("CARGO_PKG_VERSION")),
    );
    // A single relative source root keeps filenames resolvable by readers that
    // join them onto a checkout, and leaks no absolute path from this machine.
    out.push_str("  <sources>\n    <source>.</source>\n  </sources>\n  <packages>\n");
    let _ = writeln!(
        out,
        "    <package name=\"\" line-rate=\"{:.4}\" branch-rate=\"{:.4}\" complexity=\"0\">",
        rate(covered_lines, lines),
        rate(covered_branches, branches),
    );
    out.push_str("      <classes>\n");
    for file in &view.files {
        let (file_covered, file_lines) = file
            .metric(Metric::Lines)
            .map(|m| (m.covered, m.eligible))
            .unwrap_or((0, 0));
        let (branch_covered, branch_total) = file
            .metric(Metric::Branches)
            .map(|m| (m.covered, m.eligible))
            .unwrap_or((0, 0));
        let _ = writeln!(
            out,
            "        <class name=\"{}\" filename=\"{}\" line-rate=\"{:.4}\" branch-rate=\"{:.4}\" complexity=\"0\">",
            xml(&file.file),
            xml(&file.file),
            rate(file_covered, file_lines),
            rate(branch_covered, branch_total),
        );
        out.push_str("          <methods/>\n          <lines>\n");
        for (line, covered) in file.line_hits() {
            let alternatives = file
                .branches
                .iter()
                .filter(|branch| branch.line == line)
                .collect::<Vec<_>>();
            if alternatives.is_empty() {
                let _ = writeln!(
                    out,
                    "            <line number=\"{line}\" hits=\"{}\"/>",
                    u8::from(covered)
                );
                continue;
            }
            let taken = alternatives.iter().filter(|branch| branch.taken).count();
            let total = alternatives.len();
            let _ = writeln!(
                out,
                "            <line number=\"{line}\" hits=\"{}\" branch=\"true\" condition-coverage=\"{}% ({taken}/{total})\"/>",
                u8::from(covered),
                (rate(taken, total) * 100.0).round() as u64,
            );
        }
        out.push_str("          </lines>\n        </class>\n");
    }
    out.push_str("      </classes>\n    </package>\n  </packages>\n</coverage>\n");
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::run_view::{
        Applicability, BranchRecord, FileView, FunctionRecord, MetricView, RUN_VIEW_SCHEMA_VERSION,
        RunView,
    };
    use std::collections::BTreeSet;

    fn metric(metric: Metric, covered: usize, eligible: usize) -> MetricView {
        MetricView {
            metric,
            covered,
            eligible,
            applicability: if eligible == 0 {
                Applicability::NotApplicable
            } else {
                Applicability::Measured
            },
        }
    }

    fn fixture() -> RunView {
        RunView {
            schema_version: RUN_VIEW_SCHEMA_VERSION,
            run: "run_1".into(),
            generated_at: "now".into(),
            suite_passed: true,
            stale: false,
            stale_reasons: Vec::new(),
            complete: true,
            limitations: Vec::new(),
            totals: vec![
                metric(Metric::Lines, 3, 4),
                metric(Metric::Branches, 1, 2),
                metric(Metric::Functions, 1, 1),
            ],
            files: vec![FileView {
                file: "src/a & b.ts".into(),
                metrics: vec![
                    metric(Metric::Lines, 3, 4),
                    metric(Metric::Branches, 1, 2),
                    metric(Metric::Functions, 1, 1),
                ],
                measured_lines: vec![1, 2, 3, 4],
                uncovered_lines: vec![4],
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: vec![FunctionRecord {
                    line: 1,
                    name: "run".into(),
                    covered: true,
                }],
                branches: vec![
                    BranchRecord {
                        line: 2,
                        block: 0,
                        index: 0,
                        taken: true,
                    },
                    BranchRecord {
                        line: 2,
                        block: 0,
                        index: 1,
                        taken: false,
                    },
                ],
            }],
            source_neighbourhoods: BTreeSet::new(),
        }
    }

    #[test]
    fn an_lcov_tracefile_states_hit_or_not_hit_and_never_a_frequency() {
        // Supercov records that a line ran, not how often. A consumer displays
        // `DA:` counts as execution frequencies, so writing anything above 1
        // would publish a number no measurement supports.
        let text = lcov(&fixture());
        assert!(text.contains("SF:src/a & b.ts\n"), "{text}");
        assert!(
            text.contains("DA:1,1\n") && text.contains("DA:4,0\n"),
            "{text}"
        );
        assert!(
            text.lines().all(|line| !line.starts_with("DA:")
                || line.ends_with(",1")
                || line.ends_with(",0"))
        );
        assert!(text.contains("FNDA:1,run\n"), "{text}");
        // An untaken branch is `-`, which readers distinguish from zero.
        assert!(
            text.contains("BRDA:2,0,0,1\n") && text.contains("BRDA:2,0,1,-\n"),
            "{text}"
        );
        assert!(text.contains("LF:4\nLH:3\n"), "{text}");
        assert!(text.contains("BRF:2\nBRH:1\n"), "{text}");
        assert!(text.ends_with("end_of_record\n"));
    }

    #[test]
    fn lcov_records_keep_the_order_readers_parse_them_in() {
        // geninfo defines the sequence, and readers rely on it: a tracefile
        // whose counters precede the records they summarise is accepted by
        // some parsers and silently mis-read by others.
        let text = lcov(&fixture());
        let rank = |line: &str| match line.split(':').next().unwrap_or("") {
            "TN" => 0,
            "SF" => 1,
            "FN" => 2,
            "FNDA" => 3,
            "FNF" => 4,
            "FNH" => 5,
            "BRDA" => 6,
            "BRF" => 7,
            "BRH" => 8,
            "DA" => 9,
            "LF" => 10,
            "LH" => 11,
            _ => 12,
        };
        for record in text
            .split("end_of_record\n")
            .filter(|r| !r.trim().is_empty())
        {
            let ranks = record
                .trim()
                .lines()
                .map(rank)
                .filter(|rank| *rank < 12)
                .collect::<Vec<_>>();
            let mut sorted = ranks.clone();
            sorted.sort_unstable();
            assert_eq!(ranks, sorted, "out of order:\n{record}");
        }
    }

    #[test]
    fn totals_in_an_export_match_the_run_view_they_came_from() {
        // The whole point of exporting from the shared view: a consumer's
        // percentage has to be the one the gate enforced.
        let view = fixture();
        let text = lcov(&view);
        let found: usize = text
            .lines()
            .filter_map(|line| line.strip_prefix("LF:")?.parse::<usize>().ok())
            .sum();
        let hit: usize = text
            .lines()
            .filter_map(|line| line.strip_prefix("LH:")?.parse::<usize>().ok())
            .sum();
        assert_eq!((hit, found), counts(&view, Metric::Lines));

        let xml = cobertura(&view, 0);
        assert!(
            xml.contains("lines-covered=\"3\" lines-valid=\"4\""),
            "{xml}"
        );
        assert!(
            xml.contains("branches-covered=\"1\" branches-valid=\"2\""),
            "{xml}"
        );
        assert!(xml.contains("line-rate=\"0.7500\""), "{xml}");
    }

    #[test]
    fn cobertura_escapes_markup_and_keeps_paths_relative() {
        // A filename carrying `&` or `<` would otherwise produce a document no
        // reader can parse, and an absolute path would leak this machine's
        // layout into a shared artifact.
        let xml_text = cobertura(&fixture(), 1_700_000_000);
        assert!(
            xml_text.contains("filename=\"src/a &amp; b.ts\""),
            "{xml_text}"
        );
        assert!(!xml_text.contains(" & "), "raw ampersand survived");
        assert!(xml_text.contains("<source>.</source>"));
        assert!(xml_text.starts_with("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"));
        // A branching line carries its condition detail; a plain line does not.
        assert!(
            xml_text.contains(
                "<line number=\"2\" hits=\"1\" branch=\"true\" condition-coverage=\"50% (1/2)\"/>"
            ),
            "{xml_text}"
        );
        assert!(
            xml_text.contains("<line number=\"1\" hits=\"1\"/>"),
            "{xml_text}"
        );
        assert_eq!(
            xml("a\u{0}b"),
            "ab",
            "unencodable control bytes are dropped"
        );
    }

    #[test]
    fn an_empty_denominator_does_not_become_a_zero_rate() {
        // Cobertura has no "not applicable", and reporting 0% for a file with
        // no branches would look like a regression that never happened.
        assert_eq!(rate(0, 0), 1.0);
        let mut view = fixture();
        view.files[0].branches.clear();
        view.files[0].metrics = vec![metric(Metric::Lines, 3, 4), metric(Metric::Branches, 0, 0)];
        let xml_text = cobertura(&view, 0);
        assert!(xml_text.contains("branch-rate=\"1.0000\""), "{xml_text}");
    }
}
