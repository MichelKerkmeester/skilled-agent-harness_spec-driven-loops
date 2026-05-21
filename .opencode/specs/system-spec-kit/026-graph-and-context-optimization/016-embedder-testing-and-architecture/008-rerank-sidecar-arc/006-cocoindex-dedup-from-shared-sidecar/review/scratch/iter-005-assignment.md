## ASSIGNED FOCUS — MAINTAINABILITY PASS

Audit code/doc maintainability. Open files and quote file:line evidence.

1. **Patterns + clarity** — `reranker.py:221-351` HttpSidecarRerankerAdapter:
   - Class structure: how does it compose with the existing `RerankerAdapter` interface? Is the fallback chain readable, or buried in nested try/except?
   - `httpx.Client` lifecycle — is it cached correctly? Any leak risk if the adapter is garbage collected while a request is in flight?
   - Lazy `import httpx` — clarity vs. cost tradeoff. Is there a single canonical entry point for instantiation?

2. **Dependency posture** — `pyproject.toml` / `requirements*.txt`:
   - Is `httpx` declared as a direct dep, or relied on transitively (via FastAPI)?
   - If transitive: P2 finding ("hidden dependency")
   - If declared: confirm version pin reasonable

3. **Documentation quality** — for each updated doc:
   - `INSTALL_GUIDE.md` (lines 352-367 added env-var row; 1086-1089 version row): does it explain the dispatch semantics clearly? Cross-link to system-rerank-sidecar?
   - `SKILL.md` (lines 20-30, 261-277): default dispatch claim — already P1-001 flagged. Are there other unclear claims?
   - `feature_catalog.md` (11 sections, 294 lines): does it follow sk-doc template? Are sections well-ordered? Any missing parts?
   - `manual_testing_playbook.md` (15 sections, 23 RS-NNN scenarios): are scenario preconditions/expected/actual fields filled? Any RS-NNN ambiguous about pass criteria?

4. **Fallback complexity** — `reranker.py:259-319`:
   - The 5-mode fallback chain (sidecar_unavailable / sidecar_5xx / sidecar_<status> / sidecar_malformed / missing-index) — is the dispatch logic flat or layered? Any nested exceptions hiding root cause?
   - Diagnostic field cardinality — does each failure mode have a distinct reason string? Any string overlap?

5. **Test maintainability** — `test_http_sidecar_adapter.py`:
   - Mock helpers `_make_mock_transport`, `_make_failing_transport` at lines 48-83 — reusable? Or duplicated across tests?
   - Test names — descriptive? Convention consistent with the rest of the test suite?
   - Any test that depends on a private module attribute that could break on refactor?

6. **Follow-up clarity** — `implementation-summary.md:137-143` Known Limitations:
   - Are the 5 limitations clearly actionable? Each names a follow-on packet?
   - The "n=1 smoke benchmark" caveat — clear path to n=3 confirmation?
   - The baseline drift (30/73 → 15/73) — tracked to a specific packet (`007-cocoindex-rerank-baseline-drift`)?

7. **Spec doc drift** — given P1-001 + P1-002 findings, the spec/plan/tasks/implementation-summary are misaligned with shipped code. How costly is the reconciliation? P2 maintainability finding if doc drift is significant.

8. **Naming / consistency** — `HttpSidecarRerankerAdapter` vs `CrossEncoderRerankerAdapter` vs `JinaV3RerankerAdapter`:
   - Class naming consistent?
   - Constructor signatures consistent?
   - Dispatch routing readable?

9. **Plan.md staleness** — `plan.md:54-124` adapter sketch may have pre-PROMOTE language; `plan.md:195-205` PROMOTE/HOLD branch may still describe both paths even though PROMOTE was applied. Is the plan a useful artifact for future packets, or stale?

For findings:
- P2 for doc drift, naming inconsistency, hidden dep, complex fallback that's still functional
- P1 only if maintainability actively hurts future change cost (e.g. nested abstraction that hides bugs)
- Skip P0 unless the maintainability issue is also a correctness/security bug (cross-classify under correct dimension)

Apply 7-field claim adjudication to any P1.
