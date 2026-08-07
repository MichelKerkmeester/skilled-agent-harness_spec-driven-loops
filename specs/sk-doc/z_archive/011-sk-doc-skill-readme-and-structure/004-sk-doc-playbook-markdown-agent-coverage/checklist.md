---
title: "Verification Checklist: sk-doc playbook markdown-agent coverage"
description: "Verification checklist for adding @markdown × 3-CLI scenarios to the sk-doc manual testing playbook."
trigger_phrases:
  - "sk-doc playbook markdown agent"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/004-sk-doc-playbook-markdown-agent-coverage"
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

- [x] CHK-001 [P0] Requirements documented in spec.md. - Evidence: spec.md authored at 004/spec.md with full scope, requirements, success criteria.
- [x] CHK-002 [P0] Technical approach defined in plan.md. - Evidence: plan.md authored at 004/plan.md with dispatch shapes and architecture pattern.
- [x] CHK-003 [P1] Dependencies identified and available (4 runtime agent mirrors present; `/create:changelog` reachable). - Evidence: 4 runtime agent mirrors verified; /create:changelog command at .opencode/commands/create/changelog.md exists.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Three scenario files exist under `06--agent-dispatch/`. - Evidence: 3 scenarios created under 06--agent-dispatch/ (find returned 3 .md files).
- [x] CHK-011 [P0] Each scenario YAML frontmatter has `execution_mode: dispatch_real` (distinguishes from routing-trace scenarios). - Evidence: each scenario frontmatter contains `execution_mode: dispatch_real`.
- [x] CHK-012 [P1] Scenario shape mirrors SD-010 (sections present: Overview, Scenario Contract, Test Execution table, Setup, Expected Behavior, Success Criteria, Source Metadata). - Evidence: SD-018/019/020 follow SD-010 template shape with Overview / Scenario Contract / Test Execution / Setup / Expected Behavior / Success Criteria / Source Metadata sections.
- [x] CHK-013 [P1] Each scenario uses the same task (`/create:changelog` for `sk-test-dummy v0.1.0`) so results are comparable across CLIs. - Evidence: same /create:changelog sk-test-dummy v0.1.0 prompt across all three scenarios.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 3 scenarios executed against their named CLI. - Evidence: 3 dispatches executed sequentially 2026-05-11 via cli-claude-code, cli-codex, cli-opencode; evidence files persisted under 004/evidence/.
- [x] CHK-021 [P0] Each evidence file contains a verdict footer line (PASS / PARTIAL / FAIL / SKIP). - Evidence: SD-018 PASS, SD-019 FAIL, SD-020 PASS verdict footers in evidence files.
- [x] CHK-022 [P1] Each evidence file shows the `@markdown` agent received the task (routing trace). - Evidence: SD-018 (3 hits) and SD-020 (8 hits) show @markdown invocation; SD-019 surfaces routing gap explicitly.
- [x] CHK-023 [P1] Each evidence file shows sk-doc resources were loaded (resource trace). - Evidence: SD-018 (2 resource hits) and SD-020 (8 resource hits) show sk-doc resources loaded.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each scenario is classified as `dispatch_real` (not routing-trace) — verified via frontmatter `execution_mode`. - Evidence: scenarios classified dispatch_real per execution_mode frontmatter; SD-019 reclassified as instance-only documented limitation in 005.
- [x] CHK-FIX-002 [P0] Cross-consumer inventory: playbook index references the new section in Categories + Scenario Index. - Evidence: 06--agent-dispatch added to manual_testing_playbook.md Categories table and Scenario Index.
- [x] CHK-FIX-003 [P0] Consumer inventory: preamble Global Preconditions notes the execution-real distinction for section 6. - Evidence: manual_testing_playbook.md Global Preconditions §6 explicitly distinguishes section 6 execution-real from sections 1-5 routing-trace.
- [x] CHK-FIX-004 [P0] Dispatch reliability: scenarios run sequentially (not in parallel) per memory hint on CLI dispatch unreliability. - Evidence: 3 scenarios dispatched sequentially (one after another), not in parallel.
- [x] CHK-FIX-005 [P1] Matrix axes: CLI × task; row count = 3 (3 CLIs × 1 task). - Evidence: matrix axes CLI × task; 3 CLIs × 1 task = 3 rows in results table.
- [x] CHK-FIX-006 [P1] Each CLI's specific gotcha is handled in its Setup block (codex `service_tier=fast` + network-access; opencode `--pure` + `</dev/null`). - Evidence: codex scenario uses `service_tier=fast` + `sandbox_workspace_write.network_access=true`; opencode scenario uses `--pure` + `</dev/null`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to actual transcript content, not summary paraphrase. - Evidence: each evidence file contains verbatim transcript content; no paraphrase summaries.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets/tokens/API keys persisted into evidence transcripts. - Evidence: SD-018/019/020 evidence files reviewed; no secrets, tokens, or API keys persisted.
- [x] CHK-031 [P0] Stub skill `sk-test-dummy` lives only under `evidence/` or `/tmp/`, never under `.opencode/skills/` proper. - Evidence: stub sk-test-dummy not installed under .opencode/skills/; output files only at /tmp/.
- [x] CHK-032 [P1] Each scenario's prompt explicitly forbids installation into the skills tree. - Evidence: each scenario prompt explicitly forbids installation into the skills tree.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md / plan.md / tasks.md continuity blocks synchronized to `completion_pct: 100`. - Evidence: spec.md / plan.md / tasks.md continuity blocks updated to completion_pct: 100 in 005 final pass.
- [x] CHK-041 [P1] `implementation-summary.md` populated with 3-row cross-CLI results table. - Evidence: implementation-summary.md results table populated with 3 rows (SD-018/019/020) + verdict + key evidence-file path each.
- [x] CHK-042 [P2] Parent `102/spec.md` Phase Documentation Map references phase 4 / 004 row. - Evidence: parent 102/spec.md Phase Documentation Map references phase 4 row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence files live under `004/evidence/` only. - Evidence: evidence/ directory contains only SD-018-cli-claude-code.txt, SD-019-cli-codex.txt, SD-020-cli-opencode.txt.
- [x] CHK-051 [P1] `scratch/` cleaned before completion (contains only `.gitkeep`). - Evidence: scratch/ contains only .gitkeep.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-11
<!-- /ANCHOR:summary -->
