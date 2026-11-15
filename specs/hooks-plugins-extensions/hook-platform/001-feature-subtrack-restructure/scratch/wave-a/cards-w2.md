## directive-lifecycle
- Purpose: Records, per session, whether the Skill Advisor's constant directive block has already been delivered, and re-arms full delivery only on a lifecycle boundary (`startup` / `resume` / `compact` / `clear` / `post-compact`) so the block appears at startup and after a compaction rather than on every turn. A decision function picks `full` or `suppressed` against a durable file-backed store, and a boundary adapter advances that store on host lifecycle events.
- Kind: mix: library (decision core + store) and hook (Claude boundary adapter)
- Code: .skilled/hooks/directive-lifecycle/README.md, .skilled/hooks/directive-lifecycle/claude/directive-lifecycle-boundary.ts, .skilled/hooks/directive-lifecycle/claude/speckit-directive-lifecycle-boundary.ts, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts, .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts
- Runtimes: claude (the only runtime subfolder; codex, cursor, devin, opencode and pi reach the same decision core inside their shared prompt-submit paths, with no standalone adapter folder)
- Mirrors: none
- Kill switch: SYSTEM_DIRECTIVE_LIFECYCLE_DISABLED (.skilled/hooks/hook-flags.env.example:29)
- Packets:
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/014-cross-runtime-directive-lifecycle | Spec: Cross-Runtime Directive Lifecycle
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/015-directive-docs-alignment | Spec: Directive-Lifecycle Documentation Alignment
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/016-directive-playbook-alignment | Spec: Directive-Lifecycle Playbook Alignment
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/017-adapter-live-delivery-verification | Spec: Adapter Live-Delivery Verification
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery | Feature Specification: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/019-pi-directive-startup-compaction-only | Feature Specification: Directive Delivery — Startup + Compaction Only (Pi directives-only gap fix)
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction/013-pi-local-directive-dedup | Spec: Pi-Local Directive De-Duplication
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/directive-lifecycle/001-injection-bloat-reduction | Per-Prompt Injection Bloat Reduction
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/directive-lifecycle/003-retire-governor-and-proof-directives | Feature Specification: Retire the Governor and Proof-Over-Appearance Directives
  - MENTIONS | CHILD | specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/004-headless-fallback-status-and-dedup | Feature Specification: Headless Fallback Status and Dedup
  - MENTIONS | CHILD | specs/system-skill-advisor/runtime-lifecycle/004-defect-and-hardening-fixes/003-fix-remaining-advisor-defects | Feature Specification: Restore the pi advisor dedup return, renew the drifted advisor battery and close the stale documentation surfaces
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/skill-advisor/002-pi-advisor-bridge/001-restore-pi-advisor-brief | Feature Specification: restore the pi skill advisor brief: probe either root name for the warm-CLI assets and key the directive dedup receipt on the full contribution
  - 13 more MENTIONS omitted
- Evidence: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121 (`decideDirectiveLifecycleDelivery`); .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-contract.ts:7 (`DIRECTIVE_SEPARATOR = '\nDirectives:'`); .skilled/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts:36 (`advanceDirectiveLifecycleBoundary(state, input?.session_id)`)
- Unsure: The hub folder holds only relative symlinks, so the cited line numbers are in the canonical skill sources, not in files under .skilled/hooks/directive-lifecycle/. I did not open `.skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts` or the Pi `prompt-advisor.ts` the README names, so the durable-store internals and Pi's embedded dedup are the README's account.

---

## dispatch
- Purpose: Evaluates a composed CLI dispatch command's declared hard rules before it spawns, denying on a `block`-severity violation and attaching an advisory on a `warn`, then appends one scrubbed, truncated JSONL line per completed dispatch to a size-rotated audit log. Both cores are dependency-free and shared by every runtime adapter, and the audit never decides, it only records.
- Kind: mix: hook adapters + library cores
- Code: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs, .skilled/hooks/dispatch/lib/dispatch-audit.mjs, .skilled/hooks/dispatch/claude/, .skilled/hooks/dispatch/codex/, .skilled/hooks/dispatch/cursor/, .skilled/hooks/dispatch/devin/, .skilled/hooks/dispatch/dsh/, .skilled/hooks/dispatch/opencode/, .skilled/hooks/dispatch/pi/
- Runtimes: claude, codex, cursor, devin, dsh, opencode, pi
- Mirrors: .opencode/plugins/cli-dispatch-audit.js; .pi/extensions/dispatch-audit.ts, .pi/extensions/dispatch-preflight-lint.ts
- Kill switch: SYSTEM_DISPATCH_DISABLED, SYSTEM_DISPATCH_GUARD_DISABLED (.skilled/hooks/hook-flags.env.example:30-31)
- Packets:
  - OWNS | CHILD | specs/hooks-plugins-extensions/goal/001-goal-hooks-cross-runtime/006-dispatch-shape-coverage | Feature Specification: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/002-fable-governor-pi-hook/006-dispatch-authorization-hardening | Pi Dispatch Authorization Boundary Hardening
  - OWNS | CHILD | specs/hooks-plugins-extensions/directive-lifecycle/002-fable-governor-pi-hook/007-dispatch-validation-evidence | Dispatch Validation, Evidence, and Corpus Baseline
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/dispatch/001-dispatch-adapter-test-repair | Feature Specification: Document the owning runner for the dispatch adapter vitest suites
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/040-dispatch-lint-held-fixes | Feature Specification: Phase 40: dispatch-lint-held-fixes
  - OWNS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/051-dispatch-lint-nested-quote-gap | Feature Specification: Phase 51: dispatch-lint-nested-quote-gap
  - OWNS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/007-dispatch-recognition-and-stress-adapter | Feature Specification: Phase 7: dispatch-recognition-and-stress-adapter
  - OWNS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/007-dispatch-recognition-and-hard-rules | Feature Specification: Phase 7: dispatch-recognition-and-hard-rules
  - OWNS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/014-extend-dispatch-coverage | Feature Specification: Phase 2: extend-dispatch-coverage
  - MENTIONS | TOP-LEVEL | specs/cli-classifier/003-cli-jev-workflow-integration/040-hard-rules-sidecar | Feature Specification: Phase 40: hard-rules-sidecar
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/001-cli-hermes-creation/011-dispatch-preflight-parity-research | Feature Specification: Phase 1: dispatch-preflight-parity-research
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/015-closeout/004-dispatch-guard-and-vitest | Feature Specification: Phase 4: dispatch-guard-and-vitest
  - 64 more MENTIONS omitted
- Evidence: .skilled/hooks/dispatch/lib/dispatch-audit.mjs:51 (`DISPATCH_SHAPES` registry); .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:548 (`CHECKS`); .skilled/hooks/dispatch/lib/dispatch-audit.mjs:1227 (`recordDispatch`)
- Unsure: The README says 41 checks are registered; I confirmed `CHECKS` exists at line 548 but did not count its entries. The bare term "dispatch" matched 802 spec.md files, so the packet search was narrowed to the concern's own identifiers (`cli-dispatch`, `dispatch-preflight`, `dispatch-audit`, `dispatch-rule-checks`), which matched 76.

---

## dist-freshness
- Purpose: Compares compiled `dist/` output against its TypeScript sources and, when stale, triggers a rebuild so a session that imports a compiled script never runs against an out-of-date build. The OpenCode plugin owns the mid-session projection into system context, and a per-runtime shell check surfaces a bounded stdout banner on the editor runtimes.
- Kind: mix: plugin (OpenCode projection) + hook (per-runtime shell banner)
- Code: .opencode/plugins/system-dist-freshness-guard.js, .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh, .skilled/hooks/dist-freshness/claude/, .skilled/hooks/dist-freshness/codex/, .skilled/hooks/dist-freshness/cursor/, .skilled/hooks/dist-freshness/devin/, .skilled/hooks/dist-freshness/opencode/
- Runtimes: claude, codex, cursor, devin, opencode
- Mirrors: .opencode/plugins/system-dist-freshness-guard.js (the `opencode/` subfolder is a browsability-only symlink back to it); none in .pi/extensions
- Kill switch: SYSTEM_DIST_FRESHNESS_DISABLED (.skilled/hooks/hook-flags.env.example:32)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/dist-freshness/001-dist-staleness-rebuild-on-drift | Spec: Dist Staleness Rebuild-on-Drift
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/dist-freshness/002-dist-guard-skip-unprovisioned | Spec: Dist Guard Skip Unprovisioned Packages
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/016-validate-sh-dist-freshness-and-repo-remediation | Feature Specification: validate.sh Dist Freshness + Repo-Wide Remediation
  - OWNS | CHILD | specs/system-speckit/memory-search-and-knowledge/003-memory-search-intelligence/003-spec-data-quality/016-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement | Feature Specification: Dist Freshness Enforcement
  - MENTIONS | TOP-LEVEL | specs/system-skill-advisor/runtime-lifecycle/005-build-freshness-record | Feature Specification: Record the advisor runtime dist build so a fresh build writes its own freshness attestation
  - MENTIONS | CHILD | specs/system-skill-advisor/codebase-conformance/004-advisor-status-truthfulness/001-freshness-and-scan-truth | Feature Specification: Phase 1: freshness-and-scan-truth
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/028-plugin-kill-switch-coverage | Feature Specification: Phase 28: plugin-kill-switch-coverage
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/003-hook-library-mk-rename | Feature Specification: Hook Library mk- Prefix Rename
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/002-pins-imports-dual-export | Feature Specification: Phase 2: pins-imports-dual-export
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/002-quality-agnostic-gate/010-alignment-audit | Feature Specification: Phase 10: alignment-audit
  - MENTIONS | CHILD | specs/sk-doc/doc-validation-tooling/002-readme-validation-debt/001-repo-doc-debt/007-alignment-fixes | Feature Specification: doc checker accuracy and README debt fixes
  - 31 more MENTIONS omitted
- Evidence: .opencode/plugins/system-dist-freshness-guard.js:142 (`MkDistFreshnessGuardPlugin`); .opencode/plugins/system-dist-freshness-guard.js:236 (`experimental.chat.system.transform`); .skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:163 (`STALE DIST WARNING` with the rebuild command)
- Unsure: The shared checker core `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs` was not opened; I confirmed only that the plugin imports `checkAllFreshness` from it at line 26. The README calls `check-dist-staleness.sh` a Python 3 script despite the `.sh` suffix, which I did not verify beyond its Python-style contents.

---

## env-secret-guard
- Purpose: Denies a file-tool call or a shell call that would read or write a dotenv file, then after a shell call puts back any dotenv file that changed, was deleted or was created and scans the output for a dotenv value. It also answers three value-free questions about a dotenv file: the keys it defines, the lines that fail to parse, and an HMAC-SHA256 fingerprint of one value keyed by `ENV_SECRET_GUARD_PEPPER`.
- Kind: mix: hook + plugin + extension + CLI
- Code: .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs, .skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs, .skilled/hooks/env-secret-guard/cli/env-secret.cjs, .skilled/hooks/env-secret-guard/command-hook/, .skilled/hooks/env-secret-guard/pi/, .skilled/hooks/env-secret-guard/dsh/, .skilled/hooks/env-secret-guard/opencode/, .skilled/hooks/env-secret-guard/tests/
- Runtimes: dsh, opencode, pi (plus `command-hook/` shared by claude, codex, cursor and devin)
- Mirrors: .opencode/plugins/env-secret-guard.js; .pi/extensions/env-secret-guard.ts
- Kill switch: SYSTEM_ENV_SECRET_GUARD_DISABLED (.skilled/hooks/hook-flags.env.example:33, which notes it is environment-only and not read from that file)
- Packets:
  - OWNS | TOP-LEVEL | specs/hooks-plugins-extensions/env-secret-guard/001-env-secret-guard | Feature Specification: env secret guard for every runtime
  - MENTIONS | TOP-LEVEL | specs/hooks-plugins-extensions/hook-platform/006-file-relative-adapter-imports | Feature Specification: Pi loads hook adapters on every version
  - MENTIONS | TOP-LEVEL | specs/system-speckit/repo-operations/005-main-ci-red-checks | Feature Specification: Repair the five checks that fail on main
- Evidence: .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:770 (`evaluateToolCall`); .skilled/hooks/env-secret-guard/lib/env-secret-guard.cjs:998 (`fingerprint`, keyed by `ENV_SECRET_GUARD_PEPPER` at line 25); .skilled/hooks/env-secret-guard/lib/env-secret-watch.cjs:277 (`reviewToolResult`)
- Unsure: The runtime registration files the README names (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`) were not opened, so the per-runtime deny shapes are the README's account. I also did not open `.skilled/hooks/env-secret-guard/dsh/env-secret-guard.mjs` or the Pi `env-secret-guard.ts` adapter.

---

## git
- Purpose: A standalone, opt-in Git hook surface: `install-hooks.sh` symlinks `pre-commit` into the repository's git hook directory, and `pre-commit` runs the comment-hygiene and agent-mirror-sync gates over staged files, exiting 0 when neither blocks. The README calls this the standalone/legacy surface and names `.skilled/scripts/install-git-hooks.sh` as the repository's primary installer.
- Kind: git hook
- Code: .skilled/hooks/git/install-hooks.sh, .skilled/hooks/git/pre-commit, .skilled/hooks/git/install-hooks.test.sh
- Runtimes: none (a native Git hook invoked from the git hook directory, with no per-runtime adapters)
- Mirrors: none
- Kill switch: SYSTEM_GIT_COMMIT_HOOKS_DISABLED (.skilled/hooks/hook-flags.env.example:34), read through `hook_enabled git-commit-hooks`
- Packets:
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/001-git-hook-review-fixes | Feature Specification: Phase 1: git-hook-review-fixes
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/002-git-hook-review-residuals | Feature Specification: Phase 2: git-hook-review-residuals
  - MENTIONS | CHILD | specs/hooks-plugins-extensions/git-preflight-and-message-gate/001-template-driven-message-enforcement/003-hook-docs-and-standards-alignment | Feature Specification: Phase 3: hook-docs-and-standards-alignment
  - MENTIONS | CHILD | specs/cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/042-hooks-and-plugins-held-fixes | Feature Specification: Phase 42: hooks-and-plugins-held-fixes
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate | Feature Specification: Phase 3: codex-mirror-gate
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/004-portable-code-modes/002-quality-hygiene-policy | Feature Specification: Phase 2: quality-hygiene-policy
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/041-skilled-source-root-migration/012-fix-deep-review-p1-p2-findings-for-source-root-migration | Feature Specification: Phase 12: fix-deep-review-p1-p2-findings-for-source-root-migration
  - MENTIONS | CHILD | specs/sk-git/worktree-lifecycle/004-fsmonitor-daemon-and-worktree-relocation-regression/005-reaper-hardening | Feature Specification: Phase 5: reaper-hardening
  - MENTIONS | CHILD | specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/015-dsh-hook-parity | Feature Specification: Phase 15: dsh-hook-parity
  - MENTIONS | CHILD | specs/sk-code/hub-architecture/003-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate | Feature Specification: Phase 4: debt-report-and-hermes-gate
  - MENTIONS | CHILD | specs/sk-code/quality-and-review-modes/002-quality-agnostic-gate/001-honest-checker | Feature Specification: Phase 1: honest-checker
  - MENTIONS | CHILD | specs/system-speckit/runtime-and-release/001-system-speckit-v4/041-skilled-source-root-migration/005-gate-and-ci-readiness | Feature Specification: Gate and CI Readiness
  - 11 more MENTIONS omitted
- Evidence: .skilled/hooks/git/pre-commit:29 (`hook_enabled git-commit-hooks || exit 0`); .skilled/hooks/git/pre-commit:75 (`git_bounded diff --cached --name-only -z --diff-filter=ACM`); .skilled/hooks/git/install-hooks.sh:22 (`ln -sf "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"`)
- Unsure: The bare term "git" matched 201 spec.md files, so the packet search was narrowed to the feature's own paths (`hooks/git/pre-commit`, `hooks/git/install-hooks`, `hooks/git/README`), which matched 23; every one of those references the folder without making it the packet's subject. I did not open the primary hook at `.skilled/scripts/git-hooks/pre-commit`.
