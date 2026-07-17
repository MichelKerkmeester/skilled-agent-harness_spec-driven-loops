---
title: "Spec: Validate, re-benchmark Lane C, prove zero corpus loss"
description: "Phase 005, the gate. After the migration executes, prove nothing regressed: recursive validate.sh --strict across every touched skill, the whole-workspace markdown-link guard, a Lane C smart-routing benchmark re-run on the affected skills proving the discovered scenario count is unchanged with no D1-D5 scoring regression against a baseline captured before Phase 004, a live proof that the no-new-numbered-snippet guard fires, and confirmation that the 2 previously-failing vitest suites now pass."
trigger_phrases:
  - "validate de-numbered snippet migration"
  - "re-benchmark Lane C after de-numbering snippets"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/027-catalog-naming-convention/002-deprecate-numbered-snippet-filenames/005-validate-and-rebenchmark"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Capture the Lane C baseline on the to-be-touched skills before Phase 004 executes the migration"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Validate, Re-Benchmark Lane C, Prove Zero Corpus Loss

> **Phase adjacency** (grouping order under the parent, not a runtime dependency): predecessor `004-execute-migration`; successor none (final phase).

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 026/005-validate-and-rebenchmark |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 005 of 005 (gate) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The parent packet strips the numbered `NNN-` ordinal prefix from 111 per-scenario snippet filenames across
9 skill packets. The only load-bearing consumer of that prefix is
`load-playbook-scenarios.cjs:302` — a `^\d{3}-.*\.md$` gate inside `loadYamlFrontmatterScenarios()` that
ingests sk-doc-shape scenarios only when the basename is 3-digit-prefixed. Phase 001 makes that gate
number-agnostic and Phase 004 executes the rename; if either step is wrong, the deep-improvement Lane C
skill-benchmark corpus silently loses scenarios with no error thrown. This phase is the gate that proves
that did not happen: it establishes a Lane C baseline before Phase 004 touches anything, then after the
migration lands it re-runs recursive strict validation, the workspace link guard, the Lane C benchmark on
the affected skills, a live proof that the Phase 001 no-new-numbered-snippet guard actually fires, and
confirmation that the 2 pre-existing failing vitest suites folded into this packet (decision B / ADR-007)
now pass. A regression discovered here blocks the packet's completion claim and routes back to the owning
phase (001-004), not to this one.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope:** capture a pre-migration Lane C baseline — discovered scenario count and D1-D5 scores — on the
9 skill packets that Phase 004 touches (cli-external and its cli-claude-code/cli-opencode mode packets;
mcp-tooling and its mcp-chrome-devtools/mcp-click-up/mcp-figma mode packets; sk-code and its
code-review/code-opencode/code-webflow/code-quality mode packets; sk-prompt; system-deep-loop and its
deep-improvement/deep-research/deep-review mode packets), captured BEFORE Phase 004 renames anything.
After Phase 004 lands: recursive `validate.sh --strict` across the parent packet and every touched skill
surface; the whole-workspace markdown-link guard (covering the 3 hub-routing root-index docs rewritten in
lockstep by Phase 004); a Lane C re-run on the same 9 packets with a before/after delta proving the
discovered scenario count is unchanged (111 renamed files plus the 10+ previously-dropped playbooks the
Phase 001 loader fix recovers) and no D1-D5 scoring regression; a guard-fire proof (create a throwaway
`feature_catalog|manual_testing_playbook/<cat>/NNN-*.md` file, expect the Phase 001 guard to FAIL, remove
it, expect PASS); and confirmation that `feature-flag-reference-docs.vitest.ts` and
`outsourced-agent-handback-docs.vitest.ts` (both previously ENOENT on stale numbered names) now pass, and
that the 7 dead allowlist entries swept from `workflow-invariance.vitest.ts:97-104` in Phase 004 stay
removed.

**Out of scope:** authoring or executing the migration itself (Phases 001-004); fixing any regression found
here — that is done in the owning phase, not invented in this gate; the 20 out-of-scope system-spec-kit
single-digit files (untouched by the migration, so not part of this phase's delta either).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **REQ-001:** Recursive `validate.sh --strict` is Errors 0 across the parent packet and every one of the 9
  touched skill surfaces.
- **REQ-002:** The whole-workspace markdown-link guard passes — no dangling links, with particular attention to
  the 3 hub-routing root-index docs (cli-external, mcp-tooling) that Phase 004 rewrites in lockstep.
- **REQ-003:** The Lane C benchmark re-run on the 9 affected skills shows the discovered scenario count UNCHANGED
  versus the pre-Phase-004 baseline (the rename must not drop any of the 111 files, and the tolerant loader
  from Phase 001 must still surface the previously-dropped 10+ playbooks), and no D1-D5 scoring regression;
  any non-zero delta is explained.
- **REQ-004:** The no-new-numbered-snippet guard (Phase 001 / ADR-005) FAILS on a freshly created
  `feature_catalog|manual_testing_playbook/<cat>/NNN-*.md` file and PASSES once that file is removed —
  demonstrated live, not merely asserted.
- **REQ-005:** `feature-flag-reference-docs.vitest.ts` and `outsourced-agent-handback-docs.vitest.ts` (the 2
  suites folded in under decision B / ADR-007) both pass; the 7 dead allowlist entries in
  `workflow-invariance.vitest.ts:97-104` remain swept.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Recursive `--strict` Errors 0 across parent + all 9 touched skill packets.
2. Link guard green; the 3 hub-routing root-index docs resolve every row.
3. Lane C before/after delta captured and non-regressing: scenario count unchanged, D1-D5 unchanged or
   explained.
4. Guard-fire proof captured (FAIL on new numbered snippet, PASS once removed).
5. Both previously-failing vitest suites pass; the dead allowlist sweep confirmed still in effect.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *"No corpus loss" without a baseline is unfalsifiable* → the Lane C baseline is captured BEFORE Phase 004
  runs, against the already-tolerant Phase 001 loader, and the same measurement is re-run after Phase 004 so
  the delta is a real before/after comparison, not a single post-hoc number (regression-baseline-and-delta
  discipline).
- *The central risk this packet exists to retire*: if Phase 001's loader fix or Phase 004's rename map is
  wrong, `load-playbook-scenarios.cjs` silently drops sk-doc-shape scenarios with no thrown error — this
  phase's scenario-count check is the only thing that would catch that.
- *Depends on* Phases 001-004 being complete; uses the Lane C harness, the spec-kit validator, and the
  markdown-link guard unchanged — no new tooling is authored in this phase.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None. The set of "affected" skills for the benchmark is fixed by Phase 004's touch list (the same 9 packets
named in the parent packet's scope), and the baseline/delta method mirrors the completed 025/005 sibling
gate.
<!-- /ANCHOR:questions -->
