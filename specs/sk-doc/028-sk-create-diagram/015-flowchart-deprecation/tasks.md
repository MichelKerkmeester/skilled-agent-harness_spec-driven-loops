---
title: "Tasks: sk-create-flowchart full deprecation"
description: "Task queue for deleting sk-create-flowchart and purging every live reference."
trigger_phrases:
  - "flowchart deprecation tasks"
importance_tier: "important"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/015-flowchart-deprecation"
    last_updated_at: "2026-08-13T17:15:00.000Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Run packet-wide validate.sh; report"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-create-flowchart full deprecation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[x]` | Completed |

**Task Format**: T### Description
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Repo-wide `grep` for `sk-create-flowchart`/`/create:flowchart`, classify live vs. historical [EVIDENCE: initial sweep found `76` hits across `.md`/`.json`/`.yaml`/`.ts`/`.cjs`/`.py`/`.txt`; historical `specs/` docs from packets 026/016/014/019 excluded from the fix list.]
- [x] T002 Confirm `derive-command-bridges.cjs` exists before touching the generated artifact by hand [EVIDENCE: found at `system-skill-advisor/mcp-server/scripts/command-bridges/derive-command-bridges.cjs`, ran clean.]
- [x] T003 Delete `.opencode/skills/sk-doc/sk-create-flowchart/` [EVIDENCE: `find .opencode/skills/sk-doc/sk-create-flowchart` returns nothing after `rm -rf`.]
- [x] T004 Delete the command, 3 command assets, and 3 cross-runtime prompt mirrors [EVIDENCE: `flowchart.md`, `create-flowchart-{auto,confirm}.yaml`, `create-flowchart-presentation.txt`, `.codex/prompts/create-flowchart.md`, `.pi/prompts/create-flowchart.md`, `.cursor/commands/create-flowchart.md` all removed.]
- [x] T005 Remove the pre-existing broken changelog symlink [EVIDENCE: `.opencode/changelog/sk-doc/create-flowchart` was a tracked, already-broken symlink (wrong target prefix, a repo-wide bug affecting every packet's changelog symlink) — `git rm`'d.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Purge `sk-create-flowchart` from `command-metadata.json`, `mode-registry.json`, `hub-router.json` (tie-break list + skill-mapping block + `create-flowchart-aliases` class), `leaf-manifest.json` [EVIDENCE: `grep -c sk-create-flowchart` on all 4 files returns `0`.]
- [x] T007 Remove `command-create-flowchart` and add `command-create-diagram` in `skill_advisor.py` [EVIDENCE: `python3 -m py_compile` passes; `grep -c command-create-diagram` returns `1`.]
- [x] T008 Repoint the `sk-doc/scripts/validate-flowchart.sh` facade symlink and `post-edit-router.cjs`'s checker path + `isFlowchartCandidate()` segment match [EVIDENCE: `readlink` confirms the symlink targets `sk-create-diagram/scripts/`; the `.cjs` now checks `sk-create-diagram` + `ascii-patterns` segments, scoped tighter than the old check since `sk-create-diagram/assets/` also holds non-flowchart content.]
- [x] T009 Fix `sk-doc/{SKILL.md,README.md,description.json,graph-metadata.json,feature-catalog/feature-catalog.md,shared/references/{quick-reference,smart-routing}.md,sk-create-quality-control/references/workflows.md}` [EVIDENCE: all 8 files were missing `sk-create-diagram` entirely (a pre-existing gap, not just a flowchart-removal side effect) — added alongside removing the dead flowchart entries.]
- [x] T010 Fix `sk-create-diagram/README.md`'s self-contradictory "that's sk-create-flowchart's scope" lines [EVIDENCE: 3 lines corrected — the packet now correctly claims both output formats as its own scope.]
- [x] T011 Fix 3 cross-runtime `agents/markdown.md` mirrors, `.opencode/commands/{README.txt,create/README.txt}`, `post-edit-quality-router.md`, `packet-authored-registry-routing.md` [EVIDENCE: 8 files, all missing `/create:diagram`/`sk-create-diagram` entirely before this fix.]
- [x] T012 Mechanically update 5 manual-testing-playbook scenario fixtures + remove 3 stale entries each from 2 baseline JSONs [EVIDENCE: `grep -c sk-create-flowchart` on all 7 files returns `0`; both baseline JSONs remain valid JSON.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Regenerate `command-bridges.generated.json`; rebuild and validate the skill advisor index [EVIDENCE: `advisor_rebuild` returned `rebuilt: true`; `advisor_validate` for `sk-doc` returned `explicit_skill_top1_regression.passed: true`, `overallAccuracy: 0.8889`.]
- [x] T014 Repo-wide re-sweep confirms 0 live references remain outside historical spec docs [EVIDENCE: final `grep` returns only `specs/` historical docs and the intentional "merged from" provenance mentions in `sk-create-diagram`'s own feature-catalog/README.]
- [x] T015 Write `implementation-summary.md`
- [x] T016 Write `checklist.md` [EVIDENCE: `checklist.md` present with `9/9` sections filled.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All required tasks marked [x]
- [x] 0 live `sk-create-flowchart`/`/create:flowchart` references remain outside historical spec docs
- [x] Advisor rebuild + validate clean, 0 regressions
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Packet root**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
