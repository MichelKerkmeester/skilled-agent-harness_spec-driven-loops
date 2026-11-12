---
title: "Implementation Plan: Phase 3: plain-chat-command-reach"
description: "Makes a plain-chat prompt reach its slash command. Hub commands attach to the owner skill's recommendation through one shared pure function, the 8 commands with no hub mode get scored rows from hand-authored phrases, doctor routes gain diagnostic phrases, and activation, the read-only flag and same-owner ranking follow the command metadata. The harness is extended first and proven to change no number."
trigger_phrases:
  - "plain chat command reach plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: plain-chat-command-reach

<!-- SPECKIT_LEVEL: 3+ -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime and hook), Node CommonJS and ESM scripts, Python 3 (`skill_advisor.py`), JSON and JSONL |
| **Framework** | None. Zod for the output schema |
| **Storage** | `command-metadata.json` per skill, `mode-registry.json` per hub, `scoring-compatibility.json`, `command-bridges.generated.json`, the routing corpora |
| **Testing** | Vitest in `ADV`, the Python tests run by the suite, the two capture scripts |

### Overview
Seven workstreams: harness, attach, phrases, one activation source, read-only from the class and same-owner collapse run in order, and doctor phrases run beside attach through read-only. The attach rule is one exported pure function that the handler and the harness both call, so the harness measures the shipped rule and can be proven neutral before any scorer change. The proof is the extended phase 1 capture reporting own-row and attached reach per split, false offers at 0 of 35, the four pinned numbers no worse and no typed command ambiguous with its own owner.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Commands run from the repository root. `ADV`, `D`, `G`, `C`, `B` and `S` are defined in `tasks.md`.

### Definition of Ready
- [ ] `npm run build` in `ADV` exits 0, then `node $C | jq -c .metrics` equals `jq -c .metrics $B`
- [ ] `node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` gives `[158,50,20,5]` for the four pinned numbers
- [ ] `node $D --check | jq -r .status` prints `fresh`
- [ ] `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 and `npx vitest run tests/doctor-routing-slice.vitest.ts` in `ADV` reports 0 failed

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is `Met`
- [ ] `npm test` in `ADV` reports 0 failed, `node $D --check | jq -r .status` prints `fresh` and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs | tail -1` reports `failed=0`
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same files
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Attach, project, collapse. A hub command rides on its owner skill, a non-hub command is projected from metadata into its own row, and rows for one command collapse to one.

### Key Components
- **Harness extension in `capture-command-routing-baseline.mjs`**: counts a row as reached by attachment when the top recommendation is the expected command's owner skill and the attach function returns that command. Without it a command carried as a field is never counted, because the harness reads only `recommendations[0..2].skill` (`:150-155`) and maps TypeScript-enabled bridge ids to commands (`:136-144`).
- **`ADV/lib/command-attach.ts`**: one exported pure function `attachCommand(skillId, compiledRoute, prompt)` and a generated block `MODE_COMMANDS` that maps `<hubId>/<workflowMode>` to a command. Without one shared function the harness would measure a copy of the rule, and its neutral run would prove nothing about the handler.
- **Deriver lookup**: `derive-command-bridges.cjs` writes `MODE_COMMANDS` from the three hub registries, 13 of 15 `sk-doc` modes, 3 of 3 `sk-design` and 3 of 3 `system-deep-loop`, 19 in total. Without it the handler would read three registry files on every request, because compiled-route targets carry no command.
- **Handler and schema**: `enrichCompiledRoutes` (`ADV/handlers/advisor-recommend.ts:415`) calls the attach function once it holds a compiled route, and `publicRecommendation` (`:306`) passes `command` through. The schema gains `command: z.string().min(1).optional()` beside `workflowMode` and `compiledRoute` (`ADV/schemas/advisor-tool-schemas.ts:307-308`).
- **Hook**: `skill-advisor-cli-fallback.ts` sends `includeCompiledRoute: true` scoped to the top passing hub instead of `false` (`:212-226`), and `recommendationFromCli` (`:338-355`) keeps a string `command`. Without the second edit the field is dropped on the hook path.
- **Phrase projection**: the deriver reads `userIntent.ownedSignals` of the 8 non-hub entries and emits one active row per command into the generated blocks of `ADV/lib/scorer/projection.ts` and `ADV/scripts/skill_advisor.py`. The rows use the inventory ids the generated file already carries, such as `command-spec-kit-plan` and `command-speckit-save`.
- **Activation by construction**: `runtimeCompatibility` (`derive-command-bridges.cjs:652-686`) enables a non-doctor metadata command with no hub mode without a compatibility row, and fills `order` and the Python slash markers by default.
- **Read-only from the class**: `isReadOnlyRoute` (`derive-command-bridges.cjs:554-556`) is called for non-doctor rows too. Its flag already feeds `readOnlyRouteAllowed` (`ADV/lib/scorer/fusion.ts:689-692`) and the 0.82 floor (`:459-462`), so no scorer edit is needed for it.
- **Doctor phrases in `.skilled/commands/doctor/_routes.yaml`**: more `trigger_phrases` per route, per standalone command (`/doctor:update`, `/doctor:env` and the others under `standalone`) and per `/doctor:mcp` sub-action under `mcp_subroutes`, each of three or more words as the manifest schema requires. The deriver already copies them into the TypeScript scorer, and every doctor bridge is already active, so no deriver or scorer code changes for them. The manifest header says the deriver copies only the runnable command into the Python slash markers, so the Python scorer does not gain these phrases. `lead_phrases`, a subset of `trigger_phrases`, is used only where the doctor command must lead a passing owner skill. Without new wording, 17 of 17 doctor tune rows miss.
- **Same-owner collapse**: rows whose bridge resolves to one command merge before the top-K cut in `fusion.ts` and in the Python ranking, and `clustersWithTop` (`ADV/lib/scorer/ambiguity.ts:32-48`) never clusters a command row with its own owner skill.

### Data Flow
The scorer ranks skills and the now active non-hub command rows, collapses rows for one command, cuts to top K and sets `ambiguous` from `isAmbiguousTopTwo` (`fusion.ts:1403`). The handler asks `.skilled/bin/compiled-route.cjs --hub <id> --prompt-stdin` for each eligible hub, through `compiledRouteForRecommendation` (`advisor-recommend.ts:364`), and passes the result with the skill id and prompt to `attachCommand`. When the route is `action: route`, `selectionKind: single`, with one target whose mode is in `MODE_COMMANDS`, the command lands on that recommendation as `command`. For `system-deep-loop` the function also requires depth wording, per decision D3. The hook asks for the route of its top passing hub only and keeps the field. The harness runs the same scorer, asks the same front door for the top hub's route and calls the same function. Doctor rows reach their command as own rows, through bridge ids the harness already maps to commands.

### Attachment shape

```json
{"skillId":"sk-doc","command":"/create:readme","compiledRoute":{"hubId":"sk-doc","action":"route","selectionKind":"single","targets":[{"packetId":"sk-create-readme","workflowMode":"sk-create-readme"}]}}
```

The `sk-doc` registry row with `workflowMode` `sk-create-readme` carries `command` `/create:readme`, so this route attaches it. Other recommendation fields are left out. Whether the compiled route resolves this way for a given prompt is measured in task T014, not assumed here.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A as a fix. The table lists every reader of what this phase changes, because a public response field, a shared schema and generated scorer inputs all move.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ADV/schemas/advisor-tool-schemas.ts` | The strict recommendation schema, which rejects an unknown key | update: optional `command` | A schema test parses a recommendation with and without `command` |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Reads five fields per recommendation and asks for no route | update | The hook test in T017 |
| `ADV/lib/render.ts` | Renders the brief from the recommendation | unchanged: the brief does not change in this phase | `git diff --stat $ADV/lib/render.ts` prints nothing at close |
| `ADV/tests/command-bridges-drift-guard.vitest.ts` | Pins 5 TypeScript and 15 Python active non-doctor rows (`:199-225`) | update the counts to the generated activation | T029 |
| `ADV/tests/command-routing-slice.vitest.ts` | Compares the live capture with the committed baseline (`:110-121`) | unchanged code, baseline re-captured after the operator reads the delta | T040 |
| `ADV/tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Holds the pinned numbers at or above the baseline (`:243-275`) | unchanged | T036 |
| `ADV/tests/scorer/ambiguity-slice.vitest.ts` | Pins ambiguity outcomes | unchanged unless an umbrella id is relabelled | T036 |
| `ADV/tests/parity/holdout-independent.vitest.ts` | Holds holdout top 1 at or above the baseline (`:463`) | unchanged | T036 |
| `ADV/tests/scorer/native-scorer.vitest.ts`, `ADV/tests/python/test_skill_advisor.py`, `ADV/tests/parity/fixtures/local-native-approved-divergences.json` | Name the umbrella ids | update under option A | `rg -c 'command-spec-kit"|"memory:save|command-memory-save' <file>` prints nothing |
| `.skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` | Fails when a declared doctor phrase reaches neither the top pick nor the first doctor bridge behind it | unchanged code, must exit 0 after each doctor regeneration | T051 |
| `ADV/tests/doctor-routing-slice.vitest.ts` | Pins the top and second pick of each doctor slice row | unchanged | T051 |
| `.skilled/commands/doctor/scripts/route-validate.sh` | Validates the manifest schema, including three or more words per phrase | unchanged | T046 to T050 |
| `AGENTS.md:89` | Names `command-spec-kit` in Gate 4 | not this phase's: phase 005 | `git diff --stat AGENTS.md` prints nothing at close |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup rebuilds `ADV`, reproduces the phase 1 baseline and the four pinned numbers, saves both and times the hook. Implementation runs the seven workstreams, starting with the neutral harness extension in `capture-command-routing-baseline.mjs`, authoring doctor phrases in `_routes.yaml` beside attach through read-only and ending with the same-owner collapse in `fusion.ts`, `ambiguity.ts` and `skill_advisor.py`. Verification rebuilds, re-captures, compares reach, false offers, the pinned numbers and ambiguity with the baseline, times the hook again and runs the whole suite.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The one command is `npm run build && npm test` in `ADV`, which must report 0 failed, followed by `node $C` printing reach above 0 on both splits, `false_offer` `{"count":0,"total":35}` and the pinned capture printing values no worse than `[158,50,20,5]`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `attachCommand` over the route shapes, the D3 depth gate, the same-owner cluster rule and the read-only flag | Vitest, `tests/command-attach.vitest.ts` |
| Integration | The handler output with `command`, the hook carry-through with a stubbed CLI result, the drift guard and the Python parity tests | Vitest, the Python tests in the suite |
| Manual | Reach per split split into own-row and attached, the relabel list and the hook timing before and after | The two capture scripts, `jq`, the timing script in `scratch/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 corpus, harness and baseline | Internal | Green | No measurement of reach |
| Phase 002 metadata, classes and `commandPolicies` | Internal | Green | No read-only class and no file for the phrases |
| `.skilled/bin/compiled-route.cjs` with `--prompt-stdin` | Internal | Green | No hub command attaches |
| Operator decisions of 2026-11-12 | Decision | Green | Recorded as ADR-005 and ADR-006 |
| Doctor phrase reach probe and `tests/doctor-routing-slice.vitest.ts` | Internal | Green: probe `{"status":"ok","bridges":35,"missed":0}`, slice 2 passed | No proof that doctor phrases break no route |
| No new package | - | Green | - |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a pinned number drops, false offers rise above 0 or the hook output breaks on any runtime.
- **Procedure**: `git revert` of the phase's commits restores scoring, the schema and the hook. Then regenerate the derived files with `node $ADV/scripts/command-bridges/derive-command-bridges.cjs` and rebuild with `npm run build` in `ADV`, and confirm `node $D --check | jq -r .status` prints `fresh` and the pinned capture prints `[158,50,20,5]`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closing the phase and starting 004 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
W1 harness (neutral) ──► W2 attach ──► W3 phrases ──► W4 activation ──► W5 read-only ──► W6 collapse ──► verify
                                         └── umbrella-id replacement and relabels (W-E)
           W7 doctor phrases (authoring beside W2 to W5) ──► its regenerate joins the deriver sequence after W5 ──► verify
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| W1 harness and empty attach function | Setup | Attached reach 0, existing metrics byte-identical | W2 |
| W2 lookup, handler, schema, hook | W1 | `command` on the owner skill for hub commands | W3 |
| W3 phrases and per-command rows | W2 | One scored row per non-hub command | W4 |
| W4 activation by construction | W3 | No hand-written non-doctor activation row | W5 |
| W5 read-only from the class | W4 | `readOnly` on `/speckit:search` | W6 |
| W6 same-owner collapse | W5 | No same-owner ambiguity, one entry per command | Verification |
| W7 doctor phrases | Setup for authoring, W5 for its regenerate | Doctor plain recall above 0, probe exit 0 | Verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **W1 harness proven neutral** - one script and one new module - CRITICAL
2. **W2 and W3 through the shared files** - `derive-command-bridges.cjs`, `projection.ts` and `skill_advisor.py` edited in sequence - CRITICAL
3. **W6 collapse and the full verification run** - two scorer modules, the Python ranking and the suite - CRITICAL

**Total Critical Path**: no duration is measured yet. Record the wall time of each workstream in `implementation-summary.md`.

**Parallel Opportunities**:
- The hook edit and the schema edit in W2 can run beside the handler edit, since each owns its own file.
- Phrase authoring in the two metadata files can run while the W2 handler edit is reviewed.
- Doctor phrase authoring in `_routes.yaml` runs beside W2 to W5. Only its regenerate waits for the deriver sequence.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Harness neutral | `diff` of the re-captured `{rows,metrics,commands,unreachable}` against `$S/baseline-before.json` prints nothing, and attached reach reads 0 | End of W1 |
| M2 | Hub commands attach | `advisor_recommend` on a tune `/create` prompt returns `command` on `sk-doc` | End of W2 |
| M3 | Reach without regression | Capture shows reach above 0 on both splits against the ceiling 44, doctor reach above 0 of 17 on tune, false offers 0 of 35, pinned numbers no worse | End of Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Attach hub commands instead of scoring them

**Status**: Accepted

**Context**: The review's R2 part A finds that the owner skill already passes for plain prompts and that commands as candidates misbehave: a typed `/speckit:plan` is ambiguous with its owner and `save context` spends two of three slots on one command.

**Decision**: Keep the owner skill as the scored candidate and attach the hub command when the compiled hub resolves one mode with a command. The 17 disabled hub rows stay disabled.

**Consequences**:
- Hub commands reach plain chat with no new scored candidate, so the pinned numbers are not exposed to them.
- Reach depends on the compiled route resolving one mode. Mitigation: rows that the route resolves to `ask` or more than one target are listed in `implementation-summary.md` with the route they got.

**Alternatives Rejected**:
- Enable every hub row with generated phrases: the review's C55 rules out generated `ownedSignals` as the source, and it puts 19 new candidates against the pinned numbers.

### ADR-002: One shared pure attach function

**Status**: Accepted

**Context**: The harness calls `scoreAdvisorPrompt` directly (`capture-command-routing-baseline.mjs:228,270`) and never calls the handler. A harness copy of the rule could agree with itself and disagree with the handler.

**Decision**: The rule lives in one exported pure function in `ADV/lib/command-attach.ts`. The handler and the harness both import it, and the harness asks the same compiled-route front door for the route.

**Consequences**:
- The neutral run in W1 is a real proof, because it runs the shipped function with an empty lookup.
- The harness now spawns the front door once per row whose top recommendation is a compiled hub. Mitigation: record the capture's wall time before and after.

**Alternatives Rejected**:
- Have the harness call the handler: it pulls in the server surface and the cache, and the capture would measure more than routing.

### ADR-003: Report attached reach outside `metrics`

**Status**: Accepted

**Context**: `tests/command-routing-slice.vitest.ts:110-121` compares `live.metrics` with the committed baseline exactly.

**Decision**: Attached and combined reach go under a new top-level key, so `metrics` keeps its shape and its values until a scorer change moves them.

**Consequences**:
- The neutral proof is a byte comparison of the existing keys.
- Readers must sum own-row and attached reach. Mitigation: the new key also holds the combined number per split with the ceiling of 44.

**Alternatives Rejected**:
- Add fields inside `metrics`: the slice test fails on the shape alone, which hides whether a value moved.

### ADR-004: Depth gate for deep-loop attachment

**Status**: Proposed

**Context**: Decision D3 offers a deep loop to a chat user only on depth wording. The compiled route for `system-deep-loop` can resolve a mode for a plain question.

**Decision**: `attachCommand` attaches a `system-deep-loop` command only when the prompt carries depth wording, from a short word list authored against tune rows. The phase 2 policy for `/deep:*` stays `ask`.

**Consequences**:
- The 10 `d3-plain` rows stay at 0 false offers.
- Some real depth requests may miss the list. Mitigation: the 3 tune `/deep` rows are the check, and a miss is listed.

**Alternatives Rejected**:
- Never attach `/deep:*` in this phase: leaves 3 rows per split at 0 that D3 allows to reach.

### ADR-005: Replace the umbrella ids now

**Status**: Accepted. Decided by the operator on 2026-11-12, answer "Replace now".

**Context**: `command-spec-kit`, `memory:save` and `command-memory-save` are live ids that stand for several commands or for one command twice. Once each `/speckit` command has its own row, two live ids for one command is where a pinned number would drop. Gold labels name the umbrella ids on 13 lines of `labeled-prompts.jsonl`, 1 of `holdout-prompts.jsonl` and 3 of `ambiguity-prompts.jsonl`.

**Decision**: This phase replaces the three umbrella ids with one row per command and relabels the 17 gold lines that name them, each relabel listed with file, id, old and new value for the operator.

**Consequences**:
- One live id per command, so the same-owner collapse and the pinned numbers see one candidate per command.
- One holdout gold label is edited although holdout prompts are otherwise never read. Mitigation: the edit is a mechanical id rename listed in `relabels.tsv`, and the pinned numbers are reported before and after the relabel as two runs.

**Alternatives Rejected**:
- Keep the umbrella rows beside the new ones until phase 004: leaves two live ids for one command through this phase's measurements.

### ADR-006: Doctor plain-chat reach in this phase

**Status**: Accepted. Decided by the operator on 2026-11-12, answer "Add to phase 003". This reverses the earlier recommendation to leave it as a follow-up.

**Context**: All 17 doctor tune rows miss. `command-doctor-helper` wins 4, an owner skill wins 7 and 6 get no recommendation. Every doctor bridge is already active and declares its phrases in `_routes.yaml`.

**Decision**: Add workstream 7, which authors more diagnostic phrases in `_routes.yaml` only. Where an owner skill outranks a doctor route on a diagnostic question, the fix is a phrase on the route, never a penalty on the skill. `/doctor:helper` gains no phrase that takes a row from a specific route.

**Consequences**:
- The phase ceiling rises from 27 to 44 of 44 per split.
- New phrases can take rows from owner skills. Mitigation: the four pinned numbers, the doctor slice and the phrase reach probe run after every doctor regeneration.

**Alternatives Rejected**:
- A penalty on the owner skill: moves skill routing for every prompt that mentions the skill, which the pinned numbers guard.

---


---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

The build executor is DeepSeek V4.1 Flash at max reasoning through cli-pi, as parallel workers (operator decision, 2026-11-12). Each brief carries one change to one file, names the check and is composed after reading `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`. The orchestrating session runs setup and verification, reads every diff and rebuilds `ADV` before every measurement.

### Tier 1: Sequential Foundation
**Files**: `capture-command-routing-baseline.mjs`, `ADV/lib/command-attach.ts`, then every edit to `derive-command-bridges.cjs`, `projection.ts` and `skill_advisor.py`, and every deriver run, including the one after the doctor phrases
**Agent**: One worker at a time, because several workstreams touch these files and every deriver run rewrites the generated bridges file

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Worker A | Handler | `ADV/handlers/advisor-recommend.ts` |
| Worker B | Schema | `ADV/schemas/advisor-tool-schemas.ts` |
| Worker C | Hook | `hooks/lib/skill-advisor-cli-fallback.ts` |
| Worker D | Phrases | `system-spec-kit/command-metadata.json`, `sk-prompt/command-metadata.json` |
| Worker E | Collapse | `ADV/lib/scorer/ambiguity.ts`, then `ADV/lib/scorer/fusion.ts` |
| Worker F | Doctor phrases | `.skilled/commands/doctor/_routes.yaml`, one brief per doctor command |

### Tier 3: Integration
**Agent**: Primary
**Task**: Regenerate, rebuild, run the tests and the two captures, compare with the saved baseline and write the relabel list

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Confirm the target files match the workstream file ownership below
- [ ] Know the verification command for the task before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in dependency order. Parallel work stays inside one workstream |
| TASK-SCOPE | Touch only the files the task names. Report anything else as a finding |
| TASK-VERIFY | Run the task's verification before marking it complete |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact
2. Record the fact in the tasks.md blocked section
3. Continue with the next unblocked task, and escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Harness | One worker | `capture-command-routing-baseline.mjs`, `ADV/lib/command-attach.ts` (function, empty block) | Planned |
| W-B | Attach | Workers A to C, then one worker for the deriver | `advisor-recommend.ts`, `advisor-tool-schemas.ts`, `skill-advisor-cli-fallback.ts`, the lookup in `derive-command-bridges.cjs`, `ADV/tests/command-attach.vitest.ts` | Blocked on W-A |
| W-C | Phrases | Worker D, then one worker for the deriver | The two metadata files, the projection in `derive-command-bridges.cjs`, the generated blocks | Blocked on W-B |
| W-D | Activation and read-only | One worker | `scoring-compatibility.json`, `runtimeCompatibility` and `isReadOnlyRoute` in `derive-command-bridges.cjs`, the drift guard | Blocked on W-C |
| W-E | Umbrella ids | One worker | `explicit.ts`, the three corpora, the three umbrella-id test files | Blocked on W-C |
| W-F | Collapse | Worker E | `ambiguity.ts`, `fusion.ts`, the collapse in `skill_advisor.py` | Blocked on W-D |
| W-G | Doctor phrases | Worker F, then one worker for the regenerate | `.skilled/commands/doctor/_routes.yaml` | Authoring runs beside W-B to W-D, the regenerate waits for W-D |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete | Primary | The neutral capture diff |
| SYNC-002 | Each of W-B to W-G complete | Primary | Rebuild, the pinned numbers and the capture, plus the phrase reach probe and the doctor slice after W-G |
| SYNC-003 | All workstreams | Primary | The suite, the hook timing and the operator delta |

### File Ownership Rules
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC
- Conflicts resolved at sync points
- `derive-command-bridges.cjs`, `projection.ts` and `skill_advisor.py` are shared by W-B, W-C, W-D and W-F, so their edits run one at a time in workstream order
- W-G edits only `_routes.yaml`, but its deriver run rewrites `command-bridges.generated.json` and the generated blocks, so it joins the same sequence
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per task**: the box in `tasks.md` is ticked with its verify output.
- **Per workstream**: the four pinned numbers and the capture are rerun and the delta is noted in `implementation-summary.md`.
- **Blockers**: reported to the operator in the session the same turn.

### Escalation Path
1. A pinned number drops → stop and report to the operator before any re-capture of `scorer-eval-baseline.json`.
2. False offers rise above 0 → stop, list the rows by id and the command offered, and ask.
3. The phrase reach probe exits 1 or the doctor slice fails after a doctor regeneration → stop, list the phrase or row, and fix the phrase before the next regeneration. The slice pins each row's top and second pick, so changing a pinned expectation needs the operator's yes.
<!-- /ANCHOR:communication -->

---
