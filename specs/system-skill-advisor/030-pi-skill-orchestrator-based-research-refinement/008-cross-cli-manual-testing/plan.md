---
title: "Implementation Plan: Cross-CLI Manual Testing of the Advisor Refinements"
description: "Run each related playbook scenario once inside cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex, two dispatches at a time, with the advisor's debug diagnostics on so each runtime's own hook leaves a labelled record. Add Grok 4.7 to the Cursor allowlist first, after a live dispatch of each id."
trigger_phrases:
  - "cross cli testing plan"
  - "advisor scenario dispatch plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Cross-CLI Manual Testing of the Advisor Refinements

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell and Node commands from the playbook scenarios, Vitest suites, one TypeScript and one CommonJS allowlist |
| **Framework** | cli-pi, cli-opencode, cli-devin, cli-cursor and cli-codex dispatch contracts |
| **Storage** | The advisor's diagnostics JSONL under `$TMPDIR/speckit-skill-advisor-metrics/`, read only |
| **Testing** | The scenarios themselves, plus the deep-loop runtime tests for the allowlist |

### Overview
Each dispatch carries a read-only tester persona, one scenario file and a fixed report format. The executor runs the scenario's steps, compares them with the file's expected signals and prints a verdict with evidence. It also copies the first `Advisor:` line its own runtime placed in its context. `SKILL_ADVISOR_DEBUG=1` on every dispatch makes each runtime's hook write a record labelled with that runtime, which the orchestrator reads by time window from the dispatch ledger.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dispatch, observe, verify. Executors report and never fix. The orchestrator treats every report as a claim until it has checked the evidence.

### Key Components
- **Runner**: one dispatch per CLI and scenario, the command each cli skill prescribes, a 40-minute watchdog and a ledger line with start, end and exit code.
- **Briefs**: a shared header with the persona and hard rules, one task per scenario with the deviations the orchestrator decided, and a shared report format.
- **Diagnostics**: the advisor hook's JSONL records, whose `runtime` field names the host that fired the hook.

### Data Flow
Scenario file, then brief, then CLI dispatch, then report and diagnostics record, then orchestrator check, then results matrix.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The scenarios are the test. Every FAIL is rerun alone and then traced, so contention between the two concurrent runs is ruled out before a FAIL counts against the code. The allowlist change is covered by the existing deep-loop runtime tests, whose exact-list assertion fails without the new ids.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

All five CLIs passed their auth pre-flight. Both runtime builds were current, so no scenario rebuilds anything.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The runs write only under `evidence/`. The allowlist change reverts with its commit.
<!-- /ANCHOR:rollback -->

---
