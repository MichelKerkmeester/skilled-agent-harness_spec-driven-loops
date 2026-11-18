---
title: "DLR-060 -- Research prompt pack contract"
description: "This scenario validates the research prompt pack for `DLR-060`. It focuses on the conditional research.md write path and the Recommended Next Focus heading the reducer parses."
version: 1.0.1.0
---

# DLR-060 -- Research prompt pack contract

This document captures the realistic user-testing contract, execution flow, and metadata for `DLR-060`.

---

## 1. OVERVIEW

This scenario validates the research prompt pack contract for `DLR-060`. It focuses on two points where the pack must agree with the research agent definition and the reducer: the ALLOWED WRITE PATHS entry for `research/research.md`, which applies only when `progressiveSynthesis` is `true`, and the narrative heading `Recommended Next Focus`, which the research reducer parses.

### Why This Matters

The prompt pack is what each research iteration reads. If its write-path list omits `research.md`, a fan-out lineage cannot write its own synthesis. If its heading list names a different heading, the reducer finds no next focus and the loop stalls on a focus it never reads.

---

## 2. SCENARIO CONTRACT

Operators run this as a single contract check against the pack, the agent definition and the test that binds them together.

- Objective: Confirm the research prompt pack allows `research/research.md` under the `progressiveSynthesis` condition and uses the `Recommended Next Focus` heading.
- Layer partition: prompt rendering runtime.
- Real user request: A fan-out research lineage must write its own synthesis, and the reducer must read the next focus the pack asks for.
- Prompt: `Validate the research prompt pack against the research agent contract: check the research.md write path and the Recommended Next Focus heading, then run the lockstep and reducer-parse cases.`
- Expected signals: The pack carries one conditional `research.md` entry beside the iteration folder, the heading list ends in `Recommended Next Focus`, the four prompt-pack cases pass, and a drifted copy of the pack fails the lockstep case.
- Pass/fail: PASS if every signal holds and the drifted copy fails; FAIL if the pack and the agent definition disagree, a case fails on the real pack, or the drifted copy passes.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is the repository root.
- A scratch directory outside the repository is available for the drifted pack copy.

### Commands

1. `rg -n 'research\.md|Recommended Next Focus' .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl`
2. `rg -n 'research\.md|Recommended Next Focus' .skilled/agents/deep-research.md`
3. `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/prompt-pack.vitest.ts`
4. `cp .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl <scratch-dir>/drifted-pack.md.tmpl` then remove the `research.md` entry from the copy and run `DEEP_RESEARCH_PACK_TEMPLATE=<scratch-dir>/drifted-pack.md.tmpl npx vitest run tests/unit/prompt-pack.vitest.ts` from the runtime folder
5. `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs`

### Expected

Command 1 prints the conditional `research.md` entry and the `Recommended Next Focus` heading. Command 2 shows the agent definition names the same two points. Command 3 exits 0 with all prompt-pack cases passing, including the lockstep and reducer-parse cases. Command 4 exits non-zero, failing the lockstep case on the drifted copy. Command 5 exits 0 with `OK`.

### Evidence

Capture the command 1 and 2 matches, the command 3 pass count and exit status, the command 4 failing case name and exit status, and the command 5 output.

### Pass / Fail

- **Pass**: The pack and agent agree, the cases pass on the real pack, the drifted copy fails, and the contract drift check exits 0.
- **Fail**: A case fails on the real pack, the pack and the agent definition disagree, the drifted copy passes, or the drift check reports a mismatch.

### Failure Triage

If the lockstep case fails on the real pack, compare the write-path entry and the heading list against `.skilled/agents/deep-research.md` first, since the agent owns the contract. If the drifted copy passes, the lockstep case does not read the pack path from `DEEP_RESEARCH_PACK_TEMPLATE`, so check the test setup before trusting the pass.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/prompt-rendering/research-prompt-pack-contract.md` | Feature-catalog entry for the research prompt pack contract |
| `../../feature-catalog/prompt-rendering/prompt-pack.md` | Feature-catalog source for the prompt pack |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Research prompt pack; the write-path entry and the narrative heading list |
| `.skilled/agents/deep-research.md` | Agent definition the pack must match |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Lockstep, rendered-pack, lineage-render and reducer-parse cases |

---

## 5. SOURCE METADATA

- Group: PROMPT RENDERING
- Playbook ID: DLR-060
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `prompt-rendering/research-prompt-pack-contract.md`
