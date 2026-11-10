---
title: "Feature Specification: Phase 7: hook-deadline-margins"
description: "The Claude prompt-submit shim still blocks on a stdin its host never closes, and the seven spec-kit hook entries whose host allows 3 seconds read stdin with a deadline that leaves no time for the work after the read."
trigger_phrases:
  - "hook deadline margins"
  - "phase 7 hook deadline margins"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: hook-deadline-margins

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/007-hook-deadline-margins` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-deep-loop-findings-parser |
| **Successor** | None |
| **Handoff Criteria** | The shim exits on its own with stdin held open, every 3 second entry exits at least 1000 ms inside its host timeout, and the deadline test passes 39 of 39 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Round four children specification.

**Scope Boundary**: Stdin deadlines inside `.skilled/skills/system-spec-kit/runtime/hooks/`, the deadline test there, three hook READMEs, the system-spec-kit version line and one new changelog file. Host timeouts in runtime settings and in `cli/runtime-mirrors/hook-registry.json` do not change.

**Dependencies**:
- Known Limitations 1 and 2 in `../../010-round-three-remediation/007-spec-kit-hook-deadlines/implementation-summary.md`
- Decisions D2 and D5 and the follow-up in section 6 of `../../010-round-three-remediation/007-spec-kit-hook-deadlines/plan.md`
- The 3 second host timeouts in `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, read only

**Deliverables**:
- A bounded, inlined stdin read with a 500 ms deadline in `runtime/hooks/claude/user-prompt-submit.ts`
- A 500 ms stdin deadline for the seven entries whose host timeout is 3 seconds
- The shim added to `runtime/hooks/lib/hook-stdin-deadline.test.mjs`, plus a test that a short-deadline entry still acts on a payload its host writes but never closes
- `system-spec-kit` version 2.7.2.0 and `changelog/v2.7.2.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`runtime/hooks/claude/user-prompt-submit.ts` reads stdin with a `readSync(0, ...)` loop, so a host that keeps stdin open holds it until the host kills it. A probe on the unedited tree killed it at 12 seconds. Seven entries are registered with a 3 second host timeout, yet five of them read stdin with a 3000 ms deadline and exit after about 3.0 to 3.3 seconds when stdin stays open. The Claude `SessionStart` and `PreCompact` hooks give up at their 1800 ms budget first and drop a payload that had already arrived.

### Purpose
Every spec-kit hook entry stops reading stdin on its own, and every entry with a 3 second host timeout finishes its work with at least 1000 ms to spare.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the shim's `readSync` loop with an inlined, event-based read that settles at a 500 ms deadline and keeps the 1 MB cap and every fail-open answer
- Add `SHORT_HOST_STDIN_TIMEOUT_MS = 500` to `shared-stdin.ts` and `lib/hook-adapter-shared.mjs`, and pass it from the seven 3 second entries
- Update the deadline test so it covers all sixteen readers and holds the 3 second entries to an exit under 2500 ms
- Remove the four unused imports from the shim, which the rewrite makes possible
- Describe the shorter deadline in three hook READMEs, bump the version and write the changelog

### Out of Scope
- Host timeouts in `.claude/settings.json`, `.codex/hooks.json` and `cli/runtime-mirrors/hook-registry.json` - the operator's decision, see the parent spec
- The 1800 ms `withTimeout` budget in the Claude lifecycle hooks - THE FIX keeps it
- The shim's 2500 ms child timeout and the Codex adapters' 2800 ms child timeout - their own suites pin them, see plan.md D6
- The pre-existing unused `HookInput` import in `runtime/hooks/claude/session-prime.ts` - THE FIX names only the four in the shim
- The Hermes mirror, the trigger index and its retrieval fixtures, and the parent changelog - orchestrator steps

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` | Modify | Inlined deadline read, async shim, four unused imports removed |
| `.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` | Modify | `SHORT_HOST_STDIN_TIMEOUT_MS = 500` |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` | Modify | The same constant for the plain adapters |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` | Modify | `parseHookStdin(timeoutMs)` with a 3000 ms default |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` | Modify | `readCodexHookInput(..., timeoutMs)` with a 3000 ms default |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` | Modify | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modify | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` | Modify | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` | Modify | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` | Modify | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` | Modify | Passes the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Modify | Shim entry, short-host bounds, held-open payload test |
| `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | Modify | `shared-stdin.ts` row names the short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` | Modify | The classifiers' short deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` | Modify | The shim's own deadline |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | `version: 2.7.2.0` |
| `.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md` | Create | Changelog entry |
| `.skilled/skills/system-spec-kit/runtime/dist/hooks/` | Regenerate | `npm run build` output, git-ignored |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The shim's stdin read is bounded | `grep -n 'readSync' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints nothing and exits 1, and the deadline test's `dist/hooks/claude/user-prompt-submit.js` subtest passes |
| REQ-002 | The shim keeps its answers and its suite | `compare-fail-open.mjs` prints `cases=66 mismatches=0`, and `tests/user-prompt-submit-shim.vitest.ts` passes 8 of 8 inside the vitest hook set |
| REQ-003 | Every 3 second entry leaves a clear margin | `measure-open-stdin.mjs` prints `entries=7 late=0` and exits 0: each entry's median exit with a payload written and stdin held open is at most 2000 ms |
| REQ-004 | The deadline test covers all sixteen readers | `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` prints `ℹ tests 39`, `ℹ pass 39` and `ℹ fail 0` |
| REQ-005 | The existing hook suites keep their counts | The vitest hook set prints `Tests  290 passed (290)`, and `node --test tests/hooks/*.test.mjs` prints `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0` and `ℹ skipped 3` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Longer host timeouts keep 3000 ms and the 1800 ms budget stays | `HOOK_STDIN_TIMEOUT_MS = 3000`, `readStdin({ timeoutMs = 3000 }`, `HOOK_TIMEOUT_MS = 1800` and `parseHookStdin(), HOOK_TIMEOUT_MS, null` in `claude/session-stop.ts` each match once |
| REQ-007 | The edited code type-checks, lints and builds | `npm run typecheck` exits 0, ESLint on the seven edited TypeScript files other than `session-prime.ts` exits 0, ESLint on `session-prime.ts` shows only its one pre-existing `HookInput` error, `node --check` passes on the four edited `.mjs` files, and the freshness check prints `All watched dist outputs are fresh.` |
| REQ-008 | The release is versioned | `SKILL.md` carries `version: 2.7.2.0`, `changelog/v2.7.2.0.md` validates as a changelog with 0 issues, and `changelog/v2.7.1.0.md` is unchanged |
| REQ-009 | The hook READMEs describe the short deadline | Each of the three READMEs carries its new sentence and still prints `VALID` with `Total issues: 0` |
| REQ-010 | Only the planned edits landed | `build-units.py verify` prints `files=17 mismatches=0`, and the scope diff shows 16 modified files and 1 untracked file under the owned paths |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No spec-kit hook entry is held by a stdin its host never closes: all 33 deadline subtests exit on their own
- **SC-002**: Every entry registered with a 3 second host timeout finishes with at least 1000 ms to spare when its host writes the payload and keeps stdin open
- **SC-003**: The short-deadline entries still act on a payload written to a stdin that stays open: the shim forwards it to its advisor, Claude `SessionStart` prints its context, Claude `PreCompact` logs the session and Codex `SessionStart` answers
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `runtime/dist/` built from the edited sources | The deadline test runs the compiled entries, so a stale build fails it | `npm run build`, then the freshness check, before any Phase 3 test |
| Risk | A host writes its payload more than 500 ms after it starts the hook and never closes stdin | Low | The hook takes its existing empty-payload answer, as it does today on an empty stdin. Hosts write the payload at spawn |
| Risk | The shim's advisor child or a Codex adapter's child runs to its own kill timeout while stdin is held open | Low | 500 ms plus the 2500 ms or 2800 ms child cap passes 3 seconds, so the host still kills that case. Today the same case never ends. Recorded in plan.md D6 |
| Risk | All 33 entries start at once in the deadline test and slow each other | Med | The short-host upper bound is 2500 ms, about four times the 641 ms worst median the planner measured. The planner's three runs on the edited copy passed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The deadline value, the entries it covers and the residual child-timeout case are decided in plan.md D2, D3 and D6.
<!-- /ANCHOR:questions -->

---
