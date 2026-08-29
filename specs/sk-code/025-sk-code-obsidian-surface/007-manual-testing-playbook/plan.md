---
title: "Implementation Plan: sk-code-obsidian Manual Testing Playbook"
description: "Execution plan for authoring the eight-file manual-testing-playbook corpus: the reading order across sk-code-mobile-cli's template and the live packet/plugin source, then the drafting order per scenario."
trigger_phrases:
  - "sk-code-obsidian playbook execution"
  - "OB scenario drafting plan"
  - "manual testing playbook reading order"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/007-manual-testing-playbook"
    last_updated_at: "2026-08-28T22:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored playbook scenarios"
    next_safe_action: "Author 008 scanners"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-code-obsidian Manual Testing Playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter (routing-recall scenario content, no executed code) |
| **Framework** | `sk-code-mobile-cli/manual-testing-playbook/` shape (binding template, per `../goal.md` §3) |
| **Storage** | `$HUB/.opencode/skills/sk-code/sk-code-obsidian/manual-testing-playbook/` (eight new files) plus this leaf's own spec-kit folder |
| **Testing** | None executable; verification is path-existence (`test -e`), frontmatter-shape, and ID/table cross-check against the root index |

### Overview
This plan produces one root index (`manual-testing-playbook.md`) and seven scenario files
(`OB-001` through `OB-007`) by reading `sk-code-mobile-cli/manual-testing-playbook/`'s index plus
two scenario files as the binding shape template, then `sk-code-create-manual-testing-playbook`'s
`SKILL.md` for the operator-scenario contract, then `sk-code-obsidian/SKILL.md` §2b for the real
`INTENT_SIGNALS`/`RESOURCE_MAP`, then the live `references/` and `assets/` directories and plugin
source (`styles.css`, `src/views/modals/`, `tools/screenshots/`) to ground every cited class name,
modal filename, and resource path. No `SKILL.md`, `README.md`, `references/`, or `assets/` file is
touched.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `sk-code-mobile-cli/manual-testing-playbook/manual-testing-playbook.md` read in full, plus
  `token-edit-routing.md` and `debugging-routing.md` read closely for the five-section scenario
  shape and the result-persistence contract block.
- [x] `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` read for the
  operator-scenario contract (five sections, nine display fields, `PASS`/`FAIL`/`SKIP` vocabulary).
- [x] `sk-code-obsidian/SKILL.md` §2b read in full for `INTENT_SIGNALS` and `RESOURCE_MAP`.
- [x] `sk-code-obsidian/references/` and `sk-code-obsidian/assets/` listed directly (not recalled
  from `SKILL.md`) to establish the real, live path set.
- [x] Live plugin evidence read: `styles.css` line count and one real `.db-*` class
  (`.db-board-card-field`), `src/views/modals/` file listing (seventeen files), confirmation that
  `FormulaModal.ts` has no fixture under `tools/screenshots/`.

### Definition of Done
- [x] Root index plus seven scenario files created under
  `sk-code-obsidian/manual-testing-playbook/`.
- [x] All 23 `expected_resources` paths across the seven scenarios verified with `test -e` before
  being written.
- [x] `spec.md`, `plan.md`, and `tasks.md` in this folder replaced with real content — no scaffold
  placeholders remain.
- [x] No file written outside `sk-code-obsidian/manual-testing-playbook/` and this leaf's own
  folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-first, then ground-then-cite — the same pattern `006-assets-checklists/plan.md` used for
the checklists. Every scenario follows `sk-code-mobile-cli/manual-testing-playbook/`'s exact shape
(frontmatter → `## 1. OVERVIEW` → `## 2. SCENARIO CONTRACT` → `## 3. TEST EXECUTION` →
`## 4. SOURCE FILES` → `## 5. SOURCE METADATA`), and every concrete fact inside it (a class name, a
modal filename, a reference/asset path, a gate count) was checked against a live file before being
written.

### Key Components
- **Template pass**: reads `sk-code-mobile-cli/manual-testing-playbook/`'s index and two scenario
  files for the frontmatter keys, the section shape, the natural-human prompt voice, and the
  result-persistence contract block.
- **Routing-contract pass**: reads `sk-code-obsidian/SKILL.md` §2b's `INTENT_SIGNALS` and
  `RESOURCE_MAP` for the five real intents this surface classifies, and discovers where that map's
  filenames diverge from the live `references/`/`assets/` tree.
- **Grounding pass**: lists `references/` and `assets/` directly, greps `styles.css` for a real
  `.db-*` class, lists `src/views/modals/`, and confirms which modal has no screenshot fixture.
- **Drafting pass**: eight files — one root index plus seven scenarios, two each for
  `IMPLEMENTATION` and `CODE_QUALITY` (the intents carrying this surface's sharpest documented
  risks), one each for `DEBUGGING`, `VERIFICATION`, `STACK_STANDARDS`.
- **Spec-kit wrapper**: `spec.md`, `plan.md`, `tasks.md` restate the same work in the level-2
  spec-kit shape, so this leaf validates like every sibling phase folder.

### Data Flow
`sk-code-mobile-cli/manual-testing-playbook/` shape + `sk-code-obsidian/SKILL.md` §2b routing
contract + live `references/`/`assets/`/plugin-source grounding → eight cited files under
`sk-code-obsidian/manual-testing-playbook/` → the spec-kit wrapper documents around them → the Lane
C harness or `run-manual-playbook-scenario.cjs` may execute this corpus in a future run.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase
checkboxes and task state.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Shape check | Root index and every scenario carry the template's frontmatter keys and five-section order | Manual re-read against `sk-code-mobile-cli/manual-testing-playbook/token-edit-routing.md` |
| Path-existence check | Every `expected_resources` path resolves under `sk-code-obsidian/` | `test -e` loop per scenario, 23 paths total |
| ID/table cross-check | Root index's table IDs, intents, and filenames match each scenario's frontmatter exactly | Manual re-read, both directions |
| Scaffold-residue check | No `REQUIREMENT_PLACEHOLDER` or bare `**Given**` remains in `spec.md`/`plan.md`/`tasks.md` | `grep` for the scaffold markers |
| Boundary check | No file written outside `sk-code-obsidian/manual-testing-playbook/` or this leaf's folder | `git status` / diff review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/manual-testing-playbook/` | External (hub repo) | Green — index and two scenario files read in full | The shape template; deviating from it violates `../goal.md` §3's frozen constraint |
| `sk-code-obsidian/SKILL.md` §2b | Internal (this packet, read-only) | Green — read in full | Without it, `INTENT_SIGNALS`/`RESOURCE_MAP` and the real-vs-stale filename drift would be unsourced |
| `sk-code-obsidian/references/` and `assets/` (phases 005-006) | Internal (this packet) | Green — listed directly, 23 cited paths verified | Without it, `expected_resources` paths would be copied from `SKILL.md` §2b's stale map instead of the live tree |
| Plugin repo live evidence (`styles.css`, `src/views/modals/`, `tools/screenshots/`) | Internal (plugin repo) | Green — read/grepped this session | Without it, the `.db-*` class and unphotographed-modal examples would be recalled rather than cited |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a later phase finds a citation in one of the seven scenarios no longer matches the
  live packet or plugin file (a reference renamed, `SKILL.md` §2b's map corrected, a modal gains a
  fixture, a class renamed).
- **Procedure**: correct the specific cited section in place; these are documentation artifacts, so
  rollback is an edit, not a revert. No downstream tooling depends on their exact wording yet — no
  Lane C run or manual-scenario wrapper run has executed against this corpus.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Grounding (template + SKILL.md §2b + live references/assets/plugin evidence) ──► Drafting (8 files) ──► Verification (shape, path-existence, ID cross-check)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Grounding | None | Drafting |
| Drafting | Grounding | Verification |
| Verification | Drafting | Phase 008 (scanners-and-gates) and any future Lane C run against this corpus |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Grounding | Med | Reading ~6 files across the hub template, this packet's `SKILL.md`, and the plugin repo, plus two directory listings |
| Drafting | Med | Eight files, ~1,600 lines total, each scenario independently cited |
| Verification | Low | Path-existence and ID/table cross-check per file |
| **Total** | | **Single-session** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every live file this plan cites was actually opened, listed, or grepped this session, not
  recalled from training.
- [x] No packet file was written outside `sk-code-obsidian/manual-testing-playbook/` or
  `007-manual-testing-playbook/`.

### Rollback Procedure
1. Identify the stale citation or section in the affected scenario.
2. Edit that section in place with the corrected fact.
3. Re-run the path-existence and ID/table cross-check in §5.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — this phase mutates only
  `sk-code-obsidian/manual-testing-playbook/` and its own spec-kit folder.

<!-- /ANCHOR:enhanced-rollback -->
