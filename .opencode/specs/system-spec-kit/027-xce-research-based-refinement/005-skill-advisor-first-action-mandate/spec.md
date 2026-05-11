---
title: "Phase 005 — Skill Advisor First-Action Mandate (CANCELLED — folded into 103/003)"
description: "CANCELLED 2026-05-11 per pt-04 audit. The render.ts strengthening proposed here overlaps the shipped 103 :auto contract (commit add6cff39, 2026-05-11) which already delivers a three-tier noninteractive routing contract. To keep the noninteractive routing vocabulary single-sourced under 103, this phase is cancelled and the renderer wording change is folded into `../../../skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment/`."
trigger_phrases:
  - "027 phase 005 cancelled"
  - "027 phase 005 folded into 103"
  - "first-action mandate folded"
importance_tier: "background"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-skill-advisor-first-action-mandate"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "CANCELLED per pt-04: renderer change folded into 103/003"
    next_safe_action: "Implement renderer wording change in 103/003, not here"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-11-027-005-cancellation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase 005 fate → cancel + fold into 103/003 follow-on (pt-04 user decision)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Skill Advisor First-Action Mandate — **CANCELLED**

<!-- SPECKIT_LEVEL: 1 -->

> **Status: CANCELLED — 2026-05-11 (pt-04 audit)**.
>
> The render-layer "MUST invoke FIRST" mandate proposed in this phase has been folded into the 103 :auto noninteractive contract follow-on at:
>
> `.opencode/specs/skilled-agent-orchestration/103-spec-kit-auto-mode-noninteractive-contract/003-skill-advisor-render-103-alignment/`
>
> Rationale (per pt-04 audit `../research/027-xce-research-pt-04/research.md` §2 Phase 005 and §3 overlap matrix): shipped commit `add6cff39` (2026-05-11) generalized the :auto three-tier contract to 12 commands with 13/13 live PASS. Adding a second "MUST invoke FIRST" vocabulary in `render.ts:155-157` outside that contract would create a divergent vocabulary. The renderer wording change therefore lands as a child of 103, not as a 027 phase.
>
> This folder is retained as audit history (not deleted, per spec-kit retention policy for cancelled phases). The downstream packet 006 has been updated to remove the dependency on this phase as the eval's "after" independent variable.

---

## EXECUTIVE SUMMARY (HISTORICAL — pre-cancellation)

Implement the render-layer change proposed in 027 RQ6 (`../research/iterations/iteration-006.md` F-036) with pt-02 guardrails from `../research/027-xce-research-based-refinement-pt-02/research.md`. Strengthen the `skill_advisor/lib/render.ts` brief from a soft suggestion (`"use ${topLabel}"`) to a strong directive (`"MUST invoke ${topLabel} FIRST (${score}/${uncertainty}) - ${action_hint}"`) only when confidence and uncertainty thresholds both pass. Add a `FIRST_ACTION_HINT` constant map covering all 16 skills with per-skill action directives. Modify two `capText` calls at render.ts:149-152 (ambiguous case) and render.ts:155-158 (normal case). **No scorer changes** — directive strength change only in render layer.

ADAPT verdict from findings.md items #11, #13.

**Key Decisions**:
- **Render-layer ONLY** — no scorer surgery (per spec.md:129 of parent 027 packet).
- **Static action hints** per skill — dynamic intent→action selection is the scorer's job, not render's.
- **Confidence ≥ 0.8 threshold preserved** at render.ts:124-133 — "MUST" is justified at that confidence level.

**Critical Constraints**:
- Brief grows from ~60-80 chars to ~90-180 chars — must fit within DEFAULT_TOKEN_CAP (80 tokens / 320 chars).
- Token cap truncation safety net (`capText`) must remain unchanged.
- The 16 covered skills must include all skills from the system prompt's `available_skills` list.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement` |
| **Source** | `../research/sub-packet-proposals.md` Proposal 4; `../research/iterations/iteration-006.md`; pt-02 amendments in `../research/027-xce-research-based-refinement-pt-02/` |
| **Estimated LOC** | ~30 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

XCE's project-rules files (external/steering/CLAUDE.md:5, kiro.md:6, opencode-prompt.txt:1, plus 3 others) use unconditional static directives like *"Always use xanther-xce MCP tools BEFORE reading files"* and *"Call xce_get_context as your FIRST step on any task"*. These mandates produce measurable token reduction (~20% per XCE's claim, README:188) by changing agent behavior from default-grep to default-tool-call.

Our `skill_advisor/lib/render.ts` (lines 149-158) currently emits a softer brief: `"use ${topLabel}"`. This is a suggestion, not a mandate — agents may or may not follow it. Iteration-006 F-036 confirmed that strengthening to *"MUST invoke ${topLabel} FIRST — ${action_hint}"* preserves the dynamic confidence-gating (≥0.8 threshold at render.ts:124-133) while matching XCE's directive intensity when the brief does fire.

**Purpose**: ship a 30-LOC render.ts edit that flips the directive intensity without touching the scorer. After this phase lands, the advisor's brief explicitly tells agents which skill to invoke FIRST and what the first action should be (e.g., for `mcp-coco-index`: "MUST invoke mcp-coco-index FIRST — semantic search BEFORE grep/file-reading").
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Single edit to `mcp_server/skill_advisor/lib/render.ts`:
  - Add `FIRST_ACTION_HINT` constant map covering all 16 skills (~17 lines).
  - Modify `capText` call at lines 149-152 (ambiguous case) — replace `"use"` with `"MUST invoke X FIRST (...) — hint"`.
  - Modify `capText` call at lines 155-158 (normal case) — same.
- Verify all 16 skills from system-prompt `available_skills` covered:
  - mcp-chrome-devtools, sk-prompt, cli-claude-code, system-spec-kit, sk-code-review, mcp-code-mode, deep-research, mcp-coco-index, sk-code, deep-review, deep-agent-improvement, sk-doc, cli-codex, cli-opencode, sk-git, cli-gemini, agent_router (per system reminder list)
- Update existing render.ts tests to cover new directive shape.

### Out of Scope
- ANY changes to `mcp_server/skill_advisor/lib/scorer/` directory (out-of-scope per parent 027 spec.md:129).
- New files.
- Changes to `skill-advisor-brief.ts`, `prompt-cache.ts`, or any other skill_advisor file.
- Dynamic per-intent first-action selection (scorer's job).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `FIRST_ACTION_HINT` map may provide skill-specific hints; missing hints MUST fall back to a safe generic instruction | Module-level const at top of render.ts; unknown labels render the generic fallback (e.g. "open the skill instructions first"), NEVER `undefined`. Unit-tested with an unknown safe-label fixture. |
| REQ-002 | Render "MUST invoke FIRST" wording ONLY for recommendations that satisfy confidence ≥ threshold AND uncertainty ≤ threshold | Whether derived locally or proven by `passes_threshold` invariant. High-uncertainty cases MUST NOT render the mandate wording. Unit-tested at boundary {0.79, 0.80, 0.81} × {uncertainty at/over threshold}. |
| REQ-003 | Confidence ≥ 0.8 threshold preserved at lines 124-133 | No change to threshold logic; brief still gated correctly |
| REQ-004 | DEFAULT_TOKEN_CAP (80 tokens / 320 chars) honored | Brief always fits within cap; capText safety net unchanged. Token-cap fixture covers longest known label + longest hint under both normal and ambiguous paths. |
| REQ-005 | Existing render.ts tests pass + new tests for directive shape | `npx vitest run skill_advisor/tests/render.vitest.ts` green |
| REQ-007 | High-uncertainty guard | A recommendation with high numeric uncertainty MUST NOT render mandate wording unless the producer contract proves `passes_threshold` already encoded the dual threshold (confidence ≥ T AND uncertainty ≤ T). Renderer-side re-check OR producer invariant fixture. (Resolves B-iter004-002.) |
| REQ-008 | Legacy string fixture migration | Renderer and producer tests that pin old "use X" brief strings MUST be intentionally updated to mandate wording + directive-shape assertions. Poisoning, null, freshness, cache, cap, and ambiguous-output coverage MUST remain. (Resolves B-iter004-006.) |

### P1
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Action hints reflect each skill's domain | Manual review: `mcp-coco-index` hint mentions semantic search; `system-spec-kit` hint mentions gates; `sk-code` hint mentions stack detection |
| REQ-009 | Boundary fixtures | Tests MUST cover confidence ∈ {0.79, 0.80, 0.81} with uncertainty at and over threshold. Confirms inclusive 0.80 boundary in both renderer and producer paths. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep "MUST invoke" .opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/render.ts` returns ≥2 hits.
- **SC-002**: `grep "FIRST_ACTION_HINT" render.ts` returns the constant map.
- **SC-003**: Existing skill_advisor tests pass; new directive-shape tests pass.
- **SC-004**: Phase 006 eval harness can baseline-vs-after on this brief change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | "MUST invoke" too strong for low-confidence cases | Low | Confidence ≥0.8 threshold ensures brief only fires when justified |
| Risk | First-action hint for CLI skills confusing ("MUST invoke cli-claude-code FIRST") | Low | Same — confidence gating filters out off-domain cases |
| Risk | Brief grows beyond DEFAULT_TOKEN_CAP | Low | capText truncation safety net + benchmarking new format ≤320 chars |
| Risk | Mandate wording can overstate confidence if `passes_threshold` bypasses uncertainty | **Medium** | Renderer-side guard OR producer invariant test covering `passes_threshold:true ∧ uncertainty>T` (REQ-007). Per B-iter004-002. |
| Risk | Static FIRST_ACTION_HINT map can drift as skill inventory changes | Low | Safe fallback hint for unknown labels (REQ-001 amended); never render `undefined`. Per B-iter004-004. |
| Risk | Legacy renderer/producer fixtures pin OLD "use X" strings; will fail on day 1 | Medium | Intentional fixture migration to mandate wording + directive-shape assertions, preserving non-string coverage (REQ-008). Per B-iter004-006. |
| Dependency | None | — | Self-contained single-file edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT (Level 1)

| Dimension | Score |
|-----------|-------|
| Scope (1 file edit, ~80-120 LOC after pt-02 amendments — uncertainty guard, fallback hint, fixture migration) | 8/25 |
| Risk (renderer-layer change with passes_threshold invariant dependency; contained blast radius) | 4/25 |
| Research (pt-02 cross-validation done) | 2/20 |
| **Total** | **14/70** | **Level 1 (upper end)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Action hints: keep concise (≤30 chars each) or allow longer? (Default: ≤30 chars to stay within token cap.)
- Should `FIRST_ACTION_HINT` be exported for reuse in tests? (Default: yes, named export.)
<!-- /ANCHOR:questions -->
