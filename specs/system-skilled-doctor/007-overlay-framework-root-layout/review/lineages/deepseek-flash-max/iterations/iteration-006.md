# Review Iteration 006

## Dispatcher

- Target spec folder: `specs/system-skilled-doctor/007-overlay-framework-root-layout`
- Review packet root: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Frontier node: `F-1-006` at depth 1 of 3
- Dimension: security
- Focus: Frontier node F-1-006: security
- Executor: cli-mistral-vibe model=deepseek-flash (inline, no nested dispatch)
- Operator review focus: follow-up round after remediation. This iteration asks the security half of the re-pin question: does the vendored copy carry the remediated engine faithfully, and does the engine treat the manifest as untrusted input when it reads the pinned checkout.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` | 4227-4300 | `runGit`, `commitBytesReader`, `pinnedUpstreamBytes`, `resolveCommit` |
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` | 4900-5140 | The repin job readers that call `commitBytesReader` |
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` | 540-600, 2920-2990 | `pin.checkout` resolution and pin comparison |
| `barter/ai-speckit/overlays/overlay-manifest.json` | 1-20 | `pin`, `strictWrites`, `repin.runtimeFolders` |
| `barter/ai-speckit/overlays/sync-state.json` | whole | Whether the state file carries machine-specific data |
| `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/` | listing | Whether the engine suites ship with the vendored copy |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The pinned-blob reader passes a manifest value to git without `--end-of-options`** -- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4241` -- `commitBytesReader` builds `git cat-file blob <commit>:<key>` from `pin.commit` and an overlay entry path. Its sibling `resolveCommit:4281` guards the same class of input with `--end-of-options`, and that is the only occurrence of the flag in the file. `pinnedUpstreamBytes:4267` type-checks `pin.commit` as a string and nothing more, so a value beginning with `-` reaches git as an option rather than a revision.
   Finding class: security-hardening
   Scope proof: read `overlay-engine.cjs:4227-4300` in full; `grep -n end-of-options` returns exactly one hit, at `:4281`, and `commitBytesReader` at `:4239-4244` has none.
   Affected surface hints: `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`, `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs`
   Case: a manifest records `pin.commit` as a string that starts with `-`, or an overlay entry names a source whose first path segment starts with `-`. `git cat-file blob` then reads the token as an option, and the bytes the audit compares are not the bytes at the pin, so `status --audit` can report a drift or an in-sync verdict that the pinned commit does not support.

   ```json
   {
     "type": "claim",
     "claim": "commitBytesReader passes a manifest-supplied revision and path to git cat-file without --end-of-options, while resolveCommit guards the same input class.",
     "evidenceRefs": [
       "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4241",
       "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4281",
       "barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4267"
     ],
     "counterevidenceSought": "checked whether pin.commit is validated as a hex id before it reaches the reader: :4267 only tests typeof string, and :2931 lowercases it for comparison without validating the shape. Checked whether runGit uses a shell: it calls spawnSync('git', ['-C', upstream, ...args]) at :4228, so the exposure is git option parsing rather than shell injection.",
     "alternativeExplanation": "the manifest is committed repository content, so the value is trusted in practice and the gap only matters if a manifest is ever authored by someone other than the tree's owner. That reading does not explain why resolveCommit already carries the flag.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "drop to informational if a maintainer records that the manifest is trusted input and no consumer ever accepts one from elsewhere"
   }
   ```

## Traceability Checks

| Check | Protocol | Result | Evidence |
|-------|----------|--------|----------|
| `checklist_evidence` | core | pass | Completion criterion 3 re-executed read-only: `cat .skilled-overlays.json` prints `{ "overlayDir": "../overlays" }` and `ls -d barter-overlays` fails |
| `spec_code` | core | pass | The vendored engine is byte-identical to the pin, so the security fixes the packet records are the ones the consumer runs |
| `integration_naming` | core | pass | The reader is named by path and by its two call families: `pinnedUpstreamBytes:4269` for the manifest pin, and the repin job readers at `:4924`, `:4925`, `:5048`, `:5096`, `:5135` |

## Integration Evidence

- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4228` invokes git as `spawnSync('git', ['-C', upstream, ...args])`, so no manifest value reaches a shell.
- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs:4269` is the only producer of the manifest-pin reader, and it gates on `isDirectory(pin.checkout)` before constructing it.
- `barter/ai-speckit/overlays/overlay-manifest.json:9` sets `strictWrites: true`, so the engine's `allow:` branch for a manifest without strict writes is not reachable in this consumer.

## Edge Cases

- **`pin.checkout` is an absolute local path.** `overlay-manifest.json:7` names `/Users/michelkerkmeester/MEGA/Development/Skilled`. The security reading adds nothing to the portability finding already raised as `R4-P2-001`: the engine only reads from that folder through `git -C`, and `pinnedUpstreamBytes:4267-4268` returns null when the folder is absent, so a clone without the checkout degrades to a skipped audit rather than a wrong verdict.
- **The vendored copy ships the engine suites.** All six `overlay-engine-*.test.cjs` files are present under `skilled/.skilled/commands/doctor/scripts/tests/`, so a consumer can run the same assertions the pin carries. This is recorded as a clean surface rather than a finding because the suites cannot be executed inside this lineage's write surface.
- **`sync-state.json` carries no machine-specific data.** `grep -c "/Users/"` returns 0; the file holds relative paths and SHA-256 digests only.

## Confirmed-Clean Surfaces

- `overlay-engine.cjs:4281` uses `--end-of-options` before the revision, so `resolveCommit` cannot be steered by a leading dash.
- `overlay-engine.cjs:4228` passes every git argument as an argv element, so no manifest value is shell-interpolated.
- `overlay-engine.cjs:4267-4268` returns null rather than throwing when the checkout is absent or the pin fields are not strings, so a missing checkout degrades the audit instead of failing the run.
- `overlay-engine.cjs:555-556` resolves a relative `pin.checkout` against the tree root, which is the form the docs recommend and the form `R4-P2-001` asks the manifest to adopt.
- `overlay-manifest.json:9` sets `strictWrites: true`, which is what makes the engine's `allow:` branch unreachable for this consumer.
- `sync-state.json` records only relative paths and content digests, so committing it leaks no local layout.

## Ruled Out

- **The vendored engine diverges from the pin in a security-relevant way.** Ruled out in iteration 4 by byte diff against `b5a630c6efa`; re-confirmed here by reading the same reader functions in the vendored copy.
- **A manifest can make the engine read a credential file.** Ruled out in iteration 2: `protectedPathsFor` refuses a dotenv value and a value outside the entry.
- **The strict-writes `allow:` branch is reachable here.** Ruled out: `overlay-manifest.json:9` sets `strictWrites: true`.
- **`sync-state.json` leaks an absolute path.** Ruled out by exact search: zero `/Users/` hits.
- **The vendored copy omits the engine tests.** Ruled out by listing the tests folder: all six `overlay-engine-*.test.cjs` files are present.

## Next Focus

- Dimension: traceability
- Focus area: run-level pass over the packet docs and the six phase goals against the shipped behaviour, including the two Skilled-side completion criteria no iteration has executed
- Reason: security is now covered on all three frontier nodes and traceability is the only canonical dimension with no iteration behind it
- Rotation status: F-1-006 security complete; F-1-002 and F-1-004 carry two P2 each into synthesis
- Blocked/productive carry-forward: productive -- the reader audit found one hardening asymmetry that the earlier engine passes did not reach
- Required evidence: `changelog/v1.2.0.0.md` naming `/doctor:overlay apply --relayout`; each phase goal's acceptance criteria against the tree; the packet's own checklist rows
- Recovery note: `node --test` on the engine suites still cannot run inside this lineage because the suites write fixtures outside the write surface; record that limit rather than claiming a pass

Review verdict: PASS
