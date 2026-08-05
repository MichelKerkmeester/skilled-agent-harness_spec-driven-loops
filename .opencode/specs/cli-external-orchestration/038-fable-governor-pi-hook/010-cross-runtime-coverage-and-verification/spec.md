---
title: "Cross-Runtime Coverage and Verification: Quoted-Executor Dispatch Fix"
description: "Record the R1-P1-001 root-cause fix for quoted executor forms bypassing Pi dispatch inspection, its shared-lib test evidence, and the cross-runtime documentation coverage authored alongside it."
trigger_phrases:
  - "quoted executor dispatch bypass"
  - "R1-P1-001 fix"
  - "cross-runtime coverage verification"
  - "directExecutor quoted guard removal"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification"
    last_updated_at: "2026-08-05T14:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the 010 docs recording the quoted-executor dispatch fix"
    next_safe_action: "Confirm the fix is committed and open a system-deep-loop remediation packet"
    blockers:
      - "The fix files remain uncommitted in the working tree (M dispatch-audit.mjs, M dispatch-audit.test.mjs, M dispatch-preflight-lint.ts, ?? dispatch-preflight-lint.test.ts) as of authoring time"
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-audit.test.mjs"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - "../review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:a172c649566b721f1c6e9b0d7367bd3e1f8c455efa9f5f5b9300e955ecc33de5"
      session_id: "2026-08-05-cli-038-010-doc"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When does R2-P1-002 (receipt MAC advisory) get its own system-deep-loop remediation packet?"
      - "When does R2-P1-003 (dirty-path containment) get its own system-deep-loop remediation packet?"
    answered_questions:
      - "R1-P1-001 (quoted executor forms bypass Pi dispatch inspection) is RESOLVED; the blanket quoted-executor guard in directExecutor() was removed in favor of exact basename-set membership."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cross-Runtime Coverage and Verification: Quoted-Executor Dispatch Fix

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 10 (documentation phase, added after the parent's original nine-phase map converged; see Open Questions in `../spec.md`) |
| **Predecessor** | 009-injection-contract-directive-sync (phase sequence); evidence taxonomy follows 007-dispatch-validation-evidence |
| **Successor** | None planned; R2-P1-002 and R2-P1-003 are deferred to a separate `system-deep-loop` packet |
| **Handoff Criteria** | R1-P1-001 fix evidence is command-backed, the two cross-runtime documentation artifacts exist and are readable, and the two deferred findings are recorded as explicitly out of scope rather than silently dropped. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A parked deep review of packet 038 (`review/deep-review-findings-registry.json`, session `review-1785915676506`) surfaced finding **R1-P1-001**: "Quoted executor forms bypass Pi dispatch inspection." The root cause was a blanket guard in `directExecutor()` (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs:186-197`, prior to fix) that returned `null` for any quoted command-position executor. A quoted external CLI such as `"devin" -p "task"` therefore classified as `kind: none`. Because the Pi preflight tool_call handler (`.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts:243`) short-circuits on `inspection.kind === "none"` with no authorization check and no audit record, a user could run a quoted external CLI through Pi Bash with zero authorization, and the cross-runtime audit trail (`matchDispatchShape`, which only records `kind: direct`) missed it entirely.

### Purpose
Record, with command-backed evidence, that the root-cause fix (exact basename-set membership instead of a blanket quoted-executor guard) closes both the Pi authorization-deny bypass and the cross-runtime audit gap in one shared-lib change, and document the cross-runtime coverage (manual-testing-playbook scenario + feature-catalog entry) authored alongside it. This phase performs no new implementation; it verifies and records work already done in the working tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recording the exact root cause and fix in `directExecutor()` (`.opencode/hooks/dispatch/lib/dispatch-audit.mjs`).
- Recording the shared inspector test evidence: 4 new `inspectDispatch` rows + 1 new `matchDispatchShape` test in `dispatch-audit.test.mjs`.
- Recording the blast radius: the four inspector-consuming runtimes (Claude, Codex, Devin, Pi) that read `inspectDispatch`/`matchDispatchShape` from the shared lib.
- Independently re-running the shared inspector suite, the Pi preflight suite, and the Node rule suite, and recording their observed pass/fail state.
- Recording the two cross-runtime documentation artifacts authored alongside the fix (manual-testing-playbook scenario, feature-catalog entry) as existing files, without re-authoring them.
- Recording R2-P1-002 and R2-P1-003 as explicitly deferred and out of this packet's changed-file scope.

### Out of Scope
- Any code change to `dispatch-audit.mjs`, `dispatch-preflight-lint.ts`, or their test files — this phase is documentation-only.
- Fixing or investigating R2-P1-002 (receipt MAC advisory, `system-deep-loop/runtime/lib/deep-loop/post-dispatch-validate.ts:771`) — belongs to a separate `system-deep-loop` packet.
- Fixing or investigating R2-P1-003 (dirty-path containment, `system-deep-loop/runtime/lib/deep-loop/write-containment.ts:265`) — belongs to a separate `system-deep-loop` packet.
- Committing the uncommitted working-tree changes this phase documents (git workflow is a separate, explicitly-approved action; see the continuity `blockers` field above).
- Editing the parent `../spec.md` Phase Documentation Map to add Phase 10 — out of this phase's write boundary per the dispatch contract.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `010-cross-runtime-coverage-and-verification/spec.md` | Create | This specification. |
| `010-cross-runtime-coverage-and-verification/plan.md` | Create | Verification-first implementation plan. |
| `010-cross-runtime-coverage-and-verification/tasks.md` | Create | Task breakdown with command-backed evidence. |
| `010-cross-runtime-coverage-and-verification/checklist.md` | Create | Verification checklist. |
| `010-cross-runtime-coverage-and-verification/implementation-summary.md` | Create | Final evidence ledger and handoff. |
| `010-cross-runtime-coverage-and-verification/description.json` | Create | Generated via `generate-description.js`. |
| `010-cross-runtime-coverage-and-verification/graph-metadata.json` | Create | Generated via `backfill-graph-metadata.js`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The R1-P1-001 root cause and fix are described precisely enough to match the current source. | `directExecutor()` no longer contains a blanket `if (executable.quoted) return null;` guard; it classifies via `EXECUTOR_BASENAMES.has(basename(...))` regardless of quoting, confirmed by reading `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:186-197`. |
| REQ-002 | The shared inspector test suite passes with the new quoted-executor coverage. | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` exits 0 and the 4 `inspectDispatch` rows (`quote-safe executor`, `quote-safe path executor`, `quoted executor without print flag`, `quoted executor as an argument stays prose`) plus the `matchDispatchShape` `records a quote-safe command-position executor as a direct dispatch` test are present in the file. |
| REQ-003 | The Pi preflight suite and Node rule suite are independently re-run and their observed results recorded. | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` and `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` both exit 0, with counts recorded from this phase's own run, not copied from an earlier phase. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The two cross-runtime documentation artifacts are confirmed to exist and their paths recorded. | `manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` and `feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` both exist under `.opencode/skills/cli-external-orchestration/`. |
| REQ-005 | R2-P1-002 and R2-P1-003 are recorded as deferred, not resolved. | This spec, `implementation-summary.md`, and `checklist.md` name both finding IDs, their files/lines from `deep-review-findings-registry.json`, and state they are out of this packet's changed-file scope. |
| REQ-006 | The uncommitted working-tree state of the fix files is recorded honestly. | `git status --porcelain` output for the four dispatch files is captured verbatim in `implementation-summary.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the current `dispatch-audit.mjs` source, **when** `directExecutor()` is read at lines 186-197, **then** no blanket quoted-executor guard exists and exact basename-set membership is used instead.
- **SC-002**: **Given** the shared inspector suite, **when** it is run fresh in this phase, **then** it reports 356/356 passed, exit 0.
- **SC-003**: **Given** the Pi preflight suite, **when** it is run fresh in this phase, **then** it reports 32/32 passed, exit 0.
- **SC-004**: **Given** the Node rule suite, **when** it is run fresh via `node --test`, **then** it reports 7/7 passed, exit 0.
- **SC-005**: **Given** the two cross-runtime documentation artifacts, **when** their paths are checked, **then** both files exist and are non-empty.
- **SC-006**: **Given** R2-P1-002 and R2-P1-003, **when** this packet's changed-file list is inspected, **then** neither `post-dispatch-validate.ts` nor `write-containment.ts` appears in it.

**Objective verification commands:**

```bash
npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot
npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot
node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
npx vitest run .opencode/hooks/dispatch --reporter=dot --exclude "**/.worktrees/**"
grep -n "quoted" .opencode/hooks/dispatch/lib/dispatch-audit.mjs
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/010-cross-runtime-coverage-and-verification --strict
```
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The fix files remain uncommitted; a `git stash`, hard reset, or worktree switch elsewhere could silently drop them before this phase's evidence is acted on. | High | Record the exact `git status --porcelain` output in `implementation-summary.md` so the uncommitted state is traceable; recommend committing as a follow-up (not performed by this phase). |
| Risk | R2-P1-002 and R2-P1-003 could be mistaken for resolved if this packet's Complete status is read out of context. | Medium | Every document in this phase names both finding IDs explicitly as deferred/out-of-scope, never as done. |
| Dependency | `deep-review-findings-registry.json` (parked review session `review-1785915676506`) | Low | Read-only source for finding IDs/files/lines; not modified by this phase. |
| Dependency | `.opencode/skills/cli-external-orchestration/manual-testing-playbook/` and `feature-catalog/` artifacts authored separately by the orchestrator | Low | Existence and path confirmed by this phase; content authored elsewhere and not duplicated here. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: All verification commands in this phase run locally with no external CLI dispatch or network calls.

### Security
- **NFR-S01**: No fixtures, evidence, or examples in this phase contain provider keys, secrets, or real prompts.
- **NFR-S02**: Recording the quoted-executor bypass and its fix does not itself demonstrate a working exploit against a live system; all evidence commands are read-only or run against local test fixtures.

### Reliability
- **NFR-R01**: Test counts recorded in this phase are from commands actually run during authoring, not copied from an earlier phase's summary.
- **NFR-R02**: The deferred-finding disposition (R2-P1-002, R2-P1-003) is stated identically across spec.md, checklist.md, and implementation-summary.md so no document contradicts another.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A quoted command-position executor with a full path (`"/usr/local/bin/cursor-agent" -p task`) still classifies as `direct` via `basename()` — covered by the `quote-safe path executor` row.
- A quoted executor used as an argument to another command (`echo "devin" -p "hi"`) correctly stays `none` — the fix does not turn every quoted token into an executor match.
- Multi-word quoted prose (`"devin -p task"`) correctly stays `none` — the fix targets exact command-position basename membership, not substring containment.

### Error Scenarios
- If the shared inspector suite regresses below 356/356 when re-run, this phase's SC-002 fails and the phase cannot claim done; the failure must be reported with the actual observed count, not silently rounded to the historical count.
- If either cross-runtime documentation artifact is missing at verification time, REQ-004 fails and the packet records the missing path rather than assuming it exists.

### State Transitions
- Uncommitted fix state: this phase can still validate and hand off, provided the uncommitted state is disclosed in `implementation-summary.md` rather than presented as committed.
- Post-commit: once the four dispatch files are committed, this phase's evidence remains valid; no re-authoring is required, only a note that the working-tree caveat has been resolved (a future action, not performed here).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Documentation-only recording of an already-shipped shared-lib fix plus two pre-existing cross-runtime artifacts. |
| Risk | 16/25 | Misrepresenting deferred findings as resolved, or the fix as committed, would create a false completion claim. |
| Research | 10/20 | Root cause and fix were already implemented; this phase reads and independently re-runs the existing evidence. |
| **Total** | **38/70** | Level 2; verification-heavy documentation phase, no new implementation. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- When does R2-P1-002 (receipt MAC advisory) get its own `system-deep-loop` remediation packet?
- When does R2-P1-003 (dirty-path containment) get its own `system-deep-loop` remediation packet?
- When are the four uncommitted dispatch files (`dispatch-audit.mjs`, `dispatch-audit.test.mjs`, `dispatch-preflight-lint.ts`, `dispatch-preflight-lint.test.ts`) committed?
<!-- /ANCHOR:questions -->

---

## REMEDIATION TRACEABILITY

| Finding | Requirement(s) | Acceptance scenario(s) | Task(s) | Rollback boundary | Objective verification |
|---------|----------------|------------------------|---------|-------------------|------------------------|
| R1-P1-001 quoted executor forms bypass Pi dispatch inspection | REQ-001, REQ-002, REQ-003 | SC-001, SC-002, SC-003, SC-004 | T001-T004 | This phase is documentation-only; the rollback boundary is the four already-modified dispatch source/test files, none of which this phase edits. | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` |
| Cross-runtime documentation coverage | REQ-004 | SC-005 | T005 | Remove only this phase's docs if a cited path is wrong; the playbook/feature-catalog artifacts are owned outside this phase. | `ls .opencode/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md .opencode/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` |
| R2-P1-002 / R2-P1-003 explicit deferral | REQ-005 | SC-006 | T006 | Revert only wording; never mark either finding resolved from inside this packet. | `git diff --stat -- .opencode/skills/system-deep-loop` (expected empty) |

## RELATED DOCUMENTS

- Parent packet: [../spec.md](../spec.md)
- Evidence-taxonomy predecessor: [../007-dispatch-validation-evidence/spec.md](../007-dispatch-validation-evidence/spec.md)
- Finding source: [../review/deep-review-findings-registry.json](../review/deep-review-findings-registry.json)
