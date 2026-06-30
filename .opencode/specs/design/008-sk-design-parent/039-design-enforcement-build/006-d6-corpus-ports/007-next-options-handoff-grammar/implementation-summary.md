---
title: "Implementation Summary: nextOptions[] + handoff status grammar (no silent chain)"
description: "Post-build record for the additive handoff-grammar port onto the sk-design command-metadata SSOT: a handoff object on all 5 records, the surface-check validateHandoff + the wrapper handoff-drift detector, the 5 wrapper HANDOFF GRAMMAR sections, the STATUS=PASS 0/0 plus unknown-nextOptions-INVALID and missing-handoffRequired-INVALID bite proof, the nextOptions==next lockstep / no-self-handoff / no-silent-chain rules, and the handoff-grammar-enforceable vs live-pipeline-choice-advisory split."
trigger_phrases:
  - "d6-r7 next options handoff grammar implementation summary"
  - "validateHandoff wrapper drift surface-check record"
  - "design command handoff grammar 0 0 summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/007-next-options-handoff-grammar"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record handoff grammar port, validateHandoff/drift detector, and PASS 0/0 bites"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs"
      - ".opencode/commands/design/audit.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-next-options-handoff-grammar |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/sk-design/command-metadata.json` (+a `handoff` object ×5), `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` (`validateHandoff` + a wrapper handoff-drift detector), and the five `.opencode/commands/design/*.md` wrappers (one `## HANDOFF GRAMMAR` section each) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The five `/design:*` command wrappers used to end on a bare success tail (`STATUS=OK PRODUCES= NEXT= PROOF=`) plus a prose line promising they "never silently chain". The next hop was legible to a human but not checkable, and the no-auto-chain promise lived in prose with nothing to enforce it. This phase ports a typed **next-options + handoff status grammar** so each command now declares — in a shape the surface-check bites on — which known recipes it may hand off to, whether a handoff is required, and why. A handoff that is not declared cannot be implied, and a declared option that does not resolve to a known recipe fails the gate.

This is an additive port that coexists with sibling phase 001's `argumentGrammar`/`choreography[]` fields. Every existing field, the `mode-registry.json` identity, and the established `STATUS=PASS ... drift=0` baseline are preserved. No file outside the three in-scope artifacts was touched.

### The handoff object (×5)

`command-metadata.json` gained a `handoff` object on each of the five design command records. It carries `nextOptions[]` (each entry an object of `command` + `when`), a `handoffRequired` boolean, and a `handoffReason` string. The `nextOptions[].command` set is held in lockstep with the existing `next[]` array — same commands, same order — so `next`, `pipeline.nextCommands` (a subset of `next`), and `handoff.nextOptions` stay one source of truth and cannot drift apart. Every option command resolves to one of the five known `/design:*` recipes and is never the record's own command, and each `when` gives the live caller a one-line reason to pick that hop. `handoffRequired` is `false` on every record (recommend-only), and `handoffReason` states the contract: the user or the `sk-design` hub chooses the next step, never an automatic chain.

### The surface-check extension

`design-command-surface-check.mjs` was extended additively. `handoff` joined the required-field set, so a record missing it is reported invalid. `validateHandoff` proves the object is well-formed: `nextOptions`, `handoffRequired`, and `handoffReason` are present; `nextOptions` is a non-empty array; each option is an object with a non-empty `command` and `when`; each `command` resolves to a known recipe, is not the record's own command, and is not duplicated; the `nextOptions[].command` set equals `next` exactly; `handoffRequired` is a boolean and must be `false` for recommend-only command handoff; and `handoffReason` is a non-empty string. A new wrapper handoff-drift detector then extracts each wrapper's `## HANDOFF GRAMMAR` section and asserts it carries the three status tokens (`NEXT_OPTIONS=`, `HANDOFF_REQUIRED=`, `HANDOFF_REASON=`), the exact rendered lines built from the SSOT, every option command and its rationale, the `HANDOFF_REQUIRED=false` recommend-only flag, and the literal no-silent-chain assertion. A divergence is registered as drift and blocks.

### The five wrapper HANDOFF GRAMMAR sections

Each of the five `.opencode/commands/design/*.md` wrappers (`audit`, `foundations`, `interface`, `md-generator`, `motion`) gained one `## HANDOFF GRAMMAR` section. The section publishes the `NEXT_OPTIONS` / `HANDOFF_REQUIRED` / `HANDOFF_REASON` tokens, lists each next option with its `when`, and closes with the no-silent-chain line. It is the wrapper-side projection the drift detector compares against the SSOT, so the published handoff grammar and the metadata cannot diverge silently.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Add a `handoff` object (`nextOptions[]` of `command`/`when`, `handoffRequired:false`, non-empty `handoffReason`) to each of the five design command records; `nextOptions` set equals `next`; no existing field removed or mutated |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Add `handoff` to the required set; add `validateHandoff` (known-recipe resolution, no self-handoff, no duplicate, `nextOptions == next` lockstep, boolean-and-false `handoffRequired`, non-empty `handoffReason`); add the `## HANDOFF GRAMMAR` wrapper-drift detector and register the new drift field |
| `.opencode/commands/design/audit.md` | Modified | Add a `## HANDOFF GRAMMAR` section reflecting the audit record's handoff object |
| `.opencode/commands/design/foundations.md` | Modified | Add a `## HANDOFF GRAMMAR` section reflecting the foundations record's handoff object |
| `.opencode/commands/design/interface.md` | Modified | Add a `## HANDOFF GRAMMAR` section reflecting the interface record's handoff object |
| `.opencode/commands/design/md-generator.md` | Modified | Add a `## HANDOFF GRAMMAR` section reflecting the md-generator record's handoff object |
| `.opencode/commands/design/motion.md` | Modified | Add a `## HANDOFF GRAMMAR` section reflecting the motion record's handoff object |

The `mode-registry.json` and `hub-router.json` were left untouched; the registry stays identity-only. The `score-skill-benchmark.cjs` change present in the working tree belongs to sibling phase D6-R2 and is pending its own push, not part of this phase.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) authored the `handoff` object on all five records, extended the surface-check with `validateHandoff` and the wrapper handoff-drift detector, and added the `## HANDOFF GRAMMAR` section to all five wrappers, keeping every change additive on top of sibling 001's landed fields. The orchestrator then verified the result independently, restoring the real metadata after each temp-corrupt and reading exit codes without pipe-masking: `node design-command-surface-check.mjs` returned `STATUS=PASS STAGE=complete`, `METADATA commands=5 aliases=15`, `SUMMARY invalid=0 drift=0`, exit `0`. Two negative bites confirmed the gate bites rather than passing vacuously: injecting an unknown/malformed `nextOptions` command into a real record produced `STATUS=INVALID invalid=1`, and removing `handoffRequired` from a real record produced `STATUS=INVALID invalid=2` (the required-field error plus the boolean-type error); both were reverted. `node --check` on the script and `JSON.parse` on the metadata both passed. The D6-R1 `argumentGrammar` and `choreography[]` fields were confirmed preserved; `mode-registry.json`, `hub-router.json`, and `score-skill-benchmark.cjs` were confirmed untouched by this phase; `hubRoute` held at 23/5/0; and the evergreen scan was clean. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill, command, or script file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Group the grammar under one `handoff` object rather than three loose fields | `nextOptions[]`, `handoffRequired`, and `handoffReason` are one contract; grouping keeps them cohesive and lets `validateHandoff` own the whole shape, while sibling 001's `argumentGrammar`/`choreography[]` stay untouched beside it |
| Hold `handoff.nextOptions[].command` in lockstep with `next[]` | Tying the rich grammar to the existing canonical `next` list keeps `next`, `pipeline.nextCommands ⊆ next`, and `handoff.nextOptions` one source of truth, so drift stays at zero and there is no parallel next-command surface to maintain |
| Make `handoffRequired` boolean-and-must-be-`false` a hard checker invariant | The wrappers are recommend-only by contract; forcing `false` and pairing it with the literal no-silent-chain assertion turns "never auto-chain" from prose into something the gate bites on |
| Add a dedicated `## HANDOFF GRAMMAR` wrapper section, keep the success tail intact | A dedicated section is fully additive — the existing `STATUS=OK ... NEXT= PRODUCES= PROOF=` tail and `PIPELINE & HANDOFF` prose are preserved, so no checker status-token set had to move and drift stays at zero |
| Prove wrapper-equals-metadata with a drift detector, not a generator | No generator binary exists and acceptance does not require one; the drift gate that compares each wrapper's `## HANDOFF GRAMMAR` content to the SSOT is the contract that "wrappers match metadata" |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Final surface-check is green | PASS, `node design-command-surface-check.mjs` → `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified, temp-corrupt-restore, no pipe-masking) |
| `handoff` object present on all five records | PASS, every design command record carries `nextOptions[]`, `handoffRequired`, `handoffReason`; metadata stage reports `commands=5` |
| Every `nextOptions[].command` resolves to a known recipe, not self | PASS, each option is one of the five `/design:*` commands and never the record's own command; duplicates rejected |
| `nextOptions[].command` set equals `next` (lockstep) | PASS, `validateHandoff` requires `nextOptions == next` exactly; `pipeline.nextCommands ⊆ next` preserved |
| Unknown next option bites | PASS (bite), injecting an unknown/malformed `nextOptions` command yields `STATUS=INVALID invalid=1`; reverted |
| Missing `handoffRequired` bites (no silent chain) | PASS (bite), removing `handoffRequired` from a real record yields `STATUS=INVALID invalid=2` (required-field + boolean-type errors); reverted |
| `handoffRequired` boolean-and-`false`; `handoffReason` non-empty | PASS, metadata stage enforces both; a non-`false` or non-boolean value is reported invalid |
| All five wrappers carry the handoff grammar (drift gate) | PASS, each `## HANDOFF GRAMMAR` section carries the three tokens, every option command + rationale, the `HANDOFF_REQUIRED=false` flag, and the no-silent-chain assertion; `drift=0` |
| Script + metadata parse | PASS, `node --check` on the `.mjs` and `JSON.parse` on `command-metadata.json` both clean |
| D6-R1 fields preserved | PASS, `argumentGrammar` and `choreography[]` intact on all five records; this port is additive beside them |
| Registry + routing identity preserved | PASS, `mode-registry.json`, `hub-router.json`, `score-skill-benchmark.cjs` untouched by this phase; `hubRoute` 23/5/0 |
| Evergreen: no spec/packet/phase IDs in edited code | PASS, evergreen scan clean across the SSOT, the script, and the wrappers |
| Scope: only the in-scope artifacts edited | PASS, change set limited to `command-metadata.json`, `design-command-surface-check.mjs`, and the five `design/*.md` wrappers |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`graph-metadata.json` source_fingerprint, `description.json` level) | EXPECTED, the orchestrator regenerates these; the fingerprint and level drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Handoff-grammar structure is enforceable; the live pipeline choice is not.** The surface-check proves the `handoff` object is present and well-formed, that every `nextOptions` command resolves to a known non-self recipe, that the option set equals `next`, that `handoffRequired` is `false`, and that each wrapper section matches the SSOT including the no-silent-chain assertion. It cannot prove the recommended options are the *right* pipeline for a given live request, or that a live model honors "no auto-chain unless requested" on an open-ended prompt outside the static surface. That judgment stays advisory, and the docs say so.
2. **The contract is a drift gate, not a generator.** Wrappers are hand-authored and proven equal to the SSOT by the drift detector; there is no code path that regenerates a wrapper from the metadata.
3. **`handoffRequired` is `false` everywhere by design.** Auto-chain is only legal when a live request explicitly asks for it; the static surface forbids a non-`false` value, so a wrapper cannot encode a mandatory chain.
4. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `description.json` (`level: "1"`) and `graph-metadata.json` (`source_fingerprint`) are generated artifacts; this phase does not hand-write them, so `validate.sh --strict` reports them as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive handoff-grammar port: a handoff object on all 5 design command records, plus validateHandoff and the wrapper handoff-drift detector
- STATUS=PASS commands=5 invalid=0 drift=0, exit 0; unknown-nextOptions-INVALID (invalid=1) and missing-handoffRequired-INVALID (invalid=2) bites both confirmed and reverted
- Rules: nextOptions == next lockstep, no self-handoff, no silent chain (HANDOFF_REQUIRED=false + literal assertion); D6-R1 argumentGrammar/choreography preserved; registry + routing identity held (hubRoute 23/5/0)
- Honest split: handoff-grammar structure enforceable, live pipeline choice advisory; GENERATED_METADATA regenerated by the orchestrator
-->
