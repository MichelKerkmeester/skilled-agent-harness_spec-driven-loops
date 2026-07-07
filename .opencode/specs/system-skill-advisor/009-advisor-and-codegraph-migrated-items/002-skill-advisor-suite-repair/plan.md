---
title: "Implementation Plan: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor"
description: "Root-cause and repair the deep-loop-workflows merge fallout (legacy skill ids in fixtures/corpora/ledgers/Python disambiguation/metadata allowlist) and align governor brief-assertion tests, verifying via clean build and a re-run that drops failures from 61 to 36."
trigger_phrases:
  - "implementation plan skill advisor repair"
  - "deep-loop merge fallout fix"
  - "governor brief test alignment"
  - "parity re-baseline"
  - "divergence ledger regeneration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/009-advisor-and-codegraph-migrated-items/002-skill-advisor-suite-repair"
    last_updated_at: "2026-06-15T16:20:19Z"
    last_updated_by: "opus-agent"
    recent_action: "Implemented all in-scope fixes; build clean; 36 out-of-scope failures documented"
    next_safe_action: "None — complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py"
    session_dedup:
      fingerprint: "sha256:50f0e965f28f1221414ef39ab4212c23cdc538848f2fe6b5cd90ab9022437d12"
      session_id: "027-003-004-skill-advisor-suite-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Skill-advisor test-suite repair: fix pre-existing scorer/hook failures and align brief-assertion tests with the fable-5 governor

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
| **Language/Stack** | TypeScript (advisor lib + tests) + Python 3 (scorer + compat tests) |
| **Framework** | vitest 4 |
| **Storage** | JSONL corpus + JSON divergence ledger fixtures |
| **Testing** | `npx vitest run` in `.opencode/skills/system-skill-advisor/mcp_server` |

### Overview
Repair the deep-loop merge fallout at its source: tests and data files still expect the deleted legacy deep-* skill ids, so they are repointed to the merged `deep-loop-workflows`; the Python disambiguation layer is fixed to enforce its margin against the merged id; the metadata-category allowlist is extended; locked parity baselines are honestly re-baselined; and the divergence ledger is regenerated from current scorer output. Separately, governor brief-assertion tests are updated to expect the appended fable-5 governor line.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (in-scope; 36 out-of-scope residuals evidenced)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Five-lane fusion scorer (TS) mirrored by a Python scorer; corpus/ledger fixtures drive parity and ratchet gates.

### Key Components
- **`lib/scorer/aliases.ts`**: defines the merged `deep-loop-workflows` identity and mode mapping (read-only confirmation).
- **`scripts/skill_advisor.py`**: Python scorer; `_apply_deep_research_disambiguation` enforces the deep-vs-code-review margin.
- **`scripts/skill_graph_compiler.py`**: validates skill graph-metadata, including the category allowlist.

### Data Flow
Prompt to five-lane scoring to top-1 recommendation; tests compare TS vs Python tops over the labeled + harder corpora and ratchet divergences against an approved ledger.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/skill_advisor.py` `_apply_deep_research_disambiguation` | producer of the deep-vs-review margin | update to target merged `deep-loop-workflows` id | `tests/compat/python-compat.vitest.ts` SA-011/012 pass |
| `scripts/skill_graph_compiler.py` `ALLOWED_CATEGORIES` | policy validating metadata categories | add `workflow`, `design` | `--validate-only` drops the 2 category errors |
| `tests/parity/fixtures/local-native-approved-divergences.json` | ratchet baseline ledger | regenerate from current scorer output | `local-native-divergence-ratchet.vitest.ts` passes |
| `tests/legacy/advisor-renderer.vitest.ts` + brief-producer + hook tests | consumers of the brief string | append governor line to expected | renderer/producer/hook tests pass |

Required inventories:
- Same-class producers: `rg -n 'deep-research|deep-review|deep-ai-council' lib/scorer scripts tests`.
- Consumers of changed symbols: `rg -n 'EXPECTED_ADVISOR_CONTEXT|expectedBrief|GOVERNOR_DIRECTIVE' tests`.
- Matrix axes: corpus type (labeled, harder) x scorer (Python local, TS native); ledger rules (a) new-drift, (b) resolved, (c) hash/top mismatch, (d) dup, (e) orphan.
- Algorithm invariant: the deep-vs-code-review margin >= 0.10 is enforced after the merged id is the winning candidate; lowering only the loser preserves the winner's score.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture baseline: 61 failed / 553 across 15 files
- [x] Confirm legacy deep-* skill dirs are gone; only `deep-loop-workflows` exists on disk

### Phase 2: Core Implementation
- [x] Governor brief-assertion updates (renderer, brief-producer, claude/codex hook tests)
- [x] Scorer-rename fallout (native-scorer council, intent corpus, parity baselines, cli-parity, divergence ledger)
- [x] Python disambiguation fix + SA-011/012 compat updates
- [x] Metadata category allowlist (`workflow`, `design`)

### Phase 3: Verification
- [x] `npm run build` exits 0
- [x] Full `npx vitest run` re-run: 36 failed / 553, all in 2 out-of-scope files
- [x] Out-of-scope clusters proven with file:line + git evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | scorer/renderer/brief-producer | vitest |
| Integration | python-ts parity, corpus parity, divergence ratchet, cli parity | vitest + python3 subprocess |
| Manual | targeted probes of Python/TS scorer top-1 and margins | node + python3 ad-hoc scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| python3 + skill_advisor.py | Internal | Green | Parity/ratchet gates fail loudly (by design) |
| Built `dist/` (tsc) | Internal | Green | Probes and tests run against compiled lib |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A re-baselined count or regenerated ledger masks a real regression discovered later.
- **Procedure**: `git checkout -- <test or fixture>` to restore the prior baseline, then re-investigate the underlying scorer behavior before re-applying.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | High | 3-4 hours |
| Verification | Med | 1 hour |
| **Total** | | **~5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migrations (test/fixture edits only)
- [x] Verified `render.ts` governor left untouched
- [x] Baseline captured before any change

### Rollback Procedure
1. `git checkout -- <changed test/fixture>` for the suspect file.
2. Re-run the affected vitest file to restore the prior (failing) baseline.
3. Re-investigate the scorer behavior before re-applying.
4. No stakeholder notification needed (no user-facing change).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
