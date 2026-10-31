# Resource Map - Jev completion-claim audit (cli-jev 026), lineage deepseek

Emitted from this lineage's converged deltas (40 findings across 5 iterations; no target-spec resource-map.md existed, so the coverage gate was skipped).

## Scorer and detector

| Resource | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | The scorer: census, regex errors, gates, verdict, jev arm, output guard, report |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md` | Contract summary: boundaries, keep rule, entrypoints |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | The detector + policy core shared by all adapters |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Synthetic fixture canaries (400-char edge, flips, margin, keep; stub jev) |

## Consumers and wiring

| Resource | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` + `.claude/settings.json:175-181` | Claude Stop adapter (async, timeout 10) |
| `.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` + `.codex/hooks.json:128-140` | Codex Stop adapter (timeout 10) |
| `.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` + `.devin/hooks.v1.json:160-172` | Devin Stop adapter (timeout 10) |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/completion-evidence.ts` + `.pi/extensions/completion-evidence.ts` | Pi turn_end adapter (next-turn advisory) |
| `.opencode/plugins/system-completion-sentinel.js` | OpenCode session.idle adapter (host-blocking) |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` | Cursor adapter: present, unwired in `.cursor/hooks.json` |
| `.skilled/hooks/shared/hook-flags.cjs` | Concern flags and kill switches (completion aliases at :63-69) |

## Transport

| Resource | Role |
|---|---|
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Jev transport contract, when-not-to-use (secrets), subcommands |
| `.skilled/skills/cli-classifier/cli-jev/references/cli-reference.md` | noul/choice/score/run shapes, exit codes, flags |
| `.skilled/skills/cli-classifier/cli-jev/references/providers-and-models.md` | Providers, keys, endpoints, default model ids |

## Corpus and recorded runs (read-only, outside the repository)

| Resource | Role |
|---|---|
| `~/.skilled/.labels/026-rows.jsonl` | 110 real turns (50 Pi + 60 Claude) |
| `~/.skilled/.labels/026-labels-047.jsonl` | 110 labels (10 yes, 100 no) |
| `~/.skilled/.labels/026-claims.jsonl` | The 042 Pi-only label set (0 yes) |
| `~/.skilled/.labels/runs/047-026-jev-20261002/{report.json,calls.jsonl}` | The recorded live run (331 calls) |
| `~/.skilled/.labels/runs/047-026-jev.stdout.txt` | The verdict stdout |

## Packets

| Resource | Role |
|---|---|
| `047-measure-every-jev-feature/scratch/evidence/results.md` | The measured row (:15) and the feature family |
| `047-measure-every-jev-feature/spec.md` | Measurement requirements (REQ-003: no secrets to Jev) |
| `042-label-drafting-and-confirmation/spec.md`, `implementation-summary.md` | Label method and ADR-001 |
| `026-completion-claim-audit/` | Original feature packet |
