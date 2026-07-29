---
title: "Feature Specification: Routing Baseline Capture"
description: "Pin an exact, hash-verified routing-accuracy baseline (top-1 and top-3, corpus + holdout + ambiguity) and confirm all 11 current skill roots pass skill_graph_compiler.py, before any gate/delete/migration/rewire phase in the JSON optimization implementation program touches production files."
trigger_phrases:
  - "routing baseline capture"
  - "pin routing accuracy corpus hash"
  - "skill graph compiler validate baseline"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/002-baseline-capture"
    last_updated_at: "2026-07-29T10:51:16Z"
    last_updated_by: "claude-code"
    recent_action: "Captured pinned routing baseline; 11/11 compiler pass"
    next_safe_action: "Later phases gate against baseline/routing-baseline.json"
    blockers: []
    key_files:
      - "spec.md"
      - "../029-skill-json-optimization-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-baseline-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which of the two contradictory checked-in baseline sources becomes canonical after this capture?"
      - "Does the new top-3 capture script graduate into a permanent routing-accuracy/ addition in a later phase?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Routing Baseline Capture

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 029 research program's Tier-1 opportunity map (O1-O4) and Tier-2/3 items assume every later 030 phase can measure "did this change regress routing" against a trustworthy number. That number does not exist today. Three checked-in sources disagree: `scorer-eval-baseline.json` records `full_corpus_top1` 155/200 (77.5%) and `holdout_top1` 57/78 (73.08%) captured 2026-07-17 against SHA `37ebd31720`; `references/scoring/validation-baselines.md:49-50` instead cites 80.5% full-corpus / 77.5% holdout, sourced from `mcp-server/tests/scorer/corpus.vitest.ts` and `holdout.vitest.ts` — files that do not exist in the repository (confirmed via direct file check, both paths return "No such file or directory"). Worse, the corpus files those numbers were supposedly measured against have since been edited: `labeled-prompts.jsonl` and `holdout-prompts.jsonl` were both modified 2026-07-27 (git commit `5a2aab0d37b`), and their current row counts (195 and 72 respectively, confirmed via `wc -l`) no longer match the totals baked into the stale JSON (200 and 78). No script in the corpus computes a top-3 metric at all (confirmed by grepping every `.py`/`.mjs` file under `routing-accuracy/` for `top.?3`/`top_k`/`topK` — zero matches), so "top-3" is not a number that exists anywhere today; it must be produced fresh. Building any O1-O11 fix on top of this is building on sand: a regression could ship unnoticed because the "baseline" it is compared against is already wrong. This phase produces one hash-pinned, freshly-recomputed baseline artifact and touches nothing else, so every later 030 phase has a single non-contradictory number to gate against.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — a read-only measurement pass over `system-skill-advisor/mcp-server/scripts/routing-accuracy/` (`labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`, `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`, `scorer-eval-baseline.json`) and `skill_graph_compiler.py --validate-only` run against every current skill root; pinning exact SHA-256 hashes for the three corpus files at capture time; recording current top-1 (via the two existing scorers) and a newly-computed top-3 (via a small additive, read-only script scoped entirely to this phase folder); recording pass/fail of the compiler's `derived.key_files`/`derived.source_docs` path-existence checks across all roots; recording the discrepancy between the stale checked-in sources and the freshly measured numbers; writing one baseline artifact under this phase folder.

Out of scope — fixing, editing, or reconciling `scorer-eval-baseline.json`, `validation-baselines.md`, or any corpus `.jsonl` file (that is a later 030 phase's job once the discrepancy is on record); implementing any O1-O11 opportunity from the 029 research; wiring the compiler or `score-routing-corpus.py` into CI (O4, a later phase); changing the `derived` schema, the scorer, or any production script under `mcp-server/`; adding the new top-3 capability to the production `routing-accuracy/` tree (it stays scoped to this phase folder unless a later phase promotes it).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pin an exact, byte-verified hash for each corpus file at capture time | Baseline artifact records `sha256` (via `shasum -a 256`) for `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl`, plus their row counts (`wc -l`); a later re-run with any one file changed must produce a different hash and be treated as a stale baseline, not silently reused |
| REQ-002 | Capture current top-1 accuracy via both existing scorers | `score-routing-corpus.py --dataset labeled-prompts.jsonl` and `capture-scorer-eval-baseline.mjs` (no `--write`) both run to completion; their full stdout JSON (gate3/advisor/joint metrics; full_corpus_top1/holdout_top1/ambiguity_top1/bucket metrics) is captured verbatim into the baseline artifact under the REQ-001 hash |
| REQ-003 | Capture top-3 accuracy, which no existing script computes | A new script scoped to this phase folder (never written into `mcp-server/scripts/`) reads the scorer's ranked recommendation list (`scoreAdvisorPrompt().recommendations` or Python `analyze_prompt()`), checks whether the gold `skill_top_1` label appears in the top 3 ranked skills, and records correct/total/accuracy for the full corpus and the holdout set into the same artifact |
| REQ-004 | Confirm all current skill roots pass `skill_graph_compiler.py --validate-only`, including `key_files`/`source_docs` path existence | `python3 skill_graph_compiler.py --validate-only` is run from the repo root; exit code 0 and "VALIDATION PASSED" recorded verbatim; the roster of roots it discovered (via top-level `graph-metadata.json` presence under `.opencode/skills/`) is recorded and must match the independently-enumerated roster (currently `cli-external-orchestration`, `mcp-code-mode`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-git`, `sk-prompt`, `system-deep-loop`, `system-skill-advisor`, `system-spec-kit` — 11 roots) |
| REQ-005 | Flag the pre-existing contradiction between checked-in baseline sources without silently resolving it | The artifact records, side by side: (a) `scorer-eval-baseline.json`'s stale numbers and its `capturedAt`/`capturedAtSha`, (b) `validation-baselines.md:49-50`'s cited 80.5%/77.5% and its dangling citation to two nonexistent test files, (c) the freshly recomputed live numbers from REQ-002/REQ-003; no source file outside this phase folder is edited to resolve the contradiction |
| REQ-006 | Deliver exactly one baseline artifact and no other change | A single new artifact file is added under `002-baseline-capture/baseline/`; `git status` after capture shows changes only under this phase folder — no file under `mcp-server/`, `routing-accuracy/`, or any `.opencode/skills/*/graph-metadata.json` is modified |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

A single JSON artifact exists under this phase's `baseline/` folder recording: pinned SHA-256 hashes and row counts for all three corpus files; verbatim top-1 output from both existing scorers; a freshly computed top-3 metric for corpus and holdout (a number that did not previously exist); a clean 11/11 pass of `skill_graph_compiler.py --validate-only` including `key_files`/`source_docs` path existence; an explicit, evidenced record of the contradiction between `scorer-eval-baseline.json` and `validation-baselines.md`. No file outside `002-baseline-capture/` is modified. Every later phase in `033-json-optimization-implementation` that needs to answer "did routing accuracy regress" cites this artifact instead of either stale source.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | The corpus files were edited as recently as 2026-07-27 and could be edited again before this phase runs | Hash pin is captured at run time, not assumed from this spec; any drift between the hash recorded here and the corpus present at capture time invalidates the plan's stated row counts and forces a documented re-check, not a silent reuse of stale numbers |
| Risk | Top-3 has no existing instrumentation anywhere in the codebase | New script stays additive and read-only, scoped to this phase folder, imports only the existing built scorer functions (`dist/mcp-server`) — it never edits `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`, or the scorer itself |
| Risk | `capture-scorer-eval-baseline.mjs` dynamically imports `dist/mcp-server/lib/scorer/fusion.js` — a stale build silently measures old scorer code | Verify `dist/mcp-server` is rebuilt/current immediately before capture; record the build state alongside the git HEAD SHA in the artifact |
| Risk | The skill-root count could change (a new root scaffolded) between this spec being written and this phase being built | The plan enumerates roots dynamically at capture time via `skill_graph_compiler.py`'s own discovery, not by hardcoding "11" as a fixed target |
| Dependency | `system-skill-advisor/mcp-server/scripts/routing-accuracy/*` (corpus files, `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`) | Read-only inputs to this phase |
| Dependency | `system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py` | Read-only `--validate-only` invocation |
| Dependency | `dist/mcp-server` build output | Must be current for `capture-scorer-eval-baseline.mjs` to reflect live scorer behavior |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of the two contradictory checked-in sources (`scorer-eval-baseline.json`'s 77.5%/73.08% or `validation-baselines.md`'s cited 80.5%/77.5%) — or the freshly captured number this phase produces — becomes the canonical baseline going forward? This phase records the discrepancy; a later 030 phase (or the operator) decides which is authoritative.
- Should the new top-3 capture script graduate into a permanent addition under `routing-accuracy/` in a later phase (feeding O4's CI-wiring work), or remain a one-off measurement tool retired after this phase closes?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program predecessor**: `../029-skill-json-optimization-research` (the research this program implements)
- **Research evidence cited**: `../029-skill-json-optimization-research/research/research.md` §2 theme 4, §3 O4, §4 "Baseline accuracy numbers"
- **Contradictory sources under study**: `system-skill-advisor/references/scoring/validation-baselines.md`, `system-skill-advisor/mcp-server/scripts/routing-accuracy/scorer-eval-baseline.json`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-derived-authority-decision` |
| **Successor** | `003-derived-regenerator-migration` |
