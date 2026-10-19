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
Compare sk-code-skilled, sk-code-obsidian and sk-code-webflow under .skilled/skills/sk-code/ and recommend how to make them consistent in skill setup and reference architecture: SKILL.md section order, frontmatter and smart-routing blocks, the references/ tree (topic folders vs flat files, shared/, workflow-implement/debug/verify), assets, scripts, benchmark, manual-testing-playbook, changelog and README; how the hub (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), doctor checks (parent-skill-check, sk-code-setup-check) and the advisor read each surface; and where each departs from the sk-doc create-skill canon for a hub child. Separate shared structure from surface-specific content. Deliver a target layout, a per-surface gap list with path:line evidence, and an ordered migration plan with the check that guards each step.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: How do the three surfaces differ in SKILL.md section order, frontmatter fields and smart-routing blocks, and which form matches the sk-doc create-skill canon for a hub child?
- [x] Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?
- [x] Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- [x] Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- [x] Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Making any change to the surfaces; this session only recommends.
- The other sk-code children (sk-code-review, sk-code-quality and the rest).
- Rewriting surface-specific technical content (Obsidian API rules, Webflow animation rules, framework standards).

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: run all 5 iterations.
- Every recommendation must cite a path:line in one of the three surfaces, the hub files or the sk-doc canon.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: How do the three surfaces differ in SKILL.md section order, frontmatter fields and smart-routing blocks, and which form matches the sk-doc create-skill canon for a hub child?
- Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?
- Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

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
- **Q5:** What ordered migration plan, with a guarding check per step, brings each surface to the target layout? (iteration 1)
- **Q3:** How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry? (iteration 1)
- **Q4:** What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files? (iteration 1)
- **Q2:** How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content? (iteration 1)
- Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry? (iteration 2)
- Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout? (iteration 2)
- Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files? (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work: specs/sk-code/001-sk-code-parent (parent-hub canon conformance), specs/sk-code/007-sk-code-obsidian-surface (obsidian surface creation), specs/sk-code/012-sk-code-skilled-rename (sk-code-opencode renamed to sk-code-skilled, just merged). Initial listing: sk-code-skilled/references has language folders (config, javascript, python, rust, shell, typescript) plus shared/ and workflow-implement/debug/verify.md; sk-code-webflow/references has topic folders (animation, css, debugging, deployment, html, implementation, javascript, performance, verification) plus shared/ and three workflow files; sk-code-obsidian/references is mostly flat files plus operations/, quality/, release/, setup/, standards/ folders, workflow-implement/debug.md but no workflow-verify.md, and no benchmark/ folder.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
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
- Current generation: 1
- Started: 2026-10-19T06:41:00.693Z
