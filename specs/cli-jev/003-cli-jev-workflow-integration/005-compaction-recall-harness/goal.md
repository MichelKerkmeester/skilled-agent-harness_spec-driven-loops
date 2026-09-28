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
    last_updated_at: "2026-09-28T10:00:00Z"
    last_updated_by: "spec-pass-leaf"
    recent_action: "Applied the wave 3 directive: parent D4 session source, D5 build route and D6 skill docs"
    next_safe_action: "Build per parent D5: parser, selection and fit column first, as plan.md section 4 orders them"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Session source: this project's 15 newest compacted transcripts (parent D4, 2026-09-28)"
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

**Objective:** Measure, with zero model calls, what this project's host compactions keep in the stock summary and the recorded brief and whether the vendored staged fit can hold these sessions at all, so that one printed stop line decides whether an offline deletion arm on either backend is worth specifying.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | New code files only: `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs`, `runtime/tests/compaction-recall.vitest.ts` and `runtime/tests/compaction-recall-fixtures/`. Docs: one inventory row in `runtime/scripts/README.md`, plus system-spec-kit's `SKILL.md`, `README.md`, changelog, feature catalog and playbook through sk-doc. No hook, setting or transcript changes |
| D2 | This phase builds no model arm and has no `jev` or `cli-deem` (proposed) spawn path. A later arm is an amendment with its own `--deem` and `--jev` switches (proposed), each gated by its own check, and it prefers Deem when both pass. A Jev arm waits on the redaction cases, the operator's acceptance of its payload and a latency measured in 002. A Deem arm waits on batches of at most 32 tool calls and one timed call at fitted-state size, and needs no redaction or payload acceptance |
| D3 | The census reads only the operator's source: this project's 15 newest compacted main-session transcripts in `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/`, picked by `--newest-compacted 15` (proposed). It never defaults to a directory. The report holds counts, scores, enum labels, stage names, file basenames, boundary `uuid` values and line numbers, never transcript text. Fixtures are synthetic |
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

- [ ] `npm test -- --run tests/compaction-recall.vitest.ts`, run from `.skilled/skills/system-spec-kit/runtime`, reports 12 passed and exits 0
- [ ] A census run with `--newest-compacted 15` over this project's transcript directory prints a `method:` line, a `scope:` line, a `selection:` line, one row per boundary and exactly one line starting `stop:`, and its `scope:` boundary total equals an independent count of parsed records with `type` `system` and `subtype` `compact_boundary` over the same files
- [ ] With stub `jev` and `cli-deem` binaries first on PATH that log every invocation, the census run leaves both stub logs empty
- [ ] `grep -niE 'api_key|apikey|secret|bearer'` on `score-compaction-recall.mjs` and `compaction-recall.vitest.ts` returns no match
- [ ] `git status --porcelain` lists only `runtime/scripts/compaction-recall/`, `runtime/tests/compaction-recall.vitest.ts`, `runtime/tests/compaction-recall-fixtures/`, `runtime/scripts/README.md`, `SKILL.md`, `README.md`, `changelog/`, `feature-catalog/` and `manual-testing-playbook/` under `.skilled/skills/system-spec-kit/`, and no file in the named transcript directory changes
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
| Two-backend amendment | Done 2026-09-27 | Amended for two backends per 007 `research.md` section 14 (`### 005-compaction-recall-harness`), R19 and C9, and parent goal D1 and D5. All eight rows of the section 14 table applied to `spec.md`, then carried into `plan.md`, `tasks.md`, `implementation-summary.md` and this goal. No requirement id added |
| Session source | Done 2026-09-28 | Parent D4: this project's 15 newest compacted transcripts. T001 ticked. `spec.md` section 3, Session Source, names the directory and the selection rule |
| Wave 3 spec pass | Done 2026-09-28 | The amendment rows below, each with its source. Strict validate and `check-goal.cjs` rerun on this folder after the edits |
| Build | Pending | Nothing is built. The phase is Planned and builds sixth in parent D3's order |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title | The scaffold titled every document "Phase 1". This phase is Phase 5 of 6, as this title and the `spec.md` metadata now say |
| Count drift | Parsed records on 2026-09-27: 212 boundaries in 93 main-session files and 14 in 999 subagent files. A substring match gives 270 lines. The research counted 222 and the orchestrator 210 on earlier passes, so D5 pins the method and the report prints it |
| Test placement | The research put the test beside the script. The vitest include glob is `runtime/tests/**` and the scripts README says that folder holds scripts only, so the test and fixtures go under `runtime/tests/` |
| Report narrowed | The research's report printed counts, names and paths. Paths and identifiers come from transcript text, so D3 keeps the report to counts and scores, and the operator's spot read uses basename and line number |
| Amendment approval | Section 14 says each amendment waits for the operator's approval. Parent goal D1, D5 and its fourth completion criterion direct these amendments, so that approval is recorded as given |
| What changed in the directive | Objective: "zero Jev calls" to "zero model calls" and "offline Jev deletion arm" to "offline deletion arm on either backend". D2: names both proposed switches, the Deem preference and each backend's preconditions (C9). Criterion 3: stub `cli-deem` joins stub `jev`. The census, its stop line (D7) and the other criteria are unchanged |
| Key gate reference | `spec.md` cited "the parent's D5 key gate". The parent goal now states the Jev check under D1, so the amended text cites D1 |
| Level 1 has no `acceptance-criteria.md` | The criteria above come from `spec.md` REQ-001 to REQ-007, its stop line and its proof plan. `recommend-level.sh --loc 730 --files 9` scores Level 1 |
| Amendment: session source (2026-09-28) | Source: parent D4 ("005 this project's 15 newest compacted transcripts"). Checked on disk, not assumed: `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/` is this repository's only transcript directory, with 89 main-session files, 28 of them compacted, and worktree sessions stored there too. The harness picks the 15 by `--newest-compacted 15` (proposed): top-level `*.jsonl` files by modification time, newest first, the first 15 holding a parsed boundary. A trial read 30 files to find 15 holding 151 boundaries. Changed: D3, criterion 2 (it named "the 10 to 20 session files the operator named", which no one now names), `spec.md` metadata, dependencies, deliverables, scope, REQ-002, REQ-004, REQ-005, edge cases, SC-001 and proof plan 2 and 4, `plan.md` components, first slice and tests, T001 (ticked), T007 (new), T021 and T022, and `implementation-summary.md` |
| Amendment: selection tests (2026-09-28) | Source: parent D4. The new `--newest-compacted` surface gets a happy-path case and an edge case, so criterion 1 reads 12 passed instead of 10. It stays checkable the same way |
| Amendment: build route (2026-09-28) | Source: parent D5. No builder, reviewer or release wording in this phase contradicted it, so nothing was replaced. Added the build route to `spec.md` dependencies and `plan.md` section 4, a code review row in `plan.md` section 5 and tasks T026 (cross-family review) and T028 (orchestrator commit, path-scoped, no push) |
| Amendment: skill docs (2026-09-28) | Source: parent D6. The phase adds a script to system-spec-kit, and the file list named only `runtime/scripts/README.md`. Added `SKILL.md`, `README.md`, a changelog entry, a feature-catalog entry with its index and a playbook entry with its index to Files to Change, each with its reason, plus T018, T024 and the code route and doc validation rows in `plan.md`. D1 and criterion 5 now name those files, because a `git status` limited to the old four paths would fail a correct build. REQ-007 now points at the Files to Change table |
| Check: two backends (2026-09-28) | Source: parent D1. `spec.md` section 3 already states the Jev check, the Deem check (`cli-deem health`, proposed, phase 008, still Planned) and that with neither switch set, or every check failing, the output is byte-identical to the census and no binary is spawned. Nothing changed |
| Stale premises (2026-09-28) | Each cited seam reopened after the main merge `bbf2a8e4cd`. Holding: `compact-inject.ts:8`, `:181-190` and `:284`, `session-prime.ts:98`, `state.ts:31-41`, `compact.ts:22-26`, npm `core/compact.ts:75`, `docs/compact.md:30`, `claude-code.d.ts:7278-7285`, `.claude/settings.json:215-222` (timeout 3 at `:222`), `deem_server.py:995-997`, the vitest include glob, the scripts README's structure block and inventory, and the 218,417,443-byte largest file. Corrected: `state.ts:198-306` to `:198-307`, where `fitState` closes. No longer holding: the planned `readline` parser, which breaks records at a raw U+2028 and would falsely stop 2 of the 15 selected sessions. Recorded as a `spec.md` risk with its mitigation, and `plan.md` and T006 now say to split on the newline byte. A live newest file is a new risk and an open question |
| Conflict: parent D4 against the child's "operator names" rule | The old D3, REQ-002, T001 and the dependency line said the census reads only files the operator names and that the agent never chooses them. Parent D4 names a source and a count instead, so the harness now chooses the 15 by a fixed rule. Resolved in the parent's favor by the precedence rule. REQ-002's refusal to default to a directory stays. Named for the orchestrator |
| Gate note: `packet_budget` | `goal.cjs packet` prints `packet_budget=unknown` for this folder before and after the edits, as for siblings 002, 010 and 016. `budget-and-handoff.md` section 2 says a phase child that is not a phase parent is exempt from the cap and reads `unknown`, so `ok` cannot print here |
<!-- /ANCHOR:log -->
