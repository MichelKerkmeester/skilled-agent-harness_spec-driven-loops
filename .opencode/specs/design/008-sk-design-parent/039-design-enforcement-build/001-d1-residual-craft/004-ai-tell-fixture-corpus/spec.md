---
title: "Feature Specification: AI-Tell Fixture Corpus and Detection Benchmark"
description: "The AI-tell registry names a fixture_id per tell but no fixture files exist, so per-tell detection cannot run and the playbook scenario has no fixtures or expected counts. This lands the corpus, a deterministic detection benchmark, a fixture-existence parity gate, and an additive playbook extension."
trigger_phrases:
  - "d1-r4 ai tell fixtures"
  - "ai tell fixture corpus design build"
  - "ai fingerprint fixture detection"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/004-ai-tell-fixture-corpus"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record detection-now vs catalog-exhaustive-advisory split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is per-tell detection runnable now: yes on curated fixtures; catalog exhaustiveness stays advisory"
      - "Did the D1-R3 fixture_id forward dependency close: yes, every registry fixture_id now resolves to real files"
---
# Feature Specification: AI-Tell Fixture Corpus and Detection Benchmark

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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `004-ai-tell-fixture-corpus` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The just-landed AI-tell registry (`design-audit/assets/ai_fingerprint_registry.json`, D1-R3) carries one `fixture_id` slug per tell, but the fixture files those slugs name do not exist. The binding is therefore presence-and-format only: per-tell detection cannot be run or proven, and nothing fails when a tell is undetectable. The slop-hardening playbook scenario (`03--slop-hardening/ai-fingerprint-tells.md`, AUDIT-SLOP-002) likewise has no fixture corpus and no expected counts, so tell detection is asserted by prose rather than measured against known positives and negatives.

### Purpose
Land the fixture corpus so every registry `fixture_id` resolves to real files, add a deterministic detection benchmark that proves each positive fires exactly its own tell ID with no off-family false positives, extend the parity checker from `fixture_id` presence/format to file existence, and extend the playbook scenario additively with a fixture-backed shape and expected counts. This closes the D1-R3 forward dependency and makes per-tell detection runnable and machine-checked instead of advisory prose.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A fixtures root `design-audit/assets/ai_fingerprint_fixtures/` with one directory per registry `fixture_id` (9 dirs: 5 codex, 1 gemini, 3 general), each holding `clean.html` (faithful, fires no tell) and `tell.html` (minimal positive, fires exactly its own tell), plus one content-first corpus `README.md`.
- A new detection runner `shared/scripts/ai-fingerprint-fixture-check.mjs` with one precise content matcher per registry tell ID, each derived from that row's `deterministic_check`.
- A file-existence extension to `shared/scripts/ai-fingerprint-registry-check.mjs`, keeping the current `fixture_id` presence/format checks.
- An additive edit to the playbook scenario `design-audit/manual_testing_playbook/03--slop-hardening/ai-fingerprint-tells.md` (AUDIT-SLOP-002), route-stable.

### Out of Scope
- Proving the catalog is exhaustive, or that a new real-world output exhibits a tell. The corpus proves the matchers work on curated samples, not that the tell set is complete; that judgment stays advisory.
- Changing the playbook scenario route. The prompt, `expected_intent`, and `expected_resources` are frozen; only additive content is added.
- Touching the registry rows, the prose catalog, or the hubRoute scorer fixtures.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-audit/assets/ai_fingerprint_fixtures/<fixture_id>/{clean,tell}.html` | Create | 9 fixture dirs, 18 samples; each `tell.html` fires exactly its tell, each `clean.html` fires none |
| `sk-design/design-audit/assets/ai_fingerprint_fixtures/README.md` | Create | Content-first corpus map: fixture to tell, family, and clean-vs-tell contract |
| `sk-design/shared/scripts/ai-fingerprint-fixture-check.mjs` | Create | Registry-first detection runner, one precise matcher per tell ID |
| `sk-design/shared/scripts/ai-fingerprint-registry-check.mjs` | Modify | Extend from `fixture_id` presence/format to fixture-dir + `clean.html` + `tell.html` existence |
| `sk-design/design-audit/manual_testing_playbook/03--slop-hardening/ai-fingerprint-tells.md` | Modify | Additive fixture-backed scenario + corpus pointer; route unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every registry `fixture_id` resolves to a fixture directory holding both `clean.html` and `tell.html` | `ai-fingerprint-registry-check.mjs` exits 0 with all 9 fixture dirs present, and bites (exit 1) when a fixture dir is hidden or missing |
| REQ-002 | The detection benchmark asserts each positive fires exactly its own tell ID and each clean fires none, deterministically | `ai-fingerprint-fixture-check.mjs` exits 0 (`registryRows=9 samples=18`); a `tell.html` that stops firing its tell yields exit 1 naming `<fixture_id>/tell.html: expected [<tell_id>], got [...]` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The playbook extension is additive and route-stable | 0 prose lines removed; prompt, `expected_intent`, `expected_resources` unchanged; hubRoute holds 23 pass / 5 known-gap / 0 regression |
| REQ-004 | Fixtures and runners are evergreen | No spec, packet, or dimension IDs and no spec paths in any fixture, the corpus README, or either runner; `node --check` clean on both `.mjs` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The detection benchmark passes at exit 0 over the full corpus (9 positives fire exactly their tell, 9 cleans fire none, 0 off-family false positives), and bites at exit 1 when a matcher's `tell.html` is mutated to stop firing. The matchers are precise content checks, not loose substring scans.
- **SC-002**: Every registry `fixture_id` resolves to real files (existence gate green and biting on a missing dir), the playbook edit is additive and route-stable with hubRoute held at 23/5/0, and the corpus plus runners stay evergreen with no ID or path leakage.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Detection is runnable now on curated fixtures, but the catalog is not proven exhaustive; a new real-world output exhibiting a tell stays a judgment call | Med | Scope the gate honestly: the corpus proves the matchers fire on known positives and stay silent on near-twin cleans; catalog exhaustiveness is recorded as advisory |
| Risk | A loose matcher could fire on the wrong fixture and mask a real miss | Med | Each `deterministic_check` becomes one precise content matcher (for example ghost-card requires a CSS block with a 1px solid border AND box-shadow blur >=16px); the benchmark fails on any off-family fire |
| Risk | The playbook edit regresses a hubRoute route | Med | Keep the edit additive and off-corpus (fixtures live under `assets/`); capture the hubRoute baseline before and re-run after, requiring zero regression |
| Dependency | D1-R3 registry (`ai_fingerprint_registry.json`, 9 rows with `fixture_id` + `deterministic_check`) | Closed | The registry `fixture_id` slugs named these fixtures forward; this phase lands the files, closing that forward dependency |
| Dependency | Playbook `ai-fingerprint-tells.md` (denumbered, AUDIT-SLOP-002) | Green | spec and research cite a stale `001-ai-fingerprint-tells.md` path; the real target is the denumbered file. Edit by stable slug, never line number |
| Dependency | hubRoute / skill-benchmark scorer over the sk-design corpus | Green | No-regression invariant for the playbook edit cannot be proven without it |
| Dependency | Node ESM runtime | Green | Detection runner and parity checker cannot run without it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The detection runner scans 18 small static samples and reads one registry file; it completes in well under a second with linear scans and no external dependency.

### Security
- **NFR-S01**: Both runners read only fixture text and the registry; no network, no shell-out, no process-wide state.

### Reliability
- **NFR-R01**: The benchmark is deterministic: identical fixtures and registry yield identical exit code and output across runs, with sync after any fixture mutation so exit codes are read without pipe-masking.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing fixture dir or sample: a registry `fixture_id` with no directory, or a directory missing `clean.html` or `tell.html`, fails the existence gate at exit 1.
- Off-family fire: a fixture firing a tell from another model family fails the benchmark; the off-family count must stay 0.
- Silent clean: any `clean.html` that fires a tell fails the benchmark.

### Error Scenarios
- Mutated `tell.html`: a positive that no longer fires its own tell yields exit 1 naming `<fixture_id>/tell.html: expected [<tell_id>], got [...]`.
- Unreadable registry or invalid JSON: runtime error at non-zero exit.

### State Transitions
- Registry growth: a new registry row without its fixture dir fails the existence gate, forcing the corpus to keep pace with the catalog.
- Matcher drift: a matcher loosened to a substring scan is caught when an off-family fixture fires the wrong tell.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | 18 fixture samples + corpus README + one new runner + one runner extension + one additive playbook edit |
| Risk | 7/25 | Additive and off-corpus, reversible by deletion, with the catalog-exhaustiveness boundary recorded honestly |
| Research | 7/20 | Deriving one precise content matcher per `deterministic_check` and authoring near-twin clean fixtures that do not trip it |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The split is deliberate: per-tell detection is code-enforced now on curated fixtures, but the catalog is not proven exhaustive and whether a new real-world output exhibits a tell stays advisory. Should a later phase add a corpus-coverage audit that flags registry tells whose fixtures drift from real generator output?
- The detection runner is runnable but not yet wired into a build or delivery gate. Should `ai-fingerprint-fixture-check.mjs` join `ai-fingerprint-registry-check.mjs` in a standing pre-delivery check so a broken matcher fails closed in CI rather than on demand?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
