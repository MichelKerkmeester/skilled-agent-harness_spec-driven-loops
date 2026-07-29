---
title: "Checklist: Routing Baseline Capture"
description: "QA checklist for pinning the routing-accuracy corpus hash, capturing top-1/top-3 numbers, and validating all skill roots."
trigger_phrases:
  - "routing baseline capture checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/002-baseline-capture"
    last_updated_at: "2026-07-29T10:53:24Z"
    last_updated_by: "claude-code"
    recent_action: "Captured pinned routing baseline; 11/11 compiler pass"
    next_safe_action: "Later phases gate against baseline/routing-baseline.json"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Routing Baseline Capture

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item carries a command or artifact reference. All items complete: the capture run produced the pinned baseline artifact.

| Priority | Meaning | Rule |
|----------|---------|------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Current corpus row counts confirmed via `wc -l` before any capture runs [evidence: `wc -l labeled-prompts.jsonl holdout-prompts.jsonl ambiguity-prompts.jsonl` output recorded]
- [x] CHK-002 [P1] `dist/mcp-server` build confirmed current before invoking `capture-scorer-eval-baseline.mjs`'s dynamic imports [evidence: build timestamp/hash recorded alongside git HEAD]
- [x] CHK-003 [P1] `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`, and `skill_graph_compiler.py --validate-only` CLI usage read before dispatch [evidence: flags cited in plan.md §3]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-004 [P0] No file under `mcp-server/scripts/` or `routing-accuracy/` modified — the new top-3 capture script lives only under `002-baseline-capture/scripts/` [evidence: `git status` shows the new script only under this phase folder]
- [x] CHK-005 [P1] The top-3 capture script only imports existing built scorer functions read-only; no scoring-logic file is edited [evidence: `scripts/capture-top3.mjs` imports `scoreAdvisorPrompt`/`mergedSkillForAlias` from `dist/mcp-server`; `git status -- system-skill-advisor` clean]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-006 [P0] `score-routing-corpus.py` run to completion against the current `labeled-prompts.jsonl`; exit code and full JSON report captured [evidence: baseline artifact `gate3`/`advisor`/`joint` block]
- [x] CHK-007 [P0] `capture-scorer-eval-baseline.mjs` run without `--write`; full_corpus_top1/holdout_top1/ambiguity_top1/bucket metrics captured verbatim [evidence: baseline artifact `metrics` block]
- [x] CHK-008 [P0] New top-3 metric recorded for full corpus and holdout with correct/total/accuracy, and sanity-checked against known top-1-correct rows [evidence: baseline artifact `top3` block + sanity-check note]
- [x] CHK-009 [P0] `skill_graph_compiler.py --validate-only` run across every current root; 0 errors and `key_files`/`source_docs` path-existence checks pass for every root [evidence: captured "VALIDATION PASSED" stdout + discovered-root count matching the independently enumerated roster]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-010 [P1] Recorded hashes/row-counts cross-checked against a second, independent `shasum -a 256`/`wc -l` re-run before the artifact is accepted as final [evidence: Phase 3 cross-check delta = 0]
- [x] CHK-011 [P1] The contradiction between `scorer-eval-baseline.json` and `validation-baselines.md:49-50` (which cites the nonexistent `corpus.vitest.ts`/`holdout.vitest.ts`) is explicitly recorded with both cited numbers and the freshly measured number, not silently resolved [evidence: baseline artifact `discrepancy` block]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] CHK-012 [P1] Corpus prompts treated as inert labeled test data only; none executed as instructions during capture [evidence: capture scripts only read `.prompt` fields for scoring, never eval/exec them]
- [x] CHK-013 [P2] No credentials or proprietary data appear in the captured artifact [evidence: manual scan of `baseline/routing-baseline.json` before it is treated as final]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-014 [P1] Baseline artifact stored under `002-baseline-capture/baseline/` with pinned SHA-256 hashes, git HEAD short SHA, and capture timestamp [evidence: artifact file present with all required fields]
- [x] CHK-015 [P2] Packet continuity (`_memory.continuity`) updated to point later 030 phases at this baseline artifact's path [evidence: `next_safe_action` updated post-capture]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-016 [P1] All new files scoped under `002-baseline-capture/`; `git status` shows no changes outside this folder [evidence: `git status --short` output reviewed]
- [x] CHK-017 [P2] No `dist/` or `node_modules` build output committed as part of the capture [evidence: `.gitignore` coverage confirmed for any build artifacts touched during capture]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Pre-flight checks | 3 | 3/3 |
| Capture + compiler runs | 4 | 4/4 |
| Cross-checks | 2 | 2/2 |
| Security | 2 | 2/2 |
| Docs + file org | 4 | 4/4 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
