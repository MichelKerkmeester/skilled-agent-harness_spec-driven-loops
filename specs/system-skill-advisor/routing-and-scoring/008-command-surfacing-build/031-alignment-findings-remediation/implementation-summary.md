---
title: "Implementation Summary"
description: "The branch's alignment findings are closed or recorded. The validator accepts the Vibe mirrors, CI checks them, the docs state the offer rule the code ships, three playbook scenarios cover the new behaviour and three missed probe prompts now reach the advisor."
trigger_phrases:
  - "alignment findings remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/031-alignment-findings-remediation"
    last_updated_at: "2026-11-15T17:20:00Z"
    last_updated_by: "coordinator"
    recent_action: "Closed the phase, review SHIP, recheck new=0"
    next_safe_action: "None in this phase. The catch-up merge with origin/main clears BAT-02, BAT-06 and BAT-07"
    blockers: []
    key_files:
      - ".skilled/commands/scripts/validate-command-references.cjs"
      - ".github/workflows/command-tree-parity.yml"
      - "scratch/probe-decisions.txt"
      - "scratch/recheck.txt"
      - "scratch/review/report.txt"
      - "scratch/handback.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "77af2d6d-58e8-4180-b6da-697f12833f71"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-alignment-findings-remediation |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The alignment run of 2026-11-15 found 4 P0 and 9 P1 findings on this branch. Every one is now fixed, declined with a reason, or recorded as a pre-existing failure that main already fixed. A recheck of that run found nothing new.

### Phase 31: alignment-findings-remediation

The command-reference validator now accepts the Vibe agent mirrors, so it prints `OK` instead of one unresolved reference. Both CI workflows run the three Vibe mirror checks. The parity job also builds the shared package, because one Vibe script loads it from a `dist` folder that a clean runner does not have.

The advisor release note and its catalog page now state the offer rule the code ships. A command the prompt refuses or asks about is not offered, and neither is one named after a history lead such as `ran` or `undo what`. A command named with no such lead is offered when its owner and route gates pass. The operator chose to fix the note, not the code.

Three playbook scenarios cover the new behaviour. NC-012 covers the offer gates, CL-009 the brief's policy word in a parent and a child session and CL-010 the Vibe document line. Six new intent phrases send three missed probe prompts to the advisor first, and the floors and eval counts did not move.

BASE is `ea3b7ab4460`. The fix is `d509e9d5c07`, the review follow-up is `2efe3204e3e` and the close-out commit carries the last wording fix.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/scripts/validate-command-references.cjs` | Modified | `.vibe` joins the runtime mirror allowlist, the run's literal fix |
| `.github/workflows/command-tree-parity.yml` | Modified | `.vibe/**` filters, the three Vibe checks and a build of the shared package |
| `.github/workflows/spec-kit-check.yml` | Modified | The three Vibe checks in the mirror parity step, and a comment that names where Vibe-only changes are checked |
| `.github/workflows/README.md` | Modified | The parity row names the Vibe copies |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | Modified | The offer rule as shipped, and the Vibe document line |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modified | The offer rule as shipped |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | Modified | NC-012, CL-009 and CL-010 in the index, census 53 |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md` | Created | NC-012, six prompts through the offer gates |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md` | Created | CL-009, three prompts in a parent and a child session |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md` | Created | CL-010, the Vibe document line in a parent and a child session |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | Modified | The census pins move to 53 |
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | Modified | Six intent phrases for P02, P04 and P11 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Compiled from the metadata |
| `.skilled/skills/system-skill-advisor/leaf-manifest.json` and `leaf-aliases.json` | Modified | Regenerated for the three new scenario files |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coordinator recorded the before state, the floors and an eighteen-line finding matrix. It also showed that BAT-02, BAT-06 and BAT-07 fail at the merge base and pass on `origin/main`. DeepSeek v4.1 flash workers on OpenCode Go then ran four lanes side by side, one task per session, each test first. An Opus verifier checked every task before its lane moved on.

The verifiers rejected four tasks, and each rejection held. T004's CI step would fail on a clean runner. T005's wording broke the changelog's sentence ceilings. T009 put its rollback copy in the wrong folder. T015's phrases could not lift P07 past a scorer floor. The coordinator applied each verifier's fix, or for T015 declined the probe.

Between lane R tasks the coordinator gated each metadata change on the floors and kept it only when they were byte-equal. After every lane closed, the full gates, the floor `cmp`, the matrix and the boundary checks ran. One Opus reviewer read the fix diff. Its eight P2 notes became T027, and its re-read of that follow-up found one more P2, fixed in T028. A report-only recheck of the alignment run closed the phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the note, not the code, for D-03 (Q072) | The code offers a typed command named with no lead, and typed delivery reads 43 of 44. Withholding every unled naming would cost those rows |
| Build the shared package in the parity job | `sync-agents-vibe.cjs` loads `@spec-kit/shared` from the gitignored `dist`, and `spec-kit-check.yml` already builds it the same way |
| Decline P07 | The word "list" makes the prompt a read-only explainer, so confidence is pinned at 0.25 whatever the phrases say. With the threshold at 0 the doctor skill ranks first at 0.6336, and changing the scorer is outside this phase |
| Decline P01 | The Vibe hook wiring belongs to the cli-mistral-vibe packet, and the advisor already ranks second |
| Leave BAT-02, BAT-06 and BAT-07 to the catch-up merge | Their files are byte-equal to the merge base and pass on `origin/main`, so main's fix arrives with the merge |
| Regenerate the leaf manifest and aliases in the fix commit | They are generated from the skill tree, and the three new scenario files made them stale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Finding matrix | Before: validator `exit=1 FAIL`, `vibe-checks=0`, `only-mentions=3`, 50 scenarios, P02 `sk-prompt`, P04 `sk-prompt`, P11 `sk-doc`, BAT01 `stale`. After: `exit=0 OK`, `vibe-checks=3` in both workflows, `only-mentions=0`, `scenario-files=53 new-ids=3`, the advisor first on P02, P04 and P11, BAT01 `fresh` (`scratch/matrix-before.txt`, `scratch/matrix-after.txt`) |
| Floors and eval | 24/44, 0/35, 2/44 and `[160,49,21,5]`, `cmp` equal at every gate and after |
| Advisor suite | 185 files, 2157 passed, 0 failed, the same as before |
| Doctor tests | 1229 pass, 0 fail |
| Gates | build, typecheck, the three Vibe mirror checks, the six metadata checks, the validator and its self-test, the playbook package (`scenarios=53 violations=0`) and `actionlint` all exit 0. The link check shows the same 5 broken links as before (`scratch/after.txt`) |
| Scenario reruns | NC-012, CL-009 and CL-010 print every pinned line after lane R's index change, and CL-010 again with `TMPDIR` unset |
| Probe decisions | P02, P04 and P11 kept. P07 and P01 declined with reasons (`scratch/probe-decisions.txt`) |
| Boundaries | runtime `lib`, `AGENTS.md`, `.vibe`, `.skilled/hooks`, the three row files and the two baselines unchanged, no package change, no id in added comments (`scratch/boundaries.txt`) |
| Review | `verdict: SHIP`, 0 P0 and 0 P1, eight P2. Follow-up `verdict: SHIP`, all eight resolved, one new P2 fixed (`scratch/review/report.txt`) |
| Recheck | `STATUS=OPEN resolved=3 still_open=10 new=0 needs_review=34`. BAT-01, BAT-05 and D-01 resolved, every other open id pre-existing or in `scratch/handback.md` (`scratch/recheck.txt`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two P1 probes stay declined.** P07 needs a scorer change for read-only explainer prompts that name no skill, and P01 belongs to the Vibe packet. A recheck cannot read 0 P1 until one of them is built or the operator accepts the decline.
2. **Three P0 battery rows stay open until the catch-up merge.** BAT-02, BAT-06 and BAT-07 fail at the merge base and pass on `origin/main`.
3. **P11 wins on a tie.** The advisor and `sk-doc` both read 0.82 on the probe. The advisor ranks first on score, and the order held on every run.
4. **The floors cannot measure every row.** They do not show whether the six phrases change the top skill on the 36 behaviour-fresh rows or the skill-only and decline holdout rows. Answering that needs a count-only measure at BASE and at the fix.
5. **P01's second-place confidence moved.** No P01 change was made, but the P02, P04 and P11 phrases lifted the advisor's score there from 0.845 to 0.8665. `cli-mistral-vibe` still leads at 0.95.
<!-- /ANCHOR:limitations -->

---
