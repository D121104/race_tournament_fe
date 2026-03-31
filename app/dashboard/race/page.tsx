"use client";

import RaceForm from "@/components/form/RaceForm";
import RaceTable from "@/components/ui/RaceTable";
import { useState } from "react";

export default function Race() {
  return (
    <div>
      <h1>Race</h1>
      <RaceTable />
    </div>
  );
}
