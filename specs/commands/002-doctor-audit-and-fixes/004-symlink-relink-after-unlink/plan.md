---
title: "Implementation Plan: Phase 4: symlink-relink-after-unlink"
description: "Give each symlink apply a run folder no earlier run owns, by claiming the digest prefix or the next numbered name with an exclusive mkdir, and let unlink accept those names for the recorded digest."
trigger_phrases:
  - "symlink relink after unlink plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: symlink-relink-after-unlink

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) |
| **Framework** | None, Node built-ins only |
| **Storage** | Run records as `manifest.json` files under `<source>/.skilled/output/doctor-symlink/` |
| **Testing** | `node:test` through `node --test` and `run-all.sh` |

### Overview
`createRunRecord()` stops deriving one fixed folder from the digest and instead claims the first free name in the sequence `<prefix>`, `<prefix>-2`, `<prefix>-3` with a plain `mkdir`, which fails on an existing folder. `runUnlink()` replaces its exact-name check with a check that the run folder sits directly in the runs root and its name fits that sequence for the recorded digest. A regression test drives link, unlink and relink of one plan, red before and green after.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` prints `fail 0`, and `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `0 failed`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Exclusive-create claim loop.

### Key Components
- **`createRunRecord(source, digest, root)`**: makes the runs root through real directory components, then claims the first free run folder and writes `manifest.json` with `wx`.
- **`runNamePattern(digest)`**: states which folder names a digest owns; the unlink check uses it, and the claim loop only produces names it matches.
- **`runUnlink(options)`**: confirms the `--run` folder's parent is the runs root and its name fits `runNamePattern(record.digest)`.

### Data Flow
`apply` recomposes the plan, checks the digest, calls `createRunRecord()` and prints `run record:` and the `unlink --run <dir> --dry-run` undo line with the folder it claimed. `unlink` reads that folder's manifest, checks the folder against the recorded source and digest, and undoes only what the manifest lists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `symlink-engine.cjs` `createRunRecord()` | Producer of the run folder name | update | Relink test green; `rg -n "slice\(0, 16\)" symlink-engine.cjs` prints no line |
| `symlink-engine.cjs` `runUnlink()` | Consumer that rebuilds the expected folder from the digest | update | Relink test unlinks the numbered run; edge test refuses three misnamed copies |
| `symlink-engine.cjs` apply output | Prints `run record:` and the undo line from `created.runDir` | unchanged | Reads the claimed folder, so it names the numbered folder without change |
| `doctor-symlink-link.yaml`, `symlink.md`, `_routes.yaml` | State the run-folder name | update | `rg -n "prefix>-2" .skilled/commands/doctor` prints three lines |
| `doctor-symlink-unlink.yaml`, `doctor-symlink-presentation.txt` | Pass the `--run` folder the apply printed | not a consumer | They take the folder as given and never derive its name |
| `agents-md-embed.cjs` | Names its own backup folder from a digest | not a consumer | Separate folder and separate engine; out of scope |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-symlink.md` | States the first-apply name in a fresh scratch repository | unchanged | A first apply still gets the plain `<prefix>` name |

Required inventories:
- Same-class producers: `rg -n "doctor-symlink|RUNS_PATH|runDir|digest.slice" .skilled/commands/doctor` found two `digest.slice(0, 16)` sites in the engine (the producer and the unlink check) and one in `agents-md-embed.cjs`, which names a different engine's backup folder.
- Consumers of changed symbols: `createRunRecord` is called once, by apply; `RUNS_PATH` is read by `createRunRecord` and `runUnlink` only.
- Matrix axes: run folder state (absent, held by an earlier run) by unlink target (claimed folder, numbered folder, misnamed copy). Rows: first apply, relink apply, unlink of the numbered run, and three misnamed refusals.
- Algorithm invariant: an apply only ever writes inside a folder its own `mkdir` call created, and unlink only accepts a folder directly under the runs root whose name fits the recorded digest's sequence.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline and the consumer inventory, Implementation writes the red test and then the fix, and Verification reruns the suites and validates the packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not used: the claim loop is exercised through the engine CLI, which is how every caller reaches it | n/a |
| Integration | Link, unlink and relink of one plan; unlink of a misnamed folder | `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` |
| Manual | Not used: the fixture builds a real source and target pair under `os.tmpdir()` | n/a |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node built-in `fs` | Internal | Green | None; no new package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an apply or unlink in a real project fails on a run folder the old code would have accepted.
- **Procedure**: `git checkout -- .skilled/commands/doctor/scripts/symlink-engine.cjs` before commit, or revert the commit after it. Existing run folders need no migration, because the first run of a digest keeps the plain name.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup baseline and red test | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
