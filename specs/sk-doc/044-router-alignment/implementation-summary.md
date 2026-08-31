---
title: "Implementation Summary"
description: "The structural checks the brief named were already clean; replaying one realistic request per registered mode found three modes reaching no leaf set and five where the two routing stages disagreed. Closed additively, with the advisor regression byte-identical and both named gates diff-clean against a pre-edit baseline."
trigger_phrases:
  - "sk-doc router alignment result"
  - "fourteen modes replay evidence"
  - "doc quality binding nulled"
  - "default resource router md"
  - "impl summary core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/044-router-alignment"
    last_updated_at: "2026-08-31T21:30:00Z"
    last_updated_by: "stream-5"
    recent_action: "Aligned ROUTER.md with all 14 modes"
    next_safe_action: "Decide quality-actions vocabulary width"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/ROUTER.md"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/SKILL.md"
      - ".opencode/skills/sk-doc/command-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "stream-5-044-router-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the quality-actions class keep seven bare verbs at weight 4? Two streams have now measured the same collision."
      - "Who re-mints the three stale compiled-routing manifests, and when?"
    answered_questions:
      - "Is ROUTER.md structurally aligned? Yes, and it was before this packet: equal keys, every leaf resolves, FULL_INVENTORY a superset."
      - "Is it behaviourally aligned? It was not. Three of fourteen modes reached no stage-two intent on their own realistic request."
      - "Build /doc:quality or null it? Null. Building adds a third entry to an already-red bridge guard and rewrites the advisor files this packet must keep byte-stable."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 044-router-alignment |
| **Completed** | 2026-08-31 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Phase 1: the finding the gates could not see

Every structural property the brief asked about was already true at `HEAD`.
`INTENT_SIGNALS` and `RESOURCE_MAP` carried the same 15 keys, all 161 mapped paths
resolved on disk, and `FULL_INVENTORY` contained every leaf named by any other intent.
`parent-skill-check` reported 14 modes and 0 warnings; `ci-skill-root-metadata` reported
14 of 14.

The behavioural check told a different story. Replaying one realistic request per
registered mode through `router-replay.cjs`:

- **Three modes returned no stage-two intent at all.** "create an agent that reviews pull
  requests" returned nothing at either stage. "create a slash command that runs the
  deploy script" picked the mode and then loaded zero leaves. "build a parent hub skill
  with nested mode packets" did the same.
- **Five phrasings had the two stages disagreeing.** `create a skill`, `create a
  benchmark` and `document diff` all fired the surface router while `hub-router.json`
  matched nothing, so the mode telemetry was empty while leaves loaded. Bare `hvr` was
  the mirror image: stage one picked the quality mode, stage two loaded the human-voice
  packet's leaves.

Root cause, one sentence: the two routing surfaces were authored at different times
against different phrasings, and nothing compares them, because `parent-skill-check`
compares `ROUTER.md` against itself.

### Phase 2: the four recorded deltas

**`/doc:quality`, nulled.** Confirmed dead in all six runtime trees by listing them.
`"command": null` follows nine `mcp-tooling` modes and six `cli-external-orchestration`
modes. Building it was rejected on measured grounds, not preference: the command-bridge
drift guard is already red at `HEAD` for two other commands, and the regeneration that
would fix it rewrites `skill_advisor.py` and `projection.ts`, the two files this packet
was required to keep byte-stable.

The edit falsified three statements written by other packets, all repaired here. The hub
mode-table row now reads `(routes via aliases)`, matching the `sk-create-diff` row two
lines above it. One sentence each in `sk-create-quality-control/SKILL.md` and `README.md`
now says the packet carries no slash command instead of calling the id reserved. One
`command-metadata.json` discriminator row that told the reader to prefer `/doc:quality`
now names the mode the hub actually routes to.

**`defaultResource`, corrected at the source.** Stream 3's observation reproduced:
`quick-reference.md` is a validation cheat sheet with no mode list, handed to a caller
whose problem is choosing a mode. `ROUTER.md` is prepended and the cheat sheet kept, so
nothing loses a binding. The deeper defect was that `SKILL.md` hardcoded the single path
rather than reading the policy, so the two could drift and had; the defer branch now
iterates `routerPolicy.defaultResource`.

**`DOC_QUALITY` scoring vocabulary.** `score this document`, `score this doc`, `dqi`,
`document audit`, `validate a document`, `validate this document` and `validate markdown`
were added, mirroring terms `hub-router.json` already carried. "score this document" now
returns `DOC_QUALITY` with four leaves instead of an empty intent list.

**Bare `hvr`.** Added to `create-with-human-voice-aliases`, which makes the phrase a 4/4
tie between the audit mode and the mode that owns the method. The quality mode keeps its
`HVR` alias untouched, so nothing was taken from it; the mode that owns the method simply
stopped being absent.

### Phase 3: the design that replay rejected

The first attempt split `AGENT_COMMAND` into `AGENT_CREATION` and `COMMAND_CREATION`,
placing the two paired phrases in both so a paired request would fire both and load the
union. Replaying scenario SD-003's exact prompt disproved it: the router keeps only
intents within one point of the top score, and the prompt also names the agent, so the
agent intent scored 12 against the command intent's 4 and the command half was dropped.
Four leaves became two.

The shipped design keeps `AGENT_COMMAND` as a paired-only intent owning exactly the two
phrases no single-artifact request carries, with `AGENT_CREATION` and `COMMAND_CREATION`
added beside it. SD-003 now replays to `AGENT_COMMAND` with its original four leaves,
identical to baseline, and the two single-artifact lanes work. `PARENT_HUB` was added
separately because `sk-create-skill-parent` shares the `sk-create-skill` packet but not
its leaves.

Eleven stage-one aliases were added across five vocabulary classes so `hub-router.json`
agrees with `ROUTER.md` on the same phrasings. Every addition is additive; no keyword was
removed and no leaf dropped from any intent.

### Phase 4: consequences handled rather than left

Sixteen manual-testing-playbook scenarios carried a candidate list reading "the 11-intent
RESOURCE_MAP" and naming eleven intents. It was already wrong before this packet: the
router had fifteen, and the list omitted `BENCHMARK`, `DIFF`, `REPO_RULE` and
`FULL_INVENTORY`, so four correct answers were unreachable by any model following the
prompt. The list is now generated from `ROUTER.md` rather than retyped.

Five em dashes entered on the first draft, matching the file's fifteen existing intent
bullets. The brief bans the character, so the four new bullets were rewritten to a
bold-label-and-period form and the table cell to a bare parenthetical.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baselines first, into `scratch/baseline/`, before the first edit: the advisor regression,
both named gates, a 23-probe replay, the compiled-route guard, and the command-binding
test. Nothing was stashed, because the tree is shared with a live stream.

Then the machine contracts were read before anything was written: the replay engine's
substring scoring and its ambiguity delta, the root-router contract's nine violation
codes, and the leaf-resource contract's packet-qualified resolution, which is what
confirmed a `sk-create-skill/...` path resolves to the first declared mode sharing that
packet and therefore validates for a `sk-create-skill-parent` intent.

Every routing edit was followed by a replay. That is what caught the paired-intent
regression, and what caught a bare `hub router` keyword firing `PARENT_HUB` on the
sentence "review the hub router config for our load balancer".
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|---|---|
| Null `/doc:quality` rather than build it | Building adds a third entry to an already-red bridge guard and rewrites two files that had to stay byte-stable. The mode's own auditor judged the build to be its own packet |
| Prepend `ROUTER.md` to `defaultResource`, keep the cheat sheet | Fixes the mismatch by adding, not by stripping a shared document's only router binding |
| Make the defer branch read the policy | Two sources for one fact is what let them drift |
| Keep `AGENT_COMMAND`, add two intents beside it | Replay proved the split loses half the paired leaf set to the ambiguity delta |
| Separate `PARENT_HUB` intent | Folding the templates into `SKILL_CREATION` pulls six hub templates into every plain skill request |
| Leave `quality-actions` alone | Narrowing seven bare verbs changes what all fourteen modes receive; it needs its own full-matrix before-and-after |
| Repair the packet sentences my edit falsified | A registry change that leaves documents lying is not finished |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All OBSERVED: each command was run and its output and exit status read.

| Check | Result |
|---|---|
| `parent-skill-check.cjs .opencode/skills/sk-doc` | exit 0, `all hard invariants passed, 0 warnings`, 14 modes; output **diffs clean** against the pre-edit baseline |
| `ci-skill-root-metadata.cjs` | `checked=14 passed=14 failed=0`; output **diffs clean** against baseline |
| `skill_advisor_regression.py` | report **deep-equals** the pre-edit baseline. 92 cases, 88 passed, pass_rate 0.9565, p0 24/24, top1 1.0, command_bridge_fp 0. Exit 1 before and after, from the same four pre-existing `sk-deep-agent-improvement` P1 phrase cases |
| `align-check.cjs` (this packet) | 18 keys on both sides, 171 leaves resolve, `FULL_INVENTORY` a superset |
| Replay, 29 probes | No mode row shows `(none)` in either stage column. Every baseline row's stage-one mode set is a subset of the same row after |
| Negative control | Injecting a signals-only intent made `align-check` exit 1 and `parent-skill-check` fail `RRC-004`; `ROUTER.md` restored byte-identical, gate green again |
| `generate-leaf-manifest.cjs --write` then `--check` | `OK (4232ff9d...)`, byte-identical, zero diff |
| `validate-playbook-topology.cjs --skill .opencode/skills/sk-doc` | `verdict=PASS valid=32 blocked=0 total=32`; SD-003 still `pairs=4 mode=sk-create-agent+sk-create-command` |
| `validate-playbook-package.cjs --package sk-doc` | `violations=0 warnings=1`, the same advisory marker warning as at baseline |
| `package_skill.py --check --strict sk-create-quality-control` | `Result: PASS`, two pre-existing advisory section warnings |
| `command-binding-existence.vitest.ts` | 3 passed before, 3 passed after |
| `validate_document.py` on every edited document | 0 issues each |
| `compiled-route-guard.cjs` | verdict line **byte-identical** to baseline |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two gates were already failing at `HEAD` and still are.**
   `command-bridges-drift-guard.vitest.ts` is missing `command-create-repo-rule` and
   `command-create-with-human-voice`, left by packets 040 and 039. Proof this packet did
   not cause it: the `(command, ownerMode)` id list derived from `git show HEAD:` and from
   the working file are equal, and the guard reads nothing else from that file.
   `compiled-route-guard.cjs` reports `mcp-tooling`, `sk-code` and `sk-doc` as
   `stale-manifest`; it exits 0 and its verdict is unchanged here.

2. **One false positive was introduced knowingly.** `create an agent` substring-matches
   "create an agent-based rate limiter". It is kept because it is the natural phrasing for
   the mode and because reaching it needs the advisor to have already chosen `sk-doc` for a
   rate-limiter request. The replay engine's word-boundary keyword set is the fix if it
   ever bites, and that file is not this packet's.

3. **Benchmark reports predate the prompt change.** The intent-detection scenarios' stored
   results under `benchmark/reports/` were produced against the previous candidate list and
   are not comparable for those scenarios.

4. **`ROUTER.md` reads inconsistently.** Fifteen pre-existing intent bullets use an em
   dash; the four added here use a period, because the brief bans the character. A sweep of
   the file would settle it.

5. **The advisor `ALLOWLIST` entry for `/doc:quality` now overstates the situation.** It
   says the mode "binds" an id the registry no longer declares. Both assertions still pass
   and it remains a useful tripwire. The file belongs to `system-skill-advisor`, so the
   one-line correction is proposed rather than applied.

6. **Nothing is committed or pushed.** All changes are working-tree edits.
<!-- /ANCHOR:limitations -->

---
