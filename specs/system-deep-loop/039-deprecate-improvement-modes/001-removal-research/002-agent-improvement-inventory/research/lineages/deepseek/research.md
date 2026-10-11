# Agent-Improvement Mode — Deletion Reference Inventory

**Lineage**: `fanout-deepseek-1791657289869-1teen6` (deepseek, cli-opencode)
**Run**: 10 iterations, `stopPolicy: max-iterations`, stop reason `maxIterationsReached`
**Scope**: every reference to the agent-improvement deep-loop mode across this repository **outside `specs/`** — workflowMode `agent-improvement`, command `/deep:agent-improvement`, assets `deep-agent-improvement-*.yaml` + `deep-agent-improvement-presentation.txt`, the `deep-improvement` agent, the deep-improvement packet and its loop host, and the legacy advisor id `deep-improvement` (default mode `agent-improvement`)
**Classifications**: **DELETE** (exists only for this mode or the packet) · **EDIT** (shared file, remove the mention) · **SHARED-WITH-MODEL-BENCHMARK** (also used by the model-benchmark mode, inventoried by the sibling run) · **KEEP-AS-HISTORY** (changelog or archive)
**Read-only run**: no repository file was edited, moved, deleted or staged; every write stayed inside the lineage directory.

---

## 1. Executive Summary

- The mode spans **five surface families**: the hub registries, the command asset set, the deep-improvement packet (Lane A subtrees + shared chassis), the advisor projections, and the runtime libraries — plus **seven runtime mirrors**, **two git-hook copies**, **two CI workflows**, **one CI drill**, and **one cross-skill authoring packet (sk-doc/sk-create-benchmark)**.
- **DELETE-only surfaces** (they exist solely for Lane A): the command file and its three assets; the packet's `assets|references|scripts/agent-improvement/` subtrees; the three runtime lane libraries; the `deep-improvement` agent definition and its mirrors (`.claude`, `.codex`, `.pi`, Hermes `agent-*`); the sk-doc `agent-improvement-authoring-guide.md` + `prepare-lane-a-inputs.md`; the IL-001 playbook scenario; the three lane-dedicated runtime test files; `test-fixtures/060-stress-test`.
- **One hard cross-repo edge**: the packet script `check-agent-mirror-sync.cjs` is a *packet-owned script consumed outside the improvement modes* — commit hooks, the agent-mirror CI workflow, a CI drill, CROSS-CLI.md, the sk-code agent-authoring checklist and `.claude/SYNC.md` all call it. Its removal requires retargeting or retiring that whole mirror-check chain.
- **Unplanned drift found**: both OpenCode plugin guard tests permit a `skill-benchmark` mode value that `mode-registry.json` does not list; the deletion must reconcile the surviving mode set.
- **Externality**: both owning package manifests are `private: true`; nothing published consumes the mode (boundary: unobservable beyond the checkout).
- Everything shared with Lane B is tagged SHARED-WITH-MODEL-BENCHMARK and must survive until the sibling model-benchmark inventory lands.

---

## 2. Reference Inventory by Surface

### 2.1 Hub registries and identity docs (`.skilled/skills/system-deep-loop/`)

| Reference | Classification | Evidence |
|---|---|---|
| Mode entry (`workflowMode: agent-improvement`, `runtimeLoopType: null`, `backendKind: improvement-host`, `packet: deep-improvement`, `loopHostMode`, command/agent/artifactRoot, alias-fold routing, `advisorDefaultMode: true`) | EDIT (remove entry) | [SOURCE: .skilled/skills/system-deep-loop/mode-registry.json:104] |
| Router signal + `agent-improvement-aliases` keyword class; tieBreak member | EDIT | [SOURCE: .skilled/skills/system-deep-loop/hub-router.json:36] |
| `AGENT_IMPROVEMENT` intent + RESOURCE_MAP leaf set; lane-shared note | EDIT | [SOURCE: .skilled/skills/system-deep-loop/ROUTER.md:96] |
| Hub SKILL.md keyword header, mode table, backendKind path, checklist, layout, leaf-sync invariant, related surfaces | EDIT | [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:29] |
| Command-metadata entry block (`/deep:agent-improvement`, choreography into the packet + presentation asset) | EDIT | [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:139] |
| Leaf manifest file list (`assets/agent-improvement/*`, `references/agent-improvement/*`) + mode row | EDIT manifest; DELETE the listed leaf files | [SOURCE: .skilled/skills/system-deep-loop/leaf-manifest.json:5] |
| Leaf scopes entry | EDIT (keep `references/shared` for Lane B) | [SOURCE: .skilled/skills/system-deep-loop/leaf-scopes.json:2] |
| Graph metadata nodes/edges + causal summary | EDIT | [SOURCE: .skilled/skills/system-deep-loop/graph-metadata.json:110] |
| description.json five-mode description + trigger lists | EDIT | [SOURCE: .skilled/skills/system-deep-loop/description.json:3] |
| README.md workflowMode example, packet table, agent list, add-a-mode checklist | EDIT | [SOURCE: .skilled/skills/system-deep-loop/README.md:61] |
| ARCHITECTURE.md packet layout + per-mode ledger families (`agent-improvement-*`, `deep-improvement-common-*`) | EDIT | [SOURCE: .skilled/skills/system-deep-loop/ARCHITECTURE.md:115] |

### 2.2 Command surface (`.skilled/commands/deep/`)

| Reference | Classification | Evidence |
|---|---|---|
| `.skilled/commands/deep/agent-improvement.md` (whole command router) | **DELETE** | [SOURCE: .skilled/commands/deep/agent-improvement.md:75] |
| `assets/deep-agent-improvement-auto.yaml` | **DELETE** | [SOURCE: .skilled/commands/deep/assets/deep-agent-improvement-auto.yaml] |
| `assets/deep-agent-improvement-confirm.yaml` | **DELETE** | [SOURCE: .skilled/commands/deep/assets/deep-agent-improvement-confirm.yaml] |
| `assets/deep-agent-improvement-presentation.txt` | **DELETE** | [SOURCE: .skilled/commands/deep/assets/deep-agent-improvement-presentation.txt] |
| `compiled/README.md` + `legacy/README.md` fallback-only statement | EDIT | [SOURCE: .skilled/commands/deep/assets/compiled/README.md:23] |
| No compiled contract / legacy body exists for the command (compile coverage is the 3 registered commands) | context (nothing compiled to delete) | [SOURCE: .skilled/commands/deep/assets/compiled/manifest.jsonl:1] |
| `.skilled/commands/README.txt` (tree, table, example, link) | EDIT | [SOURCE: .skilled/commands/README.txt:180] |
| `create-skill-parent-{auto,confirm}.yaml` canonical "many modes → one packet" example | EDIT | [SOURCE: .skilled/commands/create/assets/create-skill-parent-auto.yaml:269] |
| Sibling `deep-model-benchmark-*.yaml/presentation` bindings (`agent-improvement-state.jsonl` as shared state name, unknown-mode fallback) | SHARED-WITH-MODEL-BENCHMARK | [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-confirm.yaml:151] |

### 2.3 The deep-improvement packet (`.skilled/skills/system-deep-loop/deep-improvement/`)

**Lane A exclusive — DELETE**

| Path | Evidence |
|---|---|
| `scripts/agent-improvement/` — 8 scripts + README + tests (`score-candidate.cjs`, `generate-profile.cjs`, `scan-integration.cjs`, `check-mirror-drift.cjs`, `trade-off-detector.cjs`, `benchmark-stability.cjs`, `candidate-lineage.cjs`, `rollback-candidate.cjs`) | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/README.md:16] |
| `references/agent-improvement/` — 7 references (candidate-proposal-format, integration-scanning, mirror-drift-policy, profiling-audit-log, score-dimensions, stress-test-protocol, target-onboarding) | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:116] |
| `assets/agent-improvement/` — improvement-charter/config-reference/config/strategy, README, target-manifest.jsonc, target-profiles/ | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json:7] |
| `test-fixtures/060-stress-test/` | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/test-fixtures/060-stress-test/README.md] |
| Behavior scenarios `IMB-001..006` (Lane A/common; `IMB-001` mode `improvement`) | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/behavior-benchmark/scenarios/IMB-001-auto-run-specified.md:4] |

**Shared chassis — SHARED-WITH-MODEL-BENCHMARK (Lane A is the default identity; edit, don't delete, while Lane B lives)**

| Path | Lane A coupling | Evidence |
|---|---|---|
| Packet `SKILL.md` | Lane A default contract, resource map, byte-identical default | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/SKILL.md:219] |
| `scripts/shared/loop-host.cjs` | default+fallback mode is `agent-improvement` | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:116] |
| `scripts/shared/README.md`, `reduce-state.cjs`, `promote-candidate.cjs`, `mutation-coverage.cjs` (`DEEP_AGENT_IMPROVEMENT_SKIP_DEDUP`), `improvement-journal.cjs` | Lane A default attribution, env seam | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/README.md:22] |
| `references/shared/` (quick-reference, promotion-gate-contract, runtime-truth-contracts, agent-mirror-crosswalk, …) | Lane A command walkthroughs, naming family | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/references/shared/quick-reference.md:45] |
| Packet `README.md` | Lane A command surface + script examples | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/README.md:105] |
| `routing-allowlist.json` | two Lane A entries | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/routing-allowlist.json:7] |
| `scripts/shared/tests/loop-host.vitest.ts` | default-mode + byte-identity tests | [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts:74] |

**KEEP-AS-HISTORY**: packet `changelog/` (33+ files), `benchmark/reports/`, `changelog/v1.17.0.0.md` mirror-gate history — [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/changelog/v1.17.0.0.md:21].

### 2.4 Agent surfaces

| Reference | Classification | Evidence |
|---|---|---|
| `.skilled/agents/deep-improvement.md` (canonical agent; Lane B never dispatches it) | **DELETE** | [SOURCE: .skilled/agents/deep-improvement.md:58] |
| `.skilled/agents/README.txt` roster + translation-contract pointer | EDIT | [SOURCE: .skilled/agents/README.txt:23] |
| `.claude/agents/deep-improvement.md` (physical translated copy) | **DELETE** | [SOURCE: .claude/agents/deep-improvement.md:4] |
| `.claude/agents/README.txt` | EDIT | [SOURCE: .claude/agents/README.txt:27] |
| `.codex/agents/deep-improvement.toml` (generated TOML copy, checker-governed) | **DELETE** | [SOURCE: .codex/agents/deep-improvement.toml] |
| `.pi/agents/deep-improvement.md` (hand copy, outside checker coverage) | **DELETE** | [SOURCE: .pi/agents/deep-improvement.md] |
| `.cursor/agents/deep-improvement.md`, `.devin/agents/deep-improvement/AGENT.md` (symlinks to `.claude` copy) | die with the `.claude` copy | [SOURCE: .devin/agents/deep-improvement/AGENT.md] |
| `.hermes/skills/agent-deep-improvement/SKILL.md` (generated) | **DELETE via regeneration** | [SOURCE: .hermes/skills/agent-deep-improvement/SKILL.md:6] |
| OpenCode/Claude task-dispatch docs (`cli-opencode` SKILL/agent-delegation/prompt-templates/cli-reference; `cli-claude-code` README/agent-delegation/claude-tools) | EDIT | [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/references/agent-delegation.md:231] |

### 2.5 Advisor projection surface (`.skilled/skills/system-skill-advisor/`)

| Reference | Classification | Evidence |
|---|---|---|
| Python `deep-improvement` alias group | EDIT | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:294] |
| Python deep-router patterns (4 keys) + `/deep:agent-improvement` | EDIT | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2043] |
| Python command registries (2 `command-deep-agent-improvement` entries) | EDIT | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2365] |
| TS `SKILL_ALIAS_GROUPS['deep-improvement']` + generated `DEEP_MODE_BY_CANONICAL` fold `deep-improvement -> agent-improvement` | EDIT + regenerate | [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:62] |
| `projection.ts` command inventory entry; `lanes/explicit.ts` explicit scoring | EDIT | [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:123] |
| Generated bridges: `command-bridges.generated.json`, `scoring-compatibility.json` (regenerated from `command-metadata.json` by `derive-command-bridges.cjs`) | EDIT by regeneration | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:304] |
| Routing-registry drift guard asserting the sole `advisorDefaultMode` is agent-improvement | EDIT | [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts:192] |
| Scorer test fixture + negative case; regression/holdout fixtures (`sk-deep-agent-improvement`) | EDIT | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:40] |
| `skill-graph.json` signals; divergence-ledger capture script | EDIT + regenerate | [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json:1] |
| Advisor playbook evidence (`python-compat/regression-suite.md`, `corpus-df-idf.md`) | KEEP-AS-HISTORY (recorded output) / EDIT (maintained example) | [SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/python-compat/regression-suite.md:159] |

### 2.6 Runtime layer (`.skilled/skills/system-deep-loop/runtime/`)

| Reference | Classification | Evidence |
|---|---|---|
| `lib/agent-improvement-ledger-schema/` | **DELETE** | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-ledger-schema/README.md:12] |
| `lib/agent-improvement-reducers/` | **DELETE** | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-reducers/README.md] |
| `lib/agent-improvement-sealed-artifacts/` | **DELETE** | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/agent-improvement-sealed-artifacts/README.md] |
| `lib/deep-improvement-common-*` (3 libs) | SHARED-WITH-MODEL-BENCHMARK | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/README.md] |
| `lib/per-mode-authority-flip/types.ts` union + frozen order | EDIT | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:134] |
| `lib/mode-append-gateway/append-mode-event.ts` improvement-ledgers family | SHARED, EDIT | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:184] |
| `scripts/append-mode-event.cjs` normalize alias + adapter import | SHARED, EDIT | [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:134] |
| `lib/legacy-projections/` manifest + contract (defaults to lane, imports lane schema) | SHARED, EDIT | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-improvement-ledgers-contract.ts:97] |
| `lib/write-set-conflict-graph/shipped-census.ts` lane rows | EDIT | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:434] |
| Machine-local authority state (`.state/authority/`) | no repo file (record defaults to legacy) | [SOURCE: .skilled/skills/.state/authority/README.md:31] |
| Mode-agnostic core (`lib/deep-loop/`, `lib/mode-contracts/`, fanout scripts) | untouched (negative) | [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/] |

### 2.7 Hooks, bin and cross-skill consumers

| Reference | Classification | Evidence |
|---|---|---|
| `task-dispatch/lib/dispatch-guard.cjs` loop-executor set + README | EDIT | [SOURCE: .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs:74] |
| `.skilled/hooks/git/pre-commit` + `.skilled/scripts/git-hooks/pre-commit` (both call the packet checker) | EDIT (retarget) | [SOURCE: .skilled/scripts/git-hooks/pre-commit:165] |
| `.skilled/hooks/git/README.md`, `.skilled/CROSS-CLI.md`, `.claude/SYNC.md`, sk-code agent-authoring checklist | EDIT | [SOURCE: .skilled/CROSS-CLI.md:89] |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` checker fixtures | EDIT | [SOURCE: .skilled/scripts/git-hooks/tests/pre-commit.test.sh:360] |
| `.github/workflows/agent-mirror-sync.yml` + `.github/scripts/tests/broken-move-drill.sh` | EDIT | [SOURCE: .github/workflows/agent-mirror-sync.yml:17] |
| `.skilled/bin/lib/compiled-routing/.../registry-compiler.cjs` mode order + `SHARED_PACKET_COLLAPSE` invariant; `canary-cases.v1.json` | EDIT compiler + fixtures | [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:188] |
| `.opencode/plugins/system-deep-loop-guard.js` (registry-driven) + both guard test fixture sets | tests EDIT; plugin no change | [SOURCE: .opencode/plugins/tests/system-deep-loop-guard.test.cjs:35] |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/` + `shared/rollout/command-injection-rollout.json:6` + `shared/progress/README.md:12` | SHARED, EDIT | [SOURCE: .skilled/skills/system-deep-loop/shared/behavior-benchmark/framework.md:334] |
| `deep-ai-council/README.md:134` sibling mention | EDIT | [SOURCE: .skilled/skills/system-deep-loop/deep-ai-council/README.md:134] |
| sk-doc `sk-create-benchmark` Lane A branch: `references/agent-improvement/agent-improvement-authoring-guide.md`, `prepare-lane-a-inputs.md` | **DELETE** | [SOURCE: .skilled/skills/sk-doc/sk-create-benchmark/SKILL.md:150] |
| sk-doc indexes: `mode-registry.json:310-311`, `leaf-manifest.json:24`, `ROUTER.md:294`, `sk-create-agent/assets/agent-template.md:749`, `max-load.md:21,162` | EDIT | [SOURCE: .skilled/skills/sk-doc/mode-registry.json:310] |
| System-spec-kit retrieval fixtures (`corpus-manifest.json`, `generation-diagnostics.json`) | EDIT by regeneration | [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json:6910] |

### 2.8 Documentation, history and root surfaces

| Reference | Classification | Evidence |
|---|---|---|
| Root `README.md` (8 places incl. the Agent Improvement & Benchmarking section) | EDIT | [SOURCE: README.md:648] |
| Hub `changelog/`, packet `changelog/`, root `.skilled/changelog/`, cli-opencode changelog | KEEP-AS-HISTORY | [SOURCE: .skilled/changelog/skilled/v3+/v3.5.0.0.md:37] |
| Hub `feature-catalog/` (+ mode-classification entry) | EDIT | [SOURCE: .skilled/skills/system-deep-loop/feature-catalog/feature-catalog.md:15] |
| Hub `manual-testing-playbook/` (root + advisor-integration + runtime-and-backend); `improvement-lane-routing/agent-improvement.md` = IL-001 | EDIT; IL-001 scenario **DELETE** | [SOURCE: .skilled/skills/system-deep-loop/manual-testing-playbook/improvement-lane-routing/agent-improvement.md:6] |
| Hub `benchmark/` reports + README | KEEP-AS-HISTORY (README index EDIT) | [SOURCE: .skilled/skills/system-deep-loop/benchmark/README.md:3] |
| Cross-skill benchmark reports (sk-code, mcp-tooling, cli-external-orchestration, sk-prompt) | KEEP-AS-HISTORY | [SOURCE: .skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json:29] |
| Hermes generated `skills/deep-improvement`, `skills/system-deep-loop`, `skills/cli-*`, `skills/sk-create-benchmark`, `prompts/deep-agent-improvement.md` | EDIT/regenerate | [SOURCE: .hermes/SYNC.md:63] |

---

## 3. Indirect Wiring (listed separately)

1. **Registry projections**: `DEEP_MODE_BY_CANONICAL` fold + generated alias groups (`aliases.ts`), command-bridge + scoring-compatibility generated pairs, `projection.ts` inventory rows — regenerate from `command-metadata.json` and the registry after edits. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts:62]
2. **Alias folds**: the `deep-improvement -> agent-improvement` fold is the only `advisorDefaultMode` in the system; the drift guard hard-asserts it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/routing-registry-drift-guard.vitest.ts:194]
3. **Drift guards**: routing-registry drift guard (advisor), command-bridges drift guard, agent-mirror-sync gate (hooks + CI), compiled-routing `SHARED_PACKET_COLLAPSE` invariant. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/002-system-deep-loop/lib/registry-compiler.cjs:192]
4. **Compiled contracts**: no compiled command contract for the mode; the compiled-routing compiler fixtures and the TypeScript lane libraries are the compiled-adjacent surfaces. [SOURCE: .skilled/commands/deep/assets/compiled/README.md:23]
5. **Authority order**: `AUTHORITY_FLIP_MODE_ORDER` pins the mode between common and model-benchmark; the append gateway refuses modes outside the order. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/types.ts:134]
6. **Generated mirrors**: Hermes skill/prompt copies (regenerate), `.codex` TOML agent copy (regenerate), `.claude` translated copy (edit/delete with the canonical), `.pi` hand copy (delete). [SOURCE: .hermes/SYNC.md:50]
7. **Fixtures**: advisor regression + holdout fixtures, retrieval corpus fixtures, git-hook test fixtures, plugin guard fixtures, behavior scenarios. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:58]
8. **Default-mode coupling**: loop-host default/fallback, reduce-state attribution, promote-candidate default, vitest byte-identity contract — all named agent-improvement. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs:119]

---

## 4. Runtime Mirror Taxonomy (deletion sequencing)

| Runtime | Agent surface | Nature | Command/packet reach | Action |
|---|---|---|---|---|
| `.skilled` | canonical agent + command + packet | source of truth | — | edit/delete as inventoried |
| `.opencode` | all surfaces | **symlink farm** (`agents`,`commands`,`skills`,`bin`,`hooks`,`scripts`) | via symlinks | no per-file edit |
| `.claude` | agent = physical translated copy; commands = symlinks; skills = symlink | copy + symlinks | symlinked | delete the agent copy; others follow |
| `.codex` | agent = generated TOML; prompts = copies | physical copies (checker-governed agents) | prompts copied | delete/regenerate |
| `.cursor` | agent | symlink → `.claude` | — | dies with `.claude` |
| `.pi` | agent + prompts | **hand copies (outside checker)** | prompts copied | delete |
| `.devin` | agent dir | symlink → `.claude` | skills symlinked | dies with `.claude` |
| `.hermes` | agents = symlink dir; skills/prompts = **generated** | generated copies | `-s` preload skills | regenerate (write mode prunes) |

[SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:33]

---

## 5. External Callers of Packet Scripts and Runtime Libraries (outside the two improvement modes)

- `check-agent-mirror-sync.cjs` → `.skilled/hooks/git/pre-commit:82`, `.skilled/scripts/git-hooks/pre-commit:165`, `.skilled/hooks/git/README.md:138`, `.skilled/CROSS-CLI.md:89`, `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/agent-authoring.md:37,65,73`, `.claude/SYNC.md:57,100`, `.github/workflows/agent-mirror-sync.yml:17`, `.github/scripts/tests/broken-move-drill.sh:133-134`. [SOURCE: .skilled/skills/sk-code/sk-code-opencode/assets/checklists/agent-authoring.md:37]
- Lane A script names (`score-candidate`, `generate-profile`, `scan-integration`, …) outside the packet: only the canonical agent definition, the Lane A command assets, changelogs and the retrieval fixtures (regenerated). [SOURCE: .skilled/agents/deep-improvement.md:248]
- Shared script names outside the packet: the sibling model-benchmark command assets (in-scope for the sibling run) and generated benchmark reports (history). [SOURCE: .skilled/commands/deep/assets/deep-model-benchmark-auto.yaml:99]
- **Externality**: `@spec-kit/system-deep-loop` and `@deep-loop/runtime` are both `private: true`; no published consumer exists; consumption beyond the checkout is unobservable. [SOURCE: .skilled/skills/system-deep-loop/package.json:4]

---

## 6. Tests, Validators and Gates Covering the Touched Surfaces

| Surface | Coverage | Action on deletion |
|---|---|---|
| Runtime unit suite (20 files; 3 lane-dedicated) | `.github/workflows/deep-loop-runtime.yml:60` runs `runtime test` | delete lane tests; update mixed tests; keep gate green |
| Advisor drift guard + routing parity | `.github/workflows/routing-registry-drift.yml:120` | update guard assertion with the registry/alias edits |
| Command tree parity + Hermes `--check`s | `.github/workflows/command-tree-parity.yml:63-67` | rerun sync scripts then the checks |
| Agent mirror sync (hook + CI + drill) | `.github/workflows/agent-mirror-sync.yml:17`; git-hook tests | retarget checker or retire chain |
| Compiled-routing fixtures | `canary-cases.v1.json` shared-packet case | update fixtures with the compiler |
| Plugin guards (OpenCode + Claude) | `system-deep-loop-guard.test.cjs:35`; `claude-task-dispatch-guard.test.cjs:47` | reconcile `skill-benchmark` drift; edit fixtures |
| Packet script tests | `scripts/shared/tests/`, lane tests dirs | lane tests delete; shared tests edit |
| Behavior benchmarks | `shared/behavior-benchmark/` + IMB scenarios | keep shared; lane scenarios delete |
| Retrieval corpus fixtures | `corpus-manifest.json`, `generation-diagnostics.json` | regenerate after deletion |
| Doctor checks / validators | name-agnostic (negative) | no edit; ensure no orphaned mirrors |

[SOURCE: .github/workflows/deep-loop-runtime.yml:60]

---

## 7. Convergence Report

- **Stop reason**: `maxIterationsReached` (10 of 10; convergence telemetry only per `stopPolicy: max-iterations`)
- **Iterations completed**: 10 · **Findings registered**: 121 · **Key questions**: 2 resolved (runtime-mirror nature; shared/tests roll-up), 3 open to the cap's depth (full reference closure, indirect-wiring closure, externality beyond the checkout)
- **Average newInfoRatio**: 0.86 (per-iteration: 0.90, 0.85, 0.90, 0.90, 0.85, 0.90, 0.90, 0.80, 0.90, 0.80)
- **Corruption warnings**: 0
- **Known gaps**: prose-only ("agent improvement") mentions outside canonical tokens were bounded but not exhaustively enumerated; consumption beyond this checkout is unobservable; the sibling model-benchmark classification must be joined before any shared file is deleted.
