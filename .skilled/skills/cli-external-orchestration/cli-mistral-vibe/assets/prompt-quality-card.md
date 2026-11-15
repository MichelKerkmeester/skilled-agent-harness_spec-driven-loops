---
title: Mistral Vibe CLI - Prompt Quality Card
description: Thin vibe dispatch delegator. The canonical prompt-quality card owns framework selection and quality checks, and this card adds the Vibe print-mode mechanics.
trigger_phrases:
  - "vibe prompt quality card"
  - "vibe dispatch prompt discipline"
  - "vibe prompt framework selection"
  - "vibe print mode prompt"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Mistral Vibe CLI - Prompt Quality Card

**Two-tier precedence rule: sk-prompt framework first, this card's Vibe dispatch addenda second.**

Load this card on every Vibe route, after the canonical card, and before composing the prompt that goes to `-p` or `--prompt-file`.

---

## 1. OVERVIEW

### Purpose

This card is the Vibe fast-path prompt-quality reference. It delegates the framework table and the CLEAR check to the canonical card and records only what a Vibe prompt must carry because of how print mode runs.

### Usage

Start from the canonical card, apply its Pre-Dispatch Checklist, then add the Vibe addenda in section 4 and run the composition check in section 5.

---

## 2. CANONICAL SOURCE

Load:

- [Canonical CLI prompt-quality card](../../../sk-prompt/assets/cli-prompt-quality-card.md)

Do not copy the canonical taxonomy into this card. Do not create a second framework table here.

---

## 3. TWO TIERS

### Tier 1 - Fast Path

Use the canonical card for ordinary Vibe dispatches. Select the framework there, apply its task mapping, run its CLEAR check, then add the Vibe addenda below.

### Tier 2 - Deep Path

Use the canonical card's deep-path trigger list. When it calls for prompt improvement, dispatch the approved prompt-improver workflow rather than loading the full prompt system inline.

---

## 4. VIBE DISPATCH ADDENDA

A Vibe print-mode child cannot ask a question, does not start in the repository root and reports its verdict in `export.json`. The prompt has to make up for all three.

1. **Child preamble first.** Copy the preamble from [`../../shared/references/child-dispatch-preamble.md`](../../shared/references/child-dispatch-preamble.md) to the very top of the prompt, above the persona and the task, and set `AI_SESSION_CHILD=1` in the dispatch environment. The variable makes the exemption true; the preamble makes it observable to the model.
2. **Persona inline until the folder exists.** Vibe resolves an agent profile from `.vibe/agents/<name>.toml` when the command passes `--agent <name>`, and that folder is not in place yet. Until it is, inline the resolved persona block at the top of the prompt, directly below the child preamble, in the format the canonical card's Persona Injection section defines. A dispatch that names `--agent` and also inlines the persona is not wrong; a dispatch that does neither runs a generic assistant.
3. **Prompt delivery.** Pass the prompt as `vibe -p TEXT ... </dev/null`, or write it to a file and pass `vibe --prompt-file PATH ... </dev/null`. The file form keeps a long prompt out of the process list, where any local process can read a `-p` argument. Either form ends with `</dev/null`, so an inherited stdin cannot hang the run.
4. **No questions.** Print mode has no answer channel, and the captured config disables `ask_user_question`. Give every decision the child would ask about, or tell it to stop and report the blocker.
5. **Absolute paths.** The run starts in a temp directory, never the repository root, so a relative path resolves against the wrong tree. Name every file by absolute path, and name any directory outside the run directory so the caller can pass it with `--add-dir`.
6. **Rules stated, not assumed.** The run starts outside the checkout, so the repository `AGENTS.md` is not in the project discovery path. State in the prompt every rule the child must follow.
7. **One change per build brief.** Name the file, the edit and the check that proves it. Short, literal briefs. A brief that asks the child to read a subsystem first spends its context before it edits.
8. **No secrets.** Never put an API key, a dotenv value or any dotenv file content in a prompt. The `mistral` provider reads `MISTRAL_API_KEY` from the child's environment, so the prompt names the variable and never its value.
9. **No recursion.** Tell the child not to dispatch `vibe` or any other CLI. The typed command `vibe` is gone from the process table once the launcher execs into `vibe-rs`, so a guard cannot rely on that name alone.
10. **Evidence handback.** Ask for changed files, commands run with their output and exit status, and open questions, not a completion claim. The caller reads the outcome from `export.json` (`exit_code` plus `outcome`), never from stdout, because a run whose tool calls were denied can still exit 0.

---

## 5. COMPOSITION CHECK

- [ ] Canonical framework selected and CLEAR check run.
- [ ] Child preamble is the first block, with the spec folder path filled in.
- [ ] Persona block is inline, or `--agent` names a profile from `.vibe/agents/`.
- [ ] The prompt reaches the process as `-p TEXT` or `--prompt-file PATH`, with `</dev/null`.
- [ ] Every file is named by absolute path, and every outside directory is passed with `--add-dir`.
- [ ] The task needs no answer from a human.
- [ ] No key, dotenv content or credential value is in the prompt.
- [ ] The brief names one file, one edit and the check that proves it.
- [ ] The child is told not to dispatch another CLI.
- [ ] The handback format is explicit, and the outcome is read from `export.json`.

---

## 6. RELATED

- [SKILL.md](../SKILL.md) owns the hard rules, and [ROUTER.md](../ROUTER.md) owns routing.
- [hard-rules.json](../hard-rules.json) lists the six rules a dispatch must satisfy.
- [cli-reference.md](../references/cli-reference.md) owns the flags, the prompt sources and the outcome record.
- [child-dispatch-preamble.md](../../shared/references/child-dispatch-preamble.md) holds the preamble block.
