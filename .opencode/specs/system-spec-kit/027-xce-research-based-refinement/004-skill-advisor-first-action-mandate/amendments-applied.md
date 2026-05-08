# Phase 004 amendments-applied — pt-02 cross-validation cycle

**Source**: `pt-02/sub-packet-amendments.md` §"Phase 004 amendments"
**Applied**: 2026-05-08
**iter trace**: `pt-02/iterations/iteration-004.md`

---

## BLOCKING findings resolved

| ID | Finding | REQ Added/Changed | iter ref |
|----|---------|-------------------|----------|
| **B-iter004-002** | `passes_threshold:true` can bypass renderer's local uncertainty check; mandate wording would overstate high-uncertainty recommendations | NEW REQ-007 (high-uncertainty guard) + REQ-002 amended (gate condition) | iteration-004.md |
| **B-iter004-004** | Static FIRST_ACTION_HINT inventory is fragile; unknown labels render `undefined` | REQ-001 amended (safe fallback hint mandatory) | iteration-004.md |
| **B-iter004-006** | Legacy renderer + producer fixtures pin OLD "use X" strings; will fail on day 1 | NEW REQ-008 (legacy fixture migration) | iteration-004.md |

---

## REQ-delta table

| REQ | Status | Summary |
|-----|--------|---------|
| REQ-001 | **edited** | Was: `FIRST_ACTION_HINT covering all 16 skills`. Now: `…may provide skill-specific hints, missing hints MUST fall back to safe generic instruction`. Closes B-iter004-004. |
| REQ-002 | **edited** | Was: `Brief format flips to MUST invoke`. Now: `Render MUST-invoke ONLY for confidence≥T ∧ uncertainty≤T cases (high-uncertainty cases route to softer wording)`. Closes B-iter004-002. |
| REQ-003 | unchanged | Confidence ≥0.8 threshold preserved at render.ts:124-133. |
| REQ-004 | unchanged + extended | Token-cap fixture extended to longest-label + longest-hint coverage (T-004E). |
| REQ-005 | unchanged | Existing tests + new directive-shape tests pass. |
| REQ-006 | unchanged | P1 — action hints reflect each skill's domain (manual review). |
| **REQ-007** | **NEW P0** | High-uncertainty guard: `passes_threshold:true ∧ uncertainty>T` MUST NOT render mandate wording unless producer contract proves dual threshold encoded. Closes B-iter004-002. |
| **REQ-008** | **NEW P0** | Legacy string fixture migration: renderer + producer exact-string tests rewritten for mandate wording, non-string coverage preserved. Closes B-iter004-006. |
| **REQ-009** | **NEW P1** | Boundary fixtures: confidence {0.79, 0.80, 0.81} × uncertainty {at T, over T} = 6 cases. Confirms inclusive 0.80 boundary. |

---

## CONFIRMED findings (no spec change required, just verified)

| ID | Finding | Status |
|----|---------|--------|
| C-iter004-001 | Confidence boundary is **inclusive** at exactly 0.80 in both renderer + producer paths | Confirmed; locked by NEW REQ-009 boundary fixtures |

---

## NEW tasks (added to tasks.md)

- T-004A: Add high-uncertainty `passes_threshold` fixture
- T-004B: Add 0.79/0.80/0.81 inclusive-threshold fixtures × {uncertainty at, over T}
- T-004C: Add unknown-safe-skill-label fallback-hint fixture
- T-004D: Rewrite renderer + producer exact-string tests for mandate wording
- T-004E: Add longest-label + longest-hint token-cap fixtures

---

## NEW risks (added to spec.md §6)

- Mandate wording can overstate confidence if `passes_threshold` bypasses uncertainty (mitigation: REQ-007 guard or producer invariant test).
- Static FIRST_ACTION_HINT map can drift as skill inventory changes (mitigation: REQ-001 safe fallback).
- Legacy renderer/producer fixtures pin OLD "use X" strings; will fail on day 1 (mitigation: REQ-008 intentional fixture migration).

---

## LOC-delta

- **Original estimate**: ~30 LOC (pre-pt-02 spec)
- **Amendment delta**: +50 to +90 LOC (uncertainty guard, fallback hint constant, fixture migration, boundary tests)
- **Revised estimate**: ~80–120 LOC, mostly tests and fallback/guard logic

---

## Out-of-scope amendments (deferred to future packet or explicit user approval)

- **Scorer-owned source changes**: parent 027 spec.md:129 keeps scorer/ out of scope. If the producer-invariant route (REQ-007 alternative B) requires touching `scorer/tests/`, surface to user before editing.

---

## Phase 004 readiness after amendments

- ✅ Implementable: yes — every BLOCKING finding has a remediation REQ.
- ⚠️ Conditional: REQ-007 guard strategy (renderer-side vs producer-invariant) MUST be chosen in plan.md Phase 1 before implementation begins.
- ▲ Level unchanged: still Level 1 (upper end of Level 1, complexity 14/70).
