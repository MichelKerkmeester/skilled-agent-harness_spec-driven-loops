---
title: "Feature Specification: Phase 21: stage2-leaf-route-replay"
description: "Test research R25 offline: a deterministic stage-2 replay of each hub's ROUTER.md keyword block, scored on leaf-set F1 against the committed expected_leaf_resources gold, with zero model calls. A Jev or Deem choice only breaks ties the replay leaves, judged against the replay's own answer. R25 waited because its counted prize is small, so the first slice also recounts ROUTER.md reads. Planned, released 2026-09-29."
trigger_phrases:
  - "stage2 leaf route replay"
  - "leaf-route-replay"
  - "router.md leaf replay"
  - "leaf-set f1 replay"
  - "r25 leaf routing"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 21: stage2-leaf-route-replay

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-29 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 35 |
| **Predecessor** | 020-routing-clarify-default |
| **Successor** | 022-alignment-folder-suggestion |
| **Handoff Criteria** | The zero-call replay has printed per-hub leaf-set F1, exact-match and tied-row counts over the committed gold, the `ROUTER.md` read recount has run on a directory the operator names, and the replay's own verdict line is printed: `replay verdict: keep`, `drop` or `stop (<reason>)`. When the operator asks for a model run, each column prints `verdict jev:` or `verdict deem:` with `keep`, `kill` or `stop (<reason>)`. A `keep` serves nothing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the cli-jev workflow integration specification. It tests research R25, a stage-2 leaf-route replay. The source is `../007-classifier-deep-research/research/research.md`: the record `### R25.` in section 12, the context-reduction row in section 5, the cost row in section 10, the ruled-out row under What Not To Build and the promote-when row in section 14. R25 is new in round 3, so `../001-deep-research/research/research.md` holds no record of it. On 2026-09-29 the operator asked for one phase per later item "so we can test everything".

**Scope Boundary**: One new read-only script beside sk-doc's router contract validators, its test and the docs parent D6 requires. It reads each hub's `ROUTER.md` and playbooks, never edits a router, a map, a playbook or the compiled engine, and serves nothing. The replay makes zero model calls, and a model only breaks the ties it leaves.

**Dependencies**:
- The leaf contract `sk-create-skill/scripts/lib/leaf-resource-contract.cjs` and the scenario parser `validate-compiled-routing-scenarios.cjs`, imported read only.
- The retired replay's scoring, recovered with `git show b45ea54cea3^:.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` and ported, not restored.
- Phase 008 (`008-cli-classifier-hub`), Complete, for `cli-deem` on the Deem arm only.
- Release: released on 2026-09-29, when the operator's "Bind and release" amended parent D3. Phases 019 to 035 build in number order, and disjoint builds may run in parallel.
- Phase 020 also changes `sk-create-skill`'s `SKILL.md`, README and changelog, so the two builds share paths and run one after the other.
- Build roles: parent D5 (`plan.md` section 4). Skill docs: parent D6.

**Deliverables**:
- `leaf-route-replay.cjs` (swe-03's proposed name) with the keyword arm, the `ROUTER.md` read recount, the prose-arm comparison, a `--jev` arm and a `--deem` arm (proposed switches)
- `tests/leaf-route-replay.test.cjs` (proposed) with synthetic routers, synthetic gold and stub backends
- One replay report in a directory the operator names
- The sk-doc docs of section 3, written through sk-doc

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Routing has two stages. The compiled engine picks a hub's workflow mode: `normalizeTargets` returns destinations, never leaf lists (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:87-92`). Leaf selection is stage 2, and for it the main AI reads the hub's `ROUTER.md`. Six hubs carry an active machine block of `INTENT_SIGNALS` and `RESOURCE_MAP`: `sk-doc/ROUTER.md:154-400`, `sk-code/ROUTER.md:316-597`, `mcp-tooling/ROUTER.md:89-144`, `cli-external-orchestration/ROUTER.md:88-133`, `system-deep-loop/ROUTER.md:66-105` and `sk-design/ROUTER.md:57-97`. `cli-classifier/ROUTER.md:45-55` is `stage1-only` with empty maps.

Seven `ROUTER.md` files say that block is what "the deterministic router-replay parses" (for example `sk-doc/ROUTER.md:149`, and `sk-design:52`, `mcp-tooling:84`, `system-deep-loop:61`, `cli-external-orchestration:83`, `cli-classifier:43` and `sk-code:608`). That parser is gone. `router-replay.cjs` was deleted on 2026-09-11 in `b45ea54cea3` ("retire the skill-benchmark lane"). The live `root-router-contract.cjs` only validates the block's shape (`extractDictBody` at `:139`, `parseResourceMap` at `:263`). No committed number says how well the keyword block alone picks leaves.

The research parked R25 as later for two reasons. The prize is small: about 119 KB a week of `ROUTER.md` reads (K7, lineage-reported), at most about 30,000 tokens a week (estimate) against a p50 carry of 384,219 tokens per message. And no routing owner has asked. Its promote rule is "the routing owner asks for a stage-2 replay, or a recount shows `ROUTER.md` reads well above about 119 KB a week".

Gold exists and is committed. Playbook scenarios carry typed `expected_leaf_resources` pairs. Counted on 2026-09-29, 56 scenario files hold a non-empty list: sk-doc 25, mcp-tooling 15, system-deep-loop 6, cli-external-orchestration 5, sk-design 4 and sk-code 1. Round 3 cited 34 for sk-doc (swe-03, lineage-reported).

### Purpose

Rebuild the stage-2 replay offline with zero calls, score it on the committed leaf gold and recount the `ROUTER.md` reads it would save, so the routing owner can decide on numbers. Then settle per backend whether a model breaking the replay's ties beats the replay's own answer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **The keyword arm.** It makes zero calls and is ported from the retired replay:
  - Lowercase the prompt and count substring hits, with word-boundary matching for `review`, `lcp`, `inp` and `cls` (retired `:449-463`).
  - Score each intent as its weight times its hits (`:465-476`).
  - Keep every intent within `AMBIGUITY_DELTA = 1` of the top score (`:38`, `:485-489`). With no hit the row is `UNKNOWN` and loads nothing.
  - The row's leaf set is the union of the kept intents' `RESOURCE_MAP` paths. Each path converts to a typed pair through `dualReadLegacyResource` (`leaf-resource-contract.cjs:279`) against the hub's `leaf-manifest.json` or `leaf-aliases.json`, as `sk-doc/ROUTER.md:150-152` states.
- **Gold.** The prompt and gold pairs come from `parseScenario` (`validate-compiled-routing-scenarios.cjs:170`, found through `walkScenarioFiles` at `:304`). A scenario with no prompt or an empty gold list is counted as unscored.
- **The report.** Printed per hub:
  - Gold rows, unscored rows, `UNKNOWN` rows and unresolvable paths.
  - Tied rows, where two or more intents are kept.
  - Mean leaf-set precision, recall and F1, and the exact-match count.
  - `sk-code`'s surface and language slice (`sk-code/ROUTER.md:608`) is not ported. Its one gold row is reported as `surface slice not replayed`.
- **The read recount** behind `--transcripts <dir>` (proposed). In the directory the operator names, it counts Read tool calls on a `ROUTER.md` per hub and per ISO week, with the bytes of each paired tool result. It prints counts and bytes only, never text. Without the flag it prints `router reads: not measured`.
- **The prose arm** behind `--prose <file>` (proposed). Each line holds a scenario id and the leaf pairs the main AI loaded after reading `ROUTER.md`, recorded by the operator. The replay verdict in section 4 compares the keyword arm with it.
- **The tie-break arms.** A Jev arm behind `--jev` and a Deem arm behind `--deem` (proposed) run on tied rows only. Each asks one `choice` per row per option order, over the kept intents, in three left rotations.
- **Backend order.** Jev first, then Deem (parent D1). With both switches set, the Jev column runs first. A failed gate never starts the other backend.
- The two rules in section 4, fixed here, and the docs parent D6 requires.

### Out of Scope

- **Serving.** Any live leaf selection, a hook or a change to how the main AI reads `ROUTER.md`. A replay with no classifier belongs to the routing owner (What Not To Build row 93), so this phase measures and serves nothing.
- **Ruled-out shapes.** A `choice` over about 180 raw leaf ids, reusing the trigger index as the leaf scorer, or touching system-deep-loop's replay-only `ROUTER.md` (What Not To Build, ruled out inside R25).
- **Editing sources.** No change to a `ROUTER.md`, a `RESOURCE_MAP`, a playbook scenario, a leaf manifest or the compiled engine.
- **The stale sentences.** Rewriting the seven "router-replay parses" sentences is left to the hub owners (section 7).
- **The prose arm's rows.** Recording them, and any model call to produce them, is the operator's.
- **Shared or spend surfaces.** A shared client, a global switch, the npm `jevctl` or a dollar figure.

### Files to Change

Owner of every code path below: `sk-doc`, whose `sk-create-skill` mode owns the root-router contract and the leaf contract. Code follows sk-code's OpenCode route and the docs go through sk-doc (parent D6). Code comments carry no spec path, phase number or requirement id.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` | Create | Keyword arm, recount, prose comparison, both arms and verdicts. Proposed name. About 400 to 500 LOC (estimate) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` | Create | `node --test` cases on synthetic routers and gold, and stub `jev` and `cli-deem` |
| Each hub's `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json` and `manual-testing-playbook/**` | Read only | The maps and the gold |
| `sk-create-skill/scripts/lib/leaf-resource-contract.cjs`, `validate-compiled-routing-scenarios.cjs` | Read only | Imported |
| `<operator-named report dir>/` | Create at run time | `report.json` and, from a model run, `calls.jsonl` |
| `sk-create-skill/SKILL.md`, `sk-create-skill/README.md`, `sk-create-skill/changelog/v<next>.md` | Modify, Create | Parent D6, through sk-doc: the script, its zero-call default and its switches |
| `sk-create-skill/manual-testing-playbook/` entry and `manual-testing-playbook.md` | Create, Modify | Parent D6: one replay scenario with its index row |
| `.skilled/skills/sk-doc/feature-catalog/packet-authored-registry-routing/leaf-route-replay.md` and `feature-catalog.md` | Create, Modify | Parent D6: sk-create-skill ships no catalog, so the entry goes in the sk-doc hub catalog. Proposed name and category |
| `sk-create-skill/scripts/README.md`, `scripts/tests/README.md` | Modify | One row each |
| `.hermes/skills/sk-create-skill/SKILL.md`, sk-doc `leaf-manifest.json` and `leaf-aliases.json`, the trigger index | Regenerate | By their generators after the doc edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The replay makes zero model calls and changes nothing | Without `--jev` or `--deem` the script prints the report and never spawns `jev` or `cli-deem`. Stub binaries first on `PATH` log nothing. `git status --porcelain` is the same before and after, except operator-named outputs inside the repository |
| REQ-002 | The keyword arm matches the ported rules | On a synthetic router, `preview` does not hit `review`, two intents one point apart are both kept, two intents two points apart keep only the top, and a prompt with no hit is `UNKNOWN` with an empty leaf set |
| REQ-003 | Each arm is dormant unless its switch is set and its gate passes | Jev: an identity line with the `jev` path and provider P, then `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P` exiting 0, else `jev arm skipped: jev not on PATH`, `version` with a details line or `no credential`. Deem: `cli-deem health` within 2,000 ms, else `deem arm skipped: not reachable`, `stub backend`, `model` with a details line or `bad health response`. A skip leaves the other output byte-identical and exits 0 |
| REQ-004 | No key and no private text | The script never reads, logs or passes a key. `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' leaf-route-replay.cjs` returns no match. A Jev request carries the committed scenario prompt on stdin, the fixed `-q` instruction and the options only. The recount prints no text |
| REQ-005 | The report says what it could not score | Unscored scenarios, unresolvable `RESOURCE_MAP` paths and `stage1-only` hubs are counted per hub, never dropped silently |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The call shape is fixed | The options are the tied intent keys plus `none_of_these`. Each intent's description is its `RESOURCE_MAP` paths joined by commas (proposed). `none_of_these` reads "None of these alone" (proposed). The `-q` instruction is "Which intent does this request need?" (proposed), printed verbatim before the first call. Three left rotations run, each a fresh call with no answer cache. The modal pick is the row's pick, and three different picks make it `unstable`. A pick of `none_of_these`, and an `unstable` row, keep the union |
| REQ-007 | Every call and exit has one handling | `calls.jsonl` holds row id, order index, wall ms, exit code, backend, pick, its probability and a status of `measured`, `unmeasured` or `unmeasured_timeout`. Deem lines carry the commit pair, and Jev lines carry the `jev` version, provider and model. Exits follow 002's handling for both backends. A Jev spawn past 90 s is `unmeasured_timeout`. A stopped arm prints finished rows `partial` and no verdict. `--jev` or `--deem` without `--out <dir>` exits 2 before any output |
| REQ-008 | The operator sees the cost first | Jev prints the payload class (committed playbook prompts, intent keys and `RESOURCE_MAP` paths), planned calls (3 times the tied rows, plus 1) and estimated input tokens. Deem prints "nothing leaves the machine", planned calls and a wall estimate at its measured p50. No dollar figure |
| REQ-009 | Tests cover every public surface | `node --test` on the test file exits 0, with a happy path and one edge case for each surface below. At least 18 cases |
| REQ-010 | The changed skill's docs stay true to the code (parent D6) | The docs of section 3 name the script, its zero-call default and its three switches, and `validate_document.py` exits 0 on each |

REQ-009's surfaces:
- The `INTENT_SIGNALS` and `RESOURCE_MAP` parser reads a synthetic block and reports a `stage1-only` one.
- The keyword arm passes REQ-002.
- Path conversion resolves a pair and counts an unresolvable path.
- F1 and exact match score a partial set and an empty one.
- The recount finds a `ROUTER.md` read and prints no text.
- The replay verdict prints `keep`, `drop` and the coverage stop.
- `no headroom` fires at 4 improvable rows and not at 5.
- Both gates pass a stub and print each skip line with byte-identical output.
- The column verdict prints `keep`, `kill`, `stop (margin)` and `stop (coverage)`.

### Replay Rule (fixed 2026-09-29, before any run)

This rule decides the replay itself, as R25 proposed. N counts gold rows the keyword arm scored. P counts those rows the prose file covers.

1. **Coverage.** `10*P >= 9*N` (proposed), else `replay verdict: stop (prose arm covers <P> of <N> rows)`.
2. **Drop.** When the keyword arm's mean F1 on the P rows is below the prose arm's mean F1 on the same rows, print `replay verdict: drop`.
3. **Keep.** Otherwise print `replay verdict: keep`.

The line always carries `N= P= keyword_f1= prose_f1=`. A `drop` closes R25's replay. A `keep` is a number for the routing owner and serves nothing.

### Keep Rule (fixed 2026-09-29, before any model run)

Each backend column is judged on its own inputs. Changing this rule after the first model run is an amendment that voids every earlier verdict.

**Inputs.**
- K: the tied gold rows.
- **Baseline.** Chosen with zero calls, before any call, as the better F1 sum over the K rows of the union of the tied intents (today's behavior) and the first tied intent in `INTENT_SIGNALS` order. A tie goes to the union. The choice is printed.
- M: rows whose three calls each returned a submitted key.
- SA and SB: the column's and the baseline's F1 sums over the M rows.
- W and L: rows where the column's F1 is higher, and lower, than the baseline's.
- F: each row's non-modal picks, summed.

**Headroom.** Before any call, when fewer than 5 of the K rows have a baseline F1 below 1, the script prints `no headroom` and neither arm calls. With 4 such rows the best sign test is 0.5^4 = 0.0625.

**Thresholds, checked in this order.**
1. Coverage: `10*M >= 9*K`, else `stop (coverage)`.
2. Kill: the exact one-sided P(X >= L) for X ~ Binomial(W+L, 0.5) at or below 0.05 prints `kill`.
3. Margin: `10*(SA-SB) >= M`, a mean F1 gain of at least 0.10 per tied row, else `stop (margin)`.
4. Sign test: P(X >= W) below 0.05, with p = 1 when W+L is 0, else `stop (sign test)`.
5. Flips: `10*F <= 3*M`, a flip rate of at most 0.10, else `stop (flips)`.
6. Otherwise `keep`.

**The verdict line.** `verdict <jev|deem>: <keep|kill|stop (<reason>)> K=<K> M=<M> SA=<SA> SB=<SB> W=<W> L=<L> F=<F> p=<p> baseline=<union|first>`. Deem adds `model= model_commit= source_commit=` and Jev adds `jev_version= provider= model=`. The line goes to stdout and to `report.json`. Before any call the script prints `margin: 0.10` and one `keep rule:` line.

**Deviation from the research.** The research judged the classifier over all 34 sk-doc rows. Untied rows score the same in both arms and add nothing to W or L. So this rule counts tied rows only, and the margin is a gain per tied row.

**What a verdict means.** A `keep` serves nothing: a live tie-break needs the routing owner and a later phase. A `kill` closes that backend's tie-break at that identity. A stub or synthetic verdict never counts.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With zero calls, the operator reads how well each hub's `ROUTER.md` keyword block alone picks the committed gold leaves, and how many rows it leaves tied.
- **SC-002**: On request, the operator reads how many `ROUTER.md` bytes a week their own sessions spend, against the research's 119 KB.
- **SC-003**: Each model run gives one verdict per column, and a run with neither switch calls nothing.

### Proof Plan

`S` is `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs` and `STUB` a directory of logging `jev` and `cli-deem` stubs.

1. `PATH="$STUB:$PATH" node $S --report <dir>` prints per-hub gold, unscored, `UNKNOWN`, tied, F1 and exact-match counts, `router reads: not measured` and `replay verdict: stop (prose arm covers 0 of <N> rows)`. It exits 0, and both stub logs stay empty. Boundary: `cli-classifier` prints `stage1-only`, and `sk-code` prints `surface slice not replayed`.
2. `node $S --report <dir> --transcripts <synthetic dir>` prints one `ROUTER.md` read with its bytes and week, and no text.
3. On a synthetic router with 5 improvable tied rows, a stub `cli-deem` that answers the gold intent prints `verdict deem: keep`, and one that always answers `none_of_these` prints `stop (margin)`.
4. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' $S` exits 1.
5. `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs` exits 0 with at least 18 passing tests.

**Kill criteria.** `replay verdict: drop` closes the replay. A column `kill` closes that backend's tie-break. `no headroom`, `stop (<reason>)` and every skip line close nothing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The prize stays small | High. A good F1 may still save little | The recount measures the saving on the operator's own sessions. The replay serves nothing, and the promote decision stays with the routing owner |
| Risk | No prose arm exists | High. The replay verdict stops at coverage | The keyword numbers still print. No committed record holds per-leaf prose picks: the 2026-07-21 sk-doc benchmark report holds mode-level `statedIntents` only |
| Risk | Transcripts hold the operator's conversation | Med | The recount reads them locally and prints counts and bytes only. No transcript text reaches a backend. If a later change sent transcript prompts to Jev, it would need 003's D9 payload-acceptance and redaction gate, and Deem runs when that gate is not accepted |
| Risk | Porting drifts from the retired rules | Med | REQ-002 pins the word-boundary, delta and `UNKNOWN` rules against the recovered source |
| Risk | Few tied rows among 56 | Med | `no headroom` stops before any call, and the count is the answer |
| Dependency | Phase 020 shares `sk-create-skill`'s docs | Two builds touching one `SKILL.md` would collide | The builds run one after the other |
| Dependency | The served Deem, or a Jev credential for provider P | That column cannot run | Skip line, exit 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **The stale sentences.** Seven `ROUTER.md` files still say "the deterministic router-replay parses" their block. Should each hub owner point that sentence at this script once it lands, or remove it?
- **Who records the prose arm?** Its rows need a session that reads `ROUTER.md` for each gold prompt. That is the operator's call, and it spends model time outside this phase.
- **Is the 0.10 margin right for leaf sets?** One missing leaf in a four-leaf set moves F1 by about 0.14 (estimate). The margin is fixed here so the build cannot tune it.
<!-- /ANCHOR:questions -->

---
