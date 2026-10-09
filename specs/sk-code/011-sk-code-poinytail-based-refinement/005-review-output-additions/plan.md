---
title: "Implementation Plan: Phase 5: review-output-additions"
description: "Adds a Not checked line, a workload note and a deferral-cost User impact field to the sk-code-review output contract and its README, finding schema and canary scenario, widens the removal-plan search line, and moves the review agent's optional result block above the closing status line. A new Node.js checker proves review output ends on the exact Review status line, the rule-copy canary runs it over the documented examples, and every runtime mirror is regenerated with the repository's sync scripts."
trigger_phrases:
  - "review output additions plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: review-output-additions

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill, agent and playbook docs; TOML agent mirror (generated); Node.js ES module scripts (`.skilled/package.json` declares `"type": "module"`); bash test harness |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-rule-copies.test.sh` tamper harness, `check-rule-copies.js` canary, mirror checks (`check-agent-mirror-sync.cjs --all`, `sync-agents.cjs --check`, `sync-agents-pi.cjs --check`, `sync-skills-hermes.cjs --check`, `sync-runtime-mirrors.cjs --check`, `agent-roster-mirror-check.cjs`), `validate_document.py`, `verify_alignment_drift.py` |

### Overview
The output contract in `.skilled/skills/sk-code/sk-code-review/SKILL.md:330-389` gains three things: a `Not checked:` line directly above the final `Review status:` line (default `Not checked: nothing material`), a workload note on the Risk field of performance findings, and a User impact field that names the cost of deferring the fix. The same changes reach the README example (`README.md:69-114`), the finding schema (`references/review-core.md:88-116`) and the CR-024 canary scenario. The removal plan's search checkbox (`assets/removal-plan.md:57`) is widened to callers, tests, fixtures, config and string references. The review agent's optional `AGENT_IO_RESULT` envelope, which today is appended after the whole report (`.skilled/agents/review.md:290`), moves above the closing `Not checked:` and `Review status:` lines. A new script, `scripts/check-review-final-line.js`, fails any review output whose last line is not an exact status line, that has the result block after the status line, or whose full-review form lacks the `Not checked:` line. The rule-copy canary imports it and runs it over the two documented example outputs, closing the gap that the canary only checks string presence (`scripts/check-rule-copies.js:31-35`).
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc contract edit plus a fail-closed checker wired into the canary that CI already runs, followed by generator-driven mirror regeneration.

### Key Components
- **Output contract** (`.skilled/skills/sk-code/sk-code-review/SKILL.md:330-389`): finding template (Risk :344, User impact :345), template block ending at `## Next Steps` (:357), final-line contract (:362-376), example output bottom (:378-387), skip-output exception (:389).
- **README example** (`.skilled/skills/sk-code/sk-code-review/README.md:67-114`): read by the canary (`check-rule-copies.js:44-51`); User impact at :81, status line at :99, final-line explanation at :102, canary sentence at :114.
- **Finding schema** (`.skilled/skills/sk-code/sk-code-review/references/review-core.md:88-116`): the `evidence` row (:98) and the suggested shape (:107-116) have no workload or User impact wording today.
- **Removal plan** (`.skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:56-60`).
- **Final-line checker** (new, `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js`): exports `checkReviewOutput(text)` and runs as a CLI on a file or stdin.
- **Rule-copy canary and harness** (`scripts/check-rule-copies.js`, `scripts/check-rule-copies.test.sh`, `scripts/README.md`).
- **CR-024 scenario** (`.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md`): describes what the canary checks (:3, :15, :19, :27, :31, :33, :49, :70-71). Its prompt must stay equal to the root index (`manual-testing-playbook.md:632`, rule at `rule-invariant-canary.md:81`), so the prompt is not changed.
- **Review agent and its mirrors.** Per `.skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md:28-48`: `.skilled/agents/review.md` is the authored source; `.codex/agents/review.toml` and `.pi/agents/review.md` are generated by `codex/sync-agents.cjs` and `pi/sync-agents-pi.cjs`; `.hermes/skills/agent-review/SKILL.md` is generated by `hermes/sync-skills-hermes.cjs` from `.skilled/agents` (`sync-skills-hermes.cjs:22-27`); `.cursor/agents/review.md` and `.devin/agents/review/AGENT.md` are symlinks onto `.claude/agents/review.md`. `.claude/agents/review.md` has no generator: the crosswalk calls it an "authored fork" that "is itself kept in step with `.skilled` by hand" (:31, :39), and `sync-runtime-mirrors.cjs:36-39` reads it as a source, not an output. So the one-line edit is applied to it by hand and proven by `check-agent-mirror-sync.cjs --all`, which compares its body to `.skilled`.
- **Hermes skill copy** (`.hermes/skills/sk-code-review/SKILL.md`): generated copy of `SKILL.md`, regenerated by the same `sync-skills-hermes.cjs` run.

### Result block placement decision
The envelope goes before the closing lines; the status line is not restated after it. Reasons from the contracts: `SKILL.md:364` requires "exactly one" status line as the absolute final line, and a restated copy would put two verdict lines in one output that could disagree. The shared Agent I/O contract already forbids the envelope from displacing a required positional status line (`.skilled/skills/system-spec-kit/references/workflows/agent-io-contract.md:89`, "never before a required first-line status"), and consumers find the envelope by its header, not its position (`agent-io-contract.md:28`; `.skilled/agents/orchestrate.md:232`). The envelope still follows the review body, so "append after the native response body" (`agent-io-contract.md:71,89`) holds if the two closing lines are read as the report's fixed trailer. That shared contract is outside this phase; its wording is noted as a follow-up, not edited.

### Data Flow
A full review ends: report body, optional `AGENT_IO_RESULT v1` block, a blank line, `Not checked: ...`, a blank line, one exact status line. Automation reads only the last line, whose form is unchanged. `check-review-final-line.js` normalizes CRLF, strips one terminating newline and rejects: empty input; a blank line after the status line; an `AGENT_IO_RESULT v1` line after the last `Review status:` line; a last line matching neither `^Review status: (APPROVED|REQUESTED_CHANGES|COMMENTED)$` nor the skip forms `^Review status: COMMENTED \((no changes since last review at \S+|skipped: [^)]+)\)$` (`SKILL.md:490`, `SKILL.md:524`); and, for the three bare status lines, a nearest non-blank line above that does not match `^Not checked: \S`. CI runs `check-rule-copies.js` through `.github/workflows/rule-canary-sync.yml:19-26`, so the example-output invariant runs in CI with no workflow edit.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Known-bad inputs first.** The harness gains nine checker cases on fixture text in its temp dir: clean pass, result block placed before the closing lines (pass), M-1 and M-2 skip forms (pass), and text after the status line, result block after the status line, trailing whitespace, a blank line after the status line and a missing `Not checked:` line (each fail, with the message asserted through `expect_output` at `check-rule-copies.test.sh:82-96`). Two canary tamper cases append text after the README example's status line and delete the SKILL.md example's `Not checked:` line.
- **Existing cases stay green.** The seven current PASS lines must still pass.
- **Mirror checks.** Every generator's `--check` mode, the body comparison in `check-agent-mirror-sync.cjs --all`, the symlink check in `sync-runtime-mirrors.cjs --check` and the roster check must match their Phase 1 baselines.
- **Doc structure.** `validate_document.py --blocking-only` exits 0 today on `SKILL.md`, `README.md`, `review-core.md`, the CR-024 scenario and `.skilled/agents/review.md` (2026-10-09) and must still exit 0.
- **Gap: live review behavior.** No existing command runs a real review and checks its output, so SC-001 is proven for documented examples and for any saved output a person pipes to the checker. Tasks name this as a manual check.
- **Gap: full drift guard baseline is red.** `run-all-drift-guards.sh` exits 1 before any change, on findings in unrelated `specs/**/scratch/` files (2026-10-09). It is compared as a delta, not used as this phase's gate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js (v26.8.2 observed) running ES modules under `.skilled/package.json` `"type": "module"`; `rg`; `python3`.
- Generators, all with a `--check` mode: `.skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`. Write mode regenerates every drifted output in its tree; baselines show all in sync (codex 12, pi 12, Hermes 70, runtime mirrors 187 across 8 trees), so only this phase's files should change.
- CI runs the canary through the `.opencode/skills` symlink. The checker's main guard compares against `fs.realpathSync(process.argv[1])`, because Node resolves the symlink for `import.meta.url` but not for `process.argv[1]`.
- Open question from `spec.md` section 7 (CI or rule-copy script only): this plan runs the check inside the rule-copy script, which CI already runs. The standalone CLI has no CI consumer, because the repository stores no real review outputs.
- Follow-ups outside this phase: `agent-io-contract.md:71,89` could name the review status line as a second fixed position the envelope never displaces; the `code` and `debug` agents keep their own append wording, which is not affected by the review contract.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Restore the edited tracked files: `git restore .skilled/skills/sk-code/sk-code-review/SKILL.md .skilled/skills/sk-code/sk-code-review/README.md .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md .skilled/skills/sk-code/sk-code-review/references/review-core.md .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/efficiency-and-restraint/rule-invariant-canary.md .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh .skilled/skills/sk-code/sk-code-review/scripts/README.md .skilled/agents/review.md .claude/agents/review.md`.
- Delete the new untracked file `.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js`.
- Regenerate the mirrors from the restored sources with the same write-mode commands as the build (codex, pi, Hermes), then rerun every `--check` and the canary; all must match the Phase 1 baselines.
- Risk of rollback is low: the final status line keeps its exact form throughout, and Agent I/O consumers locate the envelope by header, so no consumer depends on the new placement.
<!-- /ANCHOR:rollback -->

---
