import { Navbar } from '@/components/navbar';

function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="w-full">
      <Navbar />
      <section className='relative mx-auto mt-10 w-full max-w-8xl px-6 xl:px-14 2xl:px-0'>
        {children}
      </section>
    </main>
  );
}

export default AuthenticatedLayout;
