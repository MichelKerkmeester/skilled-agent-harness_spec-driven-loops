# Iteration 6: Contradictions between the docs themselves (F6)

## Focus

Hold focus F6: find places where two or more docs contradict each other about the same contract, independent of (or in addition to) the runtime. This pass checked the cli-* sibling family enumeration, the `/doctor` route list consistency, and env-var descriptions against their own cross-referenced authority.

## Findings

### F6-01 — Memory Handback mis-enumerates the cli-* family (P2 cosmetic-to-misleading)

**Doc claim (quoted):** `references/cli/memory-handback.md:16` — "When a calling AI delegates a task to one of the cli-* skills (`cli-claude-code`, `cli-opencode`, `cli-opencode`)... The procedure is identical across all three sibling skills." `:3` and `:22` repeat "the three cli-* sibling skills."

**Actual behavior:** `cli-opencode` is listed twice and `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` are omitted. The cli-* family is **six** modes: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi` (authoritative roster: `cli-external-orchestration/SKILL.md:25-30,52`).

- Doc: [SOURCE: references/cli/memory-handback.md:3,16,22]
- Actual (authoritative roster): [SOURCE: cli-external-orchestration/SKILL.md:25-30]
- Severity: P2
- One-line fix: replace the parenthetical with the real family `(cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi)` and drop the duplicate; change "three" to the actual applicable count.

### F6-02 — `/doctor` route count and contents disagree across three docs (P2)

**Doc claim (quoted):** `feature-catalog/doctor-commands/category-overview.md:27` says "five subsystem routes ... (memory, causal-graph, deep-loop, code_graph, skill-advisor, skill-budget, code-graph)" — i.e. "five" but seven listed. `feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19` says "seven subsystem YAML workflows." `manual-testing-playbook/doctor-commands/README.md:22` says `/doctor memory` and `/doctor causal-graph` were removed.

**Actual behavior:** Even ignoring the code, the three docs disagree with each other on the count and membership of the `/doctor` route set (5 vs 7 vs one that deletes two). This is the doc-side of F4-01; the manifest has neither memory nor causal-graph nor code-graph targets.

- Doc: [SOURCE: feature-catalog/doctor-commands/category-overview.md:27]; [SOURCE: feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19]; [SOURCE: manual-testing-playbook/doctor-commands/README.md:22]
- Severity: P2
- One-line fix: pick one canonical list (the manifest) and make all three docs agree on count and membership.

### F6-03 — environment-variables.md describes MEMORY_BASE_PATH as active while its own authority says it is inert (P2)

**Doc claim (quoted):** `references/config/environment-variables.md:37` — "`MEMORY_BASE_PATH` | Current working directory | Workspace root used as `DEFAULT_BASE_PATH` for path validation." The doc itself points to `runtime/ENV-REFERENCE.md` as the authoritative reference (section 7, "SPECKIT Environment Variable Reference").

**Actual behavior:** `runtime/ENV-REFERENCE.md:138` — "Nothing in `runtime/` imports that constant outside of a same-package parity test against `shared/paths.ts`, so this variable currently has **no effect on running behavior**." The reference doc describes a variable as load-bearing ("workspace root used for path validation") that its own cited authority deems inert.

- Doc: [SOURCE: references/config/environment-variables.md:37]; (authority) [SOURCE: runtime/ENV-REFERENCE.md:138]
- Severity: P2
- One-line fix: annotate the `MEMORY_BASE_PATH` row as "exported constant with no live reader; kept for parity" to match its own cited authority.

## Sources Consulted

- references/cli/memory-handback.md:3,16,22
- cli-external-orchestration/SKILL.md:25-30,52
- feature-catalog/doctor-commands/category-overview.md:27
- feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:19
- manual-testing-playbook/doctor-commands/README.md:22
- references/config/environment-variables.md:35-37, section 7
- runtime/ENV-REFERENCE.md:117-138
- references/memory/embedder-pluggability.md:21,39-41,216 (noted as reconcilable — two distinct consumer paths; not flagged)

## Assessment

- newInfoRatio: 0.85
- Novelty justification: F6-01 and F6-03 are new doc-internal/doc-vs-authority contradictions; F6-02 is the doc-side of F4-01 (count/membership disagreement), so partly overlapping.
- Confidence notes: F6-01 confirmed against the authoritative cli-* roster; F6-03 confirmed by quoting ENV-REFERENCE:138; F6-02 is a straight reading of three doc lines. No runtime invocation needed.

## Reflection

- What worked: comparing a doc to the same text's own cross-referenced authority (ENV-REFERENCE, cli-external-orchestration roster, manifest) surfaces internal inconsistency without needing code.
- What failed: several apparent "contradictions" resolved to two distinct consumers (e.g. embedder-pluggability scope note vs "consumers index prose" are the Gate-1 lexical path and the skill-advisor embedding path respectively — not a bug), so were correctly not flagged.
- Ruled out: embedder-pluggability.md:21 vs :41 — reconcilable, not a defect.

## Recommended Next Focus

[F7] README/index files listing files or sections that do not exist — rescan the root README.md/ARCHITECTURE.md, feature-catalog.md index, manual-testing-playbook.md index and references for phantom file/section citations.
