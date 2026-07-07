---
title: "Tasks: Ablation sweep and promote semantic lane to live"
description: "Sweep, pick, promote, validate."
trigger_phrases:
  - "ablation sweep tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/002-skill-advisor-scoring-engine/004-ablation-sweep-and-weight-promotion"
    last_updated_at: "2026-05-13T19:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded tasks.md"
    next_safe_action: "Wait for 001; then dispatch cli-codex"
    blockers:
      - "Depends on 001"
    key_files:
      - "tasks.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Tasks: Ablation sweep and promote semantic lane to live

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## TASK NOTATION

| Marker | Meaning |
|--------|---------|
| `[ ]` | Open |
| `[x]` | Done |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [B] T001 Confirm 001 shipped, dist contains cosine lane.
- [B] T002 Select candidate weight vectors and write them into spec.md.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [B] T010 Run `eval_run_ablation` for each candidate vector.
- [B] T011 Tabulate metrics into implementation-summary.md.
- [B] T012 Choose winner.
- [B] T013 Edit `lane-registry.ts` with promoted weights.
- [B] T014 Write ADR-001 in decision-record.md.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [B] T020 Run `vitest run skill_advisor` — confirm clean.
- [B] T021 Run `npm run typecheck` — confirm clean.
- [B] T022 Rebuild dist.
- [B] T023 Strict validate this packet.
- [B] T024 Strict validate parent 015 packet.
- [B] T025 Probe live advisor via cli-opencode.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## COMPLETION CRITERIA

- [ ] All blocking tasks resolved.
- [ ] Chosen weights documented in ADR-001.
- [ ] Lane confirmed live in fresh process probe.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## CROSS-REFERENCES

- Parent phase: `002-semantic-routing-lane`
- Sibling phase: `001-embed-cache-and-cosine-wiring` (must ship first)
- Source files: `skill_advisor/lib/scorer/lane-registry.ts`, `weights-config.ts`, `eval_run_ablation` MCP tool
<!-- /ANCHOR:cross-refs -->
