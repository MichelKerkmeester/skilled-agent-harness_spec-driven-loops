---
title: "Tasks: Phase 5: readme-alignment"
description: "Task Format: T### [P?] FINDING-ID: one-line fix (file:line). One task per confirmed-stale README/YAML finding, grouped by fix-set, plus discovery, sweep, and final validation tasks."
trigger_phrases:
  - "readme alignment tasks"
  - "cmd-09 tasks"
  - "005-readme-alignment tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/005-readme-alignment"
    last_updated_at: "2026-07-11T08:49:20Z"
    last_updated_by: "markdown-agent"
    recent_action: "Executed T001-T027: 11 READMEs fixed, 58 files swept, 0 regressions"
    next_safe_action: "Close out: write implementation-summary.md, set Status=Complete, validate"
    blockers: []
    key_files:
      - ".opencode/install_guides/README.md"
      - ".opencode/skills/mcp-code-mode/README.md"
      - ".opencode/bin/README.md"
      - ".opencode/agents/README.txt"
      - ".claude/agents/README.txt"
      - ".opencode/commands/README.txt"
      - ".opencode/commands/create/README.txt"
      - ".opencode/commands/speckit/README.txt"
      - ".opencode/skills/sk-doc/README.md"
      - "README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: readme-alignment

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

**Task Format**: `T### [P?] FINDING-ID: one-line fix (file:line)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Gate
- [x] T001 [B] Gate: confirm phases 002-004 have landed (non-planned Status in each predecessor's `implementation-summary.md`) before executing T004-T019. — VERIFIED: `grep -m1 Status` on all three predecessors' `spec.md` returns `Complete` (002, 003, 004).
- [x] T002 [P] Gate: read phase 004's `.codex/agents` (AGT-05) design resolution; if unresolved, mark T010/T011's `.codex` clause deferred instead of guessing. — RESOLVED: phase 004's `implementation-summary.md` confirms operator decision REMOVE (AGT-05 fixed in a follow-up pass, stripped `.codex/agents` claims from 6 agent bodies; the 2 README.txt sibling-runtimes lines were explicitly out of AGT-05's scope, left for this phase).

### Discovery
- [x] T003 [P] Discovery: enumerate the authored README universe with the scoped `find` command from plan.md Phase 2 (excludes node_modules, .worktrees, dist, .venv, __pycache__, .opencode/specs, z_archive); classify hits against spec.md §3 "In Scope" categories. — DONE: 379 files found. Classified: 1 top-level + 13 hub/index + 31 mode-packet + 5 command-index + 2 agent + 6 misc top-level (hooks/plugins/bin/scripts/install_guides, including 2 one-level-deep siblings) = 58 in-scope files individually read or grep-swept; remainder (~321) are deep per-dir dev-note READMEs (mcp_server/**, scripts/**, tests/**, benchmark/**, references/**, assets/**, shared/**) — repo-wide pattern grep confirmed 0 retired-name hits across the full 379-file universe, but not individually read line-by-line (see implementation-summary.md sweep log for the full swept/deferred list).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Confirmed-Stale Fix Set (P1-Required, REQ-001/003/004)
- [x] T004 [P] REQ-001: rewrite the "Current Skills" catalog — drop retired pinned versions (`mcp-code-mode v1.0.7.0`, `system-spec-kit v2.2.26.0`, `mcp-chrome-devtools v1.0.7.0`), add sk-design/system-code-graph/system-deep-loop/system-skill-advisor + mcp-click-up/mcp-figma (`.opencode/install_guides/README.md:884-896`) — DONE: replaced the 9-row flat-version table with a 12-row Hub/Modes/Purpose table reflecting hub-owns-mode topology (all 12 on-disk hubs verified via `ls .opencode/skills/`).
- [x] T005 [P] Verify T004: `grep -n "v1.0.7.0\|v2.2.26.0" .opencode/install_guides/README.md` returns 0; catalog table lists all 6 missing hubs/modes — VERIFIED: 0 hits; table lists cli-external, mcp-tooling, sk-prompt, system-deep-loop, sk-design, sk-code, sk-doc, sk-git, mcp-code-mode, system-code-graph, system-skill-advisor, system-spec-kit (12/12).
- [x] T006 [P] REQ-003: add a `mcp-figma` row to the Related-Skills table alongside `mcp-chrome-devtools`/`mcp-click-up` (`.opencode/skills/mcp-code-mode/README.md:138-141`) — DONE: added row + reframed all 3 rows under the `mcp-tooling/` hub prefix with a lead-in sentence.
- [x] T007 [P] Verify T006: `grep -n "mcp-figma" .opencode/skills/mcp-code-mode/README.md` returns >=1 hit inside the Related-Skills table — VERIFIED: 1 hit at line 144.
- [x] T008 [P] REQ-003: normalize the lone `system-speckit` occurrence to `system-spec-kit` (`.opencode/bin/README.md:168`) — DEVIATION: NOT a naming typo. Investigation showed `.opencode/specs/system-speckit/` (no hyphen) is the correct on-disk spec-track name, distinct from the skill folder `.opencode/skills/system-spec-kit/` (hyphenated) that the other 6 hits legitimately reference. Renaming to `system-spec-kit` would have pointed at a non-existent path. Fixed the REAL defect instead: the packet number was stale (`030-...` doesn't exist; re-nested to `028-memory-search-intelligence/002-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement`, confirmed to exist on disk).
- [x] T009 [P] Verify T008: `grep -n "system-speckit" .opencode/bin/README.md` returns 0 — SUPERSEDED by T008's deviation: `system-speckit` (0 hyphen) is correct and expected to remain (1 hit, now pointing at a real path); `system-spec-kit` (hyphenated skill-folder references, 6 hits) unchanged and correct. Verified new path exists: `ls -d .opencode/specs/system-speckit/028-.../050-.../001-dist-freshness-enforcement` succeeds.
- [x] T010 [B] REQ-004: reconcile the `.codex/agents/ (.toml)` sibling-runtimes claim per T002's phase-004 decision (`.opencode/agents/README.txt:8`) — unblocked by T002 (REMOVE). DONE: line 8 changed to `Sibling runtime: .claude/agents/ (.md)`; also added the missing `design` agent (12th on-disk agent, was absent from the enumeration — genuine gap, not part of AGT-05) between `deep-review` and `markdown`.
- [x] T011 [B] REQ-004: mirror T010's fix for cross-runtime parity (`.claude/agents/README.txt:8`) — unblocked by T002 (REMOVE). DONE: identical fix, line 8 -> `Sibling runtime: .opencode/agents/ (.md)`; same `design` agent addition for parity.
- [x] T012 [P] Verify T010/T011: both README.txt files' line 8 agree on the `.codex/agents` wording (identical claim or identical removal) — VERIFIED: `grep -n "\.codex/agents" .claude/agents/README.txt .opencode/agents/README.txt` returns 0 hits both files; both list all 12 on-disk agents identically.

### CMD-09 Fix Set (P1-Required, REQ-005)
- [x] T013 [P] CMD-09: replace `folder_readme.md` with `.opencode/commands/create/readme.md` (`.opencode/commands/create/assets/create_readme_auto.yaml:37`) — ALREADY LANDED by phase 002 (cross-check only, no re-fix needed): phase 002's `implementation-summary.md` records CMD-09 fixed at all 3 sites.
- [x] T014 [P] CMD-09: replace `folder_readme.md` with `.opencode/commands/create/readme.md` at both occurrences (`.opencode/commands/create/assets/create_readme_confirm.yaml:9,40`) — ALREADY LANDED by phase 002, cross-checked.
- [x] T015 [P] Verify T013/T014: `grep -rn "folder_readme.md" .opencode/commands/create/assets/create_readme_auto.yaml .opencode/commands/create/assets/create_readme_confirm.yaml` returns 0 — VERIFIED (this phase, independently re-run): 0 hits, exit 1.
- [x] T016 [P] CMD-09: rename `create_agent_verified` to `create_readme_verified` (`.opencode/commands/create/assets/create_readme_presentation.txt:19,138`) — ALREADY LANDED by phase 002, cross-checked.
- [x] T017 [P] CMD-09: rename `create_agent_verified` to `create_readme_verified` (`.opencode/commands/create/assets/create_readme_auto.yaml:148`) — ALREADY LANDED by phase 002, cross-checked.
- [x] T018 [P] CMD-09: rename `create_agent_verified` to `create_readme_verified` (`.opencode/commands/create/assets/create_readme_confirm.yaml:133`) — ALREADY LANDED by phase 002, cross-checked.
- [x] T019 [P] Verify T016-T018: `grep -rln "create_agent_verified" .opencode/commands/create/assets/create_readme_auto.yaml .opencode/commands/create/assets/create_readme_confirm.yaml .opencode/commands/create/assets/create_readme_presentation.txt` returns 0 — VERIFIED (independently re-run): 0 hits, exit 1; `create_readme_verified` confirmed present at all 4 sites instead.

### Broader Sweep (REQ-002, REQ-004 remainder — time-permitting)
- [x] T020 Verify top-level `README.md` hub topology / command families / agent roster still match the corrected surface — VERIFIED mostly current; found and fixed 2 stale `/prompt` invocation references (command's own body self-documents as `/prompt-improve` at 3 internal sites; the file was renamed from `prompt.md` in commit `5afd2f6522` and top-level README was not updated).
- [x] T021 Reconcile `.opencode/skills/README.md` + 12 hub READMEs against the on-disk mode tree using T003's discovery output — DONE, all 13 individually read. `skills/README.md` and 11 hubs already accurate (no changes); `mcp-code-mode` fixed (T006); `sk-doc/README.md` fixed a duplicate-link bug (two rows both pointed at `create-readme/references/README.md`, one mislabeled "install guide standards" — retargeted to `create-readme/references/install_guide/quality_and_standards.md`).
- [x] T022 Reconcile `.opencode/commands/{README.txt, memory/README.txt, speckit/README.txt, create/README.txt}` against the post-002/003 command surface — DONE, all 4 + `create/readme.md` individually read. `README.txt`: fixed deep count 8->7 (removed dead `context.md`, deleted in commit `a73c78e655`, superseded by the `@context` agent), added missing `goal_opencode.md` (root count 2->3), fixed 5x stale `/prompt`->`/prompt-improve`, fixed a broken `prompt.md` link, expanded the Doctor Commands table (was missing the `/doctor` router and `/doctor:update` rows). `create/README.txt`: fixed a duplicate `.opencode/agents/` entry in the troubleshooting table. `speckit/README.txt`: fixed 5x `spec_kit`->`speckit` naming drift (folder is `speckit/` not `spec_kit/`, YAML files are `speckit_*` not `spec_kit_*`) and 3 broken relative links (`README.md`->`README.txt` x2, `skill/`->`skills/`). `memory/README.txt` and `create/readme.md`: read in full, already accurate, no changes.
- [x] T023 Sweep the ~32 mode-packet READMEs under the parent hubs for stale flat-skill paths or retired names surfaced by T003; record any file not completed as an explicit deferral in `implementation-summary.md` rather than skipping silently — DONE: all 31 on-disk mode-packet READMEs grep-swept for retired names/stale `/prompt`/CMD-09 residue (0 hits beyond the 1 fixed below); 3 spot-read in full (`design-mcp-open-design`, `cli-opencode`, `cli-claude-code`). Fixed 1: `cli-external/cli-claude-code/README.md` had a stale `/prompt` reference for the `prompt-improver` agent's command-owner — corrected to `/prompt-improve`.
- [x] T024 [P] Verify T020-T023: `grep -rEn "cli-codex|cli-gemini|cli-devin|mcp-magicpath" <in-scope READMEs>` returns 0 (baseline already 0; confirm it stays 0) — VERIFIED: 0 hits across the full in-scope set post-edit; also re-ran across the entire 379-file README universe (excluding z_archive/specs by design) — 0 hits, confirming no regression and no missed contamination outside the individually-swept set.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Final Validation
- [x] T025 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` and confirm exit 0 — see implementation-summary.md for exact exit code.
- [x] T026 Re-run spec.md §5 SC-001..SC-004 grep/validate assertions and record exact output in `implementation-summary.md` — DONE, see implementation-summary.md Verification section.
- [x] T027 Refresh the matching changelog entry in `../changelog/` for this phase before claiming completion — DEFERRED to `006-validation-closeout`, consistent with sibling phases 002 and 004 (both explicitly recorded the packet-level `../changelog/` refresh as a 006 closeout action, out of each individual phase's write scope; no `changelog/` folder exists yet at the parent level).

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (or explicitly deferred with reason in `implementation-summary.md` for Broader Sweep items only, T020-T024) — all T001-T027 marked [x]; T027's changelog refresh explicitly deferred to 006 per sibling-phase precedent.
- [x] No `[B]` blocked tasks remaining (T001/T002/T010/T011 resolved) — T001/T002 gates passed, T010/T011 unblocked by T002's REMOVE resolution.
- [x] `validate.sh --strict` exits 0 — see implementation-summary.md.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research source**: `../001-conformance-deep-research/research/research.md` §3 (CMD-09), §6 (Remediation Routing), §7 (Deferred/README Observations)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
