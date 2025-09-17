"use client"

import { Plus, RotateCw } from "lucide-react";
import database from "@/utils/firebase.browser";
import { ref, push, onValue, off } from "firebase/database";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const formSchema = z.object({
  cycle: z.string().min(1, {
    message: "Cycle must be at least 1 character"
  }).max(30, { message: "Cycle must be at most 30 characters"})
})

export default function Home() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [cycles, setCycles] = useState<{[key: string]: string}>({});
  const [loading, setLoading] = useState(true);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cycle: ""
    }
  });

  // Fetch cycles data on component mount and listen for real-time updates
  useEffect(() => {
    const cyclesRef = ref(database, "cycles");
    
    // Set up real-time listener
    const unsubscribe = onValue(cyclesRef, (snapshot) => {
      if (snapshot.exists()) {
        setCycles(snapshot.val());
      } else {
        setCycles({});
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching cycles:", error);
      setLoading(false);
    });

    // Cleanup function to remove listener
    return () => off(cyclesRef, 'value', unsubscribe);
  }, []);

  const onSubmit = async (data : z.infer<typeof formSchema>) => {
    try {
      await push(ref(database, "cycles"), data.cycle);
      console.log("Cycle added:", data.cycle);
      
      setIsPopoverOpen(false);
      setTimeout(() => {
        form.reset();
      }, 50);
    } catch (error) {
      console.error("Error adding cycle:", error);
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-5 space-y-10">
      {/** Search */}
      <section>
        <div className="bg-card flex w-full rounded-md justify-center">
          <Input name="query" placeholder="Search" className="w-full font-medium text-muted-foreground" />
        </div>
      </section>

      {/** Cycles */}
      <section className="space-y-5">
        {/** Cycle Title */}
        <div className="flex items-center space-x-1.5">
          <RotateCw className="text-primary" strokeWidth={3} />
          <h2 className="text-2xl font-semibold">Cycles</h2>
        </div>

        {/** Cycle Items */}
        <div className="space-y-3.5">
          {loading ? (
            <p className="text-muted-foreground">Loading cycles...</p>
          ) : Object.keys(cycles).length === 0 ? (
            <p className="text-muted-foreground">No cycles yet. Tap the + icon below to add your first cycle!</p>
          ) : (
            Object.entries(cycles).map(([key, cycle]) => (
              <h3 className="text-xl" key={key}>{cycle}</h3>
            ))
          )}
        </div>
      </section>

      {/** Add Cycle */}
      <section className="flex p-10 justify-center mt-auto">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button className="cursor-pointer rounded-full w-min aspect-square p-6">
              <Plus />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" sideOffset={20}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 flex flex-col">
                <FormField control={form.control} name="cycle" render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <h2 className="font-medium text-lg">Add New Cycle</h2>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 'Dinner Plans'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}/>
                <Button type="submit" className="cursor-pointer">Add Cycle</Button>
              </form>
            </Form>
          </PopoverContent>
        </Popover>

      </section>

    </div>
  );
}
