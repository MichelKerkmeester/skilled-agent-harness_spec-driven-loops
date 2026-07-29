---
title: "Feature Specification: deep-loop executor/provider/model matrix audit"
description: "Freeze the authoritative support matrix for the deep-loop fan-out: for every executor kind (native, cli-codex, cli-claude-code, cli-opencode, cli-cursor, cli-devin, cli-pi), map what the executor config advertises against the real fan-out lineage builder and the CLI's actual headless contract, across every provider, model, and deep mode. Produce a gap register that gives every gap a disposition (wire, enforce-scope-out, or accept). The audit is read-only; it changes no runtime code."
trigger_phrases:
  - "deep-loop executor matrix audit"
  - "cli provider model support matrix"
  - "fanout executor gap register"
  - "which cli models work in the fanout"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/043-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/043-cli-executor-fanout-parity/001-executor-matrix-audit"
    last_updated_at: "2026-07-29T09:22:00Z"
    last_updated_by: "claude"
    recent_action: "Seeded the audit with the initial read-only executor wiring findings"
    next_safe_action: "Complete the matrix across every provider model and deep mode then freeze the gap register"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    completion_pct: 30
    open_questions:
      - "Do codex/claude-code/opencode need enforced allowlists, or is pass-through validation acceptable?"
    answered_questions:
      - "cli-pi buildPiLineageCommand is a hard stub that throws"
      - "codex/claude-code/opencode are pass-through; pi/cursor/devin enforce allowlists"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Deep-loop Executor / Provider / Model Matrix Audit

> Phase adjacency under the `043-cli-executor-fanout-parity` parent (grouping order, not a runtime dependency): predecessor: none (first phase); successor `002-cli-pi-fanout-wiring`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/043-cli-executor-fanout-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The fan-out advertises seven executor kinds, but no single document states which (cli, provider, model, mode) combinations
actually dispatch end-to-end. Without that authoritative matrix, "fan-out works for every combo" cannot be verified or maintained,
and gaps like the cli-pi stub stay invisible until a dispatch throws at run time.

### Purpose
Produce the authoritative support matrix and a gap register with a disposition for every gap, so the wiring phases (002-004) and
the combination test (005) have a frozen source of truth. Read-only: no runtime code changes in this phase.

### Non-Goals
- Fixing any gap (that is 002-004).
- Running credentialed provider dispatches (that is 005's combo test).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `executor-config.ts`: `EXECUTOR_KINDS`, flag-support per kind, model rosters/allowlists, defaults.
- `fanout-run.cjs`: the lineage builder for each kind and whether it constructs a real command or throws.
- Each CLI's headless contract (from its cli-X SKILL.md / cli-reference and live `--help`).
- Per-mode executor availability across the deep auto-YAMLs and mode contracts.

### Out of Scope
- Any code change; this phase only reads and records.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** — For each of the seven executor kinds, record: in `EXECUTOR_KINDS` (y/n), lineage builder state (real / stub-throws / missing), model validation (pass-through / allowlist + the list), flag support, and any exec/permission caveat.
- **R2** — For each kind, enumerate every provider and model it claims and mark each combination reachable / unreachable / unknown-pending-credentials.
- **R3** — For each deep mode, record which executor kinds it exposes and whether that matches documented intent.
- **R4** — Every gap gets a disposition: **wire** (phase 002-004), **enforce-scope-out** (make the limitation explicit and enforced), or **accept** (documented boundary with a reason).
- **R5** — The audit is evidence-backed: every row cites the file:line or the live `--help` capture it came from.

### Initial findings (seed — to be completed and frozen)

| CLI | In KINDS | Builder | Model validation | Reasoning/tier | Caveat |
|---|---|---|---|---|---|
| native | y | real | n/a | n/a | — |
| cli-codex | y | real | pass-through | reasoningEffort + serviceTier | — |
| cli-opencode | y | real | pass-through | reasoningEffort | — |
| cli-claude-code | y | real | pass-through | reasoningEffort | end-to-end unproven |
| cli-cursor | y | real | allowlist (grok-4.5 ×6, composer-2.5 ×2) | none (in model id) | sandbox runs npm |
| cli-devin | y | real | allowlist (adaptive/opus/sonnet/glm-5-2/swe…) | none (in model id) | accept-edits auto-denies exec |
| cli-pi | y | **stub-throws** (`fanout-run.cjs:1832`) | allowlist (luna/sol/terra/deepseek/minimax/mimo) | flag table lacks reasoningEffort (pi has `--thinking`) | not reachable via fan-out |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The matrix covers all seven kinds × their claimed providers/models × the deep modes, each row evidence-cited.
2. Every gap carries a disposition (wire / enforce-scope-out / accept).
3. The gap register is frozen and referenced by phases 002-005.
4. `validate.sh --strict` passes for this phase; no runtime code was changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Stale surface** — the config/builders move under concurrent executor packets (041/042); audit against the current origin tip and timestamp the capture.
- **Dependency** — each cli-X SKILL.md and its cli-reference for the CLI's real headless contract.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do codex/claude-code/opencode need enforced allowlists, or is pass-through validation an accepted boundary?
- Should the matrix's "reachable" require a live credentialed dispatch, or is verified command construction sufficient at audit time?
<!-- /ANCHOR:questions -->
