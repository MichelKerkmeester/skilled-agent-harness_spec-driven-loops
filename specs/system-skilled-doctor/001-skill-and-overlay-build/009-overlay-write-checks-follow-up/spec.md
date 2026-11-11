---
title: "Feature Specification: Phase 9: overlay-write-checks-follow-up"
description: "A fresh review of the overlay write checks found a red CI check on main, four defects and missing tests, and Barter filed six engine problems it hit while moving onto the engine. This phase fixes all of them, has the result reviewed and republishes v4.0.2.1."
trigger_phrases:
  - "overlay write checks follow up"
  - "phase 9 overlay write checks follow up"
  - "overlay engine stale lock takeover"
  - "overlay engine relayout target"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: overlay-write-checks-follow-up

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-overlay-first-write-checks |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the build of `system-skilled-doctor` and the doctor overlay command.

**Scope Boundary**: The overlay engine, its tests, the `overlay-guard` hook, the CI workflow that runs the doctor tests, and the documents that describe `/doctor:overlay`. Nothing under Barter's tree is written. Barter's tree is read as evidence only.

**Dependencies**:
- Phase 8, the opt-in write checks this phase repairs and extends.
- The fresh review saved as `research/fable-review.md`, which is the source of the work list.
- Barter's open handover at `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/011-repin-review-fixes/handover.md`, read at Barter commit `12f3cd4d4`.

**Deliverables**:
- Three engine bug fixes: stale lock, own layout link, dropped appended item.
- Three engine gaps closed: off-layout report and `relayout`, an OpenCode guard adapter, a stale root-file line in `status`.
- Four review defects fixed: the glob over-match, `repin.exclude` under strict writes, the line-ending compare in the commit check, and a whole-tree audit.
- Tests, CI coverage for the hook tests, playbook scenarios and the command documents.
- A deep review of the result, its remediation, an alignment run, the `v4.0.2.1` entry and a republished tag.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 8 shipped the opt-in write checks. Three things are wrong after it. The Skill Doc Frontmatter workflow fails on `main` at `3b787637e1`, because `references/overlays.md` now carries 10 trigger phrases and the contract allows 3 to 8. A fresh review found four defects in the new code and four groups of paths with no test. Barter moved entirely onto the engine the same day and hit six problems, three of which block or damage a real apply.

### Purpose
A project that vendors Skilled can run the overlay engine without a hand repair: a killed run does not block the next one, a changed link target applies, a dropped appended item leaves the live file, and the write checks judge every path the way the documents say.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The failing workflow on `main`, read with `gh run list --branch main --limit 25`:

```text
3b787637e1 failure Skill Doc Frontmatter
```

The glob defect, read from `globToRegExp` at `overlay-engine.cjs:3511`. The pattern `.skilled/skills/**/leaf-manifest.json` compiles to a regular expression that ends in `.*leaf-manifest\.json`, so `my-leaf-manifest.json` matches. The reviewer saw the guard allow `.skilled/skills/sk-code/my-leaf-manifest.json` on Barter's tree.

The lock defect, read from `acquireLock` at `overlay-engine.cjs:1980`. An existing lock file always returns `isHeld: false`. No code path reads the pid in it.

The suite before the first edit: `node --test tests/` in `.skilled/commands/doctor/scripts` printed `tests 1100`, `pass 1100`, `fail 0`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cut `references/overlays.md` to 8 trigger phrases. Without it `main` stays red.
- Take over a lock whose recorded pid no longer exists. Without it a killed apply blocks every later run until the file is deleted by hand.
- Record each layout link target the engine writes and retarget its own link. Without it a manifest that changes a link target is blocked.
- Record the items each `json-entry` operation adds and remove one the overlay dropped. Without it a dropped hook entry stays live.
- Make `**/` in a `generated` glob match whole path segments only. Without it the guard allows files it should refuse.
- Leave a path under `repin.exclude` alone in the strict guard and the commit check. Without it the guard refuses a file a re-pin never touches and gives a false reason.
- Compare content with line endings normalised in the commit check. Without it a file equal to upstream is refused under `text=auto`.
- Report in `status` a `repin.rootFiles` overlay whose upstream file changed, and each overlay source that is off the layout.
- Add `apply --relayout`, which moves off-layout sources. Without it each vendoring project writes its own one-off script.
- Add `status --audit`, which lists vendored paths that differ from upstream at the pin and that no overlay owns. Without it nothing reports drift that predates strict writes.
- Add an OpenCode adapter to `overlay-guard`. Without it a vendoring project keeps its own OpenCode guard.
- Add the missing tests, run the hook tests in CI, add playbook scenarios and bring the command documents in line.
- Write `handover-to-barter.md` with the work only Barter can do.

### Out of Scope
- Any write under `barter/ai-speckit`. Barter's four items go into the handover file.
- Making the edit hook fail closed. The review names it as a risk. It is recorded in the handover, because the fail-open rule is the hook's stated contract and changing it is a separate decision.
- Checking a commit that moves the pin. The skip is by design, since a re-pin commit carries upstream's own changes. `status --audit` covers the gap after such a commit.
- Rewriting text references in a vendoring project's documents during `relayout`. The command prints the old and new paths instead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | Eight trigger phrases, then the new behaviour |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The lock, link, item, glob, exclude, compare, status, relayout and audit changes |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs` | Create | Tests for the engine fixes and the new targets |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modify | Tests for the glob, the excluded path, the line-ending compare and the untested paths |
| `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | Modify | The route flags for `--relayout` and `--audit` |
| `.skilled/hooks/overlay-guard/opencode/` | Create | The OpenCode adapter and its test |
| `.skilled/hooks/overlay-guard/README.md` | Modify | The seventh adapter |
| `.skilled/commands/doctor/overlay.md`, `_routes.yaml`, `assets/doctor-overlay-*.yaml`, `assets/doctor-overlay-presentation.txt` | Modify | `--relayout`, `--audit` and the new status lines |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | The overlay hint and selector lines |
| `.skilled/skills/system-skilled-doctor/manual-testing-playbook/` | Modify | Scenarios for strict writes, adopt, the commit check, root files and relayout |
| `.skilled/commands/README.txt`, `README.md` | Modify | The overlay command's hint |
| `.skilled/changelog/skilled/v4.0.2.1.md`, `.skilled/skills/system-skilled-doctor/changelog/v1.1.6.0.md`, `.skilled/skills/system-skilled-doctor/SKILL.md` | Modify, Create | The release entry, the skill note and its version |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The Skill Doc Frontmatter workflow passes on `main`. |
| REQ-002 | A lock that names a pid on this host that does not exist is taken over, with one line naming the dead owner. A live owner, a lock without a pid and a malformed lock still refuse. |
| REQ-003 | The engine records each layout link target it writes in `sync-state.json`. A link whose current target equals the recorded one is retargeted on apply. Any other existing path stays a problem. |
| REQ-004 | The engine records the items each `appendItems` and `insertItems` operation adds. On apply it removes a recorded item the overlay no longer lists when the live item still equals what it wrote, and reports it otherwise. |
| REQ-005 | A `generated` glob with `**/` matches zero or more whole path segments, so `a/**/x.json` matches `a/x.json` and `a/b/x.json` and not `a/my-x.json`. |
| REQ-006 | With `strictWrites` true, a path under a `repin.exclude` folder is allowed by `--guard` and by `pre-commit`. |
| REQ-007 | `pre-commit` passes a staged file whose content equals upstream's once CRLF is read as LF. |
| REQ-008 | Every test that existed before this phase passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | `status` prints one line for each `repin.rootFiles` overlay whose upstream file differs from the entry's `pinnedSha256`, and exits 1. |
| REQ-010 | `status` prints one line for each overlay source that is not at its destination with the leading dot dropped. The line does not change the exit code. |
| REQ-011 | `apply --relayout` moves each off-layout source under the lock, backs up every path it moves, rewrites `source`, `base` and `fragment`, retargets layout links that point into the overlay folder, refuses when a target exists and prints each old and new path. |
| REQ-012 | `status --audit` lists each vendored path that differs from upstream at the pin, or that upstream has and the tree lacks, when no overlay owns it and no `generated` glob matches it. |
| REQ-013 | An OpenCode adapter in `overlay-guard` refuses an unowned write on `tool.execute.before` by throwing the engine's refusal line, and stays inert in a repository with no overlay manifest. |
| REQ-014 | The paths the review named as untested each have a test, and a CI workflow runs the `overlay-guard` tests, which it already did. |
| REQ-015 | The overlay router, route manifest, workflows, presentation, command contract, reference and playbook describe the new targets and lines, and the route validator and contract test pass. |
| REQ-016 | A deep review of this phase ran 5 iterations, and every P0 and P1 finding is fixed or rejected with evidence. |
| REQ-017 | The `v4.0.2.1` entry names this work, and the tag and the release match `main`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test tests/` in `.skilled/commands/doctor/scripts` prints `fail 0`, with the 1,100 earlier tests among the passes.
- **SC-002**: `gh run list --branch main --limit 25` shows no failed run on the commit `v4.0.2.1` names.
- **SC-003**: `bash .skilled/commands/doctor/scripts/route-validate.sh` ends with `OK: route-validate`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lock takeover removes a live run's lock | High: two writers in one overlay folder | Take over only on `ESRCH` for a pid recorded in the lock. `EPERM`, no pid and a malformed line all refuse. One test holds a live pid |
| Risk | Item removal deletes something a person added | High: a hand-added hook entry vanishes | Remove only an item in the recorded set whose live value equals what the engine wrote. Report anything else |
| Risk | `sync-state.json` gains keys an older engine reads | Medium | Add keys beside `files`. The older engine reads only `pin` and `files`. One test loads a state file without the new keys |
| Risk | `relayout` moves a source and fails midway | Medium | Refuse before the first move when any target exists, back up each path first, and work under the lock |
| Dependency | DeepSeek V4.1 Flash through `pi` on llmgateway | The build stops when the quota runs out | Stop and report. No other model takes over the build |
| Dependency | An upstream checkout for `--audit` and the commit check | Neither can compare without it | Each says so in one line and exits as documented |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: `--guard` stays under the hook's 3 second limit. The review measured about 100 ms on Barter's tree, and this phase adds no file walk to the guard.

### Security
- **NFR-S01**: No dotenv file is read or copied. `relayout` and `--audit` skip one by name.
- **NFR-S02**: Lock takeover never signals a process other than with signal 0.

### Reliability
- **NFR-R01**: The engine uses the standard library only, so it runs on a bare checkout with no install step.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `sync-state.json` without the new keys reads as no recorded links and no recorded items, so nothing is retargeted or removed on the first apply after the upgrade.
- Maximum input: `--audit` walks every vendored file. The review counted 20,447 on Barter's tree. It runs only when asked.
- Failure path: `relayout` with any target present exits 2 and moves nothing. A lock held by a live pid exits 2 as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | One engine file, one new adapter, three test files, a workflow and about ten documents |
| Risk | 15/25 | The lock and item removal can lose data when wrong. Both are narrowed to recorded state |
| Research | 6/20 | The review and the handover name each change and its test |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocks. Choices made without asking are recorded in the log of `goal.md`.
<!-- /ANCHOR:questions -->

---
