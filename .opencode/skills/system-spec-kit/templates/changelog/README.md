---
title: "Packet Changelog Templates"
description: "Packet-local changelog templates for root specs and phase child folders."
trigger_phrases:
  - "packet changelog templates"
  - "nested changelog templates"
  - "root phase changelog"
---

# Packet Changelog Templates

---

## 1. OVERVIEW

`templates/changelog/` contains packet-local changelog templates generated inside spec folders. These templates summarize canonical packet docs and are separate from global release-note templates under `.opencode/changelog/`.

Current state:

- `root.md` renders changelogs for root spec folders.
- `phase.md` renders changelogs for phase child folders.
- Recovery flows through `/speckit:resume`, implemented by `.opencode/commands/speckit/resume.md`, and canonical continuity docs.

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
| Changelog generator script | Reads canonical packet docs and applies one template. |

---

## 6. VALIDATION

Run from the repository root after template edits:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict
```

Generated changelogs should reference available packet docs and avoid claiming task completion beyond those docs.

---

## 7. RELATED

| Document | Role |
|---|---|
| [sk-doc changelog template](../../../sk-doc/shared/assets/changelog-template.md) | Global changelog and release-note template. |
