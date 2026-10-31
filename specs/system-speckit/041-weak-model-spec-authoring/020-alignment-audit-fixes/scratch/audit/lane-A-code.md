# Lane A: code vs sk-code

Read-only audit of the code that `specs/system-speckit/054-weak-model-spec-authoring` changed, judged against sk-code: `SKILL.md`, `sk-code-quality/SKILL.md`, `sk-code-skilled/SKILL.md`, `shared/references/universal/code-quality-standards.md`, `sk-code-quality/references/code-style-guide.md` section 4 (comments), `sk-code-skilled/assets/checklists/shell-checklist.md`, the TypeScript checklist item list and `sk-code-skilled/references/shared/workflow-guardrails.md` (the dist and build traps).

Nothing in the repository was edited. No build and no test suite ran. The only commands that ran were read-only git, the comment-hygiene checker, shellcheck, `bash -n`, JSON parsing, `tsc --noEmit` on the CLI workspace, the CLI eval checks (`check-no-mcp-lib-imports-ast`, `check-no-mcp-lib-imports`, `check-architecture-boundaries`, `check-allowlist-expiry`, `check-source-dist-alignment`, `check-handler-cycles-ast`, `check-api-boundary.sh`), `dist-freshness.cjs check` and `gh run list`.

## Scope note (read first)

`scope.txt` does not match the packet's code:

- The grep `^Spec: system-speckit/054` also matches the unrelated September packet `system-speckit/054-decommission-debt-fixes` (35 of the 43 matching commits). Most of the 58 code files in `scope.txt` come from that packet, for example `shared/embeddings/factory.ts`, `runtime/api/index.ts` and `cli/evals/*.ts`.
- Most of the weak-model packet's own code commits carry no `Spec:` trailer: `0b935b120c`, `0046fc7ae2`, `8b60bfc041`, `12522be61c`, `2ed9c2e0b9`, `e6a8179aaa`, `95abd302c8`, `7a721f4388`, `74a629a7af`, `23657e227e`, `d5ce52ffac`, `6df0a21a0d` and `b7268e491b`. The packet's own docs cite all of them by SHA. Their 34 code files are missing from `scope.txt`. The list is in `laneA-wm-code.txt`, next to this report.

This lane audited both sets: the 58 scope files and the 34 it missed (`laneA-wm-code.txt`, 52 files including the overlap). Line-level review covered the 4,475-line weak-model code diff (`laneA-wm-code.diff`). The decommission-debt files got the mechanical checks only.

## Findings

### A1 (P0): the new Draft auto-repair test breaks the CLI import-policy gate

- File: `.skilled/skills/system-spec-kit/runtime/cli/tests/draft-auto-repair.vitest.ts:24-28` imports `draftAutoRepairRefusal`, `validateFolder` and `ValidationReport` from `../../lib/validation/orchestrator.js`.
- Evidence: `npx tsx evals/check-no-mcp-lib-imports-ast.ts`, run from `runtime/cli`, exits 1 and prints:
  `AST import policy check FAILED: 1 violation(s) found:` / `tests/draft-auto-repair.vitest.ts:28 → ../../lib/validation/orchestrator.js`.
  This check is part of `npm run check`, and `.github/workflows/spec-kit-check.yml:125` runs it in the "CLI check gate and typecheck" step. Commit `62e4661e01` is an ancestor of `origin/main` (`b51a341a07`). The Spec-Kit Check run on that SHA was still `in_progress` when this audit read it, so the red CI result is inferred: the run's result would confirm it. The same failure on `required-template-anchors.vitest.ts` was already fixed this way in `22c18e4b73`.
- Standard: the repository's governed import policy, which `npm run check` enforces, and the sk-code verification gate (the check must pass before completion).
- Fix (literal): in `.skilled/skills/system-spec-kit/runtime/cli/evals/import-policy-allowlist.json`, append one entry after the `required-template-anchors` entry.
  - old text:
    ```
          "expiresAt": "2027-04-26"
        }
      ]
    }
    ```
  - new text:
    ```
          "expiresAt": "2027-04-26"
        },
        {
          "file": "cli/tests/draft-auto-repair.vitest.ts",
          "import": "../../lib/validation/orchestrator.js",
          "owner": "spec-kit-maintainers",
          "reason": "Test pins the CLI-only Draft auto-repair refusal logic, which has no public api surface",
          "removeWhen": "draftAutoRepairRefusal gains an api export or the test moves beside the module",
          "createdAt": "2026-10-26",
          "lastReviewedAt": "2026-10-26",
          "expiresAt": "2027-04-26"
        }
      ]
    }
    ```
  - Check after: `npx tsx evals/check-no-mcp-lib-imports-ast.ts` exits 0.

### A2 (P1): the scope list misses most of the packet's code and includes another packet's

- File: `scratchpad/align/scope.txt`.
- Evidence: see the scope note above. `comm -23 laneA-wm-code.txt scope.txt` lists 34 weak-model code files not in scope. Among them are `rules/check-placeholders.sh`, `spec/check-placeholders.sh`, `lib/status-classifier.sh`, `spec/check-card-sync.sh`, `spec/check-example-drift.sh`, `lib/description/packet-synopsis.ts` and `lib/validation/spec-doc-structure.ts`.
- Standard: this is a coverage defect in the audit input. It is not a defect in the code.
- Fix (judgment): rebuild the scope from the SHAs the packet docs cite (`rg -o '\b[0-9a-f]{10}\b' specs/system-speckit/054-weak-model-spec-authoring`), not from the trailer grep, and re-run any lane that used `scope.txt`.

### A3 (P1): `check-example-drift.sh` has no COMPONENT header

- File: `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:1-7`.
- Evidence: it is the only script in `runtime/cli/{spec,rules,lib}` without a `# COMPONENT:` block. Its sibling `check-card-sync.sh:1-15`, from the same packet, has one.
- Standard: `shell-checklist.md` section 2 "File Header: COMPONENT comment block present" (tiered P0 there).
- Fix (literal):
  - old text: `#!/usr/bin/env bash\n# Guard: every hand-written example keeps the template's required anchors in the`
  - new text: `#!/usr/bin/env bash\n# ───────────────────────────────────────────────────────────────\n# COMPONENT: CHECK EXAMPLE DRIFT\n# ───────────────────────────────────────────────────────────────\n# Guard: every hand-written example keeps the template's required anchors in the`

### A4 (P1): `check-example-drift.sh` does not use full strict mode

- File: `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh:8` reads `set -uo pipefail`.
- Evidence: every other script in `runtime/cli/{spec,rules,lib}` that sets options uses `set -euo pipefail`. This one drops `-e` so that it can keep running after a failure.
- Standard: `shell-checklist.md` section 2 "Strict Mode: `set -euo pipefail`" (tiered P0).
- Fix (judgment): switch to `set -euo pipefail` and make the failure paths explicit. Line 46 needs `report="$(node ...)" || rc=$?`, with `rc=0` set first. The `[[ ... ]] && fail` and `rg -q ... && status=1` lists are already exempt from errexit. Alternatively, keep `-uo` and add a one-line WHY comment that says the guard collects every failure before it exits. Then re-run `example-drift.vitest.ts`.

### A5 (P2): three new test files have no MODULE header

- Files: `.skilled/skills/system-spec-kit/runtime/cli/tests/card-sync.vitest.ts:1`, `example-drift.vitest.ts:1` and `template-fill-guidance.vitest.ts:1`.
- Evidence: of the 193 `cli/tests/*.vitest.ts` files, these three and `typo-flags.vitest.ts` are the only ones without a `// MODULE:` header. `typo-flags` is not part of 054. The 054 tests `measured-behavior-rule.vitest.ts` and `draft-auto-repair.vitest.ts` do have the header.
- Standard: TypeScript checklist P0 "File has TypeScript module header identifying the module".
- Fix (literal): insert these three lines before line 1 of each file, with the matching name:
  ```
  // ───────────────────────────────────────────────────────────────────
  // MODULE: Card Sync Tests            (example-drift: "Example Drift Tests", template-fill-guidance: "Template Fill Guidance Tests")
  // ───────────────────────────────────────────────────────────────────
  ```

### A6 (P2): `writeRepairHint` was made public with no TSDoc, outside the module's test-export convention

- File: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1485`, `export function writeRepairHint(report: ValidationReport): void {`.
- Evidence: commit `6df0a21a0d` changed `function` to `export function` only so that `runtime/tests/repair-hint-order.vitest.ts` could call it. The module exports test-only internals through `__testables` (line 1393: "Internal helpers exported for targeted unit testing only; not part of the validation API"). The export it added has no TSDoc. `draftAutoRepairRefusal` at 1567 does have one.
- Standard: TypeScript checklist P1 "Exported functions, classes, and interfaces have TSDoc comments", and the module's own export convention.
- Fix (literal, minimum): insert above line 1485:
  `/** Prints the repair-derived.cjs --apply command when the report holds a recomputable error or warning, and nothing otherwise. */`
  Optional (judgment): move it into `__testables` and update the test import.

### A7 (P2): the MEASURED_BEHAVIOR rule copies the shared stamp parser instead of reusing it

- File: `.skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh:28-52`.
- Evidence: lines 32 and 38-39 repeat character for character the grep and sed parse in `lib/status-classifier.sh:75-78` (`speckit_carries_token_gate_stamp`), which `rules/check-placeholders.sh`, `rules/check-scaffold-never-touched.sh` and `spec/check-placeholders.sh` all source. The only differences are the threshold (v2.4 here, v2.3 there) and the spec-core source test. The TypeScript side has its own two copies: `orchestrator.ts` `carriesTokenGateStamp` and `packet-synopsis.ts` `carriesClauseCutStamp`, each with its own `TEMPLATE_STAMP_RE`.
- Standard: `shell-checklist.md` P1 "DRY: repeated command fragments extracted into reusable functions".
- Fix (judgment): add a `speckit_template_stamp <file>` helper to `lib/status-classifier.sh` that prints `source<TAB>major<TAB>minor`. Build `speckit_carries_token_gate_stamp` and `measured_behavior_applicability` on it, then re-run `measured-behavior-rule.vitest.ts` and `placeholder-token-gate.vitest.ts`.

### A8 (P2): the CLI workspace's local dist is stale for a file 054 changed

- File: `.skilled/skills/system-spec-kit/runtime/cli/dist/lib/frontmatter-migration.js` (gitignored build output).
- Evidence: `node runtime/cli/lib/dist-freshness.cjs check --package system-spec-kit/runtime/cli --entry default` prints `@spec-kit/cli dist is stale (source content differs from the attested build)`. `lib/frontmatter-migration.ts` is the only CLI source newer than the attestation (10:34 against a 07:53 build). The dist file still maps `resource-map.md` to the deleted `addons/resource-map.md.tmpl` (1 hit). Its consumers are `cli/continuity/backfill-frontmatter.ts` and `cli/tests/test-frontmatter-backfill.js`, which reads `dist/lib/frontmatter-migration.js` directly. A fresh checkout builds clean, so this affects this worktree only.
- Standard: `workflow-guardrails.md` section 4: daemon-backed CLIs run the built `dist/`, and an edited source has no runtime effect until its package rebuilds.
- Fix (literal command, after the running suites finish): `cd .skilled/skills/system-spec-kit/runtime/cli && npm run build`, then confirm that `dist-freshness.cjs check --package system-spec-kit/runtime/cli --entry default` reports fresh.

## Checked and aligned

- **Comment hygiene.** `check-comment-hygiene.sh` ran over all 46 scope code files and all weak-model code files: no findings. A manual grep of every added comment line in the weak-model diff for spec, packet, phase, task, REQ, ADR, CHK, finding, benchmark and speed-loop labels found none. The two "finding" hits are durable prose.
- **Durable WHY comments.** New comments name a constraint or invariant, not a ticket. Examples: why the orchestrator and not `validateFolder` does the repair (`orchestrator.ts`), why every read-only caller sets `SPECKIT_DRAFT_AUTO_REPAIR=0` (`repair-derived.cjs`, `upgrade-legacy.mjs`, `quality-audit.sh`, `progressive-validate.sh`, `strict-pass-freshness.ts`), and why CI and rule subsets refuse the repair. Comment density matches the surrounding files.
- **Fail-closed behavior.** `draftAutoRepairRefusal` refuses on pass, the off switch, `CI`, a `SPECKIT_RULES` subset, a run without `--strict`, a non-Draft status, any authored error and a missing repository root. A repair child that fails or is killed keeps the first report, exit 2 and the repair hint. `check-card-sync.sh` and `check-example-drift.sh` exit 2 when `rg` is missing instead of reporting success. `validate_track_value` in `create.sh` refuses absolute paths, `.`, `..` and empty segments.
- **Measured-behavior rule.** It can only report `pass` or `warn`, never `fail`, and the registry row is `severity: warn`. The registry holds 42 rules. The stamp version is compared as numbers (`10#`), with tests for v2.10 and v3.0.
- **Error handling in TypeScript.** `catch` blocks narrow `unknown`. `repairFailureReason` names the error, signal or exit code plus the first FAILED line or the last stderr line.
- **Removed add-ons.** No code, workflow or JSON under `.skilled` or `.github` still references `addons/{before-after,roadmap,resource-map}` or their `.md.tmpl` files (rg, excluding retrieval fixtures, which are data). `resource-map.md` is deliberately kept in `OPTIONAL_CONTINUITY_DOCS` for loop-written maps, with a comment that says why.
- **Tests cover changed behavior** (happy path plus edges): `measured-behavior-rule` (7 cases), `draft-auto-repair` (15, including every refusal, the child failure, `--json` and `--quiet` stream separation, recursive per-child judgment and the dry run), `repair-hint-order` (2), `placeholder-token-gate` (v2.3/v2.2 by status matrix), `create-track-containment`, `card-sync` (10), `example-drift` (6), `repo-era` (stamp floor), the clause cut in `generated-metadata-drift`, and the `validation-optional-anchors` fix-addendum case.
- **Bash 3.2 portability.** No `declare -A`, `mapfile`/`readarray`, `${x,,}`/`${x^^}`, `[[ -v`, `&>>`, `;;&` or namerefs in any of the 15 shell files. `bash -n` (macOS `/bin/bash` 3.2) is clean on all of them.
- **shellcheck `-S warning`.** The new code shows only SC2034 on the sourced rule's `RULE_*` outputs, which is the house rule contract (148 such hits across `rules/`). The other hits are older than 054: `create.sh:60` `TEMPLATE_STYLE`, `create.sh:524` SC1010 inside a word list, `upgrade-level.sh:48-50` `ADDENDUM_*`, and `spec/check-placeholders.sh:19,25`.
- **JSON.** All 15 changed JSON files parse, including `validator-registry.json`, `spec-kit-docs.json`, `leaf-manifest.json`, `leaf-aliases.json`, the level-3+ example `description.json` and both compiled-routing manifests.
- **Typecheck.** `tsc --noEmit` in `runtime/cli` printed no errors. Note that I read its output through a pipe to `tail`, so I observed the empty output and not tsc's own exit status.
- **Other CLI gates.** `check-no-mcp-lib-imports`, `check-architecture-boundaries`, `check-allowlist-expiry`, `check-source-dist-alignment`, `check-handler-cycles-ast` and `check-api-boundary.sh` all pass. Only the AST import policy fails (A1).
- **Runtime dist.** `dist-freshness.cjs check --package system-spec-kit/runtime --entry validation-orchestrator` reports `@spec-kit/runtime dist is fresh`. `dist/lib/validation/orchestrator.js` (17:00) is newer than `orchestrator.ts` (16:52) and contains the Draft auto-repair code (12 hits).
- **Naming.** Shell functions use snake_case and `local`. TypeScript uses camelCase functions, PascalCase types and SCREAMING_SNAKE constants, the same as the surrounding code.

## Not checked

- I did not run the vitest suites, because full suites were running. Test pass and fail claims come from the packet changelog, not from this audit.
- ESLint printed nothing for the changed TypeScript files. The CLI `lint` script is `tsc --noEmit`, so ESLint may not be configured for them, and that empty output is not evidence of a clean lint.
- The decommission-debt files in `scope.txt` got only mechanical checks (hygiene, typecheck, JSON, shellcheck). They had no line review, because they are not this packet's code.
