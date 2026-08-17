---
title: "Implementation Summary: Repair cli-devin Fan-out Dispatch for the Current Devin CLI"
description: "Two-part cli-devin headless dispatch repair (workspace-trust flag + dropping the write-blocking --sandbox) landed and verified by live reproduction; end-to-end lineage proof via the 045 glm-devin re-run."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/046-cli-devin-current-cli-repair"
    last_updated_at: "2026-08-17T12:45:34Z"
    last_updated_by: "claude"
    recent_action: "Fix verified end-to-end; glm-devin lineage produced research.md"
    next_safe_action: "Closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-046-cli-devin-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Summary: Repair cli-devin Fan-out Dispatch for the Current Devin CLI

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Status** | Complete |
| **Branch** | `skilled/v4.0.0.0` |
| **Completed** | 2026-08-17 (code + unit + live repro) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Repaired `buildDevinLineageCommand` so cli-devin fan-out lineages work against the installed devin CLI (3000.4.25), which had two independent non-interactive blockers.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Append `--respect-workspace-trust false` unconditionally; drop `--sandbox` for workspace-write (collapse it into the `--permission-mode dangerous` branch); rewrite the rationale comment to the current devin behavior |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Devin arg assertions expect the trust flag and no `--sandbox`; workspace-write test asserts `not.toContain('--sandbox')`; titles corrected |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root cause was reproduced live before any code change (both the workspace-trust refusal and the `--sandbox` write rejection), then the two argv changes were made in `buildDevinLineageCommand`, the affected unit assertions were updated in the same pass, and the fix was proven by a live devin write in a fresh directory plus a real research lineage re-run.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Trust flag is unconditional.** Print mode cannot answer the workspace-trust prompt the current devin CLI shows in untrusted dirs, and lineages always dispatch into fresh dirs.
- **Drop `--sandbox` for write-lineages.** Live testing showed the current devin CLI's `--sandbox` forces an "autonomous" mode that ignores `--permission-mode dangerous` and rejects every write in non-interactive mode. Writes only succeed with `--permission-mode dangerous` alone. Confinement therefore falls to the fan-out software write-containment guard rather than an OS sandbox — an operator-approved trade-off.
- **Left the model allowlist untouched.** The Aug-12 upstream repair also reconciled the model list, but this branch already carries the current roster; only the argv behavior was missing here.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Unit**: `fanout-run.vitest.ts` — 104/104 pass with the updated devin assertions.
- **Live repro (negative control)**: real devin in a fresh dir with `--sandbox` → rejects the write, no file produced.
- **Live repro (positive)**: real devin in a fresh dir with `--permission-mode dangerous --respect-workspace-trust false` (no `--sandbox`) → "Done. Created proof.txt", file present, exit 0.
- **End-to-end (confirmed)**: the 045 `glm-devin` lineage ran 5/5 iterations through the fixed dispatch and produced `research.md` + emitted `FANOUT_LINEAGE_COMPLETE` — a real cli-devin lineage now writes its artifact (SC-001 met).

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- devin write-lineages now run unconfined at the OS level; the fan-out write-containment guard is the sole confinement, reverting any out-of-scope path a lineage touches.
- A separate, pre-existing interaction remains: a session-lifecycle hook can regenerate `.opencode/bin/git-*.sh` inside a long-running lineage, which the write-containment guard reverts and treats as a fatal escape (observed on the cursor/grok lineage). That is out of scope for this devin-dispatch repair and tracked as a follow-up.

<!-- /ANCHOR:limitations -->
