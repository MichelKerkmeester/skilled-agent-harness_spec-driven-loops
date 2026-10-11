---
title: "Implementation Summary: Onboarding fixes"
description: "A fresh clone that follows only the numbered README steps now reaches a routed advisor request and a valid spec packet, and each onboarding failure names its cause."
trigger_phrases:
  - "onboarding fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/021-open-ends-remediation/002-onboarding-fixes"
    last_updated_at: "2026-10-11T20:40:00Z"
    last_updated_by: "onboarding-fixes-builder"
    recent_action: "Built and reviewed the onboarding fixes"
    next_safe_action: "Integrate the branch"
    blockers: []
    key_files:
      - "README.md"
      - ".skilled/bin/lib/mirror-sync-verify.cjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-021-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Onboarding fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-onboarding-fixes |
| **Completed** | 2026-10-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A fresh clone that follows only the numbered steps in `README.md` now reaches a routed advisor request and a valid first spec packet. On the way, every failure the research found now names its cause: Pi and Codex name the missing spec-kit build, sk-vision names Bun, and the mirror gate says it could not check instead of claiming drift.

### Phase 2: onboarding-fixes

The README install block gained a spec-kit build step, an ordering note and a hook-trust step, lost a promise the advisor launcher never kept, and now states Node 24.x as the one line every part accepts. First Use names all seven runtimes. The agent mirror checker exits 3 when its built parser is missing or fails to load, and both pre-commit hooks warn and skip on that code while still blocking drift.

### Recommendation Ledger

| ID | Status | Proof or reason |
|----|--------|-----------------|
| R1 | Fixed | `grep -c "installs and builds its own runtime" README.md` printed 0, and on a pristine clone `node .skilled/bin/skill-advisor.cjs list-tools --format json` exited 0 after the numbered steps |
| R2 | Fixed | `grep -n "24.x for a full install" README.md CONTRIBUTING.md` printed one line in each file, and `grep -c "18+" CONTRIBUTING.md` printed 0 |
| R3 | Closed | Closed by operator decision of 2026-10-11, which keeps `bypassPermissions` in the tracked `.claude/settings.json`, so nothing in that file changes |
| R4 | Fixed | On a pristine clone, README step 3 `npm --prefix .skilled/skills/system-spec-kit run build` exited 0 and `runtime/dist/hooks/claude/session-prime.js` then exited 0 |
| R5 | Fixed | `vitest run tests/session-start-context-pi-extension.vitest.ts` printed 2 passed, with the unbuilt case asserting one warning that names the build and the directory |
| R6 | Fixed | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` printed `PASS: 4 registration files match`, and `.codex/hooks.json` no longer contains `codex hooks installer` |
| R7 | Fixed | `grep -n "bun install && bun run build" .skilled/skills/sk-vision/SKILL.md` printed the Setup paragraph under the skill's opening |
| R8 | Fixed | On a pristine clone, README step 5 `git config --local skilled.trustRepoHooks true` exited 0 |
| R9 | Fixed | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` printed 100 passed, 0 failed, and the mirror vitest suites printed 13 passed |
| R10 | Fixed | `grep -n "Run it after step 2" README.md` printed step 4, and on a clone the advisor build run before step 2 exited 1 with 150 TS2591 errors |
| R11 | Fixed | `grep -n "seven supported runtimes" README.md` printed the First Use line, and each runtime's command or prompt file exists |
| R12 | Closed | Build nothing, per prevent-overengineering and the research: no observed failure names the empty root files or dangling symlinks |
| R13 | Closed | Build nothing, per prevent-overengineering and the research: no requirement exists that moving the compiled-routing source would serve |
| R14 | Closed | Build nothing, per prevent-overengineering and the research: no worktree is needed before the first spec packet |

### Tests

| ID | Test | Before | After |
|----|------|--------|-------|
| T1 | `.skilled/bin/check-agent-mirror-sync.vitest.ts` unbuilt-parser case | before: exit 1 | after: exit 0 |
| T2 | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` case 64 | before: exit 1 | after: exit 0 |
| T3 | `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` drift-message case | before: exit 1 | after: exit 0 |
| T4 | `.skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts` unbuilt case | before: exit 1 | after: exit 0 |
| T5 | `.skilled/bin/check-agent-mirror-sync.vitest.ts` corrupt-parser case | before: exit 1 | after: exit 0 |
| T6 | `.skilled/skills/system-spec-kit/runtime/tests/session-start-context-pi-extension.vitest.ts` directory assertion | before: exit 1 | after: exit 0 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | R1, R2, R4, R8, R10, R11 |
| `CONTRIBUTING.md` | Modified | R2 |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-context.ts` | Modified | R5, the source of the `.pi/extensions` symlink |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.codex/hooks.json` | Modified | R6, the second regenerated |
| `.skilled/skills/sk-vision/SKILL.md` | Modified | R7 |
| `.skilled/bin/lib/mirror-sync-verify.cjs`, `.skilled/bin/check-agent-mirror-sync.cjs` | Modified | R9 checker |
| `.skilled/scripts/git-hooks/pre-commit`, `.skilled/hooks/git/pre-commit` | Modified | R9 hooks |
| `.skilled/hooks/git/README.md`, `.skilled/scripts/git-hooks/README.md` | Modified | Review fix R2-P2-001 |
| Four test files and two changelog entries | Created or modified | T1 to T6, system-spec-kit 2.7.11.0, sk-vision 0.3.6.0 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash at `--thinking max` through cli-pi on DevPass wrote every change from a one-change brief with literal text, and the orchestrator reviewed each diff. Each code row got its test first, run red before the fix. The README path was proven on a pristine clone of this branch's HEAD on Node 24.9.0: steps 2 to 5 each exited 0, `advisor_recommend` exited 0 routing to system-spec-kit at 0.95, and `create.sh` plus `validate.sh` made a first spec packet that printed `RESULT: PASSED`. A five-iteration `/deep:review` over the commits passed with seven P2 advisories, recorded in `review/review-report.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Exit 3 means not checkable | Phase 001 gives the same checker exit 2 for a usage error, so 3 keeps the two meanings apart |
| Both pre-commit hooks change | The research cited the legacy helper, but the installed hook is `.skilled/scripts/git-hooks/pre-commit` and carried the same false desync |
| The checker's catch block changes, its argument parsing does not | Phase 001 edits the parsing lines, so the merge stays line-disjoint |
| The Pi notice fires only when the adapter file is missing | A built adapter that prints nothing is not a build problem, so a notice there would be noise |
| R1-P2-001 left as is | The changelog mode never sets a README's version, which is the document's own |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pristine clone, README steps 1 to 5 | PASS, every step exit 0 on Node 24.9.0 |
| First routed request | PASS, `advisor_recommend` exit 0 |
| First spec packet | PASS, `validate.sh` printed `RESULT: PASSED` |
| `pre-commit.test.sh` | PASS, 100 passed, 0 failed (95 before this phase) |
| Mirror vitest suites | PASS, 13 passed (11 before this phase) |
| `hook-registration-sync.vitest.ts` | PASS, 7 passed (6 before this phase) |
| `hvr_scan.py` on edited docs | PASS, 0 hard blockers, no ceiling lower than before |
| `/deep:review` five iterations | PASS, 0 P0, 0 P1, 7 P2: six fixed, one rejected by contract |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CONTRIBUTING.md still fails one validator rule.** `validate_document.py` applies README rules to it and asks for an overview section. That error predates this phase and the count is unchanged.
2. **Version numbers may collide at integration.** Sibling phases may bump system-spec-kit or sk-vision too, and the integrator renumbers.
3. **The first spec packet was proven with the CLI.** The probe ran `create.sh` and `validate.sh`, the scripts `/speckit:complete` drives, not an interactive runtime session.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations

| Item | Note |
|------|------|
| Hand edits | `review/review-report.md` is written by the review workflow's own synthesis step, and the `pre-commit.test.sh` exec bit was restored with `chmod +x` after a builder rewrite dropped it. No other file was edited by hand |
| Out-of-table files | The installed pre-commit hook, the checker CLI, both hook READMEs and one em dash in sk-vision's SKILL.md changed so the fixes and the doc gates hold |
| Builder fallback | Not needed: every DevPass dispatch returned |
<!-- /ANCHOR:deviations -->
