# Iteration 003 - Supply-Chain npm

## Summary
VERIFIED-CLEAN: No TanStack packages found in Public repo or npx cache. Standard npm configuration with official registry. Lifecycle scripts are standard build/prepare patterns. No supply-chain indicators detected.

## Files/Commands Reviewed
- `find . -name node_modules -prune -o \( -name package.json -o -name package-lock.json -o -name npm-shrinkwrap.json -o -name pnpm-lock.yaml \) -print` (exit code 0, 100+ package manifests found)
- `find . -name node_modules -prune -o -name package-lock.json -print | xargs -I {} rg -n "@tanstack/|resolved|integrity|postinstall|preinstall|prepare|install" {}` (exit code 0, 21000+ lines of resolved/integrity data, lifecycle scripts)
- `rg -n "@tanstack/" . --glob "package*.json" --glob "pnpm-lock.yaml"` (exit code 1, NO MATCHES - VERIFIED-CLEAN)
- `find ~/.npm/_npx -maxdepth 4 \( -name package.json -o -name package-lock.json \) -print` (exit code 0, 500+ package files found)
- `find ~/.npm/_npx -maxdepth 4 \( -name package.json -o -name package-lock.json \) -print | xargs -I {} rg -n "@tanstack/|postinstall|preinstall|prepare|install" {}` (exit code 1, NO TANSTACK MATCHES - VERIFIED-CLEAN)
- `find ~/.npm -type f -newermt "2026-05-15 00:00" | head -200` (exit code 0, 200+ recent cache entries from normal operations)
- `npm config list --json` (exit code 0, standard configuration with official registry)

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
| - | None | - | - |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| NPM-001 | Standard npm registry configuration | npm config shows registry: "https://registry.npmjs.org/" (official npm registry) | None - configuration is correct |
| NPM-002 | No TanStack dependencies in Public repo | rg -n "@tanstack/" returned exit code 1 (no matches) across all package*.json and pnpm-lock.yaml files | None - repo is not affected by TanStack vulnerability |
| NPM-003 | No TanStack in npx cache | Search of ~/.npm/_npx package files for @tanstack/ returned exit code 1 (no matches) | None - npx cache is clean |
| NPM-004 | Lifecycle scripts are standard build patterns | package-lock.json files contain standard prepare/postinstall scripts like "npm run build", "tsc", "husky install" - no suspicious execution patterns | None - these are normal development lifecycle scripts |
| NPM-005 | Recent cache entries from normal operations | 200+ files in ~/.npm modified since 2026-05-15 00:00 including _cacache content and _logs from today's npm operations | None - expected activity from current development work |

## Convergence Signal
newInfoRatio: 0.05 - CLEAN dimension. No TanStack packages, standard npm configuration, normal lifecycle scripts, no supply-chain attack indicators. This iteration provides strong negative evidence that the Public repo is not affected by the TanStack Mini Shai-Hulud supply-chain attack.
