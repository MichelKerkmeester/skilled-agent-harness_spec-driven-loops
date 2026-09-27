---
title: "Goal: Phase 2: advisor-jev-tiebreak-arm"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "advisor jev tie-break goal"
  - "score-jev-tiebreak completion criteria"
  - "jev near-tie cluster arm"
  - "jev arm key gate"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm"
    last_updated_at: "2026-09-27T04:46:15Z"
    last_updated_by: "amendment-leaf"
    recent_action: "Amended the directive from the final synthesis, section 13"
    next_safe_action: "Build the advisor dist, then write the zero-call census, comparators and power line"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: advisor-jev-tiebreak-arm

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Measure, offline and by hand, whether a Python `jev-cli` `choice` over the skill advisor's near-tie cluster beats the scorer's order and three zero-call comparators under a keep rule that can fail, through one new script whose default census makes zero Jev calls and prints a power line first, and whose `--jev` arm stays dormant unless all three key checks pass.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Two new files and no other change: `score-jev-tiebreak.mjs` in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` and `tests/parity/score-jev-tiebreak.vitest.ts` under `.skilled/skills/system-skill-advisor/runtime/`. Nothing is served and nothing runs in a hook |
| D2 | The arm needs `--jev`. It prints an identity line with the `jev` path and the provider P, `JEV_PROVIDER` when set and `official` otherwise. Then, in order: `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0. A failure prints `jev arm skipped: jev not on PATH`, `jev arm skipped: version` with a details line or `jev arm skipped: no credential`, leaves the census byte-identical and exits 0 |
| D3 | The script never reads, logs or passes a key and holds no key literal or key variable name. The same `--provider P` goes to check 3, `jev auth test` and every judgment |
| D4 | The census covers the 177 labeled and 64 holdout skill-firing rows under the exact env of `capture-scorer-eval-baseline.mjs:35-46`. Holdout top-1 other than 53/70 voids the run. Zero movable rows prints `no headroom`, 1 to 4 prints `underpowered`, and neither runs the `choice` arm |
| D5 | `keep` needs an exact one-sided sign test at 0.05 over decided rows, a win over each comparator, no fall in right@3 and an aggregate flip rate of at most 0.10. `kill` means the sign test favors the scorer. Gold demotions are losses, and only `kill` closes the served advisor forms |
| D6 | A row is decided only when all 3 reruns return a submitted key, and no path writes a default score or verdict. Exit 3 after the gate stops the arm with `jev arm stopped: key rejected`, and a spawn past 90 s is `unmeasured_timeout` |
| D7 | The Gate 3 calibration runs only when the census prints `underpowered`, under the same switch and gate, in place of the `choice` arm |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `score-jev-tiebreak.mjs` exists in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`, and a run without `--jev` prints eligible, movable, gold-first, gold-outside and top-3 counts for the 177 labeled and 64 holdout skill-firing rows, holdout top-1 `53/70`, MRR, right@1 and right@3 for the scorer, confidence order, always-second and the outcome-weighted rerank, and a power line, then exits 0 while a stub `jev` first on PATH logs zero invocations
- [ ] With `--jev`, a line naming the `jev` path and the provider prints first, a stub whose `jev auth status --provider <that provider>` exits 3 makes the script print `jev arm skipped: no credential`, and a stub whose version line is not `jev 0.6.2` makes it print `jev arm skipped: version`. Each run exits 0 with census output identical to the default run, and the stub log shows no `auth test`, `choice` or `noul` call
- [ ] `grep -nE 'API_KEY|TYPESAFE'` on `score-jev-tiebreak.mjs` returns no match, and in a stub run that passes the gate every logged `auth status`, `auth test` and judgment call carries the same `--provider` value
- [ ] `tests/parity/score-jev-tiebreak.vitest.ts` under `.skilled/skills/system-skill-advisor/runtime/` exits 0 with cases where a row missing one of 3 rerun answers stays out of the sign test, a stub exit 3 after the gate prints `jev arm stopped: key rejected`, and a stub that hangs past 90 s marks its row `unmeasured_timeout`
- [ ] One keyed `--jev` run either prints `no headroom` and makes no call, or writes a `calls.jsonl` in which every line has a wall time, exit code, provider, model and status and prints one of two results: `underpowered` with accuracy, F1, Brier score and flip rate beside 0.9843, or wins, losses, ties, abstentions, unmeasured rows, the exact p, the aggregate flip rate, latency p50 and p95 and one verdict line of `keep`, `kill`, `inconclusive` or `underpowered`
- [ ] `git status --porcelain` lists no changed path other than `score-jev-tiebreak.mjs` and `score-jev-tiebreak.vitest.ts`
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and this goal authored from `001-deep-research/research/research.md` R1 and its proposed phase 002 |
| Amendment | Done | 2026-09-27, from the final synthesis `004-deep-research-expansion/research/research.md` section 13 (`### 002-advisor-jev-tiebreak-arm`), with its R1 and R21 records and What Not To Build rows 47, 52 to 54 and 66 to 68 |
| Build | Pending | Nothing is built. The phase is Planned |

### Amendment 2026-09-27

Source: the final synthesis, section 13. One line per changed requirement. IDs were kept and new ones added.

| ID | Change |
|----|--------|
| REQ-002 | Identity line before check 1, `jev arm skipped: version` plus a details line replaces `jev arm refused: expected jev 0.6.2`, and check 3 becomes `jev auth status --provider P` (C8, approved through the parent's amended D5) |
| REQ-003 | No key literal or key variable name, grep widened to `API_KEY\|TYPESAFE`, and one `--provider P` on check 3, `auth test` and every judgment |
| REQ-004 | Census over all 177 plus 64 skill-firing rows, alias-aware, with gold-first, gold-outside and top-3 columns, the power line before any billed call and `underpowered` at 1 to 4 movable rows (C3) |
| REQ-005 | The env is `capture-scorer-eval-baseline.mjs:35-46` exactly, adding `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL`, `PYTHONDONTWRITEBYTECODE`, `VITEST` and the three lane deletes (C6) |
| REQ-006 | The vitest file joins the allowed changed paths |
| REQ-007 | Four-outcome rule over decided rows, gold-first rows included, movable wins and gold demotions printed apart, rerank comparator on held-out rows only (C2). Replaces the MRR-and-right@3 keep |
| REQ-008 | Aggregate flip rate of at most 0.10 replaces the 0.95 stability coefficient, and three different picks make a row `unstable` (C1) |
| REQ-009 | Adds pick and `none` probabilities, the `unmeasured_timeout` status, a provider-scoped `auth test` and p50 and p95 |
| REQ-010 | Decided only when all 3 reruns answer (C4), 90 s spawn cap (C7), `none` counted on gold-in-cluster rows (C5), `jev arm stopped: key rejected` on exit 3 after the gate |
| REQ-011 | Adds estimated input tokens and drops every dollar figure, including the risk table's (C9) |
| REQ-012 | The tau 0.03 split is reported without a veto |
| REQ-013 | New: the three zero-call comparators, confidence order, always-second and the held-out rerank |
| REQ-014 | New: research R21, the Gate 3 calibration, as a conditional arm |
| Other | Cost ceiling 723 judgments plus 1 `auth test`, not 456. Size 330 to 530 LOC plus about 50, not 150 to 200. Only `kill` closes the served forms. The stdin edge case now says an inherited terminal exits 2 |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 has no `acceptance-criteria.md` | The criteria above come from the `spec.md` requirements REQ-001 to REQ-014 and its proof plan |
| Scaffold title | The scaffold titled every document "Phase 1". This phase is Phase 2, now of 6, as this title and the `spec.md` metadata say |
| Criteria in the objective | The objective stays one sentence. The criteria reach the evaluator verbatim through the chat slice, which carries section 3 unchanged |
| Vitest file location | The synthesis puts the test file beside the script. The advisor's `vitest.config.ts` includes only `tests/**/*.vitest.ts`, so a file there would never run. It goes to `tests/parity/`, where `capture-ledger-workspace-root.vitest.ts` already tests a routing-accuracy script |
| Calibration trigger | The synthesis triggers R21 on `underpowered` only, while its value line promises a latency number even with no headroom. The phase follows the trigger as written and lists the question in `spec.md` section 7 |
| Criteria count | Six became seven: the vitest criterion carries the missing-answer, key-rejected and hang cases that the old exit criterion lacked |
<!-- /ANCHOR:log -->
