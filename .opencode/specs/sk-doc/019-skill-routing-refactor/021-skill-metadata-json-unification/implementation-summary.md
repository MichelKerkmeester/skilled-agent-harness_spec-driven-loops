---
title: "Implementation Summary: Skill Root Metadata JSON Unification"
description: "Shipped state: a two-class root-metadata contract enforced by a SKILL.md-first fleet gate, canonical create-skill doctrine, shared judgment across doctor and package validation, and sk-git remediated to conforming. Active fleet is 11/11 after a post-ship root removal."
trigger_phrases:
  - "skill metadata unification shipped"
  - "skill root class gate result"
  - "sk-git metadata remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-skill-metadata-json-unification"
    last_updated_at: "2026-07-28T05:53:30Z"
    last_updated_by: "claude-code"
    recent_action: "Applied the eight-fix conformance pass with cross-model verification"
    next_safe_action: "None; packet complete and pushed — future contract changes start a new phase"
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
    open_questions: []
    answered_questions:
      - "Standalone alias files are a derivable identity projection; hub alias files are authored relocations"
      - "No production advisor consumer reads a skill-root description.json, so it is hub-only"
      - "Root framework pointer and fleet CI wiring resolved in 2fa9fc480c; AGENTS.md:450 and routing-registry-drift.yml:99-108"
      - "Post-ship active fleet is 11 roots; system-code-graph was removed after packet authoring"
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

The packet's twelve-root ship-time fleet conformed to one of two documented classes, and a gate enforces it. **Current state: 11/11 active roots conform** (post-ship audit 2026-07-28); `system-code-graph` was removed after packet authoring. The gate is idempotent — a second `--fix` pass on a conforming tree writes nothing.

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

**S — standalone routed-resource skill** (4 active roots): `mcp-code-mode`, `sk-git`, `system-skill-advisor`, `system-spec-kit`. Requires `graph-metadata.json`, authored `leaf-manifest.config.json`, generated `leaf-manifest.json` and `leaf-aliases.json`. `system-code-graph` was an S root in the ship-time 12-root fleet and was removed afterward; its historical measurements remain below.

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

The following alias measurement is historical ship-time evidence; `system-code-graph` was removed after packet authoring, so its 53/53 row is not current membership.

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

The rows below preserve ship-time outputs from the 12-root fleet as historical evidence. The post-ship audit dated 2026-07-28 reports the current 11-root fleet.

| Gate | Command | Observed |
|---|---|---|
| Class gate | `ci-skill-root-metadata.cjs` | Ship-time: `checked=12 passed=12 failed=0`; post-ship: `checked=11 passed=11 failed=0` |
| Idempotence | `ci-skill-root-metadata.cjs --fix` | `fixed=0` |
| Contract + gate tests | `tests/skill-root-metadata-contract.test.cjs` | passed, 21 tests |
| Freshness gate | `ci-leaf-manifest-freshness.cjs` | Ship-time: `checked=12 fresh=12 failed=0` (was 11 manifests); post-ship: `checked=11 fresh=11 failed=0` |
| create-skill suite | `scripts/tests/*.test.cjs` | 5/5 pass |
| Doctor suite | `doctor/scripts/tests/*.test.cjs` | pass, 3/3 deterministic |
| Per-hub rule | `parent-skill-check.cjs` × 7 hubs | `11a-class` PASS on all 7 |

**Mutation-checked.** The fleet assertions are load-bearing, not vacuous: removing `sk-git`'s config fails with `class S requires leaf-manifest.config.json`, and planting `leaf-manifest.config.json` on `sk-doc` fails with `class H forbids leaf-manifest.config.json`.

**Cross-AI review (2026-07-28).** GLM-5.2 (`cli-devin`) adversarial review returned one P0 claiming `ci-leaf-manifest-freshness.cjs` was missing; that finding was **REFUTED** because the reviewer's search sandbox could not see `.opencode/`, while the file exists and runs. One P2 about the `isSkillShapedGraph` edges-only disjunction was adjudicated **NO-CHANGE** because the gate deliberately mirrors the advisor ingestion discriminator in `skill-graph-db.ts` (`skill_id|family|edges`) and no continuity file carries `edges`. One P2 about the `kind` label on XOR roots was **CONFIRMED** and fixed in `validate_skill_package.py`.

**Side effects, verified.** Two committed standalone alias files (`system-spec-kit`, `mcp-code-mode`) were reordered into manifest order for byte reproducibility — confirmed set-identical (48→48, 7→7 rows), and every consumer reads these rows as a set rather than positionally. Adding the canonical doc made `sk-doc`'s manifest stale; it was regenerated and now carries the doc as a leaf under both consuming modes.

**Conformance pass (2026-07-28, LUNA-writes / SOL-verifies).** A post-landing audit against the `sk-code/code-opencode` standards and the doc surface produced eight fixes, written by GPT-5.6-LUNA (xhigh) and adversarially verified by GPT-5.6-SOL (high, verdict CLEAN with two P2s, both applied): shebang removed from the pure contract library; the tests README gained the missing row and run command; the doctor header now names checks 10–11 and the correct strict-flag range; the canonical doc's fleet table reflects the live 11 roots (version 1.0.1.0); three stale `leaf-manifest.config.json` `_note` fields now state the derived-projection rule; `init_skill.py` scaffolds class-conforming standalone roots (`graph-metadata.json` + `leaf-manifest.config.json`, proven end-to-end by scaffolding a temp skill that passes the fleet gate with `--fix` and re-runs clean); the sk-doc hub router carries the contract's five trigger phrases (compiled manifest re-minted, guard back at its pre-existing baseline); and `validation-and-packaging.md` documents both completion gates with a link to the canonical contract. Deliberately skipped as out of scope: directory-wide missing JSDoc `@param/@returns` tags (pre-existing drift shared by every sibling) and the box-header inconsistency inside sk-code's own standards docs.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

**Landed.** The packet's four commits were rebased onto the moving origin tip and pushed to `origin/skilled/v4.0.0.0` at `2fa9fc480c` on 2026-07-28, followed by the reconciliation commits through `c95b899bdc` and this conformance pass. The local main-tree `skilled/v4.0.0.0` diverged during landing (same-subject rebased duplicates from a concurrent session) and is left for its owning session to reconcile.

**Post-ship root inventory.** `system-code-graph` was removed after the packet was authored against a 12-root fleet. Current class and freshness gates report 11/11; ship-time 12-root measurements remain labeled as historical evidence.

**Worktree toolchain is incomplete.** The worktree lacks `scripts/node_modules`, so three validation rules that shell out to `tsx` cannot run there; the packet is validated from the main tree instead, which has that dependency.

**Unrelated pre-existing blocker, since repaired.** During landing, the main tree's `system-spec-kit/mcp-server/node_modules` was found hollow (`zod` an empty directory, roughly half the declared packages absent), which broke `validate.sh` repo-wide. It was repaired by reinstall during the post-ship reconciliation; noted here because it shaped where validation could run during this packet's build.

**Overlay widening remains manual by design.** Generalizing `command-metadata.json` to other roots requires a shared schema and a root-enumerating consumer, not another copy. The contract makes that a deliberate edit to one list rather than an accident.
<!-- /ANCHOR:limitations -->

---
