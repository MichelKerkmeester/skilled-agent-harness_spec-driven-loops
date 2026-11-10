DONE

**residue-census-classified.tsv** — 37 rows in, 37 rows out, same header and values plus `class` and `reason`:

- `must-fix` **0**
- `expected` **32**
- `record` **2**
- `none` **3**

Files: wrote `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/residue-census-classified.tsv`; read back in full to confirm 37 data rows and 7 columns. I edited nothing else.

What the classification rests on, row by row from the census itself, plus these reads on the machine: `~/.gitconfig` (`core.hooksPath` = the global hook dir), `~/.config/git/hooks/pre-commit` (resolves), `MAIN/.opencode/bin/mcp-code-mode-launcher.cjs` (resolves through the link), `~/.codex/config.toml` (line 21 header now `.../Public/.skilled`), `~/.codex/hooks.json` (`.skilled/` adapters), `~/.hermes/config.yaml:17` (still `- .opencode/bin/mcp-code-mode-launcher.cjs`), `~/.pi/agent/SYNC.md:73,75` (`.skilled/`), `~/.pi/agent/trust.json` (MAIN only), `~/.zshrc:3,32`, `~/.opencode/...` (**ENOENT** — `~/.opencode` does not exist), `~/.config/git/hooks-bridge` (**ENOENT** — bridge deleted), `MAIN/.git/hooks/pre-commit` and `anobel.com/.opencode/...` (both resolve). The `~/.skilled-cutover-backup` root exists; I could not list inside it.

Three judgment calls worth naming, since the four classes force one choice per row and two rows sit on a boundary:

- `~/.hermes/config.yaml:17` is `none`, not `must-fix`: the relative `.opencode/bin/...` argument still resolves through the checkout's `.opencode` link.
- `~/.zshrc` lines 3 and 32 are `expected`, not `none`: `$HOME/.opencode/bin` is a home bin directory, not a checkout source root, and it does **not** resolve — so `none`'s "still resolves through the link" clause fails, while "names no source root at all" holds.
- `~/.codex/prompts` is `record`, not `none`: 38 stubs, 0 matching the repository's copies and no writer in the tree, which is the packet's own home for that directory when Codex does not load it.

Only you can verify the two rows whose subject is a population I cannot enumerate without a shell — the 14 home symlinks into MAIN and the 6 links in `MAIN/.git/hooks/` — which I classified as `expected` on the census row's own wording ("into-MAIN", "into-source-root", no source root named). No command was run this turn; I have no shell tool in this session, so every resolution claim above is from a file read, and nothing is committed.

Tool calls: read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/residue-census-raw.tsv; read REPO RULES.md; read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover; read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/spec.md; read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/tasks.md; read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/plan.md; read /Users/michelkerkmeester/.gitconfig; read /Users/michelkerkmeester/.config/git/hooks/pre-commit; read /Users/michelkerkmeester/.codex/config.toml; read /Users/michelkerkmeester/.hermes/config.yaml; read /Users/michelkerkmeester/.pi/agent/SYNC.md; read /Users/michelkerkmeester/.zshrc; read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/goal.md; read /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/bin/mcp-code-mode-launcher.cjs; read /Users/michelkerkmeester/.opencode/skills/system-spec-kit/SKILL.md; read /Users/michelkerkmeester/.skilled-cutover-backup; read /Users/michelkerkmeester/.config/git/hooks-bridge; read /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/hooks/pre-commit; read /Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skills/system-spec-kit/SKILL.md; read /Users/michelkerkmeester/.pi/agent/trust.json; read /Users/michelkerkmeester/.codex/hooks.json; read repo-rules/prevent-overengineering.md; write specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/residue-census-classified.tsv; read specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/010-machine-and-consumer-cutover/scratch/residue-census-classified.tsv

pi-cline exit 0, 2026-09-17T20:19:01Z to 2026-09-17T20:23:29Z, cline-pass/cline-pass/deepseek-v4.1-flash --thinking xhigh, tools read,write.
