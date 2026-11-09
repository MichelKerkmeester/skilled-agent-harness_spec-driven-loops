---
title: "Feature Specification: Phase 22: linked-project-host-index"
description: "A project checkout that links its .skilled and specs into a host repository reads the packaged trigger index on a bare Gate 1 lookup, because the lookup only looks for an index in the caller's own root. This phase makes it read the index of the host that owns the linked tree, scopes it to the linked track and keeps generation at the host root."
trigger_phrases:
  - "linked project host index"
  - "phase 22 linked project host index"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: linked-project-host-index

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
| **Phase** | 22 of 22 |
| **Predecessor** | 021-host-root-marker-refresh |
| **Successor** | None |
| **Handoff Criteria** | A bare lookup from a linked project names the owning host index and finds the project's packets; a project with no host index falls back to the packaged one; a bare generation from a project writes nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the v4 release line remediation specification.

**Scope Boundary**: The Barter handover of 2026-11-09 (session 2381e5f3): Gate 1 from a project checkout whose `.skilled` and `specs` link into the Barter host.

**Dependencies**:
- Host detection and the host index from phase 018 (`runtime/cli/retrieval/lib/host-index.mjs`).
- Barter's checkouts are read-only; the reproduction only reads them.

**Deliverables**:
- `owningHostRoot` in `host-index.mjs`.
- The lookup's default index and scope for a linked project.
- A generator refusal for a bare run from a linked project.
- Tests for the linked layout, and the data README.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`defaultIndexPath()` checks only `<caller root>/.speckit-index/`. A Barter project such as `backend-system` links `.skilled` to `ai-speckit/skilled/.skilled` and `specs` to `ai-speckit/specs/backend-system`, and has no index of its own, so a bare lookup there reads the packaged Skilled index and finds no Barter packet. A bare generation there would also write a second, partial index, because `isHostRepository` is true for the project.

### Purpose
A bare Gate 1 lookup from a linked project answers from the owning host's index, scoped to the project's own track.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd barter/backend-system && node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --scoring-only -- "notifications activity logs listing trim"
scope      : (unscoped)
source     : ../ai-speckit/skilled/.skilled/skills/system-spec-kit/runtime/data/trigger-index.json
candidates : 0 from 106 phrase(s)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `owningHostRoot(root)`: the git toplevel holding the realpath of `<root>/.skilled`, when it differs from the root and keeps an index.
- Resolve the lookup's default index as own index, then owning host index, then packaged.
- Default the scope to the project's linked track when reading an owning host's index, and print which root the paths are relative to.
- Refuse a bare generation from a linked project with exit 2.
- Cover the linked layout in `host-trigger-index.vitest.ts` and describe it in `runtime/data/README.md`.

### Out of Scope
- Linking `.speckit-index` into each project through `/doctor:symlink` - it moves the fix into setup and leaves every unlinked project broken.
- Loosening `isHostRepository` - its verdict is right; only the index location was wrong.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/host-index.mjs` | Modify | `owningHostRoot` |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modify | Default index order, default scope, paths line |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Modify | Refuse a bare run from a linked project |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/host-trigger-index.vitest.ts` | Modify | Linked-project cases |
| `.skilled/skills/system-spec-kit/runtime/data/README.md` | Modify | Linked-project lookup |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A bare lookup from a linked project reads the owning host's index, names it in `source`, and finds the project's packets. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | From a linked project the default scope is the project's linked track; `--spec-folder ""` unscopes and an explicit `--spec-folder` wins. |
| REQ-003 | A project whose linked tree's host keeps no index falls back to the packaged index. |
| REQ-004 | A bare generation from a linked project exits 2 and writes nothing; a host root and Skilled's checkout behave as before. |
| REQ-005 | The retrieval suites keep every baseline pass (143 passed, 1 skipped). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Barter reproduction from `backend-system` finds the notifications packet with no flag.
- **SC-002**: Barter can drop its "run Gate 1 from the ai-speckit root" workaround.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `host-index.mjs` detection | A wrong owner reads another repository's index | The owner must be the git toplevel of the vendored tree and keep an index; no ancestor walk |
| Risk | Default scope hides a cross-track answer | Low | `--spec-folder ""` unscopes, and the scope line says what applied |
| Risk | A project generation writes a partial index | Med | The generator refuses a bare run from a linked project |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One extra git subprocess when the caller has no index of its own.

### Security
- **NFR-S01**: The lookup reads only the index of the repository that owns the caller's linked tree.

### Reliability
- **NFR-R01**: Skilled's checkout and a host root resolve exactly as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a caller outside any git checkout reads the packaged index.
- Maximum input: Barter's host index over every track, scoped to one.
- Failure path: a bare generation from a linked project exits 2 with the owner named.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three scripts, one test file, one README |
| Risk | 9/25 | Default index and scope of Gate 1 for linked checkouts |
| Research | 4/20 | Layout measured read-only in Barter |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


