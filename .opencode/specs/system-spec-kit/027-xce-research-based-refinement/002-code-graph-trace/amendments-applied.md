# Phase 002 amendments-applied — pt-02 cross-validation cycle

**Source**: `pt-02/sub-packet-amendments.md` §"Phase 002 amendments"
**Applied**: 2026-05-08
**iter trace**: `pt-02/iterations/iteration-002.md` + `iteration-008.md`

---

## BLOCKING findings resolved

| ID | Finding | REQ Added/Changed | iter ref |
|----|---------|-------------------|----------|
| **B-iter002-001** | Current CONTAINS edges are class→method only, NOT symbol→file/module chains; Phase 002's core trace walk would not reach the promised file/module rungs | REQ-001 amended (file rung from `CodeNode.filePath`) | iteration-002.md |
| **B-iter002-002** | CONTAINS not emitted for every supported language; Bash/doc files and top-level functions cannot rely on that edge; phase overstates cross-language coverage | NEW REQ-009 (sparse containment behavior) | iteration-002.md |
| **B-iter002-004** | Nested-class parent lookup compares against short names; can choose wrong containing class | NEW REQ-010 (nested-class containment correctness via fqName comparison) | iteration-002.md |
| **B-iter002-008** | `fq_name` prefix splitting cannot recover module hierarchy because current `fqName` values are lexical, not package-qualified | NEW REQ-008 (deterministic module ownership from filePath) + REQ-007 demoted P0→P1 + rewritten | iteration-002.md + iteration-008.md |
| **B-iter008-001** | `fq_name` is lexical/symbol-qualified, not package-qualified; cannot be P0 source for module hierarchy | (Same as B-iter002-008 — REQ-008 + REQ-007 P0→P1) | iteration-008.md |

---

## REQ-delta table

| REQ | Status | Summary |
|-----|--------|---------|
| REQ-001 | **edited** | Was: `traceSymbol returns chain from symbol to architectural role`. Now: `…file rung MUST be sourced from CodeNode.filePath, NOT inferred from CONTAINS or fq_name`. Closes B-iter002-001. |
| REQ-002 | unchanged | New MCP tool registered + handler dispatches |
| REQ-003 | unchanged | Trace depth capped at 5 (default), tunable |
| REQ-004 | **edited** | Was: `architectural_role uses Phase 001 classifyFileRole()`. Now: `…AND MUST equal generateHLD(filePath, db).file_role for the same indexed state`. Closes B-iter006-002. |
| REQ-005 | unchanged | Vitest ≥80% coverage |
| REQ-006 | unchanged | P1 — memoization cache |
| REQ-007 | **demoted P0→P1 + rewritten** | Was: `code_packages table populated from fq_name prefix splitting`. Now: `code_packages may optimize OR formalize module hierarchy ONLY after P0 filePath-derived module policy is correct; NOT acceptable as P0 source of truth from fq_name prefixes`. Closes B-iter002-008 + B-iter008-001. |
| **REQ-008** | **NEW P0** | Deterministic module ownership: derived from explicit file-path policy, NOT fq_name dotted segments. Closes B-iter002-008. |
| **REQ-009** | **NEW P0** | Sparse containment behavior: top-level functions, Bash, doc symbols, module nodes, anonymous/default exports MUST still return valid file + architectural_role. Closes B-iter002-002. |
| **REQ-010** | **NEW P0** | Nested-class containment correctness: parent matching MUST compare against `class.fqName + "."`, not short name. Closes B-iter002-004. |

---

## CONFIRMED findings (no spec change required)

(None specific to Phase 002 in this iteration.)

---

## NEW tasks (added to tasks.md)

- T-002A: Implement filePath-derived file/module resolution helper + unit tests
- T-002B: Add sparse symbol fixtures (top-level, Bash, doc, module, anonymous/default)
- T-002C: Add nested-class fqName-based parent matching fixture
- T-002D: Shared-contract test with Phase 001: `trace.architectural_role === classifyFileRole(filePath, db)`

## REMOVED tasks

- ~~Implement `code_packages` table from fq_name prefix splitting~~ — deferred to P1 unless redesigned around filePath/package metadata

---

## NEW risks (added to spec.md §6)

- Current CONTAINS edges only cover class→method pairs; trace completeness can be overstated (mitigation: filePath fallback as normal path).
- `fqName` dot-splitting confuses lexical containment with package ownership (mitigation: REQ-008 derive module from filePath).
- Parallel work before Phase 001 ships can hide classifier-contract drift (mitigation: typed test doubles + shared-contract test once 001 lands).

---

## LOC-delta

- **Original estimate**: ~310 LOC
- **Amendment delta**: +80 to +150 LOC (filePath helper, sparse-containment fixtures, nested-class fix, shared-contract test)
- **Revised estimate**: ~390–460 LOC if `code_packages` remains deferred; higher if a real package table becomes P0

---

## Out-of-scope amendments (deferred)

- `code_packages` table at P0 with redesigned filePath-driven population: deferred to P1; if Phase 002's filePath policy proves insufficient mid-implementation, escalate to P0 in a follow-on amendment.

---

## Phase 002 readiness after amendments

- ✅ Implementable: yes — every BLOCKING finding has a remediation REQ.
- ⚠️ Conditional: depends on Phase 001's REQ-015 (`classifyFileRole()` exported signature) shipping first.
- ▲ Level unchanged: still Level 2.
