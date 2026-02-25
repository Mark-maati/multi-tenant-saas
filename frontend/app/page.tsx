import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white">
            <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex text-center mb-12">
                <div className="absolute top-0 flex w-full justify-center border-b border-gray-600 bg-gradient-to-b from-zinc-800 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-800/30 lg:p-4">
                    Built securely with standard RBAC, isolation algorithms, and a modern aesthetic.
                </div>
            </div>

            <div className="relative flex place-items-center mb-16 before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-emerald-400 before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-emerald-500 after:via-emerald-400 after:blur-2xl after:content-[''] before:dark:bg-emerald-800/20 after:dark:from-emerald-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight relative z-20 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                    Awesome SaaS Ecosystem
                </h1>
            </div>

            <div className="z-20 flex gap-4">
                <Button variant="default" size="lg" className="h-12 border border-zinc-500 bg-white text-black hover:bg-zinc-200 font-bold" asChild>
                    <Link href="/login">Launch Dashboard</Link>
                </Button>
                <Button variant="outline" size="lg" className="h-12 border-zinc-600 text-black hover:bg-zinc-100 font-bold" asChild>
                    <a href="https://github.com" target="_blank" rel="noreferrer">Source Code</a>
                </Button>
            </div>

        </main>
    );
}
