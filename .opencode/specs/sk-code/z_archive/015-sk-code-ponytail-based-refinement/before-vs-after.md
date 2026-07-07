# What Changed in 142: Ponytail-Based Refinement for sk-code and sk-code-review

> Spec 142 shipped a targeted transfer of ponytail mechanisms into `sk-code` and `sk-code-review`, validated across eight completed phase children without changing the core review contract or smart-router behavior.

---

## THE UNIFYING PRINCIPLE

The packet applies one rule: transplant the ponytail mechanisms that reduce agent drift, overbuild and stale copies, then stop. It does not import a brand. It does not rewrite the skills around a new doctrine. It lands small, named controls where the agent already looks.

That rule shows up in three ways. Review pressure became sharper where agents reinvent native behavior or ship unasked code. Drift protection became executable where exact wording and mirrored agent files can silently rot. Reusable checklist content moved into asset folders where the framework expects reusable assets to live.

That rule shaped every section below.

---

## 1. REVIEW PRESSURE AGAINST OVERBUILD

**Before**

`sk-code-review` already had KISS and DRY pressure, a P0, P1 and P2 model and a final-line Review status contract. It did not directly call out hand-rolled standard-library behavior, duplicated native platform features or code that was not asked for. `removal_plan.md` could recommend removal, but it did not name a replacement class in the table.

**After**

Phase 1 added three additive checklist rows and a Replacement column. The new rows cover hand-rolled stdlib behavior where the runtime already ships a primitive, custom code or dependency use that duplicates native capability and unrequested code that should be treated as a removal candidate. The Replacement column names `nothing`, `stdlib API`, `native feature` and `shorter equivalent`.

The review model stayed intact. The Review status final-line contract and the P0, P1 and P2 severity model did not move. Over-engineering still defaults to P2 unless the added code creates attack-surface, contract or regression risk.

**Impact**

A reviewer now has precise language for the most common overbuild cases. The rows do not broaden security or correctness findings. They make removal advice more actionable by requiring the reviewer to name what replaces the unnecessary code.

**Why additive rows**

The existing checklist already owned review behavior. A new process or separate policy would have scattered the signal. Additive rows put the pressure at the moment a reviewer is already scanning for quality findings.

---

## 2. INTENTIONAL SIMPLIFICATION WITHOUT A LOOPHOLE

**Before**

The framework already valued simple code, but it had no neutral convention for recording that an apparently smaller implementation was an intentional ceiling rather than an omission. That left reviewers with two bad choices: treat every simplification as suspicious or accept vague comments as justification.

**After**

Phase 2 documented a neutral `ceiling:` convention in `code_style_guide.md` §4 and added a matching review note in `code_quality_checklist.md` §7. The convention requires a durable why, avoids brand language and does not change the comment-hygiene allow-list. Its review effect is bounded to P2 KISS or YAGNI downgrade only.

Security and correctness remain outside the carve-out. A `ceiling:` note cannot downgrade findings about security, auth, persistence, sandboxing, public contracts or correctness.

**Impact**

Authors can explain a deliberate simplification without inviting a new brand-specific comment style. Reviewers can recognize that explanation while still preserving the hard review floor.

**Why not enforce it**

The convention is behavioral documentation by design. It records intent for human and agent review, but it does not create a checker rule or an allow-list exception.

---

## 3. EXACT WORDING AND MIRROR DRIFT GUARDS

**Before**

The skills contained load-bearing strings and mirrored agent content that had to stay exact. Drift was possible because the invariants were known by convention rather than checked by a small dedicated guard. A pre-flight audit in Phase 4 found context and orchestrate already drifted before the new gate existed.

**After**

Phase 3 added `check-rule-copies.js`, `check-rule-copies.test.sh` and `.github/workflows/rule-canary-sync.yml`. The canary checks exact substrings per file, Iron Law line tokens and missing files. It collects all failures, passes on the real repo and fails on tampered wording.

Phase 4 added `check-agent-mirror-sync.cjs`, a staged-agent mirror gate in `.opencode/hooks/pre-commit`, `.github/workflows/agent-mirror-sync.yml` and `verify_stack_folders.py`. It diagnosed context and codex as real drift because a Tool-Inventory row was dropped, and it diagnosed orchestrate as a false positive because its per-runtime self-description was not allowlisted. The real drifts were fixed.

**Impact**

The packet moved critical wording from trust to verification. Rule drift now fails loudly in pull requests to `main`, agent mirror drift is checked on changed agent files and `STACK_FOLDERS` must bind to real `references/` and `assets/` surfaces.

**Why the guards are small**

The canary guards a fixed list of parsed or safety strings. That is intentional. The goal is not to freeze prose broadly, but to protect the few strings where drift changes behavior or safety.

---

## 4. PRE-WRITE DESIGN RESTRAINT AND ANTI-STALL GUIDANCE

**Before**

`sk-code` required reading, implementation and verification, but it did not put a compact design-restraint ladder at the pre-write moment. It also left room for an agent to confuse YAGNI judgment with permission to silently cut scope or stall when a minimal safe implementation was already clear.

**After**

Phase 5 added the Design Restraint Ladder to `code_quality_standards.md` §1, then linked it into the `0 -> 1` phase transition and the Phase 1 Requirement cell in `SKILL.md`. The ladder is always loaded, surface-flavored and explicit that it does not change surface precedence or the Iron Law.

Phase 6 added the implementer anti-stall rule to `sk-code/SKILL.md` §4 ALWAYS bullet 9. The rule says to build the simplest correct implementation of the stated requirement. If part of the requirement looks unnecessary, the agent still implements as specified and raises a scope-amendment recommendation in the same response.

**Impact**

The agent gets restraint before code is written, not only after review. It also gets a clear path when scope looks larger than needed: implement the safe minimal requested behavior, then raise the amendment instead of silently cutting scope.

**Why guidance instead of a gate**

These rules shape judgment inside the work loop. They are intentionally not machine-enforced because the right answer depends on the task surface, the requirement and the safe minimal implementation.

---

## 5. REVIEW DEPTH AS A NAME FOR EXISTING BEHAVIOR

**Before**

`sk-code-review` already had review tiers, an `ON_DEMAND` tier and an M-2 safe-skip path. Operators could influence some behavior through existing environment idioms, but there was no named depth alias that mapped to the existing review shapes.

**After**

Phase 6 added `SK_CODE_REVIEW_DEPTH=lite|full|ultra` in `sk-code-review/SKILL.md` §9.3. The alias follows `env>config>default`, mirrors `SK_CODE_REVIEW_MIN_CHANGED_LINES`, maps `ultra` toward the existing `ON_DEMAND` tier and maps `lite` to the existing M-2 safe-skip.

The alias does not create new floors. The ALWAYS tier, security minimums and P0, P1 and P2 model remain immutable.

**Impact**

Operators get clearer vocabulary for choosing review depth without changing the review contract. The alias persists existing behavior instead of inventing a second review system.

**Why this was safe to ship**

It names existing paths and preserves the floors. That made it a useful optional add-on rather than a behavioral rewrite.

---

## 6. ASSET AND ROUTER CONFORMANCE

**Before**

Some reusable checklist files did not match the framework's asset-template expectations. In `sk-code`, authoring checklists were missing the required OVERVIEW shape. In `sk-code-review`, six reusable checklist artifacts were filed under `references/` even though reviewers apply them as assets.

**After**

Phase 7 restructured five `sk-code` authoring checklist assets to OVERVIEW with Purpose and Usage, added the Resource Loading Levels table to `.opencode/skills/sk-code/SKILL.md` §2 and preserved the router's surface-first design. The phase verified 11/11 asset docs as VALID, `verify_stack_folders.py` exit 0, `check-rule-copies.js` exit 0 and skill validation as VALID.

Phase 8 moved six `sk-code-review` checklist files from `references/` to `assets/`, aligned each moved checklist to the asset OVERVIEW and updated routing, `RESOURCE_MAP`, Resource Domains, README, `graph-metadata`, sibling cross-links, manual testing playbook source anchors and cross-skill pointers. Validation returned 6/6 VALID for moved assets, zero stale `references/<moved>` hits with changelogs excluded by design, all relative links resolved, the rule canary passed, skill validation returned VALID and `.claude` plus `.codex` mirror parity passed.

**Impact**

Reusable checklists now live where the framework's asset model expects them. The smart router reads canonical loading-level and fallback skeleton language without losing its surface-first behavior.

**Why history stayed historical**

Historical changelogs still cite old `references/` paths. That is intentional because v1.1 through v1.4 document the state at their release. The move is recorded in v1.5.0.0, and external links should update to `sk-code-review/assets/<name>.md`.

---

## CURRENT STATE

Spec 142 is shipped as eight completed phase children under `.opencode/specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement`. `sk-code-review` has sharper review rows, replacement guidance, a bounded simplification convention and asset-correct checklist layout. `sk-code` has the pre-write Design Restraint Ladder, anti-stall guidance and router conformance updates. The framework has rule canaries, mirror drift gates and `STACK_FOLDERS` binding checks.

The recorded verification includes strict phase validation where invoked, 11 completed task items in Phase 1, 9 in Phase 2, 10 in Phase 3, 14 in Phase 4, 10 in Phase 5, 7 in Phase 6, 14 in Phase 7 and 14 in Phase 8. Asset validation passed for 11/11 sk-code checklists and 6/6 moved sk-code-review checklists. Rule canaries, link checks, stack-folder validation, skill validation and mirror parity passed where applicable.
