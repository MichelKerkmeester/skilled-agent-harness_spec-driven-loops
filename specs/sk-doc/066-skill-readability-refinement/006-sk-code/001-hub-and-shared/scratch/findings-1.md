### .skilled/skills/sk-code/README.md

- [P2] .skilled/skills/sk-code/README.md:30 | 4 | The Overview opens with `### Why This Skill Exists` and never states when to use the skill; the only trigger text is `### When To Use This Skill` in §4 at lines 95-97, so a reader who scans only the overview cannot decide whether to open the skill. | Rename line 30 to `### Purpose`; move lines 95-98 (the `### When To Use This Skill` heading, blank line, paragraph and trailing blank) to after line 35, and rename the moved heading to `### When to Use`.
- [P2] .skilled/skills/sk-code/README.md:85 | 7 | The paragraph packs five mechanisms: where an override section lives, the shared linter, the quality run's three outcomes, `commentHygiene.disableRules`, and the contract pointer. | Replace line 85 with:
  ```markdown
  A repository does that in a `## Rule overrides` section of a checklist its quality config names, and a surface does it in the checklists its declaration names.

  - Both modes read the same section through one linter, so a rule dropped for quality does not return as a review finding.
  - A quality run applies the section of every checklist it loads: a refused section or an unknown rule id is `CONFIG_INVALID`, exit 3, each accepted row is recorded in the run's decisions, and two checklists at one level that disagree make the rule unverified.
  - `commentHygiene.disableRules` in the quality config switches off named comment-hygiene rules for the runner, the pre-commit hook and the CI job together.

  The contract is [`shared/references/universal/rule-overrides.md`](./shared/references/universal/rule-overrides.md), and this framework's own house style lives in the SKILLED surface so a foreign repository does not inherit it.
  ```
- [P2] .skilled/skills/sk-code/README.md:114 | 7 | The paragraph packs three surfaces and their paths, scopes and one retention rule into one run-on sentence. | Replace line 114 with:
  ```markdown
  sk-code ships three surfaces:

  - **CI** (`.skilled/skills/sk-code/sk-code-ci/`): the GitHub Actions workflow rules and their evidence. Its references say which values (switch names, protected workflows, branches) come from the repository's own CI profile at `.skilled/skills/sk-code/sk-code-ci/repository/ci.json`.
  - **Frontend** (`.skilled/skills/sk-code/sk-code-frontend/`): stack-agnostic web practice, topic references and Figma-to-code checks.
  - **Skilled** (`.skilled/skills/sk-code/sk-code-skilled/`): the native standards for this framework's own code, so keep it.
  ```
- [P2] .skilled/skills/sk-code/README.md:171 | 7 | The paragraph runs four doctor commands and their differing checks, repairs and side effects together, so a reader looking for one command has to read all four. | Replace line 171 with:
  ```markdown
  - `/doctor:sk-code setup` runs these legs in one read-only pass, adds the derived-metadata freshness check CI runs, a provisioning precheck and a quality leg that checks the quality runner is ready, fails the route probe when it returns the legacy stub and prints one repair command for each failing leg.
  - `/doctor:sk-code quality` shows which quality config the gate reads, checks it, names the comment-hygiene rules it switches off, and when there is none it creates the quality config the `sk-code-quality` packet holds, once after you approve.
  - Outside an AI runtime, run `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs`.
  - For GitHub Actions workflows, `/doctor:ci report` lists each workflow's switch state and drift flags, and `/doctor:ci scaffold` or `/doctor:ci toggle` apply the CI surface's templates and switches after you say yes.
  ```

### .skilled/skills/sk-code/ROUTER.md

- [P2] .skilled/skills/sk-code/ROUTER.md:428 | 7 | The paragraph packs four route-time rules: no cross-surface load, asset deferral, the language slice and the UNKNOWN fallback, plus the rationale. | Replace line 428 with:
  ```markdown
  - It does not load another surface's resources.
  - It defers `assets/*` (checklists, recipes, templates) to on-demand rather than the first slice.
  - Within SKILLED it slices once more by the **detected language** (§1 sub-detection): a TypeScript task loads `sk-code-skilled/references/typescript/*` plus the language-agnostic `sk-code-skilled/references/shared/*`, not the Python, shell, config, or JavaScript folders.
  - An `UNKNOWN` surface falls back to the preamble plus the shared-tier entries its matched intents map.
  - This is what stops a routine single-surface task from pulling the full cross-surface set. The deterministic router-replay enforces the same rule, so the benchmark measures it.
  ```

### .skilled/skills/sk-code/SKILL.md

- clean

### .skilled/skills/sk-code/shared/README.md

- [P1] .skilled/skills/sk-code/shared/README.md:48 | 8 | The STRUCTURE tree is the page's file index, but it omits `scripts/lib/repository-identity.cjs` and `scripts/tests/repository-identity.test.cjs`, both committed and used by `sk-code-quality/scripts/lib/quality-config-discovery.cjs` and `quality-config-schema.cjs`. | Replace line 48 with these two lines, and insert the test line after line 50:
  ```text
      |   +-- repository-identity.cjs      # the repository a config is scoped to
      |   `-- rule-registry.cjs            # every rule id an override row may name, read from the declaring documents
          +-- repository-identity.test.cjs   # node --test suite for the identity helper
  ```

### .skilled/skills/sk-code/shared/references/phase-detection.md

- [P2] .skilled/skills/sk-code/shared/references/phase-detection.md:16 | 3 | The second sentence is a pure contents pointer ("This reference names the phases, the doc that owns each one, the evidence each surface supplies and the laws no phase may skip"), so the intro never gives the reader a reason to open the file. | Replace line 16 with: `Every sk-code task that changes code moves through the same gated phases, from research to verified completion. Open it when the next move is unclear: which phase a task is in, which doctrine owns it, or what evidence ends it.`
- [P1] .skilled/skills/sk-code/shared/references/phase-detection.md:39 | 1 | The Key Sources bullet says detection "returns SKILLED or UNKNOWN", but `stack-detection.md` §1-§2 returns a declared specific surface label first, including a private `local-*` surface, and only then SKILLED or UNKNOWN; this file's own §3 line 71 acknowledges those surfaces. | Replace "It returns SKILLED or UNKNOWN and never" with "It returns a declared specific surface label, SKILLED or UNKNOWN, and never".
- [P2] .skilled/skills/sk-code/shared/references/phase-detection.md:121 | 7 | Iron law 3 is one numbered item of eight sentences that packs the UNKNOWN floor, the runner's built-in checks, the repository quality config, the override contract, the three config sources, the no-verification-command rule, the spec-folder checklist limit and the no-other-standard rule. | Replace line 121 with:
  ```markdown
  3. **No claim about an unsupported surface.** An UNKNOWN surface gets:
     - the universal floor in [code-quality-standards.md](./universal/code-quality-standards.md),
     - the quality runner's built-in checks,
     - the checks and checklists the repository's quality config names,
     - each with its overrides applied under [rule-overrides.md](./universal/rule-overrides.md).

     That config can come from `--config`, the git config key `skcode.qualityConfig` or `repository/quality.json` in the `sk-code-quality` packet, and it never supplies a verification command, so the command set still comes from [workflow-verify.md](./workflow-verify.md), which asks for it. The spec-folder authoring checklist applies only where the SKILLED surface resolves. No other standard and no discovered command applies.
  ```

### .skilled/skills/sk-code/shared/references/stack-detection.md

- [P2] .skilled/skills/sk-code/shared/references/stack-detection.md:112 | 7 | The bullet packs the accepted key, the error code, five distinct failure conditions and the blank-marker rule into one comma chain, so a reader checking a block cannot scan the conditions. | Replace line 112 with:
  ```markdown
  - The skill-root metadata check, `ci-skill-root-metadata.cjs`, accepts `surface_detection` as an optional top-level key and checks its fields. It fails with `GRAPH_METADATA_INVALID_SURFACE_DETECTION`, one finding per broken rule, when:
    - the value is not a JSON object,
    - the `label` is missing or blank,
    - the `role` is anything but `specific`,
    - none of `pathMarkers`, `fileMarkers` and `contentMarkers` is a non-empty array, or
    - one of those three is present but is not an array of strings.

    A marker must not be blank: one made only of spaces or tabs fails, because it would match nearly every path or request.
  ```

### .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md

- [P2] .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:93 | 7 | The Mechanical Floor paragraph packs the three P0 faults, the runner's parse checks and their language loaders, the YAML/TOML parser-availability fallback, the conflict/credential checks and the out-of-scope parse rule into one block. | Replace line 93 with:
  ```markdown
  Three faults are P0 on every surface, because no other check can be trusted on a file that has one.

  - The quality runner's built-in checks detect a parse failure in JSON, in JavaScript through both its CommonJS and ESM loaders, in Python, in shell, in YAML and in TOML.
  - The YAML check parses through PyYAML and the TOML check through `tomllib`, and each runs only when the `python3` in use imports its parser. When one cannot, that check reads `SKIPPED_ABSENT` with a `repair` naming what to install, and the run stays verified because neither check is required.
  - They also detect the conflict markers and the credential signature over every readable text file.
  - A parse check for any language outside that list stays with the surface checklist or a configured `syntax-*` check, so no surface restates what the runner already covers.
  ```

### .skilled/skills/sk-code/shared/references/universal/rule-overrides.md

- [P2] .skilled/skills/sk-code/shared/references/universal/rule-overrides.md:27 | 4 | The Overview goes from Purpose straight to Core Principle and has no When to Use, so the overview never says when the contract applies. | Insert after line 25, before `### Core Principle` at line 27:
  ```markdown
  ### When to Use

  - A repository or surface needs to drop or replace a rule outside the hard floor.
  - A checklist needs a `## Rule overrides` section, or a mode needs to know how one is read and recorded.
  ```
- [P2] .skilled/skills/sk-code/shared/references/universal/rule-overrides.md:33 | 7 | The Scope paragraph packs what the file defines, the two modes' adoption, the review record, the quality runner's read/apply/explain path, the registry source, the `commentHygiene` half and the no-statement behavior into one block. | Replace line 33 with:
  ```markdown
  This file defines the format, the ids, the floor, the precedence and how an applied override is recorded.

  - The quality and review modes adopt it in their own contracts.
  - The review mode applies the rows it reads and records them on its `Rule sources` line.
  - The quality runner reads the section of every checklist it loads through the same linter, applies and records the rows as section 7 describes, and shows the parsed rows and the conflicts in its explain output.
  - Its registry of known rule ids is read from the documents that declare them, and `commentHygiene.disableRules` carries the machine-checked half.
  - A mode that does not state that it reads overrides behaves as before.
  ```
