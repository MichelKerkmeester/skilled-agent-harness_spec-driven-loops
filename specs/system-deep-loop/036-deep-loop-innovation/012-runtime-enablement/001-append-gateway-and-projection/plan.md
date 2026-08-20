---
title: "Implementation Plan: Append Gateway and Legacy Projection"
description: "Plan for building the deep-loop canonical persistence boundary: an authorizing, fencing append gateway plus the per-event legacy projection that keeps six existing consumers working."
trigger_phrases:
  - "append gateway plan"
  - "legacy projection plan"
importance_tier: "important"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection"
    last_updated_at: "2026-08-19T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Planned the gateway build in four stages"
    next_safe_action: "Capture the runtime suite baseline before writing code"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/fenced-ledger-writer.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/legacy-projections/legacy-projection-engine.ts"
    completion_pct: 10
    open_questions:
      - "Projection-refresh failure mode after a durable append"
    answered_questions:
      - "Bindings resolve from the environment"
---
# Implementation Plan: Append Gateway and Legacy Projection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `runtime/lib/mode-append-gateway/`, `runtime/scripts/`, existing fencing and projection libraries |
| **Change class** | New write path; additive while the legacy protocol remains in force |
| **Authority** | Unchanged. No mode's authority moves in this phase |
| **Substrate reused** | Authorized ledger, transition authorization gateway, fenced writer, legacy projection engine, binding resolver |
| **Blast radius** | Low while additive: nothing calls the gateway until the next phase migrates a protocol |

The gateway is a thin composition, not new machinery. Every hard part — envelope validation, authorization, fencing,
projection — already exists and is tested. What is missing is a single callable seam that performs them in order and
that an agent or script can reach without constructing runtime objects.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Blocking |
|------|---------|----------|
| Unit suite baseline | `npx vitest run` in `runtime/` before any edit, output captured | Yes — a delta needs a baseline |
| Unit suite delta | `npx vitest run` after the build, compared against the captured baseline | Yes |
| Negative control | Remove the guard, watch the new refusal test fail, restore it | Yes — an untested guard is an assumed guard |
| Reader contract | Each of the six consumers executed against a projected file | Yes |
| Spec validation | `validate.sh <this folder> --strict` reports Errors: 0 | Yes |

A bare "tests pass" is not accepted as evidence for this phase. The numbers before and after are both recorded.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The gateway takes one event and drives it through four steps that already exist independently:

1. **Bind** — `resolveCutoverBinding` supplies actor, capability, and commit from the environment. Nothing is passed
   in by a caller, so nothing can be mistyped.
2. **Envelope** — the mode's ledger schema validates the record. An event that does not typecheck never reaches the
   disk.
3. **Authorize** — the transition authorization gateway issues an allow proof or denies. A denial is returned with the
   failing check named, not swallowed.
4. **Append and project** — `appendAuthorizedThroughFence` performs the fenced write and returns a receipt; the
   projection engine then materialises the legacy file at the manifest's declared refresh boundary.

The ordering matters: authorization precedes the fence so an unauthorized event never acquires the fence and never
delays a legitimate writer.

The CLI entry point wraps the same function. It exists because the callers that need this most are shell scripts and
agents, and requiring them to construct a runtime object in TypeScript would guarantee they keep writing files
directly instead.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Run the runtime unit suite unchanged and record file counts, test counts, and any pre-existing failures. No source file is edited before this exists.
- Record the exact vitest invocation, so the later delta run is the same command and not a narrower one.
- Re-confirm by search the executable consumers of the mode's legacy state file; the count in this packet is a starting point, not an authority.
- Read the projection manifest entry for the target surface and note its declared refresh boundary.

### Phase 2: Implementation
- Create `runtime/lib/mode-append-gateway/` with an `appendModeEvent` entry point taking mode, run directory, and event record.
- Compose bind, envelope, authorize, and fenced append in that order, returning the receipt the fenced writer produces.
- Add the refusal paths: an envelope that fails the mode schema, and an append the authorization gateway denies. Each names the failing check.
- Refresh the legacy projection after a durable append, at the manifest's declared boundary, and implement whichever projection-failure mode is chosen.
- Add the CLI entry point so a shell script or agent can reach the gateway without constructing a runtime object.

### Phase 3: Verification
- Happy path: append against a temp ledger, then read the event back through the authorized ledger's own read path rather than by parsing the file.
- Prove each refusal by removing its guard, observing the test fail, restoring the guard, and recording both outcomes.
- Race two appends on one mode's ledger; assert two receipts and a totally ordered ledger with no lost write.
- Run all six consumers against a projected file and record each exit status.
- Re-run the full suite and report the delta against the Phase 1 baseline rather than a bare pass.
- Run strict packet validation and confirm the scoped diff contains no task-created residue.

Stage ordering is not ceremony. Without the Phase 1 baseline the phase can only claim the suite is green, which says
nothing about whether this change moved anything.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Tests live in `runtime/tests/unit/` alongside the existing suites and run under the same vitest configuration
(`fileParallelism: false`, include `tests/**/*.{vitest,test}.ts`).

Refusal tests carry the weight here. A gateway that appends correctly but also appends an unauthorized event is worse
than no gateway, because the ledger would then carry events nobody authorized while appearing to be a controlled
surface. Each refusal test is therefore proven by removing its guard and watching the test go red before the guard is
restored — the same negative-control discipline the binding resolver's identity guard was proven with.

Concurrency is exercised with two real appends racing on one mode's ledger, asserting both receipts exist and the
ledger is totally ordered with no lost write. A serialised-by-luck test would pass on a broken fence, so the assertion
is on the ledger contents, not on the absence of an exception.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | State | Note |
|------------|-------|------|
| Authorized ledger + typed events | Landed | Read and append paths both tested |
| Transition authorization gateway | Landed | Produces the allow proof the fenced append requires |
| Fenced ledger writer | Landed | Benchmarked at roughly 10 ms on a path already dominated by an fsync |
| Legacy projection engine | Landed | Manifest declares the research surface as `project` / `legacy-jsonl-row-v1` / `event` |
| Cutover binding resolver | Landed this epic | Ten tests, refusal-focused |

No external dependency is added. Everything this phase needs is already in the repository.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The operator ratified a direct flip with no rollback window for authority transitions. That policy governs the phases
that move authority; it does not apply here, because this phase moves no authority.

While the gateway is additive, reverting it is deleting the new module and its tests. Nothing calls it yet, so nothing
regresses. That property ends the moment `002` migrates a protocol onto it, which is precisely why the reader contract
and the negative controls are blocking gates in this phase rather than the next one.
<!-- /ANCHOR:rollback -->
