---
title: "Decision Record: cli-codex model roster + codex-hook doc alignment"
description: "Architecture decisions for the cli-codex roster expansion: document the full four-model roster with per-model ceilings, reframe CX-002 in place, and verify every model×level live before documenting it."
trigger_phrases: ["cli-codex model roster decisions", "codex roster ADR", "codex effort ceilings"]
importance_tier: important
contextType: implementation
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/008-cli-codex-model-roster-and-alignment"
    last_updated_at: "2026-07-14T04:11:03Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the three roster-alignment decisions"
    next_safe_action: "Reindex renamed cli-codex docs after primary reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: cli-codex model roster + codex-hook doc alignment
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Document the full four-model roster with per-model effort ceilings
<!-- ANCHOR:adr-001-context -->
### Context
The cli-codex docs asserted a single-model contract — "the skill dispatches `gpt-5.5` for every task". But the `fast` service tier exposes three more GPT-5.6 models (`luna`, `terra`, `sol`) that reach reasoning-effort levels (`max`, `ultra`) the docs never named, so a caller who needed reasoning past `xhigh` had no documented path.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
Replace the single-model lock with a documented four-model roster on the `fast` tier, each with its own reasoning-effort ceiling, and extend the effort scale from `none…xhigh` to add `max` and `ultra`:
- **`gpt-5.5`** — skill default at `medium`; ceiling `xhigh`.
- **`gpt-5.6-luna`** — ceiling `max`; the `luna-impl` config profile pins `max`.
- **`gpt-5.6-terra`** — ceiling `max`; no config profile, callable directly via `-m gpt-5.6-terra`.
- **`gpt-5.6-sol`** — ceiling `ultra`; the `sol-verify` config profile pins `xhigh`, and it is the only model that reaches `ultra`.
Keep `gpt-5.5 medium fast` as the skill default so the change is backward-compatible and only adds selectable models.
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives
Keep the single-model lock (rejected: hides three usable models and every reasoning level above `xhigh`). Document the extra models but change the default to a GPT-5.6 model (rejected: breaks backward compatibility and raises the cost of the typical delegation for no benefit). Document the models without ceilings (rejected: a caller could request `ultra` on a model that caps at `max` and get a rejected call).
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
Callers can escalate past `xhigh` on a documented, verified path; the default delegation is unchanged. The per-model ceiling contract must be mirrored consistently across `SKILL.md`, `README.md`, and `cli_reference.md`. Defining a repo-level `[profiles.*]` for `gpt-5.6-terra` remains an out-of-scope follow-up.
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
Clarity: roster is a ceiling table, not prose. Systems: steers every cross-AI codex delegation. Bias: models proven callable, not assumed. Sustainability: default unchanged, additive-only. Value: unblocks deep-reasoning dispatch.
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Express the ceiling contract once (`gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`) and mirror it into each consuming doc's flag table, roster table, and override examples.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Reframe the CX-002 playbook scenario in place
<!-- ANCHOR:adr-002-context -->
### Context
The manual-testing scenario `CX-002` lived in `manual_testing_playbook/cli_invocation/gpt_5_5_model_lock.md` and asserted a single supported model. The expanded roster makes that assertion wrong, but the file is referenced by the playbook index and by feature-file id `CX-002`.
<!-- /ANCHOR:adr-002-context -->
<!-- ANCHOR:adr-002-decision -->
### Decision
Reframe CX-002 in place — change the scenario from "model lock" to "default pin + roster verification" — while keeping the filename `gpt_5_5_model_lock.md` and the `CX-002` id, and updating the playbook index entry and global precondition #6 to match.
<!-- /ANCHOR:adr-002-decision -->
<!-- ANCHOR:adr-002-alternatives -->
### Alternatives
Rename the file to `gpt_model_roster.md` and reissue the id (rejected: breaks the playbook index and any feature-file references to `CX-002`, for a cosmetic gain). Delete CX-002 and add a fresh scenario (rejected: loses the scenario's history and its index slot). Leave CX-002 asserting the old lock (rejected: the playbook would document a false contract).
<!-- /ANCHOR:adr-002-alternatives -->
<!-- ANCHOR:adr-002-consequences -->
### Consequences
The playbook index and all `CX-002` references keep resolving; the scenario now verifies the real behavior (default pinned, GPT-5.6 roster callable). We accept a mild drift between the filename/title (`gpt_5_5_model_lock`) and the reframed content, which is the cheaper trade against a broken index.
<!-- /ANCHOR:adr-002-consequences -->
<!-- ANCHOR:adr-002-five-checks -->
### Five Checks
Clarity: one scenario, new intent. Systems: protects the index. Bias: no rename churn. Sustainability: id stays stable. Value: keeps references intact.
<!-- /ANCHOR:adr-002-five-checks -->
<!-- ANCHOR:adr-002-impl -->
### Implementation Notes
Update the scenario body, the `manual_testing_playbook.md` index row, and global precondition #6 together so the reframed scenario and its index agree.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Verify every model×level live before documenting it
<!-- ANCHOR:adr-003-context -->
### Context
A model roster is only useful if every documented model ID and effort level is actually callable; a phantom entry would fail only at dispatch time, inside a downstream delegation, where it is expensive to diagnose.
<!-- /ANCHOR:adr-003-context -->
<!-- ANCHOR:adr-003-decision -->
### Decision
Run the full twenty-cell model×effort matrix through `codex exec` (ChatGPT OAuth, `service_tier=fast`, read-only, ~5s latency) **before** writing any roster doc, and document only cells that returned correctly. The matrix: `gpt-5.5` at low/medium/high/xhigh (4/4); `gpt-5.6-luna` at low/medium/high/xhigh/max (5/5); `gpt-5.6-terra` at low/medium/high/xhigh/max (5/5); `gpt-5.6-sol` at low/medium/high/xhigh/max/ultra (6/6) — 20/20 PASS.
<!-- /ANCHOR:adr-003-decision -->
<!-- ANCHOR:adr-003-alternatives -->
### Alternatives
Document from the vendor model list without live proof (rejected: risks a phantom ID). Verify only a representative sample (rejected: a per-model ceiling claim needs the ceiling cell itself proven, so partial coverage cannot support the contract).
<!-- /ANCHOR:adr-003-alternatives -->
<!-- ANCHOR:adr-003-consequences -->
### Consequences
Every documented model×level is proven callable, and the per-model ceiling contract is empirically grounded. A notable finding: `gpt-5.6-terra` is callable directly via `-m` despite having no config profile, so the docs state that explicitly rather than implying a profile is required.
<!-- /ANCHOR:adr-003-consequences -->
<!-- ANCHOR:adr-003-five-checks -->
### Five Checks
Clarity: 20 cells, one verdict each. Systems: proves the dispatch surface. Bias: no phantom IDs. Sustainability: cheap to re-run. Value: the roster is auditable.
<!-- /ANCHOR:adr-003-five-checks -->
<!-- ANCHOR:adr-003-impl -->
### Implementation Notes
Capture the 20-cell matrix in the CX-002 playbook so the roster claim is auditable against real returns, not asserted.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
