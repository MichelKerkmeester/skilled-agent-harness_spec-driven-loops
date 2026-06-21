---
title: "Feature Specification: sk-prompt design-tool usecases (assess + improve)"
description: "Assess whether sk-prompt serves the design-generation usecases of mcp-magicpath and mcp-open-design, and improve it if warranted. Verdict was yes: a lean design-generation prompt reference plus router wiring was added, covering the grounded anti-default brief, the seed-of-thought variation technique, the multi-turn discovery-form pre-answer, and the sk-code handoff."
trigger_phrases:
  - "sk-prompt design tool usecases"
  - "design generation prompt pattern"
  - "sk-prompt magicpath open-design"
  - "seed of thought variation prompt"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/006-sk-prompt-design-tool-usecases"
    last_updated_at: "2026-06-14T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assessed sk-prompt and added a design-generation prompt reference plus router wiring"
    next_safe_action: "Orchestrator registers the 006 child in the 150 parent"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/references/design_generation_patterns.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-006-sk-prompt-design-tool-usecases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Can sk-prompt be improved for the design-generation usecases? Yes, gap confirmed and closed."
---
# Feature Specification: sk-prompt design-tool usecases (assess + improve)

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
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Type** | Assessment plus bounded improvement to a shared skill (`sk-prompt`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`sk-prompt` is the framework's prompt-engineering skill: seven text frameworks, a five-phase DEPTH pass, CLEAR scoring, and three format guides. It is built for text tasks. The framework now drives two design-generation tools from the terminal, `mcp-magicpath` (canvas authoring through the `magicpath-ai` CLI) and `mcp-open-design` (headless `start_run` against the Open Design app), where the visible output is driven by a generation prompt. A generic content brief asked of those tools produces the median AI look that `sk-design-interface` exists to resist. `sk-prompt` had no design-generation usecase and nothing for the anti-default brief, variation diversity, or the multi-turn discovery flow.

### Purpose
Assess honestly whether `sk-prompt` already serves design-generation prompting, and improve it only if a real gap exists. The improvement, if warranted, must fit `sk-prompt`'s existing architecture (a reference doc plus router wiring) and must not duplicate the design judgment owned by `sk-design-interface` or the run transport owned by the two MCP skills.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Assess `sk-prompt` against four design-generation needs: a grounded anti-default brief, the seed-of-thought variation technique, the multi-turn discovery-form pre-answer, and the design-to-`sk-code` handoff.
- If warranted, add a lean design-generation prompt reference inside `sk-prompt`.
- Wire the new reference into the `sk-prompt` smart router and surface it in the README.
- Bump the skill version and add a matching changelog entry.

### Out of Scope
- The design judgment and anti-default mandate (owned by `sk-design-interface`).
- The CLI and run transports, their gating, and the fidelity loop (owned by `mcp-magicpath`, `mcp-open-design`, and the shared `claude_design_parity.md`).
- Editing `sk-design-interface` (phase 005 owns it).
- Editing the 150 parent `spec.md` or `graph-metadata.json` (the orchestrator registers this child after the phase finishes).
- Any new `$` mode prefix or change to CLEAR scoring math.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt/references/design_generation_patterns.md` | Create | The design-generation prompt reference |
| `.opencode/skills/sk-prompt/SKILL.md` | Update | `DESIGN_GEN` router intent, resource map, loading levels, references, version |
| `.opencode/skills/sk-prompt/README.md` | Update | RELATED DOCUMENTS row for the new reference |
| `.opencode/skills/sk-prompt/changelog/v2.2.0.0.md` | Create | Changelog entry for the addition |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An honest assessment verdict with reasons | Verdict states yes or no per need (a) to (d), grounded in the read of `sk-prompt` and the three usecase skills |
| REQ-002 | If warranted, a design-generation prompt reference exists | `references/design_generation_patterns.md` covers the grounded brief, seed-of-thought, discovery-form pre-answer, and the handoff pointer |
| REQ-003 | The addition fits `sk-prompt`'s architecture | New reference plus router wiring, no new pipeline, builds on existing frameworks, 5-field reference frontmatter preserved |
| REQ-004 | `package_skill.py --check` passes | Exit reports PASS with no new errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The router actually loads the new reference | `DESIGN_GEN` intent and `RESOURCE_MAP` entry present and consistent across SKILL.md surfaces |
| REQ-006 | The boundary is explicit | The reference defers the look to `sk-design-interface` and the transport to the MCP skills, and points to `claude_design_parity.md` §6 for handoff |
| REQ-007 | The anti-default guardrail is honored | The seed-of-thought indexes brief-grounded directions, never a reusable style preset (`claude_design_parity.md` §8) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The assessment reaches a clear verdict on each of the four needs, with reasons a reviewer can check against the source skills.
- **SC-002**: If improvement ships, it is a single new reference plus router wiring, consistent with how `patterns_evaluation.md` and the format guides are wired.
- **SC-003**: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-prompt --check` reports PASS.
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` reports 0 errors.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Forcing a change that is not warranted | Bloats the skill | Assess first, ship only a confirmed gap, keep it lean |
| Risk | Re-introducing the templated default | Undoes the anti-default mandate | Seed-of-thought indexes grounded directions only, never a style menu |
| Risk | Duplicating another skill's ownership | Drift between skills | Reference owns the prompt only and points to the owners for look, transport, and handoff |
| Dependency | `claude_design_parity.md` | Handoff and guardrail source | Read-only, referenced not edited |
| Dependency | `package_skill.py` | Skill structure gate | Run on every edit until PASS |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The new reference matches the existing 5-field reference frontmatter (title, description, trigger_phrases, importance_tier, contextType).
- **NFR-M02**: House voice is honored in all new prose (no em dashes, no prose semicolons).

### Consistency
- **NFR-C01**: The new reference appears in every place the router and docs enumerate references (resource domains, loading levels, §5, §9, README §9).
- **NFR-C02**: A version bump carries a matching one-file changelog entry, per the skill's convention.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Routing
- **No design signal**: text-prompt behavior is unchanged, and `DESIGN_GEN` engages only on design-generation keywords.
- **Ambiguous design plus framework ask**: the existing ambiguity-delta tiebreaker loads both references, which is acceptable.

### Anti-default
- **Variations requested**: the seed selects a grounded angle to commit to first, and it never selects a canned style.
- **Reusable option set detected**: if the direction set could be reused across briefs, it has become a preset and must not ship.

### Multi-turn run
- **Discovery form still appears**: answer with `od ui respond` carrying the explicit answers, never `--skip` a design-shaping question into its default.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Factor | Reading |
|--------|---------|
| **Blast radius** | Low. Additive change isolated to `sk-prompt`. Text-prompt behavior is unchanged and design routing is opt-in on keywords. |
| **Reversibility** | High. Delete the reference and changelog, revert the router and README edits. Nothing else depends on it. |
| **Surface touched** | One skill: a new reference, router wiring, README row, version, changelog. No shared schema, no scoring math. |
| **Effort** | Small. One focused reference plus a handful of consistent router rows. |
| **Confidence** | High. The gap is concrete and the fix mirrors the existing `FRAMEWORK` intent wiring. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Can `sk-prompt` be improved for the `mcp-magicpath` and `mcp-open-design` design-generation usecases? **RESOLVED: Yes. The grounded brief, seed-of-thought variation, and discovery-form pre-answer were genuine gaps. The sk-code handoff is mostly owned by `claude_design_parity.md` §6, so it gets a pointer rather than a duplicated schema.**
- Should a new `$design` mode prefix be added? **RESOLVED: No. A router intent is leaner and keeps the format-and-energy mode table stable.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:related-docs -->
