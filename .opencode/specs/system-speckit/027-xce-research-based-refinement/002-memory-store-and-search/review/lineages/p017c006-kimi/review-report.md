# Review Report: 006-command-contract-structural

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **Active findings:** P0=0, P1=2, P2=1
- **hasAdvisories:** true
- **Scope:** Review of the `/memory:search` command-contract-structural implementation: deterministic arg-resolution header, salience inversion, and no-ask guard introduced in phase 006 of packet 017.
- **Stop reason:** maxIterationsReached (configured maxIterations=1)
- **Release readiness state:** in-progress

The implementation delivers the intended structural fix (shell-computed `ARGS_PRESENT`/`QUERY`, execute-path first, gated startup), but the canonical spec documents still contain template placeholders and the shell header's escaping logic is incomplete beyond double quotes.

---

## 2. Planning Trigger

The CONDITIONAL verdict routes to `/speckit:plan` for remediation of the two active P1 findings before the phase can be considered release-ready. The P2 advisory can be addressed in the same remediation pass or deferred to the next phase.

---

## 3. Active Finding Registry

### F001 — P1 — Correctness
- **Title:** Shell arg-join header only escapes double quotes; other shell metacharacters are unhandled
- **File:** `.opencode/commands/memory/search.md:17`
- **Evidence:** The `bash -c` wrapper joins argv and escapes `"` to `\"`, but does not escape `$`, backticks, backslashes, or single quotes. A `QUERY` containing those characters may break the emitted `QUERY="..."` line or the renderer's re-parse of the header output.
- **First/last seen:** Iteration 1
- **Status:** active

### F002 — P1 — Traceability
- **Title:** Canonical spec docs still contain template placeholders and do not reflect implemented changes
- **File:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural/spec.md:85-109`
- **Evidence:** `spec.md`, `plan.md`, and `tasks.md` list `[Deliverable 1]`, `[Core feature 1]`, and `T001 Create project structure` respectively, while `implementation-summary.md` documents real changes to `search.md` and `search_presentation.txt`.
- **First/last seen:** Iteration 1
- **Status:** active

### F003 — P2 — Traceability
- **Title:** Level 1 spec folder lacks checklist.md
- **File:** `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/017-search-and-output-intelligence-implementation/006-command-contract-structural`
- **Evidence:** No `checklist.md` exists in the spec folder; `checklist_evidence` protocol is not applicable.
- **First/last seen:** Iteration 1
- **Status:** active (advisory)

---

## 4. Remediation Workstreams

### Workstream A: Harden shell argument handling
- **Findings:** F001
- **Actions:**
  1. Audit the `!` shell header for all shell metacharacters (single quotes, backticks, backslashes, dollars, newlines).
  2. Add escaping or switch to a renderer-supplied safe argument-passing mechanism.
  3. Add verification cases for each metacharacter class in `implementation-summary.md`.

### Workstream B: Align canonical spec docs with implementation
- **Findings:** F002, F003
- **Actions:**
  1. Replace template placeholders in `spec.md` with actual requirements, acceptance criteria, and file-change table.
  2. Update `plan.md` phases and architecture to match the shell-header + salience-inversion work.
  3. Replace template tasks in `tasks.md` with the real tasks performed (e.g., "Add §0 ARGUMENT RESOLUTION shell header").
  4. Optionally add a lightweight `checklist.md` to enable the `checklist_evidence` protocol.

---

## 5. Spec Seed

Minimal spec updates implied by findings:

- Add a requirement in `spec.md` that the `/memory:search` argument-resolution header must safely handle queries containing any shell metacharacter, not only double quotes.
- Add acceptance criteria requiring verification cases for single quotes, backslashes, backticks, dollar signs, and semicolons.
- Update `spec.md` scope and file-change table to name `.opencode/commands/memory/search.md` and `.opencode/commands/memory/assets/search_presentation.txt`.

---

## 6. Plan Seed

Initial remediation tasks:

- T001 [P1] Harden shell header escaping in `search.md` (F001)
- T002 [P1] Add metacharacter verification cases to `implementation-summary.md` (F001)
- T003 [P1] Rewrite `spec.md` to match actual implementation (F002)
- T004 [P1] Rewrite `plan.md` phases to match actual implementation (F002)
- T005 [P1] Rewrite `tasks.md` with real tasks and mark completion (F002)
- T006 [P2] Add `checklist.md` to enable acceptance-coverage tracking (F003)

---

## 7. Traceability Status

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | partial | Spec placeholders do not resolve to shipped implementation; only `implementation-summary.md` documents real behavior. |
| `checklist_evidence` | core | notApplicable | No `checklist.md` exists in this Level 1 spec folder. |
| `feature_catalog_code` | overlay | pass | `search.md` argument-hint and allowed-tools catalog match the implemented command surface. |
| `skill_agent` | overlay | notApplicable | Target is a spec folder, not a skill. |
| `agent_cross_runtime` | overlay | notApplicable | Target is a spec folder, not an agent. |
| `playbook_capability` | overlay | notApplicable | No playbook scenario file present. |

---

## 8. Deferred Items

- **F003 (P2):** Add `checklist.md`. This is advisory and can be addressed alongside the P1 remediation work.
- **D2 Security review:** Not covered due to maxIterations=1. Recommended follow-up.
- **D4 Maintainability review:** Not covered due to maxIterations=1. Recommended follow-up.
- **Live A/B execute-rate confirmation:** Documented as out-of-scope for this phase; remains a follow-up.

---

## 9. Audit Appendix

### Iteration Table

| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status |
|---|-------|-------|------------|---------------|-------|--------|
| 1 | correctness + traceability | 6 | correctness, traceability | 0/2/1 | 1.00 | complete |

### Convergence Replay

- **Configured maxIterations:** 1
- **Iterations completed:** 1
- **Stop reason:** maxIterationsReached
- **Dimensions covered:** correctness, traceability (2 of 4)
- **Required traceability protocols:** spec_code partial, checklist_evidence notApplicable
- **Legal-stop gates:** Not evaluated because maxIterations hard stop occurred before convergence math.

### File Coverage Matrix

| File | Dimensions | Findings |
|------|------------|----------|
| `.opencode/commands/memory/search.md` | D1, D3 | F001 |
| `.opencode/commands/memory/assets/search_presentation.txt` | D1, D3 | None |
| `spec.md` | D3 | F002 |
| `plan.md` | D3 | F002 (shared) |
| `tasks.md` | D3 | F002 (shared) |
| `implementation-summary.md` | D3 | None |

### Dimension Breakdown

- **Correctness:** CONDITIONAL — 1 P1 active
- **Security:** NOT REVIEWED
- **Traceability:** CONDITIONAL — 1 P1, 1 P2 active
- **Maintainability:** NOT REVIEWED

### Claim Adjudication

All new P1 findings carried typed claim-adjudication packets in `iterations/iteration-001.md`. No packets failed validation.

### Executor Audit

- **Executor:** cli-opencode
- **Model:** kimi-for-coding/k2p7
- **Lineage:** fanout-p017c006-kimi
