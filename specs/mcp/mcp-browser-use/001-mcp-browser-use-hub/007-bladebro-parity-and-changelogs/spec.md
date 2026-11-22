---
title: "Feature Specification: Phase 7: bladebro-parity-and-changelogs"
description: "Bladebro lacked the install guide, manual asset and scripts its sibling modes carry, the global changelog tree did not reach the browser hub, and the mode benchmark folders covered a fraction of their playbooks."
trigger_phrases:
  - "bladebro parity and changelogs"
  - "phase 7 bladebro parity and changelogs"
  - "browser hub changelog topology"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: bladebro-parity-and-changelogs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `worktrees/505-mcp-browser-use-hub` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-verification |
| **Successor** | None |
| **Handoff Criteria** | Bladebro carries a guide, an asset and scripts like Aside. Every skill changelog folder resolves from `.skilled/changelog/`. Each mode playbook scenario has a recorded verdict or a named blocker |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the mcp-browser-use hub program. It answers two operator requests from 2026-11-22: Bladebro parity plus changelog alignment, and benchmark results in the nested mode folders.

**Scope Boundary**: the `mcp-bladebro` packet, the browser hub's changelogs and their links under `.skilled/changelog/`, the mutation-class manifest row, entries for what shipped on 2026-11-21 and 2026-11-22, and new mode benchmark reports. Scenario files are inputs and are not rewritten.

**Dependencies**:
- 006-verification, whose live runs and goal log this phase reads.

**Deliverables**:
- Bladebro `INSTALL-GUIDE.md`, `assets/utcp-bladebro-manual.md` and `scripts/` with a manifest row.
- `.skilled/changelog/mcp-browser-use/` with four links.
- Five changelog entries and matching version bumps.
- Five new mode benchmark reports.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Bladebro had no install guide, no manual asset and no scripts, while Aside and Chrome DevTools had all three. The global changelog tree still pointed at the old `mcp-tooling` paths for two moved modes and had no folder for the browser hub. Several shipped changes had no changelog entry. The Chrome DevTools and Aside benchmark folders held results for 5 of 30 and 5 of 29 scenarios.

### Purpose
An operator can install and check Bladebro like its siblings, every changelog resolves from the global tree and says what shipped, and every playbook scenario has a verdict or a named blocker.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/mcp-browser-use/mcp-bladebro
benchmark changelog manual-testing-playbook README.md references ROUTER.md SKILL.md
$ find .skilled/changelog -type l ! -exec test -e {} \; -print
./mcp-tooling/mcp-chrome-devtools
./mcp-tooling/mcp-aside-devtools
$ ls .skilled/changelog
cli-classifier cli-external-orchestration cli-orca mcp-code-mode mcp-tooling sk-code sk-design
sk-doc sk-git sk-prompt skilled system-deep-loop system-skill-advisor system-skilled-doctor system-spec-kit
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add Bladebro's install guide, manual asset and two scripts, wired into its router, `SKILL.md` and the hub leaf manifest.
- Rebuild the browser hub's links under `.skilled/changelog/` and remove the two dangling ones.
- Add changelog entries for the Bladebro work, the hub router fix, the two relocations and the advisor scorer fix.
- Run every uncovered playbook scenario that needs no operator yes, and record it.

### Out of Scope
- `feature-catalog/`, `examples/` and `mcp-servers/` for Bladebro - no current reader needs them, and Aside's copies were not asked for.
- Rewriting stale scenario files - the reports name the fixes, and the scenarios belong to their packet.
- Scenarios that drive the signed-in Aside browser or account - they need an operator yes.
- A `session-handover` changelog entry - hooks have no changelog home, and none is invented.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/{install,doctor}.sh` | Create | Pinned install wrapper and read-only doctor |
| `.skilled/skills/mcp-browser-use/mcp-bladebro/{INSTALL-GUIDE.md,assets/utcp-bladebro-manual.md,scripts/README.md}` | Create | Guide, manual snapshot, scripts README |
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Modify | `mcp-bladebro` row |
| `.skilled/changelog/mcp-browser-use/*`, `.skilled/changelog/mcp-tooling/mcp-{chrome,aside}-devtools` | Create, Delete | Changelog links |
| `.skilled/skills/*/changelog/v*.md` and the matching `SKILL.md` and hub JSON versions | Create, Modify | Five entries and their bumps |
| `.skilled/skills/mcp-browser-use/mcp-{chrome,aside}-devtools/benchmark/reports/2026-11-22--*` | Create | Five reports and index rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-mcp-mutation-class.sh` passes with both Bladebro scripts listed, and `doctor.sh` makes no registry call |
| REQ-002 | Every `skills/*/changelog` and `skills/*/*/changelog` folder resolves from a link under `.skilled/changelog/`, and no link dangles |
| REQ-003 | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` ends with `OK` and the compiled-route guard reports the hub fresh |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each new changelog entry passes `check_changelog_shape.py`, and each `SKILL.md` version equals its newest entry |
| REQ-005 | Every Chrome DevTools and Aside scenario has a recorded verdict, or appears on the operator-yes list |
| REQ-006 | The install guide, asset and scripts README validate with 0 issues |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash scripts/doctor.sh` in the Bladebro packet exits 0 and lists the five tools, with no Bladebro process left after it.
- **SC-002**: The coverage check prints `58 changelog dirs, 58 covered, 0 uncovered`.
- **SC-003**: Chrome DevTools has 30 of 30 scenarios recorded, and Aside has 16 of 29 with the other 13 named as needing a yes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The installed Bladebro binary for the doctor run | No live doctor evidence | It is installed. The operator chose to keep it in 006 |
| Risk | `install.sh` removing a good install after a PATH miss | High | It locates the install through `npm root -g`, never PATH |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. No service runs.
- **NFR-P02**: The doctor's MCP probe ends within 15 seconds through its watchdog.

### Security
- **NFR-S01**: The install wrapper refuses a binary whose SHA-256 differs from the recorded digest.
- **NFR-S02**: No report quotes a cookie value, email or account id.

### Reliability
- **NFR-R01**: `doctor.sh` leaves no `bladebro` process behind.
- **NFR-R02**: N/A. No error budget applies to operator scripts.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `bladebro` absent, so the doctor prints the install command and exits 0.
- Maximum input: a version other than 4.8.2, so the doctor warns and treats a digest difference as expected.
- Failure path: a digest mismatch on the pinned version exits 1, and in `install.sh` it also removes the install.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 45 files, two scripts, docs and links |
| Risk | 8/25 | One installer, no shared API change |
| Research | 6/20 | The offline switch and output formats read from the tools |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the 13 Aside scenarios that drive the signed-in browser run now? That waits for an operator yes.
<!-- /ANCHOR:questions -->

---
