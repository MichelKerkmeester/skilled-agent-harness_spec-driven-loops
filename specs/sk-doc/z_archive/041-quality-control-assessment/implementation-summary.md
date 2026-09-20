---
title: "Implementation Summary: sk-create-quality-control integration, utilisation and usefulness"
description: "The mode is kept unchanged in scope and size because the measurements support keeping it; what was repaired is its executable surface, where 18 documented invocations named a missing interpreter and 7 cross-references pointed one section low."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "quality control assessment summary"
  - "doc quality mode keep and repair"
importance_tier: "high"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/041-quality-control-assessment"
    last_updated_at: "2026-08-31T20:05:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped the repair; all commands execute, all cross-references resolve, no gate regressed"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-quality-control/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/README.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/workflows.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/optimization.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/references/README.md"
      - ".opencode/skills/sk-doc/sk-create-quality-control/changelog/v1.0.2.0.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-31-sk-doc-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-create-quality-control integration, utilisation and usefulness

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 041-quality-control-assessment |
| **Status** | Complete |
| **Created** | 2026-08-31 |
| **Level** | 1 |
| **Completion** | 100%. Assessment answered with measurements, recommendation stated and implemented, no hub-root file touched. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An evidence-based assessment of the `sk-create-quality-control` mode against four questions, and the repair that assessment recommended.

**The recommendation is keep, at current scope and size, and repair the executable surface.** Shrinking is wrong: at 73,804 bytes across 12 files it is the second smallest of the twelve established mode packets, under 2% of the hub's mode-packet bytes, while owning two of `ROUTER.md`'s fifteen surface intents and five of the hub's six leaf aliases. Folding is wrong: no sibling owns existing-document audit, and `sk-create-diff` routes the single-document case here by name in its own "When NOT to Use" contract.

What the measurements did surface is that the packet was unrunnable as written, and that no gate could see it.

1. **Eighteen documented invocations named an interpreter that does not exist.** Across `SKILL.md`, `README.md` and three reference files, every script invocation began `python`. `command -v python` returns nothing in this environment; `python3` is at `/usr/bin/python3`. This packet was the only one of the twelve still on the bare form. Reproduced as a negative control before the fix: `SKILL.md` line 157 copied verbatim returns `command not found: python`.

2. **`SKILL.md` addressed the shared scripts by a path that only resolves from inside the packet.** It used `../shared/scripts/<name>.py`, which needs the shell to already be in the packet directory. Its own `README.md`, and all eleven siblings, use `.opencode/skills/sk-doc/shared/scripts/<name>.py`. Now aligned.

3. **Seven cross-references into `SKILL.md` pointed one section low, and the cause is on record.** The packet's `changelog/v1.0.1.0.md` renumbered the `SKILL.md` H2 sections from 2-7 to 3-8 and stated that no cross-reference depended on the old numbers. That was true of the file and false of its five reference siblings. Every wrong reference was off by exactly `+1`. A reader sent to §3 Step 3 for the sixteen transformation patterns landed on "Interpret Quality Gates".

4. **Three recipes in `references/workflow-examples.md` could not run.** Example 1 changed directory out of the repository root and then used paths relative to it. The batch recipe fed every directory under `.opencode/skills/` to a validator that requires a `SKILL.md`. The spec example used `specs/042/spec.md`, a folder shape the spec tree does not use. All three replaced with recipes that were executed before being written down.

5. **Two claims about `quick_validate.py` were wrong.** `SKILL.md` §4 Step 6 said to run it "for the file"; `references/validation-and-enforcement.md` described its action as validating authored names against lowercase kebab-case. Running it settles both: it takes a skill or packet directory, reads that directory's `SKILL.md`, errors with `SKILL.md not found` on a file path, and filename case belongs to `check_authored_name_kebab.py`. Both descriptions corrected and the filename check split out.

6. **A routed leaf carried a second vocabulary for one decision.** `references/workflows.md` is mapped to the hub's `DOC_QUALITY` intent and named the four execution modes script-assisted review, structure checks, content optimization and audit snapshot, while `SKILL.md` §3 Step 1 named them report-only audit, structure validation, content optimization and batch snapshot. An agent could load both. `workflows.md` now uses the `SKILL.md` names.

7. **Four statements told the reader to type a command that does not exist.** `mode-registry.json` binds the mode to `/doc:quality`; there is no `.opencode/commands/doc/` directory and no mirror in any of the six runtimes, and `system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts` allowlists exactly this one dead binding fleet-wide. `SKILL.md` opened with "This packet is invoked by `/doc:quality`" and `README.md` step 1 read "Run `/doc:quality`". All four now describe hub routing and name the binding as reserved but unbuilt. The trigger vocabulary is untouched, so routing is unaffected.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Every load-bearing claim was produced by running something. The mode's reach was measured by replaying seventeen real request strings through `router-replay.cjs` rather than inferring it from a registry entry, which is the only reason the routing-pressure result appeared at all: "validate the command template" scores 4 for this mode against `sk-create-command`'s 3, and three more probes return `ambiguous-multi-axis` ties against the mode that owns the artifact, because the `quality-actions` class types seven bare verbs at weight 4. Utilisation was established by classifying each grep hit as a live route citation, a test fixture, a frozen spec doc or a benchmark report, rather than counting hits. Duplication was established by tracing the four shared scripts to every caller, which showed that sixteen `/create:*` command assets already run the same gate inline for documents being authored, and that `sk-code` runs the DQI scorer directly on two surfaces, leaving this mode a real and uncontested lane: documents nobody is authoring.

The baseline was captured into `scratch/` before the first edit, so the comparison is real and no stash was needed on a tree three other streams are writing to. `quick_validate.py`'s contract was established by running it against both a file and a directory rather than by reading its description, which is how its two wrong descriptions were confirmed wrong instead of assumed wrong.

One near-miss is worth recording. The mechanical `python` to `python3` sweep also rewrote a sentence inside `changelog/v1.0.0.0.md`, turning a historical record into nonsense. It was caught by reading the diff rather than trusting the substitution, and restored by hand rather than with `git checkout`, since a checkout on a shared dirty tree is not scoped to one file's intent.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the mode rather than shrink or fold | It is second smallest of twelve, owns two of fifteen router intents, and two sibling packets route to it by name. There is nothing to cut that is not already load-bearing. |
| Repair the executable surface rather than restructure the packet | Execution, not structure, was what failed. Every automated gate passed identically before and after, at DQI 95 for `SKILL.md`, while every documented command returned `command not found`. |
| Repo-root-relative script paths, not packet-relative | An agent runs from the repository root. `README.md` and all eleven siblings already use that form; `SKILL.md` was the outlier. |
| Do not hand-bump child-doc frontmatter versions | The `W` segment is git-derived by `frontmatter-version.mjs`, and the standard skips on a differing hand-set value. The `SKILL.md` anchor moved to `1.0.2.0` only because the standard defines the anchor as the max of the frontmatter and the highest changelog filename. |
| Record the hub-wide vocabulary drift, do not fix this mode's share of it | `parent-hub-vocab-sync.cjs` reports 46 phantom typed keywords across the hub, 12 of them this mode's. Fixing one mode's twelve would leave eleven siblings drifted and would touch `mode-registry.json`, which another stream owns. |
| Do not narrow the `quality-actions` class | It is the measured cause of the routing collisions, and narrowing it is defensible, but proving a narrower class does not strand traffic needs a replay across all thirteen modes, and the file belongs to another stream. Recorded with the specific minimal change and the reason it was not made. |
| Do not build `/doc:quality` | A command file plus generated mirrors per runtime `SYNC.md`, plus deleting an allowlist entry that reds when the id starts resolving. That is its own packet, not a side effect of an audit. |
| Leave pre-existing em dashes in untouched prose | Four added lines carry an em dash, all of them existing sentences where only a section number changed. Rewriting that prose would be scope creep on files this packet only needed to correct one number in. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control before the fix | PASS. `python ../shared/scripts/extract_structure.py <file>`, verbatim from `SKILL.md` line 157, returns `command not found: python`. |
| `extract_structure.py` on a real file | PASS, exit 0, DQI JSON returned |
| `validate_document.py` bare | PASS, exit 0 |
| `validate_document.py --type readme` | PASS, exit 0 |
| `quick_validate.py` on the packet directory | PASS, exit 0, "Skill is valid!" |
| `quick_validate.py --json` | PASS, exit 0 |
| `check_authored_name_kebab.py` | PASS, exit 0 |
| `SKDOC_ENFORCE_STRUCTURE=0` opt-out form | PASS, exit 0 |
| Corrected batch recipe, executed | PASS. 14 real skill roots, 0 nonzero exits. |
| `validate_document.py` across all 12 packet files | PASS, exit 0 on every file, matching baseline |
| DQI across all 12 packet files | PASS, no regression. `workflow-examples.md` 87 to 89, `references/README.md` 82 to 83, all others unchanged. `SKILL.md` holds 95 excellent. |
| New changelog entry | PASS. `--type changelog` exit 0, DQI 86 good. |
| `check-frontmatter-versions.sh --skill sk-doc` | PASS. 279 files, ok=278, skip-no-frontmatter=1. |
| Residual `python ` invocations in the packet | PASS, zero, excluding the ```python fence label in `transformation-patterns.md` |
| Residual `../shared/scripts` invocations | PASS, zero. Three remaining hits are markdown links in `references/README.md`, which are correct as relative links. |
| Residual wrong `SKILL.md` cross-references | PASS, zero. All 7 verified against the file's actual H2 and Step headings. |
| Residual "Mode 1" labelling | PASS, zero |
| Blast radius | PASS. `git status --porcelain` scoped to the packet lists 8 modified files and 1 new file, all inside `sk-create-quality-control/`. No hub-root, `shared/`, or other-stream file touched. |
| `changelog/` byte-identical to committed state | PASS. `git diff --stat` on the changelog directory is empty for the two historical entries. |
| Spec folder validation | PASS. `RESULT: PASSED` from `validate.sh --strict`. |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The `/doc:quality` command is still unbuilt.** The packet now describes the binding honestly instead of instructing the reader to type it, but the command surface does not exist and this packet did not create it. Until it does, the mode is reachable only through hub routing, and the allowlist entry in `command-binding-existence.vitest.ts` stays.

2. **The routing collisions are documented, not fixed.** Four measured probes show this mode tying or beating the mode that owns the artifact, on nothing more than a bare verb. The cause is `hub-router.json`'s `quality-actions` class. The file belongs to another stream and a narrowing needs a thirteen-mode replay to prove safe.

3. **Hub-wide advisor vocabulary drift is untouched.** `VOCAB-DRIFT`, score 0, 46 phantom typed keywords, P0 orphan aliases across the whole hub. Twelve belong to this mode. Recorded in `scratch/baseline/vocab-sync.json` and in `spec.md` §7 for the hub-wide reconciliation.

4. **Child-doc frontmatter versions remain inconsistent with the anchor.** The reference files carry `1.8.0.x` while the packet anchor is `1.0.2.0`. Pre-existing, generated by tooling, and not something to guess at by hand. The format gate checks only that a 4-part version is present, which it is on all 279 `sk-doc` docs.

5. **Everything is uncommitted.** Nine paths inside `sk-create-quality-control/` plus this spec folder are working-tree changes, by instruction. The tree is shared with three concurrent streams, so committing is a separate, path-scoped action outside this packet.

<!-- /ANCHOR:limitations -->
