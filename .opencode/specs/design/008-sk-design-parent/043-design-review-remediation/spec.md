---
title: "Feature Specification: design-review remediation (042 findings)"
description: "Remediate the 14 findings from the sibling 042 deep review (CONDITIONAL: 0 P0, 1 P1, 13 P2) across the sk-design md-generator backend, the campaign gate code, and the design agent config. All fixes orchestrator-verified; standing invariants preserved."
trigger_phrases:
  - "043-design-review-remediation spec"
  - "design review remediation"
  - "sk-design md-generator findings fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/043-design-review-remediation"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scope the 14 deep-review findings and the pre-existing-vs-session split"
    next_safe_action: "Validate the packet with validate.sh --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-043-design-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Every actionable finding landed and was orchestrator-verified"
      - "All standing invariants re-confirmed holding after the fixes"
---
# Feature Specification: design-review remediation (042 findings)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-30 |
| **Completed** | 2026-06-30 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Source review** | `154-sk-design-parent/042-design-work-deep-review` (CONDITIONAL) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sibling deep review `042-design-work-deep-review` returned a CONDITIONAL verdict with 14 findings: 0 P0, 1 P1, and 13 P2. The P1 was a real URL-parsing defect in the design-md-generator guided runner; the P2s spanned security hardening in the crawler/runner, correctness gaps in CAPTCHA detection and URL normalization, traceability gaps in gate reporting, and maintainability debt (duplicated comments, duplicated table helpers, and a webfetch permission asymmetry between the OpenCode and Claude design agent definitions). One P2 was a false positive that needed a prose clarification rather than a code change.

### Purpose
Close every actionable finding from 042 with a scope-locked, orchestrator-verified fix while keeping all standing design-enforcement invariants green and changing only the files the findings name.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The 1 P1 correctness fix in `guided-run.ts` (argument parser).
- The 12 P2 fixes across the md-generator backend (`guided-run.ts`, `crawl.ts`, `extract.ts`), the campaign gate code (`proof_check.py`, `score-skill-benchmark.cjs`, the shared `md_table.py` extraction plus 7-script rewire), and the design agent config (`.opencode/agents/design.md`).
- The 1 refuted P2 (`mode-registry.json` "grandfathered" reading), resolved by clarifying the description prose only.
- Re-confirmation of all standing invariants after the changes.

### Out of Scope
- Any unrelated work-in-progress under `cli-opencode` or `sk-prompt-models` - those edits predate this remediation and are not finding files.
- Behavioral changes to the refuted `mode-registry.json` logic - the flag was already correct.
- New design modes, new gates, or feature additions - this packet only remediates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts` | Modify | Parser rewrite, spawn timeouts, unsafe-output-path preflight (F-01, F-02, F-03) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts` | Modify | CTA denylist, consent-safe banner dismissal, CAPTCHA provider coverage, comment de-dup (F-04, F-05, F-06, F-08) |
| `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts` | Modify | `--extra-urls` normalization, comment de-dup (F-07, F-08) |
| `.opencode/skills/sk-design/shared/scripts/proof_check.py` | Modify | Tighten READY `**`-branch regex to a verdict/result/checkbox anchor (F-09) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs` | Modify | Surface advisory-signals line in the human report (F-10) |
| `.opencode/skills/sk-design/shared/scripts/md_table.py` | Create | Shared markdown-table-cell helper extracted from 7 gate scripts (F-11) |
| `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py` | Modify | Rewire to shared `md_table.py` via `__file__`-relative import (F-11) |
| `.opencode/skills/sk-design/shared/scripts/variant_parameter_check.py` | Modify | Rewire to shared `md_table.py` (F-11) |
| `.opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py` | Modify | Rewire to shared `md_table.py` (F-11) |
| `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py` | Modify | Rewire to shared `md_table.py` (F-11) |
| `.opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py` | Modify | Rewire to shared `md_table.py` (F-11) |
| `.opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py` | Modify | Rewire to shared `md_table.py` (F-11) |
| `.opencode/agents/design.md` | Modify | Narrow `webfetch:allow` to `webfetch:deny` for least-privilege parity with the Claude agent (F-12) |
| `.opencode/skills/sk-design/mode-registry.json` | Modify | Description prose clarified; no behavioral change (F-13, refuted) |

> Note: this packet's own authoring writes ONLY documentation under `043-design-review-remediation/`. The code/config files above were fixed and orchestrator-verified before this spec was written and are listed here as the remediation's targets, not as edits made by the doc author.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No standing invariant regresses | design-command-surface-check STATUS=PASS drift=0; skill-benchmark hubRoute 34/29/5/0; naming_doc_check exit 0; evergreen 0 leaks; md-gen backend tsc 0 errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fix the guided-run URL parser (F-01) | `parseGuidedRunArgs(['node','x','--output','outdir','https://example.com'])` resolves url=https://example.com, output=outdir; missing value-flag value throws usage; tsc 0 errors |
| REQ-003 | Land every actionable P2 fix (F-02..F-12) | Each fix present in the named file, verified by the orchestrator with a concrete check (tsc, py_compile, node --check, regex behavior, import resolution) |
| REQ-004 | Resolve the refuted finding without behavioral change (F-13) | `mode-registry.json` prose no longer reads as a contradiction; `grandfatheredFolderMismatch=false` semantics unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 14 review findings are addressed (13 real changes plus 1 refuted/clarified) and orchestrator-verified.
- **SC-002**: Every standing invariant re-confirmed holding after the fixes (surface check, hubRoute, naming gate, evergreen, backend tsc).
- **SC-003**: Scope held - only the finding files changed; no unrelated WIP touched.
- **SC-004**: All campaign gates still bite (numeric_law_check, naming_doc_check, proof_check lanes) after the DRY consolidation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | DRY consolidation could silently disable a gate | High | Re-ran py_compile on all 7 scripts; confirmed numeric_law_check still bites (in-table cross-id duplicate-value to exit 1) and proof_check lanes still bite |
| Risk | Tightened proof_check READY regex could miss real verdict rows | Med | Verified verdict-row READY matches, prose `**READY**` does not, `[ ] NOT READY` does not; all `--require-*` lanes intact |
| Risk | Consent-safe banner change could break design extraction | Med | Banner handling now DISMISSES known consent UIs without granting consent, preserving design-revealing rendering |
| Risk | `__file__`-relative imports could fail from a foreign cwd | Med | Confirmed imports resolve standalone by absolute path from a foreign working directory |
| Risk | Mischaracterizing pre-existing code as session work | Low | HONEST SPLIT documented in OPEN QUESTIONS; most findings were pre-existing backend code, not this campaign's enforcement work |
| Dependency | Sibling review `042-design-work-deep-review` | Source of findings | Findings registry and review-report consumed read-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The crawler performs no state-changing interactions on production sites. `triggerModals` denylists subscribe/signup/join/buy/checkout/submit/form-submit intents while keeping design-revealing interactions.
- **NFR-S02**: Cookie/consent banners are dismissed without granting consent, using known consent selectors (OneTrust, Cookiebot, and peers) rather than a blanket `querySelectorAll('*')` auto-accept.
- **NFR-S03**: Child processes cannot hang the runner. Preflight commands time out at 120000 ms and run commands at 600000 ms, with SIGTERM/error/null-status surfaced as failure.

### Reliability
- **NFR-R01**: The guided-run parser rejects missing or `--`-prefixed values for value flags and throws usage rather than misreading the URL.
- **NFR-R02**: CAPTCHA detection covers hCaptcha, Turnstile, Arkose, DataDome, and PerimeterX in addition to the prior providers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Input Boundaries
- Value flag preceding the URL (`--output dir <url>`): parser skips the flag and its value, then takes the URL.
- Missing value-flag value (`--output --fast`): parser throws usage.
- `--extra-urls` entries: normalized identically to the primary URL.

### Adversarial Pages
- State-changing CTAs present: not clicked.
- Consent banner present: dismissed, consent not granted.
- CAPTCHA-gated page: detected across the expanded provider set.

### Reporting
- proof_check READY in prose only: not matched; verdict/result/checkbox-anchored READY: matched.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 14 files across 3 subsystems (backend, gate code, agent config); mostly surgical edits plus one new shared helper |
| Risk | 12/25 | Security and parser changes, but additive/least-privilege; no public API or schema break |
| Research | 8/20 | Findings pre-investigated by 042; remediation required mapping and verification, not new discovery |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Headcount reconciliation**: 042 tallied 13 P2 plus 1 P1 (14 findings). This packet logs 13 discrete fix entries because the duplicated-comment cleanup (F-08) resolves the sibling maintainability findings in both `crawl.ts` and `extract.ts`. All review findings are addressed; the delta is bookkeeping, not an open defect.
- **Pre-existing vs session split (HONEST)**: most findings (the P1 plus the crawler/guided-run P2s) were PRE-EXISTING design-md-generator backend code, not this campaign's enforcement work. The campaign gate code (`proof_check`, `score-skill-benchmark`, the Python gates) got only minor hardening plus the DRY consolidation, and all gates still bite. This split is recorded so the remediation is not mistaken for net-new feature work.
- **Refuted finding (F-13)**: `grandfatheredFolderMismatch=false` correctly means "no folder mismatch, names preserved." The 042 finding read it as a contradiction; the only change is clarifying prose. No behavioral change was warranted or made.
<!-- /ANCHOR:questions -->
