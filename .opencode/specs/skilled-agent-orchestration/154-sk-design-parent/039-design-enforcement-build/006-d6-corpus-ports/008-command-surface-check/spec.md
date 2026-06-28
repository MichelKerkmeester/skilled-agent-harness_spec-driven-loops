---
title: "D6-R8 — design-command-surface-check drift audit"
description: "New checker comparing command files vs command-metadata.json vs generated docs vs wrapper frontmatter vs route fixtures for structural drift."
trigger_phrases:
  - "d6-r8 command surface check"
  - "command surface drift design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R8 — design-command-surface-check drift audit

## 1. OBJECTIVE
Add a structural drift checker that proves the command surface stays consistent across its metadata, generated docs, wrapper frontmatter, and route fixtures.

## 2. WHY
Once commands become recipes (D6-R1) and carry handoff grammar (D6-R7), the surface can silently drift. designer-skills-main's nine-plugin command surface shows the breadth that needs a single structural audit rather than ad-hoc review.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` (new)
- **Severity:** P2
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D2/D3

## 4. BUILD OUTLINE
- Compare `commands/design/*.md` vs `command-metadata.json` vs generated docs vs wrapper frontmatter vs route fixtures.
- Assert no surviving `<design request>` placeholder; mutation-free modes carry no Write/Edit/Bash; `ownerMode ∈ workflowMode`; aliases unique.
- Emit a deterministic pass/fail with the specific drift locus.

## 5. ACCEPTANCE
- An injected mismatch (frontmatter ≠ metadata, dead placeholder, alias collision) fails the checker; a clean surface passes.

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:63` — nine-plugin command-surface scope (97 skills / 30 commands) motivating a structural audit.
- Source: `research/research.md` §9 (D6-R8)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
