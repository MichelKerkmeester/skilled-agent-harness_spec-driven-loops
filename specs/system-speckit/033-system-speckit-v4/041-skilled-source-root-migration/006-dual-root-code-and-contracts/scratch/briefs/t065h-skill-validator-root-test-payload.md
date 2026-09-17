## Edit 1

File: `.opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py`

OLD:

~~~~text
        for w in warnings
    )
~~~~

NEW:

~~~~text
        for w in warnings
    )


def test_validator_finds_the_source_root_under_either_name(tmp_path):
    validator = _load_validator_module()
    for name in (".skilled", ".opencode"):
        script = tmp_path / name / "skills" / "sk-doc" / "sk-create-skill" / "scripts" / "validate_skill_package.py"
        assert validator.find_opencode_root(script) == tmp_path / name
    look_alike = tmp_path / "skilled" / "skills" / "scripts" / "validate_skill_package.py"
    assert validator.find_opencode_root(look_alike) is None
~~~~
