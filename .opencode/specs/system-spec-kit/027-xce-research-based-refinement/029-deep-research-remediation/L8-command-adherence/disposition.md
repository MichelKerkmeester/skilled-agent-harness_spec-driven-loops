---
title: "L8 Command-Dashboard Adherence — Disposition"
description: "SUPERSEDED RESULT: the 3/3 envelope failure was a probe-harness artifact — `opencode run \"/memory:search …\"` never invokes the command runtime. Dispatched correctly (`--command memory/search`), gpt-5.5 medium renders the envelope 3/3 with the already-shipped doc fixes. Winner: protocol fix, codified in cli-opencode + probe.sh."
trigger_phrases:
  - "L8 adherence disposition"
  - "command dashboard render contract result"
  - "render contract probe harness artifact"
importance_tier: "normal"
contextType: "implementation"
---
# L8 Command-Dashboard Adherence — Disposition

<!-- ANCHOR:superseding-result -->
## SUPERSEDING RESULT (2026-06-12) — the failure was a measurement artifact

A fresh Fable 5 investigation (`true-solution-investigation.md`) reproduced the prior probes and inspected the opencode session store directly: `opencode run "/memory:search …"` passes the slash text to the model as **raw prose** — the command runtime is never invoked, and `search.md` (with its MUST-template, Execution Order, and Presentation Boundary) **never enters the model's context**. Every "adherence failure" below was measured against a model that had never received the contract. Session-store ground truth: the probe's user message was the bare 66-byte string; zero rows matched `MUST emit exactly` or `search_presentation`.

**Corrected protocol** — `opencode run --command memory/search --model openai/gpt-5.5 --variant medium --dir "$PWD" "daemon lease heartbeat" </dev/null` — injects the full router template with `$ARGUMENTS` substituted. Result on the SAME mid-tier model:

- Investigator gauntlet: **3/3 envelope PASS** (including the weak-retrieval path that previously triggered narration).
- Independent host re-verification (fresh sessions, bare args): **3/3 envelope PASS** — probes read the presentation asset first, recovered from MCP tool rejections, and still emitted the exact `MEMORY:SEARCH … STATUS=OK` block (one probe wrapped the envelope in a code fence; all envelope lines exact). Negative control (raw slash text) reproduced the prose failure exactly.

Conclusion: **the shipped R1–R5 doc fixes work when the command is actually delivered.** The claim "mid-tier models do not honor exact output envelopes" is unsupported for correctly-dispatched commands.

### What shipped for the true solution (winner F: protocol fix)
- `cli-opencode/SKILL.md` Core Invocation Pattern + `references/cli_reference.md`: the `--command` dispatch rule — slash text in a run message is NOT expanded; registered commands require `--command <family>/<name>` (registry names are slash-namespaced); behavior probes MUST use it; verified on opencode 1.17.4.
- `probe.sh` (this folder): canonical 3-probe gauntlet + labeled negative control, with mechanical PASS criteria. The negative control doubles as a semantics-drift tripwire.
- Slot polish (residual real issue): `<score>` format rule (0–1, two decimals) added to `memory/search.md` and `assets/search_presentation.txt` — one corrected probe had rendered `79.44`.
- Stale-placeholder sweep: `User request: {{args}}` → `$ARGUMENTS` in 10 routers (doctor/speckit, doctor/mcp, doctor/update, all 7 create/*) — `{{args}}` is not an opencode placeholder and was injected literally.

### Demoted (with reasons)
- **R8 CI golden-fixture lint**: lints artifacts, cannot observe model behavior, and would NOT have caught this bug (the artifacts were consistent; the harness was broken). Keep as an optional drift guard only.
- **R7 memory-family YAML assets**: architectural parity, not an adherence mechanism — no family's YAML influenced raw-text dispatches (it was never loaded). Optional later.
- **Runner-up A (expansion-time mechanical renderer via `` !`…` `` injection)**: proven feasible (shell runs at template-expansion time, bytes-guaranteed envelope); adopt only if slot drift becomes unacceptable or weaker executors are used.

### Open risks carried forward
- TUI slash-invocation parity assumed, not verified non-interactively.
- `--command` semantics pinned to opencode 1.17.4; the probe.sh negative control trips if semantics change.
- MCP tool friction: all corrected probes hit `memory_context` empty-string-optional rejections (e.g. `E_SESSION_SCOPE`) before recovering via fallback — costs mid-tier executors turns; candidate server-side accept-and-strip fix is a separate packet.
- Prior 006 research transcripts (positive AND negative behavioral claims) were captured under the broken harness; structural analysis stands, behavioral claims need re-measurement under `--command`.
<!-- /ANCHOR:superseding-result -->

<!-- ANCHOR:shipped -->
## Shipped (committed) — historical record

Doc-only edits across `.opencode/commands/`, two commits (`c3911dfe2f`, plus the filled-examples commit):
- `memory/search.md`: numbered Execution Order (read the asset first), inlined the compact `MEMORY:SEARCH … STATUS` render contract marked "MUST emit exactly this shape", header/STATUS self-check line, and a Presentation Boundary section.
- `memory/save.md`, `memory/manage.md`, `memory/learn.md` and the `create/` + `deep/` routers that lacked one: Presentation Boundary sections mirroring `doctor/`.
- `memory/assets/search_presentation.md`: top-of-file template index + a filled example and a tool-field→slot mapping table for the retrieval template.
- `memory/assets/manage_presentation.md`: a filled stats-dashboard example + field-mapping table.

These are genuine structural improvements and are kept — the corrected probes show them actively steering the model (probes opened by reading the presentation contract first).
<!-- /ANCHOR:shipped -->

<!-- ANCHOR:result -->
## Empirical result (2026-06-11) — SUPERSEDED, kept for the record

Re-running the bare `/memory:search` command on gpt-5.5 medium (normal speed), three independent probes, **all three** rendered free prose ("Memory Search Result / Best match found, but retrieval quality was weak…") instead of the `MEMORY:SEARCH … STATUS=OK` envelope — even after the inlined MUST template and the filled examples.

**This result was measured with `opencode run "<slash text>"`, which never delivered the command template to the model (see SUPERSEDING RESULT above).** The observed behavior was the model freestyling from AGENTS.md + advisor routing + tool schemas with the render contract structurally absent — it remains the accurate description of what raw-text dispatch produces, and probe.sh keeps it as the negative control.
<!-- /ANCHOR:result -->
