# Deep Research Strategy - Interface Skill Improvement

## 1. OVERVIEW

### Purpose

Investigate practical improvements to the `sk-design` interface mode, grounded in the live `design-interface` packet, prior 009 reference/asset research, the external 43-entry design corpus, manual testing playbook, and the routing benchmark.

---

## 2. TOPIC

Improve the interface skill for efficiency, usefulness, UX, tooling, references, assets, and routing without weakening its anti-default design judgment.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What is the current interface skill surface and physical packet path?
- [x] Which prior expansion recommendations already landed, and which remain useful?
- [x] Which routing benchmark failures most constrain efficiency and usefulness?
- [x] Which UX/handoff gaps remain after reference expansion?
- [x] Which validation gaps should gate follow-up implementation?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not implement skill changes in this lineage.
- Do not modify any path outside the fan-out artifact directory.
- Do not add aesthetic presets or bulk-import external corpus material.
- Do not claim benchmark improvement without rerunning the benchmark in a follow-up implementation packet.

---

## 5. STOP CONDITIONS
- Stop when all key questions have evidence-backed answers and the final iteration adds low novelty.
- Stop no later than 10 iterations.
- Stop immediately if required evidence would require mutating outside the lineage artifact directory.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Current packet path is `.opencode/skills/sk-design/design-interface/`; the prompt's `.opencode/skills/sk-design/interface` is a mode alias, not a physical directory.
- The 009 high-value interface expansions mostly landed: shared register, brief-to-dials, mechanical/content gates, preflight card, real-UI loop, design-system/reference grounding, and MCP tool docs.
- Current benchmark report is `CONDITIONAL` at 70/100, not the prompt's stale 78/100; bottleneck is `routed-intra`, specifically ID-011 and ID-005.
- Highest leverage improvements are routing precision, split resource maps, explicit route-away output, redesign intake, required handoff manifest, and verification upgrades.
- Do-not list centers on avoiding preset expansion, paid-reference mandates, corpus bulk import, and implementation inside the research packet.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Current-state inventory first: prevented proposing references that already exist after 009. (iteration 1)
- Scenario-level benchmark reading: turned aggregate score into concrete ID-011 and ID-005 fixes. (iteration 2)
- D3/resource-overload analysis: identified split-grounding as a surgical efficiency fix. (iteration 3)
- External corpus cross-check: preserved useful redesign and visual-asset ideas without bulk import. (iteration 4)
- Manual playbook review: exposed verification gaps and live-mode requirements. (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Treating the prompt's `interface` path literally failed; the repo uses `design-interface` as the physical packet.
- Treating the prompt's 78/100 benchmark value as current failed; live report evidence says 70/100 conditional.
- Looking for a top-level spec document in the provided spec folder failed; the folder currently contains only `research/`, and write scope forbids seeding docs outside the lineage artifact directory.
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Bulk reference expansion -- BLOCKED (iteration 6, 2 attempts)
- What was tried: Compare 009 matrix and current packet inventory.
- Why blocked: Most high-value interface references/assets already landed; adding more bulk would reduce efficiency and risk preset behavior.
- Do NOT retry: Do not propose wholesale external corpus import or more aesthetic-preset files as the lead improvement.

### Prompt benchmark value as truth -- BLOCKED (iteration 2, 1 attempt)
- What was tried: Search and read benchmark report artifacts.
- Why blocked: Current report says 70/100, conditional.
- Do NOT retry: Do not cite 78/100 unless a newer report artifact proves it.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treat `.opencode/skills/sk-design/interface` as a physical path: ruled out by `mode-registry.json` and filesystem evidence. (iteration 1)
- Optimize aggregate benchmark score without scenario diagnosis: ruled out because report names routed-intra and two failing scenarios. (iteration 2)
- Remove references broadly to improve D3: ruled out because discovery/connectivity are strong; overload is localized. (iteration 3)
- Require Mobbin/Refero for every design task: ruled out because lookup is optional, paid, and non-blocking. (iteration 4)
- Claim improvement from docs without benchmark/playbook verification: ruled out by unscored D1-inter/D4 and playbook validator limits. (iteration 5)
- Add more aesthetic preset files or bulk-import external corpus: ruled out by anti-chooser guardrails and 009 negative knowledge. (iteration 6)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Should redesign intake be a new small `references/design-process/redesign_intake.md` or folded into `real_ui_loop.md`? Recommendation: new small reference only if router can load it narrowly on redesign terms.
- Should benchmark fixtures be updated to expect `brief_to_dials.md` for ID-011, or should `MECHANICAL_PREFLIGHT` load it directly? Recommendation: do both only if a rerun confirms recall improves without unacceptable D3 cost.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Converged. Follow-up implementation should start with router fixes for ID-005 and ID-011, then rerun the design-interface benchmark and playbook structural checks.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- `resource-map.md` was not present in the provided spec folder; skipping spec-level coverage gate.
- The provided spec folder currently has only `research/`; this lineage did not create or mutate `spec.md` because the operator constrained writes to the lineage artifact directory.
- The routing benchmark report exists at `014-routing-benchmark/design-interface/skill-benchmark-report.md` and currently reports aggregate 70/100, conditional.
- Prior 009 research is high-signal but partly superseded by landed interface references/assets.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Completed iterations: 6
- Stop reason: converged
- Artifact root override was bound directly; `resolveArtifactRoot` was not run.
- Writes were limited to `.opencode/specs/design/008-sk-design-parent/015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast`.
