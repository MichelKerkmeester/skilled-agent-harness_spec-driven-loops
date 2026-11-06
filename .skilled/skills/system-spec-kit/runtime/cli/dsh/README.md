---
title: "DSH Scripts: DeepSeek Harness mirror generators"
description: "Generators that keep .dsh/skills, .dsh/prompts and .dsh/agents in sync with their .skilled/ sources."
trigger_phrases:
  - "DeepSeek Harness mirrors"
  - "dsh mirror generators"
version: 1.0.0.0
---

# DSH Mirror Generators

---

## 1. OVERVIEW

The generators in this folder mirror canonical skills, command prompts and agent personas into `.dsh/`. They support write mode and `--check`, which reports drift without changing outputs.


---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `sync-skills-dsh.cjs` | Creates relative links from `.dsh/skills/<name>` to valid `.skilled/skills/**/SKILL.md` parent directories, follows linked skill directories and preserves operator-private `local-*` entries. |
| `sync-prompts-dsh.cjs` | Creates flat `.dsh/prompts/*.md` pointer stubs from `.skilled/commands/**/*.md`, excluding command support folders, README files and contract files. |
| `sync-agents-dsh.cjs` | Writes `.dsh/agents/<name>.patch.yml` with each source agent body in the `system-prompt` row. |


---

## 3. MIRROR SHAPE

The skill mirror links each dsh skill name directly to its canonical skill directory. A skill needs both `name` and `description` frontmatter. Missing metadata skips that skill with a warning. Descriptions longer than 500 characters produce a warning because dsh truncates them in its catalog.

Prompt files name the canonical command path and instruct the dispatcher to follow that file. Each stub ends with `User request:` so the dsh dispatcher can append the request.

Agent patches contain one `system-prompt` row. Its `config.personaPrefix` value is a YAML block scalar containing the source agent body after frontmatter.


---

## 4. CLI AND VALIDATION

Run the generators from the repository root. The default command writes generated outputs. Add `--check` to report `MISSING`, `STALE` and `EXTRA` entries without writing.

```bash
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-skills-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-prompts-dsh.cjs
node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs

node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-*-dsh.test.mjs
```

| Environment variable | Default |
|---|---|
| `DSH_SKILLS_SOURCE_DIR` | `.skilled/skills` |
| `DSH_SKILLS_OUTPUT_DIR` | `.dsh/skills` |
| `DSH_COMMANDS_SOURCE_DIR` | `.skilled/commands` |
| `DSH_PROMPTS_OUTPUT_DIR` | `.dsh/prompts` |
| `DSH_AGENTS_SOURCE_DIR` | `.skilled/agents` |
| `DSH_AGENTS_OUTPUT_DIR` | `.dsh/agents` |


---

## 5. RELATED

- [`Hermes mirror generators`](../hermes/README.md) use the sibling runtime-mirror pattern.
- [`Pi prompt generator`](../pi/sync-prompts-pi.cjs) shares the command walk and flat naming convention.
- [`Parent CLI README`](../README.md) lists the other runtime CLI tools.
