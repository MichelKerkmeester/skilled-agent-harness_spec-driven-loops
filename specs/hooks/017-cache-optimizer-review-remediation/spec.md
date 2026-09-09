---
title: "Feature Specification: cache optimizer review remediation"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cache optimizer review remediation

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-09 |
| **Branch** | `scaffold/hooks/017-cache-optimizer-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An independent review of the cache extension found three defects that the shipping packet's own
tests could not see.

**Two cache optimizers were loaded at once.** `.pi/settings.json` enabled both the vendored fork
and the upstream npm package. Pi's dedupe keys on package identity, and `npm:pi-cache-optimizer`
never collides with `local:<path>`, so both registered hooks: the prompt was rewritten twice, and
both wrote the same statistics file, where the upstream parser does not know the economics fields
and would drop them on the next write. The requirement that exactly one extension act on every
model was false in the live configuration.

**A stale edit could still land.** The line hash covers trimmed content only, and validation
checked the two endpoint lines. An identical line shifted into the target index hashes the same, so
the edit was applied to the wrong line. Duplicate lines — a lone brace, a blank, a comment
terminator — make that ordinary in real code, and the likeliest thing to shift them is the model's
own previous edit in the same turn.

**The retry guard did not measure what its message claimed.** The blocked-turn streak rose on every
failed batch while the repeat count reset whenever the error changed, so taking the maximum of the
two meant the streak always won and the error-signature comparison never affected the outcome. Four
unrelated failures aborted the turn under a message asserting the same request had been re-billed.

### Purpose

Each of the three behaves as its own documentation already claims.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.pi/settings.json` — the duplicate package entry.
- `.pi/extensions/pi-cache-optimizer/index.ts` — edit validation and retry-guard escalation.
- The extension's tests, extended with controls that fail without each fix.
- The overstated economics claim in the packet that shipped this work.

### Out of Scope

- **Pricing data.** No model entry carries a cost block, so the priced path stays unexercised
  live. Supplying pricing is a separate decision, not a defect.
- **The suspected tool-call-id assumption** in batch completion. It needs a provider that emits
  duplicate or empty ids to confirm, and none is vendored here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/settings.json` | Modify | Drop the duplicate upstream package |
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Line-count binding, whole-range hashes, split escalation |
| `.pi/extensions/pi-cache-optimizer/tests/*.test.ts` | Modify | Controls for all three |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Exactly one cache extension loads |
| REQ-002 | An edit whose target moved is refused |
| REQ-003 | Escalation distinguishes a repeated request from unrelated failures, and each message is true |
| REQ-004 | Every fix has a test that fails without it |
| REQ-005 | The overstated economics claim is corrected |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One `cache-optimizer` entry in the enabled package list.
- **SC-002**: With the fixes disabled, the new tests fail; with them enabled, the suite is green.
- **SC-003**: `npm run check` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---


