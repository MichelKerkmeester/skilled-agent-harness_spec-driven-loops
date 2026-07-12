---
title: "Implementation Plan: Phase 12: behavior-benchmark-capture"
description: "How the deep-alignment DAB baseline was captured: register the mode in the shared framework, provision and snake-normalize the fixture, run the serial 11-cell claude-cli capture, adjudicate labels with three GPT skeptic passes, and apply the minimal additive resolver P0 fix the first smoke uncovered."
trigger_phrases:
  - "deep-alignment benchmark capture plan"
  - "DAB capture approach"
  - "resolver P0 fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/012-behavior-benchmark-capture"
    last_updated_at: "2026-07-12T14:40:00Z"
    last_updated_by: "claude"
    recent_action: "Documented the capture approach and the resolver fix"
    next_safe_action: "Operator sign-off on the resolver commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs"
      - ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-behavior-benchmark-capture"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
status: "complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: behavior-benchmark-capture

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
The DAB scenarios and an all-pending `claude-baseline.md` already existed; the runner (`behavior-bench-run.cjs`) is mode-agnostic and reads `contract.mode`. The capture leg is `claude-cli` (`claude -p --output-format stream-json …`), which the runner spawns per scenario with per-cell budget/watchdog and before/after isolation snapshots. The mode's workflow resolves its artifact root through the shared `review-research-paths.cjs` (re-exported by `runtime/lib/deep-loop/artifact-root.cjs`).

### Overview
Register the mode in the shared framework, provision and snake-normalize the fixture, capture the 11 cells serially (each writes into `<fixture>/alignment`, so parallel runs would collide), adjudicate the auto-classifications with independent GPT skeptic passes, and populate the baseline. Fix the resolver P0 the first smoke exposed, verifying research/review are untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- Fixture resolves via `scoping.cjs` for all three lane-configs (exit 0).
- The sk-doc adapter's `discover`/`check` run against the fixture without exit 2 (bug #1 restored).
- The runner's own test suite passes after the framework registration.

### Definition of Done
- 11/11 cells captured with real checkpoints; `claude-baseline.md` no longer all-pending.
- Resolver fix resolves `alignment` and leaves `research`/`review` byte-identical; GPT fix-verify GO.
- Classifications three-pass skeptic-verified; disputes recorded honestly.
- `validate.sh --strict` clean on this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Author+verify across models: the claude-cli leg captures behavior; independent `gpt-5.6-sol-fast` passes adjudicate the labels and audit the fix. Deterministic mechanics (fixture rename, registry edits, runner) stay in direct tool calls.

### Key Components
- `behavior-bench-run.cjs` — spawns each leg, classifies, writes `result.json`.
- `review-research-paths.cjs` — shared artifact-root resolver; the P0 fix site.
- `fx_001_alignment_target` — the frozen fixture; the audit target.
- `claude-baseline.md` — the populated baseline of record.

### Data Flow
scenario contract → runner spawns `claude -p` → mode resolves artifact root (`resolveArtifactRoot(target,'alignment')`) → LEAF dispatch + per-lane check → `<fixture>/alignment` artifacts → runner classification → `result.json` → baseline population → GPT skeptic adjudication.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- **Shared resolver** (`review-research-paths.cjs`, re-exported by `artifact-root.cjs`): the two added `alignment` keys are read by the alignment workflow and the mode's scripts; `research`/`review` are unaffected (verified byte-identical).
- **Shared framework** (`framework.md`): additive registration; existing modes unchanged.
- **Fixture tree** (untracked): provisioning + rename is self-contained; no runtime code depends on it beyond the DAB scenarios.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Register `alignment`/`DAB` in `framework.md`; run the runner test suite; build + snake-normalize the fixture; verify `scoping.cjs` + sk-doc adapter resolve it.

### Phase 2: Core Implementation
Smoke DAB-001 → it crashes at step 1 → root-cause + apply the additive resolver fix → re-smoke to PASS → drive the serial 11-cell capture (clean `<fixture>/alignment` between cells).

### Phase 3: Verification
Three GPT skeptic passes adjudicate the 11 classifications; GPT fix-verify + wiring-audit on the resolver change; populate `claude-baseline.md`; `validate.sh --strict` on this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
- Runner unit suite green after framework registration.
- Deterministic fixture resolution (scoping exit 0, sk-doc `check` detects the seeded P0).
- Resolver regression: `resolveArtifactRoot` for `review`/`research` byte-identical pre/post fix.
- Behavioral: 11 real captures + three-pass GPT adjudication.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `shared/behavior-benchmark/framework.md` + `behavior-bench-run.cjs`.
- `review-research-paths.cjs` (resolver) + `artifact-root.cjs` (re-export shim).
- `cli-opencode` → `openai/gpt-5.6-sol-fast` for the skeptic/audit passes.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
The resolver fix is two additive keys + a JSDoc union; reverting them restores the exact prior file. The fixture, baseline, and packet are additive/untracked — removable without affecting the mode. No commit or push was made, so rollback is a working-tree revert only.
<!-- /ANCHOR:rollback -->
