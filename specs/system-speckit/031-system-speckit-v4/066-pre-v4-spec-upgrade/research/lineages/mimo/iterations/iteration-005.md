# Iteration 5: Pipeline order and idempotence proof design

## Focus

Q5: the order in which upgrade steps must run so no step undoes an earlier one, and how idempotence is proven.

## Findings

1. **F-028 The hard ordering edge is fingerprint invalidation, and the tooling already encodes it.** Every edit to a source document invalidates the fingerprint stored over it, so sidecar derivation must follow every document edit. repair-derived's repairFolder encodes exactly this: it plans document edits first and a REDERIVE_STEP last, with the comment that skipping the re-derive "swaps one error for another", and it runs the re-derive even after a partial failure so edits that landed never leave a stale fingerprint behind. The same mechanism explains the packet's observation that backfill-frontmatter re-stales the sidecars repair-derived fixed first: it edits source documents after derivation ran. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs repairFolder plan/apply regions, spec.md section 2 order observation]

2. **F-029 The canonical upgrade order.** (1) Folder-level adds first: stub provisioning for FILE_EXISTS and LEVEL_MATCH absences. (2) One composed per-document rewrite pass: frontmatter synthesis, marker synthesis (TEMPLATE_SOURCE, anchors), placeholder and continuity fills, plus one pairwise status-alignment pass per folder. (3) backfill-frontmatter --apply --skip-templates for canonical continuity fields. (4) repair-derived --apply for residual derivable fixes, ending in its re-derive. (5) validate --strict as the gate. (6) The second-run idempotence check. Rationale: every document-editing step precedes every derivation step (F-028); adds precede edits so new stubs receive their edits in the same composed pass; the measured evidence supports backfill before repair-derived (111/686 versus 74/592 at both tags) and the re-stale comment names the failure of the reverse order; renames and policy families stay out of transformation entirely (F-019, F-024). [SOURCE: F-028 mechanism, scratch/harness/bf-pipeline.sh and spec.md section 2 measured rows]

3. **F-030 New document transforms must be composed per document, not sequential steps.** Three observed interactions force this: frontmatter insertion shifts the 70-line TEMPLATE_SOURCE window (F-020); anchor markers are parsed by two rules at once (ANCHORS_VALID and SPEC_DOC_SUFFICIENCY's anchor parser); status alignment is a pairwise operation across spec.md and implementation-summary.md whose buckets must agree (F-018). Sequential single-purpose steps would each re-trigger checks the previous step settled, which is the "no step undoes an earlier one" failure at micro scale. The composed pass writes each file once transactionally, which also serves NFR-R01. [SOURCE: orchestrator.ts TEMPLATE_SOURCE window, check-status-cross-doc-consistency.sh pairwise comparison, iteration 2-3 pattern census]

4. **F-031 The idempotence proof is four checks, and each maps to an existing tool surface.** (a) Step fixed point: after the applied run, rerun each step in its report mode; repair-derived must plan zero edits and no stale-metadata re-derive and backfill's report summary must be zero. (b) SC-002 artifact: a path-plus-sha256 manifest of the specs tree diffed between the end of run one and the end of run two must be empty; this is literally the "count of files the command changed on its second run is zero" evidence. (c) Finding-level: validate --strict JSON output identical between the two runs. (d) Apply-versus-dry-run parity: the applied run's changed-file list must equal the preceding dry-run plan, which is the NFR-R01 guard at run scale (the per-folder model already exists: atomic write, stop-on-failure with failure recorded, re-derive after partial failure). Plus the interaction guard: enumerate every rule class first, then assert after each pipeline step that no new class has appeared. [SOURCE: repair-derived.cjs report fields (planned, authored, beyond, failure), backfill-frontmatter --report contract, scratch/harness/validate-all.cjs, spec.md SC-002 and NFR-R01]

5. **F-032 The "beyond reach" reporting bucket already exists and is the policy layer's landing site.** repair-derived names a beyond category for DERIVABLE rules with no available mechanism (its example: "a reference to a file that is simply gone") and it exists precisely so that a clean run is a finding rather than a definition, which is REQ-005's failure mode documented in code. The policy layer's job for the four-family surface (F-011) is therefore narrow: convert these reported-but-uncleared findings from residual failures into grandfathered advisories for pre-cutoff packets, while post-cutoff packets keep them as errors. The vocabulary and reporting shape need no invention. [SOURCE: repair-derived.cjs repairFolder beyond-reach region and comment]

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs repairFolder (plan, apply, partial-failure, beyond regions, full read)
- scratch/harness/bf-pipeline.sh and spec.md section 2 (measured order evidence and the re-stale observation)
- Iteration 2-4 findings (F-011, F-018, F-019, F-020, F-024) as the dependency inputs

## Assessment

- newInfoRatio: 0.7. The order derivation, the composed-pass requirement and the four-check idempotence proof are new; they assemble mechanisms established in earlier iterations rather than replacing them.
- Questions considered: Q5 (both halves: order and proof).
- Questions answered: Q5 fully. Combined with iterations 2-4, every question except the Q1 packet-level harness check now has its route.
- Confidence: F-028 and F-032 are OBSERVED from tool source. F-029, F-030, F-031 are DERIVED over observed mechanisms and measured evidence.

## Reflection

- What worked: reading repairFolder end to end; its comments state the ordering law (fingerprint invalidation) and the reporting law (beyond reach) that two earlier findings had inferred.
- What failed: nothing this iteration; no step needed a retry.
- Ruled out: sequential single-purpose document-edit steps (F-030 interaction analysis); "idempotence proven by a clean second validate alone" (findings can be stable while files churn; F-031b is the file-granularity artifact SC-002 asks for).

## Recommended Next Focus

Synthesis. Consolidate all 32 findings into research/research.md as the per-class deterministic route table with costs, the artifact-versus-defect provenance classification, the validator-policy layer specification (grandfather pattern plus baseline manifest), the safe archive include mode, and the ordered pipeline with its idempotence proof plan. Record the terminal synthesis with stopReason maxIterationsReached.
