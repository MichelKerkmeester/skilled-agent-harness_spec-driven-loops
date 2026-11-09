---
title: "Feature Specification: Phase 19: template-marker-upgrade-and-staleness-scope"
description: "A passing packet whose documents carry an old template marker has no path to the current one, and the staleness checker walks the whole repository root, so it counts test fixtures, archived packets and a host's vendored Skilled tree as stale packets. This phase adds an opt-in marker refresh to upgrade-legacy and scopes staleness discovery to the spec roots."
trigger_phrases:
  - "template marker upgrade and staleness scope"
  - "phase 19 template marker upgrade and staleness scope"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 19: template-marker-upgrade-and-staleness-scope

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-09 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 19 of 19 |
| **Predecessor** | 018-host-trigger-index-and-repin-generated |
| **Successor** | None |
| **Handoff Criteria** | The refresh mode moves a passing old-marker packet to the current marker and strict still passes; the staleness count drops to real packets with no fixture path |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 19** of the v4 release line remediation specification.

**Scope Boundary**: Items 3 and 4 of the operator's Barter handover: an upgrade path for passing old-marker documents, and the staleness checker's discovery scope.

**Dependencies**:
- Barter's checkout at `/Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit` is read-only; the measurements below only read it.

**Deliverables**:
- `upgrade-legacy.mjs --refresh-markers`, dry by default, rewriting only a marker the document's anchors prove.
- `check-template-staleness.sh` discovery limited to the spec roots with the corpus walker's exclusions.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-legacy.mjs` repairs only packets that fail strict validation, so a passing packet with a `spec | v1.0` or `spec-core | v2.2` marker stays stale with no supported path forward. `check-template-staleness.sh` runs `find` from the repository root, so it reports test fixture folders, archived packets and, in a host, every spec folder inside the vendored `skilled/` tree.

### Purpose
A host can move its proven documents to the current marker with one opt-in command, and the staleness report counts only real packets.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh --json   # this repository
total 5107, current 303, stale 3022, no_version 1782; 51 stale entries outside specs/, test fixtures among them

$ bash <same script> --root barter/ai-speckit --json   # read-only
total 10463; 147 stale entries with "fixture" in the path, 51 under skilled/
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `refreshMarker` in `heal-spec-docs.cjs`, exported and kept out of the default lane modes.
- `--refresh-markers` in `upgrade-legacy.mjs` for passing packets, with revalidation and byte-for-byte restore on failure.
- Staleness discovery under `specs/` only, pruning z_archive, node_modules, scratch, .git, dist, memory, templates and fixture-pattern folders.
- `templates/MIGRATION.md` section 2 names the opt-in path.

### Out of Scope
- Rewriting any marker in this repository's own `specs/` - the mode is opt-in and this phase only tests it on temp fixtures.
- Restructuring documents whose anchors do not match the current template - that would author content (MIGRATION section 4).
- `upgrade-legacy.mjs` deriving its repository root from the script location, which matters in a host - recorded as a limitation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | `refreshMarker` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | `--refresh-markers` mode |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-template-staleness.sh` | Modify | Discovery scope |
| `.skilled/skills/system-spec-kit/templates/MIGRATION.md` | Modify | Opt-in path sentence |
| Two new vitest files under `runtime/cli/tests/` | Create | Refresh and discovery cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `upgrade-legacy.mjs --refresh-markers --apply` moves a passing packet's old `spec` v1.0 marker to the current marker, and strict validation still passes. |
| REQ-002 | The staleness checker counts only folders under the spec roots, with no fixture, archive or vendored path in its output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A document whose anchors differ from its level's template keeps its marker and is reported as refused. |
| REQ-004 | The upgrade-legacy, heal and template parity tests and the cli vitest project keep every baseline pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A host can clear proven stale markers without hand edits.
- **SC-002**: The staleness report in a host lists only the host's packets.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A refreshed marker claims a render the document does not have | High | Reuse `provenMarker`, which demands an exact anchor match, and revalidate after writing |
| Risk | A packet stops passing after the rewrite | Med | Restore the in-memory snapshot byte for byte and count the revert |
| Dependency | Corpus walker exclusion list | Drift | A comment in the checker names corpus.mjs as the source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Pruned discovery walks fewer directories than today.

### Security
- **NFR-S01**: The refresh mode writes only inside the packets it was given and never without `--apply`.

### Reliability
- **NFR-R01**: The default lane modes and the existing upgrade path behave as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a root with no `specs/` reports zero folders and exits 0.
- Maximum input: Barter's 10,000-folder tree, read-only.
- Failure path: a revalidation failure restores the packet's original bytes.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three scripts, one doc, two tests |
| Risk | 12/25 | Opt-in writes with revalidation |
| Research | 6/20 | Handover plus read-only measurement |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The refresh rule is in `decision-record.md`.
<!-- /ANCHOR:questions -->

---
