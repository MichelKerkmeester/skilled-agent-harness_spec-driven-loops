---
title: "Feature Specification: Phase 025 - PB-002 Advisor and Audit-Bundle Fix"
description: "Fixes PB-002's two confirmed defects (advisor probe losing to sk-code, live dispatch bundling audit+foundations instead of pure foundations) plus 4 independent fresh-audit findings; both PB-002 halves re-verified via the live daemon path."
trigger_phrases:
  - "phase 025 sk-design"
  - "PB-002 advisor fix"
  - "audit foundations bundle fix"
  - "sk-design fresh audit remediation"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/025-pb002-advisor-and-audit-bundle-fix"
    last_updated_at: "2026-07-07T21:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec.md after confirming PB-002 fix via live daemon"
    next_safe_action: "Run validate.sh --strict, then commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pb002-advisor-fix-025"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 025 - PB-002 Advisor and Audit-Bundle Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A fresh, independent Opus-max audit of sk-design's parent hub and all 6 subskills (dispatched after phase 024 closed its 8 bugs) cross-referenced the manual-testing playbook's remaining never-fixed items and confirmed `PB-002` still had two real, live defects: the advisor probe loses `sk-design` top-1 to `sk-code` for a design-scoped review prompt, and the live dispatch resolves a bundled `audit`+`foundations` instead of pure `foundations`, contradicting `sk-design/SKILL.md`'s own Mode Vocabulary Guardrails rule about which mode owns review framing. The same audit also surfaced 4 independent, verified-real defects unrelated to any single scenario (mislabeled `family` front-matter, a nonexistent-command doc bug, a prompt mismatch between the playbook index and a feature file) plus 1 confirmed-real improvement that needed an explicit operator decision (Open Design RUN side-effect risk).

### Purpose

Fix PB-002's two defects at their actual root cause — not the same root cause the original phase-023 evidence implied, since PB-002's advisor-probe fix required discovering and targeting the correct scoring backend (the native skill-advisor daemon, not the Python CLI's local fallback, which is what the live dispatch actually consults) — and apply the 4 fix-now findings plus document the accepted operator decision, closing out the fresh audit's actionable scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fix PB-002's advisor-probe defect (design-scoped review prompt loses to `sk-code`).
- Fix PB-002's mode-resolution defect (`audit`+`foundations` bundle instead of pure `foundations`).
- Re-verify both fixes via the live daemon path (the scoring backend real dispatches actually use), plus a regression sweep against `AI-002` and `AI-004`.
- Apply the 4 confirmed "fix-now" findings from the fresh audit: 3 mode packets' `family: sk-code` mislabel, `command-metadata.json`'s nonexistent-sibling-command doc bug, `FR-001`'s index-vs-feature-file prompt mismatch.
- Document the operator's accepted-risk decision on the Open Design RUN side effect directly in `design-mcp-open-design/SKILL.md`.
- Update `verdict-matrix.md` with PB-002's fix, the fresh audit's findings, and two newly-surfaced items that need separate future attention.

### Out of Scope

- `MR-004`'s live-daemon-path failure (`sk-code` 0.8719 top-1 over `sk-design` 0.8507), discovered during this phase's own regression sweep — a genuine logic-sync conflict against the fresh audit's REFUTED verdict for the same scenario (which tested a different, unavailable-at-the-time scoring backend). Flagged in `verdict-matrix.md`, not fixed here — this phase's mandate was PB-002 only, and MR-004 needs its own root-cause investigation against the daemon path specifically.
- `skill_advisor.py`'s pre-existing `"design review"` bare-keyword-in-negation bug (`AI-004`'s standalone-CLI-probe misroute) — confirmed pre-existing via `git stash`, confirmed the live daemon path (what real dispatches use) is unaffected. Low priority, not fixed here.
- The 2 "improvement, fix-now" findings the operator explicitly declined this round (parent version-number alignment across `mode-registry.json`/`hub-router.json`/changelog; the transform-verb-precedence doc-symmetry gap for `excludedAliases.audit`).
- `PB-006`, `PB-007`, `FR-001`'s behavioral-variance PARTIALs — the fresh audit judged these accept-as-is (no file defect), confirmed not touched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Edit | `PHRASE_INTENT_BOOSTERS` design-scoped review phrases (fixes the local-fallback path only, an intermediate/partial step) |
| `.opencode/skills/sk-design/graph-metadata.json` | Edit | `intent_signals`/`derived.trigger_phrases` design-scoped review/proof-gate phrases (the fix that actually closes the live-daemon-path defect, since the daemon reads this file and picks up edits live via its file watcher) |
| `.opencode/skills/sk-design/description.json` | Edit | `keywords` sync (confirmed inert for the daemon-scorer routing path — not consulted by it — kept only for catalog-listing consistency) |
| `.opencode/skills/sk-design/SKILL.md` | Edit | Mode Vocabulary Guardrails `audit` bullet: new "single-axis static review" exception; version bump |
| `.opencode/skills/sk-design/design-foundations/SKILL.md` | Edit | `family: sk-code` → `family: sk-design` |
| `.opencode/skills/sk-design/design-motion/SKILL.md` | Edit | `family: sk-code` → `family: sk-design` |
| `.opencode/skills/sk-design/design-audit/SKILL.md` | Edit | `family: sk-code` → `family: sk-design` |
| `.opencode/skills/sk-design/command-metadata.json` | Edit | 5 `preferSiblingWhen` entries reworded to stop presenting the nonexistent `/design:design-mcp-open-design` command |
| `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md` | Edit | `FR-001`'s index prompt synced to the (authoritative) feature-file prompt |
| `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md` | Edit | ALWAYS #4 extended to document the operator's accepted-risk decision on live `start_run` side effects |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/023-full-manual-playbook-execution/verdict-matrix.md` | Edit | PB-002 fix, fresh-audit findings, MR-004 logic-sync flag, AI-004 pre-existing-bug note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | PB-002's advisor-probe defect is fixed against the ACTUAL scoring backend live dispatches use | `sk-design` top-1 ≥ 0.80 confirmed via the live daemon path (not the standalone CLI's local fallback) |
| REQ-002 | PB-002's mode-resolution defect is fixed | Live dispatch resolves pure `foundations`, no `audit` bundling, procedure card cited, confirmed/inferred separated, proof-required section present, no mutating tool |
| REQ-003 | Zero regression on `AI-002`/`AI-004` | Both stay `sk-code` top-1 via the live daemon path after the fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | 4 confirmed fix-now findings applied | Family mislabel (3 files), sibling-command doc bug, `FR-001` prompt sync all applied and spot-checked |
| REQ-005 | Operator decision on the Open Design RUN risk is documented in the source skill, not just in phase docs | `design-mcp-open-design/SKILL.md` ALWAYS #4 carries the accepted-risk rationale |
| REQ-006 | New conflicting evidence (MR-004 logic-sync) and the pre-existing AI-004 bug are surfaced, not silently absorbed | Both documented in `verdict-matrix.md` and this phase's `implementation-summary.md` with enough evidence for a future session to act on them |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the two fixes are applied, **Then** PB-002 is confirmed PASS via the live daemon path across both its advisor and mode-resolution halves.
- **SC-002**: **Given** the regression sweep runs, **Then** `AI-002` and `AI-004` both stay correctly routed to `sk-code`, unaffected by the new design-scoped phrases.
- **SC-003**: **Given** the 4 fix-now findings are applied, **Then** each is spot-checked against its own cited evidence (JSON validity, front-matter field, prompt text match).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The advisor-daemon has two independent scoring paths (Python CLI local-fallback vs. native TS daemon), and a fix to one does not reach the other | Confirmed | First fix attempt (Python `PHRASE_INTENT_BOOSTERS`) only reached the local fallback; root-caused via direct empirical daemon testing and fixed at the correct layer (`graph-metadata.json`, which the daemon's file watcher picks up live, no restart needed) |
| Risk | The daemon's live/down state is itself intermittent, so the SAME prompt can score differently across two test sessions depending on daemon availability | Confirmed, unresolved | Directly caused this phase's MR-004 logic-sync discovery; flagged explicitly rather than silently reconciled, since neither prior test was wrong — they hit different backends |
| Dependency | The fresh Opus-max audit (workflow run, not yet a formal phase) that supplied this phase's PB-002 root-cause evidence and the 4 independent fix-now findings | High | This phase implements a subset of that audit's dispositions; the audit's own findings/verify output is the evidentiary source, referenced but not separately re-authored as a spec doc |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `MR-004`'s live-daemon-path failure needs its own investigation and is NOT resolved by this phase — see verdict-matrix.md's logic-sync flag. Whether to open a phase 026 for it is an operator call, not decided here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: This phase's discovery that `description.json`'s `keywords` field is inert for the native daemon-scorer routing path (confirmed via direct source-code grep of the daemon's indexer) is durable knowledge for any future sk-design advisor-routing fix — target `graph-metadata.json`'s `intent_signals`/`derived.trigger_phrases` for the live daemon path, and `skill_advisor.py`'s `PHRASE_INTENT_BOOSTERS` separately for the standalone CLI's local-fallback path; fixing only one leaves the other broken.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- The skill-advisor daemon's chokidar file watcher picks up `graph-metadata.json` edits live (debounced ~2-3s, no restart) but does NOT watch `description.json` — confirmed by reading `derived.key_files` (only lists `SKILL.md`, `mode-registry.json` for sk-design) and by direct source grep of the daemon's indexer.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 11 files edited; one scenario's two-halved fix plus 4 independent small fixes |
| Risk | 5/25 | Doc/prose + JSON metadata + one scorer-weight-table edit; no runtime logic touched |
| Research | 10/20 | Required discovering and empirically distinguishing two independent advisor-scoring backends (local-fallback vs. native daemon) neither prior session had fully separated |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None - see section 7.

---

## RELATED DOCUMENTS

- **Predecessor Phase**: `../024-manual-playbook-bug-remediation/` (the prior remediation round; this phase's PB-002 fix follows the same fix-then-live-verify discipline)
- **Evidence Source**: The fresh Opus-max audit workflow run (referenced in `verdict-matrix.md`'s "Fresh audit" section) — its findings/verify JSON is the evidentiary basis for this phase's scope, not separately re-authored here
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
