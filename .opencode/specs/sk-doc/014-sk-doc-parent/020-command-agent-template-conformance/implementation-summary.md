---
title: "Implementation Summary: Command + agent template conformance"
description: "Made the 10 sk-doc /create routers and all 24 agents pass validate_document.py via a hybrid fix: routers gained numbered PURPOSE/INSTRUCTIONS (GPT-5.5); the agent detection bug and over-strict rule were reconciled by hand."
trigger_phrases:
  - "command agent conformance summary"
  - "125 sk-doc phase 020 summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/020-command-agent-template-conformance"
    last_updated_at: "2026-07-07T14:31:04.000Z"
    last_updated_by: "claude-opus"
    recent_action: "10/10 routers + 24/24 agents VALID"
    next_safe_action: "validate --strict; commit; push"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/shared/assets/template_rules.json"
      - ".opencode/commands/create/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 020-command-agent-template-conformance |
| **Completed** | 2026-07-07 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Made the sk-doc `/create` commands and the repo's agents "perfectly align" with the sk-doc templates — i.e. pass `validate_document.py` — via the operator-chosen hybrid.

- **Commands (sections side)** — all 10 `/create` routers gained a numbered `## 1. PURPOSE` section and had their headings numbered, with `Execution Order` renamed to `## N. INSTRUCTIONS`, so each satisfies the `command` type's `purpose`+`instructions` requirement. GPT-5.5-fast-high did the ten routers; body content (routing table, execution steps, `$ARGUMENTS`) is preserved.
- **Agents (rules side)** — fixed a detection bug so agent files under `/agents/` (plural) are typed `agent` instead of `readme`, and reconciled the `agent` rule: `requiredSections` became `["core_workflow"]` (the one section every agent carries) with the four aspirational sections moved to `recommendedSections`. Rewriting 24 agents to a five-section structure none used was infeasible, so the rule was aligned to the real house style.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `commands/create/*.md` (10 routers) | Modify | Numbered PURPOSE/INSTRUCTIONS (GPT-5.5) |
| `sk-doc/shared/scripts/validate_document.py` | Modify | Agent detection `/agent/`→`/agents/` |
| `sk-doc/shared/assets/template_rules.json` | Modify | `agent.requiredSections`→`["core_workflow"]`; ideals→recommended |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Split by risk. The shared-tool edits (validator detection + rule reconciliation) were hand-authored and surgical — a one-condition detection change and a required→recommended move in the pretty-printed rules JSON (no `json.dump` reformat). The ten routers were delegated to a GPT-5.5-fast-high agent per the operator's directive, each gated on `validate_document.py`, then verified deterministically: 10/10 VALID, asset paths + `$ARGUMENTS` + headers intact on all ten, uniform ~12-line diffs (PURPOSE + renumber only), and command-accurate purpose lines. The direction (commands adopt sections; agents fix the rules) was the operator's explicit choice after the mismatch — none of the 24 agents matched the five-section `agent` rule — was surfaced.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Hybrid: commands→sections, agents→rules | Operator choice; rewriting 24 agents to 5 sections none use is infeasible, so the agent rule aligns to reality |
| `agent.requiredSections` = `["core_workflow"]` | The genuine universal agent contract (24/24 carry it); the four ideals stay as recommended guidance |
| Numbered PURPOSE/INSTRUCTIONS on routers | The validator only recognizes numbered `## N.` sections; un-numbered fails |
| Fix the `/agents/` detection bug | Agents were mis-typed as `readme`; this is a genuine bug, not a file problem |
| Scope to sk-doc-related | Non-sk-doc commands share the gap but are other-skill-owned |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Routers valid | Pass | 10/10 `/create` routers VALID (numbered PURPOSE + INSTRUCTIONS) |
| Agents valid | Pass | 24/24 agents VALID as type `agent`; markdown.md x2 included |
| Body preserved | Pass | 10/10 asset paths + `$ARGUMENTS` + header intact; uniform ~12-line diffs |
| Purpose accuracy | Pass | Each router's PURPOSE names its correct output |
| Validator non-regression | Pass | `py_compile` OK; `template_rules.json` valid |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Non-sk-doc commands still fail** — commands under `doctor/`, `deep/`, `memory/`, and `prompt.md` share the same `command`-type gap but are owned by other skills; bringing them into conformance is a separate follow-up.
2. **Router-generation template** — the create-command packet should emit numbered PURPOSE/INSTRUCTIONS so future commands are born conformant; deferred.
3. **Agent rule relaxed** — `core_workflow` is now the only hard requirement; the richer structure lives in `recommendedSections` (advisory, non-blocking).

<!-- /ANCHOR:limitations -->
