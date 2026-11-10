---
title: Deep Research Strategy - DSH route patch declarations
description: Session tracking for the dsh-live-2 fan-out lineage.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - DSH route patch declarations

## 1. OVERVIEW

One-iteration factual audit of the two checked-in DeepSeek Harness route patches under `.dsh/patches/`. The session records what each patch declares and whether the two declarations agree. Scope is the checked-in files, not endpoint health.

## 2. TOPIC

What do the two checked-in DeepSeek Harness route patches under `.dsh/patches/` declare (endpoint, model id, reasoning effort, compat flags), and do they agree with each other? Read the files; answer in under 200 words.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What endpoint and model id does `.dsh/patches/route-llmgateway-deepseek.patch.yml` declare?
- [x] What endpoint and model id does `.dsh/patches/route-opencode-go-deepseek.patch.yml` declare?
- [x] What reasoning effort and compat flags does each route patch declare?
- [x] Where do the two route patches disagree with each other?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not run a keyed probe or any `dsh` dispatch.
- Do not modify either patch, any packet file, or any file outside this lineage.
- Do not assess whether either endpoint actually works; only record what the files declare and how the repository labels verification state.

---

## 5. STOP CONDITIONS

- `config.maxIterations` is 1, so the loop stops at the cap after iteration 1.
- Stop early only on unrecoverable state corruption or an append-gateway refusal.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What endpoint and model id does `.dsh/patches/route-llmgateway-deepseek.patch.yml` declare?
- What endpoint and model id does `.dsh/patches/route-opencode-go-deepseek.patch.yml` declare?
- What reasoning effort and compat flags does each route patch declare?
- Where do the two route patches disagree with each other?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the two patch files directly, then checking the repository's own route inventory and the prior `--dump-config` evidence, produced a declaration-level answer with three independent corroborations and no need for a keyed run. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed. The only unavailable input is a keyed dispatch, which the topic does not request and the frozen scope excludes. (iteration 1)

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

The two route patches and the repository route inventory are the primary inputs:

- `.dsh/patches/route-llmgateway-deepseek.patch.yml`
- `.dsh/patches/route-opencode-go-deepseek.patch.yml`
- `.dsh/README.md` (exactly one route patch per dispatch; OpenCode Go endpoint unverified)
- `.dsh/SYNC.md` (both patches hand-authored; OpenCode Go endpoint unverified until a keyed run proves it)
- `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt`
- `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt`

### Bounded Context Snapshot

- Source pointers: the two route patch files; `.dsh/README.md`; `.dsh/SYNC.md`; the 004 dump-config evidence.
- Reuse candidates: prior `--dump-config` output already proves each patch composes the route it names.
- Integration points: `llm-pi-ai` and `agent-default-model` are the patch rows both files target.
- Constraints and risks: the two patches are alternatives, not additive; no keyed run exists in this lineage, so endpoint health is out of scope.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 1
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: research/.deep-research-pause
- Current generation: 1
- Started: 2026-11-06T16:08:45.000Z
