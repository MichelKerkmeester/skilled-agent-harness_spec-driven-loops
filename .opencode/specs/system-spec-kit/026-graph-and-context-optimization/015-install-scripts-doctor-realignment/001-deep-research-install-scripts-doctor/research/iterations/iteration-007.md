# Iteration 7: Source-of-truth DB-path resolution (LOGIC-SYNC)

## Focus

Resolve the code-graph + deep-loop DB-path contradictions surfaced across iters 3/5/6 by reading the ACTUAL DB-open source (not docs). Orchestrator-run verification pass (a LOGIC-SYNC resolution of conflicting executor claims), low new-surface but high corrective value. Establish the authoritative current-truth path table for the rework phase.

## Actions Taken

1. Read code-graph DB resolution: `system-code-graph/mcp_server/core/config.ts:13-29` (`DATABASE_DIR = resolveCanonicalDbDir(envDir ?? defaultDir, workspaceRoot)`), `lib/canonical-db-dir.ts:19-54` (`resolveCanonicalDbDir` canonicalizes the given dir within workspace; does NOT redirect), `lib/readiness-marker.ts:20` (default `.opencode/.spec-kit/code-graph/database`), `lib/code-graph-db.ts:264`, `mcp_server/README.md:173`.
2. Read deep-loop DB resolution: `deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts:98,236-238` (`DB_FILENAME = 'deep-loop-graph.sqlite'`; `dbPath = join(dbDir, DB_FILENAME)`), `lib/coverage-graph/README.md:37`, `SKILL.md:80`, `README.md:66`, `scripts/status.cjs:160` (`COVERAGE_GRAPH_DATABASE_DIR`).
3. Cross-referenced against the conflicting iter-3/5/6 classifications and the runtime config docs (`.codex/config.toml:89`).

## Findings

- **[P1 / RE-CLASSIFICATION]** code-graph DB canonical current path = `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` — confirmed by `readiness-marker.ts:20` default + `mcp_server/README.md:173` + `.codex/config.toml:89` doc (3 concurring source/doc signals). The doctor route manifest `.opencode/commands/doctor/_routes.yaml:71` (+ `.claude` mirror) value `.opencode/skills/system-code-graph/database/code-graph.sqlite` is therefore ITSELF STALE — iters 3/5 wrongly treated it as the canonical fix-target. Fix-target for code-graph DB in ALL surfaces = `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`.
- **[INFO / CORRECTION-of-iter5]** `.codex/config.toml:89` (`.opencode/.spec-kit/code-graph/database/code-graph.sqlite`) is CORRECT, not MIRROR-DRIFT — iter-5 finding f-iter005-005 is RETRACTED. iter-6 r-iter006-008 was right.
- **[P1 / CONFIRMED]** deep-loop DB canonical current path = `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite` — confirmed by `coverage-graph-db.ts` + `lib/coverage-graph/README.md:37` + `SKILL.md:80` + `README.md:66`. Both `deep-loop-runtime/storage/...` (iter-3 "canonical") and `mcp_server/database/deep-loop-graph.sqlite` (pre-116) are STALE. Fix-target for deep-loop DB in ALL surfaces = `database/deep-loop-graph.sqlite`.
- **[P3 / ADJACENT-LATENT]** `system-code-graph/mcp_server/core/config.ts:14` computes `defaultDir = resolve(__dirname, '..', 'database')` (i.e. `mcp_server/database`), which DISAGREES with the documented/readiness-marker default `.opencode/.spec-kit/code-graph/database`. Effective runtime path is the documented one only when `SPECKIT_CODE_GRAPH_DB_DIR` is set (or the canonical resolver/launcher sets it). This config.ts-vs-docs default mismatch is an ADJACENT system-code-graph concern (NOT this packet's install/scripts/doctor core), flagged for a sibling follow-up so docs and the code fallback agree.

## Ruled Out

- No further DB-path variants beyond the three code-graph claims (`mcp_server/database`, `system-code-graph/database`, `.spec-kit/code-graph/database`) and three deep-loop claims (`mcp_server/database`, `storage`, `database`) — the path space is fully enumerated and each is now classified.

## Questions Answered

- Q1-Q5 are now ALL answered with evidence. The only open ambiguity (the DB-path contradictions) is resolved: code-graph -> `.opencode/.spec-kit/code-graph/database/code-graph.sqlite`; deep-loop -> `.opencode/skills/deep-loop-runtime/database/deep-loop-graph.sqlite`.
- Convergence criterion met = "all key questions answered with evidence" (strategy STOP condition), not the ratio criterion.

## Questions Remaining

- None for this packet's scope. The config.ts-vs-docs code-graph default mismatch is flagged as an adjacent sibling follow-up, out of this packet's install/scripts/doctor core.

## Next Focus

Synthesis: write `research/research.md` with the consolidated finding catalogue + the authoritative current-truth path table, segmented CORE (install/scripts/doctor + .claude mirror) vs ADJACENT-116 (advisor fixtures / routing corpus / optimizer manifest / contract tests / gemini deep command). Then resource-map + memory save, then scaffold rework phases.
