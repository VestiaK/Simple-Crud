import Link from 'next/link'
import { cookies } from 'next/headers'
import { ArrowRight, BadgeCheck, BarChart3, ShieldCheck, Sparkles } from 'lucide-react'
import { verifyToken, type JwtPayload } from '@/lib/jwt'

type Session = JwtPayload & { name?: string }
type CookieStore = Awaited<ReturnType<typeof cookies>>

const highlights = [
  {
    title: 'Survei yang presisi',
    description: 'Data lapangan disusun menjadi insight yang cepat dipakai untuk keputusan bisnis dan operasional.',
    icon: BarChart3,
  },
  {
    title: 'Inspeksi & pengujian',
    description: 'Pendekatan terukur untuk memastikan mutu, kepatuhan, dan kesiapan aset di lapangan.',
    icon: ShieldCheck,
  },
  {
    title: 'Konsultansi strategis',
    description: 'Dukungan advisory untuk proyek energi, infrastruktur, dan industri yang butuh ketelitian tinggi.',
    icon: Sparkles,
  },
]

const capabilities = [
  'Survey dan pemetaan',
  'Inspection management',
  'Testing laboratorium',
  'Engineering advisory',
]

async function getSession(): Promise<Session | null> {
  const cookieStore: CookieStore = await cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return null
  }

  try {
    return verifyToken(token) as Session
  } catch {
    return null
  }
}

export default async function HomePage() {
  const session = await getSession()
  const canSeeEmployeeMenu = session?.role === 'USER' || session?.role === 'ADMIN'
  const displayName = session?.name ?? session?.email ?? 'Pengguna'

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(35,61,70,0.08),_transparent_36%),linear-gradient(180deg,_#f5f7f4_0%,_#edf1ef_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-20 rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-[10px] font-semibold tracking-[0.28em] text-slate-500">
                LOGO
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                  PT Surveyor Indonesia
                </p>
                <p className="text-sm text-slate-600">
                  Jasa survei, inspeksi, pengujian, dan konsultansi
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-7 lg:flex">
              <Link href="#profile" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Profile Perusahaan
              </Link>
              {canSeeEmployeeMenu ? (
                <Link href="/dashboard/karyawan" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                  Karyawan
                </Link>
              ) : null}
            </nav>

            <div className="flex items-center gap-3">
              {session ? (
                <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 md:flex">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  Masuk sebagai <span className="font-semibold text-slate-900">{displayName}</span>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-white"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                  >
                    Sign Up
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/75 px-4 py-2 text-sm text-slate-600 shadow-sm backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-slate-700" />
              BUMN profesional untuk kebutuhan data dan validasi teknis
            </div>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Insight yang tenang, presisi yang kuat, untuk keputusan yang lebih cepat.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              PT Surveyor Indonesia adalah badan usaha milik negara yang bergerak di bidang jasa survei,
              inspeksi, pengujian, dan konsultansi. Halaman ini dibuat seperti landing page startup modern,
              tetapi tetap membawa citra korporat yang bersih, profesional, dan tidak mencolok.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#profile"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Lihat profil perusahaan
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#capabilities"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
              >
                Layanan utama
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { value: '30+', label: 'Tahun pengalaman layanan teknis' },
                { value: '24/7', label: 'Dukungan proyek dan operasional' },
                { value: '1 platform', label: 'Untuk data, inspeksi, dan konsultansi' },
              ].map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur">
                  <div className="text-3xl font-semibold tracking-tight text-slate-950">{item.value}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[32px] bg-[radial-gradient(circle,_rgba(58,91,99,0.18),_transparent_68%)] blur-2xl" />
            <div className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="rounded-[28px] bg-[linear-gradient(180deg,_#f8faf9_0%,_#edf3f0_100%)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">Corporate Snapshot</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-950">Menghubungkan data lapangan dengan keputusan strategis</h2>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                    Siap diisi logo Anda
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {highlights.map((item) => {
                    const Icon = item.icon

                    return (
                      <div key={item.title} className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="profile" className="grid gap-6 pb-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[30px] border border-white/70 bg-white/85 p-8 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Profile Perusahaan</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950">
              Pendekatan tenang, hasil yang bisa dipertanggungjawabkan.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Dengan fokus pada jasa survei, inspeksi, pengujian, dan konsultansi, PT Surveyor Indonesia
              berperan membantu perusahaan dan institusi mendapatkan data yang valid, proses yang lebih efisien,
              dan keputusan yang lebih aman.
            </p>
          </div>

          <div id="capabilities" className="grid gap-4 sm:grid-cols-2">
            {capabilities.map((item) => (
              <div key={item} className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-slate-500">Capability</p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">{item}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Dirancang untuk mendukung kebutuhan korporasi yang butuh standar, presisi, dan dokumentasi yang rapi.
                </p>
              </div>
            ))}
          </div>
        </section>

        {canSeeEmployeeMenu ? (
          <section id="employees" className="rounded-[30px] border border-white/70 bg-slate-900 px-8 py-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.16)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Akses Karyawan</p>
                <h2 className="mt-2 text-2xl font-semibold">Menu ini hanya tampil untuk user dan admin</h2>
              </div>
              <Link
                href="/dashboard/karyawan"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-900 transition hover:bg-slate-100"
              >
                Buka dashboard akses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  )
}