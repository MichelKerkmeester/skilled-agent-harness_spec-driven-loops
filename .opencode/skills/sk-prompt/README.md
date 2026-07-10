---
title: sk-prompt
description: Prompt engineering parent hub — routes to prompt-improve (7-framework, DEPTH-thinking, CLEAR-scored prompt enhancement) and prompt-models (read-only per-model prompt-craft profiles for small-model dispatch).
trigger_phrases:
  - "improve prompt"
  - "prompt engineering"
  - "small model prompt craft"
  - "clear scoring"
version: 1.0.0.0
---

# sk-prompt

> One advisor identity, two workflow packets: turn a vague ask into a structured, scored prompt, or look up the prompt-craft profile a specific small model wants before you dispatch it.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Prompt engineering (framework selection, DEPTH thinking, CLEAR scoring) and small-model prompt-craft lookup before dispatch |
| **Invoke with** | The `/prompt-improve` command, the `@prompt-improver` agent, or keyword routing through Gate 2 |
| **Routes to** | `prompt-improve/` (mutating, the 7-framework engine) or `prompt-models/` (read-only, per-model profiles) via `mode-registry.json` |
| **Produces** | Either a scored, enhanced prompt, or a model-specific prompt-craft profile (framework, scaffold, gotchas) |

---

## 2. OVERVIEW

`sk-prompt` is a parent hub: it holds no packet-local logic and routes every request to exactly one of two nested workflow packets through `mode-registry.json` and `hub-router.json`.

- **`prompt-improve/`** — the active prompt-engineering engine. Seven frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), a five-phase DEPTH thinking pass, and CLEAR quality scoring. See `prompt-improve/README.md`.
- **`prompt-models/`** — read-only per-model prompt-craft profiles for small-model dispatch (DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro, GLM-5.2 via `cli-opencode`). No slash command — reached via advisor routing or direct cross-skill reference. See `prompt-models/README.md`.

Both packets keep their own `SKILL.md`, `README.md`, and `changelog/`. The hub carries the single `graph-metadata.json` advisor identity for both.

---

## 3. QUICK START

**Prompt engineering:**

```bash
/prompt-improve $text "Write a cold email for a SaaS CRM targeting mid-market sales leaders"
```

**Small-model prompt craft (no command — read the profile directly or let the advisor co-surface it alongside `cli-opencode`):**

```text
Read .opencode/skills/sk-prompt/prompt-models/references/models/deepseek-v4-pro.md
```

---

## 4. RELATED SKILLS

| Skill | Relationship |
|---|---|
| `cli-opencode` | Dispatches the small models `prompt-models` profiles; owns executor MECHANICS (binary flags, invocation wrappers) — `prompt-models` owns the prompt-craft, never the mechanics. |
| `cli-claude-code` | Consumes `prompt-improve`'s framework set for its own prompt-quality card. |
| `sk-doc` | Documentation/component authoring — the sibling parent hub this one's structure mirrors. |
| `sk-code` | Code implementation — not prompt engineering; route there instead for code work. |

---

## 5. VERIFICATION

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt
```

Expected: 0 invariant failures, 0 warnings.
