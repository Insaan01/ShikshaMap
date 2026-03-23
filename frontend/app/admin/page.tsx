"use client";
import React, { useEffect, useState } from "react";

export default function AdminPage() {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/ngo/list") // We need to add this endpoint to the backend!
      .then(res => res.json())
      .then(data => setNgos(data));
  }, []);

  return (
    <div className="p-10 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Registered Organizations</h1>
      <table className="w-full border-collapse border border-white/10">
        <thead>
          <tr className="bg-white/5">
            <th className="border border-white/10 p-2">Name</th>
            <th className="border border-white/10 p-2">Email</th>
            <th className="border border-white/10 p-2">State</th>
          </tr>
        </thead>
        <tbody>
          {ngos.map((ngo: any) => (
            <tr key={ngo.id}>
              <td className="border border-white/10 p-2">{ngo.org_name}</td>
              <td className="border border-white/10 p-2">{ngo.email}</td>
              <td className="border border-white/10 p-2">{ngo.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}