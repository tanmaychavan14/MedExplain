import { UploadCloud, FileText, GitCompare, Activity } from "lucide-react";

function NavigationTabs({ activeView, onTabChange }) {
  const tabs = [
    { id: "upload", label: "Upload Report", icon: UploadCloud },
    { id: "list", label: "My Reports", icon: FileText },
    { id: "compare", label: "Compare Reports", icon: GitCompare },
    { id: "guide", label: "Body Guide", icon: Activity }
  ];

  return (
    <div className="bg-white border-b border-[var(--color-surface-200)] sticky top-16 z-40 shadow-sm/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto scroller-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  group inline-flex items-center gap-2 py-4 px-1 border-b-[2.5px] font-semibold text-sm transition-all duration-200
                  ${isActive
                    ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                    : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-surface-300)]"}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-tertiary)] group-hover:text-[var(--color-text-secondary)]"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default NavigationTabs;