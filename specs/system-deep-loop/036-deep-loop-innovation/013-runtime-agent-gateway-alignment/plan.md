---
title: "Implementation Plan: Runtime Agent Gateway Alignment"
description: "Approach for migrating the four affected deep-loop leaf agent prompts across six runtimes from a direct *-state.jsonl append to the authoritative append gateway."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment"
    last_updated_at: "2026-08-25T07:26:58Z"
    last_updated_by: "claude"
    recent_action: "Authored the plan: guard-first, canonical .claude edits, then cross-runtime mirror"
    next_safe_action: "Hold for the operator's commit/push instruction"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Runtime Agent Gateway Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The deep-loop runtime routes every workflow JSONL append through the append gateway (`append-mode-event.cjs`), which authorizes the write against the mode's durable authority, fences it behind the ledger, returns a receipt, and refreshes the `*-state.jsonl` projection. Exit 0 = durable; exit 2 = refused. The orchestrator YAMLs enforce this for all modes. Four leaf agent prompts — `deep-research`, `deep-review`, `deep-alignment`, `ai-council` — still carry the pre-flip instruction to bash-append their iteration record directly to `*-state.jsonl`. `deep-improvement` is proposal-only and appends no iteration state.

### Overview

Guard-first. Write a doc-level check that fails while any affected agent instructs a direct write or lacks the gateway reference. Fix the `.claude/agents` files first as the canonical version, then mirror the identical semantic change to the other five runtimes. Re-run the guard to green, validate the spec folder, and confirm the diff touches only the agent files plus this packet.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The authoritative contract is confirmed (state-jsonl.md, orchestrator YAML, 012 enablement summary).
- The per-mode `--mode` values are pinned from the orchestrator YAMLs.
- The doc-level guard exists and fails on the current tree (negative control observed).

### Definition of Done

- The guard passes (exit 0) across all six runtimes for all four agents.
- No affected agent instructs a direct `*-state.jsonl` write; each names its mode's gateway command and the exit-0/exit-2 contract.
- The scoped diff is agent files plus this spec folder only — no runtime code, YAML, or SKILL.md.
- `validate.sh <spec-folder> --strict` exits clean.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Prompt-contract migration, gated by a deterministic doc-level check. The runtime already enforces the gateway; only the leaf prompts lag, so the change is confined to the agent files and proven by grep rules rather than a runtime test.

### Key Components

- **The guard** (`scripts/check-agent-gateway.sh`) — fails a file that omits the gateway reference (A), keeps a raw `>> *-state.jsonl` redirect (B), carries residual direct-write prose (C), or points `--event-json` at a multi-line delta/state file (D). Resolves `.md`, `.toml`, and `.devin/**/AGENT.md`, follows symlinks.
- **Per-mode gateway command** — `append-mode-event.cjs --mode {research|review|alignment|ai-council} --run-directory <dir> --event-json <record file>`.

### Data Flow

Leaf builds the single canonical iteration record → hands it to the gateway (`--event-json <record file>`) → gateway authorizes/fences/receipts and writes the ledger → gateway refreshes the read-only `*-state.jsonl` projection. The multi-line `deltas/iter-NNN.jsonl` stays a separate reducer artifact.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Author the doc-level guard; run it; observe the negative control (fails on all 24).

### Phase 2: Implementation

Migrate the four `.claude/agents` files as the canonical pattern, then mirror the identical semantic edit into `.opencode`, `.pi`, and `.codex` (cursor + devin follow via symlink).

### Phase 3: Verification

Guard all 24 green (rules A–D); confirm TOML integrity; scoped-diff check; `validate.sh --strict`; no-stray sweep.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The guard is the test. Its negative control (all 24 failing) proves it detects the defect; the green run (0 failing) proves the fix. Rule D specifically catches the `--event-json` single-record contract. TOML files are additionally checked for balanced `'''` delimiters. The authoritative gate is `validate.sh --strict`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `append-mode-event.cjs` — the gateway every agent will name. Shipped and tested under 012; unchanged here.
- The orchestrator YAMLs — the source of truth for each mode's `--mode` value. Read-only reference.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Prompt-only and fully reversible: `git checkout HEAD -- <agent files>` restores the pre-flip prompts. No runtime code, state, or ledger is touched, so there is no data migration to undo. The change alters what a dispatched leaf is told to do; reverting the prompt reverts the behavior on the next dispatch.

<!-- /ANCHOR:rollback -->
