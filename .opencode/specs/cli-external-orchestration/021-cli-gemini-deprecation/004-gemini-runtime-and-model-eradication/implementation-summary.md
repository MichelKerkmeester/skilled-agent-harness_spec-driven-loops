---
title: "Implementation Summary: Eradicate Gemini as a host runtime and as a model everywhere outside specs"
description: "Implementation summary for the Gemini runtime + model eradication across architectural source, runtime-value tuples, scripts, documentation, and changelogs in four verified waves."
trigger_phrases:
  - "gemini runtime eradication implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication"
    last_updated_at: "2026-06-08T19:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed Gemini runtime+model eradication in four waves"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/**"
      - ".opencode/skills/system-skill-advisor/**"
      - ".opencode/skills/system-code-graph/mcp_server/lib/runtime-detection.ts"
      - ".opencode/changelog/**"
    session_dedup:
      fingerprint: "sha256:3d10e1f7902d21be8949ede5e25699605dbdb167a4a0030894ee4b4e8c79e88d"
      session_id: "gemini-deprecation-phase4-2026-06-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Eradicate Gemini runtime + model refs outside specs in four waves."
      - "Edit release-history changelogs and reconcile counts."
      - "Defer 2 advisor files to the concurrent devin-removal session."
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
| **Spec Folder** | cli-external-orchestration/021-cli-gemini-deprecation/004-gemini-runtime-and-model-eradication |
| **Completed** | Yes |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase eradicated Gemini as a host runtime and as a model everywhere outside `specs/**`. Phases 001-003 removed the `cli-gemini` executor/skill but deliberately deferred the two architecturally distinct surfaces - Gemini as a host runtime (hook subsystems, runtime-detection enums, the `GEMINI.md` doc convention) and Gemini as a model (`gemini-flash` and related IDs). After the operator directed "no Gemini anywhere", this phase removed both surfaces across architectural source, runtime-value tuples, scripts, ~87 documentation files, and 43 release-history changelogs, in four verified waves. The external Gemini-CLI binary state in the user home was preserved by design.

### Wave 1: Architectural core

All suites finished GREEN. In system-spec-kit `mcp_server`, the `hooks/gemini/` directory was DELETED and `gemini-cli` was removed from the `RuntimeId` union and detection in `lib/runtime-detection.ts`, with `hooks/index.ts`, `hooks/README.md`, `tests/fixtures/runtime-fixtures.ts`, and the `runtime-detection`, `cross-runtime-fallback`, `hook-session-start`, `hooks-reexport-parity`, and `hooks-shared-provenance` tests updated; the 5 suites passed (59 passed / 1 pre-existing copilot skip) and tsc was clean. system-code-graph `mcp_server` dropped `gemini-cli` from `lib/runtime-detection.ts` and its test (14/14 GREEN). system-skill-advisor DELETED its own `hooks/gemini/` subsystem with its test and two Gemini docs, and de-indexed its feature catalog (37 to 36) and manual testing playbook (46 to 45) including the enforcing vitest. Model references were cleared too: `gemini-flash` left the deep-loop-runtime fallback router and its test (8/8 GREEN), the sk-prompt-models `model-profiles.json` / `per-model-budgets.json` / refs, and the cli-devin `references/quota-fallback.md`.

### Wave 2: Code and runtime-value

Gemini was removed from the system-skill-advisor runtime-VALUE surface: the canonical tuple in `advisor-runtime-values.ts`, `metrics.ts`, `schemas/advisor-tool-schemas.ts`, `plugin_bridges/mk-skill-advisor-bridge.mjs`, `scripts/skill_advisor.py`, the runtime-parity / advisor-observability / plugin-bridge tests, and the bench. A concurrent session was independently removing `devin` from the same skill; the merged result has Gemini fully gone from the tuple and hooks. In system-spec-kit scripts, edits landed in `scripts/lib/cli-capture-shared.ts`, `shared/gate-3-classifier.ts` (a docs-comment `GEMINI.md` token only, with NO Gate-3 classification change), `scripts/utils/source-capabilities.ts`, `scripts/utils/input-normalizer.ts`, `scripts/resource-map/extract-from-evidence.cjs`, and the `stdio-logging-safety`, `test-extractors-loaders`, and `validation-rule-metadata` tests (8/8 vitest + 267/267 extractors GREEN). Misc code followed: deep-loop-runtime `executor-config.ts` (a residual comment) plus `SKILL.md` and the feature_catalog fanout-executor list; deep-improvement `promote-candidate.cjs`; sk-doc `validate-doc-model-refs.js`; `.opencode/plugins/session-cleanup.js`; and cli-devin `assets/per-model-budgets.json` (promote vitest 3/3 GREEN).

### Wave 3: Documentation (87 files)

In system-spec-kit, four whole Gemini-runtime docs were DELETED (`feature_catalog/22--context-preservation/gemini-cli-hooks.md`, `manual_testing_playbook/22--context-preservation/gemini-cli-hooks.md`, `manual_testing_playbook/16--tooling-and-scripts/gemini-runtime-path-resolution.md`, `manual_testing_playbook/18--ux-hooks/F--comment-hygiene-gemini-hook.md`), de-indexed, and the count self-checks corrected (playbook 391 to 387, catalog 325 to 324) with tests GREEN. Fourteen top-level / refs / guides files were updated (`SKILL.md`, `README.md`, `ARCHITECTURE.md`, `mcp_server/INSTALL_GUIDE.md` + `README.md`, `hooks/{codex,claude}/README.md`, `references/templates/template_guide.md`, `references/hooks/{skill_advisor_hook,skill_advisor_hook_validation}.md`, `references/cli/shared_smart_router.md`, `references/config/hook_system.md`, `scripts/loaders/README.md`, `templates/manifest/resource-map.md.tmpl`). Twenty-nine cli-* files across cli-opencode / cli-devin / cli-codex / cli-claude-code dropped Gemini from runtime/dispatch lists, and `cli-claude-code/references/claude_tools.md` was REWRITTEN from a 3-way "Claude vs Gemini vs Codex" comparison to a 2-way Claude-vs-Codex comparison (value preserved, not deleted). Seventeen misc docs plus three shell scripts were updated (top-level `README.md`, install guides, `agents/{prompt-improver,deep-improvement}.md`, deep-research / deep-review / sk-code / sk-prompt docs, system-code-graph docs); `.opencode/scripts/orphan-mcp-sweeper.sh` had a load-bearing Gemini reference (a session-tree pgrep pattern and an operator-preserve case) that was removed safely, and all `bash -n` checks passed.

### Wave 4: Changelogs

Forty-three changelog files were edited per operator direction (agent-orchestration ×9, system-spec-kit ×8, deep-ai-council ×4, deep-improvement ×5, deep-research ×6, deep-review ×4, cli-* ×5, sk-doc ×1, sk-prompt-models ×1) plus the top-level `PUBLIC_RELEASE.md`. The edits removed Gemini, reconciled runtime/mirror counts (e.g. 5 to 4, 4 to 3), and removed Gemini-only sections and rows.

The canonical file inventory with per-file change types lives in `resource-map.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Work proceeded in four waves: the architectural core (runtime enums, hook subsystems, runtime fixtures, and model references), the code and runtime-value surface (the advisor tuple and its consumers, the spec-kit script/extractor surfaces, and misc code), documentation (4 deleted runtime docs with count reconciliation, 14 top-level/refs/guides, 29 cli-* files including the `claude_tools.md` rewrite, and 17 misc docs + 3 shell scripts), and changelogs (43 files + `PUBLIC_RELEASE.md` with count reconciliation).

Delete-vs-rewrite discipline drove classification: pure-Gemini artifacts (the two `hooks/gemini/` subsystems and four runtime docs) were deleted, mixed surfaces (runtime enums, the advisor tuple, scripts) were edited in place, and comparison/example content (`claude_tools.md`, the dashboard sample) was rewritten to preserve value. The concurrent `devin`-removal session in system-skill-advisor was coordinated rather than raced: the shared runtime-value tuple was merged so Gemini is fully gone, and two files were deferred to that session - the negative-assertion parity test (`settings-driven-invocation-parity.vitest.ts`) and the historical decisions doc (`references/decisions/deferred_decisions.md`).

Confidence came from running every touched suite (system-spec-kit hooks 59 with 1 pre-existing copilot skip, code-graph runtime 14/14, fallback-router 8/8, remediation 25/25, spec-kit scripts 8/8 + 267/267 extractors, promote 3/3), reconciling the count self-checks (playbook 387==387, catalog 324, advisor 36/45), running `bash -n` on the three touched shell scripts, parsing the matrix/JSON manifests, and confirming the global `rg "gemini"` exclusion returned only the two documented deferred files. Rollback is straightforward from the working-tree diff: restore the deleted hook subsystems, four docs, and runtime-enum members, and revert the edited source, docs, scripts, and changelogs. No database migration, dependency change, feature flag, or service rollout is involved. The external Gemini-CLI binary state in the user home (`~/.gemini`, `.geminiignore`) was intentionally left intact.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Eradicate Gemini as a host runtime entirely | Remove `gemini-cli` from runtime-detection enums, delete the `hooks/gemini/` subsystems in two skills, and drop the `GEMINI.md` doc convention, per the operator's "everything" direction. |
| Swap or rewrite, not gut, comparison/example content | Rewrite `claude_tools.md` from a 3-way to a 2-way Claude-vs-Codex comparison and swap the dashboard sample to Codex to preserve doc value. |
| Coordinate-not-thrash with the concurrent session | A concurrent session was removing `devin` from the same skill; merge the tuple cleanly and defer 2 files (a negative-assertion parity test and a historical decisions doc) to it. |
| Edit release-history changelogs and reconcile counts | The operator directed "no Gemini anywhere" with only `specs/**` exempt. |
| Treat the gate-3-classifier token as behavior-neutral | The Gemini reference was a docs-comment `GEMINI.md` token only, so removal makes no Gate-3 classification change. |
| Preserve the external Gemini-CLI binary state | `~/.gemini` and `.geminiignore` are third-party binary state outside the project surface and are left intact. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Global runtime/model search | PASS: `rg "gemini"` excluding `specs/**` returned only the 2 documented deferred system-skill-advisor files. |
| system-spec-kit hooks suites | PASS: 5 suites GREEN, 59 passed / 1 pre-existing copilot skip; tsc clean. |
| system-code-graph runtime suite | PASS: 14/14 GREEN. |
| deep-loop fallback-router suite | PASS: 8/8 GREEN. |
| deep-improvement remediation suite | PASS: 25/25 GREEN. |
| spec-kit scripts + extractors | PASS: 8/8 vitest + 267/267 extractors GREEN. |
| deep-improvement promote suite | PASS: 3/3 GREEN. |
| Count self-checks | PASS: playbook hard-coded file-count 387==387; catalog 324; advisor catalog 36 / playbook 45. |
| Shell-script syntax | PASS: 3 touched shell scripts `bash -n` OK, including the load-bearing `orphan-mcp-sweeper.sh` edit. |
| Matrix / JSON parse | PASS: manifests parse. |
| gate-3-classifier neutrality | PASS: the Gemini token was a docs-comment `GEMINI.md` reference only; no classification change. |
| External binary state intact | PASS: `~/.gemini` and `.geminiignore` were not edited. |

> Note: the touched suites and validation are re-run centrally by the orchestrator after metadata generation. This summary records the results observed during implementation.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two deferred advisor files:** `mcp_server/tests/hooks/settings-driven-invocation-parity.vitest.ts` (its Gemini mentions are pro-eradication negative assertions) and `references/decisions/deferred_decisions.md` (historical migration records) were deferred to the concurrent `devin`-removal session, so the global `rg "gemini"` exclusion returns these two files until that session clears them.
2. **Pre-existing copilot skip:** the system-spec-kit hooks suite reports 59 passed with 1 pre-existing copilot skip unrelated to this change.
3. **External Gemini-CLI binary state retained:** `~/.gemini` and `.geminiignore` in the user home are third-party binary state and remain intact by design (see decision-record ADR-006).
<!-- /ANCHOR:limitations -->
