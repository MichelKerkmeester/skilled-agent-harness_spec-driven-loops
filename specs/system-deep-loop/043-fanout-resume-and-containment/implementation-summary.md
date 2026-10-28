---
title: "Implementation Summary"
description: "An interrupted deep-loop lineage now resumes, and the containment guard reports a concurrent operator edit as contested instead of quarantining it under the lane."
trigger_phrases:
  - "fanout resume and containment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-fanout-resume-and-containment"
    last_updated_at: "2026-10-28T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Reported contested paths at the single-lineage call sites"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-043-fanout-resume-and-containment"
      parent_session_id: null
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 043-fanout-resume-and-containment |
| **Completed** | 2026-10-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

An interrupted fan-out lineage now dispatches again under its stored session id, and the containment guard stops filing a file another session was editing under the lane. Both were seen on 2026-10-27 in the fsmonitor research fan-out.

### Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit

Resume. `dispatchExecutorEffect` named each executor spawn `fanout-dispatch:<label>:attempt-<n>` under the lineage's session id. `n` is the pool's retry counter, so it is 1 on every fresh supervisor run, and a lineage resumed under its stored session id reused the first dispatch's name. The gateway then replayed the confirmed first dispatch as idempotent (or refused a changed prompt as a conflict, or an unconfirmed intent as unresolved), the executor never ran, and the launcher turned the empty result into exit 1. The function now counts the intents the ledger already holds for that lineage and attempt and adds `:redispatch-<count>` to the logical effect id.

Containment. The guard could not tell an operator's save from a lane write on a path that was dirty before the lane started and changed again. The 001 manifests show exactly that: a baseline diff exists only for a path that was already dirty, and the file was `scratch/findings.md`, the operator's draft. Under the default remedy such a path is now `contested`: reported in the guard result, as a `containment_contested` ledger event and as `containmentContested` on the lineage output, with a note, and given no quarantine copy, patch or revert. A path the lane itself quarantined on an earlier pass stays the lane's, restore mode keeps its single-owner reading, and a path that was clean at the baseline is still a violation.

### Follow-up: contested paths at the single-lineage call sites

A review found the contested report reached only the fan-out runner. The ten direct `enforceWriteContainment` calls in the research and review workflow YAMLs printed `violations` and nothing else, and the guard writes no violation event, quarantine copy or patch for a contested path. So in a single-lineage run a lane write to a file the operator had dirty was reported nowhere. `enforceWriteContainment` now appends a `containment_contested` event (severity `warning`, `paths`, `note`) to the state log a caller passes, and every workflow call site prints the contested paths and their note beside the violations. The protocols, the shared-checkout playbook scenario and the compiled contracts say the same.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts` | Modified | Count prior dispatches and give the next one a fresh logical effect id |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified | `baselineDirty` mark, `contested` and `contestedNote` on the enforce result, earlier-pass manifest reader |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | `containment_contested` event and `containmentContested` output field |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-effect-dispatch.vitest.ts` | Created | Four resume cases against the effect gateway |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | Three-resume case and concurrent-operator case through the real script |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified | Five contested-path cases; the `content_truncated` quarantine case now starts from a clean baseline |
| `.skilled/skills/system-deep-loop/feature-catalog/fanout-write-containment/fanout-write-containment.md` | Modified | States the contested class and its trade-off |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modified | States the contested exception to attribution |
| `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modified | States the contested exception to attribution |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Regenerated | Recompiled from the updated protocol |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Regenerated | Recompiled from the updated protocol |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md` | Modified | Row for `fanout-effect-dispatch.vitest.ts` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/README.md` | Modified | Contested class in the `write-containment.ts` row |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.13.0.md` | Created | Runtime release note for both fixes |
| `.skilled/skills/system-deep-loop/changelog/v1.6.13.0.md` | Created | Hub release note for the documentation change |
| `.skilled/skills/system-deep-loop/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `.hermes/skills/system-deep-loop/SKILL.md` | Modified | Hub version 1.6.12.0 to 1.6.13.0, then to 1.6.15.0 in the follow-up |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modified (follow-up) | `ContainmentContestedEvent`; append it to `stateLogPath` when a pass has a contested path |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml` | Modified (follow-up) | Print contested paths and their note at all ten call sites; the two confirm-step notes state it |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment-yaml-call-sites.vitest.ts` | Created (follow-up) | Fails when a workflow call site stops passing a state log or stops printing contested paths |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modified (follow-up) | Two state-log cases for the contested event |
| `.skilled/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md`, `deep-review/references/protocol/loop-protocol.md` | Modified (follow-up) | A single-lineage run reports the contested path in its state log and the dispatch prints it |
| `.skilled/skills/system-deep-loop/manual-testing-playbook/write-containment/shared-checkout-run.md` | Modified (follow-up) | Expected signals split: the baseline-dirty file is contested, the clean one is a violation |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown`, `deep-review.contract.markdown`, `deep-ai-council.contract.markdown` | Regenerated (follow-up) | Recompiled after the YAML, protocol and hub-version edits; the council contract changed only in its source digests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/README.md`, `runtime/lib/deep-loop/README.md` | Modified (follow-up) | Row for the call-site guard; the state-log event in the `write-containment.ts` row |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.14.0.md`, `changelog/v1.6.15.0.md` | Created (follow-up) | Runtime and hub release notes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Each bug was reproduced from the interrupted lineage's on-disk facts (its ledger frames, config and the ledger lines) without touching the 001 packet. Every new test was written first and run against the unfixed source, then the fix was applied. The full runtime suite ran at HEAD before the change and again after it, then the drift checks, the type check and strict packet validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Fix the logical effect id, not the gateway | The gateway is right that one logical effect has one outcome. Each dispatch of a lineage is its own effect, so the producer that named them all alike is the one to change. |
| Count prior intents from the ledger | The attempt number restarts per supervisor run, so only the ledger knows how many dispatches already happened, including ones the supervisor lost before their confirmation. |
| Key contested on "dirty at the baseline and changed again" | git status shows that bytes changed, not who wrote them. The only fact it and the baseline prove is that someone was already editing this exact path, so that is the one place the guard stops claiming authorship. |
| Report contested, never quarantine it | A quarantine copy files the bytes under the lane's directory as the lane's evidence. The pre-dispatch bytes are already in the baseline capture, so recoverability does not depend on the copy. |
| Leave restore mode and earlier-pass paths alone | Restore is the caller's declaration that it owns the checkout. A path the lane quarantined before is the lane's by its own record, so a retry that rewrites it must not escape as contested. |
| Write the contested event in `enforceWriteContainment`, not at each YAML call site | Every workflow call site already passes `stateLogPath`, and the function already appends the violation event there. Inlining the append would repeat the event shape ten times and need a different `node:fs` import edit at each site. `fanout-run.cjs` passes no `stateLogPath`, so its ledger still gets exactly one event. |
| Do not widen to a brand-new file | A new file a second session creates mid-run looks the same as a lane write in git status. The default remedy already preserves it and the advisory is non-fatal, so the trade-off stays as it was. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Baseline `npm test` in the runtime at HEAD | `Test Files  169 passed (169)`, `Tests  2823 passed \| 8 skipped (2831)`, 1243 s |
| New resume tests on the unfixed source | `Tests  4 failed (4)` in `fanout-effect-dispatch.vitest.ts`; `run 2: expected 3 to be +0` in the three-resume case |
| New containment tests on the unfixed source | 4 failed in the contested block; `expected undefined` in the concurrent-operator case |
| Same tests with the fix | 4 passed, 1 passed, 5 passed, 1 passed |
| Negative control for the earlier-pass rule | With the manifest check disabled, the new case and the existing per-pass quarantine case both fail; restored, both pass |
| Final `npm test` in the runtime | `Test Files  170 passed (170)`, `Tests  2834 passed \| 8 skipped (2842)`, exit 0 (11 tests added, none failing, the known load flake did not occur) |
| `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | exit 0 |
| `node .skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` | exit 0 |
| `npm run typecheck` in the runtime | exit 0 |
| `validate.sh specs/system-deep-loop/043-fanout-resume-and-containment --strict` | RESULT: PASSED |
| README checks after the follow-up rows | Tests README `unresolved=1` before and after (the existing `scripts/runtime-bootstrap.cjs` line); library README PASS; both counts checks PASS |
| Contract recompile and drift after the protocol edits | `[CONTRACT DRIFT] OK commands=3`, exit 0; documentation drift `"errors": []`, exit 0 |
| Changelog and version checks | `validate_document.py` `Total issues: 0` on both entries; `frontmatter-version.mjs verify` exit 0; `parent-skill-check.cjs` exit 0 |
| Follow-up: suite run that overlapped the edits | `Test Files  2 failed \| 168 passed (170)`, `Tests  5 failed \| 2831 passed \| 8 skipped (2844)`, exit 1. Started before the first edit and still running through them, so it is not a clean baseline. All five failures were `STALE_SOURCE_DIGEST` in `check-contract-drift.vitest.ts` and `render-command-contract.vitest.ts`, read while the contracts were stale between the YAML edit and the recompile |
| Follow-up: final `npx vitest run` in the runtime | `Test Files  171 passed (171)`, `Tests  2838 passed \| 8 skipped (2846)`, exit 0. Against the last clean count above that is one more file and four more tests: the two call-site guard tests and the two state-log cases |
| Follow-up: call-site guard against the unfixed YAML | Its matching rules applied to the HEAD YAML flag 10 of 10 call sites, and to the working tree 0 of 10 |
| Follow-up: contract drift, documentation drift, type check | `[CONTRACT DRIFT] OK commands=3`, exit 0, after a second recompile, because the first one preceded the hub version bump; `"errors": []`, exit 0; `npm run typecheck` exit 0 |
| Follow-up: mirrors and Hermes | `sync-runtime-mirrors.cjs --check` PASS 196 mirrors; Codex and Pi prompt checks PASS 39 each; `sync-skills-hermes.cjs --check` `PASS: 67 Hermes skill copies in sync` |
| Follow-up: document and version checks | `validate_document.py` `Total issues: 0` on `v1.9.14.0.md`, `v1.6.15.0.md` and the playbook scenario; `hvr_scan.py` hard blockers 0; `frontmatter-version.mjs verify` `454 files \| ok=454`; `parent-skill-check.cjs` `all hard invariants passed, 0 warnings` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **A lane write to a file an operator already had open is reported only as contested.** The ledger event, the lineage output and the note name it; no copy is made. Compare the file with the pre-dispatch bytes in the lineage's `containment/baseline/` before trusting either writer. Accepted: git status shows that bytes changed, not who wrote them (`runtime/lib/deep-loop/write-containment.ts:292`), so the run reports both writers rather than guess.
2. **A brand-new file a second session creates mid-run is still a preserved advisory under the lane.** git status cannot tell it from a lane write, and attribution would need the executor's own write log. The file is never deleted and the advisory is non-fatal. Accepted: nothing is lost, and attribution would need a write log the executor does not keep.
3. **Done: the library README has a row for `fanout-effect-dispatch.ts`.** `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/README.md:43` names it, with the `:redispatch-<n>` effect id a resumed lineage gets.
<!-- /ANCHOR:limitations -->

---


