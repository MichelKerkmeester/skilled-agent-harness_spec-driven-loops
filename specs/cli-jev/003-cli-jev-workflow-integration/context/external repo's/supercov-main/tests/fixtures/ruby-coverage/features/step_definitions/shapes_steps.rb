# frozen_string_literal: true

Before do
  @value = nil
end

Given("the value {int}") do |value|
  @value = value
end

When("I match it") do
  @result = Shapes.matcher(@value).to_s
end

When("I count down") do
  @result = Shapes.countdown(@value).to_s
end

Then("the result is {string}") do |expected|
  raise "expected #{expected}, got #{@result}" unless @result == expected
end

After do
  @result = nil
end
