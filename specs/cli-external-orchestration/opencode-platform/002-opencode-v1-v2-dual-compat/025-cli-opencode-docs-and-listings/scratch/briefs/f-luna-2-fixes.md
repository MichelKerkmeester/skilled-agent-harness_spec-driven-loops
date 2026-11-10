ROLE: You make two table-cell corrections in one file. Change nothing else.

FILE: `.skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md`

FIX 1. In the §4 Core flags table, the row
`| `-f`, `--file` | array | Attach files to the message. The positional message must come first | same |`
must have its last cell (the OpenCode 2 column) say:
`listed as a single string on 2.0.32 (`--file, -f string`); whether it repeats is unverified, so pass one file per flag`
Keep the other cells. FACT: `opencode2 run --help` on 2.0.32 prints `--file, -f string    File to attach to the message`, while 1.19.3 prints `-f, --file  file(s) to attach to message  [array]`.

FIX 2. In the §3 subcommand table, the row
`| `opencode attach <url>` | Attach to a running OpenCode server | YES (for share-URL flows) |`
must have its last cell say `YES (to attach to a running server started with opencode serve)`. FACT: OpenCode 1.19.3 discontinued session sharing, so there are no share-URL flows.

VERIFY: `git diff -- .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` (report it) and `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` (report pass/fail and exit code).
