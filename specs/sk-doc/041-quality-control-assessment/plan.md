---
title: "Plan: sk-create-quality-control integration, utilisation and usefulness"
description: "Measure routing, utilisation, duplication and size before judging; capture a baseline of every gate before editing; repair only what execution proves broken; re-run every gate and every documented command from the final state."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "quality control assessment plan"
  - "doc quality mode audit plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/041-quality-control-assessment"
    last_updated_at: "2026-08-31T20:05:00Z"
    last_updated_by: "claude"
    recent_action: "Executed the four-question assessment and the repair it recommended"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-quality-control/SKILL.md"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/skills/sk-doc/leaf-aliases.json"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-sk-doc-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: sk-create-quality-control integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

`sk-doc` is a parent hub whose thirteen workflow modes are selected in two stages: `hub-router.json` picks the mode from vocabulary classes and weights, then `ROUTER.md` picks the leaf resources within it. `mode-registry.json` is the advisor-facing projection, `leaf-manifest.json` is generated from the packets on disk plus `leaf-aliases.json`, and a compiled-routing fixture set carries canary cases. `sk-create-quality-control` is the one mode that authors nothing; it wraps four scripts in `sk-doc/shared/scripts/` around an existing document.

Four files outside the packet decide whether it is reachable, and all four belong to other streams: `mode-registry.json`, `hub-router.json`, `ROUTER.md` and `leaf-aliases.json`. That constraint shaped the plan: measure through those files, write only inside the packet.

### Overview

Answer the four questions with tooling rather than reading, capture a full baseline before touching anything, repair only what execution proves broken, and prove the repair by running every documented command with real arguments.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The mode's presence on every routing surface enumerated from the files themselves.
- A baseline captured into `scratch/baseline/`: per-file DQI and band, per-file `validate_document.py` exit status, `quick_validate.py` on the packet, byte and file counts for all twelve mode packets, seventeen `router-replay.cjs` probes, and the `parent-hub-vocab-sync.cjs` output.
- The distinction between a live caller and a frozen mention established before any grep result is counted as utilisation.

### Definition of Done

- A stated keep / shrink / fold recommendation with the measurements behind it.
- Every distinct documented invocation executed verbatim, exit 0.
- Every `SKILL.md` cross-reference in the reference files resolving to the right section.
- No DQI regression on any file; every `validate_document.py` exit 0; `quick_validate.py` exit 0.
- Hub-root deltas either recorded as exact text or explicitly stated as unnecessary.
- `validate.sh <folder> --strict` reporting `RESULT: PASSED`.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measure, then judge. Every load-bearing claim in this packet is produced by running something, and the output is kept in `scratch/`. A grep hit is a hypothesis until it is classified as a live caller, a test fixture, a frozen spec doc or a benchmark report.

### Key Components

- **Routing evidence**: `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json`, the compiled-routing canary fixture, and the packet's seven manual-testing-playbook scenarios, all read directly.
- **Routing behaviour**: `deep-improvement/scripts/skill-benchmark/router-replay.cjs`, which reports intents, scores, matched aliases and the defer reason for a given request string.
- **Vocabulary drift**: `deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs`.
- **Duplication**: the callers of the four shared scripts, separated into authoring-command assets, `sk-code` surface gates, and this packet.
- **Size**: byte and file counts across all twelve established mode packets.
- **Correctness**: `extract_structure.py`, `validate_document.py`, `quick_validate.py`, `check_authored_name_kebab.py`, `check-frontmatter-versions.sh`, and executing each documented command with real arguments.

### Data Flow

Enumerate routing surfaces, then replay real requests through them, then find real consumers, then measure size against siblings, then form the recommendation. Capture the baseline. Repair. Re-run every gate and every command from the final state and compare to the baseline.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Assessment

Enumerate the mode across `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json`, the compiled-routing fixture and the playbook scenarios. Replay seventeen request strings. Grep for consumers and classify each hit. Trace the four shared scripts to every caller. Measure all twelve packets. Check the declared command against every runtime's commands directory.

### Phase 2: Baseline

Write per-file DQI, `validate_document.py` exit status, `quick_validate.py` result, packet sizes, router replays and vocabulary-sync output into `scratch/`. Do this before the first edit, so the comparison is real and no stash is needed.

### Phase 3: Repair

Interpreter and script paths across all five files that carry invocations. The three unrunnable recipes in `references/workflow-examples.md`. The two false claims about `quick_validate.py`. The seven `SKILL.md` section cross-references. The competing execution-mode vocabulary in `references/workflows.md`. The stale "Mode 1" labelling. The four statements that assert `/doc:quality` can be typed. A `changelog/v1.0.2.0.md` entry and the `SKILL.md` anchor bump that follows from it.

### Phase 4: Verification

Execute all seven distinct invocations verbatim with real arguments and read every exit status. Run the batch recipe over the real skill tree. Re-run DQI and both validators on all twelve files and diff against the baseline. Run the frontmatter version gate over `sk-doc`. Read the whole packet diff line by line for collateral damage. Run `validate.sh --strict` on this spec folder.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Negative control first: `python ../shared/scripts/extract_structure.py <file>`, copied verbatim from `SKILL.md` line 157, returns `command not found: python`. That is the failure the repair has to remove, reproduced before the fix rather than asserted after it.

Positive control after: each of the seven distinct invocations run with a real file or directory argument, exit status read, recorded in `scratch/post-fix-command-proof.txt`. The batch recipe is not just corrected but executed, over fourteen real skill roots.

Regression control: the same DQI and validator sweep that produced the baseline, re-run from the final state, compared file by file. `quick_validate.py`'s actual argument contract was established by running it against both a file path and a directory path rather than by reading its description, which is how the two wrong claims about it were confirmed as wrong.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-doc/shared/scripts/`: `extract_structure.py`, `validate_document.py`, `quick_validate.py`, `check_authored_name_kebab.py`, `check-frontmatter-versions.sh`.
- `system-deep-loop/deep-improvement/scripts/skill-benchmark/`: `router-replay.cjs`, `parent-hub-vocab-sync.cjs`.
- `system-spec-kit/scripts/spec/validate.sh`.
- No new packages, no network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Nine files, all inside `.opencode/skills/sk-doc/sk-create-quality-control/`, all uncommitted. Eight are modified and one is new. Reverting means discarding the working-tree changes to those eight paths and deleting `changelog/v1.0.2.0.md`. No hub-root file, no shared script and no file outside the packet was touched, so the blast radius of a revert is the packet itself. Every edit is a text substitution in documentation; no behaviour, script or interface changed, so nothing deployed speaks a different contract afterward.

The tree is shared with concurrent streams, so the revert must name those exact paths. A repository-wide checkout, reset or stash would destroy other streams' work.

<!-- /ANCHOR:rollback -->
