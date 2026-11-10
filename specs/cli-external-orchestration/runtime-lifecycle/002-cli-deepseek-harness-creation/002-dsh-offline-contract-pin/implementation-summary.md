---
title: "Implementation Summary"
description: "The dsh 0.2.2-rc.1 headless contract is pinned offline: version and integrity, headless help, route plus lineage composition for LLM Gateway and OpenCode Go, a keyless MISSING_CREDENTIAL failure on the patched route, a relative stub plugin booting before that failure and an unchanged ~/.dsh."
trigger_phrases:
  - "dsh offline contract pin implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin"
    last_updated_at: "2026-11-06T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Offline contract pinned and recorded under evidence/"
    next_safe_action: "None, phase closed. Phase 003 cites evidence/headless-help.txt"
    blockers: []
    key_files:
      - "evidence/missing-credential.stdout.jsonl"
      - "evidence/dump-config-llmgateway.txt"
      - "evidence/dump-config-opencode-go.txt"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-085-002-dsh-offline-contract-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Live OpenCode Go endpoint, deferred to phase 013-dsh-live-contract-pin"
    answered_questions:
      - "A route patch repoints agent-default-model and the run uses the patched route"
      - "A keyless headless --json run exits 1 and ends on a final event with reason.kind error and code MISSING_CREDENTIAL"
      - "A plugin row named by a relative path loads before the provider call"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-dsh-offline-contract-pin |
| **Completed** | 2026-11-06 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The packet's dsh claims moved from source-read to observed for everything a keyless run can show. Phases 003, 004, 006 and 008 now cite captured output instead of the harness docs.

### Phase 2: dsh-offline-contract-pin

You get the headless contract of `dsh` 0.2.2-rc.1 in `evidence/`. The version is `0.2.2-rc.1` and the integrity is `sha512-ijR9...Kpg==`. The headless help lists `--json`, `--session-id`, `--permission-mode`, `--approval-policy ask|never`, `--add-dir` and task `-` reading stdin. A route patch plus the lineage patch composes to the route's provider and model in `agent-default-model`, with telemetry `mode: DISABLED` and `session-log-deepseek`, `goal-round-driver`, `command-goal` and `plan-mode` disabled. With no key, a `--json` run exits 1 and its last stdout line is a `final` event with `reason.kind` `error` and code `MISSING_CREDENTIAL` for route `llmgateway`, which shows the route patch steered the run away from `deepseek-official`. A stub plugin named `./stub-plugin.mjs` wrote its marker before that error, and `~/.dsh` did not change.

The draft patches showed the grammar phase 004 writes against: a top-level YAML list where `- id: <row>` takes `config:` (which replaces the whole row config) or `disabled: true`, and `- insert:` adds new rows.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `evidence/version.txt`, `evidence/dist-tags.json` | Created | Literal version, integrity and dist-tags |
| `evidence/headless-help.txt` | Created | Headless flag surface |
| `evidence/dump-config-llmgateway.txt`, `evidence/dump-config-opencode-go.txt` and their `.stderr.txt` | Created | Composition per route with `exit=0` |
| `evidence/missing-credential.stdout.jsonl`, `.stderr.txt`, `.parse.txt`, `evidence/exit.txt` | Created | Keyless failure shape and its parse |
| `evidence/plugin-boot.txt` | Created | Relative plugin boot marker |
| `evidence/dsh-home-diff.txt` | Created | Empty `~/.dsh` listing diff |
| `scratch/*.patch.yml`, `scratch/stub-plugin.mjs` | Created | Draft route, lineage and stub patches used only by the probes |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | Results and closure |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating Claude session ran every probe itself on 2026-11-06, as the plan requires. Each probe used a fresh `mktemp -d` as `DSH_HOME` and a temp cwd, so no profile file reached `~/.dsh` and no repo `.env` could load. The order was as follows.

1. `ls -laR ~/.dsh` saved to `scratch/dsh-home-before.txt`.
2. `dsh --version </dev/null` under a temp home, saved to `evidence/version.txt`. Then `npm view @deepseek-ai/dsh@0.2.2-rc.1 dist.integrity` and `npm view @deepseek-ai/dsh dist-tags --json`, saved to `evidence/dist-tags.json`.
3. `DSH_HOME=$(mktemp -d) dsh --profile headless --help`, saved to `evidence/headless-help.txt`.
4. Per route, `DSH_HOME=$(mktemp -d) dsh --profile headless --patch <route> --patch lineage --dump-config </dev/null`, with stdout in `evidence/dump-config-<route>.txt` and `exit=0` in the matching `.stderr.txt`.
5. The keyless run from a temp cwd, quoted as run:

```text
printf 'Reply with the single word OK' | env -i PATH HOME=$T DSH_HOME=$T DSH_STUB_MARKER=<tmpcwd>/stub-marker.txt dsh --profile headless --patch route-llmgateway --patch lineage --patch stub-boot --json -
```

   It exited 1 (`evidence/exit.txt`). stderr reads `dsh: MISSING_CREDENTIAL: llm-pi-ai: no credential for provider route "llmgateway"`.
6. The `node -e` parse of the last stdout line, saved to `evidence/missing-credential.parse.txt` with `exit=0`.
7. `ls -la` of the temp cwd and `cat stub-marker.txt`, saved to `evidence/plugin-boot.txt`.
8. `ls -laR ~/.dsh` again into `scratch/dsh-home-after.txt`, then the diff into `evidence/dsh-home-diff.txt` (0 bytes).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Draft patches stay in `scratch/` | Phase 004 owns the checked-in `.dsh/patches/`, so this phase must not create files outside its folder |
| Every probe runs under `DSH_HOME=$(mktemp -d)` from a temp cwd | Profile-scoped commands initialize missing profile files, and headless reads `<cwd>/.env`, so isolation keeps `~/.dsh` and the repo `.env` untouched |
| The keyless run uses `env -i` | It proves no provider key leaks in from the session shell, and the stderr message confirms `LLMGATEWAY_API_KEY` is not set |
| The pin names `0.2.2-rc.1` and its integrity, not a dist-tag | `latest` moved to `0.2.2-rc.1` during the packet, so a tag-based pin would have drifted silently |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cat evidence/version.txt` | `0.2.2-rc.1` |
| `evidence/dist-tags.json` | integrity `sha512-ijR9...Kpg==`, `latest` and `next` at `0.2.2-rc.1`, `alpha` at `0.2.2-alpha.3` |
| `--dump-config` per route | `llmgateway` / `deepseek-v4.1-flash-1017` and `opencode-go` / `deepseek-v4.1-flash`, telemetry `DISABLED`, four rows disabled, `exit=0`, no unmatched-target warning |
| Keyless `--json` run | exit 1, 6 events (session, 4 status, final), last line `final` with `reason.kind` `error` and code `MISSING_CREDENTIAL` |
| Relative stub plugin | `stub-marker.txt` holds `applied 2026-11-06T04:10:23.687Z` |
| `~/.dsh` listing diff | 0 bytes, `diff` exit 0 |
| Key-shaped scan over `evidence/` and `scratch/` | no match |
| `validate.sh <phase folder> --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live provider behavior.** This phase proves composition and failure shape only. Whether a route answers a real request stays UNKNOWN until phase `013-dsh-live-contract-pin` runs with an operator key.
2. **The OpenCode Go endpoint is a placeholder.** The draft `baseURL` `https://opencode.ai/zen/go/v1` was never called, so the endpoint stays UNKNOWN until phase 013.
3. **The `latest` dist-tag moved.** It now equals `0.2.2-rc.1`. The pin is unaffected because it names the literal version and integrity.
4. **Recording gaps closed after the first pass.** `evidence/commands.txt` now records the literal command line and exit code of every probe, and the temp homes and cwds were removed on 2026-11-06.
5. **Tarball byte identity is UNKNOWN.** The integrity is recorded, but no offline comparison with the source clone ran.
<!-- /ANCHOR:limitations -->

---
