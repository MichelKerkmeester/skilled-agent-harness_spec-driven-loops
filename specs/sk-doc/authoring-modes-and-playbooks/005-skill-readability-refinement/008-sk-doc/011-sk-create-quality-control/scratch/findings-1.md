### .skilled/skills/sk-doc/sk-create-quality-control/README.md
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/README.md:65 | 7 | One 170-word paragraph carries the whole run: mode choice, extraction, finding order, report shape and the edit loop. Nothing signals that HVR comes last. | Replace line 65 with:
```
1. Confirm the target file and pick one execution mode: report-only audit (the default), structure validation, content optimization (only when edits are explicitly requested) or a batch snapshot across multiple docs.
2. Run `extract_structure.py` and treat its JSON output as the source of truth for structure, metrics, checklist results and DQI. Never claim a score without reading it.
3. Classify findings in order: blocking structural failures first, then warnings, then recommendations. Only then apply an HVR voice review, since HVR is a pass after structural issues are understood, not a substitute for finding them.
4. Report findings in the fixed shape: document path and type, DQI score and band, filename-case signal, blocking issues, warnings, HVR issues and recommendations.
5. When edits are explicitly requested, audit the current state for weak patterns, map the document against likely developer questions, apply only the transformation patterns the observed gaps call for, edit narrowly without expanding scope, then re-run `validate_document.py` and `extract_structure.py` to confirm the post-edit DQI and checklist state.
```
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/README.md:73 | 7 | The paragraph packs three failure types, a three-step fix shape and an escalation rule into one block. | Replace line 73 with:
```
The three structural failures this packet fixes most often are:

- Missing frontmatter.
- Sections out of the required order.
- A required section that is simply absent.

Each fix follows the same shape:

1. Identify the gap against the detected document type.
2. Apply the minimal correction rather than a rewrite.
3. Re-run validation and extraction to confirm the fix actually landed.

When the missing content needs source evidence that is not in the workspace, the packet escalates instead of inventing it.
```
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/README.md:79 | 4, 6 | The detailed when-to-use decision sits in §5 after How It Works, so a reader meets the workflow before learning whether to run it. §2 OVERVIEW has purpose and "What It Does" but no when-to-use. | Move lines 79-81 to after line 33, before `### What It Does`.

### .skilled/skills/sk-doc/sk-create-quality-control/ROUTER.md
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/ROUTER.md:23 | 7 | One sentence carries the routing trigger, the 16-term vocabulary and both resource families, so the reader must unpack it to find the two families. | Replace line 23 with:
```
The `sk-doc` hub routes existing-document quality work here: a request to validate, score, audit or optimize an existing markdown file selects this packet, while a request to author a new artifact belongs to the matching `create-*` packet instead. The vocabulary is `doc quality`, `/doc:quality`, `audit documentation quality`, `document audit`, `validate a document`, `validate markdown`, `validation rules`, `score this document`, `optimize this doc`, `DQI`, `AI-friendly documentation`, `extract structure`, `quality bar`, `flag`, `model's budget` and `trim`.

It routes to two resource families:

- **Skill-local references** under `references/` start at `references/README.md`, the route map every run reads first, and carry the four execution modes, the optimization procedure, the 16 transformation patterns with their before/after examples, the validation touchpoints and the worked batch examples.
- **Shared `sk-doc` scripts and standards** the workflow runs: `../shared/scripts/extract_structure.py`, `../shared/scripts/validate_document.py`, `../shared/scripts/quick_validate.py` and `../shared/scripts/check_authored_name_kebab.py` for the structure, validation and naming evidence, with `../shared/references/validation.md` and `../sk-create-with-human-voice/references/hvr-rules.md` for the DQI bands and the voice rules.

`references/README.md` is the default resource and the fallback suggestion, and no other resource loads without an intent that selects it.
```
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/ROUTER.md:55 | 1 | The pseudocode intro says the four intents are "documented in WHEN TO USE", but this file has no WHEN TO USE section; the four intents live in §2 INTENT MODEL. | Replace `documented in WHEN TO USE` with `documented in the intent model above`.

### .skilled/skills/sk-doc/sk-create-quality-control/SKILL.md
- clean

### .skilled/skills/sk-doc/sk-create-quality-control/references/README.md
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/README.md:21 | 7 | The overview chain reads "five single-concern reference files, execution modes, validation ..." so the five concerns look like extra items beside the file count. | Replace line 21 with:
```
This file is the reference route map for the `create-quality-control` packet. It indexes five single-concern reference files, one per concern: execution modes, validation and enforcement, worked examples, optimization procedure, and the transformation pattern catalog. Each loads only when the current task needs its depth.
```
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/README.md:31 | 8 | The index names the four execution modes "script-assisted review, structure checks, content optimization, audit snapshot"; `workflows.md` names them "Report-only audit, Structure validation, Content optimization, Batch snapshot", so the index sends readers to names the target does not use. | Replace `(script-assisted review, structure checks, content optimization, audit snapshot)` with `(report-only audit, structure validation, content optimization, batch snapshot)`.

### .skilled/skills/sk-doc/sk-create-quality-control/references/optimization.md
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/optimization.md:22 | 4 | §1 OVERVIEW opens with "What Is Optimization?" and never states when to use the reference, so the template's Purpose/When to Use opening is missing. | Change line 22 to `### Purpose` and insert after line 30:
```
### When to Use

- The user explicitly asks to improve or optimize an existing document.
- Structure extraction shows weak question coverage, formatting or initialization.
```

### .skilled/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md
- [P1] .skilled/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md:41 | 2 | The Pattern 1 After block opens a three-backtick fence and nests a three-backtick `python` fence. Under CommonMark the inner ` ```python ` cannot close the outer fence, so line 49 closes it and line 50 opens a new fence that swallows Pattern 2's heading, Impact/Effort and Before block through line 60. | Change line 41 to a four-backtick fence tagged `markdown` and line 50 to a four-backtick closing fence. Leave lines 43 and 49 at three backticks.
- [P1] .skilled/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md:63 | 2 | Same break in Pattern 2: the three-backtick outer fence closes at line 73, and line 74 opens a new fence that swallows Pattern 3's heading, Impact/Effort and Before block through line 86. | Change line 63 to a four-backtick fence tagged `markdown` and line 74 to a four-backtick closing fence.
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md:30 | 2 | All 16 Impact/Effort pairs are consecutive bold-label lines, so each pair renders as one run-on line; the validator flags 14, and the two inside the broken fences at lines 54-55 and 78-79 appear once those fences are fixed. | Prefix each label line with `- ` at lines 30-31, 54-55, 78-79, 107-108, 118-119, 136-137, 152-153, 175-176, 190-191, 206-207, 222-223, 236-237, 253-254, 273-274, 285-286 and 292-293.
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md:28 | 10, 2 | Sixteen pattern H2s and RELATED RESOURCES are unnumbered beside a numbered §1, producing 15 `render_h2_numbering` warnings. | Insert `## 2. THE 16 PATTERNS` before line 28; change each `## Pattern N:` heading at lines 28, 52, 76, 105, 116, 134, 150, 173, 188, 204, 220, 234, 251, 271, 283 and 290 to `### Pattern N:` with the same text; change line 303 to `## 3. RELATED RESOURCES`.
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/transformation-patterns.md:24 | 4 | §1 OVERVIEW is one descriptive sentence with no Purpose or When to Use heading. | Replace line 24 with:
```
### Purpose

This file is the worked-example catalog for the 16 transformation patterns that convert reference-style documentation into question-answering format — each entry pairs a before/after code sample with its impact and effort rating.

### When to Use

- You need the exact before/after transform shape for a pattern, not just its name.
- `SKILL.md` §4 Step 3 sent you here to apply a specific pattern.
```

### .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md:24 | 4 | §1 OVERVIEW restates the file scope but has no Purpose or When to Use heading. | Replace line 24 with:
```
### Purpose

This file covers how a create-quality-control run validates and enforces standards: the validation touchpoints, the enforcement approval-prompt wording, how the phases chain together, and what to check when a run breaks.

### When to Use

- A validation step needs its manual sequence, blocking behavior or script confirmed.
- An enforcement prompt needs the wording to surface to the user.
- A run breaks and the failure needs a diagnosis.
```
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md:221 | 10, 2 | RELATED RESOURCES is the only unnumbered H2 among §1-§5, which triggers `render_h2_numbering`. | Change `## RELATED RESOURCES` to `## 6. RELATED RESOURCES`.
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/validation-and-enforcement.md:56 | 9 | "← NEW: Format validation" is an undated progress token; a reader cannot tell whether it is still new. | Replace `← NEW: Format validation` with `← Format validation`.

### .skilled/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md:24 | 4 | §1 OVERVIEW is one descriptive sentence with no Purpose or When to Use heading. | Replace line 24 with:
```
### Purpose

This file collects copy-paste command recipes for the create-quality-control workflow: single-file worked examples (new SKILL creation, README optimization, pre-commit validation) plus multi-file and batch-processing recipes.

### When to Use

- A run needs a starting command for a common single-file task.
- Several documents need batch extraction or validation.
```
- [P2] .skilled/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md:95 | 10, 2 | RELATED RESOURCES is unnumbered beside §1-§3, which triggers `render_h2_numbering`. | Change `## RELATED RESOURCES` to `## 4. RELATED RESOURCES`.
- [P1] .skilled/skills/sk-doc/sk-create-quality-control/references/workflow-examples.md:30 | 5 | Example 1 is "New SKILL Creation" and its first step runs `mkdir`, but the packet contract says it never creates an artifact (SKILL.md NEVER 1, README §2). The governing boundary is absent, so a reader follows a step this packet forbids. | Insert before line 30: `> This packet audits existing documents only and never creates an artifact. \`create-skill\` owns step 1; this packet joins at the first validation command.`
