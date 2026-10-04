---
title: "Feature Specification: Deep research: cli-classifier quality audit"
description: "A ten-iteration fan-out deep research run over the shipped cli-classifier work, two lineages of five, checking standards compliance, advisor integration, user experience, documentation, bugs, drift and how visible the measurements are."
trigger_phrases:
  - "cli-classifier quality research"
  - "cli-classifier compliance audit"
  - "jev classifier drift research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep research: cli-classifier quality audit

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/085-jev-feature-improvement-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet `cli-jev/003-cli-jev-workflow-integration` shipped the cli-classifier parent hub, its cli-jev packet, a shared Jev transport and six scorer callers across sk-doc, system-deep-loop and system-spec-kit, then deleted the features that did not earn their place. Each phase was reviewed on its own, but nobody has audited the finished whole for standards compliance, advisor integration, user experience, documentation accuracy, latent bugs, drift between docs and code, and whether its measured results are visible to a reader.

### Purpose
Produce a ranked, evidence-cited findings report that says where the shipped cli-classifier work falls short on each of those seven axes, so a follow-up packet can fix what matters.
### Research Findings

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Source of truth: `research/research.md`. Ten iterations across two lineages produced eleven distinct findings, all confirmed by the orchestrator: one P1 and ten P2, no P0.

- P1 CQ-01: five cli-jev reference and asset docs fail `validate_document.py` for a missing Overview section.
- P2 CQ-02: the hub `SKILL.md` describes the transport default backwards (Pi is tried first when nothing is selected).
- P2 CQ-03: `score-clarify-default.cjs` records `backend: 'jev'` and no `transport`, against the catalog's claim.
- P2 CQ-04 and CQ-05: two shared-transport edge cases no live caller reaches (a `choice` with no question, an omitted `env`).
- P2 CQ-06 to CQ-12: a stale shared README, a 41-versus-46 test count, a missing `v0.8.0.0` changelog, an install line only in the packet README, one approved advisor divergence and a 0.75-versus-0.60 band in a 049 summary.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research over `.skilled/skills/cli-classifier/` (hub, `cli-jev` packet, `shared/`, `benchmark/`, catalog, playbook, changelogs) and every live caller of its shared transport.
- Seven axes: sk-doc compliance, sk-code-opencode compliance, system-skill-advisor integration, UX for external repository users and for the operator, documentation quality, bugs, drift, and visibility of the measured results.
- A fan-out run of two lineages: DeepSeek V4.1 Flash max on cli-devin and GPT-6 Luna at max reasoning on the fast tier through cli-codex, five iterations each.
- A merged `research/research.md` with ranked findings, each citing `file:line`.

### Out of Scope
- Fixing any finding. Fixes belong to a follow-up packet the operator approves.
- Live Jev or Pi calls. The research reads code, docs and recorded run folders only, so no key is needed.
- Re-measuring any feature. Recorded results are evidence, not something to regenerate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/cli-jev/004-cli-classifier-quality-research/research/**` | Create | Fan-out lineage state, iterations and the merged synthesis |
| `specs/cli-jev/004-cli-classifier-quality-research/*.md` | Modify | Packet docs and the closing summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run five iterations each through the `/deep:research` fan-out workflow | Each lineage directory holds five iteration files and a state log the runner accepted |
| REQ-002 | The merged synthesis covers all seven axes | `research/research.md` has a section or an explicit no-finding line per axis |
| REQ-003 | No lineage writes outside its own directory | The runner's write containment reports no violation and `git status` shows changes only under `research/` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every finding cites `file:line` and the orchestrator spot-checks the top findings | Spot-check results are recorded in `implementation-summary.md` |
| REQ-005 | The packet validates | `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A ranked findings list with severity, axis and a cited location for every entry.
- **SC-002**: Each top-ranked finding is confirmed or refuted by the orchestrator against the repository.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `devin` and `codex` binaries and their provider quotas | A lineage fails | The runner retries; a lineage that still fails is reported, not replaced |
| Risk | Lineages restate the brief instead of finding defects | Med | The topic names axes and surfaces, never an expected conclusion, and findings must cite `file:line` |
| Risk | Two lineages disagree | Low | The disagreement is reported with the evidence each side cites |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at start. Questions the run raises go into `research/research.md`.
<!-- /ANCHOR:questions -->

---


