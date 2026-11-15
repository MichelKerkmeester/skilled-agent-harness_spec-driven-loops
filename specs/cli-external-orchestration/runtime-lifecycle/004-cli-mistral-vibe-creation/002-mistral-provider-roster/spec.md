---
title: "Feature Specification: Phase 2: mistral-provider-roster"
description: "The operator subscribed to Mistral and connected it in OpenCode and Pi, but neither cli skill's closed roster lists a Mistral route, so a governed dispatch cannot use it. This phase adds Mistral's DeepSeek V4.1 Flash 1017 and GLM-5.3-Flash routes to both rosters after a live probe of each."
trigger_phrases:
  - "mistral provider roster"
  - "phase 2 mistral provider roster"
  - "mistral deepseek v4 1 flash 1017 route"
  - "mistral zai glm 5 3 flash route"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: mistral-provider-roster

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 12 |
| **Predecessor** | 001-deep-research |
| **Successor** | 003-dsh-mistral-route |
| **Handoff Criteria** | Both roster files list the two Mistral ids, and each id answered a live dispatch on both CLIs |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode specification.

**Scope Boundary**: The cli-opencode and cli-pi roster documents and the provider counts in their `SKILL.md` files. Deep-loop fan-out wiring stays out.

**Dependencies**:
- The operator's Mistral credential in OpenCode and in Pi.

**Deliverables**:
- A `mistral` section in each `references/providers-and-models.md` with the two ids.
- Probe evidence in `evidence/probes.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Both cli skills run a closed roster, and an id missing from the roster is forbidden even when the CLI can reach it. The operator connected a new Mistral subscription in OpenCode and Pi, and both CLIs list Mistral's DeepSeek and GLM ids, but no roster names them, so no governed dispatch may use them.

### Purpose
Make `mistral/deepseek-v4-1-flash-1017` and `mistral/zai-glm-5-3-flash` roster routes on both CLIs, each backed by a live reply.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ opencode models --standalone | grep '^mistral/' | grep -E 'deepseek|glm'
mistral/deepseek-v4-1-flash-1017
mistral/zai-glm-5-3
mistral/zai-glm-5-3-flash
$ pi --list-models mistral   (rows for the two ids)
mistral   deepseek-v4-1-flash-1017  1.0M     128K     yes       yes
mistral   zai-glm-5-3-flash         1.0M     131.1K   yes       yes
$ rg -c 'mistral/' cli-opencode/references/providers-and-models.md cli-pi/references/providers-and-models.md
(no match before this phase)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `mistral` section with both ids to the cli-opencode roster.
- Add a `mistral` section with both ids to the cli-pi roster, marked direct dispatch only.
- Change the provider count from four to five in both `SKILL.md` files.
- Probe each id on each CLI with a same-run control, and record the replies.

### Out of Scope
- Adding the ids to `PI_SUPPORTED_MODELS` or the fan-out maps - the request was roster options, and the opencode-go GLM row already sets the direct-dispatch-only precedent.
- Changing any default model - DevPass stays the default on both CLIs.
- Repairing Pi's stored Mistral key - a credential is the operator's to enter.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | `mistral` roster section and effort row |
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Five reachable providers |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | `mistral` roster section, provider count |
| `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` | Modify | Five reachable providers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both roster files list both Mistral ids | `rg -c 'mistral/(deepseek-v4-1-flash-1017|zai-glm-5-3-flash)'` on each file prints at least 2 |
| REQ-002 | Each id answered a live dispatch on each CLI | `evidence/probes.md` records an `OK` reply for all four id and CLI pairs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The edited docs pass the sk-doc validator | `validate_document.py` prints `Total issues: 0` for all four files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `opencode run --standalone -m mistral/deepseek-v4-1-flash-1017#max` and `-m mistral/zai-glm-5-3-flash#max` each reply `OK`.
- **SC-002**: `pi -p --model mistral/deepseek-v4-1-flash-1017 --thinking max` and the GLM equivalent each reply `OK` with a valid Mistral key.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi's stored Mistral key | A plain Pi dispatch returns `401 Invalid API Key` until it is replaced | Verified with a per-run `--api-key`; the operator re-runs `pi auth login mistral --api-key` |
| Risk | Billing source | Med: Mistral prices DeepSeek at double the DevPass rate if turns bill as pay-as-you-go | Both roster sections mark billing UNKNOWN until the Mistral console counter is read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does an OpenCode or Pi turn on these routes draw on the subscription's shared usage pool or on pay-as-you-go?
<!-- /ANCHOR:questions -->

---
