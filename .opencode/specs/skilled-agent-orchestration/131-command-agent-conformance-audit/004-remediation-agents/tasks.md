---
title: "Tasks: Phase 4: Remediate Agent Files (Both Runtimes)"
description: "One task per AGT finding (9 findings, 26 tasks total), grouped P1 before P2, each fix task followed by a [P] grep-verification task, ending with a validate.sh --strict task."
trigger_phrases:
  - "tasks"
  - "agent remediation tasks"
  - "AGT findings tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/004-remediation-agents"
    last_updated_at: "2026-07-11T08:49:20Z"
    last_updated_by: "fable-5"
    recent_action: "Replaced scaffold with 26 findings-mapped tasks; bumped to Level 2"
    next_safe_action: "Execute T001 first (AGT-03 schema branch, unblocks T006/T014)"
    blockers:
      - "AGT-05 fix is gated on an operator design decision (.codex/agents restore vs remove)"
    key_files:
      - ".opencode/skills/sk-doc/create-agent/SKILL.md"
      - ".claude/agents/deep-improvement.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Phase 4: Remediate Agent Files (Both Runtimes)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] <FINDING-ID>: Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Root-cause schema fix — must land first. Effort: 45-60m.

- [x] T001 AGT-03: Add per-runtime frontmatter schema branch — `tools:` for `.claude/agents/`, `permission:` for `.opencode/agents/` (`.opencode/skills/sk-doc/create-agent/SKILL.md:71-96`) [30m] — DONE: replaced single-schema "Canonical Frontmatter" section with a runtime-branch table + decision rule + both YAML examples (SKILL.md:71-130); also fixed the false-universal ALWAYS rule at SKILL.md:191.
- [x] T002 [P] AGT-03: Add a dual-schema row to the frontmatter comparison table (`.opencode/skills/sk-doc/create-agent/assets/agent_template.md:34`) [15m] — DONE: `agent_template.md:33-35` now has separate "Frontmatter (OpenCode)" and "Frontmatter (Claude Code)" rows; Section 2 also gained a `tools:` YAML example + decision rule (`agent_template.md:89-100`).
- [x] T003 AGT-08: Replace "deprecated" wording for `tools:` with "runtime-specific" + add the decision rule (`.opencode/skills/sk-doc/create-agent/SKILL.md:105`) [10m] — DONE: rule 5 (line ~130) now reads "`tools:` is the runtime-specific canonical schema... never emit `permission:` there".
- [x] T004 AGT-08: Replace "deprecated" wording for `tools:` at the second site (`.opencode/skills/sk-doc/create-agent/SKILL.md:177`) [10m] — DONE: NEVER item 3 (line ~202) now reads "`tools:` is runtime-specific, not obsolete: it is Claude Code's canonical schema."
- [x] T005 [P] Verify Phase 1: `grep -c "deprecated" .opencode/skills/sk-doc/create-agent/SKILL.md` = 0; both SKILL.md and agent_template.md document `tools:` for `.claude/agents/` and `permission:` for `.opencode/agents/` [10m] — VERIFIED: `grep -c "deprecated" SKILL.md` = 0, `grep -c "deprecated" agent_template.md` = 0; both files document the runtime branch (SKILL.md:73-100, agent_template.md:33-35+89-100).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [2-2.5h]

### P1 — Required (AGT-01, AGT-02, AGT-04)

- [x] T006 AGT-02: Normalize `.claude/agents/deep-improvement.md` frontmatter (lines 4-19) from OpenCode `permission:` to Claude `tools: Read, Write, Edit, Bash, Grep, Glob` — depends on T001 [20m] — DONE: `mode`/`temperature`/`permission:` block replaced with `tools: Read, Write, Edit, Bash, Grep, Glob` (deny-listed webfetch/memory/chrome_devtools/task/patch/list/external_directory excluded); `python3 -c "import yaml; ..."` confirmed the frontmatter parses.
- [x] T007 [P] Verify T006: `grep -c '^tools:' .claude/agents/deep-improvement.md` = 1; `grep -c '^permission:' .claude/agents/deep-improvement.md` = 0 [5m] — VERIFIED: both counts confirmed exactly as specified.
- [x] T008 [P] AGT-01: Change `.opencode/agents/*.md` → `.claude/agents/*.md` in the Path Convention line (`.claude/agents/deep-research.md:11`) [10m] — DONE: line 11 now reads "Use only `.claude/agents/*.md` as the canonical runtime path reference."
- [x] T009 [P] AGT-01: Change `.opencode/agents/*.md` → `.claude/agents/*.md` in the Path Convention line (`.claude/agents/markdown.md:11`) [10m] — DONE: line 11 now reads "Use only `.claude/agents/*.md` as the canonical runtime path reference."
- [x] T010 [P] Verify T008/T009: `grep -rn "\.opencode/agents" .claude/agents/deep-research.md .claude/agents/markdown.md` returns no matches [5m] — VERIFIED: grep returns zero matches (exit 1) in both files.
- [x] T011 [P] AGT-04: Add `research/deltas/iter-NNN.jsonl` to the write-allowlist (`.opencode/agents/deep-research.md:69-73`) [15m] — DONE: allowlist line (now :71) + the overwrite-guard line both mention `research/deltas/iter-NNN.jsonl`.
- [x] T012 [P] AGT-04: Add `research/deltas/iter-NNN.jsonl` to the write-allowlist (`.claude/agents/deep-research.md:52-56`) [15m] — DONE: allowlist line (now :54) + the overwrite-guard line both mention `research/deltas/iter-NNN.jsonl`.
- [x] T013 [P] Verify T011/T012: `grep -n "research/deltas/iter" .opencode/agents/deep-research.md .claude/agents/deep-research.md` returns a match in each file [5m] — VERIFIED: one match each (`.opencode/agents/deep-research.md:71`, `.claude/agents/deep-research.md:54`).

### P2 — Optional (complete OR documented deferral: AGT-05, AGT-06, AGT-07, AGT-08, AGT-09)

- [x] T014 [P] AGT-09: Add a `--type agent` frontmatter pass to `validate_document.py` — require `tools:` under `.claude/agents/`, require `permission:` under `.opencode/agents/`, warn on the wrong schema — depends on T001 (`.opencode/skills/sk-doc/shared/scripts/validate_document.py`) [45m] — DONE: new `validate_agent_frontmatter()` function (path-runtime-detected, not global-default) wired into `validate_document()` when `doc_type == 'agent'`; `python3 -m py_compile` passes.
- [x] T015 [P] Verify T014: run the new `--type agent` check against `.claude/agents/deep-improvement.md` post-T006 and confirm it reports pass; run it against a deliberately non-compliant fixture and confirm it warns [15m] — VERIFIED: compliant post-fix `deep-improvement.md` → `agent-schema errors: []`; deliberately non-compliant `.claude` fixture (permission: only) → blocking `agent_schema_missing_tools` + warning `agent_schema_wrong_key_permission`; non-compliant `.opencode` fixture (tools: only) → blocking `agent_schema_missing_permission` + warning `agent_schema_wrong_key_tools`; cross-contaminated (both keys) fixture → warning only, no false blocking; no-frontmatter fixture → blocking `agent_frontmatter_missing`. Full 24-file live-agent regression sweep: all clean.
- [x] T016 [P] AGT-06: Add a Path Convention self-reference line to `.claude/agents/ai-council.md` (no existing line; match sibling phrasing, e.g. `.claude/agents/context.md:13`) [10m] — DONE: line added after the intro paragraph, before `**CRITICAL**`, matching `context.md`'s phrasing.
- [x] T017 [P] AGT-06: Add a Path Convention self-reference line to `.opencode/agents/ai-council.md` (no existing line; match sibling phrasing) [10m] — DONE: same placement/phrasing, `.opencode/agents/*.md` variant.
- [x] T018 [P] Verify T016/T017: `grep -c "Path Convention" .claude/agents/ai-council.md .opencode/agents/ai-council.md` returns 1 for each file [5m] — VERIFIED: both files return exactly 1.
- [x] T019 AGT-07: Add the "canonical source in `.opencode/agents/`" provenance clause to `.opencode/agents/orchestrate.md`'s anti-pattern row for parity with `.claude/agents/orchestrate.md` (research.md cites line 784; re-confirm exact current line before editing — drift observed to ~798 as of 2026-07-10). If the operator instead picks the "drop from Claude" alternative (spec.md §7), edit `.claude/agents/orchestrate.md` instead [15m] — DONE (additive default, per plan.md/spec.md §7): re-confirmed on-disk lines (`.claude`:798, `.opencode`:809, both drifted from research.md's 784/809 citations) before editing; added "canonical source; `.claude/agents/` is this runtime's mirror" to `.opencode/agents/orchestrate.md:809`.
- [x] T020 [P] Verify T019: `grep -n "canonical source" .claude/agents/orchestrate.md .opencode/agents/orchestrate.md` returns a match in both files (or neither, if the "drop" alternative was chosen) [5m] — VERIFIED: match in both files (`.claude`:798, `.opencode`:809).
- [x] T021 AGT-05: Operator decided REMOVE (not restore) — strip the `.codex/agents` mirror-directory claims from the 6 cited agent-body sites [15m] — DONE: re-grepped each site before editing (line numbers had drifted from prior citations). `orchestrate.md` (both mirrors): dropped the "Codex profile reads `.codex/agents/`" clause from the Runtime Directory Resolution sentence, leaving OpenCode + Claude. `deep-review.md` (both mirrors): deleted the `.codex/agents/deep-review.toml` row from the Runtime Mirror Awareness table. `prompt-improver.md` (both mirrors): trimmed `INT-RUNTIME-MIRRORS` from `` `.claude/agents`, `.codex/agents` `` to `` `.claude/agents` `` (singular "surface"). No legitimate `.codex` runtime/executor reference existed in any of the 6 files, so nothing else was touched.
- [x] T022 [P] Verify T021: `grep -rn "\.codex/agents" .claude/agents/orchestrate.md .claude/agents/deep-review.md .claude/agents/prompt-improver.md .opencode/agents/orchestrate.md .opencode/agents/deep-review.md .opencode/agents/prompt-improver.md` returns 0 hits [5m] — VERIFIED: 0 hits (grep exit 1) across all 6 files. Directory-wide `grep -rn "\.codex/agents" .claude/agents/ .opencode/agents/` still shows 2 hits, both confined to `.claude/agents/README.txt:8` and `.opencode/agents/README.txt:8` (out of scope, separate phase, untouched per SCOPE LOCK).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [50-70m]

- [x] T023 Re-run all spec.md SC-001..SC-009 grep/validate assertions in one pass and record pass/fail evidence [20m] — VERIFIED, all PASS: SC-001 deprecated=0; SC-002 tools:=1/permission:=0; SC-003 no matches; SC-004 match in both files; SC-005 fixture battery all correct (see T015); SC-006 Path Convention=1 in both; SC-007 canonical source in both; SC-008 superseded — AGT-05 was subsequently fixed per operator decision, see T021/T022 for current `.codex/agents` state (0 hits in the 6 files); SC-009 see T025.
- [x] T024 Confirm frontmatter-stripped, path-normalized diffs for all 12 agent pairs show zero unintended behavioral-prose drift outside the AGT-fixed lines [20m] — VERIFIED: `git diff --stat` for the whole agent surface touched exactly 7 agent-body/frontmatter files (`ai-council.md` x2, `deep-improvement.md`, `deep-research.md` x2, `markdown.md`, `orchestrate.md` x1) plus the 3 create-agent/validator producer files; full `git diff` reviewed line-by-line — every hunk maps 1:1 to its cited AGT finding, no incidental prose changes.
- [x] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and record the exit code [10m] — RESULT: exit 0 (see implementation-summary.md for full output).
- [x] T026 Update spec.md Status and this packet's changelog entry once all P1 findings are closed and P2 findings are closed or explicitly deferred [10m] — DONE: spec.md METADATA Status set to "Complete"; changelog entry left to the 006 closeout per packet convention (this phase authors implementation-summary.md as its completion record).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P1 tasks (T001-T013) marked `[x]`
- [x] All P2 tasks (T014-T022) completed — AGT-05 fixed per operator decision (removed the 6 `.codex/agents` claims); AGT-07 executed additive default
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exits 0 (T025)
- [x] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Findings Source**: See `../001-conformance-deep-research/research/research.md` §3.3 (AGENTS)
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks
-->

