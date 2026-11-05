TASK: extend three existing, unpublished changelog entries so they also cover the review remediation. Edit them in place. Do not create new files.
READ FIRST:
1. .skilled/skills/sk-doc/sk-create-changelog/SKILL.md sections 5, 8 and 9, and .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md. They own the format and voice.
2. specs/sk-design/021-deprecate-fundamentals/004-review-remediation/scratch/facts.md. It is the only evidence source for what changed.
3. Each entry below, in full, before you edit it.

ENTRIES AND WHAT TO FOLD IN (reader impact only, each fact once):
1. .skilled/skills/sk-code/changelog/v3.11.0.0.md: design-review requests ("design review", "design review findings", "review this design") now bring in the frontend surface next to code review, so the visual review pass loads. The visual-review route also loads the accessibility patterns its findings cite. The hub description and surface table name the visual references and the starter tokens file.
2. .skilled/skills/sk-code/sk-code-frontend/changelog/v1.1.0.0.md: the shadow elevation guidance now says how to animate a shadow without a repaint on every frame (pseudo-element opacity, 180ms in the direct-feedback band). The session-expiry redirect rule now says the client redirect is UX only, the server still refuses the expired session's data requests and the client clears cached protected data. The visual-review route loads the accessibility patterns reference.
3. .skilled/skills/sk-design/changelog/v3.0.0.0.md: the hub's advisor phrases now describe only the three remaining modes (extract, chart, diagram). The retired values phrases are gone, so design-value requests no longer pull toward this hub.

RULES:
- Fold each item into the right existing section as a glance bullet or an H4 item, following the template. Widen the opening only if the new work needs it. Keep the title, frontmatter keys, version and spec-folder line. If an existing sentence becomes untrue, correct it.
- No file inventories, test counts, finding ids or packet numbers. Plain declarative sentences. No em dash, no semicolon, no Oxford comma.
ALLOWED WRITE PATHS: the three files above.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file.
VERIFY BEFORE YOU FINISH and paste the output:
  for f in .skilled/skills/sk-code/changelog/v3.11.0.0.md .skilled/skills/sk-code/sk-code-frontend/changelog/v1.1.0.0.md .skilled/skills/sk-design/changelog/v3.0.0.0.md; do python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py $f | tail -1; python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py $f | tail -3; done
