---
title: "Implementation Summary: Compiled-Routing Feature Catalogs"
description: "Delivered-state record for the seven-hub compiled-routing catalog coverage: Option A shipped — 6 new hub-root catalogs, 12 hub-architecture/compiled-routing leaves, sk-design's extension leaf, and the two canonical-surface extensions. Uncommitted in the worktree pending operator review."
trigger_phrases:
  - "compiled routing catalogs implementation summary"
  - "feature catalog topology current status"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Compiled-Routing Feature Catalogs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — uncommitted (dispatcher instruction: do not commit) |
| **Date** | 2026-07-21 |
| **Level** | 2 |
| **Implementation** | Complete: 19 new files, 3 files extended |
| **Current catalog coverage** | All 7 eligible hubs now have a hub-root `feature-catalog.md` (6 newly authored; `sk-design` pre-existing, extended) and a `compiled-routing-and-legacy-fallback.md` leaf |
| **Strict validation** | Every catalog file validated via `create-feature-catalog`'s own validators (22/22 pass); folder-level `validate.sh --strict` deferred to the operator's commit-time pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Topology: Option A** (6 new hub-root catalogs + one compiled-routing leaf per all 7 hubs), not Option B. Rationale: (1) this packet's own `spec.md` Files-to-Change table and `tasks.md` T007-T014 were structured around Option A as the primary path, with Option B named only as a fallback; (2) six of seven eligible hubs had zero feature-catalog discoverability entry point at all, not only a missing compiled-routing doc — Option A closes that independently-valuable gap as a byproduct, matching `CF-CAT-1`'s framing that the root-catalog gap is the actual defect; (3) `sk-design` (the one hub that already has a root catalog) demonstrates the intended shape is lean and hub-level, not an exhaustive per-child-mode inventory, keeping Option A's effort proportionate to the Level-2/Med-effort estimate in `plan.md`; (4) `spec.md`'s own stated worry about Option B — "keeps `advisor-recommend.md` from becoming the single point of documentation for an unrelated concern" — signals the plan author saw centralization as trading one coupling problem for another, since each hub already independently states its own compiled-routing directive in its own `SKILL.md`.

Each of the 6 previously-catalog-less hubs got a root catalog with exactly 2 H2 categories — the hub's own existing registry-driven routing architecture (satisfying REQ-002/SC-002: never a single-feature pseudo-catalog) and compiled routing — each backed by a real per-feature leaf file, never prose-only.

### Delivered Files (19 new, 3 extended)

| Area | Files | Purpose |
|------|-------|---------|
| New hub-root catalogs | `{sk-code,mcp-tooling,system-deep-loop,cli-external-orchestration,sk-prompt,sk-doc}/feature-catalog/feature-catalog.md` (6) | Canonical, discoverable per-hub feature inventory (previously absent) |
| New hub-architecture leaves | one per new-catalog hub, e.g. `sk-code/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md` (6) | The hub's own registry-driven routing mechanism — the "not only routing" second feature |
| New compiled-routing leaves | `<hub>/feature-catalog/compiled-routing-and-legacy-fallback/compiled-routing-and-legacy-fallback.md` (7, all hubs incl. `sk-design`) | Resolution order, tri-state flag, outcome handling, serving-status/drift |
| `sk-design` extension | `feature-catalog.md` (edit: +1 H3 under MANAGER SHELL, version 1.2.0.0→1.3.0.0) | Section extension per REQ-007, not a rewritten root |
| Governance extension | `system-spec-kit/feature-catalog/governance/feature-flag-governance.md` (edit) | New `### Compiled-Routing Flag` H3: phased defaults, eligibility, serving status, drift, explicit `=0` |
| Advisor-schema extension | `system-skill-advisor/feature-catalog/mcp-surface/advisor-recommend.md` (edit) | New `### Compiled-Routing Enrichment` H3: when `compiledRoute` is attached vs. intentionally absent |

No runtime, router, manifest, or scorer file was touched. `git status --porcelain .opencode/skills` shows only Markdown under `feature-catalog/` trees plus the two named canonical-surface files.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Verified `002`/`003` were actually live at durable `.opencode/bin/**` paths by reading the runtime code directly (`resolve.cjs`, `compiled-route.cjs`, `compiled-route-status.cjs`, `compiled-routing-flag.ts`, `advisor-recommend.ts`) and `git log`, rather than trusting `002`/`003`'s own `implementation-summary.md` files, which still read "Planned/not started" — a stale-docs-vs-live-code mismatch (see Known Limitations). Re-verified the hub-root catalog inventory against the live tree (matched `spec.md`'s snapshot exactly). Resolved the topology decision (Option A) before authoring any file. Extended the two canonical surfaces first, then authored the 6 root catalogs and their leaves (using a Python template for the 5 near-identical compiled-routing leaves after catching and fixing a relative-link depth error in the first hand-authored one), then extended `sk-design`. Verified every file against the actual current `SKILL.md` directive wording and the actual current advisor-recommend.ts/compiled-routing-flag.ts source, not against the (partly outdated) line-number citations in `spec.md`/`synthesis-v1.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Topology: Option A | See rationale paragraph above — spec/tasks structure, independent root-catalog-gap value, proportionate effort matching `sk-design` precedent, and avoiding Option B's own unrelated-surface coupling. |
| Each new hub-root catalog gets exactly 2 categories, not an exhaustive inventory | Satisfies REQ-002/SC-002 genuinely (2 real, distinct, per-feature-file-backed features) without fabricating a large multi-feature inventory beyond what this packet's scope and evidence support; matches `sk-design`'s own precedent of documenting hub-level shell/routing behavior, not child-mode internals. |
| Category-folder name equals per-feature filename for single-feature categories | Matches the majority existing convention (e.g. `mcp-figma/feature-catalog/export/export.md`) rather than inventing a new pattern. |
| Cite current source (line numbers, function names) over `spec.md`'s pre-002/003 citations | `advisor-recommend.ts` grew from a `:362`-cited bi-state gate to a tri-state `enrichCompiledRoutes()`/`compiledRouteForRecommendation()` pair (lines 329-399) between `spec.md`'s authoring and this implementation pass; citing the verified-current anchors keeps the catalog accurate rather than reproducing a now-stale line number. |
| Do not hardcode manifest hash/generation values | Every hub's activation manifest already reports `servingAuthority: "compiled"`, but the effective-policy-hash and generation are exactly the kind of per-build values that would go stale immediately; catalogs cite the stable mechanism and current qualitative state, not literal hash values. |
| Reconcile this folder's own `tasks.md`/`checklist.md`/`implementation-summary.md` to Implemented | Explicitly in-scope ("your 006 folder"); required by the completion-verification rule so this packet's own docs do not claim "Planned/not started" beside 22 real, validated files. `spec.md`/`plan.md` left as the approved requirements/approach record. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Frozen-scorer byte-identity (`router-replay.cjs`, `load-playbook-scenarios.cjs`, `score-skill-benchmark.cjs`) | **PASS** — SHA-256 identical before/after for all 3 files |
| Path-citation hygiene (zero `.opencode/specs/**`) | **PASS** — `grep -n "\.opencode/specs"` across all 22 files → 0 hits |
| `validate_document.py` on all 22 files | **PASS** — 22/22 `✅ VALID`, 0 issues each (7 `readme` root catalogs, 15 `feature_catalog` leaves) |
| `extract_structure.py` on all 7 root catalogs | **PASS** — exit 0, all 7 |
| `check_no_hyphenated_catalog_content.py` on all 7 hub `feature-catalog/` roots | **PASS** — all 7 |
| `check_no_numbered_categories.py` / `check_no_numbered_snippet_files.py` | **PASS** — no numbered folders/files across all 7 hubs |
| `check_no_new_snake_case.py --changed-since HEAD` | **PASS** — no newly introduced snake_case names |
| Independent relative-link resolution (own script, 84 links across 22 files) | **PASS** — 0 broken |
| Repo `check-markdown-links.cjs` (6829 files / 11072 links) | **PASS for my scope** — 94 pre-existing broken links repo-wide, 0 under any of my 22 paths |
| Child-mode boundary (`git status --porcelain` on 19 child-mode `feature-catalog/` dirs) | **PASS** — empty, nothing touched |
| `git status` scope (only intended doc files) | **PASS** — `.opencode/skills` diff is only the 19 new + 3 edited catalog files, plus 2 pre-existing-unrelated concurrent edits to `create-feature-catalog/assets/*template.md` (not made by this work; confirmed via diff — unrelated trigger-phrase/test-type wording) |
| Strict spec-folder validation (`validate.sh --strict`) | **Deferred to operator** — dispatcher instruction was "do NOT commit"; the actual deliverable (catalog files) is fully validated above |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`002`/`003`'s own `implementation-summary.md` files are stale.** They read "Planned — no runtime implementation started" while the runtime is actually live, committed (`4153cbebd8`, `a1cdb65d90`), and consumed by `advisor_recommend`. This packet verified the real code/git state directly rather than trusting those docs, per the Logic-Sync protocol, but did not correct `002`/`003`'s own docs — out of this packet's scope (`002`/`003` are sibling children, not owned by 006). Flagging for the dispatcher/operator to reconcile.
2. **Two files under `sk-doc/create-feature-catalog/assets/` show as modified but were not edited by this work.** `feature-catalog-template.md` and `feature-catalog-snippet-template.md` carry small, unrelated diffs (trigger-phrase doc-trigger-harvest wording; a `{TEST_TYPE}` taxonomy placeholder) present in the worktree before/independent of this session — confirmed via `git diff` inspection. Not reverted, since reverting another concurrent session's apparently-legitimate edit would itself be a scope violation.
3. **Two pre-existing dirty files in `.opencode/specs/`** (`mcp-tooling/008-mcp-aside/001-research/research/research.md`, `system-deep-loop/032-deep-alignment-mode/013-review-remediation/decision-record.md`) were already modified in this worktree before this session started (confirmed by the first `git status` call of this session) — unrelated to this packet, not touched further.
4. **The per-hub leaf filename convention is this packet's choice, not independently re-evidenced beyond `sk-design`.** `compiled-routing-and-legacy-fallback.md` was directly evidenced only for `sk-design` in research; applying it fleet-wide (and choosing the category-folder-equals-filename shape) is this packet's consistency decision, stated explicitly.
5. **The P4 wording rewrite is owned elsewhere.** This packet's leaves state the opt-in/pre-cutover wording matching each hub's current `SKILL.md`; `../011-activation-cutover-p4/` owns the future atomic rewrite to default-on + kill-switch wording, gated on that hub's own parity/serving-status/fallback/rollback checks.
6. **Not committed.** Per explicit dispatcher instruction; all 22 files exist only in this worktree pending operator review.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Operator: review and commit (or request changes) — this pass deliberately did not commit.
- [ ] Operator: reconcile `002`/`003`'s own stale "Planned" `implementation-summary.md` docs against their actually-shipped runtime state.
- [ ] Operator: confirm the two unrelated concurrent edits under `create-feature-catalog/assets/` are intentional (another session's work) before committing this packet's changes alongside them, or split them into separate commits.
- [ ] `../011-activation-cutover-p4/`: when a hub reaches its P4 gate, rewrite that hub's `compiled-routing-and-legacy-fallback.md` wording from opt-in/pre-cutover to default-on + explicit-`=0`-kill-switch, matching that hub's own `SKILL.md` directive flip.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` at commit time (deferred here per no-commit instruction).
- [ ] Let the parent workflow refresh `description.json`/`graph-metadata.json` for this spec folder at the next memory-save pass; this authoring pass did not run `generate-context.js`.
<!-- /ANCHOR:follow-up -->

---

<!-- ANCHOR:deviations -->
## Deviations From Plan

- **Citation currency over `spec.md`'s exact line numbers.** `spec.md` cited `advisor-recommend.ts:41-49` (`COMPILED_ROUTING_HUBS`) and `:362` (the flag gate) from research snapshotted before `002`/`003` landed. The live file has since grown to 594 lines with the set moved to `lib/compiled-routing-flag.ts` and the gate now living in `enrichCompiledRoutes()`/`compiledRouteForRecommendation()` (lines 329-399). Catalogs cite the current, re-verified anchors rather than reproducing the stale line numbers — consistent with REQ-006's durable-citation intent, not a deviation from it.
- **No Option B artifacts.** Per REQ-001, only the chosen option's files were authored; no centralized `system-skill-advisor` entry was created since Option A was chosen.
<!-- /ANCHOR:deviations -->
