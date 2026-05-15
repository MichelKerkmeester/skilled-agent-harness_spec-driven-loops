# Iteration 005 - postinstall Script Audit

## Summary
Found no CRITICAL or HIGH severity lifecycle script threats. Discovered one MEDIUM severity finding in a z_future (archived) babysitter-gemini postinstall hook that spawns external commands during npm install, though this appears to be defensive extension installation logic. All other lifecycle scripts are benign build/check operations or documentation. The main codebase shows no evidence of supply-chain attack patterns matching the TanStack Mini Shai-Hulud disclosure.

## Files/Commands Reviewed
- `find . -name package.json` (1489 package.json files found)
- `rg -n --hidden --glob "package.json" "(preinstall|postinstall|prepare|curl|wget|chmod|base64|eval|node -e|osascript|launchctl)" .` (exit code 0)
- `find . -path "*/node_modules/*/package.json" -print | head -500 | xargs rg -n "(preinstall|install|postinstall|prepare|curl|wget|chmod|base64|eval|node -e|bash|sh -c)"` (exit code 1 - argument list too long, fallback used)
- `rg -n --hidden --glob "!**/.git/**" --glob "*.sh" --glob "*.js" "(curl|wget).*[|].*(sh|bash)|rm -rf ~|launchctl|systemctl --user|crontab|chmod \+x|base64 -d|eval\(" .` (exit code 0)
- `.opencode/skills/system-spec-kit/package.json` (49 lines)
- `.opencode/skills/system-spec-kit/scripts/setup/record-node-version.js` (29 lines)
- `.opencode/skills/mcp-code-mode/scripts/install.sh` (426 lines)
- `.opencode/commands/doctor/scripts/mcp-doctor.sh` (lines 280-359)
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.js` (lines 218-227)
- `.opencode/node_modules/which/package.json` (43 lines)
- `.opencode/skills/system-spec-kit/node_modules/onnxruntime-common/package.json` (35 lines)
- `.opencode/specs/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-gemini/bin/postinstall.js` (79 lines)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | External command execution in postinstall hook (z_future archived code) | `.opencode/specs/z_future/hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/006-babysitter-main/external/plugins/babysitter-gemini/bin/postinstall.js:65-69` spawns `gemini extensions install` via spawnSync with shell:true during npm postinstall. This is in a z_future directory (archived/research code) and appears to be defensive extension installation logic, but external command execution during postinstall is a supply-chain attack vector. | Review if this archived code should be removed or if the postinstall hook is necessary. Consider moving extension installation to manual setup or adding signature verification. |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | npm cache clearing in install script | `.opencode/skills/mcp-code-mode/scripts/install.sh:123` executes `rm -rf ~/.npm/_npx/*` to clear stale npx cache. This is documented in comments as preventing ERR_DLOPEN_FAILED and is a legitimate maintenance operation, not malicious. | No action needed - this is documented cache clearing for a specific error condition. |
| 002 | Permission modification in diagnostic script | `.opencode/commands/doctor/scripts/mcp-doctor.sh:349` executes `chmod +x` on ccc binary in fix mode. This is a legitimate permission repair operation in a diagnostic tool. | No action needed - this is defensive permission fixing. |
| 003 | Benign postinstall hook for version tracking | `.opencode/skills/system-spec-kit/package.json:26` has `postinstall: "node scripts/setup/record-node-version.js"` which only writes Node version metadata to a marker file. Verified script is benign (lines 1-29 of record-node-version.js). | No action needed - this is legitimate version tracking. |
| 004 | Build preparation lifecycle script in dependency | `.opencode/skills/system-spec-kit/node_modules/onnxruntime-common/package.json:16` has `prepare: "npm run build"` which is standard build preparation. | No action needed - standard npm lifecycle behavior. |
| 005 | Development lifecycle scripts in dependency | `.opencode/node_modules/which/package.json:28` has `prechangelog: "bash gen-changelog.sh"` for development workflow. | No action needed - development-only lifecycle script. |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| 001 | No malicious lifecycle scripts found in main codebase | Scanned 1489 package.json files across the repository. Main codebase shows no evidence of curl|wget pipes, base64 decode, eval, or other supply-chain attack patterns. The only postinstall hooks are for benign version tracking or in archived z_future directories. | Continue monitoring for new dependencies. Consider adding `--ignore-scripts` flag to npm install in CI/CD for defense-in-depth. |
| 002 | Documentation of security risks (not active threats) | `.opencode/specs/system-spec-kit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/launch-qa-validation.sh:768` contains documentation about eval() injection risks. `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.js:223` contains console.error documenting rm -rf cache clearing. These are documentation/comments, not active threats. | No action needed - these are educational comments. |
| 003 | chmod operations in test scripts | `.opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/072-speckit-template-memory-ranking-release/tests/run-all-tests.sh:124` executes `chmod +x` on test files. This is in archived code and is for test setup. | No action needed - test setup in archived code. |

## Convergence Signal
newInfoRatio: 0.15 | CLEAN

The postinstall script dimension shows no CRITICAL or HIGH severity threats. The only MEDIUM finding is in z_future archived code that appears to be defensive extension installation logic. All lifecycle scripts in the main codebase are benign build/check operations or version tracking. This dimension does not show indicators of the TanStack Mini Shai-Hulud supply-chain attack pattern (no base64 decode, eval, or network fetch pipes in lifecycle hooks).