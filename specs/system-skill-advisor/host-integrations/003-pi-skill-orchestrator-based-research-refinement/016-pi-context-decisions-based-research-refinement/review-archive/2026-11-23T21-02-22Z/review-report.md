---
title: "Review Report: the whole 016 pi-context-decisions epic at HEAD, generation 3"
description: "Third five-pass deep review of the code and docs epic 016 shipped across phases 001 to 028. PASS with advisories. No P0 or P1. Seven P2 advisories. All three terminal gates pass and search debt is 0."
trigger_phrases:
  - "016 epic review report"
  - "016 epic third review"
  - "pi context decisions epic review generation 3"
importance_tier: normal
contextType: review
---

# Review Report: the whole 016 pi-context-decisions epic at HEAD, generation 3

<!-- ANCHOR:deep-review-016-epic-generation-3 -->

## 1. Executive Summary

- **Verdict:** PASS. This is the output of `review-verdict.cjs`, and it binds.
- **hasAdvisories:** true. Seven P2 advisories are active.
- **Counts the verdict used:** P0 0, P1 0, P2 7. Search debt 0. Failed required gate ids: none.
- **Gates.** At the terminal stop (state log, run 6) all three required gates passed. The `evidence` gate passed with `all-findings-cited`. The `scope` gate passed with `all-findings-in-scope`. The `coverage` gate passed with `coverage-complete`.
- **Both generation 2 FAIL causes are cleared.** Generation 2 failed on the `coverage` gate and carried one search-debt row (`env_parity`). In this run `checklist_evidence` ended `pass`, the coverage gate passed, and search debt is 0. The `agent_cross_runtime` overlay, which generation 2 never recorded, is now recorded as notApplicable.
- **Self-check outcomes:** none recorded. The Hunter, Skeptic and Referee pass is owed only on active P0 and P1 findings, and there were none. Synthesis still re-read the cited lines of all seven P2s in the working tree on top of HEAD `ec0e6a5a9dd`. All seven hold as P2. None is a false positive and none rises to P1. No `claim_adjudication` row was appended.
- **Generation 2's six findings are fixed, but not committed.** Each fix holds in the working tree on top of HEAD `ec0e6a5a9dd`. None of them is in a commit yet. `git status` shows the fixes as uncommitted edits to `command-attach.ts`, `subprocess.ts`, `skill_advisor.py`, the offer fixture, two tests, the receipt-guard catalog entry, children 007 to 010 and 027's `acceptance-criteria.md`. Phase 028 is still In Progress, with AC-006 and AC-007 open.

| Gen-2 id | Gen-2 finding | State now | Proof |
|---|---|---|---|
| R2-P2-001 | Python-advisor spawn has no error listener on the child's stdin | Fixed, uncommitted | Listener at `runtime/lib/subprocess.ts:251`, EPIPE test at `runtime/tests/subprocess-output-cap.vitest.ts:97` (passes 1 and 5, re-read at synthesis) |
| R3-P2-001 | Children 007 to 010 record status Planned | Fixed, uncommitted | Scripted pass over all 28 children (pass 3), 028 AC-004 rows reproduce (pass 5) |
| R3-P2-002 | Receipt-guard catalog names only the Claude hook | Fixed, uncommitted | `feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:36-38, 45` lists the DSH, Vibe and Pi adapters and the DSH test (pass 3, re-read at synthesis) |
| R3-P2-003 | 027 AC-006 grep does not reproduce | Fixed, uncommitted | `git grep score-outcome-rerank -- ':!specs/' ':!*changelog/*'` exits 1 with no output, matching `027-epic-review-fixes/acceptance-criteria.md:59` (passes 3 and 5) |
| R4-P2-001 | Curly apostrophe defeats the loop-run ask | Fixed, uncommitted | Fold at `command-attach.ts:478` and `skill_advisor.py:4559`, fixture case `want-research-loop-curly-apostrophe` at `deep-loop-offer-cases.json:32` (passes 1 and 5) |
| R4-P2-002 | ITERATION_COUNT comment contradicts behavior | Fixed, uncommitted | Comment at `command-attach.ts:495-501` matches a live probe in both runtimes (pass 1) |

- **Id collision.** This run reuses the ids R2-P2-001, R4-P2-001 and R4-P2-002 for different findings. The table above uses generation 2's meaning. Every other mention of an id in this report means this run's finding. Matching was done by title and file:line.
- **Which findings the epic introduced, and which predate it.** Attribution comes from `git blame` on the cited lines and the `Spec:` trailer of each blamed commit. A date alone was not used.
  - **Introduced by the epic (4):** R3-P2-001 and R3-P2-002 sit in the epic's own packet docs. R3-P2-003 sits in a catalog entry created by `0cedd64b2f9` (trailer `016-.../014-review-p2-fixes`). R4-P2-002 sits in the Python gate copy written by `c3371f46a6e` (trailer `016-.../027-epic-review-fixes`).
  - **Shared origin (2):** R1-P2-001 and R4-P2-001. The native predicates (`command-attach.ts:406-409, 491-494`) come from `d5f69f4e82e`, whose trailer is `system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`, a sibling packet outside the epic. The epic's phase 027 (`c3371f46a6e`) then copied both predicates into Python with the same gap. Pass 1's scope proof says the gate shipped in the epic's third-round fixes. That is true only of the Python copy.
  - **Predates the epic (1):** R2-P2-001. The cited lines blame to `36ddad5062d` (trailer `cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation`) and `d0f605b42f8`, both dated 2026-11-15. The epic's first commit is `f44694dc33f` on 2026-11-18. The epic did not touch these lines.
  - **Residue of a fixed class:** R3-P2-001 and R4-P2-001 belong to classes phase 028 fixed only for the instances generation 2 named. 028 fixed the statuses of 007 to 010 and missed 012. Its code diff against HEAD adds a curly-quote fold to `asksForLoopRun` and `asks_for_loop_run` only. The stuck-run, past-run and no-edit predicates already folded at HEAD. The writing-about predicate is the one exported test still left unfolded.
- **Review scope:** 119 files in `reviewScopeFiles` (the epic spec docs, phase 028's docs, and every non-spec file the epic's commits touched), plus the 28 child packets. Target type: spec-folder. Dimensions: correctness, security, traceability and maintainability, all covered. Native `deep-review` executor, Opus, medium effort, single executor, 5 of 5 passes, stop reason `maxIterationsReached`. Session `2026-11-23T09:35:31.105Z`, generation 3, lineage `restart`.
- **Operator review focus (verbatim):**

> Review the code and docs the whole epic shipped across phases 001 to 028 as they stand at HEAD: pasted-reply stripping, crash fallback, route receipts, the Ollama and embedding lane removal and its residue tool, the doctor cleanup, the third-round fixes (bridge env parity, deep-loop offer gate, exclusion reload) and phase 028's fixes for the second review's six P2 findings (subprocess stdin guard, curly-apostrophe fold and ITERATION_COUNT comment in both offer-gate runtimes, child 007 to 010 statuses, receipt-guard catalog sources, 027 AC-006). Judge from code and tests; treat packet evidence and verdict tables as claims to check, not facts.

## 2. Planning Trigger

`/speckit:plan` is not required. No P0 or P1 is active, no gate failed and search debt is 0. The seven P2s are advisories. Planning a P2 fix phase is the operator's call. If one is planned, it should fix each class across every instance, not only the named ones. Two of the seven findings are residue of a fix that stopped at its named instances. That is why `fixCompletenessRequired` is true.

**Planning Packet**

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "failedRequiredGateIds": [],
  "searchDebtCount": 0,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:492", "title": "A negated loop question is read as a request for the loop in both offer gates", "findingClass": "recall gap in a shared heuristic", "origin": "shared: native from routing-and-scoring/012, Python copy from epic phase 027"},
    {"id": "R2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:99", "title": "The Vibe head-receipt store trusts its folder, unlike the route-receipt store beside it", "findingClass": "missing defense-in-depth on a per-session state file", "origin": "predates the epic"},
    {"id": "R3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/graph-metadata.json:39", "title": "Child 012 still reads in progress in two of its three status fields", "findingClass": "stale completion metadata", "origin": "epic"},
    {"id": "R3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:65", "title": "The epic's Status cell stops at phase 022 and its completion_pct says 100 while phase 028 is open", "findingClass": "stale packet narrative and contradictory completion metadata", "origin": "epic"},
    {"id": "R3-P2-003", "severity": "P2", "dimension": "traceability", "file": ".skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:22", "title": "The pasted-reply stripping catalog names one call site and one runtime, but the strip runs in six places across two runtimes", "findingClass": "incomplete feature-catalog source list", "origin": "epic"},
    {"id": "R4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408", "title": "The writing-about predicate is the one exported offer-gate test that does not fold curly apostrophes, and three scorer callers read it unfolded", "findingClass": "per-call-site input normalization", "origin": "shared: native from routing-and-scoring/012, Python copy from epic phase 027"},
    {"id": "R4-P2-002", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4509", "title": "The Python offer gate inlines the vocabulary lists the native gate keeps as data, and the shared fixture tests none of the multi-pass, deep loop or other want-lead branches", "findingClass": "duplicated heuristic with incomplete parity fixture", "origin": "epic"}
  ],
  "remediationWorkstreams": [
    "WS1 deep-loop offer gate in both runtimes (R1-P2-001, R4-P2-001, R4-P2-002)",
    "WS2 completion metadata of the epic and child 012 (R3-P2-001, R3-P2-002)",
    "WS3 pasted-reply stripping catalog and playbook sources (R3-P2-003)",
    "WS4 Vibe head-receipt folder trust, owned by the cli-mistral-vibe packet (R2-P2-001)"
  ],
  "specSeed": [
    "Decide whether a negated question about a loop, such as 'why doesn't my deep review converge', is a question or a stuck-run complaint, and state it in both offer gates",
    "Give the native offer gate one quote-fold helper that every exported predicate uses, matching Python's _fold_quotes",
    "Require one shared fixture case per LOOP_WORDING entry, per LOOP_NAMES entry and per want lead",
    "Set child 012 graph status to complete and completion_pct to 100, and bring the epic Status cell and completion_pct in line with phase 028",
    "List every pasted-reply strip call site and the Python copy with its shared fixture in the catalog entry",
    "Give the Vibe head-receipt store the same folder-trust rule as route-receipt.ts ownedFolder"
  ],
  "planSeed": [
    "Add negated-question cases to deep-loop-offer-cases.json, then change LOOP_QUESTION and _LOOP_QUESTION_RE or the stuck-run symptom so both runtimes agree on them",
    "Add a native foldQuotes helper, call it in isWritingAboutTopic, call _fold_quotes in is_writing_about_topic, and add a curly-apostrophe writing-about case",
    "Add fixture cases for multi-pass, deep loop, research loop, review loop, give me a, spin up and we need a, and run both suites",
    "Edit 012 graph-metadata.json:39 and implementation-summary.md:32, then edit epic spec.md:29 and :65, then run validate.sh --recursive --strict on the epic",
    "Add advisor-recommend.ts, skill-advisor-brief.ts, hooks/claude/user-prompt-submit.ts, skill_advisor.py and pasted-reply-strip-cases.json to the catalog entry and its playbook scenario",
    "Reuse the ownedFolder check and a wx temp file plus rename in hooks/vibe/prompt-advisor.mjs, with a symlinked-target test",
    "Commit phase 028's working-tree fixes before any of the above"
  ],
  "findingClasses": [
    "recall gap in a shared heuristic",
    "missing defense-in-depth on a per-session state file",
    "stale completion metadata",
    "stale packet narrative and contradictory completion metadata",
    "incomplete feature-catalog source list",
    "per-call-site input normalization",
    "duplicated heuristic with incomplete parity fixture"
  ],
  "affectedSurfacesSeed": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts",
    ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py",
    ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts",
    ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs",
    ".skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts",
    "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/graph-metadata.json",
    "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/implementation-summary.md",
    "specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md",
    ".skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md",
    ".skilled/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/pasted-reply-stripping.md",
    ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts",
    ".skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Synthesis re-read every citation below in the working tree on top of HEAD `ec0e6a5a9dd`. Titles come from the iteration files. The reducer registry leaves `findingClass`, `scopeProof` and `affectedSurfaceHints` empty for all seven, so those three fields come from the iteration delta `findingDetails`.

### R1-P2-001. A negated loop question is read as a request for the loop in both offer gates

- **Severity:** P2. **Dimension:** correctness. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:492`. Python copy at `runtime/scripts/skill_advisor.py:4546`.
- **Evidence:** `LOOP_QUESTION` accepts only `(?:how|why|when|what) (?:does|do|is|are|did|makes)`, so "why doesn't" never opens a loop question. The stuck-run symptom needs the negation directly before the verb (`command-attach.ts:384`), so the inverted order in "why doesn't my deep review converge" escapes it too. `LOOP_REQUEST` then matches the bare "deep review" wording, and `asksForLoopRun` returns true. Passes 1 and 5 probed three negated questions in both runtimes. Each gave asks=true and stuck=false. The declarative "the deep review isn't converging" is held back correctly.
- **Impact:** a question about an existing run gets a `/deep:review` run offer. The offer is a suggestion the reader can decline.
- **Fix:** add negated-question cases to the shared fixture, then widen the question or stuck-run grammar in both runtimes so they agree.
- **findingClass:** recall gap in a shared heuristic. **scopeProof:** both gate copies are in scope. The shared fixture has no negated-question case. **affectedSurfaceHints:** `runtime/lib/command-attach.ts`, `runtime/scripts/skill_advisor.py`, `runtime/tests/fixtures/deep-loop-offer-cases.json`.
- **Origin:** shared. The native predicate came from `d5f69f4e82e` (routing-and-scoring/012). The epic's phase 027 copied it into Python.

### R2-P2-001. The Vibe head-receipt store trusts its folder, unlike the route-receipt store beside it

- **Severity:** P2. **Dimension:** security. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:99`. The writes are at lines 102 and 105.
- **Evidence:** `writeHeadReceipt` runs `mkdirSync(directory, { recursive: true, mode: 0o700 })` and then `writeFileSync(target, head, { mode: 0o600 })`. It never checks the folder owner, the folder mode or whether the target is a symlink. The import line (17) brings in no `lstat`. The sibling store refuses all three through `ownedFolder` (`hooks/lib/route-receipt.ts:283-291`) and writes through a `wx` temp file and a rename (`route-receipt.ts:249-251`).
- **Impact:** on a host with a shared temp folder, such as Linux `/tmp`, a second local user can pre-create the folder and plant `<digest>.head` as a symlink. The victim's next turn then overwrites the link's target with routing head text. On macOS `TMPDIR` is per user, so the default base is not exposed there. The attacker needs the session id to predict the 16-hex digest, and cannot choose the written content.
- **Fix:** reuse the `ownedFolder` check and the `wx` plus rename write. Add a test with a symlinked target.
- **findingClass:** missing defense-in-depth on a per-session state file. **scopeProof:** the Vibe hook is in scope, and its head-receipt code predates the epic. **affectedSurfaceHints:** `hooks/vibe/prompt-advisor.mjs`, `hooks/lib/route-receipt.ts`.
- **Origin:** predates the epic (`36ddad5062d`, `d0f605b42f8`, both 2026-11-15).

### R3-P2-001. Child 012 still reads in progress in two of its three status fields

- **Severity:** P2. **Dimension:** traceability. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/graph-metadata.json:39`.
- **Evidence:** `graph-metadata.json:39` holds `"status": "in_progress"` and `implementation-summary.md:32` holds `completion_pct: 70`. The child's `spec.md:25` reads `Complete`, and its `tasks.md` has no open task. Pass 3's scripted pass over all 28 children found 012 as the one unexplained case. Child 003 shows the same graph status, but a recorded no-ship decision explains it.
- **Impact:** a status query over the epic's graph metadata lists 012 as an open child.
- **Fix:** set the graph status to complete and `completion_pct` to 100, then rerun strict validation.
- **findingClass:** stale completion metadata. **scopeProof:** 012 is an epic child, and the drift is committed at HEAD. **affectedSurfaceHints:** `012-plan-text-and-goal-closeout/graph-metadata.json:39`, `012-plan-text-and-goal-closeout/implementation-summary.md:32`.
- **Origin:** epic. It is residue of generation 2's R3-P2-001, which phase 028 fixed for 007 to 010 only.

### R3-P2-002. The epic's Status cell stops at phase 022 and its completion_pct says 100 while phase 028 is open

- **Severity:** P2. **Dimension:** traceability. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:65`.
- **Evidence:** the Status cell ends with "Phase 022 fixes all eleven in worktree 489". The phase table carries rows 23 to 28, and row 28 reads In Progress (`spec.md:164`). The continuity block sets `completion_pct: 100` (`spec.md:29`) while the Status reads In Progress.
- **Impact:** the three completion signals in one packet disagree, and a reader of the Status cell learns of no work after phase 022.
- **Fix:** extend the Status cell through phase 028 and set `completion_pct` to match the open phase.
- **findingClass:** stale packet narrative and contradictory completion metadata. **scopeProof:** the epic `spec.md` is in the declared scope. **affectedSurfaceHints:** epic `spec.md:65`, `spec.md:29`, `spec.md:164`.
- **Origin:** epic.

### R3-P2-003. The pasted-reply stripping catalog names one call site and one runtime, but the strip runs in six places across two runtimes

- **Severity:** P2. **Dimension:** traceability. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:22`.
- **Evidence:** "How it works" says only that `scoreAdvisorPrompt` calls the strip. Source Files lists only `prompt-policy.ts` and `fusion.ts` (lines 30-31). The strip also runs in `runtime/handlers/advisor-recommend.ts:529`, `runtime/lib/skill-advisor-brief.ts:424, 480`, `hooks/claude/user-prompt-submit.ts:19`, and a separate Python copy at `runtime/scripts/skill_advisor.py:5053` (called at 1052) that reads `runtime/tests/fixtures/pasted-reply-strip-cases.json`.
- **Impact:** a maintainer who uses this entry as the map edits only `prompt-policy.ts`, and learns of the Python copy when the parity test fails.
- **Fix:** list every call site, the Python copy and the shared fixture in the entry and its playbook scenario.
- **findingClass:** incomplete feature-catalog source list. **scopeProof:** the entry and every cited call site are in scope. **affectedSurfaceHints:** `pasted-reply-stripping.md:22`, `runtime/handlers/advisor-recommend.ts:529`, `runtime/scripts/skill_advisor.py:5053`.
- **Origin:** epic (`0cedd64b2f9`, phase 014). It is the same class as generation 2's receipt-guard catalog finding, which phase 028 fixed for that one entry.

### R4-P2-001. The writing-about predicate is the one exported offer-gate test that does not fold curly apostrophes, and three scorer callers read it unfolded

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:408`. Python twin at `runtime/scripts/skill_advisor.py:4582-4584`.
- **Evidence:** `isStuckRunComplaint` (388), `isPastRunRead` (400), `isNoEditRequest` (443) and `asksForLoopRun` (478) each fold curly quotes, but `isWritingAboutTopic` only lowercases. Its gap words are `[\w'-]+`, so a curly possessive breaks the match. Three callers pass unfolded text: `runtime/lib/scorer/fusion.ts:1031`, `runtime/lib/scorer/lanes/explicit.ts:444` and `skill_advisor.py:4618`. Passes 4 and 5 probed "write my team's blog post about how the deep review converges". It gave writing=true with a straight apostrophe and writing=false with a curly one, in both runtimes.
- **Impact:** with a curly apostrophe the deep-loop hub is not withheld from the ranking, and the explicit lane applies its loop rules.
- **Fix:** add one native fold helper used by every exported predicate, call `_fold_quotes` in the Python twin, and add a curly writing-about fixture case.
- **findingClass:** per-call-site input normalization. **scopeProof:** all four files are in scope. Pass 4 says the fold sites are phase 028's change. The diff against HEAD shows 028 added only the `asksForLoopRun` and `asks_for_loop_run` folds. The other folds were already there. **affectedSurfaceHints:** `command-attach.ts:408`, `fusion.ts:1031`, `explicit.ts:444`, `skill_advisor.py:4582`, `skill_advisor.py:4618`, `deep-loop-offer-cases.json`.
- **Origin:** shared. The native predicate came from `d5f69f4e82e` (routing-and-scoring/012). The epic's phase 027 copied it into Python. Phase 028's uncommitted change folded the loop-run ask, which generation 2 named, and left this predicate as it was.

### R4-P2-002. The Python offer gate inlines the vocabulary lists the native gate keeps as data, and the shared fixture tests none of the multi-pass, deep loop or other want-lead branches

- **Severity:** P2. **Dimension:** maintainability. **Disposition:** active, confirmed in pass 5 and at synthesis.
- **File:** `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4509`.
- **Evidence:** the native gate keeps `LOOP_WORDING` (`command-attach.ts:277`) and `LOOP_NAMES` (`command-attach.ts:330`) as data lists. Python spells them as regex literals at `skill_advisor.py:4506-4510`. A grep of the 30-case fixture for `multi-pass`, `deep loop`, `give me a`, `spin up` and `we need a` finds nothing (synthesis rerun, grep exit 1). The two copies agree today on a six-prompt probe.
- **Impact:** an edit to one list passes both suites, so the runtimes can drift with no test failing.
- **Fix:** add one fixture case per vocabulary entry and per want lead.
- **findingClass:** duplicated heuristic with incomplete parity fixture. **scopeProof:** both gate files and the fixture are in scope. **affectedSurfaceHints:** `deep-loop-offer-cases.json`, `skill_advisor.py:4506`, `skill_advisor.py:4509`, `command-attach.ts:277`, `command-attach.ts:330`.
- **Origin:** epic (`c3371f46a6e`, phase 027).

## 4. Remediation Workstreams

There is no P0 or P1 workstream. All four groups below are P2 advisories. Before any of them, commit phase 028's working-tree fixes. They are the reason the six generation 2 findings read fixed.

1. **WS1. Deep-loop offer gate in both runtimes** (R1-P2-001, R4-P2-001, R4-P2-002). Add fixture cases first: negated questions, a curly writing-about prompt and one case per vocabulary entry and want lead. Then add a native fold helper, fold in both writing-about predicates and settle the negated-question grammar in both copies. Three findings share one file pair and one fixture, so one phase fits.
2. **WS2. Completion metadata** (R3-P2-001, R3-P2-002). Fix child 012's two fields and the epic's Status cell and `completion_pct`. Rerun the scripted status pass over all children, not just 012, so the class closes.
3. **WS3. Pasted-reply catalog sources** (R3-P2-003). List all six call sites, the Python copy and the shared fixture in the catalog entry and the playbook scenario. Sweep the other epic catalog entries for the same gap.
4. **WS4. Vibe head-receipt folder trust** (R2-P2-001). This one predates the epic. Route it to the cli-mistral-vibe owner or fix it here by reusing `ownedFolder`.

## 5. Spec Seed

- Decide whether a negated question about a loop is a question, a stuck-run complaint or a run ask, and write that rule once for both runtimes.
- Require every exported offer-gate predicate to read quote-folded text through one helper per runtime.
- Require the shared offer fixture to carry one case per `LOOP_WORDING` entry, per `LOOP_NAMES` entry and per want lead.
- Set child 012's graph status and `completion_pct` to its real state, and bring the epic Status cell and `completion_pct` in line with phase 028.
- Make the pasted-reply catalog entry name every call site, the Python copy and the shared fixture.
- Hold the Vibe head-receipt store to the route-receipt folder-trust rule.

## 6. Plan Seed

- T1. Commit phase 028's working-tree changes and close its AC-006 and AC-007.
- T2. Add the new offer-gate fixture cases and confirm they fail where expected.
- T3. Add the native fold helper and fold both writing-about predicates. Run `deep-loop-offer-cases.vitest.ts` and the Python fixture test.
- T4. Change the question or stuck-run grammar in both copies until the negated cases pass in both suites.
- T5. Edit `012-plan-text-and-goal-closeout/graph-metadata.json:39`, `implementation-summary.md:32`, epic `spec.md:29` and `spec.md:65`. Run `validate.sh --recursive --strict` on the epic and read `RESULT: PASSED`.
- T6. Update `feature-catalog/scorer-fusion/pasted-reply-stripping.md` and `manual-testing-playbook/scorer-fusion/pasted-reply-stripping.md`.
- T7. Harden `hooks/vibe/prompt-advisor.mjs` and add a symlinked-target test to `runtime/tests/hooks/vibe-prompt-advisor.vitest.ts`.
- T8. Rerun `/deep:review` on the epic.

## 7. Traceability Status

### Core protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `spec_code` | hard | pass | Phase 028 code fixes hold (pass 1: `subprocess.ts:251`, `command-attach.ts:478`, `skill_advisor.py:4559`). Doc-side fixes hold (pass 3). The shared-fixture claim at `skill_advisor.py:4466-4472` and the doctor cleanup wiring match code and the contract test `doctor-update-contract.test.cjs:222, 243, 326` (pass 4). | None. |
| `checklist_evidence` | hard | pass | Goal criteria at `goal.md:102, 103, 105, 106` reproduce. `goal.md:104` reproduces: recursive strict validation printed 29 `RESULT: PASSED` lines with exit 0 (pass 5). 028 AC-001 to AC-005 reproduce. | `goal.md:100` was not rerun because it needs a daemon restart. `goal.md:101` printed 428 passed and 1 skipped, but its exit status was not captured. 028 AC-006 and AC-007 are Unmet and Pending, which is honest for an open phase. R3-P2-001 falsifies no checked row. |

### Overlay protocols

| Protocol | Gate class | Status | Evidence | Unresolved drift |
|---|---|---|---|---|
| `skill_agent` | advisory | notApplicable | The epic changed no agent definition. `SKILL.md:26-27` names both shipped features. | None. |
| `agent_cross_runtime` | advisory | notApplicable | No agent or agent mirror is in scope. Receipt-guard parity across the Claude, DSH, Vibe and Pi adapters was checked under `spec_code`. | None. Generation 2 never recorded this overlay. This run did. |
| `feature_catalog_code` | advisory | partial | The receipt-guard entry matches its code. | The pasted-reply entry under-names its sources (R3-P2-003). |
| `playbook_capability` | advisory | partial | Link resolution over eight scoped playbook files found no dangling path the epic introduced. | No scenario was executed in this run. |

The registry summary reads required 4, executed 4, pass 2, partial 2, notApplicable 2, gating failures 0.

### AC_COVERAGE

- **Epic parent (the review target):** exempt. The parent has no `acceptance-criteria.md`.
- **Children, read at synthesis from `validate.sh --strict`:** each run printed `RESULT: PASSED`. The shell was zsh, so `PIPESTATUS` came back empty and the exit status was not captured. The results stand on the printed `RESULT` line.

| Child | AC_COVERAGE | Covered / total | Floor |
|---|---|---|---|
| 018 | advisory-shortfall | 0 / 10 | 9 |
| 019 | advisory-shortfall | 0 / 13 | 12 |
| 020 | not active for its level or lifecycle state | n/a | n/a |
| 022 | advisory-shortfall | 0 / 15 | 14 |
| 025 | advisory-shortfall | 0 / 24 | 22 |
| 026 | advisory-shortfall | 0 / 28 | 26 |
| 027 | pass | 22 / 22 | 20 |
| 028 | advisory-shortfall | 3 / 7 | 7 |

- **Overall signal:** advisory-shortfall. The rule is INFO and default-advisory, so it does not change the verdict. 028's shortfall matches its open AC-006 and AC-007. The other five children mark rows Met with no `file:line` in the Verification cell, as generation 2 also reported.

### Resource map

- resource-map.md not present at the spec-folder root, so the Resource Map Coverage Gate is skipped. The reducer did write `review/resource-map.md` at synthesis. See the Audit Appendix for its quality.

## 8. Deferred Items

- The registry has no `frontier` object, so no exhausted or blocked frontier nodes are carried.
- **Phase 028 is uncommitted and open.** Its fixes sit in the working tree. Its AC-006 is Unmet: the gate set in its `plan.md` section 5 must exit 0, and the advisor suite must print `2568 passed` with 4 skipped. Its AC-007 is Unmet: a fresh five-pass review must name no failed gate and leave no open search-ledger row (`028-second-epic-review-fixes/acceptance-criteria.md:57-58`). This run is that review, and it meets the AC-007 condition. Marking the row is 028's own step.
- **Goal criterion `goal.md:100`** was not rerun. It needs a daemon restart on main.
- **Goal criterion `goal.md:101`** is output-verified only. Its exit status was not captured.
- **Playbook scenarios** were not executed in this run.
- **Out-of-scope context reads.** `sweep-lane-residue.mjs` (2384 lines, 74 top-level functions) and `doctor-update-apply.yaml` were read as context. They are not in `reviewScopeFiles`. Search row SL4-005 (`oversized_module`) was marked not_applicable for that reason.
- **Child 003's `in_progress` graph status** is explained by a recorded no-ship decision (`003-follow-up-routing-benchmark/implementation-summary.md:80`).
- **Review process note.** Pass 1 created and removed an empty folder inside the review target while looking for a TS runner. Net change was none.

## Dimension Expansion Map

- Saturated directions: none recorded. `divergence.saturatedDirections` is empty.
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Council artifacts: none.
- Selected review directions: correctness (pass 1), security (pass 2), traceability (pass 3), maintainability (pass 4), then a traceability stabilization pass (pass 5).
- Remaining frontier: none recorded.

## 9. Search Ledger

- **hasSearchDebt:** false. No row is deferred or blocked.
- **searchCoverage (final pass):** required bug classes `checklist_evidence_gap`, `fix_regression`, `stale_probe_target` and `open_finding_recheck`, all ruled out. Graph coverage mode `graphless_fallback`.
- **candidateCoverage:**
  - Covered (each produced a finding): `heuristic_recall`, `symlink_redirect`, `stale_status_metadata`, `stale_packet_narrative`, `catalog_source_gap`, `normalization_drift`, `duplicated_heuristic`.
  - Ruled out: `error_handling`, `parser_parity`, `state_transition`, `path_traversal`, `redos`, `env_leak`, `unsafe_delete`, `dangling_reference`, `unreproducible_evidence`, `comment_hygiene`, `untested_wiring`, `checklist_evidence_gap`, `fix_regression`, `stale_probe_target`, `open_finding_recheck`.
  - Deferred: none. Blocked: none.
  - Not applicable: `oversized_module` (SL4-005). The target file is outside the declared scope. It is neither debt nor a ruled-out class.
- **ruledOutCandidates (15 rows) and cleanSearchProof (16 rows, the 15 plus SL4-005):**

| Row | Pass | Bug class | Disposition | Proof |
|---|---|---|---|---|
| SL-001 | 1 | error_handling | ruled_out | Stdin guard and test present (`subprocess.ts:249`, `:296`) |
| SL-002 | 1 | parser_parity | ruled_out | Vitest pass and direct Python replay of 30 cases |
| SL-003 | 1 | state_transition | ruled_out | Exclusion reload keyed on its stamp (`route-exclusions.ts:94`) |
| SL2-002 | 2 | path_traversal | ruled_out | Hashed name and `ownedFolder` (`route-receipt.ts:102`, `:283`) |
| SL2-003 | 2 | redos | ruled_out | Timing probe linear on inputs up to 1.1M characters |
| SL2-004 | 2 | env_leak | ruled_out | Allowlist set diff equals the documented launcher-only keys |
| SL2-005 | 2 | unsafe_delete | ruled_out | Containment and ownership guards (`sweep-lane-residue.mjs:1792`, `:1417`) |
| SL3-004 | 3 | dangling_reference | ruled_out | Cross-skill targets exist and predate the epic |
| SL3-005 | 3 | unreproducible_evidence | ruled_out | 028's validate failure is covered by its own Unmet AC-006 |
| SL4-003 | 4 | comment_hygiene | ruled_out | Grep hits are generic placeholders |
| SL4-004 | 4 | untested_wiring | ruled_out | Asserted by `doctor-update-contract.test.cjs:222, 243, 326` |
| SL4-005 | 4 | oversized_module | not_applicable | File not in the declared review scope |
| SL5-001 | 5 | checklist_evidence_gap | ruled_out | `goal.md:104` reproduced at HEAD |
| SL5-002 | 5 | fix_regression | ruled_out | 028 fixes verified by direct read and grep |
| SL5-003 | 5 | stale_probe_target | ruled_out | Dist build is newer than its source |
| SL5-004 | 5 | open_finding_recheck | ruled_out | All seven P2s confirmed, no new finding |

## 10. Audit Appendix

### Convergence summary

- 5 of 5 passes, stop policy `max-iterations`, stop reason `maxIterationsReached`. Convergence is telemetry only under this policy.
- New findings by pass: 1, 1, 3, 2, 0. newFindingsRatio by pass: 1.0, 0.5, 0.6, 0.29, 0.0.
- Graph decision was `STOP_BLOCKED` after passes 1 to 4 on dimension coverage, then `STOP_ALLOWED` after pass 5 with score 1 and no blockers.
- Reducer convergence score 1, graph convergence score 1.
- Terminal gates (state log, run 6): `evidence` pass `all-findings-cited`, `scope` pass `all-findings-in-scope`, `coverage` pass `coverage-complete`.
- Verdict script output: `{"status":"ok","verdict":"PASS","has_advisories":true,"active_p0":0,"active_p1":0,"active_p2":7,"search_debt":0,"failed_required_gate_ids":[]}`, exit 0. Same output before and after the resource-map reducer run.

### Coverage summary

- Dimensions: correctness, security, traceability and maintainability all covered.
- Files: the passes read the offer gate in both runtimes, `subprocess.ts`, `route-exclusions.ts`, `prompt-policy.ts`, `fusion.ts`, `explicit.ts`, the route-receipt store, the Claude, DSH, Vibe and Pi hook adapters, the launcher, the catalog and playbook entries, all 28 children's status fields, and phase 028's docs. A comment-hygiene grep covered every scoped code file.
- Runs the passes read with output and exit: vitest over 4 files (93 passed, exit 0), a Python fixture replay (0 mismatches over 30 cases), offer-gate probes in both runtimes, a ReDoS timing probe, `validate.sh --recursive --strict` twice (27 passed and 1 failed in pass 3, 29 passed with exit 0 in pass 5), and vitest over hooks, parity and handlers (428 passed and 1 skipped, exit not captured).
- Runs at synthesis: the seven P2 citations re-read, `git blame` and commit trailers for attribution, a fixture grep (exit 1, no match), `validate.sh --strict` on the eight AC-bearing children (each `RESULT: PASSED`), the verdict script twice and the resource-map reducer once (exit 0). A `find` for files newer than the state log, outside `review/`, returned nothing, so the validate runs wrote no spec file.

### Ruled-out claims

- Regression of any phase 028 fix. Native and Python drift on the 30 shared offer cases. Native probes reading a stale dist build.
- ReDoS in the pasted-reply strip. Launcher and bridge env drift. Residue-tool deletes outside its roots or signals to a foreign process. Route-receipt path traversal or symlink redirection.
- Child 003's graph status as unexplained drift. Dangling cross-skill catalog links introduced by the epic.
- Comment-hygiene violations in the epic's code. Untested doctor lane-cleanup wiring. Current drift on the untested vocabulary branches.
- Goal criterion 104 still failing.

### Sources reviewed

- Review packet: `iterations/iteration-001.md` to `iteration-005.md`, `deltas/iter-001.jsonl` to `iter-005.jsonl`, `deep-review-strategy.md`, `deep-review-findings-registry.json`, `deep-review-config.json`, `deep-review-state.jsonl` (terminal gate row).
- Code and docs in the working tree on top of HEAD `ec0e6a5a9dd` as cited in section 3.
- Generation 2's report at `review-archive/2026-11-23T09-35-19Z/review-report.md`, for format and for the six findings it raised.

### Tooling note on the resource map

`review/resource-map.md` was emitted by the reducer with 6 rows, all marked Validated and OK. Every row reports `P0=0 P1=0 P2=0`, including the six files that carry this run's P2s. Generation 2 hit the same reducer issue. It is a tooling gap, not a review finding, and it does not affect the verdict.

### Core Protocols

- `spec_code`: pass, final in pass 4.
- `checklist_evidence`: pass, final in pass 5.

### Overlay Protocols

- `skill_agent`: notApplicable, pass 3.
- `agent_cross_runtime`: notApplicable, pass 3.
- `feature_catalog_code`: partial, pass 4. Advisory, non-gating.
- `playbook_capability`: partial, pass 3. Advisory, non-gating.

<!-- /ANCHOR:deep-review-016-epic-generation-3 -->
