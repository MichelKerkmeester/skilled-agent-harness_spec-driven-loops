---
title: "Feature Specification: Markdown-Link Integrity Guard [133/007-link-integrity-guard/spec]"
description: "A repo-wide markdown-link integrity guard (check-markdown-links.cjs) wired into CI so a deleted or moved target whose referrer survives fails the PR — closing the gap that let the 295-link debt accumulate silently."
trigger_phrases:
  - "markdown link integrity guard"
  - "broken link CI check skills commands agents"
  - "133 phase 007 link guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/013-catalog-playbook-snippet-denumbering/007-link-integrity-guard"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built check-markdown-links.cjs + CI workflow; green on current tree"
    next_safe_action: "Validate packet and commit/push"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Markdown-Link Integrity Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 (prevents recurrence of the debt the review cleaned up) |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review found 295 broken markdown links across skills/commands/agents because feature removal/migration/deprecation edits deleted snippet files or moved targets without updating the hand-maintained `feature_catalog.md` / `manual_testing_playbook.md` roots and other cross-references — and nothing failed, so the debt accumulated silently. Existing checks do not cover this: `scripts/check-links.sh` validates only wikilinks (`[[...]]`), is opt-in, and is not CI-wired; `rules/check-phase-links.sh` only checks phase folders.

### Purpose
Add a repo-wide markdown-link (`](path)`) integrity guard, wired into CI, so a future deleted/moved target whose referrer survives **fails the PR** instead of silently rotting.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `check-markdown-links.cjs`: whole-repo resolver over active skills/commands/agents docs; dual-base resolution (file dir OR repo root), fenced-code strip, `%20` decode; exit 1 on any non-excluded broken markdown link.
- Narrow exclusions: dir-skips for `/changelog/` and `/tests/fixtures/`; a small `(file, ref)` allowlist for the intentional template fill-ins + one illustrative example.
- CI workflow `markdown-link-integrity.yml` running the guard on PRs that touch the doc trees.

### Out of Scope
- Wikilinks (`[[...]]`) — already covered by `check-links.sh`.
- Anchor (`#heading`) existence and semantic link correctness.
- Backtick prose paths (inherently noisy; not real links).
- Whole-directory skips of `sk-doc/assets/**` or `sk-code/references/**` (would blind the guard to real breakage).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` | Create | The guard (resolver + exclusions + allowlist) |
| `.github/workflows/markdown-link-integrity.yml` | Create | CI gate that runs the guard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Green on the current tree | `node check-markdown-links.cjs` exits 0, reports 0 broken |
| REQ-002 | Fails on a new broken markdown link | injecting `](does-not-exist.md)` in a scanned doc gives exit 1 naming it |
| REQ-003 | Whole-repo scan (not changed-files) | a deleted target breaking an unchanged referrer is still caught |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | CI-wired on PRs touching doc trees | workflow present, mirrors existing gates, sets up Node and runs guard |
| REQ-005 | Allowlist is narrow (per file+ref) | a new broken link inside an allowlisted template file still fails |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Guard is green now and fails on injected breakage (both verified).
- **SC-002**: CI workflow runs the guard on relevant PRs and blocks on broken links.
- **SC-003**: Intentional placeholders/fixtures/examples do not trip the guard.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Allowlist drifts as templates change | Low | Keyed by (file, ref); a new placeholder is a one-line add surfaced by a failing run |
| Risk | Node-in-CI deviates from the bash/python3 house gates | Low | Justified: reuses the validated resolver instead of a re-port; python3 port is the fallback |
| Dependency | The validated resolver in `review/baseline/link-audit.cjs` | Source | Guard logic lifted from it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Deterministic; node stdlib only (`fs`/`path`); no network, no npm deps.

### Security
- **NFR-S01**: Read-only filesystem walk; touches no secrets.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A link is valid if it resolves against the source file dir OR the repo root (both conventions used in-repo).
- `%20`-encoded spaces are decoded before existence checks.

### Error Scenarios
- Fenced code blocks are stripped so code like `](target)` is not mistaken for a link.
- Template fill-in placeholders (`reference-name.md`, etc.) and a deliberate test fixture are allowlisted/excluded, not "fixed".
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One guard script + one workflow |
| Risk | 6/25 | Low; read-only; verified green + catching |
| Research | 6/20 | CI/rules conventions mapped by exploration |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Node-in-CI (setup-node) chosen over a python3 re-port to reuse the validated resolver.
<!-- /ANCHOR:questions -->
