# Deep Research Synthesis — v4 State Inventory (lineage `deepseek`)

- **Loop type:** research
- **Session:** fanout-deepseek-1788884019738-h5vslh
- **Executor:** cli-devin (deepseek-v4-flash-max)
- **Spec folder:** specs/system-speckit/033-system-speckit-v4/034-v4-state-inventory-research
- **Iterations:** 10 (angles 1-10, one per iteration, no repeats)
- **Stop reason:** `maxIterationsReached` (config.stopPolicy max-iterations, 10/10 run)
- **Convergence telemetry:** treated as telemetry only per the fan-out contract; all ten angles executed
- **Synthesis date:** 2026-09-08

---

## 1. COMPLETE INVENTORY BY HUB

### Skill roots (14 entries under `.opencode/skills/`: 6 hubs + 7 standalone + README.txt)

**Parent hubs (mode-registry.json + hub-router.json + description.json):**

| Hub | Modes (workflowMode; routingClass) | Count |
|---|---|---|
| cli-external-orchestration | cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi (all metadata) | 6 |
| mcp-tooling | mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools, mcp-figma, mcp-refero, mcp-mobbin, mcp-obsidian, mcp-notion, mcp-magicpath (all metadata) | 9 |
| sk-code | sk-code-quality, sk-code-review, sk-code-webflow, sk-code-opencode, sk-code-mobile-cli, sk-code-obsidian (all metadata) | 6 |
| sk-design | sk-design-fundamentals, sk-design-md-generator, sk-design-diagram, sk-design-chart (all metadata) | 4 |
| sk-doc | sk-create-skill, sk-create-skill-parent, sk-create-readme, sk-create-agent, sk-create-command, sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-benchmark, sk-create-changelog, sk-create-diff, sk-create-frontmatter, sk-create-quality-control, sk-create-repo-rule, sk-create-with-human-voice (all metadata) | 14 |
| system-deep-loop | research (lexical), review (lexical), ai-council (lexical), agent-improvement (alias-fold), model-benchmark (command-bridge), skill-benchmark (command-bridge) | 6 |

**Standalone skills:** mcp-code-mode, sk-communication, sk-git, sk-prompt (v3.0.0.0, single leaf), sk-vision, system-skill-advisor, system-spec-kit.

**Notable:** sk-doc has 14 registry modes but only 13 leaf dirs (sk-create-skill-parent tooling lives inside sk-create-skill/references/parent-skill/). sk-prompt is standalone — it is NOT the two-mode hub the draft describes.

### Commands (9 families + 3 top-level files = 37 markdown commands)

- `/speckit:*` (6): complete, implement, plan, resume, save, search — search is the trigger-index + ripgrep retrieval front door
- `/deep:*` (6): research, review, ai-council, agent-improvement, model-benchmark, skill-benchmark
- `/create:*` (12): agent, benchmark, changelog, command, diff, feature-catalog, manual-testing-playbook, readme, repo-rule, skill-parent, skill, with-human-voice
- `/design:*` (3): chart, diagram, extract
- `/doctor:*` (3): mcp, speckit, update
- `/prompt:*` (1): improve
- `/rewrite:*` (3): explain-visually, response-by-external-agent, response
- Top-level: goal-opencode, vision, agent-router

### Agents (12)

ai-council, code, context, debug, deep-improvement, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, review. No deep/deep-loop/deep-router agent (retired).

### Hooks (21 concern dirs, 102 symlinks)

codex-watchdog, completion, directive-lifecycle, dispatch, dist-freshness, git, git-hooks-check, git-preflight, git-primary-reconcile, git-worktree-guard, goal (opencode/cursor/pi — no devin), hook-install, mcp-route-guard, permission-policy, post-edit-quality, session-cleanup, session-lifecycle, sk-vision, skill-advisor, spec-gate, task-dispatch.

### Runtime mirrors

.claude, .codex, .cursor, .devin, .pi — all SYNC.md-managed, symlink-onto-canonical (only .devin/hooks.v1.json authored locally); Devin carries no mirrored command surface; each mirrors agents (+ commands for claude/cursor, hooks everywhere, mcp.json/config).

### CI (15 workflows)

advisory-checks, agent-mirror-sync, changed-packet-validation, command-tree-parity, comment-hygiene, markdown-link-integrity, naming-standard-guard, playbook-operator-contract, prompt-card-sync, routing-registry-drift, rule-canary-sync, runtime-no-spec-import, skill-doc-frontmatter, spec-kit-check (with mirrors-parity job), strict-pass-freshness-report.

### Key runtime surfaces

- **system-spec-kit:** runtime/cli/{spec,continuity,spec-folder,retrieval,validation,rules}; 39 check-* validation rules; core templates 1,275 lines (spec 427, plan 411, tasks 283, impl-summary 154); 10 addons incl. acceptance-criteria.md.tmpl + goal.md.tmpl; trigger index at runtime/data/trigger-index.json; retrieval lane = lookup-trigger-index.mjs + rg-wrapper.mjs + sweep-memory-residue.mjs; shared package with gate-3-classifier.ts.
- **system-deep-loop:** 7 ledger modes (deep-research, deep-review, deep-ai-council, agent-improvement, model-benchmark, skill-benchmark, deep-improvement-common); executor allowlists — PI (default deepseek-v4-flash-vision-exp), CURSOR (default composer-2.5, `auto` excluded), DEVIN (default swe); cli-claude-code kind reserved-but-unwired (ExecutorNotWiredError); fan-out manifests (models/branches/replicas, concurrency ≤ 8, stopPolicy rejected in fan-out config).
- **system-skill-advisor:** MCP server system_skill_advisor v0.1.0; CLI .opencode/bin/skill-advisor.cjs; defaults confidence 0.8 / uncertainty 0.35; route-exclusions.json denylist; daemon + freshness feature catalog.
- **sk-git:** worktree grammar `worktrees/NNN-slug` / `branches/NNN-slug` (owner-first REJECTED), skilled/v* release lane, wrapper/backup lanes, remote-branch-allowlist.txt, git-preflight-advisory.mjs hook.
- **sk-design:** 4 modes; styles corpus 135M (database + library) under sk-design-md-generator/styles/.

---

## 2. RANKED DRIFT TABLE (across all ten angles; P0 first, then P1 by section)

| # | Draft claim | Verdict | Severity | Actual state | SOURCE |
|---|---|---|---|---|---|
| 1 | "memory_search, memory_save ... behave as before" (L11) | FALSE | P0 | Memory DB decommissioned; /speckit:search is the retrieval front door; retrieval is lexical (trigger-index + ripgrep) | iteration-002 |
| 2 | "the Spec-Kit Memory engine ... retrieval-shape axis ... BM25/FTS fallback ... bi-temporal edges" (L69-74) | STALE | P0 | Memory engine gone; no embedder/FTS in the retrieval lane | iteration-002 |
| 3 | "a set of /interface: commands" / "nine-stage contract under /interface:*" (L11, L266) | FALSE | P0 | /interface:* deprecated (commit 4ac89951ca1); /design:{chart,diagram,extract} today | iteration-009 |
| 4 | "joined by a new alignment (conformance-audit) mode" (L21, L155) | FALSE | P0 | No alignment mode/command/ledger-schema/adapters anywhere on the branch | iteration-003 |
| 5 | "/create:diagram ... 27 types" (L26, L126) | FALSE | P0 | No sk-create-diagram leaf; no /create:diagram; diagram is /design:diagram (chart catalog: 26 forms) | iteration-005 |
| 6 | "sk-prompt ... two modes over one shared structure" + "sk-prompt-models is a mode now" (L345, L361, L440) | FALSE | P0 | sk-prompt is standalone v3.0.0.0, single leaf; zero prompt-models artifacts | iteration-001/007 |
| 7 | "any of the six external CLIs — ... cli-claude-code" (L163) | FALSE | P1 | cli-claude-code reserved in schema but throws ExecutorNotWiredError; 5 wired CLI executors | iteration-003 |
| 8 | "all eight modes ... now on new_authoritative_final" (L180) | STALE | P1 | Seven ledger modes; alignment absent | iteration-003 |
| 9 | "Seven hubs" (L7, L40) | STALE | P1 | Six hubs; sk-prompt standalone | iteration-001 |
| 10 | "the quality packet is sk-create-quality-control (with /doc:quality kept as an alias)" (L118) | FALSE | P1 | Leaf exists; /doc:quality alias and command file gone | iteration-005 |
| 11 | "/prompt is now /prompt-improve" (L345) | FALSE | P1 | Command is /prompt:improve | iteration-001 |
| 12 | "New branches use the owner-first form `<skill>/{NNNN}-{slug}`" (L333, L443) | STALE | P1 | Grammar is worktrees/NNN-slug or branches/NNN-slug; owner-first names are explicitly rejected | iteration-007 |
| 13 | "the GitKraken MCP was wired in" (L335) | FALSE | P1 | Zero gitkraken references in skills/commands | iteration-007 |
| 14 | "Pi subagent dispatch uses pi-subagents" (L232) | STALE | P1 | pi-subagents directive + injector hook removed (commit 1f382f64a49); native subagents by absence | iteration-009/010 |
| 15 | "the deep router agent is now deep-loop" (L441) | STALE | P1 | Router agent retired; no deep-loop agent exists | iteration-009 |
| 16 | "sk-code ... webflow and opencode surfaces" (L290-291) | STALE | P1 | 6 modes: + sk-code-mobile-cli, sk-code-obsidian surfaces added since draft | iteration-007 |
| 17 | "core template source 2,931 → 1,314 lines" (L86) | STALE | P2 | 1,275 lines today (further reduction); direction holds | iteration-002 |
| 18 | "around ninety-six hook symlinks" (L246) | STALE | P2 | 102 symlinks | iteration-008 |
| 19 | "129 MB across 7,744 files" (L260) | STALE | P2 | styles/ = 135M; exact counts unverified | iteration-007 |
| 20 | "benchmark/reports dated grammar" (L139) | MISSING | P2 | No root benchmark/ tree; runner moved under system-deep-loop | iteration-010 |
| 21 | "run-skill-benchmark.cjs exits with code 3" (L139) | UNVERIFIED | P2 | Moved path; visible exits 1/2/propagated | iteration-005 |
| 22 | "level 1 research doc 175 lines instead of 944" (L86) | TRUE (gated) | P2 | research.md.tmpl 946 lines with IF-level gating; rendered size not executable here | iteration-002 |

TRUE rows worth keeping (not drift): specs/ symlink compat, kebab-case guard, @markdown agent, create:skill/readme renames, cli-gemini/cli-copilot removed, Open Design retired, mcp-figma nested path, goals per-workspace + goal hooks for opencode/cursor/pi (devin absent), hooks assembled by symlink, hook-flags.env mechanics, Gate-3 quiet on read-only, pi roster incl. DeepSeek V4 Flash, executor binary gates, upgrading-a-skill-to-v4.md, push curation (allowlist + pre-push), deep-loop-workflows/runtime merged.

---

## 3. UPGRADE-NOTES CANDIDATE LIST (confirmed by code)

1. **Memory commands are gone.** `memory_search` / `memory_save` do not exist; use `/speckit:search` (trigger-index + ripgrep). Memory DB, spec-memory MCP server and their daemon are decommissioned; retrieval is lexical.
2. **Design commands moved and renamed.** `/interface:*` family is deprecated (commit 4ac89951ca1); use `/design:chart`, `/design:diagram`, `/design:extract` (extract was renamed from design-reference, commit 7ef698947aa).
3. **Runtime renamed and nested.** system-spec-kit's engine now lives at `.opencode/skills/system-spec-kit/runtime/cli/` (spec/validate.sh, spec/create.sh, spec/repair-derived.cjs, spec/recommend-level.sh, continuity/generate-context.ts, spec-folder/generate-description.ts); old `scripts/` and `mcp-server/` identities are gone (commits 0db44e44c02, 945ded30d94).
4. **sk-prompt is standalone, not a hub.** There is no prompt-models mode; the command is `/prompt:improve` (not `/prompt-improve`); agent `@prompt-improver`.
5. **No deep-alignment mode.** The draft's conformance-audit mode never shipped; deep-loop ledger modes are 7, not 8.
6. **cli-claude-code is not a dispatchable deep-loop executor.** The kind is reserved in executor-config.ts but unwired (ExecutorNotWiredError); the five wired kinds are cli-opencode, cli-codex, cli-cursor, cli-devin, cli-pi.
7. **Branch grammar is `worktrees/NNN-slug` / `branches/NNN-slug`.** Owner-first `<skill>/NNNN-slug` names are rejected by is_valid_branch; only `skilled/v*` release lanes keep the owner prefix.
8. **Pi's `pi-subagents` directive was removed** (commit 1f382f64a49); native subagents are the default by absence; name a `cli-*` mode to force an external executor.
9. **GitKraken MCP is not wired** on this branch (zero references); the draft's claim should be dropped.
10. **/create:diagram does not exist** — diagram authoring is `/design:diagram`; `/create:diff` does exist.
11. **/doc:quality alias is gone** — sk-create-quality-control is the leaf; no command file.
12. **Hook count is 102 symlinks across 21 concern dirs** (draft said ~96 / twenty).
13. **Template counts moved again** — core templates total 1,275 lines (draft: 1,314); research template is level-gated (946-line source).
14. **run-skill-benchmark.cjs moved** to `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/`; exit-code-3 behavior not visible in the current file.

---

## 4. DISAGREEMENTS FOR THE REPRODUCTION PASS

1. **README/registry contradiction — sk-prompt:** the changelog draft (and any README still echoing it) describes sk-prompt as a two-mode hub with per-model profiles; the registry/tree say standalone single leaf. The advisor's available-skills surface agrees with standalone. Reproduce: `ls .opencode/skills/sk-prompt/` (no mode-registry.json, no prompt-models/).
2. **Branch grammar prose vs code:** draft upgrade notes say owner-first grammar; `scripts/worktree-naming.sh` `is_valid_branch()` rejects owner-first. Reproduce: run the validators.
3. **Executor roster vs registry:** draft lists cli-claude-code as a first-class deep-loop executor; executor-config.ts raises ExecutorNotWiredError. Reproduce: dispatch test with kind cli-claude-code.
4. **Alignment claims:** draft's deep-alignment/conformance-audit paragraphs have no code or registry counterpart. Reproduce: rg "alignment" over .opencode/skills/system-deep-loop (zero hits outside changelog/benchmark).
5. **Hook counts:** draft "ninety-six" vs 102 symlinks; reproduce with `find .opencode/hooks -type l | wc -l`.
6. **Template line counts:** draft 1,314 vs measured 1,275; reproduce with `wc -l .opencode/skills/system-spec-kit/templates/core/*.tmpl`.
7. **Unverifiable-by-contract claims** (reproduce with execution the lineage could not do): router "13/13" and "44→71" benchmarks, 128-file repoint, 175-line Level-1 research output, mass-delete threshold 100, Codex ABI-141 launch, Refero 1,290/7,744 counts, 14 procedure cards, Copilot→Claude-Code fallback routing.

---

## 5. COVERAGE AND CONFIDENCE

- Questions answered: 10/10 (Q1-Q10); key questions fully covered by the ten angles.
- Confidence: all drift rows are CONFIRMED against opened files (registries, scripts, workflows, git log); rows marked UNVERIFIED require execution forbidden by the lineage contract (no repo tooling runs, no remote content).
- Sources consulted per angle are listed in each iteration file; every finding carries file:line or commit citations.

## 6. REFERENCES

- Iterations: iterations/iteration-001.md … iteration-010.md
- Deltas: deltas/iter-001.jsonl … iter-010.jsonl
- State: deep-research-state.jsonl (config + 10 iteration records + stopped event)
- Draft under audit: specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md
- Ground truth: registries and code under .opencode/ (see inventory above); specs/system-speckit/033-system-speckit-v4/timeline.md
