# frozen_string_literal: true

# Supercov RSpec adapter: exact example, retry and before/example/after phase
# identity plus RSpec's own outcome, recorded without changing how examples run.

module Supercov
  module RSpecAdapter
    RUNNER = "rspec"

    module ExampleHooks
      def with_around_and_singleton_context_hooks(*args, &block)
        Supercov::RSpecAdapter.enter(self, "setup")
        super
      end

      def run_before_example
        result = super
        Supercov::RSpecAdapter.enter(self, "call")
        result
      end

      def run_after_example
        Supercov::RSpecAdapter.enter(self, "teardown")
        super
      end

      def set_exception(exception)
        Supercov::RSpecAdapter.note_exception(self)
        super
      end

      def finish(reporter)
        result = super
        Supercov::RSpecAdapter.finish(self)
        result
      end
    end

    @runtime = nil
    @state = {}

    def self.install(runtime)
      return if @runtime

      @runtime = runtime
      runtime.adapter_active = true
      ::RSpec::Core::Example.prepend(ExampleHooks)
    end

    def self.identity(example)
      id = example.id.to_s.sub(%r{\A\./}, "")
      retry_index = example.metadata[:retry_attempts].to_i
      { worker: @runtime.worker, test: id, retry: retry_index, phase: nil }
    end

    # RSpec's identity is "spec/m_spec.rb[1:1]" -- a path with a scope suffix,
    # not a path. Metadata carries the file itself.
    def self.source_file(example)
      metadata = example.metadata
      metadata[:absolute_file_path] || metadata[:file_path]
    end

    def self.enter(example, phase)
      state = (@state[example.object_id] ||= { failed: {} })
      state[:phase] = phase
      identity = identity(example)
      identity[:phase] = phase
      @runtime.switch(identity)
    end

    def self.note_exception(example)
      state = @state[example.object_id]
      return unless state

      state[:failed][state[:phase]] = true if state[:phase]
    end

    def self.finish(example)
      state = @state.delete(example.object_id)
      return unless state

      identity = identity(example)
      status = example.execution_result.status
      call_outcome =
        case status
        when :passed then "passed"
        when :pending then "skipped"
        else "failed"
        end
      xfail = example.execution_result.pending_fixed? || (status == :pending && !example.execution_result.exception.nil?)
      %w[setup call teardown].each do |phase|
        outcome = if state[:failed][phase]
          "failed"
        elsif phase == "call"
          call_outcome
        else
          "passed"
        end
        @runtime.outcome(identity[:worker], identity[:test], identity[:retry], phase, outcome, xfail, RUNNER, source_file(example))
      end
      @runtime.switch(nil)
    end
  end
end
