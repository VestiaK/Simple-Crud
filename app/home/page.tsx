import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { verifyToken, type JwtPayload } from "../../lib/jwt";
import Image from "next/image";
import {FadeUp} from "../components/FadeUp"; 

type Session = JwtPayload & { name?: string };
type CookieStore = Awaited<ReturnType<typeof cookies>>;

const services = [
  {
    id: 1,
    title: "Testing",
    image: "/images/testing.webp",
    description: "TIC (Testing, Inspection, and Certification) Testing is a service designed to ensure the quality, safety, and compliance of products, materials, or systems with national and international standards. As part of the TIC process, testing is conducted using the latest methods and technology to evaluate reliability, performance, and regulatory compliance.",
  },
  {
    id: 2,
    title: "Inspection",
    image: "/images/inspection.webp",
    description: "Supervising and Ensuring the Conformity of Projects and Goods with Technical Standards. PT Surveyor Indonesia (PTSI) serves as a trusted independent institution, supporting both government and industry in ensuring conformity, controlling quality and quantity, and minimizing risks in every trade transaction.",
  },
  {
    id: 3,
    title: "Certification",
    image: "/images/certification.webp",
    description: "PT Surveyor Indonesia (PTSI) is one of the certification bodies that support companies in demonstrating their commitment to quality, environmental sustainability, occupational health and safety, social responsibility, and compliance with national and international regulations.",
  },
  {
    id: 4,
    title: "Consultation",
    image: "/images/consultation.webp",
    description: "PT Surveyor Indonesia (PTSI) provides end-to-end consultancy services designed to support companies and institutions in addressing industry challenges, enhancing operational efficiency, and ensuring compliance with both national and international regulations.",
  },
];

const advantages = [
  {
    title: "Trusted Partnership",
    description: "With transparent, accurate services and a 69% retention rate, we deliver fast, precise solutions that keep clients coming back.",
  },
  {
    title: "Customer Priority",
    description: "Focuses on your satisfaction with customized solutions and proactive service, ensuring results that exceed expectations.",
  },
  {
    title: "Customized Solutions",
    description: "A full range of strategic services, offering customized solutions to meet the diverse needs of our clients.",
  },
  {
    title: "Integrated Services",
    description: "Enhance sustainability and competitiveness in TIC with our integrated solutions in lab services, digital marketing, and e-Procurement.",
  },
];

async function getSession(): Promise<Session | null> {
  const cookieStore: CookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  try {
    return verifyToken(token) as Session;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const session = await getSession();
  const canSeeEmployeeMenu = session?.role === "USER" || session?.role === "ADMIN";
  const displayName = session?.name ?? session?.email ?? "Pengguna";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(37,150,190,0.12),_transparent_45%),linear-gradient(180deg,_#ffffff_0%,_#f2f6f9_100%)] text-slate-900 overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-16 pt-5 sm:px-8 lg:px-10">
        
        {/* NAVBAR */}
        <header className="sticky top-4 z-20 rounded-[28px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Logo PT Surveyor Indonesia"
                  fill
                  className="object-contain p-1.5"
                  sizes="56px"
                  priority
                />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2596be]">
                  PT Surveyor Indonesia
                </p>
                <p className="text-sm text-slate-500">
                  The markets we serve cover a wide range of service sectors.
                </p>
              </div>
            </div>

            <nav className="hidden items-center gap-7 lg:flex">
              <Link href="#about" className="text-sm font-medium text-slate-600 transition hover:text-[#2596be]">About Us</Link>
              <Link href="#services" className="text-sm font-medium text-slate-600 transition hover:text-[#2596be]">Services</Link>
              {canSeeEmployeeMenu ? (
                <Link href="/dashboard/karyawan" className="text-sm font-medium text-slate-600 transition hover:text-[#2596be]">Karyawan</Link>
              ) : null}
            </nav>

            <div className="flex items-center gap-3">
              {session ? (
                <>
                  <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm md:flex">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#2596be]" />
                    Masuk sebagai <span className="font-semibold text-slate-900">{displayName}</span>
                  </div>
                  <form action={async () => {
                    "use server";
                    const cookieStore = await cookies();
                    cookieStore.delete("token");
                    redirect("/");
                  }}>
                    <button type="submit" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600">
                      Logout
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-[#2596be]">Login</Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-[#2596be] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#1a7393]">
                    Sign Up <ArrowRight className="h-4 w-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        {/* SECTION 1: ABOUT US */}
        <section id="about" className="mt-12 py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <FadeUp delay={0}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-white/60 bg-white/40 shadow-sm">
                <Image
                  src="/images/3 orang.webp"
                  alt="Tentang PT Surveyor Indonesia"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </FadeUp>

            <FadeUp delay={200}>
              <div className="rounded-[32px] border border-white/70 bg-white/85 p-8 shadow-sm backdrop-blur sm:p-10">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#2596be]">Corporate Profile</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">About Us</h1>
                <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
                  <p>The markets we serve cover a wide range of service sectors. We are committed to delivering comprehensive survey, inspection, and consulting services to a broad spectrum of clients...</p>
                  <p>Our expertise spans a wide array of industries, encompassing manufacturing, government, regional development, oil and gas, mineral resources, certification systems, environmental management, agriculture, and outsourcing management.</p>
                  <p>With extensive experience and in-depth industry knowledge, we deliver tailored solutions designed to meet the unique needs of our clients, fostering sustainable growth and operational excellence.</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* SECTION 2: SERVICES */}
        <section id="services" className="py-12 lg:py-16">
          <FadeUp>
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                By Type / Innovative Products / For Clients
              </h2>
            </div>
          </FadeUp>

          <div className="grid gap-6 md:grid-cols-2">
            {services.map((item, index) => (
              <FadeUp key={item.id} delay={index * 150}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/85 shadow-sm backdrop-blur transition hover:border-[#2596be]/30 hover:shadow-md">
                  <div className="relative h-56 w-full border-b border-slate-100 bg-slate-50">
                    <Image
                      src={item.image}
                      alt={`Layanan ${item.title}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={item.id === 1 || item.id === 2}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <h3 className="text-xl font-semibold text-slate-950 transition-colors group-hover:text-[#2596be]">
                      {item.id}. {item.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* SECTION 3: WHY CHOOSE US */}
        <section id="why-choose-us" className="py-12 lg:py-16">
          <FadeUp>
            <div className="mb-12 rounded-[32px] border border-white/70 bg-white/60 p-8 text-center shadow-sm backdrop-blur sm:p-12">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Why Choose PT Surveyor Indonesia
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                <span className="block font-medium text-[#2596be]">The Advantage of Working with Us</span>
                With deep experience and full dedication, we deliver tailored solutions to help you overcome challenges and achieve long-term success.
              </p>
            </div>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {advantages.map((adv, index) => (
              <FadeUp key={adv.title} delay={index * 150}>
                <div className="h-full rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-sm transition hover:border-[#2596be]/20 hover:shadow-md">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#2596be] text-sm font-bold text-white shadow-sm">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">{adv.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{adv.description}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* SECTION 4: KARYAWAN ACCESS */}
        {canSeeEmployeeMenu ? (
          <FadeUp delay={200}>
            <section id="employees" className="mt-12 rounded-[30px] border border-white/40 bg-gradient-to-br from-[#2596be] to-[#1a7393] px-8 py-7 text-white shadow-lg">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/80">Akses Karyawan</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Menu ini hanya tampil untuk user dan admin</h2>
                </div>
                <Link href="/dashboard/karyawan" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#2596be] shadow-sm transition hover:bg-slate-50">
                  Buka dashboard akses <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>
          </FadeUp>
        ) : null}
      </div>
    </main>
  );
}