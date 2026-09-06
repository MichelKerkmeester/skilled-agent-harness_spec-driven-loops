---
title: "Acceptance Criteria: Phase 2: memory-consumer-rewire"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-memory-consumer-rewire"
    last_updated_at: "2026-09-02T11:04:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-memory-decommission"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 2: memory-consumer-rewire

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 049-memory-decommission/002-memory-consumer-rewire
**Level:** 3
**Status:** Complete
**Date:** 2026-09-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given the rewire is finished, When the residue sweep runs with `--json --ignore-case --no-ignore-global` and the four exclusions `.git`, `node_modules`, `z_archive` and the mcp-server tree, Then it returns zero live rows | `node .opencode/skills/system-spec-kit/scripts/retrieval/sweep-memory-residue.mjs --json` from the worktree root: live 0, livePaths 0, exit 0; 79 exemptions in `fixtures/residue-allowlist.json`, each with a reason, phase 003 targets marked to expire | Met | - |
| AC-002 | REQ-005 | Given every runtime agent and command directory, When their `allowed-tools` frontmatter is scanned, Then no removed tool name appears in any of them | `rg -c mcp__system_spec_memory__` over .opencode/agents, .claude/agents, .codex/agents, .pi/agents and .opencode/commands returns nothing; both mirror sync checks PASS 12/12 | Met | - |
| AC-003 | REQ-003 | Given the memory daemon is stopped, When a session opens and Gate 1 runs, Then it resolves through the trigger index with no degraded-mode notice and inside the 200ms budget | AGENTS.md Gate 1 runs `lookup-trigger-index.mjs`; `pgrep` shows no memory daemon; lookup answers 20 results in 76 ms wall (phase 001 latency report p95 83.7 ms) | Met | - |
| AC-004 | REQ-004 | Given the memory daemon is stopped, When a continuity update runs, Then the named packet-local writer updates `_memory.continuity` atomically in the same directory and releases its lock | `generate-context.js` exercised against a throwaway packet copy with no daemon: exit 0, graph metadata refreshed, quality review ran, no index scan or daemon probe in the log; the writer contract is in `references/memory/save-workflow.md` | Met | - |
| AC-005 | REQ-008 | Given the shared embedding, HF-local, IPC and launcher branches are split, When `system-skill-advisor` runs in a fresh process with the memory daemon stopped, Then it resolves its embedder and returns an embedder-backed result | `node .opencode/bin/skill-advisor.cjs advisor_status --format json` exit 0 with freshness live and all five lanes after the socket default moved off the memory database directory; advisor embedder suite 24 passed | Met | - |
| AC-006 | REQ-008, REQ-009 | Given the five break-risk seams S-001 through S-005, When the packet is reviewed for closure, Then each seam carries either a named replacement or an explicit retain decision | S-001 replaced (indexing import gone, graph refresh via the top-level API); S-002 retained until phase 003 with the allowlist reasons; S-003 split (hf-embed and daemon-ipc defaults no longer derive from the memory DB dir); S-004 replaced (deep-loop YAML and tests on lineage-local state); S-005 replaced (producers updated before outputs, install-all.sh --help names no memory server) | Met | - |
| AC-007 | REQ-014 | Given the ~167 logical-owner estimate and the 9,016 live inventory paths this phase owns, When closure is claimed, Then every owner is marked rewired, deleted, retained or historical and the two counts are stated against each other | `owner-reconciliation.json` in this folder: 588 consumer files, rewired 180, rewired then deferred 14, deferred to removal 322, historical 54, false positive 2, no live hit 16 | Met | - |
| AC-008 | REQ-007 | Given semantic paraphrase, vector and BM25 fusion, decay, access tracking, session dedup and causal traversal, When the replacement is documented, Then each one has a named replacement or an explicit unsupported declaration with a defined no-hit behavior | Every rewired retrieval surface carries the lexical-only statement; `references/memory/memory-system.md` section 9 lists the seven declared losses with their no-hit behavior | Met | - |
| AC-009 | REQ-006 | Given any rewired consumer, When an operator follows its retrieval instruction by hand, Then the instruction runs from `retrieval-conventions.md` without a daemon and returns the same evidence the agent saw | Hand run from the conventions: the lookup returned 20 results with the daemon absent and the path-only recipe exited 0 for a real phrase | Met | - |
| AC-010 | REQ-010 | Given the agent families across four runtime roots, the `/memory:*` and `/doctor` memory routes and the deep-loop YAML grants, When each is exercised, Then it resolves through the trigger index, a ripgrep recipe, lineage-local state or the approved file-local successor | Four agent roots rewired and mirrored, /memory:search and /memory:save rewired, /memory:manage retiring, /doctor memory routes diagnose the index, deep-loop YAML grants and calls on lineage-local state; command sweep live 0 | Met | - |
| AC-011 | REQ-011 | Given the generated-artifact producers, When one artifact of each kind is regenerated after the update, Then the fresh output names no removed tool | Agent mirrors regenerated from the canonical root with zero memory grants; `install-all.sh --help` names no memory server; the agent, frontmatter and command templates emit advisor grants; three deep command contracts recompiled with no memory tool in their allow lists | Met | - |
| AC-012 | REQ-012, REQ-013 | Given the deep-loop reducer suites, When they run after the rewrite, Then persistence is lineage-local, the locks, projections and ledger state are unchanged and no old assertion was deleted before its replacement existed | Deep-loop persistence tests rewritten: 101 passed across five files, replacement assertions added before old ones were removed; check-contract-drift and render-command-contract pass | Met | - |

Source inventory for the counts and seam citations above:
specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/006-legacy-memory-surface-inventory/research/lineages/luna-max/research.md

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

**Closeable:** Yes

AC-001 and AC-005 carried the phase: the residue sweep returns zero live records with every exemption reasoned, and the skill advisor still resolves its embedder after the shared seam moved off the memory database directory. Consciously left out: the 265 catalog and playbook files, the runtime configuration roots, the launcher, plugin, hooks and process-cleanup scripts stay as they are until phase 003 removes them, each under an expiring exemption, and the fate of the MCP package itself is an open logic-sync decision recorded in the packet.
<!-- /ANCHOR:closure -->
