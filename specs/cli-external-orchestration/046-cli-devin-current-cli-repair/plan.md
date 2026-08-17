---
title: "Implementation Plan: Repair cli-devin Fan-out Dispatch for the Current Devin CLI"
description: "Plan for the two-part cli-devin headless dispatch repair: workspace-trust flag and dropping the write-blocking --sandbox flag, verified by live reproduction."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/046-cli-devin-current-cli-repair"
    last_updated_at: "2026-08-17T12:45:34Z"
    last_updated_by: "claude"
    recent_action: "Plan authored"
    next_safe_action: "Execute the two argv changes and verify"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-046-cli-devin-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Repair cli-devin Fan-out Dispatch for the Current Devin CLI

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
`buildDevinLineageCommand` builds a synchronous, directly unit-testable devin argv. The current devin CLI (3000.4.25) added a workspace-trust gate and changed `--sandbox` so it forces autonomous mode that rejects writes non-interactively. The existing unit tests use a stub `devin` binary, so they never exercised real refusal — the bug only surfaces against the live CLI.

### Overview
Two minimal argv changes plus a comment correction: append `--respect-workspace-trust false` unconditionally, and stop appending `--sandbox` for the workspace-write case (falling back to the fan-out software write-containment guard for confinement). Prove both against the live devin CLI.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Root cause reproduced live (both the trust refusal and the `--sandbox` write rejection).
- Working invocation confirmed live (dangerous, no `--sandbox`, trust flag → file written).

### Definition of Done
- `fanout-run.vitest.ts` green with updated devin assertions.
- A real cli-devin lineage produces `research.md` (045 glm-devin re-run).
- `validate.sh <packet> --strict` exit 0.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter-command builder per executor kind; the devin builder maps a resolved sandbox mode to a permission flag set.

### Key Components
- `buildDevinLineageCommand` — the argv builder being repaired.
- Fan-out write-containment guard — snapshots out-of-scope dirty paths and reverts any a lineage changed; remains the confinement mechanism once `--sandbox` is dropped.

### Data Flow
Resolved sandbox mode → permission flags → (new) unconditional trust flag → `finalizeLineageCommand` → spawned devin subprocess.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Trust flag
Append `--respect-workspace-trust false` unconditionally in `buildDevinLineageCommand`; update the affected unit assertions.

### Phase 2: Sandbox drop
Stop passing `--sandbox` for workspace-write (use `--permission-mode dangerous` alone); rewrite the rationale comment to describe the current devin behavior and the guard-based confinement.

### Phase 3: Verification
Run `fanout-run.vitest.ts`; live-repro a devin write in a fresh dir; re-run the 045 glm-devin lineage and confirm `research.md`.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Unit: `fanout-run.vitest.ts` asserts the exact devin argv (trust flag present, `--sandbox` absent for every writable mode).
- Live negative control: real devin with `--sandbox` refuses the write.
- Live positive: real devin with `--permission-mode dangerous --respect-workspace-trust false` writes a file in a fresh dir.
- End-to-end: a real cli-devin research lineage produces `research.md`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Installed devin CLI (verified against 3000.4.25).
- The fan-out write-containment guard, which becomes the sole confinement once `--sandbox` is dropped.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Both changes are localized to `buildDevinLineageCommand` and its unit assertions. Revert the two argv edits and the test updates to restore the prior dispatch; no state migration or data change is involved.

<!-- /ANCHOR:rollback -->
