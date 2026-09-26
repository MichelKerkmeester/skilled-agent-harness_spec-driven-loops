# frozen_string_literal: true

# Supercov test-unit adapter: exact test and setup/test/teardown identity plus
# test-unit's own outcome (pass, failure, error, omission, pending).

module Supercov
  module TestUnitAdapter
    RUNNER = "test-unit"

    module TestCaseHooks
      def run(*args, &block)
        Supercov::TestUnitAdapter.start(self)
        super
      ensure
        Supercov::TestUnitAdapter.finish(self)
      end

      def run_setup(&block)
        Supercov::TestUnitAdapter.enter(self, "setup")
        super
      end

      def run_test
        Supercov::TestUnitAdapter.enter(self, "call")
        super
      end

      def run_cleanup
        Supercov::TestUnitAdapter.enter(self, "teardown")
        super
      end

      def run_teardown
        Supercov::TestUnitAdapter.enter(self, "teardown")
        super
      end
    end

    module ResultHooks
      def add_failure(*args)
        Supercov::TestUnitAdapter.note("failed")
        super
      end

      def add_error(*args)
        Supercov::TestUnitAdapter.note("failed")
        super
      end

      def add_omission(*args)
        Supercov::TestUnitAdapter.note("skipped")
        super
      end

      def add_pending(*args)
        Supercov::TestUnitAdapter.note("skipped")
        super
      end
    end

    @runtime = nil
    @state = {}

    def self.install(runtime)
      return if @runtime

      # test-unit loads TestResult from its runner mediator, after TestCase
      # has finished defining. Installing at the class end without it left
      # the result hooks off, so no failure was ever noted, and declared a
      # blocking limitation on every run.
      require "test/unit/testresult"
      ::Test::Unit::TestResult.prepend(ResultHooks)
      ::Test::Unit::TestCase.prepend(TestCaseHooks)
      @runtime = runtime
      runtime.adapter_active = true
    end

    def self.identity(test)
      { worker: @runtime.worker, test: "#{test.class.name}##{test.method_name}", retry: 0, phase: nil }
    end

    # Test::Unit names a class and method, not a path.
    def self.source_file(test)
      test.method(test.method_name).source_location&.first
    rescue NameError
      nil
    end

    def self.start(test)
      @state[Thread.current] = { test: test, phase: nil, phases: {} }
    end

    def self.enter(test, phase)
      state = @state[Thread.current] || start(test)
      return if state[:phase] == phase

      state[:phase] = phase
      state[:phases][phase] ||= "passed"
      identity = identity(test)
      identity[:phase] = phase
      @runtime.switch(identity)
    end

    def self.note(status)
      state = @state[Thread.current]
      return unless state && state[:phase]

      current = state[:phases][state[:phase]]
      state[:phases][state[:phase]] = status unless current == "failed"
    end

    def self.finish(test)
      state = @state.delete(Thread.current)
      return unless state

      identity = identity(test)
      %w[setup call teardown].each do |phase|
        status = state[:phases][phase]
        next if status.nil?

        @runtime.outcome(identity[:worker], identity[:test], 0, phase, status, false, RUNNER, source_file(test))
      end
      @runtime.switch(nil)
    end
  end
end
