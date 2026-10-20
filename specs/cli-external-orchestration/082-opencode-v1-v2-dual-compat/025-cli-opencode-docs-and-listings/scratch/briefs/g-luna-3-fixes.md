ROLE: You apply two review fixes. Match each file's existing style. Comments never name a spec folder, phase, row or task id.

FIX 1 (`.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`):
The test `SKILL.md's default invocation names the roster default` passes when `DEFAULT_ID` appears anywhere in the `### Default Invocation` section, so the dispatch examples there could name another model and still pass. Change it so it collects every model selector in that section, meaning each `--model <id>` and each `-m <id>` (strip a trailing `#<level>` and any closing backtick or quote), asserts there is at least one selector of each form, and asserts every collected id equals `DEFAULT_ID`. On failure the message lists each selector that differs. Today the section holds `--model opencode-go/deepseek-v4.1-flash` and `-m opencode-go/deepseek-v4.1-flash#max`, so the test must still pass.

FIX 2 (`.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md`):
Do NOT edit the line that starts `Coverage note (2026-04-26):`. Directly after it (leave one blank line between), add this one-line note:
`> **Since then:** OpenCode 1.19.3 discontinued session sharing, so the operator-confirmed \`--share\` flows the coverage note mentions no longer publish anything, and the default model is now \`opencode-go/deepseek-v4.1-flash\`. See SKILL.md NEVER rule 2 and \`references/providers-and-models.md\`.`

VERIFY (report tail and exit code):
1. `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`
2. A negative check you run and then undo: temporarily change the `-m opencode-go/deepseek-v4.1-flash#max` selector in SKILL.md's Default Invocation section to `-m llmgateway/deepseek-v4.1-flash#max`, run the test (expect exit 1 naming that selector), then restore SKILL.md exactly (`git diff -- .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` must be empty).
3. `node .opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict 2>&1 | grep cli-opencode`
