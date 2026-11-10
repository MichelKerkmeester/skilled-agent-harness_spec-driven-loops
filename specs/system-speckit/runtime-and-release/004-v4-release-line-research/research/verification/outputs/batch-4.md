### V25
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:718-742,846-854` - the mixed-write check recovers only when the write follows the read-only match; the probe returned `read_only_override` for “Update the README and review the result” and `file_write_match` for the reversed wording. `AGENTS.md:75` says a read-only word next to a write trigger does not disqualify it.
COMMAND: `bun -e "...classifyPrompt(...)"` -> exit 0
CORRECTED CLAIM: -

### V26
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts:201,839-843` - the reported phrase “review the packet then resume it” returned `no_match` because the trigger is `resume the packet`. But the recognized `/deep:research` alias returned `triggersGate3:false, reason:"no_match"` after “review the packet”; lines 840-841 allow that read-only override.
COMMAND: `bun -e "...classifyPrompt(...)"` -> exit 0
CORRECTED CLAIM: The quoted phrase is not recognized as a resume trigger. Separately, a recognized `/deep:research` trigger can be suppressed by a read-only word through the resume branch’s override.

### V27
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.gitignore:60` - `dist/`; `git check-ignore` matched the writer path, `git ls-files ... | wc -l` returned `0`, and `ls -l` showed the file exists locally. `.skilled/commands/doctor/assets/doctor-install.yaml:34` checks `runtime/dist`. `.skilled/skills/system-spec-kit/runtime/tsconfig.json:26-29,47-48` references only `../shared` and excludes `cli/**`; `runtime/package.json:16-17` builds that runtime project. `validate.sh:409-418,430-433` recommends that runtime build, while `runtime/cli/package.json:13` defines a separate CLI build.
COMMAND: `git check-ignore -v <writer path>` -> exit 0; `git ls-files <CLI dist path> | wc -l` -> exit 0 (0); `ls -l <writer path>` -> exit 0
CORRECTED CLAIM: -

### V28
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/core/config.ts:131-146,355` - when neither the git top-level nor `cwd` uses Spec Kit, the resolver returns `runtimeRoot`, which initializes `PROJECT_ROOT`. `generate-context.ts:1214,1218-1222` uses that config root by default. The probe returned this checkout’s path and printed the fallback message. Commit `6f42c7b1691403ac103e4cc9a8806b9d2bb271a4` contains the resolver change.
COMMAND: `bun -e "...resolveProjectRoot('/tmp/no-project-here')"` -> exit 0
CORRECTED CLAIM: -

### V29
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:24-28` sources libraries from `SCRIPT_DIR`; `:1405-1417` sets `REPO_ROOT` from the caller’s git top-level; `:1477,1665,2253` derive `TEMPLATES_BASE` from that target root. The help at `:275-302` does not document `SPECKIT_TEMPLATES_BASE`.
COMMAND: `nl -ba .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` -> exit 0
CORRECTED CLAIM: -

### V30
VERDICT: CHANGED
SEVERITY: propose P2 because the current README documents the phase-parent exemption, making this a release-note scope mismatch rather than an unexpected validator behavior
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:975-976` returns `ANCHORS_VALID: pass` before parsing anchors for a phase parent. `README.md:303` explicitly says phase-parent validation skips the native `ANCHORS_VALID` rule. The v4.0.0.5 note at `.skilled/changelog/skilled/v4.0.0.5.md:108-110` broadly says nested anchors fail validation without stating that exception.
COMMAND: `nl -ba .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` -> exit 0
CORRECTED CLAIM: Strict validation skips anchor checks for phase parents as documented in the README; the v4.0.0.5 release note should state that exception.

### V31
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs:203-210` filters zero-score rows only when `scoringOnly` is true. The typo query returned 20 zero-score rows with `truncated:true` and exit 0; with `--scoring-only`, it returned no rows and exit 1.
COMMAND: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- 'validaton rulles strict'` -> exit 0; same command with `--scoring-only` -> exit 1
CORRECTED CLAIM: -

BATCH DONE