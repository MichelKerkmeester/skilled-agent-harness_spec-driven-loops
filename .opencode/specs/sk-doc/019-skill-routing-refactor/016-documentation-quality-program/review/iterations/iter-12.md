# Iteration 12: refreshed catalogs (runtime/lib 3->37 domains, runtime/tests)

> dimension: accuracy | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P1] The catalog falsely describes the ledger and event envelope as universal foundations**

  `.opencode/skills/system-deep-loop/runtime/lib/README.md:12`

  Evidence: Lines 12, 16, 20, and 33 claim every domain uses `authorized-ledger` and `event-envelope`. Actual import searches found no `authorized-ledger` dependency in seven listed domains, including `council/`, `coverage-graph/`, and `write-set-conflict-graph/`; the latter imports only local modules and Node APIs. `council/`, `coverage-graph/`, and `write-set-conflict-graph/` also have no `event-envelope` dependency.

  Fix: Qualify these as foundations for ledger-backed/convergent-architecture domains. Explicitly exclude legacy or isolated domains, and change “every other domain” to “ledger-backed domains.”

- **[P1] `cross-mode-closures/` claims runtime adoption that does not exist**

  `.opencode/skills/system-deep-loop/runtime/lib/README.md:29`

  Evidence: The row says every deep-loop mode invokes the five closures. Repository-wide code searches for `cross-mode-closures` and its exported symbols found consumers only in its unit test; mode packets and orchestration scripts do not import it. `catalog.ts:59-73` creates a manifest mapping modes to implementations, but that is not runtime invocation.

  Fix: Describe it as a catalog or shared implementation layer available/intended for mode integration, unless every mode is actually wired to invoke it.

- **[P1] The tests catalog omits active test surfaces**

  `.opencode/skills/system-deep-loop/runtime/tests/README.md:3`

  Evidence: The README says harnesses are organized into seven suites and lists only those directories. Three active root-level files—`executor-audit-cli-branch-receipts.test.ts`, `executor-audit-receipts.test.ts`, and `receipt-crypto.test.ts`—are matched by `vitest.config.ts:20` but never cataloged. Additionally, `integration/` contains 10 test files while its catalog description at line 22 and child README account for only nine; `divergent-pivot.vitest.ts` is omitted.

  Fix: Add a root-level-tests section or move those tests under `unit/`. Expand the `integration/` description to include divergent-pivot transaction and recovery coverage.

Verified: the directory tables otherwise match exactly—37/37 direct `lib/` domains and 7/7 direct `tests/` directories—and every linked README exists.

Review verdict: CONDITIONAL
