export default function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-3">
      <h2 className="font-serif text-2xl text-brown-800">{title}</h2>
      <p className="text-brown-600">
        This module will be implemented in Phase 4.3.
      </p>
    </div>
  );
}
