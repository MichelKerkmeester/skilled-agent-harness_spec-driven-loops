---
title: "Deep Review Iteration 004 — Maintainability (Documentation-Matches-Code Pass)"
trigger_phrases: []
---
# Deep Review Iteration 004 — Maintainability (Documentation-Matches-Code Pass)

## Dimension

**Maintainability** — documentation-matches-code pass over the seven `skilled/v4.0.0.0` commits. Focus areas (per iteration-4 focus guidance): (1) the explicit-model hard rule added by 6303c12ad27 — does it exist where the doc claims, is it consistent with the dispatch code paths, would a reader follow it; (2) root README counts/families (69d5c223668) vs what exists on disk; (3) hub doc drift fixes from 766b59d6bc3 — remaining alignment-family mentions or stale cross-links in system-deep-loop and sk-doc hubs; (4) legacy/ body mirrors coherence with live command files after the Phase-0 gate edits in e41aa1878ad; (5) compiled contract mirrors vs command sources — drift after the gate retirement; (6) comment hygiene — ephemeral artifact labels embedded in code comments by these commits.

## Files Reviewed

- `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:7-16` (hard_rules block — `explicit-model-required` added by 6303c12ad27) and `:185-189` (troubleshooting note)
- `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` (check-id enforcement scan — `stdin-redirect`/`no-bare-agent`/`explicit-model` all absent)
- `README.md:641,684,907,1174,1277` (counts/families edited by 69d5c223668) vs disk inventory of `.opencode/commands/**/*.md` and `.opencode/skills/*/`
- `.opencode/skills/system-deep-loop/{README,ROUTER,SKILL}.md`, `runtime/README.md:15`, `shared/progress/README.md:12`, `deep-research/README.md`, `deep-review/{README,SKILL}.md`, `deep-ai-council/{SKILL,scripts/README.md}`, `deep-improvement/README.md` (alignment-mention sweep)
- `.opencode/skills/sk-doc/{README,ROUTER,SKILL}.md`, `sk-create-benchmark/SKILL.md:32`, `sk-create-readme/README.md`, `scripts/README.md` (alignment-mention sweep)
- `.opencode/commands/deep/assets/legacy/{README,deep-ai-council.body,deep-research.body,deep-review.body}.md` (legacy mirror contract + Phase-0/alignment residue scan)
- `.opencode/commands/deep/assets/compiled/{deep-ai-council,deep-research,deep-review}.contract.md` (compiled contract gate-text scan)
- `.opencode/commands/deep/{ai-council,research,review}.md` (live command gate-text scan)
- Seven-commit diff scan for ephemeral artifact labels (spec paths, REQ-/CHK-/ADR-/P0-P2-/task-/finding- ids) in code comments across `*.cjs *.ts *.js *.py *.json *.yaml`
- Prior iterations 001–003 narratives and strategy.md

## Findings by Severity

### P0 (Critical)
None.

### P1 (Major)
None.

### P2 (Minor)

#### P2-006 Stale "alignment mode" reference in system-deep-loop runtime README
- **File:** `.opencode/skills/system-deep-loop/runtime/README.md:15`
- **Claim:** The runtime README still lists the removed `alignment` mode as a live runtime consumer, so the documentation no longer matches the code after the 8849444aa61 removal. The hub-level `system-deep-loop/{README,ROUTER,SKILL}.md` were corrected in 766b59d6bc3, but this deeper runtime README was not swept.
- **Evidence refs:**
  - `.opencode/skills/system-deep-loop/runtime/README.md:15` — "The runtime is the shared execution surface for research, review, council and alignment modes."
  - `mode-registry.json` (iter-003) — 6 surviving modes, no alignment; `deprecatedModes: []`.
  - Commit 766b59d6bc3 stat — touched `system-deep-loop/{README,ROUTER,SKILL}.md` but not `runtime/README.md`.
- **Counterevidence sought:** (1) Is "alignment" here generic English (e.g. "focus alignment")? — No: the enumerated list "research, review, council and alignment modes" names the mode family, parallel to the corrected hub rosters. (2) Was `runtime/README.md` intentionally left as a historical note? — No marker says so; it reads as a live capability description.
- **Alternative explanation:** The README is a deliberately frozen historical snapshot. Unlikely — no "historical"/"archived" marker, and sibling hub docs were updated to drop alignment.
- **Final severity:** P2 — documentation-code drift; prose only, no runtime/code impact, but a reader infers alignment is a live mode.
- **Confidence:** 0.88
- **Downgrade trigger:** Would mark informational if the line is updated to "research, review, council and improvement modes" (matching the corrected hub rosters).
- **Finding class:** doc_freshness
- **Scope proof:** `runtime/README.md:15` enumerates "alignment modes" alongside the surviving modes; `mode-registry.json` (iter-003) has no alignment mode; commit 766b59d6bc3 did not touch this file.
- **Affected surface hints:** ["system-deep-loop", "runtime-README", "mode-roster"]
- **Risk score:** 2 (advisory only)
- **Recommendation:** Update `runtime/README.md:15` to drop "alignment" from the live-mode list (one-line edit), matching the corrected hub rosters.

#### P2-007 Stale "alignment mode" reference in shared progress README
- **File:** `.opencode/skills/system-deep-loop/shared/progress/README.md:12`
- **Claim:** The shared progress README still references "the alignment mode" as a live state reducer that bypasses the shared progress helper, after the mode was removed.
- **Evidence refs:**
  - `.opencode/skills/system-deep-loop/shared/progress/README.md:12` — "The deep-improvement lanes and the alignment mode reduce state without this helper."
  - `mode-registry.json` (iter-003) — no alignment mode; the surviving reducers are research/review/ai-council (use the helper) + improvement lanes (do not).
- **Counterevidence sought:** (1) Generic English? — No: "the alignment mode" is a definite reference to the mode, paired with "deep-improvement lanes" as the non-helper consumers. (2) Intentional historical note? — No marker.
- **Alternative explanation:** None plausible; the sentence describes current reducer behavior and names a mode that no longer exists.
- **Final severity:** P2 — documentation-code drift; describes a reducer path for a removed mode. No runtime impact (the helper code is unaffected), but a maintainer reading this would expect an alignment reducer to exist.
- **Confidence:** 0.86
- **Downgrade trigger:** Would mark informational if "and the alignment mode" is removed from the sentence.
- **Finding class:** doc_freshness
- **Scope proof:** `shared/progress/README.md:12` names "the alignment mode" as a current non-helper consumer; `mode-registry.json` has no such mode.
- **Affected surface hints:** ["system-deep-loop", "shared-progress", "reducer-roster"]
- **Risk score:** 2 (advisory only)
- **Recommendation:** Drop "and the alignment mode" from `shared/progress/README.md:12` so the non-helper-consumer list reflects only the deep-improvement lanes.

#### P2-008 Stale `alignment` (DAB) behavior-benchmark prefix in sk-create-benchmark guide
- **File:** `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:32`
- **Claim:** The behavior-benchmark authoring guide still lists `alignment` (DAB) as a fixed scenario prefix alongside the four surviving mode prefixes. The alignment mode and its DAB-001..DAB-024 scenarios were deleted in 8849444aa61, so a benchmark author following this guide would author scenarios for a mode that no longer exists.
- **Evidence refs:**
  - `.opencode/skills/sk-doc/sk-create-benchmark/SKILL.md:32` — "Fixed prefixes are `research` (RSB), `review` (RVB), `ai-council` (ACB), `improvement` (IMB), and `alignment` (DAB); declare a new mode's prefix in the index OVERVIEW."
  - Deleted-paths list (config) — `deep-alignment/behavior-benchmark/scenarios/DAB-001..DAB-024` all deleted in 8849444aa61.
  - `mode-registry.json` (iter-003) — 6 surviving modes; no alignment.
- **Counterevidence sought:** (1) Is the DAB prefix retained for historical scenario authoring? — No: the sentence presents DAB as a current "fixed prefix" for new authoring, not a historical note. (2) Was this file touched by the removal commits? — `sk-create-benchmark/SKILL.md` is in the review scope (config line 106) but the alignment-prefix line was not edited by any of the seven commits (the conformance-benchmark asset/reference deletion in 8849444aa61 removed the conformance family, not the behavior-benchmark prefix roster).
- **Alternative explanation:** The prefix list is intentionally exhaustive including retired prefixes. Unlikely — the instruction "declare a new mode's prefix" frames the list as the active prefix set.
- **Final severity:** P2 — documentation-code drift that actively misleads a manual authoring workflow. Kept at P2 (not P1) because it is authoring guidance, not a runtime/code correctness bug; no automated gate consumes this prefix list. A reader following it produces orphan-prefixed scenarios, caught only by a human reviewer.
- **Confidence:** 0.84
- **Downgrade trigger:** Would mark informational if the `alignment` (DAB) entry is removed from the fixed-prefix list.
- **Finding class:** doc_freshness
- **Scope proof:** `sk-create-benchmark/SKILL.md:32` lists `alignment` (DAB) as a fixed prefix; the DAB scenario corpus was deleted in 8849444aa61; `mode-registry.json` has no alignment mode.
- **Affected surface hints:** ["sk-create-benchmark", "behavior-benchmark", "prefix-roster"]
- **Risk score:** 3 (advisory only; misleads an active authoring workflow)
- **Recommendation:** Remove `alignment` (DAB) from the fixed-prefix list in `sk-create-benchmark/SKILL.md:32`, leaving the four surviving prefixes (RSB/RVB/ACB/IMB).

## Maintainability Checks (Documentation-Matches-Code)

| Focus item | Commit | Status | Evidence |
|---|---|---|---|
| explicit-model hard rule exists where claimed | 6303c12ad27 | pass | `cli-opencode/SKILL.md:11-14` adds `explicit-model-required` to `hard_rules`; `:185-189` adds the troubleshooting note. Rule is present where the commit message claims. |
| hard rule consistent with dispatch code paths | 6303c12ad27 | pass (consistent) | `dispatch-guard.cjs` enforces NONE of the three `hard_rules` check ids (`stdin-redirect-required`, `explicit-model-required`, `no-bare-agent-general`) — they are agent-facing advisories (`severity: warn`), not machine-enforced checks. The new rule is consistent with its siblings; no enforcement asymmetry was introduced. |
| reader can follow the rule | 6303c12ad27 | pass | The rule names the exact flag (`-m <provider/model>`), the symptom (no output / looks hung), the diagnostic (`--print-logs --log-level DEBUG` → `stream error … Error 429`), and the fix. A reader can reproduce the diagnostic and apply the fix. |
| README families/counts vs disk | 69d5c223668 | pass | "Four loop families" + "six `/deep:*` commands" — verified: 6 deep command .md files on disk (`agent-improvement, ai-council, model-benchmark, research, review, skill-benchmark`), 4 families (research/review/council/improvement). "32 command entry points across 8 groups plus 3 root utilities" = 35 — verified: 38 raw `.md` under `.opencode/commands` (excl `assets/`) minus 3 non-command `README.md` docs (`doctor/scripts/README.md`, `scripts/README.md`, `scripts/fixtures/README.md`) = 35; 8 command groups (create/deep/design/doctor/memory/prompt/rewrite/speckit) + 3 root utilities (`agent-router`, `goal-opencode`, `vision`). "13 skills" — verified: 13 skill dirs under `.opencode/skills/`. |
| hub doc drift (system-deep-loop + sk-doc hubs) | 766b59d6bc3 | partial | Hub-level `system-deep-loop/{README,ROUTER,SKILL}.md` and `sk-doc/{README,ROUTER,SKILL}.md` are clean of alignment-family references (remaining "alignment" hits are generic English: "focus alignment", "spec alignment", "box alignment", "template alignment"). Three DEEPER files retain stale alignment-mode references → P2-006, P2-007, P2-008. |
| legacy/ body mirrors cohere with live commands | e41aa1878ad | pass | `legacy/{deep-ai-council,deep-research,deep-review}.body.md` contain zero Phase-0/dispatch-context/documentation-gate text and zero alignment/command-benchmark/conformance references. `legacy/README.md` documents the body-to-contract contract (3 bodies, 3 compiled contracts, no fifth). Structural divergence from live `.md` files (no frontmatter, thin-router body) is by design per `legacy/README.md` §1/§6. |
| compiled contract mirrors vs command sources | e41aa1878ad | pass | `compiled/{deep-ai-council,deep-research,deep-review}.contract.md` contain no retired Phase-0 dispatch-context gate text. The retained "Gate-3 documentation gate" text (`contract.md:103/108/163`) is CORRECT — that is the CLAUDE.md documentation gate, which was NOT retired by e41aa1878ad (only the Phase-0 dispatch-context gate was). Live command files retain the same Gate-3 text (`review.md:36`, `research.md:63`, `ai-council.md:47`), so contracts and sources cohere. |
| comment hygiene (ephemeral artifact labels in code comments) | all 7 | pass | Seven-commit diff scan for spec paths / REQ-/CHK-/ADR-/P0-P2-/task-/finding- ids embedded in `// # /* *` comments across `*.cjs *.ts *.js *.py *.json *.yaml` returned zero hits. No ephemeral artifact labels were introduced. |

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | pass (carried) | 025 spec REQ-001/REQ-002 confirmed iter-003; this iteration's doc-parity pass found no spec-vs-code contradiction in the seven commits' own claims (README counts, hard-rule placement, contract coherence all verified). |
| `checklist_evidence` | core | pass (carried) | No new checklist evidence re-run this iteration (observation-only). P2-004 from iter-003 remains the only checklist-freshness advisory. |
| `skill_agent` | overlay | partial | Hub SKILL/README clean (iter-003), but `runtime/README.md:15` and `shared/progress/README.md:12` retain stale alignment-mode references → P2-006, P2-007. The skill's own mode roster is correct; two sub-docs drifted. |
| `agent_cross_runtime` | overlay | pass (carried) | No new orphaned mirrors found; legacy/ and compiled/ mirrors cohere (this iteration). |
| `feature_catalog_code` | overlay | pass (carried) | No new feature-catalog references (this iteration did not re-scan; iter-003 cleared). |
| `playbook_capability` | overlay | partial | `sk-create-benchmark/SKILL.md:32` retains the `alignment` (DAB) prefix in the behavior-benchmark authoring playbook → P2-008. The conformance-benchmark family was correctly removed; the behavior-benchmark prefix roster was not swept. |

## SCOPE VIOLATIONS
None. All writes confined to the three allowed state-file paths (`iterations/iteration-004.md`, `deltas/iter-004.jsonl`, `deep-review-strategy.md`) plus the append-state-record gateway write into the run directory. No reviewed source/spec/config file was modified.

## Next Dimension

All four configured dimensions (correctness, security, traceability, maintainability) are now covered. Per `stop_policy=max-iterations` (convergence is telemetry only), the loop does not synthesize early; remaining iterations (5–10) should broaden the angle — candidate frontiers: (a) re-run the repo's own drift checkers (`check-documentation-drift.cjs`, `check-contract-drift`, `validate-command-references.cjs`) to mechanically confirm the doc-parity findings P2-006/007/008 and rule out further drift; (b) generated-metadata regeneration provenance — verify `hub-router.json`/`leaf-manifest.json`/`mode-registry.json`/`command-metadata.json`/`graph-metadata.json` are consistent with their declared sources after the 291-file removal; (c) the 035 fixture-corpus question (P2-005) — confirm whether the deterministic-fixtures-oracle corpus is a frozen snapshot or a live baseline needing refresh.

## Verdict

No P0 or P1 findings this iteration. Three P2 maintainability advisories, all the same class — stale `alignment`-mode references in documentation that the 766b59d6bc3 hub-fix sweep missed: P2-006 (`runtime/README.md:15`), P2-007 (`shared/progress/README.md:12`), P2-008 (`sk-create-benchmark/SKILL.md:32` DAB prefix). All are documentation-code drift with no runtime/code impact. The six focus items otherwise passed: the explicit-model hard rule is present, consistent with its sibling doc-only advisories, and followable; the root README counts/families verify exactly against disk; the legacy/ body mirrors and compiled contracts cohere with their live command sources (the retained Gate-3 documentation-gate text is correct — that gate was not retired); and comment hygiene is clean across all seven commits. P2-only → PASS with advisories.

Review verdict: PASS
