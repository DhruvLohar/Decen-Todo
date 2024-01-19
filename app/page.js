import TodoCard from "@/components/TodoCard";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-start justify-center p-24">
      <h1 className="text-[4rem] font-bold">Decen Todo</h1>

      <TodoCard />
    </main>
  );
}
