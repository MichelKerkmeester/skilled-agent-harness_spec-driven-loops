TASK: fix the visual-review routing reach in sk-code (workstream WS-1 in facts.md). Make exactly the edits below and nothing else.
READ FIRST: specs/sk-design/021-deprecate-fundamentals/004-review-remediation/scratch/facts.md, the WS-1 block.

EDITS:
1. `.skilled/skills/sk-code/hub-router.json`, vocabulary class `code-frontend-visual`, `keywords` array: insert the two strings "design review" and "review this design" directly after "design review findings". The array is written on ONE line. Edit it with an exact text replacement: replace `"design review findings", "review this screen"` with `"design review findings", "design review", "review this design", "review this screen"`. Never re-serialize or re-indent the file.
2. `.skilled/skills/sk-code/sk-code-frontend/ROUTER.md`: in the `WEB_VISUAL_HIERARCHY` keyword list (the prose line and the JSON line), add `design review` and `review this design` after `design review findings`, using the same exact replacement. In the prose line, also make the load sentence name `references/web-accessibility-patterns.md` as a fourth file. In the RESOURCE_MAP block `"WEB_VISUAL_HIERARCHY": [`, add the line `        "references/web-accessibility-patterns.md",` after the `web-visual-values.md` line.
3. `.skilled/skills/sk-code/ROUTER.md` (the hub root router, which mirrors the frontend intents): the same two keyword additions on its `WEB_VISUAL_HIERARCHY` line, and in its RESOURCE_MAP `"WEB_VISUAL_HIERARCHY": [` block add `        "sk-code-frontend/references/web-accessibility-patterns.md",` after the `web-visual-values.md` line. If it has a prose load sentence for this intent, add the fourth file there too.
4. `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json`, array `cases`: append three objects after `surface-bundle-frontend`, in the same 2-space indent style as the existing objects:
   - id `visual-values-frontend`, prompt "what padding should this have", riskSlice "evidence:nonmutating:single", expectedAction "route", expectedSelectionKind "single", expectedModes ["sk-code-frontend"], gold {expectedIntents ["sk-code-frontend"], expectedResources []}
   - id `visual-review-bundle`, prompt "design review findings", riskSlice "actor:mutating:composite", certificateFixture "valid-composite", expectedAction "route", expectedSelectionKind "surfaceBundle", expectedModes ["sk-code-review","sk-code-frontend"], gold {expectedIntents ["sk-code-review","sk-code-frontend"], expectedResources []}
   - id `visual-motion-frontend`, prompt "what animation duration should this dropdown use", riskSlice "evidence:nonmutating:single", expectedAction "route", expectedSelectionKind "single", expectedModes ["sk-code-frontend"], gold {expectedIntents ["sk-code-frontend"], expectedResources []}
   Copy the key order and formatting of the `single-opencode` and `surface-bundle-frontend` cases exactly.

ALLOWED WRITE PATHS: the four files above.
BANNED OPERATIONS: any git command that changes state, deleting files, editing any other file, reformatting a whole JSON file.

VERIFY BEFORE YOU FINISH and paste the output:
  python3 -c "import json;json.load(open('.skilled/skills/sk-code/hub-router.json'));json.load(open('.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/fixtures/canary-cases.v1.json'));print('json ok')"
  git diff --stat
