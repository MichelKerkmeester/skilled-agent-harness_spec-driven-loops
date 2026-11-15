---
title: "Implementation Plan: Phase 7: code-agent-retry-and-status"
description: "Rewrite the retry, status and escalation text of the code agent so each rule is stated once, keep the section numbers other files cite and carry the edit through the registry note, two orchestrator lines and every runtime copy."
trigger_phrases:
  - "code agent retry and status plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: code-agent-retry-and-status

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions, one JSON registry, generated TOML and YAML runtime copies |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` counts on the agent file, the roster and mirror checks and `node --test` on the review dispatch contract test |

The four step 5 explorers of `/speckit:plan` (architecture, feature, dependency and test) ran inline as the workflow's own fallback, "Use inline planning activities", because a leaf worker cannot dispatch agents. Their ground was covered with `rg`, `sed` and `Read` over `.skilled/agents/`, the agent registry, the runtime agent folders, `.skilled/commands/speckit/assets/` and the test folders. The findings are in the affected-surfaces table below.

No unknown needs `/deep:research`. One input is open: phase 6's self-score rule, which REQ-007 applies.

### Overview
Five findings, one file, four groups. The status definitions and the retry rule come first, because the escalation triggers, the rules list and the confidence table all point at them. The `UNKNOWN_ROUTE` rename is a four-line substitution. The dispatch gate change reaches the registry note and two orchestrator lines, so it runs the roster generator. Sections 6 and 8 are cut last, so the cut does not delete a line an earlier group still needs to edit. Every group is proven by an `rg` count, then the roster, mirror and contract checks run once on the final tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each Measured Behavior command in `spec.md` reruns at the build's base and prints the same output, or the drift is recorded before any edit
- [ ] Phase 6 has shipped its self-score rule, or REQ-007 is marked as waiting on it
- [ ] The roster check, the mirror check and the contract test are saved as the baseline in `scratch/baseline.txt`

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 holds, each shown by its acceptance command
- [ ] `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and the contract test prints `pass 5` and `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single agent contract edit with mirror regeneration. No runtime code changes.

### Key Components
- **`.skilled/agents/code.md`**: the canonical agent. Every rule this phase changes lives here.
- **`.skilled/agents/agent-registry.json`**: the source of the generated roster row in `orchestrate.md`. Its `code` note names the gate this phase removes.
- **The runtime copies**: `.claude/agents/code.md` is a hand-kept fork that `.cursor` and `.devin` link to. The Pi, Codex and harness copies come from sync scripts.

### Fix Approach per Requirement

| REQ | Finding | Approach |
|-----|---------|----------|
| REQ-001 | code-1 | Step 6 keeps fail-closed and drops "NO internal retry. NO loop-fix." for: after a failed verification, make one targeted in-scope fix, rerun the same command once and, if it still fails, return `FAIL` with `VERIFY_FAIL` and the first failing assertion. Step 5 calls the runner's verdict "a `BLOCKED` gate verdict" so it does not read as the return status, and applies the same one-fix rule. The escalate list at line 426 says "after one targeted in-scope fix". The P1 row at 213 and the checklist line at 250 already agree and stay |
| REQ-002 | code-2 | Section 8 opens with a three-row status table. `PASS`: the quality gate and the verification command pass, and no P0 or unapproved P1 is open. `FAIL`: a check the agent ran still fails after the one fix, the first finding is in the RETURN, and a re-dispatch with that evidence can succeed. `BLOCKED`: the agent needs an input only the caller can give (`UNKNOWN_STACK`, `SCOPE_CONFLICT`, `LOW_CONFIDENCE`, `LOGIC_SYNC`). The escalation triggers in section 9 split into one `FAIL` line and the `BLOCKED` list. The circuit breaker counts `BLOCKED` and leaves `FAIL` to the orchestrator's retry ladder. The `LOW` confidence row says `FAIL` for a failed command and `BLOCKED` for missing input |
| REQ-003 | all | The mirror routine in section 7 of this plan, then the roster and mirror checks and a line count |
| REQ-004 | code-3 | Replace `UNKNOWN_ROUTE` with `UNKNOWN_STACK` at lines 67, 89, 130 and 138. `UNKNOWN_STACK` is kept because the return enum, the envelope map at 383 and `agent-io-contract.md:99` already use it |
| REQ-005 | code-4 | Lines 28 to 39 become one caller note: `@orchestrate` dispatches with a `Depth: 1` line, an operator may invoke the agent directly. With no orchestrator brief the agent states the packet and the frozen scope in its RETURN Summary. No HALT and no refusal string. The registry note drops "(`Depth: 1` marker required)", `sync-agent-roster.cjs` rewrites `orchestrate.md:180`, and lines 536 of `code.md` and 901 of `orchestrate.md` drop "halts without" and "gated by" |
| REQ-006 | code-6 | Section 6 keeps the line 187 rule that any P0 blocks completion and an unapproved P1 blocks it, plus the severity table. It loses the scoring dimensions, quality bands and dimension rubrics. Section 8 loses the gate types and the gate result format and keeps its heading for the status table and the circuit breaker, so sections 9 to 13 keep their numbers |
| REQ-007 | code-6 | Apply phase 6's self-score rule to the `Rubric Score` field (line 339), its `rubric_score` entry (359), "Score using §6 rubric" (409) and the rubric clauses of the confidence rows (464 to 466). If phase 6 removes self-scores, these go. If it keeps one source, they point at it |

### Affected Surfaces

| Surface | Role | What reads or writes the changed text | Action |
|---------|------|----------------------------------------|--------|
| `.skilled/agents/code.md` | Producer | Every rule changed here | Edit |
| `.skilled/agents/orchestrate.md:567` | Consumer | Cites "`code.md` §9" for the Quality Gate field | None. Section 9 keeps its number |
| `.skilled/agents/orchestrate.md:571` | Consumer | Reads the runner's `BLOCKED` gate verdict and re-dispatches @code to fix it | None. The verdict keeps its name, and the re-dispatch is the `FAIL` retry |
| `.skilled/agents/orchestrate.md:297` and `agent-io-contract.md:139` | Consumer | A diagnosis handoff with missing fields returns `BLOCKED` with low confidence | None. That stays `BLOCKED` with `LOW_CONFIDENCE` |
| `.skilled/agents/orchestrate.md:643` to `666` | Consumer | The retry ladder and the circuit breaker count failures | Phase 8. It counts the statuses defined here |
| `.skilled/agents/orchestrate.md:180` and `901` | Consumer | Describe the `Depth: 1` gate | Regenerate 180 from the registry, edit 901 |
| `.skilled/agents/agent-registry.json:107` | Producer of the roster row | The `code` note | Edit |
| `.skilled/skills/system-spec-kit/references/workflows/agent-io-contract.md:99` | Consumer | The envelope enum names `unknown_stack` and `verify_fail` and `fail` and `blocked` | None. No name changes |
| `.opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs:71` | Test | Pins the `**Quality Gate:**` line of the RETURN body | None. The line stays. The test reruns |
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Consumer | Routes component authoring away from `@code`, reads no `@code` status | None |
| `.claude/agents/code.md` (with `.cursor` and `.devin` links), `.pi`, `.codex`, `.dsh` copies | Mirrors | Copies of `code.md` and of the two `orchestrate.md` lines | Hand-edit the Claude forks, regenerate the rest |

### Data Flow
`@orchestrate` dispatches `@code` with a `Depth: 1` line. `@code` runs the quality gate and the verification command, makes at most one fix per failed check and returns one status. `@orchestrate` reads the first `RETURN:` line, retries a `FAIL` with the failing evidence and counts `BLOCKED` toward its breaker. That counting is phase 8's.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reruns the Measured Behavior commands and saves the baseline. Implementation edits `code.md` in the order of the overview, then the registry note, the orchestrator line and the runtime copies. Verification runs every acceptance command in `spec.md` section 4, the roster, mirror and contract checks, and strict validation of this folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each requirement is closed by the command in its acceptance line. The checks that cover the whole change run once on the final tree:

```bash
node .skilled/bin/sync-agent-roster.cjs --check
node .skilled/bin/check-agent-mirror-sync.cjs; echo "exit=$?"
node --test .opencode/plugins/tests/speckit-review-dispatch-contract.test.cjs
wc -l .skilled/agents/code.md .claude/agents/code.md
rg -c 'UNKNOWN_ROUTE|NO internal retry|Quality Bands|Code Gate Validation|REFUSE: @code' .skilled/agents/code.md .claude/agents/code.md .pi/agents/code.md .codex/agents/code.toml .dsh/agents/code.patch.yml
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/007-code-agent-retry-and-status --strict
```

The roster check must print `agent-roster: OK`. The mirror check must exit 0 and end with `OK`. The contract test must print `pass 5` and `fail 0`. Both code files must be at or below 600 lines. The `rg -c` line must print nothing and exit 1. The validator must print `RESULT: PASSED`. Each result is compared with `scratch/baseline.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` and `rg`. No new package.

| Phase | Direction | What crosses |
|-------|-----------|--------------|
| `006-shared-agent-contract` | This phase depends on it | The shared tool-budget rule (finding code-5 stays there) and the shared self-score rule REQ-007 applies |
| `008-orchestrate-routing-and-retry` | It depends on this phase | Its retry ladder and circuit breaker count the `FAIL` and `BLOCKED` returns defined in `code.md` section 8. It starts from this phase's `orchestrate.md` lines 180 and 901 |

The mirror routine every agent edit needs, with each script path confirmed to exist at `c1dbb1bcc4`:

1. Hand-edit `.claude/agents/code.md` and `.claude/agents/orchestrate.md` to match. The Claude fork keeps its own frontmatter and its `.claude/agents/` path convention.
2. `node .skilled/bin/sync-agent-roster.cjs` to rewrite the generated roster blocks from the registry.
3. `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`
4. `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`
5. `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`
6. `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs`

The commit gate blocks a commit with an unstaged mirror, so every regenerated copy is staged with its source.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the roster, mirror or contract check fails after the merge, or phase 8 finds a status definition it cannot count. Revert the phase's commit with `git revert`. The agent file, the registry note, the orchestrator lines and every regenerated copy ship in one commit, so one revert restores all of them together and leaves no mirror out of step.
<!-- /ANCHOR:rollback -->

---
