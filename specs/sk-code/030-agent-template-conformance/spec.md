---
title: "Spec: Agent Template Conformance"
description: "Audit all 12 agents across every runtime against sk-doc/sk-create-agent's Canonical Frontmatter and Required Body Shape, fix the confirmed defects, and fix the authoring template that let them happen."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "agent template conformance"
  - "sk-create-agent audit"
  - "related resources section missing"
  - "agent hard boundary missing"
importance_tier: "high"
contextType: "spec"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/030-agent-template-conformance"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Fixed 10/12 agents' missing RELATED RESOURCES and 2 agents' missing hard-boundary block"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-agent/SKILL.md"
      - ".opencode/agents/deep-improvement.md"
      - ".opencode/agents/prompt-improver.md"
      - ".codex/agents/deep-improvement.toml"
    session_dedup:
      fingerprint: "sha256:76db724dc76669688308d05faa1a1f9dbdf52bfcd6598ab0aea854fe8c1c0ec0"
      session_id: "2026-08-29-sk-code-030"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: Agent Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 030-agent-template-conformance |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

All 12 agents under `.opencode/agents/` are governed by `sk-doc/sk-create-agent`'s "Canonical Frontmatter" and "Required Body Shape" contract, and that contract spans five runtime directories: `.opencode`, `.claude`, `.pi`, `.codex`, `.cursor`, and `.devin`. `.opencode`, `.claude`, and `.pi` hold three real, independently authored copies of each agent's markdown body. `.codex` holds the same body text embedded inside a `developer_instructions` TOML string, so it needs its own parallel edit rather than inheriting one. `.cursor` and `.devin` are pure symlinks into `.claude`, so they inherit automatically and carry no independent content to audit.

An audit against that contract, not an assumption of conformance, found two real defects. Ten of the twelve agents had no "RELATED RESOURCES" section at all — Required Body Shape item 7 — with only `design` and `markdown` conforming. Two of those ten, `deep-improvement` and `prompt-improver`, were also missing the section-0 hard-boundary block every other agent opens with. Tracing the first defect back further found its root cause was not in the twelve agents but in the thing that authored them: `sk-create-agent/assets/agent-template.md` shipped a skeleton that ran straight from section 0 to a final `## 8. SUMMARY` with no related-resources section in between, while `sk-create-agent/SKILL.md` itself required one. The template taught the omission it was supposed to prevent, so the purpose of this packet was not only to fix the twelve agents, but to fix the template so the same gap could not be reproduced by the next agent authored from it.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: all 12 agents (`ai-council`, `code`, `context`, `debug`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`) across `.opencode/agents/`, `.claude/agents/`, `.pi/agents/`, and `.codex/agents/`; `sk-create-agent/assets/agent-template.md`, the authoring template responsible for the RELATED RESOURCES gap; verification that `.cursor/agents/` and `.devin/agents/` inherit the fix through their existing symlinks without any edit of their own.

Out of scope: adding new agents; changing any agent's frontmatter schema, permission set, or `tools:` allow-list (audited and confirmed correct, not touched); changing any agent's core workflow, capability, or anti-pattern content beyond the two confirmed structural gaps.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Every one of the 12 agents carries a "RELATED RESOURCES" section (Required Body Shape item 7) across `.opencode`, `.claude`, `.pi`, and `.codex`.
- **REQ-002 [P1]** Every added "RELATED RESOURCES" entry names a real path, verified present on disk — no invented or dead reference.
- **REQ-003 [P1]** `deep-improvement` and `prompt-improver` each carry a section-0 hard-boundary block across all four runtimes, grounded in that agent's own declared permissions.
- **REQ-004 [P1]** `sk-create-agent/assets/agent-template.md` is fixed to include a `## 8. RELATED RESOURCES` section ahead of a renumbered `## 9. SUMMARY`, so future agents authored from it do not reproduce the gap.
- **REQ-005 [P2]** Frontmatter schema (`.opencode` uses `permission:`; `.claude`/`.pi` use `tools:`), permission-to-tools mapping, and `name`-matches-filename-stem are confirmed correct in all 12 agents across all applicable runtimes before being ruled out as defects.
- **REQ-006 [P2]** `.cursor/agents/` and `.devin/agents/` are confirmed to register zero independent git changes after the fix, proving symlink inheritance rather than assuming it.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** `git diff --stat` across `.opencode/agents`, `.claude/agents`, `.pi/agents`, `.codex/agents` shows exactly 40 files changed, with every deletion line being a `## N. SUMMARY` heading renumber and no body content removed.
- **SC-002** Every path referenced in a newly added "RELATED RESOURCES" section resolves on disk: 212 paths checked, 0 dead.
- **SC-003** `.codex/agents/*.toml`'s `developer_instructions` triple-quote (`'''`) delimiters remain balanced in all 12 files after the edit, confirmed by a TOML parse.
- **SC-004** `git status` for `.cursor/agents/` and `.devin/agents/` shows no changes after the fix.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Fixing the symptom without the cause.** Mitigated by tracing the RELATED RESOURCES gap back to `agent-template.md` itself and fixing the skeleton, not only the 12 agents authored from it.
- **`.codex`'s TOML string body drifting from the `.md` runtimes.** Mitigated by editing each `.codex/agents/*.toml`'s `developer_instructions` string in parallel with its `.opencode`/`.claude`/`.pi` counterparts, and confirming the triple-quote delimiters still balance (TOML parse) after the edit.
- **Inventing a boundary block instead of grounding it in the agent's real permissions.** Mitigated by writing `deep-improvement`'s and `prompt-improver`'s hard-boundary text directly from each agent's own frontmatter `permission:` block, not a shared template paragraph.
- **Dependencies.** `sk-doc/sk-create-agent/SKILL.md`'s "Required Body Shape" and "Canonical Frontmatter" sections as the governing contract. No new packages or network access.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. Both defects were confirmed against the written contract before being fixed; the frontmatter-schema, permission-mapping, and `name`-match checks were confirmed correct, not assumed, before being ruled out.

<!-- /ANCHOR:questions -->
