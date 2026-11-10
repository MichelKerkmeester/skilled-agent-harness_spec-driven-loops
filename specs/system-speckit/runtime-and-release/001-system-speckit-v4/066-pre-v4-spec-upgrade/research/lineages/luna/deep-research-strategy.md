# Deep Research Strategy - Session Tracking

## 2. TOPIC

How can every spec folder written under spec-kit v3.x (tags v3.0.0.0 and v3.6.0.0) reach a full pass under the v4 validate.sh --strict without authored LLM edits? Evidence and research questions: the packet's sections 2 and 10 and residual per-packet data in scratch/harness/data.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Which residual rule classes can deterministic transformations clear without authored content, and what does each cost?
- [x] Which residuals are v4-only contract additions versus defects already present under v3?
- [x] Which residuals require the least validator-policy change, and how can new v4 findings remain errors?
- [x] Why are archived packets skipped, and what explicit include behavior is safe?
- [x] What ordering and idempotence proof make the upgrade command deterministic and failure-reporting?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not author or rewrite historical packet prose with an LLM.
- Do not modify production tooling, validators, packet specs, or harness inputs during this research run.
- Do not run validate.sh, repair tools, git writes, continuity saves, or nested executor dispatches.

## 5. STOP CONDITIONS

- Execute exactly five evidence-gathering iterations because max-iterations is the terminal policy.
- Treat early convergence as telemetry only and broaden the review angle until iteration five.
- Synthesis must record stopReason `maxIterationsReached`.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Deterministic repair is limited to facts derivable from authoritative packet and filesystem state; authored truth claims remain strict or explicitly reviewed.
- v3.0.0.0 supplies the core structural contract, v3.6.0.0 adds continuity/graph/save surfaces, and current v4 hardening must be classified per rule.
- Strict-by-default with a per-rule historical evidence manifest is the least-invasive policy that preserves new v4 errors.
- `z_archive` and `z_future` require separate explicit scope accounting; frozen archive snapshots are read-only by default.
- Source normalization must precede derived repair and strict validation, followed by structured failure inspection and a repeated-run no-op proof.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Packet-local JSONL aggregation exposes active versus archived residual classes with counts.
- The packet's measured totals and representative JSONL rows establish a reproducible active baseline without running repository tooling.
- The current registry, native orchestrator, shell bridges, and v3 tag files expose source-of-truth inputs and a three-tier repair boundary.
- Tag-era comparison shows a mixed per-rule provenance matrix: legacy contracts, v3.6 continuity/graph contracts, and current v4 hardening.
- Existing repair and backfill tools expose enough dry-run, archive, and failure-reporting behavior to define a strict four-lane migration policy.
- The existing wrappers and tool reports expose an ordered source-to-derived-to-strict pipeline, but require an explicit fail-closed ledger and a second-run no-op assertion.
- Stable graph hashing, re-derivation after source edits, and bounded validator rows define the observable fingerprint and evidence obligations for deterministic completion.
- Five iterations completed with a declining but still informative new-information trend; the configured cap, not early convergence, ended the loop.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- The normal fan-out runner and its nested executor dispatch are intentionally not used in this detached executor.
- The capped per-rule details cannot serve as a complete repair inventory; rule implementations and provenance must be inspected next.
- Rule names alone do not establish v4 provenance; several structural contracts are visible in v3 tag surfaces and need a version-aware policy map.
- Packet-level grandfathering is inadequate because individual rows mix legacy defects and current hardened findings.
- Archive traversal is tool-specific; a shared scope manifest is required for an every-folder proof.
- Shell exit status is insufficient because graph backfill can report failures while returning zero; structured summaries must be inspected.
- Running derived repair before source normalization is unsafe because source edits invalidate the previous derived fingerprint.
- A bounded residual detail stream is insufficient as the only evidence ledger; stage reports and aggregate counts are required.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Running repository repair or validation commands is out of scope for this lineage because those commands write outside the lineage or are explicitly prohibited.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Authored LLM edits are ruled out by the packet's stated purpose and scope.
- An active-only migration is ruled out because all measured archived packets fail under the default skip policy.
- Treating a pass rate or exit status as proof of complete repair is ruled out because the harness preserves rule-level counts and reports non-empty tool failures separately.
- Blanket regeneration and empty-shape repairs are ruled out because generated metadata, continuity, and sufficiency gates require truthful source inputs.
- Treating all v3.0 residuals as compatibility debt or all v3.6 residuals as legacy defects is ruled out by tag inventories and concrete diagnostics.
- A global grandfather switch and implicit archive inclusion are ruled out as completion policies.
- Shell exit status as the sole completion proof, reverse stage order, and bounded residual details as the complete inventory are ruled out.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 5
- Failed pivots: 0
- Audited overrides: 3
- Saturated: baseline aggregation and active/archive split
- Pivot lineage: iteration 1 baseline -> iteration 2 validator implementation and provenance mapping -> iteration 3 tag-era residual audit -> iteration 4 policy and archive contract -> iteration 5 ordering/idempotence proof
- Remaining frontier: final synthesis and terminal stop-reason record.
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

The active/archive denominator, three-tier repair boundary, per-rule provenance matrix, four-lane strict policy, and ordered idempotence proof are resolved in the final synthesis.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete: five questions resolved; terminal stopReason `maxIterationsReached` recorded.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `spec.md` sections 2 and 10, `scratch/harness/data/v3.0.0.0.final.jsonl`, and `scratch/harness/data/v3.6.0.0.pipeline.jsonl`.
- Reuse candidates: `scratch/harness/agg.cjs`, `classify.cjs`, `validate-all.cjs`, `fullrun.sh`, and `bf-pipeline.sh`.
- Integration points: `validate.sh --strict`, `repair-derived.cjs`, `backfill-frontmatter.js`, `backfill-graph-metadata.ts`, validator rule implementations, and changed-packet CI.
- Constraints and risks: all writes are confined to this lineage; source content is read-only evidence; early convergence does not end this run.

`resource-map.md` was absent at init (and therefore not part of the init coverage gate) and was emitted during final synthesis from the converged source inventory.

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Canonical synthesis: `research.md`
- Stop policy: max-iterations
- Session: `fanout-luna-1790242274086-9tq1wi`
- Executor: `cli-codex model=gpt-5.6-luna`
- Artifact directory: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/specs/system-speckit/033-system-speckit-v4/051-pre-v4-spec-upgrade/research/lineages/luna`
- Started: 2026-09-24T09:34:29.000Z
