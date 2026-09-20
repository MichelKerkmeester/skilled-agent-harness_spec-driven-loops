---
title: "Feature Specification: Cross-runtime hook code style alignment"
description: "Extend phase 013's Cursor-only sk-code/code-opencode style alignment to every hook entrypoint in the repo (Claude, Codex, Cursor, Devin): the JavaScript P0 box header on 27 files that lacked it, numbered ALL-CAPS section bands on all 32, and removal of the forbidden 'use strict' from 9 .mjs files -- proven comment-only by diff."
trigger_phrases: ["cross-runtime hook style alignment", "hook box header all runtimes", "hook numbered sections"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/010-hook-code-style-cross-runtime"
    last_updated_at: "2026-07-24T19:55:00Z"
    last_updated_by: "claude-code"
    recent_action: "32 hook files aligned across 4 runtimes; comment-only diff proven"
    next_safe_action: "Run validate.sh --strict, then commit"
    blockers: []
    key_files: [".opencode/skills/sk-code/code-opencode/assets/checklists/javascript-checklist.md", "../009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment/spec.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cross-runtime-hook-style", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Operator initially asked for the thin TypeScript MODULE header on ALL hooks; the standards prescribe headers PER LANGUAGE (box for .js/.cjs/.mjs, thin for .ts). Escalated; operator chose the per-language standard, which also vindicates phase 013's box-header choice.", "spec-gate-prebind.mjs stays excluded -- still a concurrent session's untracked work, same call phase 013 made."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Cross-runtime hook code style alignment

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../009-cursor-hooks-lifecycle/spec.md` |
| **Successor** | `../011-cursor-mcp-wiring-and-route-guard-fix/spec.md` |
| **Handoff Criteria** | Every hook entrypoint across all four runtimes carries its language's P0 header and numbered ALL-CAPS section bands; no `.mjs` retains `'use strict'`; the whole change is provably comment-only apart from those removals; `verify_alignment_drift.py` reports 0 findings across all seven hook directories. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 013 aligned the five Cursor `.mjs` hook files to `sk-code`/`code-opencode`'s JavaScript P0 standards (COMPONENT/PURPOSE box header, no `'use strict'` in `.mjs`). That fix was correct but Cursor-only: the operator, reviewing a Devin `.ts` adapter, asked for the same treatment across every hook in the repo. An audit against the same checklists found the gap was far wider than one runtime -- 27 of 32 hook entrypoints across Claude, Codex, and Devin carried no header block at all, and 9 `.mjs` files (spanning all four runtimes) still declared the forbidden `'use strict'`. Separately, none of the 32 had the numbered ALL-CAPS section bands that `universal-checklist.md` treats as a P0 invariant and that the shared runtime-neutral cores (e.g. `post-edit-router.cjs`) already model.

A second, subtler problem surfaced mid-request. The operator's initial instruction was to give every hook the thin `// ─── MODULE: ───` header seen in a Devin TypeScript adapter. The standards deliberately prescribe **different headers per language** -- `javascript-checklist.md` §2 P0 requires the COMPONENT/PURPOSE box for `.js`/`.cjs`/`.mjs`, `typescript-checklist.md` §2 P0 requires the thin MODULE block for `.ts`, and `universal-checklist.md` states both explicitly in one line. Applying the thin header everywhere would have put 32 JavaScript files into documented P0 violation, contradicting the operator's own instruction to conform to those standards.

### Purpose
Bring every hook entrypoint in the repo -- not just Cursor's -- to full P0 conformance with the language-appropriate `code-opencode` standard, add the numbered section bands uniformly, and prove via the diff itself that the sweep changed no behavior. Resolve the header-style contradiction through escalation rather than by silently picking one reading.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit all hook entrypoints across the four runtimes against `javascript-checklist.md`, `typescript-checklist.md`, and `universal-checklist.md`.
- Add the P0 COMPONENT/PURPOSE box header to the 27 `.cjs`/`.mjs` hook entrypoints that lacked any header (Claude, Codex, Devin; Cursor's 5 already had it from phase 013).
- Add numbered ALL-CAPS section bands (`IMPORTS` / `CONSTANTS` / `HELPERS` / `MAIN` / `ENTRYPOINT`) to all 32 files, emitted only for constructs each file actually contains so numbering stays gap-free and no empty band appears.
- Remove `'use strict'` from the 9 `.mjs` files still declaring it (ES modules are strict by module semantics; the JS checklist explicitly exempts `.mjs`).
- Prove the sweep is behavior-preserving by showing the only non-comment diff lines are those 9 removals.
- Re-verify with `verify_alignment_drift.py`, `node --check`, the comment-hygiene checker, and live payload smoke tests on all four runtimes.

### Out of Scope
- The `.ts` hook files -- already carrying the correct thin MODULE header; only checked, not modified.
- `spec-gate-prebind.mjs` -- still a concurrent session's untracked, unreviewed work, matching phase 013's own exclusion.
- `.opencode/bin/compiled-route-status.cjs` -- a concurrent session's dirty working-tree file that an early draft of the sweep script picked up via `git diff`; the script was changed to an explicit target list so it can never sweep in another session's edits.
- Any behavioral change to hook logic. This phase is style-only, and the diff proves it.
- Rewriting phase 013's box headers. The operator's escalation decision confirmed 013 was already correct.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `cli-opencode/scripts/hooks/{,codex/,devin/}dispatch-{preflight-lint,audit-posttooluse}.mjs` (6) | Modify | Box header + sections; `'use strict'` removed from the 3 audit files. |
| `mcp-code-mode/runtime/hooks/{claude,codex,devin}/mcp-route-guard.cjs` (3) | Modify | Box header + sections. |
| `sk-code/code-quality/scripts/hooks/claude-posttooluse.cjs` + `{codex,devin}/post-edit-quality.cjs` (3) | Modify | Box header + sections. |
| `system-code-graph/runtime/hooks/{claude,codex,devin}/code-graph-freshness.cjs` (3) | Modify | Box header + sections. |
| `system-deep-loop/runtime/hooks/{claude,devin}/task-dispatch-guard.cjs` (2) | Modify | Box header + sections. |
| `system-spec-kit/mcp-server/hooks/{claude,codex,devin}/completion-evidence-stop.cjs` (3) | Modify | Box header + sections. |
| `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` (1) | Modify | Box header + sections. |
| `system-spec-kit/runtime/hooks/{claude,codex,devin}/spec-gate-{classify,enforce}.mjs` (6) | Modify | Box header + sections; `'use strict'` removed from all 6. |
| `system-spec-kit/mcp-server/hooks/cursor/{mcp-route-guard,post-tool-use,task-dispatch-guard}.mjs` (3) | Modify | Sections only -- box header already correct from phase 013. |
| `system-spec-kit/runtime/hooks/cursor/spec-gate-{classify,enforce}.mjs` (2) | Modify | Sections only -- box header already correct from phase 013. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blocking

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every `.cjs`/`.mjs` hook entrypoint carries the P0 COMPONENT/PURPOSE box header at the documented 79-character row width. | `grep -c "COMPONENT:"` returns 1 for each of the 32 files; a width assertion confirms every box row is exactly 79 characters. |
| REQ-002 | No `.mjs` hook file declares `'use strict'`. | `grep -l "^'use strict'" *.mjs` across all hook dirs returns nothing in scope. |
| REQ-003 | All 32 files carry numbered ALL-CAPS section bands with gap-free numbering and no empty band. | Each file's band list is emitted by the sweep and reviewed; sections appear only for constructs present. |
| REQ-004 | The change is behavior-preserving. | The only non-comment added/removed diff lines across all 32 files are the 9 `'use strict';` removals. |
| REQ-005 | The header-style contradiction is escalated, not silently resolved. | The per-language standard is cited from all three checklists and the operator's decision is recorded. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | A comment run explaining a construct stays attached to it, below its section band. | Spot-reviewed on files with pre-anchor prose (e.g. `spec-gate-enforce.mjs`'s tool-map comment sits under `2. CONSTANTS`, above the const). |
| REQ-007 | The sweep cannot touch a concurrent session's files. | The script uses an explicit target list, never `git diff`; verified the previously-swept `compiled-route-status.cjs` is absent from the run. |
| REQ-008 | All four runtimes still behave identically after the edit. | Live payload smoke tests return the same envelopes/exit codes, including a real advisory from `dispatch-preflight-lint.mjs`. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: 32/32 files pass `node --check`.
- **SC-002**: `verify_alignment_drift.py` across all seven hook directories reports 0 findings, 0 errors, 0 warnings, 0 violations.
- **SC-003**: The comment-hygiene checker reports 0 violations across all 32 files.
- **SC-004**: The non-comment diff is exactly 9 `'use strict';` removals and nothing else.
- **SC-005**: Live smoke tests pass on Claude, Codex, Cursor, and Devin hook entrypoints, including fail-open on malformed stdin.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|---|---|---|---|
| Risk | The sweep edits Claude's own live hooks mid-session; a mistake would break the running session | High | Comment-only diff proof plus `node --check` before any commit; the live `dispatch-preflight-lint` hook was observed firing correctly on a real Bash call after the edit. |
| Risk | A scripted sweep silently mangles a file | High | Dry-run first, full end-to-end review of one representative file, then the non-comment diff assertion across all 32. |
| Risk | Sweeping in a concurrent session's uncommitted work | Medium | Explicit target list instead of `git diff`; two concurrent-session files verified excluded. |
| Dependency | Phase 013 established the box-header format and the `.mjs` `'use strict'` rule | Green - Complete | This phase reuses 013's exact 79-character format rather than re-deriving it. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-P01**: Header and section comments add no runtime cost — they are stripped by neither Node nor any build step, but comment parsing is negligible against the existing hook budget.
- **NFR-M01**: A future maintainer opening any hook file sees the same five-band shape, so navigating an unfamiliar runtime's adapter costs no re-orientation.

## 8. EDGE CASES
- A file with no module constants must not receive an empty `CONSTANTS` band — handled by emitting bands only for constructs present, then numbering in encounter order.
- A comment run directly above an anchor must not be orphaned above the band — handled by walking the anchor backwards over that run.
- A file already carrying a box header (Cursor's five) must pass through the header pass untouched — handled by an idempotence check on the box glyph.

## 9. COMPLEXITY ASSESSMENT
Low logic complexity, high blast radius. The transformation itself is mechanical, but it touches 32 files across 6 skill packets and 4 runtimes, several of which are Claude's own hooks executing in the session performing the edit. The complexity budget went into proving the change is inert rather than into the change itself.

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scripted sweep mangles a file | Low | High | Dry-run, one full end-to-end file review, then the exhaustive non-comment diff assertion |
| Breaking Claude's live in-session hooks | Low | High | `node --check` plus observed real-world firing of the edited hook before commit |
| Sweeping a concurrent session's file | Medium | Medium | Explicit target list replacing `git diff` selection |

## 11. USER STORIES
- As a maintainer opening any hook adapter in any runtime, I want the same header and section shape so I can find the entrypoint without reading the whole file.
- As the next person auditing this repo against `code-opencode`, I want zero P0 header findings across the hook tree so the audit signal is real rather than noise.

## 12. OPEN QUESTIONS
- **ANSWERED (2026-07-24)**: headers are prescribed per language, not uniformly — box for `.js`/`.cjs`/`.mjs`, thin `MODULE:` for `.ts`. Escalated when the request conflicted with the standard; the operator chose the per-language rule, confirming phase 013 was already correct.
- `spec-gate-prebind.mjs` still needs the same treatment once the concurrent session that owns it lands its work — deliberately not touched here.
- The `.ts` hook files have correct headers but mostly lack numbered bands. Adding those is a follow-on; the TypeScript P0 is the header block, which they already satisfy.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase)
- `../009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment/spec.md` (Cursor-only predecessor this phase generalizes)
- `../009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror/spec.md` (sequential-numbering neighbor; no dependency)
- `.opencode/skills/sk-code/code-opencode/assets/checklists/javascript-checklist.md`, `typescript-checklist.md`, `universal-checklist.md` (the standards audited against)
