---
title: "Implementation Plan: Skill Root Metadata JSON Unification"
description: "Six-phase plan turning the research verdict into a pure class library, a fleet presence-and-freshness gate, canonical create-skill doctrine, doctor and package-validation wiring, and sk-git remediation."
trigger_phrases:
  - "skill metadata unification plan"
  - "fleet class gate implementation phases"
  - "skill root contract rollout"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-27T20:31:30Z"
    last_updated_by: "claude-code"
    recent_action: "All six phases executed and verified"
    next_safe_action: "Run the completion gate and reconcile the packet"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-skill-metadata-json-unification-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The class library must be pure so both the fleet gate and the per-hub doctor check can share one judgment"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 + level3 | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: Skill Root Metadata JSON Unification

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Turn the research verdict into enforced reality. A pure library owns the class judgment; a fleet gate applies it starting from `SKILL.md` so a never-written file becomes a finding; one canonical document states the contract and every other doc points at it; the existing doctor and package-validation surfaces adopt the same judgment instead of each re-deriving a partial one; and `sk-git` is remediated to conforming.

The ordering is dictated by one dependency: every other phase consumes the class judgment, so the library lands first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Threshold |
|------|---------|-----------|
| Class gate | `node .opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` | 12/12 pass, exit 0 |
| Idempotence | Re-run `--fix` on a conforming tree | `fixed=0`, zero diffs |
| Contract + gate unit tests | `node .../scripts/tests/skill-root-metadata-contract.test.cjs` | all assertions pass |
| Existing freshness gate | `node .../scripts/ci-leaf-manifest-freshness.cjs` | 12/12 fresh |
| create-skill suite | every `scripts/tests/*.test.cjs` | 5/5 pass |
| Doctor suite | `.opencode/commands/doctor/scripts/tests/*.test.cjs` | pass |
| Per-hub audit | `parent-skill-check.cjs` on all 7 hubs | `11a-class` PASS on each |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Three layers, mirroring the existing split between pure leaf identity and its filesystem-touching CLI wrapper.

```
lib/skill-root-metadata-contract.cjs   pure: class + required/forbidden/overlay/generated
        │
        ├── ci-skill-root-metadata.cjs        fleet gate: discovery, identity, freshness, --fix
        ├── parent-skill-check.cjs (rule 11)  per-hub audit reuses the same judgment
        └── validate_skill_package.py         rejects the XOR half-declaration
```

The library does no filesystem access, so both consumers reach the same verdict on the same presence map and cannot drift apart.

### FIX ADDENDUM: AFFECTED SURFACES

| Surface | Change |
|---|---|
| `create-skill/scripts/lib/` | New pure contract library |
| `create-skill/scripts/` | New fleet gate; `validate_skill_package.py` XOR guard |
| `create-skill/references/shared/` | New canonical contract doc |
| `create-skill/references/README.md`, `SKILL.md`, `scripts/README.md`, `lib/README.md` | Pointers, no restatement |
| `create-skill/references/parent-skill/parent-skills-nested-packets.md` | Points at the canonical contract for the full per-class rule |
| `.opencode/commands/doctor/` | `_routes.yaml` runs the fleet gate before the per-hub audit; `parent-skill-check.cjs` gains rule 11 |
| `.opencode/skills/sk-git/` | Remediated to conforming S |
| `.opencode/skills/{system-spec-kit,mcp-code-mode}/leaf-aliases.json` | Canonicalized to manifest order |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Pure class library

Filenames, class constants, the registry+router discriminator, required/forbidden/optional/overlay/generated sets, `evaluateRoot()`. No filesystem access. Classification consults no generated file, so a root missing its manifest still classifies and the absence stays reportable.

### Phase 2 — Fleet gate

Discover roots from `SKILL.md`; read presence; evaluate; detect nested advisor identities by content discriminator so same-named continuity files are ignored; regenerate class-required generated files and byte-compare **including when absent**; `--fix` writes derivable files only. Text and JSON output.

### Phase 3 — Alias projection

Measure the committed alias files, discover the class split, encode it, and canonicalize the two out-of-order standalone files.

### Phase 4 — Canonical doc and pointers

One document at `references/shared/skill-root-metadata-contract.md`. Every other doc gains a pointer; none restates the table, because two copies drift.

### Phase 5 — Consumer wiring

Doctor route runs the fleet gate first; `parent-skill-check.cjs` gains rule 11 consuming the shared library; `validate_skill_package.py` fails the XOR half-declaration explicitly.

### Phase 6 — `sk-git` remediation

Author `leaf-manifest.config.json`; generate manifest and aliases via `--fix`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixture-first, with the fleet itself as the largest fixture. Twelve real-root assertions pin the expected class map so a root that changes class fails here before any consumer notices. Negative cases use synthetic roots in a temp dir: XOR declaration, missing authored files, missing generated files, forbidden files per class, overlay misuse, nested identity, a same-named continuity neighbour that must be ignored, stale bytes, `--fix` idempotence, and `--fix` refusing to touch authored files or hub aliases.

Mutation-checked: removing `sk-git`'s config and planting a forbidden file on `sk-doc` both fail the suite, confirming the fleet assertions are load-bearing rather than vacuous.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|---|---|
| Research synthesis | Complete; converged 5/10, 5/5 questions answered |
| `generate-leaf-manifest.cjs` | Reused unchanged as the manifest producer |
| `leaf-resource-contract.cjs` | Reused unchanged for canonical digests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is additive or reversible.

| Change | Undo |
|---|---|
| New library, gate, test, canonical doc | Delete the four files |
| Doc pointers | Revert the pointer lines; no content moved, so nothing is lost |
| `parent-skill-check.cjs` rule 11 | Delete the block; it is appended after rule 10 and touches nothing above it |
| `validate_skill_package.py` XOR guard | Revert to the single-line `kind` assignment |
| `sk-git` files | Delete the three files; the root returns to its prior non-conforming state |
| Reordered alias files | `git checkout` the two files; the rows are set-identical either way |

No consumer speaks an older contract: the library is new, and both existing gates keep their prior behaviour on every previously-conforming root.

---

## L2: PHASE DEPENDENCIES

Phase 1 gates all others. Phase 3 depends on Phase 2's manifest bytes. Phase 6 depends on Phases 1-3. Phases 4 and 5 depend only on Phase 1.

---

## L2: EFFORT ESTIMATION

| Phase | Relative effort | Risk |
|---|---|---|
| 1 Library | M | Low — pure, fully unit-testable |
| 2 Fleet gate | M | Low — reuses the existing generator |
| 3 Alias projection | S | Medium — writes to four real roots; mitigated by set-identity verification |
| 4 Docs | M | Low |
| 5 Wiring | S | Medium — touches two shipped validators; mitigated by additive-only edits |
| 6 sk-git | S | Low — one authored file, rest generated |

---

## L2: ENHANCED ROLLBACK

The highest-blast change is Phase 3, because it rewrites committed files on four roots. Its safety argument is empirical, not assumed: the rewritten rows were verified set-identical to the originals, and the only consumers filter or look up by key rather than index.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Phase 1 (library)
   ├─> Phase 2 (fleet gate) ──> Phase 3 (alias projection) ──> Phase 6 (sk-git)
   ├─> Phase 4 (canonical doc + pointers)
   └─> Phase 5 (doctor / package-validation wiring)
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Phase 1 → 2 → 3 → 6. Phases 4 and 5 run off the critical path once Phase 1 lands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|---|---|
| Class judgment exists and is testable | Contract library plus passing unit tests |
| Fleet baseline measurable | Gate reports 11/12 with `sk-git` as the single failure |
| Fleet conforms | Gate reports 12/12, idempotent on re-run |
| Contract is knowable | Canonical doc plus pointers from every doc that touched the subject |
| Judgment is shared | `11a-class` PASS on all 7 hubs; XOR rejected by package validation |

---

## L3: ARCHITECTURE DECISION RECORD

Six ADRs in `decision-record.md`: two-class taxonomy, the registry+router discriminator, `description.json` as hub-only-and-standalone-forbidden, the per-class alias generation split, `command-metadata.json` as a scoped overlay, and `sk-git` as a defective standalone root.

ADR-004 is a deliberate, evidence-backed refinement of the research report rather than a restatement of it.
<!-- /ANCHOR:milestones -->

---

## L3+: AI EXECUTION PROTOCOL

### Pre-Task Checklist

Before starting any phase:

- [ ] Read the target file before editing it; never edit from an assumed shape
- [ ] Confirm the phase's dependency has landed and its gate is green
- [ ] Capture the current gate output as the baseline, so any "no regression" claim has a starting number
- [ ] Confirm the change is inside this packet's frozen scope

### Execution Rules

| Rule | Requirement |
|---|---|
| **Classify before checking** | Never add a rule that reads a generated file to decide a root's class; that reintroduces the blindness this packet removes |
| **Generate only what has no authored meaning** | A writer may touch `leaf-manifest.json`, and `leaf-aliases.json` only for a standalone root. Everything else is reported |
| **Measure before asserting** | A claim about the fleet is backed by a command's observed output, never by reading one example and generalizing |
| **Additive edits to shipped validators** | Append rules rather than restructuring existing ones, so a rollback is a deletion |
| **One canonical statement** | Doctrine lives in exactly one document; every other doc points at it |
| **Comment hygiene** | No spec paths, packet numbers, or artifact ids in code comments; record the durable WHY |

### Status Reporting Format

Each phase reports the command run, its observed output, the delta against the captured baseline, and whether anything outside the phase's declared surface changed.

```
Phase N — <name>
  Command:  <exact command>
  Observed: <verbatim result line>
  Delta:    <before> -> <after>
  Scope:    <files touched, or "as declared">
```

### Blocked Task Protocol

On a blocker: stop at the boundary rather than working around it. Record the conflicting facts, the one-sentence root cause when known, and the decision needed. Finish every unblocked item in the phase first, then report what was left and why. A failing gate is a blocker, never a warning to note and pass.

Blockers hit during this packet and their disposition:

| Blocker | Disposition |
|---|---|
| Hollow `mcp-server/node_modules` in the main tree breaks `validate.sh` there | Surfaced to the operator rather than repaired; no lockfile exists, so a repair would resolve fresh versions. Validation ran from the tree that has the dependency |
| Root framework doc under concurrent edit | Pointer routed through `parent-skills-nested-packets.md` instead; the chain still resolves. Recorded as an open question |

---
