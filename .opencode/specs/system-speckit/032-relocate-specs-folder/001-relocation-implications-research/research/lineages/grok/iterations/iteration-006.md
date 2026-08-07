# Iteration 6: Ranked implications and lean recommendation

## Focus

Consolidate prior evidence into a ranked implication list with an explicit lean recommendation, and close residual gaps (backfill supported-root uses `resolveSpecFolderIdentity`; folder-detector auto-detect error strings; metadata fields rarely store absolute `.opencode/specs` prefixes).

## Findings

1. **Residual: backfill supported-root = `resolveSpecFolderIdentity`.** Scoped targets fail when identity resolution throws `SpecFolderIdentityError`; identity already accepts bare `specs` via `findSpecsAnchorIndex` fallback. Default `--all` root remains `.opencode/specs` — the default, not the validator, is the relocation hotspot. [SOURCE: .opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:287] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/lib/config/spec-doc-paths.ts:282]

2. **Residual: folder-detector error text assumes a `specs/` directory name** (`No specs/ directory found`) when `autoDetectSpecsDirs` is empty — naming is legacy-friendly but the detector also accepts `.opencode/specs/` prefixes elsewhere. [SOURCE: .opencode/skills/system-spec-kit/scripts/spec-folder/folder-detector.ts:1503]

3. **Residual: sampled `description.json` / `graph-metadata.json` did not match absolute `.opencode/specs` in `specFolder`/`spec_folder` fields (0 hits)** — packet metadata appears to store root-relative pointers, lowering migration rewrite volume for those files versus prose markdown. [SOURCE: shell:rg description.json/graph-metadata.json 2026-08-06]

4. **Ranked implications (severity × likelihood):**
   - **P0 Memory cutover hazard:** discovery prefers `.opencode/specs` whenever it exists; leftover canonical path shadows a new real top-level tree. [iter-4]
   - **P0 create.sh default write root:** new packets keep landing under `.opencode/specs` after a "move". [iter-1]
   - **P0 startup-checks path lock:** continuity/startup refuses non-`.opencode/specs` paths. [iter-4]
   - **P1 findSpecsRoot / index-scope glob:** graph key-files and code-graph excludes miss or mis-handle bare `specs/`. [iter-1, iter-4]
   - **P1 git history rewrite / reindex:** tracked tree under `.opencode/specs/**` must relocate; `specs` symlink mode 120000; SOURCE `!specs` helps but churn is large. [iter-3]
   - **P1 global `/specs` semantics for downstream:** today ignores symlink; after real content at top-level, downstream ignore meaning changes. [iter-3]
   - **P2 Gate-3 / AGENTS prompt bias:** dual-root capable, examples/docs still canonical `.opencode/specs`. [iter-2]
   - **P2 Claude SYNC drift:** documents missing `.claude/specs` symlink — mirror work is docs/cleanup, not a six-runtime flip. [iter-2]
   - **P3 docs/json volume:** thousands of md references; ~117 runtime files matter for correctness. [iter-5]

5. **Lean recommendation: NO-GO for a raw move now; CONDITIONAL-GO only behind a dual-root program.** Do not relocate until (a) create/backfill/startup/discovery defaults flip or become config-driven, (b) findSpecsRoot + index-scope accept bare `specs`, (c) a migration window keeps both roots with tests that use a *real* top-level directory (not symlink collapse), (d) SOURCE git plan covers delete+add of the specs tree and downstream global-ignore communication. Prefer "keep `.opencode/specs` as real tree; treat top-level `specs/` as alias" unless a concrete product requirement forces the opposite — current code already invests more in dual-accept than in making top-level authoritative.

## Ruled Out

- Immediate relocation without Memory/create/startup changes.
- Mirror-first migration (hooks don't own specs paths).
- Blanket repo-wide string replace as the primary plan.

## Assessment

- newInfoRatio: 0.45
- Novelty justification: Three residual confirmations + ranked synthesis; most content consolidates prior findings (partially new).
- Questions: all five key questions now have evidence-backed answers suitable for legal stop.

## Recommended Next Focus

STOP candidate: all key questions answered; proceed to synthesis unless quality guards fail.
