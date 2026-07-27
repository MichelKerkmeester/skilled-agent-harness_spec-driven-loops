---
title: "Implementation Summary: Deprecate cli-codex skill and operational references"
description: "Implementation summary for retiring cli-codex from active OpenCode operational surfaces while preserving archival history."
trigger_phrases:
  - "cli-codex deprecation summary"
  - "codex cli retirement implementation"
  - "executor retirement evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/cli-external-orchestration/025-cli-codex-deprecation"
    last_updated_at: "2026-06-30T15:05:00Z"
    last_updated_by: "opencode"
    recent_action: "Added Codex Desktop App project bridge without restoring cli-codex delegation"
    next_safe_action: "Restart Codex Desktop or reopen the trusted project so config and skill symlinks are loaded"
    blockers: []
    key_files:
      - ".opencode/skills/z_archive/cli-codex-retired/"
      - ".opencode/skills/deep-loop-runtime/"
      - ".opencode/skills/system-skill-advisor/"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/"
    session_dedup:
      fingerprint: "sha256:951b82df8b7b03d01f3aecac83cfb367798059f3291c5484a195365fe50d8a33"
      session_id: "159-cli-codex-deprecation-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Archive historical cli-codex records, but remove active operational routing."
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
| **Spec Folder** | 122-cli-codex-deprecation |
| **Completed** | 2026-06-30 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`cli-codex` has been retired from active OpenCode routing and discovery. The active skill package was moved out of discoverable skill paths into `.opencode/skills/z_archive/cli-codex-retired/` with `SKILL.retired.md`, residual empty `.opencode/skills/cli-codex/` directories were removed from disk, and historical spec/changelog records remain intact. A follow-up AI Council-guided cleanup removed active generic Codex runtime references and Codex hook support from `README.md`, `.opencode/hooks`, `.opencode/commands`, and active `.opencode/skills/**` paths.

### Gemini-Style Phase Alignment

The implementation follows the same phase order as the prior Gemini deprecation packet: runtime/skill deletion, command-layer cleanup, full executor purge, then runtime/model boundary review. For `cli-codex`, those phases map to active skill deletion, deep command asset cleanup, runtime/advisor/matrix/doc/test purge, and final removal of active generic Codex runtime references in the user-requested paths.

### AI Council-Guided Generic Codex Cleanup

At the user's request, AI Council reviewed the broader cleanup before implementation and persisted artifacts under `ai-council/**`. The resulting cleanup deleted Codex hook trees in `system-spec-kit` and `system-skill-advisor`, removed Codex mirror checks from `.opencode/hooks/pre-commit`, removed Codex branches/runtime config from commands and doctor assets, and retargeted active skills/tests/fixtures to the supported OpenCode plugin and Claude Code hook surfaces.

### Runtime And Advisor Cleanup

Deep-loop runtime no longer accepts or builds dispatch commands for the retired executor kind. Fanout, executor config, executor audit, and matrix tests now cover supported executor behavior and retired-kind rejection.

Skill Advisor source, fixtures, graph metadata, and checked-in generated graph were cleaned and regenerated. A direct advisor probe for `use cli-codex to review this repository` recommends supported skills and does not return `cli-codex`.

### Documentation And Test Surface Cleanup

Active command assets, agents, mirrors, install docs, root docs, feature catalogs, matrix runner docs, and manual testing playbooks no longer advertise `cli-codex`. Remaining exact `cli-codex` strings are archival or packet-local evidence under excluded historical scopes.

### Codex Desktop App Bridge Amendment

After the user deleted `.codex`, this packet added back only the project-local surfaces Codex Desktop documents and needs:

| Surface | Purpose |
|---------|---------|
| `.codex/config.toml` | Codex project configuration with MCP server entries equivalent to the Claude bridge. |
| `.codex/specs` | Symlink to `.opencode/specs` for packet context. |
| `.codex/changelog` | Symlink to `.opencode/changelog` for release context. |
| `.codex/skills` | Symlink to `.opencode/skills`, exposed to Codex through `.agents/skills`. |
| `.agents` | Symlink to `.codex`, preserving the repo's existing tracked bridge shape while satisfying Codex's documented `.agents/skills` lookup. |

This amendment intentionally does not recreate `.codex/agents` from `.opencode/agents`: Codex custom agents require standalone TOML files, while the canonical OpenCode and Claude agent mirrors are Markdown. It also does not restore Codex hook support or the retired `cli-codex` executor skill.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work used a source-first retirement path: remove active producers, regenerate metadata, retarget fixtures to supported executors, then verify with scoped grep, advisor probes, targeted tests, typechecks, matrix tests, and the OpenCode alignment verifier.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire operational references, not historical records | Active routes must disappear, but audit history should remain stable. |
| Remove executor kind as well as skill identity | Leaving raw executor support would keep deprecated dispatch paths alive after deleting the skill. |
| Remove generic Codex runtime support from requested active paths | User clarified that only OpenCode plugins and Claude Code hooks are supported. |
| Archive instead of hard-delete | `.opencode/skills/z_archive/cli-codex-retired/` preserves rollback material without active discovery. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline active grep | PASS: pre-cleanup active grep found 213 files / 998 exact `cli-codex` occurrences. |
| Skill graph compiler | PASS: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json --pretty` validated 19 skills, zero conflicts, and regenerated `skill-graph.json`; existing weight/output-size warnings remained non-blocking. |
| Runtime typecheck | PASS: `.opencode/skills/deep-loop-runtime` `npm run typecheck`. |
| Runtime targeted tests | PASS: `.opencode/skills/deep-loop-runtime` `npm test -- --run tests/unit/executor-config.vitest.ts tests/unit/executor-audit.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/cli-matrix.vitest.ts` passed 4 files / 103 tests. |
| Matrix adapter tests | PASS: `.opencode/skills/system-spec-kit/mcp_server` `npx vitest run tests/matrix-adapter-claude-code.vitest.ts tests/matrix-adapter-opencode.vitest.ts` passed 2 files / 5 tests. |
| Advisor targeted tests | PASS: `.opencode/skills/system-skill-advisor/mcp_server` targeted scorer/recommend/registry/cross-edge vitest passed 4 files / 65 tests; SQLite projection degraded to filesystem fallback because `better-sqlite3` was compiled for Node module 141 while current Node requires 127. |
| Advisor typecheck | PASS: `.opencode/skills/system-skill-advisor/mcp_server` `npm run typecheck`. |
| Advisor retired-route probe | PASS: `skill_advisor.py "use cli-codex to review this repository" --threshold 0.0` returned `sk-code-review`, `deep-loop-workflows`, and `sk-design`; no `cli-codex`. |
| Skill benchmark tests | PASS: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts` `npx vitest run skill-benchmark/tests/skill-benchmark.vitest.ts --reporter=dot` passed 1 file / 45 tests. |
| Alignment verifier | PASS: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills` scanned 2960 files, found 49 warnings, 0 errors. |
| Active content sweep | PASS: scoped `rg --hidden --line-number "cli-codex" AGENTS.md README.md .opencode .claude` with active exclusions returned no output. |
| Active filename sweep | PASS: `rg --files .opencode .claude` with active exclusions piped to `rg "cli-codex"` returned no output. |
| Active skill path removal | PASS: reading `.opencode/skills/cli-codex` returns file-not-found after residual empty-directory cleanup; active `SKILL.md` discovery finds no `/cli-codex/`. |
| AI Council plan | PASS: `@ai-council` persisted `ai-council/**` artifacts and recommended using this packet for active generic Codex cleanup. |
| Expanded active Codex content sweep | PASS: `rg -n --hidden -i "codex|cli-codex|\.codex|hooks/codex|if_cli_codex|codex exec|CODEX_" README.md .opencode/hooks .opencode/commands .opencode/skills -g '!**/z_archive/**' -g '!**/changelog/**' -g '!**/node_modules/**'` returned no output. |
| Expanded active Codex filename sweep | PASS: `rg --files --hidden README.md .opencode/hooks .opencode/commands .opencode/skills -g '!**/z_archive/**' -g '!**/changelog/**' -g '!**/node_modules/**' | rg -i 'codex|cli-codex'` returned no output. |
| Codex Desktop docs research | PASS: OpenAI docs confirm project `.codex/config.toml`, project MCP tables, root `AGENTS.md`, repository skills under `.agents/skills`, and project custom agents under `.codex/agents/*.toml`. |
| Codex bridge symlink smoke | PASS: `.agents` resolves to `.codex`, `.agents/skills/system-spec-kit/SKILL.md` resolves, and `.agents/skills`, `.codex/skills`, `.codex/specs`, and `.codex/changelog` are symlinks. |
| Codex project config parse | PASS: `python3.11` parsed `.codex/config.toml` with `tomllib` and printed `toml-ok`. |
| Shell syntax | PASS: `bash -n .opencode/hooks/pre-commit .opencode/commands/doctor/scripts/mcp-doctor.sh .opencode/commands/doctor/scripts/mcp-doctor-lib.sh`. |
| Post-expansion typechecks | PASS: `npm run typecheck` in system-spec-kit/mcp_server, system-skill-advisor/mcp_server, system-code-graph, and deep-loop-runtime. |
| Post-expansion targeted tests | PASS: system-spec-kit runtime/context tests 3 files / 412 tests; system-code-graph runtime detection 1 file / 11 tests; advisor targeted tests 4 files / 60 tests with `--testTimeout=90000`; deep-loop-runtime targeted tests 4 files / 73 tests. |
| Script-level council docs tests | BLOCKED: `npx vitest run tests/multi-ai-council-persist-artifacts.vitest.ts tests/outsourced-agent-handback-docs.vitest.ts --config ../mcp_server/vitest.config.ts --root . --pool=forks --reporter=dot` timed out after 300000 ms with no output; earlier 180000 ms single-command run also timed out. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **OpenCode restart required.** Skill discovery, command assets, hooks, plugins, and generated advisor metadata are file-backed; restart OpenCode to ensure the retired skill package, deleted Codex hook support, and regenerated graph are loaded by the runtime.
2. **Script-level council docs tests hang locally.** Two retargeted script tests timed out twice without output. Targeted matrix, advisor, runtime, and benchmark tests passed.
3. **Native SQLite module mismatch is local.** Advisor tests passed via filesystem fallback while logging that `better-sqlite3` was compiled for Node module 141 and current Node requires 127.
4. **Raw grep is noisy by design.** Historical specs, archive records, and changelogs can still contain Codex references; active operational sweeps exclude those scopes and return clean.
5. **Codex Desktop trust/restart required.** Project-local `.codex/config.toml`, `.codex` context symlinks, and `.agents/skills` are loaded by Codex after the project is trusted and the app/session is restarted or reopened.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:rollback -->
## Rollback

To roll back the original deprecation, move `.opencode/skills/z_archive/cli-codex-retired/` back to `.opencode/skills/cli-codex/`, rename `SKILL.retired.md` to `SKILL.md`, restore the deleted matrix adapter/test files and runtime executor kind from git, regenerate the skill graph with `skill_graph_compiler.py --export-json --pretty`, then rerun the targeted advisor, runtime, matrix, and active grep checks.

To roll back only the Codex Desktop bridge amendment, remove `.codex/config.toml`, `.codex/README.md`, `.codex/specs`, `.codex/changelog`, `.codex/skills`, and `.agents`. That leaves the retired `cli-codex` executor state unchanged.
<!-- /ANCHOR:rollback -->
