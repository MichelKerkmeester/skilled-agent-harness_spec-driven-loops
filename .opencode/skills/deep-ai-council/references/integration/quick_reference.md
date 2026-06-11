---
title: "AI Council Quick Reference"
description: "Operator cheat sheet for deep-ai-council planning runs, persistence, convergence checks, and validation commands."
trigger_phrases:
  - "deep ai council quick reference"
  - "ai council operator guide"
  - "council cheat sheet"
  - "council validation"
importance_tier: "normal"
contextType: "general"
---

# AI Council Quick Reference

Use this page when you need the council shape, the artifact contract, and the validation path without reading the full protocol set.

---

## 1. OVERVIEW

Use `deep-ai-council` when a plan has meaningful strategic disagreement. The council compares options, forces cross-seat critique, records convergence state, and hands a planning result back to the caller.

Do not use it for implementation, single-answer lookup, or code review. Use `deep-research` for iterative investigation and `deep-review` for iterative code audit.

---

## 2. CORE FLOW

| Step | Operator Intent | Primary Resource |
|------|-----------------|------------------|
| Resolve | Pick the packet and planning boundary | `references/structure/folder_layout.md` |
| Seat | Select 2-3 distinct planning lenses | `references/patterns/seat_diversity_patterns.md` |
| Deliberate | Gather proposals and critique them | `references/scoring/scoring_rubric.md` |
| Converge | Apply two-of-three plus blocker checks | `references/convergence/convergence_signals.md` |
| Persist | Write packet-local artifacts from caller context | `references/structure/output_schema.md` |
| Verify | Confirm final state and graph projection boundaries | `references/structure/state_format.md`, `references/integration/graph_support.md` |

---

## 3. COMMANDS

Persist a captured council report:

```bash
node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> \
  --memory-save-payload-out <payload>
```

Check completion:

```bash
node .opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

Replay the derived graph projection from artifacts:

```bash
node .opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs <packet> --dry-run
```

---

## 4. ARTIFACTS

| Artifact | Owner | Purpose |
|----------|-------|---------|
| `ai-council-config.json` | Caller or orchestrator | Current run settings and round limits |
| `ai-council-state.jsonl` | Persistence helper | Append-only event log |
| `council-report.md` | Council output, caller persisted | Final planning report |
| `seats/round-NNN/*.md` | Persistence helper | Per-seat proposals |
| `deliberations/*.md` | Persistence helper | Cross-seat synthesis and critique notes |
| `failed/round-NNN-*` | Persistence helper | Preserved failed or superseded rounds |

The packet-local `ai-council/**` tree is authoritative. Derived graph rows are rebuildable support, not source of truth.

---

## 5. STOP AND ESCALATE

Escalate instead of persisting when any of these hold:

- No packet/spec folder is resolved.
- Required report sections from `references/structure/output_schema.md` are missing.
- A run claims external AI participation that did not actually happen.
- Seats disagree on a material blocker after the allowed round count.
- A caller asks the council itself to modify implementation files or graph storage.

---

## 6. VALIDATION

```bash
python3 .opencode/skills/sk-doc/scripts/quick_validate.py .opencode/skills/deep-ai-council --json
```

For rewritten references or assets:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py <file> --type reference --blocking-only
python3 .opencode/skills/sk-doc/scripts/extract_structure.py <file>
```

---

## 7. RELATED RESOURCES

- `references/integration/loop_protocol.md` for the full council workflow.
- `references/structure/output_schema.md` for required report sections.
- `references/structure/state_format.md` for JSONL event semantics.
- `assets/deep_ai_council_strategy.md` for an operator-maintained round plan.
- `assets/deep_ai_council_dashboard.md` for status reporting.
