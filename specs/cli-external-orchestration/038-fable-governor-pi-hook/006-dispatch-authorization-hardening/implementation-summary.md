---
title: "Implementation Summary: Pi Dispatch Authorization Boundary Hardening"
description: "Completed evidence summary for the bounded Pi dispatch authorization hardening and Phase 007 handoff."
status: complete
completion_pct: 100
trigger_phrases:
  - "Pi dispatch hardening summary"
  - "authorization boundary status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/006-dispatch-authorization-hardening"
    last_updated_at: "2026-08-05T00:56:22.374Z"
    last_updated_by: "pi-phase-state-reconciliation"
    recent_action: "Reconciled completed dispatch-boundary evidence and Phase 007 handoff"
    next_safe_action: "Use the Phase 007 ledger for packet state reconciliation"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
    session_dedup:
      fingerprint: "sha256:eda73448271e9c0e08ed06569b6ba660418d41433400a5d0523d3890514051ea"
      session_id: "2026-08-04-cli-038-006-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Pi Dispatch Authorization Boundary Hardening

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-dispatch-authorization-hardening |
| **Status** | Complete; implementation evidence recorded and handed off |
| **Completion** | 100% implementation evidence; Phase 007/008 state work is separate |
| **Level** | 2 |
| **Predecessor** | 005-agents-md-pi-row |
| **Successor** | 007-dispatch-validation-evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The bounded dispatch authorization boundary is implemented. A synchronous, dependency-free inspector tokenizes only a capped command string, respects quotes/escapes and top-level separators, recognizes the six supported direct executors, permits only literal `env` assignments as a transparent wrapper, and returns `direct`, `ambiguous`, or `none`. Variables, aliases, substitutions, unknown wrappers, malformed dispatch-shaped input, and multiple dispatch segments cannot become a direct allow; unrelated unsupported shell syntax returns `none` and remains fail-open.

Pi now authorizes only the executor proven by the inspector. `cli-pi` is denied before every override path; deep-loop authorization requires exact executor equality; positive mode text is unquoted and non-negated; and raw input is session-keyed across the guard, advisor, directive, spec-gate, history, and sibling extension ordering seams. The registered factory tests invoke real `input` and `tool_call` callbacks, while native `subagent` events remain outside this policy.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | Adds bounded inspection and keeps `matchDispatchShape`/audit behavior compatible for direct commands. |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modified | Covers all direct executors, prose/quotes, separators, wrappers, indirection, malformed, and fail-open rows. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified | Binds Pi authorization to inspection, self-denies, captures raw session input, strips injected/history tails, and preserves hard-rule lint. |
| `.opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Added | Pure predicate plus registered factory `input`/`tool_call` matrix. |
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modified | Captures raw interactive/RPC text before advisor/directive transformation. |
| `.pi/extensions/*.ts` | Unchanged symlink mirrors | Verified to resolve to canonical sources. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation first reproduced the raw matcher negative control: six prose/wrapper forms were falsely classified as direct while variable and alias forms remained opaque. It then added the bounded inspector, carried the inspected executor into Pi authorization, introduced global session-keyed raw capture shared by the guard and advisor modules, and verified the real factory boundary. No shell is spawned by classification, no new dependency is required, and the Pi mirror topology remains unchanged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a bounded inspector rather than broaden raw regexes | Quoted prose and `printf` text are false positives, while variables and aliases are bypasses. A typed direct/ambiguous/none result makes the boundary explicit without spawning a shell. |
| Bind authorization to the inspected executor | A user naming one `cli-*` mode must not authorize a different executable. |
| Capture original user text before transforms | Marker stripping is order-sensitive and user-authored marker text can look injected. Raw capture makes authorization independent of sibling extension order. |
| Keep self-recursion ahead of every override | The Pi skill prohibition is absolute and must not be weakened by user text or deep-loop syntax. |
| Treat unsupported syntax as a candidate only when dispatch evidence exists | This preserves fail-open behavior for unrelated shell work while preventing opaque external dispatches from becoming allows. |
| Cut history and all known sibling tails before authorization | Prior turns and transformed guidance are not user authorization for the current tool call. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Evidence class | Command / observation | Result |
|----------------|----------------------|--------|
| Shared dispatch core | `npx vitest run .opencode/hooks/dispatch/lib/dispatch-audit.test.mjs --reporter=dot` | PASS, 351/351 shared-core assertions, exit 0. |
| Pi helper and registered factory suite | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts --reporter=dot` | PASS, 27/27 combined tests, exit 0; the file contains a pure predicate matrix and named registered `input`/`tool_call` callback cases for transform order, advisor-first input, mismatch, session mismatch, self-deny, and native subagent. The 27-test result is not a factory-only count. |
| Shared rule core | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | PASS, 7/7 tests, exit 0. |
| Live Pi startup | Encoded equivalent of `command -v pi && pi --offline --approve -p "list available tools; do not modify files" </dev/null` | PASS, Pi process exit 0; returned available-tools text and reported no file modifications. The literal outer shell form is intercepted by the pre-existing raw matcher before Pi starts. |
| Diff/comment/mirror checks | `git diff --check`; scoped forbidden-marker scan; three `readlink` checks | PASS, exit 0; no forbidden markers; all mirrors resolve. |
| OpenCode scoped drift | `verify_alignment_drift.py --root .opencode/hooks/dispatch --root .opencode/skills/system-skill-advisor/hooks/pi` | PASS, 15 files, 0 findings, exit 0. |
| Full sk-code drift wrapper | `bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Residual baseline failure: alignment guard reports pre-existing `.worktrees` router-dead-path backlog; stack-folders and router-sync pass. No in-scope source finding. |
| Phase strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .../006-dispatch-authorization-hardening --strict` | PASS before evidence refresh, 0 errors/0 warnings; rerun after metadata refresh is required for final packet receipt. |

### Handoff evidence inventory

| Class | Count / status | Owner next |
|-------|---------------|------------|
| Pure inspector/predicate | Shared suite: 351/351; Pi suite's pure matrix is a named subset of the combined 27-test file | Phase 007 labels the pure subset separately. |
| Registered Pi `tool_call` | Named factory cases in the same combined 27-test Pi suite; the suite total is not a factory-only count | Phase 007 carries the registered-boundary claim. |
| Shared rule core | 7 Node tests | Phase 007 preserves non-Pi regression receipt. |
| Live startup | Pi exit 0, no file modifications | Phase 007 records as live-smoke evidence. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The inspector intentionally does not evaluate aliases, variables, substitutions, or arbitrary wrappers; those forms remain ambiguous and blocked when dispatch evidence exists.
2. Legacy non-Pi adapters that directly read the compatibility `DISPATCH_SHAPES` registry remain unchanged; the bounded contract is authoritative for shared `matchDispatchShape`/audit flow and Pi authorization. Phase 007 should decide whether to migrate those observational/preflight consumers without changing their runtime contract.
3. The repository-wide sk-code drift wrapper remains non-zero because of pre-existing `.worktrees` dead-route findings; the in-scope default scoped scan is clean. Phase 007 owns the full-corpus baseline and revisit trigger.
4. Phase 008 owns final packet status and generated-metadata reconciliation; this phase's implementation status remains Complete and the parent packet is Complete after the Phase 009 contract receipts and final metadata pass.

### Rollback boundary

Revert the Pi adapter/capture changes and the shared inspector tests/core as separate units. Keep opaque forms denied if only the shared inspector is reverted; do not restore raw-text authorization as a fallback.

### Safe continuation point

Phase 007 consumed this summary's four evidence classes and exact receipts. The packet retains the Phase 007 full-corpus deferral, while Phase 008 reconciles status and generated metadata after the completed Phase 009 contract handoff.
<!-- /ANCHOR:limitations -->
