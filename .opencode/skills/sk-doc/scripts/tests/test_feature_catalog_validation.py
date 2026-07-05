#!/usr/bin/env python3
"""Unit test for the feature-catalog Validation-And-Tests table check.

Guards the two drift classes the generic readme path missed: em-dash placeholder rows that used
to pass as valid, and off-taxonomy Type values. Run: python3 test_feature_catalog_validation.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from validate_document import validate_feature_catalog_table  # noqa: E402

RULES = {"allowedValidationTypes": ["Automated test", "Manual playbook"]}
HDR = "### Validation And Tests\n\n| File | Type | Role |\n|---|---|---|\n"


def run() -> int:
    fails = []

    def check(name: str, cond: bool) -> None:
        print(("PASS " if cond else "FAIL ") + name)
        if not cond:
            fails.append(name)

    # Placeholder row (em-dash File + Role, filler Type) is rejected as BLOCKING.
    e = validate_feature_catalog_table(HDR + "| — | Automated test | — |\n", RULES)
    check("placeholder row flagged BLOCKING",
          len(e) == 1 and "Placeholder" in e[0]["message"] and e[0]["severity"] == "blocking")

    # Mutation guard: the SAME table with a real file + role must NOT flag — proves the check
    # discriminates on content, not on the table's mere presence.
    ok = HDR + "| `tests/x.vitest.ts` | Automated test | Regression coverage. |\n"
    check("valid row passes (mutation guard)", validate_feature_catalog_table(ok, RULES) == [])

    # Off-taxonomy Type value is surfaced as a WARNING (advisory, non-blocking — the live corpus
    # uses many descriptive Type values, so this must not fail a third of catalogs).
    e = validate_feature_catalog_table(HDR + "| `tests/x.ts` | Integration | Cover. |\n", RULES)
    check("off-taxonomy Type flagged WARNING",
          any("Off-taxonomy validation Type 'Integration'" in x["message"] and x["severity"] == "warning" for x in e))

    # Un-filled template row ({TEST_FILE_1}) is skipped so a fresh scaffold does not fail.
    tmpl = HDR + "| `{TEST_FILE_1}` | {Automated test\\|Manual playbook} | {ROLE_1} |\n"
    check("template placeholder skipped", validate_feature_catalog_table(tmpl, RULES) == [])

    # No validation table anywhere -> no errors.
    check("no table -> no errors", validate_feature_catalog_table("# Doc\nprose only\n", RULES) == [])

    # Regression guard: every returned entry MUST carry a non-empty 'type' key, else
    # validate_document.py's error/warning printer raises KeyError rendering it (it does
    # `error['type']` / `warning['type']` directly, not `.get`).
    entries = (validate_feature_catalog_table(HDR + "| — | Automated test | — |\n", RULES)
               + validate_feature_catalog_table(HDR + "| `tests/x.ts` | Integration | Cover. |\n", RULES))
    check("every entry carries a non-empty 'type' key (printer guard)",
          all(isinstance(e.get("type"), str) and e["type"] for e in entries))

    print(f"\n{'ALL PASS' if not fails else f'{len(fails)} FAILED'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(run())
