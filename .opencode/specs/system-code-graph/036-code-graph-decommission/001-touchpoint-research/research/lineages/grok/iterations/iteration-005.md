# Iteration 005 — Ordering constraints & rollback risk

## Focus

Ordering constraints and rollback risk for safe decommission vs keep-behind-fallback (Q4), synthesizing prior inventory into a staged plan. Telemetry: newInfoRatio may be lower (analysis-heavy) under max-iterations stopPolicy.

## Actions Taken

1. Verified `/doctor:update` dependency order lists `code-graph` first.
2. Confirmed `deploy-mcp.sh` builds code-graph from skill root.
3. Confirmed OpenCode plugin README documents both mk-code-graph plugins.
4. Built ordered decoupling graph from F1–F22 evidence.

## Findings

### F23 — Recommended decommission order (hard constraints)

```text
0. Inventory freeze (this research) — no live deletes yet
1. Doctrine soft-cutover (optional but low-risk first)
   - AGENTS.md / README search tables → Grep-primary language
   - gate-tool-routing.md constitutional tables
   ROLLBACK: revert doc commits; no runtime break
2. Disable freshness automation BEFORE deleting skill paths
   - .claude/settings.json, .codex/hooks.json, .devin/hooks.v1.json
   - Cursor post-tool-use import path
   - .pi/extensions/code-graph-freshness.ts
   - OpenCode plugins mk-code-graph*.js (disable/remove)
   - git post-commit DB invalidation block
   BREAK IF SKIPPED: hooks shell to missing .cjs → session noise/failures
3. Stub or no-op the spec-kit boundary (KEEP-BEHIND-FALLBACK)
   - code-graph-boundary.ts returns unavailable TrustState
   - passive-enrichment / session-prime / memory-surface / context-server degrade
   - code-index-cli-fallback.ts warm probes exit cleanly
   BREAK IF SKIPPED: MCP memory process errors on missing DB/tools
   ROLLBACK: restore boundary module + skill still present
4. Unregister MCP server (physical configs only — symlink-deduped)
   - opencode.json, .claude/mcp.json, .codex/config.toml, .pi/mcp.json
   - .claude/settings.local.json Bash grant for code-index.cjs
   ROLLBACK: re-add JSON blocks (skill+launcher still present)
5. Retire CLI/bin + lifecycle identity
   - code-index.cjs, mk-code-index-launcher.cjs (+ tests)
   - session-cleanup / orphan-sweeper patterns
   - launcher-ipc-bridge mk-code-index branch
   - mk-spec-memory-launcher canonicalCodeGraphDbDir messaging
   - mcp-route-guard allowlist entry
   - worktree-session.sh skill paths
6. Doctor & deploy surfaces
   - doctor _routes.yaml code-graph target + doctor-code-graph.yaml
   - doctor-update.yaml dependency.order (remove code-graph first node)
   - deploy-mcp.sh build_pkg code-graph
7. Agent/command/template grants
   - context/review/deep-* agents across 4 runtimes
   - create/agent.md, create/skill.md allowed-tools
   - /doctor update.md tool grants
8. Skill-advisor graph + fixtures + bench import removal
9. Delete skill package `.opencode/skills/system-code-graph/`
   - ONLY after 2–8 green
10. Retarget or delete isolation-check.yml jobs that assume dual existence
11. Install-guide / bin README / plugin README cleanup
12. .gitignore path cleanup (optional hygiene)
13. NEVER edit: .opencode/specs/**, changelogs, benchmark reports (ARCHIVAL)
```

### F24 — Remove vs keep-behind-fallback matrix (per consumer class)

| Consumer class | Recommendation | Rationale |
|----------------|----------------|-----------|
| MCP registrations (4 physical) | **Remove** | Server gone; aliases already deduped |
| Freshness hooks/plugins/git | **Remove** | No index to refresh |
| `code-graph-boundary` + enrichment | **Keep stub fallback** then remove | Spec-kit must not hard-crash |
| Agent grants | **Remove grants; keep Grep doctrine** | Already have wedged-daemon fallback language |
| Doctor code-graph route | **Remove** | Owner skill deleted |
| `/doctor:update` order | **Rewrite order** (drop code-graph node) | Currently first dependency |
| isolation-check CI | **Rewrite to absence asserts** then drop | Prevents regression during staged teardown |
| deep-loop coverage-graph | **Keep** | Distinct subsystem (F15) |
| TrustState mentions in deep-research SKILL | **Rewrite lightly** | Doctrine only; not a runtime dep |
| Advisor regression expecting code-graph | **Retarget or delete** | Will fail post-removal |
| `.env.local` maintainer mode | **Operator local** | Untracked; document only |
| Archival specs/changelogs/benchmarks | **Inventory only** | Never propose edits |

### F25 — Rollback risk peaks

1. **Deleting skill before stubbing boundary** → highest blast radius (memory MCP + session hooks).
2. **Unregistering MCP while hooks still call freshness scripts** → noisy failures every tool use.
3. **Removing isolation CI too early** → silent reintroduction of cross-imports during partial teardown.
4. **Leaving create-* templates with MCP tool ids** → new agents scaffolded against dead tools.
5. **doctor-update still ordering code-graph first** → update workflow fails mid-pipeline.

Safe rollback window: keep skill tree + launchers on disk until steps 2–4 validated; config unregister is easily reversible.

### F26 — doctor-update / deploy confirm ordering pressure
[SOURCE: doctor-update.yaml:167,389,397] — `order: ["code-graph", "context-index", ...]`
[SOURCE: deploy-mcp.sh:54-55] — `build_pkg "code-graph" ".opencode/skills/system-code-graph"`
These encode code-graph as a **first-class rebuild peer**, not an optional plugin.

## Questions Answered

- Q4: Ordering graph + remove/fallback matrix + rollback peaks.

## Questions Remaining

- None blocking for phase-1 inventory handoff; implementation sequencing belongs to successor phase `002-decommission-decision-record`.

## Ruled Out

- Big-bang single commit deleting skill + all consumers.
- Deleting coverage-graph / deep-loop runtime with this decommission.
- Editing archival specs as part of removal plan.

## Next Focus

N/A — maxIterations reached; proceed to synthesis.

## SCOPE VIOLATIONS

None.
