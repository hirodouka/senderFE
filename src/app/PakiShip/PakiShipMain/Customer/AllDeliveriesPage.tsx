import { useNavigate } from "react-router";
import { ArrowLeft, Package, Clock } from "lucide-react";

export function AllDeliveriesPage() {
  const navigate = useNavigate();

  const deliveries = [
    {
      id: "PKS-2024-001",
      location: "Makati City",
      time: "15 mins away",
      status: "In Transit",
      statusClass: "text-blue-600 bg-blue-50",
    },
    {
      id: "PKS-2024-002",
      location: "Quezon City",
      time: "30 mins away",
      status: "Out for Delivery",
      statusClass: "text-yellow-600 bg-yellow-50",
    },
    {
      id: "PKS-2024-003",
      location: "Pasig City",
      time: "1 hour away",
      status: "Processing",
      statusClass: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F9F8]">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">All Deliveries</h1>
            <p className="text-sm text-gray-500">Track all your active parcels</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-[#39B5A8] hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#39B5A8]/10 rounded-2xl flex items-center justify-center">
                    <Package className="w-7 h-7 text-[#39B5A8]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{delivery.id}</h3>
                    <p className="text-sm text-gray-500">{delivery.location}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[#39B5A8] font-semibold">
                      <Clock className="w-3 h-3" />
                      {delivery.time}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-4 py-2 rounded-lg font-semibold text-sm ${delivery.statusClass}`}>
                    {delivery.status}
                  </span>
                  <button
                    onClick={() => navigate("/customer/track-package", { state: { trackingNumber: delivery.id } })}
                    className="mt-2 text-[#39B5A8] text-sm font-bold hover:underline block"
                  >
                    Track →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
