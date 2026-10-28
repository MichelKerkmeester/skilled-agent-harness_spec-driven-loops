---
title: "Implementation Summary: Phase 4: Single vocabulary source per hub"
description: "hub-router.json is each hub's one authored mode vocabulary; a new check fails when a registry alias, a root ROUTER.md intent or a packet Keyword triggers line disagrees with it, and every hub's copies now agree."
trigger_phrases:
  - "single vocabulary source per hub implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/004-single-vocabulary-source"
    last_updated_at: "2026-10-28T16:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Added the vocabulary check and closed all drift"
    next_safe_action: "Conductor review and landing"
    blockers: []
    key_files:
      - "scratch/baseline.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should sk-doc's Keyword triggers lines generate hub-router.json, or the reverse? Neither generates the other: hub-router.json is authored and the lines are checked against it, because no code reads the lines and a line cannot carry a mode's full vocabulary."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 4: Single vocabulary source per hub

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-single-vocabulary-source |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every parent hub now has one authored mode vocabulary, `hub-router.json` `vocabularyClasses`, and a check that fails when any copy disagrees with it. All seven hubs pass it.

### The check

`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs`, read-only, with three legs per hub:

| Leg | Copy | Fails when |
|-----|------|-----------|
| alias | `mode-registry.json` `modes[].aliases` | an alias is not in its mode's authored vocabulary |
| stage-two | root `ROUTER.md` `INTENT_SIGNALS` | a term stage one routes to a mode is carried by no intent whose `RESOURCE_MAP` paths sit in that mode's packet |
| triggers | each packet's `Keyword triggers:` line | a backticked term is not in the vocabulary of the mode(s) that own the packet |

sk-code is exempt from the stage-two leg only, by a named constant in the script. Its `ROUTER.md` is a weight-1 surface and phase router: every route loads `DEFAULT_RESOURCE` and its intents mix packets. verify-router-sync owns its mode-to-leaf agreement. The fourth copy, `graph-metadata.json` `intent_signals`, already had its own gate: `generate-router-intent-signals.cjs --check`, wired into pre-commit and CI, fails when a multi-word `ROUTER.md` phrase is missing from the graph.

The check runs in `.github/workflows/routing-registry-drift.yml` next to the intent-signal carry step. parent-skill-check's 5k alias leg also lost its warn-only list: four hubs were listed there with no remaining drift.

### Drift closed

| Hub | Stage-two terms added to `ROUTER.md` | Vocabulary terms added to `hub-router.json` | Terms removed from the vocabulary and every copy | Trigger-line terms removed |
|-----|----|----|----|----|
| cli-classifier | 13 | 0 | 0 | 0 |
| cli-external-orchestration | 34 of 36 | 0 | 2 (`spec kit runtime`, `spec kit memory`) | 0 |
| mcp-tooling | 59 of 62 | 0 | 3 (`design tokens`, `task list`, alias `dom inspect`) | 0 |
| sk-code | exempt | 2 (sk-code-quality) | 0 | 8 (sk-code-quality) |
| sk-design | 55 | 11 (diagram 9, chart 2) | 0 | 4 (diagram 2, chart 2) |
| sk-doc | 89 | 17 (the phase 002 count) | 1 (alias `mcp bake-off`) | 3 (quality-control 2, benchmark 1) |
| system-deep-loop | 13 | 0 | 0 | 0 |

The 62, 36 and 17 from phase 002 are all closed: each term is either carried into stage two (or into `hub-router.json`) or removed from the hub. `docx diff` used to `defer` on sk-doc and now routes to sk-create-diff. `/create:skill` and `/create:skill-parent` each route to their own mode without a tie.

### Other changes

- `sk-doc/SKILL.md` no longer calls the packet `Keyword triggers:` lines the source of truth. That edit stayed on its single line, so the SMART ROUTING line count is unchanged.
- `graph-metadata.json` `intent_signals` gained the 157 multi-word phrases the generator carries up from the new `ROUTER.md` terms (162 written, 5 pruned with the removals).
- `router-reach-allowlist.json` gained six two-hub ownership disputes, each pinning both hubs.
- All seven compiled routes were re-minted. The Hermes copies and `skill-graph.json` were regenerated.
- There are 13 changelog entries with every version carrier stepped: seven hubs, plus sk-code-quality, sk-design-diagram, sk-design-chart, sk-create-quality-control, sk-create-benchmark and sk-create-skill.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator measured the drift with a scratch script first, so each hub worker got an exact term list and a verify command. Every repository edit was made by DeepSeek V4.1 Flash Max through cli-devin: one checker worker, nine hub workers in parallel on disjoint files, four follow-up workers, five fix workers after the interim gate run, and 13 changelog workers. The orchestrator diffed each result and reran its verify command. It also checked that no `ROUTER.md` keyword was lost and that every addition count matched the plan. Then it ran the regenerations and the whole gate set three times. The interim run surfaced three regressions, which were fixed. The second run was clean. After phase 003 landed, the branch was rebased onto origin/main, provisioned and run again. That third run is the final state.

Executors: every worker was DeepSeek V4.1 Flash Max through cli-devin, 34 launches in all. The first checker launch died at start when its parent shell exited, and was relaunched. No other executor and no Claude subagent was used. No task failed twice.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `hub-router.json` `vocabularyClasses` is the authored vocabulary; every other copy is checked, not generated | The stage-two intents are finer than modes, and a packet line cannot hold a mode's full vocabulary, so neither can be generated from the JSON without losing structure. The aliases are a deliberate subset. A check that fails on disagreement meets REQ-001 without rewriting curated copies. |
| sk-doc's `Keyword triggers:` lines are checked against the JSON; the claim that they are the source is removed | No code reads the lines. Generating the JSON from them would make an unread surface authoritative. |
| A trigger-line term another mode owns comes off the line; a distinctive term no mode owns goes into the vocabulary; a generic one comes off | Examples: `HVR` belongs to sk-create-with-human-voice, `style reference` to sk-design-md-generator, and the `* authoring` terms to sk-code-skilled. Bare `P0`, `P1` and `P2` would pull review prompts into sk-code-quality, and `spec folder authoring` would carry up and compete with system-spec-kit. |
| Stage-two terms are added to an existing intent of the term's own mode, never a new intent and never sk-doc's `FULL_INVENTORY` | The compiler's intent-key pattern is `[A-Z]+`. `FULL_INVENTORY` maps every packet, so a term there would satisfy the check for every mode. |
| sk-code is exempt from the stage-two leg | Its router is a surface and phase router, and pushing 92 terms such as `review`, `json` and `shell` into weight-1 surface intents would change surface selection. sk-code keeps strict alias and triggers legs, and phase 005 owns the hub. |
| Five reach-failing terms are removed, not allowlisted | `spec kit runtime` and `spec kit memory` name system-spec-kit. `design tokens` is sk-design's concept. `task list` reached no hub even while it sat in graph-metadata. `dom inspect` reached no hub, and the intent keeps `inspect the dom`. None is a two-hub dispute, so allowlisting them would hide a real gap. |
| Six reach-failing terms are allowlisted, with both hubs pinned | `opencode skill`, `opencode agent`, `opencode command`, `claude code agent`, `release readiness` and `decision branch` each have two legitimate owners. This is the shape the allowlist exists for, the same as its `design review` entries. |
| `mcp bake-off` is removed from sk-create-benchmark | Carried into the advisor's intent_signals, its token `off` moved "Kick off another deep-review wave ..." from system-deep-loop to sk-doc. That case is in both the corpus and the ambiguity slice, so accuracy fell from 155 to 154 and from 19 to 18. Bisection over the 46 new sk-doc phrases isolated it. |
| `deep review` stays in system-deep-loop's REVIEW intent | It is the review mode's main stage-one term. It ties one confuser gold row in the leaf replay, which scores the whole hub rather than the selected mode. See Known Limitations. |
| sk-create-skill steps a minor version to 1.7.0.0 | It ships a new gate. The minor step also stays clear of the phase 003 fix commit, which is editing sk-create-skill in parallel. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside spec.md's Files to Change.** The new check and its test; `routing-registry-drift.yml`, which runs it; `parent-skill-check.cjs` and its invariants test, for the warn-only list; `router-reach-allowlist.json`; `sk-doc/SKILL.md`, for the authority sentence; five packet SKILL.md trigger lines; `graph-metadata.json` and the other regenerated files; 13 changelogs.
2. **The gate runner is a copy.** `.scratch-dc90/072-003/gates.sh` changes directory into worktree 254, so the phase used `.scratch-dc90/072-004/gates.sh`, which is identical apart from that path.
3. **The baseline file is `scratch/baseline.md`**, as the brief named it. Task T002 named `scratch/before.md`.
4. **No `/speckit:plan` run (T003).** The orchestrator detailed the tasks from the measured drift, and each worker brief carried its exact files and verify command (`.scratch-dc90/072-004/prompts/`).
5. **One worker was stopped by its own PID.** The sk-doc vocabulary worker had finished its edits but kept re-verifying against the orchestrator's scratch tool. That tool counted trigger drift per mode instead of per packet union, a flaw in the tool, not in the edit. The real check passed.
6. **The sk-doc authority sentence was cut back after the rebase.** Phase 003's fix added a 180-word SMART ROUTING ratchet. The sentence had grown sk-doc's section from 816 to 822 words, so its trailing clause ("and the hub reads the JSON without re-deriving mappings during a request") was removed. The ledger is unchanged.
7. **Two research corrections about what the compiled builds hash.** system-deep-loop's build also hashes its root `ROUTER.md`, as `smart-routing.md` in `002-system-deep-loop/harness/build-artifacts.cjs`. sk-doc's build also hashes every packet SKILL.md (`007-sk-doc/harness/build-artifacts.cjs`), so a packet edit there needs a re-mint. The research listed only the hub SKILL.md, hub-router.json and mode-registry.json, and said packet SKILL.md files sit outside the hash. The guard caught both.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`gates.sh`) plus six extras, after the rebase | 39 of 39 exit 0; the 33 baseline gates are as in the baseline |
| `ci-hub-vocabulary-source.cjs` | before: drift 375 (exit 1); after: drift 0, `RESULT: PASSED` |
| Broken real copies (SC-001) | mcp-tooling copied to scratch: real files pass; an extra alias, a removed `ROUTER.md` keyword and an extra trigger term each fail their leg |
| `compiled-route-guard.cjs --json` | 7 of 7 `fresh`, failures 0 |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| Router reach | wrong-hub 0, outranked 0, no-reach 0 (baseline the same); allowed 3 to 9; phrases probed 510 to 717 |
| `generate-router-intent-signals.cjs --check` | missing 0 |
| New and changed tests | checker 7/7; parent-skill-check invariants 109/109 |
| Leaf-route replay (not a gate) | exact 51 to 50, mean_f1 0.9235 to 0.9176, tied 2 to 3 |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One leaf-replay row now ties.** "research: investigate whether our deep review findings are repeating ..." scores RESEARCH and REVIEW equally, because REVIEW now carries bare `deep review`. The replay scores intents across the whole hub. A live route scores stage two inside the mode stage one picked, and stage one picks research for that row. Phase 007 owns system-deep-loop's stage-two shape.
2. **sk-code's stage two is unchecked against its stage one.** It carries 92 stage-one terms that no intent names. Phase 005 decides whether its surface router should carry mode vocabulary at all.
3. **The workflow's path filters do not list the check script itself.** Every input the script reads is covered, but its sibling generator is not listed either, so a change to the script alone does not trigger the workflow.
4. **Six reach phrases are allowlisted, not resolved.** Each needs lexical-lane work in the advisor rather than vocabulary changes.
5. **The six allowlist entries share the allowlist's review date** (2026-12-07). Whoever reviews it then has to decide whether each dispute is still real.
<!-- /ANCHOR:limitations -->
