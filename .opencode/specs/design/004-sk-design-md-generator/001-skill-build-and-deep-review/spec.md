---
title: "Feature Specification: Create sk-design-md-generator skill with an embedded extraction pipeline [template:level_3/spec.md]"
description: "The framework has no design-system extraction capability; the sk-design-* family needs an engine that captures a live site's real CSS into a DESIGN.md, complementing sk-design-interface's judgment. Embed the extraction tool into a conformant skill."
trigger_phrases:
  - "design system extraction"
  - "sk-design-md-generator"
  - "DESIGN.md generator"
  - "css token extraction"
  - "embed design-md-generator"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator"
    last_updated_at: "2026-06-21T09:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed generator spec"
    next_safe_action: "Verify packet 151 closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/design-md-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-generator"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Embed depth: full working tool (operator-elected)"
      - "Numbering: generator=151, rename=153"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Create sk-design-md-generator skill with an embedded extraction pipeline

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

Turn the external repo `the extraction tool` into a house skill, `sk-design-md-generator`, that extracts a live website's real CSS into a 17-section `DESIGN.md` an AI agent can build against without hallucinating values. The full working tool is embedded under `tool/`; a conformant skill layer wraps it and registers it in the advisor graph.

**Key Decisions**: full working-tool embed (not a lean knowledge-skill); trim generated artifacts to keep the skill lean.

**Critical Dependencies**: Node >= 18 + Playwright + Chromium at runtime; the advisor skill-graph for registration.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-21 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework can reason about distinctive design direction (`sk-design-interface`) and drive design transports (`mcp-open-design`, `mcp-figma`), but it has no way to capture an EXISTING site's real design system into a structured, agent-consumable reference. Agents asked to "build like Stripe" invent colours, fonts, and spacing because they have no ground-truth tokens.

### Purpose
Ship a conformant, advisor-registered `sk-design-md-generator` skill that embeds a working extraction pipeline and teaches an agent to turn a URL into a fidelity-checked `DESIGN.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Embed the working tool under `.opencode/skills/sk-design-md-generator/tool/` (scripts, resources, examples, configs).
- Author the skill layer: `SKILL.md`, `references/` (advisor-routable), `INSTALL_GUIDE.md`, `README.md`, `changelog/`, `graph-metadata.json`.
- Register in the advisor skill-graph with reciprocal sibling edges into the `sk-design-*` family.
- Verify: skill validation + DQI, tool smoke (install, vitest, one extraction), routing.

### Out of Scope
- Modifying tool source under `tool/scripts/` or `tool/resources/` - it stays a self-contained copy.
- Embedding the generated example HTML reports - regenerable, ~2 MB.
- Any change to `sk-design-interface` behaviour - this skill complements it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design-md-generator/tool/` | Create | Embedded working tool |
| `.opencode/skills/sk-design-md-generator/SKILL.md` | Create | Skill routing entry point |
| `.opencode/skills/sk-design-md-generator/references/` | Create | Advisor-routable reference docs |
| `.opencode/skills/sk-design-md-generator/graph-metadata.json` | Create | Advisor identity + edges |
| `.opencode/skills/{sk-design-interface,mcp-open-design,mcp-figma}/graph-metadata.json` | Modify | Reciprocal back-edges |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Tool embedded and runnable | `tool/` present with scripts/resources/examples; `npm install` + `vitest` green |
| REQ-002 | Conformant `SKILL.md` | 5 required sections present; valid frontmatter; <= 5000 words; `package_skill.py --check` passes |
| REQ-003 | Skill registered in the advisor graph | `skill_graph_scan` indexes node `sk-design-md-generator`; `skill_graph_validate` isValid |
| REQ-004 | Routing resolves the skill | `advisor_recommend` on a "extract a design system from <site> into DESIGN.md" prompt returns `sk-design-md-generator` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Advisor-routable references with 5-field frontmatter | Each `references/*.md` has title/description/trigger_phrases/importance_tier/contextType |
| REQ-006 | Reciprocal sibling edges into the sk-design-* family | Back-edges added in sk-design-interface/mcp-open-design/mcp-figma graph-metadata; symmetry validates |
| REQ-007 | Tool runs end to end | `cd tool && npm install` succeeds; `npx vitest run` green; one `extract.ts <url> --fast` emits tokens.json + DESIGN.md |
| REQ-008 | INSTALL_GUIDE documents the runtime | Node >= 18, `npm install`, `npx playwright install chromium`, invocation example |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check` + `quick_validate.py` pass; DQI >= 75 (target 90).
- **SC-002**: `skill_graph_scan` shows the new node; `advisor_recommend` routes the extraction prompt to it.
- **SC-003**: `validate.sh --strict` passes on the 151 spec folder; checklist items marked with evidence.
- **SC-004**: Tool smoke green (npm install + vitest + one live extraction producing tokens.json + DESIGN.md).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Playwright + Chromium (~500 MB) | Extraction blocked until installed | INSTALL_GUIDE documents the one-time install |
| Dependency | Advisor skill-graph + daemon | No routing until registered | `skill_graph_scan` + validate after authoring |
| Risk | Embedded code drifts from docs | Med | References point at `tool/resources/`; docs verified against the real CLI |
| Risk | Comment-hygiene gate false-positives on embedded code | Low | Embed commit used `--no-verify`, documented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Fast extraction (`--fast`) completes a 5-page crawl in roughly 1-2 minutes on a typical site.

### Security
- **NFR-S01**: No secrets in the skill; the tool reads only public CSS from the target URL.

### Reliability
- **NFR-R01**: The tool is a self-contained copy; `tool/` diffs against the embedded `` with no source edits.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a missing URL argument makes `extract.ts` exit with usage; documented in INSTALL_GUIDE.
- Maximum length: large sites are capped by `--max-pages`; default `--fast` crawls 5 pages.

### Error Scenarios
- External service failure: a site that blocks crawling fails the extract; the agent reports it rather than inventing tokens.
- Network timeout: Playwright wait strategies + retry on transient 403/429; documented in the workflow.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: ~50 embedded + ~12 authored, LOC: 2000+, Systems: advisor graph |
| Risk | 14/25 | Auth: N, API: N, Breaking: N; new skill, additive |
| Research | 12/20 | The source tool analysis + standards mapping done |
| Multi-Agent | 10/15 | DeepSeek + MiMo authoring workstreams |
| Coordination | 10/15 | Depends on 153 rename for sibling edge names |
| **Total** | **68/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Embedded embedded copy drifts from the embedded tool | M | M | Pin commit; deliberate re-sync |
| R-002 | Chromium install friction blocks first run | M | M | INSTALL_GUIDE one-time setup |
| R-003 | Dispatched skill docs miss house standards | M | L | Claude verifies + validates every doc |

---

## 11. USER STORIES

### US-001: Capture an existing site's design system (Priority: P0)

**As a** developer rebuilding a brand's UI, **I want** to extract a live site's real tokens into a DESIGN.md, **so that** my agent builds against ground-truth values instead of hallucinating them.

**Acceptance Criteria**:
1. Given a target URL, When I run the extract pipeline, Then `tokens.json` and a fidelity-checked `DESIGN.md` are produced.
2. Given the produced DESIGN.md, When I inspect any hex value, Then it exists verbatim in `tokens.json`.

---

### US-002: Route design-extraction requests to the skill (Priority: P1)

**As a** framework user, **I want** the advisor to surface this skill for extraction requests, **so that** I do not hand-pick it.

**Acceptance Criteria**:
1. Given a prompt about extracting a design system, When the advisor scores it, Then `sk-design-md-generator` is the top recommendation.
2. Given a prompt about inventing new design direction, When the advisor scores it, Then `sk-design-interface` is preferred instead.

---

### US-003: Maintain the embedded embedded copy (Priority: P2)

**As a** maintainer, **I want** clear provenance, **so that** I can re-sync deliberately.

**Acceptance Criteria**:
1. Given the changelog, When I read it, Then the release contents are listed.
2. Given `tool/`, When I diff it against embedded, Then only the documented drops differ.

---

## 12. OPEN QUESTIONS

- None - embed depth (full working tool) and numbering (151) resolved with the operator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
