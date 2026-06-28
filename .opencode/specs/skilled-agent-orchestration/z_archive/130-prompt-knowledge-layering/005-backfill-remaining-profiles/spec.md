---
title: "Feature Specification: Phase 5: backfill-remaining-profiles"
description: "Author the 6 remaining per-model prompt-craft profiles for sk-prompt-models: minimax-2.7 (TIDD-EC empirical), swe-1.6 (RCAF + mandatory pre-planning contract), and deepseek-v4-pro, kimi-k2.6, qwen3.6, glm-5.1 (RCAF/medium default-unverified). All profiles follow the canonical 6-section template."
trigger_phrases:
  - "backfill remaining profiles"
  - "sk-prompt-models profiles"
  - "small model profile phase 5"
  - "minimax-2.7 profile"
  - "swe-1.6 profile"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/005-backfill-remaining-profiles"
    last_updated_at: "2026-06-02T18:04:14Z"
    last_updated_by: "agent"
    recent_action: "Phase complete — all 6 profiles authored and validated"
    next_safe_action: "Proceed to phase 006-thin-and-standardize-cli-cards"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/references/models/minimax-2.7.md"
      - ".opencode/skills/sk-prompt-models/references/models/swe-1.6.md"
      - ".opencode/skills/sk-prompt-models/references/models/deepseek-v4-pro.md"
      - ".opencode/skills/sk-prompt-models/references/models/kimi-k2.6.md"
      - ".opencode/skills/sk-prompt-models/references/models/qwen3.6.md"
      - ".opencode/skills/sk-prompt-models/references/models/glm-5.1.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-backfill-remaining-profiles"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: backfill-remaining-profiles

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `scaffold/005-backfill-remaining-profiles` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 8 |
| **Predecessor** | 004-model-hub-and-priority-profiles |
| **Successor** | 006-thin-and-standardize-cli-cards |
| **Handoff Criteria** | All 6 per-model profiles authored, following 6-section template, with valid frontmatter and profile_ref/model_id round-trip |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Prompt-knowledge layering across CLI skills, sk-prompt frameworks, and the sk-prompt-models model-craft hub specification.

**Scope Boundary**: Author the 6 remaining per-model profiles that were absent after phase 4 (priority profiles). No changes to the hub's SKILL.md, dispatch matrix, or executor mechanics — profile authoring only.

**Dependencies**:
- Phase 4 (004-model-hub-and-priority-profiles): delivered the hub scaffold and the two priority profiles (mimo-v2.5-pro, minimax-m3).
- `model-profiles.json` in `sk-prompt/assets/`: source of truth for `recommended_frameworks`, capability fields, and model IDs used in each profile.

**Deliverables**:
- `minimax-2.7.md`: TIDD-EC empirical profile with benchmark 120/003 evidence
- `swe-1.6.md`: RCAF profile with mandatory caller-side pre-planning contract
- `deepseek-v4-pro.md`, `kimi-k2.6.md`, `qwen3.6.md`, `glm-5.1.md`: RCAF/medium default-unverified profiles

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After phase 4, the sk-prompt-models hub had a scaffold and two priority profiles but was missing authoritative prompt-craft documentation for six models in the active dispatch rotation: minimax-2.7, swe-1.6, deepseek-v4-pro, kimi-k2.6, qwen3.6, and glm-5.1. Without these profiles, callers had no canonical source for framework selection, tuned template scaffolds, or per-model dispatch gotchas, forcing them to infer or guess.

### Purpose

Populate the hub by authoring all 6 remaining per-model profiles, giving every model in the dispatch rotation a canonical, discoverable, self-consistent prompt-craft reference that mirrors `model-profiles.json` and surfaces the most critical per-model nuances (mandatory contracts, counter-intuitive notes, dispatch gotchas).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `minimax-2.7.md` using the existing 120/003 benchmark data (TIDD-EC empirical)
- Author `swe-1.6.md` with RCAF primary and explicit mandatory pre-planning contract
- Author `deepseek-v4-pro.md`, `kimi-k2.6.md`, `qwen3.6.md`, `glm-5.1.md` (RCAF/medium default-unverified)
- All profiles follow the canonical 6-section template: Identity, Recommended Framework, Benchmark Evidence, Tuned Template Snippet, Dispatch Gotchas, See Also
- YAML frontmatter with correct `model_id`, `status`, and `last_benchmarked` fields

### Out of Scope
- Changes to `model-profiles.json` — profiles mirror it, do not edit it
- Changes to hub SKILL.md or the dispatch matrix — those belong to separate phases
- Executor mechanics (binary flags, invocation wrappers) — those live in `cli-devin`/`cli-opencode`
- Running benchmarks — profiles record existing evidence and reasoned defaults only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/references/models/minimax-2.7.md` | Create | TIDD-EC empirical profile; benchmark 120/003 evidence, TIDD-EC fill scaffold |
| `.opencode/skills/sk-prompt-models/references/models/swe-1.6.md` | Create | RCAF + mandatory pre-planning contract; escalation rule, non-TTY rule |
| `.opencode/skills/sk-prompt-models/references/models/deepseek-v4-pro.md` | Create | RCAF/medium default-unverified; `--pure` flag note, 64k window |
| `.opencode/skills/sk-prompt-models/references/models/kimi-k2.6.md` | Create | RCAF/medium default-unverified; 200k large-context specialist, hang rate |
| `.opencode/skills/sk-prompt-models/references/models/qwen3.6.md` | Create | RCAF/medium default-unverified; 32k window constraints |
| `.opencode/skills/sk-prompt-models/references/models/glm-5.1.md` | Create | RCAF/medium default-unverified; dual-pool dispatch |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 profiles created at correct paths | `ls .opencode/skills/sk-prompt-models/references/models/` shows all 6 files |
| REQ-002 | Each profile has a valid H1 heading | Each file opens with `# <ModelName> Prompt-Craft Profile` |
| REQ-003 | YAML frontmatter present with `model_id` and `status` | Each file has correct frontmatter; `model_id` matches `model-profiles.json` entry ID |
| REQ-004 | Framework choices mirror `model-profiles.json` `recommended_frameworks` | Primary framework, fallback, and pre-planning density match the DATA source for each model |
| REQ-005 | Each profile follows the 6-section template | All 6 sections (Identity, Framework, Evidence, Template, Gotchas, See Also) present |
| REQ-006 | minimax-2.7 records benchmark 120/003 evidence | Section 3 includes TIDD-EC score 0.767, RCAF score 0.742, sample size 7, confidence medium |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | swe-1.6 documents mandatory pre-planning contract | Section 2 and/or Section 5 explicitly state the pre-plan block is required, not optional |
| REQ-008 | Each profile includes per-model counter-intuitive notes | Section 2 has a counter-intuitive note or equivalent framing relevant to that model |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 profile files exist at `.opencode/skills/sk-prompt-models/references/models/<model-id>.md`
- **SC-002**: Every profile's `model_id` frontmatter value resolves to a matching entry in `model-profiles.json`
- **SC-003**: The spec-kit validator exits 0 with `--strict` on this spec folder
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `model-profiles.json` as DATA source | Profile round-trips break if registry changes | Profiles quote registry values verbatim; future registry changes must propagate to profiles |
| Risk | default-unverified profiles may contain RCAF assignments that a future benchmark invalidates | Callers may use suboptimal framework until profiles are updated | Profiles explicitly state `status: default-unverified` and `confidence: low`; updating is straightforward once benchmark data exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Phase complete.
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
