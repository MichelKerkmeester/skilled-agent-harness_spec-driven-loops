---
title: "Feature Specification: Phase 21: host-root-marker-refresh"
description: "upgrade-legacy derives its repository from where the script lives, so in a host that vendors Skilled the marker refresh can only reach the vendored tree and never the host's own packets. This phase makes the script use the host it runs from, measures Barter's marker census on a copy, and brings two READMEs up to date."
trigger_phrases:
  - "host root marker refresh"
  - "phase 21 host root marker refresh"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: host-root-marker-refresh

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
| **Phase** | 21 of 21 |
| **Predecessor** | 020-operator-approved-closeout |
| **Successor** | None |
| **Handoff Criteria** | A dry run from a host root reports the host's packets and no ignored mirror; the Barter census is measured on a copy; both READMEs name the new pieces |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the v4 release line remediation specification.

**Scope Boundary**: Three caveats left open by phases 018 and 019 in the Barter handover: the marker refresh's repository root in a host, the unmeasured Barter marker census, and two READMEs that do not name the new pieces.

**Dependencies**:
- Host detection from phase 018 (`runtime/cli/retrieval/lib/host-index.mjs`).
- Barter's checkout is read-only; the census runs on a copy in the scratchpad.

**Deliverables**:
- `upgrade-legacy.mjs` resolves a host caller's repository and scans its `specs/`, skipping folders the host ignores.
- A measured Barter marker census.
- `runtime/cli/retrieval/lib/README.md` and `runtime/cli/spec/README.md` updated.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`upgrade-legacy.mjs` sets its repository to three levels above the skill folder it was loaded from. In Barter, `.skilled` resolves to `barter/ai-speckit/skilled/.skilled`, so the repository becomes the vendored `skilled/` tree: the default roots and every `--roots` value resolve there, and Barter's own `specs/` cannot be reached. The handover therefore shipped `--refresh-markers` with a caveat instead of a working host path.

### Purpose
Run from a host root, the marker refresh scans that host's packets and nothing else.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd barter/ai-speckit && node .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs --roots specs/bartender
upgrade-legacy: no such root: /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit/skilled/specs/bartender
exit=2   (git status line count 8590 before and after: nothing written)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the repository to the caller's host repository when `isHostRepository` holds, and print one stderr line naming it.
- In host mode, default the roots to `<host>/specs` only and skip spec folders git ignores in the host.
- Add a host-layout vitest file covering the host default, an explicit host root and the unchanged framework path.
- Measure Barter's marker census with a dry run over a scratch copy.
- Name the host helper and `--refresh-markers` in the two READMEs.

### Out of Scope
- Writing any marker in Barter - Barter's checkout is read-only here and the apply step is Barter's.
- A warning for a stale host trigger index - the lookup reads what the host committed by design, and Barter's CI owns the check.
- Changing the framework checkout's discovery - the non-host path must behave exactly as before.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Host repository root, host default roots, ignored folders skipped |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy-host-root.vitest.ts` | Create | Host layout cases |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md` | Modify | Name `host-index.mjs` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Name `--refresh-markers` and host behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Run from a host root, `upgrade-legacy.mjs --refresh-markers` reports the host's old-marker packet under `specs/`, names the host on stderr, and never mentions a folder the host ignores. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Run from the framework checkout, no host line is printed and the existing upgrade-legacy tests keep every baseline pass (3 files, 82 tests). |
| REQ-003 | Barter's marker census is measured on a scratch copy and recorded in `implementation-summary.md`. |
| REQ-004 | Both READMEs name the new pieces. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: From Barter's root, `--refresh-markers --roots specs/bartender` resolves under `barter/ai-speckit/specs`, not the vendored tree.
- **SC-002**: The handover drops the "wrong folders", "unknown count" and "READMEs behind" caveats.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `host-index.mjs` detection | A wrong host verdict picks the wrong tree | Reuse the tested helper; the framework path is covered by a negative case |
| Risk | An applied run in a host writes the ignored Skilled mirror | Med | Host discovery skips git-ignored folders |
| Risk | `.opencode/specs` in a host points into the vendored tree | Med | Host default roots are `specs/` only |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: One git subprocess per run for the ignore check.

### Security
- **NFR-S01**: Every existing root containment check still applies against the host root.

### Reliability
- **NFR-R01**: The framework checkout's behavior is unchanged.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a host with no `specs/` has no default root and scans nothing.
- Maximum input: Barter's host tree, measured on a copy.
- Failure path: a caller outside any git checkout falls back to the script-derived repository.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One script, one test, two READMEs |
| Risk | 10/25 | Root selection for an opt-in write path |
| Research | 5/20 | Host layout measured read-only |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


