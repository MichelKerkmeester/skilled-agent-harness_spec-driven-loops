---
title: "Implementation Summary"
description: "Complete and committed as 092ebd6c256. Cleanup requests now reach /doctor:update, the install guide names the cleanup for linked and copied projects, and doctor 1.3.0.0 records what the lane removal changed."
trigger_phrases:
  - "doctor lane removal alignment implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/026-doctor-lane-removal-alignment"
    last_updated_at: "2026-11-21T22:14:11Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed the second review's findings in 533cb420627 and merged origin/main as 12a5a29ab09"
    next_safe_action: "Decide whether to push and merge the lane removal branch to main"
    packet_purpose: "Purpose: A user who types a cleanup request reaches `/doctor:update`, the install guide names the cleanup command for that user's install type, and the doctor release records what 024 removed."
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs"
      - ".skilled/changelog/skilled/v4.2.0.0.md"
      - ".skilled/skills/system-spec-kit/changelog/v2.14.0.0.md"
      - "INSTALL-SKILLED.md"
    session_dedup:
      fingerprint: "sha256:48ff0d11504565f76c7589566e0c8d495891f45dfb521ff23fafb2afde54e59c"
      session_id: "planning-026-doctor-lane-removal-alignment"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/497-ollama-lane-removal"
      savedAt: "2026-11-21T22:14:11Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 026-doctor-lane-removal-alignment |
| **Status** | Complete |
| **Completed** | 2026-11-21, commits `092ebd6c256` (first round), `533cb420627` (second review round) and merge `12a5a29ab09` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A user who asks to clean up after the retired advisor lane now reaches `/doctor:update`. Before this run, four cleanup prompts matched nothing. The install guide names the cleanup for a linked project and for a copied one. Doctor release 1.3.0.0 records what the lane removal changed in the doctor commands. Every change sits in the worktree, verified and not yet committed, because this run was barred from committing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `INSTALL-SKILLED.md` | Modified | Section 5, the "To adopt a new Skilled release" row: the linked and copied cleanup, with the refusal a linked project prints |
| `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` | Modified | Upgrade Notes step 1 splits by install type |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modified | Section "9. Lane Cleanup" points a linked project to the residue tool in the Skilled checkout |
| `.skilled/commands/doctor/_routes.yaml` | Modified | Eight cleanup phrases on the `/doctor:update` route |
| `command-bridges.generated.json` and the generated block in `projection.ts` | Regenerated | `derive-command-bridges.cjs` in write mode. `skill_advisor.py` did not change |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | Modified | One case per audit prompt |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modified | Two cases that pin the current-copy apply and the linked refusal |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | Modified | Version 1.3.0.0 |
| `.skilled/skills/system-skilled-doctor/changelog/v1.3.0.0.md` | Created | The release note, untracked until the commit |
| `.skilled/skills/system-skilled-doctor/README.md` | Modified | The `/doctor:update` row names the cleanup, and the doc version rose to 1.0.10.0 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` | Modified | Six legs, 26 rows and the delivery leg, and the doc version rose to 1.0.10.0 |
| This packet's `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this summary | Modified | Evidence, the corrected clauses and the status |
| Packet metadata and the trigger index outputs | Regenerated | `repair-derived.cjs`, then `generate-trigger-index.mjs` as the last write |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two fixture observations ran first, under a temp root and a fixture HOME that were removed afterwards, and the worktree's `git status` matched before and after. The helper-match cases were written next and failed four of four before the route changed. The route edit came after that. The bridges were regenerated and the advisor runtime was rebuilt before any doc changed, so phrase-reach and the ratchets judged the new phrases while dropping one was still cheap. All eight phrases passed, so none was dropped. The docs followed, each checked against the residue terms before it was saved. Two tests then pinned the observations the guide relies on, and the gates ran on the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| REQ-002, AC-002 and T002 now state the observed plan of one write, the recorded base | The engine rewrites `.skilled/skills/.state/doctor-update/base.json` on every apply, so a second apply never shows an empty list. The planning wording would have ticked a criterion the run contradicted |
| Reaching phase 7 is labelled derived | No fixture can run the workflow YAML. The derivation is the engine's exit 0, plus the absence of a stop for a plan with nothing to update, plus the `phase_7_lane_cleanup` rule |
| T005 and AC-001 use the pattern `doctor:update apply` | The planned pattern `doctor/update apply` cannot match the command |
| One helper-match case uses `acme` for the retired product's name | The residue gate keeps that name out of tracked files outside `specs/`. A word the manifest never carries scores nothing, so the case also asserts the stand-in adds no matched term |
| All eight planned phrases were kept | Each ranks `/doctor:update` first in the helper and reaches the bridge in phrase-reach, and the held-out rates did not move |
| Two tests were added to `release-update.test.cjs` | The guide relies on both behaviors, and no existing test covered an apply at the same release or the apply refusal through an outside link |
| The release note follows the layout of `v1.2.0.0.md` with shorter sentences | `v1.2.0.0.md` itself fails `check_changelog_shape.py` on its sentence ceilings, and the new entry passes |
| The packet status is In Progress | The handoff criterion includes a commit, and this run was barred from committing |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Before | After |
|-------|--------|-------|
| Doctor suite `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` | `ℹ pass 1427`, `ℹ fail 0` | `ℹ tests 1437`, `ℹ pass 1437`, `ℹ fail 0`, exit 0, after the review fix |
| `route-validate.sh` | "31 routes validated, 11 warnings" | The same line, exit 0, and the warning lines are identical by `diff` |
| `doctor-helper-match.cjs` on the four audit prompts | `STATUS=NO_MATCH FALLBACK=/doctor:setup` for each | `1) /doctor:update` and `STATUS=OK MATCHES=1` for each, exit 0 |
| Advisor on the four audit prompts, scored in process under the phrase-reach regime | Not measured | `command-doctor-update` first at 0.916 for three prompts. No recommendation for "remove Ollama leftovers" |
| `derive-command-bridges.cjs --check` | `"changed": []` | `"changed": []`, exit 0, after the write |
| `doctor-phrase-reach.cjs` | `STATUS=OK phrases=254 bridges=35` | `STATUS=OK phrases=262 bridges=35`, exit 0 |
| The four named advisor ratchets | `Tests  60 passed (60)` | `Tests  60 passed (60)`, exit 0 |
| Twelve more advisor routing and bridge files, and six scorer ratchet files | Not run | 104 and 93 tests passed, exit 0 each |
| `sync-runtime-mirrors.cjs --check` | 260 mirrors in sync | 260 mirrors in sync, exit 0 |
| `generate-leaf-manifest.cjs --check` on the doctor and the advisor | Not run | `leaf-manifest.json OK` for both, exit 0 |
| Residue repo mode | 47 of 47 rows, `live` 0 | 47 of 47 rows, `live` 0, exit 0. The gate test prints `ℹ pass 2` |
| Residue terms in the changed lines | Not applicable | `hits=0` in all twelve files, and `git grep --untracked` finds none in the new changelog |
| `check_changelog_shape.py` | `v2.0.0.0.md` PASS | `v2.0.0.0.md` PASS and `v1.3.0.0.md` PASS |
| `check_readme_references.py` | Doctor README 59 references, 0 unresolved | `INSTALL-SKILLED.md` 77 and the doctor README 60, 0 unresolved each |
| `validate-playbook-package.cjs --strict` | Not run | Exit 0, and none of the 13 package warnings names the changed scenario |
| `regenerate-skill-derived.cjs --all --dry-run` | Not run | `changed` 0, `errored` 0 |
| `repair-derived.cjs --apply` on this packet and 016 | Not run | `inspected=2 repaired=1 failed=0` on the first pass, exit 0 |
| `validate.sh --strict` with auto-repair off | `RESULT: PASSED` on 016 | This packet `Errors: 0  Warnings: 0` and `RESULT: PASSED`. 016 recursive `RESULT: PASSED` 27 times and no failure. Exit 0 each |
| `generate-trigger-index.mjs`, then `--check` | Not run | Exit 0, then "trigger index matches the corpus" with 0 stale documents |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Review Fix

An independent review returned one P1 and three P2 findings, all fixed before the commit.

- **P1:** the phrase "lane residue CI failing" sent ordinary prompts such as "my CI is failing on lint" to `/doctor:update`. It is now "lane residue gate failing", and two negative cases pin that CI prompts no longer match.
- **P2:** "clean embedding model" and "delete the pulled shared model" matched "clean model cache" and "delete the shared model". They are now "old advisor embedding model" and "model the advisor lane pulled", and "remove leftover model files after upgrade" became "remove the retired advisor lane model files". Two more negative cases pin the cache and shared-model prompts. The four cleanup prompts still rank `/doctor:update` first.
- **P2:** the linked-project text said apply asks about the shared model. Without a terminal it keeps the model unless it gets `--shared-model delete`. `INSTALL-SKILLED.md`, the update presentation and the advisor v2.0.0.0 upgrade notes now say so, and the presentation tells an agent to show the `machine` report's `askFirst` question and pass the answer.
- **P2:** the doctor v1.3.0.0 changelog now names the removed `/doctor:skill-advisor` setup action.

After the fix: doctor suite 1437 of 1437, helper-match 31 of 31, bridges `"changed": []`, advisor ratchets 60 of 60, phrase reach `STATUS=OK phrases=262`, route validation 31 routes, residue repo mode 47 of 47 with live 0, mirrors 260, and no gate term in any added line or the new changelog.

## Second Review Round

A fresh reviewer read the whole epic on 2026-11-21 and returned CONDITIONAL, with no P0, three P1 and eight P2 findings. The operator placed the fixes in this packet. Two leaf workers made them in parallel, and the orchestrator checked each against the code before committing.

- **P1, orphaned compiled files.** The shared package kept `dist/chunking.js` and `dist/utils/retry.js` after their sources were deleted, because `tsc --build` never deletes such output. Machine mode stayed at exit 1. Apply now deletes them when their source is gone and keeps them when it exists.
- **P1, merge with main.** main had moved 237 commits. The merge `12a5a29ab09` resolved eight conflicts and dropped the one line in main's new overlay routing test that set the removed lane's switch.
- **P1, release note.** v4.2.0.0 now gives the cleanup per install type.
- **P2 fixes.** The tool finds a model server whose node path holds a space or is named `nodejs`, and M7 lists the three launcher key families. The gate test no longer fails on an unused allowlist row. The dead lease field, cache-clearing step and corpus flag are gone, and system-spec-kit ships 2.14.0.0. 024's records are reconciled, and the operator kept the cleanup phrases over 024 decision Q004.

Gates on the merged tree: residue repo mode 47 of 47 with live 0, residue vitest 117 passed, advisor typecheck exit 0, advisor suite 2450 passed and 4 skipped, doctor suites 1613 passed and 0 failed, route validation 31 routes, phrase reach `STATUS=OK phrases=262`, bridges `"changed": []` and mirrors 260 in sync. The advisor suite needed `npm run build` and a skill-graph rescan first, because the merge changed sources the attested build and the local graph predated.

Not done, by choice:
- The `sharp` and `protobufjs` overrides in the two `package.json` files stay. Removing them needs an install to prove the lockfiles stay in sync.
- The advisor changelog still does not name the removed setting keys, because the residue gate forbids those names.
- `rebuild-native-modules.sh` calls `record-node-version.js` at `cli/setup/` under the skill root, but the file is at `runtime/cli/setup/`. That bug predates this branch and is left for its own fix.

## Known Limitations

1. **A request to remove leftovers after any upgrade reaches `/doctor:update`.** "remove leftover files after npm upgrade" matches through "remove" and "leftovers", the same two words that carry a request naming the retired product, so the two cannot be told apart. `/doctor:update` is the upgrade command, so the suggestion is not far off.
2. **A prompt that names the retired product.** The helper reaches `/doctor:update` for "remove Ollama leftovers" through "remove" and "leftovers" only. The advisor returns no recommendation for it, because the product's name cannot be a phrase in `_routes.yaml`.
3. **Phase 7 on a current copy is derived.** The engine half is observed and pinned by a test. That the workflow then runs the cleanup comes from the YAML text and its contract test, not from a run.
4. **The new release note is untracked.** Residue repo mode scans tracked files only, so `v1.3.0.0.md` was checked with the term script and `git grep --untracked` until it is committed.
5. **A running advisor daemon keeps its startup bridges.** The new phrases reach a daemon only after it restarts, which the update workflow's rebuild step already names.
6. **Outside this packet's scope.** The model entry `system-skilled-doctor/changelog/v1.2.0.0.md` fails the changelog shape check. It was not changed. Row 25 of the 016 phase map, which read In Progress while 025 was Complete, was set to Complete by the orchestrator.
<!-- /ANCHOR:limitations -->

---
