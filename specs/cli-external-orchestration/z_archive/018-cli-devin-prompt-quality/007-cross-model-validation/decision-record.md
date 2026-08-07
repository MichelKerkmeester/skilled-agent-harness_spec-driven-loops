---
title: "Decision Record: cross-model-validation"
description: "Documents the planned packet 113/007 decision to use cli-opencode as the single dispatch surface for DeepSeek direct and opencode-go Kimi validation."
trigger_phrases:
  - "113/007 adr cli opencode dispatch"
  - "deepseek kimi dispatch surface"
  - "cross model validation adr"
  - "single dispatch surface decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/cli-external-orchestration/018-cli-devin-prompt-quality/007-cross-model-validation"
    last_updated_at: "2026-05-17T12:18:35Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-planned-dispatch-decision"
    next_safe_action: "build-cross-model-confirm-harness"
    blockers: []
    key_files:
      - ".opencode/specs/cli-external-orchestration/018-cli-devin-prompt-quality/007-cross-model-validation/scripts/cross-model-confirm.cjs"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/007-cross-model-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Provider route readiness remains unverified"
    answered_questions:
      - "cli-opencode is the dispatch surface for both target models"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: cross-model-validation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use cli-opencode for Both Model Routes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-17 |
| **Deciders** | cli-codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

Packet 113/007 needs the same harness to dispatch to DeepSeek direct API and to Kimi through the opencode-go gateway. Using separate CLI skills would split provider assumptions and increase the chance that model differences are mixed with dispatch-surface differences.

cli-opencode is the only planned surface in this repo context that routes both `deepseek/deepseek-v4-pro` and `opencode-go/kimi-k2.6`. It is also the canonical surface for these two models per skill memory.

### Constraints

- The run must compare models, not compare CLI wrapper behavior.
- The harness must support both a direct provider route and an opencode-go gateway route.
- Provider costs are operator-paid and the run should avoid duplicate dispatches.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use cli-opencode as the dispatch surface for both target models.

**How it works**: The harness dispatches `deepseek/deepseek-v4-pro --variant high` and `opencode-go/kimi-k2.6 --variant high` through cli-opencode for each variant and fixture tuple. The scoring path remains shared after dispatch: extract generated files with packet 113/005 logic, then score with packet 113/003 logic.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cli-opencode for both models** | Single dispatch surface; supports both provider routes | Requires cli-opencode route readiness | 9/10 |
| Separate cli-* skills by provider | Could use provider-specific skill habits | Adds wrapper variation to a model-comparison run | 5/10 |
| Manual provider calls | Maximum control over request shape | Reimplements dispatch and loses skill-routing parity | 4/10 |

**Why this one**: The experiment needs one dispatch surface so the measured difference is model behavior. cli-opencode is the available surface that can reach both required routes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Model comparison stays cleaner because both targets share the same CLI surface.
- The harness can represent the full 70-row matrix consistently.
- Provider route failures are isolated to model access, not wrapper selection.

**What it costs**:
- Packet 113/007 depends on cli-opencode model routing being healthy. Mitigation: run route preflight before the 70-dispatch matrix.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| cli-opencode route mismatch | H | Preflight both model routes before matrix dispatch |
| opencode-go latency | M | Use append-only results and resume missing tuples |
| Direct API or gateway cost surprise | M | Keep one iteration per tuple and report estimated cost before run |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The held 113/003 findings need cross-model validation before propagation |
| 2 | **Beyond Local Maxima?** | PASS | The plan tests two different frontier-style routes instead of SWE 1.6 only |
| 3 | **Sufficient?** | PASS | One dispatch surface, existing extraction, and existing scoring cover the confirm run |
| 4 | **Fits Goal?** | PASS | The decision directly reduces wrapper variance in the model comparison |
| 5 | **Open Horizons?** | PASS | Results can drive cross-CLI propagation or keep findings scoped to cli-devin |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Add packet-local `scripts/cross-model-confirm.cjs` in packet 113/007.
- Dispatch all 70 model, variant, and fixture tuples through cli-opencode.
- Reuse packet 113/005 extraction and packet 113/003 scoring.

**How to roll back**: Delete or revert the packet-local harness, state outputs, and analysis files; no skill-body or runtime configuration rollback is planned.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Pivot from cli-opencode to cli-devin Due to Binary Bug

**Status**: Accepted (supersedes ADR-001 dispatch surface)
**Decision date**: 2026-05-17

### Context

Smoke-testing cli-opencode 1.15.1 on the operator machine returned a fatal startup error on every `opencode run` invocation: `Error: InstanceRef not provided` from the effect runtime initialization, reproduced 3 times with and without `--pure`, with and without `--dir`, and with and without explicit stdin redirection. Both `deepseek/deepseek-v4-pro` and `opencode-go/kimi-k2.6` are unreachable through cli-opencode until the binary is downgraded.

### Options

1. Downgrade cli-opencode to brew-stable 1.14.50 (system-level change via `npm install -g opencode-ai@1.14.50`).
2. Bypass cli-opencode and dispatch directly via HTTPS to DeepSeek API and the opencode-go gateway (skill-surface deviation).
3. Pivot the dispatch surface to cli-devin, which has built-in `--model deepseek-v4` and `--model kimi-k2.6` presets per its 4-model selection.
4. Pause the validation packet pending the cli-opencode binary fix.

### Decision

Use cli-devin as the dispatch surface for both target models. `--model deepseek-v4 --permission-mode auto` and `--model kimi-k2.6 --permission-mode auto` replace the originally-planned cli-opencode routes.

### Caveats

- cli-devin's `deepseek-v4` may map to a different tier than `deepseek-v4-pro` per the cli-opencode plan. The two are not byte-equivalent surfaces; Devin's CLI does not expose a `--variant` knob for reasoning effort tier selection. The measurement reports `deepseek-v4 via cli-devin` rather than `deepseek-v4-pro via cli-opencode` and is honest about the surface change in the final report.
- Reasoning effort is not exposed by Devin's CLI. Sampling defaults for each model apply.
- The 5 variants × 7 fixtures × 2 models = 70-dispatch matrix and the rest of the harness shape are unchanged; only the dispatcher swaps.

### Consequences

- The validation surface is consistent with cli-devin's existing v1.0.5.0/1.0.5.1 dispatch shape, which is already battle-tested for the eval-loop scoring pipeline.
- If the operator later restores cli-opencode 1.14.50, the harness can be re-pointed at cli-opencode trivially (dispatcher abstraction is per-model in `cross-model-confirm.cjs`).
- The decision is reversible: ADR-001's cli-opencode surface remains the documented preference if the binary returns to a working state before the validation run begins.

### Subsequent status

ADR-002 was the chosen plan until 2026-05-17 mid-session, when ADR-003 superseded it: the operator downgraded cli-opencode to 1.14.51 (pre-1.15.x regression), restoring the deepseek-v4-pro route. See ADR-003 below. The cli-devin run kicked off under ADR-002 was killed after the first dispatch timed out at 15 minutes (cli-devin's deepseek-v4 preset proved too slow for complex fixtures with non-RCAF variants).

<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Split-Surface Dispatch After cli-opencode Restored

**Status**: Accepted (supersedes ADR-002 for the deepseek-v4-pro route)
**Decision date**: 2026-05-17

### Context

Operator downgraded cli-opencode to 1.14.51 (latest pre-1.15.x version) via `npm install -g opencode-ai@1.14.51`. Smoke-test confirmed `opencode run --model deepseek/deepseek-v4-pro --variant high` returns clean text responses through the JSON event stream. The deepseek-v4-pro route through cli-opencode is now available exactly as ADR-001 originally planned.

However, the opencode-go billing account returned `401 Insufficient balance` on the kimi-k2.6 route through `opencode-go/kimi-k2.6`. Topping up was offered but the operator chose to dispatch kimi-k2.6 via cli-devin instead (which already worked in smoke-test at 1.0000 on fix-007 with sub-30-second dispatch time).

### Decision

Split-surface dispatch routed by model in `DISPATCH_ROUTE`:

| Model | Surface | Dispatch shape |
|-------|---------|----------------|
| `deepseek-v4-pro` | cli-opencode 1.14.51 + DeepSeek direct API | `opencode run --model deepseek/deepseek-v4-pro --variant high --format json --dir <eval-cwd> "<prompt>"` |
| `kimi-k2.6` | cli-devin | `devin --print --model kimi-k2.6 --permission-mode auto --prompt-file <prompt>` |

The harness's `dispatchByModel()` reads the route map and selects the dispatcher per-model. Each dispatcher returns the same `{ok, stdout, stderr, elapsed_ms}` shape so the downstream scoring pipeline is dispatcher-agnostic.

### Consequences

- The deepseek-v4-pro route now matches the operator's original ADR-001 intent byte-for-byte (cli-opencode + DeepSeek direct API).
- The kimi-k2.6 route is via cli-devin's built-in `--model kimi-k2.6` preset. This is NOT the originally-planned cli-opencode + opencode-go route, but it functionally measures the same model (Moonshot Kimi k2.6) — the dispatch surface differs (cli-devin's preset vs opencode-go's gateway), and the report makes this explicit.
- Per-dispatch timeout raised from 15 min (ADR-002) to 25 min (DEFAULT_TIMEOUT_MS = 1500000ms) because the first cli-devin/deepseek-v4 dispatch under ADR-002 timed out at 15 min on a complex fixture with the v-001-baseline-star variant. Frontier models are slower per dispatch than SWE-1.6 but the dispatches that have completed produce significantly higher scores (0.96-1.00 on fix-007 vs SWE-1.6 baseline 0.5664 aggregate).
- If the operator tops up opencode-go credits later, ADR-001's pure cli-opencode dispatch can be restored by editing `DISPATCH_ROUTE['kimi-k2.6']` to surface `cli-opencode` with model `opencode-go/kimi-k2.6`.

<!-- /ANCHOR:adr-003 -->
