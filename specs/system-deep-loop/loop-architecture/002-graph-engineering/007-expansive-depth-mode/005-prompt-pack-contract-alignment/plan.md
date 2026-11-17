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
The research prompt-pack template gains one conditional allowed-write entry and renames one heading. A new case in `prompt-pack.vitest.ts` renders the pack and compares it with the agent definition, so the two change in lockstep from now on. The research compiled contract is regenerated because it records the template's sha256. The agent definition, both YAMLs and the reducer are read, not edited.
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
- [ ] `npx vitest run prompt-pack deep-research-deltas-contract deep-review-deltas-contract check-documentation-drift check-contract-drift compile-command-contracts` from `.skilled/skills/system-deep-loop/runtime` exits 0, with the lockstep case red before the template edit
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single source contract. The agent definition owns the leaf write rule; the pack restates it, and a test pins the restatement.

### Key Components
- **Research prompt-pack template**: the per-iteration prompt the YAML renders (`deep-research.yaml:1376-1398`) and that detached executors read raw (`fanout-run.cjs:1617-1619`). Static text keeps both paths identical.
- **Lockstep case in `prompt-pack.vitest.ts`**: reads `.skilled/agents/deep-research.md` and the template; fails on drift in either the progressive-synthesis rule or the next-focus heading.

### Data Flow
`deep-research-config.json` sets `progressiveSynthesis`. The leaf reads the pack, which now names the config key; the leaf reads the key from `{state_paths_config}` before writing `research/research.md`, as the agent definition already instructs (`deep-research.md:308-310`). The leaf writes `## Recommended Next Focus`, which `extractSection` matches at `reduce-state.cjs:1930`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the six suites for a green baseline and confirms no test asserts the old heading. Implementation adds the lockstep case, edits the two template lines, then regenerates the research compiled contract. Verification reruns the suites and confirms the diff touches only the template, the test file and the research compiled contract. The ordered work and each task's verify clause live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `npx vitest run prompt-pack deep-research-deltas-contract deep-review-deltas-contract check-documentation-drift check-contract-drift compile-command-contracts` from `.skilled/skills/system-deep-loop/runtime`. It must exit 0. The lockstep case is written first and must fail against the current template.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package, variable or module. This phase is a prerequisite of `../010-research-frontier-mode/`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: research leaves on default runs overwrite or corrupt `research/research.md` mid-run. Revert the single commit; the template, the compiled contract and the test return together, and no state file changes.
<!-- /ANCHOR:rollback -->

---
