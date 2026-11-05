---
title: "Implementation Summary"
description: "The sk-design hub now serves three modes, the retired fundamentals folder is gone and every link, mirror and compiled-routing copy points at sk-code-frontend."
trigger_phrases:
  - "retire fundamentals implementation summary"
  - "sk-design three modes delivered"
  - "fundamentals folder removed"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/021-deprecate-fundamentals/002-retire-fundamentals"
    last_updated_at: "2026-11-05T12:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Recorded what the phase removed and how the gates proved it"
    next_safe_action: "None, the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-021-002-retire-fundamentals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-retire-fundamentals |
| **Status** | Complete |
| **Completed** | 2026-11-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The sk-design hub serves three modes. A value or review prompt that once landed on `sk-design-fundamentals` is answered by `sk-code-frontend`, and the design hub no longer holds a second copy of those rules.

### Phase 2: retire-fundamentals

A design request now reaches one of three modes. `sk-design-md-generator` measures an existing surface, `sk-design-chart` authors a chart and `sk-design-diagram` authors a diagram. Value and behavior questions leave the hub at stage one and load the sk-code-frontend references instead, so one owner holds each rule. The design agent follows the same split, with its decide path naming `web-visual-values.md` and its siblings.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-design/sk-design-fundamentals/` | Deleted | Fourth mode removed by git rm, with git history keeping the old copy |
| `.skilled/skills/sk-design/mode-registry.json` | Modified | Three modes with no default mode |
| `.skilled/skills/sk-design/hub-router.json` | Modified | `defaultMode` null, tie break entry and the `design-decisions` and `design-review` classes removed |
| `.skilled/skills/sk-design/ROUTER.md` | Modified | VALUES and REVIEW intents removed |
| `.skilled/skills/sk-design/SKILL.md` | Modified | Three-mode table and version 3.0.0.0 |
| `.skilled/skills/sk-design/description.json` | Modified | Hub description follows three modes |
| `.skilled/skills/sk-design/command-metadata.json` | Modified | Command list drops the retired mode |
| `.skilled/skills/sk-design/graph-metadata.json` | Modified | Fundamentals and slides or print phrases removed, intent signals 219 to 111 and the derived summary rewritten |
| `.skilled/skills/sk-design/leaf-manifest.json` | Regenerated | Leaf list rebuilt from three modes |
| `.skilled/agents/design.md` and `.claude/agents/design.md` | Modified | Decide path points at the sk-code-frontend references |
| `.codex/agents/design.toml`, `.pi/agents/design.md` and `.hermes/skills/agent-design/SKILL.md` | Regenerated | Runtime mirrors follow the new decide path |
| `.skilled/skills/mcp-tooling/mcp-figma/SKILL.md` | Modified | Value questions hand off to sk-code-frontend, version 1.2.2.0 |
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/token-drift.md` | Modified | Drift decision hands off to `web-visual-values.md` |
| `.skilled/skills/mcp-tooling/mcp-figma/manual-testing-playbook/figma-to-code/check-built-screen.md` | Modified | Contrast pass reads the frontend target values |
| `.skilled/skills/sk-design/sk-design-md-generator/references/design-knowledge/numeric-design-laws.md` | Modified | Authoring direction points at sk-code-frontend |
| `README.md` | Modified | Root skill list describes three design modes |
| `.skilled/skills/sk-design/benchmark/README.md` | Modified | Benchmark list drops the retired mode |
| `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modified | Example names three design modes |
| `.skilled/skills/sk-design/manual-testing-playbook/resource-loading/assets-only.md` | Modified | Prompt expects no fundamentals target |
| `.skilled/skills/sk-design/manual-testing-playbook/unknown-fallback/ambiguous-multi-intent.md` | Modified | Prompt expects no fundamentals target |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/lib/registry-compiler.cjs` | Modified | VALUES and REVIEW owners dropped |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/009-sk-design/fixtures/canary-cases.v1.json` | Modified | Two fundamentals cases dropped and `out-of-domain-defer` added |
| `.skilled/skills/sk-design/changelog/v3.0.0.0.md` | Created | Breaking release entry for the removed mode |
| `.skilled/skills/mcp-tooling/mcp-figma/changelog/v1.2.2.0.md` | Created | Repoint entry for the Figma skill |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

The phase ran in one pass against the worktree at baseline `10474a9567`. The hub registry, router, skill entry and metadata were reduced to three modes first, and the graph metadata went from 219 to 111 intent signals. The design agent, the repointed documents, the playbook prompts and the compiler with its canaries followed. The folder was removed last, after the three authoring dispatches had read their sources from it, and the leaf manifests and runtime mirrors were regenerated after the removal. The manifests were reminted for sk-design, sk-code and mcp-tooling and copied to their authored archive path. The final gate run covered `parent-skill-check` on three hubs, both routing replays, `compiled-route-sync`, `compiled-route-status`, the vocabulary reach check, the intent signal check, `check-markdown-links`, the runtime mirrors, the sk-doc README tests, `.skilled/bin/tests` at 14/14 and the advisor regression suite at 42/42.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Delete the folder instead of deprecating it in place | One owner for each rule stops the copy in sk-code-frontend and the copy in sk-design from drifting apart |
| Point the design agent at sk-code-frontend instead of a local copy | Decide work and the frontend values are the same rules, so a second copy would recreate the gap this phase closes |
| Make sk-design version 3.0.0.0 | Removing a registered mode breaks any consumer that names it, and a major bump is the only signal that carries that weight |
| Rewrite the out-of-domain canary to defer | A case that expects a removed mode cannot pass, and defer is the correct answer for a prompt with no design signal |
| Remint every served copy and the authored manifests | The served tree is generated, so an authored change that never reaches it leaves the old mode live |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `parent-skill-check` on sk-design, sk-code and mcp-tooling | PASS, each prints `OK: parent-skill-check` with all hard invariants passed and 0 warnings at exit 0 |
| sk-design hub legs | PASS, leg 6b counts 3 modes, leg 10b reports the leaf manifest byte-identical and leg 13a reads version 3.0.0.0 |
| `generate-router-intent-signals --check` on sk-code and sk-design | PASS, orphans=0 missing=0 on both |
| Stage-one advisor replay | PASS, seven value, review and motion prompts resolve to sk-code at 0.63 to 0.93 and chart, flowchart and extract resolve to sk-design at 0.82 to 0.95 |
| Stage-two compiled-route replay | PASS, all eight value, review and motion prompts route to sk-code-frontend, the vitest prompt stays on sk-code-skilled, chart routes to sk-design-chart, extract to sk-design-md-generator and the no-signal prompt defers |
| `compiled-route-sync --check` | PASS, all 55 served copies match their authored files |
| `compiled-route-sync --verify` | PASS, the move simulation resolves all 7 hubs |
| `compiled-route-status --all` | PASS, every hub reports compiled-serving |
| `ci-router-vocabulary-reach` | PASS, RESULT PASSED with wrong-hub=0 outranked=0 no-reach=0, sk-design at 84 declared phrases from 120 |
| `check-markdown-links` | PASS, 0 broken markdown links across 14494 links |
| Runtime mirrors | PASS, `sync-agents`, `sync-agents-pi` and `sync-skills-hermes` pass `--check` and `runtime-mirrors --check` passes for 213 mirrors |
| Hermes mirror prune | PASS, the Hermes tree no longer holds an `sk-design-fundamentals` copy |
| sk-doc README tests | PASS, `test_readme_manifest.py` and `test_readme_verdict_parity.py` exit 0 after the three deleted directories and README rows leave their fixtures |
| `.skilled/bin/tests` | PASS, 14/14 at exit 0, identical to main |
| `validate_document.py` on the five changelogs | PASS, VALID 0 issues |
| Advisor regression suite | PASS, 42/42 cases with top-1 1.0 against a main baseline of 39/42 and top-1 0.9189 |
| `validate.sh --strict` on this folder | PASS, RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The major version break has no compatibility shim.** A saved `/design:values` or `/design:review` invocation has no target now. The changelog entry is the notice, and a caller has to ask sk-code-frontend for the same work.
2. **Slides and print guidance is gone.** It lived in the deleted folder and neither chart nor diagram used it. Recover it from git history if a future mode needs it.
3. **The deletion is reversible only through git history.** The folder is not archived elsewhere in the tree, so a restore means checking out the commit before this phase.
<!-- /ANCHOR:limitations -->

---
