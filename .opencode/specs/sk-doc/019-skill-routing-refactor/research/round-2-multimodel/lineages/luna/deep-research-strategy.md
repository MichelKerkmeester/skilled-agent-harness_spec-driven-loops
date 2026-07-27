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

# Deep Research Strategy - Luna Detached Lineage

Detached `cli-codex` lineage. The max-iterations policy is authoritative: convergence is telemetry only, and the loop must run all ten passes.

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
Second-pass, expand-do-not-converge deep audit of the sk-doc/019-skill-routing-refactor parent packet AND its full 21-child tree, going BEYOND the first audit which only covered the parent-level docs; find what the first pass missed or could not reach. Investigate at minimum: (1) each child packet internal consistency and completion-truthfulness (spec.md status vs implementation-summary vs graph-metadata vs checklist), including the two known committed child errors 012-sk-doc-routing-fixes (missing a required Level-3 file plus LEVEL_MATCH inconsistency) and 017-system-code-graph-routing-research (frontmatter _memory-block violation), and whether similar defects exist in other children; (2) drift between the parent routing-reference docs (routing-config-and-advisor-reference.md, routing-before-after.md, context-index.md, spec.md) and the ACTUAL live state of the compiled-routing runtime at .opencode/bin/lib/compiled-routing/ and all 7 hubs hub-router.json / mode-registry.json / leaf-manifest.json / shared/references/smart-routing.md; (3) whether the just-landed parent-doc fixes in commit 140266be3e introduced any NEW inconsistency, stale cross-reference, wrong metric, or broken link; (4) lifecycle-status truthfulness parent-vs-child across the whole tree, and correctness of derived.last_active_child_id and children_ids; (5) any broken, stale, or non-repo-rooted cross-document link anywhere in the tree; (6) resume-safety and nested-topology gaps (the 020/007 duplicate-012 prefix collision and the 14-child 015 sub-parent). For EVERY finding give file:line evidence, a severity (P1 or P2), state whether it is NEW (introduced by the recent fixes) or PRE-EXISTING, and verify the claim against the real file before reporting. Do NOT treat frozen historical artifacts as defects; EXCLUDE research/**, benchmark/**, lineages/**, *.out, *.log, and run-record artifacts.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Do all 21 child packets agree internally on status, required files, metadata, checklists, and completion truthfulness?
- [ ] Does the parent documentation match the compiled-routing runtime and all seven hub manifests after commit 140266be3e?
- [ ] Are lifecycle metadata, links, duplicate prefixes, nested topology, and resume paths safe across the entire tree?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not modify the parent packet, any child packet, runtime files, hub manifests, or historical artifacts.
- Do not treat research/**, benchmark/**, lineages/**, *.out, *.log, or run-record artifacts as defects.
- Do not report a finding without re-reading the cited file and confirming its line evidence.
- Do not implement fixes; produce evidence-backed findings only.

---

## 5. STOP CONDITIONS
- Stop only after iteration 10; convergence before that is telemetry and must trigger a broader review angle.
- A finding is reportable only with file:line evidence, P1/P2 severity, and NEW/PRE-EXISTING classification.

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
### `in_progress` states with explicit deferred requirements or blocked gates were not treated as contradictions by themselves. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `in_progress` states with explicit deferred requirements or blocked gates were not treated as contradictions by themselves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `in_progress` states with explicit deferred requirements or blocked gates were not treated as contradictions by themselves.

### A missing-child or duplicate-`children_ids` defect was ruled out for the parent, 020, 020/007, and 015 nested parents. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A missing-child or duplicate-`children_ids` defect was ruled out for the parent, 020, 020/007, and 015 nested parents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A missing-child or duplicate-`children_ids` defect was ruled out for the parent, 020, 020/007, and 015 nested parents.

### Broken Markdown links in the non-excluded packet tree were ruled out by direct filesystem resolution. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Broken Markdown links in the non-excluded packet tree were ruled out by direct filesystem resolution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Broken Markdown links in the non-excluded packet tree were ruled out by direct filesystem resolution.

### Frozen historical review/research/benchmark statuses were excluded from the matrix. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Frozen historical review/research/benchmark statuses were excluded from the matrix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Frozen historical review/research/benchmark statuses were excluded from the matrix.

### Historical underscore references in frozen verification/research artifacts were not promoted to findings. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Historical underscore references in frozen verification/research artifacts were not promoted to findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Historical underscore references in frozen verification/research artifacts were not promoted to findings.

### Manifest regeneration drift in any of the seven hubs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Manifest regeneration drift in any of the seven hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Manifest regeneration drift in any of the seven hubs.

### Missing serving-closure files or activation manifests. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Missing serving-closure files or activation manifests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing serving-closure files or activation manifests.

### No equivalent unresolved typed contract was found in representative replays for the other six hubs. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No equivalent unresolved typed contract was found in representative replays for the other six hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No equivalent unresolved typed contract was found in representative replays for the other six hubs.

### No excluded research, benchmark, lineage, log, output, or run-record artifact was promoted into the result. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No excluded research, benchmark, lineage, log, output, or run-record artifact was promoted into the result.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No excluded research, benchmark, lineage, log, output, or run-record artifact was promoted into the result.

### No fleet-wide manifest identity defect: the seven hub registry/router/manifest sets and check-only generation audit were clean. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No fleet-wide manifest identity defect: the seven hub registry/router/manifest sets and check-only generation audit were clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No fleet-wide manifest identity defect: the seven hub registry/router/manifest sets and check-only generation audit were clean.

### No promotion of frozen historical artifacts or missing Markdown links to current findings. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No promotion of frozen historical artifacts or missing Markdown links to current findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No promotion of frozen historical artifacts or missing Markdown links to current findings.

### No severity downgrade: the P1 findings affect validator correctness, lifecycle/resume safety, serving-contract truthfulness, or live typed resource resolution. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No severity downgrade: the P1 findings affect validator correctness, lifecycle/resume safety, serving-contract truthfulness, or live typed resource resolution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No severity downgrade: the P1 findings affect validator correctness, lifecycle/resume safety, serving-contract truthfulness, or live typed resource resolution.

### No speculative or duplicate finding was added merely to fill the tenth iteration. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No speculative or duplicate finding was added merely to fill the tenth iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No speculative or duplicate finding was added merely to fill the tenth iteration.

### Registry/router/manifest mode-set drift across the seven hubs. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Registry/router/manifest mode-set drift across the seven hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Registry/router/manifest mode-set drift across the seven hubs.

### The compiled runtime being absent or merely represented by a manifest was ruled out: the tracked closure contains the runtime engine, seven activation manifests, and the public front door executed successfully for all seven hubs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The compiled runtime being absent or merely represented by a manifest was ruled out: the tracked closure contains the runtime engine, seven activation manifests, and the public front door executed successfully for all seven hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The compiled runtime being absent or merely represented by a manifest was ruled out: the tracked closure contains the runtime engine, seven activation manifests, and the public front door executed successfully for all seven hubs.

### The duplicate `012` numeric prefix causing an actual resolver collision was ruled out; the full packet IDs preserve disambiguation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The duplicate `012` numeric prefix causing an actual resolver collision was ruled out; the full packet IDs preserve disambiguation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The duplicate `012` numeric prefix causing an actual resolver collision was ruled out; the full packet IDs preserve disambiguation.

### The finding is not based on a missing resource-list entry alone; it is based on the runtime's own `pairs: []` and `unresolved` output after manifest cross-checking. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The finding is not based on a missing resource-list entry alone; it is based on the runtime's own `pairs: []` and `unresolved` output after manifest cross-checking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The finding is not based on a missing resource-list entry alone; it is based on the runtime's own `pairs: []` and `unresolved` output after manifest cross-checking.

### The untracked underscore advisor directory was not treated as the canonical source merely because it exists locally. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The untracked underscore advisor directory was not treated as the canonical source merely because it exists locally.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The untracked underscore advisor directory was not treated as the canonical source merely because it exists locally.

### Treating the 2-of-7 statement as current runtime truth was ruled out by direct seven-hub enumeration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the 2-of-7 statement as current runtime truth was ruled out by direct seven-hub enumeration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 2-of-7 statement as current runtime truth was ruled out by direct seven-hub enumeration.

### Treating the frozen review iteration links to historical worktree paths as current defects was ruled out by the operator's frozen-artifact exclusion. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the frozen review iteration links to historical worktree paths as current defects was ruled out by the operator's frozen-artifact exclusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the frozen review iteration links to historical worktree paths as current defects was ruled out by the operator's frozen-artifact exclusion.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- The compiled runtime being absent or merely represented by a manifest was ruled out: the tracked closure contains the runtime engine, seven activation manifests, and the public front door executed successfully for all seven hubs. (iteration 2)
- Treating the 2-of-7 statement as current runtime truth was ruled out by direct seven-hub enumeration. (iteration 2)
- Broken Markdown links in the non-excluded packet tree were ruled out by direct filesystem resolution. (iteration 3)
- Treating the frozen review iteration links to historical worktree paths as current defects was ruled out by the operator's frozen-artifact exclusion. (iteration 3)
- A missing-child or duplicate-`children_ids` defect was ruled out for the parent, 020, 020/007, and 015 nested parents. (iteration 4)
- The duplicate `012` numeric prefix causing an actual resolver collision was ruled out; the full packet IDs preserve disambiguation. (iteration 4)
- Manifest regeneration drift in any of the seven hubs. (iteration 5)
- Missing serving-closure files or activation manifests. (iteration 5)
- Registry/router/manifest mode-set drift across the seven hubs. (iteration 5)
- Historical underscore references in frozen verification/research artifacts were not promoted to findings. (iteration 6)
- The untracked underscore advisor directory was not treated as the canonical source merely because it exists locally. (iteration 6)
- `in_progress` states with explicit deferred requirements or blocked gates were not treated as contradictions by themselves. (iteration 7)
- Frozen historical review/research/benchmark statuses were excluded from the matrix. (iteration 7)
- No equivalent unresolved typed contract was found in representative replays for the other six hubs. (iteration 8)
- No fleet-wide manifest identity defect: the seven hub registry/router/manifest sets and check-only generation audit were clean. (iteration 8)
- The finding is not based on a missing resource-list entry alone; it is based on the runtime's own `pairs: []` and `unresolved` output after manifest cross-checking. (iteration 8)
- No promotion of frozen historical artifacts or missing Markdown links to current findings. (iteration 9)
- No severity downgrade: the P1 findings affect validator correctness, lifecycle/resume safety, serving-contract truthfulness, or live typed resource resolution. (iteration 9)
- No excluded research, benchmark, lineage, log, output, or run-record artifact was promoted into the result. (iteration 10)
- No speculative or duplicate finding was added merely to fill the tenth iteration. (iteration 10)

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
- Are the parent graph children_ids and last_active_child_id correct across nested 020/007 and 015 topology? (iteration 1)
- Which cross-document links are broken after 140266be3e? (iteration 1)
- Does compiled-routing match the four parent reference documents and seven live hubs? (iteration 1)
- Do parent and nested graph metadata agree with the actual 21-child and nested topology? (iteration 2)
- Does `140266be3e` leave any new wrong metric, stale link, or changed claim beyond these pre-existing contradictions? (iteration 2)
- Which cross-document links are broken or non-rooted after excluding frozen artifacts? (iteration 2)
- Do parent and nested graph metadata have complete, unique, and resumable child topology? (iteration 3)
- Do duplicate `012` prefixes and the 14-child `015` sub-parent cause actual graph or resume ambiguity? (iteration 3)
- Are there status contradictions deeper in the nested tree beyond the direct-child scan? (iteration 3)
- Do the seven live hub manifests, compiled snapshots, and authored registries agree byte-for-byte on identity and mode counts? (iteration 4)
- Are there stale cross-document path references outside Markdown link syntax in the nested tree? (iteration 4)
- Does a full validator/status pass reveal additional completion-truthfulness defects in children not yet sampled? (iteration 4)
- Does the full non-excluded status matrix contain more completion claims that disagree with graph/checklist state? (iteration 5)
- Do the final re-read passes confirm every finding's classification and evidence? (iteration 5)
- Are authored path references outside Markdown-link syntax stale in the nested tree? (iteration 5)
- Does a final all-finding re-read change any severity or NEW/PRE-EXISTING classification? (iteration 6)
- Are there additional lifecycle mismatches hidden by intentional deferred checklists? (iteration 6)
- Do any other active child documents contain stale path tokens that resolve only because of generated or untracked directories? (iteration 6)
- Are the parent reference contradictions best retained as separate findings or consolidated by affected contract? (iteration 7)
- Can synthesis be written entirely inside the lineage while preserving the max-iterations telemetry record? (iteration 7)
- Does the final re-read find any classification or severity error in the 14 accumulated findings? (iteration 7)
- Does the final citation re-read preserve the P1 classification and distinguish this defect from the already reported parent-document contradictions? (iteration 8)
- Are all ten iteration records, registry entries, and synthesis artifacts complete inside the lineage? (iteration 8)
- Final synthesis must preserve the distinction between a clean seven-hub identity/closure audit and the sk-code-only typed resource-contract failure. (iteration 9)
- Final state must record iteration 10 and synthesis completion inside this lineage only. (iteration 9)
- Synthesis must consolidate the evidence without rewriting or mutating the audited parent/child packets. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Synthesis must consolidate the evidence without rewriting or mutating the audited parent/child packets.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior memory context was loaded for this detached lineage. The first pass covered parent-level docs only; this pass must descend through all children and live compiled-routing/hub surfaces.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-23T19:09:00Z
