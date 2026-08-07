---
title: "Implementation Plan: cli-cursor hook code sk-code/code-opencode alignment"
description: "Plan for auditing and aligning Cursor hook .mjs files against sk-code's code-opencode standards, plus closing a Cursor documentation gap in hooks.md."
trigger_phrases: ["cli-cursor hooks sk-code alignment plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment"
    last_updated_at: "2026-07-24T17:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "All phases complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-sk-code-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cursor hook code sk-code/code-opencode alignment

<!-- ANCHOR:summary -->
## 1. SUMMARY
Read `sk-code`'s routing hub and the `code-opencode` surface's JavaScript/TypeScript standards to establish the actual current rules, audit all 8 Cursor hook adapter files against them, fix the 2 real P0 gaps found in the 5 `.mjs` files (missing box header, forbidden `'use strict'`), verify via `node --check` + functional smoke test + the surface's own `verify_alignment_drift.py`, and close a documentation gap where `code-opencode`'s canonical `hooks.md` omitted Cursor CLI entirely.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] All 5 in-scope `.mjs` files have the P0 box header.
- [x] All 5 in-scope `.mjs` files have no `'use strict'` directive.
- [x] `node --check` passes on all 5 edited files.
- [x] Each edited file's synthetic-payload smoke test output is unchanged from before editing.
- [x] `verify_alignment_drift.py` reports 0 findings against both Cursor hook directories.
- [x] `hooks.md` documents Cursor on par with the existing Claude section.
- [x] `spec-gate-prebind.mjs` left untouched.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
No new architecture — this phase is a style/documentation alignment pass. Reads `sk-code/SKILL.md` → `code-opencode/SKILL.md` → the TypeScript and JavaScript style guides + checklists to establish ground truth, then applies mechanical header/directive edits to 5 existing `.mjs` files and extends one existing reference document (`hooks.md`) with a new section following its existing pattern.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research
- [x] Read `sk-code/SKILL.md` — confirmed the two-axis router (`quality`/`code-review` workflow modes, `code-webflow`/`code-opencode` surface evidence packets).
- [x] Read `code-opencode/SKILL.md` — confirmed the surface's reference map, including a dedicated `references/shared/hooks.md` for "runtime hook entrypoints, checked-in Claude wiring, OpenCode plugin-bridge delivery, and wrapper reachability."
- [x] Read `code-opencode/references/shared/hooks.md` in full — found it documents Claude/OpenCode/GitHub-Copilot in detail with zero mention of Cursor CLI.
- [x] Read the TypeScript style guide (`overview-strict-and-naming.md`) — confirmed all 5 existing Cursor `.ts` hook files already match (header format, PascalCase types, kebab-case filenames, no `any`).
- [x] Read the JavaScript style guide (`style-guide.md`) — found the P0 box-header requirement and the `.mjs`-specific `'use strict'` prohibition.
- [x] Read the JavaScript checklist (`javascript-checklist.md`) — confirmed box header is a P0 hard blocker with an exact COMPONENT/PURPOSE format, cross-checked against a real precedent (`install-codex-hooks.mjs`).
- [x] Read the TypeScript checklist — confirmed no additional gaps in the `.ts` files (no `any`, PascalCase types already correct).
- [x] Grepped all 8 Cursor hook files for `\bany\b` in code (0 real hits) and for forbidden ephemeral-artifact ids (0 hits in this packet's own files; 1 hit in `spec-gate-prebind.mjs`, out of scope).

### Phase 2: Fix
- [x] Measured the exact box-header character widths from a known-compliant reference file (`install-codex-hooks.mjs`) via Python rather than hand-counting, to guarantee byte-perfect visual alignment.
- [x] Generated and validated all 5 box headers (COMPONENT + PURPOSE, ≤71-char inner width) before applying any edit.
- [x] Applied box header + `'use strict'` removal to `spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, `mcp-route-guard.mjs`, `post-tool-use.mjs`, `task-dispatch-guard.mjs`.
- [x] `node --check` on all 5 — all pass.
- [x] Re-ran each file's synthetic-payload smoke test (same payloads phases 010/011 used) — identical response envelopes to before editing.

### Phase 3: Verify + Document
- [x] Ran `verify_alignment_drift.py --root <runtime-hooks-dir> --root <mcp-server-hooks-dir>` — `11 files scanned, 0 findings, 0 errors, 0 warnings, 0 violations`.
- [x] Re-read `.cursor/hooks.json` fresh (not from memory) to build an accurate Cursor hooks table.
- [x] Inserted a new `## 4. CURSOR HOOKS` section into `hooks.md` (event/matcher/command/timeout/purpose table, wiring-shape example, "not wired" callout for `spec-gate-prebind.mjs`/`mcp-route-guard.mjs`), renumbered sections 4-7 to 5-8.
- [x] Touched up the dynamic-load-pattern registration table, Key Sources table, and Cross-Runtime Parity table to include Cursor; bumped the file's frontmatter version and trigger phrases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Three independent layers: (1) `node --check` for syntax validity, (2) a functional smoke test with the exact synthetic payloads used in phases 010/011 to confirm behavior is unchanged, (3) the surface's own automated `verify_alignment_drift.py` as an independent, tool-based confirmation rather than trusting the manual read alone.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| `sk-code/code-opencode` surface packet | Internal | Green (read in full) | Source of the standards this phase aligns against |
| `verify_alignment_drift.py` | Internal | Green (ran successfully) | Independent automated confirmation |
| Phases 004/010/011's hook adapters | Internal | Green (all committed) | The files this phase edits |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git checkout` the 5 specific `.mjs` files and `hooks.md` to revert. Purely cosmetic/documentation changes with no behavioral dependency — confirmed via the unchanged functional smoke-test output.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet (phases 004/010/011's hook files specifically).
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Research (read 6 standards docs) | Medium | 30 min |
| Fix (5 files, precise header generation) | Low | 30 min |
| Verify + document (hooks.md extension) | Medium | 30 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
Low blast radius: cosmetic header/directive edits to 5 files (no logic touched, confirmed via smoke test) + additive documentation to 1 reference file. Fully reversible via `git checkout`.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `.opencode/skills/sk-code/code-opencode/SKILL.md`, `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md`
