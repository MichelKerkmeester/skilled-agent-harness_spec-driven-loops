# Iteration 8: code READMEs — system-deep-loop

> dimension: accuracy | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] Runtime READMEs omit alignment and invent a fourth improvement lane**  
  `.opencode/skills/system-deep-loop/runtime/lib/README.md:12`; `.opencode/skills/system-deep-loop/runtime/lib/cross-mode-closures/README.md:12`; `.opencode/skills/system-deep-loop/runtime/lib/mode-contracts/README.md:12`  
  Evidence: `mode-registry.json:30-198` defines seven workflow modes: research, review, ai-council, alignment, and three improvement lanes. `cross-mode-closures/types.ts:38-46` also includes `008-deep-alignment`. The READMEs either omit alignment or claim four improvement lanes.  
  Fix: Describe five workflow families or seven workflow modes, explicitly naming alignment and the three improvement lanes.

- **[P1] Authorized-ledger README describes a legacy-result agreement check that does not exist**  
  `.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/README.md:3,12`  
  Evidence: `TransitionAuthorizationGateway.authorize()` at `transition-authorization-gateway.ts:553-600` evaluates only the transition request, ledger head, authority epoch, and registered policy. `DarkLedgerAdapter.recordAfterLegacy()` at `dark-ledger-adapter.ts:133-179` receives `legacyResult`, authorizes and appends independently, then returns that result unchanged; it never compares the legacy result with the typed decision. The description also overstates adoption: several domains—including `council`, `coverage-graph`, and `event-envelope`—do not import the authorized-ledger module.  
  Fix: State that authorization occurs after the legacy result is final and does not alter it. Replace “every other domain” with “ledger-backed domains.”

- **[P1] Progress README falsely claims coverage across every mode and reducer**  
  `.opencode/skills/system-deep-loop/shared/progress/README.md:3,12`  
  Evidence: `rg` found no `progress-record` use anywhere under `deep-improvement` or `deep-alignment`. Of the three `reduce-state.cjs` files, research and the shared runtime reducer import the helper, while `deep-improvement/scripts/shared/reduce-state.cjs` does not. The README’s own consumer list at lines 23-27 is narrower than its universal claim.  
  Fix: Scope the description to the listed consumers, or wire the missing modes before claiming every mode and completion reducer uses it.

- **[P1] Summary-fallback test README names an unused ground-truth fixture**  
  `.opencode/skills/system-deep-loop/deep-review/scripts/tests/README.md:19`  
  Evidence: `reduce-state-summary-fallback.test.cjs:14-20,74-85` creates temporary fixtures with `mkdtemp`, writes their state dynamically, and removes them afterward. `rg "blocked-stop-session"` returns no match in that test. The fixture’s own README describes a separate `blocked_stop` reducer scenario.  
  Fix: Remove the fixture row from this README, identify the real test that consumes it, or update the test to load it.

- **[P1] cli-guards README lists three scripts that do not consume the helper**  
  `.opencode/skills/system-deep-loop/runtime/scripts/lib/README.md:22`  
  Evidence: `rg -n "cli-guards" runtime/scripts --glob '*.cjs'` finds imports only in `convergence.cjs`, `query.cjs`, `status.cjs`, `upsert.cjs`, `fanout-run.cjs`, and `fanout-pool.cjs`. The listed `fanout-salvage.cjs`, `fanout-merge.cjs`, and `loop-lock.cjs` have no import.  
  Fix: Remove those three scripts from the consumer list or document a real indirect dependency.

Verified clean: all 150 Markdown link targets in the 64 changed READMEs resolve, and sampled folder-content inventories match the filesystem.
