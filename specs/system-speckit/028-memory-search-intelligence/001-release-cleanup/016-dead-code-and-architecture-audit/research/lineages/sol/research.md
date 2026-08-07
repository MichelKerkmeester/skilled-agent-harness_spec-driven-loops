# Research Synthesis - Sol Lineage

**Session:** `fanout-sol-1785133613018-3fbdzo`  
**Executor:** `cli-opencode` / `openai/gpt-5.6-sol`  
**Stop reason:** `maxIterationsReached` (10/10 forced-depth iterations)  
**Scope:** `.opencode/`, root runtime configuration, and runtime mirrors. `.opencode/specs/` excluded from findings.

## Executive Summary

Ten divergent passes produced ten evidence-backed findings: one P1 split-state risk, eight P2 architecture/placement issues, and one P3 residue issue. The adversarial passes found **zero files that meet the proof threshold for CAT-1 dead code or safely deletable CAT-2 legacy code**. Several attractive deletion candidates are live through CI, plugin spawning, manual operator use, fallback injection, or dynamic routing.

The highest-risk concrete issue is duplicate skill-advisor SQLite authority under both `mcp-server/` and `mcp_server/`. The highest-leverage simplifications are the launcher family, three shared-payload copies, shadow resume stack, seven compiled-routing compilers, dual command representations, and three agent packaging surfaces.

## Taxonomy

| Category | Meaning | Confirmed count |
|---|---|---:|
| CAT-1 | Dead or unreachable code | 0 |
| CAT-2 | Superseded or safely deletable legacy files | 0 |
| CAT-3 | Backup, scratch, log, or generated residue | 1 |
| CAT-4 | Misplaced or non-portable files/state | 3 |
| CAT-5 | Architecture and responsibility drift | 6 |
| CAT-6 | Over-engineered or duplicated subsystems | 7 |

Counts overlap where one finding spans multiple categories.

## Ranked Findings

### SOL-01 P1: Split skill-advisor database authority

- **Category:** CAT-4, CAT-5
- **Path:** `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`
- **Evidence:** The canonical launcher state file records the underscore database path, while current OpenCode and Codex configs name the hyphenated path. Both directories contain distinct SQLite and lease files with different inodes and sizes. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/database/.mk-skill-advisor-launcher.json:7] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/database/.mk-skill-advisor-launcher.json:8] [SOURCE: file:opencode.json:55] [SOURCE: file:.codex/config.toml:24]
- **Risk:** Concurrent or stale runtimes can observe different advisor generations and write divergent lease/state databases.
- **Simpler shape:** One canonical directory, with startup refusal or explicit migration when the underscore alias exists. Migration requires daemon quiescence and database backup; this audit does not authorize it.
- **Proof command:** `git status --short -- ".opencode/skills/system-skill-advisor/mcp_server" && ls -li ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite" ".opencode/skills/system-skill-advisor/mcp-server/database/skill-graph.sqlite" ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph-daemon-lease.sqlite" ".opencode/skills/system-skill-advisor/mcp-server/database/skill-graph-daemon-lease.sqlite"`
- **Unknown:** The process or inherited environment still selecting the underscore path.

### SOL-02 P2: Launcher supervision is large and policy-split

- **Category:** CAT-5, CAT-6
- **Path:** `.opencode/bin/mk-spec-memory-launcher.cjs`
- **Evidence:** Three launcher files and three shared supervision helpers total 8,457 lines. Package documentation explicitly states that spec-memory supports daemon re-election/adoption while code-index and skill-advisor stop with their child. [SOURCE: file:.opencode/bin/README.md:106] [SOURCE: file:.opencode/bin/README.md:114]
- **Simpler shape:** A shared launcher kernel with service-specific build, database, and framing adapters; lifecycle policy should be one explicit capability table.
- **Proof command:** `wc -l ".opencode/bin/mk-spec-memory-launcher.cjs" ".opencode/bin/mk-skill-advisor-launcher.cjs" ".opencode/bin/mk-code-index-launcher.cjs" ".opencode/bin/lib/launcher-ipc-bridge.cjs" ".opencode/bin/lib/launcher-session-proxy.cjs" ".opencode/bin/lib/model-server-supervision.cjs"`
- **Deletion confidence:** None; all launchers are configured runtime entrypoints.

### SOL-03 P2: Isolation policy duplicates shared-payload contracts

- **Category:** CAT-5, CAT-6
- **Path:** `.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts`
- **Evidence:** Spec-memory, skill-advisor, and code-graph carry 1,074, 1,099, and 200-line local payload implementations. Skill-advisor labels its file a local duplicate; CI blocks cross-skill imports and directs code-graph/advisor to local utility copies. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:2] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts:4] [SOURCE: file:.github/workflows/isolation-check.yml:43] [SOURCE: file:.github/workflows/isolation-check.yml:66]
- **Simpler shape:** A versioned neutral contract package or one schema/code-generation source that emits package-local artifacts while testing byte/semantic parity.
- **Proof command:** `wc -l ".opencode/skills/system-spec-kit/mcp-server/lib/context/shared-payload.ts" ".opencode/skills/system-skill-advisor/mcp-server/lib/shared/shared-payload.ts" ".opencode/skills/system-code-graph/mcp-server/lib/shared/shared-payload.ts"`
- **Deletion confidence:** None; all copies have live package consumers.

### SOL-04 P2: Code-graph metrics scaffolding is permanently inert

- **Category:** CAT-6
- **Path:** `.opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts`
- **Evidence:** `isSpeckitMetricsEnabled()` always returns false and both metrics methods are no-ops. Four production modules import the surface, and the README says emission remains inert until code-graph owns a collector. [SOURCE: file:.opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts:5] [SOURCE: file:.opencode/skills/system-code-graph/mcp-server/lib/shared/metrics-stub.ts:9] [SOURCE: file:.opencode/skills/system-code-graph/mcp-server/lib/shared/README.md:105]
- **Simpler shape:** Remove guarded call-site scaffolding until a collector is funded, or implement a local collector and activate the existing seam.
- **Proof command:** `rg -n 'metrics-stub|isSpeckitMetricsEnabled|speckitMetrics' ".opencode/skills/system-code-graph/mcp-server" --glob '*.{ts,md}'`
- **Deletion confidence:** Medium only as a coordinated refactor; deleting the stub alone breaks imports.

### SOL-05 P2: Deep-research maintains a parallel shadow resume architecture

- **Category:** CAT-6
- **Path:** `.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts`
- **Evidence:** The 1,241-line adapter composes ledger, reducer, sealed-artifact, certificate, replay, and effect-recovery layers. Its direct consumer is the 3,426-line shadow-parity harness; neither active deep-research YAML names the adapter. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts:5] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts:21] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts:60]
- **Simpler shape:** Decide explicitly between production promotion and bounded retirement. Until that decision, mark the stack as shadow-only and prevent it from becoming a second undocumented authority.
- **Proof command:** `wc -l ".opencode/skills/system-deep-loop/runtime/lib/deep-research-resume-adapter/deep-research-resume-adapter.ts" ".opencode/skills/system-deep-loop/runtime/lib/deep-research-shadow-parity/harness-adapter.ts" && rg -n 'deep-research-resume-adapter' ".opencode/commands/deep/assets/deep-research-auto.yaml" ".opencode/commands/deep/assets/deep-research-confirm.yaml" ".opencode/skills/system-deep-loop/runtime/lib"`
- **Deletion confidence:** Low; shadow tests and promotion intent must be resolved first.

### SOL-06 P2: Compiled routing preserves program topology and seven compilers

- **Category:** CAT-4, CAT-5, CAT-6
- **Path:** `.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- **Evidence:** Production runtime maps seven hubs to `009-parent-hub-rollout/*` and reads `013-live-activation`. Seven distinct registry compilers total 3,155 lines. The package confirms this tree is generated serving output. [SOURCE: file:.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:29] [SOURCE: file:.opencode/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:31] [SOURCE: file:.opencode/bin/lib/README.md:59]
- **Simpler shape:** One generic compiler plus declarative hub extensions, publishing a runtime-named `hubs/<id>/` closure rather than phase-numbered program directories.
- **Proof command:** `wc -l .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/registry-compiler.cjs && shasum -a 256 .opencode/bin/lib/compiled-routing/009-parent-hub-rollout/*/lib/registry-compiler.cjs`
- **Deletion confidence:** None; dynamic loading is confirmed.

### SOL-07 P2: Deep commands maintain dual live representations

- **Category:** CAT-5, CAT-6
- **Path:** `.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`
- **Evidence:** Four command definitions point to both legacy bodies and compiled contracts. Fallback returns the legacy body; fix mode validates the compiled contract and concatenates it with that body. [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:17] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:83] [SOURCE: file:.opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs:90]
- **Simpler shape:** One structured command source that generates fallback and compiled forms, with YAML remaining the sole execution authority.
- **Proof command:** `rg -n 'legacyBodyPath|compiledContractPath|Buffer.concat' ".opencode/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs"`
- **Deletion confidence:** None until fallback consumers are inventoried and retired.

### SOL-08 P2: Agent mirror maintenance has produced inventory drift

- **Category:** CAT-5, CAT-6
- **Path:** `.opencode/agents/README.txt`
- **Evidence:** `.opencode/agents`, `.claude/agents`, and `.codex/agents` each contain 13 definitions; Codex identifies OpenCode files as conversion sources. Both Markdown READMEs list only 12 and omit the present `deep-alignment.md`. [SOURCE: file:.codex/agents/deep-research.toml:2] [SOURCE: file:.opencode/agents/README.txt:11] [SOURCE: file:.opencode/agents/README.txt:23] [SOURCE: file:.claude/agents/deep-alignment.md:2]
- **Simpler shape:** Canonical semantic agent sources plus runtime-specific frontmatter generators and generated inventories.
- **Proof command:** `for d in .opencode/agents .claude/agents .codex/agents; do printf '%s ' "$d"; git ls-files "$d" | rg -v '/README' | wc -l; done; rg -c '^  [a-z-]+:' ".opencode/agents/README.txt"`
- **Deletion confidence:** None; runtime packaging surfaces are required.

### SOL-09 P2: Hidden scan scripts are workstation-pinned

- **Category:** CAT-4
- **Path:** `.opencode/skills/system-spec-kit/scripts/.scan-one.sh`
- **Evidence:** `.scan-one.sh` and `.scan-validate-all.py` hard-code `/Users/michelkerkmeester/.../Public` for validator and spec roots. Both are committed. [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-one.sh:5] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-one.sh:6] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-validate-all.py:7] [SOURCE: file:.opencode/skills/system-spec-kit/scripts/.scan-validate-all.py:8]
- **Simpler shape:** Resolve repository root from the script location or accept an explicit root argument.
- **Proof command:** `git ls-files -- ".opencode/skills/system-spec-kit/scripts/.scan-one.sh" ".opencode/skills/system-spec-kit/scripts/.scan-validate-all.py" && rg -n '/Users/michelkerkmeester/' ".opencode/skills/system-spec-kit/scripts/.scan-one.sh" ".opencode/skills/system-spec-kit/scripts/.scan-validate-all.py"`
- **Deletion confidence:** Low; benchmark references and operator use should be checked before removal.

### SOL-10 P3: Rotated log generation leaks into git status

- **Category:** CAT-3
- **Path:** `.opencode/logs/dist-freshness-guard.log.1`
- **Evidence:** The repository ignores `*.log`, while the plugin test intentionally retains a `.1` generation. The resulting file is untracked and not ignored. [SOURCE: file:.gitignore:213] [SOURCE: file:.opencode/logs/dist-freshness-guard.log.1:1] [SOURCE: file:.opencode/plugins/tests/mk-dist-freshness-guard.test.cjs:206]
- **Simpler shape:** Ignore `*.log.*` or the bounded `.opencode/logs/*.log.*` family.
- **Proof command:** `git status --short -- ".opencode/logs/dist-freshness-guard.log.1" && if git check-ignore -q ".opencode/logs/dist-freshness-guard.log.1"; then printf 'ignored\n'; else printf 'not-ignored\n'; fi`
- **Deletion confidence:** High for the generated file, but the durable fix is the ignore rule rather than manual cleanup alone.

## Ruled-Out Deletions

| Candidate | Why it is not dead | Proof |
|---|---|---|
| `.opencode/bin/check-no-spec-imports.cjs` | GitHub Actions invokes it; foundation tests import it | `.github/workflows/runtime-no-spec-import.yml:35`, `.opencode/bin/compiled-routing-foundation.vitest.ts:39` |
| `.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs` | OpenCode plugin spawns the bridge | `.opencode/plugins/mk-skill-advisor.js:111` |
| `.opencode/bin/cli-exit-taxonomy-smoke.cjs` | Documented manual operator smoke | `.opencode/bin/README.md:226` |
| `.opencode/commands/deep/assets/legacy/*.body.md` | Renderer consumes them in fallback and fix modes | `render-command-contract.cjs:83-90` |
| `compiled-routing/009-parent-hub-rollout/*` | Runtime engine dynamically loads mapped hub modules | `compiled-route.cjs:31-37,65-81` |
| Root MCP config mirrors | They are symlinks, not independent copies | `readlink .mcp.json .cursor/mcp.json .claude/.utcp_config.json` |

## Convergence Report

| Metric | Value |
|---|---:|
| Iterations completed | 10 / 10 |
| Stop policy | max-iterations |
| Stop reason | maxIterationsReached |
| Average newInfoRatio | 0.669 |
| Final newInfoRatio | 0.12 |
| Confirmed findings | 10 |
| Open causal/policy questions | 3 |
| Blocked stops | 0 |

## Remediation Order

1. Quiesce advisor daemons and determine the writer of the underscore database path before touching either SQLite set.
2. Fix generated-residue hygiene: rotated-log ignore pattern and portable scan roots.
3. Correct agent inventories and decide whether mirror generation should become authoritative.
4. Decide promotion or retirement for the deep-research shadow resume stack.
5. Plan architecture work for launchers, shared payload contracts, compiled-routing compilers, and deep-command representations only with parity baselines and rollback paths.

This lineage is audit-only. No audited source was modified.
