ROLE: You correct one documented fact across the cli-opencode skill. Edit prose and command examples only; keep each file's headings, tables, anchors and voice. Short, plain sentences. No new sections.

FACT (verified 2026-10-20 on OpenCode 1.19.3, evidence in the packet's `scratch/row12-v1-share-source.txt` and `scratch/row12-v1-share-probe.txt`):
- `--share` is a HIDDEN option on 1.19.3 `run`, defined as `deprecated: session sharing was discontinued`. It is not shown by `opencode run --help`.
- Passing it prints `!  Session sharing has been discontinued` and the run carries on. Nothing is published and no URL is printed.
- OpenCode 2.0.32 `run` has no `--share` flag at all.
- So no dispatch should pass `--share`. A parallel detached session on OpenCode 1 needs only `--port <N>`.

Every doc below still says `--share` "publishes" a session or shows it in a dispatch shape. Make them say the fact above.

FILES AND EDITS (all under `.skilled/skills/cli-external-orchestration/cli-opencode/`):
1. `references/cli-reference.md`
   - §4 flag table, the `--share` row: Purpose becomes `Hidden and deprecated on 1.19.3: prints "Session sharing has been discontinued" and publishes nothing. Never pass it`. Keep the OpenCode 2 column `absent on run`.
   - The `### Sessions, share URLs, and ports` paragraph about `--share` and the `### Share URLs` paragraph: replace the "publishes ... The skill ONLY appends `--share` for use case 2 ..." text with the fact. Keep the headings.
   - Drift table row `unknown option --share`: change to symptom `"!  Session sharing has been discontinued" on stderr (OpenCode 1 only)`, cause `--share was passed; on 1.19.3 it is a deprecated no-op. Drop the flag. OpenCode 2 run has no --share`.
   - Troubleshooting row `--share URL leaks`: change to symptom `--share passed (OpenCode 1 only)`, cause `Nothing is published on 1.19.3, the flag only prints a warning`, fix `Drop the flag`.
2. `SKILL.md`
   - Core Invocation Pattern: remove `` `--share` and `` so it reads `` `--port` for detached sessions ``. Do not drop any other flag from that sentence.
   - Essential Commands: `` `--share --port <N>` serves explicit detached sessions `` becomes `` `--port <N>` serves explicit detached sessions ``.
   - NEVER rule 2: `Pass --share. On OpenCode 1.19.3 it is a hidden, deprecated flag that only prints "Session sharing has been discontinued", and OpenCode 2 run has no such flag.` (keep the link to install-and-versions.md).
   - ESCALATE IF item 2: `Operator asks for a share URL. OpenCode 1.19.3 discontinued session sharing and OpenCode 2 run has no share flag, so say there is no URL to publish.`
   - Success criteria line about `--share` URLs: `No dispatch passes --share (discontinued on 1.19.3, absent from OpenCode 2 run).`
3. `README.md`: the `> **Confirm before you share.**` note becomes a note stating the fact; remove the `--share` flag from the `opencode run --share --port 4096` example (keep `--port 4096`); `--share` and `--port` have no run form on OpenCode 2 → `--port` has no run form on OpenCode 2; the troubleshooting row `Unknown --share or --variant flag on OpenCode 1` → `Unknown --variant flag on OpenCode 1`; the FAQ line that mentions a `--share` URL: drop the share URL wording.
4. `references/opencode-tools.md`, `references/integration-patterns.md`, `assets/prompt-templates.md`: remove the `--share \` line from every command example; in prose, `--share --port <N>` → `--port <N>`, `--share and --port have no run form` → `--port has no run form`, and any sentence that says a share URL is published or must be confirmed becomes the fact (one sentence). Keep the trigger keywords list (`"share URL"` as a router keyword stays).
5. `hard-rules.json`: in the rule `share-requires-confirmation`, change only `message` to `` "`--share` publishes nothing: OpenCode 1.19.3 discontinued session sharing and OpenCode 2 `run` has no such flag. Drop it." ``. Do not change `id`, `check`, `severity` or `appliesTo`.
6. `.skilled/hooks/dispatch/README.md`: the `share-requires-confirmation` table row's description becomes `No --share flag present (a deprecated no-op on OpenCode 1.19.3, absent on OpenCode 2)`.

DO NOT edit `manual-testing-playbook/`, `changelog/` or `benchmark/`.

VERIFY (run each, report output and exit code):
1. `rg -n -- '--share' .skilled/skills/cli-external-orchestration/cli-opencode -g '!changelog/**' -g '!benchmark/**' -g '!manual-testing-playbook/**'` and confirm no remaining line says `--share` publishes, or shows it in a dispatch example.
2. `node -e 'JSON.parse(require("fs").readFileSync(".skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json","utf8"))' && echo json-ok`
3. `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs`

REPORT: each file changed and the verify results.
