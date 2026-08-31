---
title: "Spec: sk-create-quality-control integration, utilisation and usefulness"
description: "Assess whether the sk-create-quality-control mode is routed to, used, duplicated elsewhere, and worth its size. It is routed to more than any sibling, used as a route target by two of them, duplicates nothing, and is the second smallest packet in the hub. What was actually broken is that every command it documented failed at the shell and every reference pointed at the wrong SKILL.md section. Keep the mode; repair its executable surface."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "sk-create-quality-control assessment"
  - "doc quality mode usefulness"
  - "quality control mode keep shrink fold"
  - "041-quality-control-assessment"
importance_tier: "high"
contextType: "spec"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/041-quality-control-assessment"
    last_updated_at: "2026-08-31T20:05:00Z"
    last_updated_by: "claude"
    recent_action: "Assessed the mode and repaired its broken command surface"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-quality-control/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/README.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/workflows.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/changelog/v1.0.2.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-sk-doc-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Spec: sk-create-quality-control integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 041-quality-control-assessment |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Level** | 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Priority** | P1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`sk-create-quality-control` is one of thirteen workflow modes under the `sk-doc` parent hub. Unlike its siblings it authors nothing: it audits, scores and optionally optimizes documents that already exist. A mode that produces no artifact is the easiest kind to keep by inertia, so this packet asks four questions with evidence rather than impression: is it actually routed to, is it actually used, does its workflow duplicate validators that already run elsewhere, and is it worth its size.

The answers are not the interesting part. Three of the four come back strongly positive, and the fourth turns out to be the wrong question. The mode is the single most reachable target in the hub and the second smallest packet in it, so size is not where the problem lives. The problem is that the packet is unrunnable as written: every one of its eighteen documented script invocations names an interpreter that is not on `PATH`, most of them also use a path that only resolves from inside the packet directory, and every one of its five reference files points at a `SKILL.md` section number that a prior release shifted by one. None of this is visible to any gate, because `validate_document.py`, `quick_validate.py` and the DQI scorer all read structure and never execute what a document tells the reader to run.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope: the twelve files under `.opencode/skills/sk-doc/sk-create-quality-control/`, and a read-only assessment of how the hub routes to that mode.

Out of scope, and deliberately not touched: every `sk-doc` hub-root file (`mode-registry.json`, `hub-router.json`, `ROUTER.md`, `SKILL.md`, `README.md`, `graph-metadata.json`, `description.json`, `leaf-manifest.json`, `leaf-aliases.json`), which another stream owns; `shared/scripts/` and `shared/references/`, which a sibling stream owns; authoring the missing `.opencode/commands/doc/quality.md` command surface, which needs its own packet and its own runtime mirrors; the hub-wide advisor vocabulary drift that `parent-hub-vocab-sync.cjs` reports across all thirteen modes; and the pre-existing child-doc frontmatter versions, which are git-derived and owned by `frontmatter-version.mjs`, not by hand.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 [P1]** Answer "is it routed to" from the routing artifacts themselves and from a replay of real request text, not from the presence of a registry entry.
- **REQ-002 [P1]** Answer "is it used" by separating a live caller from a mention in a frozen spec doc or a benchmark report.
- **REQ-003 [P1]** Answer "does it duplicate an existing validator" by finding what actually runs the same checks and where.
- **REQ-004 [P1]** Answer "is it worth its size" with a measurement against its twelve siblings, not an impression.
- **REQ-005 [P1]** Every command the packet documents must execute successfully when run verbatim from the repository root.
- **REQ-006 [P1]** Every cross-reference from a reference file into `SKILL.md` must resolve to the section it claims.
- **REQ-007 [P2]** The packet must not assert that a command exists when no command file exists in any runtime.
- **REQ-008 [P2]** One decision must have one vocabulary: a routed leaf must not name the execution modes differently from `SKILL.md`.
- **REQ-009 [P1]** No regression: DQI, `validate_document.py` and `quick_validate.py` results must be at or above the captured baseline for every file.

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001** A stated recommendation of keep / shrink / fold, with the evidence that drives it, and the recommendation implemented.
- **SC-002** All seven distinct documented invocations run to exit 0 against real arguments, proven by execution, not by inspection.
- **SC-003** All seven `SKILL.md` section cross-references in the five reference files resolve to the correct section.
- **SC-004** Every DQI score at or above baseline; every `validate_document.py` run exit 0; `quick_validate.py` on the packet exit 0.
- **SC-005** Any hub-root change the recommendation would require is recorded as exact text for the stream that owns those files, or the spec states that none is required.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:findings -->
## 6. FINDINGS

### 6.1 Is it routed to? Yes, more than any sibling

The mode is present on every routing surface the hub has.

| Surface | Evidence |
|---|---|
| `mode-registry.json` | `workflowMode: sk-create-quality-control`, `backendKind: create-quality-control`, `command: /doc:quality`, 12 aliases |
| `hub-router.json` `routerSignals` | `weight: 4`, and the only mode with **two** vocabulary classes: `create-quality-control-aliases` (17 keywords) plus `quality-actions` |
| `hub-router.json` `vocabularyClasses` | `quality-actions` types seven bare verbs: validate, score, optimize, check, review, harden, audit |
| `hub-router.json` `routerPolicy.tieBreak` | present, last of thirteen |
| `hub-router.json` `bundleRules` | the hub's only bundle rule, `create-then-quality`, names it |
| `ROUTER.md` `INTENT_SIGNALS` | owns two of the fifteen surface intents outright, `DOC_QUALITY` and `OPTIMIZATION` |
| `ROUTER.md` `RESOURCE_MAP` | four leaves under `DOC_QUALITY`, two under `OPTIMIZATION`, all six under `FULL_INVENTORY` |
| `leaf-manifest.json` | 11 leaves, 5 of them resolved through `leaf-aliases.json` into `shared/` |
| `leaf-aliases.json` | 5 of the hub's 6 authored aliases belong to this mode |
| Compiled routing | `bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json` carries two cases for it |
| Manual testing playbook | 7 scenarios across intent-detection, holdout, resource-loading, token-cost-baseline, unknown-fallback and cross-cli-dispatch |

Replaying real request text through `deep-improvement/scripts/skill-benchmark/router-replay.cjs --skill .opencode/skills/sk-doc` confirms it is reached, and reached broadly. Seventeen probes are captured in `scratch/baseline/router-replay.txt`; the shape of the result:

| Request | Routed mode(s) | Score | Matched aliases |
|---|---|---|---|
| "score this document" | quality-control | 8 | `score this document`, `score` |
| "validate a document" | quality-control | 8 | `validate a document`, `validate` |
| "human voice review of this page" | quality-control | 8 | `human voice`, `review` |
| "review this skill and harden it" | quality-control | 8 | `review`, `harden` |
| "check the docs" | quality-control | 4 | `check` |
| "audit the docs" | quality-control | 4 | `audit` |
| "trim this document" | quality-control | 4 | `trim` |
| "flag the issues" | quality-control | 4 | `flag` |
| "validate the command template" | quality-control **4**, create-command **3** | | it outscores the mode that owns command templates |
| "audit the agent file" | tie with create-agent, `ambiguous-multi-axis` | 4 / 4 | |
| "check the feature catalog" | tie with create-feature-catalog, `ambiguous-multi-axis` | 4 / 4 | |
| "audit the documentation quality of this README" | tie with create-readme, `ambiguous-multi-axis` | 4 / 4 | |

Read the bottom four rows as the cost, not just the reach: the `quality-actions` class types seven bare verbs at weight 4, so any request that says "check", "audit", "review" or "validate" about another mode's artifact lands in a tie or, in the `validate the command template` case, wins outright over the mode that owns the artifact. That is a real routing pressure and it is worth knowing about, but the fix lives in `hub-router.json`, which this packet does not own. It is recorded in §7 for the owning stream and deliberately left alone here.

### 6.2 Is it used? Yes as a route target, no as a command

Live consumers, distinguished from frozen spec text and benchmark reports:

- `sk-create-diff/SKILL.md` "When NOT to Use" routes single-document audit, scoring and validation here by name. A sibling packet's contract citing it is the strongest utilisation signal available.
- `sk-create-agent`, `sk-create-feature-catalog` and `sk-create-manual-testing-playbook` reference maps point at it; `sk-create-skill/references/skill/creation-workflow.md` and `references/shared/overview.md` cite it in the creation path.
- `shared/references/core-standards.md`, `validation.md` and `quick-reference.md` name it as the owner of the audit lane.
- `sk-create-skill/scripts/tests/leaf-resource-contract.test.cjs` and the compiled-routing `registry-compiler.cjs` exercise it as a fixture, so a rename would break tests.

Against that, one hard negative. **The command it declares does not exist in any runtime.** `mode-registry.json` binds it to `/doc:quality`; there is no `.opencode/commands/doc/` directory, and none of `.claude`, `.cursor`, `.codex`, `.pi` or `.devin` carries a mirror. Every other `sk-doc` mode has a `/create:*` command file. This is a known and tracked gap, not a discovery: `.opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts` allowlists exactly one dead binding in the whole fleet, and it is this one, with the reason "`.opencode/commands/doc/` is unbuilt, authoring the doc:quality command set is a tracked follow-up".

The packet's own documentation did not know that. `SKILL.md` opened with "This packet is invoked by `/doc:quality`" and `README.md` step 1 read "Run `/doc:quality`". Both instructed the reader to type a command that does not exist. Corrected in this packet; building the command is left as its own work.

### 6.3 Does it duplicate validators that already run? No, but its gate is redundant for new docs

The packet ships no scripts. It orchestrates four that live in `sk-doc/shared/scripts/`: `extract_structure.py` (the DQI scorer), `validate_document.py` (the format gate), `quick_validate.py` (skill-packet frontmatter and structure) and `check_authored_name_kebab.py` (filename case). Nothing is re-implemented.

Two other consumers call the same scripts directly, which bounds what this mode uniquely provides:

1. **Every `/create:*` command asset already runs the gate inline.** Sixteen files under `.opencode/commands/create/assets/*-auto.yaml` and `*-confirm.yaml` invoke `extract_structure.py` and `validate_document.py` as their own delivery step. For a document being authored, the quality gate is already enforced by the authoring command, and routing through this mode would be a second pass over the same checks.
2. **`sk-code` runs the scorer without this mode.** `sk-code-obsidian/references/quality/doc-quality-gate.md` and `sk-code-mobile-cli/references/quality/doc-quality-gate.md` each state the invocation, the DQI floor of 70 and the per-type targets, calling `extract_structure.py` directly.

What is left after subtracting those is exactly the mode's lane, and no sibling covers it: auditing, scoring or optimizing a document that nobody is currently authoring. `sk-create-diff` handles two states of one document, and explicitly routes the single-document case here. That is the case for keeping it as a distinct mode rather than folding it into a sibling.

### 6.4 Is it worth its size? Size was never the problem

| Packet | Bytes | Files |
|---|---|---|
| sk-create-diagram | 1,502,397 | 190 |
| sk-create-skill | 866,380 | 67 |
| sk-create-diff | 284,441 | 40 |
| sk-create-benchmark | 280,860 | 29 |
| sk-create-readme | 179,822 | 17 |
| sk-create-repo-rule | 162,570 | 22 |
| sk-create-command | 143,536 | 16 |
| sk-create-manual-testing-playbook | 139,932 | 19 |
| sk-create-feature-catalog | 132,914 | 32 |
| sk-create-agent | 84,730 | 11 |
| **sk-create-quality-control** | **73,804** | **12** |
| sk-create-changelog | 64,792 | 11 |

It is the second smallest of the twelve established mode packets, under 2% of the hub's mode-packet bytes, while owning two of `ROUTER.md`'s fifteen surface intents and five of the hub's six leaf aliases. Its `SKILL.md` scores DQI 95 (excellent) and every file passes `validate_document.py`. There is no bloat to cut, and cutting would remove reference depth that two router intents already point at.

### 6.5 Root cause of the cross-reference breakage

This was traced, not guessed. The packet's own `changelog/v1.0.1.0.md` records: "Renumbered the remaining H2 sections contiguously (HOW IT WORKS through REFERENCES shift from 2-7 to 3-8). No intra-file cross-references depended on the old numbers." The claim is true of `SKILL.md` and false of its five reference siblings, which were left pointing one section low. Every wrong reference was off by exactly `+1`, which is the signature of that release. A reader sent to `SKILL.md` §3 Step 3 for the sixteen transformation patterns landed on "Interpret Quality Gates".

<!-- /ANCHOR:findings -->

---

<!-- ANCHOR:recommendation -->
## 7. RECOMMENDATION AND HUB-ROOT DELTAS

**Keep the mode, at its current scope and size. Repair its executable surface.** Not shrink: it is already the second smallest packet and its references back two router intents. Not fold: no sibling owns existing-document audit, and two siblings route to it by name.

### Hub-root changes required by this recommendation: none

No change to `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json`, or any other `sk-doc` hub-root file is needed for the repairs in this packet. All eight edited files and the one new file are inside `sk-create-quality-control/`.

### Recorded for the owning streams, not requested

These were found while assessing and are logged so they are not lost. Neither is required by this packet, and neither should be applied on this packet's authority.

1. **Advisor vocabulary drift is hub-wide, not mode-local.** `node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs --skill .opencode/skills/sk-doc` returns `verdict: VOCAB-DRIFT`, `score: 0`, `triggerPhraseCoverage: 0.714`, with P0 `orphan-alias` findings and 46 `phantomTypedKeywords`. Twelve of the 46 belong to this mode (`audit`, `check`, `flag`, `harden`, `model's budget`, `optimize`, `quality bar`, `review`, `score`, `trim`, `validate`, `validation rules`): they are typed by `hub-router.json` and by the `SKILL.md` keyword-trigger line, but absent from the mode's `mode-registry.json` `aliases` array. Full output in `scratch/baseline/vocab-sync.json`. Fixing this mode alone would leave eleven siblings drifted, so it belongs to whichever packet takes the hub-wide vocabulary reconciliation, not to this one.

2. **The `quality-actions` class is the hub's widest match surface.** Seven bare verbs at weight 4 (`validate`, `score`, `optimize`, `check`, `review`, `harden`, `audit`) let this mode tie or beat the mode that owns the artifact in question, measured in §6.1. If the router owner wants to narrow it, the minimal change that preserves reach while removing the collisions is to keep the class and lower its weight below the artifact classes, rather than deleting vocabulary. Not proposed as a change here, because it needs a full replay across all thirteen modes to prove it does not strand traffic, and the replay tooling and the file both belong to another stream.

3. **`/doc:quality` needs a command surface or a decision.** The binding is declared, allowlisted as dead, and now honestly described in the packet. Building it is a real piece of work: a command file plus generated mirrors per runtime `SYNC.md`, and deleting the `ALLOWLIST` entry in `command-binding-existence.vitest.ts` when it lands, since that test reds if an allowlisted id starts resolving.

<!-- /ANCHOR:recommendation -->

---

<!-- ANCHOR:risks -->
## 8. RISKS & DEPENDENCIES

- **Mistaking a routing artifact for reach.** Mitigated by replaying seventeen real request strings through `router-replay.cjs` rather than reading the registry and inferring; the surprises (`validate the command template` outscoring `create-command`, three `ambiguous-multi-axis` ties) only appear in the replay.
- **Mistaking a green gate for a working document.** This packet passed every automated gate before and after, at identical scores, while every command it documented failed. The gates read structure and never execute what a document tells the reader to run. Mitigated by executing all seven invocations verbatim.
- **A mechanical fix rewriting history.** The first sweep of `python` to `python3` also rewrote a sentence inside `changelog/v1.0.0.0.md`, which is a historical record. Caught in review of the diff, restored by hand, and the changelog directory is byte-identical to its committed state.
- **Dependencies.** `sk-doc/shared/scripts/` for every check; `router-replay.cjs` and `parent-hub-vocab-sync.cjs` for the routing evidence. No new packages, no network.

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None blocking this packet. Three items are recorded in §7 as work for the streams that own the files: the hub-wide advisor vocabulary drift, the width of the `quality-actions` match class, and whether `/doc:quality` gets built or retired.

<!-- /ANCHOR:questions -->
