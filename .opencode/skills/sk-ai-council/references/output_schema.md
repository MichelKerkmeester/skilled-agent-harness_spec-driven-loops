---
title: "Deep AI Council Output Schema"
description: "Markdown contract for @sk-ai-council §8 OUTPUT FORMAT and the persist-artifacts.cjs parser."
trigger_phrases:
  - "sk-ai-council output schema"
  - "council output format"
  - "persist-artifacts parser contract"
importance_tier: "normal"
contextType: "reference"
---

# Deep AI Council Output Schema

Markdown contract for Deep AI Council report sections and the persistence helper parser.

---

## 1. OVERVIEW

This document is the single source of truth for the `@sk-ai-council` §8 OUTPUT FORMAT. The agent body uses §8 to tell the planning LEAF what report to return; `.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs` uses this contract to parse that report and persist packet-local `ai-council/` artifacts.

The report remains markdown, not JSON. The helper accepts normal heading variation, extracts the strict-required sections, and degrades gracefully for optional narrative sections.

Cross-references:

- Agent body: `.opencode/agents/sk-ai-council.md` §8 OUTPUT FORMAT and §16 Caller Persistence Protocol
- Runtime mirrors: `.claude/agents/sk-ai-council.md`, `.codex/agents/sk-ai-council.toml`
- Helper: `.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs`

---

## 2. REQUIREDNESS MATRIX

| Section name | Strict-required | Helper behavior on missing |
| --- | --- | --- |
| Council Composition | Y | `parseCouncilReport()` returns `ok:false`; CLI exits 1 before writes |
| Per-seat sections or composition-table seat rows | Y | `ok:false` when no `Seat N` headings and no composition rows exist |
| Recommended Plan | Y | `ok:false`; CLI exits 1 before writes |
| Plan Confidence | Y | `ok:false`; CLI exits 1 before writes |
| Task Classification | N | Preserved in `council-report.md`; not required for persistence |
| Strategy Comparison | N | Preserved in `council-report.md`; not required for persistence |
| Deliberation Notes | N | Rendered into deliberation artifact when present |
| Winning Strategy | N | Preserved in `council-report.md`; not required for persistence |
| Implementation Steps | N | Preserved in `council-report.md`; not required for persistence |
| Prerequisites | N | Preserved in `council-report.md`; not required for persistence |
| Cross-References | N | Rendered when present; placeholder or omitted per optional policy |
| Dropped Alternatives | N | Rendered when present; placeholder or omitted per optional policy |
| Risks & Mitigations | N | Rendered when present; placeholder or omitted per optional policy |
| Planning-Only Boundary | N | Preserved in `council-report.md`; callers still enforce planning-only permissions |

Strict-required means the helper must fail before writing any files. Optional means the helper can still produce a valid artifact tree.

---

## 3. HEADING ALIASES

The helper accepts ATX heading depth `##` through `######`. Numeric prefixes are ignored. These forms are equivalent:

| Canonical section | Accepted heading examples |
| --- | --- |
| Council Composition | `## Council Composition`, `### Council Composition`, `## 1. Council Composition`, `## §1 Council Composition` |
| Recommended Plan | `## Recommended Plan`, `### Recommended Plan`, `## 7. Recommended Plan` |
| Plan Confidence | `## Plan Confidence`, `### Plan Confidence`, `## 10. Plan Confidence` |
| Cross-References | `## Cross-References`, `## Cross References` |
| Dropped Alternatives | `## Dropped Alternatives` |
| Deliberation Notes | `## Deliberation Notes`, `## Deliberation Notes details` |
| Risks & Mitigations | `## Risks & Mitigations`, `## Risks and Mitigations`, `## Risks & Mitigations details` |

The helper normalizes case, heading marks, leading section numbers, repeated whitespace, and trailing punctuation.

---

## 4. SEAT SECTION FALLBACK CONTRACT

Preferred seat extraction uses one markdown heading per seat:

```markdown
### Seat 001 - Analytical / cli-codex
...

### Seat 002 - Critical / cli-claude-code
...
```

Accepted variations:

- `### Seat 001 — Analytical / cli-codex`
- `### Seat 1: Analytical / cli-codex`
- `#### Seat-001 Analytical / cli-codex`

When no per-seat headings exist, the helper falls back to rows in the Council Composition table. The table must include a `Seat` column and should include `Strategy Lens`, `AI Vantage Target`, `Distinct Mandate`, and `Confidence` columns.

Fallback row example:

```markdown
| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Analytical | cli-codex | Check implementation sequence | 84 |
```

Fallback seats produce `seats/round-NNN/*.md` artifacts with a clear note that the per-seat body was derived from the composition table. This preserves artifact shape without pretending the report contained detailed seat prose.

---

## 5. OPTIONAL SECTION POLICY

Optional sections are advisory content, not parser blockers.

Default behavior:

- Missing optional sections write empty placeholder text where the artifact layout expects a subsection.
- `council-report.md` always preserves the original source report.
- `ai-council-state.jsonl` records `new_findings_count` from extra unknown headings, not optional-section presence.

With `--strict-output`:

- Missing optional sections are omitted from generated subfiles instead of filled with placeholders.
- Strict-required missing sections still fail before writes.

This policy keeps the helper tolerant of older reports while giving stricter callers a cleaner generated artifact set.

---

## 6. SCHEMA-CHANGE LOCKSTEP RULE

Changes to this schema require lockstep updates in the same commit:

1. Update this `output_schema.md` contract.
2. Update `@sk-ai-council` agent body §8 in all four runtime mirrors.
3. Update `.opencode/skills/sk-ai-council/scripts/persist-artifacts.cjs`.
4. Update fixtures and `multi-ai-council-persist-artifacts.vitest.ts` when parser behavior changes.
5. Run the mirror parity test and helper fixture test.

Do not change one surface alone. Split-brain between §8 prose, parser behavior, and fixtures makes persisted council artifacts unreliable.
