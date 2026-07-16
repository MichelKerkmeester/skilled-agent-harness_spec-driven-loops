# Iteration 015 — Cross-model verify (MiniMax M3): T1 adoptability + AC-format prereq

**Focus:** Independent MiniMax M3 stress-test of iter 008 (T1 adoptable, reuse-heavy) + iter 011 (AC-format prereq).
**Executor:** cli-opencode `minimax-coding-plan/MiniMax-M3` (read-only; orchestrator-written artifacts). **Status:** complete. **Agreement:** MIXED. **newInfoRatio:** 0.35.

## Verdicts
- **[V-015-C1] CONFIRMED** — T1 reuse-heavy: AC table home exists (`checklist.md.tmpl:69-76`), EVIDENCE_CITED tokens exist (`validation_rules.md:439-445`), deep-review provides fresh-context PASS/CONDITIONAL/FAIL + traceability (`deep-review/SKILL.md:310-367`); peck supplies the exact algorithm (`acceptance-reviewer.md:36-42`). T1 work = table + rule + binding, no new infra class.
- **[V-015-C2] PARTIAL (downgraded from gpt-5.5's "feasible")** — the COUNTING half is feasible, but SEMANTIC classification (Tested/Partially/Not-covered) requires assertion-shaped AC TEXT, which doesn't exist today (L1/L2 = `[How to verify it's done]` placeholder `spec.md.tmpl:91,97`; L3 success block has G/W/T but the L3 requirement TABLE still uses the placeholder `spec.md.tmpl:445-453`). Without AC-format normalization the rule can COUNT but not CLASSIFY — **T1 is harder than "reuse-heavy" on the classification half.**
- **[V-015-C3] CONFIRMED** — AC-format normalization is a real, blocking prereq: 002 explicitly excludes T1/AC-coverage (`002/spec.md:63,99-103`) + is still Planned/not-implemented (`002/implementation-summary.md:51-58,94-98`); peck's AC format was never adopted.

## New considerations (M3 added — design-sharpening)
- **L3 double-count risk:** L3 has BOTH a requirement table (placeholder ACs) AND Given/When/Then story ACs — `AC_COVERAGE` must pick ONE canonical AC location per level or it double-counts/misses. The 011 design must resolve this (e.g., "L3 counts story-ACs only").
- **Lifecycle opt-in, not just level:** a freshly authored L2 spec (REQ rows, zero tests) must NOT ERROR at scaffold time → enforce AC_COVERAGE only when `implementation-summary.md` status is in-progress+, not merely "L2+ + checklist exists".
- **002 is a SEQUENCING constraint, not a note:** 011 phases 001-002 and pending 001/002 both edit the SAME manifest templates → T1 should depend on 002 closing first, or split the template diff into a separate window.

## Verdict contribution
**T1 core CONFIRMED, design SHARPENED.** Adopt-as-packet stands, but the 011 packet must add: (a) AC-format normalization as a true prereq (not optional), (b) a canonical per-level AC location to avoid L3 double-count, (c) a LIFECYCLE opt-in (not just level), (d) an explicit sequencing dependency on pending 001/002. Folded into the proposal.
