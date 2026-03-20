import Link from "next/link";
import Image from "next/image";
import { MapPin, Envelope, Phone, LinkedIn } from "@/components/ui/Icons";

const socialLinks = [
  { label: "LinkedIn", href: "#", icon: <LinkedIn className="w-3.5 h-3.5" /> },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-navy">
      {/* Brand stripe */}
      <div className="h-0.5 bg-brand" />

      <div className="container-page pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <Image
                src="/au-logo-dark-blue-horizontal.svg"
                alt="Adelaide University"
                width={160}
                height={38}
                className="h-9 w-auto brightness-0 invert"
              />
              <span className="block text-white/60 text-xs font-medium tracking-wider mt-2 uppercase">Program Roadmap</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Empowering students and prospective students to navigate their academic journey with clarity and confidence.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded border border-white/15 flex items-center justify-center text-white/50 hover:border-brand hover:text-brand hover:bg-brand/10 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white/90 font-semibold text-xs uppercase tracking-widest mb-5">Programs</h3>
            <ul className="space-y-3">
              {[
                { href: "/programs/bachelor-computer-science", label: "Computer Science" },
                { href: "/programs/master-data-science", label: "Data Science" },
                { href: "/programs/bachelor-business-information-systems", label: "Business IS" },
                { href: "/programs/master-artificial-intelligence", label: "Artificial Intelligence" },
                { href: "/programs", label: "All Programs" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white/90 font-semibold text-xs uppercase tracking-widest mb-5">Explore</h3>
            <ul className="space-y-3">
              {[
                { href: "/alumni", label: "Alumni Stories" },
                { href: "/industry", label: "Industry Partners" },
                { href: "/programs", label: "Program Finder" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/50 text-sm hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white/90 font-semibold text-xs uppercase tracking-widest mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm">North Terrace, Adelaide SA 5005</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Envelope className="w-4 h-4 text-brand flex-shrink-0" />
                <a href="mailto:info@programroadmap.edu.au" className="text-white/50 text-sm hover:text-white transition-colors">
                  info@programroadmap.edu.au
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand flex-shrink-0" />
                <a href="tel:+61883135208" className="text-white/50 text-sm hover:text-white transition-colors">
                  +61 8 8313 5208
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Adelaide University Program Roadmap. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/30">
            <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/70 transition-colors">Terms of Use</a>
            <Link href="/admin/login" className="hover:text-white/70 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
