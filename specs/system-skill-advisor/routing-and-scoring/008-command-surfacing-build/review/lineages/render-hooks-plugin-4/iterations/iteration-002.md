# Review Iteration 002

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-4`, pass four)
- Session: `fanout-render-hooks-plugin-4-1794669272137-9v23rz`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the seven rows of `review/review-scope-4.txt` for this area, plus the shared docs that state their contract.
- Operator review focus addressed this iteration: the brief's "whether a refusal, a question or a mention of a command can still attach or start a mutating command" and "docs that disagree with code." This iteration read the child-downgrade path end to end (`policyWord` -> `companionCommandLabel` -> head/companion/ambiguous labels), checked every mutating doctor row against the class it prints, then read the advisor README's companion sentence against the test that pins the child form. Holdout hygiene was checked over all seven changed files.
- Budget profile: `verify` (10 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:192-266` — `parentNamedOnly`, `policyWord`, `commandLabel`, `companionCommandLabel`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:565-616` — head/partner suppression and the ambiguous companion
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:65-105` — every doctor row's `policy` and `mutating` class
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:70-116` — child marker and policy-word pins
- `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts:1-154` — child matrix and env parity
- `.skilled/skills/system-skill-advisor/README.md:121` — the companion-line sentence
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39`, `:43`, `:61` — the child marker and companion rules
- `.opencode/plugins/README.md:76`, `:157` — the renderer and mapper claims
- `.skilled/hooks/shared/session-readers/README.md:28` — the contained-open claim (carried from iteration 1)
- `.skilled/hooks/shared/session-readers/codex.mjs:142-192` — the containment path (carried from iteration 1)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The advisor README calls the companion policy run/start/ask and omits the child form the renderer prints** -- `.skilled/skills/system-skill-advisor/README.md:121` -- the sentence says the companion line carries `(<policy>)`, "where the policy is run, start or ask," but `policyWord` substitutes `parent-named only` for `start`, `ask` and any writing `run` whenever a dispatched child renders the brief (`render.ts:194-217`). The hook reference states the child rule (`hooks/skill-advisor-hook.md:39`) and the test pins the exact child output (`doctor-brief-render.vitest.ts:84`: `Also: /doctor:update (parent-named only)`), so the README is the one page that disagrees with the code it describes. The phase 021 task that wrote the sentence recorded the omission as "noted, not changed" (`021-brief-head-parity/tasks.md:79`); this review confirms the gap is observable in the pinned test and does not make the page's chosen examples wrong.
   Finding class: `documentation-gap`
   Scope proof: `rg -n -F 'where the policy is run, start or ask' .skilled/skills/system-skill-advisor/README.md` prints line 121; `render.ts:216` returns `PARENT_NAMED_POLICY` when `childSession && parentNamedOnly(...)`; `doctor-brief-render.vitest.ts:76-84` asserts `(run)` for a child on a read-only row and `(parent-named only)` on `command-doctor-update`.
   Affected surface hints: the advisor README companion paragraph; the hook reference child sentence; the `parent-named only` branch in `render.ts`; the phase 025 doc-sync pass.
   Case: A dispatched child receives a brief whose second line is `Also: /doctor:update (parent-named only)` (the exact string in `doctor-brief-render.vitest.ts:84`), while the README tells the reader the parenthesized word is only run, start or ask. The page has no sentence that names the child form.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | Phase 021's companion requirement (`spec.md:116`, `implementation-summary.md:56`) is implemented in `render.ts:258-266`; the README sentence at `:121` states a narrower policy set than the child branch prints. Finding 2 from iteration 1 remains the only code-level spec gap (head command when row 0 fails). |
| `checklist_evidence` | core | notApplicable | The phase 021 acceptance rows are read as change history, not as this code pass's closure gate. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | pass | The child rule is the same `AI_SESSION_CHILD === '1'` rule the spec gate uses (`spec-gate-core.mjs:93-104`), and `render-child-session.vitest.ts:146-153` compares the two over `'1'`, `'0'`, `'true'` and `''`. The OpenCode plugin's host-process env and the hooks' shim env both carry the convention. |
| `feature_catalog_code` | overlay | partial | `feature-catalog/cli-surface/advisor-recommend.md:33` still says the OpenCode plugin does not pass `includeCompiledRoute` (true) but does not say it now passes `compiledRouteTopOnly`; the page's top-only sentence is already a phase 025 item (`025-release-notes-and-doc-sync/tasks.md:81`), so it is recorded as a known open doc task, not a new finding. |
| `playbook_capability` | overlay | notApplicable | No playbook surface changed in this area. |

## Integration Evidence

- Dispatcher: `.skilled/commands/deep/review.md` owns the loop; this lineage runs detached and writes only under `review/lineages/render-hooks-plugin-4/`.
- Append gateway: the iteration-1 receipt is `event-5bb736ab-32e0-4c76-a4e8-98f5200ad018`; the projection refreshed from the ledger.
- Reducer: the iteration-1 reduce reported 2 open P2, `corruptionCount: 0`, no strategy warning.
- Mutating-command path: `command-attach.ts:65-105` gives every doctor row a class; `render.ts:194-199` treats `start`, `ask` and `run` with a non-read-only class as parent-named in a child. The head and companion use the same `policyWord`.
- Holdout hygiene: `rg -n "holdout|command-prompts|prompts.jsonl"` over the seven changed files returns no line. The only prompt data in this area is the bounded prompt on the CLI's stdin (`system-skill-advisor.js:848-865`), which the plugin already sends with `--json -` and no argv copy.
- Refusal/question surface: `attachCommand()` withholds a command for a mention/refusal/question (`feature-catalog/cli-surface/advisor-recommend.md:39-41`); the renderer can only print a command that survived that gate, so the child marker is applied to every mutating command that reaches it.

## Edge Cases

- **A typed command with no policy.** `commandLabel` prints a bare command when `policy` is `undefined` (`render.ts:240-243`). Every current producer attaches a policy with the command (`publicRecommendation` at `advisor-recommend.ts:359-363`, `enrichCompiledRoutes` at `:478-486`, `attachTypedCommand` at `:504-510`), so no live path reaches the bare form; recorded as future hardening, no finding.
- **A child session in the OpenCode host process.** The renderer's default reads the process env, not a per-session field. The framework's child convention is process-scoped (`spec-gate-core.mjs:93-104`), and an `opencode` dispatch is a separate process carrying `AI_SESSION_CHILD=1`; a same-process subagent is still inside that dispatched process, so the conservative marker is intended. No finding.
- **The companion's policy comes from the generated row, not the recommendation.** `companionCommandLabel` takes `skillId` and reads `commandRowFor` (`render.ts:258-266`); the head takes `recommendation.policy ?? row?.policy` (`:229`). No producer today attaches a doctor-bridge companion with a policy different from its row, so the two agree; recorded so a future typed-command companion does not silently diverge.
- **The partner-command suppression in the ambiguous branch.** `render.ts:575-582` compares the companion to `vs.command ?? commandRowFor(vs.skill)?.command`; the doctor commands are unique in `COMMAND_ROWS`, so the only reachable duplicate is the partner skill itself, already excluded by `companion.skill !== shownSecond`. The branch is defensive, not a live case; no finding.
- **Holdout paths.** No changed file names a holdout prompt or opens a prompt corpus. The transcript scorer reads sessions, not the corpus; counts only.

## Confirmed-Clean Surfaces

- The child marker is the head's own function: `commandLabel` (`render.ts:240`) and `companionCommandLabel` (`:264`) both call `policyWord`, so a companion cannot print a policy word the head would not print.
- The read-only exception is tested in both child and parent: `/doctor:env list (run)` stays visible in a child, while `/doctor:update` becomes `(parent-named only)` (`doctor-brief-render.vitest.ts:70-85`).
- The head/companion suppression is covered by the repeat case and the next-bridge case (`doctor-brief-render.vitest.ts:98-116`).
- The child flag agrees with the spec-gate core on every value in the matrix (`render-child-session.vitest.ts:146-153`).
- No changed file contains a holdout or prompt-corpus reference (search returned no line).
- The plugin's prompt request stays on stdin and out of argv (`system-skill-advisor.js:848-865`; `advisorCliArgs` uses `--json -`), so the child marker is the only mutating-command gate this area owns.

## Ruled Out

- **The companion can print a read-only command to a child without a marker.** The read-only `run` class is deliberately left visible; the child can run a read-only check. The mutating classes all gain `parent-named only`. Not a defect.
- **A child can start a mutating command through the companion line.** The line prints the command string plus `parent-named only`; the framework's enforcement is the spec gate and the dispatch guard, not the brief text. The renderer does not claim to be an enforcement boundary.
- **The README's omission is a false example.** The page's two examples do not use a child session, and the sentence's first half (the parent form) is correct; only the policy-set clause is incomplete. P2 documentation gap, not a wrong example.
- **The advisor feature catalog's top-only sentence is a new contradiction.** It is already the phase 025 task (`025-release-notes-and-doc-sync/tasks.md:81`), which the packet tracks separately.
- **The Codex containment finding is a documentation-only issue.** It is a code path finding from iteration 1; the README line is its evidence, not a second finding.

## Next Focus

- Dimension: maintainability
- Focus area: the changed tests' coverage of the new branches (plugin top-only request, Codex custom body, renderer companion), the plugin's renderer module split and dead compiled-route summary line, and the adapter README claims about the mapper.
- Reason: security and traceability are covered; the remaining dimension is the maintainability of the new test and adapter surfaces before convergence.
- Rotation status: dimensions 1-3 of 4 complete (correctness, security, traceability).
- Blocked/productive carry-forward: finding 1 (Codex containment) is carried active; finding 3 (README child form) is carried active.
- Required evidence: the three changed test files, the plugin README's mapper/renderer claims, and the compiled-route summary comment at `lib/skill-advisor-render.js:111-117`.

Review verdict: PASS
