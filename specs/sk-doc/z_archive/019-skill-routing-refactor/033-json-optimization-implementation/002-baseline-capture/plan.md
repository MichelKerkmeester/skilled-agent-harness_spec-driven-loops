---
title: "Baseline Capture Plan: Routing Baseline Capture"
description: "Read-only measurement plan: pin corpus hashes, run both existing top-1 scorers, add a phase-scoped top-3 capture, validate all skill roots, and record one baseline artifact — before any gate/delete/migration/rewire phase in the JSON optimization implementation program runs."
trigger_phrases:
  - "routing baseline capture plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture"
    last_updated_at: "2026-07-29T10:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Captured pinned routing baseline; 11/11 compiler pass"
    next_safe_action: "Later phases gate against baseline/routing-baseline.json"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-baseline-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Baseline Capture Plan: Routing Baseline Capture

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a read-only measurement pass over the routing-accuracy corpus and the skill-root metadata fleet, then record one hash-pinned artifact under this phase's own folder. Pin exact SHA-256 hashes for the three corpus files as they exist at capture time; run both existing top-1 scorers (`score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`) verbatim; add a small, additive, phase-scoped script to compute the top-3 metric that does not exist anywhere in the codebase today; run `skill_graph_compiler.py --validate-only` across every current skill root and confirm `key_files`/`source_docs` path existence; record the discrepancy against the two contradictory checked-in sources. No production file is modified — the deliverable is the artifact.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Hash integrity | Recorded SHA-256 for each corpus file matches an independent `shasum -a 256` re-run at verification time |
| Row-count integrity | Recorded row counts match an independent `wc -l` re-run; any mismatch vs. the numbers this spec cites (195/72/24) is logged, not silently overwritten |
| Existing top-1 fidelity | `score-routing-corpus.py` and `capture-scorer-eval-baseline.mjs` output captured verbatim (no manual transcription, no rounding beyond what the scripts themselves emit) |
| New top-3 correctness | The phase-scoped top-3 script is checked against a handful of known top-1 cases (a top-1 correct case must also be top-3 correct) before its output is trusted |
| Compiler pass | `skill_graph_compiler.py --validate-only` exits 0 with "VALIDATION PASSED" across every currently discovered root |
| Zero collateral writes | `git status` after capture shows changes only under `002-baseline-capture/` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No production components are touched. This is a read-only measurement pipeline that writes exactly one output artifact:

| Stage | Reads | Writes |
|-------|-------|--------|
| Hash pin | `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` | Nothing (hashes computed and recorded, files untouched) |
| Existing top-1 capture | `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`, the built `dist/mcp-server` scorer | Nothing (both scripts run without their `--write`/`--out` flags pointed at production paths) |
| New top-3 capture | The built scorer's ranked recommendation list, called from a script that lives only in this phase folder (`002-baseline-capture/scripts/`) | Nothing outside this phase folder |
| Compiler validation | `skill_graph_compiler.py --validate-only`, every root's `graph-metadata.json` | Nothing (`--validate-only` never reaches the `--export-json` write path) |
| Assembly | All of the above stdout/JSON | One artifact: `002-baseline-capture/baseline/routing-baseline.json` |

The phase-scoped top-3 script is the only new code this phase introduces, and it lives entirely under this phase's own folder rather than in `system-skill-advisor/mcp-server/scripts/routing-accuracy/` — so "no production code changes" holds even though a top-3 measurement did not previously exist anywhere.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Enumerate the current skill roots by the same rule `skill_graph_compiler.py`'s `discover_graph_metadata()` uses (top-level `.opencode/skills/*/graph-metadata.json`, skipping `scripts/`) and record the roster before running anything. Verify `dist/mcp-server` is rebuilt and current so `capture-scorer-eval-baseline.mjs`'s dynamic imports reflect live scorer code, not a stale build. Compute independent `wc -l` and `shasum -a 256` readings for the three corpus files as the capture-time ground truth. Read `score-routing-corpus.py --help`, `capture-scorer-eval-baseline.mjs`'s usage comment, and `skill_graph_compiler.py --validate-only`'s CLI flags before invoking any of them.

### Phase 2: Baseline capture

Run `score-routing-corpus.py --dataset labeled-prompts.jsonl` and capture its full JSON report (gate3 precision/recall/F1, advisor top-1 accuracy, joint TT/TF/FT/FF matrix) verbatim. Run `capture-scorer-eval-baseline.mjs` without `--write` and capture its full_corpus_top1/holdout_top1/ambiguity_top1/bucket JSON verbatim. Write the phase-scoped top-3 script: it loads the same built scorer functions the existing scripts use, runs every labeled-corpus and holdout prompt through the ranked recommendation path (not just the top pick), and records correct/total/accuracy for "gold label appears in the top 3 ranked skills" against corpus and holdout. Run `skill_graph_compiler.py --validate-only` from the repo root and capture its stdout (discovered-file count, VALIDATION PASSED/FAILED, any per-root error lines) verbatim — this exercises the `derived.key_files`/`derived.source_docs` path-existence checks (`skill_graph_compiler.py:346-369`) for every root in one pass.

### Phase 3: Assembly and cross-check

Assemble all captured output into one JSON artifact under `002-baseline-capture/baseline/`, including the pinned hashes, row counts, git HEAD short SHA, and capture timestamp. Cross-check the recorded hashes/row-counts against a second, independent re-run of `shasum -a 256`/`wc -l` before accepting the artifact as final. Diff the freshly captured numbers against `scorer-eval-baseline.json` (stale, `capturedAt` 2026-07-17) and against `validation-baselines.md:49-50`'s cited 80.5%/77.5% (sourced from the nonexistent `corpus.vitest.ts`/`holdout.vitest.ts`), and record both deltas explicitly in the artifact rather than picking a winner. Confirm via `git status` that no file outside `002-baseline-capture/` changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The capture run itself is the test: every number in the artifact is produced by executing the real corpus through the real, currently-built scorer and compiler — nothing is estimated or copied from a prior source. Three specific checks close the loop: (1) the new top-3 script is sanity-checked against a handful of known top-1-correct rows before its output is trusted, since a top-1 correct prediction must also be top-3 correct — a violation would mean the top-3 script's ranking logic is wrong, not the scorer; (2) recorded hashes and row counts are cross-checked by an independent second pass in Phase 3, so a transcription error cannot silently ship as the new baseline; (3) `skill_graph_compiler.py --validate-only`'s exit code and discovered-root count are checked against the independently-enumerated roster from Phase 1, so a root silently missing `graph-metadata.json` cannot be miscounted as "passing." No application test suite applies since no runtime behavior changes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`system-skill-advisor/mcp-server/scripts/routing-accuracy/` (corpus files, `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`); `system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py`; a current `dist/mcp-server` build; `git` for HEAD SHA and post-capture `git status` verification; `shasum`/`wc` for the independent hash and row-count cross-check.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Everything this phase produces is additive and confined to `002-baseline-capture/` (the artifact under `baseline/` and the phase-scoped top-3 script under `scripts/`). Nothing outside this phase folder is modified — no corpus `.jsonl`, no `scorer-eval-baseline.json`, no `validation-baselines.md`, no production script under `mcp-server/`, no `graph-metadata.json`. Rollback is deleting this phase folder's `baseline/` and `scripts/` subfolders; nothing elsewhere needs reverting because nothing elsewhere was touched. This phase is high-blast in consequence rather than in mechanism: because every later 030 phase gates its "did routing regress" checks against this artifact, a wrong or stale capture here would propagate silently downstream. The mitigation is procedural, not code-based — if the captured baseline is later found wrong or the corpus has drifted again, the correct action is a fresh re-capture under this same phase's process, never a hand-edit of the recorded numbers.
<!-- /ANCHOR:rollback -->
