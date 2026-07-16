---
title: "Feature Specification: Review Registry and Metadata Backfill"
description: "Disposition glm's 9 unset review findings post-007-fan-out-hardening; backfill root+008-parent graph-metadata.json key_files/last_active_child_id; fix description.json truncation."
trigger_phrases:
  - "review registry disposition"
  - "graph metadata key_files backfill"
  - "description.json truncation fix"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/006-review-registry-and-metadata-backfill"
    last_updated_at: "2026-07-01T07:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from research.md F-004/G-002 and F-009/G-006 (Tier1 #9,#10)"
    next_safe_action: "Author plan.md and tasks.md, then dispatch implementation to MiMo v2.5 ultraspeed"
    blockers: []
    key_files:
      - "review/lineages/glm/deep-review-findings-registry.json"
      - "graph-metadata.json"
      - "008-loop-systems-remediation/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Review Registry and Metadata Backfill

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 6 |
| **Predecessor** | 005-packet-identity-cleanup |
| **Successor** | 007-parent-scaffold-and-governance-docs |
| **Handoff Criteria** | glm's review registry findings each carry an explicit disposition + evidence; root and 008-parent graph-metadata.json key_files reflect real implementation surfaces; description.json truncation fixed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`review/lineages/glm/deep-review-findings-registry.json` has 9 findings whose `disposition` field still reads `"active"`, even though `008-loop-systems-remediation/007-fan-out-hardening` (shipped, 549-test-suite-verified) fixed 6 of the underlying P1s plus the P2 — the registry JSON was never updated to reflect the fix, only the prose implementation-summary was (`research/research_archive/20260701T071133Z-gen1/research.md` §4.2, F-004/G-002). Separately, both the root packet's `graph-metadata.json` (`key_files: ["001-reference-research/research/research.md", "spec.md"]`) and `008-loop-systems-remediation/graph-metadata.json` (`key_files` lists only doc filenames like `spec.md`/`plan.md`, omitting the real runtime surfaces `fanout-run.cjs`/`fanout-merge.cjs`/`cli-guards.cjs` that `008`'s own spec.md frontmatter already names correctly) are stale — despite a prior claim that "62 folders refreshed" during a metadata regen. `description.json` at the root is also confirmed truncated mid-word ("resilienc...") (§4.2, F-009/G-006).

### Purpose
Disposition all 9 glm findings with resolved/still-active/accepted-risk + evidence; regenerate root and 008-parent graph-metadata.json so `key_files` reflects real implementation surfaces; fix whatever generates `description.json` so it stops truncating mid-word.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- For each of glm's 9 findings (P1-001 through P1-007, P1-011-001, P2-009-001): check against `008-loop-systems-remediation/007-fan-out-hardening`'s actual shipped scope and set `disposition` to `resolved` (with the fixing commit/file reference), `active` (if genuinely still open — expect P1-006/P1-007-adjacent items already fixed via 009's own scaffolding earlier in this remediation phase), or `accepted-risk` (if a deliberate scope-boundary decision was made, e.g. the known-limitation in 007-fan-out-hardening's own summary).
- Regenerate `graph-metadata.json` `key_files` for the root packet and `008-loop-systems-remediation` to include the real implementation surfaces named in each folder's own `spec.md` frontmatter `key_files`.
- Set `last_active_child_id` where currently `null` and a real active/most-recent child is knowable.
- Find and fix the `description.json` mid-word truncation bug (check `generate-description.ts`/`.js` for a length-based truncation that doesn't respect word boundaries; generation-2 research root-caused this to a fixed-length slice in `generate-context.js` without word-boundary clamping — a framework-level bug, not packet-specific, so the fix should live at that generator level, not just be patched per-packet).
- **[Added per generation-2 research, R2-GPT-005/B-004]** The registry-disposition gap is confirmed systemic, not glm-specific: codex's review registry (previously reported as "0 findings despite 50 iterations") has since been rebuilt and now shows 5 real findings — also still undispositioned. Disposition codex's 5 findings using the same evidence-first process as glm's 9.

### Out of Scope
- Re-running the deep-review lineages themselves (that's a separate, much larger undertaking, not part of this backlog item).
- Building `reconstructResearchRegistryFromState` (the research-side counterpart to the review-only `reconstructReviewRegistryFromState` fix already shipped in `009/001`) — generation-2 research flagged this as a related, real gap (a leaf-only research lineage that crashes before writing any registry would still be silently dropped by `mergeResearchRegistries`), but it is new runtime code in `fanout-merge.cjs`, not a data-backfill task — track separately as a candidate `009/011` item rather than scope-creeping this backfill-only phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `review/lineages/glm/deep-review-findings-registry.json` | Modify | Disposition all 9 findings |
| `graph-metadata.json` (root) | Modify | `key_files`, `last_active_child_id` |
| `008-loop-systems-remediation/graph-metadata.json` | Modify | `key_files` |
| `.opencode/skills/system-spec-kit/scripts/spec-folder/generate-description.ts` | Modify | Fix mid-word truncation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 9 glm findings have an explicit, evidence-backed disposition | No finding in the registry still reads `"active"` without a documented reason in the implementation summary |
| REQ-002 | Root and 008-parent `key_files` reflect real implementation surfaces | Both `graph-metadata.json` files list the actual runtime scripts named in the corresponding `spec.md` frontmatter |
| REQ-003 | `description.json` no longer truncates mid-word | New test/fixture: a description string with a word boundary right at the truncation length is not cut mid-word |

### P1 — Required (complete OR user-approved deferral)

None beyond P0 for this phase.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `python3 -c "import json; ..."` spot-check confirms all 9 glm findings have non-`"active"` OR explicitly-justified-`"active"` dispositions.
- **SC-002**: Re-running the description generator against the root packet no longer produces a truncated mid-word string.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Judgment call | Disposition requires cross-checking each finding against 007-fan-out-hardening's actual scope, not just assuming all fixed | Wrong disposition would misrepresent risk | Cite the exact file/line evidence for each disposition decision in the implementation summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by `research/research_archive/20260701T071133Z-gen1/research.md` §4.2 (F-004/G-002, F-009/G-006).
<!-- /ANCHOR:questions -->
