---
title: "Feature Specification: Documentation Truth Audit (030 packet)"
description: "Dispatched 10-iteration GPT-5.5-fast deep-review checking whether README.md, AGENTS.md, AGENTS_Barter.md, and packet-local READMEs have drifted from everything packet 030 shipped (phases 001-009)."
trigger_phrases:
  - "030 documentation truth audit"
  - "packet 030 readme agents drift"
  - "goal plugin readme integration"
importance_tier: "important"
contextType: "review"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/010-documentation-truth-audit"
    last_updated_at: "2026-07-01T20:30:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All findings resolved; README fixed"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files:
      - "review/review-report.md"
      - "/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-010-doc-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User confirmed: new child phase (not a bare lineage under the existing review/ folder), full spec-kit ceremony."
      - "User confirmed: goal plugin gets a full FEATURES subsection, not just an expanded Commands bullet."
      - "User confirmed: before-vs-after.md/timeline.md/changelog get the same treatment as phase 009."
---
# Feature Specification: Documentation Truth Audit (030 packet)

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 10 |
| **Predecessor** | 009-research-backlog-remediation |
| **Successor** | 011-followup-remediation |
| **Handoff Criteria** | A dispatched 10-iteration deep-review confirms (or rules out) documentation drift in README.md/AGENTS.md/AGENTS_Barter.md caused by packet 030's shipped work, and confirmed fixes are applied |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 030 shipped nine phases of loop-system work, most recently an 11-child research-backlog remediation phase that changed fan-out merge behavior, per-lineage timeout handling, convergence-threshold defaults, a new `SCAFFOLD_NEVER_TOUCHED` validate.sh rule, and fan-out safety hardening (stall watchdog, cost cap). Two README.md issues are already known (the Spec Kit section still uses its retired name instead of "Framework", and the goal plugin is under-documented), but whether AGENTS.md, AGENTS_Barter.md, or other packet-local READMEs have drifted from the shipped reality has not been independently, adversarially verified — only checked via a single manual pass.

### Purpose
Dispatch a real 10-iteration deep-review, executed by `openai/gpt-5.5-fast` (variant `high`) via `cli-opencode`, forced to run all 10 iterations (`stopPolicy=max-iterations`), targeting this phase folder with an explicit documentation-drift scope. Use its `traceability`/`maintainability` dimensions to independently confirm or rule out drift, then apply confirmed fixes to `README.md`, `AGENTS.md`, `AGENTS_Barter.md`, and any other affected README.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cross-check all shipped work in packet 030's phases 001-009 (`../001-reference-research` through `../009-research-backlog-remediation`) against:
  - `/README.md` (root, public)
  - `/AGENTS.md` and `/AGENTS_Barter.md` (root, agent-instruction files)
  - `../changelog/README.md` (packet-local changelog index)
  - `.opencode/plugins/README.md` (goal-plugin contract doc, since the goal plugin's public README treatment is in scope this phase)
- Apply the two pre-decided README.md fixes regardless of review outcome: rename the Spec Kit section's retired label to "Spec Kit Framework" (TOC + heading), and promote the goal plugin from a Commands > Utility bullet to a full FEATURES subsection.
- Apply any additional README/AGENTS/AGENTS_Barter.md fixes the dispatched review actually confirms (P0/P1 required, P2 judgment call).
- Extend `../before-vs-after.md`, `../timeline.md`, and `../changelog/` with this phase's own entry, mirroring phase 009's treatment.

### Out of Scope
- Fixing findings the review surfaces that are unrelated to documentation drift (reported to the user as a separate follow-up instead).
- Modifying the existing `../review/lineages/{codex,glm}` lineages — this phase uses a new, distinct lineage.
- Re-litigating packet 030's own shipped code from phases 001-009.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `010-documentation-truth-audit/spec.md` | Create | This specification |
| `010-documentation-truth-audit/plan.md` | Create | Review + fix plan |
| `010-documentation-truth-audit/tasks.md` | Create | Task ledger |
| `010-documentation-truth-audit/checklist.md` | Create | Verification checklist |
| `010-documentation-truth-audit/implementation-summary.md` | Create | Completion summary |
| `010-documentation-truth-audit/review/**` | Create | Deep-review lineage state (config, state.jsonl, deltas, iterations, review-report.md) |
| `/README.md` | Modify | Spec Kit Framework rename + Goal Plugin FEATURES subsection + any confirmed fixes |
| `/AGENTS.md`, `/AGENTS_Barter.md` | Modify (if confirmed) | Only if the dispatched review confirms real drift |
| `../before-vs-after.md`, `../timeline.md`, `../changelog/**` | Modify/Create | Phase 010 historic-reference entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Review runs all 10 iterations, forced | `deep-review-state.jsonl` shows 10 `"type":"iteration"` records with `stopPolicy=max-iterations` honored (no early stop) |
| REQ-002 | Review is independently verified, not self-reported | Each iteration's 3 required artifacts (narrative, state append, delta file) are checked by the dispatcher before the next iteration starts |
| REQ-003 | Pre-decided README.md fixes land | Spec Kit Framework rename and Goal Plugin FEATURES subsection both present, no dangling `#spec-kit-documentation` anchor references remain |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Confirmed additional findings applied | Any P0/P1 finding scoped to README/AGENTS/AGENTS_Barter.md drift is fixed and cited with evidence |
| REQ-005 | Historic-reference docs extended | `before-vs-after.md`, `timeline.md`, and `changelog/` all reference phase 010 |

### Acceptance Scenarios

- **Given** the new lineage's config, **when** the loop reaches iteration 10, **then** `stopPolicy=max-iterations` has forced all 10 iterations regardless of convergence telemetry.
- **Given** the synthesized `review-report.md`, **when** it cites README/AGENTS/AGENTS_Barter.md findings, **then** each is either fixed (P0/P1) or explicitly deferred with a documented reason (P2).
- **Given** the completed phase, **when** `validate.sh --recursive` runs on the 030 packet root, **then** it exits 0.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` uses the 9-section deep-review report structure and cites file:line evidence for every finding.
- **SC-002**: README.md's TOC and heading both read "Spec Kit Framework"; the Goal Plugin has its own FEATURES subsection with a TOC entry.
- **SC-003**: `validate.sh --strict` exits 0 for this phase folder; `validate.sh --recursive` exits 0 for the 030 packet root.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `cli-opencode` self-invocation guard | The single-executor cli-opencode branch must be driven from Claude Code, not from inside OpenCode | Confirmed: this session is Claude Code; dispatch directly via `opencode run` per iteration |
| Risk | Existing `review/lineages/{codex,glm}` folders | A new lineage could collide with prior review state if misnamed | Use a distinct, clearly-named lineage (e.g. `gpt-doc-audit`) |
| Risk | Review surfaces unrelated findings | Scope creep into unrelated code fixes | Report unrelated findings as a separate follow-up; do not fix in this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope and structural approach confirmed via AskUserQuestion before this phase was scaffolded.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Findings must be reproducible with cited commands or file:line evidence.

### Traceability
- **NFR-T01**: Every applied fix cites the specific review finding (or the pre-decided requirement) that justified it.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Audit Boundaries
- The review target is read-only during iterations; documentation fixes happen only after the report synthesizes, not mid-review.
- Findings unrelated to README/AGENTS drift are reported as follow-ups, not treated as in-scope.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Two known root-doc files plus a handful of cross-referenced READMEs |
| Risk | 8/25 | Read-only review target; fixes are additive doc edits |
| Research | 14/20 | Precedent (026's documentation-truth-audit) already establishes the shape |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
