Feature: Shapes
  Scenario: Matching integers
    Given the value 7
    When I match it
    Then the result is "int"

  Scenario: Counting down
    Given the value 2
    When I count down
    Then the result is "2"
