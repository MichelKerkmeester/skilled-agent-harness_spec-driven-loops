---
title: "Implementation Summary"
description: "Every documented OpenCode 2 provider check now lists models with --standalone and filters for the provider prefix, so it answers correctly and never asks the shared service; a doc scan test in the battery job holds it."
trigger_phrases:
  - "opencode2 models provider check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/027-opencode2-models-provider-check"
    last_updated_at: "2026-10-20T12:00:48Z"
    last_updated_by: "generate-context"
    recent_action: "Finished docs, Hermes copy, test and workflow line; 9 of 9 cli-opencode tests pass"
    next_safe_action: "Run the Luna review, then merge main and push"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/opencode2-models-form.test.cjs"
      - ".skilled/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-opencode2-models-provider-check"
      parent_session_id: null
    completion_pct: 80
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

The OpenCode 2 provider check in the cli-opencode docs never worked. 2.0.32's `models` takes no provider argument, so `opencode2 models llmgateway` exits 1 even though `llmgateway` is configured, and the bare form the other docs quoted asks the shared background service. Every current doc now lists with `opencode2 models --standalone` and filters for the `<provider>/` prefix.

### Phase 27: opencode2-models-provider-check

If you follow the pre-flight in `cli-reference.md` on OpenCode 2 now, it reports `llmgateway` present and `opencode-go` absent, which is what 2.0.32 actually lists, and it runs on a private server. The other sites that told you to confirm a provider in `opencode2 models` say `opencode2 models --standalone`. A new test reads every current CLI skill doc and the Hermes copy and fails on either old form, and the battery job runs it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `cli-opencode/references/cli-reference.md` | Modified | The pre-flight paragraph and its v2 script line, three inline spans, and the v1 label and v2 form on the subcommand row and the MiMo row |
| `cli-opencode/SKILL.md`, `cli-opencode/README.md` | Modified | The provider-argument sentences, plus one inline span in the README |
| `cli-opencode/references/install-and-versions.md` | Modified | The listing table row, its citation and the v2 layout sentence |
| `cli-opencode/references/providers-and-models.md` | Modified | One inline span, and the v1 label and v2 form on its three `opencode models <provider>` sites |
| `cli-opencode/assets/`, `cli-opencode/references/` (three more), `cli-opencode/manual-testing-playbook/` (19 files) | Modified | `--standalone` on each inline span |
| `cli-devin/references/providers-and-models.md` | Modified | The same inline span |
| `.hermes/skills/cli-opencode/SKILL.md` | Regenerated | `sync-skills-hermes.cjs` from the edited `SKILL.md` |
| `cli-opencode/scripts/tests/opencode2-models-form.test.cjs` | Created | The form classifier (positional arguments, `--server` without a URL), the redirect and continuation cases, the doc scan and the anchored pre-flight filter check |
| `.github/workflows/opencode-dual-version.yml` | Modified | The unit-test step runs the new test |
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
| cli-opencode tests after | 10 of 10 pass |
| New test against main's docs | 2 of 4 fail, naming 49 sites, the 49 the baseline listed (`scratch/mutation/m0-old-docs.txt`) |
| Mutants | Dropping the positional rule fails 1 test, dropping the `--standalone` rule fails 1, reverting the remainder pattern fails 2, an unanchored pre-flight grep fails 1, accepting `--server` without a URL fails 1, and not joining backslash continuations fails 1 (`scratch/mutation/m1-*` to `m6-*`) |
| Pre-flight line live | `llmgateway` OK=1, `opencode-go` OK=0, unknown OK=0 under `pipefail`; the old form exits 1 for `llmgateway` too (`scratch/preflight-live.txt`) |
| `sync-skills-hermes.cjs --check` | PASS: 68 copies in sync |
| `check-gate-inputs.sh`, `actionlint` | Both exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A cli-devin-only edit does not start the battery job.** The test scans cli-devin's docs, but the workflow's path filter lists cli-opencode and the Hermes copy only, so a change confined to cli-devin is checked on the next run that does trigger. Adding cli-devin to the filter would run the whole two-version battery on every cli-devin edit.
2. **`opencode models` is read as OpenCode 1.** In a v2-only layout the v2 binary is named `opencode`, and no scan can tell from one line which layout a reader has. The docs label every `opencode models <provider>` site as the OpenCode 1 form and give the v2 form beside it, and `install-and-versions.md` covers the v2-only layout; the test checks only the `opencode2` name.
3. **The test reads quoted commands, not prose.** A sentence that describes the bare form without quoting it in backticks or a code block is not checked.
<!-- /ANCHOR:limitations -->

---
