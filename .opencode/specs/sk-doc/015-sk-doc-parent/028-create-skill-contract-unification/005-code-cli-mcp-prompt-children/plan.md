---
title: "Implementation Plan: sk-code / cli / mcp / sk-prompt Children Contract Conformance"
description: "Per-file dispatch harness: a fresh LUNA MAX update then a fresh Sonnet-5 xhigh verify then the validator gate, run >=5 in parallel across the 12 files in this batch."
trigger_phrases:
  - "005-code-cli-mcp-prompt-children plan"
  - "LUNA MAX dispatch harness"
  - "Sonnet-5 verify"
importance_tier: "normal"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/028-create-skill-contract-unification/005-code-cli-mcp-prompt-children"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded conformance phase plan (planned)"
    next_safe_action: "Dispatch LUNA-MAX updates after operator go-ahead"
    blockers: []
    key_files: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Implementation Plan: sk-code / cli / mcp / sk-prompt Children Contract Conformance

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Updater** | GPT-5.6 LUNA MAX via `codex exec --model gpt-5.6-luna -c model_reasoning_effort=max` (service tier `fast` = global default) |
| **Verifier** | fresh `claude-sonnet-5`, reasoning effort `xhigh`, via the Agent tool |
| **Validator** | `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py <skill-dir> --check --strict` |
| **Workspace** | isolated git worktree at the origin tip; one SKILL.md (+ its resources) per work-item |

### Overview
Each of the 12 files is one independent work-item: LUNA MAX updates it to the machine-readable create-skill contract (`sk-doc/shared/assets/skill_contract.json`), a fresh Sonnet-5
xhigh agent verifies the diff against the contract, then the validator gate runs. Items are path-disjoint, so
>=5 run concurrently per wave. The orchestrator commits only after a file's validator is green and Sonnet signs off.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Contract + validators shipped (phase 000) [EVIDENCE: `../000-create-skill-contract/` complete]
- [x] File inventory frozen (12 files) [EVIDENCE: spec.md SCOPE table]
- [x] Per-file dispatch + verify contract fixed [EVIDENCE: plan.md ARCHITECTURE]
- [ ] Operator go-ahead to dispatch agents

### Definition of Done
- [ ] Every file passes its validator (0 errors/warnings)
- [ ] Every file has a fresh-LUNA update + fresh-Sonnet verify recorded
- [ ] Owning hub regression check green
- [ ] `validate.sh --strict` Errors 0 on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Per-file pipeline (repeated per work-item)
1. **Baseline** — capture the file's current validator output.
2. **Update (LUNA MAX)** — background `codex exec` scoped to `.opencode/skills/<skill>/SKILL.md` (+ its resources); prompt carries `GATE-3 PRE-RESOLVED`, the contract target, and an explicit "touch only these paths; do not commit" constraint.
3. **Verify (Sonnet-5 xhigh)** — a fresh Agent reads the diff, confirms conformance to the machine-readable create-skill contract (`sk-doc/shared/assets/skill_contract.json`), and rejects any behavioral/scope change.
4. **Gate** — run the validator from the main tree against the worktree path.
5. **Commit** — orchestrator makes one path-scoped commit once (3) and (4) pass.

### Concurrency
Work-items are dispatched in waves of >=5. LUNA updates run as background `codex exec` processes; the Sonnet
verifiers are launched (up to >=5) in a single Agent batch as their files finish updating.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm worktree at origin tip; capture per-file validator baseline
- [ ] Compose the LUNA update prompt (contract target + scope lock + GATE-3 pre-resolved)

### Phase 2: Core Implementation
- [ ] Dispatch LUNA MAX updates in waves of >=5 across the 12 files
- [ ] As each update returns, launch its fresh Sonnet-5 xhigh verifier

### Phase 3: Verification
- [ ] Validator green on all 12 files
- [ ] Owning-hub regression check green
- [ ] `validate.sh --strict` Errors 0; reconcile packet docs to shipped state
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Per-file contract | each SKILL.md | `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py <skill-dir> --check --strict` |
| Independent review | each diff | fresh Sonnet-5 xhigh agent |
| Hub regression | owning hub | the hub's own checker stays green |
| Packet | this folder | `validate.sh --strict` Errors 0 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| create-skill contract + validators (phase 000) | Internal | Green | No conformance target |
| `codex exec` + `gpt-5.6-luna` | External | Green | No LUNA updater (probed OK) |
| `claude-sonnet-5` (Agent tool) | Internal | Green | No independent verifier |
| owning hub checker | Internal | Green | No regression gate |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a validator regresses a file, or a diff exceeds contract scope.
- **Procedure**: the change is per-file and committed only after passing; revert the offending path-scoped commit; the file returns to its prior state with no cross-file impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──> Core (LUNA update ∥ Sonnet verify, per file) ──> Verify (gate + packet validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | phase 000 contract | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:l2-phase-deps -->

---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | prompt + baseline |
| Core (12 files, waves of >=5) | Medium | ~3 update+verify waves |
| Verify | Low | validators + reconcile |
<!-- /ANCHOR:l2-effort -->

---

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Worktree isolated at origin tip
- [ ] Baseline validator output captured per file

### Rollback Procedure
1. Identify the offending path-scoped commit.
2. `git revert <sha>` (single-file blast radius).
3. Re-run the file's validator to confirm the prior state.

### Data Reversal
- **Has data migrations?** No — documentation/structure edits only.
<!-- /ANCHOR:l2-rollback -->
