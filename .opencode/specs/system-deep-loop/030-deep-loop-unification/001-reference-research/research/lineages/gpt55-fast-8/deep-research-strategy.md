# Deep Research Strategy - gpt55-fast-8

## 1. OVERVIEW

### Purpose

Validate the deep-loop unification design using a detached GPT-5.5-fast lineage. This packet is evidence-only and writes only under the lineage artifact directory.

---

## 2. TOPIC

Validate and stress-test folding `deep-loop-runtime` into `deep-loop-workflows` as `system-deep-loop`, including structural layout, bidirectional path repair, system-spec-kit tooling-borrow, reference migration, and GLM-5.2 to MiMo-v2.5-Pro fallback wiring.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Does the target `system-deep-loop/` layout match the live hub/runtime contract?
- [x] Are the forward and reverse path-repair classes correct?
- [x] Which external references are load-bearing rather than prose-only?
- [x] Should `fallback-router.ts` be wired as part of this merge or remain optional/operator-gated?
- [x] Does detached lineage execution need artifact-root special handling?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not execute the directory move.
- Do not modify `deep-loop-workflows`, `deep-loop-runtime`, commands, agents, advisor code, or sibling metadata.
- Do not write outside `.opencode/specs/system-deep-loop/052-deep-loop-unification/001-reference-research/research/lineages/gpt55-fast-8`.
- Do not silently substitute one model for another.

---

## 5. STOP CONDITIONS

- Complete at least 3 iterations.
- Stop when every initialized key question has evidence-backed answers.
- Stop at 10 iterations if convergence is not reached sooner.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Target layout is valid if `runtime/` remains infrastructure, not a new `workflowMode`.
- Forward path repair keeps the same hop count and deletes the old workflows segment; reverse path repair removes one hop and points to `runtime/`.
- The system-spec-kit resolver/tooling borrow is load-bearing and must be repaired in the structural phase.
- Advisor constants, generated projections, routing corpus, compiled command contracts, hooks, and graph edges are load-bearing external references.
- `fallback-router.ts` should remain optional/operator-gated for this merge; if implemented, it should use an explicit approved model set and attribution.
- Detached fanout lineages must bind `artifact_dir` directly from `config.fanout_lineage_artifact_dir` rather than running the stock resolver.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Direct file reads beat code graph queries because code graph readiness is stale.
- Reading the phase specs before code separated planned design from implemented seams.
- Checking `fanout-run.cjs`, `fanout-pool.cjs`, and `fallback-router.ts` together isolated the real fallback gap.
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Running the stock reducer would not be safe for this lineage override because `reduceResearchState()` resolves `artifactDir` from `specFolder`, not from a passed lineage directory.
- Treating historical spec references as migration targets would inflate scope without changing live behavior.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Runtime-as-mode interpretation - BLOCKED (iteration 1)
- What was tried: compared child 002 target layout with the live mode registry.
- Why blocked: runtime is backend infrastructure, not a mode packet.
- Do NOT retry: do not add `runtime` to `mode-registry.json`.

### Silent GLM to MiMo substitution - BLOCKED (iteration 3)
- What was tried: compared fallback-router behavior with CLI provider routing docs.
- Why blocked: model substitution needs explicit approval and attribution.
- Do NOT retry: do not silently replace failed GLM replicas with MiMo replicas.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Blind repo-wide replace: generated projections, advisor corpus fields, command contract hashes, and drift guards need staged edits.
- Decoupling runtime from system-spec-kit in this packet: useful follow-up, but it would confound merge validation.
- Running `resolveArtifactRoot` inside this detached lineage: violates the lineage override contract and can target the parent research folder instead of the lineage folder.
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- None for this lineage.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. Merge this lineage with peer lineages, then update child 002/003 only if the combined synthesis changes their staged plans.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: parent and child specs under `.opencode/specs/system-deep-loop/052-deep-loop-unification/`; live skill code under `.opencode/skills/deep-loop-workflows/`, `.opencode/skills/deep-loop-runtime/`, `.opencode/skills/system-skill-advisor/`, `.opencode/skills/sk-prompt-models/`, and `.opencode/skills/cli-opencode/`.
- Reuse candidates: `fallback-router.ts`, `fanout-run.cjs`, `fanout-pool.cjs`, command-contract compiler/drift checker, advisor routing projection generator, and existing path tables in child 002/003 plans.
- Integration points: `mode-registry.json`, reducer imports, runtime package/tsconfig, system-spec-kit vitest include, advisor constants, aliases, routing corpus, command contracts.
- Constraints and risks: code graph is stale; all claims in this lineage use direct file reads and Grep evidence. `resource-map.md` is not present in the 001 spec folder, so the coverage gate is skipped.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output
- Current generation: 1
- Started: 2026-07-08T05:16:33Z
