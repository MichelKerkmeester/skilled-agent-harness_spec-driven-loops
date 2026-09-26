//! A static HTML report: one file, no network, no service.
//!
//! The point of this report is not a percentage -- the CLI already prints
//! that. It is to let a person trace a missing obligation to the line that
//! carries it, offline, from a CI artifact they downloaded.
//!
//! It is a single self-contained document on purpose. A copied artifact works
//! with no server and no network; there is nothing to fetch from a CDN; and
//! because a source file's path is never used as an output path, a filename
//! carrying `../` cannot write anywhere.
//!
//! Four states are kept distinct, because collapsing them into one red/green
//! score is how a report starts lying: *uncovered* (measured, nothing reached
//! it), *not applicable* (nothing eligible), *unmeasured* (Supercov declined
//! the obligation) and *stale* (the run no longer matches the checkout).

use std::collections::BTreeMap;
use std::fmt::Write as _;

use crate::run_view::{Applicability, Metric, RunView};

/// Escape text for HTML character data and quoted attribute values.
fn escape(value: &str) -> String {
    let mut out = String::with_capacity(value.len());
    for character in value.chars() {
        match character {
            '&' => out.push_str("&amp;"),
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            c => out.push(c),
        }
    }
    out
}

/// Escape a JSON document for embedding inside a `<script>` element.
///
/// A source file containing `</script>` would otherwise close the element and
/// let the rest of that file be parsed as markup -- the project's own code
/// becoming the report's HTML.
fn embed_json(value: &str) -> String {
    value
        .replace('<', "\\u003c")
        .replace('>', "\\u003e")
        .replace('&', "\\u0026")
        .replace('\u{2028}', "\\u2028")
        .replace('\u{2029}', "\\u2029")
}

fn percentage(covered: usize, eligible: usize) -> String {
    if eligible == 0 {
        return "n/a".into();
    }
    format!("{:.2}%", covered as f64 * 100.0 / eligible as f64)
}

fn state_label(applicability: &Applicability) -> &'static str {
    match applicability {
        Applicability::Measured => "measured",
        Applicability::NotApplicable => "not applicable",
        Applicability::Incomplete { .. } => "partly measured",
    }
}

const STYLE: &str = r##"
:root{--bg:#fff;--fg:#1b1b1b;--muted:#5a5a5a;--line:#d8d8d8;--hit:#e6f4ea;--miss:#fdecea;--panel:#f7f7f7;--accent:#0b5fff}
@media (prefers-color-scheme:dark){:root{--bg:#15171a;--fg:#e8e8e8;--muted:#a6a6a6;--line:#33373d;--hit:#16301f;--miss:#3a1d1b;--panel:#1c1f23;--accent:#7aa2ff}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
main{max-width:72rem;margin:0 auto;padding:1.5rem}
h1{font-size:1.3rem;margin:0 0 .25rem}
.sub{color:var(--muted);margin:0 0 1.25rem}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:.75rem;margin-bottom:1.5rem}
.card{border:1px solid var(--line);border-radius:.5rem;padding:.75rem;background:var(--panel)}
.card .n{font-size:1.5rem;font-weight:600}
.card .m{color:var(--muted);font-size:.85rem}
table{border-collapse:collapse;width:100%}
th,td{text-align:left;padding:.4rem .6rem;border-bottom:1px solid var(--line)}
th{cursor:pointer;user-select:none;background:var(--panel)}
th[aria-sort=ascending]::after{content:" \25B2"}
th[aria-sort=descending]::after{content:" \25BC"}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
a{color:var(--accent)}
.flag{font-size:.75rem;border:1px solid var(--line);border-radius:.25rem;padding:0 .3rem;color:var(--muted)}
.controls{display:flex;gap:.75rem;align-items:center;margin-bottom:.75rem;flex-wrap:wrap}
input[type=search]{padding:.35rem .5rem;border:1px solid var(--line);border-radius:.35rem;background:var(--bg);color:var(--fg);min-width:16rem}
pre{margin:0;overflow-x:auto}
.src{border:1px solid var(--line);border-radius:.5rem;overflow:hidden}
.row{display:grid;grid-template-columns:4rem 5.5rem 1fr;gap:0;border-bottom:1px solid var(--line)}
.row:last-child{border-bottom:0}
.row.hit{background:var(--hit)}
.row.miss{background:var(--miss)}
.row .ln{color:var(--muted);text-align:right;padding:.1rem .5rem;font-variant-numeric:tabular-nums}
.row .mk{color:var(--muted);padding:.1rem .5rem;white-space:nowrap;font-size:.8rem}
.row code{padding:.1rem .5rem;white-space:pre;font:12.5px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace}
.note{border-left:3px solid var(--accent);background:var(--panel);padding:.6rem .8rem;margin:1rem 0;border-radius:0 .35rem .35rem 0}
.warn{border-left-color:#c9791a}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
"##;

const SCRIPT: &str = r##"
const data = JSON.parse(document.getElementById('supercov-data').textContent);
const files = data.files;
const escape = (value) => String(value).replace(/[&<>"']/g, (c) =>
  ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pct = (c, e) => e === 0 ? 'n/a' : (c * 100 / e).toFixed(2) + '%';
const metric = (file, name) => (file.metrics || []).find((m) => m.metric === name);
let sort = { key: 'file', dir: 1 };

function rows() {
  const term = document.getElementById('filter').value.trim().toLowerCase();
  const onlyGaps = document.getElementById('gaps').checked;
  let shown = files.filter((f) => f.file.toLowerCase().includes(term));
  if (onlyGaps) shown = shown.filter((f) => f.uncoveredLines.length || f.missingBranches.length || f.missingConditions.length);
  shown.sort((a, b) => {
    const pick = (f) => {
      if (sort.key === 'file') return f.file;
      const m = metric(f, sort.key);
      return m && m.eligible ? m.covered / m.eligible : -1;
    };
    const x = pick(a), y = pick(b);
    return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
  });
  document.getElementById('rows').innerHTML = shown.map((f) => {
    const cell = (name) => {
      const m = metric(f, name);
      if (!m || m.eligible === 0) return '<td class="num"><span class="flag">n/a</span></td>';
      return `<td class="num">${pct(m.covered, m.eligible)} <span class="flag">${m.covered}/${m.eligible}</span></td>`;
    };
    return `<tr><td><a href="#${encodeURIComponent(f.file)}" data-file="${escape(f.file)}">${escape(f.file)}</a></td>`
      + cell('lines') + cell('branches') + cell('mcdc') + '</tr>';
  }).join('') || '<tr><td colspan="4">No files match.</td></tr>';
  document.getElementById('count').textContent = `${shown.length} of ${files.length} file(s)`;
}

function showFile(path) {
  const file = files.find((f) => f.file === path);
  const panel = document.getElementById('source');
  if (!file) { panel.innerHTML = ''; return; }
  const uncovered = new Set(file.uncoveredLines);
  const measured = new Set(file.measuredLines);
  const branchAt = {}, conditionAt = {};
  for (const at of file.missingBranches) branchAt[at.line] = (branchAt[at.line] || 0) + 1;
  for (const at of file.missingConditions) conditionAt[at.line] = (conditionAt[at.line] || 0) + 1;
  const text = data.sources[path];
  let body;
  if (typeof text !== 'string') {
    body = `<p class="note warn">Source is not embedded for this file, so only line numbers are shown. ${escape(data.sourceReason || '')}</p>`
      + '<ul>' + file.uncoveredLines.map((l) => `<li>line ${l} not covered</li>`).join('') + '</ul>';
  } else {
    body = '<div class="src">' + text.split('\n').map((line, index) => {
      const number = index + 1;
      const marks = [];
      if (measured.has(number)) marks.push(uncovered.has(number) ? 'not covered' : 'covered');
      if (branchAt[number]) marks.push(`${branchAt[number]} branch gap`);
      if (conditionAt[number]) marks.push(`${conditionAt[number]} MC/DC gap`);
      const cls = !measured.has(number) ? '' : uncovered.has(number) ? 'miss' : 'hit';
      const mark = !measured.has(number) ? '' : uncovered.has(number) ? '\u2717' : '\u2713';
      return `<div class="row ${cls}" id="${encodeURIComponent(path)}:${number}">`
        + `<span class="ln">${number}</span>`
        + `<span class="mk">${mark ? mark + ' ' : ''}${escape(marks.join(', '))}</span>`
        + `<code>${escape(line) || '&nbsp;'}</code></div>`;
    }).join('') + '</div>';
  }
  panel.innerHTML = `<h2>${escape(path)}</h2>` + body;
  panel.scrollIntoView({ block: 'start' });
}

function route() {
  const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
  const [path] = hash.split(/:(?=\d+$)/);
  if (path) showFile(path);
}

document.getElementById('filter').addEventListener('input', rows);
document.getElementById('gaps').addEventListener('change', rows);
for (const th of document.querySelectorAll('th[data-key]')) {
  const apply = () => {
    const key = th.dataset.key;
    sort = { key, dir: sort.key === key ? -sort.dir : 1 };
    for (const other of document.querySelectorAll('th[data-key]')) other.removeAttribute('aria-sort');
    th.setAttribute('aria-sort', sort.dir === 1 ? 'ascending' : 'descending');
    rows();
  };
  th.addEventListener('click', apply);
  th.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); apply(); }
  });
}
// Open the file directly as well as through the hash. A deep link still
// works, but the report must not depend on hash navigation behaving the same
// way in every context an artifact gets opened from.
document.getElementById('rows').addEventListener('click', (event) => {
  const link = event.target.closest('a[data-file]');
  if (!link) return;
  event.preventDefault();
  const path = link.dataset.file;
  history.replaceState(null, '', '#' + encodeURIComponent(path));
  showFile(path);
});
window.addEventListener('hashchange', route);
rows();
route();
"##;

/// Render the report. `sources` carries file text only when it was verified to
/// match the run; a file absent from it is shown by line number instead of
/// annotated against source that may have moved.
pub fn html(view: &RunView, sources: &BTreeMap<String, String>, source_reason: &str) -> String {
    let payload = serde_json::json!({
        "files": view.files,
        "sources": sources,
        "sourceReason": source_reason,
    });
    let payload = embed_json(&serde_json::to_string(&payload).unwrap_or_else(|_| "{}".into()));

    let mut cards = String::new();
    for metric in Metric::ALL {
        let Some(counts) = view.metric(metric) else {
            continue;
        };
        let _ = write!(
            cards,
            "<div class=\"card\"><div class=\"n\">{}</div><div class=\"m\">{} &middot; {}/{} &middot; {}</div></div>",
            escape(&percentage(counts.covered, counts.eligible)),
            escape(metric.name()),
            counts.covered,
            counts.eligible,
            escape(state_label(&counts.applicability)),
        );
    }

    let mut notes = String::new();
    if !view.suite_passed {
        notes.push_str("<p class=\"note warn\"><strong>The test command did not pass.</strong> These numbers describe the run that failed; they are not a statement that the project is covered.</p>");
    }
    if view.stale {
        let _ = write!(
            notes,
            "<p class=\"note warn\"><strong>This run no longer matches the checkout.</strong> {}</p>",
            escape(&view.stale_reasons.join(", "))
        );
    }
    if !view.complete {
        notes.push_str("<p class=\"note\">Some obligations were not measured exactly. They are excluded from every count here, because a measurement gap is not a coverage gap.</p>");
    }
    for limitation in &view.limitations {
        let _ = write!(notes, "<p class=\"note\">{}</p>", escape(limitation));
    }

    format!(
        r##"<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Coverage {run}</title>
<style>{STYLE}</style>
</head>
<body>
<main>
<h1>Coverage report</h1>
<p class="sub">Run {run} &middot; recorded {generated}</p>
{notes}
<div class="cards">{cards}</div>
<h2>Files</h2>
<div class="controls">
  <label for="filter">Filter files</label>
  <input id="filter" type="search" placeholder="path contains&hellip;">
  <label><input id="gaps" type="checkbox"> Only files with gaps</label>
  <span id="count" class="flag" aria-live="polite"></span>
</div>
<table>
<thead><tr>
<th tabindex="0" data-key="file" aria-sort="ascending" scope="col">File</th>
<th tabindex="0" data-key="lines" class="num" scope="col">Lines</th>
<th tabindex="0" data-key="branches" class="num" scope="col">Branches</th>
<th tabindex="0" data-key="mcdc" class="num" scope="col">MC/DC</th>
</tr></thead>
<tbody id="rows"></tbody>
</table>
<section id="source" aria-live="polite"></section>
</main>
<script id="supercov-data" type="application/json">{payload}</script>
<script>{SCRIPT}</script>
</body>
</html>
"##,
        run = escape(&view.run),
        generated = escape(&view.generated_at),
    )
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::run_view::{FileView, MetricView, RUN_VIEW_SCHEMA_VERSION, RunView};
    use std::collections::BTreeSet;

    fn view() -> RunView {
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
                MetricView {
                    metric: Metric::Lines,
                    covered: 1,
                    eligible: 2,
                    applicability: Applicability::Measured,
                },
                MetricView {
                    metric: Metric::Mcdc,
                    covered: 0,
                    eligible: 0,
                    applicability: Applicability::NotApplicable,
                },
            ],
            files: vec![FileView {
                file: "src/<script>.ts".into(),
                metrics: vec![MetricView {
                    metric: Metric::Lines,
                    covered: 1,
                    eligible: 2,
                    applicability: Applicability::Measured,
                }],
                measured_lines: vec![1, 2],
                uncovered_lines: vec![2],
                missing_branches: Vec::new(),
                missing_conditions: Vec::new(),
                functions: Vec::new(),
                branches: Vec::new(),
            }],
            source_neighbourhoods: BTreeSet::new(),
        }
    }

    #[test]
    fn project_source_can_never_become_the_report_s_own_markup() {
        // A file containing `</script>` would otherwise close the data island
        // and have the rest of the project's code parsed as HTML.
        let mut sources = BTreeMap::new();
        sources.insert(
            "src/<script>.ts".to_owned(),
            "const a = '</script><img src=x onerror=alert(1)>'\n".to_owned(),
        );
        let text = html(&view(), &sources, "");
        let island = text
            .split("<script id=\"supercov-data\" type=\"application/json\">")
            .nth(1)
            .and_then(|rest| rest.split("</script>").next())
            .expect("data island");
        assert!(
            !island.contains("</script"),
            "the island can be closed early"
        );
        assert!(
            !island.contains('<') && !island.contains('>'),
            "raw markup survived"
        );
        assert!(island.contains("\\u003c/script\\u003e"), "{island}");
        // The filename reaches the visible document only escaped.
        let body = text.split("<script id=").next().expect("body");
        assert!(
            !body.contains("src/<script>"),
            "an unescaped filename reached the page"
        );
    }

    #[test]
    fn the_report_is_self_contained_and_fetches_nothing() {
        // It has to open from a copied CI artifact with no network at all.
        // The check is on the document, not the whole file: a project's own
        // source legitimately contains URLs, and embedding it must not make
        // this test pass or fail for the wrong reason.
        let mut sources = BTreeMap::new();
        sources.insert(
            "src/<script>.ts".to_owned(),
            "const endpoint = 'https://example.test/api'\n".to_owned(),
        );
        let text = html(&view(), &sources, "");
        let island = "<script id=\"supercov-data\" type=\"application/json\">";
        let start = text.find(island).expect("data island");
        let end = text[start..].find("</script>").expect("island end") + start;
        let document = format!("{}{}", &text[..start], &text[end..]);
        for remote in [
            "src=\"http",
            "href=\"http",
            "<link",
            "@import",
            "//cdn",
            "fetch(",
            "XMLHttpRequest",
        ] {
            assert!(
                !document.contains(remote),
                "{remote} appears in the document"
            );
        }
        assert!(text.contains("<style>") && text.contains("<script>"));
    }

    #[test]
    fn distinct_states_are_never_collapsed_into_one_score() {
        // "nothing eligible" must not read as complete, and a failed or stale
        // run must say so beside its numbers rather than presenting them as a
        // verdict on the project.
        let text = html(&view(), &BTreeMap::new(), "");
        assert!(text.contains("not applicable"), "{text}");
        assert!(text.contains("measured"));

        let mut broken = view();
        broken.suite_passed = false;
        broken.stale = true;
        broken.stale_reasons = vec!["instrumented source changed".into()];
        broken.complete = false;
        let text = html(&broken, &BTreeMap::new(), "");
        assert!(text.contains("The test command did not pass"));
        assert!(text.contains("no longer matches the checkout"));
        assert!(text.contains("instrumented source changed"));
        assert!(text.contains("a measurement gap is not a coverage gap"));
    }

    #[test]
    fn coverage_is_marked_by_glyph_and_words_not_colour_alone() {
        // Colour cannot be the only carrier: the source view labels each line
        // covered or not covered in text, with a tick or cross beside it.
        assert!(SCRIPT.contains("'covered'") && SCRIPT.contains("'not covered'"));
        assert!(SCRIPT.contains("\\u2713") && SCRIPT.contains("\\u2717"));
        // Sortable headers are reachable and announce their state.
        assert!(STYLE.contains(":focus-visible"));
        let text = html(&view(), &BTreeMap::new(), "");
        assert!(text.contains("tabindex=\"0\"") && text.contains("aria-sort"));
        assert!(STYLE.contains("prefers-color-scheme:dark"));
    }
}
