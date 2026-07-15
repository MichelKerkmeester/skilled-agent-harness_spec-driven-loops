---
title: "Implementation Summary: reconcile the deep-* agents to create-agent (bless-the-dialect)"
description: "Level 2 implementation summary — create-agent now documents the deep-loop leaf-iteration section dialect and its MCP-tool-scoped permission keys as sanctioned; the six agents are unchanged."
trigger_phrases:
  - "deep agent create-agent reconciliation"
  - "bless the deep-loop agent dialect"
  - "create-agent sanctioned section vocabulary"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/052-deep-loop-unification/012-deep-command-family-parity/003-deep-agent-family-reconciliation"
    last_updated_at: "2026-07-13T19:47:00Z"
    last_updated_by: "claude"
    recent_action: "Wired phase adjacency to successor 004; fingerprint refreshed"
    next_safe_action: "Roll up the 064 parent; hand off for operator review/merge"
    completion_pct: 100
---
# Implementation Summary: reconcile the deep-* agents to create-agent (bless-the-dialect)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-deep-agent-family-reconciliation |
| **Completed** | 2026-07-13 |
| **Level** | 2 |
| **Actual Effort** | ~70 minutes (estimated: 70 minutes) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `sk-doc/create-agent` authoring skill now documents the deep-loop leaf-iteration agents' lane-named section dialect as a first-class sanctioned shape, and sanctions their MCP-tool-scoped permission keys — mirroring how `create-command` sanctions its router variants. All six deep-* agent files are unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/create-agent/SKILL.md` | Modified | §3 "Sanctioned Section-Vocabulary Dialects" subsection naming the deep-loop dialect and stating only `## 1. CORE WORKFLOW` is validator-required |
| `.opencode/skills/sk-doc/create-agent/assets/agent_template.md` | Modified | §9 "Deep-Loop Iteration Agents" entry (full + lean section orders + real-file pointers); §2 MCP-tool-scoped permission-key sanction note |

### Files Deliberately Unchanged

| File set | Reason |
|----------|--------|
| `.opencode/agents/{deep-alignment,deep-review,deep-research}.md` + `.claude/agents/` mirrors | Bless-the-dialect: they already pass `--type agent` and are internally consistent; rewriting six large files would risk dropping HARD-BLOCK gates |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only discovery pass mapped the create-agent canonical skeleton, the exact six-agent dialect vocabulary (full shape for alignment/review; lean shape for research), and how `create-command` sanctions router variants (a named shape + a template enumeration + real-file pointers, backed by a validator that requires only the blocking core). The three additive prose edits reproduce that mechanism for agents, then the six agents were re-validated and the create-agent skill was re-packaged to confirm no regression.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Bless the dialect instead of rewriting the agents | The validator already accepts the dialect; rewriting six large files risks dropping HARD-BLOCK gates for no validation gain |
| Mirror create-command's variant mechanism | A named shape + template enumeration + real-file pointers is the established, consistent sanction pattern |
| Sanction the MCP permission keys guide-side, not in the agents | Documents `code_graph_*` / `detect_changes` without touching the already-valid agent frontmatter |
| Keep the six agents byte-unchanged | Preserves every HARD-BLOCK gate, contract, and adversarial-check section verbatim |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Agent conformance | Pass | All six deep-* agents | `validate_document.py --type agent` → `6 pass / 0 fail` |
| Skill packaging | Pass | create-agent | `package_skill.py --check` → `PASS`; 4 warnings all pre-existing |
| No-diff invariant | Pass | Six agent files | No `.opencode/agents` or `.claude/agents` file modified |
| Sanction mirror | Pass | create-agent vs create-command | Named shape + §9 enumeration + real-file pointers |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| create-agent docs | Covered by `--type agent` + `--check` | Covered by `--type agent` + `--check` | Covered by `--type agent` + `--check` |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | No runtime impact | Documentation-only change | Pass |
| NFR-S01 | Least-authority guidance preserved | Permission note says grant only the keys used | Pass |
| NFR-R01 | Agent validation status unchanged | Six agents pass before and after | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The sanction is descriptive, not enforced — the validator still accepts any extra section vocabulary. That is by design: the goal is documentation, not a new hard gate.
2. create-agent carries four pre-existing packaging-check warnings (missing INTEGRATION POINTS / RELATED RESOURCES sections, a smart-router marker, and a hyphenated reference filename) unrelated to this phase; the hyphenated filename is consistent with the active hyphen-naming convention direction and was deliberately not "fixed."

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Optional trivial parity touch on the six agents | Sanctioned the MCP permission keys guide-side instead | Keeps the already-valid agents byte-unchanged while still documenting `code_graph_*` / `detect_changes` |

<!-- /ANCHOR:deviations -->
