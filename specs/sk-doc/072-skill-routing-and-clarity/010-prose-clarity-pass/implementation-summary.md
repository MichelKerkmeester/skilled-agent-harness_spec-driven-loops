---
title: "Implementation Summary: Phase 10: Prose clarity pass"
description: "Progress record for the first landed lane. The clarity rules now live once, in a checklist that sk-create-skill's templates and both create workflows link to, and both workflows score the generated SKILL.md and README.md and stop on a hard blocker. The prose sweep across every skill has not run."
trigger_phrases:
  - "prose clarity pass implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/010-prose-clarity-pass"
    last_updated_at: "2026-10-28T15:50:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Landed the writing side: one checklist, both flows scoring"
    next_safe_action: "Run the SKILL.md prose sweep after phases 008 and 009 land"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-010"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Why does the prose sweep wait for phases 008 and 009? Because both rewrite the SKILL.md files the sweep would touch, and 368 lines over 400 characters across 59 files is measured against the current text. Sweeping first would mean editing the same lines twice."
      - "Was the shared-smart-router.md sentence in this phase's scope fixed here? No. Phase 008 owns that file and its lane has replaced the sentence in its own worktree. This phase's copy still carries it, and the record says so rather than claiming a fix it did not make."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 10: Prose clarity pass

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-prose-clarity-pass |
| **Completed** | Not complete. First lane landed 2026-10-28 |
| **Level** | 2 |
| **Status** | In Progress |
<!-- /ANCHOR:metadata -->

This is a progress record for one lane of the phase, not a completion claim. REQ-003 and REQ-004 are met and the gate set is recorded in `scratch/before.md` and `scratch/after.md`. The prose sweep that REQ-001 and REQ-002 depend on has not run, so the phase stays `In Progress` and `acceptance-criteria.md` reads `Closeable: No`.

---

<!-- ANCHOR:what-built -->
## What Was Built

A skill created through `/create:skill` or `/create:skill-parent` is now written the way the clarity pass would have rewritten it, and both flows score what they generate before they finish.

### One checklist, and nine places that link to it

`sk-create-skill/references/skill/creation-workflow.md:153` carries a `#### Prose Clarity Checklist` holding nine rules: instructions before background, the machine router in the final H2, each fact once, one idea per sentence within about 30 words, second person, no project history in instructions, code blocks only for what a person runs or a parser reads, prose lines at 400 characters or fewer, and one routing glossary under `### Terms` for a hub.

The rules live there once. The sentence an author would otherwise copy, "Put instructions before background", matches one file under `.skilled/`. Nine files link to the anchor `#prose-clarity-checklist` instead of restating it: the four create workflow activity files and five sk-create-skill templates and references. `creation-workflow.md` names the checklist three times, its own heading plus two internal links at `:216` and `:289`.

### Both create flows score what they generate

Each of the four create workflow files gained a scoring step and a hard gate. `create-skill-auto.yaml` and `create-skill-confirm.yaml` carry `step_3b_human_voice_score` and the `H4b_human_voice_gate` entry, `create-skill-parent-auto.yaml` and `create-skill-parent-confirm.yaml` carry `step_4b_human_voice_score` and `H6_human_voice_gate`. Each step holds the gate command `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py [target_file]` with `blocking: true`, so a hard blocker stops the flow rather than appearing in a report after it.

The targets are the documents that exist. A full create scores `SKILL.md` and includes `README.md` only when the initializer or the author wrote one (`create-skill-auto.yaml:411`), a full update scores each existing document, and the hub flows score each `SKILL.md` and `README.md` their own generation step wrote (`create-skill-parent-auto.yaml:456`). The scan's exit codes carry the verdict: 0 for no hard blocker, 1 for a hard blocker that blocks completion, and 2 for a scan that could not run, which also blocks. Both presentation contracts print the per-target result, `create-skill-presentation.txt:143-148` and `create-skill-parent-presentation.txt:151-154`.

### The handback reference, corrected against the siblings

`system-spec-kit/references/cli/memory-handback.md` called the `cli-*` family six in three places. It now names seven in the description, the opening sentence and the §1 overview.

Its §4 was also a claim that did not survive an audit. It said each sibling cites a `prompt-templates.md` §N anchor for its own Memory Epilogue. Four cite a section: `cli-claude-code` §11, `cli-codex` §13, `cli-devin` §13 and `cli-opencode` §14. Two of those numbers are also the wrong one, since `cli-claude-code` cites §11 for a template that sits at §13, and `cli-devin` cites §13 for a template that sits at §12. `cli-cursor` links the file with no section number, and `cli-hermes` and `cli-pi` carry no handback section at all. Section 4 is now a per-packet table of citation, real template heading and marker pair (`memory-handback.md:61-71`), and the two procedure steps that depended on the claim say what to do when the markers are absent.

### The README's own hard blocker

`sk-create-skill/README.md` carried one semicolon, at line 83. The human-voice rules treat a semicolon as a hard blocker, so the skill's own README would have failed the gate the skill now teaches. The sentence is split and the count is 0.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The lane edited prose and workflow YAML in one pass, then ran the shared gate set once at the end rather than per file. The reading that made that safe is that none of the changed files carries a routing decision: the four YAML files are activity and gate definitions, the six sk-create-skill documents are templates, guidance and the skill's own README, and `memory-handback.md` is a reference. The gates that could have noticed a shape change are in the runner and all passed, including `rule-copies`, `router-reach`, `package_skill.py --check --strict` on all fourteen skill folders and the recursive validation of the parent packet.

The baseline came first and is reproducible: `scratch/before.md` records the four readings this lane changes and the line-length scan, each as a command with its output, taken from `git show HEAD:<path>` so the record cannot drift with the working tree. `scratch/after.md` records the same readings taken from the final tree and the full 39-gate comparison.

A read-only review of the uncommitted diff ran before the docs were written. It found the copies that had crept into the workflow YAMLs, a broken code fence in the nested-packets reference, a hub README template that failed the scan it teaches, and an anchor claim that was false for three siblings. Every finding is fixed and the fixed tree is what the gate run measures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:review -->
## Review Fixes

The review returned no P0, four P1 and four P2 findings, and `report.md` ends `FINDINGS: P0=0 P1=4 P2=4`. All eight are fixed. `scratch/after.md` §6 holds the detail per finding.

| Finding | Fix |
|---------|-----|
| P1-1 The rules were copied into four YAMLs instead of linked | The six activity blocks hold the link alone, and the rule text matches one file under `.skilled/` |
| P1-2.1 A closing fence with no opener swallowed six sections of the nested-packets reference | The stray fence is gone and `validate_document.py --json` reports `"valid": true` with 0 issues |
| P1-2.2 The hub README template failed the scan it teaches, inside its own payload | The check now uses `'\x{2014}|\x{3B}'`, and the file scans 0 hard blockers at 94/100 |
| P1-4.1 The anchor claim was false for three of the seven siblings | Replaced by the §4 map, which states citation, template heading and marker status per packet |
| P2-2.3 `benchmark/` read as optional while `parent-skill-check` 9b warns without it | Both tables now say the check warns when it is absent |
| P2-3.1 A full create scored a `README.md` that might not exist | The step resolves targets from existing files only |
| P2-3.2 The new blocking gate was absent from `gate_logic` | `H4b` and `H6` added, so the gate inventory lists every stop |
| P2-5.1 The changelog omitted two author-visible changes in the same diff | The sibling reference rewrite and the Mermaid flow diagrams are both named in the entry |
<!-- /ANCHOR:review -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The clarity rules live in one checklist and every other place links to it | The review found the seven rules copied into four workflow files within one edit of being written, and the copies had already dropped a rule and reworded two others. A link cannot drift that way, and the checklist's own second rule says to link rather than repeat. |
| The rules sit in the existing creation workflow rather than a new reference | An author already reads `creation-workflow.md` step by step, so the checklist lands where the writing happens. A separate file would have needed its own frontmatter, trigger phrases and version to be a first-class reference, and a reader would have to be sent to it from the same step anyway. |
| The gate blocks on a hard blocker and on a scan that cannot run | Exit 2 means the scan did not judge the document. Treating it as a pass would let a missing target or a crash ship as clean. |
| The scoring step scores the documents that exist, not a fixed pair | `init_skill.py` writes no `README.md` for a standalone skill, so a fixed pair would either fail on a real skill or force an empty README. The gate asks for `SKILL.md` always and `README.md` when it is there. |
| The 85 pass bar comes from the workflow, not from the skill | The skill names bands and no pass bar. The workflow reads the same bands and turns 85 into the condition for completion, which is where a threshold belongs. |
| `shared-smart-router.md` was left to phase 008 | That phase's file set owns the file. Fixing it here would have produced two edits to one line by two lanes, and the second would have had to reconcile the first. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Generated carriers.** The Hermes mirror of sk-create-skill, the sk-doc compiled-routing activation manifest and a new changelog entry `changelog/v1.7.2.0.md` are in the change and not in spec.md's Files to Change. The first two are regenerated by their own tooling after the prose edit, and the changelog is the version record the sk-doc package contract expects.

2. **`sk-create-skill/README.md` was fixed here.** The Files to Change names the skill's templates and references, not its README. The README carried a hard blocker under the rules this lane lands, so a reader who ran the new gate on the skill would have been sent back to the same fix.

3. **The `shared-smart-router.md` line in scope is not fixed here.** Phase 008 owns that file and its lane has replaced the sentence in its own worktree. In this worktree `references/cli/shared-smart-router.md:17` still reads "The helper bodies below are byte-identical across all seven files", and no `cli-*` `SKILL.md` carries those bodies. The record states the handoff rather than claiming the fix, because the replacement is not in this tree.

4. **The sweep is not started.** REQ-001 and REQ-002 measure the text of every `SKILL.md`, and phases 008 and 009 are still rewriting those files. The measured size of the job is in `scratch/before.md` §4.

5. **The templates were not edited beyond the brief.** The hub template's payload now carries five hard blockers the same rules forbid, and the skill template carries six. Both are outside the files this lane was given, so the reading is recorded rather than fixed: `scratch/after.md` §7 and the known limitations.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set (`scratch/gates.sh`), 39 gates | 39 of 39 exit 0, before and after, with the same gate names |
| `validate.sh --strict` on this folder | `RESULT: PASSED`, exit 0 |
| `validate.sh --recursive --strict` on the parent packet | `RESULT: PASSED`, exit 0 |
| `sync-runtime-mirrors.cjs --check` | `PASS: 194 mirrors across 8 trees are in sync`, exit 0 |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `package_skill.py --check --strict`, fourteen skill folders | `Result: PASS` on all fourteen |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| `hvr_scan.py` on `sk-create-skill/README.md` | 0 hard blockers, ceiling 93/100, exit 0 |
| `hvr_scan.py` on `parent-skill-readme-template.md` | 0 hard blockers, ceiling 94/100, exit 0 |
| `validate_document.py --json`, the ten changed and new documents | `"valid": true` and 0 issues on all ten |
| `compiled-route-guard` and `compiled-route-sync` | every hub fresh, 0 failures, 55 of 55 served copies matching |
| `skill-graph-freshness` | no stale graph, zombie, ghost or signal drift, and nothing written |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase is not closeable.** Two of the four requirements are met. REQ-001 and REQ-002 wait on the prose sweep across every `SKILL.md`, and the sweep runs after phases 008 and 009.

2. **The sweep's size is measured, not estimated.** `scratch/before.md` §4 counts 368 prose lines over 400 characters across 59 `SKILL.md` files, the longest 2,195 characters at `.skilled/skills/sk-git/SKILL.md:307`. That number is the current tree, so it moves when 008 and 009 land.

3. **The template payload still trips the gate the flow now runs.** Three of the four templates are clean or improved. `assets/parent-skill/parent-skill-hub-template.md` is not: it read 0 hard blockers and 97/100 at `HEAD` and reads 5 and 69/100 now, from one semicolon that `### Terms` opens with at `:231` and four more across `:285` and `:289`. `assets/skill/skill-md-template.md` improved from 9 blockers and 41/100 to 6 and 56/100. No gate scans a template, so the gate set stays green, but an author who follows the hub template meets the new blocker inside the creation flow rather than before it. The fix is one edit per line and it belongs with the sweep, which owns the prose these templates produce. `scratch/after.md` §7 holds the four readings.

4. **Two numbers describe the same bar from different places.** The skill names bands, 85 and above publishes, 70 to 84 revises, below 70 rewrites, and no pass bar of its own. The create workflows turn the top band into a completion condition in `gate_logic`. The criterion that the skill defines no numeric passing threshold is true of the skill and not of the flow, and the record says which is which rather than leaving a reader to guess.

5. **One scope line is recorded as handed off, not as done.** `references/cli/shared-smart-router.md:17` in this worktree still carries the sentence that phase 008's lane has replaced in its own tree. The replacement arrives with that phase.

6. **The packet's scratch records are untracked.** `scratch/before.md` and `scratch/after.md` land with these docs, and `scratch/gates.sh` is already there. A broad `git add` would sweep in all three, which is intended.
<!-- /ANCHOR:limitations -->
