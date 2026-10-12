---
title: "Implementation Summary: Playbook path repair"
description: "The playbook validator's backticked-path warnings went from 258 to 1, with the one left recorded as a Remaining row."
trigger_phrases:
  - "playbook path repair implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair"
    last_updated_at: "2026-10-12T09:00:00Z"
    last_updated_by: "builder"
    recent_action: "Repaired the playbook paths, ran a five-iteration review and applied its fixes"
    next_safe_action: "Integrator merges the branch and runs phase 001's bump over the changed docs"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs"
      - ".skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs"
    session_dedup:
      fingerprint: "sha256:65430e54de477787b975ea6875c42ae0577e42a642b40ed4b04f019c2bf9dd76"
      session_id: "build-002-playbook-path-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Playbook path repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-playbook-path-repair |
| **Completed** | 2026-10-12 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The playbook validator printed 258 `BACKTICK_PATH_UNRESOLVED` warnings at the scaffold commit. It now prints 1, and that one is the Remaining row below. Every package run exits 0.

Most fixes are path corrections: a path written from the wrong base, an archived spec packet now under `z_archive/`, or a scenario file that lost its old number prefix. A sandbox path now carries its sandbox prefix, such as `$repo` or `$FIXTURE`, so it no longer reads as a repo path. A row that cited a file with no successor was removed. Files in the external Webflow project `a_nobel_en_zn` are now named as outside this repo.

Two path classes could not be fixed in the docs, so the validator got a narrow rule for each:

- **Installed release state.** `/doctor:update` writes `base.json`, `divergence.json` and run records under `.skilled/release/` in an installed tree. The source repository never holds them, so paths under that prefix are skipped.
- **Unbuilt symlink targets.** A symlink in the tree, such as `.opencode/plugins/sk-vision.js`, counts as present even when the build output it points at does not exist yet.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| Scenario and root files under 28 `manual-testing-playbook/` folders (227 files) | Modified | Correct, rewrite or remove each backticked path |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modified | The two narrow rules |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` | Modified | A test per rule, and a seeded package for the piped-report test |
| `.skilled/skills/sk-doc/` SKILL.md, ROUTER.md, description.json, hub-router.json, mode-registry.json, `changelog/v2.3.7.0.md` | Modified, Created | sk-doc bump 2.3.6.0 to 2.3.7.0, since the validator changed |
| `.hermes/skills/sk-doc/SKILL.md` and both sk-doc activation `manifest.json` copies | Regenerated | Keep the Hermes mirror and the compiled route in sync with the bump |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash, through cli-pi, made every doc and code edit. The builder chose each correction first and dispatched it as a literal old-to-new replacement, one package per brief, then compared each changed file byte for byte against HEAD plus the specified replacements.

A five-iteration `/deep:review :auto` then ran over the phase commits, and its fixes went through the same literal-replacement path. The review found that root playbook files still cited paths their scenarios had corrected, because the validator backtick-checks scenario files only. The same replacements were applied there. Its artifacts are in `review/`.

### Path Ledger

| ID | Outcome | Proof or reason |
|----|---------|-----------------|
| PP-01 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-classifier/cli-jev` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-02 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-claude-code` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 16) |
| PP-03 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-codex` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 21) |
| PP-04 | Closed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-cursor` exits 0 and prints 1 line (was 21); the one left is RM-1, kept because rewriting a path the scenario checks for absence would be churn that prevent-overengineering rules out, see Remaining |
| PP-05 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-devin` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 22) |
| PP-06 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-hermes` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 15) |
| PP-07 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-opencode` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 21) |
| PP-08 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-external-orchestration/cli-pi` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 19) |
| PP-09 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package cli-orca` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 8) |
| PP-10 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package mcp-tooling/mcp-click-up` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-11 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package mcp-tooling/mcp-figma` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-12 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package mcp-tooling/mcp-obsidian` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 5) |
| PP-13 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-code` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 19) |
| PP-14 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-code/sk-code-obsidian` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 2) |
| PP-15 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-code/sk-code-review` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-16 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-code/sk-code-webflow` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-17 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-design/sk-design-diagram` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 7) |
| PP-18 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-doc/sk-create-benchmark` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-19 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-doc/sk-create-changelog` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 2) |
| PP-20 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-doc/sk-create-command` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-21 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-doc/sk-create-goal` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 5) |
| PP-22 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-git` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 10) |
| PP-23 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package sk-vision` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 19) |
| PP-24 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package system-deep-loop` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-25 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package system-deep-loop/deep-ai-council` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 5) |
| PP-26 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package system-deep-loop/deep-review` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 2) |
| PP-27 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package system-deep-loop/runtime` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 1) |
| PP-28 | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict --package system-spec-kit` exits 0 and prints 0 `BACKTICK_PATH_UNRESOLVED` lines (was 30) |
| PP-V | Fixed | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` exits 0; its two new cases fail with the rules reverted and pass with them |

### Remaining

| ID | Path and citing line | Why it stays |
|----|----------------------|--------------|
| RM-1 | `.cursor/worktrees.json` at `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:14` | The scenario checks whether that file is present, and the repo ships none on purpose. The path is correct as written, so rewriting its ten citations would change nothing a reader needs |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Two narrow validator rules rather than doc rewrites for installed release state and unbuilt symlink targets | Both are correct paths that cannot resolve in a source checkout. Rewriting them would make the scenarios wrong for an installed tree |
| The stress scenarios cite the full `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/` path | The short `tests/stress/` form resolved from no base the validator tries |
| Review finding R1-P2-001 rejected: the `.skilled/release/` skip stays prefix-wide | Everything under that prefix is release state the engine writes in an installed tree. Listing filenames in the validator would copy doctor:update's file contract into a second place |
| Review finding R4-P2-001 rejected: symlinks that leave the repository stay accepted by the backtick check | Every tracked symlink that leaves the repository sits under a `scratch/` or `review/` segment the check already skips. The check reads nothing through a link, and the comment now states that the link check stays stricter |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate-playbook-package.cjs --strict` | Exit 0, 1 `BACKTICK_PATH_UNRESOLVED` line (was 258), equal to the Remaining rows |
| Validator tests | Exit 0. Each new case failed with its rule reverted |
| `/deep:review :auto`, 5 iterations | CONDITIONAL with 1 P1 and 6 P2. The P1 and four P2 are fixed, and two P2 are rejected with the reasons in Key Decisions. See `review/review-report.md` |
| `cite-drift-gate.mjs` against the merge base | Exit 0 |
| Hermes mirror check and compiled-route sync and guard | Exit 0 |
| Strict `validate.sh` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The validator does not backtick-check root playbook files.** The review found root files still citing paths their scenarios had corrected. Those are now fixed, but nothing would catch the next one.
2. **Stale text outside this phase's scope, left as found:**
   - `.skilled/skills/cli-external-orchestration/cli-codex/references/codex-tools.md` section 2 still says `.codex/settings.json`.
   - `.skilled/skills/sk-design/sk-design-diagram/references/export.md` line 151 cites a path that no longer exists.
   - The deep-ai-council advisor scenario command points at a moved test file, and its filter matches 0 tests.
   - The sk-vision feature catalog still uses the short `pi/sk-vision.ts` form.
   - The doctor test-env text says five yaml files; there are six.
   - The cli-cursor role text still says "Phase 011's".
3. **No `version:` line changed.** The integrator runs phase 001's bump over the changed docs after merging.
<!-- /ANCHOR:limitations -->
