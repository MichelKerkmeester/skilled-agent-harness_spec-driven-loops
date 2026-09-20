---
title: "Feature Specification: align sk-doc's root ROUTER.md with all fourteen registered modes"
description: "Wave A added a fourteenth mode and left routing deltas for the hub-root owner. Replaying one realistic request per registered mode showed the two routing stages disagreeing on five of them and three modes reaching no leaf set at all. This packet applies the recorded deltas, closes the routing holes additively, and proves every gate unchanged."
trigger_phrases:
  - "sk-doc router alignment"
  - "ROUTER.md intent signals resource map parity"
  - "replay every registered mode"
  - "doc quality dead command binding"
  - "hub router default resource"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: align sk-doc's root ROUTER.md with all fourteen registered modes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Branch** | `skilled/v4.0.0.0` (uncommitted) |
| **Predecessor** | `039-create-with-human-voice`, `041-quality-control-assessment`, `042-sk-doc-shared-audit`, `043-repo-rules-router-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Wave A landed a fourteenth `sk-doc` mode and three audits, each of which recorded a
hub-root change it did not own. Nobody had checked whether the root `ROUTER.md` still
described the hub that now exists.

The structural checks were already clean: `INTENT_SIGNALS` and `RESOURCE_MAP` had equal
keys, every leaf resolved on disk, and `FULL_INVENTORY` was a superset of every other
intent. The damage was behavioural and invisible to every gate. Replaying one realistic
request per registered mode showed:

- Three modes reached no stage-two intent at all on their own natural request:
  `sk-create-skill-parent`, `sk-create-agent` and `sk-create-command`. A request to
  create an agent returned nothing at either stage.
- Five modes hit one stage and missed the other, which is the two-stage disagreement
  `repo-rules/skill-hub-routing.md` section 1 names: `sk-create-skill`,
  `sk-create-benchmark`, `sk-create-diff`, `sk-create-command` and the bare `hvr` case.
- `sk-create-quality-control` declared a command, `/doc:quality`, that exists in none of
  the six runtime command trees.

### Purpose

Make the claim "`ROUTER.md` is aligned with every registered mode" true and provable by
replay rather than by reading, and apply the deltas the other four streams recorded.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The recorded deltas: the `/doc:quality` dead binding (streams 1 and 2), the
  `defaultResource` mismatch (stream 3 section 9.1), and the missing `DOC_QUALITY`
  scoring vocabulary (stream 1).
- `ROUTER.md` alignment with all fourteen registered modes, verified by replaying a
  realistic request per mode plus six out-of-domain probes.
- The stage-one alias gaps that make `hub-router.json` disagree with `ROUTER.md` about
  the same phrasing.
- The consequences my own changes create: statements in `sk-create-quality-control` and
  the hub `SKILL.md` that the registry edit falsified, and the intent enumeration inside
  the hub's manual-testing-playbook scenarios.

### Out of Scope

- **Building the `/doc:quality` command.** Reasoned in section 6.1: it would add a third
  missing entry to an already-red command-bridge guard, and regenerating the bridges
  rewrites the two advisor files this packet is required to keep byte-stable.
- **The `quality-actions` vocabulary class.** Stream 2 measured that its seven bare verbs
  let the quality mode tie or beat the mode that owns the artifact. Narrowing it changes
  what every one of the fourteen modes receives; it is a routing-policy decision with its
  own blast radius, not a side effect of an alignment pass. Section 7.2.
- **`graph-metadata.json` and `description.json`.** The advisor identity. Untouched on
  purpose, because the acceptance bar for this packet is a byte-identical advisor
  regression report.
- **Re-minting the compiled routing manifests.** Three hubs are stale at `HEAD`, not one,
  and the guard is advisory. Section 7.1.
- **`sk-communication` and the `rewrite` commands.** Stream 6 owns them and is running.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/ROUTER.md` | Modify | Three new intents, widened `DOC_QUALITY` vocabulary, matching prose, version bump |
| `.opencode/skills/sk-doc/hub-router.json` | Modify | `defaultResource` gains `ROUTER.md`; eleven aliases added across five vocabulary classes |
| `.opencode/skills/sk-doc/mode-registry.json` | Modify | `sk-create-quality-control` command binding set to `null` |
| `.opencode/skills/sk-doc/SKILL.md` | Modify | Defer branch reads the policy list; mode table row; fallback checklist; intent-model sentence |
| `.opencode/skills/sk-doc/command-metadata.json` | Modify | One discriminator row that pointed at the phantom command |
| `.opencode/skills/sk-doc/leaf-manifest.json` | Regenerate | Regenerated once; byte-identical, so no diff |
| `.opencode/skills/sk-doc/sk-create-quality-control/SKILL.md`, `README.md` | Modify | The two sentences the registry edit falsified |
| `.opencode/skills/sk-doc/manual-testing-playbook/**` (16 files) | Modify | One stale intent enumeration, refreshed from `ROUTER.md` rather than retyped |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `INTENT_SIGNALS` and `RESOURCE_MAP` keep equal keys, every leaf resolves, `FULL_INVENTORY` stays a superset | `scratch/align-check.cjs` exits 0 on all three, and `parent-skill-check` prints `12a-router-contract ... (active)` |
| REQ-002 | Every one of the fourteen registered modes routes at both stages on a realistic request | `scratch/after-replay.md`: no mode row shows `(none)` in either stage column |
| REQ-003 | The advisor regression is byte-identical to a baseline captured before the first edit | `scratch/reg.json` deep-equals `scratch/baseline/reg-baseline.json` |
| REQ-004 | Both named gates stay green | `parent-skill-check .opencode/skills/sk-doc` and `ci-skill-root-metadata.cjs` outputs diff clean against baseline |
| REQ-005 | No registered mode loses traffic it held before | Every baseline row's stage-one modes are a subset of the same row after |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Each recorded delta is applied or refused with a stated reason | Section 6 carries a verdict per item |
| REQ-007 | Each new alias is replayed against a plausible out-of-domain phrase | Six probes in `scratch/tasks.txt`, results in section 6.4 |
| REQ-008 | The key-parity check is proved by a negative control | Break it, watch both the local checker and `parent-skill-check` fail, restore byte-identical |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All fourteen modes route at both stages, and the leaf set a stage-two intent returns belongs to the mode stage one picked.
- **SC-002**: The advisor regression report is identical to the pre-edit baseline, field for field.
- **SC-003**: `validate.sh` on this folder returns an explicit `RESULT: PASSED`.
- **SC-004**: No gate that was green at `HEAD` is red afterwards, and every gate that was already failing is named with evidence that it failed before this packet.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS AND DECISIONS

### 6.1 `/doc:quality`: nulled, not built

The binding was dead in all six runtime trees, confirmed by directory listing rather than
by trusting the note. Three facts decided it against building:

1. `command-bridges-drift-guard.vitest.ts` is **already red at `HEAD`**, missing
   `command-create-repo-rule` and `command-create-with-human-voice`. Adding a
   `/doc:quality` command-metadata entry adds a third. Proof that my edits did not cause
   it: the `(command, ownerMode)` id list derived from `git show HEAD:` and from the
   working file are equal, and the guard reads nothing else from that file.
2. Regenerating the bridges rewrites `skill_advisor.py` and `projection.ts`, the files
   REQ-003 requires byte-stable. Stream 1 avoided the same regeneration for the same
   reason.
3. Stream 2, which owns the mode, judged building it "its own packet, not a side effect
   of an audit," and measured that every `/create:*` command already runs the quality
   gate inline.

`"command": null` is the established shape: `mcp-tooling` uses it for nine modes and
`cli-external-orchestration` for six. Both binding tests stay green, 3 passed before and
after.

The nulling falsified three statements written by other packets. All three are repaired
here, because a registry edit that leaves ten documents lying is not finished: the hub
`SKILL.md` mode-table row now reads `(routes via aliases)` like the `sk-create-diff` row
above it, and one sentence each in `sk-create-quality-control/SKILL.md` and `README.md`
now describes the binding as absent rather than reserved. A fourth, the `/doc:quality`
entry in the advisor's `ALLOWLIST`, is left alone and recorded in section 7.3.

### 6.2 `defaultResource`: the lane map first, the cheat sheet second

Stream 3's reading is confirmed. `shared/references/quick-reference.md` is a validation
command cheat sheet, and its section headings carry no mode list, so a caller who reached
the defer branch received an answer to a question they had not asked.

`ROUTER.md` is prepended rather than substituted. Its section 2 states, per lane, what
fires it, which is the disambiguation question in the exact form the caller needs; the
cheat sheet keeps its only router binding and its four consumers. Nothing is removed.

The root cause of the mismatch was a second source of truth: `SKILL.md` hardcoded the one
path instead of reading the policy, so the two could drift and had. The defer branch now
iterates `routerPolicy.defaultResource`, which is why a future change to that list needs
one edit rather than two.

`routerPolicy.defaultResource` never enters a replay result for this hub. The surface
router owns assembly whenever `ROUTER.md` is present, and `ROUTER.md` declares no
`DEFAULT_RESOURCE`, so the field is a human-facing instruction only. Measured: the
`FULL_INVENTORY` probe returns exactly 121 resources, the map's own count, with no
default unioned in.

### 6.3 Alignment: what replay found that no gate did

Baseline in `scratch/baseline/replay.md`, final state in `scratch/after-replay.md`.

| Mode | Realistic request | Baseline stage 1 / stage 2 | After |
|---|---|---|---|
| sk-create-skill | create a skill for parsing our webhook payloads | none / SKILL_CREATION | skill / SKILL_CREATION |
| sk-create-skill-parent | build a parent hub skill with nested mode packets | parent / none | parent / PARENT_HUB |
| sk-create-agent | create an agent that reviews pull requests | none / none | agent / AGENT_CREATION |
| sk-create-command | create a slash command that runs the deploy script | command / none | command / COMMAND_CREATION |
| sk-create-benchmark | create a benchmark for the new model | none / BENCHMARK | benchmark / BENCHMARK |
| sk-create-diff | produce a before and after document diff of the onboarding page | none / DIFF | diff / DIFF |
| bare `hvr` | hvr | quality-control / HVR | quality-control + with-human-voice / HVR |

The other seven modes routed correctly at both stages before and after, unchanged.

Three intents were added, not two. The first design split `AGENT_COMMAND` into an agent
intent and a command intent, on the theory that a paired request carrying both phrases
would fire both and load the union. **Replaying it disproved that.** The router keeps only
intents within one point of the top score, so the scenario SD-003 prompt, which also
names the agent, scored the agent intent at 12 against the command intent at 4 and
dropped the command half: four leaves became two. The shipped design keeps
`AGENT_COMMAND` as a paired-only intent owning the two phrases no single-artifact request
carries, and adds `AGENT_CREATION` and `COMMAND_CREATION` beside it. SD-003 replays to
`AGENT_COMMAND` with its original four leaves, identical to baseline.

`PARENT_HUB` exists because `sk-create-skill-parent` is a registered mode that shares the
`sk-create-skill` packet but not its leaves. Folding the parent-hub templates into
`SKILL_CREATION` would have pulled six hub templates into every plain skill request.

### 6.4 Out-of-domain probes for every new alias

| Probe | Result | Verdict |
|---|---|---|
| add a slash to the file path template | no intent | `slash command` stays narrow |
| build a parent process supervisor | no intent | `parent hub` / `parent skill` stay narrow |
| review the hub router config for our load balancer | no stage-two intent | fixed during the pass: the first draft carried a bare `hub router` keyword and fired `PARENT_HUB` on this sentence; only the full file names survive |
| write a mode packet of C code | PARENT_HUB | accepted; `mode packet` is this repo's own jargon and already stage-one vocabulary |
| what does the presentation contract of our sales deck look like | COMMAND_CREATION | accepted; `presentation contract` was already a stage-one alias, mirrored not invented |
| create an agent-based rate limiter for the api | AGENT_CREATION | accepted with a measured cost, below |

The last one is a real false positive that this packet introduced: `create an agent`
substring-matches `create an agent-based`. It is kept because it is the natural phrasing
for the mode, and because reaching it requires the advisor to have already chosen `sk-doc`
for a rate-limiter request, which routes to `sk-code`. A word-boundary keyword list exists
in the replay engine and holds four entries; extending it is the fix if this ever bites,
and it is not this packet's file.
<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:risks -->
## 7. RISKS, DEPENDENCIES AND WHAT WAS LEFT

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding router vocabulary steals a sibling's traffic | High, and invisible to every gate | Twenty-nine probes replayed before and after; every baseline row's stage-one mode set is a subset of the same row after |
| Risk | A hub-root edit perturbs the advisor | High | The advisor reads `graph-metadata.json`, which was not touched; proved by a deep-equal regression report |
| Risk | Changing a scenario prompt changes what a benchmark measures | Medium | Stated in 7.4 rather than hidden |
| Dependency | `router-replay.cjs` ambiguity delta of 1 | It silently drops a second intent more than one point behind | Found by replay, and it is the reason the first `AGENT_COMMAND` design was abandoned |

### 7.1 Compiled routing was stale before this packet

`compiled-route-guard.cjs` reports `mcp-tooling`, `sk-code` and `sk-doc` as
`stale-manifest` at `HEAD`, and `sk-doc` is already serving `legacy` as a result. The
guard exits 0, so it is advisory. Its verdict line is byte-identical before and after
this packet. Re-minting one hub of three, in a subsystem this packet does not own, is
recorded rather than done.

### 7.2 The `quality-actions` class is still the hub's widest match surface

Stream 2's measurement reproduces here: `check the feature catalog` and `audit the agent
file` remain stage-one ties between the quality mode and the mode that owns the artifact.
This packet made the stage-two answer better for those requests, since they now resolve
to the artifact's own intent rather than to nothing. The class itself is untouched:
narrowing seven bare verbs changes what all fourteen modes receive and needs its own
before-and-after across the whole matrix.

### 7.3 The advisor `ALLOWLIST` entry for `/doc:quality` is left in place

With the registry field nulled, the entry no longer quarantines a declared binding. It
still passes both assertions, and it remains a useful tripwire: the test reds if
`/doc:quality` ever starts resolving. Its reason text now overstates the situation by
saying the mode "binds" the id. The file belongs to `system-skill-advisor`, so the
one-line correction is proposed, not applied.

### 7.4 What the playbook enumeration change costs

Sixteen scenario files carried a candidate list reading "the 11-intent RESOURCE_MAP"
naming eleven intents. It was already wrong before this packet: the router had fifteen,
and the list omitted `BENCHMARK`, `DIFF`, `REPO_RULE` and `FULL_INVENTORY`, so four
correct answers were unreachable by a model following the prompt. The list is now
generated from `ROUTER.md` itself. Both playbook validators pass, and the topology
validator still reports 32 of 32 valid, because it checks typed pairs rather than intent
names. The consequence to know: stored benchmark reports under `benchmark/reports/` were
produced against the previous prompt text and are not comparable for the intent-detection
scenarios.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should the `quality-actions` class keep its seven bare verbs at weight 4? Two streams
  have now measured the same collision. It needs an owner and a full-matrix replay.
- `ROUTER.md` still carries em dashes in its fifteen pre-existing intent bullets, while
  the four bullets added here use a period, because the brief bans the character. The
  file reads inconsistently until someone sweeps it.
<!-- /ANCHOR:questions -->

---
