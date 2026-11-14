---
title: "Implementation Plan: Phase 14: prompt-improver-model-eligibility"
description: "Fix the three prompt-improver findings in one agent file, its runtime copies and the sk-prompt agent contract. The TEST field and the caller names build now. The model eligibility rule waits for the operator to keep it on the dispatch side or drop it."
trigger_phrases:
  - "prompt improver model eligibility plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: prompt-improver-model-eligibility

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent and skill documents, two YAML workflow files, generated TOML and YAML agent copies |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` acceptance searches, the agent mirror and roster checks, the changelog shape checker and one live dispatch probe for outcome A |

The four step 5 `@context` explorers ran inline, as the workflow's fallback names, because a leaf worker cannot dispatch. Architecture: the canonical agent is `.skilled/agents/prompt-improver.md`, `.opencode/agents` is a symlink to it, `.cursor` and `.devin` symlink the `.claude` fork, and `.pi`, `.codex` and `.dsh` are generated. Feature: `sk-prompt` `SKILL.md` section 7 carries a second copy of the eligibility table and the output block, and calls the agent their canonical home. Dependency: the registry names `/prompt:improve` and `orchestrate` as dispatchers, and the `cli-*` skills and `cli-prompt-quality-card.md` also dispatch the agent through the Task tool. Test: the mirror gate, the roster check and the `SP-026` playbook scenario, which needs the `TEST` label present.

One unknown stays open. Whether a Claude Code dispatch with no model runs on the parent session's model was not measured. The first outcome A task answers it with a live probe.

### Overview
Two of the three findings build now. The `TEST` field is fixed to `NOT RUN` in the agent and in the skill's copy of its contract, and the caller section loses `@general-purpose`, `/prompt-improve` and the Integration ID table with the lines that cite it. prompt-improver-1 is planned both ways and waits for the operator. Every agent edit ends with the mirror routine.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006 has landed its edit to `.skilled/agents/prompt-improver.md`, so `git log -1 -- .skilled/agents/prompt-improver.md` names a commit after `c1dbb1bcc4` or 006 records that it left this file alone
- [ ] The Measured Behavior commands in `spec.md` re-run and their line numbers are updated where 006 moved them
- [ ] The operator has answered the open question in `spec.md` section 7, before any REQ-002 task starts

### Definition of Done
- [ ] Every acceptance command in `spec.md` section 4 prints its expected output
- [ ] `node .skilled/bin/check-agent-mirror-sync.cjs` prints `all comparable mirrors in sync` and exits 0, and `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Agent contract text edit with generated mirrors. No runtime code changes.

### Key Components
- **The canonical agent** `.skilled/agents/prompt-improver.md`: section 0.1 holds the eligibility table, section 1 the Integration ID table, section 2 the caller tables and section 6 the `TEST` field.
- **The `.claude` fork**: hand-edited to match, because no script writes it. Its line numbers run 15 lower, as its frontmatter is shorter.
- **The three generators**: `sync-agents-pi.cjs`, `sync-agents.cjs` for Codex and `sync-agents-dsh.cjs` rewrite their copies from the canonical file.
- **`sk-prompt` `SKILL.md` section 7**: the caller-facing copy of the eligibility table and the agent output block.
- **The dispatch side**, outcome A only: the two `/prompt:improve` workflow files and the `model:` line of the `.claude` fork.

### Data Flow
A caller runs `/prompt:improve --agent`, or `orchestrate` or a `cli-*` deep path dispatches `@prompt-improver` through the Task tool. The runtime loads its own copy of the agent and runs it on the model the dispatch passes, the copy pins or the runtime defaults to. The agent returns the structured package and the workflow captures its seven fields, `TEST` among them.

### Fix Approach per Requirement

| REQ | Approach |
|-----|----------|
| REQ-001 | After each agent edit run the mirror routine in section 5. The file shrinks, so the 600-line cap only needs a `wc -l` |
| REQ-002 outcome A | Delete the table and its four notes from agent section 0.1 and keep one backstop sentence: a model the `SKILL.md` table denies returns phase 006's canonical refusal and names an eligible pair. Turn `SKILL.md`'s canonical-home line round, so the skill holds the table. Add `, model=sonnet` to the AGENT dispatch line of both workflow files. Add `model: sonnet` to the `.claude` fork's frontmatter, and add it to the pin lists in `README.txt:14` and crosswalk sections 2.5 and 4 |
| REQ-002 outcome B | Delete agent section 0.1 at `:47-74` and `SKILL.md` Model Eligibility at `:229-255`. `README.txt` and the crosswalk stay as they are |
| REQ-003 | Set `:231` to `TEST: NOT RUN (this agent never runs the prompt it builds)`. Reword `:84` to say `TEST` is always `NOT RUN`. Drop `quick test +` from `:177`. Set the same field in `SKILL.md:270`, the agent output block. Leave `SKILL.md:140` and the workflows' inline paths alone, because inline mode can run the test |
| REQ-004 | Replace `@general-purpose` with `@orchestrate` at `:118` and `:281`. Replace `/prompt-improve` with `/prompt:improve` at `:124`, `:205`, `:282` and `:397`. `:102` and `:103` go with the table under REQ-005 |
| REQ-005 | Delete `### Integration Touchpoint Contract` at `:96-108`. Drop the `Integration ID` column from the three section 2 tables. Reword `:171`, `:233` and `:334` so they name surfaces exactly and no longer map them to ids |
| REQ-006 | Raise `SKILL.md` to `version: 4.0.5.0` and write `changelog/v4.0.5.0.md` for the section 7 change, as the last two `sk-prompt` edits did |

### Affected Surfaces

| Surface | Role | How it is handled |
|---------|------|-------------------|
| `.skilled/agents/prompt-improver.md` (also `.opencode/agents/` by symlink) | Producer | Edited |
| `.claude/agents/prompt-improver.md` (also `.cursor` and `.devin` by symlink) | Copy | Hand-edited |
| `.pi`, `.codex`, `.dsh` copies | Generated copies | Regenerated |
| `.skilled/skills/sk-prompt/SKILL.md:229-255`, `:270` | Second copy of the table and the output block | Edited |
| `prompt_improve_auto.yaml:85`, `prompt_improve_confirm.yaml:106` | Consumer, captures `TEST` | Field name unchanged. Outcome A adds the model |
| `manual-testing-playbook/escalation-tiers/prompt-improver-output-block.md` (`SP-026`) | Consumer, needs the `TEST` label | Label kept, so no edit |
| `.skilled/agents/README.txt:14`, `.skilled/bin/agent-mirror-crosswalk.md` sections 2.5 and 4 | Lists of model pins | Outcome A only |
| `.skilled/agents/agent-registry.json` | Source of the caller names | Read only |
| `cli-*` `SKILL.md` deep paths, `sk-prompt/assets/cli-prompt-quality-card.md:91` | Other dispatchers | No edit. They reach the `.claude` pin under outcome A |
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the Measured Behavior commands after phase 006 lands. Implementation edits the agent for REQ-003 to REQ-005, then `SKILL.md` and its changelog, then the REQ-002 outcome once the operator answers, running the mirror routine after each agent edit. Verification runs every acceptance command, the mirror and roster checks and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The mirror routine after every agent edit: hand-edit `.claude/agents/prompt-improver.md` to match, then run `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, then `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs`. The last two must print `agent-roster: OK` and `all comparable mirrors in sync`. All five script paths exist at `c1dbb1bcc4`.

Each requirement is closed by its acceptance command in `spec.md` section 4. `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-prompt/changelog/v4.0.5.0.md` must print `pass=1 fail=0`. Under outcome A, a `@prompt-improver` dispatch from a Claude Code session on Opus with a one-line `raw_task` runs twice: before the pin, to answer the open question, and after it, where it must return a package and not a refusal. `rg -c 'TEST' .skilled/skills/sk-prompt/manual-testing-playbook/escalation-tiers/prompt-improver-output-block.md` must still print a count above 0. Strict validation of this folder ends the phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node`, `python3` and `rg`. No new package. Phase 006 must land first, because it owns the canonical refusal string and edits the same agent file. The operator's answer gates REQ-002 only. The agent template's 600-line cap at `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md:62` applies.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the mirror gate blocks the commit and the drift cannot be fixed in the `.claude` fork, or the `SP-026` scenario fails on a missing field, or under outcome A the Opus probe still returns a refusal after the pin. Revert the phase's commit with `git revert`, then re-run the three sync scripts so the generated copies match the restored canonical file. The `sk-prompt` version and changelog revert in the same commit.
<!-- /ANCHOR:rollback -->

---
