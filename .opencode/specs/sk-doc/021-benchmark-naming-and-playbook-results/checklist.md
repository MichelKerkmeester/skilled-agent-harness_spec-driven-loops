---
title: "Checklist: One dated benchmark convention and a home for playbook results"
description: "Verification evidence for the grammar, the writer, the 78-folder rename and the backfill."
trigger_phrases:
  - "benchmark naming checklist"
  - "playbook results checklist"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-benchmark-naming-and-playbook-results"
    last_updated_at: "2026-07-27T11:48:33Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Remediated the three verified deep-review findings"
    next_safe_action: "Re-run the deep review in an isolated worktree against the fixed state"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Checklist: One Dated Benchmark Convention And A Home For Playbook Results

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item names the command that settled it and the number it produced. A claim without a number is
not evidence. Where a check was skipped or a result deferred, the row says so rather than being left
unticked and unexplained.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Link-checker baseline captured before any rename: `85 broken` across 7202 files, 10214 links.
- [x] CHK-002 [P0] Lane C baseline captured with the working changes stashed: `249 passed, 11 failed`.
- [x] CHK-003 [P0] Run folders enumerated. Evidence: `run folders in scope: 78` across 16 roots, `fixtures/` excluded as inputs.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Syntax verified on every modified script. Evidence: `node --check` reports `syntax OK` for each.
- [x] CHK-005 [P0] Scaffolder parses. Evidence: `ast.parse` on `init_skill.py` reports `parses OK`.
- [x] CHK-006 [P1] The frozen scorer digest is untouched: `score-skill-benchmark.cjs` still hashes to `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`.
- [x] CHK-007 [P1] No spec path, packet number or requirement id appears in any code comment. Evidence: `rg` over the changed files returns `0` matches.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Lane C suite after the change: `259 passed, 11 failed`, the same 11 as baseline.
- [x] CHK-009 [P0] New storage suite passes. Evidence: `Tests 10 passed (10)`.
- [x] CHK-010 [P0] All stored report files render through the emitters without throwing. Evidence: `reports rendered cleanly: 50 | threw: 0` and `FAIL reports surfacing zero failing rows: 0`.
- [x] CHK-011 [P1] The Python scaffolder and the JavaScript index writer emit the same empty index. Evidence: `expect(fromPython).toBe(runIndex.emptyIndex('demo-skill'))` passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P0] All folders present at their mapped names. Evidence: `at mapped name: 78 / 78 | problems: 0`.
- [x] CHK-013 [P0] No names off-grammar. Evidence: `names off-grammar: 0`, four `baseline` folders excepted by design.
- [x] CHK-014 [P0] No collisions in the frozen map. Evidence: `rows: 78 | collisions: 0`.
- [x] CHK-015 [P0] No live references to an old folder name. Evidence: `live references remaining: 0 | historical records: 1093`.
- [x] CHK-016 [P0] Link checker returns to baseline. Evidence: `check-markdown-links: 7294 files, 10704 links checked, 85 broken`.
- [x] CHK-017 [P1] Every run folder carries the companions its record supports. Evidence: `folders by kind: {"lane-c":62,"retrieval":7,"workspace":9}`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-018 [P1] No credential, token or transcript content was introduced. Evidence: the sweep replaces only `<root>/<label>` path segments.
- [x] CHK-019 [P1] Captured transcripts were restored to pristine content. Evidence: `git checkout e16382d845 -- <folder>` for all `78` folders.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-020 [P0] The grammar is stated once. Evidence: only `create-benchmark/SKILL.md` and its storage guide declare it.
- [x] CHK-021 [P0] The storage contract is documented. Evidence: `create-manual-testing-playbook/SKILL.md` section `4. RESULTS STORAGE CONTRACT`.
- [x] CHK-022 [P1] Backfilled files are distinguishable. Evidence: each carries `Derived after the fact from this run's stored record`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P0] Input corpora untouched. Evidence: `fixtures` excluded from the map, so `0` fixture paths appear in it.
- [x] CHK-024 [P1] Renames are revertible per style. Evidence: `git mv` used throughout, one `refactor(benchmark)` commit per naming style.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Twenty of twenty-one tasks verified with a command and a number. The outstanding item is this packet's
own strict validation, which is what this document completes.

Two defects were found by the gate rather than by inspection, and both are recorded in the decision
record: a bare-label rewrite that corrupted renderer-owned reports, and a base-name mapping that sent
references to a sibling hub.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-025 [P0] One code path produces both run-time and backfilled companions. Evidence: `backfill.js` calls the same `build-report.cjs` emitters the runner calls.
- [x] CHK-026 [P0] The grammar is declared once and cited elsewhere. Evidence: only `create-benchmark` states the rule.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-027 [P1] The rename sweep completes in seconds per style. Evidence: `time node apply-rename.js ... semantic` reported 24s wall for 244 files.
- [x] CHK-028 [P1] No quadratic scan remains in the sweep. Evidence: `node apply-rename.js ... semantic --dry` completes in `24.2s` across `244` files.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-029 [P0] Every rename lands as its own revertible commit. Evidence: `refactor(benchmark)` commits, one per naming style.
- [x] CHK-030 [P0] The frozen map is committed separately as the record of prior names. Evidence: commit `e16382d845`.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-031 [P0] No rendered report was hand-edited. Evidence: `git diff` inside report files shows only cross-reference path repairs, `0` content edits.
- [x] CHK-032 [P0] Input corpora untouched. Evidence: `fixtures/` excluded from the map and the sweep.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-033 [P0] The results-storage contract names the six files and the never-hand-edit rule. Evidence: `create-manual-testing-playbook/SKILL.md` section 4.
- [x] CHK-034 [P1] Deferred questions are recorded rather than silently dropped. Evidence: `spec.md` section 12.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Verified | Evidence |
|---|---|---|
| Implementation | Yes | Link checker at baseline `85 broken`; Lane C 259 passed |
| Migration | Yes | 78 of 78 folders at mapped names; 0 live stale references |
| Honesty | Yes | Every backfilled file marked derived; absence stated, never filled in |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:review-remediation -->
## REVIEW REMEDIATION

- [x] CHK-035 [P1] Same-day reruns no longer overwrite evidence. Evidence: two consecutive runs produce `2026-07-27--manual-testing-playbook--zai-glm-5-2-high` and `...-2`, and the index gains `2` rows.
- [x] CHK-036 [P1] The report-folder contract matches the writer. Evidence: the owning skill now states seven Lane C files with `skill-benchmark-report.{json,md}`, and names the promotion family's `benchmark-report.md` separately.
- [x] CHK-037 [P1] Parity-baseline discovery survives the dated grammar. Evidence: `scanParityBaseline` falls back to newest-captured dated discovery instead of a single fixed label no writer produces.
- [x] CHK-038 [P0] No regression from the remediation. Evidence: storage suite `11 passed`, lane suite `260 passed` against the same `11` pre-existing failures, link checker `85 broken`.
<!-- /ANCHOR:review-remediation -->
