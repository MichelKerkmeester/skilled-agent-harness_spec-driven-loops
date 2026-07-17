---
title: "Implementation Summary: create-benchmark audit remediation"
description: "Fixed every P0/P1/P2 finding from the two-model create-benchmark audit across four disjoint surfaces via parallel Sonnet agents, plus two agent-surfaced pre-existing bugs; all gates green."
trigger_phrases:
  - "create-benchmark remediation summary"
  - "benchmark audit fix summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-benchmark-authoring-centralization/003-create-benchmark-audit-remediation"
    last_updated_at: "2026-07-17T14:38:02Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed all audit findings; gates green"
    next_safe_action: "Commit and push the remediation branch"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-create-benchmark-audit-remediation |
| **Completed** | 2026-07-14 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every finding from the two-model (GPT-5.6 SOL + LUNA) create-benchmark audit was fixed. The audit confirmed create-benchmark's benchmark-family coverage is intentionally complete; the defects were stale pointers and drift around it. Fixes landed on four disjoint surfaces so parallel agents never touched the same file, and two pre-existing bugs the agents surfaced were also fixed.

### Fixes by surface

- **create-benchmark docs**: the three `_shared` references became `shared` (grep now returns 0); README was corrected from "two families" to the real five-family taxonomy with Lane A guide ownership; the Smart Router got concrete routing data; `INTEGRATION POINTS` and `REFERENCES AND RELATED RESOURCES` sections were added; stale internal section-number prose was corrected; the version-field guidance was reconciled with a justifying comment.
- **sk-doc hub metadata**: `hub-router.json` and `mode-registry.json` gained `agent-improvement` routing keywords, carrying the recorded keyword set.
- **deep-improvement (Lane B)**: the two directories were renamed to hyphens so the ~70 committed hyphen references resolve; the default-profile resolver path now exists on disk; the Lane B output contract was reconciled to the runtime's real two-convention behavior.
- **deep-alignment**: the behavior-benchmark index and five scenario files were reconciled to the captured baseline (provisional `300000` budgets replaced with measured values).

### Cross-agent and pre-existing fixes (orchestrator)

- Hyphenated the renamed-dir references in three create-benchmark asset templates the doc agent was not told to touch (one was a now-broken link).
- Corrected the one-sided `{spec_folder}` output-contract line in the fixture guide.
- Fixed a pre-existing stale path in `sweep-benchmark.cjs` (framework registry moved under the `prompt-improve` sub-hub) that was failing a Lane B suite unrelated to the rename.

### Files Changed

| Area | Action | Purpose |
|------|--------|---------|
| `create-benchmark/**` (SKILL.md, README.md, 5 templates/guides) | Modify | `_shared`, README, sections, Smart Router, prose, version, dir-ref hyphenation |
| `sk-doc/{hub-router,mode-registry}.json` | Modify | Lane A routing keywords |
| `deep-improvement/assets/model_benchmark/benchmark-{profiles,fixtures}/` | Rename | Underscore → hyphen |
| `deep-improvement/**`, `commands/deep/**` | Modify | Align refs to hyphen; reconcile output contract; fix registry path |
| `deep-alignment/behavior_benchmark/**` | Modify | Reconcile index to captured baseline |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four fresh Sonnet-5 leaf agents ran in parallel, each owning one directory surface so their writes could not collide, with the P0 direction and spec folder resolved by the operator beforehand. Each finding was re-verified against the real files after the agents returned: the packager check stays PASS with `_shared` at 0, the markdown-link resolver reports zero broken links across all three touched skill areas (create-benchmark 204, deep-improvement 249, deep-alignment 221), and both Lane B vitest suites pass 14/14 after the rename plus the registry-path fix. The two directory moves used `git mv`, and the frozen historical run-report artifacts were left byte-identical.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve the P0 by renaming dirs to hyphens (not repointing code) | Operator chose it to match the coming naming convention; the code already used hyphens, so the rename makes 70 refs resolve at once |
| Fix the pre-existing `sweep-benchmark.cjs` registry path | It failed a Lane B suite and blocked clean verification of the P0 rename; a one-line, in-scope path fix |
| Keep "no version" on generated data-doc guidance | Behavior index/baseline and skill-benchmark README are memory-indexed data artifacts outside the versioned reference/asset scope; a WHY comment records this |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check create-benchmark` | PASS (1 soft word-count warning; INTEGRATION POINTS + RELATED RESOURCES cleared) |
| `_shared` residue in create-benchmark | 0 |
| Markdown links (create-benchmark / deep-improvement / deep-alignment) | 204 / 249 / 221 OK, 0 broken |
| Lane B vitest (optin-scorer + sweep-acceptance) | 14/14 pass |
| Hub routing JSON validity + Lane A keywords | valid; keyword present |
| deep-alignment index vs baseline | 0 stale `300000`; measured budgets propagated |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **SKILL.md word count.** create-benchmark's SKILL.md is 4989 words — under the 5000 hard gate but over the 3000 soft recommendation. It stays a documented word-cap exception; adding the two required sections consumed most of the margin.
2. **017-census touch-up.** Renaming the two Lane B dirs pre-empts packet 017's frozen phase-000 census for those two entries; 017 should record them as already-hyphen when it runs.
3. **D5 stays null in deep-alignment.** Correct by design — D5 scores a non-baseline executor leg against the baseline, and no such leg has been captured yet.

<!-- /ANCHOR:limitations -->
