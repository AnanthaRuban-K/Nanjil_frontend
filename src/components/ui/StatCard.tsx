import type { ReactNode } from "react";

interface Props {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
}

export function StatCard({ label, value, icon, color = "text-gray-400" }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        {icon && <div className={color}>{icon}</div>}
      </div>
    </div>
  );
}