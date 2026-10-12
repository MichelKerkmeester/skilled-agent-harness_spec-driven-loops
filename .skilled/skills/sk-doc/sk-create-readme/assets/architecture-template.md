---
title: Skill ARCHITECTURE.md Template
description: Template for a skill package's ARCHITECTURE.md, the system-level document that explains runtime zones, package topology, the main read and write flows, subsystems, integration points and verification.
trigger_phrases:
  - "architecture md template"
  - "skill architecture document"
  - "package architecture template"
  - "runtime architecture doc"
importance_tier: normal
contextType: general
version: 1.2.0.1
---

# Skill ARCHITECTURE.md Template

Use this template for the `ARCHITECTURE.md` at a skill package root, next to `SKILL.md` and `README.md`. It explains how the package's code works as a system. The README orients a user, `SKILL.md` routes an agent, and `ARCHITECTURE.md` tells a maintainer where behavior lives and which way dependencies run.

---

## 1. WHEN TO USE

Write an `ARCHITECTURE.md` when a skill package ships runtime code: a daemon, a CLI, a library, hooks or scripts with more than one layer. A documentation-only skill does not need one.

A code-folder README (`readme-code-template.md`) covers one folder. `ARCHITECTURE.md` covers the whole package: how its zones relate, the paths data takes through them, and what enforces the contract. When a folder README starts explaining other folders, that explanation belongs here.

---

## 2. CONTENT MODEL

The eight sections are fixed and numbered in this order, so a reader moving between skills finds the same thing in the same place. A section with nothing to say states that in one line rather than disappearing.

| Section | Holds | Notes |
|---|---|---|
| 1. OVERVIEW | What the package does, its front door, its authored zones, and an architecture diagram | One or two paragraphs plus the diagram |
| 2. PACKAGE TOPOLOGY | A directory tree of the package with one-line roles, and the allowed dependency direction | Show only folders that matter; list import edges as `a/ ──▶ b/` |
| 3. CANONICAL FLOWS | The main read path and write path, each named after its entry command, plus the module that owns each | Keep to the paths that define the package |
| 4. RUNTIME SUBSYSTEMS | One bolded paragraph per subsystem: what it does and where it lives | Link reference docs for depth instead of repeating them |
| 5. HOOK AND PLUGIN INTEGRATION | How runtimes, hooks, plugins or other skills call in, and what happens on timeout or failure | Write "None" when the package has no integration surface |
| 6. ENFORCEMENT AND VERIFICATION | The checks that hold the contract: validators, test suites, benchmarks, playbooks | Name the command or folder for each |
| 7. DECISION RECORDS | A table of the architecture decisions still in force, with status | Local numbering only; no spec or packet ids |
| 8. RELATED | Links to README, SKILL.md, install guide, feature catalog, playbook and references | Relative links from the package root |

---

## 3. WRITING RULES

- Describe current reality. Planned behavior goes in a spec, not here.
- Name files and folders by their real paths so a reader can open them.
- Draw the diagram with Unicode box characters inside a `text` fence, following the diagrams in `readme-code-template.md` §3.
- Keep it evergreen: no spec paths, packet numbers, phase names or task ids. The decision table numbers its own rows.
- Update §2 whenever a folder is added, merged or renamed, because the topology is what goes stale first.

---

## 4. FILLABLE SCAFFOLD

Copy the block below, fill every bracket, and delete any row or line that does not apply.

````markdown
---
title: "Architecture: [skill-name]"
description: "Current package architecture for [skill-name]: [front door], [main subsystems], and [verification]."
trigger_phrases:
  - "[skill-name] architecture"
  - "[main subsystem]"
importance_tier: "important"
---

# Architecture: [skill-name]

> Current-reality architecture for the `[skill-name]` package. [One sentence on what the package does and through which front door.]

---

## 1. OVERVIEW

[What the package is for and how callers reach it. Name the front door command or entry file.]

The package owns [N] authored zones:

- `runtime/` carries [daemon, CLI, library, tests].
- `[zone]/` carries [role].

### Architecture diagram

```text
┌─────────────────────────────────────────────┐
│              [SKILL-NAME] PACKAGE           │
├─────────────────────────────────────────────┤
│  ┌──────────────┐      ┌─────────────────┐  │
│  │ [caller]     │─────▶│ [front door]    │  │
│  └──────────────┘      └────────┬────────┘  │
│                                 ▼           │
│                        ┌─────────────────┐  │
│                        │ [core runtime]  │  │
│                        └────────┬────────┘  │
│                                 ▼           │
│                        ┌─────────────────┐  │
│                        │ [storage/state] │  │
│                        └─────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 2. PACKAGE TOPOLOGY

```text
[skill-name]/
├── runtime/                 # [role]
│   ├── lib/                 # [role]
│   ├── scripts/             # [role]
│   └── tests/               # [role]
├── references/              # Operator documentation
└── changelog/               # Versioned changelogs
```

Allowed dependency direction:

- `[layer]/ ──▶ [layer]/`

---

## 3. CANONICAL FLOWS

**Read path (`[command]`):** [input] enters [file], passes through [steps], and returns [output].

**Write path (`[command]`):** [input] enters [file], [validation], and persists to [storage].

**Key modules:**

- `[path]` owns the read path.
- `[path]` owns the write path.

---

## 4. RUNTIME SUBSYSTEMS

**[Subsystem].** [What it does, where it lives, and the reference doc for detail.]

---

## 5. HOOK AND PLUGIN INTEGRATION

[Which runtimes or skills call in, through which adapter, and the fallback on timeout or failure.]

---

## 6. ENFORCEMENT AND VERIFICATION

**[Gate].** [What it checks and the command that runs it.]

**Test surfaces.** [Test folders and the command for each.]

---

## 7. DECISION RECORDS

| ADR | Subject | Status |
|---|---|---|
| ADR-001 | [Decision] | Accepted |

---

## 8. RELATED

- [README.md](./README.md): Package overview
- [SKILL.md](./SKILL.md): Routing and invariants
````

---

## 5. RELATED

- [readme-code-template.md](./readme-code-template.md): Code-folder README scaffold and diagram examples
- [readme-template.md](./readme-template.md): General README scaffold
