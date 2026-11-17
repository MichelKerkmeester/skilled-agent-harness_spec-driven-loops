# Review Iteration 003

## Dispatcher

- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Target type: spec-folder (fan-out lineage `scorer-attach`)
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach`
- Session: `fanout-scorer-attach-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Dimension: traceability
- Budget profile: verify (11-13 calls)
- Prior findings: P0=0 P1=0 P2=3 (carried forward, still active)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:4-9,1-3155` (counts and generated entry set)
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:1-79`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:17-39`
- `.skilled/skills/system-skill-advisor/README.md:135,176`
- `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:126,142`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts:9-17`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:14-42,64-122` (generated rows vs command files)
- `.skilled/commands/doctor/_routes.yaml` and the 17 router `skill_agent` tags (context evidence)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Two docs added by this change state 45 TypeScript-served command rows; the generated artifact holds 46** -- `.skilled/skills/system-skill-advisor/README.md:176` and `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:26` -- both sentences are added lines in this diff, and both say the deriver writes an `embeddingText` for "each of the 45 command rows" the TypeScript scorer serves. The generated projection shipped in the same change reports `counts.typescriptActive: 46` and 46 entries carrying `embeddingText`.
   Finding class: traceability / doc-code drift
   Scope proof: both docs are `shared`/`scorer-attach` scope entries; the contradicting artifact is `runtime/scripts/command-bridges/command-bridges.generated.json`, also in scope.
   Affected surface hints: command-meaning eligibility docs, `vec_cmd_<dim>` coverage expectations, drift-guard test narrative
   Case: a reader sizing the vector table, or checking whether every scored command row is embedded, counts 46 rows in the artifact and 45 in the doc, and cannot tell which row the doc excludes.
   Evidence: counts and per-entry `embeddingText` counted from the artifact; both doc lines read at their current line numbers; both lines added by `35c3188681..320e7b64d4`.
   Downgrade trigger: none at P2; no behavior depends on the number, only the documented contract.

2. **The runtime coverage sentence omits `dsh` while the canonical runtime set and the hook readers include it** -- `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:142` -- the edited sentence names "Claude, Codex, Cursor, Devin and Pi, plus the OpenCode plugin", six runtimes. `runtime/lib/advisor-runtime-values.ts:9-17` lists seven, `dsh` included, and `.skilled/hooks/shared/session-readers/dsh.mjs` ships in the same diff.
   Finding class: traceability / runtime coverage drift
   Scope proof: `ARCHITECTURE.md` is a `shared` scope entry; `advisor-runtime-values.ts` and the dsh reader are the code side of the same claim.
   Affected surface hints: operator-facing architecture doc, runtime label contract, hook deployment matrix
   Case: an operator asking whether the advisor runs under `dsh` reads the architecture overview, sees no dsh adapter, and concludes the runtime is unsupported even though the label set and the session reader exist.
   Evidence: the sentence read at line 142; the runtime tuple read at lines 9-17; `dsh.mjs` present on disk.
   Downgrade trigger: none at P2; a documentation gap with no runtime behavior change.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Generated tables match the authored sources; two doc sentences do not match the generated artifact (recorded above). |
| `checklist_evidence` | core | partial | The changed docs carry no checklist claims; the packet-level acceptance rows are outside this lineage's file scope. |
| `skill_agent` | overlay | pass | 36 doctor entries, 17 router `skill_agent` tags, 0 owner mismatches, 0 untagged entries (executed comparison). |
| `agent_cross_runtime` | overlay | partial | Runtime label set carries all seven labels including `dsh`; the architecture sentence omits it. |
| `feature_catalog_code` | overlay | partial | `command-meaning-matching.md` cosine (0.72) and margin (0.02) claims match `fusion.ts:853-854`; its 45-row count does not match the artifact. |
| `playbook_capability` | overlay | notApplicable | No playbook path is part of this surface. |

## Integration Evidence

- `MODE_COMMANDS`: 19 rows across three hubs; every row resolves to a real file under
  `.skilled/commands/<namespace>/<name>.md` (19/19, executed check).
- `skill_agent` ownership: the deriver copies the router tag for every doctor route; comparing all 36
  doctor entries against the 17 router files produced 0 mismatches.
- `doctor-command-routing.md:31` claims the helper hand-off names a ranked command only when its policy
  is `run`; `fusion.ts:1103-1110` implements exactly that filter.
- `command-bridges/README.md:50-54` describes the generated blocks (`COMMAND_ROWS`,
  `COMMAND_POLICIES`, `MODE_COMMANDS`, `TRACKED_COMMANDS`, `ownerSkill`) and each block exists with the
  described shape.

## Operator Focus Coverage

- Docs that disagree with code: two P2 findings recorded above, both on lines edited by this change.
- Six runtimes: the canonical set has all six plus cursor; the architecture prose is the only surface
  that omits one, and it omits `dsh`.
- Mutating-command safety: carried forward from iteration 2, no new documentation contradicts it.
- Holdout hygiene: no doc in this iteration prints or claims holdout rows; the validate schema remains
  count-only.

## Edge Cases

- "45" may have been true before this change. It is not true of the artifact the same change ships, and
  both doc sentences are newly added lines, so the drift is introduced here rather than inherited.
- The architecture sentence also omits OpenCode from the "adapters" list but names the plugin in the
  same sentence; only `dsh` is missing entirely, so the finding is scoped to `dsh`.
- The doctor route manifest is context evidence; its own content is another lineage's scope.

## Confirmed-Clean Surfaces

- Every `MODE_COMMANDS` row has a command file (19/19).
- Every doctor bridge's owner equals its router `skill_agent` tag (36/36).
- The feature-catalog cosine and margin numbers match the constants they describe.
- The generated-block description in the command-bridges README matches the four blocks that exist.

## Ruled Out

- "`MODE_COMMANDS` promises a command with no file": ruled out — 19/19 resolve.
- "Doctor bridge ownership drifted from the router tags": ruled out — 0 mismatches.
- "The cosine bar or margin in the catalog is stale": ruled out against `fusion.ts:853-854`.
- "`README.md:135`'s option list is stale": ruled out — the eight named options match the recommend
  input schema's option surface.

## Next Focus

- Dimension: maintainability
- Focus area: dead generated surfaces and leftover control flow — `COMMAND_POLICIES` consumers, the
  empty `if` in `fusion.ts`, and the `COMMAND_ROWS`/`TRACKED_COMMANDS` split
- Reason: traceability closed cleanly; the last dimension is the cost of carrying generated data that
  no surface reads
- Rotation status: next dimension in the risk order
- Blocked/productive carry-forward: the `COMMAND_POLICIES` observation from iteration 2 is ready to
  resolve
- Required evidence: an import/reference search showing zero consumers and the exact dead lines

Review verdict: PASS
