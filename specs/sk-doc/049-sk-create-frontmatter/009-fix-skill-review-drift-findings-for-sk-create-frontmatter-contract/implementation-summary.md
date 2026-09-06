---
title: "Implementation Summary: fix the skill-review drift findings in the sk-create-frontmatter contract"
description: "The contract now says what its validators do, every declared trigger the advisor can score reaches the mode, the hub description sits at 130 characters with the routing gates green, and the packet documents agree with each other. One alias is recorded against the scorer, and one accidental fleet-wide metadata rewrite was reverted and is reported."
trigger_phrases:
  - "frontmatter contract drift fixed"
  - "hub description trimmed to budget"
  - "trigger_phrases scores zero"
  - "migrate-generated-json incident"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract"
    last_updated_at: "2026-09-05T00:00:00Z"
    last_updated_by: "implementation"
    recent_action: "Closed the phase from the working tree with every gate green"
    next_safe_action: "Commit, then run the two-pass version apply the standard describes for the edited mode documents"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-049-009-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-fix-skill-review-drift-findings-for-sk-create-frontmatter-contract |
| **Status** | Complete |
| **Completed** | 2026-09-05 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The contract stopped overstating its enforcement. Four passages in the field reference said things
no validator does: a closing delimiter within 20 lines, description lengths of 10 to 200 and 10 to
100 characters, a spec document that needs no frontmatter, and a five-field block enforced fleet-wide
in coverage mode. Each now says what the code does, with the script and the flag that does it. The
engine's usage text lists `gate`, the one mode the post-edit hook runs. The mode's `SKILL.md` gained
the two sections the packaging gate asked for, and the reference router gained the overview the
document validator asked for.

The declared trigger set became scoreable. `version field` was missing from stage one and routed
only at the confidence floor with a score of 0.24. It now routes at 0.8917 on its own signal. The
alias `trigger_phrases` returns nothing from the advisor in every lane, even with the confidence
threshold lowered to 0.5, while `importance_tier` from the same three files scores 0.485. The spaced
form `trigger phrases` was added to every surface the underscore form is on, and routes to the mode
at 0.9034 with a compiled target. The underscore form is recorded against the scorer below.

The hub was brought inside its own mode's budget. The sk-doc description was 639 characters, the
largest single entry in a project sitting 115 characters under the 8,000-character cutoff the mode
documents as a silent discovery drop. It is now 130 characters, and eight hub-shaped prompts replayed
identically before and after. Because the hub `SKILL.md` is a pinned compiled-routing source, the
edit carried the manifest re-mint and the canary re-pin, with the guard read stale before and fresh
after.

The packet documents agree with each other again. The parent goal listed phase 008 in progress at
88 percent while the spec map said complete. The parent spec carried Level 2, a `main` branch and a
scaffold placeholder. Phase 008's titles read Phase 1, its session id was a literal placeholder, and
44 checklist lines were unchecked with `[X]` in the summary table. All reconciled.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `sk-create-frontmatter/assets/frontmatter-templates.md` | Modified | Parse diagram, section 5 rules for skill, command, reference and spec classes, two checklist lines, the reference and README enforcement notes |
| `sk-create-frontmatter/SKILL.md` | Modified | `trigger phrases` in the keyword list, sections 7 and 8 |
| `sk-create-frontmatter/references/README.md` | Modified | Overview section and reference map |
| `sk-doc/shared/scripts/frontmatter-version.mjs` | Modified | Usage text lists `gate` |
| `sk-doc/mode-registry.json`, `sk-doc/hub-router.json`, `sk-doc/ROUTER.md` | Modified | `trigger phrases` beside `trigger_phrases` at stage two |
| `sk-doc/graph-metadata.json` | Modified | `trigger phrases` and `version field` in `intent_signals` and `derived.trigger_phrases` |
| `sk-doc/SKILL.md` | Modified | Description trimmed from 639 to 130 characters |
| `013-live-activation/activation/sk-doc/manifest.json` (runtime and authored) | Re-minted | Fingerprint `fbd5b4810359...` after the hub edit |
| `009-parent-hub-rollout/007-sk-doc/harness/validate-canary.cjs` | Modified | Eight `AUTHORED_DIGESTS` entries re-pinned |
| `009-parent-hub-rollout/007-sk-doc/{activation,compiled}/*` | Regenerated | Five artifacts rebuilt by `build-artifacts.cjs` |
| `../goal.md`, `../spec.md` | Modified | Progress, criteria, binding, metadata residue, phase map row and handoff row, open questions |
| `../008-utilization-review/{spec,plan,tasks,acceptance-criteria}.md` | Modified | Titles, session id, 44 checklist lines and the summary counts |
| This folder | Added | Phase 009 documents and regenerated metadata pair |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every routing claim was measured twice, before and after, at advisor generations 593 and 596 with
`freshness: live` on all 52 responses. Every contract correction was made by reading the validator
it names, not the document that described it: `quick_validate.py` lines 16, 92 and 224 to 235 for the
budget, `check-skill-doc-frontmatter.mjs` lines 34 and 173 for the walk and the mode, and the fleet
walk of 818 reference and asset files against the checker's 128. The hub edit was held to a negative
control: `compiled-route-guard.cjs` reported `sk-doc stale-manifest` after the description change and
`fresh` after the re-mint.

### 3. Contract corrections

| Site | Before | After | Proof |
|------|--------|-------|-------|
| Section 1 parse diagram | closing `---` within first 20 lines | the next line that is exactly `---`, no limit | no validator caps length, 7 `SKILL.md` and 24 playbook blocks exceed 20 lines and pass |
| Section 5 SKILL description | `min_length: 10`, `max_length: 200` | soft target 130, hard cap 1,536, enforced by `quick_validate.py` | `skill-contract.json` `descriptionBudget` |
| Section 5 Command description | `min_length: 10`, `max_length: 100` | soft target 110, hard cap 1,536 | same |
| Section 5 Spec | `frontmatter_required: false`, suggest removal | required, owned by system-spec-kit, missing block caught by the frontmatter-basics check and malformed by `SPECDOC_FRONTMATTER_001` | `spec-doc-structure.ts` 269 to 278 and 682, `orchestrator.ts` 863 to 883 |
| Section 5 SkillReferenceAsset | no enforcement line | `enforced_by` naming coverage mode, the packaging gate, and the shape-mode pass | checker lines 11 to 22, 34, 173 |
| Section 4 reference note | "enforces this contract in coverage mode" | default shape mode, `--coverage` flag, top-level walk, packaging gate for nested packets | same |
| Section 4 README note | bare script name | path-qualified under the advisor | file location |
| Checklist | "within first 20 lines", "10-200 chars" | no limit, soft targets by class | same as rows 1 to 3 |

### 4. Routing measurement

| Prompt | Before, generation 593 | After, generation 596 |
|--------|------------------------|-----------------------|
| `version field` | `sk-doc` 0.82, score 0.24, incidental | `sk-doc` 0.8917, score 0.692, target `sk-create-frontmatter` |
| `trigger phrases` | `sk-doc` 0.9034, no compiled target | `sk-doc` 0.9034, target `sk-create-frontmatter` |
| `trigger_phrases` | nothing | nothing, also nothing at a 0.5 confidence threshold |
| `frontmatter field` | 0.8444 | 0.8495 |
| The other 14 declared triggers | unchanged | unchanged, 12 above 0.84 and `frontmatter version`, `importance_tier`, `contextType`, `X.Y.Z.W` at the 0.82 floor as before |
| Eight hub-shaped prompts for other modes | routed | identical to the byte after the description trim |

Out-of-domain replay of the two new aliases: `what phrases trigger the smoke alarm` routes nothing.
`trigger phrases for a marketing email campaign` 0.8562, `bump the version field in package.json`
0.8796 and `read the version field from the cargo manifest` 0.8607 route to `sk-doc`. These are
narrow captures on repository-specific tokens, the same reading phase 008 gave `X.Y.Z.W`, and are
kept.

### 5. The hub description

| Measure | Before | After |
|---------|--------|-------|
| `sk-doc` description length | 639 | 130 |
| Project total, `audit_descriptions.py` | 7,885 | 7,376 |
| Headroom under 8,000 | 115 | 624 |
| Guard | fresh | stale-manifest, then fresh after re-mint |
| Runtime manifest fingerprint | `0ed424e005eb...` | `fbd5b4810359...`, authored copy matched |
| Canary | red on 4 pins already stale at HEAD | `REAL-GREEN`, 23 of 23 route-gold rows real-green |

The canary was red before this phase began. Four pins did not match HEAD: `sk-create-agent`,
`sk-create-changelog`, `sk-create-command` and `sk-create-manual-testing-playbook` `SKILL.md` files
had been committed after the last re-pin on 2026-09-04. This phase's edits drifted four more: the
hub `SKILL.md`, `hub-router.json`, `mode-registry.json` and `sk-create-frontmatter/SKILL.md`. Every
pinned file was either at HEAD or this phase's own work, so the eight entries were re-pinned in one
pass, following the reasoning phase 008 recorded in its ADR-001.

### 6. Packet reconciliation

| Document | What was wrong | Now |
|----------|----------------|-----|
| `../goal.md` | Phase 008 in progress at 88 percent, criteria unchecked, deviation row still describing the phase map as Pending | 008 and 009 done with commits and evidence, criteria checked, binding table lists the 009 goal |
| `../spec.md` | Level 2 against a level-3 marker, branch `main`, parent packet `scaffold/001-...`, parent spec `../spec.md`, phase 9 row missing, `--help` still described as unfixed | Level 3, `skilled/v4.0.0.0`, real packet pointer, row 9 Complete, handoff row, open questions rewritten |
| `../008-utilization-review/*` | Titles read Phase 1, session id `[SESSION-ID]`, 44 checklist lines unchecked, `[X]` counts | Phase 8, real session id, every line marked with the evidence its acceptance criteria carry, counts 15, 23 and 9 |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Correct the contract to the checker rather than extend the checker | The checker is the advisor's, and extending its walk would newly fail 22 files in other skills. ADR-001 |
| Add the spaced alias and record the underscore form | The scorer is out of scope and the mechanism is not located in its code. The spaced form routes today. ADR-002 |
| Trim the hub description under a baseline and carry the refresh | 115 characters from a silent drop the mode documents, with eight prompts and 23 route-gold rows as the net. ADR-003 |
| Re-pin all eight drifted digests in one pass | Every non-phase entry was at HEAD, so no other session's uncommitted bytes entered the pin set |
| Author the phase documents against phase 008's validated shape | The scaffolder emitted one-line bodies with a success banner on three runs, recorded below |
| Leave phase 008's plan body as it validated | It carries the template's placeholders. Writing a plan for closed work after the fact would be fabrication |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -n '10-200\|max_length\|min_length\|suggest_removal\|first 20' assets/frontmatter-templates.md` | no matches |
| `frontmatter-version.mjs --help` | lists `gate`, exit 0 |
| `test-frontmatter-version.mjs` | PASS, 23 passed, 0 failed |
| `package_skill.py --check --strict sk-create-frontmatter` | `Result: PASS`, no warning line |
| `validate_document.py` on SKILL.md, README.md, references/README.md, references/frontmatter-versioning.md, assets/frontmatter-templates.md, and the hub SKILL.md | `Total issues: 0` on each |
| `quick_validate.py` on the mode and on the hub | `Skill is valid!` on both |
| `validate-playbook-package.cjs` | exit 0, 11 scenarios |
| `resolve_skill_markdown_links.py --scope sk-create-frontmatter` | `failures=0`, 100 entries |
| `parent-skill-check.cjs .opencode/skills/sk-doc` | all hard invariants passed, 0 warnings |
| `check-frontmatter-versions.sh --skill sk-doc` | `394 files ok=393 skip-no-frontmatter=1` |
| `compiled-route-guard.cjs` | all five hubs fresh |
| `compiled-route-sync.cjs --verify` | `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs` |
| `validate-canary.cjs` (authored copy under `specs/`) | `"status":"REAL-GREEN"`, 23 of 23 rows, exit 0 |
| `hvr_scan.py` against each file's HEAD baseline | templates asset 3 to 3 after removing one semicolon this phase added, mode SKILL.md 0 to 0, references README 0 to 0, hub SKILL.md 36 to 35, parent spec 1 to 1 pre-existing, every phase 009 document 0 |
| `validate.sh --strict` on the parent, phase 008 and this phase | recorded in the closing run below |
| `audit_descriptions.py` | project total 7,376, sk-doc no longer listed over the soft target |

### Closing run

`validate.sh --strict` results from the final working tree are recorded by the session close-out. The
first `RESULT:` line of the parent run is the parent's own verdict, since a phase parent recurses.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`trigger_phrases` still returns nothing from the advisor.** The underscore form is in the
   keyword list, the registry, the hub router, `ROUTER.md` and both stage-one lists, exactly as
   `importance_tier` is, and `lib/scorer/text.ts` folds underscores to spaces. The advisor returns an
   empty list at generations 593 and 596 and at a 0.5 confidence threshold. The mechanism is inside
   `system-skill-advisor` and is not located in this phase. Command to reproduce:
   `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"trigger_phrases","options":{"confidenceThreshold":0.5,"includeAbstainReasons":true}}' --format json`.
2. **The advisor's checker still walks top-level skills only.** 128 documents checked against 818 in
   the tree, and 22 reference and asset files under nested packets lack part of the five-field
   block. The contract now says so. Extending the walk is the checker owner's decision.
3. **Four other descriptions remain over the soft target.** `mcp-tooling` at 643, `sk-code` at 424,
   `cli-external-orchestration` and `system-spec-kit` at 147, and the `design` agent at 172. Other
   owners. The project total still exceeds the 5,600 soft ceiling.
4. **The spec-kit scaffolder emits empty child bodies.** `create.sh --phase --parent` twice and the
   standard `--level 3` path once produced one-line or absent markdown at exit 0 with a
   `Created Successfully` banner. The phase 009 documents were authored against phase 008's shape
   and validated strict. Recorded for `system-spec-kit`.
5. **Versions on the edited mode documents are applied at commit time.** The standard says to run
   `apply` in the same commit as the content change. Nothing was committed in this session, so the
   `gate` was run and `apply` was not.
6. **One accidental fleet-wide metadata rewrite, reverted.** Running
   `dist/graph/migrate-generated-json.js` with no arguments to read its usage executed a repo-wide
   migration instead: 1,586 folders reported migrated, 1,907 `description.json` and
   `graph-metadata.json` files rewritten with derived fields replaced by generic placeholders and
   statuses flipped. Every tracked file among them, 1,895 including this packet's, was restored to
   HEAD with `git checkout`. Six files under `specs/system-deep-loop/036-deep-loop-innovation/`
   were modified before the run by another session and were not touched. Thirty untracked
   `description.json` and `graph-metadata.json` files remain in place because a delete is not
   reversible and some sit inside other sessions' untracked packets:
   `specs/system-deep-loop/035-command-surface-benchmark/` holds twelve, `specs/system-speckit/000-release/`
   seven, two each under `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/`, `specs/sk-doc/052-routing-completeness/` and
   `specs/system-deep-loop/041-cli-pi-devpass-glm-route/`, and one each under
   `specs/hooks/002-injection-bloat-reduction/`, `specs/hooks/010-hook-feature-flags-and-hub-index/`,
   `specs/sk-design/013-structure-naming-cleanup/`, `specs/sk-doc/029-doc-divider-and-anchor-standard/` and
   `specs/sk-doc/031-command-surface-router-awareness/`. A fresh review corrected an earlier count of 23.
   List them with `git status --short --untracked-files=all | grep -E '(description|graph-metadata)\.json$'`.
   The operator decides which are residue. The tool has no argument guard and no confirmation, which
   is a defect to raise with `system-spec-kit`.
<!-- /ANCHOR:limitations -->
