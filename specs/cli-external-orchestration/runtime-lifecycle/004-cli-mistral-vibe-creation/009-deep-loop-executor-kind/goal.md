---
title: "Goal: Phase 9: deep-loop-executor-kind"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deep loop executor kind goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind"
    last_updated_at: "2026-11-14T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Closed the Vibe executor kind phase"
    next_safe_action: "Phase 011 adds the goal bridge"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-vibe-plans-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Alias source: the aliases come from the phase 006 model rows, both with thinking max"
      - "Process name, catalog membership and --prompt-file: answered by phase 004"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: deep-loop-executor-kind

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a deep-loop run use Vibe as an isolated executor kind whose lineages are scored from `export.json`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The adapter builds print mode only. ACP stays deferred |
| D2 | A Vibe lineage counts as success only with an `export.json` whose `exit_code` is 0. Exit 3 with an export is recorded as a per-lineage partial outcome and never counted as success. No export records failure, which separates Vibe's exit 3 from the recursion guard's |
| D3 | The recursion guard matches `vibe-rs` and `vibe-app-server`, the names phase 004 saw in the ancestor walk. Amended 2026-11-14 from "both `vibe` and `vibe-rs` until phase 004 shows", as the original decision anticipated |
| D4 | Vibe runs only as a fan-out lineage, as dsh does, because the lineage-local `VIBE_HOME`, output folder and export scoring live in the fan-out adapter. The YAML branch refuses single-executor use and names `--count=2` or a second `--executor` group, so the end-to-end proof runs a Vibe lineage beside a second group |
| D5 | Reasoning effort is pinned by the model row's `thinking`, never by a flag. The kind rejects `reasoningEffort` |
| D6 | No default model or default executor changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Every row in `acceptance-criteria.md` is `Met`
- [x] One keyed Vibe research lineage, run beside a second executor group, has an `export.json` showing `exit_code` 0
- [x] The three executor unit suites print zero failures and more than 365 passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Unit baseline | Done | `Tests  365 passed (365)` over the three executor unit files on 2026-11-14 |
| Stress baseline | Done | `153 passed, 8 skipped` before the kind; `175 passed, 9 skipped`, 9 files, zero failures after it |
| Kind, adapter, scoring | Done | Unit suites `Tests  382 passed (382)`; typecheck exit 0; T020 preflight `[]` |
| Keyed lineage | Done | `research/keyed-lineage-run/lineages/vibe-1/vibe-output/export.json`: `"exit_code": 0`, beside the `oc-1` group; `iterations/iteration-001.md` written |
| Operator Vibe home | Done | `find ~/.vibe -newer vibe-1/vibe-prompt.txt` printed nothing |

### Deviations and findings

| Item | Note |
|------|------|
| Exit 3 collision | `RECURSION_GUARD_EXIT_CODE = 3` at `executor-audit.ts:26`, and Vibe uses exit 3 for a run stopped without finishing. D2 tells them apart by `export.json` |
| Per-lineage partial | `rg -n "'partial'" fanout-run.cjs` printed only lines 3571 and 4321, both run-level. Lineages settle as fulfilled or rejected, so T005 locates the result record and T011 adds the per-lineage outcome |
| Budget flags | Flag support carries no turn, token, price or time budget, so a keyed run cannot request exit 3. The exit 3 path is proven with a shim (SC-002) |
| Binary table | `EXECUTOR_BINARY_BY_KIND` holds one string per kind, so T007 widens it before Vibe can carry two names |
| Process name | Answered by phase 004: the ancestor walk sees `vibe-rs` and its child `vibe-app-server`, never `vibe`, because the Python launcher execs away |
| Catalog membership | Answered by phase 004: neither roster id resolves without a hand-written model row (`Unknown model ... Available: mistral-medium-3.5`), so the rows use their own aliases, `deepseek-flash` and `glm-flash`; `mistral-medium-3.5` stays selectable until `allowed_models` closes it |
| Alias source | Answered: the aliases come from the model rows phase 006 wrote, and T003 read `thinking = "max"` on both `deepseek-flash` and `glm-flash` |
| Prompt delivery | Answered by phase 004: `--prompt-file` alone runs print mode (exit 0, no `-p` needed), and stdin is a prompt source only behind a bare `-p` (`echo ... | vibe -p` exits 0); a pipe with no `-p` exits 1, "Interactive mode needs a terminal". The adapter uses `--prompt-file`, so the prompt stays out of the process list |
| Single-executor use | D4 follows the dsh precedent at `deep-research-auto.yaml:1216`. If the operator wants single-executor Vibe runs, D4 is the amendment point |
| AC-012 superseded | Adding the kind forced edits to two existing cases in `executor-config.vitest.ts`: the kind count and the web-search matrix model id. ADR-001 supersedes AC-012 with AC-013. The agent decided this under the operator's no-further-decisions instruction |
| T020 stdin rule | The rendered command fails `stdin-redirect-required` as bare argv. The runner never inherits stdin: `input: ''` is forwarded (`fanout-run.cjs:2310`), opens stdin as a pipe (2105) and ends it at once (2201). Written as `</dev/null`, the command returns `[]`. The keyed run exited 0 without hanging |
| D3 superset | The binary table lists `vibe` as well as the two D3 names. Matching an extra name can only widen the recursion guard |
| Keyed evidence location | CHK-050 asked for `scratch/`; the keyed run lives in `research/keyed-lineage-run/`, kept as the quoted evidence. A secret scan found no `MISTRAL_API_KEY` value, no `vibe-home` folder and no key-shaped string there |
| Unguarded lineages | The lineage journal holds 136 hook records, all from `builtin:agents_md`. The repository's guard hooks never ran, because the lineage trusts only its own folder. Vibe lineages run with `--auto-approve` and no confinement. Amended on 2026-11-14 by phase 011: the adapter renders the hooks into the lineage's home, so the guards now load |
| Stale skill docs | `cli-mistral-vibe/SKILL.md` and `README.md` still said the executor kind was out of scope and the mode unregistered. Corrected here, since phase 012 does not list those files |
<!-- /ANCHOR:log -->
