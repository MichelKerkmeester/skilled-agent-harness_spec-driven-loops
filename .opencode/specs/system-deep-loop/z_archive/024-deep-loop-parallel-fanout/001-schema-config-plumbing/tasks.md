<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 001: Fan-out schema + config plumbing

- [x] T1: Add lineageExecutorSchema + fanoutConfigSchema to executor-config.ts.
- [x] T2: Add parseFanoutConfig (per-entry reuse of parseExecutorConfig + label uniqueness).
- [x] T3: Add expandLineages (count→labels).
- [x] T4: Thread optional lineageId through executor-audit.ts (input/record/builder).
- [x] T5: Extend executor-config.vitest.ts (+9 fan-out tests).
- [x] T6: Run full unit suite — 163/163 green; parity preserved.
