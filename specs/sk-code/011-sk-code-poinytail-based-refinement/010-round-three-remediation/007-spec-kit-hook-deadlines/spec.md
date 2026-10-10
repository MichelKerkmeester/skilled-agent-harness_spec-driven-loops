---
title: "Feature Specification: Phase 7: spec-kit-hook-deadlines"
description: "The spec-kit runtime hooks read stdin with no deadline, so a host that never closes stdin holds the hook until the host kills it. This phase gives the skill's shared readers a 3000 ms deadline and routes every reader through them."
trigger_phrases:
  - "spec kit hook deadlines"
  - "phase 7 spec kit hook deadlines"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: spec-kit-hook-deadlines

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/007-spec-kit-hook-deadlines` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-deep-loop-follow-ups |
| **Successor** | None |
| **Handoff Criteria** | Every spec-kit hook entry exits on its own at the stdin deadline with its usual fail-open answer, and the existing hook suites keep their counts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Round-three remediation child specification.

**Scope Boundary**: The stdin readers under `.skilled/skills/system-spec-kit/runtime/hooks/`, their compiled output in `runtime/dist/hooks/`, the two hooks READMEs that describe the readers, and the system-spec-kit version and changelog entry that ship them.

**Dependencies**:
- The round-two follow-up recorded in `../../009-round-two-follow-ups/005-hook-stdin-deadlines/plan.md` section 6
- The worked example `../../009-round-two-follow-ups/005-hook-stdin-deadlines/`, which made the same fix for `.skilled/hooks/`

**Deliverables**:
- A deadline in `runtime/hooks/lib/hook-adapter-shared.mjs` and a compiled twin, `runtime/hooks/shared-stdin.ts`
- Every listed reader routed through one of the two
- A table-driven test that holds stdin open on every hook entry, plus payload tests
- Rebuilt `dist/`, updated READMEs, a version bump and a changelog entry

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Fifteen stdin readers under `.skilled/skills/system-spec-kit/runtime/hooks/` loop `for await (const chunk of process.stdin)` or call `readFileSync(0)` with no deadline, and the eight spec-gate adapters reach the same unbounded loop through `lib/hook-adapter-shared.mjs`. With stdin held open, 30 of 32 runnable hook entries were still running when the planner's probe killed them at 9 seconds. Hosts reach several of these files through symlinks such as `.skilled/hooks/dispatch/cursor/post-tool-use.mjs`, so the round-two fix for `.skilled/hooks/` did not cover them.

### Purpose
Every spec-kit hook entry stops reading stdin at a deadline and answers exactly as it does on an empty payload, without importing anything from `.skilled/hooks/shared/`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Give `lib/hook-adapter-shared.mjs` the deadline semantics of `.skilled/hooks/shared/hook-adapter-shared.cjs`: settle on the end of the stream or after 3000 ms, return what arrived, release the listeners and pause stdin
- Add `shared-stdin.ts`, a TypeScript twin with the same deadline plus an optional byte cap, for the compiled adapters
- Route the 15 listed readers through one of the two readers, keeping each hook's fail-open answer and the 1 MB cap of the four `shared.ts` readers
- Add `lib/hook-stdin-deadline.test.mjs`, rebuild `dist/`, update the two hooks READMEs, bump system-spec-kit to 2.7.1.0 and add its changelog entry

### Out of Scope
- `claude/user-prompt-submit.ts`, a sixteenth reader the brief did not list. It reads with `readSync(0)`, its test suite runs the `.ts` source directly, so it cannot import a sibling module, and its host timeout is 3 seconds, so a 3000 ms deadline would add nothing. Recorded as a follow-up in `plan.md`
- Shorter deadlines for the entries their hosts time out at 3 seconds. The deadline stays 3000 ms, the same as the `.skilled/hooks` sibling
- The four pre-existing ESLint errors in `claude/user-prompt-submit.ts`, which this phase does not touch
- Hermes regeneration and the trigger-index rebuild, which the orchestrator runs

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` | Modify | `readStdin` gains the 3000 ms deadline and the header explains the two readers |
| `.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` | Create | `readHookStdin` for the compiled adapters, same deadline, optional byte cap |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Create | Deadline test over 32 entries and four payload tests |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` | Modify | Local reader delegates to the shared reader by dynamic import |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` | Modify | Private reader removed, shared reader imported |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` | Modify | Same |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` | Modify | `parseHookStdin` reads through `readHookStdin` |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` | Modify | `readCodexHookInput` reads through `readHookStdin` |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts` | Modify | `readCursorHookInput` reads through `readHookStdin` |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts` | Modify | `readDevinHookInput` reads through `readHookStdin` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` | Modify | `readInput` reads through `readHookStdin` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modify | The snapshot worker reads through `readHookStdin` |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` | Modify | Reader description, tree, key files and validation command |
| `.skilled/skills/system-spec-kit/runtime/hooks/README.md` | Modify | Tree, key files and validation command |
| `.skilled/skills/system-spec-kit/runtime/dist/hooks/` | Regenerate | `npm run build`; git-ignored, so it never shows in `git status` |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modify | `version: 2.7.1.0` |
| `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` | Create | Changelog entry for the deadline |
| `scratch/` of this folder | Create | Baseline outputs and the before and after status snapshots |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No unbounded stdin reader is left in the tree | `rg -n "for await \(const chunk of process\.stdin\)\|readFileSync\(0" .skilled/skills/system-spec-kit/runtime/hooks --glob '!**/dist/**' --glob '!**/node_modules/**'` prints nothing and exits 1 |
| REQ-002 | Every runnable hook entry exits on its own at the deadline with its fail-open answer when stdin stays open | `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` prints `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0` and exits 0. Before the edits it printed `ℹ pass 7` and `ℹ fail 30` |
| REQ-003 | The existing hook suites keep their counts | The vitest set prints `Test Files  16 passed (16)` and `Tests  290 passed (290)`, and `node --test tests/hooks/*.test.mjs` prints `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`, both the same as the Phase 1 baseline |
| REQ-004 | The tree stays self-contained | `rg -n "(from \|import\(\|require\()'[^']*hook-adapter-shared\.cjs'" .skilled/skills/system-spec-kit/runtime/hooks` prints nothing and exits 1 |
| REQ-005 | Every edited file parses, type-checks, lints and builds | `node --check` exits 0 on each edited `.mjs` and `.cjs` file and on the new test, `npm run typecheck` exits 0, ESLint exits 0 on the seven TypeScript files, `npm run build` exits 0 and the dist freshness check prints `All watched dist outputs are fresh.` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Entries reached through symlinks still run | Each of `.skilled/hooks/dispatch/cursor/post-tool-use.mjs`, `.skilled/hooks/completion/claude/completion-evidence-stop.cjs`, `.devin/hooks/post-compaction.cjs` and `.cursor/hooks/spec-gate-prebind.mjs` exits 0 on an empty stdin with its fail-open answer |
| REQ-007 | Each file carries exactly the planned edits | `python3 -I <folder>/scratch/build-units.py verify <folder>/scratch/before` printed `files=21 mismatches=2` at verification, the two being the deliberate review fixes (README row placement and the changelog claim). Amended at close-out: scratch/before held 64 copies of base-commit hook sources and was moved out of the packet before commit; rebuild it with `git archive 2a1554bc4a` of the planned paths |
| REQ-008 | The READMEs describe the readers and still validate | `validate_document.py` prints `VALID` and `Total issues: 0` for both READMEs, and the alignment verifier prints `[alignment-drift] PASS` |
| REQ-009 | The release is versioned | `SKILL.md` reads `version: 2.7.1.0` and `changelog/v2.7.1.0.md` validates as a changelog with 0 issues |
| REQ-010 | Only the planned files change | The after-status diff against `scratch/status-before.txt` shows the planned modified and untracked paths and nothing else |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A host that never closes stdin no longer holds any listed spec-kit hook: each one exits on its own within 10 seconds, at the 3000 ms deadline or at the 1800 ms budget the Claude lifecycle hooks already had.
- **SC-002**: No hook's answer changes on an empty or invalid payload: the comparison against the answers recorded on the unedited tree prints `cases=64 mismatches=0`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `dist/` must be built for the compiled entries | The new test fails on the compiled entries until `npm run build` runs | The build is a Phase 2 task that runs before any verification |
| Risk | Two readers can drift apart | Med | Both carry a header that names the other, and the one test spawns entries of both kinds |
| Risk | Entries their hosts time out at 3 seconds gain little from a 3000 ms deadline | Low | Recorded in `plan.md`. Those hosts still kill the hook at 3 seconds, as today |
| Risk | `edge-cases.vitest.ts` swaps `process.stdin` for an object with only an async iterator | Low | The compiled reader attaches listeners before its timer, so that stub rejects at once, `parseHookStdin` returns `null`, and the two tests still pass. Confirmed in the planner's run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The sixteenth reader, `claude/user-prompt-submit.ts`, is a recorded follow-up in `plan.md`, not a question for this phase.
<!-- /ANCHOR:questions -->

---

