---
title: "Acceptance Criteria: Phase 10: dsh-mcp-code-mode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "dsh mcp code mode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/085-cli-deepseek-harness-creation/010-dsh-mcp-code-mode"
    last_updated_at: "2026-11-06T07:54:24Z"
    last_updated_by: "codex"
    recent_action: "Closeout reconciled; AC-003 and AC-005 remain open."
    next_safe_action: "Resolve AC-003 and add the default-off case."
    blockers: ["phase 008 open", "AC-003 unresolved", "default-off case missing"]
    key_files: ["evidence/dump-config-mcp.txt", "evidence/keyless-mcp-boot.txt", "evidence/executor-config-vitest.txt", "../../../../.dsh/patches/mcp-code-mode.patch.yml"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-010-dsh-mcp-code-mode"
      parent_session_id: null
    completion_pct: 33
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 10: dsh-mcp-code-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/085-cli-deepseek-harness-creation/010-dsh-mcp-code-mode
**Level:** 2
**Status:** In Progress
**Date:** 2026-11-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a disposable `DSH_HOME`, When `--dump-config` runs with `.dsh/patches/mcp-code-mode.patch.yml`, Then it shows exactly one `@deepseek-ai/dsh-mcp-client` row with `serverName: code_mode`, `transport: stdio` and `env` naming `UTCP_CONFIG_FILE` | `evidence/dump-config-mcp.txt:3` records one client row with the patch. Lines 7 and 8 show `serverName` and `transport`. The `env` block is not in the dump excerpt. It is derived from `.dsh/patches/mcp-code-mode.patch.yml:33` and `.dsh/SYNC.md:14`, not observed in the dump | Met | - |
| AC-002 | REQ-001 | Given the same home, When `--dump-config` runs without the MCP patch, Then no MCP client row appears | `evidence/dump-config-mcp.txt:2` records zero `dsh-mcp-client` rows without the patch | Met | - |
| AC-003 | REQ-002 | Given no provider key and the launcher PID set saved, When a keyless run with the MCP patch finishes, Then it exits 1 with `MISSING_CREDENTIAL`, stderr shows no MCP startup failure and no new launcher process remains | `evidence/keyless-mcp-boot.txt:4` records exit 1, `:6` records an empty PID comparison and `:11` records `MISSING_CREDENTIAL`. `:8` also records a Code Mode manual registration error. The wording does not settle whether this counts as an MCP startup failure, and the run predates the bundle edits. `tasks.md:64` records the open ruling and stale-run reason | Unmet | - |
| AC-004 | REQ-003 | Given an `mcp__code_mode__*` tool outside the allowlist, When the route guard judges it, Then it is denied | `.dsh/plugins/repo-guards/tests/mcp-route-guard.test.mjs:58` tests the deny case. `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt:4` records the passing case in the 37/0 suite | Met | - |
| AC-005 | REQ-004 | Given the kind's MCP capability, When `executor-config.vitest.ts` runs, Then it asserts the capability and that MCP stays off when no server is requested | `evidence/executor-config-vitest.txt:7` records 112 passing tests. `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts:388` asserts capability, but `:417` only covers default-off for `native`. There is no dsh default-off case | Unmet | - |
| AC-006 | REQ-005 | Given the patch exists, When the docs are checked, Then both name it | `.dsh/SYNC.md:28` and `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/mcp.md:50` name the patch | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Two rows block closure. AC-003 needs an operator ruling on the manual registration error and a keyless rerun on the current bundle. AC-005 needs a default-off case for `cli-deepseek-harness` in the vitest file. Phase 008 is not closed either, and this phase depends on it. The phase is optional, so the parent may record a skip instead.
<!-- /ANCHOR:closure -->
