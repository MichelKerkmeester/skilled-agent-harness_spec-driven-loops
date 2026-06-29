---
title: "Implementation Summary: Duplicate Law Detection"
description: "The numeric-law completeness gate now also keeps the index unique: an additive within-index duplicate pass groups rows by their normalized value/range and fails a duplicate re-port, so each already-adopted numeric law registers exactly once. The clean 12-row index still exits 0, completeness still bites a blank cell, and a cross-doc prose scanner stays honestly advisory and out of scope."
trigger_phrases:
  - "duplicate law detection summary"
  - "numeric_law_check duplicate detection"
  - "within-index duplicate law re-port gate"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/013-duplicate-law-detection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped _find_duplicates pass; verified exit 0/1/1/2 with completeness preserved"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Within-index duplicate-row detection on the canonical registry is the deterministic, evergreen reduction of 'reference the owner, not a copy'; a cross-doc prose scanner stays advisory and out of scope"
      - "The duplicate key is the full normalized value/range string, never a single extracted numeral, so an identical restatement is the only thing that can collide"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-duplicate-law-detection |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The numeric-law index promised each already-adopted numeric law exactly one canonical row so modes cite the owner instead of re-copying the value, but nothing kept that promise honest: a second row could re-port an adopted law under a new `law_id` and the gate would wave it through. The completeness gate now also enforces uniqueness. You get a deterministic guard that fails the index when two rows register the same value, which is precisely the "already-adopted laws drift between duplicates" risk the spec named. The clean live index still passes, so the new pass only ever adds a failure reason, never removes one.

This is additive and registry-scoped. One existing file was extended and nothing else was touched: no law row was added or moved, the index content stayed read-only, and the sibling gates (`baseline_rhythm_check.py`, `contrast_check.py`) were left alone.

### Within-index duplicate detection

`_find_duplicates(rows)` is a pure function over the rows the existing parser already produced. For each row it normalizes the `value/range` cell with the file's own `_clean_cell` (strips wrapping backticks), then lowercases and collapses internal whitespace to a single space, then groups rows by that normalized full string. Any group of two or more rows is a duplicate re-port, reported as `{value, law_ids, owners}` so the operator sees both a same-owner restatement and a cross-mode copy. The key is the full normalized `value/range` string, never a single extracted numeral, which is what keeps the pass false-positive-safe: `4.5:1 WCAG AA body text` can only collide with an identical restatement, never with `3:1 ...`.

### Completeness preserved, uniqueness folded into the verdict

`check()` runs completeness first and still bites a blank required cell on its own. The duplicate pass runs after it and folds into the same verdict: `ok = not errors and not missing and not incomplete and not duplicates`. So a duplicate group sets `ok=False` and exit 1 even when every cell is fully populated, and a blanked cell still fails for its own reason. The `--json` payload carries a `duplicates` array beside `incomplete`, mirroring its shape; the human mode prints one `FAIL` line per group naming the shared value and the member `law_id`s, and the PASS line now asserts rows are populated **and** unique.

### The exit matrix

| Index state | Result | Exit |
|-------------|--------|------|
| Clean 12-row index (populated and unique) | PASS | 0 |
| Two rows share one normalized value/range | FAIL, names the value + both `law_id`s | 1 |
| A required cell blanked | FAIL, names the knob + column (completeness preserved) | 1 |
| Usage: no argument / unreadable file | usage error | 2 |

### The false-positive guard, verified on the live index

The 12 seeded rows carry pairwise-distinct `value/range` strings, so the clean index exits 0 with zero duplicate groups. The register motion-budget row (`150-250ms state transitions for Product surfaces`, owner `interface`) normalizes to a distinct value from every motion band (`100-150ms`, `200-300ms`, `300-500ms`, `500-800ms`), so it is never grouped. The intentional register-vs-motion drift caveat stays a caveat, not a false duplicate.

### Enforcement ceiling, stated honestly

The gate proves the canonical index never registers the same numeric law twice. That is the deterministic core of "guard against duplicate re-port." It does not prove that no mode prose anywhere paraphrases an owned value. A scanner that walks arbitrary mode docs for restated numbers was deliberately left advisory and out of scope: it would need a hardcoded list of docs to scan (not evergreen) and would false-positive on legitimate references and on numerals that merely coincide. The split is within-index-duplicate-enforceable, cross-doc-restatement-advisory, matching the research's honest enforcement ceiling.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py` | Modified | Added `_find_duplicates(rows)` (normalized full-string `value/range` key), `_normalized_value` helper, folded `duplicates` into `ok` and the exit code, and wired the `duplicates` field into the human and `--json` output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) extended the single file `numeric_law_check.py` with the duplicate pass, folded it into the verdict, and wired the output. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking, and this summary re-ran the same matrix on scratch copies with the live index untouched: `python3 scripts/numeric_law_check.py numeric_design_laws.md` over the clean 12-row index exits 0 (populated and unique, the register motion-budget row not falsely grouped); a scratch with two rows sharing the normalized value `4.5:1 wcag aa body text` exits 1 with `FAIL - duplicate law value "4.5:1 wcag aa body text" shared by contrast-body-aa, contrast-large-ui-aa`; a scratch with a blanked required cell still exits 1 (`FAIL - contrast-body-aa: blank caveat`), proving completeness was not displaced; a no-argument call exits 2. `python3 -m py_compile scripts/numeric_law_check.py` is clean. An evergreen grep over the modified script returns no `specs/` paths and no packet-phase IDs, and scope is clean: `numeric_design_laws.md`, `baseline_rhythm_check.py`, and `contrast_check.py` are untouched. `validate.sh <folder> --strict` reports the spec-doc rules clean with only the expected generated-metadata residual left for orchestrator regeneration.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Extend the existing completeness gate rather than add a standalone checker | `numeric_law_check.py` is the one docs-benchmark surface over the canonical index, and the index's sibling plan reserved this surface for the duplicate pass; a second checker would re-implement the same parse |
| Key on the full normalized `value/range` string, never a single extracted numeral | A full-string key makes an identical restatement the only thing that can collide, which keeps the pass false-positive-safe; extracting a numeral would group `4.5:1 ...` with any unrelated `4.5` |
| Run completeness first and only add a failure reason | The existing exit contract had to be preserved byte-for-byte, so the duplicate pass folds into `ok` after completeness and never removes an existing bite |
| Reuse the parsed `rows` and the file's own `_clean_cell` normalization | The pass adds no new file read and no dependency, so reverting it restores the prior completeness-only gate exactly |
| Leave a cross-doc prose scanner advisory and out of scope | It would need a non-evergreen hardcoded doc list and would false-positive on legitimate references; the deterministic core is the registry, where "reference the owner, not a copy" reduces to "each value appears once" |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `numeric_law_check.py numeric_design_laws.md` on the clean live index | PASS, exit 0, 12 rows populated and unique |
| Duplicate-bite: scratch with two rows sharing `4.5:1 wcag aa body text` | FAIL, exit 1, `duplicate law value "4.5:1 wcag aa body text" shared by contrast-body-aa, contrast-large-ui-aa` |
| Completeness no-regression: scratch with one required cell blanked | FAIL, exit 1, `contrast-body-aa: blank caveat` (completeness still bites) |
| Usage: no argument | usage error, exit 2 (no false pass) |
| No-false-positive: register motion-budget row (`150-250ms ... Product`, owner `interface`) | Not grouped with any motion band; clean index stays exit 0 |
| `python3 -m py_compile scripts/numeric_law_check.py` | PASS, compile OK, stdlib-only (`json`/`re`/`pathlib`/`sys`/`typing`) |
| Evergreen audit | Grep over the modified script returns no `specs/` paths and no packet-phase IDs |
| Scope audit | Only `numeric_law_check.py` extended; `numeric_design_laws.md` / `baseline_rhythm_check.py` / `contrast_check.py` untouched |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Within-index enforceable, cross-doc advisory.** The gate proves the canonical registry never registers the same numeric law twice. It does not prove that no mode prose anywhere paraphrases an owned value. A scanner over arbitrary mode docs stays advisory and out of scope because it would need a non-evergreen hardcoded doc list and would false-positive on legitimate references.
2. **Exact-restatement key, by design.** The duplicate key is the full normalized `value/range` string, so two rows that mean the same law but phrase the value differently (for example `4.5:1` vs `4.5 to 1`) are not grouped. This is the deliberate trade that keeps the pass false-positive-safe; near-duplicate detection would require fuzzy matching and reintroduce false positives.
3. **Report-only, not auto-dedupe.** The gate names a duplicate re-port and fails; removing the redundant row stays a human edit. The checker never edits, reorders, or de-dupes the index itself.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
