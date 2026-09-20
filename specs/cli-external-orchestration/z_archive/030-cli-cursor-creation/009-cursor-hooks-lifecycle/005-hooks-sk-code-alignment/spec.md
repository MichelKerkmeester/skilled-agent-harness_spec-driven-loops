---
title: "Feature Specification: cli-cursor hook code sk-code/code-opencode alignment"
description: "Audit and align all Cursor hook adapter .mjs files against sk-code's code-opencode surface standards (box header, no 'use strict' in .mjs), verified clean via the automated verify_alignment_drift.py tool; extend code-opencode's canonical hooks.md reference to document Cursor CLI hook wiring, which it previously omitted entirely."
trigger_phrases: ["cli-cursor hooks sk-code alignment", "code-opencode hooks.md cursor", "cursor hook box header"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment"
    last_updated_at: "2026-07-24T17:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "5 hook files aligned; hooks.md updated"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: [".opencode/skills/sk-code/code-opencode/references/shared/hooks.md", ".opencode/skills/system-spec-kit/mcp-server/hooks/cursor/", ".opencode/skills/system-spec-kit/runtime/hooks/cursor/"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-sk-code-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Scope: all Cursor .mjs hook files this packet owns (5), not spec-gate-prebind.mjs (a concurrent session's unreviewed, uncommitted work).", "Box header format: the checklist's COMPONENT/PURPOSE 4-line box (matching the real install-codex-hooks.mjs precedent), not style-guide.md's simpler 3-line template.", "Documentation gap: code-opencode's canonical hooks.md had zero mention of Cursor CLI at all -- closed with a new section matching the existing Claude section's format."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: cli-cursor hook code sk-code/code-opencode alignment

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../004-hooks-manual-testing-results/spec.md` |
| **Successor** | `../006-cursor-hooks-discovery-mirror/spec.md` |
| **Handoff Criteria** | Every Cursor `.mjs` hook file this packet owns has the P0 box header and no `'use strict'` directive; `python3 verify_alignment_drift.py` reports 0 findings/errors/warnings against both hook directories; `sk-code/code-opencode`'s canonical `hooks.md` documents Cursor CLI wiring on par with its existing Claude/OpenCode/GitHub-Copilot sections. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked directly: *"make sure all hook code aligns with sk-code code-opencode standards."* `sk-code`'s `code-opencode` surface packet is the canonical evidence base for `.opencode/` system code (TypeScript/JavaScript/Python/shell/config standards, and — specifically relevant here — a dedicated `references/shared/hooks.md` covering "runtime hook entrypoints, checked-in Claude wiring, OpenCode plugin-bridge delivery, and wrapper reachability."

Auditing against that surface's own P0 JavaScript checklist (box header with COMPONENT/PURPOSE, `'use strict'` handling) surfaced two real gaps across every Cursor `.mjs` hook file this packet owns: no box header (P0 hard blocker), and an incorrectly-present `'use strict'` directive (the style guide explicitly says "Do not add it to `.mjs` files; ES modules are strict by definition"). Separately, `code-opencode`'s own canonical `hooks.md` — the file that documents Claude, OpenCode, and GitHub/Copilot hook wiring in detail — had **zero mention of Cursor CLI at all**, despite phases 004/010/011 of this same packet having shipped a full Cursor hook adapter layer and a committed `.cursor/hooks.json`.

### Purpose
Bring every Cursor `.mjs` hook file this packet owns into P0 compliance with `code-opencode`'s JavaScript style/checklist (box header, no `'use strict'`), verify the result with the surface's own automated `verify_alignment_drift.py` tool rather than a manual read alone, and close the `hooks.md` documentation gap so Cursor is a first-class, fully-documented runtime alongside Claude/OpenCode/GitHub-Copilot in the canonical cross-runtime hook reference.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `sk-code/SKILL.md`, `code-opencode/SKILL.md`, the TypeScript and JavaScript style guides, and both language checklists to establish the actual, current standards (not assumed from memory).
- Audit all 8 Cursor hook adapter files this packet owns (5 `.ts`, 3 `.mjs` newly built in phase 011, plus the 2 `.mjs` files from phase 004) against those standards.
- Fix the 2 real P0 gaps found — missing box header, present-but-forbidden `'use strict'` — across the 5 in-scope `.mjs` files (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, `mcp-route-guard.mjs`, `post-tool-use.mjs`, `task-dispatch-guard.mjs`).
- Syntax-check (`node --check`) and functionally re-smoke-test every edited file with the same synthetic payloads used in earlier phases, to confirm the header/strict-mode edits changed nothing behavioral.
- Run `code-opencode`'s own `verify_alignment_drift.py` against both Cursor hook directories as independent, automated confirmation.
- Extend `code-opencode/references/shared/hooks.md` with a new `CURSOR HOOKS` section (event/matcher/command/timeout/purpose table, wiring-shape example, "not wired" callout), renumbering the sections after it, and touch up the file's other cross-runtime tables (Key Sources, Cross-Runtime Parity, the dynamic-load-pattern registration table) to include Cursor.

### Out of Scope
- `spec-gate-prebind.mjs` — still a concurrent session's unreviewed, uncommitted work; not this packet's file to edit.
- The 5 `.ts` hook files — audited and confirmed already compliant (correct header format, no `any` in public API, PascalCase types, kebab-case filenames); no changes needed.
- Any behavioral change to hook logic — this phase is style/documentation alignment only.
- sk-code's own internal `run-all-drift-guards.sh` triad (bijection/router-sync suite) — that verifies sk-code's own RESOURCE_MAP self-consistency, not arbitrary `.opencode/` files elsewhere in the repo; not applicable to auditing files outside `sk-code/`.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Modify | Add box header, remove `'use strict'`. |
| `.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-classify.mjs` | Modify | Add box header, remove `'use strict'`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/mcp-route-guard.mjs` | Modify | Add box header, remove `'use strict'`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs` | Modify | Add box header, remove `'use strict'`. |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/task-dispatch-guard.mjs` | Modify | Add box header, remove `'use strict'`. |
| `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` | Modify | New `CURSOR HOOKS` section + cross-runtime table touch-ups + version bump. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | Every Cursor `.mjs` hook file this packet owns has the P0 COMPONENT/PURPOSE box header. | P0 |
| REQ-002 | No Cursor `.mjs` hook file this packet owns contains a `'use strict'` directive. | P0 |
| REQ-003 | Every edited file passes `node --check` and reproduces its pre-edit functional output against the same synthetic test payload. | P0 |
| REQ-004 | `verify_alignment_drift.py` reports 0 findings/errors/warnings/violations against both Cursor hook directories. | P0 |
| REQ-005 | `code-opencode/references/shared/hooks.md` documents Cursor CLI hook wiring with the same table format, depth, and cross-referencing as its existing Claude section. | P1 |
| REQ-006 | `spec-gate-prebind.mjs` (a concurrent session's file) is left completely untouched. | P0 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `grep -c "COMPONENT:"` returns `1` for each of the 5 edited `.mjs` files. **MET**.
- **SC-002**: `grep -c "'use strict'"` returns `0` for each of the 5 edited `.mjs` files. **MET**.
- **SC-003**: `node --check` exits `0` for all 5 edited files. **MET**.
- **SC-004**: Each edited file's synthetic-payload smoke test returns the identical response envelope observed before editing. **MET**.
- **SC-005**: `python3 verify_alignment_drift.py --root <runtime-hooks-dir> --root <mcp-server-hooks-dir>` reports `Errors: 0  Warnings: 0  Violations: 0`. **MET** — 11 files scanned, 0 findings.
- **SC-006**: `hooks.md`'s new `CURSOR HOOKS` section lists all 12 wired hook entries currently in `.cursor/hooks.json`, matching the live file exactly. **MET**.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **Header/strict-mode edits accidentally changing runtime behavior.** Mitigation: `node --check` plus a functional re-smoke-test with the same synthetic payloads used in phases 010/011, confirming byte-identical response envelopes.
- **`hooks.md`'s Cursor table drifting from the live `.cursor/hooks.json` the moment either changes.** Mitigation: the table was built by reading the live file directly at documentation time, not from memory of an earlier phase's summary; a future hook addition/removal will need a matching `hooks.md` update (documented as the existing "Adding/Removing a Hook" maintenance checklist already requires for every runtime).
- **Renumbering `hooks.md`'s sections breaking an external cross-reference.** Mitigation: grepped the file for internal self-references to section numbers before renumbering; none exist beyond the sections renumbered here.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-C01**: The new `hooks.md` Cursor section matches the existing Claude section's column set (Event/Matcher/Command/Timeout/Purpose) exactly, so a reader comparing runtimes doesn't hit a shape mismatch.

## 8. EDGE CASES
- A future Cursor CLI build starts delivering `beforeSubmitPrompt`/`preCompact`: the "registered for parity, delivery unconfirmed" language in both the hook files' own headers and `hooks.md` becomes stale at that point — a follow-up re-verification (not this phase) would need to promote the status language.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 10/25 | 5 small mechanical code edits + 1 substantial reference-doc extension. |
| Risk | 6/25 | Header/strict-mode changes only, no logic touched; verified via syntax check + functional smoke test + automated drift checker. |
| Research | 8/20 | Required reading sk-code's routing hub, the code-opencode surface packet, 2 style guides, 2 checklists, and the existing hooks.md structure before making any edit. |
| **Total** | **24/70** | **Level 2** |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Box-header insertion breaks the shebang/import ordering | Low | Medium (syntax error) | `node --check` run on every file immediately after editing |
| `hooks.md` table drifts from live `.cursor/hooks.json` | Medium (over time) | Low (docs-only staleness) | Built from the live file at documentation time; existing maintenance checklist already covers future drift |

## 11. USER STORIES
- As the operator, I want every Cursor hook file to look and read like the rest of this codebase's `.opencode/` system code, so a future contributor auditing hook code doesn't find an inconsistent style island.
- As a maintainer, I want the canonical cross-runtime hooks reference to actually list Cursor, so "which hooks does this repo have" has one true source that doesn't silently omit an entire runtime.

## 12. OPEN QUESTIONS
None — this was a direct standards-alignment audit against an already-documented, already-authoritative surface.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../004-hooks-manual-testing-results/spec.md` (predecessor)
- `../../spec.md` (phase-parent packet)
- `.opencode/skills/sk-code/code-opencode/SKILL.md` (the surface packet this phase aligns against)
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` (the canonical reference this phase extends)
