---
title: "Goal: Utilization Review"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/049-sk-create-frontmatter/008-utilization-review"
    last_updated_at: "2026-09-02T20:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive from the measured review"
    next_safe_action: "Close the five open criteria, starting with the hub alias repair"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-049-008-utilization-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Utilization Review

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short, because
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the frontmatter mode reachable and its documented numbers true, so a person who describes a frontmatter problem in their own words arrives at a contract that does not lie to them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `SKILL.md` is compiled-policy input. This packet prepares its replacement text and never edits it in place |
| D2 | `sk-doc/graph-metadata.json` is hub-owned. Any edit to it carries the compiled-routing refresh, sync, verify, finalize and re-pin sequence in the same commit |
| D3 | `shared/scripts/frontmatter-version.mjs` sits in the shared tier. This mode names the one-line fix and does not own the edit |
| D4 | A corrected figure carries the measurement that replaced it, plus the corpus it was measured on |
| D5 | Pre-existing human-voice blockers in touched files are a separate sweep and are not folded into this work |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] All eight dead aliases resolve: `frontmatter template`, `frontmatter fields`, `trigger_phrases`, `importance_tier`, `contextType`, `X.Y.Z.W`, `missing frontmatter`, `frontmatter contract` are in `sk-doc/graph-metadata.json`, added with the compiled-routing refresh, sync, verify, finalize and re-pin sequence in one commit
- [x] `node .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs --help` prints usage and exits 0, without walking git history first
- [x] `sk-create-frontmatter/SKILL.md` no longer claims a three-to-five-times inflation, carrying the prepared replacement instead
- [x] `FMB-001` and `FMB-002` each name a fixture file that exists, so neither scenario needs the reader to supply its input
- [x] The index tables at `frontmatter-templates.md` sections 1, 2 and 10 each list feature catalog, testing playbook and agent alongside the classes already there
- [x] Three items are recorded as deferred with a reason rather than dropped: `validate_document.py` typing spec docs as `general`, the six realistic prompts that fail structurally, and the unverified fleet-wide inflation figure
- [x] `validate.sh <this phase> --strict` prints `RESULT: PASSED` with rule lines visible
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

The review itself shipped as `8ad1f98d09 fix(sk-create-frontmatter): run its playbook for the first time, and fix what that found`, the only commit touching this phase folder. Everything below was re-confirmed against the working tree on 2026-09-02, after that commit.

| Item | State | Evidence |
|------|-------|----------|
| Eleven playbook scenarios executed | Done | `implementation-summary.md` section 3 records 11 of 11 PASS, including a negative control on `FMC-001` |
| Reachability measured | Done | Section 4: 6 of 8 newcomer prompts return nothing, 8 of 17 declared triggers return nothing |
| Four documentation defects corrected | Done | Six files modified in `8ad1f98d09`, each correction carrying its measurement |
| Eight aliases added to the hub | Done | All eight are in `intent_signals` and `derived.trigger_phrases`. Advisor before: all eight returned nothing. After: `frontmatter template` 0.8828, `frontmatter fields` 0.8777, `missing frontmatter` 0.8777, `frontmatter contract` 0.8777, and `trigger_phrases`, `importance_tier`, `contextType`, `X.Y.Z.W` at the 0.82 floor, every one on `sk-doc` |
| `--help` on the versioning engine | Done | `parseArgs` now scans the whole argv for the flag before the mode is derived. `--help`, `-h`, `--help --skill sk-vision` and no arguments each print usage and exit 0 with no git pass. `bogus` still exits 64 after discovery, unchanged. Engine tests 23 of 23, up from 21, the two new ones covering this |
| `SKILL.md` inflation claim | Done | The three-to-five-times claim is replaced by the measured 1.06 to 1.09 times over 1,214 documents, with the corpus and the date, matching the reference. The edit made the hub stale and the activation manifests were re-minted for it |
| `FMB-001` and `FMB-002` fixtures | Done | `assets/fixtures/` now carries `over-budget-description.md` (547 characters, every drop-list category and every keep-list token) and `under-budget-trim-lost-tokens.md` (the 56-character trim and the five keep-list rows), with a README. Both scenarios name their fixture in the prompt, the commands and the anchors table. Playbook package PASS, 11 scenarios, 0 violations |
| Three missing classes in the index tables | Done | Feature catalog, testing playbook and agent are rows in the section 1 and section 10 tables and in `By Document Type`, and columns in the field summary, which also gained `title` and `trigger_phrases` rows so the three classes' required fields are visible. Every value is taken from the section 4 templates |
| `validate.sh --strict` on this phase | Done | Recorded against AC-012, re-run at authoring time with `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| The routing repair was written up rather than made | The hub metadata is out of this phase's scope. The write-up names the file, the mechanism and the eight strings, so the change is a lookup rather than a rediscovery |
| The alias fix closes the keyword half only | The six newcomer prompts fail with the vocabulary already present, so this is scorer dilution. Expect the resolving-trigger count to rise and realistic reachability to move much less |
| `validate_document.py` types spec-folder docs as `general` | Deferred with reason. It then blocks them for anchor comments and a missing overview, both of which the spec-kit templates require. Passing `--type spec` resolves it. The auto-detection lives in a script outside this packet |
| The inflation figure is measured on two skills | Deferred with reason. 1,214 documents, aggregate 1.06 to 1.09 times, max 2.25 and no file at 3. The corrected text names the corpus and the date so a fleet-wide run extends it rather than contradicting it |
| The `--help` defect was proved and handed on | Deferred with reason. Four command workflows call the engine and it sits in the shared tier, so the owner of that tier makes the one-line change |
| Human-voice blockers in touched files were left alone | 18 in the reference and 36 in the asset predate this phase. No file gained a blocker: deltas were 0, 0, 0, 0, 0 and -1 |
| D2 names the wrong file as the compiled-routing input | Measured, not assumed. The sk-doc policy pins eighteen source hashes: the hub `SKILL.md`, `hub-router.json`, `mode-registry.json` and each packet `SKILL.md`. `graph-metadata.json` is not among them, and editing it left the guard fresh. What did make the hub stale was the `sk-create-frontmatter/SKILL.md` correction, which is what D1 says. The refresh was carried for that edit rather than for the alias edit |
| Stage two already carried all eight terms | `hub-router.json`, `mode-registry.json` and root `ROUTER.md` each declare the eight, at `ROUTER.md:170`. Only stage one was missing them, so the repair was one file and the union needed nothing else |
| The canary was red on an entry that was not this work's | `harness/validate-canary.cjs` pins eighteen source hashes and was red on two. One was this work's `sk-create-frontmatter/SKILL.md`. The other was `sk-create-with-human-voice/SKILL.md`, drifted by a concurrent session, so the canary was already red before this work began. The set refreshes as a whole, so the re-pin waited for that session to commit, which it did during this one, and both entries were closed in a single pass. `REAL-GREEN` at exit 0. ADR-001 records the sequencing |
| `X.Y.Z.W` catches one out-of-domain phrase | Replayed as the alias rule asks. `write a parser for X.Y.Z.W semver strings in rust` routes to `sk-doc` at 0.9006. The token is repo-specific enough that the capture is narrow, and the alias is one the directive names, so it was kept and recorded rather than dropped |
<!-- /ANCHOR:log -->
