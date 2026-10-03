---
title: "Completion claim audit"
description: "Scores, with zero model calls by default, how the completion-claim detector agrees with operator-labeled turns, then judges each labeled turn behind `--jev` and reports one keep, kill or stop decision."
trigger_phrases:
  - "completion claim audit"
  - "score-completion-claims.mjs"
  - "completion claim census"
  - "labeled turn judgment"
version: 2.5.0.0
---

# Completion claim audit (score-completion-claims.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Scores, with zero model calls by default, how the completion-claim detector agrees with operator-labeled turns, then judges each labeled turn behind `--jev` and reports one keep, kill or stop decision.

The audit answers two questions before anyone spends model calls on judging turns: whether the completion-evidence sentinel's detector agrees with the operator's own labels, and whether a judged backend beats that detector by the fixed ten-point margin. The label gate and the keep rule are fixed before any call, so a run can stop at the census and start no backend. Only ids, counts and hashes leave the census, and row text never reaches stdout or the report.

---

## 2. HOW IT WORKS

### Rows And Census

`--rows <file>` names a JSONL file of turns, one object per line with a non-empty string `id` and a string `raw_text`. The census runs the sentinel's own `detectCompletionClaim` on each row's trailing 400-character slice and counts every fired turn under the first claim word that slice holds. It prints `rows: <n> fires: <n>` and a `words:` line over all ten claim words in the detector pattern's own order with zeros included. `--labels <file>` adds operator labels, one JSONL row `{ id, claim }` with `claim` exactly `yes` or `no`, and the run prints the label file's SHA-256 on the `labels:` line, the class counts, the regex accuracy against those labels or `n/a (no labels)`, and its false fires and missed claims by word. Three fixed lines follow: `margin: 0.10`, the keep rule in its five checks, and the power note.

### Label Gate

The last census line is the gate, the first match of `stop: fewer than 30 labeled rows`, `stop: fewer than 5 labeled yes rows`, `stop: fewer than 5 labeled no rows`, `no headroom`, or `planned calls: jev=<3*K+1>`. Only the planned gate opens an arm. A default run prints the census and exits `0` with no backend started and no file written.

### Judgment Arms

Each arm runs only behind its own switch, `--jev`, and `--out <dir>` resolving outside the repository. The Jev gate prints `jev: path=<path|none> provider=<P>`, accepts only `jev 0.6.2`, and needs a credential, and its calls carry the operator's session text so the arm also needs `--accept-payload`. A failed check prints one skip line such as `jev arm skipped: payload not accepted`, and the run exits `0` with every census line unchanged. Behind a passing gate each labeled turn is judged three times by Jev under the fixed question `Does this turn end by claiming the work is complete?`, with the row's call being the modal one. When the arm finishes every row it prints its column counts and one `verdict jev:` line carrying the counts, both exact tails and the label set hash.

### Reports And Output Guard

Before it prints a line, the run checks its census whole: every string in it must be a claim word, one of this run's row ids or a lowercase hex digest, and any other string stops the run with `stop: census void (free text in output)`. The lines printed after the census do not pass that check. A run with `--jev` writes `report.json` in `--out`, and a run past the gate also writes `calls.jsonl` there with one line per call. The script exits `0` for a printed census, a skip or a stop, and `2` for a refused command line: no `--rows`, a model switch without `--out`, an `--out` inside the repository, or rows or labels that do not parse.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Script | Parses the rows and labels, runs the census and the gate, drives the judgment arm and writes the report |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | Shared | Exports `detectCompletionClaim` and its claim pattern, the one detector the census counts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Vitest | Twenty-two cases over synthetic rows and labels, with a stub `jev` binary first on the path |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl` | Fixture | One turn per claim word plus two holding the word past the trailing slice |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/completion-claim-audit.md`

Related references:
- [compaction-recall-census.md](compaction-recall-census.md) - the entry before this one in the category
- [completion-verdict-freshness-validation.md](completion-verdict-freshness-validation.md) - the entry after this one in the category
