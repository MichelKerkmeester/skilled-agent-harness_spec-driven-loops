---
title: "Phase 3: deep-review uplift (H-7 marker-based finding dedup + H-9 bounded evidence interpolation)"
description: "Add finding-signature dedup across deep-review multi-dimensional iterations (skip dispatching dimension N+1 if same finding already produced in dimension N) and bounded evidence interpolation for very large packets (>10MB total evidence)."
trigger_phrases:
  - "h7 marker finding dedup"
  - "h9 bounded evidence"
  - "deep-review uplift"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/089-auto-review-stretch-config-dedup-gates/003-deep-review-uplift"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "claude-opus-4-7-110-scaffold"
    recent_action: "phase_3_spec_scaffolded_awaiting_council"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-110-003-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: H-7 finding dedup + H-9 bounded evidence for deep-review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned — gated on council approval |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `110-auto-review-stretch-config-dedup-gates` |
| **Source teachings** | H-7 + H-9 from `106/research/review-report.md` §5 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two efficiency gaps in deep-review's multi-dimensional iteration model:
1. **H-7 finding duplication**: When `/deep:start-review-loop` runs across multiple dimensions (security, correctness, performance, etc.), the same finding (e.g. `auth.ts:42 missing input validation`) can be re-emitted by multiple dimensions. The reviewer doesn't realize the finding is already in state from a prior dimension.
2. **H-9 evidence bloat**: For very large packets (>10MB total code under review), the prompt's evidence interpolation can blow past context windows. Truncating naively loses critical signal.

### Purpose (REVISED per council §10.4-5)

- **H-7 (KEPT, extends existing dedup)**: deep-review synthesis at `deep_start-review-loop_auto.yaml:1115-1124` ALREADY deduplicates by `file:line + normalized_title` — H-7 must EXTEND this contract, not invent a parallel sha256 path. Add a content-hash column to the existing dedup state so cross-dimension matches (same finding emitted by 2 dimensions) collapse to one entry with `dimensions: [security, correctness]` rather than 2 separate entries. Authoritative dedup happens in synthesis/reducer state, not in prompt hints to the reviewer.
- **H-9 (DEFERRED per council §10.5)**: Current deep-review prompt packs use **state/metadata pointers** at `prompt_pack_iteration.md.tmpl:7-17`, not embedded file contents. The "bound the interpolation around candidate file:line" wording assumed an interpolation point that doesn't exist in the current architecture. Council §10.5: defer until a real evidence interpolation path is identified. Track as a follow-on in packet 111 if pursued.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (REVISED per council §10.4 + §10.5)

**H-7 finding-signature dedup — EXTEND existing synthesis dedup**:
- The synthesis YAML at `deep_start-review-loop_auto.yaml:1115-1124` (and confirm mirror) ALREADY deduplicates by `file:line + normalized_title`. H-7 extends this contract:
  - Add a `content_hash` field to each finding record in `deep-review-state.jsonl`: `sha256(file_path + line_range + finding_type + normalized_description_80chars)`
  - Synthesis step uses `content_hash` as the dedup primary key, with `file:line + normalized_title` as fallback for legacy records lacking the hash field
  - When the same content_hash appears across iterations from different dimensions, collapse to ONE entry with `dimensions: [<list>]` rather than emitting multiple records
  - Prior signatures MAY be passed to the next dimension as prompt-level hints (reviewer-side awareness), but authoritative dedup happens in synthesis/reducer state, not in prompt hints
- Backward compatibility: missing `content_hash` field in legacy state records → fall back to existing `file:line + normalized_title` dedup behavior (no regression)

**H-9 bounded evidence interpolation — DEFERRED to packet 111+** (council §10.5)
- Current deep-review prompts at `prompt_pack_iteration.md.tmpl:7-17` use state/metadata pointers (file paths + line ranges as state references), not embedded file contents
- The "candidate file:line context windows" approach in the original spec would require an evidence-interpolation step that does not exist
- H-9 is removed from packet 110 scope; track in a future packet 111+ if a real interpolation point is identified during normal deep-review usage

### Out of Scope
- Cross-packet finding dedup (out of scope — each packet's deep-review is independent)
- Re-running prior iterations to repopulate signatures retroactively
- Touching deep-research (H-7 applies only to deep-review's multi-dimensional model; deep-research is single-dimension iterations)

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skills/deep-review/SKILL.md` | Modify | Document signature scheme + dedup contract + bounded-evidence threshold |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Modify | Add `## Previously-Emitted Findings` block; add `MODE: bounded-evidence` prefix when applicable |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Add pre-dispatch finding-signature aggregation step + bounded-evidence threshold check |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Mirror of auto |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Finding signature deterministic + content-based (sha256) | Same finding from different dimension → same signature |
| REQ-002 | Prior signatures passed to next iteration as "do not re-emit" list | Reviewer prompt contains the signature set |
| REQ-003 | Duplicate-detected findings tagged `DUPLICATE-FROM: iter-NNN` in synthesis | Distinguishable from new findings |
| REQ-004 | Bounded-evidence threshold respects env var | `DEEP_REVIEW_EVIDENCE_THRESHOLD_BYTES` override works |
| REQ-005 | When bounded-evidence active, prompt prefix declares mode | Reviewer aware of truncation |
| REQ-006 | Below threshold: behavior unchanged | No regression for normal-sized packets |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Signature scheme documented unambiguously in SKILL.md.
- **SC-002**: Pre-dispatch aggregation step present in both YAMLs.
- **SC-003**: Bounded-evidence threshold spec clear; env-var override works.
- **SC-004**: Synthesis step recognizes `DUPLICATE-FROM:` tags.
- **SC-005**: Smoke test: same finding emitted from 2 dimensions → 2nd marked DUPLICATE, not counted as new finding.
- **SC-006**: Strict validate exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Signature collisions (different findings, same signature) | False dedup, missed findings | Include 80 chars of finding description in signature input + use sha256 |
| Risk | Reviewer ignores "previously emitted" hints and emits dupes anyway | Synthesis must handle dupes gracefully | Synthesis dedup step uses signature match independent of reviewer compliance |
| Risk | Bounded evidence truncates critical context | False-negative findings | Use 20-line window (generous); threshold OPT-IN via env var; document tradeoff |
| Risk | Threshold check on EVERY iteration adds overhead | Slow deep-review | Threshold check is cheap (file stat + sum); only triggers truncation on very-large packets |
| Risk | Dedup behavior interferes with packet 108's H-2 marker headers | Conflicting prompt structure | H-2 markers are first-line of prompt; H-7 dedup is a separate `## Previously-Emitted Findings` section; no conflict |
| Dependency | Existing `deep-review-state.jsonl` writer | Need to add signature field to records | Backward-compat: missing signature field treated as legacy record, no dedup applied |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Signature input — should we include `severity` (P0/P1/P2)? Or is severity orthogonal? Council to advise.
2. **Q2**: Bounded-evidence context window — 20 lines too narrow / too wide?
3. **Q3**: Should H-7 dedup also apply to deep-research? (Currently no — deep-research is single-dimension iterations; less prone to duplicate findings.)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Read deep-review SKILL.md + assets/prompt_pack_iteration.md.tmpl + 2 YAML files |
| 2 | Define + document H-7 signature scheme |
| 3 | Add `## Previously-Emitted Findings` block to prompt template (with marker for dispatcher to fill) |
| 4 | Add pre-dispatch signature-aggregation step to both YAMLs |
| 5 | Define + document H-9 bounded-evidence threshold + env-var override |
| 6 | Add MODE prefix when bounded-evidence active |
| 7 | Smoke test: 2-dimension dedup + large-packet bounded mode |
| 8 | Strict validate + commit + push |
<!-- /ANCHOR:iteration-plan -->
