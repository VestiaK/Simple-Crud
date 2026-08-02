'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

type Employee = {
  id: string
  nip: string
  name: string
  position: string
  division: string
  status: string
  createdAt: string
  updatedAt: string
}

type FormState = {
  nip: string
  name: string
  position: string
  division: string
  status: string
}

const initialForm: FormState = {
  nip: '',
  name: '',
  position: '',
  division: '',
  status: 'AKTIF',
}

export default function EmployeeDashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [selected, setSelected] = useState<Employee | null>(null)
  const [form, setForm] = useState<FormState>(initialForm)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function readJsonSafe(res: Response) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  async function loadEmployees(options?: { skipImmediateState?: boolean }) {
    if (!options?.skipImmediateState) {
      setLoading(true)
      setError(null)
    }
    try {
      const res = await fetch('/api/employees')
      const data = await readJsonSafe(res)

      if (res.status === 401) {
        window.location.href = '/login'
        return
      }

      if (!res.ok) {
        throw new Error(data?.message || 'Gagal mengambil data karyawan')
      }

      setEmployees(data.employees || [])
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      void loadEmployees({ skipImmediateState: true })
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [])

  function openCreate() {
    setMode('create')
    setSelected(null)
    setForm(initialForm)
    setIsFormOpen(true)
  }

  function openEdit(employee: Employee) {
    setMode('edit')
    setSelected(employee)
    setForm({
      nip: employee.nip,
      name: employee.name,
      position: employee.position,
      division: employee.division,
      status: employee.status,
    })
    setIsFormOpen(true)
  }

  function closeForm() {
    if (saving) return
    setIsFormOpen(false)
  }

  function handleInput<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      nip: form.nip.trim(),
      name: form.name.trim(),
      position: form.position.trim(),
      division: form.division.trim(),
      status: form.status,
    }

    try {
      const endpoint = mode === 'create' ? '/api/employees' : `/api/employees/${selected?.id}`
      const method = mode === 'create' ? 'POST' : 'PUT'

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await readJsonSafe(res)
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!res.ok) {
        throw new Error(data?.message || 'Gagal menyimpan data')
      }

      setIsFormOpen(false)
      await loadEmployees()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/employees/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      const data = await readJsonSafe(res)
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!res.ok) {
        throw new Error(data?.message || 'Gagal menghapus data')
      }

      setDeleteTarget(null)
      await loadEmployees()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
    } finally {
      setDeleting(false)
    }
  }

  const title = useMemo(() => (mode === 'create' ? 'Tambah Karyawan' : 'Update Karyawan'), [mode])

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Dashboard</p>
            <h1 className="text-3xl font-semibold text-slate-900">Manajemen Karyawan</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/home" className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-white">
              Kembali ke Home
            </Link>
            <button
              type="button"
              onClick={openCreate}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              + Tambah Karyawan
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
        ) : null}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-semibold">NIP</th>
                  <th className="px-4 py-3 font-semibold">Nama</th>
                  <th className="px-4 py-3 font-semibold">Position</th>
                  <th className="px-4 py-3 font-semibold">Division</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      Memuat data karyawan...
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      Belum ada data karyawan.
                    </td>
                  </tr>
                ) : (
                  employees.map((employee) => (
                    <tr key={employee.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{employee.nip}</td>
                      <td className="px-4 py-3 text-slate-700">{employee.name}</td>
                      <td className="px-4 py-3 text-slate-700">{employee.position}</td>
                      <td className="px-4 py-3 text-slate-700">{employee.division}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(employee)}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(employee)}
                            className="rounded-md border border-rose-300 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {isFormOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">Isi field NIP, Nama, Position, Division, dan Status.</p>

            <form onSubmit={submitForm} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                NIP
                <input
                  required
                  value={form.nip}
                  onChange={(e) => handleInput('nip', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Nama
                <input
                  required
                  value={form.name}
                  onChange={(e) => handleInput('name', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  Position
                  <input
                    required
                    value={form.position}
                    onChange={(e) => handleInput('position', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Division
                  <input
                    required
                    value={form.division}
                    onChange={(e) => handleInput('division', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                </label>
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Status
                <select
                  value={form.status}
                  onChange={(e) => handleInput('status', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="NONAKTIF">NONAKTIF</option>
                </select>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {saving ? 'Menyimpan...' : mode === 'create' ? 'Simpan' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-slate-900">Hapus Karyawan</h2>
            <p className="mt-2 text-sm text-slate-600">
              Yakin ingin menghapus <span className="font-semibold">{deleteTarget.name}</span> ({deleteTarget.nip})?
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}
