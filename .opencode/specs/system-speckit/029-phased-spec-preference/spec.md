---
title: "Feature Specification: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy"
description: "Analyze system-spec-kit's SKILL.md, references, assets, and AGENTS.md to design enforcement of a phased-spec-over-new-folder preference policy."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-phased-spec-preference"
    last_updated_at: "2026-07-11T15:51:28.214Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-phased-spec-preference"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `skilled/v4.0.0.0` (no dedicated branch — `--skip-branch`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-spec-kit already has a phase-decomposition system (`phase_system.md`, `phase_definitions.md`) gated on a complexity score (>=25/50) AND a level threshold (>=3), but nothing tells AI agents to *prefer* extending an existing phased packet with a new phase over spinning up a brand-new sibling spec folder. Operator observation (see memory index) shows a proliferation of near-duplicate top-level packets that should have been phases of an existing packet, discovered only during later re-nest cleanups (e.g. packet 028's four-folder re-nest).

### Purpose
Produce a concrete, enforceable policy — reviewed against system-spec-kit's actual routing/gate logic (Gate 3, folder_routing.md, phase_system.md) — that makes "extend the active phased packet" the default over "create a new spec folder," except when the new work is small (exempt-tier) or genuinely unrelated to the active packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Dispatch GPT-5.6 Sol (Fast tier, xhigh reasoning) via cli-opencode to analyze system-spec-kit's SKILL.md, `references/structure/*`, `references/workflows/*`, `assets/level_decision_matrix.md`, `constitutional/spec-folder-naming.md`, and the Gate 3 prose in both `CLAUDE.md` files.
- Produce a concrete enforcement proposal for two policy rules (see REQ-001, REQ-002 below).
- Independently verify the proposal (Claude re-check + Opus 4.8 adversarial review) before applying anything.
- Apply the corrected wording to the 8 affected files once the operator approved the reviewed proposal.

### Out of Scope
- Re-litigating the existing phase-detection thresholds (score >=25/50, level >=3) - the applied wording works *with* them, not replaces them.

### Files to Change (this packet)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` (`CLAUDE.md` symlinks to it) | Modify | Gate 3 A-E options + recommendation priority |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | ALWAYS rules 5 + 16 |
| `.opencode/skills/system-spec-kit/references/structure/phase_definitions.md` | Modify | §1 sentence + "Phased-Packet Preference" + "Extending an Existing Phase Parent" sections |
| `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md` | Modify | §8 (merged) + §9 rewrite |
| `.opencode/skills/system-spec-kit/references/structure/folder_routing.md` | Modify | §9 `"new folder"` bypass row |
| `.opencode/skills/system-spec-kit/references/structure/sub_folder_versioning.md` | Modify | §1 bullet |
| `.opencode/skills/system-spec-kit/references/workflows/spec_folder_authoring_checklist.md` | Modify | §2 pre-checks insert |
| `README.md` | Modify | Gate 3 ASCII diagram E-label sync |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rule A: AI's should default to a multi-phase spec over a new standalone spec folder, unless the task is small (exempt-tier / Level 1 trivial) or is genuinely new/unrelated to current work | Proposal names the exact doc(s)/gate(s) to edit and the exact wording change, cross-checked against existing phase-detection thresholds |
| REQ-002 | Rule B: When an AI is already working inside a phased spec (parent or child), it should prefer adding a new phase to that packet over creating a separate new spec folder | Proposal names the exact doc(s)/gate(s) to edit (likely Gate 3 options + `create.sh --phase --parent` guidance) and the exact wording change |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Proposal defines "small" and "new/unrelated" with a concrete, checkable heuristic (not just prose judgment) | Heuristic is stated in the proposal and doesn't conflict with `level_decision_matrix.md`'s existing LOC/risk guidance |
| REQ-004 | Proposal identifies any conflicts with existing docs (e.g. folder_routing.md's "new folder" session preference phrase, quick_reference.md) | Conflicts listed explicitly, not silently glossed over |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: GPT-5.6 dispatch returns a proposal naming specific file paths + specific wording edits for both Rule A and Rule B, not generic advice
- **SC-002**: Proposal is cross-checked (by this session, not just trusted) against `phase_system.md` §2 detection thresholds and `folder_routing.md` before being presented to the operator
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenAI `gpt-5.6-sol-fast` via cli-opencode | Analysis blocked | Fall back to `deepseek/deepseek-v4-pro` or do the analysis in-session if OpenAI provider isn't configured |
| Risk | GPT proposal conflicts with existing phase-detection thresholds or Gate 3 prose | Med | This session verifies the proposal against the actual reference docs before presenting it, not a blind pass-through |
| Risk | Over-aggressive "prefer phases" wording causes AIs to cram unrelated work into an existing packet | Med | REQ-003/REQ-004 force an explicit "new/unrelated" exemption heuristic |
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

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
