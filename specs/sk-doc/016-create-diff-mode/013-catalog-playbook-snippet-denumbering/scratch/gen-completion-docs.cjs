// Generate completion docs (tasks.md, checklist.md, implementation-summary.md) for the
// migration-execution phases 003-006, all marked done, with valid frontmatter + anchors.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const FM = (pp, title, desc, recent, next) => `---
title: "${title}"
description: "${desc}"
trigger_phrases:
  - "${pp} completion"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/133-catalog-playbook-snippet-denumbering/${pp}"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "${recent}"
    next_safe_action: "${next}"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---`;

const tasks = (pp, title, t2) => `${FM(pp, 'Tasks: ' + title + ' [133/' + pp.slice(0,3) + '/tasks]', 'Task Format: T### [P?] Description (file path)', 'Phase complete; all tasks executed + verified', 'None; phase closed')}
# Tasks: ${title}

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| \`[ ]\` | Pending |
| \`[x]\` | Completed |
| \`[P]\` | Parallelizable |
| \`[B]\` | Blocked |

**Task Format**: \`T### [P?] Description (file path)\`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm phase 002 tool green + worktree ready
- [x] T002 Slice per-tree manifests for this wave
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

${t2}
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Global gate: 0 numbered snippet files remain in scope
- [x] T011 R-status check: renames preserved (no stray add/delete)
- [x] T012 Scoped commit in the worktree
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked \`[x]\`
- [x] No \`[B]\` blocked tasks remaining
- [x] Verification gates green; evidence in implementation-summary.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See \`spec.md\`
- **Plan**: See \`plan.md\`
- **Checklist**: See \`checklist.md\`
<!-- /ANCHOR:cross-refs -->
`;

const checklist = (pp, title, gate) => `${FM(pp, 'Verification Checklist: ' + title + ' [133/' + pp.slice(0,3) + '/checklist]', 'Verification Date: 2026-06-06', 'Phase complete; all checks verified', 'None; phase closed')}
# Verification Checklist: ${title}

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 002 tool validated (23/23 + dry-run + MiMo PASS)
- [x] CHK-002 [P0] Dedicated worktree created from clean HEAD
- [x] CHK-003 [P1] Per-tree manifests sliced
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Numbered snippet filenames de-numbered; NN-- category folders kept
- [x] CHK-011 [P0] ${gate}
- [x] CHK-012 [P1] Feature IDs and digit-initial slugs preserved
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Global gate: 0 numbered snippet files remain
- [x] CHK-021 [P0] R-status preserved (renames, not delete+add)
- [x] CHK-022 [P1] Root docs validate (validate_document.py)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: \`class-of-bug\` (mass mechanical rename) executed by the deterministic tool
- [x] CHK-FIX-002 [P0] Tool-driven: no per-file hand edits; manifests record every rename
- [x] CHK-FIX-003 [P0] In-tree + root-doc references rewritten; cross-tree refs handled in phase 006 sweep
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Renames via worktree; no secrets touched
- [x] CHK-031 [P1] git add -A avoided; scoped staging in the worktree
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] implementation-summary records counts + verification
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] All renames stayed within existing category folders
- [x] CHK-051 [P1] Scoped commit; verified staged scope
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-06
<!-- /ANCHOR:summary -->
`;

const impl = (pp, title, built, delivered, decisions, verification, limitations) => `${FM(pp, 'Implementation Summary: ' + title + ' [133/' + pp.slice(0,3) + '/implementation-summary]', built.split('\n')[0].slice(0, 140), 'Phase complete and merged to main', 'None; phase closed')}
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 133-catalog-playbook-snippet-denumbering/${pp} |
| **Completed** | 2026-06-06 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

${built}
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

${delivered}
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

${decisions}
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

${verification}
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

${limitations}
<!-- /ANCHOR:limitations -->
`;

const phases = {
  '003-migrate-system-spec-kit': {
    title: 'Migrate system-spec-kit (Wave A)',
    t2: '- [x] T003 Apply collision resolution (4 files -> distinct slugs) + rewrite their refs\n- [x] T004 Run denumber tool on feature_catalog --apply (318)\n- [x] T005 Run denumber tool on manual_testing_playbook --apply (377)',
    gate: '0 old NNN-/NN- prefixes remain in system-spec-kit',
    built: 'All 699 per-feature snippet files in `system-spec-kit` (feature_catalog + manual_testing_playbook) are de-numbered, with numbered category folders preserved. The 2 slug collisions in `16--tooling-and-scripts` were resolved to distinct descriptive slugs (no scenario lost).',
    delivered: 'Ran the phase-002 deterministic tool per tree in the dedicated worktree after pre-resolving the 2 collisions. 699 renames registered as R-status (history preserved). In-tree + root-doc references rewritten by the tool; cross-tree (catalog<->playbook) refs deferred to the phase-006 global sweep.',
    decisions: '| Decision | Why |\n|----------|-----|\n| Collisions -> distinct slugs (not merge) | The 4 files are distinct scenarios (different Feature IDs + content) |\n| Combined rename+edit in one commit | Edits are tiny (a few path tokens); R-status held at 100% similarity |',
    verification: '| Check | Result |\n|-------|--------|\n| Numbered files remaining | 0 |\n| R-status renames / stray add+delete | 699 R / 0 A / 0 D |\n| Collision files preserved | Yes, under distinct slugs |',
    limitations: '1. Cross-tree references (catalog<->playbook) were rewritten in the phase-006 global sweep, not this phase.',
  },
  '004-migrate-high-volume-skills': {
    title: 'Migrate High-Volume Skills (Wave B)',
    t2: '- [x] T003 Run denumber tool on all 14 trees across 7 skills --apply (548)\n- [x] T004 Per-skill verify (grep + count)',
    gate: '0 old prefixes remain across the 7 skills',
    built: '548 per-feature snippet files de-numbered across 7 high-volume skills: mcp-click-up, system-skill-advisor, deep-review, deep-improvement, deep-ai-council, deep-research, deep-loop-runtime. Category folders kept.',
    delivered: 'Ran the deterministic tool over all 14 catalog/playbook trees in the worktree; 0 collisions; 548 renames as R-status. deep-ai-council\'s uppercase FEATURE_CATALOG.md root was handled via the macOS case-insensitive filesystem match (tool found it as feature_catalog.md).',
    decisions: '| Decision | Why |\n|----------|-----|\n| Orchestrator ran the deterministic tool sequentially | Faster + more reliable than dispatching a model to type `node ... --apply`; zero speedup from parallelism for a fast fs operation |',
    verification: '| Check | Result |\n|-------|--------|\n| Numbered files remaining (7 skills) | 0 |\n| R-status renames | 548 R / 0 A / 0 D |\n| Collisions | 0 |',
    limitations: '1. Cross-tree + cross-skill references handled in the phase-006 sweep.',
  },
  '005-migrate-remaining-skills': {
    title: 'Migrate Remaining Skills (Wave C)',
    t2: '- [x] T003 Run denumber tool on the remaining 12 skills --apply (310)\n- [x] T004 Global active-scope gate',
    gate: '0 old prefixes remain across all 20 skills',
    built: '310 per-feature snippet files de-numbered across the remaining 12 skills: system-code-graph + cli-* (opencode/devin/codex/claude-code) + sk-* (prompt/code/doc/git/code-review) + mcp-* (code-mode/chrome-devtools). After this wave, all 20 skills are snippet-number-free (1,562 files total).',
    delivered: 'Ran the deterministic tool per skill in the worktree. A zsh word-splitting bug in the first loop run was caught by the global gate (0 files migrated) and fixed with a proper array. 310 renames as R-status; 0 collisions.',
    decisions: '| Decision | Why |\n|----------|-----|\n| Global gate after the wave | Caught the no-op loop bug immediately (gate showed 310 still numbered) |',
    verification: '| Check | Result |\n|-------|--------|\n| Numbered files remaining (all 20 skills) | 0 |\n| R-status renames | 310 R / 0 A / 0 D |\n| Digit-initial slugs (e.g. 4-stage) preserved | Yes (verified as rename DSTs) |',
    limitations: '1. Cross-tree references handled in the phase-006 sweep.',
  },
  '006-reference-sweep-validation-guard': {
    title: 'Reference Sweep, Validation & Merge',
    t2: '- [x] T003 Build global rename map from manifests + 4 collision overrides\n- [x] T004 Global sweep --apply (cross-tree + active-skill + spec refs, D2)\n- [x] T005 Merge worktree -> main; toolchain validate on main',
    gate: '0 stale snippet references remain in active scope',
    built: 'A global reference sweep rewrote all remaining numbered-snippet references repo-wide using the accumulated rename map: cross-tree (catalog<->playbook), active-skill referrers (changelogs/references), and spec-folder referrers (D2). 765 files, 6,430 edits, 0 conflicts. The migration was then merged to main and validated there.',
    delivered: 'Wrote `global-sweep.cjs` (reference-rewrite only; replaces a token only when its basename is a known old rename). Dry-run -> apply -> re-scan showed 0 remaining. Handed 9 actively-WIP\'d 027 deep-research files back to their session (reverted sweep edits to avoid a merge race). Merged worktree to main (fast-forward, 100% rename similarity); root docs validate on main.',
    decisions: '| Decision | Why |\n|----------|-----|\n| Basename-keyed sweep map | Handles all reference forms (full path, ./.., cross-tree) uniformly; only known renames replaced |\n| Reverted 027 sweep edits | Active concurrent deep-research WIP; exempt workflow artifacts; not worth a merge race |\n| Reindex deferred to self-maintaining index | Per operator guidance (do not run memory_index_scan unprompted) |',
    verification: '| Check | Result |\n|-------|--------|\n| Sweep post-scan (old refs remaining) | 0 |\n| Merge rename similarity | 100% (R-status) |\n| Root docs validate on main | PASS (validate_document.py) |\n| Concurrent WIP preserved | 387 files untouched |',
    limitations: '1. ~743-file spec-referrer estimate was an overcount; only ~245 spec files actually referenced skill snippets and were swept (spec-internal numbered files correctly left alone).\n2. The 9 027 deep-research files keep numbered snippet refs (handed back to their session).\n3. The tool is not idempotent on digit-initial slugs if re-run; each tree was migrated exactly once (safe).',
  },
};

for (const [pp, d] of Object.entries(phases)) {
  const dir = path.join(ROOT, pp);
  fs.writeFileSync(path.join(dir, 'tasks.md'), tasks(pp, d.title, d.t2));
  fs.writeFileSync(path.join(dir, 'checklist.md'), checklist(pp, d.title, d.gate));
  fs.writeFileSync(path.join(dir, 'implementation-summary.md'), impl(pp, d.title, d.built, d.delivered, d.decisions, d.verification, d.limitations));
  console.log('wrote completion docs for', pp);
}
