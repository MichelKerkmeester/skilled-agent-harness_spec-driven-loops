ROLE: You correct two documented facts in the cli-opencode skill and add one line to a doctor README. Edit prose and table cells only; keep headings, anchors and voice. Short, plain sentences. No new sections.

FACT A — where agents load from (verified 2026-10-20; evidence `scratch/row11-v1-agent-list.txt`, `scratch/row9-row11-v2-nested-listings.txt`):
- Both versions load project agents from `.opencode/agents/<slug>.md` (OpenCode 1.19.3 scans `{agent,agents}/**/*.md` in each config directory; OpenCode 2.0.32 lists the same 11 repo agents).
- In this repository `.opencode/agents` is a symlink to `.skilled/agents/`, which is where the files are edited.
- OpenCode 1.19.3's other config directories are `~/.config/opencode/` (or `$XDG_CONFIG_HOME/opencode/`), `~/.opencode/` and `$OPENCODE_CONFIG_DIR`. Which of those OpenCode 2.0.32 reads is unverified.
The one statement to use: "OpenCode loads `.opencode/agents/<slug>.md`, which in this repository links to `.skilled/agents/`, where the files are edited."

FACT B — `run` flags (captured live 2026-10-20: `scratch/row31-v1-run-help.txt`, `scratch/row31-v2-run-help.txt`):
- OpenCode 1.19.3 `run --help` lists: `--print-logs`, `--log-level` (`DEBUG`, `INFO`, `WARN`, `ERROR`), `--pure`, `--command`, `-c/--continue`, `-s/--session`, `--fork`, `-m/--model`, `--agent`, `--format`, `-f/--file`, `--title`, `--attach`, `-p/--password`, `-u/--username`, `--dir`, `--port`, `--variant`, `--thinking`, `-i/--interactive`, `--auto`.
- OpenCode 2.0.32 `run --help` lists: `--standalone`, `--server`, `-c/--continue`, `-s/--session`, `--fork`, `-m/--model` (`provider/model#variant`), `--agent`, `--format`, `-f/--file`, `--title`, `--thinking`, `--auto`. `--log-level` and `--print-logs` are GLOBAL flags on 2.0.32, and `--log-level` there takes lowercase `all`, `trace`, `debug`, `info`, `warn`, `warning`, `error`, `fatal`, `none`. There is no `-p/--password`, `-u/--username` or `-i/--interactive` on 2.0.32 `run`.

EDITS (all under `.skilled/skills/cli-external-orchestration/cli-opencode/` unless the path says otherwise):
1. FACT A, replace each runtime-load claim that names `.skilled/agents/` as the place OpenCode loads from, or `~/.opencode/agents/` as the only user-level fallback, with the one statement (adapt the grammar, keep each sentence's other content):
   - `references/cli-reference.md`: the `--agent` table row (`loads from .skilled/agents/<slug>.md`) and the §6 AGENT FLAG first sentence.
   - `references/opencode-tools.md`: the sentence starting ``The `--agent <slug>` flag loads an agent definition from``.
   - `references/agent-delegation.md`: the sentence `Project-local agents resolve from .skilled/agents/<slug>.md. User-level agents fall back from ~/.opencode/agents/<slug>.md ...` (name the three user-level directories of FACT A and say which version that was verified on); the diagram line `Resolves .skilled/agents/<slug>.md frontmatter` → `Resolves .opencode/agents/<slug>.md frontmatter`; the sentence about `As @review:` that says it loads `.skilled/agents/review.md` → `.opencode/agents/review.md`.
   - Leave alone every sentence that says the repo ships or edits its agents under `.skilled/agents/`; that is true.
2. FACT B, in `references/cli-reference.md` §4 Core flags table:
   - `--log-level` row: OpenCode 2 column becomes `global flag on 2.0.32, lowercase all, trace, debug, info, warn, warning, error, fatal, none`.
   - `--print-logs` row: OpenCode 2 column becomes `global flag on 2.0.32`.
   - `-p, --password` row: OpenCode 2 column becomes `absent on run`.
   - Add three rows in the table's style, after `--thinking`: `-u, --username` (OpenCode 1 only, basic auth username, defaults to `OPENCODE_SERVER_USERNAME` or `opencode`; OpenCode 2 `absent on run`); `-i, --interactive` (OpenCode 1 only, direct interactive split-footer mode, default false; OpenCode 2 `absent on run`); `--auto` (boolean, auto-approve permissions that are not explicitly denied, dangerous; OpenCode 2 `same`).
   - Add one row for `--standalone` (OpenCode 2 only): OpenCode 1 cells `—`, purpose `Run with a private server instead of the background service`.
   - Fix any sentence near the table that says the `--log-level` behavior is unverified on OpenCode 2.
3. FACT B, in `SKILL.md` the `### Core Invocation Pattern` first paragraph: the OpenCode 1 core flag list adds `--title`, `--command`, `--attach` (with `-p`/`-u`), `-i` and `--auto` to what it already names; the OpenCode 2 sentence also says `run` adds `--standalone` and `--server`, and that the log flags are global flags there.
4. `.skilled/command-support/doctor/scripts/README.md`: after the `skill-visible` bullet add `` - `command-listed`: PASS when every `.md` file under the project's `.opencode/command(s)` folder is listed and every listed name comes from a folder the runtime reads (the global config folders, and on OpenCode 2 every ancestor `.opencode` folder plus the built-ins `init` and `review`). ``

DO NOT edit `manual-testing-playbook/`, `changelog/` or `benchmark/`.

VERIFY (run each, report output and exit code):
1. `rg -n 'loads? (an agent definition )?from `\.skilled/agents|resolve from `\.skilled/agents|Resolves \.skilled/agents|from `\.skilled/agents/review' .skilled/skills/cli-external-orchestration/cli-opencode -g '!changelog/**' -g '!benchmark/**' -g '!manual-testing-playbook/**'` (expect no line)
2. `rg -n 'unverified on OpenCode 2.0.32' .skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` and confirm none is about `--log-level`, `--print-logs` or `-p`.
3. `node --test .skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs`

REPORT: each file changed and the verify results.
