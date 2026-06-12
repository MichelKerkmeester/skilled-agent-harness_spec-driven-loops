# Iteration 015 (wave 2, gpt-5.5-fast xhigh) — Synthesis: true-solution architecture

**Verdict:** Recommended architecture: mandatory correct command dispatch plus command-local deterministic rendering for dynamic exact envelopes. First implementation step: enforce/use the existing `--command memory/search` gauntlet everywhere, then add `render_search_envelope.cjs` only if dual-stack weaker-executor hardening is required.

## [MECHANISM] Rank 1: fix command invocation first
- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/L8-command-adherence/disposition.md:18 - Corrected protocol — `opencode run --command memory/search ...` injects the full router template with `$ARGUMENTS` substituted.
- Detail: The strongest repo evidence supersedes the initial premise: the 3/3 dynamic failure was measured on raw slash text, so the command contract was absent. Correct `--command` dispatch passes 3/3 on the same gpt-5.5 medium tier.
- Recommendation: Make `--command <family>/<name>` the mandatory harness and external-dispatch path for slash commands; keep raw slash-text dispatch only as the negative control in `probe.sh`.

## [NEW-FEATURE] Rank 2: command-local mechanical renderer
- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/L8-command-adherence/true-solution-investigation.md:137 - New `.opencode/commands/memory/scripts/render_search_envelope.cjs` (~120 LOC): join `process.argv` → query; ... print the exact envelope.
- Detail: For dual-stack execution with mid-tier or weaker models, the robust architecture is to move dynamic envelope assembly out of the model and into a deterministic command-local renderer. This preserves model variability for reasoning while making UI bytes mechanical.
- Recommendation: If more hardening is needed, implement `render_search_envelope.cjs` for `/memory:search` and inject it at command-expansion time; model instruction becomes: if a pre-rendered `MEMORY:SEARCH` block exists, output it verbatim and stop.

## [CONSTRAINT] Do not put per-command UI in shared tools
- Evidence: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1116 - Use standardized success response envelope
- Detail: The MCP layer returns generic structured data with `summary`, `data`, `results`, and hints, not slash-command presentation. Making `memory_search` return `MEMORY:SEARCH` would mix command UI policy into shared transport and still leaves model-mediated display unless paired with mechanical injection.
- Recommendation: Keep tools returning structured JSON; put exact human-facing envelopes in command-local renderers that consume tool output.

## [MECHANISM] Post-processing works when script-owned
- Evidence: .opencode/skills/deep-context/scripts/reduce-state.cjs:660 - Reduce the deep-context state log + per-seat findings into a synchronized findings registry and dashboard.
- Detail: The repo already uses script-owned reducers for deterministic dashboard artifacts, and they are idempotent for the same inputs. That pattern is the right mechanical post-processing model for dynamic displays whose data exists after execution.
- Recommendation: For read-only commands, pre-render at expansion time when possible; for post-mutation results, use a workflow/renderer step that validates and prints the final envelope after the mutation.

## [CONSTRAINT] Stronger model is not the render solution
- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/L8-command-adherence/disposition.md:20 - Investigator gauntlet: **3/3 envelope PASS**
- Detail: Medium-tier gpt-5.5 passes when the command is actually delivered, so model tier was not the decisive variable. Stronger models may reduce prose drift, but they are an expensive probabilistic substitute for deterministic rendering.
- Recommendation: Reserve stronger models for synthesis or ambiguous decisions; do not rely on model tier to enforce exact envelopes.

## [CONSTRAINT] CI lint is a guard, not the mechanism
- Evidence: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/029-deep-research-remediation/L8-command-adherence/disposition.md:32 - R8 CI golden-fixture lint: lints artifacts, cannot observe model behavior, and would NOT have caught this bug.
- Detail: CI can catch asset drift and template mismatch, but it cannot prove live command expansion or model adherence by itself. The useful CI artifact is a gauntlet that runs the correct command path and keeps the raw slash path as a semantics-drift tripwire.
- Recommendation: Add CI lint only after the invocation contract and renderer path are settled; wire it to `probe.sh`-style pass/fail criteria, not static prose checks alone.
