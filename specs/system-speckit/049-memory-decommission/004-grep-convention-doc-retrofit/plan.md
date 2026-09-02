---
title: "Implementation Plan: Phase 4: grep-convention-doc-retrofit"
description: "Plan for defining the grep-optimized spec-doc convention, enforcing it in templates and validate.sh, and retrofitting it across the active corpus with an enumerate, dry-run, process and rescan pipeline."
trigger_phrases:
  - "grep convention"
  - "spec doc retrofit"
  - "frontmatter normalization"
  - "greppable spec docs"
  - "implementation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: grep-convention-doc-retrofit

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`), no TypeScript build step |
| **Framework** | None. Node standard library plus `rg` on PATH |
| **Storage** | The corpus itself, plus a JSON variant inventory, a JSON preimage manifest and a JSON diagnostics report |
| **Testing** | `node:test` over the eight variant fixtures, plus replayable negative controls on a frozen sample |

### Overview

The retrofit is a four-stage pipeline: enumerate, dry-run, process, rescan. Enumerate classifies every
in-scope document into exactly one frontmatter variant and records a body preimage hash. Dry-run
computes each edit and emits a diff without writing. Process applies the edits atomically per file.
Rescan re-walks the same frozen manifest and asserts zero residue. No stage may begin before the
previous stage's artifact is on disk, which is what makes a 22,127-file change reviewable.

Retrieval itself is not built here. This phase shapes the corpus so the phase 001 recipes are precise,
and it proves that precision with recorded `rg` invocations rather than with an assertion.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [ ] Phase 002's `_memory.continuity` writer decision received

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Variant inventory accounts for every in-scope document, with no unclassified residue
- [ ] Preimage manifest verifies after the run, with zero non-frontmatter and non-marker diff lines
- [ ] Second pipeline run produces no diff
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Batch pipeline. Four ordered stages over one frozen file manifest, each stage consuming the previous
stage's committed artifact rather than re-deriving the corpus.

### Key Components

- **Enumerator**: walks the in-scope glob set, classifies each document into one of the eight
  variants in `spec.md` section 13.2, and writes `variant-inventory.json` plus the body preimage hash
  manifest. It never writes to a spec document.
- **Dry-run planner**: computes the exact edit per document and emits a unified diff to stdout without
  touching disk. One track is reviewed this way before any corpus write.
- **Processor**: applies frontmatter normalization and anchor marker repair, one file at a time, by
  writing a same-directory temporary file and renaming it only after the post-edit preimage check
  passes. A failed check leaves the original file untouched.
- **Rescanner**: re-walks the frozen manifest and asserts zero unprocessed variants and zero
  preimage mismatches.
- **Validator rule** (`check-grep-convention.sh`): the standing gate that keeps new documents
  conforming after the retrofit, emitting the same diagnostics schema.
- **`rg` wrapper**: builds the recipes, parses output, applies the caller-side rank and maps exit
  status. Ripgrep produces evidence here. It does not rank and it does not hold state.

### Data Flow

```text
frozen manifest
  -> enumerate      -> variant-inventory.json + preimage-manifest.json
  -> dry-run        -> plan.diff (no writes)
  -> process        -> per-file atomic rename + diagnostics.json
  -> rescan         -> residue report (must be empty)
```

### Scoped glob and ignore behavior

Every invocation, in the pipeline and in the recipes alike, passes `--no-config`. Ambient
configuration is the failure mode that makes a green run unreproducible on another machine.

- Positive glob: `--glob '*.md'`.
- Negative globs, always last because later globs override earlier ones: `--glob '!**/z_archive/**'`
  and `--glob '!**/node_modules/**'`.
- `.gitignore`, `.ignore` and `.rgignore` are not relied on for scope. The in-scope set comes from the
  frozen manifest, not from whatever the working tree happens to ignore today.
- `RIPGREP_CONFIG_PATH` is neutralized by `--no-config`, so an operator's personal flags cannot
  silently change what the retrofit sees.

### Validator diagnostics schema

One row per skipped or warned path. This is the same shape the retrofit report and the validator rule
emit, so the two are comparable without translation.

| Field | Type | Meaning |
|-------|------|---------|
| `path` | string | Repository-relative path |
| `line` | integer | One-based line number, or `0` when the finding is whole-file |
| `category` | enum | One of the eight variant labels, plus `anchor-unmatched`, `anchor-duplicate`, `alias-hit`, `generic-trigger`, `naming-exception`, `preimage-mismatch` |
| `reason` | string | One line, human-readable, no stack trace |
| `rawKey` | string or null | The observed key or value, echoed only when it is safe and bounded |
| `severity` | enum | `error` or `warn`. An `error` fails the run |

### Wrapper ranking and exit mapping

Ranking is a stable tuple applied by the caller, in this order:

1. Evidence field: `trigger_phrases`, then title or description, then anchor marker, then body line.
2. Normalized match class: exact phrase, then phrase containment, then token coverage.
3. Relative path, then one-based line.

Exit mapping, read on every invocation:

| Exit | Meaning | Wrapper behavior |
|------|---------|------------------|
| 0 | At least one match | Parse and rank |
| 1 | No match | A valid empty result, never an error |
| 2 or higher | Execution or configuration error | Abort and surface the stderr text |

`--json` cannot be combined with `--files`, `--files-with-matches`, `--count` or `--count-matches`.
Each output mode is a separate recipe rather than a flag bolted onto another.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/core/frontmatter-editor.ts` | Inserts folder tokens and falls back to `session` / `context` triggers | Not a consumer, but its output is reported as `generic-trigger` rather than adopted | Generic-negative control returns no fallback-produced field hit |
| `scripts/lib/frontmatter-migration.ts` | Parses and refuses unsafe rewrites, recognizes the `triggerPhrases` alias | Unchanged. Reused as the variant classifier's reference behavior | Eight variant fixtures classify identically through both paths |
| `mcp-server/lib/search/anchor-metadata.ts` | Parses anchor pairs and line addresses | Unchanged. Its pairing rules define the anchor grammar | Anchor control returns the marker line number |
| `scripts/rules/check-grep-convention.sh` | Does not exist yet | Create. Emits the diagnostics schema above | Rule fires on each of the eight fixtures |
| `.opencode/skills/system-spec-kit/templates/**` | Produces new documents | Update so new documents conform by construction | A freshly scaffolded packet passes the new rule with no manual step |
| `specs/**/*.md` | The corpus | Update frontmatter and marker lines only | Preimage manifest verifies, diff contains no other changed line |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Variant classifier over the eight fixtures, anchor pair parser, body preimage hasher, trigger allowlist filter | `node:test` |
| Integration | The four-stage pipeline end to end over a frozen sample track, including the atomic-rename failure path | `node:test` plus `rg` |
| Manual | Dry-run diff review on one track before the corpus run, and one execution of each recipe in `spec.md` section 14 | `git diff`, shell |

### Replayable negative controls

Each control is a recorded command, its expected exit status and its expected shape. They are replayed
after the retrofit and must produce the same answers, which is what turns "the corpus is greppable"
into an observable claim.

| Control | What it runs | Expected |
|---------|--------------|----------|
| Frontmatter-only match | Path recipe against a phrase that exists only in a `trigger_phrases` list | Exit 0, exactly the documents declaring it |
| Anchor match | Structured recipe against a known anchor id | Exit 0, the marker line number, classified as anchor evidence |
| Body-only match | Structured recipe against a phrase that exists only in prose | Exit 0, body evidence, ranked below every field hit |
| Generic negative | Any recipe against `session` | No `trigger_phrases` field hit anywhere in the corpus |
| Archive exclusion | Any recipe against a phrase that exists only under `z_archive/` | Exit 1, and no path from `z_archive/` in any other control |
| Malformed skip | Pipeline over a malformed-frontmatter fixture | File byte-identical afterwards, exactly one diagnostic row |
| Idempotence | Second full pipeline run with no corpus change | Zero diff, byte-identical artifacts |

The generic negative is the load-bearing one. The frontmatter editor currently injects folder tokens
and ultimately `session` and `context` fallbacks, and the body extractor runs a separate stop-word and
n-gram policy. Neither may silently define index input. If a `session` query returns a
`trigger_phrases` field hit, a fallback has leaked into an author-controlled surface and the retrofit
has failed REQ-009 regardless of what the residue count says.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `rg` on PATH | External | Green | No recipe can be executed or replayed |
| Node 18 or newer | External | Green | The pipeline cannot run |
| Phase 001 `retrieval-conventions.md` | Internal | Yellow | The convention has no consumer to serve |
| Phase 002 `_memory.continuity` writer decision | Internal | Yellow | Continuity frontmatter handling stays undefined and the retrofit must skip it |
| Phase 003 complete | Internal | Yellow | The convention risks being shaped around a system being removed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a body preimage mismatch, a diff line that is neither frontmatter nor a marker line or non-empty residue after the rescan.
- **Procedure**: revert the track commit. Batching one commit per track is what keeps the blast radius one track wide, and the preimage manifest is an independent check that the revert actually restored the bytes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Enumerate ────────────┐
                      ├──► Process ──► Rescan
Dry-run review ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 3-5 hours, mostly the variant inventory and the preimage manifest |
| Core Implementation | High | 8-14 hours across the classifier, the processor and the validator rule |
| Verification | Med | 4-6 hours, dominated by per-track dry-run review |
| **Total** | | **15-25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Preimage manifest captured and committed before the first write
- [ ] Dry-run diff reviewed on one track
- [ ] Variant inventory accounts for every in-scope document

### Rollback Procedure
1. Stop the pipeline. It is per-file atomic, so a partial run leaves whole files, never half-written ones.
2. Revert the affected track commit.
3. Re-verify the body preimage manifest across the reverted track.
4. File the diagnostics rows that triggered the rollback before retrying.

### Data Reversal
- **Has data migrations?** No. The change is text in the working tree, reversible by revert.
- **Reversal procedure**: revert the track commit, then re-verify against the preimage manifest.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Enumerate  │────►│   Process   │────►│   Rescan    │
│  + preimage │     │  (atomic)   │     │  (residue)  │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Dry-run  │
                    │  review   │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Enumerator | None | `variant-inventory.json`, `preimage-manifest.json` | Dry-run, Processor |
| Dry-run planner | Enumerator | `plan.diff` | Processor |
| Processor | Enumerator, Dry-run planner | Retrofitted files, `diagnostics.json` | Rescanner |
| Rescanner | Processor | Residue report | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Variant classifier plus preimage manifest** - 3-5 hours - CRITICAL
2. **Processor with atomic per-file rename and post-edit preimage check** - 5-8 hours - CRITICAL
3. **Per-track dry-run, process, rescan across the corpus** - 4-6 hours - CRITICAL

**Total Critical Path**: 12-19 hours

**Parallel Opportunities**:
- The validator rule and the template updates can be built alongside the processor
- Recipe replay controls can be recorded against the pre-retrofit corpus before any write
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory complete | Eight variant counts sum to the in-scope total, preimage manifest committed | After Setup |
| M2 | One track retrofitted | Dry-run reviewed, preimage verifies, residue empty on that track | Mid Implementation |
| M3 | Corpus retrofitted and gated | All tracks clean, validator rule live, second run produces no diff | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: The body preimage excludes anchor marker lines

**Status**: Proposed

**Context**: The phase must retrofit section markers while guaranteeing that no prose changes. Stated
plainly, those two goals contradict each other, because inserting a marker changes the file.

**Decision**: Define the preimage over the body region with every whole-line anchor marker removed.
Marker lines are then outside the protected region by construction, and every other byte is inside it.
The diff rule enforces the same boundary from the other direction: only frontmatter lines and
whole-line marker additions or removals may appear in a retrofitted document's diff.

**Consequences**:
- Marker retrofit and no-body-rewrite both hold, and the guarantee is machine-checkable rather than reviewed by eye
- A marker inserted mid-paragraph would pass the hash while damaging the prose, so the grammar requires markers to occupy their own line and the diff rule rejects partial-line changes

**Alternatives Rejected**:
- Hash the whole body including markers: makes any marker retrofit a violation, which would gut the phase
- Reviewer judgment on a 22,127-file diff: not reviewable, which is the risk the batching already exists to manage

---

### ADR-002: Ripgrep produces evidence, the caller ranks it

**Status**: Proposed

**Context**: It is tempting to treat `--sort=path` or match order as relevance, which would let the
recipes stand in for the retired ranking pipeline.

**Decision**: Ripgrep supplies matches, paths and lines only. The wrapper applies the field, match
class and path rank tuple in section 3, and reads the exit status on every call.

**Consequences**:
- Ranking stays inspectable and testable independently of the search tool
- The recipes remain honest about what was lost with the ranking pipeline instead of implying parity

**Alternatives Rejected**:
- `--sort=path` as relevance: it is path ordering and runs single-threaded, so it costs throughput and buys nothing
- `-w` as a substring-match equivalent: word boundaries are strictly narrower and would drop real matches

---

## RESEARCH SOURCE

The pipeline shape, the glob and ignore constraints, the diagnostics schema, the rank tuple, the exit
mapping and the negative controls derive from specs/system-speckit/049-memory-decommission/005-ripgrep-retrieval-research/research/lineages/luna-max/research.md

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
