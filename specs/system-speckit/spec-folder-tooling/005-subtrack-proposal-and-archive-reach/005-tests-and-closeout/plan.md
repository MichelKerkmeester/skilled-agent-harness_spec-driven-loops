---
title: "Implementation Plan: Phase 5: tests-and-closeout"
description: "Write five vitest suites in runtime/cli/tests on the existing temp-repo pattern and the subtrack tree fixture. Run the full suite against the baseline, run the real-tree checks from the approved plan and close the packet with strict recursive validation."
trigger_phrases:
  - "tests and closeout plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: tests-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript test files run by vitest |
| **Framework** | vitest, `--project cli` from `.skilled/skills/system-spec-kit/vitest.config.ts` |
| **Storage** | Temp directories created and removed by each suite |
| **Testing** | `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` |

### Overview
This phase adds five test files under `.skilled/skills/system-spec-kit/runtime/cli/tests/`. Each builds a tree in its own temp directory and runs the real script. As built only `validate-archive-recursive.vitest.ts` uses `buildSubtrackTree`, and the other four build their trees with their own helpers. Proof is the five suites passing, the full `npm test` run compared with the baseline and six `RESULT: PASSED` lines from strict recursive validation of the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met. Ten rows of `acceptance-criteria.md` are `Met`. AC-008 names a real flat track, none is large enough, and it is `Superseded` by ADR-001 in `decision-record.md`. AC-009 closed when `generate-trigger-index.mjs --check` exited 0 at `f1cfed3d20`
- [x] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Temp-repo process tests

### Key Components
- **`relocate.vitest.ts`** (new file): no existing suite runs `relocate.mjs`, so its cases cannot extend one.
- **`suggest-subtracks.vitest.ts`** (new file): no existing suite runs `suggest-subtracks.mjs`.
- **`archive-numbering.vitest.ts`** (new file): `create-root-numbering.vitest.ts` covers one folder kind, and the specs root and subtrack depths need their own tree.
- **`rg-include-archive.vitest.ts`** (new file): pins the default argument vector, which no current suite asserts beside an archive variant.
- **`validate-archive-recursive.vitest.ts`** (new file): `validate-subtrack.vitest.ts` builds no archived packet.
- **`fixtures/subtrack-tree.mjs`** (unchanged): planned to gain an archived packet option when a suite needed one. None did.

### Data Flow
Each suite builds a tree in a temp directory, initializes git when the script needs it, runs the script and asserts on the exit code, the output and the files on disk. The temp directory is removed after each case.

### As Built
- DeepSeek V4.1 Flash wrote the five suites through the dsh harness, one file per dispatch. They are in commit `5fefd819e1`. Commit `36b3a68ab7` added one empty-input case each to `relocate.vitest.ts` and `suggest-subtracks.vitest.ts`, so the five files hold 33 cases.
- In `relocate.vitest.ts` the temp repository runs the real `relocate.mjs`, `refresh-track-roots.mjs` and `lib/track-roots.mjs`. The other follow-up tools, `repair-derived.cjs`, `sweep-track-roots.mjs`, `validate.sh`, `migrate-generated-json`, `generate-trigger-index.mjs` and `cite-drift-scan.mjs`, are stubs there. The full chain is covered only by the clone run in `tasks.md` T012.
- The proposal check ran on a 10-packet fixture track in a throwaway clone, because no real flat track holds more than eight live packets. The operator accepted the fixture, recorded as ADR-001 in `decision-record.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds tests and closes the packet. It changes no producer, policy or consumer. The one shared file it could have touched is the test fixture below, and it was left unchanged.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` `buildSubtrackTree` | Helper: builds the tree for the subtrack suites | unchanged, no suite needed an archived packet option | The full `npm test` run exits 0 with 0 failed |
| Existing suites that import the fixture | Consumer: `track-roots`, `validate-subtrack` and the parity suite | unchanged | `npx vitest run tests/subtrack-predicate-parity.vitest.ts` exits 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the baseline from phase 001 and the temp-repo pattern in `archive-track.vitest.ts`. Implementation writes the five suites under `runtime/cli/tests/`. Verification runs `npm test`, the real-tree checks and `validate.sh --strict --recursive` on the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The new tools are tested through their CLI | vitest |
| Integration | The five new suites, each running the real script in a temp repository | vitest, `git` |
| Manual | The six verification steps of the approved plan on the real tree and a throwaway clone. The search step ran `rg-wrapper.mjs` directly, the wrapper `/speckit:search` documents | `node`, `bash` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 004 | Internal | Green | No behavior to test. The code of all four is committed, and all four are closeable since the trigger index check exited 0 at `f1cfed3d20` |
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` | Internal | Green | Each suite would build its own tree |
| `scratch/baseline.txt` in `001-relocation-engine` | Internal | Green | No before-number for the regression claim |
| `vitest` 4.x in `runtime/cli/package.json` | External | Green | No runner |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new suite is flaky, meaning it fails in the full `npm test` order and passes alone.
- **Procedure**: Revert the commit that adds that suite. Test files change no behavior, so nothing else needs restoring.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004-archive-search-and-json | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
