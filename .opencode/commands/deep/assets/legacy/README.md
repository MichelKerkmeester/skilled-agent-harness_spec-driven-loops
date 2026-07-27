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

> Router bodies retained as the base payload for the four compiler-managed deep commands.

---

## 1. OVERVIEW

`.opencode/commands/deep/assets/legacy/` stores four fallback command bodies: `deep/ai-council`, `deep/alignment`, `deep/research` and `deep/review`.

Each body acts as a thin router. It resolves command setup and selects workflow YAML while leaving iteration dispatch, artifact writes and convergence handling to the selected workflow.

Each body has a matching compiled contract in `../compiled/`. There is no fifth body and no unmatched body-to-contract relationship in this directory. The remaining rollout entries, `deep/agent-improvement`, `deep/model-benchmark` and `deep/skill-benchmark`, are intentionally fallback-only command files outside this asset inventory and have not been compiled.

---

## 2. DIRECTORY TREE

```text
legacy/
+-- deep-ai-council.body.md
+-- deep-alignment.body.md
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
| `deep-alignment.body.md` | Fallback router for structured alignment audits. |

---

## 4. ROUTER RESPONSIBILITIES

The legacy bodies own:

- Dispatch-context checks
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

Render tooling's compiler registry contains exactly these four body-to-contract pairings. In `fallback` mode it returns the legacy body directly; in `fix` mode it prepends the matching fresh compiled contract to that body.

Compiled contracts live in the sibling `compiled/` folder. Their maintained sources remain authoritative, and generated contract files must not replace the workflow YAML as the owner of runtime execution. The fallback-only commands remain outside these asset directories because they are not registered with the contract compiler.

---

## 7. VALIDATION

Confirm the expected files exist from the repository root:

```bash
test -f .opencode/commands/deep/assets/legacy/deep-ai-council.body.md
test -f .opencode/commands/deep/assets/legacy/deep-alignment.body.md
test -f .opencode/commands/deep/assets/legacy/deep-research.body.md
test -f .opencode/commands/deep/assets/legacy/deep-review.body.md
```

Expected result: every command exits with status `0`.

Validate command references with the shared checker:

```bash
node .opencode/commands/scripts/validate-command-references.cjs
```

Expected result: the checker reports that command references resolve cleanly.

---

## 8. RELATED

- [Compiled deep command contracts](../compiled/)
- [Deep command assets](../)
- [Deep command router files](../../)
- [Deep-loop skill](../../../../skills/system-deep-loop/SKILL.md)
