---
title: "Tasks: Phase 1: cli-opencode-content-hygiene"
description: "Task list for the 5 WS-A cli-opencode content-hygiene fixes: verify each finding, apply the fix, re-verify, then version-bump and changelog."
trigger_phrases:
  - "cli-opencode content hygiene tasks"
  - "pkill fix tasks"
  - "cli-opencode broken link tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/001-cli-opencode-content-hygiene"
    last_updated_at: "2026-07-10T05:33:00Z"
    last_updated_by: "claude"
    recent_action: "Corrected F1 kill form; re-validated"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-opencode/README.md"
      - ".opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "127-deep-review-remediation-001-cli-opencode-content-hygiene"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: cli-opencode-content-hygiene

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

- [x] T001 Read fix manifest `phase1-cli-opencode.md` - 5 findings (F1-F5) with file:line evidence for each.
- [x] T002 Cross-checked F1-F4 against `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/review-report.md` §3 WS-A registry - all 4 confirmed/plausible per the review adjudication.
- [x] T003 [P] Verified all 5 findings against live files before editing - `SKILL.md:337` (Rule 5) and `:351` (Rule 16); `README.md:143` (stale row), `:63-76` (Step 3 recipe), `:77-88` (Step 4 quick start); `grep -rn "with-sk-prompt/prompt-models" .opencode/skills/cli-opencode/` (6 hits, F5).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 F1: Fixed `SKILL.md:351` Rule 16 - replaced the blanket `pkill -9 -f "opencode run"` with a captured-PID kill (`OC_PID=$!`, then `kill -9 "$OC_PID" 2>/dev/null; pkill -9 -P "$OC_PID" 2>/dev/null`) and an explicit cross-reference to Rule 5. A gpt-5.6-sol-fast cross-verify corrected an initial negative-PID group-kill form (`kill -9 -- -"$OC_PID"`) that would miss a non-group-leader background process.
- [x] T005 F2: Fixed `README.md` "Sibling Boundaries" table - deleted the stale `cli-opencode | OpenAI` row (retired cli-codex description) at the former `README.md:143`.
- [x] T006 F3: Fixed `README.md` Step 4 - added a share-confirmation blockquote note citing the `share-requires-confirmation` hard_rule directly above the `--share --port 4096` code block.
- [x] T007 F4: Fixed `README.md` Step 3 - removed the top-level `--agent context` flag, moved the role into the prompt body ("Act as a context-retrieval agent: ...").
- [x] T008 F5: Repaired 6 corrupted filename links - 4 in `manual_testing_playbook.md` (CO-035/CO-036 Feature File links + both PROMPT TEMPLATES index-list links), 1 each in `prompt-templates/deepseek-v4-direct-with-sk-prompt-models.md` and `prompt-templates/kimi-k2-7-direct-with-sk-prompt-models.md`.
- [x] T009 Bumped `SKILL.md` frontmatter `version: 1.3.15.2` → `1.3.15.3`.
- [x] T010 Authored `changelog/v1.3.15.3.md` documenting all 5 fixes, following the `v1.3.15.2.md`/`v1.3.15.0.md` entry format.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-ran `grep -rn "with-sk-prompt/prompt-models" .opencode/skills/cli-opencode/` - 0 matches (exit 1).
- [x] T012 Ran `git diff --stat -- .opencode/skills/cli-opencode/` - confirmed only the 5 intended files plus the new changelog entry carry this phase's edits; the pre-existing GPT-5.6 rename files (`assets/prompt_quality_card.md`, `references/cli_reference.md`, etc.) were left untouched.
- [x] T013 Authored the Level 1 spec-kit docs for this phase (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`).
- [x] T014 Regenerated `description.json` via `generate-description.js` and `graph-metadata.json` via `backfill-graph-metadata.js` - both scripts exited clean (`description.json created`, backfill reported `"failed": []`).
- [x] T015 Ran `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/127-deep-review-remediation/001-cli-opencode-content-hygiene --strict` - `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` - Evidence: T001-T015 all checked above.
- [x] No `[B]` blocked tasks remain.
- [x] All 5 fixes independently re-verified against live files - Evidence: T011-T012, plus the final `validate.sh --strict` PASS in T015.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
