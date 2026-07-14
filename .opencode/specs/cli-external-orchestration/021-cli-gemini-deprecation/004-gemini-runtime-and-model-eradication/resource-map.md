---
title: "Resource Map: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Canonical file inventory for the Gemini runtime + model eradication, grouped by skill and category with change-type (edited / deleted / rewritten / renamed) plus the two deferred files."
trigger_phrases:
  - "resource map"
  - "path catalog"
  - "files touched"
  - "gemini runtime eradication resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Added resource map for Gemini runtime+model eradication"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "resource-map.md"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:58ed15b4c6feec41c1eeb67d8021c0e49851b12d67cfa4c83921b56affdaa0ba"
      session_id: "gemini-deprecation-phase4-2026-06-08"
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

- **Total references**: ~190 touched paths across architectural source, runtime-value tuples, scripts, ~87 docs, and 43 changelogs + `PUBLIC_RELEASE.md` (the two `hooks/gemini/` subsystems are summarized as grouped deletion rows; broad doc/changelog families are listed individually where load-bearing and grouped where uniform).
- **By category**: Documents=29, Skills=33, Specs=7, Scripts=7, Tests=12, Config=4, Meta=2, Removed=6, Changelogs=43, Deferred=2.
- **Missing on disk**: 6 deleted paths (2 `hooks/gemini/` subsystems counted as directories + 4 Gemini-runtime docs).
- **Scope**: every file edited, deleted, rewritten, or renamed during the Gemini runtime + model eradication outside `specs/**`, grouped by skill; per-phase map for this phase child. The two DEFERRED system-skill-advisor files are listed under §Deferred.
- **Generated**: 2026-06-08T19:30:00Z.

> **Action vocabulary**: `Edited` · `Deleted` · `Rewritten` · `Renamed` · `Created` · `Deferred` · `Validated`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (deleted by design) · `DEFERRED` (left to the concurrent `devin`-removal session).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:removed-runtime -->
## Removed Artifacts

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/` | Deleted | MISSING | Gemini hook subsystem directory removed. |
| `.opencode/skills/system-skill-advisor/hooks/gemini/` | Deleted | MISSING | Gemini hook subsystem directory removed (+ its test + 2 docs). |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/gemini-cli-hooks.md` | Deleted | MISSING | Gemini-runtime catalog doc removed; catalog 325 to 324. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation/gemini-cli-hooks.md` | Deleted | MISSING | Gemini-runtime playbook doc removed; playbook 391 to 387. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/gemini-runtime-path-resolution.md` | Deleted | MISSING | Gemini-runtime playbook doc removed. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/18--ux-hooks/F--comment-hygiene-gemini-hook.md` | Deleted | MISSING | Gemini-runtime playbook doc removed. |
<!-- /ANCHOR:removed-runtime -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Broad doc families touched in Wave 3 (cli-* dispatch/runtime lists, misc docs, install guides). Skill-internal markdown is listed under §Skills per category-precedence; this section captures the load-bearing rewrite and the cross-cutting doc groups.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/cli-claude-code/references/claude_tools.md` | Rewritten | OK | 3-way "Claude vs Gemini vs Codex" rewritten to 2-way Claude-vs-Codex (value preserved). |
| `.opencode/skills/cli-opencode/**` (Gemini runtime/dispatch lists) | Edited | OK | Part of the 29 cli-* files; Gemini removed from runtime/dispatch lists. |
| `.opencode/skills/cli-devin/**` (Gemini runtime/dispatch + quota-fallback) | Edited | OK | `references/quota-fallback.md` + dispatch lists drop `gemini-flash`/Gemini. |
| `.opencode/skills/cli-codex/**` (Gemini runtime/dispatch lists) | Edited | OK | Part of the 29 cli-* files. |
| `.opencode/skills/deep-research/**` docs | Edited | OK | Part of the 17 misc docs; Gemini runtime references removed. |
| `.opencode/skills/deep-review/**` docs | Edited | OK | Part of the 17 misc docs. |
| `.opencode/skills/sk-code/**` docs | Edited | OK | Part of the 17 misc docs. |
| `.opencode/skills/sk-prompt/**` docs | Edited | OK | Part of the 17 misc docs. |
| `.opencode/skills/system-code-graph/**` docs | Edited | OK | Part of the 17 misc docs. |
| install_guides (misc) | Edited | OK | Part of the 17 misc docs; Gemini runtime references removed. |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:agents -->
## 4. Agents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/agents/prompt-improver.md` | Edited | OK | Gemini runtime reference removed (Wave 3 misc docs). |
| `.opencode/agents/deep-improvement.md` | Edited | OK | Gemini runtime reference removed (Wave 3 misc docs). |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> Grouped by skill. Source `.ts`/`.cjs`/`.mjs`/`.py` and `*.vitest.ts` are listed again under §Scripts / §Tests per category-precedence; this section captures SKILL.md, READMEs, feature catalogs, playbooks, references, top-level/refs/guides, and runtime-detection libs.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/runtime-detection.ts` | Edited | OK | Removed `gemini-cli` from `RuntimeId` union + detection. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/index.ts` | Edited | OK | Dropped the Gemini hook export. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/README.md` | Edited | OK | Hook README drops Gemini. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Edited | OK | Wave 3 top-level/refs/guides; drops Gemini. |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md` | Edited | OK | Wave 3 top-level/refs/guides; drops Gemini. |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Edited | OK | Wave 3; install guide drops Gemini runtime. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Edited | OK | Wave 3; mcp_server README drops Gemini. |
| `.opencode/skills/system-spec-kit/SKILL.md` | Edited | OK | Wave 3; SKILL.md drops Gemini runtime references. |
| `.opencode/skills/system-spec-kit/README.md` | Edited | OK | Wave 3; README drops Gemini. |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Edited | OK | Wave 3; architecture doc drops Gemini runtime. |
| `.opencode/skills/system-spec-kit/references/templates/template_guide.md` | Edited | OK | Wave 3; template guide drops Gemini. |
| `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook.md` | Edited | OK | Wave 3; hook reference drops Gemini. |
| `.opencode/skills/system-spec-kit/references/hooks/skill_advisor_hook_validation.md` | Edited | OK | Wave 3; hook validation reference drops Gemini. |
| `.opencode/skills/system-spec-kit/references/cli/shared_smart_router.md` | Edited | OK | Wave 3; smart router reference drops Gemini. |
| `.opencode/skills/system-spec-kit/references/config/hook_system.md` | Edited | OK | Wave 3; hook system reference drops Gemini runtime trigger. |
| `.opencode/skills/system-spec-kit/scripts/loaders/README.md` | Edited | OK | Wave 3; loaders README drops Gemini. |
| `.opencode/skills/system-spec-kit/templates/manifest/resource-map.md.tmpl` | Edited | OK | Wave 3; resource-map template drops a Gemini runtime example. |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Edited | OK | De-indexed deleted Gemini-runtime catalog doc; catalog 325 to 324. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Edited | OK | De-indexed 3 deleted Gemini-runtime playbook docs; count self-check 391 to 387 (387==387). |
| `.opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts` | Edited | OK | Removed `gemini-cli` from the runtime enum. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/advisor-runtime-values.ts` | Edited | OK | Removed Gemini from the canonical runtime-value tuple. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Edited | OK | Removed Gemini runtime value. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/schemas/advisor-tool-schemas.ts` | Edited | OK | Removed Gemini from tool schemas. |
| `.opencode/skills/system-skill-advisor/plugin_bridges/mk-skill-advisor-bridge.mjs` | Edited | OK | Removed Gemini from the plugin bridge. |
| `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` | Edited | OK | De-indexed Gemini hook doc; catalog 37 to 36. |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md` | Edited | OK | De-indexed Gemini hook doc; playbook 46 to 45. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Edited | OK | Removed a residual Gemini comment. |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Edited | OK | Removed Gemini from the fan-out executor list. |
| `.opencode/skills/deep-loop-runtime/feature_catalog/**` (fanout-executor list) | Edited | OK | Feature catalog fan-out executor list drops Gemini. |
| `.opencode/skills/sk-doc/scripts/validate-doc-model-refs.js` | Edited | OK | Model-ref validator drops `gemini-flash`. |
| `.opencode/skills/sk-prompt-models/assets/model-profiles.json` | Edited | OK | Removed the `gemini-flash` model profile. |
| `.opencode/skills/sk-prompt-models/assets/per-model-budgets.json` | Edited | OK | Removed `gemini-flash` budget. |
| `.opencode/skills/sk-prompt-models/**` refs | Edited | OK | Removed `gemini-flash` references. |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/spec.md` | Created | OK | Phase specification. |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/plan.md` | Created | OK | Phase implementation plan. |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/tasks.md` | Created | OK | Phase task ledger. |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/checklist.md` | Created | OK | Phase verification checklist. |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/decision-record.md` | Created | OK | Phase decision record (ADR-001..ADR-006). |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/implementation-summary.md` | Created | OK | Phase delivery summary. |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication/resource-map.md` | Created | OK | This resource map. |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Executable source touched. `*.vitest.ts` are listed under §Tests per category-precedence.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Edited | OK | Removed Gemini runtime value. |
| `.opencode/skills/system-spec-kit/scripts/lib/cli-capture-shared.ts` | Edited | OK | Removed Gemini runtime reference. |
| `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` | Edited | OK | Removed the `GEMINI.md` docs-comment token (behavior-neutral; no Gate-3 change). |
| `.opencode/skills/system-spec-kit/scripts/utils/source-capabilities.ts` | Edited | OK | Removed Gemini source capability. |
| `.opencode/skills/system-spec-kit/scripts/utils/input-normalizer.ts` | Edited | OK | Removed Gemini normalization branch. |
| `.opencode/skills/system-spec-kit/scripts/resource-map/extract-from-evidence.cjs` | Edited | OK | Removed Gemini extraction token. |
| `.opencode/skills/deep-improvement/scripts/promote-candidate.cjs` | Edited | OK | Removed Gemini reference; promote vitest 3/3 GREEN. |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:shell -->
## 7b. Shell Scripts

> Three shell scripts touched in Wave 3; all pass `bash -n`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/scripts/orphan-mcp-sweeper.sh` | Edited | OK | Load-bearing: removed the Gemini session-tree pgrep pattern + operator-preserve case safely; `bash -n` OK. |
| `.opencode/install_guides/**` (shell, ×2) | Edited | OK | Removed Gemini runtime setup lines; `bash -n` OK. |
<!-- /ANCHOR:shell -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts` | Edited | OK | Removed `gemini-cli` from runtime-detection assertions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts` | Edited | OK | Removed Gemini from cross-runtime fallback assertions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts` | Edited | OK | Removed Gemini hook session-start assertions. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hooks-reexport-parity.vitest.ts` | Edited | OK | Updated re-export parity after the Gemini hook deletion. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/hooks-shared-provenance.vitest.ts` | Edited | OK | Updated shared provenance after the Gemini hook deletion. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/runtime-fixtures.ts` | Edited | OK | Removed the `gemini-cli` runtime fixture. |
| `.opencode/skills/system-code-graph/mcp_server/tests/runtime-detection.vitest.ts` | Edited | OK | Removed `gemini-cli`; 14/14 GREEN. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/runtime-parity.vitest.ts` | Edited | OK | Removed Gemini from runtime parity. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/advisor-observability.vitest.ts` | Edited | OK | Removed Gemini from observability assertions. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/plugin-bridge.vitest.ts` | Edited | OK | Removed Gemini from plugin-bridge assertions. |
| `.opencode/skills/deep-loop-runtime/tests/**/fallback-router.vitest.ts` | Edited | OK | Removed `gemini-flash`; 8/8 GREEN. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/{stdio-logging-safety,test-extractors-loaders,validation-rule-metadata}.vitest.ts` | Edited | OK | Removed Gemini tokens; 8/8 vitest + 267/267 extractors GREEN. |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/cli-devin/assets/per-model-budgets.json` | Edited | OK | Removed `gemini-flash` budget. |
| `.opencode/plugins/session-cleanup.js` | Edited | OK | Removed Gemini runtime cleanup branch. |
| `.opencode/skills/system-skill-advisor/mcp_server/**/bench` | Edited | OK | Removed Gemini from the runtime-value bench. |
| `.opencode/skills/deep-improvement/SKILL.md` (executor list) | Edited | OK | Removed Gemini from the fan-out executor list (Wave 2 misc). |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

| Path | Action | Status | Note |
|------|--------|--------|------|
| `README.md` (repo root) | Edited | OK | Removed Gemini runtime reference (Wave 3 misc docs). |
| `PUBLIC_RELEASE.md` (repo root) | Edited | OK | Removed Gemini; reconciled runtime/mirror counts (Wave 4). |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:changelogs -->
## 11. Changelogs

> Release-history changelogs edited per explicit operator approval (only `specs/**` exempt). 43 files across 10 components; counts reconciled (e.g. 5 to 4, 4 to 3); Gemini-only sections/rows removed.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/changelog/agent-orchestration/**` (×9) | Edited | OK | Removed Gemini; reconciled runtime/mirror counts. |
| `.opencode/changelog/system-spec-kit/**` (×8) | Edited | OK | Removed Gemini runtime/hook wording; reconciled counts. |
| `.opencode/changelog/deep-ai-council/**` (×4) | Edited | OK | Removed Gemini seat/runtime wording. |
| `.opencode/changelog/deep-improvement/**` (×5) | Edited | OK | Removed Gemini executor/runtime wording. |
| `.opencode/changelog/deep-research/**` (×6) | Edited | OK | Removed Gemini runtime wording. |
| `.opencode/changelog/deep-review/**` (×4) | Edited | OK | Removed Gemini runtime wording. |
| `.opencode/changelog/cli-*/**` (×5) | Edited | OK | Removed Gemini runtime/dispatch wording. |
| `.opencode/changelog/sk-doc/**` (×1) | Edited | OK | Removed Gemini reference. |
| `.opencode/changelog/sk-prompt-models/**` (×1) | Edited | OK | Removed `gemini-flash` model wording. |
<!-- /ANCHOR:changelogs -->

---

<!-- ANCHOR:deferred -->
## 12. Deferred

> Left to the concurrent `devin`-removal session in system-skill-advisor (see decision-record ADR-003). These two files still contain Gemini mentions until that session clears them.

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts` | Deferred | DEFERRED | Gemini mentions are pro-eradication negative assertions; owned by the concurrent session. |
| `.opencode/skills/system-skill-advisor/references/decisions/deferred_decisions.md` | Deferred | DEFERRED | Historical migration records; owned by the concurrent session. |
<!-- /ANCHOR:deferred -->

---

<!-- ANCHOR:validation -->
## Validation Commands

| Command | Result | Note |
|---------|--------|------|
| `rg "gemini" --glob '!specs/**' --glob '!.opencode/specs/**'` | PASS | Only the 2 DEFERRED system-skill-advisor files remain. |
| system-spec-kit hooks suites (×5) | PASS | 59 passed / 1 pre-existing copilot skip; tsc clean. |
| system-code-graph runtime suite | PASS | 14/14. |
| deep-loop fallback-router suite | PASS | 8/8. |
| deep-improvement remediation suite | PASS | 25/25. |
| spec-kit scripts + extractors | PASS | 8/8 vitest + 267/267 extractors. |
| deep-improvement promote suite | PASS | 3/3. |
| playbook file-count self-check | PASS | 387==387 (playbook 391 to 387; catalog 325 to 324). |
| `bash -n` (×3 shell scripts) | PASS | Incl. load-bearing `orphan-mcp-sweeper.sh`. |
| matrix / JSON parse | PASS | Manifests parse. |
<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Paths are relative to the repository root.
- The two `hooks/gemini/` subsystems are listed as grouped deletion rows; every file under each directory was removed together.
- Broad uniform doc/changelog families (e.g. the 29 cli-* files, the 43 changelogs) are grouped with counts where the change-type is uniform; load-bearing single files (the `claude_tools.md` rewrite, `orphan-mcp-sweeper.sh`) are listed individually.
- The two DEFERRED files are listed under §Deferred and intentionally still contain Gemini mentions until the concurrent `devin`-removal session clears them (see `decision-record.md` ADR-003).
- The external Gemini-CLI binary state (`~/.gemini`, `.geminiignore`) is intentionally absent from this map; it is preserved by design (see `decision-record.md` ADR-006).
<!-- /ANCHOR:author-instructions -->
