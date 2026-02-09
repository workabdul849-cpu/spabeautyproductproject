import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../lib/api";
import { formatUSD } from "../lib/money";

type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
};

export default function SingleService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    apiGet<Service>(`/services/${id}`).then(setService);
  }, [id]);

  if (!service) return <p className="p-6">Loading service…</p>;

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold">{service.name}</h1>
      <p className="mt-4">{service.description}</p>
      <p className="mt-4">
        {service.duration_minutes} mins · {formatUSD(service.price)}
      </p>
      <button
        onClick={() => navigate(`/book?serviceId=${service.id}`)}
        className="mt-6 px-4 py-2 bg-black text-white"
      >
        Book now
      </button>
    </div>
  );
}
