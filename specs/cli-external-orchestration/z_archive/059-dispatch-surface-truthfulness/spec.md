---
title: "Feature Specification: Dispatch Surface Truthfulness"
description: "A dispatch surface that names a quota-dead default model and under-reports its executor roster fails silently: zero output, zero CPU, indefinitely. Both defects cost a four-iteration review that never ran."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Remove the exhausted default model and correct the deep-loop executor roster so a dispatch surface cannot silently lie

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `scaffold/059-dispatch-surface-truthfulness` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A four-iteration review was dispatched and sat at 0.0% CPU for 7 hours 40 minutes, producing 39 bytes of output and no artifacts. Two independent documentation defects combined to make that outcome both likely and invisible.

The cli-opencode skill named `opencode-go/deepseek-v4-flash` as its default model in three places. That model's monthly quota is exhausted, and an exhausted model does not error — the client retries indefinitely and prints nothing. The same skill separately warns that this exact condition is "indistinguishable from a deadlock", so the skill simultaneously documented the hazard and pointed at the thing that triggers it.

The deep-loop review contract declared three executors where the runtime accepts seven. The one the operator asked for, `cli-cursor`, appeared nowhere in the document despite having its own runtime configuration block.

### Purpose

Make a dispatch surface unable to lie in the two ways that cost the run: no default that can silently die, and a roster that matches the runtime it describes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the hardcoded default model from the cli-opencode dispatch surface
- Replace it with a pre-flight verification step cheap enough to run before every long dispatch
- Correct the deep-loop executor roster to match the runtime, in both the authored source and the compiled contract

### Out of Scope
- Historical benchmark reports naming the old default — they record what ran at the time
- Restoring quota on the exhausted model; it resets on its own
- The deep-review loop's own behaviour, which was never reached

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Remove the default; add the pre-flight check |
| `.opencode/commands/deep/assets/deep-review-presentation.txt` | Modify | Executor roster matching the runtime |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Modify | Regenerated from the corrected source |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No hardcoded default model survives on the dispatch surface | The skill states there is deliberately no default and says why |
| REQ-002 | A cheap pre-flight distinguishes a dead model from a slow one | A documented one-command check surfaces the quota message that silent mode hides |
| REQ-003 | The executor roster matches the runtime exactly | Authored source and compiled contract both list every accepted executor |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The compiled contract is regenerated, not hand-edited | Produced by the compiler with its write flag |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: [Primary measurable outcome]
- **SC-002**: [Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the default adds friction to every dispatch | Low | The friction is a model choice plus a sub-minute check; the alternative cost 7h40m once already |
| Risk | The corrected roster goes stale again as the runtime gains executors | Med | The doc now mirrors an exported constant, so a diff against it is a mechanical check |
| Dependency | Contract compiler | Low | Regeneration is a single documented command |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should a check assert the roster against the exported runtime constant automatically? This packet aligns them by hand, which is the same maintenance burden that let them drift.
- The sibling deep commands were not audited for the same stale roster.
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
