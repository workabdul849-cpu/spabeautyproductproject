import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../lib/api";
import { formatUSD } from "../lib/money";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image_url?: string;
};

export default function SingleService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Service>(`/services/${id}`)
      .then(setService)
      .catch(err => {
        console.error('Failed to load service:', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-6">Loading service…</p>;
  if (!service) return <p className="p-6">Service not found</p>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{service.name}</h1>
      <p className="text-sm text-gray-600 mt-2">{service.category}</p>
      <p className="mt-4">{service.description}</p>
      <p className="mt-4 text-lg font-semibold">
        {service.duration} · {formatUSD(Number(service.price))}
      </p>
      <button
        onClick={() => navigate(`/book?serviceId=${service.id}`)}
        className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        Book now
      </button>
    </div>
  );
}
