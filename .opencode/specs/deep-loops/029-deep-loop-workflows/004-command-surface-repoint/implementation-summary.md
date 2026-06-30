---
title: "Implementation Summary: Command surface repoint"
description: "Phase 004: repointed the eight /deep:* commands plus their YAML workflow assets and presentation contracts to the merged deep-loop-workflows packet paths and skill keys, keeping command/agent names stable and leaving every deep-loop-runtime path frozen. Shipped as part of the deep-loop merge; per-phase checklist was not independently gate-run."
trigger_phrases:
  - "deep-loop-workflows phase 004 summary"
  - "command surface repoint shipped"
  - "deep command yaml skill path rewrite done"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/029-deep-loop-workflows/004-command-surface-repoint"
    last_updated_at: "2026-06-16T07:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wrote phase 004 impl-summary from spec/plan/tasks/checklist evidence"
    next_safe_action: "Reconcile per-phase checklist evidence if a standalone gate run is required"
    blockers: []
    key_files:
      - ".opencode/commands/deep/"
      - ".opencode/commands/deep/assets/"
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-004-impl-summary-remediation-156"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Per-phase checklist was not fully gate-run; the phase shipped inside the deep-loop merge"
---
# Implementation Summary: Command surface repoint

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 004 of 009 |
| **Status** | Shipped (as part of the deep-loop merge) |
| **Date** | 2026-06-15 |
| **Depends on** | phase 003 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `/deep` command surface repointed off the five old skill paths onto the merged `deep-loop-workflows` packet — command and agent names stayed stable, only skill references moved:

- **Eight `/deep:*` command routers** repointed where they referenced old skill IDs or old skill paths: context, research, review, ai-council, plus the improvement Lane A/B YAML-backed commands (agent-improvement, model-benchmark) and the Lane C/D markdown-only commands (skill-benchmark, non-dev-ai-system).
- **Twelve YAML workflow assets** moved to `deep-loop-workflows` plus registry-backed mode discrimination — `skill:`/`skill_md:` keys and the nested `references`/`scripts`/`assets` path blocks rewritten to the new packet paths, with mode-specific paths landing under `deep-loop-workflows/{mode}/`.
- **Six presentation contracts** had their stale old skill package paths removed without changing rendered behavior.
- The **five per-mode required-input setup schemas** and the **do-not-transfer-sibling-defaults guardrails** were carried verbatim, and **Lane C/D stayed markdown-only** — no YAML was added for symmetry.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The repoint ran as a gated phase in the deep-loop merge pipeline, against a single registry-sourced rewrite manifest frozen from `mode-registry.json`: old skill IDs become `deep-loop-workflows`, mode-specific paths move under `deep-loop-workflows/{mode}/`, command and agent names remain stable, and every `deep-loop-runtime/` path is left frozen. Work parallelized by disjoint command strata (one stratum per mode plus split improvement lanes), then a serial integration grep and scope-guard pass confirmed no stale `.opencode/skills/deep-{research,review,context,ai-council,improvement}` paths or `skill: deep-*` keys remained under `.opencode/commands/deep`. Read-only analysis and parity capture ran on `gpt-5.5-fast`; the file edits ran on `opus-4.8`; the orchestrator reduced and validated. The merge built in the `dlw-build` worktree alongside phase 003, keeping the five old skill directories live so each stratum stayed independently revertible.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Command surface stays stable** — only skill package references change; the eight command names and the agent names they dispatch are untouched, so the repoint is a structure/docs reorg rather than a behavior change.
- **Lane C/D keep their markdown wrapper contracts** — no YAML is added for symmetry, because those two commands invoke the loop-host directly.
- **`deep-loop-runtime` is frozen** — the rewrite rule leaves every `deep-loop-runtime/` path untouched (including the ai-council body-level `--loop-type council` reference), and the backend stays MCP-free.
- The rewrite is driven by a single deterministic, registry-backed manifest rather than ad-hoc edits, so the ~270 skill-path occurrences are bounded by one rule.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- The phase shipped as part of the deep-loop merge, which is functionally validated at the runtime level by the **351 `deep-loop-runtime` tests** and the **packet-156 review** covering the merged surface.
- The merge keystone holds at the command boundary: no residual stale old-skill paths or `skill: deep-*` keys under `.opencode/commands/deep`, and `deep-loop-runtime` references unchanged.
- **The per-phase checklist was not fully gate-run** — `checklist.md` records 0/16 P0, 0/6 P1, and 0/2 P2 verified ("pending execution"), so the phase-001 byte-identical command parity harness and `validate.sh --strict` on this folder were not independently executed and evidenced at the per-phase level. Completion confidence rests on the merge-level test suite and the packet-156 review rather than this phase's own recorded checklist.
- Structural validation of this spec folder (`validate.sh --strict`) passes after this summary was authored.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The per-phase verification checklist was never marked off item-by-item; its parity-harness and grep evidence rows remain "pending execution" even though the work shipped. A standalone gate run would be needed to convert merge-level confidence into per-phase recorded evidence.
- Byte-identical command parity against the phase-001 baseline was the stated success gate but is not separately evidenced in this packet; functional coverage comes from the merge-level suite instead.
- The advisor graph and the agent bodies were out of scope here — agent bodies were repointed in phase 005 and the advisor edges in phase 006; the old skills remained live until phase 009.

<!-- /ANCHOR:limitations -->
