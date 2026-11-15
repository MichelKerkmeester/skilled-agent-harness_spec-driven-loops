---
title: "Tasks: Phase 3: dsh-mistral-route"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh mistral route tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 3: dsh-mistral-route

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

`H` is `.skilled/skills/cli-external-orchestration/cli-deepseek-harness`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Compose the draft route offline (`scratch/draft-route-mistral-deepseek.patch.yml`). Verify: `--dump-config` exits 0 with empty stderr and `agent-default-model` names `mistral`.
- [x] T002 Check which reasoning field Mistral accepts (`spec.md`). Verify: `reasoning_effort` returns 200 and `thinking` returns 422.
- [x] T003 Locate the preflight's route list (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`). Verify: `rg -n 'route-opencode-go-deepseek' .skilled/hooks/dispatch/lib` prints the `DSH_ROUTE_PATCHES` entry.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the route patch (`.dsh/patches/route-mistral-deepseek.patch.yml`). Verify: `rg -c 'thinkingFormat' .dsh/patches/route-mistral-deepseek.patch.yml` prints 0.
- [x] T005 Add the third roster row (`H/references/providers-and-models.md`). Verify: `rg -n 'route-mistral-deepseek' H/references/providers-and-models.md` prints a line.
- [x] T006 Name the third route in the `closed-roster` and `route-patch-required` messages (`H/hard-rules.json`). Verify: the file parses as JSON and `rg -c 'route-mistral-deepseek' H/hard-rules.json` prints 1.
- [x] T007 Admit the third patch in the preflight (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`). Verify: the new test accepts the Mistral route and still refuses a second route beside it, and the existing `route-unapproved` case still fails `closed-roster`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [B] T008 Run a keyed harmless dispatch (`scratch/`). Verify: exit 0 and `final.reason.kind` is `completed`. A keyless run on 2026-11-14 passed the preflight and failed only with `MISSING_CREDENTIAL` naming `MISTRAL_API_KEY`.
- [B] T009 Run the same dispatch with the patch's default `max` (`scratch/`). Verify: exit 0 and no `UNSUPPORTED_REASONING_EFFORT` on stderr.
- [x] T010 Run the dispatch hook tests (`.skilled/hooks/dispatch/`). Verify: `node --test lib/dispatch-rule-checks.test.mjs tests/dsh-dispatch.test.mjs` prints `pass 53`, `fail 0` (baseline 52).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed: two keyed runs recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
