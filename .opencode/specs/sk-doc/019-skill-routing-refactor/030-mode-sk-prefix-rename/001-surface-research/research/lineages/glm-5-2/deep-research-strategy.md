---
title: Deep Research Strategy - sk- prefix rename surface discovery
description: Fan-out lineage glm-5-2 strategy for enumerating rename consumer surfaces.
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
- [x] Q1: consumer classes A-G identified (mode-registry, hub-router, leaf-manifest, leaf-aliases, description, graph-metadata, command-metadata)
- [x] Q2: classified; only `quality` and `interface` are bare-English collision hazards; graph-metadata/command-metadata path+prose positions are generated
- [x] Q3: generated=graph-metadata.json (backfill-graph-metadata.ts) + description.json (generate-description.ts); hand-edited=mode-registry/hub-router/leaf-manifest/leaf-aliases/command-metadata/command-yaml/command-router-md
- [x] Q4: 7 ordering constraints (shared-packet, registry<->dir reverse mapping, manifests-before-generated, .opencode/agents-before-.codex, .opencode-before-mirrors, command-bindings-after-registry, benchmark-gold-last)
- [x] Q5 (partial): 9 verification levers (doctor parent-skill/runtime-mirrors/skill-graph-freshness/fable-mode/skill-advisor/agent-roster-mirror routes, route-validate, design-command-surface-check, command-binding-existence, leaf-manifest test)

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Performing any rename or moving any packet directory
- Changing mode behavior, scoring, or resource loading
- Researching the three non-sk hubs (cli-external-orchestration, mcp-tooling, system-deep-loop)
- Averaging disagreements with the sibling grok-4-5-high lineage (record, do not reconcile)

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: always run through iteration 5
- Early newInfoRatio dips are telemetry only; broaden angles instead of synthesizing early
- Halt only on unrecoverable state corruption or three consecutive iteration failures

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] Q1: 13 consumer classes A-M enumerated with file:line evidence
- [x] Q2: typed/path/prose classified; quality+interface = bare-English collision hazards
- [x] Q3: generated (graph-metadata, description, benchmark, codex tomls) vs hand-edited
- [x] Q4: 7 ordering constraints (2 HARD)
- [x] Q5: 9 verification levers
- [x] Spec open question: no DB/cache mode-key consumer

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Batch-reading all four mode-registry.json files gave the full typed-field inventory.
- hub-router.json tieBreak[] is a compact ordered workflowMode list per hub.

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Could not field-verify every prose entry across all hubs within budget; sampled sk-code. Ruled out exhaustive prose enumeration.

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
## 11A. CARRIED-FORWARD OPEN QUESTIONS (gaps for the rename phase)
- GAP-1: /doc:quality router file location
- GAP-2: sibling drift-guard tests for the four sk- hubs
- GAP-3: full labeled-prompts.jsonl scan for mode-level labels
- GAP-4: .devin/skills/ dir-name rename decision (judgment: no)
- GAP-5: orchestrate.md/deep-alignment.md line-level verification

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
SYNTHESIS COMPLETE — research.md, resource-map.md, convergence-report.md produced. All key questions answered; 5 gaps handed to the rename phase.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot
- Source pointers:
  - Parent rename map: `.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/assets/rename-map.json` (21 rows, 20 packets; `create-skill` shared by two workflowModes; `create-skill-parent` keeps key!=directory)
  - Hubs: `.opencode/skills/{sk-code,sk-design,sk-doc,sk-prompt}/` each with `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, packet dirs
  - Frozen rename examples: `quality`->`sk-code-quality`, `interface`->`sk-design-interface`, `create-skill-parent` keeps key!=directory
- Reuse candidates: rename-map.json as authoritative old->new pairs; parent-skill templates under sk-doc/create-skill/assets/parent-skill/
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
- Artifact dir (fanout override): `.opencode/specs/sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/001-surface-research/research/lineages/glm-5-2`
- Session id: `fanout-glm-5-2-1785183212749-q9al64`
- Current generation: 1
- Started: 2026-07-27T22:21:00.000Z
