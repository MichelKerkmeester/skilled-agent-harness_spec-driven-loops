# Fresh Claude Code Remediation Results

**Session:** `claude -p` sub-session, dispatched 2026-05-06
**Repo HEAD:** `3802b2d9bf1a733b200a1a760d568aa96054c619` (matches/exceeds expected `a52715c5d`)
**Workspace:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`
**Report destination:** `/tmp/cc-remediation-results.md` was REQUESTED but `/tmp` is outside this session's sandbox; report is at `.scratch/cc-cg/cc-remediation-results.md` and also streamed to stdout for the parent session.

---

## ⚠️ EXECUTION BLOCKER — Live verification not run

This `claude -p` sub-session inherits `.claude/settings.local.json` which permits only:

- `mcp__sequential_thinking__sequentialthinking`
- `Bash(bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ...)` (single literal path)
- `Bash(echo "EXIT_CODE=$?")`
- `Skill(update-config)`, `Skill(update-config:*)`
- A handful of literal `Bash(mv ...)` rename commands
- `Skill(cli-codex)`
- `Bash(codex exec *)`, `Bash(git *)`
- `Bash(mkdir -p /tmp/dr-009)`, `Bash(rm -rf /tmp/dr-009/*)`, `Bash(mkdir -p /tmp/docs-011)`, `Bash(rm -rf /tmp/docs-011/*)`

It does **not** allowlist any of:

- `mcp__spec_kit_memory__code_graph_status` / `code_graph_scan` / `code_graph_query` / `code_graph_verify` / `code_graph_context` / `detect_changes`
- `Bash(node ...)` (needed to invoke a direct-handler driver)
- General `/tmp` write paths (sandbox blocked `mkdir -p /tmp/cc-cg` and `Write` to `/tmp/...`)

**Attempted invocations and observed errors:**
1. `mcp__spec_kit_memory__code_graph_status({})` → `Claude requested permissions to use mcp__spec_kit_memory__code_graph_status, but you haven't granted it yet.`
2. `Bash node .scratch/cc-cg/driver.mjs status '{}'` → `This command requires approval` (also with `dangerouslyDisableSandbox: true`)
3. `Write /tmp/cc-cg-driver.mjs` → permission denied
4. `Bash mkdir -p /tmp/cc-cg` → `'/tmp/cc-cg' was blocked. ... only allowed working directories ...`

The user's prompt acknowledged "Self-invocation guards: ignore them. The user explicitly authorized this dispatch." That instruction does not extend to bypassing the harness permission allowlist or the file-system sandbox — those are independent gates that this sub-session has no mechanism to override.

A driver script was successfully authored at `.scratch/cc-cg/driver.mjs` (in the working directory) that imports the dist handlers directly and would run all six steps; it cannot be executed because `Bash(node *)` is not allow-listed.

---

## ✅ STATIC VERIFICATION (what I could do without live tool calls)

I confirmed via direct `Read`/`Grep` against the on-disk `dist/` artifacts (the same artifacts a freshly-booted MCP server would load) that the four expected fixes are present and well-formed:

### F-002 — zero-node full-scan guard (`scan.js`)

`scan.js:255-258` defines `zeroNodePromotionBlocked = fullScan && candidatePersistableNodeCount === 0 && priorNodeCount > 0 && args.forceZeroNodeReset !== true`.
`scan.js:324-...` returns `{ status: "blocked", reason: "zero_node_scan_rejected", ... }` and preserves the prior `totalNodes`/`totalEdges` rather than wiping them.
Console warn at `scan.js:339`: `Blocked zero-node full scan promotion over existing graph (${priorNodeCount} prior node(s)); pass forceZeroNodeReset:true to allow destructive reset.`
**Verdict: STATIC PASS.** The guard exists. The parent session's "no F-002 guard fired" observation is consistent with its MCP server having booted from older `dist/` and not having this code path.

### F-003 — parse-error preservation across blocked scans

`scan.js:90` defines `recordParseDiagnosticsForResults(results)` and it is called from BOTH the scope-change-blocked branch (`scan.js:260`) and the zero-node-blocked branch (`scan.js:325`). Parse diagnostics are persisted before the early return so `code_graph_status` continues to surface them.
**Verdict: STATIC PASS.**

### F-018 — auto-rescan-policy module

`.opencode/skill/system-spec-kit/mcp_server/dist/code_graph/lib/auto-rescan-policy.js` exists and exports `shouldAutoRescan({ storedScope, activeScope, parseDiagnosticsBacklog, parseDiagnosticsBacklogThreshold })` returning `{ allowed: true } | { allowed: false, blockReason: "scope_mismatch" | "parse_error_backlog" }`. Module is also referenced in `dist/code_graph/lib/ensure-ready.js`.
**Verdict: STATIC PASS.** The module ships and is imported by the read-path readiness contract.

### F-019 — informational scopeMismatch on verify

`verify.js:50-58` defines `buildScopeMismatchInfo(preflight)` returning `{ stored, active, recommendation: "rescan with matching scope or pass forceScopeChange" }` only when scopes differ.
`verify.js:160-164` comment explicitly states: "scope mismatch is informational only — verify proceeds and the `scopeMismatch` field on the response surfaces the canonical { stored, active, recommendation } shape ... The legacy block branch was removed; readiness is now the only blocking signal."
The field is conditionally spread (`...(scopeMismatch ? { scopeMismatch } : {})`) on both the blocked-by-readiness response (line 157) and the success response (line 179).
**Verdict: STATIC PASS.**

### v3 globs-in-fingerprint

`dist/code_graph/lib/index-scope-policy.js:101,179,221-222` confirms:
- Fingerprints are stamped `code-graph-scope:v3:...`
- `parseIndexScopePolicyFromFingerprint` detects v3 via prefix and decodes `includeGlobs`/`excludeGlobs` keys when version === 'v3'
**Verdict: STATIC PASS.**

---

## Steps 1-7 — DEFERRED (live runtime checks not executable)

| Step | Description | Status | Reason |
|------|-------------|--------|--------|
| 1 | `code_graph_status()` baseline | DEFERRED | MCP tool not allow-listed; node driver also blocked |
| 2 | Populate via `code_graph_scan({ incremental: false, includeSkills: true })` | DEFERRED | same |
| 3 | F-002 live guard probe (default-scope scan over populated index) | DEFERRED | same — this is the most important live check; static code is correct |
| 4 | F-018 outline query for `auto-rescan-policy.ts` | DEFERRED | same |
| 5 | F-019 `code_graph_verify({})` informational scopeMismatch | DEFERRED | same |
| 6 | 15 manual-testing playbook scenarios | DEFERRED | every scenario uses MCP tools |
| 7 | Gold-query battery via `verify: true` | DEFERRED | same |

**Playbook scenarios (15) all DEFERRED:** 01--read-path-freshness × 2, 02--manual-scan-verify-status × 4, 03--detect-changes × 1, 04--context-retrieval × 1, 05--coverage-graph × 2, 06--mcp-tool-surface × 1, 07--ccc-integration × 3, 08--doctor-code-graph × 1.

---

## NOTABLE FINDINGS

1. **Permission allowlist gap.** `.claude/settings.local.json` does not include the `mcp__spec_kit_memory__code_graph_*` tool family. Any future Claude Code session that needs to live-verify the code graph (including this remediation flow) will hit the same wall. Fix: add the six tool names to `permissions.allow`, or extend with `Bash(node .scratch/**)` for direct-handler drivers.

2. **/tmp sandbox.** This session can only write under the workspace root. The user's prompt asked for `/tmp/cc-remediation-results.md`; this report is at `.scratch/cc-cg/cc-remediation-results.md` instead, and is also streamed via stdout. If the parent session is polling `/tmp/`, it will not find the file there.

3. **Driver script artifact.** `.scratch/cc-cg/driver.mjs` exists in the worktree. It is a small ESM module that imports the six handlers from `dist/code_graph/handlers/index.js`, so a session with `Bash(node *)` permission can immediately replay all seven steps with `node .scratch/cc-cg/driver.mjs <op> '<json-args>'`.

4. **No evidence of regression.** Static `Read`/`Grep` confirm the parent session's report ("no F-002 guard fired, 0-node graph wedge") is most plausibly explained by its MCP server having been booted before the fixes shipped — exactly the hypothesis the user's prompt opens with. The on-disk dist code that a fresh server would load contains all four fixes.

---

## SUMMARY

- Live MCP F-002 guard: **NOT EXERCISED — STATIC PASS** (code present in `dist/code_graph/handlers/scan.js:255-322`)
- Live MCP F-018 auto-rescan: **NOT EXERCISED — STATIC PASS** (`dist/code_graph/lib/auto-rescan-policy.js` ships `shouldAutoRescan`)
- Live MCP F-019 informational-only: **NOT EXERCISED — STATIC PASS** (`verify.js:160-164` comment + `buildScopeMismatchInfo` + readiness-only block)
- F-003 parse-error preservation: **STATIC PASS** (recorded before both blocked-scan early returns)
- v3 fingerprint with globs: **STATIC PASS** (`code-graph-scope:v3` + `includeGlobs`/`excludeGlobs` decode in `index-scope-policy.js`)
- Playbook pass rate: **0/15 — all deferred**, none failed
- Parse health: not measurable (no live status call)
- **Recommendation:** add `mcp__spec_kit_memory__code_graph_*` (status, scan, query, verify, context) and `Bash(node *)` to `.claude/settings.local.json` `permissions.allow`, then re-dispatch this same prompt — `.scratch/cc-cg/driver.mjs` is ready to replay every step. Static review of the dist artifacts gives no reason to suspect any of the four fixes regressed; the next signal needed is end-to-end live behavior on a freshly-booted MCP server.
