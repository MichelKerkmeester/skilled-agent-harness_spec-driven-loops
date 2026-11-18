---
title: "Feature Specification: Record-base in a vendored layout and overlay-engine loss reports"
description: "Two upstream fixes for the doctor scripts. record-base works for a project that vendors Skilled behind a symlinked .skilled folder and can record a commit pin and an overlay re-pin names the upstream content it would drop."
trigger_phrases:
  - "vendored record base and overlay loss reports"
  - "record base in a vendored layout and overlay"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Record-base in a vendored layout and overlay-engine loss reports

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-18 |
| **Branch** | `worktrees/472-vendored-layout-and-scorer-fixes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A project that vendors Skilled under a subfolder, with a root `.skilled` symlink into it, could not record its base. `record-base` resolved the git top level and the symlinked `.skilled` is refused by design. The overlay engine also lost upstream content on re-pin while the status stayed green, because a `set`, a missing `before` anchor and a directory overlay each dropped content with no report.

### Purpose
Success means `record-base` works in that layout, can record a framework commit that falls between release tags and reports every upstream content loss on re-pin, except the paths an overlay removes by design.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Recorded output from `scratch/work-record.md`, line 7. The command was not re-run for this packet.

```text
record-base --repo . --dry-run --release v4.1.0.0
exit 1
path parent is not a real directory: <root>/.skilled
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Choose the `record-base` root from a real `.skilled` directory or from a symlink that resolves to a directory named `.skilled` inside the git work tree.
- Read the project's own HEAD at its subfolder prefix and keep reading framework release commits at the top level.
- Add `record-base --pin <full-sha>` for a framework commit that falls between release tags.
- Name the upstream content an overlay re-pin would drop and warn on a missing `before` anchor and on numeric path steps.
- Record the keys that `setKeyOnItem` and `insertObjectKeys` write, so a dropped key can be restored or refused.

### Out of Scope
- Vendored copies kept as git submodules - their top level differs, so the symlink is refused and the work record gives no fix for that case.
- Advisor items 3 to 6 of the same report - they belong to `specs/system-skill-advisor/routing-and-scoring/011-surfacing-scorer-follow-ups`.
- Failing instead of warning on a missing `before` anchor - a warning keeps an existing project's re-apply working and a strict mode is an operator call (section 10).
- Vendored-layout behavior of `align` and `rollback` - both share the helpers and neither has a vendored-layout test, so this packet makes no claim for them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/release-update.cjs` | Modify | Root choice in `resolveRepo`, `headFilesAt()` for the project's HEAD, the `:(top)` pathspec in `releaseRenames` and the `--pin` form in `record-base` and `check`. |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Upstream loss reports before the copy, the anchor and numeric-path notes and the key records with `restoreDroppedKeys`. |
| `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` | Modify | Four new cases: the vendored root, the symlink refusal, the `--pin` form and the normal checkout. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | Four new re-pin cases: json-entry, directory, anchor and skill-root losses. |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | New and changed status and apply cases for key restores, anchors and array indexes. |
| `.skilled/commands/doctor/update.md` | Modify | The `record-base` flag line gains `--pin=<full-sha>`, with one sentence on pins. The argument hint is unchanged. |
| `.skilled/commands/doctor/assets/doctor-update-record-base.yaml` | Modify | A `pin` user input and the dispatch lines take `--release <tag>` or `--pin <sha>`. |
| `.skilled/commands/doctor/assets/doctor-update-presentation.txt` | Modify | Lists `--pin=<full-sha>` for `record-base`. |
| `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml` | Modify | Keep and plan lists carry the `upstream-lost` and `NOTE` lines and the report step tells the operator to carry each one into the overlay. |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | `Upstream lost:` and `Notes:` slots and fixed NOTE rows. |
| `.skilled/commands/doctor/assets/doctor-overlay-status.yaml` | Modify | The NOTE text. |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The records, the notes table, the re-pin section and the upgrade notes. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `record-base --repo <dir>` takes the root from `<dir>` when its `.skilled` is a real directory. When `.skilled` is a symlink, the folder is followed only if the link resolves to a directory named exactly `.skilled`, the parent sits inside the git top level and that parent reports the same top level. Any other target falls back to the top level and the unchanged `safeResolve` guard refuses it. |
| REQ-002 | The project's own HEAD is read at its subfolder prefix through `headFilesAt()` and framework release commits are still read at their top level. `releaseRenames` anchors its pathspec with `:(top)`. |
| REQ-003 | `record-base --pin <full-sha>` records the unit as `{ commit, tree }` with no `release` key. The SHA must be 40 or 64 lowercase hex and the flag cannot combine with `--release`. Either violation exits 2. |
| REQ-004 | `check` reads a pinned unit through `recordRevision()`. A target release that is an ancestor of the pin reports `downgrade`. |
| REQ-005 | A re-pin of a json-entry `set` names, before the copy, each upstream item the set would drop and each value upstream changed. The report never blocks the apply. |
| REQ-006 | A directory overlay names each upstream-added or upstream-changed file it removes after the copy. A skill-root `replace` folder gets the same report. `remove-root` and skill-root `remove` paths stay unlisted by design. |
| REQ-007 | `setKeyOnItem` and `insertObjectKeys` record the keys they write. `restoreDroppedKeys` restores a dropped key from the pin or deletes a key the overlay added. It refuses when the value was hand-edited or no pin is readable. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | A missing `before` anchor prints a `NOTE` on `status` and `repin`. Apply behavior does not change, so the items still append at the end. |
| REQ-009 | The numeric-path warning covers every operation kind, not only `set`. |
| REQ-010 | The command doc, its YAML and presentation assets and `overlays.md` describe `--pin`, the `upstream-lost` lines and the anchor `NOTE`. |
| REQ-011 | The release-update, overlay, contract, compat and agents-md suites pass with no failing test. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `record-base` run from a project root whose `.skilled` is a symlink into a vendored subfolder records the base, where it failed before with `path parent is not a real directory`.
- **SC-002**: A re-pin that changes overlaid upstream content prints each loss as an `upstream-lost` line and the run does not stop.
- **SC-003**: The named doctor suites pass with no failing test and both engine scripts pass `node --check`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Git fetch by full SHA for a pin that is not already local | A pin that is not local fails to resolve | The commit resolves locally first. GitHub and local remotes allow fetch by id. Use `--release` when the tree sits on a tag. |
| Risk | An overlay with a missing `before` anchor still appends at the end on apply | The items land at the end, as they did before the change | The `status` and `repin` NOTE names the anchor. Failing instead is an open question (section 10). |
| Risk | A dropped `setKeyOnItem` or `insertObjectKeys` key whose pin is unreadable or whose value was hand-edited | The key is not restored | The refusal is the designed outcome. The work record names no other path. |
| Risk | A project's own `vN.N.N.N` tags read as framework tags | A project tag can be taken for a framework release | Not fixed in this change. See section 10. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the change runs inside two local Node scripts and their tests. The work record names no service, endpoint, credential or store, so no response-time, throughput, auth, encryption, uptime or error-rate target applies.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: N/A: the work record names no empty-input case for either fix.
- Maximum input: N/A: the work record gives no size limit and no large-input run.
- Failure path: a `--pin` value that is not 40 or 64 lowercase hex or that comes with `--release`, exits 2. A `.skilled` symlink that leaves the work tree or is not named `.skilled`, falls back to the top level and is refused. A dropped key whose value was hand-edited is refused, not removed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
N/A: the work record gives no scope, risk or research scores, so this packet states no complexity total.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a missing `before` anchor fail instead of warn? The work record chose a warning so an existing project's re-apply still runs. A strict or opt-in failure is an operator call. This does not block closure.
- Should a vendored copy kept as a git submodule get the root choice? Its top level differs, so its symlink is refused today. This does not block closure.
- Should a project's own `vN.N.N.N` tags be told apart from framework tags? They read as framework tags today. This does not block closure.
- Should the overlay contract test check that the YAML keep lists name every line kind the engine prints? It does not check that today. This does not block closure.
<!-- /ANCHOR:questions -->
