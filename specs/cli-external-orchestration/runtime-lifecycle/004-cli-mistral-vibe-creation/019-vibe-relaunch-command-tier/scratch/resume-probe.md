# Headless resume probe

Environment: Vibe 3.1.2, `MISTRAL_API_KEY` set (never printed), a fresh `VIBE_HOME` under a
mktemp directory, a temp project directory outside the checkout, and the repository's model
config copied into the fresh home so the closed roster resolves. Every run used
`--output-dir` outside the checkout and ended with `</dev/null`.

## Run 1: a keyed headless run that stops on `--max-turns 1`

```bash
cd "$probe_root/project" && VIBE_HOME="$probe_root/home" \
  vibe -p "Reply with exactly: alpha" --model deepseek-flash --max-turns 1 \
  --output-dir "$probe_root/out1" </dev/null
```

Exit code: `0`

Stdout: `alpha`

`out1/export.json`: `exit_code: 0`, `outcome: finished`,
`session_id: 15ba9c0a-4f9b-7cbe-caf9-d909e28fde89`, `config.active_model: deepseek-flash`.

## Run 2: the literal resume form

```bash
cd "$probe_root/project" && VIBE_HOME="$probe_root/home" \
  vibe -p --resume 15ba9c0a-4f9b-7cbe-caf9-d909e28fde89 --model deepseek-flash \
  --output-dir "$probe_root/out2" </dev/null
```

Exit code: `1`

Stderr: `Error: No prompt provided for programmatic mode`

`out2/export.json`: `exit_code: 1`, `outcome: usage_error`.

## Run 3: a resume with a prompt and the roster model

```bash
cd "$probe_root/project" && VIBE_HOME="$probe_root/home" \
  vibe -p "What single word did you reply with in the previous turn? Reply with just that word." \
  --resume 15ba9c0a-4f9b-7cbe-caf9-d909e28fde89 --model deepseek-flash \
  --output-dir "$probe_root/out3" </dev/null
```

Exit code: `1`

Stderr: `Error: --model only applies to a new session`

`out3/export.json`: `exit_code: 1`, `outcome: usage_error`.

## Run 4: a resume without `--model`

```bash
cd "$probe_root/project" && VIBE_HOME="$probe_root/home" \
  vibe -p "What single word did you reply with in the previous turn? Reply with just that word." \
  --resume 15ba9c0a-4f9b-7cbe-caf9-d909e28fde89 \
  --output-dir "$probe_root/out4" </dev/null
```

Exit code: none. The repository's `cli-mistral-vibe` hard rule `vibe-closed-roster` refused
the dispatch before Vibe started, because the command names no roster alias through `--model`.

## Verdict

The headless resume path is **UNVERIFIED**. Vibe 3.1.2 rejects `--model` on a resume
(`--model only applies to a new session`), while the repository's `vibe-closed-roster` hard
rule refuses a resume dispatch that names no roster alias. The two cannot both be satisfied,
so a resume that continues a run stopped by `--max-turns 1` was not observed. Resuming needs
either a guard exemption for resume dispatches or a Vibe release that accepts the model flag
on resume.
