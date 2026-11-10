---
title: "Feature Specification: Phase 15: cli-hub-routing-and-classifier"
description: "Advertised routing promises do not hold: the Jev Pi transport never runs on the installed Pi, nine phrases the classifier hub advertises defer, an OpenCode Go request goes to sk-code, and a described hook problem gets no doctor command. This phase makes each advertised route reach its target."
trigger_phrases:
  - "cli hub routing and classifier"
  - "phase 15 cli hub routing and classifier"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: cli-hub-routing-and-classifier

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/334-v4-release-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 17 |
| **Predecessor** | 014-doctor-and-ci-gate-honesty |
| **Successor** | 016-authoring-hub-manifests-and-drift |
| **Handoff Criteria** | Every advertised Jev phrase routes, the Pi transport resolves the installed Pi, and the two advisor prompts reach their intended targets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the v4 release line remediation specification.

**Scope Boundary**: The cli-classifier hub vocabulary and Pi transport, the cli-external-orchestration routing for OpenCode Go, and the advisor data that decides the two misrouted prompts. The lead extended this phase into `system-skill-advisor` and the doctor routing metadata.

**Dependencies**:
- Phase 008 committed (`d56a0ae447`)
- Verified findings V18, V19, V20 and V50 in `../research/research.md`

**Deliverables**:
- A Pi transport that resolves the managed Pi install and gates on capability
- Hub vocabulary that routes every advertised Jev phrase, with a drift test
- Advisor phrase and problem-cue data that route the two prompts, with tests
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Jev Pi transport looks for an npm package above the `pi` executable and pins version 0.99.2; the installed Pi 1.5.0 is a managed install whose launcher has no package above it, so the route never runs. Nine phrases the cli-classifier routers advertise are missing from the hub vocabulary and defer. The advisor ranks sk-code first for "opencode go route this task" through a bare `opencode` token, and "my hooks are not firing, what do I run" reaches no doctor command although v4.0.1.0 says it should.

### Purpose
Every route the documentation advertises reaches its target, and a test fails when one stops.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "<phrase> for this"
jev urgency check, jev yes or no, jev probability, jev pick one, jev options, jev batch, jev openrouter, expose jev: "action":"defer"
jev score, jev model id, shape a jev question: "action":"route"
$ realpath of `pi` on PATH
/Users/michelkerkmeester/.pi/agent/bin/pi   (POSIX shell launcher; package at install/releases/1.5.0/node_modules/@earendil-works/pi-coding-agent)
$ skill-advisor advisor_recommend "opencode go route this task"
top: sk-code 0.783 (explicit_author)
$ skill-advisor advisor_recommend "my hooks are not firing, what do I run"
top: cli-external-orchestration 0.128, compiledRoute action defer; no doctor command
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolve the managed Pi layout and replace the exact version pin with a capability gate.
- Add every advertised but missing Jev phrase to the hub vocabulary, guarded by a test that probes each one.
- Route "opencode go" requests to cli-external-orchestration in the advisor, and give hook-not-firing problems a cue and doctor trigger phrases.
- Regenerate the command bridges and republish compiled routing copies inside the worktree.

### Out of Scope
- Changing which mode "opencode go route" selects inside cli-external-orchestration - the hub routes it to DeepSeek Harness by a documented design with a passing test; decided in ADR-001.
- The Pi transport benchmark - it records the version it measured.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` | Modify | Managed-install resolution, capability gate |
| `.skilled/skills/cli-classifier/hub-router.json` | Modify | Advertised Jev phrases |
| `.skilled/skills/cli-classifier/{cli-jev/SKILL.md,feature-catalog/...}` | Modify | Version gate wording |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/{lanes/explicit.ts,doctor-helper-handoff.ts}` | Modify | OpenCode Go phrase, firing cue |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Hook-not-firing trigger phrases |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` | Regenerate | Bridges from the doctor phrases |
| tests under each area | Create/Modify | Regression coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every keyword advertised in the cli-classifier ROUTER files routes to cli-jev through compiled routing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The Pi transport resolves a managed Pi install and accepts a Pi whose runtime exposes the methods it calls, instead of pinning one version. |
| REQ-003 | The advisor ranks cli-external-orchestration above sk-code for "opencode go route this task", and sk-code keeps OpenCode authoring prompts. |
| REQ-004 | The advisor surfaces a doctor command for "my hooks are not firing, what do I run". |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new routing, transport and advisor tests pass, and the advisor, classifier and compiled-routing suites hold their baselines.
- **SC-002**: The live advisor CLI returns the intended targets for both prompts after the rebuild.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new phrase steals prompts from another skill | Med | Advisor suite and routing parity tests rerun |
| Risk | A later Pi major changes the runtime API | Med | Capability gate checks the methods, not only the version |
| Dependency | Generated bridges and compiled routing copies | Med | Regenerated by the orchestrator with the documented commands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: data and resolution changes only; no new scan or network call.

### Security
- **NFR-S01**: The managed-install version string is accepted only when it matches `[0-9A-Za-z._+-]+`, so it cannot traverse paths.

### Reliability
- **NFR-R01**: A Pi that fails the capability gate falls back to the Jev CLI with the existing skip line.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `pi` on PATH keeps gate `package` and the CLI fallback.
- Maximum input: a managed install with several releases uses only the one named in `current-version`.
- Failure path: an unreadable or invalid `current-version` keeps gate `package`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Two hubs, the advisor scorer, doctor metadata, generated bridges |
| Risk | 12/25 | Routing data shared by every prompt |
| Research | 8/20 | Causes confirmed by probes |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The mode choice for "opencode go route" inside the hub is kept by ADR-001.
<!-- /ANCHOR:questions -->

---
