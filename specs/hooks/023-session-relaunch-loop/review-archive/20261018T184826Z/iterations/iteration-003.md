# Review Iteration 3 — traceability

## Dispatcher

- Mode: review (`target_agent=deep-review`, single iteration, externalized state)
- Target: `specs/hooks/023-session-relaunch-loop` (phase parent; four child phases)
- Focus: traceability — core protocols `spec_code` + `checklist_evidence`; overlays `feature_catalog_code`, `playbook_capability`, `skill_agent`, `agent_cross_runtime`
- Budget profile: `verify` (11 tool calls used of 12 allocated, 13 hard max)
- Lifecycle: `new`, sessionId `2026-10-18T12:41:21.177Z`, generation 1

## Dimension

Traceability only. Correctness and security were closed in iterations 1 and 2 (10 covered bug classes, 5 active P2). This pass asked one question per protocol: does each document that claims a behavior match the code and generated configuration that implements it, and does each checked task point at evidence that exists?

## Files Reviewed

- `specs/hooks/023-session-relaunch-loop/spec.md` (whole file, phase-parent spec)
- `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:94-103`, `:191` (section 7 wrapper contract and its binding amendment)
- `specs/hooks/023-session-relaunch-loop/00{1,2,3,4}-*/tasks.md` (all checked items and their evidence pointers)
- `specs/hooks/023-session-relaunch-loop/004-integration-review-and-docs-closure/` (folder inventory)
- `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` (session-relaunch bindings, all runtimes)
- `.claude/settings.json:110-270` (Claude hook rows, resolved by event/group/hook index)
- `.codex/hooks.json` (whole file)
- `.skilled/hooks/session-relaunch/README.md:10-24` (runtime adapter matrix)
- `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` (whole file)
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md:1-60`
- `.skilled/commands/speckit/handoff.md`, `.claude/commands/speckit/handoff.md`, `.codex/prompts/speckit-handoff.md`, `.cursor/commands/speckit-handoff.md`, `.hermes/prompts/speckit-handoff.md`, `.pi/prompts/speckit-handoff.md` (all six command surfaces)
- `.skilled/bin/skilled-loop:62,214,255,311,319` (devin seed option and per-runtime model arms)
- `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:120-124,230,424-432` (devin stub case)
- `.skilled/hooks/session-relaunch/lib/nudge.cjs:19,21` (nudge step, session-id pattern)
- `.skilled/hooks/session-relaunch/lib/` inventory and `.skilled/hooks/session-relaunch/tests/killer.test.cjs` (existence check)
- `.claude/hooks/` link inventory (context-nudge and stop-arm are symlinks into `.skilled/hooks/session-relaunch/claude/`)
- `.pi/extensions/`, `.opencode/plugins/`, `.skilled/hooks/session-relaunch/opencode/`, `.skilled/hooks/session-relaunch/pi/` (link shapes)

## Findings — New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Checklist evidence pointers name locations that do not exist or stop short of the claimed content** — `specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:144` — Two closure receipts cite evidence that cannot be followed to the artifact they claim. CHK-031 records "`.skilled/hooks/session-relaunch/lib/killer.test.cjs` asserts the descendant-only guard"; `lib/` holds only `context-usage.cjs`, `killer.cjs`, `nudge.cjs` and `relaunch-core.cjs`, and the named test exists at `.skilled/hooks/session-relaunch/tests/killer.test.cjs` — the `lib/` path does not exist. T006 (`:53`) cites `.skilled/hooks/session-relaunch/README.md:13-21` for the runtime matrix that states runtime, trigger, seed syntax, mirror form, spike evidence and verdict; the heading is at `:13` but the table spans `:13-23`, so the cited range ends inside the Cursor row and excludes the Hermes and Devin verdicts the task exists to prove.
   Finding class: documentation-evidence defect
   Scope proof: read-only reads of `tasks.md`, the `lib/` directory listing and `README.md:10-24`; no code or doc was modified.
   Affected surface hints: `specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md` (two pointers), any future closure audit that re-verifies CHK-031 or T006.
   Case: an auditor verifying CHK-031's ancestry-guard evidence follows the recorded path and finds no file, then either marks a satisfied requirement unproven or discards the check; an auditor following T006's range never sees the two command-only verdict rows.
   ```json
   {"type":"finding_claim","id":"T3-P2-001","dimension":"traceability","protocol":"checklist_evidence","claim":"Two checked tasks in phase 003 cite evidence locations that do not resolve to the claimed content.","evidenceRefs":["specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:144","specs/hooks/023-session-relaunch-loop/003-command-trigger-runtimes/tasks.md:53",".skilled/hooks/session-relaunch/tests/killer.test.cjs:1",".skilled/hooks/session-relaunch/README.md:13"],"counterevidenceSought":"Looked for a lib/killer.test.cjs duplicate, a symlink alias, and a second copy of the matrix under the cited range; the lib/ listing shows four .cjs modules and no test file, and README.md:17-23 holds the seven-row matrix.","alternativeExplanation":"The pointers were accurate when written and the file was later moved from lib/ to tests/, or the README gained two rows after the citation was recorded.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Not downgradable below P2; escalate to P1 only if a release gate reads a tasks.md pointer as the sole proof of a P0 acceptance row."}
   ```

2. **Interface contract section 7 states two opposite relaunch orders, and the superseded sentence is not marked** — `specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:97` — Line 97 says "On relaunch: `consume`, increments hops, `cd` to the recorded cwd, starts the runtime again"; the binding amendment at `:103` says "The wrapper changes to the recorded cwd before it consumes the record. When the cwd is missing ... it prints the manual command to stderr, consumes the record and exits 1." Both are presented as binding inside the same section, and `:97` carries no superseded marker. Iteration 1 established that the implementation follows `:103`; the contradictory sentence was never reconciled, and iteration 1 explicitly deferred the reconciliation to this traceability pass.
   Finding class: contract self-contradiction (documentation)
   Scope proof: two reads of the same contract section and the iteration-1 record that the code follows `:103`; no source file was touched or re-litigated.
   Affected surface hints: `interface-contract.md:97`, the next runtime arm or wrapper change that treats section 7 as its contract, `.skilled/bin/skilled-loop` (implementation of `:103`).
   Case: a maintainer implementing the relaunch branch from the `:97` ordering consumes the record first; when the `cd` to the recorded cwd then fails, the armed record is already gone, so the wrapper can neither relaunch nor print the manual claim command — the exact loss `:103` was amended to prevent.
   ```json
   {"type":"finding_claim","id":"T3-P2-002","dimension":"traceability","protocol":"spec_code","claim":"Section 7 of the interface contract states consume-then-cd and cd-then-consume as binding in adjacent bullets, with no superseded marker on the first.","evidenceRefs":["specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:97","specs/hooks/023-session-relaunch-loop/scratch/contracts/interface-contract.md:103"],"counterevidenceSought":"Looked for a supersede annotation or a 'binding' qualifier on :97 and for a later section that restates the opening bullet; the amendment block at :99-103 is labelled binding and leaves :97 unmarked, and no later restatement exists in section 7.","alternativeExplanation":"Section 7's opening is a summary and the amendment is the operative text, so a reader is expected to prefer the amendment.","finalSeverity":"P2","confidence":"high","downgradeTrigger":"Raise to P1 if the wrapper is changed to satisfy :97, or if any closure doc cites :97 as the operative order."}
   ```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Contract §7 verified at `interface-contract.md:97` and `:103`; one contradiction recorded as T3-P2-002. Sections 4/9/11.5-11.9 were verified in iteration 1 and were not re-read here; §11.10-11.11 remain unre-read across all iterations. `spec.md` matches the four child phases named in its map and lists the files the commit touched. |
| `checklist_evidence` | core | partial | All four `tasks.md` files are fully checked with zero `[ ]` rows. Evidence pointers were sampled for resolvability: T3-P2-001 records the two that fail. The bulk of the receipts name `run-ledger.md` sections and D-numbers that exist outside this packet's scope and were not re-verified. |
| `agent_cross_runtime` | overlay | pass | `.claude/settings.json` registers `session-relaunch` on exactly PostToolUse (group 3, unmatcher), UserPromptSubmit (group 0 hook 2) and Stop (group 0 hook 2), matching the registry's three Claude bindings row for row. `.codex/hooks.json` registers `prompt-seed.mjs` on UserPromptSubmit, `context-nudge.mjs` on PostToolUse (no matcher) and `stop-arm.mjs` on Stop, matching the registry's three Codex bindings. Pi carries `session-relaunch.ts`; cursor and devin carry no bindings, consistent with their COMMAND-ONLY verdicts. `.claude/hooks/context-nudge.mjs` and `.claude/hooks/stop-arm.mjs` are symlinks into `.skilled/hooks/session-relaunch/claude/`, so their relative imports resolve through the real path. |
| `skill_agent` | overlay | partial | `/speckit:handoff` exists as the canonical `.skilled/commands/speckit/handoff.md` (160 lines) with a byte-identical Claude mirror at `.claude/commands/speckit/handoff.md` and generated 12-line stubs at `.codex/prompts/`, `.hermes/prompts/` and `.pi/prompts/` that each point back to the canonical tree. `.cursor/commands/speckit-handoff.md` carries the full 160-line body. Only the file heads and the canonical/mirror diff were compared, so per-command routing statements inside the body were not traced to the CLI. |
| `agent_cross_runtime` (command mirrors) | overlay | pass | All six runtime surfaces exist and name the same canonical path; phase 003 T005's claim that only `.hermes/prompts/speckit-handoff.md` had to be added is consistent with the generated-stub form of the Codex and Pi prompts. |
| `feature_catalog_code` | overlay | partial | Four catalog claims were checked against code: session-id pattern `[A-Za-z0-9_-]{1,128}` matches `nudge.cjs:21`; the extra nudge at +0.05 matches `NUDGE_STEP = 0.05` at `nudge.cjs:19`; "Claude's context-nudge handles PostToolUse and UserPromptSubmit" matches the registry and settings rows; the Devin seed form `devin [--model <model>] -- "<seed>"` matches `seed_option=' --'` at `skilled-loop:62`. The killer's 100 ms poll, the `SESSION_RELAUNCH_MAX_HOPS`/`MAX_AGE_MIN` zero semantics and the OpenCode arm-on-idle description were not re-verified in this pass. |
| `playbook_capability` | overlay | partial | The playbook's expected relaunch forms (`codex --no-daemon -m <model> <seed>`, `cursor-agent --model <model> <seed>`, `hermes chat --provider <p> -m <model> -q <seed>`, `devin --model <model> -- <seed>`) match the wrapper's arm table and the stub case at `skilled-loop.test.cjs:120-124`. The recorded-results table and the live-run claims were not re-exercised. |

## Integration Evidence

- `hook-registry.json` is the declared source for the Claude and Codex hook rows; the rendered `.claude/settings.json` and `.codex/hooks.json` agree with it on event, group and script for all six `session-relaunch` bindings.
- `.skilled/hooks/session-relaunch/README.md:13-23` is the runtime verdict matrix the phase-003 tasks cite; it lists seven rows with AUTO for Claude, Pi, OpenCode, Codex and Hermes and COMMAND-ONLY for Cursor and Devin, which matches the registry, the wrapper arms and the catalog overview.
- `.skilled/commands/speckit/handoff.md` is the single canonical command; five runtime surfaces point at it and one mirrors it byte for byte.

## Edge Cases

- **Parent packet has no `acceptance-criteria.md`.** `spec.md` declares `SPECKIT_LEVEL: 2` under the `phase-parent-spec | v2.2` template, whose own header states that `spec.md` is the only authored document at parent level. The closure gate therefore lives in the four children, all of which carry `acceptance-criteria.md`. Recorded as a design consequence of the phase-parent template, not a defect; the claim "26/26 acceptance rows are Met" refers to the union of the children.
- **Two exhausted-approach entries are deferred work, not dead ends.** The strategy's `EXHAUSTED APPROACHES` block records "`checklist_evidence` - not checked (deferred to D3)" and the section-7 reconcile item as `BLOCKED` with "Do NOT retry". Both are deferrals the reducer auto-labelled. This iteration executed them rather than treating them as prohibited; the reconcile item is now a concrete finding (T3-P2-002) instead of a note.
- **Link-versus-copy shape is unresolved for two mirrors.** The README matrix calls Cursor's mirror form a "symlink", but `.cursor/commands/speckit-handoff.md` and `.claude/commands/speckit/handoff.md` each present the full 160-line body, and a content diff cannot distinguish a copy from a followed symlink. Deferred as SL-205; resolving it needs a link-mode read of both paths.

## Confirmed-Clean Surfaces

- The three Claude `session-relaunch` bindings and the three Codex bindings match the registry exactly, so the generated hook configuration does not drift from its declared source.
- The Devin seed form is consistent across the wrapper (`seed_option=' --'`), the stub-runtime test and the playbook's expected signal, and the wrapper's `devin` dispatch case exists separately from `claude`, so it cannot fall through.
- Every `tasks.md` in all four phases is fully checked with no unverified `[ ]` rows remaining, and `implementation-summary.md` exists for phase 004.
- The `.claude/hooks/` browsability entries used by this feature are symlinks into the canonical `.skilled/hooks/session-relaunch/claude/` directory, so the duplicate-looking files cannot drift.

## Ruled Out

- **Runtime parity drift between the hook registry and the generated Claude/Codex config.** Ruled out by resolving each registry binding to its rendered row by event, group and hook index (SL-203).
- **Catalog drift on the four sampled behavioral claims** (session-id pattern, +0.05 re-nudge, Claude event surface, Devin seed form). Ruled out against `nudge.cjs:19,21`, the registry and `skilled-loop:62` (SL-206).
- **Playbook relaunch-form drift for the four command-runtime verdicts.** Ruled out against the wrapper arms and the stub case (SL-207).
- **Missing or divergent command surfaces for `/speckit:handoff`.** Ruled out: six surfaces exist and agree on the canonical path (SL-204).
- **Checked-but-unevidenced tasks.** Ruled out for resolvability of the sampled pointers; the two that fail became T3-P2-001 rather than a general claim (SL-201).

## Next Focus

- Dimension: maintainability (D4)
- Focus area: pattern compliance and safe follow-on cost across the seven adapters — duplicated helper logic between `codex/shared.mjs`, `hermes/context-nudge.mjs`, `pi/session-relaunch.ts` and `.opencode/plugins/session-relaunch.js`; comment hygiene in the touched files; documentation clarity of `.skilled/hooks/session-relaunch/README.md` and `injection-contract.md`.
- Reason: traceability closed with two P2 advisories and no P0/P1; maintainability is the only dimension still uncovered, and dimension coverage sits at 3/4, which blocks STOP.
- Rotation status: dimension rotation, first maintainability pass.
- Blocked/productive carry-forward: none blocked. Carried deferrals are SL-205 (mirror link shape), SL-208 (catalog quantitative claims: killer 100 ms poll, hop/age zero semantics) and SL-209 (`tasks.md` T009 README line pointers `:28`/`:186`/`:274`).
- Required evidence: `.skilled/hooks/session-relaunch/README.md`, `.skilled/hooks/injection-contract.md`, the four shared modules, `sk-code-opencode` checklist items for comment hygiene and duplication.
- Recovery note: not applicable; iteration 3 completed with a coherent state.

Review verdict: PASS
