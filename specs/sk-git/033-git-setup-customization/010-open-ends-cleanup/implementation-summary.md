---
title: "Implementation Summary"
description: "Four open ends from the doctor releases are closed: the adapter check proves a real binding, the hub checker refuses a standalone skill, the synthesis count check counts distinct findings, and the voice blockers are gone."
trigger_phrases:
  - "open ends cleanup implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/010-open-ends-cleanup"
    last_updated_at: "2026-10-17T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All four items closed and every gate rerun from the final state"
    next_safe_action: "Coordinator writes the changelog entries and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
      - ".skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs"
      - ".skilled/skills/sk-doc/sk-create-command/SKILL.md"
    session_dedup:
      fingerprint: "sha256:acd63c30f28f469cd56d9becf4b12a678afbe7258a642d2cfd847a7b08332296"
      session_id: "scaffold-010-open-ends-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-open-ends-cleanup |
| **Completed** | 2026-10-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three checks now report what is true, and two doc sets pass the voice scan. An unused handler no longer reads as a registered git advisory. A standalone skill no longer reads as a broken hub. A healthy deep-review run no longer closes as incomplete.

### Phase 10: open-ends-cleanup

- **Adapter binding check** (`git-setup-check.cjs`, `adapterExportsBinding()`). `/doctor:git setup` now accepts an OpenCode adapter only when `tool.execute.before` sits at the top of the object its default export returns. It accepts a Pi extension only when the default export calls `<firstParam>.on('tool_call', handler)`. A scanner that skips strings, templates, comments and regex literals reads the source, and the battery still never executes it.
- **Hub check on a standalone skill** (`parent-skill-check.cjs`). sk-prompt is not a hub. It has been class S since its v3.0.0.0, and class S forbids the hub files the check asked for. The checker now prints `ERROR: target is not a parent hub ...`, points to `ci-skill-root-metadata.cjs` and exits 2 for a root that carries neither routing file.
- **Synthesis count check** (`synthesis-closeout.cjs`, `countDistinctFindings()`). Review iteration records carry cumulative finding snapshots, and `repeatedFindings` is a subset of `openFindings`, so both totals used to double-count. Both sides now count each finding once by identity.
- **Voice blockers**: 0 hard blockers in `sk-create-command/SKILL.md` (was 31), `common-pitfalls.md` (2), `worked-example.md` (2), `argument-hints-and-modes.md` (1) and the 033 parent `spec.md` (5).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Default-export-scoped binding check |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | 8 failing cases, 1 passing test |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Refuse a class S root with exit 2 |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs` | Modified | Standalone-root test |
| `.skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs` | Modified | Distinct-finding counts |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/synthesis-closeout-latest-record.vitest.ts` | Modified | Two tests that fail on the old logic |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md` and three references | Modified | Voice blockers cleared |
| `.hermes/skills/sk-create-command/SKILL.md` | Regenerated | Hermes sync |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` and its `specs/sk-doc/z_archive/...` twin | Regenerated | sk-doc policy hash re-minted after the SKILL.md edit |
| `specs/sk-git/033-git-setup-customization/spec.md` and its `graph-metadata.json` | Modified | Voice blockers cleared, phase 10 rows filled, Problem Statement and Purpose written as real text so the metadata deriver stops reading a placeholder, metadata re-derived |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna (`gpt-6-luna`, max, fast) made every edit outside this folder in ten dispatches, one at a time. The orchestrator diffed each result against the brief, reran its tests outside the sandbox and ran a mutation check on each code fix. Two dispatches wrote nothing: one halted on the known `xcrun_db` sandbox failure, and one hit the ChatGPT usage limit. Both were rerun. Nothing was hand-edited.

Mutation checks, each with the original source swapped back in and then restored:
- Item 1: the old code reports the unused OpenCode object and the uncalled Pi helper as `registered`, so the test fails.
- Item 2: the standalone-root test fails without the guard.
- Item 3: both new tests fail (`2 failed | 2 passed`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the checker, not sk-prompt | `skill-root-metadata-contract.cjs` forbids `description.json`, `mode-registry.json` and `hub-router.json` on class S, so hub files would fail `ci-skill-root-metadata.cjs`. No automated caller runs the hub check on sk-prompt. It ran by hand in phase 9 (009 T033). |
| Exit 2 for a non-hub root, not 0 | A green exit would certify a hub nobody has. The doctor already maps 2 to ERROR. |
| A small scanner, not a JavaScript parser | A parser would be a new dependency the battery cannot assume in an inspected repository. The scanner covers the two adapter shapes the repository ships. |
| Edit punctuation inside one table cell | "Do not change tables" was read as protecting table structure. `common-pitfalls.md:63` kept its columns and only lost a semicolon. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `run-all.sh` (doctor) | 7 suites passed. node:test 346/346 before, 348/348 after |
| `git-setup-check.test.cjs` | 58/58 before, 59/59 after |
| `parent-skill-check-invariants.test.cjs` | 103/103 before, 104/104 after |
| Deep-loop close-out suites (8 files) | 142/142 before, 144/144 after |
| `pre-commit.test.sh`, `typo-flags` plus `create-journey-proof`, advisor `parent-skill-check-fixtures` | 111/0, 11/11, 7/7 |
| `git-setup-check.cjs --tool=claude` / `--tool=hermes` | `STATUS=OK checks=11` both |
| `parent-skill-check.cjs` on the seven hubs | OK, 0 warnings each |
| `parent-skill-check.cjs .skilled/skills/sk-prompt` | exit 2, `ERROR: target is not a parent hub` (was FAIL with 5 failures) |
| `compiled-route-guard.cjs` | All hubs fresh or excused, exit 0 (after the sk-doc re-mint) |
| `compiled-route-admission.cjs --all --warn-only` | Every hub passes the admission check |
| `ci-skill-root-metadata.cjs` | checked=14 passed=14 failed=0 |
| `package_skill.py --check` sk-create-command / sk-prompt | PASS / PASS |
| `hvr_scan.py` on the five docs | hard blockers 0 on each |
| `validate_document.py` on the five docs | VALID, 0 issues on each |
| `sync-skills-hermes.cjs --check` | PASS: 68 Hermes skill copies in sync |
| `sync-runtime-mirrors.cjs --check` | PASS: 185 mirrors across 8 trees |
| `run-all-drift-guards.sh` | all 4 guards PASSED |
| Close-out on the 006 Luna lineage | `synthesis_incomplete` before, `synthesis_complete` after |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The adapter check reads two shapes.** It reads an inline default-exported function and a default-exported arrow. An adapter that exports a named binding (`export default plugin;`) reads as unregistered. The repository's own adapters use the inline shapes.
2. **Changelog entries are not written here.** The coordinator writes them.
<!-- /ANCHOR:limitations -->

---
