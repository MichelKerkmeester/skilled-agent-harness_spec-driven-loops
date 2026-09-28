---
title: "Goal: Phase 17: deem-search-narrowing-arm"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deem search narrowing goal"
  - "score-track-narrowing completion criteria"
  - "track narrowing keep rule"
  - "deem spec track pick"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm"
    last_updated_at: "2026-09-28T12:00:00Z"
    last_updated_by: "spec-amend-leaf"
    recent_action: "Amended D1, D4, D5 and criterion 6 for the parent's wave 3 directive"
    next_safe_action: "Build in parent D3's order after 008, 016 and 002, against the completion criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-017-deem-search-narrowing-arm"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 17: deem-search-narrowing-arm

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

**Objective:** Settle, offline and on a counted number per backend, whether one Deem or Jev `choice` that picks the spec track before search beats ripgrep and the trigger-index lookup at naming the right track, through one read-only script whose default run makes zero model calls and prints the baseline first.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Changed paths: new `score-track-narrowing.mjs` in `.skilled/skills/system-spec-kit/runtime/cli/retrieval/`, new `tests/score-track-narrowing.vitest.ts` under `runtime/cli/`, one retrieval README row and, per parent D6, `system-spec-kit`'s `SKILL.md`, README, changelog, feature catalog and playbook through sk-doc. No hook, no Gate 1 change, no index or lookup edit |
| D2 | Questions are live packet `description.json` descriptions, answer is the track. Drop placeholders and any description holding a multi-word track slug or hub name. At most 20 rows per track, first by SHA-256 of the folder path. Both baselines ignore the question's own folder |
| D3 | The baseline is the better of ripgrep (distinct question tokens, path-only recipe over `specs`) and the lookup (first scoring `specs/` row), both at track level on identical rows |
| D4 | Spec REQ-004 is the keep rule, per backend column, checked in order: at least 90 percent of kept rows measured, a gain of at least 10 points over the baseline method on the measured rows, an exact one-sided sign test p below 0.05 on discordant rows and a flip rate of at most 0.10 over three calls per row. Else `verdict <backend>: stop (<reason>)`. A baseline above 0.90 prints `no headroom` and no arm calls. The verdict prints on stdout and in `report.json`. A live `verdict deem: keep` is the operator's keep that unlocks phase 009 (parent D4). Any verdict goes in this log for the parent's |
| D5 | Both arms ask 16 tracks plus `none` in three left rotations under one fixed `-q` instruction, track descriptions verbatim and hashed, no answer cache. Deem is preferred: the live run is `--deem` behind a passing `cli-deem health`, and a `--jev` run happens only on the operator's flag. No failover. The 20 paraphrase probes never decide |
| D6 | The Jev arm follows phase 002's gate: an identity line with the `jev` path and provider P first, then `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0, else a `jev arm skipped:` line and exit 0. One `--provider P` on every call, no key in any file, and a request carries only the question, the fixed `-q` instruction and the 17 options. A Jev keep holds only for its provider and model, a Deem keep for its commit pair |

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

- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` without `--deem` exits 0, prints `baseline lookup:`, `baseline ripgrep:`, `margin: 0.10` and either `no headroom` or `planned calls:`, and stub `cli-deem` and `jev` binaries first on `PATH` log zero calls
- [ ] With `--deem` and a stub `cli-deem health` reporting backend `stub`, the script prints `deem arm skipped: stub backend`, and with `--jev` and a stub `jev` whose `auth status --provider official` exits 3, it prints a line naming the `jev` path and provider `official`, then `jev arm skipped: no credential`. Each run exits 0 and its other output is byte-identical to the default run
- [ ] From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run --config ../../vitest.config.ts --project cli tests/score-track-narrowing.vitest.ts` exits 0 with at least 17 passed tests and 0 failed
- [ ] Either the default run printed `no headroom`, or one `--deem --out <dir>` run against the local server printed `verdict deem: keep` or `verdict deem: stop (<reason>)` and wrote a `calls.jsonl` in which every line holds `wallMs`, `exitCode`, `modelId`, `modelCommit` and `sourceCommit`
- [ ] `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on `score-track-narrowing.mjs` returns no match, and in a stub run that passes the Jev gate every logged `jev` call carries the same `--provider` value
- [ ] `git status --porcelain` lists no changed path other than `score-track-narrowing.mjs`, `score-track-narrowing.vitest.ts`, the retrieval `README.md`, `system-spec-kit`'s `SKILL.md` and `README.md`, one new changelog file, one new catalog entry and one new playbook entry with their index files, plus the report directory
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal, authored 2026-09-27 from the orchestrator's phase brief, section `017-deem-search-narrowing-arm` |
| Build | Pending | Nothing is built. The operator released this phase on 2026-09-28 (parent D3), and it builds after 008, 016 and 002. Phase 010 is Complete, and the Deem arm waits on 008's `cli-deem` |
| Wave 3 amendment | Done | 2026-09-28, by a spec leaf. Rows below, one per source |

### Deviations and findings

| Item | Note |
|------|------|
| Owner and collisions | Owner is `system-spec-kit`, `runtime/cli/retrieval/`. `git log -5` on it shows the last branch change as `954ed7fde8` (2026-09-26, index regeneration). Main carries three index rebuilds from 2026-09-27 (`eaa02a56f5`, `04193b88d7`, `dd0933eeff`) that this branch lacks, touching `trigger-index.json` and the fixtures. This phase writes neither, but its lookup baseline depends on which index is committed, so a merge reruns the zero-call run |
| Own-folder exclusion | Not in the brief. A question is its own packet's description, which also sits in that packet's `spec.md` frontmatter, so a lexical baseline would find itself and win by construction. Excluding the question's own folder keeps the comparison fair |
| Probe gold | The 20 Latin paraphrase probes carry a trigger phrase, not a track. Their gold is derived from the exact query's scoring `specs/` rows on the fresh index, which gives a set, not one track, and at most 20 rows. That cannot resolve a 10-point margin, so the probes are reported and never decide (D5) |
| Stratification | Rough count by this leaf on 2026-09-27: 1,968 live packet descriptions, 84 placeholders, 187 name leaks, 1,697 usable. `system-speckit` alone has about 998 usable and `cli-orca` 1. A cap of 20 per track gives about 259 rows (estimate). The build recounts |
| Margin | 10 points, fixed here so the build cannot tune it. About 26 more right rows of about 259 (estimate). Above a 0.90 baseline no gain of 10 points fits, hence `no headroom` |
| Amendment 2026-09-27: Jev arm | Source: parent goal D1, "Two backends: every feature runs on Jev or Deem, dormant unless one is available", relayed by the coordinator with `sk-create-goal`'s `parent-and-nested-goals.md` section 6 (a child goal may not override a parent decision). The first plan was Deem only, which left the feature dormant when Jev was available and Deem was not. Changed: the objective names both backends, D4 is per column, D5 keeps Deem preferred with Jev on the operator's flag, D6 is new with phase 002's gate, criterion 2 adds the Jev skip, criterion 3 counts 17 tests and criterion 5 is new (no key, one provider). `spec.md` gained REQ-012 and REQ-013 and an amendment trace. The parent needs no amendment, since this change brings the child into line with D1 |
| Recorded decisions kept | The 10-point margin and the own-folder exclusion stand unchanged through the amendment |
| Latency estimate | The 65.6 ms p50 in `deem-local.md` was measured on 2-option requests. A 17-option request with long track descriptions is longer, so the arm reports its own p50 and p95 and labels the estimate |
| Scaffold numbering | The scaffold titled every document "Phase 8". This phase is Phase 17 of 17, as the titles and `spec.md` metadata now say |
| Criteria in the objective | The objective stays one sentence, as in the sibling phases. The criteria reach the evaluator verbatim through the chat slice, which carries section 3 unchanged |
| Semantic-probes line counts | Re-counted from the fixture: Latin exact 16 of 20, paraphrase 1 of 20, distractor 0 of 20, CJK 0 of 20 in each variant, stemming 4 of 5. The fixture's `topScoringPaths` still name `.opencode/skills/...` paths from its capture, so the gold is re-derived on the fresh index rather than read from it |
| Amendment 2026-09-28: keep rule (parent D4) | Source: parent D4, "A pre-fixed Deem `keep` in 002 or 017 unlocks 009", and its log row "New directive, wave 3". A keep here now has a consequence, so the rule must be complete before any run. Changed: D4 here names spec REQ-004 and the unlock. REQ-004 now names its inputs (K, M, A, B, W, L, F), lets the lookup win a baseline tie and defines a measured row as three submitted keys. It compares in integers with an exact p and prints a `keep rule:` line before any call and the verdict with its inputs in `report.json`. It also says a stub keep never counts and a change after the first model run voids earlier verdicts. A coverage condition (90 percent of kept rows measured) comes first. Without it a column with no measured row has no defined gain, and a keep could rest on the rows the backend happened to answer while the others left the comparison unseen, which matters once that keep unlocks 009. REQ-011, AC-011 and T012 go from 17 to 18 cases for `stop (coverage)`, and AC-004 covers it. The handoff row, SC-002, plan sections 1 and 4, T010, T013 and T014 name the unlock and the log. Criterion 4 already covers `keep` or `stop` and stays as written. Criterion 3 stays at "at least 17" as a floor below AC-011's 18, since no decision made it untrue |
| Amendment 2026-09-28: build roles (parent D5) | Source: parent D5. No builder, reviewer or release wording here contradicted it, so nothing was replaced. Added: plan section 4's "Who builds" paragraph (a fresh Opus 5.5 xhigh build orchestrator, single-change briefs, Devin `deepseek-v4-1-flash-max`, Pi on Cline `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh` and Cursor `grok-4.7-xhigh-fast` by Bash only, the parent orchestrator verifying, a cross-family review and path-scoped commits), plan step 8, the Definition of Done review line, T023, CHK-024 and T002's suite baseline |
| Amendment 2026-09-28: skill docs (parent D6) | Source: parent D6. The file list held only the retrieval `README.md` for `system-spec-kit`, the one skill this phase changes. Added with reasons in spec section 3: `SKILL.md`, the skill `README.md`, a changelog file, a feature-catalog entry and a manual-testing-playbook entry, each with its sk-doc mode. Also REQ-014, AC-014, T019 to T022, plan step 7 and CHK-042 raised to P1. D1 ("Three changed paths only") and criterion 6 (its path list) were amended because D6 made both untrue. REQ-006 and AC-006 now point at the section 3 paths. Code goes through sk-code's OpenCode route (spec section 3, T002, CHK-013) |
| Parent D1 confirmed (2026-09-28) | The Deem gate (REQ-005, `cli-deem health` within 2,000 ms), the Jev gate (REQ-012, `jev auth status --provider P`) and today's behavior with neither (REQ-001's zero-call default, SC-003, the scope boundary) were already stated. Nothing changed for D1 |
| Stale premises (2026-09-28) | Checked against the tree after the main merge `bbf2a8e4cd`. Corrected in place: `lookup-trigger-index.mjs:104-108` to `:107-111`, `:176` to `:179` and `generate-trigger-index.mjs:64-67` to `:76-79`. Still true: `rg-wrapper.mjs:210`, retrieval README `:78`, `deem_server.py:166` (`max_letters = 26`, with Deem's source now at `7cf293f`, newer than `deem-local.md`'s `6755b30`), `jev_cli/__init__.py:352` and `:378` in the installed 0.6.2, `research.md:1038` and `:449`, `deem-local.md:85` (65.6 ms), 16 spec tracks and `semantic-probes.json` read by no script. No longer true, each now in the spec's risks: this branch lacking main's three index rebuilds (merged), 010 Planned (Complete), a scratch `--out` build writing tracked fixtures (not since `a0368b4a58`) and a call shape without `-q` (`jev_cli/__init__.py:350` requires it, so REQ-007 now fixes one instruction and the `none` description, and D5 and D6 here name it) |
| Conflict named: T018 and parent D7 | T018 was `[B]`, blocked on the operator's `--jev` flag. The tasks file closes only with no `[B]` task left. Parent D7 stops the build only for an install yes or a missing credential. Resolved in D7's favor: T018 no longer blocks, and with no flag by close it is marked done as not requested with that reason logged. The Deem-first design and the flag itself are unchanged. The orchestrator can revert this |
| Extra: phase numbering | The spec said "Phase 17 of 17" with no successor. Phase 018 names this phase as its predecessor and the parent phase map lists 18 phases, so the metadata now says 17 of 18 with successor `018-worktree-provision-shared-link` |
| Budget gate | `goal.cjs packet` on this folder prints `packet_budget=unknown`, as it does on every sibling phase. A phase child that is not itself a phase parent carries no budget (`.skilled/hooks/goal/lib/goal-slice.cjs:309-319` and `:407-412`), so `ok` cannot print here without changing the phase's shape |
<!-- /ANCHOR:log -->
