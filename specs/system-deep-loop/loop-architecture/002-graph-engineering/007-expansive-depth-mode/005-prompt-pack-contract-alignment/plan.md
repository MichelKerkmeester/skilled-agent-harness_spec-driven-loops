---
title: "Implementation Plan: Align the research prompt pack with the agent definition"
description: "Edit two lines of the research prompt-pack template so its allowed-write list and narrative heading match the agent definition and the reducer, regenerate the research compiled contract for the new template digest, and add a lockstep test in prompt-pack.vitest.ts. No YAML, agent or reducer change."
trigger_phrases:
  - "prompt pack contract alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Align the research prompt pack with the agent definition

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown prompt template, TypeScript tests |
| **Framework** | system-deep-loop runtime prompt-pack renderer (`runtime/lib/deep-loop/prompt-pack.ts`) |
| **Storage** | None |
| **Testing** | vitest, run from `.skilled/skills/system-deep-loop/runtime` |

### Overview
The research prompt-pack template gains one conditional allowed-write entry, worded relative to the run's artifact directory so a fan-out lineage writes its own `research.md`, and renames one heading. A new case in `prompt-pack.vitest.ts` renders the pack and compares it with the agent definition, so the two change in lockstep from now on. The research compiled contract is regenerated because it records the template's sha256. The agent definition, both YAMLs and the reducer are read, not edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/prompt-pack.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-research-deltas-contract.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts tests/unit/check-documentation-drift.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts` exits 0, with the lockstep and lineage cases red before the template edit
- [ ] The playbook scenario is written through `/create:manual-testing-playbook`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single source contract. The agent definition owns the leaf write rule; the pack restates it, and a test pins the restatement.

### Key Components
- **Research prompt-pack template**: the per-iteration prompt the YAML renders (`deep-research.yaml:1376-1398`) and that detached executors read raw (`fanout-run.cjs:1617-1625`). Static text keeps both paths identical.
- **Lockstep case in `prompt-pack.vitest.ts`**: reads `.skilled/agents/deep-research.md` and the template; fails on drift in either the progressive-synthesis rule or the next-focus heading.

### Data Flow
`deep-research-config.json` sets `progressiveSynthesis`. The leaf reads the pack, which now names the config key; the leaf reads the key from `{state_paths_config}` before writing the `research.md` beside its `iterations/` directory, as the agent definition already instructs (`deep-research.md:308-310`). In a fan-out lineage that file is `${lineageDir}/research.md`, which `fanout-run.cjs:742-745` expects. The leaf writes `## Recommended Next Focus`, which `extractSection` matches at `reduce-state.cjs:1930`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the seven suites for a green baseline and confirms no test asserts the old heading. Implementation adds the lockstep and lineage cases, edits the two template lines, then regenerates the research compiled contract as the last implementation step. Verification reruns the suites, writes the playbook scenario through `/create:manual-testing-playbook`, and confirms the diff touches only the template, the test file, the research compiled contract and the playbook package. The ordered work and each task's verify clause live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/prompt-pack.vitest.ts tests/unit/deep-research-reduce-state.vitest.ts tests/unit/deep-research-deltas-contract.vitest.ts tests/unit/deep-review-deltas-contract.vitest.ts tests/unit/check-documentation-drift.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts`. It must exit 0. The lockstep and lineage cases are written first and must fail against the current template.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package, variable or module. This phase lands before `../004-focus-hijack-fix/` and is a prerequisite of `../010-research-frontier-mode/`. `../006-state-log-leaf-fields/` edits the same template: whichever lands second regenerates the research compiled contract after the merge rather than resolving digest lines by hand.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: research leaves on default runs overwrite or corrupt `research/research.md` mid-run. Revert the single commit; the template, the compiled contract, the test and the playbook scenario return together, and no state file changes. Regenerate the contract after the revert if another phase has changed the template since.
<!-- /ANCHOR:rollback -->

---
