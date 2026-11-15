# Review Iteration 004

## Dispatcher

- Mode: review, target_agent `deep-review`, execution single_review_iteration
- Review target: `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder)
- Dimension: maintainability
- Operator review focus: the 2026-11-15 fix set as code, plus the `withdrawOnOperatorPrompt` gap carried from iteration 3.
- Iteration: 4 of 5. Session `fanout-vibe-1-1794765851303-zrv85l`, generation 1, lineageMode new.
- Sources read this iteration: `steer.md` (absent), `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` (1-30, 92-101), `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` (84-150, 199-257, 296-324), `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` (full), `.skilled/hooks/session-handover/vibe/handover-parts.mjs` (86-115, 186-272), `.skilled/hooks/session-handover/lib/nudge.cjs` (365-367), `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` (1290-1320, 3220-3280, 3340-3400).

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` (module header and `PARTS`)
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` (state helpers, detector, post-tool binding)
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` (full, 255 lines)
- `.skilled/hooks/session-handover/vibe/handover-parts.mjs` (`buildHandoverContextPart`)
- `.skilled/hooks/session-handover/lib/nudge.cjs` (`isSeedPrompt`)
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` (`--remove-home` path)

## Findings - New

### P0 Findings

None. No exploitable security issue, auth bypass or destructive data loss was found in this dimension.

### P1 Findings

None. The maintainability gaps below are all advisory; the active P1s remain the three from iterations 1 and 2.

### P2 Findings

1. **The `turn-start.mjs` module header names four parts while `PARTS` holds five, so the hand-over part added by `e5b8611a4fa` is undocumented where the ordering contract lives** -- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:8` -- the header reads "The pending completion advisory is delivered first, then the compaction context a new journal entry re-arms, then the advisor brief, then the save reminder a new operator answer raises", and `PARTS` at `:92-101` adds `handoverPart` as a fifth entry. The header is the only place the fixed-order contract is stated, so a reader who trusts it will not know the hand-over text ends the context.
   Finding class: maintainability
   Scope proof: `turn-start.mjs:8-12` (four parts named) against `:92-101` (five entries, `handoverPart` last).
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:92-101`, `.skilled/hooks/session-lifecycle/vibe/README.md`
   Case: a maintainer adding a sixth turn-start concern reads the header, inserts the new part before what it believes is the last one, and silently moves the hand-over text out of the final position the header's ordering rationale depends on.

2. **The compaction test suite pins the watermark contract for the no-compaction case but not for the empty-section case, which is why the iteration-1 defect shipped** -- `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:141` -- the case "a journal with no compaction returns nothing and writes no watermark" asserts `readdirSync(stateDir)` is empty, and no case asserts the same for a compaction whose sections do not resolve. The consume-without-inject path at `compaction-context.mjs:231`/`:252` therefore has no failing test to catch it.
   Finding class: maintainability
   Scope proof: `compaction-context.test.mjs:141-150` (the only no-watermark assertion) against `compaction-context.mjs:231` (write) and `:252` (empty return).
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs:92-150`, `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:231-252`
   Case: a future change that moves the watermark write again, or that adds a third section source, passes the suite because no case exercises a compaction with zero resolvable sections.

3. **`withdrawOnOperatorPrompt` fires on any non-seed `pre_agent` without checking that the payload carries a prompt, contradicting the comment that justifies it** -- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:209` -- the comment at `:87-91` reasons "Any other prompt means the session carries on past a hand-over the turn end armed", but the call passes only `sessionId` and `env`, and `isSeedPrompt` at `nudge.cjs:365-367` returns false for a non-string, so a `pre_agent` payload with no `prompt` field reaches the withdraw.
   Finding class: maintainability
   Scope proof: `handover-parts.mjs:209` (the call), `:87-91` (the comment), `:199` (the seed check that a missing prompt fails), `nudge.cjs:365-367` (`isSeedPrompt` returns false for a non-string).
   Affected surface hints: `.skilled/hooks/session-handover/vibe/handover-parts.mjs:92-114`, `.skilled/hooks/session-handover/lib/withdraw.cjs:55-91`
   Case: a `pre_agent` payload that carries no `prompt`, such as a host-fired continuation. The armed hand-over is withdrawn with reason `user-message` even though the operator sent nothing, so the hop the turn end prepared is cancelled and the session keeps running past its threshold.

## Traceability Checks

| Check | Result | Evidence |
|-------|--------|----------|
| `spec_code` (core) | partial | Unchanged from iteration 2. |
| `checklist_evidence` (core) | fail | Unchanged from iteration 2. |
| `skill_agent` (overlay) | pass | The session-lifecycle README describes the composer order; only the `turn-start.mjs` header is stale (finding 1). |
| `agent_cross_runtime` (overlay) | notApplicable | No agent profile in this dimension. |
| `feature_catalog_code` (overlay) | pending | Deferred to iteration 5. |
| `playbook_capability` (overlay) | partial | Unchanged from iteration 2. |

## Integration Evidence

- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:1301-1315` -- `removeVibeHome` makes the tree writable with `chmodSync(target, stat.mode | 0o200)` before `rmSync`, and reports the outcome by existence rather than by the swallowed error. The `--remove-home` fix is implemented as the packet claims.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:3274-3275` -- `result.json` records both `vibe_home` and `vibe_home_removed`, matching `references/conversation-scenarios.md:167`.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs:3359` -- the flag is documented in the usage block as opt-in, matching `022/implementation-summary.md:124`.
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:5-11` and `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:5-9` -- both headers were updated by `e5b8611a4fa` to name the hand-over part, so `turn-start.mjs` is the only composer whose header was missed.

## Edge Cases

- **Ambiguity: whether a prompt-less `pre_agent` is reachable.** Vibe's `pre_agent` may always carry a prompt, in which case finding 3 is latent rather than live. Recorded with a downgrade trigger rather than raised to P1.
- **Contradictory evidence on the watermark comment.** `compaction-context.mjs:106-108` justifies the write-before-build ordering for the crash case and says a failed write withholds the text, but it does not say an empty-section return also consumes. The comment is incomplete rather than wrong; folded into finding 2's fix rather than raised separately.
- **Partial success.** The `--remove-home` fix, the `vibe_home` recording and the usage text all agree, so the F2 fix is complete on the maintainability axis.
- **Carried forward.** R1-P1-001, R1-P1-002 and R2-P1-001 remain active; nothing in this iteration resolves them.

## Confirmed-Clean Surfaces

- `compaction-context.mjs:141-149` -- `writeJournalSize` mirrors `writeWatermark`'s mkdir-then-write shape, so the two state files share one convention.
- `compaction-context.mjs:254-256` and `compaction-post-tool.mjs:82-86` -- both entry points keep the never-throw contract.
- `handover-parts.mjs:186-272` -- every failure path logs through `logEvent` and returns a string, so the composer never sees a throw.
- `run-conversation-scenario.cjs:3345-3400` -- the flag is parsed, defaulted and documented in one place.

## Ruled Out

- **The `--remove-home` fix being incomplete.** The writable-then-delete path, the `vibe_home_removed` field and the usage text all agree.
- **A stale `compaction-post-tool.mjs` or `turn-end.mjs` header.** Both were updated by the commit; only `turn-start.mjs` was missed.
- **Dead code in the compaction detector.** Every exported function has a caller: `buildCompactionPart` from both composers, `buildPostToolPart` from the binding, `measureJournal` from the binding's default.
- **A missing test for the post-tool size gate.** `compaction-context.test.mjs:210-235` covers both the skip and the run; only the empty-text branch is uncovered (finding 2).

## Next Focus

- Dimension: cross-reference (all four dimensions revisited)
- Focus area: the `feature_catalog_code` overlay left pending since iteration 2, plus a final consistency pass over the eight active findings
- Reason: the four dimensions are now covered; the remaining work is the overlay protocol and the synthesis input
- Rotation status: correctness, traceability, security and maintainability reviewed; cross-reference remains
- Blocked/productive carry-forward: productive -- reading the module headers against `PARTS` found a precise, cheap maintainability gap
- Required evidence: `file:line` on the feature-catalog claim plus a consistency check across the registry

## Verdict

CONDITIONAL -- no active P0; three active P1 findings remain (R1-P1-001, R1-P1-002, R2-P1-001). The maintainability dimension is PASS with three advisories.

Review verdict: CONDITIONAL
