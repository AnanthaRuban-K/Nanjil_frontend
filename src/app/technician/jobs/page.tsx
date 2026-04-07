"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Td } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";

export default function TechnicianJobsPage() {
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const load = useCallback(async () => {
    const res = await api.get("/technician/jobs", {
      params: { page, limit },
    });
    setJobs(res.data.data);
    setTotal(res.data.meta.total);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Jobs</h1>

      <Table>
        <Thead>
          <tr>
            <Th>Reference</Th>
            <Th>Service</Th>
            <Th>Scheduled</Th>
            <Th>Status</Th>
            <Th className="text-right">Action</Th>
          </tr>
        </Thead>
        <tbody className="divide-y divide-gray-200">
          {jobs.map((j) => (
            <tr key={j.id} className="hover:bg-gray-50">
              <Td className="font-medium">{j.bookingReference}</Td>
              <Td>{j.serviceType}</Td>
              <Td>{j.scheduledDate || j.preferredDate}</Td>
              <Td>
                <Badge status={j.status} />
              </Td>
              <Td className="text-right">
                <Link
                  href={`/technician/jobs/${j.id}`}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination page={page} limit={limit} total={total} onChange={setPage} />
    </div>
  );
}