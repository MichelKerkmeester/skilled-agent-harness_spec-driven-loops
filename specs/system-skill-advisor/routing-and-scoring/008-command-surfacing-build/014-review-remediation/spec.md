---
title: "Feature Specification: Phase 14: review-remediation"
description: "Review pass one confirmed 42 findings and the coordinator queued three more. A write fault mid-embed leaves a half-written tree that the workflow reads as untouched, the hub attach path offers a writing command on a no-edit prompt or a file name and the renderer tests fail inside a dispatched child. This phase fixes the 43 items of work groups WG1 to WG13 with a failing-then-passing test each, so a second review pass can run on the fixed code."
trigger_phrases:
  - "review remediation"
  - "phase 14 review remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 15 |
| **Predecessor** | 013-attribution-and-install-reach |
| **Successor** | 015-health-default-and-brief-refinements |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, the six planning probes print the fixed outputs in section 5, every floor holds against `scratch/before.txt` and strict validation prints `RESULT: PASSED`, so the second review pass can start on the remediation diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). It fixes what review pass one confirmed in `../review/review-report.md`, whose verdict is PASS with advisories: P0 0, P1 0, P2 42, plus three queued items. The loop has not converged, because three of four lineages stopped at their iteration cap above the 0.10 novelty threshold, so a second pass runs after this phase.

**Scope Boundary**: Work groups WG1 to WG13 of the report's Planning Packet, each owning its files alone: the embed engine, the attach path and its deriver, the renderer and its tests, the behaviour runner and arena builder, the AGENTS.md check engine, the two hook checks, the doctor setup, symlink, install and embedder workflows, the command baseline capture, the routing-accuracy README, the shared session readers, the advisor subprocess and bench plus four advisor docs. WG14 (`R4-P2-003` in `AGENTS.md` and `iter3-P2-phase007-open-evidence` in the parent spec) and the refuted `R3-P2-001--16e5737e0e56` are out of scope.

**Dependencies**:
- Phase 013 is complete, so its embed pointer, delivery leg, restore module and scorer keys are the code this phase edits.
- Phase 015 is being planned beside this one and changes the hook health writer default. The coordinator confirms before wave 1 that no 015 task edits a file in section 3 while this phase builds (T003).
- The second review pass reads this phase's diff. It does not start before T061.

**Deliverables**:
- A safety lane (WG1 to WG4): an embed apply that undoes a failed write and refuses a linked router or mirror, an attach path that offers no command on a no-edit prompt or a file name, renderer tests that hold inside a dispatched child and a behaviour runner that starts only in a marked arena with an allowlisted environment.
- An advisory lane (WG5 to WG13): check engines and doctor workflows that report what they measure and print the repair they promise, a command baseline with no holdout row, session readers that fall back and open the path they checked, a capped subprocess, a complete bench matrix and docs that match the code.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A write that throws inside an embed apply escapes `main`, prints no backup or undo line and leaves `AGENTS.md` written beside the old `CLAUDE.md`, while the workflow reads the exit as "nothing was written". A Cursor mirror linked to an in-root file gets the mirror text written through the link. On the advisor side, the hub attach path offers `/create:skill` on a prompt that says "do not change anything yet", offers `/deep:review` when the prompt only mentions `/deep:ai-council` and reads `/create:readme.md` as the command `/create:readme`. The renderer tests fail 10 of 15 under `AI_SESSION_CHILD=1`, the behaviour runner hands its turn the whole operator environment and the remaining findings are docs, checks and readers that disagree with the code.

### Purpose
Every confirmed finding in WG1 to WG13 is fixed with a test that failed before the fix and passes after, and no floor in `scratch/before.txt` moves, so the second review pass reviews code that matches its docs.

**Core need served:** This phase repairs review findings. The fixes stop a writing command from being offered on a no-edit prompt and make an embed fault end in a restore, which protects the user from being pointed at the wrong workflow and keeps the measured numbers sound.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran on 2026-11-13 from the worktree root at `320e7b64d4`, read-only, while other workers edited phase 009 research files and the parent packet metadata. `ADV` is `.skilled/skills/system-skill-advisor/runtime`, `PL` is this phase's `scratch/planning/` and `P7` is `../007-per-runtime-behaviour-proof/scratch`. The probes in `PL` build and remove their own temporary trees. The holdout counts come from `id` and `split` only. No holdout prompt text was printed.

```text
$ node $ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune'
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":24,"attached":20,"combined":44,"total":44}
{"own":8,"attached":15,"combined":23,"total":45}
$ node $ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[160,50,21,5]
$ env -u AI_SESSION_CHILD npx vitest run          # in ADV, run earlier the same day at the same HEAD
 Test Files  179 passed (179)
      Tests  1712 passed | 8 skipped (1720)
$ node --test .skilled/commands/doctor/scripts/tests/*.test.cjs | rg "^ℹ (tests|pass|fail) "
ℹ tests 1164
ℹ pass 1164
ℹ fail 0
$ node --test .skilled/hooks/shared/tests/session-readers/*.test.mjs | rg "^ℹ (tests|pass|fail) "
ℹ tests 90
ℹ pass 90
ℹ fail 0
$ node $ADV/scripts/command-bridges/derive-command-bridges.cjs --check | jq -c '{status, counts: .counts.typescriptActive}'
{"status":"fresh","counts":46}
$ node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check | tail -1
[runtime-mirror-sync] PASS: 256 mirrors across 10 trees are in sync.
$ node .skilled/hooks/shared/session-reader-declarations.mjs --check | tail -1
STATUS=OK session-reader-declarations: 20 file(s) current
$ node $ADV/scripts/routing-accuracy/score-command-transcripts.mjs --summary $P7/runs-g2.jsonl --json | jq -cS 'map_values(.g2.startRate)'
{"claude":"3 of 6","codex":"0 of 6","devin":"4 of 6","dsh":"3 of 4","opencode":"5 of 6","pi":"4 of 6"}

# The two former P1 findings
$ node $PL/probe-embed-write-fault.cjs          # claude-only fixture, --create-router, second write throws EACCES
before: CLAUDE.md
main threw: EACCES: permission denied, open REPO RULES.md
apply printed backup line: false, undo line: false, restored line: false
after: AGENTS.md,CLAUDE.md
$ bash $PL/probe-mirror-link.sh                 # foreign fixture, .cursor/rules/repo-local.md -> ../../.github/ci.yml
plan exit=0
target AGENTS.md: replace
target REPO RULES.md: absent
target .cursor/rules/repo-local.md: replace
target CLAUDE.md: create
apply exit=0
wrote AGENTS.md
wrote .cursor/rules/repo-local.md
wrote CLAUDE.md
STATUS=OK
ci.yml sha before=b8ae3686e91b after=7a70373660ce link still a link: yes

# The attach path, including R2-P2-001
$ printf '%s' 'use sk-doc to create a skill called invoice-parser, do not change anything yet' | node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin | jq -c '{action, selectionKind, targets: [.targets[]? | (.workflowMode // .)]}'
{"action":"route","selectionKind":"single","targets":["sk-create-skill"]}
$ node --experimental-strip-types --no-warnings $PL/probe-attach.mts
attachCommand(sk-doc, single sk-create-skill, 'use sk-doc to create a skill called invoice-parser, do not change anything yet') -> "/create:skill"
attachCommand(system-deep-loop, single review, 'what did /deep:ai-council decide') -> "/deep:review"
attachCommand(system-deep-loop, single review, 'run /deep:review now') -> "/deep:review"
typedCommandIn('see /create:skill.md for details') -> "/create:skill"
typedCommandIn('run /create:skill.') -> "/create:skill"
typedCommandForTop('sk-doc', 'open /create:readme.md and summarise it') -> {"command":"/create:readme","policy":"start","ownerSkillId":"sk-doc"}
'COMMAND_POLICIES' in module -> true
tracked commands missing from COMMAND_POLICIES -> ["/create:benchmark","/create:command","/create:diff","/create:goal","/create:repo-rule","/create:skill-parent","/create:with-human-voice","/deep:ai-council","/design:chart","/design:diagram","/design:extract"]
needsMode hubs with a command row -> []

# The renderer, built dist, child flag passed explicitly
$ env -u AI_SESSION_CHILD node $PL/probe-render.mjs
needsMode on a command row: Advisor: live; use sk-doc → /create:agent (start) 0.95/0.12 pass.
child, run row paired with an add-only command: Advisor: live; use system-spec-kit → /doctor:speckit (run) 0.95/0.12 pass.
child, plain start command: Advisor: live; use sk-doc → /create:readme (parent-named only) 0.95/0.12 pass.
$ AI_SESSION_CHILD=1 npx vitest run tests/command-brief-golden.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts
 Test Files  2 failed (2)
      Tests  10 failed | 5 passed (15)
$ env -u AI_SESSION_CHILD npx vitest run tests/command-brief-golden.vitest.ts tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts
 Test Files  2 passed (2)
      Tests  15 passed (15)
$ env -u AI_SESSION_CHILD SPECKIT_RUN_BENCHES=true npx vitest run bench/hook-brief-signal-noise.bench.ts
TypeError: Cannot convert undefined or null to object
 Test Files  1 failed (1)
      Tests  1 failed | 3 passed (4)

# What a stricter embed proof would see today
$ node $PL/probe-postwrite-foreign.cjs | rg -c "foreign=0"     # 8 fixtures, with and without --create-router
15
$ node $PL/probe-postwrite-foreign.cjs | rg -v "foreign=0"
pure: plan 0 no digest (writes 0)

# The committed command baseline (RA is ADV/scripts/routing-accuracy)
$ jq -c '[(.rows|length), (.attachedMetrics.attachedRows|length)]' $RA/command-routing-baseline.json
[176,32]
$ jq -n --slurpfile h <(jq -c 'select(.split=="holdout") | .id' $RA/command-prompts.jsonl) --slurpfile b $RA/command-routing-baseline.json -c '{holdout: ($h|length), rows: ([$b[0].rows | keys[] | select(. as $k | $h | index($k))] | length), attachedRows: ([$b[0].attachedMetrics.attachedRows | keys[] | select(. as $k | $h | index($k))] | length), typedRows: ([$b[0].attachedMetrics.typedRows | keys[] | select(. as $k | $h | index($k))] | length)}'
{"holdout":44,"rows":44,"attachedRows":0,"typedRows":0}

# This repository's own A10 row and router tables
$ node .skilled/commands/doctor/scripts/agents-md-check.cjs | rg "A10|pointer|STATUS"
A10 runtime copies: 6/6 copies as expected   (PASS)
  CLAUDE.md: pointer missing - Claude Code reads only CLAUDE.md, so without a one-line @AGENTS.md pointer it never loads AGENTS.md
STATUS=OK rows=12 findings=0 unknown=0
$ node $PL/probe-router-widths.cjs
TRIGGER TABLE start 36 width 3 rows 10 mismatched lines []
INDEX start 53 width 2 rows 10 mismatched lines []
```

### Mechanism per Defect

- Embed write fault: the write loop in `commandApply` has no `catch`, so a throw reaches `main`, which re-throws anything that is not an allowlist, precondition or usage error. `restoreFromBackup` copies every recorded file without the allowlist or hash check `commandRestore` runs.
- Linked router or mirror: `compose` refuses a symlinked root document only. `fs.existsSync` and `readFileSync` follow a linked `REPO RULES.md` or mirror, so their target is diffed and written.
- Foreign lines: `preservationCheck` returns `foreign`, and neither `commandPlan` nor `commandApply` reads it.
- Attach path: `attachCommand` never consults the no-edit wording `fusion.ts` applies, opens the deep-loop gate on any `/deep:` substring and `typedCommandIn` treats `.` and `/` as a boundary. `COMMAND_POLICIES` has no reader and lacks 11 tracked commands.
- Renderer: `commandLabel` backfills a generated row even when `needsMode` is set, `headLabel` adds `(needs a mode)` only when the skill has no row and the child downgrade reads `mutating` from the skill's row rather than from the printed command's row. Both test files read the caller's `AI_SESSION_CHILD`.
- Runner: `childEnv` copies `process.env` minus three token names and the live-arm guard checks only for a remote, so an unprepared clone passes. The scorer rebuilds g2 labels from a regex instead of the runner's row table.

### Research Claims Checked in Code

- The report's fix for `R1-P2-005` is incomplete: skipping the row backfill alone renders `use command-create-agent` with no `(needs a mode)`, because `headLabel` also requires `commandRowFor(top.skill) === undefined`. Both edits are planned (T017).
- The report's tests for `iter4-P2-g2-label-grammar-duplication` and `iter5`/`iter2` import the runner, which has no exports and runs `main` through a top-level `await` on import. An entry guard comes first (T019).
- An unconditional symlink refusal in `compose` would refuse a linked install whose `REPO RULES.md` the run leaves `unchanged`, because `symlink-manifest.json` links that file. The refusal is limited to a path the run would create, replace or remove (T007).
- `runAdvisorSubprocess` returns no `stdout`, so the `R2-P2-002` test asserts `JSON_PARSE_FAILED` on a truncated array instead of a stdout length (T048).
- The doc findings in WG10 and WG13 and `DR3-P2-004` have no test file in their group, so their checks are `rg` counts in the task verify lines.
- The post-write foreign count is 0 on every fixture after the pointer sync runs, so failing apply on a foreign line cannot fail a clean install.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A. Make embed apply undo a failed write under a new exit 3, verify a backup before restoring from it, refuse a linked router or mirror it would write and fail on a foreign line (WG1).
- B. Share one no-edit pattern between the attach path and the scorer, open the deep-loop gate only for the typed command being attached, stop a file name reading as a command and delete `COMMAND_POLICIES` at its emitter (WG2).
- C. Render `(needs a mode)` and the child downgrade from the right inputs and isolate the renderer tests from `AI_SESSION_CHILD` (WG3).
- D. Start a live behaviour arm only in a marked arena with an allowlisted child environment, and label g2 rows from the runner's table (WG4).
- E. Fix the advisory findings of WG5 to WG13 in the check engines, hook checks, doctor workflows, command baseline, routing-accuracy README, session readers, subprocess, bench and advisor docs.

### Out of Scope
- `R4-P2-003` in `AGENTS.md` - the shared framework document waits on the operator.
- `iter3-P2-phase007-open-evidence` - the coordinator closes phase 007 in the parent spec.
- `R3-P2-001--16e5737e0e56` - refuted by the review synthesis.
- The report's section 8 deferred items, carried unchanged: the per-request child input (`R2-P1-001`), `run` commands that add files, a DSH install row, `DR1-P1-001` reach on a sandboxed runtime, `R1-P2-003` reach and the third no-edit copy in `scorer/text.ts:148`.
- The hook health writer default. Phase 015 owns it, so the setup text here names `SKILL_ADVISOR_DEBUG` as the writer reads it today.
- Rebuilding the existing behaviour arenas, starting any model session or running a live arm.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs`, `tests/agents-md-embed.test.cjs` | Modify | Write-fault restore with exit 3, verified restore, linked router or mirror refusal, foreign failure |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml`, `doctor-agents-md-presentation.txt` | Modify | Exit 3, foreign and linked-path rows, restore refusal note |
| `ADV/lib/command-attach.ts`, `ADV/tests/command-attach-guards.vitest.ts` | Modify, Create | `NO_EDIT_REQUEST`, no-edit and deep-loop guards, file-name continuation, regenerated block without `COMMAND_POLICIES` |
| `ADV/lib/scorer/fusion.ts` | Modify | Import the shared pattern, delete the empty branch |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs`, `README.md`, `ADV/lib/README.md` | Modify | Stop emitting `COMMAND_POLICIES` and describe the guards |
| `ADV/lib/render.ts`, `ADV/tests/command-brief-golden.vitest.ts`, `ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts`, `ADV/tests/render-child-session.vitest.ts` | Modify | `needsMode` head, child downgrade input, env isolation, parity test |
| `ADV/scripts/routing-accuracy/run-command-behaviour.mjs`, `prepare-behaviour-arena.mjs`, `score-command-transcripts.mjs`, `ADV/tests/command-behaviour-guards.vitest.ts` | Modify, Create | Entry guard, env allowlist, arena marker, shared g2 rows |
| `.skilled/commands/doctor/scripts/agents-md-check.cjs`, `tests/agents-md-check.test.cjs`, `README.markdown` | Modify | A10 truth, malformed router rows, four children, embed row |
| `.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs`, `hook-wiring-check.cjs` and their tests | Modify | Flag value refusal, absent repair line, command-entry marker match |
| `.skilled/commands/doctor/assets/doctor-setup.yaml`, `doctor-setup-presentation.txt`, `doctor-symlink-check.yaml`, `.skilled/commands/doctor/setup.md`, `scripts/tests/doctor-setup-contract.test.cjs` | Modify, Create | Absent repair route, hook health line, socket boundary, hook exit in the output block |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt`, `doctor-install.yaml`, `doctor-skill-advisor-embedder.yaml`, `scripts/tests/doctor-install-contract.test.cjs`, `skill-advisor-route-contract.test.cjs` | Modify | Runtime list wording, Ollama host binding |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs`, `command-routing-baseline.json`, `ADV/tests/command-routing-slice.vitest.ts` | Modify, Regenerate | No holdout row published |
| `ADV/scripts/routing-accuracy/README.md` | Modify | Inventory, exit 3, `offerReached`, arena and holdout sentences |
| `.skilled/hooks/shared/session-readers/{claude,devin,dsh,pi}.mjs`, `README.md`, `*.d.mts`, `*.d.mts.map`, `tests/session-readers/{devin,dsh,pi}.test.mjs`, `ADV/tests/hooks/advisor-runtime-list-parity.vitest.ts` | Modify, Regenerate | Devin fallback, contained path, DSH pin, capabilities parity |
| `ADV/lib/subprocess.ts`, `ADV/tests/subprocess-output-cap.vitest.ts`, `ADV/bench/hook-brief-signal-noise.bench.ts` | Modify, Create | Output cap, full bench matrix |
| `.skilled/skills/system-skill-advisor/README.md`, `ARCHITECTURE.md`, `feature-catalog/scorer-fusion/command-meaning-matching.md`, `feature-catalog/cli-surface/advisor-recommend.md` | Modify | 46 rows, DSH adapter, row shape and policy source |

The restraint pass for each new file: the three new advisor test files hold cases the report names and no existing file covers (`command-attach-guards`, `command-behaviour-guards`, `subprocess-output-cap`), and `doctor-setup-contract.test.cjs` pins workflow text no contract test reads today. No module is added. Two files join their groups beyond the report's lists: `doctor-agents-md-presentation.txt` (WG1), because it renders the embed exit codes, and `ADV/lib/README.md` (WG2), because it states the deep-loop gate rule this phase changes.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. Each requirement names the report ids it closes.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `DR1-P1-001`: a write that throws inside `embed apply` restores from the backup, prints `backup:` and `undo:` lines and `STATUS=FAIL`, and exits 3. The tree then equals its pre-run digest. |
| REQ-002 | `DR4-P2-001`: `restoreFromBackup` runs `assertWritable` and the sha256 check on every entry before it writes any, and a mismatch prints that nothing was restored and where the backup is kept. |
| REQ-003 | `DR4-P1-001`: `compose` refuses a symlinked `REPO RULES.md` or `.cursor/rules/repo-local.md` that the run would create, replace or remove, with exit 2 naming the link and its target, and leaves the linked file unchanged. A link the run leaves unchanged is not refused. |
| REQ-004 | `DR1-P2-003`: plan and apply fail on a non-empty `foreign` list as they fail on `dropped`, and apply restores from the backup. |
| REQ-005 | `R2-P2-001`, `R4-P2-002--828881666f76`: `command-attach.ts` exports `NO_EDIT_REQUEST`, `attachCommand` returns no command when it matches, `fusion.ts` imports it in place of its own copy and the empty semantic-search branch is gone. |
| REQ-006 | `R1-P2-001`: the deep-loop gate opens only when the typed command equals the command being attached or the prompt holds `DEPTH_WORDING`. |
| REQ-007 | `R1-P2-002--95282927956e`: a `/` or a `.` followed by a word character after a command key cancels the match, while a sentence-ending period still ends a command. |
| REQ-008 | `R4-P2-001--d1528b81a2ca`: the deriver emits no `COMMAND_POLICIES`, the regenerated `command-attach.ts` holds none, the deriver check prints `fresh` and the command-bridges and lib READMEs name `TRACKED_COMMANDS` as the attach-path table. |
| REQ-009 | `Q1-ai-session-child-test-isolation`, `R4-P2-002--de3d8b259d8e`: the golden and envelope tests stub `AI_SESSION_CHILD` themselves and pass under `AI_SESSION_CHILD=1`, and a parity test holds the renderer's child test equal to `isChildSession` for `1`, `0`, `true` and an empty value. |
| REQ-010 | `R1-P2-005`, `R2-P2-003`: a `needsMode` recommendation with no `command` renders `(needs a mode)` whatever row its id has, and the child downgrade reads `mutating` from the row whose command equals the printed command, treating an unknown command as writing. |
| REQ-011 | `iter5-P2-credential-hardening-allowlist`: the runner builds its child environment from an allowlist, so `SSH_AUTH_SOCK`, `AWS_ACCESS_KEY_ID`, `NPM_TOKEN`, `GH_TOKEN` and `AI_SESSION_CHILD` never reach a turn. |
| REQ-012 | `iter2-P2-arena-precondition-unverified`: the arena builder writes a marker under the clone's git folder and a live arm without it refuses with `arena_unprepared` and exit 2. |
| REQ-013 | `iter4-P2-g2-label-grammar-duplication`: the runner exports its g2 rows with `command` and `variant`, and the scorer labels g2 rows from them, with the g2 start rates unchanged. |
| REQ-014 | Floors hold against `scratch/before.txt`: typed recall at least 24 of 44, false offers 0 of 35, attached typed 44 of 44, plain tune combined at least 23 of 45, scorer eval no lower than `[160,50,21]` with the fourth no higher than 5, the full advisor suite, the doctor suite and the reader suite report 0 failed, and the declarations, deriver, mirror and route checks pass. |
| REQ-015 | No task prints holdout prompt text, starts a model session or writes under the home folder. `AGENTS.md`, every `package.json` and the parent `spec.md` are unchanged and no added code comment names a spec path, phase number, task id or finding id. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-016 | `DR1-P2-001`, `DR1-P2-002`, `DR3-P2-001`: A10 reports a symlink at a path the manifest expects absent as a finding, describes a pointer as naming the root document with no shipped line and counts a missing pointer apart from the copies as expected. |
| REQ-017 | `DR5-P2-003`: a router row whose cell count differs from its header is reported as malformed with its line number, never dropped. |
| REQ-018 | `DR3-P2-004`: the check engine header and the scripts README say four child checks and name the A12 manifest generator, and the README's embed row names exit 3, the foreign failure and the linked-path refusal. |
| REQ-019 | `DR5-P2-001`: `codex-hook-approval-check.cjs` exits 2 on a `--root` or `--config` value that starts with `-`. |
| REQ-020 | `DR5-P2-002`: `hook-wiring-check.cjs` reports `ok` only when a `type: command` entry's `command` runs `node` on the runtime's hook script, and a marker in any other field reads `hook-missing`. |
| REQ-021 | `DR3-P2-002`: the absent advisor entry prints a `repair:` line, and the setup delivery leg routes that state to the printed line. |
| REQ-022 | `DR3-P2-003`: the symlink check's output block names the hook check's exit 1 as WARN and exit 2 as FAIL. |
| REQ-023 | `DR2-P2-003`, `Q3-hook-health-needs-debug`: the setup workflow's boundary names the socket directory the advisor CLI may create, and the advisor leg prints `hook health not recorded` with the `SKILL_ADVISOR_DEBUG` reason when `data.hookHealth` is absent. |
| REQ-024 | `DR2-P2-001`: the install guide names the six accepted runtimes and `the ones already there` instead of "the seven", and says DSH is not offered because the link manifest has no DSH row. |
| REQ-025 | `DR2-P2-002`: the embedder's start and pull steps run with `OLLAMA_HOST` from the resolved URL and refuse a URL whose host is not local. |
| REQ-026 | `iter5-P2-holdout-secondary-split-publication`: the capture leaves holdout rows out of `rows`, `attachedRows` and `typedRows`, the slice test compares non-holdout rows and asserts no holdout id, and the recaptured baseline holds 0 holdout ids. |
| REQ-027 | `iter1-P2-readme-inventory-drift`, `iter3-P2-readme-restore-exit3`, `iter1-P2-offer-reached-unknown`: the routing-accuracy README counts 14 code files and lists every code and data file, names exit 3 `head_moved` and its skipped restore and says `offerReached` counts offers whose brief was not shown missing. |
| REQ-028 | `R1-P2-004`: a Devin database that fails to open or project falls through to the transcript before `store_unreadable`. |
| REQ-029 | `R1-P2-003`, `R1-P2-002--fabc628596e7`, `R4-P2-001--09ff48e9a0b9`: a sourceless DSH message is pinned as injected with source `unknown`, the Claude, Devin, DSH and Pi readers open the path their containment check returned and a parity test holds the readers' `capabilities` keys equal to `ADVISOR_RUNTIME_VALUES`. |
| REQ-030 | `R2-P2-002`: `runAdvisorSubprocess` caps stdout and stderr at 1 MiB each. |
| REQ-031 | `iter4-P2-bench-runtime-matrix-incomplete`: the bench matrix has a row for every value in `ADVISOR_RUNTIME_VALUES` and the bench file passes. |
| REQ-032 | `R3-P2-001--0e0d904eb571`, `R3-P2-002--5522ea1fe8dd`: the skill README and the command-meaning page say 46 rows, and `ARCHITECTURE.md` names the DSH prompt adapter. |
| REQ-033 | `R3-P2-002--ecbea1260371`, `Q2-command-policies-doc`: `advisor-recommend.md` gives the row shape `{ command, policy?, mutating?, ownerSkillId }`, names `TRACKED_COMMANDS[command].policy` as the attach-path policy source and states the no-edit and deep-loop gates as the code now applies them. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The planning probes print the fixed behaviour: `probe-embed-write-fault.cjs` prints `main returned 3`, `restored line: true` and `after: CLAUDE.md`, `probe-mirror-link.sh` prints `plan exit=2` and an unchanged `ci.yml` digest, `probe-attach.mts` prints `undefined` for the no-edit, `/deep:ai-council` and file-name inputs and `false` for `'COMMAND_POLICIES' in module`, and `probe-render.mjs` prints `(needs a mode)` and `(parent-named only)` on its first two lines.
- **SC-002**: `env -u AI_SESSION_CHILD npx vitest run` in `ADV` reports 0 failed, and the golden, envelope and child-session files report 0 failed under `AI_SESSION_CHILD=1`.
- **SC-003**: Every floor in REQ-014 equals or beats its line in `scratch/before.txt`, and the g2 start rates equal `{"claude":"3 of 6","codex":"0 of 6","devin":"4 of 6","dsh":"3 of 4","opencode":"5 of 6","pi":"4 of 6"}`.
- **SC-004**: `rg -n "COMMAND_POLICIES" .skilled --glob '!**/node_modules/**'` prints nothing after the rebuild, and the recaptured baseline holds 0 holdout ids where it held 44.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 015, planned beside this one | A 015 build task editing `render.ts`, `doctor-setup.yaml`, `setup.md` or a reader while this phase builds collides with a lane | T003: the coordinator confirms no 015 task touches a section 3 file before wave 1, or sequences 015 after T061 |
| Dependency | WG2 changes attach outcomes before WG9 recaptures | The slice test drifts on a holdout aggregate between the two lanes | WG9 runs in wave 2 after WG2. T041 records the metrics delta of the capture against the committed file before it writes, and REQ-014 blocks a lower floor |
| Risk | The child environment allowlist drops a variable a runtime CLI needs | Med: a live arm fails to authenticate or to find its config | The allowlist keeps each runtime's own prefix and provider keys. UNKNOWN until the next live arm, recorded as an open question |
| Risk | Existing arenas carry no marker | Med: the next live arm refuses with `arena_unprepared` | Intended. The next arm rebuilds its arenas with the builder, recorded as an open question |
| Risk | A restore that refuses a damaged backup leaves the tree as the failed write left it | Low: the operator must undo by hand | The refusal prints the backup folder and the undo command, and the workflow says the tree is partly written |
| Risk | Plan now refuses a linked router or mirror that apply used to refuse later | Low: a linked install whose router lacks a shipped row gets exit 2 at plan time | The refusal names the link and its target, and a link the run leaves unchanged is not refused |
| Risk | A recapture could hide a regression | Med | T041 prints the metric delta first, and T057 compares every floor with `scratch/before.txt` |
| Risk | UNKNOWN: whether DSH ever emits an operator message with no `source` | Low | The reader keeps its fail-closed rule and a test pins it. The reach question stays deferred |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The attach guards add one regex test and one string comparison per attach call, with no I/O.
- **NFR-P02**: `restoreFromBackup` reads each backup copy once more for its hash before it writes, on a failure path only.

### Security
- **NFR-S01**: No task writes under the home folder, approves a Codex hook or starts a model session. The arena smoke test builds and removes its arena under the system temp folder.
- **NFR-S02**: No task prints holdout prompt text. Scripts count holdout rows by `id` and `split` only.

### Reliability
- **NFR-R01**: Every fix lands with a test that failed before it, except where the report says none can: `R4-P2-002--828881666f76` changes no output, the two parity tests and the DSH pin pass today and guard drift, `R1-P2-002--fabc628596e7` is a race with no deterministic test and the doc findings are checked by `rg` counts.
- **NFR-R02**: A reader that cannot open its store still returns `store_unreadable` when its fallback also fails.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a write fault on the first write of a run that created every path restores to the empty tree the plan found, and an apply with no writes still prints `NOTHING TO DO`.
- Maximum input: a 2 MiB stdout from the advisor child is cut at 1 MiB and reads `JSON_PARSE_FAILED`, never a partial recommendation list.
- Failure path: a backup whose hash no longer matches stops the restore before the first byte, prints the backup folder and the undo command and ends `STATUS=FAIL`.
- `run /create:skill.` still attaches `/create:skill`, while `see /create:skill.md` and `open /create:readme/notes` attach nothing.
- A linked `REPO RULES.md` whose rows are already complete is `unchanged` and is not refused.
- A g2 row id outside the old regex grammar labels from the shared table, and an id in neither the corpus nor the table still reads `unknown_row`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | About 45 files in 13 groups across the doctor engines and workflows, the advisor runtime, the routing-accuracy scripts, the shared readers and four docs, about 1,300 changed lines |
| Risk | 12/25 | The embed restore and the attach path are write-safety and offer-safety code, each guarded by a failing-then-passing test and the floors |
| Research | 6/20 | Every finding was re-read in code and reproduced read-only before planning |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

Each answer is an autonomous decision under the packet goal's D1, recorded on 2026-11-13.

- Q1. Which exit code reads as undone? Decision: a new exit 3 for a write fault, with the restore result on its own line (Recommended). Exit 1 already means the proof failed and the tree was restored, and exit 2 means nothing was written, which a partial write is not.
- Q2. Does the symlink refusal cover every router and mirror link? Decision: only a link the run would create, replace or remove (Recommended). A linked install keeps a linked `REPO RULES.md` that is often complete, and refusing it would block every embed there.
- Q3. Where does `COMMAND_POLICIES` go? Decision: delete it at the emitter and regenerate, and never point the attach path at it (Recommended, coordinator scope decision). `TRACKED_COMMANDS` covers the 11 commands it lacks.
- Q4. Does `R1-P2-005` need the `headLabel` edit too? Decision: yes (Recommended). The backfill skip alone drops the label, measured on a copied renderer.
- Q5. How does a test import the runner? Decision: add an entry guard like the scorer's `invokedDirectly` (Recommended). The alternative, a new shared module for the g2 rows, adds a file the report does not name.
- Q6. Does the parity test import `spec-gate-core.mjs`? Decision: the test does and the renderer keeps its literal (Recommended, as the report says). Tests sit outside the typecheck, so a cross-package import there adds no build edge.
- Q7. What does the Q3 setup line name? Decision: `SKILL_ADVISOR_DEBUG` as the writer reads it today (Recommended, coordinator scope decision). Phase 015 changes the writer default later.
- Q8. How is the socket write in `setup.md` reconciled with a read-only boundary? Decision: name the directory in the workflow's boundary invariant and keep `allowed_targets` empty (Recommended). The write is the advisor CLI's own, and no leg makes it on purpose.
- Q9. Which files join a group beyond the report's lists? Decision: `doctor-agents-md-presentation.txt` joins WG1 and `ADV/lib/README.md` joins WG2 (Recommended). No other group owns either file.
- Q10. What fills the bench matrix for the five runtimes the iteration never measured? Decision: `not-recorded` on every axis (Recommended). Inventing axis readings would put unmeasured values in a fixture named as measured.

### Open

- Does the child environment allowlist keep every variable each runtime CLI needs to authenticate and find its config? UNKNOWN until the next live arm. Owner: the coordinator's next arm smoke turn.
- The existing arenas under the system temp folder carry no marker, so the next live arm must rebuild them with `prepare-behaviour-arena.mjs`. Owner: the coordinator.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Review report**: `../review/review-report.md`
