---
title: "Repo Rules: Operating Rules Behind the Router"
description: "The rule files that REPO RULES.md routes an agent to before it acts, how one loads and how to add or change one."
trigger_phrases:
  - "repo rules folder"
  - "repo rule files"
  - "how a repo rule loads"
---

# Repo Rules: Operating Rules Behind the Router

> The operating rules an agent loads before it acts, each one reached through the trigger table in `REPO RULES.md`.

---

## 1. OVERVIEW

This folder holds the repository's operating rules: how to think about scope, proof, risk, diagnosis, honesty and replies. Each file is one rule. None of them loads on its own. The router at the repository root, [`REPO RULES.md`](../../REPO%20RULES.md), decides which rules fire for what an agent does next.

The rules sit below `AGENTS.md`. A rule may tighten what `AGENTS.md` says, but it never relaxes a hard blocker. Where the two disagree, `AGENTS.md` wins and the rule file is wrong.

---

## 2. HOW A RULE LOADS

Gate 5 in `AGENTS.md` fires before the first write of a session. The agent opens `REPO RULES.md` and matches its next action against the trigger table. It loads every rule whose row matches, not just the first. Rules compose, and the more specific one wins on conflict.

Two rules fire on a whole turn instead of one action. Gate 6 loads `communication.md` before every substantive reply, and `communication-handoff.md` before a turn ends. A turn that only reads still loads both.

Every rule file has the same shape:

- **Frontmatter** with a title, a description, trigger phrases, an importance tier, a context type and a version.
- **Fires when**, a list of the actions that load the rule.
- **The rule**, the rule itself in a few lines.
- **Numbered sections** that expand it, closing with a self-check.

---

## 3. FILES

The folder is flat. The router's index gives each rule's summary, and the table below says what each file covers.

| File | Covers |
|---|---|
| [`blast-radius.md`](./blast-radius.md) | Irreversible steps, the rollback sentence and when to stop for a yes |
| [`communication.md`](./communication.md) | How a reply reads, from answer first to plain sentences |
| [`communication-handoff.md`](./communication-handoff.md) | What a turn hands back to the operator when it ends |
| [`delegation-and-orchestration.md`](./delegation-and-orchestration.md) | Briefing another runtime and weighing what comes back |
| [`evidence-and-proof.md`](./evidence-and-proof.md) | What counts as proof before a result is claimed |
| [`prevent-overengineering.md`](./prevent-overengineering.md) | Whether a new file, option or layer should exist at all |
| [`root-cause-and-debugging.md`](./root-cause-and-debugging.md) | Fixing the producer of a failure instead of its symptom |
| [`scope-discipline.md`](./scope-discipline.md) | What is in scope and how to raise what is not |
| [`skill-hub-routing.md`](./skill-hub-routing.md) | What may be claimed about wiring a mode into a parent hub |
| [`uncertainty-and-honesty.md`](./uncertainty-and-honesty.md) | Confidence, unknowns and halting on a contradiction |

---

## 4. ADDING OR CHANGING A RULE

Create, revise or retire a rule with `/create:repo-rule`. It writes the rule file and wires its rows into `REPO RULES.md` in one pass.

> [!WARNING]
> A rule file added by hand never loads until it has a row in the `REPO RULES.md` trigger table. Agents read only the rules the router names, so add the trigger row and the index row with the file.

Run the checker after any change to a rule or to the router:

```bash
node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
```

Expected last line: `[repo-rules-check] RESULT: PASSED (11/11 checks)`. Its checks cover router rows, frontmatter, links and section shape. This README is not a rule, so the checker skips it.

---

## 5. RELATED RESOURCES

| Resource | Purpose |
|---|---|
| [`REPO RULES.md`](../../REPO%20RULES.md) | The router: trigger table, precedence and index |
| [`AGENTS.md`](../../AGENTS.md) | The hard blockers and gates every rule sits below |
| [`sk-create-repo-rule`](../skills/sk-doc/sk-create-repo-rule/SKILL.md) | How a rule is written, wired and checked |
