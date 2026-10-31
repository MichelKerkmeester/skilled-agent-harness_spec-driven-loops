# /doctor:env run record

One run of the `/doctor:env` workflow (`.skilled/commands/doctor/assets/doctor-env.yaml`) on worktree `079-doctor-command-audit`, 2026-10-02. The orchestrator executed the workflow steps by hand with Bash and Node probes. No runtime slash-command session was used. Every command below ran, and its output is quoted as observed.

## 1. Live inventory parse

The parse applies the workflow's `inventory_source.extraction` rules to `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`. It reads both supported table headers, keeps the heading path, expands multi-name cells and deduplicates by name.

| Input | Unique variables | Malformed rows |
|-------|------------------|----------------|
| ENV-REFERENCE.md as committed | 158 | none |
| A copy with one added row, `SPECKIT_DOCTOR_ENV_PROBE`, in section 5 | 159 | none |

The added row appeared without any edit to the command, so the switch list is read at run time and never copied (acceptance row AC-002).

The parse found 17 sections, from `1. OVERVIEW > Data Quality and Generator Hardening` to `DEEP-LOOP GUARD PLUGIN`. Section 5 (`GIT-HOOK MARKER`) yielded 14 per-invocation switches.

## 2. Read-only source presence

The probe reports names and set or unset only. It never prints a value.

```
SYSTEM_DIST_FRESHNESS_DISABLED process=unset hook-flags.env=unset .env=unset claude-local=unset
SPECKIT_SKIP_COMMENT_HYGIENE process=unset hook-flags.env=unset .env=unset claude-local=unset
SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD process=unset hook-flags.env=unset .env=unset claude-local=unset
SYSTEM_SPEC_GATE_ENFORCE process=set hook-flags.env=unset .env=unset claude-local=unset
```

In this worktree, `.skilled/hooks/hook-flags.env`, `.env` and `.claude/settings.local.json` do not exist (`ls` reported "No such file or directory" for each). They are reported as unset.

## 3. Preference: `SYSTEM_DIST_FRESHNESS_DISABLED` (`--dry-run`)

- Shown first: default `unset (enabled)`, type `truthy disable flag`, description "Disables dist-freshness checks. No aliases.", and its source `check-dist-staleness.sh` and `system-dist-freshness-guard.js` (ENV-REFERENCE.md:88).
- Value chosen: `1`.
- Destinations offered: `hook-flags.env` is eligible, because the example file lists the switch (`hook-flags.env.example:22`) and `hook-flags.cjs` reads that file (`hook-flags.cjs:88`). The Claude settings env block and a printed export line were also offered. `.env` was not offered.
- Preview shown: destination `.skilled/hooks/hook-flags.env`, operation `create from template and set assignment`, exact line `SYSTEM_DIST_FRESHNESS_DISABLED=1        # compiled dist staleness check`.
- Result: dry run, no confirmation was asked and no file was written. `ls .skilled/hooks/hook-flags.env` still reports no such file.

## 4. Confirmed write, against a disposable copy

To prove the write path without touching the operator's own configuration, the same change was applied to a copy of the template in a scratch directory. A test-harness yes was given after the preview above; this was not an operator answer. The real reader was then pointed at the copy through `HOOK_FLAGS_CONFIG`.

```
diff hook-flags.env.example <copy>/hook-flags.env
22c22
< # SYSTEM_DIST_FRESHNESS_DISABLED=1        # compiled dist staleness check
---
> SYSTEM_DIST_FRESHNESS_DISABLED=1        # compiled dist staleness check

Verified from <copy>/hook-flags.env:
22:SYSTEM_DIST_FRESHNESS_DISABLED=1        # compiled dist staleness check

dist-freshness enabled with file: false
dist-freshness enabled without file: true
```

Exactly one line changed and every other line was kept. The reader honours the written switch.

## 5. Secret handling

- **Corrected classification:** `SPECKIT_FOLDER_DISCOVERY_TOKEN_THRESHOLD` counts text tokens; it is a number from 0 to 1 (ENV-REFERENCE.md:161). The refined rule classifies it as a preference, not a secret. The first draft of the rule had hidden it and three other token-count thresholds.
- **No secret rows in the reference:** none of the 158 names ends in a KEY, TOKEN, PASSWORD, SECRET or CREDENTIALS segment. No description marks a value as a credential.
- **Never written:** the run asked for no secret value and wrote none. `.env` was never written.

## 6. Per-invocation switch: `SPECKIT_SKIP_COMMENT_HYGIENE`

The record shows the one-command form only, `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit ...`, taken from its Type cell `=1` and its source hook `pre-commit` (ENV-REFERENCE.md:219). It was not offered for saving.

## 7. Terminal status

`Dry run only; no files were written.` followed by `STATUS=OK`.

## Finding (recorded, not fixed)

ENV-REFERENCE.md says it documents 144 unique variables. Counted its own way, unique backticked names in the Variable column, the tables hold 158. The 14 git-hook marker rows added to section 5 did not update the count.
