---
title: "Implementation Summary: Phase 7: open-findings-follow-up"
description: "All six findings phase 006 left open are fixed: two advisor routes, the coverage sentence, the cli-opencode skill on OpenCode 2.3.0, a stdin crash in four deep-loop scripts and a spec-kit build that left the dist stale."
trigger_phrases:
  - "open findings follow up implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/007-open-findings-follow-up"
    last_updated_at: "2026-11-15T10:29:58Z"
    last_updated_by: "generate-context"
    recent_action: "Republished the release tag and notes with the deep-loop section"
    next_safe_action: "None; packet closed"
    packet_purpose: "Purpose: Each of the six findings is fixed and proved by a command, or is named not fixed with the numbers that blocked it."
    blockers: []
    key_files:
      - ".skilled/changelog/skilled/v4.0.2.1.md"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:6fc4d9edcbac9ef4751a6131a4ec242758ea41dffc817e57cc4d0b24281a545d"
      session_id: "scaffold-007-open-findings-follow-up"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "6b959364-9580-45bd-923d-efd800111a7f"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-15T10:29:58Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 7: open-findings-follow-up

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-open-findings-follow-up |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The six findings phase 006 left open are all fixed. A runner can now hand the deep-loop scripts any stdin without a crash, and one top-level spec-kit build leaves a dist the validator accepts.

### Phase 7: open-findings-follow-up

"deep review this branch" now reaches `system-deep-loop` with `/deep:review`, and a question about the AI council reaches `/speckit:ai-council`. Both changes are phrase boosts in the explicit lane, and the corpus numbers did not move. The coverage sentence in the command contract names the three commands it leaves out. The cli-opencode skill states what was checked on OpenCode 2.3.0, including the two subcommands that moved.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/{convergence,query,status,upsert}.cjs` | Modified | The TSX child inherits stdin, so the parent never reads it |
| `.skilled/skills/system-deep-loop/runtime/tests/integration/bootstrap-stdin.vitest.ts` | Created | Runs the four scripts with an open stdin and checks `upsert --events -` still reads it |
| `.skilled/skills/system-spec-kit/package.json` | Modified | `build` runs the runtime prepare and finalize steps around the compile |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/test-dist-freshness.sh` | Modified | Backs up and restores the real freshness records it used to delete |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modified | The coverage sentence |
| `.skilled/skills/cli-external-orchestration/cli-opencode/` docs and `changelog/v1.5.12.0.md` | Modified, Created | `opencode auth` and `opencode debug agents` on 2.3.0, version 1.5.12.0. Main already verified 2.3.0 and moved the install pin in its own 1.5.11.0 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` | Modified | Two phrase boosts |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` | Modified | The two prompts pinned as golden cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each fix started with a reproduction that failed. The stdin test failed 4 of 5 cases with `EAGAIN` on the old bootstrap. A whitespace edit plus the old build left the validator reporting a stale dist. The two golden cases failed with `sk-git` and `sk-code` at #1. After each change the same check passed. The advisor gates, both test suites and the dist checks were then rerun against the phase 006 Final column.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Phrase boosts with a bounded rival penalty, not a lane rule | Both rivals saturate the explicit and lexical lanes, and the lane already uses this pattern for `findings stop changing` and `:review:auto`. Only prompts that contain the phrase move |
| No Python mirror change | `skill_advisor.py` already ranks both prompts on target |
| The install pin in `opencode-setup.sh` is 2.3.0 | The operator approved the move. Main made the same change in its own 1.5.11.0, so after the merge the pin comes from main and this branch adds no change to the script |
| No advisor version bump | Earlier scorer fixes such as `acf206285e` did not bump it |
| The merge with main keeps the council retirement and ports main's council-agent changes | The operator chose it. The agent takes main's Depth 1 default, simulated vantage lenses and Lead Thresholds table, and keeps its inline persistence sections, because the mode references main moved them into are retired |
| Main's one-round-per-call council model is not ported | It relies on `/deep:ai-council` running the round loop. `/speckit:ai-council` dispatches the agent once, so one round per call would end every council after its first round |
| Main's single-executor DeepSeek Harness branch moves into `dispatch-iteration.cjs` | This branch replaced the inline workflow heredocs with that script, so the harness home, completion check, spec-gate env and shorter child timeout live there, with a `--spec-folder` flag the harness alone needs |
| Main's `:confirm` unsupported-executor guard is not ported | The single workflow file runs every executor kind in both modes through the script, so the guard would refuse kinds that work |
| Main's stdin fix in the runtime scripts gives way to this branch's | Both fixed the same eager read. This branch lets the child inherit stdin, which also covers `upsert`, and the stdin test checks all four |
| The root README's council text moves from Deep Loop to Spec Kit | The operator noted the README still listed the council under Deep Loop. The sub-section now sits in the Spec Kit section and the agent entry in the agent orchestration group |
| A second merge brings in main's Mistral Vibe runtime | Main moved while the gates ran. The Vibe mirrors are resynced without the retired council prompt and skill link, main's Vibe fan-out refusal stays inline in both workflows, and the delegation bucket and its test pins move from 20 to 22 for the two Vibe cases main added |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisor golden prompts | PASS, 39 passed, up from 37 |
| Advisor ratchets: scorer-eval, local-native divergence, holdout-independent | PASS, 22 passed, same as baseline |
| Advisor drift and parity | PASS, 14 passed, same as baseline |
| `score-routing-corpus.py` with the drift-gate floors | PASS, accuracy 0.6 (117/195), gate3 f1 0.9843, TT 114 FT 3 FF 1, identical to baseline |
| Advisor `npm test` and typecheck | PASS, 1710 passed, up from 1708, typecheck exit 0 |
| Deep-loop runtime `npm test` and typecheck | PASS, 2909 passed, up from 2904, typecheck exit 0 |
| `test-dist-freshness.sh` | PASS, 4 passed, the freshness record still present afterwards |
| cli-opencode script tests | PASS, 27 passed across four files |
| Spec-kit CLI suite | Same as baseline, one failing test, `typo-flags`. Two files timed out on a 10 second hook in the full run under load average 29 and pass 10/10 run alone |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The setup helper was not run in an install mode.** Only its read-only `check` mode ran, which shows this machine already on 2.3.0 at the link the helper creates. A machine on 2.1.4 moves when its owner reruns the helper.
2. **Five gates still fail as they did before phase 006.** They are `corpus-pin`, `hub-vocabulary-source`, `broken-tracked-symlinks`, `command-router-drift` and the one spec-kit CLI test that runs that drift check. Each needs its own packet.
<!-- /ANCHOR:limitations -->
