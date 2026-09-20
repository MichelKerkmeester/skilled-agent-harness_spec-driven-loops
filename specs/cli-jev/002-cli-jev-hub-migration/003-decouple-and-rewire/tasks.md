---
title: "Tasks: Phase 3: decouple-and-rewire"
description: "Task list for the decoupling verification, the dispatch-chain rewiring, the roster and generated-surface updates, the hub release-line reset, and the gates that close the phase."
trigger_phrases:
  - "phase tasks"
  - "decouple and rewire"
  - "verification checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/002-cli-jev-hub-migration/003-decouple-and-rewire"
    last_updated_at: "2026-09-20T15:20:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Task list authored at closeout from the executed phase"
    next_safe_action: "Run phase 004: onboard the hub to the compiled-routing fleet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-002-003-decouple-and-rewire"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: decouple-and-rewire

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

- [x] T001 Verify the parallel writer's landed decoupling read-only and attribute it: the old hub declares seven modes and no extension, its router carries no `cli-jev` signal, vocabulary class or `tieBreak` entry, and commit `e66dccd6a2` is the source (`.skilled/skills/cli-external-orchestration/`)
- [x] T002 Census the live trees for the retired packet path and classify every hit as recorded history, the kept dispatch display name, or a defect, so no later edit is a blind substitution (repo root)
- [x] T003 Record the stale-surface baseline before any regeneration: 16 trigger-index rows, 41 corpus-manifest rows, 25 diagnostics rows, 35 CSV and 70 JSON frontmatter-manifest rows, a non-reproducible durable-directory fixture, and no `cli-jev` row in the description cache (`.skilled/skills/system-spec-kit/runtime/`, `specs/descriptions.json`)
- [x] T004 Re-read the phase-002 record of the open enforcement hole as this phase's starting failure: the same preflight call that was approved because the rules failed open (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Move the jev row's `packetPath` to `cli-jev/cli-usage` and keep `skill: 'cli-jev'` as the display name and alias the request already names (`.skilled/hooks/dispatch/lib/dispatch-audit.mjs`)
- [x] T006 Update both hook suites: the second packet scan root and the bijection enumeration, the shape-to-`SKILL.md` existence assertion and the `packetPath` assertion, plus one example command string (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`, `dispatch-audit.test.mjs`)
- [x] T007 Prove enforcement live: pipe a Bash tool-call for `jev run @request.json --value` through the preflight hook and record the refusal text (`.skilled/hooks/dispatch/claude/dispatch-preflight-lint.mjs`)
- [x] T008 Rewire the orchestrate roster: Rule 7's transport paragraph, the anti-pattern table row and the related-resource list now name `cli-usage` and its hub (`.skilled/agents/orchestrate.md`)
- [x] T009 Mirror the same body into the Claude twin so the pair stays in step by hand, as the crosswalk requires (`.claude/agents/orchestrate.md`)
- [x] T010 Rewire the prompt-improver roster and its Claude twin: the transport sentence names `cli-usage`, the only mode of the `cli-jev` hub (`.skilled/agents/prompt-improver.md`, `.claude/agents/prompt-improver.md`)
- [x] T011 Record the Pi tree's pre-existing staleness, then regenerate both generated trees with their own scripts and confirm the blast radius is the two edited agents (`.pi/agents/`, `.codex/agents/`)
- [x] T012 Add the `cli-jev` hub row to the skills roster and correct the identity counts (`.skilled/skills/README.txt`)
- [x] T013 Repoint the transport row in the canonical CLI prompt-quality card (`.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`)
- [x] T014 Confirm the rewrite note needs no change: its supported-engine list is a deliberate seven-engine surface and never carried the transport (`commands/rewrite/response-by-external-agent.md`)
- [x] T015 Reset the hub's release line to `0.1.0.0` by operator direction, rename the changelog by `git mv` and repoint its two links (`.skilled/skills/cli-jev/SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json`, `mode-registry.json`, `changelog/v0.1.0.0.md`, `README.md`)
- [x] T016 Fix the old hub's remaining prose claims and re-mint its compiled manifest, copying the runtime manifest over the authored twin (`.skilled/skills/cli-external-orchestration/SKILL.md`, `README.md`, `.skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-external-orchestration/manifest.json`)
- [x] T017 Reconcile the documents that cite the renamed changelog or the moved packet: two phase-002 rows and the migrated packet's continuity `key_files` (`.skilled/skills/cli-jev/changelog/v0.1.0.0.md`, `specs/cli-jev/002-cli-jev-hub-migration/002-hub-scaffold-and-mode-migration/`, `specs/cli-jev/001-cli-jev-creation/spec.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Regenerate the trigger index with its own generator and prove determinism by comparing file hashes across two runs (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`, `cli/retrieval/fixtures/`)
- [x] T019 Regenerate both frontmatter-version manifests in compute mode and confirm no retired path remains (repo root)
- [x] T020 Refresh the sk-doc durable-directory fixture through the test's own `--write` path and re-run the test read-only to confirm it reproduces (`.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`)
- [x] T021 Insert the new track's rows into the description cache through the folder-discovery upsert, measuring the delta so no sibling row moves (`.skilled/skills/system-spec-kit/runtime/lib/search/folder-discovery.ts`, `specs/descriptions.json`)
- [x] T022 Run the four agent-mirror gates and record that all four exit 0 (`.skilled/agents/`, `.claude/agents/`, `.pi/agents/`, `.codex/agents/`)
- [x] T023 Re-run the doctor on both hubs and the strict package validator on the hub, recording the counts and the version lines (`.skilled/skills/cli-external-orchestration`, `.skilled/skills/cli-jev`)
- [x] T024 Run the compiled-route guard and both compiled-route probes: the old hub fresh and resolving `cli-codex`, the new hub still reporting its legacy sentinel (`.skilled/bin/compiled-route-guard.cjs`)
- [x] T025 Run `repair-derived.cjs --apply` and the recursive strict validator on both packets, recording each folder's result (repo root)
- [x] T026 Record the limitations this phase leaves open with their evidence: the `.hermes` mirror, the sk-doc guard's staleness, the Pi suite's pre-existing `cli-devin` mismatch, the sibling packet's recorded path table, and the parallel writer's quarantined snapshots (repo root)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
