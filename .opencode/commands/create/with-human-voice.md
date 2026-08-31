---
description: Apply or score prose against the Human Voice Rules with a scope gate and a re-scan. :auto/:confirm.
argument-hint: "<file or passage> [apply|score] [--include-code] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# /create:with-human-voice Router

This command is a thin router. It separates execution routing from user-facing presentation.

## 1. ROUTER CONTRACT

Route /create:with-human-voice to its presentation contract and workflow YAML for applying the Human Voice Rules to a target, or for scoring the target against them without editing.

Do not apply the standard from this document. The scope gate, the pass order, the precedence arithmetic and the report shape are owned by `sk-create-with-human-voice`. The workflow YAML owns setup, execution mode and artifact writes. The standard itself is owned by neither and lives at `.opencode/skills/sk-doc/shared/references/hvr-rules.md`.

> **`score` never edits, `apply` always re-scans.** The default operation is `score`, because reporting is safe and rewriting is not. An `apply` run that reports only its final number has not proved anything and is treated as incomplete.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.opencode/commands/create/assets/create-with-human-voice-presentation.txt` |
| Auto workflow | `.opencode/commands/create/assets/create-with-human-voice-auto.yaml` |
| Confirm workflow | `.opencode/commands/create/assets/create-with-human-voice-confirm.yaml` |
| Mode contract | `.opencode/skills/sk-doc/sk-create-with-human-voice/SKILL.md` |
| Standard | `.opencode/skills/sk-doc/shared/references/hvr-rules.md` |

---

## 3. MODE ROUTING

1. Parse `$ARGUMENTS` for attached suffixes: `:auto` sets `execution_mode = AUTONOMOUS`, `:confirm` sets `INTERACTIVE`, no suffix sets `ASK`.
2. Treat `apply`, `score` and `--include-code` as workflow inputs, not execution modes. Default operation is `score`. `target` is required and accepts a path or a quoted passage.
3. Load the sk-doc hub, then `sk-create-with-human-voice/SKILL.md`, then the presentation contract.
4. Execute the selected workflow asset step by step.

> **`apply` rewrites a file in place.** It runs interactively unless the operator wrote the `apply` operation and `:auto` together in the same invocation. An operation inferred as `apply` never runs unattended, however the suffix was set.

---

## 4. EXECUTION TARGETS

| Mode | Target |
|------|----------|
| `:auto` | `.opencode/commands/create/assets/create-with-human-voice-auto.yaml` |
| `:confirm` or interactive choice | `.opencode/commands/create/assets/create-with-human-voice-confirm.yaml` |

---

## 5. PRESENTATION BOUNDARY

Startup questions, the scope-gate report, the scan tables, exemption wording, success and failure output, and next-step prompts live only in the presentation contract.

---

## 6. WORKFLOW SUMMARY

The bound workflow YAML (`create-with-human-voice-auto.yaml` for `:auto`, `create-with-human-voice-confirm.yaml` for `:confirm` or an omitted mode) runs the voice workflow step by step after Phase 0 verification and setup resolution. It gates the scope first and names every exempt span, runs the mechanical scanner, reads the findings as candidates rather than verdicts, runs the judgment pass the scanner cannot perform, and computes the score under the standard's precedence rule. `score` stops there. `apply` edits only in-scope spans, re-runs the scanner and reports both numbers. All prompts, tables, exemption wording and result display come from the presentation contract, not this router.
