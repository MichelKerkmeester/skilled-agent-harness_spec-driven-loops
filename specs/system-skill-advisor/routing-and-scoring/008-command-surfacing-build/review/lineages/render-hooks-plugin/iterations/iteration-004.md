# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin`)
- Session: `fanout-render-hooks-plugin-1794550137809-1ecgc7`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin`
- Operator review focus addressed this iteration: behaviour on claude, codex, opencode, pi, devin and dsh, read through the maintainability lens — whether the runtime vocabulary that names those six is kept in one place, and whether the child-session marker they all depend on is interpreted once. The mutating-command question is carried forward through the duplicated-marker finding below.
- Budget profile: `scan` (10 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts:1-25`
- `.skilled/skills/system-skill-advisor/runtime/lib/embedders/index.ts:1-42`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts:1-128`
- `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts:40-120`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:1-199`
- `.skilled/hooks/shared/session-readers/index.mjs:28-75`
- `.skilled/hooks/shared/tests/session-readers/cursor.test.mjs:11-20`
- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:71-140`, `:98-118`, `:214-310`
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` (header and size)
- `.skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts` (header and size)
- `AGENTS.md:45`, `:64-65`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:38`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A fourth hand-spelled runtime list sits outside the parity test that exists to catch exactly this** -- `.skilled/hooks/shared/session-readers/index.mjs:28` -- the `capabilities` table spells `claude`, `codex`, `pi`, `opencode`, `devin`, `dsh` and `cursor` by hand, the same seven names `advisor-runtime-values.ts:10-18` holds as the "single source of truth". `advisor-runtime-list-parity.vitest.ts:3-9` says the set is spelled in three places and ties together the hooks-tree index directories, the hook reference adapter table and `ADVISOR_RUNTIME_VALUES`; the capability table is not one of the three and no test compares it to the tuple.
Finding class: class-of-bug
Scope proof: `rg -n "ADVISOR_RUNTIME_VALUES" .skilled/hooks/shared/tests/session-readers` returns nothing, and `cursor.test.mjs:19` asserts `Object.keys(capabilities)` against the test's own literal, so the fourth copy is anchored to a fifth copy rather than to the tuple.
Affected surface hints: ["session-reader dispatcher", "advisor runtime tuple", "runtime parity test"]
Case: a runtime is added to `ADVISOR_RUNTIME_VALUES`; the parity test passes because all three lists it knows about were updated, no test fails because `capabilities` was missed, and `readSession` returns `capability_gated` for the new runtime forever.

2. **The child-session marker is interpreted twice, once through an exported constant and once as a hard-coded literal** -- `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:101` -- the spec-gate core exports `CHILD_SESSION_ENV = 'AI_SESSION_CHILD'` and `isChildSession(env)` (`:104-106`), while `render.ts:522` writes `process.env.AI_SESSION_CHILD === '1'` inline. Both accept exactly `'1'` today, so behaviour agrees; the duplication is that one tree owns the marker and the other names it without importing the constant.
Finding class: cross-consumer
Scope proof: `rg -n "AI_SESSION_CHILD"` across the advisor skill, the spec-gate core, `.skilled/hooks` and `.opencode/plugins` (excluding `dist/`) returns the constant and function in `spec-gate-core.mjs`, the inline comparison in `render.ts:522`, and test-only stubs; there is no third production reader.
Affected surface hints: ["brief renderer", "spec-gate core", "child-session policy"]
Case: the child marker gains a second accepted value; the spec-gate core is updated through `isChildSession`, the advisor renderer keeps comparing to `'1'`, and a child stops receiving the `(parent-named only)` downgrade while the spec gate still treats it as a child.

3. **The operator-facing direct-call example puts the prompt in argv, against the guarantee the hook path keeps** -- `AGENTS.md:65` -- the Gate 2 direct call is documented as `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"[request]"}' --format json`, while the sentence immediately above points the reader at `skill-advisor-hook.md`, whose `:38` states that the hook "writes the request to the CLI's stdin, so the prompt never appears in the process table". The manual path is not the hook path, but the document offers the argv form as the way to diagnose the same behaviour.
Finding class: instance-only
Scope proof: `AGENTS.md:65` is the only direct-call example in the root file, and `skill-advisor-hook.md:38` is the only place the stdin guarantee is stated; `skill-advisor-cli-fallback.ts:277-278` implements that guarantee for the hook.
Affected surface hints: ["root AGENTS.md Gate 2", "advisor CLI front door", "hook documentation"]
Case: an operator follows the Gate 2 example to diagnose a routing miss and the prompt they are debugging lands in the process table, which is the exposure the hook path was built to avoid.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Unchanged from iteration 3. |
| `checklist_evidence` | core | notApplicable | No checklist rows for this area. |
| `skill_agent` | overlay | partial | `AGENTS.md:64` routes Gate 2 to `skill-advisor-hook.md`; that document exists and describes the same hook the CLI implements. The `skill_agent` gap is the dist-half of the Claude chain, unread in iteration 3. |
| `agent_cross_runtime` | overlay | pass | The runtime tuple (`advisor-runtime-values.ts:10-18`) and the capability table (`index.mjs:28-65`) name the same seven runtimes in different orders; the set agrees, the ownership does not (finding 1). |
| `feature_catalog_code` | overlay | pass | Unchanged from iteration 3. |
| `playbook_capability` | overlay | notApplicable | No playbook row for this area. |

## Test-to-Behaviour Fit

- `render-child-session.vitest.ts:48-112` pins seven child-session cases, including `AI_SESSION_CHILD` unset, `'0'` and `'1'`, so finding 2's rule is tested on the renderer side even though the marker is duplicated.
- `advisor-runtime-list-parity.vitest.ts:100-128` builds its reference set from the union of the three lists it knows, which is why a missing fourth list cannot fail it (finding 1).
- `injected-text.test.mjs:174-206` covers DSH operator and non-operator source kinds but not the absent-source case recorded as R1-P2-003; that remains the one unexercised branch in the four readers.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:39` defines the tool table locally and `:189` maps it into the exported manifest, so the manifest derives from one in-file table rather than restating the CLI's schema.
- `spec-gate-core.mjs:103-106` documents the marker's accepted value in a doc comment beside the constant, which is the shape the renderer's inline comparison lacks.
- `AGENTS.md:45` names `.skilled/bin/skill-advisor.cjs` as a Gate Action, and `:65` is the only place the direct-call form is spelled.

## Edge Cases

- **Coverage gap recorded, not claimed:** `spec-gate-core.mjs` is 1888 lines and only its constants, marker helper and shadow-receipt block (`:71-140`, `:214-310`) were read. `sync-runtime-mirrors.cjs` (465 lines) and `embedders/schema.ts` (377 lines) were read for structure only. No maintainability claim is made about their internals, and synthesis must not read this iteration as full coverage of those three files.
- **Runtime order differs by design:** the capability table orders runtimes by locale-of-use and the tuple orders them by adoption; the parity test normalizes and sorts, so order is not a finding.
- **Declaration files:** not re-entered, per the exhausted-approach record.

## Confirmed-Clean Surfaces

- `advisor-runtime-values.ts:10-24` is a genuine single source for the type union and the guard; the type derives from the tuple rather than restating it.
- `embedders/index.ts:13-42` re-exports only; no logic is duplicated in the barrel.
- `skill-advisor-cli-manifest.ts:189` derives the exported manifest from the local table instead of restating it.
- `render-child-session.vitest.ts` covers the downgrade path closely enough that a regression in `parentNamedOnly` would fail a test.
- No `TODO`, `FIXME` or `HACK` marker exists in `system-skill-advisor.js`, the four reviewed readers, `render.ts` or `subprocess.ts`.

## Ruled Out

- "The plugin re-implements the brief renderer": ruled out. `.opencode/plugins/lib/skill-advisor-render.js` carries the fallback and compiled-route renderers only, and the plugin consumes the CLI-rendered `brief` (`system-skill-advisor.js:1554-1557`).
- "`spec-gate-core.mjs` duplicates the advisor's render logic": ruled out. The overlap is the child marker alone (finding 2), and the core's receipt and sweep code has no counterpart in the advisor tree.
- "The runtime tuple and the hook reference table disagree": ruled out. `advisor-runtime-list-parity.vitest.ts:100-128` would fail.
- "The manifest restates the CLI schema": ruled out. The manifest is derived at `:189`.

## Next Focus

- Dimension: cross-reference adjudication
- Focus area: re-verify every active finding against the current files, confirm the convergence state, and close or downgrade anything the documentary evidence no longer supports.
- Reason: four dimensions are covered and the remaining budget is one iteration; the highest-value use of it is a referee pass over the active set rather than a new discovery sweep.
- Rotation status: D1, D2, D3, D4 complete; adjudication next.
- Blocked/productive carry-forward: `.d.mts` parity stays blocked; the runtime-list and child-marker checks are exhausted as discovery directions and become re-verification targets only.
- Required evidence: a fresh `file:line` read for every active P0/P1 (there are none) and a one-line confirmation for each active P2.

Review verdict: PASS
