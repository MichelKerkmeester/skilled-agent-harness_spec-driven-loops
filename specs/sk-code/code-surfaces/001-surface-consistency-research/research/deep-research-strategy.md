---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Round 2, building on round 1 (archived at specs/sk-code/code-surfaces/001-surface-consistency-research/research_archive/20261019T081751Z; read its research.md first, especially §7 target layout, §8 gaps, §9 migration). Three questions: (Q1) Doctor alignment: what /doctor:sk-code (.skilled/commands/doctor/sk-code.md, assets/doctor-sk-code-setup.yaml, scripts/sk-code-setup-check.cjs and its legs, parent-skill-check.cjs) checks today, and what legs or checks should be added so the doctor enforces the shared surface contract from round 1 (section order, workflow-link trio, assets/checklists home, no flat topical references, version/changelog match, no surface graph-metadata.json) — name exact files, functions and new leg ids, and how each fails with a repair command. (Q2) A hub-level base architecture for creating a new sk-code mode/surface: what a new surface must touch today (mode-registry.json, hub-router.json, ROUTER.md, hub SKILL.md RESOURCE_MAP union, leaf-manifest.json, compiled route, shared/references/stack-detection.md and phase-detection.md, the advisor plugin surface detection in .opencode/plugins/system-skill-advisor.js, verify-router-sync.cjs which hard-codes SURFACES at line 33, parent-skill-check, playbooks, hermes mirror), and design a scaffold under the sk-code hub (e.g. shared/assets/surface-scaffold/ or similar) with template SKILL.md/README/references tree/§2b smart-routing block, plus a checklist or script that registers the new surface in every place; compare with the sk-doc create-skill canon (.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md, packet-skill-scaffold.md) and say whether the scaffold belongs in sk-code or should extend sk-create-skill. (Q3) Routing optimization: remove hard-coded surface lists (verify-router-sync.cjs SURFACES, the skilled/webflow union comments, any other) in favour of deriving surfaces from mode-registry.json packetKind: surface; check how intent signals, DEFAULT_RESOURCE and load tiers differ across the three §2b blocks and recommend one shape; check compiled-route and advisor surface-hint behaviour for all three surfaces. Deliver per question: findings with path:line evidence, a recommendation, and ordered remediation steps with the check that guards each, ready to be appended as steps 8+ to round 1's 7-step plan. Make research.md self-contained: summarize round 1 briefly and cite its archived path.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: What does /doctor:sk-code check today, and which new legs or checks (exact files, functions, leg ids, failure text and repair command) would enforce the round-1 shared surface contract?
- [x] Q2: What must a new sk-code surface touch today, and what hub-level scaffold plus registration checklist or script should create one; does it belong in sk-code or in sk-create-skill?
- [x] Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing any file under .skilled/ (research only).
- Re-deriving round 1's layout findings; build on them.
- The non-surface sk-code modes (sk-code-review, sk-code-quality) except where the registry or guards treat them alongside surfaces.

---

## 5. STOP CONDITIONS
- Max iterations (3) reached; stop policy max-iterations.
- Each question has a recommendation and ordered remediation steps with a guarding check.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: What does /doctor:sk-code check today, and which new legs or checks (exact files, functions, leg ids, failure text and repair command) would enforce the round-1 shared surface contract?
- Q2: What must a new sk-code surface touch today, and what hub-level scaffold plus registration checklist or script should create one; does it belong in sk-code or in sk-create-skill?
- Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour?

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
- **Q3:** How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour? (iteration 1)
- **Q2:** What must a new sk-code surface touch today, and what hub-level scaffold plus registration checklist or script should create one; does it belong in sk-code or in sk-create-skill? (iteration 1)
- [ ] Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour? (iteration 2)
- None in round two; this was iteration 3 of 3 under the max-iterations stop policy. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Round 1 (5 iterations, archived at specs/sk-code/code-surfaces/001-surface-consistency-research/research_archive/20261019T081751Z/research.md) found the three surfaces share frontmatter, opening section order, routing keys and the root workflow-link trio; it recommends standardizing the packet contract and reference-tree grammar, an assets/checklists/ home, optional shared/scripts/benchmark, no surface graph-metadata.json, and a 7-step migration (baseline, wording, obsidian section order, checklist moves, obsidian reference grouping, mirrors/indexes, final check). The remediation plan is in specs/sk-code/code-surfaces/001-surface-consistency-research/plan.md.

### Bounded Context Snapshot

- Source pointers: .skilled/commands/doctor/sk-code.md; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml; .skilled/commands/doctor/scripts/sk-code-setup-check.cjs (LEGS at ~:99-150); .skilled/commands/doctor/scripts/parent-skill-check.cjs; .skilled/skills/sk-code/{mode-registry.json,hub-router.json,ROUTER.md,SKILL.md,leaf-manifest.json}; .skilled/skills/sk-code/shared/references/{stack-detection.md,phase-detection.md}; .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:33-34 (hard-coded SURFACES); .opencode/plugins/system-skill-advisor.js; .skilled/bin/compiled-route-manifest.cjs; .skilled/bin/tests/compiled-route-surface-hint.test.cjs.
- Reuse candidates: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/{hub-skill-scaffold.md,packet-skill-scaffold.md}; .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs.
- Constraints: research only; no edits under .skilled/.
---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 2
- Started: 2026-10-19T08:18:18.987Z

resource-map.md not present; skipping coverage gate
