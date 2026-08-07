# Deep Research Strategy: Git Preflight Advisory Rules

## 2. TOPIC
Determine which git invocation shapes justify a one-line pre-execution advisory, which repository and command state is genuinely available before execution, and which candidate rules remain quiet enough to preserve operator attention.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which git operation families can be classified reliably from the Bash command before execution?
- [x] Which repository, worktree, index, remote, config, and account state is genuinely available before each candidate command runs?
- [x] Which high-cost failures beyond the five observed incidents warrant new advisory rules?
- [x] How often would each candidate fire in real repository history, and what is the defensible noise threshold?
- [x] Which dangerous-looking operations should remain silent because enforcement already owns them or preflight state is unavailable/too noisy?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not implement or modify the evaluator, hook, sk-git rules, or frontmatter.
- Do not redesign the advisory mechanism.
- Do not turn advisory findings into blocking rules.
- Do not claim post-execution outcomes are pre-evaluable.
- Do not write outside this detached lineage directory.

## 5. STOP CONDITIONS
- Run exactly five iterations; convergence before iteration five is telemetry only.
- Stop after iteration five when candidate operations include exact invocation shapes, genuinely available pre-state, measured or explicitly unmeasured noise, source classification, and confirmed/inferred confidence.
- Preserve eliminated high-noise and non-pre-evaluable alternatives as primary negative knowledge.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which direct Git operation families can be classified reliably from Bash command text before execution?
- Which local repository, worktree, index, config, ref, account, and remote snapshots are available, and which outcomes remain unknowable or raceable?
- Which high-cost destructive, staging, refspec, tag, and coordination failures beyond the briefing warrant candidate advisories?
- Which routine, recovery, enforced, ambiguous, or inherently post-execution cases should remain silent?
- How existing history can and cannot measure candidate frequency, where the provisional noise threshold sits, and which ranked set should advance to shadow mode.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Pairing exact sk-git rules and hook coverage with a bounded 1,482-entry HEAD reflog separated command risk from broad-family prevalence. (iteration 1)
- Exact installed-Git help plus current-state probes separated destructive intent from routine forms already protected by Git and quantified current exposure without mutating state. (iteration 2)
- Combining official selection semantics, native dry runs, current hooks, and 500-commit path breadth produced objective mismatch predicates without inventing session ownership. (iteration 3)
- Resolving actual worktree, destination, account, environment, hook, and ref state separated deterministic local push consequences from authorization guesses. (iteration 4)
- Reusing prior evidence while benchmarking only probe latency produced a ranked 23-rule matrix, explicit rejection set, and measurable shadow-mode attention budget. (iteration 5)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Git history cannot recover option-sensitive invocation frequency or failed commands because it records ref outcomes rather than complete argv. (iteration 1)
- Repeating reflog measurement could not recover flags, pathspecs, failures, or final state-gated fire rates; remote containment can prove known publication but not non-publication. (iteration 2)
- Ordinary history cannot recover add/commit options or hook-time snapshots, and Git state has no session-owner field. (iteration 3)
- Push history has no argv/failure record, and network reads cannot close receive-time races; current missing hook installation is a health issue rather than advisory ownership evidence. (iteration 4)
- Existing Git history cannot provide option-sensitive fire rates; final calibration requires normalized future PreToolUse telemetry rather than another history pass. (iteration 5)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Generic warnings for every commit, reset, rebase, pull, or push: broad-family prevalence and existing enforcement make them noisy. (iteration 1)
- Treating Git log/reflog as exact shell-command telemetry: flags, pathspecs, and failed commands are absent. (iteration 1)
- Generic destructive-family warnings and recovery/control forms: exact state gates or Git's own protections make them unnecessary. (iteration 2)
- Path-count, top-level spread, and generic selective-commit warnings: sampled history shows they are common and do not prove contamination. (iteration 3)
- Generic push/account/worktree/multi-ref warnings and duplicate naming/permission advisories: positive local evidence or uncovered semantics are required. (iteration 4)
- Network probes, full object scans, all-worktree status sweeps, and generic filter-rewrite name matching exceed the synchronous advisory budget. (iteration 5)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Duplicate advisories for pre-push naming and non-allowlisted push permission already owned by blocking enforcement. (iteration 1)
- Treating remote snapshots, push authorization, conflict outcomes, or post-hook commit contents as guaranteed pre-execution facts. (iteration 1)
- Ordinary `branch -d`, checked-out branch deletion, ordinary worktree removal/prune, staged-only restore, clean/prune dry runs, routine GC, and rebase recovery forms. (iteration 2)
- Predicting interactive/stdin-generated path selections, treating `--include` as suspicious, inferring ownership, or claiming the pre-hook candidate is the final commit tree. (iteration 3)
- Treating `gh` identity, API permission, leases, or remote snapshots as proof of Git transport identity, authorization, or final push outcome. (iteration 4)
- Broad operation/path-count/ownership warnings and every predicate requiring post-fetch, post-hook, transport, authorization, or final outcome state. (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: operation inventory, destructive history, staging/commit semantics, coordination/remotes, noise calibration
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which bounded state probes make published amend/rebase, destructive overwrite, branch/worktree deletion, and remote/tag force/delete predicates precise enough? (iteration 1)
- How often do state-gated candidates match, given that ordinary Git history cannot provide exact argv telemetry? (iteration 1)
- Which staging and commit predicates detect cross-session contamination without warning on intentional multi-path commits? (iteration 2)
- Which positive local coordination and remote/account facts justify advisories despite unavoidable race windows? (iteration 3)
- What final candidate tiers, coalescing rules, latency limits, and aggregate alert budget keep advisories below the attention threshold? (iteration 4)
- No key research questions remain. Implementation must validate the retained classifier in privacy-preserving shadow mode. (iteration 5)
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT
- The briefing's five incidents are a floor, not the answer.
- Existing evaluator checks are pure command-string predicates and `sk-git` currently declares no `hard_rules`.
- Every usable finding must include operation, pre-execution state and availability, measured or explicitly unmeasured noise, source, and confidence.
- `resource-map.md` is absent; coverage comes from local source, Git history, and exact repository-state measurements.
- The code graph is empty, so exact Grep, Read, Glob, and bounded Git evidence are authoritative.

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Stop policy: max-iterations
- Convergence threshold: 0.05 telemetry only before iteration 5
- Executor: `cli-opencode`, model `openai/gpt-5.6-sol`
- Allowed writes: this detached lineage directory only
- Progressive synthesis: false; phase synthesis owns `research.md`
