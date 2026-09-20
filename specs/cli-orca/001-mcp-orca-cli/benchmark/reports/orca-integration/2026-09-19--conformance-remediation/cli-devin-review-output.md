

File inventory matches the review scope: README, 4 references, root playbook, and 10 scenario files across 6 categories. Now reading the README.

README read. Now scanning all files for banned prose forms (em dashes, semicolons, Oxford commas, buzzwords) programmatically, and reading the four references.

Em dashes appear only in SKILL.md (outside scope). Semicolons appear in 10 scenario files. No buzzwords found. Now reading the four references.

Two references read cleanly so far. Reading the remaining two.

All four references look well-formed. Now reading the root playbook and its scenario files.

Root playbook conforms. Now reading all 10 scenario files.

ORCA-001 and ORCA-002 conform structurally. Reading the remaining eight scenarios.







All 16 scoped files read. Final check: Oxford comma patterns across the scoped files.

Checking the truncated portion of the Oxford comma results to confirm README/references coverage.

Review complete. All 16 scoped files read and cross-checked; banned-form greps run across the whole packet.

## Per-file verdicts

| File | Verdict |
|---|---|
| README.md | PASS |
| references/orca-cli-reference.md | PASS |
| references/session-and-runtime.md | PASS |
| references/mutation-and-browser-boundaries.md | PASS |
| references/troubleshooting.md | PASS |
| manual-testing-playbook/manual-testing-playbook.md | PASS |
| discovery/resolve-executable.md | PASS |
| discovery/load-version-matched-guide.md | PASS |
| recovery/missing-executable-fail-closed.md | PASS |
| recovery/stopped-runtime-recovery.md | PASS |
| mutation/disposable-worktree-terminal-probe.md | PASS |
| mutation/terminal-receipt-recovery.md | PASS |
| browser/worktree-tab-snapshot-loop.md | PASS |
| publishing/share-permission-denial.md | PASS |
| routing-boundary/sibling-browser-ownership.md | PASS |
| routing-boundary/openorca-defer.md | PASS |

## Findings

No P0 (contract violation) or P1 (template deviation) findings. P2 polish items:

- **P2** — README.md line 18: the one-line blockquote pitch names the tool ("Orca CLI") before the outcome clause; reorder so the outcome leads, e.g. "Operate Orca-managed state without guessing flags or weakening mutation boundaries by using the version-matched Orca CLI guide."
- **P2** — All 10 scenario files (Expected Signals bullet, Pass/Fail Criteria bullet, and contract-table row in each, 30 instances total): semicolons in prose sentences, inconsistent with the packet's HVR-clean standard even though the scenario-file contract scope did not ban them; replace with periods or restructure into separate clauses.
- **P2** — Oxford commas in scenario-file prose: stopped-runtime-recovery.md:52 ("fails specifically, and the recovery path"); terminal-receipt-recovery.md:28 and the prompt string at lines 25/42/73 ("receipt stage, and if delivery"); disposable-worktree-terminal-probe.md:28 ("addresses, and the independent"); load-version-matched-guide.md:28 ("exit status, and the recorded"); missing-executable-fail-closed.md:28 ("result, and the reported"); share-permission-denial.md:12 and 28 ("not retried, and leaves" / "denial code, and the redaction") — remove the comma before "and" in each.
- **P2** — mutation/disposable-worktree-terminal-probe.md title and Feature Name promise "worktree or terminal" but the scenario executes only the worktree path (ORCA-007 owns terminals); either narrow the title to the worktree probe or add the terminal variant.
- **P2 (out-of-scope note)** — SKILL.md uses em dashes and Oxford commas throughout (43 instances); not in this review's scope, but it diverges from the leaf's HVR-clean standard if that standard is meant packet-wide.

## Factual coherence

All five checks pass. The CLI-only backend claim is consistent across README.md:30/88, orca-cli-reference.md §7, session-and-runtime.md §7, and troubleshooting.md's MCP-route row. Executable resolution order (`ORCA_CLI_COMMAND` → `orca-dev` → `orca-ide` → `orca`) matches between orca-cli-reference §2 and session-and-runtime §2, and ORCA-003's isolated-PATH precondition names the same candidates. The archive-hook gate (`worktree_archive_hook_failed`, `--force` never bypasses, override valid only with `--run-hooks`) is identical across orca-cli-reference §4, mutation-and-browser-boundaries §3, troubleshooting, and ORCA-005. Terminal-receipt semantics (`input_accepted` vs `turn_started`, `--wait-submit` no-resend, retry-request replay, `unverifiable` bulk close) agree across orca-cli-reference §5, session-and-runtime §6, troubleshooting, and ORCA-007. Browser ownership (Orca = worktree-scoped embedded tabs; `mcp-chrome-devtools` = CDP; `mcp-aside-devtools` = generic agentic) agrees across README §4, mutation-and-browser-boundaries §5, and ORCA-009.

## Overall verdict

The mcp-orca-cli leaf packet fully conforms to the reviewed contracts: the README follows the numbered ALL-CAPS H2 model with dividers, a four-row AT A GLANCE first section, a problem-first overview, and HVR-clean prose; all four references carry complete frontmatter with 3-8 lowercase multi-word trigger phrases, two-sentence header-free intros, a `## 1. OVERVIEW`, ascending numbered ALL-CAPS H2s, dividers, and clean prose; the root playbook delivers the four required sections, a 10-link by-category directory with consistent counts, and the `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker; and all ten scenario files carry the nine-field SCENARIO CONTRACT, TEST EXECUTION section, 9-column table, SOURCE FILES, and SOURCE METADATA with dividers. The five factual-coherence claims are mutually consistent across the README and all four references. The only deviations are P2-level polish: semicolons and Oxford commas in scenario-file prose and table cells, a tool-name-first README pitch, an over-broad ORCA-005 title, and an out-of-scope HVR inconsistency in SKILL.md. No P0 or P1 findings; the packet is release-clean pending the listed polish.
