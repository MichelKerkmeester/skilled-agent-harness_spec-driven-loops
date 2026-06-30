---
title: "Feature Specification: B2 Guarded data-quality Route on /doctor [template:level_2/spec.md]"
description: "/doctor has no data-quality route, so the spec corpus has no interactive front door for running the shared DQ detectors and applying safe fixes. This phase adds a data-quality route modeled on the code-graph route shape, diagnostic by default and mutating behind --confirm and --dry-run over the same B1 safe-fix engine."
trigger_phrases:
  - "doctor data quality route"
  - "data-quality interactive front door"
  - "guarded auto-remediation doctor"
  - "doctor confirm dry-run dq"
  - "doctor route validate manifest"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/002-retroactive-automation/012-doctor-dq-route"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the B2 doctor data-quality route implementation spec from research synthesis"
    next_safe_action: "Author plan.md and tasks.md once the B1 shared safe-fix engine phase lands the dq-engine seam"
    blockers: []
    key_files:
      - "../research/research.md"
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/doctor_code-graph.yaml"
      - ".opencode/commands/doctor/assets/doctor_memory.yaml"
      - ".opencode/commands/doctor/scripts/route-validate.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-phase-author"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Whether the route mutating enum is mutates from the start or add-only until the B1 engine apply path is wired"
    answered_questions:
      - "The route uses the same B1 safe-fix engine, not a second implementation"
---
# Feature Specification: B2 Guarded data-quality Route on /doctor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `012-doctor-dq-route` |
| **Verdict** | GO-on-cost (floor-bypassing governance front door) |
| **Tier** | B (retroactive, most-automated) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/doctor` is an argv router whose route manifest at `.opencode/commands/doctor/_routes.yaml` lists nine targets and zero of them inspect or remediate source-doc and metadata-JSON quality. The shipped routes are index-and-DB-hygiene tools by contract, the research NO-GO list is explicit that `/doctor memory` and `/memory:manage` are read-only index axes and not content-quality tools (`research/research.md` section 2 Tier D row). So the spec corpus has no interactive operator front door for running the shared data-quality detectors against the docs and the two JSONs, and no guarded way to apply the safe-class fixes that the B1 sweep already knows how to make.

### Purpose
Add a `data-quality` route to `/doctor` that is diagnostic by default and applies safe-class fixes only behind `--confirm` plus `--dry-run`, reusing the same B1 safe-fix engine and the same frozen `fixClass` registry so the interactive door and the scheduled sweep can never diverge.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Append a `data-quality` route to `.opencode/commands/doctor/_routes.yaml` following the existing per-route schema (target, yaml, setup_vars, allowed_flags, mutating, gate3_location, mcp_tools, trigger_phrases).
- Author `.opencode/commands/doctor/assets/doctor_data-quality.yaml` modeled on the `doctor_code-graph.yaml` shape (diagnostic-default Phase A, `mutation_boundaries`, a pre-phase approval gate, `--dry-run` and `--confirm` flags).
- Define the route `validate_targets` machinery as the inverted form of `doctor_memory.yaml`, allow the authored docs and the two JSONs, forbid the databases.
- Call the SAME B1 `dq-engine.runDetectors(target, opts)` in report mode by default and in safe-apply mode only under `--confirm`, with `opts.allowFixClass` pinned to `['safe']`.
- Re-run `route-validate.py` so the new route passes the manifest assertions.

### Out of Scope
- The B1 shared safe-fix engine, the detector registry and the frozen `fixClass` allow-list - owned by the `026-shared-safe-fix-engine` sibling phase, this route is a consumer not a builder.
- The scheduled sweep, the GitHub Actions workflow and the post-merge hook - owned by the B1 phase, this is the interactive door over the same engine.
- Any retrieval-class detector or its promotion - gated on the C2 prod-mode completeRecall@3 read, never run from this route.
- Authored-doc BODY mutation - INV-1 holds, a body fix is never `safe`, so this route never applies one.
- The DBs and the index - the route forbids them in `validate_targets` and never calls a scan or an index write.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/doctor/_routes.yaml` | Modify | Append the `data-quality` route row under `routes:` |
| `.opencode/commands/doctor/assets/doctor_data-quality.yaml` | Create | The route workflow asset, diagnostic-default with a confirm-gated safe-apply phase |
| `.opencode/commands/doctor/speckit.md` | Modify | Register the route in the router dispatch table if the router enumerates targets explicitly |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN `/doctor data-quality` runs with no mutation flag THE SYSTEM SHALL run report-only and write no file outside packet-local scratch | A run with default flags produces a diagnostic report and `git status` shows no doc or JSON change |
| REQ-002 | THE route SHALL declare `--dry-run` and `--confirm` in `allowed_flags` and apply safe-class fixes only when `--confirm` is present | Without `--confirm` a fixable issue is reported not applied, with `--confirm` the same issue is applied through the B1 engine |
| REQ-003 | THE route `validate_targets` SHALL allow the authored docs and the two JSONs and forbid the databases as the inverted form of `doctor_memory.yaml` | An apply attempt against any DB path halts with `STATUS=FAIL ERROR='confirm-mode-mutation-violation'` |
| REQ-004 | THE route SHALL call the SAME B1 `dq-engine` with `allowFixClass` pinned to `['safe']` and SHALL NOT implement a second detector or scorer | The route YAML and the router invoke `dq-engine.runDetectors`, grep finds no parallel scoring logic in the route asset |
| REQ-005 | THE new route SHALL pass `route-validate.py` | `python3 .opencode/commands/doctor/scripts/route-validate.py` exits 0 with the `data-quality` row present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | WHEN `--dry-run` is set with `--confirm` THE SYSTEM SHALL print the would-apply diff and apply nothing | A dry-run confirm run lists the safe fixes and `git status` stays clean |
| REQ-007 | THE route SHALL present an approval gate after analysis and before any apply phase, mirroring the `code-graph` pre-phase-2 gate | The workflow halts at the gate and honors an abort with `STATUS=CANCELLED` |
| REQ-008 | THE route `mutating` enum and `gate3_location` SHALL be accurate, `mutates` with a concrete docs-and-JSON gate3 location once the apply path is wired | The manifest row declares `mutates` and a non-`n/a` `gate3_location`, the route-validate mutating-class assertion passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/doctor data-quality` exists, runs report-only by default and applies safe-class fixes only behind `--confirm`, verified by one default run and one confirm run on a scratch packet.
- **SC-002**: The route reuses the B1 engine and registry with zero duplicate detector or scorer logic, verified by grep over the route asset.
- **SC-003**: `route-validate.py` exits 0 with the `data-quality` row, and an apply against a DB path halts with the mutation-violation error.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `026-shared-safe-fix-engine` (A1/B1/B2 shared core) | Without `dq-engine.ts` and the frozen `fixClass` registry this route has no engine to call | Build after the engine phase lands the `runDetectors` seam, the route is a thin consumer |
| Dependency | B1 sibling phase (the scheduled sweep) | B2 is the interactive door over the SAME engine, a divergent door would split the verdict | Pin to the shared engine and registry, never a second implementation |
| Dependency | `route-validate.py` manifest assertions | A malformed route row fails CI | Mirror the existing `code-graph` and `memory` rows exactly, re-run route-validate before claiming done |
| Risk | INV-1 violation, applying an authored-body fix | A body mutation on a git-tracked doc is unprovable per-change under the truncation floor | `allowFixClass` pinned to `['safe']`, the engine's `safe` allow-list never contains a body fix |
| Risk | `validate_targets` inversion error allowing a DB write | Corpus or DB blast radius | Inverted allow and forbid lists mirror `doctor_memory.yaml`, enforcement halts on any DB-path apply attempt |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Safety
- **NFR-S01**: The route is read-only by default, every mutating path is gated behind `--confirm` and bounded to `safe`-class fixes.
- **NFR-S02**: An attempted write to a forbidden target halts with `STATUS=FAIL ERROR='confirm-mode-mutation-violation'`, matching the `doctor_memory.yaml` enforcement contract.

### Consistency
- **NFR-C01**: The route shares ONE engine and ONE `fixClass` registry with B1, so the interactive door and the scheduled sweep cannot apply divergent fixes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Flag Boundaries
- `--confirm` without `--dry-run`: applies safe-class fixes through the engine, gated on the approval prompt.
- `--dry-run` with `--confirm`: prints the would-apply set, applies nothing.
- Neither flag: report-only, the default and safest path.

### Error Scenarios
- B1 engine unavailable: report `dq-engine` not found, exit without applying, do not fall back to an ad-hoc fixer.
- Apply target matches a forbidden DB pattern: halt with the mutation-violation error before any write.
- Operator aborts at the approval gate: honor the abort, exit `STATUS=CANCELLED`, write no fix.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One new route asset, one manifest append, one router-table edit, consumes an external engine |
| Risk | 12/25 | Mutating route, but gated and bounded to safe-class, the inverted validate_targets is the sharp edge |
| Research | 4/20 | Seams are verified to file:line in research.md, the code-graph and memory routes are the shipped precedents |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether the route declares `mutating: mutates` from the first commit or starts `add-only` until the B1 engine apply path is wired, route-validate accepts either as long as `gate3_location` matches the declared class.
- Whether the approval gate reuses the `code-graph` pre-phase-2 prompt verbatim or names the doc-and-JSON fix classes explicitly.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
