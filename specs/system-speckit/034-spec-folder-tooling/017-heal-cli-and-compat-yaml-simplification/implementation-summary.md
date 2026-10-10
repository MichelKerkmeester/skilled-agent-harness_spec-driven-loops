---
title: "Implementation Summary"
description: "The lane-mode CLI lost two unused flags, the compat action states its failed-step rule once, and a test now pins the order that refusals are recorded in."
trigger_phrases:
  - "heal cli and compat yaml simplification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/017-heal-cli-and-compat-yaml-simplification"
    last_updated_at: "2026-10-09T14:34:00Z"
    last_updated_by: "closeout"
    recent_action: "Built all four phases in three commits and recorded the evidence"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts"
      - ".skilled/commands/doctor/assets/doctor-update-compat-action.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-017-heal-cli-and-compat-yaml-simplification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-heal-cli-and-compat-yaml-simplification |
| **Status** | Complete |
| **Completed** | 2026-10-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The lane-mode command line now takes only `--apply`, `--folder` and `--roots`. The compat action states its failed-step rule in one key. A new test fails if the refusals in `upgrade-baseline.json` stop being ordered by mode, then document, then reason. No lane mode and no part of `upgrade-legacy.mjs` changed.

### Phase 17: heal-cli-and-compat-yaml-simplification

The plan had four phases and the build shipped them in three commits.

1. **Order test (commit c98cfc2682).** `upgrade-legacy.vitest.ts` gained the case `records lane-mode refusals in mode, document and reason order`. Its packet refuses in four lane modes across three documents, and the case asserts the exact `refusals` array.
2. **`--mode` and `--json` removal (commit d4221e892f).** Phases 2 and 3 ship as one commit because both edit `runLaneModesCli`, the same README lines and the same test case. `runLaneModesCli` lost its `--mode` parser, its unknown-mode error and its `--json` branch. `runLaneModes(packet, { modes })` is unchanged, so the tests can still narrow the modes.
3. **Failed-step key (commit 26179f4be7).** `step_failure` is folded into `on_step_failure` in the doctor compat YAML, with every clause of both kept. The doctor test reads all five phrase checks from `on_step_failure` and asserts the old key is gone.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Modified | Adds the refusal-order case, 47 lines |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modified | Drops `--mode` and `--json` from `runLaneModesCli` and from the usage comment |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modified | Drops both flags from the `heal-spec-docs.cjs` row and from the usage line |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts` | Modified | Drops the `--json` and unknown-mode assertions and the helper's extra-arguments parameter, and renames the case to `lane-modes-cli-dry-run` |
| `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` | Modified | One `on_step_failure` key in `phase_4_move` |
| `.skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs` | Modified | Reads the failed-step phrases from `on_step_failure` |
| `specs/system-speckit/034-spec-folder-tooling/spec.md` and `graph-metadata.json` | Modified | Row 17 of the phase map reads Complete, and the metadata lists this child |
| This packet's documents and `scratch/` | Modified | Status, evidence and the eight small evidence files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delegated builders wrote the phases in one working tree, and the raw outputs they saved are what this summary cites.

**The review finding.** A fresh review by an Opus model read the phase 1 test and found that it did not pin the document key. The fix added a link from `plan.md` to `zulu-absent.md`. That link sorts before `spec.md` by document but after `spec.md`'s own links by reason, so a sort that drops the document key now fails the case. The same rework matches each reason with `stringContaining`, so a reworded message does not read as an ordering failure. After the rework, five sort mutations fail the case: no sort, no mode key, no document key, no reason key and document and reason swapped.

**The corpus precondition.** Before `--json` was removed, the phase 15 two-pass check ran from plain output on a copy of the corpus outside the repository. The copy held 42,403 `.md` files. Pass 1 applied 264 changes, refused 132 and changed 132 files. Pass 2 applied nothing, refused the same 132 and left the copy's hashes unchanged. Every count the check needs can therefore be read from the plain lines, and the flag was removed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove `--mode` and `--json` | The operator confirmed on 2026-10-09 that no script outside this repository passes either flag |
| Keep phase 15's AC-019 evidence as written | It records a run made with `--json`, and recorded evidence is not edited |
| Pin the refusal order before the removals | The research found only a repeated-run equality check, which a missing sort would also pass |
| Ship phases 2 and 3 as one commit | Both edit `runLaneModesCli`, the same README lines and the same test case, so two commits would have rewritten the same lines twice |
| Rework the order test after review | The review found the first version did not pin the document key, and the reworked version fails a mutation that drops it |
| Record the transient `specs/` folders and do not fix them | They come from other tests and sit outside this packet's frozen scope |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| CLI suite before the change | 1775 tests passed, 19 skipped, 0 failed, across 171 files (`scratch/baseline-summary.txt`) |
| CLI suite after the change | 1776 tests passed, 19 skipped, 0 failed, across 171 files. The one extra test is the new order case (`scratch/cli-summary.txt`) |
| Companion script suites | Every count equals the baseline, for example 266 passed in the modules suite and 101 passed in the validation-system suite, with 0 failed in each |
| The two changed vitest files | 82 of 82 passed (`scratch/vitest-two-summary.txt`) |
| Doctor compat test | 21 passed, 0 failed (`scratch/doctor-summary.txt`) |
| Order test against mutations | The unmutated run passes. All five sort mutations fail it (`scratch/mutation-results.txt`) |
| Corpus two-pass from plain output | Pass 1 applied 264 and refused 132. Pass 2 applied 0 and refused the same 132. Copy hashes unchanged (`scratch/corpus-summary.txt`) |
| Search for the removed flags and field | No tracked file outside `specs/` names `--lane-modes` with a removed flag, and the base commit does. The only `step_failure` left is the test's assertion that the key is undefined (`scratch/search.txt`, `scratch/recheck.txt`) |
| `node --check` on `heal-spec-docs.cjs` | Exit 0 (`scratch/recheck.txt`) |
| `validate.sh --strict` on this folder | RESULT: PASSED with Errors: 0 and Warnings: 0, run from the final state of the documents |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The CLI suite creates folders in the real `specs/` root while it runs.** The corpus run's real-tree hash diff caught nine `.md` files under `specs/001-scaffold-gate-phase-probe` that were not there before. The suite also makes a `.repair-fixture-` directory under the real specs root, in two places in `repair-derived.vitest.ts`. The hash diff lists additions only, so no file that already existed changed its hash. Both kinds of folder were gone once the suite finished. This packet does not fix it, because the tests are outside its scope. The cheap fix is to point those tests at a temporary directory. A run that dies mid-suite could leave a folder behind, which is inferred and not observed.
2. **The flag removal rests on the operator's word.** A search of this repository finds no caller, but a script elsewhere is not visible from here. If one exists, `--mode` and `--json` are now ignored, so `--mode <name> --apply` runs all five lane modes. Every mode acts only on proof, so that run is the default one and not a wrong one.
3. **The corpus copy and the full run logs are not in the packet.** They stayed in the session scratch area outside the repository, and `scratch/` keeps only their summary lines.
<!-- /ANCHOR:limitations -->

---


