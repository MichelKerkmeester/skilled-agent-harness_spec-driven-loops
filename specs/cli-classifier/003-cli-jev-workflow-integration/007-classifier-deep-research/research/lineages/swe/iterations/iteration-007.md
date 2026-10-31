---
title: "Iteration 7: `cli-classifier` as files"
trigger_phrases: []
---
# Iteration 7: `cli-classifier` as files

**Angle:** swe-07 · **Lens:** code-level slice design · **Maps to:** G, A

## Sibling check (W3 contract — newest iteration of each lineage + the named G angles)

- `glm/iterations/iteration-002.md` (glm-02, named): designed the same hub. Key results: 6-file-class hub ≈ 18–20 KB machinery (cli-jev's own is 18,163 B); planned phases 002/003/005/006 mention hub/classifier/deem **zero times** (counted); D2 lives only in parent `goal.md:50`; their verdict — **mint gated on double condition**: `cli-jev callers>0 AND cli-deem callers>0`, because a one-mode hub replicates cli-jev's own "orderedBundle unreachable" case.
- `deepseek/iterations/iteration-007.md` (deepseek-07, named): the blast radius — 53 source files move, 39 referencing files, 12 literal/generated surfaces (guard list `compiled-route-guard.cjs:40-50`, flag lists `compiled-routing-flag.ts:19,:37`, closure `008-cli-jev`, `dispatch-audit.mjs:46` + tests, `.hermes` mirrors ×5, durable-directory manifest); `transport-axis.transports` is the declared extension; tieBreak must be an exact modes permutation; `metadata` routingClass means **no alias can keep `cli-jev` routable** — literals must be updated, graph regenerated.
- grok-010, mimo-001 (newest): no new G-question content beyond what glm-02 already critiques.

## Actions Taken (this iteration's own reads)

- `cli-jev/` root inventory: 8 files — `SKILL.md`, `README.md`, `ROUTER.md` (`stage1-only`), `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`
- `cli-jev/mode-registry.json` whole (`modes[]` entry shape: `workflowMode, packetKind, backendKind, toolSurface{allowed,forbidden,mutatesWorkspace,bashAllowlist}, packet, packetSkillName, grandfatheredFolderMismatch, command, aliases, advisorRouting.routingClass`)
- `cli-jev/hub-router.json` whole (`routerPolicy{defaultMode:null, ambiguityDelta:1, tieBreak, outcomes, defaultResource}`, `routerSignals`, `vocabularyClasses` keyword lists)
- `cli-jev/cli-usage/SKILL.md:1-31` (`hard_rules` array — the transport contract pattern: availability gate, stdin-bounded, option cardinality, custom-endpoint key warning)
- `sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:60-139` (`DISCRIMINATOR_FILES`, `REQUIRED_BY_CLASS`, `FORBIDDEN_BY_CLASS`, `OVERLAY_FILES={}`, `GENERATED_BY_CLASS`)
- `sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:40-460` (regenerate-and-compare for `leaf-manifest.json` `:187-231`; leaf-aliases projection check `:287`; `graph-metadata.json` shape checks `:349-410`)
- `cli-jev/leaf-manifest.json` (one mode block: `{leaves[], packet, workflowMode}`)

## The smallest valid hub tree (Q1)

```text
.skilled/skills/cli-classifier/
  SKILL.md                  # hub identity + two-stage routing directive (~120 lines)
  README.md                 # human front door (~40)
  ROUTER.md                 # router_state: stage1-only, empty machine collections (~70)
  mode-registry.json        # two transport modes (below)
  hub-router.json           # two signal sets, exact-permutation tieBreak (below)
  graph-metadata.json       # advisor intent signals for BOTH modes — metadata-class
                            # vocabulary reaches the advisor only through this file
  description.json          # advisor-facing hub description
  leaf-manifest.json        # GENERATED — regenerate bytes-compare enforced
  changelog/v0.1.0.0.md
  cli-usage/                # git mv'd from cli-jev/ — content unchanged
    SKILL.md (+references/, assets/, changelog/, feature-catalog/, manual-testing-playbook/, benchmark/)
  cli-deem/                 # NEW transport packet
    SKILL.md                # name: cli-deem + hard_rules (below)
    references/cli-reference.md        # the Deem surface: POST /v1/systemone, health endpoints, question shapes
    references/lifecycle.md            # deem-ctl verbs: install/start/status/update/rollback — the packet documents, never reimplements (deem-ctl owns the lifecycle; LOCAL:55-70)
    references/providers-and-models.md # model pin, precision, update provenance
    assets/question-shaping-card.md
    leaf-manifest.json?     # no — packet leaves register in the HUB's leaf-manifest.json (generated from modes)
    changelog/v0.1.0.0.md
    feature-catalog/, manual-testing-playbook/   # same packet shape as cli-usage
```

**Where lifecycle commands live (the angle's explicit sub-question):** `cli-deem`'s install/start/health/update/rollback are `deem-ctl`'s verbs (`~/.local/share/deem/bin/deem-ctl`, tested per LOCAL:55-70). The packet's `references/lifecycle.md` documents them and its `SKILL.md` hard_rules gate on them; **no code is duplicated into the hub** — same posture as `cli-usage` wrapping `jev` without shipping it.

### `mode-registry.json` — the two transport entries

```json
"modes": [
  {
    "workflowMode": "cli-usage",
    "packetKind": "transport",
    "backendKind": "cli-dispatch",
    "toolSurface": {"allowed": ["Read","Bash","Grep","Glob"], "forbidden": ["Write","Edit","Task"], "mutatesWorkspace": false, "bashAllowlist": []},
    "packet": "cli-usage",
    "packetSkillName": "cli-usage",
    "grandfatheredFolderMismatch": false,
    "command": null,
    "aliases": ["jev cli","jev judgment","typesafe jev","cli-jev","typed judgment cli"],
    "advisorRouting": {"routingClass": "metadata", "packetSkillName": "cli-usage"}
  },
  {
    "workflowMode": "cli-deem",
    "packetKind": "transport",
    "backendKind": "cli-dispatch",
    "toolSurface": {"allowed": ["Read","Bash","Grep","Glob"], "forbidden": ["Write","Edit","Task"], "mutatesWorkspace": false, "bashAllowlist": []},
    "packet": "cli-deem",
    "packetSkillName": "cli-deem",
    "grandfatheredFolderMismatch": false,
    "command": null,
    "aliases": ["deem","deem cli","local classifier","deem judgment","offline typed judgment","local jev alternative"],
    "advisorRouting": {"routingClass": "metadata", "packetSkillName": "cli-deem"}
  }
],
"extensions": {"transport-axis": {"transports": ["cli-usage","cli-deem"], "enforcedBy": "parent-hub-check rules"}}
```

(`backendKind: "cli-dispatch"` reuses the hub's declared kind — Deem is driven through `deem-ctl`/HTTP, no new kind is needed for a two-member enum.)

### `hub-router.json` — the two-signal router

```json
"routerPolicy": {
  "defaultMode": null,
  "ambiguityDelta": 1,
  "tieBreak": ["cli-usage","cli-deem"],
  "outcomes": {
    "single": "one backend-named intent routes its transport",
    "orderedBundle": "a request naming both backends (compare/delegate) routes both transports, jev first",
    "defer": "a typed-judgment request naming neither backend asks which judgment surface is wanted",
    "none": "no signal — defer, never a silent default"
  },
  "defaultResource": ["cli-usage/SKILL.md"],
  "bundleRules": []
},
"routerSignals": {
  "cli-usage": {"weight":4,"classes":["cli-usage-aliases","jev-dispatch"],"resources":["cli-usage/SKILL.md"]},
  "cli-deem":  {"weight":4,"classes":["deem-aliases","deem-dispatch"],"resources":["cli-deem/SKILL.md"]}
},
"vocabularyClasses": {
  "cli-usage-aliases": {"keywords":[ ...existing cli-jev alias set... ]},
  "jev-dispatch":      {"keywords":[ ...existing jev-dispatch set... ]},
  "deem-aliases":  {"keywords":["deem","deem cli","local classifier","deem judgment","offline typed judgment","local jev alternative","cli-deem"]},
  "deem-dispatch": {"keywords":["deem noul","deem choice","deem score","run deem","ask deem","use deem","with deem","through deem","local judgment"]}
}
```

`tieBreak` is an exact permutation of `modes[]` — required by parent-hub check 5e (deepseek-07, `parent-skills-nested-packets.md:224-226`). `cli-deem` hard_rules mirror cli-usage's pattern: `deem-health-required` (probe before dispatch), `deem-model-pin` (`deem-0.8-v1`), `deem-stub-refusal` (refuse `stub`/`ensemble:*stub*` backends), `deem-no-key-ceremony` (never send a bearer header — the server has none, `deem_server.py:809-811`).

## What the validators require — and would reject (Q3)

| Gate | Requirement | Would reject in this design |
|---|---|---|
| `validate_skill_package.py:210-232` | `mode-registry` XOR `hub-router` → `unclassified` hard error | a half-written hub (both present here ✓); parents also run `check_compiled_routing_state` + `parent-skill-check.cjs` (`:259-284`) |
| `skill-root-metadata-contract.cjs:74-108` | CLASS_HUB requires the 6-file set; `leaf-manifest.config.json` is FORBIDDEN on H | **any non-contract root file** — `OVERLAY_FILES` is `{}` and the legal set is required+optional (`:322-325`): a hub-root `probe-backend.cjs` or `shared/` dir fails `unrecognized file`. **The shared probe helper therefore cannot live at the hub root** — it belongs inside a packet or a runtime scripts dir (swe-08's answer) |
| `ci-skill-root-metadata.cjs:187-231` | `leaf-manifest.json` byte-compared against regeneration | a hand-edited manifest after modes change — regenerate, don't edit |
| `parent-skill-check.cjs` | one `graph-metadata.json`, `packetKind` discriminator per mode, `toolSurface` whitelist, tieBreak exact permutation | a `cli-deem` entry missing `toolSurface` or a tieBreak listing aliases instead of modes |
| `check_compiled_routing_state` | compiled-routing readiness for parent hubs | minting without publishing the new hub's compiled generation — falls back to legacy routing silently (deepseek-07 F3b) |

## The migration as commands (Q4)

```bash
# 1. skeleton beside the old hub (rollback: rm -rf cli-classifier/)
mkdir -p .skilled/skills/cli-classifier
#    author: SKILL.md README.md ROUTER.md mode-registry.json hub-router.json
#            graph-metadata.json description.json changelog/v0.1.0.0.md

# 2. move the packet (the only git-write step; rollback: git revert)
git mv .skilled/skills/cli-jev/cli-usage .skilled/skills/cli-classifier/cli-usage
mkdir -p .skilled/skills/cli-classifier/cli-deem/{references,assets,changelog,feature-catalog,manual-testing-playbook}

# 3. update literals (rollback: revert)
#    .skilled/bin/compiled-route-guard.cjs:47        hub list + cli-classifier
#    .skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:19,:37  cohort lists
#    .skilled/skills/cli-external-orchestration/**/dispatch-audit.mjs:46  shape table cli-jev/cli-usage -> cli-classifier/cli-usage (+tests)
#    .hermes mirror canonical-source lines; durable-directory-manifest.json:283-288
#    resolve.cjs DEFAULT_ON_HUBS:36-44                add cli-classifier (or retire cli-jev)

# 4. regenerate (rollback: republish previous generation)
#    compiled-routing publication via its authored program (never hand-edit the tree)
#    node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest (hub manifest)
#    advisor skill-graph + trigger-index regeneration
#    then rm -rf .skilled/skills/cli-jev   (old root files only after new hub is green — F4: no alias can hold a metadata route)

# 5. verify
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier
node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "ask jev whether this is risky"
node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "use deem to score these levels"
```

## File count, LOC, rollback (Q5)

- Hub root: **9 files**, ≈19–21 KB (glm-02's count; mine agrees — cli-jev's 18,163 B + a second mode block)
- `cli-deem` packet: **~10 files**, ≈450–550 LOC of docs+rules (vs cli-usage's ~15 leaves)
- Move: 53 source files relocate (deepseek-07), 39 referencing files, 12 literal/generated surfaces, 5 regeneration steps
- **Rollback sentence:** before step 4 lands, `git revert` the move + literals and delete the skeleton — the old `cli-jev` hub serves throughout; after step 4, republish the prior compiled generation and revert.

## Idea record

### N-swe-07-1 — `cli-classifier` hub mint, gated on caller count

| Field | |
|---|---|
| **Idea** | The two-mode transport hub above. Type: structural (no judgment call) |
| **Question** | G, A |
| **Builds on** | deepseek-07's blast-radius map + glm-02's mint gate (D2.1); this iteration adds the concrete registry/router entries and the validator-rejection list |
| **Value** | One discovery surface for typed-judgment transports; `cli-deem` becomes routable |
| **Seam** | `.skilled/skills/cli-classifier/` (new root); literals at `compiled-route-guard.cjs:40-50`, `compiled-routing-flag.ts:19,:37`, `dispatch-audit.mjs:46`, `resolve.cjs:36-44` |
| **Metric, baseline, harness** | `parent-skill-check.cjs` green + both stage replays hit + zero legacy-sentinel routings post-regeneration. Baseline: single-mode hub serves jev requests only. Harness: the two replay commands in step 5 |
| **Savings** | None directly — it's an enabler (structural, not a token cut) |
| **Cost, latency, privacy** | No runtime calls; the hub holds no keys and switches nothing — per-feature backend gates stay in the packets' consumers |
| **Two-backend gate** | The hub itself has NO switch and needs none; each transport's packet owns its backend's probe rules (cli-usage's `jev-availability-required` hard_rule is the pattern) |
| **Rough LOC** | ~700 lines authored (hub docs+JSON ~450, cli-deem docs ~450) + regeneration churn |
| **Verdict** | **next** — files are fully specified and validator-checked here; the mint itself waits on glm-02's double condition (`cli-deem` has zero live callers today — every candidate caller in this lineage is `next`-gated). deepseek-07 reads D2 as mandating now; the caller-count reading is sharper: a hub routing to a transport nobody calls is the "unreachable orderedBundle" case again |
| **Confidence** | Confirmed: required-file sets, coupling rules, tieBreak constraint, generated-manifest enforcement all read in contract code. Inferred: exact alias keyword lists need authoring judgment |

## Ruled out

- **A shared `probe-backend.cjs` (or any helper) at hub root** — `OVERLAY_FILES` is `{}`; files outside the required+optional sets are rejected. Shared helpers must live inside a packet (`cli-deem/scripts/` or a runtime dir) or a leaf — decides swe-08's placement question.
- **Renaming the moved packet `cli-usage`→`cli-jev` for symmetry** — needless churn: `packetSkillName` binds folder names, and every playbook/changelog/dispatch-test reference follows the path. `cli-usage` is a fine transport-mode name.
- **`router_state: active` on day one** — cli-jev's own ROUTER.md is `stage1-only` with empty maps by deliberate promotion policy ("never placeholder intents"); `cli-classifier` inherits that posture until a leaf map is real.
- **Minting before `cli-deem` has a caller** — glm-02's kill criterion is the sharpest articulation: `mint allowed: cli-jev callers=N>0, cli-deem callers=N>0`.

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| The exact registry/router JSON for a two-transport `cli-classifier` — written out, checked against the contract files | **new** (siblings designed shape; entries and validator-fit are this iteration's) | `mode-registry.json`, `hub-router.json` above; `skill-root-metadata-contract.cjs:74-108` |
| A shared helper at hub root is *structurally impossible*: `OVERLAY_FILES={}` + legal-set check reject every non-contract root file — the dedupe question must land inside a packet | **new** | `skill-root-metadata-contract.cjs:122`, `:322-325` |
| `cli-deem`'s lifecycle is documentation-over-`deem-ctl`: the packet owns references+hard_rules, `deem-ctl` owns the verbs — no reimplementation | **new** | `cli-usage/SKILL.md:7-31` pattern; LOCAL:55-70 |
| Mint timing: deepseek-07 (D2 mandates → build-now) vs glm-02 (caller-count gate → later) — resolved toward glm-02: cli-deem callers = 0 today | **new** synthesis of a live sibling disagreement | `deepseek/iteration-007.md` N-deepseek-07-1 verdict vs `glm/iteration-002.md` D2.1 |
| `metadata` routingClass makes `graph-metadata.json` the *only* vocabulary path to the advisor — the file a botched migration silently empties | confirms deepseek-07 F3a with the contract read here | `mode-registry.json` routingClass contract; `skill-root-metadata-contract.cjs` |

## Hand-off

- swe-08: the probe helper's home is decided — a packet dir or `system-spec-kit/runtime/scripts/`, never the hub root. Count the certain callers by phase next.
- swe-09: migration order above is the G-piece of the build order; the literal-update list (12 surfaces) is the checklist.
- swe-10: none of this is the first PR — the first PR is a zero-call slice.
