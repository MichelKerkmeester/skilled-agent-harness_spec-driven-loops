# Iteration 002: Route mutation policy, attach guards, and spec traceability

## Dispatcher

- Lineage `doctor-docs-4`, session `fanout-doctor-docs-4-1794669272137-9v23rz`, generation 1, lineage mode `new`.
- Mode: review. Focus dimensions: `security` and `traceability` (combined because the three-iteration cap leaves one pass each for correctness and maintainability). Budget profile: `verify`.
- Operator review focus: pass-four review of the doctor-docs area under `review-brief-4.txt`. This iteration addresses the brief's attach question (can a refusal, question or command mention attach or start a mutating command) and its spec-traceability question, while keeping the holdout rule.
- Steering: `steer.md` is absent in the lineage directory; no ruling was available to apply.
- Sources read: `review-brief-4.txt:1`, `review-scope-4.txt:6-9`, `_routes.yaml:1-828` (mutation classes and phrases), `command-bridges.generated.json` (policy rows queried as data), `derive-command-bridges.cjs:470-539,710-777`, `command-attach.ts:445-519`, `command-attach-guards.vitest.ts:1-269`, `doctor-command-routing.md:13-82`, `doctor-setup-run.md:1-110`, `doctor-update-check.md:1-109`, `016-claude-create-reach-and-doctor-default/spec.md:44-56,169,250-280,354`, `016-claude-create-reach-and-doctor-default/acceptance-criteria.md:58-62`, `016-claude-create-reach-and-doctor-default/tasks.md:92-133`, `024-fable-review-remediation/spec.md:111-112`, `024-fable-review-remediation/implementation-summary.md:92`, the `a494145dd0` commit body, and the runtime mirror listing for `.claude`, `.codex`, `.cursor`, `.pi`, `.dsh`, `.devin`.

## Files Reviewed

- `.skilled/commands/doctor/_routes.yaml` (all route and standalone mutation classes and phrases)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json` (derived policies and phrases)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:470-539,710-777` (policy derivation and lead-phrase rules)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:445-519` (attach and mention guards)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-269` (refusal, question and request cases)
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:13-82` (catalog claims)
- `.skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md:1-110` and `doctor-update-check.md:1-109` (playbook requests)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/016-claude-create-reach-and-doctor-default/{spec.md,acceptance-criteria.md,tasks.md}` (rename and floor requirements)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/024-fable-review-remediation/{spec.md,implementation-summary.md}` (refusal reproductions)
- Runtime mirrors: `.claude/commands/create/sk-skill.md`, `.cursor/commands/create-sk-skill.md`, `.codex/prompts/create-sk-skill.md`, `.pi/prompts/create-sk-skill.md`, `.dsh/prompts/create-sk-skill.md`, `.devin/*` (no command mirror)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The carried finding `DR4-P2-001` (the A11 malformed-row repair mapping in `doctor-agents-md-presentation.txt:267`) stays active at P2: re-reading the presentation's A11 row and the embed engine's `addRouterRows` confirms the specific row still covers missing rows only, and no other doctor document names a malformed-row repair. The generic FINDING row at `:262` remains the fallback, so the severity does not rise.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | The phrase removal matches the `a494145dd0` body (six everyday repair/release phrases removed; floors, eval and real-embedder holdout count unchanged) and the `024` reproduction pair (`024/spec.md:111-112`, `024/implementation-summary.md:92`) where the refusal prompt no longer ranks `/doctor:setup`. The 016 floor requirement (`016/spec.md:256` REQ-007) is the contract the commit says still holds. |
| `checklist_evidence` | pass | 016 AC-003, AC-005 and AC-007 remain Met (`016/acceptance-criteria.md:58-62`), and AC-017 remains Met (`014-review-remediation/acceptance-criteria.md:72`). The carried P2 is a documentation advisory outside those checklist rows, so it no longer counts as a checklist partial. |
| `skill_agent` | notApplicable | The changed files are a doctor command, a route manifest and a create presentation; no skill/agent pair changed. |
| `agent_cross_runtime` | pass | The create rename is consistent on every runtime that mirrors commands: `.claude/commands/create/sk-skill.md` and `.cursor/commands/create-sk-skill.md` are symlinks to `.skilled/commands/create/sk-skill.md`; `.codex/prompts/create-sk-skill.md`, `.pi/prompts/create-sk-skill.md` and `.dsh/prompts/create-sk-skill.md` carry the new name; no old-name command file remains; `.devin` has no command mirror and uses its config/hooks surface. The changed presentation has no runtime branch. |
| `feature_catalog_code` | pass | `doctor-command-routing.md:27-39` says the deriver reads the manifest, a `read-only` route gets `readOnly: true`, mutating bridges stay gated, and the reach probe rejects phrases under three words. The generated policies and the remaining phrases match those claims. |
| `playbook_capability` | partial | The carried `DR4-P2-001` remains: the playbook requires a repair for each finding (`doctor-agents-md-check.md:30,102`), and the presentation's A11-specific row covers missing rows only. The setup and update playbooks use typed commands and do not quote the removed phrases. |

## Integration Evidence

- `derive-command-bridges.cjs:485-496` derives `ask` for a doctor route that mutates, `run` only for a read-only route or an add-only route confined to the spec folder, and `start` otherwise. The generated `commandPolicies` show every `mutating: mutates` doctor route at `ask`, `/doctor:update align` (add-only, no spec-folder scope) at `start`, and only the read-only routes plus `/doctor:deep-loop` and `/doctor:speckit-retrieval` (add-only, spec-folder scope) at `run`.
- `command-attach.ts:470-483` returns no command for a no-edit request or a command the prompt only mentions; `command-attach-guards.vitest.ts:138-247` pins refusals and questions for `/doctor:update`, `/doctor:git`, `/doctor:setup`, `/speckit:save`, `/create:readme` and the longer `/create:sk-skill-parent` name, plus the request cases that still attach.
- `command-bridges.generated.json` carries none of the six removed phrases, and the remaining `/doctor:setup` and `/doctor:update` phrases are all three or more words, so the reach probe's word-count rule still holds (`doctor-command-routing.md:39`).
- `a494145dd0` reports the two false-offer reproductions the removal addresses: a request to fix failing tests pulled onto `/doctor:setup`, and a release-notes request pulled onto `/doctor:update`; the same commit says the floors, eval numbers and real-embedder holdout count are unchanged.
- The 016 acceptance evidence covers the rename and floors: AC-003 (`016/acceptance-criteria.md:58`) names the generated outputs and the `/create:sk-skill` baseline key; AC-007 (`:62`) holds typed recall 24 of 44, false offers 0 of 35, typed delivery 44 of 44, plain tune combined 28 of 45 and `[160,50,21,5]`.

## Edge Cases

- A question that contains a mutating route's phrase, without naming the command, can pass the phrase anchor and offer that route; the route's policy is `ask`, so the command asks before writing. A refusal or question that names the command is suppressed by `commandOnlyMentioned`.
- An add-only route confined to the spec folder derives `run` by design (`/doctor:deep-loop`, `/doctor:speckit-retrieval`); its writes are reports under the packet scratch area, not destructive writes, and that policy is the manifest's stated scope.
- The `/doctor:update align` add-only route has no spec-folder scope and derives `start`, not `run`; it starts an ordinary task and keeps the route's own approval.
- The 016 floors and the real-embedder holdout count are cited from the governing docs and the commit body; they were not re-run here because the suites write outside the lineage and the holdout rule forbids reading the prompt rows.
- A `/doctor:` command mention in a sentence is not a typed command; the guards test distinguishes a bare mid-sentence mention from a typed or requested command.

## Confirmed-Clean Surfaces

- No doctor route with `mutating: mutates` derives `run`; the only `run` routes are read-only or add-only spec-folder routes.
- The six removed phrases are absent from the route manifest and the derived bridge data; the generated file is the surface the TypeScript scorer reads.
- The create command's rename is consistent across the runtime mirrors that carry commands, with no old-name command file and no runtime-specific presentation branch.
- The feature catalog's doctor-routing description matches the generated policy and reach-probe behavior.
- The A11 count arithmetic remains correct; the only carried issue is the presentation repair mapping.

## Ruled Out

- A mutating command attached or started by a refusal, question or mention is ruled out: mutating doctor routes derive `ask`, and `command-attach.ts:470-483` suppresses no-edit and command-only-mention prompts, with the guards test covering both.
- A cross-runtime rename gap is ruled out: the command is a symlink on Claude and Cursor, a generated file at the new name on Codex, Pi and DSH, and absent by design on Devin; no old-name command file remains.
- A spec/code contradiction on the phrase removal is ruled out: the `a494145dd0` body names the two false-offer reproductions, the `024` tests pin the refusal behavior, and the 016 floors are reported unchanged.
- Feature-catalog drift on the doctor routing policy is ruled out: the catalog's gating, `readOnly`, and three-word reach claims match the generated data and the deriver.
- Re-opening the A11 count arithmetic is ruled out: the count still derives from the same arrays and the malformed test's rule path remains intact.
- The `sk-skill.md` description saying "OpenCode skills" is noted but ruled out as a finding: it predates the rename (the old `skill.md` carried the same line), it is not a changed line, and the command's `.skilled/skills` target is the OpenCode-origin skill tree.

## Next Focus

- Dimension: maintainability (final pass; correctness, security and traceability are complete).
- Focus area: the changed lines' documentation and test maintainability, the carried A11 presentation wording, the new test assertion's style, the derived-data and comment consistency, and the final cross-reference inputs for the Planning Packet.
- Reason: the security and traceability passes are clean; the remaining active item is a documentation mapping, and the final pass should decide whether it is carried as an advisory and whether any maintainability issue remains in the changed lines.
- Rotation status: correctness, security and traceability complete; maintainability final.
- Blocked/productive carry-forward: carry `DR4-P2-001`; do not re-enter the mutation-policy or runtime-mirror directions.
- Required evidence: the changed lines, the presentation and test style, the reducer outputs, and the packet docs that describe the changed behavior.
- Recovery note: none.

Review verdict: PASS
