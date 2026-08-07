---
title: sk-prompt
description: Turns a vague request into a structured, scored prompt or hands you the prompt-craft profile a small model wants before dispatch. One hub with two workflow packets.
trigger_phrases:
  - "improve prompt"
  - "prompt engineering"
  - "small model prompt craft"
  - "clear scoring"
version: 1.1.0.0
---

# sk-prompt

> Prompts drive every model. This skill makes yours clear: a vague ask becomes a structured, scored prompt. A small-model dispatch starts from the profile that model actually wants.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Prompt engineering and small-model prompt-craft lookup before dispatch |
| **Invoke with** | The `/prompt:improve` command, the `@prompt-improver` agent or keyword routing through Gate 2 |
| **Works on** | Any text request that needs structure, plus the prompt-craft needs of six maintained small-model profiles |
| **Produces** | A scored, enhanced prompt with a transparency report or a per-model prompt-craft profile |

---

## 2. OVERVIEW

### Why This Skill Exists

A vague prompt gets a vague result. You write "make this better" and the model guesses what better means. The fix is structure: a framework that fits the task and a thinking pass that forces depth, with a score that says when the prompt is good enough. The same problem repeats on the dispatch side. Small models each want different things. A prompt tuned for one model wastes the others.

This skill exists to close both gaps. It turns a rough request into a prompt that clears a fixed quality bar. It also keeps the per-model profiles that tell you how to phrase a prompt for a specific small model before you send it.

### What It Does

`sk-prompt` is a parent hub. It holds no packet-local logic. Every request routes to exactly one of two nested workflow packets through `mode-registry.json` and `hub-router.json`.

- `prompt-improve` is the mutating engine. It picks a framework from seven (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), runs a five-phase DEPTH thinking pass and scores the result with CLEAR. Invoke it with `/prompt:improve` or the `@prompt-improver` agent.
- `prompt-models` is the read-only lookup. It holds per-model prompt-craft profiles for small-model dispatch. It has no slash command. The advisor co-surfaces it alongside `cli-opencode` or you read the profile directly.

The hub carries a single `graph-metadata.json` advisor identity for both packets, so the advisor sees one skill, not two.

### The Model Profile Layer

Each profile is the single source of truth for how to prompt one model in the small-model rotation. Executor mechanics stay with the CLI skills. The profile owns the prompt-craft contract only.

| Model | What the profile covers |
|---|---|
| **DeepSeek-v4-pro** | RCAF prompt-craft with medium pre-planning, dispatched through `cli-opencode` |
| **Kimi-k2.7-code** | COSTAR prompt-craft (TIDD-EC fallback, no RCAF) with lean pre-planning over the 256k window |
| **MiniMax-M3** | TIDD-EC prompt-craft with dense pre-planning carried from benchmark 003 |
| **MiMo-V2.5-Pro** | benchmark-backed COSTAR prompt-craft with lean pre-planning |
| **GLM-5.2** | COSTAR prompt-craft (TIDD-EC fallback) with lean pre-planning over the 1M window and vision-to-code input |
| **Composer-2.5** | RCAF prompt-craft with medium pre-planning, dispatched through `cli-cursor` |

`mimo-v2.5-pro-ultraspeed` stays optional-unverified. It has no prompt profile yet.

---

## 3. QUICK START

**Step 1: Improve a prompt.**

```bash
/prompt:improve "Write a cold email for a SaaS CRM targeting mid-market sales leaders"
```

The command returns an enhanced prompt and a transparency report naming the chosen framework and the CLEAR breakdown.

**Step 2: Look up a model profile before dispatch.**

```text
Read .opencode/skills/sk-prompt/sk-prompt-models/references/models/deepseek-v4-pro.md
```

The profile states the framework the model expects and the gotchas that trip up real dispatches. There is no command for this path.

**Step 3: Verify the hub before you rely on it.**

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt
```

Expected: 0 invariant failures and 0 warnings.

---

## 4. RELATED SKILLS

| Skill | Relationship |
|---|---|
| `cli-opencode` | Dispatches the small models the `prompt-models` profiles cover. It owns executor mechanics (binary flags, invocation wrappers). `prompt-models` owns the prompt-craft, never the mechanics |
| `cli-claude-code` | Consumes `prompt-improve`'s framework set for its own prompt-quality card |
| `sk-doc` | Documentation and component authoring. The sibling parent hub this one's structure mirrors |
| `sk-code` | Code implementation. Not prompt engineering. Route code work there instead |

---

## 5. VERIFICATION

| Check | How to run it |
|---|---|
| Hub invariants | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-prompt` reports 0 invariant failures and 0 warnings |
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-prompt/README.md --type readme` reports zero issues |

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic for the hub |
| [`sk-prompt-improve/README.md`](./sk-prompt-improve/README.md) | The mutating engine with DEPTH thinking and CLEAR scoring across seven frameworks |
| [`sk-prompt-models/README.md`](./sk-prompt-models/README.md) | The read-only per-model prompt-craft profiles |
| [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) | Release notes for this README rewrite |
| [`sk-prompt-models/references/models/_index.md`](./sk-prompt-models/references/models/_index.md) | The model inventory and adoption status |
