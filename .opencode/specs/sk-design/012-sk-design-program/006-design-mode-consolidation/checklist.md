---
title: "Verification Checklist: sk-design mode consolidation"
description: "Evidence checklist for four-mode routing, permanent interface-owned foundations and audit workflows, exact relocations, frozen styles, and downstream verifier preservation."
trigger_phrases:
  - "sk-design consolidation verification"
  - "four mode checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/006-design-mode-consolidation"
    last_updated_at: "2026-07-27T04:33:25.494Z"
    last_updated_by: "claude"
    recent_action: "Reconciled checklist per gate evidence; marked ADR-002-superseded items N/A"
    next_safe_action: "Orchestrator runs validate.sh --strict, styles SHA-256 equality, and the design benchmark suite"
    blockers: []
    key_files: []
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-design Mode Consolidation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim completion until verified |
| **[P1]** | Required | Must complete or receive user-approved deferral |
| **[P2]** | Optional | May defer with a documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and approved override are documented in `spec.md`. [evidence: `spec.md` Requirements and Open Questions, now reflecting ADR-002]
- [x] CHK-002 [P0] Technical sequence and file-scoped rollback are documented in `plan.md`. [evidence: `plan.md` Architecture and Rollback Plan, reconciled to the retirement outcome]
- [x] CHK-003 [P0] All required behavior gates have captured baselines. [evidence: `interface-command-contract.test.mjs` 8/0, `design-command-surface-check.test.mjs` 7/0, `design-command-surface-check.mjs` commands=5/aliases=15, `parent-skill-check.cjs` OK/0-warnings, `scratch/benchmark-before/report.json`]
- [x] CHK-004 [P0] Exact source counts and styles hashes are recorded before relocation. [evidence: `scratch/foundations-files.before.txt` (48), `scratch/audit-files.before.txt` (70), `scratch/styles.sha256.before` (7,812 rows)]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Authored JSON, Markdown, JavaScript, TypeScript, Python, Bash, and YAML pass relevant syntax/format checks.
- [ ] CHK-011 [P0] No generated artifact is manually approximated.
- [ ] CHK-012 [P1] No ephemeral packet identifiers or paths are added to code comments.
- [ ] CHK-013 [P1] File permissions and executable bits match their pre-move sources.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Registry has exactly the four approved entries in deterministic order. [evidence: verified final state — `interface`, `motion`, `md-generator`, `design-mcp-open-design`]
- [ ] CHK-021 [P0] ~~`/interface:foundations` resolves to a complete permanent interface-owned subworkflow.~~ [N/A: `/interface:foundations` is RETIRED entirely under ADR-002, not preserved as a subworkflow — superseded requirement]
- [ ] CHK-022 [P0] ~~`/interface:audit` resolves to a complete permanent interface-owned subworkflow.~~ [N/A: `/interface:audit` is RETIRED entirely under ADR-002]
- [ ] CHK-023 [P0] ~~Foundations corpus and validators pass from their new paths.~~ [N/A: foundations subworkflow retired/flattened, not relocated to a "new path" — substitute evidence: interface+motion corpus 70/0 passing post-flatten]
- [ ] CHK-024 [P0] ~~Audit scoring, report, comparison-corpus, fingerprint, and Bash gates pass from their new paths.~~ [N/A: audit surface deleted entirely (70 files/6,202 lines); two AI-fingerprint parity scripts deleted (915 lines) rather than moved; 7 binary anti-slop checks folded into `interface-preflight-card.md` section 11 instead of preserved as independent gates]
- [x] CHK-025 [P0] Package and command contract pass counts equal or exceed green baselines without weakened assertions. [evidence: `interface-command-contract.test.mjs` 8/0 both; `design-command-surface-check.test.mjs` 7/0 both; `parent-skill-check.cjs` OK/0-warnings both; `design-command-surface-check.mjs` commands 5->3, aliases 15->9 — expected reduction from retirement, `invalid=0 drift=0` unchanged]
- [ ] CHK-026 [P0] Parent-hub, compiled-routing, drift, and benchmark gates pass. [partial: `parent-skill-check.cjs` OK/0-warnings confirmed; compiled-routing/drift NOT evidenced; design benchmark suite NOT run]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Producers inventoried: registry, router, command metadata, leaf manifest, advisor metadata, and compiled-route sync. [not evidenced as a standalone deliverable in this pass]
- [ ] CHK-FIX-002 [P0] Consumers classified as live, generated, or historical before edits. [not evidenced as a standalone deliverable in this pass]
- [ ] CHK-FIX-003 [P0] ~~Exact accounting verifies 112 subordinate relocations, two READMEs, two contract transformations, and two changelogs.~~ [N/A: superseded — actual outcome was deletion (audit: 70 files/6,202 lines) and flattening-without-preservation (foundations: contract.md/README.md/changelog/ deleted), not the planned 112/2/2/2 relocation accounting (ADR-002)]
- [ ] CHK-FIX-004 [P0] ~~Interface leaf manifest contains exactly 69 leaves.~~ [N/A: the 69-leaf figure was specific to the retired relocation plan (ADR-002); current leaf count not verified in this evidence set]
- [ ] CHK-FIX-005 [P1] ~~Algorithm invariant preserves workflow capability independently of mode identity.~~ [N/A: inverted by ADR-002 — audit/foundations command capability was retired together with mode identity, not preserved independently of it; anti-slop essentials folded into `interface-preflight-card.md` instead]
- [x] CHK-FIX-006 [P1] Final grep has no live old-path or nested-identity consumer. [evidence: live `design-audit/`/`design-foundations/` reference grep: 152 (baseline) -> 0 (final)]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] ~~Existing audit shell/path-validation gates remain intact.~~ [N/A: audit is retired entirely (ADR-002) — there is no remaining gate to keep intact. toolSurface finding: no Bash authority was lost either way — the retired audit mode already declared `forbidden: [Write, Edit, Bash]` with an empty `bashAllowlist`]
- [ ] CHK-031 [P0] No secret, credential, network dependency, or external data transfer is introduced. [not explicitly checked in this pass; the change is deletion/consolidation-only and adds no new dependency by nature]
- [ ] CHK-032 [P1] Command and router inputs retain existing fail-closed validation. [not evidenced in this pass]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] ~~Hub, interface, command, README, contract, and generated routing docs describe the same four-mode/subworkflow topology.~~ [N/A as written: the subworkflow layer no longer exists (ADR-002) — topology is now 4 modes / 3 commands with no ownership array. Doc synchronization for this shape is not verified in this pass]
- [ ] CHK-041 [P1] ~~Historical changelogs remain present and legible.~~ [N/A: audit and foundations changelogs were deleted along with their surfaces, not preserved (ADR-002) — judged packet-mimicking ceremony rather than history worth keeping]
- [x] CHK-042 [P2] Research recommendation override remains explicit in the decision record. [evidence: `decision-record.md` ADR-002 records the divergence from the canonical research's ranked recommendation 3 (extract audit as a standalone skill), choosing retirement instead]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] No `design-foundations/` or `design-audit/` peer-mode directory remains after successful relocation. [evidence: audit surface deleted entirely (70 files / 6,202 lines: `design-interface/audit/`, `assets/audit/`, `references/audit/`); `design-interface/foundations/` FLATTENED and no longer exists]
- [x] CHK-051 [P0] No nested `SKILL.md`, `description.json`, or `graph-metadata.json` identity exists for either subworkflow. [evidence: both surfaces deleted/flattened entirely — no nested identity files remain for either]
- [x] CHK-052 [P1] Temporary manifests and command output remain in packet `scratch/` and are excluded from final source topology. [evidence: `scratch/` contains only baseline artifacts — `foundations-files.before.txt`, `audit-files.before.txt`, `styles.sha256.before`, `foundations.sha256.before`, `audit.sha256.before`, `routing.sha256.before`, `benchmark-before/` — none included in final source topology]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 8/25 |
| P1 Items | 16 | 3/16 |
| P2 Items | 8 | 2/8 |

Several unverified/N-A items are not simple gaps — they are requirements the ADR-002 retirement decision intentionally supersedes (e.g. CHK-021/022/024/FIX-003/FIX-004/141/143). See each item's bracketed note for the specific reason.

**Verification Date**: Pending — three gates remain unrun: styles SHA-256 equality (CHK-121), the design benchmark suite (CHK-026 partial), and `validate.sh --strict` (orchestrator runs after this reconciliation pass).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ~~All architecture decisions in `decision-record.md` are Accepted.~~ [N/A as literally written: ADR-001 is Superseded by ADR-002, not "Accepted" — expected decision-record hygiene, not a defect. ADR-002 itself is Accepted]
- [ ] CHK-101 [P0] ~~Permanent command ownership is distinct from top-level mode identity.~~ [N/A: the commandSubworkflow ownership concept is deleted (ADR-002); the 3 retained commands map directly to their owning modes with no separate ownership layer]
- [ ] CHK-102 [P1] Standalone audit, shared-procedure flattening, temporary aliasing, and styles migration alternatives remain rejected. [needs re-review against ADR-002's alternatives table — not re-verified in this pass]
- [ ] CHK-103 [P2] Final topology diagram matches authored and generated source. [not evidenced in this pass]
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] No new process, query, hydration, or routing pass is introduced. [not explicitly checked; the change is deletion/consolidation-only]
- [x] CHK-111 [P1] Relevant test durations and baseline deltas are recorded. [evidence: gate evidence table in `implementation-summary.md` records baseline -> final for 6 gates]
- [x] CHK-112 [P2] Additional load testing is deferred unless existing gates expose a regression. [evidence: no regression signal from any gate run — see gate table]
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] File-scoped rollback is executable from the recorded Git/manifests without touching unrelated changes. [not tested in this pass]
- [ ] CHK-121 [P0] All 7,812 tracked styles files have identical pre/post SHA-256 values. [NOT run — baseline captured (`scratch/styles.sha256.before`); final equality pending, orchestrator runs this after this reconciliation pass]
- [ ] CHK-122 [P1] No feature flag is required for repository-local topology consolidation. [not explicitly evidenced]
- [ ] CHK-123 [P2] No external deployment runbook is required. [not explicitly evidenced]
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security and executable-path preservation review is complete.
- [ ] CHK-131 [P1] No dependency or license change is introduced.
- [ ] CHK-132 [P2] OWASP review is not applicable to repository-local routing topology.
- [ ] CHK-133 [P2] Existing local data handling remains unchanged.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All packet, hub, command, and generated routing documents are synchronized. [not evidenced in this pass — this reconciliation covers only the spec-doc surface, not hub/command docs]
- [ ] CHK-141 [P1] ~~Public command contracts document permanent subworkflow routing.~~ [N/A: subworkflow routing is deleted (ADR-002); the 3 remaining commands (`/interface:design`, `/interface:motion`, `/interface:design-reference`) map directly to modes]
- [ ] CHK-142 [P2] No visual user-facing documentation change is required. [not evidenced]
- [ ] CHK-143 [P2] ~~Relocated READMEs and contracts preserve knowledge transfer.~~ [N/A: audit/foundations READMEs and `contract.md` were deleted, not preserved (ADR-002) — judged ceremony rather than needed history]
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Automated package and contract gates | Technical verification | Pending | |
| SpecKit strict validator | Documentation verification | Pending | |
<!-- /ANCHOR:sign-off -->
