---
title: "Implementation Summary"
description: "The /doctor:git setup battery now tells the truth about any repository it inspects, and every repair it prints works when pasted. All 19 findings of the second v4.0.0.11 review were confirmed and fixed."
trigger_phrases:
  - "second review remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-git/033-git-setup-customization/009-second-review-remediation"
    last_updated_at: "2026-10-16T21:05:20Z"
    last_updated_by: "generate-context"
    recent_action: "Final gates passed"
    next_safe_action: "Await coordinator changelogs"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/git-setup-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs"
      - ".skilled/skills/sk-git/scripts/hooks/README.md"
    session_dedup:
      fingerprint: "sha256:2487431501c456380fb81972b2f98f80942ae8fc867af7f2fdc1b64606974815"
      session_id: "scaffold-009-second-review-remediation"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 009-second-review-remediation |
| **Completed** | 2026-10-16 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The setup battery used to give right answers only on its own checkout. Now it reads the files and links git, the hooks and the advisory actually use in the repository you point it at, and every repair line it prints survives being pasted into a shell.

### Phase 9: second-review-remediation

All five P1 and fourteen P2 findings in `../scratch/review-v4.0.0.11.md` held up against the code, so none was rejected. In `.skilled/commands/doctor/scripts/git-setup-check.cjs`, the trust row now passes a clone whose hooks link into its own tree. The advisory-rules row reads the repository's own `hard-rules.json` and is DEGRADED when it is missing. A registration counts only when the advisory file it runs exists. Repairs quote their paths, and a stray `.DS_Store` no longer fails the hooks row. Hermes is the seventh runtime, `--tool=hermes` on this checkout ends `STATUS=OK checks=11`, and a muted advisory now degrades the run. The four gated commands put their input gate before section 1, and the docs say what the code does.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | Every code finding |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | 47 to 58 tests, one failing case per fix |
| `.skilled/commands/doctor/git.md`, `assets/doctor-git-setup.yaml`, `assets/doctor-git-presentation.txt` | Modified | Hermes, step wording, a Detail column |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modified | The sk-git leg line only |
| `.skilled/commands/deep/research.md`, `deep/review.md`, `deep/ai-council.md`, `prompt/improve.md` | Modified | Input gate moved before section 1 |
| `.skilled/skills/sk-git/SKILL.md`, `README.md`, `scripts/hooks/README.md` | Modified | Seven runtimes, one registration entry per runtime |
| `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md`, `manual-testing-playbook/doctor-commands/doctor-git-setup-check.md` | Modified | Environment, trust, rules and exit wording |
| `.hermes/skills/sk-git/SKILL.md` | Regenerated | Hermes mirror |
| `README.md` | Modified | Trust, shared files and verify lines |
| `../008-out-of-scope-cleanup/implementation-summary.md` | Modified | The stale gate limitation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna (gpt-6-luna, max, fast) made every edit outside the spec folder, one dispatch at a time, 26 dispatches in all. DeepSeek through cli-pi was tried first and returned a billing error ("daily pacing allowance") without writing anything, so every change went to Luna. Before each dispatch the targets were backed up. After each one the orchestrator diffed the files, ran the battery tests and ran a mutation check: the old battery put back, the new test run, the fix restored. Every code fix has a test that fails on the old code.

Two dispatches failed. Dispatch 5 wrote regex literals with doubled backslashes, left the battery unparseable and reported itself incomplete, so the battery was restored from its backup, its tests kept, and dispatch 5b redid the battery half. The first dispatch 10 halted before editing on a test that fails only inside the Codex sandbox, where Apple's git writes `xcrun_db` into the temp dir. The preamble was amended to name that artifact and the retry succeeded. No change was hand-edited.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A missing repository rule file is DEGRADED, not FAIL | The advisory stays silent and nothing breaks, which matches how a gate saved off is reported |
| The fsmonitor marker assertion was removed, not rewritten | No battery query refreshes the index, so it could never fail. The gpg.program test already proves the safe environment reaches every git child |
| The finding check lives in `plan.md` section 8, not `research/research.md` | It is one table of confirmations, and the research template would carry it in sections it does not need |
| No changelog was written | The operator assigned changelogs to the coordinator |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `run-all.sh` | 7 of 7 suites, node 346/346 (baseline 334/334). The battery file went from 47 to 58 tests. The rest of the delta is the parallel build's |
| `git-setup-check.cjs --tool=claude` | `STATUS=OK checks=11`, exit 0 |
| `git-setup-check.cjs --tool=hermes` | `STATUS=OK checks=11`, exit 0 (baseline: usage error, exit 2) |
| Mutation checks | 17 of 17 caught, one per code fix plus a targeted one for the opencode/pi import check |
| `route-validate.sh` | `OK: route-validate — 14 routes validated, 2 warnings` |
| `package_skill.py .skilled/skills/sk-git --check` | `Result: PASS`, 4,990 words |
| `hvr_scan.py` | 0 new hard blockers on the 16 docs in scope |
| `validate_document.py` | 0 issues on all 12 markdown docs touched, typed where a type applies |
| `validate-playbook-package.cjs --package sk-git` | PASS, 46 scenarios, 0 violations |
| `sync-skills-hermes.cjs --check` | PASS, 68 in sync |
| `sync-runtime-mirrors.cjs --check` | PASS, 185 mirrors across 8 trees |
| `run-all-drift-guards.sh` | All 4 guards passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`_routes.yaml` still lists six `--tool` values.** Line 283 of `.skilled/commands/doctor/_routes.yaml` reads `--tool=<claude|codex|devin|cursor|opencode|pi>`. The parallel 035 build owns that file, so `hermes` is left for the coordinator. route-validate compares flag names only, so it still passes.
2. **The Hermes check reads the plugin, not the session.** Hermes loads project plugins only when `HERMES_ENABLE_PROJECT_PLUGINS` is set, and the battery cannot see that variable in the Hermes process. The hooks README states the requirement.
<!-- /ANCHOR:limitations -->

---
