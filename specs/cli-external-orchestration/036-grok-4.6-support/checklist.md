---
title: "Verification Checklist: Grok 4.6 Support for cli-cursor & cli-devin"
description: "Verification Date: 2026-08-12"
trigger_phrases:
  - "verification"
  - "checklist"
  - "grok 4.6"
importance_tier: "normal"
contextType: "implementation"
---
# Verification Checklist: Grok 4.6 Support for cli-cursor & cli-devin

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available — `cursor-agent`, `devin` CLIs confirmed installed and authenticated before any edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — n/a lint config in this package; `tsc --noEmit` used as the type gate
- [x] CHK-011 [P0] No console errors or warnings — `npm run typecheck` clean (no output = success)
- [x] CHK-012 [P1] Error handling implemented — n/a, no new error paths added (existing `isCursorModelAllowed`/`isDevinModelAllowed` fail-closed checks reused as-is)
- [x] CHK-013 [P1] Code follows project patterns — hand-duplicated mirror convention in `fanout-run.cjs` preserved exactly as documented inline
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 through REQ-007 in spec.md all verified with evidence
- [x] CHK-021 [P0] Manual testing complete — 4 live dispatch calls (`cursor-agent -p --model cursor-grok-4.6-{high,xhigh}`, `devin -p --model grok-4-6-{high,xhigh}`) each returned a real model response at exit 0 from a trusted scratch workspace
- [x] CHK-022 [P1] Edge cases tested — bracket-syntax rejection re-tested for the new id (`cursor-grok-4.6[effort=high]` → `Cannot use this model`, exit 1); confirmed the vendor did NOT retire 4.5 (both families still list live)
- [x] CHK-023 [P1] Error scenarios validated — genuinely out-of-roster ids (`auto`, hosted GPT/Claude ids, an off-family Cursor id passed to the Devin adapter) covered by the "rejects a model outside the enforced allowlist" vitest cases (both `executor-config.vitest.ts` and `fanout-run.vitest.ts`); Grok 4.5 ids are explicitly NOT in this rejected set — see ADR-002 — and are covered instead by the "accepts every allowlisted id" cases
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` — a shared roster fact (Grok 4.5 → 4.6) with many consumers (2 runtime files, 2 test files, 13 skill docs, 3 cross-reference docs)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed — both allowlist arrays (`executor-config.ts`, `fanout-run.cjs`) identified via grep and both updated together
- [x] CHK-FIX-003 [P0] Consumer inventory completed — `rg -rniE "grok[ _-]?4\.5|grok-4-5|grok45"` run repo-wide before and after; every live-surface hit under `.opencode/` addressed, every `specs/` and log hit deliberately left as historical record
- [x] CHK-FIX-004 [P0] N/A — not a security/path/parser/redaction fix; the adversarial-table requirement does not apply. The equivalent safety check performed instead: both Grok versions' acceptance re-verified by vitest, the genuinely-rejected out-of-roster cases re-verified separately, and the "vendor did not retire 4.5" claim re-checked against fresh live output rather than assumed
- [x] CHK-FIX-005 [P1] Matrix axes listed before completion claimed — platform (Cursor/Devin) × tier (low/medium/high/xhigh) × fast-variant (Cursor only), 8+4=12 ids total, enumerated in plan.md §"Affected Surfaces"
- [x] CHK-FIX-006 [P1] N/A — no process-wide/global env state read by the changed code paths
- [x] CHK-FIX-007 [P1] Evidence pinned to the live command output captured in this session (CLI versions: `cursor-agent 2026.08.11-e8db854`, `devin 3000.4.16`, dated 2026-08-12), not a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation implemented — unchanged; `isCursorModelAllowed`/`isDevinModelAllowed` still fail-closed reject any id outside the array
- [x] CHK-032 [P1] Auth/authz working correctly — n/a, no auth surface touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate — both allowlist comments in `executor-config.ts` carry the live-verification date and CLI build, matching the pre-existing convention
- [x] CHK-042 [P2] README updated — both cli-cursor and cli-devin READMEs updated, version bumped
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — live-verification test calls run from the session scratchpad directory, not the repo
- [x] CHK-051 [P1] scratch/ cleaned before completion — no persistent artifacts left in the scratchpad from this packet's verification calls
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md — ADR-001 (tier-width) and ADR-002 (keep Grok 4.5 + alphabetize, the operator's Phase 5 correction)
- [x] CHK-101 [P1] All ADRs have status — ADR-001: Accepted, ADR-002: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale — 4.5-parity subset alternative scored and rejected in ADR-001; retire-and-replace (the actual first-pass implementation) scored and rejected in ADR-002
- [x] CHK-103 [P2] Migration path documented — `providers-and-models.md` in both skills carries an explicit "Grok 4.5 → 4.6" migration note
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-08-12
<!-- /ANCHOR:summary -->
