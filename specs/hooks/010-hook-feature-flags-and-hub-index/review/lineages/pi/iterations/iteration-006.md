# Iteration 6: D4 Maintainability (broaden) — Hub index completeness, dist boundary, cursor mirror

## Focus
- Dimension: maintainability
- Files: `.opencode/hooks/session-lifecycle/**` (16 symlinks), `.opencode/hooks/skill-advisor/pi/prompt-advisor.ts`, `.opencode/hooks/git-preflight/shared/git-preflight-advisory.mjs`, `.cursor/hooks/README.md`, `.cursor/hooks/completion-evidence-response.mjs`, `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 10
- New findings: P0=0 P1=0 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P2, Suggestion
- **F009**: `implementation-summary.md` carries a stale "remaining minor (P2)" — it states "the `.cursor/hooks/` discovery mirror does not yet list the new completion entrypoint", but the current tree does list it: `.cursor/hooks/README.md:11` ("including the `completion-evidence-response.mjs` entrypoint added with the runtime-coverage phases") and `:32` ("Completion evidence | completion-evidence-response.mjs"), and the symlink exists (`.cursor/hooks/completion-evidence-response.mjs -> ../../.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/completion-evidence-response.mjs`). The summary's P2 residue is resolved in-tree but the doc still reports it open. Recommendation: update the implementation-summary closing note.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F009 | Impl-summary stale residue |
| checklist_evidence | pass | hard | — | unchanged |

## Assessment
- New findings ratio: 1.00 (1 new P2)
- Dimensions addressed: maintainability
- Novelty justification: Verified hub completeness vs matrix: session-lifecycle has 16 symlinks across all five indexed runtimes (claude/codex/cursor/devin/pi — pi has the 4 expected files); `skill-advisor/pi/prompt-advisor.ts` is properly indexed via symlink; `git-preflight/shared/` single adapter is referenced in 4 runtime configs (matching the "one physical file serves Claude/Codex/Cursor/Devin" claim). Only the impl-summary's stale P2 residue (F009) surfaced.

## Ruled Out
- Hub completeness gap: session-lifecycle, skill-advisor, git-preflight indexing all match the matrix. Ruled out.
- Cursor mirror gap: the completion entrypoint IS present. Ruled out — becomes F009 (doc residue).

## Dead Ends
- None.

## Recommended Next Focus
D1 Correctness (broaden) — adversarial replay of the guard: verify `isHookEnabled` edge cases (unknown concern, empty env), the `concernFlag` slug normalization for all 15 concerns, and re-read cited code for F001/F002 evidence integrity.

Review verdict: PASS
