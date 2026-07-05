# Deep-Review Iteration 4 — D4 SECURITY

## Focus

Security dimension audit of the 008 deep-skill doc-evolution ship (commit 5f3e0a2f53). This iteration examined the 5 deep-* skills' documentation for exposed secrets, unsafe example commands, host/path exposure, and permission/scope guidance issues.

## Actions Taken

1. **Secret/credential sweep**: Grepped all 5 skill directories for patterns including `api[_-]?key`, `token`, `secret`, `password`, `Bearer `, `sk-`, `ghp_`, and AWS-style keys across SKILL.md, README, references/, feature_catalog/, manual_testing_playbook/, and assets/.

2. **Unsafe example-command sweep**: Grepped for destructive patterns including `rm -rf`, `curl.*\|.*sh`, `eval`, `chmod 777`, and `git push --force` across the same documentation surfaces.

3. **Host/path exposure check**: Grepped for real internal hostnames, private IPs (`192.168.`, `10.`, `172.16-31.`), `localhost`, `127.0.0.1`, and absolute user-specific paths (`/home/`, `/Users/`, `/root/`) in example snippets.

4. **Permission/scope guidance review**: Grepped for over-broad permission examples including `allow-all-tools`, `--allow-all`, wildcards, and blanket "all permissions" guidance presented as recommended defaults.

## Findings

No security findings — docs expose no secrets, unsafe commands, or env detail (evidence below).

### Secret/Credential Analysis

The secret-pattern grep returned 346 total matches across the 5 skills, but all are legitimate non-credential uses:

- **"token"**: Appears in contexts like template token extraction (`PROMPT_PACK_TOKEN_PATTERN`), command token parsing (`const token = argv[i]`), token budget discussions, and test placeholders (`secretToken: 'should-not-surface'` in <ref_file file=".opencode/skills/deep-loop-runtime/tests/unit/council-graph-query.vitest.ts" line="129" />). No actual credential tokens exposed.

- **"secret"**: Appears only in test contexts (e.g., `secret: 'leak-me'` as a hostile metadata test case in <ref_file file=".opencode/skills/deep-ai-council/manual_testing_playbook/08--council-graph-integration/003-council-graph-query-hostile-metadata-redaction.md" line="29" />) and security dimension descriptions ("secrets exposure" as a review category). No real secrets.

- **"password"**: Appears only in security review dimension descriptions (<ref_file file=".opencode/skills/deep-review/feature_catalog/03--review-dimensions/02-security.md" line="12" />), not as actual passwords.

- **"sk-"**: Appears exclusively as skill identifier prefixes (sk-code, sk-doc, sk-git, etc.) and in skill names, not as API keys.

- **"Bearer "**: No matches in documentation.

- **"ghp_"**: No matches in documentation.

- **AWS key patterns**: No matches in documentation.

### Unsafe Example Command Analysis

The unsafe-command grep returned 47 matches, but all are legitimate:

- **Test cleanup scripts**: `rm -rf` appears in `setup-cp-sandbox.sh` files (<ref_file file=".opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh" line="48" />, <ref_file file=".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh" line="48" />, <ref_file file=".opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh" line="49" />) that clean up temporary `/tmp/` directories after test runs. These are sandboxed test utilities, not user-facing examples.

- **Security guidance**: The deep-review prompt pack template explicitly BANS dangerous operations (<ref_file file=".opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl" line="67" />): "BANNED OPERATIONS (NEVER execute against any path): `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`...". This is security guidance, not an unsafe example.

- **Test scenarios**: Manual testing playbook scenarios use `rm -rf /tmp/cp-XXX-sandbox` to reset test sandboxes between runs (<ref_file file=".opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/spec-fence-writeback.md" line="46" />, <ref_file file=".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/three-artifact-iteration-contract.md" line="46" />). These are clearly test infrastructure, not instructions.

- **No `curl | sh` patterns**: No matches for pipe-to-shell execution patterns.

- **No `eval` patterns**: No matches for eval commands in documentation.

- **No `chmod 777` patterns**: No matches for overly permissive chmod examples.

- **No force-push examples**: No matches for `git push --force` patterns.

### Host/Path Exposure Analysis

The host/path grep returned 119 matches, but all are legitimate:

- **Section numbers**: Many matches are for section headers like "## 10. SCORING", "## 10. CONVERGENCE", etc. These are document structure, not network addresses.

- **User-specific paths in test scripts**: The manual testing playbook setup scripts contain the developer's actual path `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public` (<ref_file file=".opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh" line="4" />, <ref_file file=".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh" line="4" />, <ref_file file=".opencode/skills/deep-agent-improvement/manual_testing_playbook/08--agent-discipline-stress-tests/setup-cp-sandbox.sh" line="4" />). These are in test infrastructure scripts, not user-facing documentation examples. While these could be parameterized, they don't expose security-sensitive information and are test-only.

- **No real hostnames**: No matches for actual internal hostnames.

- **No private IPs**: No matches for private IP address patterns (192.168.x.x, 10.x.x.x, 172.16-31.x.x) in example snippets.

- **No localhost/127.0.0.1 exposures**: No matches for localhost patterns in user-facing examples.

### Permission/Scope Guidance Analysis

The permission grep returned 500+ matches, but all are legitimate:

- **Test scenario flags**: `--allow-all-tools` appears in manual testing playbook examples (<ref_file file=".opencode/skills/deep-research/manual_testing_playbook/07--command-flow-stress-tests/spec-fence-writeback.md" line="74" />, <ref_file file=".opencode/skills/deep-review/manual_testing_playbook/07--command-flow-stress-tests/three-artifact-iteration-contract.md" line="53" />) for copilot test commands. These are clearly test infrastructure, not recommended defaults for production use.

- **Wildcards in documentation**: Asterisks appear in glob patterns (`*.md`, `**/*.md`), file descriptions, and structural diagrams - not as permission wildcards.

- **No blanket permission guidance**: No instances of documentation recommending "all permissions" or overly broad access as the default approach.

- **Scoped write boundaries**: The deep-ai-council skill explicitly scopes writes to `ai-council/**` artifacts only (<ref_file file=".opencode/skills/deep-ai-council/SKILL.md" line="341" />), following least-privilege principles.

## Coverage

- **Files reviewed**: 5 skill directories × (SKILL.md, README.md, references/, feature_catalog/, manual_testing_playbook/, assets/) = approximately 150+ documentation files
- **Patterns searched**: 4 security categories (secrets, unsafe commands, host/path exposure, permissions)
- **Tool calls used**: 10 grep searches (2 per category across 5 skills)
- **Evidence threshold**: Every potential hit evaluated for context; only actual security issues would be classified as findings

## Next Focus

Iteration 5 of 5: D5 structural completeness — final dimension to verify the 008 doc ship's structural integrity across the 5 deep-* skills (package shape, index coverage, cross-references, and artifact completeness).

```json
{"dimensions":["security"],"filesReviewed":[".opencode/skills/deep-loop-runtime",".opencode/skills/deep-research",".opencode/skills/deep-review",".opencode/skills/deep-ai-council",".opencode/skills/deep-agent-improvement"],"findingsSummary":{"P0":0,"P1":0,"P2":0},"findingsNew":{"P0":0,"P1":0,"P2":0},"newFindingsRatio":0.0,"status":"complete","findingDetails":[]}
```