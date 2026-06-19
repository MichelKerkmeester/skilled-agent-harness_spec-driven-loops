---
title: "Implementation Plan: Red-Team Probe Gate [system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-006-redteam-probe-gate/plan]"
description: "Aggregate the existing per-seam Memory MCP injection sanitizers into one named zero-success-ceiling CI gate, add the missing deep-loop prompt-pack render probe, and fold in the no-querytext exfil-audit assertion — additive test infrastructure plus one audit-path edit."
trigger_phrases:
  - "red-team probe gate plan"
  - "memory injection ci gate plan"
  - "prompt-pack render probe"
  - "exfil audit no querytext"
  - "zero success ceiling gate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/006-006-redteam-probe-gate"
    last_updated_at: "2026-06-19T07:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 2 implementation plan for the red-team probe gate"
    next_safe_action: "Operator review before any gate implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-redteam-probe-gate-replan-2026-06-19"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Red-Team Probe Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Vitest) |
| **Framework** | Spec-Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server`) + deep-loop-runtime |
| **Storage** | SQLite-backed memory index (probes drive `memory_save` → recall) |
| **Testing** | Vitest, run via `scripts/run-tests.mjs` lane selector |

### Overview
Build one named CI red-team probe gate that aggregates the Memory MCP's existing per-seam injection sanitizers, adds the missing deep-loop prompt-pack render probe, and folds in a no-querytext exfil-audit assertion. The work is almost entirely additive test infrastructure (a new aggregating gate module, per-family fixtures, a deep-loop probe, a `run-tests.mjs` security lane) plus exactly one production edit: the namespace-denial audit path must record a denial without storing the probe query text.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (SC-001..SC-004)
- [x] Dependencies identified (C8/SB8 escaper; prompt-pack dead-code status; audit seam)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-010)
- [ ] Tests passing: the gate runs as one named group; `tsc`/build green; existing suite green
- [ ] Docs updated (spec/plan/tasks/checklist) and `validate.sh --strict` green on this packet

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Test-gate aggregation: one named Vitest module fans out into three attack-family suites + the deep-loop probe + the exfil-audit assertion, emitting a single structured report with a fixed zero-success ceiling. Reuses the existing sanitizer seams rather than reimplementing them.

### Key Components
- **`redteam-probe-gate.vitest.ts`**: the named aggregator — drives poisoned-RAG, query-only-injection, and wrapper-breakout families; collects per-probe verdicts; fails on any success.
- **`redteam-fixtures/`**: deterministic payload fixtures per family (extends `promptPoisoningAdversarial.json`, `unicodeInstructionalSkillLabel.json`).
- **`prompt-pack-injection.vitest.ts`** (deep-loop-runtime): the previously-uncovered render-seam probe.
- **`run-tests.mjs` security lane**: a named selector so the gate runs as one group.
- **Namespace-denial audit edit**: record a denial event with no verbatim query text.

### Data Flow
Probe fixture → seam under test (`memory_save`/recall, query/label path, render wrapper, `prompt-pack.ts`, audit path) → sanitizer/wrapper → assertion (neutralized?) → structured per-probe verdict → gate pass/fail (zero-success ceiling).

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Security-adjacent: this gate probes injection seams and edits an audit path, so the affected-surfaces inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/utils/skill-label-sanitizer.ts` (`sanitizeSkillLabel`) | Neutralizes injection in skill labels | not a consumer (probed, unchanged) | `architecture-seam.vitest.ts` asserts `'ignore previous instructions' → null`; gate re-asserts under named group |
| `tests/architecture-seam.vitest.ts` | Existing query-only-injection assertion | aggregate under gate | gate imports/re-runs the assertion as REQ-004 |
| `tests/bm25-security.vitest.ts` | BM25-path injection assertion | aggregate under gate | gate references as a covered seam |
| `tests/security/adversarial-unicode.vitest.ts` + `tests/advisor-fixtures/unicodeInstructionalSkillLabel.json` | Unicode-instructional / wrapper-breakout surface | reuse | wrapper-breakout family (REQ-005) drives these fixtures |
| `tests/advisor-fixtures/promptPoisoningAdversarial.json` | Poisoning fixture | reuse/extend | poisoned-RAG family (REQ-003) |
| `formatters/search-results.ts` + `handlers/memory-triggers.ts` | Render boundary (recalled content body, raw today) | probe target (escaper is C8/SB8, out of scope to build) | poisoned-RAG/wrapper-breakout assert neutralization here; red if escaper absent |
| `deep-loop-runtime/lib/deep-loop/prompt-pack.ts` (`renderPromptPack`) | Prompt-pack render sink (dead-code today, 006 RD1) | new probe | `prompt-pack-injection.vitest.ts` asserts neutralization at the renderer unit |
| Namespace-denial audit path (seam TBD; `spec-folder-mutex.ts` is a lock not an authorizer) | No `namespace_denied` audit exists today (GAP) | update | record denial without query text; gate asserts no verbatim query in the audit record (REQ-007) |
| `scripts/run-tests.mjs` | Lane router | update | add a security-group selector running the gate as one group |

Required inventories (run at implementation time):
- Same-class producers: `rg -n 'sanitizeSkillLabel|ignore previous instructions|promptPoisoning|unicodeInstructional' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of the render boundary: `rg -n 'formatSearchResults|memory-triggers|getTieredContent' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'`.
- Audit-path discovery: `rg -n 'namespace_denied|audit|denial' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'` to confirm the GAP and the wiring point before REQ-007.
- Algorithm invariant: every injection probe must show the neutralized output AND name the adversarial payload class; the exfil-audit invariant is "denial recorded, query text absent."

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the live seams (sanitizer, the four existing security suites, the poisoning fixtures, the prompt-pack renderer)
- [ ] Confirm the namespace-denial audit seam (GAP confirmation) before wiring REQ-007
- [ ] Decide the C8/SB8 sequencing (escaper-first vs gate-lands-red as acceptance test)

### Phase 2: Core Implementation
- [ ] Author `redteam-probe-gate.vitest.ts` with the three attack families + zero-success ceiling + structured report
- [ ] Add per-family fixtures under `redteam-fixtures/` (reuse/extend existing)
- [ ] Author the deep-loop `prompt-pack-injection.vitest.ts` render probe
- [ ] Wire the no-querytext exfil-audit edit + its gate assertion
- [ ] Add the `run-tests.mjs` security lane selector

### Phase 3: Verification
- [ ] Both recall shapes (full + compact) covered by poisoned-RAG / wrapper-breakout
- [ ] Negative control passes (no false-pass on a no-op payload)
- [ ] `tsc`/build green; existing suite green; `validate.sh --strict` green on this packet; adversarial review of the gate

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | prompt-pack renderer probe; skill-label sanitizer re-assertion | Vitest |
| Integration | poisoned-RAG `memory_save → recall` (full + compact); wrapper-breakout at render | Vitest |
| Gate | aggregate the above into one named zero-success-ceiling group with a structured report | Vitest + `run-tests.mjs` lane |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `source_kind`-gated render escaper (C8/SB8) | Internal (sibling candidate) | Yellow (not built) | Poisoned-RAG / wrapper-breakout probes land red until built; gate can act as its acceptance test |
| Deep-loop `renderPromptPack` caller wiring | Internal | Yellow (dead-code, 006 RD1) | Probe runs as a unit against the renderer regardless; reports dormant-caller status |
| Namespace-denial audit seam | Internal | Red (GAP — no `namespace_denied` audit today) | REQ-007 needs the seam confirmed/created before the assertion can pass |
| Existing per-seam sanitizers + fixtures | Internal | Green (confirmed live) | Aggregation only; no behavior change |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate flakes, blocks merges incorrectly, or the audit edit regresses a save/recall path.
- **Procedure**: Revert the additive test modules + `run-tests.mjs` lane selector (restores the prior suite byte-for-byte) and `git revert` the single audit-path edit. No data migration, no schema change, no feature flag.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / seam confirm) ──► Phase 2 (Core: gate + probes + audit) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup; (C8/SB8 escaper for green probes); audit seam for REQ-007 | Verify |
| Verify | Core | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | seam + audit-gap confirmation |
| Core Implementation | Med | aggregator + 3 families + fixtures + prompt-pack probe + audit edit + lane |
| Verification | Med | full+compact coverage, negative control, adversarial review of the gate |
| **Total** | | Research effort tag: **L-M** (gate) + **M** (exfil-audit sub-req) — structural inference, unbenchmarked |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No backup needed (additive tests; one reversible audit edit)
- [ ] No feature flag (gate is always-on by design; zero-success ceiling has no relaxation knob)
- [ ] Confirm the existing suite baseline (count + pass/fail) before adding the gate

### Rollback Procedure
1. Remove the security lane selector from `run-tests.mjs`.
2. `git revert` the gate modules, fixtures, prompt-pack probe, and the audit-path edit.
3. Re-run the suite and confirm it matches the pre-gate baseline exactly.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no schema or data change)

<!-- /ANCHOR:enhanced-rollback -->
