---
title: "Resource Map: 116/008 Playbooks and Default Calibration"
description: "Deferred resource map for the 116 deep-review complexity arc, rewritten with final post-118 deep-loop-runtime file locations."
trigger_phrases:
  - "116/008 resource map"
  - "review-depth resource map"
  - "deep-review complexity path catalog"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration"
    last_updated_at: "2026-05-22T19:23:44Z"
    last_updated_by: "gpt-5.5-codex"
    recent_action: "Created deferred resource map using final post-118 file locations."
    next_safe_action: "Use this map as the 116 closeout path ledger."
    blockers: []
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v2.2 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 19
- **By category**: Documents=8, Skills=1, Scripts=1, Tests=4, Specs=5
- **Missing on disk**: 0
- **Scope**: deferred 116/008 path ledger for deep-review files touched by the 116 arc, expressed with final post-118 locations after the runtime migration.
- **Generated**: 2026-05-22T19:23:44Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> Zero-entry categories are omitted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/references/state_format.md` | Updated | OK | 116 contract vocabulary and state-shape reference. |
| `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl` | Updated | OK | Review-depth prompt contract surface. |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/058-validator-warn-rollout.md` | Created | OK | Manual scenario for warn rollout. |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/059-validator-strict-v2.md` | Created | OK | Manual scenario for strict v2 validation. |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/060-reducer-search-debt.md` | Created | OK | Manual scenario for reducer search debt. |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/061-stop-gate-candidate-coverage.md` | Created | OK | Manual scenario for candidate coverage STOP gate. |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/062-stop-gate-graphless-fallback.md` | Created | OK | Manual scenario for graphless fallback STOP gate. |
| `.opencode/skills/deep-review/manual_testing_playbook/08--review-depth-v2-rollout/063-graph-vocabulary.md` | Created | OK | Manual scenario for graph vocabulary persistence. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/SKILL.md` | Updated | OK | Phase H bumped `1.3.2.0` to `1.3.3.0`; 118/008 later bumps frontmatter to `1.4.0.0`. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/spec.md` | Updated | OK | Phase H scope and default-calibration deferral. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/plan.md` | Updated | OK | Phase H implementation plan. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/tasks.md` | Updated | OK | Phase H task ledger. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/checklist.md` | Created | OK | Phase H validation checklist. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration/implementation-summary.md` | Updated | OK | Phase H evidence and known limitations. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-review/scripts/reduce-state.cjs` | Updated | OK | Reducer remained in deep-review after 118; `review-depth-reducer.vitest.ts` stays with the MCP server test runner because this script did not move. |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-validator.vitest.ts` | Moved | OK | Post-118 location; was under `system-spec-kit/mcp_server/tests/deep-loop/`. |
| `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-convergence.vitest.ts` | Moved | OK | Post-118 location; was under `system-spec-kit/mcp_server/tests/deep-loop/`. |
| `.opencode/skills/deep-loop-runtime/tests/integration/review-depth-graph.vitest.ts` | Moved | OK | Post-118 location; was under `system-spec-kit/mcp_server/tests/deep-loop/`. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` | Cited | OK | Retained test for `.opencode/skills/deep-review/scripts/reduce-state.cjs`. |
<!-- /ANCHOR:tests -->
