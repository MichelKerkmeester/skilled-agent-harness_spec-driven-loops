---
title: "Feature Specification: Re-review #2 of skilled-agent-orchestration 093-101 (post-100/101 verdict-flip + cli-opencode executor smoke)"
description: "Architectural cross-phase deep-review packet that re-runs the 099 audit after 100-099-remediation (13 P1 resolved) and 101-cli-opencode-executor (5th deep-loop executor) shipped — confirms the 099 FAIL→PASS verdict flip and audits remediation hygiene plus the new cli-opencode executor wiring."
trigger_phrases:
  - "102 track rereview 2"
  - "deep-review 093-101 verdict flip"
  - "post-100/101 track audit"
  - "cli-opencode executor smoke"
  - "second verdict-flip confirmation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview"
    last_updated_at: "2026-05-07T20:55:00Z"
    last_updated_by: "deep-review-loop-manager"
    recent_action: "Scaffolded 102 packet as Level 2 first-class re-review"
    next_safe_action: "Run phase_init: create review/ state files and dispatch iteration 1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-102-2026-05-07T2055"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Re-review #2 of skilled-agent-orchestration 093-101 (post-100/101 verdict-flip + cli-opencode executor smoke)

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
Packet 099 (re-review of 093-098) converged with verdict FAIL on 2026-05-07: 0 P0, 13 P1, 6 P2.
Packet 100-099-remediation then shipped and claims to have resolved 12 of 13 P1 (including the
reducer-extracts-findings-from-delta-records fix at P1-026). Concurrently, packet 101 added
cli-opencode as the 5th deep-loop executor — touching `executor-config.ts`, advisor `aliases.ts`,
and 4 deep-loop YAML files (deep-research-{auto,confirm}, deep-review-{auto,confirm}). Before
declaring the second release window open, we need an independent confirmation pass: does the
verdict actually flip from FAIL to PASS this time, did 100 introduce hidden regressions, did 101
land cleanly across its 4 YAML files + advisor + executor-config, and is the cli-opencode dispatch
path actually functional end-to-end?

### Purpose
Confirm the FAIL→PASS verdict flip is real (not a paper resolution again), audit the 100
remediation edits for new defects (especially the reducer delta-extraction logic at the centre of
P1-026), audit the 101 cli-opencode wiring for correctness across its 6 touched surfaces,
and run a smoke-test of cli-opencode + deepseek-v4-pro as the executor for *this* packet —
making 102 a meta-test of 101. Expected outcome is PASS or PASS with `hasAdvisories=true`;
CONDITIONAL/FAIL would block release until follow-on remediation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verdict-flip confirmation across the 13 P1 + 6 P2 099 raised — every closed-gate row replayed in iter-1 inventory pass
- Architectural / cross-phase audit (NOT line-by-line) across packets 093, 094, 095, 096, 098, 100, 101 + 100/098 sub-phases
- Structural integrity post-100 + 101: dist code-graph globs, validate.sh per packet, smart-router, advisor aliases, executor-config validation
- Hidden regressions in 100's reducer fix (delta-extraction logic — sed/AST risk)
- 101 cli-opencode YAML branch correctness across 4 files (deep-research-auto/confirm + deep-review-auto/confirm)
- `EXECUTOR_KIND_FLAG_SUPPORT['cli-opencode']` correctness (model, reasoningEffort, sandboxMode, timeoutSeconds)
- 098 sub-phase canonicalization quality (8-anchor structure if applied here)
- Broken cross-references after 100 + 101 changes
- Hook gates: Stop hook env override gated to NODE_ENV=test, SessionStart hooks
- Workflow-resolved spec_folder write authority on the new 102 packet
- Meta-smoke: cli-opencode + deepseek-v4-pro + --variant high attempt + observed failure mode

### Out of Scope
- Re-running each individual deep-review iteration loop already shipped in 093-096 — handled by 095 / 097 / 099
- Implementation of any remediation fixes — produces Plan Seed for `/speckit:plan` only if FAIL/CONDITIONAL
- Changes to any reviewed file — review target is READ-ONLY
- Re-reviewing 100 or 101 sub-phase packets at line-level — only architectural / cross-phase reading
- Deep dive on cli-opencode binary internals or DeepSeek's tool-name regex — only the wiring surfaces matter

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/` | Create | Skill-owned review packet with state files |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/review-report.md` | Create | Synthesis output: 9 sections + Planning Packet |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/review/resource-map.md` | Create | Resource map of touched files across 100 + 101 |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/007-track-rereview/implementation-summary.md` | Create | Continuity update post-synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 review dimensions covered (correctness, security, traceability, maintainability) | `dimensionCoverage` registers all four in `deep-review-findings-registry.json` |
| REQ-002 | Run all 10 dispatched iterations or converge legally before then | `state.jsonl` records 10 iteration entries OR a legal STOP event with all gates green |
| REQ-003 | Review agent never modifies any file under review | All file mutations limited to `102-track-rereview-2/review/` and the 102 packet itself |
| REQ-004 | review-report.md emits Planning Packet JSON with required keys | Block contains `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`, `findingClasses`, `affectedSurfacesSeed`, `fixCompletenessRequired` |
| REQ-005 | Verdict-flip confirmation explicit in §1 Executive Summary | report frontmatter + §1 explicitly states whether 099's 13 P1 / 6 P2 are now resolved by 100 |
| REQ-006 | cli-opencode executor smoke result documented | iter-1 narrative records the dispatch attempt outcome (success / fail-mode / fallback executor used) with file:line evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Adversarial self-check runs on every active P0 and P1 finding | review-report.md Audit Appendix lists Hunter/Skeptic/Referee disposition per P0/P1 |
| REQ-008 | resource-map.md emitted from converged review deltas | File present (default `config.resource_map.emit=true`) |
| REQ-009 | Continuity routed via generate-context.js at synthesis end | `implementation-summary.md` carries the new `_memory.continuity` block from canonical save |
| REQ-010 | Closed-gate replay table for 099 findings | iter-1 narrative or report §3 table maps each prior P1/P2 ID → status (RESOLVED / STILL_ACTIVE / DOWNGRADED / NEW_FINDING) with file:line evidence |
| REQ-011 | 101 executor wiring audit produces explicit pass/fail per file | report §3 or iter narrative lists 4 YAML files + advisor aliases + executor-config with status |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verdict + planning trigger produced; expected PASS or PASS hasAdvisories=true
- **SC-002**: Every 099 P1/P2 finding has explicit RESOLVED/STILL_ACTIVE disposition with file:line evidence in §3 or iter-1 inventory
- **SC-003**: Any new findings introduced by the 100 remediation are surfaced with file:line evidence
- **SC-004**: Any new findings introduced by the 101 executor wiring are surfaced with file:line evidence
- **SC-005**: cli-opencode + deepseek-v4-pro dispatch outcome observed and documented (smoke result)
- **SC-006**: If verdict ≠ PASS, the Plan Seed is concrete enough to start `/speckit:plan` without re-discovery
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-opencode + deepseek-v4-pro + variant=high availability | High | Smoke test pre-loop; fall back to native opus if dispatch fails |
| Risk | DeepSeek tool-name regex `^[a-zA-Z0-9_-]+$` rejects MCP tool names with `:` — pre-loop smoke confirmed failure under default plugin loading | High | Smoke confirmed `--pure` works; YAML branch as shipped does NOT pass `--pure`; record this gap as a P1 finding and switch executor to native for the run |
| Risk | Reviewer confirmation bias — expecting PASS may suppress new findings | Med | Adversarial self-check Hunter/Skeptic/Referee on every iteration; explicit "ALSO AUDIT FOR" surfaces in iteration prompts |
| Risk | 100's reducer delta-extraction fix may have edge cases the test suite missed | Med | Iter 2 correctness pass spot-checks `reduce-state.cjs` extractFindingsFromDelta paths with synthetic delta records |
| Risk | 101 YAML branches may have mismatched flag handling across the 4 files | Med | Iter 5 traceability pass diffs the 4 cli_opencode branches for parity |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each iteration completes within the executor's timeout (cli-opencode 900s; native opus subagent target ~5-10 min)
- **NFR-P02**: Synthesis pass runs once after convergence

### Security
- **NFR-S01**: Review target is READ-ONLY across all iterations
- **NFR-S02**: No prompt-injection escapes — workflow-resolved spec_folder is the only legal write authority

### Reliability
- **NFR-R01**: Three consecutive iteration failures trigger early synthesis with partial findings
- **NFR-R02**: Pause sentinel honored on every iteration boundary
- **NFR-R03**: Executor fallback documented in strategy.md Known Context if cli-opencode pre-flight fails
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty review scope: agent halts iteration with `findingsCount=0`, status="error", review-report.md still emitted
- Maximum iteration: hard stop at 10; verdict synthesized from whatever the registry holds
- Invalid finding format: reducer rejects malformed delta, emits `schema_mismatch` event, iteration continues

### Error Scenarios
- cli-opencode dispatch failure: documented in iter-1 + strategy Known Context; executor falls back to native opus
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
| Scope | 16/25 | 8 packets touched (093-096 + 098 + 100 + 101) but most surfaces re-audited from 099 |
| Risk | 12/25 | Lower than 099 — most surfaces already audited twice; new risk is regression in 100 reducer fix and 101 executor wiring |
| Research | 8/20 | Most surface is concrete files; closed-gate replay structure pre-defined by 099 findings |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at scaffolding time. Iteration findings will populate this section if any contested claims surface.
<!-- /ANCHOR:questions -->

---
