---
title: "Implementation Summary: Lane C Compiled-Routing Benchmark Alignment"
description: "Planned-state record for a Lane C compiled-path parity harness around the frozen scorer. No benchmark implementation or scorer edit is present yet."
trigger_phrases:
  - "Lane C compiled routing planned summary"
  - "benchmark parity current status"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Lane C Compiled-Routing Benchmark Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Implementation** | Not started |
| **Current Lane C path** | Legacy deterministic router replay only |
| **Frozen scorer state** | Pinned and untouched by this documentation phase |
| **Strict validation** | Planned after the full Markdown set is authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Lane C will gain a deterministic parity module around the existing scorer. For eligible route-gold scenarios it will preserve the legacy replay, invoke the real public compiled front door with a child-only flag-on environment, normalize both routing results, run the same gold evaluator twice, and require mutual routing equality.

### Planned Implementation Surfaces

| Area | Planned Files | Purpose |
|------|---------------|---------|
| Parity harness | `compiled-routing-parity.cjs` | Invocation, normalization, status, equality, and digest checks |
| Orchestration | `run-skill-benchmark.cjs` | Eligible-row execution and distinct gate |
| Reporting | `build-report.cjs`, report JSON schema | Render compiled reality without changing scores |
| Verification | New Vitest suite and isolated fixtures | Prove fresh, divergent, drifted, missing, and broken states |
| Documentation | Lane C README and CLI usage | Explain the new resolved mode and result block |

No Lane C runtime file, fixture, report renderer, manifest, routing input, or frozen scorer file was modified by this planning phase.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implementation waits for the stable P0 front-door/status interface and P3 eligibility/discovery interface. After baseline reports and hashes are captured, the new module lands first, then orchestrator/report integration, then the isolated state matrix and non-regression suite. The frozen modules are imported and hashed only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep compiled alignment outside the scorer | Preserves the pinned D1-D5 and route-gold baseline while adding a new observation path. |
| Exercise the public front door in a child process | Tests the real flag and serving gates and prevents parent environment leakage. |
| Evaluate both paths against gold before comparing them | Two equally wrong routes must not pass merely because they match each other. |
| Compare routing fields, not hashes or generations | The requirement is decision parity; additive metadata is allowed to differ. |
| Use shared status and eligibility interfaces | Prevents Lane C from inventing a local hub list or alternate drift meaning. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Current-state source inspection | Confirmed: Lane C does not invoke the compiled front door or set the flag |
| Frozen file hashes | Planned baseline and after-change comparison |
| Fresh legacy/compiled parity | Planned |
| Divergence gate | Planned |
| Drift/no-manifest/breakage matrix | Planned |
| Environment and manifest isolation | Planned |
| D1-D5 report non-regression | Planned |
| Existing plus new Vitest suites | Planned |
| Strict spec-folder validation | Planned |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stable status and eligibility interfaces are pending.** Sentinel output alone cannot distinguish drift from breakage safely.
2. **The current public front door still reaches a resolver beneath the spec tree.** The P0 remediation must land before this harness becomes a durable CI dependency.
3. **The drift exit-policy boundary remains open.** Lane C must report drift distinctly; the operator must decide whether the benchmark or separate drift-CI job owns the non-zero process signal.
4. **This phase covers deterministic Mode A only.** It does not add paid real-model verification or network activity.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- [ ] Finalize the P0 stable front-door and machine-readable status interface.
- [ ] Finalize P3 eligibility and manifest discovery without a hardcoded hub map.
- [ ] Decide whether Lane C or the separate drift-CI job owns the non-zero drift exit.
- [ ] Implement the harness, orchestrator, report, fixture, test, and documentation changes listed in `spec.md`.
- [ ] Capture and compare legacy D1-D5 baseline reports before enabling the new gate.
- [ ] Re-hash and preserve the three frozen files throughout implementation.
- [ ] Let the parent workflow generate `description.json` and `graph-metadata.json` for this spec folder; this leaf authoring pass does not create them.
<!-- /ANCHOR:follow-up -->
