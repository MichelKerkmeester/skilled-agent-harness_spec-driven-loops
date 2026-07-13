---
title: "Feature Specification: deep-alignment deep-review remediation (Pass A findings F001-F010)"
description: "Remediate the 10 findings (2 P0, 8 P1) from the gpt-5.6-sol-fast xhigh deep-review Pass A of the 059 deep-alignment packet: fail-closed correctness, the read-only security-boundary overclaim, contract-vs-implementation drift, and stale phase-parent topology."
trigger_phrases:
  - "deep-alignment review remediation"
  - "deep-alignment false-pass fix"
  - "deep-alignment read-only boundary"
  - "deep-alignment F001 F002"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/013-review-remediation"
    last_updated_at: "2026-07-13T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Fixed F001-F010; all deep-alignment tests green; parent topology reconciled"
    next_safe_action: "Run validate.sh --strict from the main tree; then operator review before commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/partition-corpus.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs"
      - ".opencode/agents/deep-alignment.md"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/commands/deep/assets/deep_alignment_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-013-review-remediation"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "F002 full mechanical sandbox: deferred with decision-record (ADR-001); claim reconciled + registry mutatesWorkspace fixed"
      - "F004 executor flags: removed from public contract (ADR-002), not implemented"
      - "F010 autonomous-termination proof: deferred to a follow-up benchmark capture (ADR-003)"
---
# Feature Specification: deep-alignment deep-review remediation (Pass A findings F001-F010)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-07-13 |
| **Branch** | `skilled/v4.0.0.0` (isolated worktree `wt/0034-deep-review-059`) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 012-behavior-benchmark-capture (folder-order predecessor only) |
| **Successor** | 014-skill-doc-template-conformance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A 10-iteration deep-review Pass A (executor `openai/gpt-5.6-sol-fast`, reasoning `xhigh`) of the whole 059 deep-alignment packet returned **FAIL** with 2 P0 and 8 P1 active findings. Two are load-bearing: (F001) the convergence/first-run state machine can terminate an audit as a **false PASS** when the first LEAF pass fails or the corpus is unaudited, and (F002) the `@deep-alignment` LEAF advertises mechanically-enforced read-only behavior but ships unrestricted `Bash`. The eight P1s cluster around a fail-open reducer/convergence (F005, F007), contract-vs-implementation drift (F003, F004, F006), and integration/traceability drift (F008, F009, F010).

### Purpose
Fix every actionable finding at its root — with RED→GREEN regressions for the correctness P0/P1s and honest claim/topology reconciliation for the rest — so the deep-alignment mode fails closed, tells the truth about its enforcement boundary, and its parent topology matches on-disk reality.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fail-closed correctness: corpus-derived `NOTHING_TO_CONVERGE`, registry-before-dispatch init, corruption/invalid-severity fail-closed, identity-based progress (F001, F005, F007).
- Security-boundary honesty: reconcile the read-only claim with enforced reality and register deep-alignment in dispatch-guard repeat protection (F002, F008).
- Contract fidelity: bind `resolved_lanes` on the no-config path, remove ignored executor flags, add adapter identity so live-render is reachable (F003, F004, F006).
- Topology truth: reconcile the parent phase-map/status/children to on-disk reality; document the setup-misbind fix and honest deferrals (F009, F010).

### Out of Scope
- A full mechanical packet-scoped shell sandbox for the LEAF (F002) - architectural; deferred with a decision-record and compensating controls.
- Implementing external-executor resolution for deep-alignment (F004) - a feature, not a fix; the flags are removed instead.
- Re-running a multi-sample autonomous-termination benchmark (F010) - a measurement exercise for a follow-up capture, not a source patch here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/scripts/reduce-alignment-state.cjs` | Modify | Corpus-gated `nothingToConverge`/`incompleteCoverage`/`integrityFault`; expose `checkedArtifactIds` (F001, F005, F007) |
| `deep-alignment/scripts/partition-corpus.cjs` | Modify | Identity-based set-difference progress with count fallback + adapter passthrough (F007, F006) |
| `deep-alignment/scripts/scoping.cjs` | Modify | Optional `adapter` discriminator on lane resolution (F006) |
| `runtime/lib/deep-loop/dispatch-guard.cjs` | Modify | Register `deep-alignment` in `LOOP_EXECUTOR_AGENTS` (F008) |
| `.opencode/agents/deep-alignment.md` + `.claude` mirror | Modify | Honest read-only boundary; adapter-aware check (F002, F006) |
| `mode-registry.json` | Modify | `mutatesWorkspace: true` for alignment (F002) |
| `commands/deep/assets/deep_alignment_{auto,confirm}.yaml` | Modify | resolved_lanes bind, registry seed, executor honesty, adapter threading (F001, F003, F004, F006) |
| `commands/deep/alignment.md` + legacy body | Modify | Trim ignored executor flags from the contract (F004) |
| 059 `spec.md` + `graph-metadata.json` (parent) | Modify | Reconcile topology to on-disk reality (F009) |
| `deep-alignment/scripts/tests/*.test.cjs` | Create | RED→GREEN regressions (F001, F005, F007, F006) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F001 no false PASS | A non-empty corpus with zero audited artifacts reduces to FAIL/`incompleteCoverage`, not PASS; `checkConvergence` does not exit `NOTHING_TO_CONVERGE`; RED→GREEN regression green |
| REQ-002 | F002 honest boundary | The read-only claim distinguishes mechanical (no Write/Edit tool) from behavioral (Bash unrestricted); registry `mutatesWorkspace` matches reality; deferral recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | F005 fail-closed reducer | Corrupt JSONL or unrecognized severity yields FAIL/`integrityFault`; regression green |
| REQ-004 | F007 identity progress | Non-prefix/duplicate checked sets never skip an unchecked artifact; regression green |
| REQ-005 | F003 resolved_lanes bind | No-config structured-answer path binds `resolved_lanes = lanes` |
| REQ-006 | F004 honest executor contract | Ignored executor flags removed from the public surface |
| REQ-007 | F006 adapter reachable | A designs lane can select `sk-design-live-render`; regression green |
| REQ-008 | F008 dispatch-guard | `deep-alignment` in `LOOP_EXECUTOR_AGENTS`; both runtime guard tests green |
| REQ-009 | F009 topology truth | Parent children_ids/status/phase-map match on-disk children 000-013 |
| REQ-010 | F010 setup/termination | Setup-misbind (F003) fixed; termination proof deferred with rationale |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every deep-alignment script test passes (`reducer-fail-closed`, `partition-identity-progress`, `scoping-adapter`, `state-machine-wiring`) and both dispatch-guard tests pass.
- **SC-002**: `validate.sh --strict` on this packet exits 0; no finding silently skipped — each deferral has a documented rationale.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Concurrent session owns the main tree | Uncommitted work could be swept by a stash/reset | All edits confined to the isolated worktree; nothing committed without operator approval |
| Risk | Declarative yaml threading (F006) is not unit-tested | A wiring typo could go unnoticed | Core adapter identity is unit-tested in scoping/partition; yaml verified by read + YAML parse |
| Dependency | Validator `tsx` runtime | Worktree lacks node_modules | Run node validators from the main tree against worktree paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reducer/partition changes stay O(findings + artifacts); no new quadratic scans (set-based dedup and difference).

### Security
- **NFR-S01**: The untrusted-audit LEAF's write boundary is honestly labeled; no fabricated mechanical enforcement (F002).

### Reliability
- **NFR-R01**: The gate fails closed on corrupted state, unrecognized severity, or an unaudited non-empty corpus.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty corpus: `nothingToConverge=true` → trivial PASS (genuinely nothing to check).
- Non-empty corpus, zero audited: `incompleteCoverage=true` → FAIL (not a false PASS).
- Bare-count `artifactsChecked`: prefix-cursor fallback preserved for simple emitters.

### Error Scenarios
- Truncated JSONL line: `hasCorruption` → `integrityFault` → FAIL.
- Unrecognized finding severity (e.g. `P9`): counted, not dropped → `integrityFault` → FAIL.

### State Transitions
- Failed/empty first LEAF pass: seeded registry + corpus gate keep the run from reducing to PASS.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | ~12 files across reducer, partitioner, scoping, guard, agent docs, yaml, parent metadata |
| Risk | 16/25 | One P0 security boundary (reconcile + defer), one P0 correctness (fixed + tested) |
| Research | 12/20 | Verify-first re-read of every cited file:line before editing |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Three items are deferred with recorded rationale in `decision-record.md` (F002 mechanical sandbox, F004 executor resolution, F010 autonomous-termination proof); the operator may choose to schedule those follow-ups.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Review report**: See `../review/lineages/gpt56solfast-xhigh/review-report.md`
