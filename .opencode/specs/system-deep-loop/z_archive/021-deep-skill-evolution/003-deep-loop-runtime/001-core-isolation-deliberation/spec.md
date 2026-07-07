---
title: "Feature Specification: 117 — Deep-Loop Core Script Isolation Deliberation"
description: "AI Council deliberation packet evaluating whether to relocate deep-loop / coverage-graph runtime files from system-spec-kit/mcp_server/ into the owning deep-* skill folders. Planning-only; file moves deferred to a follow-on implementation packet."
trigger_phrases:
  - "deep-loop core isolation"
  - "coverage-graph relocation"
  - "deep-* skill ownership"
  - "ai council deep-loop"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation"
    last_updated_at: "2026-05-22T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded deliberation packet; council dispatch pending."
    next_safe_action: "Dispatch 4 council seats."
    blockers: []
    key_files:
      - "ai-council/ai-council-strategy.md"
      - "ai-council/council-report.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1171171171171171171171171171171171171171171171171171171171170000"
      session_id: "117-deep-loop-isolation-council"
      parent_session_id: null
    completion_pct: 10
    open_questions:
      - "Should lib/deep-loop/*.ts files relocate inside deep-review/deep-research skill folders?"
      - "Should handlers/coverage-graph/*.ts move with the MCP tool IDs staying stable?"
    answered_questions:
      - "Current placement is accumulated drift; no ADR justified it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 117 — Deep-Loop Core Script Isolation Deliberation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The deep-review and deep-research skills depend on **18 production files** that live inside `.opencode/skills/system-spec-kit/mcp_server/lib/{deep-loop,coverage-graph}/` and `mcp_server/handlers/coverage-graph/`. A dependency survey shows those files are **100% consumed by deep-* skills only** — zero callers in other MCP handler families, zero non-deep callers anywhere in spec-kit. No ADR justifies the current placement; it appears to be accumulated drift from early MCP server scaffolding.

**Key Decisions**: defer to AI Council ruling. The council deliberates between ISOLATE (full relocation into deep-* skill folders), KEEP (status quo), and SPLIT (relocate libs, keep MCP handlers).

**Critical Dependencies**: sk-ai-council skill, cli-codex gpt-5.5 xhigh, the dependency map captured here in the spec body.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Active (council dispatch pending) |
| **Created** | 2026-05-22 |
| **Branch** | main |
| **Successor** | follow-on implementation packet (only if ruling is ISOLATE or SPLIT) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-review and deep-research skills are consumers; system-spec-kit/mcp_server is the producer. Yet the producer holds 18 files that exist exclusively for the consumers — an inverted dependency. New maintainers reading the deep-* skills must traverse into a different skill's runtime to understand core deep-loop behavior. The current arrangement is unjustified by any decision record and may slow contributions to the deep-* skills.

### Purpose
Run a formal AI Council deliberation that argues all three positions (ISOLATE | KEEP | SPLIT) from the same factual base, applies the 2-of-3 convergence rule, and produces an ADR. The actual file relocation, if any, is deferred to a follow-on implementation packet so this packet is planning-only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Compose 4 seat prompts (Isolation Architect, Status-Quo Defender, Pragmatist, Adjudicator)
- Dispatch all 4 seats via cli-codex gpt-5.5 (xhigh for A/B/D, high for C reasoning-diversity)
- Persist seat outputs to `ai-council/seats/round-001/`
- Synthesize round into `ai-council/deliberations/round-001.md`
- Author final `ai-council/council-report.md`
- Capture ruling in `decision-record.md` ADR-001
- Validate Level 3 strict

### Out of Scope
- Moving any file
- Changing any MCP tool IDs
- Updating CLAUDE.md or other routing docs
- Resource-map authoring for 116 arc (waits on ruling)
- Changelog v1.3.3.0 reconciliation (waits on ruling)

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `116-deep-skill-evolution/003-deep-loop-runtime/001-core-isolation-deliberation/*.md` | Create | Spec, plan, tasks, checklist, decision-record, implementation-summary |
| `117-…/ai-council/**` | Create | Council artifacts per sk-ai-council folder layout |
| `117-…/description.json` + `graph-metadata.json` | Create | Indexing metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Dispatch 4 seats via cli-codex gpt-5.5 | All seats use ONE CLI (sk-ai-council §0 one-CLI-per-round invariant) |
| REQ-002 | Each seat produces a verdict line | `Recommendation: ISOLATE | KEEP | SPLIT` as final line |
| REQ-003 | Seat D adjudicates with A/B/C as input | Seat D NEVER runs before A/B/C complete |
| REQ-004 | Council ruling captured in decision-record.md | ADR-001 with 5-checks evaluation |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Dependency map embedded in every seat prompt | All seats argue from same factual base |
| REQ-006 | Risk register includes MCP tool ID stability | Seat D's risk register names tool-ID preservation if moves recommended |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 4 seat outputs land under `ai-council/seats/round-001/`, each with valid frontmatter + final verdict line
- **SC-002**: `ai-council/council-report.md` synthesizes the round per sk-ai-council output schema (Council Composition + Per-seat + Recommended Plan + Plan Confidence)
- **SC-003**: `decision-record.md` ADR-001 records ruling + alternatives + 5/5 PASS checks + migration outline (if applicable)
- **SC-004**: `validate.sh --strict` PASS Level 3, 0 errors, 0 warnings
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Seats parrot each other | Low convergence quality | Sequential dispatch; Seat D gets A/B/C as quoted blocks, not paraphrase |
| Risk | cli-codex xhigh dispatch latency | 50-60 min total wall-clock | Background dispatches; expect ~1h |
| Risk | MCP tool ID stability if ruling = move | Breaks consumers | Seat D risk register names tool-ID preservation requirement |
| Dependency | sk-ai-council skill | Required for council pattern | Already shipped (v1.0.0) |
| Dependency | cli-codex CLI + OpenAI auth | Required for seat dispatch | Verified in this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each seat dispatch ≤15 min wall-clock (cli-codex gpt-5.5 xhigh budget per cli-codex SKILL.md)

### Security
- **NFR-S01**: No secrets in seat prompts; sandbox workspace-write

### Reliability
- **NFR-R01**: Each seat output must include all required frontmatter fields + verdict line

---

## 8. EDGE CASES

### Convergence outcomes
- 3-of-3 unanimous (A/B/C all agree): Seat D records consensus; ADR adopts directly
- 2-of-3 split: Seat D applies majority + records dissent
- 3-way split: Seat D selects from its independent reasoning; ADR records "no convergence" + Seat D ruling

### Failure modes
- Seat dispatch timeout (>15 min): mark seat output as `failed:true`; document in deliberations
- All 3 seats parrot each other: Seat D flags low diversity; ADR rules "deliberation inconclusive, re-dispatch with diversified framing"

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Single architectural decision, well-bounded |
| Risk | 18/25 | Wrong decision could trigger MCP tool ID instability across consumers |
| Research | 15/20 | 4 seat dispatches, ~60 min compute |
| Multi-Agent | 12/15 | sk-ai-council multi-seat pattern |
| Coordination | 10/15 | Seat ordering matters (D after A/B/C) |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Council recommends move but breaks tool IDs | H | M | Risk-register requirement on Seat D |
| R-002 | Convergence is inconclusive | M | L | Ruling can still proceed via Seat D adjudication |
| R-003 | xhigh dispatches hit cli-codex rate limits | M | L | Sequential dispatch; pause if 429 |

---

## 11. USER STORIES

### US-001: Architectural Decision With Evidence (Priority: P0)

**As a** maintainer of the skilled-agent-orchestration track, **I want** a documented AI Council ruling on whether to relocate deep-loop runtime files, **so that** any subsequent file moves cite a recorded decision rather than ambient preference.

**Acceptance Criteria**:
1. Given the dependency map showing 18 files consumed only by deep-* skills, When the council deliberates and converges, Then `decision-record.md` ADR-001 captures the ruling with five-checks evaluation and (if applicable) a migration outline.

---

## 12. OPEN QUESTIONS

- Should lib/deep-loop/*.ts files relocate inside deep-review/deep-research skill folders?
- Should handlers/coverage-graph/*.ts move with the MCP tool IDs staying stable?
- If the ruling is SPLIT, which files cross the boundary?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Council Strategy**: See `ai-council/ai-council-strategy.md`
- **Council Report**: See `ai-council/council-report.md` (post-deliberation)
