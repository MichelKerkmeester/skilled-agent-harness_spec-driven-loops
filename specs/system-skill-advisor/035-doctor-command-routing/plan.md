---
title: "Implementation Plan: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines"
description: "Generate per-route doctor bridges from _routes.yaml through the existing bridge deriver, keep a passing skill above any doctor bridge, render the runnable /doctor:x target string as a top or second line and add a read-only /doctor:setup umbrella, gated by a per-prompt no-regression check."
trigger_phrases:
  - "doctor command routing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doctor command routing: the skill advisor surfaces runnable /doctor:x target lines

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime), Python 3 (fallback scorer), CommonJS (bridge deriver), YAML and Markdown (doctor commands) |
| **Framework** | None. The advisor is a daemon plus a CLI front door |
| **Storage** | None changed. Generated JSON and generated source blocks only |
| **Testing** | Vitest under `runtime/`, a standalone Python harness, shell and Node gate scripts |

### Overview

Doctor commands reach the advisor the same way every other command does: as `kind: 'command'` bridges written by `derive-command-bridges.cjs`. This plan teaches the deriver a third source, `_routes.yaml`, so each doctor route becomes one bridge whose phrases come from the manifest. A scoped ordering rule keeps a passing skill above any doctor bridge, which is what the Python scorer already does. The renderer then prints the runnable `/doctor:<command> <target>` string as the top line or as a second line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` sections 2 and 3)
- [x] Success criteria measurable (`spec.md` section 5, against the baseline below)
- [x] Dependencies identified (`spec.md` section 6 and section 6 below)

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] Every gate in section 5 passes from the final state, with output and exit status read
- [ ] The per-prompt comparison shows zero rows that passed at the start and fail at the end
- [ ] Docs updated (spec, plan, tasks, implementation summary)

### Measured Baseline (2026-10-15, HEAD `ede8b9137c`)

Every number below was produced by a command run during planning. The `dist` build was newer than every source file it compiles from.

| Gate | Command | Result |
|------|---------|--------|
| Routing benchmark | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` (no `--write`) | Exit 0. Labeled corpus 155 of 195, holdout 49 of 66, ambiguity 19 of 24. Unknown 13, gold-`none` false fires 5. Buckets: review 25 of 31, memory save 27 of 32, delegation 9 of 9. Identical to the committed baseline |
| Per-prompt snapshot | A scratch script calling the same `dist` scorer per row | Matches the aggregates row for row. It must be re-taken at task T001 because HEAD moves |
| Targeted vitest gates | The nine files in G3 below | Exit 0. 9 files, 66 tests passed |
| Python suite | `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Exit 0. 65 passed, 0 failed |
| CI corpus gate | `score-routing-corpus.py` with the CI flags (G6) | Exit 0. `overall_pass: true`, Python advisor 113 of 195 |
| Bridge drift guard | `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` | Exit 0. `fresh`, 27 entries, 5 TypeScript-active, 15 Python-active |
| Doctor manifest | `bash .skilled/commands/doctor/scripts/route-validate.sh` | Exit 0. 13 routes validated, 2 warnings |
| Probe prompts | The same `dist` scorer | "Help me set up skilled", "check my environment variables", "disable comment hygiene gate", "runtime mirror drift" and "skill budget audit" return nothing. "check my git hooks" and a typed `/doctor:git setup` both return sk-git at 0.8226 |

The live daemon was not running, so `advisor_recommend --warm-only` answered exit 75 (backend unavailable). Planning did not start a daemon. The full advisor vitest suite (`npm test`) was not run during planning, so task T001 captures its count.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Generated projection. One authored manifest feeds a deriver, the deriver writes a JSON projection plus marked blocks inside the scorer sources, and the scorers read those blocks. The plan adds a source to this pipeline and adds no new layer.

### Key Components

- **`_routes.yaml`** stays the single authored source for doctor routes and their trigger phrases.
- **`derive-command-bridges.cjs`** reads the manifest as a third source next to `command-metadata.json` and `allow-list.json` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:386-413]. It builds one inventory entry per route and fills the TypeScript keywords, intent signals and name from the manifest. It also writes a small id-to-runnable-string block into `render.ts`, using the same marked-block writer it already uses for `projection.ts` and `skill_advisor.py` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:353-380].
- **`scoring-compatibility.json`** decides which doctor bridges are active and in what order, in both scorers. It is the wave switch.
- **`fusion.ts`** gains one ordering rule. A doctor bridge never sorts above a skill that passes the threshold, unless the prompt contains a doctor slash command. The existing sort starts at `fusion.ts:775`.
- **`render.ts`** prints the doctor string. It is the top line when a doctor bridge is first. It is a second line when a skill is first and a doctor bridge also passes. The no-match fallback gains one bounded hint naming `/doctor:setup`, shown only when the render options carry a setup-wording flag.
- **The Claude hook** sets that flag when an unmatched prompt uses setup, install, check or configure wording. The hook already holds the prompt and calls the fallback at `user-prompt-submit.ts:336`, so the renderer keeps its rule of never reading prompt text [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:391-392]. The Pi hook calls the fallback with no arguments, so Pi shows no hint.

### Operator Decisions (2026-10-15)

- Python stays on slash markers only, so plain phrases route through TypeScript only.
- The no-match hint is conditional on setup, install, check or configure wording, with a negative test for an unrelated prompt.
- `/doctor:deep-loop` and the `/doctor:mcp` sub-actions move to a later wave and stay inactive here.
- Every CI job that runs the bridge generator gets the `yaml` parser, through task T010.
- "update skilled to the latest release" keeps a skill first, with `/doctor:update` as the second line.
- **`/doctor:setup`** is a read-only, single-route router whose workflow calls the existing read-only scripts and prints a runnable repair command per failing leg.

### Data Flow

A prompt reaches the TypeScript scorer, which scores skills and active bridges together. The ordering rule moves any doctor bridge below a passing skill. The renderer reads the top two passing recommendations. When the first is a skill and a later one is a doctor bridge, it appends the doctor string from the generated lookup. The Python scorer receives the same active bridges through its generated block, but matches them only on their slash markers.

### Runnable String Rule

The string is the command, plus a space and the target when the command owns more than one route. That follows the manifest's own rule that a single-route command needs no target [SOURCE: .skilled/commands/doctor/_routes.yaml:12]. Two exceptions come from the routers. `/doctor:env` renders as `/doctor:env list`, because with no selector it stops at a menu [SOURCE: .skilled/commands/doctor/env.md:31-32]. `/doctor:update` renders bare, because bare runs the read-only `check` action [SOURCE: .skilled/commands/doctor/update.md:16].
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is a feature, but it changes shared scoring policy and the public brief, so the table is filled. No review Planning Packet exists, so nothing is imported.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `derive-command-bridges.cjs` | Producer of every bridge projection | Update: third source, runnable lookup block | `--check` reports `fresh` after regeneration |
| `scoring-compatibility.json` | Activation switch per scorer | Update: doctor entries per wave | Deriver validation at `derive-command-bridges.cjs:145-196` |
| `projection.ts` generated block | TypeScript bridge consumer, filters `routingEnabled` at `projection.ts:623-627` | Regenerated only | Drift guard test |
| `skill_advisor.py` generated block | Python bridge consumer, `skill_advisor.py:2736-2747` | Regenerated only | `--check-command-bridges` path and the Python suite |
| `fusion.ts` ordering | Final sort, command demotion at `fusion.ts:776-777` | Update: doctor-below-passing-skill rule | New ordering test, per-prompt comparison, parity gates |
| `render.ts` brief and fallback | Public brief text | Update: second line, hint, lookup block | Renderer tests and hook tests |
| `lib/subprocess.ts` | Parses Python output into recommendations | Unchanged, not a consumer of the new fields | `rg -n "kind" .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` |
| Holdout-independence declarations | Lists every corpus reader at `holdout-independent.vitest.ts:75-83` | Unchanged. The slice gate reads only its own file | Gate G3 |
| Corpus hash pins | `scorer-eval-baseline.json:5-7` and CI at `routing-registry-drift.yml:316` | Unchanged. The pinned corpora are not edited | Gates G3 and G6 |
| Runtime mirrors | `.claude`, `.codex`, `.pi`, `.hermes`, `.cursor` command trees | Generated for `/doctor:setup` | Gate G10 |
| Claude prompt hook | Calls the fallback renderer at `user-prompt-submit.ts:336` | Update: compute and pass the setup-wording flag | T016 hint tests and the hook tests in G4 |
| Pi prompt hook | Calls the fallback with no arguments at `prompt-advisor.ts:283` | Unchanged, so Pi shows no hint | Recorded limitation |
| CI workflows that run the generator | Install steps per job | Update where the `yaml` parser is missing | T010 job list |

Required inventories, run at task T002:
- Same-class producers: `rg -n "GENERATED COMMAND BRIDGES|kind === 'command'|kind_priority" .skilled/skills/system-skill-advisor/runtime`.
- Consumers of changed symbols: `rg -n "renderAdvisorBrief|renderAdvisorFallbackDirective|GENERATED_COMMAND_BRIDGES" .skilled --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: prompt kind (onboarding, uncontested diagnostic, contested diagnostic, skill-shaped control, typed slash command, gold-`none`) by scorer (TypeScript, Python) by render mode (single, ambiguous, no-match).
- Ordering invariant: no doctor bridge sorts above a passing skill unless the prompt contains that doctor command's slash marker.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The order is fixed: measurement first, then the umbrella command, then generation, then the ordering rule and renderer, then waves and the remaining guidance.

### Execution Model

DeepSeek V4.1 Flash at `--thinking max`, dispatched through cli-pi, makes the edits one at a time. The orchestrator writes every brief, owns every gate and verifies every return. Dispatches use the child envelope from the cli-pi contract [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:178-186]:

```bash
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" \
  --model opencode-go/deepseek-v4.1-flash \
  --thinking max --mode text --offline \
  </dev/null > stdout.log 2> stderr.log
```

Each brief obeys four rules taken from the contract:

1. **One change per brief.** It names one file, one edit and the check that proves it, because a five-change DeepSeek V4.1 Flash brief once read about 995,000 characters in 25 minutes and wrote nothing [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:218].
2. **The child-dispatch preamble goes at the top of the brief.** The environment variable alone does not stop the child asking the spec-folder question [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:217].
3. **The brief carries the persona inline** and names the files to read, the frozen write scope and the shape of the answer.
4. **`</dev/null` on every dispatch.** Without it the child hangs and prints nothing [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:188].

After every return the orchestrator runs three checks before sending the next brief:

- **Diff check.** `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git diff --stat` plus `git status --short` names only the file the brief authorized. Anything else is reverted.
- **Mutation check.** The orchestrator breaks the new behavior on purpose, for example by deleting the new ordering rule or one admitted phrase, then runs the task's proving test and confirms it fails. It restores the change and confirms the test passes again. A test that stays green under the mutation does not count as proof.
- **Gate check.** The task's named gate from section 5 runs, and its output and exit status are read. The exit code alone is never the verdict.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deriver doctor source, ordering rule, renderer second line and hint | Vitest under `runtime/tests/`, and the Python harness for the Python block |
| Integration | Slice gate, per-prompt comparison, parity, ratchets, drift guard, reach probe | Vitest, Node scripts, `route-validate.sh` |
| Manual | `/doctor:setup` in a live session, plus the two probe prompts through the daemon | A live advisor session |

### Gate Commands

Run from the repository root unless a step says otherwise. Rebuild before any gate that reads `dist`.

| ID | Gate | Command |
|----|------|---------|
| G0 | Build and typecheck | `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` and `npm --prefix .skilled/skills/system-skill-advisor/runtime run typecheck` |
| G1 | Bridge drift guard | `node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check` |
| G2 | Doctor manifest | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| G3 | Advisor routing and parity suites | `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/python-ts-parity.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts tests/routing-golden-prompts.vitest.ts tests/command-bridges-drift-guard.vitest.ts tests/command-bridge-resolution-guard.vitest.ts tests/command-binding-existence.vitest.ts tests/legacy/advisor-renderer.vitest.ts` |
| G4 | Full advisor vitest suite | `npm --prefix .skilled/skills/system-skill-advisor/runtime test` |
| G5 | Python suite | `python3 .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` |
| G6 | Routing benchmark | `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`, then from `runtime/`: `python3 scripts/routing-accuracy/score-routing-corpus.py --dataset "$PWD/scripts/routing-accuracy/labeled-prompts.jsonl" --min-advisor-accuracy 0.5333 --min-gate3-f1 0.9843 --min-joint-tt 101 --max-joint-ft 3 --max-joint-ff 1 --require-historical-clean` |
| G7 | Scorer parity | `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/parity/python-ts-parity.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts` |
| G8 | Doctor slice | `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/doctor-routing-slice.vitest.ts` (created at T004) |
| G9 | Doctor reach probe | `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` (created at T019) |
| G10 | Runtime mirrors and catalog | `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check`, `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check`, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-prompts-hermes.cjs --check`, `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` |
| G11 | Per-prompt comparison | The packet's per-prompt script against the T001 snapshot. Zero rows may move from pass to fail |
| G12 | Packet validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/035-doctor-command-routing --strict`, requiring `RESULT: PASSED` |

### Baseline Rule

Ratchet G3 holds every count exactly, so an improvement fails it as surely as a regression [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/parity/scorer-eval-baseline-ratchet.vitest.ts:5-13]. If a wave legitimately changes a count, the orchestrator re-captures with `capture-scorer-eval-baseline.mjs --write`, but only after G11 shows zero lost rows. The re-capture is named in the implementation summary with its before and after counts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `yaml` 2.9.1 from `.skilled/package.json:11` | Internal | Yellow. It resolves locally. The golden-prompt CI job installs no `.skilled` packages (`routing-registry-drift.yml:249-253`) | The deriver cannot read `_routes.yaml` in that job. Task T010 adds the install step to every CI job that runs the generator and lacks it |
| Built `dist` for the advisor runtime | Internal | Green, it was current at planning | The capture measures stale code |
| cli-pi with `opencode-go/deepseek-v4.1-flash` | External | Green per the roster, not probed during planning | Edits fall back to the orchestrator under the same one-change rule |
| `python3` with PyYAML for `route-validate.sh` | Internal | Green, G2 ran at planning | The manifest cannot be validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any row that passed at T001 fails, a parity or ratchet gate fails without a reviewed re-capture, or the brief exceeds its token cap.
- **Procedure**: Remove the failing wave's entries from `scoring-compatibility.json` and rerun the deriver. The bridges stay in the inventory but inactive, which is the state 22 of today's 27 bridges are in for TypeScript. Code changes revert by file with `git restore` before commit, or `git revert` of the wave's commit after it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Measure) ──► Phase 2 (Umbrella) ──► Phase 3 (Generate) ──► Phase 4 (Order + Render) ──► Phase 5 (Waves + Guidance) ──► Phase 6 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure (snapshot, slice) | None | Everything, since no later change is measurable without it |
| Umbrella (`/doctor:setup`) | Measure | Generate, since the bridge needs a route to point at |
| Generate (deriver, inactive bridges) | Umbrella | Order and render |
| Order and render | Generate | Waves |
| Waves and guidance | Order and render | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure | Low | About 1 hour |
| Umbrella | Med | 2 to 3 hours including mirrors |
| Generate and activate | High | 3 to 4 hours |
| Order and render | Med | 2 to 3 hours |
| Waves and guidance | Med | 2 to 4 hours, depending on how many contested rows need rewording |
| Verification | Med | About 2 hours |
| **Total** | | **12 to 17 hours of orchestrated dispatches** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The T001 per-prompt snapshot exists in the packet's `scratch/` and its counts match G6
- [ ] Every doctor bridge lands inactive first, so activation is a separate, reversible step
- [ ] The renderer change is covered by a test that fails when the second line is removed

### Rollback Procedure
1. Remove the wave's doctor entries from `scoring-compatibility.json` and rerun the deriver.
2. Revert the code change by file, or revert the wave's commit.
3. Rerun G1, G3 and G11 and confirm the T001 numbers return.
4. Record the rollback and its reason in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Every changed file is source or generated output.
<!-- /ANCHOR:enhanced-rollback -->

---
