---
title: "Tasks: Purge the cli-gemini executor everywhere outside specs"
description: "Executable task list for removing every cli-gemini executor reference from active source, tests, manifests, catalogs, playbooks, and changelogs."
trigger_phrases:
  - "cli-gemini executor purge tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/003-cli-gemini-full-purge"
    last_updated_at: "2026-06-08T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded completed task ledger for cli-gemini purge"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/**"
      - ".opencode/skills/deep-improvement/**"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:7a4745e36e96e4be9a07903c5e3aadc586bf3ea6878ab0cf8415b7f544485f04"
      session_id: "gemini-deprecation-phase3-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Purge the cli-gemini executor everywhere outside specs

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Inventory every `cli-gemini`/`cli_gemini` executor reference outside `specs/**`. [EVIDENCE: global `rg "cli-gemini|cli_gemini"` mapped references across deep-loop-runtime, deep-improvement, system-spec-kit, deep-research, deep-review, sk-code-review, sk-git, and changelogs]
- [x] T002 Classify each reference as delete (pure-Gemini) or swap (mixed cross-CLI). [EVIDENCE: matrix adapter + test classified delete; council fixture, CR-018, GIT-022 classified swap]
- [x] T003 Record the matrix recount target. [EVIDENCE: 13 features × 3 executors = 39 cells, no F8]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Edit deep-loop-runtime `executor-config.ts`: remove `cli-gemini` from EXECUTOR_KINDS and flag-support map, narrow `ExecutorNotWiredError` Extract to `cli-claude-code`, delete `GeminiSandboxMode`/`GEMINI_SUPPORTED_MODELS`/`GeminiSupportedModel`/`resolveGeminiSandboxMode` and the model-whitelist branch. [EVIDENCE: deep-loop-runtime suite GREEN 213/214]
- [x] T005 Edit deep-loop-runtime `executor-audit.ts` (5 `cli-gemini` map entries) and `scripts/fanout-run.cjs` (map entry, if-block, simplified sandbox ternary). [EVIDENCE: `executor-audit.vitest.ts` and `fanout-run.vitest.ts` pass]
- [x] T006 Update deep-loop-runtime unit tests `tests/unit/{cli-matrix,executor-audit,executor-config,fanout-run}.vitest.ts`: delete `cli-gemini` cases or swap foils to `cli-devin`/`cli-opencode`/`cli-claude-code`; update `feature_catalog/09--fanout/fanout-run.md`. [EVIDENCE: suite GREEN 213/214; 1 fail is pre-existing loop-lock cross-process flake, passes 7/7 in isolation]
- [x] T007 Edit deep-improvement model-benchmark: `dispatch-model.cjs` (KNOWN_EXECUTORS + case), `profile-validator.cjs`, `remediation.vitest.ts`, `SKILL.md`, `feature_catalog/04--model-benchmark-mode/model-dispatcher.md`, `feature_catalog/feature_catalog.md`, `README.md`. [EVIDENCE: remediation suite GREEN 25/25]
- [x] T008 Delete system-spec-kit matrix adapter `adapter-cli-gemini.ts`, test `matrix-adapter-gemini.vitest.ts`, and the 4 compiled `dist/matrix_runners/adapter-cli-gemini.*`. [EVIDENCE: `glob` for those paths returns no files]
- [x] T009 Edit `run-matrix.ts` (import/MatrixExecutor union/EXECUTORS array/switch case), `matrix-manifest.json` (all `cli-gemini` cells + F11 applicability), matrix `README.md`, `templates/README.md`, and `feature_catalog/16--tooling-and-scripts/cli-matrix-adapter-runners.md` (removed dead `matrix-adapter-gemini.vitest.ts` row + pre-existing dead copilot row). [EVIDENCE: matrix-adapter suite GREEN 13/13; manifest valid JSON; 39 cells]
- [x] T010 Swap `cli-gemini`→`cli-opencode` in council fixture `council-output-full.md` and the assertion in `multi-ai-council-persist-artifacts.vitest.ts`. [EVIDENCE: logic-verified via direct node run; vitest harness SIGSEGVs under Node v25 in this env]
- [x] T011 Update system-spec-kit docs/playbooks (12 files) including feature catalogs, manual testing playbooks (with file-count self-check), `references/templates/template_guide.md`, and constitutional `cli-dispatch-skill-preload.md`. [EVIDENCE: playbook smoke count 5→3 files, F11 NA removed; constitutional sentence removed]
- [x] T012 Update deep-research/deep-review docs (5 files): deep-research loop protocol; deep-review SKILL.md, loop protocol, executor-selection contract, feature catalog. [EVIDENCE: docs no longer list `cli-gemini` executor]
- [x] T013 Rename mixed cross-CLI handbacks: sk-code-review `...cli-opencode-and-cli-gemini-handback.md`→`...-cli-codex-handback.md` (CR-018 kept, count 18) and sk-git `cli-gemini-and-cli-copilot-handback.md`→`cli-codex-and-cli-copilot-handback.md` (GIT-022 kept, count 22); update both indexes. [EVIDENCE: playbook counts unchanged at 18 and 22]
- [x] T014 Edit ~13 release-history changelogs naming `cli-gemini` as an executor (operator-approved). [EVIDENCE: agent-orchestration, cli-devin, cli-opencode, deep-research, deep-review, sk-prompt-models, system-skill-advisor, system-spec-kit changelogs updated]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Run targeted suites. [EVIDENCE: deep-loop-runtime 213/214 (1 pre-existing flake), matrix-adapter 13/13, remediation 25/25 GREEN; re-run centrally]
- [x] T016 Validate `matrix-manifest.json` and confirm cell count. [EVIDENCE: valid JSON; 13 features × 3 executors = 39 cells, no F8]
- [x] T017 Run global purge proof. [EVIDENCE: `rg "cli-gemini|cli_gemini"` excluding `specs/**` returns zero matches]
- [x] T018 Confirm renamed playbook counts unchanged. [EVIDENCE: CR-018 count 18, GIT-022 count 22 after renames]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence. [EVIDENCE: T001-T018 are checked with evidence]
- [x] No `[B]` blocked tasks remaining. [EVIDENCE: no tasks use `[B]`]
- [x] Global `cli-gemini`/`cli_gemini` search outside specs is clean. [EVIDENCE: zero matches]
- [x] Targeted suites GREEN and matrix recounted to 39 cells. [EVIDENCE: 213/214, 13/13, 25/25; 39 cells]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:cross-refs -->
