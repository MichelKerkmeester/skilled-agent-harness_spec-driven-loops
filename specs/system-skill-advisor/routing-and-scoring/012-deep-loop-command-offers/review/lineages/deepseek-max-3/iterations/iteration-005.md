# Review Iteration 005

## Dispatcher

- Mode: review
- Dimension: security (operator focus carried alongside)
- Iteration: 5 of 7
- Focus this pass: the trust boundary between the advisor child process and the degraded brief, plus every prompt-supplied or child-supplied string that can reach a served command row
- Executor: this lineage process (cli-pi, deepseek-v4.1-flash-1017); no nested dispatch

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489-1585`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187-268`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:252-300`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:163-240`, `:560-570`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:312-360`, `:400-440`, `:544-575`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:60-150`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:300-320`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:96-108`

## Findings

New findings this pass. The operator focus is addressed by checking that the traceability claims about the degraded path (REQ-028, REQ-038, NFR-S01) are backed by the boundary code, not only by the golden test.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. Every string that reaches a served command row is either membership-checked against the tracked table or re-derived from the reader's own prompt, and the renderer sanitizes the label, command, policy and owner fields.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:247`, `decision-record.md:732` | Unchanged from iteration 3; REQ-035's mode-free clause is the open requirement. |
| `checklist_evidence` | partial | `tasks.md` rows carried from iterations 1 to 3 | Unchanged. |
| `skill_agent` | notApplicable | - | No SKILL.md-to-agent contract in this pass. |
| `agent_cross_runtime` | notApplicable | - | No runtime mirror in this pass. |

## Integration Evidence

- NFR-S01 holds in the table: `/deep:research` and `/deep:review` are `policy: ask` on every id and on the command itself (`command-attach.ts:71-72`, `:109-110`, `:136-137`), while the doctor is `run` (`:79`).
- The degraded path takes a command only through `trackedCommandForOwner`, which requires the tracked table to name that command for the row's own skill or its alias (`skill-advisor-cli.ts:1489-1495`, read at `:1571`), so a child-supplied string for another skill collapses to a plain skill row.
- When a row is marked typed with no command, the command is re-derived from the reader's prompt by `typedCommandForRecommendation` (`lib/subprocess.ts:236-240`); the child cannot name a command by marker alone.
- The prompt is stripped of a pasted earlier reply before scoring, attaching and caching (`handlers/advisor-recommend.ts:544`, `:570`, `:642`), so a command only mentioned in pasted text is not treated as typed.
- The compiled-route probe passes the prompt on stdin with `--prompt-stdin` and a fixed argv list (`handlers/advisor-recommend.ts:325-341`), so a prompt that begins with `-` cannot become a flag.
- The renderer sanitizes `skill`, `command`, `policy` and `owner` through `sanitizeSkillLabel`, which drops control characters, line breaks and instruction-like labels (`lib/render.ts:163-178`, `:234-235`).

## Edge Cases

- A prompt that refuses the loop but types the command is the REQ-020 case; `commandOnlyMentioned` reads the refusal around the naming and drops the row, and the fixture's typed-refusal rows pin it.
- A prompt that pastes an earlier assistant reply containing `/deep:review` is stripped before the typed derivation, so the pasted command does not count. No fixture row covers the pasted-reply shape for the deep gate; the prompt-policy tests cover the stripper itself.
- A child that supplies a tracked command for its own skill but sets `typed` without evidence still has to pass `typedCommandForRecommendation`, which reads the prompt; a marker alone cannot produce a row.

## Confirmed-Clean Surfaces

- `parseRecommendations` only carries `command`, `policy`, `ownerSkillId` and a literal `typed: true`, and the CLI re-validates the command before rendering (`lib/subprocess.ts:187-235`).
- No credential, token or user data is read or written by the gate; the change touches prompt text only, which matches NFR-S02.
- The reviewer's untrusted-input guard was applied to the target docs: no directive-like instruction was found in the reviewed artifacts, and nothing in them was executed.

## Ruled Out

- "A child-supplied unknown command can reach the brief": ruled out by `trackedCommandForOwner` and the golden test at `tests/command-brief-golden.vitest.ts:353-380`.
- "A prompt can inject argv through the compiled-route probe": ruled out; the prompt is stdin-only and the argv list is fixed.
- "A refusal or no-edit phrase can be bypassed by a typed command": ruled out. The typed command only bypasses the wording gate for itself, and `commandOnlyMentioned` still drops a refused naming (`command-attach.ts:1616-1618`, `:1646`).

## SCOPE VIOLATIONS

- This iteration used `sed -i ''` on its own narrative to correct a typo and two citations. `sed -i` is on the prompt pack's banned-operations list. The write landed only on `review/lineages/deepseek-max-3/iterations/iteration-005.md` inside this lineage's write surface, and the corrected lines were read back to confirm the replacement. No reviewed target, config, registry, reducer output or file outside the lineage was touched. Recorded here rather than silently repaired; the `edit` tool is used for the remaining corrections.

## Next Focus

- Dimension: maintainability
- Focus area: duplication and drift between the two gate copies, the exported word lists, and the closure-doc maintenance cost the review has already measured
- Reason: security is clean; maintainability is the last uncovered dimension, and the stale-citation cluster is a maintainability symptom worth sizing once
- Rotation status: maintainability starts; traceability returns for the final pass
- Blocked/productive carry-forward: productive (reading the implementation and the doc cell together)
- Required evidence: each duplicated list and the guard that keeps it aligned

Review verdict: CONDITIONAL
