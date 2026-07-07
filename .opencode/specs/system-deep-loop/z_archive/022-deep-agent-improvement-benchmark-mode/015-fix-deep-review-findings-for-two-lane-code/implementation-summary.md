---
title: "Implementation Summary: fix deep-review findings for two-lane code"
description: "Stub: implementation summary for remediating the 014 two-lane deep-review findings. Filled at packet close."
trigger_phrases:
  - "two-lane remediation summary"
  - "014 findings implementation summary"
  - "Lane B fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-deep-agent-improvement-benchmark-mode/015-fix-deep-review-findings-for-two-lane-code"
    last_updated_at: "2026-05-29T12:50:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Remediated all 014 findings: 31 fixed + 2 documented-accept, vitest 163"
    next_safe_action: "None; remediation complete and verified"
    blockers: []
    key_files:
      - "../014-review-two-lane-workflow-implementation/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "remediation-20260529"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: fix deep-review findings for two-lane code

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-fix-deep-review-findings-for-two-lane-code |
| **Completed** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The 014 deep review returned CONDITIONAL with 1 confirmed P0 + a P1 security/traceability cluster + P2 advisories. This phase closed every active finding: 31 FIXED (with tests) and 2 DOCUMENT-ACCEPT (intended trusted-author boundaries, recorded with rationale). Six parallel workstreams over disjoint file clusters did the fixes, an adversarial verifier confirmed the gates, and the orchestrator independently re-ran the riskiest checks and closed one cross-file residual the workstream flagged.

### Headline fixes

- **F-P0-1 (blocker):** `loop-host.parseArgs` now accepts space-form flags (`--scorer 5dim`), so the Lane B command surface (which invokes loop-host with space-form) runs as intended. The `=`-form path is byte-identical, so TST-1 holds. The build had only ever tested the script with `=`-form, which is why it missed this.
- **F-P1-1 (security):** executor/grader dispatch defaults to READ-ONLY (cli-codex `--sandbox read-only`, cli-claude-code `--permission-mode plan`, cli-gemini drops auto-approve). Write capability is an explicit opt-in via `DEEP_AGENT_DISPATCH_WRITE=1`.
- **F-P1-9 (security):** fixture IDs are sanitized (`^[A-Za-z0-9._-]+$`) before any `path.join`, rejecting traversal.
- **F-P1-11/12:** the score cache is packet-local and candidate-content-keyed, so a stale or shared cache cannot return another candidate's score.
- **F-P1-4b (cross-file residual, closed by the orchestrator):** `materialize-benchmark-fixtures.cjs` now resolves `--profile` as a direct path OR an id under `--profiles-dir`, matching run-benchmark, so a profile-by-id no longer fails before run-benchmark. Verified by a profile-by-id smoke.
- **F-P1-16:** the agent Lane awareness note (4 mirrors) now cites the post-013 lane script paths, mirror-drift 0.
- Plus F-P1-2/3/5/6/7/8/13/14/15 (command surface + traceability + dispatch) and 14 P2 advisories.

### Documented-accept (2)

- Unknown-mode collapse to agent-improvement in the reduce-state mode mix is the intended legacy default (documented).
- `DEEP_AGENT_ALLOW_CRITERIA_EXEC` default is the trusted-author boundary upheld by the 122 arbiter (documented rationale).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six parallel fix workstreams (loop-host+test, dispatch-model, run-benchmark, reduce-state+score-candidate, the command surface, SKILL+advisor+agent-mirrors+profile), then an adversarial verifier, then orchestrator re-verification of TST-1, the space-form Lane B smoke, and the F-P1-4b profile-by-id smoke.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix F-P0-1 in parseArgs (space-form) not by editing the command surface | Robust, matches the as-authored command surface, and TST-1-safe since `=`-form is byte-identical |
| Read-only dispatch by default, write behind an env opt-in | A grader emits a judgment only and must not write the workspace |
| Cache keyed by candidate path + content hash, packet-local | Prevents stale/shared cache from returning the wrong candidate's score |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| vitest (deep-agent-improvement scripts) | PASS, 14 files, 163 tests (+30 over baseline), 0 failed |
| TST-1 byte-identity + parseArgs space-form | PASS, 21/21 loop-host, identity holds |
| F-P0-1 space-form Lane B smoke | PASS, benchmark-complete + scoringMethod=5dim via the command path |
| F-P1-4b profile-by-id smoke | PASS, resolves in materialize + run-benchmark |
| Grader read-only default | PASS, write gated behind DEEP_AGENT_DISPATCH_WRITE=1 |
| Fixture-id traversal | PASS, ../evil and a/b rejected |
| Mirror-drift (agent note) | PASS, 0 |
| Alignment-drift | PASS, 0 findings (55 files) |
| Advisor routing | PASS, benchmark phrasing to deep-model-benchmark |
| validate.sh --strict on 015 | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **validate.sh --recursive is a pre-existing silent no-op** on a phase parent when the Node orchestrator is present (system-spec-kit infra, out of this packet's scope). Children were validated directly instead. Flagged for a system-spec-kit follow-up.
<!-- /ANCHOR:limitations -->
