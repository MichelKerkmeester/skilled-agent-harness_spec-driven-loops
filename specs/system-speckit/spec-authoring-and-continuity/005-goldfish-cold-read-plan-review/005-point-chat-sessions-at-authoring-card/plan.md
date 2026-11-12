---
title: "Implementation Plan: Phase 5: point-chat-sessions-at-authoring-card"
description: "Add the canonical authoring-card pointer to the scaffold output, Gate-3 mutation notice and system-spec-kit IMPLEMENT route. Verify the active chat route before editing and add focused checks to the existing test files."
trigger_phrases:
  - "point chat sessions at authoring card plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: point-chat-sessions-at-authoring-card

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, JavaScript, TypeScript and Markdown |
| **Framework** | Node.js system-spec-kit runtime |
| **Storage** | None |
| **Testing** | Node.js node:test and Vitest |

### Overview
This phase adds the same canonical card path to three existing chat-facing carriers. Three setup checks confirm from the files that each carrier delivers its text without a typed command, and record that the advisor does not pick system-spec-kit for a plain write. Focused tests cover scaffold output and the shared mutation notice, and a command proves the IMPLEMENT keyword match.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] T001, T002 and T003 have printed their expected counts.
- [x] The canonical card path exists at .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md.
- [x] Each of the three carrier paths and its focused proof command is named in tasks.md.

### Definition of Done
- [x] All acceptance criteria are met.
- [x] The targeted scaffold and spec-gate tests pass, and the router probe prints `['add']`. Evidence: T008 at `../scratch/build-evidence.md:153`, T011 at `../scratch/build-evidence.md:52`, and T012-T013 in tasks.md.
- [x] The phase packet passes strict validation with RESULT: PASSED. Evidence: final strict validation printed `RESULT: PASSED (errors=0 warnings=0)`; exit 0.
- [x] Docs updated (spec/plan/tasks)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three existing entry-point pointers

### Key Components
- **create.sh**: prints the card path after standard and phase scaffolding.
- **spec-gate-core.mjs**: places the card instruction in the shared first-mutation notice.
- **ROUTER.md**: matches write-intent terms to IMPLEMENT, whose resource map already names the card.
- **Focused tests**: verify the visible CLI output and the mutation notice. A command against ROUTER.md verifies the keyword match.

### Decisions made in the review pass

These close choices the first draft left to the implementer. Each is written into the task that carries it.

- **The first task was not runnable.** It asked for a live route trace from the active chat runtime, with a branch that widened the phase if the trace came back negative. T001 to T003 replace it with three counts read from the files. The advisor question is answered by measurement: it does not recommend system-spec-kit for the measured prompt.
- **What "reaches a chat session" means here.** A command the session runs prints the text, or a file the session is told to read holds it, with no slash command typed. The scaffold output and the mutation notice pass on their own. ROUTER.md passes only for a session that has opened system-spec-kit, because `SKILL.md` tells every invocation to read it. That limit is stated in spec.md rather than hidden, and the router edit stays in the phase as its lowest-reach carrier.
- **Where the card line goes in create.sh.** A shared `SPEC_AUTHORING_CARD_NEXT_STEP` constant defines the numbered `0.` line at `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:24`. The phase and standard `Next steps` blocks print that constant at lines 2209 and 2418.
- **The notice sentence and its place.** `Once the folder is chosen, write its spec documents by following .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md.` It is the last line of GATE_3_MUTATION_NOTICE, after the line that says the answer holds for the session. GATE_3_DENY_DETAIL embeds the notice and carries the sentence with it.
- **The six verbs.** "add", "change", "edit", "fix", "update" and "write". They go into the IMPLEMENT row of INTENT_SIGNALS at `.skilled/skills/system-spec-kit/ROUTER.md:163` and into the prose list of the same keywords at `.skilled/skills/system-spec-kit/ROUTER.md:39`, so the file does not disagree with itself.
- **No new case in smart-router-measurement.vitest.ts.** Its harness resolves a skill under `.skilled/skill/<name>` in a temporary workspace, which is not the shipped layout. A case for the real router would need a fixture copy whose behaviour nobody has measured. T012 proves the match with the router's own word-boundary rule against the real file, and `check-card-sync.sh` is the existing guard that IMPLEMENT loads the card.
- **The scaffold test asserts through its helpers.** `scaffold` and `scaffoldPhase` already hold the command output. Each gets one line that throws when the card path is missing, so every existing case checks it.

### Data Flow
A scaffold command prints the card path first in its Next steps output. The first unbound mutation carries it as the last line of GATE_3_MUTATION_NOTICE, which the six shell adapters and the OpenCode plugin all load from the same core. Neither depends on the advisor. A session that opens system-spec-kit reads ROUTER.md, where a plain write verb now selects IMPLEMENT and its authoring-card resource. The advisor does not open the skill for a plain write, so the router carrier arrives later than the other two or not at all.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup checks create.sh, spec-gate-core.mjs and SKILL.md for how each carrier reaches a session, and records the skill-advisor.cjs result.
Implementation updates create.sh, scaffold-passes-its-own-gate.vitest.ts, spec-gate-core.mjs, spec-gate-core.test.mjs and ROUTER.md, one edit per task.
Verification validates spec.md, plan.md and tasks.md; the scaffold and spec-gate test runs sit beside their edits in tasks.md.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the two focused tests from the repository root:

~~~bash
(cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-passes-its-own-gate.vitest.ts)
node --experimental-test-module-mocks --test .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs
~~~

The scaffold test proves the card path appears in standard and phase output, because both scaffold helpers throw without it. The spec-gate test proves the shared notice includes its sentence, because it compares the notice byte for byte. T012's command proves the write prompt matches an IMPLEMENT keyword, and `check-card-sync.sh` proves IMPLEMENT still loads the card. Run the strict spec validator after the final packet edit. No suite was run while this plan was written.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The card already exists at .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md. The ROUTER.md resource map already includes that path under IMPLEMENT. The advisor does not recommend system-spec-kit for the measured prompt, as the Measured Behavior block in spec.md shows.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a focused check fails after the carrier edits and the failure is not a wrong expectation in this plan. Revert the scoped source and test edits with `git checkout -- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs .skilled/skills/system-spec-kit/ROUTER.md`, after `git diff` on those five paths shows only this phase's lines. Then rerun T001 to T003.

<!-- /ANCHOR:rollback -->

---


<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Produces standard and phase Next steps text. | Update both output branches. | T004 and T005 path counts and the T008 focused scaffold test. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts | Consumes standard and phase scaffold output. | Make both scaffold helpers throw when the card path is missing. | T006 and T007 counts and the T008 focused scaffold test. |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Owns the shared first-mutation notice used by adapters. | Add the card sentence as the notice's last line. | T009 prints the last line; T011 focused node:test. |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | Consumes and asserts the shared notice text. | Update expected notice. | T010 count and T011 focused node:test. |
| .skilled/skills/system-spec-kit/ROUTER.md | Maps write-intent terms to IMPLEMENT and its resource map. | Update the keyword row and the prose list of the same keywords; preserve resource map. | T012 keyword probe; T013 prose count and `check-card-sync.sh`. |

Required inventories:
- Same-class producers: rg -n -F 'Next steps:' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh inventories the standard and phase output branches.
- Consumers of changed symbols: rg -n 'GATE_3_MUTATION_NOTICE|IMPLEMENT|authoring-card' .skilled/skills/system-spec-kit/runtime .skilled/skills/system-spec-kit/ROUTER.md inventories the notice, router and focused checks.
- Matrix axes: scaffold kind has standard and phase rows (2); mutation state has the first unbound mutation row (1); intent has the measured plain-language write prompt row (1). Four planned proof rows total.
- Algorithm invariant: N/A — this packet changes routing and static guidance, not path, redaction, parser, resolver, or security algorithms.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 4 handoff | Implementation; carrier edits wait for T001 to T003. |
| Implementation | T001 to T003 printed their expected counts | Verification of all four requirements and focused checks. |
| Verification | Implementation edits and focused test results | Packet closure; strict validation must report RESULT: PASSED. |
<!-- /ANCHOR:phase-deps -->

---
