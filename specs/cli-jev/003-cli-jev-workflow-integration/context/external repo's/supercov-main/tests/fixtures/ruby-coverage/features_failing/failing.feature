Feature: Failing shapes
  One passing and one failing scenario, outside features/ so the plain
  cucumber leg keeps passing; the gate runs this directory with the shared
  step definitions and checks the failure is reported as one.

  Scenario: Matching integers
    Given the value 7
    When I match it
    Then the result is "int"

  Scenario: Wrong expectation
    Given the value 7
    When I match it
    Then the result is "float"
