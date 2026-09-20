---
title: "Implementation Summary: Agent Template Conformance"
description: "All 12 agents now carry the Required Body Shape's RELATED RESOURCES section across every runtime, deep-improvement and prompt-improver carry a permission-grounded hard-boundary block, and the authoring template itself is fixed."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "agent template conformance implementation"
  - "sk-create-agent audit summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/036-agent-template-conformance"
    last_updated_at: "2026-08-29T10:24:54Z"
    last_updated_by: "claude"
    recent_action: "Shipped both fixes plus the template root-cause fix; verified across all runtimes"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md"
      - ".opencode/skills/sk-doc/sk-create-agent/SKILL.md"
      - ".opencode/agents/deep-improvement.md"
      - ".opencode/agents/prompt-improver.md"
      - ".codex/agents/deep-improvement.toml"
    session_dedup:
      fingerprint: "sha256:5378de94e4f2829c1dd553b82575385bbad34117138fe0a240714070626810e8"
      session_id: "2026-08-29-sk-code-030"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Agent Template Conformance

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 036-agent-template-conformance |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Level** | 1 |
| **Completion** | 100% — both agent defects fixed across every runtime, and the authoring template that produced one of them is fixed at its source |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An audit of all 12 agents across four independently-authored runtime directories against `sk-doc/sk-create-agent`'s Canonical Frontmatter and Required Body Shape contract, two confirmed defects fixed everywhere they appeared, and a fix to the authoring template responsible for one of them.

1. **RELATED RESOURCES added to 10 of 12 agents, across `.opencode`, `.claude`, `.pi`, and `.codex`.** Only `design` and `markdown` already had a Required Body Shape item 7 section. The other ten — `ai-council`, `code`, `context`, `debug`, `deep-improvement`, `deep-research`, `deep-review`, `orchestrate`, `prompt-improver`, `review` — did not, in any of their four real runtime copies. `git diff --stat` across the four directories reports 40 files changed, 550 insertions(+), 32 deletions(-); every deletion is a `## N. SUMMARY` heading renumber, no body content removed. 212 referenced paths were checked across every added section, 0 dead.

2. **Hard-boundary block authored for `deep-improvement` and `prompt-improver`, across all 4 runtimes.** Every other agent already opened with a section-0 hard boundary; these two did not. Each block is grounded in that agent's own declared permissions, not a shared paragraph: `deep-improvement` is write-capable (`write: allow`, `edit: allow`, `bash: allow`) but confined to one packet-local candidate folder with `task: deny`; `prompt-improver` is read-only (`write: deny`, `edit: deny`, `bash: deny`, `task: deny`) and forbids mutation, delegation, and execution outright.

3. **The template that caused the first defect is fixed.** `sk-create-agent/assets/agent-template.md`'s skeleton ran `## 1. CORE WORKFLOW` through a final `## 8. SUMMARY` with no related-resources section anywhere in between — the same gap found in 10 of 12 shipped agents. Inserted `## 8. RELATED RESOURCES` ahead of a renumbered `## 9. SUMMARY` (15 insertions, 1 deletion), so the next agent authored from the template cannot reproduce the omission.

4. **`.cursor` and `.devin` confirmed to inherit both fixes with zero independent writes.** Both are pure symlinks into `.claude/agents/` (12/12 each); `git status` shows no changes in either directory after the edit.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Audited every agent against `sk-create-agent/SKILL.md`'s written contract directly, rather than assuming twelve individually-authored files were each independently conformant. The first defect — 10 of 12 agents missing RELATED RESOURCES — was pervasive enough (83% of the fleet, identical in shape in every runtime) to treat as a signal rather than twelve unrelated oversights. Reading `sk-create-agent/assets/agent-template.md`, the skeleton every agent is meant to start from, confirmed the hypothesis: it never had a related-resources section either, despite its own governing `SKILL.md` requiring one. The fix therefore touched five files, not just twelve agents — the ten non-conforming agents across four runtimes, plus the template itself, so the defect could not recur in the next agent authored from it. The second defect, the missing hard-boundary block on `deep-improvement` and `prompt-improver`, was narrower and was fixed by writing each agent's boundary language from its own frontmatter permissions rather than copying the block from a conforming sibling, since a shared boundary paragraph would misstate either agent's real authority. Verification did not stop at "the diff looks right": every newly referenced path was checked for existence, every `.codex` TOML file was re-parsed to confirm the triple-quote-delimited `developer_instructions` string still balances, and `.cursor`/`.devin` were checked for git changes to prove — not assume — that their symlinks carried the fix without needing an edit of their own.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix `agent-template.md`, not just the 12 agents | A defect in 10 of 12 agents, identical in shape across every runtime, is a template defect wearing twelve costumes. `agent-template.md` itself ran section 0 through a final `## 8. SUMMARY` with no related-resources section, while its own `SKILL.md` required one (Required Body Shape item 7) — fixing only the agents would have left the next agent authored from the template free to reproduce the same gap. |
| Ground each hard-boundary block in the agent's own permissions, not a shared paragraph | `deep-improvement` is write-capable and `prompt-improver` is read-only; a single copied boundary block would either overstate `prompt-improver`'s authority or understate `deep-improvement`'s real, scoped write capability. Each block was written from that agent's own frontmatter `permission:` values. |
| Edit `.codex`'s TOML string in parallel, not via a conversion script | No agent-conversion script exists between the `.md` runtimes and `.codex`'s `developer_instructions` TOML string, so the four runtimes needed four parallel edits per agent rather than one edit fanning out automatically. |
| Verify `.cursor`/`.devin` rather than assume symlink inheritance | Both directories carry no independent content today, but a broken or re-pointed symlink would silently strand two runtimes on the un-fixed version. Checking `git status` for both after the edit turned that assumption into a confirmed fact. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Frontmatter schema per runtime | PASS — `permission:` present in all 12 `.opencode` files; `tools:` present in all 12 `.claude` and `.pi` files; zero schema mismatches |
| Permission-to-tools mapping | PASS — zero agents leak an OpenCode-denied tool into a Claude allow-list |
| `name` matches filename stem | PASS — zero mismatches across all 12 agents, `.opencode`/`.claude`/`.pi`/`.codex` |
| RELATED RESOURCES coverage | PASS — 40 files changed across `.opencode`/`.claude`/`.pi`/`.codex` (`git diff --stat`: 550 insertions(+), 32 deletions(-)); all 32 deletions are `## N. SUMMARY` heading renumbers |
| Referenced-path existence | PASS — 212 paths extracted from added RELATED RESOURCES lines, 0 missing |
| `.codex` TOML integrity | PASS — `tomli.load()` parses all 12 `.codex/agents/*.toml` cleanly; triple-quote delimiters balanced |
| Hard-boundary coverage | PASS — `deep-improvement` and `prompt-improver` each carry a section-0 block across all 4 runtimes, grounded in their own permissions |
| Template root cause fixed | PASS — `agent-template.md` now inserts `## 8. RELATED RESOURCES` ahead of renumbered `## 9. SUMMARY` |
| `.cursor`/`.devin` symlink inheritance | PASS — `git status`/`git diff --stat` report zero changes in both directories |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No automated `.codex` conversion.** Because no script generates `.codex/agents/*.toml` from the `.md` runtimes, a future body edit still needs a manual, parallel edit to the TOML string — this packet did not add that tooling, only performed the parallel edit by hand.
2. **Fixes are uncommitted at completion.** The 40 agent-file edits and the `agent-template.md` fix are local working-tree changes at the point this summary was written; committing them is a separate action outside this packet's documentation scope.
<!-- /ANCHOR:limitations -->
