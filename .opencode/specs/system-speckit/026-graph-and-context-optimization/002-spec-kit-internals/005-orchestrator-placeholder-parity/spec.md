---
title: "Feature Specification: Orchestrator vs shell placeholder-detection parity [template:level_2/spec.md]"
description: "The canonical Node validator and the legacy shell rule disagree on spec-doc placeholder detection: the orchestrator misses the space-variant marker and does not exclude fenced/backtick-escaped content, while the shell rule flags mustache that the orchestrator does not. This packet aligns both to a single principled rule set."
trigger_phrases:
  - "orchestrator placeholder parity"
  - "validatePlaceholders divergence"
  - "NEEDS CLARIFICATION space variant"
  - "check-placeholders mustache removal"
  - "placeholder fenced code exclusion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/002-spec-kit-internals/005-orchestrator-placeholder-parity"
    last_updated_at: "2026-05-29T12:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Aligned placeholder detection; rebuilt dist"
    next_safe_action: "Run validate.sh --strict on this packet to confirm PASSED"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "packet-system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/005-orchestrator-placeholder-parity"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Orchestrator vs Shell Placeholder-Detection Parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The canonical Node validator (`mcp_server/lib/validation/orchestrator.ts` `validatePlaceholders`) and the legacy shell rule (`scripts/rules/check-placeholders.sh`) disagree on spec-doc placeholder detection. The orchestrator flags only `<YOUR_VALUE_HERE:`, `[YOUR_VALUE_HERE:`, and the underscore `[NEEDS_CLARIFICATION:`, and it does not exclude fenced code blocks or inline-backtick-escaped markers. The shell rule additionally matches the space variant `[NEEDS CLARIFICATION:` and `{{mustache}}`, and it DOES exclude fences and backticks. Since `validate.sh` runs the orchestrator as the active path (shell rule only runs in the no-orchestrator fallback), the two paths produce different results for the same documents.

### Purpose
Both validators apply one principled placeholder rule: catch `YOUR_VALUE_HERE` plus `NEEDS_CLARIFICATION` (underscore AND space), exclude fenced code blocks and inline-backtick-escaped markers, and never flag mustache `{{...}}` in canonical spec docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the space variant `[NEEDS CLARIFICATION:` to the orchestrator's placeholder detection.
- Add fenced-code-block and inline-backtick exclusions to the orchestrator, matching the shell rule's awk/grep behavior.
- Remove the `{{mustache}}` pattern from the shell rule and broaden its NEEDS_CLARIFICATION match to cover both underscore and space variants, for strict superset-parity with the orchestrator.
- Rebuild the spec-kit mcp_server dist so the compiled orchestrator reflects the source change.

### Out of Scope
- Adding mustache `{{...}}` detection to the orchestrator - mustache is not the canonical spec-doc placeholder syntax and legit spec-doc content uses it, so flagging it would false-positive.
- Changing the set of files scanned (`docsForLevel`) - scope of scanned docs is unchanged.
- Changes to any other validation rule or to `validate.sh` routing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts` | Modify | Add space variant + fence/backtick exclusions to `validatePlaceholders` |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/validation/orchestrator.js` | Modify (build) | Rebuilt from .ts via `npm run build` |
| `.opencode/skills/system-spec-kit/scripts/rules/check-placeholders.sh` | Modify | Remove mustache pattern; broaden NEEDS_CLARIFICATION to underscore + space |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Orchestrator detects the space variant `[NEEDS CLARIFICATION:` in addition to existing markers | `dist/lib/validation/orchestrator.js` regex contains `\[NEEDS CLARIFICATION:` |
| REQ-002 | Orchestrator excludes fenced code blocks and inline-backtick-escaped markers | A marker inside ``` fences or immediately preceded by a backtick is not flagged |
| REQ-003 | Shell rule and orchestrator agree: both catch YOUR_VALUE_HERE + NEEDS_CLARIFICATION (underscore/space), neither flags mustache in spec docs | Shell rule has no `{{...}}` block; orchestrator regex has no mustache alternative |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Zero new false positives on the canonical spec docs | `validate.sh --strict` on this packet returns PASSED |
| REQ-005 | dist is regenerated from .ts (no hand-edited compiled JS) | `npm run build` run successfully; dist diff matches .ts change |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The orchestrator and the shell rule both flag YOUR_VALUE_HERE and NEEDS_CLARIFICATION (underscore + space), and both exclude fenced/backtick-escaped content; neither flags mustache in canonical spec docs.
- **SC-002**: `validate.sh --strict` on the packet returns PASSED, exercising the rebuilt orchestrator with zero new false positives.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | TypeScript build (`npm run build`) | Stale dist if build skipped | Build run and dist confirmed to contain the new pattern |
| Risk | Over-broad backtick exclusion masks real placeholders | Med | Exclusion only fires when the marker is immediately preceded by a backtick on the same line, matching the shell rule's narrow grep -v |
| Risk | Mustache false positives if added to orchestrator | High (avoided) | Mustache intentionally excluded from both validators for spec docs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Placeholder scan stays O(lines) per doc; no measurable change vs prior implementation.
- **NFR-P02**: No additional file reads beyond the docs already enumerated by `docsForLevel`.

### Security
- **NFR-S01**: No new external input or execution surface; pure in-process string scanning.
- **NFR-S02**: No secrets or PII handled by this rule.

### Reliability
- **NFR-R01**: Detection is deterministic across the orchestrator and shell-fallback paths (parity is the goal).
- **NFR-R02**: Zero new false positives on existing canonical spec docs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a doc with no content yields no findings (loop simply does not run).
- Maximum length: long lines are scanned in full; the reported snippet is truncated to 120 chars (unchanged behavior).
- Invalid format: malformed/unclosed fences toggle `inCode` exactly like the shell awk, so behavior matches the legacy fallback.

### Error Scenarios
- Marker inside a fenced code block: skipped (not flagged) on both paths.
- Marker wrapped in inline backticks: skipped when immediately preceded by a backtick.
- Mustache `{{...}}` in spec-doc prose: never flagged on either path.

### State Transitions
- Partial completion: not applicable; rule is stateless per invocation.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 2 source files + 1 rebuilt dist artifact, ~20 LOC net |
| Risk | 10/25 | Touches a validator used by every completion claim; mitigated by narrow exclusions and strict-validate |
| Research | 4/20 | Behavior fully specified by the existing shell rule; no investigation needed |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None - the target behavior is fully specified by the existing `check-placeholders.sh` rule and the scoping facts in the task brief.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
