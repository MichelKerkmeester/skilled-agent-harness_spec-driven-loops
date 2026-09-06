# Confirmed findings: code versus the sk-code standards

Reproduced in the orchestrating session on 2026-09-06 by opening every cited code line and standard clause, with ripgrep for consumers and shellcheck for the shell rows. The remediation child is `028-header-tags-hook-catch-and-script-test-fixes`.

## Mechanical

| ID | Sev | Code | Standard | Actual | Verdict |
|----|-----|------|----------|--------|---------|
| F1.2 | P2 | `runtime/cli/spec/recommend-level.sh:3` and two siblings | shell style guide §2 header tag | `# SPEC-KIT:` on 3 scripts, `# SPECKIT:` on 8 | Confirmed |
| F1.1 | P1 | `runtime/cli/rules/*.sh:3` | shell style guide §2 `# COMPONENT:` | `# RULE:` on 27 of 28 rule scripts; no code reads the tag | Confirmed |
| F9.2 | P2 | 7 `.mjs`/`.cjs` entry points | TypeScript style guide §2 `// MODULE:` | `// SCRIPT:` on 7 files, `// MODULE:` on 26 | Confirmed |
| F2.2 | P2 | `runtime/cli/utils/memory-frontmatter.ts` | imports-and-exports §3 | Barrel with zero importers | Confirmed |
| F5.3 | P2 | `shared/embeddings.ts:3` | comment hygiene | Feature-catalog pointer kept alive by a hygiene marker | Confirmed |

## Judgment

| ID | Sev | Code | Actual | Decision |
|----|-----|------|--------|----------|
| F3.1 | P1 | `runtime/hooks/cursor/completion-evidence-response.mjs:65` | `main().catch(() => {})` swallows every failure | Log to stderr, stay fail-open |
| F2.1 | P1 | `runtime/cli/lib/frontmatter-migration.ts:386,473,606` | Own fence detection beside the shared parser | Keep, and state the reason in the module header: it classifies legacy shapes the strict parser rejects |
| F7.1 | P1 | `runtime/cli/spec/quality-audit.sh` | No test | Add a vitest with a happy path and an edge case |
| F7.2 | P1 | `runtime/cli/spec/calculate-completeness.sh` | No test | Add a vitest with a happy path and an edge case |
| F10.1 | P1 | four `findRepoRoot` implementations | Different stop conditions in each | Deferred: consolidating a root resolver changes behavior in a security-adjacent primitive and needs its own tests; recorded as follow-up |
| F3.2 | P2 | `runtime/cli/doctor.sh:43,51`, `validate-command-tree-parity.sh:34` | Exit codes 20, 26, 64 | No change: the codes are documented in the script header and 64 is the sysexits usage code |
| F6.2 | P2 | 27 `test-*` files in `runtime/cli/tests` | Legacy node-run suites | No change: wired by the package scripts, not a vitest glob |

## Dropped

| ID | Reason |
|----|--------|
| F5.1 | `shared/ipc/socket-server.ts` is consumed through the package export by the skill-advisor daemon; not dead |
| F5.2 | `runtime/cli/lib/embeddings.ts` is imported by `runtime/cli/core/workflow.ts:56` |
| F8.2 | shellcheck reports no SC2164 on the three files because `set -e` is active |
| F4.3, F6.1, F8.1, F10.3 | Conventions the standard does not forbid: a test-enforced boundary, frontmatter key mirrors, an `eval` over `printf %q` output, a per-call root option |
