---
title: "System Spec Kit"
description: "Makes AI development continuity durable: every file change gets a templated spec folder that records the reasoning. Every new session resumes that reasoning from the packet's own committed documents."
trigger_phrases:
  - "spec kit"
  - "spec folder"
  - "continuity system"
  - "context preservation"
  - "documentation levels"
  - "memory save"
  - "spec folder workflow"
version: 2.7.49.0
---

# System Spec Kit

> A session that changes files leaves a written record of why. The next session reads that record and continues.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it delivers |
|---|---|
| **Use it for** | Keeping the reasoning behind a file change after the session ends |
| **Invoke with** | "spec folder", "spec kit" or the Gate 3 question |
| **Works on** | File-modifying conversations and the Markdown docs under `specs/` |
| **Produces** | A templated spec folder at Level 1, 2, 3 or 3+, with continuity state a later session can read |

### What It Does

A file-modifying session leaves a spec folder: a numbered folder under `specs/` holding the specification, the implementation plan, the task list and the decisions behind them. Gate 3 in `AGENTS.md` asks which folder the work belongs to before the first write. `create.sh` then fills that folder from contract-backed templates. A later session reads the same folder back through `/speckit:resume`, so the reasoning outlives the context window that produced it.

### The Spec Folder System

Each capability has one job. Together they cover what a packet holds and how a later session finds it again.

| Capability | What the skill operates |
|---|---|
| **Documentation levels** | Four levels, from the Level 1 baseline to the Level 3+ governance set, each with its own template contract |
| **Phase parents** | A lean parent folder holding `spec.md`, `description.json`, `graph-metadata.json` and an optional `decision-record.md`, with numbered child folders that carry the working docs |
| **Validation** | The 42-rule registry in `runtime/cli/lib/validator-registry.json`, run over a packet by `validate.sh` |
| **Continuity** | The packet's own `handover.md` and `_memory.continuity` state, maintained through `/speckit:save` and read back by `/speckit:resume` |
| **Retrieval** | A committed trigger index over declared `trigger_phrases`, plus literal ripgrep recipes over the working tree |

### Why This Skill Exists

A context window fills. When it does, the session restarts and the reasons behind the last change go with it. A spec folder keeps those reasons as files the next session opens, so work continues from evidence rather than a summary typed from memory.

---

## 2. QUICK START

**Step 1: Create the folder.**

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh \
  --level 2 --path specs/<NNN-name> "Add login form validation"
```

The run prints `SpecKit: Spec Folder Created Successfully` and a `DOC_LEVEL:` line reading `Level 2`. It also prints `SPEC_FOLDER:` with the absolute path of the new folder, followed by a `Created Structure:` list. The new folder holds `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and `acceptance-criteria.md`, plus `description.json` and a `scratch/` workspace.

**Step 2: Validate the packet.**

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh \
  specs/<NNN-name>/ --quiet
```

The run prints `RESULT: PASSED` and exits 0. A fresh packet still holds template placeholders, which add a warning until you fill them. Exit 1 is a usage error. Exit 2 is a validation error. Exit 3 is a system error.

**Step 3: Look up a declared phrase.**

```bash
node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs \
  --json -- "spec folder"
```

The run exits 0 and prints one JSON object. `results` lists each candidate with its `path` and matched `phrases`. `totalCandidates` counts documents before `--limit`. `truncated` is true when that count exceeds the limit. Exit 1 is a clean miss and exit 2 a bad invocation or an unreadable index.

**Step 4: Save at the end of the session.** Run `/speckit:save`. The default mode returns a save plan with the target route and the proposed edits. Full-auto mode runs `generate-context.js`, which writes the packet's continuity fields and refreshes the metadata pair. The next session starts with `/speckit:resume`.

---

## 3. HOW IT WORKS

### The Packet Lifecycle

Work begins at Gate 3. The gate names the folder before the first write. A new folder is scaffolded from the Level contract rather than copied by hand. During the work, `tasks.md` carries the checklist. At Level 2 and above, `acceptance-criteria.md` carries the closure verdict. Level 1 keeps its criteria inline in `spec.md`. At the end, a full-auto `/speckit:save` runs `generate-context.js`, which refreshes the packet's continuity surfaces. A later session runs `/speckit:resume`, which prefers `handover.md` and falls back through the packet's own continuity state to the packet docs.

```text
Session starts
  └─► Gate 3 asks: "Which spec folder?"
       ├─► Option A: Use existing folder
       ├─► Option B: Create new folder (create.sh)
       ├─► Option C: Use a related folder
       └─► Option D: Skip documentation
            │
            ▼
  AI modifies files, tracks tasks in tasks.md
            │
            ▼
  Session ends
  └─► generate-context.js updates canonical continuity surfaces
       └─► regenerate the trigger index when frontmatter changed
            │
            ▼
  Next session starts
  └─► /speckit:resume prefers handover.md, then _memory.continuity, then falls
      back to the packet docs
       └─► the bounded context recipe adds context when needed
       └─► AI resumes with context from the packet
```

### Documentation Levels

Levels match documentation depth to the size of the change. The LOC ranges are guidance, not hard rules. Risk and the number of affected files can push a packet up a level.

| Level | Scope guidance | What it adds | When to use |
|---|---|---|---|
| **1** | under 100 LOC | The base set, then `implementation-summary.md` once implementation starts | Small features and single-file fixes |
| **2** | 100 to 499 LOC | `acceptance-criteria.md`, scaffolded at creation and checked by the closure rule | Work that needs verification across more than one file |
| **3** | 500 LOC and up | Optional `decision-record.md` for architecture calls | Architecture changes and complex refactors |
| **3+** | High complexity and governance needs | Approval workflow, compliance fields and AI execution protocols | Work that needs review tracking |
| **Phase parent** | One or more child phase folders | `spec.md`, `description.json` and the child list in `graph-metadata.json`, plus an optional `decision-record.md` | A feature split into parallel or multi-session phases |

### Phase Parents

A folder is a phase parent when at least one direct child matches `^[0-9]{3}-[a-z0-9][a-z0-9-]*$` and holds its own `spec.md` or `description.json`. The parent then keeps its control files: `spec.md` and `description.json`, with the child list in `graph-metadata.json`. It may also carry a `decision-record.md` for decisions that span its phases. Heavy docs live in the children, where they stay accurate to that phase. `create.sh --phase` builds the parent and its child folders in one step. `validate.sh --recursive` then checks the whole tree.

### Retrieval Stays Lexical

The trigger index matches a prompt against the `trigger_phrases` an author declared. The ripgrep recipes find a literal phrase anywhere in the corpus, scoped by the path you pass. Neither lane ranks by meaning, so a phrase no document declares or spells literally is a clean no-hit rather than a nearest guess. The lookup reads a committed file and needs no server, so a fresh clone answers on the first call.

---

## 4. INTEGRATION & NAVIGATION

### Boundaries

System Spec Kit owns the spec folder and the continuity writer behind it. Validation runs over that same folder. It does not own code standards or git workflow. `sk-code` owns application code. `sk-git` owns the branch and worktree around a packet. `sk-doc` owns documentation quality and voice checks. Retrieval reaches spec and skill docs, not application source.

### Related Skills

| Skill | Relationship |
|---|---|
| [`sk-code`](../sk-code/SKILL.md) | Receives the implementation work that a packet plans |
| [`sk-git`](../sk-git/SKILL.md) | Owns the branch, worktree and pull request around a packet |
| [`sk-doc`](../sk-doc/SKILL.md) | Checks the authored documents a packet holds |
| [`system-skill-advisor`](../system-skill-advisor/SKILL.md) | Routes a prompt to this skill through the advisor hook |
| [`system-deep-loop`](../system-deep-loop/SKILL.md) | Anchors research and review loops in a packet |

---

## 5. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| The lookup exits 2 | The invocation is malformed or the index is unreadable | Regenerate the index with `generate-trigger-index.mjs` |
| A new packet fails validation | A required document for the declared level is missing | Run `validate.sh --verbose`, then `upgrade-level.sh` with `--to` and the target level |
| `generate-context.js` is missing | The TypeScript sources are not compiled | Run `npm --prefix .skilled/skills/system-spec-kit run build` |
| A save leaves continuity unchanged | The run used the default plan-only mode | Pass `--full-auto` so the writer also stores the continuity fields |

---

## 6. VERIFICATION

| Check | Result |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-spec-kit/README.md --type readme` reports zero issues |
| Packet validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<NNN-name>/ --quiet` prints `RESULT: PASSED` and exits 0 |
| Trigger lookup | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "spec folder"` exits 0 and prints a `results` array |
| Index freshness | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` compares the committed index with the corpus and exits 0 when nothing differs |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: activation rules and the gate list |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent model, resource map and loading levels |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Boundary contract between `runtime/cli/` and `runtime/` |
| [`runtime/README.md`](./runtime/README.md) | Engine reference: the API surface and the build commands |
| [`references/workflows/quick-reference.md`](./references/workflows/quick-reference.md) | Command map and level shortcuts |
| [`references/workflows/spec-authoring-card.md`](./references/workflows/spec-authoring-card.md) | The short card each writing intent loads first |
| [`references/validation/validation-rules.md`](./references/validation/validation-rules.md) | Rule reference behind the 42-rule registry |
| [`references/structure/folder-structure.md`](./references/structure/folder-structure.md) | Folder naming and the files each level requires |
| [`references/structure/phase-definitions.md`](./references/structure/phase-definitions.md) | Phase qualification and the shape of a lean parent |
| [`references/retrieval/retrieval-conventions.md`](./references/retrieval/retrieval-conventions.md) | Trigger-index contract and the ripgrep recipes |
| [`references/memory/save-workflow.md`](./references/memory/save-workflow.md) | Save entrypoints and the surfaces a save refreshes |
| [`references/templates/template-guide.md`](./references/templates/template-guide.md) | Template usage and composition rules |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Complete catalog of implemented features |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate the catalog |

<!-- readme-check
-->
