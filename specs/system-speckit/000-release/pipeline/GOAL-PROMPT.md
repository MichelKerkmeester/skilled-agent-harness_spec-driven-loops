# The one goal prompt

Paste this to run the whole thing hands-off (cheap models only, no Opus):

> **Run the v4 release-notes pipeline.** Execute `bash specs/system-speckit/000-release/pipeline/run.sh`. It gathers every change from `v3.6.0.0` to `HEAD` across all in-window packets using cheap models only — DeepSeek V4 Flash for per-packet extraction, a cheap synth model for section/assembly — and produces `release-notes-v4.0.0.0.md` plus a README edit proposal. It is resumable and writes its outputs into the `000-release` packet. Report the summary block when done. Do not use Opus and do not edit the shipped README (the pipeline only proposes README edits).

Or just run the command directly:

```bash
bash specs/system-speckit/000-release/pipeline/run.sh            # all phases, resumable
bash specs/system-speckit/000-release/pipeline/run.sh --preflight # readiness check only
bash specs/system-speckit/000-release/pipeline/run.sh --fresh     # wipe + full rerun
bash specs/system-speckit/000-release/pipeline/run.sh --from 3    # resume from consolidate
```

---

## What it does (5 phases, one command)

| Phase | Script | Kind | Model | Output |
|------|--------|------|-------|--------|
| 1 Seed | `01-seed.sh` | deterministic | — | per-packet bounded sources + `manifest.tsv` |
| 2 Extract | `02-fanout.sh` → `02-extract.sh` | fan-out, concurrency 5, resumable + auto-retry | **DeepSeek V4 Flash** (`opencode-go`) | `fragments.jsonl` |
| 3 Consolidate+Synthesize | `03-consolidate.sh` (det) + `04-synthesize.sh` | split user-facing/internal by `audience`; 1 call/section | **synth model** | `003-synthesis/sections/*.md` |
| 4 Assemble | `05-assemble.sh` | synth intro + deterministic stitch + internal appendix | **synth model** | `004-release-notes-reduce/release-notes-v4.0.0.0.md` |
| 5 README | `06-readme-delta.sh` | proposal only (never edits shipped README) | **synth model** | `005-readme-update/readme-delta.md` |

## Models (cheap only — configurable in `config.sh`)

- **Extraction:** `opencode-go/deepseek-v4-flash` — high volume, mechanical, proven clean headless.
- **Synthesis (default):** `opencode-go/deepseek-v4-pro` — same gateway as extraction (one auth, one dispatch shape = most reliable hands-off). Cheap.
- **Synthesis (operator's stated choice, GLM):** `export V4_RN_SYNTH_KIND=devin` → `glm-5-2` (GLM-5.2 High, free tier) via cli-devin. Requires `devin auth login` + a smoke test first; the pipeline never silently substitutes a model.

## Safety properties

- **Read-only workers, parent writes.** Models emit text on stdout; the shell writes every file. No `--dangerously-skip-permissions`, no worker write authority → the RM-8 destructive-write class cannot occur.
- **Hang guard.** Every dispatch uses `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 … </dev/null`.
- **No shipped edits.** The README is only proposed against (Phase 5), never auto-edited.
- **Durable + resumable.** Work dir is `~/.cache/v4-release-notes` (stable across sessions, safe to delete); phase markers skip completed work. Outputs live in the packet.
- **Pre-flight gates every run** (auth + self-invocation); aborts if not ready.

## Tunables (env)

`V4_RN_CONCURRENCY` (5) · `V4_RN_SYNTH_KIND` (opencode|devin) · `V4_RN_BASELINE` (v3.6.0.0) · `V4_RN_TARGET` (HEAD) · `V4_RN_WORK` (~/.cache/v4-release-notes).
