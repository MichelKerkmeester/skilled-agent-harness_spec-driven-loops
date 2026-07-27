# Iteration 2 prompt

Audit the parent routing-reference documents against the live compiled-routing runtime and all seven declared hubs. Verify every suspected drift directly on disk, excluding research, benchmark, lineage, log, and run-record artifacts. Report only findings with file:line evidence, P1/P2 severity, and NEW or PRE-EXISTING classification.

Focus: coverage claims for `smart-routing.md`, `leaf-manifest.json`, and the compiled serving authority; whether hub-router policy is telemetry-only or is consumed by the compiled serving engines; and whether commit `140266be3e` introduced either defect.
