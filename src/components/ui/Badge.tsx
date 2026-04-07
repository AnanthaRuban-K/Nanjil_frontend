const STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  PAID: "bg-green-100 text-green-800",
  UNPAID: "bg-orange-100 text-orange-800",
  CASH: "bg-teal-100 text-teal-800",
  UPI: "bg-indigo-100 text-indigo-800",
};

export function Badge({ status }: { status: string }) {
  const style = STYLES[status] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}