---
title: "Tasks: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "gpt-6 cutover tasks"
  - "luna sol rename checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: GPT-6 Luna and Sol cutover with LLM Gateway Luna routes and Opus 5.5 in cli-claude-code

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] T001 Confirm the GPT-6 ids against three live catalogs: `~/.codex/models_cache.json` lists `gpt-6-luna` (low to max) and `gpt-6-sol` (low to ultra), `opencode models openai` lists both plus `-fast`, and LLM Gateway `/v1/models` lists both bare ids, 1.05M context, 128K output, efforts `none` to `max`
- [x] T002 Capture baselines before any edit. Deep-loop runtime six suites: 391 passed, 1 skipped, exit 0, 221 s; `npm run typecheck` exit 0. Council `orchestrate-session-cli`: 20/21 with one pre-existing failure on a stale `deepseek-v4-flash` literal. Model-benchmark `remediation`: 34/35 with one pre-existing failure of the same cause. Pi fast-mode extension: 77/77. Drift-guard wrapper: rc 1, 9 errors and 16,569 warnings, none in a file this packet touches. `sync-skills-hermes.cjs --check`: 6 mirrors already drifted (cli-hermes, cli-opencode, cli-pi, sk-design, sk-create-changelog, deep-ai-council)
- [x] T003 Enumerate the in-scope files and the exclusions (an inventory built in the session scratchpad from a PCRE scan that skips `-max`; nothing written to this packet's `scratch/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scripted token rename over the enumerated list, skipping the Luna Max personas. Evidence: one `perl` pass over 66 files (51 docs, 15 code); 64 changed, +211/-211
- [x] T005 Deep-loop enforcement, mirrors, defaults and tests (`executor-config.ts`, `fanout-run.cjs`, `codex-dispatch.cjs`, eight test files). Evidence: the code diff is id swaps only, including `CODEX_DEFAULT_MODEL` and `PI_MODEL_PROVIDERS`
- [x] T006 Pi: `.pi/settings.json`, `.pi/models.json`, `.pi/custom-providers.md`, and the cli-pi LLM Gateway section. Evidence: `llmgateway` gains `gpt-6-luna`, `enabledModels` renamed plus `llmgateway/gpt-6-luna`; docs say four gateway models. The `openai-codex` block first written here was removed on operator direction, and `pi update --models` put both GPT-6 ids in Pi's catalog instead
- [x] T007 Hermes roster rows: replace the 5.6 "probed live" standing with what was checked for the GPT-6 ids. Evidence: `cli-hermes/SKILL.md` roster paragraph and `references/providers-and-models.md` rows now read catalog-listed 2026-09-23; after the live smoke, `gpt-6-luna` reads probed live and `gpt-6-sol` still pending
- [x] T008 cli-claude-code: every Opus id to `claude-opus-5-5`, merging the rows that would duplicate. Evidence: 10 files; one Opus 5.5 row in `references/cli-reference.md` and `references/providers-and-models.md`; zero `claude-opus-4` hits in living docs
- [x] T009 Pi fast-mode extension: priority list, repo config, tests, README and playbook. Evidence: `src/config.ts`, both tests, the repo config JSON, README and playbook name `gpt-6-sol` and `gpt-6-luna`; the dated 2026-08-17 coverage note keeps its 5.6 wording
- [x] T010 [P] Version bumps and one changelog entry per affected skill. Evidence: cli-codex 1.9.1.0, cli-opencode 1.4.9.0, cli-pi 1.5.7.0, cli-hermes 1.0.2.0, cli-claude-code 1.5.1.0, each with `changelog/v<version>.md`
- [x] T011 Regenerate the Hermes mirrors and keep only the touched skills' mirrors. Evidence: the sync wrote 8; the 3 untouched mirrors were restored from the index; `git status .hermes` shows the 5 touched mirrors only. The later cli-hermes edit was regenerated into a scratch output directory and only that one mirror copied back
- [x] T017 Pi defaults, operator-directed: `.pi/pi-blackhole-config.json` to `openai-codex/gpt-6-luna` at `medium`, and `.pi/settings.json` to `llmgateway/gpt-6-luna` at `xhigh`. Evidence: both files parse. The settings first held the Codex route at `medium`, and a no-`--model` turn ran there; a running Pi session then saved the gateway route at `xhigh`, the operator kept it, and a no-`--model` turn ran on `llmgateway/gpt-6-luna` and replied `OK`
- [x] T019 Drop the redundant `xiaomi` block from `.pi/models.json`. Evidence: Pi's catalog listed `mimo-v2.6-pro` and `mimo-v2.6-pro-ultraspeed` with the same compat flags both before and after the refresh; `pi --list-models mimo-v2.6` still lists both under `xiaomi`; a `xiaomi/mimo-v2.6-pro` smoke replied `OK` on retry, after one exit-1 attempt whose log was overwritten
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Residue scan and the Luna Max persona guard. Evidence: one residue hit, the PI-017 captured-output cell kept as history; persona counts 26 files and 88 occurrences, identical before and after
- [x] T013 Suites and typecheck from the final state, compared to T002. Evidence: runtime six suites 391 passed, 1 skipped, exit 0, 248 s (baseline 391/1); typecheck exit 0; council 20/21 and model-benchmark 34/35 with the same two pre-existing failures; extension 77/77
- [x] T014 `pi --list-models gpt-6` and JSON parse of both pi files. Evidence: `llmgateway/gpt-6-luna`, `openai-codex/gpt-6-luna` and `openai-codex/gpt-6-sol` listed with built-in models intact, rerun after the catalog refresh; both files parse
- [x] T018 One-turn live smokes ("reply OK"). Evidence: Pi `openai-codex/gpt-6-luna`, `openai-codex/gpt-6-sol` and `llmgateway/gpt-6-luna` ($0.0009) and Hermes `gpt-6-luna` (session `20260923_075309_35eb04`) replied `OK`; Hermes `gpt-6-sol`, Codex and OpenCode were not run because the operator stopped the run; cli-claude-code refused because this session is itself Claude Code
- [x] T015 Drift-guard wrapper compared to baseline, frontmatter version gate, Hermes mirror check. Evidence: drift rc 1 with the identical 9-error set and 16,569 warnings, the touched-area warning set unchanged; frontmatter gate exit 0 (2,923 ok); mirror drift 6 before, 3 after, 2 on the final recheck, none of them touched skills
- [x] T016 `validate.sh --strict` on this packet. Evidence: `RESULT: PASSED` after the derived-metadata repair
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` §4 REQ-001 to REQ-008
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` §3 and §5
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: T001 catalog reads
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Typecheck and the edited suites pass. Evidence: T013
- [x] CHK-011 [P0] No new drift-guard error. Evidence: T015, identical 9-error set
- [x] CHK-012 [P1] Paired roster copies equal. Evidence: the `fanout-run.vitest.ts` pairing tests pass in T013
- [x] CHK-013 [P1] Comments keep the durable WHY and carry no packet ids. Evidence: the only code-comment edits are id swaps inside existing comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md`, eight rows Met
- [x] CHK-021 [P0] `pi --list-models gpt-6` shows the three new routes. Evidence: T014
- [x] CHK-022 [P1] Luna Max persona counts unchanged. Evidence: T012
- [x] CHK-023 [P1] Negative Cursor inputs still rejected. Evidence: `executor-config.vitest.ts` asserts `isCursorModelAllowed('gpt-6-sol-high-fast')` is false and passes in T013
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `class-of-bug`, a stale id repeated across producers and consumers. Evidence: this row
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed by residue scan. Evidence: T003 and T012
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the allowlists, mirrors, defaults, docs and tests. Evidence: `plan.md` affected-surfaces table; T005
- [x] CHK-FIX-004 [P0] Adversarial inputs covered: the Luna Max personas and the rejected Cursor inputs. Evidence: CHK-022 and CHK-023
- [x] CHK-FIX-005 [P1] Matrix axes listed: runtime (Codex, OpenCode, Pi, Hermes, Claude) by surface (docs, enforcement, tests, config). Evidence: `spec.md` Files to Change covers every cell that exists
- [x] CHK-FIX-006 [P1] Hostile env variant: `SKILL_BENCH_CODEX_MODEL` still overrides the `codex-dispatch.cjs` default. Evidence: `DEFAULT_MODEL` reads `gpt-6-luna` unset and `gpt-5.5` with the variable set
- [x] CHK-FIX-007 [P1] Evidence pinned to the final working-tree diff. Evidence: every check above ran after the last edit to its surface
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets; the gateway entries reuse `${LLMGATEWAY_API_KEY}`. Evidence: the new model object carries no key; the `openai-codex` routes use the existing Pi login
- [x] CHK-031 [P0] No allowlist widened beyond the renamed ids. Evidence: every allowlist hunk is a one-for-one swap
- [x] CHK-032 [P1] The Hermes roster stays closed at seven ids. Evidence: `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS` hold seven ids each
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized. Evidence: `validate.sh --strict` PASSED
- [x] CHK-041 [P1] Verification claims attached to renamed ids restated honestly. Evidence: T007 and the cli-opencode Pro-slug caveat
- [x] CHK-042 [P2] Changelogs written for every bumped skill. Evidence: T010
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: working files lived in the session scratchpad outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: the packet `scratch/` holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-23
<!-- /ANCHOR:summary -->

---
