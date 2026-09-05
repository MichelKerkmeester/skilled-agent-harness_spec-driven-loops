# Iteration 4: Session-lifecycle registrations and hook identity

## Focus
Angle 2. Whether the eleven session-lifecycle registrations restored at `273767431d` still resolve, and whether hook configs, CI or doctor assets still name a retired surface.

## Findings

### F-I4-001 — The eleven restored registrations are still live and resolve. CONFIRMED. P2 (negative)
`273767431d` restored 11 command registrations: Claude session-prime / session-stop / compact-inject, Codex session-start / session-stop / compact-inject, Cursor session-start / session-end / precompact, Devin session-start / session-stop.
Those commands still sit in the live configs and still point at `runtime/dist/hooks/<runtime>/`. [SOURCE: .claude/settings.json:102] [SOURCE: .codex/hooks.json:8] [SOURCE: .cursor/hooks.json:6] [SOURCE: .devin/hooks.v1.json:8]
The `.claude/hooks/*.js`, `.codex/hooks/*.js`, `.cursor/hooks/*.js`, `.devin/hooks/*.js` and `.opencode/hooks/session-lifecycle/<runtime>/*.js` files are relative symlinks to those dist targets. A broken-symlink scan of those trees returned empty.
Pi was not in the restore commit. Its session adapters live as `.pi/extensions/*.ts` → `runtime/hooks/pi/*.ts` and were already present.
Smallest fix: none on the restore itself.

### F-I4-002 — Devin's live fallback still tells the operator to build `mcp-server`. CONFIRMED. P1
Both Devin SessionStart and Stop fallbacks print `run npm run build in mcp-server` when the compiled adapter cannot resolve. [SOURCE: .devin/hooks.v1.json:8] [SOURCE: .devin/hooks.v1.json:143]
That directory is `runtime/` now. An operator who follows the message will look for a package that D8 retired.
The same string is archived in a hooks research packet as a fixture, citing the old `mcp-server/hooks/...` path. [SOURCE: specs/hooks/002-injection-bloat-reduction/per-prompt-injection-audit/run1-archive/lineages/sol/iterations/iteration-005.md:16]
Smallest fix: change both fallbacks to `run npm run build in runtime`.

### F-I4-003 — Two CI workflows still describe the validator as loading the `mcp-server` package. CONFIRMED. P2
`changed-packet-validation.yml` and `strict-pass-freshness-report.yml` both say the validator imports across "the mcp-server package" and that "the server, shared project and scripts are workspaces". [SOURCE: .github/workflows/changed-packet-validation.yml:24-31] [SOURCE: .github/workflows/strict-pass-freshness-report.yml:32-39]
The install they then run is `system-spec-kit` root + `shared` tsc + `runtime` build + `scripts` npm ci. The comment teaches the old identity to anyone debugging a CI fail.
Smallest fix: rewrite the comments to `runtime`.

### F-I4-004 — Session-lifecycle README still claims a startup continuity section the hook no longer emits. CONFIRMED. P1
The browsability README says `startup` emits a Session Context surface "and, when a cached session summary is accepted, a `Session Continuity` section". [SOURCE: .opencode/hooks/session-lifecycle/README.md:36]
The live handler says the startup brief and the cached session summary both came from a structural index that no longer exists, so the fallback surface is the only surface left. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:141-142]
That is a successor-gap and a lying doc on the same hook. Compact and resume paths still work from hook-state; startup prime does not.
Smallest fix: drop the Session Continuity clause from the README, or restore a continuity-writer-backed summary if that is the intended successor.

### F-I4-005 — compact-inject still labels transcript heuristics as working-memory attention. CONFIRMED. P2
`extractAttentionSignals` is a local function in `compact-inject.ts`. The merge path still pushes a block titled `Working memory attention:` and records `attention-signals` in `selectedFrom`. [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:143] [SOURCE: .opencode/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:298-328]
This is not a call into the deleted `working-memory.ts`. It is retired framing on a live PreCompact merge. D7 asked READMEs not to use "cognitive memory" language; the hook output still does.
Smallest fix: rename the label and `selectedFrom` token to transcript-attention or drop the block if it no longer earns its place.

### F-I4-006 — The eleven deleted runtime hook mirrors from the 052 LOG are not dangling in this tree. CONFIRMED. P2 (negative)
052 recorded those mirrors as operator-pending deletion after the drift-marker sweep. [SOURCE: specs/system-speckit/052-memory-decommission-landing/goal.md:116]
This checkout's hook trees have working browsability symlinks and no broken links. The pending-deletion claim does not reproduce here.
Smallest fix: none in this tree. Treat the LOG row as checkout-local, not as live debt.

## Sources Consulted
- git show --stat 273767431d
- .claude/settings.json:102,144,197
- .codex/hooks.json:8,127,151
- .cursor/hooks.json:6,43,100
- .devin/hooks.v1.json:8,143
- .opencode/hooks/session-lifecycle/README.md:33-45
- .opencode/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:141-142
- .opencode/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:143,298-328
- .github/workflows/changed-packet-validation.yml:24-31
- .github/workflows/strict-pass-freshness-report.yml:32-39
- doctor.sh (no memory/zvec/mcp-server hits)

## Assessment
- newInfoRatio: 0.70
- Novelty justification: restore held (expected). New: Devin mcp-server fallback, CI comment identity, README vs session-prime startup gap, working-memory label on compact-inject.
- Confidence: high on the four positive findings.

## Reflection
- Worked: commit stat plus live config grep, then symlink existence without reading dist contents.
- Failed: treating `.claude/hooks/session-prime.js` as a local file; it is a symlink into dist.
- Ruled out: "the eleven registrations were dropped again" and "Pi was missed by the restore".

## Dead Ends
- Broken-symlink hunt under hook trees (clean).
- doctor.sh memory/zvec/mcp-server grep (clean).

## Recommended Next Focus
Angle 3. Dependency/importer audit of `@spec-kit/shared`, `@spec-kit/scripts` and `@spec-kit/runtime`, starting with `@modelcontextprotocol/sdk`, `sqlite-vec` and the scripts description that still says memory management.
