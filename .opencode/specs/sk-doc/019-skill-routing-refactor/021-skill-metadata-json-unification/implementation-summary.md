---
title: "Implementation Summary: Skill Root Metadata JSON Unification"
description: "Shipped state: a two-class root-metadata contract enforced by a SKILL.md-first fleet gate, canonical create-skill doctrine, shared judgment across doctor and package validation, and sk-git remediated to conforming. Fleet is 12/12."
trigger_phrases:
  - "skill metadata unification shipped"
  - "skill root class gate result"
  - "sk-git metadata remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-27T20:31:30Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped all six phases; fleet gate 12/12, idempotent, all suites green"
    next_safe_action: "Operator review and merge of worktree branch sk-doc/0112-skill-metadata-json-unification"
    blockers:
      - "Uncommitted: worktree is dirty by design pending operator review"
      - "MAIN tree system-spec-kit/mcp-server/node_modules is hollow, which breaks validate.sh there; pre-existing and unrelated to this packet"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "021-skill-metadata-json-unification-build"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should the root framework doc's advisor-metadata paragraph point directly at the new canonical contract? Deferred to avoid contending with a concurrent session editing that file."
    answered_questions:
      - "Standalone alias files are a derivable identity projection; hub alias files are authored relocations"
      - "No production advisor consumer reads a skill-root description.json, so it is hub-only"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Summary: Skill Root Metadata JSON Unification

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-07-27 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Branch** | `sk-doc/0112-skill-metadata-json-unification` |
| **Base** | `skilled/v4.0.0.0` at `f8399bf5a0` |
| **Worktree** | `.worktrees/0112-sk-doc-skill-metadata-json-unification` |
| **Research Source** | `research/lineages/sol-high-fast/research.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The fleet's twelve skill roots now conform to one of two documented classes, and a gate enforces it. **Current state: 12/12 roots conform**, and the gate is idempotent — a second `--fix` pass on a conforming tree writes nothing.

| Deliverable | Path |
|---|---|
| Pure class library | `sk-doc/create-skill/scripts/lib/skill-root-metadata-contract.cjs` |
| Fleet gate | `sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs` |
| Unit + gate coverage (21 tests) | `sk-doc/create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` |
| Canonical doctrine | `sk-doc/create-skill/references/shared/skill-root-metadata-contract.md` |
| Per-hub rule 11 | `commands/doctor/scripts/parent-skill-check.cjs` |
| XOR guard | `sk-doc/create-skill/scripts/validate_skill_package.py` |
| Doctor route | `commands/doctor/_routes.yaml` (`parent-skill` target) |
| `sk-git` remediation | `sk-git/leaf-manifest.config.json` + two derived files |

### The two classes

**H — packet hub** (7 roots): `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, `system-deep-loop`. Requires `graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`, generated `leaf-manifest.json`.

**S — standalone routed-resource skill** (5 roots): `mcp-code-mode`, `sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`. Requires `graph-metadata.json`, authored `leaf-manifest.config.json`, generated `leaf-manifest.json` and `leaf-aliases.json`.

The discriminator is the `mode-registry.json` + `hub-router.json` pair: both means H, neither means S, exactly one is rejected as a half-written declaration.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six phases, ordered by the one hard dependency: every other surface consumes the class judgment, so the pure library landed first.

1. **Pure class library** — filenames, discriminator, required/forbidden/optional/overlay/generated sets, `evaluateRoot()`. No filesystem access, so the fleet gate and the per-hub audit reach identical verdicts and cannot drift apart.
2. **Fleet gate** — discovery from `SKILL.md`, presence evaluation, nested-identity detection by content discriminator, generated-file regeneration and byte-compare **including when the file is absent**, `--fix` scoped to derivable files.
3. **Alias projection** — measured the committed alias files, found the class split, encoded it, canonicalized two out-of-order standalone files.
4. **Canonical doc and pointers** — one document; every other touched doc carries a pointer and restates nothing.
5. **Consumer wiring** — doctor route runs the fleet gate before the per-hub audit; `parent-skill-check.cjs` gained rule 11; `validate_skill_package.py` now rejects the XOR half-declaration.
6. **`sk-git` remediation** — one authored config, then `--fix` derived a 65-leaf manifest and its alias projection.

### Why the drift was invisible

Confirmed against source, not inferred. Every gate was conditional on the file already existing, so none could report a file that was never written:

1. `parent-skill-check.cjs:237-238` takes one target directory per invocation, and its description rule reads "required for all **hubs**" — standalone roots were never in scope.
2. Its leaf-manifest block is documented opt-in (`:1067-1070`): a hub with no manifest "has not opted in, so this whole block stays silent for it."
3. `ci-leaf-manifest-freshness.cjs:11` is fleet-wide but walks *committed* manifests. A scanner that begins at outputs cannot report a missing output.

The fix is ordering: the new gate starts from `SKILL.md`, the one marker that exists before any tooling has run, so an unadopted root becomes a finding instead of a silence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Six ADRs are recorded in `decision-record.md`. The four that changed the outcome:

**`description.json` is hub-only and standalone-forbidden (ADR-003).** The "five skills are missing `description.json`" framing was wrong. No production advisor consumer reads a skill-root `description.json` — the advisor ingests `graph-metadata.json`. Four of those five are conforming standalone roots; only `sk-git` was defective. Forbidding rather than merely not-requiring means a future well-meaning backfill fails the gate instead of landing silently.

**Alias generation splits on class (ADR-004)** — a deliberate, evidence-backed deviation from the research report, which concluded aliases must stay authored everywhere. Measurement showed that holds only for hubs:

| Root | Class | Rows | Identity map? |
|---|---|---:|---|
| `system-skill-advisor` | S | 103 | yes |
| `system-spec-kit` | S | 48 | yes |
| `system-code-graph` | S | 53 | yes |
| `mcp-code-mode` | S | 7 | yes |
| `sk-doc` | H | 6 | **no** — rows relocate into `shared/` |

A single-mode root collapses the workflowMode/resourceId/diskPath triple to identity, so the file carries nothing the manifest lacks and a hand-maintained copy rots the moment a leaf lands. Consequence: `sk-git` needed exactly **one** authored metadata file.

**`command-metadata.json` stays a scoped overlay (ADR-005).** Its four consumer surfaces derive the `sk-design` root or use a fixed hub allowlist; none enumerates roots. Copying it elsewhere would produce a file no consumer can find, so a copy now fails the gate.

**`sk-git` is a defective standalone root, not a sparse third class (ADR-006).** It exhibits standalone routing behaviour and was simply missing its files. Defining a class for it would have ratified the drift.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Command | Observed |
|---|---|---|
| Class gate | `ci-skill-root-metadata.cjs` | `checked=12 passed=12 failed=0` |
| Idempotence | `ci-skill-root-metadata.cjs --fix` | `fixed=0` |
| Contract + gate tests | `tests/skill-root-metadata-contract.test.cjs` | passed, 21 tests |
| Freshness gate | `ci-leaf-manifest-freshness.cjs` | `checked=12 fresh=12 failed=0` (was 11 manifests) |
| create-skill suite | `scripts/tests/*.test.cjs` | 5/5 pass |
| Doctor suite | `doctor/scripts/tests/*.test.cjs` | pass, 3/3 deterministic |
| Per-hub rule | `parent-skill-check.cjs` × 7 hubs | `11a-class` PASS on all 7 |

**Mutation-checked.** The fleet assertions are load-bearing, not vacuous: removing `sk-git`'s config fails with `class S requires leaf-manifest.config.json`, and planting `leaf-manifest.config.json` on `sk-doc` fails with `class H forbids leaf-manifest.config.json`.

**Side effects, verified.** Two committed standalone alias files (`system-spec-kit`, `mcp-code-mode`) were reordered into manifest order for byte reproducibility — confirmed set-identical (48→48, 7→7 rows), and every consumer reads these rows as a set rather than positionally. Adding the canonical doc made `sk-doc`'s manifest stale; it was regenerated and now carries the doc as a leaf under both consuming modes.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Nothing is committed.** All work is uncommitted in worktree `.worktrees/0112-sk-doc-skill-metadata-json-unification` on branch `sk-doc/0112-skill-metadata-json-unification`, based on `skilled/v4.0.0.0` at `f8399bf5a0`. Commit and merge are operator decisions.

**Root framework doc pointer deferred.** The advisor-metadata-placement paragraph in the root framework doc still points at `parent-skills-nested-packets.md` rather than directly at the new canonical contract. That file was being edited by a concurrent session during this build, so the pointer was routed through `parent-skills-nested-packets.md` instead — which now names the canonical contract, so the chain resolves either way.

**Worktree toolchain is incomplete.** The worktree lacks `scripts/node_modules`, so three validation rules that shell out to `tsx` cannot run there; the packet is validated from the main tree instead, which has that dependency.

**Unrelated pre-existing blocker.** In the main tree, `system-spec-kit/mcp-server/node_modules` is hollow — `zod` is an empty directory and roughly half the declared packages are absent. It has no `package-lock.json`, so a repair resolves fresh versions across the memory MCP server. Not caused by this packet and not repaired here.

**Overlay widening remains manual by design.** Generalizing `command-metadata.json` to other roots requires a shared schema and a root-enumerating consumer, not another copy. The contract makes that a deliberate edit to one list rather than an accident.
<!-- /ANCHOR:limitations -->

---
