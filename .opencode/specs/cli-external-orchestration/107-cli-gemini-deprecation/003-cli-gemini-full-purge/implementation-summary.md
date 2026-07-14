---
title: "Implementation Summary: Purge the cli-gemini executor everywhere outside specs"
description: "Implementation summary for the cli-gemini executor purge across source, tests, manifests, catalogs, playbooks, and changelogs."
trigger_phrases:
  - "cli-gemini executor purge implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed cli-gemini executor purge"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/**"
      - ".opencode/skills/deep-improvement/**"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:6183b8eaf1553d2f4d33d3960e3108150bf8a3da7a5d7fa3d2b59b6e78d9dc88"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Purge cli-gemini executor refs outside specs."
      - "Edit release-history changelogs."
      - "Defer Gemini runtime and model surfaces."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge |
| **Completed** | Yes |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase removed every `cli-gemini` executor reference outside `specs/**`. After phase 001 deleted the `cli-gemini` SKILL and the project `.gemini` runtime surface, and phase 002 cleaned the command-layer YAML and docs, `cli-gemini` still remained wired as a first-class executor across many skills' source, tests, manifests, feature catalogs, testing playbooks, and changelogs. This phase purged that executor surface while preserving cross-CLI coverage and leaving the separate Gemini runtime and model surfaces intact.

### Scope By Skill

- **deep-loop-runtime** (suite GREEN 213/214): `lib/deep-loop/executor-config.ts` (removed `cli-gemini` from `EXECUTOR_KINDS` and the flag-support map, narrowed the `ExecutorNotWiredError` Extract to `cli-claude-code`, deleted `GeminiSandboxMode`/`GEMINI_SUPPORTED_MODELS`/`GeminiSupportedModel`/`resolveGeminiSandboxMode` and the model-whitelist branch); `lib/deep-loop/executor-audit.ts` (5 map entries); `scripts/fanout-run.cjs` (map entry + if-block + simplified sandbox ternary); unit tests `tests/unit/{cli-matrix,executor-audit,executor-config,fanout-run}.vitest.ts` (deleted `cli-gemini` cases / swapped foils to `cli-devin`/`cli-opencode`/`cli-claude-code`); `feature_catalog/09--fanout/fanout-run.md`. The single failing test is a pre-existing `loop-lock` cross-process flake that passes 7/7 in isolation.
- **deep-improvement** (remediation suite GREEN 25/25): `scripts/model-benchmark/dispatch-model.cjs` (`KNOWN_EXECUTORS` + case block); `scripts/model-benchmark/lib/profile-validator.cjs`; `scripts/model-benchmark/tests/remediation.vitest.ts`; `SKILL.md`; `feature_catalog/04--model-benchmark-mode/model-dispatcher.md`; `feature_catalog/feature_catalog.md`; `scripts/model-benchmark/README.md`.
- **system-spec-kit matrix tooling** (matrix-adapter suite GREEN 13/13; matrix now 3 executors × 13 features = 39 cells, no F8): DELETED `mcp_server/matrix_runners/adapter-cli-gemini.ts`, `mcp_server/tests/matrix-adapter-gemini.vitest.ts`, and 4 compiled `dist/matrix_runners/adapter-cli-gemini.*`; edited `mcp_server/matrix_runners/run-matrix.ts` (import / `MatrixExecutor` union / `EXECUTORS` array / switch case), `mcp_server/matrix_runners/matrix-manifest.json` (removed all `cli-gemini` cells + F11 applicability), `mcp_server/matrix_runners/README.md`, `mcp_server/matrix_runners/templates/README.md`, `feature_catalog/16--tooling-and-scripts/cli-matrix-adapter-runners.md` (removed a dead `matrix-adapter-gemini.vitest.ts` validation row and a pre-existing dead copilot row).
- **system-spec-kit council fixture** (logic-verified): swapped `cli-gemini`→`cli-opencode` in `scripts/tests/fixtures/multi-ai-council/council-output-full.md` and the assertion in `scripts/tests/multi-ai-council-persist-artifacts.vitest.ts`. The vitest harness SIGSEGVs under Node v25 in this environment, so the swap was verified via a direct node run.
- **system-spec-kit docs/playbooks** (12 files): feature catalog (`category-overview.md`, `feature_catalog.md`); manual testing playbooks (`cli-matrix-adapter-runner-smoke.md` [now 3 files, F11 NA removed], `spec-folder-literal-naming-cli-driven-slug.md`, `spec-folder-literal-naming-remediation-rule.md`, `22/query-intent-routing.md`, `24/README.md`, `24/concurrent-multi-ai-safety.md`, `24/cross-ai-memory-handoff.md`); `references/templates/template_guide.md`; constitutional `cli-dispatch-skill-preload.md` (removed the `cli-gemini` sentence).
- **deep-research / deep-review docs** (5 files): deep-research `references/protocol/loop_protocol.md`; deep-review `SKILL.md`, `references/protocol/loop_protocol.md`, `feature_catalog/01--loop-lifecycle/executor-selection-contract.md`, `feature_catalog/feature_catalog.md`.
- **sk-code-review playbook**: RENAMED `manual_testing_playbook/06--cross-cli-orchestration/cli-opencode-and-cli-gemini-handback.md` → `...-cli-codex-handback.md` (swapped `cli-gemini`→`cli-codex`; CR-018 ID kept; count stays 18); updated `manual_testing_playbook.md` index.
- **sk-git playbook**: RENAMED `manual_testing_playbook/06--cross-cli-orchestration/cli-gemini-and-cli-copilot-handback.md` → `cli-codex-and-cli-copilot-handback.md` (GIT-022 kept; count stays 22); updated index.
- **changelogs** (~13 files, edited per explicit operator approval): `agent-orchestration/v2.4.0.0.md`; `cli-devin/changelog/{v1.0.0.0,v1.0.5.2}.md`; `cli-opencode/changelog/v1.0.0.0.md`; `deep-research/changelog/{v1.8.0.0,v1.9.0.0}.md`; `deep-review/changelog/{v1.5.0.0,v1.6.0.0,v1.7.0.0}.md`; `sk-prompt-models/changelog/v0.2.0.0.md`; `system-skill-advisor/changelog/v0.4.0.md`; `system-spec-kit/changelog/{v3.4.0.0,v3.4.1.0}.md`.

The canonical file inventory with per-file change types lives in `resource-map.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work proceeded in three passes: inventory and delete/swap classification of every `cli-gemini` executor reference outside `specs/**`; source/test/manifest edits (executor unions narrowed, sandbox/whitelist code removed, the matrix adapter deleted with its compiled dist, the matrix recounted to 39 cells); and docs/playbook/changelog edits with mixed cross-CLI scenarios swapped rather than deleted.

Delete-vs-swap discipline drove the classification: purely-`cli-gemini` artifacts (the matrix adapter and its test) were deleted, while mixed cross-CLI artifacts (the council fixture, CR-018, GIT-022) were swapped to `cli-opencode`/`cli-codex` so coverage of the surviving CLI was preserved and their IDs and counts stayed stable.

Rollback is straightforward from the working-tree diff: restore the deleted matrix adapter, test, and dist, and revert the edited source, docs, and changelogs. No database migration, dependency change, feature flag, or service rollout is involved. Gemini-as-runtime (hooks, runtime-detection, mirrors) and Gemini-as-model (`gemini-flash`, `gemini-3.1-pro`) were intentionally left untouched and flagged for a separate decision.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Swap-not-delete for mixed cross-CLI artifacts | Preserve coverage of the surviving CLI in the council fixture, CR-018, and GIT-022 by substituting `cli-codex`/`cli-opencode`; delete only purely-`cli-gemini` artifacts. |
| Edit release-history changelogs | The operator directed "purge everything" with only `specs/**` exempt. |
| Executor-only boundary | Remove the `cli-gemini` executor/skill surface; defer Gemini-as-runtime (~198 files) and Gemini-as-model to a separate decision. |
| Recount the matrix to 39 cells | 13 features × 3 executors = 39 cells, no F8, keeps the manifest internally consistent. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Global executor-reference search | PASS: `rg "cli-gemini|cli_gemini"` excluding `specs/**` returned zero matches. |
| deep-loop-runtime suite | PASS: 213/214 GREEN; the 1 failure is a pre-existing `loop-lock` cross-process flake that passes 7/7 in isolation. |
| matrix-adapter suite | PASS: 13/13 GREEN. |
| deep-improvement remediation suite | PASS: 25/25 GREEN. |
| Matrix recount | PASS: 13 features × 3 executors = 39 cells, no F8. |
| Matrix manifest JSON | PASS: `matrix-manifest.json` parses as valid JSON. |
| Matrix adapter deletion | PASS: `glob` for `adapter-cli-gemini.ts`, `matrix-adapter-gemini.vitest.ts`, and 4 compiled `dist/matrix_runners/adapter-cli-gemini.*` returned no files. |
| Council fixture swap | PASS: logic-verified via direct node run (vitest SIGSEGVs under Node v25 in this env). |
| Playbook rename counts | PASS: CR-018 count stays 18; GIT-022 count stays 22. |
| Deferred surfaces intact | PASS: Gemini runtime/model references were not edited. |

> Note: the targeted suites and validation are re-run centrally by the orchestrator after metadata generation. This summary records the results observed during implementation.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pre-existing flake:** deep-loop-runtime reports 213/214 because of a cross-process `loop-lock` flake unrelated to this change; it passes 7/7 in isolation.
2. **Node v25 vitest instability:** the multi-AI council persistence vitest harness SIGSEGVs under Node v25 in this environment, so the fixture swap was verified by a direct node run instead of the vitest runner.
3. **Deferred Gemini surfaces:** Gemini-as-runtime (~198 files of hooks/runtime-detection/mirrors) and Gemini-as-model (`gemini-flash`, `gemini-3.1-pro`) remain intact and are flagged for a separate decision.
<!-- /ANCHOR:limitations -->
