---
title: "Implementation Summary"
description: "Every documented OpenCode 2 provider check now lists models with --standalone and filters for the provider prefix (some short notes only say to confirm the provider in the listing), so it answers correctly and never asks the shared service; a doc scan test in the battery job holds it."
trigger_phrases:
  - "opencode2 models provider check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/027-opencode2-models-provider-check"
    last_updated_at: "2026-10-20T13:05:31Z"
    last_updated_by: "generate-context"
    recent_action: "Applied the round-5 fixes; 13 of 13 cli-opencode tests pass"
    next_safe_action: "Run Luna review round 6, the last round, then merge main and push"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-opencode2-models-provider-check"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-opencode2-models-provider-check |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The OpenCode 2 provider check in the cli-opencode docs never worked. 2.0.32's `models` takes no provider argument, so `opencode2 models llmgateway` exits 1 even though `llmgateway` is configured, and the bare form the other docs quoted asks the shared background service. Every current doc now quotes `opencode2 models --standalone`, and every provider check, in the pre-flight and in the provider-check sentences, filters for the `<provider>/` prefix. Some shorter notes still say only to confirm the provider in the listing (Known Limitations).

### Phase 27: opencode2-models-provider-check

The pre-flight in `cli-reference.md` is now two blocks, one per version. The OpenCode 2 block lists once on a private server and filters per provider, so it reports `llmgateway` present and `opencode-go` absent, which is what 2.0.32 actually lists. A v2-only layout runs the same block under the name `opencode`. The other sites that told you to confirm a provider in `opencode2 models` say `opencode2 models --standalone`. A new test reads every current CLI skill doc and the Hermes copy and fails on either old form, and the battery job runs it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/references/cli-reference.md` | Modified | The pre-flight paragraph, the pre-flight split into an OpenCode 1 block and an OpenCode 2 block, three inline spans, and an OpenCode 1 label with the v2 form on the subcommand row, the MiMo row, the default-model paragraph and the LLM Gateway note |
| `cli-opencode/SKILL.md`, `cli-opencode/README.md` | Modified | The provider-argument sentences, plus one inline span in the README |
| `cli-opencode/references/install-and-versions.md` | Modified | The listing table row, its citation and the v2 layout sentence |
| `cli-opencode/references/providers-and-models.md` | Modified | One inline span, and an OpenCode 1 label, with the v2 form where v2 has the provider, on seven `opencode models` sites |
| `cli-opencode/references/context-budget.md` | Modified | An OpenCode 1 label on the `opencode-go` confirmation |
| `cli-opencode/assets/`, `cli-opencode/references/` (three more), `cli-opencode/manual-testing-playbook/` (19 files) | Modified | `--standalone` on each inline span |
| `cli-devin/references/providers-and-models.md` | Modified | The same inline span |
| `cli-pi/references/providers-and-models.md`, `cli-opencode/references/destructive-scope-violations.md`, `cli-opencode/manual-testing-playbook/prompt-templates/minimax-design-context-manifest.md` | Modified | An OpenCode 1 label on an `opencode models` command |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerated | `sync-skills-hermes.cjs` from the edited `SKILL.md` |
| `cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Created | The form classifier (positional arguments, `--server` without a URL), the redirect and continuation cases, the `opencode2` doc scan, the rule that every `opencode models` command, in prose or a fenced block, names OpenCode 1 (a v2-only layout names its v2 binary `opencode`), the required Hermes copy, and the pre-flight check, read without shell comments, that the OpenCode 2 block sets `OPENCODE_GO_OK` and `LLMGATEWAY_OK` from anchored prefixes |
| `.github/workflows/opencode-dual-version.yml` | Modified | The unit-test step runs the new test, and both path filters list every Markdown file under `cli-external-orchestration`, which the test reads |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The target came from live probes before any edit: v2 `models --help`, the positional form's error, a standalone listing with a private `OPENCODE_DB`, and v1's exit codes for a listed and a missing provider (`scratch/`). DeepSeek v4.1 flash at max thinking wrote the test, the inline pass, the targeted sentences, the workflow line and the redirect fix through five literal briefs. The orchestrator wrote this folder's docs, ran the Hermes generator and ran every check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Filter `opencode2 models --standalone` with `grep '^<provider>/' >/dev/null`, not `grep -q` | `grep -q` exits on the first match and can close the pipe early, which a caller under `pipefail` would see as a failure; the full read cannot |
| `--standalone` rather than `--server <url>` in the docs | A reader has no server URL to hand, and `--standalone` keeps the check off the shared service; the test still accepts `--server` |
| Scan all of `cli-external-orchestration`, not only cli-opencode | cli-devin quotes the same command, and a doc that tells you to run it is wrong wherever it lives |
| Reword the dated `install-and-versions.md` citation instead of exempting it | It quoted the bare form; the new wording keeps the 2026-10-18 date and adds today's standalone probe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baseline cli-opencode tests | 5 of 5 pass (`scratch/baseline-cli-opencode-tests.txt`) |
| cli-opencode tests after | 13 of 13 pass |
| New test against main's docs | 2 of 4 fail, naming 49 sites, the 49 the baseline listed (`scratch/mutation/m0-old-docs.txt`) |
| Mutants | Dropping the positional rule fails 1 test, dropping the `--standalone` rule fails 1, reverting the remainder pattern fails 2, an unanchored pre-flight grep fails 1, accepting `--server` without a URL fails 1, not joining backslash continuations fails 1, filtering the default's variable for `^llmgateway/` fails 1, never accepting a version label fails 2, an OpenCode 2 block without its `llmgateway` check fails 1, a single-space binary pattern fails 1, unlabelling the OpenCode 1 block fails 1, commenting out the OpenCode 2 `llmgateway` check fails 1, deleting the Hermes copy fails 2, and letting a label cover its whole line again fails 1 (`scratch/mutation/m1-*` to `m18-*`) |
| Test against the round-4 docs | 1 of 8 fails: six commands whose only label sat in another clause of their line (`scratch/mutation/m17-round4-docs.txt`) |
| Test against the round-3 docs | 1 of 8 fails: seven `opencode models` commands without an OpenCode 1 label (`scratch/mutation/m14-round3-docs.txt`) |
| Test against the round-2 docs | 2 of 8 fail: the one mixed pre-flight block and the unlabelled `SKILL.md` and `README.md` forms (`scratch/mutation/m10-round2-docs.txt`) |
| Prose rule against the docs before its labels | 1 of 7 fails (`scratch/mutation/m8-unlabelled-v1-docs.txt`) |
| OpenCode 2 pre-flight block live | Extracted from `cli-reference.md` and run under `bash -o pipefail`: `default=0 minimax_token=0 minimax_direct=0 llmgateway=1`, exit 0; the old form exits 1 for the listed `llmgateway` too (`scratch/preflight-live.txt`) |
| `sync-skills-hermes.cjs --check` | PASS: 68 copies in sync |
| `check-gate-inputs.sh`, `actionlint` | Both exit 0 after the filter change |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Many v2 sentences say "confirm the provider in the listing" without naming the prefix.** About 25 sites, mostly the playbook's version notes, tell a v2 reader to confirm a provider in `opencode2 models --standalone` without saying to look for the `<provider>/` prefix. The command is right and runs on a private server; the wording could be sharper. Recorded as a follow-up from the final review round.
2. **A version label is read per clause in prose and per line in fenced blocks.** In prose the label must sit in the command's clause (split at table cells, `;`, sentence ends, `, or ` and em dashes); in a fenced block it may sit on the command's line or the block's first line. A clause that labels one command and carries a second unlabelled one passes. A prose form the clause scan cannot see is caught only by review.
<!-- /ANCHOR:limitations -->

---
