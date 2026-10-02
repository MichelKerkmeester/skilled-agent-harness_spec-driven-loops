# Deep Review — Iteration 2: Security

- Run: review-i2-g1 · Session: 2026-10-02T11:19:37Z · Generation: 1 · Mode: review · Target agent: @deep-review (leaf)
- Review target: uncommitted sk-git message-contract upgrade (scope aliases, 80-char subject warning, required breaking-commit sections)
- Diff base: main 03afeb4552 (`git rev-parse HEAD` confirms) · Prior findings: P0=0 P1=0 P2=2 (R1-P2-001, R1-P2-002 — open, not re-reported)
- Doctrine loaded: review-core.md (severity contract; baseline security minimums: injection exposure, unsafe secrets handling, privilege misuse, reliability risks with security impact)
- State-log projection: withheld per the run note (append gateway refused with ATTRIBUTION_COLLAPSE on the directly-written config row). This iteration writes iteration-002.md and deltas/iter-002.jsonl only; the orchestrator records the ledger event.

## DIMENSION

Security — attack surface introduced by the three new keys (`subject.scopeAliases`, `subject.warnLength`, `body.breakingSections`) plus the wiring that carries untrusted commit/PR text into the rules: object-key handling, interpolation into messages, regex/DoS growth, CI event fields, and the value-to-path handling in the in-scope enforcement library.

Evidence tiers:

- OBSERVED by command: `printf … | node --input-type=module` probe calling `validateCommit` with a filesystem-backed `specExists` mirror of `worktreeContext` — `REL=["."]`, `ERRORS=[]`; `path.posix.join("specs","..")` → `"."`. `git cat-file -e HEAD:.` exits non-zero ("path '.' exists on disk, but not in 'HEAD'").
- OBSERVED by read: the six diff files, both unchanged consumers (validate-message.mjs, commit-msg hook), the two agent-gate importers, the template rules block, the workflow.
- NOT RUN by containment: `node --test` and the shell hook suites; pass counts stay INFERRED for iteration 3.

## FILES REVIEWED

| File | Read |
|------|------|
| .skilled/skills/sk-git/scripts/lib/message-contract.mjs | full; new sites at :54, :66, :186-199, :342-356, :432-437, :459-464; security-relevant at :502-516, :537-548, :694, :747 |
| .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs | new tests at :83-101, :118-144, :161-184, :255-281 |
| .skilled/skills/sk-git/assets/commit-message-template.md | full; changed at :159-167, :192-204, :227-239, :253 |
| .skilled/skills/sk-git/SKILL.md | changed hunks :338-345, :406-416 |
| .skilled/scripts/git-hooks/tests/commit-msg.test.sh | new case at :415-447 |
| .github/workflows/message-contract.yml | full; new step :41-42; PR path :66-93 |
| .skilled/skills/sk-git/scripts/validate-message.mjs | full (unchanged consumer; `report()` :84-108) |
| .skilled/scripts/git-hooks/commit-msg | full (unchanged gate; validator call :75-78) |
| .skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs | consumer import :31, call :331 |
| .skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts | consumer dynamic import :26 |

## FINDINGS BY SEVERITY

### P0 — none

### P1 — none

No P0/P1. The three new keys are regex-free (own-property lookup, numeric comparison, literal prefix test), the gates spawn no shell, and the diff adds no secret-bearing surface. The one real defect found is a pre-existing rule bypass inside an in-scope file, below.

### P2 — suggestions (non-blocking)

#### R2-P2-001 — `trailer.spec-exists` is satisfied by a traversal value (`Spec: ..`), so the existence rule can be defeated

- File: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:512-513 (join + check) with :694 (worktree `specExists`) and :747 (range `specExists`)
- Evidence: OBSERVED by command — a probe calling the shipped `validateCommit` with a filesystem-backed `specExists` (the exact shape of `worktreeContext`, :694) and a message whose final paragraph is `Spec: ..` returns `REL=["."]`, `ERRORS=[]`. The check joins the message-supplied value with the contract root (`path.posix.join('specs', '..')` = `'.'`, :512) and asks whether `<repoRoot>/."` exists — it does, so no `trailer.spec-exists` error. In the CI/range context the same value still passes through the disk fallback in :747 (`fs.existsSync(path.join(repoRoot, rel))`); `inTree` is not even the pass path (`git cat-file -e HEAD:.` exits non-zero). `forbiddenPrefix` ("specs/") does not see dot segments. A commit that names no packet but ends with `Spec: ..` (or `Spec: ../..`) passes all three gate contexts.
- Finding class: instance-only
- Scope proof: `specExists` is called only at :513 (worktree :694, range :747) and `rel` is built only at :512; the other message-to-git paths escape their inputs (`escapeRegex` at :696, :735). No second site constructs a path from message text.
- Note: pre-existing behavior, not introduced by this diff; reported because message-contract.mjs is in scope and the packet's subject is enforcement trustworthiness. No privilege or secret boundary is crossed; impact is metadata integrity and enforcement bypass.
- Recommendation: after joining, reject values containing `..` segments (or require `path.posix.normalize(rel) === rel`, excluding `'.'`) and assert the resolved path stays under `<root>/specs/`; add a unit case asserting `Spec: ..` produces `trailer.spec-exists`.
- riskScore: 3 (advisory)

#### R2-P2-002 — `body.breakingSections` labels are type-checked but not prefix-checked, so a label can make the new rule unsatisfiable or trivially satisfiable

- File: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:196-199 (shape check) with :537-548 (rule)
- Evidence: OBSERVED by read — the shape check enforces only a non-empty `string[]`; the rule is the literal `line.startsWith(`${label}:`)` (:539). A label containing `:` or trailing whitespace (e.g. `"Changes: "`) can never prefix a body line, so every breaking commit is blocked (fail-closed); an empty label `""` is satisfied by any line beginning `:`, weakening the check. The shipped labels `Context`/`Changes`/`Verification` are unaffected; the gap matters for repository-local contract copies, the same surface as R1-P2-001/R1-P2-002 but on the other new key.
- Finding class: instance-only
- Scope proof: `breakingSections` is read only at :69 (shape map), :197-199 (shape), :356 (rule id) and :537-548 (rule); the shape check is the only load-time gate and the only site that can validate label form.
- Recommendation: at load, require each label to be a non-empty string with no leading/trailing whitespace and no `:` or newline (e.g. `/^[A-Za-z][A-Za-z0-9 -]*$/`).
- riskScore: 2 (advisory)

## TRACEABILITY CHECKS

- **spec_code — pass (spot)**: the new security-relevant behavior is the alias check at :432-437 (own-property test, rule text only in the message) and the label check at :537-548; both are wired through `commitRuleIds` and the template, and neither adds auth, secret or privilege surface. Spot-verified by direct read against REQ-013..016 locations.
- **checklist_evidence — partial**: the AC evidence tests exist at the cited behaviors (message-contract.test.mjs:118-144, :161-184; commit-msg.test.sh:415-447), but the suites were not executed under containment, so pass counts remain INFERRED; iteration 3 should execute them.
- **skill_agent — pass (spot)**: the agent gate imports `validateCommit` from the shared library (.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:31, call :331), so the new rules reach the agent surface without per-gate edits.
- **agent_cross_runtime — pass (spot)**: the pi transport dynamically imports the same module (git-message-gate.ts:26); the `.hermes/skills/sk-git/SKILL.md` copy is modified in the same diff with identical wording (content check carried from iteration 1).
- **feature_catalog_code / playbook_capability — deferred**: not exercised this iteration; scheduled for iteration 3.

Directions ruled out with evidence:

- **Shell injection**: hooks call `node "$VALIDATOR" --repo "$REPO_ROOT" --commit "$MESSAGE_FILE"` with quoted variables (commit-msg:75-78); the library spawns processes only through `execFileSync` array arguments (:233-240); the diff adds no spawn site. The CI PR body travels `env:` → `printf '%s' "$PR_BODY" > file` (workflow:88-91) and never becomes shell source.
- **`scopeAliases` prototype sensitivity**: `Object.hasOwn(s.scopeAliases || {}, scope)` (:435) tests own properties only; the map is JSON-parsed (own `__proto__` is an inert data property) and only read; unknown top-level keys are rejected by `checkShape` (:151-156) before use.
- **ReDoS growth from the new keys**: the alias rule is a property lookup (:435), the length target a numeric comparison (:462-464), the sections rule a literal `startsWith` (:539); none compiles a regex. Contract patterns still pass `checkRegex` at load, and input stays capped by `MAX_INPUT_CHARS` (:31, :382, :573). Residual: a PR-supplied `.sk-git` contract with a catastrophic own pattern can burn CI time on that PR only; read-only token, bounded input, and the module comment (:29-31) record the accepted trade-off — noted, not reported.
- **CI command/log injection**: untrusted commit and PR text is emitted only after fixed prefixes on lines derived from per-line iteration (`  - [id] …`, `BLOCKED: …`; validate-message.mjs:84-108), so no attacker byte begins a log line and no newline can be smuggled mid-line.
- **Secrets exposure**: the workflow runs with `permissions: contents: read` (:13-14), and neither the diff nor the new test step reads or prints credentials; error text echoes only message content.
- **Self-neutering validator**: a PR can edit the in-repo validator and test it runs under; this is inherited design across every in-repo gate, unchanged by the diff and guarded only against deletion (workflow:34-37). Noted as residual, not reported.

## SCOPE VIOLATIONS

None. Writes were confined to iteration-002.md and iter-002.jsonl; the state-log projection was withheld by run instruction (gateway not invoked).

## VERDICT

PASS with advisories: no P0 or P1; two new P2 findings (R2-P2-001, R2-P2-002) — one pre-existing enforcement bypass surfaced in an in-scope file, one validation gap on the new `body.breakingSections` key. R1-P2-001 and R1-P2-002 remain open and were not re-reported. All findings are non-blocking.

## NEXT DIMENSION

maintainability (iteration 3). Suggested focus: close the checklist_evidence gap by executing `node --test .skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` and the commit-msg hook suite; map feature_catalog_code / playbook_capability for the three new rule ids; and inspect the contract-author UX of the new keys (error text, docs pairing, shape-check readability).

Review verdict: PASS
