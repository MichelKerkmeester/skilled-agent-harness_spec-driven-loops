# Deep Research Strategy - gpt55-fast-1

## 1. TOPIC
Validate and stress-test the merge design for folding deep-loop-runtime into deep-loop-workflows as system-deep-loop: structural layout, bidirectional path-coupling repair, the system-spec-kit tooling-borrow, reference migration across commands/agents/READMEs/advisor-corpus, and whether fallback-router.ts should be wired for real GLM-5.2 to MiMo-v2.5-Pro fallback.

---

<!-- ANCHOR:key-questions -->
## 2. KEY QUESTIONS (remaining)
- [x] Does the proposed `system-deep-loop` structural layout preserve the current workflow/runtime split without creating ambiguous ownership or broken relative paths?
- [x] Which bidirectional path couplings between `deep-loop-workflows`, `deep-loop-runtime`, commands, agents, docs, tests, and scripts must be repaired mechanically during the merge?
- [x] Which `system-spec-kit` tooling should be borrowed, wrapped, or left external instead of duplicated inside the merged deep-loop system?
- [x] What reference migration is required across commands, agents, READMEs, skill docs, feature catalogs, manual testing playbooks, specs, and advisor corpus entries?
- [x] Should `fallback-router.ts` be wired into real GLM-5.2 to MiMo-v2.5-Pro fallback now, or remain an offline/reference-only primitive for this phase?
<!-- /ANCHOR:key-questions -->

---

## 3. NON-GOALS
- Do not implement or move files.
- Do not modify `deep-loop-workflows`, `deep-loop-runtime`, command assets, agents, specs, advisor corpus, or root packet docs.
- Do not write outside this lineage artifact directory.

---

## 4. STOP CONDITIONS
- At least three evidence iterations have completed and all key questions have cited answers.
- Further iterations would add only marginal confirmation relative to the accumulated evidence.
- The loop reaches `maxIterations: 10`.

---

<!-- ANCHOR:answered-questions -->
## 5. ANSWERED QUESTIONS
- Structural layout: preserve `deep-loop-workflows` as public hub/mode packets and `deep-loop-runtime` as internal backend under a merged `system-deep-loop` root; do not flatten them (iteration 1, evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:12`, `.opencode/skills/deep-loop-runtime/README.md:23-30`).
- Path coupling: rewrite command YAML and compiled contracts, doctor routes/assets, orchestrator/agent prompt contracts, advisor Python/TS/tests/metadata, system-spec-kit test/optimizer/docs, and runtime integration docs atomically with the move (iteration 2, evidence: `.opencode/commands/deep/assets/deep_research_auto.yaml:64-77`, `.opencode/commands/doctor/_routes.yaml:100-110`, `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2570-2587`).
- System-spec-kit borrow: leave spec-folder topology, validation, memory/context save, and canonical resource-map extraction under `system-spec-kit`; consume through narrow deep-loop seams and rewrite external consumer configs instead of duplicating governance tooling (iteration 3, evidence: `.opencode/skills/system-spec-kit/SKILL.md:61`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/artifact-root.cjs:4-18`, `.opencode/skills/deep-loop-workflows/shared/synthesis/resource-map.cjs:4-18`).
- Reference migration: update skill identity, structured routing fields, advisor constants/projections/corpus labels, generated command contracts, agent mirrors, hooks/plugins/CI, graph metadata edges, and live docs/playbooks/catalogs; freeze `/deep:*` commands and agent names; leave historical specs out of residual-grep scope (iteration 4, evidence: `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md:57-82`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md:66-104`).
- Fallback-router wiring: keep it optional/operator-gated and non-blocking for the core merge; if implemented, amend child 004 with an explicit fallback registry and canonical-to-provider model mapping, place model-aware substitution in `fanout-run.cjs` or a generic retry-exhausted hook, emit attribution, and add forced-failure GLM-to-MiMo integration coverage (iteration 5, evidence: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:618-653`, `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1343-1375`, `.opencode/specs/system-deep-loop/052-deep-loop-unification/004-fallback-router-wiring/spec.md:35-62`).
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED
- Contract-first structural read: hub/runtime READMEs and SKILL contracts exposed the ownership seam before path inventory work (iteration 1).
- Exact old-root greps across scoped surfaces separated executable migration targets from lower-priority prose references (iteration 2).
- Reading seam modules (`artifact-root.cjs`, workflow resource-map re-export, reducer imports) separated canonical external contracts from accidental path coupling (iteration 3).
- Testing the child 003 plan against live agent mirrors, advisor corpus, plugin/hook/CI paths, and graph metadata found coverage without requiring a blind full rewrite inventory (iteration 4).
- Reading model profiles alongside runtime execution code exposed that GLM/MiMo fallback needs policy/config/provenance work, not router redesign (iteration 5).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED
- Broad markdown globbing across `deep-loop-workflows` was noisy because catalogs/playbooks dominate the tree; targeted grep/read is needed next (iteration 1).
- Generated compiled contracts are not authoritative enough to repair references on their own; source YAML/advisor/test files must rewrite first, then contracts regenerate (iteration 2).
- Broad `system-spec-kit` grep was noisy because memory benchmarks and docs mention `resource-map.md`; representative contract files were more useful (iteration 3).
- Broad `.opencode/specs/**` search returned intended historical mentions; implementation residual-grep must exclude specs and use an explicit allowlist (iteration 4).
- Broad GLM/MiMo grep returned many historical and sibling-lineage hits; current model-profile docs and runtime dispatch code were the useful sources (iteration 5).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (do not retry)
None yet.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS
- Flattening runtime and workflow packets into one directory: contradicts the logic-free hub and backend-only runtime contracts (iteration 1, evidence: `.opencode/skills/deep-loop-workflows/SKILL.md:37-39`, `.opencode/skills/deep-loop-runtime/README.md:23-30`).
- Moving directories first and relying on generated contracts to catch up: generated contracts are outputs, while source YAML, advisor code, agents, and test configs carry old paths (iteration 2).
- Duplicating `validate.sh`, `generate-context.js`, memory tools, or the resource-map extractor inside `system-deep-loop`: splits canonical spec-folder governance from `system-spec-kit` (iteration 3).
- Repo-wide blind find/replace: advisor fixtures need field-scoped labels, compiled contracts need regeneration, graph edges need dedupe, and specs are historical/out-of-scope (iteration 4).
- Renaming `/deep:*` commands or `@agent` names: child 003 freezes public surfaces and migrates only skill identity/reference paths (iteration 4).
- Treating fallback-router wiring as mandatory merge closeout: parent and child specs mark it optional/operator-gated and current 001 GLM handling accepts retry/salvage/manual re-dispatch (iteration 5).
- Hardcoding GLM-to-MiMo substitution inside the generic pool: model policy belongs in fanout orchestration, not the generic capped-pool primitive (iteration 5).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 10. CARRIED-FORWARD OPEN QUESTIONS
None. All key questions are answered with cited evidence.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis: consolidate the five iterations into `research.md` and `resource-map.md`, then mark the lineage complete.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
- Active spec packet says this phase is read-only research and forbids modifying `deep-loop-workflows` or `deep-loop-runtime` [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/spec.md:68-75].
- Plan confirms the exact fanout payload and flags the `iterations` vs `iters` field-name trap [SOURCE: .opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/plan.md:71-85].
- `resource-map.md` was absent at init; coverage gate is skipped for prior inventory.

### Bounded Context Snapshot
- Source pointers: `.opencode/skills/deep-loop-workflows/`, `.opencode/skills/deep-loop-runtime/`, `.opencode/commands/deep/`, `.opencode/agents/`, `.opencode/skills/system-skill-advisor/`, and `.opencode/skills/system-spec-kit/`.
- Integration points: command YAML references workflow skill docs, runtime scripts, runtime libraries, and memory/graph/reducer paths.
- Constraints: all writes for this detached lineage are confined to `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-1`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Min iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current generation: 1
- Started: 2026-07-08T04:57:16Z
