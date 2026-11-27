---
title: "Implementation Plan: Phase 14: deep-review"
description: "One expanded deep review over the code and docs phases 001 to 013 built, run as a five-lineage fan-out on the packet's own executor roster, then a fix pass over every P0 and P1 with the affected tests re-run."
trigger_phrases:
  - "deep review plan"
  - "phase 14 deep review plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: deep-review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript modules under `.skilled/skills/system-skilled-bots/runtime/lib/`, a CommonJS CLI at `.skilled/bin/bots.cjs` and Markdown spec docs |
| **Framework** | The repository's own deep-loop runtime (`/deep:review`, `fanout-run.cjs`) and the SpecKit validator |
| **Storage** | Files only: the review packet under `review/`, the user-level bots state root and the packet's own docs |
| **Testing** | Vitest, run as `npm test` in `.skilled/skills/system-skilled-bots/runtime`. The floor is the count the setup run records, not a number written before phase 001 landed |

### Overview
Run one `/deep:review:auto` with `--depth-mode=expansive` over everything phases 001 to 013 built, as a five-lineage fan-out on the roster in `executors.json`, then merge the lineages into one findings registry and one report. Fix every P0 and P1 the report names, one worker per file, and prove each fix with the suite that covers it. Prove the whole phase with `npm test` and `validate.sh --strict`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/013-skilled-and-doc-alignment --strict` prints `RESULT: PASSED`
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0, and the `Tests  N passed (N)` line it prints is recorded in `review/preflight.json` as `suiteBaseline`. That recorded count is the floor every later run is compared against, so a phase whose tests were deleted or never landed fails the gate rather than passing it
- [ ] Phases 001 to 013 are committed and `git status --porcelain` prints nothing, and the commit `HEAD` names is recorded in `review/preflight.json` as `baseCommit`. The fix pass diffs against that recorded commit, so an uncommitted edit cannot enter the reviewed surface and the diff has a fixed point
- [ ] The resolved review scope holds at least one module phases 001 to 011 add, such as `runtime/lib/memory.ts`. A scope that reaches only the pre-packet modules refuses `review-scope-stale`, because a review of the modules that already existed answers a question nobody asked
- [ ] `command -v vibe pi opencode devin codex` prints at least one path, and each present binary's version probe exits 0. `review/preflight.json` records which are present, with the shape `design/records.md` section 11 fixes. An absent binary, or one outside the pin its mode names, is replaced in the fallback order in §8.3, so the fan-out keeps five lineages
- [ ] The three review inputs were read, and `review/seeded-findings.json` records each row or each absent path with its reason

### Definition of Done
- [ ] `node -e "const r=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/deep-review-findings-registry.json'); console.log(r.openFindings.filter(f=>f.status==='active'&&(f.severity==='P0'||f.severity==='P1')).length)"` prints `0`
- [ ] `node -e "const j=require('./specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/scenario-rerun.json'); console.log(j.rerunCount, j.failedCount)"` prints the re-run count and `0`
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test` exits 0 and prints at least the `suiteBaseline.tests` count `review/preflight.json` recorded at setup
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-deep-review --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks/acceptance-criteria and `implementation-summary.md`)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out review, then serialized fix waves. The review is one loop with five independent readers. The fix pass is one worker per file, wave by wave.

### Key Components
- **The review loop** (`.skilled/commands/deep/review.md`): owns setup, the fan-out spawn, the reducer, convergence and synthesis. It dispatches the `deep-review` leaf once per iteration and never edits the target.
- **The fan-out runner** (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`): builds each lineage's command, gives it its own packet under `review/lineages/<label>/`, and merges the results.
- **The review packet** (`review/`): `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-strategy.md`, `deep-review-dashboard.md`, `iterations/iteration-NNN.md`, `frontier-nodes.jsonl` and the synthesized `review-report.md`. This phase adds `preflight.json`, `seeded-findings.json`, `fix-ledger.md` and `scenario-rerun.json`.
- **The design artifacts** (`design/`): the record shapes, the four state machines and five sequences, the refusal catalogue, the goldens and the operator-facing frames. They are written before the run, so the run copies a shape rather than choosing one.
- **The fix waves** (`tasks.md`): one worker per file, each fix carrying the finding id and the command that proved it.
- **The gates**: `npm test` for the runtime, `validate.sh --strict` for the packet and `git status --porcelain` for the diff boundary.

### Data Flow
`/deep:review:auto` resolves setup, probes the five binaries and writes `preflight.json`, reads the three review inputs and writes `seeded-findings.json`, discovers the review scope once at the fan-out root, seeds the depth-1 frontier, then spawns five lineages. Each lineage runs the full loop in its own packet and reviews the canonical four dimensions. The merge consolidates the registries and applies strongest-restriction to the verdict. Synthesis writes `review-report.md` and the orchestrator writes `fix-ledger.md`, one row per finding. The orchestrator then reads the registry, groups the P0 and P1 findings by file, and dispatches one fix worker per file group. Each fix re-runs its own suite. After the last wave the orchestrator re-runs every 012 scenario whose owning phase a fix touched and writes `scenario-rerun.json`, then runs the whole suite and the validator, then rewrites the report so its verdict describes the final state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase exists to fix what a review finds, so the addendum applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/*.ts` | Owns the behavior a finding names | Update only the module a finding names | The module's own suite plus one regression test that fails without the fix |
| `.skilled/skills/system-skilled-bots/runtime/tests/*.vitest.ts` | Asserts the shape the code has | Update the suite covering a fixed module | `npm test` exits 0 |
| `.skilled/bin/bots.cjs` | The CLI front door | Update only when a finding names a verb or a flag | `node .skilled/bin/bots.cjs --help` lists the verb, and `cli-run.vitest.ts` passes |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | The definition checker | Update only when a finding names an invariant | `bot-check.vitest.ts` passes |
| `specs/system-skilled-bots/003-openbot-parity-build/0[01][0-9]-*/` | Describes the built behavior | Update only the line a docs-truth finding names | `rg -n '<corrected term>' <doc>` finds the corrected line |
| `specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/` | Does not exist yet | Create | `review/review-report.md` carries nine sections and one verdict line, and `review/preflight.json`, `review/seeded-findings.json`, `review/fix-ledger.md` and `review/scenario-rerun.json` exist |
| `specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/design/` | Does not exist yet | Create | `design/records.md`, `design/state-machines.md`, `design/refusals.md`, `design/mockups.md` and `design/fixtures/` exist, and every command in `design/fixtures/README.md` prints what that file says |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' .skilled/skills/system-skilled-bots/runtime/lib`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' .skilled --glob '*.ts' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: five review dimensions by five lineages for the review, and the file partition by wave for the fix pass. Every row is listed before a wave starts.
- Algorithm invariant: for a path, redaction, parser, resolver or security fix, state the invariant and the adversarial cases before the edit, and test delimiter, joined-input, outside-root, no-op and fallback cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes, the task state and the wave grouping.

Setup reads phase 013's validator line, the runtime suite baseline and the five executor probes, writes `preflight.json` with which are present, reads the three review inputs and writes `seeded-findings.json`, and previews the fan-out with `--dry-run`. Implementation runs the five-lineage review, synthesizes the report, writes the ledger and fixes every P0 and P1 one worker per file. Verification re-runs the affected suites, re-runs every 012 scenario whose owning phase a fix touched, runs the whole runtime suite and `validate.sh --strict`, and confirms the diff stayed inside the surfaces the review named.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The module a fix changes, plus one regression test per fixed defect | Vitest, `npm test` in `.skilled/skills/system-skilled-bots/runtime` |
| Integration | The request pipeline and the CLI when a finding names a verb or a record | `cli-run.vitest.ts`, `queued-run.vitest.ts`, `resume.vitest.ts` |
| Contract | The packet's own docs and the review artifacts | `validate.sh --strict`, and the review's own quality gates |
| Scenario | Every 012 scenario whose owning phase a fix touched, re-run from its own bash block | The playbook corpus under `.skilled/skills/system-skilled-bots/manual-testing-playbook/`, recorded in `review/scenario-rerun.json` |
| Manual | None. Every check in this packet runs without a tty | - |

The one command that decides the phase is `cd .skilled/skills/system-skilled-bots/runtime && npm test`, which must exit 0 with at least the count `review/preflight.json` recorded at setup. That recorded count is the baseline, and `spec.md` §2 Measured Behavior is the pre-build measurement it replaces. A floor written before phase 001 landed would pass a build that deleted a phase's tests, so the floor is measured at setup and never quoted from this plan.

The scenario re-run is the second proof. A unit suite proves the module, and a scenario proves the operator flow the module sits in. The owning phase of a scenario is read from `012-manual-testing-scenarios/scratch/failures.md` first and from the scenario's category folder second, per `design/records.md` section 8.3, so no builder chooses which scenarios to re-run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013 clean | Internal | Yellow | The review reads a moving surface. REQ-001 blocks the start |
| `vibe`, `pi`, `opencode`, `devin`, `codex` on PATH | External | Yellow | At least one must be present. A missing binary drops its lineage and the fallback order in §8 replaces it, so the count stays five |
| Provider credentials for each of the five | External | Yellow | A lineage with no credential fails its probe and is dropped before spawn |
| `vitest` in the runtime folder | Internal | Green | No test run, so no fix can be proven |
| `validate.sh` and the SpecKit validator | Internal | Green | No packet gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fix changes behavior a phase's acceptance criteria already proved, or the runtime suite drops below the `suiteBaseline.tests` count recorded at setup after a fix wave.
- **Procedure**: Revert the one fix commit for the finding that caused it, re-run that module's suite and record the finding as deferred with the revert as its reason. The review packet is never reverted: it is evidence, and a re-review is a new run with `--lineage-mode=restart`.
<!-- /ANCHOR:rollback -->

---

## 8. External orchestration

This phase dispatches every review lineage and every fix worker to an external CLI. The hub owns routing and the per-mode contracts. This section names the roster, the effort policy, the fallback order and the guards. Read the hub's `SKILL.md` and the target mode's `SKILL.md` before composing any dispatch prompt, because the advisor recommendation alone does not waive that rule [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:198]. The executor CLI is the HOW and never overrides this packet's workflow, which is the WHAT [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:206].

### 8.1 The roster

The five executors are the roster the packet's build already uses, so a review lineage and a build worker share one set of ids [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:9]. Each row names how that kind receives effort, because the five kinds do not agree.

| Label | Kind | Model | Effort | How effort reaches the model |
|-------|------|-------|--------|------------------------------|
| `vibe` | `cli-mistral-vibe` | `deepseek-flash` | `max` | Baked into the roster row. No reasoning flag exists, so a dispatch cannot raise or lower it [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:89] |
| `pi` | `cli-pi` | `deepseek-v4.1-flash-1017` (provider `llmgateway`) | `high` or `max` | `--thinking`, a first-class flag independent of the model id [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:163] |
| `opencode` | `cli-opencode` | `opencode-go/deepseek-v4.1-flash` | `high` or `max` | The `#high` or `#max` suffix on the model id, as `-m opencode-go/deepseek-v4.1-flash#max` [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md:78] |
| `devin` | `cli-devin` | `deepseek-v4-1-flash-max` | `max` | Baked into the model uid. There is no headless reasoning-effort flag [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:156] |
| `codex` | `cli-codex` | `gpt-6-luna` | `xhigh` | `-c model_reasoning_effort="xhigh"` plus `-c service_tier="fast"` [SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/SKILL.md:125] |

Three roster rules follow from those rows and are not negotiable:

- **GPT models go through `cli-codex` only.** `gpt-6-luna` is a Codex model, and its effort ceiling is `max` in the executor table [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:33]. No other kind in this roster carries a GPT id.
- **Each kind's model must be on its enforced allowlist.** Vibe closes to two aliases, `deepseek-flash` and `glm-flash` [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:67]. Pi closes to its own roster, where the bare `deepseek-v4.1-flash-1017` literal is the DevPass route [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:68]. Devin closes to its own list, which carries `deepseek-v4-1-flash-max` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:638]. An off-allowlist id fails closed. A requested CLI executor never degrades to native.
- **A kind receives only the flags it supports.** `cli-mistral-vibe` and `cli-devin` take no `reasoningEffort` and no `serviceTier`. `cli-pi` and `cli-opencode` take `reasoningEffort` and no `serviceTier`. `cli-codex` takes both [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:112]. Passing an unsupported field is a config error, not a silent no-op.

### 8.2 The effort policy

| Task shape | Effort | Why |
|---|---|---|
| Small and mechanical: a one-line doc correction, a rename, a test that mirrors an existing one | DeepSeek Flash `high` | The change is legible from the finding. `max` buys nothing |
| Design or tricky: a shared record two phases both write, a seam between phases, a fix whose blast radius crosses modules | DeepSeek Flash `max` | The fix has to reconcile two contracts, and a broad brief at the cheaper tier has already been observed to read a subsystem and write nothing [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:169] |
| The hardest task: a P0 whose cause is not yet located, or a fix two DeepSeek attempts failed | `gpt-6-luna` `xhigh` `fast` | The last resort, and the only route for a GPT model |

Every fix worker's primary is `cli-mistral-vibe` at `deepseek-flash`, which runs at its fixed `max`, so the two DeepSeek tiers above set only the fallback tier a worker takes on `cli-pi` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"].

### 8.3 The fallback order

When a CLI runs out of usage, or Vibe answers `429` or `402`, the next executor in this order absorbs its share. The order is the parent's ladder, fixed for the whole phase and recorded per wave in `tasks.md`.

1. `vibe`, the primary for every fix worker since 2026-11-27. It bills the plan's Vibe budget, which is separate from the API budget.
2. `pi`, the rotation default for DeepSeek Flash on DevPass and the route the roster's `lanes` preset already uses [SOURCE: .skilled/commands/assets/local-skilled-alignment/executors.json:191].
3. `opencode`, the Go gateway's subsidized 2x usage rate.
4. `devin`, a weekly quota, so probe it with a trivial read-only call before spending it. A quota banner alone is not proof of exhaustion, because a free-tier model still dispatches at 0% [SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/SKILL.md:237].
5. `codex`, the last fallback and the only route for a GPT model.

A dropped review lineage is replaced by `--count=2` on the first executor in the order that is still up, so the fan-out keeps five lineages and the review keeps five independent reads. Vibe runs in a deep loop only as a fan-out lineage beside a second executor group, and the runner refuses a single-executor run [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:190]. The fan-out therefore always holds at least one group that is not Vibe, and if only Vibe would remain, Wave 1 stops and reports rather than running Vibe alone. A dropped fix worker is replaced by the next executor at the same fallback tier.

### 8.4 The dispatch shape

The review is one command. The caps stay at their defaults, because a fan-out run refuses `--frontier-max-depth` and `--frontier-max-nodes`. Each lineage writes its own config [SOURCE: .skilled/commands/deep/review.md:102].

```bash
/deep:review:auto "specs/system-skilled-bots/003-openbot-parity-build" \
  --spec-folder specs/system-skilled-bots/003-openbot-parity-build/014-deep-review \
  --depth-mode=expansive \
  --executor=cli-mistral-vibe --model=deepseek-flash --label=vibe \
  --executor=cli-pi --model=deepseek-v4.1-flash-1017 --reasoning-effort=max --label=pi \
  --executor=cli-opencode --model=opencode-go/deepseek-v4.1-flash --reasoning-effort=max --label=opencode \
  --executor=cli-devin --model=deepseek-v4-1-flash-max --label=devin \
  --executor=cli-codex --model=gpt-6-luna --reasoning-effort=xhigh --service-tier=fast --label=codex \
  --concurrency=5
```

`--concurrency` defaults to 2, so the run must pass 5 to let all five lineages run at once [SOURCE: .skilled/commands/deep/review.md:114]. A fix worker is a single dispatch through the same kind, composed as the child preamble plus the resolved agent persona plus the task, because a persona-less leaf drops its tool scope and its verification gates.

**The target and the scope source.** The positional target is the parent packet and `--spec-folder` is this phase's folder, so the run reports into 014 while it reads the whole build. A spec-folder target makes the loop read that folder's `spec.md`, its `plan.md` and the files its `tasks.md` lists [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:91], which reaches no module phases 001 to 011 add. The scope source is therefore a file list and not the folder walk. `contracts/runtime-architecture.md` section 1 names every module the packet adds and every edge it adds to an existing module, so the list is that set plus `crates/bots-tui/` and `.skilled/bin/bots.cjs`. The orchestrator writes the list to `review/fanout-review-scope.txt` before the fan-out and every lineage reads that file, so the five readers review one surface rather than five guesses at it. A scope that holds no module phases 001 to 011 add refuses `review-scope-stale`.

### 8.5 The guards

- **No self-invocation.** A Vibe session refuses to dispatch a `vibe` lineage [SOURCE: .skilled/skills/cli-external-orchestration/cli-mistral-vibe/SKILL.md:131], and an OpenCode session refuses to dispatch `opencode` except as an explicit parallel-detached session, which is what a fan-out lineage is. Pi is the one exemption and may be dispatched from inside Pi [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:175]. The orchestrator therefore runs from a surface that is none of the five, or drops the kind it is running inside.
- **No nested dispatch.** A lineage never dispatches its own kind again, and a fix worker never dispatches from inside a fan-out lineage. The runner refuses both.
- **No credential in a prompt.** A prompt names the environment variable, never its value, and no key is written into the checkout.
- **Every child is a child.** Each dispatch sets `AI_SESSION_CHILD=1` and carries the child-dispatch preamble, because the variable makes the documentation-scope waiver true and the preamble makes it observable to a model that cannot read the environment.

### 8.6 The preflight

Before any lineage spawns, the orchestrator probes the five binaries and records which are present in `review/preflight.json`, whose shape is `design/records.md` section 11. The runner's `review/orchestration-summary.json` then records which lineages actually spawned:

```bash
command -v vibe pi opencode devin codex
vibe --version </dev/null; pi --version; opencode --version; devin --version; codex --version
```

At least one binary other than `vibe` must be present, because Vibe never runs as the only executor group. A binary that is absent, or a version outside the pin its mode names, drops that lineage before spawn, and the run re-runs the matrix with `--count=2` on the next executor in §8.3.

The same preflight proves the scope reaches the built code, because a fan-out of five readers over the pre-packet modules is five reads of the wrong surface:

```bash
rg -c 'runtime/lib/(memory|skills|conversation|channel)\.ts' specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/review/fanout-review-scope.txt
```

That prints at least `1`. A scope file that holds none of them refuses `review-scope-stale` before any lineage spawns. The fan-out therefore keeps five lineages on a host with fewer than five binaries, and the label set records which executor ran twice. A run that loses every lineage exits non-zero and writes no verdict line, because a review with no reader is not a clean review. That is D3: the fallback wins over a setup that demands all five. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D3]

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Seeded intake ──► Review fan-out ──► Synthesis ──► P0 fixes ──► P1 fixes ──► Verification ──► Scenario re-run
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 013 clean, at least one of the five binaries on PATH | Seeded intake |
| Seeded intake | Setup, the three handoff inputs readable | Review fan-out |
| Review fan-out | Seeded intake | Synthesis |
| Synthesis | Review fan-out | P0 fixes |
| P0 fixes | Synthesis | P1 fixes |
| P1 fixes | P0 fixes | Verification |
| Verification | P1 fixes | Scenario re-run |
| Scenario re-run | Verification, the fix ledger's touched phases | Packet close |

Seeded intake runs before the fan-out because a seeded finding is a finding the lineages must not re-derive from scratch: the intake writes `review/seeded-findings.json` and the fan-out prompt names it. Scenario re-run runs after Verification because it re-runs only the scenarios whose owning phase a fix touched, so it needs the finished ledger. A fix pass that touches no phase owning a scenario records an empty `review/scenario-rerun.json` with `rerunCount: 0` and still closes, because the requirement is to record the result, not to manufacture one.
<!-- /ANCHOR:phase-deps -->

---
