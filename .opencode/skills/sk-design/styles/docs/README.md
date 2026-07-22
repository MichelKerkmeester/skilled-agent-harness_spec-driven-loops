# styles/docs

Human-facing documentation for the styles library.

## Contents

- `manual-testing-playbook.md` — lean manual QA scenarios for verifying the style database (adapter
  modes, indexer, operator surface) and the `/interface:*` creation commands. Each scenario names a
  concrete on-disk artifact and an acceptable verdict (PASS / PARTIAL / FAIL / SKIP).

## Architecture fit

This folder holds prose docs only — no code and no data. The executable contract lives in `tests/`; the
importable code lives in `lib/`. The playbook is the manual counterpart to the automated `tests/` suites.
