# Phase 002: Lane D Command + Agent Surface

**Parent:** 139-deep-improvement-guarded-refine-hardening | **Status:** Implemented | **Depends:** 001

## Goal

Give Lane D first-class parity with lanes A/B/C: a Layer-2 command, advisor routing, and the skill's standard documentation surfaces. Today Lane D is reachable only by invoking `loop-host.cjs` directly.

## Work items

1. **`/deep:start-packaging-refine-loop` command** following the existing `deep:start-*-loop` pattern: Markdown entrypoint (Phase-0 agent verification + BLOCKED unified setup phase) + `assets/deep_start-packaging-refine-loop_{auto,confirm}.yaml`. Setup inputs: `packaging_root` (required, must satisfy the `_loop/loop.py` contract), `live` (default false → dry-run), `max_iters`, `fixtures`, `variants`, `held_out`, `samples`, `proposer_model`, `grader_model`, `spec_folder`. The YAML's execution step invokes `loop-host.cjs --mode=packaging-benchmark-refine` (never python directly — the adapter owns contract validation).
2. **Advisor + routing.** Update deep-improvement's `graph-metadata.json` intent signals (packaging benchmark, refine prompt system, multi-packaging drift, independent grading) so `skill_advisor` routes Lane D intents; verify with a router replay (Lane C's own tooling can benchmark this).
3. **Skill documentation surfaces** per deep-improvement's own conventions: `feature_catalog/06--packaging-refine/`, `manual_testing_playbook/11--packaging-refine/` (the Phase 001 synthetic-deficit fixture becomes its core scenario), changelog entry, and README/AGENTS command-table rows where lanes A-C are listed.
4. **Agent dispatch.** The `deep-improvement` subagent (dispatched via orchestrate / cli-opencode) must know Lane D exists: update its agent definition's lane table and the cli-opencode `agent_delegation` reference if it enumerates lanes.
5. **Runtime mirror sync.** Whatever runtime mirrors exist for commands (`.opencode/commands` ↔ `.claude/commands` etc.) get the new command propagated through the repo's normal mirror tooling — not hand-copied.

## Acceptance

- `/deep:start-packaging-refine-loop:auto --packaging-root <Copywriter> ` (dry-run default) completes end to end from the command surface.
- Advisor routes at least 3 phrasing variants of "benchmark and refine my AI system's packagings" to deep-improvement/Lane D.
- Lanes A/B/C command flows unchanged; loop-host identity gate green.

## Status (2026-06-09)

Implemented. /deep:start-packaging-refine-loop command (.claude/commands is a symlink; one file serves both runtimes); agent lane-awareness + decline-when-clean; graph-metadata intents; feature_catalog 06-- + playbook 11-- + changelog v1.11.0.0 (deepseek-authored, reviewed).
