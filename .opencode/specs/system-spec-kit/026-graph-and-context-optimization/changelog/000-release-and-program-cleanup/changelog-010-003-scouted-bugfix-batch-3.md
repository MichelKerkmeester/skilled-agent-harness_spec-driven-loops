---
title: "Scouted Bugfix Batch 3: 12 Fixes Across 23 Files from Second Scout"
description: "Verify-first batch fix over a fresh 20 scouted targets (second scout). Twenty parallel gpt-5.5-fast confirm deep-dives classified each headline: 7 CONFIRMED, 9 partial-but-real, 4 REFUTED. 1 partial excluded (product-decision boundary). 12 implement-and-test agents fixed the rest across 23 files with regression tests; builds exit 0."
trigger_phrases:
  - "scouted bugfix batch 3"
  - "code-graph stress tmpdir pollution"
  - "convergence persist-snapshot round-id"
  - "devin compact recovery"
  - "mk-spec-memory launcher toctou"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-03

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train`

### Summary

The third batch of the scouted bugfix train processed a fresh 20 targets from the second deep-research scout (batches 1 and 2 covered the first 25). Twenty parallel `gpt-5.5-fast` confirm deep-dives classified each headline — 7 CONFIRMED, 9 partial-but-real, 4 REFUTED — before any edit was made. The 4 refuted targets (gemini-compact's `sanitizeRecoveredPayload` is already called internally; 3 code-graph regex `lastIndex` claims where the while-exec loop resets correctly) were left untouched. One partial (`scoreVerdictProgression` in the AI council) was excluded from auto-fix because its proposed change alters stop-policy, a product decision requiring deliberate sign-off. The remaining 12 confirmed and partial targets were fixed by 12 parallel implement-and-test agents across 23 disjoint files (sources + added regression tests), fixing only the REAL part of each partial. Every diff was reviewed by the orchestrator; comment-hygiene is clean; `npm run build` and `node --check` pass.

### Added

- Regression test for `convergence.cjs` `INPUT_VALIDATION` exit-3 on `--persist-snapshot` without `--round-id`.
- Regression test for `session-start.ts` `handleCompact` full compact-recovery lifecycle (readCompactPrime → TTL-check → validate → sections → clearCompactPrime).
- Regression tests for `install-all.sh`, `mcp-code-mode/install.sh`, `mcp-chrome-devtools/install.sh` path-derivation correctness.
- Regression test for `mk-spec-memory-launcher.cjs` TOCTOU-safe lock reclaim.
- Regression test for `_utils.sh` `check_node_version` full semver compare.
- Regression test for `vector-index-mutations.ts` orphan-row cascade in retention sweep.
- Regression test for `memory-search.ts` community-search gating and quality-derived score.
- Scoped `beforeEach`/`afterEach` `chdir`+restore in `scan-stress.vitest.ts` replacing the removed macOS-only `process.chdir('/private/tmp')` in `vitest.config.ts`.

### Changed

- `scan-stress.vitest.ts` + 2 sibling stress tests: replaced `mkdtempSync(process.cwd())` with `os.tmpdir()`; removed macOS-only `process.chdir('/private/tmp')` from `vitest.config.ts`; the scan-stress handler test uses a scoped `beforeEach`/`afterEach` chdir+restore. 45 stress tests pass; no repo pollution on Linux/CI.
- `session-start.ts` (cli-devin): `handleCompact` now mirrors Claude's compact-recovery path — `readCompactPrime` → TTL-check → semantic-validate → Recovered Context sections → `clearCompactPrime` on success; static fallback only on cache-miss, expiry, or validation failure.
- `mk-spec-memory-launcher.cjs`: stale bootstrap-lock reclaim now uses claims-via-rename before delete (TOCTOU-safe). A successor's fresh lockDir is a new inode the rename cannot touch; a losing racer gets ENOENT and retries.
- `_utils.sh` `check_node_version`: replaced integer-only compare with a full three-part semver compare (e.g. `20.10` vs required `20.11` now correctly rejected).
- `vector-index-mutations.ts`: retention sweep now cascades cleanup to orphan `auto_entities`/`memory_entities` rows in the same transaction.
- `memory-search.ts`: community-search now gated on `<3` weak results (shared gate with auto-search); score derived from community match quality rather than a hard-coded 0.45. Strong-result sets bypass the community pass entirely.
- `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md`: corrected stale findings-registry filename to the live name.
- `deep-ai-council/SKILL.md`, `loop_protocol.md`: corrected reference from deleted `prompt_pack_round.md.tmpl` to the live asset name.
- `checkpoint-v2-contention-stress.vitest.ts` + 2 sibling tests: updated hardcoded schema v29 → v30 with enrichment columns; soak coverage preserved.

### Fixed

- `convergence.cjs` (deep-loop): `--persist-snapshot` without `--round-id` silently coalesced `roundId` to `__latest__` and overwrote all prior snapshots. Now throws `INPUT_VALIDATION` (exit 3) when `--persist-snapshot` is set without `--round-id`.
- `install-all.sh`: wrong entry name for mk-spec-memory in the `MCP_SCRIPTS` array. Corrected to the on-disk script name.
- `mcp-code-mode/install.sh`, `mcp-chrome-devtools/install.sh`: failed when invoked directly (CWD assumption). Now derive paths robustly.
- Code-graph stress tests: `mkdtempSync(process.cwd())` polluted the repo under Linux/CI (the macOS-only `vitest.config.ts` chdir guard did not apply). Fixed with `os.tmpdir()` + scoped chdir+restore.
- Agent docs (`.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md`): referenced a stale findings-registry filename; corrected to the live name.
- `deep-ai-council` skill files: referenced a deleted `prompt_pack_round.md.tmpl` asset; corrected to the live asset name.
- Checkpoint vitest fixtures: hardcoded schema v29 caused fixture drift against the v30 production schema (missing enrichment columns). Updated to v30.

### Verification

| Check | Result |
|-------|--------|
| All 20 targets deep-dived; classified CONFIRMED / partial-but-real / REFUTED with code evidence | PASS — 7 CONFIRMED, 9 partial-but-real, 4 REFUTED |
| 4 REFUTED headlines not acted on | PASS — gemini-compact internal call and 3 code-graph regex lastIndex claims left unedited |
| 1 partial excluded on product-decision boundary | PASS — council `scoreVerdictProgression` flagged, not patched |
| Each of the 12 fixes has a passing regression test | PASS — added regression test passes for each fix |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| system-spec-kit `npm run build` | PASS — exit 0 |
| deep-loop `.cjs` `node --check` | PASS — convergence.cjs + mk-spec-memory-launcher.cjs OK |
| 45 stress tests; no repo pollution | PASS — all pass; `os.tmpdir()` + scoped chdir+restore verified |
| Scope leak | PASS — edits confined to the 23 confirmed/partial-defect files |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `scan-stress.vitest.ts` + 2 sibling stress tests + `vitest.config.ts` | Modified | `os.tmpdir()`; removed macOS-only chdir from config; scoped chdir+restore in scan-stress handler test |
| `convergence.cjs` + regression test | Modified | `INPUT_VALIDATION` exit 3 on `--persist-snapshot` without `--round-id` |
| `session-start.ts` + regression test | Modified | Full compact-recovery lifecycle in `handleCompact` |
| `install-all.sh` + regression test | Modified | Corrected wrong MCP_SCRIPTS entry name for mk-spec-memory |
| `mcp-code-mode/install.sh` + `mcp-chrome-devtools/install.sh` + regression tests | Modified | Robust path derivation; no CWD assumption |
| `mk-spec-memory-launcher.cjs` + regression test | Modified | TOCTOU-safe lock reclaim via rename before delete |
| `_utils.sh` + regression test | Modified | Full semver compare for `check_node_version` |
| `vector-index-mutations.ts` + regression test | Modified | Orphan row cascade in retention sweep |
| `memory-search.ts` + regression test | Modified | Community-search gating + quality-derived score |
| `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md` | Modified | Live findings-registry filename |
| `deep-ai-council/SKILL.md`, `loop_protocol.md` | Modified | Live asset name (not deleted tmpl) |
| `checkpoint-v2-contention-stress.vitest.ts` + 2 sibling tests | Modified | v30 schema fixture with enrichment columns |

### Follow-Ups

- Deploy: recycle the mk-spec-memory daemon after commit so the `memory-search.ts` + `vector-index-mutations.ts` fixes take effect. The launcher `.cjs` (TOCTOU fix) deploys on the next launcher restart. Install scripts, agent docs, stress tests, and the devin hook (`session-start.ts`) require no forced deploy.
- Council `scoreVerdictProgression` partial: flagged for deliberate product-decision sign-off before a fix can ship. The partial is real but its proposed change alters stop-policy — not a scout-driven defect patch.
- A fourth scouted bugfix batch may be warranted if a third scout surfaces additional high-risk targets in previously-uncovered subsystems.
