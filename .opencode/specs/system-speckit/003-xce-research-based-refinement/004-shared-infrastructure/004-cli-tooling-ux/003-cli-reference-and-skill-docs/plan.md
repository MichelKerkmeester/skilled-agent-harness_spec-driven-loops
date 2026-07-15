---
title: "Implementation Plan: Unified Daemon CLI Reference and Skill Docs"
description: "Author one canonical Daemon CLI Reference page, link or inline recovery + exit-code taxonomy in each system SKILL.md, and document jsonl as a single-line JSON payload."
trigger_phrases:
  - "003-cli-reference-and-skill-docs plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/003-cli-reference-and-skill-docs"
    last_updated_at: "2026-06-11T01:21:47Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed the unified reference page and per-SKILL.md recovery/taxonomy links"
    next_safe_action: "Run strict validation before completion claims"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-003-cli-reference-and-skill-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Unified Daemon CLI Reference and Skill Docs

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (sk-doc templates) |
| **Framework** | Daemon CLI front-doors over mk-* MCP daemons |
| **Storage** | n/a |
| **Testing** | Doc review + link check; exit-code taxonomy matched to code |

### Overview
Write one canonical Daemon CLI Reference page covering invocations, formats, exit-code taxonomy, warm-only behavior, examples, and safety; add recovery commands + exit-code taxonomy to each system SKILL.md (or link the unified page); and document `jsonl` as a single-line JSON payload.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation consolidation: one canonical page, with per-skill SKILL.md content either inlined or linked. No code behavior changes.

### Key Components
- **Unified Daemon CLI Reference page**: six-topic canonical doc
- **Per-SKILL.md recovery/exit-code content**: inline or link
- **`jsonl` clarification note**: single-line JSON payload, matched to code

### Data Flow
Agent opens SKILL.md -> finds recovery + exit-code content or a link -> reads the unified reference for full invocations/formats/safety.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Documentation-only phase. Surfaces and verification live in the spec Files-to-Change table and the tasks below.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Unified reference page | none today | Create | Six topics present, exit taxonomy matches code |
| `system-code-graph/SKILL.md`, `system-skill-advisor/SKILL.md` | scattered docs | Add or link recovery/exit-code | Content or link present in each SKILL.md |
| `*-cli.ts:282-298` jsonl parsing | undocumented format | Document as single-line JSON | Note matches parser behavior |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory the scattered CLI docs (`README.md:100-110`, `AGENTS.md:133-143`, `ENV_REFERENCE.md:538-559`, system READMEs)
- [x] Confirm the code-level exit-code taxonomy and `jsonl` parsing behavior

### Phase 2: Core
- [x] Author the unified Daemon CLI Reference page (six topics)
- [x] Add recovery commands + exit-code taxonomy to code-index and skill-advisor SKILL.md, or link the unified page
- [x] Document `jsonl` as a single-line JSON payload in the reference and SKILL.md notes

### Phase 3: Verification
- [x] Reference page covers all six topics with a code-matched exit taxonomy
- [x] Each SKILL.md contains or links the recovery/exit-code content
- [x] `jsonl` single-line-payload note matches `*-cli.ts:282-298`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc review | Six-topic coverage + accuracy | Manual review |
| Link check | SKILL.md links resolve to the unified page | Link checker / manual |
| Cross-check | Exit taxonomy vs code | Compare against `*-cli.ts` + smoke (sub-phase 001) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Exit-code taxonomy + warm-only (`ENV_REFERENCE.md:538-559`, `SKILL.md:413`) | Internal | Available | Source the canonical taxonomy from these |
| Smoke check (sub-phase 001) | Internal | Planned | Reference can cite the smoke command once it exists |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The unified page diverges from code or introduces broken links.
- **Procedure**: Revert the doc edits; the scattered docs remain intact until the unified page is verified.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
