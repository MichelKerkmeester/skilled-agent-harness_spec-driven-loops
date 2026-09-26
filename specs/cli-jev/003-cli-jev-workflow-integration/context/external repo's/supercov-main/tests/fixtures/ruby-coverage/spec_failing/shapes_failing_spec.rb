# frozen_string_literal: true

# One passing and one failing example, outside `spec/` so the plain `rspec`
# leg keeps passing; the gate runs this file and checks the failure is
# reported as one.
require_relative "../lib/shapes"

RSpec.describe Shapes, "failing" do
  it "classifies" do
    expect(Shapes.classify(true, false, true)).to eq(:yes)
  end

  it "fails" do
    expect(Shapes.classify(true, false, true)).to eq(:no)
  end
end
