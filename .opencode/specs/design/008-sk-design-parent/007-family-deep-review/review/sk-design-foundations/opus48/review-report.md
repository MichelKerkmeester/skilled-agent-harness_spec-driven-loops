---
title: Deep Review Report — sk-design-foundations
mode: review
sessionId: skreview-sk-design-foundations-opus48
target: .opencode/skills/sk-design-foundations
targetType: skill
executor: cli-claude-code (claude-opus-4-8)
verdict: CONDITIONAL
hasAdvisories: true
releaseReadinessState: converged
version: 1.0.0.0
---

# Deep Review Report — sk-design-foundations

## 1. Executive Summary

**Verdict: CONDITIONAL** (hasAdvisories: true)

`sk-design-foundations` v1.0.0.0 is a well-built static visual-system knowledge skill. Its domain guidance
(OKLCH, contrast, typography measure, layout rhythm, responsive adaptation) is technically accurate, its
smart-router pseudocode includes a correct path-traversal guard, and all external references it cites
(parent shared base ×3, the sk-doc smart-router pattern, sibling routing) resolve on disk. There are **no
P0 (blocking) findings** and **no security findings**.

One **P1** keeps the verdict at CONDITIONAL: the skill's own manual-testing playbook (its acceptance
contract) requires a color **"focus" role** that none of its references define as a role, so a faithful
execution against the knowledge base can be wrongly failed by the playbook. The remaining five **P2**
findings are color-role vocabulary drift, a `family` metadata key-name collision, a catalog path-base
inconsistency, dead router pseudocode, and a least-privilege `Task` tool observation.

| Metric | Value |
| --- | --- |
| Active P0 | 0 |
| Active P1 | 1 |
| Active P2 | 5 |
| Dimensions covered | 4/4 (correctness, security, traceability, maintainability) |
| Iterations | 5 (converged; max 5) |
| Scope | 16 files (SKILL.md, 5 references, 4 feature_catalog, 4 playbook, changelog, graph-metadata) |
| Stop reason | Converged: composite ≥ 0.60, coverage stable ≥ 1 pass, no active P0 |

## 2. Planning Trigger

The CONDITIONAL verdict routes to **`/speckit:plan`** for a small remediation pass. Exactly one P1 must be
reconciled (F001) to reach PASS; the five P2s are advisory and can ride the same change or be deferred.
This is low-blast: every fix is a documentation edit inside the skill package — no code, no runtime, no
consumer contract is affected. Once F001 is reconciled, re-running this review should yield PASS with
`hasAdvisories=true` until the P2 cleanups land.

## 3. Active Finding Registry

| ID | Sev | Category | Evidence | Summary |
| --- | --- | --- | --- | --- |
| F001 | P1 | playbook-capability | `manual_testing_playbook/01--color/oklch-palette-and-dark-mode.md:30` + `references/color/palette_theming.md:60-68` + `references/color/oklch_workflow.md:54` + `SKILL.md:242` | Playbook FOUND-COLOR-001 requires a "focus" color role that no reference defines as a role. A correct execution can be wrongly FAILed by the skill's own acceptance test. |
| F002 | P2 | internal-consistency | `SKILL.md:242`; `references/color/palette_theming.md:60-68`; `references/color/oklch_workflow.md:54` | Color-role vocabulary drifts across four documents (canvas/signal in SKILL.md never appear in role tables; text/neutral/semantic absent from SKILL.md's list). |
| F003 | P2 | metadata-drift | `SKILL.md:8`; `graph-metadata.json:6` | `metadata.family: sk-design` vs graph `"family": "sk-code"` (category=design). Family-wide convention, but the same key name carries two meanings. |
| F004 | P2 | docs-convention | `feature_catalog/02--typography-systems/typography-systems.md:26`; `feature_catalog/01--color-systems/color-systems.md:25`; `feature_catalog/03--layout-adaptation/layout-adaptation.md:25-26` | Catalog detail files mix file-relative (`../feature_catalog.md`) and skill-root-relative (`references/corpus_map.md`) "Source Files" paths. |
| F005 | P2 | dead-code | `SKILL.md:108-112`; `SKILL.md:181` | Router pseudocode defines unused `LOAD_LEVELS`; the `<0.5` no-signal branch is mislabeled "Cross-axis" (genuine cross-axis is handled at `:194-196`). |
| F006 | P2 | least-privilege | `SKILL.md:4` | `allowed-tools` grants `Task` to a read-only knowledge skill (broader than needed; consistent with family read-only members). |

All findings carry concrete `file:line` evidence. No inference-only findings.

## 4. Remediation Workstreams

### Workstream A — Color-role contract (resolves F001 + F002) [P1]
Establish one canonical color-role vocabulary for the skill and align all four surfaces to it:
- Decide whether "focus" is a first-class role or an accent state. If a state, reword `oklch-palette-and-dark-mode.md:30` to check accent-state coverage rather than a discrete role. If a role, add it to `palette_theming.md` §4 and `SKILL.md` ALWAYS rule 2.
- Reconcile `canvas`/`signal` (SKILL.md) and `text`/`neutral`/`semantic` so the role list in SKILL.md, `palette_theming.md:60-68`, `oklch_workflow.md:54`, and the playbook match.

### Workstream B — Metadata & docs hygiene (resolves F003 + F004) [P2]
- Document (or rename) the `family` convention so the two `family` keys are unambiguous; a one-line note in `graph-metadata.json` context or a comment in SKILL.md frontmatter suffices.
- Normalize catalog "Source Files" paths to a single base (skill-root-relative, matching `feature_catalog.md`).

### Workstream C — Router pseudocode cleanup (resolves F005 + F006) [P2]
- Remove the unused `LOAD_LEVELS` dict and fix the `<0.5` branch comment to read "no-signal / unscoped".
- Re-evaluate whether `Task` is required; tighten to `[Read, Grep, Glob]` if not (coordinate with the family convention so siblings stay consistent).

## 5. Spec Seed

> Minimal spec delta for the remediation packet.

**Title:** sk-design-foundations v1.0.0.1 — color-role contract reconciliation + docs hygiene
**Problem:** The skill's acceptance playbook requires a "focus" color role its references never define, and the
color-role vocabulary is inconsistent across four documents; minor metadata/docs/pseudocode drift accompanies it.
**Scope (frozen):** `manual_testing_playbook/01--color/oklch-palette-and-dark-mode.md`,
`references/color/palette_theming.md`, `references/color/oklch_workflow.md`, `SKILL.md`,
`feature_catalog/0{1,2,3}--*/*.md`, `graph-metadata.json`.
**Out of scope:** Any change to the static-system *guidance content* itself; siblings; parent router.
**Acceptance:** One canonical color-role set referenced identically by SKILL.md, both color references, and the
color playbook scenario; playbook FOUND-COLOR-001 passable by a faithful reference-driven execution; P2 cleanups
applied or explicitly deferred.

## 6. Plan Seed

1. Choose the canonical color-role vocabulary (decision: is "focus" a role or a state?). — resolves F001 root.
2. Edit `palette_theming.md` §4 + `SKILL.md` ALWAYS rule 2 + `oklch_workflow.md` §3.5 to the canonical set. — F002.
3. Reword or extend `oklch-palette-and-dark-mode.md:30` pass criteria to match. — F001.
4. Add the `family`-convention note and normalize catalog source-path base. — F003, F004.
5. Drop unused `LOAD_LEVELS`, fix branch comment, re-decide `Task`. — F005, F006.
6. Re-run deep-review (skill target) to confirm PASS / hasAdvisories.

## 7. Traceability Status

### Core protocols (hard gate)

| Protocol | Status | Notes |
| --- | --- | --- |
| spec_code | **pass** | All normative SKILL.md claims resolve to shipped references, catalog, playbook, sibling routing, and the 3 parent shared-base files (verified present). |
| checklist_evidence | **n/a** | Skill package has no `checklist.md`; success criteria are prose. |

### Overlay protocols (advisory; applicable to target type `skill`)

| Protocol | Status | Notes |
| --- | --- | --- |
| skill_agent | **n/a** | No dedicated runtime agent (`.opencode/.claude/.codex/agents`) for this skill. |
| feature_catalog_code | **partial** | Catalog rows map 1:1 to references, but color-role vocabulary is inconsistent (F002). |
| playbook_capability | **partial** | TYPE-001 and LAYOUT-001 pass; COLOR-001 over-specifies an undefined "focus" role (F001). |

Unresolved gaps: F001 (playbook_capability), F002 (feature_catalog_code).

## 8. Deferred Items

- **F002–F006 (P2 advisories):** safe to defer if F001 alone is reconciled for a quick PASS, but Workstreams B/C are cheap and recommended in the same pass.
- **F006 family-wide note:** if `Task` is removed here, evaluate the same for `sk-design`, `sk-design-motion`, `sk-design-audit` to keep the family consistent (out of scope for this single-skill review).
- **No checklist.md / no runtime agent:** these are expected for a knowledge skill, not gaps to fill.

## 9. Audit Appendix

### Coverage

- Files read: 16/16 in the skill package (100%). All `graph-metadata.json` `key_files` resolve.
- Dimensions: 4/4. Overlay protocols: 2 run (partial), 2 N/A (with recorded rationale).
- Tool calls: within LEAF budget; observation-only, zero writes to any reviewed file.

### Replay Validation

Recomputed from `deep-review-state.jsonl`: ratios 0.00, 0.00, 0.45, 0.12, 0.00 → rolling avg of last two
= 0.06 < 0.08 (rolling signal fires); MAD noise floor met; dimension coverage 4/4 stable ≥ 1 pass (coverage
signal fires). Composite ≥ compositeStopScore (0.60). No active P0 → P0 override (≥0.50) not triggered.
Recorded synthesis decision (CONDITIONAL, converged) matches the replayed decision. Replay: **pass**.

### Verdict Logic

activeP0 = 0, activeP1 = 1 → **CONDITIONAL** (P1 present, no P0). hasAdvisories = true (activeP2 = 5).
VERDICT_LOCK: no confirmed active P0, so FAIL is not forced. Next command: `/speckit:plan`.

### Claim Adjudication

F001 (only P1) carries a typed adjudication packet (iteration-003.md): evidence re-read, counterevidence
sought (grep for any "focus" role enumeration — found only accent-state usage), alternative explanation
recorded and rejected, finalSeverity P1, confidence 0.78, downgradeTrigger documented. `claim_adjudication`
event passed=true. claimAdjudicationGate: **pass**.

### Convergence Evidence

Stop reason: converged — 4/4 dimensions covered, composite ≥ 0.60, coverage stable ≥ 1 pass, no active P0.
Legal-stop gates (convergence, dimensionCoverage, p0Resolution, evidenceDensity, claimAdjudication, coverage)
all pass. Iterations: 5 of max 5.

---

Review verdict: CONDITIONAL
