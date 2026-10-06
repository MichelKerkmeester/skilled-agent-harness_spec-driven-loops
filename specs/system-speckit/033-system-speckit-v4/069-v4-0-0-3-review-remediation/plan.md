---
title: "Implementation Plan: v4.0.0.3 review remediation"
description: "Fix the three v4.0.0.3 review P1s behind failing-first tests, then clear the 18 P2 advisories in sk-git, deep-loop, release-tail and contract-gap batches, then land the eight lineage-prompt fixes that stop Luna lineages ending turns on questions."
trigger_phrases:
  - "v4.0.0.3 remediation plan"
  - "review finding fix plan"
  - "lineage prompt fix plan"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4.0.0.3 review remediation

<!-- SPECKIT_LEVEL: 3+ -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS scripts running TypeScript through tsx, ESM hooks), Python 3, Bash, YAML workflow assets |
| **Framework** | deep-loop runtime (append gateway, loop lock, fan-out runner), spec-kit hooks, sk-git hooks, sk-doc validators |
| **Storage** | JSONL ledgers and state logs, lock files, JSON hook registrations |
| **Testing** | vitest (deep-loop runtime, spec-kit CLI), `node --test` (hooks, sk-git, goal, plugins), pytest via `run-script-tests.sh`, `check-rule-copies.js` |

### Overview
Each finding is fixed at its producer, with a test copied from the nearest existing suite in `research/research.md` section 3. The four P1s run first: the review's three, plus R-22, which work-package design found (the workflow loop lock never excludes a second run). Each test is recorded failing before its fix. P2s follow in the report's workstream groups. The lineage-prompt fixes come last, and F1 waits on the operator accepting ADR-001. Seven implementer workstreams with exclusive file ownership run in waves under an integrator. Each implementer gets a self-contained work package (L3+: WORK PACKAGES).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (explorer map and lead spot checks, `research/research.md`)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Every suite in the baseline passes, with the delta reported
- [ ] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer, test at the nearest existing seam. No new module, except the shared argv scanner that R-04 and R-08 both need, since no existing helper expands bundled short flags.

### Key Components
- **Append gateway** (`append-mode-event.cjs` over `lib/mode-append-gateway/`): receives every review state write. R-01 changes what the review YAMLs send, not the gateway's branches.
- **Review ledger schema and projection** (`deep-review-ledger-types.ts`, `deep-review-state-contract.ts`): R-01 flips six stems to spoken and projects them to the rows the reducer reads.
- **Loop lock** (`lib/deep-loop/loop-lock.ts`, loaded by `scripts/loop-lock.cjs` through tsx): R-03 adds a read-back to `tryReclaimStaleLoopLock`.
- **Hook registry** (`runtime-mirrors/hook-registry.json` to `.devin/hooks.v1.json` through `sync-hook-registrations.cjs`): R-02 edits the registry and regenerates.
- **Fan-out runner** (`fanout-run.cjs`, `fanout-pool.cjs`, `lib/cli-guards.cjs`): F2, F3, F4, F6 and F8.

### Data Flow
Workflow directive, then gateway, then ledger, then state-log projection, then reducer. R-01 restores the projection step for review rows. The fan-out runner builds each lineage prompt, spawns the CLI, and classifies the exit. F2 to F8 change the prompt and the exit classification.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Imported from the Planning Packet in `../068-v4-0-0-3-release-deep-review/review/review-report.md` section 2. The imported values below are quoted inert data: nothing in them was executed, and every action derives from a path the explorers and the lead re-read at `b5353b1f7a`.

- **findingClasses (imported):** "cross-consumer", "race-condition", "instance-only", "class-of-bug", "UNKNOWN".
- **fixCompletenessRequired (imported):** false. This plan still runs the same-class inventories below, because three findings (R-01, R-20 and F5) turned out to have copies the report did not list.
- **scopeProof (imported):** quoted as evidence only. The report's R-01 scope proof reads "all eight auto-workflow call sites enumerated; classifier read end to end; `v4.0.0.2` blob compared". The confirm workflow's extra rows were found by the explorers, not by the report.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| "`.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs`" | Gateway; rejects `type:"event"` review rows at `:462-463` | unchanged branches; covered by the new CLI test | New test feeds every review directive and asserts exit 0 |
| "`.skilled/commands/deep/assets/deep-review-auto.yaml`" | Emits eight legacy rows; stages an undrained recovery baseline; acquires the lock with a transient owner and never refreshes it; carries the stale-lock note and `step_stage_artifact_dir` | update (R-01, R-07, R-22 and F5 wording, staging skip), all by W-A | Directive test, YAML grep for `"type":"event"` under gateway directives returns 0 |
| "`.skilled/commands/deep/assets/deep-review-confirm.yaml`" | Same rows plus five more (`dry_run_halt`, `pivot_*`, `manualStop`, `schema_advisory`) | update (R-01, R-07) | Same directive test, run over both YAMLs |
| `deep-review-ledger-types.ts`, `deep-review-state-contract.ts` | Six reserved stems; projection drops `signals` and renames pause and recovery rows | update (ADR-003) | Stem-producer checker; reducer test on a recorded state log |
| "`.devin/hooks.v1.json`" | Generated Devin bindings, `^edit$` only | regenerate from `hook-registry.json` | `sync-hook-registrations.cjs --check` exit 0 |
| "`.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs`" | `DEVIN_TOOL_MAP` lacks `write` | update | `spec-gate-devin.test.mjs` `write` payload case |
| `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs` | `DEVIN_EDIT_TOOLS` lacks `write` | update | Post-edit hook test with a `write` payload |
| "`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts`" | Reclaim renames without a read-back | update (ADR-002) | Two-reclaimer interleaving test |
| "`.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs`" | tsx adapter over the `.ts`; `acquire` records its own short-lived pid when given no `--owner-pid` (`:81-84`) | update (R-22: mark the owner transient) | `loop-lock-cli.vitest.ts`: a second acquire of a fresh lock is refused |
| "`.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`" | `optionValue` misses `-am`; unguarded `setFlagsFromString` at `:380` | update (R-04, R-18) | `message-contract.test.mjs` bundled-flag cases |
| "`.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs`" | Whole-token flags miss `-am` | update; hosts the shared scanner (R-08) | `git-rule-checks.test.mjs` `-am` with untracked files |
| "`.skilled/skills/sk-git/scripts/lib/message-contract.mjs`" | Silent slice at `:427` and `:627` | update (R-06) | Over-cap message and PR body rejected with a listed rule id |
| "`.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs`" | Direct `mergeJsonlUnderLock` write at `:170` | waived by ADR-005; comment only | Comment present; `fanout-salvage.vitest.ts` green |
| "`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`" | Stale for the v4.0.0.3 changelog | regenerate (R-09) | `generate-trigger-index.mjs --check` exit 0 |
| Research and council YAMLs (auto and confirm), the improvement YAMLs' lock note, `spec-check-protocol.md:69` | Same transient-owner acquire, the same note, the same staging step | update (R-22 TTL and refresh, shared note sentence, staging skip), by W-F | `rg` for the old note returns nothing; one refresh step per loop-lock workflow |
| `deep-review/SKILL.md:392`, `deep-research/SKILL.md:356`, `state-format.md:98` | Config called read-only against a terminal status write | update (R-20, F7) | Grep and read |
| `fanout-run.cjs`, `lib/cli-guards.cjs`, `fanout-pool.cjs` | Lineage prompt, session ID, retry classes, `holdsLiveLoopLock` liveness for write containment | update (F2, F3, F4, F6, F8 `needs_input`, R-22 `owner_kind` mapping) | `fanout-run.vitest.ts` (the `:1032` pin updated), `fanout-pool.vitest.ts` |
| `AGENTS.md`, `.skilled/repo-rules/blast-radius.md` | Child exemption, runtime-lock wording | update (F1 after ADR-001 by W-H; the blast-radius carve-out by W-F) | `check-rule-copies.js` exit 0; `check-repo-rules.cjs` exit 0 |
| `~/.claude/CLAUDE.md` | User-level copy of AGENTS.md | not in repo; operator updates it | Named in the closeout |

Required inventories, run at implementation time:
- **Same-class producers.**
  - `rg -n '"type":"event"' .skilled/commands/deep/assets/deep-review-*.yaml`
  - `rg -n 'stale-lock override is confirm-only' .skilled`
  - `rg -n 'read-only after init|immutable' .skilled/skills/system-deep-loop/deep-*/SKILL.md .skilled/skills/system-deep-loop/deep-*/references/state/`
  - `rg -n 'git add \{state_paths' .skilled/commands/deep/assets`
- **Consumers of changed symbols.**
  - `rg -n 'DEVIN_TOOL_MAP|DEVIN_EDIT_TOOLS|tryReclaimStaleLoopLock|MAX_INPUT_CHARS|buildLoopPrompt|classifyLineageFailure' .skilled .opencode .devin`
- **Matrix axes.**
  - R-01: directive (9 legacy rows in auto, 14 in confirm, per the explorer count; recount with the grep above before writing the test) by mode (review).
  - R-02: tool (`edit`, `write`) by hook (spec-gate, post-edit).
  - R-04 and R-08: flag form (`-m`, `-a -m`, `-am`, `-sm`, `-qm`, `-aF`) by parser (gate, rule checks).
  - R-06: length (cap, cap+1) by surface (commit, PR body).
- **Algorithm invariants.**
  - R-03: at most one holder after any interleaving of read, rename and link by two reclaimers. Adversarial cases are a holder that refreshed between read and rename, and a third acquirer arriving during the restore.
  - R-22: a fresh lock acquired without an owner pid is never reclaimed until its heartbeat is older than twice its TTL. A lock with a real owner pid keeps today's dead-owner rule.
  - R-04 and R-08: the expansion of a short-flag cluster is a pure function of the token. A value flag ends the cluster and takes the rest of the token or the next token.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- **Phase A, P1s:** T010 to T019. R-01, R-02, R-03 and R-22, each opening with a test recorded failing. Waves 1 and 1b.
- **Phase B, WS-4 and WS-5:** T020 to T029. Wave 2.
- **Phase C, WS-6 and WS-7:** T030 to T039. Wave 3, up to eight agents.
- **Phase D, F1 to F8:** T040 to T049. Wave 4; F1 waits on ADR-001.
- **Close:** T050 to T053. Wave 5.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression (failing first) | R-01, R-02, R-03 | vitest CLI test, `node --test` adapter test, vitest interleaving test |
| Unit | sk-git scanner, cap, gate guard; salvage; injection screen; goal verifier; cite-drift; repo-rule stems; cli-guards class | `node --test`, vitest, pytest |
| Contract | Hook registry, rule copies, trigger index, repo rules | `sync-hook-registrations.cjs --check`, `check-rule-copies.js`, `generate-trigger-index.mjs --check`, `check-repo-rules.cjs` |
| Smoke | One Luna fan-out lineage, two iterations, after F1 to F8 | `fanout-run.cjs` with one Codex or Pi Luna lineage |

**Baseline first.** Before T010, run every suite named in `research/research.md` section 3 and record pass and fail counts in `implementation-summary.md`. "No regressions" means the same suites rerun at the end with no new failures.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ADR-001 operator acceptance | Internal | Green (accepted 2026-10-06) | None |
| DeepSeek V4.1 Flash on Pi (`opencode-go/deepseek-v4.1-flash`, max) | External | Green on 2026-10-06 (phase 68 ran 15 iterations) | Switch to `cline-pass/deepseek-v4.1-flash` at `xhigh` and record the switch |
| Luna route (Codex `gpt-6-luna` or Pi `openai/gpt-6-luna`) | External | Green on 2026-10-06 | The SC-003 smoke becomes operator-verifiable |
| Deep-loop runtime and spec-kit CLI `node_modules` in the worktree | Internal | Green (phase 68 ran here) | Tests cannot run until `worktree-naming.sh provision` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks a suite that passed at baseline, or a guard (`check-rule-copies.js`, `sync-hook-registrations.cjs --check`) fails and cannot be repaired in place.
- **Procedure**: one commit per workstream, so `git revert <sha>` undoes one group without touching the others.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Baseline ──► Phase A (P1s + R-22) ──► Phase B (WS-4, WS-5) ──► Phase C (WS-6, WS-7) ──► Phase D (F1-F8) ──► Close
              wave 1 ─► SYNC-1 ─► wave 1b
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline | None | A |
| A | Baseline; SYNC-1 inside it (W-C lands before any lock YAML edit) | B |
| B | A (SYNC-2) | C |
| C | B (SYNC-3) | D |
| D | C (SYNC-4); ADR-001 for F1 only | Close |
| Close | D (SYNC-5) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline | Low | 30 minutes |
| A (P1s and R-22) | High | 5 hours of agent time, about 2.5 hours of wall clock in parallel |
| B (WS-4, WS-5) | Med | 3 hours |
| C (WS-6, WS-7) | Med | 3 hours of agent time, under 1 hour of wall clock across eight agents |
| D (F1 to F8) and smoke | Med | 3 hours |
| Verify and close | Low | 1 hour |
| **Total** | | **about 15 hours of agent time, about 7 hours of wall clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline suite counts recorded
- [ ] One commit per workstream
- [ ] Guards rerun after each commit

### Rollback Procedure
1. Identify the workstream commit from `git log --grep='^Spec: system-speckit/033-system-speckit-v4/069'`.
2. `git revert` that commit.
3. Rerun the baseline suites and the guards.
4. Record the revert in `implementation-summary.md`.

### Data Reversal
- **Has data migrations?** No. Ledgers written by older runs keep reading, because the gateway's existing branches are unchanged.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
W-H baseline
   │
   ├──► W-A R-01 ─────────────┐
   ├──► W-B R-02 ─────────────┤
   └──► W-C R-03 ─► R-22 ─► SYNC-1 ─┬─► W-A R-22 YAML ─┐
                                    ├─► W-F lock YAMLs ─┼─► SYNC-2 ─► wave 2 ─► SYNC-3 ─► wave 3 ─► SYNC-4 ─► wave 4 ─► SYNC-5 ─► W-H close
                                    └─► W-E mapping ────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| W-C R-03 read-back | SYNC-0 | Safe reclaim | R-22 library change (same function family) |
| W-C R-22 library and CLI | R-03 | `owner_kind`, heartbeat-judged transient locks | SYNC-1 |
| W-A, W-F lock YAMLs | SYNC-1 | TTL, a refresh per iteration, the factual note | SYNC-2 |
| W-E `holdsLiveLoopLock` mapping | SYNC-1 | Live foreign runs visible to containment | SYNC-2 |
| W-A R-01 | SYNC-0 | Review rows in the state log | W-A R-07 (same YAMLs, same agent) |
| W-D expander | SYNC-2 | One argv scanner for both sk-git surfaces | none |
| W-E F2 preamble | SYNC-4 | Visible waiver | F1 (paired) |
| W-H F1 | ADR-001, SYNC-4 | Authority-layer waiver | Smoke |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Baseline** - 30 minutes - CRITICAL
2. **W-C R-03, then R-22** - 1.5 hours - CRITICAL (gates SYNC-1)
3. **Lock YAMLs (W-A, W-F) and W-E mapping** - 1 hour - CRITICAL
4. **Waves 2 and 3** - 2 hours - CRITICAL
5. **Wave 4 and the Luna smoke** - 2 hours - CRITICAL

**Total Critical Path**: about 7 hours

**Parallel Opportunities**:
- W-A R-01 and W-B R-02 run beside the W-C chain in wave 1.
- Wave 3 runs eight independent W-G rows at once.
- W-E's Phase D prompt work and W-F's Phase D copies touch disjoint files.

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | P1s closed | Four regression tests (R-01, R-02, R-03, R-22) failing before, passing after | Phase A |
| M2 | Advisories closed | Each of R-04 to R-21 fixed, or waived (R-05 by ADR-005) | Phase C |
| M3 | Lineages run clean | Luna smoke writes both iterations, with no question-shaped final line | Phase D |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The full records are in `decision-record.md`.

### ADR-001: Child-dispatch exemption covers every ask-or-wait rule inside the lineage directory

**Status**: Accepted (operator)

**Context**: Luna ended six lineage turns on questions under the hard rules the exemption leaves in force.

**Decision**: widen `AGENTS.md:61` to record-and-continue inside the lineage directory, written byte-neutral.

**Consequences**:
- Detached lineages finish their count.
- A child continues past a Logic-Sync. Mitigation: it records the conflict as a finding.

**Alternatives Rejected**:
- Prompt preamble only: it loses to the "cannot be overridden" line for a strict reader.

### ADR-002: A stale-lock reclaim reads back what it renamed

**Status**: Accepted

**Context**: two reclaimers can both hold one lock.

**Decision**: compare pid, nonce and heartbeat after the rename, and restore on a mismatch.

**Consequences**:
- One winner per race.
- The loser halts fail-closed, which is the correct outcome.

**Alternatives Rejected**:
- Host-local single-flight: it holds on one host only.

### ADR-003: Review event rows use the reserved review stems, and two pure-bookkeeping rows are pinned

**Status**: Accepted

**Context**: the gateway rejects every legacy review row.

**Decision**: six rows move to their reserved stems with a projection the reducer reads. `config_warning` and `lock_released` become `bookkeeping_log` pins.

**Consequences**:
- Review runs keep their evidence.
- Three schema files change. Mitigation: the stem checker and reducer tests cover them.

**Alternatives Rejected**:
- Pin all eight as print-only: the reducer would still lose its inputs.

**Amended**: additive `signals`, `blockers`, `gateDetail`, `graphBlockerDetail` and `recoveryHint` fields; the three confirm pivot rows join the pins.

### ADR-004: A lock acquired without an owner process is judged by its heartbeat, and every workflow refreshes it

**Status**: Accepted (operator)

**Context**: every workflow lock records the short-lived CLI pid, so a second run reclaims it at once (R-22, probe-proven).

**Decision**: a transient owner is judged by heartbeat age only. The workflows acquire with `--ttl-ms 1800000` and refresh once per iteration.

**Consequences**:
- A second run fails closed.
- A crashed run blocks its packet for up to 60 minutes. Mitigation: `status`, then a manual release.

**Alternatives Rejected**:
- `--owner-pid "$PPID"`: correctness would depend on each runtime's process tree.

### ADR-005: R-05 is waived

**Status**: Accepted

**Context**: the salvage row has no stem in either schema, and only one count reads it.

**Decision**: comment the write as advisory.

**Consequences**:
- No schema churn.
- The salvage count can read low after a retry.

**Alternatives Rejected**:
- New stems in two schemas: too costly for one count.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: T001 to T003 (provisioning, suite baseline, guard baselines)
**Agent**: Primary

### Tier 2: Parallel Execution
Seven implementer workstreams (W-A to W-G) run in the waves defined under L3+: WORKSTREAM COORDINATION, with up to eight agents in wave 3. Each agent receives the Agent Dispatch Contract and its work package from L3+: WORK PACKAGES. The integrator (W-H) dispatches, verifies each return and commits.

### Tier 3: Integration
**Agent**: Primary
**Task**: Verify each return by rerunning its work package's commands, commit it, and record the sync output before opening the next wave. File ownership is exclusive, so no merge is needed; `deep-review-auto.yaml` stays with W-A for all four of its changes.

### Pre-Task Checklist
- [ ] Read spec.md, this plan and tasks.md before the first edit
- [ ] Re-read the cited lines; the research doc lists four that drifted
- [ ] Know the task's test command (`research/research.md` section 3) before starting it

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute tasks in wave order: SYNC-1 before any lock YAML edit, and ADR-001 acceptance before T047 |
| TASK-SCOPE | Touch only the files your workstream owns; report anything else as a note in the return |
| TASK-VERIFY | Run the task's test or guard before marking it complete; for T010, T013 and T015, also record the failing run |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] - one line of evidence`

### Blocked Task Protocol
1. Mark the task BLOCKED with the blocking fact (T047 starts BLOCKED on ADR-001)
2. Record the fact in tasks.md and `implementation-summary.md`
3. Continue with the next unblocked task; escalate after two blocked tasks
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Findings | Owner | Files (exclusive) | Phase | Status |
|----|------|----------|-------|-------------------|-------|--------|
| W-A | Review workflow and ledger | R-01, R-07, R-22 (review YAMLs), staging skip (review) | Implementer A | `deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-review-ledger-types.ts`, `deep-review-ledger-schema.ts`, `deep-review-state-contract.ts`, their tests | A, B, D | Ready after T003 |
| W-B | Devin write parity | R-02 | Implementer B | `devin/spec-gate-enforce.mjs`, `post-edit-quality/devin/post-edit-quality.cjs`, `hook-registry.json`, generated `.devin/hooks.v1.json`, four doc lines, their tests | A | Ready after T003 |
| W-C | Loop lock | R-03, R-22 (library and CLI) | Implementer C | `loop-lock.ts`, `loop-lock.cjs`, `loop-lock.vitest.ts`, `loop-lock-cli.vitest.ts` | A | Ready after T003 |
| W-D | sk-git argv and input bounds | R-04, R-06, R-08, R-18 (plus `validate-message.mjs:45` and the `-s`/`-u` arity bug) | Implementer D | `git-rule-checks.mjs`, `git-message-gate.mjs`, `message-contract.mjs`, `validate-message.mjs`, two templates, two test files | B | Blocked on SYNC-2 |
| W-E | Fan-out runner | F2, F3, F4, F6, F8, R-05 (waiver comment), R-22 mapping | Implementer E | `fanout-run.cjs`, `fanout-pool.cjs`, `fanout-salvage.cjs`, `lib/cli-guards.cjs`, their tests | A (mapping), B (comment), D | Mapping blocked on SYNC-1 |
| W-F | Docs and non-review workflow copies | R-15, R-20/F7, R-22 and F5 wording (research, council, improvement), staging skip (research), blast-radius carve-out | Implementer F | nine playbooks, two SKILL.md files, `state-format.md`, `deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-ai-council-auto.yaml`, `deep-ai-council-confirm.yaml`, `deep-agent-improvement-auto.yaml`, `spec-check-protocol.md`, `.skilled/repo-rules/blast-radius.md` | A (lock YAML, after SYNC-1), B, D | Lock part blocked on SYNC-1 |
| W-G | Contract gaps and NUL bytes | R-10, R-11, R-12, R-13, R-16, R-17, R-19, R-21 | Up to eight implementers, one per row G1 to G8 | the files in each WP-G row | C | Blocked on SYNC-3 |
| W-H | Integrator | Baseline, R-09, R-14, F1, smoke, closure, every commit | Primary session | `AGENTS.md`, `trigger-index.json`, this packet, the 033 parent docs, git | All | Active |

### Execution Waves

| Wave | Runs in parallel | Gate to open the wave |
|------|------------------|------------------------|
| 0 | W-H baseline (T001 to T003) | none |
| 1 | W-A R-01; W-B; W-C R-03 then R-22 | wave 0 recorded |
| 1b | W-A R-22 YAML; W-F lock YAMLs; W-E R-22 mapping | SYNC-1 |
| 2 | W-D; W-F R-15 and R-20; W-A R-07; W-E R-05 comment | SYNC-2 |
| 3 | W-G rows G1 to G8 (up to eight agents) | SYNC-3 |
| 4 | W-E F2 to F8; W-A and W-F staging skip; W-F blast-radius; W-H F1 once ADR-001 is accepted | SYNC-4 |
| 5 | W-H smoke, R-09, R-14, closure | SYNC-5 |

Wave 3 is the widest, with up to eight agents at once.

Commits land in the phase order frozen by goal decision D2. Work inside a wave runs in parallel, and W-H commits each accepted package before it opens the next wave.

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-0 | T001 to T003 recorded | W-H | Baseline suite counts and guard results in `implementation-summary.md` |
| SYNC-1 | W-C R-03 and R-22 accepted and committed | W-H, W-A, W-E, W-F | The `owner_kind` field name and values, the refresh command, and the shared lock-note sentence (ADR-004) |
| SYNC-2 | Phase A accepted: W-A R-01 and R-22, W-B, W-C, W-E mapping, W-F lock YAMLs | W-H | Three P1 failing-then-passing records, R-22 records, guards green |
| SYNC-3 | Phase B accepted | W-H | sk-git suites and the template check green; nine playbook paths resolve |
| SYNC-4 | Phase C accepted, then `run-script-tests.sh` once | W-H | sk-doc suites green; NUL counts 0 and 0 |
| SYNC-5 | Phase D accepted | W-H | Prompt and runner suites green; `check-rule-copies.js` exit 0 after F1 |

### File Ownership Rules
- Every file in this packet's scope has exactly one owning workstream, listed in the table above. No agent edits a file it does not own.
- `deep-review-auto.yaml` and `deep-review-confirm.yaml` belong to W-A alone. Their R-01, R-07, R-22 and staging-skip edits land in that order, in one agent's hands.
- A change an agent believes another workstream's file needs goes into its return as a note. W-H routes it to the owner, or to the follow-up list.
- Agents do not commit, stash, check out or push. W-H commits each accepted package, so two agents never contend for the git index.
- All agents share worktree 090. Disjoint ownership is what keeps them from colliding, so no agent creates a second worktree.
- Tests write only to their own temp directories; all four vitest configs in scope run files serially within each process.

### Agent Dispatch Contract

**Executor (operator decision, 2026-10-06):** every implementer runs as DeepSeek V4.1 Flash at max effort through `cli-pi`, with the `opencode-go` provider (`opencode-go/deepseek-v4.1-flash`). The fallback is `cline-pass/deepseek-v4.1-flash` at `xhigh`. The integrator reads `cli-pi/SKILL.md` before composing a dispatch. Briefs stay short and literal, and they point the agent at its work package in this file instead of pasting it. Per `cli-pi/SKILL.md` ALWAYS rule 12, a work package goes out as a chain of single-change briefs (one test or one edit each, naming the file, the change and the check), and the integrator checks each diff before sending the next. Each brief opens with the child-dispatch preamble and carries this contract:

```
NON-INTERACTIVE WORKER. Nobody can answer you; never end a turn with a question.
Gate 3 is pre-resolved: the spec folder is
specs/system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation.
Work in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/090-deep-review-okf-adoption.

Implement work package <WP-ID> exactly as written below. Write authority: ONLY the files under
"Owns". Read anything. Do not run git commit, stash, checkout, reset or push. Do not install
packages. No code comment may name a finding, task, ADR or packet id.

Order: write each failing-first test and run it; capture the failing command, its exit code
and the failing assertion line. Then make the change and rerun. Then run every Verify command.

If a cited line no longer matches, re-locate it by symbol and say so. If the package is wrong
for the code you find, follow it where it still fits and record the mismatch; do not redesign.

Return exactly:
1. Files changed (paths).
2. Per test: failing run (command, exit, assertion line), passing run (command, exit).
3. Every Verify command with its exit code and last summary line.
4. Notes for files you do not own, if any.

<WP>
```
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:work-packages -->
## L3+: WORK PACKAGES

One package per workstream. Each one is self-contained, so an implementer can execute it from this section plus its owned files, without re-researching. Every citation was read at `b5353b1f7a` by the design agent, and the lead re-ran the probes marked lead-verified. Line numbers can drift; re-locate by symbol and report any drift.

### WP-A: Review workflow and ledger (R-01, R-07, R-22 review YAML part, staging skip)

**Agent profile:** one implementer, TypeScript schemas, YAML workflow assets and vitest. This is the heaviest package. **Phases:** A (R-01, then the R-22 YAML part after SYNC-1), B (R-07), D (staging skip). **Blocked by:** SYNC-0, and SYNC-1 for the R-22 part.

**Owns:**
- `.skilled/commands/deep/assets/deep-review-auto.yaml` and `.skilled/commands/deep/assets/deep-review-confirm.yaml`. No other workstream edits these two files.
- `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` and `deep-review-ledger-schema.ts`
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts`
- Tests under `.skilled/skills/system-deep-loop/runtime/tests/unit/`:
  - new: `deep-review-bookkeeping-emission.vitest.ts`, `deep-review-recovery-baseline-drain.vitest.ts`, `deep-review-stage-skip.vitest.ts`
  - extended: `deep-review-state-contract.vitest.ts`, `deep-review-ledger-schema.vitest.ts` (fixtures at `:399-427`)

**Reads only:**
- `scripts/append-mode-event.cjs`. Its branches stay unchanged: `stem` at `:366-375`, `event_type` at `:376-397`, the research-only upcast at `:398-399`, and `type:'iteration'` at `:443-461`. Anything else throws at `:463` and exits 1 at `:523`.
- `scripts/reduce-state.cjs`
- `scripts/check-ledger-stem-producers.cjs`, which fails on a reserved stem that is emitted (`:342`) or a spoken stem with no emitter (`:333`), and parses census entries one per line (`:172`).
- `deep-research-auto.yaml:107-114`, the `pinned_bookkeeping` precedent.

**R-01 change** (ADR-003 as amended):

1. **Schema.** `scope` and `data` must hold exactly the listed fields (`hasExactFields`, `deep-review-ledger-schema.ts:654-659`). Field-shape rules:
   - digests are 64 lowercase hex characters (`:616-618`);
   - identifiers match `SYSTEM_TOKEN_PATTERN` (`:556`);
   - codes match `CODE_TOKEN_PATTERN` (`:557`), with no spaces.

   Add the additive optional data fields to `DATA_FIELD_RULES` and the interfaces (`deep-review-ledger-types.ts:361,366`):
   - `graph_convergence_evaluated`: `signals`, `blockers` (json);
   - `blocked_stop_recorded`: `gateDetail`, `graphBlockerDetail` (json) and `recoveryHint` (prose).
2. **Directives.** Keep the `append_jsonl` key and rewrite these six values in stem form. The JSON is identical in auto and confirm.

   | Line (auto / confirm) | Today | Stem |
   |-----------------------|-------|------|
   | `:332` / `:314` | `resumed` | `deep_review.run_resumed` |
   | `:341` / `:322` | `restarted` | `deep_review.run_restarted`. Move the append to directly after `step_create_state_log` (`auto:463`), gated to restart runs, so it never precedes `run_initialized` |
   | `:641` / `:647` | `graph_convergence` | `deep_review.graph_convergence_evaluated`, with a deterministic `eventId` of `graph-{session_id}-g{generation}-i{current_iteration}` passed through `meta.eventId` (`append-mode-event.cjs:334`) |
   | `:784` / `:790` | `blocked_stop` | `deep_review.blocked_stop_recorded`, with `originatingConvergenceEventId` set to the graph event id |
   | `:1010` / `:1076` | `userPaused` | `deep_review.pause_recorded` (`normalizedStopReason:"userPaused"`, `outcome:"paused"`) |
   | `:1018` / `:1084` | `stuckRecovery` | `deep_review.recovery_started` (`normalizedStopReason:"stuckRecovery"`, `outcome:"recovery-started"`) |

   Field rules for each stem, by line in `deep-review-ledger-schema.ts`:
   - resume and restart: `:133-148`
   - graph: `:306-321`, blocker rule `:916-921`
   - blocked stop: `:322-330`, check `:905-911`
   - pause: `:331-340`
   - recovery: `:341-351`
   - scope: `:491-492` and `:529-540`
3. **New placeholders.** Bind each one in its step's `outputs`:
   - `{prior_tail_digest}`: the sha256 of the state log bytes.
   - `{graph_decision_code}`: CONTINUE becomes `continue`, STOP_ALLOWED becomes `converged`, STOP_BLOCKED becomes `blocked`.
   - `{graph_blocker_ids_json}`: the blocker `type` values. Use `["graph_blocker"]` when the decision is blocked and the list is empty, because the schema refuses an empty list there.
   - `{graph_raw_signals_json}`, built from the `convergence.cjs:370-378` signals:
     - `coverageRatio`, `findingStabilityRatio`, `evidenceDensityRatio` (capped at 1), `hotspotSaturationRatio` and `noveltyRatio`;
     - `observationDigest`, the sha256 of `graph_signals_json`;
     - the field set is exact (`schema.ts:570-577,726-731`).
   - `{gate_results_array_json}`: one `{gateId,status,reasonCode,evidenceDigest}` per gate (`:748-762`).
   - `{recovery_strategy_code}`: a slug of the prose hint.
   - Fields with no current source get documented stand-ins: `appendPosition` takes `{current_iteration}`, `activeFindingCounts.candidates` and `adjudicated` take the active total, and `originatingPauseEventId` is `"none"`. Record the stand-ins in `implementation-summary.md`.
4. **Census.** Flip the six entries in `DEEP_REVIEW_STEM_PRODUCERS` (`deep-review-ledger-types.ts:596-597,611-614`) to `{ status: 'spoken', producers: [auto, confirm] }`. This goes in the same commit as the directives, or the producer checker fails.
5. **Pins.**
   - In both YAMLs, add `pinned_bookkeeping` with events `config_warning`, `lock_released`, `pivot_confirm_accepted`, `manualStop` and `pivot_override_accepted`, `directive: "bookkeeping_log"`, and handling copied from research. Extend `refusal_handling` the same way.
   - Change the key to `bookkeeping_log` at `auto:625`, `auto:2370`, `confirm:631`, `confirm:1894`, `confirm:1002`, `confirm:1013`, `confirm:1035` and `confirm:1043`.
   - `dry_run_halt` (`confirm:809`, key `dry_run_halt_event`) and `schema_advisory` (`auto:1910`, `confirm:1357`, key `event_shape`) are not routed today and stay as they are.
6. **Projection** (`deep-review-state-contract.ts`). Add a helper `num = s => Number(/(\d+)$/.exec(s)?.[1])`.

   | Stem | Lines | Change |
   |------|-------|--------|
   | `run_resumed` | `:127-136` | add `lineageMode:'resume'` and `continuedFromRun: num(data.continuedFromRunId)`. The reducer reads them at `reduce-state.cjs:419-421,436-445` |
   | `run_restarted` | `:137-146` | add `lineageMode:'restart'` |
   | `graph_convergence_evaluated` | `:168-178` | `run: num(scope.iterationId)`, `signals: data.signals ?? data.rawSignals`, `blockers: data.blockers ?? data.blockerIds`. Map `decision` back to CONTINUE, STOP_ALLOWED or STOP_BLOCKED so the dashboard line stays the same (`reduce-state.cjs:1592,1999`) |
   | `blocked_stop_recorded` | `:179-191` | `run: num(scope.iterationId)` (`isFiniteNumber` at `reduce-state.cjs:1313` zeroes a string), `blockedBy: data.blockedGateIds`, `gateResults: data.gateDetail`, `graphBlockerDetail`, `recoveryStrategy: data.recoveryHint` |
   | `pause_recorded` | new branch | project to `{type:'event', event:'userPaused', stopReason, reason: data.sentinelCause, sessionId, generation}` |
   | `recovery_started` | new branch | project to `{type:'event', event:'stuckRecovery', stopReason, fromIteration, strategy, targetDimension, outcome:'pending'}`. Both new branches are read at `reduce-state.cjs:507-515` |

**R-07 change:** after the heredoc `EOF` at `auto:1461`, insert the drain from `auto:2308-2319`:
1. `NODE_STATUS=$?`
2. the `for eventFile in "$EVENT_DIR"/*.json` gateway loop, which exits with the gateway's status on failure;
3. `rm -rf "$EVENT_DIR"`;
4. `exit "$NODE_STATUS"`.

Confirm has no such branch, by design (`confirm:2005`).

**R-22 YAML part** (after SYNC-1, ADR-004):
1. `auto:297` and `confirm:279` acquire gains `--ttl-ms 1800000`.
2. Add a `step_refresh_lock` as the first step of each iteration. It runs `node .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs refresh --lock-path {state_paths.lock_file} --owner-pid {captured_owner_pid} --nonce {captured_acquire_nonce}`, and on `refreshed:false` it fails closed with "lost the packet lock".
3. Replace the `auto:299` and `confirm:281` notes with the shared sentence from ADR-004: "Acquire reclaims a stale lock itself and reports the old holder under `reclaimed`. A lock is stale when its heartbeat is older than twice its TTL, or when its owning process is known to be dead. No confirmation step exists in either mode: log a `reclaimed` holder and continue. macOS/BSD locking is advisory, so this is a best-effort single writer."

**Staging skip (Phase D):** add `skip_when: "config.fanout_lineage_artifact_dir is present"` under `step_stage_artifact_dir` at `auto:2327` and `confirm:1826`. This uses the existing `skip_when` convention (`auto:182,199`).

**Tests first:**

| Test | File | Expected after | Today |
|------|------|----------------|-------|
| routes only gateway-accepted rows through the append directives in deep-review-{auto,confirm}.yaml | new `deep-review-bookkeeping-emission.vitest.ts`, copied from `deep-research-bookkeeping-emission.vitest.ts:101-143,161-189,202-263`. It opens the run with a `deep_review.run_initialized` stem shaped like `auto:483-499` and extends `renderTemplate` to give digests, codes, signal objects and gate arrays valid shapes | every append directive exits 0; every `bookkeeping_log` event is declared in `pinned_bookkeeping`; every pinned event is refused when sent | `auto:332` exits 1; no `pinned_bookkeeping` block |
| lists the same pinned events in both review workflows | same | equal sets | no block |
| projects the six lifecycle stems into the rows reduce-state reads | extended `deep-review-state-contract.vitest.ts` (`reviewEvent` helper at `:16-31`, reduce as at `:129-145`) | `graphConvergenceScore` equals `signals.score`; blockers preserved; blocked-stop `run` is 3; lineage `resume` with `continuedFromRun` 2; dashboard shows PAUSED or RECOVERING | branches lack these fields; pause and recovery go generic |
| drains the staged recovery baseline into the ledger | new `deep-review-recovery-baseline-drain.vitest.ts`: runs the bash after `EOF` with a preset `EVENT_DIR` | exit 0, a projected `recovery_baseline` row, `EVENT_DIR` removed | nothing after `EOF` |
| refreshes the packet lock at each iteration start, and notes describe automatic reclaim | YAML assertion test | the refresh step exists in both YAMLs; neither contains `stale-lock override is confirm-only` | both missing |
| skips artifact staging inside a fan-out lineage | new `deep-review-stage-skip.vitest.ts` | `skip_when` names `config.fanout_lineage_artifact_dir` | absent |

**Verify** (from `.skilled/skills/system-deep-loop/runtime`):
- `npx vitest run tests/unit/deep-review-bookkeeping-emission.vitest.ts tests/unit/deep-review-state-contract.vitest.ts tests/unit/deep-review-ledger-schema.vitest.ts tests/unit/deep-review-reducers.vitest.ts tests/unit/check-ledger-stem-producers.vitest.ts tests/unit/deep-review-run-open.vitest.ts tests/unit/render-command-contract.vitest.ts tests/unit/deep-review-recovery-baseline-drain.vitest.ts tests/unit/deep-review-stage-skip.vitest.ts`
- `node scripts/check-ledger-stem-producers.cjs`
- `npm run typecheck`

**Contracts that must hold:**
- The `iteration_recorded` passthrough (`deep-review-state-contract.ts:219-228`) stays.
- The config-first run-open row (`deep-review-run-open.vitest.ts:115`) stays.
- The typed reducer reads only named fields (`deep-review-reducer.ts:646-661,1105-1129`), so the new fields are additive.

**Done shape:** four commits:
1. R-01: schema, projection, directives, census and pins together.
2. R-22 review YAML part.
3. R-07.
4. Staging skip.

**Recorded, not fixed here:**
- `pivot_override_accepted` stays out of the state log, which is today's behavior. It is still read at `reduce-state.cjs:1144` and `divergent-review-pivot.ts:365`. Pivot stems go to follow-ups.
- R-07 drains after the dispatch, so a shell killed mid-dispatch still loses the baseline.

---

### WP-B: Devin `write` parity (R-02)

**Agent profile:** one implementer, Node ESM and CJS hooks. **Phase:** A. **Blocks:** nothing. **Blocked by:** SYNC-0.

**Owns (may edit):**
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs`
- `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`
- `.devin/hooks.v1.json`, regenerated only
- `.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts`
- New: `.skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs`
- Docs that still name `^edit$` alone:
  - `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md:49`
  - `.skilled/skills/system-spec-kit/runtime/hooks/devin/README.md:60,63`
  - `.skilled/hooks/post-edit-quality/README.md` (the Devin rows)
  - `.devin/SYNC.md:88`

**Reads only:** `spec-gate-core.mjs`, `sync-hook-registrations.cjs`, `post-edit-router.cjs`, `cli-devin/references/devin-tools.md`, `cursor/spec-gate-enforce.mjs`.

**Facts (lead-verified):**
- The adapter drops `write` before the core gate sees it:
  - `DEVIN_TOOL_MAP = { exec: 'bash', edit: 'edit' }` is at `spec-gate-enforce.mjs:7`.
  - An unmapped tool falls through to `approve()` at `:28-29`.
- The core gate already handles `write`:
  - It treats `write` as deny-capable: `DENY_CAPABLE_TOOLS = new Set(['write', 'edit'])` at `spec-gate-core.mjs:142`.
  - It reads the path the adapter resolves (`file_path`, then `filePath`, then `path`, at `spec-gate-enforce.mjs:11`).
- The post-edit hook allows only `edit`: `DEVIN_EDIT_TOOLS = new Set(['edit'])` at `post-edit-quality.cjs:29-30`, with an early return for any other tool at `:109`.
- Registry bindings are `^edit$` at `hook-registry.json:897` (post-edit) and `:1258` (spec-gate), generated into `.devin/hooks.v1.json:103` and `:135`.
- Devin documents `edit` and `write` as separate tools (`devin-tools.md:153,373`). Cursor already maps `Write: 'write'`.

**Change:**
1. `spec-gate-enforce.mjs:7` becomes `{ exec: 'bash', edit: 'edit', write: 'write' }`.
2. `post-edit-quality.cjs:29-30` becomes `new Set(['edit', 'write'])`. Its comment becomes "Devin's file-mutating tools: edit patches a file, write creates or overwrites one." That drops the "research §10" label the comment-hygiene rule forbids.
3. Registry `:897` and `:1258`: `"^edit$"` becomes `"^(edit|write)$"`. This matches the anchored style of the other Devin bindings and the alternation the Claude (`Write|Edit`) and Codex bindings use. `groupMatcher` throws on mixed matchers in one group (`sync-hook-registrations.cjs:134-137`). Each of these two groups holds one binding, so the change is safe.
4. Regenerate with `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs`. Never hand-edit `.devin/hooks.v1.json`.
5. Update the five doc lines to name both tools.

**Tests first (record each failing):**

| Test | File | Input | Expected after | Today |
|------|------|-------|----------------|-------|
| enforce denies a write when the gate is open and enforce is on | `spec-gate-devin.test.mjs` (copy `:179-194`) | `enforcePayload(root, sessionID, 'write')` | `assertDeny` | empty stdout, `JSON.parse('')` throws |
| enforce advises at the first write | same (copy `:196-209`) | `'write'` | `additionalContext` includes `SPEC FOLDER QUESTION` | empty stdout |
| write payload reaches post-edit quality | new `post-edit-quality.test.cjs` | temp project with an executable stub `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` printing `src/app.js:1 x` and exiting 1; payload `{tool_name:'write', cwd, tool_input:{file_path:'src/app.js'}}` | `additionalContext` contains `COMMENT HYGIENE WARNING` | empty stdout |
| control and edge | same | `'edit'` and `'read'` | warning and silence | warning and silence |
| Devin edit-path bindings also match write | `hook-registration-sync.vitest.ts` | each Devin binding of `post-edit-quality` and `spec-gate-enforce` whose matcher matches `edit` | also matches `write`, never `rewrite` | `^edit$` misses `write` |

**Verify:**
- `cd .skilled/skills/system-spec-kit/runtime && node --test tests/hooks/spec-gate-devin.test.mjs tests/hooks/spec-gate-core.test.mjs`. The adapter parity check at `spec-gate-core.test.mjs:647-656` stays green.
- `cd .skilled/hooks/post-edit-quality/devin && node --test post-edit-quality.test.cjs`
- `cd .skilled/skills/system-spec-kit/runtime/cli && npm test -- tests/hook-registration-sync.vitest.ts` (`package.json:19`; confirm the file filter works, or run the full `npm test`)
- From the repo root, `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` exits 0.
- `git diff .devin/hooks.v1.json` shows only the two matcher lines.

**Contracts that must hold:**
- The deny envelope shape (`spec-gate-enforce.mjs:36-42`) holds.
- Post-edit quality stays warn-only and fail-open, exiting 0 (`post-edit-quality.cjs:168-170`).
- The registry still reproduces all four registration files byte for byte (`hook-registration-sync.vitest.ts:48-58`).

**Done shape:** one commit. Three new failing-then-passing tests, the sync check at exit 0, and a two-line diff in `.devin/hooks.v1.json`.

**Recorded, not fixed here:** the field name inside a live Devin `write` payload is unconfirmed. Both adapters accept all three spellings, so the gap is only a live-proof gap.

---

### WP-C: Stale-lock reclaim identity check (R-03, ADR-002)

**Agent profile:** one implementer, TypeScript and vitest fs mocking. **Phase:** A. **Blocks:** SYNC-1, which W-A, W-E and W-F lock work waits on. **Blocked by:** SYNC-0.

**Owns:** `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts` and `.skilled/skills/system-deep-loop/runtime/tests/unit/loop-lock.vitest.ts`.

**Reads only:** `scripts/loop-lock.cjs`, which imports the `.ts` through tsx at `:142`, so there is nothing to rebuild. Also `tests/unit/loop-lock-cli.vitest.ts`.

**Facts (lead-verified):**
- `tryReclaimStaleLoopLock` (`:298-315`) runs `renameSync(lockPath, reclaimPath)` at `:301`, publishes its own record at `:311`, and removes the claim at `:313`. It never reads the record it moved.
- `acquireLoopLockFileOnly` calls the reclaim twice:
  - at `:468`, the corrupt-file branch;
  - at `:474`, the parsed stale holder from `:456`.
- Refresh and release already claim, read back and compare identity: `lockIdentityMatches` at `:507-521`, used at `:636-637` and `:741-742`.
- `restoreClaimedLoopLock` (`:317-330`) checks `existsSync` and then calls `renameSync`, which leaves an overwrite window.

**The race:**
1. A and B both read stale record X.
2. A renames X aside and links its fresh record FA.
3. B's rename moves FA aside.
4. B links FB and deletes FA.
5. Both return `acquired: true`.

**Change:**
1. Signature becomes `tryReclaimStaleLoopLock(lockPath, data, observedHolder: LoopLockData | null)`. Pass `null` at `:468` and `holder` at `:474`. The function is internal, so `acquireLoopLock` and the CLI stay unchanged.
2. New `sameLockHolder(a, b)`:
   - true when both are null, false when exactly one is;
   - otherwise compares `ownerPid`, `acquireNonce` and `lastHeartbeatIso` (record type at `:20-30`).
3. Directly after the rename: `const claimed = readLoopLock(reclaimPath)` (`readLoopLock` at `:227`). If `!sameLockHolder(claimed, observedHolder)`, restore and return false.
4. New `restoreReclaimedLoopLock(lockPath, reclaimPath)`:
   - `linkSync(reclaimPath, lockPath)`. A link never overwrites; a rename back would silently replace a third acquirer.
   - Swallow `EEXIST`, which means a third acquirer holds the path. Rethrow anything else and leave the claim file, so no record is lost.
   - Then `rmSync(reclaimPath, { force: true })` and a best-effort directory fsync.
   - Do not reuse `restoreClaimedLoopLock`, because it carries the same overwrite window.
5. The caller's existing `failedAcquire(readLoopLock(lockPath))` (`:471`, `:477`) reports the restored holder.

**Tests first** (seam copied from `loop-lock.vitest.ts:487-531`, helpers `writeSerializedLock` and `lockData`):

| Test | Setup | Expected after | Today |
|------|-------|----------------|-------|
| a late reclaimer restores, untouched, a lock another reclaimer published after its stale read | stale lock with `knownDeadPid()`. `vi.doMock('node:fs')` wraps `renameSync`: on the first `lockPath` → `*.reclaiming.*` call, set a flag, run reclaimer A to completion, then delegate. Then run reclaimer B | A acquired, B not acquired; `B.holder.packetId === 'first-reclaimer'`; the on-disk nonce equals A's; no `.reclaiming.` file is left | B acquires and A's record is deleted |
| the corrupt-file reclaim branch also restores a valid lock it did not observe | same harness, starting from `writeFileSync(lockPath, 'not json')` | B not acquired | B acquires |

**Verify:**
- `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/loop-lock.vitest.ts tests/unit/loop-lock-cli.vitest.ts`
- In the same directory, `npm run typecheck`.
- The existing atomic-publish (`:213`), refresh-clobber (`:436`) and release-claim (`:487`) tests stay green.

**Contracts that must hold:** the `LoopLockAcquireResult` shape (`:52-54`); `reclaimed` set only for a parsed stale holder (`:475`); the CLI's JSON output (`loop-lock-cli.vitest.ts:63-66`).

**Done shape:** one commit. Two failing-then-passing tests and a clean typecheck.

**Recorded, not fixed here:**
- If the restore hits `EEXIST` because a third process took the path, A believes it still holds a lock it has lost. That lasts until A's next refresh fails its identity check (`:637-640`). This is the same failure mode refresh already guards against.
- The check-then-rename window in `restoreClaimedLoopLock` used by refresh and release goes to follow-ups.

### WP-C addendum: transient-owner locks (R-22, ADR-004)

WP-C also owns `.skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs` and `tests/unit/loop-lock-cli.vitest.ts` for this part. It lands after the R-03 read-back, in the same workstream.

**Change:**
1. `LoopLockData` (`loop-lock.ts:20-30`) gains optional `ownerKind?: 'process' | 'transient'`. `normalizeLoopLockData` (`:105-130`) reads `owner_kind`, and serialization writes it. An absent field is treated as `process`.
2. `isStaleLoopLock` (`:563-569`):
   ```ts
   const ownerDead = data.ownerKind === 'transient' ? false : !processAlive(data.ownerPid);
   return expired || ownerDead;
   ```
3. `loop-lock.cjs acquire`: when `flags.ownerPid` is undefined, pass `ownerKind: 'transient'`. `status` reports `owner_kind`, keeps `alive` as the raw pid fact, and computes `stale` through the library.
4. Refresh and release keep comparing pid and nonce. The workflows pass back the captured values, so identity still holds.

**Tests first:**

| Test | File | Expected after | Today |
|------|------|----------------|-------|
| a second CLI acquire does not reclaim a fresh lock acquired without an owner pid | `loop-lock-cli.vitest.ts` | the second acquire returns `acquired:false` with the first holder | `acquired:true` with `reclaimed` (lead probe, 2026-10-06) |
| a transient lock whose heartbeat is older than twice its TTL is reclaimed | same | the second acquire returns `acquired:true` with `reclaimed` | reclaimed (the guard row stays green) |
| a process-owned lock with a dead owner is still stale | `loop-lock.vitest.ts` | stale | stale (unchanged) |
| a record without `owner_kind` reads as process-owned | same | stale when the owner is dead | stale |

**Verify:** `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/loop-lock.vitest.ts tests/unit/loop-lock-cli.vitest.ts && npm run typecheck`.

**SYNC-1 output:** the field name `owner_kind` and its values, handed to WP-E (the `holdsLiveLoopLock` mapping) and to WP-A and WP-F (the refresh steps).

---

### WP-D: sk-git argv and input bounds (R-04, R-06, R-08, R-18)

**Agent profile:** one implementer, Node ESM and git CLI semantics. **Phase:** B. **Blocked by:** SYNC-2.

**Owns:**
- `.skilled/skills/sk-git/scripts/lib/git-rule-checks.mjs`, which hosts the expander
- `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs`
- `.skilled/skills/sk-git/scripts/lib/message-contract.mjs`
- `.skilled/skills/sk-git/scripts/validate-message.mjs`, whose `:45` has the same unguarded flag call. Widened from T023, because a throw there fails closed behind commit-msg, pre-push and CI.
- `.skilled/skills/sk-git/assets/commit-message-template.md` and `.skilled/skills/sk-git/assets/pr-template.md`, for the rule-id prose rows
- `scripts/lib/message-contract.test.mjs` and `scripts/lib/git-rule-checks.test.mjs`

**Reads only:**
- `hooks/git-preflight-advisory.mjs`
- `hooks/pi/git-message-gate.ts`
- `.opencode/plugins/sk-git-message-gate.js`
- `.skilled/commands/doctor/scripts/git-standards.cjs`

Both transports import the gate's `evaluateCommand` and copy no parsing (`pi/git-message-gate.ts:25-35`, `sk-git-message-gate.js:17,54`).

**Facts (lead re-ran the probes):**
- `evaluateCommand('git commit -am "wip"')` returns allow, while `-a -m "wip"` blocks. The agent also observed `-sm`, `-qm`, `-asm` and `-aF` allowed.
- `parseGitCommand('git commit -am "wip"')` gives flags `["-am"]` and paths `["wip"]`.
- **A second bug the review missed:** `parseGitCommand('git commit -s -m "wip"')` gives flags `["-s"]` and paths `["wip"]`. `VALUE_FLAGS` (`:39-43`) treats `-s` and `-u` as value flags for every subcommand, and `BARE_IN_SUBCOMMAND` (`:47`) has no `commit` entry.
- R-06: `MAX_INPUT_CHARS = 200_000` (`message-contract.mjs:31`) is silently sliced at `:427` (commit) and `:627` (PR body).
- `templateDriftErrors` (`:718-736`) requires every rule id to be named in the template prose.
- R-18: `v8.setFlagsFromString` at `git-message-gate.mjs:380` sits outside the try at `:382`. A throw skips the whole gate, though on Node 26 an unknown flag prints an error rather than throwing.

**Change:**
1. **Expander**, in `git-rule-checks.mjs`. It goes there rather than a new module because that file already owns argv arity and imports only `node:path`, so the gate can import it without a cycle.
   - Export `COMMIT_OPTION_ARITY`:
     - `value`: `-m -F -C -c -t --message --file --reuse-message --reedit-message --template --author --date --cleanup --fixup --squash --trailer --pathspec-from-file`.
     - `optional` (attached value only): `-S -u`.
     - Everything else is bare, per `git commit -h`.
   - Export `expandShortFlags(args, arity)`:
     - Everything from `--` on is verbatim.
     - A long option, `-`, or a non-`/^-[A-Za-z]/` token is verbatim; a long value option without `=` also copies the next token verbatim.
     - Otherwise walk the cluster letters:
       - a bare flag emits `-L`;
       - a value flag emits `-L`, ends the cluster, and takes the rest of the token or else the next token, never expanding that value;
       - an optional flag emits `-L<rest>` as one token and ends the cluster.
2. **`parseGitCommand`:**
   - When `sub === 'commit'`, expand after unquoting.
   - Add `commit: new Set(['-s', '-u'])` to `BARE_IN_SUBCOMMAND`.
   - Expand for commit only. `/^-[a-z]*f/` (`:358`) and `/^-X(ours|theirs)$/` (`:298`) match whole clusters for other subcommands.
3. **Gate:** import both symbols and iterate `expandShortFlags(args, COMMIT_OPTION_ARITY)` in `commitMessage`. `optionValue` and `prBody` stay unchanged.
4. **R-06 commit side:** replace `:427` with an early return carrying `err('message.too-long', ...)` and `passthrough: false`. Push `'message.too-long'` after `'message.empty'` in `commitRuleIds`.
5. **R-06 PR side:** in `validatePrBody`, normalise CRLF without slicing, then return `err('pr.too-long', ...)` when over the cap, and push `'pr.too-long'` after `'pr.empty'`.
6. **R-06 template rows:** add after `commit-message-template.md:190` and `pr-template.md:550`, in the same commit.
7. **R-18:** wrap `git-message-gate.mjs:380` and `validate-message.mjs:45` in `try { ... } catch { }`, keeping the existing comment. The catch body is a one-line comment naming the lost fallback.

**Tests first:** gate rows go through `evaluateCommand` in `tempRepo()`; parser rows go in `git-rule-checks.test.mjs`.

| Input | Surface | Expected after | Today |
|-------|---------|----------------|-------|
| `git commit -am "wip"`, `-sm`, `-qm`, `-asm`, `-aF <file holding "wip">` | gate | match `/subject\.format/` | allow (observed) |
| `git commit -am "feat(sk-git): add a thing" -m "Explains why."` | gate | allow | allow |
| `git commit -m -am` | gate | block (a value is never expanded) | block |
| `git commit -am "wip"` | parse | flags `-a`, `-m`; paths `[]` | `-am`; `wip` |
| `git commit -s -m "wip"` | parse | flags `-s`, `-m`; paths `[]` | `-s`; `wip` |
| `git commit -om "wip" src` | parse | `-o`, `-m`; `src` | `-om`; `wip`, `src` |
| `git clean -fdx`, `git merge -Xours main` | parse | unchanged | unchanged (guard rows) |
| `commit-scope-drops-untracked` on `git commit -am x` with an untracked file | check | fires | silent |
| commit message of exactly 200,000 characters, then 200,001 | `validateCommit` | no id, then `message.too-long` | silently sliced |
| PR body at the cap, then over it | `validatePrBody` | none, then `pr.too-long` | silently sliced |
| `commitRuleIds`, `prRuleIds` | contract | include the new ids | absent |

**Verify** (repo root): run the baseline before editing and the delta after.
- `node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` (CI: `message-contract.yml:42`)
- `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`
- `node --test .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.test.mjs`
- `node --test .opencode/plugins/tests/sk-git-message-gate.test.cjs`
- `node --test .skilled/commands/doctor/scripts/tests/git-standards.test.cjs`
- `node .skilled/skills/sk-git/scripts/validate-message.mjs --check-template .skilled/skills/sk-git/assets/commit-message-template.md --kind commit`, then the same command for `pr-template.md` with `--kind pr`
- `node --check` on every edited `.mjs`

**Contracts that must hold:**
- The gate still allows anything it cannot read (`git-message-gate.mjs:11-14`).
- The advisory still fails open and stays silent when unsure (`git-rule-checks.mjs:18-19`).
- `validateCommit` keeps its `{errors, warnings, passthrough}` shape with `{id, message}` entries.
- The shipped-template drift test (`message-contract.test.mjs:63-67`) stays `[]`.

**Done shape:** one commit for the expander and gate (R-04, R-08) and one for the cap and flag guard (R-06, R-18).

**Recorded, not fixed here:**
- A repository holding its own template copy will see a `/doctor:git-standards` drift report until it adds the two new rows. That is informational, and the ids stay unconditional.
- R-18 has no test seam without mocking `v8`, so it is verified by reading and by `node --check`.
- `commitMessage` ignores `--`, and the gate misses bundled `gh pr` flags. Both predate this work and go to follow-ups.

---

### WP-E: Fan-out runner (F2, F3, F4, F6, F8, R-05 waiver, R-22 mapping)

**Agent profile:** one implementer, CommonJS runner and vitest. **Phases:** B (R-05 comment), D (F2 to F8). **Blocked by:** SYNC-1 for the `owner_kind` mapping, and SYNC-3.

**Owns:**
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs` (comment only)
- `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs`
- Tests:
  - `tests/unit/fanout-run.vitest.ts`, `tests/unit/fanout-pool.vitest.ts`, `tests/unit/fanout-salvage.vitest.ts`
  - new `tests/unit/cli-guards-needs-input.vitest.ts`

**Facts the design rests on (agent-read, lead-checked where marked):**
- `buildLoopPrompt` starts at `fanout-run.cjs:1442` and is called at `:3361`, with `promptLineageDir = path.resolve(...)` at `:3360`. So the prompt shows only absolute paths today.
- The child env sets `SYSTEM_SPEC_GATE_DISABLED` and `AI_SESSION_CHILD`, but not `SYSTEM_SPEC_GATE_ENFORCE=0` (`:3440-3441`, lead-checked). The preamble must name only what is set.
- `AGENTS.md:61` waives Gate 3 only, so F2 gives the dispatcher's answer to the other stop rules rather than claiming `AGENTS.md` waives them (`child-dispatch-preamble.md:76-78`).
- The session id is minted per runner start (`:3157`, `:3359`).
  - Review stores it at `<lineageDir>/deep-review-config.json`, top-level `sessionId` (`reduce-state.cjs:2108,2125`).
  - Research stores it at `<lineageDir>/deep-research-config.json`, `lineage.sessionId` (`deep-research-auto.yaml:364,530`).
- A question-shaped exit 0 is treated like a salvage miss:
  - it throws with a salvage failure (`:3803-3815`);
  - that is classed `salvage_miss` and retryable (`cli-guards.cjs:181-195`);
  - the pool requeues it (`fanout-pool.cjs:640-659`).

**Change:**
1. **Shared prep**, after `fanout-run.cjs:1448`:
   - compute `absoluteLineageDir`, `relativeLineageDir` and `promptDir`;
   - `promptDir` is the relative form when it stays inside cwd, otherwise the absolute form;
   - always use the absolute form for `kind === 'cli-cursor'`, which runs in a neutral workspace (`:2470-2479`).
2. **F2**: insert as the first array entries of the returned prompt, for every lineage kind:
   - "GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION."
   - "You are a non-interactive dispatched worker: AI_SESSION_CHILD=1 is set, which AGENTS.md defines as the autonomous child-dispatch exemption. Nobody is at a prompt, so no answer can reach you."
   - "Your write authority is already bound to ${promptDir}. The dispatcher's answer to every other stop-and-ask rule (Halt Conditions, Logic-Sync, stop-for-yes): follow the workflow within this prompt's write limits, record the conflict in the current iteration, and continue. Never end a turn with a question or A/B/C/D options."
   - "A failed call means re-check the path and retry; halt only after three failures on the same call. The lineage is complete only when its files exist on disk and the completion line below is printed."
   - an empty line.

   "Within this prompt's write limits" keeps the no-git-write clause at `:1573-1574` in force.
3. **F3**: replace `:1583-1585` with:
   - "Before init, before each iteration, and before resolving any conflict, read ${path.join(promptDir, 'steer.md')} when it exists."
   - "It is the lead's channel: its rulings are the dispatcher's answers to questions this lineage would otherwise ask, and they bind inside the lineage directory."
   - "It grants no write outside the lineage. When you read it, list it among that iteration's sources."

   The `AGENTS.md:169` clause from the Luna analysis is dropped, because the byte budget leaves no room for it (ADR-001). The prompt carries the authority instead.
4. **F6**:
   - use `${promptDir}` at `:1568` and `:1573`, and keep the absolute path at `:1569` for reference only;
   - keep `config.fanout_lineage_artifact_dir` absolute (pinned at `fanout-run.vitest.ts:4542-4544`, `deep-research-run-open.vitest.ts:160`);
   - replace `:1577-1578` with:
     - "Use the repository-relative form ${promptDir} in every tool call, copied character for character; never type the absolute home prefix or rebuild the path from the packet or track name."
     - "A "file not found" on a path you just wrote means the path was mistyped: re-copy ${promptDir} and retry."
5. **F4**: add `readStoredLineageSessionId(loopType, lineageDir)` next to `holdsLiveLoopLock` (`:545`) and export it at `:3986`.
   - It returns the stored id: `config.sessionId` for review; `config.lineage?.sessionId ?? config.sessionId` for research.
   - It returns null when the file is missing or unparseable, the id is empty, or the config says `status: complete`.
   - Call site at `:3359`: `` const sessionId = readStoredLineageSessionId(loopType, lineageDir) || `fanout-${lineage.label}-${runId}`; ``.
6. **F8**: question-shaped exits only. The lock reclaim before respawn is dropped, because the child's own acquire already reclaims a stale lock.
   - **Class.** In `cli-guards.cjs`:
     - add `NEEDS_INPUT: 'needs_input'` to `LINEAGE_FAILURE_CLASSES` (`:25-31`);
     - add and export `PENDING_QUESTION_PATTERN = /LOGIC-SYNC REQUIRED|Which truth prevails\?|\bReply\s+\*{0,2}[A-D]\*{0,2}(?=\s|[,.:)]|$)|\bneed your (?:choice|approval|confirmation|decision)\b|\b(?:Shall|Should|May) I (?:proceed|continue)\b/`.
   - **Detector.** `detectPendingQuestion(text)`:
     - checks the last 12 non-empty lines;
     - matches the pattern, or a last line ending in `?`;
     - returns `null` when `FANOUT_LINEAGE_COMPLETE:` is present;
     - otherwise returns `{ question }`, the last line cut to 300 characters.
   - **Classifier.** In `classifyLineageFailure`, add `error.needsInput === true` → `NEEDS_INPUT`, after the timeout and projection-refusal branches and before the salvage branches (`:178-190`). It is not retryable: `retry_verdict:'fatal'`.
   - **Runner.** In `fanout-run.cjs`:
     - after `:3755`, run the detector on the saved stdout;
     - in the exit-0 throw branches (`:3803`, `:3835`), set `failure.needsInput = true` and `failure.reason = 'needs_input'`;
     - append a `{event:'needs_input', status:'needs_input', label, attempt, run_id, question, at}` ledger row.
   - **Rollup.** `buildFailureClassRollup` (`fanout-pool.cjs:119-125`) gains `needs_input: 0`, or the class is silently dropped (`:134`).
7. **R-22 mapping**: `holdsLiveLoopLock` (`:557-561`) passes `ownerKind: record.owner_kind` into `isStaleLoopLock`, so a live transient-owner run is seen as live.
8. **R-05 (ADR-005)**: a two-line comment above `fanout-salvage.cjs:170` saying the row is advisory and a later projection rewrite can drop it.

**Tests:**
- **Existing assertions to update:**
  - `fanout-run.vitest.ts:1032` now checks for the "Use the repository-relative form ... in every tool call" line.
  - `fanout-run.vitest.ts:2342-2348`: the steer line uses the new wording and the relative path.
  - `fanout-pool.vitest.ts:214,678-684,728-734,928-934,942-948`: add `needs_input: 0`. Also update the type literals at `:43,60,66`.
- **Must stay green:**
  - `fanout-run.vitest.ts:2332,3016,3069,4542`
  - `workflow-session-id-parity.vitest.ts:203`
  - `fanout-loop-prompt-in-process.test.ts:37,58-61,85`
  - `result-envelopes.vitest.ts:858-863`
- **New tests:**
  - `cli-guards-needs-input.vitest.ts`:
    - detects a Logic-Sync tail;
    - detects a "Reply **A**" menu;
    - ignores a completed or plain transcript (`stub-done-without-artifact`);
    - classifies `needsInput` as non-retryable `needs_input`;
    - a timeout outranks `needsInput`.
  - `fanout-pool.vitest.ts`: does not retry a `needs_input` lineage and rolls it up, with one worker call and no `retry_scheduled`.
  - `fanout-run.vitest.ts`:
    - opens with the child-dispatch preamble, naming `AI_SESSION_CHILD=1` and not `SYSTEM_SPEC_GATE_ENFORCE=0`;
    - falls back to the absolute path outside cwd;
    - `readStoredLineageSessionId` reads a review id, reads a research id, and returns null for a complete or malformed config;
    - reuses the stored session id, using the echo stub `runOpencodeEcho` at `:4462`;
    - classifies an exit-0 question as `needs_input` without retry;
    - `holdsLiveLoopLock` sees a fresh transient-owner lock as live.

**Verify:** `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/cli-guards-needs-input.vitest.ts tests/unit/fanout-pool.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/fanout-salvage.vitest.ts tests/unit/workflow-session-id-parity.vitest.ts tests/unit/deep-research-run-open.vitest.ts tests/unit/result-envelopes.vitest.ts tests/fanout-loop-prompt-in-process.test.ts`.

**Callers and contracts:**
- `buildLineageCommand`'s signature is unchanged. It is called at `deep-review-auto.yaml:1616,1706,1796`.
- `classifyLineageFailure` is called at `fanout-pool.cjs:142`.
- The `FANOUT_LINEAGE_COMPLETE:` line stays the completion signal.

**Done shape:** three commits:
1. R-05 comment (Phase B).
2. R-22 mapping (Phase A, after SYNC-1).
3. F2, F3, F4, F6 and F8 (Phase D).

---

### WP-F: Docs and non-review workflow copies (R-15, R-20/F7, R-22 and F5 wording copies, staging skip copies)

**Agent profile:** one implementer, docs and YAML. **Phases:** A for the lock YAMLs (R-22, after SYNC-1); B for R-15 and R-20; D for the staging skip and the blast-radius carve-out.

**Owns:**
- Six runtime playbooks under `.skilled/skills/system-deep-loop/runtime/manual-testing-playbook/fanout/`: `fanout-pool-concurrency-cap.md:49`, `artifact-dir-override-parity.md:54`, `fanout-run-cli-lineage-spawn.md:51`, `fanout-salvage-recovery.md:52`, `fanout-merge-review-strongest-restriction.md:49`, `fanout-merge-research.md:49`
- Three deep-review playbooks under `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/`: `fanout-strongest-restriction.md:49`, `fanout-single-executor-parity-review.md:53`, `fanout-cli-lineages-review.md:55`
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/references/state/state-format.md`
- `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-ai-council-auto.yaml`, `deep-ai-council-confirm.yaml`, `deep-agent-improvement-auto.yaml`, `deep-agent-improvement-confirm.yaml` (lock note only)
- `.skilled/skills/system-deep-loop/deep-research/references/protocol/spec-check-protocol.md`
- `.skilled/repo-rules/blast-radius.md`. The root `repo-rules/blast-radius.md` is a symlink to it, so edit only the `.skilled` file.

**Must not touch:**
- `deep-review-auto.yaml` and `deep-review-confirm.yaml`, which belong to WP-A.
- Every `assets/*-config.json`. Their `"immutable"` values may be read at runtime.

**Change:**
1. **R-15 playbooks.** Each of the nine lines runs `cd .skilled/skills/system-spec-kit/runtime && npx vitest run ../../runtime//tests/unit/<X>`. It becomes `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/<X>`. Keep the step number, the backticks and any `--reporter=verbose`. Two of the lines target the directory `tests/unit/`. The targets exist, and `runtime/vitest.config.ts:17` includes them.
2. **R-20 / F7 config wording.**
   - `deep-review/SKILL.md:392` becomes: "6. **Modify config after init**, review parameters in `deep-review-config.json` are read-only after initialization; the terminal `step_update_config_status` flip to `status: complete` is the one permitted write."
   - `deep-research/SKILL.md:356` becomes: "6. **Modify config after init** -- Research parameters are read-only after initialization; the terminal `step_update_config_status` flip to `status: complete` is the one permitted write".
   - `state-format.md:26` table cell becomes: "Immutable after init, except the terminal `status: complete` flip".
   - `state-format.md:153` becomes: "Cannot be modified after creation (config: the terminal `status: complete` flip is the one permitted write)".
   - Leave the JSON example at `:98` alone, because it mirrors `assets/deep-review-config.json:60`.
3. **R-22 and F5 lock wording (ADR-004), after SYNC-1.** In each of the four loop-lock workflows (`deep-research-auto.yaml:272,274`, `deep-research-confirm.yaml:292,294`, `deep-ai-council-auto.yaml:120,122`, `deep-ai-council-confirm.yaml:127,129`):
   - add `--ttl-ms 1800000` to the acquire command;
   - add a `step_refresh_lock` as the first step of each iteration or round. It runs `loop-lock.cjs refresh --lock-path {state_paths.lock_file} --owner-pid {captured_owner_pid} --nonce {captured_acquire_nonce}` and fails closed on `refreshed:false`;
   - replace the note's stale-lock clause with the shared sentence: "Acquire reclaims a stale lock itself and reports the old holder under `reclaimed`. A lock is stale when its heartbeat is older than twice its TTL, or when its owning process is known to be dead. No confirmation step exists in either mode: log a `reclaimed` holder and continue."
   - `spec-check-protocol.md:69` gets the same sentence.
   - The two improvement YAMLs (`deep-agent-improvement-auto.yaml:168`, `deep-agent-improvement-confirm.yaml:181`) use a plain advisory open, not `loop-lock.cjs`. Their note becomes: "A stale lock is reclaimed without confirmation when its recorded holder process is no longer alive; the lock is runtime state this workflow creates, not an operator file."
   - The original F5 test, `alive:false`, is superseded: under ADR-004 it would always pass for a transient owner.
4. **blast-radius.md.** After `:70`, as a third wrapped line of the same bullet: "This does not cover runtime lock or state files a running workflow creates and regenerates itself, such as `.deep-review.lock`."
   - Check 10 of `check-repo-rules.cjs` scores only `## Fires when` bullets (blast-radius.md `:33`), and this edit sits in §2. No checker pins this text.
5. **Staging skip.** Insert `skip_when: "config.fanout_lineage_artifact_dir is present"` directly under `step_stage_artifact_dir:`.
   - Locations: `deep-research-auto.yaml:2307` and the confirm twin at `deep-research-confirm.yaml:1727`.
   - The shape follows the existing `skip_when: "config.fanout is present"` at `deep-research-auto.yaml:518,1967,2225`.
   - The council and improvement YAMLs have no staging step.

**Verify:**
- `rg -n 'runtime//tests' .skilled/skills/system-deep-loop --glob '*.md'` leaves only `runtime/references/integration-points.md:93`, which is not a command and goes to follow-ups.
- `rg -n 'system-deep-loop/runtime && npx vitest run tests/unit/' .skilled/skills/system-deep-loop --glob '*.md' | wc -l` gives 9.
- `rg -n -i 'stale-lock override is confirm-only' .skilled` returns nothing once WP-A has also landed.
- `rg -n 'loop-lock.cjs refresh' .skilled/commands/deep/assets` shows one refresh step in each of the six loop-lock workflows once WP-A has also landed.
- `rg -n 'one permitted write' .skilled/skills/system-deep-loop` gives 4.
- `rg -n -A1 'step_stage_artifact_dir:' .skilled/commands/deep/assets/deep-research-*.yaml` shows `skip_when` on the next line in both files.
- `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)`; the agent's baseline was 11/11.
- Each edited YAML parses (see the T003 baseline step for the parser).

**Done shape:** three commits: the lock YAMLs (Phase A), the docs (R-15 and R-20, Phase B), and the staging skip with the blast-radius carve-out (Phase D).

---

### WP-G: Advisory contract gaps and NUL bytes (R-10, R-11, R-12, R-13, R-16, R-17, R-19, R-21)

**Agent profile:** up to eight implementers, one per row below. The rows touch disjoint files. **Phase:** C. **Blocked by:** SYNC-3.

| Row | Finding | Owns | Change | Failing-first test (today's result probed unless marked) | Verify | Posture to keep |
|-----|---------|------|--------|-----------------------------------------------------------|--------|-----------------|
| G1 | R-10 | `.skilled/skills/sk-doc/shared/scripts/validate_document.py`, `.skilled/skills/sk-doc/scripts/tests/test_frontmatter_values.py` | `_load_frontmatter_values` (`:1607-1616`): keep `FileNotFoundError → None` (silent, no list in this checkout). Add `except (OSError, ValueError)` plus a shape check (both keys present, each with `canonical` and `aliases` lists). On failure return an unreadable sentinel, so `validate_frontmatter_values` emits one `frontmatter_values_unreadable` warning naming the file and skips the comparison | "unreadable list degrades to one warning": a list holding `{"contextType": `, then a list missing `contextType`. Expect one warning; today `JSONDecodeError`, then `KeyError` | `cd .skilled/skills/sk-doc/scripts/tests && python3 test_frontmatter_values.py` | Warn-only; never a traceback or exit 1 |
| G2 | R-11 | `.skilled/hooks/goal/lib/goal-core.cjs`, `goal-core.test.cjs` | After the tail passes the blocking test, scan the evidence before the tail with `VERIFIER_BLOCKING_PATTERN` (`:135`). On a hit, return `unclear` ("Earlier evidence includes blocking language the closing summary does not settle"). Update the comment at `:597-600` | "does not return met when a blocker precedes a conclusive tail": `'The P0 widget shipping test failed with an error. ' + 'x '.repeat(1500) + ' The widget shipping work is done and tests passed for the widget shipping change.'`. Expect not `met`; today `met` | `node --test .skilled/hooks/goal/lib/goal-core.test.cjs .skilled/hooks/goal/pi/goal-pi.test.mjs` | Advisory; never forces continuation |
| G3 | R-12 | `.skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.mjs`, its test, the hook README Bounds row | `MAX_SECTION_CHARS = 8000` and `MAX_SCREENED_CHARS = 8000 * MAX_SCREENED_SECTIONS` (96,000). Slice the text before `prepareSections`, and count the dropped part as `Math.ceil(dropped / 8000)` unchecked. Split any piece longer than 8,000 into slices that keep its heading. Units are UTF-16 code units, so no character splits | "one huge single-line page is capped per section and in total": `'a'.repeat(1_000_000)`. Expect every stdin ≤ 8,000, `checked 12`, `unchecked 113`; today one section, maximum stdin 1,000,000 | `node --test .skilled/hooks/classifier-injection-screen/lib/classifier-screen-fetched-text.test.mjs` | Fail-open and advisory; lost coverage is reported as unchecked |
| G4 | R-13 | `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`; new `runtime/cli/tests/validate-recursive-artifact-skip.vitest.ts` | `:386-388`: skip only when the child holds no top-level `*.md` and no `graph-metadata.json`. On a skip, print `Skipped <dir>: no packet docs (holds: <entries>)` to stderr unless quiet. The 24 artifact-only children under real packets today stay skipped | "a numbered child that kept plan.md but lost spec.md is validated, not skipped", using fixtures `002-lost-docs/plan.md` and `003-review-only/review/x.md` (today's result inferred from the code) | `cd .skilled/skills/system-spec-kit && npx vitest run --project cli runtime/cli/tests/validate-recursive-artifact-skip.vitest.ts`, plus `bash runtime/cli/tests/test-validation.sh` | Artifact-only children stay skipped; stdout stays clean for `--json` |
| G5 | R-16 | `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs`, `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | **Corrected symptom.** With no citation in range, `runAdvise` returns before printing (`:911`), so nothing is reported at all. `adviseCitations` returns `{ inRange, notInRange }`. Stay silent only when both are 0 or the gate is null. Append ` not_in_range=N` to the summary, and update the exact-string test at `:1741-1742` | "advise reports moved and past-end citations as not in range". Expect a summary with `not_in_range=2`; today no lines | `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs`. No runner picks this file up, so run it by name | Warn-only; always exits 0 |
| G6 | R-17 | `.opencode/plugins/classifier-injection-screen.js`, `.opencode/plugins/tests/classifier-injection-screen.test.cjs` | `sessionIdOf` reads `sessionID ?? sessionId ?? session?.id ?? properties?.sessionID` (pattern from `system-spec-gate.js:66-69`). When the transform resolves to the unknown bucket and that bucket is empty, drain the one session holding advisories, only if exactly one does. The cross-session leak test (`:117-133`) stays green | "a transform without a sessionID drains the only pending session". Expect `[ADVISORY]`; today `[]` | `node --test .opencode/plugins/tests/classifier-injection-screen.test.cjs` | Fail-open; silent on stdout and stderr |
| G7 | R-19 | `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs:318`, `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/rubric-guard.cjs:59`, a no-NUL test beside each | Replace the raw byte with the six characters `\u0000` using a byte-level write (`bytes.replace(b'\x00', b'\\u0000')`), because Edit cannot match a raw NUL. The strings are identical, so stored digests do not change | "source file carries no raw NUL byte": `!readFileSync(target).includes(0)`. Today one NUL in each file (lead-counted) | NUL count 0 and 0. `cd .skilled/skills/system-spec-kit && npx vitest run --project root runtime/tests/completion-evidence-sentinel.vitest.ts`, and the deep-improvement vitest per its config | Byte-identical behavior |
| G8 | R-21 | `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`, `.skilled/skills/sk-doc/scripts/tests/test_check_repo_rules.py` | Add `SHORT_STEM_SUFFIXES = new Set(['ed', 'ing'])`. At `:230` the floor becomes 3 for those suffixes and stays 4 otherwise. The prefix floor at `:241` stays. Fix the comment at `:224` | `test_moved_bullet_meets_moving_router_item`: today exit 1 with `FAIL fires-when coverage`; after, exit 0 | `cd .skilled/skills/sk-doc/scripts/tests && python3 -m pytest -q -p no:cacheprovider test_check_repo_rules.py`. Then `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` prints `RESULT: PASSED (11/11 checks)` | Check 10 is blocking; this may only widen what meets |

**Serial step after all rows:** `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` once from the merged state, because G1, G5 and G8 all touch sk-doc tests.

**Recorded, not fixed here:**
- The G3 caps derive from existing constants, not from measured classifier latency.
- The OpenCode goal plugin keeps its own copy of the G2 heuristic.
- Whether the two artifact-directory lists should become one is separate from G4.
- **Done shape:** one commit per row, or one per row pair where a single agent ran two rows.

---

### WP-H: Integrator (baseline, release tail, F1, smoke, close)

**Agent profile:** the primary session. It is the only agent that commits and the only one that edits `AGENTS.md`, the trigger index and this packet's docs.

**Owns:**
- `AGENTS.md`
- `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`
- every file in this packet
- the 033 parent's `spec.md` and `graph-metadata.json`
- all git operations

**Steps:**
1. **Baseline (T001 to T003).**
   - Confirm provisioning.
   - Run every suite in `research/research.md` section 3 and each work package's verify commands, and record the pass and fail counts in `implementation-summary.md`.
   - Record the guard baselines:
     - `check-rule-copies.js`: anchor offsets, last at 16,359;
     - `generate-trigger-index.mjs --check`: exit 1, R-09;
     - `sync-hook-registrations.cjs --check`;
     - `check-repo-rules.cjs`: 11/11;
     - `check-ledger-stem-producers.cjs`;
     - the NUL counts, 1 and 1.
2. **Dispatch each wave** with the dispatch contract below. Each work package goes to one agent; WP-G rows can go to separate agents.
3. **Accept a return** only after re-running its work package's verify commands and reading both output and exit code. Also check `git status --short` for files outside the package's ownership. A return's "done" is a claim until then.
4. **Commit** each accepted package with `type(scope): summary` and a `Spec: system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation` trailer, and no attribution lines.
5. **R-14.** Run `repair-derived.cjs --folder specs/system-speckit/033-system-speckit-v4 --apply`, then `validate.sh --strict` on 033, and require `RESULT: PASSED` on every folder.
6. **R-09.** After the last doc edit of the packet, run `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs`, then `--check` must exit 0.
7. **F1 (T047), only after the operator accepts ADR-001.**
   - Rewrite the `AGENTS.md:61` bullet to include the record-and-continue scope, keeping the change byte-neutral before the Blast-Radius anchor at 16,359: for every byte added, trim the same number elsewhere before that anchor.
   - Add the free clauses at `:178` and `:188`, which sit past the anchor.
   - Run `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js`; it must exit 0 with every anchor at or under 16,384.
   - Tell the operator to update `~/.claude/CLAUDE.md`.
8. **Smoke (T048).** Run one two-iteration Luna lineage:
   - command: `node .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs --spec-folder specs/system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation --loop-type review --fanout-config-json '[{"kind":"cli-codex","model":"gpt-6-luna","reasoningEffort":"max","serviceTier":"fast","label":"luna-smoke","iterations":2}]' --base-artifact-dir specs/system-speckit/033-system-speckit-v4/069-v4-0-0-3-review-remediation/scratch/luna-smoke --convergence-threshold 0.10 --stop-policy max-iterations --convergence-mode default`;
   - check that both iteration files exist and that `detectPendingQuestion` finds nothing in the lineage stdout;
   - record the result, then remove `scratch/luna-smoke/`;
   - if the Luna route is down, record the smoke as operator-verifiable.
9. **Close (T050 to T053).** Rerun everything from step 1, report the delta, map R-01 to R-22 and F1 to F8 to a SHA or an ADR, strict-validate both folders, and fill `acceptance-criteria.md`.
10. **Push** only when the operator asks.

<!-- /ANCHOR:work-packages -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints
- **Per return**: W-H re-runs the work package's verify commands, then records the outcome in `tasks.md` and the evidence in `implementation-summary.md`.
- **Per sync point**: W-H records the sync output listed in the Sync Points table before it opens the next wave.
- **Per phase**: W-H reports a closeout to the operator covering what landed, the commit SHAs, the delta against the baseline, and any new findings.
- **Blockers**: a work package that cannot follow its plan returns at once with the mismatch. W-H decides whether to re-plan, and records the outcome in `decision-record.md` when the decision changes.

### Escalation Path
1. A cited line or symbol has moved: the implementer re-locates it, and W-H checks the result on return.
2. A package is wrong for the code: the implementer records the mismatch, W-H amends the package (or its ADR), and the work re-dispatches.
3. A fix would touch a file another workstream owns: routed to the owner through W-H.
4. A scope change, a new finding above P2, or an ADR status change: W-H stops and asks the operator.
5. Three failed fixes for the same symptom: W-H stops the workstream and escalates with evidence, per `AGENTS.md` §3.

### Notification Matrix

| Event | Who is told | How |
|-------|-------------|-----|
| A wave opens or closes | Operator | One-line status |
| A P1 test recorded failing, then passing | Operator | Closeout at SYNC-2 |
| A new finding at P1 or above | Operator | Immediate message plus a new ADR or spec row |
| ADR-001 decision needed (T047) | Operator | Asked at SYNC-4 |
| Commit or push | Operator | A push only on the operator's instruction |
<!-- /ANCHOR:communication -->

---
