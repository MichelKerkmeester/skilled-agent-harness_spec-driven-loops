### V40
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags.sh:29-33` sets the rule to `warn` when its helper fails. `.skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:344-347` reports “not inside a git repository” and returns 2. `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:1425` sets `passed` from `summary.errors === 0`; `:1508` prints `RESULT` from `report.passed`.
COMMAND: read only -> exit 0
CORRECTED CLAIM: -

### V41
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts:317-323` skips a dist file when its mapped source exists. `:364-377` also checks compiled siblings, so the checker does more than detect orphan dist files. Neither check compares dist freshness or content.
COMMAND: `nl -ba .skilled/skills/system-spec-kit/runtime/cli/evals/check-source-dist-alignment.ts | sed -n '220,410p'` -> exit 0
CORRECTED CLAIM: The checker also detects compiled siblings, but a dist file passes whenever its mapped source exists, even if the dist file is stale.

### V42
VERDICT: CHANGED
SEVERITY: propose P2 because validation still fails, while the early return hides additional diagnostics.
EVIDENCE: `.skilled/skills/sk-doc/scripts/validate_skill_package.py:258-272` invokes `package_skill.py --check`. `.skilled/skills/sk-doc/scripts/package_skill.py:1696-1699` returns immediately when frontmatter is invalid. The missing-router finding is generated at `:1288-1295` and promoted under strict mode at `:297-307` and `:1648-1655`; it remains reachable after frontmatter passes.
COMMAND: read only -> exit 0
CORRECTED CLAIM: Invalid frontmatter short-circuits later resource and routing checks. With valid frontmatter, `--strict` still rejects a missing sibling `ROUTER.md`; validating a fresh scaffold that already has one does not exercise that case.

### V43
VERDICT: CHANGED
SEVERITY: agree P1
EVIDENCE: `.skilled/skills/sk-doc/leaf-manifest.json:125-137` lists the packet-local leaves. The existence probe found five missing packet paths. The files are under `sk-doc/shared/references` for `core-standards.md`, `evergreen-packet-id-rule.md` and `validation.md`, under `sk-doc/shared/assets` for `llmstxt-templates.md`, and under `sk-create-with-human-voice/references` for `hvr-rules.md`.
COMMAND: `node -e` manifest path-existence probe -> exit 0
CORRECTED CLAIM: Five listed packet-local paths are missing. Three files live under `sk-doc/shared/references`, one under `sk-doc/shared/assets` and one under `sk-create-with-human-voice/references`.

### V44
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs:39` matches digits `[1-9]` followed only by `)`. The fixture at `.skilled/hooks/ask-surface-guard/fixtures/prose-menu-numbered.json:2-4` expects a numbered menu to fire. The pure probe returned `null` for dotted numbering and `10)` options, and detected a `1)`/`2)` how-to list ending in a yes/no question.
COMMAND: `node -e` fixture and detector probe -> exit 0
CORRECTED CLAIM: -

### V45
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs:81-84` reads stdin with `readFileSync(0, 'utf8')`. `.skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs:41-45` does the same. `.skilled/hooks/shared/hook-adapter-shared.cjs:17-19` describes the deadline, and `:62-74` implements the timer-based reader.
COMMAND: `rg -n -C 7 'readFileSync\\(0|deadline|stdin' .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs .skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs .skilled/hooks/shared/hook-adapter-shared.cjs` -> exit 0
CORRECTED CLAIM: -

### V46
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.opencode/plugins/ask-surface-guard.js:102` keys the marker on `messageId || lastMessage`. `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs:107-108` keys it on the session and `turn`. Pi keys it on `run.operatorKey` at `pi/ask-surface-guard.ts:107`, derived from the last user message at `:62-67`. Claude stops re-blocking when `stop_hook_active` is true at `claude/ask-surface-stop.cjs:91-93`.
COMMAND: `rg -n -C 4 'markTurn|stop_hook_active|once per|once-per|turnKey|messageId|agent_end|turn-stopping' .skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs .skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs .skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts .skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs .opencode/plugins/ask-surface-guard.js` -> exit 0
CORRECTED CLAIM: -

### V47
VERDICT: CONFIRMED
SEVERITY: agree P1
EVIDENCE: `.skilled/hooks/dispatch/claude/dispatch-audit-posttooluse.mjs:56-57` chooses `payload.cwd` before `CLAUDE_PROJECT_DIR` and joins the default log path. `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:1158` sets that path to `.skilled/logs/cli-dispatch-audit.log`. The nested log exists, and `git check-ignore` matched `.gitignore:263`.
COMMAND: `ls -l specs/system-speckit/047-v4-release-line-research/.skilled/logs; git check-ignore -v specs/system-speckit/047-v4-release-line-research/.skilled/logs/cli-dispatch-audit.log; nl -ba .gitignore | sed -n '255,270p'` -> exit 0
CORRECTED CLAIM: -

BATCH DONE