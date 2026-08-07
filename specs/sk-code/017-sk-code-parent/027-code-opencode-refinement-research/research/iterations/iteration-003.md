# Iteration 003 — verify-doctrine reality (Facet 2)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 3 findings — verify-doctrine reality

---

**[P1] workflow_verify.md is doctrinally pure but operationally empty for OPENCODE**

- `code-opencode doc:` `workflow_verify.md:53-56` teaches a generic loop: "Select the surface-appropriate command set and targeted tests from active-surface guidance. Run fresh commands and capture command names, exit codes, test counts…" — it delegates all specifics to "surface guidance" without naming a single real command, script, or exit-code contract from `.opencode`.
- `reality:` The real verification surface for `.opencode` TypeScript is multi-layered and failure-prone: `tsc -p tsconfig.build.json` (not `tsc --build`), `vitest run` inside per-package workspaces, `validate.sh --strict` with exit-code 0/1/2 semantics, `verify_alignment_drift.py --root .opencode`, the `check-dist-staleness.sh` PostToolUse guard, and `rebuild-native-modules.sh` for ABI breaks. None of these are mentioned in the verify doctrine.
- `recommendation:` Add an "OPENCODE verification reality" subsection to `workflow_verify.md` that names the actual command chain and the three trap classes below (dist-trap, det-env collisions, native ABI rebuilds). The generic ladder is fine as doctrine, but a skill called "code-opencode" should teach the OpenCode verification path, not just the abstract concept of verification.

---

**[P1] TS trio build claims are stale — `npm run build` ≠ `tsc --build` for most packages**

- `code-opencode doc:` `typescript/quality_standards.md:683` — "Build command (from skill root, e.g. `.opencode/skills/system-spec-kit/`): `npm run build # runs: tsc --build`". Line 686: "Build with pre-existing type errors: `npx tsc --build --noCheck --force`".
- `reality:` This is only true for the `system-spec-kit` ROOT (`package.json:16` — `"build": "tsc --build"`). The `system-skill-advisor/mcp_server/package.json:8` build is: `npm --prefix ../../system-spec-kit/shared run build && ../../system-spec-kit/node_modules/.bin/tsc -p tsconfig.build.json` — completely different. No real package.json anywhere uses `--noCheck`. The real typecheck pattern is `tsc --noEmit --composite false -p tsconfig.build.json` (`skill-advisor package.json:10`), not `--noCheck`.
- `reality:` The `tsconfig.build.json` pattern (which every real build uses) is entirely undocumented. `system-skill-advisor/mcp_server/tsconfig.build.json` overrides `composite: false`, `declaration: false`, `incremental: false`, and sets a distinct `include`/`exclude` surface — but the doc at `quality_standards.md:737-768` only shows `tsconfig.json` patterns with `composite: true` and project references everywhere.
- `reality:` The post-build verification table (`quality_standards.md:701-706`) claims `npm run test:cli`, `npm run start`, and `npm run test:embeddings` — these exist in `system-spec-kit/package.json:23-25` but NOT in `system-skill-advisor/mcp_server/package.json` (which only has `test: "vitest run"`).
- `recommendation:` Rewrite §10 "Build & Rebuild Workflow" to be package-aware: show the `system-spec-kit` root pattern (`tsc --build`) AND the satellite package pattern (`tsc -p tsconfig.build.json` with pre-built shared dependency). Document `tsconfig.build.json` as the standard emit-config overlay. Remove the `--noCheck` claim or verify it actually works with `--build` mode on the installed TS version.

---

**[P2] The source-vs-stale-dist trap is real, actively biting, and completely undocumented in verify doctrine**

- `code-opencode doc:` `workflow_verify.md` — no mention of `dist/`, stale builds, or daemon-restart requirements anywhere in its 150 lines.
- `reality:` This session's own startup digest shows: `STALE DIST WARNING: @spec-kit/scripts`, `@spec-kit/system-code-graph`, `design-system-extractor` — three packages whose gitignored `dist/` is behind source. The daemon serves compiled `dist/`, so source edits are invisible to the running MCP server without a rebuild + daemon restart.
- `reality:` `sk-code/code-quality/scripts/check-dist-staleness.sh` exists specifically to detect this — it shells out to `dist-freshness.cjs` (`check-dist-staleness.sh:31-34`) and prints `STALE DIST WARNING: <package> -- run: <rebuildCommand>`. The `claude-posttooluse.sh` hook calls it automatically (`claude-posttooluse.sh:90-105`). This is a known, instrumented trap that the verify doctrine fails to teach.
- `reality:` `system-spec-kit/package.json:21` — `test:root` runs `node scripts/dist/memory/generate-context.js --help` — it tests the DIST, not the source. A green `npm run test` after editing source but before `npm run build` proves nothing about the edited code.
- `recommendation:` Add a "Stale-dist trap" box to `workflow_verify.md`: "After editing `.ts` source, run `npm run build` in the owning package before any verification claim. The MCP daemon and test suites run from `dist/`, not source. A green test on stale dist is a false negative."

---

**[P2] Deterministic-env test collision pattern is widespread and undocumented**

- `code-opencode doc:` `workflow_verify.md` and `typescript/quality_standards.md` — no mention of env-var collision risks in test suites.
- `reality:` `MK_SKILL_ADVISOR_DB_DIR` is saved/restored across 15+ test files (`advisor-trust-gate.vitest.ts:25-29`, `launcher-lease.vitest.ts:214`, `skill-graph-db.vitest.ts:353-386`, `advisor-status.vitest.ts:275-287`, `launcher-bootstrap.vitest.ts:190`, etc.). The pattern is manual save-in-`beforeEach` / restore-in-`afterEach`. Any test that forgets to restore (or crashes before `afterEach`) leaks a temp DB dir into the process env, causing subsequent tests in the same vitest worker to read/write the wrong database.
- `reality:` `advisor-trust-gate.vitest.ts:25-29` manages THREE env keys (`MK_SKILL_ADVISOR_TRUST_DEFAULT`, `MK_SKILL_ADVISOR_DB_DIR`, `SYSTEM_SKILL_ADVISOR_DB_DIR`) — the dual-key fallback (`MK_SKILL_ADVISOR_DB_DIR ?? SYSTEM_SKILL_ADVISOR_DB_DIR`, seen in `skill-graph-db.ts:270` and `lease.ts:84`) means forgetting to delete the secondary key still leaks.
- `recommendation:` Add a "Det-env test discipline" note to the TS trio: "Tests that override `MK_SKILL_ADVISOR_DB_DIR` or any `SPECKIT_*` env var MUST save/restore in `beforeEach`/`afterAfter`. Run `vitest run --no-file-parallelism` if a test suspects env leakage from a prior test."

---

**[P2] Native-module ABI rebuilds exist but are invisible to the verify doctrine**

- `code-opencode doc:` `workflow_verify.md` — no mention of native modules, `better-sqlite3`, SIGBUS, or Node-version mismatch.
- `reality:` `system-spec-kit/scripts/setup/rebuild-native-modules.sh` exists specifically for this: it rebuilds `better-sqlite3` after a Node version change (lines 21-25), optionally clears the HuggingFace cache (lines 37-50), and writes a `.node-version-marker` (lines 52-56). The script's closing message (line 60): "Done! Restart the MCP server to apply changes."
- `reality:` `better-sqlite3` is a dependency of both `system-spec-kit/mcp_server` and `system-skill-advisor/mcp_server` (`skill-advisor package.json:17` — `"better-sqlite3": "^12.6.2"`). After a `nvm use` or Node upgrade, the stale `.node` binary throws `SIGBUS` / `ERR_DLOPEN_FAILED` at daemon startup. The verify doctrine gives no guidance on diagnosing this.
- `recommendation:` Add a "Native ABI failure" entry to `workflow_debug.md` escalation or `workflow_verify.md` blind spots: "If the daemon crashes on startup with `SIGBUS` or `ERR_DLOPEN_FAILED` after a Node version change, run `bash .opencode/skills/system-spec-kit/scripts/setup/rebuild-native-modules.sh` then restart the daemon."

---

**[P3] validate.sh exit-code contract is partially documented in AGENTS.md but not in the verify doctrine**

- `code-opencode doc:` `workflow_verify.md` — never names `validate.sh` or its exit codes.
- `reality:` `AGENTS.md` Completion Verification Rule documents exit 0/1/2 but the verify doctrine (the doc that's supposed to teach this) is silent. `validate.sh:8` runs `set -euo pipefail`; it sources rule files like `rules/check-comment-hygiene.sh` (the bash spec-doc checker, separate from the Python code-comment checker) and aggregates errors/warnings.
- `recommendation:` Add `validate.sh --strict` to the OPENCODE verification command chain in `workflow_verify.md` with the exit-code contract: 0=pass, 1=warnings, 2=errors (blocks completion).

---

### Council-seed closure

**Sub-claim: "the checker treats exit 2 as a benign file-skipped, so a bash-invoked Python checker silently self-suppresses the gate."**

**Verdict: CONFIRMED** (mechanism confirmed in both enforcement surfaces; severity is moderate, not critical).

Evidence:

1. **Checker exit-code definition** — `check-comment-hygiene.sh:7-10`: `0 — file is clean`, `1 — violations found`, `2 — file skipped (binary, unknown extension, or in excluded dir)`. Unknown extensions (anything other than `.ts/.tsx/.js/.mjs/.cjs/.py/.sh/.bash/.jsonc`) return exit 2 (lines 50-52).

2. **Pre-commit hook (the blocking gate)** — `.opencode/hooks/pre-commit:20-24`:
   ```bash
   CHECKER_RC=0
   "$CHECKER_PATH" "$full_path" 2>/dev/null || CHECKER_RC=$?
   if [[ $CHECKER_RC -eq 1 ]]; then
     VIOLATIONS=$((VIOLATIONS + 1))
   fi
   ```
   Only exit 1 increments `VIOLATIONS`. Exit 2 (skipped) is treated identically to exit 0 (clean). A `.json` file with an `ADR-001` reference in a comment would be silently passed.

3. **PostToolUse hook (the warning gate)** — `claude-posttooluse.sh:77`: `if result.returncode == 1 and result.stdout.strip():` — only exit 1 triggers a warning. Exit 2 produces no output.

**Refinement:** The "bash-invoked Python checker" is accurate — `check-comment-hygiene.sh` is a Python script (`#!/usr/bin/env python3`) with a `.sh` extension, bash-invoked via `set -euo pipefail` with the `|| CHECKER_RC=$?` guard. The self-suppression is by design for unparseable file types, but it means the gate has zero coverage for `.json`, `.css`, `.html`, `.yml`, `.toml`, `.md` comment hygiene. Whether that's a gap depends on whether ephemeral markers in those file types matter (they do — `.jsonc` config files with `// ADR-003` comments are covered, but `.json` files with the same are not).

---

### Used-but-undocumented (worth ADDING)

| Real pattern | Where it lives | Status in code-opencode docs |
|---|---|---|
| **Stale-dist trap** — daemon serves gitignored `dist/`; source edits need `npm run build` + daemon restart | `check-dist-staleness.sh`, `dist-freshness.cjs`, `claude-posttooluse.sh:90-105` | **Not mentioned anywhere** in workflow doctrine or TS trio |
| **`tsconfig.build.json`** — emit-config overlay with `composite: false`, separate include/exclude surface | Every real `package.json` build script references it | **Not mentioned** — doc only shows `tsconfig.json` with `composite: true` |
| **Det-env test save/restore** — `MK_SKILL_ADVISOR_DB_DIR` / `SPECKIT_*` env-var collision in vitest workers | 15+ test files, `skill-graph-db.ts:270`, `lease.ts:84` | **Not mentioned** |
| **Native ABI rebuild** — `better-sqlite3` SIGBUS after Node version change | `rebuild-native-modules.sh` | **Not mentioned** |
| **validate.sh exit codes** — 0=pass, 1=warn, 2=error (blocks `--strict`) | `validate.sh`, AGENTS.md | Mentioned in AGENTS.md but **absent from workflow_verify.md** |
| **Alignment verifier** — `verify_alignment_drift.py --root .opencode [--fail-on-warn]` | `alignment_verification_automation.md` | Documented in a shared reference but **never linked from workflow_verify.md** |
| **Pre-commit gate** — `.opencode/hooks/pre-commit` blocks exit 1 from the Python checker | `.opencode/hooks/pre-commit` | **Not mentioned** in workflow doctrine |

---

### Angles to pursue next

1. **Facet 3 — SKILL.md routing vs reality:** The code-opencode SKILL.md (and parent sk-code SKILL.md) claims specific hook paths and enforcement gates (`scripts/hooks/claude-posttooluse.sh`, `.opencode/hooks/pre-commit`, `.github/workflows/comment-hygiene.yml`). Iterations 1-2 found path discrepancies. Verify whether the CI workflow (`.github/workflows/comment-hygiene.yml`) actually exists and whether the path references in SKILL.md match the post-restructuring locations.

2. **The `.sh`-extension-on-Python-files smell:** Both `check-comment-hygiene.sh` and `claude-posttooluse.sh` are Python scripts with `.sh` extensions. This confuses `verify_alignment_drift.py` (which maps `.sh` → shell and expects `#!/usr/bin/env bash` + `set -euo pipefail`), producing false `SH-SHEBANG` / `SH-STRICT-MODE` WARNs on every scan. A prior deep-review finding flagged this (`verified-backlog.json:757`). Worth confirming whether the alignment verifier's exclusion list handles this or whether it's still emitting noise.

3. **vitest config and test-discovery reality:** The TS trio claims `npm run test` but doesn't document how vitest discovers tests across the workspace structure, the `vitest.config.ts` location per package, or the `**/*.vitest.ts` naming convention (vs `**/*.test.ts`). The `tsconfig.build.json` excludes both — worth checking if the trio's test guidance matches the real test-file conventions.

4. **`--noCheck` with `--build` mode:** Verify whether `tsc --build --noCheck --force` actually works on the installed TypeScript version (`^5.9.3` per `system-spec-kit/package.json:49`), or if it errors. If it works, the doc's claim is merely unused; if it doesn't, the doc is actively misleading.
