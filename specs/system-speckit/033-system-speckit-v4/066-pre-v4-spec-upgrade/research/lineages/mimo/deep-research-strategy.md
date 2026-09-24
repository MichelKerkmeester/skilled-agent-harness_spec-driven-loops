# Deep Research Strategy - Session Tracking

## 1. SESSION

Session: fanout-mimo-1790242274086-9tq1wi | Executor: cli-pi model=mimo-v2.6-pro | Mode: auto | Stop policy: max-iterations (5)

## 2. TOPIC

How can every spec folder written under spec-kit v3.x (tags v3.0.0.0 and v3.6.0.0) reach a full pass under the v4 validate.sh --strict without authored LLM edits? Evidence: spec.md sections 2 and 10 of this packet, and residual per-packet data in scratch/harness/data/.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Q1: For each residual rule in the data (ANCHORS_VALID, GREP_CONVENTION, GENERATED_METADATA_INTEGRITY, STATUS_CROSS_DOC_CONSISTENCY, LEVEL_MATCH, FILE_EXISTS, FRONTMATTER_MEMORY_BLOCK, TEMPLATE_SOURCE, SCAFFOLD_NEVER_TOUCHED, METADATA_DISK_PATH_CONSISTENCY, FOLDER_NAMING, SPEC_DOC_INTEGRITY, SPEC_DOC_SUFFICIENCY, AI_PROTOCOLS, TOC_POLICY, CANONICAL_SAVE_LINEAGE_REQUIRED), what deterministic transformation or validator policy makes the packet pass without authored content, and what does each cost?
- [ ] Q2: Which residual findings are artifacts of v4 rules applied to documents the v3 templates never required, and which are defects the documents had under v3 as well?
- [ ] Q3: Where no transformation is safe, what is the least validator change that lets the packet pass while keeping every new finding an error?
- [ ] Q4: Why do the two repair tools skip archived packets, and what breaks if the upgrade includes them?
- [ ] Q5: In what order must the steps run so no step undoes an earlier one, and how is idempotence proven?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not author or rewrite historical packet prose with an LLM.
- Do not modify production tooling, validators, packet specs, or harness inputs during this research run.
- Do not run validate.sh, repair tools, generate-context.js, git write commands, or nested executor dispatches.
- Do not write any file outside this lineage directory.

## 5. STOP CONDITIONS

- Execute exactly five evidence-gathering iterations because max-iterations is the terminal policy.
- Treat early convergence as telemetry only and broaden the review angle until iteration five.
- Synthesis must record stopReason `maxIterationsReached`.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Q1 (partial, iteration 2): every one of the 20 residual classes now has a named route (deterministic transform, templated stub, or validator policy) with its cost. The packet-level harness check remains.
- Q2 (resolved, iteration 3): the classification is delivered in F-015/F-016; the one residue (enforcement-at-tag) is tracked under Carried-Forward Open Questions.
- Q3 (resolved, iteration 3): the least validator change is extending the creation-date grandfather pattern from check-ac-closure.sh to the policy surface (F-019); cutoff mechanics are pinned in F-025 with a named later-edit gap and two closure candidates.
- Q4 (resolved, iteration 4): four-mechanism archive answer in F-022 to F-024; one inferred residual (the graph-metadata child's switch default) tracked under Carried-Forward Open Questions.
- Q5 (resolved, iteration 5): canonical order (F-029) and the four-check idempotence proof (F-031) delivered from the write-dependency graph.

The reducer-style sections below are refreshed after each iteration.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- The packet's own summarizers (classify.cjs, agg.cjs) are read-only and can ground counts without touching the tree.
- Dual derivation (harness agg.cjs plus an independent tally) produced identical numbers, so the baseline is cross-checked.
- Sampling one detail per rule from active failing rows exposed transform candidates inside classes classify.cjs scores as authored.
- Normalizing detail strings into pattern families (iteration 2) collapsed 1,235 apparent METADATA_DISK_PATH_CONSISTENCY patterns into one family and made per-class verdicts possible.
- Deriving the projection twice with independent engines (iteration 2) kept the M tier and the endpoint honest; the disagreement it exposed was in the class map, not the data.
- Tag-tree greps instead of history scans (iteration 3) answered "did this check exist when these documents were written" directly, where git log -S timed out twice.
- Reading the shell rule checkers (iteration 3) resolved both open mechanics at once: the entry-status axis and the enforcement-switch inventory.
- Reading the tools' own comments and CLI contracts (iteration 4) answered "why archives are skipped" in one sentence the packet summary never carried.
- Reading repairFolder end to end (iteration 5) surfaced its comments stating the ordering law (fingerprint invalidation) and the reporting law (beyond reach) that earlier findings had only inferred.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- The normal fan-out runner and its nested executor dispatch are intentionally not used in this detached executor.
- A dashboard write used a mistyped absolute path (doubled Development/ segment) and created one file outside the repository; preserved per write-containment contract and logged as containment_advisory.
- A case-sensitive status-pair regex (iteration 2) matched zero rows and hid F-009's distribution until it was corrected.
- The append gateway's state-log projection is refused in this lineage (ATTRIBUTION_COLLAPSE on the fat legacy config row); the authorized copy lands in deep-research-ledger and the readable row is hand-appended in the iteration-1 shape. The synthesis_complete event type is refused at the gateway's lossless-mapping check, so the terminal record lives in the readable log only.
- reduce-state.cjs cannot target a fan-out lineage: its resolver hardcodes {specFolder}/research/, so reducer-owned surfaces are refreshed inside the lineage by hand and this is recorded as a deviation.
- Iteration 2 read the STATUS_CROSS_DOC detail lines as self-contained pairs and drew a transform that cannot clear the rule; corrected by F-018 after reading the checker.
- The first read of the archive question (iteration 4) assumed one skip mechanism and nearly missed that z_future is excluded at a different layer than z_archive (F-023).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Running repository repair or validation commands is out of scope for this lineage because those commands write outside the lineage or are explicitly prohibited.
- Migrating the legacy config row to unblock the gateway projection: rejected as destructive, because a projection replace would also drop the three non-ledger legacy rows (iteration-1 record, spec_check_result, containment_advisory).
- git log -S over full history for rule provenance: timed out twice; replaced by tag-tree greps.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Authored LLM edits are ruled out by the packet's stated purpose and scope.
- Warn-severity detail implies a warning entry that --strict ignores (iteration 2: those details sit under error-status entries).
- STATUS_CROSS_DOC_CONSISTENCY needs content judgment (iteration 2: every pair is a token canonicalization to the rule's own classified value).
- Token canonicalization alone as the STATUS_CROSS_DOC clearing route (iteration 3: the rule compares cross-doc buckets).
- Blanking one document's Status to reach the not-applicable branch (iteration 3: masks future findings).
- Global ENFORCE=false demotion as the upgrade path (iteration 3: weakens rules for new documents).
- z_future is skipped by repair-derived's frozen set or name gate (iteration 4: 37 of 39 pass the gate; exclusion lives in the graph-metadata child).
- Corpus fixture-shaped folders are live test inputs (iteration 4: tests bind to their own fixtures root).
- Created-date cutoff keying alone satisfies the later-edit edge case (iteration 4: post-cutoff edits stay advisory).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: residual baseline counting (iteration 1); per-class pattern families and transform verdicts (iteration 2); rule provenance and policy-lever inventory (iteration 3); archive skip mechanics and cutoff mechanics (iteration 4); pipeline order and idempotence proof (iteration 5)
- Pivot lineage: none yet
- Remaining frontier: none inside this run's charter; the carried-forward residues and the Q1 packet-level check are follow-on work for the build step.
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Enforcement-at-tag: rule-id presence at v3.0.0.0/v3.6.0.0 is observed, but whether each check was enforced (versus advisory) in the tag's own validate flow is INFERRED; confirm by running each tag's validator or reading its rule dispatch.
- The graph-metadata child's archive switch default direction (F-023): whether backfill-graph-metadata excludes z_future by default when repair-derived invokes it per folder.
- The later-edit gap closure (F-025): baseline manifest versus touch-date coupling, and which one the build step adopts.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis: consolidate the 32 findings into research.md as the per-class route table with costs, the provenance classification, the policy-layer specification (grandfather pattern plus baseline manifest), the safe archive include mode and the ordered pipeline with its idempotence proof plan; emit resource-map.md from the converged deltas; record the terminal synthesis with stopReason maxIterationsReached.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. RESEARCH BOUNDARIES

- Sources: spec.md (sections 2 and 10), scratch/harness/data/*.jsonl, scratch/harness scripts, the v4 validator and repair tool sources, git history of the validator rules (read-only), the v3.x corpus shape as recorded in the data.
- Every finding cites [SOURCE: file:line] or [SOURCE: path].
