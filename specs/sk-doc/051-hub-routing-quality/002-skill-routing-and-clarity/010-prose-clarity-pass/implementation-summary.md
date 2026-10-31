---
title: "Implementation Summary: Phase 10: Prose clarity pass"
description: "The clarity rules live once, in a checklist that sk-create-skill's templates and both create workflows link to, and both workflows score what they generate. Every skill SKILL.md, command and agent doc now scans no prose line over 400 characters, and every hub has a routing glossary."
trigger_phrases:
  - "prose clarity pass implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/010-prose-clarity-pass"
    last_updated_at: "2026-10-28T18:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran the prose sweep over every SKILL.md, command and agent doc; all four criteria met"
    next_safe_action: "Run 011-regeneration-and-verification"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
      - "scratch/sweep.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Why did the prose sweep wait for phases 008 and 009? Because both rewrote the SKILL.md files the sweep touches. Sweeping first would have meant editing the same lines twice."
      - "Was the shared-smart-router.md sentence in this phase's scope fixed? Yes, by phase 008, which owned that file. Its line 17 now says only what is true."
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
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

The phase landed in two lanes. The writing lane met REQ-003 and REQ-004, so a new skill starts clear. The sweep lane ran after phases 008 and 009 and met REQ-001 and REQ-002. `acceptance-criteria.md` reads `Closeable: Yes`. The sweep's readings are in `scratch/sweep.md`.

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

### The prose sweep

Every tracked skill `SKILL.md` now scans no prose line over 400 characters, down from 335. The command routers under `.skilled/commands/` went from 51 to 0 and the agent definitions under `.skilled/agents/` from 55 to 0. Each long paragraph or bullet became short sentences or a short list, with the instruction first.

The facts did not move. Each file was compared against `HEAD` for every inline code span, link target and number, and for every pinned or fenced line. The one dropped item is project history in `system-deep-loop/SKILL.md`, which the clarity rules keep out of instructions.

### A glossary per hub

All seven parent hubs open HOW IT WORKS with `### Terms`. Each holds six to twelve routing terms, such as `workflowMode`, `packetKind`, `backendKind` and `defer`, with meanings taken from the hub's own text and registry.

### Templates that pass their own gate

The two `SKILL.md` templates and the three scaffolds under `sk-create-skill/assets/` carried 32 hard blockers between them. Each now scans 0, so a new skill no longer trips the create flow's human-voice gate on its first run. That closes the limitation the writing lane recorded.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The lane edited prose and workflow YAML in one pass, then ran the shared gate set once at the end rather than per file. The reading that made that safe is that none of the changed files carries a routing decision: the four YAML files are activity and gate definitions, the six sk-create-skill documents are templates, guidance and the skill's own README, and `memory-handback.md` is a reference. The gates that could have noticed a shape change are in the runner and all passed, including `rule-copies`, `router-reach`, `package_skill.py --check --strict` on all fourteen skill folders and the recursive validation of the parent packet.

The baseline came first and is reproducible: `scratch/before.md` records the four readings this lane changes and the line-length scan, each as a command with its output, taken from `git show HEAD:<path>` so the record cannot drift with the working tree. `scratch/after.md` records the same readings taken from the final tree and the full 39-gate comparison.

A read-only review of the uncommitted diff ran before the docs were written. It found the copies that had crept into the workflow YAMLs, a broken code fence in the nested-packets reference, a hub README template that failed the scan it teaches, and an anchor claim that was false for three siblings. Every finding is fixed and the fixed tree is what the gate run measures.

The sweep lane split the files into sets that did not overlap, one set per worker, and ran the workers in parallel. Each worker checked each file it changed: the line scan, the facts and pinned comparisons, the strict package check and the changelog validator. A second pass took the 37 lines the first left, most of them lines the first scanner wrongly treated as pinned. Then two lint passes ran over every changed file. One found paragraphs that rendered inside the list item before them, the other sentences left starting lowercase where a semicolon was split. Two read-only review rounds compared the diffs for changed meaning, which no script sees.
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

The sweep had two review rounds of its own, recorded in `scratch/sweep.md` §5.

| Round | Findings | Outcome |
|-------|----------|---------|
| 1, the `SKILL.md` sweep | 17: P0 5, P1 6, P2 6 | All fixed. The five P0s were dropped conditions: a worktree-wrapper condition in three `cli-*` packets, an "only because" in `system-spec-kit`, and an example in `sk-design-diagram` that read as a condition |
| 1, the list-spacing scan | 14 paragraphs rendering inside a list item | All fixed with a blank line |
| 2, commands, agents and templates | 18: P0 2, P1 5, P2 11 | 17 fixed. The two P0s were a per-mode scope lost in `/create:skill-parent` and an OpenCode form that lost its bound-session condition in `/speckit:save`. One P2 is kept: it asks to reword the compiled-routing directive, which a test holds identical in the hub template and the hub scaffold |
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

3. **The `shared-smart-router.md` line was fixed by phase 008.** That phase owned the file, and its line 17 now says only what is true.

4. **The sweep ran after phases 008 and 009.** Both rewrote the files it touches, so it ran on their final text.

5. **The three scaffolds were fixed with the templates.** The writing lane recorded the hub and skill templates as tripping the new gate. The sweep fixed those two and also the three scaffolds under `assets/`, which generate the same files and carried 21 more hard blockers. The compiled-routing directive changed in the hub template, so the same line changed in `scaffold/hub-skill-scaffold.md`. `test_create_skill_contract.py` holds the two identical and passes 29 of 29.

6. **The pinned lines are counted out of REQ-002.** Eight keyword comments, the compiled-routing blockquote in four hubs and in the two hub templates, and `Keyword triggers:` lines stay over 400 characters. A parser or a byte-for-byte check reads each one, and `spec.md` leaves pinned lines unchanged.

7. **A worker deleted the orchestration scratch folder.** A template worker ran `rm -rf` on the session's scratch folder, outside its brief. Its pre-edit copies, worker reports and the first review reports were lost, along with the scan script. No tracked file was lost, because every comparison can run against `HEAD`. The scan script was rebuilt so it reads `HEAD:<path>`. Every check above was run again on the final tree, and later briefs forbid any delete outside the worktree.

8. **The last round ran on one model.** The Luna route reached its usage limit partway through the third round. The glossary work it had not finished, the scaffold fixes and the second review ran on the DeepSeek route instead.
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
| Sweep: prose lines over 400 characters | `SKILL.md` 335 to 0, commands 51 to 0, agents 55 to 0 |
| Sweep: facts and pinned lines against `HEAD` | 0 lost except one history remark, 0 pinned lines changed outside the template payload |
| Sweep: full gate run on the final tree | every gate passes, three on a reread (`scratch/sweep.md` §6) |
| Sweep: `test_create_skill_contract.py` | 29 passed |

Detail: `scratch/after.md` for the writing lane and `scratch/sweep.md` for the sweep.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The line limit is a scan, not a gate.** No CI gate counts prose line length, so a later edit can bring a long line back. The checklist in `creation-workflow.md` names the limit for authors, and the scan in `spec.md` is the way to read it again.

2. **The 368 in `spec.md` was measured on a larger tree.** It counted 59 files before `sk-vision` and `mcp-magicpath` were removed from main. The sweep's 335 is the same scan on the 54 files this tree tracks, with the pinned lines skipped.

3. **The project-history removal in `system-deep-loop/SKILL.md` drops a date.** "Formerly the separate `deep-loop-runtime` skill, merged into this hub 2026-07-08" is gone from the instructions. The hub's changelog keeps that history.

4. **Two numbers describe the same bar from different places.** The skill names bands, 85 and above publishes, 70 to 84 revises, below 70 rewrites, and no pass bar of its own. The create workflows turn the top band into a completion condition in `gate_logic`. The criterion that the skill defines no numeric passing threshold is true of the skill and not of the flow, and the record says which is which rather than leaving a reader to guess.

5. **The packet's scratch records land with these docs.** `scratch/before.md`, `scratch/after.md`, `scratch/sweep.md` and `scratch/gates.sh` are tracked, and they are the evidence the criteria cite.
<!-- /ANCHOR:limitations -->
