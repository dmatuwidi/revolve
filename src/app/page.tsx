import { Plus, RotateCw } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const cycles = [
    "Dinner Plans",
    "Outfit Ideas",
    "Weekend Activities"
  ]

  return (
    <div className="flex flex-col min-h-screen p-5 space-y-5">
      {/** Top padding, remove if not needed */}
      <section className="pt-14" />

      {/** Title */}
      <section className="flex justify-center">
        <h1 className="font-semibold text-2xl">Home</h1>
      </section>

      {/** Cycles */}
      <section className="space-y-5">
        {/** Cycle Title */}
        <div className="flex items-center space-x-1.5">
          <RotateCw className="text-primary"/>
          <h2 className="text-2xl font-semibold">Cycles</h2>
        </div>

        {/** Cycle Items */}
        <div className="space-y-3.5">
          {cycles.map((cycle, index) => (
            <h3 className="text-xl" key={index}>{cycle}</h3>
          ))}
        </div>
      </section>

      {/** Add Cycle */}
      <section className="flex p-10 justify-center mt-auto">
        <div className="bg-primary text-primary-foreground w-min p-4 rounded-full">
          <Plus />
        </div>
      </section>

    </div>
  );
}
