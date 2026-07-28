---
title: "create-quality-control"
description: "Audit, score and optionally improve an existing markdown document through structure extraction, DQI scoring and Human Voice Rules review."
trigger_phrases:
  - "doc quality"
  - "/doc:quality"
  - "score this document"
  - "human voice"
version: 1.0.0.0
---

# create-quality-control

> Run one command and know, with a number, whether a markdown document is actually ready to publish.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Auditing, scoring and optionally improving an existing markdown document's structure and voice |
| **Invoke with** | `/doc:quality`, "doc quality", "score this document", "DQI", "HVR" |
| **Works on** | Any existing markdown file already in the repo: README, `SKILL.md`, command doc, spec doc, reference |
| **Produces** | A DQI score and band, a blocking/warning/recommendation issue list and (only if asked) a targeted edit to that one file |

---

## 2. OVERVIEW

### Why This Skill Exists

A document either reads well to the person who wrote it or it doesn't, and a self-assessment isn't evidence. Without a scoring pass, "looks fine to me" is the only quality bar a README or `SKILL.md` ever clears, and a document can ship with missing frontmatter, a broken section order or robotic AI-pattern prose that nobody catches until an operator hits it mid-task. Fixing that blind, by rewriting on instinct, risks changing product claims or policy text that nobody actually asked to touch.

### What It Does

`create-quality-control` reads a markdown file, runs it through structure extraction to get a Document Quality Index score and quality band, and classifies what it finds into blocking failures, warnings and recommendations before applying Human Voice Rules on top. `/doc:quality` is report-only by default: it tells you where the document stands and why. Only when edits are explicitly requested does it touch the file, and even then it stays scoped to that one document. It never creates a new artifact. For that, route to the matching creation packet (`create-readme`, `create-skill` and the rest).

---

## 3. QUICK START

**Step 1: Invoke it.** `/doc:quality`, or read `SKILL.md` directly for the full contract.

**Step 2: Run the primary workflow.**

```bash
python .opencode/skills/sk-doc/shared/scripts/extract_structure.py README.md
```

You get a JSON report with the detected document type, structural metrics, checklist results, DQI score and quality band.

**Step 3: Verify before you rely on it.**

```bash
python .opencode/skills/sk-doc/shared/scripts/validate_document.py README.md --type readme
```

Expected: zero blocking issues before the document counts as ready.

---

## 4. HOW IT WORKS

Confirm the target file and pick one execution mode: report-only audit (the default for `/doc:quality`), structure validation, content optimization (only when edits are explicitly requested) or a batch snapshot across multiple docs. Run `extract_structure.py` and treat its JSON output as the source of truth for structure, metrics, checklist results and DQI. Never claim a score without reading it. Classify findings in order, blocking structural failures first, then warnings, then recommendations and only then apply an HVR voice review, since HVR is a pass after structural issues are understood, not a substitute for finding them. Report findings in the fixed shape: document path and type, DQI score and band, filename-case signal, blocking issues, warnings, HVR issues and recommendations. When edits are explicitly requested, audit the current state for weak patterns, map the document against likely developer questions, apply only the transformation patterns the observed gaps call for, edit narrowly without expanding scope, then re-run `validate_document.py` and `extract_structure.py` to confirm the post-edit DQI and checklist state.

### Key Concept: DQI Is Read, Never Guessed

The DQI score always comes from running `extract_structure.py` against the real file on disk, never from eyeballing the document. For example, a README can look polished and still be missing a required Quick Start section. The extractor still returns a lower DQI and flags the missing section as a blocking issue, and that number is what gets reported, not the impression a fast read leaves.

### Enforcement Fixes

The three structural failures this packet fixes most often are missing frontmatter, sections out of the required order and a required section that's simply absent. Each fix follows the same shape: identify the gap against the detected document type, apply the minimal correction rather than a rewrite, then re-run validation and extraction to confirm the fix actually landed. When the missing content needs source evidence that isn't in the workspace, the packet escalates instead of inventing it.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when a document needs to clear a real quality gate before publishing, when a document "feels off" but nobody has run a structural check on it, when someone asks to optimize or rewrite an existing document for AI-friendliness or when a document needs re-validation after another packet finished authoring it. Skip it when the document doesn't exist yet, that's a creation packet's job, or the fix is a one-character typo that doesn't need a scoring pass.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-readme`, `create-skill`, `create-agent` and the rest of the creation family | Own brand-new artifact creation. `create-quality-control` never originates a new file |
| `create-manual-testing-playbook`, `create-benchmark`, `create-feature-catalog` | Validate inline as part of their own authoring workflow. This packet audits something already shipped |
| `sk-code` | Owns code review and debugging. This packet is markdown-only |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| A DQI claim with no extraction evidence behind it | The score was estimated instead of read from the tool | Re-run `extract_structure.py` and cite its JSON output |
| Validator flags a document-type mismatch | `extract_structure.py` auto-detected the wrong type | Force the type on `validate_document.py --type <type>`. The extractor itself has no `--type` flag |
| An edit touched more than the target document | Optimization scope crept into a nearby file | Revert the unrelated changes. Keep edits scoped to the one file unless the user explicitly expanded scope |
| HVR issues were flagged while structural blockers are still open | Voice review ran ahead of the structural gate | Fix blocking structural issues first. HVR is a pass that comes after extraction, not a substitute for it |
| A batch snapshot run edited files nobody asked to change | Batch mode drifted from summary into unrequested edits | Batch mode only summarizes per-file type, DQI and top recommendations. Edit only the specific files the user names |

---

## 7. FAQ

**Q: Why is `/doc:quality` report-only by default?**

A: An unrequested edit risks changing product claims or policy text without a real decision behind it. Edits happen only when explicitly asked for.

**Q: Why this instead of letting each creation packet validate its own output?**

A: A creation packet validates what it just wrote. `create-quality-control` audits something that already exists, independent of who authored it or when.

**Q: Does it add a table of contents to the documents it touches?**

A: No, never, unless another active project rule explicitly overrides that.

**Q: What happens if the requested optimization would change a product claim or a legal or policy statement?**

A: The packet escalates instead of editing. Product claims, policy text and canonical spec decisions need a human decision, not a quality-pass rewrite.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Structure and DQI | `python .opencode/skills/sk-doc/shared/scripts/extract_structure.py <file>` returns metrics, checklist results, DQI score and band |
| Format validation | `python .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type <type>` reports zero blocking issues |
| Filename case (non-scored) | `python .opencode/skills/sk-doc/shared/scripts/check_authored_name_kebab.py <file>` reports `PASS`, `FAIL` or an exemption |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative workflow contract for `create-quality-control` |
| [`references/README.md`](./references/README.md) | Route map over the reference set |
| [`references/workflows.md`](./references/workflows.md) | The four execution modes and how to select one |
| [`references/optimization.md`](./references/optimization.md) | Optimization procedure, heuristics and checklist |
| [`references/transformation-patterns.md`](./references/transformation-patterns.md) | The 16 transformation patterns with worked before/after examples |
| [`../shared/references/validation.md`](../shared/references/validation.md) | DQI bands and quality-gate interpretation |
| [`../shared/references/hvr-rules.md`](../shared/references/hvr-rules.md) | Human Voice Rules for natural documentation style |
