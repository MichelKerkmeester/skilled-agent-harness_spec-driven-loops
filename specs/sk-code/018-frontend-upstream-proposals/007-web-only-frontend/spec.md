---
title: "Feature Specification: Phase 7: web-only-frontend"
description: "Canonical sk-code carries a React Native layer that no Skilled code uses and that only a project fork consumes. This phase removes it, so the frontend surface holds web practice and the Figma-to-code check, and React Native goes back to the project fork."
trigger_phrases:
  - "web only frontend"
  - "phase 7 web only frontend"
  - "remove react native from sk-code"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: web-only-frontend

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-open-items-and-alignment |
| **Successor** | None |
| **Handoff Criteria** | No React Native resource, intent or alias is left in canonical sk-code, and every routing gate passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the frontend upstream proposals packet.

**Scope Boundary**: the React Native half of `sk-code-frontend` and every surface that names it: the packet's references, router, core page, playbook and changelog; the sk-code hub router, vocabulary, registry, graph metadata, docs and gold scenario; and the repo docs that describe the surface.

**Dependencies**:
- Phase 006 closed, with every routing gate green at `f829fa7be5`.

**Deliverables**:
- A web-only frontend surface, the decision that supersedes phase 001's ADR-001, and green gates.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 shipped a React Native stack layer and five native topic files in `sk-code-frontend` and changed the sk-code router to say canonical sk-code owns React Native practice. Skilled's own code holds no React Native, and the only React Native consumer is a project fork that overlays the guidance anyway. The operator decided canonical Skilled should not carry it.

### Purpose
`sk-code-frontend` holds web practice and the Figma-to-code check only, React Native is an unsupported stack in canonical sk-code again, and routing stays clean on every hub.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ ls .skilled/skills/sk-code/sk-code-frontend/references/ | grep -c native
6
$ rg -c '"(FRONTEND_NATIVE|NATIVE_[A-Z_]+)"' .skilled/skills/sk-code/sk-code-frontend/ROUTER.md
12
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the six native references and the native playbook scenario.
- Remove the native intents, resource-map rows and aliases from the packet router, the hub router, the hub vocabulary and the mode registry.
- Restore React Native to the unsupported stacks and narrow the router's ownership sentence back to web practice.
- Rewrite every "web and React Native" description to web, and the frontend gold scenario to a web prompt.
- Record the reversal as a decision that supersedes phase 001's ADR-001.

### Out of Scope
- sk-design-fundamentals' reduced-motion guidance, which names platform settings as design behaviour, not React Native code practice.
- Barter's overlays, which keep their React Native surfaces in the fork; the parent's re-pin section is updated to say so.
- Changelog entries already released on main.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-code-frontend/references/native-*.md`, `react-native-layout-and-a11y.md` | Delete | The native layer |
| `sk-code-frontend/manual-testing-playbook/frontend-surface/frontend-native.md` | Delete | The native scenario |
| `sk-code-frontend/ROUTER.md`, `SKILL.md`, `README.md`, `frontend-practice.md`, `figma-to-code.md`, playbook index, changelogs | Modify | Web only |
| `sk-code/ROUTER.md`, `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `SKILL.md`, `README.md`, `description.json`, shared references, playbook | Modify | Web only; React Native unsupported |
| Root `README.md`, `.skilled/skills/README.txt`, `sk-code-review/README.md` | Modify | Surface descriptions |
| `decision-record.md` here, `001-frontend-surface-mode/decision-record.md` | Create, modify | The superseding decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No React Native reference, intent, resource row or alias remains under `.skilled/skills/sk-code/` |
| REQ-002 | Every compiled-route suite, the admission check and the router-sync check pass after the change |
| REQ-003 | Router reach at concurrency 2 prints `outranked=  0` and `wrong-hub=  0` on every hub |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The unsupported-stack lists name React Native again, and the router says React Native surfaces live in a project fork |
| REQ-005 | `decision-record.md` records the reversal and phase 001's ADR-001 is marked superseded |
| REQ-006 | `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -i "react native|react-native|NATIVE_" .skilled/skills/sk-code` prints only the unsupported-stack and fork-ownership lines.
- **SC-002**: A web frontend prompt still routes to `sk-code-frontend`, and a React Native prompt no longer does.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A removed alias leaves an orphaned advisor signal | Low | `generate-router-intent-signals.cjs --check` reports it; `--write` prunes it |
| Risk | Removing intents moves another prompt's route | Med | Reach on every hub, compiled-route suites and admission after the sync |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: Every web intent and its resources route exactly as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A prompt that names both a web and a React Native concern routes on its web terms only.
- `accessibility labels` was a native alias; it goes with the native intent, and web accessibility keeps its own phrases.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 40 files, most a line or two |
| Risk | 8/25 | Routing sources change; reach and the suites gate them |
| Research | 2/20 | The footprint is mapped |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator decided to remove React Native from canonical Skilled on 2026-11-03.
<!-- /ANCHOR:questions -->

---
