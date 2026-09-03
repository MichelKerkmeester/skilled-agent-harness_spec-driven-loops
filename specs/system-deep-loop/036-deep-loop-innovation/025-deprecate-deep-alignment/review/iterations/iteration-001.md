---
title: "Deep Review Iteration 001 — Correctness (Inventory + Deep Pass)"
trigger_phrases: []
---
# Deep Review Iteration 001 — Correctness (Inventory + Deep Pass)

## Dimension

**Correctness** — inventory pass across all active surfaces + correctness deep pass on the seven commits.

## Files Reviewed

- Seven commits: e41aa1878ad, d1a5981b58c, 8849444aa61, 766b59d6bc3, 6303c12ad27, 69d5c223668, b955f937fc9 (via `git show --stat` + targeted diffs)
- Active-surface orphan sweep: `.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.devin/`, `README.md` — grep for `deep-alignment`, `command-benchmark`, `conformance-benchmark`, `/deep:alignment`, `/deep:command-benchmark`
- Generated metadata: `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `command-metadata.json`, `graph-metadata.json`, `description.json`
- Surviving deep command files: `agent-improvement.md`, `ai-council.md`, `model-benchmark.md`, `research.md`, `review.md`, `skill-benchmark.md`
- Phase-0 gate retirement: `review.md` diff (e41aa1878ad), `dispatch-guard.cjs:142` (isCommandDrivenIteration), `system-deep-loop-guard.test.cjs`
- Executor routing: `deep-review-auto.yaml` diff (d1a5981b58c) — if_cli_cursor/devin/pi branches
- Authority-state: `.opencode/skills/.authority-state/` directory + README.md
- Dangling symlink check: `.claude/commands/`, `.cursor/commands/`
- cli-opencode model pin: `cli-opencode/SKILL.md` diff (6303c12ad27)
- README.md alignment references (69d5c223668)

## Findings by Severity

### P0 (Critical)
None.

### P1 (Major)
None.

### P2 (Minor)

#### P2-001 Orphan authority-state file for deleted deep-alignment mode
- **File:** `.opencode/skills/.authority-state/authority-deep-alignment.json:1`
- **Evidence:** The `deep-alignment` mode was removed in commit 8849444aa61 (mode packet, agents, commands, prompts all deleted). The authority-state directory still contains `authority-deep-alignment.json` with `"mode":"deep-alignment"` and `"state":"new_authoritative_final"`. The other 7 authority files (`authority-deep-research.json`, `authority-deep-review.json`, `authority-deep-ai-council.json`, `authority-agent-improvement.json`, `authority-deep-improvement-common.json`, `authority-model-benchmark.json`, `authority-skill-benchmark.json`) all correspond to surviving modes.
- **Finding class:** instance-only
- **Scope proof:** `ls .opencode/skills/.authority-state/` shows 8 authority-*.json files; 7 match surviving modes in `mode-registry.json`, 1 (`authority-deep-alignment.json`) matches no surviving mode.
- **Mitigating context:** Per `.authority-state/README.md:23`, "The runtime state in this folder is machine-local and git-ignored. Only this README.md is committed." The file is git-ignored, so it was outside the commit's deletion scope. No runtime code loads it — the authority system keys by mode, and `deep-alignment` is absent from `mode-registry.json` (confirmed: `modes[]` contains only research, review, ai-council, agent-improvement, model-benchmark, skill-benchmark; `deprecatedModes: []`). The file is inert dead state, not a live reference.
- **Affected surface hints:** ["authority-state", "deep-alignment removal"]
- **riskScore:** 2 (advisory only)
- **Recommendation:** Delete the stale `authority-deep-alignment.json` from the local `.authority-state/` directory. No code change needed — it is git-ignored and inert. Optional cleanup; schedule as a follow-up.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | 025 packet spec/checklist/tasks reference `/deep:alignment` and `/deep:command-benchmark` as the removed targets (spec.md:25,56,98; checklist.md:34,36,80,81,105) — these are the deprecation spec's own subject, not orphans. Implementation matches spec intent: removal is complete. Full spec-vs-code cross-check deferred to traceability dimension. |
| `checklist_evidence` | deferred | checklist.md evidence rows not yet inspected line-by-line; deferred to traceability dimension. |
| `skill_agent` | pass | `system-deep-loop/SKILL.md` updated in 766b59d6bc3 — no alignment mode in the mode table; 6 surviving modes listed. `mode-registry.json` confirms 6 modes, no alignment. |
| `agent_cross_runtime` | pass | No orphaned references on any active surface (.opencode/.claude/.codex/.cursor/.pi/.devin). Dangling symlink check: 0 dangling symlinks in .claude/commands or .cursor/commands. Deleted agents (deep-alignment.md on all runtimes) confirmed absent. |
| `feature_catalog_code` | deferred | Retired alignment feature-catalog directory deleted (in scope-files.txt deleted list). No active feature-catalog references found in generated metadata. Full catalog sweep deferred to traceability dimension. |
| `playbook_capability` | deferred | Retired alignment manual-testing-playbook deleted. Full playbook sweep deferred to traceability dimension. |

## Correctness Deep Pass

### 1. Removal completeness (commits 8849444aa61 + 766b59d6bc3 + b955f937fc9)
- **Active-surface orphan sweep:** grep across `.opencode/`, `.claude/`, `.codex/`, `.cursor/`, `.pi/`, `.devin/`, `README.md` for `deep-alignment`, `command-benchmark`, `conformance-benchmark` — **zero matches in active code** (excluding review/archived specs and historical benchmark reports).
- **Historical artifacts (legitimate):** Changelogs (`sk-code/changelog/v4.2.1.0.md`, `sk-create-benchmark/changelog/v1.4.0.0.md`, `v1.3.0.0.md`) mention deep-alignment in past-tense release notes — correct, changelogs document history. Benchmark report JSONs under `system-deep-loop/benchmark/reports/` contain captured stderr from past runs referencing `/deep:alignment` — immutable historical artifacts, not active code.
- **Generated metadata consistency:** `mode-registry.json` (6 modes, `deprecatedModes: []`), `leaf-manifest.json` (6 packet entries: deep-improvement x3, deep-ai-council, deep-research, deep-review), `command-metadata.json` (4 packet keys covering 6 modes), `graph-metadata.json` (deep-ai-council, deep-improvement, deep-research, deep-review + structural nodes) — all clean, no alignment/command-benchmark references.
- **Surviving command files:** 6 present (agent-improvement, ai-council, model-benchmark, research, review, skill-benchmark) — matches mode-registry.
- **Dangling symlinks:** 0 found in `.claude/commands/` and `.cursor/commands/` (commit b955f937fc9 removed the 4 dangling mirrors).

### 2. Executor single-dispatch routing (commit d1a5981b58c)
- **Soundness:** Added `if_cli_cursor`/`if_cli_devin`/`if_cli_pi` branches to `deep-review-auto.yaml`, `deep-research-auto.yaml`, `deep-alignment-auto.yaml`. Each reuses `buildLineageCommand` from `fanout-run.cjs` (single source of truth shared with fan-out path). `buildLineageCommand` throws on missing binary or disallowed model → fail-closed, no silent native fallback.
- **Consistency:** The `deep-alignment-auto.yaml` routing branches were added in commit #2, then the entire file was deleted in commit #3 (8849444aa61). No orphan — the routing was correctly removed with the mode.
- **Verified claim:** Commit message cites "targeted auto-YAML vitest 71/71; node:test 767/17 == baseline." Not independently re-run this iteration (observation-only); cited as author evidence.

### 3. Phase-0 gate retirement (commit e41aa1878ad)
- **Safety boundary analysis:** The Phase-0 dispatch-context gate asked the model to self-classify "real invocation vs pasted-inline" — classification of provenance the model cannot observe from inside the prompt. The commit message documents a confirmed false-positive block (GPT-5.6-Luna hard-blocked genuine /deep:review). An Opus 5 architect review concluded the gate was unfixable in-prompt and redundant with the deterministic harness guard.
- **Harness guard verification:** `isCommandDrivenIteration` exists at `dispatch-guard.cjs:142`, exported at line 607, and is called at line 557. This is the deterministic guard that validates against on-disk config in the plugin host — it does not rely on model self-classification. The retirement removed the redundant in-prompt gate while preserving the real deterministic protection.
- **Residual markers:** grep for `PHASE 0`, `DISPATCH-CONTEXT`, `general_agent_verified`, `dispatch_context_verified` in `.opencode/commands/deep/` and `.opencode/commands/prompt/` — **zero matches**. Clean removal.
- **Verdict:** Retiring the Phase-0 gate did **not** remove a real safety boundary. The deterministic harness guard remains.

### 4. Documentation matches code
- **README.md** (commit 69d5c223668): grep for `alignment`, `command-benchmark`, `conformance` — zero matches. Counts refreshed.
- **cli-opencode/SKILL.md** (commit 6303c12ad27): Added explicit-model hard rule + troubleshooting note for 429-retry hang. Root cause (out-of-quota default provider → infinite 429 retry → appears hung) is plausible and well-documented. The commit also records a supersession note on the 024 executor-kind-routing packet, acknowledging its completion evidence cited an auto-loop YAML that the deep-alignment cascade later deleted — honest documentation of the cascade effect.

## SCOPE VIOLATIONS
None. All writes confined to the three allowed state files.

## Next Dimension

**Security** (D2) — gate removal safety boundary deep-dive, write-containment in the new executor branches, untrusted-content handling in prompt packs.

## Verdict

**PASS** — No P0 or P1 findings. One P2 (orphan git-ignored authority-state file, inert and harmless). The deep-alignment removal is complete and correct across all active surfaces; generated metadata is consistent with 6 surviving modes; executor single-dispatch routing is sound (fail-closed, no silent native fallback); Phase-0 gate retirement did not remove a real safety boundary (deterministic harness guard remains); documentation matches code.

Review verdict: PASS
