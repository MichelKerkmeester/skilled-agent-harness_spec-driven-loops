---
title: "Resource Map — Goal Unification Hardening (deepseek lineage)"
trigger_phrases:
  - "goal hardening resource map"
---
# Resource Map — Goal Unification Hardening (deepseek lineage)

Evidence-derived from five iterations' sources. Paths are repository-relative; the cited entry is where this lineage read the behavior, not the only line that matters.

## Goal hook core

| Resource | Governs |
|----------|---------|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | The single extractor: frontmatter split, durable slice, chat slice, objective slice, slice hash, packet resolution and containment, budget resolution, resend reminder text |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Scope and state paths, locks, atomic writes, record read, legacy quarantine, packet binding, resend/hash recording, locked log append, lifecycle actions |
| `.opencode/hooks/goal/bin/goal.cjs` | CLI router and operator envelope for every action, including the session-free `packet` read |
| `.opencode/hooks/goal/README.md` | Hook contract: binding, resend, lock and injection claims; runtime delivery matrix |
| `.opencode/hooks/goal/goal-plugin.md` | OpenCode plugin operator contract and action list |
| `.opencode/hooks/goal/pi/goal-context.ts` | Pi adapter: session identity via CLI flags, brief plus reminder injection |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Cursor `sessionStart` injection, brief plus reminder |
| `.opencode/hooks/goal/devin/goal-inject.mjs` | Devin `SessionStart` and `UserPromptSubmit` injection, brief plus reminder |
| `.opencode/plugins/opencode-goal.js` | OpenCode plugin: record normalization, brief cache, injection assembly, action surface, status envelope |

## Spec kit contracts

| Resource | Governs |
|----------|---------|
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Goal diagnostics: durable-slice budget tiers, binding-row existence rule, its own extractor copy |
| `.opencode/skills/system-spec-kit/runtime/lib/templates/level-contract-resolver.ts` | Manifest resolution for `goalDurableBudget` |
| `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` | The budget numbers both implementations read |
| `.opencode/skills/system-spec-kit/templates/addons/goal.md.tmpl` | Goal document shape: durable slice, operator copy, binding table notation |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Operator-facing set/resend procedure |
| `.opencode/skills/system-spec-kit/references/validation/validation-rules.md` | Documented meaning of the goal rules |
| `.opencode/skills/system-spec-kit/SKILL.md` | Router vocabulary (goal keywords) and the skill-level posture paragraph |

## Command surfaces

| Resource | Governs |
|----------|---------|
| `.opencode/commands/speckit/assets/speckit-plan.yaml` | Offer path, set mutation, `packet_goal` bind table |
| `.opencode/commands/speckit/assets/speckit-implement.yaml` | Same blocks in the implement lifecycle |
| `.opencode/commands/speckit/assets/speckit-complete.yaml` | Same blocks in the complete lifecycle |
| `.opencode/commands/speckit/assets/speckit-resume-auto.yaml` | Read-only goal handling and `never_halts` on resume |
| `.opencode/commands/speckit/assets/speckit-resume-confirm.yaml` | Read-only goal handling and `never_halts` on resume |
| `.opencode/commands/speckit/save.md` | Save-time log append instruction and its hand-append fallback |
| `.opencode/commands/goal-opencode.md` | OpenCode goal command contract and action routing |
| `.cursor/commands/goal-cursor.md` | Cursor command hint (packet read only) |
| `.pi/prompts/goal-pi.md` | Pi prompt surface |
| `AGENTS.md` | Always-on GOAL POSTURE RULE block and quick-reference row |

## Retrieval

| Resource | Governs |
|----------|---------|
| `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json` | Committed phrase map and path list (35,924 phrases) |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | `CORPUS_ROOTS` and exclusions the index is generated from |
| `.opencode/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` | Index generator entry point |

## Packet artifacts read

| Resource | Used for |
|----------|----------|
| `specs/system-speckit/033-system-speckit-v4/036-goal-unification/002-decisions-and-contract-freeze/decision-record.md` | ADR-001 to ADR-008: the frozen contract every recommendation stays inside |
| `specs/system-speckit/033-system-speckit-v4/036-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review/review-report.md` | F001–F015: prior findings used as inputs and overlap-checked |

## Coverage by angle

| Angle | Primary resources | Iteration |
|-------|-------------------|-----------|
| Hardening | `goal-slice.cjs`, `goal-core.cjs`, `spec-doc-structure.ts`, plugin and adapters | 1 |
| Integration | lifecycle assets, `save.md`, plugin action surface, trigger index and corpus roots, `SKILL.md` | 2 |
| Operator UX | `bin/goal.cjs`, both renderers, reminder text, adapters, `speckit-plan.yaml` | 3 |
| Overengineering | record and projection fields, plugin envelopes, manifest readers, docs and changelogs | 4 |
| Synthesis | all iteration files and the prior review report | 5 |

## Gaps

- No live session was exercised on any runtime: every finding is code- and document-read evidence. A two-writer lock test, a Latin-1 append fixture, and one skill-advisor run would convert the four inferred claims listed in `research.md` §9.
