import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGet } from "../lib/api";
import { useAuth } from "../context/AuthContext";

type Service = { id: number; name: string };
type Staff = { id: number; name: string };

export default function Book() {
  const { createBooking } = useAuth();
  const [params] = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [slots, setSlots] = useState<string[]>([]);

  const [serviceId, setServiceId] = useState<number | null>(
    params.get("serviceId") ? Number(params.get("serviceId")) : null
  );
  const [staffId, setStaffId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    apiGet<Service[]>("/services").then(setServices);
    apiGet<Staff[]>("/staff").then(setStaff);
  }, []);

  useEffect(() => {
    if (!date || !staffId) return;
    apiGet<string[]>(
      `/bookings/slots?date=${date}&staffId=${staffId}`
    ).then(setSlots);
  }, [date, staffId]);

  async function submit() {
    if (!serviceId || !staffId || !date || !time) return;
    await createBooking({
      serviceId,
      staffId,
      date,
      time,
    });
    alert("Booking confirmed");
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Book appointment</h1>

      <select
        value={serviceId ?? ""}
        onChange={(e) => setServiceId(e.target.value ? Number(e.target.value) : null)}
        className="w-full border p-2 mb-3"
      >
        <option value="">Select service</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <select
        value={staffId ?? ""}
        onChange={(e) => setStaffId(e.target.value ? Number(e.target.value) : null)}
        className="w-full border p-2 mb-3"
      >
        <option value="">Select staff</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full border p-2 mb-3"
      />

      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border p-2 mb-4"
      >
        <option value="">Select time</option>
        {slots.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <button
        onClick={submit}
        className="w-full bg-black text-white py-2"
      >
        Confirm booking
      </button>
    </div>
  );
}
