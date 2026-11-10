---
title: "Iteration 3: Residue classes — what a transport removal actually leaves behind"
trigger_phrases: []
---
# Iteration 3: Residue classes — what a transport removal actually leaves behind

## Focus

Q2: the classes of residue a transport removal leaves beyond obvious name references — each grounded in something present in this packet, each surviving hit bucketed historical-record vs live-instruction-surface, and the class the phase-007 sweep would have missed.

## Actions Taken

1. Read `007-docs-and-residue-sweep/spec.md` for the declared sweep scope and exemption classes; `008-verification-and-closeout/acceptance-criteria.md` for the measured closure (AC-007: 87 → 0 live, 24 historical by design) and its closure statement's two conscious leftovers.
2. Re-derived the residue map from the archived `009` review report's twelve finding classes and verified current tree state for each named file.
3. Ran live `git grep` counts over the current worktree to bucket the surviving `mcp-server` hits; verified the regenerated trigger index, `.github/` workflows, `.gitignore`, doctor surfaces, and playbook evidence blocks.

## Findings — the residue taxonomy, grounded in this packet

**C1. Assertion residue: claims that name neither retired token.** Surfaces asserting the transport exists in wording containing neither a tool id nor the old path: "the only MCP daemon this repository still runs" (spec-kit `ARCHITECTURE.md:157`), "MCP remains the primary in-session transport" (`daemon-cli-reference.md:17`), the doctor script enumerating `system_skill_advisor` as an MCP server (`mcp-doctor.sh:59`), `.pi/SYNC.md:29` claiming `mcp.json` "Registers system_skill_advisor". **This is the class the existing sweep missed** — the goal log records it directly: "The sweep searched for the advisor's retired tool ids and its old directory name. What survived asserts the advisor is an MCP server in wording containing neither." All four examples are now corrected (verified on the current tree: SYNC.md:29 now reads "The advisor is not an MCP server"; `.opencode/skills/system-spec-kit/references/cli/daemon-cli-reference.md:164` now reads "There is no MCP server to fall back to"). [SOURCE: file:specs/.../025/goal.md:144] [SOURCE: file:009 review report F002/F005/F008/F009] [SOURCE: command:`rg` on the four files — current wording verified]

**C2. Corpus-outside path residue: the sweep boundary itself.** Phase 008's path count found 87 live files still naming `system-skill-advisor/mcp-server` after phase 007 reported zero — they lived outside the swept corpus. The sharpest slice: four GitHub Actions workflows and `.gitignore` still pointed at the old directory, one as a `working-directory` that no longer exists — "CI would have failed on this branch… Neither audit loop looked under `.github/`." Verified current: `routing-registry-drift.yml` now uses `working-directory: .opencode/skills/system-skill-advisor/runtime` (lines 103, 187, 199, 216); `.gitignore` keeps only the generic wildcard `skills/*/mcp-server/database/` which still applies because `mcp-code-mode/mcp-server` still exists. [SOURCE: file:specs/.../025/goal.md:145] [SOURCE: command:`git grep -n runtime .github/workflows/routing-registry-drift.yml`] [SOURCE: command:`ls -d .opencode/skills/*/mcp-server` → `mcp-code-mode` only]

**C3. Printed-command residue: instructions that fail when run.** Doc surfaces that print commands which cannot succeed: `cd {skill_dir}/mcp-server && npm install`, `entry_point: "mcp-server/dist/index.js"` (F001, doctor-mcp-install.yaml:114-120), a build command against the deleted directory (F008, daemon-cli-reference.md:126), a nonexistent CLI dist path (F012, bin/README.md:100). Worse than a wrong claim — it errors on execution, on the operator's machine. Verified fixed: the remaining `mcp-server` strings in those files are the generic `{skill_dir}` template for skills that still ship one (mcp-code-mode), and `bin/README.md:171` now reads "registers no MCP server." [SOURCE: file:009 review report F001/F008/F012] [SOURCE: command:`rg -n mcp-server` on the three files — remaining hits verified generic]

**C4. Diagnostic residue: checks that can never pass again.** `mcp-doctor.sh` checked three configs for a declaration that was deliberately deleted — a health route that "can never report a healthy advisor" and mislabels it MCP (F002). A self-check asserting the old world produces a permanent false negative, which is worse than no check: it manufactures a failure signal. Verified: no `skill_advisor` enumeration remains in the doctor script or the two doctor assets. [SOURCE: file:009 review report F002] [SOURCE: command:`rg -n skill_advisor` on the three doctor files → zero]

**C5. Test and fixture residue.** A dual-client test whose fake daemon still spoke the MCP handshake; a launcher test reading the trust default from the deleted config block; a redaction test asserting a bridge path; 26 tests of the deleted plugin bridge; 3 contract tests inverted to assert absence; frozen parity inputs carrying an invalid `queryType` ("the second time this file has carried a wrong argument shape"); a retrieval fixture carrying a retired tool id as a phrase — "data, not a caller"; the `mcp-diagnostics-stress.vitest.ts` filename on a suite no default run executes (F014, still present — deferred as possibly manual-only). [SOURCE: command:`git show 9015d00c79`] [SOURCE: command:`git show 91fd9b6226`] [SOURCE: command:`git show 127aef03e7`] [SOURCE: command:`ls runtime/stress-test/skill-advisor/` → file present]

**C6. Name-outlived-referent in live code — including residue kept on purpose.** `mcpServerDir` at `skill-advisor.cjs:22` still names the retired directory while resolving `runtime/dist/runtime/skill-advisor-cli.js` (functional; 009 scope-noted under F012). `MCPCallerContext` was renamed to `CallerContext`, leaving the comment "Only 'stdio' is ever produced. The retired transport's other kinds were never assigned and cannot be now" (`caller-context.ts:9-10`). The plugin's `SYSTEM_SKILL_ADVISOR_BRIDGE_TIMEOUT_MS`, `bridge_timeout_ms`, `last_bridge_status`, `bridge_invocations` were *consciously left*: renaming an operator-set env var is itself an operator-visible change D2 forbids — residue that is correct to keep (008 closure statement). [SOURCE: file:.opencode/bin/skill-advisor.cjs:22] [SOURCE: file:runtime/lib/context/caller-context.ts:6-10] [SOURCE: file:.opencode/plugins/system-skill-advisor.js:374,1456-1462] [SOURCE: file:008-verification-and-closeout/acceptance-criteria.md:91-97]

**C7. Generated-artifact residue.** The committed trigger index carried stale paths into the renamed directories until regenerated (`f5c55c7eb8` "regenerate the trigger index after the advisor rename") — a generated artifact has to be regenerated, not edited; hand-editing corrupts it. Verified: the current index's 56 `mcp-server` hits are all other skills'/specs' (mcp-server-dir-and-manifest-closure, mcp-servers feature docs); zero for `system-skill-advisor/mcp-server`. Same class: `dist/` outputs — the launcher resolves `runtime/dist/runtime/advisor-server.js`, so a rename invalidates every recorded build-output path at once. [SOURCE: command:`git log -- trigger-index.json`] [SOURCE: command:`rg` counts on the index] [SOURCE: file:.opencode/bin/skill-advisor.cjs:23]

**C8. Evidence residue — the class where fixing is falsification.** Changelogs were rewritten to say `runtime/` where they recorded `mcp-server/`, then restored: "Those files record what was true when written; changing them is falsification, not an update" (`afd10f291f`). Same bucket: dated benchmark reports, frozen fixtures, the playbook's prepended run records ("`advisor_recommend(...)` via MCP returned:" under an `### Evidence` heading with a 2026-07-03 timestamp — a record of a past observation, not a live instruction). The correct action on this class is inaction; a sweep that edits it *creates* the damage. Verified current: all 820 `system-skill-advisor/mcp-server` hits live under `specs/`, `changelog/`, or `benchmark/reports/` — zero in live surfaces, matching AC-007's "24 historical files keep the old name by design" on the non-specs tree. [SOURCE: command:`git show afd10f291f`] [SOURCE: file:manual-testing-playbook/auto-indexing/sanitizer-boundaries.md:73-110] [SOURCE: command:`git grep -l system-skill-advisor/mcp-server` bucketed by directory] [SOURCE: file:008 acceptance-criteria.md:63]

**C9. Negative-guard residue — references that must keep the name.** `skill-advisor-route-contract.test.cjs:142` asserts `!read(docPath).includes('mcp__system_skill_advisor__')` — the retired id kept in the test precisely to guard its absence; the three inverted contract tests do the same. Phase 007's own sweep rules list this class as exempt. [SOURCE: file:.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs:142] [SOURCE: file:007-docs-and-residue-sweep/spec.md:174-176]

**C10. Packet-record residue — the record rots with the work.** Unfilled implementation-summary scaffolds claiming "Not started" inside completed phases (004, 005); phase 007's limitation block stale against the tree it describes (F016, claiming 4 red tests and 2 bridge suites that no longer exist); retired-coverage accounting living only in commit `9015d00c79` rather than the packet (F017); phase-map placeholder rows. The documents that describe the sweep were themselves residue. [SOURCE: file:004/005 implementation-summary.md:51] [SOURCE: file:009 review report F015-F017]

**C11. Retrieval-vocabulary residue.** Live catalog docs carry trigger phrases naming the old transport: `"mcp recommend tool"` on `feature-catalog/cli-surface/advisor-recommend.md:6` (also advisor-status, advisor-validate). Bucket: live instruction surface — but arguably intentional, since trigger phrases index the *asker's* vocabulary, not the system's state: a user still asking for "the mcp recommend tool" should land on the CLI doc. Whether it was a written preserve decision or inertia is not recorded — **hypothesis**: deliberate, consistent with the catalog overlay's "written preserve decision" note in the 009 report. [SOURCE: file:feature-catalog/cli-surface/advisor-recommend.md:6] [SOURCE: file:009 review report traceability table]

## The bucketing rule this packet converged on

A hit is **historical** when it records what was true when written — changelogs, dated benchmark reports, frozen fixtures, prepended run records, this packet's own documents — and **live** when it instructs a reader or a tool about the current tree. The sweep's correct actions differ by bucket: live surfaces get rewritten; historical records get *left*; negative guards get *kept*; generated artifacts get *regenerated*. Phase 007's failure was treating the sweep as one string query over one bucket.

## Which class the existing sweep missed

Two, in different directions. **C1 (assertion residue)** — semantically below the token query; the review found eight surfaces "by hunting claims instead of tokens" (goal.md:144). **C2's CI slice** — spatially outside every swept corpus; `.github/` was looked at by neither the sweep nor the audit loop, and it contained a `working-directory` that no longer resolved, i.e. the residue class that *executes*. [SOURCE: file:goal.md:144-145]

## Questions Answered

- Q2: eleven residue classes, each grounded in a file or command output from this packet; bucketing rule stated; the missed classes named (claims, and CI wiring).

## Questions Remaining

- Q3: the ordered checklist — next iteration assembles it from the latent-failure mechanisms (iter 2) and this taxonomy.

## Ruled Out

- Treating every `mcp-server` string as residue: disproved by C6 (kept-by-constraint), C8 (kept-by-truthfulness), C9 (kept-by-guard) — the count of hits is not the count of residue.

## Dead Ends

- None; the taxonomy cross-checked cleanly against both the 009 finding classes and the live tree.

## Edge Cases

- `mcp-doctor.sh`'s remaining `mcp-server` strings serve skills that still ship one (mcp-code-mode) — generic template paths, not advisor residue. Blind substitution would have rewritten them (afd10f291f names cli-devin's doc surface as the same hazard). [SOURCE: command:`rg` verified] [SOURCE: command:`git show afd10f291f`]
- `.gitignore`'s wildcard is generic and still matches a real directory shape — not residue. [SOURCE: command:`ls -d .opencode/skills/*/mcp-server`]

## Sources Consulted

- specs/.../025/007-docs-and-residue-sweep/spec.md
- specs/.../025/008-verification-and-closeout/acceptance-criteria.md
- specs/.../025/009-deep-review-decommission/review/_archive/.../deepseek-review/review-report.md
- specs/.../025/goal.md
- git show: 127aef03e7, afd10f291f, 9015d00c79, 3feab865ea, 91fd9b6226
- Live greps: `git grep -l system-skill-advisor/mcp-server` (bucketed), doctor surfaces, .github workflows, .gitignore, trigger-index.json, route-contract test, plugin, caller-context.ts, catalog frontmatter, playbook evidence blocks

## Assessment

- New information ratio: 0.85
- Novelty justification: The taxonomy is new as a structure (eleven classes with a bucketing rule); most members existed as scattered packet records and are now unified and individually re-verified against the live tree.
- Confidence: high on classes C1–C10; the intentionality half of C11 is labeled hypothesis.

## Reflection

- What worked and why: pairing each 009 finding class with a live-tree re-check — it separated "closed residue" from "kept-by-design residue" and produced the C6/C8/C9 distinction a pure doc read would miss.
- What did not work and why: nothing material.
- What I would do differently: run the bucketed `git grep` earlier — it is the fastest map of what survived.

## Recommended Next Focus

Iteration 4: assemble the ordered checklist (Q3) — interleave the four hiding-mechanism families (iter 2) with the residue taxonomy (iter 3), ordered so the steps preventing the most expensive failures come first; verify each step against a packet episode.
