---
title: "Acceptance Criteria: Phase 6: Always-Loaded Routing Compression"
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
    packet_pointer: "agents/007-repo-rules-router/006-always-loaded-routing-compression"
    last_updated_at: "2026-08-31T11:08:09Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the closure gate for the routing compression phase"
    next_safe_action: "Run the packet gate and record the result"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 6: Always-Loaded Routing Compression

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** agents/007-repo-rules-router/006-always-loaded-routing-compression
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the review's load-bearing claims, When any is acted on, Then it was re-opened first | Four re-verified: the dead command's deletion commit `48c3b2e8374` dated 2026-07-15; the prior audit's "all targets verified to exist" at `004/research/research.md:76`; the byte cost at 17.3%; the magicpath skill's ownership of the naming rule. The review's own line-count figure was corrected before use | Met | - |
| AC-002 | REQ-002 | Given the repository, When it is searched outside `specs/`, Then no dead command is named | `rg -l 'ai-system-improvement'` outside `specs/` returns nothing; `AGENTS.md` had been the sole reference for six weeks | Met | - |
| AC-003 | REQ-002 | Given `mcp-code-mode`, When it is read, Then it no longer describes the decommissioned server as live | 14 mentions removed across SKILL and README; one survives at `SKILL.md:276` and explains why the server went, which is durable rather than stale | Met | - |
| AC-004 | REQ-003 | Given content with no other home, When the cuts land, Then it survives | "Registration is not availability" retained in the compressed MCP section; "widen the pattern rather than trusting a single hit" retained in bold in the search table. Both re-checked as unique before deleting anything around them | Met | - |
| AC-005 | REQ-004 | Given the `AGENTS.md` edits, When the record is checked, Then operator approval is on file | Approval given in the instruction opening this phase: "remove sequential thinking reference and apply recs and fixes from verdict" | Met | - |
| AC-006 | REQ-005 | Given every cut, When references are swept, Then none dangles | "Grep, Glob, and Read routes" 0; "Sequential Thinking" in `AGENTS.md` 0; "decision tree below" 0; every command path resolves; 8 of 8 `repo-rules/` pointer links resolve; the `naming-convention.md` pointer resolves | Met | - |
| AC-007 | REQ-006 | Given candidate A, When it is left unchanged, Then a reason is recorded rather than an omission | The skill advisor failed to connect this session, making the artifact trigger the only surviving routing obligation; and a skill cannot instruct an agent that has not loaded it | Met | - |
| AC-008 | REQ-007 | Given the relocated naming rule, When an agent needs it, Then it reaches the document holding it | Added as Mistake 0 in `naming-convention.md`, which showed `"mcp"` five times and never explained the `cli` case; `mcp-code-mode/SKILL.md` routes there on a naming match | Met | - |
| AC-009 | REQ-008 | Given a weaker reader, When the search table is compressed, Then the lookup affordance survives | Rows still name the capability *and* the tool as a parenthetical example, rather than replacing tool names with abstractions — the risk the review raised against itself | Met | - |
| AC-010 | REQ-009 | Given adjacent defects found in review, When the phase closes, Then they are recorded and not silently fixed | Doctor tooling still runs `npx -y @modelcontextprotocol/server-sequential-thinking` across 31 references, and `mcp-tooling/README.md` links a non-existent `mcp-n/`. Both named in `spec.md` Out of Scope; neither touched | Met | - |
| AC-011 | REQ-010 | Given the always-loaded document, When the delta is measured, Then it is reported in whichever direction it went | `AGENTS.md` 51,211 bytes at the prior commit, 50,337 now: **874 bytes smaller**, across phases 5 and 6 combined. Phase 6 alone removed 3,829 | Met | - |
| AC-012 | REQ-001 | Given this phase folder, When the packet gate runs, Then the spec docs validate | `validate.sh` on this folder with `--strict`: every rule passed and the only error was this row's own `AC_CLOSURE`, which clears once the row is marked. Re-run recorded below | Met | - |

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

AC-001 and AC-004 carried the phase. The review was better-evidenced than the first read,
which is exactly when adopting it wholesale becomes tempting — its claims were re-opened
anyway, and its own line-count figure was wrong. And nothing unique to the repository was
cut: both sentences with no other home were checked before, not after. Left open
deliberately and named in the spec: the doctor tooling would still reinstall the
decommissioned server, which is the most consequential thing this review found and the
one thing this phase did not fix.
<!-- /ANCHOR:closure -->
