---
title: "Implementation Plan: Phase 3: agent-disclosure"
description: "Adds a reach checklist item, a not-checked disclosure, a harness read, a hypothesis count and a Reach field to the code, debug and orchestrate agents, copies the same text into their Claude forks by hand, then regenerates the Codex, Pi and Hermes copies with their sync scripts and confirms every mirror check still passes."
trigger_phrases:
  - "agent disclosure plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: agent-disclosure

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent definitions in `.skilled/agents` and `.claude/agents`, generated TOML and Markdown mirrors, Node.js `.cjs` sync and check scripts, Python 3 validator, bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The mirror sync check, the runtime mirror and roster checks, `check-rule-copies.js`, `validate_document.py --type agent`, `check_authored_name_kebab.py`, `check-goal.cjs`, `validate.sh --strict`, and one `rg` per new line in each copy |

### Overview
The change adds five short lines to three agent definitions. The Claude forks are the authored Claude copies, and no generator writes them, so the same lines go in by hand (`.skilled/skills/system-deep-loop/deep-improvement/references/shared/agent-mirror-crosswalk.md` section 5). The Codex, Pi and Hermes copies come from their sync scripts and are never edited. The Cursor and Devin copies are symlinks to the Claude forks, so they follow with no edit. No code, contract, rule or review file changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Phases 001 and 002 share the mirror trees)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Authoring contracts

- Agent definitions follow `.skilled/skills/sk-doc/sk-create-agent/SKILL.md`. Its frontmatter rule keeps the `permission:` object in `.skilled/agents` and the `tools:` line in `.claude/agents`, and this change touches neither. Its validation gate runs before and after the edit.
- No code file is edited, so `.skilled/skills/sk-code/SKILL.md` does not apply to this phase.
- Agent files carry no version field and no per-agent changelog, so the version and changelog steps of the skill do not apply. The skill's own changelog is not touched.
- The mirror procedure is `agent-mirror-crosswalk.md` section 5: edit the canonical file, mirror the body change into `.claude/agents`, then regenerate the two generated trees.

### Pattern
In-place text additions to three agent definitions, copied into their authored forks, followed by regeneration of the generated trees.

### Key Components
- **Canonical files**: `.skilled/agents/code.md`, `debug.md` and `orchestrate.md`. The edits start here.
- **Claude forks**: `.claude/agents/code.md`, `debug.md` and `orchestrate.md`. They receive the same lines by hand. Cursor and Devin follow by symlink.
- **Codex copies**: `.codex/agents/*.toml`, written by `codex/sync-agents.cjs`. The body sits in a `'''` literal string.
- **Pi copies**: `.pi/agents/*.md`, written by `pi/sync-agents-pi.cjs`.
- **Hermes copies**: `.hermes/skills/agent-*/SKILL.md`, written by `hermes/sync-skills-hermes.cjs`. It rewrites every drifted copy and prunes stale ones, so its `--check` runs first.
- **Gates**: `check-agent-mirror-sync.cjs` compares each body token by token across the canonical, Claude and Codex copies. `sync-runtime-mirrors.cjs`, `agent-roster-mirror-check.cjs` and `check-rule-copies.js` run after the edit as well.

### Decisions made in planning

1. **The not-checked disclosure is a native field of the code RETURN.** `agent-io-contract.md` fixes only the optional `AGENT_IO_RESULT` envelope, and its section 1 says existing agent-specific output formats remain authoritative. No script reads the code RETURN fields: a search for `Required fields`, `Code Implementation Result` and `rubric_score` finds only the code agent and its copies. The contract file therefore stays unchanged, as the parent requires.
2. **The line is required, not conditional.** The review mode states its `Not checked:` line as required, and the code RETURN follows the same rule.
3. **The debug harness read sits in Phase 2.** Phase 1 uses only `Read`, `Glob` and `Grep`, and reproduction first appears in Phase 3 (validation plans) and Phase 4 ("run reproductions"). A Phase 2 read therefore comes before reproduction.
4. **The new text names no path.** The Claude fork says `.claude/agents` where the canonical file says `.skilled/agents`, so a path would make the two copies differ. A path-free line reads identically in both.

### Exact added text

Each line is identical in the canonical file and the fork. None contains a path, a semicolon, an em dash or a triple single quote.

| Edit | Where | Text |
|------|-------|------|
| A | `code.md` Pre-Implementation block, after `File allowlist understood` | `[ ] Every place the change must reach is listed (callers, tests, fixtures, config and exports). Each place the change will not touch is named with the reason.` |
| B | `code.md` RETURN block, after the `**Confidence:**` line above `### Summary` | `**Not checked:** <one line naming what mattered but was not checked or could not run, and why, or "nothing material">` |
| C | `code.md` Required fields | Append `not_checked` before the final period |
| D | `debug.md` Phase 2 actions, as new item 1 | `1. Read the test harness and build config that cover the failing path (the test runner config, the test files that exercise it and the build config) before any reproduction.` The five existing items renumber to 2 to 6. |
| E | `debug.md` Phase 3, after the ranking criteria list | `If more candidate hypotheses existed than the ones kept, the response states how many were left out.` |
| F | `debug.md`, end of each of the three response shapes, after the last body line and before the closing fence | `**Not checked:** [one line naming what mattered but was not checked or could not run, and why, or "nothing material"]` |
| G | `orchestrate.md` Task Format, after `├─ Scope:` | `├─ Reach: [The callers, tests, fixtures, config and exports the task must reach, or "none" when nothing outside Scope is reached]` |

### Expected line counts after the edit

`rg -c` over the six files with the pattern set `Every place the change must reach is listed|Not checked:|not_checked|test harness and build config|how many were left out|Reach: \[` gives:

- `code.md`: 3 (edit A, edit B, the `not_checked` field)
- `debug.md`: 5 (edit D, edit E, and edit F three times)
- `orchestrate.md`: 1 (edit G)

The same counts hold in each generated copy (`.codex/agents/*.toml`, `.pi/agents/*.md`, `.hermes/skills/agent-*/SKILL.md`), because the sync scripts copy the body.

### Data Flow
The canonical file is the source. The Claude fork is a hand-kept copy that the mirror check compares token by token. The Codex, Pi and Hermes sync scripts read the canonical file and write their copies, and each script's `--check` mode reports the drift it would write. The build runs `--check` first so that a regenerate writes only this phase's three agents.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Presence**: one `rg -c` over the six files with the pattern set above, expecting the counts in the table above (T040).
- **Placement**: `rg -n` with the surrounding headings, showing each line between the headings it belongs to (T033 to T038).
- **Generated copies**: each sync script's `--check` passes, and the same `rg -c` runs over the generated copies (T041).
- **Mirror and rule gates**: the seven checks named in the spec exit 0 (T003 and T043 run the same commands).
- **Validators**: `validate_document.py --type agent` and `check_authored_name_kebab.py` on the six agent files, with the Phase 1 result (T004 and T044).
- **Scope**: a diff of `git status --porcelain` for the 15 touched paths and for the protected paths against the Phase 1 copies (T042).
- **Packet**: `check-goal.cjs` and `validate.sh --strict` on this folder (T051 and T052).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The parent packet 008 requires the orchestrator to commit each child as one commit. The builder never commits, pushes, stashes or resets.
- Phases 001 and 002 build in parallel and may write the same mirror trees. The drift check in Phase 2 of `tasks.md` covers that case.
- `repair-derived.cjs --apply` regenerates `description.json` and `graph-metadata.json` in this folder. No other derived file is written.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The builder may not run `git checkout`, `git reset` or `rm`, so rollback uses the Phase 1 copies in `scratch/before/`:

1. Copy each of the 15 files back from `scratch/before/` to its original path with `cp`.
2. Rerun the three sync scripts without `--check`. They regenerate the Codex, Pi and Hermes copies from the restored canonical files.
3. Run `git status --porcelain -- <the 15 paths>`. It must print nothing.
<!-- /ANCHOR:rollback -->

---
