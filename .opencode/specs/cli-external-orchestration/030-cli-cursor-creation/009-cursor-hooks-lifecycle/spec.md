---
title: "Feature Specification: cli-cursor hooks lifecycle"
description: "Coordinate the cli-cursor hook adapter lifecycle across six phases: hooks feature-catalog and playbook coverage, live .cursor/hooks.json wiring, Claude-adapter parity expansion, independent manual-testing verification, sk-code/code-opencode style alignment, and the .cursor/hooks/ discovery mirror. All 6 phases are complete."
trigger_phrases: ["cli-cursor hooks lifecycle", "cursor hooks.json wiring", "cursor hook adapter parity", "cursor hooks manual testing"]
importance_tier: normal
contextType: implementation
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase-parent packet for cli-cursor hooks lifecycle; 6 children complete"
    next_safe_action: "No further packet work; the 6 children are individually complete."
    blockers: []
    key_files: ["001-cursor-hooks-catalog-and-playbook-coverage/spec.md", "002-cursor-hooks-live-wiring/spec.md", "003-cursor-hooks-claude-parity/spec.md", "004-hooks-manual-testing-results/spec.md", "005-hooks-sk-code-alignment/spec.md", "006-cursor-hooks-discovery-mirror/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cursor-hooks-lifecycle-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["All 6 child phases were already independently complete before this folder existed; their content was preserved verbatim and only internal cross-references were touched to match the new folder depth."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->
# Feature Specification: cli-cursor hooks lifecycle

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 phased packet |
| **Priority** | P1 |
| **Status** | Complete — all 6 phases implemented, validated, and committed |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../008-cursor-model-allowlist/spec.md` |
| **Successor** | `../015-hook-code-style-cross-runtime/spec.md` |
| **Handoff Criteria** | Every child phase validates independently; the cli-cursor hook adapter surface (feature catalog, live `.cursor/hooks.json` wiring, Claude-adapter parity, independent manual-test verification, sk-code style alignment, and the `.cursor/hooks/` discovery mirror) is documented and evidenced end to end. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `cli-cursor` hook adapter layer (built in `030-cli-cursor-creation`'s phase 004) spans a sequence of tightly related follow-on workstreams — cataloging the adapters, wiring them live against the real repo, extending them toward Claude-adapter parity, independently re-verifying that wiring, aligning the code to `sk-code`/`code-opencode` standards, and mirroring the hooks into Cursor's conventional discovery path. These six workstreams share one subject (the Cursor hook adapter lifecycle) and one dependency chain (each phase's `Predecessor`/`Successor` points at the next), which this phase-parent folder groups under a single governing packet per this repo's Phase Parent convention.

### Purpose
Govern the cli-cursor hooks lifecycle as one phase-parent packet with six ordered children: feature-catalog and playbook coverage (001), live `.cursor/hooks.json` wiring (002), Claude-adapter parity expansion (003), independent manual-testing verification (004), sk-code/code-opencode style alignment (005), and the `.cursor/hooks/` discovery mirror (006). Each child carries its own full spec/plan/tasks/checklist/implementation-summary; this parent holds only the lean trio (`spec.md`, `description.json`, `graph-metadata.json`) per the repo's Phase Parent Mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Own the six ordered child phases documenting the Cursor hook adapter lifecycle end to end.
- Keep each child's `Predecessor`/`Successor` cross-references internally consistent.

### Out of Scope
- The Cursor CLI contract, executor support, skill packet, model registry, manual-testing playbook, and closeout phases (`001`-`008` of the `030-cli-cursor-creation` parent) — those are siblings, not children, of this packet.
- Cross-runtime hook code-style alignment (`../015-hook-code-style-cross-runtime/`) — that phase generalizes this packet's phase 005 (Cursor-only) to all four runtimes (Claude, Codex, Cursor, Devin) and remains a top-level sibling under `030-cli-cursor-creation`, not a child here.
- `.cursor/mcp.json` wiring and the MCP route-guard fix, and the `.codex/hooks/`/`.claude/hooks/` discovery mirrors — those are separate top-level phases (`016`/`017`) under `030-cli-cursor-creation`.

### Files to Change
| File Path | Change Type | Phase | Description |
|---|---|---|---|
| `.opencode/skills/cli-external-orchestration/feature-catalog/**` | Modify | 001 | Feature-catalog entry + manual-testing-playbook coverage for every cli-cursor hook adapter. |
| `.cursor/hooks.json` | Created | 002 | Committed, project-level hook registration for the 4 confirmed adapters. |
| `.cursor/hooks.json`, `system-spec-kit/mcp-server/hooks/cursor/**` | Modify/Created | 003 | Claude-adapter parity expansion (Tier 0-4 adapters). |
| `.opencode/specs/.../004-hooks-manual-testing-results/**` | Created | 004 | Independent re-execution and evidence for the hooks-category playbook scenarios. |
| `system-spec-kit/{runtime,mcp-server}/hooks/cursor/*.mjs`, `sk-code/code-opencode/references/shared/hooks.md` | Modify | 005 | sk-code/code-opencode style alignment for Cursor `.mjs` hook files. |
| `.cursor/hooks/**` | Created | 006 | Symlink discovery mirror of every file `.cursor/hooks.json` invokes. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP
| Phase | Folder | Focus | Status |
|---|---|---|---|
| 1 | `001-cursor-hooks-catalog-and-playbook-coverage/` | Feature-catalog entry + manual-testing-playbook coverage for every cli-cursor hook adapter. | Complete |
| 2 | `002-cursor-hooks-live-wiring/` | Create and commit the project `.cursor/hooks.json` registration (ADR-001). | Complete |
| 3 | `003-cursor-hooks-claude-parity/` | Expand toward Claude parity: `postToolUse` chain, `Task`-matcher guard, repo-guard scripts. | Complete |
| 4 | `004-hooks-manual-testing-results/` | Re-execute the hooks-category playbook scenarios independently. | Complete |
| 5 | `005-hooks-sk-code-alignment/` | Align all Cursor `.mjs` hooks to `sk-code/code-opencode` P0 standards. | Complete |
| 6 | `006-cursor-hooks-discovery-mirror/` | `.cursor/hooks/` discovery mirror. | Complete |

### Phase Transition Rules
- Each phase MUST pass `validate.sh <phase-folder> --strict` independently before the next phase begins.
- `spec-gate-prebind.mjs` (a concurrent session's file, unrelated to this packet's own work) stays out of scope for every child phase until reviewed and owned separately.
- No child phase may register `.cursor/hooks.json` at anything but the confirmed, live-fire-tested event names established by phase 002 and extended by phase 003.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|---|---|---|---|
| 001 | 002 | Feature-catalog and playbook coverage exist for every hook adapter file. | Met — 4/4 files `VALID` (001 implementation-summary.md). |
| 002 | 003 | `.cursor/hooks.json` committed, live-fire proven against the real repo. | Met — SC-001..SC-005 (002 implementation-summary.md). |
| 003 | 004 | Claude-adapter parity expansion wired and live-fire confirmed or explicitly documented as unconfirmed/dormant. | Met — SC-001..SC-006 (003 implementation-summary.md). |
| 004 | 005 | All 4 hooks-category scenarios independently re-executed with PASS/FAIL/SKIP verdicts. | Met — SC-001..SC-005 (004 implementation-summary.md). |
| 005 | 006 | Every Cursor `.mjs` hook file passes `verify_alignment_drift.py` with 0 findings. | Met — SC-001..SC-006 (005 implementation-summary.md). |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
None — all 6 child phases resolved their own open questions before completion (see each child's own spec.md §12).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `001-cursor-hooks-catalog-and-playbook-coverage/spec.md` through `006-cursor-hooks-discovery-mirror/spec.md`
- `../spec.md` (the `030-cli-cursor-creation` grandparent packet)
- `../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001, the original hook-registration decision this packet's children execute and extend)
- `../015-hook-code-style-cross-runtime/spec.md` (top-level sibling that generalizes this packet's phase 005 to all four runtimes)
