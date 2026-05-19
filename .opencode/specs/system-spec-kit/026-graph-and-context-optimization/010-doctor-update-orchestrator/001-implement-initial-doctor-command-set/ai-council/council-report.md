# Multi-AI Council Report: `/doctor:update` v3.3.0.0 → v3.4.1.0+ Hardening

### Task Classification
- **Type**: Bug Fix + Architecture (migration path debugging)
- **Council Seats Dispatched**: 3: Analytical, Critical, Pragmatic
- **Dispatch Mode**: Parallel Depth 0
- **Vantage Integrity**: Simulated vantage lenses (single-model multi-lens deliberation)

---

## Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
|------|--------------|-------------------|------------------|------------|
| Seat 1 | Analytical | Deep technical analysis (simulated) | Structural correctness, phase ordering, dependency cascade | 82 |
| Seat 2 | Critical | Adversarial safety-first (simulated) | Silent failure detection, worst-case scenarios, false-success analysis | 88 |
| Seat 3 | Pragmatic | Implementation realism (simulated) | Minimal fixes, existing phase fit, constraint violation audit | 85 |

---

## Strategy Comparison

| Dimension | Weight | Analytical | Critical | Pragmatic |
|-----------|--------|-----------|----------|-----------|
| Correctness | 30% | 26 | 27 | 22 |
| Completeness | 20% | 17 | 18 | 16 |
| Elegance | 15% | 12 | 10 | 14 |
| Robustness | 20% | 16 | 18 | 13 |
| Integration | 15% | 13 | 11 | 14 |
| Pre-Critique Total | 100% | **84** | **84** | **79** |
| Post-Critique Adjustment | ±10 | 0 | 0 | -3 |
| Final Total | 100% | **84** | **84** | **76** |

**Pragmatic adjustment**: -3 for under-classifying Issues 2 and 3 as P1 (conflated fix simplicity with user-impact severity).

---

## Deliberation Notes

### Round 1 — Independent Findings
- **Seat 1 (Analytical)**: P0 on Issues 1, 2, 3, 5, 7. Merged 1+5 (same root cause). Proposed symlink bridge. Identified fix cascade: build must come first.
- **Seat 2 (Critical)**: P0 on Issues 1, 2, 3, 5, 7. Identified Issue 7 as "meta-failure" root cause. Catalogued 5 silent false-success scenarios. Discovered lockfile persistence sub-issue.
- **Seat 3 (Pragmatic)**: P0 on Issues 1, 5 only. P1 on 2, 3, 6, 7. P2 on Issue 4. Proposed instruction-file approach. Estimated 65-line total blast radius across 2 files.

### Round 2 — Cross-Critique
- **Strongest objection**: Pragmatic's P1 classification of Issue 2 (build preflight) and Issue 3 (version detection) understates real user impact — both produce silent false-success states. Upgraded to P0.
- **Central technical disagreement**: Three competing approaches for Issues 1+5 fix. Symlink (Analytical) vs. boundary expansion (Critical) vs. instruction file (Pragmatic).
- **Validated by all seats**: Issues 1 and 5 are the same root cause. Issue 4 is lowest priority.

### Round 3 — Reconciliation
- **Issue 2+3 severity**: Upgraded to P0. Silent failure with success report = P0, regardless of fix simplicity.
- **Issues 1+5 fix**: Symlink adopted as primary (Analytical). Instruction file as fallback (Pragmatic). Boundary expansion rejected (violates ADR firewall).
- **Issue 7**: Confirmed P0 prerequisite — manifest is orchestrator's only instruction set.
- **Convergence**: 2-of-3-agree on all classifications. Complementary elements merged across all seats.

---

## Winning Strategy
- **Leader**: Analytical + Critical (tied at 84/100)
- **Key Strengths**: Analytical's structural rigor + Critical's adversarial diagnosis
- **Complementary Elements**: Pragmatic's instruction-file fallback, line-count estimates, and constraint audit merged into final plan

---

# === COUNCIL VERDICT — /doctor:update v3.3 hardening ===

## ROUND 1 — Severity Classification

| Issue | Severity | Reasoning | Dissents |
|-------|----------|-----------|----------|
| Issue 1 (dir rename) | **P0** | MCP server boot gated on correct path. Dead orchestrator. | None |
| Issue 2 (mcp_server build) | **P0** | No preflight check. Orchestrator proceeds to Phase 5 then fails incomprehensibly. Lockfile persists, blocking retries. | Pragmatic: P1 (overruled — silent failure = P0) |
| Issue 3 (auto-version-skip) | **P0** | False negative on migration trigger. Orchestrator skips migration, reports `final_status: ok`, but databases are at wrong schema. Silent false success. | Pragmatic: P1 (overruled — false success = P0) |
| Issue 4 (snapshot ordering) | **P1** | Timestamps reversed but snapshots functionally usable. Recovery metadata misleading, not corrupted. | Pragmatic: P2 (noted — touch-based fix is trivial but P1 due to recovery trust erosion) |
| Issue 5 (workspace config) | **P0** (merged with 1) | Same root cause as Issue 1. Config paths point at singular directory. | None |
| Issue 6 (cocoindex venv) | **P1** | Feature degradation, not total breakage. CocoIndex tools supplemental. Slow-poison failure — undetectable for weeks. | None |
| Issue 7 (manifest incomplete) | **P0** | Meta-failure root cause. Incomplete manifest = guaranteed incomplete migration = triple false success. | Pragmatic: P1 (overruled — manifest IS the instruction set) |

### Under-Counted
- **Issues 1+5**: Same root cause (directory rename + config path mismatch). Two diagnostic angles, one fix (symlink).
- **Issue 2**: Actually TWO sub-issues — (a) no build preflight, (b) lockfile not released on abort. Both P0.

### Over-Counted
- **Issue 3**: One problem (wrong detection signal), not two. Both `package.json` "0.0.0" and narrow `valid_source_versions` are symptoms of the same detection-signal gap.

---

## ROUND 2 — Root-Cause Categories

| Category | Issues | Description |
|----------|--------|-------------|
| **A. Pre-flight gap** | 2 | Orchestrator should verify MCP server bootability BEFORE depending on it. No Phase 0/1 check exists. |
| **B. Migration-scope gap** | 1, 5, 6 | Migration manifest covers DB files and legacy memory/*.md but omits structural rename, config path update, and venv recreation. |
| **C. Detection-signal gap** | 3 | Version detection relies on `package.json` field that is a build-time placeholder. Should use file-system signals instead. |
| **D. Manifest-completeness gap** | 7 | Manifest created for v3.4.0.0 needs, never updated for v3.3→v3.4 structural changes. Declarative migration surface is incomplete. |
| **E. Ordering ambiguity** | 4 | Phase 3 snapshot semantics unclear: "pre-migration snapshot" vs. "pre-execution snapshot." Missing DB handling undocumented. |

### Per-Category Minimal-Fix Sketch

- **Category A (pre-flight)**: Insert Phase 1.5 between flock acquire and MCP probe. Check `mcp_server/dist/context-server.js` existence. If absent, run `cd mcp_server && npm install && npm run build`. On any abort path, release the flock file.
- **Category B (migration-scope)**: Add symlink creation (`ln -s .opencode/skill skills`) to Phase 8 migration when both directories coexist. Add cocoindex venv health check + rebuild. Respect mutation boundaries by bridging paths rather than editing configs.
- **Category C (detection-signal)**: Replace `package.json` version parsing with file-system signal detection: check for (a) `.opencode/skill/` as directory (not symlink), (b) absence of `mcp_server/dist/`, (c) presence of legacy `memory/*.md`. ≥2 of 3 positive → auto-trigger migration. If ambiguous, refuse to proceed without explicit `--migrate` or `--no-migrate` flag.
- **Category D (manifest-completeness)**: Add to migration-manifest.json `3.3.0.0` block: directory rename detection entry, MCP server build entry, cocoindex venv health entry. Link manifest entries to Phase 8 execution code.
- **Category E (ordering)**: Preserve snapshot timestamps with `cp -p`. Add optional Phase 5.5 "post-dependency checkpoint" for files created during Phase 5 that were absent during Phase 3.

---

## ROUND 3 — Remediation Packet (dependency-ordered)

```
FIX-00 | P0 (prereq) | migration-manifest.json (dev-time) | Manifest-completeness gap
       | Add to v3.3.0.0 block: new deprecated_file for .opencode/skill/ directory,
       | new schema_migration M-3.3.0.0-004 for MCP server bootstrap (check dist/, build if missing),
       | new schema_migration M-3.3.0.0-005 for cocoindex venv health check.
       | Update expected_post_state. ~30-50 lines JSON. Source: Critical + Analytical.

FIX-01 | P0 | doctor_update.yaml Phase 1.5 (new) | Pre-flight gap
       | After flock acquire, before MCP probe: stat mcp_server/dist/context-server.js.
       | If absent: cd mcp_server && npm install && npm run build.
       | If build fails: emit error, release flock, exit 1.
       | On ANY abort path: rm -f mcp_server/database/.doctor-update.flock.
       | ~15 lines YAML + bash. Source: Critical (bootability gate) + Analytical (must come first).

FIX-02 | P0 | doctor_update.yaml Phase 8 | Migration-scope gap (resolves Issues 1+5)
       | When .opencode/skill/ (singular dir) AND .opencode/skills/ (plural dir) both exist:
       |   ln -sf skills .opencode/skill
       | If symlink fails: write .doctor-update.config-instructions with sed commands.
       | ~10 lines YAML + bash. Source: Analytical (symlink) + Pragmatic (fallback).

FIX-03 | P0 | doctor_update.yaml Phase 8 condition eval | Detection-signal gap
       | Replace package.json version parsing with file-system signal check:
       |   (a) .opencode/skill/ exists as directory → +1 signal
       |   (b) mcp_server/dist/context-server.js absent → +1 signal
       |   (c) memory/*.md files present → +1 signal
       | If ≥2 of 3 → auto-trigger migration.
       | If version ambiguous AND no --migrate/--no-migrate → refuse to proceed.
       | ~12 lines bash + YAML condition. Source: Pragmatic (detection) + Critical (never silent).

FIX-04 | P1 | doctor_update.yaml Phase 8 + Phase 7 | Migration-scope gap
       | Phase 8: check cocoindex venv health (python3 -c "import sys; print(sys.prefix)").
       | If broken: python3 -m venv .opencode/skills/mcp-coco-index/mcp_server/.venv &&
       |   pip install -r requirements.txt.
       | Phase 7: add CocoIndex smoke test (ccc search "test" --limit 1).
       | ~10 lines YAML + bash. Source: Critical (smoke test) + Analytical (venv rebuild).

FIX-05 | P1 | doctor_update.yaml Phase 3 | Ordering ambiguity
       | Use cp -p to preserve original file timestamps in snapshot copies.
       | 1-3 line bash change. Source: Pragmatic.

FIX-06 | P1 | doctor_update.yaml Phase 5.5 (new, optional) | Ordering ambiguity
       | After Phase 5 completes: checkpoint any .sqlite files ABSENT during Phase 3 but now EXIST.
       | Delta snapshot using VACUUM INTO. Conditional: only if new files detected.
       | ~12 lines YAML + bash. Source: Analytical.
```

---

## VERDICT

**After applying FIX-00 through FIX-04, a v3.3.0.0 user runs `/doctor:update` with NO manual prep and reaches `final_status: ok`.**

**End-to-end flow after fixes:**
```
1. User overlays v3.4.1.0+ .opencode/ on v3.3.0.0 workspace
2. User runs /doctor:update (no flags needed)
3. Phase 1: Acquires flock ✓
4. Phase 1.5 (FIX-01): Detects missing dist/, runs npm install && npm run build → dist/ created ✓
5. Phase 2: Probes MCP → server boots ✓
6. Phase 8 (FIX-03): Auto-detects v3.3.0.0 via file-system signals → triggers migration ✓
7. Phase 8 (FIX-02): Creates symlink .opencode/skill → skills → old config paths resolve ✓
8. Phase 8 (FIX-04): Checks cocoindex venv, rebuilds if needed ✓
9. Phase 3: Snapshots existing databases ✓
10. Phase 5: Executes dependency order (all MCP tools available) ✓
11. Phase 7: Validates all subsystems (includes CocoIndex smoke test) ✓
12. Phase 10: Writes state log, releases flock ✓
13. final_status: ok ✓
```

**Residual manual steps: NONE** — after P0 fixes (FIX-00 through FIX-03), zero manual prep required.

**Residual risk (documented):** If v3.3.0.0 workspace configs use MCP server paths fundamentally different from the expected `.opencode/skill/` → `.opencode/skills/` pattern (beyond just singular/plural difference), the symlink won't help. In that case, the `.doctor-update.config-instructions` file provides the exact sed commands needed. This is a degraded-but-documented path with explicit instructions.

---

## Implementation Steps

1. **Prerequisite**: Complete `migration-manifest.json` with entries for directory rename, MCP server build, and cocoindex venv (FIX-00). Source: Critical + Analytical.
2. **Phase 1.5**: Add MCP server bootability preflight to `doctor_update.yaml` — check dist/, build if missing, release flock on abort (FIX-01). Source: Critical + Analytical + Pragmatic.
3. **Phase 8**: Add symlink creation for `.opencode/skill/` → `skills/` with instruction-file fallback (FIX-02). Source: Analytical + Pragmatic.
4. **Phase 8 condition**: Replace package.json version detection with file-system signal detection (FIX-03). Source: Pragmatic + Critical.
5. **Phase 8 + Phase 7**: Add cocoindex venv health check in migration phase and smoke test in validation phase (FIX-04). Source: Critical + Analytical.
6. **Phase 3**: Fix snapshot timestamps with `cp -p` (FIX-05). Source: Pragmatic.
7. **Phase 5.5** (optional follow-on): Add post-dependency checkpoint for newly created databases (FIX-06). Source: Analytical.

## Prerequisites
- FIX-00 (manifest completion) must ship BEFORE other fixes, as manifest entries are referenced by Phase 8 execution code.
- Node.js and npm must be available on the user's system (required for `npm install && npm run build` in FIX-01). This is a reasonable assumption for spec-kit users.
- Python 3 must be available for cocoindex venv recreation (FIX-04).

## Plan Confidence
- **Overall**: 88/100%
- **Strategy Agreement**: High — 2-of-3 seats aligned on all P0 classifications; 3-of-3 agreed Issues 1+5 are merged
- **Consensus Quality**: Strong — disagreement on Issue 2/3/7 severity resolved via adversarial cross-critique with evidence
- **Risk Level**: Low after P0 fixes applied. Medium for the unknown v3.3 config format edge case.

## Dropped Alternatives
- **Pragmatic's instruction-file-only approach** (Score: 76/100): Deemed insufficient for P0 issues. Adopted as fallback only. The symlink approach provides zero-user-action resolution.
- **Critical's config-boundary expansion** (diagnosed, not scored): Rejected — violates ADR-002/ADR-005 mutation boundary firewall. Config auto-patching is too invasive for first-pass fix.
- **Analytical's Phase-reordering for Issue 4** (considered, rejected): Moving Phase 3 after Phase 5 has cascading blast radius. Additive Phase 5.5 is safer.

## Risks & Mitigations

| Risk | Severity | Mitigation | Source |
|------|----------|------------|--------|
| Symlink creation fails (permissions, platform) | Medium | Fallback to `.doctor-update.config-instructions` file with exact sed commands | Pragmatic |
| v3.3.0.0 configs use non-standard MCP paths | Low | Instruction file provides explicit sed commands; user notified at end of run | Critical |
| `npm install` fails (network, permissions) | Low | Halt with clear error message, release flock, no partial state | Critical + Analytical |
| CocoIndex venv recreation fails (no Python) | Low | Skip with warning; CocoIndex is supplemental, not gating | Pragmatic |
| File-system signal detection false negative | Low | If ambiguous, refuse to proceed without `--migrate` or `--no-migrate` flag | Critical |
| Lockfile persists after abort (pre-FIX-01) | Medium | FIX-01 ensures `rm -f` on every abort path | Critical |

## Planning-Only Boundary
- No files were modified by the Multi-AI Council outside `ai-council/**`.
- This report is a recommendation for the orchestrator owner (spec-kit packet `010-doctor-update-orchestrator/001-implement-initial-doctor-command-set`) to review and implement.
- All fixes respect forbidden_targets, no-new-MCP-tools constraint, and existing 10-phase YAML structure (with 1-2 additive phases).
