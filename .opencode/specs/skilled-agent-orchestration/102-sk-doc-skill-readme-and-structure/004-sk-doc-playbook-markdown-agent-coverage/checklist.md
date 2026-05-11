---
title: "Verification Checklist: sk-doc playbook markdown-agent coverage"
description: "Verification checklist for adding @markdown × 3-CLI scenarios to the sk-doc manual testing playbook."
trigger_phrases:
  - "sk-doc playbook markdown agent"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage"
    last_updated_at: "2026-05-11T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 verification checklist"
    next_safe_action: "Mark items as verification completes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-004-sk-doc-playbook-markdown-agent-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-doc playbook markdown-agent coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md.
- [ ] CHK-002 [P0] Technical approach defined in plan.md.
- [ ] CHK-003 [P1] Dependencies identified and available (4 runtime agent mirrors present; `/create:changelog` reachable).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Three scenario files exist under `06--agent-dispatch/`.
- [ ] CHK-011 [P0] Each scenario YAML frontmatter has `execution_mode: dispatch_real` (distinguishes from routing-trace scenarios).
- [ ] CHK-012 [P1] Scenario shape mirrors SD-010 (sections present: Overview, Scenario Contract, Test Execution table, Setup, Expected Behavior, Success Criteria, Source Metadata).
- [ ] CHK-013 [P1] Each scenario uses the same task (`/create:changelog` for `sk-test-dummy v0.1.0`) so results are comparable across CLIs.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All 3 scenarios executed against their named CLI.
- [ ] CHK-021 [P0] Each evidence file contains a verdict footer line (PASS / PARTIAL / FAIL / SKIP).
- [ ] CHK-022 [P1] Each evidence file shows the `@markdown` agent received the task (routing trace).
- [ ] CHK-023 [P1] Each evidence file shows sk-doc resources were loaded (resource trace).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each scenario is classified as `dispatch_real` (not routing-trace) — verified via frontmatter `execution_mode`.
- [ ] CHK-FIX-002 [P0] Cross-consumer inventory: playbook index references the new section in Categories + Scenario Index.
- [ ] CHK-FIX-003 [P0] Consumer inventory: preamble Global Preconditions notes the execution-real distinction for section 6.
- [ ] CHK-FIX-004 [P0] Dispatch reliability: scenarios run sequentially (not in parallel) per memory hint on CLI dispatch unreliability.
- [ ] CHK-FIX-005 [P1] Matrix axes: CLI × task; row count = 3 (3 CLIs × 1 task).
- [ ] CHK-FIX-006 [P1] Each CLI's specific gotcha is handled in its Setup block (codex `service_tier=fast` + network-access; opencode `--pure` + `</dev/null`).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to actual transcript content, not summary paraphrase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets/tokens/API keys persisted into evidence transcripts.
- [ ] CHK-031 [P0] Stub skill `sk-test-dummy` lives only under `evidence/` or `/tmp/`, never under `.opencode/skills/` proper.
- [ ] CHK-032 [P1] Each scenario's prompt explicitly forbids installation into the skills tree.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md / plan.md / tasks.md continuity blocks synchronized to `completion_pct: 100`.
- [ ] CHK-041 [P1] `implementation-summary.md` populated with 3-row cross-CLI results table.
- [ ] CHK-042 [P2] Parent `102/spec.md` Phase Documentation Map references phase 4 / 004 row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Evidence files live under `004/evidence/` only.
- [ ] CHK-051 [P1] `scratch/` cleaned before completion (contains only `.gitkeep`).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 8 | 0/8 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [YYYY-MM-DD]
<!-- /ANCHOR:summary -->
