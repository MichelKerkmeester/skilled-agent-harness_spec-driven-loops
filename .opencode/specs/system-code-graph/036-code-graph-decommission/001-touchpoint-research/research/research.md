# Touchpoint Inventory for the Code Graph Decommission — Merged Synthesis

Consolidates three independent research lineages into one inventory. Where the lanes agreed, the
finding is stated once. Where they disagreed, the disagreement is resolved against the repository
and the losing claim is recorded so it does not return.

## Table of Contents

- [1. Provenance](#1-provenance)
- [2. Verdict](#2-verdict)
- [3. What the lanes agreed on](#3-what-the-lanes-agreed-on)
- [4. Findings that survived verification](#4-findings-that-survived-verification)
- [5. Claims refuted against the repository](#5-claims-refuted-against-the-repository)
- [6. Corrections this research forced into the packet](#6-corrections-this-research-forced-into-the-packet)
- [7. Ordering](#7-ordering)
- [8. Per-consumer disposition](#8-per-consumer-disposition)
- [9. Open questions for the decision record](#9-open-questions-for-the-decision-record)
- [10. Limitations](#10-limitations)

## 1. Provenance

| Lane | Executor / model | Iterations | Output | Notes |
|---|---|---|---|---|
| `sol` | cli-codex · `gpt-5.6-sol` · high | 10 / 10 | 15.9 KB | Ran before the `cli-pi` merge landed |
| `glm` | cli-devin · `glm-5-2` (free tier) | 5 / 5 | 17.8 KB | Largest and most precise inventory |
| `grok` | cli-cursor · `cursor-grok-4.5-high` | 5 / 5 | 6.3 KB | Two novel claims, both refuted |

Twenty iterations, `stop_policy=max-iterations`, so no lane stopped early on convergence.

Two lanes flagged timestamp anomalies. `glm`'s is a timezone defect — records stamped with local
time carrying a `Z` suffix, a constant ~2 h offset — not fabricated content. `grok`'s first run
showed drifting future stamps; its second run was clean. Neither affects the findings, but neither
lane's self-reported timeline should be used as evidence of when work happened.

## 2. Verdict

The subsystem cannot be removed as a directory deletion. The live contract spans three physical MCP
registrations, a multi-runtime hook and plugin matrix, a process boundary inside `system-spec-kit`,
agent and command grants across four runtime trees, doctor and deploy wiring, session reapers,
worktree isolation, the skill-advisor graph, CI, and project doctrine that currently lists the tools
as mandatory.

The safe direction is consumer-first: disable the things that fire on every tool call, strip grants,
decouple the boundary, unregister, retire binaries, then delete the tree, then reconcile docs.

## 3. What the lanes agreed on

All three converged independently on the same spine:

- **Three physical MCP registrations** — `opencode.json:69`, `.claude/mcp.json:58`,
  `.codex/config.toml:31`, all launching `.opencode/bin/mk-code-index-launcher.cjs`.
- **Symlink dedupe** — `CLAUDE.md` → `AGENTS.md`; `.mcp.json` and `.cursor/mcp.json` both resolve to
  `.claude/mcp.json`. Three registration pathnames, one physical file. `.claude/CLAUDE.md` is a
  separate small file, not the root symlink.
- **Sweeps require `rg --hidden --no-ignore`.** `--no-ignore` alone returns only the visible matches
  and drops every dot-prefixed control file.
- **`.opencode/specs/**`, changelogs, and benchmark reports are archival** and must be inventoried,
  never edited.
- **Other graph subsystems survive** — Spec Memory's causal and knowledge graphs, the skill-advisor's
  skill graph, and deep-loop's coverage and council graphs are unrelated.
- **Deletion is last.** Every lane put the skill tree at the end of its ordering.

## 4. Findings that survived verification

Beyond the agreed spine, these were verified directly against the repository:

| Finding | Evidence | Lane |
|---|---|---|
| **`launcher-ipc-bridge.cjs` is shared by three launchers** and branches on `serviceName` for `mk-spec-memory`, `mk-code-index`, and `mk-skill-advisor` | `.opencode/bin/lib/launcher-ipc-bridge.cjs:84-100`; required by `mk-spec-memory-launcher.cjs`, `mk-skill-advisor-launcher.cjs`, `mk-code-index-launcher.cjs` | glm |
| `launcher-session-proxy.cjs` is shared the same way | required by the bridge and the launchers | glm |
| **`.pi/agents/**` is a fourth agent mirror** — a regular-file projection, not a symlink | 8 files carry the tool grants and the wedged-daemon paragraph | grok, glm |
| **`deploy-mcp.sh` builds the retiring package** | `deploy-mcp.sh:55` — `build_pkg "code-graph" ".opencode/skills/system-code-graph"` | grok |
| **Installed Codex hooks are a second deployment surface** outside the repo; a clean tracked tree is not evidence | `install-codex-hooks.mjs --check` currently reports drift | sol |
| A fourth freshness hook lives inside spec-kit, not beside its three siblings | `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | sol |
| `shared/code-graph-contracts.ts` may have surviving importers | `GraphFreshness` / `StructuralReadiness` types used independently of the boundary | glm |
| Plugins are auto-discovered from `.opencode/plugins/*.js`; no explicit registration exists | no `opencode.json` plugin block | glm |
| `.opencode/agents/` uses a permissions-block syntax (`code_graph_query: allow`) unlike the other mirrors' frontmatter | `.opencode/agents/context.md:15-17,25` | glm |
| Eleven commands carry grants in `allowed-tools:` | enumerated with line numbers | glm |

## 5. Claims refuted against the repository

Recorded so they are not reintroduced:

| Claim | Source | Verification |
|---|---|---|
| `.pi/mcp.json` is a fourth MCP registration | grok | **False.** Its servers are `sequential_thinking`, `mk-spec-memory`, `mk_skill_advisor`, `code_mode`; zero references to the retiring server. Three registrations remain the complete set, as `sol` concluded. |
| A Pi freshness hook exists at `.pi/extensions/` | grok | **False.** That directory holds six unrelated extensions. The reported hit resolved to a copy under `.worktrees/`. |

`.worktrees/` holds full subsystem copies and will match any sweep. It is neither the working tree
nor an edit target and must be excluded from residual counts — the mechanism behind both false
positives above.

## 6. Corrections this research forced into the packet

The inventory changed the specification, not just confirmed it:

1. **`launcher-ipc-bridge.cjs` was marked for deletion.** It is shared by the two surviving daemons;
   deleting it breaks both. Now strip-only, with `launcher-session-proxy.cjs` added alongside it.
   This was the single highest-consequence error in the packet.
2. **`--no-ignore` was mandated without `--hidden`.** Corrected in nine places; the original would
   have produced a false all-clear at closeout.
3. **`code-graph-contracts.ts` was marked for unconditional deletion.** Now conditional on verifying
   its importers.
4. **Agent mirrors were counted as three.** There are four; the Pi tree arrived mid-packet.
5. **`deploy-mcp.sh` and the installed Codex hooks were absent** from the plan entirely.

## 7. Ordering

The lanes proposed 11-, 13-, and 11-step graphs that agree on the load-bearing edges:

1. Disable what fires continuously — freshness hooks, plugins, post-commit, session reapers.
2. Strip agent and command grants across all four mirrors.
3. Decouple the spec-kit boundary and its importers; regenerate compiled output.
4. Remove the skill-advisor node, lanes, fixtures, and benches; rebuild.
5. Remove the three registrations — reversible while the launchers still exist.
6. Retire launchers and the CLI; strip the two shared libraries.
7. Remove doctor and install resurrection paths, and the deploy build step.
8. Drain processes, leases, and sockets.
9. Delete the skill tree.
10. Reconcile doctrine, READMEs, and counts.
11. Verify, including a classified residual sweep.

One genuine disagreement: `glm` places documentation last, after deletion, on the grounds that
references become dead links; the packet currently updates doctrine before deletion. Both are
defensible. `grok` additionally argues the isolation CI job should be *retargeted to assert absence*
during teardown and dropped only at the end, rather than deleted up front — a better sequencing than
the packet's current "delete the job" step. Both belong in the decision record.

## 8. Per-consumer disposition

Remove outright, except:

| Consumer | Disposition | Risk |
|---|---|---|
| `launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs` | **Strip the code-graph branch, keep the file** | High — breaks two surviving daemons |
| `shared/code-graph-contracts.ts` | Trim to surviving types, or remove once proven unimported | Medium |
| git post-commit hook, session reapers, `mk-spec-memory-launcher.cjs` | Strip code-graph logic only | Medium |
| Skill tree deletion | Remove last | High — irreversible |
| Archival paths | Inventory only | n/a |

## 9. Open questions for the decision record

1. Do ignored databases, quarantine, and audit state need backup before deletion? Git cannot restore
   ignored SQLite, WAL, PID, or lease files — rollback is incomplete without an explicit decision.
2. Which existing worktrees and installed client configs must be migrated or retired?
3. Should the isolation CI job be retargeted as an absence assertion during teardown rather than
   deleted at the start?
4. Does documentation land before or after deletion?
5. Does `code-graph-contracts.ts` have surviving importers?

## 10. Limitations

Static analysis cannot enumerate untracked clones, user-edited client configs outside the known
Codex installation, or live processes on other machines. Occurrence counts are snapshots, not
acceptance numbers — the lanes reported different totals (~384, ~413, and a separate archival count
of 4,364) because each filtered differently. Treat the inventory as the deliverable and the counts as
indicative.

Confidence is high for repository touchpoints: every requested class received a direct sweep in at
least two lanes, and every high-consequence claim in section 4 was re-verified against the
repository rather than accepted from a lane.
