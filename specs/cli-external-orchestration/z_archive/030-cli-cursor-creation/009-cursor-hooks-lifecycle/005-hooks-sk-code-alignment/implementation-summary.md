---
title: "Implementation Summary: cli-cursor hook code sk-code/code-opencode alignment"
description: "Aligned all Cursor .mjs hook files with sk-code's code-opencode JavaScript standards (box header, no 'use strict'), verified via node --check + functional smoke test + the automated verify_alignment_drift.py; closed a documentation gap where code-opencode's canonical hooks.md omitted Cursor CLI entirely."
trigger_phrases: ["cli-cursor hooks sk-code alignment implementation", "cursor hook box header fix"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/005-hooks-sk-code-alignment"
    last_updated_at: "2026-07-27T03:27:34Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented, independently verified, and validated"
    next_safe_action: "Commit"
    blockers: []
    key_files: [".opencode/skills/sk-code/code-opencode/references/shared/hooks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-sk-code-alignment", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 005-hooks-sk-code-alignment |
| **Completed** | 2026-07-24 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

All Cursor hook adapter code this packet owns now aligns with `sk-code`'s `code-opencode` surface standards, and the surface's own canonical `hooks.md` reference now documents Cursor CLI for the first time.

### Code fixes (2 real P0 gaps, 5 files)
`code-opencode`'s JavaScript checklist names the box header (`COMPONENT`/`PURPOSE` format) as a P0 hard blocker for every JavaScript file, and its style guide explicitly prohibits `'use strict'` in `.mjs` files ("ES modules are strict by definition"). All 5 Cursor `.mjs` hook files this packet owns had BOTH gaps: `spec-gate-enforce.mjs`, `spec-gate-classify.mjs` (phase 004 originals), and `mcp-route-guard.mjs`, `post-tool-use.mjs`, `task-dispatch-guard.mjs` (phase 011 additions, which had propagated the same non-conformant style from the phase-004 files they modeled themselves on).

Both gaps are now fixed in all 5 files. `spec-gate-prebind.mjs` — a concurrent session's still-uncommitted, unreviewed file with the same gaps — was deliberately left untouched; it is not this packet's file to edit.

### Documentation gap closed
`code-opencode/references/shared/hooks.md` is the canonical, cross-runtime reference for "runtime hook entrypoints, checked-in Claude wiring, OpenCode plugin-bridge delivery, and wrapper reachability." Despite phases 004/010/011 of this same packet shipping a full Cursor hook adapter layer and a committed `.cursor/hooks.json`, this file had **zero mention of Cursor CLI anywhere** — the Claude, OpenCode, and GitHub/Copilot sections existed; Cursor did not. A new `## 4. CURSOR HOOKS` section now documents all 12 live entries from `.cursor/hooks.json` in the same Event/Matcher/Command/Timeout/Purpose table format the Claude section uses, plus a wiring-shape example and an explicit "Not Wired" callout for `spec-gate-prebind.mjs`/`mcp-route-guard.mjs`. The file's dynamic-load-pattern registration table, Key Sources table, and Cross-Runtime Parity table were all updated to include Cursor as a fourth runtime; subsequent sections were renumbered 5-8.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read `sk-code/SKILL.md` first to confirm the two-axis router and that `code-opencode` is the correct surface for `.opencode/`-tree system code (not a workflow mode itself, but an evidence packet bundled alongside `quality`/`code-review`).
2. Read `code-opencode/SKILL.md`'s reference map, which explicitly names `references/shared/hooks.md` as the hooks evidence source and points to language-specific style/quality/checklist trios.
3. Read `hooks.md` in full — this is where the documentation gap was discovered, not assumed in advance.
4. Read the TypeScript style guide and checklist, and audited all 5 Cursor `.ts` hook files against it — found already fully compliant (correct box-comment header format, `PascalCase` interfaces, `kebab-case` filenames, no `any` in public API). No `.ts` changes were needed.
5. Read the JavaScript style guide and checklist — this is where the 2 real gaps (box header, `'use strict'`) were found, both confirmed against all 5 in-scope `.mjs` files by direct grep, not assumption.
6. Measured the exact box-header character widths from a known-compliant precedent already in this repo (`install-codex-hooks.mjs`) using Python rather than hand-counting box-drawing characters, to guarantee byte-perfect visual alignment with the established convention.
7. Generated and validated all 5 COMPONENT/PURPOSE box headers (with a strict width check that raised on overflow) before applying any edit, catching 2 purpose strings that were initially too long and shortening them to fit.
8. Applied the header insertion + `'use strict'` removal to each of the 5 files via targeted `Edit` calls (not a rewrite), preserving every other line exactly.
9. Ran `node --check` on all 5 files, then re-ran each file's exact synthetic-payload smoke test from earlier phases and confirmed byte-identical response envelopes to before editing — proving the cosmetic edits changed nothing behavioral.
10. Ran `code-opencode`'s own `verify_alignment_drift.py` against both Cursor hook directories as an independent, tool-based confirmation rather than relying on the manual read alone — `11 files scanned, 0 findings`.
11. Re-read the live `.cursor/hooks.json` fresh (not from memory of an earlier phase's summary) before building the new `hooks.md` section, to guarantee the documented table matches the actual shipped config exactly.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **Fix all 5 in-scope `.mjs` files, not just the 3 newest ones.** The 2 phase-004 originals (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`) had the same gaps as the 3 phase-011 additions that had modeled their own style on them — the operator's request ("all hook code") reasonably extends to every file this packet owns, not just the most recently authored ones.
- **Leave `spec-gate-prebind.mjs` untouched despite having the same gaps.** It belongs to a concurrent session's still-uncommitted, unreviewed work; fixing its style would mean editing a file this packet does not own, matching the same discipline phases 009-012 already applied to it.
- **Verify with the surface's own automated tool, not just a manual re-read.** `verify_alignment_drift.py` exists specifically to catch this class of drift; running it is strictly more rigorous than trusting a manual line-by-line check, and it independently confirmed 0 findings.
- **Extend `hooks.md` rather than leave the Cursor gap for a future session.** The operator's request was specifically about `sk-code`/`code-opencode` alignment, and a "hooks" reference that omits an entire shipped runtime is itself a standards gap on the documentation axis, not just the code axis.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| Box header present, all 5 files (SC-001) | PASS |
| `'use strict'` absent, all 5 files (SC-002) | PASS |
| `node --check`, all 5 files (SC-003) | PASS |
| Functional smoke test unchanged (SC-004) | PASS |
| `verify_alignment_drift.py` (SC-005) | PASS — `11 files scanned, Findings: 0, Errors: 0, Warnings: 0, Violations: 0` |
| `hooks.md` Cursor section matches live config (SC-006) | PASS — all 12 entries verified against a fresh read of `.cursor/hooks.json` |
| `spec-gate-prebind.mjs` untouched | PASS — confirmed via `git status --porcelain` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. `hooks.md`'s new Cursor section is a snapshot of `.cursor/hooks.json` at documentation time — any future hook addition/removal needs a matching `hooks.md` update, per the file's own pre-existing "Adding/Removing a Hook" maintenance checklist (which already applies to every runtime, not a new obligation this phase created).
2. This phase did not run sk-code's own `run-all-drift-guards.sh` triad (the RESOURCE_MAP/router-sync bijection suite) — that verifies `sk-code`'s own internal self-consistency, not arbitrary files elsewhere in the repo, and is not applicable to auditing files outside `sk-code/` itself.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `.opencode/skills/sk-code/code-opencode/references/shared/hooks.md` (the doc this phase extends)
