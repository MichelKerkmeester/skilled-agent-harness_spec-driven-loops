---
title: "Implementation Summary: agent create-agent canon conformance + Codex TOML parity gate"
description: "Implementation summary confirming 26/26 agent .md files pass the create-agent validator gate, documenting the sanctioned ## 0. numbering warning, and recording the Codex agent-TOML parity resync that turned sync-agents.cjs --check GREEN."
trigger_phrases:
  - "agent canon conformance summary"
  - "codex toml parity implementation"
  - "sync-agents check restored"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/138-command-agent-canon-conformance/002-agent-canon-conformance"
    last_updated_at: "2026-07-14T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Agent canon conformance verified; TOML gate green"
    next_safe_action: "Orchestrator runs validate.sh --strict on this child, then rolls up the parent"
    blockers: []
    key_files:
      - ".opencode/agents/*.md"
      - ".claude/agents/*.md"
      - ".codex/agents/ai-council.toml"
      - ".codex/agents/deep-alignment.toml"
      - ".codex/agents/markdown.toml"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-agent-canon-conformance |
| **Parent Packet** | skilled-agent-orchestration/138-command-agent-canon-conformance |
| **Completed** | 2026-07-14 |
| **Level** | 2 |
| **Commit** | `e893d9adde` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two outcomes, both confirmed by direct validation.

**1. Create-agent canon conformance of the 13 agents (× 2 runtimes = 26 `.md`).** All 26 agent markdown files — `.opencode/agents/*.md` (with `permission:` frontmatter) and `.claude/agents/*.md` (with `tools:` frontmatter) — already meet the sk-doc create-agent validator gate: `validate_document.py <file> --type agent` returns exit 0 for all 26, and every one has `## 1. CORE WORKFLOW`. No agent `.md` file was edited.

Of the 13 agents, 11 carry the canon-REQUIRED `## 0. ILLEGAL NESTING / HARD BLOCK` section (ai-council, code, context, debug, deep-alignment, deep-research, deep-review, design, markdown, orchestrate, review). Because `validate_document.py`'s H2 numbering check (`validate_h2_headers`) starts `expected_num = 1` with no exemption for the canon-sanctioned `## 0.`/`## 0b.` prefix, each of those 11 agents emits one `non_sequential_numbering` warning ("expected 1, found 0") — 22 of the 26 files. This warning is non-blocking (exit still 0) and is a documented sanctioned-dialect artifact of the canon-required `## 0.` hard block; it is NOT drift. Renumbering to silence it would strip or corrupt canon-required structure, so it was deliberately NOT done. The canon and its own validator are in direct conflict on this point: you cannot have both the canon-required `## 0.` AND zero numbering warnings under the current validator.

The two agents that report 0 issues (0/0), `deep-improvement` and `prompt-improver` (4 of the 26 files), do so ONLY because they lack the `## 0.` hard block — a pre-existing conformance nuance. They were left as-is (already above the exit-0 gate); there is no evidence their omission was an oversight, and backfilling `## 0.` would add behavior-adjacent content, so it was not done in this child.

**2. Codex agent-TOML parity gate restored.** `.codex/agents/*.toml` is a generated Codex runtime surface produced only by `sync-agents.cjs`. Its `--check` mode is the sole cross-runtime drift gate, and it was RED (exit 1) with 4 stale TOMLs — legitimate agent-`.md` edits from prior packets that had never been re-synced. Regenerating via the worktree's `sync-agents.cjs` changed 3 files (`ai-council.toml`, `deep-alignment.toml`, `markdown.toml`); the fourth stale entry resolved as part of the same regen pass. `sync-agents.cjs --check` is now GREEN: "PASS: 13 agents are in sync." (exit 0). Committed as `e893d9adde`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Assess-confirm-then-resync. The 26 agent `.md` files were swept with the create-agent gate and confirmed conformant with no edit; the `## 0.` numbering warning was characterized rather than "fixed". The only mutation was regenerating the drifted `.codex/agents/*.toml` through the canonical `sync-agents.cjs` and re-running `--check` to confirm the fail-closed parity gate returned to GREEN. The two standing recommendations (validator numbering-gap; `## 0.` backfill) were recorded as ADRs rather than acted on, because each modifies a surface outside this child's scope (a shared validator; two agents' authored content).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not renumber `## 0.` → `## 1.` to silence the warning | The warning is a sanctioned-dialect artifact; renumbering would strip/corrupt the canon-required hard-block section. |
| Do not edit any agent `.md` | The `.md` surface already passes the exit-0 gate; parity resync alone restores dual-runtime conformance. |
| Leave `deep-improvement` + `prompt-improver` without `## 0.` | Both already pass 0/0; no evidence the omission was an oversight; backfilling adds behavior-adjacent content. Recorded as an open ADR for the operator. |
| Regenerate only via `sync-agents.cjs`, never hand-edit TOMLs | TOMLs are deterministic from `.md`; hand-editing would immediately re-drift the `--check` gate. |
| Defer the validator numbering-gap fix | Exempting `## 0.`/`## 0b.` from the sequential check modifies a shared repo-wide validator — out of 002 scope; recorded as ADR-001. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Agent enumeration | CONFIRMED: 13 `.opencode/agents/*.md` + 13 `.claude/agents/*.md` + 13 `.codex/agents/*.toml`. |
| Create-agent gate sweep | CONFIRMED: `validate_document.py --type agent` over 26 `.md` → 26/26 exit 0, 0 non-zero; every file has `## 1. CORE WORKFLOW`. |
| Sanctioned numbering warning | CONFIRMED: 22/26 files emit one `non_sequential_numbering` warning ("expected 1, found 0"); the 4 files from `deep-improvement` + `prompt-improver` report 0 issues. |
| `## 0.` coverage | CONFIRMED: 11/13 agents carry `## 0.`; `deep-improvement` and `prompt-improver` do not. |
| Codex parity gate (baseline) | CONFIRMED: `sync-agents.cjs --check` RED (exit 1), 4 stale TOMLs. |
| Codex parity gate (post-regen) | CONFIRMED: `sync-agents.cjs --check` GREEN (exit 0), "PASS: 13 agents are in sync." |
| Behavior preservation | CONFIRMED: `git show --stat e893d9adde` = 3 files, +9/-4, all `.codex/agents/*.toml`; no agent `.md` in the diff. |
| Strict spec validation | PENDING (orchestrator-run): `validate.sh <this-folder> --strict` is executed by the orchestrator, not this child. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Validator/canon conflict is unresolved by design.** Canon-conformant agents that carry `## 0.` cannot reach 0/0 under the current `validate_document.py --type agent` because its sequential-numbering check does not exempt the `## 0.`/`## 0b.` prefix. The fix modifies a shared validator and is deferred to the operator (ADR-001). Until then, the 22 sanctioned warnings are expected and non-blocking.
2. **Two agents remain `## 0.`-less.** `deep-improvement` and `prompt-improver` pass 0/0 without the canon hard block. Whether to backfill for canon uniformity (at +2 sanctioned warnings) or leave them is an open operator question (ADR-002).
3. **Root `AGENTS.md` is out of scope.** It is not covered by the create-agent canon and was neither validated nor force-fit here — flagged only.
4. **Codex runtime reload.** `.codex/agents/*.toml` is file-backed; the Codex runtime picks up the regenerated TOMLs on its next project load/restart.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:rollback -->
## Rollback

To roll back the Codex TOML parity resync, `git revert e893d9adde` (or restore `.codex/agents/{ai-council,deep-alignment,markdown}.toml` from the prior commit), then re-run `sync-agents.cjs --check` to observe the pre-fix RED state. No agent `.md` restoration is needed — the `.md` surface was never modified. The `.codex/agents/*.toml` surface is fully reproducible from the canonical `.md` via `sync-agents.cjs`, so parity can be regenerated deterministically at any time.
<!-- /ANCHOR:rollback -->
