---
title: "Tasks: Phase 13: context-markdown-design-fixes"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "context markdown design fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: context-markdown-design-fixes

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

**Variables**: `A` is `.skilled/agents`. `AG` is the five copies of one agent: `A/<name>.md`, `.claude/agents/<name>.md`, `.pi/agents/<name>.md`, `.codex/agents/<name>.toml` and `.dsh/agents/<name>.patch.yml`. `scratch/` is this folder's `scratch/`. Line numbers are those at `c1dbb1bcc4`. Find each one again by pattern before editing, because phases 006 and 008 edit these files first.

**Mirror routine** for agent `<name>`: hand-edit `.claude/agents/<name>.md` to match `A/<name>.md`, keeping its frontmatter and its `.claude/agents/*.md` path convention. Then run `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs`, `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs` and `node .skilled/skills/system-spec-kit/runtime/cli/dsh/sync-agents-dsh.cjs`, then `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phases 006 and 008 have landed and read their changes to the three agents and `orchestrate.md` (`A/`). Verify: `git log --oneline c1dbb1bcc4..HEAD -- A/context.md A/markdown.md A/design.md A/orchestrate.md` lists their commits.
- [ ] T002 Re-run every Measured Behavior command in `spec.md` and save the output (`scratch/baseline.txt`). Verify: `rg -c '^\$ ' scratch/baseline.txt` prints 37, each pattern search still finds its line, at the same number or a moved one, and every count from `bash scratch/negative-checks.sh` is above 0 in all five copies.
- [ ] T003 Read 006's answers on the unscored-DQI form, the untrusted-content sentence for `context.md` and the "Daemon-free retrieval" paragraph (`../006-shared-agent-contract/spec.md`). Verify: `rg -n -i 'unscored|n/a|untrusted|daemon-free' ../006-shared-agent-contract/spec.md` prints each decision.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Check the Grep parameter names REQ-001 and REQ-004 will use against the OpenCode and the Claude Code Grep tool schemas, and choose inline `(?i)` where a case flag is not common to both (`scratch/grep-params.txt`). Verify: `rg -c 'opencode|claude' scratch/grep-params.txt` prints 2 or more, one line per runtime naming its parameters.
- [ ] T005 REQ-001: define the trigger Grep lane once in §2 and remove the three Reads of `trigger-index.json` at `:73`, `:79` and `:183` (`A/context.md`). Verify: `rg -c 'Read.{0,6}\.skilled/skills/system-spec-kit/runtime/data/trigger-index\.json' A/context.md` exits 1, and `rg -c 'trigger_phrases' A/context.md` prints 1 or more.
- [ ] T006 REQ-004: restate the §5 Layer 3 recipe as Grep parameters and delete the `--json` and exit-code lines at `:207` and `:209` (`A/context.md`). Verify: `rg -c 'rg --no-config|--json|Exit .1. is a clean no-hit' A/context.md` exits 1.
- [ ] T007 REQ-005: cite `path:line` in the Memory Context lines and the two citation rules at `:252-253`, `:355` and `:379` (`A/context.md`). Verify: `rg -c 'Record #|memory ID' A/context.md` exits 1.
- [ ] T008 REQ-006: delete `:270` and `:359`, move the `:226` clause into §0 `:41`, delete §6 and renumber §7 to §12 (`A/context.md`). Verify: `rg -c '_No sub-agents dispatched|NESTING ENFORCEMENT DETAILS' A/context.md` exits 1, `rg -c '^### Nested Dispatch Status' A/context.md` prints 1 and `rg -c '^## [0-9]+\. ' A/context.md` prints one fewer than in `scratch/baseline.txt`.
- [ ] T009 Add 006's untrusted-content sentence verbatim, only if T003 found that 006 handed it to this phase (`A/context.md`). Verify: `rg -c -i 'untrusted' A/context.md` prints 1 or more when handed over, and T003's record says which case applied.
- [ ] T010 Run the mirror routine for `context` (`.claude/agents/context.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, and the T005 to T008 searches give the same result on every `AG` copy for context.
- [ ] T011 REQ-007: drop `BINDING: template=` from the §0b block and emit it in step 5 after the template is read (`A/markdown.md`). Verify: `sed -n '/^### Setup BINDING Emission/,/^---/p' A/markdown.md | rg -c '^BINDING: '` prints 5 and `rg -c 'LOAD TEMPLATE.*BINDING: template=' A/markdown.md` prints 1.
- [ ] T012 REQ-008: name `extract_structure.py` and `dqi.total` as the DQI source at `:252`, `:143` and `:269`, and use 006's form for an unscored output (`A/markdown.md`). Verify: `rg -c 'extract_structure\.py' A/markdown.md` prints 1 or more and `rg -c 'manual-score' A/markdown.md` exits 1.
- [ ] T013 REQ-009: delete the `memory` row at `:170` (`A/markdown.md`). Verify: `rg -c '^\s*\| .memory. ' A/markdown.md` exits 1.
- [ ] T014 REQ-010: replace the 13 bullets at `:52-64` and the count at `:101` with a pointer to the §5 table (`A/markdown.md`). Verify: `rg -c 'thirteen' A/markdown.md` exits 1 and `sed -n '/^## 5\./,/^## 6\./p' A/markdown.md | rg -c '^\| ./create:'` prints 13.
- [ ] T015 Run the mirror routine for `markdown` (`.claude/agents/markdown.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, and the T011 to T014 searches give the same result on every `AG` copy for markdown.
- [ ] T016 REQ-002: add the CHART and DIAGRAM branches and Step 2c, and carry four paths into `:24`, `:171`, `:183`, §4 and §7 (`A/design.md`). Verify: `rg -c -- '-> (CHART|DIAGRAM)' A/design.md` prints 2, `rg -c '^### Step 2c' A/design.md` prints 1, `rg -c 'check-corpus\.cjs|check-diagram-corpus\.cjs' A/design.md` prints 2 or more and `rg -c 'DECIDE, MEASURE, or both|measure-versus-decide' A/design.md` exits 1.
- [ ] T017 REQ-011: make the §6 NEVER rules the exception in the Step 1 conflict sentence at `:87` (`A/design.md`). Verify: `rg -n 'report the conflict' A/design.md` prints one line containing `NEVER`.
- [ ] T018 REQ-012: state the decide-path edit scope with `quality-gate.cjs --files` after `:97`, and say when `code` implements at `:134` (`A/design.md`). Verify: `rg -c 'quality-gate\.cjs --files' A/design.md` prints 1 or more and `rg -c 'names no file' A/design.md` prints 1.
- [ ] T019 Run the mirror routine for `design` (`.claude/agents/design.md`). Verify: `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0, and the T016 to T018 searches give the same result on every `AG` copy for design.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T020 Run every acceptance command in `spec.md` section 4 on the final tree and save the output (`scratch/after.txt`). Verify: each command prints what its row says, `rg -c '^\$ ' scratch/after.txt` prints at least 12, and every count from `bash scratch/negative-checks.sh` is 0.
- [ ] T021 REQ-003: run the roster check, the mirror check and the line count (`A/`). Verify: `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK`. `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 and prints `all comparable mirrors in sync`. `wc -l A/context.md A/markdown.md A/design.md` prints 600 or less for each.
- [ ] T022 Re-check the consumer this phase keeps true (`A/orchestrate.md`). Verify: `rg -c 'includes Nested Dispatch Status section' A/orchestrate.md` prints 1, unless phase 008 removed that line, in which case T001's record says so.
- [ ] T023 Record one verification row per finding id, context-1 to design-3, with its command and output (`implementation-summary.md`). Verify: `rg -c '^\| (context|markdown|design)-[0-9]' implementation-summary.md` prints 11.
- [ ] T024 Run strict validation on this folder (`spec.md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/007-agent-alignment-follow-ups/013-context-markdown-design-fixes --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `implementation-summary.md` has one verification row for each of the eleven finding ids
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
- **Findings**: See `../scratch/agent-review/agents-review.out.md` and `../scratch/agent-review/finding-to-phase.tsv`
<!-- /ANCHOR:cross-refs -->

---
