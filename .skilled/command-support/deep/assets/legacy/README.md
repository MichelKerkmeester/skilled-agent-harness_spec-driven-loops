---
title: "Legacy Deep Command Bodies"
description: "Developer reference for fallback deep-command bodies used by command injection and render tooling."
trigger_phrases:
  - "legacy deep command bodies"
  - "deep command fallback"
  - "deep router bodies"
importance_tier: "important"
---

# Legacy Deep Command Bodies

> Documents the fallback bodies in `.skilled/command-support/deep/assets/legacy/` for the command
> family under `.skilled/commands/deep/`. This README was moved out of `.skilled/commands/` so
> OpenCode does not register it as a command.
>
> Router bodies retained as the base payload for the three compiler-managed deep commands.

---

## 1. OVERVIEW

`.skilled/command-support/deep/assets/legacy/` stores three fallback command bodies: `deep/ai-council`, `deep/research` and `deep/review`.

Each body acts as a thin router. It resolves command setup and selects workflow YAML while leaving iteration dispatch, artifact writes and convergence handling to the selected workflow.

Each body has a matching compiled contract in `../compiled/`. There is no fifth body and no unmatched body-to-contract relationship in this directory.

---

## 2. DIRECTORY TREE

```text
legacy/
+-- deep-ai-council.body.md
+-- deep-research.body.md
+-- deep-review.body.md
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `deep-research.body.md` | Fallback router for the deep-research loop. |
| `deep-review.body.md` | Fallback router for the deep-review loop. |
| `deep-ai-council.body.md` | Fallback router for bounded AI Council sessions. |

---

## 4. ROUTER RESPONSIBILITIES

The legacy bodies own:

- Setup input resolution
- Execution-mode selection
- Workflow YAML selection
- Presentation boundary references where applicable

The workflow YAML assets own:

- Iteration or round dispatch
- Artifact writes
- State reduction
- Convergence checks
- Final synthesis
- Continuity updates

Do not move workflow execution into these router bodies.

---

## 5. MODE ROUTING

Each body recognizes attached command modes:

| Suffix | Behavior |
|---|---|
| `:auto` | Resolve supported inputs non-interactively and load the auto workflow. |
| `:confirm` | Ask the consolidated setup question and load the confirm workflow. |
| No suffix | Ask for execution mode through the command's setup flow. |

Inputs such as target paths, iteration limits, convergence settings and executor choices remain workflow inputs rather than execution modes.

---

## 6. INJECTION BOUNDARY

Render tooling's compiler registry contains exactly these three body-to-contract pairings. In `fallback` mode it returns the legacy body directly; in `fix` mode it prepends the matching fresh compiled contract to that body.

Compiled contracts live in the sibling `compiled/` folder. Their maintained sources remain authoritative, and generated contract files must not replace the workflow YAML as the owner of runtime execution. The fallback-only commands remain outside these asset directories because they are not registered with the contract compiler.

---

## 7. VALIDATION

Confirm the expected files exist from the repository root:

```bash
test -f .skilled/command-support/deep/assets/legacy/deep-ai-council.body.md
test -f .skilled/command-support/deep/assets/legacy/deep-research.body.md
test -f .skilled/command-support/deep/assets/legacy/deep-review.body.md
```

Expected result: every command exits with status `0`.

Validate command references with the shared checker:

```bash
node .skilled/commands/scripts/validate-command-references.cjs
```

Expected result: the checker reports the repository-wide resolution state of command-asset references. It scans every command family under `.skilled/commands/`, so an unresolved reference anywhere in that tree — including trees outside these assets, such as `design/` — appears in its output and exit status.

---

## 8. RELATED

- [Compiled deep command contracts](../compiled/)
- [Deep command assets](../../../../commands/deep/assets/)
- [Deep command router files](../../../../commands/deep/)
- [Deep-loop skill](../../../../skills/system-deep-loop/SKILL.md)
