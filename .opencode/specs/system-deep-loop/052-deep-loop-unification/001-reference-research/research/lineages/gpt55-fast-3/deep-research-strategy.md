# Deep Research Strategy - gpt55-fast-3

## 1. TOPIC
Validate and stress-test the merge design for folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`: structural layout, bidirectional path-coupling repair, the `system-spec-kit` tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether `fallback-router.ts` should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

---

<!-- ANCHOR:key-questions -->
## 2. KEY QUESTIONS (remaining)
- [x] Is the proposed `system-deep-loop/runtime/` structural layout correct, especially treating runtime as infrastructure rather than a workflow mode?
- [x] Are the forward and reverse relative-path repair rules correct at concrete call sites, or do any file-depth classes break the plan?
- [x] Is the `system-spec-kit` TypeScript tooling-borrow repair correctly scoped and sufficient, or does it create a silent test-coverage gap?
- [x] Is the external reference migration complete and safely staged across commands, agents, READMEs, hooks, advisor corpus, and graph metadata?
- [x] Should `fallback-router.ts` be wired now for GLM-5.2 to MiMo-v2.5-Pro fallback, deferred, or rejected for scope/behavior reasons?
<!-- /ANCHOR:key-questions -->

---

## 3. NON-GOALS
- Do not execute the merge, rename, reference rewrite, or fallback-router implementation.
- Do not modify files outside this detached lineage artifact directory.
- Do not evaluate historical `.opencode/specs/**` references as actionable migration targets unless they affect current routing or validation.

---

## 4. STOP CONDITIONS
- Stop after legal convergence once the five key questions have evidence-backed answers and at least three iterations are complete.
- Stop at `maxIterations: 10` if convergence does not occur.
- Stop early only for unrecoverable state corruption inside this lineage artifact directory.

---

<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS
- Runtime should be nested under `system-deep-loop/runtime/` as infrastructure, not added to `mode-registry.json` as a workflow mode.
- The path repair rule is directionally correct: runtime-to-hub shared references keep hop-count and delete the old sibling segment; workflow-to-runtime references move one hop closer and target `runtime/`.
- Correction: `render-command-contract.cjs` has a `WORKSPACE_ROOT` constant that must gain one extra parent hop after nesting, just like `compile-command-contracts.cjs`.
- The `system-spec-kit` tooling-borrow is load-bearing because it affects runtime typecheck and council test discovery.
- External reference migration is broadly complete and safely staged, provided Stage A is rerun live and historical active eval fixtures are reviewed or allowlisted instead of blindly renamed.
- Fallback-router wiring should remain optional/deferred for the structural merge unless the operator explicitly expands scope to behavior changes.
- Convergence pass found no new contradictions; child 002/003 need the two listed amendments before implementation, and child 004 remains optional.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED
- Executable import and root-depth reads exposed one concrete correction that a prose-only rename inventory could miss (iteration 1).
- Category-splitting external references exposed generated-contract, advisor-corpus, plugin-fixture, agent-duplicate, and graph-edge handling differences (iteration 2).
- Reading fanout runtime call sites showed fallback wiring is a broader orchestration integration problem, not only a pure-router call (iteration 3).
- Parent/child spec cross-check confirmed the recommended sequence and did not reveal new contradictions (iteration 4).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED
- Broad grep across all markdown was noisy; targeted reads of `.cjs`, `.ts`, `package.json`, and `vitest.config.ts` gave better signal (iteration 1).
- Treating all non-spec old-name hits as required rewrites is unsafe; active eval fixtures may intentionally preserve historical old-name queries (iteration 2).
- Treating child 004 as a one-line pool hook misses model-id normalization, approval, replacement label, and artifact-directory coupling (iteration 3).
- No additional gaps surfaced during synthesis-readiness pass (iteration 4).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)
[None yet]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS
- Add `runtime/` as an eighth workflow mode: ruled out because runtime is backend infrastructure and the public mode registry already models workflow modes separately (iteration 1, evidence: `.opencode/skills/deep-loop-workflows/mode-registry.json:19`).
- Blind repo-wide find/replace of old skill names: ruled out because generated contracts, advisor fields, graph edges, and historical eval fixtures need different handling (iteration 2, evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/eval/data/ground-truth.json:795`).
- Make child 004 mandatory inside the structural merge without operator scope expansion: ruled out because it is behavior expansion requiring registry/schema, caller approval, model-id normalization, and attribution changes (iteration 3, evidence: `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:42`).
- Continue to a fifth iteration: ruled out because all key questions are answered, the minimum floor is met, and the convergence pass produced no new contradictions (iteration 4, evidence: `.opencode/skills/deep-loop-workflows/deep-research/references/convergence/convergence.md:49`).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 10. CARRIED-FORWARD OPEN QUESTIONS
[None yet]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Complete: final synthesis written to `research.md`; artifact `resource-map.md` emitted; stopReason=`converged`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
- `resource-map.md not present; skipping coverage gate`.
- Parent packet says the merge is structural/identity-only and excludes behavior changes, with `fallback-router.ts` scoped as optional child 004.
- Child 002 plan proposes `deep-loop-workflows -> system-deep-loop`, `deep-loop-runtime -> system-deep-loop/runtime`, a single `graph-metadata.json`, forward path repair by deleting the `deep-loop-workflows` segment, and reverse path repair by reducing one `..` then renaming to `runtime`.
- Child 003 plan proposes dependency-ordered external reference migration with advisor corpus baseline/regression gates.
- Child 004 plan proposes optional GLM-5.2 -> MiMo-v2.5-Pro fallback wiring via existing `fallback-router.ts`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Minimum iterations before convergence: 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Artifact directory: `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-3`
- Session id: `fanout-gpt55-fast-3-1783486518892-2qss01`
