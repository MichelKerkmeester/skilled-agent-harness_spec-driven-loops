---
title: "Feature Specification: combo test matrix + ambient-config isolation"
description: "Prove the deep-loop fan-out works for every cli/provider/model/mode combination end-to-end, logging every credentials-gated skip (never silent), and close the cross-cutting ambient-config isolation boundary that phases 003-004 tracked here: read-only executor leaves and seats must not be able to write via ambient config (cursor hooks, devin config, pi auto-loaded extensions, unapproved MCP). The pi extension-lifecycle vector is closed first."
trigger_phrases:
  - "combo test matrix executor parity"
  - "ambient-config isolation read-only leaf"
  - "pi no-extensions read-only hardening"
  - "log every credentials-gated skip"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/005-combo-test-matrix"
    last_updated_at: "2026-07-29T15:40:00Z"
    last_updated_by: "claude"
    recent_action: "Hardened read-only pi to disable auto-loaded extensions and skills"
    next_safe_action: "Build the combo coverage matrix and the cursor/devin/MCP isolation"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
    completion_pct: 25
    open_questions: []
    answered_questions:
      - "read-only pi never invokes skills, so --no-extensions/--no-skills/--no-prompt-templates is behavior-preserving"
      - "the ambient-config boundary is the same one 003-004 tracked; pi is the one live-substantive residual"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Combo Test Matrix + Ambient-Config Isolation

> Phase adjacency under the `043-cli-executor-fanout-parity` parent (grouping order, not a runtime dependency): predecessor `004-per-mode-executor-parity`; successor `006-docs-closeout`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-29 |
| **Branch** | `system-deep-loop/0125-043-cli-parity` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/003-cli-executor-fanout-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two things remain to close the fan-out parity packet. First, no single test exercises every (executor kind × provider/model × mode) combination end-to-end, so parity is proven per-phase but not as a whole — and credentials-gated combinations must be logged, never silently skipped. Second, the SOL reviews of phases 003 and 004 surfaced a cross-cutting ambient-config isolation boundary that was verified non-reproducing today but not hard-closed: a read-only executor leaf or seat runs in the repo cwd and inherits ambient config (cursor `.cursor/hooks.json`, devin config allow-rules, pi auto-loaded `.pi/` extensions/skills, unapproved MCP), whose lifecycle code could write or hang independent of the read-only tool flags.

### Purpose
Assemble the end-to-end combo coverage matrix (log every skip) and close the ambient-config isolation so a read-only invocation cannot write via ambient config. The pi extension-lifecycle vector — the one live-substantive residual (pi auto-loads `.pi/` and supports `--no-extensions`/`--no-skills`/`--no-prompt-templates`) — is closed first.

### Non-Goals
- Live credentialed dispatch of every provider/model (logged as skips where credentials are absent).
- Rearchitecting skill-benchmark's observation model (its exemption is by design, phase 004).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Leaf 1 — pi extension isolation (built):** read-only pi adds `--no-extensions --no-skills --no-prompt-templates` in the shared builder, so no write-capable extension/skill/template lifecycle loads for a read-only leaf or seat.
- **Leaf 2 — combo coverage matrix:** a test that iterates every (kind × allowlisted model × mode) and asserts command construction succeeds (or logs an explicit skip with a reason), never silent.
- **Leaf 3 — cursor/devin/MCP isolation:** neutralize repo hooks and unapproved MCP for read-only cursor/pi leaves and isolate devin config, so a read-only invocation is hermetic against ambient config.

### Out of Scope
- Phases 001-004 (complete); docs closeout (006).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (pi isolation)** — A read-only pi command disables auto-loaded extensions, skills, and prompt templates; the flags are pi-valid and behavior-preserving (read-only pi does text analysis with read-only file tools and never invokes skills).
- **R2 (no regression)** — The pi flag additions do not change any other executor kind or the workspace-write/full-access pi paths; the exact-arg tests across the fan-out, model-benchmark, and ai-council suites lock the new read-only pi vector.
- **R3 (combo coverage)** — The coverage matrix enumerates every kind × model × mode and records reachable / constructed / skipped-with-reason; no combination is silently omitted.
- **R4 (ambient-config isolation)** — A read-only cursor/devin/pi leaf or seat cannot write via ambient config; unapproved MCP cannot hang it.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Read-only pi emits `--no-extensions --no-skills --no-prompt-templates`; live pi accepts them and writes nothing.
2. fan-out (93), model-benchmark, and ai-council suites pass; whole-runtime tsc is 0.
3. The combo coverage matrix asserts construction for every combination and logs every skip.
4. Read-only leaves/seats are verified hermetic against ambient config (hooks, config, extensions, MCP).
5. `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-builder blast radius** — the pi flag change touches `fanout-run.cjs`, used by every mode; the exact-arg tests across three suites gate it.
- **Credentials-gated combos** — most provider/model combinations cannot be dispatched live without credentials; the matrix logs each as an explicit skip, never a silent pass.
- **Cursor/devin/MCP isolation mechanism** — cursor reads `.cursor/` from cwd and has no `--no-hooks` flag; isolation likely needs a neutral config/workspace approach, validated not to break legitimate read access.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved: the isolation mechanism is `--workspace <neutral-empty-dir> --add-dir <working-dir>` for read-only cursor — live-verified to load no repo hooks/MCP while preserving reads, builder-only (no shared-spawn change), fingerprint-stable.
<!-- /ANCHOR:questions -->
