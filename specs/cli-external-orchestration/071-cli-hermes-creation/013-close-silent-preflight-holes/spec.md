---
title: "Feature Specification: Phase 1: close-silent-preflight-holes"
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
# Feature Specification: Phase 1: close-silent-preflight-holes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-09-15 |
| **Branch** | `scaffold/013-close-silent-preflight-holes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 16 |
| **Predecessor** | 012-runtime-surface-parity-research |
| **Successor** | 014-extend-dispatch-coverage |
| **Handoff Criteria** | [To be defined during planning] |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Dispatch preflight parity implementation specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The dispatch preflight is the only surface that can refuse an incorrect `cli-*` dispatch before it runs, and six conditions let it approve one silently. Codex dispatches matched no shape at all, so every Codex rule was unevaluated; Hermes fan-out lineages never received the opt-in that loads the repo plugin, leaving the read-only refusal and goal binding inert; the stdin rule was advisory in all seven skills despite a working check; the Hermes toolset rule did not require `file`, so a leaf could read nothing and exit 0 empty; the ignore-rules exemption for preloaded skills rested on a premise a live A/B disproved; and one zero-width joiner in `AGENTS.md` made Hermes refuse the whole file.

### Purpose
Every documented dispatch resolves to its runtime's rules, and each of the six silent-approval conditions becomes an observable refusal backed by a test that fails without its fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The Codex dispatch shape in both the registry list and the tokenizer.
- The Hermes project-plugin opt-in in the fan-out dispatch environment.
- Severity for the stdin rule across all seven skills, plus the two OpenCode silent-failure rules.
- The Hermes toolset predicate and the removal of the preload exemption.
- The zero-width joiner in the repository instruction file.
- Every document that taught the disproved dispatch shape.

### Out of Scope
- Cursor and OpenCode preflight adapters - phase 014 owns them.
- New predicates for provider, offline and budget conditions - phase 014.
- Builder parity and persona wiring - phase 015.
- The cross-registry CI guard - phase 016.
- Devin's retired command surface - removed by operator directive and not reopened here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Codex shape in the registry list and the tokenizer branch |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modify | Require the file toolset, drop the preload exemption |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | Flip the assertions that pinned the old behaviour, add the shape regression |
| `.opencode/skills/cli-external-orchestration/cli-*/SKILL.md` | Modify | Severity flips and corrected rule messages |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Set the Hermes project-plugin opt-in |
| `AGENTS.md` | Modify | Replace the joined emoji in the escalation heading |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every documented headless dispatch resolves to its own skill in both the shape list and the tokenizer |
| REQ-002 | A Hermes fan-out lineage receives the project-plugin opt-in alongside its packet and read-only markers |
| REQ-003 | A dispatch missing its stdin redirect is refused rather than advised, in all seven skills |
| REQ-004 | A Hermes toolset list without the file toolset is refused |
| REQ-005 | A preloading Hermes dispatch that omits the ignore-rules flag is refused |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The repository instruction file passes the Hermes context scanner |
| REQ-007 | No living document instructs the disproved dispatch shape |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the six fixes has a test that fails when that fix alone is reverted.
- **SC-002**: The end-to-end preflight refuses every violating shape and approves every correct one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Raising severity turns advisories into refusals | Medium: a previously tolerated command now blocks | The fan-out spawns processes directly and never passes through the Bash preflight, so only hand-written dispatches are affected, which is the intent |
| Risk | Shape text inside a quoted payload reads as a dispatch | Low: a false refusal on a command that merely mentions one | Observed once during this phase; recorded for the phase 014 predicate work rather than weakened here |
| Dependency | The Hermes context scanner | The instruction file stays unreadable while any joiner remains | Verified clean after the change by running the scanner directly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---


