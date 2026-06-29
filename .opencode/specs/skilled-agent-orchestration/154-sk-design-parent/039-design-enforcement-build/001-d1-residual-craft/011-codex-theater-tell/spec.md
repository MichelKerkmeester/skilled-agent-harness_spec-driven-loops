---
title: "Feature Specification: Codex Theater / Meta-Criticism Copy Tell"
description: "The Codex theater/meta-criticism copy tell was missing from the AI-fingerprint catalog, so copy that narrates its own importance ('design theater', 'engagement theater') went unflagged. This adds the tenth tell end-to-end — catalog entry, registry row, clean+tell fixture, and the first copy-scanning matcher — keeping both checkers green at 10=10 while a live hit stays advisory."
trigger_phrases:
  - "d1-r11 codex theater tell"
  - "codex theater tell design build"
  - "ai fingerprint theater meta criticism"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/011-codex-theater-tell"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record matcher-vs-advisory split and off-family-safety invariant"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The spec named only the catalog plus a fixture; the checkers' parity rules expand that to four reconciled artifacts, which is the faithful acceptance reading, not scope drift"
      - "The matcher gates deterministically while the catalog labels a live hit advisory, because the copy scan false-positives on movie/home theater"
---
# Feature Specification: Codex Theater / Meta-Criticism Copy Tell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `011-codex-theater-tell` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The AI-fingerprint catalog at `ai_fingerprint_tells.md` carried nine tells but not the Codex "theater / meta-criticism copy" tell — the slop habit of copy that narrates its own importance by calling a surface a kind of theater ("design theater", "engagement theater") instead of naming concrete user harm. Impeccable's record names this as a recurring Codex tell, yet the live catalog never flagged it. The catalog could not grow this tell in isolation: `ai-fingerprint-registry-check.mjs` enforces a strict one-to-one binding between catalog tells and registry rows, and the spec's own acceptance ("the fixture check fires on the positive and not on the negative") is only reachable through the registry-driven `ai-fingerprint-fixture-check.mjs`, which needs a registry row, a fixture directory, and a matcher.

### Purpose
Close the gap by adding the theater tell as one reconciled set of four artifacts that land together: a catalog entry, a registry row, a clean+tell fixture pair, and a copy-scanning matcher. The matcher is the first text/copy detector in the corpus — the nine existing matchers all scan CSS structure, while this one scans visible body copy for `\b(\w+)\s+theater\b`. The gate is deterministic so the fixture check is repeatable, but the catalog labels a live hit advisory: a `<word> theater` match is flag-and-confirm because it false-positives on legitimate copy like "movie theater" and "home theater". The change is additive — the nine existing tells, fixtures, and matchers stay untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `### 2.6 Theater / meta-criticism copy` entry under `## 2. CODEX TELLS` in `ai_fingerprint_tells.md`, with a Check / Owner / Severity block and an explicit advisory false-positive note.
- The tenth row in `ai_fingerprint_registry.json`, reconciled to the catalog slug, carrying exactly the seven required fields with `model_family: codex` and `severity_floor: P2`.
- A new fixture directory `ai_fingerprint_fixtures/ai-fingerprint-theater-meta-criticism-copy/` holding a `tell.html` that fires only the theater tell and a `clean.html` that fires nothing.
- The tenth `CHECK_MATCHERS` entry plus `matchesTheaterMetaCriticism` in `ai-fingerprint-fixture-check.mjs` — the first copy/text matcher, scanning visible body copy for `\b(\w+)\s+theater\b`.
- Two consistency mirrors (fix-completeness, not checker-gated): a self-audit prompt in `ai_fingerprint_self_defect_card.md` and the tenth corpus-map row in `ai_fingerprint_fixtures/README.md`.

### Out of Scope
- Any change to the nine existing tells, fixtures, or matchers; any edit to `ai-fingerprint-registry-check.mjs` (data-driven, needs no code change).
- The hubRoute / skill-benchmark scorer, the router, or its fixtures — the AI-fingerprint fixtures are off the hubRoute corpus, so the scorer holds its baseline without a change.
- Promoting a live theater hit to an automatic high-severity finding; the copy scan stays advisory and flag-and-confirm.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-audit/references/ai_fingerprint_tells.md` | Modify | Add `### 2.6 Theater / meta-criticism copy` under `## 2. CODEX TELLS` with Check / Owner / Severity and the advisory false-positive note |
| `sk-design/design-audit/assets/ai_fingerprint_registry.json` | Modify | Add the tenth row reconciled to the catalog slug, seven required fields, `model_family: codex`, `severity_floor: P2` |
| `sk-design/design-audit/assets/ai_fingerprint_fixtures/ai-fingerprint-theater-meta-criticism-copy/` | Create | `tell.html` (fires only theater) + `clean.html` (fires nothing) |
| `sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs` | Modify | Add the tenth matcher entry + `matchesTheaterMetaCriticism`, the first copy/text matcher |
| `sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md` | Modify | Add the `theater-meta-criticism-copy` self-audit prompt under `## Codex` (mirror) |
| `sk-design/design-audit/assets/ai_fingerprint_fixtures/README.md` | Modify | Add the tenth corpus-map row (mirror) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The catalog carries the theater tell reconciled to a tenth registry row | `ai-fingerprint-registry-check.mjs` exits 0 reporting `catalogTells=10 registryRows=10` with no "missing registry row" / "no matching catalog tell" |
| REQ-002 | A fixture pair proves deterministic detection | `ai-fingerprint-fixture-check.mjs` exits 0 reporting `registryRows=10 samples=20 matcherCount=10`; `tell.html` fires `[theater-meta-criticism-copy]`, `clean.html` fires `[]` |
| REQ-003 | The matcher is the first copy/text detector and is narrow | `matchesTheaterMetaCriticism` scans visible body copy for `\b(\w+)\s+theater\b`; zero off-family false positives in either direction across all twenty samples |
| REQ-004 | Slug and check-string parity hold across all four artifacts | `tell_id`, the matcher `tellId`, and the `fixture_id` (prefixed) agree; the normalized `deterministic_check` equals the matcher map key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A live hit stays advisory in the catalog while the gate stays deterministic | The catalog entry states the `<word> theater` false-positive caveat ("movie theater", "home theater") and flag-and-confirm handling; the matcher still fires deterministically for the fixture gate |
| REQ-006 | Additive, evergreen, and scope-clean | Only the six fingerprint artifacts change; the registry checker needs no edit; no spec/packet/dimension IDs or `specs/` paths in any touched asset; the hubRoute scorer holds `23/5/0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both checkers pass at ten rows, verified independently without pipe-masking — registry `catalogTells=10 registryRows=10` (exit 0), fixture `registryRows=10 samples=20 matcherCount=10` (exit 0).
- **SC-002**: Detection is real and bites: `tell.html` fires `[theater-meta-criticism-copy]` and `clean.html` fires `[]`; removing the registry row fails the registry checker (exit 1) and blanking `tell.html` fails the fixture checker (exit 1, `FAIL fixture-scan`).
- **SC-003**: The matcher is the first copy/text detector with zero off-family cross-fires both ways; the slug agrees across catalog/registry/matcher/fixture; the registry JSON parses to ten rows; `node --check` passes on both `.mjs`; hubRoute holds `23/5/0`; the change set is exactly the six fingerprint artifacts.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gate is deterministic but a live theater hit is not real slop on its own | Med | Split stated honestly: the matcher fires deterministically so the fixture gate is repeatable, but the catalog labels a live hit advisory — a `<word> theater` match false-positives on "movie theater" / "home theater", so it is flag-and-confirm, never an automatic high-severity finding |
| Risk | A copy matcher could cross-fire on another tell's fixture, or a structural matcher could fire on the new copy fixture | Med | Off-family-safety invariant verified both ways: the theater matcher fires on none of the nine existing samples and the nine structural matchers fire on neither new fixture; the fixture checker reports zero off-family cross-fires across all twenty samples |
| Risk | The catalog tell and registry row could diverge, or the check-string could drift from the matcher key | Med | Slug agreement and byte-parity enforced: `tell_id` = matcher `tellId` = `fixture_id` (prefixed); the normalized `deterministic_check` equals the matcher map key; the registry checker fails on any divergence |
| Dependency | `ai-fingerprint-registry-check.mjs` (catalog↔registry bijection + per-row fixture existence) | Internal | Data-driven; needs no code change but must pass once the catalog, registry, and fixtures all carry the tenth entry |
| Dependency | `ai-fingerprint-fixture-check.mjs` (registry-driven matcher gate) | Internal | Hosts the tenth matcher; the spec's fire/no-fire acceptance runs through it |
| Dependency | hubRoute / skill-benchmark scorer over the sk-design corpus | Internal | The AI-fingerprint fixtures are off the hubRoute corpus, so the scorer holds `23/5/0` with delta 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The registry stays the single source of truth — one row binds a catalog tell, a fixture directory, and a matcher — so a future tell inherits the same four-artifact shape without a checker rewrite.

### Reliability
- **NFR-R01**: The theater matcher is deterministic: scanning the same `tell.html` returns the same fire on every run, and the fixture checker returns the same exit code for the same corpus.

### Integrity
- **NFR-I01**: The catalog carries no false trust signal: the entry scopes a live `<word> theater` hit as advisory and flag-and-confirm, so a deterministic fixture-gate pass never reads as a certainty that flagged copy is genuine slop.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `tell.html` carries a `<word> theater` meta-criticism phrase in visible body copy and otherwise uses plain, safe CSS that trips none of the nine structural matchers; `clean.html` is the near-twin whose copy avoids the pattern entirely.
- The matcher scans visible body text only (tags stripped), so a `theater` token inside a `<style>` block, an attribute, or a title does not fire it.

### Error Scenarios
- Blanking the theater phrase out of `tell.html` makes the fixture checker fail (exit 1, `FAIL fixture-scan`) — the positive must keep firing.
- Removing the tenth registry row makes the registry checker fail (exit 1) — catalog↔registry parity must hold at ten.

### State Transitions
- The four artifacts move together: catalog tell, registry row, fixture pair, and matcher all agree on the same slug and the same canonical check string, or one of the two checkers turns red.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Six reconciled artifacts (catalog, registry, fixture pair, matcher, two mirrors) but each additive and small |
| Risk | 7/25 | Additive and reversible; the only novel risk is the first copy matcher cross-firing, mitigated by the both-ways off-family check |
| Research | 6/20 | Reading the two checker scripts' parity rules, the nine existing matchers, and impeccable's theater-tell record |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where does the deterministic-matcher vs advisory-live-hit split land? The matcher is deterministic for the gate: it fires on `tell.html`, stays silent on `clean.html`, and returns the same answer every run, so the fixture checker is repeatable and the parity invariants are grep-checkable. A live `<word> theater` hit in a real surface, by contrast, is advisory — the copy scan false-positives on legitimate phrasing ("movie theater", "home theater"), so the catalog labels it flag-and-confirm rather than an automatic high-severity finding. That honesty lives in the catalog entry, not hidden in the matcher; the gate certifies detection, never taste.
- Is the off-family-safety invariant proven both ways? Yes, and it is recorded here because the theater matcher is the first copy/text detector among nine CSS-structural ones, so cross-fire was the real novelty risk. The fixture checker confirms the theater matcher fires on none of the nine existing samples and the nine structural matchers fire on neither new fixture, so the off-family cross-fire count is zero in either direction across all twenty samples.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
