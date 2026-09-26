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
    last_updated_at: "2026-09-26T20:40:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "Build the advisor dist, then write the zero-call census and baseline column"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm/spec.md"
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

**Objective:** Measure, offline and by hand, whether a Python `jev-cli` `choice` over the skill advisor's near-tie cluster beats the scorer's own order on held-out MRR and right@3, through one new script whose default run makes zero Jev calls and whose `--jev` arm stays dormant unless a Jev key resolves.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One new file, `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs`. No existing file changes, nothing is served and nothing runs in a hook |
| D2 | Before any call, in order: `command -v jev`; `jev --version` prints `jev 0.6.2`, and the npm `jevctl` that also installs `jev` is refused; `jev auth status` exits 0; and `--jev` is set. The default run is the census plus the baseline column with zero calls, and `--jev` with no key prints `jev arm skipped: no credential` |
| D3 | The script never reads, logs or passes a key, and no key literal goes on a command line. `jev` resolves its own credential from its store or an exported `TYPESAFE_API_KEY` |
| D4 | `auth status` checks presence, not validity, so a bad key surfaces as exit 3 on the first billed call; the arm then stops and reports finished rows as partial. Exit 4 gets one retry, exit 1, exit 2 and a malformed answer mark the row unmeasured, exit 2 also stops the arm, `none` is an abstention, and no path writes a default score |
| D5 | Keep only if held-out Jev MRR rises, right@3 does not fall, stability over 3 passes with no answer cache is at least 0.95 and the gain does not come from the tau 0.03 slice alone |
| D6 | The script reads the corpus and the built `dist` only, and never writes `scorer-eval-baseline.json`, the corpus files or the ratchet |

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

- [ ] `score-jev-tiebreak.mjs` exists in `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/`, and a run without `--jev` prints eligible and movable row counts for the held-out half and the holdout file, prints holdout top-1 `53/70` and exits 0, while a stub `jev` first on PATH logs zero invocations
- [ ] With `--jev`, a stub whose `jev auth status` exits 3 makes the script print `jev arm skipped: no credential`, and a stub whose `jev --version` is not `jev 0.6.2` makes it print `jev arm refused: expected jev 0.6.2`; in both cases the stub log shows no `auth test` and no `choice` call
- [ ] `grep -n API_KEY` on `score-jev-tiebreak.mjs` returns no match
- [ ] One keyed `--jev` run either prints `no headroom`, or writes a report with MRR, right@1 and right@3 for the scorer column and the Jev column on identical held-out rows, the unmeasured-row count, a `keep` verdict and a stability coefficient over 3 passes, and a `calls.jsonl` in which every line has a wall time, exit code, `jev` version and model
- [ ] `git status --porcelain` lists no changed path other than `score-jev-tiebreak.mjs`
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
| Build | Pending | Nothing is built. The phase is Planned |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1 has no `acceptance-criteria.md` | The criteria above come from the `spec.md` requirements REQ-001 to REQ-007 and its proof plan |
| Scaffold title | The scaffold titled every document "Phase 1". This phase is Phase 2 of 3, as this title and the `spec.md` metadata now say |
| Criteria in the objective | The objective stays one sentence. The criteria reach the evaluator verbatim through the chat slice, which carries section 3 unchanged |
<!-- /ANCHOR:log -->
