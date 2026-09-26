# Security policy

## Reporting a vulnerability

Report vulnerabilities privately through [GitHub's vulnerability reporting](https://github.com/supercorp-ai/supercov/security/advisories/new) for this repository. Do not open a public issue for them.

Include the Supercov version (`supercov --version`), how it was installed, and the steps that reproduce the problem.

## Supported versions

Fixes ship in the latest release on npm, PyPI, RubyGems, crates.io, Homebrew and GitHub. Older versions are not patched.

## What Supercov sends

Coverage runs locally and sends nothing. `supercov security` and `supercov quality` send source files to TypeSafe, and only when `TYPESAFE_API_KEY` is set.
