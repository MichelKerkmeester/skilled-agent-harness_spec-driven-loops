---
title: "Feature Specification: system-code-graph deferred follow-on (P1 leftovers + P2 batch)"
description: "Closes the items intentionally deferred from packet 038 — P1-F1/F2 (package.json scripts + dist materialization + gitignore decision), P1-D1/D2/D3 (test additions + skip restorations), residual P1-A4/A5 docs (anything not covered by parallel SKILL.md alignment commits), P1-H config parity, P1-G1 doctor mkdir, and the ~30 P2 nice-to-haves from 037's review."
trigger_phrases:
  - "039 system-code-graph deferred follow-on"
  - "037 P2 batch"
  - "038 deferred leftovers"
  - "system-code-graph v1.0.2.0 polish"
  - "package.json gitignore decision"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/039-system-code-graph-deferred-followon"
    last_updated_at: "2026-05-15T18:05:00Z"
    last_updated_by: "claude-opus-4-7-039-scaffold"
    recent_action: "packet_scaffolded"
    next_safe_action: "await_user_dispatch_authorization"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-039-deferred-followon"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should .opencode/skills/system-code-graph/package.json be tracked (currently gitignored)?"
      - "Are P1-A SKILL.md gaps still open after parallel 058/4a commits, or fully covered?"
      - "Are P1-H1/H2/H3 cross-runtime config flags still divergent or has parallel work normalized them?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: system-code-graph Deferred Follow-on

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (non-release-gating; quality + completeness) |
| **Status** | Planned — awaiting dispatch authorization |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Source** | Packet 038's `spec.md` §8 "Verification Update" defer list + 037 P2 batch (~30 nice-to-haves) |
| **Executor (recommended)** | `cli-opencode --pure --model deepseek/deepseek-v4-pro` for code-touching items; manual or `cli-codex gpt-5.5 high fast` for doc-only items |
| **Concurrency** | Max 3 concurrent dispatches per batch |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 038 successfully closed 11 of the 24 verified P0+P1 findings from 037's 20-iter deep-review (P0-1 docs, P0-2 by parallel-agent's Path-1 real probe, P1-B1..B7 runtime cluster, P1-C1 launcher comment). A real-world parallel-agent collision pattern emerged: as 038 was dispatching, another agent shipped Path-1 isolation refactor (commit `6b6f41214` — 13 of 14 production imports removed), full SKILL.md alignment (`2b4abb3a1`, `68bce35cb`, `ec98af539`), and ccc_readiness_probe.ts real implementation. Three categories of work remained NOT-closed by either agent:

1. **P1-F1/F2** — `package.json` scripts block + dist materialization + a meta-question about whether `package.json` should be tracked or stay developer-local (currently in `.opencode/.gitignore`).
2. **P1-D1/D2/D3** — 2 NEW vitest files (`runtime-detection`, `exclude-rule-classifier`) + 2 stress-test moves (partially done by parallel agent — they deleted the misplaced stress files; need to verify the destination + restoration work) + 2 skip-test restorations in `doctor-apply-mode-stress.vitest.ts:125,184`.
3. **P1-A4/A5 + P1-H1/H2/H3 + P1-G1** — residual doc/config items that may or may not still be open depending on what the parallel agent's `058/4a` and `058/4b` and `058/4c` SKILL/README/references commits actually changed.

Plus the entire **P2 batch** (~30 nice-to-haves) is explicitly deferred from 038.

### Purpose

Close the deferred items via a focused Level-2 packet so v1.0.2.0 can ship as a "polish complete" release. Verify before fixing — many items may already be closed by the parallel agent's work.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/skills/system-code-graph/package.json` scripts block (currently locally applied but the file is `.opencode/.gitignore`'d). Decision needed: track-or-leave.
- `.opencode/.gitignore` — possibly remove the package.json line for `system-code-graph/` if Path 1 chosen.
- `mcp_server/dist/index.js` materialization (currently 59-byte stub). Run `npm run build` once Phase 0 scripts land.
- NEW `mcp_server/tests/runtime-detection.vitest.ts` covering `lib/runtime-detection.ts`.
- NEW `mcp_server/tests/exclude-rule-classifier.vitest.ts` covering `lib/exclude-rule-classifier.ts`.
- Skip-test restoration in `mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:125, 184` (mock or documented-skip).
- Verify parallel agent's stress-test deletion (`deep-loop-crud-stress` + `deep-loop-graph-convergence-stress`) is the right call OR re-create at the right location if they should have been moved.
- Re-verify P1-A4 (`feature_catalog/feature_catalog.md` structure drift) and P1-A5 (manual-testing playbook misclassification + Devin scenario length) after parallel `058/4*` commits.
- Re-verify P1-H1 (`SPECKIT_CODE_GRAPH_INDEX_*` defaults across 6 configs), P1-H2 (`_NOTE_1_DB` convention in 2 missed configs), P1-H3 (`_NOTE_AUTO_MIGRATION` in `.vscode/mcp.json`).
- Re-verify P1-G1 (`mcp-doctor.sh` fix-mode `mkdir -p` for `mk_code_index` db_dir).
- The full **P2 batch** (~30 findings) from 037's `review-report.md` per-iteration files.

### Out of Scope

- Anything already shipped by 038 (P0-1 docs, P0-2 ccc_* probe, P1-B1..B7 runtime cluster, P1-C1 launcher comment).
- Anything in the parallel agent's lockout (currently appears to be drained but verify before each fix).
- A NEW deep-review pass (this packet remediates known findings; if new findings emerge during 039, open packet 040).
- `system-skill-advisor` work (separate skill).

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete to ship v1.0.2.0)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify-then-fix discipline | Each finding is RE-VERIFIED against current main HEAD before remediation (parallel agent may have closed it). |
| REQ-002 | `package.json` gitignore decision documented | An ADR (or 1-paragraph decision note) records track-vs-leave; if track-chosen, `.opencode/.gitignore` is updated. |
| REQ-003 | `mcp_server/dist/index.js` non-stub | `wc -c mcp_server/dist/index.js` > 1000 bytes after `npm run build`. |
| REQ-004 | NEW vitest files pass | `npx vitest run tests/runtime-detection.vitest.ts tests/exclude-rule-classifier.vitest.ts` exits 0. |
| REQ-005 | Skip tests in `doctor-apply-mode-stress.vitest.ts:125,184` either restored OR documented-as-skipped with rationale | No bare `it.skip(...)` without a comment line. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | P1-A4 feature_catalog structure verified or fixed | Either re-verified clean OR refactored to sk-doc template hierarchy. |
| REQ-007 | P1-A5 playbook misclassification verified or fixed | Either re-verified clean OR row categorization + Devin scenario length addressed. |
| REQ-008 | P1-H1 INDEX_* flag defaults consistent across 6 configs | `rg "SPECKIT_CODE_GRAPH_INDEX_" .claude/mcp.json .codex/config.toml .devin/config.json .gemini/settings.json .vscode/mcp.json opencode.json` shows the same default (`"false"`) in all 6, with a documented exception list. |
| REQ-009 | P1-H2 `_NOTE_1_DB` convention applied | `.claude/mcp.json` + `.gemini/settings.json` use `_NOTE_1_DB` + `_NOTE_2_TOOLS` matching the other 4 configs. |
| REQ-010 | P1-H3 `_NOTE_AUTO_MIGRATION` present in `.vscode/mcp.json` | `jq '.servers.\"mk-spec-memory\".env._NOTE_AUTO_MIGRATION' .vscode/mcp.json` returns non-null. |
| REQ-011 | P1-G1 doctor mkdir | `mcp-doctor.sh diagnose_mk_code_index` fix-mode branch creates the db_dir if missing (matching `doctor_mcp_debug.yaml:150-152` repair_action). |
| REQ-012 | P2 batch triaged | Each ~30 P2 finding is EITHER addressed OR moved to a tracked-deferral list with rationale (no silent drops). |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict-validate exits 0 on the packet.
- **SC-002**: `npx tsc --noEmit` + `npx vitest run` clean post-Phase 1 (the test + build phase).
- **SC-003**: `mcp_server/dist/index.js` is real compiled output (not the 59-byte stub).
- **SC-004**: v1.0.2.0 changelog authored under `system-code-graph/changelog/v1.0.2.0.md` with HONEST scope summary.
- **SC-005**: All P0 + P1 from 037 review-report.md are either CLOSED (by 038 or 039) or moved to a tracked-deferral list under §7 OPEN QUESTIONS.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parallel agent may have already closed several items | Wasted dispatch cost / merge friction | Re-verify each finding against current main HEAD before remediation (REQ-001). |
| Risk | `package.json` gitignore decision is opinionated | Convention disagreement | Surface as Open Question; let operator decide; default to "track" if no decision in 24h. |
| Risk | NEW vitest files for runtime-detection + exclude-rule-classifier need quality (not stub tests) | Coverage theatre | Aim for ≥80% branch coverage; mirror pattern from `code-graph-cluster-a.vitest.ts`. |
| Risk | P2 batch is 30 items — packet bloat | Implementation drift | Cap at 10 P2 fixes; defer remaining 20 to packet 040 if pursued. |
| Dependency | Parallel agent's 058/4* commits stable | If parallel agent is still mutating SKILL/README, re-verifications are unreliable | Wait for parallel work to settle, OR re-verify per-iteration if it keeps moving. |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **`package.json` gitignore decision**: Track or stay developer-local? See REQ-002. Recommend "track" for portability + the scripts block becomes part of the repo; the operator's local `npm install` still works against tracked `package-lock.json`.
2. **P2 batch scope cap**: 10 highest-impact P2s in 039 vs all ~30? Recommend 10; defer 20 to 040 if pursued.
3. **Cross-runtime INDEX_* default value**: confirm `"false"` is the canonical end-user-safe default. Verification flagged 3 configs at `"true"` (opencode.json, .claude/mcp.json, .gemini/settings.json) and 3 at `"false"` (.codex/config.toml, .devin/config.json, .vscode/mcp.json). User decision required.
4. **Stress-test placement (parallel agent deleted them)**: confirm `deep-loop-crud-stress.vitest.ts` + `deep-loop-graph-convergence-stress.vitest.ts` are intentionally DELETED (parallel agent's call) vs MOVED elsewhere (e.g., `system-spec-kit/mcp_server/stress_test/`). If deleted-by-design, REQ-004's stress-move requirement is satisfied by the deletion + a documentation note.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001 — Verify-before-fix**: each remediation cites a re-verification result against current main HEAD (parallel agent may have closed items pre-emptively).
- **NFR-002 — Test quality**: new vitest files in Phase 1 maintain ≥80% branch coverage on the target module, mirror existing test style.
- **NFR-003 — Parallel-safe**: dispatches must check `git status --short` before each batch to verify the parallel agent's lockout list is empty for the target files.
- **NFR-004 — No silent P2 drops**: every P2 finding is either remediated OR moved to a tracked-deferral list with rationale.
- **NFR-005 — Honest v1.0.2.0 changelog**: scope summary reflects what actually shipped vs deferred, no aspirational language.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- **Parallel agent re-mutates already-fixed files mid-dispatch**: detected via `git pull --rebase` conflict; fall back to cherry-pick of the 039 commit + acknowledge parallel ownership.
- **`package.json` gitignore decision overruled mid-flight**: a Phase 1 commit gets reverted if the operator chooses "leave gitignored" after the initial track-default; document the reversal in the changelog.
- **New vitest tests fail on first run due to missing dependency**: blocked until Phase 1B's `npm install` lands; sequence is enforced via the [S] markers in `tasks.md`.
- **MCP server boot test fails post-Phase 1B build**: revert to the prior stub state of `dist/index.js`; re-run Phase 1A diagnosis; do not ship v1.0.2.0 until clean.
- **P2 batch surfaces a NEW P0 during triage**: stop Phase 3; open packet 040 immediately; do not bundle a release-blocker into a polish packet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

- **LOC estimate**: ~200-400 lines of code changes (2 new vitest files ≈ 150-200 LOC + config edits ≈ 30 LOC + P2 batch ≈ 50-100 LOC depending on cap).
- **Surface count**: 6 mcp_server source files (tests), 4 config files (.claude/mcp.json, .gemini/settings.json, .vscode/mcp.json, opencode.json), 1 doctor shell script, 1 changelog.
- **Coordination complexity**: HIGH — parallel agent is actively shipping commits; Phase 0 verification sweep mitigates by re-checking each finding against current HEAD.
- **Test risk**: MEDIUM — new vitest files must achieve real coverage, not stub tests.
- **Release-blocker risk**: LOW — 039 is polish, not release-gating (038 already shipped P0-1 + P0-2 fixes).
<!-- /ANCHOR:complexity -->

---

## 11. RELATED DOCUMENTS

- **037 review-report.md**: `.opencode/specs/.../037-system-code-graph-comprehensive-deep-review/review/review-report.md` (P0/P1/P2 source)
- **037 verification-addendum.md**: `.opencode/specs/.../037-.../review/verification-addendum.md` (verified vs partial vs hallucinated)
- **038 spec.md**: `.opencode/specs/.../038-system-code-graph-deep-review-remediation/spec.md` (parent remediation packet)
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
