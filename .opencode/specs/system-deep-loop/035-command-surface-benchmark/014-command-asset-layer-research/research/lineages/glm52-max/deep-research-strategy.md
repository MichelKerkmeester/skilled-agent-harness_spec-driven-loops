# Deep Research Strategy — glm52-max lineage

## 2. TOPIC
Deep-dive the command **asset layer**: the `_auto.yaml` / `_confirm.yaml` workflow YAMLs, the `_presentation.txt` display assets, and the `doctor` route-manifest `_routes.yaml` plus per-route YAMLs, across all command families (`create/*`, `design/*`, `speckit/*`, `memory/*`, `doctor/*`, `deep/*`). Grounded in the 012 asset-layer results (asset STRUCTURE is the strongest layer at 35/35; six known defects AL1–AL6). Five research questions (RQ1–RQ5). Output: per-finding evidence (file:line) + candidate delta (target path + acceptance criterion). Research/synthesis only; no implementation, no shipped-runtime edits.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] RQ1 — Workflow-YAML schema: canonical schema of `_auto.yaml`/`_confirm.yaml` (nodes, steps, bindings, placeholder conventions), where the corpus diverges by family, and what a machine-readable command contract must capture so prose and YAML wiring cannot drift.
- [ ] RQ2 — Presentation ownership + boundary: who owns `_presentation.txt`; when inline presentation in the router is a legitimate exception (`memory/search`) vs a leak; how to represent intentional exceptions as typed declarations not prose.
- [ ] RQ3 — Mode completeness: how a check verifies every declared `:auto`/`:confirm` mode has BOTH its `_<mode>.yaml` asset AND its EXECUTION TARGETS row (closing the reachability-vs-completeness gap); how each family's default-mode policy is encoded in a mode matrix without forcing one default.
- [ ] RQ4 — Route-manifest YAMLs: the distinct doctor shape (`_routes.yaml` + per-route YAML + loader gating), how the taxonomy should name it, and how executable-edge parsing must traverse YAML dispatch fields so comments stop registering as false route cycles.
- [ ] RQ5 — Generation + ergonomics: rendering the OWNED ASSETS table, PRESENTATION BOUNDARY, and mode table from the contract; moving overgrown display/workflow blocks out of fat routers (`deep/*`) into asset files; correcting/preventing mislabeled `.txt` ownership entries.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change to shipped canon, commands, or assets (deltas only seed follow-on remediation packets).
- Touching shipped runtime.
- Memory-DB reindex (deferred per operator directive).
- Re-running the generic doc validator as a fix.
- Per-command cleanup before contract/canon enforcement (the 012 anti-pattern A7).

---

## 5. STOP CONDITIONS
- Max iterations (5) reached — primary stop for this lineage (stopPolicy: max-iterations).
- All five RQs have evidence-backed answers with at least one candidate delta each.
- Otherwise: continue broadening review angles; convergence is telemetry only and must NOT trigger early synthesis.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] RQ1 — Workflow-YAML schema + corpus divergence (D1.1–D1.5; iteration 1)
- [x] RQ2 — Presentation ownership + typed inline-exception (D2.1–D2.5; iteration 2)
- [x] RQ3 — Mode completeness + mode matrix (D3.1–D3.5; iteration 3)
- [x] RQ4 — Route-manifest YAMLs + executable-edge cycle parsing (D4.1–D4.5; AL4 PROVEN; iteration 4)
- [x] RQ5 — Generation + ergonomics + fat-router decomposition (D5.1–D5.3; backlog; iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Diffing `_auto.yaml` against its `_confirm.yaml` line-by-line isolated the exact `confirm==auto+checkpoints` delta — the schema fell out of the comparison. (iteration 1)
- Grepping workflow YAMLs for comment lines containing `.opencode/commands/` paths — the AL4 smoking gun appeared immediately and tied an abstract defect to exact lines + the exact regex. (iteration 4)
- Treating `memory/search` as the POSITIVE exemplar (sanctioned render-fidelity exception) rather than a violation — inverted the framing to expose the missing typed mechanism. (iteration 2)
- Measuring `deep/research.md` (184 lines) against `create/command.md` (54 lines) for the same topology — made the fat-router defect a line-count delta + block inventory. (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Reading the canon template first was misleading for RQ1 — it describes the router, not the YAML; the YAML-node schema had to be INDUCED from the corpus. The canon is not the source of truth for YAML-node shape. (iteration 1)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Rewrite the YAMLs to a new schema — the triad is validated-good (35/35); capture the existing schema, do not redesign it. (iteration 1)
- Hardcode an allowlist of inline-tolerant commands — preserves the regeneration defect (012 A7) and rots when a new render-fidelity command appears. (iteration 2)
- Force every router to support both :auto and :confirm — contradicts legitimate single-mode/zero-mode topologies (doctor/update, memory/*). (iteration 3)
- Strip all `#` globally before extraction — too blunt; corrupts non-comment `#` in code anchors/prose; strip per-line in YAML/markdown comment position only. (iteration 4)
- Slim deep/* routers by hand before the contract — 012 A7 anti-pattern; do it via the renderer after the contract lands. (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Saturated: none yet
- Remaining frontier: none recorded
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[Self-owned open questions from iteration write-back]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**COMPLETE.** stopReason `maxIterationsReached` (5/5; convergence telemetry-only, avg newInfoRatio 0.80). All five RQs answered with evidence-backed candidate deltas. Canonical synthesis written to `research.md`; findings-registry + dashboard finalized. AL1–AL6 all mapped to A-K/A-W/A-G backlog deltas with targets + acceptance criteria. Hand-off: parent session cross-reconciles glm52-max with the `gpt56-sol-xhigh-fast` sibling, then seeds follow-on asset-layer remediation packets per the dependency spine `A-K1 ∥ A-K2 → (A-W1..A-W4) → A-G1 → (A-G2, A-G3)`.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot (pointers only)

**Asset corpus (the research target — full census 2026-07-16):**
- **Triad families** (`_auto.yaml` + `_confirm.yaml` + `_presentation.txt`): `create/*` (11: agent, benchmark, changelog, command, diff, feature-catalog, flowchart, manual-testing-playbook, readme, skill, skill-parent), `design/*` (5: audit, foundations, interface, md-generator, motion), `speckit/*` (4: complete, implement, plan, resume), `deep/*` (8: agent-improvement, ai-council, alignment, command-benchmark, model-benchmark, research, review, skill-benchmark). = 28 workflow-YAML routers.
- **Direct-dispatch** (`*_presentation.txt` only, no workflow YAML): `memory/*` (4: learn, manage, save, search).
- **Route-manifest**: `doctor/_routes.yaml` + per-route `doctor_*.yaml` (13 route YAMLs) + 3 `doctor_*_presentation.txt`. `doctor/update.md` is a standalone single-workflow-YAML router (owns `doctor_update.yaml`, no triad, always interactive).

**Canon + validators (the contract to improve):**
- `.opencode/skills/sk-doc/create-command/assets/command_router_template.md` — canonical router skeleton + 3 variants (Workflow-YAML-backed, Direct-dispatch-script, Compiled-stub). Line 110-116 misclassifies doctor as Direct-dispatch.
- `.opencode/commands/scripts/validate-command-references.cjs:185-193` — `extractCommandTargets()` raw-text regex `COMMAND_TARGET` (line 55); NO comment stripping. Drives reachability + cycle detection.
- `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-doc-command.cjs:387-494` — `checkRouteGraph` (S3), `checkMirrorAndReachability` (S2), `checkPresentationOwnership` (S5). No `checkModeCompleteness`.

**066 / 012 grounding:**
- `012/research/research.md:117-143` — the six asset-layer defects AL1–AL6 and the "build on the triad, do not rebuild" thesis.
- `066/000/topology-taxonomy.md` — 4-topology taxonomy the adapter reconciles to.

### Constraints and risks
- Lineage boundary: write ONLY under `research/lineages/glm52-max/`; never touch shipped runtime or other paths.
- Forced non-convergence: run all 5 iterations (one RQ each, broadened), synthesize only at the end.
- The triad is validated-good (35/35): build on it, do not rebuild it.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5 (stopPolicy max-iterations; convergence telemetry only)
- Convergence threshold: 0.05 (NOT a stop trigger for this lineage)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis (written once at phase_synthesis)
- Machine-owned sections: reducer controls Sections 3, 6, 7–11A
- Executor: cli-opencode / zai-coding-plan/glm-5.2 / reasoning max
- Started: 2026-07-16T10:03:00Z
