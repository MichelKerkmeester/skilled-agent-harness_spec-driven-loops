---
title: sk-prompt-small-model
description: Per-model prompt-craft hub for small-model dispatch: look up the right framework, scaffold and gotchas for any active small model before you send it work.
trigger_phrases:
  - "small model prompt"
  - "model profile"
  - "cli-devin"
  - "cli-opencode"
  - "prompt framework"
---

# sk-prompt-small-model

> Before you dispatch a small model, read its prompt-craft profile here: the right framework, scaffold and known traps, then apply the executor mechanics from the cli-X.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Looking up the prompt framework, scaffold and gotchas for any active small model before dispatch |
| **Invoke with** | "small model prompt", "model profile", a model name (e.g. `minimax-m3`, `mimo-v2.5-pro`), or auto-routing with `cli-devin`/`cli-opencode` |
| **Works on** | Per-model prompt-craft profiles in `references/models/`, backed by the registry at `assets/model-profiles.json` |
| **Produces** | A loaded prompt-craft profile (framework, scaffold, gotchas) that combines with executor mechanics from `cli-devin` or `cli-opencode` |

---

## 2. OVERVIEW

### Why This Skill Exists

Different small models want different prompt shapes. MiMo does best with COSTAR and a lean plan. MiniMax wants TIDD-EC and a dense plan. The rest default to RCAF. Guess wrong and the model underperforms or ignores half the instructions. Mixing prompt-craft with executor mechanics (binary flags, budgets, permissions) makes both drift, so this hub holds the craft and points at the executor for the mechanics, keeping each clean.

### What It Does

`sk-prompt-small-model` is the per-model prompt-craft hub for small-model dispatch. Before you send work to a small model through `cli-devin` or `cli-opencode`, you read that model's profile here for the right prompt framework, scaffold and gotchas, then apply the executor mechanics from the cli-X skill. The hub carries no tools and no runtime code. It is a set of on-demand profiles plus an index, reached when the advisor co-surfaces it alongside whichever executor is in use.

### Ownership

Four owners, no overlap:

- **`sk-prompt-small-model`** (this skill): per-model prompt-craft profiles and the model registry (`assets/model-profiles.json`).
- **`cli-devin`**: executor mechanics for SWE-1.6, DeepSeek, Kimi and GLM through its provider (budget, verification, fallback engines).
- **`cli-opencode`**: executor mechanics for MiniMax and MiMo (flags, permissions schema, budget propagation).
- **`sk-prompt`**: the generic framework definitions (the closed seven-framework set and CLEAR scoring) that the profiles choose from but never restate.
- **`system-spec-kit`**: runtime helpers in TypeScript.

---

## 3. QUICK START

**Step 1: Resolve the target model id.** Use the alias map in `SKILL.md` to normalize a slug, alias or provider phrase to a canonical profile id (e.g. `minimax` becomes `minimax-m3`, `mimo pro` becomes `mimo-v2.5-pro`).

**Step 2: Read the model profile.**

```bash
# Open the model index to find the profile
Read(".opencode/skills/sk-prompt-small-model/references/models/_index.md")

# Then read the specific profile
Read(".opencode/skills/sk-prompt-small-model/references/models/<id>.md")
```

Each profile gives you: the primary and fallback framework, pre-planning density, a tuned scaffold template and dispatch gotchas.

**Step 3: Follow the pattern index to executor mechanics.**

```bash
Read(".opencode/skills/sk-prompt-small-model/references/pattern-index.md")
```

The pattern index points at the owning `cli-X` file for flags, wrappers, budgets and permissions. Your prompt-craft (from the profile) and the mechanics (from the executor) combine in the executor's prompt-pack.

**Step 4: Apply and dispatch.** Fill the scaffold from the profile, add the executor's invocation wrapper and send the task.

---

## 4. HOW IT WORKS

### The Navigation Chain

The skill routes by model. The chain has four steps:

1. **Resolve** the target model id from the task (alias map in `SKILL.md`).
2. **Read** `references/models/_index.md` to pick the model row.
3. **Load** `references/models/<id>.md` for that model's framework, scaffold and gotchas.
4. **Follow** `references/pattern-index.md` to the executor-owned mechanics in `cli-devin` or `cli-opencode`.

The hub carries no tools and no runtime code. The advisor co-surfaces it via `enhances` edges from both CLI skills, so it appears next to whichever executor is in use.

### The Framework Map

Most models default to RCAF with medium pre-planning density. Two models break from that default based on benchmark evidence:

| Pattern | Models | Framework | Density | Evidence |
|---|---|---|---|---|
| Default | SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, Qwen3.6, GLM-5.1 | RCAF (no fallback) | medium | convention default |
| Dense | MiniMax-M3 | TIDD-EC (RCAF fallback) | dense | empirical (benchmark 003) |
| Lean | MiMo-V2.5-Pro | COSTAR (RACE fallback; avoid TIDD-EC, CIDI) | lean | empirical (benchmark 004) |

The model set drifts as models are added or retired. The pattern holds: RCAF is the default, TIDD-EC fits MiniMax, COSTAR fits MiMo.

### The Registry

`assets/model-profiles.json` is the source of truth each profile mirrors. It holds context length, executors, quota pools, strengths, weaknesses and the recommended frameworks for every model. Each profile cites its registry row and must stay in sync with it.

### Craft Versus Mechanics

This hub owns prompt-craft: which framework to use, how to shape the scaffold, what gotchas to avoid. The cli-X executors own mechanics: binary flags, invocation wrappers, budgets and permissions. A profile points at the mechanics through `pattern-index.md` rather than restating them. This split keeps each concern clean and avoids drift.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `sk-prompt-small-model` before dispatching any active small model to look up its prompt-craft profile. Skip it for frontier models (Opus, Sonnet, gpt-5.5), which are out of scope. Skip it for bare executor questions about flags and wrappers, which live in the cli-X skills.

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-devin` | Owns executor mechanics for SWE-1.6, DeepSeek, Kimi and GLM. This hub's profiles point at `cli-devin` references for budget, verification and fallback. |
| `cli-opencode` | Owns executor mechanics for MiniMax and MiMo. This hub's profiles point at `cli-opencode` references for flags, permissions and budget propagation. |
| `sk-prompt` | Owns the generic framework definitions (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT). This hub chooses which framework each model uses; it never redefines them. |
| `system-spec-kit` | Owns the runtime helpers (bayesian-scorer, fallback-router, permissions-gate). |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| No profile for a model | The id resolves but no `<id>.md` exists on disk | Check `references/models/_index.md` for the model's status. Author the profile following the checklist in `references/pattern-index.md` section 4. |
| Looking for flags or wrappers here | Mechanics live in the cli-X by design | Follow `references/pattern-index.md` to the owning executor skill. |
| Profile drifted from the registry | A `model-profiles.json` row changed without a profile update | Re-mirror the profile from its registry row and cite the source. |
| Hub not surfacing with a model name | The model name is missing from the executor's trigger phrases, or the advisor needs a re-index | Add the model name to the relevant `graph-metadata.json` trigger phrases and run `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-refresh`. |
| MiMo output wrapped in prose | Using RCAF or TIDD-EC instead of COSTAR | Switch to COSTAR with `Style: "precise, no preamble"` and `Audience: "automated pipeline"`. TIDD-EC ranked last for MiMo. |

---

## 7. FAQ

**Q: What does this hub own versus the executors?**

A: This hub owns prompt-craft: the per-model framework choice, scaffold template and gotchas. The executors (`cli-devin`, `cli-opencode`) own mechanics: binary flags, invocation wrappers, budgets and permissions. A profile points at the mechanics through `pattern-index.md` rather than restating them.

**Q: How is this different from `sk-prompt`?**

A: `sk-prompt` defines the generic frameworks (RCAF, COSTAR, RACE and the rest of the closed seven-framework set). This hub chooses which framework each small model should use and records why. One defines the tools, the other picks the right one per model.

**Q: How do I add a new small model?**

A: Follow the canonical adoption checklist in `references/pattern-index.md` section 4. It covers: registry entry, author the profile, add an index row, add a dispatch matrix row, register triggers, re-index the advisor and verify routing.

**Q: Why are there no scripts or shell commands here?**

A: The hub carries prompt-craft prose and indexes. Runtime logic (invocation wrappers, budget engines, verification pipelines) lives in the executors and in `system-spec-kit`. This keeps the skill thin and the ownership boundaries clean.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the dispatch matrix and the full rule set |
| [`references/models/_index.md`](./references/models/_index.md) | Thin per-model index: id to framework, fallback, density and status |
| [`references/models/<id>.md`](./references/models/) | One prompt-craft profile per active model (the hub's weight) |
| [`references/pattern-index.md`](./references/pattern-index.md) | Index locating executor-owned mechanics and ship status |
| [`assets/model-profiles.json`](./assets/model-profiles.json) | The model registry data each profile mirrors |
| [`assets/cli_prompt_quality_card.md`](./assets/cli_prompt_quality_card.md) | Canonical cross-CLI prompt quality card |
