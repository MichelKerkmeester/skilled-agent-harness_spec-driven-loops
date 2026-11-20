# Deep Research Strategy - Lineage deepseek (generation 4)

## 2. TOPIC

What changes would make the deep-loop fan-out orchestration trustworthy and identical across CLI runtimes, ranked by value over effort, given what the last two expansive dogfood runs taught? This lineage holds frontier nodes F-1-002 (cross-CLI execution contract), F-1-004 (frontier economics) and F-1-006 (bookkeeping that fires on a healthy run).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences?
- [x] Frontier economics: how should the node cap, growth slots, depth-band split and duplicate work change (5 of 7 proposals pruned at iteration 1 last run), and should held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node dashboard) be built, in which order?
- [x] Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm on a finding refined into an earlier id, the research commit step failing on an ignored pathspec exclude, the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.
- [x] Is the cli-adapter stress suite part of any default test or CI gate, and which matrix cells remain pending at HEAD?
- [x] Does any runner path read EXECUTOR_SESSION_ENV_BY_KIND and persist a provider session id for a --only-lineage rerun, or is it detection-only?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Re-reporting a backlog row this packet already delivered: rows 1-11, 14, 16b, 18a and 19-26 were built by commits `adade6c293e..07cf5f92b61`.
- Implementing any fix. This run reports only; no code or doc outside the lineage directory changes.
- Working another lineage's frontier share (Q1 lineage honesty, Q3 orchestration robustness, Q5 prior art are owned elsewhere).

---

## 5. STOP CONDITIONS

- The frontier share for this lineage is drained (all three nodes answered, exhausted or blocked) and the convergence floor has cleared.
- The 10-iteration cap is reached.
- Three consecutive failed iterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Cross-CLI execution contract: where do permission and sandbox, effort, output format, session resume, failure classes, log shape and prompt channel still differ across LINEAGE_COMMAND_ADAPTERS, executor-config.ts and dispatch-iteration.cjs, and what single adapter contract and conformance test (agent and command mirrors included) would remove the differences?
- Frontier economics: how should the node cap, growth slots, depth-band split and duplicate work change (5 of 7 proposals pruned at iteration 1 last run), and should held backlog rows 12 (one projectFrontier), 13 (one executor path), 29 (alias and dead-probe deletion) and 30 (per-node dashboard) be built, in which order?
- Bookkeeping that fires on a healthy run: the synthesis_incomplete alarm on a finding refined into an earlier id, the research commit step failing on an ignored pathspec exclude, the closeout lineageId taken from the parent session, and any other invariant or warning this run shows firing without a real fault.
- Is the cli-adapter stress suite part of any default test or CI gate, and which matrix cells remain pending at HEAD?
- Does any runner path read EXECUTOR_SESSION_ENV_BY_KIND and persist a provider session id for a --only-lineage rerun, or is it detection-only?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the builders and the single-executor branches side by side made the sandbox divergence visible in one pass; the two paths share a name but not a resolver. Running the mirror gates turned a plausible drift claim into a checked negative, which is stronger than another recommendation. (iteration 1)
- reading `seedBudget` and `checkProposal` together made the arithmetic exact; the FRONTIER block then confirmed the prediction in the same iteration, which is stronger than a code-only inference. (iteration 2)
- comparing iteration 1's `insertedNodes: 0` with iteration 2's `insertedNodes: 9` isolated the answered-question guard without a second experiment; the delta was otherwise identical in shape. (iteration 3)
- mapping every contract field to a difference found in iteration 1 kept the design from becoming an aspiration; each field has a failure it prevents and a file:line that shows the failure today. (iteration 4)
- running the validator and then its underlying command separated "the tests are missing" from "the parser is stale" in two calls; the exit code alone would have been misleading. (iteration 5)
- following the constant to its only caller settled "detection-only" in one grep; the absence of any resume flag in the builders settled the other half. (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- grepping for a stored provider session id found nothing, because the runner never stores one. That absence is itself the finding, but it cost a search to establish. (iteration 1)
- I first expected a per-band cap in `readCaps`; there is none, and the time spent there showed the band split is a reducer-only concept. (iteration 2)
- an initial grep for refinement logic in `synthesis-closeout.cjs` returned nothing, which looked like a missing file at first; the absence is the finding, but I spent a call confirming the file was read. (iteration 3)
- I considered a per-kind test list first, which would have recreated the duplication the test exists to remove; the table-driven shape only emerged after reading `expectSuccessArgs`. (iteration 4)
- reading the seed matrix first suggested 112 pending cells; only the overlay and the audit made the live state clear. (iteration 5)
- the preview's `session_id` looked like a provider id for a moment; reading `buildLineageDispatch` showed it is the SPECKIT session, so the label is misleading rather than the mechanism. (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A larger run-wide node cap as the fix for "5 of 7 pruned".** Raising the cap spends more iterations on the same first-worked branch; the pruned questions were good, but the run had no budget to work them. The defect is allocation, not the number. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A larger run-wide node cap as the fix for "5 of 7 pruned".** Raising the cap spends more iterations on the same first-worked branch; the pruned questions were good, but the run had no budget to work them. The defect is allocation, not the number.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A larger run-wide node cap as the fix for "5 of 7 pruned".** Raising the cap spends more iterations on the same first-worked branch; the pruned questions were good, but the run had no budget to work them. The defect is allocation, not the number.

### **Adding a new mirror-drift checker.** Both existing gates pass at HEAD, and the crosswalk documents the absent command trees as sanctioned. Building another checker adds a second source of truth for a surface that is already green. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Adding a new mirror-drift checker.** Both existing gates pass at HEAD, and the crosswalk documents the absent command trees as sanctioned. Building another checker adds a second source of truth for a surface that is already green.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a new mirror-drift checker.** Both existing gates pass at HEAD, and the crosswalk documents the absent command trees as sanctioned. Building another checker adds a second source of truth for a surface that is already green.

### **Adding another CI workflow for the validator.** The existing deep-loop workflow already installs and runs the suite; one added step is enough. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Adding another CI workflow for the validator.** The existing deep-loop workflow already installs and runs the suite; one added step is enough.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding another CI workflow for the validator.** The existing deep-loop workflow already installs and runs the suite; one added step is enough.

### **Adding resume flags to all eight adapters at once.** Four kinds report no session id in a parseable shape, and the two unconfirmed envs would need live probes; per-kind capture is the only honest path. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Adding resume flags to all eight adapters at once.** Four kinds report no session id in a parseable shape, and the two unconfirmed envs would need live probes; per-kind capture is the only honest path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding resume flags to all eight adapters at once.** Four kinds report no session id in a parseable shape, and the two unconfirmed envs would need live probes; per-kind capture is the only honest path.

### **Building row 12 alone and leaving the dashboard for later.** The dashboard is the surface that would have shown the band closes and the partition drift; splitting it from the shared projection leaves the operator with the same blind spot. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Building row 12 alone and leaving the dashboard for later.** The dashboard is the surface that would have shown the band closes and the partition drift; splitting it from the shared projection leaves the operator with the same blind spot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Building row 12 alone and leaving the dashboard for later.** The dashboard is the surface that would have shown the band closes and the partition drift; splitting it from the shared projection leaves the operator with the same blind spot.

### **Deleting the `structured_state_findings_partially_reflected_in_registry` invariant.** The invariant is right that a count mismatch matters; the defect is that the count ignores a documented refinement transition. Deleting the check would hide a real loss. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Deleting the `structured_state_findings_partially_reflected_in_registry` invariant.** The invariant is right that a count mismatch matters; the defect is that the count ignores a documented refinement transition. Deleting the check would hide a real loss.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deleting the `structured_state_findings_partially_reflected_in_registry` invariant.** The invariant is right that a count mismatch matters; the defect is that the count ignores a documented refinement transition. Deleting the check would hide a real loss.

### **Deriving the contract from the CLI help text at test time.** The adapters are pinned to live-verified flags, and a help probe cannot prove the runner reads the log shape the flag produces. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Deriving the contract from the CLI help text at test time.** The adapters are pinned to live-verified flags, and a help probe cannot prove the runner reads the log shape the flag produces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the contract from the CLI help text at test time.** The adapters are pinned to live-verified flags, and a help probe cannot prove the runner reads the log shape the flag produces.

### **Fixing the commit step by adding the ignored path to `.gitignore` again.** It is already there; the exclude is the redundant half. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Fixing the commit step by adding the ignored path to `.gitignore` again.** It is already there; the exclude is the redundant half.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Fixing the commit step by adding the ignored path to `.gitignore` again.** It is already there; the exclude is the redundant half.

### **One test per adapter kind written by hand.** That is the current `expectSuccessArgs` shape; it duplicates the builder and drifts with it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **One test per adapter kind written by hand.** That is the current `expectSuccessArgs` shape; it duplicates the builder and drifts with it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **One test per adapter kind written by hand.** That is the current `expectSuccessArgs` shape; it duplicates the builder and drifts with it.

### **Persisting the env value as the rerun identity.** The env is the parent's provider session, not the child's, and the recursion guard deliberately reads it to refuse dispatch; storing it would conflate the guard with resume. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Persisting the env value as the rerun identity.** The env is the parent's provider session, not the child's, and the recursion guard deliberately reads it to refuse dispatch; storing it would conflate the guard with resume.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Persisting the env value as the rerun identity.** The env is the parent's provider session, not the child's, and the recursion guard deliberately reads it to refuse dispatch; storing it would conflate the guard with resume.

### **Ranking proposals by model-written value or confidence.** The runner cannot audit a self-asserted score, which is the honesty problem this packet is about. Sorting by parent depth and live-child count is deterministic and checkable. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Ranking proposals by model-written value or confidence.** The runner cannot audit a self-asserted score, which is the honesty problem this packet is about. Sorting by parent depth and live-child count is deterministic and checkable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking proposals by model-written value or confidence.** The runner cannot audit a self-asserted score, which is the honesty problem this packet is about. Sorting by parent depth and live-child count is deterministic and checkable.

### **Reading `--output-format json` support from the CLI help only.** The adapters are already pinned to live-verified flags in comments; a help probe would not prove the runner reads the resulting log shape, which is the actual gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading `--output-format json` support from the CLI help only.** The adapters are already pinned to live-verified flags in comments; a help probe would not prove the runner reads the resulting log shape, which is the actual gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `--output-format json` support from the CLI help only.** The adapters are already pinned to live-verified flags in comments; a help probe would not prove the runner reads the resulting log shape, which is the actual gap.

### **Rewriting the validator to import the tests instead of listing them.** `vitest list` is the supported discovery surface; the parser, not the mechanism, is wrong. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Rewriting the validator to import the tests instead of listing them.** `vitest list` is the supported discovery surface; the parser, not the mechanism, is wrong.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Rewriting the validator to import the tests instead of listing them.** `vitest list` is the supported discovery surface; the parser, not the mechanism, is wrong.

### **Treating `CLI_ADAPTER_STRESS_MATRIX` as the live matrix.** The overlay is the live object and the audit proves it; the seed table is documentation of the phase-one state. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating `CLI_ADAPTER_STRESS_MATRIX` as the live matrix.** The overlay is the live object and the audit proves it; the seed table is documentation of the phase-one state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `CLI_ADAPTER_STRESS_MATRIX` as the live matrix.** The overlay is the live object and the audit proves it; the seed table is documentation of the phase-one state.

### **Treating `session_id` in the preview as a provider id.** It is the SPECKIT session used for artifact scoping, as `buildLineageDispatch` shows. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating `session_id` in the preview as a provider id.** It is the SPECKIT session used for artifact scoping, as `buildLineageDispatch` shows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `session_id` in the preview as a provider id.** It is the SPECKIT session used for artifact scoping, as `buildLineageDispatch` shows.

### **Treating the `Trusted evidence yield` line as a harmless informational message.** It is emitted only on the legacy-compatibility path, which is the path every CLI lineage takes; leaving it names a missing field as a permanent warning. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the `Trusted evidence yield` line as a harmless informational message.** It is emitted only on the legacy-compatibility path, which is the path every CLI lineage takes; leaving it names a missing field as a permanent warning.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `Trusted evidence yield` line as a harmless informational message.** It is emitted only on the legacy-compatibility path, which is the path every CLI lineage takes; leaving it names a missing field as a permanent warning.

### **Treating the contract as documentation only.** The point is that the builder and the test read one table; a prose table with no consumer is another document to rot. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating the contract as documentation only.** The point is that the builder and the test read one table; a prose table with no consumer is another document to rot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the contract as documentation only.** The point is that the builder and the test read one table; a prose table with no consumer is another document to rot.

### **Treating the stress matrix as already conformant because it names all 14 rows.** The names exist, but the rows do not include the four differences this iteration found, and the non-codex cells are declared pending. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating the stress matrix as already conformant because it names all 14 rows.** The names exist, but the rows do not include the four differences this iteration found, and the non-codex cells are declared pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the stress matrix as already conformant because it names all 14 rows.** The names exist, but the rows do not include the four differences this iteration found, and the non-codex cells are declared pending.

### Grepping `fanout-run.cjs` for a per-kind session-id capture that could feed a rerun: only `readStoredLineageSessionId`, which reads the lineage's own config, exists. No provider session id is stored for a retry. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Grepping `fanout-run.cjs` for a per-kind session-id capture that could feed a rerun: only `readStoredLineageSessionId`, which reads the lineage's own config, exists. No provider session id is stored for a retry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping `fanout-run.cjs` for a per-kind session-id capture that could feed a rerun: only `readStoredLineageSessionId`, which reads the lineage's own config, exists. No provider session id is stored for a retry.

### Grepping for `--resume` or `exec resume` in `fanout-run.cjs` and `dispatch-iteration.cjs`: no match. The absence is the finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Grepping for `--resume` or `exec resume` in `fanout-run.cjs` and `dispatch-iteration.cjs`: no match. The absence is the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping for `--resume` or `exec resume` in `fanout-run.cjs` and `dispatch-iteration.cjs`: no match. The absence is the finding.

### Grepping workflows for `cli-adapter` or `validate-playbook-package`: only the sk-doc validator appears, which is a different path and a different package. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Grepping workflows for `cli-adapter` or `validate-playbook-package`: only the sk-doc validator appears, which is a different path and a different package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping workflows for `cli-adapter` or `validate-playbook-package`: only the sk-doc validator appears, which is a different path and a different package.

### Looking for a `lineageId` field in this lineage's config: only `sessionId` and `parentSessionId` exist, so the closeout has to infer one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a `lineageId` field in this lineage's config: only `sessionId` and `parentSessionId` exist, so the closeout has to infer one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `lineageId` field in this lineage's config: only `sessionId` and `parentSessionId` exist, so the closeout has to infer one.

### Looking for a capability record already shipped under another name: `EXECUTOR_KIND_FLAG_SUPPORT` is the closest, and it answers "is the field accepted", not "how is it carried". -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a capability record already shipped under another name: `EXECUTOR_KIND_FLAG_SUPPORT` is the closest, and it answers "is the field accepted", not "how is it carried".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a capability record already shipped under another name: `EXECUTOR_KIND_FLAG_SUPPORT` is the closest, and it answers "is the field accepted", not "how is it carried".

### Looking for a cross-lineage question comparison in `fanout-merge.cjs`: the partition guard compares node ids only, so question overlap has no check anywhere. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a cross-lineage question comparison in `fanout-merge.cjs`: the partition guard compares node ids only, so question overlap has no check anywhere.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a cross-lineage question comparison in `fanout-merge.cjs`: the partition guard compares node ids only, so question overlap has no check anywhere.

### Looking for a log parser that extracts a session id: none exists; the only log parsers are cost and quota. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for a log parser that extracts a session id: none exists; the only log parsers are cost and quota.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a log parser that extracts a session id: none exists; the only log parsers are cost and quota.

### Looking for a per-band cap in `readCaps`: only `maxDepth`, `maxChildrenPerNode`, `maxRootChildren` and `maxFrontierNodes` exist. Band shares are consumed by the reducer, never by admission. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a per-band cap in `readCaps`: only `maxDepth`, `maxChildrenPerNode`, `maxRootChildren` and `maxFrontierNodes` exist. Band shares are consumed by the reducer, never by admission.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-band cap in `readCaps`: only `maxDepth`, `maxChildrenPerNode`, `maxRootChildren` and `maxFrontierNodes` exist. Band shares are consumed by the reducer, never by admission.

### Looking for a shared `resolveSandboxMode` in the single-executor branches: each branch computes its own, which is the root of Finding 1. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a shared `resolveSandboxMode` in the single-executor branches: each branch computes its own, which is the root of Finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a shared `resolveSandboxMode` in the single-executor branches: each branch computes its own, which is the root of Finding 1.

### Searching for refinement handling in `synthesis-closeout.cjs`: there is none, which is the finding. The reducer owns the concept and the closeout does not read it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching for refinement handling in `synthesis-closeout.cjs`: there is none, which is the finding. The reducer owns the concept and the closeout does not read it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for refinement handling in `synthesis-closeout.cjs`: there is none, which is the finding. The reducer owns the concept and the closeout does not read it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Adding a new mirror-drift checker.** Both existing gates pass at HEAD, and the crosswalk documents the absent command trees as sanctioned. Building another checker adds a second source of truth for a surface that is already green. (iteration 1)
- **Reading `--output-format json` support from the CLI help only.** The adapters are already pinned to live-verified flags in comments; a help probe would not prove the runner reads the resulting log shape, which is the actual gap. (iteration 1)
- **Treating the stress matrix as already conformant because it names all 14 rows.** The names exist, but the rows do not include the four differences this iteration found, and the non-codex cells are declared pending. (iteration 1)
- Grepping `fanout-run.cjs` for a per-kind session-id capture that could feed a rerun: only `readStoredLineageSessionId`, which reads the lineage's own config, exists. No provider session id is stored for a retry. (iteration 1)
- Looking for a shared `resolveSandboxMode` in the single-executor branches: each branch computes its own, which is the root of Finding 1. (iteration 1)
- **A larger run-wide node cap as the fix for "5 of 7 pruned".** Raising the cap spends more iterations on the same first-worked branch; the pruned questions were good, but the run had no budget to work them. The defect is allocation, not the number. (iteration 2)
- **Building row 12 alone and leaving the dashboard for later.** The dashboard is the surface that would have shown the band closes and the partition drift; splitting it from the shared projection leaves the operator with the same blind spot. (iteration 2)
- **Ranking proposals by model-written value or confidence.** The runner cannot audit a self-asserted score, which is the honesty problem this packet is about. Sorting by parent depth and live-child count is deterministic and checkable. (iteration 2)
- Looking for a cross-lineage question comparison in `fanout-merge.cjs`: the partition guard compares node ids only, so question overlap has no check anywhere. (iteration 2)
- Looking for a per-band cap in `readCaps`: only `maxDepth`, `maxChildrenPerNode`, `maxRootChildren` and `maxFrontierNodes` exist. Band shares are consumed by the reducer, never by admission. (iteration 2)
- **Deleting the `structured_state_findings_partially_reflected_in_registry` invariant.** The invariant is right that a count mismatch matters; the defect is that the count ignores a documented refinement transition. Deleting the check would hide a real loss. (iteration 3)
- **Fixing the commit step by adding the ignored path to `.gitignore` again.** It is already there; the exclude is the redundant half. (iteration 3)
- **Treating the `Trusted evidence yield` line as a harmless informational message.** It is emitted only on the legacy-compatibility path, which is the path every CLI lineage takes; leaving it names a missing field as a permanent warning. (iteration 3)
- Looking for a `lineageId` field in this lineage's config: only `sessionId` and `parentSessionId` exist, so the closeout has to infer one. (iteration 3)
- Searching for refinement handling in `synthesis-closeout.cjs`: there is none, which is the finding. The reducer owns the concept and the closeout does not read it. (iteration 3)
- **Deriving the contract from the CLI help text at test time.** The adapters are pinned to live-verified flags, and a help probe cannot prove the runner reads the log shape the flag produces. (iteration 4)
- **One test per adapter kind written by hand.** That is the current `expectSuccessArgs` shape; it duplicates the builder and drifts with it. (iteration 4)
- **Treating the contract as documentation only.** The point is that the builder and the test read one table; a prose table with no consumer is another document to rot. (iteration 4)
- Looking for a capability record already shipped under another name: `EXECUTOR_KIND_FLAG_SUPPORT` is the closest, and it answers "is the field accepted", not "how is it carried". (iteration 4)
- **Adding another CI workflow for the validator.** The existing deep-loop workflow already installs and runs the suite; one added step is enough. (iteration 5)
- **Rewriting the validator to import the tests instead of listing them.** `vitest list` is the supported discovery surface; the parser, not the mechanism, is wrong. (iteration 5)
- **Treating `CLI_ADAPTER_STRESS_MATRIX` as the live matrix.** The overlay is the live object and the audit proves it; the seed table is documentation of the phase-one state. (iteration 5)
- Grepping workflows for `cli-adapter` or `validate-playbook-package`: only the sk-doc validator appears, which is a different path and a different package. (iteration 5)
- **Adding resume flags to all eight adapters at once.** Four kinds report no session id in a parseable shape, and the two unconfirmed envs would need live probes; per-kind capture is the only honest path. (iteration 6)
- **Persisting the env value as the rerun identity.** The env is the parent's provider session, not the child's, and the recursion guard deliberately reads it to refuse dispatch; storing it would conflate the guard with resume. (iteration 6)
- **Treating `session_id` in the preview as a provider id.** It is the SPECKIT session used for artifact scoping, as `buildLineageDispatch` shows. (iteration 6)
- Grepping for `--resume` or `exec resume` in `fanout-run.cjs` and `dispatch-iteration.cjs`: no match. The absence is the finding. (iteration 6)
- Looking for a log parser that extracts a session id: none exists; the only log parsers are cost and quota. (iteration 6)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Code at HEAD `b8003a7df42` in the integration worktree.
- Previous research and its improvement backlog: `research_archive/20261120T125555Z/`, especially `improvement-backlog.md` and `research.md`.
- Conductor logs: `scratch/dogfood-review-gen2.md` and `scratch/dogfood-research-gen3.md`.
- Lineage frontier scope: F-1-002, F-1-004, F-1-006.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` (live); `fork` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `inbox.jsonl` in this lineage directory
- Canonical pause sentinel: `.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 4
- Started: 2026-11-20T13:57:00.000Z
