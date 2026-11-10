## Edit 1

File: `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/keep-list.tsv`

OLD:

~~~~text
.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md	\.opencode
~~~~

NEW:

~~~~text
.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/README.md	\.opencode
# The Codex sync manifest states both roots are owned by the installer, which prunes an orphan under either name.
.codex/SYNC.md	as its own orphan\*\* and prunes it; paths outside both roots
~~~~
