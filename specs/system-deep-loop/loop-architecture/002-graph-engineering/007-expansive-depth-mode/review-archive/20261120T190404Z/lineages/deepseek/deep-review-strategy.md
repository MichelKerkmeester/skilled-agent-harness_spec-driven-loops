---
title: "Deep Review Strategy: expansive-depth program, fan-out lineage deepseek"
description: "Session tracking for the detached deep-review lineage that reviews the expansive-depth program's runtime, command YAML, agents and mirrors."
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.1.0
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Range 21c4b325b5a..de32abbb74d -- the expansive-depth program across `.skilled/skills/system-deep-loop`, `.skilled/commands/deep`, `.skilled/agents` and the `.claude`, `.codex`, `.pi`, `.dsh` and `.vibe` agent mirrors. Runtime code and tests, command YAML and presentation, skill docs, playbooks and catalogs are in scope; specs/ evidence and spec-packet artifacts are excluded.

This is the detached fan-out lineage `deepseek`. The same range is reviewed in parallel by an `opus` lineage; the cross-lineage merge is the authoritative rollup.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

## 4. NON-GOALS
- Spec-packet artifacts under `specs/`: excluded from the target, used only as traceability evidence when a code finding needs the governing contract.
- Generated artifacts the range rebuilt (compiled routing, skill graph, graph metadata, compiled command contracts): pruned as generated artifacts, not reviewable work.
- Fixes: this loop reports findings only. Implementation is a separate follow-up.

---

## 5. STOP CONDITIONS
- Legal convergence at `convergenceThreshold` 0.1, or `maxIterations` 24, whichever comes first.
- `maxDurationMinutes` 120 from `createdAt`.
- Frontier veto: while a dealt node stays open or active the loop continues with reason `frontierOpen`; the three dealt nodes (F-1-003, F-1-005, F-1-007) each owe one pass per canonical dimension before they close.
- Dimension order: correctness, security, traceability, maintainability, rotating across the three frontier nodes; the operator review focus (overengineering, operator UX, cross-CLI parity) is covered inside every iteration.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED
- Iteration 1: reading the fan-out partition and merge paths together exposed the prompt and coverage mismatches quickly; the plan section 3 merge rules mapped one-to-one to the code.
- Iteration 2: governing the reducer against the review doctrine caught the `thought`-visit gap in the new frontier projection; reading the extension step beside its ledger schema confirmed the count-plus-N arithmetic is intentional (AC-004), not an off-by-one.
- Iteration 3: reading the pivot acceptance criterion beside the YAML branch exposed the admission promise the branch does not keep; the attempt-scoped ids and paths held up under a resume and crash-window read.
- Iteration 4: following the focus from argv to the setup binding showed the control-strip and length bound close the injection path; walking env assembly from the allowlist to the overlay confirmed per-kind credential filtering.
- Iteration 5: tracing path shapes through the new source-quality classifier found the POSIX-only split; the rest of the reducer and upsert path handled every state input without a shell or an out-of-packet write.
- Iteration 6: reading the pivot config parser beside its writer confirmed the persistence contract is strict; the graph query path's allowlist and parameter binding closed the metadata and SQL surfaces.
- Iteration 7: checking the feature catalog and playbooks against the fan-out code showed the catalog agrees with the implemented pivot handoff, which narrows the iteration 3 finding's fix to the packet text.
- Iteration 8: matching each acceptance row to a named test showed the extension and evidence-edge requirements are pinned end to end; no requirement rests on prose alone.
- Iteration 9: the catalog's pivot sentence gave the cleanest evidence on the one open contradiction: the shipped docs agree with the code, so the acceptance row is the stale surface.
- Iteration 10: the adapter map and per-rule merge helpers held; the only duplicated rule stayed R1-P2-004.
- Iteration 11: the shared stop/reducer predicate and anchored strategy writers held; the two-reducer frontier helpers remain a two-instance case.
- Iteration 12: the attempt transition's two-step write is the one maintainability cost worth recording; the retry split and per-loop vocabularies stayed ruled out.

---

## 9. WHAT FAILED
- Iteration 2: the first read of the extension step looked like `maxIterations += N` was missing a duration-symmetry rule; the AC-004 checkpoint showed the count-plus-N rule is deliberate, so the direction was dropped rather than reported.
- Iteration 2: treating the duplicated frontier visit/marker code across the two reducers as an overengineering finding failed the two-instance test in `prevent-overengineering.md` section 4; recorded as a ruled-out direction instead.
- Iteration 3: the first read of the review pivot treated the YAML's "pivot adds no frontier node" clause as the settled design; the acceptance criterion says the opposite, so the mismatch became the finding rather than a pass.
- Iteration 4: reading the merge's throwing readers as a security issue failed the range test (they predate the range) and the fail-closed rationale; recorded as context instead.
- Iteration 12: the closeout's `structured_state_findings_partially_reflected_in_registry` warning is a pre-existing false positive on the documented `refines` path; it is recorded, not treated as a range finding, and the report/registry still complete.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `maxIterations` extension lowering the ceiling after an early convergence: AC-004 defines the count-plus-N rule, and the schema check enforces the same identity; not a defect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `maxIterations` extension lowering the ceiling after an early convergence: AC-004 defines the count-plus-N rule, and the schema check enforces the same identity; not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `maxIterations` extension lowering the ceiling after an early convergence: AC-004 defines the count-plus-N rule, and the schema check enforces the same identity; not a defect.

### `thought` records in the global `buildDimensionCoverage`: the missing status filter predates the range; only the new frontier `answered` projection is reported. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `thought` records in the global `buildDimensionCoverage`: the missing status filter predates the range; only the new frontier `answered` projection is reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `thought` records in the global `buildDimensionCoverage`: the missing status filter predates the range; only the new frontier `answered` projection is reported.

### A corrupt-lineage merge abort as a range finding: the readers predate the range and fail closed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A corrupt-lineage merge abort as a range finding: the readers predate the range and fail closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A corrupt-lineage merge abort as a range finding: the readers predate the range and fail closed.

### A duplication finding for the two mode-specific pivot builders: the shared transaction lives in the library; the builders carry genuinely different seats and triggers. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: A duplication finding for the two mode-specific pivot builders: the shared transaction lives in the library; the builders carry genuinely different seats and triggers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A duplication finding for the two mode-specific pivot builders: the shared transaction lives in the library; the builders carry genuinely different seats and triggers.

### A lint-style duplication finding for the two YAML retry blocks: the workflows are separate contracts and the contract-drift check is the existing guard. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A lint-style duplication finding for the two YAML retry blocks: the workflows are separate contracts and the contract-drift check is the existing guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A lint-style duplication finding for the two YAML retry blocks: the workflows are separate contracts and the contract-drift check is the existing guard.

### A new catalog finding for the pivot sentence: it matches the code and is the evidence that R3-P1-001 is stale packet text. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A new catalog finding for the pivot sentence: it matches the code and is the evidence that R3-P1-001 is stale packet text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new catalog finding for the pivot sentence: it matches the code and is the evidence that R3-P1-001 is stale packet text.

### A new finding for the catalog's "produced evidence" sentence: the same rule is already R2-P1-001, and splitting it would double-count one defect across code and docs. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A new finding for the catalog's "produced evidence" sentence: the same rule is already R2-P1-001, and splitting it would double-count one defect across code and docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new finding for the catalog's "produced evidence" sentence: the same rule is already R2-P1-001, and splitting it would double-count one defect across code and docs.

### A playbook/code mismatch: the DRV-081 and DRV-083 commands and named cases exist as written. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A playbook/code mismatch: the DRV-081 and DRV-083 commands and named cases exist as written.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A playbook/code mismatch: the DRV-081 and DRV-083 commands and named cases exist as written.

### A projection-parity finding between research and review: both project `extended` rows with lineage mode, `continuedFromRun` and the budget, and the review row carries the leaf fields this lineage's state log shows. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A projection-parity finding between research and review: both project `extended` rows with lineage mode, `continuedFromRun` and the budget, and the review row carries the leaf fields this lineage's state log shows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A projection-parity finding between research and review: both project `extended` rows with lineage mode, `continuedFromRun` and the budget, and the review row carries the leaf fields this lineage's state log shows.

### A research frontier revisit source: missing by design; the sixth source is a deep-review-only sentence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A research frontier revisit source: missing by design; the sixth source is a deep-review-only sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A research frontier revisit source: missing by design; the sixth source is a deep-review-only sentence.

### A retry-parity finding between the two loops: both YAMLs and both scripts carry the same one-time rule. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A retry-parity finding between the two loops: both YAMLs and both scripts carry the same one-time rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A retry-parity finding between the two loops: both YAMLs and both scripts carry the same one-time rule.

### A review-run `DERIVED_FROM` write: the research frontier graph step is the only caller, and the review relation vocabulary excludes it. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A review-run `DERIVED_FROM` write: the research frontier graph step is the only caller, and the review relation vocabulary excludes it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A review-run `DERIVED_FROM` write: the research frontier graph step is the only caller, and the review relation vocabulary excludes it.

### A stale-mirror finding: all six agent surfaces carry the new contract, so the differences are runtime packaging only. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A stale-mirror finding: all six agent surfaces carry the new contract, so the differences are runtime packaging only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale-mirror finding: all six agent surfaces carry the new contract, so the differences are runtime packaging only.

### A symlink-following write through the reducer outputs as a range finding: the writers predate the range and the effect stays inside or is caught by containment. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A symlink-following write through the reducer outputs as a range finding: the writers predate the range and the effect stays inside or is caught by containment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A symlink-following write through the reducer outputs as a range finding: the writers predate the range and the effect stays inside or is caught by containment.

### A vocabulary finding for `DERIVED_FROM`: it is research-only and the review graph never emits it. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: A vocabulary finding for `DERIVED_FROM`: it is research-only and the review graph never emits it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A vocabulary finding for `DERIVED_FROM`: it is research-only and the review graph never emits it.

### A Windows path finding for the playbook: the code advisory R5-P2-001 already carries it; the playbook omission is its doc side. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A Windows path finding for the playbook: the code advisory R5-P2-001 already carries it; the playbook omission is its doc side.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A Windows path finding for the playbook: the code advisory R5-P2-001 already carries it; the playbook omission is its doc side.

### Abstracting the two reducers' frontier visit, marker and ranking blocks: exactly two instances with contract-driven divergence, and `prevent-overengineering.md` section 4 says two is a coincidence, so extracting them now would buy a wrong abstraction. Named what would change the judgment: a third frontier consumer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Abstracting the two reducers' frontier visit, marker and ranking blocks: exactly two instances with contract-driven divergence, and `prevent-overengineering.md` section 4 says two is a coincidence, so extracting them now would buy a wrong abstraction. Named what would change the judgment: a third frontier consumer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Abstracting the two reducers' frontier visit, marker and ranking blocks: exactly two instances with contract-driven divergence, and `prevent-overengineering.md` section 4 says two is a coincidence, so extracting them now would buy a wrong abstraction. Named what would change the judgment: a third frontier consumer.

### Collapsing the library retry loop and the YAML retry step: different owners and different dispatch models. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Collapsing the library retry loop and the YAML retry step: different owners and different dispatch models.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Collapsing the library retry loop and the YAML retry step: different owners and different dispatch models.

### Duplicate `node -e` extend scripts across the two YAML assets: the duplication predates the range and the copies track real config-shape differences (research nests lineage fields and has an inbox), so it is not a range-introduced overengineering finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Duplicate `node -e` extend scripts across the two YAML assets: the duplication predates the range and the copies track real config-shape differences (research nests lineage fields and has an inbox), so it is not a range-introduced overengineering finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate `node -e` extend scripts across the two YAML assets: the duplication predates the range and the copies track real config-shape differences (research nests lineage fields and has an inbox), so it is not a range-introduced overengineering finding.

### Extracting the duplicated PRE-BOUND block from `buildNativeCommandInput` and `buildLoopPrompt`: two instances with different delivery surfaces, and `prevent-overengineering.md` section 4 keeps them separate until a third caller appears. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Extracting the duplicated PRE-BOUND block from `buildNativeCommandInput` and `buildLoopPrompt`: two instances with different delivery surfaces, and `prevent-overengineering.md` section 4 keeps them separate until a third caller appears.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting the duplicated PRE-BOUND block from `buildNativeCommandInput` and `buildLoopPrompt`: two instances with different delivery surfaces, and `prevent-overengineering.md` section 4 keeps them separate until a third caller appears.

### Extracting the PRE-BOUND block into a shared builder: two delivery paths, two lists, no third caller. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Extracting the PRE-BOUND block into a shared builder: two delivery paths, two lists, no third caller.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting the PRE-BOUND block into a shared builder: two delivery paths, two lists, no third caller.

### Extracting the two reducers' marker/visit helpers at two instances: no third consumer, and the attribution rules differ by contract. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Extracting the two reducers' marker/visit helpers at two instances: no third consumer, and the attribution rules differ by contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting the two reducers' marker/visit helpers at two instances: no third consumer, and the attribution rules differ by contract.

### Flat partition-guard set collision: a missing depth-1 node cannot be masked by another lineage's node because depth-1 ids are minted once by the shared seed; only child ids repeat per lineage, and those are qualified before the set is built. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Flat partition-guard set collision: a missing depth-1 node cannot be masked by another lineage's node because depth-1 ids are minted once by the shared seed; only child ids repeat per lineage, and those are qualified before the set is built.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Flat partition-guard set collision: a missing depth-1 node cannot be masked by another lineage's node because depth-1 ids are minted once by the shared seed; only child ids repeat per lineage, and those are qualified before the set is built.

### Locale-dependent ordering of merged lists: the merge sorts with code-unit `compareText` everywhere, so only the partition assignment (finding 2) is exposed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Locale-dependent ordering of merged lists: the merge sorts with code-unit `compareText` everywhere, so only the partition assignment (finding 2) is exposed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Locale-dependent ordering of merged lists: the merge sorts with code-unit `compareText` everywhere, so only the partition assignment (finding 2) is exposed.

### Moving the two convergence predicates into a new module: it relocates a two-caller helper without shrinking the surface. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Moving the two convergence predicates into a new module: it relocates a two-caller helper without shrinking the surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving the two convergence predicates into a new module: it relocates a two-caller helper without shrinking the surface.

### Overwriting the pivot config twice when attempt 2 opens: the first write replays the attempt-1 record and the second adopts attempt 2; a crash between them is recoverable and leaves no contradictory state. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overwriting the pivot config twice when attempt 2 opens: the first write replays the attempt-1 record and the second adopts attempt 2; a crash between them is recoverable and leaves no contradictory state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overwriting the pivot config twice when attempt 2 opens: the first write replays the attempt-1 record and the second adopts attempt 2; a crash between them is recoverable and leaves no contradictory state.

### Prompt injection from an admitted frontier node into a sibling lineage: post-spawn admissions stay in the lineage's own store and prompt; the shared seed questions come from the orchestrator. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Prompt injection from an admitted frontier node into a sibling lineage: post-spawn admissions stay in the lineage's own store and prompt; the shared seed questions come from the orchestrator.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt injection from an admitted frontier node into a sibling lineage: post-spawn admissions stay in the lineage's own store and prompt; the shared seed questions come from the orchestrator.

### Re-reporting the evidence-edge code as untested: six integration cases cover the stated shapes. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Re-reporting the evidence-edge code as untested: six integration cases cover the stated shapes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the evidence-edge code as untested: six integration cases cover the stated shapes.

### Re-reporting the extension arithmetic as a defect: the catalog, tests and code agree on count-plus-N. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Re-reporting the extension arithmetic as a defect: the catalog, tests and code agree on count-plus-N.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reporting the extension arithmetic as a defect: the catalog, tests and code agree on count-plus-N.

### Recording six seat outputs for an attempt-1 quorum miss that returned only two: REQ-002 explicitly defines the recorded total as `3 * attempt`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Recording six seat outputs for an attempt-1 quorum miss that returned only two: REQ-002 explicitly defines the recorded total as `3 * attempt`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recording six seat outputs for an attempt-1 quorum miss that returned only two: REQ-002 explicitly defines the recorded total as `3 * attempt`.

### Reporting file size or file count as a maintainability defect: no concrete change in this range paid a cost for it. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Reporting file size or file count as a maintainability defect: no concrete change in this range paid a cost for it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting file size or file count as a maintainability defect: no concrete change in this range paid a cost for it.

### Reporting the plain writers as a maintainability defect: the asymmetry predates the range and is a hardening note. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Reporting the plain writers as a maintainability defect: the asymmetry predates the range and is a hardening note.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reporting the plain writers as a maintainability defect: the asymmetry predates the range and is a hardening note.

### Research `all_questions_answered` after an exhausted node: REQ-005 deliberately marks the terminal node's question resolved so it leaves the open set; the code matches. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Research `all_questions_answered` after an exhausted node: REQ-005 deliberately marks the terminal node's question resolved so it leaves the open set; the code matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Research `all_questions_answered` after an exhausted node: REQ-005 deliberately marks the terminal node's question resolved so it leaves the open set; the code matches.

### Retrying the library `runDivergentPivot` loop and the YAML step in two places: the library is the packaged transaction API and the YAML must orchestrate native seat dispatch across steps, so neither can own the other's retry; two instances do not justify a shared abstraction. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Retrying the library `runDivergentPivot` loop and the YAML step in two places: the library is the packaged transaction API and the YAML must orchestrate native seat dispatch across steps, so neither can own the other's retry; two instances do not justify a shared abstraction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying the library `runDivergentPivot` loop and the YAML step in two places: the library is the packaged transaction API and the YAML must orchestrate native seat dispatch across steps, so neither can own the other's retry; two instances do not justify a shared abstraction.

### Shell injection through model, focus, target or node text: no adapter shells out, and the two static `/bin/sh -c command -v` probes carry no input. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Shell injection through model, focus, target or node text: no adapter shells out, and the two static `/bin/sh -c command -v` probes carry no input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through model, focus, target or node text: no adapter shells out, and the two static `/bin/sh -c command -v` probes carry no input.

### SQL injection through node names, metadata or namespace values: every value is bound, and the only interpolated SQL fragments are fixed column/table names. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: SQL injection through node names, metadata or namespace values: every value is bound, and the only interpolated SQL fragments are fixed column/table names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SQL injection through node names, metadata or namespace values: every value is bound, and the only interpolated SQL fragments are fixed column/table names.

### The `/tmp` fallback as a range finding: the line predates the range; recorded as a portability observation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The `/tmp` fallback as a range finding: the line predates the range; recorded as a portability observation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `/tmp` fallback as a range finding: the line predates the range; recorded as a portability observation.

### Treating leaf-authored finding paths as an injection boundary: they are already rendered as untrusted prose in every review artifact, and no new evaluator consumes them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating leaf-authored finding paths as an injection boundary: they are already rendered as untrusted prose in every review artifact, and no new evaluator consumes them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating leaf-authored finding paths as an injection boundary: they are already rendered as untrusted prose in every review artifact, and no new evaluator consumes them.

### Treating the caller-provided `--paths-json` as a boundary bypass: only the orchestrator calls `finalize`, and it passes its own prepare output. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the caller-provided `--paths-json` as a boundary bypass: only the orchestrator calls `finalize`, and it passes its own prepare output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the caller-provided `--paths-json` as a boundary bypass: only the orchestrator calls `finalize`, and it passes its own prepare output.

### Treating the reused persisted pivot limits as a range security defect: the reuse is a documented deviation that keeps a resumed prepare from conflicting with its own recorded state, and the leaf already owns its lineage writes. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the reused persisted pivot limits as a range security defect: the reuse is a documented deviation that keeps a resumed prepare from conflicting with its own recorded state, and the leaf already owns its lineage writes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the reused persisted pivot limits as a range security defect: the reuse is a documented deviation that keeps a resumed prepare from conflicting with its own recorded state, and the leaf already owns its lineage writes.

### Treating the whole-merge abort on one corrupt lineage log as a security finding: the throwing readers predate the range and the behavior is fail-closed rather than silently merging a corrupt registry. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the whole-merge abort on one corrupt lineage log as a security finding: the throwing readers predate the range and the behavior is fail-closed rather than silently merging a corrupt registry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the whole-merge abort on one corrupt lineage log as a security finding: the throwing readers predate the range and the behavior is fail-closed rather than silently merging a corrupt registry.

<!-- /ANCHOR:exhausted-approaches -->

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. All three dealt nodes cover correctness, security, traceability and maintainability; the frontier is answered and the run proceeds to synthesis with stop reason `converged` / reasonDetail `frontier_drained`. - Reason: the dealt frontier holds no open or active node and at least one answered node, which is the legal `frontier_drained` candidate once the stop gates pass. - Required evidence: the findings registry, the merged state log and the iteration files this synthesis reads. - Rotation status: complete. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `21c4b325b5a..de32abbb74d` over `.skilled/skills/system-deep-loop`, `.skilled/commands/deep`, `.skilled/agents` and the `.claude`, `.codex`, `.pi`, `.dsh`, `.vibe` agent mirrors. The range adds ~25k lines across 232 files; the frontier nodes partition the reviewable work.
- Behavior claims: `SKILL.md` §Expansive Depth Mode, `references/protocol/loop-protocol.md` §Expansive Depth Frontier, `references/convergence/convergence.md` §Expansive Depth Mode, and the `deep-review.yaml`/`deep-research.yaml` steps that implement them.
- Reuse and conventions: `append-mode-event.cjs` is the only state-log writer; `reduce-state.cjs` owns registry/dashboard/strategy; `sk-git`, `sk-code` and `sk-doc` conventions apply to their surfaces.
- Review risks and gaps: the range is larger than any single iteration can read; each iteration records what it could not read rather than treating absence as a pass.

---

## 13. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 3 | 001/010/012 requirements match; 011 REQ-007's pivot-candidate admission clause does not (accepted direction becomes focus text only). |
| `checklist_evidence` | core | partial | 3 | AC-004/AC-018/AC-019 match; AC-008's admission evidence claim is not met by the cited branch. |
| `skill_agent` | overlay | pass | 7 | Deep-review SKILL.md and the agent definition carry the same depth-mode, veto and frontier-row contract. |
| `agent_cross_runtime` | overlay | pass | 7 | Canonical and five mirrors carry the new frontier contract; differences are runtime frontmatter only. |
| `feature_catalog_code` | overlay | partial | 7 | Expansive-depth catalog matches the code except the "produced evidence" sentence, which undercounts the statuses R2-P1-001 names. |
| `playbook_capability` | overlay | pass | 7 | DRV-081 and DRV-083 commands, case names and expectations match the code. |

---

## 14. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `fanout-merge.cjs` | correctness, security, traceability, maintainability | 10 | 4 P2 | complete |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | correctness, security, traceability, maintainability | 11 | 1 P1, 5 P2 | complete |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | correctness, security, maintainability | 11 | - | complete |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | correctness, security, maintainability | 11 | - | complete |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | correctness, security, traceability | 8 | 1 P2 | complete |
| `.skilled/skills/system-deep-loop/runtime/scripts/{verify,dispatch}-iteration.cjs` | correctness, security | 5 | - | complete |
| `runtime/lib/deep-review-ledger-schema`, `deep-review-reducers`, `legacy-projections` | correctness, traceability | 8 | - | complete |
| `runtime/lib/deep-loop/divergent-pivot.ts`, `deep-review/scripts/divergent-review-pivot.ts` | correctness, security, traceability, maintainability | 12 | 1 P1, 1 P2 | complete |
| `runtime/lib/deep-loop/continuity-thread.cjs`, `runtime/lib/coverage-graph` | correctness, security, traceability | 9 | - | complete |

---

## 15. REVIEW BOUNDARIES
- Max iterations: 24
- Convergence threshold: 0.1
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-1795113418367-pvzn7z, parentSessionId=(none), generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-19T18:41:16.000Z
