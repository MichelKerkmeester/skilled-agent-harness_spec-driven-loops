---
title: "Implementation Summary: Phase 2: Baseline and routing correctness"
description: "A recorded baseline for every routing gate, six routing-correctness fixes with no shape change, and a rerun that shows no gate got worse."
trigger_phrases:
  - "baseline and routing correctness implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/002-baseline-and-routing-correctness"
    last_updated_at: "2026-10-28T09:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Recorded the baseline, fixed six routing defects, regenerated derived files and reran every gate"
    next_safe_action: "Start phase 003: routing canon and tooling"
    blockers: []
    key_files:
      - "scratch/baseline.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which router-reach phrases are reachable today? All of them: see scratch/baseline.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 2: Baseline and routing correctness

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-baseline-and-routing-correctness |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Later phases now have numbers to measure against, and six routing defects the research found are gone. `scratch/baseline.md` records every gate's exit status and result line from before the first edit, plus the two drift recounts the research left unconfirmed. `scratch/after.md` records the rerun.

### The fixes

Each fix closes a finding in `../001-deep-research/research/research.md` §5.

| Fix | Where | Research finding |
|-----|-------|------------------|
| The §2 intent table lists the same twelve intents as the §9 machine block | `.skilled/skills/sk-code/ROUTER.md:59-63`, `:88` | 1 |
| The `OBSIDIAN` stage-two intent carries `health` and `health-md`, which stage one already routes to mcp-obsidian | `.skilled/skills/mcp-tooling/ROUTER.md:97` | 8 |
| Discovery roots match the hyphenated folders and include `hooks` | `.skilled/skills/system-skill-advisor/SKILL.md:104-110` | 10 |
| `hooks/` is a leaf root, so the `HOOK` leaf is in the manifest | `.skilled/skills/system-skill-advisor/leaf-manifest.config.json:4`, `leaf-manifest.json`, `leaf-aliases.json` | 11 |
| The shared router counts seven cli siblings and names cli-hermes | `.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md:3`, `:17`, `:25` | 12 |
| The hub no longer names benchmarks as a consumer of the machine block | `.skilled/skills/cli-external-orchestration/SKILL.md:75` | 13 |
| cli-jev loads its baseline only on a scored route, as its hub does | `.skilled/skills/cli-classifier/cli-jev/SKILL.md:104`, `:115`, `:211` | The phase 001 plan row "cli-jev default semantics" (devin lineage finding on `cli-jev/SKILL.md:115`) |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| The seven files in the table above | Modified | The fixes |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs:58`, `generate-leaf-manifest.cjs:253` | Modified | Admit `hooks` as a standalone leaf root |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` | Modified | A test that fails on the old contract |
| Seven `changelog/v*.md` entries and their version carriers | Created, modified | sk-code 3.9.17.0, mcp-tooling 1.8.8.0, cli-external-orchestration 1.7.7.0, cli-jev 0.1.7.0, system-spec-kit 2.12.17.0, system-skill-advisor 0.17.19.0, sk-create-skill 1.5.13.0 |
| Five compiled-route manifests, runtime and authored copies | Regenerated | cli-classifier, cli-external-orchestration, mcp-tooling, sk-code, sk-doc |
| Seven `.hermes/skills/*/SKILL.md` copies | Regenerated | Mirror of the changed `SKILL.md` files |
| `scratch/baseline.md`, `scratch/after.md` | Created | The gate record |
| `../003-routing-canon-and-tooling/`, `../010-prose-clarity-pass/` spec, plan, tasks and acceptance criteria, and `../spec.md` | Modified | The operator's scope amendment for sk-create-skill, described below |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the baseline, wrote one short brief per change and checked each result. DeepSeek V4.1 Flash Max through cli-devin and GPT-6.1 Terra at high effort through cli-codex made the skill-file edits and wrote the changelog entries, in parallel on disjoint files. cli-pi was not used because Pi failed to start in worktrees that day. The orchestrator diffed every worker's files, reran its verify command and then reran the whole gate set.

The same commit carries a scope amendment the operator asked for during the run: sk-create-skill must produce the new routing shape by default and reject the old one (phase 003), and must write new skills to the clarity rules with the human-voice check in its default flow (phase 010). Only those phases' docs changed. No code changed for it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Widen the leaf contract to admit `hooks/` | The HOOK leaf cannot be in the manifest without it. The contract's own comment calls a new root backward-compatible, and no existing manifest changed. The two script files were outside this phase's Files to Change, so this is a recorded deviation. |
| Edit sk-code `ROUTER.md` §2, not §9 | §9 is what routes. Changing §2 to match it leaves routing behavior as it was. |
| Add only `health` and `health-md` to `OBSIDIAN` | They are the two terms the research confirmed. The other 27 stage-one terms with no stage-two intent are vocabulary consolidation, which phase 004 owns. |
| Align cli-jev with its hub rather than the reverse | The hub `ROUTER.md` is the live authority for the first leaf slice (research §5, decision D4). |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| parent-skill-check, all 7 hubs | PASS before and after |
| verify-router-sync | PASS, 5/5, before and after |
| compiled-route-guard `--json` | PASS, 7 fresh, after re-minting 5 hubs |
| package_skill `--strict`, 14 roots | PASS before and after |
| check-rule-copies | PASS before and after |
| Router reach | PASS, same counts before and after |
| Hermes `--check` | PASS, 67 in sync, after the sync |
| sk-code setup battery | PASS, 9 legs, before and after |
| skill-root metadata and leaf-manifest freshness | PASS, 14/14, before and after |
| Router-sync and router-replay tests | PASS, 40/40, before and after |
| New leaf-contract test | Fails on the old contract, passes on the new one |
| `validate.sh --recursive --strict` on the program | PASS for every folder |

Detail, commands and the intermediate failures are in `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `hooks/` leaf root walks every file under it.** The system-skill-advisor manifest gained 14 leaves, including the hook source files (`.ts`, `.py`, `.json`), because a standalone manifest walks whole roots. Only `hooks/skill-advisor-hook.md` is routed. Phase 009 can narrow it if a leaf-scope file is added for standalone skills.
2. **Most stage-one terms still have no stage-two intent.** mcp-tooling has 62 left and cli-external-orchestration 36 (`scratch/baseline.md` §2). Phase 004 owns them.
3. **sk-code `ROUTER.md` §4 still has a `LANGUAGE_STANDARDS` row** in its intent overlay. It was outside the §2 and §9 fix. Phase 005 rewrites that hub.
<!-- /ANCHOR:limitations -->

---
