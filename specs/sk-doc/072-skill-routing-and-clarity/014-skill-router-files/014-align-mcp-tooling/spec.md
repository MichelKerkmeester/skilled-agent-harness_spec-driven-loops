---
title: "Feature Specification: Phase 14: align-mcp-tooling"
description: "After the machine router moved from SKILL.md to ROUTER.md, many mcp-tooling docs still named SKILL.md as the router or pointed at sections that moved. This phase ran an operator-local alignment check over the skill, fixed the upheld findings that did not change routing, and carried the routing-data items to the routing follow-up."
trigger_phrases:
  - "align mcp tooling"
  - "phase 14 align mcp tooling"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: align-mcp-tooling

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | `worktrees/274-packet-router-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 22 |
| **Predecessor** | 013-align-mcp-code-mode |
| **Successor** | 015-align-sk-code |
| **Handoff Criteria** | Every upheld mcp-tooling finding that does not change routing is fixed, each other item carries a written disposition, and every recheck failure is classified. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the Alignment check per skill after the router move specification.

**Scope Boundary**: The files under `.skilled/skills/mcp-tooling/` that changed since base `6a9946a800`, plus this spec folder. Routing data, such as `hub-router.json` aliases and weights and the advisor's scoring, stays unchanged.

**Dependencies**:
- The router move from phases 004 and 005, which put each mcp-tooling router in a `ROUTER.md`.
- An operator-local alignment check, whose evidence sits in the run folder outside the checkout.
- The router-file resolver, used to prove that no skill routes differently.

**Deliverables**:
- The fix-lane and router-prose edits to the mcp-tooling docs listed in section 3.
- A disposition for each LEFT and OUTSIDE item, and a classification for each recheck failure.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The machine router of the mcp-tooling hub and its eight modes moved from `SKILL.md` to `ROUTER.md`. Many READMEs, install guides, catalogs, playbooks and changelogs still credited `SKILL.md` with routing, or cited router sections that no longer existed. A reader who followed them landed in the wrong file.

### Purpose
Every mcp-tooling doc points at the file that now holds the router, with no change to what the skill routes to.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Captured by the operator-local alignment check. Full output in the run folder outside the checkout.
```text
$ first run (pushed tree, before the fix lane)
Commits: 6a9946a800 to 4f741f6b48, 27 first-parent commits
Files: 96, of which 0 uncommitted or untracked
Findings: 27 (P0 0, P1 4, P2 23), 9 literal, 0 inferred, 17 outside the scope; 17 more overturned by the critic and not counted
Battery: {"pass":153,"not_applicable":3}
Probes: STATUS=FINDINGS run-probes: pass=10 fail=3 cannot_run=0

$ recheck (worktree, after the fix lane and the router-prose pass)
Battery: {"fail":3,"pass":202,"not_applicable":3}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the mcp-tooling files changed since base `6a9946a800` and run the check battery over them.
- Review them in four read-only lanes (code; skill docs; READMEs, changelogs and env; routing) and score the routing probes against the advisor.
- Fix each upheld finding that does not change routing, then fix the router prose the fix lane was barred from.
- Recheck the full battery against the worktree and classify each failure.

### Out of Scope
- Routing-data changes, such as `hub-router.json` aliases and advisor scoring - the packet decision is that no skill routes differently; these go to the routing follow-up recorded in the parent spec.
- Authoring routing gold for mcp-notion - that is coverage work, not doc alignment.

### Files to Change

All paths are under `.skilled/skills/mcp-tooling/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md`, `ROUTER.md`, `benchmark/README.md`, `changelog/v1.9.3.0.md` | Modify | Router credits, the defer checklist, the mode count and an alignment bullet |
| `feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md`, `feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md` | Modify | SKILL.md and ROUTER.md roles; "eight source modes" |
| `mcp-notion/references/mcp-tools.md`, `mcp-notion/feature-catalog/**` (26 files) | Modify | Operation-table pointers now cite `ROUTER.md` section 3 |
| `mcp-*/README.md`, `mcp-*/INSTALL-GUIDE.md`, `mcp-*/examples/README.md`, `mcp-*/mcp-servers/*/README.md` | Modify | `ROUTER.md` rows added; SKILL.md role scoped to runtime instructions; version pins dropped |
| `mcp-*/changelog` newest entries, `mcp-notion/changelog/v0.1.4.0.md` | Modify | Propagation claims corrected; one alignment bullet each |
| `mcp-chrome-devtools/manual-testing-playbook/intra-routing-recall/cli.md` | Modify | Dropped a nonexistent router section citation |
| `mcp-click-up/ROUTER.md`, `mcp-notion/ROUTER.md` | Modify | The ALWAYS loading line names SKILL.md and this ROUTER.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No skill routes differently after the edits. | All 54 skill routers parse identically to HEAD through the router-file resolver. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Each upheld finding is fixed or carries a written disposition, and each recheck failure is classified. | The evidence lists 17 FIXED lines, and each of the 3 LEFT, 5 OUTSIDE and 3 recheck failures has a disposition or classification. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check --strict` passes on the hub and its 8 packets, `validate_document.py` reports 0 issues on the 62 changed files, and the link check reports 0 broken markdown links.
- **SC-002**: The recheck battery reads `{"fail":3,"pass":202,"not_applicable":3}`, and all 3 failures are derived files that re-mint or regenerate at commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek V4.1 Flash review and fix workers | A weak finding could land as a wrong edit | A critic overturned 17 findings before the fix lane ran |
| Risk | A fix edits routing data and changes a route | High | The fix lane was barred from routing data; A-04 was applied, then reverted on the routing-data guard; the resolver confirms all 54 routers parse identically to HEAD |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do the routing-data items D-01, D-06, D-08, D-09 and N-03 belong here? Decision: no; each needs a routing-data or advisor change and is carried to the routing follow-up recorded in the parent spec.
- None else blocks.
<!-- /ANCHOR:questions -->

---

