---
title: "D2-R1 — Wrapper tool over-grant: read-and-guide modes get Write/Edit/Bash"
description: "Strip Write/Edit/Bash from the four read-and-guide /design:* wrappers and gate any mutation-free command that still carries mutating tools, in .opencode/commands/design/*.md frontmatter."
trigger_phrases:
  - "d2-r1 tool over-grant"
  - "tool over-grant design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D2-R1 — Wrapper tool over-grant: read-and-guide modes get Write/Edit/Bash

## 1. OBJECTIVE
Give each `/design:*` wrapper a least-privilege toolset: only md-generator keeps mutating tools, while interface/foundations/motion/audit run read-only.

## 2. WHY
All five wrappers share one mutating toolset even though four of them only read and guide, granting Write/Edit/Bash they never legitimately use.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/commands/design/*.md` frontmatter + `command-metadata.json`
- **Severity:** P0
- **Enforcement class:** enforceable
- **Dimension:** D2 — Command Specificity

## 4. BUILD OUTLINE
- Add `toolPolicy{mutatesWorkspace}` per command in metadata.
- Strip `Write,Edit,Bash` from interface/foundations/motion/audit wrappers; keep Read/Glob/Grep.
- Keep md-generator as the only mutating wrapper.
- Surface checker fails a mutation-free command that still declares mutating tools.

## 5. ACCEPTANCE
- Checker exits non-zero when a `mutatesWorkspace:false` command declares Write/Edit/Bash; exits zero otherwise.

## 6. EVIDENCE
- `commands/design/interface.md:4` vs `design-interface/SKILL.md:4` — wrapper grants mutating tools the mode never uses.
- Source: `research/research.md` §5 (D2-R1)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
