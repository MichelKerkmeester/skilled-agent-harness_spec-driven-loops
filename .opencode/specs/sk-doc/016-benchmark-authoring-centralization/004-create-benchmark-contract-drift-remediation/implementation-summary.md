---
title: "Implementation Summary: create-benchmark contract-drift remediation"
description: "Fixed every confirmed finding from the three-model GPT-5.6 SOL create-benchmark review — two operator-approved runtime changes (D5 hard-fail exit, alignment budget cap) plus create-benchmark and deep-alignment doc reconciliation — via four disjoint-surface parallel agents; all gates green."
trigger_phrases:
  - "create-benchmark contract drift summary"
  - "d5 hard fail alignment cap summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization/004-create-benchmark-contract-drift-remediation"
    last_updated_at: "2026-07-14T18:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed all review findings + two runtime gaps; gates green"
    next_safe_action: "Commit and integrate to skilled/v4.0.0.0"
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
| **Spec Folder** | 004-create-benchmark-contract-drift-remediation |
| **Completed** | 2026-07-14 |
| **Level** | 2 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A three-model GPT-5.6 SOL review found `sk-doc/create-benchmark` structurally complete but its authoring templates describing a contract that drifts from the real deep-improvement (Lane B) and deep-alignment runtime. Every confirmed finding was fixed, including two genuine runtime gaps the review surfaced (not doc drift), both operator-approved: the skill-benchmark D5 structural gate did not hard-fail, and deep-alignment had no defined budget cap. Fixes landed on four disjoint surfaces so parallel agents never touched the same file.

### Runtime changes (operator-approved)

- **D5 structural gate hard-fails.** `run-skill-benchmark.cjs` `run()` now returns exit code `3` when the aggregated verdict is `BLOCKED-BY-STRUCTURE` or `BLOCKED-BY-REGISTRY` (the two D5-connectivity-owned verdicts); it stays `0` otherwise and reports are still written unconditionally. `NO-SCENARIOS`, `BLOCKED-BY-ROUTING`, and `BLOCKED-BY-TOOL-SURFACE` are deliberately left ungated (not the D5 structural gate). A durable-WHY comment records why the process signal must disagree with `0` on a structural block.
- **Alignment budget cap defined.** `framework.md` BUDGET POLICY now caps `alignment` scenarios at `1500000` ms alongside `ai-council` and `improvement`, grounded in the Claude baseline's own "`900000` is too low for its autonomous cells" finding. No code cap-map exists (verified by grep) — the caps are the normative contract a scenario author hand-applies to `budget_ms` — so framework.md is the entire runtime change.

### Doc reconciliation

- **create-benchmark (10 files)**: reviewer-prompt fixtures carved out of the standard-profile workflow (routed to the lane-owned reviewer path, resolving the SKILL-vs-template contradiction); code-task oracle scoring corrected to the sweep/`scoreCodeTask` path (never `run-benchmark` `5dim`/`pattern`); Lane B per-path output/artifact contract documented (command/run vs sweep vs reviewer); advertised-but-ineffective profile controls marked single-pass-only / sweep-only / unsupported; D5 wording aligned to the now-true hard-fail; the phantom `d4-ablation.json` / `d5-connectivity-detail.json` rows removed; the underscore-directory generalization corrected to parent-underscore / child-hyphen; Smart Router gained Lane A vocabulary + the on-disk `shared` key; README gained the five-key family table; stale `§12` pointers repointed to `§13`; and the behavior-benchmark templates fixed (raw-JSON `command` placeholder, mandatory `fixture`, `fail_fast` enum, `watchdog_ms` moved before the mandatory `notes`, output-relative index links, baseline provenance fields, corrected cap citations).
- **deep-alignment (6 files)**: the package's own stale `SKILL.md §2` pointers repointed to `§3` (heading-anchor links) across the index and DAB-005/006/007; the phantom `NEVER #5b` in DAB-008 removed (leaving the correct `ALWAYS #5`); the stale "framework extensions" subsection deleted (both `alignment` mode and `DAB` prefix are now first-class in framework.md); `version` fields + Availability blocks removed per the lifecycle rule; and the baseline's budget-cap commentary updated to the raised `1500000` cap with every measured number left untouched.

### Files Changed

| Area | Action | Purpose |
|------|--------|---------|
| `deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Modify | D5 gate returns exit `3` on structural/registry block |
| `deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Modify | 2 new D5 exit-code tests + hermetic fixtures |
| `shared/behavior-benchmark/framework.md` | Modify | Define the `alignment` budget cap |
| `sk-doc/create-benchmark/**` (SKILL.md, README.md, 8 templates/guides/changelog) | Modify | Reconcile all doc-drift findings |
| `deep-alignment/behavior_benchmark/**` (index, 4 scenarios, baseline) | Modify | Reconcile stale pointers + lifecycle |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Four fresh Sonnet-5 leaf agents ran in parallel, each owning one file-disjoint surface (skill-benchmark runtime, framework cap, create-benchmark docs, deep-alignment package). The two fixed contract values (D5 → exit `3`; alignment cap → `1500000`) were broadcast to all four so code and docs agree. Each finding was re-verified against the real files after the agents returned: the packager check stays PASS, the skill-benchmark vitest gains its two new D5 tests with no regression, the deep-alignment real-file links resolve, and the scenario-template JSON fix was confirmed. The runtime changes were established first so the doc agents described post-change truth.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate the D5 exit on `BLOCKED-BY-STRUCTURE` / `BLOCKED-BY-REGISTRY` only, exit code `3` | These are the two D5-connectivity-owned verdicts; a distinct new code avoids colliding with the existing `2` (missing SKILL.md), and `loop-host` already treats any non-zero as a hard stop with an `on_fail` path designed for exactly this signal |
| Set the alignment cap to `1500000` ms | Matches `ai-council`/`improvement` (same autonomous multi-cell shape) and is grounded in the Claude baseline's measured "`900000` too low" note |
| Framework.md alone for the cap (no code) | Grep proved no per-mode cap-map exists; caps are the normative contract authors follow, enforced against the hand-authored `budget_ms` |
| Leave the `BLOCKED-BY-REGISTRY` wiring gap untouched | Pre-existing and out of the approved two-runtime-change scope (see Known Limitations) |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check create-benchmark` | PASS; SKILL.md 4998 words (< 5000 hard cap; 1 soft >3000 warning) |
| skill-benchmark vitest | 8 failed / 47 passed — all 8 failures pre-existing (`cli-opencode`/`cli-claude-code` relocation, independent of this change); +2 new D5 tests pass; zero regressions |
| D5 exit code | `run()` returns `3` on `BLOCKED-BY-STRUCTURE` (test-proven); reports still written; consumer (`loop-host` + deep command `on_fail`) safe and intended |
| `alignment` cap in framework.md | Present (`1500000`); deep-alignment baseline citation agrees |
| Comment hygiene on runtime edit | Durable WHY only; no spec paths / ids |
| deep-alignment real-file links | `../SKILL.md`, `../../SKILL.md`, `../../../shared/behavior-benchmark/framework.md` all resolve |
| scenario-template JSON validity | Raw `command`, mandatory `fixture`, `fail_fast` enum, `watchdog_ms` before `notes` — parseable for both cells |
| Scope / frozen artifacts | 19 files, all in-scope; `deep-improvement/benchmark/` run history byte-identical |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`BLOCKED-BY-REGISTRY` currently unreachable via `run()`.** `scanHubRegistry()` (the only producer of that verdict) is not wired into `run()`'s `aggregate()` path, so today only `BLOCKED-BY-STRUCTURE` is reachable in practice. The exit-code check is correct for the full D5-owned verdict set; the wiring gap is pre-existing and out of the approved scope. Recorded here as a real, separate finding rather than fixed.
2. **8 pre-existing skill-benchmark test failures.** A separate, concurrent workstream is relocating `cli-opencode` / `cli-claude-code` under `cli-external-orchestration/`; 8 tests in `skill-benchmark.vitest.ts` reference the old paths and fail on that migration, unrelated to this packet. They were red before this change and remain red at the same count.
3. **SKILL.md word count.** create-benchmark's SKILL.md is 4998 words — under the 5000 hard gate but over the 3000 soft recommendation; it remains a documented word-cap exception.

<!-- /ANCHOR:limitations -->
