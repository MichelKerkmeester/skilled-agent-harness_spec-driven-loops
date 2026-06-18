# Review Report — 021-cooperative-heavy-phases (lineage p021-opus-4)

| Field | Value |
|-------|-------|
| Target | `.../027/002/021-cooperative-heavy-phases` (Level 1 spec-folder) |
| Executor | cli-claude-code, model claude-opus-4-8 |
| Iterations | 1 of 1 (maxIterations cap) |
| Verdict | **PASS** (hasAdvisories=true) |
| Stop reason | max_iterations_reached |
| Shipped commit | `372bb0f2cd` |

---

## 1. Executive Summary

**Verdict: PASS** — no active P0 or P1 findings; 2 active P2 advisories.

The packet does exactly what it claims and is cleanly scoped. The three cooperating daemon changes — (1) an event-loop lag sampler + `timedPhase` per-phase wall-clock gated to the background path, (2) the trigger-embedding-backfill whole-corpus transaction chunked into 200-row per-chunk transactions that yield between chunks and honor an `isCancelled` signal, and (3) a per-tail-phase maintenance-marker refresh via `ctx.onPhase` — all resolve to shipped code, and all four requirements (REQ-001..REQ-004) trace to concrete file:line evidence. The two highest-risk correctness concerns the spec itself raises (yield-inside-a-transaction corruption, and per-chunk vs whole-corpus atomicity) are both correctly avoided/justified in the implementation.

Scope: 3 source/test files (`handlers/memory-index.ts`, `lib/search/trigger-embedding-backfill.ts`, `tests/trigger-embedding-backfill.vitest.ts`) plus the 4 spec docs. Convergence: all 4 dimensions covered in a single breadth pass (justified by the small blast radius); the loop stopped at the maxIterations=1 fan-out cap with the verdict stable.

`hasAdvisories = true` — two P2 documentation/symmetry nits remain, neither blocking.

---

## 2. Planning Trigger

PASS routes to **`/create:changelog`**, not remediation planning. The two P2 advisories do not require a plan; they are optional polish (a doc-wording fix and a one-line note) the packet owner can fold into the existing packet or defer. The one genuinely open item — the deploy-time live single-launcher lag read (SC-002) — is a deploy gate the packet explicitly defers by design, not a review-surfaced defect.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|-----------|--------|
| F001 | P2 | maintainability | "Byte-identical foreground path" claim imprecise — `timedPhase` wraps the previously-synchronous orphan-sweep in an `await` unconditionally (logging is gated, the wrapper is not) | `handlers/memory-index.ts:1239`; `plan.md:48` | 1/1 | active |
| F002 | P2 | correctness | Incremental early-return path (`if (incremental && !force)`) runs orphan-sweep (un-timed) + trigger-backfill without `timedPhase`/`ctx.onPhase`, so its phases skip the REQ-003 per-phase marker refresh | `handlers/memory-index.ts:788,802` | 1/1 | active |

No P0 or P1 findings.

---

## 4. Remediation Workstreams

These are advisory (P2); no remediation is required for PASS. If the owner chooses to address them:

- **Lane A — Doc accuracy (F001)**: change "byte-identical" to "behavior-identical" in `plan.md` §2 and `spec.md` REQ-001, or move the `timedPhase` wrapper behind the `instrument` gate so the foreground orphan-sweep call stays synchronous. Single-file doc edit OR a small refactor.
- **Lane B — Symmetry note (F002)**: add a one-line comment (or a follow-up note) acknowledging that the incremental early-return path does not refresh the marker per phase, with the rationale that the path is the bounded no-file fast path (orphan sweep ≤ 200 rows, backfill gated off). No behavior change needed.

---

## 5. Spec Seed

Minimal spec delta (optional, advisory):
- `spec.md` REQ-001 acceptance criteria: replace "the synchronous foreground path is unchanged (instrumentation gated on `ctx.onPhase`)" with "the synchronous foreground path is behavior-identical (instrumentation **logging** gated on `ctx.onPhase`; the `timedPhase` wrapper adds one benign microtask boundary on the orphan-sweep call)". Captures F001 precisely.
- Optionally add a non-goal clarifying that the incremental early-return path is out of scope for per-phase marker refresh (F002).

---

## 6. Plan Seed

If F001/F002 are taken up (low priority):
1. Edit `plan.md:48` + `spec.md` REQ-001 wording (F001). — docs only.
2. Either gate the `timedPhase` wrapper on `instrument` for the orphan-sweep call, or accept the microtask boundary and keep the doc fix (F001). — `handlers/memory-index.ts`.
3. Add the incremental-path note/comment (F002). — `handlers/memory-index.ts`.
No test changes implied; existing cancel/yield cases already cover the chunk path.

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Notes |
|----------|-------|--------|------|-------|
| spec_code | core | **pass** | hard | REQ-001 (lag sampler/timedPhase, logging gated), REQ-002 (200-row chunked syncPhraseChunk + between-chunk yield + isCancelled + cache-hit yield + cancelled status), REQ-003 (timedPhase fires onPhase for all 4 tail phases), REQ-004 (no launcher file in diff) — all confirmed against file:line |
| checklist_evidence | core | **n/a** | hard | Level 1 packet has no `checklist.md`; not a gap |
| feature_catalog_code | overlay | **n/a** | advisory | No feature-catalog claim references this internal daemon scan path |

Unresolved gaps: none. (`skill_agent`, `agent_cross_runtime`, `playbook_capability` overlays do not apply to a spec-folder target.)

---

## 8. Deferred Items

- **F001, F002** (P2 advisories) — optional polish; deferred unless the owner wants the wording/symmetry tightened.
- **SC-002 deploy-time live lag read** — explicitly deferred by the packet to a clean single-launcher session (matches 019's deferred deploy gate). Not a review defect; the instrumentation needed to perform it is shipped and verified.
- **Audit limitation** — the unit suite (`tests/trigger-embedding-backfill.vitest.ts`, claimed 6/6) and `tsc --noEmit` (claimed exit 0) were **not** independently re-executed in this review session (test execution permission-gated). The test file was read and its three new cases verified logically consistent with the implementation; the verification claims are otherwise taken on the implementation-summary's evidence.

---

## 9. Audit Appendix

**Iteration coverage**
| Iter | Dimensions | Files | P0/P1/P2 | Ratio |
|------|-----------|-------|----------|-------|
| 1 | correctness, security, traceability, maintainability | 3 src/test + 4 docs | 0/0/2 | 0.40 |

**Convergence replay**: single iteration; dimensionCoverage=4/4=1.0; no P0 override; stop forced by maxIterations=1 (fan-out lineage). Verdict logic: 0 P0 ∧ 0 P1 → PASS; 2 P2 → hasAdvisories=true. Consistent with the `synthesis_complete` JSONL event.

**Correctness evidence (ruled-out risks)**:
- No double trigger-backfill per scan — call sites `memory-index.ts:802` and `:1256` are in mutually-exclusive branches (incremental early-return guard `:792` vs full-scan tail `:1239`).
- No yield inside a transaction — `await setImmediate` at `trigger-embedding-backfill.ts:258` is between `syncPhraseChunk` invocations; the `database.transaction()` body (`:169-245`) contains no `await`.
- No lag-timer leak — created in `try` (`:~510`), cleared in `finally` (`:~1477`), `unref()`'d.
- Comment hygiene — both source files' new comments carry durable WHY only; grep for ADR-/REQ-/CHK-/spec-path/phase-id refs returned clean.

**Security**: parameterized SQL throughout; no new external input or credential surface; trigger-backfill gated off by default (`isEnabledByEnv()`, `:59-61`).

**Code-graph readiness**: not consulted (small, fully-resolvable diff; structural questions answered by grep + direct read).
