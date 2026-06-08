<!-- ANCHOR:research -->
# Deep Research Report — Code Graph + Hooks/Plugin + Advisor Bug-Surface

## EXECUTIVE SUMMARY

This report synthesizes a 10-iteration read-only sweep over the code graph, hook/plugin, advisor, CocoIndex handoff, readiness, and test coverage surfaces. The sweep started from the native rerun failure chain in `012/002` and broadened into adjacent runtime and documentation contracts so the next packet can remediate the actual day-to-day failure modes instead of isolated symptoms.

User clarification on 2026-05-06 corrects the core framing: code graph default scope is intentionally user-codebase-focused. Excluding `.opencode/skills/**`, `.opencode/agents/**`, `.opencode/commands/**`, `specs/**`, and `plugins/**` is not a bug for template users indexing their own production code; framework backend indexing is maintainer mode and must stay opt-in through `SPECKIT_CODE_GRAPH_INDEX_*` flags or per-call scope arguments.

The corrected headline is that two real P0 bugs remain for end users: F-002 zero-node full scans can wipe a populated graph, and F-003 parser-error persistence can overwrite prior successful per-file graph content. Framework-maintainer ergonomics such as `.codex/config.toml` maintainer flags, invalid env token handling, and scope-mismatch messaging are P2 polish, not P0 blockers. Hooks and advisor remain real integration surfaces: they need runtime smoke parity, staleness repair hardening, and clearer docs before they can be treated as fully operator-ready.

Recommended next action: open a Phase 014 remediation packet under `026/007/012` or a sibling `015` packet focused on code graph safety first, then read-path recovery, advisor watchdog behavior, hook/runtime docs, CocoIndex handoff contracts, and test coverage. Do not enable automatic read-path full scans until zero-node promotion and parser-error overwrite are guarded.

## METHODOLOGY

- 10 iterations × cli-codex gpt-5.5 high fast.
- Read-only, file:line citations required, 8-12 tool calls per iter.
- 10 focus dimensions rotated across iterations.
- Source inputs: `research/deep-research-strategy.md`, `research/deep-research-config.json`, `research/iterations/iteration-001.md` through `iteration-010.md`, and `research/deltas/iter-001.jsonl` through `iter-010.jsonl`.
- Total raw finding stream from deltas: P0=3, P1=19, P2=13.
- Corrected deduplicated status after user framing clarification: P0=2, P1=16, P2=12, DESIGN-INTENT closed=1.

## FINDINGS BY SEVERITY (DEDUPLICATED)

### DESIGN-INTENT (Closed — not a bug)

- **F-001** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:14` — ~~Default code graph scope excludes `.opencode/skills/**`, `.opencode/agents/**`, `.opencode/commands/**`, `.opencode/specs/**`, and `.opencode/plugins/**`, so the framework implementation is outside default scans. Remediation: make default scope active-root aware for Spec Kit maintainer work, or block/warn when default scope would index zero useful nodes.~~ **[CLOSED — DESIGN-INTENT, NOT A BUG]** Default scope correctly excludes framework backend paths for template users indexing their own project code. Framework maintainers can opt in with `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, related `SPECKIT_CODE_GRAPH_INDEX_*` flags, or per-call scope arguments. Iter-source: iteration-001; correction-source: user clarification 2026-05-06.

### P0 (End-user blockers — can destroy useful code-graph state)

- **F-002** `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:292` — Full-scan pruning deletes previously tracked files absent from the current result set before proving the new scan has usable graph content, so a scope-mismatched empty scan can wipe a populated graph. Remediation: stage candidate scans and block/quarantine zero-node promotion when prior graph state is non-empty unless an explicit destructive reset is requested. Iter-source: iteration-004.
- **F-003** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:467` — Parse results with `parseHealth === "error"` are persisted as authoritative file state with zero nodes, clearing prior successful graph content. Remediation: preserve the last successful per-file graph on parser runtime errors and store diagnostics separately. Iter-source: iteration-005.

### P1 (Required)

- **F-006** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:202` — Candidate manifest drift is a count/digest predicate over tracked files and blocks reads when full scans are disabled, but the native read-after-scan sequence lacks a regression fixture. Remediation: add a regression test for broad scan followed by read-path manifest comparison under the same normalization. Iter-source: iteration-003.
- **F-007** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:293` — Scope fingerprint drift is separate from manifest drift, and scan-argument scopes are exempted, but blocked-read payloads do not expose enough diagnostics. Remediation: include active/stored scope, manifest count/digest, and reason codes in readiness payloads. Iter-source: iteration-003.
- **F-008** `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:335` — Scan metadata is promoted after zero-node or errored scans, including git head, provenance, and scope. Remediation: promote live metadata only after a usable scan, or persist failed-scan metadata separately. Iter-source: iteration-004.
- **F-009** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:517` — `replaceEdges()` can insert edges even when no source nodes remain, producing orphan edge shapes such as `0 nodes / 764 edges`. Remediation: filter edges to retained source IDs and run orphan cleanup after destructive pruning. Iter-source: iteration-004.
- **F-010** `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:348` — Any per-file parse error suppresses candidate-manifest recording for the whole full scan. Remediation: decouple fatal scan failure from nonfatal per-file parse diagnostics. Iter-source: iteration-005.
- **F-011** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts:81` and `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts:402` — `code_files` stores parse health but not error text, and scan responses truncate errors, so native crash artifacts lose affected filenames and messages. Remediation: add durable parse diagnostics keyed by file path and expose them via scan/status. Iter-source: iteration-005.
- **F-012** `.opencode/skills/system-spec-kit/mcp_server/hooks/copilot/README.md:63` — Copilot docs claim session-prime prints status JSON, while implementation writes raw startup/compact text. Remediation: either add JSON smoke mode or update the docs to match stdout behavior. Iter-source: iteration-006.
- **F-013** `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/README.md:24` — Gemini docs list startup/compact/stop scripts but only register the BeforeAgent advisor path. Remediation: add SessionStart, compact, SessionEnd registration and smoke examples. Iter-source: iteration-006.
- **F-014** `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts:63` — `advisor_rebuild` skips repair when `freshness === "live"` even if `trustState.state === "absent"`. Remediation: skip only when both axes are live, or derive rebuild need from the worse state. Iter-source: iteration-007.
- **F-015** `.opencode/skills/system-spec-kit/mcp_server/context-server.ts:1487` — Startup skill graph scan publishes `state: "live"` after indexing/signature computation without checking that the SQLite artifact exists and `advisor_status` would be live. Remediation: assert post-index artifact/trust invariants before publishing live. Iter-source: iteration-007.
- **F-016** `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:240` — `code_graph_context` cannot ingest raw CocoIndex MCP results with `file_path`, `start_line`, `end_line`, and `content`. Remediation: normalize live CocoIndex snake_case fields in seed schema and handler tests. Iter-source: iteration-008.
- **F-017** `.opencode/skills/mcp-coco-index/references/tool_reference.md:266` — CocoIndex docs describe `file` and `lines`, while live protocol emits `file_path`, `start_line`, and `end_line`. Remediation: update docs or define a canonical adapter shape. Iter-source: iteration-008.
- **F-018** `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1089` and `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/context.ts:166` — Read-path handlers disable inline full scans and block every `full_scan` readiness result. Remediation: add a shared guarded auto-rescan policy only after destructive scan promotion is fixed. Iter-source: iteration-009.
- **F-019** `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:153` — `code_graph_verify` gates only on generic readiness and cannot prove active maintainer scope matches stored graph scope. Remediation: add a scope-aware verify preflight/result field and entrypoint tests. Iter-source: iteration-010.
- **F-020** `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:285` — Scan tests cover normal stale-file removal but not populated graph followed by zero-node full scan. Remediation: add a regression fixture that asserts preservation or quarantine. Iter-source: iteration-010.
- **F-021** `.opencode/skills/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts:671` — Parser-error tests check formatting only, not preservation of prior clean graph on backend parser crashes. Remediation: seed prior nodes/edges, feed `parseHealth:"error"` with an OOB-like message, and assert prior graph remains available. Iter-source: iteration-010.

### P2 (Suggestions)

- **F-004** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts:75` — ~~Invalid `SPECKIT_CODE_GRAPH_INDEX_SKILLS` values silently collapse to `none`. Remediation: validate env tokens and emit scan/status errors or warnings for invalid values.~~ **[RECLASSIFIED — MAINTAINER-ONLY P2]** End users should not need these env vars for default project-code indexing. Maintainers who opt into framework backend indexing still benefit from token validation and clearer warnings. Iter-source: iteration-001; correction-source: user clarification 2026-05-06.
- **F-005** `.codex/config.toml:13` — ~~cli-codex MCP startup env lacks `SPECKIT_CODE_GRAPH_INDEX_*` flags while `opencode.json` sets maintainer mode. Remediation: add equivalent Codex env config or document external `.env` startup requirements.~~ **[RECLASSIFIED — MAINTAINER-ONLY P2]** Codex startup parity matters only for framework contributors who want code graph coverage over `.opencode/**`; it must not become a default recommendation for new template users. Iter-source: iteration-002; correction-source: user clarification 2026-05-06.
- **F-022** `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:493` — Syntactically valid but nonexistent `sk-*` selections can match no skill content silently. Remediation: verify selected skill folders exist and warn on unmatched selections. Iter-source: iteration-001.
- **F-023** `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:261` — Env docs describe skill indexing as scan-only, but query readiness also consumes env through `ensure-ready`. Remediation: document read-path participation and restart requirements. Iter-source: iteration-002.
- **F-024** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/tree-sitter-parser.ts:722` — Syntax-recovered parses and parser runtime crashes share the parse health/error channel. Remediation: classify parser backend runtime failures separately. Iter-source: iteration-005.
- **F-025** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/README.md:30` — Claude docs register only `UserPromptSubmit` even though the script table lists startup, compact, and stop scripts. Remediation: add non-advisor hook payload contracts and smoke commands. Iter-source: iteration-006.
- **F-026** `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/session-start.ts:206` — `--smoke` exists only for Codex SessionStart. Remediation: standardize smoke or documented offline preflight modes across runtime entrypoints. Iter-source: iteration-006.
- **F-027** `.opencode/skills/system-spec-kit/mcp_server/hooks/README.md:40` — OpenCode lacks a concrete hooks README path to the plugin/bridge smoke/status surface. Remediation: add an OpenCode section with plugin, bridge, insertion point, and status command. Iter-source: iteration-006.
- **F-028** `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-rebuild.vitest.ts:16` — Advisor rebuild tests model `trustState.state` as identical to freshness. Remediation: add mixed-axis live/absent fixtures. Iter-source: iteration-007.
- **F-029** `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1177` — Memory-search telemetry marks `cocoIndex.available: true` unconditionally and maps memory rows as CocoIndex calibration evidence. Remediation: gate telemetry on actual CocoIndex channel evidence. Iter-source: iteration-008.
- **F-030** `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts:32` — `ReadyResult` has free-form `reason` but no machine-readable full-scan cause or safety classification. Remediation: add `reasonCode` or `autoFullScanSafety` before automating recovery. Iter-source: iteration-009.
- **F-031** `.opencode/skills/system-spec-kit/mcp_server/tests/ensure-ready.vitest.ts:284` — Tests lock "read paths refuse inline full scan" but lack a desired safe-auto-rescan fixture. Remediation: add the safe fixture before changing handler defaults. Iter-source: iteration-009.

## FINDINGS BY AXIS

### Code Graph

DESIGN-INTENT closed: F-001. P0: F-002, F-003. P1: F-006, F-007, F-008, F-009, F-010, F-011, F-018, F-019, F-020, F-021. P2: F-004, F-022, F-023, F-024, F-030, F-031.

### Hooks / Plugin

P1: F-012, F-013. P2: F-025, F-026, F-027.

### Advisor / Skill Graph

P1: F-014, F-015. P2: F-028.

### Cross-Cutting

P1: F-016, F-017. P2: F-005, F-029. These touch runtime startup configuration, semantic-search handoff contracts, or memory/search telemetry rather than a single code graph function.

## ANSWERS TO PRIMARY QUESTIONS (from charter)

### A. Default scope + SPECKIT_CODE_GRAPH_INDEX_SKILLS

Corrected verdict: the default scope is working as designed for end users. Code graph is primarily for indexing the user's production code, not the framework backend under `.opencode/**`, `specs/**`, or `plugins/**`. A new template user should not set `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` by default.

`SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` fixes the skills portion of a framework-maintainer case only when it is present in the MCP server process environment at startup. Iteration 2 traced scan and query-readiness paths and found both observe the env-expanded policy through `resolveIndexScopePolicy()` and `ensure-ready`; iteration 8 shows adjacent seed handoff contracts can still fail even after broad indexing works.

The env var is therefore maintainer-mode opt-in, not a new-user recommendation. Maintainer startup may set code graph scope flags for skills, agents, commands, specs, and plugins, and status/readiness should expose which startup scope is active.

### B. Drift detector code path

Trace summary: `code_graph_query` calls `ensureCodeGraphReady(process.cwd(), { allowInlineIndex: true, allowInlineFullScan: false })`; `ensure-ready` detects stored/active scope drift first, then git/mtime/candidate-manifest state, and query wraps full-scan readiness as a blocked read when inline full scan is disabled.

Exact predicate for candidate manifest drift: stored manifest exists and either sorted tracked-file count differs or `sha256(sorted tracked-file paths joined by "\n").slice(0,16)` differs. It is not scope fingerprint drift, not git HEAD drift, and not `readiness-contract.ts`, which only decorates the already-computed readiness.

### C. Index-wipe regression

Root cause: full-scan pruning treats the current candidate result set as authoritative before proving it has usable graph nodes. If the current scan returns no results or zero-node error results, `scan.ts` removes prior tracked files and then promotes the new metadata.

Recovery path today is weak: returning to `includeSkills:true` can still leave zero nodes because previous graph content has already been deleted and parser errors can keep manifest metadata stale. Parser crashes contribute by producing zero-node parse results and suppressing candidate-manifest recording, but the primary wipe is the pruning/promotion policy rather than `INSERT OR REPLACE`.

### D. Tree-sitter parser crashes

Parser stack: `tree-sitter-wasms` 0.1.13 and `web-tree-sitter` 0.24.7. Iteration 5 did not reproduce the archived `memory access out of bounds` failures on the current `.opencode` JS/TS candidate set, so the exact 10 files remain UNKNOWN from available artifacts.

The actionable bug is independent of reproducing the OOB: parser runtime exceptions are converted into `ParseResult` objects with `parseHealth:"error"` and then persisted, replacing prior nodes and edges with zero-node state. OOB handling should preserve prior graph content, store durable diagnostics, and classify backend runtime failures separately from syntax-recovered parses.

## RECOMMENDED REMEDIATION SCOPE

Propose Phase 014 under `012-real-world-usefulness-test`, or sibling 015 if Phase 014 is already reserved.

1. **Scope policy and runtime flags**
   - `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts`: keep user-codebase defaults; validate maintainer-mode env CSV values and check selected skill existence.
   - `.codex/config.toml`: add or document `SPECKIT_CODE_GRAPH_INDEX_SKILLS`, `AGENTS`, `COMMANDS`, `SPECS`, and `PLUGINS` only for framework-maintainer profiles.
   - `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md`: document that no env vars are needed for default end-user project-code indexing; maintainer-mode flags affect scan plus query-readiness and require MCP restart.

2. **Safe scan promotion**
   - `code_graph/handlers/scan.ts`: compute previous stats before pruning; quarantine zero-node or severe-drop full scans; promote scope/git/provenance only after usable scans.
   - `code_graph/lib/code-graph-db.ts`: reject orphan edge insertion and run cleanup after destructive pruning.
   - `code_graph/lib/structural-indexer.ts` and `code_graph/lib/ensure-ready.ts`: preserve prior per-file graph when parse health is `error`.

3. **Parser diagnostics**
   - `code_graph/lib/tree-sitter-parser.ts`: distinguish syntax-recovered parses from parser backend runtime crashes.
   - `code_graph/lib/code-graph-db.ts`: add parse diagnostic storage keyed by file path.
   - `code_graph/handlers/scan.ts` and status handlers: expose affected filenames and full diagnostic counts without truncating the only durable evidence.

4. **Readiness contract and guarded recovery**
   - `code_graph/lib/ensure-ready.ts`: add machine-readable reason codes and auto-rescan safety classification.
   - `code_graph/lib/readiness-contract.ts`: project reason codes and safety fields into public readiness blocks without owning the decision.
   - `code_graph/handlers/query.ts`, `context.ts`, `verify.ts`, `detect-changes.ts`: centralize read-path readiness policy and enable guarded inline full scans only for safe causes after scan promotion is protected.

5. **Seed handoff compatibility**
   - `code_graph/handlers/context.ts`, `code_graph/lib/seed-resolver.ts`, and `schemas/tool-input-schemas.ts`: accept raw CocoIndex MCP result shape: `file_path`, `start_line`, `end_line`, `content`.
   - `.opencode/skills/mcp-coco-index/references/tool_reference.md`: update examples to live snake_case fields or document the adapter contract.
   - `handlers/memory-search.ts`: stop presenting memory rows as actual CocoIndex availability unless channel evidence exists.

6. **Hooks and plugin smoke rollout**
   - `mcp_server/hooks/gemini/README.md`, `claude/README.md`, `copilot/README.md`, root `hooks/README.md`: document startup, compact, stop, prompt, OpenCode plugin/bridge, and smoke contracts.
   - `mcp_server/hooks/*`: consider a uniform `--smoke` or runtime-specific offline preflight contract.

7. **Advisor staleness watchdog**
   - `skill_advisor/handlers/advisor-rebuild.ts`: repair unless freshness and trust state are both live.
   - `context-server.ts`: verify artifact/trust postconditions before publishing startup-scan live generation.
   - Advisor tests: add mixed `freshness:"live"` plus `trustState.state:"absent"` fixtures.

8. **Test coverage additions**
   - Add zero-node full-scan preservation/quarantine regression.
   - Add parser-error preservation regression with prior clean graph.
   - Add scope-aware verify preflight tests.
   - Add raw CocoIndex result seed ingestion tests.
   - Add env invalid-token and nonexistent-skill selection tests.
   - Add read-path safe-auto-rescan fixture after safety fields land.

## RECOMMENDED .env / opencode.json SNIPPET

```bash
# DEFAULT (recommended for end users):
# No env vars needed. Code graph indexes your project code automatically.
# `.opencode/` is excluded by design — you don't typically need to navigate
# the framework backend with the code graph.

# MAINTAINER MODE (only if you're contributing to this framework):
export SPECKIT_CODE_GRAPH_INDEX_SKILLS=true   # opt in to indexing .opencode/skills/**
export SPECKIT_CODE_GRAPH_INDEX_AGENTS=true   # opt in to indexing .opencode/agents/**
export SPECKIT_CODE_GRAPH_INDEX_COMMANDS=true # opt in to indexing .opencode/commands/**
export SPECKIT_CODE_GRAPH_INDEX_SPECS=true    # opt in to indexing specs/**
export SPECKIT_CODE_GRAPH_INDEX_PLUGINS=true  # opt in to indexing plugins/**
```

```json
// opencode.json maintainer-mode snippet
{
  "mcp": {
    "spec_kit_memory": {
      "environment": {
        "SPECKIT_CODE_GRAPH_INDEX_SKILLS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_AGENTS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_COMMANDS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_SPECS": "true",
        "SPECKIT_CODE_GRAPH_INDEX_PLUGINS": "true"
      }
    }
  }
}
```

For Codex MCP startup parity in maintainer mode only, mirror the same keys under `[mcp_servers.spec_kit_memory.env]` in `.codex/config.toml` or launch Codex with an external env file that sets them before the MCP server starts. Do not recommend these flags as the default for new template users.

## NEGATIVE KNOWLEDGE (ruled out / non-issues)

- Default exclusion of `.opencode/**`, `specs/**`, and `plugins/**` is not an end-user bug; it is the intended user-codebase scope.
- The native blocked-read message was not scope fingerprint drift; it matched candidate manifest drift plus the read-path "inline full scan skipped" suffix.
- `readiness-contract.ts` is not the drift detector and is not the right place to implement auto-rescan decisions.
- The zero-node wipe is not caused by `INSERT OR REPLACE`; the destructive path is full-scan pruning plus promotion.
- Current artifacts do not identify the exact 10 files that hit `memory access out of bounds`; a fresh parser probe did not reproduce OOB on the current candidate set.
- Startup hook paths did not import network clients; prompt-time advisor subprocess/bridge paths are a separate concern.
- E040 was not verified as an advisor_rebuild-specific regression in current evidence; observed E040 references map to memory/search error surfaces.
- `code_graph_verify` is a gold-query verifier, not a full graph health verifier.
- `memory_search` CocoIndex telemetry is not evidence that raw CocoIndex seeds work in `code_graph_context`.

## ITERATION INDEX

- iter-001: Issue A (default scope) · P0=1 P1=1 P2=1
- iter-002: Issue A env/query verification · P0=0 P1=1 P2=1
- iter-003: Issue B (drift detector) · P0=0 P1=2 P2=1
- iter-004: Issue C (index wipe) · P0=1 P1=2 P2=1
- iter-005: Issue D (tree-sitter parser crashes) · P0=1 P1=2 P2=1
- iter-006: Hooks/plugin payloads · P0=0 P1=2 P2=3
- iter-007: Advisor staleness + rebuild · P0=0 P1=2 P2=1
- iter-008: CocoIndex/code graph/memory seed contracts · P0=0 P1=2 P2=1
- iter-009: Readiness auto-rescan opportunity · P0=0 P1=2 P2=2
- iter-010: Verify and test coverage · P0=0 P1=3 P2=1

## CONVERGENCE NOTE

10 iterations complete. New-finding counts by iteration were 3, 2, 3, 4, 4, 5, 3, 3, 4, 4. The raw rate did not converge downward because later passes shifted from root causes into hook docs, advisor staleness, seed contracts, readiness policy, and test coverage. After dedupe plus the 2026-05-06 design-intent correction, the root-cause blocker set is two P0s. P1/P2 items mostly describe the work needed to prevent recurrence and make the runtime surface diagnosable, with maintainer-mode scope/config ergonomics explicitly demoted to P2.
<!-- /ANCHOR:research -->
