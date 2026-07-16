---
title: "Feature Specification: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor"
description: "The system-skill-advisor vitest suite had 61 pre-existing failures from the deep-loop-workflows skill merge plus 15 brief-assertion failures introduced by the always-appended fable-5 governor line. This packet drives the suite to 0 failures: it first repaired the 26 scorer/governor failures, then retargeted the settings-parity test to the committed portable settings.json and added the missing reciprocal symmetry edges so graph-health passes."
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
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/002-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T16:20:19Z"
    last_updated_by: "opus-agent"
    recent_action: "Suite at 0 failures after settings-parity retarget and 3 reciprocal symmetry edges"
    next_safe_action: "None — work complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/parity/fixtures/local-native-approved-divergences.json"
    session_dedup:
      fingerprint: "sha256:b8537e78ba6609f837e65eee4fbebe6ae01f793b376e311d2b2bd6ff69b387a1"
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
The `system-skill-advisor/mcp_server` vitest suite reported 61 of 553 tests failing in the working tree. The dominant cause was the committed deep-loop merge (`ce9e313e7f`), which folded the five legacy deep-loop skills (`deep-context`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`) into one merged skill `deep-loop-workflows`, but left scorer fixtures, corpora, ledgers, the Python disambiguation layer, and the metadata-category allowlist still expecting the now-deleted legacy skill ids. Separately, an intentional `GOVERNOR_DIRECTIVE` capsule appended to every advisor brief in `lib/render.ts` broke ~15 brief-assertion tests that hard-coded the pre-governor brief string. After those 26 were fixed, 36 failures remained in two files: the settings-parity guard read the gitignored machine-local `.claude/settings.local.json` (which carries no hooks) instead of the committed `.claude/settings.json`, and the graph-health validator failed on three edge-symmetry asymmetries in external skill metadata.

### Purpose
Drive the full vitest suite to 0 failures with `npm run build` clean: fix the deep-loop-merge fallout at the root, align the brief-assertion tests with the new governor line without reverting the verified `render.ts` governor, retarget the settings-parity guard to the committed portable `settings.json` it should actually validate, and add the missing reciprocal symmetry edges to the three external skill graph-metadata files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Update scorer-rename fallout: native-scorer council test, intent-prompt corpus labels, parity baselines (61 to 62), CLI parity row, and the local-vs-native divergence ledger.
- Fix the Python `_apply_deep_research_disambiguation` so the margin contract targets the merged `deep-loop-workflows` id (legacy ids are gone) and update the corresponding Python compat assertions.
- Extend the metadata-category allowlist in `skill_graph_compiler.py` to recognize the `workflow` and `design` categories carried by `deep-loop-workflows` and `sk-design-interface`.
- Update the governor brief-assertion tests (renderer, brief-producer, claude/codex hook tests) to expect the appended fable-5 governor line.
- Retarget `tests/hooks/settings-driven-invocation-parity.vitest.ts` to validate the committed `.claude/settings.json` (the shared source of truth) instead of the gitignored machine-local `settings.local.json`, and relax only the machine-specific assertions to accept the committed portable command form while preserving every real-contract guard.
- Add the three missing reciprocal edges to external skill `graph-metadata.json` so `advisor-graph-health` (which runs `skill_graph_compiler.py --validate-only`) passes its symmetry gate.

### Out of Scope
- The `render.ts` `GOVERNOR_DIRECTIVE` itself — verified-correct, must not be reverted.
- Editing the actual hook wiring in `.claude/settings.json` beyond what a preserved test guard requires; the committed file already satisfied all preserved guards, so no config edit was needed.
- The gitignored `.claude/settings.local.json` — left untouched (machine-local override).
- The advisory WEIGHT-BAND / WEIGHT-PARITY warnings emitted by the graph validator — they do not gate validation; only the symmetry asymmetries were fixed.

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
| `tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modify | Read committed `settings.json`; accept portable `cd "${CLAUDE_PROJECT_DIR:-$PWD}"` + bare-node command form; preserve all real-contract guards |
| `../../../../deep-loop-runtime/graph-metadata.json` | Modify | Add reciprocal `prerequisite_for: deep-loop-workflows` |
| `../../../../mcp-code-mode/graph-metadata.json` | Modify | Add reciprocal `prerequisite_for: mcp-figma` |
| `../../../../deep-loop-workflows/graph-metadata.json` | Modify | Add reciprocal `siblings: sk-prompt` |
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
| REQ-006 | Settings-parity guard validates the committed source of truth | Test reads `.claude/settings.json`; all 41 assertions pass; every real-contract guard preserved |
| REQ-007 | Graph-health symmetry gate passes | `skill_graph_compiler.py --validate-only` exits 0 with `VALIDATION PASSED` and no SYMMETRY warnings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regressions introduced | Re-run shows 0 failures and no newly-failing test versus the 36-failed re-baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: vitest failures drop from 61/553 to 0/553 (61 to 36 in the first pass, then 36 to 0 in this extension).
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
| Risk | Reciprocal `prerequisite_for mcp-figma` weight (0.7, in band) differs from the existing source `depends_on` weight (0.45, out of band), adding one advisory WEIGHT-PARITY warning | Low | WEIGHT-PARITY is advisory and does not gate validation; matching 0.45 would instead breach the `prerequisite_for` [0.7,1.0] band. Left the source weight untouched (minimal symmetric addition) |
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

- RESOLVED: the reciprocal symmetry edges were added to `deep-loop-runtime`, `mcp-code-mode`, and `deep-loop-workflows` graph-metadata; `advisor-graph-health` now passes.
- RESOLVED: the settings-parity test now validates the committed `.claude/settings.json`. The earlier note that the committed paths would not match was incorrect; the committed command path `.opencode/skills/system-spec-kit/mcp_server/dist/hooks/claude/<event>.js` does contain the expected `dist/hooks/claude/*.js` fragment. The real mismatch was the absolute-`cd` + pinned-node assertions, now relaxed to the portable committed form.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
