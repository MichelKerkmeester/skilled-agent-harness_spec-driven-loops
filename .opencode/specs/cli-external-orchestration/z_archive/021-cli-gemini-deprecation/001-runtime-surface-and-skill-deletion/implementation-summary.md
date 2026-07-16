---
title: "Implementation Summary: Deprecate project .gemini runtime surface"
description: "Implementation summary for project .gemini deletion and active-reference cleanup."
trigger_phrases:
  - "gemini deprecation implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/021-cli-gemini-deprecation/001-runtime-surface-and-skill-deletion"
    last_updated_at: "2026-06-05T07:35:35Z"
    last_updated_by: "opencode"
    recent_action: "Completed .gemini deletion"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".gemini/**"
      - "AGENTS.md"
      - "README.md"
      - ".opencode/commands/**"
      - ".opencode/skills/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Delete project .gemini."
      - "Treat all specs as historical for cleanup."
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
| **Spec Folder** | cli-external-orchestration/021-cli-gemini-deprecation |
| **Completed** | Yes |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet deleted the checked-in project `.gemini/**` runtime surface and the checked-in `.opencode/skills/cli-gemini/**` skill. It removed active non-spec assumptions that treated project `.gemini` as a maintained runtime mirror or `cli-gemini` as an installed skill.

### Packet Initialization

The workflow captured the user's scope decisions: delete the project `.gemini` directory, delete the `cli-gemini` skill completely, and treat all specs as historical records for cleanup. The implementation preserved non-skill `~/.gemini`, `$HOME/.gemini`, and `.geminiignore` documentation only where it describes external Gemini CLI behavior rather than checked-in project runtime files or installed skill routing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.gemini/**` | Deleted | Removed checked-in Gemini project runtime mirror files, commands, settings, workflows, skills, and specs links. |
| `.opencode/skills/cli-gemini/**` | Deleted | Removed the checked-in Gemini CLI skill completely. |
| Top-level docs/config | Updated | Removed project `.gemini` runtime guidance while keeping remaining repo-managed runtime surfaces. |
| `.opencode/commands/**` | Updated | Removed project `.gemini` mirror/config targets from create and doctor command surfaces. |
| `.opencode/skills/**` | Updated | Removed Gemini project mirror assumptions and active `cli-gemini` skill registrations from manifests, parity tests, docs, and advisor metadata. |
| `.opencode/specs/cli-external-orchestration/021-cli-gemini-deprecation/**` | Updated | Recorded scope, decisions, tasks, checklist evidence, and implementation summary. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was scaffolded through `create.sh`, then implementation proceeded in four passes: delete the tracked project `.gemini` surface, delete the tracked `cli-gemini` skill, update active source/docs/tests that required project `.gemini` paths or advertised `cli-gemini`, and run targeted verification. Search cleanup explicitly excluded historical specs except this active packet.

Rollback is straightforward from the working-tree diff: restore the deleted `.gemini/**` paths and revert the edited active references that changed runtime lists from four repo-managed surfaces to three. No database migration, dependency change, feature flag, or service rollout is involved.

Because OpenCode config-time files and agent/skill docs changed, operators should restart OpenCode after pulling these changes so the running session reloads the updated config and runtime metadata.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Delete project `.gemini` rather than tombstone it | The user explicitly selected deletion. |
| Preserve all specs during cleanup | The user clarified that all specs count as historical records. |
| Preserve non-skill `~/.gemini` and `.geminiignore` docs where unrelated | They describe external Gemini CLI behavior, not the deleted project runtime surface or deleted skill. |
| Delete `cli-gemini` completely | The user clarified the skill should be removed, not preserved as an external executor skill. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Level 3 scaffold creation | PASS: `create.sh` returned DOC_LEVEL=3 and created required docs. |
| Project `.gemini/**` deletion | PASS: `glob .gemini/**` returned no files. |
| `cli-gemini` skill deletion | PASS: `glob .opencode/skills/cli-gemini/**` returned no files. |
| Disallowed active project path scan | PASS: `rg --pcre2` for project `.gemini/(agents|commands|workflows|scripts|skills|specs|changelog|settings.json|GEMINI.md|.utcp_config.json)` returned no output with specs excluded. |
| Remaining root `.gemini` mentions | PASS: remaining hits are explicit absence checks, `~/.gemini`/`$HOME/.gemini`/`.geminiignore`, or executor home-state mapping. |
| SpecKit runtime tests | PASS: `npx vitest run tests/runtime-detection.vitest.ts tests/cross-runtime-fallback.vitest.ts tests/multi-ai-council-runtime-parity.vitest.ts` returned 33 passing tests. |
| Deep-loop parity tests | PASS: `npx vitest run ../scripts/tests/deep-research-contract-parity.vitest.ts ../scripts/tests/deep-review-contract-parity.vitest.ts ../scripts/tests/multi-ai-council-mirror-parity.vitest.ts` returned 16 passing and 1 skipped test. |
| Deep-improvement mirror verifier | PASS: configured Vitest run for `shared/tests/mirror-sync-verify.vitest.ts` returned 3 passing tests. |
| Phase workflow tests | PASS: `node .opencode/skills/system-spec-kit/scripts/tests/test-phase-command-workflows.js` returned 89 passing checks. |
| Syntax checks | PASS: JSON, TOML, Python, shell, and YAML checks passed for changed files. |
| Alignment and comment hygiene | PASS: alignment drift passed for active agents, commands, and skills; skills scan reported unrelated non-blocking benchmark warnings; changed code/script comment hygiene passed for staged and unstaged files. |
| Secret-pattern scan | PASS: diff scan for obvious secret-like additions returned no output. |
| Handback docs regression | PASS: direct assertions for remaining CLI handback docs and feature-catalog alignment passed; the workspace Vitest runner for this single file timed out before printing a banner. |
| Strict SpecKit validation | PASS: strict validation returned RESULT: PASSED with 0 errors and 0 warnings. |
| Context save and indexing | PASS: `memory_index_scan` completed with 21 indexed, 0 failed, and 11 pending vectors for the active packet plus constitutional context. |
| Skill graph validation | PASS: compiler validation discovered 21 skill metadata files; generated skill graph JSON has no `cli-gemini` node or edge. |
| Advisor routing | PASS: fallback advisor script recommends `cli-codex` for `use gemini cli for second opinion`, not `cli-gemini`; native advisor MCP was unavailable during final closeout. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Native MCP availability:** Native skill-advisor and code-graph MCP calls returned `Not connected` during final closeout. File-based skill graph validation, fallback advisor routing, direct Grep/Glob scans, and strict packet validation were used instead.
2. **Historical and external Gemini references:** Historical specs intentionally retain prior `.gemini` references as records, and Gemini CLI user-home/external-executor docs remain in scope.
<!-- /ANCHOR:limitations -->
