---
title: "Deep Research: Devin CLI as MCP Host — Feasibility for Spec-Kit Memory, Code Graph, and Skill Advisor"
description: "Resolved Open Question 3 of 029-cli-devin-revival: Can Devin CLI genuinely host this repo's three MCP servers? Iteration-by-iteration synthesis with concrete gaps, policy, and phase shape."
trigger_phrases:
  - "devin mcp host"
  - "devin mcp integration"
  - "008-devin-mcp-host-integration"
  - "devin stdio mcp"
  - "spec-kit-memory devin"
  - "code-graph devin"
  - "skill-advisor devin"
importance_tier: important
contextType: research
version: 1.0
---

# Deep Research: Devin CLI as MCP Host — Feasibility for the Three Repository MCP Servers

> **Direct resolution of Open Question 3** in `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/spec.md`. The original `cli-devin` deprecation (`z_archive/022-cli-devin-deprecation/context/context-report.md`) explicitly left this surface untouched; this packet re-opens it for the current Devin CLI product (`v3000.2.17`).

## Executive Summary

**Verdict: Bringing Devin-as-MCP-host into the revival is worthwhile as a separate, additive integration phase (`008-devin-mcp-host-integration`) — but it should NOT be folded into the existing CLI-executor phases (`002`–`007`).** The protocol fit between Devin's current `devin mcp {add,list,get,remove,login,logout,enable,disable}` surface and the three repository servers (`mk-spec-memory`, `mk_code_index`, `mk_skill_advisor`) is direct; the remaining questions are operational (Linux cold start, root-directory assumption, embedding/network, advisor/memory-write trust boundary).

All four key research questions are answered. The Devin CLI's MCP-host surface is real, current, and matches the stdio contract the three servers already implement. Three transport-level findings plus four operational gaps plus one recommended policy shape are recorded. The clean-session live verification matrix is the durable acceptance gate and must run inside a real Devin Linux session before the new phase is opened.

---

## 1. OVERVIEW & SCOPE

### Research Topic
`devin-as-mcp-host-feasibility` — confirm whether Devin CLI's current MCP-host surface (`devin mcp add/list/get/remove/login/logout/enable/disable`, project-scoped `.devin/config.json`, stdio `command`/`args`/`env` schema) can host the three local MCP servers shipped by this repository (`mk-spec-memory`, `mk_code_index`, `mk_skill_advisor`), and decide whether the surface belongs in the cli-devin revival.

### Spec Folder
`.opencode/specs/cli-external-orchestration/029-cli-devin-revival` (Phase Parent; this packet is research-owned, lives at `research/` per the root-spec artifact-root resolution).

### Mode
`:auto` — autonomous, all 5 iterations ran without approval gates (`--stop-policy=max-iterations`).

### Executor
`cli-codex` with `gpt-5.6-luna`, `reasoning_effort=xhigh`, `service_tier=fast`, `sandbox=workspace-write`, `timeoutSeconds=1500`.

---

## 2. KEY QUESTIONS (from parent spec.md Open Question 3)

| # | Question | Resolution |
|---|---|---|
| 1 | What is the real Devin CLI MCP surface (subcommands, config schema, transport options)? | **Answered.** Confirmed against current `docs.devin.ai/cli/extensibility/mcp/overview` + `configuration` and live `devin --version`/`devin mcp --help`/`devin mcp add --help`. |
| 2 | What do spec-kit-memory, code-graph, and skill-advisor MCP servers actually require (transport, env, auth, working directory)? | **Answered.** All three are stdio-only (`StdioServerTransport` in source); require Node ≥ 20.11.0, repo-root `cwd`, build/`npm install`/SQLite+native deps, optional embedding cascade. |
| 3 | How well does Devin's MCP surface match what these three servers need? Concrete gap list. | **Answered.** Direct fit; four operational gaps: (P1) no `cwd` field, (P1) cold bootstrap / native modules, (P1) embeddings/network, (P1) advisor/memory-write trust boundary. |
| 4 | Is bringing this surface into the cli-devin revival worthwhile, and if so what would a new phase need to cover? | **Answered.** Yes — but as a separate additive phase `008-devin-mcp-host-integration`, not folded into phases 002–007. The acceptance boundary is a clean Linux Devin session with explicit rollback and permission/trust criteria. |

---

## 3. METHODOLOGY

| Step | Tool | Outcome |
|---|---|---|
| Init | `resolveArtifactRoot()`, lock acquisition, config/state/strategy/registry file creation | Packet established at `research/` under spec folder; `lineageMode=new`, `generation=1`, `sessionId=research-devin-mcp-host-2026-07-24` |
| Loop | `codex exec` (cli-codex LEAF dispatch), `runAuditedExecutorCommand` + `enforceWriteContainment` per iteration, `verify-iteration.cjs` post-dispatch gate, `reduce-state.cjs` reducer sync | 5 iterations dispatched; each produced narrative + delta + state-log record; 2 auto-reverted containment events on out-of-scope writes by the LEAF (audit-only, no data loss) |
| Resource map | Reducer with `--emit-resource-map` | `research/resource-map.md` emitted |
| Convergence | `--stop-policy=max-iterations` (default `convergence` overrode); forced all 5 iterations | newInfoRatio trend: 0.84 → 0.78 → 0.62 → 0.44 → 0.31; converging toward 0.05 threshold |
| Synthesis | Manual compile of `research.md` (this file) from 5 iteration narratives + reducer registry | This document |

---

## 4. FINDINGS — DEVIN CLI MCP SURFACE (CURRENT)

### 4.1 Real Devin MCP commands (verified)
- `devin mcp add <name> -- <command> [args...]` — register stdio server
- `devin mcp add <name> --url <url>` — register HTTP/SSE server
- `devin mcp list` / `get` / `remove` / `enable` / `disable` — lifecycle management
- `devin mcp login` / `logout` — OAuth for remote servers only (NOT used by the three local servers)

### 4.2 Stdio schema (matches what the three servers need)
```json
{
  "command": "node",
  "args": [".opencode/bin/mk-spec-memory-launcher.cjs"],
  "env": { "...": "..." },
  "disabled": false
}
```
This is a direct field-rename from OpenCode's `environment` to Devin's `env`. No HTTP wrapper or remote endpoint is required.

### 4.3 Scopes and config locations
- Local (default, gitignored): `.devin/config.local.json`
- Project (committed): `.devin/config.json` — supports `permissions`, `mcpServers`, `read_config_from` only
- User: `~/.config/devin/config.json`

### 4.4 Permission matcher syntax (per `docs.devin.ai/cli/extensibility/mcp/overview#permission-control`)
- `mcp__<server>__<tool>` — exact allow/deny by tool
- `mcp__<server>__*` — per-server wildcard
- `mcp__*` — all-MCP wildcard (NOT recommended)

**Unknown:** whether the `<server>` component is normalized (hyphen → underscore) before emission. Devin documentation shows hyphenated server keys in config but never states a normalization rule. Iteration 003 marked this as a clean-session verification item, not confirmed Devin behavior.

### 4.5 OAuth boundary
The three servers do NOT require Devin OAuth or `devin mcp login`. Optional memory-provider credentials (`OPENAI_API_KEY`, `VOYAGE_API_KEY`) are server environment variables, not host authentication. Devin's HTTP/SSE OAuth machinery is irrelevant unless a future phase exposes these servers remotely.

---

## 5. FINDINGS — REPOSITORY MCP SERVERS

### 5.1 mk-spec-memory (`opencode.json:18-23`)
- **Transport:** `StdioServerTransport` (`system-spec-kit/mcp-server/context-server.ts:16,2553-2554`)
- **Runtime:** Node ≥ 20.11.0; SQLite/native deps; repo-local DB; optional embeddings cascade (Ollama → hf-local → OpenAI/Voyage)
- **Working dir:** Repo root (`mk-spec-memory-launcher.cjs:1228-1230,1518-1528` forces child `cwd` to repo root)
- **Trust boundary:** Caller marked trusted by default unless transport metadata opts out (`context-server.ts:807-825`); NO server-side gate for `memory_save`/`memory_update`/`memory_delete` etc.

### 5.2 mk_code_index (`opencode.json:47-52`)
- **Transport:** `StdioServerTransport` (`system-code-graph/mcp-server/index.ts:15,136-139`)
- **Runtime:** Node/npm; TypeScript build; SQLite + tree-sitter/WASM; repo-local graph DB
- **Working dir:** Repo root (`mk-code-index-launcher.cjs:1357-1361,1611-1615`)
- **Trust boundary:** No server-side caller-trust gate; MCP permission matchers only.

### 5.3 mk_skill_advisor (`opencode.json:69-74`)
- **Transport:** `StdioServerTransport` (`system-skill-advisor/mcp-server/advisor-server.ts:10,311-312`); caller context tagged `transport: 'stdio'` at `:221-229`
- **Runtime:** Node/npm; package-local SQLite; sibling `system-spec-kit/shared`; startup scan/watcher; optional shared embedder
- **Working dir:** Repo root (`mk-skill-advisor-launcher.cjs:1173-1176,1275-1280`)
- **Trust boundary:** `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` (set in `opencode.json:56-65`) allows transport-absent callers to use mutation tools. **DO NOT COPY THIS INTO DEVIN SHARED CONFIG.**

---

## 6. OPERATIONAL GAPS (P1 EACH)

| Gap | Status | Resolution |
|---|---|---|
| **Working-directory assumption** | Devin MCP config has no `cwd` field. Install guides require repo root (`system-code-graph/INSTALL-GUIDE.md:70-77`, `system-skill-advisor/INSTALL-GUIDE.md:48-55`). Launchers normalize child CWD to root, but Devin must invoke `node .opencode/bin/...` from repo root first. | Smoke-test in real Devin project session; document root requirement. |
| **Cold bootstrap and native modules** | Launchers may run `npm install`/`npm ci` and TypeScript builds on first start. `better-sqlite3`, `sqlite-vec`, tree-sitter/WASM must build or resolve on Devin's Linux. Feasible but unverified. | Verify in Devin snapshot; do not assume prebuilt artifacts. |
| **Memory embeddings / network** | `mk-spec-memory` cascade: Ollama → hf-local (~250–600 MB download on first use) → OpenAI/Voyage. Devin may not have Ollama. | Choose and verify Devin-compatible embedding tier; network allowlist; cache behavior. |
| **Advisor / memory-write trust** | Devin MCP matchers cannot replace server-side trust. Spec-kit memory lacks an independent caller-trust gate. | Devin policy must DENY `memory_save`/`memory_update`/`memory_delete`/lifecycle tools; advisor mutation requires explicit maintainer opt-in. |

---

## 7. RECOMMENDED PHASE SHAPE — `008-devin-mcp-host-integration`

### 7.1 Why additive (not folded into 002-007)
- The MCP surface is a host-level integration, not a CLI-executor or hook-adapter concern.
- Phase 002 restores `cli-devin` as an executor; phase 003 builds its skill packet; phase 004 adds hook adapters. None of these need the MCP-host surface.
- Mixing concerns risks destabilizing the executor/hook roll-out (highest priority surfaces) with unverified Devin-only behavior.

### 7.2 Phase contents (proposed)
1. `.devin/config.json` project-level entries for all three launchers, with `.devin/config.local.json` for secrets and optional provider overrides.
2. Clean Devin-session smoke test: `devin mcp add/list/get/remove/enable/disable`, `tools/list` discovery, and at least one read-only call per server.
3. Linux/Node ≥ 20.11.0 dependency bootstrap, native module loading, database path containment, cold-start timing/evidence.
4. Deliberate embedding profile (local Ollama, hf-local, or cloud); no silent dependency on developer laptop daemons.
5. Permission tests for `mcp__mk_spec_memory__*`, `mcp__mk_code_index__*`, `mcp__mk_skill_advisor__*`, including advisor mutation denial/approval behavior.
6. Manual rollback path: disable/remove the three project entries without deleting repository databases or source files.

### 7.3 Two-tier permission policy (recommended)
**Tier 1 — shared project config:**
- 3 stdio server entries
- NO advisor trust-default env var
- Exact read-only MCP allows (per-tool, not server-wide wildcard)
- Explicit denies or asks for memory and graph mutations
- Default prompting for everything else

**Tier 2 — maintainer-local override (`.devin/config.local.json`):**
- Optional provider secrets
- Explicit advisor trust-default opt-in ONLY for a maintainer who accepts the mutation risk
- NOT committed; NOT silently inherited by other sessions

### 7.4 Acceptance gate (must pass before phase opens)
A clean Devin Linux session must prove:
- Actual namespaced tool names (resolved from real `tools/list`)
- Read-only discovery and calls succeed
- Denial or prompting for `memory_save`/`memory_update`/`memory_delete` etc.
- Denial of advisor mutations when trust default is omitted
- Explicit maintainer opt-in behavior
- No effect from a broad server-level grant on the intended deny rules
- Three relative launcher commands resolve from repo root in fresh, resumed, sandboxed, and handed-off sessions

---

## 8. ELIMINATED ALTERNATIVES

| Alternative | Why ruled out |
|---|---|
| Fold MCP host into phase 002 (executor support) | Different surface — host-level config, not dispatch executor. Risks destabilizing highest-priority phase. |
| Fold MCP host into phase 003 (skill packet) | Skill packet is per-executor-mode; MCP host is a sibling capability. |
| Fold MCP host into phase 004 (hook adapters) | Hook adapters cover PreToolUse/PostToolUse lifecycle, not MCP registration. |
| Reject MCP-host scope entirely | Loses a real, protocol-aligned Devin capability. Three servers would be unreachable from Devin. |
| Hand-roll HTTP/SSE wrappers for the three stdio servers | Pointless — Devin supports stdio natively. Adds operational surface for no protocol gain. |
| `devin mcp login` for the three local servers | Local servers don't use OAuth; login is for remote MCP servers only. |
| Server-wide `mcp__*` wildcard grant | Hidden mutation surface; violates least-privilege. |
| Copy `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` into shared Devin config | Replicates a boundary designed for OpenCode's transport model onto Devin. Iteration 002 strongly advises against this. |

---

## 9. DIVERGENCE MAP

- **Completed pivots:** 0
- **Failed pivots:** 0
- **Audited overrides:** 0
- **Saturated:** none yet
- **Pivot lineage:** none yet
- **Remaining frontier:** Clean Linux Devin session (acceptance matrix above); namespace spelling verification; embedding tier selection; advisor/memory-write trust policy validation.

The research converged along a single linear axis (Devin MCP surface → server requirements → fit → policy → phase shape) — no divergent pivots were required. This is appropriate given the bounded scope and the four-question research charter.

---

## 10. OPEN QUESTIONS (FORWARDED TO PHASE 008 ACCEPTANCE)

The following carry forward as explicit acceptance gates for any future phase:

1. Does a clean Devin Linux session successfully bootstrap all three launchers and complete MCP `tools/list` discovery?
2. Which embedding tier is reliable and acceptable in Devin's sandbox, especially on first start without Ollama?
3. Does Devin invoke project-scoped relative commands from the repository root in all supported session modes (fresh / resumed / sandboxed / handed-off)?
4. Does Devin normalize hyphenated server names to underscores in emitted tool names, and do deny rules match that normalized form?
5. Does a project-level deny survive a session-level "allow all tools on this server" grant?
6. What is the least-privilege Devin permission/trust policy for advisor mutation tools and memory writes? *(answered as design intent in iteration 002; live validation still required)*
7. Can the live `devin mcp list/get/enable/disable` commands be exercised outside this shell's rolling-log permission failure (a local environment-only limitation)?

---

## 11. WHAT WORKED

- **Iteration 1 (broad Devin MCP + three-server boundary map, 0.84 ratio):** Highest-leverage single iteration. Set the protocol-fit verdict and named the four operational gaps in one pass.
- **Iteration 2 (least-privilege policy, 0.78 ratio):** Pulled the explicit deny list out of `system-spec-kit/mcp-server/tool-schemas.ts` and the advisor trust boundary from `opencode.json`.
- **Iteration 4 (pre-init namespace spelling clarification, 0.44 ratio):** Correctly bounded the unknown to a clean-session verification rather than guessing.
- **Iteration 5 (working-directory feasibility, 0.31 ratio):** Traced all three launchers' CWD normalization back to repo root; closed out the loop with the phase-shape recommendation.

## 12. WHAT FAILED

- **Iteration 3 (namespace spelling, 0.62 ratio):** Half of the iteration's plan was a live `devin mcp list` probe that aborted on rolling-log init in the current shell. The hypothesis could not be confirmed in this environment — explicitly forwarded to clean-session acceptance rather than guessed.
- **`devin mcp list` execution:** Local-shell rolling-log permission failure (not a Devin defect; not data-loss). Forwarded as a clean-session requirement.

## 13. RULED OUT DIRECTIONS

- Direct `devin mcp login` for the three local servers (no OAuth needed).
- Server-wide `mcp__*` wildcard grants (hidden mutation surface).
- Folding MCP-host scope into phases 002–007 (wrong surface; risks destabilizing core revival).
- Hand-rolled HTTP/SSE wrappers (unnecessary; stdio supported natively).
- Copying OpenCode's `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` into shared Devin config (wrong trust model for Devin's permission surface).

## 14. CONVERGENCE REPORT

- **Stop reason:** `maxIterationsReached` (per `--stop-policy=max-iterations`)
- **Total iterations:** 5
- **Questions answered:** 4 / 4
- **Open questions carried forward:** 7 (acceptance gate items)
- **Convergence threshold:** 0.05 (not reached)
- **Last 3 iteration ratios:** 0.62 → 0.44 → 0.31 (steady decline toward threshold; expected for this topic shape)
- **Convergence score (latest):** 0.31
- **Divergence summary:** No divergent pivots required; research converged linearly along the four-question charter.
- **Containment events:** 2 auto-reverted out-of-scope writes by the codex LEAF (recorded in state log; no data loss; suggests tightening the LEAF prompt's allowed-write-paths reminder if rerun).
- **Route proof:** every iteration record carries `target_agent=deep-research`, `agent_definition_loaded=true`, `resolved_route="Resolved route: mode=research target_agent=deep-research"`. ✓

---

## 15. SPEC.MD WRITE-BACK (Open Question 3)

The bounded generated findings fence for this research is written into the parent `spec.md` under the **Open Questions** anchor. The fenced block (bounded, non-destructive) carries:

- The verified Devin CLI MCP surface summary (section 4)
- The four operational gaps (section 6)
- The phase-shape recommendation `008-devin-mcp-host-integration` (section 7)
- The two-tier permission policy (section 7.3)

The original Open Question 3 wording is preserved above the fence so the audit trail remains intact; the fence adds a "Resolution Status: RESOLVED PROVISIONALLY — needs live Devin Linux acceptance" marker.

---

## 16. REFERENCES

- **Devin official documentation (live, 2026-07-23):**
  - https://docs.devin.ai/cli/extensibility/mcp/overview
  - https://docs.devin.ai/cli/extensibility/mcp/configuration
  - https://docs.devin.ai/cli/extensibility/configuration
  - https://docs.devin.ai/cli/reference/configuration/config-file
  - https://docs.devin.ai/cli/reference/permissions.md
- **Phase 001 contract pin:** `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/001-devin-contract-pin/implementation-summary.md`
- **Original deprecation context:** `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/z_archive/022-cli-devin-deprecation/context/context-report.md`
- **Repository MCP sources:**
  - `system-spec-kit/mcp-server/{context-server.ts, tool-schemas.ts, handlers/memory-save.ts, tools/memory-tools.ts, tools/lifecycle-tools.ts}`
  - `system-code-graph/mcp-server/{index.ts, tool-schemas.ts}`
  - `system-skill-advisor/mcp-server/{advisor-server.ts}`
  - `opencode.json` (lines 18–85)
- **Launcher entrypoints:**
  - `.opencode/bin/mk-spec-memory-launcher.cjs` (lines 1228–1230, 1518–1528)
  - `.opencode/bin/mk-code-index-launcher.cjs` (lines 1357–1361, 1611–1615)
  - `.opencode/bin/mk-skill-advisor-launcher.cjs` (lines 1173–1176, 1275–1280)
- **Install guides:**
  - `system-code-graph/INSTALL-GUIDE.md:70-77, 103-114`
  - `system-skill-advisor/INSTALL-GUIDE.md:48-55`

---

## 17. ARTIFACT INDEX

| Path | Description |
|---|---|
| `research/deep-research-config.json` | Run configuration |
| `research/deep-research-state.jsonl` | Append-only state log (15 records: 5 iter + events) |
| `research/deep-research-strategy.md` | Strategy / progress tracker |
| `research/deep-research-dashboard.md` | Auto-generated dashboard |
| `research/findings-registry.json` | Reducer-owned registry |
| `research/resource-map.md` | Emitted at convergence |
| `research/research.md` | This synthesis |
| `research/iterations/iteration-{001..005}.md` | Per-iteration narratives |
| `research/deltas/iter-{001..005}.jsonl` | Per-iteration delta streams |
| `research/prompts/iteration-{1..5}.md` | Rendered dispatch prompt packs |
| `research/dispatch-receipts/dispatch-research-i{1..5}-g1.{intent,completion}.json` | Audit receipts (HMAC-signed) |

---

*Generated by deep-research loop `research-devin-mcp-host-2026-07-24`, generation 1, lineage mode `new`. Stopped by `--stop-policy=max-iterations` after 5 iterations. Converging trend: 0.84 → 0.78 → 0.62 → 0.44 → 0.31.*