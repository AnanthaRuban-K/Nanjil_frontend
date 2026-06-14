"use client";

import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import { api, type Technician as AdminUser } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Table, Td, Th, Thead } from "@/components/ui/Table";
import {
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  UserPlus,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function AdminAccountsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    const res = await api.get("/admin/admins", {
      params: { includeInactive: true },
    });
    setAdmins(res.data.data);
  };

  useEffect(() => {
    load().catch(() => undefined);
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

  const startEdit = (admin: AdminUser) => {
    setSelected(admin);
    setForm({
      fullName: admin.fullName,
      email: admin.email,
      phone: admin.phone,
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
        "Nanjil MEP Admin Login",
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
        await api.patch(`/admin/admins/${selected.id}`, {
          fullName: form.fullName,
          phone: form.phone,
          ...(form.password ? { password: form.password } : {}),
        });
      } else {
        await api.post("/admin/admins", form);
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

  const toggleActive = async (admin: AdminUser) => {
    try {
      await api.patch(`/admin/admins/${admin.id}`, {
        isActive: !admin.isActive,
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

  const canSubmit =
    Boolean(form.fullName.trim()) &&
    Boolean(form.phone.trim()) &&
    (selected
      ? !form.password || form.password.length >= 8
      : Boolean(form.email.trim()) && form.password.length >= 8);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Admin Accounts</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create admins, update passwords, and control access.
          </p>
        </div>
        <Button onClick={startCreate}>
          <UserPlus size={16} />
          Add Admin
        </Button>
      </div>

      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </tr>
        </Thead>
        <tbody className="divide-y divide-gray-200">
          {admins.map((admin) => (
            <tr key={admin.id}>
              <Td>{admin.fullName}</Td>
              <Td>{admin.email}</Td>
              <Td>{admin.phone}</Td>
              <Td>
                <Badge status={admin.isActive ? "ACTIVE" : "INACTIVE"} />
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => startEdit(admin)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={admin.isActive ? "danger" : "primary"}
                    onClick={() => toggleActive(admin)}
                  >
                    {admin.isActive ? "Deactivate" : "Activate"}
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        open={open}
        onClose={reset}
        title={selected ? "Edit Admin" : "Add Admin"}
      >
        {createdCredentials ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
              Admin account created. Share these login details only with the
              authorized person.
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
              <div className="grid grid-cols-[90px_1fr] gap-y-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">
                  {createdCredentials.fullName}
                </span>
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">
                  {createdCredentials.email}
                </span>
                <span className="text-gray-500">Password</span>
                <span className="font-medium text-gray-900">
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
                placeholder="+918428489046"
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
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
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
                    className="w-full rounded-lg border border-gray-300 px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <ShieldCheck size={16} />
                {selected ? "Save Changes" : "Create Admin"}
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
