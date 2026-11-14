---
title: "Deep Review Report: purpose-carry changes"
description: "Five-iteration deep review of the 34 non-spec files the purpose-carry commits changed. Verdict CONDITIONAL with two P1 findings on hop rule parity and five P2 advisories."
---

# Deep Review Report: purpose-carry changes

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is CONDITIONAL, so P2 items are carried as advisories, not as a PASS flag)
- **Active findings:** P0 = 0, P1 = 2, P2 = 5
- **Stop reason:** maxIterationsReached (5 of 5, stop policy `max-iterations`)
- **Scope:** the 34 unique non-spec files listed by `git show --name-only --format=` on commits eaba5ab89e, 3d237cd97a, f0d8c03036, 0837fcd5a2, 191ce39bad, 43bff36f9d, e102ba83be, f9f96bdc39, e129af3719 and fce8b5d81c, with paths under `specs/` excluded. The commits list 59 non-spec entries, 34 of them unique.
- **Executor:** every iteration ran as a single `cli-deepseek-harness` lineage, model `deepseek-v4.1-flash-1017`, reasoning effort `max`.
- **Operator review focus:** Check alignment of these changes with sk-code standards, sk-doc's create-skill, create-command and create-readme standards, and whether any manual-testing playbook, feature catalog, README or the root README.md needs updating for the purpose-carry feature.

The purpose carry works on every hop, but two hops still state a narrower rule than the shared reader. The relaunch nudge names fewer heading shapes than the other hops and drops the repo-relative parent label. The Pi compaction hook skips the nearest-`spec.md` walk-up that the Claude hook performs. On the operator focus, the local module READMEs were updated with the feature, but the manual-testing playbook, the feature catalog entries for the touched hops and the root `README.md` do not mention the purpose line.
<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:planning-trigger -->
## 2. Planning Trigger

`/speckit:plan` is required: two active P1 findings make the verdict CONDITIONAL.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "file": ".skilled/hooks/session-relaunch/lib/nudge.cjs:24-33", "title": "Relaunch purpose rule is narrower than the shared hop rule", "findingClass": "cross-consumer"},
    {"id": "R1-P1-002", "severity": "P1", "file": ".skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80-89", "title": "Pi compaction skips the nearest-spec.md walk-up the Claude compaction uses", "findingClass": "cross-consumer"},
    {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:113-115", "title": "The 300-character purpose cut can split a surrogate pair", "findingClass": "instance-only"},
    {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:228-250", "title": "The purpose line bypasses the recovered-context sanitizer and control-character stripping on the Claude compaction path", "findingClass": "cross-consumer"},
    {"id": "R2-P2-002", "severity": "P2", "file": ".skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md", "title": "The operator-facing hop scenarios and root README do not name the new purpose line", "findingClass": "instance-only"},
    {"id": "R3-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:72-79", "title": "The Pi compaction adapter duplicates the purpose interface and reaches past the runtime API for the problem formatter", "findingClass": "cross-consumer"},
    {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/lib/README.md:118", "title": "The library index still scopes packet-purpose.ts to the compaction hop", "findingClass": "instance-only"}
  ],
  "remediationWorkstreams": [
    "WS1 hop rule parity: align the relaunch nudge with handoff.md and the resume assets (R1-P1-001)",
    "WS2 Pi compaction parity: share the folder-to-packet walk-up with the Claude hook (R1-P1-002, R3-P2-001)",
    "WS3 advisories: surrogate-safe cut, Claude sanitizer parity, lib README row, playbook/catalog/root README (R1-P2-001, R2-P2-001, R4-P2-001, R2-P2-002)"
  ],
  "specSeed": [
    "Every hop states one purpose rule: the same heading shapes and the same repo-relative parent label",
    "The Claude and Pi compaction hooks resolve a folder to its packet the same way"
  ],
  "planSeed": [
    "Rewrite GOAL_GUIDANCE in nudge.cjs to the handoff.md rule and extend nudge.test.cjs to the ## PURPOSE and ## ROOT PURPOSE shapes",
    "Move the nearest-spec.md walk-up into one shared resolver used by session-prime.ts and session-compact-context.ts, with a subfolder fixture",
    "Add purpose-line rows to the playbook hop scenarios, the two feature-catalog hop entries and the root README hop description"
  ],
  "findingClasses": ["cross-consumer", "instance-only"],
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-relaunch/lib/nudge.cjs",
    ".skilled/hooks/session-relaunch/tests/nudge.test.cjs",
    ".skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts",
    ".skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts",
    ".skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts",
    ".skilled/skills/system-spec-kit/runtime/lib/README.md",
    ".skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md",
    ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md",
    ".skilled/skills/system-spec-kit/feature-catalog/context-preservation/compaction-history-lookup.md",
    "README.md"
  ],
  "fixCompletenessRequired": true
}
```
<!-- /ANCHOR:planning-trigger -->

<!-- ANCHOR:active-finding-registry -->
## 3. Active Finding Registry

The reducer registry holds nine open rows because a finding re-verified in iteration 5 with a shifted line range was stored as a second row (R1-P1-001 at lines 27 and 24, R2-P2-001 with and without a line). Deduplicated by finding id there are seven active findings. The adversarial self-check reopened both P1 citations and kept their severity.

### R1-P1-001 (P1): Relaunch purpose rule is narrower than the shared hop rule
- **Dimension:** correctness (also traceability, `spec_code`)
- **File:** `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-33`
- **Evidence:** `GOAL_GUIDANCE` names only the `## PROBLEM & PURPOSE` section and an unqualified `<parent folder>`. `.skilled/commands/speckit/handoff.md:136-137` also accepts `## PURPOSE` and `## ROOT PURPOSE` and requires a repo-relative parent folder, and the resume assets (`speckit-resume-auto.yaml:139`, `speckit-resume-confirm.yaml:158`) match handoff.md. `nudge.test.cjs:109` pins only the narrower text.
- **Impact:** the relaunch note can omit the purpose for a packet whose `spec.md` uses `## PURPOSE` or `## ROOT PURPOSE`, and can print a parent label in a different shape from the other three hops.
- **Fix:** make the nudge heading list and parent-label definition match handoff.md, and add the two missing heading shapes to `nudge.test.cjs`.
- **Disposition:** active, confirmed in iterations 1 and 5 and by the synthesis citation check. **scopeProof:** commit f9f96bdc39 widened the other hops in the same change. **affectedSurfaceHints:** relaunch nudge and its test.
- **Claim adjudication:** confidence high; downgrade trigger is a test or comment stating that the relaunch hop intentionally supports only `## PROBLEM & PURPOSE`.

### R1-P1-002 (P1): Pi compaction skips the nearest-spec.md walk-up the Claude compaction uses
- **Dimension:** correctness (also `agent_cross_runtime`)
- **File:** `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:80-89`
- **Evidence:** the Pi hook resolves `lastSpecFolder` and passes it straight to `resolvePacketPurpose`. The Claude hook walks up to the nearest folder holding a `spec.md` first (`session-prime.ts:236-244`), a walk added in e129af3719 for track-folder and subfolder values. Both hooks read the same `lastSpecFolder` state.
- **Impact:** a subfolder-shaped or track-shaped `lastSpecFolder` loses the purpose after a compaction on Pi but not on Claude.
- **Fix:** share one folder-to-packet resolver with the walk-up between the two hooks, with a subfolder fixture in `hook-precompact.vitest.ts`.
- **Disposition:** active. **scopeProof:** the walk-up comment in `session-prime.ts:239` names the shapes. **affectedSurfaceHints:** both compaction hooks.
- **Claim adjudication:** confidence medium-high; downgrade trigger is a writer guarantee or test proving Pi's `lastSpecFolder` always names a packet folder.

### R1-P2-001 (P2): The 300-character purpose cut can split a surrogate pair
- **File:** `.skilled/skills/system-spec-kit/runtime/lib/spec/packet-purpose.ts:113-115`
- **Evidence:** the cut uses UTF-16 `.length` and `.slice`.
- **Fix:** slice by code points, or back off one code unit when the boundary falls on a high surrogate.

### R2-P2-001 (P2): The purpose line bypasses the recovered-context sanitizer on the Claude compaction path
- **Dimension:** security
- **File:** `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:228-250`
- **Evidence:** the Pi adapter strips C0 control characters from the purpose section (`session-compact-context.ts:203`); the Claude adapter does not.
- **Fix:** pass the purpose section through the same sanitizer the recovered context uses.

### R2-P2-002 (P2): The operator-facing hop scenarios and root README do not name the new purpose line
- **Dimension:** traceability (`playbook_capability`, `feature_catalog_code`)
- **File:** `.skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md:303`
- **Evidence:** the three linked hop scenarios assert no purpose line. The feature-catalog entries `context-preservation/session-relaunch-loop.md:29` and `context-preservation/compaction-history-lookup.md` describe the hops without the purpose or problem row. The root `README.md` does not mention it either.
- **Fix:** add the purpose and problem rows to those three surfaces.

### R3-P2-001 (P2): The Pi compaction adapter duplicates the purpose interface and reaches past the runtime API
- **Dimension:** traceability (maintainability concern)
- **File:** `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-compact-context.ts:72-79`
- **Evidence:** Pi imports `dist/lib/spec/packet-purpose.js` and redeclares the `PacketPurpose` type; Claude imports the shared module (`session-prime.ts:39`).
- **Fix:** export the type and formatters through the runtime API and import them on both hooks.

### R4-P2-001 (P2): The library index still scopes packet-purpose.ts to the compaction hop
- **Dimension:** maintainability
- **File:** `.skilled/skills/system-spec-kit/runtime/lib/README.md:118`
- **Evidence:** the row added in 0837fcd5a2 says the module serves "the post-compaction context"; 191ce39bad made it the source of `packet_purpose` on every continuity write (`lib/continuity/README.md:28`).
- **Fix:** name both readers in the row.
<!-- /ANCHOR:active-finding-registry -->

<!-- ANCHOR:remediation-workstreams -->
## 4. Remediation Workstreams

1. **P1, hop rule parity (R1-P1-001):** align `nudge.cjs` with handoff.md and the resume assets, and extend its test.
2. **P1, Pi compaction parity (R1-P1-002, with R3-P2-001):** one shared folder-to-packet resolver and one imported purpose type for both compaction hooks.
3. **P2 advisories:** surrogate-safe cut (R1-P2-001), Claude sanitizer parity (R2-P2-001), the lib README row (R4-P2-001), and the playbook, feature catalog and root README updates (R2-P2-002).
<!-- /ANCHOR:remediation-workstreams -->

<!-- ANCHOR:spec-seed -->
## 5. Spec Seed

- Every hop states the same purpose rule: the same accepted heading shapes (`### Purpose`, then a `Purpose:` paragraph inside `## PROBLEM & PURPOSE`, `## PURPOSE` or `## ROOT PURPOSE`, then that section's opening paragraph) and the same repo-relative `Parent purpose (<folder>)` label.
- The Claude and Pi compaction hooks resolve a state folder to its packet the same way.
- Operator-facing docs (playbook hop scenarios, the two hop feature-catalog entries, root README) describe the purpose and problem lines.
<!-- /ANCHOR:spec-seed -->

<!-- ANCHOR:plan-seed -->
## 6. Plan Seed

1. Rewrite `GOAL_GUIDANCE` in `.skilled/hooks/session-relaunch/lib/nudge.cjs` to the handoff.md rule; add `## PURPOSE` and `## ROOT PURPOSE` cases to `nudge.test.cjs`; run the relaunch suite with `env -u AI_SESSION_CHILD`.
2. Extract the nearest-`spec.md` walk-up into a shared resolver used by `session-prime.ts` and `session-compact-context.ts`; add a subfolder fixture to `hook-precompact.vitest.ts`.
3. Export `PacketPurpose` and the formatters through `runtime/api/index.ts` and import them in the Pi hook.
4. Make the 300-character cut code-point safe and sanitize the Claude purpose section.
5. Update `runtime/lib/README.md:118`, the playbook hop scenarios, the two feature-catalog entries and the root `README.md`.
<!-- /ANCHOR:plan-seed -->

<!-- ANCHOR:traceability-status -->
## 7. Traceability Status

### Core Protocols
- **`spec_code`: fail.** The four hops carry a purpose line and the shared reader covers the widened headings (`packet-purpose.ts:42`), but the relaunch hop (R1-P1-001) and the Pi compaction hop (R1-P1-002) diverge from the spec's one-rule goal.
- **`checklist_evidence`: partial.** Changed test assertions were inspected, not executed, because iterations are read-only. `nudge.test.cjs:109` covers only the `### Purpose` shape.

### Overlay Protocols
- **`skill_agent`: notApplicable.** No `SKILL.md` or canonical agent file is in the 34-file target.
- **`agent_cross_runtime`: fail.** Claude walks up to the nearest `spec.md` and Pi does not (R1-P1-002); Claude skips the control-character strip Pi applies (R2-P2-001).
- **`feature_catalog_code`: partial.** Catalog entries exist for both touched hops but omit the purpose and problem rows (R2-P2-002). Iteration 1 recorded a pass from a narrower search; iterations 2 to 5 corrected it.
- **`playbook_capability`: partial.** No manual-testing scenario asserts the purpose line (R2-P2-002).

**AC_COVERAGE:** exempt. The review target type is files, not a spec folder.

**Operator focus outcome:** the five local module docs (`lib/MODULE-MAP.md:136`, `lib/spec/README.md`, `lib/continuity/README.md:28`, `hooks/claude/README.md:20`, `hooks/pi/README.md:47`) were updated with the feature, and README frontmatter and section order were untouched, so no sk-doc create-readme regression was found. No skill or command folder was created, so create-skill and create-command structure is unchanged; the edits sit inside the existing `/speckit:handoff` and `/speckit:resume` command documents. The playbook, the feature catalog and the root `README.md` need updating (R2-P2-002), and one lib README row is stale (R4-P2-001).
<!-- /ANCHOR:traceability-status -->

<!-- ANCHOR:deferred-items -->
## 8. Deferred Items

- **Devin and OpenCode compaction purpose (search ledger SL-006):** deferred by the packet's decision D6 and spec.md item A, so it was not reviewed. It is recorded as search debt.
- **Symlink containment hardening:** both compaction hooks check containment before any `spec.md` read; a symlinked folder that resolves outside the project has no named reach and is a hardening note, not a finding.
<!-- /ANCHOR:deferred-items -->

<!-- ANCHOR:dimension-expansion-map -->
## Dimension Expansion Map

- Saturated directions: none recorded. Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Dimension passes: correctness (iterations 1 and 5), security (2), traceability (3), maintainability (4). Iteration 5 was a replay of the active findings under the max-iterations policy.
- Remaining frontier: the deferred Devin and OpenCode compaction hops.
<!-- /ANCHOR:dimension-expansion-map -->

<!-- ANCHOR:search-ledger -->
## 9. Search Ledger

- **hasSearchDebt: true.** One debt item, SL-006 (`deferred_runtime_compaction`, Devin `post-compaction.cjs` and the OpenCode hooks), deferred by D6. With active P1 findings the verdict is CONDITIONAL either way.
- **searchCoverage:** required bug classes `documentation_drift`, `duplication`, `comment_hygiene`, `api_boundary` and `test_structure`; covered `documentation_drift`; ruled out the other four; graph coverage mode `graphless_fallback`.
- **candidateCoverage:** covered `boundary_handling`, `control_character_injection`, `cross_runtime_parity`, `documentation_coverage`, `documentation_drift`, `prompt_injection` and `spec_mismatch`; ruled out `api_boundary`, `comment_hygiene`, `duplication`, `path_traversal`, `sanitizer_bypass`, `secret_exposure`, `shell_injection`, `state_transition` and `test_structure`.
- **cleanSearchProof (sample):** SL-004 ruled out path traversal: containment runs before any `spec.md` read (`session-prime.ts:236-238`, `session-compact-context.ts:80-83`).
<!-- /ANCHOR:search-ledger -->

<!-- ANCHOR:audit-appendix -->
## 10. Audit Appendix

### Convergence Summary
- Iterations: 5 of 5, stop reason `maxIterationsReached`. newFindingsRatio by iteration: 1.0, 0.1538, 0.0714, 0.0667, 0.0.
- Graph convergence returned `STOP_BLOCKED` (`uncovered_dimensions`) at every check, including after iteration 4, when the registry showed all four dimensions covered. The max-iterations hard stop bypasses that veto by contract; the blocker is recorded here as terminal evidence.
- Claim adjudication passed for every iteration. The first iteration-1 adjudication event recorded `passed: false` because the orchestrator's matcher searched for the `R1-` id prefix the narrative does not use; a corrected `passed: true` event follows it in the ledger.

### Coverage Summary
- Dimensions covered: correctness, security, traceability, maintainability (4 of 4).
- Files: all 34 scope files were in the prompt; each iteration's `filesReviewed` is in the state log.

### Executor Evidence
- Each iteration ran through the `if_cli_deepseek_harness` branch. Dispatch receipts `dispatch-receipts/dispatch-review-i{1..5}-g1.{intent,completion}.json` show exit 0 and no signal for every iteration; wall times were 326, 195, 245, 242 and 83 seconds.
- The pre-dispatch `iteration_start` executor audit rows were appended directly to the state log and are absent after the gateway's projection refresh, and the iteration records carry no `executor` field. Executor identity is preserved in the dispatch receipts only.

### Ruled-out Claims
- Path traversal from the state file or transcript value, recovered-payload sanitizer bypass, shell injection and secret exposure (iteration 2).

### Sources Reviewed
- The 34 scope files; cross-references `handoff.md`, both resume assets, `nudge.test.cjs`, the playbook, the two hop feature-catalog entries, root `README.md`, and the packet `spec.md` with phase children 001 to 011.
<!-- /ANCHOR:audit-appendix -->
