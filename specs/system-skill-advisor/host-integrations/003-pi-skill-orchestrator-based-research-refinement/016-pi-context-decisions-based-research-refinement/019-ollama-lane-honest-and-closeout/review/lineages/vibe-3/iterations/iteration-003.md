# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-003 (daemon and launcher liveness), dimension `security`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by testing the trust boundaries the reviewed commits touch: the launcher's child-environment allowlist, the newly forwarded `OLLAMA_*` settings, the pinned database directory, and the read-only contract of the status and scoring paths.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git show 31ffd18beab`, and the HEAD files cited below.

## Files Reviewed

- `.skilled/bin/system-skill-advisor-launcher.cjs:39-90`, `:144`, `:181-190`, `:322-330`, `:396-400`
- `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:99-135`, `:195-205`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:175-200`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:167-170`, `:755-760`, `:1325-1330`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:392`
- `.gitignore:25-30`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass -- the D1 claim that `OLLAMA_*` is forwarded is implemented at `system-skill-advisor-launcher.cjs:185-186` and read by the shared adapter at `ollama.ts:118-127`; the claim that the daemon keeps the launcher's database directory is implemented at `:326-328`.
- `checklist_evidence` -- partial -- the security-relevant completion criteria (no secret exposure, no out-of-tree write) were checked against the code; the remaining criteria stay partial until the traceability pass reads them.

## Integration Evidence

- `.gitignore:25-30` -- `.env` and `.env.local` are ignored while `.env.example` is not, so the launcher's project-local env loader (`system-skill-advisor-launcher.cjs:39-70`) cannot be fed by a cloned repository. The newly allowlisted `OLLAMA_BASE_URL` therefore stays operator-controlled and is not an exfiltration vector.
- `.skilled/skills/system-spec-kit/shared/embeddings/adapters/ollama.ts:124-127` -- `OLLAMA_REQUEST_TIMEOUT_MS` is parsed with `parseInt` and accepted only when finite and positive, so a malformed value falls back to the split defaults instead of producing a zero deadline.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts:177` -- the status path opens the database with `{ readonly: true, fileMustExist: true }` before handing it to `embeddingCoverage`, so the status surface keeps the read-only contract the recommend path breaks (recorded as R1-P1-001, not re-raised here).
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:167-170` -- the command-bridges candidates are fixed module-relative paths, so `readCommandEmbeddingSources` cannot be steered outside the runtime tree.

## Edge Cases

- The launcher's env loader writes every key from `.env` into `process.env` before the allowlist filter, so a `.env` can set variables the child never receives. That is pre-existing behavior and the file is gitignored; recorded as an ambiguity, not a finding.
- `OLLAMA_BASE_URL` may name a plain-HTTP origin. The default is loopback and the value is operator-supplied, so cleartext transport is a deployment choice rather than a defect in these commits.
- The recommend path's read-write open is a trust-boundary concern as well as a correctness one. It is carried as R1-P1-001 and deliberately not re-raised under a second dimension.

## Confirmed-Clean Surfaces

- No secret value is forwarded: the allowlist adds two Ollama settings and one refresh switch, none of which carries a credential.
- The pinned database directory is created with mode `0o700` through `ensureCanonicalDir`.
- The status handler's coverage read is read-only, and its failure is caught so a status call never fails on an older database.
- `probeOllamaModel` is bounded at 500 ms in the background refresh, so an unresponsive backend cannot park the watcher.

## Ruled Out

- "A cloned repository can redirect embeddings to an attacker's server through `.env`": ruled out -- both env files are gitignored.
- "A malformed `OLLAMA_REQUEST_TIMEOUT_MS` produces an unbounded or zero deadline": ruled out -- the parser requires a finite positive integer.
- "The status path mutates the database": ruled out -- it opens read-only.

## Next Focus

- Dimension: traceability
- Focus area: frontier node F-1-003, traceability pass over the D1 claims and the doctor assets
- Reason: security is complete for this node; the remaining risk is a doc claim that outruns the code
- Rotation status: F-1-003 has 2 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- the gitignore and read-only checks each closed a candidate
- Required evidence: the doctor presentation and the feature-catalog claims against the code paths they describe
- Recovery note: none

Review verdict: PASS
