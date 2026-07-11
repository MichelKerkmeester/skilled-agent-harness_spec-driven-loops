---
title: "Implementation Summary: Phase 4: Remediate Agent Files (Both Runtimes)"
description: "All 9 AGT findings fixed with grep/fixture-verified evidence; AGT-05 fixed in a follow-up pass once the operator resolved the .codex/agents design question (decision: remove)."
trigger_phrases:
  - "implementation"
  - "summary"
  - "agent remediation summary"
  - "AGT findings implementation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-command-agent-conformance-audit/004-remediation-agents"
    last_updated_at: "2026-07-11T06:40:00Z"
    last_updated_by: "sonnet-markdown-agent"
    recent_action: "Fixed 9/9 AGT findings (AGT-05 remove decision applied); validate pending"
    next_safe_action: "006 closeout: roll up parent, refresh changelog entry for phase 004"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-agent/SKILL.md"
      - ".opencode/skills/sk-doc/create-agent/assets/agent_template.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".claude/agents/deep-improvement.md"
      - ".claude/agents/deep-research.md"
      - ".opencode/agents/deep-research.md"
      - ".claude/agents/markdown.md"
      - ".claude/agents/ai-council.md"
      - ".opencode/agents/ai-council.md"
      - ".opencode/agents/orchestrate.md"
      - ".claude/agents/deep-review.md"
      - ".claude/agents/prompt-improver.md"
      - ".opencode/agents/deep-review.md"
      - ".opencode/agents/prompt-improver.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "AGT-07 parity direction: additive (add clause to OpenCode mirror) was chosen, per plan.md's recommended default."
      - "AGT-05 .codex/agents design question: operator decided REMOVE — the mirror-directory claims were stripped from all 6 cited agent-body sites."
---
# Implementation Summary: Phase 4: Remediate Agent Files (Both Runtimes)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-remediation-agents |
| **Completed** | 2026-07-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase closed the S4 systemic frontmatter-schema cluster that let a generated Claude agent run with unrestricted tool access, plus 6 independent instance-level drift and gap findings, across the dual-runtime agent surface (`.claude/agents/`, `.opencode/agents/`) and the `create-agent` authoring skill. All 9 confirmed findings (AGT-01 through AGT-09) are fixed with grep- or fixture-verified evidence. AGT-05 was initially deferred pending an operator design decision and was fixed in a follow-up remediation pass once the operator decided: remove the `.codex/agents` mirror-directory claims (the directory is empty, not a live packaging surface).

### AGT-03 + AGT-08: create-agent now emits the runtime-correct frontmatter schema

`create-agent/SKILL.md` and `assets/agent_template.md` declared OpenCode's `permission:` object as the sole canonical schema for both runtimes and called Claude's `tools:` schema "deprecated." Claude Code silently ignores `permission:` and enforces only `tools:`, so any agent authored for `.claude/agents/` from this contract shipped unrestricted. Both files now document a runtime branch — `permission:` for `.opencode/agents/`, `tools:` for `.claude/agents/` — with a decision-rule code block and side-by-side YAML examples, and the false "deprecated" claim is gone from both files (`grep -c "deprecated"` = 0 in each).

### AGT-02: deep-improvement.md normalized to Claude's schema

`.claude/agents/deep-improvement.md` was a verbatim copy of its OpenCode mirror's `mode`/`temperature`/`permission:` block with no `tools:` field, so under Claude Code it silently inherited the parent session's full, unrestricted tool set instead of its intended deny-list. It now carries `tools: Read, Write, Edit, Bash, Grep, Glob` — the exact allow-set from the original `permission:` block (webfetch/memory/chrome_devtools/task/patch, all originally `deny`, are excluded; `task` deny is preserved by omission).

### AGT-01, AGT-04, AGT-06, AGT-07: instance-level drift and gaps closed

`.claude/agents/deep-research.md` and `.claude/agents/markdown.md` self-referenced the wrong runtime's agent directory in their Path Convention line; both now point at `.claude/agents/*.md`. Both `deep-research.md` write-allowlists (both runtimes) were missing the workflow-required `research/deltas/iter-NNN.jsonl` delta artifact required by the iteration prompt contract; both now include it in the allowlist sentence and the overwrite-guard clause. `ai-council.md` was the only agent (both runtimes) with no Path Convention self-reference line; both now carry one, matching `context.md`'s phrasing. `orchestrate.md`'s two mirrors disagreed on the canonical-source provenance clause in the anti-pattern table; the OpenCode mirror now carries the parity clause (additive default per plan.md/spec.md §7).

### AGT-05: `.codex/agents` mirror-directory claims removed (operator decision: remove)

Six agent bodies treated `.codex/agents` as a live profile/packaging surface even though the directory is empty. The operator resolved the deferred design question with "remove the claims" rather than "restore as a generated mirror." `orchestrate.md` (both mirrors) dropped the "Codex profile reads `.codex/agents/`" clause from its Runtime Directory Resolution sentence, leaving only OpenCode and Claude. `deep-review.md` (both mirrors) deleted the `.codex/agents/deep-review.toml` row from its Runtime Mirror Awareness table. `prompt-improver.md` (both mirrors) trimmed the `INT-RUNTIME-MIRRORS` touchpoint from `` `.claude/agents`, `.codex/agents` `` to `` `.claude/agents` `` (singular "surface"). Legitimate `.codex` runtime/executor references (e.g. `target_cli` values, the Codex executor) were not present in these 6 files and were not affected; a repo-wide `.codex/agents` grep now returns 0 hits inside `.claude/agents/` and `.opencode/agents/` except the 2 pre-existing `README.txt` index mentions, which are explicitly out of scope for this phase.

### AGT-09: validate_document.py enforces the schema going forward

`validate_document.py` had zero frontmatter-schema awareness for `--type agent`, which is exactly how AGT-02 shipped undetected. A new `validate_agent_frontmatter()` check, gated on `doc_type == 'agent'`, detects the file's own runtime from its path (never a global default, matching the AGT-01 path-resolution invariant) and requires a non-empty `tools:` under `.claude/agents/` (blocking if absent, warning if a stray `permission:` is also present) or a `permission:` object under `.opencode/agents/` (blocking if absent, warning if a stray `tools:` is also present).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/create-agent/SKILL.md` | Modified | AGT-03/AGT-08: runtime-branch frontmatter schema section, decision rule, "deprecated" wording removed (2 sites), ALWAYS rule 5 corrected |
| `.opencode/skills/sk-doc/create-agent/assets/agent_template.md` | Modified | AGT-03: dual-schema comparison rows, Claude `tools:` YAML example, decision rule, "deprecated" wording removed |
| `.claude/agents/deep-improvement.md` | Modified | AGT-02: `mode`/`temperature`/`permission:` replaced with `tools: Read, Write, Edit, Bash, Grep, Glob` |
| `.claude/agents/deep-research.md` | Modified | AGT-01 (Path Convention line) + AGT-04 (delta-artifact allowlist + overwrite guard) |
| `.claude/agents/markdown.md` | Modified | AGT-01: Path Convention line localized to `.claude/agents/*.md` |
| `.opencode/agents/deep-research.md` | Modified | AGT-04: delta-artifact allowlist + overwrite guard |
| `.claude/agents/ai-council.md` | Modified | AGT-06: Path Convention line added |
| `.opencode/agents/ai-council.md` | Modified | AGT-06: Path Convention line added |
| `.opencode/agents/orchestrate.md` | Modified | AGT-07: canonical-source provenance clause added to anti-pattern row; AGT-05: `.codex/agents` clause removed from Runtime Directory Resolution |
| `.claude/agents/orchestrate.md` | Modified | AGT-05: `.codex/agents` clause removed from Runtime Directory Resolution |
| `.claude/agents/deep-review.md` | Modified | AGT-05: `.codex/agents/deep-review.toml` mirror row removed from Runtime Mirror Awareness table |
| `.opencode/agents/deep-review.md` | Modified | AGT-05: `.codex/agents/deep-review.toml` mirror row removed from Runtime Mirror Awareness table |
| `.claude/agents/prompt-improver.md` | Modified | AGT-05: `.codex/agents` trimmed from `INT-RUNTIME-MIRRORS` touchpoint |
| `.opencode/agents/prompt-improver.md` | Modified | AGT-05: `.codex/agents` trimmed from `INT-RUNTIME-MIRRORS` touchpoint |
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modified | AGT-09: new `validate_agent_frontmatter()` check wired into `--type agent` |
| `.opencode/specs/skilled-agent-orchestration/132-command-agent-conformance-audit/004-remediation-agents/{spec,tasks,checklist}.md` | Modified | Status set to Complete; all tasks/checklist items marked with evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every fix was re-grepped against the live file at its cited location immediately before editing (research.md's citations had drifted, e.g. AGT-07's Claude row moved from the cited 784 to on-disk 798). AGT-03+AGT-08 (the shared root cause) landed first per plan.md's sequencing, then AGT-02 and AGT-09 (both depend on the finalized schema rule), then the 4 independent instance-level findings. AGT-09's new check was exercised against the post-fix compliant `deep-improvement.md` (clean) and 4 deliberately non-compliant fixtures covering both runtimes, the cross-contaminated case, and the no-frontmatter case, then re-run as a regression sweep across all 24 live agent files (all clean). AGT-05 was initially left untouched pending an operator decision, then fixed in a follow-up remediation pass: the operator chose "remove," so each of the 6 cited sites was re-grepped immediately before editing and the `.codex/agents` mirror-directory claim was stripped, keeping surrounding prose grammatical.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mapped `permission:` allow-set to `tools: Read, Write, Edit, Bash, Grep, Glob` for AGT-02 | This is the exact allow-set from the original `permission:` block (read/write/edit/bash/grep/glob = allow); it corrects the schema without silently widening or narrowing capability |
| AGT-07 executed the additive default (OpenCode mirror gains the clause) | plan.md/spec.md §7 name this the recommended default when the operator has not chosen the destructive "drop from Claude" alternative |
| Kept the AGT-09 check runtime-detected from the file's own path, not a global default | Matches the exact path-resolution invariant plan.md's FIX ADDENDUM calls out — the same class of bug as AGT-01 (a self-reference pointing at the sibling runtime) |
| AGT-05 fixed by removing the 6 `.codex/agents` references (not restoring the directory) | Operator resolved the previously unanswered design question with an explicit "remove" decision; the directory is empty and not a live packaging surface, so the mirror claims were false |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| SC-001 `grep -c "deprecated" .opencode/skills/sk-doc/create-agent/SKILL.md` | PASS, 0 |
| SC-002 `grep -c '^tools:'` / `grep -c '^permission:'` on `.claude/agents/deep-improvement.md` | PASS, 1 / 0 |
| SC-003 `grep -rn "\.opencode/agents" .claude/agents/deep-research.md .claude/agents/markdown.md` | PASS, no matches |
| SC-004 `grep -n "research/deltas/iter"` on both `deep-research.md` mirrors | PASS, 1 match each |
| SC-005 AGT-09 fixture battery (compliant + 4 non-compliant cases) + 24-file live regression sweep | PASS, all correct, zero false positives/negatives |
| SC-006 `grep -c "Path Convention"` on both `ai-council.md` mirrors | PASS, 1 each |
| SC-007 `grep -n "canonical source"` on both `orchestrate.md` mirrors | PASS, match in both |
| SC-008 (superseded) `grep -rn "\.codex/agents"` on the 6 AGT-05 files | PASS, 0 hits (was: only 1 file changed for AGT-07, zero AGT-05-attributable diff, before the operator's remove decision) |
| `python3 -c "import yaml; ..."` on post-fix `deep-improvement.md` | PASS, parses cleanly |
| `python3 -m py_compile validate_document.py` | PASS, no syntax errors |
| `python3 validate_document.py <skill.md> --type skill` (regression check) | PASS, valid, 0 issues — new agent-only check does not affect other doc types |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` | PASS, exit 0, `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` (all 40 checks green, including SCAFFOLD_NEVER_TOUCHED, EVIDENCE_CITED, and CONTINUITY_FRESHNESS after fixing a leftover scaffold title marker in checklist.md and refreshing the continuity timestamp) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **AGT-09's schema check is additive, not retrofitted onto other document types.** It only runs when `doc_type == 'agent'`; it does not change behavior for readme/skill/reference/command/etc. validation paths (confirmed via regression check above).
2. **This phase does not compile the deep compiled contracts or touch the skill-graph/SQLite** — those are out of scope per the parent orchestration contract (006 closeout / operator-gated respectively).
<!-- /ANCHOR:limitations -->
