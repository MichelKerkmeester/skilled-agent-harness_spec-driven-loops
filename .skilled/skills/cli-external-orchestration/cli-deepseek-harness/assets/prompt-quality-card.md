---
title: DeepSeek Harness CLI - Prompt Quality Card
description: Thin dsh dispatch delegator. The canonical prompt-models card owns framework selection and quality checks, and this card adds the dsh mechanics.
trigger_phrases:
  - "dsh prompt quality card"
  - "dsh dispatch prompt discipline"
  - "dsh prompt framework selection"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# DeepSeek Harness CLI - Prompt Quality Card

**Two-tier precedence rule: sk-prompt framework first, this card's dsh dispatch addenda second.**

Load this card on every dsh route, after the canonical card, and before composing the prompt that goes to stdin.

---

## 1. OVERVIEW

### Purpose

This card is the dsh fast-path prompt-quality reference. It delegates the framework table and the CLEAR check to the canonical card and records only what a dsh prompt must carry because of how dsh headless runs.

### Usage

Start from the canonical card, apply its Pre-Dispatch Checklist, then add the dsh addenda in section 4 and run the composition check in section 5.

---

## 2. CANONICAL SOURCE

Load:

- [Canonical CLI prompt-quality card](../../../sk-prompt/assets/cli-prompt-quality-card.md)

Do not copy the canonical taxonomy into this card. Do not create a second framework table here.

---

## 3. TWO TIERS

### Tier 1 - Fast Path

Use the canonical card for ordinary dsh dispatches. Select the framework there, apply its task mapping, run its CLEAR check, then add the dsh addenda below.

### Tier 2 - Deep Path

Use the canonical card's deep-path trigger list. When it calls for prompt improvement, dispatch the approved prompt-improver workflow rather than loading the full prompt system inline.

---

## 4. DSH DISPATCH ADDENDA

A dsh headless child cannot ask a question, cannot see a persona file by path and runs inside a cwd that is not the repository root. The prompt has to make up for all three.

1. **Persona inline.** dsh has no agent-file loader. The generated persona patches exist, but a hand-composed dispatch still inlines the resolved persona block from the active runtime's agent directory. The deep-loop fan-out builder passes `.dsh/agents/<name>.patch.yml` when `agentPersona` is set.
2. **Child preamble.** Copy the preamble from [`../../shared/references/child-dispatch-preamble.md`](../../shared/references/child-dispatch-preamble.md) to the top of the prompt, and set `AI_SESSION_CHILD=1` in the dispatch environment.
3. **No questions.** Headless has no answer channel. Give every decision the child would ask about, or tell it to stop and report the blocker.
4. **Absolute paths.** The child's cwd is a scratch directory. Name every file by absolute path, and name any directory it must write outside the cwd so the caller can pass it with `--add-dir`.
5. **Rules stated, not assumed.** Whether a run outside the checkout reads the repository `AGENTS.md` is unconfirmed, so state the rules the child must follow in the prompt.
6. **One change per brief.** Name the file, the edit and the check that proves it. A brief that asks the child to read a subsystem first spends its context before it edits.
7. **No recursion.** Tell the child not to dispatch dsh or any other CLI.
8. **Evidence handback.** Ask for changed files, commands run with their output and exit status, and open questions, not a completion claim.

---

## 5. COMPOSITION CHECK

- [ ] Canonical framework selected and CLEAR check run.
- [ ] Persona block and child preamble are inline at the top.
- [ ] Every file is named by absolute path.
- [ ] The task needs no answer from a human.
- [ ] No key, `.env` content or credential value is in the prompt.
- [ ] The route patch named in the command is one of the two roster routes.
- [ ] The handback format is explicit.

---

## 6. RELATED

- [SKILL.md](../SKILL.md) owns the hard rules, and [ROUTER.md](../ROUTER.md) owns routing.
- [prompt-templates.md](./prompt-templates.md) holds the dispatch shapes.
- [cli-reference.md](../references/cli-reference.md) owns the flags.
