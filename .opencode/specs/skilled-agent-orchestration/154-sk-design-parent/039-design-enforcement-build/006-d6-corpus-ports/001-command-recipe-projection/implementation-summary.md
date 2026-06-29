---
title: "Implementation Summary: Command-surface projection layer (argumentGrammar + choreography[])"
description: "Post-build record for the additive recipe-field port onto the sk-design command-metadata SSOT: argumentGrammar + choreography[] on all 5 records, the surface-check validateArgumentGrammar + choreography wrapper-drift detector, the 5 wrapper CHOREOGRAPHY sections, the STATUS=PASS 5/0/0 plus render-INVALID and choreography-DRIFT bite proof, the ownerMode-singular and next-minimal logic-syncs, and the presence-agreement-enforceable vs sequence-quality-advisory split."
trigger_phrases:
  - "d6-r1 command recipe projection implementation summary"
  - "argumentGrammar choreography surface-check record"
  - "command metadata drift gate 5 0 0 summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/001-command-recipe-projection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Record argumentGrammar + choreography port, surface-check drift gate, and 5/0/0 proof"
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
| **Spec Folder** | 001-command-recipe-projection |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/sk-design/command-metadata.json` (+`argumentGrammar` and `choreography[]` ×5), `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` (two validators + a wrapper-drift detector), and the five `.opencode/commands/design/*.md` wrappers (one `## CHOREOGRAPHY` section each) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The five `/design:*` command wrappers used to publish only a flat `argument-hint` string and a `STATUS=OK|FAIL` line. The design corpus that motivates this dimension treats a command as a workflow recipe: a verb with a typed argument grammar and an ordered, named-skill choreography running underneath it. This phase ports the two genuinely net-new recipe shapes onto the existing command-metadata SSOT and turns both into a checked cross-surface contract. The typed argument grammar must now equal the published `argumentHint`, and the choreography declared in each wrapper doc must match the metadata's ordered steps, or the surface-check bites with a non-zero drift.

This is an additive port, not a rewrite. Every existing field, the `mode-registry.json` identity, and the established `STATUS=PASS ... drift=0` baseline are preserved. No file outside the three in-scope artifacts was touched.

### The two net-new recipe fields (×5)

`command-metadata.json` gained two fields on each of the five design command records. `argumentGrammar` is the typed form the flat `argumentHint` only gestured at: positional arguments, flags, and a `render` string. `choreography[]` is the ordered named-skill chain the command runs underneath itself, each step carrying `order`, `skill`, `resource`, and `action`. The choreography is a typed restatement of the load order each wrapper already follows (parent hub, then the owner-mode packet, then references, then an optional build handoff), so it declares existing behavior rather than introducing new behavior.

### The surface-check extension

`design-command-surface-check.mjs` was extended additively. Both new fields joined the required-field set, so a record missing either is reported invalid. `validateArgumentGrammar` checks the grammar shape and enforces the lockstep invariant `argumentGrammar.render === argumentHint`, which is why no new wrapper frontmatter is needed and drift stays at zero: the typed grammar, the flat hint, and the wrapper `argument-hint` all carry the same render. A new CHOREOGRAPHY wrapper-drift detector extracts each command doc's `## CHOREOGRAPHY` numbered steps and asserts they match the metadata's ordered `choreography[]`; a divergence is registered as drift and blocks.

### The five wrapper CHOREOGRAPHY sections

Each of the five `.opencode/commands/design/*.md` wrappers (`audit`, `foundations`, `interface`, `md-generator`, `motion`) gained one `## CHOREOGRAPHY` section listing that command's ordered steps. The section is the wrapper-side projection the drift detector compares against the SSOT, so the published recipe and the metadata cannot drift apart silently.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Add `argumentGrammar` (typed, `render === argumentHint`) and `choreography[]` (ordered `order`/`skill`/`resource`/`action` steps) to each of the five design command records; no existing field removed or mutated |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modified | Add both fields to the required set; add `validateArgumentGrammar` (shape + `render === argumentHint`); add the `## CHOREOGRAPHY` wrapper-drift detector that compares each wrapper's numbered steps to the metadata `choreography[]` |
| `.opencode/commands/design/audit.md` | Modified | Add a `## CHOREOGRAPHY` section reflecting the audit command's ordered steps |
| `.opencode/commands/design/foundations.md` | Modified | Add a `## CHOREOGRAPHY` section reflecting the foundations command's ordered steps |
| `.opencode/commands/design/interface.md` | Modified | Add a `## CHOREOGRAPHY` section reflecting the interface command's ordered steps |
| `.opencode/commands/design/md-generator.md` | Modified | Add a `## CHOREOGRAPHY` section reflecting the md-generator command's ordered steps |
| `.opencode/commands/design/motion.md` | Modified | Add a `## CHOREOGRAPHY` section reflecting the motion command's ordered steps |

The `mode-registry.json` and the routing artifacts (`hub-router.json`, `score-skill-benchmark.cjs`) were left untouched; the registry stays identity-only per the spec.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (`cli-codex gpt-5.5 xhigh fast`) authored the two fields on all five records, extended the surface-check with the two validators and the choreography drift detector, and added the `## CHOREOGRAPHY` section to all five wrappers, keeping every change additive. The orchestrator then verified the result independently, reading exit codes without pipe-masking: `node design-command-surface-check.mjs` returned `STATUS=PASS commands=5 invalid=0 drift=0`, exit `0`. Two negative bites confirmed the gate actually bites rather than passing vacuously: corrupting an `argumentGrammar.render` in the real metadata produced `STATUS=INVALID invalid=1`, and mutating a wrapper `## CHOREOGRAPHY` numbered step so it diverged from the metadata produced `STATUS=DRIFT drift=1`; both were reverted. `node --check` on the script and `JSON.parse` on the metadata both passed. The registry and routing surfaces were confirmed unchanged (`mode-registry.json`, `hub-router.json`, `score-skill-benchmark.cjs` untouched; `ownerModes` and `nextOptions` occurrences both 0, so no rename leaked in), `hubRoute` held at 23/5/0, and the evergreen scan was clean. This documentation records and re-verifies that work; it writes only the phase-folder docs and touches no live skill, command, or script file.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `ownerMode` singular, not the spec's `ownerModes[]` | The SSOT and the checker use `ownerMode` singular pervasively and validate it against a `workflowMode`; renaming is non-additive and breaks `drift=0`. Any multi-skill aspect rides `choreography[]` instead, so no information is lost |
| Keep `next[]` minimal, defer the rich grammar to sibling 007 | Sibling phase 007 (`next-options-handoff-grammar`) owns the full `nextOptions[]` and STATUS handoff grammar; double-owning it here would create parallel drift. `next[]` stays the minimal next-options surface for this phase |
| Make `argumentGrammar.render === argumentHint` a hard checker invariant | Tying the typed grammar to the existing flat hint keeps the typed form, the hint, and the wrapper `argument-hint` in lockstep, so no new frontmatter is introduced and the drift baseline stays at zero |
| Prove wrapper-equals-metadata with a drift detector, not a generator | No generator binary exists and acceptance does not require one; the drift gate that compares each wrapper's `## CHOREOGRAPHY` steps to the SSOT is the contract that "wrappers match metadata" |
| Author choreography as a restatement of the existing load order | Each step names a skill the wrapper already reads, so the recipe declares current behavior rather than inventing a new sequence, keeping the port additive and reviewable |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Final surface-check is green | PASS, `node design-command-surface-check.mjs` → `STATUS=PASS commands=5 invalid=0 drift=0`, exit 0 (orchestrator-verified, no pipe-masking) |
| Both new fields present on all five records | PASS, `argumentGrammar` and `choreography[]` on every design command record; metadata stage reports `commands=5` |
| `argumentGrammar.render === argumentHint` enforced | PASS (bite), corrupting a real `argumentGrammar.render` yields `STATUS=INVALID invalid=1`; reverted |
| `choreography[]` validated as an ordered named-skill array | PASS, each step carries `order`/`skill`/`resource`/`action`; the metadata stage accepts all five |
| Wrapper `## CHOREOGRAPHY` matches the SSOT (drift gate) | PASS (bite), mutating one wrapper numbered step to diverge yields `STATUS=DRIFT drift=1`; reverted to `drift=0` |
| Script + metadata parse | PASS, `node --check` on the `.mjs` and `JSON.parse` on `command-metadata.json` both clean |
| Registry + routing identity preserved | PASS, `mode-registry.json`, `hub-router.json`, `score-skill-benchmark.cjs` untouched; `ownerModes`=0 and `nextOptions`=0 (no rename leaked) |
| Routing replay unaffected | PASS, `hubRoute` 23/5/0 |
| Evergreen: no spec/packet/phase IDs in edited code | PASS, evergreen scan clean across the SSOT, the script, and the wrappers |
| Scope: only the three in-scope artifacts edited | PASS, change set limited to `command-metadata.json`, `design-command-surface-check.mjs`, and the five `design/*.md` wrappers |
| `validate.sh --strict` (phase folder) | PASS for all non-generated checks; see GENERATED_METADATA residual below |
| GENERATED_METADATA residual (`graph-metadata.json` source_fingerprint, `description.json` level) | EXPECTED, the orchestrator regenerates these; the fingerprint and level drift is not hand-written |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Presence and cross-surface agreement are enforceable; sequence quality is not.** The surface-check proves that `argumentGrammar` and `choreography[]` are present, well-formed, that `render` equals `argumentHint`, and that each wrapper's `## CHOREOGRAPHY` matches the metadata. It cannot prove the choreographed sequence is the *right* one or that it yields good design. That judgment stays advisory, and the docs say so.
2. **`ownerMode` stays singular by design.** The spec build-outline listed `ownerModes[]`; adopting the plural is a non-additive rename that breaks `drift=0`, so it was not taken. Multi-skill aspects are expressed through `choreography[]` rather than a plural owner field.
3. **`next[]` is minimal here.** The full `nextOptions[]` handoff and STATUS grammar is owned by sibling phase 007 and is intentionally absent from this phase to avoid double-owning the surface.
4. **The contract is a drift gate, not a generator.** Wrappers are hand-authored and proven equal to the SSOT by the drift detector; there is no code path that regenerates a wrapper from the metadata.
5. **GENERATED_METADATA stays stale until the orchestrator regenerates it.** `description.json` (`level: "1"`) and `graph-metadata.json` (`source_fingerprint`) are generated artifacts; this phase does not hand-write them, so `validate.sh --strict` reports them as an expected residual until a metadata save runs.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Additive recipe-field port: argumentGrammar + choreography[] onto all 5 design command records, plus the surface-check validators and the wrapper-drift detector
- STATUS=PASS commands=5 invalid=0 drift=0, exit 0; render-INVALID and choreography-DRIFT bites both confirmed and reverted
- Logic-syncs: ownerMode singular (no rename), next[] minimal (007 owns the rich grammar); registry + routing identity preserved (hubRoute 23/5/0)
- Honest split: presence + cross-surface agreement enforceable, choreography-sequence quality advisory; GENERATED_METADATA regenerated by the orchestrator
-->
