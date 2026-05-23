# Iteration 013: Stress-test reducer, registry, dashboard, and report persistence: how null-search evidence, search debt, ruled-out candidates, and clean-path proof should survive synthesis.

## Focus

This pass stress-tested recommendation R3 from the current synthesis: reducer, registry, dashboard, and final report persistence for `searchLedger`, null-search evidence, search debt, ruled-out candidates, and clean-path proof. The goal was to find where a well-formed future ledger could still become checkbox theater after dispatch validation.

## Actions Taken

1. Re-read the current synthesis recommendation list and focused on R3 plus its dependencies on R1/R2/R4.
2. Inspected the deep-review reducer path from iteration markdown and delta JSONL into the findings registry and dashboard.
3. Checked post-dispatch validation and the deep-review iteration prompt contract for the current required JSONL surface.
4. Checked the review-report synthesis contract to see whether search evidence has a first-class destination.
5. Compared existing ruled-out/dead-end persistence with the proposed null-search and clean-path semantics.

## Findings

### F013-001: Search-ledger rows would currently be dropped by the reducer unless they are promoted into explicit reducer state

The reducer's structured delta ingestion is finding-centric. `deltaRecordToFinding()` accepts `type:"finding"` records and maps only finding identity, severity, title, file, description, finding class, and delta status; even `evidenceRefs` is described in the comment but not retained in the returned registry object. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:501] [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:531]

`buildRegistry()` returns lineage, terminal stop, open/resolved findings, blocked-stop history, severity buckets, dimension coverage, convergence scores, graph blockers, and corruption warnings. It has no `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, `searchCoverage`, or ledger preservation field. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:903]

This makes R3 a required implementation step, not a display polish step. If the follow-up only adds prompt/schema fields, future iterations can emit valid `searchLedger` rows that never survive into the canonical registry. The minimum reducer addition should parse `searchLedger` and `targetSelection` from iteration records and/or delta records into stable registry fields before dashboard or report rendering.

### F013-002: The current dashboard can still render a clean PASS while hiding search debt

Dashboard verdict is computed only from active P0/P1/P2 severity counts: P0 means `FAIL`, P1 means `CONDITIONAL`, otherwise `PASS`. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1074] Progress rows show focus, dimensions, ratio, P0/P1/P2, and status, but not candidate coverage or uncited search rows. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1082]

The Active Risks section likewise reports latest error status, active P0/P1/P2, claim-adjudication gate debt, and blocked-stop debt. It falls back to "None active beyond normal review uncertainty" when those are absent. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1215] [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:1258]

So `searchDebt` must affect dashboard risk posture directly. A v2 standard/complex review with missing or deferred mandatory ledger rows should not be able to display an unqualified PASS merely because active findings are zero.

### F013-003: Existing ruled-out persistence collapses clean proof, dead ends, and rejected candidates into one prose bucket

The markdown parser reads `Ruled Out`, `Confirmed-Clean Surfaces`, or `Confirmed-Clean` into `iteration.ruledOut`, and it reads `Dead Ends` or `Traceability Checks` into `iteration.deadEnds`. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:258] [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:278]

Later, `buildExhaustedApproaches()` concatenates `deadEnds` and `ruledOut`, groups by text, and renders every item as `BLOCKED`, "Repeated iteration evidence ruled this direction out", and "Do NOT retry". [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936] [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:956]

That is too lossy for null-search evidence. A clean-path proof is not necessarily a blocked approach, and a ruled-out candidate is not the same thing as a dead end. The follow-up schema should separate `ruledOutCandidates[]`, `cleanSearchProof[]`, and `blockedSearchDebt[]`, each with `evidenceRefs` and `disposition`.

### F013-004: The report compiler has no first-class Search Ledger destination

The synthesis step currently instructs the workflow to create a 9-section review report centered on executive verdict, planning packet, active finding registry, remediation workstreams, seeds, traceability, deferred items, and appendix. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1166]

The Planning Packet is built from reducer-owned state plus `findingDetails`, while the Active Finding Registry lists active findings and their finding metadata. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1177] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1183]

Ruled-out claims only appear in the Audit Appendix instructions, and there is no Search Ledger, Search Coverage, Search Debt, or Clean Path Proof section. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1205] [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1208]

If the report contract is not updated with reducer-backed search fields, the final synthesis can preserve active findings while demoting null-search proof to prose or omitting it entirely.

### F013-005: Post-dispatch validation currently proves artifact shape, not reducer survivability

The shared validator's review field list requires the current review iteration fields, ending at `durationMs`; it does not include `reviewDepthSchemaVersion`, `targetSelection`, `searchLedger`, or `searchCoverage`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:112]

The validator checks missing fields, array shape for `filesReviewed`, `dimensions`, and `findingDetails`, and numeric shape for `newFindingsRatio`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:358] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:390]

The state-format reference is already stricter than the TypeScript validator: it says `findingsSummary` and `findingsNew` must contain P0/P1/P2 keys, and active `findingDetails` must include `findingClass`, `scopeProof`, and `affectedSurfaceHints`. [SOURCE: .opencode/skills/deep-review/references/state_format.md:448] [SOURCE: .opencode/skills/deep-review/references/state_format.md:451]

For the ledger rollout, validation should not stop at "row exists". It should also require reducer-survivable fields: row IDs, `evidenceRefs`, disposition, optional `linkedFindingId`, and at least one dashboard/report-visible aggregate for non-trivial v2 reviews.

## Questions Answered

- Which recommendation is likely to become checkbox theater unless constrained more tightly?
  R3 is the highest risk. A `searchLedger` emitted by the agent is not enough unless the reducer stores it, the dashboard summarizes it, and the report has a dedicated destination.

- What minimal schema proves real bug-search depth without overburdening trivial reviews?
  Use `reviewDepthApplicability` plus `targetSelection` and `searchLedger[]`. Each non-trivial row needs `id`, `dimension`, `bugClass`, `targetRefs`, `searchMethod`, `evidenceRefs`, `disposition`, and either `linkedFindingId`, `ruledOutReason`, `blockedReason`, or `notApplicableReason` depending on disposition. Trivial reviews can set `reviewDepthApplicability:"trivial"` with a reason and one cited scope proof.

- Which validator checks should be hard errors versus warnings during rollout?
  Hard error for v2 standard/complex complete iterations missing ledger rows, uncited rows, invalid dispositions, missing target selection, wrong `findingsNew` severity-count shape, and active findings with shallow `findingDetails`. Warn for legacy records, explicit trivial applicability, graphless runs with a direct-read/exact-search fallback, and non-complete/blocked iterations that explain the missing evidence.

- How should graphless runs prove equivalent search coverage?
  They need text/JSON fallback proof: selected files, omitted high-risk files with reason, direct reads, exact searches, semantic-search unavailability, producer/consumer paths checked manually, negative tests searched, and file:line evidence for both findings and clean rows.

- What seeded tests would fail on the current shallow workflow and pass after follow-up implementation?
  Add a reducer fixture with zero active findings but non-empty `searchLedger` ruled-out rows, clean-path proof, and one deferred search-debt row. Current reducer/dashboard/report would fail because those fields do not surface. After implementation, registry should expose search coverage, dashboard should show search debt next to severity debt, and report synthesis should include a Search Ledger section.

## Questions Remaining

- Should `searchDebt` change provisional verdict from PASS to CONDITIONAL, or remain PASS with a mandatory `hasSearchDebt=true` flag during rollout?
- Should `ruledOutCandidates` live only in the registry, or should the findings registry own a sibling `candidateRegistry` to avoid overloading "finding" semantics?
- What exact v2 threshold should distinguish trivial from standard review: file count, diff size, risk class, requested mode, or a combined selector?

## Ruled Out

- Ruled out using only `Ruled Out` / `Confirmed-Clean` markdown prose as the persistence path. It collapses clean proof and dead-end semantics and does not preserve row-level evidence refs. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936]
- Ruled out relying only on graphEvents for ledger persistence. The current prompt marks `graphEvents` optional, and graphless runs need equivalent text/JSON fallback proof. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:69]
- Ruled out a report-only fix. The report compiler depends on reducer-owned state plus `findingDetails`, so report instructions alone would still lack stable search aggregates. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:1180]

## Dead Ends

- Searching for an existing `searchLedger` implementation in deep-review source found no current reducer or validator surface for it; the term appears in the research synthesis and planned recommendation set, not as shipped code.
- Treating `findingDetails` as the future carrier for all search evidence looked tempting, but it only attaches to active findings. Null-search proof and ruled-out candidates need their own records.

## Sources Consulted

- `.opencode/specs/skilled-agent-orchestration/116-deep-review-complexity/research/research.md`
- `.opencode/skills/deep-review/scripts/reduce-state.cjs`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml`
- `.opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl`
- `.opencode/skills/deep-review/references/state_format.md`

## Reflection

The recommendation set is directionally right, but the implementation sequencing needs one tighter invariant: every new ledger field must have a named persistence owner before enforcement is turned on. Otherwise the workflow will produce better iteration JSON and still synthesize the same severity-only story.

The cleanest contract is: validator proves row quality, reducer proves survivability, dashboard proves operator visibility, and report synthesis proves final-audit visibility.

## Recommended Next Focus

Stress-test graph and convergence gates after persistence: how candidate coverage, search debt, graphless fallback proof, and clean-path rows should block or allow STOP without making trivial reviews heavy.
