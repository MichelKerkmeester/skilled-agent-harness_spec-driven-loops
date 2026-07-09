---
title: "Implementation Plan: 101/004 Deep AI Council Reference Expansion"
description: "Plan for expanding deep-ai-council references, manual testing scenarios, SKILL.md routing, and Level 1 packet metadata."
trigger_phrases:
  - "101/004 plan"
  - "deep-ai-council reference expansion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/005-deep-multi-ai-council-skill/002-deep-ai-council-reference-expansion"
    last_updated_at: "2026-05-10T10:50:00Z"
    last_updated_by: "openai-gpt-5.5-codex"
    recent_action: "Planned and completed reference expansion workstreams A through E."
    next_safe_action: "Run validation gates and report results."
    blockers: []
    key_files:
      - references/scoring_rubric.md
      - references/depth_dispatch.md
      - references/failure_handling.md
      - references/anti_patterns.md
      - references/seat_diversity_patterns.md
      - playbook/06/001-depth-detection-parallel-vs-sequential.md
      - playbook/06/002-resume-after-interrupted-state.md
      - playbook/07/001-library-writer-call-sequence.md
      - playbook/07/002-five-dimension-scoring-rubric-application.md
      - playbook/07/003-hunter-skeptic-referee-cross-critique.md
      - playbook/07/004-out-of-scope-write-rejection.md
      - SKILL.md
      - .opencode/agents/deep-ai-council.md
      - .claude/agents/deep-ai-council.md
      - .codex/agents/deep-ai-council.toml
      - .gemini/agents/deep-ai-council.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-004-reference-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use direct reference/playbook expansion only; do not add graph or advisor regression scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/004 Deep AI Council Reference Expansion

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, shell validation |
| **Framework** | sk-doc reference and manual testing playbook templates; system-spec-kit Level 1 packet templates |
| **Storage** | Skill package references, manual testing playbook files, and spec packet metadata |
| **Testing** | sk-doc quick validation, document validation, strict spec validation, grep/file-count verification |

### Overview
This packet expands `deep-ai-council` documentation by moving substantial agent-body subsystems into focused references, extending manual playbook coverage, and updating skill routing so those references load by intent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Authoritative source identified as `.opencode/agents/deep-ai-council.md`.
- [x] sk-doc reference and playbook templates identified.
- [x] Level 1 spec packet path selected.
- [x] Worktree branch confirmed as `main`.

### Definition of Done
- [x] Four new references created.
- [x] One existing reference expanded.
- [x] Six playbook scenarios and two categories added.
- [x] Root playbook counts, summaries, TOC, and index updated.
- [x] `SKILL.md` routing extended.
- [x] Level 1 packet docs and metadata created.
- [x] Ten requested verification gates pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference expansion with progressive disclosure: keep `SKILL.md` concise, move dense operational guidance into `references/*.md`, and keep deterministic operator checks in the manual testing playbook.

### Key Components
- **New references**: scoring, depth dispatch, failure handling, and anti-pattern guidance.
- **Expanded reference**: seat diversity patterns mirror the full strategy routing section.
- **Manual playbook categories**: depth/failure handling and writer-library contract.
- **Skill routing**: intent model and resource map entries for the new references.
- **Spec packet**: Level 1 documentation for continuity and validation.

### Data Flow
Agent-body sections provide authoritative source content, references reorganize that content for targeted loading, `SKILL.md` maps prompt intent to references, and playbook scenarios validate the behavior and documentation signals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read source agent sections and local templates.
- [x] Inspect existing references, playbook files, and sibling spec packet structure.
- [x] Confirm branch remains `main`.

### Phase 2: Implementation
- [x] Create `scoring_rubric.md`, `depth_dispatch.md`, `failure_handling.md`, and `anti_patterns.md`.
- [x] Expand `seat_diversity_patterns.md`.
- [x] Add six playbook scenario files under two new category folders.
- [x] Update root manual testing playbook.
- [x] Extend `SKILL.md` routing and reference lists.
- [x] Create packet `002-deep-ai-council-reference-expansion`.

### Phase 3: Verification
- [x] Run `quick_validate.py` for `deep-ai-council`.
- [x] Run `validate_document.py` on the five reference files.
- [x] Run `validate_document.py` on the six new playbook files.
- [x] Verify DAC-013 through DAC-018 root playbook index matches.
- [x] Verify `SKILL.md` intent/resource counts.
- [x] Run strict validation for this spec packet.
- [x] Verify reference count, playbook file count, snake_case links, and branch.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill package validation | Structure and required skill docs | `quick_validate.py` |
| Document validation | New and expanded references plus new playbook snippets | `validate_document.py` |
| Root index validation | DAC-013 through DAC-018 rows and category summaries | `rg`, `wc` |
| Routing validation | New intent names appear in INTENT_MODEL and RESOURCE_MAP | `rg`, `wc` |
| Spec validation | Level 1 packet docs and metadata | `validate.sh --strict` |
| Hygiene checks | Counts, snake_case references, branch | `ls`, `find`, `rg`, `git branch --show-current` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/agents/deep-ai-council.md` | Source | Available | Reference content cannot be verified without it |
| sk-doc templates and validators | Internal | Available | Reference/playbook shape cannot be validated without them |
| system-spec-kit validation script | Internal | Available | Completion claim cannot be made without strict packet validation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Validation shows references, playbook files, or routing are structurally invalid.
- **Procedure**: Fix the invalid document in place from the authoritative agent body and rerun the ten verification gates. If a category or reference is fundamentally wrong, delete the new file rather than archiving it and recreate from the correct source.
<!-- /ANCHOR:rollback -->
