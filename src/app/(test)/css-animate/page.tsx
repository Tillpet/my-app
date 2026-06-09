export default function Pulse() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div
        className="
          w-24
          h-24
          rounded-full
          bg-red-500

          animate-pulse
        "
      />
    </div>
  );
}
