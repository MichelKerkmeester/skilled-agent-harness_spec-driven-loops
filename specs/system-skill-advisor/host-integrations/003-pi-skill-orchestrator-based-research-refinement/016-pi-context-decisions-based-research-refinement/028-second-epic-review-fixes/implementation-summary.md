---
title: "Implementation Summary: Fix the six P2 findings of the second epic review"
description: "The advisor subprocess no longer throws when its Python child exits early, a curly apostrophe no longer hides a research-loop request, and the epic's stale statuses, catalog sources and one acceptance row now match HEAD."
trigger_phrases:
  - "second epic review fixes implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/028-second-epic-review-fixes"
    last_updated_at: "2026-11-23T22:15:00Z"
    last_updated_by: "generate-context"
    recent_action: "Landed on main as 82af76f6754 after combining both offer-gate changes"
    next_safe_action: "None. The packet is complete"
    packet_purpose: "Purpose: Each finding is fixed or corrected at its source with a check that failed before the change, and a fresh review of the epic reports no failed gate."
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
    session_dedup:
      fingerprint: "sha256:bf2485670065cf4d3c96147f13d6642981929afdd13b28963f3be0cc92bcb91e"
      session_id: "scaffold-028-second-epic-review-fixes"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "0b81ad2f-04a7-4ad7-b174-0b3f9930b833"
      workspace: "/Users/michelkerkmeester/worktrees/public/530-advisor-logic-deep-review"
      savedAt: "2026-11-23T22:15:00Z"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-second-epic-review-fixes |
| **Completed** | 2026-11-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When the Python child of the advisor dies before reading its prompt, the call now returns a failed result instead of throwing out of the caller. A prompt typed with a curly apostrophe, such as "I’d like a research loop on cache eviction", now gets the same deep-research offer as the straight form, in both the native gate and the Python fallback.

### Phase 28: second-epic-review-fixes

You get each of the second review's six findings fixed where it starts. Three code findings each have a check that failed before the fix. Three record findings now match what HEAD shows. The comment above the spelled-count rule now gives an example the code honors, and the shared fixture pins both spelled-count questions so the two runtimes cannot drift apart on them.

The rerun of the review returned PASS with seven new P2 advisories, and those are fixed too. A negated question about the loop, such as "why doesn't my deep review converge", no longer gets a run offer, and a request to write a blog post about the loop is recognised with a curly apostrophe as well as a straight one. Every loop word the native gate knows now needs a shared case that uses it, so a word added to one runtime alone fails a suite. The Vibe head receipt now refuses a folder another user could write to and writes through a temp file, so a planted symlink is replaced rather than followed. The completion metadata of 012, 025 and 024/005 now matches their Complete status, the epic's Status cell covers every phase through 028, and the pasted-reply catalog entry names all seven call sites.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` | Modified | Listens for the stdin pipe error before writing the prompt |
| `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts` | Modified | Early-exit child with an 8 MiB prompt |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-subprocess.vitest.ts` | Modified | Mock stdin is an event emitter, so the listener attaches as it does on a real pipe |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | Folds curly apostrophes in `asksForLoopRun`, corrects the `ITERATION_COUNT` comment |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | Modified | `asks_for_loop_run` folds quotes like its siblings |
| `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` | Modified | Three shared cases, 27 to 30 |
| `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md` | Modified | Names the shared handler and the DSH, Vibe and Pi adapters |
| `../007-*/` to `../010-*/` `spec.md` and `graph-metadata.json` | Modified | Status Complete |
| `../027-epic-review-fixes/acceptance-criteria.md` | Modified | AC-006 excludes changelogs and records the rerun |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | Modified | One run case must use each loop vocabulary entry |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Modified | Receipt folder ownership check, temp-file write and rename |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | Modified | Planted-symlink and open-folder cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modified | State folders made owner-only, as the hardened hook requires |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md` | Modified | All seven call sites, the Python copy and the shared fixture |
| `../012-*/tasks.md`, continuity of `../012-*/`, `../025-*/` and `../024-*/005-*/` | Modified | Completion metadata matches the Complete status |
| `../spec.md` | Modified | Status cell through phase 028, rows 22 and 28 Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work ran in worktree 523. The worktree first needed its skill graph built, since without it 13 advisor tests and one Python test fail before any change. The baseline then went green. Each new test ran against the unfixed code first: the curly case failed in both runtimes, and the early-exit case reported an unhandled `write EPIPE` against HEAD's `subprocess.ts`. The fixes went in after that, followed by the whole gate set and a fresh five-pass review of the epic: five native Opus passes at medium effort and a fresh Opus synthesis at high effort. The review returned PASS with seven P2 advisories. The operator chose to fix all seven before landing, with no fourth review. Their cases went into the shared fixture first and failed in both runtimes, the two Vibe receipt cases failed against the unhardened hook, and then the fixes went in and the gate set ran again.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the `ITERATION_COUNT` comment, keep the code | The operator chose it. The named-loop question already stays a question, and changing the bare-question rule would touch the shared gate across 27 existing cases and the ratchets |
| Fold quotes once in the gate's entry function | Every exception it calls then reads the same text, so no helper can miss the fold again |
| Guard the vocabulary from the TypeScript side | The Python copy inlines its patterns, so the check requires a shared run case per native entry, and the Python suite reads the same cases |
| Hold the Vibe receipt folder to the route-receipt store's rule | The two stores share a base folder in the temp directory, so one ownership rule covers both |
| Combine both sides when merging main's offer-gate rework | Main gained a rework of the same gate (negated run asks, `rounds of`, continue verbs, `set up` as its own rule) while this packet ran. The operator chose to combine them: main's logic is the base, this packet adds the quote fold, the negated questions and the exported want-lead list without `set up`, and the fixture holds both case sets |
| Fix stale `completion_pct` through the continuity writer | The writer owns that field. 012's graph status also read a ticked line that quoted an unticked checkbox as open, so that line was reworded |
| A child folder rather than reopening 027 | The operator chose it, and 027 keeps its closed record with only the AC-006 correction |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` in the advisor runtime | exit 0 |
| `npm run clean && npm run build` | exit 0 |
| `npm test` in the advisor runtime | exit 0, `Test Files 180 passed (180)`, `Tests 2601 passed | 4 skipped (2605)`, no unhandled error. Baseline was 2564 passed, so the 37 new tests are the whole delta |
| `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | exit 0, `7 passed (7)` |
| `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` | exit 0, `9 passed (9)` |
| `npx vitest run tests/parity/holdout-independent.vitest.ts` | exit 0, `6 passed (6)` |
| `python3 scripts/routing-accuracy/score-routing-corpus.py` with the plan's floors | exit 0 |
| `python3 tests/python/test_skill_advisor.py` | exit 0, `PASS: DEEP-LOOP-GATE ... (cases=46)` |
| `derive-command-bridges.cjs --check` | exit 0, `"status": "fresh"` |
| `generate-leaf-manifest.cjs --check .skilled/skills/system-skill-advisor` | exit 0 |
| `node --test turn-start.test.mjs` (Vibe) | `pass 15`, `fail 0` |
| `node --test tests/dsh-prompt-advisor.test.mjs` | `pass 20`, `fail 0` |
| Link check | exit 0 |
| Whole gate set again after merging `origin/main` | exit 0 on every gate, `Tests 2655 passed, 4 skipped (2659)`, no unhandled error, `PASS: DEEP-LOOP-GATE ... (cases=82)`, Vibe `pass 15` |
| Review rerun, generation 3 | `PASS`, 0 P0, 0 P1, 7 P2, `search_debt` 0, no failed gate. All seven P2s fixed in this packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A bare question that quotes a spelled count still gets an offer.** "why does it stop after ten iterations" names no loop, so the gate reads the count as a run request. The operator kept that behavior. The user can ignore the offer.
2. **The epic's derived graph status stays `in_progress`.** Child 003 closed with its guard not built, by recorded decision, so its six "Only on ship" tasks stay open and its graph status reads `in_progress`. The parent's status follows its children.
3. **The graph parser counts a ticked line that quotes `- [ ]` as an open task.** That parser belongs to system-spec-kit, outside this packet. 012's one such line was reworded.
<!-- /ANCHOR:limitations -->

---
