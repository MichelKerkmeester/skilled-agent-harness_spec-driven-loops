# Deep Research Strategy - Session Tracking

## 2. TOPIC
extracted-skills-isolation-from-system-spec-kit: How to make `system-code-graph` and `system-skill-advisor` 100% isolated from `system-spec-kit` — zero TS imports, zero playbook references, zero tests, zero feature-catalog entries inside `system-spec-kit` referring to the extracted skills.

## 3. KEY QUESTIONS (remaining)
[All 8 questions answered — see below]

## 4. NON-GOALS
- NOT implementing the decoupling — this is a research packet only
- NOT refactoring cli-* or sk-* skills
- NOT performance optimization beyond evaluating strategy B's latency cost

## 5. STOP CONDITIONS
- CONVERGED: All 8 key questions answered with evidence

## 6. ANSWERED QUESTIONS
- [x] Q1: Complete file:line map of every TS import from spec-kit to system-code-graph → 14 files, 28 import sites, 10 types + 11 functions (iter-1)
- [x] Q2: Complete file:line map of every TS import from spec-kit to system-skill-advisor → ZERO TS imports (iter-1)
- [x] Q3: Full set of documentation/playbook/feature_catalog cross-references → 56 files: 14 OWNERSHIP, 18 CROSS-REF, 24 SPEC-KIT (iter-2)
- [x] Q4: Full set of tests that couple spec-kit to extracted skills → 19 direct, 9 indirect: 11 MOVE, 6 CONVERT, 1 LEGITIMATE (iter-3)
- [x] Q5: Per-strategy (A-E) implementation cost, runtime cost, risk, and ergonomic impact → A:17h B:30.5h C:31h D:2h E:40h+ (iter-4,5)
- [x] Q6: Recommended decoupling strategy → Strategy C (Hybrid) with 4-phase plan; Strategy D as fallback (iter-5)
- [x] Q7: Concrete migration sequence minimizing broken-build windows → 4 independent phases; only Phase 3's final tsconfig include removal is break-risky (iter-6)
- [x] Q8: Risk register + rollback strategies → 7 risks with detection signals and rollback paths (iter-6)

## 7. WHAT WORKED
- Grep with exact path patterns: `from '.*system-code-graph` captured ALL imports including 3 additional files not in spec.md inventory
- Reading actual type definitions in ops-hardening.ts and ensure-ready.ts revealed they're mostly trivial (4-value unions, simple interfaces)
- The explore agent efficiently classified all 56 doc files and 19 test files
- Phase-by-phase decomposition made Strategy C manageable and shippable

## 8. WHAT FAILED
- Spec.md assumed "similar density" of skill-advisor imports — actual count is ZERO. This dramatically simplifies the isolation picture.
- Spec.md estimated 11 source files — actual count is 14 (missed session-bootstrap, session-health, index-scope)
- ARCHITECTURE.md line 461 has a stale claim: "neither skill-advisor nor code-graph ships a SKILL.md" — both do now (v3.4.1.0)

## 9. EXHAUSTED APPROACHES
### Strategy E — REJECTED (iteration 5)
- What was tried: Considered moving spec-kit code back to code-graph/skill-advisor
- Why rejected: Would undo the extraction work. Moving handlers like session-resume.ts and memory-context.ts (core spec-kit functionality) into code-graph defeats the purpose. 40h+ effort, very high risk.

## 10. RULED OUT DIRECTIONS
- Strategy B alone: Cannot reach 100% isolation because `detectRuntime` requires in-process execution (reads `process.env`), and 7/11 value imports have no MCP tool equivalents.
- Strategy A alone: Only handles types — leaves 17 value import sites unresolved.
- Pure Strategy E: Architectural reversal with cascading effects.

## 11. NEXT FOCUS
RESEARCH COMPLETE — All 8 key questions answered. See `research/research.md` for synthesized findings and recommended execution plan.

## 12. KNOWN CONTEXT
[See research/research.md §1 for complete context]

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.10
- Stop reason: All questions answered (8/8)
- Total iterations completed: 6
- Progressive synthesis: complete
- Started: 2026-05-15T10:00:00Z
- Completed: 2026-05-15T11:45:00Z
