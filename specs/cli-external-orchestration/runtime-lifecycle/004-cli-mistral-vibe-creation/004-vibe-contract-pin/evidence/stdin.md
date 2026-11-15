# Stdin as a prompt source (vibe 3.1.2)

Run A: `echo "<prompt>" | vibe -p --model deepseek-flash --output-dir <dir>` from a temp cwd with an isolated `VIBE_HOME`.

exit: 0 (export.json `exit_code` 0, `outcome` finished)
answered: yes, stdout `OK`

Run B, the same pipe with no `-p` at all, exits 1 with `Error: Interactive mode needs a terminal. Use -p/--prompt to run without one.`

So stdin is a prompt source only behind a bare `-p`. A dispatch that pipes its prompt must still pass `-p`.

## Prompt file without `-p`

Run C: `vibe --prompt-file ./prompt.txt --model deepseek-flash --output-dir <dir> </dev/null`, the same isolation.

exit 0, `export.json` `outcome` finished, stdout `OK`. `--prompt-file` alone runs print mode.
