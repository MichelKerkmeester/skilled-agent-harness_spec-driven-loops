---
title: "Implementation Plan: Closing the Goal Re-verification Follow-ups"
description: "The orchestrator writes the doc and scenario edits, since each is a few lines with its own check, and GPT-6 Luna through cli-codex verifies the sandbox teardown. A negative control and a behaviour test prove it before CP-003 and CP-004 rerun in the five CLIs, and the cli-devin edit ships with its re-minted hub manifests."
trigger_phrases:
  - "goal re-verification follow-ups plan"
  - "cp-003 negative control"
  - "cli-devin rule rewording plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Closing the Goal Re-verification Follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill, playbook and spec docs, bash blocks inside the CP-003 and CP-004 scenarios, JSON route manifests and benchmark outcomes |
| **Framework** | Node 26, the compiled-route manifest and guard tools, the Hermes mirror sync, the goal packet command and the phase 11 matrix runner scripts |
| **Storage** | The two `cli-external-orchestration` route manifests, the system-spec-kit benchmark reports folder and sandbox folders under `/tmp` |
| **Testing** | A CP-003 negative control, a teardown behaviour test, five CLI reruns each of CP-003 and CP-004, the route guard, `validate_document.py`, the playbook validator, `check-goal.cjs` and `validate.sh --strict` |

### Overview
Every change is a few lines with its own objective check, so under the amended D1 the orchestrator writes them. The sandbox teardown is the one procedure change, so GPT-6 Luna max fast through cli-codex verifies it with a reverse check, and again after any fix. A negative control runs the committed block and the new block under a one-minute idle timeout. CP-003 then reruns in the five CLIs two at a time, and so does CP-004 once its step 5 shares the fixed teardown. The cli-devin edit changes the hub's policy hash, so both route manifests are re-minted in the same commit. The Hermes copy is rebuilt in a scratch folder and only the cli-devin file is copied back.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each follow-up confirmed in a file, with its path and line
- [x] Baselines recorded before any edit: the route guard, the Hermes check, the playbook validator on the advisor package and the live launcher's pid

### Definition of Done
- [x] The committed CP-003 block leaves a recreated folder under the negative control and the new block leaves none
- [x] CP-003 and CP-004 pass in the five CLIs, and GPT-6 Luna returns PASS on the teardown
- [x] The route guard prints every hub fresh, and a Devin prompt routes compiled
- [x] `validate.sh --strict --recursive` prints `RESULT: PASSED` for packet 030
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One orchestrator writes every edit. GPT-6 Luna verifies the teardown once it is written and again after each fix. The five CLI testers run the finished scenarios through the phase 11 runner scripts, copied into this phase's evidence folder so their header names this phase.

### Key Components
- **Sandbox teardown** (CP-003 step 1 and CP-004 step 5): gives the sandbox daemon a 12-second idle timeout and sends no signal. The block removes the sandbox only once the lease at `$SANDBOX/db/.system-skill-advisor-launcher.json` and the socket are gone, `lsof` finds no process holding a file open in the sandbox and at least 25 seconds have passed. It keeps the sandbox with a message if something is still there after 60 seconds. The open-file test covers a launcher that crashes, because a crashing launcher deletes its lease without waiting for its daemon.
- **Route manifest re-mint**: `compiled-route-manifest.cjs refresh` writes the runtime manifest, and its bytes are copied to the authored copy under `specs/sk-doc/019-skill-routing-refactor/`.
- **Hermes mirror sync**: `sync-skills-hermes.cjs` writes into a scratch folder, and only `cli-devin/SKILL.md` is copied back.
- **Benchmark record**: one outcome JSON per runtime, built from the phase 11 re-verification reports and runtime summaries with their byte counts and SHA-256.

### Data Flow
Follow-up, then a check that shows it, then the edit, then the same check again. The folder-level validators and the goal checker run last, from the final state.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The CP-003 teardown is the one behavior change. The negative control shortens the idle timeout to one minute through `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN=1`, runs the committed step 1 and watches the deleted sandbox come back when the daemon next writes, then runs the new block and watches for the same folder. A behaviour test runs the teardown on three inputs: a hostile lease naming decoy processes, a real launcher killed without its handler and the normal path as written. The five CLI reruns then check both scenarios as a whole. The other edits are docs and generated files, checked by their validators, the route guard and the Hermes check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The operator's approval of D5 and of the rewording, given on 2026-09-27.
- The phase 11 matrix runner scripts and the five CLI logins they use.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Docs, scenario files, the benchmark record and the goal: revert the phase commit.
- Route manifests: the same revert restores both manifest files with the prior hash, which matches the prior `cli-devin/SKILL.md` once that file is reverted too.
- Sandboxes: a folder left under `/tmp/cp003.*` or `/tmp/cp004.*` is removed by hand after its lease socket is confirmed inside it.
<!-- /ANCHOR:rollback -->

---
