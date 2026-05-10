# Phase 006 amendments-applied — pt-02 cross-validation cycle

**Source**: `pt-02/sub-packet-amendments.md` §"Phase 006 amendments"
**Applied**: 2026-05-08
**iter trace**: `pt-02/iterations/iteration-005.md`, `iteration-007.md` (cross-cutting subprocess concerns)
**Level bump**: L2 → L3 (see `decision-record.md` DR-001)

---

## BLOCKING findings resolved

| ID | Finding | REQ Added/Changed | iter ref |
|----|---------|-------------------|----------|
| **B-iter005-001** | Subprocess lifecycle is under-specified — no SIGTERM-then-SIGKILL escalation, no close-event wait, no stdin handling | NEW REQ-012 (subprocess lifecycle) | iteration-005.md |
| **B-iter005-002** | No provider auth preflight; auth failures could consume the full 2-hour run budget | NEW REQ-011 (provider auth preflight) | iteration-005.md |
| **B-iter005-003** | Subprocess can survive timeout and keep shared OpenCode state locked | (Same as B-iter005-001 — REQ-012 + new risk row) | iteration-005.md |
| **B-iter005-004** | Result row schema is loose; mixed failures (timeout + retry + DB-readiness + auth) can corrupt paired statistics | NEW REQ-013 (discriminated result schema) + REQ-009 amended (incomplete-pair accounting) | iteration-005.md |
| **B-iter005-005** | No mocked stress test — only a 1×2 smoke test, insufficient reliability coverage for 12-20 task × 2 condition dispatch loop | NEW REQ-014 (mocked dispatcher stress test) | iteration-005.md |
| **B-iter005-006** | Statistical risk: incomplete pairs would silently corrupt paired t-test if report generator doesn't separate complete vs incomplete | (Same as B-iter005-004 — REQ-009 amended) | iteration-005.md |
| **B-iter005-007** | No stale-process detection or DB-lock retry; can cause cascading failures if a previous run left state | NEW REQ-015 (stale process / lock guard) | iteration-005.md |

---

## REQ-delta table

| REQ | Status | Summary |
|-----|--------|---------|
| REQ-001 | unchanged | CLI dispatcher spawns OpenCode subprocess per task |
| REQ-002 | unchanged | Mode toggle via env var |
| REQ-003 | unchanged | 3 primary metrics computed |
| REQ-004 | unchanged | RQ8 token measurement via session-analytics-db |
| REQ-005 | unchanged | 12-20 labeled tasks |
| REQ-006 | unchanged | Incremental result saving |
| REQ-007 | unchanged | Markdown report with paired t-test |
| REQ-008 | unchanged | 10-min per-task timeout (refined by REQ-012's SIGTERM-then-SIGKILL escalation) |
| REQ-009 | **edited (P1)** | Was: `2 diagnostic metrics: token waste ratio, first-action adherence`. Now: `Report generator skips incomplete baseline/after pairs, counts skipped/incomplete rows separately, and only includes complete pairs in paired statistics`. Closes B-iter005-004 + B-iter005-006. |
| REQ-010 | unchanged | Retry logic (2 retries per task) |
| **REQ-011** | **NEW P0** | Provider auth preflight ONCE before dispatch + cached + fail-fast; auth-shaped errors invalidate cache. Closes B-iter005-002. |
| **REQ-012** | **NEW P0** | Subprocess lifecycle: ignored stdin / 600s timeout / SIGTERM / grace / SIGKILL / close-event wait. Closes B-iter005-001 + B-iter005-003. |
| **REQ-013** | **NEW P0** | Discriminated result row schema: status/attempt/maxAttempts/condition/taskId/metrics/error/stdoutPath/stderrPath/sessionId/includeInPairedStats. Closes B-iter005-004. |
| **REQ-014** | **NEW P0** | Mocked dispatcher stress test ≥12×2 with 6 outcome classes. Closes B-iter005-005. |
| **REQ-015** | **NEW P1** | Stale-process detection + DB-lock/readiness short-backoff retry. Closes B-iter005-007. |
| REQ-016 (was REQ-011) | renumbered | Stress config entry — pushed down to REQ-016 to make room for new P0 REQs |
| REQ-017 (was REQ-012) | renumbered | Power analysis output — pushed down to REQ-017 |

---

## NEW tasks (added to tasks.md)

- T-005A: Provider preflight cache + auth-shaped error invalidation (REQ-011)
- T-005B: Hardened subprocess dispatcher helper (REQ-012)
- T-005C: Discriminated result row schema (REQ-013)
- T-005D: Update report generator for incomplete-pair accounting (REQ-009 amended)
- T-005E: Mocked 12×2 dispatcher stress test (REQ-014)
- T-005F: Stale-process detection + DB/readiness retry (REQ-015)
- T-keep-but-not-sufficient: 1×2 smoke kept but explicitly NOT sufficient reliability coverage

## NEW file artifacts

- `decision-record.md` (NEW — required by L3 contract; documents L2→L3 bump rationale)
- `mcp_server/lib/eval/dispatcher.ts` (NEW — implementation, REQ-012)
- `mcp_server/lib/eval/provider-preflight.ts` (NEW — implementation, REQ-011)
- `mcp_server/lib/eval/result-schema.ts` (NEW — implementation, REQ-013)
- `mcp_server/tests/eval-dispatcher-stress.vitest.ts` (NEW — REQ-014 mocked stress)

---

## NEW risks (added to spec.md §6)

- A subprocess can survive timeout and keep shared OpenCode state locked (mitigation: REQ-012 process-tree cleanup + close-event wait; REQ-015 stale-process detection).
- Provider auth failures can consume the full run budget (mitigation: REQ-011 preflight + cached provider status; auth-shaped errors invalidate cache).
- Mixed failures can corrupt paired statistics if row schema is loose (mitigation: REQ-013 discriminated rows + REQ-009 amended incomplete-pair accounting).
- Level 2 underestimates operational complexity if all subprocess hardening remains in scope (mitigation: bump to Level 3 — DECISION RECORDED in `decision-record.md`).

---

## LOC-delta

- **Original estimate**: ~500 LOC
- **Amendment delta**: +180 to +300 LOC (preflight + dispatcher + result schema + report-generator amendments + mocked stress + stale-process detection)
- **Revised estimate**: ~680–800 LOC if hardening stays in Phase 006 (chosen path)
- **Counterfactual**: ~500-580 LOC if subprocess hardening were split out into a separate prerequisite packet (rejected — see `decision-record.md` DR-001 alternatives)

---

## Level change

- **Was**: Level 2 (`<!-- SPECKIT_LEVEL: 2 -->`, `description.json.level = 2`, `graph-metadata.json.level = 2`)
- **Now**: Level 3 (`<!-- SPECKIT_LEVEL: 3 -->`, `description.json.level = 3`, `graph-metadata.json.level = 3`)
- **L3 contract additions**:
  - `decision-record.md` (NEW — DR-001 bump rationale + DR-002 mocked-stress gate + DR-003 1×2 smoke role)
  - Full QA checklist (existing checklist.md retained + new C-014..C-020 + C-V02b + C-V06)
  - `implementation-summary.md` (still required for ALL levels per CLAUDE.md §3, deferred to post-implementation per Rule 13)
- **L3 contract NOT added** (intentional, per CLAUDE.md):
  - `research.md` — pt-01/pt-02 deep-research artifacts already exist; no per-phase research needed
  - `resource-map.md` — optional; not added since dependency map is captured in plan.md §DEPENDENCIES

---

## Out-of-scope amendments (deferred)

- Cross-model comparison (still out of scope; original constraint).
- Real-time dashboard (still out of scope).
- SWE-bench Verified (still out of scope; lightweight local eval is the intended scope).

---

## Phase 006 readiness after amendments

- ✅ Implementable: yes — every BLOCKING finding has a remediation REQ.
- ⚠️ Conditional: requires Phases 001-004 to ship first (unchanged).
- ⚠️ Workflow gate: REQ-014 mocked stress test MUST pass before any manual full-harness run (codified in `decision-record.md` DR-002 + checklist C-V02b/C-V04).
- ▲ Level changed: L2 → L3 with `decision-record.md` authored.
