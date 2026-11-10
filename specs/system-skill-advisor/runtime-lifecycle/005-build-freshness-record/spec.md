---
title: "Feature Specification: Record the advisor runtime dist build so a fresh build writes its own freshness attestation"
description: "The advisor runtime build compiled and copied data but never wrote its own dist freshness record, so the first freshness check after a fresh provision wrote one instead. A suite that asserts a run leaves the tree unchanged then failed on the first run after provision and passed on every later one. The build now prepares and records both dist entries, so the record exists before anything reads it."
trigger_phrases:
  - "build freshness record"
  - "record the advisor runtime dist build"
  - "advisor build writes its own attestation"
  - "dist freshness record after provision"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Record the advisor runtime dist build so a fresh build writes its own freshness attestation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-30 |
| **Branch** | `worktrees/301-advisor-build-freshness-record` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor runtime package built with `tsc` and a `postbuild` that copied data, and it never wrote a dist freshness record. The first freshness check after a build therefore wrote one itself, with `origin: "checker"`, into `dist/runtime/`, which is a declared generated path and therefore inside the snapshot roots of every suite that asserts a run leaves the tree unchanged. The doctor suite runs its probe inside exactly such a snapshot, so a fresh provision failed that assertion once and never again, because the second run found the record already there.

### Purpose
A build leaves an attested record beside both of its dist entries, so nothing has to write one while another suite is watching the tree.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Commands were run from the worktree root. The record file name carries a suffix derived from the absolute dist entry path, so the suffix differs per checkout.
```text
$ ls .skilled/skills/system-skill-advisor/runtime/dist/runtime/.dist-freshness-system-skill-advisor-runtime-*.json
ls: ...: No such file or directory            (records deleted, no rebuild)

$ node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs   (after a build)
pass 20, fail 0, exit 0

$ ls .skilled/skills/system-skill-advisor/runtime/dist/runtime/.dist-freshness-system-skill-advisor-runtime-*.json
.dist-freshness-system-skill-advisor-runtime-81f52b7e00ae.json
.dist-freshness-system-skill-advisor-runtime-a2017ecbe1f6.json
$ cat <.dist-freshness-system-skill-advisor-runtime-81f52b7e00ae.json>
{"version":2,"origin":"build","sourceHash":"d736af30...","distHash":"022a0684..."}
$ cat <.dist-freshness-system-skill-advisor-runtime-a2017ecbe1f6.json>
{"version":2,"origin":"build","sourceHash":"eebdf836...","distHash":"58f54149..."}

$ npm --prefix .skilled/skills/system-skill-advisor/runtime run build
@spec-kit/system-skill-advisor dist build preparation recorded
@spec-kit/system-skill-advisor dist build preparation recorded
@spec-kit/system-skill-advisor dist build attestation recorded
@spec-kit/system-skill-advisor dist build attestation recorded
exit 0
```
Before the change, with both records deleted and no rebuild, one probe run created `.dist-freshness-system-skill-advisor-runtime-81f52b7e00ae.json` carrying `"origin":"checker"`, and the quality suite's own snapshot helper, wrapped around that probe, reported `the run changed files on disk` with that record path as the only change.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `prebuild` step that runs `prepare-build` for both declared dist entries before the TypeScript compile, and extend the existing `postbuild` to run `record-build` for both after it, through the spec-kit freshness CLI.
- Fall back to a checker-origin cache write when `record-build` reports that the build was not prepared, so a missing attestation never fails a legitimate build.
- Add a contract test that holds the package scripts to the freshness registry, so a dist entry added without a matching prepare and record step fails the suite.
- Bump the skill version and add its changelog entry.

### Out of Scope
- Changing the freshness engine, its registry, or the record format - the spec-kit runtime already builds this way and the advisor follows it unchanged.
- Changing the doctor probe or the quality suite's snapshot roots - the write those suites see is the symptom, and the build leaving a record is the cause.
- Making the record filename independent of the checkout path - the suffix follows the dist entry path for every package in the registry, so changing it is a registry-wide decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/package.json` | Modify | Add `prebuild` and extend `postbuild` so both dist entries are prepared and recorded |
| `.skilled/skills/system-skill-advisor/runtime/tests/dist-build-record-contract.vitest.ts` | Create | Assert every declared dist entry is prepared and recorded by the package scripts |
| `.skilled/skills/system-skill-advisor/SKILL.md` | Modify | Version frontmatter to 0.17.29.0 |
| `.skilled/skills/system-skill-advisor/changelog/v0.17.29.0.md` | Create | Release note for the change |
| `.hermes/skills/system-skill-advisor/SKILL.md` | Modify | Regenerated copy of the same frontmatter |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A build of the advisor runtime leaves a record beside both of its dist entries, and each record says the build wrote it. | With both records deleted, `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` exits 0 and both `.dist-freshness-system-skill-advisor-runtime-*.json` files exist with `"origin":"build"`. |
| REQ-002 | A run after that build writes nothing into the dist folder. | `node --test .skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` exits 0, and both records are byte-identical before and after it. |
| REQ-003 | A dist entry the freshness registry declares but the package scripts do not prepare or record fails a test. | `tests/dist-build-record-contract.vitest.ts` passes for the shipped scripts and fails when one entry is dropped from `prebuild` or `postbuild`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A `record-build` that reports the build was not prepared does not fail the build. | The fallback branch writes a checker-origin cache for that entry, and the build exits 0 whenever the compile itself succeeded. |
| REQ-005 | The skill release carries the change. | `version: 0.17.29.0` in `SKILL.md` frontmatter, `changelog/v0.17.29.0.md` present, and the Hermes copy regenerated. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After one build, both advisor dist entries have a `origin: "build"` record, and deleting those records reproduces the previous checker-origin write.
- **SC-002**: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and leaves both records byte-identical.
- **SC-003**: The packet passes `validate.sh --strict` with `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `dist-freshness.cjs` in the spec-kit runtime, reached through a relative path from the advisor package | If that CLI moves or is renamed, both new build steps fail and the build fails with them | The contract test reads the same registry the CLI does, so a registry change that the scripts miss fails the suite before a build does |
| Risk | The build hashes the watched source twice per entry, before and after the compile | A large source tree makes every build slower | The spec-kit runtime packages pay the same cost for the same guarantee, and the hash covers only the entry's own watched paths |
| Risk | A source file changes while the compile runs | `record-build` refuses to attest a build whose source moved, and the fallback then writes a checker record | The contract is that an attestation never describes source it did not compile; a stale dist still reads as stale on the next check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
