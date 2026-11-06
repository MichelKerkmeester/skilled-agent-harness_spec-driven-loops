---
title: "Goal: DeepSeek Harness becomes the eighth cli runtime"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation"
    last_updated_at: "2026-11-06T00:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Reconciled phase statuses against saved evidence; keyed gates remain open."
    next_safe_action: "Run the keyed route and fanout checks when provider keys are available."
    blockers: ["Provider keys unavailable for live route and fanout checks", "Phases 006-012 retain open verification items", "Phase 014 has unmet closeout criteria"]
    key_files: ["spec.md", "goal.md", "014-playbook-docs-and-closeout/evidence/final-gate-2026-11-06.txt"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-cli-deepseek-harness-creation"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Goal: DeepSeek Harness becomes the eighth cli runtime

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** DeepSeek Harness (`dsh`) is integrated as `cli-deepseek-harness`, the eighth `cli-external-orchestration` runtime, mirroring `cli-pi` in skills, agents, commands, guards, MCP, deep-loop executor support and cross-repo references.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Evidence is `001-deep-research/research/research.md`; per-phase scope is its `phase-plan.md` |
| D2 | Mode id `cli-deepseek-harness`, binary `dsh`, repo folder `.dsh/`, pinned `@deepseek-ai/dsh@0.2.2-rc.1` |
| D3 | Headless only: `dsh --profile headless --json`, prompt on stdin via `-`, route and lineage patches on every dispatch |
| D4 | Closed roster: LLM Gateway `deepseek-v4.1-flash-1017` and OpenCode Go `deepseek-v4.1-flash`; the official DeepSeek route and `DEEPSEEK_` env never pass |
| D5 | Guards ship as one relative-path repo plugin under `.dsh/plugins/repo-guards/`, not the experimental Claude hook bridge |
| D6 | The kind stays experimental and out of default allowlists until a keyed live pin proves a route |
| D7 | Docs via `sk-doc` create modes, code via `sk-code`; no session reads, copies or prints a key |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-deep-research | `001-deep-research/goal.md` |
| 002-dsh-offline-contract-pin | `002-dsh-offline-contract-pin/goal.md` |
| 003-cli-deepseek-harness-skill-packet | `003-cli-deepseek-harness-skill-packet/goal.md` |
| 004-dsh-runtime-folder-and-patches | `004-dsh-runtime-folder-and-patches/goal.md` |
| 005-dsh-mirror-generators | `005-dsh-mirror-generators/goal.md` |
| 006-deep-loop-executor-kind | `006-deep-loop-executor-kind/goal.md` |
| 007-dispatch-recognition-and-stress-adapter | `007-dispatch-recognition-and-stress-adapter/goal.md` |
| 008-dsh-repo-guards-safety-wave | `008-dsh-repo-guards-safety-wave/goal.md` |
| 009-dsh-context-guards-and-goal-bridge | `009-dsh-context-guards-and-goal-bridge/goal.md` |
| 010-dsh-mcp-code-mode | `010-dsh-mcp-code-mode/goal.md` |
| 011-hub-registration-and-routing | `011-hub-registration-and-routing/goal.md` |
| 012-deep-loop-modes-and-commands | `012-deep-loop-modes-and-commands/goal.md` |
| 013-dsh-live-contract-pin | `013-dsh-live-contract-pin/goal.md` |
| 014-playbook-docs-and-closeout | `014-playbook-docs-and-closeout/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each keyed roster route answers `dsh --profile headless --json -` with exit 0 and `final.reason.kind` `completed`, saved verbatim; an unkeyed route is marked "configured, not verified" and excluded from default allowlists
- [ ] One `fanout-run.cjs` deep-research lineage on kind `cli-deepseek-harness` completes with a clean containment scan
- [ ] The three `.dsh/` mirror generators exit 0 with `--check`, and the dispatch-audit, executor and stress test suites pass
- [x] `mode-registry.json` lists eight modes including `cli-deepseek-harness`, and the advisor still routes "use cli-opencode with deepseek-v4.1-flash" to `cli-opencode`
- [x] `validate.sh specs/cli-external-orchestration/085-cli-deepseek-harness-creation --strict --recursive` prints `RESULT: PASSED`
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
| 001 research | Done | 2 of 2 lineages succeeded, 10 iterations each, 145 merged key findings, synthesis and phase plan in `001-deep-research/research/` |
| 002 to 014 scaffolded | Done | `create.sh --phase --parent` created 13 children, each with `goal.md` |
| 002 offline contract pin | Done | Keyless run exit 1, `final` `MISSING_CREDENTIAL` on route `llmgateway`, relative stub plugin booted, `~/.dsh` diff empty, strict PASSED 0/0 |
| 003 skill packet | Done | `cli-deepseek-harness/` with eleven hard rules, strict PASSED 0/0. Built by a subagent of this session |
| 004 `.dsh/` folder | Done | Two route patches plus lineage patch compose with empty stderr, keyless boot per route ends `MISSING_CREDENTIAL` on its own route, strict PASSED 0/0 |
| 005 mirror generators | Done | 55 skill links, 44 prompt stubs, 11 persona patches, each `--check` exit 0; 8/8 generator tests; `dsh-mirror` CI job; doctor contract 7/7; strict PASSED 0/0 |
| 007 part one, rule checks | Done | Rule checks 45/45 (was 40/42), dispatch-audit under vitest 2854/2854. Codex's runner swap to `node --test` was reverted |
| 006 executor kind | Built, verification open | Saved unit evidence records 356/356 and typecheck exit 0; default-table search and required quality review remain open. Evidence: 006-deep-loop-executor-kind/evidence/full-unit-current.txt, 006-deep-loop-executor-kind/evidence/kind-table-inventory.txt |
| 008 repo-guards plugin | Built | Eight adapters, 16/16 tests; keyless boot with the guards patch exits 1 `MISSING_CREDENTIAL` with no "did not activate" line, and a missing-module control does print one |
| 011 hub registration | Built | parent-skill-check OK 0 warnings; compiled routing reminted to `b768e513…`, dsh prompt routes to `cli-deepseek-harness`, the cli-opencode DeepSeek canary to `cli-opencode`; manifest tests 48/48 |
| 007 part two, stress adapter | Built, verification open | Stress suite records 169 pass and 9 live-probe skips; baseline counts and test-first order remain open. Evidence: 007-dispatch-recognition-and-stress-adapter/evidence/stress-cli-adapter-after.txt and tasks.md |
| 008 repo-guards plugin | Built, verification open | Bundle tests pass, but acceptance criteria for current keyless boot and isolated boot behavior remain open. Evidence: 008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt and acceptance-criteria.md |
| 009 context and goal guards | Built, verification open | Goal-slice case passes and the README records the compact-context deferral, satisfying AC-004. Parity, current keyless rerun and SYNC.md deferrals remain open. Evidence: 009-dsh-context-guards-and-goal-bridge/evidence/message-contract-run.txt, 009-dsh-context-guards-and-goal-bridge/evidence/keyless-guards-boot.txt, acceptance-criteria.md |
| 010 MCP Code Mode | Built, verification open | Dump-config and executor tests pass; current keyless rerun and the default-off case remain open. Evidence: 010-dsh-mcp-code-mode/evidence/dump-config-mcp.txt and 010-dsh-mcp-code-mode/evidence/executor-config-vitest.txt |
| 011 hub registration | Built, verification open | Mode registry and advisor route checks are recorded; T003 and P1 checks remain open. Evidence: 011-hub-registration-and-routing/evidence/closeout-mode-registry.txt, 011-hub-registration-and-routing/evidence/closeout-compiled-route-opencode-deepseek.txt, tasks.md |
| 012 deep-loop modes | Built, verification open | Nine files name the kind, second compile is byte-identical and ADR-001 admits no council seat; T002 and required checklist items remain open. Evidence: 012-deep-loop-modes-and-commands/evidence/checks.txt, 012-deep-loop-modes-and-commands/evidence/compile-dry-run-compare.txt, tasks.md |
| 013 keyed live contract pin | Done for LLM Gateway | LLM Gateway `deepseek-v4.1-flash-1017` verified 2026-11-06: exit 0, `completed`, empty stderr; promoted in `executor-config.ts` with a `live-contracts.json` entry. OpenCode Go configured, not verified (key unset). Live fanout lineage 2 completed with 0 containment advisories; `~/.dsh` diff empty; secret scan clean; phase strict PASSED. Evidence: 013-dsh-live-contract-pin/evidence/ |
| Final gate r3 | Green | After the 013 closeout and remint 6 (`2bee8b9c…`): dsh generators 56/45/11 `--check`, Hermes 67/67, contract drift OK, trigger index `--check` 0, rule tests 50/50, repo-guards 37/37, dispatch audit 870/870, runtime units and stress 526 pass 9 skipped, tsc 0, 8 modes, advisor canary to `cli-opencode`, manifest 48/48, recursive strict 15/15 PASSED. Evidence: 014-playbook-docs-and-closeout/evidence/final-gate-2026-11-06-r3.txt |
| 014 playbook and docs closeout | In Progress | 25 scenarios have results: 21 PASS, MIR-001's initial FAIL reran to PASS, and 3 key-gated scenarios SKIP. Recursive strict validation passed 15/15; AC-002 and AC-005 remain open. Evidence: 014-playbook-docs-and-closeout/evidence/playbook-run/summary.md, 014-playbook-docs-and-closeout/evidence/playbook-run/mirrors__MIR-001-rerun.txt, 014-playbook-docs-and-closeout/evidence/final-gate-2026-11-06.txt |
| Review-2 fixes | Done | Guards patch required, version probe in a throwaway home, stderr inactive-plugin check, adapters anchored on the plugin file, dsh-llm loader, `observe()` on ask, DSH_HOME no longer passed through. Runtime units 356/356, typecheck exit 0, plugin tests 36/36, rule checks 49/49, audit 2854/2854 |
| Phase status audit | Reconciled | Phases 006-012 remain In Progress because their own acceptance criteria or required checklist rows remain open; 013 remains Planned without keyed evidence. Parent map now mirrors the child spec statuses. Evidence: phase folders 006 through 013, each child's spec.md, acceptance-criteria.md and tasks.md |
| Operator decisions 2026-11-06 | Applied | `$REPO` resolves to the checkout in the start-folder and home rules; thirteenth rule `dsh-availability-required`; six `DSH_*_DIR` overrides in `.env.example`; research `.dsh-home` deleted; no council seat yet; no commit. Final gate r4 green, recursive strict 15/15. Evidence: 014-playbook-docs-and-closeout/evidence/final-gate-2026-11-06-r4.txt |
| Codex quota | Reset | The operator reported the quota reset; later workers ran on cli-codex |
| Release closeout 2026-11-06 | Committed | DSH handover items committed (dispatch fix, 13th rule, $REPO fixes, .env.example, changelogs, runtime READMEs, root README). Criteria 1-3 are met: keyed LLM Gateway run exit 0 completed (013 evidence/route-llmgateway.*), OpenCode Go explicit-only and not default (DSH_DEFAULT_MODEL), clean fan-out lineage dsh-live-2 (013 evidence/fanout-lineage.md), dsh generators and test suites green in final... |
| Final gate r6 | Green on HEAD | 15 mirror checks exit 0, rule tests 50/50, dispatch audit 128/128, runtime 534 pass 9 skip, tsc 0, routing 48/48, repo-guards 37/37 and strict 15/15 from a HEAD export. Evidence: 014-playbook-docs-and-closeout/evidence/final-gate-2026-11-06-r6.txt |

### Deviations and findings

| Item | Note |
|------|------|
| `~/.dsh` created during research | A lineage's read-only `dsh --help` probe created `~/.dsh/profiles`, `storages` and `.anonymous-user-id` at 2026-11-05 22:59. Left untouched. Phase 002 runs every probe under a disposable `DSH_HOME` |
| Repo-root `.env` | Headless reads `<cwd>/.env`, and this repo has one, so a dispatch from the repo root bypasses the env allowlist. Hard rule `no-repo-root-dotenv` and lineage cwd guard it |
| Deepseek lineage clock | Five state-log timestamps fall after the lineage's recorded end, self-reported and not real |
| Red suite after 003 | `dispatch-rule-checks.test.mjs` went 42/42 to 40/42 because the eleven new rule ids have no check implementation. The rule-check half of 007 runs right after 005 part one, ahead of 006 |
| Hub check 6a | `parent-skill-check.cjs` fails 6a, the unregistered `cli-deepseek-harness` folder, until 011 registers it |
| Route patch fields | The orchestrator added `supportsDeveloperRole: false`, a declared `off`/`high`/`max` map and default `max` to codex's patches, per research section 9.2. A keyless boot accepted them |
| Homebrew node broken | `/opt/homebrew/bin/node` fails on missing `libsimdjson.34` since simdjson 5.1.1 (2026-11-02). Checks run on `~/.local/bin/node`; codex dispatches prepend it to `PATH` |
| Patch paths must be literal | A `--patch` whose file name hides behind a variable cannot be checked against the roster, so it fails `route-patch-required`; packet docs now name `$REPO/.dsh/patches/<file>` |
| Plugin load failure is silent | dsh prints `N entry did not activate` and keeps running, so a broken guards bundle would leave a dispatch unguarded; the validator must treat that line as failure |
| prompt-advisor off | Off by default in the bundle config, not in `lineage.patch.yml`, because the lineage patch is applied before the guards patch inserts the bundle row |
| Canary validator | `validate-canary.cjs` for the hub fails on a missing `deep-improvement` script that is untracked in HEAD; unrelated and pre-existing |
| OpenCode Go | Overloaded at the 2026-11-05 smoke and v1-only in OpenCode; endpoint for the harness stays UNKNOWN until phase 013 |
| Over-strict dsh rule checks | The hook refused the orchestrator's own keyless probes: a variable directory before a literal patch file, a variable `DSH_HOME`, and an `env` wrapper. Fixed in the check with a regression test, not worked around |
| dsh-llm unresolvable | A bare `import('@deepseek-ai/dsh-llm')` fails from this checkout (`ERR_MODULE_NOT_FOUND`); `adapters/dsh-llm.mjs` resolves it from the running `dsh` binary |
| MCP cwd defect | The first keyless MCP probe hit `MODULE_NOT_FOUND`: the walk-up cwd fell back to the scratch folder. The patch now resolves the root from its own `--patch` path |
| MCP needs Node 24 | The launcher finds Node 24 through `NVM_DIR` or `$HOME/.nvm`; a dispatch that replaces `HOME` must pass `NVM_DIR` |
| mcp-route-guard error policy | The 010 worker brief said fail open; the spec's CHK-012 says deny when the core throws. The spec prevailed |
| Accidental intent-to-add | The orchestrator ran `git add -N .` by mistake (533 entries); removed with `git reset --pathspec-from-file` on exactly those paths, files untouched |
<!-- /ANCHOR:log -->
