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
Improve, refine and expand the Jev spec-track narrowing (cli-jev feature 017). Its scorer is .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs in system-spec-kit, and it measures Gate 1 retrieval, where ripgrep and the committed trigger-index lookup find which specs/<track>/ a request belongs to. Measured result: verdict jev: keep K=256 M=256 A=97 B=68 W=78 L=49 F=47 p=0.006330, p50 330 ms, p95 391 ms. Real data. Jev names the right track more often than ripgrep, but both are right on well under half of the 256 questions. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What drove the benchmark result, and which data, model, or metric choices explain it?
- [ ] Which changes can raise accuracy or lower cost without weakening the route?
- [ ] How can a new measurement better represent real Gate 1 requests and produce trustworthy estimates?
- [ ] Which other .skilled routing or classification decisions could benefit from measured judging?
- [ ] What controls, cost, fallback, and risks would default-on integration require?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation design only at recommendation level; no code changes, scorer edits, live Jev calls, benchmark reruns, or parent-packet writes. Phase 047 owns measurement.

---

## 5. STOP CONDITIONS
Reach exactly three iterations under max-iterations. Treat earlier convergence as telemetry only and broaden the review angle. Mark claims UNKNOWN when local evidence is insufficient.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the scoring functions beside the exact recorded report made the relative keep rule and the absolute-error gap auditable. (iteration 1)
- Recomputing timings from the existing call log separated the actual choice-call distributions from the aggregate report without rerunning the scorer. (iteration 2)
- Comparing the Jev experiment to the advisor’s existing holdout and hook contract exposed an adjacent route with a concrete evaluation and a practical fail-open model. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The current run cannot show whether live prompts resemble packet descriptions; the call log does not archive the submitted text. (iteration 1)
- The run has no live Gate 1 request corpus, no prompt digest, and no dollar price evidence, so accuracy transfer and financial savings remain unmeasured. (iteration 2)
- The repository evidence cannot establish backend data retention, request volume, dollar pricing, or production end-to-end latency. (iteration 3)

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
- No research question remains; synthesis should consolidate the five requested answers and name the unknown release inputs. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
No research question remains; synthesis should consolidate the five requested answers and name the unknown release inputs.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
resource-map.md not present; skipping coverage gate. Existing evidence: feature 017 spec and plan, committed scorer, and the recorded Jev run.

### Bounded Context Snapshot

- Source pointers: feature 017 spec/plan; score-track-narrowing.mjs; committed Jev run report, stdout, and calls.jsonl; lookup-trigger-index.mjs; rg-wrapper.mjs.
- Reuse candidates: system-skill-advisor scoring lanes, offline Jev tie-break harness, and fail-open prompt hook.
- Integration points: Gate 1 selection before lookup/ripgrep scope is narrowed.
- Constraints and risks: research only; no model calls or reruns; measured corpus consists of packet descriptions, not confirmed live requests.
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
- Started: 2026-10-02T22:45:46.144Z
