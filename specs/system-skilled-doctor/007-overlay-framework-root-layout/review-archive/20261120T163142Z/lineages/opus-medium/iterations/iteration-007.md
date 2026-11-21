# Iteration 007 - Frontier node F-1-006: security

## Dispatcher
- Lineage opus-medium, iteration 7 (6 prior iteration records). steer.md absent. Node F-1-006, dimension security.
- Review focus addressed: hook fail-open versus fail-closed behavior after the Barter move to overlays/: the edit guard core and its OpenCode adapter, the pre-commit gate, and the git-write gate's ai-speckit detection in every runtime copy.
- Orientation note: iteration 6's graph upsert exited 3 because the lineage helper passed no canonical DIMENSION/FILE nodes for an iteration with no findings. The helper now seeds them, and iterations 1-6 were re-upserted (all exit 0).

## Files Reviewed
- barter/ai-speckit/skilled/.skilled/skills/sk-git/scripts/hooks/barter-git-write-gate.mjs:176-189 (aiSpeckitRoot), :191-215 (sessionInside)
- barter/ai-speckit runtime copies of the git-write gate: .claude, .codex, .cursor, .devin (links to the .skilled copy), .vibe (adapter importing the .skilled core by relative URL)
- barter/ai-speckit/overlays/framework/hooks/barter-overlay-guard/lib/barter-overlay-guard-core.cjs:55-82,143-162
- barter/ai-speckit/overlays/root/opencode/plugins/barter-overlay-guard.js:10-47
- barter/ai-speckit/skilled/.opencode/scripts/git-hooks/pre-commit:83-112

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): 005 REQ-005 (git-write gate answers as before the move) holds by construction: every runtime copy resolves to the .skilled core through a link or an import, and the core walks five levels from its realpath to skilled/, then finds overlays/overlay-manifest.json beside it.

## Integration Evidence
- Edit guard: throws when it cannot locate the layout (core :82); the OpenCode adapter catches and allows with a stderr line (:41-43). Fail-open.
- Commit gate: blocks when the engine is missing or status/pre-commit fail (pre-commit:96-112), skips the overlay checks when no beside-tree manifest exists (:88-95). Fail-open only on a missing manifest.
- Git-write gate: on a missing beside-tree manifest aiSpeckitRoot returns null, so the session is treated as a project repository, where git writes are refused. Fail-closed for writes, which is the safe side.

## Edge Cases
- The git-write gate identifies ai-speckit by a generic `overlays/overlay-manifest.json` beside the tree instead of the former Barter-specific folder name. The gate ships only inside Barter's applied tree and anchors on its own realpath, so another consumer adopting the generic sibling layout does not run it. Recorded only.

## Confirmed-Clean Surfaces
- Guard core accepts a layout only when the tree holds the engine and the overlays folder holds the manifest (matchLayout :58-63), so a stray manifest elsewhere never steers it.

## Ruled Out
- Runtime copies of the git-write gate computing the wrong root from their own path: the four runtime hook copies are links, and the .vibe copy is an adapter that imports the .skilled core.

## Next Focus
- Dimension: security
- Focus area: F-1-008 packet evidence (no secrets or machine-private data in scratch evidence)
- Reason: frontier rotation

Review verdict: PASS
