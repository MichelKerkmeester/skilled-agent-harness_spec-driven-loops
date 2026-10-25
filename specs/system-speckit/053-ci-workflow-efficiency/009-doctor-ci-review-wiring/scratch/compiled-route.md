# Compiled route observation (observed 2026-10-25, before any detection-contract edit)

Prompt: `review the GitHub Actions workflow diff in .github/workflows/spec-kit-check.yml`

Run 1, no hint (`node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "<prompt>"`):

{"hubId":"sk-code","action":"route","selectionKind":"surfaceBundle","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"},{"backendKind":"evidence-base","packetId":"sk-code-ci","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-ci"}],"effectivePolicyHash":"37718f519c97811a07c1ddbbb6ec5979eeab7eb17d7e4fe71ba4625795e8eaf8","generation":2}

Run 2, `--surface-hint CI`:

{"hubId":"sk-code","action":"route","selectionKind":"surfaceBundle","targets":[{"backendKind":"review-cache","packetId":"sk-code-review","packetKind":"workflow","skillId":"sk-code","workflowMode":"sk-code-review"},{"backendKind":"evidence-base","packetId":"sk-code-ci","packetKind":"surface","skillId":"sk-code","workflowMode":"sk-code-ci"}],"effectivePolicyHash":"37718f519c97811a07c1ddbbb6ec5979eeab7eb17d7e4fe71ba4625795e8eaf8","generation":2}

bundles: yes

The two runs agree: both return `selectionKind` `surfaceBundle` with `sk-code-review` first and `sk-code-ci` second, so the hint changes nothing here. The bundle comes from the workflow vocabulary in `hub-router.json`, not from surface detection. A vague prompt (`review my changes`) returns `single` with only `sk-code-review` under no hint, `--surface-hint CI` and `--surface-hint SKILLED` alike, so the hint only breaks ties between surfaces the prompt already matched.
