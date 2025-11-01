export default function Error({
  className,
  error,
}: {
  className?: string;
  error: string;
}) {
  return (
    <h1 className={`text-center text-[1.2rem] text-red-500 ${className}`}>
      {error}
    </h1>
  );
}
