---
title: "Implementation Summary: External user guide"
description: "The README adaptation block is the external-user guide, OpenCode is marked native and Webflow and Obsidian optional examples, v4.0.0.5 states the rule, and a fresh agent reading only the block reached a green battery with its own surface leading the tie."
trigger_phrases:
  - "external user guide implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide"
    last_updated_at: "2026-10-13T10:09:54Z"
    last_updated_by: "generate-context"
    recent_action: "Built, reader-tested, reviewed and closed the phase and the 026 parent"
    next_safe_action: "Review and merge worktrees/129-surface-guide into main (operator)"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/skills/sk-code/SKILL.md"
      - ".skilled/skills/sk-code/README.md"
      - ".skilled/changelog/skilled/v4.0.0.5.md"
    session_dedup:
      fingerprint: "sha256:fba12230e7c4378c84424d38390813e342ada8919a68e7b78b0d8a1eacc54317"
      session_id: "build-026-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: External user guide

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-external-user-guide |
| **Completed** | 2026-10-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An external user now has one guide. The README block "What Adapting `sk-code` Looks Like" says OpenCode is native and stays, names the two optional examples by their nested paths, has the user install the hooks first and keep the authored compiled-routing folder and `.opencode/skills`, then gives the removal recipe, the add recipe through `/create:skill-parent update --surfaces` and the check battery. The first README bullet, the template list, the sk-code `SKILL.md` surface sentence and the hub README rows mark OpenCode native and Webflow and Obsidian optional examples, and no line tells the user to replace OpenCode. The next Skilled note, v4.0.0.5, states the rule and what phases 001 to 004 changed for a user, including that `ROUTER.md` keeps its own version.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Feature bullet, template list and the guide block |
| `.skilled/skills/sk-code/SKILL.md` | Modified | Surface sentence with native and optional example roles |
| `.skilled/skills/sk-code/README.md` | Modified | The Works on row, the surface table and the When To Use line; version 2.2.12.0 to 2.2.13.0 by the gate |
| `.skilled/changelog/skilled/v4.0.0.5.md` | Created | Release note |
| `.hermes/skills/sk-code/SKILL.md`, the sk-code activation manifest and its authored twin | Regenerated | `sync-skills-hermes.cjs` and the pre-commit route gate |
| `review/` | Created | Five-iteration review packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Commits on `worktrees/129-surface-guide`: `8f59b9bd0a` markers and guide, `1895122d37` release note, `746eb3d0cf` review fixes, then the closeout commit with these docs, the review packet and the 026 parent close. Every edit outside this folder was made by cli-pi `llmgateway/deepseek-v4.1-flash` at `--thinking max` with `--no-extensions` (Devin's daily quota was out), one literal change per brief, each diff read before commit.

### Reader test

The copy followed research run V0's recipe: `.skilled` without `node_modules` (each one symlinked to the worktree's), `specs/` holding only the 019 archive, `README.md`, `PUBLIC-RELEASE.md`, `.github`, `.opencode`, `.pi` and `.claude`, built from `8f59b9bd0a` under the session scratchpad. Its control battery exited 0 on all five checks. The copy is not a git repository, so the agent took the guide's manual refresh and copy path.

A fresh DeepSeek agent ran there through `perl -e 'alarm shift; exec @ARGV' 570 pi -p --no-extensions "$(cat r9.prompt)" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null` with `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true`. The prompt held the child-dispatch preamble, the inlined code persona, the block copied verbatim from the copy's README (43 lines, md5 `07ce2065d2faaeebcb7d440f0947dcfa`) and the task: remove both examples, add `sk-code-acme` whose vocabulary holds `acme`, run the block's verification list. Three runs of that same prompt, each cut at 570 seconds, took the copy from the shipped tree to green. Its session logs show no write outside the copy. It also read the unmodified worktree's sk-code docs and an earlier dry-run `verify-doc-claims.cjs` output in the scratchpad, neither of which holds steps beyond the block.

A second copy ran the same block in two stages, removal only first. After three runs its battery also exited 0, but that agent compared its work with the finished first copy, so it is recorded as support, not as independent proof.

### Ledger

| ID | State | Proof |
|----|-------|-------|
| P11-1 | Pass | Copy after the agent's removal (`ls -d .skilled/skills/sk-code/sk-code-*` lists no webflow or obsidian packet): `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` printed `all hard invariants passed`, `ci-skill-root-metadata.cjs` `checked=14 passed=14 failed=0`, `compiled-route-guard.cjs` `All hubs fresh or excused`, `compiled-route-sync.cjs --check` `all 55 served copies match their authored files`, `run-all-drift-guards.sh` `all 4 guards PASSED`, each exit 0. The removal-only second copy printed exit 0 on all five as well |
| P11-2 | Pass | Same copy after the agent added `sk-code-acme` (its `references/` holds the three `workflow-*.md` links): the same five commands exit 0 with the output above; `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` 6 pass, 0 fail; `test_readme_manifest.py` `reproduced=True` |
| P11-3 | Pass | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "update the typescript config in the acme service"` in the copy printed `orderedBundle` with targets `["sk-code-acme","sk-code-skilled"]`; `tieBreak` is `["sk-code-quality","sk-code-review","sk-code-acme","sk-code-skilled"]` |
| P11-4 | Pass | `pi -p --no-extensions "$(cat r9.prompt)" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`, run three times; the prompt held only the preamble, the persona, the block (md5 `07ce2065d2faaeebcb7d440f0947dcfa`, equal to `awk` over the copy's README) and the task. A diff of the copy's `.skilled` against the worktree touched no checker or guard script |
| P11-5 | Pass | Worktree: `sed -n 40p .skilled/skills/sk-code/SKILL.md` prints "OPENCODE (`sk-code-skilled`), the native surface for this framework's own code, and two optional example surfaces"; `sed -n 800p README.md` prints "One native surface and two optional examples"; `sed -n 1384p README.md` prints "Keep the native OpenCode surface, and remove or replace the optional example Webflow and Obsidian surfaces"; the sk-code README rows 23, 55 to 57 and 90 say native or optional example; goal criterion 1 prints `ok` |
| P11-6 | Pass | Worktree: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` printed `all 4 guards PASSED`, exit 0; `python3 .skilled/skills/sk-doc/scripts/validate_document.py` printed `Total issues: 0` on `README.md`, the sk-code `SKILL.md` and `README.md` and `v4.0.0.5.md` |

### Review

A five-iteration `/deep:review :auto` ran over `d99ddaff7d..1895122d37` on cli-pi `deepseek-v4.1-flash` at `max`, stop policy `max-iterations`, with `--no-extensions` added to the leaf command in the iteration driver. `verify-iteration.cjs` printed `OK` for all five. It found no P0 and no P1 and four P2. Verdict PASS with advisories. Artifacts are in `review/`.

| ID | Sev | Disposition | Proof or reason |
|----|-----|-------------|-----------------|
| RV-1 | P2 | Fixed | R1-P2-001, the recipes never refreshed the Hermes skill copies, and `.hermes/skills` ships `sk-code-webflow` and `sk-code-obsidian`. Fixed in `746eb3d0cf`: removal step 8 and add step 5 run `sync-skills-hermes.cjs`, which prunes a removed packet's copy (its `stale` branch) |
| RV-2 | P2 | Fixed | R1-P2-002, the root README surface lines go stale after a removal and the hub-rooted doc-claims walk cannot see them. Fixed in `746eb3d0cf`: removal step 5 names them; goal criterion 2 still prints 8 |
| RV-3 | P2 | Rejected | R2-P2-001, no work-loss preflight before deleting an example folder. The folder is tracked, so `git restore` brings it back, and the guide already offers keeping the examples as models; a preflight step would be an option the spec does not name (C4) |
| RV-4 | P2 | Fixed | R3-P2-001, `spec.md` Files to Change did not list the generated artifacts. Fixed in the closeout commit: one row names the Hermes copy and the two activation manifests |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The guide uses bold labels, not sub-headings | Goal criterion 2 reads the block up to the next line that starts with `##`, so an `####` sub-heading would cut it |
| The release note is compact | Six reader-visible changes, none breaking, per the changelog template |
| The reader-test copy has no git | It proves the guide's no-hooks path, which the spec names as an edge case |
| No skill release | Goal D5; the gate raised only the sk-code README version |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live battery at the base | All five exit 0 (doctor, CI metadata 14 of 14, guard, sync `--check`, drift wrapper) |
| Live battery at the end | All five exit 0, unchanged |
| Reader test | Shipped tree to green battery and `[sk-code-acme, sk-code-skilled]` in three runs of one prompt |
| `/deep:review :auto`, 5 iterations | PASS with advisories; 0 P0, 0 P1, 4 P2, three fixed and one rejected |
| Goal criteria 1 to 7 | Rerun from the final state, see `goal.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The block changed after the reader test.** The review fix `746eb3d0cf` added the Hermes refresh and the root README lines to three steps. The copy held no `.hermes` and its battery does not read the root README, so the change touches no check the reader test ran.
2. **pi needs `--no-extensions` here.** The review workflow's shared cli-pi builder does not add it, so the leaf command was adjusted in the iteration driver, as in phases 001 to 004.
<!-- /ANCHOR:limitations -->
