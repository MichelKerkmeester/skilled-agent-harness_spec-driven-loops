---
title: "Research: is the root README still accurate after v4.0.0.4"
description: "Orchestrator-checked synthesis of a ten-iteration deep-research run on cli-devin with DeepSeek V4.1 Flash max: the root README and twelve related READMEs carry stale counts, a stale ClickUp setup line and three gate lists that predate v4.0.0.4, each with the smallest wording fix."
trigger_phrases:
  - "readme freshness research"
  - "root readme stale after v4.0.0.4"
  - "readme fix list"
importance_tier: "important"
contextType: "research"
---

# Research: is the root README still accurate after v4.0.0.4

<!-- ANCHOR:research-summary -->
## 1. Executive Summary

The root `README.md` install path holds after v4.0.0.4: Node 24, the spec-kit build step, the advisor build order, `skilled.trustRepoHooks` and the seven-runtime First Use section all match the release note and the tree. What went stale is narrower. The ClickUp lines still name API keys that v4.0.0.4 removed and a capability list the hosted server does not have. Five counts still describe the tree before v4.0.0.4 retired an agent and two commands: 12 agents (11 on disk), 39 command entry points (37), 42 validation rules (41), two warn-only rules (seven) and 19 doctor workflows (20).

In the related READMEs, three v4.0.0.4 changes did not reach the docs that describe them. The advisor README lists six `advisor_recommend` options and omits the new `surfaceHint`. The git-hooks README summary still says nine pre-commit sub-gates, while its own table says ten. The `.skilled/bin/README.md` tree omits `check-agent-mirror-sync.cjs`, the checker's new home. Five hub README versions fail or warn on the parent-skill doctor's README check, and that check contradicts the per-doc version rule. That conflict needs an operator decision before anyone edits the five lines.

Section 11 ranks 28 fixes, F1 to F28, grouped per README. Each one is a word, number or clause change, with no restructure.
<!-- /ANCHOR:research-summary -->

---

## 2. Scope and Method

- Under test: the root `README.md` (1,600 lines) against every section of `.skilled/changelog/skilled/v4.0.0.4.md` (452 lines), then the related READMEs.
- Related set, built by iteration 1 from links and grep, not from the topic's examples: the READMEs the root README links (`.skilled/scripts/git-hooks/README.md`, `.skilled/skills/system-spec-kit/README.md`, `.skilled/skills/system-deep-loop/README.md` and its `runtime/README.md`, `.skilled/skills/system-skill-advisor/README.md`, `.skilled/hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/README.md`, `.skilled/scripts/README.md`), the hub READMEs (`sk-doc`, `sk-code`, `sk-git`, `cli-external-orchestration` and its `cli-pi` mode), the install guides (`mcp-code-mode/INSTALL-GUIDE.md`, `system-skill-advisor/INSTALL-GUIDE.md`) and `.skilled/bin/README.md` with `.skilled/bin/lib/README.md`.
- `.skilled/README.md`, named in the topic as an example, does not exist (`test -e .skilled/README.md` exits 1). It was dropped from the set.
- Each iteration recorded rows as README path:line, claim, evidence, class and severity. Iteration 10 re-opened every flagged row. The orchestrator then re-ran the decisive probes itself (Section 3) before any row reached Section 11.

---

## 3. Run and Verification Provenance

- Executor: `cli-devin`, model `deepseek-v4-1-flash-max` (DeepSeek V4.1 Flash at max effort; cli-devin has no reasoning-effort flag, so the effort lives in the model id). All ten `dispatch-receipts/*.completion.json` files record `devin -p <prompt> --model deepseek-v4-1-flash-max --permission-mode dangerous --respect-workspace-trust false`. Devin does not report which upstream host serves the model.
- Ten iterations, every one `verify-iteration.cjs` exit 0 on its first dispatch, no redispatch. Each verify printed a warning that the route proof came from the delta file, as in the 020 precedent runs.
- Dispatch wall time per iteration: 235, 225, 207, 187, 292, 265, 184, 349, 214 and 399 seconds.
- Write containment: no out-of-scope path after any dispatch. `git status` showed changes only under this packet.
- Orchestrator re-checks (commands run from the repository root, outputs read):
  - `ls .skilled/agents/*.md`: 11 agents.
  - `find .skilled/commands -name '*.md'` without assets, legacy, compiled and README: 34 across six groups plus 3 root, 37 in all.
  - `validator-registry.json`: 41 rules; severities 32 error, 7 warn, 2 info.
  - `ls .skilled/commands/doctor/assets/*.yaml`: 21 files, 20 with `operating_mode`.
  - The ClickUp catalog total is 111 (`feature-catalog.md:28`) and the playbook total is 35 scenarios (`manual-testing-playbook.md:45`).
  - `skill-advisor.cjs list-tools`: `advisor_recommend` options are `topK`, `includeAttribution`, `includeAbstainReasons`, `confidenceThreshold`, `uncertaintyThreshold`, `includeCompiledRoute` and `surfaceHint`.
  - `parent-skill-check.cjs` on five hubs: check 13c FAILs on system-spec-kit, system-skill-advisor and sk-git, and WARNs on sk-doc and system-deep-loop.
  - `grep -o 'SPECKIT_SKIP_[A-Z_]*' pre-commit`: nine bypass flags.

---

## 4. Research Questions and Answers

| Question | Answer |
|----------|--------|
| Q1 related READMEs | The set in Section 2: 8 linked READMEs, 6 hub or mode READMEs, 2 install guides and 2 `.skilled/bin` READMEs. `.skilled/README.md` does not exist |
| Q2 install and first use | Accurate. Every install, prerequisite and First Use line checked matches v4.0.0.4 (Section 10) |
| Q3 root README features | Mostly accurate. The stale lines are the ClickUp lines and five counts (F1 to F11) |
| Q4 related READMEs | Fourteen content rows (F12 to F23) and five version rows under a contract conflict (F24 to F28) |
| Q5 missing changes | `surfaceHint` (F12), the skill-authoring sub-gate (F13) and the mirror checker's new home (F15) are the v4.0.0.4 changes missing where a reader would look. The unknown-option refusal is not implicated: its scope (`v4.0.0.4.md:281`) names no README-documented script |

---

## 5. Root README: Install and First Use (Q2)

`README.md:160` asks for Node 24 and names each part's floor, matching `v4.0.0.4.md:405` and `:444`. Steps 3 to 5 (`README.md:172`, `:175`, `:181`) carry the build-the-workspace step, the advisor build order and `skilled.trustRepoHooks`, matching `v4.0.0.4.md:405`. `README.md:218` names all seven runtimes. No install-path fix is needed.

---

## 6. Root README: Features (Q3)

The deep-loop section already says three loop families (`README.md:562`), and no line names a retired mode. The counts around it did not follow. v4.0.0.4 retired the agent-improvement agent and its two commands (`v4.0.0.4.md:149`), so the agent and command counts at `README.md:24`, `:66`, `:80`, `:933` and `:1074` are one and two high. The validation and doctor counts (`:421`, `:426`, `:1278`) drifted from the registry and asset folder they describe. The ClickUp lines (`:881`, `:1435`) predate the move to the hosted OAuth server (`v4.0.0.4.md:38`, `:421`).

---

## 7. Related READMEs (Q4)

The three rows tied to v4.0.0.4 changes are F12 (`surfaceHint`, `v4.0.0.4.md:357`), F13 (the staged-skill sub-gate, `v4.0.0.4.md:121`) and F15 (`check-agent-mirror-sync.cjs`, `v4.0.0.4.md:159`). The rest are older drift that this pass found: tree listings, counts and one wrong probe command. `.skilled/hooks/README.md:177` and the spec-kit hooks README already document the stdin deadline, and the git-hooks README already documents the mirror check's exit-3 skip.

---

## 8. The Hub README Version Conflict

`frontmatter-versioning.md:30` says every doc other than `SKILL.md`, READMEs included, carries its own edition, raised at commit (`v4.0.0.4.md:387-393`). `parent-skill-check.cjs:1806-1819` (check 13c) says a hub README that declares a version is the release's front page, so it must carry the `SKILL.md` version. Drift soft-fails, except on four hubs where it only warns. Both cannot hold. Under the first rule, F24 to F28 are not findings. Under the second rule, they are, and the doc version bump hook will reopen them on the next README body edit. This is a LOGIC-SYNC question for the operator, so F24 to F28 are listed with the doctor's fix and marked as blocked on that decision.

---

## 9. Corrections to Executor Claims

| Executor claim | What the orchestrator found |
|----------------|-----------------------------|
| `cli-external-orchestration/README.md:94` duplicates `:93` (iteration 10) | False: line 93 is blank and the Guard Rails list has four bullets, matching "Four behaviors". Only the `hermes status` probe is wrong (F14) |
| ClickUp playbook has 42 scenarios (iteration 5) or 61 sections (iteration 10) | 35 scenarios, from the playbook's own total at `manual-testing-playbook.md:45` |
| sk-git playbook: change 38 to 39 (iteration 7) | The playbook has 9 categories, 46 scenario files, and its own category lines sum to 50. The number is not settled, so F18 fixes the category count and drops the scenario number |
| `.skilled/bin/README.md:172-178` should state unknown-option refusal (iteration 6) | Not confirmed. The exit taxonomy already names exit 64 for usage errors. Dropped |
| `spec/README.md` missing (iteration 1) | Resolved by iteration 10: the README the release note names is `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` |
| Hub README versions STALE (iterations 7 and 8) | Real per check 13c, contested per the per-doc version rule (Section 8) |
| Iteration 8 cites `cli-devin/SKILL.md` line 1213 and `validate_document.py` line 3303 | Both lines are past the end of their files (`SOURCE_TAGS` warning). Neither row depends on them: F14 rests on `cli-hermes/SKILL.md:47`, and the sk-doc `:134` OK-VERIFIED row rests on the 13 files in `.skilled/commands/create/` that the orchestrator counted |

---

## 10. OK-VERIFIED

Checked and found accurate. The orchestrator re-read the lines marked (o). The rest carry executor evidence from the iteration named.

- `README.md:160` Node 24 and per-part floors (o); `:172`, `:175`, `:181` install steps 3 to 5 (o); `:199` pre-commit phrase lint (o); `:218` seven runtimes (o); `:562` three loop families (o); `:776` 14 skills (o, `ls -d .skilled/skills/*/` prints 14); `:878` mcp-tooling nine modes (o); `:893` 29 chart forms (o); `:902` sk-doc fifteen modes across fourteen packets (o); `:1264` unknown-flag refusal on doctor sub-actions (o); `:1269` `compat` moves a v3 checkout (o); `:1336` `clickup_official` OAuth line (o); `:1596-1597` catalog and playbook links (iteration 1).
- `README.md:161-162`, `:166`, `:188-192`, `:205`, `:210`, `:241`, `:325`, `:414`, `:425`, `:445`, `:630`, `:639`, `:648`, `:669`, `:1025`, `:1598` (iterations 1 to 5, re-listed by iteration 10).
- `.skilled/scripts/git-hooks/README.md:110` ten sub-gates (o); `.skilled/hooks/README.md:177` stdin reader and deadline (o); `.skilled/skills/system-spec-kit/README.md:63` 41-rule registry (iteration 10); `.skilled/skills/sk-git/README.md:60` 17 state-gated rules (iteration 7); `.skilled/skills/sk-code/README.md:23`, `:38`, `:51`, `:106` three surfaces (iteration 8); `.skilled/skills/cli-external-orchestration/README.md:88` seven-mode tieBreak (o); `.skilled/skills/cli-external-orchestration/cli-pi/README.md:10`, `:34` (iteration 8); `.skilled/skills/sk-doc/README.md:134`, `:191`, `:193` (iteration 8); `.skilled/skills/system-deep-loop/runtime/README.md:15` three modes (iteration 9); `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:12` Node 24 (o); `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:9` nine commands (iteration 6).

---

## 11. Recommendations

Ranked fix list, grouped per README, F1 matters most. Columns: fix, README path:line, claim as written, evidence, class, severity, proposed replacement or addition. Each fix is the smallest correct wording change (`.skilled/repo-rules/prevent-overengineering.md`).

### Root `README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F1 | README.md:1435 | `mcp-click-up` (... cupt CLI + official MCP, requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`) | .skilled/changelog/skilled/v4.0.0.4.md:38 and :421 (key lines left `.env.example`, unused); .env.example:48 ("ClickUp needs no key here"); README.md:1336 (no env var, one OAuth approval); mcp-click-up/INSTALL-GUIDE.md:117-126 (`cupt auth` or a `pk_` token) | STALE | P1 | Replace "requires `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID`" with "cupt signs in with `cupt auth` or a `pk_` token, the MCP with one OAuth approval" |
| F2 | README.md:881 | official ClickUp MCP (documents, goals, bulk ops, webhooks) ... 96-feature catalog + 37-scenario playbook included | mcp-click-up/SKILL.md:12 (MCP handles task creation, documents, search, lists and folders, task relations, chat and reminders; goals, bulk create, webhooks have no route); mcp-click-up/feature-catalog/feature-catalog.md:28 (111); mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:45 (35 scenarios) | STALE | P1 | "(documents, goals, bulk ops, webhooks)" to "(task creation, documents, search, chat and reminders)"; "96-feature catalog + 37-scenario playbook" to "111-feature catalog + 35-scenario playbook" |
| F3 | README.md:24 | 12 Specialized Agents | `ls .skilled/agents/*.md` prints 11; .skilled/changelog/skilled/v4.0.0.4.md:149 (the agent-improvement agent left every runtime) | STALE | P1 | "12 Specialized Agents" to "11 Specialized Agents" |
| F4 | README.md:66 | Twelve specialized agents own focused roles | Same as F3 | STALE | P1 | "Twelve" to "Eleven" |
| F5 | README.md:933 | 12 custom specialist agents | Same as F3 | STALE | P1 | "12" to "11" |
| F6 | README.md:80 | 14 on-demand skills, 39 command entry points | `find .skilled/commands -name '*.md'` without assets, legacy, compiled and README: 34 in six groups plus 3 root; .skilled/changelog/skilled/v4.0.0.4.md:149 (two commands removed) | STALE | P1 | "39 command entry points" to "37 command entry points" |
| F7 | README.md:1074 | 39 command entry points: 36 across 6 command groups plus 3 root utilities | Same as F6 (create 13, deep 3, design 3, doctor 8, prompt 1, speckit 6) | STALE | P1 | "39 command entry points: 36 across 6" to "37 command entry points: 34 across 6" |
| F8 | README.md:421 | `validate.sh` runs 42 rules ... Two of them only warn and never fail a run | .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1 holds 41 rules, 7 with severity warn (FRONTMATTER_VALUES, SOURCE_TAGS, GRAPH_METADATA_PRESENT, GRAPH_METADATA_CHILD_DRIFT, GRAPH_METADATA_SHAPE, DESCRIPTION_SHAPE, LINKS_VALID); .skilled/skills/system-spec-kit/README.md:63 says 41 | STALE | P2 | "runs 42 rules" to "runs 41 rules"; "Two of them only warn" to "Seven of them only warn, among them" |
| F9 | README.md:426 | run 42 validation rules | Same as F8 | STALE | P2 | "42" to "41" |
| F10 | README.md:1278 | The 19 underlying YAML workflows in `.skilled/commands/doctor/assets/` ... Each declares its own `role/purpose/action/operating_mode` block | `ls .skilled/commands/doctor/assets/*.yaml` prints 21; all but `mcp-mutation-class-manifest.yaml` declare `operating_mode` | STALE | P2 | "The 19 underlying YAML workflows" to "The 20 underlying YAML workflows" |
| F11 | README.md:933 | mirrored for Claude Code (`.claude/agents/`) | `.codex/agents`, `.cursor/agents`, `.devin/agents` and `.pi/agents` hold 11 agent files each; `.hermes/agents` links to `.skilled/agents` like `.opencode/agents` | MISSING | P2 | "mirrored for Claude Code (`.claude/agents/`)" to "mirrored for Claude Code, Codex, Cursor, Devin and Pi (`.<runtime>/agents/`)"; "OpenCode reads" to "OpenCode and Hermes read" |

### `.skilled/skills/system-skill-advisor/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F12 | .skilled/skills/system-skill-advisor/README.md:113 | `advisor_recommend` accepts six options: `topK` ... and `includeCompiledRoute` (same list in the table at :154) | `skill-advisor.cjs list-tools` lists seven option keys, the seventh `surfaceHint`; .skilled/changelog/skilled/v4.0.0.4.md:357; runtime/handlers/advisor-recommend.ts:364 | MISSING | P1 | "accepts six options" to "accepts seven options", and add "`surfaceHint` passes the caller's code surface (1 to 64 characters) to the compiled route" to the :113 list and `surfaceHint` to the :154 row |

### `.skilled/scripts/git-hooks/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F13 | .skilled/scripts/git-hooks/README.md:24 | `pre-commit` runs nine blocking sub-gates ... Eight carry their own bypass flag (diagram :44 and tree :73 say 8 blocking) | Its own table at .skilled/scripts/git-hooks/README.md:110 says ten, with skill authoring; `pre-commit` carries nine `SPECKIT_SKIP_*` flags; .skilled/changelog/skilled/v4.0.0.4.md:121 | STALE | P1 | :24 "nine blocking sub-gates: comment hygiene, agent-mirror sync, mirror parity," to "ten blocking sub-gates: comment hygiene, agent-mirror sync, mirror parity, skill authoring,", and "Eight carry" to "Nine carry"; :44 and :73 "8 blocking" to "10 blocking" |

### `.skilled/skills/cli-external-orchestration/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F14 | .skilled/skills/cli-external-orchestration/README.md:94 | `cli-hermes` also reads `hermes status` for a configured provider | .skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:47 (`hermes status` is not the probe) and :63 | WRONG | P2 | "reads `hermes status`" to "reads `hermes config get providers.llmgateway.base_url`" |

### `.skilled/bin/README.md` and `.skilled/bin/lib/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F15 | .skilled/bin/README.md:63 | `bin/` directory tree, without `check-agent-mirror-sync.cjs` | `ls .skilled/bin` lists it; .skilled/changelog/skilled/v4.0.0.4.md:159 (the checker's new home) | MISSING | P2 | Add the tree line "+-- check-agent-mirror-sync.cjs    # Checks each runtime's agent mirrors against .skilled/agents" |
| F16 | .skilled/bin/lib/README.md:93 | All three modules depend only on Node core | The key-files table above it lists four modules | WRONG | P2 | "All three modules" to "All four modules" |
| F17 | .skilled/bin/lib/README.md:65 | `lib/` directory tree | `ls .skilled/bin/lib` also lists `compiled-route-admission.cjs`, `mirror-sync-verify.cjs` and `node-engine-resolver.cjs` with its test | MISSING | P2 | Add one tree line for each of the three modules |

### `.skilled/skills/system-spec-kit/README.md` and its `runtime/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F18 | .skilled/skills/system-spec-kit/README.md:49 | Node.js 20.11 or newer | .skilled/skills/system-spec-kit/runtime/cli/package.json:8 needs `>=22.12.0`; README.md:160 and .skilled/changelog/skilled/v4.0.0.4.md:405 (the spec-kit CLI needs 22.12, Node 24 for a full install) | STALE | P2 | "Node.js 20.11 or newer" to "Node.js 22.12 or newer (Node 24 for a full install)" |
| F19 | .skilled/skills/system-spec-kit/runtime/README.md:26 | per-runtime adapters for Claude, Codex, Cursor, Devin, and Pi | `ls .skilled/skills/system-spec-kit/runtime/hooks/` also lists `opencode/` | MISSING | P2 | "Claude, Codex, Cursor, Devin, and Pi" to "Claude, Codex, Cursor, Devin, OpenCode, and Pi" |

### `.skilled/skills/sk-git/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F20 | .skilled/skills/sk-git/README.md:204 | 38 manual scenarios across 8 categories (8 categories also at :267 and :288) | The playbook's own sections at manual-testing-playbook.md:167-837 name 9 categories; its scenario counts disagree with each other (46 files, category lines summing to 50) | STALE | P2 | :204 "38 manual scenarios across 8 categories" to "manual scenarios across 9 categories"; :267 and :288 "8 categories" to "9 categories" |

### `.skilled/skills/sk-doc/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F21 | .skilled/skills/sk-doc/README.md:220 | twenty-one forms across six families | .skilled/skills/sk-design/sk-design-chart/SKILL.md:137 (Twenty-nine chart forms); README.md:893 (29 catalog forms) | STALE | P2 | "twenty-one forms" to "twenty-nine forms" |

### `.skilled/skills/mcp-code-mode/INSTALL-GUIDE.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F22 | .skilled/skills/mcp-code-mode/INSTALL-GUIDE.md:11 | Version: 2.0.0 | The frontmatter at INSTALL-GUIDE.md:4 says `version: 1.0.0.0`, added when v4.0.0.4 gave install guides frontmatter (.skilled/changelog/skilled/v4.0.0.4.md:389) | WRONG | P2 | Delete the "> **Version:** 2.0.0" line; the frontmatter version is the doc's edition |

### `.skilled/skills/system-deep-loop/runtime/README.md`

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F23 | .skilled/skills/system-deep-loop/runtime/README.md:24 | `runtime/` tree without `changelog/` | `ls .skilled/skills/system-deep-loop/runtime/` lists `changelog/` | MISSING | P2 | Add the tree line "├── changelog/" |

### Hub README versions, blocked on the Section 8 decision

| F | README path:line | Claim | Evidence | Class | Severity | Fix |
|---|------------------|-------|----------|-------|----------|-----|
| F24 | .skilled/skills/system-spec-kit/README.md:13 | version: 2.7.0.99 | `parent-skill-check.cjs` 13c FAIL: SKILL.md carries 2.7.13.0 (.skilled/commands/doctor/scripts/parent-skill-check.cjs:1806); contested by frontmatter-versioning.md:30 | STALE | P1 | If check 13c stands: `version: 2.7.13.0`. If the per-doc rule stands: no README edit; amend check 13c instead |
| F25 | .skilled/skills/system-skill-advisor/README.md:10 | version: 0.12.0.54 | 13c FAIL: SKILL.md carries 0.15.6.0 (parent-skill-check.cjs:1806); contested as F24 | STALE | P1 | If check 13c stands: `version: 0.15.6.0` |
| F26 | .skilled/skills/sk-git/README.md:11 | version: 1.8.4.0 | 13c FAIL: SKILL.md carries 1.8.5.0 (parent-skill-check.cjs:1806); contested as F24 | STALE | P1 | If check 13c stands: `version: 1.8.5.0` |
| F27 | .skilled/skills/sk-doc/README.md:22 | version: 2.3.4.0 | 13c WARN (warn-only hub, parent-skill-check.cjs:1804): SKILL.md carries 2.3.9.0 | STALE | P2 | If check 13c stands: `version: 2.3.9.0` |
| F28 | .skilled/skills/system-deep-loop/README.md:9 | version: 1.6.1.0 | 13c WARN (warn-only hub, parent-skill-check.cjs:1804): SKILL.md carries 1.6.3.0 | STALE | P2 | If check 13c stands: `version: 1.6.3.0` |

---

## Eliminated Alternatives

- Restructuring the root README's count lines into a generated block: rejected under `prevent-overengineering.md`. Five number edits fix the drift today, and nothing in this run measured how often the counts drift.
- Treating `.skilled/README.md` as a related README: the file does not exist.
- Adding unknown-option wording to `.skilled/bin/README.md`: the exit taxonomy already covers usage errors (exit 64), and no reader gap was shown.

---

## Divergence Map

- Saturated directions: none recorded by the reducer.
- Pivots taken: none; the orchestrator assigned one slice per iteration (Section 15).
- Pivot failures and audited overrides: none.
- Remaining frontier: the ClickUp packet's own README and catalogs, `sk-design` and `mcp-tooling` hub READMEs, and READMEs below mode packets other than `cli-pi`, all outside the link-and-grep set.

---

## 12. Open Questions

- Which version rule governs hub READMEs: `frontmatter-versioning.md:30` (own edition) or `parent-skill-check.cjs:1806-1819` (the `SKILL.md` version)? F24 to F28 wait on it.
- How many scenarios does the sk-git playbook hold? Its files (46) and its category lines (50) disagree, so F20 drops the number.

---

## 13. Lineage Disagreements and How They Were Settled

One lineage ran, so there were no cross-lineage disagreements. Within it, iterations 7 and 10 disagreed on `.skilled/skills/system-spec-kit/README.md:49`. The orchestrator settled that row as F18 from `runtime/cli/package.json:8`: the workspace floor of 20.11 is real, but the CLI a reader runs needs 22.12. Section 9 lists the executor claims that the orchestrator corrected.

---

## 14. Evidence Limits and Confidence

- High confidence: F1 to F17, F19, F21 and F23. The orchestrator re-ran each count or re-read each line.
- Medium: F18, because the README may mean the workspace package, which does accept 20.11. F20, because the scenario number is unresolved. F22, because "2.0.0" might name a package version rather than the guide's.
- Blocked: F24 to F28 (Section 8).
- Not checked: README body prose outside the claims the iterations flagged or listed as OK-VERIFIED. The Remaining frontier in the Divergence Map was also not checked.

---

## 15. Proposed Implementation Phases

1. The operator decides the Section 8 version rule.
2. One fix phase applies F1 to F23 as wording edits. The commit hook raises each changed doc's version.
3. If check 13c stands, the same phase applies F24 to F28. If not, check 13c is amended in its own phase.

Iteration slices used by this run: 1 inventory and section map; 2 install and first use; 3 to 5 root README features; 6 `.skilled/bin` and install guides; 7 system-spec-kit, system-skill-advisor and sk-git; 8 sk-doc, sk-code, system-deep-loop and cli-pi; 9 missing changes and the remaining inventory; 10 adversarial re-verification.

---

## 16. Convergence Report

- Stop reason: maxIterationsReached (stop policy `max-iterations`; convergence was telemetry only).
- Total iterations: 10.
- Questions answered: 5 / 5. Remaining questions: 0.
- newInfoRatio by iteration: 0.65, 0.75, 0.83, 0.60, 0.74, 0.69, 0.77, 0.70, 0.71, 0.25.
- Last 3 iteration summaries: run 8 checked the sk-doc, sk-code, system-deep-loop and cli-pi READMEs; run 9 checked the missing changes and the rest of the inventory; run 10 re-verified every flagged row and compiled the OK-VERIFIED list.
- Convergence threshold: 0.05.
- Divergence summary: no divergent pivots recorded.

---

## 17. References

- `.skilled/changelog/skilled/v4.0.0.4.md`
- `README.md`
- `research/iterations/iteration-001.md` to `iteration-010.md`, `research/deltas/`, `research/dispatch-receipts/`
- `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md`
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs`
- `.skilled/repo-rules/prevent-overengineering.md`
