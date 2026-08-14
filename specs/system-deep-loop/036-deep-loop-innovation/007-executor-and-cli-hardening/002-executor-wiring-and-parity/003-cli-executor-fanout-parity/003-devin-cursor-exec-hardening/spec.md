---
title: "Feature Specification: devin + cursor fan-out exec hardening"
description: "The devin and cursor fan-out lineage builders mapped sandbox modes to permission flags that live CLI testing proved wrong: devin's --sandbox forces autonomous mode and ignores --permission-mode (so a read-only leaf could write and the accept-edits workspace-write never actually stalled), and cursor's read-only --sandbox enabled both left writes possible and was blocked by cursor's untrusted-directory gate because no trust flag was passed. This phase re-maps both builders from live-verified CLI behavior so read-only leaves are genuinely read-only, workspace-write leaves never stall and stay write-confined, and every non-interactive leaf clears its runtime's trust gate."
trigger_phrases:
  - "devin cursor exec hardening"
  - "fanout read-only containment devin cursor"
  - "cursor trust gate mode plan fanout"
  - "devin sandbox ignores permission-mode"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity/003-devin-cursor-exec-hardening"
    last_updated_at: "2026-07-29T11:40:00Z"
    last_updated_by: "claude"
    recent_action: "Re-mapped devin and cursor builders from live CLI behavior"
    next_safe_action: "Fold in SOL findings, land, then per-mode executor parity (004)"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts"
    completion_pct: 90
    open_questions:
      - "How to isolate cursor ambient repo config (write-capable hooks + unapproved MCP) for fan-out leaves; deferred to combo-matrix phase"
    answered_questions:
      - "devin --sandbox forces autonomous mode and ignores --permission-mode; read-only must drop --sandbox"
      - "cursor -p is trust-gated in untrusted dirs; read-only + workspace-write must pass --trust"
      - "cursor --mode plan is genuine read-only (reads allowed, edits/shell blocked)"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: devin + cursor Fan-out Exec Hardening

> Phase adjacency under the `043-cli-executor-fanout-parity` parent (grouping order, not a runtime dependency): predecessor `002-cli-pi-fanout-wiring`; successor `004-per-mode-executor-parity`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-29 |
| **Branch** | `system-deep-loop/0125-043-cli-parity` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation/002-executor-wiring-and-parity/003-cli-executor-fanout-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The devin and cursor fan-out lineage builders mapped the generic sandbox modes (`read-only`, `workspace-write`, `danger-full-access`) to CLI flags that live testing of the installed binaries proved incorrect:

- **devin (3000.2.17):** `--sandbox` forces the "autonomous" permission mode and IGNORES `--permission-mode` (devin prints a warning saying so). The builder never grants explicit `Read(...)`/`Write(...)` scopes (devin only accepts those via `--agent-config`), so the sandbox defaults to a writable working directory. The result: the read-only branch (`auto --sandbox`) let a read-only leaf write a file, and the workspace-write branch's premise (`accept-edits` would stall on exec) was false because `--sandbox` overrode the permission mode entirely.
- **cursor (2026.07.23):** in `-p` (non-interactive) mode cursor-agent has access to all tools (write + shell) and, in an untrusted directory, refuses to run any tool unless a trust flag is passed. The read-only (`--sandbox enabled`) and workspace-write (`--auto-review --sandbox enabled`) branches passed no trust flag, so a leaf in a fresh worktree did nothing. Separately, `--sandbox enabled` confines processes but still permits cwd writes, so it did not make a read-only leaf read-only.

### Purpose
Re-map both builders from live-verified CLI behavior so that, for every sandbox mode: a read-only leaf is genuinely read-only (reads work, writes and shell-exec are blocked), a workspace-write leaf never stalls on a permission or trust prompt and keeps writes confined to the working directory, and a full-access leaf runs unconfined — making devin and cursor reliable fan-out executors for phase 004's per-mode wiring.

### Non-Goals
- Wiring devin/cursor into any deep mode's auto-YAML (that is phase 004).
- Granting devin OS-level Read/Write scopes via a generated `--agent-config` (a heavier, unproven mechanism; the chosen read-only path needs none).
- Expanding either model allowlist.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `buildDevinLineageCommand`: read-only → `--permission-mode auto` (no `--sandbox`); workspace-write → `--permission-mode dangerous --sandbox`; danger-full-access → `--permission-mode dangerous` (unchanged).
- `buildCursorLineageCommand`: read-only → `--mode plan --trust`; workspace-write → `--force --sandbox enabled`; danger-full-access → `--force --sandbox disabled` (unchanged).
- `CursorApprovalMode` + `resolveCursorApprovalMode`: rename the read-only value `ask` → `plan` to name cursor's real read-only mechanism.
- Unit tests locking the exact arg-vectors for all three sandbox modes of both kinds.

### Out of Scope
- cli-pi (phase 002); per-mode availability (phase 004); the full combo matrix (phase 005).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1 (devin read-only)** — A read-only devin leaf emits `--permission-mode auto` and NO `--sandbox`; it allows native file reads and cleanly rejects shell-exec and writes in non-interactive mode.
- **R2 (devin workspace-write)** — A workspace-write devin leaf emits `--permission-mode dangerous --sandbox`; it runs autonomously (never stalls) with writes confined to the working directory.
- **R3 (cursor trust)** — Every non-`danger-full-access` cursor leaf passes `--trust` so it is not blocked by the untrusted-directory gate; `danger-full-access` relies on `--force` (which already implies trust).
- **R4 (cursor read-only)** — A read-only cursor leaf emits `--mode plan --trust` and NO `--sandbox`/`--force`/`--auto-review`; plan mode allows reads and blocks edits/shell writes.
- **R5 (cursor workspace-write)** — A workspace-write cursor leaf emits `--force --sandbox enabled` (autonomous so it never stalls, writes OS-confined to the working directory); `--auto-review` is not used because it can block non-interactively.
- **R6 (no regression)** — No other executor kind (codex, claude-code, opencode, pi) and no fan-out worker path changes behavior.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Both builders emit the exact arg-vectors in §4 for all three sandbox modes, locked by unit tests.
2. Live evidence: a read-only leaf of each kind cannot write (write blocked) but can read; a workspace-write leaf of each kind writes without stalling.
3. `fanout-run` and `executor-config` vitest suites pass and whole-runtime tsc is 0.
4. An independent cross-model review (cli-opencode GPT-5.6-SOL) finds no P0/P1 that survives verification.
5. `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **cursor ambient-config inheritance** — running in the repo cwd, a cursor leaf inherits `.cursor/hooks.json` (whose `sessionStart` hooks write repo infra state even under `--mode plan`) and repo MCP servers (reported "not loaded (needs approval)"). These are separate unattended surfaces from the agent's exec/write tools; both are pre-existing and their fix is spawn-environment isolation, carried to the combo-matrix phase.
- **devin write-boundary breadth** — `--sandbox` confines workspace-write writes; the exact boundary (cwd-only vs broader) beyond the confirmed cwd write is asserted-by-flag, not exhaustively probed.
- **Shared fan-out blast radius** — `fanout-run.cjs` is used by every deep mode; the full fanout/executor vitest suites gate the change.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How should cursor's ambient repo config (write-capable `sessionStart` hooks + unapproved MCP servers) be isolated for fan-out leaves — an isolated config/home, an MCP-less configuration, or a hook-disable env? Deferred to the combo-matrix phase.
- Should devin read-only ever need OS-enforced Read scopes (via a generated `--agent-config`) for defense-in-depth, or is permission-mode `auto` (which blocks exec/writes outright) sufficient?
<!-- /ANCHOR:questions -->
