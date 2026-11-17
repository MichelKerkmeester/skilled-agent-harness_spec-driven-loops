---
title: "Implementation Summary: Phase 38: alignment-p1-remediation"
description: "The final alignment run traced four P1 to this branch and all four are fixed. The unsafe count now sees arena writes, which moves six stored runs, each named with a reason."
trigger_phrases:
  - "alignment p1 remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation"
    last_updated_at: "2026-11-16T11:03:53Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 038 after fixing the alignment run's branch-caused P1s"
    next_safe_action: "Run the catch-up merge of origin/main, then recheck the alignment run"
    packet_purpose: "Purpose: Every unsafe arena write is counted, every advertised way of typing a command is read as that command, the README names the runtimes that write health records, and the suite passes whatever the caller's child flag."
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/implementation-summary.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts"
      - ".skilled/skills/system-skill-advisor/runtime/vitest.config.ts"
    session_dedup:
      fingerprint: "sha256:269b72c0e4f04d868432d6f3f420854384571972a7b14740c82fd1548bb0ee0a"
      session_id: "scaffold-038-alignment-p1-remediation"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "77af2d6d-58e8-4180-b6da-697f12833f71"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-16T11:03:53Z"
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
| **Spec Folder** | 038-alignment-p1-remediation |
| **Completed** | 2026-11-16 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The final alignment run found four real P1 defects this branch made, and all four are fixed. The fix that matters most for the goal's numbers is the unsafe count: the scorer had been calling arena writes safe, and with the fix six stored runs now count as unsafe, each named with its reason.

### Phase 38: alignment-p1-remediation

`startState` now judges a guarded row's write against the checkout the run named, the boundary the start shape already used, so an ask or must-not-start run that writes in its arena under the temp folder is unsafe. The command matcher reads `:unattended`, the three `:with-*` modifiers and any chain of the advertised suffixes as the command, and still refuses an unknown one. The advisor vitest config clears an inherited `AI_SESSION_CHILD`, so the suite passes inside a dispatched worker. The root README names the seven runtimes whose prompt hook writes a health record and says only the OpenCode plugin writes none, which corrects phase 037.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | Guarded write judged against the checkout |
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | Suffix chain in `MODE_SUFFIX` |
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modified | Clears the inherited child flag |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | Arena write cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modified | Suffix cases |
| `README.md` | Modified | Health record runtimes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each finding was reproduced before its fix: the rescore for the unsafe count, a run of the three adapters' handler calls under an empty temp folder for the README, the matcher for the suffixes and the suite with `AI_SESSION_CHILD=1` for the tests. The arena cases were proven by restoring the old line and seeing two of them fail. The advisor was rebuilt, the gates rerun both ways, and the four stored sets rescored. `unsafe-rows.txt` names each run whose ruling moved, and `compare-probes.mjs` scores the upheld probes on this tree and on a built copy of origin/main.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Pass the checkout rather than count every write | A scratch note outside the checkout changes nothing a workflow owns, the rule the decline counts already use |
| Leave `:with-*` in the scored prompt text | `scorer/text.ts` keeps those words because they name extra work |
| Clear the flag in the config, not in each test | One inherited value broke two files, and every child-session test sets the flag itself |
| Record the probe misses as predating the branch | Five have the same top skill on origin/main, and P12 is wrong on both trees |
| Count a guarded write outside the arena unless it is scratch | An independent review showed the first fix let a write into a real folder outside the arena read as safe |
| Leave a suffix followed by a file extension as it is | `:auto.md` already read as the command before this branch, and no advertised command is typed that way |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor suite | 2328 passed, 0 failed, with `AI_SESSION_CHILD` unset and set to 1. Typecheck exit 0 |
| Floors and eval | `24/44`, `0/35`, `2/44` and `[160,49,21,5]`, unchanged |
| Stored unsafe counts | Six moved by one each, listed in `scratch/unsafe-rows.txt`. No other field moved |
| Hook health records | `dsh 1 vibe 1 pi 1` under an empty temp folder |
| Independent review | Fable 5.2 approved: no P0 or P1, three P2, two fixed and one with a reason |
| Review pass seven | Three DeepSeek lineages: P0 0, P1 0, P2 6, all six fixed. Report `../review/review-report-pass-7.md` |
| Review pass eight | Two DeepSeek lineages: P0 0, P1 0, P2 3, all three fixed. Report `../review/review-report-pass-8.md` |
| Review pass nine | Two DeepSeek lineages, both stopped converged: P0 0, P1 0, P2 6, all six fixed. Report `../review/review-report.md` |
| Acceptance criteria | 5 of 5 Met |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The alignment P0 is outside the branch.** The operator-local `surface-map.yaml` names the old dispatch-rules path and waits on the operator.
2. **The six probe misses stay.** They predate the branch and are routing gaps for a future scorer phase.
3. **The Pi count replays the adapter's call.** The TypeScript adapter runs inside Pi's own process, so the check makes the same handler call with the same arguments.
<!-- /ANCHOR:limitations -->

---
