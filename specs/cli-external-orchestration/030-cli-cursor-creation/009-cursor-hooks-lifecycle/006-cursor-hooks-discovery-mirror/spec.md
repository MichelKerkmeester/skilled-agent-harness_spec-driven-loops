---
title: "Feature Specification: .cursor/hooks/ discovery mirror"
description: "Create .cursor/hooks/, Cursor's own documented conventional path for hook scripts, as a symlink mirror of every file .cursor/hooks.json invokes; discovered and documented a real symlink+ESM entrypoint-guard gotcha affecting 4 of the 13 files, so .cursor/hooks.json's command paths stay pointed at the originals."
trigger_phrases: ["cursor hooks discovery mirror", ".cursor/hooks folder", "cursor hook symlink gotcha"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/006-cursor-hooks-discovery-mirror"
    last_updated_at: "2026-07-24T18:05:09Z"
    last_updated_by: "claude-code"
    recent_action: "13 symlinks created; entrypoint-guard gotcha found and documented"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: [".cursor/hooks/", ".opencode/skills/sk-code/code-opencode/references/shared/hooks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-discovery-mirror", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Rewire .cursor/hooks.json to use the new symlinks: no -- 4 of 13 files silently no-op when invoked through a symlink (confirmed by direct testing), so the original real paths stay authoritative.", "Include spec-gate-prebind.mjs: no -- a concurrent session's unreviewed, uncommitted file, not this packet's to touch.", "Symlink target style: relative (../../<path from repo root>), matching this session's established portable-path precedent for .cursor/hooks.json itself."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: .cursor/hooks/ discovery mirror

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../../spec.md` |
| **Parent Packet** | `cli-external-orchestration/030-cli-cursor-creation` |
| **Predecessor** | `../005-hooks-sk-code-alignment/spec.md` |
| **Successor** | `../../010-hook-code-style-cross-runtime/spec.md` |
| **Handoff Criteria** | `.cursor/hooks/` exists with a symlink to every file `.cursor/hooks.json` currently invokes, none broken; `.cursor/hooks.json`'s own `command` paths are unchanged; the symlink-vs-real-path behavioral difference for the 4 `runCursorHook`-guarded files is documented in both `.cursor/hooks/README.md` and the canonical `hooks.md` reference. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked for a `.cursor` hook folder "with the name that's conventional according to official docs," with every hook this repo has symlinked into it. Cursor's own documentation confirms `.cursor/hooks/` (project scope) is that conventional path for hook script storage — a pure discoverability convention, not a functional wiring mechanism (`.cursor/hooks.json`'s `command` field is what actually registers execution).

### Purpose
Create `.cursor/hooks/` and symlink every file `.cursor/hooks.json` currently invokes into it, verify every symlink resolves and still functions correctly when invoked through the new path, and — since 4 of the 13 files turned out NOT to function correctly through a symlink — document that gotcha clearly so `.cursor/hooks.json`'s command paths are never mistakenly repointed at the new mirror.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm `.cursor/hooks/` is genuinely Cursor's documented convention (not assumed) before creating anything.
- Create `.cursor/hooks/` with a relative symlink to each of the 13 files `.cursor/hooks.json` currently invokes.
- Confirm no broken symlinks.
- Functionally re-test every file through its new symlink path with the same synthetic payloads used in earlier phases.
- Discover, confirm, and document the entrypoint-guard gotcha found during that re-test (4 of 13 files silently no-op through a symlink).
- Add a `.cursor/hooks/README.md` explaining the mirror's purpose and the gotcha.
- Extend `code-opencode`'s canonical `hooks.md` with the same explanation under its existing `CURSOR HOOKS` section.
- Leave `.cursor/hooks.json`'s `command` paths completely unchanged.

### Out of Scope
- `spec-gate-prebind.mjs` (concurrent session's unreviewed file) and any other file not currently wired into `.cursor/hooks.json`.
- Fixing the entrypoint-guard behavior itself (e.g. making `runCursorHook` symlink-tolerant) — that is a `shared.ts` behavior change, out of scope for a discovery-mirror task and not requested.
- Repointing `.cursor/hooks.json` at the new mirror — explicitly rejected per the gotcha finding.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `.cursor/hooks/*` (13 symlinks) | Create | Relative symlinks to every file `.cursor/hooks.json` invokes. |
| `.cursor/hooks/README.md` | Create | Explains the mirror's purpose and the entrypoint-guard gotcha. |
| `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` | Modify | New "Discovery Mirror" subsection under `CURSOR HOOKS`; version bump. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|---|---|---|
| REQ-001 | `.cursor/hooks/` exists with a symlink to every one of the 13 files `.cursor/hooks.json` currently invokes. | P0 |
| REQ-002 | No symlink in `.cursor/hooks/` is broken. | P0 |
| REQ-003 | `.cursor/hooks.json`'s `command` fields remain byte-identical to before this phase. | P0 |
| REQ-004 | The entrypoint-guard gotcha (confirmed via direct testing, not assumed) is documented in both `.cursor/hooks/README.md` and the canonical `hooks.md` reference. | P1 |
| REQ-005 | Symlinks use relative targets, not absolute machine-specific paths. | P1 |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: `find .cursor/hooks -type l ! -exec test -e {} \; -print` returns empty (no broken symlinks). **MET**.
- **SC-002**: `git diff .cursor/hooks.json` (if it were tracked for diffing against its pre-phase content) shows zero changes. **MET** — file untouched.
- **SC-003**: Functional re-test of all 13 files through their symlink path: the 9 plain-script files (`.sh`/`.mjs` without `runCursorHook`) return identical output to their real-path invocation; the 4 `runCursorHook`-guarded files (`session-start.js`, `session-end.js`, `user-prompt-submit.js`, `precompact.js`) return empty output through the symlink, confirmed and documented as expected, not a bug to fix. **MET**.
- **SC-004**: `hooks.md`'s Discovery Mirror subsection and `.cursor/hooks/README.md` both state the gotcha with the same technical explanation (entrypoint-guard comparison of `process.argv[1]` vs ESM-resolved `import.meta.url`). **MET**.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **A future edit mistakenly repoints `.cursor/hooks.json` at the new mirror, silently breaking session-priming/compaction/prompt-advisor hooks.** Mitigation: the gotcha is documented in two places (the mirror's own README and the canonical cross-runtime reference), both explicitly telling the reader not to repoint.
- **The mirror drifts from `.cursor/hooks.json` as new hooks are added/removed.** Mitigation: this is the same class of drift the pre-existing "Adding/Removing a Hook" maintenance checklist in `hooks.md` already covers for every runtime; a future hook change should update the mirror as part of that same checklist step.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- **NFR-P01**: Symlink targets remain portable across clones (relative, not absolute).

## 8. EDGE CASES
- A symlinked file's own relative import (e.g. `session-start.js` importing `./shared.js`) still resolves correctly through the symlink, since Node's ESM loader resolves relative imports against the realpath of the importing module, not the symlink path used to invoke it — confirmed working for `spec-gate-classify.mjs`/`task-dispatch-guard.mjs` (no `runCursorHook` guard) during testing.

## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Notes |
|---|---|---|
| Scope | 6/25 | 13 symlinks + 1 new README + 1 reference-doc addendum; no application logic touched. |
| Risk | 5/25 | Purely additive/organizational; the one real risk (accidental hooks.json repoint) is mitigated by explicit, duplicated documentation. |
| Research | 4/20 | One `WebFetch` to confirm the official convention, plus direct empirical testing of the symlink behavior. |
| **Total** | **15/70** | **Level 2** (kept consistent with sibling phases in this packet). |

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Symlink accidentally used as the wiring source | Low | Medium (4 hooks silently go dark) | Documented in 2 places, explicit "do not repoint" language |
| Broken symlink from a future file move | Low | Low (organizational only, doesn't affect real wiring) | `find ... ! -exec test -e` check is cheap to re-run |

## 11. USER STORIES
- As the operator, I want every Cursor hook script visible at the path Cursor's own docs call conventional, so browsing `.cursor/` shows the full hook inventory at a glance.
- As a maintainer, I want the symlink-vs-real-path behavioral difference documented before anyone assumes the mirror is safe to wire directly.

## 12. OPEN QUESTIONS
None — a direct, fully-executed request with one real technical finding along the way.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md` (this phase)
- `../005-hooks-sk-code-alignment/spec.md` (predecessor)
- `../../spec.md` (phase-parent packet)
- `.cursor/hooks/README.md`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md`
