---
title: "Implementation Summary: Fix the four-folder rename and record the shared/ decision"
description: "Phase 001 of the parent-nested-skill-pattern epic: swept ~392 live references from the four old bare packet paths to their deep- prefixed names, verified zero broken refs and full script resolution, and recorded the decision that shared/ stays in deep-loop-workflows."
trigger_phrases:
  - "deep-loop-workflows rename fix summary"
  - "deep- prefix sweep complete"
  - "shared stays decision recorded"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/155-parent-nested-skill-pattern/001-rename-fix-and-shared-decision"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Swept rename refs; verified clean; authored shared/ decision"
    next_safe_action: "Run the 15-iteration pattern research (parent phase 2)"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/mode-registry.json"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-001-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does shared/ move into deep-loop-runtime? (No — execution-vs-synthesis; runtime already depends on system-spec-kit, dependency rationale struck post-research)"
---
# Implementation Summary: Fix the four-folder rename and record the shared/ decision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 001 of the parent-nested-skill-pattern epic |
| **Status** | Complete |
| **Date** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Depends on** | `../152-deep-loop-workflows` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The operator renamed four `deep-loop-workflows` mode-packet folders to carry the `deep-` prefix that matches each packet's own `SKILL.md` `name:` (`context→deep-context`, `research→deep-research`, `review→deep-review`, `improvement→deep-improvement`; `ai-council` left as-is). The 152 build had wired references to the bare names, so this phase swept every live surface back to consistency:

- **`mode-registry.json`** — the four renamed `packet` keys repointed to the `deep-` prefixed folders; `ai-council` key unchanged.
- **`/deep:*` command YAML assets** — old packet-path references rewritten to the `deep-` prefixed paths.
- **`deep-loop-runtime/scripts/fanout-run.cjs`** — `buildLoopPrompt` SKILL.md paths for context/research/review repointed.
- **Hub files** — `deep-loop-workflows/graph-metadata.json` `key_files`, hub `SKILL.md` routing/layout lines, and `README.md`.
- **Per-packet internal docs** — a deterministic per-packet sweep across the four renamed packets (388 files, slash form) + a bare-form second pass for quote-terminated stragglers (3 files).
- **One cross-reference straggler** — `cli-opencode/references/destructive_scope_violations.md` (3 `review/` → `deep-review/` refs) that the original file-list sweep did not cover, caught by the final repo-wide grep.

Alongside the sweep, the architectural question the merge raised — whether the packet-shared `shared/` directory belongs in the frozen `deep-loop-runtime` backend — was answered **NO** and recorded in `decision-record.md`.

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sweep was executed directly by the orchestrator — a mechanical, deterministic find-and-rewrite over a fixed file set, which gains nothing from worker-fleet parallelism. Sweep correctness was the controlled risk: a BSD-grep `\b` portability bug initially produced a false "0 files matched," caught by sanity-checking the match count against the known baseline, then fixed with trailing-slash + bare-form patterns. The four bare packet names were the only rewrite targets; `ai-council` and the `deep-loop-workflows`/`deep-loop-runtime` roots were excluded by construction, and a `deep-deep-` grep confirmed zero double-prefix mangling.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **`shared/` stays in `deep-loop-workflows`** (ADR-001, amended post-research): the decision stands on the **execution-vs-synthesis** axis — `deep-loop-runtime/lib` is execution-only (zero renderers), `emitResourceMap` is workflow synthesis, and promoting it buys zero dedup. The originally-recorded "would create a `runtime→system-spec-kit` dependency" reason was **struck**: the runtime already depends on `system-spec-kit` by design (`artifact-root.cjs:18`), so "frozen" means MCP-free, not dependency-free.
- **`ai-council` folder ≠ `SKILL.md` name accepted** (ADR-002): under one advisor identity the packet folder name is not load-bearing for discovery; renaming would churn refs for no routing benefit, and the naming/discovery convention is exactly what the phase-2 research will define.

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- Broken-ref grep over live surfaces (excluding `specs/**` + `changelog/**`) returns **0** for both the slash and bare/quote forms — re-confirmed this session after fixing the `cli-opencode` straggler.
- Zero `deep-deep-` double-prefix hits.
- **73/73** packet `.cjs` scripts resolve their requires.
- `mode-registry.json` parses; packet keys equal on-disk folder names.
- `deep-loop-runtime` vitest **250/251** — the single non-pass is the documented pre-existing cross-process loop-lock flake, unrelated to this change.
- Advisor `skill_graph_scan` clean (no rejected edges from the rename).
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` — run at close-out this turn; expected green at Level 2.

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- The parity claim is reference-integrity + runtime-test parity, not a full per-mode artifact replay; appropriate here because the change is path-text only and touches no convergence/state/artifact code.
- The `ai-council` folder≠`name:` mismatch is a deliberately-accepted, documented exception pending the phase-2 research; it is not resolved here.
- The advisor still routes via hardcoded mode maps (`skill_advisor.py` + `aliases.ts`), not the registry — that drift gap is the central optimization target for phases 2–3, out of scope for this reference-fix phase.

<!-- /ANCHOR:limitations -->
