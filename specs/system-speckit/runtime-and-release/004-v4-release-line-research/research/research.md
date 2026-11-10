---
title: "Deep Research Synthesis: Skilled v4 release line v4.0.0.0 to v4.0.2.0"
description: "Merged, de-duplicated and cross-family verified findings from five forced-depth research children, with an over-engineering cut list, extension ideas and remediation phases 006 to 017."
trigger_phrases:
  - "v4 release line research synthesis"
  - "v4 remediation phases"
importance_tier: "important"
contextType: "research"
---
# Deep Research Synthesis: Skilled v4 release line v4.0.0.0 to v4.0.2.0

Parent: `specs/system-speckit/runtime-and-release/004-v4-release-line-research` | Synthesized 2026-11-09 | Verification ledger: `verification/verdicts.json`, worker briefs in `verification/briefs/`, raw verdicts in `verification/outputs/batch-*.md`

## 1. Executive Summary

The v4 line mostly does what its notes say on the paths people use every day. The defects cluster where a surface reports health it cannot see: checkers that cannot fail, gates that cover fewer trees than their names, exit codes that disagree with the result they print, and the single-executor half of the deep loops, which drifted away from the fan-out runner that owns the same contract in code. One defect breaks a shipped path outright: every single-executor `cli-opencode` deep-loop dispatch fails, because the YAML passes `--pure` and OpenCode v2.2.5 rejects it.

**After de-duplication and verification: 1 P0, 45 P1, 14 P2 in the verified set, 5 dropped (refuted).** The verified set is the 65 P0/P1 candidates that survived merging roughly 120 raw P0/P1 rows across the five children; every one went to a GPT-6 Luna worker, and 14 were downgraded to P2 on its evidence or mine. The children's remaining P2 rows (85 + 44 + 31 + 34 + 84 = 278 as graded by the children, not de-duplicated across clusters and not re-verified here) stay in each child's `research/research.md`; section 4 lifts the orchestrator-confirmed ones that feed a phase.

By type, verified P0/P1 (46): bug 30, drift 8, misalignment 5, UX 2, improvement 1 (coverage gap). Over-engineering and extension items sit in sections 5 and 6.

**Verification.** 65 candidates went to 9 cli-codex workers (`gpt-6-luna`, `model_reasoning_effort=xhigh`, `service_tier=fast`, `--sandbox read-only`, 4 in parallel). Luna returned 33 CONFIRMED, 27 CHANGED, 5 REFUTED. No GPT quota error occurred. The lead spot-checked eight verdicts by running them (V01, V25, V26, V27, V48, V51, V53, V54): it overturned Luna on V01 (Luna's sandbox could not start OpenCode; the lead observed the rejection), agreed on V25, V26, V27, V48 (with a narrower cause), V51, V53, and overrode Luna's severity on V54 and V24 (section 8). `git status` after all workers showed no change outside this packet beyond the pre-existing `specs/system-speckit/graph-metadata.json`.

**Executors and iterations** (read from each child's `research/deep-research-state.jsonl`):

| Child | Iteration rows | Productive | Notes | Executors |
|-------|---------------:|-----------:|-------|-----------|
| 001-spec-kit-core | 20 | 19 | 1 error row (Devin quota) | cli-devin deepseek-v4-1-flash-max, then cli-pi opencode-go/deepseek-v4.1-flash max |
| 002-authoring-hubs | 11 | 10 | 1 error row (Devin quota) | same switch |
| 003-cli-and-deep-loop | 26 (gen 2) + 3 (gen 1 archive) | 26 | gen 1 stopped on Devin quota | cli-devin gen 1, cli-pi gen 2 |
| 004-advisor-hooks-relaunch | 22 (gen 2) + 3 (gen 1 archive) | 20 distinct | 2 redispatch duplicates (see V11) | cli-devin gen 1, cli-pi gen 2 |
| 005-doctor-git-ci-runtime | 22 | 21 | 1 error row (Devin quota) | same switch |
| **Total** | **101 gen-2/primary rows + 6 archived** | **96** | | |

cli-deepseek-harness was never usable as the fallback, because its single-executor path throws (V02).

## 2. Ranked Findings (verified P0 and P1)

Verification status: **orch** = the child orchestrator opened or ran it; **Luna** = cross-family worker verdict; **lead** = this synthesizer ran it. CHANGED means the defect is real and the claim below already carries Luna's correction.

| ID | Sev | Type | Title | Evidence (`path:line`) | Introduced | Confidence | Verification |
|----|-----|------|-------|------------------------|------------|-----------|--------------|
| V01 | P0 | bug | Single-executor `cli-opencode` deep-loop branch passes `--pure`; OpenCode v2.2.5 rejects it, so every dispatch on that branch fails (also hardcodes `opencode`) | `.skilled/commands/deep/assets/deep-research-auto.yaml:1619`, `deep-review-auto.yaml:1547`, `deep-research-confirm.yaml:1259`, `deep-review-confirm.yaml:1386` | v4.0.0.13 | high (observed) | orch + lead observed; Luna CHANGED (could not run) |
| V25 | P1 | bug | Gate 3 depends on word order: "Update the README and review the result." does not fire, "Review the README and update it." does | `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:718-742`; `AGENTS.md:75` | pre-v4.0.0.0 | high | orch + Luna + lead |
| V26 | P1 | bug | Resume branch lets a read-only word suppress Gate 3 although the module says resume is always required ("resume the packet" fires, "review the packet and resume" does not) | `gate-3-classifier.ts:786`, `:839-843` | v4.0.0.1 | high | Luna CHANGED + lead |
| V27 | P1 | bug | `/speckit:save`'s writer `runtime/cli/dist/continuity/generate-context.js` is gitignored and untracked; `/doctor:install` probes `runtime/dist`; the repair `validate.sh` prints never builds `runtime/cli` | `.gitignore:60`; `.skilled/commands/doctor/assets/doctor-install.yaml:34`; `system-spec-kit/runtime/tsconfig.json:26-29,47`; `validate.sh:409-433` | v4.0.2.0 | high | orch + Luna + lead |
| V28 | P1 | bug | `resolveProjectRoot` silently falls back to the shared runtime checkout for an unrecognised project, so a save writes into the Skilled repo | `system-spec-kit/runtime/cli/core/config.ts:131-146`, `:355`; `generate-context.ts:1214-1222`; commit `6f42c7b169` | v4.0.1.0 | high | orch + Luna |
| V02 | P1 | bug | `cli-deepseek-harness` is an admitted executor kind with no single-executor branch, and the builder throws without a lineage dir | `executor-config.ts:19`; `deep-research-auto.yaml:1211-1667`; `fanout-run.cjs:3002` | v4.0.2.0 | high | orch + Luna |
| V03 | P1 | drift | Both deep-research YAMLs gate on `config.executor.type`; template and normalizer use `kind` (review YAMLs are correct) | `deep-research-auto.yaml:1198`; `deep-research-confirm.yaml:1183`; `executor-config.ts:537` | v4.0.0.3 | high | orch + Luna CHANGED |
| V04 | P1 | bug | Three dispatch ids use bare `{generation}`, bound only under restart | `deep-research-auto.yaml:1327`, `:1428`, `:1530` vs `:329` | v4.0.0.3 | high | orch + Luna |
| V09 | P1 | bug | Write containment snapshots repo-wide `git status`, so sibling runs quarantine each other (`cli-classifier.zip` in three children's quarantines) | `system-deep-loop/runtime/lib/deep-loop/write-containment.ts:546-550`, `:1136-1143` | v4.0.0.16 | high | orch + Luna |
| V24 | P1 | bug | Out-of-folder writes during research escaped unreverted: `package_skill.py --strict` without `--check` wrote three zips to the repo root, and a stray `specs/001-test-feature/` appeared in a `create.sh` probe window; containment recorded the zips only and never recorded the folder | `sk-doc/scripts/package_skill.py:1843-1848`, `:1955-1996`; `003-cli-and-deep-loop/decision-record.md:141`; `001-spec-kit-core/decision-record.md:491` | v4.0.0.16 (containment) | medium (create.sh attribution circumstantial) | lead (decision records) + Luna CHANGED |
| V07 | P1 | bug | Fan-out `stopPolicy=max-iterations` with no per-lineage cap is rejected only after the lineage ran | `fanout-run.cjs:1134`, `:1759`, `:4036` | v4.0.0.x | high | orch + Luna |
| V10 | P1 | bug | Confirm-mode lock is refreshed only before operator gates; a gate wait over 60 min lets another run reclaim the packet | `deep-research-confirm.yaml:304`, `:633`, `:1109`; `loop-lock.ts:640-643` | v4.0.0.x | high | orch + Luna |
| V11 | P1 | bug | Reducer counts iteration rows, not iterations, and takes the last row as latest; 004 has 22 rows for 20 iterations | `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2520`, `:2610` | v4.0.0.x | high | orch + Luna CHANGED |
| V12 | P1 | bug | Delta corruption is fail-open (null padding) while state-log corruption fails closed | `reduce-state.cjs:1656-1663` vs `:1871-1875` | v4.0.0.x | high | orch + Luna |
| V13 | P1 | drift | Canonical state-log row keeps 7 of 14 fields; `focus`, `mode`, `answeredQuestions` vanish, so `last_focus` reads undefined | `deep-research-auto.yaml:619`; `003-.../research/deep-research-state.jsonl` vs `deltas/iter-026.jsonl:1` | v4.0.0.x | high | orch + Luna CHANGED |
| V14 | P1 | bug | `{release_readiness_state}` is passed to review closeout but never bound; reviews never report readiness | `deep-review-auto.yaml:541`, `:682-699`, `:2490`; `synthesis-closeout.cjs:114-120` | v4.0.0.x | high | orch + Luna |
| V16 | P1 | UX | An executor quota error becomes a canonical `error` iteration that counts toward `maxIterations` (Devin burned one in 001, 002, 005, 003 gen 1) | `deep-research-auto.yaml:615-616`, `:773`, `:2036-2040` | v4.0.0.x | high | orch + Luna |
| V08 | P1 | drift | v4.0.0.8 says every deep-loop script refuses unknown options; 15 of 27 do, `append-mode-event.cjs` accepts any `--key` | `.skilled/changelog/skilled/v4.0.0.8.md:69`; `append-mode-event.cjs:58` | v4.0.0.8 | high | orch + Luna CHANGED |
| V21 | P1 | misalignment | cli-external-orchestration requires an inlined persona on every dispatch; the deep-loop prompt pack carries only a route line and tells the child to read the file by path | `cli-external-orchestration/SKILL.md:189`; `prompt-pack-iteration.md.tmpl:2`; `fanout-run.cjs:1629-1640`; `sk-prompt/assets/cli-prompt-quality-card.md:147` | v4.0.0.x | high | orch + Luna |
| V22 | P1 | misalignment | Prompt pack hardcodes "Max 12 tool calls" while config sets `maxToolCallsPerIteration: 24`, never rendered | `prompt-pack-iteration.md.tmpl:36`; `deep-research-config.json:12`; `prompt-pack.ts:73-80` | v4.0.0.x | high | orch + Luna |
| V18 | P1 | bug | Pi classifier transport pins Pi `0.99.2`; with Pi 1.5.0 installed the Pi route never runs (package resolution fails before the version compare; fallback is reported) | `cli-classifier/shared/scripts/jev-transport.mjs:36`, `:319-336`, `:374`, `:399-403` | v4.0.0.x | high | orch + Luna CHANGED |
| V19 | P1 | misalignment | Three advertised Jev phrases are absent from `cli-classifier/hub-router.json`; each defers at stage one | `cli-classifier/ROUTER.md:67`; `cli-jev/ROUTER.md:117`; `hub-router.json:33` | v4.0.0.x | high | orch + Luna CHANGED |
| V20 | P1 | misalignment | Hub vocabulary lives in unjoined copies; "opencode go route this task" gets `sk-code` from the advisor and `cli-deepseek-harness` from compiled routing | `cli-external-orchestration/hub-router.json:104-130`; `mode-registry.json:37-49` | v4.0.0.x | high | orch + Luna CHANGED |
| V50 | P1 | drift | v4.0.1.0 says the advisor suggests doctor commands for a described problem; "my hooks are not firing, what do I run" returns no doctor command | `.skilled/changelog/skilled/v4.0.1.0.md:102` | v4.0.1.0 | medium (Luna run was degraded mode) | orch + Luna CHANGED |
| V29 | P1 | bug | `create.sh` resolves templates from the caller's repo at three sites while sourcing libs from its own location; `SPECKIT_TEMPLATES_BASE` undocumented | `system-spec-kit/runtime/cli/spec/create.sh:24-28`, `:1405-1417`, `:1477`, `:1665`, `:2253` | pre-v4.0.0.0 | high | orch + Luna |
| V31 | P1 | UX | Trigger lookup returns 20 rows scored 0.000 and exit 0 on a typo unless `--scoring-only` is passed | `retrieval/lookup-trigger-index.mjs:203-210` | pre-v4.0.0.0 (v4.0.0.3) | high | orch + Luna |
| V32 | P1 | bug | `check-goal.cjs --all` exits on errors only; a findings-only corpus exits 0 | `sk-doc/sk-create-goal/scripts/check-goal.cjs:703`, `:715` | v4.0.0.2 | high | orch + Luna CHANGED |
| V35 | P1 | bug | `CROSS_ANCHOR_CONTAMINATION` never runs under `validate.sh`: the orchestrator calls it without a plan and no producer exists (standalone CLI can) | `runtime/lib/validation/orchestrator.ts:1112`; `spec-doc-structure.ts:1287-1292`, `:1483-1485` | pre-v4.0.0.0 | high | orch + Luna CHANGED |
| V36 | P1 | bug | Trigger corpus includes `specs/**/research/**` (2,979 paths), so every research write stales the Gate 1 index; `--check` shows 44 missing docs | `retrieval/lib/corpus.mjs:66`, `:177`; `generate-trigger-index.mjs:157-160` | v4.0.0.12 | high | Luna (orch downgraded the 43-row symptom, kept this mechanism) |
| V37 | P1 | bug | Post-edit `check-placeholders.sh` fails (exit 1) on Draft tokens the rule only warns on, and scans files the rule never reads | `runtime/cli/spec/check-placeholders.sh:127`, `:134`, `:159`; `runtime/cli/rules/check-placeholders.sh:146-150`, `:196-201`; `orchestrator.ts:891-899` | v4.0.0.14 | high | orch + Luna CHANGED |
| V40 | P1 | bug | `validate.sh --strict` prints `RESULT: PASSED` while SOURCE_TAGS could not run (helper exit 2 degrades to warn) | `runtime/cli/rules/check-source-tags.sh:29-33`; `check-source-tags-helper.mjs:344-347`; `orchestrator.ts:1425`, `:1508` | v4.0.2.0 | high | Luna |
| V41 | P1 | bug | `check-source-dist-alignment.ts` never checks freshness; a stale dist passes whenever its source exists | `runtime/cli/evals/check-source-dist-alignment.ts:317-323`, `:364-377` | pre-v4.0.0.0 | high | Luna CHANGED |
| V38 | P1 | drift | v4.0.0.0 note promises a SCOPE_ADHERENCE completion check; no rule or env-var producer exists | `.skilled/changelog/skilled/v4.0.0.0.md:91-93`; `validator-registry.json` | v4.0.0.0 | high | Luna |
| V39 | P1 | drift | `save-workflow.md` documents a three-tier save router (LLM endpoint, pending-route refusal, `routeAs`) with no code | `system-spec-kit/references/memory/save-workflow.md:426`, `:432`, `:435`; `generate-context.ts:168` | pre-v4.0.0.0 | high | Luna |
| V43 | P1 | bug | sk-doc `leaf-manifest.json` lists five quality-control leaves at packet paths that do not exist | `.skilled/skills/sk-doc/leaf-manifest.json:125-137` | v4.0.0.0 | high | orch + Luna CHANGED |
| V44 | P1 | bug | Ask-surface menu detector misses `1.` menus and `10)`, and fires on `1)` how-to lists ending in a question | `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:39`; `fixtures/prose-menu-numbered.json:2-4` | ask-surface guard release | high | orch + Luna |
| V45 | P1 | bug | Claude ask-surface Stop hook and `advisory-stop.cjs` read stdin with blocking `readFileSync(0)`, no deadline | `ask-surface-guard/claude/ask-surface-stop.cjs:81-84`; `lib/advisory-stop.cjs:41-45`; `hooks/shared/hook-adapter-shared.cjs:62-74` | v4.0.0.8 contract | high | orch + Luna |
| V46 | P1 | bug | "Sent back once" is four contracts: OpenCode keys on assistant message, dsh on turn, Pi on operator message, Claude on `stop_hook_active` | `.opencode/plugins/ask-surface-guard.js:102`; `dsh/ask-surface-guard.mjs:107-108`; `pi/ask-surface-guard.ts:62-67`, `:107` | ask-surface guard release | high | Luna (executor-verified in 004) |
| V47 | P1 | bug | Dispatch-audit hooks resolve the log from `payload.cwd`, scattering gitignored `.skilled/logs` (one inside this packet) | `.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs:56-57`; `dispatch/lib/dispatch-audit.mjs:1158`; `.gitignore:263` | dispatch-audit release | high | orch + Luna |
| V48 | P1 | drift | `agents-md-manifest.cjs --check` exits 1 at HEAD: history body `865f058927ed` no longer released; the body also still names Hermes | `.skilled/commands/doctor/assets/agents-md-manifest.json:13`, `:1068` | v4.0.2.0 | high | orch + Luna + lead |
| V49 | P1 | improvement | No workflow runs `agents-md-manifest --check`, so V48 shipped unseen | `.github/workflows/` (no match); contrast `agent-mirror-sync.yml:57` | v4.0.1.0 | high | orch + Luna + lead |
| V61 | P1 | misalignment | Devin injects the first 16,384 bytes of a 27,587-byte AGENTS.md, dropping sections 5 to 10 and the repo block; the delivery canary sits 5 bytes under the cap | `.devin/SYNC.md:93`; `AGENTS.md:180`; 002 `f-iter009-002` | pre-v4.0.0.0 | high | Luna |
| V51 | P1 | bug | `symlink-engine check` returns literal 0 after reporting drift | `.skilled/commands/doctor/scripts/symlink-engine.cjs:1791-1801` | v4.0.1.0 | high | orch + Luna + lead |
| V53 | P1 | bug | sk-git CI runs 1 of 5 suites; four suites run in no workflow | `.github/workflows/sk-git-script-tests.yml:50-51`; `.skilled/skills/sk-git/scripts/tests/` | v4.0.0.13 | high | orch + Luna + lead |
| V54 | P1 | drift | Agent body-parity gate lists 3 of 7 trees and its required opencode arm compares the canonical file with itself (symlink) | `.skilled/bin/lib/mirror-sync-verify.cjs:50-54`; `.opencode/agents -> ../.skilled/agents` | v4.0.0.0 | high | orch + Luna CHANGED + lead (severity override) |
| V56 | P1 | bug | `/doctor:runtime-mirrors` never runs `check-agent-mirror-sync.cjs`; its roster checker checks presence, never content | `doctor-runtime-mirrors.yaml:37`, `:140`; `agent-roster-mirror-check.cjs:41`, `:60` | v4.0.0.3 | high | Luna |

## 3. Downgraded to P2 after verification (still real, kept in phases)

| ID | Type | Title | Evidence | Why P2 |
|----|------|-------|----------|--------|
| V05 | over-engineering | `if_cli_copilot` branches no executor kind can select | `deep-review-auto.yaml:1239`, `:1288`; `executor-config.ts:11-19` | Luna: unreachable, breaks no supported config |
| V06 | misalignment | Stop policy and `minIterations` live in YAML, not code (`convergence.cjs` has 0 refs) | `deep-research-auto.yaml:643`, `:815` | Luna: YAML does implement them |
| V15 | bug | Council confirm YAML lacks the auto twin's `post_dispatch_validate` | `deep-ai-council-confirm.yaml:173-182` vs auto `:175-186` | Luna: input hierarchy validated pre-dispatch |
| V23 | over-engineering | `branch-leases-waves`: 3,117 lines, two type-only importers | `substrate-ports.ts:10`; `conditional-fanin/types.ts:16-19` | Luna: dead weight, no user failure |
| V30 | drift | Phase-parent ANCHORS_VALID blanket pass; the v4.0.0.5 note omits the documented exemption | `orchestrator.ts:975-976`; `README.md:303`; `v4.0.0.5.md:108-110` | Luna: exemption documented |
| V34 | UX | `check-goal.cjs` root from module location; `--help` itself rejected | `check-goal.cjs:59`, `:568-572`, `:706` | Luna: `--root` exists |
| V42 | UX | `validate_skill_package.py` stops at the first frontmatter error | `validate_skill_package.py:258-272`; `package_skill.py:1696-1699` | Luna: validation still fails |
| V55 | UX | `install-git-hooks.sh --status` says SHADOWED for hooks linked through the `.opencode/scripts` alias | `install-git-hooks.sh:96-104`, `:136` | Luna: misleading text only |
| V57 | UX | Install inspection inside the Skilled checkout exits 2 with no remedy | `doctor-install.yaml:59`; `symlink-engine.cjs:68`, `:289` | Luna: target is the source |
| V58 | drift | `/doctor:install` checklist omits `/doctor:git standards` init | `INSTALL-SKILLED.md:114-117` | Luna: shipped asset fallback enforces rules |
| V62 | UX | `parent-skill-check` prints "Advisory findings: FAIL" on a green run | `parent-skill-check.cjs:2488` | Luna: policy label |
| V63 | UX | `release-update check --offline` exits 0 with every unit unknown, no RESULT line | `release-update.cjs:163-166` | Luna: per-command contract |
| V64 | improvement | Runtime-mirrors hook battery is 66 existence-only rows | `doctor-runtime-mirrors.yaml:148` | Luna: drift covered elsewhere |
| V65 | UX | Two mirror checkers reject `--check`; orphan scan failure returns 0 against README wording | `orphan-process-check.cjs:558-568`; README `:126` | Luna: read-only by default |

Orchestrator-confirmed child P2s that feed a phase below: 002 `f-iter002-002` (v4.0.0.16 note says `--apply`, route accepts `--dry-run` only), 002 `f-iter003-001` (create index says 21 chart forms, catalog ships 29), 002 `f-iter001-002`, `f-iter002-001`, `f-iter003-005`, `f-iter004-001/002/003`, `f-iter006-001`, `f-iter008-002`, `f-iter009-001`; 001 `f-iter019-001` (`SYSTEM_SPEC_GATE_DISABLED` read as exact `1`, documented as truthy); 005 `f-iter018-003` (note says 33 workflows, tree has 32), `f-iter022-004`; 003 B10, D11, U4; 004 B4, B5, B12, D4, D12, M1, U2. Each carries its evidence in its child's `research/research.md`.

## 4. Over-engineering Cut List

| Cut | Evidence | What breaks if removed | Status |
|-----|----------|------------------------|--------|
| `system-deep-loop/runtime/lib/branch-leases-waves` (3,117 lines) and its unit suite | V23 | Two type-only imports need local types; nothing at runtime | Luna verified |
| `if_cli_copilot` branches in three deep YAMLs | V05 | Nothing; no executor kind selects them | Luna verified |
| `runtime/lib/deep-review-reducers` (3,281 lines, second severity model the live reducer never reads) | 003 O8 | Nothing reported; needs an importer scan before deletion | orch, inferred for importers |
| `CROSS_ANCHOR_CONTAMINATION` registry entry, or wire a producer | V35 | The standalone `--contamination-json` CLI use, if anyone calls it | Luna verified; decide wire vs delete in phase 010 |
| `--planner-mode hybrid` (accepted, no behaviour) | 001 `f-iter008-006` | Callers passing `hybrid` get a usage error | child evidence only |
| `sync-phase-map-status` script (no caller) | 001 `f-iter006-005` | Its vitest suite and one README row | child evidence only |
| Unreachable `skip` severity tier and the no-op level expression | 001 `f-iter013-007`, `f-iter013-008` | Nothing | child evidence only |
| Byte-identical second `package_skill.py` | 004 O4 | Any path still pointing at the copy; grep first | child evidence only |
| Duplicate 28-entry Cursor roster (`executor-config.ts:353` and `fanout-run.cjs:2562`) | 003 O6 | Nothing once one imports the other | child evidence only |
| `orchestration-status.log` (strict subset of `observability-events.jsonl`) | 003 O4 | Anyone tailing the log file | child evidence only |
| Unused evilcharts palette sheets and `source-globals.css` | 002 `f-iter007-001`, `f-iter007-002` | Provenance only | orch confirmed |
| `/doctor:ci` Write grant it never uses | 005 `f-iter009-002` | Nothing; the script writes under Bash | child evidence only |
| Three stdin deadline readers (`.cjs`, `.mjs`, `.ts`) | 004 O2 | Keep one per module format only if each runtime needs it | child evidence only |

## 5. Extension Ideas

1. **One exported argv builder** from `fanout-run.cjs` that every single-executor YAML branch consumes (003 E1). Closes V01, V02, V03, V04 and the ~100-line dispatch body copied into three branches.
2. **Static executor-branch contract test** (003 E3): extract every `config.executor.*` path from `skip_when`, `branch_on` and dispatch facts and assert it exists in the executor schema; would have caught V03 and V01's binary hardcode.
3. **Typed `executor_switch` event with a per-kind fallback list** (003 E2), so a quota error migrates the run instead of burning an iteration (V16).
4. **Shared `parseArgs(argv, {allowed})`** in `system-deep-loop/runtime/lib` that emits the documented error and exit code (003 I1), closing V08.
5. **Hostile-environment detector corpus** (004 E1): one fixture set run against every ask-surface adapter, once with `AI_SESSION_CHILD=1`; closes V44 and V46 regressions and the 27/65 test-isolation trap.
6. **Nested `.skilled/logs` doctor check** (004 E4): fail when any `.skilled/logs` exists below the repo root; closes the V47 class.
7. **A `suite-unwired` flag in `/doctor:ci report`** (005 `f-iter018-004`): cross every tracked `*.test.*` against workflow `run:` lines; would have caught V53 and V49.
8. **Trigger-index research exclusion** (001 `f-iter012-010`): exclude `specs/**/research/**` from the corpus (V36), then a `--check` mode on the lookup.
9. **Doctor exit-code contract** shared by all doctor engines (0 healthy, 1 drift, 2 usage, 3 degraded) with a `RESULT:` line, closing V51, V63, V65 together.

## 6. Proposed Remediation Phases

Only verified findings (sections 2 and 3) are assigned. Worker tier per goal G4: **Luna** = cli-codex `gpt-6-luna` high fast; **DSF** = DeepSeek V4.1 Flash max. Each phase baselines its suites before the first edit.

| Phase | Name | Goal | Closes | Files / areas | Risk | Baseline checks | Tier | Depends on |
|-------|------|------|--------|---------------|------|-----------------|------|------------|
| 006 | deep-loop-single-executor-dispatch | Make every single-executor branch dispatch through the fan-out argv builder | V01, V02, V03, V04, V21, V22, V05 (P2) | `.skilled/commands/deep/assets/deep-{research,review}-{auto,confirm}.yaml`, `system-deep-loop/runtime/scripts/fanout-run.cjs`, `prompt-pack-iteration.md.tmpl`, `executor-config.ts` | high | system-deep-loop vitest suites; `node --test` on runtime scripts; new branch contract test (extension 2); one live `opencode run` single-executor smoke from a temp dir | Luna | none; do first (P0) |
| 007 | deep-loop-state-and-stop-policy | Honest iteration counting, fail-closed deltas, bound closeout fields, lock refresh at gates | V07, V10, V11, V12, V13, V14, V16, V08, V06 (P2), V15 (P2) | `deep-research/scripts/reduce-state.cjs`, `loop-lock.ts`, deep YAMLs, `append-mode-event.cjs` and other unguarded scripts, `convergence.cjs` | high | reducer and loop-lock suites; reduce a copy of each 047 child state log before and after and diff counts | Luna | 006 (same YAMLs) |
| 008 | write-containment-scoping | Scope the baseline to the lane and record or refuse out-of-folder writes | V09, V24 | `write-containment.ts`, `package_skill.py` default (require `--out` or refuse repo-root zip) | high | write-containment suites; a two-run concurrent probe in /tmp | Luna | 007 |
| 009 | gate3-and-continuity-root | Order-independent Gate 3, resume always required, refuse unknown project roots, provision and probe the CLI writer | V25, V26, V27, V28, V29 | `shared/gate-3-classifier.ts`, `runtime/cli/core/config.ts`, `generate-context.ts`, `runtime/tsconfig.json`, `doctor-install.yaml`, `validate.sh` repair text, `create.sh` | high (every session's gate) | gate-3 classifier corpus tests plus the four probe prompts in section 2; system-spec-kit runtime and cli vitest; a fresh-clone `/tmp` build probe | Luna | none |
| 010 | validate-and-retrieval-exit-honesty | Every spec-kit checker exits as it reports | V31, V32, V35, V36, V37, V40, V41, V30 (P2), V34 (P2) | `lookup-trigger-index.mjs`, `retrieval/lib/corpus.mjs`, `check-goal.cjs`, `check-placeholders.sh` (call `run_check`), `check-source-tags.sh`, `orchestrator.ts`, `check-source-dist-alignment.ts`, `spec-doc-structure.ts` | high | `validate.sh --strict` across a fixed packet sample; `test-validation.sh`; retrieval and check-goal tests; `generate-trigger-index.mjs --check` | Luna | 009 (shared runtime) |
| 011 | spec-kit-doc-drift | Make notes and references say what the code does | V38, V39, V30 note text, 001 `f-iter019-001` | `.skilled/changelog/skilled/v4.0.0.0.md`, `v4.0.0.5.md`, `references/memory/save-workflow.md`, `ENV-REFERENCE.md` (or widen the parser) | low | sk-doc `validate_document.py` on each touched doc | DSF | 010 |
| 012 | hook-guards-and-audit-log | Fix the menu detector, put every Stop hook on the deadline reader, one send-back-once contract, rooted audit log | V44, V45, V46, V47 | `.skilled/hooks/ask-surface-guard/**`, `.opencode/plugins/ask-surface-guard.js`, `.skilled/hooks/dispatch/**` (six adapters), shared stdin reader | high (all runtimes) | `node --test .opencode/plugins/tests/*.test.cjs` with and without `AI_SESSION_CHILD`; ask-surface fixtures; hook adapter parity vitest | Luna | none |
| 013 | agents-md-delivery-budget | Regenerate the AGENTS.md manifest deliberately and fit the Devin 16 KB cap | V48, V61, 002 `f-iter009-002` | `agents-md-manifest.json`, `AGENTS.md` delivery prefix, `.devin/SYNC.md` | high (instructions every runtime reads) | `agents-md-manifest.cjs --check`; delivery-prefix canary; `wc -c` of the Devin-delivered prefix | Luna | none; before 014 |
| 014 | doctor-and-ci-gate-honesty | Checkers that can fail, parity over all seven trees, CI that runs what exists | V49, V51, V53, V54, V56, V55, V57, V58, V62, V63, V64, V65 (P2s) | `symlink-engine.cjs`, `mirror-sync-verify.cjs`, `doctor-runtime-mirrors.yaml`, `install-git-hooks.sh`, `orphan-process-check.cjs`, `.github/workflows/sk-git-script-tests.yml`, `agent-mirror-sync.yml`, `INSTALL-SKILLED.md` | high for the gate changes, low for wording | doctor script tests; all five sk-git suites; `check-agent-mirror-sync.cjs --all`; `route-validate.sh` | Luna for P1, DSF for P2 wording | 013 (V49 adds a step that is red until V48 is fixed) |
| 015 | cli-hub-routing-and-classifier | Join hub vocabularies, route the advertised phrases, unpin the Pi transport | V18, V19, V20, V50 | `cli-classifier/hub-router.json`, `cli-external-orchestration/{hub-router,mode-registry}.json`, `jev-transport.mjs`, doctor routing phrases | medium | advisor routing gold set; `compiled-route.cjs` probes; `routing-registry-drift` check | Luna | none |
| 016 | authoring-hub-manifests-and-drift | Fix the sk-doc leaf manifest and the orchestrator-confirmed hub drift | V43, V42 (P2), 002 confirmed P2s | `sk-doc/leaf-manifest.json`, `validate_skill_package.py`, `.skilled/commands/create/README.txt`, create command argument hints, sk-prompt card and playbook links | low | `validate_skill_package.py` on sk-doc, sk-design, sk-prompt; `parent-skill-check.cjs`; `ci-skill-root-metadata.cjs` | Luna for V43, DSF for the rest | none |
| 017 | over-engineering-cuts | Remove verified dead code | V23, V05 if not already removed in 006, cut-list rows with "Luna verified" or "orch confirmed" | `branch-leases-waves/**`, evilcharts unused assets | low after an importer re-scan | full system-deep-loop vitest before and after; `rg` importer scan as negative control | DSF | 006, 007 |

## 7. Needs Confirmation (not in any phase)

| Item | What would confirm it |
|------|-----------------------|
| V33 check-goal corpus vs packet budget disagreement | Rerun the original `/tmp/goalcorpus` fixture from 001 iteration 5 with `--root`; Luna saw both modes agree at 0 on the live repo |
| 003 B16 review YAML carries two restart implementations, the live one loses lineage bookkeeping | Executor evidence only; read `deep-review-auto.yaml:186` against the second restart block and run a restart on a /tmp copy |
| V50 detail "top three below 0.13" | Luna ran degraded (no daemon); rerun with the advisor daemon up |
| 003 O8 `deep-review-reducers` has no importer | Repository-wide importer scan including tests and command assets |
| Remaining child P2s not listed in sections 3 and 4 | Each needs one opened citation before it enters a phase |

## 8. Out of Scope or Operator-Only

- Whether to run `agents-md-manifest.cjs --write`: the tool's own remedy records the current unreleased body as released, which erases the evidence V48 rests on. Phase 013 decides it, but the regenerated manifest is an operator-visible artifact.
- Deleting the stray `specs/system-speckit/runtime-and-release/004-v4-release-line-research/.skilled/logs/` (untracked, gitignored): deleting an untracked file is in the irreversible tier.
- The three zips moved to the 003 orchestrator's scratchpad (decision D-08): keep or discard.
- Machine-level `core.hooksPath` in `~/.config/git/hooks` that links into this checkout (005 `f-iter019-003`): a per-machine choice, not a repo fix.
- Devin daily quota and any OpenCode or Pi upgrades: account and install actions.
- Commit, push and merge of this packet and of the remediation worktree (goal G6).

## 9. Refuted and Downgraded Findings

**Refuted in this synthesis (dropped):**

| ID | Claim | Reason |
|----|-------|--------|
| V17 | Gateway refresh drops `iteration_start` writer rows | `iteration_start` is not a canonical row (`runtime/references/state-format.md:153`); 003's log holds all 26 iteration rows |
| V33 | check-goal corpus and packet modes disagree on a budget finding | Absent at HEAD (both modes report 0); moved to needs-confirmation |
| V52 | Git setup check PASSes a repo with nothing installed | The global `core.hooksPath` is a documented accepted install (`git-setup-check.cjs:350-353`) and the hooks do run; residual P2: the PASS should name the machine-wide source |
| V59 | commit-msg hook and `validate-message --explain` resolve different contracts | Both resolve `.skilled/skills/sk-git/assets` (`message-contract-gate.sh:78`, `message-contract.mjs:300`) |
| V60 | Canonical agent root is ambiguous and mirror-only Claude agents escape the gate | Claude is the deliberate source for Cursor and Devin (`sync-runtime-mirrors.cjs:37`); CI catches mirror-only files (`agent-mirror-sync.yml:69-74`); `Explore` is allowlisted (`check-agent-mirror-sync.cjs:39`) |

**Severity overrides by the lead against Luna:**

- V01 stays P0: Luna marked it CHANGED to P1 because its sandbox could not start OpenCode. The lead ran `opencode run --pure -m opencode-go/deepseek-v4.1-flash ...` in a temp dir: exit 1, `Unrecognized flag: --pure in command opencode run`.
- V54 stays P1 (Luna proposed P2 because Pi's `code.md` body matches today): the required opencode arm reads the canonical file through a symlink and codex is optional, so the gate cannot catch drift in 5 of 7 trees; today's match does not repair the gate.
- V24 stays P1 (Luna proposed P2): writes escaped a packet whose spec forbids any write outside it and were not reverted; the `package_skill.py` default is documented, but the containment gap is not.

**Downgrades carried from the child orchestrators** (already applied in the children, kept here): 001 `f-iter017-001` P0 to P1, `f-iter009-001`, `f-iter018-002`, `f-iter019-003`, `f-iter019-006`, `f-iter020-002` to P2, `f-iter016-005` refuted (path collision, not drift); 002 retraction `f-iter011-001` rejected; 003 D-11 (four claimed P0s to P1; B3 later restored to P0 by D-15), B4 falsified (council has a dispatch runtime), B6 and U6 to P2; 004 D-11 and D-18 (plugin suite red only under `AI_SESSION_CHILD`, doctor-bridge order follows the lead-phrase rule, child-session quiet is deliberate, Claude and Codex use the native goal command, Python front door reaches no operator, "181 adapters" not reproducible); 005 `f-iter015-007`, `f-iter016-001`, `f-iter006-003` refuted (symlinked parent directories, not duplicates), `f-iter021-003` to P2.

**Downgraded by Luna and accepted:** V05, V06, V15, V23, V30, V34, V42, V55, V57, V58, V62, V63, V64, V65 (reasons in section 3).
