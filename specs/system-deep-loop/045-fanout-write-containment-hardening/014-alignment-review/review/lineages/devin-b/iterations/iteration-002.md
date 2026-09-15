# Iteration 2: Lane B - Feature catalog and playbook alignment

## Dispatcher
- Lineage: devin-b (fan-out lane 2 of 3), executor cli-devin model=deepseek-v4-flash-max
- Session: fanout-devin-b-1789432854146-6hhsgk, generation 1, lineageMode new
- BINDING: target=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review
- BINDING: maxIterations=5
- BINDING: convergence=0.1 (mode off, telemetry only)
- BINDING: mode=review
- BINDING: dimensions=traceability,maintainability
- BINDING: specFolder=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review

## Focus
Lane B of spec.md scope: every `feature-catalog/` and `manual-testing-playbook/` tree under `.opencode/skills/system-deep-loop/` (hub, `runtime/`, `deep-research/`, `deep-review/`) against the runtime as shipped, with the worktree mechanism removed and the per-pass quarantine layout in place (parent spec REQ-006 migration check). Overlay protocols: `feature_catalog_code`, `playbook_capability`.

## Scorecard
- Dimensions covered: traceability, maintainability
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.70 (weighted 7/10 accumulated)

## Findings

### P0, Blocker
None.

### P1, Required

- **F006**: deep-review loop protocol is missing the two containment rules that REQ-006 mandated for both loop protocols. The hub SKILL.md (`.opencode/skills/system-deep-loop/SKILL.md:128`) states "Both rules live in `deep-research/references/protocol/loop-protocol.md` under 'Executor Resolution'" and `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:287-290` carries the full two-rule paragraph (lineage-is-executor; write containment attributes/quarantines with preserve-by-default, `completed_with_containment_advisory`, opt-in baseline restore, per-pass quarantine layout `containment/quarantine/<iteration>[-attempt-<n>]/`). Grepping `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` for `Two containment rules|completed_with_containment_advisory|quarantine|preserve` returns only false-positive matches ("preserved" in adjudication prose, executor-branch containment-posture note at line 280). The review mode's CLI-lineage containment rules were never migrated: a review lane runs under the same containment model (this lane does) but its own protocol does not document the rules binding it, and the hub pointer routes review-mode readers to the research-mode doc only. Parent spec REQ-006 listed "both loop protocols" as in-scope migration targets. Finding class: missing-mandated-migration, scope proof: absence verified by grep across the whole deep-review skill tree (only executor-note, prompt-pack gateway note, and catalog executor-selection entry mention containment), affected surface hints: deep-review loop-protocol.md Executor Resolution section, hub SKILL.md:128, deep-research loop-protocol.md:287-290.
  - Dimension: traceability. Evidence: `[SOURCE: .opencode/skills/system-deep-loop/SKILL.md:128]`, `[SOURCE: .opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:287-290]`, `[SOURCE: .opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:275-308]`, `[SOURCE: specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:98]` (REQ-006).

#### Claim-Adjudication Packet (F006)

```json
{
  "findingId": "F006",
  "claim": "Deep-review's loop-protocol.md lacks the two containment rules paragraph that parent REQ-006 required for both loop protocols, and the hub SKILL.md pointer names only the deep-research protocol.",
  "evidenceRefs": [
    ".opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md:287-290",
    ".opencode/skills/system-deep-loop/SKILL.md:128",
    ".opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md:275-308",
    "specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:98"
  ],
  "counterevidenceSought": "Grepped the entire deep-review skill tree for 'containment|quarantine|completed_with_containment_advisory' (4 hits: executor note, prompt-pack gateway note, playbook scope-containment prose, catalog executor-selection entry; none is the two-rules paragraph). Grepped deep-review loop-protocol.md specifically for 'Two containment rules|completed_with_containment_advisory|preserve|quarantine' (no real match). Checked the deep-review quick-reference.md and SKILL.md for a containment section (absent).",
  "alternativeExplanation": "The review mode might intentionally defer to the research-mode protocol via the hub pointer — but REQ-006 names 'both loop protocols' as migration targets, and the deep-research protocol's own sentence 'Two containment rules bind every CLI lineage (any cli-* executor kind)' is mode-agnostic, so deferral contradicts the shipped requirement.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If the two-rules paragraph lands in deep-review's loop-protocol.md (or the hub pointer is amended to name both protocols) and a grep of the deep-review skill tree finds the paragraph, downgrade to P2 doc-note.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

- **F004**: Runtime feature catalog fanout-run entry lists a stale executor-kind set. `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:42` says "Supports all 3 CLI kinds: `cli-opencode`, `cli-claude-code`, `cli-opencode`" — cli-opencode is duplicated and cli-codex, cli-cursor, cli-devin, cli-pi (and cli-hermes) are omitted, while the entry's own description (fanout-run.md:3) names six kinds (claude-code, opencode, cursor, codex, devin, pi) and the runtime authority `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11` declares 8 kinds (`native` + 7 CLI). Internal contradiction plus contradiction with the shipped authority. Finding class: stale-catalog-claim, scope proof: executor-config.ts EXECUTOR_KINDS read at line 11, affected surface hints: runtime feature-catalog fanout group, executor-config.ts.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:42-46]`, `[SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:11]`.
- **F005**: Runtime feature catalog lacks a write-containment feature entry. `.opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19` claims to be "the canonical inventory for the live `runtime/` feature surface", and its fanout group (8 entries, line 31) plus 55 total entries include no write-containment feature, while the hub-level catalog `.opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:57` does list `fanout-write-containment/fanout-write-containment.md` (preserve-by-default, quarantine writer, churn detector). The runtime catalog's fanout-run.md entry also omits the containment wiring (mode flags, quarantine dir, churn sampler) that the parent packet's REQ-006 migration covered. The WC-001 hub playbook scenario exists and is correctly referenced (hub catalog:50, manual-testing-playbook.md:176, write-containment/shared-checkout-run.md) — the gap is the runtime-level inventory entry. Finding class: catalog-coverage-gap, scope proof: runtime catalog index read at feature-catalog.md:21-36, affected surface hints: runtime feature-catalog, hub feature-catalog.
  - Dimension: traceability. Evidence: `[SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:19]`, `[SOURCE: .opencode/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:31]`, `[SOURCE: .opencode/skills/system-deep-loop/feature-catalog/feature-catalog.md:57]`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | fail | advisory | runtime catalog index + fanout-run.md vs executor-config.ts:11, hub catalog:57 | F004 (stale kind claim) and F005 (missing containment entry) |
| playbook_capability | pass | advisory | manual-testing-playbook.md:172-176, write-containment/shared-checkout-run.md | WC-001 scenario exists, correctly referenced, describes preserve behavior |
| spec_code | partial | hard | parent spec.md:98 (REQ-006) vs deep-review loop-protocol.md | F006: review loop protocol not migrated; research protocol migrated |

## Integration Evidence
- The hub catalog's fanout-write-containment entry (feature-catalog/fanout-write-containment/fanout-write-containment.md:43-44) names the correct implementation files (`write-containment.ts`, `fanout-run.cjs`).
- The hub manual-testing-playbook index (manual-testing-playbook.md:172-176) lists WC-001 with the correct path and expected signal ("neighbour's out-of-scope edits survive a fan-out byte-identical").
- The runtime library README (`runtime/lib/deep-loop/README.md:55`) carries the updated one-line role description ("Preserve is the default remedy... restoring is opt-in and targets the pre-dispatch baseline, never HEAD") — REQ-006 satisfied there.

## Edge Cases
- F006 could be argued as "review defers to research doc" via the hub pointer; the packet's own REQ-006 wording ("both loop protocols") and the mode-agnostic wording of the research rules make that reading a contradiction, recorded in the adjudication packet.
- F004's exact kind list at fanout-run.md:42 is so stale it may predate the codex/cursor/devin/pi adapter work; the entry description at line 3 is newer. Confirms drift rather than a rename.

## Confirmed-Clean Surfaces
- Hub-level feature-catalog write-containment entry: consistent with shipped code and tests (write-containment.vitest.ts, fanout-run.vitest.ts named).
- Hub playbook WC-001 scenario file exists at the referenced path and describes preserve-by-default.
- Deep-research loop-protocol.md:287-290 carries the full two-rules paragraph (migrated).
- Hub SKILL.md:128 correctly describes the preserve behavior in its NEVER rule ("it no longer reverts them, and a lane that produced its artifacts still completes") — the prose is right; the pointer and the review protocol are not.

## Ruled Out
- Worktree claims in catalogs: no catalog under system-deep-loop still describes per-lineage worktrees (ADR-007 removal reflected). Grep of feature-catalog trees for "worktree" returned no stale entries in the fanout group.
- The runtime catalog's missing containment entry is not compensated by the script-entry-points group (no write-containment script there either).

## Dead Ends
- Counting the runtime catalog's 55 entries exactly: index says 55; summed category counts give 54 + shared backend contracts paragraph; the discrepancy is not material to any finding (the missing containment entry would be the 56th, reinforcing F005 rather than explaining the count).

## Recommended Next Focus
- Dimension: Lane C (SKILL.md against references and assets) + overlay `skill_agent`. Files: `.opencode/skills/system-deep-loop/SKILL.md` claims vs its references/assets; `cli-external-orchestration` hub and cli-* mode SKILL.md vs their references; `sk-code` hub SKILL.md vs its references (partially covered in iter 1).
- Reason: F006 showed a hub pointer that names only one of two protocols; lane C checks the same class of drift across the other skill hubs.

Review verdict: CONDITIONAL
