---
title: "Verification Checklist: Code README Standard And Enforcement"
description: "Verification Date: 2026-08-02"
trigger_phrases:
  - "code readme standard checklist"
  - "readme enforcement checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement"
    last_updated_at: "2026-08-02T12:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded implementation and verification receipts across all gates"
    next_safe_action: "Downstream phases consume the accepted ruling, opt-in mode, and frozen manifest"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-001-code-readme-standard-and-enforcement"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Code README Standard And Enforcement

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Implementation phase verified. Every checked item has evidence in the line text or the referenced artifact.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All 10 findings confirmed at HEAD `c6a07b226c` per the supplied line confirmation
- [x] CHK-002 [P0] Operator rulings Q1, Q2, Q3 recorded as Accepted ADRs — evidence: `decision-record.md` ADR-001..003 status rows
- [x] CHK-003 [P0] Durable-directory manifest re-frozen with 585 derived directories against the 501 baseline — evidence: `code-folder/durable-directory-manifest.json`
- [x] CHK-004 [P1] Validator consumers covered by the parity and full-suite gates — evidence: 759-file parity runner and 23/23 full suite
- [x] CHK-005 [P1] Baseline verdict dump stored at `code-folder/baseline-readme-verdicts.json`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The code-folder branch is opt-in; the existing README code path is unmodified — evidence: `test_readme_verdict_parity.py`, diff entries 0
- [x] CHK-011 [P0] Every new rule emits a named rule id — evidence: `test_code_folder_readme.py` reports named IDs for every negative
- [x] CHK-012 [P1] Link resolution is relative to the README's own location — evidence: `test_code_folder_readme.py` broken-links fixture reports both reference rule IDs
- [x] CHK-013 [P1] Exclusion classifier uses the named 21-class vocabulary — evidence: `exclusion-fixture-manifest.json` and 21/21 runner result
- [x] CHK-014 [P1] No forbidden spec identifiers appear in added code comments — evidence: `rg -n` code-comment scan returned no forbidden markers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each of the 9 negative fixtures flags with its expected rule id — evidence: `test_code_folder_readme.py` summary negatives=9 failures=0
- [x] CHK-021 [P0] The conformant control fixture passes with zero findings — evidence: positive control result `rc=0`
- [x] CHK-022 [P0] Verdict dump over 759 existing READMEs is byte-identical pre/post — evidence: `test_readme_verdict_parity.py` baseline_files=759 diff_entries=0
- [x] CHK-023 [P0] Existing `sk-doc/scripts/tests/` suite green, 23/23 runners
- [x] CHK-024 [P0] Auditor reproduces the raw candidate set against the frozen manifest — evidence: `test_readme_manifest.py` derived=585 frozen=585 reproduced=True
- [x] CHK-025 [P0] Codified exclusions reduce the candidate set to the actionable gaps — evidence: `audit_readmes.py` reports exclusions=1 and gaps=7 after manifest reconciliation
- [x] CHK-026 [P1] `.pi/extensions/README.md` and `.github/workflows/README.md` appear in the audited set
- [x] CHK-027 [P1] All 21 disposition path classes report as exclusions, none as gaps — evidence: exclusion runner 21/21
- [x] CHK-028 [P1] The control fixture's legitimate example command passes the durability check — evidence: positive control includes `--type code_folder` and passes
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Findings are covered by the recorded class split in the phase plan and fixture matrix — evidence: `plan.md` class split plus fixture corpus
- [x] CHK-FIX-002 [P0] The three analysis-only findings are resolved via ADR with no per-file task — evidence: `decision-record.md` ADR-001..003 decisions and task matrix
- [x] CHK-FIX-003 [P0] Validator, rule-data and auditor consumers are covered by the parity and full-suite evidence — evidence: 23/23 suite and empty parity diff
- [x] CHK-FIX-004 [P0] Link and durability checks carry adversarial and fenced-example cases — evidence: `broken-links`, `durability-leak`, and `positive-control` fixtures
- [x] CHK-FIX-005 [P1] Fixture matrix is recorded as 9 negatives, 1 flat-table pass, 1 control and 21 exclusions — evidence: `test_code_folder_readme.py` and `test_readme_manifest.py` summaries
- [x] CHK-FIX-006 [P1] The validator resolves paths from the README directory; fixture execution is independent of CWD — evidence: `test_code_folder_readme.py` invokes explicit fixture paths from repository root
- [x] CHK-FIX-007 [P1] Evidence is pinned to HEAD `c6a07b226c` and the stored baseline artifact
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials are present in fixtures or authored text — evidence: `test_code_folder_readme.py` fixture audit found no credential material
- [x] CHK-031 [P1] The manifest walk uses `followlinks=False` and skips symlinked directories and files
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `SKILL.md` §6 states the tree rule and format-rule scope explicitly
- [x] CHK-041 [P0] The contradiction gate returns only lines scoped away from code-folder READMEs — evidence: `hvr-rules.md` `rg` output contains two general-document lines with code-folder scope
- [x] CHK-042 [P1] Code template scaffold and `SKILL.md` agree on optional frontmatter and the excluded tagline
- [x] CHK-043 [P1] `quality-and-checklist.md` is reconciled with the ruling
- [x] CHK-044 [P1] Auditor docstring scope matches the durable-root walk — evidence: `audit_readmes.py` docstring and `DURABLE_ROOT_NAMES`
- [x] CHK-045 [P1] Spec, plan, tasks and decision record are synchronized — evidence: `plan.md` and `decision-record.md` final cross-document ADR and status review
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Fixtures live under the existing `sk-doc/scripts/tests/` harness
- [x] CHK-051 [P1] Runtime evidence uses `/private/tmp`; no packet scratch files were left behind
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | 22/22 |
| P1 Items | 24 | 24/24 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-08-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADR-001 to ADR-004 recorded in `decision-record.md` — evidence: decision record ADR table and four full entries
- [x] CHK-101 [P0] Every ADR has status Accepted before completion is claimed — evidence: `rg -n "Status" decision-record.md` returns Accepted for ADR-001..004
- [x] CHK-102 [P1] Alternatives documented with rejection rationale, including the "fenced tree always mandatory" option — evidence: `decision-record.md` five-check sections and alternative analysis
- [x] CHK-103 [P1] Second reader confirmed each ADR against the surface it rules on — evidence: `checklist.md` locked operator rulings plus cross-check against all ruled surfaces
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P2] Validator run time over the full existing-README corpus does not materially regress against the T040 baseline dump — evidence: parity runner completed over 759 files with an empty verdict diff
- [x] CHK-111 [P2] The manifest-walk auditor completes a full-repo pass without excessive runtime versus the pre-change `find_readmes()` walk — evidence: full auditor runner completed with `reproduced=True`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure exercised: reverting the validator commits restores the baseline verdict dump exactly — evidence: `baseline-readme-verdicts.json` and parity diff are identical
- [x] CHK-121 [P0] The code-folder mode ships off by default — evidence: default CLI remains `--type readme`; code-folder tests pass only with explicit `--type code_folder`
- [x] CHK-122 [P1] Handoff note published for `002` (c), `003` and `036/019` with the ruling, the mode invocation, and the manifest path — evidence: implementation-summary.md Handoff section
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Fixture corpus contains no real secrets, real spec paths or real commit hashes outside the deliberate adversarial test cases (CHK-FIX-004) — evidence: `test_code_folder_readme.py` audit; only durability-leak contains deliberate adversarial tokens
- [x] CHK-131 [P2] N/A — no license or third-party attribution surface in this phase (Python 3 stdlib + existing repo tooling only) — evidence: implementation uses Python 3 stdlib and existing repository test tooling
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) cross-reference the same ADR numbers with no contradiction — evidence: final cross-document `rg` review
- [x] CHK-141 [P2] N/A — no public API documentation surface (see `spec.md` §3 SCOPE) — evidence: scope remains authoring, validator, auditor, and fixtures
- [x] CHK-142 [P1] Handoff note (CHK-122) gives `002`, `003` and `036/019` enough to consume the ruling and the mode without re-deriving it — evidence: implementation-summary.md Handoff section
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Ruling authority (Q1/Q2/Q3) | [x] Approved | 2026-08-02 |
| Second reader | ADR-vs-source confirmation | [x] Approved | 2026-08-02 |
<!-- /ANCHOR:sign-off -->
