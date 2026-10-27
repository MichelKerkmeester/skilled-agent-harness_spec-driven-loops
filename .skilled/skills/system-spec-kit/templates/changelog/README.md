---
title: "Packet Changelog Templates"
description: "Deprecated packet-local changelog templates, kept to re-render the existing root and phase changelogs."
trigger_phrases:
  - "packet changelog templates"
  - "nested changelog templates"
  - "root phase changelog"
---

# Packet Changelog Templates

---

## 1. OVERVIEW

> **Deprecated.** Spec folders no longer get changelogs. These templates stay only so the deprecated nested changelog generator can render the existing packet changelogs. New entries go to `.skilled/changelog/` through `/create:changelog`.

`templates/changelog/` contains the templates for the packet-local changelogs that were generated inside spec folders. Those changelogs summarize canonical packet docs and are separate from global release-note templates under `.skilled/changelog/`.

Current state:

- `root.md` renders changelogs for root spec folders.
- `phase.md` renders changelogs for phase child folders.
- Recovery flows through `/speckit:resume`, implemented by `.skilled/commands/speckit/resume.md`, and canonical continuity docs.

---

## 2. DIRECTORY TREE

```text
changelog/
├── README.md
├── root.md    # Root packet changelog template
└── phase.md   # Phase child changelog template
```

---

## 3. KEY FILES

| File | Role |
|---|---|
| `root.md` | Template for `changelog/changelog-<packet>-root.md`. |
| `phase.md` | Template for phase child changelogs in the parent packet `changelog/` folder. |

---

## 4. BOUNDARIES AND FLOW

Boundaries:

- This directory owns packet-local changelog templates only.
- It must not replace global release-note templates.
- Generated changelogs summarize packet docs, not live worktree diffs.

Generation flow:

```text
╭────────────────────╮
│ canonical spec docs│
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ root.md or phase.md│
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ changelog generator│
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ packet changelog   │
└────────────────────┘
```

---

## 5. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `root.md` | Root spec folder changelog generation. |
| `phase.md` | Phase child changelog generation. |
| Changelog generator script (deprecated) | Reads canonical packet docs and applies one template. Prints a deprecation notice on stderr. |

---

## 6. VALIDATION

Run from the repository root after template edits:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/<track>/<NNN-name> --strict
```

Generated changelogs should reference available packet docs and avoid claiming task completion beyond those docs.

---

## 7. RELATED

| Document | Role |
|---|---|
| [sk-doc changelog template](../../../sk-doc/sk-create-changelog/assets/changelog-template.md) | Global changelog and release-note template. |
