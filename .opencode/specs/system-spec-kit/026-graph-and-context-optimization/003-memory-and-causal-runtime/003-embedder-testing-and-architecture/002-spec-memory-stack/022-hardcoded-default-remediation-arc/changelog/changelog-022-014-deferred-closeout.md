---
title: "022/014 Deferred Closeout: build-pipeline JSON-copy, advisory pre-commit hook, Z_SCORE comment"
description: "Closed 3 of 4 deferred follow-ons from the 022 arc: a tracked dist-data copy script for the skill-advisor build pipeline, an advisory pre-commit hook with opt-in installer. Also resolved a stale Z_SCORE_THRESHOLD comment. The fourth item (node-llama-cpp prune) was a no-op by discovery."
trigger_phrases:
  - "022 deferred closeout"
  - "skill-advisor dist json copy script"
  - "advisory pre-commit hook speckit"
  - "copy-skill-advisor-dist-data"
  - "Z_SCORE_THRESHOLD comment update"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

After arc 022 shipped, four deferred items remained. The build pipeline had a gap: `tsc` does not copy `data/*.json` into the `dist/` tree, so the skill-advisor MCP launcher would fail on first start without `dist/.../data/prompt-policy.default.json`. The pre-commit hook for `validate-doc-model-refs.js` (originally scoped in Task 39) was never installed. The `Z_SCORE_THRESHOLD` comment in `evidence-gap-detector.ts` still referenced the pre-013 reranker activation narrative, which was stale after the voyage/cohere removal.

Three items shipped in commit `63467b36f1`: a tracked `copy-skill-advisor-dist-data.sh` script that idempotently mirrors `data/*.json` into the dist tree. An advisory `git-hooks/pre-commit` hook that runs the doc-model validator always exits 0 (commit never blocked). An opt-in `install-git-hooks.sh` symlink installer rounds out the set. The `Z_SCORE_THRESHOLD` comment was updated to reflect the post-013 dual-opt-in state (`SPECKIT_CROSS_ENCODER=true` and `RERANKER_LOCAL=true`) without changing the value. The fourth item (node-llama-cpp package.json prune) was resolved by discovery: no live `package.json` declared the dependency and only `package-lock.json` residue remained.

A follow-on commit (`6acd845dfd`) closed two additional deferred items: a scorer test-fixture rename and a cross-language rerank-sidecar canonical parity test. All R1 to R5 requirements passed. The 022 arc closed fully with 53 of 53 scorer tests and 4 of 4 parity tests passing.

### Added

- `copy-skill-advisor-dist-data.sh` (~40 LOC, executable) that idempotently mirrors `mcp_server/data/*.json` into `dist/system-skill-advisor/mcp_server/data/`. Safe to re-run. Exits 0 when the source directory is absent.
- `git-hooks/pre-commit` (~30 LOC, executable) advisory hook that runs `validate-doc-model-refs.js`. Always exits 0. Bypass available via `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1`.
- `install-git-hooks.sh` (~35 LOC, executable) opt-in symlink installer. Supports `--uninstall`. Will not overwrite existing non-symlinks.
- Cross-language rerank-sidecar canonical parity test (`rerank-sidecar-canonical-parity.vitest.ts`) verifying 4 parity cases.

### Changed

- `.opencode/install_guides/README.md` skill-advisor install section now includes `bash .opencode/scripts/copy-skill-advisor-dist-data.sh` after `npm run build` with an explanatory build-pipeline note.
- `evidence-gap-detector.ts` `Z_SCORE_THRESHOLD` comment updated from the pre-013 "enable RERANKER_LOCAL=true" framing to the post-013 dual-opt-in state: both `SPECKIT_CROSS_ENCODER=true` and `RERANKER_LOCAL=true` are required. Value (1.3) unchanged.

### Fixed

- Skill-advisor MCP launcher failed on first start when `dist/.../data/prompt-policy.default.json` was absent after a clean `tsc` build. The `copy-skill-advisor-dist-data.sh` script closes this gap.
- Scorer test fixtures used an outdated naming convention for the intent-prompt corpus. Fixture files renamed to match the current scorer test contract.

### Verification

| Requirement | Check | Result |
|-------------|-------|--------|
| R1 | `rm -f dist/.../prompt-policy.default.json` then `bash .opencode/scripts/copy-skill-advisor-dist-data.sh` | File restored. PASS |
| R2 | `bash .opencode/scripts/install-git-hooks.sh` | `.git/hooks/pre-commit` symlinked to shipped hook. PASS |
| R3 | `git commit --allow-empty -m "hook smoke test"` (commit `bc74df2`, reverted via `git reset --soft HEAD~1`) | Commit succeeded with advisory output on stderr. Not blocked. PASS |
| R4 | Hook script source reviewed | `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` check at top exits 0 immediately. PASS |
| R5 | Manual read of `evidence-gap-detector.ts:14-30` | Post-013 narrative present. `SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true` documented. Rationale for keeping 1.3 noted. PASS |
| Post-014 follow-on | Scorer tests: 53/53 pass. Parity tests: 4/4 pass. | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/scripts/copy-skill-advisor-dist-data.sh` (NEW) | Idempotent JSON-copy script for skill-advisor dist tree |
| `.opencode/scripts/git-hooks/pre-commit` (NEW) | Advisory pre-commit hook for doc-model drift detection |
| `.opencode/scripts/install-git-hooks.sh` (NEW) | Opt-in symlink installer with `--uninstall` support |
| `.opencode/install_guides/README.md` | Added post-build copy step and build-pipeline note to skill-advisor install section |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts` | `Z_SCORE_THRESHOLD` comment updated to post-013 dual-opt-in state. Value unchanged. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts` | Scorer test updated to match renamed fixture contract |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts` | Renamed and aligned to current scorer test convention |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts` | Renamed and aligned to current scorer test convention |

### Follow-Ups

- Run `bash .opencode/scripts/install-git-hooks.sh` after cloning the repo. The hook is not auto-installed by any workflow. A wider distribution mechanism would be needed for a larger team.
- Add runtime reranker-presence detection (probe `localhost:8765/health`) and dynamic `Z_SCORE_THRESHOLD` selection. The current static value (1.3) over-penalizes operators running without the sidecar when it is raised unconditionally.
- Widen the glob in `copy-skill-advisor-dist-data.sh` if future arcs introduce non-JSON assets (YAML, binary models). Current implementation handles `data/*.json` only.
- Remove stale `node-llama-cpp` entries from `system-code-graph/package-lock.json` on the next `npm install` in that workspace. Not blocking.
