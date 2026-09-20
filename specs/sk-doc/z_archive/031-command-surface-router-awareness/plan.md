---
title: "Remediation Plan: Command-Surface Root ROUTER.md Awareness"
description: "Four-phase remediation plan for the six audit gaps: CI fleet-gate hardening, doctor fleet sweep, documentation citation cleanup, and the deferrable template rename."
trigger_phrases:
  - "router awareness remediation plan"
  - "ci fleet gate hardening plan"
  - "router md remediation phases"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

# Remediation Plan: Command-Surface Root `ROUTER.md` Awareness

<!-- ANCHOR:approach -->
## 1. APPROACH

Fix the enforcement surfaces before the cosmetics. The two HIGH functional gaps (GAP-1, GAP-2) are the same failure class — the fleet CI gate cannot see or is not triggered by root `ROUTER.md` — so they land together in Phase 1 and make the CI gate authoritative and non-bypassable. Phase 2 folds the same contract into the operator-facing `/doctor` surface. Phase 3 is a mechanical documentation pass with zero code risk and no dependency on Phases 1–2. Phase 4 is cosmetic and explicitly deferrable.

**Executor:** implementation routes to deepseek/luna (operator directive). Each task below is self-contained (exact file, exact change, exact verification) so a fresh executor needs no prior context. Every fix is drawn from the frozen audit evidence in `research/lineages/dsflashgo/research.md`.

**Sequencing:** Phase 1 → Phase 2 (Phase 2 reuses the contract wiring Phase 1 proves). Phase 3 is independent and may run in parallel with Phase 1/2. Phase 4 last, or skip.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Title | Gaps | Sev | Depends on | Blast radius |
|-------|-------|------|-----|-----------|--------------|
| 1 | CI fleet-gate hardening | GAP-1, GAP-2 | HIGH | — | CI workflow + fleet gate script (every push) |
| 2 | Doctor fleet-ROUTER sweep | GAP-3 | MED | Phase 1 | one `/doctor` route |
| 3 | Documentation citation cleanup | GAP-4, GAP-5, GAP-6 | MED/LOW | — (parallelizable) | 3 doc files across 3 skills |
| 4 | Cosmetic template rename (optional) | GAP-7 | LOW | — | 1 template + ~9 cross-refs |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:phases -->
## 3. PHASES

### Phase 1 — CI fleet-gate hardening (GAP-1 + GAP-2)

**Goal:** a malformed / missing / dual-source hub `ROUTER.md` fails CI, and editing a `ROUTER.md` triggers that CI.

**GAP-1 — trigger paths.** File `.github/workflows/routing-registry-drift.yml`. The parent-skill job already glob-enrolls the 7 `mode-registry.json` hubs and runs `parent-skill-check.cjs` (which runs the ROUTER.md two-state check 12), but `ROUTER.md` is absent from the `push` and `pull_request` `paths:` blocks. Add `.opencode/skills/*/ROUTER.md` to **both** blocks.

**GAP-2 — fleet gate is ROUTER-blind.** Files `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` (fleet "every root" gate; verified 0 ROUTER / 0 root-router-contract references) and its contract `scripts/lib/skill-root-metadata-contract.cjs` (`CLASS_HUB = 'H'`). In the class-H branch, require and validate the root `ROUTER.md` by calling the existing `scripts/lib/root-router-contract.cjs` (reuse the frozen RRC codes — do **not** author a parallel validator). A class-H root that is missing `ROUTER.md`, or whose `ROUTER.md` fails the two-state / dual-source / legacy-default-residue checks, must make the fleet gate exit non-zero.

**Verification:** add `.opencode/skills/*/ROUTER.md` present in both `paths:` lists (grep); run `ci-skill-root-metadata.cjs` against the 7 real hubs → exit 0; run it against a deliberately-broken fixture hub (missing or `router_state:`-corrupted ROUTER.md) → exit non-zero with an RRC code. YAML parses cleanly.

### Phase 2 — Doctor fleet-ROUTER sweep (GAP-3)

**Goal:** one `/doctor` invocation reports the ROUTER.md contract state for all seven hubs.

Files `.opencode/commands/doctor/_routes.yaml` (parent-skill route) and `.opencode/commands/doctor/assets/doctor-parent-skill.yaml`. Today the route runs the fleet metadata gate then `parent-skill-check.cjs` against **one** named directory. Choose one:
- (recommended, least new surface) extend the `parent-skill` route to loop the per-hub check over every `mode-registry.json`-bearing hub, mirroring the CI glob-enrollment; or
- add a dedicated fleet-ROUTER sweep route that runs `root-router-contract.cjs` over every discovered hub.

**Verification:** the chosen `/doctor` route enumerates all 7 hubs and prints each `router_state`; a broken fixture hub is reported as failing.

### Phase 3 — Documentation citation cleanup (GAP-4 + GAP-5 + GAP-6)

**Goal:** no doc points at the relocated `smart-routing.md`.

- **GAP-4** `.opencode/skills/sk-code/shared/references/phase-detection.md:40` and `:110` — two links to `./smart-routing.md` (target does not exist; content moved to `sk-code/ROUTER.md`). Repoint both to `../ROUTER.md` or drop the rows.
- **GAP-5** `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-adapter.md:123,255,263,286` and `sk-code-known-deviations.md:125,230-231` — rewrite `smart-routing.md §N` citations to `sk-code/ROUTER.md §…` (the machine block is preserved verbatim in ROUTER.md).
- **GAP-6** deep-review playbook `invalid-or-contradictory-review-state-halts-for-repair.md:76` and `resume-classification-from-valid-prior-review-state.md:77` — replace the non-existent `ANCHOR:smart-routing` reference with deep-review's real SKILL.md anchor, or drop it.

**Verification:** `grep -rn "smart-routing.md" .opencode/skills` returns only legitimate legacy-rejection/migration/test/template hits; the three cited files have no dead links; any repointed target exists on disk.

### Phase 4 — Cosmetic template rename (GAP-7, optional/deferrable)

**Goal:** remove the last legacy filename residue.

Rename `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-smart-routing-template.md` → `parent-skill-root-router-template.md` and update its ~9 cross-references (create-skill-parent auto/confirm YAMLs, `parent-skill-hub-template.md`, `parent-hub-router-schema.md`, `parent-skills-nested-packets.md`, `skill-smart-router.md`, and the markdown agent in both runtime mirrors). Content is already correct — this is filename + links only.

**Verification:** the new filename resolves from every referencing file; no reference to the old filename remains; create-skill-parent still loads the template.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:out-of-scope -->
## 4. EXPLICITLY NOT DOING

- No changes to the seven hubs' `ROUTER.md` content, `hub-router.json`, `mode-registry.json`, or routing policy.
- No advisor-scope change for `ROUTER.md` (confirmed intentionally advisor-agnostic).
- No new validator library — GAP-2 and GAP-3 reuse `root-router-contract.cjs`.
<!-- /ANCHOR:out-of-scope -->
