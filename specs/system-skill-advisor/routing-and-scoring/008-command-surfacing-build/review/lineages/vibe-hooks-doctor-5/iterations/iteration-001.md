# Iteration 1 - Correctness: the Vibe prompt advisor part

## Dispatcher

- Mode: review, single iteration, dimension `correctness`.
- Lineage: `vibe-hooks-doctor-5` under `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/vibe-hooks-doctor-5`.
- Reviewed the pass-five scope files whose area is `vibe-hooks-doctor`, starting with the new Vibe part and the turn-start composer that calls it.
- Operator review focus: the pass-five brief. This iteration addressed the brief's "command offers on refusal, question, history or mention" through the Vibe document line (a head that names no command must gain no line) and the "docs against code" clause through the hook contract's Vibe row. The kill switch, direct-call switch, journal scoring, doctor hooks-file reading and holdout checks are scheduled for iterations 2 to 4.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:1-236`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:1-162`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/vibe-prompt-advisor.vitest.ts:1-210`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:289-465` (the producer whose fallback shape this iteration probes)
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:82-111`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/vibe-command-documents.md:1-120` (context doc)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A context that starts with the directive block is read as a routing head, so a command named in that older-build fallback gains a document line after the directives** -- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:125` -- `withCommandDocuments` splits the context at `context.indexOf('\nDirectives:')` and treats a split at index 0 or a miss as "no directive block" (`separator > 0`). A context that begins with `Directives:` — the directive-only fallback an older advisor build rendered, which `reduceRepeatedHead` explicitly recognizes at `:176-177` — is therefore scanned as a head, and a command named inside that directive text gains a `Command documents ...` line appended after the directives. The current handler always renders a status head before the directives, so this input is the older-build shape the module still supports, not today's fallback.
   Finding class: boundary_parsing
   Scope proof: The Vibe part is a declared `vibe-hooks-doctor` file; `withCommandDocuments` is its only document-line producer, and the directive-only shape it mis-reads is named by its sibling `reduceRepeatedHead` in the same file.
   Affected surface hints: Vibe directive-only fallback, document line placement, directive block.
   Case: With the directive-only context `Directives:\n- When a save is due, run /speckit:save to record the session.`, the part returns that text plus `\nCommand documents (read in full before taking one): /speckit:save is .skilled/commands/speckit/save.md.` `reduceRepeatedHead` returns the same input unchanged, so the two functions disagree about the same shape. The current headed fallback `Advisor: no skill matched.\nDirectives:\n- ...` is unchanged by `withCommandDocuments`, as the probe also showed.
   Evidence: `prompt-advisor.mjs:125-127` (`separator > 0`), `prompt-advisor.mjs:174-177` (the sibling branch that recognizes `Directives:` at the start), and the module probe recorded in this iteration's probe output.

2. **The subagent guard keys on a payload field no Vibe source or test names, while the hook contract promises a subagent turn gets no brief** -- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64` -- `isChildSession` treats a non-empty `payload.parent_session_id` as the subagent marker. No file in the repository defines a Vibe `pre_agent` payload schema or names that key, and the Vibe suite has no case that sets it, so the doc's promise at `skill-advisor-hook.md:95` rests on an unproven field name.
   Finding class: unverified_claim
   Scope proof: Both files are in the declared scope; the only other child marker is `AI_SESSION_CHILD`, which the manual scenario covers and which is a different, proven path.
   Affected surface hints: Vibe subagent turns, child-session suppression, hook contract doc.
   Case: Calling `buildAdvisorPart({ hook_event_name: 'pre_agent', prompt: 'write a readme for the utils folder', session_id: 's1', agent_id: 'child-1' })` returns a brief, because `agent_id` is ignored; a Vibe subagent payload that marks its parent under any key other than `parent_session_id` gets one. Nothing in the repository can disprove the opposite for the key the code reads.
   Evidence: `prompt-advisor.mjs:62-66` and `:211-216`; `vibe-prompt-advisor.vitest.ts` has no parent-session case; `skill-advisor-hook.md:95`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Phase 030 `REQ-006` says a head with no command carries no document line; a directive-only fallback whose directive block names a command gains one (`R1-P2-001`). `REQ-007`'s three real-advisor cases pass in the suite's design. |
| `checklist_evidence` | core | partial | Phase 030 `AC-006` and `AC-007` are Met with the document-line and real-advisor evidence, and neither covers the directive-only fallback. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | partial | The Vibe part is runtime-neutral and is called from the one turn-start composer; live per-runtime proof belongs to the manual playbook. |
| `feature_catalog_code` | overlay | pending | Deferred to the docs and traceability iteration. |
| `playbook_capability` | overlay | pending | Deferred to the docs and traceability iteration. |

## Integration Evidence

- The turn-start composer imports and calls `buildAdvisorPart(payload)` as the third part of its fixed order, at `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:27` and `:97`, and emits the joined text as `hook_specific_output.additional_context` at `:155`.
- The part proxies the operator prompt through the compiled handler under `runtime: 'vibe'`, at `prompt-advisor.mjs:184-190`, and the handler labels its observation `vibe` at `user-prompt-submit.ts:448`.

## Edge Cases

- A payload without `session_id` has no receipt key, so `reduceRepeatedHead` returns the context on every turn (`prompt-advisor.mjs:167`). The contract's "repeat only when they change" claim does not hold for that payload. No repo input proves Vibe ever omits the id, so this is recorded rather than raised.
- A payload that is not `pre_agent`, or has a blank prompt, returns `''` (`:211-215`).
- The receipt directory reads `process.env` rather than the injected `env` (`:68-71`); deferred to the maintainability iteration.

## Confirmed-Clean Surfaces

- Every command in the generated bridge table resolves to a document: 69 of 69 `commandPolicies` rows map to an existing `.skilled/commands/...md` path, checked with a read-only walk over `command-bridges.generated.json`.
- A repeated head is dropped: the suite's first case returns the head plus its document line, the second returns `''` (`vibe-prompt-advisor.vitest.ts:187-209`).
- A dispatched child marked with `AI_SESSION_CHILD=1` gets no brief (`prompt-advisor.mjs:63`; the playbook runs the child arm).
- Fail-open holds: an import failure, a handler throw or a missing context all return `''` (`:233-235`).

## Ruled Out

- **The document line names the wrong document for a two-part command.** Ruled out: the token pattern stops at the second colon and the test pins `/deep:research:auto` to `.skilled/commands/deep/research.md`.
- **The token pattern can escape the commands tree.** Ruled out: the capture is `[a-z][a-z0-9-]*` only, so `..`, a dot and an absolute path cannot form a candidate; a missing file is skipped by `existsSync`.
- **The head receipt collides with the directive store.** Ruled out: the store and the receipts share a base directory but the receipts live under the `vibe-turn-start` subfolder with a hashed name.
- **The document line is added before the directive block.** Holds for a headed brief; the directive-only shape is the exception above.

## Next Focus

- Dimension: security
- Focus area: the advisor kill switch and the direct-call off switch as the hook contract states them, plus the source-path resolution the handler uses.
- Reason: iteration 1 closed the Vibe part's behavior; the pass-five brief puts the kill-switch and direct-call paths next, and the hook contract's switch table is in this lineage's scope.
- Rotation status: correctness complete; security, traceability and maintainability remaining.
- Blocked/productive carry-forward: the fallback-shape reading is productive; no blocked approach yet.
- Required evidence: the doc line, the resolver branch and the handler path for each claimed switch.

Review verdict: PASS
