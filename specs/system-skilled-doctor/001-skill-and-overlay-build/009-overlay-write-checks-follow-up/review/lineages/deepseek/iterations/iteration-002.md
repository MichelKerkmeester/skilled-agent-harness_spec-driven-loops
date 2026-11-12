# Review Iteration 002 — Security of the strict-write surface, the credential rule and the OpenCode adapter

## Dispatcher

- Mode: `review` · target agent `deep-review` · resolved route `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-1794439428470-vyb51k`, generation 1, lineageMode `new`
- Executor: this process (detached fan-out lineage); no nested dispatch
- Budget profile: `verify`
- Bindings: `BINDING: target=commits c57b7e4cef..e97ca56e8d on main` · `BINDING: maxIterations=3` · `BINDING: convergence=0.1` · `BINDING: mode=review` · `BINDING: dimensions=correctness,security,traceability,maintainability` · `BINDING: specFolder=specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up`
- Sources read this iteration (including the lead channel): `steer.md` (absent — no lead ruling to apply), `deep-review-strategy.md` (Next Focus and exhausted approaches), `deep-review-state.jsonl`, `references/overlays.md:103-110`, `presentation.txt:520-546`, `overlay-engine.cjs` (`isProtectedReadPath`, `isCaptureRestricted`, `commandGuard`, `globToRegExp`, `writeCheckSettings`, `isVendoredKey`, `strictWriteRefusal`, `stagedUnownedChanges`, `isSameText`, `managedPathTest`, `planRelayout`, `copyForBackup`), `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` (the symlink and the resolved target), `.opencode/plugins/overlay-guard.js` surroundings and import resolution, `.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs` and `cursor/overlay-guard.mjs` (cross-runtime comparison), `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` (`evaluateWrite`), `.skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs`.

## Dimension

**Security** — the two trust boundaries this release adds: the write guard that decides whether an agent's write is refused, and the credential rule that decides which file bytes the engine may read. Operator review focus addressed by taking the four surfaces it names next — the strict write checks, the commit check, `status --audit` and the OpenCode adapter — and testing each against the sentence the reference document writes about it.

## Files Reviewed

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:1899-1945` (`isProtectedReadPath`, `isListedProtectedPath`, `isCaptureRestricted`), `:1966-2020` (`assertSafeToPlan`), `:2117-2145` (`analyze` protected-output swap), `:2893-2942` (`commandGuard`), `:3130-3165` (`managedPathTest`), `:3924-3985` (`isStrictWrites`, `globToRegExp`, `writeCheckSettings`, `isVendoredKey`), `:4033-4065` (`strictWriteRefusal`), `:4247-4252` (`isSameText`), `:4271-4345` (`stagedUnownedChanges`), `:4402-4470` (`auditVendoredTree`), `:4539-4630` (`planRelayout`, `copyForBackup`), `:4704-4755` (`relayoutUnderLock`), `:4770-4830` (`parseArguments`), `:4832-4865` (`main`)
- `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` (the symlink, 1 line) → resolved target `.opencode/plugins/overlay-guard.js` (123 lines)
- `.skilled/hooks/overlay-guard/tests/opencode-overlay-guard.test.mjs:136-170`
- `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs:106-135`
- `.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs:1-60`, `.skilled/hooks/overlay-guard/cursor/overlay-guard.mjs:25-45`
- `.skilled/skills/system-skilled-doctor/references/overlays.md:103-110`
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:538-546`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **`apply --relayout` reads and copies token-named files that `apply` refuses to read** -- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4622` -- `copyForBackup` reads every non-dotenv file under a moved source (`fs.readFileSync`) and writes its bytes into `relayout-runs/<stamp>/`, while the documented read control for a `directory` or `skill-root` entry is `protectedPaths` only (`:1899-1901`, enforced for planning at `:2137`); a relayout never builds a plan and never consults `protectedPaths`, so a token-named file the entry did not list is read and duplicated.
   Finding class: control bypass on a second read path (the `protectedPaths` allow-list guards `apply`, not `relayout`)
   Scope proof: the only read of a moved copy is `:4724 copyForBackup(move.from.absolute, ...)` → `:4622 writeFile(targetPath, fs.readFileSync(sourcePath), ...)`; the only skip on that path is `:4618 isEnvName(sourcePath)`, and `planRelayout`'s own skip is `:4580 isEnvName(from.absolute)`; `isProtectedReadPath` is called from exactly two places, `:2001` (`assertSafeToPlan`) and `:2137` (`analyze`), neither of which `commandRelayout` reaches.
   Affected surface hints: `skilled-overlays/relayout-runs/<stamp>/` (a folder the documented example `.gitignore` does not exclude, `tests/overlay-engine-follow-up.test.cjs:760`), `protectedPaths` (`references/overlays.md:106-120`), `references/overlays.md:103`, `presentation.txt:540`, and every `directory`/`skill-root` entry whose source folder is moved by relayout.
   Case: a manifest entry has `"scope": "directory"`, `"source": ".skilled/skills/repo-frontend"` and lists `protectedPaths: ["assets/tokens.css"]`; the folder also holds `assets/api-token.js`. `apply` refuses the entry and prints a `MISS` line naming `assets/api-token.js`. `apply --relayout` backs the folder up first, so `assets/api-token.js` is read and its bytes are written into `skilled-overlays/relayout-runs/<stamp>/skilled-overlays/.skilled/skills/repo-frontend/assets/api-token.js`, then moved onto its layout path. The file the reference document says is never read outside an exact naming has been read and copied into a folder a commit can pick up.
   ```json
   {"type":"claim_adjudication","claim":"Relayout's backup path reads token-named files that the protectedPaths allow-list forbids apply from reading, and copies their bytes into a folder that is not gitignored by the documented example.","evidenceRefs":["overlay-engine.cjs:4622","overlay-engine.cjs:4618","overlay-engine.cjs:4580","overlay-engine.cjs:4724","overlay-engine.cjs:1910","overlay-engine.cjs:2137","references/overlays.md:103","references/overlays.md:106","presentation.txt:540","tests/overlay-engine-follow-up.test.cjs:760"],"counterevidenceSought":"Looked for a protectedPaths consultation on the relayout path: planRelayout reads only layout fields, relayoutUnderLock calls no plan, and the two isProtectedReadPath call sites are both in the apply planner. Checked whether the backup folder is ignored: the test fixture's .gitignore names only sync-state.json and .build-lock.","alternativeExplanation":"The manifest does name the folder, and for a file entry the manifest naming the source exactly is what licenses the read, so someone could read the rule as satisfied. It is not satisfied for a directory entry, where the document says the folder walk may read only the protectedPaths children, which is the rule apply enforces.","finalSeverity":"P1","confidence":0.83,"downgradeTrigger":"Downgrade to P2 if the reference document is amended to say a relayout backup reads every non-dotenv file under a moved copy, which makes the behaviour stated rather than contradicted."}
   ```

### P2 Findings

1. **The relayout `skipped` row attributes the line to the wrong rule and the wrong outcome** -- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:540` -- the row says a `skipped` line means "The file is token-named, so the engine never opened it and left it where it was", while the engine skips only a dotenv name (`overlay-engine.cjs:4580`, `:4618`) and a `skipped` line for a nested `.env` is printed after its parent folder has been moved wholesale, so the file did not stay.
   Finding class: documentation-wording mismatch on a safety-relevant outcome
   Scope proof: the only producer of `skipped` is `planRelayout:4580` (top-level `.env` source) and `copyForBackup:4618` (nested `.env`); `relayoutUnderLock:4715` prints `skipped ${relativePath}` for the former only, and `:4732 fs.renameSync(move.from.absolute, move.to.absolute)` moves the whole folder for the latter.
   Affected surface hints: `presentation.txt:518` (the exit-0 row that repeats "stayed where it was"), `presentation.txt:540`, `overlays.md:103`, and the operator instruction to move the skipped copy by hand.
   Case: a directory entry's source folder holds `.env.local` beside `index.js`. `apply --relayout` prints `skipped skilled-overlays/.skilled/skills/x/.env.local` because the backup could not copy it, then renames the folder onto its layout path with `.env.local` inside it. The operator reads the presentation row, concludes the credential file is still at the old path, and moves a copy by hand onto a path where a `.env.local` already sits.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | REQ-006 holds: `isVendoredKey` returns false for a `repin.exclude` path (`:3980-3983`), and `commandGuard` refuses an owned destination before it consults `strictWriteRefusal` (`:2915-2920`), so an excluded path cannot shadow an owned one. REQ-007 holds and is narrow: `isSameText` normalises CRLF only, refuses a NUL-byte pair (`:4248-4251`), and is applied on both the commit check (`:4312`) and the audit (`:4451`). REQ-005 holds: `globToRegExp` compiles `**/` to `(?:.*/)?` and `*` to `[^/]*` (`:3934-3947`), so `a/**/x.json` matches `a/x.json` and `a/b/x.json` and not `a/my-x.json`. REQ-012 holds: `auditVendoredTree` excludes a managed, generated or dotenv key and reports `differs`, `missing` and `extra` (`:4402-4470`). REQ-013 holds: the adapter throws `result.reason` on a deny and is inert without a manifest, and the four cases are tested (`tests/overlay-guard/opencode-overlay-guard.test.mjs:136-165`). NFR-S01 is **not** met on the relayout path (finding 1); it is met on the audit path (`:4414` `!isEnvName(key)`) and on the plan path (`:1907`). |
| `checklist_evidence` | core | partial | `tasks.md` T009, T010 and T014 are marked `[x]`; each names a behaviour this iteration read in the code and found implemented. T015's verify line reads "refuses an unowned write, allows an owned one" — the tests refuse an *owned* write (`:136`) and a strict-write *unowned* one (`:143`), so the checklist sentence mis-states the second half; the code and the tests agree with each other, so this is a checklist wording defect, not a code defect. |

## Integration Evidence

- `.skilled/hooks/overlay-guard/opencode/overlay-guard.js` in this repository is a relative symlink (`-> ../../../../.opencode/plugins/overlay-guard.js`), so the reviewed bytes are the OpenCode host plugin's bytes. Every import it names resolves from the link target: `.opencode/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs`, `.opencode/hooks/shared/hook-flags.mjs`, `.opencode/hooks/overlay-guard/lib/overlay-guard.cjs`, `.opencode/plugins/lib/v2-bridge.js` all exist, and `.opencode/skills` is itself a link to `../.skilled/skills`. No broken-import finding.
- `.opencode/hooks/overlay-guard/lib/overlay-guard.cjs` is byte-identical to `.skilled/hooks/overlay-guard/lib/overlay-guard.cjs` (`cmp -s`), so the plugin and the CLI hook family share one core; the OpenCode adapter therefore inherits the `evaluateWrite` decision rather than re-implementing it.
- Cross-runtime tool vocabulary differs by design and was checked: Cursor `WRITE_TOOLS = ['Write']` (`.skilled/hooks/overlay-guard/cursor/overlay-guard.mjs:25`), DSH `FILE_TOOLS = ['write','edit']` plus `apply_patch` (`.skilled/hooks/overlay-guard/dsh/overlay-guard.mjs:13-14`), OpenCode `['write','edit','multiedit','patch','apply_patch']` (`.skilled/hooks/overlay-guard/opencode/overlay-guard.js:35`). Each adapter names its own host's tool names; no adapter claims to guard a shell write.
- `.skilled/skills/system-skilled-doctor/references/overlays.md:103-110` is the reference statement of the credential rule, and `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:540` is the route's operator-facing restatement; both were used as the contract for finding 1 and finding 2.
- `.skilled/commands/doctor/overlay.md:41` and `_routes.yaml:632` place `--audit` on `status` only; `parseArguments:4808` enforces it (`isAudit` with a command other than `status` returns null → usage, exit 2). Verified, not a finding.

## Edge Cases

- **Trust-boundary reading (adapter):** an agent write is an outside value at a trust boundary, so the guard's tool-name vocabulary is in reach. The adapter's stated contract is "a write it cannot judge is allowed" plus a log note (`overlay-guard.js:7-14`, `:111-116`), so an unlisted tool name is inside the contract rather than a gap; recorded as ruled out.
- **Ambiguity (finding 1, resolved toward the higher severity):** whether "the manifest names its exact path" covers a folder-scoped entry is the one genuinely ambiguous sentence. The code answers it in `apply` (folder entries need `protectedPaths`) and contradicts that answer in `relayout`; the safer reading is the one `apply` enforces, so the finding is reported at that severity and the alternative is recorded in the claim packet.
- **Contradiction (finding 2):** `presentation.txt:540` and `presentation.txt:518` describe the same `skipped` outcome in two ways ("stayed where it was" is true only for a top-level `.env`), and neither matches the engine's token-named rule, which does not exist on this path.
- **Missing dependency:** git-dependent paths (`isIgnoredByGit`, `stagedUnownedChanges`, `auditVendoredTree`, `staleRootFiles`) cannot be executed here; they were read for fail-closed ordering instead. `stagedUnownedChanges` returns `[]` when `git rev-parse` fails (`:4274-4275`), which is fail-open, but a machine with no readable work tree cannot commit either, so no reach exists and it is not reported.
- **Partial success:** the strict-write guard, the commit check's line-ending compare, the glob rewrite, the audit's exclusions and the OpenCode adapter were each read end to end and are clean; only the credential rule's second read path is defective.

## Confirmed-Clean Surfaces

- **`globToRegExp`** (`:3934-3947`): `**/` becomes `(?:.*/)?`, a bare `**` becomes `.*`, `*` becomes `[^/]*`, and every other character is escaped, anchored with `^...$`. The over-match the review named cannot recur, and a `*` cannot cross a segment. Anchoring also means a glob without `**` does not match a nested path.
- **`strictWriteRefusal`** (`:4033-4065`): allows only when strict writes are off, the path is outside the root, it is not a vendored key, it is a folder, it is generated, or it is gitignored; every other case returns a refusal line naming the overlay source to edit and the command to run. `isIgnoredByGit` fails closed when git cannot answer.
- **`stagedUnownedChanges`** (`:4271-4345`): a staged blob equal to upstream's is skipped, a pin-moving commit is skipped by design, binary content never compares equal (`isSameText` returns false on a NUL byte), and a deleted path is only skipped when upstream shipped it.
- **`commandGuard` order** (`:2893-2942`): a removal-owned destination is refused first, an overlay-owned destination next, and only then the strict-write test — so a `repin.exclude` entry can never mask an owned path.
- **OpenCode adapter** (`overlay-guard.js`): judged only for the five write-tool names it lists, returns early when a call names no path, denies by throwing the engine's own line, logs notes to a bounded rotated file instead of the console, and fails open with a trace on a core error. The four REQ-013 cases are covered by its tests (`opencode-overlay-guard.test.mjs:136-165`), including the inert-with-no-manifest case.
- **`auditVendoredTree`** (`:4402-4470`): a generated, managed or dotenv key is never judged; a link is compared as a target string; a regular file is compared by blob id first and by normalised text second, so a CRLF-only difference is not drift; a batch git refusal falls back to hashing the bytes rather than reporting drift.

## Ruled Out

- **Broken imports in the OpenCode adapter:** dismissed. The file is a symlink into `.opencode/plugins/`, and every import resolves from there; the shared core is byte-identical to the `.skilled` copy.
- **A `write` call being parsed as a patch body:** dismissed. `PATCH_KEYS` are read only when the tool is `patch` or `apply_patch` (`overlay-guard.js:39`, `:86`); a `write` tool's `content` is never parsed as a patch, so a document that quotes a patch cannot be refused for it.
- **Over-broad `repin.exclude` allowing an owned write:** dismissed. `commandGuard` refuses an owned destination before the strict-write test.
- **`isSameText` letting a real edit through under `text=auto`:** dismissed. It normalises CRLF only, compares bytes as latin1, and returns false for any pair containing a NUL byte.
- **Fail-open commit check when git is unreadable:** dismissed for lack of reach; recorded as an edge case instead.
- **Cross-runtime tool-vocabulary drift:** dismissed as by design; each adapter names its own host's tools and every adapter documents the fail-open rule for a tool it does not list.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was created, modified or deleted.

## Next Focus

- Dimension: traceability
- Focus area: `overlay.md` steps 1-19, `_routes.yaml` `/doctor:overlay` routes, `assets/doctor-overlay-status.yaml`, `assets/doctor-overlay-apply.yaml`, `assets/doctor-overlay-presentation.txt`, `references/overlays.md` and `manual-testing-playbook/overlays/*.md` against the engine's actual lines, exit codes and flags; plus the maintainability tail: comment hygiene, the untested `relayoutLinkTargets`, and whether the new tests assert the documented outcome rather than the code's shape
- Reason: the operator focus ends with "whether the command documents match the engine", and two of this iteration's findings are already documentation-facing; the remaining route steps and the six new playbook files have not been read at all
- Rotation status: security → traceability (second rotation; D1 CONDITIONAL and D2 CONDITIONAL carried forward)
- Blocked/productive carry-forward: productive — the doc-sentence-versus-code-line pairing has now produced three findings; keep it for the route steps and playbook files
- Required evidence: a named route step, flag list, exit code or presentation row paired with the engine line that implements or contradicts it; for the playbook, whether each scenario's stated expectation is what the engine prints
- Recovery note: not applicable

Review verdict: CONDITIONAL
