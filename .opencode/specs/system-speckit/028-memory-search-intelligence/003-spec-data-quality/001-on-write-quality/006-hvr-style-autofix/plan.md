---
title: "Implementation Plan: A6 HVR Style Auto-Fix Linter [template:level_2/plan.md]"
description: "Add one safe fence-aware prose-style detector that swaps em-dashes prose semicolons and Oxford commas on spec-docs registered fixClass safe on the shared detector registry length-neutral and idempotent."
trigger_phrases:
  - "hvr style"
  - "em-dash linter"
  - "prose semicolon"
  - "oxford comma"
  - "style auto-fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/006-hvr-style-autofix"
    last_updated_at: "2026-07-04T17:11:59.545Z"
    last_updated_by: "markdown-agent"
    recent_action: "Specified benchmark and default-off test for A6 scaffold"
    next_safe_action: "Hold for implementation, no code change has landed yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A6 HVR Style Auto-Fix Linter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript detector module on the shared spec-kit detector registry |
| **Framework** | spec-kit data-quality engine, the `dq-engine.ts` and `detector-registry.ts` scaffold owned by the shared-safe-fix-engine phase |
| **Storage** | None, the detector reads and writes only the target spec-doc through the engine atomic write path |
| **Testing** | Vitest fixtures per swap rule plus fence and frontmatter exclusion and idempotency |

### Overview
This phase adds one detector that enforces the HVR house voice on authored spec-docs. It parses the document into prose ranges that exclude fenced code blocks inline code spans and YAML frontmatter, then applies three deterministic swaps over prose only. It registers `fixClass: 'safe'` on the shared detector registry, the one safe content-mutating fix in the frozen allow-list, and it stays length-neutral and idempotent so a second pass is a no-op.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One detector module plus one registry entry. No new engine and no front door. The detector reuses the shared fence-aware prose parser approach already shipped for the wikilink validator.

### Key Components
- **`hvr-style.ts`**: the detector module. It holds the fence-aware prose-range parser, the three deterministic swap rules, the length-neutrality guard, and the `content_hash` idempotency guard.
- **`detector-registry.ts`**: the shared registry scaffold owned by the shared-safe-fix-engine phase. This phase adds exactly one entry, `{id, surface: 'spec-doc', detect, fixClass: 'safe', fix}`.
- **`hvr-style.vitest.ts`**: fixtures for each swap rule, fence exclusion, frontmatter exclusion, and idempotency.

### Data Flow
The engine resolves the `hvr.style` detector from the registry and runs `detect` over the parsed prose ranges. In report mode `detect` returns issue ranges with no write. In apply mode `fix` runs only when `'safe'` is in `opts.allowFixClass`, mutates the flagged prose offsets, leaves every non-prose range byte-identical, and writes atomically. A `content_hash` guard makes a re-run over already-clean prose a no-op.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `detector-registry.ts` | Shared registry scaffold that owns the frozen `fixClass` allow-list | add one `hvr.style` entry with `fixClass: 'safe'` and `surface: 'spec-doc'` | grep shows the new entry and `'safe'` resolving in the allow-list |
| `detectors/hvr-style.ts` | Does not exist | create the fence-aware parser, the three swap rules, and the two guards | the module exports `detect` and `fix` and a valid prose fixture round-trips |
| `quality-loop.ts` | Scores triggers anchors budget and structure, carries no prose-style check, hosts the destructive 8000-char budget trim | not a consumer, the detector lives on the new engine not in `runQualityLoop` | grep confirms no `hvr.style` call added to `quality-loop.ts` and no budget path reused |
| `detectors/__tests__/hvr-style.vitest.ts` | Does not exist | create fixtures for each swap rule, fence and frontmatter exclusion, and idempotency | the suite asserts zero issues from fenced and frontmatter ranges and exact output per ambiguous case |

Required inventories:
- Same-class producers: `rg -n 'fixClass|allowFixClass' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'hvr.style|detector-registry|content_hash' .opencode/skills/system-spec-kit`.
- Matrix axes: em-dash, prose semicolon, Oxford comma, inside code fence, inside inline code span, inside frontmatter, already-clean re-run.
- Algorithm invariant: a swap fires only inside a prose range, every non-prose range stays byte-identical, and a second pass applies zero changes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the shared-safe-fix-engine phase has landed `dq-engine.ts`, `detector-registry.ts`, and the frozen `fixClass` allow-list
- [ ] Locate the shipped wikilink validator fence detector and decide whether to reuse it directly or call a shared prose-range helper
- [ ] Pin the deterministic default for each ambiguous swap, the em-dash to spaced-hyphen or sentence split and the semicolon to sentence split or comma

### Phase 2: Core Implementation
- [ ] Build the fence-aware prose-range parser that excludes fenced code blocks, inline code spans, and YAML frontmatter (REQ-001)
- [ ] Implement the three deterministic swap rules over prose ranges only, em-dash, prose semicolon, and Oxford comma removal (REQ-002)
- [ ] Add the length-neutrality guard and the `content_hash` idempotency guard so a re-run over clean prose is a no-op (REQ-003)
- [ ] Register the `hvr.style` entry with `fixClass: 'safe'` and run `fix` only when `'safe'` is in `opts.allowFixClass` (REQ-004)
- [ ] Distinguish a prose semicolon from a semicolon in an inline code span or HTML entity, and an Oxford comma from a comma in a code-like list (REQ-005)
- [ ] Document each deterministic default inline and assert the exact output for each ambiguous case (REQ-006)

### Phase 3: Verification
- [ ] A spec-doc with em-dashes prose semicolons and Oxford commas in body prose auto-fixes to zero issues with all code inline-code and frontmatter regions byte-identical (SC-001)
- [ ] A re-run over already-clean prose applies zero changes, proving length-neutrality and idempotency (SC-002)
- [ ] A byte-diff confirms fenced and frontmatter regions are unchanged after a round-trip

### Benchmark (SPECIFIED, not run)

This is a write-time fix, so the metric is NOT prod-mode recall (prod search truncates to a 3-result floor and this detector emits no vector rows). It is a swap-precision and planted-catch pair on fixtures, a post-apply conformance count driven to zero, and a first-run real-defect floor over the live corpus. Every threshold below is specified, not yet measured.

| Metric | PROMOTION (pass) | REGRESSION (fail) |
|--------|------------------|-------------------|
| Swap precision on fixtures, correct swaps over total swaps | 1.0, every swap fires inside a prose range only | below 1.0, any swap fires inside a code, inline-code or frontmatter range |
| Planted-violation catch-rate, caught over planted | 1.0, every planted em-dash, prose semicolon or Oxford comma in body prose is flagged | below 1.0, any planted prose violation is missed |
| Post-apply conformance count, re-scanned over the fixed fixture | 0 remaining prose issues and a second pass applies 0 changes | non-zero remaining issues or a second pass mutates |
| Non-prose byte-diff after a round-trip | 0 bytes changed across code, inline-code and frontmatter ranges | any non-prose byte changes |
| First-run real-defect floor, report mode over the live `.opencode/specs` corpus | at least 1 genuine HVR-style violation flagged in real authored prose | 0 flagged, the detector earns no place |

- **Reproduce**: `npx vitest run .opencode/skills/system-spec-kit/mcp_server/.../detectors/__tests__/hvr-style.vitest.ts` covers swap precision, planted catch-rate, conformance and the non-prose byte-diff. The first-run real-defect floor runs `detect` in report mode over the live `.opencode/specs` corpus inside the same suite with no write. The conformance oracle reuses the validator rules in `scripts/rules/check-*.sh` registered through `scripts/lib/validator-registry.json`.
- **Floor relation**: floor-bypassing. This detector mutates authored prose and emits no vector rows, so it is NOT routed through the prod-mode completeRecall@3 gate that phase 015 owns (the gate built on the `run-eval-v2.mjs:361` export of `buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES`) and it pays no re-index or prod@3 tax.
- **Default-safety**: the detector ships behind `SPECKIT_HVR_STYLE_AUTOFIX`, default OFF. Keep-off rationale: it is the one safe content-mutating fix in the frozen allow-list, so it stays opt-in until every fence and frontmatter fixture passes. No-regress: with the flag absent the engine resolves no `hvr.style` entry and each spec-doc stays byte-identical to its pre-detector state. Runtime reversibility: `SPECKIT_HVR_STYLE_AUTOFIX=false` returns the engine to no-op with no rebuild. The default-off contract is proven by `flag-ceiling.vitest.ts` through `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each swap rule, fence exclusion, frontmatter exclusion, and idempotency | Vitest fixtures |
| Integration | The detector resolved from the registry in report mode and apply mode | engine-driven detector run |
| Manual | A byte-diff over a mixed fixture confirming non-prose regions stay identical | local diff plus grep evidence |
| Benchmark | Swap precision and planted catch-rate on fixtures, post-apply conformance to zero and the first-run real-defect floor over the live `.opencode/specs` corpus | `hvr-style.vitest.ts` plus a report-mode scan |
| Default-off | The flag absent keeps the engine at no-op and a spec-doc round-trip byte-identical, proving no-regress and runtime reversibility | `flag-ceiling.vitest.ts` `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS`, plus a flags-off case in `hvr-style.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026-shared-safe-fix-engine (`dq-engine.ts`, `detector-registry.ts`, frozen allow-list) | Internal | Yellow | This entry cannot register until the engine and allow-list exist |
| Shipped wikilink validator fence detector | Internal | Green | The fence-aware approach is already proven, this phase reuses it |
| A pinned deterministic default for each ambiguous swap | Internal | Yellow | An undocumented default risks a meaning-altering edit |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A swap fires inside a fence or frontmatter region, or an ambiguous swap changes clause meaning.
- **Procedure**: Drop the `hvr.style` registry entry so the engine stops resolving the detector, leaving the module in place at no-op while the fence boundary or default is corrected.
<!-- /ANCHOR:rollback -->

---


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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Fence and frontmatter exclusion fixtures pass before `fixClass: 'safe'` is granted
- [ ] Idempotency fixture proves a second pass applies zero changes
- [ ] Each ambiguous-swap default has a fixture asserting exact output

### Rollback Procedure
1. Remove the `hvr.style` entry from the detector registry
2. Leave the detector module in place at no-op while the boundary or default is corrected
3. Re-run the fence and frontmatter fixtures to confirm the corrected parser
4. Re-register the entry once every boundary fixture passes

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change adds a detector and writes only the target spec-doc through the atomic write path
<!-- /ANCHOR:enhanced-rollback -->

---
