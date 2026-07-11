---
title: "Feature Specification: deprecate the numbered prefix on feature_catalog and manual_testing_playbook snippet filenames"
description: "111 per-scenario snippet FILENAMES under feature_catalog/<category>/ and manual_testing_playbook/<category>/ across 9 skill packets carry a zero-padded 3-digit NNN- ordinal prefix. The prefix is load-bearing in exactly one place — the deep-improvement Lane C skill-benchmark loader ingests a sk-doc-shape scenario only when its basename is 3-digit-prefixed — so stripping it blind would silently drop all 111 scenarios from the benchmark corpus. This phase-parent makes the loader (and its test oracle) number-agnostic first, fixes the one live generator still emitting numbered names, then renames all 111 files and rewrites the 3 hub-routing index tables that reference them, then proves the corpus is unchanged and no scoring regression occurred. Descriptive slug becomes the sole canonical filename form. This is the file-level complement to sibling packet 025 (which de-numbered category FOLDERS) and a fresh cleanup of an anti-pattern re-introduced after archived packet 108 shipped."
trigger_phrases:
  - "deprecate numbered snippet filename"
  - "remove NNN- snippet prefix"
  - "de-number playbook snippet files"
  - "de-number feature catalog snippet files"
  - "snippet filename rename"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement 001-loader-and-guard"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Nothing computes on the filename number except one loader gate (load-playbook-scenarios.cjs:302); sk-code-shape root-index playbooks are already number-agnostic (5-agent GPT-5.6 investigation, this session)"
      - "The 111 have zero markdown-link references outside 3 hub-routing root-index tables, so the rename's reference surface is small and enumerable (verified this session)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + phase list + outcome; the full evidence lives in research.md, the decisions in decision-record.md, and the mechanics in each child's plan.md. -->

# Feature Specification: Deprecate the Numbered Snippet-Filename Prefix

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames |
| **Level** | phase parent (program Level 3) |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Owner skill** | sk-doc (owns the `create-feature-catalog` + `create-manual-testing-playbook` convention) and system-deep-loop/deep-improvement (owns the Lane C skill-benchmark loader that is load-bearing on the filename number) |
| **Origin** | Fresh cleanup: 111 numbered per-scenario snippet filenames were re-introduced across 9 skill packets by the Smart-Routing Benchmark Program, 5+ weeks after archived packet 108 de-numbered the whole snippet-file corpus repo-wide. This packet closes the same anti-pattern again, at the filename level, and closes it with a benchmark-loader fix so it cannot silently drop corpus scenarios this time. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

111 per-scenario snippet files under `feature_catalog/<category>/` and `manual_testing_playbook/<category>/`,
across 9 skill packets (`cli-external`, `cli-external/cli-claude-code`, `cli-external/cli-opencode`,
`mcp-tooling`, `mcp-tooling/mcp-chrome-devtools`, `mcp-tooling/mcp-click-up`, `mcp-tooling/mcp-figma`,
`sk-code` and its `code-review`/`code-opencode`/`code-webflow`/`code-quality` modes, `sk-prompt`, and
`system-deep-loop`'s `deep-improvement`/`deep-research`/`deep-review` modes), carry a zero-padded 3-digit
`NNN-` ordinal prefix (e.g. `006-mcp-tool-surface.md`). This is the same anti-pattern packet 108 removed
repo-wide (1,562 files, merged 2026-06-06) — these 111 files postdate that migration by 5+ weeks and were
created fresh by the Smart-Routing Benchmark Program, not left behind by 108.

Unlike sibling packet 025 (category *folders*), the prefix here is genuinely load-bearing in one place:
`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs:302`
gates `loadYamlFrontmatterScenarios()` on `if (!e.isFile() || !/^\d{3}-.*\.md$/.test(e.name)) continue;` — a
scenario file is ingested into the Lane C skill-benchmark corpus **only if its basename is 3-digit-prefixed**.
Stripping the prefix with no loader change would silently drop all 111 scenarios from the corpus; this was
empirically reproduced this session. The same gate already zeroes 10+ live playbooks whose files are
single-digit or generator-output — a pre-existing, unrelated bug this packet also closes. sk-code-shape
(root-index-table) playbooks read their `featureFile` from the table and are already number-agnostic, so they
are unaffected by this gate.

**Purpose:** make the descriptive slug the sole canonical filename form for all 111 files — without dropping a
single scenario from the Lane C corpus — by neutralizing the loader's number dependency *before* any file is
renamed, fixing the one live generator that still emits numbered names, and preserving the one piece of
information the number currently encodes (routing/holdout/negative grouping) as explicit frontmatter instead
of an implicit filename token.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope (measured this session — see `research.md` for the full inventory):**
- **111 snippet files** carrying a `^\d{3}-` prefix, across 9 packets:
  - `cli-external/cli-claude-code/manual_testing_playbook/intra-routing-recall` (10; holdout 008-009, negative 010)
  - `cli-external/cli-opencode/manual_testing_playbook/intra-routing-recall` (10; holdout 008-009, negative 010)
  - `cli-external/manual_testing_playbook/hub-routing` (5; holdout 004-005)
  - `mcp-tooling/manual_testing_playbook/hub-routing` (6; holdout 005-006)
  - `mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/intra-routing-recall` (8; holdout 006-007, negative 008)
  - `mcp-tooling/mcp-click-up/manual_testing_playbook/intra-routing-recall` (7; holdout 005-006, negative 007)
  - `mcp-tooling/mcp-figma/manual_testing_playbook/intra-routing-recall` (9; holdout 007-008, negative 009)
  - `sk-code/code-review/manual_testing_playbook/intra-routing-recall` (7)
  - `sk-code/code-opencode/manual_testing_playbook/{authoring-verification(006-008), config-hooks(004-005), language-standards(001-003,009)}` (9)
  - `sk-code/code-webflow/manual_testing_playbook/{implementation-quality(001-005), performance-animation(006-009), deployment-forms-video(010-012), language-standards(013)}` (13)
  - `sk-code/code-quality/manual_testing_playbook/quality-gate` (1)
  - `sk-prompt/manual_testing_playbook/hub-routing` (4)
  - `system-deep-loop/deep-improvement/manual_testing_playbook/intra-routing-recall` (10)
  - `system-deep-loop/deep-research/manual_testing_playbook/intra-routing-recall` (8)
  - `system-deep-loop/deep-review/manual_testing_playbook/intra-routing-recall` (4)
- The **load-bearing loader dependency**: `load-playbook-scenarios.cjs:302` and its test oracle
  `code-opencode-playbook-ids.vitest.ts:28` (both re-implement the `^\d{3}-` regex and must change in lockstep).
- The **one live numbered-filename generator**: `playbook-generator.cjs` (still emits `AG-NNN.md`).
- The **3 hub-routing root-index tables** that cite these filenames (`cli-external`, `mcp-tooling`, `sk-prompt`
  hub-routing indexes).
- **Adjacent corpus bugs folded in** (operator decision B — see `decision-record.md` ADR-007): 2 failing vitest
  suites that hardcode stale numbered names from a prior scheme, and 7 dead allowlist entries in
  `workflow-invariance.vitest.ts`.

**Out of scope (deliberate):**
- The **20 system-spec-kit single-digit files** (`feature_catalog|manual_testing_playbook/{feature-flag-reference/1-7,
  pipeline-architecture/4 & 7, retrieval/4-stage-pipeline-architecture}`). The leading digit is legitimate there:
  `feature-flag-reference/1-7` mirrors the root `EX-028..EX-034` reading order; `4-stage-pipeline` and
  `7-layer-tool-architecture` are topic names, not ordinals. Packet 108 already applied its intended rule to
  these files; a naive `^[0-9]+-` grep false-positives on them and they must not be re-touched.
- Changelogs, `z_archive/`, and completed spec-folder history/narrative — these record what files were named at
  the time and stay frozen.
- Category *folders* — that is sibling packet 025's scope, not this packet's.
- Reopening archived packet 108 — 026 is a fresh packet against a re-introduced instance of the pattern, not a
  resumption of 108's completed work.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phases -->
## 4. PHASES

Ordered so the Lane C corpus is never smaller than its current size at any commit (tolerant loader first, then
rename).

| Phase | Child | Outcome |
|-------|-------|---------|
| **001** | `001-loader-and-guard` | Make `load-playbook-scenarios.cjs:302` number-agnostic: select any `*.md` carrying scenario frontmatter (excluding the root `manual_testing_playbook.md`/`feature_catalog.md` index), teach the loader to read an optional `stage:` field, update the `code-opencode-playbook-ids.vitest.ts:28` oracle in lockstep, and add a no-new-numbered-snippet guard that fails on a newly created `feature_catalog|manual_testing_playbook/<category>/NNN-*.md`. Also closes the latent bug that currently zeroes 10+ live playbooks. Lands first; tolerates both numbered and un-numbered filenames during the transition. |
| **002** | `002-generator-alignment` | Fix `playbook-generator.cjs` to emit slug filenames (plus the optional `stage:` field) instead of `AG-NNN.md`; re-verify the sk-doc convention docs and `/create:*` generators already forbid numbered filenames (no change expected). |
| **003** | `003-migration-tooling` | A deterministic, dry-run-default rename engine (`denumber-snippet-filenames.mjs`, adapted from 108's `denumber-snippets.cjs`): enumerate the 111 in-scope files, compute the strip-`^\d{3}-` rename map, hard-abort on any collision before writing, derive and inject the `stage:` frontmatter from the holdout/negative token, sweep the 3 hub-routing root-index rows word-boundary-safe, and emit a diff plus collision/safety report. No mutation without `--apply`. |
| **004** | `004-execute-migration` | Run the migration fanned out by skill family: rename all 111 files, inject `stage:` fields, rewrite the 3 hub-routing root-index tables in lockstep, validate each family as it lands. Folds in the 2 failing-vitest-suite fixes and the 7 dead allowlist entries (operator decision B). |
| **005** | `005-validate-and-rebenchmark` | Recursive `validate.sh --strict` on touched skills; whole-workspace markdown-link guard; re-run the Lane C skill-benchmark on the affected skills and prove the discovered scenario count is unchanged with no D1-D5 scoring regression versus a pre-migration baseline captured at phase start; prove the no-new-numbered-snippet guard fires; confirm the 2 previously-failing vitest suites now pass. |

**Sequencing invariant:** 001 (tolerant loader) and 002 (generator) are foundation and must land before 004
renames anything — otherwise the 111 scenarios vanish from the corpus mid-flight. 003 is authored against the
tolerant loader. 005 is the gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Zero `feature_catalog|manual_testing_playbook/<category>/NNN-*.md` files remain across the 9 in-scope
   packets; the 20 out-of-scope system-spec-kit single-digit files are untouched.
2. `load-playbook-scenarios.cjs` (and its `code-opencode-playbook-ids.vitest.ts` oracle) select scenario files
   by content/frontmatter, not by filename number, and the previously-zeroed 10+ playbooks now load.
3. The Lane C skill-benchmark discovered-scenario count is unchanged post-migration versus the pre-migration
   baseline, with no D1-D5 scoring regression on the affected skills.
4. The no-new-numbered-snippet guard rejects a freshly-created `NNN-*.md` scenario file and accepts a slug
   filename.
5. `playbook-generator.cjs` emits only de-numbered slug filenames; the 2 previously-failing vitest suites and
   the 7 dead allowlist entries are fixed/removed.
6. The 3 hub-routing root-index tables reference the renamed (slug) filenames; the whole-workspace
   markdown-link guard is clean.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Silent corpus loss** (the central risk) — mitigated by landing the number-agnostic loader (001) and the
  generator fix (002) *before* any rename (004); 005 asserts the discovered-scenario count is unchanged.
- **Loss of routing/holdout/negative grouping** — 63 of the 111 files currently encode this grouping in their
  number+token; mitigated by injecting an explicit `stage:` frontmatter field during migration (see
  `decision-record.md` ADR-004) so no consumer needs to infer it from a filename that no longer exists.
- **Broken hub-routing index rows** — only 3 root-index docs cite these filenames in a table; the migration
  rewrites them in the same pass, and 005 runs the whole-workspace markdown-link guard.
- **Re-touching the 20 legitimate system-spec-kit single-digit files** — mitigated by an explicit deny-list in
  the migration script scoped to the 9 named packets, not a naive `^[0-9]+-` glob.
- **Repeating 108's self-exclusion bug** — 108's own deny-list referenced a non-existent
  `999-sk-doc-parent` path; 026's deny-list must use the correct `014-sk-doc-parent` packet path (see
  `decision-record.md` ADR-008).
- **Dependency:** the Lane C skill-benchmark harness (unchanged) for the 005 regression check; the
  `code-opencode-playbook-ids.vitest.ts` oracle must change in lockstep with the loader (001).
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The scope boundary between the 111 in-scope files and the 20 out-of-scope system-spec-kit
single-digit files, and the changelog/history exclusion, are enumerated in `decision-record.md` and encoded as
the migration script's deny-list in Phase 003.
<!-- /ANCHOR:questions -->
