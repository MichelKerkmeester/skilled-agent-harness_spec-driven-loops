---
title: "Decision Record: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Architecture decisions and codex probe evidence behind running the cli-codex alignment leaf read-only with wrapper-authored state."
importance_tier: "important"
contextType: "general"
---
# Decision Record: Read-Only cli-codex Deep-Alignment Audit Leaf

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Contain the codex leaf with a read-only sandbox, not by disabling apply_patch

**Status:** Accepted

**Context.** The single-executor deep-alignment cli-codex leaf ran `--sandbox workspace-write` so it could Bash-write its three iteration artifacts. `codex exec` also gives the model a native `apply_patch` edit tool, which a codex leaf reflexively used to write those artifacts. That tool-mediated write violates the loop's "every state write is Bash-mediated, never tool-mediated" contract, and the orchestrator halted the run with `executor_contract_violation` at iteration 3 — before the sk-code lane was ever reached.

**Options considered.**
1. **Disable the apply_patch tool via codex config.** Probed codex 0.144.6: `-c include_apply_patch_tool=false` had no effect (the leaf still created files via `file_change`/apply_patch); the model catalog declares `apply_patch_tool_type: "freeform"` per model. No clean per-invocation toggle exists.
2. **Harden the prompt.** The prompt already forbade tool-mediated writes; the leaf ignored it. Prose is not enforcement.
3. **Path-scoped workspace-write.** Prior work (the 038 containment packet) empirically proved codex `workspace-write` covers the whole workspace regardless of `-C/--add-dir`; there is no read-anywhere + write-only-artifactDir flag combination.
4. **Read-only sandbox.** Probe: a create-file task under `--sandbox read-only` was denied (file not created; codex reported "read-only"). Read-only blocks all writes — including apply_patch — structurally.

**Decision.** Run the leaf `--sandbox read-only`. It is the only option that makes writing (and thus the contract violation) impossible rather than merely discouraged.

**Consequence.** A read-only leaf cannot write its own artifacts, so state-authoring moves to the dispatch wrapper (ADR-002).

<!-- /ANCHOR:adr-001 -->
---

<!-- ANCHOR:adr-002 -->
## ADR-002: The wrapper authors the state; the leaf only reports

**Status:** Accepted

**Context.** With the leaf read-only, something else must produce the iteration narrative, state-log record, and delta file — and the record must carry the route-proof fields the orchestrator's contract asserts.

**Decision.** The leaf emits one structured JSON object as its final message (captured via `codex -o`); the wrapper parses it and writes the three artifacts. The route-proof invariants (`mode`, `target_agent`, `agent_definition_loaded`, `resolved_route`, `iteration`) are stamped by the wrapper from constants and always override any value the model reported, so the record's identity is authoritative. Audit content (status, artifactsChecked, findings, ratios) comes from the leaf. The record schema is copied from the existing OUTPUT CONTRACT, so the reducer and convergence gate are unchanged.

**Consequence.** Route-proof conformance no longer depends on the model formatting a record correctly. A malformed report writes nothing and fails the iteration fail-closed (redispatch), never a workflow halt or a partial record.

<!-- /ANCHOR:adr-002 -->
---

<!-- ANCHOR:adr-003 -->
## ADR-003: Branch-local override and wrapper-synthesized narrative

**Status:** Accepted

**Context.** The read-only OUTPUT CONTRACT could live in the shared prompt template (forked by executor kind) or be applied at the dispatch site. Separately, the human-facing narrative markdown could be model-emitted or wrapper-derived.

**Decision.** Apply the read-only override in the `if_cli_codex` branch (append to the rendered prompt) rather than forking the shared template, and synthesize the narrative in the wrapper from the structured record.

**Rationale.** The branch-local override keeps the shared template and the native/cli-opencode paths byte-unchanged (smaller blast radius); the read-only sandbox — not the prompt — is the real enforcement, so the override only needs to redirect the leaf to report instead of write. Wrapper-synthesizing the narrative removes the largest JSON parse-fragility surface, since the narrative is human-facing only and never parsed by the reducer.

**Consequence.** If the read-only leaf pattern is later extended to deep-review / deep-research, promoting the override into the shared template becomes the natural refactor; the writer helper is already reusable.

<!-- /ANCHOR:adr-003 -->
