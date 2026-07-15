---
title: "Decision Record: sk-prompt benchmark artifact names (017 phase 004.005)"
description: "Design decisions for phase 005: map authored benchmark paths explicitly, preserve generated raw output, and keep filesystem path changes separate from benchmark payload and data-key semantics."
trigger_phrases:
  - "sk-prompt benchmark decision record"
  - "sk-prompt benchmark generated output"
  - "sk-prompt phase 005 decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Recorded benchmark authored/generated boundary decisions"
    next_safe_action: "Apply the authored/generated ledger before filesystem changes"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-improve/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-models/benchmarks/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The authored directory map currently includes live_final, router_final, and router_mode_a."
      - "Raw run/archive output is generated and is not an authored naming surface."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: sk-prompt benchmark artifact names

<!-- ANCHOR:context -->
## Context

The sk-prompt benchmark surface mixes authored report directories with generated evaluation output. The live authored
directories `live_final/`, `router_final/`, and `router_mode_a/` use underscore-separated names, while prompt-models
raw runs include names such as `cidi__chunk.json` and retry/archive artifacts. The 017 program permits path renames but
exempts generated output and requires benchmark data and payload semantics to remain unchanged.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use an explicit authored benchmark path map

Map `benchmark/live_final/` to `benchmark/live-final/`, `benchmark/router_final/` to `benchmark/router-final/`, and
`prompt-improve/benchmark/router_mode_a/` to `prompt-improve/benchmark/router-mode-a/`. Any additional authored
fixture, profile, storage-guide, report, or path directory discovered during execution must receive its own ledger row;
there is no blanket underscore substitution.

### DR-002 — Preserve generated runs and archives by disposition

Treat `runs/`, `runs-archive/`, raw response names, retry artifacts, and generated payload files as generated or frozen
output unless the evidence proves authored ownership. Record their disposition and leave their names and contents intact.

### DR-003 — Separate filesystem paths from benchmark semantics

Path-valued references may change, but scenario IDs, fixture/profile data, report payload keys, model/data keys, and score
values must compare equal with BASE. `prompt-models/assets/model_profiles.json` remains phase 003 ownership because it is
outside the benchmark tree.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase needs both a rename map and an authored/generated ledger before any filesystem operation.
- A generated raw filename that contains underscores is not by itself a migration defect; its evidence-backed disposition is required.
- Benchmark verification must compare content contracts, not only path strings, so a successful rename cannot conceal data drift.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program naming rules and exemptions: `.opencode/specs/sk-doc/019-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md`.
- Benchmark phase specification and plan: `spec.md` and `plan.md`.
- Component phase map: `../spec.md`.
- Live benchmark roots: `.opencode/skills/sk-prompt/benchmark/`, `.opencode/skills/sk-prompt/prompt-improve/benchmark/`, and `.opencode/skills/sk-prompt/prompt-models/benchmarks/`.
<!-- /ANCHOR:references -->
