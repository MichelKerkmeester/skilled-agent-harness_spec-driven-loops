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
Sweep the repo-wide manual-testing-playbooks and feature-catalogs for snippets and entries now stale against the committed injection-bloat behavior. Findings only, severity-ranked P0/P1/P2; no target-surface files may be modified.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (resolved)
Generated from the reducer registry. Add external or late questions through `{spec_folder}/research/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [x] No manual-testing-playbook snippet asserts delivery confirmation or observer timing that contradicts the epoch and post-emission contract.
- [x] The detailed Cursor catalog omits lifecycleEpoch >= 1, post-emission observation, and suppression-flag behavior; the root catalog omits a summary.
- [x] The detailed catalog is P1 must-fix; the root catalog is P2 optional; matched playbooks are authoritative but aligned.
- [x] No additional stale assertion exists outside the two relevant Cursor catalog entries after the bounded repo-wide sweep.
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Do not modify code, playbooks, catalogs, or any researched file.
- Do not propose changing the frozen shadow-delivery or Gate-3 code behavior.
- Do not flag illustrative examples that do not assert the changed contract.

---

## 5. STOP CONDITIONS
- Run all ten iterations because stopPolicy is max-iterations; early convergence is telemetry only.
- Synthesis must preserve verified file:line evidence and explicitly report an aligned/no-findings result when applicable.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q-001: No stale playbook snippets. Evidence: iterations 2, 5, 7, and 10.
- Q-002: Two Cursor catalog omissions. Evidence: iterations 3, 4, 6, and 10.
- Q-003: Detailed catalog P1, root catalog P2, playbooks aligned. Evidence: iterations 2, 8, and 9.
- Q-004: No additional target finding. Evidence: iterations 4, 7, and 10.
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Exact inventory plus the requested broad grep narrowed the corpus before semantic reading (iteration 1).
- Source-to-catalog comparison used the shared README, implementation, and executable tests as independent authority (iterations 3 and 6).
- Paraphrase and old-contract negative controls separated generic Gate-3/emission wording from the changed delivery contract (iterations 4, 5, and 7).
- Authority/scope review calibrated the P1/P2 split without flagging unrelated governance catalogs (iterations 8 and 9).
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Treating every Gate-3/spec-gate keyword match as a finding failed because 15 of 17 catalog matches were unrelated governance or routing surfaces (iterations 1 and 4).
- Treating generic confirmed delivery, observed, or emission language as Gate-3 question evidence failed because the surrounding contracts were host events, approvals, reports, or generated output (iterations 5 and 7).
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### Broad keyword matching -- BLOCKED (iteration 4, 3 attempts)
- What was tried: Gate-3/spec-gate, delivery, emission, receipt, policy, and suppression terms across all catalogs.
- Why blocked: Generic terms cross unrelated feature families.
- Do NOT retry: Do not flag a document without a changed-contract term or a semantic ownership link.

### High-signal source comparison -- PRODUCTIVE (iteration 6)
- What worked: Shared README, core, tests, and adapter order checks provided independent contract evidence.
- Prefer for: Follow-on implementation validation of the two Cursor catalog updates.
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Flag CU-014 as stale because spec-gate-classify is dormant: its host-event non-delivery assertion remains correct (iterations 2 and 5).
- Flag CU-013/CU-020/CU-021 because they mention confirmed events or Gate-3: their contracts cover separate host-event, prebind, and Task-matcher behavior (iterations 2 and 6).
- Flag system-spec-kit doctor, Unicode, constitutional, dispatch, maintainability, or child-session catalogs: they do not own Gate-3 question delivery (iterations 4 and 8).
- Treat generic emission or observed terms as the changed contract: surrounding feature context rules this out (iterations 5 and 7).
- Change the frozen shadow-delivery or runtime behavior: this review is documentation-only (all iterations).
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 4
- Failed pivots: 0
- Audited overrides: 0
- Saturated: playbook contradiction search; non-Cursor catalog ownership; explicit old-contract search
- Pivot lineage: inventory -> playbook scenarios -> catalog/source comparison -> paraphrase and severity challenge
- Remaining frontier: none for this scope; follow-on implementation is outside this findings-only run
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- None. The two verified findings and aligned-playbook verdict are fully synthesized.
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No next research focus. Follow-on implementation may update the P1 detailed Cursor catalog and optionally the P2 root summary while preserving frozen runtime behavior.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Memory context was unavailable in this detached run; use repository evidence as the source of truth.

Changed contract: delivery confirmation requires an observed receipt with lifecycleEpoch >= 1; Gate-3 observers are post-emission on claude/codex/cursor/devin and final pre-return on Pi/return-based hooks; shadow delivery remains flags-off, fail-open, and byte-identical; spec-gate-core exports include observeGate3QuestionDelivery, buildGate3ObservedReceipt, currentGate3LifecycleEpoch, and shouldSuppressGate3Delivery.

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
- Convergence threshold: 0.05 (telemetry only under max-iterations stop policy)
- Per-iteration budget: 12 tool calls, 10 minutes
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
- Started: 2026-08-07T16:32:44Z
