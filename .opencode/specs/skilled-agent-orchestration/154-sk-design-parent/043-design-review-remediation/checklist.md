---
title: "Verification Checklist: design-review remediation (042 findings)"
description: "Verification of the 14-finding remediation: per-fix completeness, standing-invariant re-confirmation, and evergreen cleanliness. Verification Date: 2026-06-30."
trigger_phrases:
  - "043-design-review-remediation checklist"
  - "design review remediation verification"
  - "sk-design findings remediation checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/043-design-review-remediation"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify each fix and re-confirm invariants with evidence"
    next_safe_action: "Drive validate.sh --strict errors to zero"
    blockers: []
    key_files:
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-043-design-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every actionable fix verified with a concrete check"
      - "All standing invariants and evergreen re-confirmed"
---
# Verification Checklist: design-review remediation (042 findings)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Findings and requirements documented in spec.md (verified: 14 findings scoped, Files to Change table)
- [x] CHK-002 [P0] Technical approach and affected surfaces defined in plan.md (verified: Affected Surfaces inventory)
- [x] CHK-003 [P1] Per-fix verification command identified before implementation (verified: plan.md Testing Strategy)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] md-generator backend type-checks clean (verified: `tsc --noEmit` 0 errors on guided-run.ts, crawl.ts, extract.ts)
- [x] CHK-011 [P0] Benchmark scorer parses clean (verified: `node --check` on score-skill-benchmark.cjs)
- [x] CHK-012 [P1] All gate scripts compile (verified: `py_compile` clean on the 7 gate scripts + md_table.py)
- [x] CHK-013 [P1] Edits follow existing patterns; comments de-duplicated only where clean (verified: backend tsc 0 errors after de-dup)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Parser positive case resolves correctly (verified: `['node','x','--output','outdir','https://example.com']` to url=https://example.com, output=outdir)
- [x] CHK-021 [P0] Parser missing-value case fails closed (verified: `--output --fast` throws usage)
- [x] CHK-022 [P1] Correctness fixes exercised (verified: CAPTCHA provider set detected; `--extra-urls` normalized like primary URL)
- [x] CHK-023 [P1] Security interactions validated (verified: state-changing CTAs not clicked; consent banners dismissed without granting consent)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

### Finding discipline

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class (verified: correctness/security/maintainability/traceability tagged per F-ID in spec.md)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed (verified: the 7 table-cell duplicators are the only producers; all rewired to md_table.py)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers (verified: 7 md_table.py consumers listed in plan.md Affected Surfaces)
- [x] CHK-FIX-004 [P0] Security/parser/path fixes include adversarial cases (verified: parser missing-value + value-flag-before-url; proof_check prose vs verdict READY)
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion (verified: parser flag/value/url axes; proof_check verdict/prose/checkbox axes in plan.md)
- [x] CHK-FIX-006 [P1] Foreign-cwd/import variant executed (verified: gate-script imports resolve standalone by absolute path from a foreign cwd)
- [x] CHK-FIX-007 [P1] Evidence pinned to concrete checks, not a moving range (verified: each fix cites tsc/py_compile/node --check/behavior probe)

### Per-fix completion

- [x] CHK-FX-01 [P1] F-01 guided-run parser rewrite (verified: tsc 0 errors; positive + missing-value probes pass)
- [x] CHK-FX-02 [P2] F-02 spawnSync timeouts added (verified: 120000/600000 ms; SIGTERM/error/null-status surfaced as failure)
- [x] CHK-FX-03 [P2] F-03 unsafeOutputPathReason added (verified: flags `--output` inside backend/skill root)
- [x] CHK-FX-04 [P2] F-04 triggerModals CTA denylist (verified: subscribe/signup/join/buy/checkout/submit/form-submit blocked; design-revealing kept)
- [x] CHK-FX-05 [P2] F-05 consent-safe banner dismissal (verified: OneTrust/Cookiebot-class selectors dismissed without granting consent)
- [x] CHK-FX-06 [P2] F-06 isCaptchaPage provider coverage (verified: hCaptcha/Turnstile/Arkose/DataDome/PerimeterX detected)
- [x] CHK-FX-07 [P2] F-07 extract `--extra-urls` normalization (verified: normalized like the primary URL)
- [x] CHK-FX-08 [P2] F-08 comment de-dup in crawl.ts + extract.ts (verified: de-duplicated where clean; backend tsc 0 errors)
- [x] CHK-FX-09 [P2] F-09 proof_check READY regex tightened (verified: verdict-row READY matches; prose `**READY**` does not; `[ ] NOT READY` does not; all `--require-*` lanes intact; py_compile OK)
- [x] CHK-FX-10 [P2] F-10 advisory-signals line in human report (verified: `node --check`; hubRoute 34/29/5/0 unchanged)
- [x] CHK-FX-11 [P2] F-11 md_table.py extraction + 7-script rewire (verified: all py_compile clean; foreign-cwd imports resolve; numeric_law_check bites exit 1; naming_doc_check exit 0; proof_check lanes still bite)
- [x] CHK-FX-12 [P2] F-12 webfetch least-privilege parity (verified: .opencode/agents/design.md narrowed to webfetch:deny; .claude/agents/design.md omits WebFetch; no .codex/agents/design.md)
- [x] CHK-FX-13 [P2] F-13 refuted finding clarified (verified: mode-registry.json prose clarified; grandfatheredFolderMismatch=false semantics unchanged; no behavioral change)

### Standing invariants re-confirmed

- [x] CHK-INV-01 [P0] design-command-surface-check STATUS=PASS drift=0 (verified)
- [x] CHK-INV-02 [P0] skill-benchmark hubRoute 34/29/5/0 (verified: unchanged after F-10)
- [x] CHK-INV-03 [P0] naming_doc_check exit 0 (verified: after md_table.py rewire)
- [x] CHK-INV-04 [P0] md-gen backend tsc 0 errors (verified)

### Evergreen

- [x] CHK-EVG-01 [P0] Evergreen scan reports 0 leaks (verified: no mutable packet/phase ids leaked into runtime-state docs)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced (verified: edits are parser/interaction/permission logic only)
- [x] CHK-031 [P0] No state-changing site interactions; consent not granted (verified: F-04 + F-05)
- [x] CHK-032 [P1] Child-process timeouts bound runaway preflight/run commands (verified: F-02)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/implementation-summary synchronized (verified: cross-references resolve)
- [x] CHK-041 [P1] Pre-existing-vs-session split recorded honestly (verified: spec.md OPEN QUESTIONS + implementation-summary.md)
- [x] CHK-042 [P2] Refuted finding documented with rationale (F-13)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp/scratch files left in the packet (verified: packet holds only the 5 spec docs)
- [x] CHK-051 [P1] Scope held: only finding files changed (verified: no cli-opencode/sk-prompt-models WIP touched)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 14 | 14/14 |
| P2 Items | 13 | 13/13 |

**Verification Date**: 2026-06-30
<!-- /ANCHOR:summary -->
