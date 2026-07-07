---
title: "Implementation Summary: advisor and integration"
description: "A ground-truth deterministic sweep repointed every live reference broken by the 004 relocation and 005 fold (restoring the silently-broken pre-commit hygiene gate), and the hub advisor node absorbed the folded review identity while keeping the legacy alias."
trigger_phrases:
  - "sk-code advisor integration summary"
  - "sk-code reference repoint outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/007-advisor-and-integration"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Swept all broken references from ground-truth rename maps and integrated the hub advisor node"
    next_safe_action: "phase 008 routing-benchmark-and-review"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/graph-metadata.json"
      - ".opencode/hooks/pre-commit"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Spec Folder** | 007-advisor-and-integration |
| **Completed** | 2026-07-04 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 007 repaired every live reference broken by the relocation (004) and fold (005), integrated the folded review capability into the single hub advisor identity, and staged the advisor-graph rebuild for main.

### Regression discovered and fixed
Enumerating the reference surface surfaced a regression from 004: the relocation moved `sk-code`'s `scripts/`, `assets/`, and `references/` into the mode packets, but ~20+ external references still pointed at the old flat paths. This was load-bearing — `.opencode/hooks/pre-commit` pointed its `CHECKER` at the moved `sk-code/scripts/check-comment-hygiene.sh`, so the **pre-commit comment-hygiene gate had been silently skipping since 004** (the "checker not found ... skipping check" banner seen on prior commits was this regression, not a pre-existing condition). The `.claude/settings.json` PostToolUse hook, two CI workflows, and the hub's own `graph-metadata.json` key_files also pointed at dead paths.

### Deterministic ground-truth sweep
The exact `old → new` rename pairs were extracted from the 004 (128) and 005 (42) commits, plus two explicit mappings for the code-review `SKILL.md`/`README.md` that 005 recorded as delete+add. A repointer derived unambiguous single-destination directory mappings (correctly leaving split dirs like `references/webflow/` unmapped), sorted keys longest-first, validated every target on disk, and excluded JS/TS test fixtures (synthetic assertions) and historical `changelog/`/`specs/` archives. A mandatory dry-run (77 files / 225 replacements) was reviewed before applying.

### Hub advisor node integration
The hub `graph-metadata.json` node absorbed the folded review identity: the two dangling `sk-code-review` edges (enhances, siblings) were removed, the deleted node's `prerequisite_for → deep-loop-workflows` edge was absorbed, and the review `domains` (review, audit, security, quality-gate, merge-readiness, findings) and `intent_signals` (code review, pr review, security review, quality gate, findings, ...) were merged in so the advisor routes review queries to the hub. The legacy `sk-code-review` trigger-phrase alias is retained until 009.

### Files Changed (summary)
| Area | Action |
|------|--------|
| pre-commit hooks + CI workflows | Repoint comment-hygiene/canary paths → `code-quality/scripts/` (gate restored) |
| `.claude/settings.json` | Repoint PostToolUse hook command |
| hub `graph-metadata.json` | Repoint key_files; merge review keywords; clean dangling edges; keep alias |
| agents (`deep-review` + mirrors) + deep-loop template | Repoint `review_core.md` path load |
| `check-rule-copies.{js,test.sh}` | Repoint TARGETS + fix REPO_ROOT depth |
| ~70 further docs/scripts (sk-code, system-spec-kit, system-code-graph, plugins) | Deterministic path repoint |
| 007 spec folder | Created |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Claude orchestrated and executed the deterministic sweep directly (path repointing is mechanical plumbing — LLM path math is unreliable across 200+ cross-cutting references, the lesson recorded in 004). The mapping came from recorded git renames, not inference; a dry-run gate and on-disk target validation guarded every change. The hub advisor node and the test-script depth were surgical hand edits. No GPT dispatch was used this phase.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
| Decision | Why |
|----------|-----|
| Full sweep of all external references (operator-directed) | 004 broke a broad, partly load-bearing reference surface; leaving it would regress main at merge |
| Ground-truth rename maps over inference | Deterministic correctness across 200+ references; avoids the 004 LLM-path-math failure mode |
| Exclude JS/TS test fixtures | They embed synthetic sk-code paths as assertions; repointing would flip test expectations |
| Exclude changelog/ + specs/ archives | They record prior state; rewriting them would falsify history |
| Defer alias-covered NAME references to 009 | The alias keeps them functional; the speckit `baseline:` value has uncertain load-vs-route semantics best resolved at alias removal, after 008 validates routing |
| Defer advisor rebuild + reindex to main | The derived skill-graph regen needs `node_modules/dist` absent from the worktree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|-------|--------|
| Zero broken live references | PASS: repo-wide grep — 0 live refs to old flat `sk-code/{refs,assets,scripts}/` or `sk-code-review/` paths; only the intentional `zzz-fake-surface` validator fixture (×2) remains; deleted `graph-metadata.json` left unmapped by design |
| Pre-commit gate restored | PASS: `CHECKER` → `code-quality/scripts/check-comment-hygiene.sh` (exists) |
| PostToolUse + CI | PASS: `.claude/settings.json` hook + `comment-hygiene.yml`/`rule-canary-sync.yml` repointed to existing paths |
| Hub advisor node | PASS: valid JSON; 0 `sk-code-review` edges; `deep-loop-workflows` prerequisite present; review domains/intent_signals merged; alias trigger-phrase retained |
| Ground-truth mapping | PASS: 170 rename pairs + 2 explicit + derived dirs; every target existence-validated |
| test.sh depth | PASS: REPO_ROOT `../../../..` → `../../../../..` |
| Scope safety | PASS: fixtures + archives untouched; alias preserved; no package leak |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:lessons -->
## Lessons
A completion claim is only as good as the surface it verified. The 004 phase verified internal links but not external references *into* the moved paths, so a load-bearing gate silently broke and the symptom was mis-attributed as pre-existing for two phases. The fix: enumerate inbound references, treat the "finding" (a warning) as a hypothesis and confirm it against the real file state, and repoint deterministically from recorded renames rather than trusting per-file path inference.
<!-- /ANCHOR:lessons -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
1. **Advisor-graph rebuild + memory reindex are deferred to main.** The node sources are edited; the derived `skill-graph.json` regen and corpus reindex run post-merge (needs dist; DB snapshot first).
2. **Alias-covered NAME references remain on the alias.** Agent prose contracts and the speckit `baseline:` config still name `sk-code-review`; they resolve via the alias and are repointed in 009 with alias removal.
3. **Compiled validation not run in the worktree.** `validate.sh --recursive` runs on main post-merge; this phase's verification is deterministic grep + on-disk existence + JSON validity. *(Corrected in the 009 review pass: `parent-skill-check.cjs` was mislabeled main-side here — it runs on bare node. When first run against the hub it failed 10 invariants, as did the reference hub sk-design; the validator's canonical-only taxonomy was the defect and was canonical-scoped in 009. All three hubs now pass in-branch.)*
4. **Two intentional test fixtures retain old-shaped paths** (`zzz-fake-surface`) — synthetic validator setup, not references to real files.
5. **The "zero broken live references" claim was too narrow** *(correction recorded by the 009 review)*: the residual grep's trailing-slash pattern missed two slashless live references to the deleted directory — `deep-review/.../setup-cp-sandbox.sh` (`require_path`/`copy_dir`, broken at runtime) and a `skills/README.md` link. Both found and fixed in 009. Lesson: dir-deletion sweeps must also grep the slashless dir name.
<!-- /ANCHOR:limitations -->
