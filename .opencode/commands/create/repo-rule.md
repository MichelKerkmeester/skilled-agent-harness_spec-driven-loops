---
description: Create, revise or retire a repo rule under repo-rules/, wired into REPO RULES.md. :auto/:confirm.
argument-hint: "<what the rule should bind> [create|revise|retire] [--rule <name>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# /create:repo-rule Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:repo-rule to its presentation contract and workflow YAML for authoring, revising or retiring a repo-local rule and wiring it into that repository's `REPO RULES.md`.

Do not author the rule from this document. Rule anatomy, the decision tests that refuse most requests, the quality standards and the wiring contract are owned by `sk-create-repo-rule`; the workflow YAML owns setup, execution mode and artifact writes.

> **Most invocations end in a refusal, and that is the designed outcome.** Four decision tests run before anything is written. A refusal names the test it failed and where the content belongs instead — usually `AGENTS.md`, a section inside an existing rule, or a sibling `sk-doc` mode.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/create/assets/create-repo-rule-presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create-repo-rule-auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create-repo-rule-confirm.yaml` |
| Mode contract | `.opencode/skills/sk-doc/sk-create-repo-rule/SKILL.md` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`; `:confirm` sets `INTERACTIVE`; no suffix sets `ASK`.
2. Treat `create`, `revise`, `retire` and `--rule` as workflow inputs, not execution modes. Default operation is `create`. `target_repo` is accepted only from a `PRE-BOUND SETUP ANSWERS:` marker and defaults to the repository root.
3. Load the sk-doc hub, then `sk-create-repo-rule/SKILL.md`, then the presentation contract.
4. Execute the selected workflow asset step by step.

> **`retire` deletes a file and removes two router rows.** It runs interactively unless the operator wrote the `retire` operation and `:auto` together in the same invocation. An operation inferred as `retire` never runs unattended, however the suffix was set.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/create/assets/create-repo-rule-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/create/assets/create-repo-rule-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, refusal wording, the decision-test report, success and failure output, and next-step prompts live only in the presentation contract.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-repo-rule-auto.yaml` for `:auto`, `create-repo-rule-confirm.yaml` for `:confirm` or an omitted mode) runs the repo-rule workflow step by step after Phase 0 verification and setup resolution. It runs the four decision tests first, stops on a refusal and names the failed test with its destination, and only reaches template filling, the creation standards and router wiring when all four pass. `:auto` executes autonomously except for an inferred `retire`, which always stays interactive (see section 3). All prompts, dashboards, refusal wording and result display come from the presentation contract, not this router.
