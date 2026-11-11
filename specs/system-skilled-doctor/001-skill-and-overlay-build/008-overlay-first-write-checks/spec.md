---
title: "Feature Specification: Phase 8: overlay-first-write-checks"
description: "The overlay guard refuses only paths an overlay already owns, so a new file or an edit to an unowned upstream file in a vendored Skilled tree is found weeks later at the next re-pin. This phase adds opt-in write checks to the overlay engine: a strict guard, an adopt step, a generated list, a commit check and a root-file line in the re-pin report."
trigger_phrases:
  - "overlay first write checks"
  - "phase 8 overlay first write checks"
  - "strict writes overlay manifest"
  - "overlay engine adopt and unowned guard"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: overlay-first-write-checks

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-11 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-doctor-ux-research |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the build of `system-skilled-doctor` and the doctor overlay command.

**Scope Boundary**: The overlay engine, its tests, the `overlay-guard` hook's test and README, and the documents that describe `/doctor:overlay`. Nothing under Barter's tree is written. Barter's `sync.cjs` is read as the port source only.

**Dependencies**:
- Phase 2, the overlay engine, and phase 3, the re-pin, whose `managedPathTest`, `repinSettings` and `pinnedUpstreamBytes` the new checks reuse.
- Phase 4, the guard hook, which already passes every path to the engine's `--guard`.

**Deliverables**:
- The `strictWrites` setting, the `generated` list and `repin.rootFiles` in the overlay manifest.
- `apply --adopt <path>` and `pre-commit` in the engine.
- A `root-file` line in the re-pin report.
- Tests for each, and the `/doctor:overlay` documents brought in line.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The engine's `--guard` refuses two cases: a path an overlay owns, and a path a removal targets. Every other path gets `allow`, which includes a new file under `.skilled` and an edit to a vendored file no overlay owns. A re-pin does not carry the new file, and it overwrites the edit or refuses on it as unowned drift, often weeks after the write. Root files such as `REPO RULES.md` are never copied by a re-pin, and an upstream change to one is listed only among the capped `not-copied` lines.

Barter built four checks against this in its own `sync.cjs`. Skilled's engine has none of them, so each vendoring project would have to write its own.

### Purpose
A project that vendors Skilled can turn on one manifest setting, after which a write to a vendored path no overlay owns is refused when it is made, with the overlay path to create or the adopt command to run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

One fixture tree, with `"strictWrites": true` in its manifest and one unowned upstream file. The engine at `1f50e98e12` reads no such key:

```text
$ node engine-head.cjs --guard .skilled/skills/hub/fix.md
allow
exit=0
$ node engine-head.cjs --guard .skilled/skills/brand/new.md
allow
exit=0
```

The same two calls after this phase:

```text
$ node overlay-engine.cjs --guard .skilled/skills/hub/fix.md
refuse: .skilled/skills/hub/fix.md is a vendored file no overlay owns, so a re-pin would overwrite this edit; run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/hub/fix.md, then edit skilled-overlays/skilled/skills/hub/fix.md
exit=1
$ node overlay-engine.cjs --guard .skilled/skills/brand/new.md
refuse: .skilled/skills/brand/new.md is a new file in the vendored tree, which a re-pin would not carry; create it as skilled-overlays/skilled/skills/brand/new.md, then run node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --adopt .skilled/skills/brand
exit=1
```

The suite before the first edit: `node --test` over the five overlay engine files and the hook test printed `tests 91`, `pass 91`, `fail 0`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `strictWrites` manifest key, off when absent, that makes `--guard` refuse a write under a vendored root that no overlay owns. Without it a vendoring project finds the write only at the next re-pin.
- Add a `generated` manifest list of globs that the guard, adopt and the commit check leave alone. Without it the strict guard would refuse every file a generator writes.
- Add `apply --adopt <path>`, which copies one unowned vendored path into the overlay folder, appends its manifest entry and applies. Without it every refusal ends in a hand-written manifest entry.
- Add a `pre-commit` engine command that refuses a staged vendored change no overlay owns. A write hook sees only an agent's write tools, so a shell edit reaches the tree unchecked.
- Add `repin.rootFiles` and a `root-file` line in the re-pin report for each listed root file upstream changed.
- Bring the `/doctor:overlay` router, presentation, route manifest, workflow, command contract and reference in line.

### Out of Scope
- Barter's re-pin and its cutover to these checks. A Barter session does that once this lands.
- Wiring `pre-commit` into a git hook in Skilled. Skilled vendors nothing, so the check has nothing to judge here, and the vendoring project owns its own commit hook.
- A runtime-mirror message of its own. A project lists its mirrors in `generated`, which allows them.
- Changing the `overlay-guard` core. It already forwards every path and passes the engine's `refuse:` line on.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The strict guard, `apply --adopt`, `pre-commit`, the `generated` list and the `root-file` report lines |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Create | Ten tests over the guard, adopt, the commit check and the root-file line |
| `.skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` | Modify | The apply route's flag list, and each exclusive flag probed on its own |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | Modify | One test that a strict refusal reaches the hook as a deny |
| `.skilled/hooks/overlay-guard/README.md` | Modify | What the guard refuses with strict writes on |
| `.skilled/commands/doctor/overlay.md` | Modify | The `--adopt` flag and the setting |
| `.skilled/commands/doctor/_routes.yaml` | Modify | The apply route's flag, invocation, write location and phrases |
| `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml` | Modify | The adopt branch of the apply workflow |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | The adopt plan, its question and result, the setting and the new report lines |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | The overlay hint, selector and loader lines |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | Strict writes, adopt, the commit check and root files |
| `.skilled/commands/README.txt`, `README.md` | Modify | The overlay command's hint and one line on adopt |
| `.skilled/commands/doctor/scripts/sk-skill-convert.cjs` | Modify | Added on the operator's instruction after the first close: copy the source entry by entry, so the convert suite passes on Node 26 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With `strictWrites` absent or false, `--guard` prints what it printed before for every path, and every test that existed before this phase passes. |
| REQ-002 | With `strictWrites` true, `--guard` exits 1 for a new file under a vendored root no overlay owns. The line names the overlay path to create and the adopt command, or the owning overlay's source when the folder is already owned. |
| REQ-003 | With `strictWrites` true, `--guard` exits 1 for an edit to an existing vendored file no overlay owns, and the line names `apply --adopt <path>`. |
| REQ-004 | A path matching a `generated` glob is allowed by `--guard` and by `pre-commit`, and refused by `apply --adopt`. |
| REQ-005 | `apply --adopt <path>` on a new file or folder appends a manifest entry, copies it into the overlay folder and applies. A token-named source file in a folder lands in `protectedPaths`. |
| REQ-006 | `apply --adopt <path>` on an upstream file records `pinnedSha256` from upstream's bytes at `pin.commit` in `pin.checkout`, not from the live copy. |
| REQ-007 | `pre-commit` exits 1 and names each staged change under a vendored root that no overlay owns. It passes a generated path, a staged file equal to upstream and a commit whose staged `pin.commit` differs from HEAD's. |
| REQ-008 | A re-pin report prints one `root-file` line for each `repin.rootFiles` path upstream changed, and the file is not copied. |
| REQ-009 | The engine never reads a `.env` file, and adopt refuses a token-named file whose extension is not source or prose. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | The `overlay-guard` hook denies a write the strict guard refuses, with no change to its core. |
| REQ-011 | The doctor overlay router, presentation, route manifest and workflow describe `--adopt` and the setting, and the route validator and the contract test pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test` over the overlay engine tests, the contract test and the hook test prints `fail 0`, with every pre-existing test among the passes.
- **SC-002**: The two `--guard` calls under Measured Behavior exit 1 with the lines shown, on a manifest with `strictWrites` true.
- **SC-003**: `bash .skilled/commands/doctor/scripts/route-validate.sh` ends with `OK: route-validate`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The upstream checkout `pin.checkout` names | Adopt cannot tell an upstream file from a project file without it | Adopt refuses with exit 2 and writes nothing when the checkout or the pinned commit cannot be read |
| Risk | The strict guard refuses a write in a repository that vendors nothing | High: it would block Skilled's own work | The check runs only when the manifest sets `strictWrites` true. Skilled has no manifest, and the hook allows before it loads the engine. One test covers the setting being off |
| Risk | Adopt writes the manifest entry and the apply after it is blocked | Medium: the entry exists while the tree is not applied | The doctor workflow stops before the question while any destination is in a blocking state, and the engine exits 1 so the caller sees it |
| Risk | A changed `--guard` contract breaks a caller | Medium | The exit codes and the `refuse:` prefix are unchanged. The hook reads only those two |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. The guard adds one `git check-ignore` call per judged path, and only with `strictWrites` on. No timing target was set and none was measured.

### Security
- **NFR-S01**: A `.env` file is never read or copied. Adopt refuses it by name before it opens any file.
- **NFR-S02**: Adopt copies a token-named file only when its extension is `.md`, `.css`, `.ts`, `.js`, `.cjs`, `.mjs` or `.svelte`.

### Reliability
- **NFR-R01**: The engine uses the standard library only, as before, so it runs on a bare checkout with no install step.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a manifest with no `generated` list and no `repin.rootFiles` treats both as empty. A path outside every vendored root is allowed.
- Maximum input: adopting a folder reads each file once against upstream. A folder that holds upstream files is refused, so the walk covers project files only.
- Failure path: `apply --adopt` with no value, or with `--capture`, prints the usage block and exits 2. A refused adopt exits 2 and writes nothing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | One engine file with about 450 added lines, three test files, and nine documents |
| Risk | 12/25 | A shared guard contract, held unchanged behind an opt-in key |
| Research | 6/20 | A reference implementation exists and was read in full |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocks. Two choices differ from the handover and are recorded in `implementation-summary.md`: the engine form is `apply --adopt <path>`, and `generated` is a flat list of globs.
<!-- /ANCHOR:questions -->

---
