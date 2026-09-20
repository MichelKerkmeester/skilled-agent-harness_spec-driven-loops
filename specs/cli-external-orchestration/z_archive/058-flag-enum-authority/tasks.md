---
title: "Tasks: Flag Enum Authority"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "flag enum authority tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Flag Enum Authority

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Probe every candidate permission-mode value against the installed binary — `devin --permission-mode <v> --prompt-file /nonexistent` on `devin 3000.6.7`: 8 accepted (`auto`, `normal`, `accept-edits`, `smart`, `dangerous`, `yolo`, `bypass`, `autonomous`)
- [x] T002 Confirm the probe discriminates using Claude-only values as negative controls — `plan` and `manual` both returned exit 2 `invalid value ... Invalid`, while all 8 valid values returned exit 1 on the file read
- [x] T003 Recover the canonical alias grouping from the binary error captured in the playbook — `manual-testing-playbook/manual-testing-playbook.md:47` embeds the 3000.2.17 error: `normal (auto), accept-edits, dangerous (yolo, bypass), autonomous (requires --sandbox)`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Correct the `--permission-mode` row to the full enum with aliases (`cli-devin/references/cli-reference.md`)
- [x] T005 Append the session-free probe recipe with exit-code semantics (`cli-devin/references/cli-reference.md`)
- [x] T006 Add the dispatch-time gotcha (`cli-devin/SKILL.md`)
- [x] T007 Add the CLI-agnostic rule to the hub ALWAYS list (`cli-external-orchestration/SKILL.md`)
- [x] T011 Audit the eight statically-checkable DV-* scenarios against `devin 3000.6.7` — `DV-003`/`DV-018`/`DV-020` hold; `DV-002`/`DV-012` superseded; `DV-004` inverted; `DV-014`/`DV-016` obsolete by operator decision (`.devin/SYNC.md:20`)
- [x] T012 Verify the roster property with the purpose-built checker rather than a hand count — `agent-roster-mirror-check.cjs` returns `STATUS=OK`, 12/12 across all five runtimes
- [x] T014 Re-target `DV-016` at `.devin/agents/*/AGENT.md` (v2.0.0.0) — step-1 strict parse verified live: 0 failures across 12 profiles
- [x] T013 Banner `DV-012` and `DV-016`, and annotate the results index without rewriting any recorded row
- [x] T008 Banner the stale scenario without overwriting its recorded evidence (`manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm all four edits landed at their target lines — `cli-reference.md:113`, `cli-devin/SKILL.md:344`, `cli-external-orchestration/SKILL.md:169`, `smart-permission-doc-runtime-mismatch.md:11`
- [x] T010 Validate the packet with `validate.sh --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Enum published matches probe output exactly
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
