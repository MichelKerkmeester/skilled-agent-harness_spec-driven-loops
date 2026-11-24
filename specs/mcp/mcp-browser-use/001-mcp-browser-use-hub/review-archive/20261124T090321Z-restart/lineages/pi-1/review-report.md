# Deep Review Report — pi-1 lineage

> Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder) · Lineage: `pi-1` · Session: `fanout-pi-1-1795504079797-ay97sx` · Generation 3 · Iterations: 5 · Stop: converged

---

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: false** (the verdict is not PASS, so the advisory flag does not apply)
- **Counts the verdict used: P0 = 0, P1 = 2, P2 = 5** (7 active findings, 0 resolved)
- **Self-check outcomes:** every landed finding was re-read against HEAD in iteration 5. None was downgraded or withdrawn. The two P1s each survived an explicit counter-evidence pass: `pi1-I1-P1-001` rests on an operator-approved anchor design and was kept because the shipped changelog promise is broader than the implementation; `pi1-I2-P1-001` was kept because the phase's own blanket claim covers the guide it contradicts.
- **Review scope:** the 507 repo-relative files bound by `review-scope-files.txt`, swept across four dimensions plus a cross-reference pass — the hub's three mode packets, the advisor scorer change from commit `dbea9ff4a25`, the compiled-routing activation, the installers and their tests, the packet's fourteen phase folders and the phase 014 fix set.
- **Operator review focus:** every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.

Two P1 findings keep the verdict at CONDITIONAL. Neither is a security hole or a broken route: one is a routing-precision hole that lets an ordinary English noun lift an unrelated skill to the 0.82 confidence floor, the other is a documentation path that teaches an unpinned registration fetch the phase claims no longer exists. Five P2s record evidence sentences that overstate what their commands print, an ungated npx launch that the packet gates elsewhere, two packets whose derived status never followed their docs, and two duplication costs that will cause the next drift.

---

## 2. Planning Trigger

`/speckit:plan` is required: two P1 findings and five P2 findings need a remediation phase. Every finding is fixable in place without a new package, a live browser run or a network fetch.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "id": "pi1-I1-P1-001", "severity": "P1", "findingClass": "routing_precision", "file": ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332" },
    { "id": "pi1-I2-P1-001", "severity": "P1", "findingClass": "doc_code_parity", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361" },
    { "id": "pi1-I1-P2-001", "severity": "P2", "findingClass": "evidence_integrity", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:103" },
    { "id": "pi1-I2-P2-001", "severity": "P2", "findingClass": "config_precedence", "file": ".utcp_config.json:56" },
    { "id": "pi1-I3-P2-001", "severity": "P2", "findingClass": "doc_code_parity", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:54" },
    { "id": "pi1-I4-P2-001", "severity": "P2", "findingClass": "config_precedence", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:21" },
    { "id": "pi1-I4-P2-002", "severity": "P2", "findingClass": "doc_code_parity", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361" }
  ],
  "remediationWorkstreams": [
    "W1 — advisor anchor precision (pi1-I1-P1-001)",
    "W2 — one pinned registration authority in the Chrome packet (pi1-I2-P1-001, pi1-I4-P2-002)",
    "W3 — evidence sentences that match their commands (pi1-I1-P2-001, pi1-I3-P2-001)",
    "W4 — one pin authority and one launch gate (pi1-I4-P2-001, pi1-I2-P2-001)"
  ],
  "specSeed": "Phase 015 in this packet: close the two P1s and the five P2s of the pi-1 deep review, each at its source, with the fix lanes owning disjoint files.",
  "planSeed": "Seven tasks, one per finding, ordered P1 first; each task names the file it owns, the command that proves the fix and the doc sentence it must correct in the same change.",
  "findingClasses": ["routing_precision", "doc_code_parity", "evidence_integrity", "config_precedence"],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md",
    ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/assets/utcp-chrome-devtools-manuals.md",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh",
    ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh",
    ".skilled/bin/tests/mcp-installers.test.cjs",
    ".utcp_config.json",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/graph-metadata.json",
    "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### pi1-I1-P1-001 — The id-noun anchor accepts ordinary English nouns, so one shared word still reaches the confidence floor

- **Severity:** P1 · **Dimension:** correctness · **Finding class:** routing_precision
- **Location:** `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332` (wired into `hasNamedAnchor` at `fusion.ts:1228-1231`)
- **Claim:** `promptNamesIdNoun` treats any final hyphen segment of four or more characters as the noun a prompt must name, so ordinary words anchor unrelated skills — `mode` anchors `mcp-code-mode`, and `code`, `design`, `prompt`, `loop`, `save`, `tooling`, `advisor` and `doctor` behave the same way.
- **Evidence:** the helper's own invariant says non-naming ordinary words must not anchor; `scoreLexicalLane` joins candidate ids into prompt-shaped tokens (`lanes/lexical.ts:69`) and `scoreTokenOverlap` divides hits by `max(3, promptTokens)` (`text.ts:121-145`), so one ordinary word scores `0.333`, above `taskIntentDirectScoreFloor 0.18`, which satisfies `hasNamedAnchor` and lets the `0.82` floor apply. The shipped changelog promises the opposite: "A skill reached through one or two shared words keeps the confidence it earned" (`.skilled/skills/system-skill-advisor/changelog/v2.0.2.0.md`), and the replay's out-of-domain row MBU-N-04 shows an unrelated skill at `0.82` from the lexical lane.
- **Counter-evidence sought:** read the operator decisions that authorised the anchor (014 Q001/Q004), the ratchet report and the full replay CSV. The ratchet shows no new top-1 regression, and the anchor shape was deliberately narrowed from an earlier variant. Neither removes the ordinary-noun path.
- **Impact:** a prompt that happens to use one of these common nouns can be routed to a skill it never named, at floor confidence, which is exactly the failure the 014 scorer change set out to remove.
- **Fix recommendation:** require the id noun to be a distinctive segment (an allow-list or a "not in a stop-noun list" test), or require the noun to appear alongside another skill-specific signal before `hasNamedAnchor` returns true.
- **Confidence:** 0.7 · **Downgrade trigger:** the operator accepts ordinary-noun anchors as intended, or a replay shows the task-intent and direct-score paths never fire on a real prompt.
- **Disposition:** open · **Scope proof:** the file is the one the 014 scorer commit changed and is inside the review scope.
- **Affected surface hints:** the advisor's task-intent path for every skill whose id ends in a common word.

### pi1-I2-P1-001 — The Chrome install guide teaches an unpinned registration fetch

- **Severity:** P1 · **Dimension:** security · **Finding class:** doc_code_parity
- **Location:** `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361`
- **Claim:** the guide's copy-paste `.utcp_config.json` blocks register `chrome-devtools-mcp@latest` (lines 361 and 375), the optional live instance is described with the same tag (line 387), and the troubleshooting check runs `npx chrome-devtools-mcp@latest --version` (line 956).
- **Evidence:** the four blocks above; the live repo-root `.utcp_config.json:56-58` registers the pinned `chrome-devtools-mcp@0.26.0`; phase 014's summary claims "no browser doc or script fetches a package without an exact version and an operator yes" (`014-fix-deep-review-findings/implementation-summary.md:60`). The packet's own snapshot already records the drift (`assets/utcp-chrome-devtools-manuals.md:53`).
- **Counter-evidence sought:** checked whether the live config is the only registration surface and whether the guide's blocks are marked as illustrative history. They are presented as copy-paste configuration, and the snapshot's source-of-truth note points at the live config, so the guide is stale rather than authoritative.
- **Impact:** an operator who follows the guide installs and then fetches whatever `latest` resolves to, with no version pin and no operator gate — the exact act the Bladebro installer hardened against.
- **Fix recommendation:** replace all four blocks with the pinned `0.26.0` form, or replace them with a pointer to the live config and the snapshot asset.
- **Confidence:** 0.8 · **Downgrade trigger:** the guide is reclassified as non-authoritative history and the live `.utcp_config.json` is named the only registration surface.
- **Disposition:** open · **Scope proof:** the file is inside the review target and is the packet's own install surface.
- **Affected surface hints:** `.utcp_config.json` registration, Code Mode manuals, the install path on a fresh machine.

### pi1-I1-P2-001 — AC-002's closure evidence overstates what its own rg prints

- **Severity:** P2 · **Dimension:** correctness · **Finding class:** evidence_integrity
- **Location:** `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:103`
- **Claim:** the row states that every `npx -y bladebro` hit names the operator yes and `4.8.2`, but `mcp-bladebro/changelog/v1.2.1.0.md:21` names neither.
- **Evidence:** the changelog line reads "The lane rule no longer offers `npx -y bladebro mcp` when the binary is missing"; every other hit names the `4.8.2` pin and the operator yes.
- **Counter-evidence sought:** re-ran the exact search and checked whether the changelog should be excluded; the acceptance row's command does not exclude changelogs, so the printed output does not match the sentence.
- **Impact:** the phase records a closure stronger than its command supports, which is what let the next review look for the gap again.
- **Fix recommendation:** either exclude `changelog/` in the command and say so, or correct the sentence to name the changelog exception.
- **Confidence:** 0.85 · **Downgrade trigger:** the row's command is amended to exclude changelogs and the sentence matches it.
- **Disposition:** open · **Scope proof:** the row is the phase's own closure evidence.
- **Affected surface hints:** phase 014's evidence table and every later review that trusts it.

### pi1-I2-P2-001 — The registered Chrome manuals fetch a package on every call without an operator gate

- **Severity:** P2 · **Dimension:** security · **Finding class:** config_precedence
- **Location:** `.utcp_config.json:56-58`
- **Claim:** three `chrome_devtools` manuals launch `npx chrome-devtools-mcp@0.26.0` on each Code Mode call, with no operator gate, while the hub's own Bladebro docs state that an npx launch pulls the package and therefore counts as an install needing an operator yes.
- **Evidence:** the three manual entries; the Bladebro rule that a launch which pulls a package is an install.
- **Counter-evidence sought:** checked whether the pin makes it a no-op; a pinned `npx` still resolves and may fetch the package if it is absent from the cache.
- **Impact:** the same act is gated for one mode and ungated for another, so the packet's install policy is inconsistent between its own modes.
- **Fix recommendation:** decide the rule once — either pre-install and register an absolute binary path, or record the npx launch as an accepted operator act in the packet's policy.
- **Confidence:** 0.7 · **Downgrade trigger:** the packet records the pinned npx launch as an accepted, documented default.
- **Disposition:** open · **Scope proof:** the config file is a review-scope file and is the surface the manuals are read from.
- **Affected surface hints:** Code Mode manual registration and the three-mode install policy.

### pi1-I3-P2-001 — Two packets carry a derived in_progress status while their docs say Complete, and AC-008 claims they agree

- **Severity:** P2 · **Dimension:** traceability · **Finding class:** doc_code_parity
- **Location:** `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:54`
- **Claim:** the parent `spec.md:53` and `goal.md` say Complete with `completion_pct: 100`, while the parent `graph-metadata.json` derived block says `in_progress`; `006-verification` repeats it (`spec.md:23` Complete, `graph-metadata.json:37` in_progress). AC-008's evidence claims the three files agree (`acceptance-criteria.md:61,106`).
- **Evidence:** both metadata files; both status blocks; the AC-008 row and its closure line.
- **Counter-evidence sought:** checked four sibling packets — 001, 013 and 014 read complete, 006 reads in_progress — so the field is meant to track packet status and two packets missed the refresh.
- **Impact:** a reader or tool that trusts the derived status is told a finished packet is still in progress.
- **Fix recommendation:** regenerate the two metadata blocks, or state in AC-008 that `derived.status` is graph-owned and out of the agreement claim.
- **Confidence:** 0.8 · **Downgrade trigger:** the derived block is regenerated and the AC row re-checked.
- **Disposition:** open · **Scope proof:** both files are inside the review target.
- **Affected surface hints:** skill-graph freshness, packet queries, the parent's completion claim.

### pi1-I4-P2-001 — The Bladebro pin and its four digests live twice with nothing checking the pair agrees

- **Severity:** P2 · **Dimension:** maintainability · **Finding class:** config_precedence
- **Location:** `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:21`
- **Claim:** `PINNED_VERSION` and the four digests are declared identically in `doctor.sh:21-27` and `install.sh:17-27`, each script carries its own verify helper, and no test mentions Bladebro.
- **Evidence:** both constant blocks; `.skilled/bin/tests/mcp-installers.test.cjs:49-80` covers only the helper-copy parity and the two installers that ship `_utils.sh`.
- **Counter-evidence sought:** looked for a `_utils.sh`-style shared helper or a pin test; the packet's own Chrome installer got that treatment in 014, Bladebro did not.
- **Impact:** a partial pin bump splits the installer's and the doctor's verdicts about the same package.
- **Fix recommendation:** move the pin and digests into one sourced helper and add a parity test, following the Chrome `_utils.sh` precedent.
- **Confidence:** 0.75 · **Downgrade trigger:** a test asserts the two copies agree, or a shared helper lands.
- **Disposition:** open · **Scope proof:** both scripts are inside the review target.
- **Affected surface hints:** Bladebro install and doctor, and the parity test suite.

### pi1-I4-P2-002 — The Chrome install guide repeats one registration block four times

- **Severity:** P2 · **Dimension:** maintainability · **Finding class:** doc_code_parity
- **Location:** `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:354`
- **Claim:** the 1,124-line guide carries the same manual four times (two required instances at 354-375, the optional live instance at 387, and a troubleshooting snippet at 956), while the snapshot asset holds the authoritative copy.
- **Evidence:** the four blocks; `assets/utcp-chrome-devtools-manuals.md:45-120`; the drift found in `pi1-I2-P1-001` is the consequence.
- **Counter-evidence sought:** checked whether any block is generated from the config; none is.
- **Impact:** four copies of one contract must be edited together, and one already was not.
- **Fix recommendation:** keep one copy in the guide and point the other three at it and at the snapshot asset.
- **Confidence:** 0.8 · **Downgrade trigger:** the guide is reduced to one block plus pointers.
- **Disposition:** open · **Scope proof:** the guide is inside the review target.
- **Affected surface hints:** the guide's configuration and troubleshooting sections.

---

## 4. Remediation Workstreams

### P1 workstreams (block a PASS)

1. **W1 — Advisor anchor precision** (`pi1-I1-P1-001`). Change `promptNamesIdNoun` so a non-distinctive noun cannot satisfy `hasNamedAnchor`, then re-run the two-stage replay and the full ratchet, and re-pin any moved row with the reason.
2. **W2 — One pinned registration authority** (`pi1-I2-P1-001`, `pi1-I4-P2-002`). Replace the guide's four `@latest` blocks with the pinned form or a pointer to the live config and snapshot, then add a test that greps the guide for an unpinned tag.

### P2 advisories (do not block the verdict)

3. **W3 — Evidence sentences that match their commands** (`pi1-I1-P2-001`, `pi1-I3-P2-001`). Correct the two acceptance rows, or amend their commands, and regenerate the two stale `graph-metadata.json` blocks.
4. **W4 — One pin authority and one launch gate** (`pi1-I4-P2-001`, `pi1-I2-P2-001`). Share the Bladebro pin and digests through one sourced helper with a parity test, and decide the npx-launch rule once for all three modes.

Recommended order: W2 before W1 (documentation drift is cheap to close and stops the next review re-finding it), then W1 with a full replay, then W3 and W4 in one pass.

---

## 5. Spec Seed

- New phase `015-close-pi1-deep-review-findings` under this packet, goal bound to "close the two P1s and five P2s at their source, with no new package, no live browser run and no network fetch".
- Acceptance criteria must name the command that proves each fix, and each criterion's evidence sentence must be limited to what its command prints.
- Record the advisor anchor rule as a decision: which segments count as distinctive nouns, and which do not.
- State the npx-launch rule once, in the hub's install policy, and point both the Bladebro and Chrome docs at it.
- Add the guide-drift test and the pin-parity test to the packet's completion criteria.

## 6. Plan Seed

1. Grep the Chrome guide for `chrome-devtools-mcp@latest` and replace all four blocks; add a test that fails on the tag.
2. Add the guide → snapshot pointer and delete the duplicated blocks.
3. Tighten `promptNamesIdNoun`; re-run the two-stage replay and the ratchet; re-pin moved rows with reasons.
4. Correct AC-002's sentence or its command; do the same for AC-008.
5. Regenerate the parent and `006-verification` `graph-metadata.json` blocks and re-check the agreement row.
6. Extract the Bladebro pin and digests into a sourced helper; add the parity test.
7. Write the npx-launch rule once and align the three modes' docs with it; re-run the installers' parity test and the three playbook validators.

---

## 7. Traceability Status

`AC_COVERAGE`: **disabled** — the AC-coverage validation rule is INFO and default-off, and this read-only lineage ran no validation command; the signal is advisory and did not change the verdict.

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | criteria 1, 2, 3, 5 and 6 verified on files (`001-research/research/deep-research-state.jsonl`, both mode registries, the exact-search result, the replay CSV, three playbook roots); criteria 4 and 7 rest on packet-recorded command results | none, but criteria 4 and 7 were not re-observed |
| `checklist_evidence` | pass | sampled 014 rows verified against the tree: parity assertions (`.skilled/bin/tests/mcp-installers.test.cjs:49-80`), `bash -n` on five scripts, the `0.6.10` pins, `--ignore-scripts`, the Aside `SESSION_DIR` default, the BB-015 precondition, the ClickUp disclosure | two rows' evidence sentences overstate (P2 x2) |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `playbook_capability` | pass | three playbook roots with recorded runs; the ClickUp report records 4 PASS and 1 FAIL with reasons | none |
| `feature_catalog_code` | pass | the transport entry's envelope and exit codes match `references/cli-reference.md:61` and `SKILL.md:123` | sampled at one entry of the 17-entry catalog |
| `skill_agent` | notApplicable | no agent definition references the hub or its modes | none |
| `agent_cross_runtime` | notApplicable | same | none |

---

## 8. Deferred Items

- The six `mcp-tooling` modes were checked only where the hub claims they stay unchanged; their own packets were out of scope.
- The Bladebro ClickUp run's raw output was not retained by design; the finding surface it could prove was closed by disclosure in phase 014, not re-run here.
- The Chrome installer's plain `npm install -g` (no `--ignore-scripts`, no digest check) was noted while reading `scripts/install.sh:232` but not raised as its own finding, because the packet makes no claim that it verifies digests; it is a candidate for the same hardening Bladebro received.
- The registry carries no `frontier` object, so no follow-up node is reported.

## Dimension Expansion Map

- **Selected directions:** correctness (advisor anchor and hub routing), security (trust boundaries in routing, install and manuals), traceability (goal criteria, acceptance rows, metadata agreement), maintainability (pin authorities, doc duplication, commit shape), cross-reference (catalog versus code, finding re-read).
- **Saturated directions:** correctness, security, traceability and maintainability each reached their second-order questions without a new finding in the last pass.
- **Completed pivots:** none — the run stayed on the four configured dimensions plus one cross-reference pass.
- **Failed pivots:** none.
- **Audited overrides:** none.
- **Council artifacts:** none.
- **Remaining frontier:** none; every configured dimension is covered.

## 9. Search Ledger

- **searchCoverage:** required bug classes `state_transition`, `input_boundary`, `config_precedence`, `doc_code_parity`, `evidence_integrity`, `error_handling` — all six `covered`; `graphCoverageMode: graph`.
- **candidateCoverage:** `config_precedence`, `doc_code_parity`, `error_handling`, `evidence_integrity`, `input_boundary`, `state_transition` each carry a finding or a covered disposition across iterations 1-5.
- **searchDebt:** `[]` — no payable debt, no deferred or blocked bug class.
- **ruledOutCandidates:** a bare `har` anchoring the hub; the read-only lift accepting a bare `performance trace`; the 014 commit breaking serving authority; the Aside installer's implicit path; page-controlled shell input; a browser mode still inside `mcp-tooling`; a packet version disagreeing with its changelog; an unreviewable 014 commit; the router duplicating the registry aliases; an unreferenced browser script; a failed install leaving the package behind; a doctor that cannot fail; a catalog claim contradicting the reference; a reviewed file changed under the review; a scenario-less catalog entry.
- **cleanSearchProof:** 20 ledger rows across five iterations (7 `finding`, 7 `ruled_out`, 6 `covered`), each carrying a rationale and evidence refs; 0 blocked or deferred rows.

---

## 10. Audit Appendix

### Convergence summary

- Iterations: 5 of a 7 cap; minimum 2 satisfied.
- Stop: `STOP` / `composite_converged`, weighted stop score `1.0`, graph decision `STOP_ALLOWED`.
- Signals at the stop: dimensionCoverage 1.0, findingStability 1.0, p0ResolutionRate 1.0, evidenceDensity 1.0, hotspotSaturation 1.0.
- Gates: all nine passed (`graphlessFallbackGate` inapplicable under `graphCoverageMode: graph`).
- Convergence score after the final reduction: 1.0; new-findings ratio 0 on the last iteration.

### Coverage summary

- Dimensions: 4 of 4 covered (ratio 1.0); coverage age 1 iteration.
- Findings: 0 P0, 2 P1, 5 P2, 0 resolved, 7 active.
- Release readiness: `converged` (no P0, converged stop, verdict CONDITIONAL).

### Ruled-out claims (with the reason each was dropped)

| Direction | Why it was dropped |
|-----------|--------------------|
| a bare `har` still anchors the hub | `har` was removed from the explicit boosts and the lexical hints; the replay routes on the hub's own phrase |
| the read-only lift still accepts `performance trace` | the lift now requires `chrome`/`browser` + `performance trace` |
| the 014 hub commit broke serving authority | the activation manifest and the resolver's policy hash agree with the replay's recorded policy |
| the Aside installer runs implicitly | it states workflows must never call it, and gates on macOS and `--force` |
| a browser script executes page-controlled input | the attach example parses only its own envelope; the REPL argument cannot be re-parsed |
| a browser mode still lives in `mcp-tooling` | the exact search prints no match outside changelog and benchmark reports |
| a packet version disagrees with its changelog | hub and all three modes match |
| the 014 commit is an unreviewable blast radius | 459 of its 526 files are the packet's review archive |
| the router duplicates the registry aliases | the routing vocabulary omits bare `aside` on purpose |
| an unreferenced browser script | every script is named by at least two packet docs |
| a failed install leaves the package behind | the installer uninstalls on a mismatch and exits 1 |
| the doctor cannot fail | documented exit-1 paths are wired through `status` and returned |
| a catalog claim contradicts the reference | envelope fields and exit codes agree in three places |
| a reviewed file changed under the review | `git status --porcelain` prints nothing for the reviewed packets |
| a scenario-less catalog entry is hidden | the playbook root names six entries and their reasons |

### Sources reviewed

Iterations 1 to 5 name every file and line they used. The run's sources cluster as: the advisor scorer (`fusion.ts`, `text.ts`, `lanes/lexical.ts`, `lanes/explicit.ts`, the v2.0.2.0 changelog, the two-stage replay report and CSV); the hub's routing metadata (`mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `leaf-scopes.json`, the compiled-routing activation manifests and fence state); the three mode packets' skills, references, feature catalogs, playbooks, reports and scripts; the installer test and the doctor mutation-class guard; the packet's fourteen phase folders, goal, spec, decision record, 014 fix set, review archive and both `graph-metadata.json` files; and the repo-root `.utcp_config.json`.


### Run integrity and deliberate deviations

- Every state record went through the append gateway: stream sequence 1 (run initialized), 2-6 (iteration records 1-5), 7 (claim adjudication, passed), 8 (graph convergence evaluated, converged), 9 (synthesis complete). None was hand-written into the state log.
- The reducer ran after every iteration with `--create-missing-anchors`, and once more after the config flip, so the registry, dashboard and strategy reflect the completed status.
- `step_stage_artifact_dir` (`git add` of the packet) was deliberately skipped: this lineage's write authority excludes git writes, and the workflow marks that step non-fatal. The operator keeps commit authority, and the staging is a no-op for the verdict.
- The per-iteration prompt-pack files were not rendered: no gate verifies them and this process is itself the executor, so each iteration's narrative, record and delta are the review trail.

---

*Lineage pi-1 · 5 iterations · verdict CONDITIONAL · 2 P1, 5 P2 · stop converged*
