export default function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100
                      flex items-center justify-center text-2xl mb-4">
        {icon}
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">{title}</p>
      <p className="text-xs text-gray-400 max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white
                     text-xs font-medium rounded-lg transition-colors"
        >
          {action}
        </button>
      )}
    </div>
  )
}