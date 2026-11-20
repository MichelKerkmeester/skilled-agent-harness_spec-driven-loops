---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "upstream code alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/007-overlay-framework-root-layout/016-upstream-code-alignment"
    last_updated_at: "2026-11-20T23:53:09Z"
    last_updated_by: "generate-context"
    recent_action: "Aligned 13 overlaid upstream files with sk-code, review approved"
    next_safe_action: "Run the reverse handoff into Barter's overlay copies"
    packet_purpose: "Purpose: Each Skilled counterpart of an overlaid code file meets the standard's behavior-neutral rules, so Barter's copy and its source agree on the lines neither changes on purpose."
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".skilled/scripts/git-hooks/pre-push"
    session_dedup:
      fingerprint: "sha256:7bbaa22acded70c3ef22aa770a3fc3f17cae674f409e6c1d041585a175b65ade"
      session_id: "scaffold-016-upstream-code-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-upstream-code-alignment |
| **Completed** | 2026-11-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Thirteen of the 24 Skilled files Barter overlays now meet sk-code's Skilled standard on every rule a comment-level fix can meet. Ten were already aligned within that scope, and one is skipped. Every change is a header, a comment, a doc comment or a section divider. Each fix that a handoff item named carries the same text as Barter's copy, so a repin brings no new difference on those lines.

### Phase 16: upstream code alignment for overlaid files

When Barter fixes one of these flaws in its overlay copy, the Skilled source now has the same fix, so the next repin does not bring the flaw back. The audits found the flaws: four cli-pi sweeps over 22 files, and one @review pass over `fanout-run.cjs` and its test. A finding whose only fix would rename an identifier, move code or change a string is recorded below as not fixed.

### Per-file record

| File | Result | What |
|------|--------|------|
| `.skilled/scripts/git-hooks/pre-push` (also reached as `.opencode/scripts/git-hooks/pre-push`) | Fixed | COMPONENT box, the same as Barter's. Exit codes, purpose comments on the fallback functions and the EXIT trap, a trailing comment moved above its line |
| `.skilled/scripts/git-hooks/pre-commit` | Fixed | COMPONENT box, exit codes, function purpose comments, a capital letter, and the empty "tool ownership map gate" heading rewritten to say no such gate runs here |
| `.skilled/scripts/git-hooks/post-merge`, `.skilled/scripts/git-hooks/post-rewrite` | Fixed | COMPONENT box. Barter has no copy of either |
| `.skilled/scripts/git-hooks/tests/pre-push.test.sh` | Fixed | COMPONENT box, the same as Barter's. Stale header and section comments about the removed naming gate, exit codes, six usage comments moved above their functions |
| `.skilled/scripts/git-hooks/commit-msg`, `.skilled/scripts/git-hooks/prepare-commit-msg` | Aligned | No finding |
| `.skilled/bin/compiled-route-guard.cjs` | Fixed | MODULE header, the same as Barter's. Numbered sections, JSDoc on its three exported functions, capital header labels |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs` | Skipped | A byte-identical twin sits in the authored program under `specs/`, and `compiled-route-sync.cjs --check` fails when a served copy differs from its twin. `specs/` history is out of this phase's scope |
| `.skilled/bin/tests/compiled-route-fold-dedupe.test.cjs`, `compiled-route-surface-hint.test.cjs` | Aligned | No finding |
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Fixed | Descriptions on every tag of its five exported JSDoc blocks, and a numbered EXPORTS divider |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Aligned | No finding |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Fixed | TSDoc on `isDshModelAllowed` and `assertExecutorWebSearchCapability` and the reason above the roster non-null assertion, all the same as Barter's. Trailing sandbox comments moved to the line before |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Fixed | `5. EXPORTS` box, the same as Barter's. JSDoc on the 38 exported functions that had none, and the `runLineageProcess` JSDoc moved to its function |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Fixed | Section title, JSDoc on its five exports, an EXPORTS divider |
| `.skilled/skills/system-spec-kit/shared/review-research-paths.cjs` | Fixed | `Conventions:` and the `repo-root.mjs` require in IMPORTS, the same as Barter's. A real spec folder name replaced by `NNN-phase-name`, JSDoc on three exports, an EXPORTS divider |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/relocate.vitest.ts` | Fixed | Section dividers. `relocate.vitest.ts` also gets the reason for its snake_case fixture keys |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `opencode-dual-dispatch.vitest.ts`, `fanout-run.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/cli/tests/review-research-paths.vitest.ts` | Aligned within scope | What the audits report there is a test title, an import order or a whole-file renumbering |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/relocate.mjs` | Aligned within scope | Every finding is a move, a rename, a magic value or line length |

### Handoff items

The list was read at 23:13, 23:45 and 00:01, and the last read found no new item for these files.

| Item | Result |
|------|--------|
| `compiled-route-guard.cjs` MODULE header | Applied, the same as Barter's |
| `pre-push` COMPONENT box | Applied, the same as Barter's |
| `pre-push.test.sh` COMPONENT box | Applied, the same as Barter's |
| `executor-config.ts` TSDoc on `isDshModelAllowed` | Applied, the same as Barter's |
| `executor-config.ts` roster non-null comment | Applied, the same as Barter's |
| `executor-config.ts` TSDoc on `assertExecutorWebSearchCapability` | Applied, the same as Barter's |
| `fanout-run.cjs` EXPORTS section | Applied, the same as Barter's |
| `review-research-paths.cjs` `Conventions:` | Applied, the same as Barter's |
| `review-research-paths.cjs` require into IMPORTS | Applied. `repo-root.mjs` imports only `node:fs` and `node:path`, defines only functions and constants, and never requires this file |
| `verify-router-sync.cjs` README skip in `walkMarkdown` | Not applied. It changes what the drift guard reports, and this phase changes no behavior. It is open for a follow-up with its own test |
| Engine: `apply` copies a git-ignored `__pycache__` from a directory entry | Not applied. An engine behavior change outside this packet's README scope, open for a follow-up |

### Reverse handoff

Every fix marked as not in Barter's copy above now exists only in Skilled. The ai-speckit session can copy those lines into its overlay copies so the two agree.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two workers edited disjoint file sets on the worktree branch, under one rule: a line a handoff item names takes Barter's text byte for byte. A filter over `git diff -U0` shows the only changed lines that are not comments are the moved trailing comments, the `const` the moved JSDoc used to sit on, and the hoisted require. The covering suites then ran against the baselines captured at `bf6806ad4b3`. The fixes are commits `286359e2239` and `e17872485b6`. The @review pass approved them with no P0 or P1, after checking 29 of the 38 new `fanout-run.cjs` JSDoc blocks against their function bodies. Three of its P2 doc-comment findings were fixed in `ff969f029fb`. The fourth, moving the compiled-route guard's `//` paragraphs into its JSDoc, was left as is.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Behavior-neutral fixes only | A header or comment edit is proven harmless by the existing suites. A rename, a moved declaration or a `[ ]` to `[[ ]]` change needs proof they do not give |
| Skip `canary-router.cjs` | Its authored twin under `specs/` must change in the same commit, or `compiled-route-sync.cjs --check` fails |
| Keep the orphaned TSDoc in `executor-config.ts` | Barter's copy keeps it too and adds a separate block, so removing it upstream would make a new difference |
| Folder entries out of scope | `local-skilled-alignment` is a gitignored private command, and `sk-code-frontend` and `sk-git` are whole trees Barter replaces wholesale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/scripts/git-hooks/tests/<name>.test.sh` for the seven hook suites | PASS: pre-push 50, pre-commit 152, commit-msg 45, source-root-selection 56, message contract 15, prepare-commit-msg 80, autostash 9, all equal to baseline |
| `node --test .skilled/bin/tests/compiled-route-*.test.cjs` | 115 pass, 1 fail, equal to baseline: the failure, "preserves the external manifest across the sync capture/restore round trip", was already there at `bf6806ad4b3` |
| `node --test` on the two symlink suites | PASS, 59 of 59 |
| deep-loop vitest over the four covering files | PASS, 407 of 407 |
| spec-kit vitest over `relocate` and `review-research-paths` | PASS, 51 of 51 |
| `bash -n` and `node --check` on every edited script | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **TypeScript was not type-checked.** The deep-loop runtime has no `tsc`, so `executor-config.ts` is covered by its vitests only. The change there is comments and TSDoc.
2. **Thirteen fixes exist only in Skilled.** Barter's copies gain them only when the ai-speckit session copies them, as the reverse handoff above says.
<!-- /ANCHOR:limitations -->

---


