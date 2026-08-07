---
title: "Implementation Plan: Phase 10: routing-corpus-and-holdouts"
description: "Mirror-and-append plan: author 4 blind holdouts on the MT-H01/MT-H02 model, add the chrome-vs-aside boundary contract to MT-H01, append 7 labeled corpus rows, then re-capture the scorer baseline with its owning script and prove the ratchet gate green."
trigger_phrases:
  - "routing corpus holdouts plan"
  - "blind holdout authoring plan"
  - "scorer baseline recapture plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/010-routing-corpus-and-holdouts"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Plan executed to completion; all phases done and gates green"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing/holdout_agentic_browser.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-010-routing-corpus-and-holdouts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: routing-corpus-and-holdouts

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown holdout fixtures + JSONL corpus + JSON baseline fixture |
| **Framework** | mcp-tooling manual-testing-playbook conventions; system-skill-advisor routing-accuracy tooling |
| **Storage** | None (flat files; baseline written only by its owning script) |
| **Testing** | JSONL parse check, `capture-scorer-eval-baseline.mjs --write`, vitest ratchet gate, `validate.sh --strict` |

### Overview
Mirror-and-append: the four new holdouts copy MT-H01/MT-H02's exact frontmatter contract (`stage: holdout`, `blindToRouterKeywords: true`, expected_intent/expected_resources) so the existing holdout runner needs no change; the corpus rows copy the existing `skill_routing_prompts` row schema; the baseline fixture is regenerated only through its owning capture script so the ratchet's fixture-hash contract stays script-authored.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented [evidence: spec.md sections 2-3]
- [x] Success criteria measurable [evidence: spec.md SC-001..SC-004, each a countable check or command]
- [x] Dependencies identified [evidence: spec.md section 6; capture script + ratchet test located under `mcp_server/scripts/routing-accuracy/` and `mcp_server/tests/parity/`]

### Definition of Done
- [x] All acceptance criteria met [evidence: checklist.md CHK-020; REQ-001..REQ-005 verified 5-of-5]
- [x] Tests passing [evidence: ratchet gate `Tests 7 passed (7)`; corpus parse 200-of-200 lines valid]
- [x] Docs updated (spec/plan/tasks) [evidence: this packet's five docs authored at Level 2; validate.sh --strict PASSED]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fixture parity by structural mirroring: every new artifact copies the proven shape of the sibling artifact that already exists.

### Key Components
- **4 new holdout files**: one per uncovered mode (MT-H03 click-up, MT-H04 aside, MT-H05 refero, MT-H06 mobbin), each a natural-language prompt free of the target mode's router aliases plus an expected-behavior section naming which adjacent mode must NOT win.
- **MT-H01 boundary section**: the chrome-vs-aside contract written into the chrome holdout, inverse of MT-H04, with a version bump to v1.1.0.0.
- **7 corpus rows**: `rr-hub6-201` to `rr-hub6-207` in bucket `skill_routing_prompts`, alias-carrying phrasings (unlike the blind holdouts) so the advisor corpus exercises both vocabularies.
- **Baseline fixture**: `scorer-eval-baseline.json` re-captured by `capture-scorer-eval-baseline.mjs --write`, embedding fresh `corpusSha256`/`holdoutSha256`/`ambiguitySha256` and honest metric values.

### Data Flow
Holdout files and corpus rows in; capture script hashes and scores them into the baseline fixture; the vitest ratchet compares live files against the fixture on every run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a fix packet, but the baseline re-capture heals a pre-existing failing gate (the July 10 hub-merge relabel landed without re-capture), so the consumer surface was inventoried.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scorer-eval-baseline.json` (producer: capture script) | Fixture the ratchet compares against | Re-captured via `--write`; never hand-edited | `capturedAt: 2026-07-16`, `capturedAtSha: 2146dee114` in the fixture |
| `scorer-eval-baseline-ratchet.vitest.ts` (consumer) | Fixture-hash + metric gate | Unchanged; re-run | `Tests 7 passed (7)` |
| `labeled-prompts.jsonl` (input) | 200-row labeled corpus | 7 rows appended, none modified | 200-of-200 lines parse; ids rr-hub6-201..207 present at lines 194-200 |
| `hub_routing/holdout_*.md` (input) | Blind holdout suite | 4 created, 1 extended | `holdoutSha256` refreshed in the fixture; 6-of-6 modes covered |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read and baseline
- [x] Read MT-H01/MT-H02 holdout contract and the corpus row schema [evidence: new files reproduce the same frontmatter keys; new rows reproduce the same JSON keys]
- [x] Confirm the pre-existing ratchet failure and its cause [evidence: July 10 hub-merge relabel landed without re-capture; prior fixture hash no longer matched `labeled-prompts.jsonl`]

### Phase 2: Author fixtures
- [x] Author MT-H03/MT-H04/MT-H05/MT-H06 holdouts [evidence: 4 files under `hub_routing/`, each `stage: holdout`, `blindToRouterKeywords: true`]
- [x] Add "Boundary (six-mode hub)" to MT-H01; bump to v1.1.0.0 [evidence: `holdout_browser_inspect.md:10` `version: 1.1.0.0`; section at line 17]
- [x] Append rr-hub6-201..207 to `labeled-prompts.jsonl` [evidence: lines 194-200; `wc -l` = 200]

### Phase 3: Verification
- [x] Re-capture baseline: `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` from `mcp_server/` [evidence: fixture `capturedAt: 2026-07-16`, `full_corpus_top1: 153/200 = 0.765`]
- [x] Ratchet gate: `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` [evidence: `Tests 7 passed (7)`]
- [x] Corpus integrity: parse all lines as JSON [evidence: `lines: 200 invalid: 0`]
- [x] Spec child: generate-description.js + backfill-graph-metadata.js + `validate.sh --strict --no-recursive` [evidence: PASSED, recorded in implementation-summary.md section 5]
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Data integrity | 200-row corpus | line-by-line `JSON.parse` |
| Fixture parity | baseline vs live corpus/holdout/ambiguity files | `scorer-eval-baseline-ratchet.vitest.ts` (7 tests) |
| Scoring | full corpus + holdout + ambiguity slices | `capture-scorer-eval-baseline.mjs` |
| Spec docs | This packet | `validate.sh <child> --strict --no-recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `capture-scorer-eval-baseline.mjs` | Internal (system-skill-advisor) | Green | Baseline cannot be regenerated honestly |
| `scorer-eval-baseline-ratchet.vitest.ts` | Internal (system-skill-advisor) | Green | REQ-004 unverifiable |
| Existing MT-H01/MT-H02 holdout contract | Internal (mcp-tooling) | Green | No structural model to mirror |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Ratchet gate regression or corpus parse failure.
- **Procedure**: `git checkout -- .opencode/skills/mcp-tooling/manual_testing_playbook/hub_routing .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy` restores holdouts, corpus, and fixture together (they must move as a unit or the ratchet fails by design). The spec child is self-contained.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|-----------|--------|
| Phase 2 (author) | Phase 1 (read/baseline) | Mirror rule: nothing invented; every fixture copies an existing contract |
| Phase 3 (verify) | Phase 2 (author) | The capture script must hash the finished corpus + holdout set, or the ratchet pins a stale state |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Actual |
|-----------|----------|--------|
| 4 blind holdouts + MT-H01 boundary | Medium | Medium; adjacency wording (refero vs mobbin, chrome vs aside) took the care |
| 7 corpus rows | Small | Small |
| Baseline re-capture + ratchet | Small | Small, plus diagnosing the pre-existing drift |
| Spec child docs + gates | Medium | Medium |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

- **Blast radius**: data and fixture surfaces only; no runtime, no registry, no scorer code. Low.
- **Partial rollback**: holdout files can revert independently of the corpus, but the baseline fixture must be re-captured after ANY revert of corpus or holdout files (the fixture hashes all of them); reverting the fixture alone re-opens the pre-existing drift this phase healed.
- **Contract watch**: the ratchet test is the single consumer of the fixture; it passed 7/7 against the re-captured state.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
