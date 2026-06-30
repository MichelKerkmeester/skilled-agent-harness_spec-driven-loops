---
title: "Implementation Plan: Reference Sweep, Validation & Guard [133/006/plan]"
description: "Sweep active-skill referrers, audit active-scope links and files, optionally add a reintroduction guard, reconcile completion metadata, run a DeepSeek adversarial audit, and save memory to close the de-numbering program."
trigger_phrases:
  - "133 phase 006 plan"
  - "final sweep validation memory save"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/108-catalog-playbook-snippet-denumbering/006-reference-sweep-validation-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored phase 006 plan during 133 scaffold"
    next_safe_action: "Run after the global active-scope gate is green"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Reference Sweep, Validation & Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor** | cli-opencode → MiMo (sweep edits) + DeepSeek (final adversarial audit) |
| **Verification** | repo-wide `rg` link audit + `validate.sh --recursive` |
| **Memory** | `generate-context.js` over Bash (MCP-independent) |

### Overview
A closing phase: rewrite the cross-cutting active-skill referrers the per-skill waves intentionally left, prove the active scope is link-clean and file-clean, optionally guard against reintroduction, reconcile every completion field across the packet, and save memory. DeepSeek runs a final adversarial audit for any missed referrer class.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Waves A/B/C complete; global active-scope file grep = 0

### Definition of Done
- [ ] Zero broken numbered-snippet links in active scope (REQ-001)
- [ ] `validate.sh --recursive` on the 133 parent green; statuses reconciled (REQ-003)
- [ ] Memory saved; POST-SAVE QUALITY REVIEW clean (REQ-005)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Sweep targets (~822 referrers, per D2)
- skill `changelog/**` files that cite numbered snippet paths
- skill `references/**` deep links
- cross-skill root catalog/playbook links (a playbook in skill X referencing skill Y's catalog)
- create-commands (already done in phase 001 — re-verify)
- **~743 historical `.opencode/specs/**` packet docs** (per D2) — rewrite numbered-snippet links; spec-doc validation re-run after edits to catch any structural drift

### The reintroduction guard (optional, REQ-004)
A check that fails when a file matching `*/feature_catalog/NN--*/[0-9]+-*.md` or `*/manual_testing_playbook/NN--*/[0-9]+-*.md` is added. Wire into the existing sk-doc/CI check surface used by `check-prompt-quality-card-sync.sh`-style guards, OR a sk-doc validator note if CI wiring is out of scope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| active-skill referrers | link to old numbered paths | rewrite | active-scope link audit = 0 broken |
| reintroduction guard | none | add (optional) | plants a numbered file → guard fails |
| parent + child statuses | mixed | reconcile | `validate.sh --recursive` green |
| memory DB | stale | save | POST-SAVE review clean |

Required inventories:
- Full referrer set (D2): `rg -l '[0-9]{3}-[a-z][a-z0-9-]*\.md' .opencode/skills .opencode/commands .opencode/specs` minus the snippet files themselves and the frozen anomalies.
- After spec-doc edits, re-run `validate.sh` on touched spec folders to catch structural drift from the link rewrites.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Sweep
- [ ] Rewrite active-skill referrers (MiMo)

### Phase 2: Audit + guard
- [ ] Active-scope link audit + file grep = 0
- [ ] Add reintroduction guard (or record deferral)
- [ ] DeepSeek adversarial audit for missed referrer classes

### Phase 3: Close
- [ ] Reconcile parent + 6 child statuses; `validate.sh --recursive`
- [ ] `generate-context.js` memory save; check POST-SAVE QUALITY REVIEW
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Link audit | active scope | repo-wide `rg` for numbered `.md` links |
| File gate | active scope | `rg --files | rg` excluding frozen |
| Structural | whole packet | `validate.sh --recursive` |
| Guard | reintroduction | plant-a-file test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Waves A/B/C | Internal | Pending | Sweep needs migration done |
| Decision D2 | Internal | Pending | Sets sweep breadth (specs in/out) |
| `generate-context.js` | Internal | Available via Bash | Memory save |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: audit finds broken links or validate fails.
- **Procedure**: fix the specific referrer(s); re-run audit. Guard/memory steps are additive and individually revertible.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Sweep ──► Audit + guard ──► Close (reconcile + memory save)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Sweep | Waves A/B/C | Audit |
| Audit+guard | Sweep | Close |
| Close | Audit | (program done) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Sweep | Low-Med | 1–2 MiMo |
| Audit+guard | Low | local audits + 1 DeepSeek audit |
| Close | Low | reconcile + 1 memory save |
| **Total** | | **closing phase** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Dispatch brief invariants
- `Spec folder: .../133-.../006-reference-sweep-validation-guard (pre-approved, skip Gate 3)`.
- MiMo sweep: `--model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --format json --dir <repo-root>`; no `--agent`; `</dev/null`.
- `ALLOWED WRITE PATHS: active-skill referrer files in the supplied list + the guard file ONLY.`
- `BANNED: editing .opencode/specs/** historical referrers (D2 frozen); git add -A.`

### Rollback Procedure
1. Revert specific referrer edits if the audit regresses.
2. Memory save + guard are additive; revert independently if needed.
<!-- /ANCHOR:enhanced-rollback -->
