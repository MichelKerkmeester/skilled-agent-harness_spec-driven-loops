---
title: "system-code-graph 037 Deep-Review Remediation (cli-opencode + deepseek-v4-pro variant=xhigh)"
description: "Phased remediation of all P0 + P1 findings from packet 037's 20-iter deep-review. Dispatched via cli-opencode + deepseek-v4-pro variant=xhigh (direct DeepSeek API). Parallel-aware: SKILL.md, README.md, and references/ are owned by another agent in flight."
trigger_phrases:
  - "038 system-code-graph deep-review remediation"
  - "037 P0 P1 remediation"
  - "cli-opencode deepseek-v4-pro xhigh remediation"
  - "code-graph v1.0.1.0 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/038-system-code-graph-deep-review-remediation"
    last_updated_at: "2026-05-15T20:35:00Z"
    last_updated_by: "main-agent-038-closeout"
    recent_action: "all_phases_complete_v1.0.2.0_shipped"
    next_safe_action: "monitor_query_ts_followon_in_packet_039"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/changelog/v1.0.2.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-038-remediation"
      parent_session_id: "2026-05-15-037-deep-review-cli-devin"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Path-1 vs Path-2: Both shipped — Path-1 (real refactor) at 6b6f41214 removed 13 of 14 production imports; Path-2 (honest docs + CI guardrail) at cdc56b7c1; v1.0.0.0 ERRATUM preserves audit trail."
      - "ccc_* fake readiness: replaced with real CocoIndex probe at lib/ccc-readiness-probe.ts."
      - "Launcher DB MOVE: shipped at 35c1892c5 — new path .opencode/.spec-kit/code-graph/database/ with auto-migration logic; all 6 runtime configs updated."
      - "Feature catalog filename: kept lowercase per user choice."
      - "SKILL.md version bump: deferred to parallel agent ('let them' choice). Currently still 1.0.0.0; v1.0.2.0 changelog ships independent of frontmatter version."
      - "037 P1 query.ts:14 remaining import classified as @spec-kit/shared workspace alias (intentional cross-skill type-sharing, not a leak) per v1.0.2.0 changelog."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 037 Deep-Review Remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 (release-gating for v1.0.1.0) |
| **Status** | Planned — awaiting dispatch authorization |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Source** | Packet 037 review/review-report.md (verdict: 🟡 CONDITIONAL) |
| **Executor** | `cli-opencode --pure --model deepseek-v4-pro --variant xhigh` |
| **Concurrency** | Max 3 concurrent dispatches per batch (RM-8 four-layer mitigation) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 037's 20-iter deep-review surfaced 2 P0 + 25 P1 + ~30 P2 findings on system-code-graph v1.0.0.0. The P0s contradict shipped documentation claims (isolation lie + ccc_* fake readiness). The P1s span runtime correctness, tests, build state, launcher, /doctor coverage, and cross-runtime config consistency. Without remediation, v1.0.0.0 ships in a CONDITIONAL state with a known documentation-vs-reality gap.

### Purpose

Close all P0 + P1 findings via phased cli-opencode + deepseek-v4-pro dispatches, parallel-aware to honor the other agent's concurrent SKILL.md / README.md / references/ scope. Ship as v1.0.1.0 with an honest changelog.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (this packet)

- All P0 + P1 findings from 037 review-report.md that are NOT in the parallel agent's lockout (everything outside SKILL.md, README.md, references/).
- New CI workflow surface: reverse-direction isolation audit step.
- New test files for 4 critical lib modules with zero coverage.
- v1.0.1.0 changelog entry under `.opencode/skills/system-code-graph/changelog/`.
- Optional: SKILL.md + README.md + references/ remediations (Phase 5A) handed back as a follow-on after parallel agent completes.

### Out of Scope

- SKILL.md / README.md / references/ edits while parallel agent is active (Phase 5A deferred until lockout lifts).
- The ~30 P2 nice-to-haves (deferred to packet 039 if pursued).
- Full Path-1 refactor of the 15 production-file isolation imports (Path-2 honest-doc rewrite chosen instead; Path-1 reopens as a separate packet if needed).
- Any agent-driven version bump beyond patch level (1.0.0.0 → 1.0.1.0 is the cap).

### Parallel-agent lockout (verified 2026-05-15)

- `.opencode/skills/system-code-graph/SKILL.md` — owned by parallel agent
- `.opencode/skills/system-code-graph/README.md` — owned by parallel agent
- `.opencode/skills/system-code-graph/references/**` — owned by parallel agent

NO dispatch in this packet touches any path under the lockout.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | All 2 P0 findings from 037 closed | review-report-v2.md (post-remediation re-review) shows P0=0. |
| REQ-002 | All 25 P1 findings from 037 closed OR explicitly deferred with rationale | review-report-v2.md shows P1=0 or each remaining P1 has a deferral note. |
| REQ-003 | No regressions in tests | vitest pass count ≥ pre-remediation baseline. |
| REQ-004 | TypeScript compilation clean | `tsc --noEmit -p tsconfig.json` exits 0. |

### P1 - Required

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-005 | Reverse-direction CI isolation audit added | `.github/workflows/isolation-check.yml` has a step that grep-fails when system-code-graph imports system-spec-kit. |
| REQ-006 | All file scopes respected | git diff shows ZERO modifications to SKILL.md, README.md, or references/** in this packet's commits. |
| REQ-007 | Each batch has a commit baseline + recovery point | `git log` shows one commit per phase batch with conventional commit format. |
| REQ-008 | v1.0.1.0 changelog ships | `.opencode/skills/system-code-graph/changelog/v1.0.1.0.md` exists with honest scope. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:phases -->
## 5. PHASE PLAN

### Phase 0 — Pre-flight (manual, no dispatch)

- Confirm `cli-opencode` auth + DeepSeek API quota.
- Capture commit baseline: `git rev-parse HEAD` (currently `2427f5f0b`).
- Scaffold this packet (DONE — current spec.md).
- Verify parallel-agent file lockout via fresh `git status --short` immediately before each batch (abort if SKILL.md/README.md/references/ show staged changes).

### Phase 1 — P0 fixes (BATCH 1: 2 concurrent dispatches)

**1A — P0-1 Isolation honesty** (Path-2: docs + CI, not Path-1 refactor)
- Files: `.opencode/skills/system-code-graph/INSTALL_GUIDE.md`, `.opencode/skills/system-code-graph/changelog/v1.0.0.0.md`, `.github/workflows/isolation-check.yml`
- Rewrite §1 OVERVIEW paragraph in INSTALL_GUIDE.md that claims "Zero from 'system-spec-kit' imports remain" → honest "shared types via @spec-kit/shared + a small set of direct imports for cross-skill helpers; full decoupling is a future arc".
- Same paragraph in changelog v1.0.0.0.md — mark as a v1.0.0.0 erratum at the bottom (preserve audit trail) OR rewrite in place + note the rewrite in the v1.0.1.0 changelog.
- Add reverse-direction audit step to `.github/workflows/isolation-check.yml` that fails CI if `system-code-graph/mcp_server/**/*.ts` contains imports from `system-spec-kit/**`.

**1B — P0-2 ccc_* fake readiness**
- Files: `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`
- Decision: drop the readiness field from these 3 handlers (simpler) OR implement real probe (substantive). Recommend drop for v1.0.1.0, defer real probe to future packet 040 if pursued.
- Replace `buildUnavailableReadiness('readiness_not_applicable')` with either no field OR explicit non-readiness contract documented in handler doc-comments.

### Phase 2 — Runtime/handler P1s (BATCH 2: 3 concurrent dispatches)

**2A — index.ts server hardening (P1-B1)**
- File: `mcp_server/index.ts`
- Wrap `server.connect(transport)` in try/catch with logging + `process.exit(1)`.
- Add `process.on('uncaughtException')` + `process.on('unhandledRejection')` handlers.
- Accept explicit `rootDir` for `writeCodeGraphReadinessMarker` instead of `process.cwd()`.

**2B — scan + indexer logic (P1-B2)**
- Files: `mcp_server/handlers/scan.ts`, `mcp_server/lib/structural-indexer.ts`
- Fix `fullReindexTriggered = false` hardcode at scan.ts:363 → conditional on git-HEAD-change detection.
- Simplify redundant filter at scan.ts:614-618.
- Move `droppedReconciledEdges` counter increment to after edge filtering at structural-indexer.ts:1907-1909.

**2C — query + context + status + apply (P1-B3 through B7)**
- Files: `mcp_server/handlers/query.ts`, `mcp_server/lib/code-graph-context.ts`, `mcp_server/handlers/status.ts`, `mcp_server/lib/apply-orchestrator.ts`, `mcp_server/lib/readiness-contract.ts` (for GoldVerificationTrust widening)
- Wrap blast_radius DB queries in transaction.
- Add node dedup in neighborhood retrieval (Set on symbolId/fqName).
- Widen `GoldVerificationTrust` to include `'unavailable'`.
- Add `confirm=true` gate to `repair-nodes` apply operation.
- Remove unused `recoverPartialScanFailure` import OR wire it in.

### Phase 3 — Tests + build + launcher P1s (BATCH 3: 3 concurrent dispatches)

**3A — Launcher comment (P1-C1)**
- File: `.opencode/bin/mk-code-index-launcher.cjs`
- Rewrite "standalone-storage guard" header comment to describe what's actually implemented (DB lives inside skill dir at `mcp_server/database/`, not a standalone location). OR move the DB if the original design intent matters more than ship-it-now.

**3B — package.json build script + verify dist (P1-F1, F2)**
- File: `.opencode/skills/system-code-graph/package.json`
- Add `"scripts": { "build": "tsc --build tsconfig.json", "typecheck": "tsc --noEmit -p tsconfig.json" }`.
- Run `npm install` + `npm run build` to materialize the dist artifact.

**3C — Test additions + moves (P1-D1, D2, D3)**
- NEW files in `mcp_server/tests/`:
  - `runtime-detection.vitest.ts` — cover all runtime detection branches + hook policy edge cases + env var parsing
  - `tree-sitter-parser.vitest.ts` — parser init + grammar caching + quarantine logic + error handling + skip-list
  - `auto-rescan-policy.vitest.ts` — scope fingerprint matching + parse-diagnostics backlog + decision branches
  - `exclude-rule-classifier.vitest.ts` — JSON schema validation + tier classification + pattern loading + error handling
- MOVE or DELETE: `stress_test/code-graph/deep-loop-crud-stress.vitest.ts` + `deep-loop-graph-convergence-stress.vitest.ts` (these test coverage-graph, not code-graph — move to system-spec-kit stress dir OR delete if duplicate)
- RESTORE: `stress_test/code-graph/doctor-apply-mode-stress.vitest.ts:125,184` skipped tests (provide missing fixtures/auth or mock alternative)

### Phase 4 — Config parity P1s (BATCH 4: SEQUENTIAL, small surgical edits)

**4A — SPECKIT_CODE_GRAPH_INDEX_* default alignment (P1-H1)**
- Files: `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json`
- Flip 5 flags from `"true"` to `"false"` to match end-user-safe design.
- Add doc comment that maintainer mode is `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true` in `.env.local`.

**4B — _NOTE_1_DB convention in 2 missed configs (P1-H2)**
- Files: `.claude/mcp.json`, `.gemini/settings.json`
- Rename `_NOTE_1_TOOLS` → `_NOTE_2_TOOLS`, prepend new `_NOTE_1_DB` per the canonical opencode.json shape.

**4C — _NOTE_AUTO_MIGRATION in .vscode/mcp.json (P1-H3)**
- File: `.vscode/mcp.json`
- Add the missing `_NOTE_AUTO_MIGRATION` comment in the mk-spec-memory env block.

**4D — mcp-doctor.sh fix-mode db_dir creation (P1-G1)**
- File: `.opencode/commands/doctor/scripts/mcp-doctor.sh`
- Add `mkdir -p "$db_dir"` to the `diagnose_mk_code_index` fix-mode body when the db_dir check failed.

### Phase 5 — Doc P1s

**5A — SKILL.md sk-doc template alignment (P1-A1, A2, A3) — DEFERRED**
- BLOCKED: parallel agent owns SKILL.md. Wait for lockout to lift, then assess what's left.

**5B — feature_catalog restructure (P1-A4)**
- Files: `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` + per-feature `*/*.md`
- Restructure root catalog to sk-doc template hierarchy: `### {FEATURE_NAME} / #### Description / #### Current Reality / #### Source Files`.
- Filename: keep lowercase `feature_catalog.md` (project convention) OR rename to `FEATURE_CATALOG.md` per template (user decision).

**5C — manual_testing_playbook misclassification + Devin scenario (P1-A5)**
- Files: `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md`, `10--devin-hooks/025-devin-session-start.md`
- Fix scenario 024 + 016 misclassification (move file OR move listing).
- Refactor Devin scenario to match the standard ~65-line template OR document why it's an exception.

### Phase 6 — P2 batch — DEFERRED to packet 039 if pursued

~30 P2 nice-to-haves. Out of 038's scope.

### Phase 7 — Verification

- Re-run 5 spot-check deep-review iterations on the changed dimensions (cli-devin SWE-1.6).
- Strict-validate packet 038: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict`.
- TS typecheck + vitest full suite.

### Phase 8 — Ship v1.0.1.0

- Author `.opencode/skills/system-code-graph/changelog/v1.0.1.0.md` with HONEST scope (what shipped, what deferred, what's still imperfect).
- Bump SKILL.md version `1.0.0.0` → `1.0.1.0` (NOTE: this conflicts with parallel scope — defer to parallel agent OR coordinate explicitly).
- Final commit: `feat(038): close 037 P0+P1 wave — system-code-graph v1.0.1.0`.
- Push to origin/main.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dispatch-pattern -->
## 6. DISPATCH PATTERN — cli-opencode + deepseek-v4-pro variant=xhigh

### Command shape

```bash
opencode run \
  --model deepseek-v4-pro \
  --agent general \
  --format json \
  --dangerously-skip-permissions \
  --pure \
  --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public \
  --variant xhigh \
  "$(cat /tmp/038-batch-N-task.prompt.md)" \
  </dev/null \
  > /tmp/038-batch-N-task.output.log 2>&1
```

### RM-8 four-layer mitigation

- **L1 — Hardened prompt:** every prompt explicitly lists allowed file paths + a NEVER-MODIFY list (SKILL.md, README.md, references/, and any file outside the task's listed scope).
- **L2 — Scope check before dispatch:** `git status --short` to confirm zero staged or working-tree changes to lockout paths. Abort if any.
- **L3 — Commit baseline:** capture `git rev-parse HEAD` before each batch; revertable in one step.
- **L4 — Model awareness:** deepseek-v4-pro is RM-8-validated per memory `feedback_rm8_mitigation_works_under_deepseek.md`.

### Concurrency

- BATCH 1 (Phase 1): 2 concurrent (1A + 1B disjoint scopes).
- BATCH 2 (Phase 2): 3 concurrent (2A + 2B + 2C disjoint scopes).
- BATCH 3 (Phase 3): 3 concurrent (3A + 3B + 3C — 3B requires post-dispatch npm install + tsc, run after).
- BATCH 4 (Phase 4): SEQUENTIAL — 4 small edits, parallelism risks outweigh speed.
- BATCH 5 (Phase 5B + 5C): 2 concurrent OR sequential per user choice.

Memory: practical CLI ceiling 3-4 concurrent (cli-codex); cli-opencode session-creation overhead suggests staying at 3.

### Stop conditions

- Any dispatch exits non-zero → halt batch, log, ask user.
- Any commit shows changes to SKILL.md / README.md / references/ → revert, alert, halt.
- Any vitest baseline regression detected post-batch → revert that batch, isolate the offending change.
<!-- /ANCHOR:dispatch-pattern -->

---

<!-- ANCHOR:open-questions -->
## 7. OPEN QUESTIONS

1. **Path-2 vs Path-1 for P0-1.** Recommended Path-2 (honest-doc + CI guardrail). Path-1 (refactor 15 production-file imports) is bigger scope — open as packet 040 if pursued.
2. **ccc_* readiness: drop or implement?** Recommended drop for v1.0.1.0; real probe deferred.
3. **Launcher P1-C1: rewrite comment or move DB?** Recommended rewrite comment (smaller change); DB move is bigger scope.
4. **feature_catalog filename: keep lowercase or rename to FEATURE_CATALOG.md?** Project convention is lowercase; sk-doc template suggests uppercase. Sticking with lowercase unless user overrides.
5. **SKILL.md version bump (Phase 8) — coordinate with parallel agent?** Either parallel agent bumps it as part of their work, or 038 makes a single-line bump at the end with explicit coordination.
<!-- /ANCHOR:open-questions -->

---

## 8. VERIFICATION UPDATE (2026-05-15)

After this spec was authored, packet 037 ran a 5-iter cross-AI verification pass via `cli-codex gpt-5.5 high fast` (iterations 021–025, see `037/.../review/verification-addendum.md`). Verdict counts: **15 VERIFIED · 9 PARTIAL · 0 HALLUCINATED** across 24 P0+P1 claims.

**Net effect on this packet's scope: no findings DROPPED, but 9 PARTIAL findings need wording revisions before remediation.** Specifically:

| Original | PARTIAL because | Revision required before remediation |
|---|---|---|
| P0-1 | Import counts verified (46 imports, 23 files) but category split misstated | Use corrected breakdown: 11 production `.ts` + 3 `.d.ts` + 5 tests + 4 stress tests |
| P0-2 | Hardcoded readiness verified; `tool-schemas.ts:197-218` does NOT advertise readiness | Revise framing — either drop readiness field entirely OR define a real N/A contract |
| P1-A4 | Structure drift verified; filename critique CONTRADICTED — `feature_catalog_template.md:29-36, :83-86` uses lowercase | Keep structure work; DROP the filename rename suggestion |
| P1-A5 | Misclassified rows verified; Devin scenario length overstated | Fix row categorization; treat Devin scenario as cosmetic style review |
| P1-B2 | First two sub-claims (fullReindexTriggered + filter) verified; edge counter overclaim at `structural-indexer.ts:1896-1899` | Keep first two; re-evaluate edge counter sub-claim |
| P1-B5 | Shared trust type is **7-state** at `shared-payload.ts:34-43`, not 4-state as originally claimed | Revise canonical-type wording in the fix |
| P1-C1 | DB path embedded confirmed; "standalone-storage guard" wording NOT FOUND in launcher | Drop the wording-claim part; keep only the path-relocation discussion |
| P1-D1 | 2 of 4 modules verified uncovered (`runtime-detection` + `exclude-rule-classifier`); the other 2 actually have test coverage | Revise to 2 uncovered modules, not 4 |
| P1-F2 | Dist stub claim VERIFIED (59-byte stub); `node_modules` claim FALSE — directory currently exists | Keep dist concern; drop `node_modules` claim |

**Action items before Batch 1 dispatch**:
1. Each Phase's dispatch prompt MUST cite the *corrected* finding wording (use verification-addendum.md as source-of-truth, not the original review-report.md, where they diverge).
2. The 9 revisions above are wording-only — they don't change which phases fire or which files are touched, only how the prompts describe the defect.
3. Previously-dismissed P0-3 (apply-orchestrator.ts:342 TS error) RECONFIRMED dismissed by cross-check: `npx tsc --noEmit -p tsconfig.json` from `system-code-graph/mcp_server/` is clean. Do not include in scope.

**Status**: spec ready; awaits user dispatch authorization (still gated per `_memory.continuity.next_safe_action`).
