---
title: "Verification Checklist: Phase 2: Remediate Slash Commands & Assets"
description: "Level 2 QA checklist mapped to the 12 confirmed CMD/XS findings fixed in this phase; each item verified by grep or manual re-render, not narrative claim."
trigger_phrases:
  - "remediate slash commands checklist"
  - "cmd findings verification checklist"
  - "002-remediation-slash-commands checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-command-agent-conformance-audit/002-remediation-slash-commands"
    last_updated_at: "2026-07-11T08:49:19Z"
    last_updated_by: "markdown-agent"
    recent_action: "All CHK items [x] w/ evidence; CHK-032 met, CHK-042 N/A (no changelog)"
    next_safe_action: "006 closeout: recompile deep contracts, then skill-graph regen"
    blockers: []
    key_files:
      - ".opencode/commands/create/assets/create_agent_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "conformance-audit-132"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 2: Remediate Slash Commands & Assets

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (12 REQ rows, one per finding or tight finding-group) — EVIDENCE: spec.md:163-184 (REQ-001 through REQ-012, 12 rows) confirmed present pre-implementation.
- [x] CHK-002 [P0] Technical approach + shared-file sequencing defined in plan.md (CMD-02->03->04->09, CMD-08->11) — EVIDENCE: plan.md:199-227 (L2: PHASE DEPENDENCIES) confirmed pre-implementation; sequencing honored during execution (CMD-02 before CMD-03 before CMD-04 before CMD-09; CMD-08 before CMD-11).
- [x] CHK-003 [P1] Dependencies identified and available (`sk-design/mode-registry.json`, `cli-external/cli-opencode/SKILL.md`, `markdown.md` agent — all confirmed present on disk) — EVIDENCE: `sk-design/mode-registry.json` read directly (design-mcp-open-design transport entry confirmed, `command: null`); `.opencode/skills/cli-external/cli-opencode/SKILL.md` path used verbatim in CMD-08 reword; `markdown.md` confirmed present via CMD-04 retarget (`.opencode/agents/markdown.md`, `.claude/agents/markdown.md`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every fixed YAML remains valid YAML (no syntax break introduced by the block-add/rename edits) — EVIDENCE: `python3 yaml.safe_load()` run against all 22 edited `.yaml` files, OK=22 FAIL=0.
- [x] CHK-011 [P0] No stray diff outside the 12-finding scope (SCOPE LOCK — `git diff --stat` matches only the files listed in spec.md §3) — EVIDENCE: `git diff --stat` restricted to my 35 edited paths matches spec.md §3's Files-to-Change families exactly (speckit/create/deep/design assets + agent_router.md); unrelated `.opencode/commands/doctor/**` diffs observed in a broader `git status` belong to a concurrent sibling-phase session (003-remediation-doctor), not touched by this agent.
- [x] CHK-012 [P1] `:auto`/`:confirm` mirror edits stay symmetric where a finding lists both variants (CMD-01,02,04,06,07,08,09,11) — EVIDENCE: CMD-01 (6/6 speckit files symmetric), CMD-02 (auto+confirm pairs symmetric across all 12), CMD-04 (both create_agent_*/create_readme_* variants), CMD-06 (all 3 presentation files), CMD-08 (both self-invocation-guard AND the mirrored shorthand note fixed in all 4 auto/confirm files), CMD-09 (both create_readme_* variants), CMD-11 (both deep_review_* variants) — all confirmed symmetric via the grep sweeps in tasks.md.
- [x] CHK-013 [P1] Fixes match the established sibling pattern already present in the same file family (e.g. CMD-03 matches `create_command_auto.yaml:287-300`'s distributed-governance prose) — EVIDENCE: CMD-03 confirmed byte-pattern match against `create_command_auto.yaml:287-300`'s `outputs: - spec.md: created_or_updated` shape.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 12 REQ acceptance criteria met (spec.md §4) — each finding's broken-pattern grep returns 0 residual hits — EVIDENCE: all 12 findings' acceptance criteria met — 11 via 0-residual-hit greps (tasks.md T004-T024) and XS-04 (REQ-012) via the new `validate-command-references.cjs` checker exiting 0 on the post-fix tree and non-zero on its broken fixture (tasks.md T025-T026).
- [x] CHK-021 [P0] Manual re-render of every touched command's `:auto`/`:confirm` complete (tasks.md T027) — EVIDENCE: see tasks.md T027.
- [x] CHK-022 [P1] Shared-file edge cases verified: CMD-02/03/04/09 applied in sequence with no interleaved diff; CMD-08/11 applied in sequence — EVIDENCE: executed in exact order CMD-02 -> CMD-03 -> CMD-04 -> CMD-09 (create_agent_*/create_readme_* files) and CMD-08 -> CMD-11 (deep_review_* files), one finding fully verified before the next began; no interleaving.
- [x] CHK-023 [P1] `deep/assets/compiled/*.contract.md` and `manifest.jsonl` confirmed byte-identical to pre-phase state (CMD-05 stayed deferred to 006) — EVIDENCE: `git status --porcelain .opencode/commands/deep/assets/compiled/` empty after all CMD-06/CMD-08/CMD-11 source edits.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each of the 12 findings has a finding class: `instance-only` (CMD-07, CMD-10, CMD-11, XS-02), `class-of-bug` (CMD-02, CMD-03, CMD-04, CMD-08), `cross-consumer` (CMD-01), `matrix/evidence` (CMD-06, CMD-09), or `test-isolation`/new-tooling (XS-04). — EVIDENCE: classes carried through into the fix approach; CMD-02/CMD-08's `class-of-bug` label is what justified sweeping the full live instance set (12 files for CMD-02, all 4 mirrored shorthand notes for CMD-08) rather than stopping at research.md's originally-cited subset.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for CMD-02 (10-file `default: .opencode/agent` grep sweep, confirmed exact count) — see plan.md "Required inventories". — EVIDENCE: re-run 2026-07-11, actual live count is 12 (not 10 — 2 additional files drifted in since 001's research closed); full inventory: `create_changelog_confirm.yaml`, `create_feature_catalog_auto.yaml`, `create_agent_auto.yaml`, `create_agent_confirm.yaml`, `create_skill_auto.yaml`, `create_skill_confirm.yaml`, `create_readme_auto.yaml`, `create_readme_confirm.yaml`, `create_changelog_auto.yaml`, `create_feature_catalog_confirm.yaml`, `create_manual_testing_playbook_auto.yaml`, `create_manual_testing_playbook_confirm.yaml`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for every changed `[runtime_agent_path]`/`agent_availability` symbol (CMD-01, CMD-03, CMD-04) and every `folder_readme.md`/`create_agent_verified` reference (CMD-09). — EVIDENCE: CMD-03's 3 live `runtime_agent_path_resolution` consumers enumerated and verified untouched (T007 evidence); CMD-09's `create_agent_verified` consumer inventory found 4 sites (not 1), all renamed (T019 evidence).
- [x] CHK-FIX-004 [P0] N/A for this phase — no security/path/parser/redaction logic is touched; every fix is a literal string/block substitution (spec.md §"Algorithm invariant"). — [deferred: not applicable, no security or parser logic touched by any of the 11 fixed findings, confirmed during scope review]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (plan.md "FIX ADDENDUM: AFFECTED SURFACES" — file family x severity x shared-file-collision). — EVIDENCE: plan.md:105-121 (FIX ADDENDUM: AFFECTED SURFACES) confirmed present pre-implementation; followed during execution.
- [x] CHK-FIX-006 [P1] N/A — no process-wide or global env state is read by these fixes (static command-asset edits only). — [deferred: not applicable, static command-asset text edits only, no process or environment state read]
- [x] CHK-FIX-007 [P1] Evidence pinned to the specific fix commit SHA (recorded in implementation-summary.md at completion time, not this planning turn). — DEFERRED TO COMMIT TIME: this agent does not run `git commit` per its dispatch contract; implementation-summary.md records the working-tree evidence (grep/diff output) instead of a commit SHA, to be back-filled by whichever downstream step performs the commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced or touched (N/A — command-asset text edits only) — [deferred: not applicable, all 35 edited files are command-asset markdown/YAML/text with no credential or secret material]
- [x] CHK-031 [P0] XS-02's `allowed-tools` replacement grants only current, supported OpenCode tool names (no over-grant reintroduced) — EVIDENCE: `allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch` — every name cross-checked against a 30+ file grep sweep of other commands' `allowed-tools` frontmatter; no new tool added, 2 unsupported ones (`WebSearch`, `AskUserQuestion`) removed.
- [x] CHK-032 [P1] XS-04's checker correctly excludes the legitimate `.codex` runtime-mirror/benchmark-executor references (research.md §5 false-positive guard) — no false-positive block on live tokens — EVIDENCE: the fixture's `ok_codex_mirror: ".codex/agents/markdown.md"` line is not flagged (`.codex` is in the checker's runtime-dir allowlist; `.codex/`-prefixed agent files resolve as legitimate mirrors), and `--self-test`'s real-tree scan reports 0 unresolved across all create/deep/design assets.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md/plan.md/tasks.md/checklist.md synchronized on the same 12-finding scope and P0/P1/P2 grouping — EVIDENCE: `grep -c "CMD-\|XS-0"` cross-checked across spec.md, plan.md, tasks.md, checklist.md; all 4 reference the identical 12-finding id set (CMD-01..04,06-11,XS-02,XS-04) throughout.
- [x] CHK-041 [P1] Every Scope-table row cites the exact file:line from `research/research.md`, with drift explicitly noted for CMD-06/CMD-08 — EVIDENCE: spec.md §3 rows verified against disk; CMD-02's file-count drift (10→12) additionally noted in tasks.md T001/T005/CHK-FIX-002 (a drift class research.md's own risk table did not anticipate, alongside the already-documented CMD-06/CMD-08 line-number drift).
- [x] CHK-042 [P2] `../changelog/` entry added for this phase when it closes (per spec.md Phase Context "Changelog") — N/A: this packet uses no `../changelog/` convention — no `changelog/` directory exists under the parent and none of the sibling phases (001/003–006) created one — so the optional changelog refresh is intentionally not actioned, consistent with every sibling closeout. No changelog file was fabricated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Any temp/working files created during the fix pass live in `scratch/` only — CONFIRMED N/A: no temp files were created; every edit went directly to its target live file.
- [x] CHK-051 [P1] `scratch/` cleaned before completion is claimed — EVIDENCE: `scratch/` contains only `.gitkeep`, unchanged.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 (CHK-032 met — XS-04 checker built + self-test verified; CHK-042 N/A — no changelog convention in this packet) |

**Verification Date**: 2026-07-11 — all 12 findings fixed and grep-verified; XS-04's referential-integrity checker built and self-test-verified (see implementation-summary.md); CMD-05/XS-01/XS-03 correctly unactioned (owned by phase 006).
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
