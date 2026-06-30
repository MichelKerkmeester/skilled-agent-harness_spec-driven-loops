---
title: "Feature Specification: Re-review of skilled-agent-orchestration 093-098 (verdict-flip confirmation)"
description: "Architectural cross-phase deep-review packet that re-runs the 097 audit after the 098-097-remediation packet shipped — confirms the FAIL→PASS verdict flip, audits remediation for hidden regressions, and surfaces any newly-introduced advisories."
trigger_phrases:
  - "099 track rereview"
  - "deep-review 093-096 098 verdict flip"
  - "post-remediation track audit"
  - "verdict-flip confirmation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview"
    last_updated_at: "2026-05-07T19:05:00Z"
    last_updated_by: "deep-review-loop-manager"
    recent_action: "Scaffolded 099 packet as Level 2 first-class re-review"
    next_safe_action: "Run phase_init: create review/ state files and dispatch iteration 1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-099-2026-05-07T1905"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Re-review of skilled-agent-orchestration 093-098 (verdict-flip confirmation)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 097 (track-review of 093-096) converged with verdict FAIL on 2026-05-07: 1 active P0 (live
runtime stale `dist/` code-graph globs after the 096 plural rename), 12 P1, 9 P2. Packet 098-097-
remediation then shipped 7 sub-phases (001-dist-rebuild, 002-sk-deep-token-replace, 003-narrative-
validation-repair, 004-hooks-resolver-tighten, 005-checklist-evidence, 006-skill-advisor-python,
007-p2-doc-drift) and the orchestrator claims all 22 findings are resolved. Before declaring the
release window open, we need an independent confirmation pass: does the verdict actually flip from
FAIL to PASS, and did the remediation introduce any new structural drift, broken cross-references,
or hidden regressions inside the remediation edits themselves?

### Purpose
Confirm the FAIL→PASS verdict flip is real (not a paper resolution), audit the 098 remediation
edits for new defects, and surface any newly-introduced advisories. Expected outcome is PASS or
PASS with `hasAdvisories=true`; CONDITIONAL/FAIL would block release until follow-on remediation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verdict-flip confirmation across the 22 findings 097 raised — every closed-gate row replayed in iter 1 inventory pass
- Architectural / cross-phase audit (NOT line-by-line) across packets 093, 094, 095, 096, 098 + sub-phases 001-007
- Structural integrity post-remediation: dist code-graph globs, validate.sh per packet, smart-router validator coverage, advisor state path, sk-deep-* dead refs
- Hidden regressions in remediation edits (e.g., sed-mangled vitest regex repaired by 098/001 — confirm regex correctness)
- Broken cross-references after the 098 changes (memory_handback.md cross-CLI references flagged in 098/003 fix surface)
- New findings introduced BY the remediation itself
- Hook gates: Stop hook env override gated to NODE_ENV=test, SessionStart hooks, skill_advisor.py routing
- Workflow-resolved spec_folder write authority on the new 099 packet

### Out of Scope
- Re-running each individual deep-review iteration loop already shipped in 093-096 — handled by 095 / 097
- Implementation of any remediation fixes — produces Plan Seed for `/speckit:plan` only if FAIL/CONDITIONAL
- Changes to any reviewed file — review target is READ-ONLY
- Re-reviewing 098 sub-phase packets at line-level — only architectural / cross-phase reading

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/` | Create | Skill-owned review packet with state files |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md` | Create | Synthesis output: 9 sections + Planning Packet |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/resource-map.md` | Create | Resource map of touched files across 093-098 |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/implementation-summary.md` | Create | Continuity update post-synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 review dimensions covered (correctness, security, traceability, maintainability) | `dimensionCoverage` registers all four dimensions in `deep-review-findings-registry.json` |
| REQ-002 | Run all 10 dispatched iterations or converge legally before then | `state.jsonl` records 10 iteration entries OR a legal STOP event with all gates green |
| REQ-003 | Review agent never modifies any file under review | All file mutations limited to `099-track-rereview/review/` and the 099 packet itself |
| REQ-004 | review-report.md emits Planning Packet JSON with required keys | Block contains `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`, `findingClasses`, `affectedSurfacesSeed`, `fixCompletenessRequired` |
| REQ-005 | Verdict-flip confirmation explicit in §1 Executive Summary | report frontmatter + §1 explicitly states whether 097's 1 P0 / 12 P1 / 9 P2 are now resolved by 098 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Adversarial self-check runs on every active P0 and P1 finding | review-report.md Audit Appendix lists Hunter/Skeptic/Referee disposition per P0/P1 |
| REQ-007 | resource-map.md emitted from converged review deltas | File present (default `config.resource_map.emit=true`) |
| REQ-008 | Continuity routed via generate-context.js at synthesis end | `implementation-summary.md` carries the new `_memory.continuity` block from canonical save |
| REQ-009 | Closed-gate replay table for 097 findings | iter-1 narrative or report §3 table maps each prior finding ID → status (RESOLVED / STILL_ACTIVE / DOWNGRADED / NEW_FINDING) with file:line evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verdict + planning trigger produced; expected PASS or PASS hasAdvisories=true
- **SC-002**: Every 097 finding has explicit RESOLVED/STILL_ACTIVE disposition with file:line evidence in §3 or iter-1 inventory
- **SC-003**: Any new findings introduced by the 098 remediation are surfaced with file:line evidence
- **SC-004**: If verdict ≠ PASS, the Plan Seed is concrete enough to start `/speckit:plan` without re-discovery
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex availability + gpt-5.5 model + fast service tier | Med | YAML supports retry; fall back to native opus if cli-codex hard-fails 3+ times |
| Risk | Iter-1 inventory must exhaustively map 097 findings → 098 fixes; missing rows lead to false-PASS | High | Iter-1 prompt-pack pinned to closed-gate replay table; subsequent iterations spot-check at file:line |
| Risk | Reviewer confirmation bias — expecting PASS may suppress new findings | Med | Adversarial self-check Hunter/Skeptic/Referee on every iteration; explicit "ALSO AUDIT FOR" surfaces in iteration prompts |
| Risk | sed-mangled vitest regex (repaired by 098/001) might still have edge-case mismatches | Low | Iter 2 correctness pass spot-checks the repaired regex with a synthetic case |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each cli-codex iteration completes within 900s timeout (`executor.timeoutSeconds` default)
- **NFR-P02**: Synthesis pass runs once after convergence

### Security
- **NFR-S01**: Review target is READ-ONLY across all iterations
- **NFR-S02**: No prompt-injection escapes — workflow-resolved spec_folder is the only legal write authority

### Reliability
- **NFR-R01**: Three consecutive iteration failures trigger early synthesis with partial findings
- **NFR-R02**: Pause sentinel honored on every iteration boundary
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty review scope: agent halts iteration with `findingsCount=0`, status="error", review-report.md still emitted with PASS verdict
- Maximum iteration: hard stop at 10; verdict synthesized from whatever the registry holds
- Invalid finding format: reducer rejects malformed delta, emits `schema_mismatch` event, iteration continues

### Error Scenarios
- cli-codex dispatch failure: YAML retries once with reduced scope; second failure marks "timeout" and continues
- State file missing: reconstruct registry from iteration files; halt only on contradictory state
- Memory save failure: review packet preserved as backup; warning logged; do not block completion

### State Transitions
- Mid-iteration interruption: pause sentinel activates; resume continues same lineage
- Stuck detection: 2 consecutive sub-0.05 ratios pivot to least-covered dimension
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 5 packets touched (093-096 + 098 with 7 sub-phases) |
| Risk | 14/25 | Lower than 097 — most surfaces already audited; new risk is regression in remediation edits |
| Research | 10/20 | Most surface is concrete files; closed-gate replay structure pre-defined by 097 findings |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at scaffolding time. Iteration findings will populate this section if any contested claims surface.
<!-- /ANCHOR:questions -->

---
