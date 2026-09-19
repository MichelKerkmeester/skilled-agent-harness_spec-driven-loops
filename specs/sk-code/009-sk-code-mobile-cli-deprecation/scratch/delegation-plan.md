# Delegation plan and dispatch record

Working record for the cli-pi lanes that execute the sweep. This file is the brief side of the
record; each lane's return lands beside it as `<change-id>-return.md`.

## Executor

| Field | Value |
|-------|-------|
| Executor | `pi` CLI through the `cli-pi` packet (`.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md`) |
| Model | `llmgateway/deepseek-v4.1-flash` (DevPass), `--thinking max`, `--mode text` |
| Command shape | `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model llmgateway/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null` |
| Depth | 1 (leaf) |
| Write authority | Only the file(s) named in that change's brief, inside this repository |
| Forbidden | Commits, pushes, new files outside `scratch/`, edits to a file another change owns, hand-editing any generated artifact |

## Gate pre-resolution (every brief carries these)

1. **Spec folder**: `specs/sk-code/009-sk-code-mobile-cli-deprecation` — decided by the operator,
   do not ask.
2. **Spec-doc authoring**: reserved to the orchestrator; the leaf writes no packet doc.
3. **Comment hygiene**: never embed an ADR/REQ/CHK/task id or a spec path in a code comment;
   write the durable reason instead.
4. **No git**: no `git add`, `git commit`, no branch or push.
5. **One change per brief** (cli-pi ALWAYS rule, added in v1.5.4.0 after a five-change brief read
   ~995K characters and wrote nothing). The plan's three clusters are therefore dispatched as
   per-change briefs, chained rather than batched into one prompt. Same executor, same scope,
   finer granularity — recorded here as a deviation from the approved plan's wording.
6. **Return shape**: 3-line summary plus a full report at `scratch/<change-id>-return.md`, and
   for every claim a `file:line` citation. No narrative.

## Blocked prerequisite (observed)

Every dispatch attempt was refused by the runtime's dispatch preflight:

```
Pi dispatch denied for cli-pi. Name the matching executor in the user request.
```

`.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` (`shouldDenyPiDispatch` →
`hasExplicitModeOverride`) authorizes a `pi -p` dispatch only when the captured operator text
contains the exact token `cli-pi`. The operator's request said "cli pi llmgateway" (space form),
which the matcher cannot see, and an `ask_user_question` answer does not reach the guard's
raw-input store. The command shape and the cli-pi hard rules are already satisfied — the probe
classifies as `direct`/`cli-pi` and carries `</dev/null`, `--offline` and a provider-qualified
`--model` — so the only missing piece is the operator's token.

## Changes, in dispatch order

### Lane A — hub de-registration and history scrub

| ID | Change | Files | Check that proves it |
|----|--------|-------|----------------------|
| A1 | Drop the mode entry and its `tieBreak` slot | `.skilled/skills/sk-code/mode-registry.json` | `parent-skill-check` `5b`, `5e`, `5i` |
| A2 | Drop its router signals, vocabulary contributions and resource entries | `.skilled/skills/sk-code/hub-router.json` | `parent-skill-check` `5c`, `5d` |
| A3 | Drop the `MOBILE_CLI` intent key, its `RESOURCE_MAP` entries and the surface prose | `.skilled/skills/sk-code/ROUTER.md` | `parent-skill-check` `12a`, `5d` |
| A4 | Drop the mode-table row, set the version authority to `4.2.3.0` | `.skilled/skills/sk-code/SKILL.md` | `parent-skill-check` `6b`, `13a`, `13b` |
| A5 | Drop the derived vocabulary, entities and key file for the removed surface | `.skilled/skills/sk-code/graph-metadata.json` | `ci-skill-derived-freshness.cjs` |
| A6 | Drop the packet from the description and keywords | `.skilled/skills/sk-code/description.json` | `parent-skill-check` `8a`, `8b` |
| A7 | Remove the `PI_REMOTE` markers, precedence row and CWD signals | `.skilled/skills/sk-code/shared/references/stack-detection.md` | Compiled-route replay (AC-004) |
| A8 | Add the removal entry; correct the two historical entries that describe the surface | `.skilled/skills/sk-code/changelog/v4.2.3.0.md` (new), `v3.3.0.0.md`, `v4.2.2.0.md` | `parent-skill-check` `7a`, `13b` |
| A9 | Scrub the enumerated surface from the three benchmark reports | `.skilled/skills/sk-code/benchmark/reports/compiled-routing/2026-07-21--{acceptance,real,verify}--luna-high/skill-benchmark-report.json` | Sweep census (AC-012) |

### Lane B — removal and pure consumers

| ID | Change | Files | Check that proves it |
|----|--------|-------|----------------------|
| B1 | Delete the surface packet | `.skilled/skills/sk-code/sk-code-mobile-cli/` (82 files) | `find … -type f` → 0 (AC-001) |
| B2 | Drop the deleted root from the fail-closed allowlist | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Playbook validation + discovery assertion (AC-011) |
| B3 | Correct the nested-packet reference example that cites the removed packet | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Link integrity (AC-010) |
| B4 | Refresh the frozen directory manifest with its own writer | `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | `test_readme_manifest.py` (AC-007) |
| B5 | Refresh the frozen verdict baseline with its own writer | `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | `test_readme_verdict_parity.py` (AC-007) |

### Lane C — sibling and README

| ID | Change | Files | Check that proves it |
|----|--------|-------|----------------------|
| C1 | Keep the mirrored conventions, drop the dead attribution and cited paths | the 13 `sk-code-obsidian` files named in `spec.md` §3 | Link integrity + playbook `--strict` (AC-010) |
| C2 | Retarget the `OB-021` negative control off `PI_REMOTE` | `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/surface-detection/negative-control-non-obsidian.md` | Its own documented commands run, expecting `UNKNOWN` |
| C3 | Drop the packet from the replaceable-surface list | `README.md` (root) | Census (AC-013) |
| C4 | Correct the obsidian changelog entry that names the removed packet | `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.0.0.md` | Census (AC-012) |

### Orchestrator — regenerations (no leaf dispatch)

`generate-leaf-manifest.cjs --write .skilled/skills/sk-code`, the hub derived-block repair,
`skill_graph_compiler.py --export-json`, then `generate-trigger-index.mjs` last because it
indexes this packet's own frontmatter. Compiled closure: drop the removed case from
`canary-cases.v1.json`, re-run the sk-code `build-artifacts.cjs` harness, re-mint the activation
manifest, copy it onto the authored program copy, then `compiled-route-guard.cjs`.

## Orchestrator receipts (observed)

- Anchor commit `79646e642283fccf5373be73fb7ece3accc4e3ce` on `skilled/v4.0.0.0`.
- Baseline census: packet 82 files / 668K; `sk-code-mobile-cli|PI_REMOTE` matches 81 files and 674 mentions across `.skilled/skills` + root `README.md`.
- Baseline route, mobile prompt: `{"targets":[{"packetId":"sk-code-mobile-cli",…}],"effectivePolicyHash":"8721b2a7…","generation":2}`.
- Baseline route, quality prompt: `{"targets":[{"packetId":"sk-code-quality",…}],"effectivePolicyHash":"8721b2a7…","generation":2}`.
- Baseline `parent-skill-check .skilled/skills/sk-code`: `OK — all hard invariants passed, 0 warnings`, version `4.2.2.0`.
- Executor availability: `pi` resolves at `/Users/michelkerkmeester/.local/bin/pi`; `LLMGATEWAY_API_KEY` is set.
- Packet validation: `validate.sh specs/sk-code/009-sk-code-mobile-cli-deprecation --strict` → `RESULT: PASSED`.
