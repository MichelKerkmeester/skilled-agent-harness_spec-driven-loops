---
title: Deep Research Strategy - cli-mistral-vibe executor kind
description: Runtime strategy file for the vibe-1 fan-out lineage researching what the deep-loop executor kind cli-mistral-vibe adds.
trigger_phrases:
  - "deep research strategy"
  - "cli-mistral-vibe executor kind"
  - "deep-loop executor kind"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the `vibe-1` fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next.

### Usage

- **Init:** populated from config and the continuity ladder.
- **Per iteration:** the agent reads Next Focus, writes iteration evidence, and the reducer refreshes the machine-owned sections.
- **Mutability:** analyst-owned sections are stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC
In one short paragraph: what does the deep-loop executor kind cli-mistral-vibe add?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which source file owns the `cli-mistral-vibe` executor kind, and what config fields does it declare?
- [x] How does the fan-out adapter invoke the `vibe` CLI, and what argv, prompt-delivery, and permission flags does it pass?
- [x] What does `cli-mistral-vibe` add over the executor kinds that already existed (native, cli-claude-code, cli-opencode, cli-codex)?
- [x] How is a `cli-mistral-vibe` lineage's output verified and its executor provenance recorded?
- [x] What limits or failure modes does the kind carry?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not evaluating whether `cli-mistral-vibe` is a good design choice.
- Not implementing or modifying the executor kind.
- Not benchmarking model quality across executor kinds.

---

## 5. STOP CONDITIONS
- Convergence on `newInfoRatio` below the configured threshold (0.05).
- `maxIterations` reached (1 for this lineage).
- Unrecoverable state corruption or a refused gateway append.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which source file owns the `cli-mistral-vibe` executor kind, and what config fields does it declare?
- How does the fan-out adapter invoke the `vibe` CLI, and what argv, prompt-delivery, and permission flags does it pass?
- What does `cli-mistral-vibe` add over the executor kinds that already existed (native, cli-claude-code, cli-opencode, cli-codex)?
- How is a `cli-mistral-vibe` lineage's output verified and its executor provenance recorded?
- What limits or failure modes does the kind carry?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- starting from the spec packet's `goal.md` gave the frozen decisions (D1-D6) before any source was read, so the runtime reads could be checked against stated intent instead of being interpreted cold. Reading the adapter and the audit table in the same pass worked because the kind's identity is split across exactly those two files plus the config registry. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first `grep -rn --include=*.ts` call failed under zsh globbing, which cost a call. `rg` with `--glob` is the reliable form in this shell. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Comparing Mistral model quality against other executor kinds. The topic asks what the kind adds to the runtime, not how well its models perform; no benchmark evidence exists in the packet and a quality claim would need a keyed run that `MISTRAL_API_KEY` blocks. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Comparing Mistral model quality against other executor kinds. The topic asks what the kind adds to the runtime, not how well its models perform; no benchmark evidence exists in the packet and a quality claim would need a keyed run that `MISTRAL_API_KEY` blocks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Comparing Mistral model quality against other executor kinds. The topic asks what the kind adds to the runtime, not how well its models perform; no benchmark evidence exists in the packet and a quality claim would need a keyed run that `MISTRAL_API_KEY` blocks.

### Reading the ACP supervisor as part of the kind. `spec.md` lists it as out of scope and the adapter builds print mode only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the ACP supervisor as part of the kind. `spec.md` lists it as out of scope and the adapter builds print mode only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the ACP supervisor as part of the kind. `spec.md` lists it as out of scope and the adapter builds print mode only.

### Searching for a `cli-mistral-vibe` entry in the deep-loop YAML's single-executor dispatch branches. The branch exists but deliberately refuses the kind, so there is no single-executor invocation path to document. This is a settled design decision (D4 in `goal.md`), not a gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a `cli-mistral-vibe` entry in the deep-loop YAML's single-executor dispatch branches. The branch exists but deliberately refuses the kind, so there is no single-executor invocation path to document. This is a settled design decision (D4 in `goal.md`), not a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `cli-mistral-vibe` entry in the deep-loop YAML's single-executor dispatch branches. The branch exists but deliberately refuses the kind, so there is no single-executor invocation path to document. This is a settled design decision (D4 in `goal.md`), not a gap.

### Treating the spec packet's `Status: Planned` as the current implementation state. The runtime source and test tree contradict it, so the packet status was recorded as drift (finding 8) rather than as evidence that the kind is unbuilt. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the spec packet's `Status: Planned` as the current implementation state. The runtime source and test tree contradict it, so the packet status was recorded as drift (finding 8) rather than as evidence that the kind is unbuilt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the spec packet's `Status: Planned` as the current implementation state. The runtime source and test tree contradict it, so the packet status was recorded as drift (finding 8) rather than as evidence that the kind is unbuilt.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Comparing Mistral model quality against other executor kinds. The topic asks what the kind adds to the runtime, not how well its models perform; no benchmark evidence exists in the packet and a quality claim would need a keyed run that `MISTRAL_API_KEY` blocks. (iteration 1)
- Reading the ACP supervisor as part of the kind. `spec.md` lists it as out of scope and the adapter builds print mode only. (iteration 1)
- Searching for a `cli-mistral-vibe` entry in the deep-loop YAML's single-executor dispatch branches. The branch exists but deliberately refuses the kind, so there is no single-executor invocation path to document. This is a settled design decision (D4 in `goal.md`), not a gap. (iteration 1)
- Treating the spec packet's `Status: Planned` as the current implementation state. The runtime source and test tree contradict it, so the packet status was recorded as drift (finding 8) rather than as evidence that the kind is unbuilt. (iteration 1)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Seeded from the spec packet `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind`, which is the spec that introduces the executor kind. `resource-map.md` not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs`, `.skilled/commands/deep/assets/deep-research-auto.yaml`.
- Reuse candidates: the shared fan-out adapters that already serve `cli-cursor`, `cli-devin`, `cli-pi` and `cli-deepseek-harness`.
- Integration points: `config.fanout.executors` entries, `invocation-metadata.json`, `deep-research-config.json` `executor` block.
- Constraints and risks: the spec packet is the authoritative statement of intent; runtime code is the authoritative statement of behaviour. Where they disagree, record both.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 1
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-14T16:43:06.325Z
