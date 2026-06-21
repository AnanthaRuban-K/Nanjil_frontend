"use client";

import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { api, type Technician } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Technician | null>(null);
  const [error, setError] = useState("");
  const [pageError, setPageError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{
    fullName: string;
    email: string;
    password: string;
  } | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const load = async () => {
    setPageError("");
    setPageLoading(true);

    try {
      const res = await api.get("/admin/technicians", {
        params: { includeInactive: true },
      });
      setTechnicians(res.data.data);
    } catch {
      setPageError("Unable to load technicians. Please try again.");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setOpen(false);
    setSelected(null);
    setError("");
    setCopied(false);
    setLoading(false);
    setShowPassword(false);
    setCreatedCredentials(null);
    setForm({ fullName: "", email: "", phone: "", password: "" });
  };

  const startCreate = () => {
    reset();
    setOpen(true);
  };

  const startEdit = (tech: Technician) => {
    setSelected(tech);
    setForm({
      fullName: tech.fullName,
      email: tech.email,
      phone: tech.phone,
      password: "",
    });
    setError("");
    setCopied(false);
    setCreatedCredentials(null);
    setOpen(true);
  };

  const generatePassword = () => {
    const chars =
      "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$";
    const values = new Uint32Array(12);
    window.crypto.getRandomValues(values);
    const generated = Array.from(values, (value) => chars[value % chars.length])
      .join("")
      .replace(/^(.{4})/, "$1@");

    setForm({ ...form, password: generated });
    setShowPassword(true);
  };

  const copyCredentials = async () => {
    if (!createdCredentials) return;

    await navigator.clipboard.writeText(
      [
        "Nanjil MEP Technician Login",
        `Name: ${createdCredentials.fullName}`,
        `Email: ${createdCredentials.email}`,
        `Password: ${createdCredentials.password}`,
        `Login: ${window.location.origin}/login`,
      ].join("\n")
    );
    setCopied(true);
  };

  const submit = async () => {
    setError("");
    setCopied(false);
    setLoading(true);
    try {
      if (selected) {
        await api.patch(`/admin/technicians/${selected.id}`, {
          fullName: form.fullName,
          phone: form.phone,
          ...(form.password ? { password: form.password } : {}),
        });
      } else {
        await api.post("/admin/technicians", form);
        setCreatedCredentials({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
        setForm({ fullName: "", email: "", phone: "", password: "" });
      }
      load();
      if (selected) reset();
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (tech: Technician) => {
    try {
      await api.patch(`/admin/technicians/${tech.id}`, {
        isActive: !tech.isActive,
      });
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        window.alert(err.response?.data?.message || "Failed");
      } else {
        window.alert("Something went wrong");
      }
    }
  };

  const deleteTechnician = async (tech: Technician) => {
    if (
      !window.confirm(
        `Delete ${tech.fullName}? This will remove their login access but keep past booking history.`
      )
    ) {
      return;
    }

    try {
      await api.patch(`/admin/technicians/${tech.id}`, {
        isActive: false,
      });
      load();
    } catch (err) {
      if (err instanceof AxiosError) {
        window.alert(err.response?.data?.message || "Failed");
      } else {
        window.alert("Something went wrong");
      }
    }
  };

  const filteredTechnicians = useMemo(() => {
    const text = search.trim().toLowerCase();
    const visibleTechnicians = showInactive
      ? technicians
      : technicians.filter((tech) => tech.isActive);

    if (!text) return visibleTechnicians;

    return visibleTechnicians.filter((tech) =>
      [tech.fullName, tech.email, tech.phone, tech.isActive ? "active" : "inactive"]
        .join(" ")
        .toLowerCase()
        .includes(text)
    );
  }, [search, showInactive, technicians]);

  const activeCount = technicians.filter((tech) => tech.isActive).length;
  const inactiveCount = technicians.length - activeCount;

  const canSubmit =
    Boolean(form.fullName.trim()) &&
    Boolean(form.phone.trim()) &&
    (selected
      ? !form.password || form.password.length >= 8
      : Boolean(form.email.trim()) && form.password.length >= 8);

  return (
    <div className="mx-auto max-w-7xl space-y-5 sm:space-y-6">
      <section className="rounded-lg bg-[#0F2F57] p-5 text-white shadow-xl shadow-[#0F2F57]/10 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#9BE7F6]">
              <UserCog size={14} />
              Technician access center
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">Technicians</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">
              Create technician login accounts, update contact details, rotate
              passwords, and control service team access.
            </p>
          </div>
          <Button onClick={startCreate} className="w-full sm:w-auto">
            <UserPlus size={16} />
            Add Technician
          </Button>
        </div>
      </section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            label: "Total Technicians",
            value: technicians.length,
            icon: Users,
            color: "bg-[#E7F8FC] text-[#0E7892]",
          },
          {
            label: "Active",
            value: activeCount,
            icon: UserCheck,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Inactive",
            value: inactiveCount,
            icon: ShieldCheck,
            color: "bg-[#FFF4E2] text-[#F7941D]",
          },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-lg border border-[#D7E4EE] bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="mt-1 text-2xl font-bold text-[#12355B]">
                  {pageLoading ? "-" : value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <section className="overflow-hidden rounded-lg border border-[#D7E4EE] bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-[#E7EEF5] p-4 lg:flex-row lg:items-center lg:justify-between sm:p-5">
          <div>
            <h2 className="font-semibold text-[#12355B]">Technician Directory</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Manage active and inactive technician accounts
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 rounded border-[#D7E4EE] text-[#0E7892] focus:ring-[#37B8D8]"
              />
              Show inactive
            </label>
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search technician"
                className="h-10 w-full rounded-lg border border-[#D7E4EE] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
              />
            </div>
          </div>
        </div>

        {pageError ? (
          <div className="p-8 text-center">
            <p className="text-sm text-red-600">{pageError}</p>
            <button
              onClick={load}
              className="mt-4 rounded-lg border border-[#D7E4EE] px-4 py-2 text-sm font-semibold text-[#12355B] hover:bg-[#F4F8FB]"
            >
              Try Again
            </button>
          </div>
        ) : pageLoading ? (
          <div className="space-y-3 p-4 sm:p-5">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse items-center gap-3 rounded-lg border border-[#EEF3F7] p-4"
              >
                <div className="h-11 w-11 rounded-full bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-3 w-1/2 rounded bg-slate-50" />
                </div>
              </div>
            ))}
          </div>
        ) : technicians.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-[#E7F8FC]">
              <UserPlus size={26} className="text-[#0E7892]" />
            </div>
            <h3 className="font-semibold text-[#12355B]">
              No technicians yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">
              Create technician accounts so bookings can be assigned quickly.
            </p>
            <Button onClick={startCreate} className="mt-5">
              <UserPlus size={16} />
              Add Technician
            </Button>
          </div>
        ) : filteredTechnicians.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-[#12355B]">No matching technicians</p>
            <p className="mt-1 text-sm text-slate-500">
              Try another name, email, phone, or status.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-[#E7EEF5]">
                <thead className="bg-[#F8FBFD]">
                  <tr>
                    {["Name", "Email", "Phone", "Status"].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500"
                      >
                        {heading}
                      </th>
                    ))}
                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF3F7]">
                  {filteredTechnicians.map((tech) => (
                    <tr key={tech.id} className="transition-colors hover:bg-[#F8FBFD]">
                      <td className="px-5 py-4 text-sm font-semibold text-[#12355B]">
                        {tech.fullName}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {tech.email}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm">
                        <a
                          href={`tel:${tech.phone}`}
                          className="font-medium text-[#0E7892] hover:text-[#12355B]"
                        >
                          {tech.phone}
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <Badge status={tech.isActive ? "ACTIVE" : "INACTIVE"} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => startEdit(tech)}
                          >
                            Edit
                          </Button>
                          {tech.isActive ? (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => deleteTechnician(tech)}
                            >
                              Delete
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => toggleActive(tech)}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#EEF3F7] lg:hidden">
              {filteredTechnicians.map((tech) => (
                <article key={tech.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#12355B]">
                        {tech.fullName}
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-500">
                        {tech.email}
                      </p>
                    </div>
                    <Badge status={tech.isActive ? "ACTIVE" : "INACTIVE"} />
                  </div>
                  <a
                    href={`tel:${tech.phone}`}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#0E7892]"
                  >
                    <Phone size={15} />
                    {tech.phone}
                  </a>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEdit(tech)}
                    >
                      Edit
                    </Button>
                    {tech.isActive ? (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => deleteTechnician(tech)}
                      >
                        Delete
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => toggleActive(tech)}
                      >
                        Activate
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <Modal
        open={open}
        onClose={reset}
        title={selected ? "Edit Technician" : "Add Technician"}
      >
        {createdCredentials ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Technician account created. Share these login details with the
              technician.
            </div>

            <div className="rounded-lg border border-[#D7E4EE] bg-[#F8FBFD] p-4 text-sm">
              <div className="grid grid-cols-[90px_1fr] gap-y-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">
                  {createdCredentials.fullName}
                </span>
                <span className="text-gray-500">Email</span>
                <span className="break-words font-medium text-gray-900">
                  {createdCredentials.email}
                </span>
                <span className="text-gray-500">Password</span>
                <span className="break-words font-medium text-gray-900">
                  {createdCredentials.password}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button className="flex-1" onClick={copyCredentials}>
                <Copy size={16} />
                {copied ? "Copied" : "Copy Details"}
              </Button>
              <Button
                className="flex-1"
                variant="secondary"
                onClick={startCreate}
              >
                Add Another
              </Button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Input
                label="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
              <Input
                label="Email"
                type="email"
                disabled={Boolean(selected)}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={form.phone}
                placeholder="9876543210"
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
              <div>
                <div className="mb-1 flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    {selected ? "New Password (optional)" : "Password"}
                  </label>
                  {!selected && (
                    <button
                      type="button"
                      onClick={generatePassword}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#0E7892] hover:text-[#12355B]"
                    >
                      <RefreshCw size={13} />
                      Generate
                    </button>
                  )}
                </div>
                <div className="relative">
                  <KeyRound
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    placeholder={
                      selected
                        ? "Leave blank to keep current password"
                        : "Min 8 characters"
                    }
                    className="w-full rounded-lg border border-[#D7E4EE] px-9 py-2 text-sm outline-none focus:border-[#37B8D8] focus:ring-2 focus:ring-[#37B8D8]/20"
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && form.password.length < 8 && (
                  <p className="mt-1 text-xs text-red-600">
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>
              <Button
                className="w-full"
                loading={loading}
                onClick={submit}
                disabled={!canSubmit}
              >
                {selected ? "Save Changes" : "Create Technician"}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
