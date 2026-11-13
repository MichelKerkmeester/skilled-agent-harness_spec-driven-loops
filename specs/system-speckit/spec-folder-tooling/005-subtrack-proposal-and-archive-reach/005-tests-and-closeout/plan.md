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
This phase adds five test files under `.skilled/skills/system-spec-kit/runtime/cli/tests/`. Each builds a temp repository with `buildSubtrackTree` and runs the real script as a child process. Proof is the five suites passing, the full `npm test` run compared with the baseline, and six `RESULT: PASSED` lines from strict recursive validation of the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-spec-kit/runtime/cli && npm test` exits 0 with no failure that the baseline run did not have
- [ ] Docs updated (spec/plan/tasks)
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
- **`fixtures/subtrack-tree.mjs`** (extended in place only if needed): gains an archived packet option when a suite needs one.

### Data Flow
Each suite builds a tree in a temp directory, initializes git when the script needs it, runs the script with `execFileSync` or `spawnSync`, and asserts on the exit code, the output and the files on disk. The temp directory is removed after each case.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds tests and closes the packet. It changes no producer, policy or consumer. The one shared file it may touch is the test fixture below.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` `buildSubtrackTree` | Helper: builds the tree for the subtrack suites | update only if a suite needs an archived packet | `rg -l "buildSubtrackTree" .skilled/skills/system-spec-kit/runtime/cli/tests` lists the consumers, and each still passes |
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
| Manual | The six verification steps of the approved plan on the real tree and a throwaway copy | `node`, `bash`, `/speckit:search` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 004 | Internal | Yellow | No behavior to test |
| `runtime/cli/tests/fixtures/subtrack-tree.mjs` | Internal | Green | Each suite would build its own tree |
| `scratch/baseline.txt` in `001-relocation-engine` | Internal | Yellow | No before-number for the regression claim |
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
