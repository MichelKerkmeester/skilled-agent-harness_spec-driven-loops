---
title: "Implementation Summary: Command Template Conformance"
description: "design/extract.md now has the mandatory input gate its required argument-hint needs, and rewrite/response.md now declares a scoped allowed-tools set; both verified across every runtime path."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "command template conformance implementation"
  - "sk-create-command audit summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/029-command-template-conformance"
    last_updated_at: "2026-08-29T09:43:41Z"
    last_updated_by: "claude"
    recent_action: "Shipped both command fixes; verified visible through all three runtime symlink paths"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/commands/design/extract.md"
      - ".opencode/commands/rewrite/response.md"
      - ".opencode/commands/prompt/improve.md"
      - ".opencode/commands/rewrite/explain-visually.md"
      - ".opencode/commands/rewrite/response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:036e4d239b663b1392ac9d3797513af1baaf24b7c9b78355636f2dcccc114db0"
      session_id: "2026-08-29-sk-code-029"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Command Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-command-template-conformance |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — both confirmed defects fixed, all other candidate findings checked against the contract and confirmed conformant |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An audit of the 5 real command files under `.opencode/commands/{design,rewrite,prompt}` against `sk-doc/sk-create-command`, and two fixes for the confirmed defects it found.

1. **Mandatory input gate added to `design/extract.md`.** Its `argument-hint` declares a required `<live-url>`, but the file had no mandatory gate — a violation of `sk-create-command` Step 7 ("If `argument-hint` contains any required `<argument>`, add the mandatory gate immediately after frontmatter"). Without it, the command could infer a URL from context instead of blocking for one. Added a MANDATORY INPUT GATE section binding `live_url`, `output_dir`, and `execution_mode`, modelled on `prompt/improve.md`'s existing gate.

2. **`allowed-tools` added to `rewrite/response.md`.** The file had no `allowed-tools` key at all, so it inherited an unrestricted tool set despite being a display-only, in-context command that touches no files. Its two siblings (`explain-visually.md`, `response-by-external-agent.md`) both declare one. Added `allowed-tools: Read` — least privilege for a read-only, display-only command.

3. **Two candidate findings checked and confirmed conformant, not fixed.** `design/extract.md` and `prompt/improve.md` both carry the full six-section router shape; `design/extract.md` merely inserts an extra `## 4. VISIBLE OUTPUT CONTRACT` section, shifting its numbering — not a defect. The three `rewrite/*` commands use a PURPOSE/CONTRACT/INSTRUCTIONS/EXAMPLES/NOTES vocabulary; `sk-create-command` Step 8 mandates fixed section vocabulary only for router commands, and these are not routers, so the family's internal consistency was left as-is.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read all 5 real command files directly against `sk-create-command`'s contract text rather than assuming conformance from surface familiarity. `.opencode/commands/` holds the one real copy of each file; `.claude/commands/` and `.cursor/commands/` are symlinks into it, so a single edit lands in all three runtimes, and verification confirmed both fixes are actually reachable through all three paths rather than assuming the symlinks resolve correctly. Every candidate finding — not just the two that turned out to be defects — was checked against the contract's actual rule before being classified, which is what kept the shifted section numbering and the non-router vocabulary from being misclassified as violations.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Model `design/extract.md`'s gate on `prompt/improve.md` | `prompt/improve.md` is the sibling router that already implements the mandatory-gate pattern `sk-create-command` Step 7 requires; reusing its shape keeps the two routers consistent rather than inventing a new gate structure. |
| `allowed-tools: Read` for `rewrite/response.md` | The command is display-only and touches no files; `Read` is the minimum set that still lets it inspect the preceding response if needed, consistent with least privilege. |
| Leave the three `rewrite/*` commands' vocabulary unchanged | `sk-create-command` Step 8 requires fixed section vocabulary only for router commands; these are not routers, and their PURPOSE/CONTRACT/INSTRUCTIONS/EXAMPLES/NOTES shape is already consistent within the family. |
| Leave `design/extract.md`'s extra section unchanged | Its six-section router shape matches `prompt/improve.md`'s; the extra `## 4. VISIBLE OUTPUT CONTRACT` section is additive content, not a structural violation, and renumbering it would add churn without fixing a real defect. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Real-file enumeration | PASS — 5 real files confirmed under `.opencode/commands/{design,rewrite,prompt}` |
| Symlink topology | PASS — `.claude/commands/` and `.cursor/commands/` confirmed as symlinks into `.opencode/commands/`; `.codex`, `.pi`, `.devin` confirmed to have no commands directory in this scope |
| `design/extract.md` mandatory gate | PASS — MANDATORY INPUT GATE section present, binding `live_url`, `output_dir`, `execution_mode` |
| `rewrite/response.md` allowed-tools | PASS — `allowed-tools: Read` present in frontmatter |
| Router vocabulary finding (checked, not a defect) | PASS — `design/extract.md` and `prompt/improve.md` both carry the full six-section router shape |
| Non-router vocabulary finding (checked, not a defect) | PASS — the three `rewrite/*` commands' PURPOSE/CONTRACT/INSTRUCTIONS/EXAMPLES/NOTES vocabulary is consistent within the family and not subject to `sk-create-command` Step 8's router-only requirement |
| Runtime-path reachability | PASS — both fixes confirmed visible through `.opencode`, `.claude`, and `.cursor` command paths |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scope is `{design,rewrite,prompt}` only.** Other command families under `.opencode/commands/` were not audited by this packet and may carry similar drift; this packet makes no claim about them.
2. **Fixes are uncommitted at completion.** Both edits (`design/extract.md`, `rewrite/response.md`) are local working-tree changes; committing them is a separate action outside this packet's documentation scope.

<!-- /ANCHOR:limitations -->
