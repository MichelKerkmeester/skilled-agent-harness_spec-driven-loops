---
title: "Tasks: Close every deferred and pre-existing failure the Pi carve-out surfaced"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deferred closure tasks"
  - "drift verifier tasks"
  - "playbook heading rename"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/067-deferred-closure"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks executed and verified"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-067-deferred-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Close every deferred and pre-existing failure the Pi carve-out surfaced

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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
## Phase 1: Measure

- [x] T001 Count drift findings per top-level area [evidence: barter 3,311 · specs 1,685 · .worktrees 1,200 · .opencode 37 · .pi 11 · tmp 4]
- [x] T002 Establish which areas are repository content [evidence: `git check-ignore` — `barter`, `.worktrees`, `tmp` all ignored, 0 tracked files each]
- [x] T003 Split errors from warnings [evidence: 3,513 errors / 2,735 warnings; the gate fails on errors only, warnings are non-blocking by design]
- [x] T004 Measure the tracked-only rule before writing it [evidence: 3,275 of 3,513 errors are in untracked files; 238 tracked remain]
- [x] T005 Verify the JSONL hypothesis across every accused file, not a sample [evidence: 217/217 parse as JSONL line-by-line; 0 genuinely malformed]
- [x] T006 Audit every declared hard-rule check against the registry [evidence: 11 unregistered across cli-codex, cli-cursor, cli-devin, cli-pi; cli-opencode and cli-claude-code clean]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fix the producers

### WS1 — Drift verifier

- [x] T010 Add `tracked_paths()` — realpaths from `git ls-files`, `None` outside a checkout (`verify_alignment_drift.py`)
- [x] T011 Filter `iter_code_files` through the tracked set
- [x] T012 Filter `check_router_paths` through it too [the 3 ROUTER-DEAD-PATH errors survived T011 because that walk is separate]
- [x] T013 Add `is_jsonl()` and consult it before reporting a parse failure; a single unparsable line is still an error
- [x] T014 Replace the interim-backlog carve-out with the real contract (`sk-code-opencode/SKILL.md`)

### WS2 — Hard-rule engine

- [x] T020 Add `binaryOnPathCheck()` and register the four `command-v-*` checks (`dispatch-rule-checks.mjs`)
- [x] T021 Replace the single `opencode run` regex with `HEADLESS_DISPATCH_SHAPES` covering all six CLIs
- [x] T022 Remove 7 `hard_rules` entries whose checks cannot be answered from a command string (`cli-{codex,cursor,devin,pi}/SKILL.md`)
- [x] T023 Generalise the CI guard to enumerate every `cli-*` packet and assert at least six are scanned
- [x] T024 Cover the widened stdin rule and the availability fail-open path
- [x] T025 Replace the drifted `length, 1` assertion with an id assertion [pre-existing failure: cli-claude-code has carried two rules since its permission-mode rule landed]

### WS3 — Playbooks

- [x] T030 Rename `### Pass / Fail` -> `### Verdict` and `### Failure Triage` -> `### Triage` across 84 snippets
- [x] T031 Reword the one sentence containing "classify", which the overclaim guard bans outright [84 files, one identical sentence]

### WS4 — The residue the producers were hiding

- [x] T040 Add `MODULE:` headers to 4 `.d.ts` files (2 in `.opencode`, 2 in the vendored-fork pi extension)
- [x] T041 Add `MODULE:` headers to 8 spec-packet `.ts` runners
- [x] T042 Add `#!/usr/bin/env python3` to 5 spec-packet scripts
- [x] T043 Add `set -uo pipefail` to 4 shell scripts, after reading every consumer of the two sourced ones

### WS5 — Documents and stale references

- [x] T050 Split the vitest suite out of the `node --test` command line (`hooks/README.md`)
- [x] T051 Correct the retired-package references (`.pi/SYNC.md`, `system-spec-kit/runtime/cli/pi/README.md`, `sync-agents-pi.cjs` comment)
- [x] T052 Accept the `.opencode/specs` alias without weakening real-path containment (`repair-derived.cjs`)
- [x] T053 Record the two 066 findings that proved overstated rather than real
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T060 `bash -n` on all 4 edited shell scripts [evidence: 4/4 OK]
- [x] T061 `py_compile` on all 5 edited Python scripts [evidence: 5/5 OK]
- [x] T062 `validate_document.py` on a renamed snippet [evidence: VALID, 0 issues]
- [x] T063 Full drift gate [evidence: `Errors: 0`; all 3 guards PASSED — first clean run]
- [x] T064 Playbook package validator [evidence: PASS, 98/98 cells, 0 missing/orphan/duplicate]
- [x] T065 Hook suites under their own runners [evidence: node:test 23/23 · dispatch-audit vitest 74/74 · pi hook vitest 34/34]
- [x] T066 Re-audit declared checks [evidence: 0 unregistered]
- [x] T067 `sync-agents-pi.cjs --check` after the comment edit [evidence: PASS, 12 agents in sync]
- [x] T068 Confirm `repair-derived.cjs` accepts the alias and still refuses an outside path [evidence: `.opencode/specs/...` inspected=1; `.opencode/skills` refused]
- [x] T069 Confirm the pre-existing dirty files are well-formed and pass their own suite [evidence: 0 malformed JSON; `template-structure.vitest.ts` 8/8]
- [x] T070 `validate.sh --strict` on both packets [evidence: `RESULT: PASSED`, Errors: 0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every gate green because its subject is correct, with no tracked file exempted
- [x] Error reduction attributable: 3,275 untracked + 217 JSONL false + 21 real fixes = 3,513
- [x] `validate.sh --strict` printed an explicit `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Closure Gate**: See `acceptance-criteria.md`
- **Origin**: `../066-pi-self-dispatch-and-subagents-retirement/`
<!-- /ANCHOR:cross-refs -->
