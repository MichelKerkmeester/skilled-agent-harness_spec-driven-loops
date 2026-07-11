---
title: "Research: numbered snippet-filename prefix consumer & blast-radius investigation"
description: "Findings from a 5-agent GPT-5.6-sol-fast parallel investigation (inventory, loader-dependency, consumers/references, collisions/ordering/convention, packet design), plus 7 Sonnet-5 code-reader agents and 3 adversarial verifiers, that scoped the NNN- snippet-filename deprecation: 111 in-scope files across 9 packets, one load-bearing benchmark-loader dependency, and a small enumerable reference surface."
importance_tier: "important"
contextType: "research"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Synthesized 5-agent GPT-5.6 investigation plus adversarial verification"
    next_safe_action: "Proceed to implementation of 001-loader-and-guard"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Research: Numbered Snippet-Filename Prefix Consumers & Blast Radius

## Method

This session ran 5 `openai/gpt-5.6-sol-fast --variant medium` agents in parallel via cli-opencode, each on a
disjoint question (inventory, loader-dependency, consumers/references, collisions/ordering/convention, and
026-packet design), plus 7 Sonnet-5 code-reader agents and 3 adversarial verifiers cross-checking the central
loader claim. Every count was re-verified against the live tree. Findings below are stated as **confirmed** or
**inferred**.

## A — Inventory (confirmed)

- **131 files** match `^\d{1,3}-`; **111** are the in-scope 3-digit anti-pattern across the 9 named packets;
  **20** are the out-of-scope system-spec-kit single-digit legitimate files (reading-order or topic-name
  tokens, not ordinals).
- **14 holdout** files and **5 negative** files encode their tier in a filename token; a further **69** sit in
  the routing-recall / hub-routing categories as routing-stage scenarios. (An early estimate put the
  tier-bearing set at 63; the live tree has **88** files across those two categories — see `decision-record.md`
  ADR-004, which the operator amended to stamp all 88 explicitly: 14 holdout / 5 negative / 69 routing. The
  remaining 23 in-scope files are feature-oriented and carry no tier.)
- Zero same-folder collisions across all 111 once the prefix is stripped — no file where the number is the
  sole distinguishing token.

## B — Load-bearing consumer (confirmed) — the central finding

`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:302`,
inside `loadYamlFrontmatterScenarios()` (the sk-doc/frontmatter loader shape):

```
if (!e.isFile() || !/^\d{3}-.*\.md$/.test(e.name)) continue;
```

This gate ingests a scenario file into the Lane C skill-benchmark corpus **only if its basename is
3-digit-prefixed**. Stripping the prefix with no loader change would silently drop all 111 sk-doc-shape
scenarios from the corpus — empirically reproduced this session by simulating the walk against renamed
copies. The gate already zeroes 10+ live playbooks today whose files are single-digit or generator-output and
therefore never match the 3-digit pattern — a latent, pre-existing bug independent of this migration.
sk-code-shape (root-index-table) playbooks read their `featureFile` value from the table via `parseRootIndex`
and are **not** number-gated, so they are unaffected either way. Two adversarial verifiers independently
confirmed this gate is the sole hard dependency on the filename number.

Two consumers must change in lockstep with the loader:
- `code-opencode-playbook-ids.vitest.ts:28` — re-implements the identical `^\d{3}-` regex as a test oracle;
  left unchanged it would fail (or falsely pass) against renamed files.
- `playbook-generator.cjs` (around lines 169 and 184) — the one live generator still emitting numbered
  filenames (`AG-NNN.md`); every other generator and convention doc already forbids the pattern (see F).

## C — Reference surface (confirmed)

- The 111 files have **zero markdown-link references** anywhere in the repo — only the 20 out-of-scope
  system-spec-kit files are linked from elsewhere. Renaming the 111 therefore breaks no markdown links.
- **3 hub-routing root docs** (`cli-external`, `mcp-tooling`, `sk-prompt` hub-routing indexes) cite these
  scenario files by name in an index table and must be rewritten in the same pass as the rename.
- `validate_document.py` classifies catalog/playbook leaves by **structural position** (which parent folder a
  file sits in), never by filename — it is already filename-agnostic here and needs no change.
- `system-skill-advisor` never reads these files: its doc-trigger harvest walks only `references/` and
  `assets/`, and its own evaluation corpus is a separate JSONL file. Advisor regression risk from this
  migration is **none** — the loader dependency in B is exclusively a deep-improvement Lane C concern.

## D — Safety (confirmed)

- Zero collisions across all 111 renamed targets (matches A).
- The loader's directory walk is **unsorted**; scenario identity is carried entirely by the frontmatter `id:`
  field. Removing the filename number therefore affects neither benchmark identity nor benchmark order once
  the loader is number-agnostic (Phase 001).
- `code-opencode-playbook-ids.vitest.ts:28` re-implements the loader's regex as an independent oracle and must
  be updated in the same commit as the loader, or the two will silently diverge.
- `playbook-generator.cjs` is the only live code path still emitting the `NNN-` pattern (as `AG-NNN.md`).

## E — History (confirmed)

- Archived packet 108 completed and merged 2026-06-06, de-numbering 1,562 snippet files repo-wide. The 111
  files in scope here **postdate** that migration by 5+ weeks — they are a fresh re-introduction of the
  pattern by the Smart-Routing Benchmark Program, not an omission left behind by 108.
- 108's engine (`denumber-snippets.cjs`) was structurally a one-level, pattern-gated, opt-in-per-tree scan; it
  ran and completed before these 111 files existed, so it could not have seen them. Adapting rather than
  re-authoring that engine (see `decision-record.md` ADR-008) is appropriate — but 026's version must correct
  108's own self-exclusion bug, where its deny-list referenced a non-existent `999-sk-doc-parent` path instead
  of the real packet path.

## F — Convention source (confirmed)

- The sk-doc convention docs (`create-feature-catalog`, `create-manual-testing-playbook` SKILL.md files, their
  templates, and the four `/create:*` generator YAMLs) **already forbid** numbered per-feature filenames —
  packet 025's Phase 001 established this for category folders and the same prohibition already covers
  filenames. No convention-doc change is expected in Phase 002; it is a verify-only step.
- The one live emitter still producing numbered filenames is `playbook-generator.cjs` (see B).
- Two pre-existing failing vitest suites (`system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts`,
  `system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts`) hardcode stale numbered filenames
  from a prior scheme and fail with ENOENT; 7 dead allowlist entries in
  `system-spec-kit/scripts/tests/workflow-invariance.vitest.ts:97-104` reference the same stale scheme. Both
  are folded into Phase 004 per operator decision B (`decision-record.md` ADR-007).

## Net conclusion

The prefix is safe to remove because nothing computes on the filename number except one loader gate. Phase 001
neutralizes that gate (and its test oracle) before Phase 004 renames a single file; the routing/holdout/negative
grouping the number currently encodes is preserved explicitly as `stage:` frontmatter (operator decision A);
the 20 legitimate system-spec-kit single-digit files stay untouched; and Phase 005 re-runs the Lane C
skill-benchmark to prove the discovered-scenario count is unchanged and no scoring regression occurred.
