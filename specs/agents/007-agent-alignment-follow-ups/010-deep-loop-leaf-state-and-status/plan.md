---
title: "Implementation Plan: Phase 10: deep-loop-leaf-state-and-status"
description: "Edit the text of the two deep-loop leaf agents so their status rule, state record, bindings, write set and verdict row match the gateway, the reducer and the workflow, then regenerate the runtime copies and recompile the two contracts that pin each agent's digest."
trigger_phrases:
  - "deep loop leaf state and status plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: deep-loop-leaf-state-and-status

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions and their generated runtime copies (Markdown, TOML and YAML) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Two contract parity suites, the fan-out prompt suite, the contract drift check, the roster check and the mirror check |

The four step-5 `@context` explorers ran inline, as the workflow's own fallback ("Use inline planning activities"), because a leaf worker cannot dispatch agents. The architecture, feature, dependency and test reads they would have made are the `rg` and `sed` reads recorded in `scratch/measured.txt` and in the affected-surfaces table below.

No runtime code changes. The gateway already stamps the event time, so deep-research-4 needs a text change only. Phase 006 edits both agent files before this phase, which is why every edit below is found by quoted text and not by line number.

### Overview
Nine requirements touch two agent files. The research edits come first, because REQ-004 deletes blocks that REQ-001 would otherwise have to edit twice. The review edits follow, in file order. The `.claude` forks are hand-edited to match, the three sync scripts rewrite the other copies, and the two compiled contracts are rebuilt last, because each pins a sha256 of its agent file.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006 is merged into this branch, or the operator says this phase may go first
- [ ] Phase 1 of `tasks.md` re-ran the measured commands by quoted text, and each owned finding still reproduces
- [ ] The operator has answered the identity-field question in `spec.md` section 7

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 holds
- [ ] The two parity suites print `Tests  19 passed (19)` and the fan-out suite prints `Tests  8 passed (8)`
- [ ] `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=1` for both commands
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Text alignment of two leaf contracts. No new file, module or option.

### Key Components
- **`.skilled/agents/deep-research.md`**: the research leaf. It picks the iteration status, builds the record it hands to the gateway and states its write set.
- **`.skilled/agents/deep-review.md`**: the review leaf. It emits the setup bindings, builds its record and ends each iteration file with a verdict line.
- **The compiled contracts**: `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` and `deep-review.contract.markdown` list each agent file with its sha256, so an agent edit without a rebuild fails the drift check.

### Data Flow
The workflow renders a prompt pack and dispatches one leaf. The leaf writes its iteration file and delta, then hands one record to `append-mode-event.cjs`. The gateway stamps the event time, appends to the ledger and rewrites the state log projection. The reducer reads the projection and the deltas. The workflow's verdict step reads the findings. The agent text is the leaf's only source for what goes into that record.

### Fix Approach per Requirement
- **REQ-001** (deep-research-2): in Step 5, the `Tier 3+ escalation` bullet becomes "if Tier 1-2 recovery fails, write the failure in the iteration file and report `timeout` when some evidence was gathered or `stuck` when none was. The orchestrator handles higher tiers." This matches the Step 4 status rules and the ESCALATE rule. `error` stays reserved for state, control-file and write failures.
- **REQ-002** (deep-research-3): in Step 7, item 2 becomes "Record the iteration through the append gateway (Step 8)." The new wording avoids the two phrases the fan-out suite forbids.
- **REQ-003** (deep-research-4): in Step 8, `"timestamp":"ISO-8601","durationMs":NNNNN,` leaves the record example and one sentence follows it: "The gateway stamps the event time, which the projection writes back as `timestamp`, so the record carries no timing field." In Step 11, the field list ends at `sourcesQueried`. If the operator says yes to the identity question, the same example gains `"runId"`, `"sessionId"` and `"lineageId"`, each set to `config.lineage.sessionId`.
- **REQ-004** (deep-research-5): delete the `## Convergence Threshold Semantics` block (the research skill holds the same text at `SKILL.md:72-76`), the `### Error-Aware Execution` block in section 4 (Step 5 keeps the one copy of the tiers) and the `### Write Safety` block in section 5 (section 0 and Step 8 already state each rule it lists). The File Paths table stays as the one write table. Step 2 stays, because it is an action. Step 11 and the section 8 checklist stay for phase 006.
- **REQ-005** (deep-review-2): the binding paragraph opens "After Step 2 reads the config and BEFORE any review action". The binding list and its order do not change.
- **REQ-006** (deep-review-3): the permission line lists the iteration artifact, the strategy file and the write-once `review/deltas/iter-NNN.jsonl`, and says the state record goes through the append gateway, never into `review/deep-review-state.jsonl` directly. It stays one line.
- **REQ-007** (deep-review-4): the FAIL cell becomes "Active `P0` exists. Whether a failed binary gate also forces FAIL is the rule of the session verdict the workflow derives at synthesis". It names no gate rule of its own, so it does not choose between the mode contract and the workflow (open question 2). The final-line mapping keeps its P0-only rule, because the Coverage gate cannot pass before STOP.
- **REQ-008** (deep-review-5): `noveltyJustification` joins the Step 9 required list after `newFindingsRatio`.
- **REQ-009** (deep-review-5): the four `new`, `resume`, `restart` and `Deferred` bullets become one bullet: "The workflow owns the lifecycle branches (`new`, `resume`, `restart`, with `fork` and `completed-continue` deferred) and writes their events. This leaf copies `sessionId`, `generation` and `lineageMode` from config into its record." The `stop_policy=max-iterations` bullet is deleted, because the fan-out runner puts that rule in the lineage prompt itself.
- **REQ-010**: the mirror routine and the contract rebuild in `tasks.md` Phase 3.

### Affected Surfaces

| Surface | Role | Evidence |
|---------|------|----------|
| `deep-research-ledger-types.ts:180` | Accepts the six research statuses | `'complete' \| 'error' \| 'insight' \| 'stuck' \| 'thought' \| 'timeout'` |
| `deep-research-auto.yaml:2309`, `:2635` | Reads status: stuck count, and a halt after 3 consecutive errors | `scratch/measured.txt` |
| `append-mode-event.cjs:332`, `legacy-compatibility.ts:805-812` | Stamp the event time, or keep a leaf UTC `timestamp` | `occurredAt: meta.occurredAt \|\| meta.occurred_at \|\| nowIso` |
| `deep-research-contract.ts:293-306` | Projects the research row, with `timestamp` and without `durationMs` | `scratch/measured.txt` |
| `legacy-compatibility.ts:290-293`, `:346-353` | Refuse a research record with no session identity | Open question 1 |
| `deep-research/assets/prompt-pack-iteration.md.tmpl:63-66` | Tells a CLI leaf the record shape | Requires `runId`, `sessionId`, `lineageId` |
| `deep-research-auto.yaml:1960`, `deep-review-auto.yaml:2108` | Assert record fields after dispatch | Research asserts no timing field, review asserts both |
| `post-dispatch-validate.ts:273-291` | Requires the review fields, `timestamp` and `durationMs` included | Not changed here |
| `deep-review/assets/prompt-pack-iteration.md.tmpl:16-18` | Carries `max_iterations` and the dimension, no threshold | `scratch/measured.txt` |
| `deep-review/SKILL.md:239`, `agent-template.md:281` | State the binding rule | Open question 3 |
| `review-mode-contract.yaml:103-105`, `deep-review-auto.yaml:2402-2408` | Two verdict rules, one with gates, one P0-only | Open question 2 |
| `deep-review-auto.yaml:599-602`, `fanout-run.cjs:1742-1743` | Own the restart event and the `maxIterationsReached` rule | `scratch/measured.txt` |
| `deep-review-contract-parity.vitest.ts:63-73`, `deep-research-contract-parity.vitest.ts:59-72` | Read `completed-continue`, `lineageMode`, `releaseReadinessState`, `workflow reducer` and `local-owner ... packet` from the agents | Must stay green |
| `fanout-loop-prompt-in-process.test.ts:147` | Embeds the persona and forbids "state record ... directly" and "append the state record" | Must stay green |
| `compile-command-contracts.cjs:181`, `:283` | Pins each agent's sha256 in its compiled contract | Rebuild after the edit |
| `.claude/agents/`, `.pi/agents/`, `.codex/agents/`, `.dsh/agents/` | Runtime copies of both agents | Mirror routine |
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the measured commands by quoted text after phase 006 lands and confirms each finding still reproduces. Implementation edits `deep-research.md` for REQ-001 to REQ-004 and `deep-review.md` for REQ-005 to REQ-009. Verification hand-edits the `.claude` forks, runs the sync scripts, rebuilds both contracts, runs the three suites and the four checks and validates this folder.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each requirement's acceptance command in `spec.md` runs after its edit. Then, from the repository root unless a `cd` is shown:
- `cd .skilled/skills/system-spec-kit/runtime/cli && npx --no-install vitest run --config ../../vitest.config.ts --project cli tests/deep-review-contract-parity.vitest.ts tests/deep-research-contract-parity.vitest.ts` prints `Tests  19 passed (19)`, the same as at this base.
- `cd .skilled/skills/system-deep-loop/runtime && node_modules/.bin/vitest run --config vitest.config.ts tests/fanout-loop-prompt-in-process.test.ts` prints `Tests  8 passed (8)`, the same as at this base.
- `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs --command deep/research` and `--command deep/review` each print `[CONTRACT DRIFT] OK commands=1`.
- `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`, and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0.
- `wc -l .skilled/agents/deep-research.md .skilled/agents/deep-review.md` prints 600 or less for each.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 006 goes first, because it edits the budget lines and the pre-delivery checklists in the same two files. Tools: `node`, `rg`, `sed` and the vitest binaries already installed under `system-spec-kit` and `system-deep-loop/runtime`. No new package. The mirror routine needs these scripts, each checked present at this base: `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, `.skilled/bin/sync-agent-roster.cjs` and `.skilled/bin/check-agent-mirror-sync.cjs`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a deep-research or deep-review run after the merge refuses the leaf's record, halts on a status the leaf now reports or a suite in section 5 fails on main. Revert the phase's commit with `git revert`. The agent files, their runtime copies and the two compiled contracts move in one commit, because the commit gate blocks an unstaged mirror and the drift check blocks a stale digest.
<!-- /ANCHOR:rollback -->

---
