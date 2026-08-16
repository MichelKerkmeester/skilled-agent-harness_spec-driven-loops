import RemoteKit
import SwiftUI

/// The agent's own plan for the turn.
///
/// This is the clearest possible answer to "what is it doing and how far
/// along is it" — better than any spinner, because it's the agent's
/// account of its own work rather than our guess at it. Shown while the
/// turn runs and left in place afterwards as a record.
struct TodoList: View {
    let todos: [TodoItem]

    private var remaining: Int {
        todos.filter { !$0.done && !$0.cancelled }.count
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Plan")
                    .font(.caption.weight(.semibold))
                Spacer()
                Text(remaining == 0
                    ? "all done"
                    : "\(todos.count - remaining)/\(todos.count)")
                    .font(.caption.monospacedDigit())
            }
            .foregroundStyle(Color.inkMuted)

            ForEach(todos) { todo in
                HStack(alignment: .firstTextBaseline, spacing: 8) {
                    Image(systemName: symbol(for: todo))
                        .font(.caption)
                        .foregroundStyle(tint(for: todo))
                    Text(todo.content)
                        .font(.footnote)
                        .strikethrough(todo.cancelled)
                        .foregroundStyle(todo.done || todo.cancelled
                            ? Color.inkFaint : Color.ink)
                    Spacer(minLength: 0)
                }
            }
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: Radius.block, style: .continuous)
                .fill(Color.surface)
        )
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Plan, \(todos.count - remaining) of \(todos.count) done")
    }

    private func symbol(for todo: TodoItem) -> String {
        if todo.done { return "checkmark.circle.fill" }
        if todo.cancelled { return "xmark.circle" }
        if todo.active { return "circle.dotted" }
        return "circle"
    }

    private func tint(for todo: TodoItem) -> Color {
        if todo.done { return .positive }
        if todo.active { return .clay }
        return .inkFaint
    }
}
