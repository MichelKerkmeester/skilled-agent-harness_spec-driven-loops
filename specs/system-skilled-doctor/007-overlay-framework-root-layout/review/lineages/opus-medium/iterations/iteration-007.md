# Iteration 007 - Frontier node F-1-005: security

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-005 (Barter hooks and hygiene, read-only nested repo), dimension security
- Review focus addressed: hook fail-open or fail-closed behavior. Traced what each Barter hook does when its overlay lookup or its core fails, and verified prior R12-P2-001 (plugin tests stub the upstream bridge).
- Sources: steer.md absent; strategy; registry frontier (F-1-005 next dimension security).

## Files Reviewed

- `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:9-50` (OpenCode edit guard plugin, warnCoreFailure)
- `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:177-200` (overlaysRootFor, aiSpeckitRoot), `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:225-230` (sessionInside), `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:1731-1739` (outsideRefusal), `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:2153-2173, 2290-2306` (evaluateCommand and hook entry)
- `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:120-170` (commit hook)
- `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:148-168` (real-bridge case), `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs:59-180` (stub bridge at :84-87, :131-133, :175-177)
- Test run: `node --test barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs` -> 3 of 3 pass, exit 0

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 (engine commit check allows under a hook-exported GIT_DIR) stays active; this iteration found no Barter hook step that would catch it, because the commit hook passes its environment straight to the engine (`barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:156-164`).

### P2 Findings

None.

## Posture Map

| Hook | On lookup or core failure | Evidence | Verdict |
|------|---------------------------|----------|---------|
| OpenCode edit guard plugin | Fails open: prints "guard failed, allowing the edit" to stderr and lets the write through | `barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:19-22, 39-43` | By design and documented in the plugin comment (`barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:12-14`); the commit gate is the backstop |
| git-write gate | aiSpeckitRoot returns null when the manifest the setting names is missing (`barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:195-197`); sessionInside is then false (`barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:226`) and every git write gets outsideRefusal (`barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:1567, 1744`) | `barter/ai-speckit/overlays/framework/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:1731-1733` | Fails closed |
| Commit hook, no manifest | Exit 1 when a vendored path is staged | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:134-143` | Fails closed |
| Commit hook, engine error | Exit 1 on any non-zero status or pre-commit exit | `barter/ai-speckit/overlays/root/opencode/scripts/git-hooks/pre-commit:156-168` | Fails closed |
| Commit hook, linked worktree | Engine pre-commit prints allow (R5-P1-001) | iteration 5 probe | Fails open |

## Prior-Finding Verification

- R12-P2-001 (plugin tests stub the upstream bridge): FIXED for the class it named. `barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-overlay-guard.test.cjs:157-168` imports the applied guard plugin beside the real vendored v2-bridge.js. The git-write gate plugin tests still use a stub bridge (`barter/ai-speckit/overlays/root/opencode/plugins/tests/barter-git-write-gate.test.cjs:84-87`), but both plugins import only the same definePlugin export, so a rename of that export now fails the guard plugin's real-bridge case. Not raised again.

## Traceability Checks

- spec_code: pass. 007's decision "Keep the setting-reading rule in each of the three hooks ... each keeps its fail-open or fail-closed posture" matches the map above.

## Integration Evidence

- OpenCode plugin -> `../../.skilled/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs` (`barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:7`); git-write gate plugin -> `../skills/sk-git/scripts/hooks/barter-git-write-gate.mjs`.

## Edge Cases

- The guard's fail-open warning goes to stderr only; an agent runtime that hides plugin stderr shows no sign the guard is off. Recorded as an edge case: the plugin comment makes this an explicit trade-off.

## Confirmed-Clean Surfaces

- git-write gate null-root path, commit hook no-manifest and engine-error paths.

## Ruled Out

- git-write gate failing open when the overlay folder moves: it refuses every write instead.

## Next Focus

- Dimension: correctness
- Focus area: frontier node F-1-007 (records), the registry's next node and dimension
- Reason: registry frontier rotation
- Rotation status: F-1-005 correctness and security done
- Required evidence: 006, 007, 008 spec and tasks correctness of stated behavior and counts

Review verdict: CONDITIONAL
