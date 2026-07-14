---
title: "Feature Specification: Track Review of skilled-agent-orchestration packets 093-096"
description: "Architectural cross-phase deep review of recently shipped 093-096 packets — focuses on rename-induced regressions, broken cross-references, narrative spec doc casualties, prompt-equality contract violations, and config-patch completeness."
trigger_phrases:
  - "097 track review"
  - "deep-review skilled-agent-orchestration 093-096"
  - "architectural cross-phase audit recent packets"
  - "post-rename track audit"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review"
    last_updated_at: "2026-05-07T14:46:56Z"
    last_updated_by: "deep-review-loop-manager"
    recent_action: "Scaffolded 097 packet as Level 2 first-class track-review"
    next_safe_action: "Run phase_init: create review/ state files and dispatch iteration 1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-review-097-2026-05-07"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Track Review of skilled-agent-orchestration packets 093-096

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
Four packets shipped in close succession on 2026-05-07: 093 (sk-code-review + sk-git playbooks),
094 (RCAF naturalization across 16 playbooks + sk-doc template updates), 095 (sk-code-review playbook
execution against opencode+deepseek), and 096 (rename `.opencode/{skill,agent,command}/` to plural —
~11k file moves, 670k+ token-occurrence sed across 4 phases, single commit). The 096 rename touched
the entire repo's runtime discovery surface and is the highest-risk delivery; the playbook work in
093/094/095 introduced a prompt-equality contract that is easy to violate during sed-style edits.
A focused per-phase code-review was not run during the burst, so we need an architectural cross-phase
audit before the next release window.

### Purpose
Surface any P0/P1 regressions hiding inside the burst — broken discovery, broken cross-references,
narrative casualties from the bulk-sed, missing critical-config patches, prompt-equality violations,
or runtime breakage — and produce a remediation Plan Seed when needed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Architectural / cross-phase review (not line-by-line per-phase audit) across packets 093-096
- Rename-induced structural integrity: directory layout, symlinks, runtime discovery
- Prompt-equality contract enforcement across the 16 RCAF-naturalized playbooks
- sk-code-review and sk-git playbook structural soundness
- Config-patch completeness: `opencode.json`, `.claude/settings.local.json`, `.codex/`, `.gemini/`
- Hooks integrity: SessionStart hooks, skill_advisor.py path bindings
- validate.sh integrity for each touched packet (093, 094, 095, 096)
- Cross-references: `.opencode/skill/` → `.opencode/skills/` link drift, doc anchors

### Out of Scope
- Re-running each individual deep-review iteration loop already shipped in those packets — handled by 095
- Implementation of remediation fixes — produces Plan Seed for `/speckit:plan` if FAIL/CONDITIONAL
- Test execution beyond what the review agent can perform inline (`bash` invocations of validate.sh, skill_advisor.py)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/` | Create | Skill-owned review packet with state files |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/review-report.md` | Create | Synthesis output: 9 sections + Planning Packet |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/review/resource-map.md` | Create | Resource map of touched files across 093-096 |
| `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/002-track-review/implementation-summary.md` | Modify | Continuity update post-synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 4 review dimensions must be covered (correctness, security, traceability, maintainability) | `dimensionCoverage` registers all four dimensions in `deep-review-findings-registry.json` and dashboard |
| REQ-002 | Run all 10 dispatched iterations or converge legally before then | `state.jsonl` records 10 iteration entries OR a legal STOP event with all gates green |
| REQ-003 | Review agent never modifies any file under review | All file mutations limited to `097-track-review/review/` and the 097 packet itself |
| REQ-004 | review-report.md emits Planning Packet JSON with required keys | Block contains `triggered`, `verdict`, `hasAdvisories`, `activeFindings`, `remediationWorkstreams`, `specSeed`, `planSeed`, `findingClasses`, `affectedSurfacesSeed`, `fixCompletenessRequired` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Adversarial self-check runs on every active P0 and P1 finding | review-report.md Audit Appendix lists Hunter/Skeptic/Referee disposition per P0/P1 |
| REQ-006 | resource-map.md emitted from converged review deltas | File present unless `--no-resource-map` was set; `config.resource_map.emit=true` is the default here |
| REQ-007 | Continuity routed via generate-context.js at synthesis end | `implementation-summary.md` carries the new `_memory.continuity` block from the canonical save |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Verdict + planning trigger produced (PASS / CONDITIONAL / FAIL); `hasAdvisories` reflects P2 presence
- **SC-002**: Active P0/P1 finding count surfaced with file:line evidence and adjudicated severity
- **SC-003**: If verdict ≠ PASS, the Plan Seed is concrete enough to start `/speckit:plan` without re-discovery
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex availability + gpt-5.5 model + fast service tier | Med | YAML supports retry; fall back to native opus if cli-codex hard-fails 3+ times |
| Risk | Rename-induced symlink drift in `barter/coder/.opencode/skill/` mirror | Med | Iteration 1 inventory pass enumerates all `.opencode/skill/` (singular) survivors before deep passes |
| Risk | Prompt-equality contract checks need sk-code-review + sk-git source-of-truth comparison | Med | Iteration plan reserves a traceability pass dedicated to `assets/playbook-*.md` vs SKILL.md prompt segments |
| Risk | Adjudication packets missing for new P0/P1 findings will veto STOP | Low | Agent prompt-pack reminds the dispatched iteration to emit typed claim-adjudication blocks per finding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each cli-codex iteration completes within 900s timeout (from `executor.timeoutSeconds` default)
- **NFR-P02**: Synthesis pass runs once after convergence, no per-iteration synthesis recomputation

### Security
- **NFR-S01**: Review target is READ-ONLY across all iterations (workspace-write sandbox is for state files only)
- **NFR-S02**: No prompt-injection escapes — workflow-resolved spec_folder is the only legal write authority

### Reliability
- **NFR-R01**: Three consecutive iteration failures trigger early synthesis with partial findings
- **NFR-R02**: Pause sentinel (`.deep-review-pause`) honored on every iteration boundary
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
| Scope | 18/25 | 4 large packets touched; 096 alone reaches 11k file moves |
| Risk | 16/25 | Bulk-sed surface; runtime discovery surface; cross-runtime mirror drift |
| Research | 12/20 | Most surface is concrete files; rename impact requires careful enumeration |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at scaffolding time. Iteration findings will populate this section if any contested claims surface.
<!-- /ANCHOR:questions -->

---
