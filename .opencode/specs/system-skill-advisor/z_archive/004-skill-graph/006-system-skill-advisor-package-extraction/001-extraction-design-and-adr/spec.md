---
title: "Feature Specification: Design + ADR for skill advisor extraction"
description: "Read the advisor's full current surface, enumerate 3-4 architectural shapes for the extracted skill, evaluate against fixed criteria, pick a winner, write the ADR. No code moves."
trigger_phrases:
  - "skill advisor extraction design"
  - "advisor extraction ADR"
  - "skill advisor topology design"
  - "system-skill-advisor architectural shape"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr"
    last_updated_at: "2026-05-14T02:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000016001"
      session_id: "001-extraction-design-and-adr"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This packet is research only; no code or skill folder moves happen here."
      - "Output: ADR-001 in decision-record.md locking the architectural shape."
      - "Subsequent children (002+) scaffold AFTER this packet ships."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Design + ADR for skill advisor extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-05-14 |
| **Branch** | `001-extraction-design-and-adr` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill advisor today is a substantial subsystem buried 5 levels deep inside `system-spec-kit`. The parent phase 015/009 extracts it into a first-class `.opencode/skills/system-skill-advisor/` skill folder, subject to two HARD operator constraints:

- **Constraint A — DB-LOCAL**: the skill-graph database (`skill-graph.sqlite` + `-wal` + `-shm`) must live inside `.opencode/skills/system-skill-advisor/`.
- **Constraint B — STANDALONE-MCP**: the advisor must run as its own MCP server process, separate from `spec_kit_memory`.

A codex gpt-5.5 xhigh impact analysis at `research/standalone-mcp-discussion.md` walked the 11 impact areas of these constraints and narrowed 4 candidate shapes down to 2. It **recommends "Standalone Advisor MCP With Legacy Tool Bridge"** — keeping `advisor_*` tool ids stable on the new server, with `spec_kit_memory` either exposing deprecated proxy tools or fail-fast hints during a migration window.

Three operator questions still need a decision before ADR-001 finalizes:

- **Tool-id stability**: do `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate` keep their names, or migrate to a `system_skill_advisor.*` namespace?
- **Backwards-compat window**: does `spec_kit_memory` expose deprecated proxy tools during cutover, or fail fast with a migration hint?
- **DB path env override**: is `SYSTEM_SKILL_ADVISOR_DB_DIR` supported (tests/CI), or fixed under the new skill folder?

### Purpose
Lock the codex-recommended shape into ADR-001, answer the three operator questions inline (or surface explicit "needs operator decision" markers in the ADR), finalize the per-runtime config update strategy, and update parent phase `spec.md` "What Needs Done" with the locked 5-phase migration sequence so children 002-006 can scaffold + execute without re-litigating the design.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only survey of the current advisor surface:
  - `mcp_server/skill_advisor/` tree
  - All callers across the repo (grep `advisor_recommend`, `skill_advisor`, etc.)
  - Tool registrations in `mcp_server/tool-schemas.ts` + `context-server.ts`
  - Existing `feature_catalog/`, `manual_testing_playbook/`, `references/` entries that mention the advisor
- Enumerate 3-4 architectural shapes (codex picks the candidate set; common candidates include "own MCP server", "co-resident with system-spec-kit", "stub in new folder that re-exports", "split lib vs tools")
- Evaluate each shape against these criteria:
  - Developer ergonomics (one place to look, no path collisions)
  - MCP server topology (process count, startup cost, IPC complexity)
  - Tool-id stability (do live consumers need to change anything?)
  - Backwards-compat path (deprecate cleanly vs. dual-path window vs. hard cut)
  - Test isolation (advisor Vitest runs without spinning up unrelated code)
  - Install / launcher complexity (one launcher cjs vs two)
- Write ADR-001 in `decision-record.md` locking the chosen shape, alternatives considered with scores, and the migration sequence implied by the choice
- Produce `research/extraction-survey.md` documenting the current surface inventory + the 3-4 shapes considered

### Out of Scope
- ANY code or file moves
- ANY skill folder creation (002's job)
- ANY tool-id changes
- Modifying the running advisor scoring, lanes, or weights (015 line is complete; this packet does not re-litigate that)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Survey enumerates EVERY consumer of advisor tools/code in the repo. | research markdown lists each call site with file:line. |
| REQ-002 | At least 3 architectural shapes evaluated. | ADR-001 alternatives table includes 3+ rows. |
| REQ-003 | Each shape scored on 6 criteria (ergonomics, topology, tool-id stability, backwards-compat, test isolation, launcher complexity). | Score table is present; scores are explained, not just numbers. |
| REQ-004 | A single shape is chosen with rationale. | ADR-001 "Decision" section names the chosen shape. |
| REQ-005 | Migration sequence (children 002-005 outline) is locked. | Phase parent's `spec.md` "What Needs Done" section is updated to reflect the chosen sequence. |
| REQ-006 | No code or skill folder is created/moved by this packet. | Git diff stays within `001-extraction-design-and-adr/` packet docs + parent's spec.md update. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: ADR-001 present with all required sections (context, decision, alternatives, consequences, rollback, five-checks).
- **SC-003**: Research markdown exhaustive enough that a future codex run could execute children 002-005 without re-asking the design questions.
- **SC-004**: No advisor source or consumer file modified.
- **SC-005**: Parent phase's `spec.md` updated to reflect chosen migration sequence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Survey misses a consumer; later phases break that consumer | Production regression on extraction | Codex grep widely (mcp_server, plugins, agents, commands, install_guides, hooks, scripts); cross-check against current `git grep advisor_` count |
| Risk | ADR locks too rigidly; later phase finds a blocker | Re-litigation | ADR includes a "consequences" + "trigger to revisit" section; rollback is "scaffold a 016/001-amendment packet" |
| Risk | Tool-id namespace decision causes consumer churn | Cascading edits in 004 | ADR records expected consumer change count per shape |
| Dependency | 015 line shipped + advisor stable | Migration is structural-only | Already on main through commit `48d5470bc` |
| Dependency | 008-template-levels for skill folder template structure | Subsequent 002 needs template grounding | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Whether to include "split lib vs tools" as a 4th candidate shape (recommend yes — useful contrast)
- Format of the score table (recommend 0-5 numeric per criterion + a brief justification per cell)
- Whether to draft the chosen-shape migration sequence in the ADR itself or as a separate section in spec.md
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Dispatch under 30 min wall clock. |
| NFR-Q01 | Quality | ADR follows the L3 decision-record.md template structure used elsewhere in 026 packets. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- A consumer reaches the advisor via dynamic import or string lookup: surface it in the survey with a "reflection" flag.
- Tool registration happens in TWO places (tool-schemas.ts + context-server.ts): ADR addresses both.
- The `skill_advisor.py` script (under `mcp_server/skill_advisor/scripts/`) is a separate consumer — ADR addresses whether it moves too.
- `advisor-hook.md` Skill Advisor Hook documentation under `references/hooks/`: ADR addresses where it lands.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 0 lines of code; 400-700 lines of doc | Pure research + ADR |
| **Surface area** | Whole-repo survey, ADR + research artifact | Read-many, write-few |
| **Risk** | Low | No production code touched |
| **Reversibility** | High | Single-commit revert deletes packet |
<!-- /ANCHOR:complexity -->
