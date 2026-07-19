---
title: "Decision Record: cli-external-orchestration benchmark naming (020 phase 005.006)"
description: "Design decisions for the benchmark boundary: record the current .gitkeep-only baseline, map authored artifacts explicitly if they appear, and preserve generated output and benchmark data semantics."
trigger_phrases:
  - "cli-external benchmark decision record"
  - "benchmark authored generated boundary"
  - "cli-external phase 006 decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded benchmark boundary decisions"
    next_safe_action: "Apply the benchmark disposition ledger"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/benchmark/"
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current benchmark tree contains only .gitkeep."
      - "Fixtures, profiles, storage guides, and generated runs are execution-time classes, not current candidates."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: cli-external-orchestration benchmark naming

<!-- ANCHOR:context -->
## Context

The live cli-external-orchestration benchmark boundary is `.opencode/skills/cli-external-orchestration/benchmark/.gitkeep`; no fixture, profile, storage-guide, report, or run artifact is present. The phase still needs a stable rule for artifacts introduced before execution, because generated output and benchmark payload semantics have different ownership from authored filesystem names.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Record the empty benchmark baseline explicitly

The pinned census records `.gitkeep` as the only current entry and keeps a zero-row authored rename map when no execution-time artifact exists. The phase must not invent fixtures or profiles to create work.

### DR-002 — Map authored benchmark artifacts individually

If fixtures, profiles, storage guides, reports, indexes, or path directories appear before execution, each receives an explicit source-target row. A blanket underscore substitution is rejected because the path may be generated, frozen, or a data/key contract rather than an authored filename.

### DR-003 — Preserve generated output and benchmark semantics

Runs, raw responses, retries, generated/lockfile output, frozen records, scenario IDs, fixture/profile data, payload/data keys, and scores receive evidence-backed dispositions and remain semantically unchanged. Only required authored path values may change.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase can pass with a verified empty boundary, but execution must repeat the census immediately before mutation.
- A generated filename containing underscores is not a migration defect by itself; its recorded disposition is required.
- Benchmark verification compares content contracts, not only path strings, so a path-only change cannot hide data drift.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program naming rules and generated/frozen exemptions: `.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md`.
- Live benchmark boundary: `.opencode/skills/cli-external-orchestration/benchmark/`.
- Component phase map and release handoff: `../spec.md` and `../007-changelog-verify/`.
<!-- /ANCHOR:references -->

