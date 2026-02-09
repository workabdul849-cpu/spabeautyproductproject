import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<Service[]>("/services")
      .then(setServices)
      .catch(err => {
        console.error('Failed to load services:', err);
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6">Loading services…</p>;
  
  if (services.length === 0) {
    return <p className="p-6 text-center text-brown-600">No services available</p>;
  }

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      {services.map((s) => (
        <div key={s.id} className="border rounded p-4">
          <h2 className="font-semibold text-lg">{s.name}</h2>
          <p className="text-sm text-gray-600 mt-2">{s.description}</p>
          <p className="mt-2 text-sm">
            {s.duration} · {formatUSD(Number(s.price))}
          </p>
          <Link
            to={`/services/${s.id}`}
            className="inline-block mt-4 text-blue-600"
          >
            View details →
          </Link>
        </div>
      ))}
    </div>
  );
}
