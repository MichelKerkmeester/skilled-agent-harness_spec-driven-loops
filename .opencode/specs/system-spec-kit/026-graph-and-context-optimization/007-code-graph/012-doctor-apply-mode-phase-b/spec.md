---
title: "Feature Specification: /doctor:code-graph apply-mode (Phase B) [system-spec-kit/026-graph-and-context-optimization/007-code-graph/012-doctor-apply-mode-phase-b/spec]"
description: "Ship Phase B (apply-mode auto-fix operations) for /doctor:code-graph. Phase A (diagnostic-only) shipped in 007-code-graph/005-code-graph-doctor-command. The four prerequisite artifacts from research packet 007 (gold-query battery, staleness model, recovery playbook, exclude-rule confidence tiers) are all available; this packet wires them into a verification-battery-gated apply pipeline with rollback semantics."
trigger_phrases:
  - "doctor code graph apply mode"
  - "doctor code graph phase b"
  - "code-graph apply auto-fix"
  - "code-graph verification battery gating"
  - "code-graph recovery playbook automation"
  - "026/007/013 packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/012-doctor-apply-mode-phase-b"
    last_updated_at: "2026-05-08T21:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded Level 3 spec; 4 prerequisite artifacts confirmed shipped from research packet 007"
    next_safe_action: "Implement Phase B apply-mode"
    blockers: []
    key_files:
      - ".opencode/commands/doctor-code-graph.md"
      - ".opencode/commands/doctor-code-graph/auto.yaml"
      - ".opencode/commands/doctor-code-graph/confirm.yaml"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/status.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-apply-mode-phase-b-2026-05-08"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: /doctor:code-graph apply-mode (Phase B)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase A (diagnostic-only `/doctor:code-graph`) shipped in `007-code-graph/005-code-graph-doctor-command/`, gated Phase B behind four artifacts from research packet `006-code-graph-resilience-research`. All four artifacts are now in place: a 28-query gold battery (`assets/code-graph-gold-queries.json`), a 3-state staleness model (`assets/staleness-model.md`), three recovery procedures (`assets/recovery-playbook.md`), and 3-tier exclude-rule confidence (`assets/exclude-rule-confidence.json`). Phase B wires them into an apply-mode workflow that runs the gold battery as a pre/post-flight verification gate, executes the appropriate recovery procedure based on staleness state, and rolls back if verification fails.

**Key Decisions**: gate every apply action on the gold battery (90% overall / 80% edge-focus pass floors); confine self-healing to `soft-stale` states with bounded scope (≤50 stale files, no Git HEAD drift); require operator confirmation for `hard-stale` recovery (CG-RP-001 SQLite corruption, CG-RP-003 bad-apply rollback).

**Critical Dependencies**: All four research-packet-007 artifacts (already shipped). Phase A's diagnostic surface (already shipped). The existing `code_graph_scan` handler with `incremental:true|false` flag.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-08 |
| **Branch** | `main` |
| **Predecessor** | `005-code-graph-doctor-command/` (Phase A shipped); `006-code-graph-resilience-research/` (4 prerequisite artifacts) |
| **Successor** | None planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`/doctor:code-graph` shipped Phase A (diagnostic-only `auto` and `confirm` modes) in packet `005-code-graph-doctor-command/`, with apply-mode explicitly deferred behind the resilience research deliverables. Today operators can ASK the doctor what is wrong with the graph (it reports parser status, scan freshness, scope coverage, known stale areas), but they cannot ASK the doctor to FIX what it finds. Manual remediation requires walking the recovery-playbook procedures by hand against an already-degraded graph state.

### Purpose

Implement Phase B: an apply-mode workflow that runs verification-gated auto-fix operations against the staleness state Phase A diagnoses. Apply-mode runs the gold-query battery before and after each operation, executes the recovery procedure mapped from the recovery playbook, and rolls back the database triplet on verification failure. Operators get a single command to recover from the three documented failure classes (SQLite corruption, partial-scan failure, bad-apply rollback) with auditable evidence.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Apply-mode workflow YAML** — `.opencode/commands/doctor-code-graph/apply.yaml` (NEW). Runs verification battery → diagnoses staleness state → executes mapped recovery → re-runs battery → commits or rolls back.

**Three apply operations** (gated on staleness state):
- **Re-scan operation**: invokes `code_graph_scan` against scope identified as stale by the staleness model. `soft-stale` triggers `incremental:true`; `hard-stale` triggers `incremental:false`. Time-bounded by an operator-visible deadline.
- **Prune-excludes operation**: promotes/demotes bloat-dir excludes based on `exclude-rule-confidence.json` tiers. High-tier patterns are excluded without prompt; medium-tier prompts the operator; low-tier requires explicit opt-in.
- **Repair-nodes operation**: re-parses files in `parser_skip_list` (the bash-grammar quarantine table from phase 012/007) if quarantine is older than threshold AND prior crash root cause has been addressed. No-op when threshold unmet.

**Verification-battery gate**: every apply action runs the 28 gold queries from `assets/code-graph-gold-queries.json`. Pass requires ≥ 0.90 overall top-K symbol pass rate AND ≥ 0.80 per-edge-focus pass rate (per the artifact's `pass_policy`). Failure rolls back the operation.

**Confirm-mode prompt**: apply only after operator confirmation. The auto-mode YAML stays diagnostic-only (Phase A behavior preserved). Apply-mode is a third workflow YAML with explicit human-in-the-loop confirmation per operation.

**Rollback semantics**: on verification failure or operation abort, the runtime moves the current DB triplet (`code-graph.sqlite`, `…sqlite-wal`, `…sqlite-shm`) into a timestamped `bad-apply-*/` directory and restores the latest known-good snapshot. The recovery playbook's CG-RP-003 procedure is the reference implementation.

**Decision record (ADRs)**:
- **ADR-001 — Verification-battery gating**: gold battery passes are required for both pre-apply (baseline) and post-apply (commit). Rationale: prevents apply-mode from masking pre-existing degradation.
- **ADR-002 — Recovery-playbook → workflow translation**: each playbook procedure maps to an apply-mode step. The playbook stays the source of truth; the YAML is a generated execution surface.
- **ADR-003 — Rollback semantics on battery failure**: timestamped quarantine + known-good restore + post-rollback gold-battery re-verification. No silent overwrite of the failed DB triplet.
- **ADR-004 — Self-healing boundary**: apply-mode auto-fixes only `soft-stale` states with bounded scope (≤ 50 stale files, no Git HEAD drift, no schema/error signal). `hard-stale` requires explicit operator confirmation per playbook procedure.

### Out of Scope

- Phase A diagnostic checks (already shipped; this packet does not modify the auto/confirm YAMLs).
- New diagnostic surfaces (e.g., new readiness fields). The diagnostic surface is frozen as of Phase A.
- Recovery for the hard-stale `error` class beyond CG-RP-001 (SQLite corruption). New failure modes are research-packet work.
- CocoIndex daemon recovery (separate concern owned by 011-cocoindex-daemon-resilience).
- Skill-graph cache duplication (separate concern owned by 008/skill-advisor).
- Tree-sitter parser crash root-cause work (already shipped in 012/007 via `parser_skip_list`; apply-mode only re-parses skipped files when safe).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor-code-graph/apply.yaml` | Create | Apply-mode workflow: pre-flight gold battery → operation dispatch → post-flight gold battery → commit or rollback. |
| `.opencode/commands/doctor-code-graph.md` | Modify | Document apply-mode invocation; update mode descriptions table; cross-link to recovery playbook. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/apply-orchestrator.ts` | Create | Apply-mode runtime: state classifier (fresh/soft-stale/hard-stale), operation dispatcher, gold-battery runner, rollback executor. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/gold-battery-runner.ts` | Create | Loader for `code-graph-gold-queries.json`; per-query execution against the live graph; pass-floor evaluation. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/recovery-procedures.ts` | Create | Implementations of CG-RP-001 (SQLite corruption recovery), CG-RP-002 (partial-scan retry), CG-RP-003 (bad-apply rollback). |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/exclude-rule-classifier.ts` | Create | Loader for `exclude-rule-confidence.json`; per-pattern tier classification. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/apply.ts` | Create | MCP handler `code_graph_apply` exposing the apply-mode workflow. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Modify | Register `code_graph_apply` tool schema. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-apply-orchestrator.vitest.ts` | Create | Unit tests for state classification, operation dispatch, rollback. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-gold-battery.vitest.ts` | Create | Gold battery runner tests against fixture queries. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-recovery-procedures.vitest.ts` | Create | E2E tests for the three recovery procedures (CG-RP-001/002/003). |
| `.opencode/skills/system-spec-kit/mcp_server/tests/code-graph-apply-e2e.vitest.ts` | Create | End-to-end apply-mode test covering all 12 recovery-playbook scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (must complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Apply-mode workflow runs gold battery as pre-flight gate. | Every apply invocation runs all 28 gold queries before any DB mutation. Failure aborts apply with explicit diagnostic. |
| REQ-002 | Apply-mode workflow runs gold battery as post-flight gate. | After each operation, gold battery re-runs. Pass requires ≥ 0.90 overall top-K pass rate AND ≥ 0.80 per-edge-focus pass rate. |
| REQ-003 | Rollback executes on post-flight verification failure. | On post-flight gold battery failure, DB triplet is moved to timestamped `bad-apply-*/` directory; latest known-good snapshot is restored; gold battery re-runs against restored state to confirm rollback success. |
| REQ-004 | Self-healing boundary enforced. | Apply-mode auto-fixes ONLY `soft-stale` states. `hard-stale` (empty graph, error, Git HEAD drift, > 50 stale files, schema mismatch, missing `lastPersistedAt`) requires explicit confirm-mode operator prompt before any DB mutation. |

### P1 — Required (must complete OR explicit user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Re-scan operation routes by staleness state. | `soft-stale` triggers `code_graph_scan(incremental:true)`; `hard-stale` triggers `code_graph_scan(incremental:false)`. Decision and routing both visible in apply-mode log. |
| REQ-006 | Prune-excludes operation respects confidence tiers. | High-tier patterns excluded without prompt; medium-tier prompts before exclusion; low-tier requires explicit opt-in flag. |
| REQ-007 | Repair-nodes operation gated on quarantine age + crash-root-cause flag. | Re-parse fires only when `parser_skip_list` quarantine timestamp is older than threshold AND `crashRootCauseAddressed` config flag is true. No-op otherwise. |
| REQ-008 | All three recovery procedures implemented. | CG-RP-001 (SQLite corruption), CG-RP-002 (partial-scan failure), CG-RP-003 (bad-apply rollback) each have a runtime implementation with idempotence and verification per playbook. |
| REQ-009 | Apply-mode preserves existing diagnostic surface. | `auto` and `confirm` workflow YAMLs from Phase A unchanged. New `apply` YAML is the only addition. |
| REQ-010 | Apply-mode log carries auditable provenance. | Every apply run produces a structured log (JSONL) capturing pre-flight battery result, operation invoked, parameters, post-flight battery result, commit-or-rollback decision, and timestamps. |

### P2 — Refinement

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Apply-mode E2E test covers all 12 recovery-playbook scenarios. | New `code-graph-apply-e2e.vitest.ts` runs each documented recovery-playbook scenario; verifies recovery + verification + rollback paths. |
| REQ-012 | Apply-mode metrics surface in `code_graph_status`. | Status response gains `apply.lastRunAt`, `apply.lastResult` (committed/rolled-back), `apply.batteryPassRate` fields. |
| REQ-013 | Configurable battery pass-floor overrides. | `SPECKIT_CODE_GRAPH_BATTERY_OVERALL_FLOOR` and `SPECKIT_CODE_GRAPH_BATTERY_EDGE_FLOOR` env flags allow operators to tune floors above (never below) the artifact defaults. |
| REQ-014 | Recovery-playbook procedures linked from doctor-code-graph.md. | Operators reading the command doc can click through to each procedure with explicit symptom → action mapping. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 reqs above pass acceptance criteria.
- **SC-002**: New 4 vitest files pass; baseline holds (currently 11,587 / 11,829 passing — Unit F is recovering the 198-failure baseline drift in parallel).
- **SC-003**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 012-doctor-apply-mode-phase-b --strict` exits 0.
- **SC-004**: Live smoke: `/doctor:code-graph apply` against a soft-stale graph completes successfully and emits an audit log; against a hard-stale graph requires explicit confirm prompt; against a fresh graph is a no-op with battery-pass log.
- **SC-005**: All 12 recovery-playbook scenarios E2E pass on a sandbox DB.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Gold battery latency adds visible delay to apply-mode | Med | Time-bound battery execution; cap pre-flight at 5s, post-flight at 5s; fall through to operation timeout. |
| Risk | Rollback to known-good leaves operator with stale graph if no good snapshot exists | Med | Initialize from-scratch path documented in CG-RP-003: when no known-good copy exists, allow init to recreate schema and run incremental:false scan. |
| Risk | Self-healing boundary too tight → operators forced into manual recovery for common cases | Low | Boundary calibrated against staleness-model thresholds (≤ 50 stale files, no Git HEAD drift). Tighten only on data. |
| Risk | Repair-nodes operation re-parses files known to crash, regressing parser fix | High | Gate strictly on `crashRootCauseAddressed` config flag (default false); operator must opt in after confirming the underlying parser fix. |
| Dependency | All 4 research-packet-007 artifacts shipped | High | Confirmed by Explore: gold-queries.json, staleness-model.md, recovery-playbook.md, exclude-rule-confidence.json all present in `…/006-code-graph-resilience-research/assets/`. |
| Dependency | Phase A diagnostic surface stable | High | Phase A shipped; auto/confirm YAMLs frozen. Apply-mode is additive only. |
| Dependency | `parser_skip_list` quarantine table from phase 012/007 | Med | Already in production; repair-nodes operation reads from it but does not mutate the quarantine logic. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Pre-flight gold battery completes within 5 seconds on a fresh graph (28 queries × ~150ms each, typical).
- **NFR-P02**: Post-flight gold battery same target (5s).
- **NFR-P03**: Apply-mode total wall-clock for `soft-stale` recovery (re-scan incremental + battery × 2): < 30s on a typical workspace (≤ 1k files).
- **NFR-P04**: Rollback executes within 2 seconds (file-system mv operations + restore + battery re-run target ≤ 5s).

### Security

- **NFR-S01**: Apply-mode does NOT execute arbitrary shell from recovery-playbook procedures. All operations are typed function calls in `recovery-procedures.ts` with parameter validation.
- **NFR-S02**: Quarantine directories (`bad-apply-*`, `recovery-*`, `parser-skip-list`) live inside the workspace `.opencode/skills/system-spec-kit/mcp_server/code_graph/data/` tree. No writes outside the workspace.
- **NFR-S03**: Apply-mode log contains only file paths and counts — never source code content from indexed files.

### Reliability

- **NFR-R01**: Apply-mode is idempotent: repeated runs against the same starting state converge on the same end state. Per recovery-playbook source-first principle.
- **NFR-R02**: Concurrent apply-mode invocations (rare) MUST detect lock contention via SQLite advisory lock and fail-fast with explicit error.
- **NFR-R03**: Apply-mode failure during operation MUST leave the DB triplet in a recoverable state — either committed (post-flight pass) or rolled back to the prior known-good snapshot.
<!-- /ANCHOR:nfr -->

---

## 8. EDGE CASES

### Data Boundaries

- **Empty graph + missing known-good snapshot**: rollback path falls through to incremental:false scan from current source. Documented in CG-RP-003.
- **Pre-flight battery fails on a fresh graph**: indicates pre-existing baseline drift unrelated to apply-mode. Apply-mode aborts with explicit diagnostic; doctor's diagnostic mode reports the gap separately.
- **Post-flight battery passes but row counts collapsed**: per CG-RP-003, raw DB file size is not proof of recovery. Battery is the trust surface.
- **Repair-nodes against quarantine entries with no underlying root-cause fix**: no-op. Repair-nodes never re-parses without `crashRootCauseAddressed` flag.

### Error Scenarios

- **SQLite open fails post-rollback**: surface as hard-stale; require operator-driven CG-RP-001 corruption recovery.
- **Gold battery query times out (per-query > 1s)**: counts as a query failure for pass-floor calculation. Per `pass_policy.expected_count_tolerance`, ±20% tolerance applies before failure.
- **Apply-mode invoked while another scan is in flight**: lock contention detected; fail-fast with `SCAN_IN_PROGRESS` error; operator retries after scan completes.

### State Transitions

- **soft-stale → fresh**: re-scan incremental + battery pass + commit. Apply-mode happy path.
- **hard-stale → fresh**: confirm prompt → re-scan incremental:false + battery pass + commit. Operator-driven recovery path.
- **anything → bad-apply**: post-flight battery fail → quarantine current triplet → restore known-good → battery re-pass against restored state. Rollback path.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | 7 new lib modules + 1 new handler + 1 new YAML + 4 new test files; ~1500 LOC estimated. |
| Risk | 18/25 | DB write/rollback semantics; verification-gate correctness. Mitigated by gold-battery gating + rollback-on-failure. |
| Research | 14/20 | All 4 prerequisites are pre-research; this packet is implementation. Some calibration empirical (battery latency, rollback timing). |
| Multi-Agent | 6/15 | Single-agent implementation; no concurrent agent coordination. |
| Coordination | 11/15 | Touches doctor command + MCP server + tool-schemas; cross-runtime invocation parity check. |
| **Total** | **71/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Apply-mode silently regresses Phase A diagnostic behavior | H | L | Phase A YAMLs frozen; new YAML is `apply.yaml`; integration test asserts `auto`/`confirm` byte-equivalence pre/post. |
| R-002 | Gold battery passes pre-flight but post-flight failure leaves DB worse than start | H | L | Rollback path mandatory on post-flight failure; battery re-runs after rollback. |
| R-003 | Rollback restore from no known-good snapshot strands operator | M | M | Init-from-scratch fallback per CG-RP-003; explicit operator log surface. |
| R-004 | Repair-nodes regresses parser-crash fix | H | L | `crashRootCauseAddressed` flag default false; explicit operator opt-in. |

---

## 11. USER STORIES

### US-001: Recover from soft-stale graph (Priority: P0)

**As an** operator, **I want** `/doctor:code-graph apply` to recover from a soft-stale graph automatically, **so that** I don't have to walk the recovery playbook by hand.

**Acceptance Criteria**:
1. Given a soft-stale graph (1-50 stale files, no Git HEAD drift), When I run `/doctor:code-graph apply`, Then apply-mode runs pre-flight battery, executes incremental re-scan, runs post-flight battery, and commits — all visible in an audit log.

### US-002: Refuse to recover from hard-stale graph silently (Priority: P0)

**As an** operator, **I want** apply-mode to require explicit confirmation for hard-stale recovery, **so that** I don't accidentally trigger a 30-minute full scan.

**Acceptance Criteria**:
1. Given a hard-stale graph, When I run `/doctor:code-graph apply` without `--confirm`, Then apply-mode aborts with explicit diagnostic and prompts for `--confirm` before proceeding.

### US-003: Roll back on verification failure (Priority: P0)

**As an** operator, **I want** apply-mode to roll back if the gold battery fails post-apply, **so that** I never end up worse than I started.

**Acceptance Criteria**:
1. Given an apply operation completes but post-flight battery fails, When apply-mode evaluates the result, Then it quarantines the failed triplet, restores known-good, re-runs battery, and reports rollback success.

### US-004: Recover from SQLite corruption (Priority: P1)

**As an** operator, **I want** apply-mode to handle SQLite corruption per CG-RP-001, **so that** I don't have to manually run `.recover --ignore-freelist`.

**Acceptance Criteria**:
1. Given SQLite reports corruption, When I run `/doctor:code-graph apply --confirm`, Then apply-mode executes CG-RP-001 (forensic salvage attempt + quarantine + scratch rebuild) and reports the outcome.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- **Q1**: Should apply-mode expose a `--dry-run` flag that runs both batteries but skips the operation? (Recommendation: yes — useful for operators to confirm baseline before committing to a long apply. cli-codex implementation should ship this.)
- **Q2**: Should the audit log JSONL go into the existing `code_graph` data directory or a separate `apply-audit/` subdir? (Recommendation: `apply-audit/` subdir under `data/` for clarity.)
- **Q3**: Should apply-mode write a recovery report markdown alongside the JSONL log? (Recommendation: skip in MVP — JSONL is enough; markdown report can be a follow-on packet.)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor (Phase A)**: `../005-code-graph-doctor-command/spec.md`, `…/implementation-summary.md`
- **Research artifacts**: `../006-code-graph-resilience-research/assets/code-graph-gold-queries.json`, `…/staleness-model.md`, `…/recovery-playbook.md`, `…/exclude-rule-confidence.json`
- **Phase 012/007 (parser_skip_list)**: `../011-real-world-usefulness-test/007-tree-sitter-parser-resilience/`
- **Sibling packet (CocoIndex daemon)**: `../../011-cocoindex-daemon-resilience/`
