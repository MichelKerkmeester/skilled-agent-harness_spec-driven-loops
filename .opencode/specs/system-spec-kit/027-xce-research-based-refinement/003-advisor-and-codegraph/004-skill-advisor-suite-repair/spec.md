---
title: "Feature Specification: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor [template:level_2/spec.md]"
description: "The system-skill-advisor vitest suite had 61 pre-existing failures from the deep-loop-workflows skill merge plus 15 brief-assertion failures introduced by the always-appended fable-5 governor line. This packet repairs both so the package builds clean and the suite is green except for two evidenced out-of-scope clusters."
trigger_phrases:
  - "skill advisor test repair"
  - "deep-loop-workflows merge fallout"
  - "fable-5 governor brief"
  - "scorer rename tests"
  - "divergence ratchet ledger"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/004-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T16:20:19Z"
    last_updated_by: "opus-agent"
    recent_action: "Repaired 26 in-scope test failures; documented 36 out-of-scope failures with evidence"
    next_safe_action: "None — work complete; out-of-scope clusters tracked for owner of external skill metadata + local hook settings"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "027-003-004-skill-advisor-suite-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor

<!-- SPECKIT_LEVEL: 2 -->
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
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `system-skill-advisor/mcp_server` vitest suite reported 61 of 553 tests failing in the working tree. The dominant cause was the committed deep-loop merge (`ce9e313e7f`), which folded the five legacy deep-loop skills (`deep-context`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`) into one merged skill `deep-loop-workflows`, but left scorer fixtures, corpora, ledgers, the Python disambiguation layer, and the metadata-category allowlist still expecting the now-deleted legacy skill ids. Separately, an intentional `GOVERNOR_DIRECTIVE` capsule appended to every advisor brief in `lib/render.ts` broke ~15 brief-assertion tests that hard-coded the pre-governor brief string.

### Purpose
Make `npm run build` clean and the vitest suite green by fixing the deep-loop-merge fallout at the root and aligning the brief-assertion tests with the new governor line, without reverting the verified `render.ts` governor change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update scorer-rename fallout: native-scorer council test, intent-prompt corpus labels, parity baselines (61 to 62), CLI parity row, and the local-vs-native divergence ledger.
- Fix the Python `_apply_deep_research_disambiguation` so the margin contract targets the merged `deep-loop-workflows` id (legacy ids are gone) and update the corresponding Python compat assertions.
- Extend the metadata-category allowlist in `skill_graph_compiler.py` to recognize the `workflow` and `design` categories carried by `deep-loop-workflows` and `sk-interface-design`.
- Update the governor brief-assertion tests (renderer, brief-producer, claude/codex hook tests) to expect the appended fable-5 governor line.

### Out of Scope
- The `render.ts` `GOVERNOR_DIRECTIVE` itself — verified-correct, must not be reverted.
- `tests/hooks/settings-driven-invocation-parity.vitest.ts` (35 tests) — reads the gitignored machine-local `.claude/settings.local.json`, which holds only `permissions` here; the committed `.claude/settings.json` uses different command paths than the test's expected fragments. Both targets are outside `system-skill-advisor/**`.
- `tests/legacy/advisor-graph-health.vitest.ts` (1 test) — the 3 residual edge-symmetry asymmetries live in external skill metadata (`deep-loop-runtime`, `mcp-code-mode`, `sk-prompt`, `deep-loop-workflows` graph-metadata.json), outside this package and off-limits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `lib/render.ts` | (pre-existing) | Verified-correct governor capsule — NOT modified by this packet |
| `scripts/skill_advisor.py` | Modify | Disambiguation margin now targets merged `deep-loop-workflows` id |
| `scripts/skill_graph_compiler.py` | Modify | Allow `workflow` and `design` metadata categories |
| `tests/scorer/native-scorer.vitest.ts` | Modify | Council fixture/assertion uses merged id |
| `tests/scorer/fixtures/intent-prompt-corpus.ts` | Modify | Two `deep-ai-council` labels to `deep-loop-workflows` |
| `tests/parity/python-ts-parity.vitest.ts` | Modify | Re-baseline pythonCorrect/tsAlsoCorrect 61 to 62 |
| `tests/legacy/advisor-corpus-parity.vitest.ts` | Modify | Re-baseline pythonCorrect/hookPreserved 61 to 62 |
| `tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Regenerate divergence ledger from current scorer state |
| `tests/skill-advisor-cli-parity.vitest.ts` | Modify | Council parity row uses merged id |
| `tests/python/test_skill_advisor.py` | Modify | SA-011/SA-012 look up merged id |
| `tests/legacy/advisor-renderer.vitest.ts` | Modify | Expected brief includes governor line |
| `tests/legacy/advisor-brief-producer.vitest.ts` | Modify | Expected brief + token-cap assertion exclude governor suffix |
| `tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | Expected context includes governor line |
| `tests/hooks/codex-user-prompt-submit-hook.vitest.ts` | Modify | Expected context includes governor line |
| `tests/hooks/codex-prompt-wrapper.vitest.ts` | Modify | Expected context includes governor line |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `npm run build` is clean | tsc build exits 0 |
| REQ-002 | Deep-loop-merge scorer fallout fixed at the root | native-scorer, parity, corpus-parity, divergence-ratchet, lane-weight-sweep, cli-parity, python-compat tests pass |
| REQ-003 | Governor brief-assertion tests updated | renderer, brief-producer, claude/codex hook tests pass with the appended governor line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Out-of-scope failures proven and documented | settings-parity + graph-health remain failing with file:line evidence that the cause is outside `system-skill-advisor/**` |
| REQ-005 | No regressions introduced | Re-run shows 26 fewer failures and no newly-failing in-scope test |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: vitest failures drop from 61/553 to 36/553, with all 36 residuals confined to two evidenced out-of-scope files.
- **SC-002**: `npm run build` exits 0 and the verified `render.ts` governor remains untouched.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Python `skill_advisor.py` scorer (drives parity + compat tests) | Margin/ledger drift if scorer changes | Re-baseline against captured current scorer output, not memory |
| Risk | Re-baselining locked accuracy counts could mask a real regression | Med | Verified the +1 Python-correct row is a genuine merge improvement with 0 regressions and tsAlsoCorrect preserved |
| Risk | Divergence-ratchet ledger regeneration could approve real drift | Med | Preserved unchanged entries' original reason/date; only new/changed entries carry the merge re-baseline reason |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full vitest run completes within its existing ~150s budget; no new long-running tests added.
- **NFR-P02**: The Python-subprocess parity tests stay within their configured per-test timeouts (60s ratchet, 240s corpus-parity).

### Security
- **NFR-S01**: No change to the advisor's prompt-boundary sanitization in `render.ts`; the governor is a fixed constant, not prompt-derived.
- **NFR-S02**: No secrets or machine-local config committed; the gitignored `.claude/settings.local.json` is left untouched.

### Reliability
- **NFR-R01**: The divergence ledger remains an honest current-state baseline (resolved entries removed, new entries reasoned).
- **NFR-R02**: The launcher orphan-reaping test is a pre-existing parallel-execution flake (passes in isolation and on re-run); not introduced here.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: advisor brief returns null when no skill passes threshold — unchanged; governor is only appended to a non-null brief.
- Maximum length: the 120-token (480-char) cap governs the advisor portion only; the fixed governor capsule is appended in full afterward. Token-cap tests strip the suffix before measuring.
- Invalid format: instruction-shaped skill labels still suppress the brief before any governor append.

### Error Scenarios
- Python interpreter unavailable: the divergence-ratchet and parity tests fail loudly by design (CI gate), not silently skip.
- Legacy mid-migration ids: the disambiguation winner-resolver falls back to the legacy `deep-research`/`deep-review` id if the merged node is absent.
- Concurrent launcher tests: shared lease-file contention can flake the orphan-reaping test; it passes single-file.

### State Transitions
- Partial completion: not applicable — repair is atomic per test file.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 14 files, mostly test/fixture/baseline edits + 2 small source fixes |
| Risk | 12/25 | Re-baselining locked counts + regenerating a ratchet ledger require honesty discipline |
| Research | 14/20 | Root-causing 8 distinct failure clusters across scorer/Python/metadata/render |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Owner of `deep-loop-runtime` / `mcp-code-mode` / `sk-prompt` graph-metadata should add the reciprocal symmetry edges so `advisor-graph-health` can pass; out of scope here.
- Owner of the Claude hook wiring should reconcile the test's `dist/hooks/claude/*.js` expected fragments with the committed `settings.json` command paths; out of scope here.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
