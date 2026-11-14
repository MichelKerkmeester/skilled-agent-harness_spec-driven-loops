---
title: "Implementation Plan: Phase 6: purpose-carry-follow-ups"
description: "Fourteen literal search-and-replace edits across nine files: ten that give five phase parents a real Problem Statement and Purpose, two that make the PreCompact folder detection match specs/ paths with one test, and two that align the resume assets' reply_format with the presentation file."
trigger_phrases:
  - "purpose carry follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: purpose-carry-follow-ups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs, TypeScript (Node ESM) for one hook and its vitest file, YAML workflow assets read by the model |
| **Framework** | system-spec-kit runtime hooks and the SpecKit command router in `.skilled/commands/speckit/` |
| **Storage** | None |
| **Testing** | vitest from `.skilled/skills/system-spec-kit/node_modules`, plain `node` for the phase workflow and mirror checks, `python3` with `yaml`, `rg` and `validate.sh` |

### Overview
Fourteen literal edits close three defects. E1 to E10 replace the scaffold Problem Statement and Purpose in five phase parents with text taken from their own children. E11 widens one regex in the Claude PreCompact hook to the one the Stop hook already uses and E12 adds the test that proves the brief line. E13 and E14 replace one `reply_format` line in each resume asset with the presentation file's brief rows. The proof is the three Measured Behavior commands in `spec.md`, the two hook test files, the phase workflow test, the mirror check and `validate.sh` on each edited parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The baseline commands in section 5 print the numbers recorded there
- [ ] Each search text in section 4 matches exactly once in its file (`rg -c -F`, or `rg -U -c -F` for E12, prints 1)
- [ ] `git status --short` lists none of the nine files in section 4 before the first edit

### Definition of Done
- [ ] All REQ rows in `spec.md` have evidence in `tasks.md`
- [ ] `hook-precompact.vitest.ts` prints 18 passed, `hook-session-start.vitest.ts` 23 passed, the phase workflow test `passed=148 failed=0` and the mirror check `PASS: 256 mirrors across 10 trees are in sync.`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Three independent literal edits. No new file outside this packet, no new module, option or dependency.

### Key Components
- **Five phase parent `spec.md` files**: `resolvePacketPurpose` in `runtime/lib/spec/packet-purpose.ts` and the resume `purpose_row` rule skip a parent whose Purpose is the scaffold sentence. Without a real Purpose, a child of these parents with no Purpose of its own gets none at all.
- **`detectSpecFolder` in `runtime/hooks/claude/compact-inject.ts`**: feeds the `Active spec folder:` line of the brief cached at PreCompact (line 465) and the folder handed to the opt-in authored snapshot (line 636). Its regex at line 331 is `/\.opencode\/specs\/[^\s"'`]+/g`. The Stop hook's regex at `session-stop.ts:49` is `/(?:\.opencode\/)?specs\/[^\s"'`]+/g`. E11 copies the second into the first.
- **`confidence_framework.reply_format` in both resume assets**: `.skilled/commands/speckit/resume.md` section 2 names `speckit-resume-presentation.txt` the "Presentation source of truth" and section 5 says the "Resume brief and no-session result templates" live only there. So the presentation file wins and the assets follow it.

### Data Flow
Purpose: a resume or compaction on a child walks up to its parent's `spec.md` and quotes the first sentence of `### Purpose` once it is no longer the scaffold sentence. Folder line: PreCompact reads the transcript tail, `detectSpecFolder` picks the most-referenced folder and `buildMergedCompactResult` writes `Active spec folder: <folder>` into the cached brief. Brief rows: the model reads `reply_format` from the YAML and the Resume Brief template from the presentation file, and after E13 and E14 both name the same ten rows.

### Why `reply_format` names the Source row and not its values
The presentation file's `Source:` values are `handover|continuity|spec_docs|mcp_enrichment|combined`. The assets' own `context_source` outputs are `handover|continuity|spec_docs|ripgrep_context|ripgrep_anchor` (auto, line 176) and the same plus `combined` (confirm, line 219). Copying the presentation values into `reply_format` would put `mcp_enrichment`, which no step produces, into a third place. Naming only the row keeps one owner for the values, the presentation file, as `resume.md` section 5 asks. The stale `mcp_enrichment` value is named out of scope in `spec.md`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup runs the baseline commands in section 5 and confirms each search text below matches once. Implementation applies E1 to E14 below, one per task in `tasks.md`. Verification builds the runtime, reruns the baseline commands and the three Measured Behavior commands in `spec.md`. `tasks.md` owns the order and the task state.

Apply each edit as a literal search and replace with the Edit tool. Copy the text inside the fences exactly. All paths are relative to the worktree root. Each search text was counted on 2026-11-14 at `145d8e980f` with `rg -c -F -- '<search text>' <file>` (E12 with `rg -U -c -F` because it spans lines), and each printed `1`.

### Defect 1: five parents get a real Problem Statement and Purpose (E1 to E10)

### E1. Local embeddings parent, Problem Statement
File: `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/spec.md`. Count: 1. Sources: the children `003-mcp-config-rollout` (auto picked Voyage while a key was exported), `001-prefix-registry-architecture` (Nomic prefixes for every model), `002-model-installation-and-compat` (models not on disk) and `004-vec-store-rebuild` (stores held older vectors).

Search text:
```text
This phased decomposition tracks Local embeddings Setup A — EmbeddingGemma-300m for code, EmbeddingGemma-300m for memory across independently executable child phase folders.
```
Replacement:
```text
Memory search and code search sent their text to the Voyage cloud API, because `EMBEDDINGS_PROVIDER=auto` picked Voyage whenever a Voyage key was exported. A local model could not simply take over: both embedding providers prepended Nomic's prefixes whatever model was loaded, the local models were not on disk and the vector stores held vectors from older models.
```

### E2. Local embeddings parent, Purpose
File: `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/spec.md`. Count: 1. Source: the parent's own closing summary, which says the live `auto` cascade has since moved to Ollama then hf-local, and the child `017-llama-cpp-default-flip`.

Search text:
```text
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.
```
Replacement:
```text
Run memory and code embeddings on this machine with a local model, and keep that local embedding runtime working as later phases change its default backend.
```

### E3. Install scripts and doctor parent, Problem Statement
File: `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/spec.md`. Count: 1. Source: `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/001-deep-research-install-scripts-doctor/research/research.md` section 1. The four child specs are unfilled scaffolds, so the research synthesis is the only first-hand statement.

Search text:
```text
This phased decomposition tracks Deep-research deep-dive + rework of install guides, scripts, and doctor commands for post-CocoIndex-deprecation reality, including 116 deep-skill-evolution impact across independently executable child phase folders.
```
Replacement:
```text
The install guides, setup scripts and `/doctor` commands described a system that had since changed. They still carried CocoIndex and reranking text after that stack was deprecated, and they named skills, database paths and MCP tool owners from before the deep-loop skill renames and the skill-advisor extraction.
```

### E4. Install scripts and doctor parent, Purpose
File: `specs/system-speckit/memory-search-and-knowledge/001-graph-and-context-optimization/006-operator-tooling/003-install-scripts-doctor-realignment/spec.md`. Count: 1. Source: the same research section 1, whose highest-value outcome is one agreed path for the code-graph and deep-loop databases.

Search text:
```text
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.
```
Replacement:
```text
Bring the install guides, setup scripts and `/doctor` commands in line with the system as it runs now, with one agreed database path for each store.
```

### E5. Template reduction parent, Problem Statement
File: `specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md`. Count: 1. Sources: the parent title and the children `002-tasks-checklist-merge`, `004-continuity-single-source` and `005-comment-extraction`.

Search text:
```text
This phased decomposition tracks Reduce and optimize spec-kit doc templates; merge tasks and checklist; less bloat, better historic context and small-model legibility across independently executable child phase folders.
```
Replacement:
```text
The spec-kit doc templates rendered more text than an author needed. Every scaffolded doc carried instruction comments, continuity was written in more than one doc and verification lived in a separate checklist beside `tasks.md`, so a small model had more to read and more copies to keep in step.
```

### E6. Template reduction parent, Purpose
File: `specs/system-speckit/runtime-and-release/001-system-speckit-v4/003-spec-doc-template-reduction/spec.md`. Count: 1. Sources: the Purpose of `002-tasks-checklist-merge` and `006-template-reduction-verification` (no change to any shipped packet's derived status) and `010-checklist-full-retirement` (one home for verification).

Search text:
```text
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.
```
Replacement:
```text
Cut the templates down to what each doc needs, with one home for continuity and one for verification, without changing the derived status of any packet already shipped.
```

### E7. Decisions and notes parent, Problem Statement
File: `specs/system-speckit/runtime-and-release/001-system-speckit-v4/004-decisions-and-notes-system/spec.md`. Count: 1. Sources: the Problem Statements of `002-active-decisions-design` and `003-deprecation-mechanics`.

Search text:
```text
This phased decomposition tracks Deprecate constitutional memory; build a separate actively-used decisions and notes system integrated with spec and skill across independently executable child phase folders.
```
Replacement:
```text
The constitutional memory tier looked like a steering layer, but its rules were already inlined in the root instruction docs and it surfaced only when the model chose to call `memory_search`. It still had a cost, because ADR-shaped searches pulled its files by default and the indexer kept scanning its folder.
```

### E8. Decisions and notes parent, Purpose
File: `specs/system-speckit/runtime-and-release/001-system-speckit-v4/004-decisions-and-notes-system/spec.md`. Count: 1. Sources: the Purpose of `003-deprecation-mechanics` and `005-advisor-integration`. The sentence leaves out whether a `DECISIONS.md` surface replaces the tier, because `002-active-decisions-design` says no new surface and `006-memory-redesign-verification` names one.

Search text:
```text
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.
```
Replacement:
```text
Retire the constitutional memory tier without losing any of the steering it was meant to give.
```

### E9. Simplification research parent, Problem Statement
File: `specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/spec.md`. Count: 1. Sources: the Problem Statements of `002-cli-runtime-utilization` (nobody had mapped what is live) and `005-overengineering-simplification` (grown by accretion, cost never weighed).

Search text:
```text
This phased decomposition tracks spec-kit simplification research across independently executable child phase folders.
```
Replacement:
```text
The system-spec-kit skill had grown by accretion across its retrieval system, CLI package, shared package, templates and validator rules. No one had mapped which parts were live or weighed what each part costs against what it protects.
```

### E10. Simplification research parent, Purpose
File: `specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/spec.md`. Count: 1. Source: the Objective in `specs/system-speckit/runtime-and-release/001-system-speckit-v4/030-spec-kit-simplification-research/goal.md` section 1. This parent's sentence says `verification` where the other four say `checklists`.

Search text:
```text
Keep parent documentation lean while child phases own detailed plans, tasks, verification, and continuity.
```
Replacement:
```text
Find with file and line evidence what in system-spec-kit can be simplified, merged or removed, then fix every finding that reproduces.
```

### Defect 2: the PreCompact brief names `specs/` folders (E11 and E12)

### E11. Folder regex matches `specs/`
File: `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` (line 331). Count: 1. The replacement is the Stop hook regex from `session-stop.ts:49`. The match keeps a leading `.opencode/` when present, so `.opencode/specs/x/y` still returns whole.

Search text:
```text
  const specFolderRe = /\.opencode\/specs\/[^\s"'`]+/g;
```
Replacement:
```text
  const specFolderRe = /(?:\.opencode\/)?specs\/[^\s"'`]+/g;
```

### E12. One test for a `specs/` folder and the brief line
File: `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` (lines 200 to 203). Count: 1 with `rg -U -c -F`. `buildMergedCompactResult` is already imported at line 11. The new test fails today for one reason no current test covers: a `specs/` folder gets no brief line.

Search text:
```text
      expect(detectSpecFolder([
        `Continue in ${folder}`,
      ])).toBe(folder);
    });
```
Replacement:
```text
      expect(detectSpecFolder([
        `Continue in ${folder}`,
      ])).toBe(folder);
    });

    it('detects a spec folder under a top-level specs directory and names it in the brief', async () => {
      const folder = 'specs/system-speckit/x/y';
      const lines = [`Read /repo/${folder}/spec.md during compaction`];

      expect(detectSpecFolder(lines)).toBe(folder);
      expect(detectSpecFolder(['Checking unrelated output that names no packet'])).toBeNull();
      const result = await buildMergedCompactResult(lines);
      expect(result.text).toContain(`Active spec folder: ${folder}`);
    });
```

### Defect 3: the resume assets list the presentation rows (E13 and E14)

### E13. Auto asset, `reply_format`
File: `.skilled/commands/speckit/assets/speckit-resume-auto.yaml` (line 138). Count: 1. One whole line, indented two spaces. The `purpose_row` line after it stays as it is.

Search text:
```text
  reply_format: ["Purpose (omit when none)", "Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
```
Replacement:
```text
  reply_format: ["Spec", "Purpose (omit when none)", "Confidence: high|medium|low | Source", "Now", "Last confirmed", "Next safe action", "Blockers", "Progress", "Why this is next"]
```

### E14. Confirm asset, `reply_format`
File: `.skilled/commands/speckit/assets/speckit-resume-confirm.yaml` (line 157). Count: 1. Same text as E13.

Search text:
```text
  reply_format: ["Purpose (omit when none)", "Confidence: NN%", "Context source: handover|memory", "Now", "Last confirmed", "Next safe action"]
```
Replacement:
```text
  reply_format: ["Spec", "Purpose (omit when none)", "Confidence: high|medium|low | Source", "Now", "Last confirmed", "Next safe action", "Blockers", "Progress", "Why this is next"]
```

Before this plan was written, E11 was applied to a scratch copy of the built hook and E13 and E14 to scratch copies of both assets. The patched hook returned `specs/system-speckit/x/y` and its brief held `Active spec folder: specs/system-speckit/x/y`. The E12 assertions all held on it. Both patched assets loaded with `yaml.safe_load`, and `check-brief-rows.py` printed `match` for both.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run each command below before E1 and again after E14 and the build. The baseline column holds what each printed on 2026-11-14 at `145d8e980f`. Commands marked `(runtime)` run from `.skilled/skills/system-spec-kit/runtime`, all others from the worktree root.

| Command | Baseline | After the edits |
|---------|----------|-----------------|
| `(runtime) ../node_modules/.bin/vitest run --config vitest.config.ts runtime/tests/hook-precompact.vitest.ts runtime/tests/hook-session-start.vitest.ts` | `hook-precompact.vitest.ts (17 tests)`, `hook-session-start.vitest.ts (23 tests)`, `Tests  40 passed (40)`, exit 0 | `(18 tests)`, `(23 tests)`, `Tests  41 passed (41)`, exit 0 |
| `(runtime) npm run typecheck` | exit 0, no diagnostics | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` | `Result: passed=148 failed=0`, exit 0 | unchanged |
| `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` | `PASS: 256 mirrors across 10 trees are in sync.`, exit 0 | unchanged |
| `python3 -c "import yaml,sys; [yaml.safe_load(open(f)) for f in sys.argv[1:]]; print('yaml ok')" .skilled/commands/speckit/assets/speckit-resume-auto.yaml .skilled/commands/speckit/assets/speckit-resume-confirm.yaml` | `yaml ok`, exit 0 | unchanged |
| `CI=1 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict`, first `Summary` and `RESULT` lines, for each parent in section 4 | local embeddings errors 0 warnings 1, install scripts 0 and 0, template reduction 0 and 0, decisions and notes 0 and 0, simplification research 0 and 0, each `RESULT: PASSED` | no more errors or warnings than the baseline, each `RESULT: PASSED` |
| The three Measured Behavior commands in `spec.md` | 5 files listed, `specs/ -> null` and 0 brief lines, `differ` for both assets | no files listed, `specs/ -> "specs/system-speckit/x/y"` and 1 brief line, `match` for both assets |

`CI=1` stops `validate.sh` from repairing a Draft packet's derived metadata on its own, so the baseline run writes nothing. The second Measured Behavior command reads the built `dist/` file, so it shows the fix only after `npm run build`.

What no check proves: that each new parent Purpose is the reason the work had. The builder rereads the source docs named under each edit before applying it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `npm` for the runtime build and typecheck, `python3` with the `yaml` module and `rg`. No new package.

The resume assets have one copy each, under `.skilled/commands/speckit/assets/`. `.opencode/commands/speckit` is a symlink to `.skilled/commands/speckit`, and the mirror check confirms the state after the edits. The Claude PreCompact hook runs `dist/hooks/claude/compact-inject.js`, which `npm run build` regenerates.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a command in section 5 moves from its baseline in a way the After column does not name, or a parent validates with more errors than before. Before commit, run `git checkout -- <file>` for the nine files in section 4 and `npm run build` in the runtime folder. After commit, revert that one commit and rebuild.
<!-- /ANCHOR:rollback -->

---
