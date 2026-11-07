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
Design first-class named sub-tracks in spec-kit (specs/<track>/<sub-track>/<NNN>-<slug>/) and the three smaller host-repository fixes, from the Barter handover barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/005-skilled-harness-support/handover.md and its research note 004-priority-numbering-subtracks/scratch/nested-tracks.md (both read-only). Item 1: every site that assumes a track sits directly under specs/ — known: runtime/cli/lib/track-roots.mjs:38-66,104-130; refresh-track-roots.mjs:76-79; create.sh:1012; lib/validation/orchestrator.ts:219-223,1340; validate.sh:186,273,315; repair-derived.cjs parent_id on move; archive.sh is_packet_home:207 and track_of:189; sweep-track-roots.mjs and the pre-push gate via track-roots. Find any others, define the sub-track level and its metadata, keep flat tracks unchanged, and give a failing-first test plan. Item 3: project_owned .env.example doctor manifest entry (Barter overlay at barter/ai-speckit/skilled/barter-overlays/doctor/). Item 4: the tracked .skilled/specs -> ../specs link dangling in a vendored copy. Item 5: a documented host-repository trigger index and how the Gate 1 lookup finds it. Item 2 (linked specs root writes) is out of scope: packet specs/system-speckit/037-symlinked-runtime-root owns it. Read-only outside the spec folder; never open any .env file. Cite file:line for every finding.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which spec-kit sites (code, hooks, generators, gates, docs) assume a track sits directly under specs/, beyond the seven already known, and what does each do with a packet inside a sub-track today?
- [x] Q2: How should a named sub-track be defined: its detection rule, its own graph-metadata.json and description.json, parent_id and children_ids on the track and the sub-track, and how ids and numbering work, with flat tracks unchanged?
- [x] Q3: What failing-first test plan proves sub-track support (track roots, refresh, create, validate, recursive validate, archive, pre-push sweep, repair-derived on move) and proves flat tracks unchanged?
- [x] Q4: How should a project-owned doctor manifest entry for .env.example work upstream: the manifest flag, the engine's project-owned status and the setup post-check, compared with Barter's overlay?
- [x] Q5: How should the dangling .skilled/specs link in a vendored copy be fixed, and how should a host-repository trigger index be documented, including how the Gate 1 lookup finds it?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Item 2 from the handover (writes through a linked specs root): owned by specs/system-speckit/037-symlinked-runtime-root.
- Implementing any change: this run is read-only outside its spec folder.
- Barter's priority numbering map itself (Barter phase 004 owns it).

---

## 5. STOP CONDITIONS
- Three iterations completed (stop policy max-iterations).
- Any evidence that requires opening a .env file: stop that line of inquiry.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which spec-kit sites (code, hooks, generators, gates, docs) assume a track sits directly under specs/, beyond the seven already known, and what does each do with a packet inside a sub-track today?
- Q2: How should a named sub-track be defined: its detection rule, its own graph-metadata.json and description.json, parent_id and children_ids on the track and the sub-track, and how ids and numbering work, with flat tracks unchanged?
- Q3: What failing-first test plan proves sub-track support (track roots, refresh, create, validate, recursive validate, archive, pre-push sweep, repair-derived on move) and proves flat tracks unchanged?
- Q4: How should a project-owned doctor manifest entry for .env.example work upstream: the manifest flag, the engine's project-owned status and the setup post-check, compared with Barter's overlay?
- Q5: How should the dangling .skilled/specs link in a vendored copy be fixed, and how should a host-repository trigger index be documented, including how the Gate 1 lookup finds it?

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
- Q5: How should the dangling .skilled/specs link in a vendored copy be fixed, and how should a host-repository trigger index be documented, including how the Gate 1 lookup finds it? (iteration 1)
- Q4: How should a project-owned doctor manifest entry for .env.example work upstream: the manifest flag, the engine's project-owned status and the setup post-check, compared with Barter's overlay? (iteration 1)
- Q2: How should a named sub-track be defined: its detection rule, its own graph-metadata.json and description.json, parent_id and children_ids on the track and the sub-track, and how ids and numbering work, with flat tracks unchanged? (iteration 1)
- Q3: What failing-first test plan proves sub-track support (track roots, refresh, create, validate, recursive validate, archive, pre-push sweep, repair-derived on move) and proves flat tracks unchanged? (iteration 1)
- No strategy key question remains. The no-adjacent-specs vendoring case remains a reported condition rather than a reproduced failure in the mounted trees. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Verified on Skilled main before this run (2026-11-07): none of track-roots.mjs, refresh-track-roots.mjs, create.sh, orchestrator.ts, validate.sh or repair-derived.cjs changed since Barter's pin ef8e79f85a. validate.sh recursion is the numbered-only loops at lines 186, 273 and 315 (line 70 is help text). archive.sh is_packet_home (line 207) and track_of (line 189) also assume one level. retrofit-convention.mjs trackOf groups by two segments. lookup-trigger-index.mjs already takes --index; generate-trigger-index.mjs takes --repo-root and --out. .skilled/specs is a tracked symlink to ../specs. No project_owned support exists in .skilled/commands/doctor. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

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
- Current generation: 1
- Started: 2026-11-07T12:13:10.014Z
