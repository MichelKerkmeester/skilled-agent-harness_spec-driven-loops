---
title: "Plan: SKILL.md Template Conformance — system-deep-loop"
description: "Execution plan for auditing and fixing SKILL.md template conformance across the system-deep-loop hub and its 4 workflow packets."
trigger_phrases:
  - "deep loop skillmd conformance plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/006-skillmd-template-conformance"
    last_updated_at: "2026-07-08T18:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Plan executed and verified complete"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: SKILL.md Template Conformance — system-deep-loop

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Audit all 5 SKILL.md files under `system-deep-loop` (hub + 4 workflow packets) against `sk-doc`'s canonical templates using the project's own authoritative checkers, then fix whatever concrete gaps are found — no manual eyeballing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- `package_skill.py --check` returns `Result: PASS`, 0 errors, on all 4 workflow packets.
- `parent-skill-check.cjs` returns 0 warnings on the hub, no regression from a pre-batch baseline.
- No live reference to a renamed asset left pointing at the old name.
- No operational content lost from any SKILL.md trim (independently spot-checked, not assumed).
- No test regression introduced (pre-existing failures confirmed via git-stash-against-clean-HEAD, not silently blamed on this batch).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Two authoritative checkers, matched to skill shape:
- **Leaf skills** (`deep-research`, `deep-review`, `deep-improvement`, `deep-ai-council`): `sk-doc/scripts/package_skill.py --check`, validating against `skill_md_template.md`.
- **Two-axis hub** (`system-deep-loop` itself): `.opencode/commands/doctor/scripts/parent-skill-check.cjs`, validating against `parent_skill_hub_template.md`'s 34 hard invariants.

A leaf-shaped checker warning on the hub (`discover_markdown_resources` marker missing) was investigated and confirmed a false positive — the hub deliberately has no `references/`/`assets/` to route by runtime key, so the leaf-skill Python-router pattern doesn't apply. Not fixed, by design.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Audit and Scope

Run both checkers directly against all 5 SKILL.md files (no delegation — fast and authoritative). Triage findings: separate hard structural gaps (none found) from soft/recommended warnings (word count ×3, asset naming ×131, changelog frontmatter ×4). Present the risk/reward tradeoff to the operator before doing invasive work. Scope the rename's blast radius with a read-only research pass — determine glob-discovered vs. hardcoded-referenced assets, and whether basenames function as embedded semantic case-IDs.

### Phase 2: Execute

Execute the mechanical rename directly: deterministic old→new mapping (basenames only, directories untouched), `git mv` all 131 files, re-check. Dispatch a workflow for everything judgment-heavy, run in parallel: fix embedded JSON content, fix path/prose references, fix changelog frontmatter, trim 3 oversized SKILL.md files.

### Phase 3: Verification and Close-Out

Independently verify: a separate agent re-runs every checker, greps for stale references, spot-checks content fidelity and test regressions. Fix the real remaining issues the verify agent finds, re-confirm clean, and close out with real evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `package_skill.py --check` on all 4 packets + hub (structural pass/fail + warning count).
- `parent-skill-check.cjs` on the hub (34 hard invariants).
- Repo-wide grep for old fixture-name stems (live-vs-historical classification).
- Skill-benchmark vitest suite, run before AND after (via `git stash` against clean HEAD) to distinguish pre-existing failures from regressions.
- Manual content-fidelity spot-check on the 3 SKILL.md trims (specific facts traced from old location to new reference file).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md` — leaf-skill template authority.
- `.opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md` — hub template authority.
- `.opencode/skills/system-deep-loop/deep-improvement/assets/model_benchmark/benchmark-profiles/{default,reviewer_regression}.json` — hardcoded fixture-array configs at risk from the rename.
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/lib/profile-resolve.cjs` — the literal-path fixture resolver (vs. the glob-based one).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All changes are file renames + content edits inside `.opencode/skills/system-deep-loop/`, uncommitted at the time of this work (same as the rest of this session's changes on this branch). `git checkout -- .opencode/skills/system-deep-loop/` reverts everything from this packet in one shot if needed before any commit. No destructive operations were performed; every rename is a `git mv` (tracked, reversible).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Parent packet**: `../spec.md` (deep-loop-workflows + deep-loop-runtime merge into system-deep-loop)
- **Precedent**: `../005-validation-and-closeout/` (prior phase's validation-sweep shape)
<!-- /ANCHOR:cross-refs -->
