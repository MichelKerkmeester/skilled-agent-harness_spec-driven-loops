---
title: "Implementation Summary: Phase 4: barter-repin-and-relayout"
description: "Barter's vendored tree ai-speckit/skilled now runs the Skilled engine from 063daae, and all 133 overlay source fields sit under framework/ or root/, so status passes with an empty offLayout. Three ai-speckit commits carry it: the re-pin, its changelog record and the relayout."
trigger_phrases:
  - "barter re-pin onto 063daae"
  - "barter repin and relayout summary"
  - "barter overlays relayout evidence"
  - "barter record-base open item"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/004-barter-repin-and-relayout"
    last_updated_at: "2026-11-20T16:30:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the re-pin, the relayout and their verification"
    next_safe_action: "Operator runs record-base and the .opencode npm ci, then phase 5"
    blockers:
      - "record-base resolves the pin against the vendoring repository and records nothing"
    key_files:
      - "tasks.md"
      - "goal.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-summary-004-barter-repin-and-relayout"
      parent_session_id: null
    completion_pct: 97
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-barter-repin-and-relayout |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Barter's vendored tree `ai-speckit/skilled` is pinned to Skilled `063daaee2c19a7a8c9a0fb67f84903894bc08043`, whose engine accepts a sibling overlay folder: the probe that printed `names a folder outside the tree root` before the re-pin now prints `../overlays`. Every overlay source moved under `barter-overlays/framework/` or `barter-overlays/root/`, so status passes with `offLayout=0` and phase 5 can move the folder out of the tree.

### Re-pin and relayout

The re-pin ran staged first. It needed the `_routes.yaml` copy rebased as planned, plus nine more overlays the plan did not name, before the live run passed. The relayout followed in the same session: 130 copies moved, the sk-git-skilled link relinked, and the skilled-coder changelog folder moved by hand. Every doc, test and script that named an old source path now names the new one, and no destination byte changed apart from the two changelog links.

### Files Changed

All paths are in `ai-speckit`. `BO` is `skilled/barter-overlays`.

| File | Action | Purpose |
|------|--------|---------|
| `skilled/` (676 files, commit `c8cd005b173`) | Modified | Re-pin onto `063daae`, the ten rebased overlays, the two restored generated files, the regenerated `.index/` and the ai-speckit spec record 039 |
| `BO/skilled/changelog/skilled-coder/v4.1.0.0.md`, now `BO/framework/changelog/skilled-coder/v4.1.0.0.md` (commit `fd6dd18b66d`) | Modified | Records the `063daae` re-pin in v4.1.0.0, edited at its old source path before the relayout |
| `BO/framework/`, `BO/root/` (557 renames, commit `51e218edf2e`) | Moved | Every overlay source relaid under the two roots |
| `BO/overlay-manifest.json`, `BO/sync-state.json` | Modified | New source paths, the two inner sk-git sources, the two link records |
| `BO/tests/compiled-route-guard.test.cjs`, `BO/root/opencode/plugins/tests/barter-git-write-gate.test.cjs`, `BO/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` | Modified | Test paths follow the new source layout |
| `init-repository.sh`, `tests/init-repository.test.sh`, `tests/node-version-policy.test.sh` | Modified | New mode sources land under `framework/skills/sk-code/` |
| `BO/README.md`, `BO/framework/repo-rules/barter-overlay-first.md`, `BO/root/AGENTS.md`, five sk-git and sk-code docs | Modified | Source rule restated, layout tree redrawn, source paths updated |
| `README.md`, `CONTRIBUTING.md`, `developer-questions.md` | Modified | Twelve one-segment path swaps |
| `skilled/AGENTS.md`, `skilled/.skilled/`, `skilled/.cursor/rules/repo-local.md` | Modified | Destinations rewritten by apply (8 changed) and the `/doctor:agents-md` embed plan |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Setup recorded the baseline: a 79-line porcelain listing, status PASSED with in-sync=487, run-all 8 PASS and overlay tests 111 of 122. Three staged re-pin runs came next. The first refused two generated files Barter had regenerated in place, which were restored from `b0a3b9f`. The second blocked nine overlays, which were rebased. The third printed RESULT: STAGED with no refuse or blocked line. The live re-pin ran as `20261120T125226Z-a599ac`. After the runbook extras (compiled-route refresh, dist builds, advisor rebuild, trigger index) it was committed as `c8cd005b173`, and its changelog record as `fd6dd18b66d`. `apply --relayout` refused nested sources on its first run and passed on its second. The path fixes followed and landed as `51e218edf2e`. The backup was deleted last, leaving the working tree identical to the baseline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Test gate is "no failure beyond the baseline set", not `# fail 0` | The 11 failing overlay tests already failed before any change: they import modules that exist only at the destination, so a literal `# fail 0` could never hold |
| Rebase the nine extra overlays with `git merge-file` and keep Barter's GPT Luna / openai defaults in the five conflicts | Upstream had changed those files since `b0a3b9f`, and the live re-pin cannot run while any overlay is blocked |
| Carry `.env.example`, skip `README.md` and `.gitignore` among the not-copied root files | Only `.env.example` held a change Barter's copy needs; the other two restate none of upstream's changed facts |
| Point the two inner sk-git sources at the path the outer move carries them to | The engine refuses nested copies in one run and has no way to limit a run to one copy, so either order of separate runs also refused |
| Move the skilled-coder changelog folder by hand and edit its link target | No manifest entry owns it, so the relayout could not move it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pin.commit` against the Target Skilled commit line | PASS: both read `063daaee2c19a7a8c9a0fb67f84903894bc08043` |
| Routes overlay pinnedSha256 | PASS: `c6b1aa8e...` equals the sha256 of `_routes.yaml` at `063daaee` |
| Status after the re-pin | PASS: RESULT: PASSED, offLayout=133, in-sync=487 |
| Status and apply on the final state | PASS: RESULT: PASSED, 0 LAYOUT lines, offLayout=0, apply `0 changed`; `status --audit` AUDIT=0 |
| Relayout destination check | PASS: apply `0 changed`, in-sync=487, only the two changelog links added outside `barter-overlays` |
| Manifest source rule | PASS: off-rule=0, the `"source": "skilled/` grep prints nothing |
| `bash tests/run-all.sh` | PASS: exit 0, 8 PASS, after the re-pin and after the relayout |
| Overlay `$TESTS` | Baseline-equal: 122 tests, 111 pass, 11 fail, the same failure set as before any change; the folder's own `tests/` 10/10 |
| Old-path grep (T037) | PASS: prints nothing |
| Hook sources byte check (T038) | PASS: `same` three times |
| Commits | PASS: `51e218edf2e` above `fd6dd18b66d` above `c8cd005b173`; HEAD~1 lists 1 file; overlays.length 133 at HEAD and HEAD~3; no `relayout-runs` path |
| Working tree | PASS: `git status --short` identical to the 79-line baseline after cleanup |
| `/doctor:update record-base` | FAIL: recorded nothing, see Known Limitations |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **record-base did not record.** The engine resolves the pin against the vendoring repository, so it printed `commit 4610f6bd... holds no .skilled units to record`, or `commit could not be resolved locally` with `--offline`. `base.json` is untouched. The operator records the base by hand until the engine resolves the pin against the vendored tree.
2. **`.opencode` `npm ci` not run.** Upstream changed `.opencode/package-lock.json` (381 deletions only). The runbook leaves this install to the operator.
3. **Engine gap: nested relayout sources.** `apply --relayout` cannot move a copy and the copies inside it in one run, and it cannot limit a run to one copy. Point the inner entries' `source` at the path the outer move carries them to, as this phase did.
4. **Engine gap: link targets reaching a folder no entry owns.** The relayout leaves such a folder in place. Move the folder by hand and edit the layout-link target.
5. **Pre-existing test failures.** The 11 overlay test failures, deep-loop vitest 375/377 (pi-blackhole default-model, salvage-miss retry), the sk-code battery alignment-drift row and the git battery hooks row fail the same way on the old pin. None is a regression of this phase.
<!-- /ANCHOR:limitations -->
