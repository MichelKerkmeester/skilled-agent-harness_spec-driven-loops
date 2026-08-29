---
title: "Implementation Plan: Automated Repair of Derived Packet Failures"
description: "Harden the repair tool, prove it with fixtures, audit the generators that produce derived fields, wire it into a workflow in reporting mode, and measure the fleet delta."
trigger_phrases:
  - "derived repair plan"
  - "repair-derived plan"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/039-derived-repair-automation"
    last_updated_at: "2026-08-28T16:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the implementation plan for the derived-repair tool"
    next_safe_action: "Harden the repair tool and add its fixture tests"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/spec/repair-derived.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Automated Repair of Derived Packet Failures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

A working prototype already repairs the derived classes and refuses the rest.
This plan takes it from prototype to something that can be trusted unattended:
argument handling that cannot write outside the specs tree, tests that prove
both the repair and the refusal, an audit of the generators that produce these
fields, reporting-mode wiring into an existing workflow, and a measured fleet
run.

The shape follows an existing precedent in the repository, a fleet checker that
regenerates derived manifests, leaves authored files alone, and runs in CI
without its repair flag. This tool is the same idea applied to spec packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The tool's own tests pass.
- A packet broken in each derived way is restored, verified against the
  committed version rather than by assertion.
- A second run over a repaired packet produces no change.
- An authored-only packet is reported and left byte-identical.
- The workflow step passes in reporting mode.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The tool is a single script with no service dependencies. For each packet it
asks the validator what is wrong, partitions the reported rules against an
explicit allow-list of repairable ones, and acts only on that intersection.

Three repairs are implemented, each recomputed rather than guessed. The recorded
folder name and the pointer carried in document frontmatter both come from the
packet's path on disk. The declared level comes from the validator's own
detection. Generated metadata is re-derived by the existing backfill entry
point.

Re-derivation is part of the repair rather than a following step, because
editing a document invalidates the fingerprint taken over it. A repair that
stopped before re-deriving would replace one error with another, which the
prototype demonstrated before the ordering was fixed.

Everything outside the allow-list is counted and reported by rule. That report
is the tool's second product and is what tells a reader how much of the
remaining debt is authored.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Hardening

Argument validation, refusal of any target outside the specs tree, handling of
both validator report shapes, and exit codes that separate clean from
repairable from failed.

### Phase 2: Fixture tests

A fixture packet broken in each derived way, and one carrying only authored
failures. The repair path and the refusal path are both asserted on file
contents.

### Phase 3: Generator audit

The generators that emit derived fields are checked for the omission already
found in one of them, where a field was written only when passed explicitly.

### Phase 4: Workflow wiring

A reporting-mode step in an existing workflow, mirroring the precedent that runs
its checker without the repair flag.

### Phase 5: Fleet run

Dry-run report, then a scoped application, then a sweep to measure the delta
rather than assert it.

### Phase 6: Documentation

A readme stating what is repaired, what is refused, and why the refusal is
deliberate rather than an omission.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Fixtures are packets constructed for the purpose, not live ones. Each derived
class gets a fixture broken in exactly that way, and the test asserts the value
after repair equals the value computed from the fixture's own location.

The refusal path matters as much as the repair path. A fixture carrying only
authored failures must come back byte-identical, and that is asserted on file
contents rather than on the tool's own report of what it did.

Idempotence is covered by running the tool twice and requiring the second run to
report nothing and change nothing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The validator, for diagnosis and level detection.
- The graph-metadata backfill entry point, for re-derivation.
- Node, with no additional packages.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The tool is additive; deleting the script and its workflow step returns the
repository to its prior behaviour. Repairs it has applied are ordinary commits
and revert like any other. Nothing it writes is load-bearing at runtime.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

A fleet application is the only change with meaningful blast radius. It is
applied as its own commit containing nothing else, so reverting that commit
undoes every repair without disturbing the tool, the tests, or the workflow.

Because repairs are recomputed rather than invented, re-running after a revert
reproduces the same result, so a revert is recoverable rather than a one-way
door.
<!-- /ANCHOR:enhanced-rollback -->
