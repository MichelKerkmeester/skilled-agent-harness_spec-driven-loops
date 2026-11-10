# deep-research changelog digest

Skill path: `.opencode/skills/system-deep-loop/deep-research/` (changelog at `changelog/`). Versions covered: v1.6.3.0 through v1.15.0.0, the last 10 of 20 entries. Date range: none of these 10 entries carries a date. Only older entries (v1.1.0.0, v1.5.0.0, v1.6.2.0) contain ISO dates, so no range can be stated for this window.

---

## PER VERSION, NEWEST FIRST

#### v1.15.0.0

`v1.15.0.0.md` records a README rewrite only. The README now opens with a one-line pitch and a problem-first OVERVIEW, then runs AT A GLANCE, QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION and RELATED DOCUMENTS in the refined skill README template order. A new Research State Layer section adds a capability table for the six packet files the skill reads and writes. The entry says the README frontmatter moved from 1.14.0.46 to 1.15.0.0. No migration, no runtime change. This entry is also the first in the window to use the current `system-deep-loop/deep-research/` path in its file table.

#### v1.14.0.0

`v1.14.0.0.md` regroups the reference library. The thirteen flat files under `references/` now live in four topic subfolders `convergence/`, `state/`, `protocol/` and `guides/`. RENAME: every inbound reference path changed, so SKILL.md REFERENCES entries, the README structure tree, the command and agent mirrors and the cross-skill deep-review pointer were all repointed to the subfoldered paths. The smart router discovers references recursively so routing behavior is unchanged. A workspace sweep confirmed no stale flat paths in live consumers.

#### v1.13.0.0

`v1.13.0.0.md` is a metadata and alignment bump. It records that deep-research already carried the shared deep-skill resource family (quick reference, loop protocol, convergence split, state split, prompt-pack template, runtime capability matrix, config, strategy, dashboard) and makes that explicit so operator metadata stays in sync with `deep-ai-council` and `deep-review`. Navigation text was refreshed to distinguish research novelty signals from review severity signals and council agreement signals. It also corrects the config template archive root to `research_archive`. No runtime YAML, reducer, script, command or agent behavior changed.

#### v1.12.0.0

`v1.12.0.0.md` rebinds deep-research onto a new `deep-loop-runtime` peer skill (arc 118). BREAKING: the four `mcp__system_spec_memory__deep_loop_graph_*` MCP tools were deleted with no aliases, so external code hardcoding those names must switch to script paths. Both `deep-research-auto.yaml` and `deep-research-confirm.yaml` now invoke `node .opencode/skills/deep-loop-runtime/scripts/<X>.cjs` directly, with byte-equivalent output bindings. REMOVED: the 13 lib files and the 4 graph operations previously hosted in `system-spec-kit/mcp-server/` no longer live there. RENAME: imports move from `system-spec-kit/mcp-server/lib/{deep-loop,coverage-graph}/*` to `deep-loop-runtime/lib/{deep-loop,coverage-graph}/*`. REMOVED: the `deep-loop-graph.sqlite` database moved to `.opencode/skills/deep-loop-runtime/storage/`. The entry also reconciles stale SKILL.md frontmatter that read `v1.6.2.0` while the changelog history had reached v1.11.0.0.

#### v1.11.0.0

`v1.11.0.0.md` lands two prompt-level teachings from the packets 108 plus 110 auto-review uplift. A literal `DEEP-RESEARCH` marker goes on line 1 of `prompt-pack-iteration.md.tmpl` so the role banner survives long iterations, and a matching `step_marker_scan` in the auto dispatcher YAML fails fast when the marker is missing after rendering. Reference templates that carry YAML frontmatter were deliberately left untouched. The SKILL.md CONSTRAINTS section gains an anti-repetition rule barring restatement of a finding already reported in a prior iteration of the same arc. The entry records why the deep-review v1.8.0.0 content-hash synthesis dedup is deliberately NOT applied here, because deep-research is single-dimension. Both mechanisms cleared a 5-seat deep-ai-council review before shipping. Source commit 74782acfb, no migration.

#### v1.10.0.0

`v1.10.0.0.md` hardens the CLI executor matrix against seven P1 findings from a 30-iteration research pass. BREAKING: post-dispatch validation now REQUIRES the executor field on the first JSONL record of every non-native run, so a missing provenance stamp fails fast with a typed `executor_missing` reason. `writeFirstRecordExecutor` stamps executor identity before dispatch. A new typed `dispatch_failure` event preserves executor attribution when a crash or timeout leaves no valid iteration record, and three consecutive such events trigger stuck recovery. Copilot dispatch gains a real `@path` fallback above a 16 KB prompt threshold in all four YAMLs. `graph-metadata.json` gains an optional `derived.save_lineage` enum of `description_only`, `graph_only` or `same_pass`. A new `lib/continuity/timestamp-normalize.ts` helper treats date-only and midnight-UTC values as low precision. Retry-budget telemetry emits `retry_attempt` records with `MAX_RETRIES = 3` unchanged. Bug fixes cover the evidence-marker fence parser for indented and nested fences, and a merge-preserving `description.json` repair behind the `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` flag defaulting to on. Docs narrow the readiness contract to the four trust states actually emitted, `live`, `stale`, `absent` and `unavailable`, marking `cached`, `imported`, `rebuilt` and `rehomed` as compatibility vocabulary. Tests went from 54 to 116.

#### v1.9.0.0

`v1.9.0.0.md` finishes the executor matrix by wiring the two reserved kinds. `cli-copilot` now dispatches via `copilot -p "PROMPT" --model X --allow-all-tools --no-ask-user`, passing the prompt positionally because Copilot has no stdin support. `cli-claude-code` dispatches via `claude -p "PROMPT" --model <id> --permission-mode acceptEdits --output-format text`, overriding the read-only `plan` default so iterations can write. BREAKING in the permissive direction: `ExecutorNotWiredError` no longer rejects those two kinds. A new per-kind flag-compatibility matrix in `executor-config.ts` rejects unsupported combinations with typed errors, for example `serviceTier` with `cli-copilot`. The setup prompt in `deep-research.md` grows from two executor options to four. Cross-CLI delegation is documented as design intent in prose, not enforced in code. Tests went from 40 to 54. Ships as a symmetric pair with deep-review v1.6.0.0.

#### v1.8.0.0

`v1.8.0.0.md` introduces executor selection. The iteration step branches on a new `executor.kind` config field, with `native` as the default preserving the prior Opus agent dispatch exactly, and a new `cli-codex` branch running `codex exec` with the prompt piped through stdin. The inline YAML iteration context was extracted to a shared template at `assets/prompt-pack-iteration.md.tmpl` so both dispatch paths render identical content. A new `executor` block in `deep_research_config.json` carries six fields, `kind`, `model`, `reasoningEffort`, `serviceTier`, `sandboxMode` and `timeoutSeconds`, all null by default. Five new setup flags land in the command doc with precedence CLI flag then config then schema default. Non-native runs append an executor audit block to the iteration JSONL record. A post-dispatch validator requires a markdown narrative plus a JSONL delta with required fields and emits `schema_mismatch` otherwise, with three consecutive failures triggering stuck recovery. SKILL.md replaces a forward-looking note with a full Executor Selection Contract. 40 new tests. Ships as a symmetric pair with deep-review v1.5.0.0.

#### v1.7.0.0

`v1.7.0.0.md` adds a feature catalog at `feature-catalog/feature-catalog.md` listing 14 features in 4 areas, loop lifecycle, state management, convergence and research output, each with its own file pointing back to source. The README now points at the catalog first. Docs only, runtime behavior unchanged.

#### v1.6.3.0

`v1.6.3.0.md` changes where research artifacts land on disk. RENAME: research folders now always go to the spec tree root instead of inside the targeted child phase, so a child `026/014-memory-save/` writes to `026/research/014-memory-save/` and a grandchild `026/010-search/001-fusion/` writes to `026/research/010-search-001-fusion/`. Standalone specs are unchanged. Both deep-research and deep-review resolve through the shared `resolveArtifactRoot(specFolder, mode)` in `system-spec-kit/shared/review-research-paths.cjs`. Bug fixes align Claude and Codex agent definitions to their own runtime directories instead of `.opencode/agents/`, and correct `archive_root` in both command YAMLs to `research_archive`.

---

## FACTS THE V4 DRAFT GETS WRONG OR MISSES

- Draft line 173 lists the six external CLIs a loop can dispatch to and includes `cli-claude-code`, which matches `v1.9.0.0.md`. What the draft never states is that `cli-copilot` was once a shipped, wired deep-loop executor, not merely a bridge skill. `v1.9.0.0.md` wires it with its full dispatch shape and `v1.10.0.0.md` invests further in it with the 16 KB `@path` fallback. Draft lines 227 and 445 describe `cli-copilot` only as a retired bridge whose prompts now land on Claude Code, so a reader with a saved `executor.kind: cli-copilot` config from v1.9 or v1.10 gets no upgrade instruction anywhere in the draft.
- Draft line 445 tells readers to repoint `deep-loop-workflows` and `deep-loop-runtime` at `system-deep-loop`, but the draft never says where the deep-loop SQLite store ended up. `v1.12.0.0.md` moved `deep-loop-graph.sqlite` to `.opencode/skills/deep-loop-runtime/storage/`, an address the draft itself declares dead. Anything scripted against that storage path is broken and the draft's migration list does not cover it.
- The draft misses the removal of the four `mcp__system_spec_memory__deep_loop_graph_*` MCP tools. `v1.12.0.0.md` states plainly that they are gone with no aliases and that hardcoded callers must switch to `.cjs` script paths. Draft line 445 lists removed memory surfaces (`memory_search`, `memory_save`, the spec-memory MCP server and its daemon) but names none of the four graph tools, so a reader mapping old MCP tool names to replacements finds nothing.
- The draft misses the root-level research folder convention from `v1.6.3.0.md`. Research output no longer lands inside the targeted child phase, it lands under the spec tree root `research/` with a flattened phase-path subfolder. This is an observable change in where a `/deep:research` run writes its artifacts and it appears nowhere in the draft, including the deep-loop section at lines 160 to 190.
- The draft misses the per-iteration executor provenance contract described in `v1.10.0.0.md`. Draft line 175 says "every iteration records which agent ran on which route", which is directionally right but understates it: provenance is stamped on the FIRST record before dispatch, it is a hard validation requirement for non-native runs, and a typed `dispatch_failure` event carries executor identity when a crash leaves no iteration record. The draft's one clause reads as reporting where the entries describe a fail-fast gate.
- No draft claim about deep-research was found to be factually contradicted by these ten entries. The items above are omissions and understatements, not false statements.

---

## CURRENT VERSION AND IDENTITY

The `SKILL.md` frontmatter at `.opencode/skills/system-deep-loop/deep-research/SKILL.md` declares `version: 1.14.0.0`, one release behind the newest changelog entry `v1.15.0.0.md`. The `README.md` frontmatter declares `version: 1.14.0.46`, even though `v1.15.0.0.md` claims that frontmatter was bumped to 1.15.0.0. Both files are therefore stale against the changelog, and the README entry contradicts its own release note.

deep-research is a MODE, not a hub and not standalone. There is no `mode-registry.json` at the deep-research root, which holds only `routing-allowlist.json`. The parent `.opencode/skills/system-deep-loop/` carries `mode-registry.json` (version 2.0.0.1) along with `hub-router.json`, `description.json` and `graph-metadata.json`, the hub-only set. That registry lists deep-research as `workflowMode: research`, `runtimeLoopType: research`, `backendKind: runtime-loop-type`, `packetKind: workflow`, `packet: deep-research`, `command: /deep:research`, `agent: deep-research`, `artifactRoot: research/` and `advisorRouting.routingClass: lexical`, so it carries its own advisor entry rather than being resolved by hub membership alone.
