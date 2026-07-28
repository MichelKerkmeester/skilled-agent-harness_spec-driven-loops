---
title: Deep Research Strategy - sk- prefix rename surface discovery
description: Fan-out lineage grok-4-5-high strategy for enumerating rename consumer surfaces.
trigger_phrases:
  - "sk prefix rename research"
  - "mode rename surface discovery"
importance_tier: critical
contextType: research
version: 1.0.0
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC
Enumerate every surface, reference and path that must change when 20 mode packet directories and 21 workflowMode keys across sk-code, sk-design, sk-doc and sk-prompt are renamed with an sk- prefix. Classify each occurrence as a typed position safe to sweep, a path position, or free prose where a bare key collides with English. Identify which artifacts are generated and must be rebuilt rather than edited, state ordering constraints, and name the command that verifies each class after the rename.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What consumer classes read packet directory names or workflowMode keys for the four sk- hubs?
- [ ] Q2: Which occurrences are typed (safe-to-sweep), path positions, or free prose with English collision risk?
- [ ] Q3: Which artifacts are generated and must be rebuilt rather than hand-edited?
- [ ] Q4: What ordering constraints exist (what must change before what)?
- [ ] Q5: What verification command proves each consumer class after the rename?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Performing any rename or moving any packet directory
- Changing mode behavior, scoring, or resource loading
- Researching the three non-sk hubs (cli-external-orchestration, mcp-tooling, system-deep-loop)
- Averaging disagreements with the sibling glm-5-2 lineage (record, do not reconcile)

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: always run through iteration 5
- Early newInfoRatio dips are telemetry only; broaden angles instead of synthesizing early
- Halt only on unrecoverable state corruption or three consecutive iteration failures

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

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
- Full ordering + verification matrix (iteration 1)
- Advisor metadata / description.json / graph-metadata.json mode references (iteration 1)
- Command bindings, agent definitions, runtime mirrors (iteration 1)
- Benchmark gold and Lane C route rows (iteration 1)
- DB/cache consumers (open question from spec) (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
DB/cache consumers (open question from spec)

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot
- Source pointers:
  - Parent rename map: `.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/assets/rename-map.json` (21 rows, 20 packets; shared `create-skill` exception)
  - Hubs: `.opencode/skills/{sk-code,sk-design,sk-doc,sk-prompt}/` each with `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, packet dirs
  - Frozen rename examples: `quality`→`sk-code-quality`, `interface`→`sk-design-interface`, `create-skill-parent` keeps key≠directory
- Reuse candidates: rename-map.json as authoritative old→new pairs; parent-skill templates under sk-doc/create-skill/assets/parent-skill/
- Integration points: advisor metadata, leaf manifests, benchmark gold, runtime mirrors (.claude/.cursor/.codex/.devin), command bindings
- Constraints: read-only research; findings need path+line; bare English keys (`quality`, `interface`, `diff`) are collision hazards

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.1 (telemetry only under stopPolicy=max-iterations)
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Artifact dir (fanout override): `.opencode/specs/sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/001-surface-research/research/lineages/grok-4-5-high`
- Session id: `fanout-grok-4-5-high-1785183212749-q9al64`
- Current generation: 1
- Started: 2026-07-27T20:13:32.751Z
