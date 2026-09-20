---
title: "Target Tree for the sk-create-repo-rule Packet"
description: "The packet layout phase 3 scaffolds, inherited from sk-create-command rather than invented, with each directory justified by what it holds and each omission by what the mode does not need."
trigger_phrases:
  - "target tree"
  - "packet layout"
  - "which directories"
  - "mode scaffold"
  - "inherited from sibling"
importance_tier: normal
contextType: reference
version: 1.0.0.0
---

# Target Tree for the sk-create-repo-rule Packet

Inherited from `sk-create-command`, which is the closest sibling in shape: it authors a
document plus its wiring, and carries `assets/` for the templates it emits.

Observed sibling layouts:

| Mode | Directories |
|------|-------------|
| `sk-create-changelog` | `references/`, `changelog/` — the minimum |
| `sk-create-command` | `references/`, `assets/`, `changelog/` |
| `sk-create-diagram` | all of the above plus `scripts/`, `benchmark/`, `feature-catalog/`, `manual-testing-playbook/` |

---

## 1. THE TREE

```
.opencode/skills/sk-doc/sk-create-repo-rule/
├── SKILL.md                        the executable contract
├── README.md                       what it is, for a reader outside the workflow
├── assets/
│   ├── repo-rule-template.md       the rule template, from rule-anatomy.md
│   └── repo-rules-router-template.md   the router, for a repository with none
├── references/
│   ├── README.md                   the router for this directory
│   ├── rule-anatomy.md             MUST and MAY elements
│   ├── decision-tests.md           may this rule exist at all
│   ├── creation-standards.md       do's and don'ts            (phase 4)
│   └── agents-md-integration.md    the wiring contract        (phase 5)
└── changelog/                      symlinked into .opencode/changelog/sk-doc/
```

---

## 2. WHY EACH DIRECTORY

| Directory | Justification |
|-----------|---------------|
| `assets/` | The mode emits two templates. `sk-create-command` carries `assets/` for exactly this reason |
| `references/` | Four reference documents, three of them authored by later phases. Every sibling has one |
| `changelog/` | Universal across all three siblings examined, and the symlink into `.opencode/changelog/sk-doc/` is the convention |

## 3. WHY THE OMISSIONS

| Omitted | Reason |
|---------|--------|
| `scripts/` | The mode writes markdown. No extraction, conversion or generation step needs code. `sk-create-diagram` has scripts because it parses draw.io and Mermaid; nothing here parses anything |
| `benchmark/` | Deferred, not refused. A benchmark needs the mode to exist first — `sk-create-diagram` added its benchmark in phase 10 of 16, well after the skill shipped |
| `feature-catalog/` | Same reason, and it is `sk-create-feature-catalog`'s output rather than this mode's |
| `manual-testing-playbook/` | Same. `sk-create-diagram` authored its playbook in phase 7 and executed it in phase 9 |

Three of the four omissions are *deferrals with a named precedent*, not permanent
exclusions. Scaffolding them empty now would be building for a future nobody has asked
for, which the restraint test refuses.

---

## 4. TWO TEMPLATES, WITH DIFFERENT STANDING

`assets/` holds two, because the boundary document found the router is a different
document class: no frontmatter, no `Fires when`, no `The rule`, no self-check, four
numbered sections against the rules' six to twelve.

A repository with no router cannot receive a rule at all — the trigger table is the only
thing that loads one. So the mode emits a router when none exists, and rules thereafter.

---

## 5. THE COMMAND, WHICH LIVES ELSEWHERE

`/create:repo-rule` is not in this tree. Commands live at `.opencode/commands/create/`
with their YAML pair under `assets/`:

```
.opencode/commands/create/repo-rule.md
.opencode/commands/create/assets/create-repo-rule-auto.yaml
.opencode/commands/create/assets/create-repo-rule-confirm.yaml
.opencode/commands/create/assets/create-repo-rule-presentation.txt
```

Phase 6 produces these through `sk-create-command` rather than by hand.

---

## 6. SELF-CHECK

- [ ] Every directory is present in at least one sibling mode.
- [ ] Every omission names its reason, and deferrals name the precedent.
- [ ] `assets/` holds two templates: the rule, which the mode is for, and the router, which it emits only when the destination is missing.
- [ ] The command is not in this tree; it is phase 6's output via another mode.
