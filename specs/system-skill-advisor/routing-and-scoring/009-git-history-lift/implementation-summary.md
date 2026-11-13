---
title: "Implementation Summary"
description: "Read-only git history questions now reach sk-git through one guarded branch in the advisor's read-only gate, proven by scorer tests, the full suite and live probes."
trigger_phrases:
  - "git history lift implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/009-git-history-lift"
    last_updated_at: "2026-11-13T12:03:15Z"
    last_updated_by: "generate-context"
    recent_action: "Implemented and verified the sk-git history lift, uncommitted"
    next_safe_action: "Review the diff in worktree 365 and commit it"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts"
      - ".skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts"
    session_dedup:
      fingerprint: "sha256:18909bfcc0a8f6569246190574e4d1361c14837eeabbb74dbebfe49e907f326c"
      session_id: "scaffold-009-git-history-lift"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-git-history-lift |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A read-only question about git history now routes to sk-git. `show the git log`, `show me what changed in the last three commits` and `compare branches main and develop` each return sk-git at 0.82, where the advisor returned no recommendation before.

### Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor

You can ask the advisor a plain history question and get the git skill. The lift applies only to a read-only question that names git, a commit-history object or one of the branches main, master and develop. A prompt that merely shares a word with git history, such as a question about decision tree branches, is routed as it was.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | One guarded sk-git branch added as the last check in `readOnlyRouteAllowed` |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Modified | The bare-suffix assertion moved to sk-doc, and two tests added for the lifted and the floored prompts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A Codex worker on `gpt-6-luna` at xhigh made the two edits from literal text in `plan.md`, in worktree 365. The orchestrating session read the diff, then ran the scorer tests, the type check, the whole suite, and the live probes after `npm run build`. The whole suite ran on the unmodified main checkout first as the baseline. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Guard the lift with `isReadOnlyExplainer` | A lift raises the skill to at least 0.82 on any prompt, so without the guard a write request that mentions git would be floored up as well |
| Drop `blame` and `who changed` from Barter's block | Each lifted an unrelated prompt in review, and no measured history question needs them |
| Name main, master and develop in the branch alternative | A bare `branches` lifts a question about decision tree branches. A prompt that says `git branches` is still lifted by the word git |
| Move the bare-suffix test to sk-doc | `list the git branches` is a history question and now lifts. The test's intent, that a non-cli skill is not named by its suffix, holds on `list the doc templates` |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/scorer/route-gates.vitest.ts` | PASS, 21 passed of 21. 19 before the edit |
| `npm run typecheck` | PASS, exit 0 |
| `npx vitest run` on main, the baseline | 1720 tests, 1714 passed, 0 failed, 6 pending |
| `npx vitest run` with the lift, quiet machine | PASS, exit 0. 1722 tests, 1716 passed, 0 failed, 6 pending |
| `tests/parity/local-native-divergence-ratchet.vitest.ts` | PASS, 9 tests, inside the suite run |
| `advisor_recommend` on the three REQ-001 prompts, after `npm run build` | PASS, each returns `sk-git@0.82` |
| `advisor_recommend` on `explain how the decision tree branches are pruned` and `show me the plan` | PASS, no recommendation |
| `advisor_recommend` on `add a blame column to the incident report table` | PASS, `sk-doc@0.82` and no sk-git |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A first suite run failed one timing test.** `tests/legacy/advisor-freshness.vitest.ts` expects a probe under 5 ms and measured 16 ms while two suites and four workers shared the machine. It passed alone and in the quiet rerun. Run the suite on an idle machine.
2. **A branch question that names neither git nor main, master or develop is not lifted.** `compare branches release and hotfix` stays floored. Say `git branches` to lift it.
3. **`what changed in the last 5 commits` is not covered by the lift.** It carries no read-only verb, so it is scored normally. It routes to sk-git here already. Barter needs its own metadata for it before dropping its overlay.
<!-- /ANCHOR:limitations -->

---
