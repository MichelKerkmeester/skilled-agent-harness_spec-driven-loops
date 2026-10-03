---
title: "Implementation Summary"
description: "No description is over its soft target and the project total of 6,331 now sits under the operator-raised 6,400 ceiling: seven over-soft items were trimmed with routing unchanged, and the ceiling moved from 5,600 to 6,400 by operator decision."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/063-description-budget"
    last_updated_at: "2026-10-03T07:10:00Z"
    last_updated_by: "build-orchestrator"
    recent_action: "Raised ceiling to 6,400"
    next_safe_action: "Commit to re-mint hub manifests"
    blockers:
      - "Five hub manifests stale until the pre-commit re-mint"
    key_files:
      - ".skilled/commands/doctor/scripts/audit_descriptions.py"
      - ".skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-063-description-budget"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Ceiling: operator raised it from 5,600 to 6,400"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 063-description-budget |
| **Completed** | Not complete: the route guard clears at commit |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No description is over its soft target any more, and every trimmed skill still wins its own routing prompt. The project total fell from 6,851 to 6,330 characters. That left 730 over the old 5,600 ceiling. After seeing those numbers, the operator raised the ceiling to 6,400, so the audit now reports 70 characters of headroom and no warning.

### Bring skill and agent descriptions back under the description budget

The seven OVER-SOFT descriptions (`sk-code` 405, the `design` agent 267, `cli-classifier` 155, `cli-external-orchestration` 149, `system-spec-kit` 147, `sk-doc` 144, `sk-design` 135) now sit at 119 to 130 characters. Together they lost 521 characters. Each trim removed DROP-class content (packet-name enumerations, "holds no per-mode logic" mechanics, padding) and kept the KEEP set: the name token where one was carried, the verb, the domain noun and numeric specifics such as `four` and `seven`. The audit now says what it counts: the authored surface, including the runtime-exclusive `goal-opencode.md` and `vision.md`. Its report title no longer carries a packet label. The Claude Code budget it prints comes from `SLASH_COMMAND_TOOL_CHAR_BUDGET` when that is set to a positive integer, with 8,000 as the fallback. Both sk-doc references now name `/doctor:speckit skill-budget`, the invocation the router accepts.

The 6,400 ceiling is applied everywhere 5,600 stood for the project ceiling: the audit default, docstring and `--fail-over` help, the workflow default, `skill-contract.json` `projectCeiling`, the `quick_validate.py` warning text, the budget table in `frontmatter-templates.md` (now about 1,600 of headroom for built-ins, user-level skills and plugin skills, plus a sentence that the 8,000 failure point does not move), `common-pitfalls.md` and `skill-md-template.md`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/SKILL.md` | Modified | description 405 to 127 |
| `.skilled/agents/design.md`, `.claude/agents/design.md` | Modified | description 267 to 127, byte-equal |
| `.skilled/skills/cli-classifier/SKILL.md` | Modified | description 155 to 126 |
| `.skilled/skills/cli-external-orchestration/SKILL.md` | Modified | description 149 to 124 |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | description 147 to 130 |
| `.skilled/skills/sk-doc/SKILL.md` | Modified | description 144 to 128 |
| `.skilled/skills/sk-design/SKILL.md` | Modified | description 135 to 119 |
| `.skilled/commands/doctor/scripts/audit_descriptions.py` | Modified | Docstring names the counted surface; plain report title; budget read from `SLASH_COMMAND_TOOL_CHAR_BUDGET` with 8,000 fallback; ceiling default, docstring and help 6400 |
| `.skilled/commands/doctor/assets/doctor-skill-budget.yaml` | Modified | `purpose:` and the invariant name the authored surface; `project_ceiling_empty` 6400 |
| `.skilled/skills/sk-doc/shared/scripts/quick_validate.py` | Modified | Packet label removed from the docstring; warning text names the ~6,400 budget |
| `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | Accepted invocation; new "What the audit counts" paragraph |
| `.skilled/skills/sk-doc/sk-create-skill/references/shared/common-pitfalls.md` | Modified | Accepted invocation; ceiling 6,400 |
| `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md` | Modified | Ceiling 6,400 and the 8,000 drop point stated separately |
| `.skilled/skills/sk-doc/shared/assets/skill-contract.json` | Modified | `projectCeiling` 5600 to 6400 |
| `.pi/agents/design.md`, `.codex/agents/design.toml`, `.hermes/skills/{agent-design,cli-classifier,cli-external-orchestration,sk-code,sk-design,sk-doc,system-spec-kit}/SKILL.md` | Regenerated | Mirror copies of the new descriptions, via the sync scripts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The baseline audit, the routing baseline and every gate's exit code were recorded before any edit. I trimmed the eight description lines in place, checking each line's old text before replacing it, because another orchestrator was editing routing fields in the same files at the same time. The audit script change was dispatched to DeepSeek V4.1 Flash through cli-pi. I read the diff, reran its checks across five budget values, and changed one comment word myself ("raise" to "override"). The yaml, docstring and reference-doc edits were text-only and done directly. The Pi, Codex and Hermes mirrors were regenerated at the end, and every gate was rerun from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Trim only the seven OVER-SOFT items; stage 2 superseded | The operator chose to raise the ceiling to 6,400 after seeing the numbers: total 6,330, residual 730 at 5,600, and per-item targets alone summing to 7,340. No further trimming. |
| Raise the project ceiling from 5,600 to 6,400 (operator decision) | Measured on this machine by the coordinator: installed plugins add 0 description characters and user-level skills add 384; Claude Code built-ins are unmeasured. 6,400 leaves about 1,600 under the unchanged 8,000 drop point. This supersedes the Out of Scope line that kept the ceiling fixed. |
| Apply the ceiling edits directly rather than through an executor | Each was a literal number or one-sentence swap in a file already in hand; the skill-contract tests and the audit run verify them. |
| Keep `Jev`, `Deem` and `four` that the plan's candidates dropped | They are domain nouns and a numeric specific, which the KEEP rule protects, and they still fit under 130. |
| Leave each skill's `description.json` untouched | Those files carry a separate, longer advisor description, not the frontmatter text, so no mirror relationship requires them to change. |
| Do the audit-script items the source packet left open (8,000 default, packet label) | The build brief handed them to this packet, superseding the Out of Scope line in `spec.md` that listed them. |
| Do not re-mint the stale hub manifests | The manifests belong to the routing orchestrator working concurrently, and the pre-commit hook re-mints and stages them from the final inputs. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Audit, before | 62 items, total 6,851, headroom -1,251, 7 OVER-SOFT, 0 HARD-FAIL, exit 0 (`scratch/audit-baseline.txt`) |
| Audit, after | 62 items, total 6,330, headroom -730, 0 OVER-SOFT, 0 HARD-FAIL, exit 0 (`scratch/audit-after.txt`) |
| `quick_validate.py`, six trimmed skills | "Skill is valid!", exit 0 each, no description warning |
| `validate_document.py --type agent`, both design files | VALID, exit 0; one pre-existing section-numbering warning unrelated to the description |
| Advisor routing, 8 prompts | Same top skill for 8 of 8; only score movement is `system-spec-kit` 0.868 to 0.860 (table below) |
| Six `sync-*.cjs --check` plus `sync-runtime-mirrors.cjs --check` | All exit 0: 12 Pi agents, 12 Codex agents, 71 Hermes skills, 34 prompts per runtime, 174 symlink mirrors in sync |
| `command-catalog-mirror-check.cjs` | exit 0, STATUS=OK |
| `route-validate.sh` | exit 0, 9 routes validated, 2 warnings (same as baseline) |
| `audit_descriptions.py` with `SLASH_COMMAND_TOOL_CHAR_BUDGET` unset / 12000 / abc / 0 / -5 | prints 8000 / 12000 / 8000 / 8000 / 8000 |
| `rg -n "doctor skill-budget :auto" .skilled` | 0 matches; both sk-doc files contain `doctor:speckit skill-budget` |
| `.claude/commands/goal-opencode.md`, `vision.md` | absent |
| `compiled-route-guard.cjs` | exit 1: cli-classifier, cli-external-orchestration, sk-code, sk-design, sk-doc stale-manifest (fresh at baseline); clears when the pre-commit hook re-mints |
| Audit after the ceiling change | total 6,330, ceiling 6,400, headroom 70, "OK: project total 6330 ≤ soft ceiling 6400", exit 0 |
| `rg -n '5600\|5,600' .skilled/skills/sk-doc .skilled/commands/doctor` (changelogs, benchmarks, trigger-index excluded) | no match, exit 1 |
| `pytest test_skill_contract.py` | 4 passed |
| `validate.sh --recursive --strict` | RESULT: PASSED (see the build report for the final run) |

| Item | Prompt | Top before (score) | Top after (score) |
|------|--------|------|------|
| sk-code | review this code change for bugs and verify the implementation | sk-code (0.781) | sk-code (0.781) |
| sk-code | implement and debug this webflow animation code | sk-code (0.837) | sk-code (0.837) |
| design agent | design a chart for this dashboard | sk-design (0.502) | sk-design (0.502) |
| cli-classifier | ask the classifier model for a typed judgment through jev | cli-classifier (0.816) | cli-classifier (0.816) |
| cli-external-orchestration | dispatch this task to the codex cli as an external executor | cli-external-orchestration (0.774) | cli-external-orchestration (0.774) |
| system-spec-kit | create a spec folder for this feature | system-spec-kit (0.868) | system-spec-kit (0.860) |
| sk-doc | write a skill readme | sk-doc (0.856) | sk-doc (0.856) |
| sk-design | choose the design values and spacing scale for this surface | sk-design (0.711) | sk-design (0.711) |

### Requirement disposition

| Requirement | Disposition | Evidence |
|-------------|-------------|----------|
| REQ-001 seven OVER-SOFT trimmed | Met | audit 0 OVER-SOFT; quick_validate exit 0 for six skills |
| REQ-002 fleet pass to the ceiling | Superseded | operator raised the ceiling to 6,400; total 6,331 is under it |
| REQ-003 re-measure and record | Met | `scratch/audit-after.txt`; numbers and residual arithmetic above |
| REQ-004 routing before and after | Met | 8 of 8 prompts keep their top skill (`scratch/routing-diff.md`) |
| REQ-005 audit states its surface | Met | docstring, workflow yaml, frontmatter-templates paragraph; no `goal-opencode.md` or `vision.md` under `.claude/commands` |
| REQ-006 accepted invocation | Met | 0 matches for the rejected form |
| REQ-007 mirrors in sync | Met | every sync `--check` exit 0; catalog STATUS=OK |
| REQ-008 compiled routing fresh | Met | the pre-commit hook re-minted all five hubs at commit `4ffc4097b7`; `compiled-route-guard.cjs` reports them fresh (mcp-tooling, untouched by this packet, is stale from an earlier commit) |
| REQ-009 packet validates | Met | `validate.sh --recursive --strict` RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Only 69 characters of growth before the warning returns.** The total is 6,331 against the 6,400 ceiling, one character up from 6,330 after the sk-code description was reworded to recover a local-scorer routing regression. One new skill at its 130 target would push it over.
2. **Five hub manifests are stale until commit.** Editing a hub `SKILL.md` stales its compiled routing pin. The pre-commit hook re-mints and stages it. Until then `compiled-route-guard.cjs` exits 1, and those hubs could serve legacy routes in an uncommitted checkout.
3. **The total still counts 135 characters Claude Code never loads.** The runtime-exclusive `goal-opencode.md` (32) and `vision.md` (103) stay in the count, which the audit now states. The Claude-visible subtotal is 6,195.
4. **Out-of-scope copies.** `.skilled/skills/README.txt` keeps its own catalog wording for `sk-code` and `system-spec-kit`. It is a paraphrase, not a mirror of the frontmatter, and was left as written.
5. **Claude Code built-in size is unknown.** The 1,600 of headroom under 8,000 assumes built-ins fit; nobody has measured them, so the real margin may be smaller.
6. **Other operators' plugins are not counted.** This machine's plugins add 0 description characters and user-level skills 384. An operator with skill-heavy plugins has less headroom and could cross 8,000 while this audit still reads OK.
7. **Other runtimes' limits are unmeasured.** The ceiling is sized against Claude Code's 8,000 default only; OpenCode, Codex, Pi, Hermes and the rest were not measured.
8. **The native-advisor routing check missed a local-scorer regression, now fixed.** The 127-character `sk-code` wording dropped the Python reference from 107 to 105 correct and lost `rr-iter3-077`, which the daemon-based check could not see. A follow-up in `specs/system-skill-advisor/033-advisor-status-truthfulness` rewrote it to 128 characters (project total 6,331) and restored 107 with `tests/parity` green.
<!-- /ANCHOR:limitations -->

---
