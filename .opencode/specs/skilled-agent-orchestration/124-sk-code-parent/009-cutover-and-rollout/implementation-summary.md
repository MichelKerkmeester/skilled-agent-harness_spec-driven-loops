---
title: "Implementation Summary: cutover and rollout"
description: "The branch-side of the sk-code cutover — verified cleanup (harness-test migrations, vocab-sync generalization, CS-003 matcher, a 29-path smart_routing content-drift fix) plus two fold-broken live fixes — with the load-bearing cutover (sk-code-review alias removal, ~350 NAME-ref repoints, advisor scorer removal, skill-graph regen + reindex, version release) fully specified as an atomic main-side advisor-rebuild runbook, because the worktree lacks the compiled dist that step requires."
trigger_phrases:
  - "sk-code cutover and rollout"
  - "sk-code-review alias removal runbook"
  - "sk-code advisor-rebuild main-side"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/009-cutover-and-rollout"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Landed the branch-side cutover prep (verified cleanup + fold-fixes) and authored the atomic main-side advisor-rebuild + alias-removal rollout runbook"
    next_safe_action: "Merge the branch, then execute the main-side rollout runbook (§ Main-Side Rollout Runbook)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/shared/references/smart_routing.md"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs"
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
| **Spec Folder** | 009-cutover-and-rollout |
| **Completed** | 2026-07-04 (branch portion) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 009 is the cutover-and-rollout of the sk-code parent-skill conversion. It split into a **branch portion** (everything mergeable and verifiable in the worktree) and a **main-side rollout** (the load-bearing cutover, which requires the compiled `dist` toolchain the worktree lacks). This phase delivered the branch portion in full and produced a precise runbook for the main-side rollout.

### Branch portion (done + verified this phase)
1. **Three deferred cleanup items** (deferred here from 006/008):
   - **8 harness-test migrations** — flat-layout casualties in the deep-improvement skill-benchmark suite, migrated to the hub layout without weakening (suite went `8 failed → 1 failed`; the remaining failure is a stale sha256 fixture owned by the sk-design family, out of this packet's scope).
   - **`parent-hub-vocab-sync` generalization** — the check hard-coded the design family's mode prefixes; now derives them from each hub's own `mode-registry.json` `workflowMode`. sk-design output byte-identical (zero regression); sk-code false-orphans dropped 47→13.
   - **CS-003 substring matcher** — a bare `review` keyword matched inside `preview`, causing a false review-mode dispatch. Fixed with a narrow word-boundary guard for that keyword only (path/identifier keywords keep substring matching, so `javascript` still matches inside `2_javascript`). The real CS-003 scenario now routes to `implement` only; a genuine review task still routes to `review`.
2. **A 29-path content-drift fix** in `sk-code/shared/references/smart_routing.md` — the surface router's RESOURCE_MAP still pointed at pre-split locations (`references/webflow/debugging/*`, `assets/opencode/checklists/*`, etc.). All 29 repointed to the real relocated/renamed files; `0` dead paths remain. This also lifts the 008 benchmark's resource resolution.
3. **Two fold-broken live fixes** — `deep-review/.../setup-cp-sandbox.sh` (was `require_path`/`copy_dir` on the deleted `sk-code-review/` dir → repointed to `sk-code`) and a dead `skills/README.md` link to the folded skill (removed).

### Main-side rollout (specified, not executed — see the runbook below)
The load-bearing cutover — removing `sk-code-review` as a routing identity — is inseparable from regenerating the advisor graph and reindexing, all of which need the compiled `dist` that only exists on main. It is documented as one atomic advisor-rebuild.

### Files Changed (branch portion)
| Area | Action |
|------|--------|
| `skill-benchmark/tests/{sk-code-router-sync,playbook-mode,skill-benchmark}.vitest.ts` | Migrate 7 assertions to the hub layout (union surface router, packet-aware existence, count bumps, hub-mode intents) |
| `skill-benchmark/playbook-generator.cjs` | `analyzeCoverage()` merges the surface router's intents for a hub |
| `skill-benchmark/router-replay.cjs` | CS-003 word-boundary guard (`keywordHits`) at the two match sites |
| `skill-benchmark/parent-hub-vocab-sync.cjs` | Registry-derived mode prefixes (`buildModePrefixes`) |
| `sk-code/shared/references/smart_routing.md` | 29 drifted RESOURCE_MAP paths repointed (0 dead) |
| `deep-review/.../setup-cp-sandbox.sh`, `skills/README.md` | Fold-broken script + dead link fixed |
| `009-cutover-and-rollout/` | Phase docs + this runbook |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
Claude orchestrated three read-only investigation agents to map the cutover surface (alias references, version/changelog state, cleanup scoping), then executed the correctness-critical work directly and delegated the fully-derived harness migration to one implementation agent, verifying its `1 failed | 98 passed` result independently. Two blast-radius escalations were raised and resolved by the user: (1) the alias also lives in the production advisor scorer with coupled regression corpora → "full removal in-worktree"; (2) then the graph regen proved **hard-blocked** in the worktree (the compiler fails validation on another skill's un-built dist paths) and the TS scorer can't load (`@spec-kit/shared` unbuilt) → "stage the advisor-rebuild for main." The NAME-ref repoints were folded into that main-side bundle to keep the cutover atomic and avoid a confusing half-repointed state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:runbook -->
## Main-Side Rollout Runbook (execute post-merge, on `main`)

Run in order. Each step is verifiable on main where `dist` exists.

1. **Build the toolchain.** `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` (and the advisor's own build) so `@spec-kit/shared`, `tsx`, and the `dist` artifacts resolve.
2. **Remove `sk-code-review` from the advisor scorer source** (TS + Python mirror, kept in parity):
   - `system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` — TOKEN_BOOSTS (`audit`, `findings`, `pr`, `regression`, `review`) and PHRASE_BOOSTS (`code review`, `review the …`, `audit packet docs`, `list any mismatches`, `pull request`, etc.), and the disambiguation rules (`review-plus-write`, `iterative-review-vs-pr`, `ambiguous-code-problem`). Redirect review capability to `sk-code`; preserve every cross-skill effect (e.g. the `sk-doc -0.4`, `sk-git` legs).
   - `lib/scorer/lanes/lexical.ts:29` — remove the `sk-code-review` keyword row.
   - `lib/scorer/fusion.ts` — the branches keyed on `recommendation.skill === 'sk-code-review'` become inert; retarget the deep-review / code-audit disambiguations to `sk-code` and remove the dead ones.
   - `lib/scorer/scoring-constants.ts` — drop `deepReviewSkCodeReviewPenalty` and siblings once unreferenced.
   - `scripts/skill_advisor.py` — the Python mirror (56 occurrences across the same tables); keep it identical to the TS so the parity test passes.
3. **Delete the 4 alias-definition sites** (only after step 2, so nothing scores an unresolvable name): `sk-code/mode-registry.json` (`review.aliases`), `sk-code/hub-router.json` (`vocabularyClasses.review-aliases.keywords`), `sk-code/graph-metadata.json` (`derived.trigger_phrases`), `sk-code/code-review/README.md` (`trigger_phrases`).
4. **Repoint the ~350 alias-covered NAME references** (map in `009` `plan.md`): agent prose (`.claude`/`.opencode` `code.md`/`review.md`/`orchestrate.md`/`deep-review.md`), speckit `baseline:` config (4 YAML files), install guides, deep-review skill docs, sk-code family docs, sk-design/sk-git cross-refs, root `README.md`, advisor docs. Exclude `changelog/`, `.opencode/specs/`, and test fixtures.
5. **Rebaseline the coupled advisor corpora** against the rebuilt scorer's real output: `scripts/fixtures/skill_advisor_regression_cases.jsonl`, `scripts/routing-accuracy/labeled-prompts.jsonl`, `tests/scorer/fixtures/*intent-prompt-corpus.ts`, `tests/parity/fixtures/local-native-approved-divergences.json`, `tests/python/test_skill_advisor.py`, and the `manual_testing_playbook/` captured outputs (re-capture, don't hand-edit).
6. **Regenerate the graph + reindex.** `python3 system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py --export-json` (drops the node → skill_count 19→18), then the SQLite/native reindex and the memory corpus reindex.
7. **Version release.** Bump the hub `sk-code` `SKILL.md` (4.0.0.0 → next), reconcile `code-review` above its legacy changelog ceiling (frontmatter `1.0.0.0` vs changelog `1.5.0.0`), create the 4 missing mode-packet changelogs (`code-implement`/`code-quality`/`code-debug`/`code-verify` at their current `1.0.0.1`), and add hub-changelog per-packet symlinks mirroring sk-design.
8. **Verify.** Advisor TS vitest (scorer + parity) green; `python3 skill_advisor.py "code review this PR"` → `sk-code`, no `sk-code-review`; `parent-skill-check.cjs` passes; `validate.sh --recursive` on the parent; re-run the router-mode benchmark (expect a lift from the smart_routing fix); repo-wide grep shows `0` live `sk-code-review` references outside archives/fixtures.
<!-- /ANCHOR:runbook -->

---

<!-- ANCHOR:verification -->
## Verification (branch portion)
| Check | Result |
|-------|--------|
| Harness suite | PASS: `1 failed | 98 passed (99)` — 7 sk-code failures migrated; the 1 remaining is a sk-design-owned stale digest (out of scope) |
| CS-003 | PASS: real scenario routes `[implement]` (was `[implement, review]`); genuine-review control still `[review]` |
| vocab-sync | PASS: registry-derived; sk-design byte-identical; sk-code orphans 47→13 |
| smart_routing drift | PASS: 29 paths repointed, `0` dead of 96 |
| Fold-broken fixes | PASS: `setup-cp-sandbox.sh` syntax clean + paths resolve; dead README link removed |
| Cross-suite regression | PASS: only net change is the intended migrations; no new failures introduced |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:lessons -->
## Lessons
The environment decides the seam. A "cutover" that looks like editing config files was really a retune of ~100 calibrated scoring entries across two mirrored scorer implementations plus graph regeneration and corpus rebaselining — none of which can run or be verified in a worktree that lacks the compiled `dist`. Writing that blind would have shipped unverifiable production-routing changes. Splitting the phase at the verifiability seam — everything testable in the branch, the atomic advisor-rebuild on main — is honest and keeps the routing safe. The alias staying a working shim until the rebuild lands is a feature, not debt.
<!-- /ANCHOR:lessons -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
1. **The load-bearing cutover is not executed in the branch** — it runs post-merge via the runbook above. Until then, `sk-code-review` remains a working back-compat alias.
2. **The TS advisor scorer edits are unverifiable in the worktree** (`@spec-kit/shared` unbuilt) — they are staged, not made, and get their first real test on main.
3. **One harness failure remains** (`design-dispatch-boundary-proof`) — a stale sha256 fixture owned by the sk-design D3-R12 feature; track under sk-design's scope.
4. **Version/changelog bumps are deferred to the main release** (step 7) rather than pre-applied in the branch, so the release version reflects the actual cutover.
<!-- /ANCHOR:limitations -->
