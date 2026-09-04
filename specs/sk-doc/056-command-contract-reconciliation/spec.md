---
title: "Feature Specification: Command contract reconciliation"
description: "The machine-readable command contract had drifted from the command tree it describes: it named a family that no longer exists, wrote every asset path with a separator the tree does not use, and stated a loader rule three other sources contradict. Downstream tools read this file, so the drift was silently compensated for rather than caught."
trigger_phrases:
  - "command contract"
  - "command catalog drift"
  - "sk-create-command"
  - "command asset naming"
  - "command metadata mirror"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Command contract reconciliation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`sk-create-command` teaches people how to write OpenCode commands, and its `command-contract.json` calls itself the single machine-readable source of behavioural truth that templates, validators, benchmark adapters and generated routers read instead of restating. That claim had stopped being true. The contract described a `interface` family whose directory does not exist, wrote every owned-asset path with an underscore separator no shipped asset uses, stated an argument-handling rule that the router template and the document validator both contradict, and advertised the create family's shape by copying one command's argument hint. A contract that has drifted is worse than none, because the one tool that does read it — `generate-command-routers.cjs` — had grown a separator-insensitive comparison to work around the drift rather than report it.

Separately, the command tree has three hand-kept mirrors of each command's frontmatter: a repo-wide index, per-family indexes, and a `command-metadata.json` per owning hub. Nothing notices when one falls behind.

### Purpose

Make the contract describe the tree that actually ships, correct the templates and references that teach the same wrong shapes, and add a read-only check that fails when a catalog or a hub's command metadata stops agreeing with command frontmatter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Reconcile every field of `command-contract.json` against the shipped command tree, family by family.
- Correct the three schema descriptions that contradict the tree or the contract's own metadata.
- Bring the mode's templates and references onto the asset-naming convention the tree uses.
- Add a read-only `/doctor` check for catalog and command-metadata drift.

### Out of Scope

- Any file under `.opencode/commands/` other than the one new script — a concurrent agent owns that tree.
- `.opencode/skills/sk-doc/command-metadata.json` and `system-deep-loop/command-metadata.json` — outside this packet's ownership, so their prose divergence is reported rather than repaired.
- `generate-command-routers.cjs` — owned by system-spec-kit; the contract was shaped so the existing generator expands it correctly without changing the generator.
- Registering the new check into the doctor route manifest and script index, both of which live under `.opencode/commands/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Family-by-family reconciliation, version 1.0.0 to 2.0.0 |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.schema.json` | Modify | Three descriptions corrected |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-router-template.md` | Modify | Hyphenated asset paths, prefix-drop note |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` | Modify | Hyphenated asset paths |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-presentation-template.md` | Modify | Hyphenated asset paths |
| `.opencode/skills/sk-doc/sk-create-command/SKILL.md` | Modify | Hyphenated asset paths, naming rule |
| `.opencode/skills/sk-doc/sk-create-command/README.md` | Modify | Hyphenated asset-kind suffix |
| `.opencode/skills/sk-doc/sk-create-command/references/worked-example.md` | Modify | Hyphenated asset paths |
| `.opencode/skills/sk-doc/sk-create-command/references/common-pitfalls.md` | Modify | Hyphenated asset-kind suffixes |
| `.opencode/skills/sk-doc/sk-create-command/references/router-presentation-split.md` | Modify | Hyphenated asset paths |
| `.opencode/commands/doctor/scripts/command-catalog-mirror-check.cjs` | Create | Read-only catalog and metadata drift check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The contract's create-family loader requirement states how `$ARGUMENTS` is actually handled, matching the router template and the document validator. |
| REQ-002 | Every owned-asset and execution-target path in the contract expands to a filename that exists on disk, for every family. |
| REQ-003 | The create family's `argument_hint` reads as a family shape rather than one command's hint, in the same register as the other families. |
| REQ-004 | No contract family names a directory, command, asset or workflow reference that is absent from the tree. |
| REQ-005 | A read-only check fails when a command catalog or a hub's `command-metadata.json` stops covering the command frontmatter tree, and passes on the tree as it stands. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The schema's own descriptions agree with both the tree and the contract's metadata. |
| REQ-007 | The mode's templates and references teach the asset-naming convention the tree uses, including the families that drop the family prefix. |
| REQ-008 | Divergence this packet cannot repair is reported by the new check rather than silently tolerated. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `generate-command-routers.cjs --check`, the only live consumer of the contract, reports zero path drift across every router it derives.
- **SC-002**: The contract validates against its schema with zero errors, and every document in the mode validates with zero issues.
- **SC-003**: The new check exits 0 on the tree as it stands and non-zero on each of five distinct staleness shapes introduced in a scratch copy.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `generate-command-routers.cjs` expands contract path templates with a hardcoded per-family rule | A contract path the generator expands wrongly produces false drift on every router in that family | Shaped each family's template so the existing expansion rule lands on the real filename; the design family, whose assets drop the family prefix, carries literal filenames instead |
| Dependency | A concurrent agent is editing `.opencode/commands/` | Verification results move under this packet's feet | Re-ran the whole gate after the tree settled and recorded which green line depends on the other agent's work |
| Risk | The check's prose tier could be written strictly enough to fail on the tree today | An always-red diagnostic gets ignored | Prose divergence reports as a warning and drives exit status only under `--strict` |
| Risk | Renaming a contract family key is breaking for any consumer that indexes families by name | A downstream reader silently loses a family | Bumped the contract major to 2.0.0; confirmed the only live consumer iterates families generically |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The new check completes in under a second on the full tree, so it can sit inside an interactive `/doctor` run.
- **NFR-P02**: The check reads the tree once per run and holds no state between runs.

### Security
- **NFR-S01**: The check never writes, matching the read-only contract every `/doctor` diagnostic holds.
- **NFR-S02**: The check reads only repository files and takes no network or database dependency.

### Reliability
- **NFR-R01**: A missing commands directory, an unparseable catalog or unparseable metadata exits 2 rather than reporting a false pass.
- **NFR-R02**: The check reports zero false positives on the tree as it stands, so a red line always means real drift.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a commands directory holding no command files exits 2 rather than passing vacuously.
- Maximum length: a catalog naming a command in both a table row and a usage example is judged on the row alone, so an example cannot mask a deleted row.
- Invalid format: a metadata file that is not a JSON array is reported as drift on that file, and the remaining files are still checked.

### Error Scenarios
- External service failure: none — the check touches no service.
- Network timeout: not applicable; every read is local.
- Concurrent access: a command file added or removed mid-run is read once, so a run reports a single consistent snapshot.

### State Transitions
- Partial completion: every catalog and metadata file is checked before the exit status is decided, so one failure never hides the rest.
- Session expiry: not applicable; the check is a single process with no session.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 10 modified documents plus 1 new script, no runtime code |
| Risk | 20/25 | A machine-readable contract a generator reads; a wrong path template would have written wrong paths into shipped routers |
| Research | 20/20 | The reconciliation is mostly investigation: every field checked against the tree, and the generator's expansion rule read before shaping the paths |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The two `command-metadata.json` files carry ten prose divergences from command frontmatter. Should the hub descriptions be reworded to match frontmatter, or should the metadata be allowed its own routing phrasing and the check's prose tier retired?
- The prompt family names its assets `prompt_improve_auto.yaml`, the only underscore-joined assets in the tree. Is that an intentional exception or unfinished migration?
<!-- /ANCHOR:questions -->

---
