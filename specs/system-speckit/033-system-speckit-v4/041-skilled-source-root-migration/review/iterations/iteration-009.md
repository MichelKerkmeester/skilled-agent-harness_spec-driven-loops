# Iteration 009: Test coverage of what changed

**Executor.** gpt-5.6-luna, reasoning max, service tier fast, read-only sandbox.

## COV-001 Per-entry compatibility layout is not tested

- **Severity:** P1
- **File:** `.skilled/bin/mcp-code-mode-launcher.test.cjs:180`
- **Trigger:** Run the existing layout tests with `.opencode` as one whole-directory symlink, or with missing per-entry/plugin links.
- **Consequence:** Tests pass while the shipped compatibility directory is malformed, plugin SDK resolution fails, or runtime-owned files are linked incorrectly.
- **Evidence:** The fixture only models `today`, `skilled-only`, and `whole-link`; line 201 creates `.opencode -> .skilled`. `package-root-parity.vitest.ts:46-58` repeats this model. The current manifest requires a real `.opencode` directory with per-entry links and runtime-owned exceptions at `.opencode/SYNC.md:8,29-39`.
- **Fix:** Add a fixture for a real `.opencode` directory with relative per-entry links, real `plugins/`, `package.json` and `node_modules`, then assert `lstat`, `readlink`, launcher loading and plugin SDK resolution.

## COV-002 Migrated installers lack a self-contained smoke test

- **Severity:** P1
- **File:** `.skilled/skills/mcp-tooling/mcp-chrome-devtools/scripts/install.sh:9`
- **Trigger:** Run the installer from an isolated checkout where the retired `.opencode/install-guides` directory is absent.
- **Consequence:** A missing local helper or stale command name can ship unnoticed. The help still advertises deleted `install-chrome-devtools.sh` commands at lines 9, 72, 75 and 78.
- **Evidence:** The installer now sources its sibling helper at lines 24-25, and the Code Mode installer does the same at `.skilled/skills/mcp-code-mode/scripts/install.sh:30-31`. No installer-specific test exists under either package.
- **Fix:** Add a parameterized smoke test that copies each package to a clean temporary checkout, runs `install.sh --help`, verifies exit 0, verifies the sibling helper loads and rejects the deleted installer name.

## COV-003 Duplicated installer helpers have no drift guard

- **Severity:** P2
- **File:** `.skilled/skills/mcp-code-mode/scripts/_utils.sh:1`
- **Trigger:** Change one copied `_utils.sh` without changing the other.
- **Consequence:** The two self-contained installers can silently acquire different validation, logging or error behavior.
- **Evidence:** The migration copied the former central helper into both package paths. Both files are currently 871 lines and `cmp` returned exit 0, but no test checks that relationship.
- **Fix:** Add a CI parity check for the two helpers, plus the installer smoke test from COV-002.

## COV-004 Retired authoring mode has no negative contract test

- **Severity:** P2
- **File:** `.skilled/skills/sk-doc/sk-create-readme/SKILL.md:29`
- **Trigger:** Reintroduce an `install_guide` route, alias, template reference or central output path in the active packet metadata.
- **Consequence:** The retired authoring mode can regress silently. The packet changelog still advertises that mode at `changelog/v1.0.0.0.md:6-19`.
- **Evidence:** The active skill now says it owns README authoring only, and `mode-registry.json:86-114` has no install-guide alias. However, `test_validator.py:80-85` only proves that the generic validator accepts an `install_guide` document. It does not test routing retirement or stale packet references.
- **Fix:** Add a negative contract test covering the active skill, registry, hub router, command manifest and retired central paths, while explicitly allowing generic validation of surviving per-skill guides.

## COV-005 Surviving install guides are not validated as a repository corpus

- **Severity:** P1
- **File:** `.skilled/skills/sk-doc/scripts/tests/test_validator.py:28`
- **Trigger:** Move or edit a real `INSTALL-GUIDE.md` without updating its required sections.
- **Consequence:** Three shipped guides currently fail validation without the test suite reporting it: `mcp-mobbin`, `mcp-refero` and `sk-design-md-generator`.
- **Evidence:** The test uses synthetic fixture files, including `valid-install-guide.md` at lines 80-85. A direct sweep of all 11 repository guides exited 1, with those three files reporting blocking missing-section errors.
- **Fix:** Add a repository-corpus test that enumerates `.skilled/**/INSTALL-GUIDE.md` and validates every file with `--type install_guide`.
