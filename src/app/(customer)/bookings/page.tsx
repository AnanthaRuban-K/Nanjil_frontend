"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, type Booking } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Table, Thead, Th, Td } from "@/components/ui/Table";
import { Pagination } from "@/components/ui/Pagination";

export default function BookingListPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const load = useCallback(async () => {
    const res = await api.get("/bookings/my", {
      params: { page, limit },
    });
    setBookings(res.data.data);
    setTotal(res.data.meta.total);
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">No bookings found.</p>
      ) : (
        <>
          <Table>
            <Thead>
              <tr>
                <Th>Reference</Th>
                <Th>Service</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Payment</Th>
                <Th className="text-right">Action</Th>
              </tr>
            </Thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <Td className="font-medium">{b.bookingReference}</Td>
                  <Td>{b.serviceType}</Td>
                  <Td>{b.preferredDate}</Td>
                  <Td>
                    <Badge status={b.status} />
                  </Td>
                  <Td>
                    <Badge status={b.paymentStatus} />
                  </Td>
                  <Td className="text-right">
                    <Link
                      href={`/bookings/${b.id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination
            page={page}
            limit={limit}
            total={total}
            onChange={setPage}
          />
        </>
      )}
    </div>
  );
}