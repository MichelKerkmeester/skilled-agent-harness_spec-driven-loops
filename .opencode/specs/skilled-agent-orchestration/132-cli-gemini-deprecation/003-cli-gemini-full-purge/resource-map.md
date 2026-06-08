---
title: "Resource Map: Purge the cli-gemini executor everywhere outside specs"
description: "Canonical file inventory for the cli-gemini executor purge, grouped by skill and category with change-type (edited / deleted / renamed)."
trigger_phrases:
  - "resource map"
  - "path catalog"
  - "files touched"
  - "cli-gemini executor purge resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added resource map for cli-gemini executor purge"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "resource-map.md"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:8aefb199ff59828d9e963850e27963e10edd572844604107de457de767a41524"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: ~70 touched paths across source, tests, manifests, catalogs, playbooks, and changelogs (the 4 compiled `dist/matrix_runners/adapter-cli-gemini.*` are summarized as a grouped deletion row).
- **By category**: Documents=20, Skills=33, Specs=7, Scripts=4, Tests=6, Config=1, Meta=0, Removed=6.
- **Missing on disk**: 6 (the deleted matrix adapter source + test + 4 compiled dist files) plus 2 renamed paths whose old names no longer exist.
- **Scope**: every file edited, deleted, or renamed during the `cli-gemini` executor purge outside `specs/**`, grouped by skill; per-phase map for this phase child.
- **Generated**: 2026-06-08T18:30:00Z.

> **Action vocabulary**: `Edited` · `Deleted` · `Renamed` · `Created` · `Validated`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent by design).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:removed-runtime -->
## Removed Artifacts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts` | Deleted | MISSING | Purely-`cli-gemini` matrix adapter removed. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts` | Deleted | MISSING | Adapter test removed. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/matrix_runners/adapter-cli-gemini.*` | Deleted | MISSING | 4 compiled dist files (js/d.ts/map) removed alongside source. |
<!-- /ANCHOR:removed-runtime -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Feature catalogs, manual testing playbooks, references, and constitutional docs (grouped by skill in §Skills below; this section lists the matrix template README and the cross-cutting renamed handbacks).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/README.md` | Edited | OK | Matrix template README reflects 3 executors / 39 cells. |
| `.opencode/skills/sk-code-review/manual_testing_playbook/06--cross-cli-orchestration/cli-opencode-and-cli-codex-handback.md` | Renamed | OK | Was `...-cli-gemini-handback.md`; swapped `cli-gemini`→`cli-codex`; CR-018 kept; count 18. |
| `.opencode/skills/sk-code-review/manual_testing_playbook/manual_testing_playbook.md` | Edited | OK | Index updated for the renamed handback. |
| `.opencode/skills/sk-git/manual_testing_playbook/06--cross-cli-orchestration/cli-codex-and-cli-copilot-handback.md` | Renamed | OK | Was `cli-gemini-and-cli-copilot-handback.md`; swapped `cli-gemini`→`cli-codex`; GIT-022 kept; count 22. |
| `.opencode/skills/sk-git/manual_testing_playbook/manual_testing_playbook.md` | Edited | OK | Index updated for the renamed handback. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> Grouped by skill. Source `.ts`/`.cjs` and `*.vitest.ts` are listed again under §Scripts / §Tests per category-precedence; this section captures SKILL.md, READMEs, feature catalogs, playbooks, references, and manifests.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Edited | OK | Removed `cli-gemini` from kinds/flags/Extract; deleted Gemini sandbox-mode + whitelist code. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` | Edited | OK | Removed 5 `cli-gemini` map entries. |
| `.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-run.md` | Edited | OK | Fan-out feature doc drops `cli-gemini`. |
| `.opencode/skills/deep-improvement/SKILL.md` | Edited | OK | Removed `cli-gemini` from model-benchmark executor list. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/README.md` | Edited | OK | Dispatcher docs drop `cli-gemini`. |
| `.opencode/skills/deep-improvement/feature_catalog/04--model-benchmark-mode/model-dispatcher.md` | Edited | OK | Dispatcher feature doc drops `cli-gemini`. |
| `.opencode/skills/deep-improvement/feature_catalog/feature_catalog.md` | Edited | OK | Feature catalog aligned. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` | Edited | OK | Removed import / `MatrixExecutor` union / `EXECUTORS` array / switch case. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` | Edited | OK | Removed all `cli-gemini` cells + F11 applicability; 39 cells, valid JSON. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md` | Edited | OK | Matrix README reflects 3 executors / 39 cells. |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/cli-matrix-adapter-runners.md` | Edited | OK | Removed dead `matrix-adapter-gemini.vitest.ts` row + pre-existing dead copilot row. |
| `.opencode/skills/system-spec-kit/feature_catalog/24--local-llm-query-intelligence/category-overview.md` | Edited | OK | Category overview drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Edited | OK | Feature catalog aligned. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-matrix-adapter-runner-smoke.md` | Edited | OK | Smoke playbook now 3 files; F11 NA removed. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/spec-folder-literal-naming-cli-driven-slug.md` | Edited | OK | Drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/spec-folder-literal-naming-remediation-rule.md` | Edited | OK | Drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/query-intent-routing.md` | Edited | OK | Drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/README.md` | Edited | OK | Drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/concurrent-multi-ai-safety.md` | Edited | OK | Drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/cross-ai-memory-handoff.md` | Edited | OK | Drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | Edited | OK | Template guide drops `cli-gemini`. |
| `.opencode/skills/system-spec-kit/references/constitutional/cli-dispatch-skill-preload.md` | Edited | OK | Removed the `cli-gemini` sentence (CONSTITUTIONAL file). |
| `.opencode/skills/deep-research/references/protocol/loop_protocol.md` | Edited | OK | Loop protocol drops `cli-gemini`. |
| `.opencode/skills/deep-review/SKILL.md` | Edited | OK | Executor list drops `cli-gemini`. |
| `.opencode/skills/deep-review/references/protocol/loop_protocol.md` | Edited | OK | Loop protocol drops `cli-gemini`. |
| `.opencode/skills/deep-review/feature_catalog/01--loop-lifecycle/executor-selection-contract.md` | Edited | OK | Executor-selection contract drops `cli-gemini`. |
| `.opencode/skills/deep-review/feature_catalog/feature_catalog.md` | Edited | OK | Feature catalog aligned. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/spec.md` | Created | OK | Phase specification. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/plan.md` | Created | OK | Phase implementation plan. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/tasks.md` | Created | OK | Phase task ledger. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/checklist.md` | Created | OK | Phase verification checklist. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/decision-record.md` | Created | OK | Phase decision record (ADR-001..ADR-004). |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/implementation-summary.md` | Created | OK | Phase delivery summary. |
| `.opencode/specs/skilled-agent-orchestration/132-cli-gemini-deprecation/003-cli-gemini-full-purge/resource-map.md` | Created | OK | This resource map. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Executable source touched. `*.vitest.ts` are listed under §Tests per category-precedence.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Edited | OK | Removed map entry + if-block + simplified sandbox ternary. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Edited | OK | Removed `cli-gemini` from `KNOWN_EXECUTORS` and the case block. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/lib/profile-validator.cjs` | Edited | OK | Profile validator drops `cli-gemini`. |
| `.opencode/skills/deep-review/assets/review_mode_contract.yaml` | Edited | OK | Review mode contract drops `cli-gemini` (executor-selection contract source). |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/deep-loop-runtime/tests/unit/cli-matrix.vitest.ts` | Edited | OK | Deleted `cli-gemini` cases / swapped foils. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-audit.vitest.ts` | Edited | OK | Deleted `cli-gemini` cases / swapped foils. |
| `.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts` | Edited | OK | Deleted `cli-gemini` cases / swapped foils to `cli-claude-code`. |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Edited | OK | Deleted `cli-gemini` cases / swapped foils. |
| `.opencode/skills/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts` | Edited | OK | Remediation test drops `cli-gemini`; suite GREEN 25/25. |
| `.opencode/skills/system-spec-kit/scripts/tests/multi-ai-council-persist-artifacts.vitest.ts` | Edited | OK | Assertion swapped `cli-gemini`→`cli-opencode`; verified via direct node run. |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/scripts/tests/fixtures/multi-ai-council/council-output-full.md` | Edited | OK | Fixture swapped `cli-gemini`→`cli-opencode`. |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:changelogs -->
## 11. Changelogs

> Release-history changelogs edited per explicit operator approval (only `specs/**` exempt).

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/changelog/agent-orchestration/v2.4.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/cli-devin/changelog/v1.0.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/cli-devin/changelog/v1.0.5.2.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/cli-opencode/changelog/v1.0.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/deep-research/changelog/v1.8.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/deep-research/changelog/v1.9.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/deep-review/changelog/v1.5.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/deep-review/changelog/v1.6.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/deep-review/changelog/v1.7.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/sk-prompt-small-model/changelog/v0.2.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/system-skill-advisor/changelog/v0.4.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/system-spec-kit/changelog/v3.4.0.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
| `.opencode/changelog/system-spec-kit/changelog/v3.4.1.0.md` | Edited | OK | Removed `cli-gemini` executor wording. |
<!-- /ANCHOR:changelogs -->

---

<!-- ANCHOR:validation -->
## Validation Commands

| Command | Result | Note |
|---------|--------|------|
| `rg "cli-gemini\|cli_gemini" --glob '!specs/**' --glob '!.opencode/specs/**'` | PASS | Zero matches outside specs. |
| `glob .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.*` | PASS | No files found. |
| `glob .opencode/skills/system-spec-kit/mcp_server/dist/matrix_runners/adapter-cli-gemini.*` | PASS | No files found. |
| deep-loop-runtime unit suite | PASS | 213/214 (1 pre-existing loop-lock flake; 7/7 in isolation). |
| matrix-adapter suite | PASS | 13/13. |
| deep-improvement remediation suite | PASS | 25/25. |
| `python3 -m json.tool matrix-manifest.json` | PASS | Valid JSON; 13 features × 3 executors = 39 cells (no F8). |
| direct node run of council fixture/assertion | PASS | Swap verified (vitest SIGSEGVs under Node v25 in this env). |
<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Paths are relative to the repository root.
- The 4 compiled `dist/matrix_runners/adapter-cli-gemini.*` are grouped because every compiled artifact for the deleted adapter was removed together.
- Two renamed handbacks are listed under their new names; the old `...-cli-gemini-handback.md` / `cli-gemini-and-cli-copilot-handback.md` paths no longer exist.
- Gemini-as-runtime and Gemini-as-model paths are intentionally absent from this map; they are deferred to a separate decision (see `decision-record.md` ADR-003).
<!-- /ANCHOR:author-instructions -->
