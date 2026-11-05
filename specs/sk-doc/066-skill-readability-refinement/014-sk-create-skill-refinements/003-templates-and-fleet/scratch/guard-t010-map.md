# T010 guard: hard findings mapped to template tasks

Guard: `doc-rewrite-guard.py --base 273224bbed .skilled/skills/sk-doc` reported 20 hard findings, all `code-block`: 10 edited fenced blocks, each also reported as missing. Operator decision 2026-11-05: each hard finding must map to a named template task.

| Fenced block | Task | Intended edit |
|---|---|---|
| `parent-skill-readme-template.md:131` scaffold | T006 | AT A GLANCE folded into OVERVIEW, sections renumbered |
| `skill-readme-template.md:164` scaffold | T006 | AT A GLANCE folded into OVERVIEW, sections renumbered |
| `skill-asset-template.md:139` frontmatter sample | T005 | Description placeholder no longer "same as intro", intro placeholder says hook |
| `skill-reference-template.md:78` frontmatter sample | T005 | Description placeholder no longer "same as intro", intro placeholder says hook |
| `skill-reference-template.md:43` disclosure diagram | T009 | `<5k words` points at the Size Limits table |
| `references/README.md:27` disclosure diagram | T009 | `<5k words` points at the Size Limits table |
| `references/shared/overview.md:27` disclosure diagram | T009 | `<5k words` points at the Size Limits table |
| `skill-md-template.md:427` resource tree | T009 | `SKILL.md (800-1000 lines)` points at the Size Limits table |
| `skill-md-template.md:988` validation comments | T008, T009 | Required sections and size line name the one REFERENCES section and the table |
| `creation-workflow.md:434` iteration example | T009 | `800 words` removed, as AC-008 requires |

No hard finding falls outside this table. The 60 advisory lines are the removed lines these edits replace.
