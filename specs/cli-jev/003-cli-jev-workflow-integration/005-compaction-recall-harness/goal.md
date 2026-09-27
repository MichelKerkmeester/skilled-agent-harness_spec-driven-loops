---
title: "Goal: Phase 5: compaction-recall-harness"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "compaction recall census goal"
  - "score-compaction-recall completion criteria"
  - "compaction census stop line"
  - "zero-call compaction census"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness"
    last_updated_at: "2026-09-27T07:30:00Z"
    last_updated_by: "orchestrator-session"
    recent_action: "Authored the durable directive"
    next_safe_action: "The operator names 10 to 20 session files, then write the parser and the fit column"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: compaction-recall-harness

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

**Objective:** Measure, with zero Jev calls, what this project's host compactions keep in the stock summary and the recorded brief and whether the vendored staged fit can hold these sessions at all, so that one printed stop line decides whether an offline Jev deletion arm is worth specifying.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | New files only: `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs`, `runtime/tests/compaction-recall.vitest.ts` and `runtime/tests/compaction-recall-fixtures/`, plus one inventory row in `runtime/scripts/README.md`. No hook, setting or transcript changes |
| D2 | This phase builds no Jev arm and has no `jev` spawn path. A later arm is an amendment with its own `--jev` switch, and it waits on the redaction cases, the operator's acceptance of its payload and a latency measured in 002 |
| D3 | The census reads only session files the operator names, and the report holds counts, scores, enum labels, stage names, file basenames, boundary `uuid` values and line numbers, never transcript text. Fixtures are synthetic |
| D4 | The parser is a closed type whitelist that stops a session with a named file, line and reason, counts it and exits 1. Nothing is skipped with only a warning |
| D5 | Boundaries are counted from parsed records with `type` `system`, `subtype` `compact_boundary` and `compactMetadata`, never by substring, and the report prints that method and its scope |
| D6 | The fit column is a port of the vendored `estimateTokens` and `fitState`. Host `preTokens` is never compared with 25,000 |
| D7 | The stop line is `arm not built` when `fit_throws` is at least 0.50, the offline reduction upper bound is below 0.25 or kept tokens exceed 3 times stock `postTokens`, and the census is void when more than half the sessions stop on an unknown shape |

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

- [ ] `npm test -- --run tests/compaction-recall.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, reports 10 passed and exits 0
- [ ] A census run over the 10 to 20 session files the operator named prints a `method:` line, a `scope:` line, one row per boundary and exactly one line starting `stop:`, and its `scope:` boundary total equals an independent count of parsed records with `type` `system` and `subtype` `compact_boundary` over the same files
- [ ] With a stub `jev` first on PATH that logs every invocation, the census run leaves the stub log empty
- [ ] `grep -niE 'api_key|apikey|secret|bearer'` on `score-compaction-recall.mjs` and `compaction-recall.vitest.ts` returns no match
- [ ] `git status --porcelain` lists only `runtime/scripts/compaction-recall/`, `runtime/tests/compaction-recall.vitest.ts`, `runtime/tests/compaction-recall-fixtures/` and `runtime/scripts/README.md` under `.skilled/skills/system-spec-kit/`, and no file in the named transcript directory changes
- [ ] `validate.sh --strict` on `specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness` prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md` and this goal authored from `004-deep-research-expansion/research/research.md` R19, section 4 and proposed phase 005 |
| Session list | Pending | The operator's task (T001) |
| Build | Pending | Nothing is built. The phase is Planned |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title | The scaffold titled every document "Phase 1". This phase is Phase 5 of 6, as this title and the `spec.md` metadata now say |
| Count drift | Parsed records on 2026-09-27: 212 boundaries in 93 main-session files and 14 in 999 subagent files. A substring match gives 270 lines. The research counted 222 and the orchestrator 210 on earlier passes, so D5 pins the method and the report prints it |
| Test placement | The research put the test beside the script. The vitest include glob is `runtime/tests/**` and the scripts README says that folder holds scripts only, so the test and fixtures go under `runtime/tests/` |
| Report narrowed | The research's report printed counts, names and paths. Paths and identifiers come from transcript text, so D3 keeps the report to counts and scores, and the operator's spot read uses basename and line number |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from `spec.md` REQ-001 to REQ-007, its stop line and its proof plan. `recommend-level.sh --loc 730 --files 9` scores Level 1 |
<!-- /ANCHOR:log -->
