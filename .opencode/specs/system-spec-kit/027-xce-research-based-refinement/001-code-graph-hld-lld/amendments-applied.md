# Phase 001 amendments-applied — pt-02 cross-validation cycle

**Source**: `pt-02/sub-packet-amendments.md` §"Phase 001 amendments"
**Applied**: 2026-05-08
**iter trace**: `pt-02/iterations/iteration-001.md` + `iteration-006.md`

---

## BLOCKING findings resolved

| ID | Finding | REQ Added/Changed | iter ref |
|----|---------|-------------------|----------|
| **B-iter001-001** | HLD/LLD truncation has determinism requirement but no stable sort before 50-symbol cap; row order changes break determinism | NEW REQ-012 (stable ordering before truncation) | iteration-001.md |
| **B-iter001-003** | `code_edges` has no FK to `code_nodes`; generated dependencies need explicit dangling-target policy | NEW REQ-013 (dangling edge policy) | iteration-001.md |
| **B-iter001-005** | Multiple module symbols can exist for one file (synthetic + captured); primary selection undefined | NEW REQ-014 (primary module selection) | iteration-001.md |
| **B-iter006-001** | `file_role` is open string in Phase 001 but consumed as cross-phase contract by Phase 002; closed enum would already exclude `empty` | REQ-007 amended (open-string + reserved edge labels) | iteration-006.md |
| **B-iter006-002** | `classifyFileRole()` referenced by Phase 002 but not pinned as exported Phase 001 signature | NEW REQ-015 (public classifier contract) | iteration-006.md |
| **B-iter006-003** | Planned `queryMode:'omni'` and `hld_lld` payload absent from current context types and handler serialization; MCP wire contract drops payload | NEW REQ-016 (context wire contract — all changes in one PR) | iteration-006.md |

---

## REQ-delta table

| REQ | Status | Summary |
|-----|--------|---------|
| REQ-001..REQ-006 | unchanged | Core deterministic-output + handler + omni + tests requirements preserved |
| REQ-007 | **edited** | Was: `5 baseline kinds, closed style`. Now: `open string + required baseline labels {module, api-handler, library, test, config} + reserved edge labels {empty}`. Closes B-iter006-001. |
| REQ-008..REQ-011 | unchanged | Layer classification + complexity hints + LLM placeholders + markdown helper |
| **REQ-012** | **NEW P0** | Stable ordering before truncation: `kind priority → start_line → name → symbol_id`. Closes B-iter001-001. |
| **REQ-013** | **NEW P0** | Dangling-edge policy: filter OR structured `unresolved` records, with fixture. Closes B-iter001-003. |
| **REQ-014** | **NEW P0** | Primary module selection: synthetic (`fq_name === getModuleName(filePath)`) → lowest start_line → symbol_id. Closes B-iter001-005. |
| **REQ-015** | **NEW P0** | Public classifier contract: export `classifyFileRole(filePath, db)`. Phase 002 imports this. Closes B-iter006-002. |
| **REQ-016** | **NEW P0** | Context wire contract: omni mode requires QueryMode + ContextResult + handler parse + serialized JSON updated together with integration test. Closes B-iter006-003. |

---

## CONFIRMED findings (no spec change required)

| ID | Finding | Status |
|----|---------|--------|
| C-iter001-004 | Missing docstrings have explicit empty-string fallback matching nullable schema storage | Confirmed; both NULL and empty-string fixtures retained per REQ-002. |

---

## NEW tasks (added to tasks.md)

- T-001A: Add stable-sort helper + 100-repeat fixture (REQ-012)
- T-001B: Dangling-edge policy + fixture (REQ-013)
- T-001C: Primary-module selection fixture (REQ-014)
- T-001D: Export `classifyFileRole()` + equality test with `generateHLD().file_role` (REQ-015)
- T-001E: Context-handler JSON-parse integration test for `queryMode:'omni'` (REQ-016)

---

## NEW risks (added to spec.md §6)

- Schema drift between local types and MCP serialized output; mitigated by handler JSON integration test (REQ-016).
- Role-domain drift across phases; mitigated by open-string contract tests (REQ-007 amended).
- Unresolved edges destabilize generated dependency narratives; mitigated by REQ-013 policy + fixture.

---

## LOC-delta

- **Original estimate**: ~250 LOC
- **Amendment delta**: +70 to +120 LOC (mostly tests + context-schema integration)
- **Revised estimate**: ~320–370 LOC

---

## Out-of-scope amendments (deferred)

- None for Phase 001 — all proposed amendments applied.

---

## Phase 001 readiness after amendments

- ✅ Implementable: yes — every BLOCKING finding has a remediation REQ.
- ⚠️ Conditional: REQ-016 omni wire-contract integration is large; if scope-cuts needed, the alternative (REMOVE `omni` from Phase 001 scope) is explicit and pre-approved.
- ▲ Level unchanged: still Level 2.
