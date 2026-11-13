---
title: "Tasks: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "compiled route rule growth tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Cap the mode-subset size the hub registry compilers enumerate so a compiled route call stays fast as a hub gains modes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`A` is `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout`. `SYNC` is `node .skilled/bin/compiled-route-sync.cjs`. `MAN` is `node .skilled/bin/compiled-route-manifest.cjs`. `M` is `node specs/sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth/scratch/measure-rule-counts.cjs`. `T` is `.skilled/bin/tests/compiled-route-rule-bound.test.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the bin tests pass before any edit (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/` reports `tests 173` and `fail 0`.
- [x] T002 Read how a refreshed served manifest and its authored copy are kept equal, and record the answer in `spec.md` section 7 (`.skilled/bin/lib/compiled-route-manifest.cjs`). Verify: `rg -c 'Decision: unknown' specs/sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth/spec.md` prints nothing and exits 1.
- [x] T003 Record the rule-count baseline (`specs/sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth/scratch/measure-rule-counts.cjs`). Verify: `M` prints `rules=26`, `rules=247` and `rules=4`.
- [x] T004 Confirm the served copies match before any edit (`.skilled/bin/compiled-route-sync.cjs`). Verify: `SYNC --check` prints `all 55 served copies match their authored files`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the bound test from `plan.md` and watch it fail on the uncapped compilers (`.skilled/bin/tests/compiled-route-rule-bound.test.cjs`). Verify: `node --test T` exits 1 and names `001-sk-code` and `003-mcp-tooling`.
- [x] T006 Add `MAX_BUNDLE_MODES`, cap both builders and correct the comment (`A/001-sk-code/lib/registry-compiler.cjs`). Verify: `rg -c 'MAX_BUNDLE_MODES' A/001-sk-code/lib/registry-compiler.cjs` prints 4.
- [x] T007 Add `MAX_BUNDLE_MODES`, cap both builders and correct the comment (`A/003-mcp-tooling/lib/registry-compiler.cjs`). Verify: `rg -c 'MAX_BUNDLE_MODES' A/003-mcp-tooling/lib/registry-compiler.cjs` prints 4.
- [x] T008 Add `MAX_BUNDLE_MODES`, cap both builders and correct the comment (`A/009-sk-design/lib/registry-compiler.cjs`). Verify: `rg -c 'MAX_BUNDLE_MODES' A/009-sk-design/lib/registry-compiler.cjs` prints 4.
- [x] T009 Correct the comment above `exactBundle` (`A/001-sk-code/lib/canary-router.cjs`). Verify: `rg -c 'finds no match here' A/001-sk-code/lib/canary-router.cjs` prints 1.
- [x] T010 Correct the comment above `exactBundle` (`A/003-mcp-tooling/lib/router.cjs`). Verify: `rg -c 'finds no match here' A/003-mcp-tooling/lib/router.cjs` prints 1.
- [x] T011 Correct the comment above `exactBundle` (`A/009-sk-design/lib/canary-router.cjs`). Verify: `rg -c 'finds no match here' A/009-sk-design/lib/canary-router.cjs` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Rebuild the served copies from the edited authored files (`.skilled/bin/compiled-route-sync.cjs`). Verify: `SYNC` exits 0 and prints the rollback path it retained.
- [x] T013 Verify the rebuilt copies (`.skilled/bin/lib/compiled-routing`). Verify: `SYNC --verify` exits 0.
- [x] T014 Confirm the cap in the rebuilt copies (`specs/sk-doc/hub-routing-and-surfaces/006-compiled-route-rule-growth/scratch/measure-rule-counts.cjs`). Verify: `M` prints `rules=25 bySize={"2":10,"3":10,"4":5}`, `rules=154 bySize={"2":28,"3":56,"4":70}` and `rules=4 bySize={"2":3,"3":1}`.
- [x] T015 Refresh each stale activation manifest the way T002 recorded (`.skilled/bin/lib/compiled-routing/013-live-activation/activation`). Verify: `MAN freshness --hub sk-code --skill-root .skilled/skills/sk-code` and `MAN freshness --hub mcp-tooling --skill-root .skilled/skills/mcp-tooling` each print `"fresh":true`.
- [x] T016 Run every bin test (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/` reports `tests 176` and `fail 0`.
- [x] T017 Finalize the rebuild (`.skilled/bin/compiled-route-sync.cjs`). Verify: after `SYNC --finalize <rollback path>`, `SYNC --check` prints `all 55 served copies match their authored files`.
- [x] T018 Confirm a compiled route still answers (`.skilled/bin/compiled-route.cjs`). Verify: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "review this pull request and fix the failing typescript test"` prints a line containing `"action":"route"`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `M` prints 25, 154 and 4 rules with no bundle size above 4
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
