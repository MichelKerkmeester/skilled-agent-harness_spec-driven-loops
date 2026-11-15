# Deep Review Report - history lookup handover integration (lineage fable-medium)

## 1. Executive Summary

- **Verdict: FAIL**, on the coverage gate alone. The findings by themselves map to PASS with advisories.
- **Why the gate fails:** the coverage gate needs one stabilizing pass after all four dimensions are covered. This lineage was capped at one iteration, so coverage age is 0 and the gate cannot pass. No finding drives the FAIL.
- **hasAdvisories:** false under the workflow rule (it is true only on a PASS). Five P2 advisories are active.
- **Active findings:** P0 = 0, P1 = 0, P2 = 5.
- **Stop reason:** `maxIterationsReached` (1 of 1).
- **Scope:** the nine named commits, read with `git show`; the changelog section at `.skilled/changelog/skilled/v4.0.2.1.md:163-169`; and the three files the phase docs do not list. All four dimensions were touched once.
- **Operator review focus:** Review the work in these commits: 198162c7f11 7973b80ab0b 50c5472789e de26d18cbdf 8cd3fa79da9 f320d9d9bcd 4cb3db7a787 cede6d301ab 70c47ad5e00 (inspect each with git show), plus the section A Claimed Note Offers the Sender History added to .skilled/changelog/skilled/v4.0.2.1.md in merge commit 967a825df3a. Also cover files the phase docs do not list: .skilled/hooks/shared/session-readers/claude.mjs, .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs and .skilled/skills/system-spec-kit/runtime/tests/compaction-adapters.vitest.ts. Do not review other commits in the surrounding history.

Nothing in the target was executed. Each finding says whether it was confirmed by reading both sides of a contract or inferred.

## 2. Planning Trigger

`/speckit:plan` is not required by the findings. The five P2 items are optional follow-ups. The FAIL verdict comes from the coverage gate, which a second review pass would clear, not a remediation plan.

Planning Packet:

```json
{
  "triggered": false,
  "verdict": "FAIL",
  "verdictCause": "failed required gate: coverage (coverage age 0 at a one-iteration cap)",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:687", "title": "The mint and the lookup command look for a Claude transcript in different places when CLAUDE_CONFIG_DIR is set"},
    {"id": "R1-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/hooks/session-handover/lib/relaunch-core.cjs:984", "title": "A claim mints a locator for whatever session id the note names, without proving that session ran in the note folder"},
    {"id": "R1-P2-003", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-handover/bin/session-handover.cjs:606", "title": "The locator prepare stores has no reader"},
    {"id": "R1-P2-004", "severity": "P2", "dimension": "traceability", "file": ".skilled/changelog/skilled/v4.0.2.1.md:165", "title": "The lookup stops working 30 minutes after the claim with no way to renew it, and the changelog and the receiver step do not say so"},
    {"id": "R1-P2-005", "severity": "P2", "dimension": "maintainability", "file": ".skilled/hooks/session-handover/bin/history-lookup.mjs:32", "title": "The entry reports a broken build as a bad operation"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "title": "Make the mint and the lookup command agree on the transcript", "findings": ["R1-P2-001", "R1-P2-002"]},
    {"id": "WS-2", "title": "Decide what the prepare locator is for", "findings": ["R1-P2-003"]},
    {"id": "WS-3", "title": "State the 30 minute window where the receiver reads it", "findings": ["R1-P2-004"]},
    {"id": "WS-4", "title": "Give a broken build its own refusal", "findings": ["R1-P2-005"]}
  ],
  "specSeed": [
    "The handover mint and the lookup command resolve the Claude store the same way, including CLAUDE_CONFIG_DIR.",
    "A claim offers the lookup only for a session whose transcript sits under the project key of the note's folder.",
    "The prepare locator either has a named reader or is removed."
  ],
  "planSeed": [
    "Add a claim test that redeems the printed command through bin/history-lookup.mjs in a sandbox with CLAUDE_CONFIG_DIR set.",
    "Add a claim test with a session id whose transcript sits under another project key.",
    "Search for any reader of a handover-sourced locator before removing the prepare mint.",
    "Add the 30 minute window to the changelog section, handoff.md receiver step 3 and the sentence the claim prints."
  ],
  "findingClasses": ["producer-verifier-drift", "trust-boundary", "dead-write", "undocumented-limit", "misleading-error"],
  "affectedSurfacesSeed": [
    ".skilled/hooks/session-handover/lib/relaunch-core.cjs",
    ".skilled/hooks/session-handover/bin/session-handover.cjs",
    ".skilled/hooks/session-handover/bin/history-lookup.mjs",
    ".skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts",
    ".skilled/hooks/shared/session-readers/claude.mjs",
    ".skilled/commands/speckit/handoff.md",
    ".skilled/changelog/skilled/v4.0.2.1.md"
  ],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

All five are active, P2, first seen in iteration 1. The synthesis self-check had no P0 or P1 to re-adjudicate.

### R1-P2-001 - The mint and the lookup command look for a Claude transcript in different places when `CLAUDE_CONFIG_DIR` is set

- Dimension: correctness. File: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:687`.
- Evidence: the mint reads `$CLAUDE_CONFIG_DIR/projects` (`relaunch-core.cjs:687`, used at `:914`). The command reads `~/.claude/projects` (`cli.ts:289`, home from `homedir()` at `cli.ts:513`), and so does the reader (`claude.mjs:38`). The mint also takes the first project folder holding the id, while the command refuses two (`cli.ts:400`).
- Case: a sender started with `CLAUDE_CONFIG_DIR` set, then a claim in the same checkout. The section prints and its command answers `session_not_found`.
- Impact: the receiver is told to run a command that cannot work. It fails closed.
- Fix recommendation: resolve the store in one shared place, or have the claim redeem the locator once before printing the section.
- Disposition: active. findingClass: producer-verifier-drift.
- scopeProof: confirmed by reading both resolvers; not run. P1 if `CLAUDE_CONFIG_DIR` is a supported setup for the lookup.
- affectedSurfaceHints: `claudeSessionLogPath`, `mintHandoverLocator`, `cli.ts` `storeRootFor`, the `claude.mjs` store root, a claim test that redeems through the entry.

### R1-P2-002 - A claim mints a locator for whatever session id the note names

- Dimension: security. File: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:984`.
- Evidence: `session_id`, `runtime` and `cwd` come from the note's frontmatter. The mint searches every project folder for the id (`relaunch-core.cjs:689-692`). The only checkout test compares the note's `cwd` with the receiver's (`relaunch-core.cjs:988`). The command also lists every project folder (`cli.ts:250-262`) and the reader checks store containment and the recorded id only (`claude.mjs:219`, `:250`).
- Case: a note whose `session_id` is a session from another project on the same machine and whose `cwd` is the receiver's checkout. The command reads that other project's transcript.
- Impact: the trust anchor moved from the host's hook payload to a file in the repository. The reach needs a note writer who knows a random session UUID.
- Fix recommendation: mint only when the transcript sits under the project key of the note's folder.
- Disposition: active. findingClass: trust-boundary.
- scopeProof: confirmed by reading the mint, the command and the reader.
- affectedSurfaceHints: `mintHandoverLocator`, a project-key check, a claim test with a foreign session id.

### R1-P2-003 - The locator `prepare` stores has no reader

- Dimension: maintainability. File: `.skilled/hooks/session-handover/bin/session-handover.cjs:606`.
- Evidence: `claim` always mints again (`relaunch-core.cjs:984`) and never falls back to the stored one. The phase 003 spec gives the stored locator the purpose "so a later claim can redeem it" (`003-mint-locator-at-prepare/spec.md:38`); the phase 004 summary records that one function now covers both cases (`004-offer-lookup-at-claim/implementation-summary.md:80`).
- Case: any `prepare` by a Claude or Codex sender. The stored locator is replaced at claim and never read in between.
- Impact: each `prepare` lists every Claude project folder and writes hook state nothing reads.
- Fix recommendation: remove the `prepare` mint, or name the reader it serves.
- Disposition: active. findingClass: dead-write.
- scopeProof: inferred from the two callers and the claim path. A search for another reader of a `handover` locator would confirm it.
- affectedSurfaceHints: `prepare`, the phase 003 spec, the three `prepare` locator tests, the session handover README.

### R1-P2-004 - The lookup stops working 30 minutes after the claim and two documents do not say so

- Dimension: traceability. File: `.skilled/changelog/skilled/v4.0.2.1.md:165`.
- Evidence: the command refuses a locator older than 30 minutes (`cli.ts:37`, `:216`). A claimed note cannot be claimed again (`relaunch-core.cjs:1644`), so nothing mints a new one. The README states the window (`.skilled/hooks/session-handover/README.md:197`). The changelog section and receiver step 3 (`.skilled/commands/speckit/handoff.md:221`) do not.
- Case: a receiver that works for 45 minutes and then needs a detail the note left out. The command answers `locator_stale`.
- Impact: the live proof asked its question right after the claim, so the measured benefit holds for the first half hour only.
- Fix recommendation: state the window in both documents and in the sentence the claim prints. A renewal path is a separate decision.
- Disposition: active. findingClass: undocumented-limit.
- scopeProof: confirmed by reading the freshness check, the claim guard and both documents.
- affectedSurfaceHints: the changelog section, receiver step 3, the claim's closing sentence.

### R1-P2-005 - The entry reports a broken build as a bad operation

- Dimension: maintainability. File: `.skilled/hooks/session-handover/bin/history-lookup.mjs:32`.
- Evidence: the entry catches every import and run failure and prints `operation_invalid`, the code the command uses for malformed arguments (`cli.ts:349-351`). The offer guard only checks that the core file exists (`lookup-offer.ts:97-101`).
- Case: the compiled core exists but one of its imports is missing after a partial build. The model is told its arguments are wrong and retries.
- Impact: a wrong diagnosis for the model and for whoever reads the output.
- Fix recommendation: print a refusal code of its own for a core that cannot load.
- Disposition: active. findingClass: misleading-error.
- scopeProof: confirmed by reading the entry and the offer guard; not run against a broken build.
- affectedSurfaceHints: the entry's catch branch, the refusal code list, the entry test.

## 4. Remediation Workstreams

No P0 or P1 workstream exists. P2 advisories, in suggested order:

1. **WS-1 (R1-P2-001, R1-P2-002):** make the mint and the lookup command agree on where a transcript lives and whose it is.
2. **WS-3 (R1-P2-004):** state the 30 minute window where the receiver reads it.
3. **WS-2 (R1-P2-003):** decide what the `prepare` locator is for.
4. **WS-4 (R1-P2-005):** give a broken build its own refusal.

## 5. Spec Seed

- The handover mint and the lookup command resolve the Claude store the same way, including `CLAUDE_CONFIG_DIR`.
- A claim offers the lookup only for a session whose transcript sits under the project key of the note's folder.
- The `prepare` locator either has a named reader or is removed.
- The receiver-facing text states that the lookup works for 30 minutes after the claim.

## 6. Plan Seed

- Add a claim test that redeems the printed command through `bin/history-lookup.mjs` in a sandbox with `CLAUDE_CONFIG_DIR` set.
- Add a claim test with a session id whose transcript sits under another project key.
- Search for any reader of a `handover` locator before removing the `prepare` mint.
- Add the window to the changelog section, to `handoff.md` receiver step 3 and to the claim's closing sentence.
- Add an entry test for a core file that exists but cannot load.

## 7. Traceability Status

Core protocols:

| Protocol | Status | Evidence | Open drift |
|---|---|---|---|
| `spec_code` | pass | The parent spec's phase map matches the code for all six phases | The phase 003 purpose and the phase 004 code disagree on who reads the `prepare` locator (R1-P2-003) |
| `checklist_evidence` | partial | "3 of 3" and "0 of 6" match the summaries and the run folders exist | Test counts in the summaries were not rerun; this lineage may not run the suites |

Overlay protocols:

| Protocol | Status | Evidence | Open drift |
|---|---|---|---|
| `skill_agent` | notApplicable | No agent contract changed | - |
| `agent_cross_runtime` | partial | Claude and Codex senders get the section | Codex is covered by unit tests only, stated in the phase 006 summary and not in the changelog |
| `feature_catalog_code` | partial | Catalog pages read at stat level | Not read line by line |
| `playbook_capability` | partial | Playbook pages read at stat level | Not read line by line |

`AC_COVERAGE`: exempt. The packet is a phase parent whose only parent-level document is `spec.md`; no parent `acceptance-criteria.md` was read in this pass.

## 8. Deferred Items

- Run R1-P2-001 in a sandbox to settle whether it is P2 or P1.
- Read the catalog, playbook and README changes of f320d9d9bcd line by line.
- Read the Claude, Pi, DSH and Devin compaction adapter hunks of 8cd3fa79da9 one by one. This pass read their stat and searched for leftovers.
- A second pass to clear the coverage gate.

## Dimension Expansion Map

- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Swept directions: none. Council artifacts: none.
- Selected direction: one combined pass over all four dimensions.
- Remaining frontier: the deferred items above.

This section records breadth only and does not change the verdict.

## 9. Search Ledger

- Search coverage: producer-verifier drift, trust boundary, dead code, spec and doc drift, error reporting (each with a finding); state transition and injection (each ruled out).
- Graph coverage mode: graphless fallback. The coverage graph was not seeded or queried, because its script writes outside the lineage directory.
- Search debt: none recorded. `hasSearchDebt: false`.
- Ruled-out candidates: the reader merge swallowing a turn; a note's session id breaking out of the printed command; leftovers from the compaction removal.
- Clean search proof: see "Confirmed-Clean Surfaces" in `iterations/iteration-001.md`.

## 10. Audit Appendix

**Convergence summary.** One iteration, `newFindingsRatio` 1.0. Stop reason `maxIterationsReached`. Terminal gates: evidence pass, scope pass, coverage fail (coverage age 0, required 1).

**Coverage summary.** Dimensions 4 of 4. Files read: 19 source and doc files plus the packet docs listed in the iteration file.

**Ruled-out claims.** The adapter suite's state-path helper as a silent gap; a turn id lost by the reader merge; a stale `v4.0.2.2.md`; missing child `description.json` files.

**Workflow deviations recorded for the dispatcher.**

- `convergence.cjs` was not run. The stop decision is its first rule, the iteration cap, and the script writes outside the lineage directory.
- The coverage graph steps (`upsert.cjs`), the continuity save (`generate-context.js`) and `step_stage_artifact_dir` (a git write) were not run, for the same reason.
- Gateway record files were written under `prompts/` inside the lineage instead of the system temp folder.

**Sources reviewed.** The nine commits by `git show`; `iterations/iteration-001.md` lists every file and line range.

Cross-reference appendix:

- Core Protocols: `spec_code` pass; `checklist_evidence` partial.
- Overlay Protocols: `skill_agent` notApplicable; `agent_cross_runtime` partial; `feature_catalog_code` partial; `playbook_capability` partial.
