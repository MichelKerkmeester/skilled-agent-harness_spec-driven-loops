---
title: "Tasks: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines"
description: "Ordered tasks: measure first, add the /doctor:setup umbrella, generate inactive doctor bridges, add the ordering rule and the runnable line, then activate phrases in waves, each checked against a per-prompt baseline."
trigger_phrases:
  - "doctor command routing tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines

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

Every task is one cli-pi brief, or one orchestrator step where the task says so. Gate IDs such as G3 refer to the gate table in `plan.md` section 5. After each task the orchestrator runs the diff check, the mutation check where a test proves the task, and the named gate.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Measure before any runtime change

- [ ] T001 Orchestrator: rebuild with G0, then re-take the per-prompt snapshot of the labeled, holdout and ambiguity corpora at the implement HEAD, and run G4 once to record the full suite count. Store the snapshot with its HEAD in the packet's `scratch/baseline-per-prompt.json` (`specs/system-skill-advisor/035-doctor-command-routing/scratch/`)
- [ ] T002 Orchestrator: run the three inventories in `plan.md` (Fix Addendum) and record what they return in `scratch/inventories.md`
- [ ] T003 Author the doctor slice: onboarding prompts for `/doctor:setup`, the `/doctor:env` prompts, the three Wave A diagnostics, the contested diagnostics per route, ten skill-shaped controls, three typed slash commands and gold-`none` controls. Each row carries `id`, `prompt`, `expected_top`, `expected_second` and `wave`. No row may repeat a holdout prompt (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl`)
- [ ] T004 Create the slice gate. It scores the slice under the pinned force-local regime, asserts only rows whose wave is active in `scoring-compatibility.json` and reads none of the pinned corpora (`.skilled/skills/system-skill-advisor/runtime/tests/doctor-routing-slice.vitest.ts`). Proof: G8 passes with zero active waves, then fails when one row's wave is flipped to active
- [ ] T005 Orchestrator: write the per-prompt comparison script for G11 in the packet's `scratch/` and prove it with a negative control. Flip one passing row's gold label in a temporary copy and confirm the script reports it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### The /doctor:setup umbrella

- [ ] T006 Create the read-only, single-route router with a `skill_agent` tag, no positional target and a pointer to its two assets (`.skilled/commands/doctor/setup.md`)
- [ ] T007 Create the workflow and presentation contract. The workflow lists every doctor target with what it checks, runs the existing read-only legs (`sk-code-setup-check.cjs`, `git-setup-check.cjs`, `generate-trigger-index.mjs --check --json`, `sync-runtime-mirrors.cjs --check`, `advisor_status --warm-only`) and prints a runnable repair command per failing leg (`.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/commands/doctor/assets/doctor-setup-presentation.txt`)
- [ ] T008 Add the `/doctor:setup` route with `mutating: read-only`, its script invocations and onboarding trigger phrases (`.skilled/commands/doctor/_routes.yaml`). Proof: G2
- [ ] T009 Orchestrator: generate the runtime mirrors with the sync scripts in write mode, then add the catalog row and change the command count from 9 to 10 (`.skilled/commands/README.txt`). Proof: G10

### Bridge generation, inactive first

- [ ] T010 List every CI job that runs the bridge generator, directly or through the Python bridge check or a test that calls either. For each job, check whether it installs the `.skilled` packages that carry `yaml`. Add an `npm --prefix .skilled ci` step, or an equivalent install, to each job that lacks it, starting with the golden-prompt job, which installs only system-spec-kit and the advisor runtime (`.github/workflows/routing-registry-drift.yml`, plus any other workflow the listing names). Proof: the job list with each job's install line in `scratch/ci-yaml-check.md`, and `node -e "require.resolve('yaml')"` run from the deriver's folder
- [ ] T011 Add `_routes.yaml` as a third inventory source. Emit one entry per route plus `/doctor:update`, `/doctor:env` and `/doctor:setup`, with ids `command-doctor-<command>[-<target>]`, `skillId` from the router's `skill_agent` tag and `ownerMode` equal to `skillId`. Add no activation yet (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs`). Proof: G1 reports the new count, and G3 plus G11 show no scoring change
- [ ] T012 Add `BEGIN GENERATED DOCTOR COMMANDS` and `END GENERATED DOCTOR COMMANDS` markers to the renderer, with an empty lookup between them (`.skilled/skills/system-skill-advisor/runtime/lib/render.ts`)
- [ ] T013 Teach the deriver to fill the TypeScript `name`, `keywords`, `intentSignals` and `domains` of doctor entries from the manifest, the Python `slashMarkers` from the runnable string only, and the renderer lookup block from the runnable string rule (`derive-command-bridges.cjs`). Proof: a deriver test that fails when a manifest phrase is missing from the generated keywords, plus G1

### Ordering rule and runnable line

- [ ] T014 Add the ordering rule: a doctor bridge never sorts above a skill that passes the threshold, unless the prompt contains that bridge's slash marker (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`). Proof: a new test that fails when the rule is deleted, plus G3 and G11
- [ ] T015 Render the doctor string. It is the top line when a doctor bridge is first. It is a second line when a skill is first and a doctor bridge also passes. It stays inside the token cap and passes the label sanitizer (`render.ts`). Proof: renderer tests for both shapes, one test for an unmapped doctor id rendering nothing, plus the hook tests in G4
- [ ] T016 Add the bounded no-match hint naming `/doctor:setup`, gated on a setup-wording flag in the render options. The Claude hook sets the flag when the prompt uses setup, install, check or configure wording, so the renderer never reads prompt text (`render.ts`, `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts`). Proof: one test where a setup-worded unmatched prompt shows the hint, one where a plain unrelated unmatched prompt such as "what is the capital of France" shows none, and the hint test failing when the flag check is deleted. Record the byte delta in the implementation summary

### Manifest phrases and waves

- [ ] T017 Give `/doctor:env` a manifest entry with diagnostic trigger phrases, add plain-word phrases to `/doctor:update` and rewrite the header to drop "inert today" and the stale `skill_advisor.py:810-871` citation (`.skilled/commands/doctor/_routes.yaml`). Proof: G2 and G1
- [ ] T018 Wave A: activate `/doctor:setup`, `/doctor:env list`, `/doctor:git hooks`, `/doctor:runtime-mirrors` and `/doctor:skill-advisor skill-budget` in both scorer lists (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json`). Proof: G0, G1, G3, G5, G7, G8 and G11, with zero lost rows
- [ ] T019 Create the doctor reach probe. It reads every admitted phrase, scores it in process under the pinned regime and fails when a phrase reaches neither the top line nor the second line of its bridge. Wire it into the router-reach route's script invocations and workflow (`.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs`, `_routes.yaml`, `.skilled/commands/doctor/assets/doctor-router-reach.yaml`). Proof: G9 passes, then fails when one admitted phrase is renamed, plus G2
- [ ] T020 Wave B: activate `/doctor:git setup` and `/doctor:git standards` (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11, with sk-git still first on its own prompts
- [ ] T021 Wave B: activate `/doctor:sk-code` (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11
- [ ] T022 Wave B: activate the remaining `/doctor:skill-advisor` targets (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11
- [ ] T023 Wave B: activate `/doctor:speckit` and `/doctor:update` (`scoring-compatibility.json`). Proof: G3, G8, G9 and G11
- [ ] T024 Name the `_routes.yaml` source in the bridge README, and note that `/doctor:deep-loop` and the `/doctor:mcp` sub-actions stay inactive until a later wave (`.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T025 Orchestrator: run G0 through G12 from the final state and read every output and exit status
- [ ] T026 Orchestrator: run G11 against the T001 snapshot and write the delta, including the rows that did not move, into `implementation-summary.md`. If a count moved, re-capture with `capture-scorer-eval-baseline.mjs --write` only after G11 shows zero lost rows, and record both counts
- [ ] T027 Orchestrator: confirm SC-001 under the pinned regime. "Help me set up skilled" must return `/doctor:setup` and "check my environment variables" must return `/doctor:env list`. Repeat through a live daemon if one is running
- [ ] T028 Orchestrator: run `/doctor:setup` once in a live session and confirm it writes nothing (`git status --short` before and after)
- [ ] T029 Orchestrator: fill `implementation-summary.md`, mark every row of `acceptance-criteria.md` with evidence, remove scratch residue and run G12 for `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every row of `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [ ] G11 shows zero rows lost against the T001 snapshot
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance**: See `acceptance-criteria.md`
- **Research**: See `specs/system-skill-advisor/034-doctor-command-guidance/research/research.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-015, each with file and line evidence)
- [x] CHK-002 [P0] Technical approach defined in plan.md (sections 3 and 4)
- [ ] CHK-003 [P1] Dependencies identified and available (T010 adds the `yaml` install step to every CI job that runs the generator and lacks it)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] G0 build and typecheck pass
- [ ] CHK-011 [P0] No new warnings in G3 or G4 output
- [ ] CHK-012 [P1] The deriver fails with a named error on a route whose router lacks a `skill_agent` tag
- [ ] CHK-013 [P1] Code follows the sk-code conventions for the runtime, with no ephemeral ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] G11 shows zero lost rows against the T001 snapshot
- [ ] CHK-022 [P1] Edge cases tested: typed bare command, typed command with target, single-route command, unmapped doctor id and a plain unrelated unmatched prompt showing no hint
- [ ] CHK-023 [P1] Every proving test failed under its mutation check before it was counted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each change carries its class. The ordering rule is `class-of-bug` scope, since it governs every doctor bridge. The renderer line is `cross-consumer`, since the hook brief and the Python path both reach it
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed at T002
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the renderer, the generated blocks and the compatibility file
- [ ] CHK-FIX-004 [P0] Label sanitizing covers doctor strings, with an instruction-shaped label rejected in a test
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion (plan Fix Addendum)
- [ ] CHK-FIX-006 [P1] Gates run under the pinned force-local regime with semantic search off
- [ ] CHK-FIX-007 [P1] Evidence pinned to the final commit SHA, not a branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets in any brief or file
- [ ] CHK-031 [P0] `/doctor:setup` declares `mutating: read-only`, G2 passes and T028 shows no write
- [ ] CHK-032 [P1] Rendered doctor strings come only from the generated lookup, never from prompt text
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks synchronized
- [ ] CHK-041 [P1] The `_routes.yaml` header names its consumer correctly
- [ ] CHK-042 [P2] The command catalog and the bridge README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, keeping only the evidence files the summary cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 2/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-10-15
<!-- /ANCHOR:summary -->

---
