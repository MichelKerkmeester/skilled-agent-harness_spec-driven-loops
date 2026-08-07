# Iteration 004 - Supply-Chain pip/cargo/uv/brew

## Summary
Supply-chain posture shows defensive gaps but no active compromise indicators. Documentation contains pipe-to-shell patterns creating theoretical risk if executed without verification. No CRITICAL findings; package manager usage follows standard patterns with opportunities for security hardening.

## Files/Commands Reviewed
- `find . \( -name pyproject.toml -o -name requirements.txt -o -name uv.lock -o -name poetry.lock -o -name Pipfile -o -name Cargo.toml -o -name Cargo.lock -o -name Brewfile \)` (55 files found, exit code 0)
- `rg -n --hidden --glob "!**/node_modules/**" "(curl .*[|] *(sh|bash)|wget .*[|] *(sh|bash)|pip install|uv tool install|cargo install|brew install|setup.py|build-backend)" .` (269 matches, exit code 0)
- `python3 -m pip config list -v` (no custom config, exit code 0)
- `python3 -m pip list --format=columns | head -200` (32 packages, 1 editable, exit code 0)
- `find ~/.cache/pip ~/.local/share/uv ~/.cargo -maxdepth 4 -type f | head -300` (uv/cargo caches present, no pip cache, exit code 1)
- `cargo install --list` (1 package: codegraph-mcp-server, exit code 0)
- `brew tap; brew leaves` (6 taps, 32 leaves, exit code 0)

## Findings

### CRITICAL
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| - | None | - | - |

### HIGH
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| SC001 | Pipe-to-shell patterns in documentation | `.opencode/install_guides/README.md:427` contains `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash` | Add verification steps: download to temp file, inspect hash/signature, then execute |
| SC002 | Editable dependency with external path | `pip list` shows `cc-sessions 0.2.6` at editable path `/Users/michelkerkmeester/MEGA/AI & Dev/Websites/anobel.nl/.cc-sessions-install` | Audit editable dependency source, consider pinning to specific commit or using fork with security review |

### MEDIUM
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| SC003 | No pip security hardening | `python3 -m pip config list -v` shows no custom configuration (no require-hashes, trusted-hosts, or certificate verification settings) | Configure pip with require-hashes for production, use trusted-hosts for internal PyPI mirrors, enable certificate verification |
| SC004 | External dependencies without provenance | Multiple `Cargo.toml` and `uv.lock` files reference external crates/packages without SBOM or provenance tracking | Implement SBOM generation (syft, cyclonedx), consider sigstore/cosign for package signing verification |
| SC005 | Multiple package managers without unified governance | pip, uv, cargo, brew all active with no cross-manager dependency visibility or policy | Implement unified dependency inventory tool (renovate, dependabot) with cross-manager support |
| SC006 | Build-backend uses setuptools without pinning | `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:6` uses `build-backend = "setuptools.build_meta"` without version pinning | Pin build-backend to specific version: `build-backend = "setuptools.build_meta"` with requires pinning setuptools version |

### LOW
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| SC007 | Documentation install commands lack verification | Multiple files contain `brew install`, `pip install`, `uv tool install` without hash/signature verification steps | Add verification guidance to all install documentation (checksums, GPG signatures) |
| SC008 | Development dependencies not pinned | Some pyproject.toml files use unbounded version ranges for dev dependencies (e.g., `>=1.0.0`) | Pin all dependencies including dev dependencies to exact versions in lockfiles |
| SC009 | Mixed Python version management | uv cache shows both Python 3.11 and 3.12 installed without clear version policy | Establish Python version policy, pin to specific version for production environments |

### INFO
| ID | What | Evidence | Remediation |
|----|------|----------|-------------|
| SC010 | Standard package manager usage | pip, cargo, uv, brew all follow standard installation patterns | No action needed - follows best practices |
| SC011 | Cargo workspace with external dependencies | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/cocoindex-main/Cargo.toml` uses workspace with 5 external crates | Monitor for security advisories in workspace dependencies |
| SC012 | Homebrew with development tools | brew leaves include standard development tools (node, python, cmake, deno, etc.) | Keep brew updated regularly: `brew update && brew upgrade` |
| SC013 | No pip cache present | `~/.cache/pip` directory does not exist | Consider enabling pip cache for build reproducibility, or ensure clean builds if intentional |
| SC014 | Limited cargo installs | Only 1 cargo-installed package (codegraph-mcp-server) | Maintain current practice of minimal cargo install usage |

## Convergence Signal
newInfoRatio: 0.65 - This dimension shows INDICATORS-PRESENT. Defensive gaps exist around package verification, dependency provenance, and configuration hardening, but no active compromise indicators were found. The pipe-to-shell patterns in documentation represent the highest theoretical risk if executed without verification. Recommendation: implement pip security hardening, add verification steps to install documentation, and consider SBOM generation for external dependencies.
