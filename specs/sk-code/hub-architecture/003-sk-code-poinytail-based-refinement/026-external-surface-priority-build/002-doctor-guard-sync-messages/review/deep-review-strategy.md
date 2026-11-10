---
title: "Deep Review Strategy: Doctor guard and sync messages"
description: "Session tracking for the five-iteration review of this phase's build commits."
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Doctor guard and sync messages

Runtime template copied into the resolved `review/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `review/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
The three build commits 4b9bf840b0..HEAD on branch worktrees/127-surface-messages: compiled-route-sync.cjs names the authored folder to restore when specs/ or the router program packet is missing; compiled-route-guard.cjs names the runtime manifest, its authored twin and the copy on authored drift, and fails with authored-missing when the authored manifest is gone; the doctor 3c line points at the README.md block "What Adapting `sk-code` Looks Like"; the compiled_routes repair string adds the copy-back; and the tests T1 to T4

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
The removal checklist (phase 005), a guard --fix mode, moving the authored closure out of specs/, and files outside the six in scope.

---

## 5. STOP CONDITIONS
Stop policy is max-iterations: all five iterations run; convergence is telemetry only.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Maintainability sweep over the diff and the as-stand files: verified the sync precondition placement and the three rendered guard classes by direct read; found the stale two-divergence header comment (R4-P2-001) and the self-confirming authored-twin test fixtures (R4-P2-002) (iteration 4)

---

## 9. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **agent_cross_runtime (overlay): notApplicable.** `rg` over every runtime's `agents/` directory (`.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.hermes`) for the guard, sync, `authored-missing` and `What Adapting` returned nothing; no agent definition or mirror was changed by these commits. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **agent_cross_runtime (overlay): notApplicable.** `rg` over every runtime's `agents/` directory (`.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.hermes`) for the guard, sync, `authored-missing` and `What Adapting` returned nothing; no agent definition or mirror was changed by these commits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **agent_cross_runtime (overlay): notApplicable.** `rg` over every runtime's `agents/` directory (`.opencode`, `.claude`, `.codex`, `.pi`, `.cursor`, `.devin`, `.hermes`) for the guard, sync, `authored-missing` and `What Adapting` returned nothing; no agent definition or mirror was changed by these commits.

### **checklist_evidence (core): partial — deferred to T012, not a finding.** The three commit bodies carry Context/Changes/Verification and the `Spec:` trailer, including each new test's "fails against the old code (exit 1) and passes after (exit 0)" and the suite counts (98 of 98, 46 of 46, 44 of 44). The packet ledger is still scaffold state: `tasks.md` has no T-task checked, `implementation-summary.md` says "Nothing yet. The phase is planned", `acceptance-criteria.md` rows are all `Unmet`, and `goal.md` says "Build: Pending". `tasks.md` T012 explicitly schedules the ledger fill after the review (T011), so this is the planned order, not a defect yet. The copy-run rows P9-1 to P9-5 have no committed evidence anywhere I can read — T012 must re-run the copies and record them, not transcribe them from memory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **checklist_evidence (core): partial — deferred to T012, not a finding.** The three commit bodies carry Context/Changes/Verification and the `Spec:` trailer, including each new test's "fails against the old code (exit 1) and passes after (exit 0)" and the suite counts (98 of 98, 46 of 46, 44 of 44). The packet ledger is still scaffold state: `tasks.md` has no T-task checked, `implementation-summary.md` says "Nothing yet. The phase is planned", `acceptance-criteria.md` rows are all `Unmet`, and `goal.md` says "Build: Pending". `tasks.md` T012 explicitly schedules the ledger fill after the review (T011), so this is the planned order, not a defect yet. The copy-run rows P9-1 to P9-5 have no committed evidence anywhere I can read — T012 must re-run the copies and record them, not transcribe them from memory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (core): partial — deferred to T012, not a finding.** The three commit bodies carry Context/Changes/Verification and the `Spec:` trailer, including each new test's "fails against the old code (exit 1) and passes after (exit 0)" and the suite counts (98 of 98, 46 of 46, 44 of 44). The packet ledger is still scaffold state: `tasks.md` has no T-task checked, `implementation-summary.md` says "Nothing yet. The phase is planned", `acceptance-criteria.md` rows are all `Unmet`, and `goal.md` says "Build: Pending". `tasks.md` T012 explicitly schedules the ledger fill after the review (T011), so this is the planned order, not a defect yet. The copy-run rows P9-1 to P9-5 have no committed evidence anywhere I can read — T012 must re-run the copies and record them, not transcribe them from memory.

### **checklist_evidence (core):** the goal.md grep battery is satisfied on both sub-assertions (the checker carries `What Adapting`; the YAML carries `015-router-unification-program/013-live-activation`) — observed by grep, not by executing the composite command. Full checklist reconciliation is deferred; `tasks.md` was not re-read this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **checklist_evidence (core):** the goal.md grep battery is satisfied on both sub-assertions (the checker carries `What Adapting`; the YAML carries `015-router-unification-program/013-live-activation`) — observed by grep, not by executing the composite command. Full checklist reconciliation is deferred; `tasks.md` was not re-read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **checklist_evidence (core):** the goal.md grep battery is satisfied on both sub-assertions (the checker carries `What Adapting`; the YAML carries `015-router-unification-program/013-live-activation`) — observed by grep, not by executing the composite command. Full checklist reconciliation is deferred; `tasks.md` was not re-read this iteration.

### **feature_catalog_code (overlay): partial.** The `bin/README.md` CLI catalog drift is R3-P2-001; `lib/README.md` describes the layout and the generated root correctly and needs no change. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **feature_catalog_code (overlay): partial.** The `bin/README.md` CLI catalog drift is R3-P2-001; `lib/README.md` describes the layout and the generated root correctly and needs no change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **feature_catalog_code (overlay): partial.** The `bin/README.md` CLI catalog drift is R3-P2-001; `lib/README.md` describes the layout and the generated root correctly and needs no change.

### **overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability):** pending, assigned to a later iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability):** pending, assigned to a later iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability):** pending, assigned to a later iteration.

### **playbook_capability (overlay): notApplicable.** No playbook references the changed behavior; the only skill-tree hit is a cli-classifier benchmark report that records observed CLI output rather than documenting the capability. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **playbook_capability (overlay): notApplicable.** No playbook references the changed behavior; the only skill-tree hit is a cli-classifier benchmark report that records observed CLI output rather than documenting the capability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **playbook_capability (overlay): notApplicable.** No playbook references the changed behavior; the only skill-tree hit is a cli-classifier benchmark report that records observed CLI output rather than documenting the capability.

### **skill_agent (overlay): notApplicable.** `spec.md` D6 records that no skill changelog owns these files; `rg` over `.skilled/skills` for the guard, sync, the new failure strings and the README block found no skill doc restating the changed behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **skill_agent (overlay): notApplicable.** `spec.md` D6 records that no skill changelog owns these files; `rg` over `.skilled/skills` for the guard, sync, the new failure strings and the README block found no skill doc restating the changed behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **skill_agent (overlay): notApplicable.** `spec.md` D6 records that no skill changelog owns these files; `rg` over `.skilled/skills` for the guard, sync, the new failure strings and the README block found no skill doc restating the changed behavior.

### **spec_code (core): pass.** Every requirement maps to an as-stand line and a test. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **spec_code (core): pass.** Every requirement maps to an as-stand line and a test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (core): pass.** Every requirement maps to an as-stand line and a test.

### **spec_code (core):** R3 and R7 map to the cited implementation lines in all six scope files. PASS on the CLI surfaces; the build-path test gap is R1-P2-001. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **spec_code (core):** R3 and R7 map to the cited implementation lines in all six scope files. PASS on the CLI surfaces; the build-path test gap is R1-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **spec_code (core):** R3 and R7 map to the cited implementation lines in all six scope files. PASS on the CLI surfaces; the build-path test gap is R1-P2-001.

### **T1's heading binding.** T1 pins the message substring but not the README heading itself (`grep -q 'What Adapting' parent-skill-check.cjs` in goal criterion 2 has the same shape). The spec's risk table already accepts the rename risk with a phase-005 mitigation, so this is not re-litigated here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **T1's heading binding.** T1 pins the message substring but not the README heading itself (`grep -q 'What Adapting' parent-skill-check.cjs` in goal criterion 2 has the same shape). The spec's risk table already accepts the rename risk with a phase-005 mitigation, so this is not re-litigated here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **T1's heading binding.** T1 pins the message substring but not the README heading itself (`grep -q 'What Adapting' parent-skill-check.cjs` in goal criterion 2 has the same shape). The spec's risk table already accepts the rename risk with a phase-005 mitigation, so this is not re-litigated here.

### **The 3c pointer target's content.** The block headed "What Adapting `sk-code` Looks Like" at `README.md:1445` describes replacing surface packets and re-registering them, which is the removal path the 3c line promises. The spec deliberately moved the full checklist to phase 005 and accepted the rename risk; the pointer is accurate today. No finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The 3c pointer target's content.** The block headed "What Adapting `sk-code` Looks Like" at `README.md:1445` describes replacing surface packets and re-registering them, which is the removal path the 3c line promises. The spec deliberately moved the full checklist to phase 005 and accepted the rename risk; the pointer is accurate today. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 3c pointer target's content.** The block headed "What Adapting `sk-code` Looks Like" at `README.md:1445` describes replacing surface packets and re-registering them, which is the removal path the 3c line promises. The spec deliberately moved the full checklist to phase 005 and accepted the rename risk; the pointer is accurate today. No finding.

### **The unrecorded ledger as a finding.** The evidence exists in commit bodies and the fill is a scheduled closure task (T012), so the checklist_evidence result is recorded as `partial` above instead of a new P2. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The unrecorded ledger as a finding.** The evidence exists in commit bodies and the fill is a scheduled closure task (T012), so the checklist_evidence result is recorded as `partial` above instead of a new P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The unrecorded ledger as a finding.** The evidence exists in commit bodies and the fill is a scheduled closure task (T012), so the checklist_evidence result is recorded as `partial` above instead of a new P2.

### Core `checklist_evidence`: partial — unchanged deferral to T012; not re-entered (exhausted). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core `checklist_evidence`: partial — unchanged deferral to T012; not re-entered (exhausted).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial — unchanged deferral to T012; not re-entered (exhausted).

### Core `checklist_evidence`: pass (carried from iteration 1, re-verified for this finding's destination by direct path listing — the YAML literal destination exists today). `tasks.md` checklist not re-read this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `checklist_evidence`: pass (carried from iteration 1, re-verified for this finding's destination by direct path listing — the YAML literal destination exists today). `tasks.md` checklist not re-read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: pass (carried from iteration 1, re-verified for this finding's destination by direct path listing — the YAML literal destination exists today). `tasks.md` checklist not re-read this iteration.

### Core `spec_code`: pass. REQ-001 → `parent-skill-check.cjs:496` with the `README.md:1445` heading present; REQ-002/D3 → `compiled-route-guard.cjs:70-82` and 174-183; REQ-004/D4 → `compiled-route-sync.cjs:1061-1065` wired at :1085/:1110 with the one-line wrapper at :1115; REQ-003 is the subject of R5-P2-001. Carried from SL-301/SL-403 and spot-verified this iteration. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Core `spec_code`: pass. REQ-001 → `parent-skill-check.cjs:496` with the `README.md:1445` heading present; REQ-002/D3 → `compiled-route-guard.cjs:70-82` and 174-183; REQ-004/D4 → `compiled-route-sync.cjs:1061-1065` wired at :1085/:1110 with the one-line wrapper at :1115; REQ-003 is the subject of R5-P2-001. Carried from SL-301/SL-403 and spot-verified this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: pass. REQ-001 → `parent-skill-check.cjs:496` with the `README.md:1445` heading present; REQ-002/D3 → `compiled-route-guard.cjs:70-82` and 174-183; REQ-004/D4 → `compiled-route-sync.cjs:1061-1065` wired at :1085/:1110 with the one-line wrapper at :1115; REQ-003 is the subject of R5-P2-001. Carried from SL-301/SL-403 and spot-verified this iteration.

### Core `spec_code`: pass. The packet maps to R3/R7 (spec.md:3); the security-relevant named-failure behavior is present at [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061] and [SOURCE: .skilled/bin/compiled-route-guard.cjs:75]. The finding is a latent single-source-of-truth breach against `layout.cjs`, not a current spec mismatch. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code`: pass. The packet maps to R3/R7 (spec.md:3); the security-relevant named-failure behavior is present at [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061] and [SOURCE: .skilled/bin/compiled-route-guard.cjs:75]. The finding is a latent single-source-of-truth breach against `layout.cjs`, not a current spec mismatch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: pass. The packet maps to R3/R7 (spec.md:3); the security-relevant named-failure behavior is present at [SOURCE: .skilled/bin/compiled-route-sync.cjs:1061] and [SOURCE: .skilled/bin/compiled-route-guard.cjs:75]. The finding is a latent single-source-of-truth breach against `layout.cjs`, not a current spec mismatch.

### Overlay `agent_cross_runtime`: notApplicable (no runtime agent definition references it). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: notApplicable (no runtime agent definition references it).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: notApplicable (no runtime agent definition references it).

### Overlay `feature_catalog_code`: partial — `bin/README.md` catalog drift stays open as R3-P2-001. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay `feature_catalog_code`: partial — `bin/README.md` catalog drift stays open as R3-P2-001.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code`: partial — `bin/README.md` catalog drift stays open as R3-P2-001.

### Overlay `playbook_capability`: notApplicable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay `playbook_capability`: notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: notApplicable.

### Overlay `skill_agent`: notApplicable (no skill doc restates the changed behavior). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlay `skill_agent`: notApplicable (no skill doc restates the changed behavior).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: notApplicable (no skill doc restates the changed behavior).

### Overlay: pending (not exercised by the security dimension). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay: pending (not exercised by the security dimension).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay: pending (not exercised by the security dimension).

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- Spec: `spec.md` REQ-001 to REQ-006 and the ledger P9-1 to P9-7, T1 to T4; frozen decisions D1 to D6 in `goal.md`.
- Diff under review: `git diff 4b9bf840b0..HEAD -- <scope files>` in the worktree.
- Consumers of the guard: `.github/workflows/routing-registry-drift.yml:172`, `.skilled/scripts/git-hooks/pre-push`, `.skilled/scripts/git-hooks/pre-commit` (reads `HUBS` only).
- Live-tree verdicts must stay green: guard exit 0, sync --check exit 0, sk-code doctor exit 0.

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/bin/compiled-route-sync.cjs | none | 0 | 0 | pending |
| .skilled/bin/compiled-route-guard.cjs | none | 0 | 0 | pending |
| .skilled/bin/tests/compiled-route-manifest.test.cjs | none | 0 | 0 | pending |
| .skilled/commands/doctor/scripts/parent-skill-check.cjs | none | 0 | 0 | pending |
| .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs | none | 0 | 0 | pending |
| .skilled/commands/doctor/assets/doctor-update-apply.yaml | none | 0 | 0 | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-10-13T06:01:53.622Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-10-13T06:01:53.622Z
<!-- MACHINE-OWNED: END -->

---

