# Review Iteration 004

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Mode: review, execution single_review_iteration, state source externalized files
- Session: `fanout-vibe-2-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Iteration: 4 of 5 (stopPolicy `max-iterations`)
- Dimension: correctness
- Operator review focus: correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. This iteration addresses the focus by auditing the six adapters for the two properties the review focus names: whether a claim actually gates delivery, and whether the injected `env` seam is honoured or silently bypassed.
- Sources read: `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/nudge.cjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`, `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`, `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`, `.skilled/hooks/shared/hook-flags.cjs`.

## Files Reviewed

- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:1-454`
- `.skilled/hooks/session-handover/lib/nudge.cjs:693-720,824-890`
- `.skilled/hooks/goal/vibe/goal-inject.mjs:1-42`
- `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:1-110`
- `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs:1-88`
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:1-127`
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:1-193`
- `.skilled/hooks/shared/hook-flags.cjs:212-245`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 remains active and is carried forward.

### P2 Findings

1. **A throwing nudge commit releases the claim and still delivers the nudge** -- `.skilled/hooks/session-handover/vibe/handover-parts.mjs:303-313` -- the block's own comment states the invariant: "Vibe runs tool calls side by side, so only the hook that holds the session's nudge claim delivers the nudge, after deciding again under that claim." The code enforces it for one outcome only: `if (committed === null) return '';`. A throw is caught, logged, and then execution falls through to `nudge.handoffText(...)` at line 315, which delivers the text without a claim. `commitNudge` releases the claim in a `finally` (`nudge.cjs:887-889`), so a throw from `nudgeDecision` — which `require`s a module inside the function at `nudge.cjs:706` — or from `writeState` leaves no claim held and no decision recorded, yet the text still goes out.
   Finding class: algorithmic
   Scope proof: the caller is inside the declared target; `nudge.cjs` is cited as the contract it relies on.
   Affected surface hints: `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/nudge.cjs`, the `compaction-post-tool` binding in `.vibe/hooks.toml` which calls this part on every tool call
   Case: two tool calls in one Vibe batch both reach the hand-over part with the fill over threshold. The first takes the claim and throws inside `nudgeDecision`; its claim is released and it delivers anyway. The second takes the claim and delivers too, so the operator sees the nudge twice.

2. **The advisor's head receipt reads `process.env` instead of the `env` the adapter accepts** -- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:64-68` -- `headReceiptDir()` reads `process.env[STATE_DIR_ENV]` directly, while `buildAdvisorPart` accepts an `env` parameter (line 162) and threads it into `isChildSession` (line 169) and `isEnabled` (line 173). The file's own comment at lines 41-43 says the switch exists "so one switch isolates both receipts in a test or a scratch run", which is exactly what the bypass defeats.
   Finding class: test-isolation
   Scope proof: inside the declared target.
   Affected surface hints: `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` which calls it
   Case: a test calls `buildAdvisorPart(payload, { env: { SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: tmp } })` to isolate its receipts. The head receipt still lands in the machine-wide `tmpdir()/speckit-advisor`, so a second test with the same session id reads the first test's receipt and its brief is suppressed.

3. **Two adapters accept an `env` seam and then ignore it for the enable check** -- `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:86` and `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:93` -- both call `enabled(CONCERN)` with one argument. `isHookEnabled(concern, env, config, options)` treats an absent `env` as "read the live process environment and the operator's config file" (`hook-flags.cjs:234-242`), so the injected `env` reaches `isChildSession` but never the switch. `turn-start.mjs:51,76` does the same for the `completion` and `decision-capture` concerns.
   Finding class: test-isolation
   Scope proof: inside the declared target; `hook-flags.cjs` is cited as the resolver whose contract is bypassed.
   Affected surface hints: `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`
   Case: a test passes `env: { SYSTEM_ASK_SURFACE_DISABLED: '1' }` to prove the part is silent when switched off. The part still fires, because the resolver read the real process environment instead. The same test passes on a machine where the operator happens to have exported the switch, so the suite's result depends on the machine.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The hand-over part's documented claim invariant (`handover-parts.mjs:301-302`) is enforced for the `null` outcome and not for a throw. The advisor's documented isolation switch (`prompt-advisor.mjs:41-43`) is not honoured by the code that reads it. |
| `checklist_evidence` | notApplicable | No checklist document on a hook and plugin surface. |

## Integration Evidence

- `.skilled/hooks/session-handover/lib/nudge.cjs:877-890` — `commitNudge` returns `null` on contention, releases the claim in a `finally`, and lets a throw propagate.
- `.skilled/hooks/session-handover/lib/nudge.cjs:693-720` — `nudgeDecision` `require`s `goal-core.cjs` inside the function body, one of the throw paths finding R4-P2-001 depends on.
- `.skilled/hooks/shared/hook-flags.cjs:234-242` — an absent `env` selects `process.env` plus `fileConfig()`, the behaviour finding R4-P2-003 turns on.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:51,76` — the same one-argument enable check in the composer.
- `.skilled/hooks/session-lifecycle/vibe/README.md:29` — the switch table that names `SYSTEM_ASK_SURFACE_DISABLED` and `SYSTEM_COMPLETION_DISABLED`, the switches the tests in R4-P2-003 would set.

## Edge Cases

- **`appendAdvisoryLog` was checked and does not throw.** `completion-evidence-sentinel.cjs:382-401` wraps its whole body in a try/catch and returns `false`, so the unguarded call at `completion-evidence-post-agent.cjs:109` cannot lose the pending advisory. Not a finding.
- **`claimNudge` was checked and does not throw.** `nudge.cjs:836-845` returns a no-op claim on any error, so the throw in R4-P2-001 must come from `nudgeDecision` or `writeState`, not from the claim itself. The finding is scoped accordingly.
- **`earlyWithdrawn` is bounded.** `handover-parts.mjs:203` is a module-level `Set`, but each hook invocation is a fresh process and the entry is deleted at line 259 in the same turn, so it cannot grow across turns.
- **Prior-finding overlap checked.** None of the three appears in the 29 dispositions. `R4-P2-003--f6d51a8e69ea` was the typed-prompt withdraw fix in this same file; R4-P2-001 here is the claim path, a different mechanism.

## Confirmed-Clean Surfaces

- `handover-parts.mjs:213-225` — `withdrawBeforeTurnStart` requires a `pre_agent` event, an enabled concern, a valid session id, a non-seed prompt and a typed prompt before it withdraws.
- `handover-parts.mjs:246` — a `post_tool` payload from a subagent returns before any work.
- `handover-parts.mjs:248-256` — a seed prompt returns the seed instructions and nothing else.
- `handover-parts.mjs:355-448` — `armHandoverTurnEnd` never denies, marks the record parked on every failure path, and resolves the target pid before arming.
- `handover-parts.mjs:121-153` — `newestJournalFile` skips a non-file, a non-segment name and a vanished entry, and breaks an mtime tie by name.
- `goal-inject.mjs:30-41` — an unset variable, a missing packet and any core error all yield an empty string.
- `ask-surface-post-agent.mjs:32-35` — the question tool is matched by exact name or by a `.`-suffixed leaf, so a namespaced call is recognized.
- `ask-surface-post-agent.mjs:40-49` — a `keep` catalog entry is skipped, so only an entry that lists tools can answer whether the question tool is offered.
- `ask-surface-post-agent.mjs:100-107` — the marker is keyed by turn id, so it holds across every retry Vibe counts for one operator message.
- `ask-capture-post-tool.mjs:51-82` — every failure path exits 0 with no output, and the live hook and the save-time sweep share one mapper so one answer writes one key.
- `completion-evidence-post-agent.cjs:91-96` — a non-object payload, a non-`post_agent` event and an unset `VIBE_SPEC_FOLDER` all return before the evidence check runs.
- `completion-evidence-post-agent.cjs:111-115` — the pending-file write is guarded, so a write failure still leaves the log line.
- `prompt-advisor.mjs:120-139` — a brief that still carries its directive block is delivered whole, and only a head-only brief is deduped.
- `prompt-advisor.mjs:85-93` — the head-receipt folder is bounded to 64 files, evicting the oldest by mtime.

## Ruled Out

- **`appendAdvisoryLog` throwing and losing the pending advisory.** The sentinel wraps its whole body and returns `false`.
- **`claimNudge` throwing.** It returns a no-op claim on any error.
- **`earlyWithdrawn` growing without bound.** Each hook invocation is a fresh process and the entry is deleted in the same turn.
- **`goal-inject.mjs` defaulting `workspace` to `process.cwd()`.** Both callers pass `REPO_ROOT` explicitly.

## Next Focus

- Dimension: traceability and maintainability
- Focus area: parity against the OpenCode plugins, and the wire-format assumptions the `post_tool` and `session_start` payloads rest on
- Reason: iterations 1 to 4 covered the code paths; the remaining question the review focus names is whether the Vibe port dropped a behaviour the OpenCode plugin has, and whether the documented payload fields are the ones the code reads.
- Rotation status: correctness (guard seam), security, correctness (composers and reader) and correctness (adapters) done; traceability and maintainability next.
- Blocked/productive carry-forward: the `process_start` and `system_message` upgrade triggers are carried forward; the journal-ordering direction stays BLOCKED; the untrimmed session id stays an edge case.
- Required evidence: the OpenCode plugin for each ported guard, and the `post_tool` field names the reference doc records as documented rather than observed.

Review verdict: CONDITIONAL
