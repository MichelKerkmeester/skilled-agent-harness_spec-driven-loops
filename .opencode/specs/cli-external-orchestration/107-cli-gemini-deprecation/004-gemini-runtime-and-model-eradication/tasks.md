---
title: "Tasks: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Executable task list for removing every Gemini host-runtime and Gemini-model reference from active source, tests, manifests, catalogs, playbooks, docs, and changelogs in four verified waves."
trigger_phrases:
  - "gemini runtime eradication tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded completed task ledger for Gemini runtime+model eradication"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/skills/system-skill-advisor/**"
      - ".opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:1a7dcb1e24fb6d4c5ce0b7502f7a44f1ba1722f133dc430482b52347ff4ce504"
      session_id: "gemini-deprecation-phase4-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Eradicate Gemini as a host runtime and as a model everywhere outside specs

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

- [x] T001 Inventory every Gemini runtime + model reference outside `specs/**`. [EVIDENCE: global `rg "gemini"` mapped references across system-spec-kit, system-code-graph, system-skill-advisor, deep-loop-runtime, deep-improvement, sk-prompt-models, sk-doc, cli-*, plugins, scripts, docs, and changelogs]
- [x] T002 Classify each reference delete (pure-Gemini), modify (mixed surface), or rewrite (comparison content). [EVIDENCE: hook subsystems + 4 runtime docs classified delete; runtime enums/tuples/scripts classified modify; `claude_tools.md` + dashboard sample classified rewrite]
- [x] T003 Note the concurrent `devin`-removal session and the two files to defer to it. [EVIDENCE: `settings-driven-invocation-parity.vitest.ts` (negative assertions) and `references/decisions/deferred_decisions.md` (historical) deferred]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Wave 1 system-spec-kit `mcp_server`: DELETE `hooks/gemini/`; remove `gemini-cli` from `lib/runtime-detection.ts` `RuntimeId` + detection; update `hooks/index.ts`, `hooks/README.md`, `tests/fixtures/runtime-fixtures.ts`, and tests `runtime-detection`, `cross-runtime-fallback`, `hook-session-start`, `hooks-reexport-parity`, `hooks-shared-provenance`. [EVIDENCE: 5 suites GREEN, 59 passed / 1 pre-existing copilot skip; tsc clean]
- [x] T005 Wave 1 system-code-graph `mcp_server`: remove `gemini-cli` from `lib/runtime-detection.ts` + test. [EVIDENCE: 14/14 GREEN]
- [x] T006 Wave 1 system-skill-advisor: DELETE `hooks/gemini/` + its test + 2 Gemini docs; de-index `feature_catalog` (37 to 36) and `manual_testing_playbook` (46 to 45) including the enforcing vitest. [EVIDENCE: catalog 36, playbook 45; enforcing vitest GREEN]
- [x] T007 Wave 1 model refs: remove `gemini-flash` from deep-loop-runtime fallback-router + test (8/8 GREEN); sk-prompt-models `model-profiles.json` / `per-model-budgets.json` / refs; cli-devin `references/quota-fallback.md`. [EVIDENCE: fallback-router 8/8; `rg "gemini-flash"` clean in those surfaces]
- [x] T008 Wave 2 system-skill-advisor runtime-VALUE: remove Gemini from `advisor-runtime-values.ts` canonical tuple, `metrics.ts`, `schemas/advisor-tool-schemas.ts`, `plugin_bridges/mk-skill-advisor-bridge.mjs`, `scripts/skill_advisor.py`, tests (runtime-parity, advisor-observability, plugin-bridge), and the bench. [EVIDENCE: concurrent session removed `devin` from the same tuple; merged result has gemini fully gone; parity/observability/plugin-bridge GREEN]
- [x] T009 Wave 2 system-spec-kit scripts: edit `scripts/lib/cli-capture-shared.ts`, `shared/gate-3-classifier.ts` (docs-comment `GEMINI.md` token only, no classification change), `scripts/utils/source-capabilities.ts`, `scripts/utils/input-normalizer.ts`, `scripts/resource-map/extract-from-evidence.cjs`, + tests `stdio-logging-safety`, `test-extractors-loaders`, `validation-rule-metadata`. [EVIDENCE: 8/8 vitest + 267/267 extractors GREEN]
- [x] T010 Wave 2 misc code: deep-loop-runtime `executor-config.ts` (residual comment) + `SKILL.md` + feature_catalog fanout-executor list; deep-improvement `promote-candidate.cjs`; sk-doc `validate-doc-model-refs.js`; `.opencode/plugins/session-cleanup.js`; cli-devin `assets/per-model-budgets.json`. [EVIDENCE: promote vitest 3/3 GREEN]
- [x] T011 Wave 3 system-spec-kit catalog/playbook: DELETE 4 Gemini-runtime docs (`feature_catalog/22--context-preservation/gemini-cli-hooks.md`, `manual_testing_playbook/22--context-preservation/gemini-cli-hooks.md`, `manual_testing_playbook/16--tooling-and-scripts/gemini-runtime-path-resolution.md`, `manual_testing_playbook/18--ux-hooks/F--comment-hygiene-gemini-hook.md`); de-index; correct count self-checks (playbook 391 to 387, catalog 325 to 324). [EVIDENCE: count self-check 387==387; tests GREEN]
- [x] T012 Wave 3 system-spec-kit top-level/refs/guides (14 files): `SKILL.md`, `README.md`, `ARCHITECTURE.md`, `mcp_server/INSTALL_GUIDE.md` + `README.md`, `hooks/{codex,claude}/README.md`, `references/templates/template_guide.md`, `references/hooks/{skill_advisor_hook,skill_advisor_hook_validation}.md`, `references/cli/shared_smart_router.md`, `references/config/hook_system.md`, `scripts/loaders/README.md`, `templates/manifest/resource-map.md.tmpl`. [EVIDENCE: `rg "gemini"` clean in those files]
- [x] T013 Wave 3 cli-* skills (29 files across cli-opencode/cli-devin/cli-codex/cli-claude-code): remove Gemini from runtime/dispatch lists; REWRITE `cli-claude-code/references/claude_tools.md` from a 3-way "Claude vs Gemini vs Codex" comparison to a 2-way Claude-vs-Codex (value preserved). [EVIDENCE: `claude_tools.md` reads as a coherent 2-way comparison; `rg "gemini"` clean across the 29 files]
- [x] T014 Wave 3 misc docs + 3 shell scripts (17 files): top-level `README.md`, install_guides, `agents/{prompt-improver,deep-improvement}.md`, deep-research/deep-review/sk-code/sk-prompt docs, system-code-graph docs; `.opencode/scripts/orphan-mcp-sweeper.sh` (load-bearing session-tree pgrep pattern + operator-preserve case removed safely). [EVIDENCE: all `bash -n` OK]
- [x] T015 Wave 4 changelogs: edit 43 changelog files (agent-orchestration ×9, system-spec-kit ×8, deep-ai-council ×4, deep-improvement ×5, deep-research ×6, deep-review ×4, cli-* ×5, sk-doc ×1, sk-prompt-models ×1) + top-level `PUBLIC_RELEASE.md`; remove Gemini, reconcile runtime/mirror counts (e.g. 5 to 4, 4 to 3), remove Gemini-only sections/rows. [EVIDENCE: operator-approved; counts reconciled]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run all touched suites. [EVIDENCE: system-spec-kit hooks 59 (1 pre-existing copilot skip), code-graph runtime 14/14, fallback-router 8/8, remediation 25/25, spec-kit scripts 8/8 + 267/267 extractors, promote 3/3 GREEN; re-run centrally]
- [x] T017 Confirm count self-checks. [EVIDENCE: playbook hard-coded file-count 387==387; catalog 324; advisor catalog 36 / playbook 45]
- [x] T018 Run `bash -n` on 3 shell scripts and parse matrix/JSON. [EVIDENCE: 3 shell scripts `bash -n` OK; matrix/JSON parse OK]
- [x] T019 Run global eradication proof. [EVIDENCE: `rg "gemini"` excluding `specs/**` returns only the 2 DEFERRED system-skill-advisor files]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with evidence. [EVIDENCE: T001-T019 are checked with evidence]
- [x] No `[B]` blocked tasks remaining. [EVIDENCE: no tasks use `[B]`]
- [x] Global `gemini` search outside specs is clean except the 2 documented deferred files. [EVIDENCE: only the 2 deferred system-skill-advisor files remain]
- [x] Touched suites GREEN and count self-checks reconciled. [EVIDENCE: hooks 59, code-graph 14, fallback 8, remediation 25, scripts 8 + 267, promote 3; playbook 387==387]
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
