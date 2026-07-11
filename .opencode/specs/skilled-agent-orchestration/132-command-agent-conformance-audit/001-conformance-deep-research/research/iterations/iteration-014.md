# Iteration 14

## Focus

Should create-agent call the system-spec-kit command workflow directly? (carried since iteration 5 — answered in principle at iteration 7/10, implementation not yet applied). This iteration verifies current on-disk state, then produces the concrete implementation-level fix specification (exact line ranges, residue sites, consumer coupling) needed to move from "answered in principle" to "ready to implement."

## Actions Taken

1. Read iteration-007.md and iteration-010.md narratives to reconstruct the "answered in principle" decision: direct invocation of the system-spec-kit workflow (matching `create_command_auto.yaml`'s sibling pattern), not a new typed handoff field.
2. Re-verified current on-disk state of `create_agent_auto.yaml:289-312` and `create_agent_confirm.yaml:322-345` — confirmed the `agent_availability.agent_file: "[runtime_agent_path]/speckit.md"` block is still present in both files, unchanged since iteration 7's discovery.
3. Read the sibling precedent pattern at `create_command_auto.yaml:287-300` — confirmed it has NO `agent_availability` block, uses a simple activity prose line ("Create or update Level 1 spec.md, plan.md, and tasks.md through the active spec-folder workflow"), and emits plain `created_or_updated` output keys.
4. Ran `rg -n 'runtime_agent_path'` across both create-agent files to enumerate ALL `[runtime_agent_path]` interpolation consumers and determine whether removing the speckit.md block would orphan the `runtime_agent_path_resolution` config block.
5. Cross-referenced the consumer inventory against the current 12-agent directory to classify each `agent_file:` target as live or dead.

## Findings

### F-iter014-speckit-still-unapplied (P0, commands — confirms P0-C3 unchanged)

The fix described in iterations 7 and 10 has NOT been applied. Both files still carry the dead `speckit.md` agent reference:

- `create_agent_auto.yaml:300-305` — full `agent_availability` block with `agent_file: "[runtime_agent_path]/speckit.md"`
- `create_agent_confirm.yaml:333-338` — identical block

No intervening commit has remediated these sites since their discovery.

### F-iter014-output-residue-created-via-speckit (P1, commands — NEW, not captured in prior iterations)

Both files carry downstream output-key residue tied to the dead speckit agent that prior iterations' fix descriptions did not enumerate:

- `create_agent_auto.yaml:311-312`: `spec.md: created_via_speckit` / `plan.md: created_via_speckit`
- `create_agent_confirm.yaml:344-345`: `spec.md: created_via_speckit` / `plan.md: created_via_speckit`

The sibling `create_command_auto.yaml:298-300` uses plain `created_or_updated`. Any implementation of P0-C3 must also update these 4 output keys, not just remove the `agent_availability` block, or the workflow's declared outputs will continue to reference a retired agent by name.

**Fix**: Change `created_via_speckit` → `created_or_updated` at all 4 sites (2 per file), matching `create_command_auto.yaml`'s output vocabulary.

### F-iter014-runtime-agent-path-consumer-coupling (P1, cross-surface — NEW)

`[runtime_agent_path]` is interpolated at **5 sites per file**, not just the speckit.md block:

| Site | Auto line | Confirm line | Target | Status |
|------|-----------|-------------|--------|--------|
| Output directory default | 109 | 110 | `[runtime_agent_path]/` | **live** (path resolution) |
| agent_path_local | 136 | 137 | `[runtime_agent_path]/` | **live** (path resolution) |
| agent_file (step_1b) | 270 | 294 | `context.md` | **live** agent |
| agent_file (step_1c) | 301 | 334 | `speckit.md` | **dead** (P0-C3) |
| agent_file (step_4) | 523 | 595 | `write.md` | **dead** (P0-C4) |

Implication for P0-C3 implementation: removing the `agent_availability` block at step_1c does NOT orphan `runtime_agent_path_resolution` (lines 44-46 / 45-47) — it has 3 surviving consumers (output dir, agent_path_local, context.md). The singular-path fix (P0-C2: `.opencode/agent` → `.opencode/agents`) remains load-bearing and MUST be applied before or alongside the speckit.md removal, because the surviving `context.md` consumer at line 270/294 interpolates the same broken singular path on the non-Claude branch.

**Fix**: Sequence P0-C2 (plural path) and P0-C3 (remove speckit.md block) together. After both are applied, `runtime_agent_path_resolution` has 3 live consumers and is correctly configured. Do not remove the resolution block.

### F-iter014-concrete-implementation-diff (P0, commands — implementation specification)

The complete, line-level implementation for resolving the iteration-5 focus question, derived from comparing the create-agent files against the create-command sibling pattern:

**`create_agent_auto.yaml`:**
1. Line 299: Keep `"Route spec.md and plan.md creation through distributed governance (AGENTS.md Rule 5)"` (already correct activity prose — matches sibling intent).
2. Lines 300-305: **Delete** the entire `agent_availability:` block (6 lines).
3. Lines 311-312: Change `created_via_speckit` → `created_or_updated`.
4. Line 45: Change `default: .opencode/agent` → `default: .opencode/agents` (P0-C2, prerequisite).

**`create_agent_confirm.yaml`:**
1. Line 332: Keep the existing distributed-governance activity prose.
2. Lines 333-338: **Delete** the entire `agent_availability:` block (6 lines).
3. Lines 344-345: Change `created_via_speckit` → `created_or_updated`.
4. Line 46: Change `default: .opencode/agent` → `default: .opencode/agents` (P0-C2, prerequisite).

Net effect: create-agent's step_1c becomes structurally identical to create-command's step_1c — no `agent_availability` block, direct distributed-governance routing, clean output keys.

## Questions Answered

1. **Should create-agent call the system-spec-kit command workflow directly?** — **RESOLVED FINAL (implementation-ready).** Answer: Yes, direct invocation. No new typed handoff field. This was established in principle at iteration 7 and confirmed at iteration 10; this iteration adds the concrete line-level implementation specification (F-iter014-concrete-implementation-diff) and surfaces two previously-uncaptured implementation prerequisites: the `created_via_speckit` output-key residue (F-iter014-output-residue) and the P0-C2/P0-C3 sequencing coupling via `runtime_agent_path_resolution` shared consumers (F-iter014-runtime-agent-path-consumer-coupling). The question can now move from "answered in principle" to "ready to implement" — the implementation owner has exact line ranges, the sibling template, and the coupling constraint.

## Questions Remaining

- Which remaining router-level allowed-tool grants are unused overgrants after route-specific reconciliation? (carried since iteration 5)
- Should runtime directory inventories be generated from runtime capability metadata rather than repeated in command YAML? (carried since iteration 5)
- Should `compile-command-contracts.cjs` be wired into a pre-commit/CI hook? (carried since iteration 6)
- Should doctor `_routes.yaml` trigger_phrases be actively wired into the advisor's signal map? (carried since iteration 6 — the "is the header wrong" sub-question was resolved at iter 13; the "should it be wired" sub-question remains)
- Does canonical skill-graph reindex remove every retired topology node, or are source metadata changes also required? (carried since iteration 2)
- Is `.codex/agents` intended to be restored as a generated mirror in a later phase? (carried since iteration 3)
- Should `mutation_boundaries:` become a cross-family workflow-YAML convention? (inventory complete at iter 10; adoption decision deferred — iter 13 resolved: No, correctly doctor-specific)

## Next Focus

With the create-agent focus question now fully resolved at the implementation-specification level, the penultimate iteration (15 of 15) should perform the final synthesis pass: consolidate all 14 iterations' findings into the definitive ranked P0/P1/P2 table, explicitly close or defer each remaining open question, and check for cross-iteration contradictions or findings that may have been fixed on disk since their original discovery iteration.
