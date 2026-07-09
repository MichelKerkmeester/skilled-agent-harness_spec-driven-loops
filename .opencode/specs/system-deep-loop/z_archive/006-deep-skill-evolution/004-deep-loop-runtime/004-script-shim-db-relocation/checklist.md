---
title: "Verification Checklist: 003 — Script Shim + DB Relocation"
description: "Level 3 checklist covering pre-implementation, code quality, testing, fix completeness, security, documentation, file organization, architecture verification, performance verification, deployment readiness, compliance verification, docs verification, and sign-off."
trigger_phrases:
  - "118/003 checklist"
  - "script shim checklist"
  - "deep-loop DB relocation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/004-script-shim-db-relocation"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored checklist.md scaffold"
    next_safe_action: "Verify CHK rows after implementation"
    blockers:
      - "phase-002-incomplete"
    completion_pct: 5
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180031180031180031180031180031180031180031180031180031180030004"
      session_id: "118-003-checklist-scaffold"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Verification Checklist: 003 — Script Shim + DB Relocation

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 002 closeout signal received (lib files in `deep-loop-runtime/lib/`)
  - **Evidence**: _to be filled — `ls .opencode/skills/deep-loop-runtime/lib/coverage-graph/`_
- [ ] CHK-002 [P0] Requirements documented in `spec.md`
  - **Evidence**: _to be filled — spec.md created with 11 sections including user stories_
- [ ] CHK-003 [P0] Plan + architecture documented in `plan.md`
  - **Evidence**: _to be filled — plan.md includes architecture, dependency graph, critical path, milestones_
- [ ] CHK-004 [P1] Baseline row counts captured for `deep-loop-graph.sqlite`
  - **Evidence**: _to be filled — scratch note with per-table counts_

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each `.cjs` file passes `node -c <file>` syntax check
  - **Evidence**: _to be filled — output of `for f in scripts/*.cjs scripts/lib/*.cjs; do node -c "$f"; done`_
- [ ] CHK-011 [P0] Every script calls `db.close()` in a finally block
  - **Evidence**: _to be filled — grep + source review summary_
- [ ] CHK-012 [P1] No CWD-relative DB paths (each script uses `__dirname` resolution)
  - **Evidence**: _to be filled — grep for `path.resolve(__dirname` in all 4 scripts_
- [ ] CHK-013 [P1] Shebang `#!/usr/bin/env node` present in each entry point
  - **Evidence**: _to be filled — `head -1 scripts/*.cjs`_
- [ ] CHK-014 [P1] Shared `_lib/db-open.cjs` exports `openDatabase` and `withDatabase`
  - **Evidence**: _to be filled — `grep -E 'module.exports' scripts/lib/db-open.cjs`_

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Smoke test PASS for all 4 scripts (convergence/upsert/query/status)
  - **Evidence**: _to be filled — each invocation exit 0 plus parseable JSON_
- [ ] CHK-021 [P0] Fault injection: missing argv → exit 3 (each of 4 scripts)
  - **Evidence**: _to be filled — test output_
- [ ] CHK-022 [P0] Fault injection: missing DB file → exit 2 with `DB_MISSING`
  - **Evidence**: _to be filled — test output_
- [ ] CHK-023 [P1] Fault injection: malformed stdin JSON for `upsert.cjs` → exit 3
  - **Evidence**: _to be filled — test output_
- [ ] CHK-024 [P1] `lsof` audit: no DB handles leaked after script exit
  - **Evidence**: _to be filled — lsof scan after each script invocation_

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P0] All 4 MCP-tool semantics mapped one-to-one to scripts (no behavior loss)
  - **Evidence**: _to be filled — side-by-side semantics table comparing each MCP tool to its replacement script_
- [ ] CHK-026 [P0] DB row counts match between old and new SQLite locations
  - **Evidence**: _to be filled — per-table sqlite3 count comparison output_
- [ ] CHK-027 [P0] Schema dump identical between old and new DB
  - **Evidence**: _to be filled — diff of `sqlite3 .schema` for both paths (empty diff)_
- [ ] CHK-028 [P1] All in-scope files from spec.md table-of-changes present after implementation
  - **Evidence**: _to be filled — checklist against spec.md scope table_

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in any script
  - **Evidence**: _to be filled — grep for plausible secret patterns_
- [ ] CHK-031 [P0] DB file permissions match source (no perm widening through cp)
  - **Evidence**: _to be filled — `stat` comparison_
- [ ] CHK-032 [P1] Script does not log DB row contents to stderr in error paths
  - **Evidence**: _to be filled — source review_

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Each script has a header comment block (purpose, argv, exit codes, JSON envelope)
  - **Evidence**: _to be filled — `head -30 scripts/*.cjs`_
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` cross-reference each other
  - **Evidence**: _to be filled — grep for filename references_
- [ ] CHK-042 [P2] ADR-001 cited from `plan.md` summary and `spec.md` executive summary
  - **Evidence**: _to be filled — citation locations_

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] All new scripts live under `.opencode/skills/deep-loop-runtime/scripts/`
  - **Evidence**: _to be filled — `ls .opencode/skills/deep-loop-runtime/scripts/`_
- [ ] CHK-051 [P1] DB lives under `.opencode/skills/deep-loop-runtime/storage/`
  - **Evidence**: _to be filled — `ls .opencode/skills/deep-loop-runtime/storage/`_
- [ ] CHK-052 [P1] No temp files left outside spec folder or scratch/
  - **Evidence**: _to be filled — `git status` survey_

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 18 | 0/18 |
| P2 Items | 3 | 0/3 |

**Verification Date**: _to be filled — set on completion_
**Verified By**: _to be filled — agent or operator name_
**ADRs**: 1 documented, 0 accepted (target: 1/1 Accepted)

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 documented in `decision-record.md` with full context, alternatives, consequences
  - **Evidence**: _to be filled — adr-001 anchor present plus content review_
- [ ] CHK-101 [P0] ADR-001 status: Accepted before completion claim
  - **Evidence**: _to be filled — frontmatter or metadata table value_
- [ ] CHK-102 [P1] Three alternatives documented (shared daemon / MCP retains DB / file-based no-DB) with rejection rationale
  - **Evidence**: _to be filled — Alternatives Considered table in ADR-001_
- [ ] CHK-103 [P1] Five Checks evaluation 5/5 PASS recorded
  - **Evidence**: _to be filled — adr-001-five-checks anchor in ADR-001_
- [ ] CHK-104 [P1] Component diagram in `plan.md` matches actual file surface
  - **Evidence**: _to be filled — diagram inspection_

<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] `status.cjs` cold start under 200 ms (NFR-P01)
  - **Evidence**: _to be filled — `time node scripts/status.cjs ...`_
- [ ] CHK-111 [P1] `convergence.cjs` completes under 2 s on typical record (NFR-P02)
  - **Evidence**: _to be filled — timing measurement_
- [ ] CHK-112 [P1] `upsert.cjs` handles 100 events under 500 ms (NFR-P03)
  - **Evidence**: _to be filled — timing measurement_
- [ ] CHK-113 [P2] Latency parity with old MCP handler within tolerance
  - **Evidence**: _to be filled — comparison if old handler still measurable; otherwise N/A_

<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented in `plan.md` enhanced-rollback section
  - **Evidence**: _to be filled — section reference_
- [ ] CHK-121 [P0] Old `deep-loop-graph.sqlite` preserved at original path (rollback window)
  - **Evidence**: _to be filled — `ls <old-path>`_
- [ ] CHK-122 [P1] Phase 004 sequencing constraint documented (handlers removed only after scripts proven)
  - **Evidence**: _to be filled — citation in spec.md scope or risks section_
- [ ] CHK-123 [P2] Runbook entry created for "scripts fail; revert to old DB path" scenario
  - **Evidence**: _to be filled — runbook reference or note that the enhanced-rollback section is sufficient_

<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] Single-owner invariant preserved (no two scripts hold the DB simultaneously)
  - **Evidence**: _to be filled — source review confirms synchronous open/close plus no daemon_
- [ ] CHK-131 [P1] No tool surface contract regressions for consumers outside the deep-loop workflow
  - **Evidence**: _to be filled — phase 005 owns the consumer migration; 003 documents the new contract only_
- [ ] CHK-132 [P1] Scripts respect the `mk_spec_memory` MCP tool ID preservation invariant (no IDs reintroduced)
  - **Evidence**: _to be filled — scripts replace MCP tools, not add new ones_

<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P0] All required Level 3 spec docs present (spec.md, plan.md, tasks.md, checklist.md, decision-record.md)
  - **Evidence**: _to be filled — `ls` output_
- [ ] CHK-141 [P0] `description.json` and `graph-metadata.json` present and shape-valid
  - **Evidence**: _to be filled — `node -e 'JSON.parse(...)'` for both_
- [ ] CHK-142 [P1] Anchors well-formed in every doc (opening and closing anchor pairs balanced)
  - **Evidence**: _to be filled — `validate.sh --strict` output_
- [ ] CHK-143 [P1] No template placeholder tokens (YOUR-VALUE-HERE / NEEDS-CLARIFICATION / mustache braces) remain after implementation
  - **Evidence**: _to be filled — `grep` survey_

<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] CHK-150 [P0] `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` PASS Level 3
  - **Evidence**: _to be filled — validate.sh output plus exit code 0_
- [ ] CHK-151 [P0] All P0 items above marked `[x]` with evidence
  - **Evidence**: _to be filled — checklist review pass_
- [ ] CHK-152 [P1] All P1 items above marked `[x]` with evidence or documented deferral
  - **Evidence**: _to be filled — checklist review pass_
- [ ] CHK-153 [P1] `implementation-summary.md` filled with concrete file paths plus LOC plus verification rows
  - **Evidence**: _to be filled — summary inspection_
- [ ] CHK-154 [P1] `graph-metadata.json` `derived.status` updated `planned` → `complete` after completion
  - **Evidence**: _to be filled — refreshed metadata_

<!-- /ANCHOR:sign-off -->
