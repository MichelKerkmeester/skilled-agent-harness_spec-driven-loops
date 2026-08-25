---
title: "Feature Specification: Runtime Agent Gateway Alignment (leaves append through the gateway, not the projection)"
description: "Migrate the deep-loop leaf agent prompts across all six runtimes from a direct *-state.jsonl bash-append to the authoritative append gateway, so leaf iteration records match the post-flip ledger contract the 012 runtime-enablement work established and tested."
trigger_phrases:
  - "runtime agent gateway alignment"
  - "leaf agent direct append"
  - "deep-loop agent state jsonl bypass"
  - "append gateway agent prompt"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment"
    last_updated_at: "2026-08-25T07:26:58Z"
    last_updated_by: "claude"
    recent_action: "Scoped the leaf-agent gateway misalignment from the .agents audit"
    next_safe_action: "Establish the failing doc-guard, then migrate the .claude agents first"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Which modes are affected? research, review, alignment, ai-council (deep-improvement is proposal-only, out of scope)."
      - "What is the gateway command per mode? append-mode-event.cjs --mode {research|review|alignment|ai-council}."
---
# Feature Specification: Runtime Agent Gateway Alignment (leaves append through the gateway, not the projection)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-25 |
| **Branch** | `system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `012-runtime-enablement` work made the typed event ledger authoritative for all eight deep-loop modes and turned each `*-state.jsonl` into a **pure projection of the ledger**. The tested, shipped contract is that leaf agents record their iteration events **through the append gateway** (`append-mode-event.cjs`), which authorizes, fences, and receipts each write, then refreshes the projection from the ledger. A direct-append guard verifies nothing writes the projection file directly.

The leaf agent prompts were never migrated. Across all six runtimes, four of the five deep-loop agents still instruct the leaf to **bash-append its iteration record directly** to `*-state.jsonl` — the pre-flip model the current runtime explicitly forbids:

- `deep-research` agent: "one append-only iteration record to `research/deep-research-state.jsonl`" (no gateway mention).
- `deep-review` agent: "Append exactly one JSONL iteration record" (no gateway mention).
- `deep-alignment` agent: literal `printf '%s\n' '<json>' >> alignment/deep-alignment-state.jsonl`.
- `ai-council` agent: direct council-state writes (no gateway mention).

The authoritative sources say the opposite:

- `deep-research/references/state/state-jsonl.md` (v1.14.0.3): "Canonical records are written by calling the append gateway, not by writing to the file… writing to `deep-research-state.jsonl` directly bypasses all four of those properties… it is now a projection of the ledger rather than the place writes land."
- `012-runtime-enablement/002-deep-research-enablement/implementation-summary.md`: "Post-flip fan-out leaves write through the gateway; the legacy file is a pure projection the guard verifies," proven by `deep-research-postflip-fanout.vitest.ts` (all events read back from the ledger in order).
- Every deep-loop orchestrator YAML declares `state_write_protocol: mechanism: "append-gateway"` with "never fall back to a direct file write" and exactly three exempt lifecycle sites — the leaf iteration append is not one of them.

A leaf that follows its prompt literally writes the projection file directly. That write is unauthorized, unfenced, and unreceipted; it diverges the projection from the authoritative ledger and is exactly what the direct-append guard exists to catch.

### Purpose

Make every deep-loop leaf agent prompt record its iteration event through the append gateway, matching the runtime contract the orchestrator YAMLs already enforce — so a dispatched leaf produces a durable, authorized, receipted ledger record instead of a direct projection write, across all six runtimes.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Migrate the state-write instruction in the four affected leaf agent prompts — `deep-research`, `deep-review`, `deep-alignment`, `ai-council` — from a direct `*-state.jsonl` append to the append gateway (`append-mode-event.cjs --mode <mode> --run-directory <dir> --event-json <file>`).
- Apply the same migration across all six runtime agent directories: `.opencode/agents`, `.claude/agents`, `.cursor/agents`, `.pi/agents` (Markdown), `.codex/agents` (TOML), `.devin/agents` (extensionless).
- Reclassify `*-state.jsonl` in each agent's file-path tables from a write target to a read-only projection; keep every read reference intact.
- Update each agent's verification, anti-pattern, and summary sections so the proof is "gateway append returned exit 0 with a receipt" rather than "state.jsonl appended with exactly one record."
- Preserve gateway refusal semantics: exit 0 = durable; exit 2 = refused (halt, name the failed check); never fall back to a direct write.
- Prove the migration with a doc-level guard that fails before the change and passes after: no affected agent instructs a direct `*-state.jsonl` write, and each affected agent references the gateway command for its mode.

### Out of Scope

- `deep-improvement` agent — proposal-only; it writes one packet-local candidate and returns metadata, appending no iteration state. It is not affected.
- The model-benchmark and skill-benchmark lanes — they dispatch no second Claude leaf agent and append no leaf iteration state through an agent prompt.
- The append-gateway runtime itself (`append-mode-event.cjs`), the ledger, the projection contracts, and the reducer scripts — all shipped and tested under 012; unchanged here.
- The orchestrator command YAMLs — already declare and enforce the gateway; unchanged.
- The mode SKILL.md docs beyond the leaf agent prompts. `deep-research` SKILL.md already carries gateway language; review/alignment/council SKILLs are silent on the write mechanism (not contradictory), so they need no change to make the agent fix coherent. Adding gateway language to those SKILLs is noted as related follow-up, not this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/{deep-research,deep-review,deep-alignment,ai-council}.md` | Modify | Migrate the state-write instruction to the gateway; reclassify the projection file; update verification/anti-pattern/summary. |
| `.opencode/agents/{deep-research,deep-review,deep-alignment,ai-council}.md` | Modify | Same migration, opencode runtime. |
| `.cursor/agents/{deep-research,deep-review,deep-alignment,ai-council}.md` | Modify | Same migration, cursor runtime. |
| `.pi/agents/{deep-research,deep-review,deep-alignment,ai-council}.md` | Modify | Same migration, pi runtime. |
| `.codex/agents/{deep-research,deep-review,deep-alignment,ai-council}.toml` | Modify | Same migration, codex runtime (TOML embedded prompt). |
| `.devin/agents/{deep-research,deep-review,deep-alignment,ai-council}` | Modify | Same migration, devin runtime (extensionless). |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The misalignment fails a doc-level guard before the fix | A grep-based check reports each affected agent instructing a direct `*-state.jsonl` write and lacking a gateway reference; the check exits non-zero (negative control observed). |
| REQ-002 | Every affected agent records its iteration through the gateway | Each `deep-research`/`deep-review`/`deep-alignment`/`ai-council` agent, in all six runtimes, instructs `append-mode-event.cjs --mode <mode>` for the iteration record and states "never write `*-state.jsonl` directly." |
| REQ-003 | The projection file is read-only in the agent's path tables | Each affected agent's file-path table marks `*-state.jsonl` as a read-only projection, and no residual "append/bash-append/write" verb targets it. |
| REQ-004 | Gateway refusal semantics are preserved | Each affected agent states exit 0 = durable and exit 2 = refused-halt, with no direct-write fallback. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cross-runtime parity | The same semantic migration is present in all six runtimes for all four agents; a per-runtime guard pass confirms zero stragglers. |
| REQ-006 | No collateral scope change | `git diff` touches only the 24 agent files plus this spec folder; no runtime code, YAML, or SKILL.md is modified. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The doc-level guard fails before the change and passes after, for all 24 files.
- **SC-002**: No affected agent, in any runtime, instructs a direct `*-state.jsonl` append for its iteration record.
- **SC-003**: Each affected agent references its mode's gateway command and the exit-0/exit-2 contract.
- **SC-004**: `validate.sh <spec-folder> --strict` exits clean, and the scoped diff contains only the 24 agent files and the spec folder.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-editing a read reference as if it were a write | Breaks the agent's read path or verification logic | Change only write-verb instructions; keep every read/path reference; diff each file. |
| Risk | Cross-runtime drift — one runtime left stale | A leaf in that runtime still bypasses the gateway | Run the guard per runtime; require zero stragglers before completion. |
| Risk | TOML/extensionless variants have different escaping | A malformed prompt block | Edit the embedded prompt text in place; re-read after edit; validate the file parses. |
| Decision | Does the leaf call the gateway itself, or only write a delta the pool forwards? | Wrong instruction shape | Resolved in `decision-record.md`: the leaf calls `append-mode-event.cjs`, matching `deep-research` SKILL.md and the orchestrator protocol. |
| Dependency | `append-mode-event.cjs` gateway | The command every agent will now name | Shipped and tested under 012; unchanged here. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. The per-mode `--mode` values and the gateway command are pinned from the orchestrator YAMLs; the leaf-calls-the-gateway decision is settled in `decision-record.md`.

<!-- /ANCHOR:questions -->
