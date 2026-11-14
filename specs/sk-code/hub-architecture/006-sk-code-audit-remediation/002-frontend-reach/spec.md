---
title: "Feature Specification: Phase 2: frontend-reach"
description: "Ordinary frontend requests return defer and never load the frontend surface. This phase adds file markers and the vocabulary people use, removes the bare words that misfire and proves both with a fixed probe list."
trigger_phrases:
  - "frontend reach"
  - "phase 2 frontend reach"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: frontend-reach

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/379-sk-code-audit-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 8 |
| **Predecessor** | 001-finding-verification |
| **Successor** | 003-frontend-content |
| **Handoff Criteria** | All 13 `frontend` probes and the `review` probe name `sk-code-frontend`, no `negative` probe does, and the setup battery's guard and sync legs print PASS. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the sk-code audit remediation specification.

**Scope Boundary**: This phase changes how a request reaches the surface. It changes no reference content inside `sk-code-frontend/references/`.

**Dependencies**:
- Phase 001 `scratch/router-baseline.txt`
- `.skilled/repo-rules/skill-hub-routing.md`, loaded before the first registry edit

**Deliverables**:
- A `surfaceDetection` block for `sk-code-frontend`
- Reworked frontend vocabulary in every copy
- Hub playbook scenarios that replay the probes
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An agent that asks the sk-code hub for help with everyday web work gets `defer` and no frontend evidence: 12 of the 13 frontend probes fail to route. The vocabulary is a list of rare exact phrases, and the surface has no file markers, so editing a stylesheet selects nothing. The same vocabulary holds bare words such as `padding`, which send a binary-buffer request to the frontend surface.

### Purpose
A plainly worded frontend request routes to `sk-code-frontend`, and a request that only shares a visual word with it does not.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Captured on 2026-11-14 from the repository root, at the commit this branch started from.

```text
$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "fix the responsive grid layout on the pricing page"
{"hubId":"sk-code","action":"defer","selectionKind":null,"targets":[],"effectivePolicyHash":"5bdf768e5ef6e2799ea8ad6b5312b52218e90e338873bdfa467433ae699261e4","generation":2}
exit=0

$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "add left padding to the binary buffer before hashing"
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"evidence-base","packetId":"sk-code-frontend","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-frontend"}],"effectivePolicyHash":"5bdf768e5ef6e2799ea8ad6b5312b52218e90e338873bdfa467433ae699261e4","generation":2}
exit=0

$ node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review my react component for accessibility issues"
{"hubId":"sk-code","action":"route","selectionKind":"single","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"}],"effectivePolicyHash":"5bdf768e5ef6e2799ea8ad6b5312b52218e90e338873bdfa467433ae699261e4","generation":2}
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `surfaceDetection` block to the `sk-code-frontend` entry in `mode-registry.json`, with role `specific` and file markers for stylesheet, markup and component files. Without it, a session editing a `.css` file detects no frontend surface today.
- Add the phrases the 13 `frontend` probes use to the frontend vocabulary, covering layout, responsive behaviour, overlays, form styling, themes, images, loading and direction.
- Replace each bare single-word keyword with a phrase of two or more words, so `padding`, `hover`, `animation` and `easing` no longer match alone.
- Make a review request that names accessibility, a stylesheet or a UI component return `sk-code-review` followed by `sk-code-frontend`.
- Add the 22 probes as hub playbook scenarios, because no check holds this reach today and the next vocabulary edit could undo it.

### Out of Scope
- Editing reference content - phase 003 owns the packet's references
- Removing the duplicate keyword lists - phase 004 owns that, so this phase edits every copy by hand one last time
- Changing CI or SKILLED vocabulary - no finding names it

### Files to Change

| File Path | Change Type | Description |
|---|---|---|
| `.skilled/skills/sk-code/mode-registry.json` | Modify | Add the `surfaceDetection` block and bring the aliases in line |
| `.skilled/skills/sk-code/hub-router.json` | Modify | Rework `code-frontend-aliases` and `code-frontend-visual` |
| `.skilled/skills/sk-code/ROUTER.md` | Modify | Mirror the vocabulary in `INTENT_SIGNALS` and correct the section 11 sentence that says stack detection does not select the surface |
| `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md` | Modify | Mirror the vocabulary in the packet router |
| `.skilled/skills/sk-code/SKILL.md` | Modify | Correct the sentence that says the surface is bundled from request vocabulary alone |
| `.skilled/skills/sk-code/shared/references/stack-detection.md` | Modify | Document the frontend file markers in the detection order |
| `.skilled/skills/sk-code/manual-testing-playbook/routing-disambiguation/` | Create | One scenario file per probe group: frontend reach, review bundle and negative probes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|---|---|
| REQ-001 | Every line tagged `frontend` in `specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification/scratch/probes.txt` returns a decision whose `targets` include `sk-code-frontend`: 13 of 13. |
| REQ-002 | No line tagged `negative` in the same file returns a decision whose `targets` include `sk-code-frontend`: 0 of 8. |
| REQ-003 | The line tagged `review` returns `sk-code-review` first and `sk-code-frontend` second. |
| REQ-004 | `node .skilled/bin/compiled-route-guard.cjs --json` and `node .skilled/bin/compiled-route-sync.cjs --check` both exit 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|---|---|
| REQ-005 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "update the stylesheet" --surface-hint FRONTEND` returns `sk-code-frontend` as a target. |
| REQ-006 | No keyword in `code-frontend-aliases` or `code-frontend-visual` is a single word: the count script in `plan.md` section 5 prints 0. |
| REQ-007 | Every prompt that routed to a non-frontend packet in `scratch/router-baseline.txt` still routes to the same first target. |
| REQ-008 | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-code/manual-testing-playbook` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 13 of 13 `frontend` probes name `sk-code-frontend`, up from 1 of 13 in the baseline.
- **SC-002**: 0 of 8 `negative` probes name `sk-code-frontend`, down from 2 of 8 in the baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Dependency | The registry compiler behind `compiled-route-sync.cjs` | It may reject a second `specific` surface block | Read its contract in setup task T002 and stop with the error if it refuses |
| Risk | Wider vocabulary sends non-frontend requests to the surface | High | The 8 negative probes are a P0 gate, and every new keyword has two or more words |
| Risk | A `.tsx` marker claims TypeScript files that are not UI code | Med | The SKILLED fallback still follows as second evidence, and the open question below records the default |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase runs no service. Its limits are the counts and exit statuses in section 4.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no frontend phrase and no file hint still returns `defer`.
- Maximum input: a prompt that matches frontend, CI and SKILLED keywords returns the `routerPolicy.tieBreak` order with `sk-code-frontend` ahead of `sk-code-ci`.
- Failure path: a registry the compiler rejects makes `compiled-route-sync.cjs --check` exit non-zero, and the phase stops there.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|---|---|---|
| Scope | 14/25 | Seven files across the hub and one packet |
| Risk | 12/25 | A shared routing contract every sk-code request passes through |
| Research | 6/20 | The compiler's rules for a second specific surface |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `.tsx` and `.jsx` count as frontend file markers when the SKILLED fallback also lists `.tsx`? Default: yes. The registry contract says a specific surface leads and the fallback follows as second evidence.
<!-- /ANCHOR:questions -->

---


