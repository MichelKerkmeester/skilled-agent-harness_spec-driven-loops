---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status PLANNED. Scaffolded phase that will add a default-off floor override, a prod-mode completeRecall@3 sweep driver and a signal-or-noise report against the C2 baseline. No code change has landed."
trigger_phrases:
  - "retrieval floor experiment"
  - "raise the retrieval floor"
  - "default min results"
  - "truncation law measurement"
  - "tail signal or noise"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase impl doc for retrieval floor experiment scaffold"
    next_safe_action: "Hold for 015-c2 recall gate before this phase runs"
    blockers:
      - "Depends on 015-prodmode-recall-gate which must ship the prod-mode completeRecall@3 instrument first"
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-retrieval-floor-experiment |
| **Completed** | Not yet, status PLANNED |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status PLANNED. This phase is scaffolded and not yet implemented. No code change has landed and nothing below has shipped. The section describes the change the phase will make once it is built.

### Env-gated floor override

The phase will add a default-off `SPECKIT_FLOOR_OVERRIDE` env read for `DEFAULT_MIN_RESULTS` and the token budget inside `confidence-truncation.ts`. The override raises the never-cut-below-3 minimum for the experiment only. The on-disk prod default at `confidence-truncation.ts:35` stays `DEFAULT_MIN_RESULTS = 3` because the read is default-off and a no-flag run uses the shipped 3-result minimum.

### Prod-mode floor sweep driver

The phase will build a `run-floor-experiment.mjs` driver that sweeps the floor above 3 across a small set of settings and a matching token budget. For each setting the driver runs the C2 prod lens over the existing copy DB and reads only the prod-lens completeRecall@3 column. It refuses an eval-lens input and fails closed when the env override is set but the floor did not move, so a flat no-signal result cannot come from an unread override.

### Signal-or-noise report

The phase will write a `floor-experiment-report.md` that states the recall threshold up front, lists one prod-column delta row per floor setting against the stored C2 baseline and returns one verdict. On signal the report names the frozen Tier-C items to re-evaluate. On noise it records the 3-floor confirmation.

### Files Changed

This table lists the planned changes. None have been applied.

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts` | Planned modify | Default-off `SPECKIT_FLOOR_OVERRIDE` env read for `DEFAULT_MIN_RESULTS` and the token budget, on-disk default stays 3 |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-floor-experiment.mjs` | Planned create | Floor sweep driver reading only the prod-lens completeRecall@3 column against the C2 baseline |
| `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/005-shared-engine-and-research/027-retrieval-floor-experiment/floor-experiment-report.md` | Planned create | Per-setting prod-column recall deltas and the one signal-or-noise verdict |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/evals/run-eval-v2.mjs` | Planned reuse | Consumed unchanged through the C2 export for the prod lens and the measurability classes |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned sequence confirms the C2 prod lens and baseline are reachable first, then adds the default-off env read, then builds the sweep driver against the C2 copy DB, then writes the report from a threshold fixed before the numbers. The proof that a no-flag run keeps the 3-floor and the proof that an eval-lens input is refused land with the driver.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read only the prod column | The prod truncation stages hide the exact band under test, so an eval-lens or external @K read would repeat the 028 saturation mistake and surface a phantom tail signal |
| Move the minimum behind the default-off `SPECKIT_FLOOR_OVERRIDE` env flag | The experiment must measure the tail without changing the on-disk default, so the flag keeps the literal 3 at `confidence-truncation.ts:35` intact |
| Fail closed on an unmoved floor | An override the truncation seam never read would report a false no-signal, so the driver detects an unmoved floor and stops |
| Hold for C2 before running | No prod-mode completeRecall@3 instrument exists to read until 015-c2 ships it, so the verdict is C2-gated |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

No verification has run. The checks below are planned and currently unmet. The planned sweep command is `node run-floor-experiment.mjs` and the planned docs gate is `validate.sh --strict`.

| Check | Result |
|-------|--------|
| A no-flag run uses the 3-floor and the literal 3 at `confidence-truncation.ts:35` is unchanged by diff | PLANNED, not yet run |
| The driver reads only the prod completeRecall@3 column and refuses an eval-lens input | PLANNED, not yet run |
| The driver fails closed when the env override is set but the floor did not move | PLANNED, not yet run |
| The report states the threshold before the numbers and one prod-column delta per floor setting against the C2 baseline | PLANNED, not yet run |
| On signal the report names the Tier-C items to re-evaluate and on noise it records the 3-floor confirmation | PLANNED, not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a scaffold. No code change has landed and no check has passed.
2. **C2 dependency.** The sweep cannot run until 015-c2 ships the prod-mode completeRecall@3 instrument and the stored baseline it reads.
3. **Open sweep question.** Which floor settings to sweep beyond 3 and whether to vary the gap-cliff multiplier in the same pass is unresolved.
4. **Open threshold question.** The completeRecall@3 delta over the C2 baseline that counts as signal must be fixed before the run and is not yet set.
<!-- /ANCHOR:limitations -->

---
