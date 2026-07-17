# Review Report — A1 Extend the Live Quality Machinery to Authored Specs

- **Target**: `.opencode/specs/system-speckit/028-memory-search-intelligence/002-spec-data-quality/001-on-write-quality/001-extend-quality-loop-authored`
- **Target type**: spec-folder (PLANNED scaffold, no code shipped)
- **Session**: `fanout-review-1782055952411-5f991r` · lineage `review` · generation 1
- **Executor**: cli-claude-code model=opus
- **Iterations**: 4 of 6 (converged early)

---

## 1. Executive Summary

**Verdict: CONDITIONAL** · `hasAdvisories: true` · release-readiness: `converged`

Active findings: **P0 = 0 · P1 = 1 · P2 = 2**.

The A1 phase docs are high quality: the reuse-first approach is sound, the destructive `runQualityLoop`/`attemptAutoFix` path is correctly fenced out of scope with accurate hazard analysis (8000-char `substring` trim at `quality-loop.ts:465-467`), and **six of seven** load-bearing `file:line` citations resolve byte-exact to the named shipped symbol. One P1 spec defect blocks an unconditional PASS: the H1 seam named in three places (`generate-context.ts:398` / `atomicWriteJson`) writes only **one** of the "two metadata JSONs" the spec scopes — `graph-metadata.json` (call at `:587`) — while `description.json` is produced via the imported `runWorkflow` (a different module/seam) and has zero write references in `generate-context.ts`. The requirement-to-seam mapping must be amended before build so REQ-001's "two metadata JSONs" is reachable. Two P2 advisories (scorer input-shape under-specification; citation hygiene / task split) round out the findings.

Convergence was legal: all four required dimensions covered, both core traceability protocols (`spec_code`, `checklist_evidence`) executed, all quality gates green, and every new P1 finding carries a passing claim-adjudication packet.

---

## 2. Planning Trigger

**Routes to: remediation planning (spec amendment).** The CONDITIONAL verdict is driven by F001, a spec internal inconsistency, not a code defect. Because the phase is PLANNED, the remediation is a documentation amendment to `spec.md`/`plan.md`/`tasks.md` rather than a code fix. Recommend folding F001 into the spec before the H1 build starts; F002 and F003 are advisory and can be absorbed into the same amendment pass.

---

## 3. Active Finding Registry

| ID | Sev | Dim | Title | Evidence | First/Last | Status |
|----|-----|-----|-------|----------|-----------|--------|
| F001 | P1 | traceability | H1 seam covers only `graph-metadata.json`, not the "two metadata JSONs" scoped | `spec.md:61,73,107`; `plan.md:106` vs `generate-context.ts:587` (sole `atomicWriteJson` call), `:55`, `:27` (no `description.json` write in file) | 3 / 3 | active |
| F002 | P2 | correctness | Scorer input shape unspecified — metadata object vs `computeMemoryQualityScore(content:string, metadata)` | `quality-loop.ts:392,596`; `spec.md:107` | 1 / 1 | active |
| F003 | P2 | maintainability | Citations source/dist-relative + unanchored; `tasks.md` T004/T005 encode single-seam framing | `plan.md:104`; `workflow.ts:1854`; `tasks.md:66` | 4 / 4 | active |

---

## 4. Remediation Workstreams

**Lane A — Spec/plan seam correction (F001, P1) [do first]**
1. Decide the intended H1 scope: either (a) narrow H1 to `graph-metadata.json` only and add a separate, correctly-cited seam for `description.json` scoring, or (b) keep "two JSONs" and name the real `description.json` write seam (`runWorkflow` / `workflow.ts`) alongside the `atomicWriteJson` seam.
2. Reconcile the singular REQ-001 acceptance criterion (`spec.md:107`) with the plural scope statements (`spec.md:61,73`, `plan.md:106`).

**Lane B — Doc hygiene (F002, F003, P2) [fold into Lane A amendment]**
3. Add the JSON-payload serialization step for the scorer's `content` argument to plan.md H1 (F002).
4. Split `tasks.md` T004/T005 to reflect the two distinct write seams; treat cited line numbers as advisory alongside the already-present symbol names (F003).

---

## 5. Spec Seed

Minimal `spec.md` edits implied by findings:
- **§2 / §3 H1 (F001)**: replace "The two metadata JSONs are written by `atomicWriteJson` at `generate-context.ts:398`" with the verified seam map: `graph-metadata.json` → `atomicWriteJson` (`generate-context.ts:587`); `description.json` → `runWorkflow` path. Make REQ-001 consistent (singular vs plural).
- **§4 REQ-001 (F002)**: add an acceptance clause that the metadata object is serialized deterministically before scoring and the written body stays byte-identical.

---

## 6. Plan Seed

Initial remediation tasks (referencing finding IDs):
- T-A1: [F001] Amend H1 seam description + REQ-001 multiplicity in `spec.md`/`plan.md`.
- T-A2: [F002] Document scorer-input serialization in `plan.md` §3 Key Components.
- T-A3: [F003] Split `tasks.md` T004/T005 per seam; annotate citations as symbol-pinned.

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence |
|----------|-------|--------|------|----------|
| spec_code | core | partial | hard | 6/7 citations exact; F001 multiplicity gap at `generate-context.ts:587` |
| checklist_evidence | core | pass | hard | `checklist.md:81-85,133-141` consistent with PLANNED (0/10 P0, 0/11 P1, 0/2 P2) |
| feature_catalog_code | overlay | n/a | advisory | no feature catalog in phase scope |
| playbook_capability | overlay | n/a | advisory | no playbook capability in phase scope |

---

## 8. Deferred Items

- F002 (P2): scorer input-shape — deferred to the F001 amendment pass; advisory, non-blocking.
- F003 (P2): citation hygiene / task split — deferred to the same amendment pass; advisory.
- Security-sensitive overrides (closed-finding replay, fix-completeness gate): **N/A for now** — no fix is shipped. Re-evaluate when H1/H3 code lands, since the target touches schema boundaries and persistence-adjacent code.
- AC_COVERAGE signal: advisory/default-off; `checklist.md` exists but `implementation-summary.md` is PLANNED (not in-progress), so the lifecycle predicate is not yet active.

---

## 9. Audit Appendix

### Iteration table
| Run | Dimension | Status | New P0/P1/P2 | Ratio | Verdict |
|-----|-----------|--------|--------------|-------|---------|
| 1 | correctness | complete | 0/0/1 | 1.00 | PASS |
| 2 | security | complete | 0/0/0 | 0.00 | PASS |
| 3 | traceability | insight | 0/1/0 | 1.00 | CONDITIONAL |
| 4 | maintainability | complete | 0/0/1 | 0.50 | PASS |

### Convergence replay
- STOP_ALLOWED at run 4: dimensionsCovered 4/4, convergenceScore 0.05 < 0.10, gates {evidence, scope, coverage, claimAdjudication} all green, no active P0.

### File coverage matrix
- Phase docs (5): full. Cited source files (5: generate-context.ts, quality-loop.ts, post-save-review.ts, workflow.ts, validator-registry.json): seam-scoped.

### Dimension breakdown
- correctness: 1×P2 · security: 0 · traceability: 1×P1 · maintainability: 1×P2.

### Resource map
- `{spec_folder}/resource-map.md` absent at init → `resource_map_present: false`; coverage gate skipped, no `## Resource Map Coverage Gate` section emitted.

### Verdict mapping
- P0=0, P1=1 → **CONDITIONAL** (P1 present with remediation plan). VERDICT_LOCK not triggered (no active P0).
