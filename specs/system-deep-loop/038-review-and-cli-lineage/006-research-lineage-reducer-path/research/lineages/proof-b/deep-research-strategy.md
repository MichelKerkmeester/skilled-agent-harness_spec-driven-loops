---
title: Deep Research Strategy - research reducer --artifact-dir documentation and missing-value exit code (lineage proof-b)
description: Persistent research plan for the proof-b fan-out lineage of the research-lineage-reducer-path phase.
trigger_phrases:
  - "deep research strategy"
  - "proof-b lineage strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

Fan-out lineage `proof-b` (executor cli-pi, model cline-pass/deepseek-v4.1-flash) of phase 006
(research-lineage-reducer-path) for packet 038-review-and-cli-lineage. One iteration, stop
policy max-iterations (convergence before the cap is telemetry only).

## 2. TOPIC

Which file in this packet documents the deep-research reducer's `--artifact-dir` flag, and
what exit code does a missing value produce? Answer from the packet's own docs and the
reducer source only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which file in this packet documents the deep-research reducer's --artifact-dir flag?
- [x] What exit code does a missing --artifact-dir value produce, per the reducer source?
- [x] Do the packet's docs and the reducer source agree on the flag's missing-value behavior?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- No nested CLI dispatch, no sub-agents (LEAF executor; the lineage IS the executor).
- No writes outside
  `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/research/lineages/proof-b`.
- No repo tooling that writes outside the lineage (no generate-context.js, no validate.sh, no git writes).
- No web sources: the topic is answered from the packet's own docs and the reducer source only.
- No edits to researched files; the packet and the reducer are read-only inputs.

## 5. STOP CONDITIONS

- 1 iteration completed (hard cap, stop policy max-iterations).
- The documenting file and the missing-value exit code answered with cited evidence.
- Terminal synthesis written to research.md with stopReason maxIterationsReached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which file in this packet documents the deep-research reducer's --artifact-dir flag?
- What exit code does a missing --artifact-dir value produce, per the reducer source?
- Do the packet's docs and the reducer source agree on the flag's missing-value behavior?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- enumerating every packet mention of `artifact-dir` with a content search before reading the files; that turned "which file" from a guess into a four-file candidate set with distinct roles (spec, plan, tasks, summary), and only the summary plus the T004 row carried the exit code. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed; the initial suspicion that `spec.md` would be the single answer did not survive the read, because `spec.md` specifies the flag without stating its runtime behavior. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### None. Every consulted source was reachable and on-topic. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. Every consulted source was reachable and on-topic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. Every consulted source was reachable and on-topic.

### The deep-review reducer as the subject: `spec.md:43` cites it only as the precedent, and `spec.md:77` places the deep-review reducer out of scope for this phase. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The deep-review reducer as the subject: `spec.md:43` cites it only as the precedent, and `spec.md:77` places the deep-review reducer out of scope for this phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The deep-review reducer as the subject: `spec.md:43` cites it only as the precedent, and `spec.md:77` places the deep-review reducer out of scope for this phase.

### Treating `spec.md` as the "documenting" file without checking: `spec.md` specifies the flag as a deliverable; the behavioral documentation with the exit code lives in `implementation-summary.md` (and the T004 task row). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `spec.md` as the "documenting" file without checking: `spec.md` specifies the flag as a deliverable; the behavioral documentation with the exit code lives in `implementation-summary.md` (and the T004 task row).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `spec.md` as the "documenting" file without checking: `spec.md` specifies the flag as a deliverable; the behavioral documentation with the exit code lives in `implementation-summary.md` (and the T004 task row).

### Web sources: the topic restricts the answer to the packet's docs and the reducer source, so no external retrieval was attempted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Web sources: the topic restricts the answer to the packet's docs and the reducer source, so no external retrieval was attempted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Web sources: the topic restricts the answer to the packet's docs and the reducer source, so no external retrieval was attempted.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None. Every consulted source was reachable and on-topic. (iteration 1)
- The deep-review reducer as the subject: `spec.md:43` cites it only as the precedent, and `spec.md:77` places the deep-review reducer out of scope for this phase. (iteration 1)
- Treating `spec.md` as the "documenting" file without checking: `spec.md` specifies the flag as a deliverable; the behavioral documentation with the exit code lives in `implementation-summary.md` (and the T004 task row). (iteration 1)
- Web sources: the topic restricts the answer to the packet's docs and the reducer source, so no external retrieval was attempted. (iteration 1)

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
- None. The topic is two-part and both parts are answered with cited evidence. (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT

`resource_map_present: false` -- no `resource-map.md` at the spec folder
`specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path`.
Known inventory for this lineage: the phase packet docs (`spec.md`, `plan.md`, `tasks.md`,
`implementation-summary.md`), the deep-research reducer source
`.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`, and the shared
deep-loop runtime under `.skilled/skills/system-deep-loop/runtime/`.

### Bounded Context Snapshot

- Source pointers: `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md`;
  the phase's `plan.md`, `tasks.md`, `implementation-summary.md`;
  `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs`.
- Integration points: the fan-out lineage is bound to `config.fanout_lineage_artifact_dir`
  (this directory), so the workflow's `step_resolve_artifact_root` override -- not the
  resolver node -- owns `artifact_dir`.
- Constraints and risks: LEAF-only execution, write confinement to this lineage directory,
  no repo tooling that writes.

## 13. RESEARCH BOUNDARIES

- Max iterations: 1 (from config; stop policy max-iterations)
- Convergence threshold: 0.05 (telemetry only under max-iterations policy)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new` (this lineage); `resume`/`restart` live
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-09T15:54:52Z
