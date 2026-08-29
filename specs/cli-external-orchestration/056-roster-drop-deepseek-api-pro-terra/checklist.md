---
title: "Verification Checklist: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra"
description: "Verification Date: 2026-08-28"
trigger_phrases:
  - "verification"
  - "checklist"
  - "drop deepseek api pro terra"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/056-roster-drop-deepseek-api-pro-terra"
    last_updated_at: "2026-08-29T10:35:00Z"
    last_updated_by: "pi"
    recent_action: "All checks pass with evidence"
    next_safe_action: "None — validated --strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-056-roster-drop-deepseek-api-pro-terra"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Drop DeepSeek API provider, V4 Pro, and GPT-5.6 Terra

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each check records the command run, the expected result, and the observed output at final state. A check is PASS only when observed output was read from the actual command run on the final state.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| P1 | `grep -rln "deepseek-v4-pro\|5.6-terra"` over live docs, pre-change | Non-empty (17 files) | 17 files listed | ✅ |
| P2 | Combo-matrix test argv before fix | Mismatch vs new default after runtime edit | Expected/received diff caught `--thinking max` position | ✅ |
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| C1 | `node --check fanout-run.cjs` | Exit 0 | Exit 0, `SYNTAX-OK` | ✅ |
| C2 | Roster ↔ mirror parity | `PI_SUPPORTED_MODELS` ≡ `PI_ALLOWED_MODELS` | Parity test passes | ✅ |
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| T1 | `npx vitest run` (executor-config, fanout-run, combo-matrix) | All pass | 205 passed / 0 failed (post-final-fix re-run) | ✅ |
| T2 | Roster assertion | 11 ids, no v4-pro/terra | Expected sorted list matches | ✅ |
| T3 | Default assertion | `deepseek-v4-flash`, max-pinned | Default command carries `--thinking max` | ✅ |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| F1 | Grep gate 1 (v4-pro/terra in live docs) | Only intentional retired-notes + incident history | 6 intentional hits; zero live dispatch shapes | ✅ |
| F2 | Grep gate 2 (direct-provider shapes) | Zero hits | Zero hits (grep exit 1) | ✅ |
| F3 | Grep gate 3 (enforcement sync) | No pi-list residue (DEVIN list exempt) | Clean after fanout map fix | ✅ |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| S1 | Incident history (2026-05-04) preserved verbatim | Not rewritten | Narrative intact in destructive-scope-violations.md | ✅ |
| S2 | No fabricated numbers | Flash context window marked unverified | context-budget.md row says "not re-verified … confirm via opencode models opencode-go" | ✅ |
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| D1 | Playbook evidence is fresh, not invented | `sed -n '182,211p'` capture matches recorded list | 11 ids + flash default captured live | ✅ |
| D2 | Changelogs record retirement + verification | Present | v1.4.1.0 (cli-pi), v1.4.3.0 (cli-opencode) | ✅ |
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

| # | Check | Expected | Observed | Status |
|---|-------|----------|----------|--------|
| O1 | Deleted playbook file leaves no dangling link | CO-011 marked RETIRED, no feature-file link | Index updated; no link to deleted file | ✅ |
| O2 | No stray files | No temp artifacts in tree | git status shows only intended files | ✅ |
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All pre-implementation baselines, quality checks, tests, safety checks, and documentation checks pass with observed evidence. Nothing was fabricated: the flash context window is explicitly marked unverified, and historical/benchmark records were left untouched.
<!-- /ANCHOR:summary -->
