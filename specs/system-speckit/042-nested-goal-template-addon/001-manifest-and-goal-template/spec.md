---
title: "Feature Specification: Manifest Entry and Goal Template"
description: "Put a goal document into the documentation-level contract as a lazy add-on and author its gated template, so the durable directive, its binding block and its optional log all have one authored shape."
trigger_phrases:
  - "goal manifest entry"
  - "goal template"
  - "lazy add-on goal"
  - "goal.md.tmpl"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/001-manifest-and-goal-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Add the contract entry and author the template"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/templates/spec-kit-docs.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-001-manifest-and-goal-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The document is a lazy add-on, not an optional one; the document collector walks lazy and skips optional"
---

# Feature Specification: Manifest Entry and Goal Template

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/042-nested-goal-template-addon |
| **Predecessor** | None |
| **Successor** | 002-durable-slice-validator |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
There is no goal document anywhere in the documentation-level contract. Nothing scaffolds one, nothing renders one per level, and nothing knows its shape, so a packet that wants a durable directive has to invent the file and its conventions each time. Packet 033 did exactly that and the result grew to 15,028 bytes with no separation between the directive an operator set and the progress log that accumulated underneath it.

### Purpose
A packet can scaffold a goal document whose durable directive, binding block and optional log each have one authored shape.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The contract entry: document, version, section gates, and the lazy add-on listing for Levels 1, 2, 3, 3+ and phase.
- The gated template with its durable directive, binding block and clearly marked volatile log.
- The document-to-template mapping, without which template drift for this file could never be detected.

### Out of Scope
- The validator - it is phase 2, and it needs this shape to exist first.
- Any speckit command change - that is phase 3.
- `requiredCoreDocs` and `requiredAddonDocs` - a required entry hard-errors on every existing packet, and this document is opt-in by nature.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/spec-kit-docs.json` | Modify | Document entry, version, section gates, lazy listing at five levels |
| `templates/addons/goal.md.tmpl` | Create | The gated document with its durable and log split |
| `scripts/utils/template-structure.js` | Modify | Document-to-template mapping |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The document is listed as a lazy add-on at Levels 1, 2, 3, 3+ and phase, and at no other level |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The document resolves to its template, so drift against the template is detectable |
| REQ-004 | The rendered document separates a durable directive from a volatile log, and marks which is which |
| REQ-005 | The phase-parent rendering carries a binding block; a standalone Level 1 rendering does not |
| REQ-002 | The template renders at those five levels and produces nothing at any level outside them |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `resolveTemplatePath` returns a path for the five gated levels and null for `review`.
- **SC-002**: A scaffolded packet at any gated level contains a goal document whose durable slice is separable from its log by heading alone.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The inline gate renderer and the level contract resolver | No way to render or resolve the document | None needed; both ship today |
| Risk | A lazy add-on is collected by the structure validator, so a malformed goal document could fail packets that never asked for one | Med | The document is only collected when present; absence stays silent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One extra template render per scaffold, which is negligible against the existing document set.
- **NFR-P02**: Not applicable; scaffolding is a one-shot operator action.

### Security
- **NFR-S01**: The template carries no credentials and the document is authored content only.
- **NFR-S02**: Not applicable; nothing here stores data.

### Reliability
- **NFR-R01**: A packet with no goal document validates exactly as it does today.
- **NFR-R02**: An unresolvable template yields a null path rather than a thrown error, so a packet without the document is unaffected.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a goal document with a durable heading and no body renders and validates; emptiness is phase 2's concern.
- Maximum length: unbounded here. The durable slice budget belongs to phase 2.
- Invalid format: a goal document missing its durable heading still renders; the heading contract is enforced in phase 2, not here.

### Error Scenarios
- A missing template file makes the document unresolvable, which surfaces as a null template path rather than a crash.
- Not applicable; nothing here touches the network.
- Concurrent access: not applicable; the contract file is edited once, not written at runtime.

### State Transitions
- Partial completion: a contract entry without its template leaves the document unresolvable, which the mapping check surfaces immediately.
- Not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 3 files: contract, template, mapping |
| Risk | 9/25 | No auth, no API; a contract edit reaches every packet, so the lazy bucket is load-bearing |
| Research | 4/20 | Settled by the packet research; the buckets were read, not guessed |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The lazy-versus-optional placement was settled by reading the document collector.
<!-- /ANCHOR:questions -->

---


