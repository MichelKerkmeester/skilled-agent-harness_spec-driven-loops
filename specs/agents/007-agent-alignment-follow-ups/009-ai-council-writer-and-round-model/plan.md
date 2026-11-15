---
title: "Implementation Plan: Phase 9: ai-council-writer-and-round-model"
description: "Fix the eight owned ai-council findings in the agent, its copies, its registry record and the deep-ai-council references, in an order that keeps every section citation valid in each commit. The writer, Q11, round-model and size edits follow the operator's writer answer A, the agent."
trigger_phrases:
  - "ai council writer and round model plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: ai-council-writer-and-round-model

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent and skill documents, one JSON registry, one TypeScript vitest file |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` and `wc` checks per requirement, the roster and mirror checks, the compiled-contract diff, the council vitest suites and `validate.sh --strict` |
| **Exploration** | The four step 5 explorers of `speckit-plan.yaml` (architecture, feature, dependency and test) ran inline with Grep, Read and Bash, as the workflow's fallback allows, because a leaf worker cannot dispatch agents |
| **Unknowns** | Phase 6's added line count (measured after it lands). Whether the council vitest suites pass at the base, because `system-spec-kit/runtime` has no `node_modules` in this worktree |

### Overview
Five edits hold under any writer answer: the gateway-refresh claim, the `max_rounds` default, the depth default, the lens and temperature text and the threshold table. Four wait for the answer: the writer statement, Q11, the round model and the size work, because what leaves the agent depends on who writes. The section move and every citation repoint land in one commit, since removing sections 12 to 17 renumbers 18 and 19. Mirrors, rosters, the compiled contract and the trigger index are regenerated last, from the final tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Every owned finding is reproduced or partly reproduced by a command at `c1dbb1bcc4`, saved in `scratch/measured-behavior.txt`
- [x] The operator's writer answer is recorded in `spec.md` section 10: A, the agent, 2026-11-14
- [ ] Phases 6 and 8 have landed, and `bash scratch/measure.sh` has been re-run against the new base

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 holds, checked by its acceptance command
- [ ] `wc -l < .skilled/agents/ai-council.md` prints 600 or less, and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract alignment across one agent, its registry record and its mode skill. No runtime code changes.

### Key Components
- **`.skilled/agents/ai-council.md`**: the canonical agent. Its `.claude` copy is a hand fork. The pi, codex and dsh copies are generated.
- **`.skilled/agents/agent-registry.json`**: its `ai-council` notes feed the generated roster blocks in `orchestrate.md` and `README.txt`. Its `templateExceptions` reason explains why HOOK-INJECTED CONTEXT ROUTING sits late.
- **`deep-ai-council` references and playbook**: they receive sections 12 to 17 and cite agent sections by number.
- **`persist-artifacts.cjs` and `orchestrate-session.cjs`**: unchanged. The helper parses the report's `AI Vantage Target` column (`lib/persist-artifacts.cjs:173`), so that column name stays.

### Data Flow
A caller dispatches `@ai-council` with a prompt. The agent deliberates, writes or returns its artifacts as the named writer rule says, and names the state events. The caller records events, loops rounds and resumes. `/deep:ai-council` runs its own seats through `orchestrate-session.cjs` and does not dispatch the agent.

### Fix Approach per Requirement
- **REQ-001 (ai-council-2)**: after the answer, rewrite line 739 and the rule at line 403 to name the one writer, edit the registry `notes`, run `node .skilled/bin/sync-agent-roster.cjs` to rewrite the generated blocks and hand-edit the `.claude/agents/orchestrate.md` agent-files row. Answer B or C also sets `write` and `edit` to deny, drops Write and Edit from the `.claude` tools line and edits description lines 3, 24 and 30, which say "scoped-write".
- **REQ-002 (ai-council-1)**: rewrite Q11 (line 567) and its fix line (line 570) to the per-answer wording in `spec.md` section 10, and drop "exit 0 receipt" from line 668 or from its new home.
- **REQ-003 (ai-council-1)**: rewrite the nine `refresh` lines to say the caller records events through the gateway and nothing refreshes `ai-council-state.jsonl` for this mode, citing `append-mode-event.ts:255-275`. The text that moves to the references carries the same correction.
- **REQ-004 (ai-council-3)**: replace step 8 at line 678 with "one round per invocation, then return". The caller's loop and resume rule go to `state-format.md`. Resume reads the source the answer names: artifacts on disk under A, a rerun of the round under B or C. Restate what `resume-after-interrupted-state.md` checks.
- **REQ-006 (ai-council-3)**: add "`max_rounds` defaults to 3" beside the config shape, matching `lib/persist-artifacts.cjs:39` and `deep-ai-council-auto.yaml:21`.
- **REQ-007 (ai-council-4)**: line 63 becomes "Otherwise, operate at Depth 1". Line 62 gains the opt-in: dispatch seats only when the prompt states operator invocation. The section 5 decision tree (lines 302-309) asks that question instead of "Am I dispatched by another agent?". `depth-dispatch.md:96` and `:142` change to match. `task: allow` stays, because operator Depth 0 still dispatches, which `agent-template.md:759` allows when delegation is the agent's explicit authority.
- **REQ-008 (ai-council-5)**: the two CLI rows at lines 110-111 become lenses that are simulated unless a caller supplies that system's output. Drop the Temp column at line 148 and in `seat-diversity-patterns.md:51`, delete the seat prompt's Temperature block (lines 243-245) and list each vantage once at line 394.
- **REQ-009 (ai-council-6)**: one table replaces lines 336-338, 343, 347-349, 356 and the matrix at 376-386, in the agent and in `scoring-rubric.md`. The bands keep both stated numbers true and close the gaps: a lead of 25 or more with no critical risk skips critique and adopts the leader. A lead of 15 to 24 requires critique, then adopts the leader. A lead of 10 to 14 requires critique, then adopts the leader and merges complementary elements. A lead under 10 requires critique and merges the top two. All seats under 50 escalate. The rows for contradiction, timeout and simulated vantage stay.
- **REQ-010 (ai-council-7, across-6)**: diff each of sections 12 to 17 against its target reference and carry over only what is missing: 12 to `folder-layout.md`, 13 and 14 to `state-format.md`, 15 to `convergence-signals.md`, 16 to `command-wiring.md` and 17 to `failure-handling.md`. A short pointer paragraph replaces them in the agent. Repoint the seventeen live citation lines: thirteen in nine `deep-ai-council` files and the agent's own §12 and §15 references at lines 403 and 678, with their `.claude` twins. Fix `folder-layout.md:81`, which calls ROLLBACK §18. Read the ADR behind `folder-layout.md:87` before deciding whether it is a section link. Update the registry reason and the runtime-parity test strings. Then cut to 600 or fewer using the budget below.

### Line Budget
Each figure is an estimate from today's line numbers. The build measures each one with `wc -l` and records the real count.

| Change | Lines | Running total |
|--------|-------|---------------|
| Today | | 816 |
| Remove sections 12 to 17 (lines 631-798) | -168 | 648 |
| Pointer paragraph to the references | +4 | 652 |
| Seat prompt Temperature block (REQ-008) | -3 | 649 |
| One threshold table (REQ-009) | about -8 | about 641 |
| Task-type tree at lines 177-213 as a six-row table | about -27 | about 614 |
| Threshold-semantics preamble (lines 38-49) to `convergence-signals.md`, keeping the sentence the parity test asserts at line 83 | about -8 | about 606 |
| Section 10 FAILURE HANDLING shrunk in place to its rules and a pointer, keeping its heading so section 11 keeps its number | about -20 | about 586 |
| Persistence text in sections 7 and 9 per answer | about -4 (A) or -12 (B, C) | about 582 or 574 |
| Phase 6 additions | measured | measured |
| Fallback if still over: the section 8 report template moves into `output-schema.md` | about -60 | measured |

Sections 0 to 11 keep their headings and numbers, so the citations of sections 3, 6, 8, 10 and 11 stay valid. Only HOOK-INJECTED CONTEXT ROUTING and RELATED RESOURCES renumber, to 12 and 13. No live file cites them by number.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/agents/ai-council.md` | Producer of every claim the findings name | update | the `spec.md` section 4 commands |
| `.claude/agents/ai-council.md` | Hand fork, offset about 15 lines | update by content | `check-agent-mirror-sync.cjs` exits 0 |
| `.pi/agents/ai-council.md`, `.codex/agents/ai-council.toml`, `.dsh/agents/ai-council.patch.yml` | Generated copies | regenerate | the three sync scripts, then the mirror check |
| `.skilled/agents/agent-registry.json` (`ai-council` notes, `templateExceptions` reason) | Producer of the roster rows and the section-order exception | update | `sync-agent-roster.cjs --check` prints `agent-roster: OK` |
| `.skilled/agents/orchestrate.md`, `.skilled/agents/README.txt` generated blocks | Consumers of the registry notes and summary | regenerate | `sync-agent-roster.cjs --check` |
| `.claude/agents/orchestrate.md:164` | Hand copy of the generated agent-files row | update | mirror check exits 0 |
| `deep-ai-council/references/structure/folder-layout.md`, `state-format.md`, `output-schema.md` | Receivers of sections 12 to 14, and citers | update | REQ-010 search |
| `deep-ai-council/references/convergence/convergence-signals.md`, `failure-handling.md`, `depth-dispatch.md` | Receivers of sections 15 and 17, citers, and a same-class depth default | update | REQ-007 and REQ-010 searches |
| `deep-ai-council/references/patterns/command-wiring.md`, `seat-diversity-patterns.md` | Receiver of section 16, citer, and a same-class Temp column | update | REQ-008 and REQ-010 searches |
| `deep-ai-council/references/scoring/scoring-rubric.md` | Same-class copy of the threshold gaps | update | REQ-009 search |
| `deep-ai-council/manual-testing-playbook/.../resume-after-interrupted-state.md`, `.../out-of-scope-write-rejection.md` | Scenarios that cite sections 13 and 16 and test the resume rule | update | REQ-010 search and a read of each scenario's pass line |
| `system-spec-kit/runtime/tests/multi-ai-council-runtime-parity.vitest.ts` | Asserts lines 71-72, 83 and 93-97 against the mirrors | update | council suites print 0 failures |
| `system-spec-kit/runtime/cli/tests/multi-ai-council-mirror-parity.vitest.ts` | Compares numbered headers across the four mirrors | unchanged | council suites print 0 failures |
| `.skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown` | Records a sha256 of the agent and of the references | regenerate | `compile-command-contracts.cjs --command deep/ai-council` diff exits 0 |
| `deep-ai-council/scripts/lib/persist-artifacts.cjs` | Parses the `AI Vantage Target` column at line 173 and writes artifacts | unchanged | `rg -c --include-zero 'AI Vantage Target' .skilled/agents/ai-council.md` stays at 1 or more |
| `deep-ai-council/scripts/orchestrate-session.cjs`, `deep-ai-council-auto.yaml`, `deep-ai-council-confirm.yaml` | The command's own writer and route contract | not a consumer of the agent text | unchanged, and the route mismatch is reported to the operator |
| `system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts` | Source of the no-projection fact | unchanged | lines 255-275 quoted in `spec.md` |
| `.skilled/bin/sync-agent-roster.cjs` required-section check | Reads the agent's numbered headings | unchanged | `--check` prints `agent-roster: OK` |

Required inventories:
- Same-class producers: `rg -n 'refresh' .skilled/agents/ai-council.md`, `rg -n '15 point|25\+|within 10|<10 point' .skilled/skills/system-deep-loop/deep-ai-council`, `rg -n '^\| Strategy \| Temp' .skilled/skills/system-deep-loop/deep-ai-council .skilled/agents`, `rg -n 'fallback when no nesting|operate as Depth 0' .skilled/skills/system-deep-loop/deep-ai-council`.
- Consumers of the moved sections: `rg -n '§1[2-9]' .skilled/agents/ai-council.md .claude/agents/ai-council.md .skilled/skills/system-deep-loop/deep-ai-council -g '!**/changelog/**'` and `rg -n 'COUNCIL PERSISTENCE PROTOCOL|Single writer authority|threshold scores' .skilled/skills/system-spec-kit/runtime`.
- Matrix axes: writer answer (A, B, C) by requirement. `spec.md` section 10 lists the rows.
- Algorithm invariant: N/A. No parser, path or security code changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs `scratch/measure.sh` on the base after phases 6 and 8 land and confirms the writer answer is recorded. Implementation makes the answer-independent edits first, then the writer, Q11 and round-model edits, then the section move with every repoint in one commit, then the cuts. Verification regenerates the copies, rosters, compiled contract and trigger index and runs every acceptance command and the council suites.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The council suites: `multi-ai-council-runtime-parity`, `multi-ai-council-mirror-parity` and the rest of `test:council` | `npm run test:council` in `.skilled/skills/system-spec-kit/runtime` (`package.json:27`). That folder has no `node_modules` here, so installing it waits for the operator's yes |
| Integration | Mirrors, rosters and the compiled contract | `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, `node .skilled/bin/sync-agent-roster.cjs --check`, `node .skilled/bin/check-agent-mirror-sync.cjs`, then `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council --write` and the same command piped to `diff -q -` against the written file |
| Manual | Each requirement's acceptance command in `spec.md` section 4, the line budget and the two playbook scenarios read end to end | `rg`, `wc -l`, `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` |

The baseline for the roster check, the mirror check and the compiled-contract diff is in `scratch/measured-behavior.txt`: `agent-roster: OK`, mirror check exit 0 and diff exit 0. The council suites have no baseline yet. The build runs them before its first edit, once the dependencies exist, and compares after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator writer answer | Internal decision | Green, A recorded 2026-11-14 | None |
| Phase 6 (untrusted-content rule, copied boilerplate) | Internal phase | Yellow | The line budget and quoted line numbers move. Re-measure after it lands |
| Phase 8 (orchestrate edits) | Internal phase | Yellow | The roster regeneration rewrites a block in a file phase 8 edits. Build after it lands |
| `system-spec-kit/runtime` dependencies for vitest | External install | Yellow | The council suites cannot run until they are installed with the operator's yes |
| `node`, `rg`, `perl` | Tools | Green | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a council suite, the roster check, the mirror check or the compiled-contract diff fails on main after the merge, or `/deep:ai-council` or a direct `@ai-council` dispatch can no longer finish a run.
- **Procedure**: revert the phase's commits with `git revert`. The section move and its repoints share one commit, so a revert restores both together. After the revert, run `node .skilled/bin/sync-agent-roster.cjs` and the three sync scripts so the generated copies match the restored files.
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
| Setup | Phases 6 and 8 landed, operator writer answer recorded | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close and phase 10's start on a stable agent roster |
<!-- /ANCHOR:phase-deps -->

---
