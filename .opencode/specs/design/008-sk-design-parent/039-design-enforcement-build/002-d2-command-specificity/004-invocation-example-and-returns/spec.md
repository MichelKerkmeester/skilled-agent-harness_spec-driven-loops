---
title: "Feature Specification: D2-R4 — concrete invocation example + Returns: line per /design:* command"
description: "The /design:* wrappers document a routing surface but no worked invocation and no Returns: line, so a caller cannot see a real call or the artifact it produces; this adds a gated example to each command."
trigger_phrases:
  - "d2-r4 invocation example"
  - "invocation example design build"
  - "design command example returns spec"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/004-invocation-example-and-returns"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgrade spec to Level 2; record returns reconciliation and example-placeholder note"
    next_safe_action: "Proceed to the next D2 command-specificity phase on the frozen example surface"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r4-invocation-example-and-returns"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D2-R4 — concrete invocation example + Returns: line per /design:* command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-29 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five `/design:*` wrappers carry a routing/identity surface (description, per-mode argument grammar, aliases, tool policy, deliverable contract) but document no example invocation and no `Returns:` line. A caller can read the contract and still not see one concrete call or the artifact it hands back; the wrappers ended at D2-R5's `## 3. EMIT DELIVERABLE` block.

### Purpose
Give each command a concrete worked example and an explicit statement of what it returns, projected from the `command-metadata.json` SSOT and drift-gated by `design-command-surface-check.mjs`, so the example cannot silently fall out of step with the metadata.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `examples[]{invocation,returnsArtifact}` added to all five records in `command-metadata.json` (element `[0]` rendered)
- A `## EXAMPLE` body section per wrapper: one fenced invocation + a `Returns:` line
- An additive example lane in `design-command-surface-check.mjs` (Stage 1 shape/prefix + Stage 2 body drift)

### Out of Scope
- Rewriting `description`, `argument-hint`, `aliases`, or `allowed-tools` — owned by D2-R1/R2/R3
- The `## EMIT DELIVERABLE` section and `outputContract` — owned by D2-R5; preserved untouched
- Mutating `mode-registry.json` — it stays routing/identity-only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `examples[]` to five records; preserve `outputContract` + prior fields |
| `.opencode/commands/design/{audit,foundations,interface,md-generator,motion}.md` | Modify | Append a `## EXAMPLE` section (fenced invocation + `Returns:` line) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add the example lane (Stage 1 + Stage 2), additively |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SSOT example field | Every record carries a non-empty `examples[]`; `examples[0]` has non-empty `invocation` + `returnsArtifact` |
| REQ-002 | Prefix-locked invocation | `examples[0].invocation` first token equals the record `command` (`/design:<name>`); Stage 1 enforces it |
| REQ-003 | Rendered example per wrapper | Each wrapper carries a `## EXAMPLE` section with a fenced invocation == `examples[0].invocation` and a `Returns:` line == `examples[0].returnsArtifact` |
| REQ-004 | No-regression gate | `node design-command-surface-check.mjs` exits 0 with `invalid=0 drift=0`; the three frontmatter checks stay green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Gate bites on mismatch | Removing/mangling an example or `Returns:` line makes the checker exit non-zero with the expected drift field |
| REQ-006 | Preserve upstream surface | D2-R5 `## EMIT DELIVERABLE` + `outputContract` and D2-R1/R2 `allowed-tools` frontmatter unchanged |
| REQ-007 | Evergreen artifacts | No artifact embeds a spec/packet/phase ID or spec path; paths resolved from `import.meta.url` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each `/design:*` command renders one concrete fenced invocation and a `Returns:` line, both projected from the metadata SSOT
- **SC-002**: The checker exits 0 (`invalid=0 drift=0`) on the aligned surface and exits non-zero when any example/Returns line drifts from the SSOT
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | D2-R3 (`command-metadata.json` SSOT) | Landed | This phase extends the SSOT with one field; the record shape stays frozen for downstream phases |
| Dependency | D2-R5 (`## EMIT DELIVERABLE` + `outputContract`) | Landed first in the wrappers | The EXAMPLE section is appended after it, so it rendered as `## 4. EXAMPLE`, not `## 3.` |
| Risk | `returnsArtifact` ↔ `returns` divergence | Low | `returnsArtifact` reuses the `returns` sentence verbatim; only the wrapper `Returns:` line == `returnsArtifact` is gated, the `returns` consistency is editorial |
| Risk | Section-number drift | Low | The heading match is tolerant of the numeric prefix, so the example lane survives upstream sections shifting the number |
| Risk | Placeholder operands mistaken for real paths | Low | Operands are illustrative; the gate enforces only the `/design:<name>` prefix and the `Returns:` line, not operand validity |

### Reconciliation note (returnsArtifact ↔ returns)

`returnsArtifact` is the concrete restatement of each record's abstract `returns` contract sentence, and the implementer set it byte-identical to `returns`. The deterministic gate enforces the wrapper `Returns:` line == `examples[0].returnsArtifact`; the `returnsArtifact` == `returns` equality is a build-time editorial check, not a byte gate, so the two could diverge in future without failing the checker.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The example lane adds only per-wrapper body reads; the full five-wrapper sweep still completes in well under one second on a warm Node runtime

### Security
- **NFR-S01**: The body-read lane uses `readFile` only; the checker never writes any wrapper, the metadata, or the registry

### Reliability
- **NFR-R01**: Two consecutive runs produce byte-identical, sorted output; the new drift fields join the deterministic sort order
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing `## EXAMPLE` section: reported as `field=example` drift, not a crash
- Missing `Returns:` line: reported as `field=returns` drift with actual `<missing>`
- `## 4. EXAMPLE` (numbered after EMIT DELIVERABLE): matched by the tolerant `^##\s+(?:\d+\.\s+)?Example\b` heading regex

### Error Scenarios
- `examples` absent or not a non-empty array: Stage 1 exits 2 (INVALID)
- `examples[0].invocation` prefix != `command`: Stage 1 exits 2 (INVALID)
- Fenced invocation prefix != `/design:<name>` from the filename: Stage 2 drift `field=example-prefix`

### State Transitions
- A wrapper with the example but a mangled `Returns:` line: checker reports only `field=returns`, leaving the other fields green
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | One SSOT field, five wrapper sections, one additive checker lane |
| Risk | 5/25 | Read-only checker; additive to a passing gate; reversible by deletion |
| Research | 5/20 | Field shape + parsing contract sourced from research §5 (D2-R4) and the D2-R3 SSOT |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- The example operands (`src/components/Checkout.tsx`, `https://stripe.com`, `dashboard-shell`, `modal-open-close`, `marketing-site`) are placeholders, not real repo paths or reachable URLs. They are illustrative only; the gate enforces the `/design:<name>` prefix and the `Returns:` line, never operand validity. If a future phase wants runnable examples, it must add operand-resolution separately.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification addendum (NFR, edge cases, complexity)
- examples[] SSOT field + ## EXAMPLE wrapper sections + additive checker lane; upstream D2-R5/R1/R2 surface preserved
- Gate holds drift=0; returnsArtifact == returns editorial; example operands are placeholders
-->
