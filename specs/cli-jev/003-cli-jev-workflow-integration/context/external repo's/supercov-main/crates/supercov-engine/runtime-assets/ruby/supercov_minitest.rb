# frozen_string_literal: true

# Supercov Minitest adapter: exact test and setup/test/teardown identity plus
# Minitest's own outcome. Skips, assertion failures and errors are attributed
# to the phase in which they surfaced.

module Supercov
  module MinitestAdapter
    RUNNER = "minitest"

    module TestHooks
      def run
        Supercov::MinitestAdapter.enter(self, "setup")
        result = super
        Supercov::MinitestAdapter.finish(self)
        result
      end

      def after_setup
        result = super
        Supercov::MinitestAdapter.enter(self, "call")
        result
      end

      def before_teardown
        Supercov::MinitestAdapter.enter(self, "teardown")
        super
      end

      def capture_exceptions
        before = failures.length
        super
      ensure
        Supercov::MinitestAdapter.note_failures(self, failures[before..] || [])
      end
    end

    @runtime = nil
    @state = {}

    def self.install(runtime)
      return if @runtime

      @runtime = runtime
      runtime.adapter_active = true
      ::Minitest::Test.prepend(TestHooks)
    end

    def self.identity(test)
      { worker: @runtime.worker, test: "#{test.class.name}##{test.name}", retry: 0, phase: nil }
    end

    # Where the test method is defined. Minitest's identity is a class and
    # method name, not a path, and an assertion map selects tests by file and
    # name. A method Minitest synthesised has no source location.
    def self.source_file(test)
      test.method(test.name).source_location&.first
    rescue NameError
      nil
    end

    def self.enter(test, phase)
      state = (@state[test.object_id] ||= { phases: {} })
      state[:phase] = phase
      state[:phases][phase] ||= "passed"
      identity = identity(test)
      identity[:phase] = phase
      @runtime.switch(identity)
    end

    def self.note_failures(test, new_failures)
      state = @state[test.object_id]
      return if state.nil? || new_failures.empty?

      phase = state[:phase] || "call"
      status = new_failures.any? { |failure| failure.is_a?(::Minitest::Skip) } && new_failures.all? { |failure| failure.is_a?(::Minitest::Skip) } ? "skipped" : "failed"
      state[:phases][phase] = status
    end

    def self.finish(test)
      state = @state.delete(test.object_id)
      return unless state

      identity = identity(test)
      file = source_file(test)
      %w[setup call teardown].each do |phase|
        status = state[:phases][phase]
        next if status.nil?

        @runtime.outcome(identity[:worker], identity[:test], 0, phase, status, false, RUNNER, file)
      end
      @runtime.switch(nil)
    end
  end
end
