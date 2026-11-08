# Iteration 7 — Q10 operator/AI friction, Q11 sk-code/sk-doc conformance, Q12 concrete extensions

## Focus

Three focus items, all executed as live probes rather than note-reading:

1. **Corrections carried from iteration 6.** Re-probe `sync-phase-map-status.ts` under both runners, and recount the speckit command inventory from the files on disk instead of from the README's self-description.
2. **Q10 — operator and AI-user friction.** Run `validate.sh`, `create.sh` and `lookup-trigger-index.mjs` with a wrong flag, a missing folder and a bad level, capturing exact stderr text and the real exit code (each probe written to files, `EXIT=$?` read after the command, never through a pipe).
3. **Q11 — sk-code / sk-doc conformance.** Measure system-spec-kit's TypeScript and shell against sk-code's own standards for module headers, test placement and error handling, and `SKILL.md` against sk-doc's required section order, citing both sides.
4. **Q12 — concrete extensions.** Tie three extension proposals to measured gaps: a write-verb-first rule for the Gate 3 classifier, a phase-parent anchor scan for the validate rule set, and a three-value exit contract for `check-goal`.

## Actions Taken

| # | Action | Result |
|---|--------|--------|
| 1 | Read run config, strategy key questions, registry `keyFindings`, and `deltas/iter-006.jsonl` | Confirmed the three open questions (Q6, Q7, Q10–Q12) and the exact prior finding rows to correct rather than repeat |
| 2 | `npx tsx .../sync-phase-map-status.ts --help` vs `node .../sync-phase-map-status.ts --dry-run` | tsx: loads, parses args, `EXIT=1` with `unknown argument: --help`. node: `ERR_MODULE_NOT_FOUND` for `../lib/esm-entry.js`, `EXIT=1`. The prior finding's "documented invocation exits 1 with ERR_MODULE_NOT_FOUND" does not hold as written — see correction F1 |
| 3 | `ls -1 .skilled/commands/speckit/*.md` and `find .skilled/commands/speckit -type f` | 7 command `.md` files, 12 asset files. README self-count says 9, its table carries 10 rows, its tree draws 8 assets — three different inventories (F2) |
| 4 | Exit-code matrix over `validate.sh`, `create.sh`, `lookup-trigger-index.mjs` | Measured: validate `--nope` → 1, missing folder → 3, `--level 99` → 1 (no such flag), `--help` → 0; create no-args → 1 with usage, `--level 9` → 1 with an enumerated list; lookup `--bogus-flag` → 2, valid no-hit → 1 with a full JSON envelope (F3, F4) |
| 5 | Header conformance sweep over 115 non-test `.ts` files under `runtime/cli` | 14 open with a shebang on the first non-blank line, not a module header (F8) |
| 6 | Read sk-code's TypeScript standards (`style-guide/`, `quality-standards/`, `quick-reference/`) | Module-header rule found; **no** test-placement rule found — only a `.d.ts` co-location rule (F8, F9) |
| 7 | Read sk-doc `sk-create-skill/references/skill/creation-workflow.md` and system-spec-kit `SKILL.md` headings | Canon order satisfied; one naming drift and two inserted sections (F10) |
| 8 | Read `gate-3-classifier.ts` trigger tables and the classification tail, `rules/` inventory, `check-spec-doc-integrity.sh`, `check-goal.cjs` exit paths | Extension evidence for F5, F6, F7 |

## Findings

### F1 — CORRECTION of f-iter006-004: the script runs under tsx; only plain `node` type-stripping fails, and no invocation was ever documented

`f-iter006-004` claimed the script "is documented as a runnable `.ts` entry" and that "the documented invocation exits 1 with `ERR_MODULE_NOT_FOUND`". Both halves are wrong on re-probe:

- Under `npx tsx`, the module graph resolves and the argument parser runs: `sync-phase-map-status: unknown argument: --help`, `EXIT=1`. That is the parser rejecting a flag, not a resolution failure.
- Under plain `node` (native type-stripping), resolution fails before any code runs: `Error [ERR_MODULE_NOT_FOUND]: Cannot find module '.../runtime/cli/lib/esm-entry.js' imported from '.../sync-phase-map-status.ts'`, `EXIT=1`.
- The runtime README never documents an invocation for this file at all. It appears twice: once in the directory tree as `+-- sync-phase-map-status.ts     # Sync a phase parent's map table; report completion mismatches` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:74] and once in the script table as a behaviour description [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114]. Neither line names a runner.

What survives the correction is narrower and still real: the file is the only `.ts` under `runtime/cli/spec` with no shebang, while both tsx-run siblings in the tree declare their runner in line 1 — e.g. `#!/usr/bin/env npx tsx` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:1] — so a reader who reaches for `node` gets a resolution crash with no hint that tsx is required.

- **Type:** bug (corrected) · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** high (two runners probed, exit codes captured)
- **Verify:** `npx tsx .skilled/skills/system-spec-kit/runtime/cli/spec/sync-phase-map-status.ts --help; echo $?` then `node .skilled/skills/system-spec-kit/runtime/cli/spec/sync-phase-map-status.ts --dry-run; echo $?`

### F2 — RECOUNT: the speckit index carries three mutually inconsistent inventories (7 files, 9 claimed, 10 rows, 8 drawn assets)

Recounted from disk this iteration, not from the README:

- **Files on disk:** 7 — `complete.md`, `handoff.md`, `implement.md`, `plan.md`, `resume.md`, `save.md`, `search.md`.
- **Self-count:** `├── README.txt        # This file, 9-command index and workflow guide` [SOURCE: .skilled/commands/speckit/README.txt:116].
- **Table rows:** 10, and the table mixes families — it opens at `| Command | Invocation | Steps | Description |` [SOURCE: .skilled/commands/speckit/README.txt:67] and includes two `/deep:*` commands plus `plan --intake-only` as a separate row. So 10 rows are not 10 speckit commands; 8 distinct `/speckit:*` invocations are named (7 files + the intake-only variant).
- **Assets drawn vs on disk:** the tree closes the assets branch at `└── search-presentation.txt` [SOURCE: .skilled/commands/speckit/README.txt:132] after drawing eight files, but the directory holds twelve. The four omitted are `speckit-complete-presentation.txt`, `speckit-implement-presentation.txt`, `speckit-plan-presentation.txt`, `speckit-resume-presentation.txt`. This contradicts the file's own naming explanation, which says only save and search "drop the family prefix because the bare command name already reads unambiguously, unlike `plan`, `implement`, `complete` and `resume`, which need the `speckit-` prefix" [SOURCE: .skilled/commands/speckit/README.txt:148] — those four prefixed presentation files exist and are simply not drawn.

`f-iter006-002`'s "table lists ten" is confirmed but incomplete; the stale tree and the 7-vs-9 gap are new ground.

- **Type:** bug (drift) · **Severity:** P2 · **Release:** v4.0.0.13 (handoff appended; neither count nor tree updated) · **Confidence:** high
- **Verify:** `ls -1 .skilled/commands/speckit/*.md | wc -l` → 7; `ls -1 .skilled/commands/speckit/assets | wc -l` → 12; `sed -n '116,132p' .skilled/commands/speckit/README.txt`

### F3 — UX: the two sibling spec CLIs disagree on `--level`, and only one of them tells you what it accepts

A wrong flag on `validate.sh` produces a bare rejection: `ERROR: Unknown option '--level'`, `EXIT=1` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:104]. The valid-flag list exists but is only reachable through `--help`, which is itself a different option the operator just failed to guess [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:67]. `create.sh`, one directory away, is taught by the same skills and accepts `--level`; on a bad value it prints the whole accepted set — `Error: --level must be 1, 2, 3, 3+, phase-parent, review or research`, `EXIT=1` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:95]. An operator who learns the flag vocabulary from `create.sh` and carries it to `validate.sh` gets no signal that Level is auto-detected there rather than selectable. `create.sh`'s own usage line advertises only `[--json] [--short-name <name>] [--number N]` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:367], so the `--level` the error message defends is undocumented in the same binary's usage output.

- **Type:** UX · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** high (both messages captured verbatim)
- **Verify:** `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh --level 9 x; echo $?` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh --level 9 "x"; echo $?`

### F4 — UX: exit 1 and exit 2 each carry two or three incompatible meanings across the spec-kit front doors

Measured matrix, this iteration:

| Tool | Condition | Code | Text |
|------|-----------|------|------|
| `validate.sh` | unknown option | 1 | `ERROR: Unknown option '--nope'` |
| `validate.sh` | missing folder path | 1 | `ERROR: Folder path required` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:108] |
| `validate.sh` | folder does not exist | 3 | `ERROR: Folder not found: ...` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:110] |
| `create.sh` | no arguments | 1 | usage line |
| `create.sh` | bad `--level` | 1 | enumerated error |
| `lookup-trigger-index.mjs` | unknown flag | 2 | `unknown argument: --bogus-flag` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:281] |
| `lookup-trigger-index.mjs` | valid query, no hit | 1 | complete JSON envelope on stdout |
| `check-goal.cjs` | goal conformance errors | 2 | [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:714] |

Consequences an operator or an AI user hits immediately: `2` means "you typed the command wrong" for the lookup and "the artifact is wrong" for the goal checker; `1` means "nothing found" for the lookup and "you typed the command wrong" for both shell CLIs. Any wrapper written as `cmd && next` or `set -e` cannot separate usage error from empty result from invalid artifact. The lookup's no-hit path is the sharpest case: it prints a well-formed, schema-versioned envelope and still exits 1 [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:339].

- **Type:** UX (improvement) · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** high (every cell measured)
- **Verify:** rerun the four probes and diff the codes against the table.

### F5 — EXTENSION: a write-verb-first rule for the Gate 3 classifier

The write vocabulary is nineteen bare tokens, every one `kind: 'token'` — `create`, `add`, `remove`, `delete`, `rename`, `move`, `update`, `change`, `modify`, `edit`, `fix`, `patch`, `refactor`, `implement`, `build`, `write`, `rewrite`, `generate`, `configure` [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:151]. Classification collects all matches first and only then decides whether a read-only word cancels the write [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:817], with the cancel decided by two positional helpers (`hasNegatedWriteAction`, `isPromptOnlyGeneration`) at the early return [SOURCE: .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:833] and again inside the mixed-tail helper. Because every branch consumes an aggregated match set, clause order participates in the outcome without being named as a rule anywhere in the file's contract.

Concrete extension: compute the index of the first write verb inside the imperative head (the slice before the first `,` / `and` / `then` / newline) and let that position veto the read-only override unconditionally; then add an order-invariance golden test that reverses the clause order of each existing golden prompt and asserts an unchanged `triggersGate3`. Tied to F3/F4's theme — the same request must not change meaning because of surface order — and to the classifier's existing `gate-3-classifier.vitest.ts` suite, which currently has no such assertion.

- **Type:** extension · **Severity:** P2 · **Confidence:** medium (branch order read; no misclassification golden produced this iteration)
- **Verify:** `rg -n "hasNegatedWriteAction|isPromptOnlyGeneration|hasMixedWriteTail" .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts`

### F6 — EXTENSION: no validate rule scans a phase parent's required anchors

`check-spec-doc-integrity.sh` contains zero occurrences of `phase`, `parent`, `ANCHOR` or `required` — measured with a grep over the file, not inferred — so the anchor guarantees the validate engine enforces are per-document, never parent-to-children. The rule set as drawn has nothing that reads a phase parent's Phase Documentation Map, and the only tool that would write that map is the uncalled script from `f-iter006-005`, described in the runtime README as correcting "a phase parent's map table rows that disagree with their child's status" [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:114]. Net effect: a phase parent can ship with a map table that has drifted from its children and `validate.sh --strict` has no rule to notice.

Concrete extension: add `check-phase-anchors.sh` to `runtime/cli/rules/`, registered like its peers [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:103], that (a) asserts each phase child carries its level's required anchor set and (b) asserts every child directory has exactly one row in the parent's map table. Feature-detect the parent shape from the folder grammar rather than from a flag, so a plain Level 2 packet is untouched.

- **Type:** extension · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** medium
- **Verify:** `grep -cE 'phase|parent|ANCHOR' .skilled/skills/system-spec-kit/runtime/cli/rules/check-spec-doc-integrity.sh` → 0

### F7 — EXTENSION: `check-goal` collapses warnings into success and leaves exit 1 unused

The checker has exactly one numeric return — `if (result.errors.length > 0) return 2;` [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:714] — and its top-level catch also sets 2 [SOURCE: .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:739]. Warnings therefore share exit 0 with a clean goal, and 1 is never produced. A hook that wants to block only on errors but report on an over-budget goal has no signal to key on; it must parse stdout, which is the unstable surface the status word was invented to avoid.

Concrete extension: a three-value contract — 0 clean, 1 warnings-only (over budget, unset slice, advisory), 2 errors — plus one fixture per code. That also fixes the family-wide ambiguity in F4 by giving the goal checker the only code nobody else uses.

- **Type:** extension · **Severity:** P2 · **Confidence:** medium-high
- **Verify:** `grep -nE 'return [0-9]|process.exitCode' .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`

### F8 — MISALIGNMENT: sk-code requires a module header on every TypeScript file; 14 of 115 system-spec-kit files open with a shebang instead

sk-code's own standard is unqualified: "All TypeScript files MUST begin with a module header block identifying the module. The one exception is a `.d.ts`, `.d.mts` or `.d.cts` file the compiler emitted" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/overview-strict-and-naming.md:36]. A sweep of `runtime/cli` (excluding `dist`, `tests` and `node_modules`) counted 115 `.ts` files and 14 whose first non-blank line is not a header — all 14 are executable entry points whose line 1 is a shebang, twelve `#!/usr/bin/env node` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/continuity/backfill-frontmatter.ts:1] and two `#!/usr/bin/env npx tsx` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/observability/smart-router-analyze.ts:1].

The gap is in the standard, not the code: a shebang must occupy line 1 for the kernel, so a header-first rule cannot be satisfied literally by any executable script. System-spec-kit is 14 files deep on a practice the rule does not permit, and every one of them is defensible. Extension: amend the rule to "begin with a module header, after an optional shebang line", which turns 14 silent violations into 14 conforming files with no code change.

- **Type:** misalignment (with sk-code) · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** high (counted with a loop, offenders listed)
- **Verify:** rerun the loop: for each `.ts` under `runtime/cli` minus `dist|tests|node_modules`, print the first non-blank line.

### F9 — MISALIGNMENT: sk-code's TypeScript references contain no test-placement rule, so nothing arbitrates system-spec-kit's test roots

The only co-location rule in sk-code's TypeScript references concerns declarations — "for frequently imported JS modules, add a `.d.ts` declaration file co-located with the JS module and sharing its exact basename" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/references/typescript/style-guide/formatting-imports-and-coexistence.md:294]. No rule addresses where a `*.vitest.ts` belongs. System-spec-kit's own vitest run reports three distinct project prefixes for suites in what is nominally one package — `cli:tests/...`, a bare `:tests/...`, and `root:../tests/...` — so the same skill keeps tests in at least three roots and the standard cannot say which is canonical. This is the shape of gap a reviewer cannot close by reading code: there is no rule to cite.

Extension: add a placement rule naming one root per package and forbidding new siblings, then let the existing test-layout check enforce it. Tied to `f-iter006-005`: the uncalled script's only suite lives in the root tests directory, not beside the package that owns it.

- **Type:** misalignment (with sk-code) · **Severity:** P2 · **Release:** present at v4.0.2.0 · **Confidence:** medium (standards side read in full; project prefixes read from the cached vitest results, not from the config)
- **Verify:** `rg -n "colocat|co-locat|tests/ directory|placement" .skilled/skills/sk-code/sk-code-skilled/references/typescript/` → only the `.d.ts` hit at line 294; `rg -n "root:|projects" .skilled/skills/system-spec-kit/runtime/cli/vitest.config.*`

### F10 — PARTIAL CONFORMANCE: `SKILL.md` matches sk-doc's required section order; only the REFERENCES heading name drifts

sk-doc's canon states the required order explicitly: "Normalize SKILL.md to the required section order: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES and REFERENCES" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md:133]. system-spec-kit's `SKILL.md` follows it: `## 1. WHEN TO USE` [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:14], `## 2. SMART ROUTING` [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:89], `## 3. HOW IT WORKS` [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:100], `## 4. RULES` [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:195], closing with `## 7. REFERENCES AND RELATED RESOURCES` [SOURCE: .skilled/skills/system-spec-kit/SKILL.md:309]. Two sections (SUCCESS CRITERIA, INTEGRATION POINTS) sit between RULES and REFERENCES, which preserves the canon's relative order rather than breaking it. The single drift is the name: canon says `REFERENCES`, the file says `REFERENCES AND RELATED RESOURCES`. At 317 lines the file is also at the length where a reader leans on the section list, so a naming mismatch is the one place a canon citation would fail to resolve.

- **Type:** drift (naming) · **Severity:** P2 (low) · **Release:** present at v4.0.2.0 · **Confidence:** high (both sides read)
- **Verify:** `grep -nE '^## ' .skilled/skills/system-spec-kit/SKILL.md` and compare against the canon sentence at `creation-workflow.md:133`.

## Questions Answered

- **Q10 — operator and AI-user friction.** Answered with measured text and codes rather than inference: `validate.sh` rejects `--nope` with `ERROR: Unknown option '--nope'` (1), a missing folder with `ERROR: Folder not found: ...` (3), a `--level` it does not own with the same unknown-option text (1), and `--help` with 0; `create.sh` with no arguments prints its usage and exits 1, and a bad `--level` enumerates all seven accepted values and exits 1; `lookup-trigger-index.mjs` rejects `--bogus-flag` with `unknown argument:` (2) and exits 1 on a clean no-hit while printing a full JSON envelope. Output length is modest everywhere (usage 1 line, errors 1 line); the friction is vocabulary and code taxonomy, not verbosity — F3 and F4.
- **Q11 — sk-code and sk-doc conformance.** Answered: module-header misalignment is systemic and lives in the standard's missing shebang exemption (F8); test placement has no standard at all (F9); `SKILL.md` conforms to sk-doc's required order with one heading-name drift (F10). Error handling on the TS side follows sk-code's `catch (error: unknown)` pattern in the reference examples; the shell side is where the divergence shows, as exit-code semantics (F4).
- **Q12 — concrete extensions.** Answered with three proposals tied to measured gaps: write-verb-first plus an order-invariance golden test for the Gate 3 classifier (F5), a registered `check-phase-anchors.sh` for the phase-parent map (F6), and a 0/1/2 contract for `check-goal` (F7). The trigger-index and continuity limbs of Q12 were not reached this iteration and carry forward.

## Questions Remaining

- **Q6 residual unchanged:** only `check` was executed for `/doctor:update`; `align`, `apply`, `rollback` and `compat` were read, not run.
- **Q7 residual unchanged:** the template fill-note comparison against sk-doc canon, and the `MEASURED_BEHAVIOR` rule's source file.
- **Q12 partial:** the trigger-index and continuity extension limbs remain — F5–F7 cover the classifier, validate rules and goal only.
- **New residual from F2:** whether the `9-command` self-count was ever correct (at v4.0.0.0 the family may have had nine commands including two `/deep` entries), which would make this a stale count rather than a wrong one. Needs the v4.0.0.0 note read against the then-current table.
- **New residual from F9:** the three vitest project prefixes were read from a cached results file; the config that declares them was not opened, so "three roots" is observed output, not declared intent.
- **New residual from F8:** whether the module header appears on line 2 of those 14 files (which would make them conforming under a reasonable reading) — only line 1 was measured.

## Next Focus

Iteration 8 should close the two measured-in-this-iteration residuals that are cheapest to settle and highest value: (a) open one of the 14 shebang-first files and check whether a module header follows the shebang, which decides whether F8 is a standard gap or a code gap; (b) read the vitest config to confirm the three test roots are declared rather than incidental, which decides whether F9 is a standards gap alone. Then finish the two open key questions — Q6's dry-run preview path and Q7's template fill notes — and complete Q12's trigger-index and continuity limbs.

## SCOPE VIOLATIONS

None. Every write this iteration went to the run directory's `iterations/iteration-007.md`, `deltas/iter-007.jsonl`, a `/tmp` scratch file for the gateway record, and the gateway's own state-log refresh. All probes were read-only or dry-run: `validate.sh` invocations, `create.sh` with a deliberately bad level (rejected before any write), `lookup-trigger-index.mjs` lookups, and `node`/`tsx` runs of a `--help`-rejected script. No repository file outside the run directory was created, modified, renamed or deleted.
