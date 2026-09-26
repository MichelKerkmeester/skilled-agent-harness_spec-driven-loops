# frozen_string_literal: true

require "test/unit"
require_relative "../lib/shapes"

class UnitStyleTest < Test::Unit::TestCase
  def setup
    @value = true
  end

  def test_negation
    assert_equal "both", Shapes.negation(@value, true)
  end

  def test_omitted
    omit("demonstrates omissions")
  end
end
